import { createCookie } from "@remix-run/node";

const themeCookie = createCookie("theme", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 31536000, // one year
});

export type Theme = "light" | "dark" | "system";

export async function getTheme(request: Request): Promise<Theme> {
  const cookieHeader = request.headers.get("Cookie");
  const theme = await themeCookie.parse(cookieHeader);
  return theme?.theme || "system";
}

export async function setTheme(theme: Theme) {
  return await themeCookie.serialize({ theme });
}

export async function updateTheme(request: Request, theme: Theme) {
  return new Response(null, {
    status: 200,
    headers: {
      "Set-Cookie": await setTheme(theme),
    },
  });
}
