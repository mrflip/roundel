<template>
  <button @click="setSortAxis" :class="classes" class="p-1 flex flex-row items-center justify-center">
    {{ name }}&nbsp;
  </button>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
import {
  ChevronDownIcon as DescIcon, ChevronUpIcon as AscIcon,
}                                       from "@heroicons/vue/outline"
//
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'

const { Roundel } = Lib

// <component class="w-4 h-4" v-if="active" :is="`${sorting.dir}-icon`" />

export default defineComponent({
  name:     "SortingHeader",
  emits:    ['setSortAxis'],
  components: { 'desc-icon': DescIcon, 'asc-icon': AscIcon },
  props: {
    name:    { type: String, required: true },
    sorting: { type: Object, required: true },
  },
  computed: {
    classes() {
      const classes = []
      if (this.active) { classes.push('axis-active') }
      return classes
    },
    active() { return (this.name === this.sorting.sortAxis || `R${this.name}` === this.sorting.sortAxis) },
  },
  methods: {
    setSortAxis() {
      const sortRev = (this.active) ? (! /^R/.test(this.sorting.sortAxis)) : false
      this.$emit('setSortAxis', { sortAxis: this.name, sortRev })
    },
  },
})
</script>

<style scoped>
  .axis-active { background-color: #dde3dd; }
</style>
