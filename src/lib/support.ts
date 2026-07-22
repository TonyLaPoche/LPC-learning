/** Lien Buy Me a Coffee. */
export const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/terradeanty";

/** Widget flottant officiel BMC (bas droite). */
export const BMC_WIDGET = {
  id: "terradeanty",
  scriptSrc: "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js",
  description: "Support me on Buy me a coffee!",
  message: "",
  color: "#5F7FFF",
  position: "Right" as const,
  xMargin: 18,
  yMargin: 18,
};

export const SUPPORT_COPY = {
  title: "Soutenir CléLPC",
  intro:
    "CléLPC est gratuite, 100 % locale, zéro compte… et maintenue par un dev qui carbure au café (italien, de préférence).",
  whyTitle: "Pourquoi un don ?",
  whyLead:
    "Parce que derrière l’app il y a un humain, un clavier, et une cafetière qui fait des heures supp’.",
  whyBody:
    "Même 2 balles par mois, c’est déjà ~5 cafés de cafetière italienne pour moi — et une motivation extrême à patcher, corriger les clés LPC, et garder le moteur qui tourne. Chaque don compte : petit espresso ou grand lungo, le serveur (humain) dit merci.",
  whyCredits:
    "En bonus : tu peux retrouver ton nom ou pseudo dans l’app, en guise de remerciement… jusqu’à ce qu’Internet décide de fermer ses portes.",
  thanks: "Allez, un café ? L’app te le rendra en clés bien placées.",
  footer: "Pas de pub pour l’instant. Juste du code, du LPC, et de la caféine.",
};
