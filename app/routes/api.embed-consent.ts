import { json, type ActionFunctionArgs } from "@remix-run/node";
import { updateEmbedConsent } from "~/utils/embed-consent";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const consent = Object.fromEntries(formData.entries());

    // Convert string values to booleans
    const parsedConsent = Object.entries(consent).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value === "true",
      }),
      {},
    );

    return await updateEmbedConsent(request, parsedConsent);
  } catch (error) {
    console.error("Error updating embed consent:", error);
    return json({ error: "Failed to update embed consent" }, { status: 500 });
  }
}
