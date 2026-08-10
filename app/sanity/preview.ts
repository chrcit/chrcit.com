import { createCookieSessionStorage } from 'react-router';
import type { loadQuery } from '@/sanity/loader.server';

if (!process.env.SANITY_SESSION_SECRET) {
  throw new Error(`Missing SANITY_SESSION_SECRET in .env`);
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      httpOnly: true,
      name: '__sanity_preview',
      path: '/',
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
      secrets: [process.env.SANITY_SESSION_SECRET],
      secure: process.env.NODE_ENV !== 'development',
    },
  });

async function previewContext(
  headers: Headers
): Promise<{ preview: boolean; options: Parameters<typeof loadQuery>[2] }> {
  const previewSession = await getSession(headers.get('Cookie'));

  const preview =
    previewSession.get('projectId') === process.env.VITE_SANITY_PROJECT_ID;

  return {
    preview,
    options: preview
      ? {
          perspective: 'previewDrafts',
          stega: true,
        }
      : {
          perspective: 'published',
          stega: false,
        },
  };
}

export { commitSession, destroySession, getSession, previewContext };
