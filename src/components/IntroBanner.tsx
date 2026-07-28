import { markIntroSeen } from "@/lib/trackProgress";

type IntroBannerProps = {
  onDismiss: () => void;
};

export function IntroBanner({ onDismiss }: IntroBannerProps) {
  const dismiss = () => {
    markIntroSeen();
    onDismiss();
  };

  return (
    <section className="rounded-2xl border border-sky/40 bg-sky/10 p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-sky">
        Mini intro
      </p>
      <h2 className="mt-1 font-display text-xl font-bold text-foam">
        Comment coder une clé ?
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mist">
        <li>
          Regarde d’abord la bannière :{" "}
          <strong className="text-foam">Forme</strong> ×{" "}
          <strong className="text-foam">Zone</strong> ×{" "}
          <strong className="text-foam">Lèvres</strong> (lecture labiale).
        </li>
        <li>
          Prépare ta main, puis appuie sur{" "}
          <strong className="text-teal">Je suis prêt</strong> — avant ça, rien
          n’est validé (même si la caméra te voit).
        </li>
        <li>
          Tiens la clé ~2 s. Tu peux{" "}
          <strong className="text-foam">recommencer</strong> l’étape ou{" "}
          <strong className="text-foam">reprendre</strong> un parcours plus
          tard : ta progression reste sur cet appareil.
        </li>
      </ol>
      <button
        type="button"
        onClick={dismiss}
        className="mt-4 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-ink"
      >
        Compris, c’est parti
      </button>
    </section>
  );
}
