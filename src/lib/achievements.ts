/** Achievements dérivés de la progression locale — par pack. */

import type { PackId } from "@/data/packs";
import { getPackContent } from "@/data/packs";
import type { ProgressState } from "@/lib/progress";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

function countPrefix(completed: string[], prefix: string): number {
  return completed.filter((id) => id.startsWith(prefix)).length;
}

function hasAll(completed: string[], ids: string[]): boolean {
  return ids.every((id) => completed.includes(id));
}

function countMatching(completed: string[], re: RegExp): number {
  return completed.filter((id) => re.test(id)).length;
}

const SHAPE_IDS = [
  "shape-c1",
  "shape-c2",
  "shape-c3",
  "shape-c4",
  "shape-c5",
  "shape-c6",
  "shape-c7",
  "shape-c8",
];

const POS_IDS = [
  "pos-side",
  "pos-chin",
  "pos-mouth",
  "pos-cheek",
  "pos-throat",
];

const SYLLABLE_RE_FR =
  /^(pa|da|mi|tu|ma|la|li|ni|ra|ri|si|sa|ba|ou|va|cha|chi|ya|an|on)$/;

const SYLLABLE_RE_EN =
  /^(me|see|to|no|you|go|she|the|hi|bye|yes|be|we|tea|do|so|my|too)$/;

function syllableRegex(pack: PackId): RegExp {
  return pack === "en" ? SYLLABLE_RE_EN : SYLLABLE_RE_FR;
}

function wordKeyRegex(pack: PackId): RegExp {
  const ids = getPackContent(pack).words.map((w) => w.id).join("|");
  return new RegExp(`^(${ids})(-\\d+)?$`);
}

function phraseKeyRegex(pack: PackId): RegExp {
  const ids = getPackContent(pack).phrases.map((p) => p.id).join("|");
  return new RegExp(`^(${ids})-\\d+$`);
}

function packAchievements(
  pack: PackId,
  progress: ProgressState,
  freeVisited: boolean,
  customVisited: boolean,
): Achievement[] {
  const { xp, completed } = progress;
  const syllableKeys = countMatching(completed, syllableRegex(pack));
  const wordKeys = countMatching(completed, wordKeyRegex(pack));
  const phraseKeys = countMatching(completed, phraseKeyRegex(pack));
  const recallBonus = countPrefix(completed, "reps-recall-");
  const repsDone = countPrefix(completed, "reps-");
  const customKeys = completed.filter(
    (id) => id.startsWith("custom-") && id !== "custom-compose",
  ).length;

  const shared: Achievement[] = [
    {
      id: "first-step",
      title: "Premier pas",
      description: "Valider une première clé",
      unlocked: completed.length >= 1,
    },
    {
      id: "shapes-all",
      title: pack === "en" ? "Handshape master" : "Maître des formes",
      description:
        pack === "en"
          ? "All 8 English CS handshapes"
          : "Les 8 configurations de doigts",
      unlocked: hasAll(completed, SHAPE_IDS),
    },
    {
      id: "positions-all",
      title: pack === "en" ? "Placement pro" : "Cartographe",
      description:
        pack === "en"
          ? "Mouth, chin, throat & side"
          : "Les 5 zones du visage",
      unlocked:
        pack === "en"
          ? hasAll(completed, [
              "pos-side",
              "pos-chin",
              "pos-mouth",
              "pos-throat",
            ])
          : hasAll(completed, POS_IDS),
    },
    {
      id: "syllables-5",
      title: pack === "en" ? "Syllable starter" : "Syllabeur",
      description:
        pack === "en" ? "Cue 5 syllables" : "Valider 5 syllabes",
      unlocked: syllableKeys >= 5,
    },
    {
      id: "syllables-all",
      title: pack === "en" ? "Cue complete" : "Clé complète",
      description:
        pack === "en"
          ? "Most syllables (≥ 14)"
          : "Presque toutes les syllabes (≥ 18)",
      unlocked: syllableKeys >= (pack === "en" ? 14 : 18),
    },
    {
      id: "words-5",
      title: pack === "en" ? "Wordsmith" : "Vocabul’air",
      description:
        pack === "en" ? "At least 5 word cues" : "Au moins 5 clés de mots",
      unlocked: wordKeys >= 5,
    },
    {
      id: "words-12",
      title: pack === "en" ? "Lexicon" : "Lexique solide",
      description:
        pack === "en" ? "At least 12 word cues" : "Au moins 12 clés de mots",
      unlocked: wordKeys >= 12,
    },
    {
      id: "phrases-1",
      title: pack === "en" ? "First phrase" : "Première phrase",
      description:
        pack === "en"
          ? "Validate a phrase cue"
          : "Valider une clé de phrase",
      unlocked: phraseKeys >= 1,
    },
    {
      id: "phrases-pro",
      title: pack === "en" ? "Storyteller" : "Conteur",
      description:
        pack === "en"
          ? "Chain 8 phrase cues"
          : "Enchaîner 8 clés de phrases",
      unlocked: phraseKeys >= 8,
    },
    {
      id: "reps-start",
      title: "Répétiteur",
      description: "Lancer le mode répétitions",
      unlocked: repsDone >= 1,
    },
    {
      id: "reps-bonus-3",
      title: "Mémoire vive",
      description: "3 rappels sans guide réussis",
      unlocked: recallBonus >= 3,
    },
    {
      id: "reps-bonus-8",
      title: "Ancrage",
      description: "8 rappels sans guide réussis",
      unlocked: recallBonus >= 8,
    },
    {
      id: "free-explorer",
      title: "Explorateur",
      description: "Ouvrir le mode libre",
      unlocked: freeVisited,
    },
    {
      id: "custom-writer",
      title: "Auteur",
      description: "Composer une phrase custom",
      unlocked: customVisited || completed.includes("custom-compose"),
    },
    {
      id: "custom-coder",
      title: "Codeur libre",
      description: "Valider 3 clés d’une phrase custom",
      unlocked: customKeys >= 3,
    },
    {
      id: "xp-100",
      title: "Centurion",
      description: "Atteindre 100 XP",
      unlocked: xp >= 100,
    },
    {
      id: "xp-500",
      title: "Semi-pro",
      description: "Atteindre 500 XP",
      unlocked: xp >= 500,
    },
    {
      id: "xp-1000",
      title: "Légende LPC",
      description: "Atteindre 1000 XP",
      unlocked: xp >= 1000,
    },
    {
      id: "dedicated",
      title: "Assidu",
      description: "20 leçons validées",
      unlocked: completed.length >= 20,
    },
    {
      id: "marathon",
      title: "Marathon",
      description: "40 leçons validées",
      unlocked: completed.length >= 40,
    },
    {
      id: "well-rounded",
      title: "Polyvalent",
      description: "Formes + positions + une syllabe",
      unlocked:
        countPrefix(completed, "shape-") >= 4 &&
        countPrefix(completed, "pos-") >= 3 &&
        syllableKeys >= 1,
    },
  ];

  if (pack === "en") {
    shared.push(
      {
        id: "en-hello",
        title: "Hello!",
        description: "Cue the word « hello »",
        unlocked: completed.some((id) => id.startsWith("hello")),
      },
      {
        id: "en-thank-you",
        title: "Polite cue",
        description: "Cue « Thank you »",
        unlocked: completed.some((id) => id.startsWith("thank-you")),
      },
      {
        id: "en-love",
        title: "Love cue",
        description: "Cue « I love you »",
        unlocked: completed.some((id) => id.startsWith("i-love-you")),
      },
      {
        id: "en-good-night",
        title: "Night owl",
        description: "Cue « Good night »",
        unlocked: completed.some((id) => id.startsWith("good-night")),
      },
    );
  } else {
    shared.push(
      {
        id: "fr-maison",
        title: "Chez soi",
        description: "Coder le mot « maison »",
        unlocked: completed.some((id) => id.startsWith("maison")),
      },
      {
        id: "fr-comment",
        title: "Politesse",
        description: "Phrase « Comment ça va ? »",
        unlocked: completed.some((id) => id.startsWith("comment-ca-va")),
      },
      {
        id: "fr-faim",
        title: "Appétit",
        description: "Coder « J’ai faim »",
        unlocked: completed.some((id) => id.startsWith("j-ai-faim")),
      },
    );
  }

  return shared;
}

export function computeAchievements(
  progress: ProgressState,
  freeVisited: boolean,
  pack: PackId = "fr",
  customVisited = false,
): Achievement[] {
  return packAchievements(pack, progress, freeVisited, customVisited);
}

export function achievementStats(achievements: Achievement[]) {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  return { unlocked, total: achievements.length };
}
