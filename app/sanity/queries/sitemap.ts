import groq, { defineQuery } from 'groq';

export const SITEMAP_QUERY = defineQuery(groq`
  *[
    _type in ["page", "article", "project"] &&
    (meta.visibility == "public" || !defined(meta.visibility)) &&
    !(slug.current in ["about", "things", "writing"])
  ]{
    "url": select(
      _id == "homepage" => "/",
      _type == "article" && defined(slug.current) => "/writing/" + slug.current,
      _type == "project" && defined(slug.current) => "/projects/" + slug.current,
      _type == "page" && defined(slug.current) => "/" + slug.current,
      null
    ),
    _updatedAt
  }[defined(url)]
`);
