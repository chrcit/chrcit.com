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
  text,
  attribution,
  location,
  locationType,
  sourceUrl,
  sourceNote,
  origin,
  sourceState,
  tags,
  readwise{
    userBookId, highlightId, externalId, source, sourceUrl, readwiseUrl,
    coverImageUrl, color, highlightedAt, sourceUpdatedAt, syncedAt
  },
  sourceItem->{
    _id, _type, title, kind, creator, url, summary, year,
    image{${complexImageStub}}
  },
  image{${complexImageStub}},
  cover{${complexImageStub}},
  topics[]->{_id, title, slug, color},
  notes[]{
    ...,
    markDefs[]{..., link->{_id, _type, title, slug}},
    items[]->{_id, _type, title, slug, kind, creator, url, summary, excerpt, year, featured, historical}
  },
  commentary[]{
    ...,
    markDefs[]{..., link->{_id, _type, title, slug}}
  }
`;
