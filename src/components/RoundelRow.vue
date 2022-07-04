<template>
<button
  class="roundel-row mb-2 mx-2 w-full py-2 px-2 h-10 flex m-auto items-center justify-start border border-transparent rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
>
  <span class="w-36                                       ">{{ title }}</span>
  <span class="w-4                              text-left ">{{ roundel.ol ? '•' : '' }}</span>
  <span class="w-20                             text-left ">{{ roundel.dt }}</span>
  <span class="w-16                             text-right">{{ roundel.cp || '-' }}/{{ roundel.cpx || '-' }}</span>
  <span class="w-16 ml-1 hidden sm:inline-block text-right">{{ roundel.fp || '-' }}/{{ roundel.fpx || '-' }}</span>
  <span class="w-16 ml-1 hidden xs:inline-block text-right">{{ roundel.fw || '-' }}/{{ roundel.fwx || '-' }}</span>
  <span class="w-20 ml-2 hidden sm:inline-block text-left " v-if="roundel.up">{{ roundel.up }}</span>
  <span class="w-24 ml-1 hidden sm:inline-block text-center text-gray-500" v-else>--</span>
</button>
</template>

<script lang="ts">
import _                           /**/ from 'lodash'
import { defineComponent, PropType }    from 'vue'
//
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'

const { Roundel } = Lib

export default defineComponent({
  name: "RoundelRow",
  props: {
    roundel:    { type: Object as PropType<TY.Roundel>,  required: true },
  },
  data() {
    const title = Roundel.dispLtrs(this.roundel.letters)
    return {
      title,
    }
  },
})
</script>

<style>
  .roundel-row span { border: 0px solid #ccddee; box-sizing: border-box; }
</style>
