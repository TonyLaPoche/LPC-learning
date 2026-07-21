/**
 * Texte FR → clés LPC (approximation pédagogique).
 * Pas un équivalent TextCueS / formation certifiante.
 */

import type { HandshapeId, PositionId } from "@/data/lpc-fr";
import type { PackId } from "@/data/packs";
import { textToCuesEn } from "@/lib/textToCuesEn";

export type CueToken = {
  syllable: string;
  handshape: HandshapeId;
  position: PositionId;
};

export type TextToCuesResult = {
  keys: CueToken[];
  words: string[];
  warnings: string[];
};

/** Voyelles / digraphes → position (plus longs d’abord) */
const VOWEL_RULES: Array<{ g: string; pos: PositionId }> = [
  { g: "eau", pos: "side" },
  { g: "ain", pos: "chin" },
  { g: "ein", pos: "chin" },
  { g: "aim", pos: "chin" },
  { g: "eim", pos: "chin" },
  { g: "oin", pos: "chin" },
  { g: "ien", pos: "chin" },
  // Nasales orthographiques avec t/d souvent muets (comment, grand…)
  { g: "ent", pos: "chin" },
  { g: "ant", pos: "chin" },
  { g: "ont", pos: "cheek" },
  { g: "int", pos: "chin" },
  { g: "unt", pos: "chin" },
  { g: "and", pos: "chin" },
  { g: "end", pos: "chin" },
  { g: "ond", pos: "cheek" },
  // espèce(s) : /ɛs.pɛs/ → és + pèce(s), pas é|spè|ce
  { g: "èces", pos: "mouth" },
  { g: "èce", pos: "mouth" },
  { g: "eces", pos: "mouth" },
  { g: "ece", pos: "mouth" },
  { g: "és", pos: "mouth" },
  { g: "ès", pos: "mouth" },
  { g: "es", pos: "mouth" },
  // pour / jour / soir : r en coda avec la voyelle (pas pou|rquoi)
  { g: "our", pos: "side" },
  { g: "oir", pos: "side" },
  { g: "eur", pos: "cheek" },
  { g: "aur", pos: "side" },
  { g: "an", pos: "chin" },
  { g: "en", pos: "chin" },
  { g: "am", pos: "chin" },
  { g: "em", pos: "chin" },
  { g: "in", pos: "chin" },
  { g: "im", pos: "chin" },
  { g: "un", pos: "chin" },
  { g: "um", pos: "chin" },
  { g: "on", pos: "cheek" },
  { g: "om", pos: "cheek" },
  { g: "ou", pos: "side" },
  { g: "au", pos: "side" },
  { g: "oi", pos: "throat" }, // /wa/ ≈ w+a pédagogique
  { g: "ui", pos: "mouth" },
  { g: "eu", pos: "cheek" },
  { g: "œu", pos: "cheek" },
  { g: "ai", pos: "mouth" },
  { g: "ei", pos: "mouth" },
  { g: "ay", pos: "mouth" },
  { g: "oy", pos: "side" },
  { g: "ée", pos: "mouth" },
  { g: "é", pos: "mouth" },
  { g: "è", pos: "mouth" },
  { g: "ê", pos: "mouth" },
  { g: "ë", pos: "mouth" },
  { g: "à", pos: "throat" },
  { g: "â", pos: "throat" },
  { g: "ô", pos: "side" },
  { g: "î", pos: "mouth" },
  { g: "ï", pos: "mouth" },
  { g: "û", pos: "cheek" },
  { g: "ù", pos: "cheek" },
  { g: "a", pos: "throat" },
  { g: "e", pos: "mouth" },
  { g: "i", pos: "mouth" },
  { g: "o", pos: "side" },
  { g: "u", pos: "cheek" },
  { g: "y", pos: "mouth" },
];
/** Consonnes finales souvent muettes (hors liaison). */
const MUTE_FINAL = new Set(["t", "d", "s", "x", "z"]);
const CONS_RULES: Array<{ g: string; shape: HandshapeId }> = [
  { g: "ch", shape: "c7" },
  { g: "gn", shape: "c4" },
  { g: "qu", shape: "c3" },
  { g: "ph", shape: "c2" },
  { g: "gu", shape: "c4" },
  { g: "ç", shape: "c5" },
  { g: "p", shape: "c1" },
  { g: "b", shape: "c5" },
  { g: "t", shape: "c2" },
  { g: "d", shape: "c1" },
  { g: "k", shape: "c3" },
  { g: "m", shape: "c2" },
  { g: "n", shape: "c3" },
  { g: "f", shape: "c2" },
  { g: "v", shape: "c6" },
  { g: "s", shape: "c5" },
  { g: "z", shape: "c6" },
  { g: "l", shape: "c3" },
  { g: "r", shape: "c4" },
  { g: "j", shape: "c1" },
  { g: "w", shape: "c7" },
  { g: "x", shape: "c5" },
  { g: "h", shape: "c6" },
];

function consonantAt(
  word: string,
  i: number,
): { shape: HandshapeId; len: number; g: string } | null {
  const rest = word.slice(i);
  // c soft / hard
  if (rest.startsWith("c")) {
    const next = rest[1];
    if (next && "eéiîy".includes(next)) {
      return { shape: "c5", len: 1, g: "c" };
    }
    return { shape: "c3", len: 1, g: "c" };
  }
  // g soft / hard
  if (rest.startsWith("g") && !rest.startsWith("gu") && !rest.startsWith("gn")) {
    const next = rest[1];
    if (next && "eéiîy".includes(next)) {
      return { shape: "c1", len: 1, g: "g" };
    }
    return { shape: "c4", len: 1, g: "g" };
  }
  for (const r of CONS_RULES) {
    if (word.startsWith(r.g, i)) {
      return { shape: r.shape, len: r.g.length, g: r.g };
    }
  }
  return null;
}

function vowelAt(
  word: string,
  i: number,
  onsetLen = 0,
): { pos: PositionId; len: number; g: string } | null {
  for (const r of VOWEL_RULES) {
    if (!word.startsWith(r.g, i)) continue;
    // « vraiment » : préférer ai + ent plutôt que aim + ent
    if (
      (r.g === "aim" ||
        r.g === "ain" ||
        r.g === "eim" ||
        r.g === "ein") &&
      word.startsWith("ent", i + r.g.length)
    ) {
      continue;
    }
    // « es/és/ès » seulement en tête de syllabe (espèce), pas dans « mesure »
    if (
      (r.g === "es" || r.g === "és" || r.g === "ès") &&
      onsetLen > 0
    ) {
      continue;
    }
    return { pos: r.pos, len: r.g.length, g: r.g };
  }
  return null;
}

function stripMuteE(word: string): string {
  if (word.length <= 2) return word;
  if (!word.endsWith("e")) return word;
  const before = word[word.length - 2]!;
  if ("aeiouyàâéèêëïîôùûü".includes(before)) return word;
  // e muet final fréquent
  return word.slice(0, -1);
}

/** Ignore une consonne finale typiquement muette (ex. t de comment). */
function isMuteFinalCluster(onset: string, atEnd: boolean): boolean {
  if (!atEnd || !onset) return false;
  return [...onset].every((ch) => MUTE_FINAL.has(ch));
}

function cueWord(raw: string): CueToken[] {
  let word = raw.replace(/'/g, "");
  if (!word) return [];
  word = stripMuteE(word);

  const keys: CueToken[] = [];
  let i = 0;

  while (i < word.length) {
    // onset consonants
    let shape: HandshapeId = "c6"; // voyelle seule
    let onset = "";
    while (i < word.length) {
      const c = consonantAt(word, i);
      if (!c) break;
      shape = c.shape;
      onset += c.g;
      i += c.len;
    }

    const v = vowelAt(word, i, onset.length);
    if (!v) {
      const atEnd = i >= word.length;
      // Ex. t final de « comment » déjà couvert par « ent », ou orphelin muet
      if (onset && isMuteFinalCluster(onset, atEnd)) {
        continue;
      }
      if (onset) {
        keys.push({
          syllable: onset,
          handshape: shape,
          position: "throat",
        });
      } else {
        i += 1;
      }
      continue;
    }

    const syllable = onset + v.g;
    const handshape: HandshapeId =
      v.g === "oi" ? "c7" : onset ? shape : "c6";

    keys.push({
      syllable,
      handshape,
      position: v.pos,
    });
    i += v.len;
  }

  return keys;
}

export function normalizePhrase(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/['’]/g, "'")
    .replace(/-/g, " ")
    .replace(/[^a-zàâäéèêëïîôùûüç'\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MAX_KEYS = 28;

export function textToCues(text: string): TextToCuesResult {
  const warnings: string[] = [];
  const normalized = normalizePhrase(text);
  if (!normalized) {
    return { keys: [], words: [], warnings: ["Écris une phrase."] };
  }

  const words = normalized.split(" ").filter(Boolean);
  const keys: CueToken[] = [];

  for (const w of words) {
    keys.push(...cueWord(w));
  }

  if (keys.length === 0) {
    warnings.push("Impossible d’extraire des clés — essaie d’autres mots.");
  }
  if (keys.length > MAX_KEYS) {
    warnings.push(
      `Phrase longue : seules les ${MAX_KEYS} premières clés seront codées.`,
    );
  }

  return {
    keys: keys.slice(0, MAX_KEYS),
    words,
    warnings,
  };
}

export function textToCuesForPack(
  pack: PackId,
  text: string,
): TextToCuesResult {
  return pack === "en" ? textToCuesEn(text) : textToCues(text);
}
