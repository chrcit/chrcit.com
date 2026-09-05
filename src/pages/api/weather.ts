import type { APIRoute } from "astro";
import { OPEN_METEO_FORECAST_URL, WEATHER_CACHE_CONTROL } from "../../utils/weather";

export const prerender = false;

export const GET: APIRoute = async () => {
  const res = await fetch(OPEN_METEO_FORECAST_URL, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) return new Response(null, { status: 502 });

  return new Response(res.body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": WEATHER_CACHE_CONTROL,
    },
  });
};
