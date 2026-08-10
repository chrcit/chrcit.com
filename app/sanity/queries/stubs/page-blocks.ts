import { complexImageStub } from '@/sanity/queries/stubs/complex-image';
import { richTextStub } from '@/sanity/queries/stubs/rich-text';

export const pageBlocksStub = `[]{
  ...,
  image{${complexImageStub}},
  "richBody": body${richTextStub},
  links[]{
    ...,
    reference->{_id, _type, title, slug},
    externalLink{..., "fileUrl": file.asset->url}
  },
  items[]->{
    _id, _type, title, slug, kind, creator, url, externalUrl,
    summary, excerpt, year, publishedAt, featured, historical, sortOrder,
    image{${complexImageStub}}, cover{${complexImageStub}},
    topics[]->{_id, title, slug, color},
    notes${richTextStub}
  },
  filter{..., topics[]->{_id, title, slug, color}}
}`;
