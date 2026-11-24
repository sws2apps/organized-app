import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/docs/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    'msw-storybook-addon',
  ],
  framework: '@storybook/react-vite',
  // `../public` serves the app fonts; `./public` holds the generated MSW worker.
  staticDirs: ['../public', './public'],
  viteFinal: (config) =>
    mergeConfig(config, {
      // Storybook has its own deterministic env (see .storybook/.env).
      envDir: dirname,
    }),
};

export default config;
