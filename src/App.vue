<template>
  <main class="flex-1 w-full mx-auto">
    <h1 class="mx-4 my-4 text-center text-lg leading-6 font-medium uppercase">Lexy Roundel</h1>
    <div class="mt-4">
      <p>App!</p>
      <router-view />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },
})
</script>
