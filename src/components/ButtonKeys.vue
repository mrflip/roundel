<template>
  <div class="button-keys flex m-auto items-center justify-center border border-transparent rounded-md shadow-sm text-sm font-medium bg-blue-100">

    <template v-for="[letter, idxCC] of lettersList" :key="letter">
      <button
        @click="() => this.$emit('insertLetter', letter)"
        :class="`ltr my-1 mx-2 w-10 py-2 px-2 h-10 flex m-auto items-center justify-center border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 ${idxCC}`"
      >
        {{ letter }}
      </button>
    </template>

    <button
      @click="() => this.$emit('delLetter')"
      class="bksp my-1 mx-2 w-10 py-2 px-2 h-10 flex m-auto items-center justify-center border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
    >
      &lt;-
    </button>

  </div>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent } from 'vue';
//
export default defineComponent({
  name: "ButtonKeys",

  props: {
    letters:   { type: String as PropType<string>,     required: true },
  },
  emits: ['insertLetter', 'delLetter'],
  //
  data() {
    const lettersList: string[] = _.map(this.letters.split(''), (ltr, idx) => [ltr, `ltr${idx}`])
    return {
      lettersList,
    }
  },
  methods: {
  },
})
</script>

<style>
  .button-keys .ltr0    { background: #F7DAF7; }
  .ltr                  { background: #F7F7F7; }
</style>
