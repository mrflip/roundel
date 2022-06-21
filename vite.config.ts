import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
const config = {
  base: '/inventory-visualizer/',
  resolve: {
    alias: {
      '@':  path.resolve(__dirname, './src'),
    },
  },
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
  },
};

export default defineConfig(config)
