<template>
  <div class="guess-row flex flex-row py-1 px-2 sm:text-xl items-center" :class="rowClasses">
    <span class="w-5 text-right">{{ guess.score }}</span>
    <span class="ml-1.5 w-full">{{ text }}</span>
    <span v-if="removable" @click="delGuess" class="h-5 w-5 text-gray-400"><x-circle-icon /></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { XCircleIcon }                  from "@heroicons/vue/outline"
//
export default defineComponent({
  name: "GuessRow",
  components: { 'x-circle-icon': XCircleIcon },
  emits:        ['delGuess'],
  props: {
    guess: { type: Object, required: true },
    removable: { type: Boolean, default: true },
    reveal:    { type: Number,  default: 1 },
  },
  computed: {
    rowClasses() {
      return this.guess.flavor
    },
    text() {
      // if (! this.masked) { return this.guess.word }
      return this.guess.revealed(this.reveal)
    },
  },
  methods: {
    delGuess() {
      console.log('GuessRow delGuess', this.guess.word)
      this.$emit('delGuess', this.guess.word)
    },
  },
})
</script>

<style>
  .guess-row.bogon            { background-color: #eecccc; }
  .guess-row.nomain           { background-color: #eedddd; }
  .guess-row.pang             { background-color: #ddddee; }
  .guess-row.comn             { background-color: #b1d9a7; }
  .guess-row.obsc             { background-color: #d2ebd2; }
  .guess-row.shorty           { background-color: #e2dddd; }
  /* entryValid:    { background-color:   '#ccf0df'; }
     entryObsc: { background-color:   '#ddebdd'; }
     entryOther:    { background-color:   '#eee';  }
     entryBad:      { background-color:   '#eedddd'; }
     entryPang:  { background-color:   '#ddddee' }
     clearEntry:    { color: "#c8c8c8" },
   */
</style>
