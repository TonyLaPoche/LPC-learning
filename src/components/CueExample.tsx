import type { HandshapeId, PositionId } from "@/data/lpc-fr";

/** Photos pédagogiques LPC (schémas officiel c1–c8) */
const HAND_PHOTOS: Record<HandshapeId, string> = {
  c1: `${import.meta.env.BASE_URL}examples/hands/c1.jpg`,
  c2: `${import.meta.env.BASE_URL}examples/hands/c2.jpg`,
  c3: `${import.meta.env.BASE_URL}examples/hands/c3.jpg`,
  c4: `${import.meta.env.BASE_URL}examples/hands/c4.jpg`,
  c5: `${import.meta.env.BASE_URL}examples/hands/c5.jpg`,
  c6: `${import.meta.env.BASE_URL}examples/hands/c6.jpg`,
  c7: `${import.meta.env.BASE_URL}examples/hands/c7.jpg`,
  c8: `${import.meta.env.BASE_URL}examples/hands/c8.jpg`,
};

const POSITION_PHOTOS: Record<PositionId, string> = {
  side: `${import.meta.env.BASE_URL}examples/positions/side.jpg`,
  cheek: `${import.meta.env.BASE_URL}examples/positions/cheek.jpg`,
  mouth: `${import.meta.env.BASE_URL}examples/positions/mouth.jpg`,
  chin: `${import.meta.env.BASE_URL}examples/positions/chin.jpg`,
  throat: `${import.meta.env.BASE_URL}examples/positions/throat.jpg`,
};

function HandPhoto({ id }: { id: HandshapeId }) {
  return (
    <img
      src={HAND_PHOTOS[id]}
      alt={`Exemple de forme ${id}`}
      className="h-full w-full object-fill"
      loading="eager"
      decoding="async"
    />
  );
}

function PositionPhoto({ id }: { id: PositionId }) {
  return (
    <img
      src={POSITION_PHOTOS[id]}
      alt={`Exemple de zone ${id}`}
      className="h-full w-full object-cover"
      loading="eager"
      decoding="async"
    />
  );
}

/** Aide à la lecture labiale : syllabe bien visible + bouche schématique. */
function LipsCue({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950 px-1">
      <svg viewBox="0 0 64 40" className="mb-0.5 h-5 w-10 opacity-90" aria-hidden>
        <ellipse cx="32" cy="18" rx="18" ry="10" fill="#f9a8d4" opacity="0.85" />
        <path
          d="M16 18 Q32 28 48 18"
          fill="none"
          stroke="#be185d"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="max-w-full truncate font-display text-sm font-bold leading-none text-foam sm:text-base">
        {label}
      </span>
    </div>
  );
}

type CueExampleProps = {
  handshape: HandshapeId | null;
  position: PositionId | null;
  /** Texte à lire sur les lèvres (syllabe / mot). */
  lipsLabel?: string | null;
  compact?: boolean;
};

export function CueExample({
  handshape,
  position,
  lipsLabel,
  compact,
}: CueExampleProps) {
  const showLips = Boolean(lipsLabel?.trim());
  const box = compact
    ? "h-[4.5rem] w-[4.5rem] sm:h-24 sm:w-24"
    : "h-28 w-28";

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2"
      aria-label="Exemple gestuel"
    >
      {handshape && (
        <div className="flex flex-col items-center gap-0.5">
          <div
            className={`overflow-hidden rounded-xl border border-panel-2/70 bg-white shadow-sm ${box}`}
          >
            <HandPhoto id={handshape} />
          </div>
          <span className="text-[10px] text-mist">Forme</span>
        </div>
      )}
      {handshape && position && (
        <span className="font-display text-lg text-teal" aria-hidden>
          ×
        </span>
      )}
      {position && (
        <div className="flex flex-col items-center gap-0.5">
          <div
            className={`overflow-hidden rounded-xl border border-panel-2/70 bg-ink/50 ${box}`}
          >
            <PositionPhoto id={position} />
          </div>
          <span className="text-[10px] text-mist">Zone</span>
        </div>
      )}
      {showLips && (
        <>
          {(handshape || position) && (
            <span className="font-display text-lg text-sky" aria-hidden>
              ×
            </span>
          )}
          <div className="flex flex-col items-center gap-0.5">
            <div
              className={`overflow-hidden rounded-xl border border-coral/40 bg-ink shadow-sm ${box}`}
            >
              <LipsCue label={lipsLabel!.trim()} />
            </div>
            <span className="text-[10px] text-mist">Lèvres</span>
          </div>
        </>
      )}
    </div>
  );
}
