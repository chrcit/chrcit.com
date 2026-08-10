import type { Route } from './+types/project.$slug';
import type { PROJECT_QUERYResult } from '@gen/sanity';
import { data as routeData, useParams } from 'react-router';
import { useQuery } from '@/sanity/loader';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { PROJECT_QUERY } from '@/sanity/queries';
import {
  ComplexImage,
  PageBuilder,
  RichText,
} from '@/components/features/sanity';
import { getDocumentCacheHeaders, publicPageCacheControl } from '@/lib/cache';
import { cleanString } from '@/components/features/sanity/helpers/stega';
import { TableOfContents } from '@/components/features/table-of-contents';

export async function loader({ request, params }: Route.LoaderArgs) {
  const { options, preview } = await previewContext(request.headers);
  const project = await loadQuery<PROJECT_QUERYResult | null>(
    PROJECT_QUERY,
    { slug: params.slug },
    options
  );
  if (!project.data || cleanString(project.data.meta?.visibility) === 'private')
    throw new Response('Not found', { status: 404 });
  return routeData({ project }, { headers: getDocumentCacheHeaders(preview) });
}
export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? publicPageCacheControl,
});
export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const item = loaderData.project.data;
  return [
    {
      title: `${item?.meta?.title || item?.title || 'Project'} · Christian Cito`,
    },
    {
      name: 'description',
      content: item?.meta?.description || item?.summary || '',
    },
  ];
}
export default function ProjectRoute({ loaderData }: Route.ComponentProps) {
  const { slug = '' } = useParams();
  const { data: project } = useQuery<PROJECT_QUERYResult | null>(
    PROJECT_QUERY,
    { slug },
    { initial: loaderData.project }
  );
  if (!project) return null;
  return (
    <article className="py-10">
      <header className="max-w-4xl py-14">
        <p className="text-brand mb-4 text-xs font-semibold uppercase tracking-[0.18em]">
          {project.historical ? 'Archive project' : 'Project'}
          {project.year ? ` · ${project.year}` : ''}
        </p>
        <h1 className="text-[clamp(3rem,8vw,7rem)] font-semibold leading-[.9] tracking-[-.065em]">
          {project.title}
        </h1>
        {project.summary ? (
          <p className="text-foreground/70 mt-7 max-w-2xl text-xl leading-relaxed">
            {project.summary}
          </p>
        ) : null}
        {project.url ? (
          <a
            className="border-foreground mt-6 inline-block border-b text-sm font-semibold"
            href={cleanString(project.url)}
            target="_blank"
            rel="noreferrer"
          >
            Visit project ↗
          </a>
        ) : null}
      </header>
      {project.cover ? (
        <ComplexImage
          value={project.cover}
          widths={[640, 960, 1440, 1920]}
          sizes="100vw"
          className="max-h-[75dvh]"
          imgClassName="h-full w-full object-cover"
        />
      ) : null}
      <div className="mx-auto max-w-[var(--reading-width)] py-12">
        <TableOfContents content={project.body} />
        <RichText value={project.body} library={project.library} />
      </div>
      <PageBuilder value={project.components} library={project.library} />
    </article>
  );
}
