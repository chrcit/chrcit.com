import type { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router';
import { resolveHref } from '@/components/features/sanity/helpers/resolve-href';
import { ExternalLink } from '@/components/features/sanity/links/external-link';
import { cleanString } from '@/components/features/sanity/helpers/stega';

import type { FOOTER_QUERYResult, HEADER_QUERYResult } from '@gen/sanity';

type HeaderNavItem = NonNullable<
  NonNullable<HEADER_QUERYResult>['nav']
>[number];
type FooterMainNavItem = NonNullable<
  NonNullable<FOOTER_QUERYResult>['mainNav']
>[number];
type FooterSecondaryNavItem = NonNullable<
  NonNullable<FOOTER_QUERYResult>['secondaryNav']
>[number];

export type NavLinkValue =
  | HeaderNavItem
  | FooterMainNavItem
  | FooterSecondaryNavItem;

type Props = {
  link: NavLinkValue | null | undefined;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export function NavLink({ link, className, children, ...rest }: Props) {
  if (!link) return null;

  const label = children ?? link.title ?? '';
  const type = cleanString(link.type);

  if (type === 'internal') {
    const to = resolveHref(link.reference);
    if (!to) return null;
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    );
  }

  if (type === 'external') {
    if (!link.externalLink) return null;
    return (
      <ExternalLink value={link.externalLink} className={className} {...rest}>
        {label}
      </ExternalLink>
    );
  }

  return null;
}
