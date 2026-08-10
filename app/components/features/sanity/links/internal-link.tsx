import type { ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { resolveHref } from '@/components/features/sanity/helpers/resolve-href';
import type { MarkInternalLink } from '@gen/sanity';

type DerefPage = {
  _id: string;
  _type: 'page' | 'article' | 'project';
  slug: { current?: string | null } | null;
};

export type InternalLinkValue =
  | MarkInternalLink
  | { link?: DerefPage | null }
  | null;

type Props = Omit<LinkProps, 'to'> & {
  value: InternalLinkValue;
  children: ReactNode;
};

export function InternalLink({ value, children, ...rest }: Props) {
  const link = value && 'link' in value ? value.link : null;

  // `link` can be either:
  // - a reference (`_ref`) from schema types, or
  // - a dereferenced page object from queries (`_id` + `slug`)
  const to = resolveHref(link);
  if (!to) return <>{children}</>;

  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
}
