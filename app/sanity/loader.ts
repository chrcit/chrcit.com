import { createQueryStore } from '@sanity/react-loader';

export const { loadQuery, setServerClient, useQuery, useLiveMode } =
  createQueryStore({ client: false, ssr: true });
