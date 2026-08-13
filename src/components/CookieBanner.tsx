import { useState } from "react";
import {
  acceptAllConsent,
  loadConsent,
  rejectAllConsent,
  saveConsent,
  type ConsentState,
} from "@/lib/consent";
import { applyConsentToPostHog } from "@/lib/posthog";

type CookieBannerProps = {
  /** Ouvre les réglages même si un choix a déjà été fait */
  forceOpen?: boolean;
  onCloseSettings?: () => void;
  onNavigateCookies?: () => void;
};

export function CookieBanner({
  forceOpen = false,
  onCloseSettings,
  onNavigateCookies,
}: CookieBannerProps) {
  const [consent, setConsent] = useState<ConsentState>(() => loadConsent());
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [replay, setReplay] = useState(consent.replay);

  const visible = forceOpen || !consent.decided;
  if (!visible) return null;

  const commit = (next: ConsentState) => {
    setConsent(next);
    setAnalytics(next.analytics);
    setReplay(next.replay);
    applyConsentToPostHog(next);
    setCustomize(false);
    onCloseSettings?.();
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-panel-2/80 bg-ink/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-5">
        <p
          id="cookie-banner-title"
          className="font-display text-base font-bold text-foam sm:text-lg"
        >
          Cookies & mesure d’audience
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-mist">
          CléLPC utilise PostHog (UE) pour comprendre l’usage de l’app — uniquement
          si tu acceptes. La caméra et ta progression restent locales.{" "}
          {onNavigateCookies && (
            <button
              type="button"
              onClick={onNavigateCookies}
              className="text-teal underline-offset-2 hover:underline"
            >
              Politique cookies
            </button>
          )}
        </p>

        {customize && (
          <div className="mt-4 space-y-3 rounded-xl border border-panel-2/60 bg-panel/50 p-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => {
                  const on = e.target.checked;
                  setAnalytics(on);
                  if (!on) setReplay(false);
                }}
                className="mt-1 accent-teal"
              />
              <span>
                <span className="block text-sm font-medium text-foam">
                  Analytics
                </span>
                <span className="text-xs text-mist">
                  Pages vues, parcours d’apprentissage, erreurs techniques
                  (PostHog).
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={replay}
                disabled={!analytics}
                onChange={(e) => setReplay(e.target.checked)}
                className="mt-1 accent-teal disabled:opacity-40"
              />
              <span>
                <span className="block text-sm font-medium text-foam">
                  Replay de session
                </span>
                <span className="text-xs text-mist">
                  Enregistrement anonymisé de navigation (clics, écrans). Le
                  flux caméra n’est jamais capturé.
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {customize ? (
            <>
              <button
                type="button"
                onClick={() =>
                  commit(saveConsent({ analytics, replay }))
                }
                className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setCustomize(false)}
                className="rounded-full border border-panel-2 px-4 py-2 text-sm text-mist transition hover:border-teal/40 hover:text-foam"
              >
                Retour
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => commit(acceptAllConsent())}
                className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
              >
                Tout accepter
              </button>
              <button
                type="button"
                onClick={() => commit(rejectAllConsent())}
                className="rounded-full border border-panel-2 px-4 py-2 text-sm text-mist transition hover:border-coral/40 hover:text-foam"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={() => setCustomize(true)}
                className="rounded-full px-3 py-2 text-sm text-sky transition hover:underline"
              >
                Personnaliser
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
