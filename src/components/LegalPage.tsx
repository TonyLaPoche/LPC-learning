import type { ReactNode } from "react";

export type LegalDoc = "privacy" | "terms" | "cookies";

const TITLES: Record<LegalDoc, { eyebrow: string; title: string }> = {
  privacy: {
    eyebrow: "Données personnelles",
    title: "Politique de confidentialité",
  },
  terms: {
    eyebrow: "Conditions",
    title: "Conditions d’utilisation",
  },
  cookies: {
    eyebrow: "Cookies",
    title: "Politique cookies",
  },
};

type LegalPageProps = {
  doc: LegalDoc;
  onOpenCookiesSettings?: () => void;
  onNavigate?: (doc: LegalDoc) => void;
};

export function LegalPage({
  doc,
  onOpenCookiesSettings,
  onNavigate,
}: LegalPageProps) {
  const meta = TITLES[doc];
  return (
    <div className="space-y-6 pb-2">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          {meta.eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foam">
          {meta.title}
        </h1>
        <p className="mt-2 text-sm text-mist">
          Dernière mise à jour : 13 août 2026 — CléLPC
        </p>
      </header>

      {doc === "privacy" && (
        <PrivacyBody onNavigate={onNavigate} />
      )}
      {doc === "terms" && <TermsBody />}
      {doc === "cookies" && (
        <CookiesBody
          onOpenCookiesSettings={onOpenCookiesSettings}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
      <h2 className="font-display text-lg font-bold text-foam">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-mist">
        {children}
      </div>
    </section>
  );
}

function DocLink({
  label,
  doc,
  onNavigate,
}: {
  label: string;
  doc: LegalDoc;
  onNavigate?: (doc: LegalDoc) => void;
}) {
  if (!onNavigate) return <span className="text-teal">{label}</span>;
  return (
    <button
      type="button"
      onClick={() => onNavigate(doc)}
      className="text-teal underline-offset-2 hover:underline"
    >
      {label}
    </button>
  );
}

function PrivacyBody({
  onNavigate,
}: {
  onNavigate?: (doc: LegalDoc) => void;
}) {
  return (
    <>
      <Section title="1. Responsable du traitement">
        <p>
          Le service <strong className="text-foam">CléLPC</strong> est édité
          par Antoine Terrade (personne physique). Contact : dépôt GitHub{" "}
          <a
            href="https://github.com/TonyLaPoche/LPC-learning"
            target="_blank"
            rel="noreferrer"
            className="text-teal underline-offset-2 hover:underline"
          >
            TonyLaPoche/LPC-learning
          </a>{" "}
          ou la page Feedback de l’application.
        </p>
      </Section>

      <Section title="2. Données traitées">
        <p>
          <strong className="text-foam">Sur ton appareil uniquement</strong>{" "}
          (pas envoyées à un serveur CléLPC) :
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>Flux caméra (MediaPipe) — analyse locale des mains / visage</li>
          <li>Progression, XP, préférences (localStorage)</li>
        </ul>
        <p className="pt-1">
          <strong className="text-foam">Avec ton consentement</strong>{" "}
          (PostHog, hébergement UE —{" "}
          <code className="text-teal">eu.i.posthog.com</code>) :
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            Données d’usage : pages / écrans, événements pédagogiques (début de
            parcours, étapes validées, pack choisi, etc.)
          </li>
          <li>Données techniques : type d’appareil, navigateur, erreurs JS</li>
          <li>
            Identifiant pseudonyme (cookie / localStorage PostHog) — pas de
            compte utilisateur
          </li>
          <li>
            Optionnel : session replay (navigation, clics) —{" "}
            <strong className="text-foam">jamais</strong> le flux caméra
          </li>
        </ul>
      </Section>

      <Section title="3. Finalités & bases légales">
        <ul className="list-inside list-disc space-y-1">
          <li>
            Fourniture du service d’apprentissage local — intérêt légitime /
            exécution du service
          </li>
          <li>
            Mesure d’audience et amélioration du produit —{" "}
            <strong className="text-foam">consentement</strong> (art. 6.1.a
            RGPD)
          </li>
          <li>
            Session replay — <strong className="text-foam">consentement</strong>{" "}
            distinct
          </li>
        </ul>
      </Section>

      <Section title="4. Destinataires">
        <p>
          PostHog Inc. agit comme sous-traitant pour la mesure d’audience
          (région UE). L’hébergement de l’application statique est assuré par
          GitHub Pages (GitHub, Inc.). Aucune revente de données.
        </p>
      </Section>

      <Section title="5. Durées de conservation">
        <p>
          Progression locale : jusqu’à suppression manuelle ou effacement des
          données du navigateur. Données PostHog : selon la rétention
          configurée dans le projet PostHog (par défaut limitée ; tu peux
          demander l’effacement via le contact ci-dessus).
        </p>
      </Section>

      <Section title="6. Tes droits">
        <p>
          Conformément au RGPD : accès, rectification, effacement, limitation,
          opposition, portabilité, et retrait du consentement à tout moment
          (bandeau cookies ou lien en bas de page). Tu peux aussi saisir la
          CNIL (
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noreferrer"
            className="text-teal underline-offset-2 hover:underline"
          >
            cnil.fr
          </a>
          ).
        </p>
      </Section>

      <Section title="7. Documents liés">
        <p>
          Voir aussi la{" "}
          <DocLink
            label="politique cookies"
            doc="cookies"
            onNavigate={onNavigate}
          />{" "}
          et les{" "}
          <DocLink
            label="conditions d’utilisation"
            doc="terms"
            onNavigate={onNavigate}
          />
          .
        </p>
      </Section>
    </>
  );
}

function TermsBody() {
  return (
    <>
      <Section title="1. Objet">
        <p>
          CléLPC est une application web éducative (PWA) pour s’entraîner au
          LPC (Langue française Parlée Complétée) avec feedback caméra local.
          En utilisant le service, tu acceptes les présentes conditions.
        </p>
      </Section>

      <Section title="2. Nature du service">
        <p>
          Le contenu gestuel est <strong className="text-foam">pédagogique</strong>{" "}
          et inspiré du référentiel ALPC. Ce n’est{" "}
          <strong className="text-foam">pas</strong> une formation certifiante,
          ni un substitut à un accompagnement professionnel.
        </p>
      </Section>

      <Section title="3. Accès & prérequis">
        <p>
          Service gratuit, accessible via navigateur (idéalement HTTPS /
          localhost pour la caméra). Tu es responsable du matériel et des
          autorisations caméra accordées au navigateur.
        </p>
      </Section>

      <Section title="4. Utilisation acceptable">
        <p>
          Tu t’engages à une utilisation personnelle et éducative, sans tenter
          de nuire au service, sans scraper abusif, et sans détourner l’outil à
          des fins illicites.
        </p>
      </Section>

      <Section title="5. Propriété intellectuelle">
        <p>
          Code, textes, interface et assets CléLPC restent la propriété de
          l’éditeur, sous réserve des licences open source des dépendances et
          des sources pédagogiques tierces citées dans « À propos ».
        </p>
      </Section>

      <Section title="6. Responsabilité">
        <p>
          Le service est fourni « en l’état ». L’éditeur ne garantit pas
          l’absence d’erreurs de détection caméra. Dans les limites autorisées
          par la loi, aucune responsabilité pour dommages indirects liés à
          l’usage de l’app.
        </p>
      </Section>

      <Section title="7. Évolutions">
        <p>
          L’éditeur peut faire évoluer, suspendre ou interrompre le service
          (hébergement GitHub Pages). Les conditions peuvent être mises à jour ;
          la date en tête de page fait foi.
        </p>
      </Section>
    </>
  );
}

function CookiesBody({
  onOpenCookiesSettings,
  onNavigate,
}: {
  onOpenCookiesSettings?: () => void;
  onNavigate?: (doc: LegalDoc) => void;
}) {
  return (
    <>
      <Section title="1. Qu’utilisons-nous ?">
        <p>
          CléLPC n’affiche pas de publicité. Des cookies / stockages locaux
          peuvent être déposés pour :
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong className="text-foam">Essentiels (toujours actifs)</strong>{" "}
            — progression, pack, préférences UI (localStorage), fonctionnement
            PWA
          </li>
          <li>
            <strong className="text-foam">Analytics (consentement)</strong> —
            PostHog (mesure d’audience)
          </li>
          <li>
            <strong className="text-foam">Replay (consentement)</strong> —
            enregistrement de session PostHog
          </li>
        </ul>
      </Section>

      <Section title="2. PostHog">
        <p>
          Prestataire : PostHog, API{" "}
          <code className="text-teal">https://eu.i.posthog.com</code> (UE).
          Finalité : statistiques d’usage et, si accepté, replay. Base légale :
          consentement. Tu peux refuser sans perdre l’accès à l’apprentissage
          local.
        </p>
      </Section>

      <Section title="3. Gérer ton choix">
        <p>
          Au premier visit, un bandeau permet d’accepter, refuser ou
          personnaliser. Tu peux modifier ton choix à tout moment :
        </p>
        {onOpenCookiesSettings && (
          <button
            type="button"
            onClick={onOpenCookiesSettings}
            className="mt-1 rounded-full bg-teal/20 px-4 py-2 text-sm font-semibold text-teal transition hover:bg-teal/30"
          >
            Ouvrir les préférences cookies
          </button>
        )}
        <p className="pt-1 text-xs text-mist/80">
          Voir aussi la{" "}
          <DocLink
            label="politique de confidentialité"
            doc="privacy"
            onNavigate={onNavigate}
          />
          .
        </p>
      </Section>
    </>
  );
}
