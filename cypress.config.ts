import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'cypress';
import { MongoClient } from 'mongodb';
import type { User } from 'next-auth';

import { getGoalService } from './src/lib/goalService';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      loadEnvConfig(config.projectRoot);
      const client = new MongoClient(process.env.MONGO_URL);

      on('task', {
        insertGoal(payload: { text: string; author: User }) {
          return getGoalService(client.db()).createGoal(
            payload.text,
            payload.author,
          );
        },
      });
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
