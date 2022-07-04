<template>
  <div class="flex flex-col px-1 pt-20 pb-80 overflow-y-auto h-[100%] w-[50%]">
    <div class="flex flex-row pl-2 italic bg-gray-100">
      <span>{{ title }}</span>
    </div>
    <div v-if="empty">
      <span class=" flex flex-row py-1 px-2 sm:text-xl items-center justify-center bg-gray-200"
      >{{ prompt }}</span>
    </div>
    <template v-if="grouped" v-for="section of sections" :key="section.key">
      <span class="text-center">{{ section.title }} {{ (flavor === 'nogos' ? '' : section.stats) }}</span>
      <template v-for="item of section.data" :key="item.word">
        <guess-row :guess="item" :removable="removable" :reveal="reveal" @delGuess="(ev) => $emit('delGuess', ev)" />
      </template>
    </template>
    <template v-else v-for="item of items" :key="item.word">
      <guess-row :guess="item" :removable="removable" :reveal="reveal" @delGuess="(ev) => $emit('delGuess', ev)" />
    </template>
    <div v-if="flavor === 'hints'" class="flex flex-row justify-center">
      <button class="px-6 py-1 mt-2 mx-3 italic text-2xl bg-red-100"  @click="() => $emit('resetMaybe')">Reset Roundel</button>
    </div>
  </div>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
//
import * as TY                          from '@/lib/types'
import GuessRow                         from '@/components/GuessRow.vue'
import { Roundel }                      from '@/lib'
//
export default defineComponent({
  name:         "GuessScroller",
  emits:        ['delGuess', 'resetMaybe'],
  components:   { GuessRow },
  props: {
    roundel:    { type: Object as PropType<TY.Roundel>,  required: true },
    items:      { type: Array  as PropType<TY.Guess[]>,  required: true },
    flavor:     { type: String,  required: true },
    grouped:    { type: Boolean, default: true },
    reveal:     { type: Number,  default: Infinity },
  },
  computed: {
    empty() { return _.isEmpty(this.items) },
    removable() { return /^(nogos|guesses)$/.test(this.flavor) },
    sections() {
      return Roundel.sectionListify(this.items, this.roundel)
    },
    title() { return _.startCase(this.flavor) },
    prompt() {
      const { flavor } = this
      if (flavor === 'nogos') {
        return `No bogons so far! Good Job!`
      } else if (flavor === 'guesses') {
        return `No guesses yet —— Tap check to add one`
      } else if (flavor === 'hints') {
        return `You've gotten all the words!`
      } else {
        return `Nothing here yet!`
      }
    },
  },
})
</script>
