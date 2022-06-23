<template>
  <div class="flex w-5xl relative">
    <div class="flex flex-row px-2 pt-3 pb-2 justify-center absolute inset-x-0 top-0 bg-gray-100/75 backdrop-blur-sm z-50">
      <h1 class="text-center text-xl xs:text-2xl sm:text-3xl leading-6 font-medium text-gray-900">
        Lexy Roundel
      </h1>
    </div>
  </div>

  <div class="flex flex-row w-full relative h-screen">
    <div class="flex flex-col absolute px-1 pt-20 pb-80 overflow-y-auto h-[100%]">
      <template v-for="roundel of roundels" :key="roundel.letters">
        <roundel-row @click="() => navToGuesser(roundel)" :roundel="roundel" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { onBeforeRouteUpdate, useRouter, RouteLocationNormalized } from 'vue-router'
//
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'
import roundelDnas                      from '../../data/roundels.json'
import RoundelRow                       from '@/components/RoundelRow.vue'
//
const { Guess, Roundel, storeRoundel, loadRoundel } = Lib

interface GuesserParams {
  playerID:     string
  letters:      string
}

export default defineComponent({
  components: { RoundelRow },
  props: {
    playerID:   { type: String as PropType<string | undefined>,     default: undefined },
    // bookmark:   { type: String as PropType<Bookmarker | undefined>, required: false, default: DEFAULT_BOOKMARK },
  },
  data() {
    const assetsLoadErr: (Error | null) = null as (Error | null)
    // const playerID  = 'flip' // new URLSearchParams(window.location.search).get('playerID') || getSavedPlayerID() || ''
    const refreshID = Date.now()
    const search:   string = ''
    //
    const data = {
      assetsLoaded:         true,
      assetsLoadErr,
      refreshID,
      // playerID,
      search,
      // params:           this.$route.params,
      roundelDnas: roundelDnas,
    }
    console.log(this.playerID, data)
    return data
  },

  async beforeRouteUpdate(newRoute: RouteLocationNormalized) {
    return true
  },

  computed: {
    roundels() {
      const roundels = _.map(this.roundelDnas, ([letters, datestr]) => {
        const raw = loadRoundel({ letters, datestr })
        return raw.stored ? Roundel.from(raw) : raw
      })
      console.log(roundels.slice(0, 30))
      return roundels
    }
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
  },

})
</script>
