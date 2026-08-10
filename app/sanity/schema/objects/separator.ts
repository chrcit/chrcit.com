import { defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.separator;

export const separator = defineType({
  name: 'separator',
  title: l.title,
  type: 'object',
  fields: [
    {
      name: 'info',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue:
        'Object type "separator": This is an empty separator object used to visually organize content.',
    },
  ],
  preview: {
    prepare() {
      return { title: l.title, subtitle: 'Object type "separator"' };
    },
  },
});
