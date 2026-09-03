import type { APIRoute } from "astro";
import { loadHomeItems } from "../utils/home-items";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await loadHomeItems()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
