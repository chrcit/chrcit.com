import { defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.richText;

export const richText = defineType({
  name: 'richText',
  title: l.title,
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: l.styles.normal, value: 'normal' },
        { title: l.styles.h1, value: 'h1' },
        { title: l.styles.h2, value: 'h2' },
        { title: l.styles.h3, value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: l.lists.bullet, value: 'bullet' },
        { title: l.lists.number, value: 'number' },
      ],
      marks: {
        decorators: [
          { title: l.decorators.strong, value: 'strong' },
          { title: l.decorators.em, value: 'em' },
          { title: l.decorators.code, value: 'code' },
        ],
        annotations: [
          { type: 'markExternalLink' },
          { type: 'markInternalLink' },
          {
            name: 'popupText',
            title: 'Popup note',
            type: 'object',
            fields: [
              { name: 'label', title: 'Accessible label', type: 'string' },
              { name: 'text', title: 'Note', type: 'text', rows: 4 },
            ],
          },
        ],
      },
    },
    { type: 'complexImage' },
    { type: 'separator' },
    { type: 'referenceCollection' },
    { type: 'quoteBlock' },
  ],
});
