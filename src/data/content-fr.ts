/** Contenu pack France — mots & phrases (clés LfPC / ALPC). */

import type { PhraseDrill, WordDrill } from "@/data/lpc-fr";

export const CONTENT_FR = {
  words: [
    {
      id: "papa",
      word: "papa",
      keys: [
        { syllable: "pa", handshape: "c1", position: "side" },
        { syllable: "pa", handshape: "c1", position: "side" },
      ],
    },
    {
      id: "maman",
      word: "maman",
      keys: [
        { syllable: "ma", handshape: "c5", position: "side" },
        { syllable: "man", handshape: "c5", position: "mouth" },
      ],
    },
    {
      id: "bonjour",
      word: "bonjour",
      keys: [
        { syllable: "bon", handshape: "c4", position: "mouth" },
        { syllable: "jour", handshape: "c1", position: "chin" },
      ],
    },
    {
      id: "merci",
      word: "merci",
      keys: [
        { syllable: "mer", handshape: "c5", position: "chin" },
        { syllable: "ci", handshape: "c3", position: "mouth" },
      ],
    },
    {
      id: "salut",
      word: "salut",
      keys: [
        { syllable: "sa", handshape: "c3", position: "side" },
        { syllable: "lut", handshape: "c6", position: "throat" },
      ],
    },
    {
      id: "oui",
      word: "oui",
      keys: [{ syllable: "oui", handshape: "c6", position: "mouth" }],
    },
    {
      id: "non",
      word: "non",
      keys: [{ syllable: "non", handshape: "c4", position: "mouth" }],
    },
    {
      id: "eau",
      word: "eau",
      keys: [{ syllable: "eau", handshape: "c5", position: "side" }],
    },
    {
      id: "lait",
      word: "lait",
      keys: [{ syllable: "lait", handshape: "c6", position: "chin" }],
    },
    {
      id: "pain",
      word: "pain",
      keys: [{ syllable: "pain", handshape: "c1", position: "cheek" }],
    },
    {
      id: "chat",
      word: "chat",
      keys: [{ syllable: "chat", handshape: "c6", position: "side" }],
    },
    {
      id: "ami",
      word: "ami",
      keys: [
        { syllable: "a", handshape: "c5", position: "side" },
        { syllable: "mi", handshape: "c5", position: "mouth" },
      ],
    },
    {
      id: "ecole",
      word: "école",
      keys: [
        { syllable: "é", handshape: "c5", position: "throat" },
        { syllable: "cole", handshape: "c2", position: "chin" },
      ],
    },
    {
      id: "livre",
      word: "livre",
      keys: [
        { syllable: "li", handshape: "c6", position: "mouth" },
        { syllable: "vre", handshape: "c3", position: "side" },
      ],
    },
    {
      id: "maison",
      word: "maison",
      keys: [
        { syllable: "mai", handshape: "c5", position: "chin" },
        { syllable: "son", handshape: "c2", position: "mouth" },
      ],
    },
    {
      id: "soleil",
      word: "soleil",
      keys: [
        { syllable: "so", handshape: "c3", position: "chin" },
        { syllable: "leil", handshape: "c6", position: "chin" },
      ],
    },
    {
      id: "porte",
      word: "porte",
      keys: [{ syllable: "porte", handshape: "c1", position: "chin" }],
    },
    {
      id: "table",
      word: "table",
      keys: [
        { syllable: "ta", handshape: "c5", position: "side" },
        { syllable: "ble", handshape: "c6", position: "side" },
      ],
    },
    {
      id: "pomme",
      word: "pomme",
      keys: [{ syllable: "pomme", handshape: "c1", position: "chin" }],
    },
    {
      id: "chien",
      word: "chien",
      keys: [{ syllable: "chien", handshape: "c6", position: "cheek" }],
    },
    {
      id: "fleur",
      word: "fleur",
      keys: [{ syllable: "fleur", handshape: "c6", position: "cheek" }],
    },
    {
      id: "nuit",
      word: "nuit",
      keys: [{ syllable: "nuit", handshape: "c4", position: "mouth" }],
    },
    {
      id: "jour",
      word: "jour",
      keys: [{ syllable: "jour", handshape: "c1", position: "chin" }],
    },
    {
      id: "merci-bis",
      word: "s’il te plaît",
      keys: [
        { syllable: "s'il", handshape: "c3", position: "mouth" },
        { syllable: "te", handshape: "c5", position: "side" },
        { syllable: "plaît", handshape: "c6", position: "chin" },
      ],
    },
    {
      id: "bonjour-soir",
      word: "bonsoir",
      keys: [
        { syllable: "bon", handshape: "c4", position: "mouth" },
        { syllable: "soir", handshape: "c3", position: "side" },
      ],
    },
    {
      id: "bebe",
      word: "bébé",
      keys: [
        { syllable: "bé", handshape: "c4", position: "throat" },
        { syllable: "bé", handshape: "c4", position: "throat" },
      ],
    },
  ] satisfies WordDrill[],

  phrases: [
    {
      id: "bonjour-toi",
      phrase: "Bonjour !",
      keys: [
        { syllable: "bon", handshape: "c4", position: "mouth" },
        { syllable: "jour", handshape: "c1", position: "chin" },
      ],
    },
    {
      id: "merci-beaucoup",
      phrase: "Merci beaucoup",
      keys: [
        { syllable: "mer", handshape: "c5", position: "chin" },
        { syllable: "ci", handshape: "c3", position: "mouth" },
        { syllable: "beau", handshape: "c4", position: "side" },
        { syllable: "coup", handshape: "c2", position: "chin" },
      ],
    },
    {
      id: "ca-va",
      phrase: "Ça va ?",
      keys: [
        { syllable: "ça", handshape: "c3", position: "side" },
        { syllable: "va", handshape: "c2", position: "side" },
      ],
    },
    {
      id: "oui-ca-va",
      phrase: "Oui, ça va",
      keys: [
        { syllable: "oui", handshape: "c6", position: "mouth" },
        { syllable: "ça", handshape: "c3", position: "side" },
        { syllable: "va", handshape: "c2", position: "side" },
      ],
    },
    {
      id: "au-revoir",
      phrase: "Au revoir",
      keys: [
        { syllable: "au", handshape: "c5", position: "side" },
        { syllable: "re", handshape: "c3", position: "side" },
        { syllable: "voir", handshape: "c2", position: "side" },
      ],
    },
    {
      id: "je-taime",
      phrase: "Je t’aime",
      keys: [
        { syllable: "je", handshape: "c1", position: "side" },
        { syllable: "t'", handshape: "c5", position: "side" },
        { syllable: "aime", handshape: "c5", position: "chin" },
      ],
    },
    {
      id: "a-bientot",
      phrase: "À bientôt",
      keys: [
        { syllable: "à", handshape: "c5", position: "side" },
        { syllable: "bien", handshape: "c4", position: "cheek" },
        { syllable: "tôt", handshape: "c5", position: "side" },
      ],
    },
    {
      id: "bonne-nuit",
      phrase: "Bonne nuit",
      keys: [
        { syllable: "bonne", handshape: "c4", position: "chin" },
        { syllable: "nuit", handshape: "c4", position: "mouth" },
      ],
    },
    {
      id: "comment-ca-va",
      phrase: "Comment ça va ?",
      keys: [
        { syllable: "com", handshape: "c2", position: "chin" },
        { syllable: "ment", handshape: "c5", position: "mouth" },
        { syllable: "ça", handshape: "c3", position: "side" },
        { syllable: "va", handshape: "c2", position: "side" },
      ],
    },
    {
      id: "je-vais-bien",
      phrase: "Je vais bien",
      keys: [
        { syllable: "je", handshape: "c1", position: "side" },
        { syllable: "vais", handshape: "c2", position: "chin" },
        { syllable: "bien", handshape: "c4", position: "cheek" },
      ],
    },
    {
      id: "sil-te-plait",
      phrase: "S’il te plaît",
      keys: [
        { syllable: "s'il", handshape: "c3", position: "mouth" },
        { syllable: "te", handshape: "c5", position: "side" },
        { syllable: "plaît", handshape: "c6", position: "chin" },
      ],
    },
    {
      id: "bonne-journee",
      phrase: "Bonne journée",
      keys: [
        { syllable: "bonne", handshape: "c4", position: "chin" },
        { syllable: "jour", handshape: "c1", position: "chin" },
        { syllable: "née", handshape: "c4", position: "throat" },
      ],
    },
    {
      id: "a-demain",
      phrase: "À demain",
      keys: [
        { syllable: "à", handshape: "c5", position: "side" },
        { syllable: "de", handshape: "c1", position: "side" },
        { syllable: "main", handshape: "c5", position: "cheek" },
      ],
    },
    {
      id: "j-ai-faim",
      phrase: "J’ai faim",
      keys: [
        { syllable: "j'ai", handshape: "c1", position: "throat" },
        { syllable: "faim", handshape: "c5", position: "cheek" },
      ],
    },
    {
      id: "j-ai-soif",
      phrase: "J’ai soif",
      keys: [
        { syllable: "j'ai", handshape: "c1", position: "throat" },
        { syllable: "soif", handshape: "c3", position: "side" },
      ],
    },
    {
      id: "tout-va-bien",
      phrase: "Tout va bien",
      keys: [
        { syllable: "tout", handshape: "c5", position: "chin" },
        { syllable: "va", handshape: "c2", position: "side" },
        { syllable: "bien", handshape: "c4", position: "cheek" },
      ],
    },
  ] satisfies PhraseDrill[],
};
