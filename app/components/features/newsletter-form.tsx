import { useFetcher } from 'react-router';
import { cleanString } from '@/components/features/sanity/helpers/stega';

type NewsletterResult = { ok?: boolean; message?: string };

export function NewsletterForm({
  heading,
  body,
  buttonLabel,
  successMessage,
  groupId,
  privacyNote,
}: {
  heading?: string | null;
  body?: string | null;
  buttonLabel?: string | null;
  successMessage?: string | null;
  groupId?: string | null;
  privacyNote?: string | null;
}) {
  const fetcher = useFetcher<NewsletterResult>();
  const busy = fetcher.state !== 'idle';
  const success = fetcher.data?.ok;
  const cleanGroupId = cleanString(groupId);
  const cleanHeading = cleanString(heading) || 'Notes from the workbench';
  const headingId = cleanHeading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return (
    <section className="border-foreground my-12 border-y py-10">
      <div className="grid gap-7 md:grid-cols-[1fr_1.1fr] md:items-end">
        <div>
          <p className="text-brand mb-3 text-xs font-semibold uppercase tracking-[0.17em]">
            Occasional newsletter
          </p>
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-[-0.035em]"
          >
            {heading || cleanHeading}
          </h2>
          {body ? (
            <p className="text-foreground/70 mt-3 max-w-prose leading-relaxed">
              {body}
            </p>
          ) : null}
        </div>
        {success ? (
          <p className="text-lg font-medium" role="status">
            {successMessage || 'You are on the list. Thank you.'}
          </p>
        ) : (
          <fetcher.Form
            method="post"
            action="/api/newsletter"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="border-border bg-background min-w-0 flex-1 rounded-[var(--radius-site)] border px-4 py-3 text-base"
            />
            {cleanGroupId ? (
              <input type="hidden" name="groupId" value={cleanGroupId} />
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="bg-foreground text-background rounded-[var(--radius-site)] px-5 py-3 font-semibold disabled:opacity-50"
            >
              {busy ? 'Joining…' : buttonLabel || 'Subscribe'}
            </button>
          </fetcher.Form>
        )}
      </div>
      {!success && (
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-foreground/55">
          <span>
            {privacyNote || 'No spam. Unsubscribe whenever you like.'}
          </span>
          {fetcher.data?.message ? (
            <span className="text-brand" role="alert">
              {fetcher.data.message}
            </span>
          ) : null}
        </div>
      )}
    </section>
  );
}
