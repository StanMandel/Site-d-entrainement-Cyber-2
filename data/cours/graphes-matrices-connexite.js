/* =============================================================
   Introduction aux graphes et aux matrices — chapitre 3
   Connexité et forte connexité (CM1 §2.3-2.4, TD1 ex. 4 et 5).
   Complète CONTENU["graphes-matrices"] (voir graphes-matrices.js).
   ============================================================= */

(() => {
  const graphe = (sommets, aretes, plus) => Object.assign({ type: "graphe", sommets, aretes }, plus || {});
  const oriente = (sommets, arcs, plus) => Object.assign({ type: "graphe", oriente: true, sommets, aretes: arcs }, plus || {});

  const P_CM1 = "1:1,0 4:3,0 2:0,1 3:2,1 5:4,1";
  const A_CM1 = "1-2 1-3 1-5 2-3 2-4 3-5 4-5";
  const P_CM1_F5 = "1:1,0 4:3,0 2:0,1 3:2,1 5:4,1 6:1,2.1 7:3,2.1";
  const A_CM1_F5 = "1-2 1-5 2-3 2-4 4-5 6-7";
  const P_CM1_F6 = "1:0,0 2:1,0 3:0,1 4:1,1 5:2,1 6:1,2";
  const A_CM1_F6 = "1>2 2>1 1>3 2>4 4>5 4>6 6>4 5>6";
  const P_TD1_OR = "1:0,0 4:1,0 5:2,0 2:0,1 3:1,1 6:2,1 8:3,1 7:2,2";
  const A_TD1_OR = "4>1 1>2 1>3 2>3 3>4 3>5 4>5 5>6 6>5 3>6 8>6 3>7 6>7 7>6";
  const P_TRIO = "1:0,0 2:1,0 3:0.5,0.9 4:2.2,0 5:3.2,0 6:2.7,0.9 7:4.4,0 8:5.4,0 9:4.9,0.9";
  const A_TRIO = "1-2 1-3 2-3 4-5 5-6 7-8 8-9";
  const P_GA = "1:0,0 2:1,0 3:2,0 4:0,1 5:1,1 6:2,1 7:0,2 8:2,2";
  const A_GA = "1-2 1-4 2-4 3-6 6-8 5-7";
  const P_GB = "1:0,0 2:1,0 3:0.5,1 4:2,1 5:2.5,0 6:3,1 7:4,0 8:4.5,1";
  const A_GB = "1>2 2>3 3>1 3>4 4>5 5>6 6>4 6>7 7>8 8>7 1>5 5>8";

  const gTD1or = (plus) => oriente(P_TD1_OR, A_TD1_OR, plus);
  const gF6 = (plus) => oriente(P_CM1_F6, A_CM1_F6, plus);

  CONTENU["graphes-matrices"].chapitres.push({
    id: "ch3",
    titre: "Chapitre 3 — Connexité",
    description: "Sous-graphes, composantes connexes, forte connexité et graphe réduit.",
    exercices: [

      /* ---------- Leçon 3.1 ---------- */
      {
        type: "lecon",
        id: "gm-connexite",
        titre: "Sous-graphes et composantes connexes",
        description: "Graphe partiel, sous-graphe engendré, graphe connexe, nombre de connexité.",
        cours: [
          {
            titre: "Graphe partiel : on retire des arêtes",
            texte: [
              "Un **graphe partiel** de `G = (V, E)` garde **tous les sommets** et une partie des arêtes : `H = (V, E′)` avec `E′ ⊆ E`."
            ],
            schema: graphe(P_CM1, A_CM1, { marques: { "1-5": "e", "2-4": "e" }, legende: "Graphe partiel : on a retiré {1,5} et {2,4} (en pâle)" }),
            redaction: ["`H = (V, E′)` avec `E′ = E ∖ {{1,5}; {2,4}}` est un graphe partiel de G : mêmes sommets, `E′ ⊆ E`."]
          },
          {
            titre: "Sous-graphe et sous-graphe engendré",
            texte: [
              "Un **sous-graphe** `H = (V′, E′)` garde une partie des sommets et une partie des arêtes : `V′ ⊆ V`, `E′ ⊆ E`.",
              "Le **sous-graphe engendré** par `V′`, noté `G[V′]`, garde **toutes** les arêtes de G dont les deux extrémités sont dans `V′`."
            ],
            schema: graphe(P_CM1, A_CM1, { marques: { 1: "a", 2: "a", 3: "a", "1-2": "a", "1-3": "a", "2-3": "a", 4: "e", 5: "e", "1-5": "e", "2-4": "e", "3-5": "e", "4-5": "e" }, legende: "G[{1; 2; 3}] en bleu" }),
            redaction: ["`G[{1; 2; 3}]` a pour sommets 1, 2, 3 et pour arêtes `{1,2}`, `{1,3}`, `{2,3}` : toutes les arêtes de G entre ces trois sommets."]
          },
          {
            titre: "Graphe connexe",
            texte: [
              "Un graphe est **connexe** si, pour toute paire de sommets i, j, il existe une **chaîne** de i à j.",
              "Pour montrer qu'il ne l'est pas, il suffit d'exhiber deux sommets que rien ne relie."
            ],
            schema: graphe(P_CM1_F5, A_CM1_F5, { legende: "CM1, figure 5 : un graphe non connexe" }),
            redaction: ["Aucune arête ne relie `{6; 7}` au reste du graphe : il n'existe aucune chaîne de 1 à 6. G n'est pas connexe."]
          },
          {
            titre: "Composantes connexes",
            texte: [
              "Une **composante connexe** est un sous-graphe connexe **maximal** : on ne peut plus l'agrandir sans perdre la connexité.",
              "Un graphe est connexe s'il a une seule composante. Le nombre de composantes est le **nombre de connexité**."
            ],
            schema: graphe(P_CM1_F5, A_CM1_F5, { groupes: ["1 2 3 4 5", "6 7"], legende: "Deux composantes connexes" }),
            redaction: [
              "Soit `V₀ = {1; 2; 3}`, `V₁ = {1; 2; 3; 4; 5}` et `V₂ = {6; 7}`.",
              "`G[V₀]` est connexe mais non maximal (on peut ajouter 4 et 5) ; `G[V₁]` et `G[V₂]` sont connexes maximaux : ce sont les composantes connexes de G. Le nombre de connexité vaut 2."
            ]
          },
          {
            titre: "Connexité d'un graphe orienté",
            texte: [
              "Pour un graphe orienté, la connexité se lit **en oubliant le sens des arcs** : on cherche des chaînes, pas des chemins.",
              "La notion qui tient compte du sens est la forte connexité (leçon suivante)."
            ],
            schema: gTD1or({ legende: "TD1, exercice 4 : connexe" }),
            redaction: ["En oubliant les sens, les arêtes `{1,4}`, `{1,2}`, `{1,3}`, `{3,5}`, `{3,6}`, `{3,7}`, `{6,8}` relient 1 à tous les autres sommets : le graphe est connexe."]
          }
        ],
        problematique: {
          texte: [
            "Une panne a coupé plusieurs liens d'un réseau de 9 machines. L'équipe de supervision veut savoir :",
            ["quels groupes de machines peuvent encore communiquer entre eux ;", "combien de liens il faut, **au minimum**, rétablir pour que tout le réseau communique à nouveau."]
          ],
          schema: graphe(P_TRIO, A_TRIO, { legende: "Les liens encore actifs" })
        },
        exemple: {
          texte: ["Les liens actifs sont `{1,2}`, `{1,3}`, `{2,3}`, `{4,5}`, `{5,6}`, `{7,8}`, `{8,9}`."],
          schema: graphe(P_TRIO, A_TRIO),
          questions: [
            "Le graphe est-il connexe ?",
            "Donner ses composantes connexes et son nombre de connexité.",
            "Combien de liens faut-il ajouter, au minimum, pour le rendre connexe ? Lesquels ?"
          ]
        },
        correction: {
          texte: [
            { titre: "1-2. Composantes connexes" },
            {
              redaction: [
                "Depuis 1, les chaînes atteignent 2 et 3 et rien d'autre : `{1; 2; 3}` est une composante. De même `{4; 5; 6}` et `{7; 8; 9}`.",
                "Le graphe a 3 composantes connexes : il n'est pas connexe (aucune chaîne de 1 à 4), son nombre de connexité vaut 3."
              ]
            },
            { schema: graphe(P_TRIO, A_TRIO, { groupes: ["1 2 3", "4 5 6", "7 8 9"] }) },
            { titre: "3. Nombre minimal de liens" },
            {
              redaction: [
                "Ajouter une arête relie au plus deux composantes : le nombre de composantes diminue d'au plus 1.",
                "Pour passer de 3 composantes à 1, il faut donc au moins **2** arêtes.",
                "Deux suffisent : avec `{3,4}` et `{6,7}`, le graphe devient connexe."
              ]
            },
            { schema: graphe(P_TRIO, A_TRIO + " 3-4 6-7", { marques: { "3-4": "c", "6-7": "c" }, legende: "Deux liens rétablis (en vert)" }) },
            { remarque: "Plus généralement, il faut au moins `c − 1` arêtes pour relier c composantes ; un graphe connexe d'ordre n a donc au moins `n − 1` arêtes (on part de n sommets isolés)." }
          ]
        },
        exercices: [
          {
            type: "selection", niveau: 1,
            titre: "Trouver une composante",
            enonce: "Sélectionnez les sommets de la composante connexe qui contient 8.",
            graphe: { sommets: P_GA, aretes: A_GA },
            regles: [{ regle: "composante", contient: "8" }],
            solution: "3 6 8",
            explication: ["Depuis 8 : `{6,8}` puis `{3,6}`, et plus rien. La composante est `{3; 6; 8}`."]
          },
          {
            type: "champs", niveau: 1,
            titre: "Nombre de connexité",
            enonce: "Combien ce graphe a-t-il de composantes connexes ?",
            schema: graphe(P_GA, A_GA),
            champs: [{ libelle: "Nombre de connexité", reponse: 3, tolerance: 0 }],
            explication: ["`{1; 2; 4}`, `{3; 6; 8}` et `{5; 7}`."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Partiel, sous-graphe, engendré",
            enonce: "G est le graphe du CM1 (à gauche) et H le graphe de droite. Que dire de H ?",
            schema: [graphe(P_CM1, A_CM1, { legende: "G" }), graphe("1:1,0 4:3,0 2:0,1 3:2,1", "1-2 2-3 2-4", { legende: "H" })],
            choix: [
              "H est un graphe partiel de G.",
              "H est un sous-graphe de G.",
              "H est le sous-graphe engendré `G[{1; 2; 3; 4}]`."
            ],
            reponse: [1],
            explication: [
              "Les sommets et arêtes de H sont des sommets et arêtes de G : c'est un sous-graphe.",
              "Ce n'est pas un graphe partiel (le sommet 5 manque) ni `G[{1; 2; 3; 4}]` : l'arête `{1,3}` de G, entre deux sommets de H, a été retirée."
            ]
          },
          {
            type: "construire", niveau: 2,
            titre: "Tracer un sous-graphe engendré",
            enonce: "G est le graphe du CM1 (ci-dessous). Tracez `G[{1; 2; 3; 5}]` (laissez 4 sans arête).",
            schema: graphe(P_CM1, A_CM1, { legende: "G" }),
            graphe: { sommets: P_CM1 },
            attendu: "1-2 1-3 1-5 2-3 3-5",
            explication: ["On garde toutes les arêtes de G entre 1, 2, 3 et 5 : `{1,2}`, `{1,3}`, `{1,5}`, `{2,3}`, `{3,5}`. Les arêtes `{2,4}` et `{4,5}` touchent 4 : elles disparaissent."]
          },
          {
            type: "construire", niveau: 3,
            titre: "Reconnecter au moindre coût",
            enonce: "Ajoutez le **plus petit nombre** d'arêtes possible pour rendre ce graphe connexe (sans retirer d'arête).",
            graphe: { sommets: P_GA },
            depart: A_GA,
            regles: [
              { regle: "contient", aretes: A_GA, message: "Ne retirez pas les arêtes existantes." },
              { regle: "connexe" },
              { regle: "nbAretes", n: 8, message: "Le graphe est connexe, mais on peut le faire avec moins d'arêtes ajoutées." }
            ],
            solution: A_GA + " 4-5 7-8",
            indice: "Comptez d'abord les composantes connexes.",
            explication: ["3 composantes : il faut et il suffit d'ajouter 2 arêtes, chacune entre deux composantes différentes, par exemple `{4,5}` et `{7,8}`."]
          },
          {
            type: "qcm", niveau: 3,
            titre: "Le minimum d'arêtes",
            enonce: "Combien d'arêtes, au minimum, possède un graphe connexe d'ordre 8 ?",
            schema: graphe("1 2 3 4 5 6 7 8", "1-2 2-3 3-4 4-5 5-6 6-7 7-8", { disposition: "cercle", legende: "Une chaîne passant par les 8 sommets" }),
            choix: ["4", "7", "8", "28"],
            reponse: 1,
            explication: ["Partant de 8 sommets isolés (8 composantes), chaque arête retire au plus une composante : il en faut au moins 7. La chaîne `(1, 2, …, 8)` montre que 7 suffisent."]
          },
          {
            type: "champs", niveau: 4,
            titre: "Le plus d'arêtes sans être connexe",
            enonce: "Un graphe simple a 6 sommets et exactement 2 composantes connexes. Combien d'arêtes peut-il avoir, au maximum ?",
            schema: graphe("1 2 3 4 5 6", "1-2 1-3 1-4 1-5 2-3 2-4 2-5 3-4 3-5 4-5", { disposition: "cercle", marques: { 6: "d" }, legende: "Une composante complète et un sommet seul" }),
            champs: [{ libelle: "Nombre maximal d'arêtes", reponse: 10, tolerance: 0 }],
            indice: "Si les composantes ont a et b sommets (a + b = 6), combien d'arêtes au plus dans chacune ?",
            explication: [
              "Une composante à a sommets a au plus `a(a − 1)/2` arêtes. Avec `a + b = 6` : (5, 1) donne `10 + 0`, (4, 2) donne `6 + 1`, (3, 3) donne `3 + 3`.",
              "Le maximum est **10** : un graphe complet sur 5 sommets et un sommet isolé."
            ]
          },
          {
            type: "remettre", niveau: 4,
            titre: "Rédiger : beaucoup de voisins ⇒ connexe",
            enonce: "Remettez dans l'ordre la preuve de : « si tout sommet d'un graphe simple d'ordre n a un degré au moins `(n − 1)/2`, le graphe est connexe ».",
            etapes: [
              "Soit u et v deux sommets distincts : montrons qu'il existe une chaîne de u à v.",
              "Si u et v sont voisins, la chaîne `(u, v)` convient.",
              "Sinon, `N(u)` et `N(v)` sont inclus dans `V ∖ {u, v}`, qui a `n − 2` éléments.",
              "Or `|N(u)| + |N(v)| ≥ (n − 1)/2 + (n − 1)/2 = n − 1 > n − 2` : `N(u)` et `N(v)` ont un sommet commun w.",
              "`(u, w, v)` est alors une chaîne de u à v : le graphe est connexe. □"
            ],
            explication: ["Argument des tiroirs : deux ensembles de taille totale `n − 1` rangés dans `n − 2` places se chevauchent."]
          }
        ]
      },

      /* ---------- Leçon 3.2 ---------- */
      {
        type: "lecon",
        id: "gm-forte",
        titre: "Forte connexité et graphe réduit",
        description: "Composantes fortement connexes, graphe réduit sans circuit (TD1, ex. 4 et 5).",
        cours: [
          {
            titre: "Fortement connexe",
            texte: [
              "Un graphe orienté est **fortement connexe** si, pour tout couple `(i, j)`, il existe un **chemin** de i à j (en respectant le sens des arcs).",
              "Fortement connexe ⇒ connexe ; la réciproque est fausse."
            ],
            schema: [
              oriente("1:0,1 2:1,0 3:2,1", "1>2 2>3 3>1", { legende: "Fortement connexe : on tourne" }),
              oriente("1:0,1 2:1,0 3:2,1", "1>2 2>3 1>3", { legende: "Connexe, pas fortement : rien ne mène à 1" })
            ],
            redaction: ["Dans le graphe de droite, 1 n'a aucun prédécesseur : il n'existe aucun chemin de 2 vers 1. Ce graphe est connexe mais pas fortement connexe."]
          },
          {
            titre: "Composantes fortement connexes",
            texte: [
              "Une **composante fortement connexe** (CFC) est un sous-graphe fortement connexe **maximal**.",
              "Deux sommets i et j sont dans la même CFC si et seulement s'il existe un chemin de i à j **et** un chemin de j à i."
            ],
            schema: gF6({ groupes: ["1 2", "3", "4 5 6"], legende: "CM1, figure 6 : trois CFC" }),
            redaction: [
              "`X₀ = {1; 2}` : `(1,2)` et `(2,1)`. `X₂ = {4; 5; 6}` : `(4, 5, 6, 4)` est un circuit. `X₁ = {3}` : 3 n'a pas de successeur, il ne revient vers personne.",
              "G est connexe mais pas fortement connexe ; ses CFC sont `G[X₀]`, `G[X₁]` et `G[X₂]`."
            ]
          },
          {
            titre: "Fortement connexe, mais pas maximal",
            texte: ["`G[{4; 6}]` est fortement connexe (`(4,6)` et `(6,4)`), mais on peut lui ajouter 5 sans perdre cette propriété : ce n'est pas une composante."],
            schema: gF6({ marques: { 4: "a", 6: "a", "4>6": "a", "6>4": "a", 5: "b" }, legende: "{4; 6} se prolonge en {4; 5; 6}" }),
            redaction: ["`G[{4; 6}]` est fortement connexe non maximal ; `G[{4; 5; 6}]` est fortement connexe maximal : c'est une CFC."]
          },
          {
            titre: "Le graphe réduit",
            texte: [
              "Le **graphe réduit** `Gr` a pour sommets les CFC de G ; on trace un arc de `Xᵢ` vers `Xⱼ` s'il existe au moins un arc de G d'un sommet de `Xᵢ` vers un sommet de `Xⱼ`.",
              "Il résume la structure : à l'intérieur d'un sommet de `Gr`, on circule librement ; entre les sommets, on ne va que dans un sens."
            ],
            schema: [
              gF6({ groupes: ["1 2", "3", "4 5 6"], legende: "G" }),
              oriente("X0:1,0 X1:0,1.3 X2:2,1.3", "X0>X1 X0>X2", { groupes: ["X0", "X1", "X2"], legende: "Gr" })
            ],
            redaction: ["`(1,3)` va de `X₀` à `X₁` et `(2,4)` de `X₀` à `X₂` : `Gr = ({X₀; X₁; X₂}, {(X₀, X₁); (X₀, X₂)})`."]
          },
          {
            titre: "Trouver une CFC à la main",
            texte: [
              "Pour un sommet i :",
              [
                "ses **descendants** `D(i)` : les sommets atteints depuis i par un chemin (i compris) ;",
                "ses **ascendants** `A(i)` : les sommets qui atteignent i par un chemin (i compris)."
              ],
              "La CFC de i est `D(i) ∩ A(i)`. On recommence avec un sommet pas encore rangé."
            ],
            schema: gTD1or({ marques: { 1: "a", 2: "a", 3: "a", 4: "a", 5: "b", 6: "b", 7: "b", 8: "e" }, legende: "TD1 : D(3) = bleu + orange ; A(3) = bleu" }),
            redaction: [
              "`D(3) = {1; 2; 3; 4; 5; 6; 7}` et `A(3) = {1; 2; 3; 4}` (5, 6, 7, 8 n'atteignent jamais 3).",
              "La CFC de 3 est `D(3) ∩ A(3) = {1; 2; 3; 4}`."
            ]
          }
        ],
        problematique: {
          texte: [
            "Dans une architecture de microservices, un arc `(A, B)` signifie « A appelle B ».",
            "Des services qui s'appellent en boucle (directement ou indirectement) dépendent les uns des autres : ils doivent être mis à jour ensemble. Comment trouver ces groupes, et comment se dépendent-ils entre eux ?"
          ],
          schema: gTD1or({ legende: "Les appels entre 8 services" })
        },
        exemple: {
          texte: ["Graphe orienté du TD1 (exercice 4, questions 6 et 7) :"],
          schema: gTD1or(),
          questions: [
            "Le graphe est-il connexe ? Est-il fortement connexe ?",
            "Donner les composantes fortement connexes de G, ainsi que son graphe réduit `Gr`."
          ]
        },
        correction: {
          texte: [
            { titre: "1. Connexité" },
            {
              redaction: [
                "En oubliant le sens des arcs, 1 est relié à 2, 3, 4 ; 3 à 5, 6, 7 ; 6 à 8. G est **connexe**.",
                "8 n'a aucun prédécesseur (`d⁻(8) = 0`) : aucun chemin ne mène à 8. G n'est **pas fortement connexe**."
              ]
            },
            { titre: "2. Composantes fortement connexes" },
            {
              redaction: [
                "`(1, 2, 3, 4, 1)` est un circuit : 1, 2, 3, 4 sont dans la même CFC.",
                "`(5, 6, 7, 6, 5)` est un circuit : 5, 6, 7 sont dans la même CFC.",
                "Aucun arc ne sort de `{5; 6; 7}` vers `{1; 2; 3; 4}` : ces deux groupes sont distincts. 8 ne peut être atteint par personne : il est seul.",
                "Les CFC sont `X₁ = {1; 2; 3; 4}`, `X₂ = {5; 6; 7}` et `X₃ = {8}`."
              ]
            },
            { schema: gTD1or({ groupes: ["1 2 3 4", "5 6 7", "8"] }) },
            { titre: "Graphe réduit" },
            { redaction: ["Les arcs `(3,5)`, `(3,6)`, `(3,7)`, `(4,5)` vont de `X₁` vers `X₂` ; `(8,6)` va de `X₃` vers `X₂`. Donc `Gr = ({X₁; X₂; X₃}, {(X₁, X₂); (X₃, X₂)})`."] },
            { schema: oriente("X1:0,0 X2:1,1 X3:2,0", "X1>X2 X3>X2", { groupes: ["X1", "X2", "X3"], legende: "Gr" }) },
            { remarque: "Le graphe réduit n'a pas de circuit : c'est l'objet du TD1, exercice 5 (dernier exercice de cette leçon)." }
          ]
        },
        exercices: [
          {
            type: "qcm", niveau: 1,
            titre: "Connexe ou fortement connexe",
            enonce: "Pour un graphe orienté G d'ordre au moins 2, quelles affirmations sont vraies ?",
            schema: oriente("1:0,1 2:1,0 3:2,1", "1>2 2>3 3>1"),
            choix: [
              "Si G est fortement connexe, il est connexe.",
              "Si G est connexe, il est fortement connexe.",
              "S'il existe un circuit passant par tous les sommets, G est fortement connexe.",
              "Si un sommet n'a aucun prédécesseur, G n'est pas fortement connexe."
            ],
            reponse: [0, 2, 3],
            explication: [
              "Un chemin est une chaîne : forte connexité ⇒ connexité. L'inverse est faux (graphe `1 → 2`).",
              "Un circuit passant partout permet d'aller de n'importe quel sommet à n'importe quel autre. Un sommet sans prédécesseur n'est atteint par aucun autre."
            ]
          },
          {
            type: "selection", niveau: 1,
            titre: "La CFC de 6",
            enonce: "Sélectionnez la composante fortement connexe qui contient 6.",
            graphe: { sommets: P_CM1_F6, aretes: A_CM1_F6, oriente: true },
            regles: [{ regle: "cfc", contient: "6" }],
            solution: "4 5 6",
            explication: ["`(4, 5, 6, 4)` est un circuit ; 1, 2, 3 ne sont pas atteints depuis 6."]
          },
          {
            type: "selection", niveau: 2,
            titre: "La CFC de 2 dans le TD1",
            enonce: "Sélectionnez la composante fortement connexe qui contient 2.",
            graphe: { sommets: P_TD1_OR, aretes: A_TD1_OR, oriente: true },
            regles: [{ regle: "cfc", contient: "2" }],
            solution: "1 2 3 4",
            explication: ["`(1, 2, 3, 4, 1)` est un circuit ; depuis `{5; 6; 7}` on ne revient pas vers 2."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Toutes les CFC",
            enonce: "Donnez les composantes fortement connexes de ce graphe, sous la forme `{…}, {…}, …`.",
            schema: oriente(P_GB, A_GB),
            champs: [{ libelle: "Composantes fortement connexes", reponse: "{1, 2, 3}, {4, 5, 6}, {7, 8}", partition: true }],
            indice: "Cherchez les circuits : chacun est inclus dans une seule CFC.",
            explication: [
              "Circuits `(1, 2, 3, 1)`, `(4, 5, 6, 4)` et `(7, 8, 7)`.",
              "Les arcs `(3,4)` et `(1,5)` vont de `{1; 2; 3}` vers `{4; 5; 6}` sans retour ; `(6,7)` et `(5,8)` de `{4; 5; 6}` vers `{7; 8}` sans retour."
            ]
          },
          {
            type: "construire", niveau: 3,
            titre: "Tracer le graphe réduit",
            enonce: "Avec `X₁ = {1; 2; 3}`, `X₂ = {4; 5; 6}`, `X₃ = {7; 8}` (exercice précédent), tracez le graphe réduit.",
            schema: oriente(P_GB, A_GB, { groupes: ["1 2 3", "4 5 6", "7 8"] }),
            graphe: { sommets: "X1:0,0 X2:1.6,0 X3:3.2,0", oriente: true },
            attendu: "X1>X2 X2>X3",
            explication: ["`(3,4)` et `(1,5)` donnent l'arc `(X₁, X₂)` ; `(6,7)` et `(5,8)` donnent `(X₂, X₃)`. Plusieurs arcs de G ne donnent qu'un seul arc de `Gr`."]
          },
          {
            type: "construire", niveau: 3,
            titre: "Un seul arc pour tout relier",
            enonce: "Ajoutez **un seul** arc à ce graphe pour le rendre fortement connexe.",
            graphe: { sommets: P_GB, oriente: true },
            depart: A_GB,
            regles: [
              { regle: "contient", aretes: A_GB, message: "Ne retirez pas les arcs existants." },
              { regle: "nbAretes", n: 13, message: "Il faut ajouter exactement un arc." },
              { regle: "fortementConnexe" }
            ],
            solution: A_GB + " 7>1",
            indice: "Le graphe réduit est `X₁ → X₂ → X₃` : il manque un retour.",
            explication: ["Un arc de `X₃` vers `X₁`, par exemple `(7,1)`, ferme le circuit `X₁ → X₂ → X₃ → X₁` : toutes les composantes fusionnent."]
          },
          {
            type: "remettre", niveau: 4,
            titre: "TD1, exercice 5 : pas de circuit dans Gr",
            enonce: "Remettez dans l'ordre la démonstration de : « un graphe réduit ne contient pas de circuit ».",
            etapes: [
              "Supposons que `Gr` contienne un circuit `(X₁, X₂, …, X_k, X₁)` passant par `k ≥ 2` composantes distinctes.",
              "Pour chaque arc `(X_a, X_(a+1))` de `Gr`, il existe un arc de G d'un sommet de `X_a` vers un sommet de `X_(a+1)`.",
              "Dans chaque composante, tout sommet atteint tout autre : on enchaîne ces arcs en un chemin de G qui part de `X₁`, traverse `X₂, …, X_k` et revient dans `X₁`.",
              "Ainsi tout sommet de `X₁` atteint tout sommet de `X₂`, et réciproquement : `X₁ ∪ X₂` engendre un sous-graphe fortement connexe.",
              "Cela contredit la maximalité de la composante `X₁` : `Gr` n'a pas de circuit. □"
            ],
            explication: ["Schéma classique : supposer un circuit, le relever en chemins de G, contredire la **maximalité** des composantes."]
          },
          {
            type: "construire", niveau: 4,
            titre: "Rendre le TD1 fortement connexe",
            enonce: "Ajoutez exactement **deux** arcs au graphe du TD1 pour le rendre fortement connexe.",
            graphe: { sommets: P_TD1_OR, oriente: true },
            depart: A_TD1_OR,
            regles: [
              { regle: "contient", aretes: A_TD1_OR, message: "Ne retirez pas les arcs existants." },
              { regle: "nbAretes", n: 16, message: "Il faut ajouter exactement deux arcs." },
              { regle: "fortementConnexe" }
            ],
            solution: A_TD1_OR + " 5>1 6>8",
            indice: "`Gr = X₁ → X₂ ← X₃` avec `X₁ = {1; 2; 3; 4}`, `X₂ = {5; 6; 7}`, `X₃ = {8}`. Depuis `X₂`, il faut pouvoir rejoindre `X₁` et `X₃`.",
            explication: [
              "Par exemple `(5,1)` et `(6,8)` : depuis `X₂` on rejoint maintenant `X₁` et `X₃`, qui mènent eux-mêmes à `X₂`.",
              "Un seul arc ne suffit pas : `X₁` et `X₃` ne reçoivent aucun arc des autres composantes, et un arc ajouté n'entre que dans une seule composante."
            ]
          }
        ]
      }
    ]
  });
})();
