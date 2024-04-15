import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { loadVersion } from '@sws2apps/vite-plugin-package-version';
import { comlink } from 'vite-plugin-comlink';
import { resolve } from 'path';
import svgx from '@svgx/vite-plugin-react';

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(), comlink(), eslint(), loadVersion(), svgx()],
  resolve: {
    alias: [
      { find: '@assets', replacement: resolve(__dirname, 'src/v3/assets') },
      { find: '@components', replacement: resolve(__dirname, 'src/v3/components') },
      { find: '@icons', replacement: resolve(__dirname, 'src/v3/components/icons') },
      { find: '@constants', replacement: resolve(__dirname, 'src/v3/constants') },
      { find: '@features', replacement: resolve(__dirname, 'src/v3/features') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/v3/hooks') },
      { find: '@layouts', replacement: resolve(__dirname, 'src/v3/layouts') },
      { find: '@pages', replacement: resolve(__dirname, 'src/v3/pages') },
      { find: '@routes', replacement: resolve(__dirname, 'src/v3/routes') },
      { find: '@services', replacement: resolve(__dirname, 'src/v3/services') },
      { find: '@states', replacement: resolve(__dirname, 'src/v3/states') },
      { find: '@utils', replacement: resolve(__dirname, 'src/v3/utils') },
      { find: '@wrapper', replacement: resolve(__dirname, 'src/v3/wrapper') },
      { find: '@locales', replacement: resolve(__dirname, 'src/shared/locales') },
      { find: '@shared', replacement: resolve(__dirname, 'src/shared') },
      { find: '@definition', replacement: resolve(__dirname, 'src/v3/definition') },
      { find: '@global', replacement: resolve(__dirname, 'src/v3/global') },
    ],
  },
  worker: { plugins: () => [comlink()] },
  server: {
    port: 4050,
    host: true,
  },
  preview: {
    port: 4050,
  },
  minifyInternalExports: true,
  build: {
    chunkSizeWarningLimit: 2500,
    target: 'esnext',
  },
});
