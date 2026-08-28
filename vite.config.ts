import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'site/index.html'),
        '404': resolve(import.meta.dirname, 'site/404.html')
      }
    }
  }
});
