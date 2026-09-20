import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Use relative paths so assets load correctly on GitHub Pages
  build: {
    outDir: 'dist',
  },
});
