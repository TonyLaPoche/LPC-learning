import { useState } from "react";
import { IntroBanner } from "@/components/IntroBanner";
import { TRACKS, type LessonTrack } from "@/data/lpc-fr";
import { PACKS, packById, type PackId } from "@/data/packs";
import type { ProgressState } from "@/lib/progress";
import {
  getTrackStats,
  loadIntroSeen,
  type TrackStats,
} from "@/lib/trackProgress";

type PracticeTrack = Exclude<LessonTrack, "free" | "custom">;

type HomeScreenProps = {
  progress: ProgressState;
  pack: PackId;
  onPackChange: (pack: PackId) => void;
  onStart: (track: LessonTrack, resumeIndex?: number) => void;
  /** Uniquement en mode développement. */
  onOpenDebugZones?: () => void;
  onOpenDebugHands?: () => void;
  onOpenDebugPositions?: () => void;
  onOpenDebugSyllables?: () => void;
};

function statusBadge(stats: TrackStats): { label: string; className: string } {
  if (stats.status === "done") {
    return {
      label: "Terminé",
      className: "bg-ok/20 text-ok",
    };
  }
  if (stats.status === "progress") {
    return {
      label: `Reprendre · ${stats.done}/${stats.total}`,
      className: "bg-teal/20 text-teal",
    };
  }
  return {
    label: "Jouer",
    className: "bg-ink/60 text-teal group-hover:bg-teal/20",
  };
}

export function HomeScreen({
  progress,
  pack,
  onPackChange,
  onStart,
  onOpenDebugZones,
  onOpenDebugHands,
  onOpenDebugPositions,
  onOpenDebugSyllables,
}: HomeScreenProps) {
  const [showIntro, setShowIntro] = useState(() => !loadIntroSeen());
  const lessons = TRACKS.filter((t) => t.kind === "lesson" && !t.hidden);
  const reps = TRACKS.filter((t) => t.kind === "reps" && !t.hidden);
  const free = TRACKS.find((t) => t.kind === "free" && !t.hidden);
  const custom = TRACKS.find((t) => t.kind === "custom" && !t.hidden);
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
            Parcours guidé et répétitions — pack{" "}
            <span className="text-foam">{meta.label}</span>, progression locale
            sur ton appareil (pas besoin de compte).
          </p>
          <p className="mt-4 text-sm text-foam/80">
            XP : <span className="font-semibold text-sky">{progress.xp}</span>
            {" · "}
            Clés validées :{" "}
            <span className="font-semibold text-teal">
              {progress.completed.length}
            </span>
          </p>
        </div>
      </section>

      {showIntro && <IntroBanner onDismiss={() => setShowIntro(false)} />}

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

      {(onOpenDebugZones ||
        onOpenDebugHands ||
        onOpenDebugPositions ||
        onOpenDebugSyllables) && (
        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-amber-200">
            Debug
          </h2>
          <p className="mb-3 text-sm text-mist">
            Outils internes — visibles uniquement en développement.
          </p>
          <div className="space-y-3">
            {onOpenDebugZones && (
              <button
                type="button"
                onClick={onOpenDebugZones}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-400/45 bg-amber-400/10 p-5 text-left transition hover:border-amber-300/70 hover:bg-amber-400/15"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Outil 1
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">
                    Placement des zones
                  </h3>
                  <p className="mt-1 text-sm text-mist">
                    Drag & drop des rectangles trigger sur ta caméra, export
                    JSON.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-ink">
                  Ouvrir
                </span>
              </button>
            )}
            {onOpenDebugHands && (
              <button
                type="button"
                onClick={onOpenDebugHands}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-400/45 bg-amber-400/10 p-5 text-left transition hover:border-amber-300/70 hover:bg-amber-400/15"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Outil 2
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">
                    Placement des doigts
                  </h3>
                  <p className="mt-1 text-sm text-mist">
                    Scanner une forme c1–c8 ; JSON si mismatch détection.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-ink">
                  Ouvrir
                </span>
              </button>
            )}
            {onOpenDebugPositions && (
              <button
                type="button"
                onClick={onOpenDebugPositions}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-400/45 bg-amber-400/10 p-5 text-left transition hover:border-amber-300/70 hover:bg-amber-400/15"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Outil 3
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">
                    Positions voyelles
                  </h3>
                  <p className="mt-1 text-sm text-mist">
                    Scanner une zone (5 positions) ; JSON si mismatch.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-ink">
                  Ouvrir
                </span>
              </button>
            )}
            {onOpenDebugSyllables && (
              <button
                type="button"
                onClick={onOpenDebugSyllables}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-400/45 bg-amber-400/10 p-5 text-left transition hover:border-amber-300/70 hover:bg-amber-400/15"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Outil 4
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">
                    Syllabes (clé complète)
                  </h3>
                  <p className="mt-1 text-sm text-mist">
                    Forme + zone comme le parcours ; JSON si mismatch.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-ink">
                  Ouvrir
                </span>
              </button>
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foam">
          Parcours d’apprentissage
        </h2>
        <p className="mb-3 text-sm text-mist">
          Les pastilles indiquent ce qui est déjà validé — tu peux reprendre où
          tu t’es arrêté.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {lessons.map((t) => {
            const stats = getTrackStats(t.id as PracticeTrack, pack, progress);
            const badge = statusBadge(stats);
            const pct =
              stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  onStart(
                    t.id,
                    stats.status === "done" ? 0 : stats.resumeIndex,
                  )
                }
                className="group rounded-2xl border border-panel-2/70 bg-panel/60 p-5 text-left transition hover:border-teal/50 hover:bg-panel"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                      Étape {t.badge}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-sm text-mist">{t.subtitle}</p>
                    {stats.total > 0 && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/70">
                        <div
                          className="h-full rounded-full bg-teal/80"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </button>
            );
          })}
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
          {reps.map((t) => {
            const stats = getTrackStats(t.id as PracticeTrack, pack, progress);
            const badge = statusBadge(stats);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  onStart(
                    t.id,
                    stats.status === "done" ? 0 : stats.resumeIndex,
                  )
                }
                className="rounded-2xl border border-sky/30 bg-sky/5 p-4 text-left transition hover:border-sky/60 hover:bg-sky/10"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                  Drill
                </p>
                <h3 className="mt-1 font-display text-base font-bold">
                  {t.title}
                </h3>
                <p className="mt-1 text-xs text-mist">{t.subtitle}</p>
                <p className={`mt-2 text-[10px] font-semibold ${badge.className.includes("ok") ? "text-ok" : "text-sky"}`}>
                  {badge.label}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
