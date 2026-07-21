import {
  achievementStats,
  computeAchievements,
} from "@/lib/achievements";
import type { ProgressState } from "@/lib/progress";
import { loadFreeVisited } from "@/lib/visits";

type ProfilePageProps = {
  progress: ProgressState;
};

export function ProfilePage({ progress }: ProfilePageProps) {
  const freeVisited = loadFreeVisited();
  const achievements = computeAchievements(progress, freeVisited);
  const { unlocked, total } = achievementStats(achievements);
  const last = progress.lastPlayedAt
    ? new Date(progress.lastPlayedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6 pb-2">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          Profil
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foam">
          Ton parcours
        </h1>
        <p className="mt-2 text-mist">
          XP, leçons validées et succès — tout reste sur cet appareil.
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
          {achievements.map((a) => (
            <li
              key={a.id}
              className={`rounded-2xl border p-3 ${
                a.unlocked
                  ? "border-teal/40 bg-teal/10"
                  : "border-panel-2/60 bg-panel/40 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p
                    className={`font-semibold ${a.unlocked ? "text-teal" : "text-mist"}`}
                  >
                    {a.title}
                  </p>
                  <p className="mt-0.5 text-xs text-mist">{a.description}</p>
                </div>
                <span className="shrink-0 text-lg" aria-hidden>
                  {a.unlocked ? "✓" : "·"}
                </span>
              </div>
            </li>
          ))}
        </ul>
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
