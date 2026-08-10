import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';

export const HEADER_QUERY = defineQuery(groq`
  *[_type == "header"][0]{
    _id,
    _type,
    logo{${complexImageStub}},
    nav[]{
      type,
      title,
      reference->{
        _id,
        _type,
        slug
      },
      externalLink{
        type,
        url,
        email,
        phone,
        "fileUrl": file.asset->url
      }
    }
  }
`);
