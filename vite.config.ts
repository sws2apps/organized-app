import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import loadVersion from 'vite-plugin-package-version';
import { comlink } from 'vite-plugin-comlink';
import { resolve } from 'path';
import svgx from '@svgx/vite-plugin-react';

export default defineConfig({
  plugins: [react(), comlink(), eslint(), loadVersion(), svgx()],
  resolve: {
    alias: [
      { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      {
        find: '@components',
        replacement: resolve(__dirname, 'src/components'),
      },
      {
        find: '@icons',
        replacement: resolve(__dirname, 'src/components/icons'),
      },
      {
        find: '@constants',
        replacement: resolve(__dirname, 'src/constants'),
      },
      { find: '@features', replacement: resolve(__dirname, 'src/features') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
      { find: '@layouts', replacement: resolve(__dirname, 'src/layouts') },
      { find: '@pages', replacement: resolve(__dirname, 'src/pages') },
      { find: '@routes', replacement: resolve(__dirname, 'src/routes') },
      { find: '@services', replacement: resolve(__dirname, 'src/services') },
      { find: '@states', replacement: resolve(__dirname, 'src/states') },
      { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
      { find: '@wrapper', replacement: resolve(__dirname, 'src/wrapper') },
      {
        find: '@locales',
        replacement: resolve(__dirname, 'src/locales'),
      },
      {
        find: '@definition',
        replacement: resolve(__dirname, 'src/definition'),
      },
      { find: '@global', replacement: resolve(__dirname, 'src/global') },
      { find: '@db', replacement: resolve(__dirname, 'src/indexedDb') },
      { find: '@views', replacement: resolve(__dirname, 'src/views') },
      { find: 'fs', replacement: resolve(__dirname, 'src/shims/empty.js') },
      { find: 'path', replacement: resolve(__dirname, 'src/shims/empty.js') },
      { find: 'crypto', replacement: resolve(__dirname, 'src/shims/empty.js') },
    ],
  },
  worker: { plugins: () => [comlink()] },
  server: { port: 4050, host: true },
  preview: { port: 4050 },
  build: {
    chunkSizeWarningLimit: 2500,
    target: 'esnext',
    rollupOptions: {
      external: ['fs', 'path', 'crypto'],
      output: {
        manualChunks: { vendor: ['react'] },
      },
    },
  },
});
