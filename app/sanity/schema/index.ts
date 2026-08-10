import { analyticsSettings } from '@/sanity/schema/objects/analytics-settings';
import { complexImage } from '@/sanity/schema/objects/complex-image';
import { ctaLink } from '@/sanity/schema/objects/cta-link';
import { markExternalLink } from '@/sanity/schema/objects/mark-external-link';
import { markInternalLink } from '@/sanity/schema/objects/mark-internal-link';
import { meta } from '@/sanity/schema/objects/meta';
import { metaSettings } from '@/sanity/schema/objects/meta-settings';
import { navLink } from '@/sanity/schema/objects/nav-link';
import { heroBlock } from '@/sanity/schema/objects/hero-block';
import { richTextBlock } from '@/sanity/schema/objects/rich-text-block';
import { referenceCollection } from '@/sanity/schema/objects/reference-collection';
import { newsletterBlock } from '@/sanity/schema/objects/newsletter-block';
import { linkListBlock } from '@/sanity/schema/objects/link-list-block';
import { richText } from '@/sanity/schema/objects/rich-text';
import { separator } from '@/sanity/schema/objects/separator';
import { socialLink } from '@/sanity/schema/objects/social-link';
import { quoteBlock } from '@/sanity/schema/objects/quote-block';

import { footer } from '@/sanity/schema/documents/footer';
import { header } from '@/sanity/schema/documents/header';
import { page } from '@/sanity/schema/documents/page';
import { siteSettings } from '@/sanity/schema/documents/site-settings';
import { themeSettings } from '@/sanity/schema/documents/theme-settings';
import { topic } from '@/sanity/schema/documents/topic';
import { thing } from '@/sanity/schema/documents/thing';
import { project } from '@/sanity/schema/documents/project';
import { article } from '@/sanity/schema/documents/article';
import { quote } from '@/sanity/schema/documents/quote';

export const schemaTypes = [
  // Objects
  meta,
  complexImage,
  separator,
  markExternalLink,
  markInternalLink,
  richText,
  navLink,
  ctaLink,
  socialLink,
  metaSettings,
  analyticsSettings,
  heroBlock,
  richTextBlock,
  referenceCollection,
  newsletterBlock,
  linkListBlock,
  quoteBlock,

  // Documents
  siteSettings,
  themeSettings,
  header,
  footer,
  page,
  topic,
  thing,
  project,
  article,
  quote,
];
