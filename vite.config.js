import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { loadVersion } from '@sws2apps/vite-plugin-package-version';
import { comlink } from 'vite-plugin-comlink';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), comlink(), eslint(), loadVersion()],
  worker: { plugins: [comlink()] },
  server: {
    port: 4000,
    host: true,
  },
  preview: {
    port: 4000,
  },
  build: {
    chunkSizeWarningLimit: 2000,
    target: 'esnext',
  },
});
