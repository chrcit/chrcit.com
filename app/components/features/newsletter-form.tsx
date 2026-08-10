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
  compact = false,
}: {
  heading?: string | null;
  body?: string | null;
  buttonLabel?: string | null;
  successMessage?: string | null;
  groupId?: string | null;
  privacyNote?: string | null;
  compact?: boolean;
}) {
  const fetcher = useFetcher<NewsletterResult>();
  const busy = fetcher.state !== 'idle';
  const success = fetcher.data?.ok;
  const cleanGroupId = cleanString(groupId);
  const cleanHeading = cleanString(heading) || 'Newsletter';
  const headingId = cleanHeading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return (
    <section
      className={
        compact
          ? 'border-border py-10 md:py-12'
          : 'border-foreground my-12 border-y py-10'
      }
    >
      <div className="grid gap-7 md:grid-cols-[1fr_1.1fr] md:items-end">
        <div>
          <h2
            id={headingId}
            className={
              compact
                ? 'text-lg font-semibold tracking-[-0.025em]'
                : 'text-3xl font-semibold tracking-[-0.035em]'
            }
          >
            {heading || cleanHeading}
          </h2>
          {body ? (
            <p
              className={
                compact
                  ? 'text-foreground/65 mt-2 max-w-prose text-sm leading-relaxed'
                  : 'text-foreground/70 mt-3 max-w-prose leading-relaxed'
              }
            >
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
            className="grid gap-2"
          >
            <label
              className="text-foreground/65 text-xs font-medium"
              htmlFor="newsletter-email"
            >
              Email
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
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
                className="bg-foreground text-background hover:bg-brand rounded-[var(--radius-site)] px-5 py-3 font-semibold whitespace-nowrap transition-colors active:translate-y-px disabled:opacity-50"
              >
                {busy ? 'Joining…' : buttonLabel || 'Subscribe'}
              </button>
            </div>
          </fetcher.Form>
        )}
      </div>
      {!success && (
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-foreground/55">
          <span>{privacyNote || 'Unsubscribe at any time.'}</span>
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
