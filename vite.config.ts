/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import loadVersion from 'vite-plugin-package-version';
import { comlink } from 'vite-plugin-comlink';
import { resolve } from 'path';
import svgx from '@svgx/vite-plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), comlink(), eslint(), loadVersion(), svgx()],
  resolve: {
    alias: [{
      find: '@assets',
      replacement: resolve(dirname, 'src/assets')
    }, {
      find: '@components',
      replacement: resolve(dirname, 'src/components')
    }, {
      find: '@icons',
      replacement: resolve(dirname, 'src/components/icons')
    }, {
      find: '@constants',
      replacement: resolve(dirname, 'src/constants')
    }, {
      find: '@features',
      replacement: resolve(dirname, 'src/features')
    }, {
      find: '@hooks',
      replacement: resolve(dirname, 'src/hooks')
    }, {
      find: '@layouts',
      replacement: resolve(dirname, 'src/layouts')
    }, {
      find: '@pages',
      replacement: resolve(dirname, 'src/pages')
    }, {
      find: '@routes',
      replacement: resolve(dirname, 'src/routes')
    }, {
      find: '@services',
      replacement: resolve(dirname, 'src/services')
    }, {
      find: '@states',
      replacement: resolve(dirname, 'src/states')
    }, {
      find: '@utils',
      replacement: resolve(dirname, 'src/utils')
    }, {
      find: '@wrapper',
      replacement: resolve(dirname, 'src/wrapper')
    }, {
      find: '@locales',
      replacement: resolve(dirname, 'src/locales')
    }, {
      find: '@definition',
      replacement: resolve(dirname, 'src/definition')
    }, {
      find: '@global',
      replacement: resolve(dirname, 'src/global')
    }, {
      find: '@db',
      replacement: resolve(dirname, 'src/indexedDb')
    }, {
      find: '@views',
      replacement: resolve(dirname, 'src/views')
    }]
  },
  worker: {
    plugins: () => [comlink()]
  },
  server: {
    port: 4050,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4050
  },
  build: {
    chunkSizeWarningLimit: 2500,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react']
        }
      }
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});