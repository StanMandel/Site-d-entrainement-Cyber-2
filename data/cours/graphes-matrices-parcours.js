/* =============================================================
   Introduction aux graphes et aux matrices — chapitres 7 et 8
   Parcours en profondeur, numérotations préfixe / suffixe et
   algorithme de Kosaraju-Sharir (CM3).
   Les tableaux de parcours suivent le format du CM3 (une ligne
   par sommet découvert) ; ils ont été produits par Graphes.profondeur.
   Complète CONTENU["graphes-matrices"] (voir graphes-matrices.js).
   ============================================================= */

(() => {
  const graphe = (sommets, aretes, plus) => Object.assign({ type: "graphe", sommets, aretes }, plus || {});
  const oriente = (sommets, arcs, plus) => Object.assign({ type: "graphe", oriente: true, sommets, aretes: arcs }, plus || {});
  const ENTETES = (lien) => ["nœud", "non explorés", "explorés", "ouverts", "fermés", lien];

  const P_9 = "1:0,1 2:1,0 3:1,1 4:1,2 5:2,0 6:2,1 7:2,2 8:3,1 9:3,2";
  const A_G1 = "1-2 1-3 1-4 2-3 2-5 2-6 4-6 5-6 6-7 6-8 6-9 7-9";
  const A_G2 = "1>2 1>3 1>4 2>5 2>6 3>2 6>4 6>5 6>8 7>6 7>9 9>6";
  const A_G2T = "2>1 3>1 4>1 5>2 6>2 2>3 4>6 5>6 8>6 6>7 9>7 6>9";
  const A_TD1 = "1-2 1-3 1-4 2-6 3-5 3-7 4-6 5-6 6-7 6-8 6-9 7-9";
  const P_TD1_OR = "1:0,0 4:1,0 5:2,0 2:0,1 3:1,1 6:2,1 8:3,1 7:2,2";
  const A_TD1_OR = "4>1 1>2 1>3 2>3 3>4 3>5 4>5 5>6 6>5 3>6 8>6 3>7 6>7 7>6";
  const A_TD1_OR_T = "1>4 2>1 3>1 3>2 4>3 5>3 5>4 6>5 5>6 6>3 6>8 7>3 7>6 6>7";
  const P_CM1 = "1:1,0 4:3,0 2:0,1 3:2,1 5:4,1";
  const A_CM1 = "1-2 1-3 1-5 2-3 2-4 3-5 4-5";
  const P_CM1_OR = "1:0,0 2:1,0 3:0,1 4:1,1 5:2,1 6:1,2";
  const A_CM1_OR = "1>2 1>3 2>1 2>4 2>5 3>4 4>5 4>6 6>3 6>4 6>5";
  const P_CM1_F6 = "1:0,0 2:1,0 3:0,1 4:1,1 5:2,1 6:1,2";
  const A_CM1_F6 = "1>2 2>1 1>3 2>4 4>5 4>6 6>4 5>6";
  const P_DIS = "1:0,0 5:1,0 7:0.5,0.9 8:2,0 4:3,0 2:0.5,2 3:1.5,2 6:1,2.9";
  const A_DIS = "1-5 1-7 2-3 2-6 3-6 4-8 5-7 5-8";
  const P_N3 = "1:0,0 4:1.2,0 2:0.6,1 5:1.8,1 3:1.2,2 6:2.4,2 7:1.8,3 8:3,3";
  const A_N3 = "1>4 2>1 2>5 3>2 3>6 4>2 5>4 6>5 7>3 7>8 8>6";
  const P_DAG = "1:0,1 2:1,0 3:1,2 4:2,1 6:2,2.2 5:3,1";
  const A_DAG = "1>2 1>3 2>4 3>4 4>5 3>6 6>5";
  const P_TOPO = "1:0,0 2:0,1.4 3:1.2,0 4:1.2,1.4 5:2.4,0.5 6:2.4,1.7 7:3.6,1";
  const A_TOPO = "1>3 2>3 2>4 3>5 4>5 4>6 5>7 6>7";
  const P_KEX = "1:0,0 2:1.2,0 3:0.6,1.1 4:2.5,0 5:3.7,0 6:3.1,1.1 7:4.9,0 8:4.9,1.1";
  const A_KEX = "1>2 2>3 3>1 2>4 4>5 5>6 6>4 6>7 7>8 8>7 3>5";
  const A_KEX_T = "2>1 3>2 1>3 4>2 5>4 6>5 4>6 7>6 8>7 7>8 5>3";
  const P_KBIG = "1:0,0 2:0,1.2 3:1.4,0 4:2.6,0 5:2,0.9 6:1.4,2.2 7:2.6,2.2 8:2,3.1 9:4,0.9 10:4,2.2";
  const A_KBIG = "1>2 2>1 2>3 3>4 4>5 5>3 5>6 6>7 7>8 8>6 5>9 9>10 10>9 8>10 1>6";

  const gG1 = (plus) => graphe(P_9, A_G1, plus);
  const gG2 = (plus) => oriente(P_9, A_G2, plus);
  const gTD1 = (plus) => graphe(P_9, A_TD1, plus);
  const gTD1or = (plus) => oriente(P_TD1_OR, A_TD1_OR, plus);
  const gKEX = (plus) => oriente(P_KEX, A_KEX, Object.assign({ courbes: { "3>5": 34 } }, plus || {}));

  /* Pseudo-codes du CM3 */
  const DFS_REC = `Explorer(graphe G, nœud j):
    marquer j comme 'exploré'
    pour tous les voisins k de j:
        si k est 'non exploré':
            Explorer(G, k)`;
  const DFS_IT = `Explorer(graphe G, nœud i):
    pile = [i]
    tant que la pile n'est pas vide:
        j = pile.dépiler()
        si j est 'non exploré':
            marquer j comme 'exploré'
            pour tous les voisins k de j:
                pile.empiler(k)`;

  CONTENU["graphes-matrices"].chapitres.push(

    /* =====================================================
       CHAPITRE 7 — PARCOURS EN PROFONDEUR
       ===================================================== */
    {
      id: "ch7",
      titre: "Chapitre 7 — Parcours en profondeur",
      description: "Explorer un graphe à la main : états, tableau du parcours, arbre couvrant, types d'arcs.",
      exercices: [

        /* ---------- Leçon 7.1 ---------- */
        {
          type: "lecon",
          id: "gm-profondeur",
          titre: "Parcours en profondeur d'un graphe non orienté",
          description: "Le DFS du CM3 : ordre numérique, ouverts et fermés, arbre couvrant, pile.",
          cours: [
            {
              titre: "Le principe : aller le plus loin possible",
              texte: [
                "Le **parcours en profondeur** (DFS, Depth-First Search) part d'un sommet i et suit une chaîne élémentaire tant qu'il trouve un voisin **non exploré**.",
                "Bloqué, il **revient en arrière** (« backtracking ») au sommet précédent et repart vers un autre voisin non exploré, s'il en reste.",
                "Règle du cours : quand plusieurs voisins sont non explorés, on choisit **le plus petit numéro**."
              ],
              schema: gG1({ marques: { 1: "a", 2: "a", 3: "a", "1-2": "a", "2-3": "a" }, legende: "Depuis 1 : 1 → 2 → 3, puis bloqué en 3" }),
              redaction: ["Depuis 1, le plus petit voisin est 2 ; depuis 2, le plus petit voisin non exploré est 3. Les voisins de 3 (1 et 2) sont explorés : on revient en 2."]
            },
            {
              titre: "Explorés, ouverts, fermés",
              texte: [
                "À chaque instant, un sommet est :",
                [
                  "**non exploré** s'il n'a jamais été visité ;",
                  "**exploré** dès qu'on l'a visité ; un sommet exploré est **ouvert** tant qu'il lui reste des voisins non explorés, **fermé** sinon."
                ],
                "On remonte vers le sommet précédent quand le sommet courant devient fermé. L'exploration depuis i est finie quand i est fermé."
              ],
              schema: gG1({ marques: { 1: "a", 2: "a", 5: "a", 3: "c", "1-2": "a", "2-3": "c", "2-5": "a" }, legende: "Après la visite de 5 : ouverts en bleu, fermés en vert" }),
              redaction: ["Juste après la découverte de 5 : explorés `{1; 2; 3; 5}`, ouverts `{1; 2; 5}`, fermés `{3}`."]
            },
            {
              titre: "Le tableau du parcours (CM3)",
              texte: [
                "On rédige le parcours sous forme de tableau : une ligne par sommet découvert, avec l'arête empruntée pour l'atteindre. Les ouverts sont écrits dans l'ordre de la chaîne courante, les fermés dans l'ordre de fermeture.",
                {
                  entetes: ENTETES("arêtes"),
                  lignes: [
                    ["/", "{1, …, 9}", "∅", "∅", "∅", "/"],
                    ["1", "{2, 3, 4, 5, 6, 7, 8, 9}", "{1}", "{1}", "∅", "/"],
                    ["2", "{3, 4, 5, 6, 7, 8, 9}", "{1, 2}", "{1, 2}", "∅", "{1,2}"],
                    ["3", "{4, 5, 6, 7, 8, 9}", "{1, 2, 3}", "{1, 2, 3}", "∅", "{2,3}"],
                    ["5", "{4, 6, 7, 8, 9}", "{1, 2, 3, 5}", "{1, 2, 5}", "{3}", "{2,5}"],
                    ["6", "{4, 7, 8, 9}", "{1, 2, 3, 5, 6}", "{1, 2, 5, 6}", "{3}", "{5,6}"],
                    ["4", "{7, 8, 9}", "{1, …, 6}", "{1, 2, 5, 6, 4}", "{3}", "{6,4}"],
                    ["7", "{8, 9}", "{1, …, 7}", "{1, 2, 5, 6, 7}", "{3, 4}", "{6,7}"],
                    ["9", "{8}", "{1, …, 7, 9}", "{1, 2, 5, 6, 7, 9}", "{3, 4}", "{7,9}"],
                    ["8", "∅", "{1, …, 9}", "{1, 2, 5, 6, 8}", "{3, 4, 9, 7}", "{6,8}"],
                    ["/", "∅", "{1, …, 9}", "∅", "{3, 4, 9, 7, 8, 6, 5, 2, 1}", "/"]
                  ]
                }
              ],
              schema: gG1({ legende: "Le graphe G₁ du CM3" }),
              redaction: [
                "L'ordre de parcours des sommets est `1-2-3-5-6-4-7-9-8`.",
                "La séquence d'arêtes empruntées est `{1,2}, {2,3}, {2,5}, {5,6}, {6,4}, {6,7}, {7,9}, {6,8}`."
              ]
            },
            {
              titre: "L'arbre couvrant du parcours",
              texte: [
                "Les sommets explorés depuis i et les arêtes empruntées forment un **arbre** : il contient exactement les sommets reliés à i par une chaîne.",
                "Si le graphe est connexe, c'est un **arbre couvrant**. Sinon, on relance le parcours depuis un sommet non exploré : on obtient **un arbre par composante connexe**."
              ],
              schema: gG1({ marques: { "1-2": "c", "2-3": "c", "2-5": "c", "5-6": "c", "4-6": "c", "6-7": "c", "7-9": "c", "6-8": "c" }, legende: "Les 8 arêtes empruntées forment un arbre couvrant" }),
              redaction: ["Le parcours a emprunté 8 arêtes pour 9 sommets, sans cycle (on n'emprunte jamais d'arête vers un sommet déjà exploré) : c'est un arbre couvrant de G₁, qui est donc connexe."]
            },
            {
              titre: "Implémentation : une pile",
              texte: [
                "La pile mémorise les sommets à visiter. Elle est implicite dans la version récursive, explicite dans la version itérative. Un tableau `Etat` de longueur n, initialisé à 0, marque les sommets explorés (`Etat[i] = 1`).",
                { code: DFS_REC, legende: "Version récursive" },
                { code: DFS_IT, legende: "Version itérative" },
                "Pour retrouver l'ordre de la version récursive, la version itérative doit **empiler les voisins par ordre décroissant** : le plus petit est ainsi au sommet de la pile."
              ],
              schema: gG1({ etiquettes: { 1: "1", 2: "2", 3: "3", 5: "4", 6: "5", 4: "6", 7: "7", 9: "8", 8: "9" }, legende: "Rang de découverte de chaque sommet" }),
              redaction: [
                "Avec des **listes d'adjacence**, chaque sommet est exploré une fois et chaque liste parcourue une fois : coût `O(n + m)` (n sommets, m arêtes).",
                "Avec une **matrice d'adjacence**, trouver les voisins d'un sommet coûte n cases : coût `O(n²)`. Les listes sont donc la représentation la plus appropriée (CM3, question 4)."
              ]
            }
          ],
          problematique: {
            texte: [
              "Un attaquant a compromis la machine 1 d'un réseau et se propage de proche en proche par les liens existants.",
              "Quelles machines peut-il atteindre ? Si l'équipe de défense rejoue sa propagation avec un parcours systématique, dans quel ordre découvre-t-elle les machines, et par quels liens ?"
            ],
            schema: gTD1({ marques: { 1: "d" }, legende: "Le réseau (graphe du TD1, exercice 1)" })
          },
          exemple: {
            texte: ["Faire le parcours en profondeur du graphe du TD1 depuis le sommet 1, en choisissant toujours le plus petit voisin non exploré."],
            schema: gTD1(),
            questions: [
              "Rédiger le tableau du parcours.",
              "Donner l'ordre de parcours des sommets et les arêtes empruntées.",
              "Dessiner l'arbre obtenu. Le graphe est-il connexe ?"
            ]
          },
          correction: {
            texte: [
              { titre: "1. Tableau" },
              {
                entetes: ENTETES("arêtes"),
                lignes: [
                  ["/", "{1, …, 9}", "∅", "∅", "∅", "/"],
                  ["1", "{2, 3, 4, 5, 6, 7, 8, 9}", "{1}", "{1}", "∅", "/"],
                  ["2", "{3, 4, 5, 6, 7, 8, 9}", "{1, 2}", "{1, 2}", "∅", "{1,2}"],
                  ["6", "{3, 4, 5, 7, 8, 9}", "{1, 2, 6}", "{1, 2, 6}", "∅", "{2,6}"],
                  ["4", "{3, 5, 7, 8, 9}", "{1, 2, 4, 6}", "{1, 2, 6, 4}", "∅", "{6,4}"],
                  ["5", "{3, 7, 8, 9}", "{1, 2, 4, 5, 6}", "{1, 2, 6, 5}", "{4}", "{6,5}"],
                  ["3", "{7, 8, 9}", "{1, …, 6}", "{1, 2, 6, 5, 3}", "{4}", "{5,3}"],
                  ["7", "{8, 9}", "{1, …, 7}", "{1, 2, 6, 5, 3, 7}", "{4}", "{3,7}"],
                  ["9", "{8}", "{1, …, 7, 9}", "{1, 2, 6, 5, 3, 7, 9}", "{4}", "{7,9}"],
                  ["8", "∅", "{1, …, 9}", "{1, 2, 6, 8}", "{4, 9, 7, 3, 5}", "{6,8}"],
                  ["/", "∅", "{1, …, 9}", "∅", "{4, 9, 7, 3, 5, 8, 6, 2, 1}", "/"]
                ]
              },
              {
                redaction: [
                  "Depuis 1, le plus petit voisin est 2 ; le seul voisin non exploré de 2 est 6. Les voisins de 6 sont 2, 4, 5, 7, 8, 9 : on prend 4, qui est aussitôt fermé (`N(4) = {1; 6}`).",
                  "De retour en 6, on prend 5, puis 3 (seul voisin libre de 5), puis 7, puis 9. 9 se ferme, puis 7, 3, 5 ; de retour en 6, il reste 8."
                ]
              },
              { titre: "2. Ordre et arêtes" },
              { redaction: ["Ordre de parcours : `1-2-6-4-5-3-7-9-8`.", "Arêtes empruntées : `{1,2}, {2,6}, {6,4}, {6,5}, {5,3}, {3,7}, {7,9}, {6,8}`."] },
              { titre: "3. Arbre" },
              { schema: gTD1({ marques: { "1-2": "c", "2-6": "c", "4-6": "c", "5-6": "c", "3-5": "c", "3-7": "c", "7-9": "c", "6-8": "c" }, legende: "L'arbre du parcours (en vert)" }) },
              { redaction: ["Un seul arbre contient les 9 sommets : l'attaquant atteint toutes les machines, le graphe est connexe."] }
            ]
          },
          exercices: [
            {
              type: "ordre", niveau: 1,
              titre: "Un premier parcours",
              enonce: "Cliquez les sommets dans l'ordre du parcours en profondeur depuis 1 (plus petit voisin non exploré d'abord).",
              graphe: { sommets: P_CM1, aretes: A_CM1 },
              regles: [{ regle: "parcours", depart: "1" }],
              explication: ["1 → 2 → 3 → 5 → 4 : 4 a tous ses voisins explorés, on remonte jusqu'à 1 sans rien trouver de neuf. Ordre `1-2-3-5-4`."]
            },
            {
              type: "qcm", niveau: 1,
              titre: "Ouvert ou fermé ?",
              enonce: "Pendant un parcours en profondeur, quand un sommet exploré devient-il fermé ?",
              schema: gG1({ marques: { 3: "c" } }),
              choix: [
                "Dès qu'il est découvert.",
                "Quand tous ses voisins sont explorés.",
                "Quand le parcours est terminé."
              ],
              reponse: 1,
              explication: ["Un sommet exploré reste ouvert tant qu'il lui reste un voisin non exploré. Dans la version récursive, `Explorer(G, j)` se termine exactement quand j est fermé."]
            },
            {
              type: "ordre", niveau: 2,
              titre: "Changer de départ",
              enonce: "Parcours en profondeur du graphe G₁ du CM3, cette fois **depuis 5** : cliquez les sommets dans l'ordre de découverte.",
              graphe: { sommets: P_9, aretes: A_G1 },
              regles: [{ regle: "parcours", depart: "5" }],
              explication: ["5 → 2 → 1 → 3 (3 fermé) ; retour en 1 → 4 → 6 → 7 → 9 (fermé) ; retour en 6 → 8. Ordre `5-2-1-3-4-6-7-9-8`."]
            },
            {
              type: "selection", cible: "aretes", niveau: 2,
              titre: "L'arbre du parcours",
              enonce: "Sélectionnez les arêtes empruntées par le parcours en profondeur du graphe du TD1 depuis 1.",
              graphe: { sommets: P_9, aretes: A_TD1 },
              nomEnsemble: "T",
              attendu: "1-2 2-6 4-6 5-6 3-5 3-7 7-9 6-8",
              explication: ["Ce sont les arêtes de la colonne « arêtes » du tableau : `{1,2}, {2,6}, {6,4}, {6,5}, {5,3}, {3,7}, {7,9}, {6,8}`."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Lire l'état du parcours",
              enonce: "Dans le parcours du graphe du TD1 depuis 1, donnez l'état **juste après la découverte du sommet 3**.",
              schema: gTD1(),
              champs: [
                { libelle: "Ouverts", reponse: "{1, 2, 6, 5, 3}", ensemble: true },
                { libelle: "Fermés", reponse: "{4}", ensemble: true },
                { libelle: "Non explorés", reponse: "{7, 8, 9}", ensemble: true }
              ],
              explication: ["La chaîne courante est `1 − 2 − 6 − 5 − 3` : tous ouverts. Seul 4 a déjà été fermé. Restent 7, 8, 9."]
            },
            {
              type: "ordre", niveau: 3,
              titre: "Un graphe en plusieurs morceaux",
              enonce: "Faites le parcours en profondeur **complet** de ce graphe depuis 1 : quand l'exploration s'arrête, repartez du plus petit sommet non exploré. Cliquez les sommets dans l'ordre de découverte.",
              graphe: { sommets: P_DIS, aretes: A_DIS },
              regles: [{ regle: "parcours", depart: "1" }],
              explication: [
                "Depuis 1 : 1 → 5 → 7 (fermé) → 8 → 4. Le premier arbre couvre `{1; 4; 5; 7; 8}`.",
                "On repart de 2 : 2 → 3 → 6. Ordre `1-5-7-8-4-2-3-6` : deux arbres, donc deux composantes connexes."
              ]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Version itérative",
              enonce: "Dans la version itérative (pile explicite), dans quel ordre faut-il empiler les voisins de j pour obtenir le même ordre de parcours que la version récursive ?",
              schema: graphe(P_CM1, A_CM1, { marques: { 1: "a" }, etiquettes: { 2: "1ᵉʳ", 3: "2ᵉ", 5: "3ᵉ" }, legende: "Voisins de 1 à visiter : 2, puis 3, puis 5" }),
              choix: ["Par ordre croissant.", "Par ordre décroissant.", "L'ordre n'a pas d'importance."],
              reponse: 1,
              explication: ["Une pile rend en premier le **dernier** élément empilé. Pour dépiler d'abord le plus petit voisin, il faut l'empiler en dernier : on empile par ordre décroissant (5, 3, puis 2)."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Combien de passages dans la pile ?",
              enonce: "On exécute la version **itérative** du CM3 sur le graphe G₁ depuis 1. Au total, combien de fois un sommet est-il empilé (en comptant l'empilement initial de 1) ? Et combien de fois un sommet est-il dépilé alors qu'il est déjà exploré ?",
              schema: gG1(),
              champs: [
                { libelle: "Nombre d'empilements", reponse: 25, tolerance: 0 },
                { libelle: "Dépilements inutiles", reponse: 16, tolerance: 0 }
              ],
              indice: "Chaque sommet est marqué une seule fois ; à ce moment, il empile tous ses voisins. Utilisez le lemme des poignées de main.",
              explication: [
                "Chaque sommet j est marqué une fois et empile alors ses `d(j)` voisins : `1 + ∑ d(j) = 1 + 2|E| = 1 + 2 × 12 = 25` empilements.",
                "La boucle tourne jusqu'à vider la pile : 25 dépilements, dont 9 marquent un nouveau sommet. Les `25 − 9 = 16` autres trouvent un sommet déjà exploré. Le coût total reste en `O(n + m)`."
              ]
            }
          ]
        },

        /* ---------- Leçon 7.2 ---------- */
        {
          type: "lecon",
          id: "gm-profondeur-oriente",
          titre: "Parcours d'un graphe orienté et types d'arcs",
          description: "Successeurs, arborescences, arcs d'arbre, avant, arrière et croisés.",
          cours: [
            {
              titre: "On suit les successeurs",
              texte: [
                "Dans un graphe orienté, le parcours en profondeur explore les **successeurs** au lieu des voisins : il suit un chemin élémentaire tant qu'il trouve un successeur non exploré.",
                "Depuis i, il atteint exactement les sommets accessibles **par un chemin** depuis i ; les arcs empruntés forment une **arborescence de racine i**."
              ],
              schema: gG2({ marques: { 1: "a", 2: "a", 5: "a", "1>2": "a", "2>5": "a" }, legende: "G₂ (CM3) : 1 → 2 → 5, et 5 n'a pas de successeur" }),
              redaction: ["Depuis 1, le plus petit successeur est 2, puis 5. `N⁺(5) = ∅` : 5 est fermé immédiatement, on revient en 2."]
            },
            {
              titre: "Plusieurs arborescences",
              texte: [
                "S'il reste des sommets non explorés quand la racine est fermée, on **recommence** depuis le plus petit d'entre eux.",
                {
                  entetes: ENTETES("arcs"),
                  lignes: [
                    ["/", "{1, …, 9}", "∅", "∅", "∅", "/"],
                    ["1", "{2, …, 9}", "{1}", "{1}", "∅", "/"],
                    ["2", "{3, 4, 5, 6, 7, 8, 9}", "{1, 2}", "{1, 2}", "∅", "(1,2)"],
                    ["5", "{3, 4, 6, 7, 8, 9}", "{1, 2, 5}", "{1, 2, 5}", "∅", "(2,5)"],
                    ["6", "{3, 4, 7, 8, 9}", "{1, 2, 5, 6}", "{1, 2, 6}", "{5}", "(2,6)"],
                    ["4", "{3, 7, 8, 9}", "{1, 2, 4, 5, 6}", "{1, 2, 6, 4}", "{5}", "(6,4)"],
                    ["8", "{3, 7, 9}", "{1, 2, 4, 5, 6, 8}", "{1, 2, 6, 8}", "{5, 4}", "(6,8)"],
                    ["3", "{7, 9}", "{1, …, 6, 8}", "{1, 3}", "{5, 4, 8, 6, 2}", "(1,3)"],
                    ["/", "{7, 9}", "{1, …, 6, 8}", "∅", "{5, 4, 8, 6, 2, 3, 1}", "/"],
                    ["7", "{9}", "{1, …, 8}", "{7}", "{5, 4, 8, 6, 2, 3, 1}", "/"],
                    ["9", "∅", "{1, …, 9}", "{7, 9}", "{5, 4, 8, 6, 2, 3, 1}", "(7,9)"],
                    ["/", "∅", "{1, …, 9}", "∅", "{5, 4, 8, 6, 2, 3, 1, 9, 7}", "/"]
                  ]
                }
              ],
              schema: gG2({ marques: { "1>2": "c", "2>5": "c", "2>6": "c", "6>4": "c", "6>8": "c", "1>3": "c", "7>9": "c" }, legende: "Arcs empruntés (en vert)" }),
              redaction: ["Ordre de parcours de G₂ : `1-2-5-6-4-8-3-7-9`. Arcs empruntés : `(1,2), (2,5), (2,6), (6,4), (6,8), (1,3), (7,9)`."]
            },
            {
              titre: "Les arborescences obtenues",
              texte: ["Le parcours de G₂ produit **deux** arborescences : l'une de racine 1, l'autre de racine 7. Ce ne sont pas des composantes : 7 atteint 6 mais 6 était déjà exploré."],
              schema: oriente("1:0,0 2:1,0 5:2,0 3:1,1 6:2,1 4:3,1 8:3,2 7:4.2,0 9:5.2,0", "1>2 2>5 1>3 2>6 6>4 6>8 7>9", { legende: "Arborescences de racines 1 et 7 (CM3, figure 4)" }),
              redaction: ["Racine 1 : `{1; 2; 3; 4; 5; 6; 8}` ; racine 7 : `{7; 9}`."]
            },
            {
              titre: "Quatre types d'arcs",
              texte: [
                "Après le parcours, chaque arc `(i, j)` est :",
                [
                  "un **arc d'arbre** s'il a été emprunté ;",
                  "un **arc avant** sinon, si j est un **descendant** de i dans les arborescences ;",
                  "un **arc arrière** si j est un **ancêtre** de i ;",
                  "un **arc croisé** si i et j n'ont pas de lien de parenté (dans la même arborescence ou non)."
                ]
              ],
              schema: gG2({ marques: { "1>2": "c", "2>5": "c", "2>6": "c", "6>4": "c", "6>8": "c", "1>3": "c", "7>9": "c", "1>4": "b", "7>6": "d", "9>6": "d", "3>2": "d", "6>5": "d" }, legende: "Vert : arbre ; orange : avant ; rouge : croisés" }),
              redaction: [
                "Arcs d'arbre : `(1,2), (1,3), (2,5), (2,6), (6,4), (6,8), (7,9)`.",
                "Arc avant : `(1,4)` (4 descend de 1 par 2 et 6). Arcs arrière : aucun.",
                "Arcs croisés : `(7,6), (9,6), (3,2), (6,5)`."
              ]
            },
            {
              titre: "Arc arrière ⟺ circuit",
              texte: [
                "Un arc arrière `(i, j)` va vers un ancêtre j : le chemin d'arbre de j à i, suivi de `(i, j)`, forme un **circuit**.",
                "Réciproquement, un graphe qui a un circuit donne toujours un arc arrière. Le parcours détecte donc les circuits."
              ],
              schema: oriente("1:0,0 2:1,0 3:2,0 4:3,0", "1>2 2>3 3>4 4>2", { marques: { "1>2": "c", "2>3": "c", "3>4": "c", "4>2": "d" }, legende: "(4,2) est arrière : circuit (2, 3, 4, 2)" }),
              redaction: ["Depuis 1 : arcs d'arbre `(1,2), (2,3), (3,4)`. L'arc `(4,2)` mène à l'ancêtre 2 : arc arrière, d'où le circuit `(2, 3, 4, 2)`."]
            }
          ],
          problematique: {
            texte: [
              "Un ver informatique se propage le long de connexions à sens unique : un arc `(A, B)` signifie que A peut infecter B.",
              "Depuis la machine 1, quelles machines sont touchées ? Le ver peut-il revenir sur une machine déjà infectée, et par quels arcs ?"
            ],
            schema: gTD1or({ marques: { 1: "d" } })
          },
          exemple: {
            texte: ["Faire le parcours en profondeur complet du graphe orienté du TD1 depuis 1 (plus petit successeur d'abord), puis classer tous les arcs."],
            schema: gTD1or(),
            questions: [
              "Rédiger le tableau du parcours et donner l'ordre de parcours.",
              "Quelles sont les arborescences obtenues ?",
              "Classer chaque arc : arbre, avant, arrière ou croisé. Le graphe a-t-il des circuits ?"
            ]
          },
          correction: {
            texte: [
              { titre: "1. Tableau" },
              {
                entetes: ENTETES("arcs"),
                lignes: [
                  ["/", "{1, …, 8}", "∅", "∅", "∅", "/"],
                  ["1", "{2, …, 8}", "{1}", "{1}", "∅", "/"],
                  ["2", "{3, …, 8}", "{1, 2}", "{1, 2}", "∅", "(1,2)"],
                  ["3", "{4, …, 8}", "{1, 2, 3}", "{1, 2, 3}", "∅", "(2,3)"],
                  ["4", "{5, 6, 7, 8}", "{1, 2, 3, 4}", "{1, 2, 3, 4}", "∅", "(3,4)"],
                  ["5", "{6, 7, 8}", "{1, …, 5}", "{1, 2, 3, 4, 5}", "∅", "(4,5)"],
                  ["6", "{7, 8}", "{1, …, 6}", "{1, …, 6}", "∅", "(5,6)"],
                  ["7", "{8}", "{1, …, 7}", "{1, …, 7}", "∅", "(6,7)"],
                  ["/", "{8}", "{1, …, 7}", "∅", "{7, 6, 5, 4, 3, 2, 1}", "/"],
                  ["8", "∅", "{1, …, 8}", "{8}", "{7, 6, 5, 4, 3, 2, 1}", "/"],
                  ["/", "∅", "{1, …, 8}", "∅", "{7, 6, 5, 4, 3, 2, 1, 8}", "/"]
                ]
              },
              { redaction: ["Depuis 1 : 2, puis 3 (seul successeur de 2), puis 4 (plus petit successeur de 3), puis 5 (`N⁺(4) = {1; 5}`, 1 est exploré), 6, 7. Tout se ferme en remontant. On repart de 8, dont le seul successeur 6 est exploré.", "Ordre : `1-2-3-4-5-6-7-8`."] },
              { titre: "2. Arborescences" },
              { redaction: ["Racine 1 : la chaîne `1 → 2 → 3 → 4 → 5 → 6 → 7`. Racine 8 : `{8}` seul."] },
              { titre: "3. Classement des arcs" },
              {
                redaction: [
                  "Arcs d'arbre : `(1,2), (2,3), (3,4), (4,5), (5,6), (6,7)`.",
                  "Arcs avant : `(1,3), (3,5), (3,6), (3,7)` (vers un descendant).",
                  "Arcs arrière : `(4,1), (6,5), (7,6)` (vers un ancêtre).",
                  "Arc croisé : `(8,6)` (deux arborescences différentes).",
                  "Il y a des arcs arrière : le graphe a des circuits, par exemple `(1, 2, 3, 4, 1)` grâce à `(4,1)`. Le ver peut revenir sur une machine infectée."
                ]
              },
              { schema: gTD1or({ marques: { "1>2": "c", "2>3": "c", "3>4": "c", "4>5": "c", "5>6": "c", "6>7": "c", "1>3": "b", "3>5": "b", "3>6": "b", "3>7": "b", "4>1": "d", "6>5": "d", "7>6": "d", "8>6": "a" }, legende: "Vert : arbre ; orange : avant ; rouge : arrière ; bleu : croisé" }) }
            ]
          },
          exercices: [
            {
              type: "ordre", niveau: 1,
              titre: "Parcours orienté",
              enonce: "Cliquez l'ordre du parcours en profondeur du graphe orienté du CM1 depuis 1 (plus petit successeur d'abord).",
              graphe: { sommets: P_CM1_OR, aretes: A_CM1_OR, oriente: true },
              regles: [{ regle: "parcours", depart: "1" }],
              explication: ["1 → 2 → 4 (1 déjà exploré) → 5 (fermé : aucun successeur) → 6 → 3 (son successeur 4 est exploré). Ordre `1-2-4-5-6-3`."]
            },
            {
              type: "qcm", niveau: 1,
              titre: "Nommer un arc",
              enonce: "Un arc `(i, j)` n'a pas été emprunté par le parcours, et j est un descendant de i dans l'arborescence. C'est un arc…",
              schema: gG2({ marques: { "1>4": "b" } }),
              choix: ["d'arbre", "avant", "arrière", "croisé"],
              reponse: 1,
              explication: ["Vers un descendant sans avoir été emprunté : arc **avant**, comme `(1,4)` dans G₂."]
            },
            {
              type: "ordre", niveau: 2,
              titre: "Retrouver le parcours du CM3",
              enonce: "Cliquez l'ordre du parcours en profondeur **complet** de G₂ depuis 1.",
              graphe: { sommets: P_9, aretes: A_G2, oriente: true },
              regles: [{ regle: "parcours", depart: "1" }],
              explication: ["`1-2-5-6-4-8-3-7-9` : la première arborescence couvre `{1; 2; 3; 4; 5; 6; 8}`, la seconde part de 7."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Classer des arcs",
              enonce: "Pour le parcours du graphe du TD1 depuis 1 (voir l'onglet Correction), donnez le type de chaque arc (arbre, avant, arrière ou croisé).",
              schema: gTD1or(),
              champs: [
                { libelle: "`(4,1)`", reponse: "arrière", accepte: ["arc arrière"] },
                { libelle: "`(8,6)`", reponse: "croisé", accepte: ["arc croisé"] },
                { libelle: "`(3,6)`", reponse: "avant", accepte: ["arc avant"] },
                { libelle: "`(5,6)`", reponse: "arbre", accepte: ["arc d'arbre", "d'arbre"] }
              ],
              explication: ["1 est un ancêtre de 4 ; 8 et 6 sont dans deux arborescences différentes ; 6 descend de 3 par `(3,4), (4,5), (5,6)` ; `(5,6)` a été emprunté."]
            },
            {
              type: "ordre", niveau: 3,
              titre: "Trois arborescences",
              enonce: "Cliquez l'ordre du parcours en profondeur complet de ce graphe depuis 1 (plus petit successeur d'abord, puis plus petit sommet non exploré pour chaque nouvelle racine).",
              graphe: { sommets: P_N3, aretes: A_N3, oriente: true },
              regles: [{ regle: "parcours", depart: "1" }],
              explication: [
                "Depuis 1 : 1 → 4 → 2 → 5 (5 n'a que 4 comme successeur, déjà exploré). Première arborescence `{1; 2; 4; 5}`.",
                "On repart de 3 : 3 → 6 (2 et 5 sont explorés). Puis de 7 : 7 → 8. Ordre `1-4-2-5-3-6-7-8`."
              ]
            },
            {
              type: "selection", cible: "aretes", niveau: 3,
              titre: "Les arcs d'arbre",
              enonce: "Sélectionnez les arcs d'arbre du parcours complet du graphe précédent.",
              graphe: { sommets: P_N3, aretes: A_N3, oriente: true },
              nomEnsemble: "T",
              attendu: "1>4 4>2 2>5 3>6 7>8",
              explication: ["`(1,4), (4,2), (2,5)` pour la racine 1, `(3,6)` pour la racine 3, `(7,8)` pour la racine 7."]
            },
            {
              type: "qcm", niveau: 4,
              titre: "Détecter un circuit",
              enonce: "Un parcours en profondeur complet d'un graphe orienté ne produit **aucun arc arrière**. Que peut-on conclure ?",
              schema: gG2({ legende: "G₂ : aucun arc arrière" }),
              choix: [
                "Le graphe est sans circuit.",
                "Le graphe est fortement connexe.",
                "Rien : un autre ordre de parcours pourrait en produire."
              ],
              reponse: 0,
              explication: [
                "S'il existait un circuit, soit j son premier sommet découvert et i le sommet du circuit qui précède j. Pendant l'exploration de j, tous les sommets du circuit sont atteints, donc i devient un descendant de j ; l'arc `(i, j)` est alors un arc arrière.",
                "Sans arc arrière, il n'y a donc aucun circuit — quel que soit l'ordre de parcours. C'est le cas de G₂."
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Changer de racine",
              enonce: "On refait le parcours complet de G₂ en partant de **9** (puis plus petit sommet non exploré). Combien d'arborescences obtient-on, et quelle est celle de racine 9 ?",
              schema: gG2(),
              champs: [
                { libelle: "Nombre d'arborescences", reponse: 3, tolerance: 0 },
                { libelle: "Sommets de l'arborescence de racine 9", reponse: "{9, 6, 4, 5, 8}", ensemble: true }
              ],
              explication: ["Depuis 9 : 6, puis 4, 5, 8. On repart de 1 : 2 et 3 (5, 6, 4 sont déjà explorés). On repart de 7 : rien de neuf. Trois arborescences : `{9; 6; 4; 5; 8}`, `{1; 2; 3}`, `{7}`."]
            }
          ]
        }
      ]
    },

    /* =====================================================
       CHAPITRE 8 — COMPOSANTES FORTEMENT CONNEXES
       ===================================================== */
    {
      id: "ch8",
      titre: "Chapitre 8 — Composantes fortement connexes",
      description: "Numérotations préfixe et suffixe, ordre topologique, algorithme de Kosaraju-Sharir.",
      exercices: [

        /* ---------- Leçon 8.1 ---------- */
        {
          type: "lecon",
          id: "gm-numerotation",
          titre: "Numérotations préfixe et suffixe",
          description: "Ordre d'ouverture, ordre de fermeture, et l'ordre topologique qui en découle.",
          cours: [
            {
              titre: "Numérotation préfixe : l'ordre d'ouverture",
              texte: ["Pendant le parcours, la **numérotation préfixe** donne à chaque sommet son rang de **découverte** (d'ouverture). C'est l'ordre de parcours."],
              schema: gG2({ etiquettes: { 1: "1", 2: "2", 5: "3", 6: "4", 4: "5", 8: "6", 3: "7", 7: "8", 9: "9" }, legende: "Préfixe des sommets de G₂" }),
              redaction: ["Ordre de parcours de G₂ : `1-2-5-6-4-8-3-7-9`, donc `pre(1) = 1`, `pre(2) = 2`, `pre(5) = 3`, …, `pre(9) = 9`."]
            },
            {
              titre: "Numérotation suffixe : l'ordre de fermeture",
              texte: ["La **numérotation suffixe** donne à chaque sommet son rang de **fermeture**. Elle se lit dans la colonne « fermés » de la dernière ligne du tableau."],
              schema: gG2({ etiquettes: { 5: "1", 4: "2", 8: "3", 6: "4", 2: "5", 3: "6", 1: "7", 9: "8", 7: "9" }, legende: "Suffixe des sommets de G₂" }),
              redaction: ["Fermés dans l'ordre `5, 4, 8, 6, 2, 3, 1, 9, 7` : `suf(5) = 1`, `suf(4) = 2`, `suf(8) = 3`, `suf(6) = 4`, `suf(2) = 5`, `suf(3) = 6`, `suf(1) = 7`, `suf(9) = 8`, `suf(7) = 9`."]
            },
            {
              titre: "Le tableau des numérotations (CM3, figure 5)",
              texte: [
                {
                  entetes: ["nœud", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                  lignes: [
                    ["préfixe", "1", "2", "7", "5", "3", "4", "8", "6", "9"],
                    ["suffixe", "7", "5", "6", "2", "1", "4", "9", "3", "8"]
                  ]
                },
                "Un sommet est fermé **après** tous ses descendants : dans une arborescence, la racine a le plus grand suffixe."
              ],
              schema: gG2({ etiquettes: { 1: "1/7", 2: "2/5", 3: "7/6", 4: "5/2", 5: "3/1", 6: "4/4", 7: "8/9", 8: "6/3", 9: "9/8" }, legende: "Étiquettes préfixe/suffixe" }),
              redaction: ["Dans l'arborescence de racine 1, `suf(1) = 7` est le plus grand suffixe ; dans celle de racine 7, `suf(7) = 9`."]
            },
            {
              titre: "Graphe sans circuit : l'ordre topologique",
              texte: [
                "Si le graphe est **sans circuit**, il n'y a pas d'arc arrière, et pour **tout arc** `(i, j)` : `suf(i) > suf(j)`.",
                "En rangeant les sommets par **suffixe décroissant**, tous les arcs vont de gauche à droite : c'est un **ordre topologique**."
              ],
              schema: gG2({ etiquettes: { 7: "1ᵉʳ", 9: "2ᵉ", 1: "3ᵉ", 3: "4ᵉ", 2: "5ᵉ", 6: "6ᵉ", 8: "7ᵉ", 4: "8ᵉ", 5: "9ᵉ" }, legende: "G₂ par suffixe décroissant" }),
              redaction: [
                "Soit `(i, j)` un arc. Si j est non exploré quand on visite i, j devient un descendant de i et se ferme avant lui. Si j est déjà fermé, `suf(j) < suf(i)` aussi. Le cas « j ouvert » donnerait un arc arrière, donc un circuit : exclu.",
                "Pour G₂ : `7, 9, 1, 3, 2, 6, 8, 4, 5` est un ordre topologique."
              ]
            }
          ],
          problematique: {
            texte: [
              "Un gestionnaire de paquets doit installer 6 paquets ; un arc `(A, B)` signifie que A doit être installé **avant** B.",
              "Dans quel ordre lancer les installations pour que toutes les contraintes soient respectées ?"
            ],
            schema: oriente(P_DAG, A_DAG, { legende: "Les contraintes « avant »" })
          },
          exemple: {
            texte: ["Graphe des dépendances : arcs `(1,2), (1,3), (2,4), (3,4), (4,5), (3,6), (6,5)`."],
            schema: oriente(P_DAG, A_DAG),
            questions: [
              "Faire le parcours en profondeur depuis 1 et donner les numérotations préfixe et suffixe.",
              "En déduire un ordre d'installation valide."
            ]
          },
          correction: {
            texte: [
              { titre: "1. Parcours" },
              {
                entetes: ENTETES("arcs"),
                lignes: [
                  ["/", "{1, …, 6}", "∅", "∅", "∅", "/"],
                  ["1", "{2, 3, 4, 5, 6}", "{1}", "{1}", "∅", "/"],
                  ["2", "{3, 4, 5, 6}", "{1, 2}", "{1, 2}", "∅", "(1,2)"],
                  ["4", "{3, 5, 6}", "{1, 2, 4}", "{1, 2, 4}", "∅", "(2,4)"],
                  ["5", "{3, 6}", "{1, 2, 4, 5}", "{1, 2, 4, 5}", "∅", "(4,5)"],
                  ["3", "{6}", "{1, …, 5}", "{1, 3}", "{5, 4, 2}", "(1,3)"],
                  ["6", "∅", "{1, …, 6}", "{1, 3, 6}", "{5, 4, 2}", "(3,6)"],
                  ["/", "∅", "{1, …, 6}", "∅", "{5, 4, 2, 6, 3, 1}", "/"]
                ]
              },
              {
                entetes: ["nœud", "1", "2", "3", "4", "5", "6"],
                lignes: [["préfixe", "1", "2", "5", "3", "4", "6"], ["suffixe", "6", "3", "5", "2", "1", "4"]]
              },
              { titre: "2. Ordre d'installation" },
              {
                redaction: [
                  "Le graphe est sans circuit (aucun arc arrière). Rangeons les sommets par suffixe décroissant : `1 (6), 3 (5), 6 (4), 2 (3), 4 (2), 5 (1)`.",
                  "Ordre d'installation : `1, 3, 6, 2, 4, 5`. Contrôle : chaque arc va vers la droite, par exemple `(6,5)` : 6 est 3ᵉ, 5 est 6ᵉ."
                ]
              },
              { schema: oriente("1:0,0 3:1,0 6:2,0 2:3,0 4:4,0 5:5,0", A_DAG, { legende: "Tous les arcs vont de gauche à droite" }) }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Lire les numérotations",
              enonce: "Pour le parcours de G₂ depuis 1, donnez :",
              schema: gG2(),
              champs: [
                { libelle: "`pre(6)`", reponse: 4, tolerance: 0 },
                { libelle: "`suf(6)`", reponse: 4, tolerance: 0 },
                { libelle: "`pre(3)`", reponse: 7, tolerance: 0 },
                { libelle: "`suf(3)`", reponse: 6, tolerance: 0 }
              ],
              explication: ["Ordre de découverte `1-2-5-6-4-8-3-7-9` ; ordre de fermeture `5, 4, 8, 6, 2, 3, 1, 9, 7`."]
            },
            {
              type: "ordre", niveau: 2,
              titre: "L'ordre de fermeture",
              enonce: "Parcours en profondeur du graphe du CM1 depuis 1 : cliquez les sommets dans l'ordre où ils sont **fermés**.",
              graphe: { sommets: P_CM1, aretes: A_CM1 },
              attendu: "4 5 3 2 1",
              explication: ["Découverte `1-2-3-5-4`. 4 est fermé en premier (voisins 2 et 5 explorés), puis 5, 3, 2 (son voisin 4 est exploré) et enfin 1."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Suffixes du TD1",
              enonce: "Pour le parcours complet du graphe orienté du TD1 depuis 1, donnez les numéros suffixes suivants.",
              schema: gTD1or(),
              champs: [
                { libelle: "`suf(7)`", reponse: 1, tolerance: 0 },
                { libelle: "`suf(4)`", reponse: 4, tolerance: 0 },
                { libelle: "`suf(1)`", reponse: 7, tolerance: 0 },
                { libelle: "`suf(8)`", reponse: 8, tolerance: 0 }
              ],
              explication: ["Le parcours suit la chaîne `1 → 2 → … → 7`, qui se ferme à l'envers : 7, 6, 5, 4, 3, 2, 1. Puis 8 est ouvert et fermé seul."]
            },
            {
              type: "ordre", niveau: 3,
              titre: "Un ordre topologique",
              enonce: "Un arc `(A, B)` signifie « A avant B ». Cliquez les 7 tâches dans un ordre qui respecte toutes les contraintes.",
              graphe: { sommets: P_TOPO, aretes: A_TOPO, oriente: true },
              regles: [{ regle: "topologique" }],
              solution: "2 4 6 1 3 5 7",
              explication: ["Par exemple les suffixes décroissants d'un parcours complet depuis 1 : `suf` vaut 7 pour 2, 6 pour 4, 5 pour 6, 4 pour 1, 3 pour 3, 2 pour 5, 1 pour 7, d'où `2, 4, 6, 1, 3, 5, 7`. D'autres ordres conviennent."]
            },
            {
              type: "qcm", niveau: 3,
              titre: "La propriété des suffixes",
              enonce: "Dans un graphe **sans circuit**, que vérifie tout arc `(i, j)` après un parcours en profondeur complet ?",
              schema: oriente(P_DAG, A_DAG, { etiquettes: { 1: "suf 6", 2: "suf 3", 3: "suf 5", 4: "suf 2", 5: "suf 1", 6: "suf 4" } }),
              choix: ["`pre(i) < pre(j)`", "`suf(i) > suf(j)`", "`suf(i) < suf(j)`"],
              reponse: 1,
              explication: ["j est fermé avant i : `suf(j) < suf(i)`. En revanche, `pre(i) < pre(j)` peut être faux : avec l'arc `(3,4)`, 4 a été découvert (pre 3) avant 3 (pre 5)."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Combien d'ordres possibles ?",
              enonce: "Combien d'ordres d'installation différents respectent les contraintes du gestionnaire de paquets (l'exemple de cette leçon) ?",
              schema: oriente(P_DAG, A_DAG),
              champs: [{ libelle: "Nombre d'ordres topologiques", reponse: 5, tolerance: 0 }],
              indice: "1 est forcément premier et 5 forcément dernier. Rangez ensuite 2, 3, 4, 6.",
              explication: [
                "1 n'a pas de prédécesseur et tout le monde en dépend : il est premier. 5 dépend de tous : il est dernier.",
                "Entre les deux : 3 avant 4 et 6, 2 avant 4. Les ordres possibles de 2, 3, 4, 6 sont `2346`, `2364`, `3246`, `3264`, `3624` : **5** ordres."
              ]
            }
          ]
        },

        /* ---------- Leçon 8.2 ---------- */
        {
          type: "lecon",
          id: "gm-kosaraju",
          titre: "Algorithme de Kosaraju-Sharir",
          description: "Deux parcours et le graphe inverse pour trouver toutes les composantes fortement connexes.",
          cours: [
            {
              titre: "Un parcours ne suffit pas",
              texte: [
                "Le parcours d'un graphe orienté depuis i donne les sommets **accessibles** depuis i : ce n'est pas une composante fortement connexe.",
                "Il faudrait aussi savoir qui **revient** vers i. D'où l'idée de Kosaraju-Sharir (1978) : parcourir aussi le graphe **inverse**."
              ],
              schema: gTD1or({ marques: { 1: "a", 2: "a", 3: "a", 4: "a", 5: "b", 6: "b", 7: "b" }, legende: "TD1 : depuis 1 on atteint 1 à 7, mais la CFC de 1 est {1; 2; 3; 4}" }),
              redaction: ["Le parcours depuis 1 atteint `{1; …; 7}`, alors que la CFC de 1 est `{1; 2; 3; 4}` : 5, 6, 7 ne reviennent pas vers 1."]
            },
            {
              titre: "Étape 1 : parcours de G et suffixes",
              texte: ["On fait un parcours en profondeur **complet** de G et on note la **numérotation suffixe**."],
              schema: gTD1or({ etiquettes: { 7: "1", 6: "2", 5: "3", 4: "4", 3: "5", 2: "6", 1: "7", 8: "8" }, legende: "Suffixes du parcours depuis 1" }),
              redaction: ["Parcours `1-2-3-4-5-6-7-8` ; suffixes : `suf(7) = 1`, `suf(6) = 2`, `suf(5) = 3`, `suf(4) = 4`, `suf(3) = 5`, `suf(2) = 6`, `suf(1) = 7`, `suf(8) = 8`."]
            },
            {
              titre: "Étape 2 : le graphe inverse Gᵀ",
              texte: ["On retourne **tous** les arcs : `(i, j)` devient `(j, i)`. Un chemin de i à j dans G est un chemin de j à i dans `Gᵀ` : les CFC sont les mêmes."],
              schema: oriente(P_TD1_OR, A_TD1_OR_T, { legende: "Gᵀ du graphe du TD1" }),
              redaction: ["`Gᵀ` a les arcs `(1,4), (2,1), (3,1), (3,2), (4,3), (5,3), (5,4), (6,5), (5,6), (6,3), (6,8), (7,3), (7,6), (6,7)`."]
            },
            {
              titre: "Étape 3 : parcours de Gᵀ par suffixe décroissant",
              texte: [
                "On parcourt `Gᵀ` ; **chaque nouvelle racine** est le sommet non exploré de **plus grand suffixe** (de l'étape 1). Dans une même exploration, on garde l'ordre croissant des successeurs.",
                "Ici : racines possibles dans l'ordre 8, 1, 2, 3, 4, 5, 6, 7."
              ],
              schema: oriente(P_TD1_OR, A_TD1_OR_T, { groupes: ["8", "1 4 3 2", "5 6 7"], marques: { "1>4": "c", "4>3": "c", "3>2": "c", "5>6": "c", "6>7": "c" }, legende: "Trois arborescences dans Gᵀ" }),
              redaction: [
                "Racine 8 (suffixe 8) : `N⁺(8) = ∅` dans `Gᵀ` → arborescence `{8}`.",
                "Racine 1 (suffixe 7) : 1 → 4 → 3 → 2 → arborescence `{1; 4; 3; 2}`.",
                "Racine suivante : 5 (suffixe 3) : 5 → 6 → 7 → arborescence `{5; 6; 7}`."
              ]
            },
            {
              titre: "Étape 4 : les arborescences sont les CFC",
              texte: ["Chaque arborescence du second parcours est une composante fortement connexe de G."],
              schema: gTD1or({ groupes: ["8", "1 2 3 4", "5 6 7"], legende: "Les CFC du graphe du TD1" }),
              redaction: ["Les CFC de G sont `{8}`, `{1; 2; 3; 4}` et `{5; 6; 7}` : on retrouve le résultat obtenu à la main au chapitre 3."]
            },
            {
              titre: "Pourquoi ça marche",
              texte: [
                "Le sommet de plus grand suffixe est dans une composante **source** du graphe réduit (aucun arc n'y entre depuis une autre composante).",
                "Dans `Gᵀ`, cette composante devient un **puits** : son exploration ne peut pas en sortir. On la « détache », et le sommet non exploré de plus grand suffixe est à nouveau dans une source de ce qui reste."
              ],
              schema: oriente("X1:0,0 X2:1,1 X3:2,0", "X1>X2 X3>X2", { groupes: ["X1", "X2", "X3"], legende: "Gr du TD1 : X₃ = {8} et X₁ sont des sources" }),
              redaction: ["`suf(8) = 8` : 8 est dans la source `X₃`. Dans `Gᵀ`, l'arc `(X₃, X₂)` est retourné : depuis 8, on ne sort pas de `X₃`."]
            }
          ],
          problematique: {
            texte: [
              "Un outil d'analyse de code repère les fonctions qui s'appellent mutuellement (récursion croisée) : elles doivent être analysées ensemble.",
              "Sur un graphe d'appels de milliers de fonctions, chercher les circuits à la main est impossible. Il faut une méthode systématique, en deux parcours."
            ],
            schema: gKEX({ legende: "Un graphe d'appels de 8 fonctions" })
          },
          exemple: {
            texte: ["Appliquer l'algorithme de Kosaraju-Sharir à ce graphe (premier parcours depuis 1, plus petit successeur d'abord)."],
            schema: gKEX(),
            questions: [
              "Étape 1 : parcours de G et numérotation suffixe.",
              "Étape 2 : construire `Gᵀ`.",
              "Étape 3 : parcours de `Gᵀ` par suffixe décroissant.",
              "Étape 4 : donner les composantes fortement connexes et le graphe réduit."
            ]
          },
          correction: {
            texte: [
              { titre: "Étape 1 — Parcours de G" },
              {
                entetes: ENTETES("arcs"),
                lignes: [
                  ["/", "{1, …, 8}", "∅", "∅", "∅", "/"],
                  ["1", "{2, …, 8}", "{1}", "{1}", "∅", "/"],
                  ["2", "{3, …, 8}", "{1, 2}", "{1, 2}", "∅", "(1,2)"],
                  ["3", "{4, …, 8}", "{1, 2, 3}", "{1, 2, 3}", "∅", "(2,3)"],
                  ["5", "{4, 6, 7, 8}", "{1, 2, 3, 5}", "{1, 2, 3, 5}", "∅", "(3,5)"],
                  ["6", "{4, 7, 8}", "{1, 2, 3, 5, 6}", "{1, 2, 3, 5, 6}", "∅", "(5,6)"],
                  ["4", "{7, 8}", "{1, …, 6}", "{1, 2, 3, 5, 6, 4}", "∅", "(6,4)"],
                  ["7", "{8}", "{1, …, 7}", "{1, 2, 3, 5, 6, 7}", "{4}", "(6,7)"],
                  ["8", "∅", "{1, …, 8}", "{1, 2, 3, 5, 6, 7, 8}", "{4}", "(7,8)"],
                  ["/", "∅", "{1, …, 8}", "∅", "{4, 8, 7, 6, 5, 3, 2, 1}", "/"]
                ]
              },
              { redaction: ["Suffixes : `suf(4) = 1`, `suf(8) = 2`, `suf(7) = 3`, `suf(6) = 4`, `suf(5) = 5`, `suf(3) = 6`, `suf(2) = 7`, `suf(1) = 8`."] },
              { titre: "Étape 2 — Gᵀ" },
              { schema: oriente(P_KEX, A_KEX_T, { courbes: { "5>3": -34 }, etiquettes: { 1: "8", 2: "7", 3: "6", 5: "5", 6: "4", 7: "3", 8: "2", 4: "1" }, legende: "Gᵀ, étiqueté par les suffixes" }) },
              { titre: "Étape 3 — Parcours de Gᵀ" },
              {
                entetes: ENTETES("arcs"),
                lignes: [
                  ["/", "{1, …, 8}", "∅", "∅", "∅", "/"],
                  ["1", "{2, …, 8}", "{1}", "{1}", "∅", "/"],
                  ["3", "{2, 4, 5, 6, 7, 8}", "{1, 3}", "{1, 3}", "∅", "(1,3)"],
                  ["2", "{4, 5, 6, 7, 8}", "{1, 2, 3}", "{1, 3, 2}", "∅", "(3,2)"],
                  ["/", "{4, 5, 6, 7, 8}", "{1, 2, 3}", "∅", "{2, 3, 1}", "/"],
                  ["5", "{4, 6, 7, 8}", "{1, 2, 3, 5}", "{5}", "{2, 3, 1}", "/"],
                  ["4", "{6, 7, 8}", "{1, …, 5}", "{5, 4}", "{2, 3, 1}", "(5,4)"],
                  ["6", "{7, 8}", "{1, …, 6}", "{5, 4, 6}", "{2, 3, 1}", "(4,6)"],
                  ["/", "{7, 8}", "{1, …, 6}", "∅", "{2, 3, 1, 6, 4, 5}", "/"],
                  ["7", "{8}", "{1, …, 7}", "{7}", "{2, 3, 1, 6, 4, 5}", "/"],
                  ["8", "∅", "{1, …, 8}", "{7, 8}", "{2, 3, 1, 6, 4, 5}", "(7,8)"],
                  ["/", "∅", "{1, …, 8}", "∅", "{2, 3, 1, 6, 4, 5, 8, 7}", "/"]
                ]
              },
              {
                redaction: [
                  "Racine 1 (suffixe 8) : dans `Gᵀ`, `N⁺(1) = {3}`, `N⁺(3) = {2}`, `N⁺(2) = {1}` → `{1; 3; 2}`.",
                  "Plus grand suffixe restant : 5 (suffixe 5) : `N⁺(5) = {3; 4}`, 3 est exploré → 4 → 6 → `{5; 4; 6}`.",
                  "Puis 7 (suffixe 3) : → 8 → `{7; 8}`."
                ]
              },
              { titre: "Étape 4 — Résultat" },
              { redaction: ["CFC : `X₁ = {1; 2; 3}`, `X₂ = {4; 5; 6}`, `X₃ = {7; 8}`. Arcs entre composantes : `(2,4)` et `(3,5)` de `X₁` vers `X₂`, `(6,7)` de `X₂` vers `X₃`. `Gr = ({X₁; X₂; X₃}, {(X₁, X₂); (X₂, X₃)})`."] },
              { schema: [gKEX({ groupes: ["1 2 3", "4 5 6", "7 8"] }), oriente("X1:0,0 X2:1.4,0 X3:2.8,0", "X1>X2 X2>X3", { groupes: ["X1", "X2", "X3"], legende: "Gr" })] },
              { attention: "Piège : à l'étape 3, ne pas partir de 2 sous prétexte qu'il est le plus petit. On choisit **chaque racine** par suffixe décroissant." }
            ]
          },
          exercices: [
            {
              type: "construire", niveau: 1,
              titre: "Construire Gᵀ",
              enonce: "Tracez le graphe inverse `Gᵀ` du graphe ci-dessous (CM1, figure 6).",
              schema: oriente(P_CM1_F6, A_CM1_F6, { legende: "G" }),
              graphe: { sommets: P_CM1_F6, oriente: true },
              attendu: "2>1 1>2 3>1 4>2 5>4 6>4 4>6 6>5",
              explication: ["Chaque arc est retourné : `(1,3)` devient `(3,1)`, `(4,5)` devient `(5,4)`… Les paires `(1,2)/(2,1)` et `(4,6)/(6,4)` restent inchangées."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Ordre des racines",
              enonce: "Pour l'exemple de la leçon (graphe d'appels), donnez la liste des sommets par **suffixe décroissant** (étape 3).",
              schema: gKEX(),
              champs: [{ libelle: "Sommets par suffixe décroissant", reponse: "1 2 3 5 6 7 8 4", suite: true }],
              explication: ["Ordre de fermeture du premier parcours : `4, 8, 7, 6, 5, 3, 2, 1`. On le lit à l'envers : `1, 2, 3, 5, 6, 7, 8, 4`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Les CFC du TD1",
              enonce: "Donnez les composantes fortement connexes du graphe orienté du TD1, sous la forme `{…}, {…}, …`.",
              schema: gTD1or(),
              champs: [{ libelle: "Composantes fortement connexes", reponse: "{8}, {1, 2, 3, 4}, {5, 6, 7}", partition: true }],
              explication: ["Kosaraju (voir le cours) : trois arborescences dans `Gᵀ`, `{8}`, `{1; 4; 3; 2}`, `{5; 6; 7}`."]
            },
            {
              type: "ordre", niveau: 3,
              titre: "Le second parcours",
              enonce: "Voici `Gᵀ` pour le graphe d'appels, chaque sommet étiqueté par son suffixe du premier parcours. Cliquez les sommets dans l'ordre de découverte du **second parcours** de Kosaraju.",
              graphe: { sommets: P_KEX, aretes: A_KEX_T, oriente: true, courbes: { "5>3": -34 }, etiquettes: { 1: "8", 2: "7", 3: "6", 5: "5", 6: "4", 7: "3", 8: "2", 4: "1" } },
              attendu: "1 3 2 5 4 6 7 8",
              explication: ["Racine 1 (suffixe 8) : 1 → 3 → 2. Puis 5 (plus grand suffixe restant) : 5 → 4 → 6. Puis 7 : 7 → 8."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Un graphe à quatre composantes",
              enonce: "Donnez les composantes fortement connexes de ce graphe.",
              schema: oriente(P_KBIG, A_KBIG),
              champs: [{ libelle: "Composantes fortement connexes", reponse: "{1, 2}, {3, 4, 5}, {6, 7, 8}, {9, 10}", partition: true }],
              indice: "Repérez les circuits, puis vérifiez qu'on ne peut pas revenir d'un groupe vers un autre.",
              explication: [
                "Circuits : `(1, 2, 1)`, `(3, 4, 5, 3)`, `(6, 7, 8, 6)`, `(9, 10, 9)`.",
                "Les arcs entre groupes `(2,3)`, `(1,6)`, `(5,6)`, `(5,9)`, `(8,10)` vont toujours de `{1; 2}` vers la suite, puis vers `{9; 10}` : aucun retour, les groupes ne fusionnent pas."
              ]
            },
            {
              type: "construire", niveau: 4,
              titre: "Son graphe réduit",
              enonce: "Avec `X₁ = {1; 2}`, `X₂ = {3; 4; 5}`, `X₃ = {6; 7; 8}`, `X₄ = {9; 10}`, tracez le graphe réduit du graphe précédent.",
              schema: oriente(P_KBIG, A_KBIG, { groupes: ["1 2", "3 4 5", "6 7 8", "9 10"] }),
              graphe: { sommets: "X1:0,1 X2:1.5,0 X3:1.5,2 X4:3,1", oriente: true },
              attendu: "X1>X2 X1>X3 X2>X3 X2>X4 X3>X4",
              explication: ["`(2,3)` : `X₁ → X₂` ; `(1,6)` : `X₁ → X₃` ; `(5,6)` : `X₂ → X₃` ; `(5,9)` : `X₂ → X₄` ; `(8,10)` : `X₃ → X₄`. Il est sans circuit, comme tout graphe réduit."]
            },
            {
              type: "qcm", niveau: 4,
              titre: "Et sans inverser ?",
              enonce: "On fait le second parcours sur **G** (au lieu de `Gᵀ`), avec les racines par suffixe décroissant. Obtient-on encore les CFC ?",
              schema: gTD1or({ etiquettes: { 7: "1", 6: "2", 5: "3", 4: "4", 3: "5", 2: "6", 1: "7", 8: "8" } }),
              choix: [
                "Oui, l'inversion ne sert qu'à accélérer.",
                "Non : sur le graphe du TD1, la première racine 8 atteindrait 6, 5 et 7.",
                "Oui, si le graphe est connexe."
              ],
              reponse: 1,
              explication: ["La racine de plus grand suffixe est dans une composante **source** : dans G, son exploration déborde vers les composantes en aval (`{8}` atteint `{5; 6; 7}`). C'est dans `Gᵀ`, où la source devient un puits, que l'exploration reste enfermée dans la composante."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Rendre fortement connexe",
              enonce: "Combien d'arcs faut-il ajouter, au minimum, au graphe à quatre composantes pour le rendre fortement connexe ? Donnez un arc qui convient (sous la forme `(i, j)`).",
              schema: oriente("X1:0,1 X2:1.5,0 X3:1.5,2 X4:3,1", "X1>X2 X1>X3 X2>X3 X2>X4 X3>X4", { groupes: ["X1", "X2", "X3", "X4"], legende: "Gr" }),
              champs: [
                { libelle: "Nombre minimal d'arcs", reponse: 1, tolerance: 0 },
                { libelle: "Un arc qui convient (depuis `X₄` vers `X₁`)", reponse: "(9, 1)", accepte: ["(9,2)", "(10,1)", "(10,2)", "9 1", "9 2", "10 1", "10 2"], suite: true }
              ],
              explication: [
                "`Gr` a une seule source `X₁` et un seul puits `X₄`, et tout sommet de `Gr` est sur un chemin de `X₁` à `X₄`.",
                "Un arc de `X₄` vers `X₁` (par exemple `(9, 1)`) crée un circuit qui passe par toutes les composantes : elles fusionnent. Il faut au moins un arc puisque G n'est pas fortement connexe."
              ]
            }
          ]
        }
      ]
    }
  );
})();
