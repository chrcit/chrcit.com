export const navLinkStub = `
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
`;
