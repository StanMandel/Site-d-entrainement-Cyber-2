# Entraînements EPITA

Site d'exercices interactifs, un onglet par matière. Aucun serveur ni installation :
double-cliquez sur **`Lancer le site.bat`** (ou ouvrez `index.html` dans un navigateur).

Le `.bat` doit rester dans le dossier du site, à côté de `index.html`. Pour y accéder
depuis le Bureau, créez un raccourci (clic droit → *Envoyer vers* → *Bureau*) plutôt
que de déplacer le fichier.

## Organisation des fichiers

```
Lancer le site.bat          ouvre le site dans le navigateur par défaut
index.html                  page unique (onglets + routage)
assets/css/style.css        thème clair et coloré
assets/js/utils.js          outils communs (DOM, texte, progression)
assets/js/qcm.js            moteur de QCM
assets/js/jetpunk.js        moteur du jeu de rapidité
assets/js/guide.js          moteur des guides
assets/js/asm-x86.js        émulateur x86-64 (assemble et exécute l'assembleur AT&T)
assets/js/mini-c.js         interpréteur d'un sous-ensemble de C
assets/js/verif-code.js     exécution des tests des exercices de programmation
assets/js/code.js           page des exercices de programmation (éditeur, résultats)
assets/js/terminal.js       moteur des exercices « terminal » (commandes à taper)
assets/js/reseau-cisco.js   simulateur Cisco (topologie, IOS, ping) + moteur « reseau »
assets/js/probleme.js       moteur des mini-cours à réponse saisie
assets/js/app.js            onglets, routage, rendu des pages
data/cours.js               liste des 14 matières (nom, couleur, emoji)
data/cours/<slug>.js        LE CONTENU : guides, chapitres et exercices
data/cours/_modele.js       référence de format (non chargé par le site)
outils/verifier-exercices.js  contrôle des exercices de programmation (Node)
outils/installer-outils.cmd   installateur polyglot Windows+Linux des outils d'attaque
```

Un guide peut proposer un **fichier téléchargeable** (champ `telechargements` d'une
section) : le contenu est embarqué dans `index.html` via un `<script type="text/plain">`
pour fonctionner hors ligne (`file://`), et le bouton **Télécharger** génère le fichier.
C'est ainsi qu'est distribué `outils/installer-outils.cmd` (un seul fichier, lu comme
du `batch` sous Windows et du `bash` sous Linux, qui installe les outils sans doublon).

**Tout le contenu se met dans `data/cours/`.** Le reste n'a pas besoin d'être touché.

Chaque matière suit la même structure :

```js
CONTENU["reseaux-avances"] = {
  guides:    [ /* fiches explicatives */ ],
  chapitres: [ /* rubriques contenant les exercices */ ]
};
```

## Les guides

Un guide est une fiche affichée en haut de la page d'une matière : principes de base
ou marche à suivre numérotée. Les sections `type: "notion"` sont des encadrés non
numérotés ; toutes les autres sont numérotées comme des étapes.

```js
{
  id: "creer-conteneur",              // unique dans la matière
  titre: "Créer et lancer son premier conteneur",
  resume: "Une phrase de présentation.",
  duree: "25 min",
  niveau: "Débutant",
  prealables: ["Docker installé"],
  sections: [
    {
      type: "notion",                 // omettre pour une étape numérotée
      titre: "Image, conteneur, moteur",
      texte: "Texte avec du `code` et du **gras**.",
      points: ["Premier point", "Deuxième point"],
      tableau: {
        entetes: ["Commande", "Rôle"],
        lignes: [["`docker ps`", "Liste les conteneurs actifs"]]
      },
      code: "docker run hello-world",   // bloc copiable
      legende: "Terminal",              // titre du bloc de code
      sortie: "Hello from Docker!",     // sortie attendue
      remarque: "Information utile.",
      attention: "Piège à éviter."
    }
  ]
}
```

Champs supplémentaires :

- `schema: "..."` — dessin en police fixe (carte mémoire, disposition de bits), sans
  bouton Copier.
- `remarque` et `attention` acceptent une chaîne ou un tableau de chaînes.
- `badge: "Fiche technique"` au niveau du guide remplace l'étiquette « Guide ».

**Aide-mémoire en parties.** Insérez des sections `{ type: "partie", titre, texte }`.
Les sections suivantes sont alors numérotées `1.1`, `1.2`, `2.1`… et un sommaire
cliquable apparaît en haut du guide ; la carte du guide annonce « N parties ».

Dans `texte`, `points`, `remarque`, `attention` et les cellules de tableau :
`` `ainsi` `` donne du code en police fixe et `**ainsi**` du gras. Le contenu est
échappé avant affichage : aucun HTML des données n'est exécuté.

## Les chapitres et les exercices

Les exercices sont rangés par chapitre : chaque chapitre est une rubrique dépliable.

```js
{
  id: "ch1",
  titre: "Chapitre 1 — Modèle OSI",
  description: "Les sept couches et leur rôle.",
  exercices: [ /* voir ci-dessous */ ]
}
```

### 1. QCM — `type: "qcm"`

Une question à la fois, correction immédiate, explication, puis récapitulatif final.
Prévoyez 10 à 20 questions, ou une banque plus large avec `tirage` : chaque partie
tire alors N questions au hasard. Les champs facultatifs `cours` et `exemple` (même format
que pour les exercices de programmation) affichent le principe et un exemple à gauche
des questions.

```js
{
  type: "qcm",
  id: "ch1-qcm",                    // unique dans la matière
  titre: "QCM — Modèle OSI",
  description: "15 questions sur les couches.",
  melanger: true,                   // mélange les questions (défaut : true)
  melangerChoix: false,             // mélange aussi les propositions (défaut : false)
  tirage: 15,                       // facultatif : N questions tirées au hasard par partie
  questions: [
    {
      enonce: "À quelle couche OSI appartient IP ?",
      code: "ip route add 10.0.0.0/8 via 192.168.1.1",   // facultatif
      choix: ["Liaison", "Réseau", "Transport", "Session"],
      reponse: 1,                   // index de la bonne réponse
      explication: "IP est le protocole de la couche 3."  // facultatif
    },
    {
      enonce: "Quels protocoles sont de couche 4 ?",
      choix: ["TCP", "ARP", "UDP", "HTTP"],
      reponse: [0, 2]               // tableau = réponses multiples
    }
  ]
}
```

### 2. Jeu de rapidité — `type: "jetpunk"`

La partie s'ouvre sur la liste des définitions tirées, à lire sans chrono ;
« Commencer » affiche la barre de saisie et les tuiles. Dès que la bonne réponse est
tapée, la tuile passe au vert ; quand toutes sont vertes, la partie est gagnée.
Idéal pour le vocabulaire anglais, les définitions ou la reconnaissance de schémas.
Avec `masquerIndice: true`, la liste préalable est sautée : il n'y a rien à lire.

```js
{
  type: "jetpunk",
  id: "ch1-voc",
  titre: "Vocabulaire — Session 1",
  consigne: "Trouvez le mot anglais correspondant à chaque définition.",
  temps: 300,                       // chrono en secondes (0 ou absent = sans chrono)
  colonnes: 3,                      // largeur de la grille (défaut : automatique)
  masquerIndice: false,             // true = tuiles cachées, à retrouver de mémoire
  melanger: false,                  // mélange l'ordre des tuiles (défaut : false)
  tirage: 12,                       // facultatif : N tuiles tirées au hasard par partie
  items: [
    {
      indice: "To measure or estimate",   // texte affiché sur la tuile
      reponse: "Gauge",                   // réponse attendue
      alt: ["measure", "estimate"],       // autres réponses acceptées (facultatif)
      note: "Se prononce /ɡeɪdʒ/."        // affiché après révélation (facultatif)
    }
  ]
}
```

**Comparaison des réponses :** la casse, les accents, les espaces et la ponctuation
sont ignorés. `Ré-seau`, `RESEAU` et `réseau` sont donc équivalents. Une tuile est
validée dès que la frappe correspond : aucune réponse ne doit être le début d'une
autre (`Local` validerait sa tuile au milieu de la saisie de `LocalService`).

### 3. Programmation — `type: "code"`

Page en deux colonnes : à gauche le principe, un exemple et l'objectif ; à droite
un éditeur avec le bouton **▶ Exécuter** (ou Ctrl + Entrée). Le code est exécuté
directement dans le navigateur sur chaque test, puis les valeurs obtenues sont
comparées aux valeurs attendues. Les erreurs d'assemblage ou de compilation sont
signalées avec leur numéro de ligne ; une solution est proposée après deux échecs.
Le brouillon est gardé dans le navigateur.

```js
{
  type: "code",
  langage: "asm",                     // "asm" (x86-64, syntaxe AT&T) ou "c"
  id: "asm-idiv",
  titre: "Quotient et reste",
  description: "cltd puis idivl.",
  cours: "Principe en une ou deux phrases.",
  exemple: { legende: "Titre du bloc", code: `…` },
  consigne: "Calculer `q = a / b` et `r = a % b`.",
  aTraduire: { legende: "C", code: `…` },     // facultatif
  depart: `…code de départ…`,
  solution: `…`,
  tests: [
    { entrees: { a: 17, b: 5 }, attendu: { q: 3, r: 2 } },
    { entrees: { a: -17, b: 5 }, attendu: { q: -3, r: -2 } }
  ],
  imposer: ["sal|shl"],               // facultatif : instructions obligatoires
  interdire: ["imul", "mul"],         // facultatif : instructions interdites
  aplati: true                        // C seulement : if (…) goto, goto, étiquettes
}
```

- **Énumérations :** dans `cours` et `consigne`, chaque chaîne est un paragraphe et un
  tableau imbriqué devient une liste à pastilles :
  `cours: ["Introduction :", ["premier point", "deuxième point"], "Conclusion."]`.
  Ne pas enchaîner les éléments avec « · » au milieu d'une phrase.
- **Numérotation :** les exercices sont numérotés automatiquement « chapitre.rang »
  (1.1, 1.2…) dans l'ordre du fichier, de gauche à droite puis de haut en bas : ranger
  les exercices d'un chapitre par difficulté croissante.
- **Clés des tests en assembleur :** `"%eax"`, `"x"` (taille donnée par sa
  directive), `"t[2]"`, `"s+4"`, avec un suffixe de taille facultatif :
  `"s+8:q"`, `"c:b"`.
- **Clés des tests en C :** `"x"`, `"t[2]"`, `"p.x"`, `"pts[1].y"`.
- **Valeurs :** nombre, chaîne de chiffres pour les grands entiers (`"5000000000"`),
  caractère (`"A"`), tableau (`[1, 2, 3]`) ou texte (`"bonjour"`).
- Autres champs : `motifs` / `exclure` (expressions régulières imposées ou
  interdites), `sections` (section attendue d'une étiquette, par exemple
  `{ msg: "rodata" }`), `nonSigne` (clés affichées en non signé). Détails dans
  `data/cours/_modele.js`.

### 4. Terminal — `type: "terminal"`

Page en deux colonnes : à gauche le principe, un scénario et l'objectif courant ;
à droite un **terminal simulé**. Pour chaque objectif, l'utilisateur tape une
commande. Elle est acceptée quand elle vérifie **tous** les `motifs` (expressions
régulières, insensibles à la casse) et **aucun** motif `interdire` ; la `sortie`
simulée s'affiche alors et l'objectif suivant démarre. Le terminal (accueil,
messages, sorties) est **en anglais**, comme un vrai shell ; commandes intégrées :
`help`, `solution`, `objective`, `clear`. Le score correspond aux objectifs réussis
sans avoir demandé la solution.

```js
{
  type: "terminal",
  id: "ch2-terminal",
  titre: "Terminal — …",
  terminal: "bash — attaquant",       // titre de la fenêtre (facultatif)
  invite: "kali@kali:~$",             // invite (facultatif)
  cours: "…", exemple: { … },         // colonne de gauche, comme "code"
  intro: ["Scénario…"],               // paragraphes / listes à pastilles
  objectifs: [
    {
      enonce: "Faites… avec `outil`.",
      indice: "outil -x <cible>",     // facultatif
      motifs: ["^outil\\b", "10\\.0\\.0\\.5"],  // tous obligatoires
      interdire: ["--danger"],        // facultatif
      solution: "outil -x 10.0.0.5",  // commande modèle (vérifiée)
      sortie: "ligne 1\nligne 2"      // sortie simulée
    }
  ]
}
```

### 5. Mini-cours à réponse saisie — `type: "probleme"`

Un exemple entièrement résolu, puis un problème similaire à résoudre. Des **onglets**
en haut de la page (« Exemple » / « Exercice ») basculent entre les deux. Sous
l'énoncé à résoudre, une **barre de saisie** avec un bouton **« Caractères
spéciaux »** qui déplie un clavier de symboles cliquables (`Θ`, `Ω`, `≤`, `²`, `⌊ ⌋`,
`⁄`…) à insérer au curseur — pratique pour les signes absents du clavier. La réponse
est validée dès qu'elle correspond (à la notation près). Deux usages :

- **mini-cours** : `exemple = { enonce, formule, reponse }`, puis un `exercice` ;
- **comptage d'opérations** : un champ `methode` reste affiché au-dessus des onglets,
  et `exemple` / `exercice` portent du `code` C.

Le champ `methode` sert de **carte de cours** : c'est là que se définit le vocabulaire
introduit par l'exercice (majorer, terme dominant, pire cas…) avant de s'en servir dans
la démonstration. Les intertitres `{ titre: "…" }` y séparent le vocabulaire de la
méthode proprement dite, et `{ entetes, lignes }` y insère un tableau récapitulatif.

```js
{
  type: "probleme",
  id: "ch1-boucle",
  titre: "Boucle simple",
  description: "Compter les opérations d'une boucle for.",   // sous-titre de la carte
  methode: ["Rappel toujours visible.", ["puce 1", "puce 2"]],  // facultatif (comptage)
  methodeTitre: "Méthode",                                   // facultatif
  exemple: {                                 // le problème résolu (onglet « Exemple »)
    langage: "c",                            // colore le code ("c" ou "asm")
    enonce: "Énoncé du problème.",           // → carte « Problème »
    code: "for (int i = 0; i < n; i++) {…}", // bloc de code facultatif
    legende: "…",                            // titre du bloc de code (facultatif)
    formule: ["Étape 1…", ["puce", "puce"]], // → carte « Formule » (chaîne ou blocsTexte)
    formuleTitre: "Démarche",                // titre de cette carte (défaut : « Formule »)
    reponse: "La réponse détaillée."         // → carte « Réponse » (en vert)
  },
  exercice: {                                // à résoudre (onglet « Exercice »)
    langage: "c",
    enonce: "Question posée.",
    code: "…",                               // bloc de code facultatif
    reponse: "3n + 3",                       // réponse attendue (obligatoire)
    accepte: ["3n+3", "3 + 3n"],             // autres écritures acceptées (facultatif)
    indice: "Affiché après une tentative fausse.",           // facultatif
    solution: ["Explication montrée une fois résolu.", ["…"]]  // facultatif
  }
}
```

`exercice` peut être **un tableau** de plusieurs problèmes : le score final est le
nombre de bonnes réponses. **Comparaison :** la casse, les espaces et la notation
sont unifiés (`Θ`↔`theta`, `²`↔`^2`, `·`/`×`↔`*`, `⁄`↔`/`) et les `*`, `(`, `)` sont
ignorés — `O(n log n)`, `O(nlogn)` et `O(n·log(n))` sont donc équivalents. Pour les
autres variantes (ordre des termes, `n2` sans exposant…), lister les formes dans
`accepte`.

### 6. Configuration réseau Cisco — `type: "reseau"`

La page montre d'abord l'**énoncé** (principe, scénario, objectifs) avec un bouton
**« 🖧 Configurer le réseau → »**. Celui-ci ouvre la scène **en plein écran**, par-dessus
toute la page : il ne reste qu'une **petite flèche `←` en haut à gauche** (ou la touche
`Échap`) pour revenir à l'énoncé. Faire l'aller-retour ne reconstruit rien — appareils,
câbles, positions et consoles **restent tels quels**.

La scène est un plan de travail façon **Packet Tracer** : des appareils (**routeurs**,
**switches**, **PC**) posés sur une grille. L'utilisateur peut les **déplacer**
librement (glisser-déposer, souris ou doigt), en **ajouter** (palette), les **relier**
(bouton « 🔌 Relier » : on clique l'appareil, puis **le port** à utiliser — choisi tout
seul quand il n'y en a qu'un), puis ouvrir la **console** d'un appareil : elle s'ouvre
en **fenêtre posée sur la scène**, et s'y tapent de vraies commandes **Cisco IOS**.

Les **câbles sont tracés** entre les appareils avec le **nom des ports** à chaque
extrémité : **verts** quand les deux ports sont allumés, **rouges pointillés** sinon —
on voit donc d'un coup d'œil qu'il manque un `no shutdown`. Un **clic sur un câble le
retire**. Le bouton **« ✓ Vérifier »** simule le réseau (pings de bout en bout) : si
tous les tests passent, l'exercice est validé.
Score = tests réussis / nombre de tests. Chaque exercice introduit un concept
(adressage, `no shutdown`, route statique, route par défaut, VLAN, trunk, inter-VLAN).

Sous-ensemble IOS reconnu (abréviations admises) : `enable`, `configure terminal`,
`hostname`, `interface g0/0` (et sous-interface `g0/0.10`), `ip address`,
`no shutdown` / `shutdown`, `encapsulation dot1q N`, `ip route`, `vlan N` / `name`,
`switchport mode access|trunk`, `switchport access vlan N`,
`show ip interface brief`, `show ip route`, `show vlan brief`, `ping`. Le PC est un
poste simplifié : `ip <adresse> <masque> [passerelle]`, `show ip`, `ping`.

```js
{
  type: "reseau",
  id: "res-static",
  titre: "Router entre deux réseaux",
  description: "Deux LAN reliés par un lien WAN : routes statiques.",
  cours: "…", exemple: { … },          // colonne de gauche (comme "code")
  intro: ["Scénario…"],                // blocsTexte
  consigne: "…",                       // chaîne ou blocsTexte
  objectifs: ["`R1 g0/0` = 192.168.1.1/24", …],  // liste à pastilles
  topologie: {                         // topologie de départ (souvent déjà câblée)
    appareils: [                       // x, y = position sur le plan en % (facultatif)
      { nom: "R1",  type: "routeur", x: 30, y: 42 },
      { nom: "PC1", type: "pc",      x: 70, y: 42 }
    ],
    liens: [ { de: "R1", deIf: "g0/0", vers: "PC1", versIf: "eth0" } ]
  },
  palette: ["routeur","switch","pc"], // ajoutables (défaut : les trois)
  verrouTopologie: false,              // true = ni ajout ni câble ni suppression
  preconfig: { R2: ["enable","conf t", …] },  // déjà configuré au départ
  tests: [                             // pings = la validation
    { de: "PC1", vers: "PC2", attendu: true,  message: "PC1 joint PC2" },
    { de: "PC1", vers: "PC3", attendu: false, message: "isolation VLAN" }
  ],                                   // vers : nom d'appareil (→ son IP) ou IP littérale
  solution: {                          // commandes par appareil (réussit tous les tests)
    R1:  ["enable","configure terminal","interface g0/0","ip address 192.168.1.1 255.255.255.0","no shutdown"],
    PC1: ["ip 192.168.1.10 255.255.255.0 192.168.1.1"]
  },
  solutionTopologie: { appareils:[…], liens:[…] } // si l'utilisateur doit AUSSI
                                       // construire la topologie (appliquée au contrôle)
}
```

Le simulateur (`assets/js/reseau-cisco.js`) est **pur** (sans DOM) et réutilisé par le
vérificateur : avec la solution (et `solutionTopologie`), tous les tests doivent
passer ; sans elle, au moins un doit échouer, ce qui garantit que l'exercice n'est pas
déjà résolu au départ.

Après tout ajout ou modification, lancer depuis le dossier du site :

```
node outils/verifier-exercices.js
```

Le script vérifie que chaque solution de programmation réussit tous ses tests, que
chaque code de départ échoue, que la solution de chaque objectif « terminal » valide
ses propres motifs, que chaque exercice « probleme » a une réponse attendue cohérente,
que chaque exercice « reseau » est validé par sa solution (et **non** validé sans
elle), que les réponses des QCM désignent des choix existants et que chaque `tirage`
ne dépasse pas la taille de sa banque.

## Points d'attention

- Le champ `id` d'un guide ou d'un exercice doit être **unique dans la matière** :
  il sert de clé pour la sauvegarde des scores et pour l'adresse de la page
  (`#/c/<matiere>/<id-exercice>` et `#/c/<matiere>/g/<id-guide>`). Le renommer remet
  le record à zéro.
- Les scores sont enregistrés dans le navigateur (`localStorage`), sur cet appareil
  uniquement. Le bouton **Réinitialiser** sur la page d'une matière les efface.
- Pour retrouver sa progression ailleurs : sur l'accueil, **Sauvegarder** produit un
  code `EPITA1-…` (bouton Copier ou fichier `.txt`) et **Restaurer** le relit, en le
  collant ou en choisissant le fichier. La restauration **fusionne** avec ce qui est
  déjà sur l'appareil : pour chaque exercice, le meilleur record est conservé, donc
  rien n'est perdu et le code peut être restauré plusieurs fois.
- Le bouton ⚙ en bas à droite de l'écran ouvre les paramètres : le thème
  (**Clair**, **Sombre**, **Bon pour les yeux**) est retenu dans le `localStorage`
  sous la clé `epita-theme` et appliqué avant le premier affichage. Chaque thème ne
  redéfinit que les jetons de couleur en haut de `assets/css/style.css` : une
  couleur écrite en dur dans une règle ne suivrait pas le thème. Pour un fond teinté
  ou un texte assombri, utiliser `color-mix(… var(--teinte))` et
  `color-mix(… var(--ombrage))`, qui valent « blanc » et « noir » en thème clair.
- `data/cours/_modele.js` n'est pas chargé par le site : c'est une simple référence
  de format à copier.

## Ajouter une nouvelle matière

1. Ajouter une entrée dans `data/cours.js` (`slug`, `nom`, `court`, `emoji`,
   `couleur`, `description`).
2. Créer `data/cours/<slug>.js` sur le modèle des fichiers existants.
3. Ajouter la balise `<script src="data/cours/<slug>.js" defer></script>` dans
   `index.html`, à la suite des autres.

## Contenu déjà en place

- **Fondamentaux du système Windows** — trois banques de QCM (historique et
  architecture, identités et contrôle d'accès, services, stockage et protection),
  15 questions tirées par partie, et un examen blanc de 20 questions tirées parmi
  les trois banques. Jeux de rapidité : versions de Windows, SID et niveaux
  d'intégrité, privilèges, sigles du cours.
- **Virtualisation et sécurité des conteneurs** — guide « Créer et lancer son
  premier conteneur » (10 étapes + 2 encadrés de notions) et QCM de révision du
  cours 1 (14 questions).
- **Assembleur** — « Fiche technique x86-64 », cours *Assembly Language* Part 1 et
  Part 2 : 8 parties, 36 fiches (registres, directives, instructions, contrôle de
  flux, traduction du C, accès mémoire, tableaux, structures). Uniquement ce qui
  s'écrit dans le code, sans théorie, chacune avec un exemple commenté.
  72 exercices en 11 chapitres de difficulté croissante
  (`data/cours/assembleur-exercices.js`) : introduction (4 QCM et 4 exercices de code
  sur les sections, les noms des registres et la syntaxe), mov et variables, calculs, bits, C aplati,
  conditions, boucles, tableaux, structures, puis traductions C → assembleur et
  assembleur → C.
- **Complexité algorithmique** — un guide de modèles de rédaction (preuves O/Ω/Θ,
  par l'absurde, boucles, meilleur/pire cas, récurrences) et 23 mini-cours à réponse
  saisie (`type: "probleme"`) en 4 chapitres : comptage d'opérations sur du code C (séquences, tests au pire cas,
  boucles simples et imbriquées, récursivité), notations de Landau (constante `c`,
  simplification de O/Ω/Θ, produit), puis analyse d'algorithmes (parcours, doubles
  boucles, disjonction de cas, tri par sélection et par insertion), et une synthèse
  plus difficile (bornes dépendantes, termes négatifs, preuves par l'absurde, boucles
  logarithmiques, récurrences, seuils) dont chaque exemple est une rédaction modèle
  suivie de plusieurs problèmes. Chaque exercice
  offre un exemple résolu, un problème similaire et une barre de saisie avec clavier
  de caractères spéciaux.
- **Réseaux avancés** — 5 guides en micro-parties de cours (les couches et
  l'encapsulation, l'adressage IPv4 et les sous-réseaux, la commutation et les VLAN,
  le routage IP, et une fiche technique Cisco IOS) ; 4 QCM de théorie + un jeu de
  rapidité sur les masques CIDR ; et **9 exercices de configuration Cisco**
  (`type: "reseau"`, moteur `reseau-cisco.js`) de difficulté croissante :
  adresser un LAN, relier deux routeurs en /30, routage statique entre deux réseaux,
  route par défaut, isolation par VLAN, trunk entre switches, inter-VLAN en
  router-on-a-stick, construction complète de la topologie, puis routage à travers
  trois routeurs. Chacun se valide en cliquant « Vérifier » (le simulateur teste la
  connectivité par ping). L'objectif : après ce parcours, être capable de faire
  les TP.
