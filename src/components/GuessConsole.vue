<template>
  <div class="p-2 sm:py-3 justify-center items-center absolute bottom-0 inset-x-0 bg-gray-200/90 backdrop-blur-sm z-50">
    <div class="flex flex-row md:px-2 px-1 justify-center items-center m-auto">
      <button
        @click="delLetter"
        class="bksp w-12 sm:w-12 md:w-16 py-1 border border-transparent rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
      >
        <BackspaceIcon class="h-full" />
      </button>
      <input
        class="py-1 px-2 mx-3 md:mx-5 w-full text-2xl xs:text-3xl sm:text-4xl bg-violet-50"
        ref="word"
        :id="word"
        :name="word"
        :v-model="word"
        @input="setWord(($event.target as any).value)"
        @keyup.enter="addGuess"
      />
      <button
        @click="addGuess"
        class="submit w-12 sm:w-12 md:w-16 py-1 border border-transparent rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
      >
        <CheckIcon class="h-full" />
      </button>
    </div>

    <div class="button-keys flex mt-2 md:px-4 m-auto items-center justify-between align-middle text-center ">
      <template v-for="[letter, idxCC] of indexedLtrs" :key="letter">
        <button
          @click="() => insertLetter(letter)"
          class="w-full mx-1.5 sm:mx-2 md:mx-3 max-w-24 text-3xl xs:text-4xl sm:text-5xl h-14 sm:h-20  border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          :class="`ltr ltr${idxCC}`"
        >
          {{ letter }}
        </button>
      </template>
    </div>

  </div>

</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
import { CheckIcon, BackspaceIcon }     from "@heroicons/vue/outline"
//
import * as TY                          from '@/lib/types'
import ButtonKeys                       from '@/components/ButtonKeys.vue'
//
export default defineComponent({
  name:         "GuessConsole",
  components:  { CheckIcon, BackspaceIcon, ButtonKeys },
  props: {
    roundel:    { type: Object as PropType<TY.Roundel>,  required: true },
  },
  emits: ['addGuess'],
  //
  data() {
    const word = ''
    return {
      word,
    }
  },
  computed: {
    indexedLtrs() { return this.roundel.upltrs.map((ltr, idx) => [ltr, idx]) },
  },

  mounted() {
    this.$refs.word.focus()
  },

  methods: {
    setWord(word: string) {
      const normed = this.roundel.normEntry(word)
      this.word = normed
      this.$refs.word.value = normed
    },
    insertLetter(letter: string) {
      console.log('insertLetter', letter)
      this.setWord(this.word + letter.toLowerCase())
    },
    delLetter() {
      console.log('delLetter')
      this.word = this.word.slice(0, -1)
    },
    clearWord() {
      this.setWord('')
    },
    addGuess() {
      console.log('addGuess', this.word)
      this.$emit('addGuess', this.word)
      this.clearWord()
    },
  },
})
</script>

<style>
  .button-keys .ltr0    { background: #F7DAF7; }
  .ltr                  { background: #F7F7F7; }
</style>
