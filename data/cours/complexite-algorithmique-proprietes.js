/* =============================================================
   Complexité algorithmique — chapitre 3 : propriétés de calcul
   (CM2 §4 pour O, §II.2 pour Ω, §III.3 pour Θ ; CM3 §II pour les
   expressions qui mêlent O et Θ). Chaque propriété est démontrée
   à partir de la définition, ligne par ligne, puis utilisée.
   Complète CONTENU["complexite-algorithmique"].
   ============================================================= */

(() => {
  const { champ, courbes, grille, log2 } = window.OutilsComplexite;

  const PROPRIETES = {
    entetes: ["N°", "Propriété (CM2)", "En mots"],
    lignes: [
      ["(1)", "`λ = O(1)`", "une constante est bornée"],
      ["(2)", "`f(n) = O(f(n))`", "toute fonction se borne elle-même"],
      ["(3)", "`O(f) + O(g) = O(f + g)`", "la somme"],
      ["(4)", "`O(f + g) = O(max(f, g))`", "le terme dominant"],
      ["(5)", "`O(f) × O(g) = O(f × g)`", "le produit"],
      ["(6)", "`O(λ · f) = O(f)`", "les constantes disparaissent"],
      ["(7)", "`f = O(g)` et `g = O(h)` ⇒ `f = O(h)`", "la transitivité"]
    ]
  };

  CONTENU["complexite-algorithmique"].chapitres.push({
    id: "ch3",
    titre: "Chapitre 3 — Propriétés de calcul",
    description: "Les sept propriétés de O, Ω et Θ : les démontrer, puis s'en servir pour simplifier.",
    exercices: [

      /* ---------- Leçon 3.1 ---------- */
      {
        type: "lecon",
        id: "ca-prop-constantes",
        titre: "Constantes et réflexivité : (1), (2), (6)",
        description: "Une constante est en O(1), f est en O(f), et les facteurs constants disparaissent.",
        cours: [
          {
            titre: "Les sept propriétés",
            texte: [
              "Soient `f`, `g`, `h` positives et `λ > 0` une constante. Le CM2 numérote :",
              PROPRIETES,
              "Elles valent aussi pour `Ω` et `Θ`. On les démontre toutes à partir de la définition."
            ],
            schema: courbes([
              [(n) => n * n, "n²", 1],
              [(n) => 2 * n * n, "2n²", 1, true],
              [(n) => 5 * n * n, "5n²", 2]
            ], { xMax: 6, legende: "Même forme, à un facteur constant près : même classe" })
          },
          {
            titre: "(1) Une constante est en O(1)",
            texte: [
              "Une fonction constante `f(n) = λ` ne dépend pas de `n` : elle est bornée par `λ · 1`."
            ],
            schema: courbes([
              [() => 7, "f(n) = 7", 2],
              [() => 8, "c·1 avec c = 8", 1, true]
            ], { xMax: 10, yMax: 10, legende: "Tout `c ≥ 7` convient" }),
            demo: {
              enonce: "Montrons que `λ = O(1)`.",
              lignes: [
                ["Il s'agit de trouver `c > 0` et `n₀` tels que `λ ≤ c · 1` pour tout `n ≥ n₀`.", "le but"],
                ["Pour tout `n ≥ 0`, `λ ≤ λ · 1`.", ""],
                ["Avec `c = λ > 0` et `n₀ = 0`, par définition `λ = O(1)`.", "conclusion"]
              ]
            }
          },
          {
            titre: "(2) Une fonction est en O d'elle-même",
            texte: [
              "C'est la propriété qui permet d'**écrire** un `O` à partir d'un terme : `5n = O(5n)`."
            ],
            schema: courbes([
              [(n) => n * n / 4 + 3, "f(n)", 2],
              [(n) => n * n / 4 + 3, "c·f(n), c = 1", 1, true]
            ], { xMax: 10, legende: "`f ≤ 1 · f` : il suffit de prendre `c = 1`" }),
            demo: [
              ["Pour tout `n ≥ 0`, `f(n) ≤ 1 · f(n)`.", ""],
              ["Avec `c = 1` et `n₀ = 0`, `f(n) = O(f(n))`.", ""]
            ]
          },
          {
            titre: "(6) Les constantes multiplicatives disparaissent",
            texte: [
              "`O(λ · f) = O(f)` : une fonction bornée par `c · λ · f` est bornée par `(cλ) · f`, et `cλ` est encore une constante.",
              "L'égalité est une égalité d'**ensembles** : on prouve les deux inclusions."
            ],
            schema: courbes([
              [(n) => n * n, "n²", 1],
              [(n) => 5 * n * n, "5n²", 2]
            ], { xMax: 6, zone: { entre: [0, 1] }, legende: "Le rapport reste 5 : même classe `O(n²)`" }),
            demo: {
              enonce: "Montrons que `O(λ · f) = O(f)`.",
              lignes: [
                ["Soit `h ∈ O(λ · f)` : il existe `c > 0` et `n₀` tels que `h(n) ≤ c · λ · f(n)` pour `n ≥ n₀`.", "⊂"],
                ["Posons `c' = c · λ > 0`. Alors `h(n) ≤ c' · f(n)` pour `n ≥ n₀`, donc `h ∈ O(f)`.", ""],
                ["Soit `h ∈ O(f)` : `h(n) ≤ c · f(n) = (c/λ) · λ · f(n)` pour `n ≥ n₀`.", "⊃"],
                ["Avec `c'' = c/λ > 0`, `h ∈ O(λ · f)`.", ""],
                ["Les deux ensembles sont égaux : `O(λ · f) = O(f)`.", "conclusion"]
              ]
            }
          },
          {
            titre: "S'en servir (CM2)",
            texte: [
              "Pour transformer un terme en classe : (2) puis (6).",
              "Plus besoin de chercher une constante à la main."
            ],
            schema: courbes([
              [(n) => 2 * n * n, "2n²", 2],
              [(n) => n * n, "n²", 1]
            ], { xMax: 6, legende: "`2n² = O(2n²) = O(n²)`" }),
            demo: [
              ["`2n² = O(2n²)`", "propriété (2)"],
              ["`O(2n²) = O(n²)`", "propriété (6), `λ = 2`"],
              ["`5n = O(5n) = O(n)`", "(2) puis (6)"],
              ["`7 = O(1)`", "propriété (1)"]
            ]
          }
        ],
        problematique: {
          texte: [
            "Deux étudiants comptent les opérations de la même boucle avec des conventions différentes : l'un trouve `5n`, l'autre `7n`.",
            "Ont-ils la même complexité ? Comment le justifier sans chercher de constante ?"
          ]
        },
        exemple: {
          questions: [
            "Montrer que `5n = O(n)` en citant les propriétés.",
            "Montrer que `7n = O(n)` de la même façon.",
            "Montrer que `n = O(7n)` : les deux comptes sont-ils dans la même classe ?"
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["`5n = O(5n)` par (2), et `O(5n) = O(n)` par (6) : `5n = O(n)`.", ""],
                ["`7n = O(7n) = O(n)` de même.", ""],
                ["`n = O(n)` par (2), et `O(n) = O(7n)` par (6) lue de droite à gauche.", "égalité d'ensembles"],
                ["Les deux comptes sont en `O(n)` : la convention de comptage ne change pas la classe.", "conclusion"]
              ]
            },
            { remarque: "Pour `5n + 3`, il faudra regrouper `O(n) + O(1)` : ce sont les propriétés (3) et (4), leçon suivante." }
          ]
        },
        exercices: [
          {
            type: "qcm", niveau: 1,
            titre: "Quelle propriété ?",
            enonce: "Quelle propriété justifie `42 = O(1)` ?",
            choix: ["(1)", "(2)", "(4)", "(6)"],
            reponse: 0,
            explication: ["(1) : toute constante `λ` est en `O(1)`."]
          },
          {
            type: "champs", niveau: 1,
            titre: "Effacer une constante",
            enonce: "Simplifiez.",
            champs: [champ("`O(17n³)`", "O(n³)"), champ("`O(1000)`", "O(1)")],
            explication: ["(6) efface le 17 ; une constante est en `O(1)` par (1)."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Facteurs constants",
            enonce: "Cochez les égalités **vraies**.",
            choix: ["`O(3n) = O(n)`", "`O(n/2) = O(n)`", "`O(2ⁿ) = O(3ⁿ)`", "`O(2ⁿ⁺¹) = O(2ⁿ)`", "`O(log₂ n) = O(log₁₀ n)`"],
            reponse: [0, 1, 3, 4],
            explication: [[
              "`n/2 = (1/2) · n` et `2ⁿ⁺¹ = 2 · 2ⁿ` : facteurs constants ;",
              "`log₂ n = log₂ 10 · log₁₀ n` : facteur constant ;",
              "`3ⁿ = 1,5ⁿ · 2ⁿ` : le facteur `1,5ⁿ` n'est pas constant."
            ]]
          },
          {
            type: "remettre", niveau: 2,
            titre: "Démontrer (6), première inclusion",
            enonce: "Remettez dans l'ordre la preuve de `O(λ · f) ⊂ O(f)`.",
            etapes: [
              "Soit `h ∈ O(λ · f)`.",
              "Il existe `c > 0` et `n₀` tels que `h(n) ≤ c · λ · f(n)` pour tout `n ≥ n₀`.",
              "Posons `c' = c · λ`, qui est une constante strictement positive.",
              "Alors `h(n) ≤ c' · f(n)` pour tout `n ≥ n₀`.",
              "Donc `h ∈ O(f)`."
            ]
          },
          {
            type: "champs", niveau: 3,
            titre: "La nouvelle constante",
            enonce: "On sait que `h(n) ≤ 3 · (5n²)` pour tout `n ≥ 2`. Pour conclure `h = O(n²)` avec la preuve de (6) :",
            champs: [champ("`c'`", 15), champ("`n₀`", 2)],
            explication: ["`c' = 3 × 5 = 15` ; le rang ne change pas."]
          },
          {
            type: "qcm", niveau: 3,
            titre: "Une fausse constante",
            enonce: "Peut-on écrire `O(n · n²) = O(n²)` avec la propriété (6) ?",
            choix: [
              "Oui, avec `λ = n`",
              "Non : `λ` doit être une constante, indépendante de `n`",
              "Oui, à condition que `n ≥ 1`",
              "Non, car `n²` n'est pas une constante"
            ],
            reponse: 1,
            explication: ["`n · n² = n³` n'est pas en `O(n²)`. Dans (6), `λ` ne dépend pas de `n`."]
          },
          {
            type: "champs", niveau: 4,
            titre: "Un décalage d'exposant",
            enonce: "`2ⁿ⁺⁵ = λ · 2ⁿ`. Quelle est la constante `λ` utilisée par (6) pour conclure `O(2ⁿ⁺⁵) = O(2ⁿ)` ?",
            champs: [champ("`λ`", 32)],
            explication: ["`2ⁿ⁺⁵ = 2⁵ · 2ⁿ = 32 · 2ⁿ`."]
          },
          {
            type: "qcm", niveau: 4,
            titre: "Où est l'erreur ?",
            enonce: "« `4ⁿ = 2ⁿ · 2ⁿ`, donc par (6), `O(4ⁿ) = O(2ⁿ)`. » Où est l'erreur ?",
            choix: [
              "Il n'y en a pas",
              "`4ⁿ` n'est pas égal à `2ⁿ · 2ⁿ`",
              "Le facteur `2ⁿ` n'est pas une constante",
              "(6) ne s'applique qu'aux polynômes"
            ],
            reponse: 2,
            explication: ["(6) exige un `λ` constant. On a même `4ⁿ ≠ O(2ⁿ)` (preuve par l'absurde du chapitre 2)."]
          }
        ]
      },

      /* ---------- Leçon 3.2 ---------- */
      {
        type: "lecon",
        id: "ca-prop-somme",
        titre: "Somme et maximum : (3) et (4)",
        description: "Additionner des O, puis ne garder que le terme dominant.",
        cours: [
          {
            titre: "(3) La somme",
            texte: [
              "Une fonction de `O(f)` plus une fonction de `O(g)` donne une fonction de `O(f + g)`.",
              "On prend la plus grande des deux constantes et le plus grand des deux rangs."
            ],
            schema: courbes([
              [(n) => 2 * n * n, "h₁ ≤ 2n²", 2],
              [(n) => 15 * n, "h₂ ≤ 15n", 3],
              [(n) => 2 * n * n + 15 * n, "h₁ + h₂", 1]
            ], { xMax: 10, legende: "La somme reste sous `max(c₁, c₂) · (f + g)`" }),
            demo: {
              enonce: "Montrons que `O(f) + O(g) ⊂ O(f + g)`.",
              lignes: [
                ["Soient `h₁ ∈ O(f)` et `h₂ ∈ O(g)`.", ""],
                ["`h₁(n) ≤ c₁ f(n)` pour `n ≥ n₁` et `h₂(n) ≤ c₂ g(n)` pour `n ≥ n₂`.", "définition, deux fois"],
                ["Posons `c = max(c₁, c₂)` et `n₀ = max(n₁, n₂)`.", "les deux doivent tenir"],
                ["Pour `n ≥ n₀` : `h₁(n) + h₂(n) ≤ c f(n) + c g(n) = c (f(n) + g(n))`.", "`c₁, c₂ ≤ c`"],
                ["Donc `h₁ + h₂ ∈ O(f + g)`.", "conclusion"]
              ]
            }
          },
          {
            titre: "(4) Le maximum",
            texte: [
              "Pour `f, g ≥ 0` : `max(f, g) ≤ f + g ≤ 2 · max(f, g)`.",
              "La somme et le maximum diffèrent d'un facteur au plus 2 : même classe."
            ],
            schema: courbes([
              [(n) => Math.max(n * n, 10 * n), "max(n², 10n)", 1],
              [(n) => n * n + 10 * n, "n² + 10n", 2],
              [(n) => 2 * Math.max(n * n, 10 * n), "2·max", 1, true]
            ], { xMax: 16, yMax: 500, zone: { entre: [0, 2] }, legende: "`f + g` coincée entre `max` et `2 · max`" }),
            demo: {
              enonce: "Montrons que `O(f + g) = O(max(f, g))`.",
              lignes: [
                ["Pour tout `n`, `f(n) ≤ max(f(n), g(n))` et `g(n) ≤ max(f(n), g(n))`.", ""],
                ["En sommant : `f(n) + g(n) ≤ 2 · max(f(n), g(n))`.", ""],
                ["Donc `f + g = O(max(f, g))`, puis `O(f + g) ⊂ O(max(f, g))`.", "transitivité (7)"],
                ["Comme `f, g ≥ 0`, `max(f(n), g(n)) ≤ f(n) + g(n)`.", "inclusion inverse"],
                ["D'où `O(f + g) = O(max(f, g))`.", ""]
              ]
            }
          },
          {
            titre: "Conséquence : le terme dominant (CM2)",
            texte: [
              "Pour un polynôme, (2), (6), (1), (3) et (4) laissent le terme de plus haut degré, sans coefficient."
            ],
            schema: courbes([
              [(n) => 2 * n * n + 5 * n + 7, "2n² + 5n + 7", 2],
              [(n) => n * n, "n²", 1]
            ], { xMax: 8, legende: "Même forme : `O(n²)`" }),
            demo: {
              enonce: "Montrons que `2n² + 5n + 7 = O(n²)` avec les propriétés.",
              lignes: [
                ["`2n² = O(2n²) = O(n²)` et `5n = O(5n) = O(n)`.", "(2) puis (6)"],
                ["`7 = O(1)`.", "(1)"],
                ["En sommant : `2n² + 5n + 7 = O(n²) + O(n) + O(1)`.", ""],
                ["`= O(n² + n + 1)`", "(3)"],
                ["`= O(max(n², n, 1)) = O(n²)`.", "(4)"]
              ]
            }
          },
          {
            titre: "Mêmes règles pour Ω et Θ (CM2)",
            texte: [
              "Les sept propriétés valent aussi pour `Ω` et `Θ`. Pour `Ω`, (4) dit : garder le terme dominant ne fait que **baisser** la somme."
            ],
            schema: courbes([
              [(n) => 3 * n ** 3 + 20 * n * n, "3n³ + 20n²", 2],
              [(n) => n ** 3, "n³", 1]
            ], { xMax: 6, zone: { entre: [1, 0] }, legende: "`3n³ + 20n² ≥ n³`" }),
            demo: [
              ["`Ω(3n³ + 20n²) = Ω(3n³) + Ω(20n²)`", "(3)"],
              ["`= Ω(n³) + Ω(n²)`", "(6)"],
              ["`= Ω(n³ + n²) = Ω(max(n³, n²)) = Ω(n³)`.", "(3) puis (4)"]
            ]
          }
        ],
        problematique: {
          texte: [
            "Un programme trie d'abord ses données en `O(n²)`, puis les parcourt une fois en `O(n)`.",
            "Quelle est sa complexité totale, et quelles propriétés le justifient ?"
          ]
        },
        exemple: {
          texte: ["Simplifier `O(3n³ + 20n²)` en citant les propriétés (exemple 2 du CM2)."],
          questions: [
            "Séparer la somme.",
            "Effacer les coefficients.",
            "Regrouper et conclure."
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["`O(3n³ + 20n²) = O(3n³) + O(20n²)`", "(3)"],
                ["`O(3n³) = O(n³)` et `O(20n²) = O(n²)`", "(6)"],
                ["Donc `O(3n³ + 20n²) = O(n³) + O(n²)`", ""],
                ["`= O(n³ + n²)`", "(3)"],
                ["`= O(max(n³, n²)) = O(n³)`.", "(4)"]
              ]
            },
            { remarque: "Pour la problématique : `O(n²) + O(n) = O(n² + n) = O(n²)`, par (3) puis (4)." }
          ]
        },
        exercices: [
          {
            type: "champs", niveau: 1,
            titre: "Le terme dominant",
            enonce: "Simplifiez `O(5n² + 100n + 3)`.",
            champs: [champ("Réponse", "O(n²)")],
            explication: ["Pour `n = 1000`, `5n²` vaut 5 000 000 contre 100 000 pour `100n`."]
          },
          {
            type: "champs", niveau: 1,
            titre: "Deux phases",
            enonce: "Simplifiez `O(n) + O(n²)`.",
            champs: [champ("Réponse", "O(n²)")],
            explication: ["(3) donne `O(n + n²)`, (4) donne `O(n²)`."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Quelle propriété ?",
            enonce: "Quelle propriété justifie `O(n² + n) = O(n²)` ?",
            choix: ["(2)", "(3)", "(4)", "(6)"],
            reponse: 2,
            explication: ["(4) : `O(f + g) = O(max(f, g))`, et `max(n², n) = n²`."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Avec un logarithme",
            enonce: "Simplifiez `O(n log n + n)`.",
            champs: [champ("Réponse", "O(n log n)")],
            explication: ["Pour `n ≥ 2`, `n ≤ n log₂ n` : le maximum est `n log n`."]
          },
          {
            type: "remettre", niveau: 2,
            titre: "Rédiger avec les propriétés",
            enonce: "Remettez dans l'ordre la preuve de `2n² + 5n + 7 = O(n²)` par les propriétés.",
            etapes: [
              "Par (2) puis (6) : `2n² = O(n²)` et `5n = O(n)`.",
              "Par (1) : `7 = O(1)`.",
              "En sommant : `2n² + 5n + 7 = O(n²) + O(n) + O(1)`.",
              "Par (3) : `= O(n² + n + 1)`.",
              "Par (4) : `= O(max(n², n, 1)) = O(n²)`."
            ]
          },
          {
            type: "champs", niveau: 3,
            titre: "Ω et Θ",
            enonce: "Simplifiez.",
            champs: [
              champ("`Ω(3n³ + 20n²)`", "Ω(n³)", { accepte: ["omega(n^3)", "Ω(n^3)", "Ω(n3)", "omega(n3)"] }),
              champ("`Θ(4n + 2√n)`", "Θ(n)")
            ],
            explication: ["Mêmes propriétés (CM2). `√n ≤ n` pour `n ≥ 1`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Les constantes de (3)",
            enonce: "On sait `h₁(n) ≤ 3f(n)` pour `n ≥ 5` et `h₂(n) ≤ 7g(n)` pour `n ≥ 2`. Pour `h₁ + h₂ ≤ c (f + g)` :",
            champs: [champ("`c`", 7), champ("`n₀`", 5)],
            explication: ["`c = max(3, 7) = 7` et `n₀ = max(5, 2) = 5`."]
          },
          {
            type: "champs", niveau: 4,
            titre: "Qui domine ?",
            enonce: "Simplifiez.",
            champs: [champ("`O(n² + 2ⁿ)`", "O(2ⁿ)", { accepte: ["O(2^n)"] }), champ("`O(n³ + n² log n)`", "O(n³)")],
            explication: ["`n² ≤ 2ⁿ` pour `n ≥ 4` ; `log n ≤ n`, donc `n² log n ≤ n³`."]
          },
          {
            type: "remettre", niveau: 4,
            titre: "Démontrer (4)",
            enonce: "Remettez dans l'ordre la preuve de `f + g = O(max(f, g))`.",
            etapes: [
              "Pour tout `n`, `f(n) ≤ max(f(n), g(n))`.",
              "De même, `g(n) ≤ max(f(n), g(n))`.",
              "En sommant, `f(n) + g(n) ≤ 2 · max(f(n), g(n))`.",
              "Avec `c = 2` et `n₀ = 0`, `f + g = O(max(f, g))`."
            ]
          }
        ]
      },

      /* ---------- Leçon 3.3 ---------- */
      {
        type: "lecon",
        id: "ca-prop-produit",
        titre: "Produit et transitivité : (5) et (7)",
        description: "Multiplier des O (boucles imbriquées) et enchaîner des bornes.",
        cours: [
          {
            titre: "(5) Le produit",
            texte: [
              "Si `h₁ ≤ c₁ f` et `h₂ ≤ c₂ g`, alors `h₁ h₂ ≤ (c₁ c₂) f g` : on peut multiplier des inégalités **entre nombres positifs**.",
              "Les exposants s'additionnent : `n² × n³ = n⁵`."
            ],
            schema: courbes([
              [(n) => n, "n", 1],
              [(n) => log2(n), "log₂ n", 4],
              [(n) => n * log2(n), "n · log₂ n", 2]
            ], { xMin: 1, xMax: 10, legende: "`O(n) × O(log n) = O(n log n)`" }),
            demo: {
              enonce: "Montrons que `O(f) × O(g) ⊂ O(f × g)`.",
              lignes: [
                ["Soient `h₁ ∈ O(f)` et `h₂ ∈ O(g)` : `0 ≤ h₁ ≤ c₁ f` (`n ≥ n₁`) et `0 ≤ h₂ ≤ c₂ g` (`n ≥ n₂`).", ""],
                ["Soit `n ≥ n₀ = max(n₁, n₂)`.", "les deux tiennent"],
                ["`h₁(n) h₂(n) ≤ c₁ f(n) · c₂ g(n)`", "produit d'inégalités positives"],
                ["`= (c₁ c₂) · f(n) g(n)`.", ""],
                ["Avec `c = c₁ c₂`, `h₁ h₂ ∈ O(f × g)`.", "conclusion"]
              ]
            }
          },
          {
            titre: "Le produit naît des boucles imbriquées",
            texte: [
              "Une boucle de `n` tours dont **chaque tour** coûte `O(g(n))` coûte `O(n) × O(g(n)) = O(n · g(n))`.",
              "Deux boucles de `n` tours : `O(n) × O(n) = O(n²)`."
            ],
            schema: grille(5, () => 1, { legende: "`n` tours × `n` tours : `n²` cases" })
          },
          {
            titre: "(7) La transitivité",
            texte: [
              "Les bornes s'enchaînent : si `f` est sous `g` et `g` sous `h`, alors `f` est sous `h`.",
              "Les constantes se multiplient, les rangs se maximisent."
            ],
            schema: courbes([
              [(n) => n, "f = n", 1],
              [(n) => n * log2(n), "g = n log₂ n", 3],
              [(n) => n * n, "h = n²", 2]
            ], { xMin: 1, xMax: 10, legende: "`n = O(n log n)` et `n log n = O(n²)`, donc `n = O(n²)`" }),
            demo: {
              enonce: "Montrons (7).",
              lignes: [
                ["`f(n) ≤ c₁ g(n)` pour `n ≥ n₁` et `g(n) ≤ c₂ h(n)` pour `n ≥ n₂`.", "hypothèses"],
                ["Soit `n ≥ max(n₁, n₂)`.", ""],
                ["`f(n) ≤ c₁ g(n) ≤ c₁ c₂ h(n)`.", "`c₁ > 0` conserve le sens"],
                ["Avec `c = c₁ c₂` et `n₀ = max(n₁, n₂)`, `f = O(h)`.", ""]
              ]
            }
          },
          {
            titre: "Exemple complet (CM2)",
            texte: ["On simplifie chaque facteur, puis on multiplie."],
            schema: courbes([
              [(n) => n ** 5, "n⁵", 1],
              [(n) => n * n * (4 * n ** 3 + 13 * n * n + 5) / 22, "n²(4n³ + 13n² + 5)/22", 2]
            ], { xMin: 0, xMax: 3, legende: "Le produit a la forme de `n⁵`" }),
            demo: {
              enonce: "Simplifions `O(n²) × O(4n³ + 13n² + 5)`.",
              lignes: [
                ["`4n³ = O(n³)`, `13n² = O(n²)`, `5 = O(1)`.", "(2), (6), (1)"],
                ["`4n³ + 13n² + 5 = O(n³ + n² + 1) = O(n³)`.", "(3) puis (4)"],
                ["`O(n²) × O(4n³ + 13n² + 5) = O(n²) × O(n³)`", ""],
                ["`= O(n⁵)`.", "(5)"]
              ]
            }
          }
        ],
        problematique: {
          texte: [
            "Un correcteur orthographique cherche chacun des `n` mots d'un dictionnaire dans un texte de `m` lettres, en parcourant tout le texte à chaque fois.",
            "Quelle est sa complexité ?"
          ]
        },
        exemple: {
          texte: ["Simplifier `O(n³) × O(2n² + 7)`, puis `O(n) × O(m)`."],
          questions: [
            "Simplifier chaque facteur.",
            "Multiplier et nommer la propriété."
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["`2n² + 7 = O(n²)`", "(2), (6), (1), (3), (4)"],
                ["`O(n³) × O(n²) = O(n³ × n²) = O(n⁵)`.", "(5) ; les exposants s'additionnent"],
                ["Pour le correcteur : `n` recherches à `O(m)` chacune, soit `O(n) × O(m) = O(n · m)`.", "(5)"]
              ]
            },
            { attention: "Piège classique : `n³ × n² = n⁵`, pas `n⁶`." }
          ]
        },
        exercices: [
          {
            type: "champs", niveau: 1,
            titre: "Deux boucles",
            enonce: "Simplifiez `O(n) × O(n)`.",
            champs: [champ("Réponse", "O(n²)")],
            explication: ["(5) : `O(n × n) = O(n²)`."]
          },
          {
            type: "champs", niveau: 1,
            titre: "Additionner les exposants",
            enonce: "Simplifiez `O(n²) × O(n³)`.",
            champs: [champ("Réponse", "O(n⁵)", { accepte: ["O(n^5)", "O(n5)"] })],
            explication: ["`n² × n³ = n²⁺³ = n⁵`."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Simplifier d'abord",
            enonce: "Simplifiez `O(n³) × O(2n² + 7)`.",
            champs: [champ("Réponse", "O(n⁵)", { accepte: ["O(n^5)", "O(n5)"] })],
            explication: ["`O(2n² + 7) = O(n²)`, puis (5)."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Enchaîner",
            enonce: "On sait `n = O(n log n)` et `n log n = O(n²)`. Quelle propriété donne `n = O(n²)` ?",
            choix: ["(3)", "(4)", "(5)", "(7)"],
            reponse: 3,
            explication: ["La transitivité (7)."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Les constantes de (5)",
            enonce: "`h₁(n) ≤ 2f(n)` pour `n ≥ 3` et `h₂(n) ≤ 5g(n)` pour `n ≥ 4`. Pour `h₁ h₂ ≤ c · f g` :",
            champs: [champ("`c`", 10), champ("`n₀`", 4)],
            explication: ["`c = 2 × 5 = 10` (on multiplie) et `n₀ = max(3, 4) = 4`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Produit puis somme",
            enonce: "Simplifiez `O(log n) × O(n) + O(n)`.",
            champs: [champ("Réponse", "O(n log n)")],
            explication: ["(5) : `O(n log n)` ; puis (3) et (4) : `n ≤ n log₂ n` pour `n ≥ 2`."]
          },
          {
            type: "remettre", niveau: 3,
            titre: "Démontrer (7)",
            enonce: "Remettez la preuve de la transitivité dans l'ordre.",
            etapes: [
              "Il existe `c₁, n₁` tels que `f(n) ≤ c₁ g(n)` pour tout `n ≥ n₁`.",
              "Il existe `c₂, n₂` tels que `g(n) ≤ c₂ h(n)` pour tout `n ≥ n₂`.",
              "Soit `n ≥ max(n₁, n₂)` : `f(n) ≤ c₁ g(n) ≤ c₁ c₂ h(n)`.",
              "Avec `c = c₁ c₂` et `n₀ = max(n₁, n₂)`, `f = O(h)`."
            ]
          },
          {
            type: "qcm", niveau: 4,
            titre: "Opérations interdites",
            enonce: "Cochez les égalités **vraies**.",
            choix: ["`O(n) × O(n) = O(n²)`", "`O(n²) / O(n) = O(n)`", "`Θ(n) × Θ(n) = Θ(n²)`", "`O(n) − O(n) = 0`"],
            reponse: [0, 2],
            explication: ["Diviser ou soustraire des `O` n'a pas de sens : `O(n²) / O(n)` peut valoir `1/n` (prendre `1` sur `n`), et `O(n) − O(n)` peut valoir `n`."]
          },
          {
            type: "champs", niveau: 4,
            titre: "Développer ou pas",
            enonce: "Donnez la classe `Θ` de `(n² + 3)(5n + log n)`.",
            champs: [champ("Réponse", "Θ(n³)")],
            explication: ["`n² + 3 = Θ(n²)`, `5n + log n = Θ(n)`, et le produit vaut `Θ(n³)` par (5) pour `Θ`."]
          }
        ]
      },

      /* ---------- Leçon 3.4 ---------- */
      {
        type: "lecon",
        id: "ca-prop-miroir",
        titre: "Miroir et symétrie",
        description: "f = O(g) ⟺ g = Ω(f), Θ = O et Ω, Θ symétrique.",
        cours: [
          {
            titre: "Le miroir : f = O(g) ⟺ g = Ω(f)",
            texte: [
              "Une seule inégalité, lue dans les deux sens : `f ≤ c · g` équivaut à `(1/c) · f ≤ g`."
            ],
            schema: courbes([
              [(n) => 3 * n + 2, "f = 3n + 2", 2],
              [(n) => 5 * n, "5n", 1],
              [(n) => n, "g = n", 1, true]
            ], { xMin: 1, xMax: 8, legende: "`3n + 2 ≤ 5n`, donc `n ≥ (1/5)(3n + 2)`" }),
            demo: {
              enonce: "Montrons que `f = O(g) ⟹ g = Ω(f)`.",
              lignes: [
                ["`f(n) ≤ c · g(n)` pour tout `n ≥ n₀`, avec `c > 0`.", "hypothèse"],
                ["En divisant par `c > 0` : `(1/c) · f(n) ≤ g(n)`.", "le sens est conservé"],
                ["Avec `c' = 1/c > 0` et le même `n₀`, `g = Ω(f)`.", ""],
                ["La réciproque se montre de même, en multipliant par `c`.", ""]
              ]
            }
          },
          {
            titre: "Θ = O et Ω",
            texte: [
              "`f = Θ(g) ⟺ f = O(g)` et `f = Ω(g)` (CM2). Le `n₀` de `Θ` est le plus grand des deux rangs."
            ],
            schema: courbes([
              [(n) => n * n, "n²", 1],
              [(n) => 2 * n * n - 3 * n, "f(n) = 2n² − 3n", 2],
              [(n) => 2 * n * n, "2n²", 1]
            ], { xMax: 8, n0: 3, zone: { entre: [0, 2] }, legende: "`O` dès `n = 1`, `Ω` dès `n = 3` : `Θ` dès `n₀ = 3`" }),
            demo: [
              ["`f(n) ≤ c₂ g(n)` pour `n ≥ n₁`.", "`f = O(g)`"],
              ["`c₁ g(n) ≤ f(n)` pour `n ≥ n₂`.", "`f = Ω(g)`"],
              ["Pour `n ≥ n₀ = max(n₁, n₂)`, `c₁ g(n) ≤ f(n) ≤ c₂ g(n)` : `f = Θ(g)`.", ""],
              ["Réciproquement, chaque moitié de l'encadrement donne `O` et `Ω`.", ""]
            ]
          },
          {
            titre: "Θ est symétrique",
            texte: [
              "`f = Θ(g) ⟺ g = Θ(f)` : on inverse l'encadrement."
            ],
            schema: courbes([
              [(n) => 2 * n * n + n, "f = 2n² + n", 2],
              [(n) => n * n, "g = n²", 1]
            ], { xMax: 6, legende: "`n² ≤ f ≤ 3n²`, donc `(1/3) f ≤ g ≤ f`" }),
            demo: {
              enonce: "Montrons que `f = Θ(g) ⟹ g = Θ(f)`.",
              lignes: [
                ["`c₁ g(n) ≤ f(n) ≤ c₂ g(n)` pour `n ≥ n₀`.", "hypothèse"],
                ["De `f ≤ c₂ g` : `(1/c₂) f(n) ≤ g(n)`.", "on divise par `c₂ > 0`"],
                ["De `c₁ g ≤ f` : `g(n) ≤ (1/c₁) f(n)`.", "on divise par `c₁ > 0`"],
                ["Donc `(1/c₂) f(n) ≤ g(n) ≤ (1/c₁) f(n)` pour `n ≥ n₀` : `g = Θ(f)`.", ""]
              ]
            }
          },
          {
            titre: "Bornes et cas : ne pas confondre",
            texte: [
              "`O`, `Ω`, `Θ` ne désignent pas pire, meilleur et cas moyen (CM2).",
              "Tri par insertion : pour **toute** entrée, `T = O(n²)` et `T = Ω(n)` ; le pire cas est en `Θ(n²)`, le meilleur en `Θ(n)`."
            ],
            schema: courbes([
              [(n) => n * (n - 1) / 2 + n, "pire cas", 2],
              [(n) => n, "meilleur cas", 1]
            ], { xMin: 1, xMax: 12, zone: { entre: [1, 0] }, legende: "Toute exécution est dans la zone : entre `Ω(n)` et `O(n²)`" })
          }
        ],
        problematique: {
          texte: [
            "Vous avez prouvé `10n³ + 5n² + n ≤ 16n³` pour `n ≥ 1`.",
            "Le sujet demande aussi `n³ = Ω(10n³ + 5n² + n)` puis `n³ = Θ(10n³ + 5n² + n)`. Faut-il refaire des preuves ?"
          ]
        },
        exemple: {
          questions: [
            "Quelle constante `c` donne `n³ = Ω(10n³ + 5n² + n)` ?",
            "Quelles constantes donnent `n³ = Θ(10n³ + 5n² + n)` ?"
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["De `10n³ + 5n² + n ≤ 16n³`, on tire `(1/16)(10n³ + 5n² + n) ≤ n³`.", "miroir"],
                ["Donc `n³ = Ω(10n³ + 5n² + n)` avec **`c = 1/16`** et `n₀ = 1`.", ""],
                ["De plus `n³ ≤ 10n³ + 5n² + n` pour `n ≥ 1`.", "terme dominant"],
                ["D'où `(1/16) f(n) ≤ n³ ≤ 1 · f(n)` : `n³ = Θ(f)` avec `c₁ = 1/16`, `c₂ = 1`, `n₀ = 1`.", "Θ = O et Ω"]
              ]
            },
            { remarque: "Aucune nouvelle preuve : le miroir et la symétrie réutilisent les inégalités déjà établies." }
          ]
        },
        exercices: [
          {
            type: "qcm", niveau: 1,
            titre: "Le miroir",
            enonce: "`f(n) = O(g(n))` équivaut à :",
            choix: ["`g(n) = O(f(n))`", "`g(n) = Ω(f(n))`", "`f(n) = Ω(g(n))`", "`f(n) = Θ(g(n))`"],
            reponse: 1
          },
          {
            type: "champs", niveau: 1,
            titre: "Diviser par la constante",
            enonce: "On sait `f(n) ≤ 4 g(n)` pour tout `n ≥ 2`. Pour écrire `g(n) ≥ c · f(n)` :",
            champs: [champ("`c`", 0.25, { tolerance: 0.01, accepte: ["1/4"], affiche: "1/4" }), champ("`n₀`", 2)],
            explication: ["`c = 1/4`, même rang."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Ce que donne un Θ",
            enonce: "On sait `f = Θ(g)`. Cochez ce qu'on peut en déduire.",
            choix: ["`f = O(g)`", "`f = Ω(g)`", "`g = Θ(f)`", "`g = O(f)`", "`f(n) = g(n)` pour `n` assez grand"],
            reponse: [0, 1, 2, 3],
            explication: ["`Θ` donne `O` et `Ω`, il est symétrique, et `g = Θ(f)` donne `g = O(f)`. Mais `2n² = Θ(n²)` sans être égal à `n²`."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Le rang de Θ",
            enonce: "On a prouvé `f = O(n²)` avec `n₀ = 3` et `f = Ω(n²)` avec `n₀ = 7`. Quel rang donne-t-on pour `f = Θ(n²)` ?",
            champs: [champ("`n₀`", 7)],
            explication: ["Les deux inégalités doivent tenir : `max(3, 7) = 7`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Inverser un encadrement",
            enonce: "On sait `2n² ≤ f(n) ≤ 6n²` pour `n ≥ 1`. Pour `c₁ f(n) ≤ n² ≤ c₂ f(n)` :",
            champs: [
              champ("`c₁`", 1 / 6, { tolerance: 0.01, accepte: ["1/6"], affiche: "1/6" }),
              champ("`c₂`", 0.5, { tolerance: 0.01, accepte: ["1/2"], affiche: "1/2" })
            ],
            explication: ["`f ≤ 6n²` donne `(1/6) f ≤ n²` ; `2n² ≤ f` donne `n² ≤ (1/2) f`."]
          },
          {
            type: "qcm", niveau: 3,
            titre: "Le tri par insertion",
            enonce: "`T(n)` est le nombre d'opérations du tri par insertion sur une entrée de taille `n`. Cochez les affirmations **vraies**.",
            choix: [
              "Pour toute entrée, `T(n) = O(n²)`",
              "Pour toute entrée, `T(n) = Ω(n)`",
              "Pour toute entrée, `T(n) = Θ(n²)`",
              "Le pire cas est en `Θ(n²)`"
            ],
            reponse: [0, 1, 3],
            explication: ["Sur un tableau déjà trié, `T(n) = Θ(n)`, qui n'est pas `Θ(n²)`."]
          },
          {
            type: "remettre", niveau: 4,
            titre: "Démontrer la symétrie",
            enonce: "Remettez dans l'ordre la preuve de `f = Θ(g) ⟹ g = Θ(f)`.",
            etapes: [
              "Il existe `c₁, c₂ > 0` et `n₀` tels que `c₁ g(n) ≤ f(n) ≤ c₂ g(n)` pour tout `n ≥ n₀`.",
              "En divisant `f ≤ c₂ g` par `c₂` : `(1/c₂) f(n) ≤ g(n)`.",
              "En divisant `c₁ g ≤ f` par `c₁` : `g(n) ≤ (1/c₁) f(n)`.",
              "Pour tout `n ≥ n₀`, `(1/c₂) f(n) ≤ g(n) ≤ (1/c₁) f(n)`.",
              "Donc `g = Θ(f)`."
            ]
          },
          {
            type: "qcm", niveau: 4,
            titre: "Un enchaînement trompeur",
            enonce: "On sait `f = O(g)` et `g = Ω(h)`. Que peut-on conclure entre `f` et `h` ?",
            choix: ["`f = O(h)`", "`f = Ω(h)`", "`h = O(f)`", "rien en général"],
            reponse: 3,
            explication: ["`f = n², g = n², h = n` vérifie les hypothèses avec `f ≠ O(h)` ; `f = n, g = n², h = n²` les vérifie avec `f ≠ Ω(h)`. La transitivité demande deux relations **de même sens**."]
          }
        ]
      },

      /* ---------- Leçon 3.5 ---------- */
      {
        type: "lecon",
        id: "ca-prop-melanges",
        titre: "Simplifier une expression qui mêle O et Θ",
        description: "Les règles du CM3 : ce qui se regroupe, ce qui ne se regroupe pas.",
        cours: [
          {
            titre: "Même nature : on garde le plus grand",
            texte: [
              "Pour `l < k` (CM3) :",
              [
                "`O(nˡ) + O(nᵏ) = O(nᵏ)` ;",
                "`Θ(nˡ) + Θ(nᵏ) = Θ(nᵏ)`."
              ],
              "Ce sont les propriétés (3) et (4)."
            ],
            schema: courbes([
              [(n) => n * n + n, "n² + n", 2],
              [(n) => n * n, "n²", 1]
            ], { xMax: 10, legende: "Le terme `n` ne change pas la forme" })
          },
          {
            titre: "Un petit O ne change pas un Θ",
            texte: [
              "`O(nˡ) + Θ(nᵏ) = Θ(nᵏ)` pour `l ≤ k` : le terme en `O` est positif et plus petit, il ne peut ni faire baisser la somme, ni changer sa forme."
            ],
            schema: courbes([
              [(n) => n * n, "c₁n²", 1],
              [(n) => 2 * n * n + 3 * n, "Θ(n²) + O(n)", 2],
              [(n) => 5 * n * n, "(c₂ + c)n²", 1]
            ], { xMax: 8, zone: { entre: [0, 2] }, legende: "La somme reste encadrée par deux multiples de `n²`" }),
            demo: [
              ["`h₁ = Θ(nᵏ)` : `c₁nᵏ ≤ h₁ ≤ c₂nᵏ` ; `h₂ = O(nˡ)` : `0 ≤ h₂ ≤ c nˡ ≤ c nᵏ`.", "`l ≤ k`, `n ≥ 1`"],
              ["En sommant : `c₁nᵏ ≤ h₁ + h₂ ≤ (c₂ + c) nᵏ`.", ""],
              ["Donc `h₁ + h₂ = Θ(nᵏ)`.", ""]
            ]
          },
          {
            titre: "Θ(nˡ) + O(nᵏ) : seulement le pire cas",
            texte: [
              "Pour `l < k`, la somme vaut au moins de l'ordre de `nˡ` et au plus de l'ordre de `nᵏ` : aucun `Θ` unique.",
              "On ne peut pas dire mieux que `Θ(nˡ) + O(nᵏ)`, ou, en ne gardant que le pire cas, `O(nᵏ)` (CM3). L'information sur le meilleur cas est perdue."
            ],
            schema: courbes([
              [(n) => n, "Θ(n)", 1],
              [(n) => n * n + n, "Θ(n) + n²", 2]
            ], { xMax: 10, zone: { entre: [0, 1] }, legende: "Selon l'entrée, `Θ(n) + O(n²)` est n'importe où dans la zone" })
          },
          {
            titre: "Coefficients et logarithmes",
            texte: [
              [
                "`3Θ(1) = Θ(1)`, `2Θ(n) = Θ(n)` : propriété (6) ;",
                "`logₐ n = log₂ n / log₂ a` : la base est un facteur constant, on écrit `log n` ;",
                "`log n = O(n)`, donc `Θ(n) + Θ(log n) = Θ(n)`."
              ]
            ],
            schema: courbes([
              [(n) => log2(n), "log₂ n", 2],
              [(n) => Math.log(n), "ln n", 3],
              [(n) => Math.log10(n), "log₁₀ n", 1]
            ], { xMin: 1, xMax: 64, legende: "Trois bases, même forme : `log₂ n = 3,32 · log₁₀ n`" })
          }
        ],
        problematique: {
          texte: [
            "L'analyse ligne par ligne d'un algorithme (CM3) donne `T(n) = Θ(n) + O(n²) + Θ(log n) + O(1)`.",
            "Que peut-on dire de sa complexité ?"
          ]
        },
        exemple: {
          texte: ["Simplifier `T(n) = Θ(n) + O(n²) + Θ(log n) + O(1)` (exemple A du CM3)."],
          questions: [
            "Regrouper les termes de même nature.",
            "Simplifier chaque groupe.",
            "Que peut-on dire au mieux ? Et en ne gardant que le pire cas ?"
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["`T(n) = (Θ(n) + Θ(log n)) + (O(n²) + O(1))`", "regrouper par nature"],
                ["`Θ(n) + Θ(log n) = Θ(n)`", "`log n = O(n)`"],
                ["`O(n²) + O(1) = O(n²)`", "(3), (4)"],
                ["`T(n) = Θ(n) + O(n²)` : un `Θ` et un `O` de classes différentes ne fusionnent pas.", "on ne peut pas dire mieux"],
                ["En ne gardant que le pire cas : **`T(n) = O(n²)`**.", "perte d'information sur le meilleur cas"]
              ]
            }
          ]
        },
        exercices: [
          {
            type: "champs", niveau: 1,
            titre: "Deux O",
            enonce: "Simplifiez `O(n) + O(n²)`.",
            champs: [champ("Réponse", "O(n²)")]
          },
          {
            type: "champs", niveau: 1,
            titre: "Deux Θ",
            enonce: "Simplifiez `Θ(n) + Θ(n²)`.",
            champs: [champ("Réponse", "Θ(n²)")]
          },
          {
            type: "champs", niveau: 2,
            titre: "Un O et un Θ plus grand",
            enonce: "Simplifiez `O(n) + Θ(n²)`.",
            champs: [champ("Réponse", "Θ(n²)")],
            explication: ["Le terme en `O(n)` est positif et plus petit : il ne change pas le `Θ`."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Un Θ et un O plus grand",
            enonce: "`T(n) = Θ(n) + O(n²)`. Que peut-on dire ?",
            choix: [
              "`T(n) = Θ(n²)`",
              "`T(n) = Θ(n)`",
              "on ne peut pas faire un seul `Θ` ; au pire cas, `T(n) = O(n²)`",
              "`T(n) = O(n)`"
            ],
            reponse: 2,
            explication: ["Selon l'entrée, `T` peut être de l'ordre de `n` ou de `n²` (CM3)."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Le tri par sélection (CM3)",
            enonce: "Simplifiez `T(n) = 3Θ(1) + 3Θ(n) + 2Θ(n²) + O(n²) + 3O(n)`.",
            champs: [champ("Réponse", "Θ(n²)")],
            explication: ["`= Θ(1) + Θ(n) + Θ(n²) + O(n²) + O(n) = Θ(n²) + O(n²) = Θ(n²)`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Le tri par insertion (CM3)",
            enonce: "`T(n) = 3Θ(1) + 2Θ(n) + 5O(n²)`.",
            champs: [
              champ("Forme simplifiée exacte", "Θ(n) + O(n²)", { accepte: ["O(n²) + Θ(n)", "O(n^2)+theta(n)", "theta(n)+O(n^2)"] }),
              champ("En ne gardant que le pire cas", "O(n²)")
            ],
            explication: ["`Θ(1) + Θ(n) + O(n²) = Θ(n) + O(n²)`, et au pire cas `O(n²)`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Avec n log n",
            enonce: "Simplifiez `Θ(n log n) + O(n) + Θ(n)`.",
            champs: [champ("Réponse", "Θ(n log n)")],
            explication: ["`Θ(n log n) + Θ(n) = Θ(n log n)`, et le `O(n)` est plus petit."]
          },
          {
            type: "qcm", niveau: 3,
            titre: "La base du logarithme",
            enonce: "`Θ(log₂ n)` et `Θ(log₁₀ n)` :",
            choix: ["sont la même classe", "diffèrent : `log₂` croît plus vite", "diffèrent : `log₁₀` croît plus vite", "ne se comparent pas"],
            reponse: 0,
            explication: ["`log₂ n = log₂ 10 · log₁₀ n ≈ 3,32 · log₁₀ n` : facteur constant, propriété (6)."]
          },
          {
            type: "champs", niveau: 4,
            titre: "Une expression complète",
            enonce: "`T(n) = Θ(n²) + O(n³) + Θ(n log n) + O(1)`.",
            champs: [
              champ("Forme simplifiée exacte", "Θ(n²) + O(n³)", { accepte: ["O(n³) + Θ(n²)", "O(n^3)+theta(n^2)", "theta(n^2)+O(n^3)"] }),
              champ("En ne gardant que le pire cas", "O(n³)")
            ],
            explication: ["Les `Θ` : `Θ(n²) + Θ(n log n) = Θ(n²)`. Les `O` : `O(n³) + O(1) = O(n³)`."]
          },
          {
            type: "champs", niveau: 4,
            titre: "Même ordre",
            enonce: "Simplifiez `Θ(n) + O(n)`.",
            champs: [champ("Réponse", "Θ(n)")],
            explication: ["`c₁n ≤ Θ(n) + O(n) ≤ (c₂ + c) n` : le `O` de même ordre ne change rien."]
          }
        ]
      }
    ]
  });
})();
