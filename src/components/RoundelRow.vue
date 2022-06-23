<template>
<button
  class="my-1 mx-2 w-full py-2 px-2 h-10 flex m-auto items-center justify-start border border-transparent rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
>
  <span class="w-32">{{ title }}</span>
  <span class="text-left">{{ this.roundel.updatedAt }} {{ this.roundel.summary?.('comn') }}</span>
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
