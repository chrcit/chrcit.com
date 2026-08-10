import type { Route } from './+types/api.newsletter';
import { client } from '@/lib/sanity';

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const email = String(form.get('email') || '')
    .trim()
    .toLowerCase();
  let groupId = String(form.get('groupId') || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(email))
    return Response.json(
      { ok: false, message: 'Please enter a valid email.' },
      { status: 400 }
    );
  const token = process.env.MAILERLITE_API_TOKEN;
  if (!token)
    return Response.json(
      { ok: false, message: 'Newsletter signup is not configured yet.' },
      { status: 503 }
    );
  if (!groupId)
    groupId =
      (await client.fetch<string | null>(
        '*[_id == "siteSettings"][0].newsletter.groupId'
      )) || '';

  const response = await fetch(
    'https://connect.mailerlite.com/api/subscribers',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    }
  );
  if (!response.ok)
    return Response.json(
      {
        ok: false,
        message:
          response.status === 422
            ? 'This address could not be subscribed.'
            : 'The signup service is unavailable. Please try again.',
      },
      { status: response.status >= 500 ? 502 : 400 }
    );
  return Response.json({ ok: true });
}
