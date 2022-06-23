<template>
  <div class="button-keys flex my-2 md:px-4 m-auto items-center justify-between align-middle text-center ">

    <template v-for="[letter, idxCC] of letters.map((ltr, idx) => [ltr, idx])" :key="letter">
      <button
        @click="() => $emit('insertLetter', letter)"
        class="w-full mx-1.5 sm:mx-2 md:mx-3 text-3xl xs:text-4xl sm:text-5xl max-w-24 md:text-6xl h-14 sm:h-20 md:h-24 border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        :class="`ltr ltr${idxCC}`"
      >
        {{ letter }}
      </button>
    </template>

  </div>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
//
export default defineComponent({
  name: "ButtonKeys",
  props: {
    letters:   { type: Array as PropType<string[]>,     required: true },
  },
  emits: ['insertLetter'],
})
</script>

<style>
  .button-keys .ltr0    { background: #F7DAF7; }
  .ltr                  { background: #F7F7F7; }
</style>
