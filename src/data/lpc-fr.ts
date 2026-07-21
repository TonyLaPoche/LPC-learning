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
  display: string;
  cue: CueKey;
  tip?: string;
};

export type WordDrill = {
  id: string;
  word: string;
  keys: Array<CueKey & { syllable: string }>;
};

export type PhraseDrill = {
  id: string;
  phrase: string;
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
    tip: "Doigts joints + gorge",
  },
  {
    id: "da",
    label: "Syllabe da",
    display: "da",
    cue: { handshape: "c1", position: "throat" },
    tip: "Même clé que pa — différencié par les lèvres",
  },
  {
    id: "mi",
    label: "Syllabe mi",
    display: "mi",
    cue: { handshape: "c2", position: "mouth" },
    tip: "Index + bouche",
  },
  {
    id: "tu",
    label: "Syllabe tu",
    display: "tu",
    cue: { handshape: "c2", position: "side" },
    tip: "Index + côté",
  },
  {
    id: "ma",
    label: "Syllabe ma",
    display: "ma",
    cue: { handshape: "c2", position: "throat" },
    tip: "Index + gorge",
  },
  {
    id: "la",
    label: "Syllabe la",
    display: "la",
    cue: { handshape: "c3", position: "throat" },
    tip: "Index+majeur + gorge",
  },
  {
    id: "li",
    label: "Syllabe li",
    display: "li",
    cue: { handshape: "c3", position: "mouth" },
    tip: "Index+majeur + bouche",
  },
  {
    id: "ni",
    label: "Syllabe ni",
    display: "ni",
    cue: { handshape: "c3", position: "mouth" },
    tip: "Index+majeur + bouche",
  },
  {
    id: "ra",
    label: "Syllabe ra",
    display: "ra",
    cue: { handshape: "c4", position: "throat" },
    tip: "Trois doigts + gorge",
  },
  {
    id: "ri",
    label: "Syllabe ri",
    display: "ri",
    cue: { handshape: "c4", position: "mouth" },
    tip: "Trois doigts + bouche",
  },
  {
    id: "si",
    label: "Syllabe si",
    display: "si",
    cue: { handshape: "c5", position: "mouth" },
    tip: "Quatre doigts + bouche",
  },
  {
    id: "sa",
    label: "Syllabe sa",
    display: "sa",
    cue: { handshape: "c5", position: "throat" },
    tip: "Quatre doigts + gorge",
  },
  {
    id: "ba",
    label: "Syllabe ba",
    display: "ba",
    cue: { handshape: "c5", position: "throat" },
    tip: "Quatre doigts + gorge",
  },
  {
    id: "ou",
    label: "Voyelle ou",
    display: "ou",
    cue: { handshape: "c6", position: "side" },
    tip: "Poing (∅) + côté",
  },
  {
    id: "va",
    label: "Syllabe va",
    display: "va",
    cue: { handshape: "c6", position: "throat" },
    tip: "Poing + gorge",
  },
  {
    id: "cha",
    label: "Syllabe cha",
    display: "cha",
    cue: { handshape: "c7", position: "throat" },
    tip: "Pouce+index + gorge",
  },
  {
    id: "chi",
    label: "Syllabe chi",
    display: "chi",
    cue: { handshape: "c7", position: "mouth" },
    tip: "Pouce+index + bouche",
  },
  {
    id: "ya",
    label: "Syllabe ya",
    display: "ya",
    cue: { handshape: "c8", position: "throat" },
    tip: "Pouce+index+majeur + gorge",
  },
  {
    id: "an",
    label: "Voyelle an",
    display: "an",
    cue: { handshape: "c6", position: "chin" },
    tip: "Poing (∅) + menton",
  },
  {
    id: "on",
    label: "Voyelle on",
    display: "on",
    cue: { handshape: "c6", position: "cheek" },
    tip: "Poing (∅) + joue",
  },
];

export function handshapeById(id: HandshapeId): HandshapeDef {
  return HANDSHAPES.find((h) => h.id === id)!;
}

export function positionById(id: PositionId): PositionDef {
  return POSITIONS.find((p) => p.id === id)!;
}

export type LessonTrack =
  | "shapes"
  | "positions"
  | "syllables"
  | "words"
  | "phrases"
  | "reps-syllables"
  | "reps-words"
  | "reps-phrases"
  | "free"
  | "custom";

export const TRACKS: Array<{
  id: LessonTrack;
  title: string;
  subtitle: string;
  badge: string;
  kind: "lesson" | "reps" | "free" | "custom";
}> = [
  {
    id: "shapes",
    title: "Formes",
    subtitle: "Les 8 configurations de doigts",
    badge: "1",
    kind: "lesson",
  },
  {
    id: "positions",
    title: "Positions",
    subtitle: "Les 5 zones autour du visage",
    badge: "2",
    kind: "lesson",
  },
  {
    id: "syllables",
    title: "Syllabes",
    subtitle: "20 clés forme × position",
    badge: "3",
    kind: "lesson",
  },
  {
    id: "words",
    title: "Mots",
    subtitle: "Vocabulaire du quotidien",
    badge: "4",
    kind: "lesson",
  },
  {
    id: "phrases",
    title: "Phrases",
    subtitle: "Enchaîner des clés en contexte",
    badge: "5",
    kind: "lesson",
  },
  {
    id: "reps-syllables",
    title: "Répétitions · syllabes",
    subtitle: "3× guidé, puis rappel sans guide",
    badge: "↻",
    kind: "reps",
  },
  {
    id: "reps-words",
    title: "Répétitions · mots",
    subtitle: "Ancrer le vocabulaire du pack",
    badge: "↻",
    kind: "reps",
  },
  {
    id: "reps-phrases",
    title: "Répétitions · phrases",
    subtitle: "Guidé puis rappel bonus",
    badge: "↻",
    kind: "reps",
  },
  {
    id: "free",
    title: "Mode libre",
    subtitle: "Explore sans consigne — feedback live",
    badge: "∞",
    kind: "free",
  },
  {
    id: "custom",
    title: "Phrase custom",
    subtitle: "Écris une phrase, puis code-la clé par clé",
    badge: "✎",
    kind: "custom",
  },
];
