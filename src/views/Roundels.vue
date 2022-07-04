<template>
  <div class="flex w-5xl relative">
    <div class="flex flex-col justify-center absolute inset-x-0 top-0 bg-gray-100/75 backdrop-blur-sm z-50">
      <h1 class="px-2 pt-3 pb-2 text-center text-xl xs:text-2xl sm:text-3xl leading-6 font-medium text-gray-900 transparent">
        Lexy Roundel
      </h1>
      <div class="flex flex-row px-3 mb-1">
        <component :is="sorting.icon" class="h-12 w-12" />
        <input
          class="px-2 mx-2 h-12 w-[24rem] text-xl bg-violet-50"
          ref="search"
          :id="search"
          :name="search"
          :v-model="search"
          @input="setSearch(($event.target as any).value)"
          @keyup.enter="() => navToGuesser({ letters: search })"
        />
        <button
          @click="() => navToGuesser({ letters: search })"
          class="submit w-12 md:w-16  py-1 border border-transparent rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          :disabled="(! attemptable)"
        >
          {{ attemptable ? 'Begin' : '' }}
        </button>
      </div>
      <div class="roundel-row flex flex-row text-center ml-3 px-2">
        <SortingHeader name="title"    class="w-36                             " :sorting="sorting" @setSortAxis="setSortAxis" />
        <span                          class="w-4">•</span>
        <SortingHeader name="date"     class="w-20                             " :sorting="sorting" @setSortAxis="setSortAxis" />
        <SortingHeader name="score"    class="w-16                             " :sorting="sorting" @setSortAxis="setSortAxis" />
        <SortingHeader name="points"   class="w-16 ml-1 hidden sm:inline-block " :sorting="sorting" @setSortAxis="setSortAxis" />
        <SortingHeader name="words"    class="w-16 ml-1 hidden xs:inline-block " :sorting="sorting" @setSortAxis="setSortAxis" />
        <SortingHeader name="played"   class="w-20 ml-2 hidden sm:inline-block " :sorting="sorting" @setSortAxis="setSortAxis" />
      </div>
    </div>
  </div>

  <div class="flex flex-row w-full relative h-screen">
    <div class="flex flex-col absolute px-1 pt-36 overflow-y-auto h-[100%] overflow-x-clip">
      <template v-for="roundel of roundels" :key="roundel.letters">
        <roundel-row @click="() => navToGuesser(roundel)" :roundel="roundel" />
      </template>
      <template v-for="row of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="row">
        <div class="h-20"></div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { onBeforeRouteUpdate, useRouter, RouteLocationNormalized } from 'vue-router'
import {
  PaperAirplaneIcon as TitleSortIcon, CalendarIcon as DateSortIcon,      BookOpenIcon as LastPlayedIcon,
  LightBulbIcon     as ScoreSortIcon, ScaleIcon    as MaxPointsSortIcon, HashtagIcon  as MaxWordsSortIcon,
}                                       from "@heroicons/vue/outline"
//
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'
import RoundelRow                       from '@/components/RoundelRow.vue'
import SortingHeader                    from '@/components/SortingHeader.vue'
//
const { Guess, Roundel, storeRoundel, loadRoundel, loadRoundels } = Lib

interface GuesserParams {
  playerID:     string
  letters:      string
}

const SortAxes = {
  'title':    { icon: 'TitleSortIcon',     dir: 'asc',  by: 'letters' },
  'Rtitle':   { icon: 'TitleSortIcon',     dir: 'desc', by: 'letters' },
  'date':     { icon: 'DateSortIcon',      dir: 'desc', by: 'dt' },
  'Rdate':    { icon: 'DateSortIcon',      dir: 'asc',  by: 'dt' },
  'played':   { icon: 'LastPlayedIcon',    dir: 'desc', by: ({ up }) => (up || '') },
  'Rplayed':  { icon: 'LastPlayedIcon',    dir: 'asc',  by: ({ up }) => (up ? up : '~~~') },
  'score':    { icon: 'ScoreSortIcon',     dir: 'desc', by: ({ cp, cpx, fp, fpx }) => (fp === fpx ? fp : (cp > 0 ? ((cp / cpx) * Math.sqrt(fp / fpx)) :  -1)) },
  'Rscore':   { icon: 'ScoreSortIcon',     dir: 'asc',  by: ({ cp, cpx, fp, fpx }) => (fp === fpx ? fp : (cp > 0 ? ((cp / cpx) * Math.sqrt(fp / fpx)) : 1e6)) },
  'points':   { icon: 'MaxPointsSortIcon', dir: 'desc', by: 'fpx' },
  'Rpoints':  { icon: 'MaxPointsSortIcon', dir: 'asc',  by: 'fpx' },
  'words':    { icon: 'MaxWordsSortIcon',  dir: 'desc', by: 'fwx' },
  'Rwords':   { icon: 'MaxWordsSortIcon',  dir: 'asc',  by: 'fwx' },
}

export default defineComponent({
  components: {
    RoundelRow, SortingHeader,
    TitleSortIcon, DateSortIcon, LastPlayedIcon, ScoreSortIcon, MaxPointsSortIcon, MaxWordsSortIcon,
  },
  props: {
    playerID:   { type: String as PropType<string | undefined>,     default: undefined },
    // bookmark:   { type: String as PropType<Bookmarker | undefined>, required: false, default: DEFAULT_BOOKMARK },
  },
  data() {
    const assetsLoadErr: (Error | null) = null as (Error | null)
    const refreshID   = Date.now()
    const attemptable = false
    const search: string = ''
    //
    const roundelsIndex = loadRoundels()
    console.log('roundelsIndex', roundelsIndex)
    const roundelDnas = _.mapValues(roundelsIndex, (sketch) => {
      const raw = loadRoundel({ ...sketch, letters: sketch.ll, datestr: sketch.dt })
      // @ts-ignore
      return raw.stored ? Roundel.from(raw) : raw
    })
    //
    const sortAxis = 'score'
    const sortRev  = false
    //
    const data = {
      assetsLoaded:         true,
      assetsLoadErr,
      refreshID,
      roundelDnas,
      search,
      attemptable,
      sortAxis,
      sortRev,
    }
    return data
  },

  async beforeRouteUpdate(newRoute: RouteLocationNormalized) {
    return true
  },

  computed: {
    roundels() {
      const charRe = new RegExp(`.*([${this.search.toLowerCase()}].*){${this.search.length},${this.search.length}}`)
      const sortAxis = (this.sortRev ? `R${this.sortAxis}` : this.sortAxis)
      const { icon, dir, by } = SortAxes[sortAxis]
      const filtered = _.filter(this.roundelDnas, ({ letters }) => charRe.test(letters))
      const roundels = _.orderBy(filtered, [by, 'up', 'dt'], [dir, 'desc', 'desc'])
      console.log(charRe, roundels.slice(0, 10))
      return roundels
    },
    sorting() {
      const baseSorting = SortAxes[this.sortAxis]
      const sg = { ...baseSorting, sortAxis: this.sortAxis, sortRev: this.sortRev }
      return sg
    },
  },

  async mounted() {
    try {
      // await loadAllIcons()
      this.assetsLoaded = true
    } catch (err) {
      this.assetsLoadErr = (err instanceof Error) ? err : new Error(`${err}`)
    }
  },

  methods: {
    navToGuesser(ev: { letters: string }) {
      const { letters } = ev
      if (! letters) { return }
      // @ts-ignore
      this.$router.push({ name: 'guesser', params: this.completeParams({ letters }) })
    },
    /* submitPlayerID(id: string) {
     *   this.playerID = id
     *   this.refreshID = Date.now()
     *   savePlayerID(id)
     * }, */
    completeParams(overrides: Partial<GuesserParams>) {
      // @ts-ignore
      return _.merge({}, this.$route.params, overrides)
    },

    setSearch(word: string) {
      // @ts-ignore
      const normed = Roundel.normalize(word)
      this.search = normed
      this.attemptable = Roundel.attemptable(normed)
      console.log(this.attemptable)
      // @ts-ignore
      this.$refs.search.value = normed
    },

    setSortAxis(newSorting: { sortAxis: string, sortRev: boolean }) {
      const { sortAxis, sortRev } = newSorting
      console.log('setSortAxis', sortAxis, sortRev)
      this.sortAxis = sortAxis
      this.sortRev  = sortRev
    },
  },

})
</script>
