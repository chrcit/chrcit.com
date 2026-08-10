import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.markInternalLink;

export const markInternalLink = defineType({
  name: 'markInternalLink',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'link',
      title: l.fields.link.title,
      type: 'reference',
      to: [{ type: 'page' }, { type: 'article' }, { type: 'project' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
