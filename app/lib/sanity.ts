import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from '@/sanity/project-details';

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: true,
  // Public queries must stay free of invisible Visual Editing metadata.
  // Preview mode installs its own stega-enabled client in SanityVisualEditing.
  stega: false,
});
