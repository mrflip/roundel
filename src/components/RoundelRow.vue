<template>
<button
  class="roundel-row mb-2 mx-2 w-full py-2 pl-2 h-10 flex m-auto items-center justify-start border border-transparent rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
>
  <span class="w-28             xs:w-32                         ">{{ title }}</span>
  <span class="w-4       hidden xs:inline-block      text-center">{{ roundel.ol ? '•' : '&nbsp;' }}</span>
  <span class="w-20             xs:pl-3 xs:w-24 px-1 text-left ">{{ roundel.dt }}</span>
  <span class="w-16             xs:pr-3         px-1 text-right">{{ roundel.cp || '-' }}/{{ roundel.cpx || '-' }}</span>
  <span class="w-20 ml-1 hidden sm:inline-block pr-3 text-right">{{ roundel.fp || '-' }}/{{ roundel.fpx || '-' }}</span>
  <span class="w-20 ml-1 hidden xs:inline-block pr-5 text-right">{{ roundel.fw || '-' }}/{{ roundel.fwx || '-' }}</span>
  <span class="w-24 ml-1 hidden sm:inline-block pl-2 text-left " v-if="roundel.up">{{ roundel.up }}</span>
  <span class="w-24 ml-1 hidden sm:inline-block pl-2 text-center text-gray-500" v-else>--</span>
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
  .roundel-row span, .roundel-row button { border: 0px solid #ccddee; box-sizing: border-box; }
</style>
