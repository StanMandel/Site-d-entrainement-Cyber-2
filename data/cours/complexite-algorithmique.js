/* =============================================================
   Complexité algorithmique
   -------------------------------------------------------------
   Leçons (type "lecon", moteur assets/js/lecon.js) tirées des
   cours CM1 à CM3 : un cours pas à pas illustré (schéma ou
   exécution animée du code), une problématique, un exemple, sa
   correction rédigée ligne par ligne et des exercices de
   difficulté croissante (niveau 4 = au-delà du cours).

   Fichiers de la matière, dans l'ordre de chargement :
     complexite-algorithmique.js             guide, ch. 1 : compter les opérations
     complexite-algorithmique-landau.js      ch. 2 : notations O, Ω, Θ
     complexite-algorithmique-proprietes.js  ch. 3 : propriétés de calcul
     complexite-algorithmique-analyse.js     ch. 4-5 : analyser un algorithme,
                                             boucles logarithmiques, récurrences
   Les animations (champ « animation ») sont exécutées par
   assets/js/trace.js ; leurs comptes « attendu » sont vérifiés par
   outils/verifier-exercices.js.
   ============================================================= */

/* Outils partagés par les fichiers de la matière. */
window.OutilsComplexite = (() => {
  const EXP = { "²": "2", "³": "3", "⁴": "4", "⁵": "5" };
  /* Écritures acceptées d'une classe : « Θ(n²) », « theta(n^2) », « Θ(n2) »… */
  const variantes = (rep) => {
    const v = new Set([
      rep.replace(/[²³⁴⁵]/g, (c) => "^" + EXP[c]),
      rep.replace(/[²³⁴⁵]/g, (c) => EXP[c])
    ]);
    if (/log/.test(rep)) { v.add(rep.replace(/log/g, "log2")); v.add(rep.replace(/log/g, "log₂")); }
    if (/√n/.test(rep)) { v.add(rep.replace("√n", "sqrt(n)")); v.add(rep.replace("√n", "n^0.5")); v.add(rep.replace("√n", "n^(1/2)")); }
    v.delete(rep);
    return [...v];
  };
  /* Une case de réponse : nombre exact, ou classe avec ses variantes. */
  const champ = (libelle, reponse, plus) => Object.assign(
    { libelle, reponse },
    typeof reponse === "number" ? { tolerance: 0 } : {},
    typeof reponse === "string" && /[ΘOΩ]\(/.test(reponse) ? { accepte: variantes(reponse) } : {},
    plus || {});
  const courbes = (fonctions, plus) => Object.assign({
    type: "courbes",
    fonctions: fonctions.map(([f, nom, style, pointille]) => ({ f, nom, style, pointille }))
  }, plus || {});
  const grille = (n, cases, plus) => Object.assign({ type: "grille", n, cases }, plus || {});
  const log2 = (x) => Math.log2(Math.max(x, 1e-9));
  /* Tableaux d'entrée des animations. */
  const croissant = (n) => Array.from({ length: n }, (_, k) => k + 1);
  const decroissant = (n) => Array.from({ length: n }, (_, k) => n - k);
  const melange = (n) => [5, 2, 8, 1, 9, 3, 7, 4, 6, 0].slice(0, n);
  const CLASSES = ["Θ(1)", "Θ(n)", "Θ(n²)", "O(1)", "O(n)", "O(n²)"];
  return { variantes, champ, courbes, grille, log2, croissant, decroissant, melange, CLASSES };
})();

(() => {
  const { champ, courbes, grille, log2, croissant, decroissant, melange } = window.OutilsComplexite;

  /* ---------------- Codes des CM ---------------- */
  const ALGO1 = `int algo1() {
    int a = 1;
    int b = 2;
    return a + b;
}`;
  const CALCUL = `int calcul(int a, int b) {
    int c = a * b;
    c = c + a - b;
    return c;
}`;
  const ALGO2 = `void algo2(int a, int b) {
    int c = 4;
    if (a == 1) {
        if (b >= 2) {
            if ((c - b) == 2) {
                printf("c vaut 4\\n");
            } else {
                printf("c ne vaut pas 4\\n");
            }
        }
    }
}`;
  const SIGNE = `int signe(int x, int y) {
    int p = x * y;
    if (p > 0) {
        return 1;
    } else {
        if (p < 0) {
            return -1;
        }
    }
    return 0;
}`;
  const AFFICHE = `void affiche(int n) {
    for (int i = 0; i < n; i++) {
        printf("%d\\n", i);
    }
}`;
  const ALGO4 = `void algo4(int n) {
    for (int i = 0; i < n; i++) {
        if (i % 2 == 0) {
            printf("%d est pair.\\n", i);
        }
    }
}`;
  const ALGO3 = `int algo3(int n) {
    int count = 0;
    while (n >= 1) {
        n = n / 10;
        count++;
    }
    return count;
}`;
  const SUSPECTES = `int suspectes(int t[], int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] == 1) {
            c = c + 1;
        }
    }
    return c;
}`;
  const GRILLE = `void grille(int n, int m) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            printf("(%d, %d)\\n", i, j);
        }
    }
}`;
  const ALGO5 = `void algo5(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            printf("Un appel\\n");
        }
    }
}`;
  const PAIRES = `int paires(int t[], int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[i] == t[j]) {
                c++;
            }
        }
    }
    return c;
}`;
  const SOMME_REC = `int somme(int n) {
    if (n == 0) {
        return 0;
    }
    return n + somme(n - 1);
}`;
  const ALGO6 = `int algo6(int n, int sum) {
    if (n == 0) {
        return sum;
    } else {
        return algo6(n - 1, 3 * sum);
    }
}`;
  const PUISSANCE = `int puissance(int x, int n) {
    if (n == 0) {
        return 1;
    }
    return x * puissance(x, n - 1);
}`;
  const SEARCH = `int searchTab(int values[], int size, int num) {
    for (int i = 0; i < size; i++) {
        if (values[i] == num) {
            return 1;
        }
    }
    return 0;
}`;
  const SELECTION = `void selectionSort(int tab[], int n) {
    int temp = 0;
    int indMax = 0;
    for (int i = 0; i < n - 1; i++) {
        indMax = 0;
        for (int j = 1; j < n - i; j++) {
            if (tab[indMax] < tab[j]) {
                indMax = j;
            }
        }
        if (indMax != n - i - 1) {
            temp = tab[indMax];
            tab[indMax] = tab[n - 1 - i];
            tab[n - i - 1] = temp;
        }
    }
}`;
  const VERIFIE = `int verifie(int saisi[], int secret[], int n) {
    for (int i = 0; i < n; i++) {
        if (saisi[i] != secret[i]) {
            return 0;
        }
    }
    return 1;
}`;
  const MAXTAB = `int maxTab(int values[], int size) {
    int indMax = 0;
    for (int i = 1; i < size; i++) {
        if (values[indMax] < values[i]) {
            indMax = i;
        }
    }
    return values[indMax];
}`;

  const triangle = (n) => n * (n - 1) / 2;
  const secret = (n) => Array.from({ length: n }, (_, k) => (k * 3 + 1) % 10);

  CONTENU["complexite-algorithmique"] = {

    /* =========================================================
       GUIDE — l'aide-mémoire
       ========================================================= */
    guides: [
      {
        id: "rediger",
        titre: "Aide-mémoire : rédiger en complexité",
        resume: "Les réflexes de rédaction, les sept propriétés et les sommes à citer.",
        niveau: "Tous niveaux",
        sections: [
          {
            type: "notion",
            titre: "Les cinq réflexes",
            points: [
              "**Annoncer le but** : « Il s'agit de trouver `c > 0` et `n₀` tels que, pour tout `n ≥ n₀`, … »",
              "**Fixer `n`** : « Soit `n ≥ 1`. »",
              "**Justifier chaque inégalité** : `1 ≤ n`, `−5n ≤ 0`, `log₂ n ≤ n`.",
              "**Nommer les constantes** : `c = 14`, `n₀ = 1`.",
              "**Conclure par la définition** : « Par définition, `f(n) = O(n²)`. »"
            ],
            attention: "Écrire `f(n) ≤ O(n²)` est faux : on manipule des fonctions et des constantes, le symbole n'apparaît qu'à la conclusion."
          },
          {
            type: "notion",
            titre: "Les sept propriétés (CM2)",
            tableau: {
              entetes: ["N°", "Propriété"],
              lignes: [
                ["(1)", "`λ = O(1)`"],
                ["(2)", "`f = O(f)`"],
                ["(3)", "`O(f) + O(g) = O(f + g)`"],
                ["(4)", "`O(f + g) = O(max(f, g))`"],
                ["(5)", "`O(f) × O(g) = O(f × g)`"],
                ["(6)", "`O(λ·f) = O(f)`"],
                ["(7)", "`f = O(g)` et `g = O(h)` ⇒ `f = O(h)`"]
              ]
            },
            remarque: "Les mêmes propriétés valent pour `Ω` et `Θ`."
          },
          {
            type: "notion",
            titre: "Sommes et logarithmes",
            tableau: {
              entetes: ["Formule", "Usage"],
              lignes: [
                ["`1 + 2 + … + n = n(n + 1)/2`", "boucle `j < i`"],
                ["`1² + … + n² = n(n + 1)(2n + 1)/6`", "boucle `j < i * i`"],
                ["`1 + 2 + 4 + … + 2ᵏ = 2ᵏ⁺¹ − 1`", "arbre d'appels binaire"],
                ["`n + n/2 + n/4 + … ≤ 2n`", "boucle + appel sur `n/2`"],
                ["`2ᵗ ≥ n ⟺ t ≥ log₂ n`", "compteur qui double"],
                ["`logₐ n = log₂ n / log₂ a`", "la base ne change pas la classe"]
              ]
            }
          }
        ]
      }
    ],

    chapitres: [

      /* =====================================================
         CHAPITRE 1 — COMPTER LES OPÉRATIONS (CM1)
         ===================================================== */
      {
        id: "ch1",
        titre: "Chapitre 1 — Compter les opérations élémentaires",
        description: "Séquences, tests, boucles, boucles imbriquées, récursivité, meilleur et pire cas.",
        exercices: [

          /* ---------- Leçon 1.1 ---------- */
          {
            type: "lecon",
            id: "ca-operations",
            titre: "Opérations élémentaires et tests",
            description: "Ce qui compte pour une opération, et pourquoi on compte au pire cas.",
            cours: [
              {
                titre: "Compter plutôt que chronométrer",
                texte: [
                  "Le temps en secondes dépend de la machine et du compilateur. On compte plutôt les **opérations élémentaires** effectuées.",
                  "Exemple du CM1 : un trajet en métro. La force brute (A) explose avec le nombre de stations, Dijkstra (B) non."
                ],
                schema: courbes([
                  [(n) => 2 ** n, "A : 2ⁿ", 2],
                  [(n) => n * n * log2(n), "B : n²·log₂ n", 1]
                ], { xMin: 1, xMax: 14, yMax: 1500, legende: "Nombre d'opérations selon le nombre de stations n" })
              },
              {
                titre: "Ce qui compte pour une opération",
                texte: [
                  "Chacune de ces écritures vaut **une** opération :",
                  [
                    "une déclaration, une affectation ;",
                    "une opération arithmétique `+ - * / %` ;",
                    "une comparaison ou une opération logique ;",
                    "un appel de fonction, un `return`."
                  ],
                  "Une même ligne peut en contenir plusieurs : `int c = a * b;` en vaut 3. Lancez l'animation et suivez le compteur."
                ],
                animation: {
                  code: CALCUL,
                  operations: true,
                  scenarios: [{ nom: "a = 3, b = 4", entree: { a: 3, b: 4 }, attendu: { ops: 7 } }]
                },
                redaction: [
                  "l.2 : une déclaration, une multiplication, une affectation (3) ;",
                  "l.3 : une addition, une soustraction, une affectation (3) ;",
                  "l.4 : un `return` (1). Soit **7** opérations élémentaires."
                ]
              },
              {
                titre: "Les tests : on compte le pire",
                texte: [
                  "Avec des `if`, le nombre d'opérations dépend des valeurs reçues. On compte le **maximum** :",
                  [
                    "on suppose que chaque test réussit ;",
                    "dans un `if`-`else`, on garde le bloc le plus coûteux."
                  ],
                  "Comparez les scénarios : le premier atteint 7, le dernier s'arrête au premier test."
                ],
                animation: {
                  code: ALGO2,
                  operations: true,
                  mesure: [],
                  scenarios: [
                    { nom: "a = 1, b = 2", entree: { a: 1, b: 2 }, attendu: { ops: 7 } },
                    { nom: "a = 1, b = 5", entree: { a: 1, b: 5 }, attendu: { ops: 7 } },
                    { nom: "a = 0", entree: { a: 0, b: 5 }, attendu: { ops: 3 } }
                  ]
                },
                redaction: [
                  "l.2 : déclaration et affectation (2) ; l.3 et l.4 : un test chacune (2) ;",
                  "l.5 : une soustraction et un test (2) ; le `if`-`else` n'exécute qu'**un** `printf` (1).",
                  "Il y a donc **7** opérations élémentaires au maximum dans `algo2`."
                ]
              }
            ],
            problematique: {
              texte: [
                "Une fonction de contrôle d'accès ne fait pas le même travail selon les valeurs reçues.",
                "Quel nombre d'opérations faut-il annoncer pour **garantir** son coût, quelle que soit l'entrée ?"
              ],
              codeC: SIGNE
            },
            exemple: {
              texte: ["On étudie la fonction `signe` ci-dessous."],
              codeC: SIGNE,
              questions: [
                "Combien d'opérations la ligne 2 contient-elle ?",
                "Combien d'opérations pour `x = 2`, `y = 3` ?",
                "Combien d'opérations au pire cas ? Pour quelles entrées ?"
              ]
            },
            correction: {
              texte: [
                { titre: "1. La ligne 2" },
                { redaction: ["`int p = x * y;` : une déclaration, une multiplication, une affectation, soit **3**."] },
                { titre: "2. Pour x = 2, y = 3" },
                { redaction: ["`p = 6 > 0` : l.2 (3), test l.3 (1), `return 1` (1), soit **5** opérations."] },
                { titre: "3. Le pire cas" },
                {
                  demo: [
                    ["Si `p > 0` : 3 + 1 + 1 = 5 opérations.", "branche `if`"],
                    ["Si `p < 0` : 3 + 1 (test l.3) + 1 (test l.6) + 1 (`return -1`) = 6.", "`-1` est une constante"],
                    ["Si `p = 0` : 3 + 1 + 1 + 1 (`return 0`) = 6.", "les deux tests échouent"],
                    ["Au pire cas, `signe` fait **6** opérations, atteintes dès que `p ≤ 0`.", "on garde le maximum"]
                  ]
                },
                {
                  animation: {
                    code: SIGNE, operations: true,
                    scenarios: [
                      { nom: "p > 0", entree: { x: 2, y: 3 }, attendu: { ops: 5 } },
                      { nom: "p < 0", entree: { x: 2, y: -3 }, attendu: { ops: 6 } },
                      { nom: "p = 0", entree: { x: 0, y: 5 }, attendu: { ops: 6 } }
                    ]
                  }
                }
              ]
            },
            exercices: [
              {
                type: "champs", niveau: 1,
                titre: "Une fonction sans test",
                enonce: "Combien d'opérations élémentaires cette fonction effectue-t-elle ?",
                code: `int f() {
    int a = 3;
    int b = 4;
    int c = a * b;
    return c - a;
}`,
                champs: [champ("Opérations", 9)],
                indice: "Une déclaration avec valeur initiale compte 2 ; ajoutez les opérations arithmétiques.",
                explication: ["l.2 et l.3 : 2 chacune ; l.4 : déclaration, multiplication, affectation (3) ; l.5 : soustraction et `return` (2). Total : **9**."]
              },
              {
                type: "qcm", niveau: 1,
                titre: "Une affectation avec calcul",
                enonce: "Combien d'opérations élémentaires compte l'instruction `x = x + 1;` ?",
                choix: ["1", "2", "3", "4"],
                reponse: 1,
                explication: ["Une addition et une affectation : **2**."]
              },
              {
                type: "lignes", niveau: 1,
                titre: "Exactement deux opérations",
                enonce: "Cliquez les lignes qui contiennent **exactement deux** opérations élémentaires.",
                code: `int f(int a, int b) {
    int s = a + b;
    int d;
    d = a - b;
    s = s * d;
    return s;
}`,
                reponse: [4, 5],
                explication: [[
                  "l.2 : déclaration, addition, affectation (3) ;",
                  "l.3 : une déclaration seule (1) ;",
                  "l.4 et l.5 : un calcul et une affectation (2) ;",
                  "l.6 : un `return` (1)."
                ]]
              },
              {
                type: "champs", niveau: 2,
                titre: "Tests imbriqués",
                enonce: "Combien d'opérations élémentaires au pire cas ?",
                code: `void g(int a, int b) {
    int c = 5;
    if (a > 0) {
        if (b < c) {
            printf("ok\\n");
        }
    }
}`,
                champs: [champ("Pire cas", 5)],
                indice: "Supposez que les deux tests réussissent.",
                explication: [
                  "l.2 (2) + test l.3 (1) + test l.4 (1) + `printf` (1) = **5**.",
                  { animation: { code: `void g(int a, int b) {
    int c = 5;
    if (a > 0) {
        if (b < c) {
            printf("ok\\n");
        }
    }
}`, operations: true, scenarios: [
                    { nom: "Pire cas", entree: { a: 1, b: 2 }, attendu: { ops: 5 } },
                    { nom: "a ≤ 0", entree: { a: 0, b: 2 }, attendu: { ops: 3 } }] } }
                ]
              },
              {
                type: "qcm", niveau: 2,
                titre: "Le if-else au pire cas",
                enonce: "Pour compter au pire cas une structure `if`-`else`, on compte :",
                choix: ["les deux blocs", "le bloc le plus coûteux", "le bloc le moins coûteux", "seulement le test"],
                reponse: 1,
                explication: ["Un seul des deux blocs s'exécute : on garde le plus coûteux, en plus du test."]
              },
              {
                type: "champs", niveau: 3,
                titre: "Meilleur et pire cas d'un if-else",
                enonce: "Donnez le nombre d'opérations au pire cas et au meilleur cas.",
                code: `int h(int a, int b) {
    int c = a + b;
    if (c > 10) {
        c = c * 2;
        return c - 1;
    } else {
        return c;
    }
}`,
                champs: [champ("Pire cas", 8), champ("Meilleur cas", 5)],
                indice: "Comptez le bloc `if` (deux lignes) et le bloc `else` (une ligne) séparément.",
                explication: [
                  "l.2 (3) + test (1) = 4 dans tous les cas. Bloc `if` : 2 + 2 = 4, total **8**. Bloc `else` : 1, total **5**.",
                  { animation: { code: `int h(int a, int b) {
    int c = a + b;
    if (c > 10) {
        c = c * 2;
        return c - 1;
    } else {
        return c;
    }
}`, operations: true, scenarios: [
                    { nom: "c > 10", entree: { a: 8, b: 5 }, attendu: { ops: 8 } },
                    { nom: "c ≤ 10", entree: { a: 2, b: 3 }, attendu: { ops: 5 } }] } }
                ]
              },
              {
                type: "qcm", niveau: 3,
                titre: "L'entrée du pire cas",
                enonce: "Quelle entrée fait le plus d'opérations ?",
                code: `int max3(int a, int b, int c) {
    int m = a;
    if (b > m) {
        m = b;
    }
    if (c > m) {
        m = c;
    }
    return m;
}`,
                choix: ["`(3, 2, 1)`", "`(1, 2, 3)`", "`(2, 3, 1)`", "`(1, 3, 2)`"],
                reponse: 1,
                explication: ["Les deux affectations s'exécutent si `b > a` puis `c > b` : il faut `a < b < c`, soit `(1, 2, 3)`."]
              },
              {
                type: "champs", niveau: 4,
                titre: "max3 au mieux et au pire",
                enonce: "Pour la fonction `max3` de l'exercice précédent, donnez le nombre d'opérations au pire et au meilleur cas.",
                code: `int max3(int a, int b, int c) {
    int m = a;
    if (b > m) {
        m = b;
    }
    if (c > m) {
        m = c;
    }
    return m;
}`,
                champs: [champ("Pire cas", 7), champ("Meilleur cas", 5)],
                indice: "Les deux tests et le `return` s'exécutent toujours ; seules les deux affectations varient.",
                explication: [
                  "Toujours : l.2 (2), deux tests (2), `return` (1) = 5. Les affectations l.4 et l.7 ajoutent 0, 1 ou 2. Pire **7**, meilleur **5**.",
                  { animation: { code: `int max3(int a, int b, int c) {
    int m = a;
    if (b > m) {
        m = b;
    }
    if (c > m) {
        m = c;
    }
    return m;
}`, operations: true, scenarios: [
                    { nom: "(1, 2, 3)", entree: { a: 1, b: 2, c: 3 }, attendu: { ops: 7 } },
                    { nom: "(2, 3, 1)", entree: { a: 2, b: 3, c: 1 }, attendu: { ops: 6 } },
                    { nom: "(3, 2, 1)", entree: { a: 3, b: 2, c: 1 }, attendu: { ops: 5 } }] } }
                ]
              },
              {
                type: "champs", niveau: 4,
                titre: "Le && s'arrête en route",
                enonce: "En C, `&&` n'évalue pas sa partie droite si la gauche est fausse. Combien d'opérations au pire cas, et pour `a = −1` ?",
                code: `int k(int a, int b) {
    int r = 0;
    if (a > 0 && b > 0) {
        r = a * b;
    }
    return r;
}`,
                champs: [champ("Pire cas", 8), champ("Pour a = −1", 5)],
                indice: "Le test complet vaut 3 opérations : deux comparaisons et le `&&`.",
                explication: [
                  "Pire cas : l.2 (2) + test complet (3) + l.4 (2) + `return` (1) = **8**.",
                  "Pour `a = −1` : `a > 0` est faux, `b > 0` n'est pas évalué. l.2 (2) + `a > 0` et `&&` (2) + `return` (1) = **5**.",
                  { animation: { code: `int k(int a, int b) {
    int r = 0;
    if (a > 0 && b > 0) {
        r = a * b;
    }
    return r;
}`, operations: true, scenarios: [
                    { nom: "a = 2, b = 3", entree: { a: 2, b: 3 }, attendu: { ops: 8 } },
                    { nom: "a = −1", entree: { a: -1, b: 3 }, attendu: { ops: 5 } }] } }
                ]
              }
            ]
          },

          /* ---------- Leçon 1.2 ---------- */
          {
            type: "lecon",
            id: "ca-boucle",
            titre: "Compter une boucle",
            description: "Coût d'un tour × nombre de tours, sans oublier la dernière comparaison.",
            cours: [
              {
                titre: "Coût d'une boucle",
                texte: [
                  "Une boucle coûte **(opérations par tour) × (nombre de tours)**, plus ce qui ne se fait qu'une fois.",
                  "Faites varier `n` : le tableau du bilan montre que chaque tour ajoute 3 opérations."
                ],
                animation: {
                  code: AFFICHE, operations: true,
                  n: { min: 0, max: 6, depart: 4 },
                  mesure: { ligne: 2, nom: "tests i < n" },
                  scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ ops: 3 * n + 3, 2: n + 1 }) }]
                }
              },
              {
                titre: "Les trois parties du for",
                texte: [
                  "Dans `for (int i = 0; i < n; i++)` :",
                  [
                    "`int i = 0` : **une fois**, 2 opérations ;",
                    "`i < n` : avant chaque tour, **plus une fois** pour sortir : `n + 1` fois ;",
                    "`i++` : à la fin de chaque tour, `n` fois."
                  ],
                  "La comparaison ratée explique le `+ 1` qu'on oublie souvent."
                ],
                schema: { type: "barres", legende: "Exécutions pour n = 5", barres: [
                  { nom: "int i = 0", v: 1, texte: "1 fois" },
                  { nom: "i < n", v: 6, texte: "6 fois (n + 1)", style: 2 },
                  { nom: "i++", v: 5, texte: "5 fois" },
                  { nom: "printf", v: 5, texte: "5 fois" }
                ] },
                demo: {
                  enonce: "Opérations de `affiche(n)` :",
                  lignes: [
                    ["Par tour : `i < n` (1), `i++` (1), `printf` (1), soit 3.", "coût d'un tour"],
                    ["Pour les `n` tours : `3n`.", "∑ (i = 0 → n − 1) 3"],
                    ["Une fois : déclaration et initialisation de `i` (2), dernière comparaison (1).", "hors des tours"],
                    ["Total : `T(n) = 3n + 3`.", ""]
                  ]
                }
              },
              {
                titre: "Un if dans la boucle : on prend le pire",
                texte: [
                  "Dans `algo4` (CM1), le `printf` ne s'exécute qu'un tour sur deux. Au pire cas, on le compte **à chaque tour**.",
                  "L'animation montre l'exécution réelle : la ligne 4 s'exécute moins souvent que le compte du pire cas."
                ],
                animation: {
                  code: ALGO4, operations: true,
                  n: { min: 1, max: 8, depart: 5 },
                  mesure: { ligne: 4, nom: "appels à printf" },
                  scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ 4: Math.ceil(n / 2), ops: 4 * n + Math.ceil(n / 2) + 3 }) }]
                },
                demo: {
                  enonce: "Au pire cas (CM1) :",
                  lignes: [
                    ["Par tour : test et incrément (2), modulo et test (2), `printf` (1), soit 5.", "pire cas : on entre dans le `if`"],
                    ["`∑ (i = 0 → n − 1) 5 = 5n`.", ""],
                    ["Plus l'initialisation de `i` (2) et la dernière comparaison (1).", ""],
                    ["`algo4` fait au plus **`5n + 3`** opérations.", ""]
                  ]
                }
              },
              {
                titre: "Une boucle while : trouver le nombre de tours",
                texte: [
                  "Un `while` n'annonce pas son nombre de tours : il faut le déduire de la condition.",
                  "Dans `algo3` (CM1), `n` est divisé par 10 à chaque tour : la boucle fait autant de tours que `n` a de chiffres."
                ],
                animation: {
                  code: ALGO3,
                  mesure: { ligne: 4, nom: "divisions" },
                  scenarios: [
                    { nom: "n = 7", entree: { n: 7 }, attendu: { 4: 1, renvoie: 1 } },
                    { nom: "n = 2026", entree: { n: 2026 }, attendu: { 4: 4, renvoie: 4 } },
                    { nom: "n = 1 000 000", entree: { n: 1000000 }, attendu: { 4: 7, renvoie: 7 } }
                  ]
                }
              }
            ],
            problematique: {
              texte: [
                "Un journal de connexions contient `n` entrées. On compte celles qui viennent d'une adresse suspecte (code 1).",
                "Combien d'opérations au plus pour `n = 1000` entrées ?"
              ]
            },
            exemple: {
              codeC: SUSPECTES,
              questions: [
                "Combien d'opérations coûte un tour, au pire cas ?",
                "Combien d'opérations ne s'exécutent qu'une fois ?",
                "Donnez `T(n)` au pire cas, puis sa valeur pour `n = 1000`."
              ]
            },
            correction: {
              texte: [
                {
                  demo: [
                    ["Par tour : `i < n` (1), `i++` (1), `t[i] == 1` (1), `c = c + 1` (2), soit 5.", "pire cas : le test réussit"],
                    ["Pour les `n` tours : `5n`.", ""],
                    ["Une fois : `int c = 0` (2), `int i = 0` (2), dernière comparaison (1), `return` (1), soit 6.", ""],
                    ["`T(n) = 5n + 6`, donc **5006** opérations pour `n = 1000`.", ""],
                    ["Au meilleur cas (aucune entrée suspecte), la ligne 5 ne s'exécute jamais : `3n + 6`.", "pour comparer"]
                  ]
                },
                {
                  animation: {
                    code: SUSPECTES, operations: true, tableau: "t", pointeurs: ["i"],
                    n: { min: 0, max: 6, depart: 5 },
                    mesure: { ligne: 5, nom: "incréments de c" },
                    scenarios: [
                      { nom: "Pire cas", texte: "que des entrées suspectes", entree: (n) => ({ t: Array(n).fill(1), n }), attendu: (n) => ({ ops: 5 * n + 6 }) },
                      { nom: "Meilleur cas", texte: "aucune entrée suspecte", entree: (n) => ({ t: Array(n).fill(0), n }), attendu: (n) => ({ ops: 3 * n + 6 }) }
                    ]
                  }
                }
              ]
            },
            exercices: [
              {
                type: "champs", niveau: 1,
                titre: "Une boucle d'affichage",
                enonce: "Écrivez le nombre d'opérations de `affiche(n)` sous la forme `T(n) = a·n + b`.",
                code: AFFICHE,
                champs: [champ("`a`", 3), champ("`b`", 3)],
                indice: "Par tour : test, incrément, printf. Une fois : initialisation et dernière comparaison.",
                explication: ["3 opérations par tour, plus 2 + 1 hors des tours : `3n + 3`."]
              },
              {
                type: "champs", niveau: 1,
                titre: "Tests et incréments",
                enonce: "Dans `for (int i = 0; i < n; i++)`, avec `n = 10` :",
                champs: [champ("Nombre de tests `i < n`", 11), champ("Nombre d'incréments `i++`", 10)],
                indice: "Le dernier test échoue et fait sortir de la boucle.",
                explication: ["10 tests réussis et 1 test raté : **11**. L'incrément suit chaque tour : **10**."]
              },
              {
                type: "qcm", niveau: 1,
                titre: "Un test qui calcule",
                enonce: "Combien d'opérations coûte un test `i < n - 1` ?",
                choix: ["1", "2", "3"],
                reponse: 1,
                explication: ["Une soustraction et une comparaison : **2** (le CM1 le signale : `i < n` et `i < n - 1` ne coûtent pas pareil)."]
              },
              {
                type: "champs", niveau: 2,
                titre: "Somme des carrés",
                enonce: "Écrivez le nombre d'opérations sous la forme `T(n) = a·n + b`.",
                code: `int carres(int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + i * i;
    }
    return s;
}`,
                champs: [champ("`a`", 5), champ("`b`", 6)],
                indice: "La ligne 4 contient une multiplication, une addition et une affectation.",
                explication: [
                  "Par tour : test (1), incrément (1), ligne 4 (3) = 5. Une fois : l.2 (2), `int i = 0` (2), dernière comparaison (1), `return` (1) = 6. `T(n) = 5n + 6`.",
                  { animation: { code: `int carres(int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + i * i;
    }
    return s;
}`, operations: true, n: { min: 0, max: 6, depart: 3 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ ops: 5 * n + 6 }) }] } }
                ]
              },
              {
                type: "champs", niveau: 2,
                titre: "Tours d'algo3",
                enonce: "Combien de tours fait la boucle `while` d'`algo3` (CM1) ?",
                code: ALGO3,
                champs: [champ("Pour `n = 2026`", 4), champ("Pour `n = 99 999`", 5)],
                indice: "Chaque tour retire un chiffre à `n`.",
                explication: ["`n` prend les valeurs 2026, 202, 20, 2 puis 0 : **4** tours. 99 999 a 5 chiffres : **5** tours."]
              },
              {
                type: "champs", niveau: 3,
                titre: "Un pas de 2",
                enonce: "Combien de tours fait cette boucle ?",
                code: `void pas2(int n) {
    for (int i = 0; i < n; i = i + 2) {
        printf("%d\\n", i);
    }
}`,
                champs: [champ("Pour `n = 10`", 5), champ("Pour `n = 11`", 6)],
                indice: "Listez les valeurs de `i` strictement inférieures à `n`.",
                explication: ["`n = 10` : `i = 0, 2, 4, 6, 8`, soit **5**. `n = 11` : on ajoute `i = 10`, soit **6**. En général `⌈n/2⌉`."]
              },
              {
                type: "lignes", niveau: 3,
                titre: "Exactement n fois",
                enonce: "Pour `n ≥ 1`, cliquez les lignes exécutées **exactement `n` fois**.",
                code: `int somme(int t[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        int x = t[i];
        s = s + x;
    }
    return s;
}`,
                reponse: [4, 5],
                explication: ["Les lignes 4 et 5 forment le corps : `n` fois. L'en-tête de la ligne 3 est testé `n + 1` fois. Les lignes 2 et 7 : une fois."]
              },
              {
                type: "champs", niveau: 4,
                titre: "Le compte exact d'algo4",
                enonce: "Sans se placer au pire cas, combien d'opérations `algo4` fait-il réellement ? (Le `printf` ne s'exécute que pour `i` pair.)",
                code: ALGO4,
                champs: [champ("Pour `n = 6`", 30), champ("Pour `n = 7`", 35)],
                indice: "4 opérations par tour, plus un `printf` pour chaque `i` pair, plus 3.",
                explication: [
                  "`4n + (nombre de i pairs) + 3`. `n = 6` : 24 + 3 + 3 = **30**. `n = 7` : 28 + 4 + 3 = **35**. Le pire cas `5n + 3` (33 et 38) est bien un majorant.",
                  { animation: { code: ALGO4, operations: true, n: { min: 1, max: 8, depart: 6 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ ops: 4 * n + Math.ceil(n / 2) + 3 }) }] } }
                ]
              },
              {
                type: "champs", niveau: 4,
                titre: "Un while qui saute de 3",
                enonce: "Pour `n = 10`, combien de tours fait la boucle, et que renvoie la fonction ?",
                code: `int f(int n) {
    int i = 0;
    while (i < n) {
        i = i + 3;
    }
    return i;
}`,
                champs: [champ("Tours", 4), champ("Valeur renvoyée", 12)],
                indice: "Listez les valeurs de `i` au moment du test.",
                explication: [
                  "Tests : `i = 0, 3, 6, 9` réussissent, `i = 12` échoue. **4** tours, la fonction renvoie **12**.",
                  { animation: { code: `int f(int n) {
    int i = 0;
    while (i < n) {
        i = i + 3;
    }
    return i;
}`, mesure: { ligne: 4, nom: "tours" }, scenarios: [{ nom: "n = 10", entree: { n: 10 }, attendu: { 4: 4, renvoie: 12 } }] } }
                ]
              }
            ]
          },

          /* ---------- Leçon 1.3 ---------- */
          {
            type: "lecon",
            id: "ca-imbriquees",
            titre: "Boucles imbriquées",
            description: "Multiplier quand les bornes sont indépendantes, sommer quand elles dépendent.",
            cours: [
              {
                titre: "Bornes indépendantes : on multiplie",
                texte: [
                  "La boucle interne recommence **entièrement** à chaque tour de l'externe.",
                  "Si sa borne ne dépend pas du compteur externe, la ligne la plus profonde s'exécute **(tours externes) × (tours internes)** fois : `n × m`."
                ],
                schema: grille(4, () => 1, { colonnes: 6, legende: "`n = 4`, `m = 6` : chaque case est un `printf`" }),
                animation: {
                  code: GRILLE,
                  mesure: { ligne: 4, nom: "printf" },
                  n: { min: 1, max: 5, depart: 3 },
                  scenarios: [{ nom: "m = 4", entree: (n) => ({ n, m: 4 }), attendu: (n) => ({ 4: 4 * n }) }]
                }
              },
              {
                titre: "Bornes dépendantes : on additionne",
                texte: [
                  "Avec `j < i`, la boucle interne fait `i` tours : 0, puis 1, puis 2…",
                  "On ne multiplie plus, on **somme** : `0 + 1 + … + (n − 1) = n(n − 1)/2`."
                ],
                schema: grille(6, (i, j) => j < i, { legende: "`algo5` pour `n = 6` : la case `(i, j)` est remplie si `j < i`" }),
                animation: {
                  code: ALGO5,
                  mesure: { ligne: 4, nom: "printf" },
                  n: { min: 0, max: 6, depart: 4 },
                  scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ 4: triangle(n) }) }]
                }
              },
              {
                titre: "Compter toutes les opérations (CM1)",
                texte: [
                  "On analyse d'abord la boucle **la plus profonde**, puis on réinjecte son coût dans un tour de la boucle externe."
                ],
                animation: {
                  code: ALGO5, operations: true,
                  n: { min: 0, max: 6, depart: 3 },
                  scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ ops: 1.5 * n * n + 3.5 * n + 3 }) }]
                },
                demo: {
                  enonce: "Opérations d'`algo5` :",
                  lignes: [
                    ["Boucle sur `j`, `i` fixé : 3 opérations par tour (test, incrément, `printf`), `i` tours, soit `3i`.", "boucle la plus profonde"],
                    ["Plus l'initialisation de `j` (2) et sa dernière comparaison (1) : `3i + 3`.", ""],
                    ["Un tour de la boucle sur `i` : `3i + 3` plus son test et son incrément (2), soit `3i + 5`.", "on remonte d'un niveau"],
                    ["`∑ (i = 0 → n − 1) (3i + 5) = 3 · n(n − 1)/2 + 5n = 3n²/2 + 7n/2`.", "`∑ i = n(n − 1)/2`"],
                    ["Plus l'initialisation de `i` (2) et sa dernière comparaison (1) : `T(n) = 3n²/2 + 7n/2 + 3`.", ""]
                  ]
                }
              },
              {
                titre: "Les sommes à connaître",
                texte: [
                  [
                    "`1 + 2 + … + n = n(n + 1)/2` ;",
                    "`0 + 1 + … + (n − 1) = n(n − 1)/2` ;",
                    "`1² + 2² + … + n² = n(n + 1)(2n + 1)/6`."
                  ],
                  "Vérifiez toujours une formule sur une petite valeur : pour `n = 6`, la grille compte `6 × 7 / 2 = 21` cases."
                ],
                schema: grille(6, (i, j) => j <= i, { debutI: 1, debutJ: 1, legende: "`j ≤ i` pour `i` de 1 à 6 : `1 + 2 + … + 6 = 21`" })
              }
            ],
            problematique: {
              texte: [
                "Pour former des binômes, on compare chaque élève d'une classe de `n` élèves à chacun des autres, **une seule fois** par paire.",
                "Combien de comparaisons pour une classe de 30 ?"
              ],
              schema: grille(5, (i, j) => j > i, { legende: "Une case par paire `i < j` (`n = 5`)" })
            },
            exemple: {
              codeC: PAIRES,
              questions: [
                "Pour `i` fixé, combien de tours fait la boucle sur `j` ?",
                "Combien de comparaisons `t[i] == t[j]` au total ?",
                "Combien pour `n = 30` ?"
              ]
            },
            correction: {
              texte: [
                {
                  demo: [
                    ["Pour `i` fixé, `j` prend les valeurs `i + 1, …, n − 1` : `n − 1 − i` tours.", "boucle interne"],
                    ["`C(n) = ∑ (i = 0 → n − 1) (n − 1 − i) = (n − 1) + (n − 2) + … + 0`.", "on somme les tours"],
                    ["`C(n) = n(n − 1)/2`.", "`0 + 1 + … + (n − 1)`"],
                    ["Vérification `n = 3` : 2 + 1 + 0 = 3 et `3 × 2 / 2 = 3`.", "petite valeur"],
                    ["Pour `n = 30` : `30 × 29 / 2 =` **435** comparaisons.", ""]
                  ]
                },
                {
                  animation: {
                    code: PAIRES, tableau: "t", pointeurs: ["i", "j"],
                    n: { min: 1, max: 6, depart: 4 },
                    mesure: { ligne: 5, nom: "comparaisons" },
                    scenarios: [
                      { nom: "Tous différents", entree: (n) => ({ t: croissant(n), n }), attendu: (n) => ({ 5: triangle(n), renvoie: 0 }) },
                      { nom: "Tous égaux", entree: (n) => ({ t: Array(n).fill(7), n }), attendu: (n) => ({ 5: triangle(n), renvoie: triangle(n) }) }
                    ]
                  }
                }
              ]
            },
            exercices: [
              {
                type: "champs", niveau: 1,
                titre: "Une grille",
                enonce: "Combien de `printf` exécute `grille(4, 7)` ?",
                code: GRILLE,
                champs: [champ("`printf`", 28)],
                indice: "Bornes indépendantes : multipliez.",
                explication: ["7 tours internes pour chacun des 4 tours externes : `4 × 7 =` **28**."]
              },
              {
                type: "champs", niveau: 1,
                titre: "algo5 pour n = 5",
                enonce: "Combien d'appels à `printf` fait `algo5(5)` ?",
                code: ALGO5,
                champs: [champ("`printf`", 10)],
                indice: "La boucle sur `j` fait `i` tours.",
                explication: ["`0 + 1 + 2 + 3 + 4 =` **10**, soit `5 × 4 / 2`."]
              },
              {
                type: "qcm", niveau: 2,
                titre: "La somme des entiers",
                enonce: "`1 + 2 + … + n` vaut :",
                choix: ["`n²`", "`n(n + 1)/2`", "`n(n − 1)/2`", "`2ⁿ − 1`"],
                reponse: 1,
                explication: ["`n(n + 1)/2`. Contrôle : pour `n = 3`, `1 + 2 + 3 = 6 = 3 × 4 / 2`."]
              },
              {
                type: "champs", niveau: 2,
                titre: "j part de i",
                enonce: "Combien de fois `x++;` s'exécute-t-il ?",
                code: `void f(int n) {
    int x = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i; j <= n; j++) {
            x++;
        }
    }
}`,
                champs: [
                  champ("En fonction de `n`", "n(n+1)/2", { accepte: ["(n²+n)/2", "(n^2+n)/2", "n²/2+n/2", "n^2/2+n/2", "(n+1)n/2", "n(1+n)/2"] }),
                  champ("Pour `n = 10`", 55)
                ],
                indice: "Pour `i` fixé, `j` va de `i` à `n` : `n − i + 1` tours.",
                explication: ["`n + (n − 1) + … + 1 = n(n + 1)/2`, soit **55** pour `n = 10`."]
              },
              {
                type: "champs", niveau: 3,
                titre: "Trois boucles",
                enonce: "Combien d'exécutions de la ligne la plus profonde ?",
                code: `// Version A
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        for (int k = 0; k < n; k++)
            x++;

// Version B
for (int i = 0; i < n; i++)
    for (int j = 0; j < i; j++)
        for (int k = 0; k < j; k++)
            x++;`,
                champs: [champ("Version A, `n = 3`", 27), champ("Version B, `n = 5`", 10)],
                indice: "Pour B, comptez les triplets `k < j < i` avec `i < 5`.",
                explication: ["A : `3³ =` **27**. B : un triplet par choix de 3 valeurs distinctes parmi 5, soit `5 × 4 × 3 / 6 =` **10**."]
              },
              {
                type: "champs", niveau: 3,
                titre: "Le compte exact",
                enonce: "Écrivez le nombre total d'opérations sous la forme `T(n) = a·n² + b·n + c`.",
                code: `int g(int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            s = s + j;
        }
    }
    return s;
}`,
                champs: [champ("`a`", 2), champ("`b`", 3), champ("`c`", 6)],
                indice: "Un tour externe de rang `i` coûte `4i + 5`.",
                explication: [
                  {
                    demo: [
                      ["Un tour de `j` : test, incrément, `s = s + j` (2), soit 4 ; donc `4i`.", ""],
                      ["Plus `int j = 0` (2) et la comparaison ratée (1) : `4i + 3`.", ""],
                      ["Plus le test et l'incrément de `i` (2) : `4i + 5` par tour externe.", ""],
                      ["`∑ (i = 0 → n − 1) (4i + 5) = 2n(n − 1) + 5n = 2n² + 3n`.", ""],
                      ["Une fois : l.2 (2), `int i = 0` (2), comparaison ratée (1), `return` (1) : `T(n) = 2n² + 3n + 6`.", ""]
                    ]
                  },
                  { animation: { code: `int g(int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            s = s + j;
        }
    }
    return s;
}`, operations: true, n: { min: 0, max: 6, depart: 3 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ ops: 2 * n * n + 3 * n + 6 }) }] } }
                ]
              },
              {
                type: "champs", niveau: 4,
                titre: "Une borne au carré",
                enonce: "Combien de fois `c++;` s'exécute-t-il ?",
                code: `int f(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i * i; j++) {
            c++;
        }
    }
    return c;
}`,
                champs: [champ("Pour `n = 4`", 14), champ("Pour `n = 6`", 55)],
                indice: "La boucle interne fait `i²` tours.",
                explication: [
                  "`0 + 1 + 4 + 9 =` **14** ; `+ 16 + 25 =` **55**. En général `(n − 1)n(2n − 1)/6`.",
                  { animation: { code: `int f(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i * i; j++) {
            c++;
        }
    }
    return c;
}`, mesure: { ligne: 5, nom: "c++" }, n: { min: 1, max: 6, depart: 4 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ 5: (n - 1) * n * (2 * n - 1) / 6 }) }] } }
                ]
              },
              {
                type: "remettre", niveau: 4,
                titre: "Rédiger le compte d'algo5",
                enonce: "Remettez la rédaction du CM1 dans l'ordre.",
                code: ALGO5,
                etapes: [
                  "Boucle sur `j`, `i` fixé : 3 opérations par tour pendant `i` tours, plus 3 : `3i + 3`.",
                  "Un tour de la boucle sur `i` coûte `3i + 3 + 2 = 3i + 5`.",
                  "`∑ (i = 0 → n − 1) (3i + 5) = 3n(n − 1)/2 + 5n`.",
                  "`= 3n²/2 + 7n/2`.",
                  "On ajoute l'initialisation de `i` et sa dernière comparaison : `T(n) = 3n²/2 + 7n/2 + 3`."
                ],
                explication: ["On part de la boucle la plus profonde, on remonte, on somme, puis on ajoute ce qui ne s'exécute qu'une fois."]
              }
            ]
          },

          /* ---------- Leçon 1.4 ---------- */
          {
            type: "lecon",
            id: "ca-recursif",
            titre: "Fonctions récursives",
            description: "Coût d'un appel × nombre d'appels ; l'arbre des appels.",
            cours: [
              {
                titre: "Un appel, comme un tour de boucle",
                texte: [
                  "Pour une fonction récursive : **(opérations par appel) × (nombre d'appels)**.",
                  "Le **cas de base** est l'appel qui ne se relance pas : il arrête la descente. `somme(4)` fait 5 appels, de `somme(4)` à `somme(0)`."
                ],
                schema: { type: "arbre", racine: 4, enfants: (v) => v > 0 ? [v - 1] : [], etiquette: (v) => "somme(" + v + ")", niveaux: true, legende: "Chaque appel en lance un seul" },
                animation: {
                  code: SOMME_REC,
                  scenarios: [{ nom: "somme(3)", entree: { n: 3 }, attendu: { renvoie: 6, appels: 4 } }]
                }
              },
              {
                titre: "Compter algo6 (CM1)",
                texte: [
                  "Les appels qui passent par le `else` coûtent tous la même chose ; le dernier (cas de base) coûte moins."
                ],
                animation: {
                  code: ALGO6, operations: true,
                  n: { min: 0, max: 6, depart: 3 },
                  scenarios: [{ nom: "sum = 1", entree: (n) => ({ n, sum: 1 }), attendu: (n) => ({ ops: 5 * n + 2, appels: n + 1 }) }]
                },
                demo: {
                  enonce: "Opérations d'`algo6(n, sum)` :",
                  lignes: [
                    ["Un appel qui passe par le `else` : test (1), soustraction (1), multiplication (1), appel (1), `return` (1), soit 5.", "chemin le plus coûteux"],
                    ["Il y a `n` tels appels : `5n`.", "`n`, `n − 1`, …, `1`"],
                    ["Le cas de base `n = 0` : test (1) et `return` (1), soit 2.", ""],
                    ["Total : `5n + 2`.", ""]
                  ]
                }
              },
              {
                titre: "Deux appels : l'arbre double",
                texte: [
                  "Si chaque appel en lance **deux**, le nombre d'appels double à chaque niveau : `1 + 2 + 4 + … + 2ⁿ = 2ⁿ⁺¹ − 1`.",
                  "Une petite différence d'écriture peut rendre un calcul exponentiel."
                ],
                schema: { type: "arbre", racine: 3, enfants: (v) => v > 0 ? [v - 1, v - 1] : [], etiquette: (v) => "h(" + v + ")", niveaux: true, legende: "`return h(n − 1) + h(n − 1);` : 15 appels pour `h(3)`" }
              }
            ],
            problematique: {
              texte: [
                "On calcule `xⁿ` par la relation `xⁿ = x × xⁿ⁻¹`, écrite récursivement.",
                "Combien d'opérations pour `n = 30` ?"
              ]
            },
            exemple: {
              codeC: PUISSANCE,
              questions: [
                "Combien d'opérations coûte un appel qui n'est pas le cas de base ?",
                "Combien d'appels pour `puissance(x, n)` ?",
                "Donnez `T(n)`, puis sa valeur pour `n = 30`."
              ]
            },
            correction: {
              texte: [
                {
                  demo: [
                    ["Appel avec `n ≥ 1` : test (1), `n − 1` (1), appel (1), multiplication (1), `return` (1), soit 5.", ""],
                    ["`puissance(x, n)` appelle `n`, `n − 1`, …, `0` : `n + 1` appels, dont `n` non terminaux.", ""],
                    ["Cas de base : test et `return`, soit 2.", ""],
                    ["`T(n) = 5n + 2`, soit **152** opérations pour `n = 30`.", ""]
                  ]
                },
                {
                  animation: {
                    code: PUISSANCE, operations: true,
                    n: { min: 0, max: 6, depart: 3 },
                    scenarios: [{ nom: "x = 2", entree: (n) => ({ x: 2, n }), attendu: (n) => ({ ops: 5 * n + 2, appels: n + 1, renvoie: 2 ** n }) }]
                  }
                }
              ]
            },
            exercices: [
              {
                type: "champs", niveau: 1,
                titre: "somme(n)",
                enonce: "Écrivez le nombre d'opérations de `somme(n)` sous la forme `a·n + b`.",
                code: SOMME_REC,
                champs: [champ("`a`", 5), champ("`b`", 2)],
                indice: "Appel non terminal : test, soustraction, appel, addition, `return`.",
                explication: [
                  "5 opérations pour chacun des `n` appels non terminaux, 2 pour le cas de base : `5n + 2`.",
                  { animation: { code: SOMME_REC, operations: true, n: { min: 0, max: 5, depart: 3 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ ops: 5 * n + 2 }) }] } }
                ]
              },
              {
                type: "champs", niveau: 1,
                titre: "Nombre d'appels",
                enonce: "Combien d'appels (le premier compris) provoque `puissance(2, 6)` ?",
                code: PUISSANCE,
                champs: [champ("Appels", 7)],
                indice: "De `n = 6` jusqu'à `n = 0`.",
                explication: ["`n = 6, 5, 4, 3, 2, 1, 0` : **7** appels."]
              },
              {
                type: "qcm", niveau: 2,
                titre: "Le cas de base",
                enonce: "Sans cas de base, une fonction récursive :",
                choix: ["s'appelle sans fin (jusqu'au dépassement de pile)", "s'arrête après `n` appels", "devient une boucle", "renvoie 0"],
                reponse: 0,
                explication: ["C'est le cas de base qui arrête la descente : sans lui, les appels s'empilent jusqu'au plantage."]
              },
              {
                type: "champs", niveau: 2,
                titre: "La factorielle",
                enonce: "Combien d'opérations pour `fact(5)` ? Écrivez aussi `T(n) = a·n + b` pour `n ≥ 1`.",
                code: `int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}`,
                champs: [champ("`fact(5)`", 22), champ("`a`", 5), champ("`b`", -3)],
                indice: "Le cas de base est `n = 1`, pas `n = 0` : il n'y a que `n − 1` appels non terminaux.",
                explication: [
                  "`n − 1` appels à 5 opérations, plus le cas de base (2) : `5(n − 1) + 2 = 5n − 3`, soit **22** pour `n = 5`.",
                  { animation: { code: `int fact(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}`, operations: true, n: { min: 1, max: 6, depart: 5 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ ops: 5 * n - 3, appels: n }) }] } }
                ]
              },
              {
                type: "champs", niveau: 3,
                titre: "Deux appels",
                enonce: "Combien d'appels (le premier compris) ?",
                code: `int h(int n) {
    if (n == 0) {
        return 1;
    }
    return h(n - 1) + h(n - 1);
}`,
                champs: [champ("`h(3)`", 15), champ("`h(4)`", 31)],
                indice: "`A(0) = 1` et `A(n) = 1 + 2·A(n − 1)`.",
                explication: [
                  "`A(1) = 3`, `A(2) = 7`, `A(3) =` **15**, `A(4) =` **31** : `A(n) = 2ⁿ⁺¹ − 1`.",
                  { animation: { code: `int h(int n) {
    if (n == 0) {
        return 1;
    }
    return h(n - 1) + h(n - 1);
}`, n: { min: 0, max: 4, depart: 2 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ appels: 2 ** (n + 1) - 1, renvoie: 2 ** n }) }] } }
                ]
              },
              {
                type: "champs", niveau: 3,
                titre: "Un triangle d'étoiles",
                enonce: "Combien d'étoiles `*` affiche `triangle(n)` ?",
                code: `void triangle(int n) {
    if (n == 0) {
        return;
    }
    for (int i = 0; i < n; i++) {
        printf("*");
    }
    printf("\\n");
    triangle(n - 1);
}`,
                champs: [champ("Pour `n = 4`", 10), champ("Pour `n = 10`", 55)],
                indice: "`n` étoiles, puis `n − 1`, … jusqu'à 1.",
                explication: [
                  "`4 + 3 + 2 + 1 =` **10** ; `n(n + 1)/2 =` **55** pour `n = 10`.",
                  { animation: { code: `void triangle(int n) {
    if (n == 0) {
        return;
    }
    for (int i = 0; i < n; i++) {
        printf("*");
    }
    printf("\\n");
    triangle(n - 1);
}`, mesure: { ligne: 6, nom: "étoiles" }, n: { min: 0, max: 5, depart: 4 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ 6: n * (n + 1) / 2 }) }] } }
                ]
              },
              {
                type: "champs", niveau: 4,
                titre: "Fibonacci naïf",
                enonce: "Combien d'appels (le premier compris) ?",
                code: `int fib(int n) {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}`,
                champs: [champ("`fib(5)`", 15), champ("`fib(6)`", 25)],
                indice: "`A(0) = A(1) = 1` et `A(n) = 1 + A(n − 1) + A(n − 2)`.",
                explication: [
                  "`A(2) = 3`, `A(3) = 5`, `A(4) = 9`, `A(5) =` **15**, `A(6) =` **25** : la croissance est exponentielle.",
                  { schema: { type: "arbre", racine: 4, enfants: (v) => v >= 2 ? [v - 1, v - 2] : [], etiquette: (v) => "fib(" + v + ")", niveaux: true, legende: "Les 9 appels de `fib(4)` : `fib(2)` est calculé deux fois" } },
                  { animation: { code: `int fib(int n) {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}`, n: { min: 0, max: 6, depart: 4 }, scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ appels: [1, 1, 3, 5, 9, 15, 25][n] }) }] } }
                ]
              },
              {
                type: "remettre", niveau: 4,
                titre: "Rédiger le compte d'algo6",
                enonce: "Remettez la rédaction dans l'ordre.",
                code: ALGO6,
                etapes: [
                  "Un appel qui passe par le `else` coûte 5 opérations.",
                  "La fonction descend de `n` à 1 : `n` appels de ce type, soit `5n`.",
                  "Le dernier appel, `n = 0`, ne fait que le test et le `return` : 2 opérations.",
                  "Au total, `algo6` effectue `5n + 2` opérations."
                ],
                explication: ["Coût d'un appel, nombre d'appels, cas de base, total."]
              }
            ]
          },

          /* ---------- Leçon 1.5 ---------- */
          {
            type: "lecon",
            id: "ca-cas",
            titre: "Meilleur cas et pire cas",
            description: "À taille égale, le coût dépend du contenu : la complexité désigne le pire cas.",
            cours: [
              {
                titre: "Même taille, coûts différents",
                texte: [
                  "Les deux instances du CM1 ont la même taille (8 cases), mais `searchTab` ne fait pas le même nombre de comparaisons.",
                  "Le `return 1` peut **interrompre** la boucle."
                ],
                animation: {
                  code: SEARCH, tableau: "values", pointeurs: ["i"],
                  mesure: { ligne: 3, nom: "comparaisons" },
                  scenarios: [
                    { nom: "Instance A", texte: "`num` est dans la première case", entree: { values: [64, 33, 5, 90, 37, 12, 109, 78], size: 8, num: 64 }, attendu: { 3: 1 } },
                    { nom: "Instance B", texte: "`num` est dans la dernière case", entree: { values: [56, 23, 91, 21, 345, 9, 18, 101], size: 8, num: 101 }, attendu: { 3: 8 } }
                  ]
                }
              },
              {
                titre: "La complexité désigne le pire cas",
                texte: [
                  "Le **pire cas** est l'entrée de taille `n` qui coûte le plus ; le **meilleur cas**, celle qui coûte le moins.",
                  "Toute exécution coûte entre les deux. Sans précision, « la complexité » est celle du **pire cas** : c'est une garantie."
                ],
                schema: courbes([
                  [(n) => n, "pire cas : n", 2],
                  [() => 1, "meilleur cas : 1", 1]
                ], { xMin: 0, xMax: 10, yMax: 11, zone: { entre: [0, 1] }, nomY: "comparaisons", legende: "Recherche linéaire : toute exécution tombe dans la zone" })
              },
              {
                titre: "Parfois, aucune différence",
                texte: [
                  "Le tri par sélection parcourt toujours toute la partie non triée : le nombre de comparaisons ne dépend **que** de `n`.",
                  "Seules les affectations `indMax = j` varient d'un tableau à l'autre."
                ],
                animation: {
                  code: SELECTION, tableau: "tab", pointeurs: ["indMax", "j"],
                  boucles: { 4: "boucle sur i", 6: "boucle sur j" },
                  n: { min: 2, max: 7, depart: 5 },
                  mesure: [{ ligne: 7, nom: "comparaisons" }, { ligne: 8, nom: "mises à jour de indMax" }],
                  scenarios: [
                    { nom: "Déjà trié", entree: (n) => ({ tab: croissant(n), n }), attendu: (n) => ({ 7: triangle(n) }) },
                    { nom: "Trié à l'envers", entree: (n) => ({ tab: decroissant(n), n }), attendu: (n) => ({ 7: triangle(n) }) },
                    { nom: "Mélangé", entree: (n) => ({ tab: melange(n), n }), attendu: (n) => ({ 7: triangle(n) }) }
                  ]
                }
              }
            ],
            problematique: {
              texte: [
                "Un vérificateur de mot de passe compare la saisie au secret, caractère par caractère, et **s'arrête à la première différence** (CM1).",
                "Combien de comparaisons au mieux, au pire ? Pourquoi est-ce une faille ?"
              ]
            },
            exemple: {
              codeC: VERIFIE,
              questions: [
                "Combien de comparaisons au meilleur cas ? Pour quelle saisie ?",
                "Combien au pire cas ? Pour quelle saisie ?",
                "Que révèle le temps de réponse à un attaquant ?"
              ]
            },
            correction: {
              texte: [
                {
                  demo: [
                    ["Meilleur cas : le premier caractère est faux, `return 0` au premier tour : **1** comparaison.", "sortie immédiate"],
                    ["Pire cas : la saisie est correcte, les `n` tours sont faits : **`n`** comparaisons.", "aucune sortie anticipée"],
                    ["Plus le préfixe juste est long, plus la réponse est lente : le temps révèle combien de caractères sont corrects.", "attaque temporelle"]
                  ]
                },
                {
                  animation: {
                    code: VERIFIE, tableau: ["saisi", "secret"], pointeurs: ["i"],
                    n: { min: 1, max: 8, depart: 6 },
                    mesure: { ligne: 3, nom: "comparaisons" },
                    scenarios: [
                      { nom: "1er caractère faux", entree: (n) => ({ saisi: secret(n).map((v, k) => k === 0 ? v + 1 : v), secret: secret(n), n }), attendu: () => ({ 3: 1, renvoie: 0 }) },
                      { nom: "Dernier faux", entree: (n) => ({ saisi: secret(n).map((v, k) => k === n - 1 ? v + 1 : v), secret: secret(n), n }), attendu: (n) => ({ 3: n, renvoie: 0 }) },
                      { nom: "Saisie correcte", entree: (n) => ({ saisi: secret(n), secret: secret(n), n }), attendu: (n) => ({ 3: n, renvoie: 1 }) }
                    ]
                  }
                }
              ]
            },
            exercices: [
              {
                type: "qcm", niveau: 1,
                titre: "Sans précision",
                enonce: "Sans autre précision, « la complexité d'un algorithme » désigne :",
                choix: ["le meilleur cas", "le pire cas", "le cas moyen", "le temps en secondes"],
                reponse: 1,
                explication: ["Le pire cas : c'est une garantie, valable pour toute entrée de taille `n`."]
              },
              {
                type: "champs", niveau: 1,
                titre: "Les instances du CM1",
                enonce: "Combien de comparaisons `values[i] == num` fait `searchTab` ?",
                code: SEARCH,
                champs: [champ("Instance A (`num` = `values[0]`)", 1), champ("Instance B (`num` = `values[7]`)", 8)],
                explication: ["A : trouvé au premier tour. B : trouvé au huitième et dernier tour."]
              },
              {
                type: "qcm", niveau: 2,
                titre: "Le meilleur cas",
                enonce: "Le meilleur cas de la recherche linéaire est obtenu quand :",
                choix: ["`n = 1`", "la valeur est dans la première case", "la valeur est absente", "le tableau est trié"],
                reponse: 1,
                explication: ["Meilleur et pire cas comparent des entrées de **même taille** `n` : « `n = 1` » n'est pas un meilleur cas."]
              },
              {
                type: "champs", niveau: 2,
                titre: "Mot de passe de 8 caractères",
                enonce: "Avec `verifie` et `n = 8`, combien de comparaisons ?",
                code: VERIFIE,
                champs: [champ("Meilleur cas", 1), champ("Pire cas", 8)],
                explication: ["Au mieux, la première comparaison échoue. Au pire, les 8 sont faites."]
              },
              {
                type: "champs", niveau: 3,
                titre: "Les mises à jour du maximum",
                enonce: "Combien de fois la ligne 5 (`indMax = i`) s'exécute-t-elle pour `size = 10` ?",
                code: MAXTAB,
                champs: [champ("Tableau décroissant", 0), champ("Tableau croissant", 9)],
                indice: "La ligne 5 s'exécute quand on trouve un élément plus grand que le maximum courant.",
                explication: [
                  "Décroissant : `values[0]` reste le maximum, **0** mise à jour. Croissant : chaque élément bat le précédent, **9** mises à jour.",
                  { animation: { code: MAXTAB, tableau: "values", pointeurs: ["indMax", "i"], n: { min: 2, max: 8, depart: 6 }, mesure: { ligne: 5, nom: "mises à jour" }, scenarios: [
                    { nom: "Décroissant", entree: (n) => ({ values: decroissant(n), size: n }), attendu: () => ({ 5: 0 }) },
                    { nom: "Croissant", entree: (n) => ({ values: croissant(n), size: n }), attendu: (n) => ({ 5: n - 1 }) }] } }
                ]
              },
              {
                type: "lignes", niveau: 3,
                titre: "Ce qui dépend du contenu",
                enonce: "Cliquez les lignes dont le nombre d'exécutions dépend du **contenu** du tableau (et pas seulement de `n`).",
                code: `int f(int t[], int n) {
    int c = 0;
    int z = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] > 0) {
            c = c + t[i];
        } else {
            z = z + 1;
        }
    }
    return c - z;
}`,
                reponse: [6, 8],
                explication: ["Sans sortie anticipée, la boucle fait toujours `n` tours et le test l.5 s'exécute `n` fois. Seules les branches l.6 et l.8 se partagent les tours selon les valeurs."]
              },
              {
                type: "qcm", niveau: 4,
                titre: "Zéro mise à jour",
                enonce: "Pour quel tableau le tri par sélection n'exécute-t-il **jamais** la ligne 8 (`indMax = j`) ?",
                code: SELECTION,
                choix: ["`[5, 4, 3, 2, 1]`", "`[1, 2, 3, 4, 5]`", "`[5, 1, 2, 3, 4]`", "`[3, 1, 2, 5, 4]`"],
                reponse: 2,
                explication: [
                  "Il faut que le maximum de la partie non triée soit toujours en case 0. Avec `[5, 1, 2, 3, 4]`, l'échange place 4 en tête, puis 3, etc. Avec `[5, 4, 3, 2, 1]`, après le premier échange le tableau devient `[1, 4, 3, 2, 5]` et 4 n'est plus en tête.",
                  { animation: { code: SELECTION, tableau: "tab", pointeurs: ["indMax", "j"], mesure: { ligne: 8, nom: "mises à jour de indMax" }, scenarios: [
                    { nom: "[5, 1, 2, 3, 4]", entree: { tab: [5, 1, 2, 3, 4], n: 5 }, attendu: { 8: 0 } },
                    { nom: "[5, 4, 3, 2, 1]", entree: { tab: [5, 4, 3, 2, 1], n: 5 }, attendu: { 8: 4 } },
                    { nom: "[1, 2, 3, 4, 5]", entree: { tab: [1, 2, 3, 4, 5], n: 5 }, attendu: { 8: 10 } }] } }
                ]
              },
              {
                type: "champs", niveau: 4,
                titre: "Le maximum de mises à jour",
                enonce: "Pour un tableau déjà trié de taille 6, combien de fois le tri par sélection exécute-t-il `indMax = j` ?",
                code: SELECTION,
                champs: [champ("Mises à jour", 15)],
                indice: "Trié, chaque `tab[j]` est plus grand que tous ceux qui le précèdent.",
                explication: ["Chaque comparaison réussit : autant de mises à jour que de comparaisons, `6 × 5 / 2 =` **15**. C'est le maximum possible."]
              }
            ]
          }
        ]
      }
    ]
  };
})();
