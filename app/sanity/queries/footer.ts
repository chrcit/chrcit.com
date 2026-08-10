import groq, { defineQuery } from 'groq';
import { complexImageStub } from '@/sanity/queries/stubs/complex-image';

export const FOOTER_QUERY = defineQuery(groq`
  *[_type == "footer"][0]{
    _id,
    _type,
    logo{${complexImageStub}},
    mainNav[]{
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
    },
    secondaryNav[]{
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
    },
    socials[]{platform, url}
  }
`);
