# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Site statique de révision pour les cours EPITA (14 matières), entièrement en français
(interface, contenu, noms de variables et commentaires). Aucun build, aucune dépendance,
aucun serveur : `index.html` s'ouvre directement dans le navigateur (`Lancer le site.bat`).
La documentation complète du format des données est dans `LISEZMOI.md` et
`data/cours/_modele.js` (référence non chargée par le site) : les tenir à jour quand un
format change.

## Commandes

```
node outils/verifier-exercices.js
```

Seule vérification automatisée. Elle charge les fichiers `data/` dans l'ordre des balises
`<script>` de `index.html` et contrôle que chaque exercice `code` réussit avec sa
`solution` et échoue avec son code de `depart`, que les réponses des QCM désignent des
choix existants, que chaque `tirage` tient dans sa banque et que les `id` sont uniques
par matière. À lancer après toute
modification d'exercice ou des moteurs d'exécution.

Pour tester un seul exercice ou un moteur, utiliser les modules directement sous Node
(ils exportent via `module.exports`) :

```js
const V = require("./assets/js/verif-code.js");   // charge asm-x86.js et mini-c.js
V.verifier(exercice, source)  // → { ok, score, total, erreur, contraintes, tests, etat }
```

## Architecture

**Chargement.** Pas de modules ES : tous les scripts sont des globales chargées en `defer`
par `index.html`, dans cet ordre : `data/cours.js` (`window.COURS`, registre des matières),
puis `data/cours/<slug>.js` (remplissent `CONTENU[slug] = { guides, chapitres }`), puis les
moteurs `assets/js/`, puis `app.js`. Un fichier de données peut compléter une matière déjà
déclarée (ex. `assembleur-exercices.js` affecte `CONTENU["assembleur"].chapitres` après
`assembleur.js`). Ajouter une matière ou un fichier de données = nouvelle balise
`<script>` dans `index.html`.

**Routage** (`app.js`) par le hash : `#/c/<slug>`, `#/c/<slug>/<exoId>`,
`#/c/<slug>/g/<guideId>`. `App._exercice` choisit le moteur selon `exo.type` et lui passe
un `contexte` (`slug`, `surRetour`, `suivant`…). L'en-tête ne contient que « Accueil » et
la recherche ; sur une page d'exercice, `body.dans-exercice` le masque. Les exercices
sont numérotés `chapitre.rang` d'après leur ordre dans les données.

**Moteurs** (un objet global par type, signature `lancer(conteneur, donnees, contexte)`) :
- `guide.js` — `MoteurGuide` : guides et fiches techniques (sections, parties numérotées
  `1.1`, tableaux, `code` / `codes` côte à côte). `texteRiche()` y est défini : seuls
  `` `code` `` et `**gras**` sont interprétés, après échappement HTML.
- `qcm.js`, `jetpunk.js` — QCM et jeu de rapidité. Le champ `tirage` garde N questions
  ou tuiles au hasard dans la banque, à chaque partie. Un jetpunk s'ouvre sur la liste
  des définitions tirées (`_apercu`), sans les réponses ; « Commencer » lance la partie
  et le chrono.
- `code.js` — `MoteurCode` : exercices de programmation (éditeur à coloration maison,
  bouton ▶, résultats). Définit aussi `cartesPrincipe()`, réutilisée par `qcm.js` pour
  afficher `cours`/`exemple` à gauche des questions.

**Exécution du code des exercices** (sans DOM, utilisable sous Node) :
- `asm-x86.js` — `AsmX86` : assembleur + émulateur x86-64 syntaxe AT&T (sous-ensemble du
  cours), mémoire simulée, registres en `BigInt`, messages d'erreur pédagogiques avec
  numéro de ligne.
- `mini-c.js` — `MiniC` : interpréteur d'un sous-ensemble de C (entiers signés/non signés
  avec l'arithmétique x86-64, tableaux, struct avec alignement, `goto`, `printf` ; pas de
  pointeurs ni d'appels de fonctions). Les instructions au niveau global sont exécutées.
- `verif-code.js` — `VerifCode` : applique les contraintes (`imposer`, `interdire`,
  `motifs`, `exclure`, `sections`, `aplati`) puis exécute chaque test (`entrees` →
  `attendu`). Les clés de test sont `%eax`, `x`, `t[2]`, `s+8:q` en assembleur et `x`,
  `t[2]`, `p.x` en C.

Les erreurs levées pour l'utilisateur portent `erreurCode = true` et `ligne` ; les autres
exceptions sont des bogues internes.

**Persistance** : `localStorage` uniquement, lu/écrit dans des `try/catch`
(`Progres` dans `utils.js` pour les scores, `Theme` pour le thème choisi, brouillons
de code dans `code.js`).
`Progres.exporter()` sérialise toute la progression en un code base64 préfixé
`EPITA1-` et `Progres.restaurer(code)` le refusionne (meilleur record gardé) ;
`App._sauvegarde` expose les deux sur l'accueil (Sauvegarder / Restaurer).

## Conventions de contenu (préférences de l'utilisateur)

- Le site sert à **s'entraîner** (QCM, jeux, exercices, guides pas à pas), jamais à
  recopier le cours.
- Une « Fiche technique » (`badge: "Fiche technique"`) ne contient que ce qui s'écrit dans
  le code : phrase d'effet, tableau de syntaxe, exemple commenté, pièges. Pas de théorie.
- Exercices de programmation : principe très court, exemple, objectif ; courts, un
  mécanisme chacun, difficulté croissante ; plusieurs tests d'entrées différentes pour
  empêcher les valeurs codées en dur ; les traductions C ↔ assembleur en fin de parcours.
- Design : coloré, angles carrés (variables `--r-s/m/l/xl`), et **aucun texte méta**
  dans l'interface (pas d'explication du fonctionnement du site). Trois thèmes au
  choix (⚙ en bas à droite) : clair par défaut, sombre, « bon pour les yeux ». Chacun
  ne redéfinit que les jetons de couleur en tête de `style.css` ; n'écrivez pas de
  couleur en dur dans une règle, servez-vous de `var(--teinte)` et `var(--ombrage)`
  dans les `color-mix` (le « blanc » et le « noir » du thème courant).
- Interface au vouvoiement.
- Énumérations : liste à pastilles (tableau imbriqué dans `cours`/`consigne`), jamais
  d'éléments séparés par « · » au milieu d'une phrase.
