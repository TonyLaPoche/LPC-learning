import { useEffect, useRef, useState } from "react";
import { IntroBanner } from "@/components/IntroBanner";
import { TRACKS, type LessonTrack } from "@/data/lpc-fr";
import { PACKS, PACK_WIP, packById, type PackId } from "@/data/packs";
import type { ProgressState } from "@/lib/progress";
import posthog from "@/lib/posthog";
import { BUY_ME_A_COFFEE_URL, SUPPORT_COPY } from "@/lib/support";
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
  /** Tape « debug » sur l’accueil pour basculer le menu. */
  onToggleDebugMenu?: () => void;
  /** Menu debug visible (dev ou code clavier). */
  debugMenuOpen?: boolean;
  onOpenDebugZones?: () => void;
  onOpenDebugZoneEditor?: () => void;
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
  onToggleDebugMenu,
  debugMenuOpen,
  onOpenDebugZones,
  onOpenDebugZoneEditor,
  onOpenDebugHands,
  onOpenDebugPositions,
  onOpenDebugSyllables,
}: HomeScreenProps) {
  const [showIntro, setShowIntro] = useState(() => !loadIntroSeen());
  const [enWipOpen, setEnWipOpen] = useState(false);
  const [debugToast, setDebugToast] = useState<string | null>(null);
  const bufferRef = useRef("");
  const resetTimer = useRef(0);

  useEffect(() => {
    if (!onToggleDebugMenu) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      ) {
        return;
      }
      if (e.key.length !== 1) return;
      const ch = e.key.toLowerCase();
      if (!/[a-z]/.test(ch)) {
        bufferRef.current = "";
        return;
      }
      bufferRef.current = (bufferRef.current + ch).slice(-5);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => {
        bufferRef.current = "";
      }, 1600);
      if (bufferRef.current === "debug") {
        bufferRef.current = "";
        onToggleDebugMenu();
        setDebugToast(
          debugMenuOpen ? "Debug masqué" : "Debug déverrouillé",
        );
        window.setTimeout(() => setDebugToast(null), 1800);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(resetTimer.current);
    };
  }, [onToggleDebugMenu, debugMenuOpen]);

  const lessons = TRACKS.filter((t) => t.kind === "lesson" && !t.hidden);
  const reps = TRACKS.filter((t) => t.kind === "reps" && !t.hidden);
  const free = TRACKS.find((t) => t.kind === "free" && !t.hidden);
  const custom = TRACKS.find((t) => t.kind === "custom" && !t.hidden);
  const meta = packById(pack);

  return (
    <div className="space-y-6">
      {debugToast && (
        <div
          className="fixed bottom-20 left-1/2 z-[10001] -translate-x-1/2 rounded-full border border-amber-400/50 bg-ink/95 px-4 py-2 text-sm font-semibold text-amber-100 shadow-lg"
          role="status"
        >
          {debugToast}
        </div>
      )}
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
          {PACK_WIP.en
            ? "LPC français disponible. Le Cued Speech anglais arrive bientôt — aide-nous à le financer."
            : "LPC français et Cued Speech anglais (dev) — tables et progression séparées."}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PACKS.map((p) => {
            const wip = PACK_WIP[p.id];
            const active = !wip && p.id === pack;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  if (wip) {
                    setEnWipOpen(true);
                    return;
                  }
                  onPackChange(p.id);
                }}
                onContextMenu={
                  p.id === "en" && import.meta.env.DEV
                    ? (e) => {
                        e.preventDefault();
                        setEnWipOpen(true);
                      }
                    : undefined
                }
                aria-disabled={wip}
                className={`rounded-2xl border p-4 text-left transition ${
                  wip
                    ? "border-panel-2/50 bg-panel/30 opacity-70 hover:border-amber-400/40 hover:opacity-90"
                    : active
                      ? "border-teal bg-teal/15"
                      : "border-panel-2/70 bg-panel/50 hover:border-teal/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky">
                    {p.short}
                  </p>
                  {wip ? (
                    <span className="rounded-full bg-amber-300/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                      Bientôt
                    </span>
                  ) : (
                    p.id === "en" &&
                    import.meta.env.DEV && (
                      <span className="rounded-full bg-ok/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ok">
                        Dev
                      </span>
                    )
                  )}
                </div>
                <p className="mt-1 font-display text-lg font-bold">{p.label}</p>
                <p className="mt-0.5 text-xs text-mist">{p.subtitle}</p>
                {p.id === "en" && import.meta.env.DEV && (
                  <p className="mt-2 text-[10px] text-amber-200/90">
                    Clic droit → prévisualiser la modal FOMO (prod)
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {enWipOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-ink/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="en-wip-title"
          onClick={() => setEnWipOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-400/35 bg-panel shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-amber-400/25 bg-amber-400/10 px-6 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                Exclusive · English Cued Speech
              </p>
              <h2
                id="en-wip-title"
                className="mt-1 font-display text-2xl font-bold text-foam"
              >
                Presque là — il manque un coup de pouce
              </h2>
            </div>
            <div className="space-y-3 px-6 py-5">
              <p className="text-sm leading-relaxed text-mist">
                Le pack anglais est en cours de construction. Sans soutien, il
                reste en file d’attente derrière le LPC français que tu utilises
                déjà gratuitement.
              </p>
              <p className="text-sm leading-relaxed text-foam/90">
                Un café sur Buy me a coffee, c’est concrètement du temps de
                dév pour débloquer les tables EN, les drills et la progression
                séparée.{" "}
                <span className="text-amber-200">
                  Plus on est soutenus, plus vite ça sort.
                </span>
              </p>
              <p className="text-xs text-mist">{SUPPORT_COPY.thanks}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={BUY_ME_A_COFFEE_URL}
                  onClick={() =>
                    posthog?.capture("support_link_clicked", {
                      source: "home_en_wip",
                    })
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#5F7FFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Débloquer avec un café
                </a>
                <button
                  type="button"
                  onClick={() => setEnWipOpen(false)}
                  className="rounded-full border border-panel-2 px-4 py-2.5 text-sm text-mist hover:border-foam/40 hover:text-foam"
                >
                  Plus tard — rester en FR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        onOpenDebugZoneEditor ||
        onOpenDebugHands ||
        onOpenDebugPositions ||
        onOpenDebugSyllables) && (
        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-amber-200">
            Debug
          </h2>
          <p className="mb-3 text-sm text-mist">
            Outils internes
            {import.meta.env.DEV
              ? " — visibles en développement."
              : " — déverrouillés via le code clavier."}{" "}
            Retape <kbd className="rounded bg-ink/60 px-1.5 py-0.5 text-amber-100">debug</kbd>{" "}
            pour masquer.
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
            {onOpenDebugZoneEditor && (
              <button
                type="button"
                onClick={onOpenDebugZoneEditor}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-400/45 bg-amber-400/10 p-5 text-left transition hover:border-amber-300/70 hover:bg-amber-400/15"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Outil 5
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">
                    Éditeur zones + Save
                  </h3>
                  <p className="mt-1 text-sm text-mist">
                    Placer, renommer les libellés, sauvegarder pour toute l’app.
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
