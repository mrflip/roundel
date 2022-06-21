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
    ref="word"
    :id="word"
    :name="word"
    :v-model="word"
    @input="setWord(($event.target as any).value)"
    class="p-2 text-sm w-[16rem] xs:w-[24rem] sm:w-64 md:w-40 order-3 md:order-first bg-violet-50"
  />
  {{ word }} {{ normedWord }}
  <button
    @click="() => $emit('submitWord')"
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
import RoundelLib                       from '@/lib/Roundel'
import Guess                            from '@/lib/Guess'
import * as TY                          from '@/lib/types'

/* :value="normedWord"
   @input="setWord(($event.target as any).value)"
   @change="setWord(($event.target as any).value)"
   @keyup.enter="() => submitWord()" */

const Roundel: any = RoundelLib

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
    const word = ''
    const dashedLetters: string = `${letters.slice(0, 1)}-${letters.slice(1)}`
    const gooduns: TY.Guess[] = []
    const bogons:  TY.Guess[] = []
    const missing: TY.Guess[] = []
    const roundel = new Roundel(letters)
    return {
      word,
      dashedLetters,
      gooduns,
      bogons,
      missing,
      roundel,
      forceUpdate: Date.now(),
    }
  },

  async beforeRouteUpdate(newRoute: RouteLocationNormalized) {
    return true
  },

  computed: {
    letterSets() {
    },
    normedWord: { get() { return this.word }, set(val) { this.$emit('setWord', val) } },
  },

  methods: {
    setWord(word: string) {
      console.log('setWord', word, this.roundel.normEntry(word), this.roundel)
      const normed = this.roundel.normEntry(word)
      this.word = normed
      this.forceUpdate = Date.now()
      this.$refs.word.value = normed
      console.log(this.word, normed, word, this.$refs.word)
    },
    insertLetter(letter: string) {
      console.log('insertLetter', letter)
      this.setWord(this.word + letter.toLowerCase())
    },
    delLetter() {
      console.log('delLetter')
      this.word = this.word.slice(0, -1)
    },
    submitWord() {
      const guess = new Guess(this.word, this.roundel)
      this.gooduns.push(guess)
      this.word = ''
    }
  },

})
</script>
