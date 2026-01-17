import type { ReactNode } from "react";
import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from "@c15t/react";

const CONSENT_CATEGORIES = [
  "necessary",
  "functionality",
  "measurement",
  "experience",
  "marketing",
] as const;

export function ConsentProvider({ children }: { children: ReactNode }) {
  return (
    <ConsentManagerProvider
      options={{
        mode: "offline",
        consentCategories: [...CONSENT_CATEGORIES],
      }}
    >
      {children}
      <CookieBanner
        title="Privacy settings"
        description="Choose what you allow. We only load embeds and analytics when you say so."
        acceptButtonText="Accept all"
        rejectButtonText="Reject"
        customizeButtonText="Manage"
      />
      <ConsentManagerDialog />
    </ConsentManagerProvider>
  );
}
