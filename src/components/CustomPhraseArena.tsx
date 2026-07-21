import { useMemo, useState } from "react";
import { PracticeArena } from "@/components/PracticeArena";
import { packHandshape, packPosition, type PackId } from "@/data/packs";
import { textToCuesForPack } from "@/lib/textToCues";
import { markCompleted } from "@/lib/progress";
import { markCustomVisited } from "@/lib/visits";

type CustomPhraseArenaProps = {
  pack: PackId;
  onExit: () => void;
  onProgress: () => void;
};

const EXAMPLES_FR = [
  "Bonjour",
  "Ça va bien",
  "Je t’aime",
  "À bientôt",
  "Merci beaucoup",
];

const EXAMPLES_EN = [
  "Hello",
  "Thank you",
  "How are you",
  "I love you",
  "Good night",
];

export function CustomPhraseArena({
  pack,
  onExit,
  onProgress,
}: CustomPhraseArenaProps) {
  const [draft, setDraft] = useState("");
  const [session, setSession] = useState<{
    label: string;
    keys: ReturnType<typeof textToCuesForPack>["keys"];
  } | null>(null);

  const examples = pack === "en" ? EXAMPLES_EN : EXAMPLES_FR;
  const preview = useMemo(() => textToCuesForPack(pack, draft), [draft, pack]);

  if (session) {
    return (
      <PracticeArena
        track="phrases"
        pack={pack}
        customSession={session}
        onExit={onExit}
        onEditPhrase={() => setSession(null)}
        onProgress={onProgress}
      />
    );
  }

  const canStart = preview.keys.length > 0;
  const isEn = pack === "en";

  const start = () => {
    if (!canStart) return;
    markCustomVisited();
    markCompleted("custom-compose", 10, pack);
    onProgress();
    setSession({
      label: preview.words.join(" ") || draft.trim(),
      keys: preview.keys,
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-panel-2 px-3 py-1 text-sm text-mist hover:border-foam/40 hover:text-foam"
        >
          ← Accueil
        </button>
      </div>

      <section className="shrink-0 rounded-2xl border border-panel-2/70 bg-panel/70 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal">
          {isEn ? "Custom phrase" : "Phrase custom"}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-foam">
          {isEn ? "Type, then cue" : "Écris, puis code"}
        </h1>
        <p className="mt-2 text-sm text-mist">
          {isEn
            ? "Type an English phrase. The app suggests approximate Cued Speech cues, then you validate them on camera."
            : "Tape une phrase en français. L’app propose des clés LPC approximatives, puis tu les valides à la caméra."}
        </p>

        <label className="mt-4 block">
          <span className="sr-only">
            {isEn ? "Your phrase" : "Ta phrase"}
          </span>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder={isEn ? "Ex. Hello, how are you?" : "Ex. Bonjour, ça va ?"}
            className="w-full resize-none rounded-xl border border-panel-2/80 bg-ink/50 px-3 py-2.5 text-base text-foam placeholder:text-mist/50 focus:border-teal/50 focus:outline-none"
          />
        </label>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setDraft(ex)}
              className="rounded-full border border-panel-2/60 px-2.5 py-1 text-[11px] text-mist hover:border-teal/40 hover:text-foam"
            >
              {ex}
            </button>
          ))}
        </div>

        {preview.warnings.length > 0 && draft.trim() && (
          <ul className="mt-3 space-y-1 text-xs text-coral">
            {preview.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}

        <button
          type="button"
          disabled={!canStart}
          onClick={start}
          className="mt-4 w-full rounded-full bg-teal px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-40 sm:w-auto"
        >
          {isEn
            ? `Cue this phrase (${preview.keys.length} cue${preview.keys.length > 1 ? "s" : ""})`
            : `Coder cette phrase (${preview.keys.length} clé${preview.keys.length > 1 ? "s" : ""})`}
        </button>
      </section>

      {preview.keys.length > 0 && (
        <section className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-panel-2/60 bg-panel/50 p-4">
          <h2 className="font-display text-sm font-bold text-foam">
            {isEn ? "Cue preview" : "Aperçu des clés"}
          </h2>
          <p className="mt-1 text-[11px] text-mist">
            {isEn
              ? "Pedagogical approximation — not an official judge."
              : "Approximation pédagogique — pas un juge officiel."}
          </p>
          <ol className="mt-3 space-y-2">
            {preview.keys.map((k, i) => (
              <li
                key={`${k.syllable}-${i}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-panel-2/50 bg-ink/30 px-3 py-2 text-sm"
              >
                <span className="font-medium text-foam">
                  <span className="mr-2 text-mist">{i + 1}.</span>
                  {k.syllable}
                </span>
                <span className="text-right text-[11px] text-mist">
                  <span className="text-teal">
                    {packHandshape(pack, k.handshape).label}
                  </span>
                  {" · "}
                  <span className="text-sky">
                    {packPosition(pack, k.position).label}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
