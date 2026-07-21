/**
 * Lexique FR : orthographe → syllabes phonétiques (ASCII) + labels d’affichage.
 * Notation : voir lpcPhonemes.ts (R=ʁ, S=ʃ, Z=ʒ, E=ɛ, O=ɔ, e~=ɛ̃, a~=ɑ̃, o~=ɔ̃, @=ə)
 */

export type LexiconEntry = {
  /** Syllabes séparées par `.` — phonèmes collés ou espacés */
  phones: string;
  /** Labels UI (même nombre que les syllabes), sinon dérivés des phones */
  display?: string[];
};

/**
 * Mots fréquents + pièges orthographiques.
 * Étendre progressivement ; absent → fallback règles orthographiques.
 */
export const LEXICON_FR: Record<string, LexiconEntry> = {
  // salutations / base
  bonjour: { phones: "b o~ . Z u R", display: ["bon", "jour"] },
  bonsoir: { phones: "b o~ . s w a R", display: ["bon", "soir"] },
  salut: { phones: "s a . l y", display: ["sa", "lut"] },
  merci: { phones: "m E R . s i", display: ["mer", "ci"] },
  oui: { phones: "w i", display: ["oui"] },
  non: { phones: "n o~", display: ["non"] },
  sil: { phones: "s i l", display: ["s'il"] },
  "s'il": { phones: "s i l", display: ["s'il"] },
  te: { phones: "t @", display: ["te"] },
  plait: { phones: "p l E", display: ["plaît"] },
  "plaît": { phones: "p l E", display: ["plaît"] },

  // pièges déjà rencontrés
  comment: { phones: "k O . m a~", display: ["com", "ment"] },
  pourquoi: { phones: "p u R . k w a", display: ["pour", "quoi"] },
  pour: { phones: "p u R", display: ["pour"] },
  quoi: { phones: "k w a", display: ["quoi"] },
  espece: { phones: "E s . p E s", display: ["es", "pèce"] },
  especes: { phones: "E s . p E s", display: ["es", "pèces"] },
  "espèce": { phones: "E s . p E s", display: ["es", "pèce"] },
  "espèces": { phones: "E s . p E s", display: ["es", "pèces"] },
  vraiment: { phones: "v R E . m a~", display: ["vrai", "ment"] },

  // quotidien
  papa: { phones: "p a . p a", display: ["pa", "pa"] },
  maman: { phones: "m a . m a~", display: ["ma", "man"] },
  eau: { phones: "o", display: ["eau"] },
  lait: { phones: "l E", display: ["lait"] },
  pain: { phones: "p e~", display: ["pain"] },
  chat: { phones: "S a", display: ["chat"] },
  chien: { phones: "S j e~", display: ["chien"] },
  ami: { phones: "a . m i", display: ["a", "mi"] },
  ecole: { phones: "e . k O l", display: ["é", "cole"] },
  "école": { phones: "e . k O l", display: ["é", "cole"] },
  livre: { phones: "l i . v R", display: ["li", "vre"] },
  maison: { phones: "m E . z o~", display: ["mai", "son"] },
  soleil: { phones: "s O . l E j", display: ["so", "leil"] },
  porte: { phones: "p O R t", display: ["porte"] },
  table: { phones: "t a . b l", display: ["ta", "ble"] },
  pomme: { phones: "p O m", display: ["pomme"] },
  fleur: { phones: "f l eu R", display: ["fleur"] },
  nuit: { phones: "n H i", display: ["nuit"] },
  jour: { phones: "Z u R", display: ["jour"] },
  bebe: { phones: "b e . b e", display: ["bé", "bé"] },
  "bébé": { phones: "b e . b e", display: ["bé", "bé"] },

  ca: { phones: "s a", display: ["ça"] },
  "ça": { phones: "s a", display: ["ça"] },
  va: { phones: "v a", display: ["va"] },
  je: { phones: "Z @", display: ["je"] },
  tu: { phones: "t y", display: ["tu"] },
  il: { phones: "i l", display: ["il"] },
  elle: { phones: "E l", display: ["elle"] },
  nous: { phones: "n u", display: ["nous"] },
  vous: { phones: "v u", display: ["vous"] },
  on: { phones: "o~", display: ["on"] },
  un: { phones: "e~", display: ["un"] },
  une: { phones: "y n", display: ["une"] },
  le: { phones: "l @", display: ["le"] },
  la: { phones: "l a", display: ["la"] },
  les: { phones: "l e", display: ["les"] },
  des: { phones: "d e", display: ["des"] },
  et: { phones: "e", display: ["et"] },
  a: { phones: "a", display: ["à"] },
  "à": { phones: "a", display: ["à"] },
  au: { phones: "o", display: ["au"] },
  aux: { phones: "o", display: ["aux"] },
  de: { phones: "d @", display: ["de"] },
  du: { phones: "d y", display: ["du"] },
  en: { phones: "a~", display: ["en"] },
  est: { phones: "E", display: ["est"] },
  suis: { phones: "s H i", display: ["suis"] },
  es: { phones: "E", display: ["es"] },
  sommes: { phones: "s O m", display: ["sommes"] },
  etes: { phones: "E t", display: ["êtes"] },
  "êtes": { phones: "E t", display: ["êtes"] },
  sont: { phones: "s o~", display: ["sont"] },
  ai: { phones: "e", display: ["ai"] },
  as: { phones: "a", display: ["as"] },
  avons: { phones: "a . v o~", display: ["a", "vons"] },
  avez: { phones: "a . v e", display: ["a", "vez"] },
  ont: { phones: "o~", display: ["ont"] },

  bien: { phones: "b j e~", display: ["bien"] },
  bon: { phones: "b o~", display: ["bon"] },
  bonne: { phones: "b O n", display: ["bonne"] },
  tout: { phones: "t u", display: ["tout"] },
  tous: { phones: "t u", display: ["tous"] },
  plus: { phones: "p l y", display: ["plus"] },
  tres: { phones: "t R E", display: ["très"] },
  "très": { phones: "t R E", display: ["très"] },
  avec: { phones: "a . v E k", display: ["a", "vec"] },
  sans: { phones: "s a~", display: ["sans"] },
  sous: { phones: "s u", display: ["sous"] },
  sur: { phones: "s y R", display: ["sur"] },
  dans: { phones: "d a~", display: ["dans"] },
  par: { phones: "p a R", display: ["par"] },
  qui: { phones: "k i", display: ["qui"] },
  que: { phones: "k @", display: ["que"] },
  ou: { phones: "u", display: ["où"] },
  "où": { phones: "u", display: ["où"] },
  quand: { phones: "k a~", display: ["quand"] },
  comme: { phones: "k O m", display: ["comme"] },
  si: { phones: "s i", display: ["si"] },

  aime: { phones: "E m", display: ["aime"] },
  "t'aime": { phones: "t E m", display: ["t'aime"] },
  vais: { phones: "v E", display: ["vais"] },
  vas: { phones: "v a", display: ["vas"] },
  allons: { phones: "a . l o~", display: ["al", "lons"] },
  allez: { phones: "a . l e", display: ["al", "lez"] },
  vont: { phones: "v o~", display: ["vont"] },
  faim: { phones: "f e~", display: ["faim"] },
  soif: { phones: "s w a f", display: ["soif"] },
  demain: { phones: "d @ . m e~", display: ["de", "main"] },
  bientot: { phones: "b j e~ . t o", display: ["bien", "tôt"] },
  "bientôt": { phones: "b j e~ . t o", display: ["bien", "tôt"] },
  revoir: { phones: "R @ . v w a R", display: ["re", "voir"] },
  beaucoup: { phones: "b o . k u", display: ["beau", "coup"] },
  journee: { phones: "Z u R . n e", display: ["jour", "née"] },
  "journée": { phones: "Z u R . n e", display: ["jour", "née"] },

  hello: { phones: "E . l o", display: ["hel", "lo"] }, // rare en FR
};

/** Normalise une clé de lookup (accents gardés + forme sans accents). */
export function lexiconKeysFor(word: string): string[] {
  const w = word.toLowerCase().normalize("NFC");
  const stripped = w
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/'/g, "");
  const keys = [w, w.replace(/'/g, ""), stripped];
  return [...new Set(keys)];
}

export function lookupLexiconFr(word: string): LexiconEntry | null {
  for (const k of lexiconKeysFor(word)) {
    const hit = LEXICON_FR[k];
    if (hit) return hit;
  }
  return null;
}
