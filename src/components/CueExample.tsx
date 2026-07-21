import type { HandshapeId, PositionId } from "@/data/lpc-fr";

/** Photos réelles (Wikimedia LSF + refs générées) — voir public/examples/hands/SOURCES.json */
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

const ZONE_STYLE: Record<
  PositionId,
  { cx: number; cy: number; color: string }
> = {
  side: { cx: 78, cy: 30, color: "#38BDF8" },
  cheek: { cx: 62, cy: 38, color: "#FACC15" },
  mouth: { cx: 40, cy: 50, color: "#2DD4BF" },
  chin: { cx: 40, cy: 66, color: "#FB7185" },
  throat: { cx: 40, cy: 80, color: "#A78BFA" },
};

function FacePositionSvg({ id }: { id: PositionId }) {
  const z = ZONE_STYLE[id];
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="40" rx="23" ry="29" fill="url(#skin)" stroke="#94A3B8" strokeWidth="1.5" />
      <ellipse cx="32" cy="36" rx="3.2" ry="2.2" fill="#0f172a" />
      <ellipse cx="48" cy="36" rx="3.2" ry="2.2" fill="#0f172a" />
      <path d="M40 40 v9" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <path d="M33 54 q7 5 14 0" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M34 68 h12 v14 a4 4 0 0 1 -4 4 h-4 a4 4 0 0 1 -4 -4 z" fill="#334155" />
      {(Object.keys(ZONE_STYLE) as PositionId[]).map((pid) => {
        if (pid === id) return null;
        const o = ZONE_STYLE[pid];
        return (
          <circle key={pid} cx={o.cx} cy={o.cy} r={5} fill={o.color} opacity={0.18} />
        );
      })}
      {/* main réaliste (ovale + doigts) sur la zone */}
      <g transform={`translate(${z.cx}, ${z.cy})`}>
        <ellipse cx="0" cy="2" rx="9" ry="11" fill="#e7c4a8" stroke="#c9956c" strokeWidth="0.8" />
        <rect x="-3.5" y="-14" width="3" height="10" rx="1.4" fill="#e7c4a8" />
        <rect x="-0.5" y="-15" width="3" height="11" rx="1.4" fill="#e7c4a8" />
        <rect x="2.5" y="-13" width="2.8" height="9" rx="1.3" fill="#e7c4a8" />
        <circle cx="0" cy="0" r="11" fill={z.color} opacity={0.28} />
      </g>
    </svg>
  );
}

function HandPhoto({ id, compact }: { id: HandshapeId; compact?: boolean }) {
  return (
    <img
      src={HAND_PHOTOS[id]}
      alt={`Exemple de forme ${id}`}
      className={`h-full w-full object-cover ${compact ? "" : ""}`}
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
            <HandPhoto id={handshape} compact={compact} />
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
            <FacePositionSvg id={position} />
          </div>
          <span className="text-[10px] text-mist">Zone</span>
        </div>
      )}
    </div>
  );
}
