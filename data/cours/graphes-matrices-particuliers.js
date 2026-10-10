/* =============================================================
   Introduction aux graphes et aux matrices — chapitres 4 à 6
   Graphes particuliers (CM2, TD1 ex. 3, TD2 ex. 1 à 3) :
   complets, cliques, stables, bipartis, couplages, arbres.
   Complète CONTENU["graphes-matrices"] (voir graphes-matrices.js).
   ============================================================= */

(() => {
  const graphe = (sommets, aretes, plus) => Object.assign({ type: "graphe", sommets, aretes }, plus || {});
  const oriente = (sommets, arcs, plus) => Object.assign({ type: "graphe", oriente: true, sommets, aretes: arcs }, plus || {});

  const K = (n) => {
    const a = [];
    for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) a.push(i + "-" + j);
    return a.join(" ");
  };
  const CERCLE = (n) => Array.from({ length: n }, (_, k) => String(k + 1)).join(" ");

  /* CM2 */
  const P_CLIQUE = "4:1,0 5:2,0 7:3,0 2:0,1 1:1.45,1 3:1,2 6:2,2 8:3,2";
  const A_CLIQUE = "1-2 1-3 1-4 2-3 2-4 3-4 1-5 1-6 4-5 5-6 3-6 5-7 5-8 6-7 6-8 7-8";
  const P_STABLE = "4:1,0 7:2,0 2:0,1 1:1,1 5:2,1 8:3,1 3:1,2 6:2,2";
  const A_STABLE = "1-2 1-3 1-4 1-5 5-6 5-7 5-8";
  const P_BIP = "1:0,0 2:1,0 3:2,0 5:0,1 4:1,1 7:2,1 6:1,2";
  const A_BIP = "1-2 2-3 1-4 3-4 4-5 4-6 3-7";
  const P_COUPL = "1:0,0 2:1,0 3:2,0 4:0,1 5:1,1 6:2,1 7:0,2 8:1,2 9:2,2";
  const A_COUPL = "1-2 2-3 1-4 1-6 3-4 4-5 5-7 5-8 6-8 6-9";
  /* TD2 */
  const S_MOD = "m1 m2 m3 m4 m5 m6 m7 m8";
  const A_MOD = "m1-m2 m1-m4 m1-m5 m1-m6 m1-m7 m1-m8 m2-m3 m2-m5 m3-m4 m4-m5 m4-m6 m4-m8 m5-m6 m6-m7 m7-m8";
  const A_CTF = "1-6 1-8 1-10 2-3 2-4 3-6 4-8 4-9 5-9 5-10 7-10";
  const P_CTF_DEUX = "1:0,0 3:0,1 4:0,2 5:0,3 7:0,4 2:2.4,0 6:2.4,1 8:2.4,2 9:2.4,3 10:2.4,4";
  const P_SOC = "A1:0,0 A2:0,1 A3:0,2 A4:0,3 I1:2.2,0 I2:2.2,1 I3:2.2,2 I4:2.2,3";
  const A_SOC = "A1-I1 A1-I2 A2-I1 A3-I2 A3-I3 A4-I3 A4-I4";
  /* Divers */
  const P_PENTA = "1:1,0 2:2,0.75 3:1.6,1.9 4:0.4,1.9 5:0,0.75";
  const P_HEXA = "1:1,0 2:2,0.55 3:2,1.65 4:1,2.2 5:0,1.65 6:0,0.55";
  const P_CUBE = "1:0,0 2:3,0 3:3,3 4:0,3 5:1,1 6:2,1 7:2,2 8:1,2";
  const A_CUBE = "1-2 2-3 3-4 1-4 5-6 6-7 7-8 5-8 1-5 2-6 3-7 4-8";
  const P_CAMPUS = "1:0,0 2:1.2,0 3:2.4,0 4:0,1.2 5:1.2,1.2 6:2.4,1.2 7:1.2,2.3";
  const A_CAMPUS = "1-2 2-3 1-4 2-5 3-6 4-5 5-6 4-7 6-7 5-7";
  const P_TRI3 = "1:0.5,0 2:0,0.9 3:1,0.9";

  const gMod = (plus) => graphe(S_MOD, A_MOD, Object.assign({ disposition: "cercle" }, plus || {}));
  const gSoc = (plus) => graphe(P_SOC, A_SOC, plus);

  CONTENU["graphes-matrices"].chapitres.push(

    /* =====================================================
       CHAPITRE 4 — COMPLETS, CLIQUES ET STABLES
       ===================================================== */
    {
      id: "ch4",
      titre: "Chapitre 4 — Graphes complets, cliques et stables",
      description: "Dénombrer les arêtes, modéliser des groupes compatibles ou incompatibles.",
      exercices: [

        /* ---------- Leçon 4.1 ---------- */
        {
          type: "lecon",
          id: "gm-complet",
          titre: "Graphe complet et dénombrement",
          description: "Kₙ, n(n − 1)/2 arêtes, variantes orientées et avec boucles, nombre de graphes simples.",
          cours: [
            {
              titre: "Le graphe complet Kₙ",
              texte: [
                "Un graphe simple non orienté est **complet** si **toute paire** de sommets est reliée par une arête.",
                "On note `Kₙ` le graphe complet d'ordre n : chaque sommet est voisin de tous les autres, il est de degré `n − 1`."
              ],
              schema: [graphe(CERCLE(4), K(4), { disposition: "cercle", legende: "K₄" }), graphe(CERCLE(5), K(5), { disposition: "cercle", legende: "K₅" })],
              redaction: ["Dans `K₅`, chaque sommet a 4 voisins : `d(i) = 4` pour tout i."]
            },
            {
              titre: "Combien d'arêtes ? n(n − 1)/2",
              texte: [
                "**Proposition (CM2).** Le graphe complet d'ordre n possède `n(n − 1)/2` arêtes.",
                "C'est le coefficient binomial `C(n, 2) = n! / (2!(n − 2)!)` : le nombre de façons de choisir 2 sommets parmi n."
              ],
              schema: graphe(CERCLE(5), K(5), { disposition: "cercle", etiquettes: { 1: "d=4", 2: "d=4", 3: "d=4", 4: "d=4", 5: "d=4" }, legende: "5 × 4 / 2 = 10 arêtes" }),
              redaction: [
                "Dénombrons les couples `(i, j) ∈ V²` avec `i ≠ j` : n choix pour i, puis `n − 1` pour j, soit `n(n − 1)` couples.",
                "Dans un graphe non orienté, `(i, j)` et `(j, i)` désignent la même arête `{i, j}` : chaque arête a été comptée deux fois.",
                "D'où `|E| = n(n − 1)/2`. □",
                "(Autre preuve : poignées de main, `∑ d(i) = n(n − 1) = 2|E|`.)"
              ]
            },
            {
              titre: "Variantes : orienté, avec boucles",
              texte: [
                "L'exercice du CM2 généralise la notion :",
                {
                  entetes: ["Graphe « complet »", "Ce qu'on compte", "Nombre"],
                  lignes: [
                    ["non orienté simple", "paires `{i, j}`, `i ≠ j`", "`n(n − 1)/2`"],
                    ["non orienté avec boucles", "paires + n boucles", "`n(n + 1)/2`"],
                    ["orienté sans boucle", "couples `(i, j)`, `i ≠ j`", "`n(n − 1)`"],
                    ["orienté avec boucles", "tous les couples `(i, j)`", "`n²`"]
                  ]
                }
              ],
              schema: oriente(P_TRI3, "1>2 2>1 1>3 3>1 2>3 3>2", { legende: "Orienté complet d'ordre 3 : 3 × 2 = 6 arcs" }),
              redaction: ["Graphe orienté complet sans boucle d'ordre 3 : chaque couple `(i, j)` avec `i ≠ j` est un arc, soit `3 × 2 = 6` arcs."]
            },
            {
              titre: "Le maximum d'arêtes d'un graphe simple",
              texte: [
                "Tout graphe simple d'ordre n est un graphe partiel de `Kₙ` : il a donc **au plus** `n(n − 1)/2` arêtes (TD1, exercice 3.1).",
                "Le maximum est atteint par `Kₙ` lui-même."
              ],
              schema: graphe(CERCLE(5), K(5), { disposition: "cercle", marques: { "1-3": "e", "1-4": "e", "2-4": "e", "2-5": "e", "3-5": "e" }, legende: "Un graphe simple (traits pleins) dans K₅" }),
              redaction: ["Les arêtes d'un graphe simple sont des paires distinctes de sommets : il y en a au plus `C(n, 2) = n(n − 1)/2`."]
            },
            {
              titre: "Combien de graphes simples différents ?",
              texte: [
                "Sommets fixés `{1, …, n}` : chacune des `n(n − 1)/2` paires est **présente ou absente**, indépendamment des autres.",
                "Il y a donc `2^(n(n − 1)/2)` graphes simples sur n sommets numérotés (TD1, exercice 3.2). Pour n = 3 : `2³ = 8`."
              ],
              schema: ["", "1-2", "1-3", "2-3", "1-2 1-3", "1-2 2-3", "1-3 2-3", "1-2 1-3 2-3"].map((a) => graphe(P_TRI3, a, { unite: 46 })),
              redaction: ["Sur 3 sommets, 3 paires possibles, chacune présente ou absente : `2 × 2 × 2 = 2³ = 8` graphes simples."]
            }
          ],
          problematique: {
            texte: [
              "Un championnat « toutes rondes » réunit 20 équipes : chaque équipe rencontre chacune des autres.",
              "Combien de matchs faut-il programmer ? Et si chaque rencontre se joue en aller-retour (une fois à domicile, une fois à l'extérieur) ?"
            ],
            schema: graphe(CERCLE(6), K(6), { disposition: "cercle", legende: "Avec 6 équipes : 15 matchs" })
          },
          exemple: {
            texte: ["On note n = 20 le nombre d'équipes."],
            questions: [
              "Quel graphe modélise les matchs aller ? Combien a-t-il d'arêtes ?",
              "Quel graphe modélise les matchs aller-retour ? Combien a-t-il d'arcs ?",
              "Combien de matchs joue chaque équipe sur la saison aller-retour ?"
            ],
            schema: oriente(P_TRI3, "1>2 2>1 1>3 3>1 2>3 3>2", { legende: "Aller-retour : un arc (domicile → extérieur) par sens" })
          },
          correction: {
            texte: [
              { titre: "1. Matchs aller" },
              { redaction: ["Sommets : les équipes ; arête `{i, j}` : le match entre i et j. Toutes les paires jouent : c'est `K₂₀`.", "`|E| = 20 × 19 / 2 = 190` matchs."] },
              { titre: "2. Aller-retour" },
              { redaction: ["On distingue le match « i reçoit j » de « j reçoit i » : arc `(i, j)` pour un match chez i. C'est le graphe orienté complet sans boucle : `20 × 19 = 380` matchs."] },
              { titre: "3. Matchs par équipe" },
              { redaction: ["Chaque équipe reçoit les 19 autres et se déplace chez elles : `d⁺(i) + d⁻(i) = 19 + 19 = 38` matchs."] }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Arêtes de Kₙ",
              enonce: "Combien d'arêtes ont les graphes complets suivants ?",
              schema: graphe(CERCLE(6), K(6), { disposition: "cercle", legende: "K₆" }),
              champs: [
                { libelle: "`K₆`", reponse: 15, tolerance: 0 },
                { libelle: "`K₁₀`", reponse: 45, tolerance: 0 }
              ],
              explication: ["`6 × 5 / 2 = 15` et `10 × 9 / 2 = 45`."]
            },
            {
              type: "construire", niveau: 1,
              titre: "Tracer K₅",
              enonce: "Tracez le graphe complet `K₅`.",
              graphe: { sommets: P_PENTA },
              attendu: K(5),
              explication: ["Les 10 paires de sommets sont reliées ; chaque sommet est de degré 4."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Graphes orientés complets",
              enonce: "Combien d'arcs possède le graphe orienté complet d'ordre 7…",
              schema: oriente(P_TRI3, "1>1 2>2 3>3 1>2 2>1 1>3 3>1 2>3 3>2", { legende: "Ordre 3 avec boucles : 3² = 9 arcs" }),
              champs: [
                { libelle: "… sans boucle ?", reponse: 42, tolerance: 0 },
                { libelle: "… avec boucles ?", reponse: 49, tolerance: 0 }
              ],
              explication: ["Sans boucle : `7 × 6 = 42` couples `(i, j)` avec `i ≠ j`. Avec boucles : tous les couples, `7² = 49`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Nombre de graphes simples",
              enonce: "Combien existe-t-il de graphes simples différents sur des sommets numérotés…",
              schema: ["", "1-2", "1-2 1-3", "1-2 1-3 2-3"].map((a) => graphe(P_TRI3, a, { unite: 46 })),
              champs: [
                { libelle: "… à 3 sommets ?", reponse: 8, tolerance: 0 },
                { libelle: "… à 4 sommets ?", reponse: 64, tolerance: 0 }
              ],
              explication: ["3 sommets ont 3 paires : `2³ = 8`. 4 sommets ont `4 × 3 / 2 = 6` paires : `2⁶ = 64`."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Retrouver n",
              enonce: "Un graphe complet possède 66 arêtes. Quel est son ordre ?",
              schema: graphe(CERCLE(12), "", { disposition: "cercle" }),
              champs: [{ libelle: "Ordre n", reponse: 12, tolerance: 0 }],
              explication: ["`n(n − 1)/2 = 66` donne `n(n − 1) = 132 = 12 × 11` : n = 12."]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Degré dans Kₙ",
              enonce: "Que peut-on dire des degrés de `Kₙ` ?",
              schema: graphe(CERCLE(5), K(5), { disposition: "cercle" }),
              choix: [
                "Tous les sommets sont de degré n.",
                "Tous les sommets sont de degré n − 1.",
                "Les degrés dépendent du dessin."
              ],
              reponse: 1,
              explication: ["Chaque sommet est relié à tous les autres, soit `n − 1` voisins. Contrôle : `n(n − 1) = 2|E|`."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Graphes à 3 arêtes sur 4 sommets",
              enonce: "Sur 4 sommets numérotés, combien de graphes simples ont exactement 3 arêtes ? Parmi eux, combien sont des arbres (connexes et sans cycle) ?",
              schema: [graphe("1:0,0 2:1,0 3:1,1 4:0,1", "1-2 2-3 1-3", { legende: "Un triangle et un sommet isolé" }), graphe("1:0,0 2:1,0 3:1,1 4:0,1", "1-2 2-3 3-4", { legende: "Un arbre" })],
              champs: [
                { libelle: "Graphes à 3 arêtes", reponse: 20, tolerance: 0 },
                { libelle: "Dont arbres", reponse: 16, tolerance: 0 }
              ],
              indice: "On choisit 3 paires parmi 6. Un graphe à 3 arêtes sur 4 sommets qui n'est pas un arbre contient un cycle : lequel ?",
              explication: [
                "`C(6, 3) = 20` façons de choisir 3 arêtes parmi les 6 paires.",
                "Trois arêtes formant un cycle, c'est un triangle (et un sommet isolé) : 4 cas, un par sommet laissé seul. Sinon, 3 arêtes sans cycle sur 4 sommets forment un arbre (`n − 1` arêtes, sans cycle). Il reste `20 − 4 = 16` arbres."
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Graphes simples sur 5 sommets",
              enonce: "Combien y a-t-il de graphes simples sur 5 sommets numérotés ? Parmi eux, combien ont exactement 2 arêtes ? Et combien ont exactement 8 arêtes ?",
              schema: graphe(P_PENTA, K(5), { marques: { "1-2": "a", "3-4": "a" }, legende: "K₅ : 10 paires possibles" }),
              champs: [
                { libelle: "Graphes simples sur 5 sommets", reponse: 1024, tolerance: 0 },
                { libelle: "Avec exactement 2 arêtes", reponse: 45, tolerance: 0 },
                { libelle: "Avec exactement 8 arêtes", reponse: 45, tolerance: 0 }
              ],
              explication: [
                "`5 × 4 / 2 = 10` paires, chacune présente ou absente : `2¹⁰ = 1024`.",
                "Choisir 2 arêtes parmi 10 : `C(10, 2) = 45`. Choisir 8 arêtes revient à choisir les 2 paires **absentes** : encore 45."
              ]
            }
          ]
        },

        /* ---------- Leçon 4.2 ---------- */
        {
          type: "lecon",
          id: "gm-cliques",
          titre: "Cliques et stables",
          description: "Groupes tous compatibles, groupes sans conflit : modéliser et chercher le plus grand (TD2, ex. 1).",
          cours: [
            {
              titre: "Une clique",
              texte: [
                "Dans un graphe simple, une **clique** est un ensemble de sommets `K ⊆ V` dont le sous-graphe engendré `G[K]` est **complet** : toute paire de K est reliée.",
                "Sa **taille** est son nombre de sommets."
              ],
              schema: graphe(P_CLIQUE, A_CLIQUE, { marques: { 1: "a", 2: "a", 3: "a", 4: "a", "1-2": "a", "1-3": "a", "1-4": "a", "2-3": "a", "2-4": "a", "3-4": "a" }, legende: "CM2, figure 1 : V₁ = {1; 2; 3; 4}" }),
              redaction: ["`V₁ = {1; 2; 3; 4}` est une clique de taille 4 : les 6 paires `{1,2}`, `{1,3}`, `{1,4}`, `{2,3}`, `{2,4}`, `{3,4}` sont des arêtes."]
            },
            {
              titre: "Clique ou pas ?",
              texte: [
                "Pour montrer qu'un ensemble **n'est pas** une clique, il suffit d'une paire non reliée.",
                "Tout sommet seul est une clique (de taille 1)."
              ],
              schema: graphe(P_CLIQUE, A_CLIQUE, { marques: { 5: "b", 6: "b", 7: "b", 8: "b", "5-6": "b", "5-7": "b", "5-8": "b", "6-7": "b", "6-8": "b", "7-8": "b" }, legende: "V₄ = {5; 6; 7; 8} en orange" }),
              redaction: [
                "`V₃ = {1; 5; 6}` est une clique de taille 3 ; `V₄ = {5; 6; 7; 8}` est une clique de taille 4 ; `V₅ = {2}` est une clique de taille 1.",
                "`V₂ = {1; 2; 3; 4; 5; 6}` n'est pas une clique : `{2, 5}` n'est pas une arête."
              ]
            },
            {
              titre: "Un stable",
              texte: [
                "Un **stable** est un ensemble de sommets dont **aucune** paire n'est reliée.",
                "C'est l'inverse d'une clique : on cherche des sommets deux à deux « sans lien »."
              ],
              schema: graphe(P_STABLE, A_STABLE, { marques: { 2: "c", 3: "c", 4: "c", 6: "c", 7: "c", 8: "c" }, legende: "CM2, figure 2 : V₄ = {2; 3; 4; 6; 7; 8}" }),
              redaction: [
                "`V₁ = {2; 4; 5}` est un stable de taille 3 ; `V₄ = {2; 3; 4; 6; 7; 8}` est un stable de taille 6.",
                "`V₂ = {2; 3; 5; 7}` n'est pas un stable : `{5, 7}` est une arête."
              ]
            },
            {
              titre: "Clique de G = stable du complémentaire",
              texte: [
                "Le **complémentaire** `Ḡ` a les mêmes sommets que G et relie exactement les paires **non** reliées dans G.",
                "K est une clique de G si et seulement si K est un stable de `Ḡ` : les deux problèmes sont les mêmes, vus à l'envers."
              ],
              schema: [
                graphe("1:0,0 2:1,0 3:1,1 4:0,1", "1-2 2-3 3-4", { marques: { 1: "a", 2: "a" }, legende: "G : {1; 2} est une clique" }),
                graphe("1:0,0 2:1,0 3:1,1 4:0,1", "1-3 1-4 2-4", { marques: { 1: "a", 2: "a" }, legende: "Ḡ : {1; 2} est un stable" })
              ],
              redaction: ["`{1, 2}` est une arête de G, donc pas une arête de `Ḡ` : `{1; 2}` est une clique de G et un stable de `Ḡ`."]
            },
            {
              titre: "Modéliser avec une clique ou un stable",
              texte: [
                "Les deux exemples de modélisation du CM2 :",
                [
                  "**réseau social professionnel** : sommets = utilisateurs, arête = « ont déjà travaillé ensemble » ; le plus grand groupe où tous ont travaillé ensemble est une **clique de taille maximum** ;",
                  "**antennes** : sommets = sites, arête = « à moins de 500 m » (incompatibles) ; un ensemble d'antennes installables est un **stable**, on en cherche un de taille maximum."
                ],
                "Règle : si l'arête dit « compatible », on cherche une clique ; si elle dit « incompatible », on cherche un stable."
              ],
              schema: graphe("s1:0,0 s2:1,0.3 s3:2,0 s4:0.4,1.1 s5:1.6,1.1 s6:1,1.9", "s1-s2 s2-s3 s1-s4 s2-s4 s2-s5 s3-s5 s4-s6 s5-s6", { marques: { s1: "c", s3: "c", s6: "c" }, legende: "Sites trop proches reliés ; un stable de taille 3 en vert" }),
              redaction: ["`{s₁; s₃; s₆}` est un stable : aucune paire de ces sites n'est à moins de 500 m, on peut y installer trois antennes."]
            }
          ],
          problematique: {
            texte: [
              "Une entreprise de cybersécurité envisage d'acheter un logiciel de pentest, extensible par 8 modules communautaires `m₁, …, m₈` (TD2, exercice 1).",
              "Certains modules sont incompatibles entre eux ou redondants. L'entreprise veut connaître le **nombre maximum de modules utilisables simultanément**."
            ],
            schema: { type: "matrice", lignes: S_MOD, titre: "Compatibilités (1 = compatibles)", graphe: { sommets: S_MOD, aretes: A_MOD } }
          },
          exemple: {
            texte: ["Le tableau des compatibilités du TD2 est reproduit ci-dessous (1 = les deux modules sont compatibles)."],
            schema: { type: "matrice", lignes: S_MOD, graphe: { sommets: S_MOD, aretes: A_MOD } },
            questions: [
              "Modéliser ce problème sous la forme d'un graphe.",
              "Quel type de sous-graphe correspond à un ensemble de modules compatibles ?",
              "Quel problème faut-il résoudre ?",
              "Est-il possible d'utiliser 4 modules simultanément ? 5 modules ?"
            ]
          },
          correction: {
            texte: [
              { titre: "1-3. Modélisation" },
              {
                redaction: [
                  "Sommets : les 8 modules. Arête `{mᵢ, mⱼ}` si les deux modules sont compatibles (un « 1 » du tableau).",
                  "Un ensemble de modules utilisables ensemble est un ensemble deux à deux compatibles : une **clique**.",
                  "Le nombre maximum de modules utilisables est la taille d'une **clique maximum** du graphe."
                ]
              },
              { schema: gMod({ legende: "Le graphe de compatibilité" }) },
              { titre: "4. Quatre modules : oui" },
              { redaction: ["`{m₁; m₄; m₅; m₆}` est une clique : `{m₁,m₄}`, `{m₁,m₅}`, `{m₁,m₆}`, `{m₄,m₅}`, `{m₄,m₆}`, `{m₅,m₆}` sont des arêtes. On peut utiliser 4 modules."] },
              { schema: gMod({ marques: { m1: "a", m4: "a", m5: "a", m6: "a", "m1-m4": "a", "m1-m5": "a", "m1-m6": "a", "m4-m5": "a", "m4-m6": "a", "m5-m6": "a" } }) },
              { titre: "Cinq modules : non" },
              {
                redaction: [
                  "Dans une clique de taille 5, chaque sommet a au moins 4 voisins (les 4 autres) : il faut `d(mᵢ) ≥ 4`.",
                  "Degrés : `d(m₁) = 6`, `d(m₂) = 3`, `d(m₃) = 2`, `d(m₄) = 5`, `d(m₅) = 4`, `d(m₆) = 4`, `d(m₇) = 3`, `d(m₈) = 3`.",
                  "Seuls m₁, m₄, m₅, m₆ ont un degré ≥ 4 : impossible d'en trouver 5. **La clique maximum est de taille 4.**"
                ]
              }
            ]
          },
          exercices: [
            {
              type: "selection", niveau: 1,
              titre: "Une clique de taille 4",
              enonce: "Sélectionnez une clique de taille 4 du graphe du CM2.",
              graphe: { sommets: P_CLIQUE, aretes: A_CLIQUE },
              nomEnsemble: "K",
              regles: [{ regle: "clique", taille: 4 }],
              solution: "5 6 7 8",
              explication: ["Deux réponses : `{1; 2; 3; 4}` et `{5; 6; 7; 8}`."]
            },
            {
              type: "selection", niveau: 1,
              titre: "Un stable de taille 4",
              enonce: "Sélectionnez un stable de taille 4 du graphe ci-dessous.",
              graphe: { sommets: P_STABLE, aretes: A_STABLE },
              regles: [{ regle: "stable", taille: 4 }],
              solution: "3 4 6 7",
              explication: ["Par exemple `{3; 4; 6; 7}` (exemple du CM2) : aucune arête entre eux."]
            },
            {
              type: "selection", niveau: 2,
              titre: "Le plus grand stable",
              enonce: "Sélectionnez un stable de taille **maximum** de ce graphe.",
              graphe: { sommets: P_STABLE, aretes: A_STABLE },
              regles: [{ regle: "stable", maximum: true }],
              solution: "2 3 4 6 7 8",
              explication: ["`{2; 3; 4; 6; 7; 8}`, de taille 6. Un stable contenant 1 exclut 2, 3, 4, 5 ; un stable contenant 5 exclut 1, 6, 7, 8 : les deux font au plus 4 sommets."]
            },
            {
              type: "selection", niveau: 2,
              titre: "TD2 : quatre modules compatibles",
              enonce: "Sélectionnez un ensemble de modules **tous compatibles** de taille maximum.",
              graphe: { sommets: S_MOD, aretes: A_MOD, disposition: "cercle" },
              nomEnsemble: "K",
              regles: [{ regle: "clique", maximum: true }],
              solution: "m1 m4 m5 m6",
              explication: ["La seule clique de taille 4 est `{m₁; m₄; m₅; m₆}` (seuls sommets de degré ≥ 4)."]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Quel objet chercher ?",
              enonce: "On veut affecter des créneaux de surveillance : deux analystes « en conflit » (arête) ne peuvent pas être de garde ensemble. On cherche le plus grand groupe d'analystes de garde simultanément. Que cherche-t-on ?",
              schema: graphe("1:0,0 2:1,0 3:2,0 4:0.5,1 5:1.5,1", "1-2 2-3 1-4 2-4 2-5 3-5"),
              choix: ["Une clique de taille maximum.", "Un stable de taille maximum.", "Un couplage."],
              reponse: 1,
              explication: ["Les arêtes expriment une **incompatibilité** : un groupe autorisé ne contient aucune arête, c'est un stable. Ici, par exemple `{4; 5}`."]
            },
            {
              type: "selection", niveau: 3,
              titre: "Antennes : le maximum",
              enonce: "Sept sites d'antennes ; une arête relie deux sites trop proches. Sélectionnez le plus grand ensemble de sites où installer des antennes.",
              graphe: { sommets: "1:0,0 2:1,0 3:0.5,0.9 4:1.6,1.5 5:2.6,1.5 6:2.1,2.4 7:3.3,2.6", aretes: "1-2 1-3 2-3 3-4 4-5 5-6 4-6 6-7" },
              regles: [{ regle: "stable", maximum: true }],
              solution: "1 4 7",
              indice: "Un stable contient au plus un sommet de chaque triangle.",
              explication: ["Au plus un sommet dans `{1; 2; 3}`, au plus un dans `{4; 5; 6}`, plus éventuellement 7 : au plus 3. `{1; 4; 7}` (ou `{2; 5; 7}`…) atteint 3."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Le cycle C₅",
              enonce: "Pour le cycle `C₅` ci-dessous, donnez la taille d'une plus grande clique et d'un plus grand stable. Puis : si un graphe G a une clique maximum de taille 4, quelle est la taille d'un plus grand stable de son complémentaire `Ḡ` ?",
              schema: graphe(P_PENTA, "1-2 2-3 3-4 4-5 1-5", { legende: "C₅" }),
              champs: [
                { libelle: "Plus grande clique de `C₅`", reponse: 2, tolerance: 0 },
                { libelle: "Plus grand stable de `C₅`", reponse: 2, tolerance: 0 },
                { libelle: "Plus grand stable de `Ḡ`", reponse: 4, tolerance: 0 }
              ],
              explication: [
                "`C₅` n'a pas de triangle : clique maximum 2. Trois sommets parmi 5 sur un cycle en contiennent toujours deux consécutifs : stable maximum 2.",
                "Les cliques de G sont exactement les stables de `Ḡ` : la taille maximum est la même, 4."
              ]
            },
            {
              type: "qcm", niveau: 4,
              titre: "Trois amis ou trois inconnus",
              enonce: "Dans un graphe simple, on cherche une clique de taille 3 ou un stable de taille 3. Quelles affirmations sont vraies ?",
              schema: graphe(P_PENTA, "1-2 2-3 3-4 4-5 1-5", { legende: "C₅ : ni triangle, ni stable de taille 3" }),
              choix: [
                "Tout graphe à 6 sommets contient une clique de taille 3 ou un stable de taille 3.",
                "Tout graphe à 5 sommets contient une clique de taille 3 ou un stable de taille 3.",
                "Le cycle C₅ ne contient ni clique ni stable de taille 3."
              ],
              reponse: [0, 2],
              explication: [
                "`C₅` est un contre-exemple à 5 sommets.",
                "À 6 sommets : soit v un sommet. Parmi les 5 autres, au moins 3 sont tous voisins de v, ou tous non-voisins de v. Dans le premier cas, si deux d'entre eux sont voisins, ils forment un triangle avec v ; sinon ces 3 forment un stable. Le second cas est symétrique."
              ]
            }
          ]
        }
      ]
    },

    /* =====================================================
       CHAPITRE 5 — GRAPHES BIPARTIS ET COUPLAGES
       ===================================================== */
    {
      id: "ch5",
      titre: "Chapitre 5 — Graphes bipartis et couplages",
      description: "Partition en deux stables, couplages maximum et parfaits, chaînes augmentantes (TD2, ex. 2 et 3).",
      exercices: [

        /* ---------- Leçon 5.1 ---------- */
        {
          type: "lecon",
          id: "gm-biparti",
          titre: "Graphes bipartis",
          description: "Partition, deux stables, coloriage en deux couleurs, cycles impairs.",
          cours: [
            {
              titre: "Partition des sommets",
              texte: [
                "Une **partition** de V en parties `V₁, …, V_ℓ` vérifie :",
                [
                  "tout sommet est dans une partie : `V₁ ∪ … ∪ V_ℓ = V` ;",
                  "aucun sommet n'est dans deux parties : `Vᵢ ∩ Vⱼ = ∅` pour `i ≠ j`."
                ]
              ],
              schema: graphe(P_BIP, A_BIP, { groupes: ["1 3 5 6", "2 4 7"], legende: "CM2, figure 3 : V₁ en bleu, V₂ en orange" }),
              redaction: [
                "Soit `V₁ = {1; 3; 5; 6}`, `V₂ = {2; 4; 7}`, `V₃ = {3; 4; 6; 7}`, `V₄ = {1; 2; 5}`.",
                "`V₁` et `V₂` forment une partition de V ; `V₃` et `V₄` aussi ; `V₁` et `V₃` non (3 et 6 sont dans les deux, 2 dans aucun)."
              ]
            },
            {
              titre: "Graphe biparti",
              texte: [
                "G est **biparti** s'il existe une partition `(V₁, V₂)` telle que **toute arête a une extrémité dans V₁ et l'autre dans V₂**.",
                "Autrement dit : `V₁` et `V₂` sont deux **stables**. On le voit en dessinant `V₁` d'un côté, `V₂` de l'autre."
              ],
              schema: graphe("1:0,0 3:0,1 5:0,2 6:0,3 2:2,0.5 4:2,1.5 7:2,2.5", A_BIP, { groupes: ["1 3 5 6", "2 4 7"], legende: "Le même graphe, V₁ à gauche, V₂ à droite" }),
              redaction: ["Toutes les arêtes `{1,2}`, `{2,3}`, `{1,4}`, `{3,4}`, `{4,5}`, `{4,6}`, `{3,7}` vont de `V₁` à `V₂` : G est biparti."]
            },
            {
              titre: "Tester en coloriant",
              texte: [
                "Méthode : colorier un sommet en A, ses voisins en B, leurs voisins en A, et ainsi de suite.",
                [
                  "si l'on termine **sans conflit**, les A et les B forment la partition ;",
                  "si deux voisins reçoivent la même couleur, le graphe **n'est pas** biparti."
                ],
                "S'il y a plusieurs composantes connexes, on recommence dans chacune."
              ],
              schema: graphe(P_BIP, A_BIP, { groupes: ["1 3 5 6", "2 4 7"], etiquettes: { 1: "A", 2: "B", 4: "B", 3: "A", 5: "A", 6: "A", 7: "B" }, legende: "1 → A ; 2, 4 → B ; 3, 5, 6 → A ; 7 → B" }),
              redaction: ["On colorie 1 en A, donc 2 et 4 en B, donc 3, 5, 6 en A, donc 7 en B. Aucune arête ne relie deux sommets de même couleur : `V₁ = {1; 3; 5; 6}`, `V₂ = {2; 4; 7}`."]
            },
            {
              titre: "Un cycle impair empêche d'être biparti",
              texte: [
                "Le long d'un cycle, les couleurs alternent A, B, A, B… Pour revenir au départ avec la bonne couleur, il faut un nombre **pair** d'arêtes.",
                "Un graphe qui contient un cycle de longueur impaire (un triangle par exemple) n'est donc pas biparti. (Réciproquement, un graphe sans cycle impair est biparti.)"
              ],
              schema: graphe(P_PENTA, "1-2 2-3 3-4 4-5 1-5", { groupes: ["1 3 5", "2 4"], marques: { "1-5": "d" }, legende: "C₅ : 1 et 5 reçoivent la même couleur" }),
              redaction: ["Dans `C₅`, en alternant depuis 1 : 1 → A, 2 → B, 3 → A, 4 → B, 5 → A. L'arête `{5,1}` relie deux A : `C₅` n'est pas biparti."]
            },
            {
              titre: "À quoi servent les graphes bipartis ?",
              texte: [
                "Dès qu'un problème met en relation **deux familles d'objets**, le graphe est biparti :",
                [
                  "analystes et incidents qu'ils savent traiter (TD2, exercice 3) ;",
                  "bits transmis et contrôles de parité (graphe de Tanner, TD2, exercice 4) ;",
                  "candidats et postes, étudiants et projets…"
                ],
                "Ils servent surtout aux problèmes de **couplage** : former des paires (leçon suivante)."
              ],
              schema: gSoc({ groupes: ["A1 A2 A3 A4", "I1 I2 I3 I4"], legende: "TD2, exercice 3 : analystes et incidents" }),
              redaction: ["Une arête relie toujours un analyste à un incident : `V₁ = {A₁; A₂; A₃; A₄}` et `V₂ = {I₁; I₂; I₃; I₄}` sont des stables, le graphe est biparti."]
            }
          ],
          problematique: {
            texte: [
              "Un CTF se joue par équipes de 2 (TD2, exercice 2). Dix étudiants veulent participer ; certains seulement peuvent faire équipe (compétences complémentaires).",
              "Avant de former les équipes, on veut comprendre la structure des compatibilités : se répartissent-elles en deux camps ?"
            ],
            schema: { type: "matrice", lignes: CERCLE(10), titre: "1 = peuvent faire équipe", graphe: { sommets: CERCLE(10), aretes: A_CTF } }
          },
          exemple: {
            texte: ["Le tableau du TD2 (un 1 en ligne i, colonne j : i et j peuvent faire équipe) :"],
            schema: { type: "matrice", lignes: CERCLE(10), graphe: { sommets: CERCLE(10), aretes: A_CTF } },
            questions: [
              "Modéliser ce problème sous la forme d'un graphe.",
              "Le graphe est-il biparti ? Si oui, donner la partition."
            ]
          },
          correction: {
            texte: [
              { titre: "1. Modélisation" },
              { redaction: ["Sommets : les 10 étudiants. Arête `{i, j}` si i et j peuvent faire équipe (11 arêtes : `{1,6}`, `{1,8}`, `{1,10}`, `{2,3}`, `{2,4}`, `{3,6}`, `{4,8}`, `{4,9}`, `{5,9}`, `{5,10}`, `{7,10}`)."] },
              { schema: graphe(CERCLE(10), A_CTF, { disposition: "cercle" }) },
              { titre: "2. Coloriage" },
              {
                redaction: [
                  "1 → A ; ses voisins 6, 8, 10 → B ; voisins de 6 : 3 → A ; de 8 : 4 → A ; de 10 : 5, 7 → A ; voisins de 3 : 2 → B ; de 4 : 9 → B.",
                  "Contrôle : chaque arête relie un A et un B (par exemple `{2,4}` : B–A, `{5,9}` : A–B). Aucun conflit.",
                  "Le graphe est **biparti** : `V₁ = {1; 3; 4; 5; 7}`, `V₂ = {2; 6; 8; 9; 10}`."
                ]
              },
              { schema: graphe(P_CTF_DEUX, A_CTF, { groupes: ["1 3 4 5 7", "2 6 8 9 10"], legende: "V₁ à gauche, V₂ à droite" }) }
            ]
          },
          exercices: [
            {
              type: "selection", niveau: 1,
              titre: "Un côté de la partition",
              enonce: "Sélectionnez les sommets de l'une des deux parties d'une partition qui montre que ce graphe est biparti.",
              graphe: { sommets: P_BIP, aretes: A_BIP },
              nomEnsemble: "V₁",
              regles: [{ regle: "partie" }],
              solution: "1 3 5 6",
              explication: ["`{1; 3; 5; 6}` (ou son complémentaire `{2; 4; 7}`) : chaque arête a une extrémité de chaque côté."]
            },
            {
              type: "qcm", niveau: 1,
              titre: "Le triangle",
              enonce: "Le graphe complet `K₃` (un triangle) est-il biparti ?",
              schema: graphe(P_TRI3, "1-2 1-3 2-3"),
              choix: ["Oui.", "Non, car il contient un cycle de longueur impaire.", "Non, car il a un nombre impair de sommets."],
              reponse: 1,
              explication: ["Deux des trois sommets seraient du même côté, or ils sont voisins. C'est le cycle impair (longueur 3) qui bloque ; un nombre impair de sommets n'empêche rien (`K₁,₂` a 3 sommets et est biparti)."]
            },
            {
              type: "selection", niveau: 2,
              titre: "TD2 : le graphe du CTF",
              enonce: "Le graphe du CTF est-il biparti ? Prouvez-le en sélectionnant l'une des deux parties.",
              graphe: { sommets: CERCLE(10), aretes: A_CTF, disposition: "cercle" },
              nomEnsemble: "V₁",
              regles: [{ regle: "partie" }],
              solution: "1 3 4 5 7",
              explication: ["`V₁ = {1; 3; 4; 5; 7}` et `V₂ = {2; 6; 8; 9; 10}`, obtenus en coloriant depuis 1."]
            },
            {
              type: "construire", niveau: 2,
              titre: "TD2 : le graphe du SOC",
              enonce: [
                "Tracez le graphe des compatibilités (TD2, exercice 3, question 1) :",
                ["`A₁` : `I₁`, `I₂` ;", "`A₂` : `I₁` ;", "`A₃` : `I₂`, `I₃` ;", "`A₄` : `I₃`, `I₄`."]
              ],
              graphe: { sommets: P_SOC },
              attendu: A_SOC,
              explication: ["7 arêtes, toutes entre un analyste et un incident : le graphe est biparti de partition `({A₁; …; A₄}, {I₁; …; I₄})`."]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Reconnaître les bipartis",
              enonce: "Quels graphes sont bipartis ?",
              schema: [graphe(CERCLE(6), "1-2 2-3 3-4 4-5 5-6 1-6", { disposition: "cercle", legende: "C₆" }), graphe(CERCLE(7), "1-2 2-3 3-4 4-5 5-6 6-7 1-7", { disposition: "cercle", legende: "C₇" }), graphe(P_CUBE, A_CUBE, { legende: "Le cube" }), graphe(CERCLE(4), K(4), { disposition: "cercle", legende: "K₄" })],
              choix: ["`C₆`", "`C₇`", "Le cube", "`K₄`", "Tout arbre"],
              reponse: [0, 2, 4],
              explication: [
                "`C₆` : on alterne sur 6 sommets, sans conflit. `C₇` et `K₄` contiennent un cycle impair (7, et des triangles).",
                "Le cube : `{1; 3; 6; 8}` et `{2; 4; 5; 7}`. Un arbre n'a aucun cycle, donc aucun cycle impair : en coloriant depuis n'importe quel sommet, on ne rencontre jamais de conflit."
              ]
            },
            {
              type: "construire", niveau: 3,
              titre: "Casser les cycles impairs",
              enonce: "Supprimez le **minimum** d'arêtes pour rendre ce graphe biparti.",
              graphe: { sommets: P_CUBE },
              depart: A_CUBE + " 1-3",
              regles: [
                { regle: "inclus", aretes: A_CUBE + " 1-3", message: "N'ajoutez pas d'arête : il faut seulement en supprimer." },
                { regle: "biparti" },
                { regle: "nbAretes", n: 12, message: "Le graphe est biparti, mais vous avez supprimé plus d'arêtes que nécessaire." }
              ],
              solution: A_CUBE,
              indice: "Coloriez le cube sans la diagonale : où est le conflit ?",
              explication: ["Le cube est biparti (`{1; 3; 6; 8}` / `{2; 4; 5; 7}`) ; la diagonale `{1,3}` relie deux sommets du même côté et crée tous les cycles impairs. La supprimer suffit, et c'est la seule arête dont la suppression suffit."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Le maximum d'arêtes d'un biparti",
              enonce: "Combien d'arêtes, au maximum, peut avoir un graphe biparti simple à 10 sommets ?",
              schema: graphe("1:0,0 2:0,1 3:0,2 4:2,0 5:2,1 6:2,2", "1-4 1-5 1-6 2-4 2-5 2-6 3-4 3-5 3-6", { groupes: ["1 2 3", "4 5 6"], legende: "6 sommets : 3 × 3 = 9 arêtes au plus" }),
              champs: [{ libelle: "Nombre maximal d'arêtes", reponse: 25, tolerance: 0 }],
              indice: "Avec des parties de tailles a et b (a + b = 10), combien d'arêtes au plus ?",
              explication: ["Toutes les arêtes vont de `V₁` à `V₂` : au plus `a × b` avec `a + b = 10`. Le produit est maximal pour `a = b = 5` : `25` arêtes."]
            },
            {
              type: "remettre", niveau: 4,
              titre: "Rédiger : biparti ⇒ pas de cycle impair",
              enonce: "Remettez dans l'ordre la preuve de : « un graphe biparti ne contient aucun cycle de longueur impaire ».",
              etapes: [
                "Soit G biparti de partition `(V₁, V₂)` et `(i₀, i₁, …, iℓ)` un cycle de G, avec `iℓ = i₀`.",
                "Chaque arête relie `V₁` à `V₂` : en suivant le cycle, on change de partie à chaque pas.",
                "Par récurrence sur k, `i_k` est dans la même partie que `i₀` si et seulement si k est pair.",
                "Or `iℓ = i₀` est dans la même partie que `i₀` : ℓ est pair. □"
              ],
              explication: ["La parité de la position le long du cycle détermine la partie : revenir au départ exige un nombre pair de pas."]
            }
          ]
        },

        /* ---------- Leçon 5.2 ---------- */
        {
          type: "lecon",
          id: "gm-couplages",
          titre: "Couplages",
          description: "Former des paires : couplage maximum, maximal, parfait, chaîne augmentante (TD2, ex. 2 et 3).",
          cours: [
            {
              titre: "Un couplage",
              texte: [
                "Un **couplage** W est un ensemble d'arêtes **deux à deux non adjacentes** : aucun sommet n'est touché par deux arêtes de W.",
                "Chaque arête du couplage forme une paire (une équipe, une affectation…)."
              ],
              schema: graphe(P_COUPL, A_COUPL, { marques: { "1-4": "a", "2-3": "a", "5-8": "a" }, legende: "CM2, figure 4 : W₁ en bleu" }),
              redaction: ["`W₁ = {{1,4}; {2,3}; {5,8}}` est un couplage de G : les sommets 1, 4, 2, 3, 5, 8 sont tous distincts."]
            },
            {
              titre: "Couplage maximum",
              texte: [
                "Un couplage est **maximum** s'il a le plus grand nombre possible d'arêtes (le CM2 l'appelle « maximal »).",
                "Borne utile : chaque arête couvre 2 sommets, donc un couplage d'un graphe d'ordre n a au plus `⌊n/2⌋` arêtes."
              ],
              schema: graphe(P_COUPL, A_COUPL, { marques: { "1-2": "c", "3-4": "c", "5-7": "c", "6-8": "c", 9: "d" }, legende: "W₂ : 4 arêtes, seul 9 reste libre" }),
              redaction: ["`W₂ = {{1,2}; {3,4}; {5,7}; {6,8}}` est un couplage de 4 arêtes. Le graphe a 9 sommets : un couplage a au plus `⌊9/2⌋ = 4` arêtes. `W₂` est maximum."]
            },
            {
              titre: "Maximal pour l'inclusion ≠ maximum",
              texte: [
                "Le TD2 distingue :",
                [
                  "un couplage **maximal pour l'inclusion** : on ne peut plus lui **ajouter** d'arête sans en retirer ;",
                  "un couplage **maximum** : il a le plus grand nombre d'arêtes possible."
                ],
                "Tout couplage maximum est maximal pour l'inclusion ; la réciproque est fausse."
              ],
              schema: gSoc({ marques: { "A1-I1": "b", "A3-I2": "b", "A4-I3": "b", A2: "d", I4: "d" }, legende: "M (orange) : bloqué, mais seulement 3 arêtes" }),
              redaction: [
                "`M = {{A₁,I₁}; {A₃,I₂}; {A₄,I₃}}` : la seule arête de `A₂` mène à `I₁`, déjà pris ; la seule arête libre de `I₄` mène à `A₄`, déjà pris. On ne peut rien ajouter : M est maximal pour l'inclusion.",
                "Pourtant il existe un couplage de 4 arêtes : M n'est pas maximum."
              ]
            },
            {
              titre: "Couplage parfait",
              texte: [
                "Un couplage est **parfait** si **tout sommet** est extrémité d'une de ses arêtes.",
                "Il a alors exactement `n/2` arêtes : un graphe d'ordre impair n'a jamais de couplage parfait."
              ],
              schema: gSoc({ marques: { "A1-I2": "c", "A2-I1": "c", "A3-I3": "c", "A4-I4": "c" }, legende: "Un couplage parfait du SOC" }),
              redaction: ["`{{A₂,I₁}; {A₁,I₂}; {A₃,I₃}; {A₄,I₄}}` couvre les 8 sommets : c'est un couplage parfait (donc maximum)."]
            },
            {
              titre: "La chaîne augmentante",
              texte: [
                "Une **chaîne augmentante** pour un couplage M est une chaîne élémentaire qui :",
                [
                  "part d'un sommet **libre** (non couvert par M) et arrive à un autre sommet libre ;",
                  "**alterne** arêtes hors de M et arêtes de M."
                ],
                "On **échange** alors : les arêtes de M sur la chaîne sortent, les autres entrent. Le couplage gagne une arête."
              ],
              schema: gSoc({ marques: { "A2-I1": "a", "A1-I1": "b", "A1-I2": "a", "A3-I2": "b", "A3-I3": "a", "A4-I3": "b", "A4-I4": "a" }, legende: "A₂–I₁–A₁–I₂–A₃–I₃–A₄–I₄ : bleu hors de M, orange dans M" }),
              redaction: [
                "La chaîne `A₂ − I₁ − A₁ − I₂ − A₃ − I₃ − A₄ − I₄` part de `A₂` (libre), arrive en `I₄` (libre) et alterne : 4 arêtes hors de M, 3 arêtes de M.",
                "Après échange : `{A₂,I₁}`, `{A₁,I₂}`, `{A₃,I₃}`, `{A₄,I₄}`. Le couplage passe de 3 à 4 arêtes."
              ]
            }
          ],
          problematique: {
            texte: [
              "Un SOC reçoit 4 incidents simultanément (TD2, exercice 3). Chaque analyste ne traite qu'un incident à la fois, chaque incident n'est confié qu'à un analyste.",
              "Le responsable applique une stratégie gloutonne : pour chaque analyste, dans l'ordre `A₁, A₂, A₃, A₄`, lui attribuer un incident qu'il sait traiter et qui n'est pas encore pris. Il obtient `A₁ → I₁`, `A₃ → I₂`, `A₄ → I₃` et affirme : « impossible de traiter les quatre incidents, puisque `A₂` ne peut plus être affecté ». A-t-il raison ?"
            ],
            schema: gSoc({ marques: { "A1-I1": "b", "A3-I2": "b", "A4-I3": "b" } })
          },
          exemple: {
            texte: ["Compatibilités : `A₁` : `I₁`, `I₂` ; `A₂` : `I₁` ; `A₃` : `I₂`, `I₃` ; `A₄` : `I₃`, `I₄`. Couplage glouton : `M = {{A₁,I₁}; {A₃,I₂}; {A₄,I₃}}`."],
            schema: gSoc({ marques: { "A1-I1": "b", "A3-I2": "b", "A4-I3": "b" } }),
            questions: [
              "Quel objet représente une affectation valide ?",
              "Quel analyste ne reçoit aucun incident ? Quel incident reste sans analyste ? Peut-on ajouter une arête à M sans rien modifier ?",
              "L'affirmation du responsable est-elle correcte ?",
              "Donner le couplage obtenu. Est-il parfait ?"
            ]
          },
          correction: {
            texte: [
              { titre: "1. Modèle" },
              { redaction: ["Une affectation valide est un ensemble d'arêtes sans extrémité commune : un **couplage** du graphe biparti analystes / incidents."] },
              { titre: "2. Le glouton est bloqué" },
              { redaction: ["`A₂` n'a rien, `I₄` n'est pas traité : 3 incidents traités. On ne peut pas ajouter d'arête : `A₂` n'est relié qu'à `I₁` (pris) et `I₄` qu'à `A₄` (pris). M est **maximal pour l'inclusion**."] },
              { titre: "3. L'affirmation est fausse" },
              {
                redaction: [
                  "Réaffectons le long de la chaîne augmentante `A₂ − I₁ − A₁ − I₂ − A₃ − I₃ − A₄ − I₄` :",
                  ["`A₂` prend `I₁` ;", "`A₁` laisse `I₁` et prend `I₂` ;", "`A₃` laisse `I₂` et prend `I₃` ;", "`A₄` laisse `I₃` et prend `I₄`."]
                ]
              },
              { schema: gSoc({ marques: { "A2-I1": "c", "A1-I2": "c", "A3-I3": "c", "A4-I4": "c" }, legende: "Après échange" }) },
              { titre: "4. Résultat" },
              { redaction: ["`{{A₂,I₁}; {A₁,I₂}; {A₃,I₃}; {A₄,I₄}}` : les 4 incidents sont traités. Tous les sommets sont couverts : le couplage est **parfait**, donc maximum. M était maximal sans être maximum."] }
            ]
          },
          exercices: [
            {
              type: "selection", cible: "aretes", niveau: 1,
              titre: "Un couplage de 3 arêtes",
              enonce: "Sélectionnez un couplage de 3 arêtes.",
              graphe: { sommets: P_COUPL, aretes: A_COUPL },
              regles: [{ regle: "couplage", taille: 3 }],
              solution: "1-4 2-3 5-8",
              explication: ["Par exemple `W₁ = {{1,4}; {2,3}; {5,8}}`."]
            },
            {
              type: "qcm", niveau: 1,
              titre: "Ordre impair",
              enonce: "Un graphe d'ordre 7 peut-il avoir un couplage parfait ?",
              schema: graphe(CERCLE(7), "1-2 2-3 3-4 4-5 5-6 6-7 1-7", { disposition: "cercle" }),
              choix: ["Oui, s'il est connexe.", "Non, jamais.", "Oui, s'il est complet."],
              reponse: 1,
              explication: ["Un couplage parfait regroupe les sommets par paires disjointes : il faut un nombre pair de sommets."]
            },
            {
              type: "selection", cible: "aretes", niveau: 2,
              titre: "Couplage maximum",
              enonce: "Sélectionnez un couplage **maximum** du graphe du CM2.",
              graphe: { sommets: P_COUPL, aretes: A_COUPL },
              regles: [{ regle: "couplage", maximum: true }],
              solution: "1-2 3-4 5-7 6-8",
              explication: ["4 arêtes, par exemple `W₂`. On ne peut pas faire mieux : 9 sommets, au plus `⌊9/2⌋ = 4` paires."]
            },
            {
              type: "ordre", niveau: 2,
              titre: "Suivre la chaîne augmentante",
              enonce: "Le couplage actuel est `M = {{A₁,I₁}; {A₃,I₂}; {A₄,I₃}}`. Cliquez une chaîne augmentante pour M.",
              graphe: { sommets: P_SOC, aretes: A_SOC, marques: { "A1-I1": "b", "A3-I2": "b", "A4-I3": "b" } },
              regles: [{ regle: "augmentant", couplage: "A1-I1 A3-I2 A4-I3" }],
              solution: "A2 I1 A1 I2 A3 I3 A4 I4",
              explication: ["Elle part de `A₂` (libre), arrive en `I₄` (libre) et alterne hors M / dans M : `A₂ − I₁ − A₁ − I₂ − A₃ − I₃ − A₄ − I₄`."]
            },
            {
              type: "selection", cible: "aretes", niveau: 3,
              titre: "TD2 : cinq équipes pour le CTF",
              enonce: "Formez le plus grand nombre d'équipes de deux pour le CTF : sélectionnez un couplage parfait.",
              graphe: { sommets: CERCLE(10), aretes: A_CTF, disposition: "cercle" },
              regles: [{ regle: "couplage", parfait: true }],
              solution: "7-10 5-9 4-8 1-6 2-3",
              indice: "7 n'a qu'un seul partenaire possible : commencez par lui.",
              explication: [
                "7 ne peut faire équipe qu'avec 10, donc 5 (voisins 9 et 10) prend 9. Il reste 1, 2, 3, 4, 6, 8 avec les arêtes `{1,6}`, `{1,8}`, `{2,3}`, `{2,4}`, `{3,6}`, `{4,8}` : par exemple `{4,8}`, `{1,6}`, `{2,3}`.",
                "`{{7,10}; {5,9}; {4,8}; {1,6}; {2,3}}` : 5 équipes, tous les étudiants participent (couplage parfait)."
              ]
            },
            {
              type: "construire", niveau: 3,
              titre: "TD2 : une équipe plus flexible",
              enonce: "Construisez un graphe biparti entre `{A₁; …; A₄}` et `{I₁; …; I₄}` où chaque analyste sait traiter exactement 2 types d'incidents, chaque incident est traité par exactement 2 analystes, et qui admet un couplage parfait.",
              graphe: { sommets: P_SOC },
              regles: [
                { regle: "biparti", parts: ["A1 A2 A3 A4", "I1 I2 I3 I4"] },
                { regle: "regulier", k: 2 },
                { regle: "couplageParfait" }
              ],
              solution: "A1-I1 A1-I2 A2-I2 A2-I3 A3-I3 A3-I4 A4-I4 A4-I1",
              explication: ["Par exemple `Aᵢ` traite `Iᵢ` et `Iᵢ₊₁` (avec `I₅ = I₁`) : un cycle de longueur 8. Les arêtes `{Aᵢ, Iᵢ}` forment un couplage parfait."]
            },
            {
              type: "qcm", niveau: 4,
              titre: "TD2, question 17 : un cycle forcé ?",
              enonce: "Dans votre graphe de l'exercice précédent (tous les sommets de degré 2), existe-t-il nécessairement un cycle ?",
              schema: graphe(P_SOC, "A1-I1 A1-I2 A2-I1 A2-I2 A3-I3 A3-I4 A4-I3 A4-I4", { legende: "Une autre solution : deux cycles de longueur 4" }),
              choix: [
                "Oui, toujours, et il est de longueur paire.",
                "Non, cela dépend de la construction.",
                "Oui, et il passe forcément par les 8 sommets."
              ],
              reponse: 0,
              explication: [
                "Tous les degrés valent 2 ≥ 2 : en suivant les arêtes sans faire demi-tour, on finit par revenir sur un sommet déjà vu (nombre fini de sommets), ce qui ferme un cycle.",
                "Le graphe est biparti : ce cycle est de longueur paire. Il ne passe pas forcément partout : la solution ci-dessus a deux cycles de longueur 4."
              ]
            },
            {
              type: "selection", niveau: 4,
              titre: "Couvrir toutes les équipes possibles",
              enonce: "On veut interroger le moins d'étudiants possible pour qu'au moins un membre de chaque binôme possible (chaque arête) soit interrogé. Sélectionnez un tel ensemble de taille minimum.",
              graphe: { sommets: CERCLE(10), aretes: A_CTF, disposition: "cercle" },
              regles: [{ regle: "couverture", minimum: true }],
              solution: "2 6 8 9 10",
              indice: "Comparez avec le nombre maximum d'équipes disjointes.",
              explication: [
                "Il faut au moins 5 sommets : les 5 arêtes d'un couplage parfait sont disjointes, chacune exige son propre sommet.",
                "5 suffisent : une des deux parties de la bipartition, par exemple `{2; 6; 8; 9; 10}`, touche toutes les arêtes. Dans un graphe biparti, la plus petite couverture a toujours la taille d'un couplage maximum (théorème de König)."
              ]
            }
          ]
        }
      ]
    },

    /* =====================================================
       CHAPITRE 6 — ARBRES ET ARBORESCENCES
       ===================================================== */
    {
      id: "ch6",
      titre: "Chapitre 6 — Arbres et arborescences",
      description: "Connexe sans cycle, n − 1 arêtes, forêts, arborescences.",
      exercices: [
        {
          type: "lecon",
          id: "gm-arbres",
          titre: "Arbres, forêts et arborescences",
          description: "Les trois caractérisations d'un arbre et la preuve par récurrence (CM2).",
          cours: [
            {
              titre: "Un arbre",
              texte: [
                "Un **arbre** est un graphe simple non orienté, **connexe** et **sans cycle** élémentaire.",
                "Il n'a pas de boucle (une boucle est un cycle) : c'est forcément un graphe simple."
              ],
              schema: graphe("1:1.5,0 2:0.5,1 3:1.5,1 4:2.5,1 5:0,2 6:1,2 7:2.5,2", "1-2 1-3 1-4 2-5 2-6 4-7", { legende: "Un arbre à 7 sommets" }),
              redaction: ["Ce graphe est connexe (tout sommet est relié à 1) et sans cycle : c'est un arbre. Il a 7 sommets et 6 arêtes."]
            },
            {
              titre: "Une forêt",
              texte: ["Une **forêt** est un graphe sans cycle élémentaire : chacune de ses composantes connexes est un arbre."],
              schema: graphe("1:0,0 2:1,0 3:0.5,1 4:2,0 5:3,0 6:2.5,1 7:3.5,1 8:4.5,0", "1-2 1-3 4-5 5-6 5-7", { groupes: ["1 2 3", "4 5 6 7", "8"], legende: "Une forêt de 3 arbres" }),
              redaction: ["Les composantes `{1; 2; 3}`, `{4; 5; 6; 7}` et `{8}` sont des arbres : le graphe est une forêt (non connexe)."]
            },
            {
              titre: "Arbre ou pas ? (CM2, figure 5)",
              texte: ["Pour un sous-graphe engendré, on vérifie les deux conditions : connexe **et** sans cycle."],
              schema: [
                graphe(P_BIP, A_BIP, { marques: { 1: "c", 2: "c", 3: "c", 7: "c", "1-2": "c", "2-3": "c", "3-7": "c" }, legende: "G[{1; 2; 3; 7}] : un arbre" }),
                graphe(P_BIP, A_BIP, { marques: { 1: "d", 2: "d", 3: "d", 4: "d", "1-2": "d", "2-3": "d", "3-4": "d", "1-4": "d" }, legende: "G[{1; 2; 3; 4}] : un cycle" })
              ],
              redaction: [
                "`G[{1; 2; 3}]` et `G[{1; 2; 3; 7}]` sont des arbres ; `G[{4; 5; 6}]` aussi.",
                "`G[{1; 2; 3; 4}]` n'est pas un arbre : il contient le cycle `(1, 2, 3, 4, 1)`. `G[{2; 4; 5; 6}]` non plus : il n'a que les arêtes `{4,5}` et `{4,6}`, 2 est isolé, il n'est pas connexe."
              ]
            },
            {
              titre: "Un arbre d'ordre n a n − 1 arêtes",
              texte: [
                "Démonstration par **récurrence** (CM2). L'outil : un arbre d'ordre au moins 2 a une **feuille** (sommet de degré 1). En la retirant avec son arête, on obtient encore un arbre."
              ],
              schema: graphe("1:1.5,0 2:0.5,1 3:1.5,1 4:2.5,1 5:0,2 6:1,2 7:2.5,2", "1-2 1-3 1-4 2-5 2-6 4-7", { marques: { 7: "d", "4-7": "d" }, legende: "Retirer la feuille 7 et son arête" }),
              redaction: [
                "**Initialisation** : pour n = 1, l'arbre n'a aucune arête : `0 = 1 − 1`.",
                "**Hérédité** : supposons le résultat vrai pour tout arbre d'ordre n. Un arbre d'ordre `n + 1 ≥ 2` a une feuille ; en la supprimant avec son unique arête, on obtient un arbre d'ordre n (toujours connexe et sans cycle), qui a `n − 1` arêtes par hypothèse.",
                "L'arbre initial a donc `(n − 1) + 1 = n` arêtes. □"
              ]
            },
            {
              titre: "Trois caractérisations équivalentes",
              texte: [
                "**Proposition 2 (CM2).** Pour un graphe non orienté G d'ordre n, sont équivalents :",
                ["(i) G est un arbre ;", "(ii) G a `n − 1` arêtes et est sans cycle ;", "(iii) G a `n − 1` arêtes et est connexe."],
                "On prouve (i) ⇒ (ii) ⇒ (iii) ⇒ (i) : le graphe de ces implications est fortement connexe, chacune entraîne les autres."
              ],
              schema: oriente("(i):0.6,0 (ii):1.8,0.7 (iii):0.6,1.4", "(i)>(ii) (ii)>(iii) (iii)>(i)", { legende: "Le cycle d'implications" }),
              redaction: [
                "(i) ⇒ (ii) : un arbre est sans cycle et a `n − 1` arêtes (étape précédente).",
                "(ii) ⇒ (iii) : si G n'était pas connexe, on relierait ses composantes par de nouvelles arêtes sans créer de cycle : on obtiendrait un arbre à plus de `n − 1` arêtes, impossible.",
                "(iii) ⇒ (i) : si G avait un cycle, on retirerait une arête du cycle sans perdre la connexité, jusqu'à obtenir un arbre à moins de `n − 1` arêtes, impossible. □"
              ]
            },
            {
              titre: "L'arborescence",
              texte: [
                "Une **arborescence** de racine r est un graphe **orienté**, sans circuit, où chaque sommet sauf r a **un unique prédécesseur**.",
                "Les arbres binaires de première année sont des arborescences : les arcs vont implicitement de la racine vers les feuilles."
              ],
              schema: oriente("r:1.5,0 a:0.5,1 b:2.5,1 c:0,2 d:1,2 e:2.5,2", "r>a r>b a>c a>d b>e", { marques: { r: "a" }, legende: "Une arborescence de racine r" }),
              redaction: ["`d⁻(r) = 0` et `d⁻(x) = 1` pour tout autre sommet x ; il n'y a pas de circuit : c'est une arborescence de racine r."]
            }
          ],
          problematique: {
            texte: [
              "On doit relier par câble les 7 bâtiments d'un campus pour que tous puissent communiquer. Les tracés possibles sont représentés ci-dessous.",
              "Chaque câble coûte cher : combien de câbles faut-il au minimum, et quelle forme a alors le réseau ?"
            ],
            schema: graphe(P_CAMPUS, A_CAMPUS, { legende: "Tracés possibles entre les bâtiments" })
          },
          exemple: {
            texte: ["Le graphe G des tracés possibles a 7 sommets et 10 arêtes."],
            schema: graphe(P_CAMPUS, A_CAMPUS),
            questions: [
              "Combien de câbles faut-il au minimum pour que les 7 bâtiments communiquent ?",
              "Quelle est la forme d'un réseau qui atteint ce minimum ?",
              "Proposer un tel réseau."
            ]
          },
          correction: {
            texte: [
              { titre: "1. Au moins 6 câbles" },
              { redaction: ["Le réseau choisi doit être un graphe partiel **connexe** de G. Un graphe connexe d'ordre 7 a au moins `7 − 1 = 6` arêtes (chaque arête ajoutée retire au plus une composante)."] },
              { titre: "2. Un arbre" },
              { redaction: ["Un graphe connexe à `n − 1` arêtes est un arbre (caractérisation (iii) ⇒ (i)) : le réseau minimal est un **arbre couvrant** de G."] },
              { titre: "3. Une solution" },
              { redaction: ["Par exemple `{1,2}`, `{2,3}`, `{1,4}`, `{2,5}`, `{3,6}`, `{5,7}` : 6 arêtes, connexe, sans cycle."] },
              { schema: graphe(P_CAMPUS, A_CAMPUS, { marques: { "1-2": "c", "2-3": "c", "1-4": "c", "2-5": "c", "3-6": "c", "5-7": "c" }, legende: "Un arbre couvrant (en vert)" }) }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Compter les arêtes d'un arbre",
              enonce: "Un arbre a 12 sommets. Combien a-t-il d'arêtes ?",
              schema: graphe("1:2,0 2:0.5,1 3:2,1 4:3.5,1 5:0,2 6:1,2 7:2,2 8:3,2 9:4,2 10:0,3 11:3,3 12:4,3", "1-2 1-3 1-4 2-5 2-6 3-7 4-8 4-9 5-10 8-11 9-12"),
              champs: [{ libelle: "Nombre d'arêtes", reponse: 11, tolerance: 0 }],
              explication: ["Un arbre d'ordre n a `n − 1` arêtes : 11."]
            },
            {
              type: "construire", niveau: 1,
              titre: "Tracer un arbre",
              enonce: "Tracez un arbre qui passe par les 6 sommets.",
              graphe: { sommets: "1:0,0 2:1,0 3:2,0 4:0,1 5:1,1 6:2,1" },
              regles: [{ regle: "arbre" }],
              solution: "1-2 2-3 1-4 2-5 3-6",
              explication: ["Toute solution a 5 arêtes, est connexe et sans cycle."]
            },
            {
              type: "selection", cible: "aretes", niveau: 2,
              titre: "Un arbre couvrant",
              enonce: "Sélectionnez les arêtes d'un arbre couvrant du réseau du campus.",
              graphe: { sommets: P_CAMPUS, aretes: A_CAMPUS },
              nomEnsemble: "T",
              regles: [{ regle: "arbreCouvrant" }],
              solution: "1-2 2-3 1-4 2-5 3-6 5-7",
              explication: ["Il faut 6 arêtes reliant les 7 sommets sans former de cycle."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Les arêtes d'une forêt",
              enonce: "Une forêt a 15 sommets et 3 composantes connexes. Combien a-t-elle d'arêtes ?",
              schema: graphe("1:0,0 2:1,0 3:0.5,1 4:2,0 5:3,0 6:2.5,1 7:3.5,1 8:4.5,0", "1-2 1-3 4-5 5-6 5-7", { groupes: ["1 2 3", "4 5 6 7", "8"], legende: "8 sommets, 3 arbres, 5 arêtes" }),
              champs: [{ libelle: "Nombre d'arêtes", reponse: 12, tolerance: 0 }],
              explication: ["Chaque composante est un arbre : si elles ont `n₁`, `n₂`, `n₃` sommets, elles ont `(n₁ − 1) + (n₂ − 1) + (n₃ − 1) = 15 − 3 = 12` arêtes. En général : `n − c`."]
            },
            {
              type: "construire", niveau: 3,
              titre: "Un arbre aux degrés imposés",
              enonce: "Tracez un arbre sur ces 7 sommets dont les degrés sont, dans un ordre quelconque, 3, 3, 2, 1, 1, 1, 1.",
              graphe: { sommets: "1 2 3 4 5 6 7", disposition: "cercle" },
              regles: [{ regle: "arbre" }, { regle: "degres", valeurs: "3 3 2 1 1 1 1" }],
              solution: "1-2 1-3 1-4 2-5 2-6 6-7",
              indice: "Contrôle : `3 + 3 + 2 + 1 + 1 + 1 + 1 = 12 = 2 × 6`. Reliez d'abord les deux sommets de degré 3.",
              explication: ["Par exemple `{1,2}`, `{1,3}`, `{1,4}`, `{2,5}`, `{2,6}`, `{6,7}` : 1 et 2 de degré 3, 6 de degré 2, les autres sont des feuilles."]
            },
            {
              type: "construire", niveau: 3,
              titre: "Orienter un arbre",
              enonce: "Orientez les arêtes de l'arbre ci-dessous pour obtenir une **arborescence de racine 3** (tracez les arcs).",
              schema: graphe("1:0,0 2:1,0 3:2,0 4:3,0 5:2,1 6:1.5,2 7:2.5,2", "1-2 2-3 3-4 3-5 5-6 5-7", { legende: "L'arbre à orienter" }),
              graphe: { sommets: "1:0,0 2:1,0 3:2,0 4:3,0 5:2,1 6:1.5,2 7:2.5,2", oriente: true },
              regles: [
                { regle: "inclus", aretes: "1>2 2>1 2>3 3>2 3>4 4>3 3>5 5>3 5>6 6>5 5>7 7>5", message: "Utilisez seulement les arêtes de l'arbre." },
                { regle: "nbAretes", n: 6 },
                { regle: "arborescence", racine: "3" }
              ],
              solution: "3>2 2>1 3>4 3>5 5>6 5>7",
              explication: ["On oriente chaque arête en s'éloignant de la racine 3 : `(3,2)`, `(2,1)`, `(3,4)`, `(3,5)`, `(5,6)`, `(5,7)`."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Combien de feuilles ?",
              enonce: "Un arbre a exactement 2 sommets de degré 4, 3 sommets de degré 3, 1 sommet de degré 2, et tous ses autres sommets sont des feuilles. Combien a-t-il de feuilles ?",
              schema: graphe("a:1,0 b:2.6,0 c:0.2,1 d:3.4,1 e:0.2,2 f:0.2,3", "a-b a-c b-d c-e e-f", { etiquettes: { a: "d=4", b: "d=4", c: "d=3", d: "d=3", e: "d=3", f: "d=2" }, legende: "Les sommets qui ne sont pas des feuilles (feuilles non dessinées)" }),
              champs: [{ libelle: "Nombre de feuilles f", reponse: 9, tolerance: 0 }],
              indice: "Exprimez n puis |E| en fonction de f et appliquez le lemme des poignées de main.",
              explication: [
                "`n = 6 + f` et `|E| = n − 1 = 5 + f`.",
                "Poignées de main : `2 × 4 + 3 × 3 + 1 × 2 + f = 2(5 + f)`, soit `19 + f = 10 + 2f`, donc `f = 9`."
              ]
            },
            {
              type: "remettre", niveau: 4,
              titre: "Rédiger : au moins deux feuilles",
              enonce: "Remettez dans l'ordre la preuve de : « tout arbre d'ordre `n ≥ 2` a au moins deux feuilles ».",
              etapes: [
                "Soit `μ = (i₀, …, iℓ)` une chaîne élémentaire de longueur maximale de l'arbre ; `ℓ ≥ 1` car l'arbre est connexe et a au moins deux sommets.",
                "Supposons que `i₀` ait un voisin `j ≠ i₁`.",
                "Si j est sur μ, alors `(i₀, i₁, …, j, i₀)` est un cycle : impossible dans un arbre.",
                "Sinon, `(j, i₀, i₁, …, iℓ)` est une chaîne élémentaire plus longue que μ : impossible par maximalité.",
                "Donc `d(i₀) = 1`, et de même `d(iℓ) = 1` : `i₀` et `iℓ` sont deux feuilles distinctes. □"
              ],
              explication: ["L'argument de la « plus longue chaîne » : ses extrémités ne peuvent avoir d'autre voisin. C'est ce résultat qu'utilise la récurrence du CM2."]
            }
          ]
        }
      ]
    }
  );
})();
