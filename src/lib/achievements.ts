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

const SYLLABLE_RE =
  /^(pa|da|mi|tu|ma|la|li|ni|ra|ri|si|sa|ba|ou|va|cha|chi|ya|an|on)$/;

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
  const syllableKeys = countMatching(completed, SYLLABLE_RE);
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
      title: "Maître des formes",
      description: "Les 8 configurations de doigts",
      unlocked: hasAll(completed, SHAPE_IDS),
    },
    {
      id: "positions-all",
      title: "Cartographe",
      description: "Les 5 zones du visage",
      unlocked: hasAll(completed, POS_IDS),
    },
    {
      id: "syllables-5",
      title: "Syllabeur",
      description: "Valider 5 syllabes",
      unlocked: syllableKeys >= 5,
    },
    {
      id: "syllables-all",
      title: "Clé complète",
      description: "Presque toutes les syllabes (≥ 18)",
      unlocked: syllableKeys >= 18,
    },
    {
      id: "words-5",
      title: pack === "ch" ? "Vocab’helvète" : "Vocabul’air",
      description: "Au moins 5 clés de mots",
      unlocked: wordKeys >= 5,
    },
    {
      id: "words-12",
      title: pack === "ch" ? "Romand" : "Lexique solide",
      description: "Au moins 12 clés de mots",
      unlocked: wordKeys >= 12,
    },
    {
      id: "phrases-1",
      title: "Première phrase",
      description: "Valider une clé de phrase",
      unlocked: phraseKeys >= 1,
    },
    {
      id: "phrases-pro",
      title: pack === "ch" ? "Causeur du lac" : "Conteur",
      description: "Enchaîner 8 clés de phrases",
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

  if (pack === "ch") {
    shared.push(
      {
        id: "ch-natel",
        title: "Natel en poche",
        description: "Coder le mot « natel »",
        unlocked: completed.some((id) => id.startsWith("natel")),
      },
      {
        id: "ch-huitante",
        title: "Huitante",
        description: "Valider « huitante » ou la phrase",
        unlocked: completed.some(
          (id) => id.startsWith("huitante") || id.startsWith("huitante-francs"),
        ),
      },
      {
        id: "ch-fondue",
        title: "Fondue party",
        description: "Coder fondue (mot ou phrase)",
        unlocked: completed.some(
          (id) => id.startsWith("fondue") || id.startsWith("fondue-ce-soir"),
        ),
      },
      {
        id: "ch-lac",
        title: "Bord du lac",
        description: "Valider lac / « On va au lac »",
        unlocked: completed.some(
          (id) => id === "lac" || id.startsWith("au-lac"),
        ),
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
