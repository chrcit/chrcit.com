import { client } from '@/lib/sanity';
import { setServerClient, loadQuery } from '@/sanity/loader';

const token =
  process.env.SANITY_API_READ_TOKEN ??
  process.env.SANITY_READ_TOKEN ??
  undefined;

// Published queries must use apicdn (useCdn: true). Keep the read token so
// previewDrafts works; @sanity/react-loader forces useCdn: false for drafts.
setServerClient(client.withConfig({ token, useCdn: true }));

export { loadQuery };
