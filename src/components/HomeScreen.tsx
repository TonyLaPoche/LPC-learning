import { TRACKS, type LessonTrack } from "@/data/lpc-fr";
import type { ProgressState } from "@/lib/progress";

type HomeScreenProps = {
  progress: ProgressState;
  onStart: (track: LessonTrack) => void;
};

export function HomeScreen({ progress, onStart }: HomeScreenProps) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-panel-2/60 bg-panel/70 p-6 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px 240px at 20% 0%, rgba(45,212,191,0.35), transparent), radial-gradient(500px 220px at 90% 40%, rgba(56,189,248,0.25), transparent)",
          }}
        />
        <div className="relative max-w-xl">
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            Code avec tes mains.
            <span className="block text-teal">Vois les sons.</span>
          </h1>
          <p className="mt-3 text-base text-mist sm:text-lg">
            Entraîne-toi aux 8 formes et 5 positions du LPC français. Feedback
            caméra en direct, tout reste sur ton appareil.
          </p>
          <p className="mt-4 text-sm text-foam/80">
            XP : <span className="font-semibold text-sky">{progress.xp}</span>
            {" · "}
            Leçons :{" "}
            <span className="font-semibold text-teal">
              {progress.completed.length}
            </span>
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onStart(t.id)}
            className="group rounded-2xl border border-panel-2/70 bg-panel/60 p-5 text-left transition hover:border-teal/50 hover:bg-panel"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                  Étape {t.badge}
                </p>
                <h2 className="mt-1 font-display text-xl font-bold">{t.title}</h2>
                <p className="mt-1 text-sm text-mist">{t.subtitle}</p>
              </div>
              <span className="rounded-full bg-ink/60 px-3 py-1 text-xs text-teal group-hover:bg-teal/20">
                Jouer
              </span>
            </div>
          </button>
        ))}
      </section>

      <p className="text-xs text-mist/80">
        Référentiel pédagogique inspiré du code ALPC — pas un substitut à une
        formation. Voir PRODUCT.md pour les sources.
      </p>
    </div>
  );
}
