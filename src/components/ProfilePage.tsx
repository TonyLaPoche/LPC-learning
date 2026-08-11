import { useState } from "react";
import {
  achievementStats,
  computeAchievements,
  isAchievementWired,
} from "@/lib/achievements";
import { packById, type PackId } from "@/data/packs";
import { loadProgress, resetAllProgress, type ProgressState } from "@/lib/progress";
import { clearAllTrackCursors } from "@/lib/trackProgress";
import {
  clearVisitFlags,
  loadCustomVisited,
  loadFreeVisited,
} from "@/lib/visits";

type ProfilePageProps = {
  progress: ProgressState;
  pack: PackId;
  onProgressChange: (next: ProgressState) => void;
};

export function ProfilePage({
  progress,
  pack,
  onProgressChange,
}: ProfilePageProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const freeVisited = loadFreeVisited();
  const customVisited = loadCustomVisited();
  const achievements = computeAchievements(
    progress,
    freeVisited,
    pack,
    customVisited,
  );
  const { unlocked, total } = achievementStats(achievements);
  const meta = packById(pack);
  const last = progress.lastPlayedAt
    ? new Date(progress.lastPlayedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const doReset = () => {
    resetAllProgress();
    clearAllTrackCursors();
    clearVisitFlags();
    onProgressChange(loadProgress(pack));
    setConfirmReset(false);
  };

  return (
    <div className="space-y-6 pb-2">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          Profil · {meta.short}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foam">
          Pack {meta.label}
        </h1>
        <p className="mt-2 text-mist">
          XP, leçons et succès de ce pack — séparés de l’autre pack.
        </p>
      </header>

      <section className="grid grid-cols-3 gap-2">
        <Stat label="XP" value={String(progress.xp)} accent="text-sky" />
        <Stat
          label="Leçons"
          value={String(progress.completed.length)}
          accent="text-teal"
        />
        <Stat
          label="Succès"
          value={`${unlocked}/${total}`}
          accent="text-coral"
        />
      </section>

      <p className="text-xs text-mist">Dernière session : {last}</p>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Succès</h2>
        <ul className="space-y-2">
          {achievements.map((a) => {
            const wired = isAchievementWired(a);
            return (
              <li
                key={a.id}
                className={`rounded-2xl border p-3 ${
                  !wired
                    ? "border-panel-2/40 bg-panel/25 opacity-45"
                    : a.unlocked
                      ? "border-teal/40 bg-teal/10"
                      : "border-panel-2/60 bg-panel/40 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`font-semibold ${
                        !wired
                          ? "text-mist/70"
                          : a.unlocked
                            ? "text-teal"
                            : "text-mist"
                      }`}
                    >
                      {a.title}
                      {!wired && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-amber-200/80">
                          Bientôt
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-mist">{a.description}</p>
                  </div>
                  <span className="shrink-0 text-lg" aria-hidden>
                    {!wired ? "∅" : a.unlocked ? "✓" : "·"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-coral/30 bg-coral/5 p-4">
        <h2 className="font-display text-lg font-bold text-foam">
          Zone sensible
        </h2>
        <p className="mt-1 text-sm text-mist">
          Efface XP, leçons validées, succès et reprises — pour{" "}
          <strong className="text-foam">tous les packs</strong> sur cet
          appareil.
        </p>
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="mt-3 rounded-full border border-coral/50 px-4 py-2 text-sm font-semibold text-coral hover:bg-coral/10"
          >
            Reset ma progression
          </button>
        ) : (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-coral">
              Confirmer ? Action irréversible.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={doReset}
                className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-ink"
              >
                Oui, tout effacer
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-full border border-panel-2 px-4 py-2 text-sm text-mist hover:text-foam"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-panel-2/70 bg-panel/60 p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-mist">{label}</p>
      <p className={`mt-1 font-display text-xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
