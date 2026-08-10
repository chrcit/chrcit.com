import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.VITE_SANITY_PROJECT_ID!,
    dataset: process.env.VITE_SANITY_DATASET!,
  },
  autoUpdates: true,
});
