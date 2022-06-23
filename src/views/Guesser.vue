<template>
  <div class="flex w-5xl relative">
    <div class="flex flex-row px-2 pt-3 pb-2 justify-between items-center absolute inset-x-0 top-0 bg-gray-100/75 backdrop-blur-sm z-50">
      <button @click="goToRoundles" class="w-20 sm:w-[12rem]">
        <SparklesIcon class="h-12" />
      </button>
      <h1 class="text-center text-xl xs:text-2xl sm:text-3xl leading-6 font-medium text-gray-900">
        {{ roundel.dashedLetters }}
      </h1>
      <template v-if="hintsOn">
        <div class="flex flex-row h-full items-center w-32 sm:w-[14rem] justify-between">
          <button class="px-2 py-1 sm:px-4 text-2xl bg-gray-400"  @click="decrReveal">-</button>
          <span   class="px-2 py-1 sm:px-4 text-2xl text-center">{{ reveal }}</span>
          <button class="px-2 py-1 sm:px-4 text-2xl bg-gray-400" @click="incrReveal">+</button>
          <EyeOffIcon @click="hideHints" class="h-12 w-12 ml-1 sm:ml-4" />
        </div>
      </template>
      <template v-else>
        <div class="flex flex-row h-full items-center w-28 sm:w-[12rem] justify-end">
          <EyeIcon    @click="showHints" class="h-12" />
        </div>
      </template>
    </div>

    <div class="flex flex-row w-full relative h-screen">
      <GuessScroller :roundel="roundel" :items="roundel.gooduns" class="absolute left-0"  flavor="guesses" />
      <GuessScroller :roundel="roundel" :items="roundel.nogos" v-show="(! hintsOn)" class="absolute right-0" flavor="nogos"  @delGuess="delGuess" />
      <GuessScroller :roundel="roundel" :items="roundel.hints" v-show="hintsOn" class="absolute right-0" flavor="hints" :reveal="reveal" />
    </div>

    <GuessConsole :roundel="roundel" @addGuess="addGuess" />

  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, PropType, ref, toRefs, watch }            from 'vue'
import { onBeforeRouteUpdate, useRouter, RouteLocationNormalized }  from 'vue-router'
import {
  EyeIcon, EyeOffIcon, SparklesIcon,
}                                       from "@heroicons/vue/outline"
//
import * as TY                          from '@/lib/types'
import GuessConsole                     from '@/components/GuessConsole.vue'
import GuessRow                         from '@/components/GuessRow.vue'
import GuessScroller                    from '@/components/GuessScroller.vue'
import * as Lib                         from '@/lib'

const { Guess, Roundel, storeRoundel, loadRoundel } = Lib

interface GuesserParams {
  letters:      string
}

export default defineComponent({
  components: { GuessRow, GuessConsole, GuessScroller, EyeIcon, EyeOffIcon, SparklesIcon },
  props: {
    playerID:    { type: String as PropType<string>,     default: 'flip' },
    letters:     { type: String as PropType<string>,     required: true },
  },
  data() {
    const roundel = Roundel.from(loadRoundel({ letters: this.letters }))
    console.log('data', roundel)
    const hintsOn = false
    const reveal = 0
    return {
      roundel,
      hintsOn,
      reveal,
    }
  },

  async beforeRouteUpdate(newRoute: RouteLocationNormalized) {
    return true
  },

  computed: {
    letterSets() {
    },
    revHints() {
      return _.reverse([...this.roundel.hints])
    },
  },

  // async
  // mounted() {
  // },

  methods: {
    incrReveal() { this.reveal += 1 },
    decrReveal() { this.reveal -= 1 },
    hideHints() {
      console.log('hideHints', this.reveal, this.hintsOn)
      this.reveal  = 0
      this.hintsOn = false
    },
    showHints() {
      console.log('showHints', this.reveal, this.hintsOn)
      this.reveal  = 0
      this.hintsOn = true
    },
    addGuess(word: string) {
      console.log('Guesser addGuess', word)
      this.roundel.addGuess(word)
      console.log(this.roundel)
      this.storeRoundel()
    },
    delGuess(word: string) {
      console.log('Guesser delGuess', word)
      this.roundel.delGuess(word)
      this.storeRoundel()
    },
    storeRoundel() {
      storeRoundel(this.roundel)
    },
    goToRoundles() {
      this.$router.push({ name: 'roundels', params: _.pick(this.completeParams(), ['playerID']) })
    },
    completeParams(overrides: Partial<GuesserParams> = {}) {
      // @ts-ignore
      return _.merge({}, this.$route.params, overrides)
    },
  },
})
</script>
