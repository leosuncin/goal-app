import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    experimentalSessionAndOrigin: true,
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  experimentalStudio: true,
});
