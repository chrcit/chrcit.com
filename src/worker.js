const SCRIPT = "/js/script.js";
const EVENT = "/api/event";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === SCRIPT && request.method === "GET") {
      const res = await fetch("https://plausible.io/js/script.js");
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

    return env.ASSETS.fetch(request);
  },
};
