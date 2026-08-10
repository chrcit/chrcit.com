import { useMemo } from 'react';
import { VisualEditing } from '@sanity/visual-editing/react-router';
import { DisablePreviewMode } from '@/components/features/sanity/visual-editing/disable-preview-mode';
import { createClient } from '@sanity/client';
import { useLiveMode } from '@/sanity/loader';

type Env = {
  VITE_SANITY_PROJECT_ID?: string;
  VITE_SANITY_DATASET?: string;
  VITE_SANITY_API_VERSION?: string;
  VITE_SANITY_STUDIO_URL?: string;
};

export function SanityVisualEditing() {
  const client = useMemo(() => {
    const env = (window as Window & { ENV?: Env }).ENV;
    const studioUrl =
      env?.VITE_SANITY_STUDIO_URL || `${window.location.origin}/studio`;

    return createClient({
      projectId: env?.VITE_SANITY_PROJECT_ID || '',
      dataset: env?.VITE_SANITY_DATASET || '',
      apiVersion: env?.VITE_SANITY_API_VERSION || '2024-02-13',
      useCdn: true,
      stega: {
        enabled: true,
        studioUrl,
      },
    });
  }, []);

  const studioUrl =
    (window as Window & { ENV?: Env }).ENV?.VITE_SANITY_STUDIO_URL ||
    `${window.location.origin}/studio`;
  useLiveMode({ client, studioUrl });

  return (
    <>
      <VisualEditing />
      <DisablePreviewMode />
    </>
  );
}
