import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vite.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Runs every story as a browser test: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          plugins: [
            storybookTest({ configDir: path.join(dirname, '.storybook') }),
          ],
          // Pre-bundle app dependencies that are only discovered while stories
          // load, so Vite does not reload the browser in the middle of a run.
          optimizeDeps: {
            include: [
              '@emotion/cache',
              '@emotion/react',
              '@mui/material/Backdrop',
              '@mui/stylis-plugin-rtl',
              '@mui/utils',
              '@sws2apps/react-sw-helper',
              'crypto-es',
              'firebase/app',
              'firebase/auth',
              'firebase/installations',
              'swiper/modules',
              'swiper/react',
              'validator/lib/isEmail',
            ],
          },
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  })
);
