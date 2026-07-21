/** Contenu pack France — mots & phrases. */

import type { PhraseDrill, WordDrill } from "@/data/lpc-fr";

export const CONTENT_FR = {
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
      id: "eau",
      word: "eau",
      keys: [{ syllable: "eau", handshape: "c6", position: "side" }],
    },
    {
      id: "lait",
      word: "lait",
      keys: [{ syllable: "lait", handshape: "c3", position: "mouth" }],
    },
    {
      id: "pain",
      word: "pain",
      keys: [{ syllable: "pain", handshape: "c1", position: "chin" }],
    },
    {
      id: "chat",
      word: "chat",
      keys: [{ syllable: "chat", handshape: "c7", position: "throat" }],
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
      id: "ecole",
      word: "école",
      keys: [
        { syllable: "é", handshape: "c6", position: "mouth" },
        { syllable: "co", handshape: "c3", position: "side" },
        { syllable: "le", handshape: "c3", position: "mouth" },
      ],
    },
    {
      id: "livre",
      word: "livre",
      keys: [
        { syllable: "li", handshape: "c3", position: "mouth" },
        { syllable: "vre", handshape: "c6", position: "mouth" },
      ],
    },
    {
      id: "maison",
      word: "maison",
      keys: [
        { syllable: "mai", handshape: "c2", position: "mouth" },
        { syllable: "son", handshape: "c5", position: "cheek" },
      ],
    },
    {
      id: "soleil",
      word: "soleil",
      keys: [
        { syllable: "so", handshape: "c5", position: "side" },
        { syllable: "leil", handshape: "c3", position: "mouth" },
      ],
    },
    {
      id: "porte",
      word: "porte",
      keys: [
        { syllable: "por", handshape: "c1", position: "side" },
        { syllable: "te", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "table",
      word: "table",
      keys: [
        { syllable: "ta", handshape: "c2", position: "throat" },
        { syllable: "ble", handshape: "c1", position: "mouth" },
      ],
    },
    {
      id: "pomme",
      word: "pomme",
      keys: [
        { syllable: "pom", handshape: "c1", position: "cheek" },
        { syllable: "me", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "chien",
      word: "chien",
      keys: [{ syllable: "chien", handshape: "c7", position: "chin" }],
    },
    {
      id: "fleur",
      word: "fleur",
      keys: [{ syllable: "fleur", handshape: "c2", position: "side" }],
    },
    {
      id: "nuit",
      word: "nuit",
      keys: [{ syllable: "nuit", handshape: "c3", position: "side" }],
    },
    {
      id: "jour",
      word: "jour",
      keys: [{ syllable: "jour", handshape: "c1", position: "side" }],
    },
    {
      id: "merci-bis",
      word: "s’il te plaît",
      keys: [
        { syllable: "s'", handshape: "c5", position: "mouth" },
        { syllable: "il", handshape: "c3", position: "mouth" },
        { syllable: "te", handshape: "c2", position: "mouth" },
        { syllable: "plaît", handshape: "c1", position: "mouth" },
      ],
    },
    {
      id: "bonjour-soir",
      word: "bonsoir",
      keys: [
        { syllable: "bon", handshape: "c1", position: "cheek" },
        { syllable: "soir", handshape: "c5", position: "side" },
      ],
    },
    {
      id: "bebe",
      word: "bébé",
      keys: [
        { syllable: "bé", handshape: "c5", position: "mouth" },
        { syllable: "bé", handshape: "c5", position: "mouth" },
      ],
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
      id: "ca-va",
      phrase: "Ça va ?",
      keys: [
        { syllable: "ça", handshape: "c5", position: "throat" },
        { syllable: "va", handshape: "c6", position: "throat" },
      ],
    },
    {
      id: "oui-ca-va",
      phrase: "Oui, ça va",
      keys: [
        { syllable: "oui", handshape: "c6", position: "side" },
        { syllable: "ça", handshape: "c5", position: "throat" },
        { syllable: "va", handshape: "c6", position: "throat" },
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
      id: "je-taime",
      phrase: "Je t’aime",
      keys: [
        { syllable: "je", handshape: "c1", position: "mouth" },
        { syllable: "t'", handshape: "c2", position: "mouth" },
        { syllable: "aime", handshape: "c6", position: "mouth" },
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
      id: "bonne-nuit",
      phrase: "Bonne nuit",
      keys: [
        { syllable: "bonne", handshape: "c1", position: "cheek" },
        { syllable: "nuit", handshape: "c3", position: "side" },
      ],
    },
    {
      id: "comment-ca-va",
      phrase: "Comment ça va ?",
      keys: [
        { syllable: "com", handshape: "c3", position: "cheek" },
        { syllable: "ment", handshape: "c2", position: "chin" },
        { syllable: "ça", handshape: "c5", position: "throat" },
        { syllable: "va", handshape: "c6", position: "throat" },
      ],
    },
    {
      id: "je-vais-bien",
      phrase: "Je vais bien",
      keys: [
        { syllable: "je", handshape: "c1", position: "mouth" },
        { syllable: "vais", handshape: "c6", position: "mouth" },
        { syllable: "bien", handshape: "c1", position: "chin" },
      ],
    },
    {
      id: "sil-te-plait",
      phrase: "S’il te plaît",
      keys: [
        { syllable: "s'", handshape: "c5", position: "mouth" },
        { syllable: "il", handshape: "c3", position: "mouth" },
        { syllable: "te", handshape: "c2", position: "mouth" },
        { syllable: "plaît", handshape: "c1", position: "mouth" },
      ],
    },
    {
      id: "bonne-journee",
      phrase: "Bonne journée",
      keys: [
        { syllable: "bonne", handshape: "c1", position: "cheek" },
        { syllable: "jour", handshape: "c1", position: "side" },
        { syllable: "née", handshape: "c3", position: "mouth" },
      ],
    },
    {
      id: "a-demain",
      phrase: "À demain",
      keys: [
        { syllable: "à", handshape: "c6", position: "throat" },
        { syllable: "de", handshape: "c1", position: "mouth" },
        { syllable: "main", handshape: "c2", position: "chin" },
      ],
    },
    {
      id: "j-ai-faim",
      phrase: "J’ai faim",
      keys: [
        { syllable: "j'", handshape: "c1", position: "mouth" },
        { syllable: "ai", handshape: "c6", position: "mouth" },
        { syllable: "faim", handshape: "c2", position: "chin" },
      ],
    },
    {
      id: "j-ai-soif",
      phrase: "J’ai soif",
      keys: [
        { syllable: "j'", handshape: "c1", position: "mouth" },
        { syllable: "ai", handshape: "c6", position: "mouth" },
        { syllable: "soif", handshape: "c5", position: "side" },
      ],
    },
    {
      id: "tout-va-bien",
      phrase: "Tout va bien",
      keys: [
        { syllable: "tout", handshape: "c2", position: "side" },
        { syllable: "va", handshape: "c6", position: "throat" },
        { syllable: "bien", handshape: "c1", position: "chin" },
      ],
    },
  ] satisfies PhraseDrill[],
};
