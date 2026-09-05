import { handle } from "@astrojs/cloudflare/handler";
import { HOME_CACHE_CONTROL } from "./utils/home-sample.ts";

const SCRIPT = "/js/script.js";
const EVENT = "/api/event";

const isHomepage = (pathname) => pathname === "/" || pathname === "";

const cachedHomepage = async (request, env, ctx) => {
  if (request.method !== "GET") return handle(request, env, ctx);

  const cache = caches.default;
  const key = new Request(new URL("/", request.url), { method: "GET" });
  const hit = await cache.match(key);
  if (hit) return hit;

  const generated = await handle(request, env, ctx);
  if (generated.status !== 200) return generated;

  const cached = new Response(generated.body, generated);
  cached.headers.set("Cache-Control", HOME_CACHE_CONTROL);
  ctx.waitUntil(cache.put(key, cached.clone()));
  return cached;
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === SCRIPT && request.method === "GET") {
      const res = await fetch("https://plausible.io/js/script.outbound-links.js");
      const headers = new Headers(res.headers);
      headers.set("Cache-Control", "public, max-age=86400");
      headers.delete("set-cookie");
      return new Response(res.body, { status: res.status, headers });
    }

    if (url.pathname === EVENT) {
      const proxied = new Request("https://plausible.io/api/event", request);
      proxied.headers.delete("cookie");
      return fetch(proxied);
    }

    if (isHomepage(url.pathname)) return cachedHomepage(request, env, ctx);

    return handle(request, env, ctx);
  },
};
