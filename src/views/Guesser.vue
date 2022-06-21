<template>
  <h1 class="mx-4 mt-4 mb-2 text-center text-lg leading-6 font-medium text-gray-900">
    Guessing: {{ dashedLetters }}
  </h1>

  <div class="max-w-5xl 2xl:max-w-7xl w-full px-4 pb-6 xl:px-0 mx-auto">
    {{ letters }}
  </div>

  {{ Object.keys(roundel) }}
  {{ roundel.guesses }}

  <input
    :id="guess"
    :name="guess"
    class="p-2 text-sm w-[16rem] xs:w-[24rem] sm:w-64 md:w-40 order-3 md:order-first bg-violet-50"
    :value="guess"
    @input="this.setGuess(($event.target as any).value)"
    @keyup.enter="() => submitGuess()"
  />
  <button
    @click="() => this.$emit('submitGuess')"
    class="submit my-1 mx-2 w-10 py-2 px-2 h-10 flex m-auto items-center justify-center border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
  >
    Guess!
  </button>

  <ButtonKeys :letters="letters" @insert-letter="insertLetter" @del-letter="delLetter" />
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, PropType, ref, toRefs, watch }            from 'vue'
import { onBeforeRouteUpdate, useRouter, RouteLocationNormalized }  from 'vue-router'
import ButtonKeys                       from '@/components/ButtonKeys.vue'
import Roundel                          from '@/lib/Roundel.js'

interface GuesserParams {
  letters:      string
}

export default defineComponent({
  components: { ButtonKeys },
  props: {
    playerID:    { type: String as PropType<string>,     default: 'flip' },
    letters:     { type: String as PropType<string>,     required: true },
  },
  data() {
    const { letters } = this
    const guess = ''
    const dashedLetters: string = `${letters.slice(0, 1)}-${letters.slice(1)}`
    const gooduns = []
    const bogons = []
    const missing = []
    const roundel = new Roundel(letters)
    return {
      guess,
      dashedLetters,
      gooduns,
      bogons,
      missing,
      roundel,
    }
  },

  async beforeRouteUpdate(newRoute: RouteLocationNormalized) {
    return true
  },

  computed: {
    letterSets() {
    },
  },

  methods: {
    setGuess(guess) {
      console.log('setGuess', guess, this.roundel.normEntry(guess), this.roundel)
      this.guess = this.roundel.normEntry(guess.toLowerCase())
    },
    insertLetter(letter) {
      console.log('insertLetter', letter)
      this.setGuess(this.guess + letter.toLowerCase())
    },
    delLetter() {
      console.log('delLetter')
      this.guess = this.guess.slice(0, -1)
    },
    submitGuess() {
      this.gooduns.push({ word: this.guess, score: 2 })
      this.guess = ''
    }
  },

})
</script>
