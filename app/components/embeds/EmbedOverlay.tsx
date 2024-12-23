import { useFetcher } from "@remix-run/react";
import { type EmbedType } from "~/utils/embed-consent";
import clsx from "clsx";

interface EmbedOverlayProps {
  type: EmbedType;
  title: string;
  description: string;
  hasConsent: boolean;
  children: React.ReactNode;
}

export function EmbedOverlay({
  type,
  title,
  description,
  hasConsent,
  children,
}: EmbedOverlayProps) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  if (hasConsent) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-[300px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-gray-100 p-8 text-center">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <fetcher.Form method="post" action="/api/embed-consent">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="value" value="true" />
        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            "rounded-md bg-brand px-4 py-2 text-white transition-all",
            "hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
            isLoading && "opacity-50",
          )}
        >
          {isLoading ? "Loading..." : "Load Embed"}
        </button>
      </fetcher.Form>

      <p className="mt-2 text-sm text-gray-500">
        By clicking "Load Embed", you consent to loading content from{" "}
        <span className="font-medium capitalize">{type}</span>. This setting
        will be remembered for future embeds.
      </p>
    </div>
  );
}
