import type { Route } from './+types/index';
import type { HOMEPAGE_QUERYResult } from '@gen/sanity';
import { data as routeData } from 'react-router';
import { useQuery } from '@/sanity/loader';
import { stegaClean } from '@sanity/client/stega';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { HOMEPAGE_QUERY } from '@/sanity/queries';
import { PageBuilder, RichText } from '@/components/features/sanity';
import { getDocumentCacheHeaders, publicPageCacheControl } from '@/lib/cache';

function cleanVisibility(value: string | null | undefined) {
  return value ? stegaClean(value) : undefined;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { options, preview } = await previewContext(request.headers);
  const data = await loadQuery<HOMEPAGE_QUERYResult | null>(
    HOMEPAGE_QUERY,
    {},
    options
  );

  const visibility = cleanVisibility(data.data?.meta?.visibility);
  if (data.data && visibility === 'private') {
    throw new Response('Not found', { status: 404 });
  }

  return routeData({ data }, { headers: getDocumentCacheHeaders(preview) });
}

export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? publicPageCacheControl,
});

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const homepage = loaderData.data.data;
  const visibility = cleanVisibility(homepage?.meta?.visibility);

  return [
    {
      title:
        homepage?.meta?.title ||
        (homepage?.title
          ? `${homepage.title} · Christian Cito`
          : 'Christian Cito · Things for the internet'),
    },
    {
      name: 'description',
      content: homepage?.meta?.description || homepage?.title || 'Homepage',
    },
    {
      name: 'robots',
      content: visibility === 'hidden' ? 'noindex,follow' : 'index,follow',
    },
  ];
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { data: homepage, encodeDataAttribute } =
    useQuery<HOMEPAGE_QUERYResult | null>(
      HOMEPAGE_QUERY,
      {},
      { initial: loaderData.data }
    );

  const contentMode = homepage?.contentMode
    ? stegaClean(homepage.contentMode)
    : null;

  return (
    <div>
      {!homepage ? (
        <section className="grid min-h-[64dvh] content-center py-16">
          <p className="text-brand mb-5 text-xs font-semibold uppercase tracking-[0.18em]">
            Christian Cito
          </p>
          <h1 className="max-w-5xl text-[clamp(3.4rem,10vw,8.5rem)] font-semibold leading-[.87] tracking-[-.075em]">
            I make things for the internet and write down what I notice.
          </h1>
          <p className="text-foreground/65 mt-8 max-w-xl text-lg">
            A new Sanity-backed home is being assembled here. The studio is
            ready for the interesting parts.
          </p>
        </section>
      ) : (
        <div data-sanity={encodeDataAttribute(['title'])}>
          {contentMode === 'pageBuilder' ? (
            <div data-sanity={encodeDataAttribute(['components'])}>
              <PageBuilder
                value={homepage.components}
                library={homepage.library}
              />
            </div>
          ) : (
            <div data-sanity={encodeDataAttribute(['richText'])}>
              <div className="mx-auto max-w-[var(--reading-width)] py-14">
                <h1 className="mb-10 text-5xl font-semibold tracking-[-.05em]">
                  {homepage.title}
                </h1>
                <RichText
                  value={homepage.richText}
                  library={homepage.library}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
