/* =============================================================
   Complexité algorithmique
   -------------------------------------------------------------
   Exercices d'entraînement tirés des trois cours (CM1 comptage
   d'opérations, CM2 notations de Landau, CM3 analyse via Landau),
   puis un chapitre 4 de synthèse plus difficile. Un guide donne
   les modèles de rédaction des démonstrations.

   Deux familles d'exercices, toutes de type "probleme" (moteur
   assets/js/probleme.js) : un exemple résolu, puis un problème
   similaire à résoudre dans une barre de saisie.
     - Chapitre 1 : comptage d'opérations sur du code C
       (champ "methode" + exemple avec code + exercice avec code) ;
     - Chapitres 2 et 3 : mini-cours "problème → formule → réponse" ;
     - Chapitre 4 : synthèse, une rédaction modèle en exemple et
       plusieurs problèmes par exercice (champ "exercices").
   Format complet : voir data/cours/_modele.js.
   ============================================================= */

CONTENU["complexite-algorithmique"] = {

  /* =========================================================
     GUIDE — modèles de rédaction des démonstrations
     ========================================================= */
  guides: [
    {
      id: "rediger",
      titre: "Rédiger une démonstration de complexité",
      resume: "Les squelettes de rédaction à recopier en copie, du `O` d'un polynôme à la relation de récurrence.",
      niveau: "Tous niveaux",
      sections: [
        {
          type: "partie",
          titre: "Les règles communes",
          texte: "Ce qui distingue une copie à tous les points d'une copie à moitié juste."
        },
        {
          type: "notion",
          titre: "Les cinq réflexes",
          points: [
            "**Annoncer le but** avec les quantificateurs : « Il s'agit de trouver `c > 0` et `n₀` tels que, pour tout `n ≥ n₀`, … »",
            "**Fixer `n`** avant de manipuler des inégalités : « Soit `n ≥ 1`. »",
            "**Justifier chaque inégalité** par un fait élémentaire : `1 ≤ n`, `−5n ≤ 0`, `log₂ n ≥ 1` pour `n ≥ 2`.",
            "**Nommer les constantes** trouvées : `c = 14`, `n₀ = 1`, jamais « une certaine constante ».",
            "**Conclure en citant la définition** : « Par définition, `f(n) = O(n²)`. »"
          ],
          attention: [
            "Écrire `f(n) ≤ O(n²)` ou additionner des symboles `Θ` dans une somme de `n` termes : on manipule des **fonctions** et des **constantes nommées**, les symboles n'apparaissent qu'à la conclusion.",
            "Vérifier sur un seul `n` ne prouve rien : la borne doit tenir **pour tout** `n ≥ n₀`."
          ]
        },

        {
          type: "partie",
          titre: "Notations de Landau",
          texte: "Prouver ou réfuter une borne sur une fonction donnée."
        },
        {
          titre: "Prouver f(n) = O(g(n))",
          texte: "Exemple : `f(n) = 2n² + 5n + 7`.",
          points: [
            "Il s'agit de trouver `c > 0` et `n₀` tels que `2n² + 5n + 7 ≤ c · n²` pour tout `n ≥ n₀`.",
            "Soit `n ≥ 1`. Alors `1 ≤ n²` et `n ≤ n²`, donc `7 ≤ 7n²` et `5n ≤ 5n²`.",
            "En additionnant : `2n² + 5n + 7 ≤ 14n²`.",
            "Ainsi, pour tout `n ≥ 1`, `f(n) ≤ 14 · n²`. Avec `c = 14` et `n₀ = 1`, par définition `f(n) = O(n²)`."
          ]
        },
        {
          titre: "Prouver f(n) = Ω(g(n)) avec un terme négatif",
          texte: "Exemple : `f(n) = 3n² − 5n`.",
          points: [
            "Il s'agit de trouver `c > 0` et `n₀` tels que `3n² − 5n ≥ c · n²` pour tout `n ≥ n₀`.",
            "Soit `n ≥ 3`. Alors `2n ≥ 6 > 5`, donc `2n² ≥ 5n`, c'est-à-dire `3n² − 5n ≥ n²`.",
            "Avec `c = 1` et `n₀ = 3`, par définition `f(n) = Ω(n²)`."
          ],
          remarque: "Pour trouver `n₀`, résolvez d'abord l'inégalité au brouillon (`2n² ≥ 5n ⟺ n ≥ 2,5`), puis rédigez dans le sens direct à partir de `n ≥ 3`."
        },
        {
          titre: "Prouver f(n) = Θ(g(n))",
          points: [
            "Paragraphe **Majoration** : comme pour `O`, on obtient `c₂` et un rang `n₁`.",
            "Paragraphe **Minoration** : comme pour `Ω`, on obtient `c₁` et un rang `n₂`.",
            "Conclusion : « Pour tout `n ≥ n₀ = max(n₁, n₂)`, `c₁ · g(n) ≤ f(n) ≤ c₂ · g(n)`. Par définition, `f(n) = Θ(g(n))`. »"
          ],
          attention: "Le `n₀` final est le **maximum** des deux rangs : les deux inégalités doivent être vraies en même temps."
        },
        {
          titre: "Prouver f(n) ≠ O(g(n)), par l'absurde",
          texte: "Exemple : `n² ≠ O(n)`.",
          points: [
            "Supposons par l'absurde qu'il existe `c > 0` et `n₀ ≥ 1` tels que `n² ≤ c · n` pour tout `n ≥ n₀`.",
            "En divisant par `n > 0` : `n ≤ c` pour tout `n ≥ n₀`.",
            "Posons `n = max(n₀, ⌊c⌋ + 1)`. Alors `n ≥ n₀`, donc `n ≤ c` ; mais `n ≥ ⌊c⌋ + 1 > c`.",
            "Contradiction. Donc `n² ≠ O(n)`."
          ],
          remarque: "Le `n` qui contredit l'hypothèse doit être **donné explicitement**, en fonction de `c` et `n₀` : « pour `n` assez grand » ne suffit pas."
        },

        {
          type: "partie",
          titre: "Analyse d'algorithmes",
          texte: "Passer d'un code à sa classe de complexité."
        },
        {
          titre: "Boucles : ligne par ligne",
          points: [
            "« Notons `T(n)` le nombre d'opérations élémentaires effectuées par `f` sur une entrée de taille `n`. »",
            "Donner le coût de chaque ligne et le nombre de fois où elle s'exécute, idéalement dans un tableau.",
            "Pour une boucle dépendante : « Pour `i` fixé, la boucle sur `j` fait exactement `n − i` tours. » puis poser la somme avec ses bornes.",
            "Calculer, garder le terme dominant : « donc `T(n) = n(n + 1)/2 = Θ(n²)`. »"
          ]
        },
        {
          titre: "Encadrer sans somme exacte",
          points: [
            "**Majoration** : « Chaque boucle fait au plus `n` tours, donc `T(n) ≤ n²`. »",
            "**Minoration** : « Pour les `i ≤ n/2`, au nombre d'au moins `n/2`, la boucle interne fait au moins `n/2` tours. Donc `T(n) ≥ n²/4`. »",
            "« Donc `T(n) = O(n²)` et `T(n) = Ω(n²)`, soit `T(n) = Θ(n²)`. »"
          ]
        },
        {
          titre: "Meilleur et pire cas",
          points: [
            "**Borne supérieure**, valable pour toute entrée : « Quelle que soit l'entrée, la boucle fait au plus `n` tours à coût constant, donc `T(n) = O(n)`. »",
            "**Instance du pire cas**, décrite pour tout `n` : « Si `v` n'apparaît pas dans `t`, le test échoue à chaque tour et les `n` tours sont effectués : `Θ(n)`. »",
            "**Instance du meilleur cas** : « Si `t[0] = v`, la fonction retourne au premier tour : `Θ(1)`. »"
          ],
          attention: "Le meilleur et le pire cas portent sur des **entrées de même taille `n`**. « Le meilleur cas est `n = 1` » est faux."
        },
        {
          titre: "Fonction récursive",
          points: [
            "« Notons `T(n)` le coût de `f(n)`. Il existe des constantes `a, b > 0` telles que `T(0) = a` et `T(n) = T(n − 1) + b·n + a` pour `n ≥ 1`. »",
            "« En déroulant : `T(n) = T(0) + b·(1 + 2 + … + n) + n·a = a + b·n(n + 1)/2 + n·a`. »",
            "« Le terme dominant est `(b/2) n²`, donc `T(n) = Θ(n²)`. »"
          ],
          remarque: "Nommer les constantes `a` et `b` rend le déroulement calculable ; un `Θ(1)` répété `n` fois n'est pas une somme qu'on sait écrire rigoureusement."
        },
        {
          type: "notion",
          titre: "Formulaire à citer",
          tableau: {
            entetes: ["Formule", "Usage"],
            lignes: [
              ["`1 + 2 + … + n = n(n + 1)/2`", "boucle `j < i` ou `j ≥ i`"],
              ["`1² + 2² + … + n² = n(n + 1)(2n + 1)/6`", "boucle `j < i * i`"],
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
    },

    /* ========================================================
       CHAPITRE 4 — Synthèse : exercices avancés (CM1 à CM3)
       Chaque exemple donne une rédaction modèle complète ;
       plusieurs problèmes par exercice, plus durs que ceux des
       chapitres 1 à 3.
       ======================================================== */
    {
      id: "ch4",
      titre: "Chapitre 4 — Synthèse : exercices avancés",
      description: "Tout le programme en plus difficile, avec des rédactions modèles de démonstration.",
      exercices: [

        {
          type: "probleme",
          id: "ch4-comptage-dependant",
          titre: "Comptage exact, bornes dépendantes",
          description: "Compter toutes les opérations quand la boucle interne dépend de l'externe.",
          methode: [
            { titre: "Ce qui change" },
            "Quand la borne interne dépend du compteur externe (`j < i`), le nombre de tours de l'interne **change à chaque tour** de l'externe : on ne multiplie plus, on **somme**.",
            [
              "écrire le coût d'**un** tour externe en fonction de `i`",
              "sommer ce coût pour `i` allant de la première à la dernière valeur",
              "ajouter ce qui ne s'exécute qu'une fois : initialisations, dernière comparaison ratée, `return`"
            ],
            "Sommes à connaître par cœur :",
            [
              "`0 + 1 + … + (n − 1) = n(n − 1)/2`",
              "`1 + 2 + … + n = n(n + 1)/2`",
              "`1² + 2² + … + n² = n(n + 1)(2n + 1)/6`"
            ],
            { titre: "Rédiger" },
            "Annoncer la variable (« Notons `C(n)` le nombre d'opérations »), détailler le coût d'un tour en fonction de `i`, poser la somme avec ses bornes, calculer, puis **vérifier la formule sur une petite valeur** de `n`."
          ],
          methodeTitre: "Méthode — sommer au lieu de multiplier",
          exemple: {
            langage: "c",
            enonce: "Combien de fois l'affectation `x = x + 1;` s'exécute-t-elle, en fonction de `n` ?",
            code:
`void triangle(int n) {
    int x = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            x = x + 1;
        }
    }
}`,
            formuleTitre: "Rédaction modèle",
            formule: [
              "Notons `A(n)` le nombre d'exécutions de `x = x + 1;`.",
              "Pour une valeur fixée de `i`, la boucle sur `j` prend les valeurs `0, 1, …, i − 1` : elle fait exactement `i` tours, et l'affectation s'exécute `i` fois.",
              "La boucle sur `i` prend les valeurs `0, 1, …, n − 1`. Donc :",
              [
                "`A(n) = ∑ (i = 0 → n − 1) i = 0 + 1 + … + (n − 1) = n(n − 1)/2`"
              ],
              "Vérification pour `n = 3` : les tours internes valent 0, 1 puis 2, soit 3 exécutions ; la formule donne `3 × 2 / 2 = 3`."
            ],
            reponse: [
              "`A(n) =` **`n(n − 1)/2`**, soit `(n² − n)/2`.",
              "Le terme dominant est `n²/2` : c'est `Θ(n²)`, deux fois moins que la double boucle complète, mais la même classe."
            ]
          },
          exercices: [
            {
              langage: "c",
              enonce: "Combien de fois `x++;` s'exécute-t-il, en fonction de `n` ?",
              code:
`void f(int n) {
    int x = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i; j <= n; j++) {
            x++;
        }
    }
}`,
              reponse: "n(n+1)/2",
              accepte: ["(n²+n)/2", "(n^2+n)/2", "n²/2+n/2", "n^2/2+n/2", "(n+1)n/2", "n(1+n)/2"],
              indice: "Pour un i fixé, j va de i à n : comptez ces valeurs (n − i + 1). Sommez ensuite pour i de 1 à n : vous obtenez n + (n − 1) + … + 1.",
              solution: [
                "Pour `i` fixé, `j` prend les valeurs `i, i + 1, …, n` : c'est `n − i + 1` tours.",
                "`∑ (i = 1 → n) (n − i + 1) = n + (n − 1) + … + 1 = n(n + 1)/2`.",
                "Vérification pour `n = 2` : 2 tours puis 1, soit 3 ; la formule donne `2 × 3 / 2 = 3`. Réponse : **`n(n + 1)/2`**."
              ]
            },
            {
              langage: "c",
              enonce: "Combien d'**opérations élémentaires** au total (règles du chapitre 1), en fonction de `n` ? Donnez un polynôme développé.",
              code:
`int g(int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            s = s + j;
        }
    }
    return s;
}`,
              reponse: "2n² + 3n + 6",
              accepte: ["2n^2+3n+6", "2*n^2+3*n+6", "6+3n+2n²", "6+3n+2n^2", "2n²+6+3n"],
              indice: "Un tour externe de rang i coûte : le test i < n et i++ (2), l'initialisation de j (2), i + 1 tests j < i, i incréments j++, et 2 opérations par exécution de s = s + j. Sommez pour i de 0 à n − 1, puis ajoutez le reste.",
              solution: [
                "Hors boucles : `int s = 0;` (2), `int i = 0` (2), la dernière comparaison `i < n` (1), `return s;` (1). Soit **6**.",
                "Un tour externe de rang `i` coûte :",
                [
                  "`i < n` et `i++` : 2",
                  "`int j = 0` : 2",
                  "`j < i` : `i + 1` fois (dont la comparaison ratée)",
                  "`j++` : `i` fois",
                  "`s = s + j;` : 2 opérations, `i` fois, soit `2i`"
                ],
                "Soit `4i + 5` par tour externe. `∑ (i = 0 → n − 1) (4i + 5) = 4 × n(n − 1)/2 + 5n = 2n² + 3n`.",
                "Total : **`2n² + 3n + 6`**. Vérification pour `n = 1` : on trouve 11 opérations à la main, et `2 + 3 + 6 = 11`."
              ]
            },
            {
              langage: "c",
              enonce: "Combien de fois la ligne `t[j + 1] = t[j];` s'exécute-t-elle au **pire cas** (tableau trié à l'envers), en fonction de `n` ?",
              code:
`void insertion(int t[], int n) {
    for (int i = 1; i < n; i++) {
        int x = t[i];
        int j = i - 1;
        while (j >= 0 && t[j] > x) {
            t[j + 1] = t[j];
            j = j - 1;
        }
        t[j + 1] = x;
    }
}`,
              reponse: "n(n-1)/2",
              accepte: ["n(n−1)/2", "(n²-n)/2", "(n^2-n)/2", "n²/2-n/2", "n^2/2-n/2", "(n-1)n/2"],
              indice: "Trié à l'envers, t[i] est plus petit que tous les éléments déjà triés : il doit tous les décaler. Combien sont-ils au tour i ?",
              solution: [
                "Au tour `i`, la partie triée contient `t[0..i−1]`, soit `i` éléments, tous plus grands que `x` : le `while` s'arrête seulement quand `j` passe à `−1`, après `i` décalages.",
                "`∑ (i = 1 → n − 1) i = 1 + 2 + … + (n − 1) = n(n − 1)/2`.",
                "Réponse : **`n(n − 1)/2`**, d'où le `Θ(n²)` du tri par insertion au pire cas. Pour `n = 6`, cela fait 15 décalages."
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "ch4-termes-negatifs",
          titre: "Bornes avec termes négatifs",
          description: "Trouver c₁, c₂ et n₀ quand un terme négatif empêche la méthode directe.",
          methode: [
            { titre: "Ce qui change" },
            "Un terme **négatif** se traite à l'inverse d'un terme positif :",
            [
              "pour **majorer**, on le jette : `−5n ≤ 0`, donc la somme ne peut que baisser sans lui",
              "pour **minorer**, on ne peut plus le jeter : il faut l'**absorber** dans le terme dominant, ce qui impose un `n₀` plus grand que 1"
            ],
            "Absorber `−5n` dans `3n²` avec `c₁ = 1` : on veut `3n² − 5n ≥ n²`, soit `2n² ≥ 5n`, soit `n ≥ 5/2`. D'où `n₀ = 3`.",
            { titre: "Rédiger" },
            "Toute preuve de borne se termine par une phrase qui **nomme les constantes** et **cite la définition** : « Pour tout `n ≥ n₀ = 3`, on a `c₁ · n² ≤ f(n) ≤ c₂ · n²` avec `c₁ = 1` et `c₂ = 7`. Par définition, `f(n) = Θ(n²)`. »"
          ],
          methodeTitre: "Méthode — termes négatifs",
          exemple: {
            enonce: "Montrez que `f(n) = 3n² − 5n + 4 = Θ(n²)`.",
            formuleTitre: "Rédaction modèle",
            formule: [
              "Il s'agit de trouver `c₁ > 0`, `c₂ > 0` et `n₀` tels que `c₁ · n² ≤ f(n) ≤ c₂ · n²` pour tout `n ≥ n₀`.",
              "**Majoration.** Soit `n ≥ 1`. On a `−5n ≤ 0` et `4 ≤ 4n²`, donc `f(n) ≤ 3n² + 4n² = 7n²`.",
              "**Minoration.** Soit `n ≥ 3`. Alors `2n ≥ 6 ≥ 5`, donc `2n² ≥ 5n`, c'est-à-dire `3n² − 5n ≥ n²`. Comme `4 ≥ 0`, on obtient `f(n) ≥ n²`.",
              "**Conclusion.** Pour tout `n ≥ 3`, `1 · n² ≤ f(n) ≤ 7 · n²`."
            ],
            reponse: [
              "Avec `c₁ = 1`, `c₂ = 7` et `n₀ = 3`, par définition : **`f(n) = Θ(n²)`**.",
              "Le `n₀` est le plus grand des deux rangs utilisés (1 pour la majoration, 3 pour la minoration) : les deux inégalités doivent tenir **en même temps**."
            ]
          },
          exercices: [
            {
              enonce: "Pour `f(n) = 4n² − 6n + 9`, en jetant le terme négatif puis en majorant la constante (avec `n₀ = 1`), quelle constante `c₂` obtenez-vous dans `f(n) ≤ c₂ · n²` ?",
              reponse: "13",
              indice: "−6n ≤ 0 disparaît, et 9 ≤ 9n² pour n ≥ 1.",
              solution: [
                "Soit `n ≥ 1`. On a `−6n ≤ 0` et `9 ≤ 9n²`.",
                "Donc `f(n) ≤ 4n² + 9n² = 13n²` : **`c₂ = 13`**."
              ]
            },
            {
              enonce: "Pour `g(n) = 4n² − 6n`, on veut `g(n) ≥ 2n²`. Quel est le plus petit `n₀` à partir duquel c'est vrai ?",
              reponse: "3",
              indice: "4n² − 6n ≥ 2n² équivaut à 2n² ≥ 6n. Divisez par 2n (n > 0).",
              solution: [
                "`4n² − 6n ≥ 2n²` ⟺ `2n² ≥ 6n` ⟺ `n ≥ 3` (en divisant par `2n > 0`).",
                "Contrôle : `g(2) = 4` et `2 × 2² = 8`, faux ; `g(3) = 18` et `2 × 3² = 18`, vrai. Réponse : **`n₀ = 3`**."
              ]
            },
            {
              enonce: "Montrez que `2ⁿ⁺³ = O(2ⁿ)`. Quelle est la plus petite constante `c` qui convient ?",
              reponse: "8",
              indice: "Décomposez la puissance : 2ⁿ⁺³ = 2³ × 2ⁿ.",
              solution: [
                "Pour tout `n ≥ 0`, `2ⁿ⁺³ = 2³ × 2ⁿ = 8 × 2ⁿ`.",
                "L'inégalité `2ⁿ⁺³ ≤ c · 2ⁿ` est donc vraie avec **`c = 8`** et `n₀ = 0`, et fausse pour tout `c < 8`.",
                "Attention : ajouter une constante à l'**exposant** ne change pas la classe, mais la **multiplier** si : `4ⁿ = 2²ⁿ` n'est pas en `O(2ⁿ)`."
              ]
            },
            {
              enonce: "Montrez que `n log₂ n + 5n = O(n log₂ n)` avec `n₀ = 2`. Quelle constante `c` obtenez-vous en majorant terme par terme ?",
              reponse: "6",
              indice: "Pour n ≥ 2, log₂ n ≥ 1 : donc n ≤ n log₂ n.",
              solution: [
                "Soit `n ≥ 2`. Alors `log₂ n ≥ 1`, donc `5n ≤ 5n log₂ n`.",
                "`n log₂ n + 5n ≤ n log₂ n + 5n log₂ n = 6 n log₂ n` : **`c = 6`**, avec `n₀ = 2`.",
                "Pourquoi pas `n₀ = 1` : `log₂ 1 = 0`, le membre de droite vaut 0 et l'inégalité `5 ≤ 0` est fausse."
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "ch4-absurde",
          titre: "Prouver qu'une borne est fausse",
          description: "Raisonnement par l'absurde : f n'est pas en O(g).",
          methode: [
            { titre: "Le principe" },
            "Montrer `f(n) ≠ O(g(n))`, c'est montrer qu'**aucune** constante ne marche : quels que soient `c` et `n₀`, il existe un `n ≥ n₀` avec `f(n) > c · g(n)`.",
            "On ne peut pas essayer tous les `c` : on raisonne **par l'absurde**.",
            [
              "supposer qu'il existe `c > 0` et `n₀` tels que `f(n) ≤ c · g(n)` pour tout `n ≥ n₀`",
              "simplifier l'inégalité jusqu'à isoler `n` : on obtient `n ≤ (quelque chose de constant)`",
              "choisir un `n` précis, au-delà de `n₀` **et** de cette constante, qui la viole",
              "conclure : contradiction, donc l'hypothèse est fausse"
            ],
            "Le `n` choisi doit être **explicite** : `n = max(n₀, ⌊c⌋ + 1)` est la formule type."
          ],
          methodeTitre: "Méthode — preuve par l'absurde",
          exemple: {
            enonce: "Montrez que `n² ≠ O(n)`.",
            formuleTitre: "Rédaction modèle",
            formule: [
              "Supposons par l'absurde que `n² = O(n)`. Il existe alors `c > 0` et `n₀ ≥ 1` tels que, pour tout `n ≥ n₀`, `n² ≤ c · n`.",
              "Pour `n ≥ 1`, on peut diviser par `n > 0` : l'hypothèse devient `n ≤ c` pour tout `n ≥ n₀`.",
              "Posons `n = max(n₀, ⌊c⌋ + 1)`. On a bien `n ≥ n₀`, donc `n ≤ c` d'après l'hypothèse. Mais `n ≥ ⌊c⌋ + 1 > c`.",
              "Contradiction : `n ≤ c` et `n > c`."
            ],
            reponse: [
              "L'hypothèse est fausse : **`n² ≠ O(n)`**.",
              "Même schéma pour tout `nᵃ ≠ O(nᵇ)` avec `a > b` : après division, on obtient `nᵃ⁻ᵇ ≤ c`, impossible car `nᵃ⁻ᵇ` tend vers l'infini."
            ]
          },
          exercices: [
            {
              enonce: "Un camarade prétend que `n² ≤ 100n` pour tout `n ≥ 10`. Quel est le plus petit `n ≥ 10` qui le contredit ?",
              reponse: "101",
              indice: "Divisez par n : l'inégalité devient n ≤ 100. Le premier entier qui la viole ?",
              solution: [
                "Pour `n > 0`, `n² ≤ 100n` ⟺ `n ≤ 100`.",
                "Le premier entier qui la viole est **`n = 101`** : `101² = 10 201 > 10 100 = 100 × 101`.",
                "C'est exactement le `⌊c⌋ + 1` de la rédaction modèle, avec `c = 100`."
              ]
            },
            {
              enonce: "Pour montrer que `4ⁿ ≠ O(2ⁿ)`, on suppose `4ⁿ ≤ 8 · 2ⁿ` pour tout `n ≥ 0`. Quel est le plus petit `n` qui contredit cette hypothèse ?",
              reponse: "4",
              indice: "4ⁿ = 2ⁿ × 2ⁿ. Divisez les deux membres par 2ⁿ.",
              solution: [
                "`4ⁿ = (2²)ⁿ = 2ⁿ × 2ⁿ`. En divisant par `2ⁿ > 0` : l'hypothèse devient `2ⁿ ≤ 8`, soit `n ≤ 3`.",
                "Le premier entier qui la viole est **`n = 4`** : `4⁴ = 256 > 128 = 8 × 2⁴`.",
                "Quel que soit `c`, `2ⁿ ≤ c` finit par être faux : `4ⁿ ≠ O(2ⁿ)`. Doubler l'exposant change la classe, contrairement à `2ⁿ⁺³`."
              ]
            },
            {
              enonce: "Et dans l'autre sens : `log₂(n²) = O(log₂ n)`. Quelle constante `c` convient exactement ?",
              reponse: "2",
              indice: "Propriété du logarithme : log(aᵇ) = b · log(a).",
              solution: [
                "Pour tout `n ≥ 1`, `log₂(n²) = 2 log₂ n` : l'inégalité `log₂(n²) ≤ c · log₂ n` est vraie avec **`c = 2`**.",
                "Avant de lancer une preuve par l'absurde, vérifiez que la borne est bien fausse : un logarithme absorbe les puissances, contrairement à une exponentielle."
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "ch4-logarithmes",
          titre: "Boucles logarithmiques",
          description: "Compteur qui double ou qui divise : Θ(log n), Θ(n log n), Θ(√n).",
          methode: [
            { titre: "Ce qui change" },
            "Quand le compteur **se multiplie** (`i = i * 2`) ou **se divise** (`i = i / 2`) au lieu d'avancer de 1, le nombre de tours n'est plus `n` mais le nombre de doublements pour aller de 1 à `n` : environ `log₂ n`.",
            [
              "exprimer le compteur après `t` tours : `i = 2ᵗ`",
              "écrire la condition de continuation : `2ᵗ < n`",
              "résoudre en `t` : `t < log₂ n`, donc `⌈log₂ n⌉` tours"
            ],
            "La **base** du logarithme ne compte pas en `Θ` : `log₃ n = log₂ n / log₂ 3`, un simple facteur constant.",
            "Même raisonnement pour `i * i < n` : la boucle s'arrête quand `i` atteint `√n`."
          ],
          methodeTitre: "Méthode — compteur multiplicatif",
          exemple: {
            langage: "c",
            enonce: "Combien de tours fait cette boucle, et quelle est sa complexité ?",
            code:
`int nbDoublements(int n) {
    int k = 0;
    for (int i = 1; i < n; i = i * 2) {
        k = k + 1;
    }
    return k;
}`,
            formuleTitre: "Rédaction modèle",
            formule: [
              "Notons `t` le nombre de tours déjà effectués. Montrons par récurrence qu'au début du tour suivant, `i = 2ᵗ` :",
              [
                "initialisation : avant le premier tour, `t = 0` et `i = 1 = 2⁰`",
                "hérédité : si `i = 2ᵗ`, le tour multiplie `i` par 2, donc `i = 2ᵗ⁺¹` après `t + 1` tours"
              ],
              "La boucle continue tant que `2ᵗ < n`, c'est-à-dire tant que `t < log₂ n`. Le nombre de tours est donc le plus petit `t` tel que `2ᵗ ≥ n`, soit `⌈log₂ n⌉`.",
              "Chaque tour coûte `Θ(1)`, et les lignes hors boucle aussi."
            ],
            reponse: [
              "`T(n) = ⌈log₂ n⌉ × Θ(1) + Θ(1) =` **`Θ(log n)`**.",
              "Pour `n = 1 000 000`, cela fait 20 tours, contre un million pour une boucle `i++`."
            ]
          },
          exercices: [
            {
              langage: "c",
              enonce: "Combien de tours fait la boucle de `nbDoublements` (exemple) pour `n = 1000` ?",
              reponse: "10",
              indice: "Listez les valeurs de i : 1, 2, 4, 8… et arrêtez-vous à la dernière strictement inférieure à 1000.",
              solution: [
                "`i` prend les valeurs `1, 2, 4, …, 512`, soit `2⁰` à `2⁹` : **10** tours. À `i = 1024`, le test `i < 1000` échoue.",
                "C'est bien `⌈log₂ 1000⌉ = 10`, puisque `2⁹ = 512 < 1000 ≤ 1024 = 2¹⁰`."
              ]
            },
            {
              langage: "c",
              enonce: "Quelle est la complexité de cette fonction ?",
              code:
`int tiers(int n) {
    int c = 0;
    for (int i = n; i > 1; i = i / 3) {
        c = c + 1;
    }
    return c;
}`,
              reponse: "Θ(log n)",
              accepte: ["theta(log n)", "Θ(log(n))", "Θ(log3 n)", "Θ(log₃ n)", "O(log n)", "Θ(log2 n)"],
              indice: "Après t tours, i vaut environ n / 3ᵗ. Quand passe-t-il sous 1 ?",
              solution: [
                "Après `t` tours, `i ≈ n / 3ᵗ`. La boucle s'arrête quand `n / 3ᵗ ≤ 1`, soit `t ≥ log₃ n`.",
                "Environ `log₃ n` tours à coût constant. Or `log₃ n = log₂ n / log₂ 3` : la base est une constante multiplicative.",
                "Réponse : **`Θ(log n)`**."
              ]
            },
            {
              langage: "c",
              enonce: "Quelle est la complexité de cette fonction ?",
              code:
`int mixte(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 1; j < n; j = j * 2) {
            c = c + 1;
        }
    }
    return c;
}`,
              reponse: "Θ(n log n)",
              accepte: ["theta(n log n)", "Θ(n log(n))", "Θ(n·log n)", "Θ(nlogn)", "O(n log n)", "Θ(n log2 n)"],
              indice: "La boucle interne ne dépend pas de i : elle fait toujours le même nombre de tours. Multipliez.",
              solution: [
                "La boucle interne fait `⌈log₂ n⌉` tours, quel que soit `i` : les bornes sont indépendantes.",
                "Elle est répétée `n` fois : `n × ⌈log₂ n⌉ × Θ(1)` = **`Θ(n log n)`**.",
                "C'est la classe des bons algorithmes de tri (tri fusion)."
              ]
            },
            {
              langage: "c",
              enonce: "Quelle est la complexité de cette fonction ?",
              code:
`int racine(int n) {
    int i = 0;
    while (i * i < n) {
        i = i + 1;
    }
    return i;
}`,
              reponse: "Θ(√n)",
              accepte: ["theta(√n)", "Θ(sqrt(n))", "Θ(sqrt n)", "Θ(n^(1/2))", "Θ(n^0.5)", "O(√n)"],
              indice: "La boucle continue tant que i² < n. Quelle est la dernière valeur de i ?",
              solution: [
                "Le compteur avance de 1, mais la condition porte sur `i²` : la boucle continue tant que `i < √n`.",
                "Elle fait donc `⌈√n⌉` tours à coût constant : **`Θ(√n)`**.",
                "Sur l'échelle des croissances : `log n < √n < n`."
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "ch4-sommes",
          titre: "Θ de boucles dépendantes",
          description: "Trouver la classe sans calcul exact : minorer par la moitié des tours.",
          methode: [
            { titre: "Ce qui change" },
            "Pour un `O`, majorer chaque boucle par son maximum suffit : `j < i ≤ n` donne au plus `n × n` tours.",
            "Pour un `Θ`, il faut aussi une **minoration**. Astuce quand la somme exacte est pénible : ne garder que la **moitié des tours** externes où l'interne est long.",
            [
              "pour `i ≥ n/2`, la boucle `j < i` fait au moins `n/2` tours",
              "il y a au moins `n/2` telles valeurs de `i`",
              "donc au moins `(n/2) × (n/2) = n²/4` tours : `Ω(n²)`"
            ],
            { titre: "Rédiger" },
            "Deux paragraphes titrés « Majoration » et « Minoration », puis une conclusion qui combine `O` et `Ω` en `Θ`."
          ],
          methodeTitre: "Méthode — encadrer une double somme",
          exemple: {
            langage: "c",
            enonce: "Montrez que cette fonction est en `Θ(n²)`, sans calculer la somme exacte.",
            code:
`int paires(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            c = c + 1;
        }
    }
    return c;
}`,
            formuleTitre: "Rédaction modèle",
            formule: [
              "Notons `T(n)` le nombre d'exécutions de `c = c + 1;`. Chaque tour de boucle coûte `Θ(1)` et la boucle interne fait au moins un tour pour chaque `i` : la complexité est donc `Θ(T(n))`.",
              "**Majoration.** Pour chaque `i`, la boucle sur `j` fait `n − i ≤ n` tours, et la boucle sur `i` en fait `n`. Donc `T(n) ≤ n × n = n²` : `T(n) = O(n²)`.",
              "**Minoration.** Pour chaque `i ≤ n/2`, la boucle sur `j` fait `n − i ≥ n/2` tours. Il y a au moins `n/2` valeurs de `i` entre `0` et `n/2`. Donc `T(n) ≥ (n/2) × (n/2) = n²/4` : `T(n) = Ω(n²)`.",
              "**Conclusion.** `T(n) = O(n²)` et `T(n) = Ω(n²)`."
            ],
            reponse: [
              "Donc **`T(n) = Θ(n²)`**, avec `c₁ = 1/4` et `c₂ = 1`.",
              "Le calcul exact (`n(n + 1)/2`) aurait donné la même chose ; la minoration par la moitié marche même quand la somme exacte est inconnue."
            ]
          },
          exercices: [
            {
              langage: "c",
              enonce: "Quelle est la complexité de cette triple boucle ?",
              code:
`int triple(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            for (int k = 0; k < j; k++) {
                c = c + 1;
            }
        }
    }
    return c;
}`,
              reponse: "Θ(n³)",
              accepte: ["Θ(n^3)", "theta(n³)", "theta(n^3)", "O(n³)", "O(n^3)"],
              indice: "Majorez chaque boucle par n. Pour la minoration, gardez i ≥ n/2 et j entre n/4 et n/2 : combien de triplets au moins ?",
              solution: [
                "**Majoration** : chaque boucle fait au plus `n` tours, donc au plus `n³` exécutions : `O(n³)`.",
                "**Minoration** : pour `i ≥ n/2` (environ `n/2` valeurs) et `n/4 ≤ j < n/2` (environ `n/4` valeurs, toutes `< i`), la boucle sur `k` fait `j ≥ n/4` tours. Au moins `(n/2)(n/4)(n/4) = n³/32` exécutions : `Ω(n³)`.",
                "Donc **`Θ(n³)`**. Le nombre exact est `n(n − 1)(n − 2)/6`, le nombre de façons de choisir 3 indices distincts."
              ]
            },
            {
              langage: "c",
              enonce: "Quelle est la complexité de cette fonction ?",
              code:
`int carres(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i * i; j++) {
            c = c + 1;
        }
    }
    return c;
}`,
              reponse: "Θ(n³)",
              accepte: ["Θ(n^3)", "theta(n³)", "theta(n^3)", "O(n³)", "O(n^3)"],
              indice: "La boucle interne fait i² tours. Sommez les carrés, ou encadrez : au plus n² tours, et au moins (n/2)² pour la moitié des i.",
              solution: [
                "La boucle interne fait `i²` tours. `T(n) = ∑ (i = 0 → n − 1) i² = (n − 1)n(2n − 1)/6`.",
                "Le terme dominant est `2n³/6 = n³/3` : **`Θ(n³)`**.",
                "Sans la formule : `i² ≤ n²` donne `O(n³)`, et pour `i ≥ n/2`, `i² ≥ n²/4`, soit au moins `n³/8` : `Ω(n³)`."
              ]
            },
            {
              langage: "c",
              enonce: "Attention au piège : quelle est la complexité de cette fonction ?",
              code:
`int diag(int n) {
    int x = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) {
                for (int k = 0; k < n; k++) {
                    x = x + 1;
                }
            }
        }
    }
    return x;
}`,
              reponse: "Θ(n²)",
              accepte: ["Θ(n^2)", "theta(n²)", "theta(n^2)", "O(n²)", "O(n^2)"],
              indice: "Trois boucles imbriquées, mais la plus profonde n'est lancée que lorsque i == j. Combien de couples (i, j) vérifient cela ?",
              solution: [
                "Le test `i == j` s'exécute `n²` fois, à coût constant : `Θ(n²)`.",
                "Il n'est vrai que pour les `n` couples `(0, 0), (1, 1), …` : la boucle sur `k` n'est lancée que `n` fois, pour `n × n = n²` tours au total.",
                "`Θ(n²) + Θ(n²)` = **`Θ(n²)`**. Compter les boucles imbriquées ne suffit pas : il faut compter combien de fois chacune est **effectivement** lancée."
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "ch4-cas",
          titre: "Meilleur et pire cas, preuve à l'appui",
          description: "Exhiber une instance pour chaque cas et justifier son coût.",
          methode: [
            { titre: "Ce qui change" },
            "Affirmer « au pire cas, c'est `Θ(n²)` » ne suffit pas : il faut **exhiber** une entrée de taille `n` qui coûte autant, et montrer qu'**aucune** ne coûte plus.",
            [
              "**borne supérieure** : pour toute entrée, majorer le nombre de tours (sans supposer de contenu particulier)",
              "**instance du pire cas** : décrire une entrée précise, pour tout `n`, qui atteint cette borne",
              "**instance du meilleur cas** : de même pour le minimum"
            ],
            "Le meilleur cas n'est pas toujours `Θ(1)` : si une boucle va toujours au bout, il est au moins de son ordre."
          ],
          methodeTitre: "Méthode — justifier les cas",
          exemple: {
            langage: "c",
            enonce: "Donnez et justifiez les complexités au meilleur et au pire cas de cette recherche de doublon.",
            code:
`int doublon(int t[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[i] == t[j]) {
                return 1;
            }
        }
    }
    return 0;
}`,
            formuleTitre: "Rédaction modèle",
            formule: [
              "Chaque tour de la boucle interne coûte `Θ(1)`. Notons `C(t)` le nombre de comparaisons `t[i] == t[j]` effectuées sur l'entrée `t`.",
              "**Borne supérieure.** Pour toute entrée, le couple `(i, j)` parcourt au plus une fois chaque paire `i < j`. Donc `C(t) ≤ n(n − 1)/2`.",
              "**Pire cas.** Prenons `t = [0, 1, 2, …, n − 1]` : aucune égalité, le `return 1` n'est jamais atteint et toutes les paires sont testées. `C(t) = ∑ (i = 0 → n − 1) (n − 1 − i) = n(n − 1)/2`.",
              "**Meilleur cas.** Prenons `t[0] = t[1]` (`n ≥ 2`) : la première comparaison réussit et la fonction retourne. `C(t) = 1`."
            ],
            reponse: [
              "Meilleur cas **`Θ(1)`**, pire cas **`Θ(n²)`**, les deux atteints par une instance explicite.",
              "Sans précision, on annonce la garantie : `doublon` est en `O(n²)`."
            ]
          },
          exercices: [
            {
              langage: "c",
              enonce: "Quelle est la complexité de `g` au **meilleur cas** ?",
              code:
`int g(int t[], int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] == 0) {
            for (int j = 0; j < n; j++) {
                c = c + t[j];
            }
        }
    }
    return c;
}`,
              reponse: "Θ(n)",
              accepte: ["theta(n)", "O(n)"],
              indice: "Aucun return dans la boucle : la boucle sur i va toujours au bout. Que se passe-t-il si aucun t[i] ne vaut 0 ?",
              solution: [
                "Aucune sortie anticipée : la boucle externe fait toujours ses `n` tours, avec au moins un test chacun. Donc toute entrée coûte `Ω(n)`.",
                "Instance : `t` sans aucun 0. La boucle interne n'est jamais lancée : **`Θ(n)`**.",
                "Le meilleur cas n'est pas `Θ(1)` ici, faute de `return` dans la boucle."
              ]
            },
            {
              langage: "c",
              enonce: "Même fonction `g` : quelle est sa complexité au **pire cas** ?",
              code:
`int g(int t[], int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] == 0) {
            for (int j = 0; j < n; j++) {
                c = c + t[j];
            }
        }
    }
    return c;
}`,
              reponse: "Θ(n²)",
              accepte: ["Θ(n^2)", "theta(n²)", "theta(n^2)", "O(n²)", "O(n^2)"],
              indice: "Quelle entrée lance la boucle interne à chaque tour ?",
              solution: [
                "**Borne supérieure** : la boucle interne est lancée au plus `n` fois, pour `n` tours chacune : `O(n²)`.",
                "**Instance** : `t` ne contenant que des 0. Le test réussit à chaque tour, la boucle interne tourne `n` fois pour chacun des `n` tours : `n²` additions.",
                "Pire cas : **`Θ(n²)`**."
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "ch4-recursivite",
          titre: "Récursivité : poser et dérouler",
          description: "Écrire la relation de récurrence T(n), puis la dérouler.",
          methode: [
            { titre: "Ce qui change" },
            "Au chapitre 1, chaque appel coûtait une constante. Ici, un appel peut contenir une **boucle**, ou lancer **plusieurs** appels, ou diviser `n` au lieu de le décrémenter.",
            [
              "poser `T(n)` : coût de l'appel sur la taille `n`",
              "écrire la **relation de récurrence** : `T(n) = (coût des appels récursifs) + (coût du reste de l'appel)`, et le cas de base",
              "**dérouler** : remplacer `T(n − 1)` par sa propre formule, puis recommencer, jusqu'au cas de base",
              "sommer les termes obtenus"
            ],
            "Relations à reconnaître :",
            {
              entetes: ["Relation", "Solution", "Exemple"],
              lignes: [
                ["`T(n) = T(n − 1) + Θ(1)`", "`Θ(n)`", "somme récursive"],
                ["`T(n) = T(n − 1) + Θ(n)`", "`Θ(n²)`", "boucle + appel sur n − 1"],
                ["`T(n) = T(n/2) + Θ(1)`", "`Θ(log n)`", "dichotomie"],
                ["`T(n) = T(n/2) + Θ(n)`", "`Θ(n)`", "boucle + appel sur n/2"],
                ["`T(n) = 2T(n − 1) + Θ(1)`", "`Θ(2ⁿ)`", "deux appels sur n − 1"]
              ]
            }
          ],
          methodeTitre: "Méthode — relation de récurrence",
          exemple: {
            langage: "c",
            enonce: "Quelle est la complexité de `triangle(n)` ?",
            code:
`void triangle(int n) {
    if (n == 0) {
        return;
    }
    for (int i = 0; i < n; i++) {
        printf("*");
    }
    printf("\\n");
    triangle(n - 1);
}`,
            formuleTitre: "Rédaction modèle",
            formule: [
              "Notons `T(n)` le coût de `triangle(n)`. Le cas de base coûte une constante `a`. Pour `n ≥ 1`, l'appel fait une boucle de `n` tours à coût constant `b`, un `printf` et un appel sur `n − 1` :",
              [
                "`T(0) = a`",
                "`T(n) = T(n − 1) + b·n + a` pour `n ≥ 1`"
              ],
              "Déroulons :",
              [
                "`T(n) = T(n − 1) + b·n + a`",
                "`T(n) = T(n − 2) + b·(n − 1) + b·n + 2a`",
                "`T(n) = T(0) + b·(1 + 2 + … + n) + n·a`"
              ],
              "Donc `T(n) = a + b · n(n + 1)/2 + a·n`, dont le terme dominant est `(b/2)·n²`."
            ],
            reponse: [
              "**`T(n) = Θ(n²)`**.",
              "Remarque de rédaction : on nomme les constantes `a` et `b` plutôt que d'écrire des `Θ(1)` dans la somme, ce qui évite d'additionner `n` fois un symbole `Θ`."
            ]
          },
          exercices: [
            {
              langage: "c",
              enonce: "Complexité au pire cas de cette recherche dichotomique, avec `n = d − g + 1` ?",
              code:
`int dicho(int t[], int g, int d, int v) {
    if (g > d) {
        return -1;
    }
    int m = (g + d) / 2;
    if (t[m] == v) {
        return m;
    }
    if (t[m] < v) {
        return dicho(t, m + 1, d, v);
    }
    return dicho(t, g, m - 1, v);
}`,
              reponse: "Θ(log n)",
              accepte: ["theta(log n)", "Θ(log(n))", "Θ(log2 n)", "Θ(log₂ n)", "O(log n)"],
              indice: "Chaque appel fait un travail constant puis un seul appel, sur une zone deux fois plus petite. Quelle relation ?",
              solution: [
                "Un appel coûte `Θ(1)` puis lance **un** appel sur au plus `n/2` éléments : `T(n) = T(n/2) + Θ(1)`.",
                "Déroulé : `T(n) = T(n/4) + 2a = … = T(n/2ᵏ) + k·a`. Le cas de base arrive quand `n/2ᵏ < 1`, soit `k ≈ log₂ n`.",
                "Pire cas (valeur absente) : **`Θ(log n)`**."
              ]
            },
            {
              langage: "c",
              enonce: "Quelle est la complexité de `moities(n)` ?",
              code:
`int moities(int n) {
    if (n <= 1) {
        return 1;
    }
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + i;
    }
    return s + moities(n / 2);
}`,
              reponse: "Θ(n)",
              accepte: ["theta(n)", "O(n)"],
              indice: "T(n) = T(n/2) + b·n. Déroulez : b·n + b·n/2 + b·n/4 + … Cette somme géométrique est majorée par combien ?",
              solution: [
                "`T(n) = T(n/2) + b·n + a`. Déroulé : `T(n) = b·(n + n/2 + n/4 + …) + a·log₂ n + T(1)`.",
                "La somme géométrique vérifie `n + n/2 + n/4 + … ≤ 2n` ; elle est aussi `≥ n` (premier terme).",
                "Donc `b·n ≤ T(n) ≤ 2b·n + a·log₂ n + T(1)` : **`Θ(n)`**. Ce n'est pas `n log n` : les boucles raccourcissent de moitié à chaque appel."
              ]
            },
            {
              langage: "c",
              enonce: "Combien d'appels à `h` (celui du départ compris) provoque `h(4)` ?",
              code:
`int h(int n) {
    if (n == 0) {
        return 1;
    }
    return h(n - 1) + h(n - 1);
}`,
              reponse: "31",
              indice: "Notez A(n) le nombre d'appels : A(0) = 1 et A(n) = 1 + 2·A(n − 1). Calculez A(1), A(2)…",
              solution: [
                "`A(0) = 1`, `A(n) = 1 + 2A(n − 1)`, donc `A(1) = 3`, `A(2) = 7`, `A(3) = 15`, `A(4) =` **31**.",
                "En général `A(n) = 2ⁿ⁺¹ − 1` (récurrence immédiate), d'où `T(n) = Θ(2ⁿ)`.",
                "Écrire `2 * h(n - 1)` ferait un seul appel par niveau et ramènerait la fonction en `Θ(n)` : calculer deux fois la même chose coûte exponentiellement cher."
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "ch4-echelle",
          titre: "Comparer des algorithmes en pratique",
          description: "Seuils de rentabilité et prédiction de temps à partir de la classe.",
          methode: [
            { titre: "Deux usages concrets de la classe" },
            "**Prédire un temps.** Si `T(n) ≈ k · g(n)`, alors `T(n') / T(n) ≈ g(n') / g(n)` : la constante `k` disparaît.",
            [
              "`Θ(n)` : taille ×4 → temps ×4",
              "`Θ(n²)` : taille ×4 → temps ×16",
              "`Θ(n³)` : taille ×3 → temps ×27",
              "`Θ(2ⁿ)` : taille + 10 → temps ×1024"
            ],
            "**Trouver un seuil.** L'algorithme de meilleure classe peut perdre sur les petites entrées ; le **seuil** est le premier `n` à partir duquel il gagne pour de bon. C'est le `n₀` de la définition, rendu concret."
          ],
          methodeTitre: "Méthode — la classe en pratique",
          exemple: {
            enonce: "L'algorithme A coûte `100n` opérations, l'algorithme B coûte `n²`. À partir de quelle taille A est-il strictement plus rapide ? Et si B met 1 s pour `n = 2000`, combien pour `n = 8000` ?",
            formuleTitre: "Rédaction modèle",
            formule: [
              "**Seuil.** Pour `n > 0` : `100n < n²` ⟺ `100 < n`. A est strictement plus rapide pour tout `n ≥ 101`, et B l'est pour `n < 100` (égalité à `n = 100`).",
              "**Prédiction.** B est en `Θ(n²)`. En passant de `n = 2000` à `n = 8000`, la taille est multipliée par 4, donc le temps par `4² = 16`."
            ],
            reponse: [
              "Seuil : **`n = 101`**. Temps de B pour `n = 8000` : environ **16 s**.",
              "Morale : `100n = O(n²)` mais pas l'inverse. Un meilleur `O` garantit de gagner, **à partir d'un certain rang**."
            ]
          },
          exercices: [
            {
              enonce: "Un algorithme en `Θ(n²)` traite `n = 1000` éléments en 2 s. Combien de secondes pour `n = 4000` ?",
              reponse: "32",
              accepte: ["32 s", "32s", "32 secondes"],
              indice: "Taille ×4 ; en quadratique, le temps est multiplié par 4².",
              solution: [
                "`(4000 / 1000)² = 16`, donc `2 × 16 =` **32 s**."
              ]
            },
            {
              enonce: "Un algorithme en `Θ(n³)` traite `n = 100` en 1 s. Combien de secondes pour `n = 300` ?",
              reponse: "27",
              accepte: ["27 s", "27s", "27 secondes"],
              indice: "Taille ×3, exposant 3.",
              solution: [
                "`(300 / 100)³ = 3³ = 27`, donc **27 s**."
              ]
            },
            {
              enonce: "Un algorithme en `Θ(2ⁿ)` traite `n = 30` en 1 s. Combien de secondes pour `n = 40` ?",
              reponse: "1024",
              accepte: ["1024 s", "1024s", "1024 secondes", "2^10"],
              indice: "2⁴⁰ / 2³⁰ = 2^(40 − 30).",
              solution: [
                "`2⁴⁰ / 2³⁰ = 2¹⁰ = 1024` : **1024 s**, soit 17 minutes, pour seulement 10 éléments de plus.",
                "C'est pourquoi un algorithme exponentiel est inutilisable au-delà de quelques dizaines d'éléments."
              ]
            },
            {
              enonce: "Quel est le plus petit `n ≥ 2` à partir duquel `2ⁿ > n³` pour de bon ?",
              reponse: "10",
              indice: "Calculez les deux côtés pour n = 8, 9, 10 : 2⁹ = 512 et 9³ = 729.",
              solution: [
                "`2⁹ = 512 < 729 = 9³`, mais `2¹⁰ = 1024 > 1000 = 10³`.",
                "Ensuite, passer de `n` à `n + 1` multiplie `2ⁿ` par 2, et `n³` par `((n + 1)/n)³ ≤ 1,1³ ≈ 1,33` : l'écart ne fait que grandir. Réponse : **`n = 10`**.",
                "Avant ce seuil, l'exponentielle paraît plus rapide : c'est pour cela que `n₀` existe dans la définition."
              ]
            }
          ]
        }
      ]
    }

  ]
};
