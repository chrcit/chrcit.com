import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';
import { richTextStub } from '@/sanity/queries/stubs/rich-text';

export const ARTICLE_QUERY = defineQuery(groq`
  *[_type == "article" && slug.current == $slug][0]{
    _id, _type, title, slug, excerpt, publishedAt, externalUrl,
    cover{${complexImageStub}}, topics[]->{_id, title, slug, color},
    meta{title, description, keywords, ogImage{${complexImageStub}}, visibility},
    body${richTextStub}
  }
`);
