import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';
import { richTextStub } from '@/sanity/queries/stubs/rich-text';
import { pageBlocksStub } from '@/sanity/queries/stubs/page-blocks';
import { contentItemStub } from '@/sanity/queries/stubs/content-item';

export const HOMEPAGE_QUERY = defineQuery(groq`
  *[_type == "page" && _id == "homepage"][0]{
    _id,
    _type,
    title,
    slug,
    meta{
      title,
      description,
      keywords,
      ogImage{${complexImageStub}},
      visibility
    },
    contentMode,
    showTableOfContents,
    richText${richTextStub},
    components${pageBlocksStub},
    "library": *[
      _type in ["thing", "project", "article"] &&
      (meta.visibility == "public" || !defined(meta.visibility))
    ]{${contentItemStub}}
  }
`);
