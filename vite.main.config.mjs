import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      formats: ['es'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['electron', 'fs', 'path', 'node:path', 'url', 'electron-squirrel-startup'],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
      },
    },
  },
});
