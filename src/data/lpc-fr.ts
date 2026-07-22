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
    label: "Index",
    hint: "Seul l’index est tendu",
    consonants: ["p", "d", "ʒ"],
  },
  {
    id: "c2",
    label: "Index + majeur",
    hint: "Index et majeur tendus, jointifs",
    consonants: ["k", "v", "z"],
  },
  {
    id: "c3",
    label: "Cercle",
    hint: "Pouce et index forment un cercle (autres fermés)",
    consonants: ["s", "ʁ"],
  },
  {
    id: "c4",
    label: "Quatre doigts",
    hint: "Quatre doigts tendus, pouce rentré",
    consonants: ["b", "n", "ɥ"],
  },
  {
    id: "c5",
    label: "Cinq doigts",
    hint: "Main ouverte (pouce écarté) — aussi voyelle seule",
    consonants: ["m", "t", "f", "∅"],
  },
  {
    id: "c6",
    label: "Forme L",
    hint: "Pouce et index en L, autres fermés",
    consonants: ["l", "ʃ", "ɲ", "w"],
  },
  {
    id: "c7",
    label: "Trois doigts",
    hint: "Index, majeur et annulaire tendus",
    consonants: ["ɡ"],
  },
  {
    id: "c8",
    label: "Forme V",
    hint: "Index et majeur écartés en V",
    consonants: ["j", "ŋ"],
  },
];

export const POSITIONS: PositionDef[] = [
  {
    id: "side",
    label: "Côté",
    hint: "À côté du visage, hauteur des yeux / tempe — aussi consonne seule",
    vowels: ["a", "o", "œ", "ə"],
  },
  {
    id: "cheek",
    label: "Pommette",
    hint: "Contre la pommette / joue",
    vowels: ["ɛ̃", "ø"],
  },
  {
    id: "mouth",
    label: "Bouche",
    hint: "Devant la bouche / lèvres",
    vowels: ["i", "ɔ̃", "ɑ̃"],
  },
  {
    id: "chin",
    label: "Menton",
    hint: "Contre ou juste sous le menton",
    vowels: ["ɛ", "u", "ɔ"],
  },
  {
    id: "throat",
    label: "Gorge",
    hint: "Sous le menton, côté gorge / cou",
    vowels: ["y", "e", "œ̃"],
  },
];

export const SYLLABLE_DRILLS: DrillItem[] = [
  {
    id: "pa",
    label: "Syllabe pa",
    display: "pa",
    cue: { handshape: "c1", position: "side" },
    tip: "Index + côté",
  },
  {
    id: "da",
    label: "Syllabe da",
    display: "da",
    cue: { handshape: "c1", position: "side" },
    tip: "Même clé que pa — différencié par les lèvres",
  },
  {
    id: "pi",
    label: "Syllabe pi",
    display: "pi",
    cue: { handshape: "c1", position: "mouth" },
    tip: "Index + bouche",
  },
  {
    id: "mi",
    label: "Syllabe mi",
    display: "mi",
    cue: { handshape: "c5", position: "mouth" },
    tip: "Cinq doigts + bouche",
  },
  {
    id: "tu",
    label: "Syllabe tu",
    display: "tu",
    cue: { handshape: "c5", position: "chin" },
    tip: "Cinq doigts + menton",
  },
  {
    id: "ma",
    label: "Syllabe ma",
    display: "ma",
    cue: { handshape: "c5", position: "side" },
    tip: "Cinq doigts + côté",
  },
  {
    id: "ba",
    label: "Syllabe ba",
    display: "ba",
    cue: { handshape: "c4", position: "side" },
    tip: "Quatre doigts + côté",
  },
  {
    id: "la",
    label: "Syllabe la",
    display: "la",
    cue: { handshape: "c6", position: "side" },
    tip: "Forme L + côté",
  },
  {
    id: "li",
    label: "Syllabe li",
    display: "li",
    cue: { handshape: "c6", position: "mouth" },
    tip: "Forme L + bouche",
  },
  {
    id: "ni",
    label: "Syllabe ni",
    display: "ni",
    cue: { handshape: "c4", position: "mouth" },
    tip: "Quatre doigts + bouche",
  },
  {
    id: "ra",
    label: "Syllabe ra",
    display: "ra",
    cue: { handshape: "c3", position: "side" },
    tip: "Cercle + côté",
  },
  {
    id: "ri",
    label: "Syllabe ri",
    display: "ri",
    cue: { handshape: "c3", position: "mouth" },
    tip: "Cercle + bouche",
  },
  {
    id: "si",
    label: "Syllabe si",
    display: "si",
    cue: { handshape: "c3", position: "mouth" },
    tip: "Cercle + bouche",
  },
  {
    id: "sa",
    label: "Syllabe sa",
    display: "sa",
    cue: { handshape: "c3", position: "side" },
    tip: "Cercle + côté",
  },
  {
    id: "va",
    label: "Syllabe va",
    display: "va",
    cue: { handshape: "c2", position: "side" },
    tip: "Index+majeur + côté",
  },
  {
    id: "ka",
    label: "Syllabe ka",
    display: "ka",
    cue: { handshape: "c2", position: "side" },
    tip: "Index+majeur + côté",
  },
  {
    id: "cha",
    label: "Syllabe cha",
    display: "cha",
    cue: { handshape: "c6", position: "side" },
    tip: "Forme L + côté",
  },
  {
    id: "chi",
    label: "Syllabe chi",
    display: "chi",
    cue: { handshape: "c6", position: "mouth" },
    tip: "Forme L + bouche",
  },
  {
    id: "ya",
    label: "Syllabe ya",
    display: "ya",
    cue: { handshape: "c8", position: "side" },
    tip: "Forme V + côté",
  },
  {
    id: "ou",
    label: "Voyelle ou",
    display: "ou",
    cue: { handshape: "c5", position: "chin" },
    tip: "Cinq doigts (∅) + menton",
  },
  {
    id: "an",
    label: "Voyelle an",
    display: "an",
    cue: { handshape: "c5", position: "mouth" },
    tip: "Cinq doigts (∅) + bouche",
  },
  {
    id: "on",
    label: "Voyelle on",
    display: "on",
    cue: { handshape: "c5", position: "mouth" },
    tip: "Cinq doigts (∅) + bouche",
  },
  {
    id: "in",
    label: "Voyelle in",
    display: "in",
    cue: { handshape: "c5", position: "cheek" },
    tip: "Cinq doigts (∅) + pommette",
  },
  {
    id: "é",
    label: "Voyelle é",
    display: "é",
    cue: { handshape: "c5", position: "throat" },
    tip: "Cinq doigts (∅) + gorge",
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
    subtitle: "Clés forme × position (LfPC)",
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
