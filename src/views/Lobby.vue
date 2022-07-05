<template>
  <teleport to="head"><title>Lexy.af by @mrflip</title></teleport>

  <div class="flex w-5xl relative">
    <div class="flex flex-col mt-12 w-full justify-center">
      <div class="flex flex-row px-3 my-1 items-center justify-center">
        <h1 class="px-2 pt-3 pb-2 text-center text-xl xs:text-xl sm:text-3xl leading-6 font-medium text-gray-900 transparent">
          Roundel
        </h1>
      </div>

      <div class="flex flex-col w-lg text-lg justify-center items-center">
        <div class="relative flex w-full py-5 items-center">
          <hr class="flex-grow border-t border-blue-400" />
          <h2 class="bold text-xl mx-3 mb-1">Select your Player Name</h2>
          <hr class="flex-grow border-t border-blue-400" />
        </div>
        <template v-for="player of players" key="player.key">
          <div class="flex flex-row items-center justify-center">
            <button v-if="allowDeletes" @click="() => maybeDelPlayerID(player.id)" class="h-8 w-8 ml-4 text-red-800"><x-circle-icon /></button>
            <button
              class="flex text-2xl flex-row w-60 px-6 py-2 my-2 bg-purple-50"
              @click="() => navToPlayer({ playerID: player.id })"
            >
              {{ player.id }}
            </button>
            <span v-if="allowDeletes" class="h-8 w-8 mr-4">&nbsp;</span>
          </div>
        </template>
      </div>

      <div class="flex flex-col w-lg justify-center items-center">
        <div class="relative flex w-full py-5 items-center">
          <hr class="flex-grow border-t border-blue-400" />
          <h2 class="bold text-xl mx-3 mb-1">...or create a new one</h2>
          <hr class="flex-grow border-t border-blue-400" />
        </div>
        <div class="flex flex-row px-3 my-1 items-center justify-center">
          <span class="w-16 md:w-20">&nbsp;</span>
          <input
            class="px-2 mx-2 h-10 w-[8rem] xs:w-[14rem] sm:w-[18rem] text-xl bg-violet-50 border border-violet-md rounded-md placeholder:italic placeholder:text-slate-400 box-border"
            ref="playerID"
            :id="playerID"
            :name="playerID"
            :v-model="playerID"
            @input="setPlayerID(($event.target as any).value)"
            @keyup.enter="() => navToPlayer({ playerID })"
            placeholder="type your name"
          />
          <button
            @click="() => navToPlayer({ playerID })"
            class="submit w-16 md:w-20 h-10 py-1 items-center border rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 box-border"
            :disabled="(! validPlayerID)"
          >
            {{ validPlayerID ? 'Log In' : '' }}
          </button>
          {{ playerID }}
        </div>
      </div>

      <div class="flex flex-col w-lg justify-center items-center">
        <CheckOption
          id="allowDeletes"
          class="my-2"
          :checked="allowDeletes" @change="updateAllowDeletes"
        >
          Edit Players List
        </CheckOption>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
// import { onBeforeRouteUpdate, useRouter, RouteLocationNormalized } from 'vue-router'
// import Modal from '@kouts/vue-modal'
// import '@kouts/vue-modal/dist/vue-modal.css'
import {
  XCircleIcon,
}                                       from "@heroicons/vue/outline"
//
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'
import CheckOption                      from '@/components/CheckOption.vue'
//
const { Player, loadGlobals, storeGlobals } = Lib

export interface RoundelParams { playerID: string }

export default defineComponent({
  components: {
    XCircleIcon, CheckOption,
  },
  props: {
    wtfVue:   { type: String as PropType<string>, default: 'this is needed or it effs up typescript' },
  },
  data() {
    const playerID: string = ''
    const globals = loadGlobals()
    const { playerIDs } = globals
    //
    const players = _.map(playerIDs, (id) => (new Player(id)))
    //
    const data = {
      playerID,
      players,
      allowDeletes: false,
    }
    return data
  },

  // async beforeRouteUpdate(newRoute: RouteLocationNormalized) {
  //   return true
  // },

  computed: {
    validPlayerID() {
      return Player.validID(this.playerID)
    },
  },

  methods: {
    setPlayerID(idStr: string) {
      const playerID = Player.normID(idStr)
      this.playerID = playerID
      // @ts-ignore
      this.$refs.playerID.value = playerID
    },

    maybeDelPlayerID(targetID: string) {
      if (confirm(`Really remove player '${targetID}'?`)) {
        this.players = _.filter(this.players, (player) => (! player.matchesID(targetID)))
        this.storeGlobals()
      }
    },

    navToPlayer({ playerID }: { playerID: string }) {
      this.setPlayerID('')
      const player = this.addPlayer(playerID)
      this.$router.push({ name: 'roundels', params: this.completeParams({ playerID: player.id }) })
    },

    storeGlobals() {
      storeGlobals({ playerIDs: _.map(this.players, 'id') })
    },

    addPlayer(playerID: string) {
      const existing = _.find(this.players, (py) => py.matchesID(playerID))
      if (existing) { return existing }
      const player = new Player(playerID)
      this.players = [player].concat(this.players)
      this.storeGlobals()
      return player
    },

    updateAllowDeletes(event: Event) {
      this.allowDeletes = (<HTMLInputElement>event.target)?.checked || false
    },

    completeParams(overrides: Partial<RoundelParams> = {}) {
      // @ts-ignore
      return _.merge({}, this.$route.params, overrides)
    },
  },

})
</script>
