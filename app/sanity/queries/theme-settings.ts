import groq, { defineQuery } from 'groq';

export const THEME_SETTINGS_QUERY = defineQuery(groq`
  *[_type == "themeSettings"][0]{
    _id,
    _type,
    brandColor,
    textColor,
    backgroundColor
  }
`);
