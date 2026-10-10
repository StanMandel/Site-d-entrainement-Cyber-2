/* =============================================================
   Introduction aux graphes et aux matrices
   -------------------------------------------------------------
   Leçons (type "lecon", moteur assets/js/lecon.js) tirées des
   cours CM1 à CM3 et des TD1 et TD2 : chaque leçon enchaîne un
   cours pas à pas illustré, une problématique, un exemple, sa
   correction rédigée et des exercices de difficulté croissante
   (niveau 4 = au-delà du TD).

   Fichiers de la matière, dans l'ordre de chargement :
     graphes-matrices.js              ch. 1-2 : graphes non orientés et orientés
     graphes-matrices-connexite.js    ch. 3   : connexité, forte connexité
     graphes-matrices-particuliers.js ch. 4-6 : complets, cliques, stables,
                                                bipartis, couplages, arbres
     graphes-matrices-parcours.js     ch. 7-8 : parcours en profondeur, Kosaraju
     graphes-matrices-matrices.js     ch. 9-10 : matrices, codes LDPC, synthèse
   Écriture des graphes : voir l'en-tête de assets/js/graphes.js.
   ============================================================= */

(() => {
  const graphe = (sommets, aretes, plus) => Object.assign({ type: "graphe", sommets, aretes }, plus || {});
  const oriente = (sommets, arcs, plus) => Object.assign({ type: "graphe", oriente: true, sommets, aretes: arcs }, plus || {});

  /* Graphes des cours et des TD */
  const P_CM1 = "1:1,0 4:3,0 2:0,1 3:2,1 5:4,1";
  const A_CM1 = "1-2 1-3 1-5 2-3 2-4 3-5 4-5";
  const P_CM1_OR = "1:0,0 2:1,0 3:0,1 4:1,1 5:2,1 6:1,2";
  const A_CM1_OR = "1>2 1>3 2>1 2>4 2>5 3>4 4>5 4>6 6>3 6>4 6>5";
  const P_9 = "1:0,1 2:1,0 3:1,1 4:1,2 5:2,0 6:2,1 7:2,2 8:3,1 9:3,2";
  const A_TD1 = "1-2 1-3 1-4 2-6 3-5 3-7 4-6 5-6 6-7 6-8 6-9 7-9";
  const P_TD1_OR = "1:0,0 4:1,0 5:2,0 2:0,1 3:1,1 6:2,1 8:3,1 7:2,2";
  const A_TD1_OR = "4>1 1>2 1>3 2>3 3>4 3>5 4>5 5>6 6>5 3>6 8>6 3>7 6>7 7>6";
  const P_RESEAU = "1:0,1 2:1,0 3:1,2 4:2,1 5:3,0 6:3,2";
  const A_RESEAU = "1-2 1-3 2-3 2-4 3-4 4-5 4-6 5-6";
  const P_CUBE = "1:0,0 2:3,0 3:3,3 4:0,3 5:1,1 6:2,1 7:2,2 8:1,2";
  const A_CUBE = "1-2 2-3 3-4 1-4 5-6 6-7 7-8 5-8 1-5 2-6 3-7 4-8";
  const P_PENTA = "1:1,0 2:2,0.75 3:1.6,1.9 4:0.4,1.9 5:0,0.75";
  const P_HEXA = "1:1,0 2:2,0.55 3:2,1.65 4:1,2.2 5:0,1.65 6:0,0.55";
  const P_CARRE = "1:0,0 2:1.5,0 3:1.5,1.5 4:0,1.5";

  const gCM1 = (plus) => graphe(P_CM1, A_CM1, plus);
  const gTD1 = (plus) => graphe(P_9, A_TD1, plus);
  const gCM1or = (plus) => oriente(P_CM1_OR, A_CM1_OR, plus);
  const gTD1or = (plus) => oriente(P_TD1_OR, A_TD1_OR, plus);

  CONTENU["graphes-matrices"] = {
    chapitres: [

      /* =====================================================
         CHAPITRE 1 — GRAPHES NON ORIENTÉS (CM1, TD1 ex. 1 à 3)
         ===================================================== */
      {
        id: "ch1",
        titre: "Chapitre 1 — Graphes non orientés",
        description: "Sommets, arêtes, degrés, lemme des poignées de main, chaînes et cycles.",
        exercices: [

          /* ---------- Leçon 1.1 ---------- */
          {
            type: "lecon",
            id: "gm-degres",
            titre: "Sommets, arêtes, voisins et degrés",
            description: "Lire un graphe non orienté : G = (V, E), voisinage N(i), degré d(i).",
            cours: [
              {
                titre: "Un graphe, c'est deux ensembles",
                texte: [
                  "Un **graphe non orienté** `G = (V, E)` est défini par :",
                  [
                    "un ensemble de **sommets** (ou nœuds) `V` ;",
                    "un ensemble d'**arêtes** `E` : chaque arête est une **paire** de sommets `{i, j}`."
                  ],
                  "Le nombre de sommets `|V|` est l'**ordre** du graphe. Un graphe se dessine (un rond par sommet, un trait par arête), mais c'est la liste `V`, `E` qui le définit."
                ],
                schema: gCM1({ legende: "Un graphe non orienté G d'ordre 5 (CM1, figure 1)" }),
                redaction: [
                  "`V = {1; 2; 3; 4; 5}` ;",
                  "`E = {{1,2}; {1,3}; {1,5}; {2,3}; {2,4}; {3,5}; {4,5}}`.",
                  "G est d'ordre 5 et possède `|E| = 7` arêtes."
                ]
              },
              {
                titre: "Une arête n'a pas de sens",
                texte: [
                  "Une paire n'est pas ordonnée : `{1, 2}` et `{2, 1}` désignent **la même arête**.",
                  "La position des sommets sur le dessin n'a aucune importance : deux dessins qui relient les mêmes paires représentent le même graphe. Ici, le graphe du CM1 redessiné en pentagone."
                ],
                schema: graphe(P_PENTA, A_CM1, { legende: "Le même graphe G, autrement dessiné" }),
                redaction: [
                  "Les deux dessins ont les mêmes sommets `{1; 2; 3; 4; 5}` et les mêmes arêtes `{1,2}, {1,3}, {1,5}, {2,3}, {2,4}, {3,5}, {4,5}` : ils représentent le même graphe G."
                ]
              },
              {
                titre: "Les voisins d'un sommet : N(i)",
                texte: [
                  "Les sommets reliés à `i` par une arête sont ses **voisins** ; leur ensemble se note `N(i)`.",
                  "Méthode : parcourir la liste `E` et garder les arêtes qui contiennent `i` ; l'autre extrémité de chacune est un voisin."
                ],
                schema: gCM1({ marques: { 1: "a", 2: "b", 3: "b", 5: "b", "1-2": "a", "1-3": "a", "1-5": "a" }, legende: "Le sommet 1 (en bleu) et ses voisins (en orange)" }),
                redaction: [
                  "Les arêtes contenant 1 sont `{1,2}`, `{1,3}` et `{1,5}`, donc `N(1) = {2; 3; 5}`.",
                  "De même `N(3) = {1; 2; 5}` et `N(4) = {2; 5}`."
                ]
              },
              {
                titre: "Le degré d'un sommet : d(i)",
                texte: [
                  "Le **degré** `d(i)` est le nombre de voisins de `i`, c'est-à-dire le nombre d'arêtes qui touchent `i`.",
                  "Sur un dessin, on compte les traits qui partent du sommet."
                ],
                schema: gCM1({ etiquettes: { 1: "d=3", 2: "d=3", 3: "d=3", 4: "d=2", 5: "d=3" }, legende: "Le degré de chaque sommet" }),
                redaction: [
                  "`d(1) = |N(1)| = 3` ; `d(3) = 3` ; `d(4) = 2`.",
                  "Les degrés de G sont 3, 3, 3, 2, 3."
                ]
              },
              {
                titre: "Boucle, arêtes adjacentes, sommet isolé",
                texte: [
                  "Trois mots du CM1 à connaître :",
                  [
                    "une **boucle** est une arête dont les deux extrémités sont le même sommet ;",
                    "deux arêtes sont **adjacentes** si elles ont une extrémité commune ;",
                    "un sommet de degré 0 est **isolé**."
                  ],
                  "Un graphe **simple** est non orienté et sans boucle (rappel du TD1) : c'est le cadre de presque tous les exercices."
                ],
                schema: graphe("1:0,0 2:1,0 3:2,0 4:3,0", "1-1 1-2 2-3", { marques: { "1-2": "b", "2-3": "b", 4: "d" }, legende: "Une boucle en 1, deux arêtes adjacentes (orange), un sommet isolé (rouge)" }),
                redaction: [
                  "`{1,2}` et `{2,3}` sont adjacentes : elles ont l'extrémité 2 en commun.",
                  "`d(4) = 0` : le sommet 4 est isolé.",
                  "`{1,1}` est une boucle : ce graphe n'est pas simple."
                ]
              }
            ],
            problematique: {
              texte: [
                "Un réseau d'entreprise relie six machines par des câbles. L'administrateur veut savoir :",
                [
                  "quelles machines sont reliées **directement** à la machine 4 ;",
                  "quelle machine est **la plus connectée** (si elle tombe en panne, c'est elle qui coupe le plus de liens)."
                ],
                "Comment lire ces informations sur un graphe ?"
              ],
              schema: graphe(P_RESEAU, A_RESEAU, { legende: "Le réseau : un sommet par machine, une arête par câble" })
            },
            exemple: {
              texte: [
                "Le réseau est modélisé par `G = (V, E)` avec `V = {1; 2; 3; 4; 5; 6}` et",
                "`E = {{1,2}; {1,3}; {2,3}; {2,4}; {3,4}; {4,5}; {4,6}; {5,6}}`."
              ],
              schema: graphe(P_RESEAU, A_RESEAU),
              questions: [
                "Donner l'ordre de G et son nombre d'arêtes.",
                "Donner `N(4)`.",
                "Donner le degré de chaque sommet.",
                "Quelle machine est la plus connectée ?"
              ]
            },
            correction: {
              texte: [
                { titre: "1. Ordre et nombre d'arêtes" },
                { redaction: ["`|V| = 6` : G est d'ordre 6. La liste E contient 8 paires : `|E| = 8`."] },
                { titre: "2. Voisins de 4" },
                { redaction: ["Les arêtes contenant 4 sont `{2,4}`, `{3,4}`, `{4,5}` et `{4,6}`, donc `N(4) = {2; 3; 5; 6}`."] },
                { titre: "3. Degrés" },
                {
                  redaction: [
                    "`d(1) = 2` (voisins 2, 3) ; `d(2) = 3` (1, 3, 4) ; `d(3) = 3` (1, 2, 4) ;",
                    "`d(4) = 4` (2, 3, 5, 6) ; `d(5) = 2` (4, 6) ; `d(6) = 2` (4, 5)."
                  ]
                },
                { schema: graphe(P_RESEAU, A_RESEAU, { marques: { 4: "a" }, etiquettes: { 1: "d=2", 2: "d=3", 3: "d=3", 4: "d=4", 5: "d=2", 6: "d=2" } }) },
                { titre: "4. Conclusion" },
                { redaction: ["Le sommet de plus grand degré est 4 (`d(4) = 4`) : la machine 4 est la plus connectée."] },
                { remarque: "Remarquez que `2 + 3 + 3 + 4 + 2 + 2 = 16 = 2 × 8` : la somme des degrés vaut deux fois le nombre d'arêtes. C'est le sujet de la leçon suivante." }
              ]
            },
            exercices: [
              {
                type: "champs", niveau: 1,
                titre: "Lire des degrés",
                enonce: "Dans le graphe G du TD1 (exercice 1), donnez les degrés suivants.",
                schema: gTD1(),
                champs: [
                  { libelle: "`d(1)`", reponse: 3, tolerance: 0 },
                  { libelle: "`d(3)`", reponse: 3, tolerance: 0 },
                  { libelle: "`d(6)`", reponse: 6, tolerance: 0 },
                  { libelle: "`d(8)`", reponse: 1, tolerance: 0 }
                ],
                indice: "Comptez les traits qui partent de chaque sommet.",
                explication: ["`N(1) = {2; 3; 4}`, `N(3) = {1; 5; 7}`, `N(6) = {2; 4; 5; 7; 8; 9}`, `N(8) = {6}`."]
              },
              {
                type: "champs", niveau: 1,
                titre: "Voisins du sommet 3 et du sommet 6",
                enonce: "Toujours dans le graphe du TD1, donnez les ensembles de voisins (TD1, exercice 1, question 2).",
                schema: gTD1(),
                champs: [
                  { libelle: "`N(3)`", reponse: "{1, 5, 7}", ensemble: true },
                  { libelle: "`N(6)`", reponse: "{2, 4, 5, 7, 8, 9}", ensemble: true }
                ],
                indice: "Écrivez un ensemble entre accolades, par exemple `{1, 2}` ; l'ordre ne compte pas.",
                explication: ["Les arêtes contenant 3 : `{1,3}`, `{3,5}`, `{3,7}`. Celles contenant 6 : `{2,6}`, `{4,6}`, `{5,6}`, `{6,7}`, `{6,8}`, `{6,9}`."]
              },
              {
                type: "construire", niveau: 1,
                titre: "Dessiner un graphe à partir de sa définition",
                enonce: [
                  "Tracez le graphe `G = (V, E)` avec `V = {1; 2; 3; 4; 5}` et",
                  "`E = {{1,2}; {1,4}; {2,3}; {2,5}; {3,4}; {4,5}}`."
                ],
                graphe: { sommets: P_PENTA },
                attendu: "1-2 1-4 2-3 2-5 3-4 4-5",
                explication: ["Six arêtes, une par paire de E ; leur position sur le dessin n'a pas d'importance."]
              },
              {
                type: "qcm", niveau: 2,
                titre: "Vocabulaire",
                enonce: "Pour le graphe du TD1, quelles affirmations sont vraies ?",
                schema: gTD1(),
                choix: [
                  "Les arêtes `{1,2}` et `{2,6}` sont adjacentes.",
                  "Le sommet 8 est isolé.",
                  "Le graphe est simple.",
                  "`d(7) = 2`."
                ],
                reponse: [0, 2],
                explication: [
                  "`{1,2}` et `{2,6}` ont l'extrémité 2 en commun : elles sont adjacentes.",
                  "8 n'est pas isolé : `d(8) = 1`. Le graphe n'a pas de boucle : il est simple. `N(7) = {3; 6; 9}`, donc `d(7) = 3`."
                ]
              },
              {
                type: "selection", niveau: 2,
                titre: "Sommets de degré impair",
                enonce: "Sélectionnez tous les sommets de degré impair du graphe du TD1.",
                graphe: { sommets: P_9, aretes: A_TD1 },
                attendu: "1 3 7 8",
                explication: [
                  "Degrés : `d(1) = 3`, `d(2) = 2`, `d(3) = 3`, `d(4) = 2`, `d(5) = 2`, `d(6) = 6`, `d(7) = 3`, `d(8) = 1`, `d(9) = 2`.",
                  "Les sommets de degré impair sont 1, 3, 7 et 8 : ils sont **4**, un nombre pair. Ce n'est pas un hasard (leçon suivante)."
                ]
              },
              {
                type: "construire", niveau: 3,
                titre: "Un graphe aux degrés imposés",
                enonce: [
                  "Tracez un graphe simple sur ces six sommets avec :",
                  ["`d(1) = 1`, `d(2) = 2`, `d(3) = 2` ;", "`d(4) = 3`, `d(5) = 3`, `d(6) = 3`."]
                ],
                graphe: { sommets: P_HEXA },
                regles: [{ regle: "degres", valeurs: "1:1 2:2 3:2 4:3 5:3 6:3" }],
                solution: "4-5 4-6 5-6 1-4 2-5 3-6 2-3",
                indice: "La somme des degrés vaut 14 : il faut 7 arêtes. Commencez par relier entre eux les sommets de degré 3.",
                explication: [
                  "Une solution : le triangle `{4,5,6}` (chacun a alors 2 voisins), puis `{1,4}`, `{2,5}`, `{3,6}` (4, 5, 6 passent à 3) et enfin `{2,3}`.",
                  "Il y a bien `14 / 2 = 7` arêtes."
                ]
              },
              {
                type: "champs", niveau: 4,
                titre: "Le degré maximal d'un graphe simple",
                enonce: [
                  "On considère un graphe simple d'ordre 5.",
                  "1. Quel est le plus grand degré possible d'un sommet ?",
                  "2. On suppose que trois sommets sont de degré maximal. Quel est alors le plus petit degré possible des deux autres sommets ?"
                ],
                schema: graphe(P_PENTA, "1-2 1-3 1-4 1-5 2-3 2-4 2-5 3-4 3-5", { marques: { 1: "a", 2: "a", 3: "a" }, legende: "Trois sommets de degré 4 sur 5 sommets" }),
                champs: [
                  { libelle: "1. Degré maximal", reponse: 4, tolerance: 0 },
                  { libelle: "2. Degré minimal des deux autres", reponse: 3, tolerance: 0 }
                ],
                explication: [
                  "Dans un graphe simple, un sommet n'est pas son propre voisin et chaque voisin compte une fois : `d(i) ≤ n − 1 = 4`.",
                  "Un sommet de degré 4 est voisin de **tous** les autres. Chacun des deux sommets restants est donc voisin des trois sommets de degré 4 : son degré vaut au moins 3.",
                  "C'est l'argument du TD1, exercice 3, question 4 : la suite 1, 1, 4, 4, 4 est impossible."
                ]
              }
            ]
          },

          /* ---------- Leçon 1.2 ---------- */
          {
            type: "lecon",
            id: "gm-poignees",
            titre: "Lemme des poignées de main",
            description: "∑ d(i) = 2|E| : compter des arêtes et prouver qu'un graphe n'existe pas.",
            cours: [
              {
                titre: "L'énoncé",
                texte: [
                  "**Lemme des poignées de main (CM1).** Dans tout graphe non orienté `G = (V, E)` :",
                  "`∑ d(i) = 2|E|`, la somme portant sur tous les sommets i de V.",
                  "Le nom vient d'une soirée : si chaque invité compte les mains qu'il a serrées, le total vaut deux fois le nombre de poignées de main échangées."
                ],
                schema: gCM1({ etiquettes: { 1: "d=3", 2: "d=3", 3: "d=3", 4: "d=2", 5: "d=3" }, legende: "3 + 3 + 3 + 2 + 3 = 14 = 2 × 7" }),
                redaction: ["Pour le graphe du CM1 : `∑ d(i) = 3 + 3 + 3 + 2 + 3 = 14` et `2|E| = 2 × 7 = 14`."]
              },
              {
                titre: "La démonstration",
                texte: [
                  "Idée : chaque arête `{i, j}` est comptée **une fois dans d(i)** et **une fois dans d(j)**.",
                  "En additionnant tous les degrés, on compte donc chaque arête exactement deux fois."
                ],
                schema: gCM1({ marques: { "2-4": "a", 2: "b", 4: "b" }, etiquettes: { 2: "+1", 4: "+1" }, legende: "L'arête {2,4} apporte 1 à d(2) et 1 à d(4)" }),
                redaction: [
                  "Comptons les couples (sommet, arête qui le contient) de deux façons.",
                  "Pour un sommet i fixé, il y a `d(i)` tels couples : au total `∑ d(i)`.",
                  "Pour une arête `{i, j}` fixée (avec `i ≠ j`, graphe sans boucle), il y a exactement 2 couples : au total `2|E|`.",
                  "Les deux comptes sont égaux : `∑ d(i) = 2|E|`. □"
                ]
              },
              {
                titre: "Conséquence : un nombre pair de sommets de degré impair",
                texte: [
                  "La somme des degrés `2|E|` est **paire**. Les degrés pairs donnent une somme paire ; il faut donc que la somme des degrés impairs soit paire aussi.",
                  "Une somme de nombres impairs est paire seulement s'il y en a un nombre pair."
                ],
                schema: gTD1({ marques: { 1: "a", 3: "a", 7: "a", 8: "a" }, legende: "Graphe du TD1 : 4 sommets de degré impair (1, 3, 7, 8)" }),
                redaction: ["Dans tout graphe, le nombre de sommets de degré impair est pair."]
              },
              {
                titre: "Prouver qu'un graphe n'existe pas",
                texte: [
                  "Pour montrer qu'une suite de degrés est impossible, on raisonne **par l'absurde** : on suppose que le graphe existe, puis on trouve une contradiction avec le lemme.",
                  "Exemple : trois sommets, chacun de degré 1."
                ],
                schema: graphe("1:0,0 2:1,0 3:2,0", "1-2", { marques: { 3: "d" }, legende: "Impossible : le troisième sommet resterait seul" }),
                redaction: [
                  "Supposons qu'un graphe ait trois sommets de degré 1.",
                  "Alors `∑ d(i) = 1 + 1 + 1 = 3 = 2|E|`, donc `|E| = 3/2` : impossible, `|E|` est un entier.",
                  "Contradiction : un tel graphe n'existe pas."
                ]
              },
              {
                titre: "Deuxième outil : d(i) ≤ n − 1",
                texte: [
                  "Dans un graphe **simple** d'ordre n, un sommet a au plus `n − 1` voisins (tous les autres sommets).",
                  "Une somme paire ne suffit donc pas : il faut aussi vérifier qu'aucun degré ne dépasse `n − 1`."
                ],
                schema: graphe(P_PENTA, "1-2 1-3 1-4 1-5", { marques: { 1: "a" }, etiquettes: { 1: "d=4" }, legende: "Ordre 5 : un sommet a au plus 4 voisins" }),
                redaction: [
                  "Suite 2, 3, 3, 3, 5, 6 sur 6 sommets (TD1, ex. 3.3) : un sommet de degré 6 aurait 6 voisins parmi les 5 autres sommets. Impossible dans un graphe simple."
                ]
              }
            ],
            problematique: {
              texte: [
                "On souhaite organiser un tournoi de foot réunissant **7 équipes** (TD1, exercice 2).",
                "Chaque équipe doit rencontrer **exactement 3** autres équipes, et deux équipes ne peuvent se rencontrer qu'une seule fois.",
                "Proposez un planning des matchs."
              ],
              schema: graphe("1 2 3 4 5 6 7", "", { disposition: "cercle", legende: "Les 7 équipes : quels matchs tracer ?" })
            },
            exemple: {
              texte: ["Modélisez le tournoi par un graphe, puis répondez :"],
              questions: [
                "Que représentent les sommets, les arêtes, le degré d'un sommet ?",
                "Que vaudrait la somme des degrés ?",
                "Le planning demandé existe-t-il ?",
                "Et avec 8 équipes ?"
              ],
              schema: graphe("1 2 3 4 5 6 7", "1-2 2-3 3-4 4-5 5-6 6-7 7-1", { disposition: "cercle", legende: "Un début de planning : chacun a déjà 2 matchs… mais le troisième ?" })
            },
            correction: {
              texte: [
                { titre: "1. Modélisation" },
                {
                  redaction: [
                    "Sommets : les 7 équipes. Arête `{i, j}` : un match entre i et j. Pas de boucle et au plus une arête par paire : le graphe est simple.",
                    "`d(i)` est le nombre de matchs joués par l'équipe i : on veut `d(i) = 3` pour tout i."
                  ]
                },
                { titre: "2-3. Le planning est impossible" },
                {
                  redaction: [
                    "Supposons qu'un tel planning existe.",
                    "D'après le lemme des poignées de main, `∑ d(i) = 7 × 3 = 21 = 2|E|`.",
                    "Or 21 est impair : contradiction. **Aucun planning ne convient.**"
                  ]
                },
                { titre: "4. Avec 8 équipes" },
                {
                  redaction: [
                    "`∑ d(i) = 8 × 3 = 24` : il faudrait 12 matchs, ce qui n'est plus contradictoire.",
                    "Le cube ci-dessous est un planning : chaque sommet a exactement 3 voisins."
                  ]
                },
                { schema: graphe(P_CUBE, A_CUBE, { legende: "8 équipes, 12 matchs, 3 matchs chacune" }) },
                { remarque: "Le lemme donne une condition **nécessaire** (somme paire). Elle ne suffit pas toujours : il faut ensuite construire le graphe pour prouver qu'il existe." }
              ]
            },
            exercices: [
              {
                type: "champs", niveau: 1,
                titre: "Compter les arêtes",
                enonce: "Un graphe a sept sommets, de degrés 3, 3, 2, 2, 2, 1, 1. Combien a-t-il d'arêtes ?",
                schema: graphe("1:0,0 2:1,0 3:2,0 4:0,1 5:1,1 6:2,1 7:3,0.5", "1-2 2-3 1-4 2-5 3-6 4-5 3-7", { legende: "Un graphe qui a ces degrés" }),
                champs: [{ libelle: "`|E|`", reponse: 7, tolerance: 0 }],
                explication: ["`∑ d(i) = 3 + 3 + 2 + 2 + 2 + 1 + 1 = 14 = 2|E|`, donc `|E| = 7`."]
              },
              {
                type: "qcm", niveau: 1,
                titre: "Une suite de degrés",
                enonce: "Existe-t-il un graphe dont les degrés sont 3, 3, 3, 2, 2 ?",
                schema: graphe(P_PENTA, "", { etiquettes: { 1: "3", 2: "3", 3: "3", 4: "2", 5: "2" } }),
                choix: [
                  "Oui.",
                  "Non, car la somme des degrés est impaire.",
                  "Non, car un sommet de degré 3 est impossible avec 5 sommets."
                ],
                reponse: 1,
                explication: ["`3 + 3 + 3 + 2 + 2 = 13` est impair, alors que `∑ d(i) = 2|E|` est pair."]
              },
              {
                type: "construire", niveau: 2,
                titre: "Tournoi à 6 équipes",
                enonce: "Six équipes doivent jouer chacune exactement 3 matchs, au plus un match par paire. Tracez un planning.",
                graphe: { sommets: P_HEXA },
                regles: [{ regle: "regulier", k: 3 }],
                solution: "1-2 2-3 3-4 4-5 5-6 1-6 1-4 2-5 3-6",
                indice: "`6 × 3 = 18` : il faut 9 matchs. Essayez un hexagone (2 matchs chacun), puis une diagonale par équipe.",
                explication: ["L'hexagone donne 2 matchs à chacun ; les trois grandes diagonales `{1,4}`, `{2,5}`, `{3,6}` ajoutent le troisième."]
              },
              {
                type: "champs", niveau: 2,
                titre: "TD1, exercice 3.3",
                enonce: "Existe-t-il un graphe simple à 6 sommets dont les degrés sont 2, 3, 3, 3, 5, 6 ?",
                schema: graphe(P_HEXA, "", { etiquettes: { 1: "2", 2: "3", 3: "3", 4: "3", 5: "5", 6: "6" } }),
                champs: [
                  { libelle: "Somme des degrés", reponse: 22, tolerance: 0 },
                  { libelle: "Degré maximal possible d'un sommet", reponse: 5, tolerance: 0 },
                  { libelle: "Un tel graphe existe-t-il ? (oui / non)", reponse: "non" }
                ],
                explication: [
                  "La somme 22 est paire : le lemme ne suffit pas à conclure.",
                  "Mais dans un graphe simple d'ordre 6, `d(i) ≤ 5` : un sommet de degré 6 est impossible. Le graphe n'existe pas."
                ]
              },
              {
                type: "remettre", niveau: 3,
                titre: "Rédiger : nombre pair de sommets de degré impair",
                enonce: "Remettez dans l'ordre la démonstration de : « dans tout graphe, le nombre de sommets de degré impair est pair ».",
                etapes: [
                  "Notons I l'ensemble des sommets de degré impair, P celui des sommets de degré pair, et `S_I`, `S_P` les sommes de leurs degrés.",
                  "D'après le lemme des poignées de main, `S_P + S_I = ∑ d(i) = 2|E|` est pair.",
                  "`S_P` est pair comme somme de nombres pairs, donc `S_I = 2|E| − S_P` est pair.",
                  "Une somme de |I| nombres impairs a la même parité que |I| : |I| est donc pair. □"
                ],
                explication: ["On nomme les objets, on cite le lemme, on découpe la somme, on conclut sur chaque morceau."]
              },
              {
                type: "champs", niveau: 3,
                titre: "TD1, exercice 3.4",
                enonce: "Existe-t-il un graphe simple à 5 sommets dont les degrés sont 1, 1, 4, 4, 4 ?",
                schema: graphe(P_PENTA, "", { etiquettes: { 1: "4", 2: "4", 3: "4", 4: "1", 5: "1" } }),
                champs: [
                  { libelle: "Somme des degrés", reponse: 14, tolerance: 0 },
                  { libelle: "Degré minimal d'un sommet voisin des trois sommets de degré 4", reponse: 3, tolerance: 0 },
                  { libelle: "Un tel graphe existe-t-il ? (oui / non)", reponse: "non" }
                ],
                explication: [
                  "La somme 14 est paire : pas de contradiction avec le lemme.",
                  "Un sommet de degré 4 dans un graphe d'ordre 5 est voisin de tous les autres. Les deux sommets « de degré 1 » sont donc voisins des trois sommets de degré 4 : leur degré vaut au moins 3. Contradiction : le graphe n'existe pas."
                ]
              },
              {
                type: "champs", niveau: 4,
                titre: "Retrouver l'ordre",
                enonce: "Un graphe simple possède 15 arêtes : trois sommets sont de degré 4, tous les autres de degré 3. Combien a-t-il de sommets ?",
                schema: graphe("1 2 3 4 5 6 7 8 9", "", { disposition: "cercle", etiquettes: { 1: "4", 2: "4", 3: "4", 4: "3", 5: "3", 6: "3", 7: "3", 8: "3", 9: "3" }, legende: "Combien de sommets de degré 3 ?" }),
                champs: [{ libelle: "Ordre n", reponse: 9, tolerance: 0 }],
                indice: "Notez k le nombre de sommets de degré 3 et appliquez le lemme.",
                explication: ["`∑ d(i) = 3 × 4 + 3k = 2 × 15 = 30`, donc `3k = 18`, `k = 6`. Le graphe a `3 + 6 = 9` sommets."]
              },
              {
                type: "construire", niveau: 4,
                titre: "Sept équipes, quatre matchs chacune",
                enonce: "Avec 3 matchs chacune c'était impossible. Tracez un planning où chacune des 7 équipes joue exactement **4** matchs.",
                graphe: { sommets: "1 2 3 4 5 6 7", disposition: "cercle" },
                regles: [{ regle: "regulier", k: 4 }],
                solution: "1-2 2-3 3-4 4-5 5-6 6-7 1-7 1-3 2-4 3-5 4-6 5-7 1-6 2-7",
                indice: "`7 × 4 = 28` est pair : il faut 14 matchs. Reliez chaque équipe à ses deux voisines sur le cercle et aux deux suivantes.",
                explication: ["Chaque équipe i joue contre i ± 1 et i ± 2 (en tournant sur le cercle) : 4 matchs chacune, 14 en tout."]
              }
            ]
          },

          /* ---------- Leçon 1.3 ---------- */
          {
            type: "lecon",
            id: "gm-chaines",
            titre: "Chaînes et cycles",
            description: "Longueur, chaîne simple, élémentaire, cycle : décrire et prouver des trajets.",
            cours: [
              {
                titre: "Une chaîne",
                texte: [
                  "Une **chaîne** allant de `i₀` à `iℓ` est une suite de sommets `(i₀, i₁, …, iℓ)` telle que chaque `{iₖ₋₁, iₖ}` est une arête.",
                  "Sa **longueur** est son nombre d'arêtes : ℓ (un de moins que le nombre de sommets écrits)."
                ],
                schema: gCM1({ marques: { 1: "a", 2: "a", 3: "a", 5: "a", "1-2": "a", "2-3": "a", "3-5": "a" }, legende: "μ₁ = (1, 2, 3, 5)" }),
                redaction: ["`μ₁ = (1, 2, 3, 5)` est une chaîne car `{1,2}`, `{2,3}` et `{3,5}` sont des arêtes ; sa longueur est 3."]
              },
              {
                titre: "Simple, élémentaire",
                texte: [
                  "Une chaîne est :",
                  [
                    "**simple** si elle n'utilise pas deux fois la même arête ;",
                    "**élémentaire** si elle ne passe pas deux fois par le même sommet."
                  ],
                  "Une chaîne élémentaire est forcément simple (deux fois la même arête, c'est deux fois ses sommets) ; la réciproque est fausse."
                ],
                schema: gCM1({ marques: { 4: "a", 2: "d", 1: "a", 3: "a", "2-4": "a", "1-2": "a", "1-3": "a", "2-3": "a" }, legende: "(4, 2, 1, 3, 2) : simple, mais 2 est répété" }),
                redaction: [
                  "`(4, 2, 1, 3, 2)` est une chaîne de longueur 4 : ses arêtes `{2,4}`, `{1,2}`, `{1,3}`, `{2,3}` sont distinctes, elle est **simple**.",
                  "Elle passe deux fois par 2 : elle n'est **pas élémentaire**."
                ]
              },
              {
                titre: "Un cycle",
                texte: [
                  "Un **cycle** est une chaîne dont les extrémités coïncident : `i₀ = iℓ`.",
                  "Il est **élémentaire** s'il ne repasse par aucun sommet (sauf le départ, qui est aussi l'arrivée)."
                ],
                schema: gCM1({ marques: { "1-3": "a", "3-5": "a", "4-5": "a", "2-4": "a", "1-2": "a" }, legende: "μ₃ = (1, 3, 5, 4, 2, 1)" }),
                redaction: ["`μ₃ = (1, 3, 5, 4, 2, 1)` est un cycle élémentaire de longueur 5 : il revient en 1 sans repasser par un sommet."]
              },
              {
                titre: "Un cycle qui n'est pas élémentaire",
                texte: [
                  "Rien n'interdit à un cycle de repasser par des sommets ou des arêtes : il est alors non élémentaire.",
                  "On lit sa longueur en comptant les pas, répétitions comprises."
                ],
                schema: gCM1({ marques: { "1-2": "a", "2-3": "a", "3-5": "a", "1-5": "a", "1-3": "a" }, legende: "μ₄ = (1, 2, 3, 5, 1, 2, 3, 1)" }),
                redaction: ["`μ₄ = (1, 2, 3, 5, 1, 2, 3, 1)` est un cycle de longueur 7 : il revient en 1, mais il repasse par 1, 2 et 3, il n'est pas élémentaire."]
              },
              {
                titre: "Prouver qu'un cycle n'existe pas",
                texte: [
                  "Un cycle élémentaire qui passe par un sommet i y **entre** par une arête et en **ressort** par une autre : il faut `d(i) ≥ 2`.",
                  "Et s'il passe par un sommet de degré 2, il emprunte forcément ses **deux** arêtes. Ces deux remarques suffisent souvent."
                ],
                schema: gTD1({ marques: { 8: "d", "6-8": "d" }, legende: "TD1 : d(8) = 1" }),
                redaction: ["`d(8) = 1` : un cycle élémentaire passant par 8 devrait utiliser deux arêtes distinctes en 8. Aucun cycle élémentaire ne passe par 8."]
              }
            ],
            problematique: {
              texte: [
                "Dans un réseau, un message va d'un routeur à un autre en suivant les liens.",
                "Pour éviter les boucles de routage, on veut des trajets qui ne repassent jamais par le même routeur ; pour tester la redondance, on cherche des circuits fermés.",
                "Comment décrire ces trajets et prouver qu'ils existent ou non ?"
              ],
              schema: gTD1({ legende: "Le graphe du TD1, exercice 1" })
            },
            exemple: {
              texte: ["Dans le graphe du TD1 (exercice 1, questions 3 à 5) :"],
              schema: gTD1(),
              questions: [
                "Donner une chaîne de longueur 4, puis une chaîne de longueur 7.",
                "Donner un cycle de longueur 4, puis un cycle de longueur 3.",
                "Donner un cycle élémentaire de longueur 6.",
                "Existe-t-il un cycle élémentaire de longueur supérieure à 7 ?",
                "Existe-t-il un cycle élémentaire passant par le sommet 8 ?"
              ]
            },
            correction: {
              texte: [
                { titre: "1. Chaînes" },
                { redaction: ["`(1, 2, 6, 7, 9)` : `{1,2}`, `{2,6}`, `{6,7}`, `{7,9}` sont des arêtes, longueur 4.", "`(1, 2, 6, 5, 3, 7, 9, 6)` : 7 arêtes consécutives du graphe, longueur 7 (elle repasse par 6)."] },
                { titre: "2. Cycles" },
                { redaction: ["`(1, 2, 6, 4, 1)` est un cycle de longueur 4 ; `(6, 7, 9, 6)` est un cycle de longueur 3."] },
                { schema: [gTD1({ marques: { "1-2": "a", "2-6": "a", "4-6": "a", "1-4": "a" }, legende: "(1, 2, 6, 4, 1)" }), gTD1({ marques: { "6-7": "b", "7-9": "b", "6-9": "b" }, legende: "(6, 7, 9, 6)" })] },
                { titre: "3. Cycle élémentaire de longueur 6" },
                { redaction: ["`(1, 2, 6, 9, 7, 3, 1)` : six arêtes du graphe, six sommets distincts, retour en 1."] },
                { schema: gTD1({ marques: { "1-2": "c", "2-6": "c", "6-9": "c", "7-9": "c", "3-7": "c", "1-3": "c" } }) },
                { titre: "4. Pas de cycle élémentaire de longueur > 7" },
                {
                  redaction: [
                    "Supposons qu'un cycle élémentaire ait une longueur `ℓ ≥ 8` : il passe par ℓ sommets distincts, donc par au moins 8 des 9 sommets.",
                    "Il ne passe pas par 8 (`d(8) = 1`), il passe donc par tous les autres, en particulier par 2 et par 4.",
                    "Or `N(2) = N(4) = {1; 6}` : un sommet de degré 2 sur le cycle impose ses deux arêtes. Le cycle contient `{1,2}`, `{2,6}`, `{1,4}`, `{4,6}`, donc la boucle fermée `(1, 2, 6, 4, 1)` : il s'arrête à 4 sommets.",
                    "Contradiction : il n'existe pas de cycle élémentaire de longueur supérieure à 7."
                  ]
                },
                { titre: "5. Sommet 8" },
                { redaction: ["`d(8) = 1` : aucun cycle élémentaire ne passe par 8."] },
                { remarque: "En poussant le même raisonnement (5 et 9 sont aussi de degré 2), on montre que le plus long cycle élémentaire est de longueur 6." }
              ]
            },
            exercices: [
              {
                type: "ordre", niveau: 1,
                titre: "Une chaîne de longueur 3",
                enonce: "Cliquez, dans l'ordre, les sommets d'une chaîne de longueur 3 allant de 4 à 1.",
                graphe: { sommets: P_CM1, aretes: A_CM1 },
                regles: [{ regle: "chaine", de: "4", vers: "1", longueur: 3 }],
                solution: "4 2 3 1",
                explication: ["Par exemple `(4, 2, 3, 1)` ou `(4, 5, 3, 1)` : trois arêtes, de 4 à 1."]
              },
              {
                type: "qcm", niveau: 1,
                titre: "Reconnaître une chaîne",
                enonce: "Dans le graphe du CM1, que dire de `(1, 3, 2, 4, 5, 3)` ?",
                schema: gCM1(),
                choix: [
                  "C'est une chaîne élémentaire de longueur 5.",
                  "C'est une chaîne simple, non élémentaire, de longueur 5.",
                  "C'est un cycle.",
                  "Ce n'est pas une chaîne."
                ],
                reponse: 1,
                explication: ["`{1,3}`, `{2,3}`, `{2,4}`, `{4,5}`, `{3,5}` sont cinq arêtes distinctes : chaîne simple de longueur 5. Elle passe deux fois par 3 : pas élémentaire. Elle finit en 3 et non en 1 : ce n'est pas un cycle."]
              },
              {
                type: "ordre", niveau: 2,
                titre: "Un cycle élémentaire de longueur 5",
                enonce: "Dans le graphe du TD1, cliquez un cycle élémentaire de longueur 5, écrit comme dans le cours : `(i₀, i₁, …, i₅)` avec `i₅ = i₀`.",
                graphe: { sommets: P_9, aretes: A_TD1 },
                regles: [{ regle: "chaine", ferme: true, elementaire: true, longueur: 5 }],
                solution: "1 2 6 5 3 1",
                explication: ["Par exemple `(1, 2, 6, 5, 3, 1)` ou `(1, 3, 7, 6, 4, 1)`."]
              },
              {
                type: "ordre", niveau: 2,
                titre: "Une chaîne de longueur 7",
                enonce: "Cliquez une chaîne **simple** de longueur 7 du graphe du TD1 (elle peut repasser par un sommet, pas par une arête).",
                graphe: { sommets: P_9, aretes: A_TD1 },
                regles: [{ regle: "chaine", longueur: 7, simple: true }],
                solution: "1 2 6 5 3 7 9 6",
                explication: ["Par exemple `(1, 2, 6, 5, 3, 7, 9, 6)` : sept arêtes distinctes."]
              },
              {
                type: "ordre", niveau: 3,
                titre: "Le cycle élémentaire de longueur 6",
                enonce: "Cliquez un cycle élémentaire de longueur 6 du graphe du TD1.",
                graphe: { sommets: P_9, aretes: A_TD1 },
                regles: [{ regle: "chaine", ferme: true, elementaire: true, longueur: 6 }],
                solution: "1 2 6 9 7 3 1",
                indice: "2 et 4 ont les mêmes voisins 1 et 6 : un long cycle n'en contient qu'un.",
                explication: ["Il n'y en a que deux : `(1, 2, 6, 9, 7, 3, 1)` et `(1, 4, 6, 9, 7, 3, 1)`."]
              },
              {
                type: "champs", niveau: 3,
                titre: "Compter les cycles",
                enonce: "Dans le graphe du TD1, combien y a-t-il de cycles élémentaires de longueur 4 (un cycle est compté une seule fois, quel que soit son point de départ et son sens) ? Quelle est la longueur du plus long cycle élémentaire ?",
                schema: gTD1(),
                champs: [
                  { libelle: "Cycles élémentaires de longueur 4", reponse: 2, tolerance: 0 },
                  { libelle: "Longueur maximale d'un cycle élémentaire", reponse: 6, tolerance: 0 }
                ],
                explication: [
                  "Longueur 4 : `(1, 2, 6, 4, 1)` et `(3, 5, 6, 7, 3)`.",
                  "Longueur 7 : il faudrait 7 sommets parmi `{1,…,7,9}`, avec un seul de 2 et 4 (voir la correction), donc 5 et 9. Les sommets de degré 2 imposent leurs arêtes : `{3,5}`, `{5,6}`, `{6,9}`, `{7,9}` et, selon le cas, `{1,2}`, `{2,6}` ou `{1,4}`, `{4,6}`. Le sommet 6 aurait alors trois arêtes du cycle : impossible. Le maximum est 6."
                ]
              },
              {
                type: "selection", cible: "aretes", niveau: 4,
                titre: "Un cycle qui passe partout",
                enonce: "Dans le planning du cube (8 équipes), sélectionnez les arêtes d'un cycle élémentaire qui passe par les **8** sommets.",
                graphe: { sommets: P_CUBE, aretes: A_CUBE },
                nomEnsemble: "C",
                regles: [{ regle: "cycle", longueur: 8 }],
                solution: "1-2 2-6 5-6 5-8 7-8 3-7 3-4 1-4",
                explication: ["Par exemple `(1, 2, 6, 5, 8, 7, 3, 4, 1)` : 8 arêtes, chaque sommet visité une fois. Un tel cycle s'appelle un cycle hamiltonien."]
              },
              {
                type: "qcm", niveau: 4,
                titre: "Degré ≥ 2 partout",
                enonce: "Dans un graphe fini où tous les sommets ont un degré au moins 2, existe-t-il forcément un cycle élémentaire ?",
                schema: graphe("1:0,0 2:1,0 3:2,0 4:3,0 5:1.5,1", "1-2 2-3 3-4 1-5 4-5 2-5", { marques: { 1: "a", "1-2": "a", "2-3": "a", "3-4": "a", 4: "a" }, legende: "Une plus longue chaîne élémentaire et son extrémité 1" }),
                choix: [
                  "Oui, toujours.",
                  "Non : un arbre a tous ses degrés ≥ 2.",
                  "Seulement si le graphe est connexe."
                ],
                reponse: 0,
                explication: [
                  "Prenons une chaîne élémentaire `(i₀, …, iℓ)` de longueur **maximale**. Tous les voisins de `i₀` sont sur la chaîne, sinon on pourrait l'allonger.",
                  "Comme `d(i₀) ≥ 2`, `i₀` a un voisin `i_k` autre que `i₁` (avec `k ≥ 2`) : `(i₀, i₁, …, i_k, i₀)` est un cycle élémentaire.",
                  "Un arbre a au moins deux sommets de degré 1 : il ne contredit rien."
                ]
              }
            ]
          }
        ]
      },

      /* =====================================================
         CHAPITRE 2 — GRAPHES ORIENTÉS (CM1, TD1 ex. 4)
         ===================================================== */
      {
        id: "ch2",
        titre: "Chapitre 2 — Graphes orientés",
        description: "Arcs, successeurs, prédécesseurs, demi-degrés, chemins et circuits.",
        exercices: [

          /* ---------- Leçon 2.1 ---------- */
          {
            type: "lecon",
            id: "gm-orientes",
            titre: "Arcs, successeurs et demi-degrés",
            description: "N⁺(i), N⁻(i), d⁺(i), d⁻(i) et la somme des demi-degrés.",
            cours: [
              {
                titre: "Un graphe orienté",
                texte: [
                  "Dans un **graphe orienté** `G = (V, E)`, les liens sont des **arcs** : des **couples** `(i, j)`, dessinés par une flèche de i vers j.",
                  "i est l'**extrémité initiale**, j l'**extrémité finale**. Cette fois, `(i, j) ≠ (j, i)` : les deux arcs peuvent exister séparément."
                ],
                schema: gCM1or({ legende: "Un graphe orienté G d'ordre 6 (CM1, figure 2)" }),
                redaction: [
                  "`V = {1; 2; 3; 4; 5; 6}` ;",
                  "`E = {(1,2); (1,3); (2,1); (2,4); (2,5); (3,4); (4,5); (4,6); (6,3); (6,4); (6,5)}`."
                ]
              },
              {
                titre: "Successeurs et prédécesseurs",
                texte: [
                  "Pour un arc `(i, j)`, j est un **successeur** de i et i un **prédécesseur** de j.",
                  [
                    "`N⁺(i)` : l'ensemble des successeurs de i (flèches qui partent de i) ;",
                    "`N⁻(i)` : l'ensemble des prédécesseurs de i (flèches qui arrivent en i) ;",
                    "`N(i) = N⁺(i) ∪ N⁻(i)` : les voisins de i."
                  ]
                ],
                schema: gCM1or({ marques: { 4: "a", 5: "c", 6: "c", "4>5": "c", "4>6": "c", 2: "b", 3: "b", "2>4": "b", "3>4": "b", "6>4": "b" }, legende: "Successeurs de 4 en vert, prédécesseurs en orange" }),
                redaction: ["`N⁺(4) = {5; 6}` ; `N⁻(4) = {2; 3; 6}` ; `N(4) = {2; 3; 5; 6}` (6 est à la fois successeur et prédécesseur)."]
              },
              {
                titre: "Demi-degrés",
                texte: [
                  [
                    "**demi-degré extérieur** `d⁺(i) = |N⁺(i)|` : nombre d'arcs qui partent de i ;",
                    "**demi-degré intérieur** `d⁻(i) = |N⁻(i)|` : nombre d'arcs qui arrivent en i ;",
                    "**degré** `d(i) = d⁺(i) + d⁻(i)`."
                  ],
                  "Attention : `d(1) = 3` alors que `N(1) = {2; 3}` n'a que 2 éléments, car 2 est compté une fois comme successeur et une fois comme prédécesseur."
                ],
                schema: gCM1or({ etiquettes: { 1: "2/1", 2: "3/1", 3: "1/2", 4: "2/3", 5: "0/3", 6: "3/1" }, legende: "Étiquette d⁺/d⁻ de chaque sommet" }),
                redaction: [
                  "`d⁺(1) = 2` ; `d⁻(1) = 1` ; `d(1) = 3`.",
                  "`d⁺(4) = 2` ; `d⁻(4) = 3` ; `d(4) = 5`.",
                  "`d⁺(5) = 0` ; `d⁻(5) = 3` ; `d(5) = 3`."
                ]
              },
              {
                titre: "Somme des demi-degrés",
                texte: [
                  "Chaque arc a exactement une extrémité initiale et une extrémité finale. En sommant :",
                  "`∑ d⁺(i) = ∑ d⁻(i) = |E|` et donc `∑ d(i) = 2|E|`.",
                  "C'est le lemme des poignées de main version orientée."
                ],
                schema: gCM1or({ etiquettes: { 1: "2/1", 2: "3/1", 3: "1/2", 4: "2/3", 5: "0/3", 6: "3/1" }, legende: "2+3+1+2+0+3 = 11 = 1+1+2+3+3+1" }),
                redaction: [
                  "Chaque arc `(i, j)` compte 1 dans `d⁺(i)` et rien d'autre dans les demi-degrés extérieurs : `∑ d⁺(i) = |E|`.",
                  "De même, il compte 1 dans `d⁻(j)` seulement : `∑ d⁻(i) = |E|`. Ici `|E| = 11`."
                ]
              }
            ],
            problematique: {
              texte: [
                "Sur un réseau social, on peut **suivre** un compte sans être suivi en retour. Qui est le plus suivi ? Qui suit le plus de monde ?",
                "Un graphe non orienté confondrait « A suit B » et « B suit A » : il faut des flèches."
              ],
              schema: gTD1or({ legende: "Le graphe orienté du TD1, exercice 4" })
            },
            exemple: {
              texte: ["Dans le graphe orienté du TD1 (exercice 4, questions 1 à 3) :"],
              schema: gTD1or(),
              questions: [
                "Donner les demi-degrés de chaque sommet.",
                "Donner les successeurs de 3, puis de 6.",
                "Donner la liste des voisins de 1."
              ]
            },
            correction: {
              texte: [
                { titre: "1. Demi-degrés" },
                {
                  entetes: ["Sommet", "1", "2", "3", "4", "5", "6", "7", "8"],
                  lignes: [
                    ["`d⁺`", "2", "1", "4", "2", "1", "2", "1", "1"],
                    ["`d⁻`", "1", "1", "2", "1", "3", "4", "2", "0"]
                  ]
                },
                { redaction: ["Contrôle : `∑ d⁺ = 14 = ∑ d⁻`, et le graphe a bien 14 arcs."] },
                { schema: gTD1or({ etiquettes: { 1: "2/1", 2: "1/1", 3: "4/2", 4: "2/1", 5: "1/3", 6: "2/4", 7: "1/2", 8: "1/0" } }) },
                { titre: "2. Successeurs" },
                { redaction: ["Les arcs qui partent de 3 sont `(3,4)`, `(3,5)`, `(3,6)`, `(3,7)` : `N⁺(3) = {4; 5; 6; 7}`.", "`N⁺(6) = {5; 7}`."] },
                { titre: "3. Voisins de 1" },
                { redaction: ["`N⁺(1) = {2; 3}` et `N⁻(1) = {4}`, donc `N(1) = {2; 3; 4}`."] }
              ]
            },
            exercices: [
              {
                type: "champs", niveau: 1,
                titre: "Lire des demi-degrés",
                enonce: "Dans le graphe orienté du CM1, donnez :",
                schema: gCM1or(),
                champs: [
                  { libelle: "`d⁺(2)`", reponse: 3, tolerance: 0 },
                  { libelle: "`d⁻(5)`", reponse: 3, tolerance: 0 },
                  { libelle: "`d(6)`", reponse: 4, tolerance: 0 }
                ],
                explication: ["`N⁺(2) = {1; 4; 5}` ; `N⁻(5) = {2; 4; 6}` ; `d(6) = d⁺(6) + d⁻(6) = 3 + 1 = 4`."]
              },
              {
                type: "champs", niveau: 1,
                titre: "Successeurs et prédécesseurs",
                enonce: "Dans le graphe orienté du CM1, donnez les ensembles suivants.",
                schema: gCM1or(),
                champs: [
                  { libelle: "`N⁺(6)`", reponse: "{3, 4, 5}", ensemble: true },
                  { libelle: "`N⁻(3)`", reponse: "{1, 6}", ensemble: true }
                ],
                explication: ["Arcs partant de 6 : `(6,3)`, `(6,4)`, `(6,5)`. Arcs arrivant en 3 : `(1,3)`, `(6,3)`."]
              },
              {
                type: "construire", niveau: 2,
                titre: "Tracer des arcs",
                enonce: "Tracez le graphe orienté de sommets `{1; 2; 3; 4}` et d'arcs `E = {(1,2); (2,3); (3,1); (3,4); (4,2)}`.",
                graphe: { sommets: P_CARRE, oriente: true },
                attendu: "1>2 2>3 3>1 3>4 4>2",
                explication: ["L'arc `(i, j)` part de i et arrive en j : on clique i puis j."]
              },
              {
                type: "qcm", niveau: 2,
                titre: "Lecture du graphe du TD1",
                enonce: "Pour le graphe orienté du TD1, quelles affirmations sont vraies ?",
                schema: gTD1or(),
                choix: [
                  "8 n'a aucun prédécesseur.",
                  "5 et 6 sont chacun successeur et prédécesseur de l'autre.",
                  "`d(3) = 4`.",
                  "`N(6) = {3; 5; 7; 8}`."
                ],
                reponse: [0, 1, 3],
                explication: ["`d⁻(8) = 0`. Les arcs `(5,6)` et `(6,5)` existent. `d(3) = d⁺(3) + d⁻(3) = 4 + 2 = 6`. `N⁺(6) = {5; 7}`, `N⁻(6) = {3; 5; 7; 8}`, d'où `N(6) = {3; 5; 7; 8}`."]
              },
              {
                type: "construire", niveau: 3,
                titre: "Des demi-degrés imposés",
                enonce: [
                  "Construisez un graphe orienté sur `{1; 2; 3; 4}` tel que :",
                  ["`d⁺(1) = 2`, `d⁻(1) = 0` ;", "`d⁺(2) = 1`, `d⁻(2) = 1` ;", "`d⁺(3) = 1`, `d⁻(3) = 2` ;", "`d⁺(4) = 0`, `d⁻(4) = 1`."]
                ],
                graphe: { sommets: P_CARRE, oriente: true },
                regles: [{ regle: "demiDegres", valeurs: "1:2/0 2:1/1 3:1/2 4:0/1" }],
                solution: "1>2 1>3 2>3 3>4",
                indice: "1 n'a que des arcs sortants et 4 que des arcs entrants. Il faut `∑ d⁺ = 4` arcs.",
                explication: ["Par exemple `(1,2)`, `(1,3)`, `(2,3)`, `(3,4)`."]
              },
              {
                type: "champs", niveau: 3,
                titre: "Compter des arcs",
                enonce: "Un graphe orienté a 6 sommets, et chacun a exactement 2 successeurs.",
                schema: oriente("1 2 3 4 5 6", "1>2 1>3 2>3 2>4 3>4 3>5 4>5 4>6 5>6 5>1 6>1 6>2", { disposition: "cercle", legende: "Un exemple : chaque sommet pointe vers les deux suivants" }),
                champs: [
                  { libelle: "Nombre d'arcs", reponse: 12, tolerance: 0 },
                  { libelle: "Moyenne des `d⁻(i)`", reponse: 2, tolerance: 0 }
                ],
                explication: ["`|E| = ∑ d⁺(i) = 6 × 2 = 12`, et `∑ d⁻(i) = |E| = 12`, soit une moyenne de `12 / 6 = 2`."]
              },
              {
                type: "champs", niveau: 4,
                titre: "Un tournoi",
                enonce: [
                  "Cinq joueurs s'affrontent : chaque paire joue un seul match, sans match nul. On trace l'arc `(i, j)` si i a battu j.",
                  "Quatre joueurs ont gagné respectivement 3, 2, 2 et 1 matchs. Combien de matchs a gagné le cinquième ?"
                ],
                schema: oriente("1 2 3 4 5", "", { disposition: "cercle" }),
                champs: [
                  { libelle: "Nombre total de matchs (arcs)", reponse: 10, tolerance: 0 },
                  { libelle: "Victoires du cinquième joueur", reponse: 2, tolerance: 0 }
                ],
                explication: ["Une arête par paire : `5 × 4 / 2 = 10` matchs. Les victoires sont les `d⁺` : `∑ d⁺(i) = 10`, donc le cinquième a `10 − (3 + 2 + 2 + 1) = 2` victoires."]
              },
              {
                type: "construire", niveau: 4,
                titre: "Un tournoi parfaitement équilibré",
                enonce: "Construisez un tournoi entre 5 joueurs (un arc entre chaque paire, du vainqueur vers le perdant) où **chaque joueur gagne exactement 2 matchs**.",
                graphe: { sommets: "1 2 3 4 5", disposition: "cercle", oriente: true },
                regles: [{ regle: "tournoi" }, { regle: "demiDegres", valeurs: "1:2/2 2:2/2 3:2/2 4:2/2 5:2/2" }],
                solution: "1>2 1>3 2>3 2>4 3>4 3>5 4>5 4>1 5>1 5>2",
                indice: "Faites battre à chacun les deux joueurs qui le suivent sur le cercle.",
                explication: ["Le joueur i bat i + 1 et i + 2 (en tournant) : 2 victoires et 2 défaites chacun, et chaque paire joue une fois."]
              }
            ]
          },

          /* ---------- Leçon 2.2 ---------- */
          {
            type: "lecon",
            id: "gm-chemins",
            titre: "Chemins et circuits",
            description: "Suivre les flèches : chemin, circuit, élémentaire, et prouver une impossibilité.",
            cours: [
              {
                titre: "Un chemin",
                texte: [
                  "Dans un graphe orienté, un **chemin** de `i₀` à `iℓ` est une suite `(i₀, i₁, …, iℓ)` telle que chaque `(iₖ₋₁, iₖ)` est un **arc** : on suit les flèches dans leur sens.",
                  "Sa **longueur** est son nombre d'arcs."
                ],
                schema: gCM1or({ marques: { "1>2": "a", "2>4": "a", "4>6": "a", 1: "a", 2: "a", 4: "a", 6: "a" }, legende: "μ₁ = (1, 2, 4, 6)" }),
                redaction: ["`μ₁ = (1, 2, 4, 6)` est un chemin de longueur 3 : `(1,2)`, `(2,4)` et `(4,6)` sont des arcs."]
              },
              {
                titre: "Simple, élémentaire",
                texte: [
                  "Mêmes définitions que pour les chaînes :",
                  ["**simple** : pas deux fois le même arc ;", "**élémentaire** : pas deux fois le même sommet."]
                ],
                schema: gCM1or({ marques: { "2>4": "a", "4>5": "a", 2: "a", 4: "a", 5: "a" }, legende: "μ₂ = (2, 4, 5)" }),
                redaction: ["`μ₂ = (2, 4, 5)` est un chemin de longueur 2 ; `μ₁` et `μ₂` sont des chemins simples (et même élémentaires)."]
              },
              {
                titre: "Un circuit",
                texte: [
                  "Un **circuit** est un chemin qui revient à son point de départ : `i₀ = iℓ`.",
                  "Il est élémentaire s'il ne repasse par aucun sommet intermédiaire. Dans un graphe orienté, `(i, j, i)` est un circuit de longueur 2 dès que les deux arcs existent."
                ],
                schema: gCM1or({ marques: { "3>4": "a", "4>6": "a", "6>3": "a" }, legende: "μ₃ = (3, 4, 6, 3)" }),
                redaction: ["`μ₃ = (3, 4, 6, 3)` est un circuit élémentaire de longueur 3."]
              },
              {
                titre: "Un circuit non élémentaire",
                texte: ["On peut tourner plusieurs fois dans un circuit : la longueur s'additionne."],
                schema: gCM1or({ marques: { "3>4": "b", "4>6": "b", "6>3": "b" }, legende: "μ₄ = (3, 4, 6, 3, 4, 6, 3)" }),
                redaction: ["`μ₄ = (3, 4, 6, 3, 4, 6, 3)` est un circuit de longueur 6, qui n'est pas élémentaire."]
              },
              {
                titre: "Chaîne ≠ chemin",
                texte: [
                  "Si l'on oublie le sens des flèches, on obtient des **chaînes**. Une chaîne d'un graphe orienté n'est pas forcément un chemin.",
                  "Cette distinction sépare la connexité (chaînes) de la forte connexité (chemins), au chapitre suivant."
                ],
                schema: gCM1or({ marques: { "4>5": "d", "3>4": "d", 3: "a", 4: "a", 5: "a" }, legende: "(5, 4, 3) remonte les flèches" }),
                redaction: ["`(5, 4, 3)` est une chaîne (les arcs `(4,5)` et `(3,4)` relient ces sommets) mais pas un chemin : `(5,4)` et `(4,3)` ne sont pas des arcs."]
              }
            ],
            problematique: {
              texte: [
                "Dans une ville à sens uniques, ou dans un système où chaque service ne peut contacter que certains autres, peut-on aller d'un point à un autre en respectant les sens ?",
                "Peut-on revenir à son point de départ ? Quelle est la plus longue tournée possible sans repasser au même endroit ?"
              ],
              schema: gTD1or()
            },
            exemple: {
              texte: ["Dans le graphe orienté du TD1 (exercice 4, questions 4 et 5) :"],
              schema: gTD1or(),
              questions: [
                "Donner un chemin élémentaire de longueur 4, puis un chemin élémentaire de longueur 6.",
                "Existe-t-il un chemin élémentaire de longueur 7 ?",
                "Donner un circuit de longueur 4. Existe-t-il un circuit élémentaire de longueur au moins 5 ?",
                "Donner un circuit de longueur 7."
              ]
            },
            correction: {
              texte: [
                { titre: "1. Chemins élémentaires" },
                { redaction: ["`(1, 2, 3, 5, 6)` : arcs `(1,2)`, `(2,3)`, `(3,5)`, `(5,6)`, sommets distincts, longueur 4.", "`(4, 1, 2, 3, 5, 6, 7)` : longueur 6, sept sommets distincts."] },
                { schema: gTD1or({ marques: { "4>1": "a", "1>2": "a", "2>3": "a", "3>5": "a", "5>6": "a", "6>7": "a" }, legende: "(4, 1, 2, 3, 5, 6, 7)" }) },
                { titre: "2. Pas de chemin élémentaire de longueur 7" },
                {
                  redaction: [
                    "Un chemin élémentaire de longueur 7 passerait par les 8 sommets, donc par 8.",
                    "8 n'a aucun prédécesseur : il serait le premier sommet. Son seul successeur est 6, et depuis `{5; 6; 7}` aucun arc ne mène à `{1; 2; 3; 4}` (les arcs sortants de 5, 6, 7 sont `(5,6)`, `(6,5)`, `(6,7)`, `(7,6)`).",
                    "Le chemin ne pourrait jamais atteindre 1, 2, 3 ou 4 : contradiction. Il n'existe pas de chemin élémentaire de longueur 7."
                  ]
                },
                { titre: "3. Circuits" },
                {
                  redaction: [
                    "`(1, 2, 3, 4, 1)` est un circuit de longueur 4.",
                    "Un circuit ne peut pas passer de `{1; 2; 3; 4}` à `{5; 6; 7}` puis revenir (aucun arc de retour), et 8 n'a pas de prédécesseur. Un circuit élémentaire reste donc dans `{1; 2; 3; 4}` ou dans `{5; 6; 7}` : au plus 4 sommets, longueur au plus 4. **Aucun circuit élémentaire de longueur ≥ 5.**"
                  ]
                },
                { titre: "4. Circuit de longueur 7" },
                { redaction: ["`(1, 2, 3, 4, 1, 3, 4, 1)` : on enchaîne le circuit de longueur 4 et le circuit `(1, 3, 4, 1)` de longueur 3, soit 7 arcs."] }
              ]
            },
            exercices: [
              {
                type: "ordre", niveau: 1,
                titre: "Un chemin de longueur 2",
                enonce: "Dans le graphe orienté du CM1, cliquez un chemin de longueur 2 allant de 1 à 5.",
                graphe: { sommets: P_CM1_OR, aretes: A_CM1_OR, oriente: true },
                regles: [{ regle: "chaine", de: "1", vers: "5", longueur: 2 }],
                solution: "1 2 5",
                explication: ["`(1, 2, 5)` : `(1,2)` et `(2,5)` sont des arcs."]
              },
              {
                type: "qcm", niveau: 1,
                titre: "Chemin ou pas ?",
                enonce: "Dans le graphe orienté du CM1, `(5, 4, 6)` est-il un chemin ?",
                schema: gCM1or(),
                choix: [
                  "Oui, de longueur 2.",
                  "Non : `(5, 4)` n'est pas un arc.",
                  "Non : `(4, 6)` n'est pas un arc."
                ],
                reponse: 1,
                explication: ["L'arc entre 4 et 5 va de 4 vers 5 : `(4,5)` existe, `(5,4)` non. `(4,6)` existe bien."]
              },
              {
                type: "ordre", niveau: 2,
                titre: "Chemin élémentaire de longueur 6",
                enonce: "Dans le graphe du TD1, cliquez un chemin élémentaire de longueur 6.",
                graphe: { sommets: P_TD1_OR, aretes: A_TD1_OR, oriente: true },
                regles: [{ regle: "chaine", longueur: 6, elementaire: true }],
                solution: "4 1 2 3 5 6 7",
                explication: ["Par exemple `(4, 1, 2, 3, 5, 6, 7)` : six arcs, sept sommets distincts."]
              },
              {
                type: "ordre", niveau: 2,
                titre: "Un circuit élémentaire de longueur 3",
                enonce: "Cliquez un circuit élémentaire de longueur 3 du graphe du TD1.",
                graphe: { sommets: P_TD1_OR, aretes: A_TD1_OR, oriente: true },
                regles: [{ regle: "chaine", ferme: true, elementaire: true, longueur: 3 }],
                solution: "1 3 4 1",
                explication: ["`(1, 3, 4, 1)` (ou ses rotations `(3, 4, 1, 3)`, `(4, 1, 3, 4)`) est le seul circuit élémentaire de longueur 3."]
              },
              {
                type: "ordre", niveau: 3,
                titre: "Un circuit de longueur 7",
                enonce: "Cliquez un circuit de longueur 7 du graphe du TD1 (il peut repasser par des sommets).",
                graphe: { sommets: P_TD1_OR, aretes: A_TD1_OR, oriente: true },
                regles: [{ regle: "chaine", ferme: true, longueur: 7 }],
                solution: "1 2 3 4 1 3 4 1",
                indice: "7 = 4 + 3 : enchaînez deux circuits qui passent par le même sommet.",
                explication: ["`(1, 2, 3, 4, 1, 3, 4, 1)`, ou une rotation comme `(3, 4, 1, 2, 3, 4, 1, 3)`. Dans `{5; 6; 7}`, il n'y a que des circuits de longueur 2 : on n'y obtient que des longueurs paires."]
              },
              {
                type: "qcm", niveau: 3,
                titre: "Chemin élémentaire de longueur 7 ?",
                enonce: "Dans le graphe du TD1, quel argument montre qu'il n'existe pas de chemin élémentaire de longueur 7 ?",
                schema: gTD1or(),
                choix: [
                  "Le graphe a 14 arcs, c'est trop peu.",
                  "Il passerait par 8, qui serait forcément le premier sommet ; or depuis 8 on ne peut plus atteindre 1, 2, 3, 4.",
                  "Il n'existe aucun circuit de longueur 7.",
                  "Le sommet 3 a trop de successeurs."
                ],
                reponse: 1,
                explication: ["Longueur 7 = 8 sommets = tous les sommets, dont 8, sans prédécesseur. Après 8 vient 6, et `{5; 6; 7}` n'a aucun arc vers `{1; 2; 3; 4}`. (Il existe pourtant des circuits de longueur 7, non élémentaires.)"]
              },
              {
                type: "champs", niveau: 4,
                titre: "Inventaire des circuits",
                enonce: "Combien le graphe du TD1 possède-t-il de circuits élémentaires (chaque circuit compté une fois, quel que soit son sommet de départ) ?",
                schema: gTD1or(),
                champs: [{ libelle: "Nombre de circuits élémentaires", reponse: 4, tolerance: 0 }],
                indice: "Un circuit reste dans `{1; 2; 3; 4}` ou dans `{5; 6; 7}`. Cherchez par longueur : 2, 3, 4.",
                explication: [
                  "Longueur 2 : `(5, 6, 5)` et `(6, 7, 6)`. Longueur 3 : `(1, 3, 4, 1)`. Longueur 4 : `(1, 2, 3, 4, 1)`.",
                  "Pas d'autre : dans `{5; 6; 7}`, ni `(7,5)` ni `(5,7)` n'existent. Total : **4** circuits élémentaires."
                ]
              },
              {
                type: "remettre", niveau: 4,
                titre: "Rédiger : un graphe sans circuit a une source",
                enonce: "Remettez dans l'ordre la preuve de : « tout graphe orienté fini sans circuit possède un sommet sans prédécesseur ».",
                etapes: [
                  "Supposons par l'absurde que tout sommet ait au moins un prédécesseur.",
                  "Partons d'un sommet `i₀`, choisissons un prédécesseur `i₁` de `i₀`, puis un prédécesseur `i₂` de `i₁`, et ainsi de suite.",
                  "Le graphe a n sommets : parmi `i₀, …, iₙ`, un sommet apparaît deux fois, `i_a = i_b` avec `a < b`.",
                  "Alors `(i_b, …, i_a)` est un circuit, car chaque `(iₖ₊₁, iₖ)` est un arc.",
                  "C'est impossible dans un graphe sans circuit : il existe donc un sommet sans prédécesseur. □"
                ],
                explication: ["On remonte les flèches ; un nombre fini de sommets force une répétition, donc un circuit. Ce résultat servira pour le graphe réduit (chapitre 3)."]
              }
            ]
          }
        ]
      }
    ]
  };
})();
