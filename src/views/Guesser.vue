<template>
  <div class="flex w-5xl relative">
    <div class="px-2 pt-3 pb-2 absolute inset-x-0 top-0 bg-gray-100/75 backdrop-blur-sm z-50">
      <h1 class="text-center text-xl xs:text-2xl sm:text-3xl leading-6 font-medium text-gray-900">
        {{ roundel.dashedLetters }}
      </h1>
    </div>

    <div class="flex flex-row w-full relative h-screen">
      <GuessScroller :roundel="roundel" :items="roundel.gooduns" class="absolute left-0"  flavor="guesses" />
      <GuessScroller :roundel="roundel" :items="roundel.nogos"   @delGuess="delGuess" class="absolute right-0" flavor="nogos" />
    </div>

    <GuessConsole :roundel="roundel" @addGuess="addGuess" />

  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, PropType, ref, toRefs, watch }            from 'vue'
import { onBeforeRouteUpdate, useRouter, RouteLocationNormalized }  from 'vue-router'
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
  components: { GuessRow, GuessConsole, GuessScroller },
  props: {
    playerID:    { type: String as PropType<string>,     default: 'flip' },
    letters:     { type: String as PropType<string>,     required: true },
  },
  data() {
    const roundel = loadRoundel(this.letters)
    return {
      roundel,
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
    addGuess(word) {
      console.log('Guesser addGuess', word)
      this.roundel.addGuess(word)
      console.log(this.roundel)
      this.storeRoundel()
    },
    delGuess(word) {
      console.log('Guesser delGuess', word)
      this.roundel.delGuess(word)
      this.storeRoundel()
    },
    storeRoundel() {
      storeRoundel(this.roundel)
    },
  },
})
</script>
