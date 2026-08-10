import type { AnchorHTMLAttributes, ReactNode } from 'react';
import type { MarkExternalLink } from '@gen/sanity';
import { cleanString } from '@/components/features/sanity/helpers/stega';

type ExternalLinkQueryShape = {
  type: 'url' | 'email' | 'phone' | 'file' | null;
  url: string | null;
  email: string | null;
  phone: string | null;
  fileUrl: string | null;
} | null;

export type ExternalLinkValue =
  | MarkExternalLink
  | (MarkExternalLink & { fileUrl?: string | null })
  | ExternalLinkQueryShape
  | null;

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  value: ExternalLinkValue;
  children: ReactNode;
};

function resolveExternalHref(value: ExternalLinkValue): string | null {
  if (!value?.type) return null;
  const type = cleanString(value.type);

  if (type === 'url') return cleanString(value.url) || null;
  if (type === 'email') {
    const email = cleanString(value.email);
    return email ? `mailto:${email}` : null;
  }
  if (type === 'phone') {
    const phone = cleanString(value.phone);
    return phone ? `tel:${phone}` : null;
  }
  if (type === 'file')
    return (
      cleanString('fileUrl' in value ? value.fileUrl : null) ||
      // schema types only store a file asset reference; queries may include a fileUrl
      null
    );

  return null;
}

export function ExternalLink({ value, children, rel, target, ...rest }: Props) {
  const href = resolveExternalHref(value);
  if (!href) return <>{children}</>;

  // Default safe external link behavior when navigating away.
  const isExternal =
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//');

  const finalTarget = target ?? (isExternal ? '_blank' : undefined);
  const finalRel =
    rel ?? (finalTarget === '_blank' ? 'noopener noreferrer' : undefined);

  return (
    <a href={href} target={finalTarget} rel={finalRel} {...rest}>
      {children}
    </a>
  );
}
