import { complexImageStub } from '@/sanity/queries/stubs/complex-image';
import { richTextStub } from '@/sanity/queries/stubs/rich-text';
import { quoteStub } from '@/sanity/queries/stubs/quote';

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
    text, attribution, location, locationType, sourceUrl, sourceNote,
    origin, sourceState,
    readwise{
      userBookId, highlightId, externalId, source, sourceUrl, readwiseUrl,
      coverImageUrl, color, highlightedAt, sourceUpdatedAt, syncedAt
    },
    sourceItem->{_id, _type, title, kind, creator, url, summary, year},
    image{${complexImageStub}}, cover{${complexImageStub}},
    topics[]->{_id, title, slug, color},
    notes${richTextStub}, commentary${richTextStub}
  },
  filter{..., topics[]->{_id, title, slug, color}},
  quote->{${quoteStub}}
}`;
