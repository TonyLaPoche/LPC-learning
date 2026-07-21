type AdSlotProps = {
  side: "left" | "right" | "bottom";
};

export function AdSlot({ side }: AdSlotProps) {
  const label =
    side === "bottom" ? "Emplacement pub (mobile) — v2" : `Pub ${side === "left" ? "G" : "D"} — v2`;

  return (
    <aside
      className={
        side === "bottom"
          ? "mt-4 flex h-20 w-full items-center justify-center rounded-xl border border-dashed border-panel-2/80 bg-panel/40 text-center text-xs text-mist"
          : "hidden w-40 shrink-0 items-center justify-center rounded-xl border border-dashed border-panel-2/80 bg-panel/40 p-3 text-center text-xs text-mist lg:flex xl:w-44"
      }
      aria-label="Emplacement publicitaire réservé"
    >
      <div>
        <p className="font-medium text-foam/70">{label}</p>
        <p className="mt-1 text-[10px] leading-snug opacity-70">
          Placeholder — intégration régie en v2
        </p>
      </div>
    </aside>
  );
}
