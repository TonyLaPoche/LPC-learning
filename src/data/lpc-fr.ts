/** Référentiel pédagogique LPC fr-FR (inspiré ALPC). */

export type HandshapeId =
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c5"
  | "c6"
  | "c7"
  | "c8";

export type PositionId = "side" | "chin" | "mouth" | "cheek" | "throat";

export type CueKey = {
  handshape: HandshapeId;
  position: PositionId;
};

export type HandshapeDef = {
  id: HandshapeId;
  label: string;
  hint: string;
  consonants: string[];
};

export type PositionDef = {
  id: PositionId;
  label: string;
  hint: string;
  vowels: string[];
};

export type DrillItem = {
  id: string;
  label: string;
  /** Texte affiché (phonétique ou orthographe) */
  display: string;
  cue: CueKey;
  tip?: string;
};

export type WordDrill = {
  id: string;
  word: string;
  keys: Array<CueKey & { syllable: string }>;
};

export const HANDSHAPES: HandshapeDef[] = [
  {
    id: "c1",
    label: "Doigts joints",
    hint: "Quatre doigts étendus et collés, pouce rentré",
    consonants: ["p", "d", "ʒ"],
  },
  {
    id: "c2",
    label: "Index",
    hint: "Seul l’index est tendu",
    consonants: ["t", "m", "f"],
  },
  {
    id: "c3",
    label: "Index + majeur",
    hint: "Index et majeur tendus",
    consonants: ["k", "n", "l"],
  },
  {
    id: "c4",
    label: "Trois doigts",
    hint: "Index, majeur et annulaire tendus",
    consonants: ["ʁ", "ɡ", "ɲ"],
  },
  {
    id: "c5",
    label: "Quatre doigts",
    hint: "Quatre doigts tendus (légèrement écartés)",
    consonants: ["s", "b", "ɥ"],
  },
  {
    id: "c6",
    label: "Poing",
    hint: "Tous les doigts fermés",
    consonants: ["∅", "v", "z"],
  },
  {
    id: "c7",
    label: "Pouce + index",
    hint: "Pouce et index tendus, autres fermés",
    consonants: ["ʃ", "w"],
  },
  {
    id: "c8",
    label: "Pouce + index + majeur",
    hint: "Pouce, index et majeur tendus",
    consonants: ["j"],
  },
];

export const POSITIONS: PositionDef[] = [
  {
    id: "side",
    label: "Côté",
    hint: "À côté du visage, hauteur des yeux / tempe",
    vowels: ["u", "o", "ɔ"],
  },
  {
    id: "chin",
    label: "Menton",
    hint: "Contre ou juste sous le menton",
    vowels: ["ɛ̃", "œ̃", "ɑ̃"],
  },
  {
    id: "mouth",
    label: "Bouche",
    hint: "Devant la bouche / lèvres",
    vowels: ["i", "e", "ɛ"],
  },
  {
    id: "cheek",
    label: "Joue",
    hint: "Contre la pommette / joue",
    vowels: ["y", "ø", "ɔ̃"],
  },
  {
    id: "throat",
    label: "Gorge",
    hint: "Sous le menton, côté gorge / cou",
    vowels: ["a", "ə", "ɑ"],
  },
];

export const SYLLABLE_DRILLS: DrillItem[] = [
  {
    id: "pa",
    label: "Syllabe pa",
    display: "pa",
    cue: { handshape: "c1", position: "throat" },
    tip: "Forme doigts joints + position gorge",
  },
  {
    id: "mi",
    label: "Syllabe mi",
    display: "mi",
    cue: { handshape: "c2", position: "mouth" },
    tip: "Index + bouche",
  },
  {
    id: "la",
    label: "Syllabe la",
    display: "la",
    cue: { handshape: "c3", position: "throat" },
    tip: "Index+majeur + gorge",
  },
  {
    id: "si",
    label: "Syllabe si",
    display: "si",
    cue: { handshape: "c5", position: "mouth" },
    tip: "Quatre doigts + bouche",
  },
  {
    id: "ou",
    label: "Voyelle ou",
    display: "ou",
    cue: { handshape: "c6", position: "side" },
    tip: "Poing (∅) + côté",
  },
  {
    id: "cha",
    label: "Syllabe cha",
    display: "cha",
    cue: { handshape: "c7", position: "throat" },
    tip: "Pouce+index + gorge",
  },
];

export const WORD_DRILLS: WordDrill[] = [
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
];

export function handshapeById(id: HandshapeId): HandshapeDef {
  return HANDSHAPES.find((h) => h.id === id)!;
}

export function positionById(id: PositionId): PositionDef {
  return POSITIONS.find((p) => p.id === id)!;
}

export type LessonTrack = "shapes" | "positions" | "syllables" | "words";

export const TRACKS: Array<{
  id: LessonTrack;
  title: string;
  subtitle: string;
  badge: string;
}> = [
  {
    id: "shapes",
    title: "Formes",
    subtitle: "Les 8 configurations de doigts",
    badge: "1",
  },
  {
    id: "positions",
    title: "Positions",
    subtitle: "Les 5 zones autour du visage",
    badge: "2",
  },
  {
    id: "syllables",
    title: "Syllabes",
    subtitle: "Combiner forme × position",
    badge: "3",
  },
  {
    id: "words",
    title: "Mots",
    subtitle: "Enchaîner des clés",
    badge: "4",
  },
];
