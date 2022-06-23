<template>
  <div class="flex flex-col px-1 pt-12 pb-48 overflow-y-auto h-[100%] w-[50%]">
    <div v-if="empty">
      <span class=" flex flex-row py-1 px-2 sm:text-xl items-center justify-center bg-gray-200"
      >{{ prompt }}</span>
    </div>
    <template v-else v-for="item of items" :key="item.word">
      <guess-row :guess="item" :removable="removable" @delGuess="(ev) => $emit('delGuess', ev)" />
    </template>
  </div>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
//
import * as TY                          from '@/lib/types'
import GuessRow                         from '@/components/GuessRow.vue'
//
export default defineComponent({
  name:         "GuessScroller",
  emits:        ['delGuess'],
  components:   { GuessRow },
  props: {
    items:      { type: Array  as PropType<TY.Guess[]>,  required: true },
    flavor:     { type: String, required: true },
  },
  computed: {
    empty() { return _.isEmpty(this.items) },
    removable() { return this.flavor === 'nogos' },
    prompt() {
      const { flavor } = this
      if (flavor === 'nogos') {
        return `No bogons yet! Good Job!`
      } else if (flavor === 'guesses') {
        return `No guesses yet! Tap check to add one`
      } else if (flavor === 'hints') {
        return `You've gotten all the words!`
      } else {
        return `Nothing here yet!`
      }
    },
  },
})
</script>
