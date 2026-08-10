import type { Route } from './+types/article.$slug';
import type { ARTICLE_QUERYResult } from '@gen/sanity';
import { data as routeData, useParams } from 'react-router';
import { useQuery } from '@/sanity/loader';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { ARTICLE_QUERY } from '@/sanity/queries';
import { ComplexImage, RichText } from '@/components/features/sanity';
import { getDocumentCacheHeaders, publicPageCacheControl } from '@/lib/cache';
import { cleanString } from '@/components/features/sanity/helpers/stega';
import { TableOfContents } from '@/components/features/table-of-contents';

export async function loader({ request, params }: Route.LoaderArgs) {
  const { options, preview } = await previewContext(request.headers);
  const article = await loadQuery<ARTICLE_QUERYResult | null>(
    ARTICLE_QUERY,
    { slug: params.slug },
    options
  );
  if (!article.data || cleanString(article.data.meta?.visibility) === 'private')
    throw new Response('Not found', { status: 404 });
  return routeData({ article }, { headers: getDocumentCacheHeaders(preview) });
}
export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? publicPageCacheControl,
});
export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const item = loaderData.article.data;
  return [
    {
      title: `${item?.meta?.title || item?.title || 'Writing'} · Christian Cito`,
    },
    {
      name: 'description',
      content: item?.meta?.description || item?.excerpt || '',
    },
  ];
}
export default function ArticleRoute({ loaderData }: Route.ComponentProps) {
  const { slug = '' } = useParams();
  const { data: article } = useQuery<ARTICLE_QUERYResult | null>(
    ARTICLE_QUERY,
    { slug },
    { initial: loaderData.article }
  );
  if (!article) return null;
  return (
    <article className="py-10">
      <header className="mx-auto max-w-[var(--reading-width)] py-14">
        <p className="text-brand mb-4 text-xs font-semibold uppercase tracking-[0.18em]">
          Writing
          {article.publishedAt
            ? ` · ${new Date(article.publishedAt).getFullYear()}`
            : ''}
        </p>
        <h1 className="text-[clamp(3rem,7vw,6rem)] font-semibold leading-[.92] tracking-[-.06em]">
          {article.title}
        </h1>
        {article.excerpt ? (
          <p className="text-foreground/70 mt-7 text-xl leading-relaxed">
            {article.excerpt}
          </p>
        ) : null}
      </header>
      {article.cover ? (
        <ComplexImage
          value={article.cover}
          widths={[640, 960, 1440]}
          sizes="100vw"
          className="mx-auto max-h-[70dvh] max-w-5xl"
          imgClassName="h-full w-full object-cover"
        />
      ) : null}
      <div className="mx-auto max-w-[var(--reading-width)] py-12">
        <TableOfContents content={article.body} />
        <RichText value={article.body} />
      </div>
    </article>
  );
}
