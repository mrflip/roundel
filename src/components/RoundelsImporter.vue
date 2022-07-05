<template>
  <div class="flex flex-col w-full items-center justify-start">
    <p>Paste a roundels export here to synchronize</p>
    <textarea
      v-model="importable"
      class="flex h-[40vh] w-full"
    >
    </textarea>
    {{ importable?.length }}
    <button
      class="flex text-2xl flex-row w-40 px-6 py-2 my-2 justify-center bg-purple-50"
      @click="importRoundelsJson(importable)"
    >
      Import
    </button>
    {{ message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'
//
const { importRoundelsJson } = Lib
//
export default defineComponent({
  name: "RoundelsImporter",
  props: {
    playerID:   { type: String, required: true },
  },

  data() {
    const importable = ''
    const message    = ''
    return {
      importable,
      message,
    }
  },

  methods: {
    importRoundelsJson(json: string) {
      if (! json) { this.message = 'Nothing to import, skipped'; return }
      try {
        const result = importRoundelsJson(this.playerID, json)
        const { imported, skipped, same } = result
        this.message = `Imported ${imported} new/updated roundels, ${same} unchanged, ${skipped} skipped`
      } catch (err) {
        alert(`Problem importing roundels: ${err.message}`)
        this.message = err.message
      }
    },
  }
})

</script>
