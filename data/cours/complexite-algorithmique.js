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
            { titre: "Le vocabulaire" },
            "Une **opération élémentaire** est une action que le processeur exécute en un temps fixe, indépendant de la taille des données. C'est l'unité de mesure du comptage, à la place des secondes qui changent d'une machine à l'autre.",
            "Chacune de ces écritures compte pour **une** opération :",
            [
              "une déclaration (`int a;`) ou une affectation (le `=` de `a = 3`)",
              "une opération arithmétique — `+`, `-`, `*`, `/`, `%`",
              "un test ou une opération logique — `==`, `<`, `&&`",
              "un appel de fonction, une instruction `return`"
            ],
            "Une même ligne peut donc en contenir plusieurs : `int c = a * b;` en vaut 3.",
            { titre: "La méthode" },
            "Sans test ni boucle, chaque ligne s'exécute une fois : on compte ligne par ligne, puis on additionne."
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
            { titre: "Le vocabulaire" },
            "Le **pire cas** est la situation qui déclenche le plus d'opérations. On l'étudie parce qu'il donne une **garantie** : l'algorithme ne coûtera jamais plus, quelles que soient les valeurs reçues.",
            { titre: "La méthode" },
            [
              "compter d'abord ce qui s'exécute dans tous les cas",
              "à chaque `if`, supposer que le test réussit : entrer dans le bloc coûte plus cher",
              "à chaque `if`-`else`, ne garder qu'**un seul** bloc, le plus coûteux : ils ne s'exécutent jamais tous les deux"
            ],
            "Le test lui-même compte toujours, même quand il échoue : il faut l'évaluer pour savoir qu'on n'entre pas."
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
            { titre: "Le vocabulaire" },
            "Une **itération** est un tour de boucle. Le résultat n'est plus un nombre mais une **expression en `n`**, du type `5n + 3`.",
            { titre: "La méthode" },
            "Coût = **(opérations par itération) × (nombre d'itérations)**, plus ce qui ne se fait qu'une fois.",
            "Dans `for (int i = 0; i < n; i++)`, les trois parties ne se comptent pas de la même façon :",
            [
              "`int i = 0` : une seule fois avant d'entrer, soit 2",
              "`i < n` : avant chaque tour, donc `n` fois… plus la dernière, celle qui échoue et fait sortir",
              "`i++` : à la fin de chaque tour, donc `n` fois"
            ],
            "C'est cette comparaison ratée qui explique le `+ 1` qu'on oublie souvent."
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
            { titre: "Le vocabulaire" },
            "Deux boucles sont **imbriquées** quand l'une est écrite dans le corps de l'autre : l'interne recommence entièrement à chaque tour de l'externe.",
            "Les bornes sont **indépendantes** quand celle de l'interne ne fait pas intervenir le compteur de l'externe : `j < m` l'est, `j < i` non.",
            { titre: "La méthode" },
            "Avec des bornes indépendantes, les nombres de tours se **multiplient** : la ligne la plus profonde s'exécute **(tours externes) × (tours internes)** fois.",
            "Une multiplication et non une addition, car l'interne se déroule en entier **à l'intérieur de chacun** des tours de l'externe."
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
            { titre: "Le vocabulaire" },
            "Une fonction est **récursive** quand elle s'appelle elle-même sur un problème plus petit. Le **cas de base** est l'appel qui ne se relance pas (ici `n == 0`) : c'est lui qui arrête la descente.",
            { titre: "La méthode" },
            "La même que pour une boucle, « tour » devenant « appel » : **(opérations par appel) × (nombre d'appels)**.",
            [
              "compter les opérations d'un appel qui **relance** la récursion, le chemin `else` : test, calculs, appel, `return`",
              "compter ces appels : `somme(n)` descend jusqu'à `somme(0)`, soit `n` appels",
              "ajouter le cas de base, qui ne fait qu'un test et un `return`"
            ],
            "L'appel récursif compte pour une opération, au même titre qu'un `printf`."
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
          methode: [
            { titre: "Le vocabulaire" },
            "**Majorer** une expression, c'est la remplacer par une autre qui lui est toujours supérieure ou égale : `5n ≤ 5n²`. On perd en précision, on gagne une borne sûre. L'opération inverse s'appelle **minorer**.",
            "`f(n) = O(g(n))` veut dire : à partir d'un certain point, `f` ne dépasse jamais `g` multiplié par une constante. Soit `f(n) ≤ c · g(n)` pour tout `n ≥ n₀`.",
            [
              "`c` : la **constante multiplicative**, le facteur qu'on s'autorise devant `g(n)`",
              "`n₀`, qui se lit « n zéro » : la **taille d'entrée à partir de laquelle** l'inégalité doit être vraie ; en dessous, on ne vérifie rien"
            ],
            "Ignorer les petites entrées est volontaire : sur quelques éléments, un algorithme lent peut battre un algorithme rapide. Exemple où ce départ compte : `n² ≤ 2ⁿ` est faux pour `n = 3` (9 > 8) mais vrai dès `n = 4`, d'où `n₀ = 4`. Sur les polynômes qui suivent, `n₀ = 1` convient toujours.",
            { titre: "La méthode, terme par terme" },
            "Avec `n₀ = 1`, on dispose de `1 ≤ n ≤ n² ≤ n³ ≤ …` : chaque terme peut monter jusqu'au terme dominant.",
            [
              "une constante : `7 = 7 × 1 ≤ 7n²`",
              "un terme de degré inférieur : `5n ≤ 5n²`",
              "le terme dominant : inchangé"
            ],
            "Ces inégalités vont dans le même sens, donc elles s'additionnent : la somme des coefficients donne `c`. Un `c` plus grand reste correct."
          ],
          methodeTitre: "Méthode — prouver une borne O",
          exemple: {
            enonce: "Montrez que `2n² + 5n + 7 = O(n²)` et donnez la constante `c` (avec `n₀ = 1`).",
            formuleTitre: "Démarche",
            formule: [
              "But : trouver un `c` tel que `2n² + 5n + 7 ≤ c · n²` pour tout `n ≥ 1`. Comme `1 ≤ n ≤ n²`, chaque terme monte jusqu'à un multiple de `n²` :",
              [
                "`7 ≤ 7n²`",
                "`5n ≤ 5n²`",
                "`2n² ≤ 2n²`"
              ],
              "Les trois inégalités sont de même sens : on les additionne."
            ],
            reponse: [
              "`2n² + 5n + 7 ≤ (2 + 5 + 7) n² = 14n²`, vrai pour tout `n ≥ 1`.",
              "Donc **c = 14**, avec `n₀ = 1`. Vérification sur `n = 3` : `f(3) = 40` et `14 × 3² = 126`."
            ]
          },
          exercice: {
            enonce: "Pour `3n² + 2n + 1 = O(n²)`, en majorant chaque terme par un multiple de `n²` (pour `n ≥ 1`), quelle constante `c` obtenez-vous ?",
            reponse: "6",
            indice: "Faites monter chaque terme jusqu'à un multiple de n² : 1 devient 1n², 2n devient 2n², 3n² ne bouge pas. c est la somme des coefficients.",
            solution: [
              "Pour `n ≥ 1` : `1 ≤ 1n²`, `2n ≤ 2n²`, `3n² ≤ 3n²`.",
              "En additionnant : `3n² + 2n + 1 ≤ (3 + 2 + 1) n² = 6n²`.",
              "Donc **c = 6**, avec `n₀ = 1`. N'importe quel `c ≥ 6` conviendrait aussi."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch2-classe-o",
          titre: "Simplifier un O",
          description: "Ne garder que le terme dominant, sans constante.",
          methode: [
            { titre: "Le vocabulaire" },
            "Le **terme dominant** d'une somme est celui qui grandit le plus vite quand `n` devient grand : entre `3n³` et `20n²`, c'est `3n³`. Ce sont les exposants qui décident, jamais les coefficients.",
            "Une **constante multiplicative** est le nombre écrit devant le terme — le `3` de `3n³`. Un `O` l'absorbe.",
            { titre: "La méthode" },
            [
              "repérer le terme de plus grand exposant",
              "effacer son coefficient",
              "jeter tous les autres termes"
            ],
            "La règle qui l'autorise est `O(f + g) = O(max(f, g))` : le terme dominant finit toujours par écraser les autres.",
            "Échelle des croissances, de la plus lente à la plus rapide : `1 < log n < n < n log n < n² < n³ < 2ⁿ`."
          ],
          methodeTitre: "Méthode — simplifier un O",
          exemple: {
            enonce: "Simplifiez `O(3n³ + 20n²)`.",
            formuleTitre: "Démarche",
            formule: [
              "On compare les exposants : `3 > 2`, donc `n³` l'emporte, quels que soient les coefficients.",
              "On applique `O(f + g) = O(max(f, g))`, puis on efface la constante `3`."
            ],
            reponse: [
              "`O(3n³ + 20n²) = O(3n³) =` **`O(n³)`**.",
              "Le coefficient 20 ne compense pas l'exposant : dès `n = 7`, `3n³` vaut 1029 contre 980 pour `20n²`."
            ]
          },
          exercice: {
            enonce: "Simplifiez `O(5n² + 100n + 3)`.",
            reponse: "O(n²)",
            accepte: ["O(n^2)", "o(n²)", "O(n2)"],
            indice: "Classez les trois termes par exposant : le dominant est celui de plus grand exposant. Les autres termes et les coefficients disparaissent.",
            solution: [
              "Les exposants : `5n²` (2), `100n` (1), `3` (0). Le dominant est `5n²`.",
              "Pour `n = 1000`, `5n²` vaut 5 000 000 contre 100 000 pour `100n` : les autres termes ne pèsent rien.",
              "On garde `n²` sans son coefficient : **`O(n²)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch2-classe-omega",
          titre: "Simplifier un Ω",
          description: "Borne inférieure : mêmes règles de simplification que O.",
          methode: [
            { titre: "Le vocabulaire" },
            "**Minorer**, c'est remplacer une expression par une autre qui lui est toujours inférieure ou égale : `3n³ + 20n² ≥ 3n³`. C'est l'inverse de **majorer**.",
            "`f(n) = Ω(g(n))` est la **borne inférieure** : `f(n) ≥ c · g(n)` à partir d'un rang `n₀`. Là où `O` promet « pas plus que », `Ω` promet « au moins autant que ».",
            { titre: "La méthode" },
            "Identique à celle du `O` : garder le terme dominant, sans son coefficient.",
            "Mais pour la raison inverse : jeter les termes plus petits fait **diminuer** la somme, ce qui est permis pour un minorant — alors que pour un `O` on les faisait monter."
          ],
          methodeTitre: "Méthode — prouver une borne Ω",
          exemple: {
            enonce: "Simplifiez `Ω(3n³ + 20n²)`.",
            formuleTitre: "Démarche",
            formule: [
              "Cette fois on cherche un **plancher**. Tous les termes sont positifs, donc en jeter un ne peut que faire baisser le total : `3n³ + 20n² ≥ 3n³`.",
              "Il reste à effacer le coefficient, comme pour un `O`."
            ],
            reponse: [
              "`3n³ + 20n² ≥ 3n³ ≥ 1 · n³`, donc **`Ω(n³)`**.",
              "Même terme dominant que pour le `O`, obtenu en jetant des termes au lieu de les faire monter."
            ]
          },
          exercice: {
            enonce: "Simplifiez `Ω(4n³ + 13n² + 5)`.",
            reponse: "Ω(n³)",
            accepte: ["Ω(n^3)", "omega(n³)", "omega(n^3)", "Ω(n3)"],
            indice: "Comme pour O, on garde le terme dominant sans sa constante. Ici on y arrive en jetant les termes plus petits.",
            solution: [
              "Les trois termes sont positifs : `4n³ + 13n² + 5 ≥ 4n³ ≥ 1 · n³`.",
              "L'inégalité `f(n) ≥ c · n³` est vérifiée avec `c = 1` et `n₀ = 1`, d'où **`Ω(n³)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch2-theta",
          titre: "Encadrer avec Θ",
          description: "Θ = borne supérieure ET inférieure du même ordre.",
          methode: [
            { titre: "Le vocabulaire" },
            "**Encadrer**, c'est coincer une expression entre un minorant et un majorant de même forme : `c₁ · g(n) ≤ f(n) ≤ c₂ · g(n)`, à partir d'un rang `n₀`. Il y a donc trois nombres à fournir.",
            "`f = Θ(g)` signifie `f = O(g)` **et** `f = Ω(g)` : `f` croît exactement comme `g`, à un facteur constant près. `O(n²)` autorise aussi `n` ou une constante ; `Θ(n²)` ne les autorise pas.",
            { titre: "La méthode, par les deux bouts" },
            [
              "**majorer** pour obtenir `c₂` : faire monter chaque terme jusqu'au terme dominant",
              "**minorer** pour obtenir `c₁` : jeter tous les termes sauf le dominant",
              "conclure si les deux bornes portent sur le même `g(n)`"
            ],
            "Pour un polynôme, la réponse est toujours le terme de plus haut degré sans son coefficient : l'encadrement ne fait que le justifier."
          ],
          methodeTitre: "Méthode — encadrer avec Θ",
          exemple: {
            enonce: "Donnez la classe Θ de `10n³ + 5n² + n`.",
            formuleTitre: "Démarche",
            formule: [
              "Le terme dominant est `n³` : on l'encadre par les deux bouts, pour `n ≥ 1`.",
              "**Majorant** : `5n² ≤ 5n³` et `n ≤ n³`, donc la somme est `≤ (10 + 5 + 1) n³ = 16n³`.",
              "**Minorant** : tous les termes sont positifs, donc la somme est `≥ 10n³ ≥ n³`."
            ],
            reponse: [
              "`1 · n³ ≤ 10n³ + 5n² + n ≤ 16 · n³` pour tout `n ≥ 1`, avec `c₁ = 1`, `c₂ = 16` et `n₀ = 1`.",
              "Les deux bornes portent sur `n³`, donc **`Θ(n³)`**."
            ]
          },
          exercice: {
            enonce: "Donnez la classe Θ de `7n² + 3n`.",
            reponse: "Θ(n²)",
            accepte: ["Θ(n^2)", "theta(n²)", "theta(n^2)", "Θ(n2)"],
            indice: "Le terme dominant est n². Majorez en faisant monter 3n jusqu'à un multiple de n², puis minorez en jetant ce même 3n.",
            solution: [
              "**Majorant**, pour `n ≥ 1` : `3n ≤ 3n²`, donc `7n² + 3n ≤ 10n²`.",
              "**Minorant** : les deux termes sont positifs, donc `7n² + 3n ≥ 7n² ≥ n²`.",
              "Encadré par `1 · n²` et `10 · n²` : **`Θ(n²)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch2-produit",
          titre: "Produit de deux O",
          description: "Multiplier des expressions asymptotiques.",
          methode: [
            { titre: "La règle" },
            "`O(f) × O(g) = O(f × g)` : si `f₁ ≤ c₁ · f` et `f₂ ≤ c₂ · g`, alors `f₁ × f₂ ≤ (c₁ × c₂) × (f × g)`, et `c₁ × c₂` est encore une constante.",
            "Ce cas arrive dès qu'on imbrique : une boucle en `O(n)` qui lance à chaque tour un traitement en `O(n²)` coûte `O(n³)`.",
            { titre: "La méthode" },
            [
              "simplifier chaque facteur séparément",
              "multiplier, en **additionnant** les exposants : `nᵃ × nᵇ = nᵃ⁺ᵇ`"
            ],
            "Piège classique : `n² × n³ = n⁵`, pas `n⁶`."
          ],
          methodeTitre: "Méthode — multiplier des O",
          exemple: {
            enonce: "Simplifiez `O(n²) × O(4n³ + 13n² + 5)`.",
            formuleTitre: "Démarche",
            formule: [
              "On réduit chaque facteur avant de multiplier : développer donnerait six termes à trier, pour le même résultat.",
              "`O(n²)` est déjà réduit ; dans `4n³ + 13n² + 5`, le terme dominant est `4n³`, donc ce facteur vaut `O(n³)`."
            ],
            reponse: [
              "`O(n²) × O(n³) = O(n² × n³)`, et les exposants s'additionnent : `n²⁺³ = n⁵`.",
              "Résultat : **`O(n⁵)`**."
            ]
          },
          exercice: {
            enonce: "Simplifiez `O(n³) × O(2n² + 7)`.",
            reponse: "O(n⁵)",
            accepte: ["O(n^5)", "o(n⁵)", "o(n^5)", "O(n5)"],
            indice: "Réduisez d'abord chaque facteur, puis multipliez en additionnant les exposants.",
            solution: [
              "`O(2n² + 7) = O(n²)` ; le premier facteur `O(n³)` est déjà réduit.",
              "`O(n³) × O(n²) = O(n³⁺²)` = **`O(n⁵)`**."
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
          methode: [
            { titre: "Le vocabulaire" },
            "`T(n)` est le **temps d'exécution** pour une entrée de taille `n` — ici, le nombre d'éléments du tableau.",
            "Une instruction dont le coût ne dépend pas de `n` s'exécute en **temps constant**, noté `Θ(1)`.",
            "Différence avec le chapitre 1 : on ne compte plus les opérations une à une pour obtenir `5n + 3`, on donne directement la **classe** `Θ(n)`.",
            { titre: "La méthode, ligne par ligne" },
            [
              "hors boucle, une ligne coûte `Θ(1)`",
              "une boucle coûte (nombre de tours) × (coût d'un tour)",
              "additionner, puis ne garder que le terme dominant"
            ],
            "Un `if` dans une boucle ne change rien tant que ses deux branches sont en `Θ(1)` : le tour reste de coût constant."
          ],
          methodeTitre: "Méthode — analyser ligne par ligne",
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
            formuleTitre: "Démarche",
            formule: [
              "On donne sa classe à chaque ligne avant d'additionner :",
              {
                entetes: ["Ligne", "Combien de fois", "Coût"],
                lignes: [
                  ["`int m = t[0];`", "1 fois", "`Θ(1)`"],
                  ["`for (int i = 1; i < n; i++)`", "`n − 1` tours", "`Θ(1)` par tour"],
                  ["`if (t[i] > m) { m = t[i]; }`", "à chaque tour", "`Θ(1)` par tour"],
                  ["`return m;`", "1 fois", "`Θ(1)`"]
                ]
              },
              "La boucle coûte donc `Θ(n)`. Le `−1` de `n − 1` disparaît : `Θ` ignore cette différence."
            ],
            reponse: [
              "`T(n) = Θ(1) + Θ(n) + Θ(1) = ` **`Θ(n)`**.",
              "Le `if` ne crée pas de disjonction de cas : vrai ou faux, le tour coûte un nombre constant d'opérations et la boucle va au bout. Meilleur et pire cas sont identiques."
            ]
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
            indice: "Donnez sa classe à chaque ligne : celles hors boucle sont en Θ(1), la boucle fait toujours n tours avec un corps de coût constant.",
            solution: [
              "Les lignes hors boucle sont en `Θ(1)`. La boucle fait `n` tours et son corps, `s = s + t[i];`, coûte `Θ(1)`.",
              "Total : `Θ(1) + n × Θ(1) + Θ(1) = ` **`Θ(n)`**.",
              "Aucun `return` n'interrompt le parcours : même classe au meilleur et au pire cas."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch3-imbriquees",
          titre: "Deux boucles imbriquées",
          description: "Classe de complexité d'une double boucle indépendante.",
          methode: [
            { titre: "La règle" },
            "Deux boucles **imbriquées** multiplient leurs nombres de tours : l'interne se déroule entièrement dans **chaque** tour de l'externe.",
            "Quand les bornes sont **indépendantes**, la ligne la plus profonde s'exécute (tours externes) × (tours internes) fois.",
            { titre: "La méthode" },
            [
              "compter les tours de la boucle la plus profonde, puis ceux de chaque boucle qui l'englobe",
              "multiplier le tout par le coût du corps, et garder le terme dominant"
            ],
            "Deux boucles de `n` tours donnent `n²` : c'est la complexité **quadratique**. Doubler `n` multiplie alors le temps par 4."
          ],
          methodeTitre: "Méthode — boucles imbriquées",
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
            formuleTitre: "Démarche",
            formule: [
              "La boucle sur `j` fait `n` tours et recommence à chaque tour de celle sur `i`, qui en fait `n` aussi.",
              "Les bornes sont indépendantes (`j < n` ne dépend pas de `i`) : le `printf` s'exécute `n × n = n²` fois, à coût constant."
            ],
            reponse: [
              "`T(n) = n² × Θ(1) = ` **`Θ(n²)`**.",
              "Pour `n = 1000`, cela fait un million d'affichages : c'est le saut de coût entre une boucle simple et une double boucle."
            ]
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
            indice: "Les deux boucles font n tours chacune et leurs bornes sont indépendantes : comptez combien de fois la ligne la plus profonde s'exécute.",
            solution: [
              "La boucle interne fait `n` tours, relancée `n` fois par l'externe : `c = c + 1;` s'exécute `n²` fois, à coût constant.",
              "`int c = 0;` et `return c;` sont en `Θ(1)`, négligeables devant `n²`. Total : **`Θ(n²)`**."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch3-simplif",
          titre: "Simplifier une somme de classes",
          description: "Combiner des Θ et des O de classes différentes.",
          methode: [
            { titre: "Le vocabulaire" },
            "Un `Θ` est une classe **exacte** : la fonction est encadrée des deux côtés. Un `O` n'est qu'un **plafond** : `O(n²)` est vrai pour une fonction en `n²`, mais aussi en `n`, ou même constante.",
            "C'est pourquoi un `Θ` et un `O` de classes différentes ne fusionnent pas : l'un affirme une vitesse, l'autre pose une limite.",
            { titre: "La méthode" },
            [
              "regrouper les `Θ` entre eux : `Θ(f) + Θ(g) = Θ(max(f, g))`",
              "regrouper les `O` entre eux : `O(f) + O(g) = O(max(f, g))`",
              "laisser côte à côte ce qui ne peut pas fusionner"
            ],
            "Pour le **pire cas** seul, un `Θ(g)` se relâche en `O(g)` — une classe exacte est aussi un plafond. Tout devient alors des `O`, et on garde le plus grand."
          ],
          methodeTitre: "Méthode — combiner des classes",
          exemple: {
            enonce: "Simplifiez `T(n) = Θ(n) + O(n²) + Θ(log n) + O(1)`.",
            formuleTitre: "Démarche",
            formule: [
              "On sépare par nature, car seuls les termes de même nature se regroupent :",
              [
                "les `Θ` : `Θ(n) + Θ(log n) = Θ(n)`, puisque `n` croît plus vite que `log n`",
                "les `O` : `O(n²) + O(1) = O(n²)`"
              ]
            ],
            reponse: [
              "`T(n) = Θ(n) + O(n²)` : on s'arrête là si l'on veut rester exact.",
              "Si seule la garantie du pire cas compte, `Θ(n)` se relâche en `O(n)` et tout se regroupe : **`O(n²)`**."
            ]
          },
          exercice: {
            enonce: "En ne gardant que le pire cas, simplifiez `T(n) = Θ(n) + O(n²)`.",
            reponse: "O(n²)",
            accepte: ["O(n^2)", "o(n²)", "O(n2)"],
            indice: "Un Θ peut toujours se relâcher en O. Une fois les deux termes de même nature, gardez le plus grand.",
            solution: [
              "Les deux termes ne sont pas de même nature : pas de fusion possible en un seul `Θ`.",
              "Au pire cas, `Θ(n)` se relâche en `O(n)` : il reste `O(n) + O(n²)` = **`O(n²)`**.",
              "La partie en `n` ne pèse rien face à une partie qui peut coûter `n²`."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch3-recherche",
          titre: "Recherche linéaire : meilleur et pire cas",
          description: "Distinguer la complexité selon la structure de l'instance.",
          methode: [
            { titre: "Le vocabulaire" },
            "Le **pire cas** est l'entrée de taille `n` qui coûte le plus cher, le **meilleur cas** celle qui coûte le moins. Ce sont deux entrées différentes de même taille, pas deux valeurs de `n`.",
            "Faire une **disjonction de cas**, c'est les traiter séparément parce qu'ils ne donnent pas la même complexité.",
            { titre: "Quand la faire ?" },
            "Dès qu'une instruction peut **interrompre** un parcours : un `return` au milieu d'une boucle, un `break`, une sortie anticipée.",
            [
              "meilleur cas : la sortie a lieu au premier tour → `Θ(1)`",
              "pire cas : elle n'a jamais lieu, la boucle va au bout → `Θ(n)`"
            ],
            "Sans précision, « la complexité » désigne le **pire cas** : c'est la seule qui donne une garantie."
          ],
          methodeTitre: "Méthode — meilleur cas et pire cas",
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
            formuleTitre: "Démarche",
            formule: [
              "La boucle est écrite pour faire `n` tours, mais le `return i;` peut en sortir avant : le nombre de tours dépend du contenu du tableau.",
              "On cherche donc les deux entrées extrêmes, à taille `n` fixée : `v` en première position, et `v` absente."
            ],
            reponse: [
              "**Meilleur cas** — `v` est en `t[0]` : un tour, un test, un `return`. `T(n) = Θ(1)`.",
              "**Pire cas** — `v` est absente : les `n` tours sont faits. `T(n) = Θ(n)`.",
              "Sans précision, on retient la garantie : la recherche linéaire est en `O(n)`."
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
            indice: "Si la valeur est absente, le test du if échoue à chaque tour : demandez-vous combien de tours la boucle fait alors.",
            solution: [
              "`v` absente : le test échoue à chaque tour, le `return 1;` n'est jamais atteint.",
              "La boucle fait donc ses `n` tours, chacun à coût constant : **`Θ(n)`**.",
              "Au meilleur cas — `v` en première position — un seul tour suffit : `Θ(1)`."
            ]
          }
        },

        {
          type: "probleme",
          id: "ch3-tris",
          titre: "Tri par sélection vs tri par insertion",
          description: "Reconnaître la complexité de deux tris classiques.",
          methode: [
            { titre: "Ce que font les deux tris" },
            "Le **tri par sélection** cherche à chaque étape le plus grand élément de la partie non triée : il doit la parcourir entièrement, on ne peut pas savoir plus tôt qu'on tient le maximum.",
            "Le **tri par insertion** insère chaque élément à sa place dans la partie déjà triée, en le décalant vers la gauche : sa boucle `while` s'arrête **dès** que la place est trouvée.",
            { titre: "D'où vient l'écart" },
            "Une boucle qui peut s'arrêter tôt crée un écart entre meilleur et pire cas ; une boucle qui va toujours au bout n'en crée aucun.",
            {
              entetes: ["Tri", "Meilleur cas", "Pire cas"],
              lignes: [
                ["Sélection", "`Θ(n²)`", "`Θ(n²)`"],
                ["Insertion", "`Θ(n)` — déjà trié", "`Θ(n²)` — trié à l'envers"]
              ]
            }
          ],
          methodeTitre: "Méthode — reconnaître deux tris",
          exemple: {
            enonce: "Quelle est la complexité du **tri par sélection** ?",
            formuleTitre: "Démarche",
            formule: [
              "Sa structure est une double boucle : pour chacune des `n` positions à remplir, on parcourt la partie non triée pour y chercher le maximum.",
              "Aucune des deux ne peut s'interrompre, même sur un tableau déjà trié. Le nombre de comparaisons ne dépend donc que de la taille : `(n−1) + (n−2) + … + 1 = n(n−1)/2`."
            ],
            reponse: [
              "`n(n−1)/2 = (n² − n)/2` : le terme dominant est `n²`, donc **`Θ(n²)`**.",
              "Le nombre de tours ne dépendant pas du contenu, c'est la même classe au meilleur comme au pire cas."
            ]
          },
          exercice: {
            enonce: "Le **tri par insertion** ne rentre pas dans sa boucle `while` quand le tableau est déjà trié. Quelle est sa complexité au **meilleur cas** ?",
            reponse: "Θ(n)",
            accepte: ["theta(n)", "O(n)", "o(n)"],
            indice: "Si le while ne tourne jamais, il ne reste que la boucle for externe et son unique comparaison par tour.",
            solution: [
              "Tableau déjà trié : la condition du `while` est fausse dès le premier test, la boucle interne ne tourne jamais.",
              "Il ne reste que la boucle `for` externe, `n − 1` tours à coût constant : **`Θ(n)`**.",
              "Au pire cas — trié à l'envers — chaque élément traverse toute la partie triée et le tri repasse en `Θ(n²)`."
            ]
          }
        }
      ]
    }

  ]
};
