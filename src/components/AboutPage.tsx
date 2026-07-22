export function AboutPage() {
  return (
    <div className="space-y-6 pb-2">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          À propos
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foam">
          CléLPC
        </h1>
        <p className="mt-2 text-mist">
          Apprendre le LPC français de façon ludique, avec feedback caméra —
          entièrement sur ton appareil.
        </p>
      </header>

      <section className="space-y-2 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold">Le principe</h2>
        <p className="text-sm leading-relaxed text-mist">
          Le LPC (Langue française Parlée Complétée) n’est pas la LSF. C’est un{" "}
          <strong className="text-foam">code manuel</strong> qui complète la
          lecture labiale :{" "}
          <strong className="text-teal">8 formes</strong> de doigts (consonnes) ×{" "}
          <strong className="text-sky">5 positions</strong> autour du visage
          (voyelles). Une clé = forme × position, souvent une syllabe.
        </p>
        <p className="text-sm leading-relaxed text-mist">
          Exemple : <em>pa / ba / ma</em> se ressemblent sur les lèvres ; le LPC
          les différencie par la configuration de la main.
        </p>
      </section>

      <section className="space-y-2 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold">Comment marche l’app</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-mist">
          <li>Parcours guidés : formes → positions → syllabes → mots → phrases</li>
          <li>Mode répétitions : 3× guidé, puis rappel sans guide</li>
          <li>
            Caméra + MediaPipe (mains & visage) — rien n’est envoyé sur un
            serveur
          </li>
          <li>Progression et zoom en localStorage</li>
        </ul>
        <p className="pt-1 text-sm text-mist">
          Le référentiel gestuel est <strong className="text-foam">pédagogique</strong>{" "}
          (inspiré du code ALPC). Ce n’est pas un substitut à une formation
          certifiante.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold">Sources & références</h2>
        <ul className="space-y-2 text-sm">
          <Source
            name="ALPC"
            href="https://alpc.asso.fr/"
            note="Association nationale — clés et formations"
          />
          <Source
            name="Coquelicot"
            href="https://www.coquelicot.asso.fr/lpc/lpcmain.php"
            note="Exercices et vidéos LPC"
          />
          <Source
            name="TextCueS"
            href="https://auto-cuedspeech.org/textcues.html"
            note="Texte → sons → clés"
          />
          <Source
            name="Auto-CS / SPPAS"
            href="https://autocs.sourceforge.io/"
            note="Pipeline open source Cued Speech"
          />
          <Source
            name="Fondation pour l’audition"
            href="https://www.fondationpourlaudition.org/la-langue-francaise-parlee-completee-573"
            note="Vulgarisation du LPC"
          />
          <Source
            name="Surdités Info Service"
            href="https://surdites-info-service.fr/langue-francaise-parlee-completee-lfpc"
            note="Schéma 5 positions × 8 configs"
          />
        </ul>
        <p className="text-xs text-mist/80">
          Photos d’exemples (formes + positions visage) : références pédagogiques
          générées, alignées sur le référentiel LfPC. Détail dans{" "}
          <code className="text-teal">public/examples/hands/SOURCES.json</code>.
        </p>
      </section>

      <section className="space-y-2 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold">Confidentialité</h2>
        <p className="text-sm text-mist">
          Aucun compte, aucun upload. Le flux caméra et les scores restent sur
          ton appareil.
        </p>
      </section>
    </div>
  );
}

function Source({
  name,
  href,
  note,
}: {
  name: string;
  href: string;
  note: string;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-teal underline-offset-2 hover:underline"
      >
        {name}
      </a>
      <span className="text-mist"> — {note}</span>
    </li>
  );
}
