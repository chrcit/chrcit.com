import { createCookie } from "@remix-run/node";

export type EmbedType = "youtube" | "twitter" | "instagram" | "reddit";

export interface EmbedConsent {
  youtube: boolean;
  twitter: boolean;
  instagram: boolean;
  reddit: boolean;
}

const embedConsentCookie = createCookie("embed-consent", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 31536000, // one year
});

export async function getEmbedConsent(request: Request): Promise<EmbedConsent> {
  const cookieHeader = request.headers.get("Cookie");
  const consent = await embedConsentCookie.parse(cookieHeader);
  return {
    youtube: consent?.youtube ?? false,
    twitter: consent?.twitter ?? false,
    instagram: consent?.instagram ?? false,
    reddit: consent?.reddit ?? false,
  };
}

export async function setEmbedConsent(consent: Partial<EmbedConsent>) {
  return await embedConsentCookie.serialize(consent);
}

export async function updateEmbedConsent(
  request: Request,
  consent: Partial<EmbedConsent>,
) {
  const currentConsent = await getEmbedConsent(request);
  const newConsent = { ...currentConsent, ...consent };
  return new Response(null, {
    status: 200,
    headers: {
      "Set-Cookie": await setEmbedConsent(newConsent),
    },
  });
}
