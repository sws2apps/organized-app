import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import loadVersion from 'vite-plugin-package-version';
import { comlink } from 'vite-plugin-comlink';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import svgx from '@svgx/vite-plugin-react';

const rootDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), comlink(), eslint(), loadVersion(), svgx()],
  resolve: {
    alias: [
      { find: '@assets', replacement: resolve(rootDirectory, 'src/assets') },
      {
        find: '@components',
        replacement: resolve(rootDirectory, 'src/components'),
      },
      {
        find: '@icons',
        replacement: resolve(rootDirectory, 'src/components/icons'),
      },
      {
        find: '@constants',
        replacement: resolve(rootDirectory, 'src/constants'),
      },
      {
        find: '@features',
        replacement: resolve(rootDirectory, 'src/features'),
      },
      { find: '@hooks', replacement: resolve(rootDirectory, 'src/hooks') },
      { find: '@layouts', replacement: resolve(rootDirectory, 'src/layouts') },
      { find: '@pages', replacement: resolve(rootDirectory, 'src/pages') },
      { find: '@routes', replacement: resolve(rootDirectory, 'src/routes') },
      {
        find: '@services',
        replacement: resolve(rootDirectory, 'src/services'),
      },
      { find: '@states', replacement: resolve(rootDirectory, 'src/states') },
      { find: '@utils', replacement: resolve(rootDirectory, 'src/utils') },
      { find: '@wrapper', replacement: resolve(rootDirectory, 'src/wrapper') },
      {
        find: '@locales',
        replacement: resolve(rootDirectory, 'src/locales'),
      },
      {
        find: '@definition',
        replacement: resolve(rootDirectory, 'src/definition'),
      },
      { find: '@global', replacement: resolve(rootDirectory, 'src/global') },
      { find: '@db', replacement: resolve(rootDirectory, 'src/indexedDb') },
      { find: '@views', replacement: resolve(rootDirectory, 'src/views') },
    ],
  },
  worker: { plugins: () => [comlink()] },
  server: {
    port: 4050,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: { port: 4050 },
  build: {
    chunkSizeWarningLimit: 2500,
    target: 'esnext',
  },
});
