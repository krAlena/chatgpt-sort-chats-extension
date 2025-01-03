import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: 'entrypoints/contentScript.js'
      }
    }
  }
});