import { TRACKS, type LessonTrack } from "@/data/lpc-fr";
import { PACKS, packById, type PackId } from "@/data/packs";
import type { ProgressState } from "@/lib/progress";

type HomeScreenProps = {
  progress: ProgressState;
  pack: PackId;
  onPackChange: (pack: PackId) => void;
  onStart: (track: LessonTrack) => void;
};

export function HomeScreen({
  progress,
  pack,
  onPackChange,
  onStart,
}: HomeScreenProps) {
  const lessons = TRACKS.filter((t) => t.kind === "lesson");
  const reps = TRACKS.filter((t) => t.kind === "reps");
  const free = TRACKS.find((t) => t.kind === "free");
  const custom = TRACKS.find((t) => t.kind === "custom");
  const meta = packById(pack);

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
            Parcours guidé, répétitions, ou mode libre — pack{" "}
            <span className="text-foam">{meta.label}</span>, tout reste sur ton
            appareil.
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

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-foam">
          Système / langue
        </h2>
        <p className="mb-3 text-sm text-mist">
          LPC français et Cued Speech anglais ont des tables différentes —
          progression et succès séparés.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PACKS.map((p) => {
            const active = p.id === pack;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPackChange(p.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-teal bg-teal/15"
                    : "border-panel-2/70 bg-panel/50 hover:border-teal/40"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                  {p.short}
                </p>
                <p className="mt-1 font-display text-lg font-bold">{p.label}</p>
                <p className="mt-0.5 text-xs text-mist">{p.subtitle}</p>
              </button>
            );
          })}
        </div>
      </section>

      {free && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onStart(free.id)}
            className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-teal/40 bg-teal/10 p-5 text-left transition hover:border-teal hover:bg-teal/15"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                Sandbox
              </p>
              <h2 className="mt-1 font-display text-xl font-bold">
                {free.title}
              </h2>
              <p className="mt-1 text-sm text-mist">{free.subtitle}</p>
            </div>
            <span className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-ink">
              Ouvrir
            </span>
          </button>

          {custom && (
            <button
              type="button"
              onClick={() => onStart(custom.id)}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-sky/35 bg-sky/8 p-5 text-left transition hover:border-sky/60 hover:bg-sky/12"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                  Sandbox
                </p>
                <h2 className="mt-1 font-display text-xl font-bold">
                  {custom.title}
                </h2>
                <p className="mt-1 text-sm text-mist">{custom.subtitle}</p>
              </div>
              <span className="rounded-full bg-sky/90 px-3 py-1 text-xs font-semibold text-ink">
                Écrire
              </span>
            </button>
          )}
        </div>
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

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-foam">
          Mode répétitions
        </h2>
        <p className="mb-3 text-sm text-mist">
          3 fois guidé, puis 1 rappel sans guide (bonus si réussi).
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {reps.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onStart(t.id)}
              className="rounded-2xl border border-sky/30 bg-sky/5 p-4 text-left transition hover:border-sky/60 hover:bg-sky/10"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                Drill
              </p>
              <h3 className="mt-1 font-display text-base font-bold">{t.title}</h3>
              <p className="mt-1 text-xs text-mist">{t.subtitle}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
