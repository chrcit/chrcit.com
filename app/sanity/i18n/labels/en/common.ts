import type {
  CommonLabels,
  ValidationLabels,
} from '@/sanity/i18n/labels/schema';

export const common: CommonLabels = {
  untitled: 'Untitled',
  noAddress: 'No address',
};

export const validation: ValidationLabels = {
  required: 'This field is required',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be at most ${max} characters`,
};
