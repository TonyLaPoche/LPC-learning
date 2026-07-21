/** Contenu pack Suisse romande — même code LPC, vocabulaire local. */

import type { PhraseDrill, WordDrill } from "@/data/lpc-fr";

export const CONTENT_CH = {
  words: [
    {
      id: "papa",
      word: "papa",
      keys: [
        { syllable: "pa", handshape: "c1", position: "throat" },
        { syllable: "pa", handshape: "c1", position: "throat" },
      ],
    },
    {
      id: "maman",
      word: "maman",
      keys: [
        { syllable: "ma", handshape: "c2", position: "throat" },
        { syllable: "man", handshape: "c2", position: "chin" },
      ],
    },
    {
      id: "bonjour",
      word: "bonjour",
      keys: [
        { syllable: "bon", handshape: "c1", position: "cheek" },
        { syllable: "jour", handshape: "c1", position: "side" },
      ],
    },
    {
      id: "merci",
      word: "merci",
      keys: [
        { syllable: "mer", handshape: "c2", position: "chin" },
        { syllable: "ci", handshape: "c5", position: "mouth" },
      ],
    },
    {
      id: "salut",
      word: "salut",
      keys: [
        { syllable: "sa", handshape: "c5", position: "throat" },
        { syllable: "lut", handshape: "c3", position: "side" },
      ],
    },
    {
      id: "oui",
      word: "oui",
      keys: [{ syllable: "oui", handshape: "c6", position: "side" }],
    },
    {
      id: "non",
      word: "non",
      keys: [{ syllable: "non", handshape: "c3", position: "cheek" }],
    },
    {
      id: "natel",
      word: "natel",
      keys: [
        { syllable: "na", handshape: "c3", position: "throat" },
        { syllable: "tel", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "huitante",
      word: "huitante",
      keys: [
        { syllable: "hui", handshape: "c7", position: "side" },
        { syllable: "tan", handshape: "c2", position: "chin" },
        { syllable: "te", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "nonante",
      word: "nonante",
      keys: [
        { syllable: "no", handshape: "c3", position: "side" },
        { syllable: "nan", handshape: "c3", position: "chin" },
        { syllable: "te", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "chocolat",
      word: "chocolat",
      keys: [
        { syllable: "cho", handshape: "c7", position: "side" },
        { syllable: "co", handshape: "c3", position: "side" },
        { syllable: "lat", handshape: "c3", position: "throat" },
      ],
    },
    {
      id: "fondue",
      word: "fondue",
      keys: [
        { syllable: "fon", handshape: "c2", position: "cheek" },
        { syllable: "due", handshape: "c1", position: "side" },
      ],
    },
    {
      id: "fromage",
      word: "fromage",
      keys: [
        { syllable: "fro", handshape: "c2", position: "side" },
        { syllable: "ma", handshape: "c2", position: "throat" },
        { syllable: "ge", handshape: "c1", position: "mouth" },
      ],
    },
    {
      id: "lac",
      word: "lac",
      keys: [{ syllable: "lac", handshape: "c3", position: "throat" }],
    },
    {
      id: "montagne",
      word: "montagne",
      keys: [
        { syllable: "mon", handshape: "c2", position: "cheek" },
        { syllable: "ta", handshape: "c2", position: "throat" },
        { syllable: "gne", handshape: "c4", position: "mouth" },
      ],
    },
    {
      id: "cafe",
      word: "café",
      keys: [
        { syllable: "ca", handshape: "c3", position: "throat" },
        { syllable: "fé", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "train",
      word: "train",
      keys: [{ syllable: "train", handshape: "c2", position: "chin" }],
    },
    {
      id: "billet",
      word: "billet",
      keys: [
        { syllable: "bi", handshape: "c5", position: "mouth" },
        { syllable: "llet", handshape: "c3", position: "mouth" },
      ],
    },
    {
      id: "geneve",
      word: "Genève",
      keys: [
        { syllable: "ge", handshape: "c1", position: "mouth" },
        { syllable: "nève", handshape: "c3", position: "mouth" },
      ],
    },
    {
      id: "lausanne",
      word: "Lausanne",
      keys: [
        { syllable: "lau", handshape: "c3", position: "side" },
        { syllable: "sanne", handshape: "c5", position: "chin" },
      ],
    },
    {
      id: "vaud",
      word: "Vaud",
      keys: [{ syllable: "vaud", handshape: "c6", position: "side" }],
    },
    {
      id: "pain",
      word: "pain",
      keys: [{ syllable: "pain", handshape: "c1", position: "chin" }],
    },
    {
      id: "ecole",
      word: "école",
      keys: [
        { syllable: "é", handshape: "c6", position: "mouth" },
        { syllable: "co", handshape: "c3", position: "side" },
        { syllable: "le", handshape: "c3", position: "mouth" },
      ],
    },
    {
      id: "ami",
      word: "ami",
      keys: [
        { syllable: "a", handshape: "c6", position: "throat" },
        { syllable: "mi", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "neige",
      word: "neige",
      keys: [
        { syllable: "nei", handshape: "c3", position: "mouth" },
        { syllable: "ge", handshape: "c1", position: "mouth" },
      ],
    },
    {
      id: "ski",
      word: "ski",
      keys: [{ syllable: "ski", handshape: "c5", position: "mouth" }],
    },
  ] satisfies WordDrill[],

  phrases: [
    {
      id: "bonjour-toi",
      phrase: "Bonjour !",
      keys: [
        { syllable: "bon", handshape: "c1", position: "cheek" },
        { syllable: "jour", handshape: "c1", position: "side" },
      ],
    },
    {
      id: "ca-va",
      phrase: "Ça va ?",
      keys: [
        { syllable: "ça", handshape: "c5", position: "throat" },
        { syllable: "va", handshape: "c6", position: "throat" },
      ],
    },
    {
      id: "merci-beaucoup",
      phrase: "Merci beaucoup",
      keys: [
        { syllable: "mer", handshape: "c2", position: "chin" },
        { syllable: "ci", handshape: "c5", position: "mouth" },
        { syllable: "beau", handshape: "c1", position: "side" },
        { syllable: "coup", handshape: "c3", position: "side" },
      ],
    },
    {
      id: "a-bientot",
      phrase: "À bientôt",
      keys: [
        { syllable: "à", handshape: "c6", position: "throat" },
        { syllable: "bien", handshape: "c1", position: "chin" },
        { syllable: "tôt", handshape: "c2", position: "side" },
      ],
    },
    {
      id: "au-revoir",
      phrase: "Au revoir",
      keys: [
        { syllable: "au", handshape: "c6", position: "side" },
        { syllable: "re", handshape: "c4", position: "mouth" },
        { syllable: "voir", handshape: "c6", position: "side" },
      ],
    },
    {
      id: "on-va-montagne",
      phrase: "On va à la montagne",
      keys: [
        { syllable: "on", handshape: "c6", position: "cheek" },
        { syllable: "va", handshape: "c6", position: "throat" },
        { syllable: "à", handshape: "c6", position: "throat" },
        { syllable: "la", handshape: "c3", position: "throat" },
        { syllable: "mon", handshape: "c2", position: "cheek" },
        { syllable: "ta", handshape: "c2", position: "throat" },
        { syllable: "gne", handshape: "c4", position: "mouth" },
      ],
    },
    {
      id: "un-cafe",
      phrase: "Un café, s’il te plaît",
      keys: [
        { syllable: "un", handshape: "c6", position: "chin" },
        { syllable: "ca", handshape: "c3", position: "throat" },
        { syllable: "fé", handshape: "c2", position: "mouth" },
        { syllable: "s'", handshape: "c5", position: "mouth" },
        { syllable: "il", handshape: "c3", position: "mouth" },
        { syllable: "te", handshape: "c2", position: "mouth" },
        { syllable: "plaît", handshape: "c1", position: "mouth" },
      ],
    },
    {
      id: "bonjour-lausanne",
      phrase: "Bonjour Lausanne",
      keys: [
        { syllable: "bon", handshape: "c1", position: "cheek" },
        { syllable: "jour", handshape: "c1", position: "side" },
        { syllable: "lau", handshape: "c3", position: "side" },
        { syllable: "sanne", handshape: "c5", position: "chin" },
      ],
    },
    {
      id: "j-ai-mon-natel",
      phrase: "J’ai mon natel",
      keys: [
        { syllable: "j'", handshape: "c1", position: "mouth" },
        { syllable: "ai", handshape: "c6", position: "mouth" },
        { syllable: "mon", handshape: "c2", position: "cheek" },
        { syllable: "na", handshape: "c3", position: "throat" },
        { syllable: "tel", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "huitante-francs",
      phrase: "Huitante francs",
      keys: [
        { syllable: "hui", handshape: "c7", position: "side" },
        { syllable: "tan", handshape: "c2", position: "chin" },
        { syllable: "te", handshape: "c2", position: "mouth" },
        { syllable: "francs", handshape: "c2", position: "chin" },
      ],
    },
    {
      id: "on-prend-le-train",
      phrase: "On prend le train",
      keys: [
        { syllable: "on", handshape: "c6", position: "cheek" },
        { syllable: "prend", handshape: "c1", position: "chin" },
        { syllable: "le", handshape: "c3", position: "mouth" },
        { syllable: "train", handshape: "c2", position: "chin" },
      ],
    },
    {
      id: "fondue-ce-soir",
      phrase: "Fondue ce soir ?",
      keys: [
        { syllable: "fon", handshape: "c2", position: "cheek" },
        { syllable: "due", handshape: "c1", position: "side" },
        { syllable: "ce", handshape: "c5", position: "mouth" },
        { syllable: "soir", handshape: "c5", position: "side" },
      ],
    },
    {
      id: "il-neige",
      phrase: "Il neige !",
      keys: [
        { syllable: "il", handshape: "c3", position: "mouth" },
        { syllable: "nei", handshape: "c3", position: "mouth" },
        { syllable: "ge", handshape: "c1", position: "mouth" },
      ],
    },
    {
      id: "au-lac",
      phrase: "On va au lac",
      keys: [
        { syllable: "on", handshape: "c6", position: "cheek" },
        { syllable: "va", handshape: "c6", position: "throat" },
        { syllable: "au", handshape: "c6", position: "side" },
        { syllable: "lac", handshape: "c3", position: "throat" },
      ],
    },
    {
      id: "bonne-nuit-ch",
      phrase: "Bonne nuit",
      keys: [
        { syllable: "bonne", handshape: "c1", position: "cheek" },
        { syllable: "nuit", handshape: "c3", position: "side" },
      ],
    },
  ] satisfies PhraseDrill[],
};
