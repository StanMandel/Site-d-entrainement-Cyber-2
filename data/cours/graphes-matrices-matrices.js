/* =============================================================
   Introduction aux graphes et aux matrices — chapitres 9 et 10
   Représentations matricielles (CM3 question 4, TD2 ex. 4 question 3),
   puissances de la matrice d'adjacence, graphes de Tanner et codes
   LDPC (TD2, ex. 4), puis une leçon de synthèse au-delà des TD.
   Complète CONTENU["graphes-matrices"] (voir graphes-matrices.js).
   ============================================================= */

(() => {
  const graphe = (sommets, aretes, plus) => Object.assign({ type: "graphe", sommets, aretes }, plus || {});
  const oriente = (sommets, arcs, plus) => Object.assign({ type: "graphe", oriente: true, sommets, aretes: arcs }, plus || {});
  const matrice = (spec, plus) => Object.assign({ type: "matrice" }, spec, plus || {});
  /* Matrice d'adjacence d'un graphe, sommets rangés par ordre croissant. */
  const trier = (sommets) => sommets.replace(/:[^ ]+/g, "").split(" ").sort((a, b) => a.localeCompare(b, "fr", { numeric: true })).join(" ");
  const mAdj = (g, plus) => matrice({ graphe: { sommets: trier(g.sommets), aretes: g.aretes, oriente: g.oriente } }, plus);

  const P_CM1 = "1:1,0 4:3,0 2:0,1 3:2,1 5:4,1";
  const A_CM1 = "1-2 1-3 1-5 2-3 2-4 3-5 4-5";
  const P_CM1_F6 = "1:0,0 2:1,0 3:0,1 4:1,1 5:2,1 6:1,2";
  const A_CM1_F6 = "1>2 2>1 1>3 2>4 4>5 4>6 6>4 5>6";
  const A_CM1_F6_T = "2>1 1>2 3>1 4>2 5>4 6>4 4>6 6>5";
  const P_9 = "1:0,1 2:1,0 3:1,1 4:1,2 5:2,0 6:2,1 7:2,2 8:3,1 9:3,2";
  const A_G1 = "1-2 1-3 1-4 2-3 2-5 2-6 4-6 5-6 6-7 6-8 6-9 7-9";
  const P_TD1_OR = "1:0,0 4:1,0 5:2,0 2:0,1 3:1,1 6:2,1 8:3,1 7:2,2";
  const A_TD1_OR = "4>1 1>2 1>3 2>3 3>4 3>5 4>5 5>6 6>5 3>6 8>6 3>7 6>7 7>6";
  const S_MOD = "m1 m2 m3 m4 m5 m6 m7 m8";
  const A_MOD = "m1-m2 m1-m4 m1-m5 m1-m6 m1-m7 m1-m8 m2-m3 m2-m5 m3-m4 m4-m5 m4-m6 m4-m8 m5-m6 m6-m7 m7-m8";
  const S_10 = "1 2 3 4 5 6 7 8 9 10";
  const A_CTF = "1-6 1-8 1-10 2-3 2-4 3-6 4-8 4-9 5-9 5-10 7-10";
  const P_CARRE = "1:0,0 2:1.5,0 3:1.5,1.5 4:0,1.5";
  const P_PENTA = "1:1,0 2:2,0.75 3:1.6,1.9 4:0.4,1.9 5:0,0.75";

  /* Graphe de Tanner du TD2 (exercice 4) */
  const P_TAN = "x1:0,0 x2:0,0.7 x3:0,1.4 x4:0,2.1 x5:0,2.8 x6:0,3.5 x7:0,4.2 c1:3,0.4 c2:3,1.5 c3:3,2.7 c4:3,3.8";
  const A_TAN = "x1-c1 x2-c1 x3-c1 x4-c1 x1-c2 x2-c2 x5-c2 x6-c2 x3-c3 x5-c3 x7-c3 x4-c4 x6-c4 x7-c4";
  const BITS = "x1 x2 x3 x4 x5 x6 x7";
  const CTRL = "c1 c2 c3 c4";
  const H_TD2 = [
    [1, 1, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 1, 1]
  ];
  const gTan = (plus) => graphe(P_TAN, A_TAN, Object.assign({ carres: CTRL, unite: 70 }, plus || {}));
  /* Code en grille 3 × 3 (TD2, exercice 4, parties 3 et 4) */
  const P_GRILLE = "L1:0,0.6 L2:0,2.4 L3:0,4.2 x11:1.6,0 x12:1.6,0.6 x13:1.6,1.2 x21:1.6,1.8 x22:1.6,2.4 x23:1.6,3 x31:1.6,3.6 x32:1.6,4.2 x33:1.6,4.8 C1:3.2,1.8 C2:3.2,2.4 C3:3.2,3";
  const A_GRILLE = "x11-L1 x12-L1 x13-L1 x21-L2 x22-L2 x23-L2 x31-L3 x32-L3 x33-L3 x11-C1 x21-C1 x31-C1 x12-C2 x22-C2 x32-C2 x13-C3 x23-C3 x33-C3";
  const gGrille = (plus) => graphe(P_GRILLE, A_GRILLE, Object.assign({ carres: "L1 L2 L3 C1 C2 C3", unite: 70 }, plus || {}));

  CONTENU["graphes-matrices"].chapitres.push(

    /* =====================================================
       CHAPITRE 9 — MATRICES ET GRAPHES
       ===================================================== */
    {
      id: "ch9",
      titre: "Chapitre 9 — Graphes et matrices",
      description: "Matrice d'adjacence, puissances de matrices, matrices de parité et codes LDPC.",
      exercices: [

        /* ---------- Leçon 9.1 ---------- */
        {
          type: "lecon",
          id: "gm-adjacence",
          titre: "Matrice d'adjacence",
          description: "Représenter un graphe par un tableau de 0 et de 1 : lire les degrés, transposer, choisir la représentation.",
          cours: [
            {
              titre: "Définition",
              texte: [
                "Les sommets étant numérotés de 1 à n, la **matrice d'adjacence** de G est le tableau `A = (a_ij)` de taille `n × n` :",
                ["`a_ij = 1` si `{i, j}` est une arête (ou `(i, j)` un arc) ;", "`a_ij = 0` sinon."],
                "Ligne i, colonne j : « i est-il relié à j ? »."
              ],
              schema: [graphe(P_CM1, A_CM1, { legende: "G (CM1)" }), mAdj({ sommets: P_CM1, aretes: A_CM1 }, { legende: "Sa matrice d'adjacence" })],
              redaction: ["`{1,2}` est une arête : `a₁₂ = 1`. `{1,4}` n'en est pas une : `a₁₄ = 0`. On remplit ainsi les 25 cases."]
            },
            {
              titre: "Non orienté ⇒ symétrique",
              texte: [
                "Dans un graphe non orienté, `{i, j} = {j, i}` : `a_ij = a_ji`. La matrice est **symétrique** par rapport à la diagonale.",
                "Sans boucle, la diagonale ne contient que des 0."
              ],
              schema: mAdj({ sommets: P_CM1, aretes: A_CM1 }, { marques: { "2,4": "a", "4,2": "a", "1,1": "b", "2,2": "b", "3,3": "b", "4,4": "b", "5,5": "b" }, legende: "a₂₄ = a₄₂ ; diagonale nulle" }),
              redaction: ["`a₂₄ = a₄₂ = 1` : c'est la même arête `{2,4}`, écrite deux fois. La diagonale est nulle : G n'a pas de boucle."]
            },
            {
              titre: "Lire les degrés",
              texte: [
                "Graphe non orienté : `d(i)` = somme de la **ligne** i (= somme de la colonne i).",
                "Graphe orienté : `d⁺(i)` = somme de la **ligne** i (arcs qui partent de i), `d⁻(j)` = somme de la **colonne** j (arcs qui arrivent en j)."
              ],
              schema: [oriente(P_CM1_F6, A_CM1_F6, { legende: "Graphe orienté (CM1, figure 6)" }), mAdj({ sommets: P_CM1_F6, aretes: A_CM1_F6, oriente: true }, { marques: { "l:4": "a", "c:4": "b" }, legende: "Ligne 4 (bleu), colonne 4 (orange)" })],
              redaction: ["Ligne 4 : `0 0 0 0 1 1`, donc `d⁺(4) = 2`. Colonne 4 : `0 1 0 0 0 1`, donc `d⁻(4) = 2`. La somme de toutes les cases vaut le nombre d'arcs, 8."]
            },
            {
              titre: "Graphe inverse = matrice transposée",
              texte: [
                "Retourner tous les arcs échange lignes et colonnes : la matrice de `Gᵀ` est la **transposée** `Aᵀ` (`aᵀ_ij = a_ji`).",
                "C'est l'origine de la notation `Gᵀ` de l'algorithme de Kosaraju."
              ],
              schema: [
                mAdj({ sommets: P_CM1_F6, aretes: A_CM1_F6, oriente: true }, { titre: "A (G)", marques: { "1,3": "a" } }),
                mAdj({ sommets: P_CM1_F6, aretes: A_CM1_F6_T, oriente: true }, { titre: "Aᵀ (Gᵀ)", marques: { "3,1": "a" } })
              ],
              redaction: ["L'arc `(1,3)` de G donne `a₁₃ = 1` ; dans `Gᵀ` il devient `(3,1)`, soit la case `(3, 1)` de `Aᵀ`."]
            },
            {
              titre: "Matrice ou listes d'adjacence ?",
              texte: [
                {
                  entetes: ["", "Matrice d'adjacence", "Listes d'adjacence"],
                  lignes: [
                    ["Mémoire", "`n²` cases", "`n + m` (orienté) ou `n + 2m`"],
                    ["« i et j sont-ils voisins ? »", "1 lecture : `a_ij`", "parcourir la liste de i"],
                    ["Tous les voisins de i", "n cases à lire", "`d(i)` éléments"],
                    ["Parcours en profondeur", "`O(n²)`", "`O(n + m)`"]
                  ]
                },
                "Pour un graphe **peu dense** (`m` bien plus petit que `n²`), les listes sont préférables : c'est la réponse à la question 4 du CM3."
              ],
              schema: [graphe(P_9, A_G1, { legende: "G₁ (CM3) : 12 arêtes" }), mAdj({ sommets: P_9, aretes: A_G1 }, { legende: "57 zéros sur 81 cases" })],
              redaction: ["G₁ a `n = 9` sommets et `m = 12` arêtes : la matrice a 81 cases dont 24 non nulles ; les listes d'adjacence contiennent `2m = 24` éléments."]
            },
            {
              titre: "Les tableaux du TD2 sont des matrices",
              texte: ["Le tableau des compatibilités du TD2 (modules, étudiants du CTF) est exactement la matrice d'adjacence du graphe à construire : un cercle ligne i, colonne j, c'est `a_ij = 1`."],
              schema: [matrice({ lignes: S_MOD, graphe: { sommets: S_MOD, aretes: A_MOD } }, { legende: "TD2, exercice 1" }), graphe(S_MOD, A_MOD, { disposition: "cercle", legende: "Le graphe correspondant" })],
              redaction: ["Ligne `m₂` : des 1 en colonnes `m₁`, `m₃`, `m₅` ; donc `N(m₂) = {m₁; m₃; m₅}` et `d(m₂) = 3`."]
            }
          ],
          problematique: {
            texte: [
              "Un programme d'analyse réseau doit stocker un graphe et répondre très vite à des questions comme « i et j sont-ils reliés ? » ou « combien d'arcs arrivent en j ? ».",
              "Comment représenter le graphe en mémoire, et comment lire ces informations sur cette représentation ?"
            ],
            schema: oriente(P_TD1_OR, A_TD1_OR)
          },
          exemple: {
            texte: ["On reprend le graphe orienté du TD1 (exercice 4)."],
            schema: oriente(P_TD1_OR, A_TD1_OR),
            questions: [
              "Écrire sa matrice d'adjacence A.",
              "Retrouver les demi-degrés à partir de A.",
              "Comment lire sur A que 8 n'a pas de prédécesseur ? que 5 et 6 forment un circuit de longueur 2 ?"
            ]
          },
          correction: {
            texte: [
              { titre: "1. La matrice" },
              { schema: mAdj({ sommets: P_TD1_OR, aretes: A_TD1_OR, oriente: true }, { legende: "Ligne i, colonne j : 1 si (i, j) est un arc" }) },
              { redaction: ["Ligne 3 : les arcs `(3,4), (3,5), (3,6), (3,7)` donnent des 1 en colonnes 4, 5, 6, 7. Et ainsi de suite pour chaque sommet (14 arcs, 14 cases à 1)."] },
              { titre: "2. Demi-degrés" },
              {
                entetes: ["Sommet", "1", "2", "3", "4", "5", "6", "7", "8"],
                lignes: [
                  ["`d⁺` = somme de la ligne", "2", "1", "4", "2", "1", "2", "1", "1"],
                  ["`d⁻` = somme de la colonne", "1", "1", "2", "1", "3", "4", "2", "0"]
                ]
              },
              { titre: "3. Lectures directes" },
              { redaction: ["La colonne 8 est nulle : aucun arc n'arrive en 8. `a₅₆ = a₆₅ = 1` : les arcs `(5,6)` et `(6,5)` existent, d'où le circuit `(5, 6, 5)`."] }
            ]
          },
          exercices: [
            {
              type: "matrice", niveau: 1,
              titre: "Écrire une matrice d'adjacence",
              enonce: "Remplissez la matrice d'adjacence de ce graphe.",
              schema: graphe(P_CARRE, "1-2 1-3 2-3 3-4"),
              graphe: { sommets: "1 2 3 4", aretes: "1-2 1-3 2-3 3-4" },
              explication: ["4 arêtes, donc 8 cases à 1 (chaque arête apparaît deux fois, la matrice est symétrique)."]
            },
            {
              type: "construire", niveau: 1,
              titre: "Du tableau au dessin",
              enonce: "Tracez le graphe non orienté dont voici la matrice d'adjacence.",
              schema: matrice({ lignes: "1 2 3 4 5", valeurs: [[0, 1, 0, 1, 0], [1, 0, 1, 0, 1], [0, 1, 0, 1, 0], [1, 0, 1, 0, 0], [0, 1, 0, 0, 0]] }),
              graphe: { sommets: P_PENTA },
              attendu: "1-2 1-4 2-3 2-5 3-4",
              explication: ["On lit le triangle au-dessus de la diagonale : `a₁₂`, `a₁₄`, `a₂₃`, `a₂₅`, `a₃₄` valent 1."]
            },
            {
              type: "matrice", niveau: 2,
              titre: "Matrice d'un graphe orienté",
              enonce: "Remplissez la matrice d'adjacence de ce graphe orienté (ligne = origine de l'arc, colonne = extrémité).",
              schema: oriente(P_PENTA, "1>2 2>3 3>1 3>4 4>5 5>3"),
              graphe: { sommets: "1 2 3 4 5", aretes: "1>2 2>3 3>1 3>4 4>5 5>3", oriente: true },
              explication: ["6 arcs, 6 cases à 1 ; la matrice n'est pas symétrique : `a₃₁ = 1` mais `a₁₃ = 0`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Lire une matrice",
              enonce: "Voici la matrice d'adjacence d'un graphe non orienté.",
              schema: matrice({ lignes: "1 2 3 4 5", valeurs: [[0, 1, 1, 1, 0], [1, 0, 1, 0, 0], [1, 1, 0, 1, 1], [1, 0, 1, 0, 1], [0, 0, 1, 1, 0]] }),
              champs: [
                { libelle: "`d(3)`", reponse: 4, tolerance: 0 },
                { libelle: "`N(4)`", reponse: "{1, 3, 5}", ensemble: true },
                { libelle: "Nombre d'arêtes", reponse: 7, tolerance: 0 }
              ],
              explication: ["Ligne 3 : `1 1 0 1 1`, somme 4. Ligne 4 : 1 en colonnes 1, 3, 5. La somme de toutes les cases vaut 14 = `2|E|` (chaque arête comptée deux fois) : 7 arêtes."]
            },
            {
              type: "construire", niveau: 3,
              titre: "TD2 : le graphe du CTF",
              enonce: "Tracez le graphe dont la matrice d'adjacence est le tableau du CTF (TD2, exercice 2).",
              schema: matrice({ lignes: S_10, graphe: { sommets: S_10, aretes: A_CTF } }),
              graphe: { sommets: S_10, disposition: "cercle" },
              attendu: A_CTF,
              explication: ["11 arêtes : `{1,6}, {1,8}, {1,10}, {2,3}, {2,4}, {3,6}, {4,8}, {4,9}, {5,9}, {5,10}, {7,10}`."]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Propriétés d'une matrice d'adjacence",
              enonce: "Quelles affirmations sont vraies ?",
              schema: mAdj({ sommets: P_CM1, aretes: A_CM1 }),
              choix: [
                "La matrice d'un graphe simple non orienté est symétrique et de diagonale nulle.",
                "La matrice d'un graphe orienté est toujours symétrique.",
                "La somme de toutes les cases de la matrice d'un graphe simple non orienté vaut `2|E|`.",
                "Une ligne nulle correspond à un sommet isolé dans un graphe non orienté."
              ],
              reponse: [0, 2, 3],
              explication: ["Orienté : `a_ij = 1` n'impose pas `a_ji = 1`. La somme des lignes est la somme des degrés, `2|E|` (poignées de main). Une ligne nulle : aucun voisin, sommet isolé."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Un grand graphe peu dense",
              enonce: "Un graphe non orienté a 1 000 sommets et 3 000 arêtes (un réseau d'entreprise, par exemple).",
              schema: mAdj({ sommets: P_9, aretes: A_G1 }, { legende: "Même à petite échelle, la matrice est surtout faite de 0" }),
              champs: [
                { libelle: "Nombre de cases de la matrice", reponse: 1000000, tolerance: 0 },
                { libelle: "Nombre de cases à 1", reponse: 6000, tolerance: 0 },
                { libelle: "Proportion de cases à 1", reponse: 0.6, unite: "%", tolerance: 0.01 }
              ],
              explication: ["`1000² = 10⁶` cases ; chaque arête donne deux 1 : 6 000 ; soit `6000 / 10⁶ = 0,6 %`. Les listes d'adjacence ne stockent que `1000 + 6000` éléments."]
            },
            {
              type: "matrice", niveau: 4,
              titre: "La matrice de Gᵀ",
              enonce: "Voici la matrice A d'un graphe orienté G. Remplissez la matrice du graphe inverse `Gᵀ`.",
              schema: matrice({ lignes: "1 2 3 4 5", graphe: { sommets: "1 2 3 4 5", aretes: "1>2 1>4 2>3 3>1 4>3 4>5 5>2", oriente: true } }, { titre: "A" }),
              graphe: { sommets: "1 2 3 4 5", aretes: "2>1 4>1 3>2 1>3 3>4 5>4 2>5", oriente: true },
              explication: ["La matrice de `Gᵀ` est la transposée : la ligne i de `Aᵀ` est la colonne i de A."]
            }
          ]
        },

        /* ---------- Leçon 9.2 ---------- */
        {
          type: "lecon",
          id: "gm-puissances",
          titre: "Puissances de la matrice d'adjacence",
          description: "A², A³… comptent les chaînes de longueur fixée ; triangles et circuits par le calcul.",
          cours: [
            {
              titre: "Produit de deux matrices",
              texte: [
                "Le produit `C = A × B` de deux matrices `n × n` a pour coefficients `c_ij = ∑_k a_ik × b_kj` : ligne i de A « fois » colonne j de B.",
                "Avec des matrices d'adjacence, chaque terme `a_ik × b_kj` vaut 1 exactement quand les deux liens existent."
              ],
              schema: [
                matrice({ lignes: "1 2", valeurs: [[1, 2], [0, 1]] }, { titre: "A" }),
                matrice({ lignes: "1 2", valeurs: [[3, 0], [1, 1]] }, { titre: "B" }),
                matrice({ lignes: "1 2", valeurs: [[5, 2], [1, 1]] }, { titre: "A × B" })
              ],
              redaction: ["`(AB)₁₁ = 1 × 3 + 2 × 1 = 5` ; `(AB)₁₂ = 1 × 0 + 2 × 1 = 2` ; `(AB)₂₁ = 0 × 3 + 1 × 1 = 1` ; `(AB)₂₂ = 1`."]
            },
            {
              titre: "A² compte les chaînes de longueur 2",
              texte: [
                "`(A²)_ij = ∑_k a_ik a_kj` : le terme vaut 1 quand `i − k − j` est une chaîne. Donc `(A²)_ij` est **le nombre de chaînes de longueur 2 de i à j**.",
                "Pour `i ≠ j` dans un graphe non orienté : le nombre de **voisins communs** de i et j."
              ],
              schema: [graphe(P_CM1, A_CM1, { marques: { 1: "a", 4: "a", 2: "b", 5: "b", "1-2": "a", "2-4": "a", "1-5": "a", "4-5": "a" }, legende: "1 − 2 − 4 et 1 − 5 − 4" }), mAdj({ sommets: P_CM1, aretes: A_CM1 }, { puissance: 2, titre: "A²", marques: { "1,4": "a", "4,1": "a" } })],
              redaction: ["`(A²)₁₄ = 2` : les chaînes de longueur 2 de 1 à 4 sont `(1, 2, 4)` et `(1, 5, 4)` (voisins communs 2 et 5)."]
            },
            {
              titre: "La diagonale de A²",
              texte: ["`(A²)_ii` compte les chaînes `i − k − i` : une par voisin k. Dans un graphe simple non orienté, **la diagonale de A² est la liste des degrés**."],
              schema: [graphe(P_CM1, A_CM1, { etiquettes: { 1: "d=3", 2: "d=3", 3: "d=3", 4: "d=2", 5: "d=3" } }), mAdj({ sommets: P_CM1, aretes: A_CM1 }, { puissance: 2, titre: "A²", marques: { "1,1": "c", "2,2": "c", "3,3": "c", "4,4": "c", "5,5": "c" } })],
              redaction: ["Diagonale de A² : `3, 3, 3, 2, 3`, les degrés du graphe du CM1."]
            },
            {
              titre: "A^k compte les chaînes de longueur k",
              texte: [
                "Par récurrence, `(A^k)_ij` est le nombre de chaînes (de chemins, si G est orienté) de longueur k de i à j — sommets et arêtes répétés autorisés.",
                "Si `(A^k)_ij = 0` pour tout `k < n`, aucun chemin ne mène de i à j."
              ],
              schema: [graphe(P_CM1, A_CM1), mAdj({ sommets: P_CM1, aretes: A_CM1 }, { puissance: 3, titre: "A³" })],
              redaction: [
                "Initialisation : `A¹ = A` compte les chaînes de longueur 1 (les arêtes).",
                "Hérédité : une chaîne de longueur `k + 1` de i à j est une chaîne de longueur k de i à un sommet l, suivie d'une arête `{l, j}`. Leur nombre est la somme sur l des `(A^k)_il × a_lj`, c'est-à-dire `(A^(k+1))_ij`. □"
              ]
            },
            {
              titre: "Compter les triangles",
              texte: [
                "`(A³)_ii` compte les chaînes fermées `i − j − k − i` de longueur 3, c'est-à-dire les triangles passant par i, chacun **deux fois** (deux sens de parcours).",
                "Chaque triangle a 3 sommets : nombre de triangles = `trace(A³) / 6` (la trace est la somme de la diagonale)."
              ],
              schema: [graphe(P_CM1, A_CM1, { marques: { "1-2": "b", "2-3": "b", "1-3": "b", "3-5": "a", "1-5": "a" }, legende: "Triangles {1; 2; 3} et {1; 3; 5}" }), mAdj({ sommets: P_CM1, aretes: A_CM1 }, { puissance: 3, titre: "A³", marques: { "1,1": "b", "2,2": "b", "3,3": "b", "4,4": "b", "5,5": "b" } })],
              redaction: ["`trace(A³) = 4 + 2 + 4 + 0 + 2 = 12`, donc `12 / 6 = 2` triangles : `{1; 2; 3}` et `{1; 3; 5}`."]
            }
          ],
          problematique: {
            texte: [
              "Dans un réseau, un paquet traverse exactement 3 liens (3 « sauts ») entre deux routeurs, éventuellement en repassant par un routeur.",
              "Combien de trajets différents de 3 sauts relient deux routeurs donnés ? Le calcul matriciel répond sans dessiner les trajets."
            ],
            schema: graphe(P_CARRE, "1-2 2-3 3-4 1-4 1-3")
          },
          exemple: {
            texte: ["Le réseau est le carré `1 − 2 − 3 − 4 − 1` muni de la diagonale `{1,3}`."],
            schema: graphe(P_CARRE, "1-2 2-3 3-4 1-4 1-3"),
            questions: [
              "Écrire A et calculer A².",
              "Calculer A³. Combien y a-t-il de chaînes de longueur 3 de 1 à 3 ?",
              "Combien le réseau a-t-il de triangles ?"
            ]
          },
          correction: {
            texte: [
              { titre: "1. A et A²" },
              { schema: [mAdj({ sommets: "1 2 3 4", aretes: "1-2 2-3 3-4 1-4 1-3" }, { titre: "A" }), mAdj({ sommets: "1 2 3 4", aretes: "1-2 2-3 3-4 1-4 1-3" }, { puissance: 2, titre: "A²" })] },
              { redaction: ["Par exemple `(A²)₁₃ = a₁₁a₁₃ + a₁₂a₂₃ + a₁₃a₃₃ + a₁₄a₄₃ = 0 + 1 + 0 + 1 = 2` : 1 et 3 ont deux voisins communs, 2 et 4."] },
              { titre: "2. A³" },
              { schema: mAdj({ sommets: "1 2 3 4", aretes: "1-2 2-3 3-4 1-4 1-3" }, { puissance: 3, titre: "A³ = A² × A", marques: { "1,3": "a" } }) },
              {
                redaction: [
                  "`(A³)₁₃ = ∑_k (A²)₁ₖ a_k3 = 3 × 1 + 1 × 1 + 2 × 0 + 1 × 1 = 5`.",
                  "Il y a 5 chaînes de longueur 3 de 1 à 3 : `(1,3,1,3)`, `(1,2,1,3)`, `(1,4,1,3)`, `(1,3,2,3)`, `(1,3,4,3)`."
                ]
              },
              { titre: "3. Triangles" },
              { redaction: ["`trace(A³) = 4 + 2 + 4 + 2 = 12`, donc `12 / 6 = 2` triangles : `{1; 2; 3}` et `{1; 3; 4}`."] }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Lire A²",
              enonce: "Pour le graphe du CM1, on a calculé A² ci-dessous. Combien y a-t-il de chaînes de longueur 2…",
              schema: [graphe(P_CM1, A_CM1), mAdj({ sommets: P_CM1, aretes: A_CM1 }, { puissance: 2, titre: "A²" })],
              champs: [
                { libelle: "… de 1 à 3 ?", reponse: 2, tolerance: 0 },
                { libelle: "… de 2 à 4 ?", reponse: 0, tolerance: 0 },
                { libelle: "… de 4 à 4 ?", reponse: 2, tolerance: 0 }
              ],
              explication: ["`(A²)₁₃ = 2` : `(1,2,3)` et `(1,5,3)`. `(A²)₂₄ = 0` : 2 et 4 sont voisins mais n'ont aucun voisin commun. `(A²)₄₄ = d(4) = 2`."]
            },
            {
              type: "matrice", niveau: 2,
              titre: "Calculer A²",
              enonce: "Remplissez la matrice A² de ce graphe.",
              schema: graphe(P_CARRE, "1-2 1-3 2-3 3-4"),
              graphe: { sommets: "1 2 3 4", aretes: "1-2 1-3 2-3 3-4" },
              puissance: 2,
              max: 3,
              indice: "Diagonale : les degrés. Hors diagonale : le nombre de voisins communs.",
              explication: ["Diagonale `2, 2, 3, 1` (les degrés). `(A²)₁₂ = 1` (voisin commun 3), `(A²)₁₄ = 1` (3), `(A²)₃₄ = 0`…"]
            },
            {
              type: "champs", niveau: 2,
              titre: "Chemins dans un graphe orienté",
              enonce: "Pour ce graphe orienté, combien y a-t-il de chemins…",
              schema: [oriente(P_PENTA, "1>2 2>3 3>1 3>4 4>5 5>3"), matrice({ lignes: "1 2 3 4 5", graphe: { sommets: "1 2 3 4 5", aretes: "1>2 2>3 3>1 3>4 4>5 5>3", oriente: true }, puissance: 3 }, { titre: "A³" })],
              champs: [
                { libelle: "… de longueur 2 de 2 à 4 ?", reponse: 1, tolerance: 0 },
                { libelle: "… de longueur 3 de 3 à 3 ?", reponse: 2, tolerance: 0 }
              ],
              explication: ["`(2, 3, 4)` est le seul chemin de longueur 2 de 2 à 4. `(A³)₃₃ = 2` : les circuits `(3, 1, 2, 3)` et `(3, 4, 5, 3)`."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Triangles de K₄",
              enonce: "Pour le graphe complet `K₄`, chaque coefficient diagonal de A³ vaut 6. Combien `K₄` a-t-il de triangles ?",
              schema: [graphe(P_CARRE, "1-2 1-3 1-4 2-3 2-4 3-4", { legende: "K₄" }), matrice({ lignes: "1 2 3 4", graphe: { sommets: "1 2 3 4", aretes: "1-2 1-3 1-4 2-3 2-4 3-4" }, puissance: 3 }, { titre: "A³" })],
              champs: [{ libelle: "Nombre de triangles", reponse: 4, tolerance: 0 }],
              explication: ["`trace(A³) = 4 × 6 = 24` et `24 / 6 = 4`. Vérification : un triangle par choix de 3 sommets parmi 4, `C(4, 3) = 4`."]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Un zéro dans A²",
              enonce: "Dans un graphe simple non orienté, `(A²)_ij = 0` pour deux sommets distincts i et j. Que peut-on affirmer ?",
              schema: graphe(P_CM1, A_CM1, { marques: { 2: "a", 4: "a" }, legende: "(A²)₂₄ = 0 alors que {2,4} est une arête" }),
              choix: [
                "i et j ne sont pas voisins.",
                "i et j n'ont aucun voisin commun.",
                "Il n'existe aucune chaîne de i à j."
              ],
              reponse: 1,
              explication: ["`(A²)_ij` compte les voisins communs. Dans le CM1, `(A²)₂₄ = 0` alors que 2 et 4 sont voisins, et il existe bien des chaînes de 2 à 4."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Tours fermés dans un carré",
              enonce: "Pour le cycle `C₄` (carré sans diagonale), combien y a-t-il de chaînes fermées de longueur 4 partant de 1 et revenant en 1 ?",
              schema: [graphe(P_CARRE, "1-2 2-3 3-4 1-4", { legende: "C₄" }), matrice({ lignes: "1 2 3 4", graphe: { sommets: "1 2 3 4", aretes: "1-2 2-3 3-4 1-4" }, puissance: 2 }, { titre: "A²" })],
              champs: [{ libelle: "`(A⁴)₁₁`", reponse: 8, tolerance: 0 }],
              indice: "`A⁴ = A² × A²` : calculez la première ligne de A² fois la première colonne de A².",
              explication: [
                "Ligne 1 de A² : `2 0 2 0`. Donc `(A⁴)₁₁ = 2 × 2 + 0 + 2 × 2 + 0 = 8`.",
                "Ce sont les 2 tours complets `(1,2,3,4,1)`, `(1,4,3,2,1)` et 6 allers-retours, comme `(1,2,1,2,1)`, `(1,2,1,4,1)`, `(1,2,3,2,1)`…"
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Graphe sans circuit et puissances nulles",
              enonce: "G est le chemin orienté `1 → 2 → 3 → 4`. Quel est le plus petit k tel que `A^k` soit la matrice nulle ?",
              schema: [oriente("1:0,0 2:1,0 3:2,0 4:3,0", "1>2 2>3 3>4"), matrice({ lignes: "1 2 3 4", graphe: { sommets: "1 2 3 4", aretes: "1>2 2>3 3>4", oriente: true }, puissance: 3 }, { titre: "A³" })],
              champs: [{ libelle: "k", reponse: 4, tolerance: 0 }],
              explication: [
                "`A³` contient encore un 1 (le chemin `(1, 2, 3, 4)` de longueur 3). Aucun chemin n'a de longueur 4 : `A⁴ = 0`.",
                "Plus généralement, G est sans circuit si et seulement si `Aⁿ = 0` (un chemin de longueur n repasserait par un sommet, donc contiendrait un circuit)."
              ]
            }
          ]
        },

        /* ---------- Leçon 9.3 ---------- */
        {
          type: "lecon",
          id: "gm-tanner",
          titre: "Graphes de Tanner et codes LDPC",
          description: "Contrôles de parité, matrice H, cycles de longueur 4 et décodage par bit flipping (TD2, ex. 4).",
          cours: [
            {
              titre: "Le contrôle de parité",
              texte: [
                "Pour détecter des erreurs de transmission, on ajoute une contrainte de **parité** : un mot binaire est accepté si son nombre de 1 est **pair**.",
                "Une seule erreur (un bit inversé) rend ce nombre impair : elle est détectée."
              ],
              schema: graphe("b1:0,0 b2:1,0 b3:2,0 b4:3,0 b5:4,0 c:2,1.2", "b1-c b2-c b3-c b4-c b5-c", { carres: "c", marques: { b1: "a", b3: "a", b4: "a", b5: "a" }, etiquettes: { b1: "1", b2: "0", b3: "1", b4: "1", b5: "1" }, legende: "(1, 0, 1, 1, 1) : quatre 1, accepté" }),
              redaction: ["`(1, 0, 1, 1, 1)` contient quatre 1 : il est accepté. `(1, 0, 1, 0, 1)` en contient trois : il est rejeté."]
            },
            {
              titre: "Le graphe de Tanner",
              texte: [
                "Les codes **LDPC** (Low-Density Parity-Check) imposent plusieurs contrôles, chacun sur peu de bits. On les représente par un **graphe de Tanner**, biparti :",
                ["des sommets **variables** `x₁, …, xₙ` (les bits, en ronds) ;", "des sommets de **contrôle** `c₁, …, c_m` (en carrés), avec une arête `{xᵢ, cⱼ}` si le bit `xᵢ` intervient dans `cⱼ`."],
                "Un contrôle est **satisfait** quand le nombre de ses voisins égaux à 1 est pair."
              ],
              schema: gTan({ legende: "TD2 : 7 bits, 4 contrôles" }),
              redaction: [
                "`c₁ : x₁, x₂, x₃, x₄` ; `c₂ : x₁, x₂, x₅, x₆` ; `c₃ : x₃, x₅, x₇` ; `c₄ : x₄, x₆, x₇`.",
                "Toute arête relie un bit à un contrôle : `({x₁, …, x₇}, {c₁, …, c₄})` est une partition en deux stables, le graphe est biparti."
              ]
            },
            {
              titre: "La matrice de parité H",
              texte: [
                "Le « tableau à deux dimensions » du TD2 : une **ligne par contrôle**, une **colonne par bit**, `H_ji = 1` si `xᵢ` intervient dans `cⱼ`.",
                "Degré d'un contrôle = somme de sa ligne ; degré d'un bit = somme de sa colonne. Peu de 1 par ligne et par colonne : c'est le « Low-Density »."
              ],
              schema: matrice({ lignes: CTRL, colonnes: BITS, valeurs: H_TD2 }, { titre: "H", legende: "Chaque colonne a deux 1, chaque ligne trois ou quatre" }),
              redaction: ["Chaque bit est de degré 2 ; `d(c₁) = d(c₂) = 4`, `d(c₃) = d(c₄) = 3`. Sur 28 cases, seules 14 valent 1."]
            },
            {
              titre: "Les cycles de longueur 4",
              texte: [
                "Un cycle de longueur 4 dans un graphe de Tanner alterne bit, contrôle, bit, contrôle : `x − c − x′ − c′ − x`.",
                "Il existe exactement quand **deux bits appartiennent aux deux mêmes contrôles** : dans H, deux colonnes ont des 1 sur deux mêmes lignes (un « rectangle » de 1)."
              ],
              schema: [
                gTan({ marques: { "x1-c1": "d", "x2-c1": "d", "x1-c2": "d", "x2-c2": "d" }, legende: "x₁ − c₁ − x₂ − c₂ − x₁" }),
                matrice({ lignes: CTRL, colonnes: BITS, valeurs: H_TD2 }, { marques: { "c1,x1": "d", "c1,x2": "d", "c2,x1": "d", "c2,x2": "d" }, legende: "Le rectangle de 1 correspondant" })
              ],
              redaction: [
                "`x₁` et `x₂` sont tous deux dans `c₁` et dans `c₂` : `(x₁, c₁, x₂, c₂, x₁)` est un cycle élémentaire de longueur 4.",
                "C'est le seul : les autres colonnes de H, prises deux à deux, n'ont qu'au plus une ligne de 1 en commun."
              ]
            },
            {
              titre: "Contrôles insatisfaits",
              texte: [
                "À la réception, on évalue chaque contrôle. Un bit faux rend insatisfaits **tous** ses contrôles (et seulement eux, s'il est seul faux).",
                "Les bits voisins de nombreux contrôles insatisfaits sont donc suspects."
              ],
              schema: gTan({ marques: { x1: "d", c1: "d", c2: "d" }, etiquettes: { x1: "1" }, legende: "Reçu (1, 0, 0, 0, 0, 0, 0) : c₁ et c₂ insatisfaits" }),
              redaction: ["Mot reçu `(1, 0, 0, 0, 0, 0, 0)` : `c₁` voit un seul 1 (`x₁`) et `c₂` aussi : insatisfaits. `c₃` et `c₄` ne voient aucun 1 : satisfaits."]
            },
            {
              titre: "Le décodage par bit flipping",
              texte: [
                "**Algorithme (TD2)** :",
                [
                  "1. déterminer les contrôles insatisfaits ;",
                  "2. pour chaque bit, compter ses contrôles voisins insatisfaits ;",
                  "3. inverser **simultanément** tout bit dont **strictement plus de la moitié** des contrôles voisins sont insatisfaits ;",
                  "4. recommencer jusqu'à ce que tout soit satisfait, ou qu'aucun bit ne change."
                ]
              ],
              schema: gTan({ marques: { x1: "d", x2: "d", c1: "d", c2: "d" }, legende: "x₁ et x₂ ont chacun 2 contrôles insatisfaits sur 2" }),
              redaction: ["Avec `(1, 0, 0, 0, 0, 0, 0)` : `x₁` et `x₂` ont 2 insatisfaits sur 2 voisins (> moitié) ; `x₃, …, x₆` en ont 1 sur 2 (pas strictement plus de la moitié) ; `x₇`, 0. On inverse `x₁` **et** `x₂`."]
            }
          ],
          problematique: {
            texte: [
              "Une liaison radio inverse parfois un bit. Le mot `(0, 0, 0, 0, 0, 0, 0)` est envoyé, mais une erreur inverse `x₁` : on reçoit `(1, 0, 0, 0, 0, 0, 0)`.",
              "Le décodage par bit flipping retrouve-t-il le mot envoyé ? Sinon, quelle structure du graphe de Tanner en est responsable ?"
            ],
            schema: gTan({ marques: { x1: "d" } })
          },
          exemple: {
            texte: ["Code du TD2 (exercice 4, questions 6 à 10), mot reçu `(1, 0, 0, 0, 0, 0, 0)`."],
            schema: gTan(),
            questions: [
              "Quels contrôles sont satisfaits ? insatisfaits ?",
              "Pour `x₁` et `x₂`, combien de contrôles voisins sont insatisfaits ?",
              "Quels bits sont inversés à la première itération ? Quel mot obtient-on ?",
              "Appliquer une seconde itération. Que se passe-t-il ?",
              "Expliquer pourquoi le cycle de longueur 4 est responsable de ce problème."
            ]
          },
          correction: {
            texte: [
              { titre: "1. Contrôles" },
              { redaction: ["`c₁` (`x₁ = 1`, les autres à 0) : un seul 1, **insatisfait**. `c₂` : un seul 1, **insatisfait**. `c₃` et `c₄` ne contiennent pas `x₁` : **satisfaits**."] },
              { titre: "2-3. Première itération" },
              {
                redaction: [
                  "`x₁` : voisins `c₁, c₂`, tous deux insatisfaits (2/2). `x₂` : voisins `c₁, c₂` également (2/2).",
                  "Les autres bits ont au plus 1 contrôle insatisfait sur 2 : ce n'est pas **strictement** plus de la moitié.",
                  "On inverse simultanément `x₁` et `x₂` : mot `(0, 1, 0, 0, 0, 0, 0)`."
                ]
              },
              { titre: "4. Seconde itération" },
              { redaction: ["Maintenant `x₂ = 1` : `c₁` et `c₂` sont de nouveau insatisfaits, `x₁` et `x₂` ont encore 2/2. On les inverse : retour à `(1, 0, 0, 0, 0, 0, 0)`. L'algorithme **oscille** indéfiniment et ne corrige jamais l'erreur."] },
              { schema: gTan({ marques: { "x1-c1": "d", "x2-c1": "d", "x1-c2": "d", "x2-c2": "d", x1: "d", x2: "d" } }) },
              { titre: "5. La faute au cycle de longueur 4" },
              { redaction: ["`x₁` et `x₂` appartiennent exactement aux mêmes contrôles `c₁, c₂` (le cycle `x₁ − c₁ − x₂ − c₂`). Vus des contrôles, ils sont **indiscernables** : une erreur sur l'un désigne aussi l'autre comme faux candidat, et les deux sont inversés ensemble."] }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Degrés dans le graphe de Tanner",
              enonce: "Donnez les degrés suivants dans le graphe de Tanner du TD2.",
              schema: gTan(),
              champs: [
                { libelle: "`d(x₁)`", reponse: 2, tolerance: 0 },
                { libelle: "`d(x₇)`", reponse: 2, tolerance: 0 },
                { libelle: "`d(c₁)`", reponse: 4, tolerance: 0 },
                { libelle: "`d(c₃)`", reponse: 3, tolerance: 0 }
              ],
              explication: ["Chaque bit est dans deux contrôles. `c₁` porte sur 4 bits, `c₃` sur 3. Les degrés sont faibles : c'est le « Low-Density »."]
            },
            {
              type: "matrice", niveau: 1,
              titre: "Écrire H",
              enonce: "Remplissez la matrice de parité H (une ligne par contrôle, une colonne par bit).",
              schema: gTan(),
              lignes: CTRL,
              colonnes: BITS,
              attendu: H_TD2,
              explication: ["Ligne `c₁` : 1 en `x₁…x₄` ; ligne `c₂` : `x₁, x₂, x₅, x₆` ; ligne `c₃` : `x₃, x₅, x₇` ; ligne `c₄` : `x₄, x₆, x₇`."]
            },
            {
              type: "selection", cible: "aretes", niveau: 2,
              titre: "Le cycle de longueur 4",
              enonce: "Sélectionnez les arêtes d'un cycle élémentaire de longueur 4 contenant `x₁` (TD2, question 4).",
              graphe: { sommets: P_TAN, aretes: A_TAN, carres: CTRL, unite: 70 },
              nomEnsemble: "C",
              regles: [{ regle: "cycle", longueur: 4 }],
              solution: "x1-c1 x2-c1 x1-c2 x2-c2",
              explication: ["`x₁ − c₁ − x₂ − c₂ − x₁` : `x₁` et `x₂` sont dans `c₁` et dans `c₂`. C'est le seul cycle de longueur 4 du graphe."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Une erreur sur x₃",
              enonce: "On envoie le mot nul et une erreur inverse `x₃` : on reçoit `(0, 0, 1, 0, 0, 0, 0)`.",
              schema: gTan({ marques: { x3: "d" } }),
              champs: [
                { libelle: "Contrôles insatisfaits", reponse: "{c1, c3}", ensemble: true },
                { libelle: "Bits inversés à la première itération", reponse: "{x3}", ensemble: true }
              ],
              explication: ["`x₃` est dans `c₁` et `c₃` : ils deviennent insatisfaits. `x₃` a 2/2 contrôles insatisfaits ; `x₁, x₂, x₄` (voisins de `c₁`) et `x₅, x₇` (voisins de `c₃`) n'en ont que 1/2. Seul `x₃` est inversé : l'erreur est corrigée en une itération."]
            },
            {
              type: "construire", niveau: 3,
              titre: "TD2 : le code en grille",
              enonce: "Neuf bits `x₁₁ … x₃₃` sont rangés en grille 3 × 3. On impose un contrôle de parité par ligne (`L₁, L₂, L₃`) et par colonne (`C₁, C₂, C₃`). Tracez le graphe de Tanner (question 11).",
              graphe: { sommets: P_GRILLE, carres: "L1 L2 L3 C1 C2 C3", unite: 70 },
              attendu: A_GRILLE,
              explication: ["`L_i` est relié aux trois bits de la ligne i, `C_j` aux trois bits de la colonne j : 18 arêtes. Chaque bit est de degré 2, chaque contrôle de degré 3."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Décoder une erreur sur x₂₂",
              enonce: "On envoie le mot nul du code en grille ; une erreur touche `x₂₂` (questions 16 à 19).",
              schema: gGrille({ marques: { x22: "d" } }),
              champs: [
                { libelle: "Contrôles insatisfaits", reponse: "{L2, C2}", ensemble: true },
                { libelle: "Contrôles insatisfaits voisins de `x₂₂`", reponse: 2, tolerance: 0 },
                { libelle: "Bits inversés à la première itération", reponse: "{x22}", ensemble: true }
              ],
              explication: [
                "`x₂₂` est dans `L₂` et `C₂` : 2/2 insatisfaits. Tout autre bit est dans une ligne et une colonne dont **au plus une** est `L₂` ou `C₂` (sinon il serait à l'intersection, donc ce serait `x₂₂`) : au plus 1/2.",
                "Seul `x₂₂` est inversé : le mot nul est retrouvé. Pas de faux candidat, car deux bits distincts ne partagent jamais deux contrôles : il n'y a pas de cycle de longueur 4."
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Combien d'information transporte la grille ?",
              enonce: "Pour le code en grille (question 15) : la somme (modulo 2) des trois contrôles de lignes et celle des trois contrôles de colonnes portent sur les mêmes bits. Combien de contraintes sont indépendantes, combien de bits d'information transporte le code, et combien a-t-il de mots de code ?",
              schema: gGrille(),
              champs: [
                { libelle: "Contraintes indépendantes", reponse: 5, tolerance: 0 },
                { libelle: "Bits d'information", reponse: 4, tolerance: 0 },
                { libelle: "Nombre de mots de code", reponse: 16, tolerance: 0 }
              ],
              explication: [
                "`L₁ + L₂ + L₃` et `C₁ + C₂ + C₃` valent tous deux la somme des 9 bits (modulo 2). Si les trois contrôles de lignes et deux contrôles de colonnes sont satisfaits, le troisième contrôle de colonne l'est donc automatiquement : une contrainte est redondante, il en reste 5 indépendantes.",
                "On peut choisir librement `x₁₁, x₁₂, x₂₁, x₂₂` (4 bits), le reste est imposé par les parités : `9 − 5 = 4` bits d'information, `2⁴ = 16` mots de code."
              ]
            },
            {
              type: "selection", cible: "aretes", niveau: 4,
              titre: "Le plus court cycle de la grille",
              enonce: "Le graphe de Tanner de la grille n'a aucun cycle de longueur 4 (ni 6). Sélectionnez les arêtes d'un cycle de longueur 8 (question 14).",
              graphe: { sommets: P_GRILLE, aretes: A_GRILLE, carres: "L1 L2 L3 C1 C2 C3", unite: 70 },
              nomEnsemble: "C",
              regles: [{ regle: "cycle", longueur: 8 }],
              solution: "x11-L1 x12-L1 x12-C2 x22-C2 x22-L2 x21-L2 x21-C1 x11-C1",
              explication: ["`x₁₁ − L₁ − x₁₂ − C₂ − x₂₂ − L₂ − x₂₁ − C₁ − x₁₁` : un « rectangle » de 4 bits dans la grille (deux lignes, deux colonnes)."]
            },
            {
              type: "qcm", niveau: 4,
              titre: "Deux erreurs dans la grille",
              enonce: "Code en grille, mot nul envoyé. Quelles affirmations sur le bit flipping sont vraies ?",
              schema: gGrille({ marques: { x11: "d", x22: "d" } }),
              choix: [
                "Avec deux erreurs sur `x₁₁` et `x₂₂`, l'algorithme oscille sans jamais corriger.",
                "Avec deux erreurs sur `x₁₁` et `x₁₂`, l'algorithme s'arrête sans rien inverser.",
                "Sans cycle de longueur 4, toute configuration de deux erreurs est corrigée."
              ],
              reponse: [0, 1],
              explication: [
                "`x₁₁, x₂₂` : `L₁, L₂, C₁, C₂` insatisfaits ; `x₁₁, x₁₂, x₂₁, x₂₂` ont tous 2/2 et sont inversés ensemble. On obtient les erreurs `x₁₂, x₂₁`, qui donnent les mêmes contrôles insatisfaits : retour au point de départ, oscillation.",
                "`x₁₁, x₁₂` : `L₁` voit deux 1 et reste satisfait ; seuls `C₁, C₂` sont insatisfaits ; aucun bit n'a plus de 1/2. L'algorithme s'arrête, erreurs non corrigées. C'est la remarque finale du TD : l'absence de 4-cycles ne suffit pas."
              ]
            }
          ]
        }
      ]
    },

    /* =====================================================
       CHAPITRE 10 — SYNTHÈSE, AU-DELÀ DES TD
       ===================================================== */
    {
      id: "ch10",
      titre: "Chapitre 10 — Synthèse : modéliser et prouver",
      description: "Choisir le bon objet, prouver qu'une solution est impossible ou optimale.",
      exercices: [
        {
          type: "lecon",
          id: "gm-synthese",
          titre: "Modéliser, résoudre, prouver",
          description: "La méthode complète sur des problèmes qui mélangent tous les chapitres.",
          cours: [
            {
              titre: "Modéliser en quatre questions",
              texte: [
                "Face à un énoncé, répondez dans l'ordre :",
                [
                  "**Qui sont les sommets ?** (personnes, machines, tâches, bits…) ;",
                  "**Qu'est-ce qu'un lien ?** (compatibles, incompatibles, « appelle », « avant »…) ;",
                  "**Orienté ou non ?** Le lien est-il symétrique ?",
                  "**Que cherche-t-on ?** Traduire la question en objet de graphe."
                ]
              ],
              schema: { type: "chaine", blocs: ["Énoncé", "Sommets\n+ liens", "Graphe\n(orienté ?)", "Objet\ncherché", "Preuve"], liens: ["", "", "", ""], accent: 3 },
              redaction: ["Exemple (TD2) : sommets = étudiants ; lien = « peuvent faire équipe » (symétrique) ; on cherche le plus grand ensemble d'équipes disjointes : un **couplage maximum**."]
            },
            {
              titre: "Le dictionnaire problème → objet",
              texte: [
                {
                  entetes: ["On cherche…", "Objet de graphe", "Chapitre"],
                  lignes: [
                    ["le plus grand groupe deux à deux compatible", "clique maximum", "4"],
                    ["le plus grand groupe sans aucun conflit", "stable maximum", "4"],
                    ["le plus de paires disjointes", "couplage maximum", "5"],
                    ["deux camps sans lien interne", "partition biparti", "5"],
                    ["relier tout le monde au moindre coût", "arbre couvrant", "6"],
                    ["qui peut joindre qui", "composantes connexes, parcours", "3, 7"],
                    ["les groupes en dépendance mutuelle", "composantes fortement connexes", "3, 8"],
                    ["un ordre qui respecte des « avant »", "ordre topologique", "8"]
                  ]
                }
              ],
              schema: graphe("1 2 3 4", "1-2 1-3 1-4 2-3 2-4 3-4", { disposition: "cercle", legende: "Clique, stable, couplage… le même graphe sert à tout" }),
              redaction: ["« Compatible » → on cherche des liens **présents** (clique) ; « incompatible » → on cherche des liens **absents** (stable)."]
            },
            {
              titre: "Prouver une impossibilité",
              texte: [
                "Les outils vus dans les chapitres précédents :",
                [
                  "**poignées de main** : `∑ d(i)` est pair ;",
                  "**degré** : `d(i) ≤ n − 1` dans un graphe simple ;",
                  "**connexité** : il faut au moins `n − 1` arêtes ;",
                  "**couplage** : au plus `⌊n/2⌋` arêtes ;",
                  "**biparti** : pas de cycle impair ;",
                  "**chemins** : un sommet sans prédécesseur ne peut être qu'au début."
                ]
              ],
              schema: graphe(P_PENTA, "1-2 2-3 3-4 4-5 1-5", { groupes: ["1 3 5", "2 4"], marques: { "1-5": "d" }, legende: "Un cycle impair : impossible de faire deux camps" }),
              redaction: ["Schéma de rédaction : « Supposons qu'un tel graphe existe. Alors … (outil). Or … : contradiction. Donc il n'existe pas. »"]
            },
            {
              titre: "Prouver qu'une solution est optimale",
              texte: [
                "Pour montrer qu'une solution de taille k est **la meilleure**, il faut deux choses :",
                ["**l'exhiber** (construction explicite) ;", "**une borne** prouvant qu'on ne peut pas faire mieux."],
                "Exemples de bornes : `⌊n/2⌋` pour un couplage, « un sommet par arête d'un couplage » pour une couverture, « au plus un sommet par clique » pour un stable."
              ],
              schema: graphe("1:0,0 2:1,0 3:0.5,0.9 4:1.6,1.5 5:2.6,1.5 6:2.1,2.4 7:3.3,2.6", "1-2 1-3 2-3 3-4 4-5 5-6 4-6 6-7", { marques: { 1: "c", 4: "c", 7: "c" }, legende: "Stable {1; 4; 7} : optimal car au plus 1 sommet par triangle" }),
              redaction: ["`{1; 4; 7}` est un stable de taille 3 (construction). Un stable contient au plus un sommet de `{1; 2; 3}`, au plus un de `{4; 5; 6}`, au plus 7 : taille ≤ 3 (borne). Il est donc maximum."]
            }
          ],
          problematique: {
            texte: [
              "Pour un exercice de crise cyber, 8 participants doivent être organisés. Le graphe relie deux personnes qui **ont déjà travaillé ensemble**.",
              "Les organisateurs veulent : des binômes d'anciens collègues ; le plus grand noyau où tout le monde se connaît ; le plus grand groupe « sans complicité » ; et peut-être deux équipes sans aucun ancien collègue dans la même équipe."
            ],
            schema: graphe("1 2 3 4 5 6 7 8", "1-2 1-3 2-3 2-4 3-4 4-5 5-6 5-7 6-7 6-8 7-8 1-8", { disposition: "cercle" })
          },
          exemple: {
            texte: ["Arêtes : `{1,2}, {1,3}, {2,3}, {2,4}, {3,4}, {4,5}, {5,6}, {5,7}, {6,7}, {6,8}, {7,8}, {1,8}`."],
            schema: graphe("1 2 3 4 5 6 7 8", "1-2 1-3 2-3 2-4 3-4 4-5 5-6 5-7 6-7 6-8 7-8 1-8", { disposition: "cercle" }),
            questions: [
              "Peut-on former 4 binômes d'anciens collègues ?",
              "Quelle est la taille du plus grand groupe où tous ont déjà travaillé ensemble ? Le prouver.",
              "Quelle est la taille du plus grand groupe où personne n'a travaillé avec personne ?",
              "Peut-on former deux équipes sans anciens collègues dans une même équipe ?"
            ]
          },
          correction: {
            texte: [
              { titre: "1. Couplage parfait" },
              { redaction: ["`{{1,3}; {2,4}; {5,7}; {6,8}}` est un couplage de 4 arêtes couvrant les 8 sommets : couplage **parfait**, 4 binômes."] },
              { schema: graphe("1 2 3 4 5 6 7 8", "1-2 1-3 2-3 2-4 3-4 4-5 5-6 5-7 6-7 6-8 7-8 1-8", { disposition: "cercle", marques: { "1-3": "c", "2-4": "c", "5-7": "c", "6-8": "c" } }) },
              { titre: "2. Clique maximum : 3" },
              {
                redaction: [
                  "`{1; 2; 3}` est une clique de taille 3 (construction).",
                  "Borne : tous les sommets sont de degré 3. Supposons une clique K de taille 4 : chaque sommet de K a ses 3 voisins dans K, donc aucun voisin hors de K. Aucune arête ne sort de K : K serait une composante connexe. Or le graphe est connexe et a 8 sommets : contradiction. **La clique maximum est de taille 3.**"
                ]
              },
              { titre: "3. Stable maximum : 3" },
              {
                redaction: [
                  "`{1; 4; 6}` est un stable (construction).",
                  "Borne : les triangles `{1; 2; 3}` et `{5; 6; 7}` contiennent chacun au plus un sommet du stable ; reste `{4; 8}`, qui donne au plus 2 sommets de plus. Si un stable avait 4 sommets, il contiendrait 4 et 8, plus un sommet de chaque triangle ; or les sommets de `{1; 2; 3}` non voisins de 4 et 8 : aucun (`1 ∼ 8`, `2 ∼ 4`, `3 ∼ 4`). Donc **au plus 3**."
                ]
              },
              { titre: "4. Deux équipes : impossible" },
              { redaction: ["Deux équipes sans ancien collègue interne = une partition en deux stables : le graphe serait biparti. Or `(1, 2, 3, 1)` est un cycle de longueur 3, impaire : **impossible**."] }
            ]
          },
          exercices: [
            {
              type: "qcm", niveau: 3,
              titre: "Réplication de serveurs",
              enonce: "Des serveurs se répliquent : un arc `(A, B)` signifie que A envoie ses données à B, directement. On cherche les groupes de serveurs qui finissent tous par avoir les données de tous les autres membres du groupe. Quel objet chercher ?",
              schema: oriente("1:0,0 2:1,0 3:0.5,0.9 4:2,0.5 5:3,0.5", "1>2 2>3 3>1 3>4 4>5 5>4"),
              choix: ["Les composantes connexes.", "Les composantes fortement connexes.", "Une clique maximum.", "Un arbre couvrant."],
              reponse: 1,
              explication: ["« A finit par recevoir les données de B » = il existe un chemin de B à A. Tous les membres reçoivent de tous : chemins dans les deux sens, c'est une composante fortement connexe (`{1; 2; 3}` et `{4; 5}` ici)."]
            },
            {
              type: "selection", niveau: 3,
              titre: "Le groupe sans complicité",
              enonce: "Dans le graphe de l'exemple, sélectionnez un groupe de taille maximum où personne n'a déjà travaillé avec personne.",
              graphe: { sommets: "1 2 3 4 5 6 7 8", aretes: "1-2 1-3 2-3 2-4 3-4 4-5 5-6 5-7 6-7 6-8 7-8 1-8", disposition: "cercle" },
              regles: [{ regle: "stable", maximum: true }],
              solution: "1 4 6",
              explication: ["Par exemple `{1; 4; 6}`, `{1; 4; 7}`, `{2; 5; 8}` ou `{3; 5; 8}` ; la correction montre qu'on ne peut pas dépasser 3."]
            },
            {
              type: "selection", cible: "aretes", niveau: 4,
              titre: "Quand le couplage parfait est impossible",
              enonce: "Cinq analystes, cinq incidents. `A₁`, `A₂`, `A₃` ne savent traiter que `I₁` ou `I₂`. Sélectionnez une affectation qui traite le plus d'incidents possible.",
              graphe: { sommets: "A1:0,0 A2:0,1 A3:0,2 A4:0,3 A5:0,4 I1:2.2,0 I2:2.2,1 I3:2.2,2 I4:2.2,3 I5:2.2,4", aretes: "A1-I1 A1-I2 A2-I1 A2-I2 A3-I1 A3-I2 A4-I3 A4-I4 A5-I4 A5-I5" },
              regles: [{ regle: "couplage", maximum: true }],
              solution: "A1-I1 A2-I2 A4-I3 A5-I4",
              explication: [
                "Au plus 4 : les trois analystes `A₁, A₂, A₃` n'ont que deux incidents possibles à eux trois, donc l'un d'eux reste sans incident (au plus 2 affectations pour eux, plus 2 pour `A₄, A₅`).",
                "Un ensemble d'analystes qui, ensemble, connaissent moins d'incidents qu'ils ne sont empêche tout couplage parfait (condition de Hall)."
              ]
            },
            {
              type: "construire", niveau: 4,
              titre: "Trois matchs chacun, sans triangle",
              enonce: "Construisez un graphe connexe sur 8 sommets où chaque sommet est de degré 3 et qui ne contient **aucun triangle**.",
              graphe: { sommets: "1 2 3 4 5 6 7 8", disposition: "cercle" },
              regles: [{ regle: "regulier", k: 3 }, { regle: "connexe" }, { regle: "sansCycleLongueur", l: 3 }],
              solution: "1-2 2-3 3-4 4-5 5-6 6-7 7-8 1-8 1-5 2-6 3-7 4-8",
              indice: "Partez du cycle des 8 sommets (degré 2 partout) et reliez chaque sommet à son opposé.",
              explication: ["Le cycle `1 − 2 − … − 8 − 1` plus les 4 « diamètres » `{1,5}, {2,6}, {3,7}, {4,8}` : degré 3 partout, et aucun triangle (deux sommets voisins n'ont aucun voisin commun). Le cube convient aussi."]
            },
            {
              type: "remettre", niveau: 4,
              titre: "Rédiger : pas de clique de taille 4",
              enonce: "Remettez dans l'ordre la preuve de la question 2 de l'exemple : « un graphe connexe d'ordre 8 dont tous les sommets sont de degré 3 ne contient pas de clique de taille 4 ».",
              etapes: [
                "Supposons que G contienne une clique K de taille 4.",
                "Chaque sommet de K a 3 voisins dans K ; comme il est de degré 3, il n'a aucun voisin hors de K.",
                "Aucune arête ne relie donc K au reste du graphe : `G[K]` est une composante connexe de G.",
                "Or G est connexe et a 8 sommets : sa seule composante a 8 sommets, pas 4. Contradiction : G n'a pas de clique de taille 4. □"
              ],
              explication: ["Un argument de degré transforme « clique » en « composante » : il ne reste qu'à contredire la connexité."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Le seuil de connexité",
              enonce: "À partir de combien d'arêtes un graphe simple à 10 sommets est-il **forcément** connexe ?",
              schema: graphe("1 2 3 4 5 6 7 8 9 10", "", { disposition: "cercle", marques: { 10: "d" }, legende: "Le pire cas : 9 sommets très reliés, un sommet seul" }),
              champs: [{ libelle: "Nombre minimal d'arêtes garantissant la connexité", reponse: 37, tolerance: 0 }],
              indice: "Cherchez d'abord le plus grand nombre d'arêtes d'un graphe simple **non** connexe à 10 sommets (leçon 3.1).",
              explication: [
                "Un graphe non connexe a ses sommets répartis en deux groupes sans arête entre eux : au plus `C(a, 2) + C(b, 2)` arêtes avec `a + b = 10`, maximum pour `(9, 1)` : `36` arêtes (`K₉` plus un sommet isolé).",
                "Avec 37 arêtes, le graphe ne peut plus être non connexe : il l'est forcément. Et 36 ne suffit pas (`K₉` + sommet isolé)."
              ]
            }
          ]
        }
      ]
    }
  );
})();
