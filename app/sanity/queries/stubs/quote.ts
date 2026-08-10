export const quoteStub = `
  _id,
  _type,
  text,
  attribution,
  location,
  locationType,
  sourceUrl,
  sourceNote,
  origin,
  sourceState,
  featured,
  sortOrder,
  tags,
  topics[]->{_id, title, slug, color},
  readwise{highlightId, externalId, readwiseUrl, color, highlightedAt, sourceUpdatedAt, syncedAt},
  sourceItem->{
    _id, _type, title, kind, creator, url, summary, year,
    image{asset, alt, caption, hotspot, crop}
  },
  commentary[]{
    ...,
    markDefs[]{..., link->{_id, _type, title, slug}}
  }
`;
