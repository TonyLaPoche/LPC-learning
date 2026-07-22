# CléLPC — Doc produit

## Vision

Apprendre le LPC (Cued Speech adapté au français) de façon **ludique**, **locale** et **accessible**, avec un coach caméra qui valide formes de main et positions autour du visage.

Publics cibles :

- Parents / entourage d’enfants sourds ou malentendants
- Codeurs en formation
- Curieux / étudiants en sciences du langage
- Plus tard : packs supplémentaires, autres langues Cued Speech

## LPC en 30 secondes

Le LPC n’est **pas** la LSF. C’est un **code manuel** qui complète la lecture labiale :

- **8 configurations** de doigts → groupes de consonnes
- **5 positions** autour du visage → groupes de voyelles
- Une **clé** = forme × position (souvent 1 syllabe CV)

Exemple : *pa / ba / ma* se ressemblent sur les lèvres ; le LPC les différencie par la forme de main.

> Note MVP : le référentiel gestuel est **pédagogique** (inspiré du code ALPC). Ce n’est pas un substitut à une formation certifiante.

## Références

| Source | URL | Usage |
|--------|-----|--------|
| ALPC | https://alpc.asso.fr/ | Référence associative, clés officielles |
| Coquelicot | https://www.coquelicot.asso.fr/lpc/lpcmain.php | Exercices / vidéos |
| TextCueS | https://auto-cuedspeech.org/textcues.html | Texte → sons → clés |
| Auto-CS / SPPAS | https://autocs.sourceforge.io/ | Pipeline open source |
| Fondation pour l’audition | https://www.fondationpourlaudition.org/ | Vulgarisation |
| Surdités Info Service | https://surdites-info-service.fr/ | Schéma 5×8 |

**LPC Suisse / Belgique francophone** : même code gestuel que la France ; pas besoin d’un second alphabet.

**English Cued Speech** : autre table (8 formes × **4** positions, groupements consonnes/voyelles différents du LPC FR).

## Référentiel MVP (`fr-FR` / Suisse) — LfPC

Source de vérité : affiche « Clés du code LPC » (FR/CH) + [Montre le son](https://montre-le-son.ch/notions-reperes-code/).

### Positions (voyelles)

| Id | Zone | Voyelles |
|----|------|----------|
| `cheek` | Pommette | ɛ̃ (in), ø (eu) |
| `side` | Côté | a, o, œ (e) — aussi consonne seule / e muet |
| `mouth` | Bouche | i, ɔ̃ (on), ɑ̃ (an) |
| `chin` | Menton | ɛ (è), u (ou), ɔ (o ouvert) |
| `throat` | Gorge | y (u), e (é), œ̃ (un) |

### Configurations (consonnes)

| Id | Forme | Consonnes |
|----|-------|-----------|
| `c5` | Cinq doigts (pouce écarté) | m, t, f, ∅ |
| `c1` | Index | p, d, ʒ |
| `c4` | Quatre doigts | b, n, ɥ |
| `c6` | Forme L (pouce + index) | l, ʃ, ɲ, w |
| `c2` | Index + majeur jointifs | k, v, z |
| `c3` | Trois doigts | s, ʁ |
| `c7` | Pouce + index + majeur jointifs | ɡ |
| `c8` | Forme V | j, ŋ |

> Pas de « rond » pouce+index (confusion avec le Cued Speech américain).

Exemple de contrôle : **bonjour** = 4+bouche · 1+menton · 3+côté (`bon-jou-r`).


## Parcours pédagogique MVP

1. **Formes** — tenir chaque config ~1,2 s
2. **Positions** — placer la main dans chaque zone
3. **Syllabes** — combiner (ex. *pa, mi, la*)
4. **Mots / Phrases** — enchaîner des clés (pack FR ou EN)
5. **Répétitions** — 3× guidé, puis 1 rappel sans guide (bonus XP si réussi)

**Packs** : Français (LPC) / English (Cued Speech) — **tables différentes**, achievements séparés.

Modes plus tard : décodage vidéo (flux), miroir coach, dictée visuelle.

**Phrase custom FR** : pipeline `mot → phonèmes (lexique) → clés LPC`, fallback règles orthographiques si mot absent du dico.

## Gamification

- XP par réussite maintenue (hold)
- Combo si enchaînement sans erreur
- Leçons « complétées » en localStorage
- Streak quotidien (v1.5)
- Badges Formes / Positions / Premiers mots

## Layout & financement

Plus d’encarts publicitaires latéraux dans le MVP. L’app fonctionne **au don** (Buy me a Coffee — lien à brancher). Une page Soutien explique qu’un petit don aide à éviter la pub plus tard.


## Architecture technique

```
Caméra → MediaPipe Hand + Face
       → handshape classifier (doigts étendus)
       → cue position (main vs ancres visage)
       → match vs cible leçon
       → HUD + XP local
```

Réutiliser les patterns CamBateSoloTraining (`useCamera`, perf mobile, cache modèles PWA) **sans** le domaine score solo adulte.

## Roadmap

| Phase | Contenu |
|-------|---------|
| **MVP** (ici) | Shell PWA, cam, formes→phrases, mode libre, packs FR/EN, répétitions |
| **v1.5** | Streaks, TextCueS-like offline, plus de contenus |
| **v2** | Décodage vidéo (flux), i18n UI, English CS optionnel |
| **v3** | Miroir coach, multi-joueurs famille |

## Risques & garde-fous

- Précision webcam ≠ juge parfait → feedback « proche / OK », pas verdict clinique
- Droits schémas / vidéos ALPC → contenus originaux + liens
- Accessibilité : contrastes, textes clairs, pas dépendre uniquement de la couleur
