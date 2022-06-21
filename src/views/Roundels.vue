<template>
  <h1 class="mx-4 mt-4 mb-2 text-center text-lg leading-6 font-medium text-gray-900">
    Lexy Roundel
  </h1>


  <template v-for="roundelDNA of roundelDNAs" :key="roundelDNA.letters">
    <roundel-row @click="() => navToGuesser(roundelDNA)" >roundelDNA</roundel-row>
  </template>

</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { onBeforeRouteUpdate, useRouter, RouteLocationNormalized } from 'vue-router'

import RoundelRow           from '@/components/RoundelRow.vue'

//

interface GuesserParams {
  playerID:     string
  letters:      string
}

interface Roundel {
  letters:      string
  words:        string[]
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
    }
    console.log(this.playerID, data)
    return data
  },

  async beforeRouteUpdate(newRoute: RouteLocationNormalized) {
    return true
  },

  computed: {
    roundelDNAs() {
      return [
        { letters: 'EIANRTD' },
        { letters: 'AIDGNPR' },
        { letters: 'AIOUFNT' },
      ]
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
  },

})
</script>
