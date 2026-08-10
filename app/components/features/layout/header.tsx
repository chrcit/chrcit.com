import type { HEADER_QUERYResult } from '@gen/sanity';
import { Link, useLocation } from 'react-router';
import { Container } from '@/components/ui';

const routeLabels: Record<string, string> = {
  books: 'books',
  writing: 'writing',
  projects: 'projects',
  imprint: 'imprint',
  'privacy-policy': 'privacy',
  '2023-year-in-review': '2023 year in review',
  'hasanhub-com': 'hasanhub.com',
  hausgemacht: 'hausgemacht vibechecker',
  'mitentscheiden-at': 'mitentscheiden.at',
  'preismonitor-at': 'preismonitor.at',
};

function labelFor(segment: string) {
  return routeLabels[segment] || segment.replaceAll('-', ' ');
}

export function Header({
  header: _header,
  dataSanity,
}: {
  header: HEADER_QUERYResult | null;
  dataSanity?: string;
}) {
  const { pathname } = useLocation();
  const breadcrumbs = pathname.split('/').filter(Boolean).map(labelFor);

  return (
    <header
      className="bg-background/90 sticky top-0 z-40 border-b border-transparent backdrop-blur-md"
      data-sanity={dataSanity}
    >
      <Container className="flex min-h-16 items-center py-4">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-2 text-sm"
        >
          <Link
            to="/"
            className="shrink-0 font-semibold tracking-[-.02em] hover:text-brand"
          >
            chrcit.com
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span className="contents" key={`${crumb}-${index}`}>
              <span aria-hidden className="text-foreground/30">
                /
              </span>
              <span
                aria-current={
                  index === breadcrumbs.length - 1 ? 'page' : undefined
                }
                className="truncate text-foreground/55"
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </Container>
    </header>
  );
}
