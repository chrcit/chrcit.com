import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';
import { richTextStub } from '@/sanity/queries/stubs/rich-text';
import { pageBlocksStub } from '@/sanity/queries/stubs/page-blocks';
import { contentItemStub } from '@/sanity/queries/stubs/content-item';

export const PROJECT_QUERY = defineQuery(groq`
  *[_type == "project" && slug.current == $slug][0]{
    _id, _type, title, slug, summary, url, year, historical,
    cover{${complexImageStub}},
    topics[]->{_id, title, slug, color},
    meta{title, description, keywords, ogImage{${complexImageStub}}, visibility},
    body${richTextStub}, components${pageBlocksStub},
    "library": *[_type in ["thing", "project", "article"] && (meta.visibility == "public" || !defined(meta.visibility))]{${contentItemStub}}
  }
`);
