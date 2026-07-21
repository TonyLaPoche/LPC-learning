import { TRACKS, type LessonTrack } from "@/data/lpc-fr";
import type { ProgressState } from "@/lib/progress";

type HomeScreenProps = {
  progress: ProgressState;
  onStart: (track: LessonTrack) => void;
};

export function HomeScreen({ progress, onStart }: HomeScreenProps) {
  const lessons = TRACKS.filter((t) => t.kind === "lesson");
  const free = TRACKS.find((t) => t.kind === "free");

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
            Parcours guidé (formes → phrases) ou mode libre pour explorer avec
            feedback caméra — tout reste sur ton appareil.
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

      {free && (
        <button
          type="button"
          onClick={() => onStart(free.id)}
          className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-teal/40 bg-teal/10 p-5 text-left transition hover:border-teal hover:bg-teal/15"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Sandbox
            </p>
            <h2 className="mt-1 font-display text-xl font-bold">{free.title}</h2>
            <p className="mt-1 text-sm text-mist">{free.subtitle}</p>
          </div>
          <span className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-ink">
            Ouvrir
          </span>
        </button>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foam">
          Parcours d’apprentissage
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {lessons.map((t) => (
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
                  <h3 className="mt-1 font-display text-xl font-bold">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-sm text-mist">{t.subtitle}</p>
                </div>
                <span className="rounded-full bg-ink/60 px-3 py-1 text-xs text-teal group-hover:bg-teal/20">
                  Jouer
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
