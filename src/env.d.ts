/// <reference types="@astrojs/cloudflare/types" />

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

declare module "cloudflare:workers" {
  export const env: Env;
}
