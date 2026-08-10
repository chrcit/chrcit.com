import { redirect } from 'react-router';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { client } from '@/lib/sanity';
import { commitSession, getSession } from '@/sanity/preview';
import { noStoreCacheControl } from '@/lib/cache';
import type { Route } from './+types/enable';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const token =
    process.env.SANITY_API_READ_TOKEN ??
    process.env.SANITY_READ_TOKEN ??
    undefined;

  if (!token) {
    throw new Response('Preview mode missing token', { status: 401 });
  }

  const clientWithToken = client.withConfig({
    token,
  });

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(
    clientWithToken,
    // The raw URL is required because Sanity validates the complete preview URL.
    request.url
  );

  if (!isValid) {
    throw new Response('Invalid secret', { status: 401 });
  }

  const session = await getSession(request.headers.get('Cookie'));
  await session.set('projectId', process.env.VITE_SANITY_PROJECT_ID);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
      'Cache-Control': noStoreCacheControl,
    },
  });
};
