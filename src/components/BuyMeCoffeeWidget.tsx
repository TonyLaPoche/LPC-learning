import { BUY_ME_A_COFFEE_URL, BMC_WIDGET } from "@/lib/support";

type BuyMeCoffeeWidgetProps = {
  /** Masquer pendant la pratique caméra */
  enabled?: boolean;
};

const BMC_CUP_SRC = `${import.meta.env.BASE_URL}images/bmc-cup.svg`;

/**
 * Bouton flottant bas-droite → Buy Me a Coffee.
 * Icône = SVG officiel du widget BMC (coffee cup).
 */
export function BuyMeCoffeeWidget({ enabled = true }: BuyMeCoffeeWidgetProps) {
  if (!enabled) return null;

  return (
    <a
      href={BUY_ME_A_COFFEE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Soutenir sur Buy me a coffee"
      title="Buy me a coffee"
      className="fixed right-[18px] bottom-[max(18px,env(safe-area-inset-bottom))] z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
      style={{ backgroundColor: BMC_WIDGET.color }}
    >
      <img
        src={BMC_CUP_SRC}
        alt=""
        width={28}
        height={40}
        className="h-9 w-auto select-none"
        draggable={false}
      />
    </a>
  );
}
