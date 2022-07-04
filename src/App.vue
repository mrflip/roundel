<template>
  <main class="flex-1 w-full h-screen justify-center align-center mx-auto">
    <div class="max-w-4xl w-full mx-auto">
      <router-view />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

//     <h1 class="mx-4 my-4 text-center text-lg leading-6 font-medium uppercase">Lexy Roundel</h1>

export default defineComponent({
  components: {
  },
})
</script>
