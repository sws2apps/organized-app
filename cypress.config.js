import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'vwwffz',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    video: false,
  },
});
