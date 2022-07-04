<template>
  <button @click="setSortAxis" :class="classes" class="p-1">{{ name }}</button>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
//
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'

const { Roundel } = Lib

export default defineComponent({
  name:     "SortingHeader",
  emits:    ['setSortAxis'],
  props: {
    name:    { type: String, required: true },
    sorting: { type: Object, required: true },
  },
  computed: {
    classes() {
      const classes = []
      if (this.name === this.sorting.sortAxis) { classes.push('axis-active') }
      return classes
    },
  },
  methods: {
    setSortAxis() {
      const sortRev = (this.name === this.sorting.sortAxis) ? (! this.sorting.sortRev) : false
      this.$emit('setSortAxis', { sortAxis: this.name, sortRev })
    },
  },
})
</script>

<style scoped>
  .axis-active { background-color: #eeccdd; }
</style>
