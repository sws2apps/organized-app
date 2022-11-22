import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import appVersion from './appVersion';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), appVersion()],
  server: {
    port: 4000,
    host: true,
  },
  preview: {
    port: 4000,
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
