<template>
  <tabs
    :options="{ useUrlFragment: false, defaultTabHash: 'grouping_tab' }"
    nav-class="tab-nav border-b-2 flex 2xl:px-32 flex-row mt-4 mb-2 md:items-stretch items-center justify-around"
    nav-item-class="tabs-nav grow flex py-2"
    nav-item-link-class="tabs-tab-nav flex w-full justify-center text-center"
    nav-item-active-class="tab-is-active bg-violet-200"
    nav-item-disabled-class="bg-red"
    panels-wrapper-class="min-h-[400px] tabs-panels"
  >
    <tab id="about_tab" name="About" class="mb-4 flex flex-col items-center justify-start Aspects ordering" :selected="true">
      <div class="flex flex-col">
        <p class="mt-2 mb-4">
          Lexy Roundels by @mrflip, Based on the NYT Spelling Bee.
        </p>
        <a href="/#/">
          <span class="flex w-80% px-4 py-3 my-2 text-lg justify-center bg-blue-300">Visit Lobby to Change Players</span>
        </a>
        <button @click="$emit('hidePlayerMenu')" class="flex w-80% px-4 py-3 my-2 text-lg justify-center bg-gray-300">Return to Menu</button>
      </div>
    </tab>
    <tab id="import_tab" name="Import" class="flex flex-col items-center justify-start" :selected="true">
      <RoundelsImporter
        :playerID="playerID"
      />
    </tab>
    <tab id="export_tab" name="Export" class="flex flex-col items-center justify-start" :selected="true">
      <p class="flex text-center max-w-[24rem]">
        If you live in the Apple World, you can copy/paste between your phone / iPad / computer / etc.
        Another path is to paste this into a notes app or email.
      </p>
      <button
        class="inline-flex text-center items-center py-2 px-3 mt-4 border border-transparent text-xl rounded-md bg-blue-200 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        v-tippy="{ content: 'Export All Games' }" @click="doCopyText">
        <span     v-if="party" class="mr-2 w-10 h-10 self-center text-3xl">🎉</span>
        <CopyIcon v-else       class="mr-2 w-10 h-10 self-center"></CopyIcon>
        Copy Roundels to Clipboard
      </button>
      <p class="max-w-[24rem] p-2">{{ exportMessage }}</p>

      <div class="relative flex w-full py-5 mt-4 items-center">
        <hr class="flex-grow border-t border-red-400" />
        <h2 class="bold text-xl mx-3 mb-1">Danger Zone</h2>
        <hr class="flex-grow border-t border-red-400" />
      </div>

      <button
        class="flex text-2xl flex-row w-40 px-6 py-2 my-2 justify-center bg-purple-50"
        @click="deleteAllRoundels"
      >
        Delete All
      </button>
    </tab>
  </tabs>
</template>

<script lang="ts">
import { defineComponent }              from 'vue'
import { Tabs, Tab }                    from 'vue3-tabs-component'
import copyTextToClipboard              from 'copy-text-to-clipboard';
import { ClipboardCopyIcon as CopyIcon } from '@heroicons/vue/solid';
//
import * as TY                          from '@/lib/types'
import * as Lib                         from '@/lib'
import RoundelsImporter                 from '@/components/RoundelsImporter.vue'
//
const { importRoundelsJson, deleteAllRoundels, exportRoundels } = Lib
//
export default defineComponent({
  name: "PlayerMenu",
  props: {
    playerID:   { type: String, required: true },
  },
  components: { Tab, Tabs, RoundelsImporter, CopyIcon },
  emits: ['hidePlayerMenu'],
  //
  data() {
    return {
      party:         false,
      exportMessage: '',
    }
  },
  //
  methods: {
    deleteAllRoundels() {
      if (confirm('Really delete all progress?')) {
        deleteAllRoundels(this.playerID)
      }
    },

    doCopyText() {
      const roundels = exportRoundels(this.playerID)
      const json = JSON.stringify(roundels, 0, 2)
      copyTextToClipboard(json)
      this.party = true
      setTimeout(() => { this.party = false }, 1500)
      this.exportMessage = `Exported ${roundels.length} roundels / ${json.length} bytes`
    },
  }
})
</script>
