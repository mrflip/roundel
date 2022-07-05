<template>
  <teleport to="head"><title>{{ playerID }}'s Roundels — Lexy.af by @mrflip</title></teleport>

  <div class="flex w-5xl relative">
    <div class="flex flex-col justify-center absolute inset-x-0 top-0 bg-gray-100/75 backdrop-blur-sm z-50">
      <div class="flex flex-row px-3 my-1 items-center justify-center">
        <button @click="showPlayerMenu = true">
          <h1 class="px-2 pt-3 pb-2 text-center text-xl xs:text-xl sm:text-3xl leading-6 font-medium text-gray-900 transparent">
            Roundel
          </h1>
        </button>
        <component @click="useNextAxis" :is="sorting.icon" class="h-10 w-10" :class="/R/.test(sortAxis) ? 'rotate-180' : ''" />
        <input
          class="px-2 mx-2 h-10 w-[8rem] xs:w-[14rem] sm:w-[18rem] text-xl bg-violet-50 border border-violet-md rounded-md placeholder:italic placeholder:text-slate-400 box-border"
          ref="search"
          :id="search"
          :name="search"
          :v-model="search"
          @input="setSearch(($event.target as any).value)"
          @keyup.enter="() => navToGuesser({ letters: search })"
          placeholder="type to search or add"
        />
        <button
          @click="() => navToGuesser({ letters: search })"
          class="submit w-16 md:w-20 h-10 py-1 items-center border rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 box-border"
          :disabled="(! attemptable)"
        >
          {{ attemptable ? 'Begin' : '' }}
        </button>
        {{ search }}
      </div>
      <div class="roundel-row pl-2 flex flex-row text-center justify-center">
        <SortingHeader name="title"    class="w-28             xs:w-32         " :sorting="sorting" @setSortAxis="setSortAxis" />
        <span                          class="w-4       hidden xs:inline-block ">•</span>
        <SortingHeader name="date"     class="w-20             xs:pl-3 xs:w-24 " :sorting="sorting" @setSortAxis="setSortAxis" />
        <SortingHeader name="score"    class="w-16             xs:pr-3         " :sorting="sorting" @setSortAxis="setSortAxis" />
        <SortingHeader name="points"   class="w-20 ml-1 hidden sm:inline-block " :sorting="sorting" @setSortAxis="setSortAxis" />
        <SortingHeader name="words"    class="w-20 ml-1 hidden xs:inline-block " :sorting="sorting" @setSortAxis="setSortAxis" />
        <SortingHeader name="played"   class="w-24 ml-1 hidden sm:inline-block " :sorting="sorting" @setSortAxis="setSortAxis" />
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full relative h-screen items-center justify-center">
    <div class="flex flex-col absolute pt-24 overflow-y-auto h-[100%] overflow-x-clip">
      <template v-for="roundel of roundels" :key="roundel.letters">
        <roundel-row @click="() => navToGuesser(roundel)" :roundel="roundel" />
      </template>
      <template v-for="row of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="row">
        <div class="h-20"></div>
      </template>
    </div>
  </div>

  <Modal
    v-model="showPlayerMenu"
    :title="`Options for Player ${playerID}`"
    modal-class="w-2xl max-w-2xl"
  >
    <PlayerMenu :playerID="playerID" @hidePlayerMenu="showPlayerMenu = false" />
  </Modal>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
import { onBeforeRouteUpdate, useRouter, RouteLocationNormalized } from 'vue-router'
import Modal from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'
import {
  PaperAirplaneIcon as TitleSortIcon, CalendarIcon as DateSortIcon,      BookOpenIcon as LastPlayedIcon,
  LightBulbIcon     as ScoreSortIcon, ScaleIcon    as MaxPointsSortIcon, HashtagIcon  as MaxWordsSortIcon,
}                                       from "@heroicons/vue/outline"
//
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'
import RoundelRow                       from '@/components/RoundelRow.vue'
import SortingHeader                    from '@/components/SortingHeader.vue'
import PlayerMenu                       from '@/components/PlayerMenu.vue'

const { Guess, Roundel, storeRoundel, loadRoundel, loadRoundels, storePrefs, loadPrefs } = Lib

interface GuesserParams {
  playerID:     string
  letters:      string
}

function sortByScore(sketch: TY.RoundelSketch, dir: 'asc' | 'desc') {
  const { cp = 0.5, cpx, fp = 0.5, fpx } = sketch
  // 100% complete, order by max pointts
  if (fp === fpx) { return fp }
  // not attempted, force to end
  if ((! cp) || (cp < 1)) { return (dir === 'desc' ? (-1e6 + cpx) : (1e6 + cpx)) }
  return (cp / cpx) * Math.sqrt(fp / fpx)
}

const SortAxes: { [key: string]: TY.RoundelSorting } = {
  'title':    { icon: 'TitleSortIcon',     dir: 'asc',  nextAxis: 'date',    by: 'letters' },
  'date':     { icon: 'DateSortIcon',      dir: 'desc', nextAxis: 'score',   by: 'dt' },
  'score':    { icon: 'ScoreSortIcon',     dir: 'desc', nextAxis: 'points',  by: (sk) => sortByScore(sk, 'desc') },
  'points':   { icon: 'MaxPointsSortIcon', dir: 'desc', nextAxis: 'words',   by: 'fpx' },
  'words':    { icon: 'MaxWordsSortIcon',  dir: 'desc', nextAxis: 'played',  by: 'fwx' },
  'played':   { icon: 'LastPlayedIcon',    dir: 'desc', nextAxis: 'Rtitle',  by: ({ up }) => (up || '') },
  'Rtitle':   { icon: 'TitleSortIcon',     dir: 'desc', nextAxis: 'Rdate',   by: 'letters' },
  'Rdate':    { icon: 'DateSortIcon',      dir: 'asc',  nextAxis: 'Rscore',  by: 'dt' },
  'Rscore':   { icon: 'ScoreSortIcon',     dir: 'asc',  nextAxis: 'Rpoints', by: (sk) => sortByScore(sk, 'asc') },
  'Rpoints':  { icon: 'MaxPointsSortIcon', dir: 'asc',  nextAxis: 'Rwords',  by: 'fpx' },
  'Rwords':   { icon: 'MaxWordsSortIcon',  dir: 'asc',  nextAxis: 'Rplayed', by: 'fwx' },
  'Rplayed':  { icon: 'LastPlayedIcon',    dir: 'asc',  nextAxis: 'title',   by: ({ up }) => (up ? up : '~~~') },
}

// https://medium.com/js-dojo/using-web-workers-vue-applications-3de99f4f3371

export default defineComponent({
  components: {
    RoundelRow, SortingHeader, Modal, PlayerMenu,
    TitleSortIcon, DateSortIcon, LastPlayedIcon, ScoreSortIcon, MaxPointsSortIcon, MaxWordsSortIcon,
  },
  props: {
    playerID:   { type: String as PropType<string>, required: true },
  },

  data() {
    //
    const prefs = loadPrefs(this.playerID)
    const { sortAxis, search } = prefs
    const attemptable = false
    //
    const roundelsIndex = loadRoundels()
    const roundelDnas = _.mapValues(roundelsIndex, (sketch) => {
      const raw = loadRoundel(this.playerID, { ...sketch, letters: sketch.ll, datestr: sketch.dt })
      // @ts-ignore
      return raw.stored ? Roundel.from(raw) : raw
    })
    //
    console.log('Loaded', this.playerID, sortAxis, search)
    //
    const data = {
      roundelDnas,
      sortAxis,
      search,
      attemptable,
      showPlayerMenu: false,
    }
    return data
  },

  computed: {
    roundels(): TY.Roundel[] {
      const charRe = new RegExp(`.*([${this.search.toLowerCase()}].*){${this.search.length},${this.search.length}}`)
      const { sortAxis } = this
      const { icon, dir, by } = SortAxes[sortAxis]
      const filtered = _.filter(this.roundelDnas, ({ letters }) => charRe.test(letters))
      const roundels = _.orderBy(filtered, [by, 'dt'], [dir, 'desc']) as TY.Roundel[]
      // console.log(charRe, roundels.slice(0, 10))
      return roundels
    },
    sorting() {
      const baseSorting = SortAxes[this.sortAxis]
      const sg = { ...baseSorting, sortAxis: this.sortAxis }
      return sg
    },
  },

  mounted() {
    this.$refs.search.value = this.search
  },

  methods: {
    navToGuesser(ev: { letters: string }) {
      const { letters } = ev
      if (! (letters && Roundel.attemptable(letters))) { return }
      if (letters === this.search) { this.setSearch('') }
      // @ts-ignore
      this.$router.push({ name: 'guesser', params: this.completeParams({ letters }) })
    },

    completeParams(overrides: Partial<GuesserParams>) {
      // @ts-ignore
      return _.merge({}, this.$route.params, overrides)
    },

    setSearch(word: string) {
      // @ts-ignore
      const normed = Roundel.normalize(word)
      this.search = normed
      this.attemptable = Roundel.attemptable(normed)
      // @ts-ignore
      this.$refs.search.value = normed
      this.storePrefs()
    },

    setSortAxis(newSorting: { sortAxis: string, sortRev: boolean }) {
      const { sortAxis, sortRev } = newSorting
      this.sortAxis = sortRev ? `R${sortAxis}` : sortAxis
      this.storePrefs()
    },

    prefs(): TY.RoundelPrefs {
      return { sortAxis: this.sortAxis, search: this.search }
    },

    storePrefs() {
      storePrefs(this.playerID, this.prefs())
    },

    useNextAxis() {
      this.setSortAxis({ sortAxis: this.sorting.nextAxis, sortRev: false })
    },
  },

})
</script>
