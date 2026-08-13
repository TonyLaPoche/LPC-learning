/** Consentement cookies / analytics (RGPD) — stocké en localStorage. */

export type ConsentPreferences = {
  /** Mesure d’audience (PostHog events) */
  analytics: boolean;
  /** Session replay PostHog (écrans, clics — hors flux caméra) */
  replay: boolean;
};

export type ConsentState = ConsentPreferences & {
  /** true une fois que l’utilisateur a fait un choix explicite */
  decided: boolean;
  updatedAt: string;
};

const CONSENT_KEY = "cle-lpc-consent-v1";

export const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  replay: false,
  decided: false,
  updatedAt: "",
};

export function loadConsent(): ConsentState {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return { ...DEFAULT_CONSENT };
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      analytics: Boolean(parsed.analytics),
      replay: Boolean(parsed.replay),
      decided: Boolean(parsed.decided),
      updatedAt:
        typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

export function saveConsent(
  prefs: ConsentPreferences & { decided?: boolean },
): ConsentState {
  const next: ConsentState = {
    analytics: prefs.analytics,
    replay: prefs.replay && prefs.analytics,
    decided: prefs.decided ?? true,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function acceptAllConsent(): ConsentState {
  return saveConsent({ analytics: true, replay: true });
}

export function rejectAllConsent(): ConsentState {
  return saveConsent({ analytics: false, replay: false });
}
