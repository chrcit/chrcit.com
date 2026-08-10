import { defineDocuments, defineLocations } from 'sanity/presentation';

export const locations = {
  page: defineLocations({
    select: {
      _id: '_id',
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => {
      if (!doc) return { locations: [] };
      if (doc._id === 'homepage') {
        return {
          locations: [{ title: 'Homepage', href: '/' }],
        };
      }

      if (!doc.slug) {
        return { locations: [] };
      }

      const title = doc.title ?? `/${doc.slug}`;
      return {
        locations: [{ title, href: `/${doc.slug}` }],
      };
    },
  }),
};

export const mainDocuments = defineDocuments([
  {
    route: '/',
    filter: `_type == "page" && _id == "homepage"`,
  },
  {
    route: '/:slug',
    filter: `_type == "page" && slug.current == $slug`,
  },
]);
