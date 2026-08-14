import type { LessonTrack } from "@/data/lpc-fr";

type TrackIntroModalProps = {
  track: "shapes" | "positions";
  onContinue: () => void;
  onSkipForever: () => void;
  onCancel: () => void;
};

const COPY: Record<
  "shapes" | "positions",
  { eyebrow: string; title: string; body: string[]; tip: string }
> = {
  shapes: {
    eyebrow: "Étape 1 · Initiation",
    title: "Qu’est-ce qu’une clé ?",
    body: [
      "En LPC, une clé est une configuration de la main (doigts) qui code les consonnes.",
      "Il y a 8 clés. Tu vas les reconnaître une par une avec la caméra — sans te préoccuper encore du visage.",
      "Exemple : l’Index (clé 1) sert souvent à pointer ; d’autres clés ouvrent ou ferment des doigts.",
    ],
    tip: "Objectif : que la caméra reconnaisse ta main. Prends ton temps.",
  },
  positions: {
    eyebrow: "Étape 2 · Initiation",
    title: "À quoi servent les zones ?",
    body: [
      "Les 5 zones autour du visage (côté, œil, bouche, menton, gorge) codent les voyelles.",
      "Tu places ta main dans une zone pour compléter la clé : configuration × zone = son.",
      "Pour t’entraîner, pointe de préférence avec l’Index (clé 1) — les autres formes restent valides.",
    ],
    tip: "Objectif : viser la bonne zone et y tenir la main un court instant.",
  },
};

export function TrackIntroModal({
  track,
  onContinue,
  onSkipForever,
  onCancel,
}: TrackIntroModalProps) {
  const c = COPY[track];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-intro-title"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-teal/35 bg-panel p-5 shadow-2xl sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          {c.eyebrow}
        </p>
        <h2
          id="track-intro-title"
          className="mt-1 font-display text-2xl font-bold text-foam"
        >
          {c.title}
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-mist">
          {c.body.map((line) => (
            <li key={line.slice(0, 24)} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-2xl border border-teal/30 bg-teal/10 px-3 py-2.5 text-sm text-foam">
          {c.tip}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-2xl bg-teal px-4 py-3 font-display text-base font-bold text-ink transition hover:bg-teal/90"
          >
            C’est parti
          </button>
          <button
            type="button"
            onClick={onSkipForever}
            className="w-full rounded-2xl border border-panel-2 px-4 py-2.5 text-sm text-mist transition hover:border-foam/40 hover:text-foam"
          >
            Ne plus afficher cette intro
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-xs text-mist/70 hover:text-mist"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export function isTrackIntroTrack(
  track: LessonTrack,
): track is "shapes" | "positions" {
  return track === "shapes" || track === "positions";
}
