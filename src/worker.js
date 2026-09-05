import { handle } from "@astrojs/cloudflare/handler";
import { HOME_CACHE_CONTROL } from "./utils/home-sample.ts";
import { VIENNA_WX_PATH, WEATHER_CACHE_CONTROL } from "./utils/weather.ts";

const SCRIPT = "/js/script.js";
const EVENT = "/api/event";

const isHomepage = (pathname) => pathname === "/" || pathname === "";
const isWeather = (pathname) => pathname === VIENNA_WX_PATH || pathname === `${VIENNA_WX_PATH}/`;

const cacheKey = (request, pathname) => new Request(new URL(pathname, request.url), { method: "GET" });

const cachedGet = async (request, ctx, pathname, cacheControl, load) => {
  if (request.method !== "GET") return load();

  const cache = caches.default;
  const key = cacheKey(request, pathname);
  const hit = await cache.match(key);
  if (hit) return hit;

  const generated = await load();
  if (generated.status !== 200) return generated;

  const cached = new Response(generated.body, generated);
  cached.headers.set("Cache-Control", cacheControl);
  ctx.waitUntil(cache.put(key, cached.clone()));
  return cached;
};

let viennaForecastInflight = null;

const loadViennaForecast = (request, env, ctx) => {
  if (!viennaForecastInflight) {
    viennaForecastInflight = handle(request, env, ctx).finally(() => {
      viennaForecastInflight = null;
    });
  }
  return viennaForecastInflight.then((res) => res.clone());
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

    if (isWeather(url.pathname)) {
      if (request.method !== "GET") {
        return new Response(null, { status: 405, headers: { Allow: "GET" } });
      }
      return cachedGet(request, ctx, VIENNA_WX_PATH, WEATHER_CACHE_CONTROL, () =>
        loadViennaForecast(request, env, ctx),
      );
    }

    if (isHomepage(url.pathname)) {
      return cachedGet(request, ctx, "/", HOME_CACHE_CONTROL, () => handle(request, env, ctx));
    }

    return handle(request, env, ctx);
  },
};
