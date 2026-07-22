import type { HandshapeId, PositionId } from "@/data/lpc-fr";

/** Photos générées (référentiel LfPC) — voir public/examples/hands/SOURCES.json */
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
      className="h-full w-full object-cover"
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

type CueExampleProps = {
  handshape: HandshapeId | null;
  position: PositionId | null;
  compact?: boolean;
};

export function CueExample({ handshape, position, compact }: CueExampleProps) {
  const showBoth = handshape != null && position != null;
  const box = compact
    ? "h-[4.5rem] w-[4.5rem] sm:h-24 sm:w-24"
    : "h-28 w-28";

  return (
    <div
      className="flex items-center justify-center gap-2"
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
      {showBoth && (
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
    </div>
  );
}
