import { complexImageStub } from '@/sanity/queries/stubs/complex-image';

export const contentItemStub = `
  _id,
  _type,
  title,
  slug,
  kind,
  creator,
  url,
  externalUrl,
  summary,
  excerpt,
  year,
  publishedAt,
  featured,
  historical,
  sortOrder,
  image{${complexImageStub}},
  cover{${complexImageStub}},
  topics[]->{_id, title, slug, color},
  notes[]{
    ...,
    markDefs[]{..., link->{_id, _type, title, slug}},
    items[]->{_id, _type, title, slug, kind, creator, url, summary, excerpt, year, featured, historical}
  }
`;
