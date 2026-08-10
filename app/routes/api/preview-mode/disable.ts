import { redirect } from 'react-router';
import { destroySession, getSession } from '@/sanity/preview';
import { noStoreCacheControl } from '@/lib/cache';
import type { Route } from './+types/disable';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
      'Cache-Control': noStoreCacheControl,
    },
  });
};
