import type { Route } from './+types/page.$slug';
import type { PAGE_QUERYResult } from '@gen/sanity';
import { useQuery } from '@/sanity/loader';
import { stegaClean } from '@sanity/client/stega';
import { data as routeData, Link, useParams } from 'react-router';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { PAGE_QUERY } from '@/sanity/queries';
import { PageBuilder, RichText } from '@/components/features/sanity';
import { TableOfContents } from '@/components/features/table-of-contents';
import { getDocumentCacheHeaders, publicPageCacheControl } from '@/lib/cache';

function cleanVisibility(value: string | null | undefined) {
  return value ? stegaClean(value) : undefined;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  if (['about', 'things', 'writing'].includes(params.slug || '')) {
    throw new Response('Not found', { status: 404 });
  }
  const { options, preview } = await previewContext(request.headers);
  const data = await loadQuery<PAGE_QUERYResult | null>(
    PAGE_QUERY,
    { slug: params.slug },
    options
  );

  const visibility = cleanVisibility(data.data?.meta?.visibility);
  if (!data.data || visibility === 'private') {
    throw new Response('Not found', { status: 404 });
  }

  return routeData(
    { page: data },
    { headers: getDocumentCacheHeaders(preview) }
  );
}

export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? publicPageCacheControl,
});

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const page = loaderData.page.data;
  const visibility = cleanVisibility(page?.meta?.visibility);
  const tags: Route.MetaDescriptors = [
    {
      title: page?.title
        ? `${page.meta?.title || page.title} · Christian Cito`
        : 'Christian Cito',
    },
    {
      name: 'description',
      content: page?.meta?.description || page?.title || 'Page',
    },
    {
      name: 'robots',
      content: visibility === 'hidden' ? 'noindex,follow' : 'index,follow',
    },
  ];

  return tags;
}

export default function PageRoute({ loaderData }: Route.ComponentProps) {
  const { slug = '' } = useParams();
  const { data: page, encodeDataAttribute } = useQuery<PAGE_QUERYResult | null>(
    PAGE_QUERY,
    { slug },
    { initial: loaderData.page }
  );

  if (!page) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Not found</h1>
        <Link to="/" className="text-brand underline-offset-4 hover:underline">
          ← Back home
        </Link>
      </div>
    );
  }
  const contentMode = page.contentMode ? stegaClean(page.contentMode) : null;

  return (
    <article className="py-10">
      <div>
        <h1
          className="max-w-5xl py-14 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[.9] tracking-[-.065em]"
          data-sanity={encodeDataAttribute(['title'])}
        >
          {page.title || 'Untitled'}
        </h1>

        <div>
          {page.showTableOfContents ? (
            <TableOfContents
              content={
                contentMode === 'pageBuilder' ? page.components : page.richText
              }
            />
          ) : null}
          {contentMode === 'pageBuilder' ? (
            <div data-sanity={encodeDataAttribute(['components'])}>
              <PageBuilder value={page.components} library={page.library} />
            </div>
          ) : (
            <div data-sanity={encodeDataAttribute(['richText'])}>
              <div className="mx-auto max-w-[var(--reading-width)]">
                <RichText value={page.richText} library={page.library} />
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
