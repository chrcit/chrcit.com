import { complexImageStub } from '@/sanity/queries/stubs/complex-image';

export const richTextStub = `[]{
  ...,
  "markDefs": coalesce(markDefs, [])[]{
    ...,
    link->{
      _id,
      _type,
      slug
    }
  },
  items[]->{
    _id, _type, title, slug, kind, creator, url, externalUrl,
    summary, excerpt, year, publishedAt, featured, historical, sortOrder,
    image{${complexImageStub}},
    cover{${complexImageStub}},
    topics[]->{_id, title, slug, color}
  },
  filter{..., topics[]->{_id, title, slug, color}}
}`;
