import { complexImageStub } from '@/sanity/queries/stubs/complex-image';

export const metaStub = `
  title,
  description,
  keywords,
  ogImage{${complexImageStub}},
  visibility
`;
