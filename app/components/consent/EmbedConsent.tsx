import type { ReactNode } from "react";
import { useConsentManager } from "@c15t/react";
import type { AllConsentNames } from "c15t";

const CATEGORY_LABELS: Record<AllConsentNames, string> = {
  necessary: "Necessary",
  functionality: "Functionality",
  measurement: "Measurement",
  experience: "Experience",
  marketing: "Marketing",
};

type Props = {
  category?: AllConsentNames;
  title: string;
  description: string;
  children: ReactNode;
};

export function EmbedConsent({
  category = "experience",
  title,
  description,
  children,
}: Props) {
  const { hasConsentFor, setConsent, saveConsents, setIsPrivacyDialogOpen } =
    useConsentManager();
  const allowed = hasConsentFor(category);

  if (allowed) {
    return <div className="w-full overflow-hidden rounded-[1.25rem]">{children}</div>;
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-[1.25rem] border border-white/10 bg-black/60 p-6 shadow-[var(--shadow-soft)]"
      data-noise
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          {CATEGORY_LABELS[category]}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-[color:var(--color-ink)]">
          {title}
        </h3>
        <p className="mt-2 text-sm text-white/70">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="pressable rounded-full bg-[color:var(--color-brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-[var(--shadow-glow)]"
          onClick={() => {
            setConsent(category, true);
            saveConsents("custom");
          }}
        >
          Allow this embed
        </button>
        <button
          type="button"
          className="pressable rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40 hover:text-white"
          onClick={() => setIsPrivacyDialogOpen(true)}
        >
          Manage settings
        </button>
      </div>
    </div>
  );
}
