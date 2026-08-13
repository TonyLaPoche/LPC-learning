import posthog from "posthog-js";
import { loadConsent, type ConsentPreferences } from "@/lib/consent";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const posthogClient =
  typeof posthogKey === "string" &&
  posthogKey.length > 0 &&
  typeof posthogHost === "string" &&
  posthogHost.length > 0
    ? posthog
    : null;

if (posthogClient && posthogKey && posthogHost) {
  const consent = loadConsent();

  posthogClient.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2026-05-30",
    // Pas de capture tant que l’utilisateur n’a pas consenti (RGPD).
    opt_out_capturing_by_default: true,
    persistence: "localStorage+cookie",
    // SPA : on pilote les pageviews via analytics.ts (+ history).
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: "identified_only",
    // Replay OFF jusqu’au consentement « replay ».
    disable_session_recording: true,
    session_recording: {
      maskAllInputs: true,
      // Caméra / landmarks : jamais dans le replay.
      blockSelector: "video, canvas",
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });

  if (consent.decided && consent.analytics) {
    applyConsentToPostHog(consent);
  }
} else if (import.meta.env.DEV) {
  const missingVariable = posthogKey
    ? "VITE_POSTHOG_HOST"
    : "VITE_POSTHOG_KEY";

  console.warn(
    `[PostHog] ${missingVariable} manquante — les events ne seront pas envoyés.`,
  );
}

/** Applique le choix cookies à PostHog (opt-in / opt-out + replay). */
export function applyConsentToPostHog(prefs: ConsentPreferences): void {
  if (!posthogClient) return;

  if (prefs.analytics) {
    posthogClient.opt_in_capturing();
    if (prefs.replay) {
      // Ne démarre le replay que si explicitement accepté.
      posthogClient.startSessionRecording();
    } else {
      posthogClient.stopSessionRecording();
    }
  } else {
    posthogClient.stopSessionRecording();
    posthogClient.opt_out_capturing();
  }
}

/** Replay actif uniquement si analytics + replay consentis. */
export function isSessionReplayAllowed(): boolean {
  const c = loadConsent();
  return c.decided && c.analytics && c.replay;
}

export default posthogClient;
