/* =============================================================
   Complexité algorithmique
   -------------------------------------------------------------
   Exercices d'entraînement tirés des trois cours (CM1 comptage
   d'opérations, CM2 notations de Landau, CM3 analyse via Landau).

   Deux familles d'exercices, toutes de type "probleme" (moteur
   assets/js/probleme.js) : un exemple résolu, puis un problème
   similaire à résoudre dans une barre de saisie.
     - Chapitre 1 : comptage d'opérations sur du code C
       (champ "methode" + exemple avec code + exercice avec code) ;
     - Chapitres 2 et 3 : mini-cours "problème → formule → réponse".
   Format complet : voir data/cours/_modele.js.
   ============================================================= */

CONTENU["complexite-algorithmique"] = {
  chapitres: [

    /* ========================================================
       CHAPITRE 1 — Compter les opérations élémentaires (CM1)
       ======================================================== */
    {
      id: "ch1",
      titre: "Chapitre 1 — Compter les opérations élémentaires",
      description: "Dénombrer les opérations d'un code C : séquences, tests, boucles, récursivité.",
      exercices: [

        {
          type: "probleme",
          id: "ch1-sequence",
          titre: "Code séquentiel",
          description: "Compter les opérations d'une fonction sans test ni boucle.",
          methode: [
            "Une **opération élémentaire** est une instruction simple. On compte :",
            [
              "une déclaration",
              "une affectation",
              "une opération arithmétique (`+`, `-`, `*`, `/`, `%`)",
              "un test de comparaison ou une opération logique",
              "un appel de fonction",
              "une instruction `return`"
            ],
            "Sans test ni boucle, on additionne simplement les opérations de chaque ligne."
          ],
          methodeTitre: "Méthode de comptage",
          exemple: {
            langage: "c",
            enonce: "Comptez les opérations élémentaires de `algo1`.",
            code:
`int algo1() {
    int a = 1;
    int b = 2;
    return a + b;
}`,
            formule: [
              [
                "`int a = 1;` → une déclaration et une affectation (2)",
                "`int b = 2;` → une déclaration et une affectation (2)",
                "`return a + b;` → une addition et un `return` (2)"
              ]
            ],
            reponse: "Soit **6** opérations élémentaires au total."
          },
          exercice: {
            langage: "c",
            enonce: "Combien d'opérations élémentaires cette fonction effectue-t-elle ?",
            code:
`int f() {
    int a = 3;
    int b = 4;
    int c = a * b;
    return c - a;
}`,
            placeholder: "Un nombre entier",
            reponse: "9",
            indice: "Une multiplication et une soustraction comptent chacune pour une opération, en plus des déclarations et affectations.",
            solution: [
              [
                "`int a = 3;` → déclaration + affectation (2)",
                "`int b = 4;` → déclaration + affectation (2)",
                "`int c = a * b;` → déclaration + multiplication + affectation (3)",
                "`return c - a;` → soustraction + `return` (2)"
              ],
              "Total : 2 + 2 + 3 + 2 = **9**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch1-conditions",
          titre: "Tests imbriqués (pire cas)",
          description: "Compter au pire cas dans une structure de tests conditionnels.",
          methode: [
            "On compte le nombre **maximum** d'opérations : on suit le chemin qui déclenche le plus d'opérations.",
            "Une structure `if`-`else` ne conduit qu'à **un seul** des deux blocs : on garde le plus coûteux."
          ],
          methodeTitre: "Méthode — pire cas",
          exemple: {
            langage: "c",
            enonce: "Comptez les opérations de `algo2` au pire cas.",
            code:
`void algo2(int a, int b) {
    int c = 4;
    if (a == 1) {
        if (b >= 2) {
            if ((c - b) == 2) {
                printf("...\\n");
            } else {
                printf("...\\n");
            }
        }
    }
}`,
            formule: [
              [
                "`int c = 4;` → déclaration + affectation (2)",
                "`if (a == 1)` → un test (1)",
                "`if (b >= 2)` → un test (1)",
                "`if ((c - b) == 2)` → une soustraction + un test (2)",
                "le `if`-`else` ne compte qu'**un seul** `printf` (1)"
              ]
            ],
            reponse: "Soit **7** opérations élémentaires au maximum."
          },
          exercice: {
            langage: "c",
            enonce: "Combien d'opérations élémentaires au pire cas ?",
            code:
`void g(int a, int b) {
    int c = 5;
    if (a > 0) {
        if (b < c) {
            printf("ok\\n");
        }
    }
}`,
            placeholder: "Un nombre entier",
            reponse: "5",
            indice: "Additionnez : la déclaration-affectation, chaque test, et l'appel à printf du chemin le plus profond.",
            solution: [
              [
                "`int c = 5;` → déclaration + affectation (2)",
                "`if (a > 0)` → un test (1)",
                "`if (b < c)` → un test (1)",
                "`printf(...)` → un appel (1)"
              ],
              "Total au pire cas : 2 + 1 + 1 + 1 = **5**. (Aucune arithmétique dans les conditions ici.)"
            ]
          }
        },

        {
          type: "probleme",
          id: "ch1-boucle",
          titre: "Boucle simple",
          description: "Compter les opérations d'une boucle for en fonction de n.",
          methode: [
            "Pour une boucle : **(opérations par itération) × (nombre d'itérations)**.",
            "Sans oublier, une seule fois :",
            [
              "la déclaration et l'initialisation du compteur",
              "la dernière comparaison qui fait sortir de la boucle"
            ],
            "Une boucle `for (i = 0; i < n; i++)` réalise `n` itérations."
          ],
          methodeTitre: "Méthode — boucle",
          exemple: {
            langage: "c",
            enonce: "Comptez les opérations de `algo4` en fonction de `n`.",
            code:
`void algo4(int n) {
    for (int i = 0; i < n; i++) {
        if (i % 2 == 0) {
            printf("%d est pair.\\n", i);
        }
    }
}`,
            formule: [
              "À chaque itération : `i < n` (test) + `i++` (incrément) = 2, puis `i % 2` (modulo) + `== 0` (test) = 2, puis `printf` (1) au pire cas → **5** par itération, soit `5n`.",
              "On ajoute la déclaration + l'initialisation de `i` (2) et la dernière comparaison (1)."
            ],
            reponse: "Soit **5n + 3** opérations élémentaires."
          },
          exercice: {
            langage: "c",
            enonce: "Combien d'opérations élémentaires en fonction de `n` ?",
            code:
`void h(int n) {
    for (int i = 0; i < n; i++) {
        printf("%d\\n", i);
    }
}`,
            reponse: "3n + 3",
            accepte: ["3n+3", "3*n+3", "3·n+3", "3 + 3n", "3+3n"],
            indice: "Par itération : le test `i < n`, l'incrément `i++`, puis l'appel printf. Ajoutez ensuite l'initialisation et la dernière comparaison.",
            solution: [
              "Par itération : `i < n` (1) + `i++` (1) + `printf` (1) = 3, donc `3n`.",
              "On ajoute la déclaration-initialisation de `i` (2) et la dernière comparaison (1), soit 3.",
              "Total : **3n + 3**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch1-imbriquees",
          titre: "Boucles imbriquées",
          description: "Compter le nombre d'exécutions de la ligne la plus profonde.",
          methode: [
            "Pour des boucles imbriquées, on analyse d'abord la boucle **la plus profonde**.",
            "Quand les bornes sont **indépendantes**, le corps le plus profond s'exécute `(itérations externes) × (itérations internes)` fois."
          ],
          methodeTitre: "Méthode — imbrication",
          exemple: {
            langage: "c",
            enonce: "Combien de fois `printf` s'exécute-t-il ?",
            code:
`void exemple(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("un appel\\n");
        }
    }
}`,
            formule: [
              "La boucle sur `j` fait `n` tours, pour chacun des `n` tours de la boucle sur `i`.",
              "On somme : ∑ (i = 0 → n−1) de `n` = `n × n`."
            ],
            reponse: "`printf` s'exécute **n²** fois."
          },
          exercice: {
            langage: "c",
            enonce: "Combien de fois l'affectation `x = i + j;` s'exécute-t-elle ?",
            code:
`void k(int n, int m) {
    int x = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            x = i + j;
        }
    }
}`,
            reponse: "n·m",
            accepte: ["nm", "n*m", "n×m", "m·n", "mn", "m*n", "m×n"],
            indice: "Les deux bornes sont indépendantes : la boucle sur j fait m tours, répétés n fois.",
            solution: [
              "La boucle interne sur `j` s'exécute `m` fois. Elle est répétée `n` fois par la boucle externe.",
              "L'affectation s'exécute donc **n·m** fois."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch1-recursif",
          titre: "Fonction récursive",
          description: "Compter les opérations d'une récursion linéaire.",
          methode: [
            "Pour une récursion : **(opérations par appel) × (nombre d'appels)**.",
            "On ajoute les opérations du dernier appel (le cas de base : test + `return`)."
          ],
          methodeTitre: "Méthode — récursivité",
          exemple: {
            langage: "c",
            enonce: "Comptez les opérations de `algo6` (appelé avec `n`).",
            code:
`int algo6(int n, int sum) {
    if (n == 0) {
        return sum;
    } else {
        return algo6(n - 1, 3 * sum);
    }
}`,
            formule: [
              "À chaque appel qui va dans le `else` : `n == 0` (test) + `n - 1` (soustraction) + `3 * sum` (multiplication) + l'appel + `return` = **5** opérations, sur `n` appels → `5n`.",
              "On ajoute le dernier appel (cas de base) : test + `return` = 2."
            ],
            reponse: "Soit **5n + 2** opérations élémentaires."
          },
          exercice: {
            langage: "c",
            enonce: "Combien d'opérations élémentaires pour `somme(n)` ?",
            code:
`int somme(int n) {
    if (n == 0) {
        return 0;
    } else {
        return n + somme(n - 1);
    }
}`,
            reponse: "5n + 2",
            accepte: ["5n+2", "5*n+2", "5·n+2", "2 + 5n", "2+5n"],
            indice: "Par appel (chemin else) : le test, la soustraction n-1, l'addition, l'appel récursif et le return. Puis le cas de base.",
            solution: [
              "Par appel dans le `else` : `n == 0` (1) + `n - 1` (1) + `n + ...` (1) + appel (1) + `return` (1) = 5, sur `n` appels → `5n`.",
              "Le cas de base ajoute un test et un `return` (2).",
              "Total : **5n + 2**."
            ]
          }
        }
      ]
    },

    /* ========================================================
       CHAPITRE 2 — Notations de Landau O, Ω, Θ (CM2)
       ======================================================== */
    {
      id: "ch2",
      titre: "Chapitre 2 — Notations de Landau (O, Ω, Θ)",
      description: "Prouver une borne, trouver la constante, simplifier une expression asymptotique.",
      exercices: [

        {
          type: "probleme",
          id: "ch2-preuve-o",
          titre: "Trouver la constante c (O)",
          description: "Majorer chaque terme pour exhiber une constante c.",
          exemple: {
            enonce: "Montrez que `2n² + 5n + 7 = O(n²)` et donnez la constante `c` (avec `n₀ = 1`).",
            formule: "On majore chaque terme par un multiple de `n²`, pour `n ≥ 1` :  `f(n) ≤ c · n²`.",
            reponse: [
              [
                "`7 ≤ 7n²`",
                "`5n ≤ 5n²`",
                "`2n² ≤ 2n²`"
              ],
              "En sommant : `2n² + 5n + 7 ≤ 14n²`. Donc **c = 14** (et `n₀ = 1`)."
            ]
          },
          exercice: {
            enonce: "Pour `3n² + 2n + 1 = O(n²)`, en majorant chaque terme par un multiple de `n²` (pour `n ≥ 1`), quelle constante `c` obtenez-vous ?",
            placeholder: "Un nombre",
            reponse: "6",
            indice: "Majorez : 1 ≤ 1·n², 2n ≤ 2·n², 3n² ≤ 3·n², puis additionnez les coefficients.",
            solution: [
              [
                "`1 ≤ 1n²`",
                "`2n ≤ 2n²`",
                "`3n² ≤ 3n²`"
              ],
              "En sommant : `3n² + 2n + 1 ≤ 6n²`. Donc **c = 6** convient avec `n₀ = 1`."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch2-classe-o",
          titre: "Simplifier un O",
          description: "Ne garder que le terme dominant, sans constante.",
          exemple: {
            enonce: "Simplifiez `O(3n³ + 20n²)`.",
            formule: "On retire les constantes multiplicatives et on ne garde que le terme dominant :  `O(f + g) = O(max(f, g))`.",
            reponse: "`O(3n³ + 20n²) = O(n³)`."
          },
          exercice: {
            enonce: "Simplifiez `O(5n² + 100n + 3)`.",
            reponse: "O(n²)",
            accepte: ["O(n^2)", "o(n²)", "O(n2)"],
            indice: "Le terme dominant est celui de plus grand exposant ; les constantes disparaissent.",
            solution: [
              "`5n² = O(n²)`, `100n = O(n)`, `3 = O(1)`.",
              "La somme se simplifie en `O(max(n², n, 1)) =` **`O(n²)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch2-classe-omega",
          titre: "Simplifier un Ω",
          description: "Borne inférieure : mêmes règles de simplification que O.",
          exemple: {
            enonce: "Simplifiez `Ω(3n³ + 20n²)`.",
            formule: "La notation Ω (borne inférieure) vérifie les mêmes propriétés de calcul que O :  `Ω(f + g) = Ω(max(f, g))`.",
            reponse: "`Ω(3n³ + 20n²) = Ω(n³)`."
          },
          exercice: {
            enonce: "Simplifiez `Ω(4n³ + 13n² + 5)`.",
            reponse: "Ω(n³)",
            accepte: ["Ω(n^3)", "omega(n³)", "omega(n^3)", "Ω(n3)"],
            indice: "Comme pour O, on garde le terme dominant sans sa constante.",
            solution: [
              "`4n³ = Ω(n³)`, `13n² = Ω(n²)`, `5 = Ω(1)`.",
              "La somme se simplifie en `Ω(max(n³, n², 1)) =` **`Ω(n³)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch2-theta",
          titre: "Encadrer avec Θ",
          description: "Θ = borne supérieure ET inférieure du même ordre.",
          exemple: {
            enonce: "Donnez la classe Θ de `10n³ + 5n² + n`.",
            formule: "`f = Θ(g)` signifie `f = O(g)` **et** `f = Ω(g)`. On garde le terme dominant sans constante.",
            reponse: [
              "Borne sup : `10n³ + 5n² + n ≤ 16n³`. Borne inf : `n³ ≤ 10n³ + 5n² + n`.",
              "Donc `10n³ + 5n² + n = Θ(n³)`."
            ]
          },
          exercice: {
            enonce: "Donnez la classe Θ de `7n² + 3n`.",
            reponse: "Θ(n²)",
            accepte: ["Θ(n^2)", "theta(n²)", "theta(n^2)", "Θ(n2)"],
            indice: "Le terme dominant est n² ; il encadre l'expression par le haut et par le bas.",
            solution: [
              "Sup : `7n² + 3n ≤ 10n²`. Inf : `n² ≤ 7n² + 3n` (pour `n ≥ 1`).",
              "L'expression est encadrée par `c₁·n²` et `c₂·n²`, donc **`Θ(n²)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch2-produit",
          titre: "Produit de deux O",
          description: "Multiplier des expressions asymptotiques.",
          exemple: {
            enonce: "Simplifiez `O(n²) × O(4n³ + 13n² + 5)`.",
            formule: "`O(f) × O(g) = O(f × g)`. On simplifie d'abord chaque facteur, puis on multiplie.",
            reponse: [
              "`O(4n³ + 13n² + 5) = O(n³)`.",
              "Donc `O(n²) × O(n³) = ` **`O(n⁵)`**."
            ]
          },
          exercice: {
            enonce: "Simplifiez `O(n³) × O(2n² + 7)`.",
            reponse: "O(n⁵)",
            accepte: ["O(n^5)", "o(n⁵)", "o(n^5)", "O(n5)"],
            indice: "Simplifiez d'abord O(2n² + 7) en O(n²), puis multipliez les exposants.",
            solution: [
              "`O(2n² + 7) = O(n²)`.",
              "`O(n³) × O(n²) = O(n³⁺²) =` **`O(n⁵)`**."
            ]
          }
        }
      ]
    },

    /* ========================================================
       CHAPITRE 3 — Analyse de complexité via Landau (CM3)
       ======================================================== */
    {
      id: "ch3",
      titre: "Chapitre 3 — Analyser un algorithme avec O et Θ",
      description: "Déterminer la classe de complexité directement, ligne par ligne, et simplifier.",
      exercices: [

        {
          type: "probleme",
          id: "ch3-boucle",
          titre: "Une boucle sur un tableau",
          description: "Classe de complexité d'un parcours simple.",
          exemple: {
            langage: "c",
            enonce: "Quelle est la complexité de cette recherche du maximum ?",
            code:
`int maxTab(int t[], int n) {
    int m = t[0];
    for (int i = 1; i < n; i++) {
        if (t[i] > m) {
            m = t[i];
        }
    }
    return m;
}`,
            formule: "Le corps de la boucle `for` s'exécute `Θ(n)` fois ; les lignes hors boucle sont en `Θ(1)`. On somme et on garde le dominant.",
            reponse: "`T(n) = Θ(n)` : le parcours est toujours complet, quel que soit le tableau."
          },
          exercice: {
            langage: "c",
            enonce: "Quelle est la complexité de cette fonction ?",
            code:
`int somme(int t[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + t[i];
    }
    return s;
}`,
            reponse: "Θ(n)",
            accepte: ["theta(n)", "O(n)", "o(n)"],
            indice: "La boucle fait toujours n tours ; le reste est constant.",
            solution: [
              "La boucle `for` s'exécute `Θ(n)` fois, chaque itération en `Θ(1)`. Les lignes hors boucle sont en `Θ(1)`.",
              "Total : `Θ(n) + Θ(1) =` **`Θ(n)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch3-imbriquees",
          titre: "Deux boucles imbriquées",
          description: "Classe de complexité d'une double boucle indépendante.",
          exemple: {
            langage: "c",
            enonce: "Quelle est la complexité de cet affichage ?",
            code:
`void paires(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("%d %d\\n", i, j);
        }
    }
}`,
            formule: "Le corps de la boucle interne s'exécute `n × n` fois : il est en `Θ(n²)`, qui domine tout le reste.",
            reponse: "`T(n) = Θ(n²)`."
          },
          exercice: {
            langage: "c",
            enonce: "Quelle est la complexité de cette fonction ?",
            code:
`int compte(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            c = c + 1;
        }
    }
    return c;
}`,
            reponse: "Θ(n²)",
            accepte: ["Θ(n^2)", "theta(n²)", "theta(n^2)", "O(n²)", "O(n^2)"],
            indice: "Deux boucles imbriquées de n tours chacune : le corps s'exécute n² fois.",
            solution: [
              "La ligne `c = c + 1;` s'exécute `n × n = n²` fois, donc `Θ(n²)`.",
              "Ce terme domine les lignes en `Θ(1)`. Total : **`Θ(n²)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch3-simplif",
          titre: "Simplifier une somme de classes",
          description: "Combiner des Θ et des O de classes différentes.",
          exemple: {
            enonce: "Simplifiez `T(n) = Θ(n) + O(n²) + Θ(log n) + O(1)`.",
            formule: "On regroupe par nature : `Θ(nᵏ) + Θ(nˡ) = Θ(n^max)` et `O(nᵏ) + O(nˡ) = O(n^max)`. Un Θ et un O de classes différentes ne fusionnent pas.",
            reponse: [
              "`Θ(n) + Θ(log n) = Θ(n)` et `O(n²) + O(1) = O(n²)`.",
              "Résultat : `T(n) = Θ(n) + O(n²)` (ou, au pire cas seul, `O(n²)`)."
            ]
          },
          exercice: {
            enonce: "En ne gardant que le pire cas, simplifiez `T(n) = Θ(n) + O(n²)`.",
            reponse: "O(n²)",
            accepte: ["O(n^2)", "o(n²)", "O(n2)"],
            indice: "Θ(nˡ) + O(nᵏ) avec l < k se réduit, au pire cas, au terme O dominant.",
            solution: [
              "`Θ(n) + O(n²)` : on ne peut pas fusionner en un seul Θ (classes différentes).",
              "En ne gardant que le pire cas : **`O(n²)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch3-recherche",
          titre: "Recherche linéaire : meilleur et pire cas",
          description: "Distinguer la complexité selon la structure de l'instance.",
          exemple: {
            langage: "c",
            enonce: "Analysez cette recherche linéaire.",
            code:
`int recherche(int t[], int n, int v) {
    for (int i = 0; i < n; i++) {
        if (t[i] == v) {
            return i;
        }
    }
    return -1;
}`,
            formule: "La boucle est en `Θ(n)`, mais le `return` interne peut l'interrompre : on fait une **disjonction de cas**.",
            reponse: [
              "Meilleur cas (valeur en tête) : `T(n) = Θ(1)`.",
              "Pire cas (valeur absente) : `T(n) = Θ(n)`."
            ]
          },
          exercice: {
            langage: "c",
            enonce: "Dans cette recherche, quelle est la complexité au **pire cas** (valeur absente) ?",
            code:
`int present(int t[], int n, int v) {
    for (int i = 0; i < n; i++) {
        if (t[i] == v) {
            return 1;
        }
    }
    return 0;
}`,
            reponse: "Θ(n)",
            accepte: ["theta(n)", "O(n)", "o(n)"],
            indice: "Au pire cas, la boucle parcourt tout le tableau sans jamais entrer dans le if.",
            solution: [
              "Si `v` est absente, aucun `return` interne : la boucle fait `n` tours complets.",
              "Complexité au pire cas : **`Θ(n)`**. (Au meilleur cas, `Θ(1)`.)"
            ]
          }
        },

        {
          type: "probleme",
          id: "ch3-tris",
          titre: "Tri par sélection vs tri par insertion",
          description: "Reconnaître la complexité de deux tris classiques.",
          exemple: {
            enonce: "Quelle est la complexité du **tri par sélection** ?",
            formule: "Sa double boucle de recherche du maximum est parcourue entièrement quel que soit le tableau : les deux boucles font toujours le même nombre de tours.",
            reponse: "`T(n) = Θ(n²)`, au meilleur comme au pire cas."
          },
          exercice: {
            enonce: "Le **tri par insertion** ne rentre pas dans sa boucle `while` quand le tableau est déjà trié. Quelle est sa complexité au **meilleur cas** ?",
            reponse: "Θ(n)",
            accepte: ["theta(n)", "O(n)", "o(n)"],
            indice: "Sans jamais entrer dans le while, il ne reste que la boucle for externe.",
            solution: [
              "Tableau déjà trié : la boucle `while` interne n'est jamais exécutée.",
              "Il ne reste que la boucle `for` externe, en **`Θ(n)`**. (Au pire cas, le while est quadratique : `Θ(n²)`.)"
            ]
          }
        }
      ]
    }

  ]
};
