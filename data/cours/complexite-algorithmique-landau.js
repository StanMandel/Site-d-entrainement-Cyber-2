/* =============================================================
   Complexité algorithmique — chapitre 2 : notations O, Ω, Θ (CM2)
   Complète CONTENU["complexite-algorithmique"] (voir l'en-tête de
   complexite-algorithmique.js).
   ============================================================= */

(() => {
  const { champ, courbes, log2 } = window.OutilsComplexite;

  CONTENU["complexite-algorithmique"].chapitres.push({
    id: "ch2",
    titre: "Chapitre 2 — Notations de Landau (O, Ω, Θ)",
    description: "Prouver une borne, la réfuter par l'absurde, encadrer, comparer les classes.",
    exercices: [

      /* ---------- Leçon 2.1 ---------- */
      {
        type: "lecon",
        id: "ca-grand-o",
        titre: "La notation O",
        description: "Borne supérieure : trouver c et n₀, rédiger la preuve pas à pas.",
        cours: [
          {
            titre: "Ce qui compte : la forme de la croissance",
            texte: [
              "`10n` et `1000n` sont tous deux **linéaires** : le temps double quand `n` double. La constante dépend de la machine, pas de l'algorithme.",
              "Les notations de Landau ne gardent que la **forme** : au-delà d'un certain `n`, `n²` dépasse toujours `100n`."
            ],
            schema: courbes([
              [(n) => 100 * n, "100n", 1],
              [(n) => n * n, "n²", 2]
            ], { xMax: 160, n0: 100, legende: "`n²` passe au-dessus de `100n` dès `n = 100`" })
          },
          {
            titre: "La définition",
            texte: [
              "`f(n) = O(g(n))` s'il existe une constante `c > 0` et un rang `n₀` tels que :",
              "pour tout `n ≥ n₀`, `0 ≤ f(n) ≤ c · g(n)`.",
              [
                "`c` : le facteur qu'on s'autorise devant `g` ;",
                "`n₀` : à partir de là, l'inégalité doit **toujours** être vraie."
              ]
            ],
            schema: courbes([
              [(n) => 2 * n + 6, "f(n) = 2n + 6", 2],
              [(n) => 3 * n, "c·g(n) = 3n", 1]
            ], { xMax: 12, n0: 6, zone: { dessous: 1 }, legende: "Avec `c = 3`, `f` reste sous `3n` à partir de `n₀ = 6`" }),
            redaction: ["Pour `f(n) = 3n` et `g(n) = n` (CM2) : avec `n₀ = 1` et `c = 3`, on a `0 ≤ 3n ≤ c · n` pour tout `n ≥ n₀`. Donc `f(n) = O(n)`."]
          },
          {
            titre: "La preuve pas à pas (CM2)",
            texte: [
              "Méthode en trois temps :",
              [
                "écrire l'inégalité visée `f(n) ≤ c · g(n)` ;",
                "majorer **chaque terme** par un multiple de `g(n)`, pour `n ≥ 1` ;",
                "additionner, puis nommer `c` et `n₀`."
              ]
            ],
            schema: courbes([
              [(n) => 2 * n * n + 5 * n + 7, "2n² + 5n + 7", 2],
              [(n) => 14 * n * n, "14n²", 1]
            ], { xMin: 0, xMax: 4, n0: 1, zone: { dessous: 1 }, legende: "`f(n) ≤ 14n²` dès `n = 1`" }),
            demo: {
              enonce: "Montrons que `2n² + 5n + 7 = O(n²)`.",
              lignes: [
                ["Il s'agit de trouver `c > 0` et `n₀` tels que `2n² + 5n + 7 ≤ c · n²` pour tout `n ≥ n₀`.", "le but"],
                ["Soit un entier `n ≥ 1`.", "on fixe n"],
                ["`7 ≤ 7n²`", "car `1 ≤ n²`"],
                ["`5n ≤ 5n²`", "car `n ≤ n²`"],
                ["`2n² ≤ 2n²`", "terme dominant"],
                ["En sommant : `2n² + 5n + 7 ≤ 14n²`.", "inégalités de même sens"],
                ["Avec `c = 14` et `n₀ = 1`, par définition `2n² + 5n + 7 = O(n²)`.", "conclusion"]
              ]
            }
          },
          {
            titre: "Avec un logarithme (CM2)",
            texte: [
              "Même méthode : il suffit de savoir majorer `log₂ n`.",
              "Pour `n ≥ 1`, `log₂ n ≤ n`."
            ],
            schema: courbes([
              [(n) => 4 * n + 9 * log2(n), "4n + 9 log₂ n", 2],
              [(n) => 13 * n, "13n", 1]
            ], { xMin: 1, xMax: 10, n0: 1, legende: "`4n + 9 log₂ n ≤ 13n` pour `n ≥ 1`" }),
            demo: {
              enonce: "Montrons que `4n + 9 log₂ n = O(n)`.",
              lignes: [
                ["Soit un entier `n ≥ 1`.", ""],
                ["`9 log₂ n ≤ 9n`", "car `log₂ n ≤ n`"],
                ["`4n ≤ 4n`", ""],
                ["En sommant : `4n + 9 log₂ n ≤ 13n`.", ""],
                ["Avec `c = 13` et `n₀ = 1`, `4n + 9 log₂ n = O(n)`.", ""]
              ]
            }
          }
        ],
        problematique: {
          texte: [
            "Un algorithme effectue `f(n) = 3n² + 10n + 50` opérations.",
            "Peut-on garantir qu'il ne dépasse pas `4n²` pour les grandes entrées ? À partir de quelle taille ?"
          ],
          schema: courbes([
            [(n) => 3 * n * n + 10 * n + 50, "f(n)", 2],
            [(n) => 4 * n * n, "4n²", 1]
          ], { xMax: 20, legende: "Les deux courbes se croisent entre 13 et 14" })
        },
        exemple: {
          texte: ["On veut prouver `f(n) = 3n² + 10n + 50 = O(n²)`."],
          questions: [
            "Avec `n₀ = 1`, quelle constante `c` obtient-on en majorant terme à terme ?",
            "Avec `c = 4`, quel est le plus petit `n₀` possible ?"
          ]
        },
        correction: {
          texte: [
            { titre: "1. Avec n₀ = 1" },
            {
              demo: [
                ["Soit `n ≥ 1`.", ""],
                ["`10n ≤ 10n²` et `50 ≤ 50n²`.", "car `1 ≤ n ≤ n²`"],
                ["Donc `f(n) ≤ (3 + 10 + 50) n² = 63n²`.", ""],
                ["**`c = 63`** et `n₀ = 1` conviennent.", ""]
              ]
            },
            { titre: "2. Avec c = 4" },
            {
              demo: [
                ["`3n² + 10n + 50 ≤ 4n² ⟺ n² − 10n − 50 ≥ 0`.", "au brouillon"],
                ["Les racines sont `5 ± √75`, soit environ `−3,66` et `13,66`.", ""],
                ["L'inégalité est vraie pour tout `n ≥ 14`.", "au-delà de la racine positive"],
                ["Contrôle : `f(13) = 687 > 676 = 4 × 13²`, mais `f(14) = 778 ≤ 784 = 4 × 14²`.", ""],
                ["Le plus petit rang est **`n₀ = 14`**.", ""]
              ]
            },
            { remarque: "Un `c` plus grand permet un `n₀` plus petit : il suffit d'**un** couple `(c, n₀)`." }
          ]
        },
        exercices: [
          {
            type: "champs", niveau: 1,
            titre: "Trouver c",
            enonce: "Pour `3n² + 2n + 1 = O(n²)`, en majorant chaque terme par un multiple de `n²` (pour `n ≥ 1`), quelle constante `c` obtient-on ?",
            champs: [champ("`c`", 6)],
            indice: "`1 ≤ n²` et `2n ≤ 2n²`.",
            explication: ["`3n² + 2n + 1 ≤ (3 + 2 + 1) n² = 6n²`. Tout `c ≥ 6` convient aussi."]
          },
          {
            type: "qcm", niveau: 1,
            titre: "La définition",
            enonce: "`f(n) = O(g(n))` signifie :",
            choix: [
              "`∃c > 0, ∃n₀, ∀n ≥ n₀ : f(n) ≤ c · g(n)`",
              "`∀c > 0, ∃n₀, ∀n ≥ n₀ : f(n) ≤ c · g(n)`",
              "`∃n₀, ∀n ≥ n₀ : f(n) ≤ g(n)`",
              "`∃c > 0, ∃n₀, ∀n ≥ n₀ : f(n) ≥ c · g(n)`"
            ],
            reponse: 0,
            explication: ["Il suffit d'**une** constante et d'**un** rang. La dernière ligne est la définition de `Ω`."]
          },
          {
            type: "champs", niveau: 1,
            titre: "Un polynôme de degré 1",
            enonce: "Pour `5n + 3 = O(n)` avec `n₀ = 1`, quelle constante `c` obtient-on en majorant terme à terme ?",
            champs: [champ("`c`", 8)],
            explication: ["`3 ≤ 3n` pour `n ≥ 1`, donc `5n + 3 ≤ 8n`."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Trouver n₀",
            enonce: "On veut `7n + 20 ≤ 8n`. À partir de quel `n₀` est-ce vrai ?",
            champs: [champ("`n₀`", 20)],
            indice: "Isolez `n`.",
            explication: ["`7n + 20 ≤ 8n ⟺ 20 ≤ n`. Donc `n₀ = 20` avec `c = 8`."]
          },
          {
            type: "remettre", niveau: 2,
            titre: "Rédiger une preuve de O",
            enonce: "Remettez dans l'ordre la preuve de `2n² + 5n + 7 = O(n²)`.",
            etapes: [
              "Il s'agit de trouver `c > 0` et `n₀` tels que `2n² + 5n + 7 ≤ c · n²` pour tout `n ≥ n₀`.",
              "Soit un entier `n ≥ 1`.",
              "On a `7 ≤ 7n²`, `5n ≤ 5n²` et `2n² ≤ 2n²`.",
              "En sommant : `2n² + 5n + 7 ≤ 14n²`.",
              "Avec `c = 14` et `n₀ = 1`, par définition `2n² + 5n + 7 = O(n²)`."
            ],
            explication: ["But, `n` fixé, majorations, somme, conclusion."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Avec un logarithme",
            enonce: "Pour `6n + 4 log₂ n + 10 = O(n)` avec `n₀ = 1`, quelle constante `c` obtient-on en majorant terme à terme ?",
            champs: [champ("`c`", 20)],
            indice: "`log₂ n ≤ n` et `1 ≤ n`.",
            explication: ["`4 log₂ n ≤ 4n` et `10 ≤ 10n`, donc `6n + 4 log₂ n + 10 ≤ 20n`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Un rang plus loin",
            enonce: "À partir de quel `n₀` a-t-on `n² + 100n ≤ 2n²` ?",
            champs: [champ("`n₀`", 100)],
            explication: ["`n² + 100n ≤ 2n² ⟺ 100n ≤ n² ⟺ 100 ≤ n` (on divise par `n > 0`)."]
          },
          {
            type: "champs", niveau: 4,
            titre: "Une exponentielle décalée",
            enonce: "Montrez que `2ⁿ⁺³ = O(2ⁿ)`. Quelle est la plus petite constante `c` ?",
            champs: [champ("`c`", 8)],
            indice: "`2ⁿ⁺³ = 2³ × 2ⁿ`.",
            explication: ["`2ⁿ⁺³ = 8 × 2ⁿ` : `c = 8` et `n₀ = 0`. Décaler l'exposant ne change pas la classe ; le **multiplier** si : `4ⁿ = 2²ⁿ` n'est pas en `O(2ⁿ)`."]
          },
          {
            type: "champs", niveau: 4,
            titre: "n log n",
            enonce: "Pour `n log₂ n + 5n = O(n log₂ n)` avec `n₀ = 2`, quelle constante `c` obtient-on ?",
            champs: [champ("`c`", 6)],
            indice: "Pour `n ≥ 2`, `log₂ n ≥ 1`, donc `n ≤ n log₂ n`.",
            explication: ["`5n ≤ 5n log₂ n` pour `n ≥ 2`, d'où `c = 6`. Avec `n₀ = 1`, impossible : `log₂ 1 = 0` et `5 ≤ 0` est faux."]
          }
        ]
      },

      /* ---------- Leçon 2.2 ---------- */
      {
        type: "lecon",
        id: "ca-absurde",
        titre: "Montrer qu'une borne est fausse",
        description: "f ≠ O(g) : raisonnement par l'absurde et n explicite.",
        cours: [
          {
            titre: "Nier la définition",
            texte: [
              "`f ≠ O(g)` : **aucune** constante ne marche. Pour tout `c` et tout `n₀`, il existe un `n ≥ n₀` avec `f(n) > c · g(n)`.",
              "Quel que soit `c`, `n³` finit par passer au-dessus de `c · n²`."
            ],
            schema: courbes([
              [(n) => n ** 3, "n³", 2],
              [(n) => 5 * n * n, "5n²", 1],
              [(n) => 10 * n * n, "10n²", 1, true]
            ], { xMax: 13, yMax: 1800, legende: "`n³` dépasse `5n²` après 5, `10n²` après 10…" })
          },
          {
            titre: "La preuve par l'absurde (CM2)",
            texte: [
              "On ne peut pas essayer tous les `c` : on **suppose** qu'un couple `(c, n₀)` existe et on aboutit à une contradiction."
            ],
            schema: courbes([
              [(n) => n, "n", 2],
              [() => 8, "c = 8", 1]
            ], { xMax: 14, yMax: 14, legende: "Après division : `n ≤ c` pour tout `n ≥ n₀` est impossible" }),
            demo: {
              enonce: "Montrons que `n³ ≠ O(n²)`.",
              lignes: [
                ["Supposons par l'absurde qu'il existe `c > 0` et `n₀ ≥ 1` tels que `n³ ≤ c · n²` pour tout `n ≥ n₀`.", "hypothèse"],
                ["En divisant par `n² > 0` : `n ≤ c` pour tout `n ≥ n₀`.", "valide car `n ≥ n₀ ≥ 1`"],
                ["Or `n` peut être choisi arbitrairement grand alors que `c` est fixée.", ""],
                ["Contradiction : il n'existe pas de tel couple. Donc `n³ ≠ O(n²)`.", "conclusion"]
              ]
            }
          },
          {
            titre: "Exhiber un n explicite",
            texte: [
              "« `n` assez grand » ne suffit pas en copie : donnez un `n` précis, en fonction de `c` et `n₀`.",
              "La formule type : `n = max(n₀, ⌊c⌋ + 1)`."
            ],
            schema: courbes([
              [(n) => n * n, "n²", 2],
              [(n) => 4 * n, "c·n = 4n", 1]
            ], { xMax: 8, n0: 5, n0Texte: "⌊c⌋ + 1", legende: "Avec `c = 4`, `n = 5` contredit `n² ≤ 4n`" }),
            demo: {
              enonce: "Montrons que `n² ≠ O(n)`.",
              lignes: [
                ["Supposons qu'il existe `c > 0` et `n₀ ≥ 1` tels que `n² ≤ c · n` pour tout `n ≥ n₀`.", ""],
                ["En divisant par `n > 0` : `n ≤ c` pour tout `n ≥ n₀`.", ""],
                ["Posons `n = max(n₀, ⌊c⌋ + 1)`. Alors `n ≥ n₀`, donc `n ≤ c`.", "le n explicite"],
                ["Mais `n ≥ ⌊c⌋ + 1 > c`.", ""],
                ["Contradiction. Donc `n² ≠ O(n)`.", ""]
              ]
            }
          },
          {
            titre: "Exponentielles : 4ⁿ ≠ O(2ⁿ)",
            texte: [
              "`2ⁿ⁺³ = 8 × 2ⁿ` reste en `O(2ⁿ)`, mais `4ⁿ = 2ⁿ × 2ⁿ` non : le facteur `2ⁿ` n'est pas une constante."
            ],
            schema: courbes([
              [(n) => 4 ** n, "4ⁿ", 2],
              [(n) => 8 * 2 ** n, "8·2ⁿ", 1]
            ], { xMax: 6, yMax: 600, legende: "`4ⁿ` dépasse `8 · 2ⁿ` dès `n = 4`" }),
            demo: [
              ["Supposons `4ⁿ ≤ c · 2ⁿ` pour tout `n ≥ n₀`.", ""],
              ["En divisant par `2ⁿ > 0` : `2ⁿ ≤ c` pour tout `n ≥ n₀`.", "`4ⁿ = 2ⁿ × 2ⁿ`"],
              ["Pour `n = max(n₀, ⌈log₂ c⌉ + 1)`, `2ⁿ > c` : contradiction.", ""],
              ["Donc `4ⁿ ≠ O(2ⁿ)`.", ""]
            ]
          }
        ],
        problematique: {
          texte: [
            "Un camarade affirme que son algorithme en `3n² + n` opérations est « en `O(n)`, puisque jusqu'à `n = 30` il fait moins de `100n` opérations ».",
            "Comment le contredire rigoureusement ?"
          ]
        },
        exemple: {
          texte: ["Montrer que `3n² + n ≠ O(n)`."],
          questions: [
            "Écrire l'hypothèse de l'absurde.",
            "La simplifier en divisant par `n`.",
            "Choisir un `n` explicite qui la contredit et conclure."
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["Supposons qu'il existe `c > 0` et `n₀ ≥ 1` tels que `3n² + n ≤ c · n` pour tout `n ≥ n₀`.", "hypothèse"],
                ["En divisant par `n > 0` : `3n + 1 ≤ c` pour tout `n ≥ n₀`.", ""],
                ["Posons `n = max(n₀, ⌊c⌋ + 1)`. Alors `n ≥ n₀` et `n > c`.", "n explicite"],
                ["Donc `3n + 1 > 3c + 1 > c`, ce qui contredit `3n + 1 ≤ c`.", ""],
                ["L'hypothèse est fausse : `3n² + n ≠ O(n)`.", "conclusion"]
              ]
            },
            { remarque: "Que l'inégalité tienne jusqu'à `n = 30` ne prouve rien : la définition exige **tous** les `n ≥ n₀`." }
          ]
        },
        exercices: [
          {
            type: "champs", niveau: 1,
            titre: "Le premier n qui contredit",
            enonce: "On prétend que `n² ≤ 100n` pour tout `n ≥ 10`. Quel est le plus petit `n ≥ 10` qui contredit cette affirmation ?",
            champs: [champ("`n`", 101)],
            indice: "Divisez par `n`.",
            explication: ["`n² ≤ 100n ⟺ n ≤ 100`. Le premier entier qui la viole est **101** : c'est le `⌊c⌋ + 1` de la preuve type."]
          },
          {
            type: "qcm", niveau: 1,
            titre: "La négation",
            enonce: "`f ≠ O(g)` signifie :",
            choix: [
              "`∀c > 0, ∀n₀, ∃n ≥ n₀ : f(n) > c · g(n)`",
              "`∃c > 0, ∃n₀, ∀n ≥ n₀ : f(n) > c · g(n)`",
              "`∀c > 0, ∃n₀, ∀n ≥ n₀ : f(n) > c · g(n)`",
              "`f(n) > g(n)` pour un certain `n`"
            ],
            reponse: 0,
            explication: ["On nie « il existe `c` et `n₀` tels que pour tout `n` » : « pour tout `c` et tout `n₀`, il existe `n` »."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Contredire 4ⁿ ≤ 8·2ⁿ",
            enonce: "On suppose `4ⁿ ≤ 8 · 2ⁿ` pour tout `n ≥ 0`. Quel est le plus petit `n` qui contredit cette hypothèse ?",
            champs: [champ("`n`", 4)],
            indice: "Divisez par `2ⁿ`.",
            explication: ["L'hypothèse devient `2ⁿ ≤ 8`, soit `n ≤ 3`. Pour **`n = 4`** : `256 > 128`."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Vrai ou faux",
            enonce: "Cochez les égalités **vraies**.",
            choix: ["`n = O(n²)`", "`n² = O(n)`", "`2ⁿ⁺¹ = O(2ⁿ)`", "`3ⁿ = O(2ⁿ)`", "`log₂(n²) = O(log₂ n)`"],
            reponse: [0, 2, 4],
            explication: [[
              "`n ≤ n²` pour `n ≥ 1` ;",
              "`2ⁿ⁺¹ = 2 · 2ⁿ` ;",
              "`log₂(n²) = 2 log₂ n` ;",
              "`3ⁿ / 2ⁿ = 1,5ⁿ` n'est pas borné, et `n² / n = n` non plus."
            ]]
          },
          {
            type: "remettre", niveau: 3,
            titre: "Rédiger n³ ≠ O(n²)",
            enonce: "Remettez la preuve dans l'ordre.",
            etapes: [
              "Supposons qu'il existe `c > 0` et `n₀ ≥ 1` tels que `n³ ≤ c · n²` pour tout `n ≥ n₀`.",
              "En divisant par `n² > 0`, on obtient `n ≤ c` pour tout `n ≥ n₀`.",
              "Posons `n = max(n₀, ⌊c⌋ + 1)` : alors `n ≥ n₀` et `n > c`.",
              "Contradiction avec `n ≤ c`.",
              "Donc `n³ ≠ O(n²)`."
            ]
          },
          {
            type: "champs", niveau: 3,
            titre: "Le n explicite",
            enonce: "Dans la preuve de `n³ ≠ O(n²)`, l'hypothèse donne `c = 7,5` et `n₀ = 3`. Quel `n` la formule `max(n₀, ⌊c⌋ + 1)` fournit-elle ?",
            champs: [champ("`n`", 8)],
            explication: ["`⌊7,5⌋ + 1 = 8` et `max(3, 8) = 8`. Contrôle : `8³ = 512 > 7,5 × 64 = 480`."]
          },
          {
            type: "champs", niveau: 4,
            titre: "n log n n'est pas linéaire",
            enonce: "On suppose `n log₂ n ≤ 5n` pour tout `n ≥ 1`. Quel est le plus petit `n` qui contredit cette hypothèse ?",
            champs: [champ("`n`", 33)],
            indice: "Divisez par `n` : `log₂ n ≤ 5`.",
            explication: ["`log₂ n ≤ 5 ⟺ n ≤ 32`. Le premier entier qui la viole est **33** : `n log₂ n ≠ O(n)`."]
          },
          {
            type: "qcm", niveau: 4,
            titre: "Racine et logarithme",
            enonce: "Cochez les égalités **vraies**.",
            choix: ["`log₂ n = O(√n)`", "`√n = O(log₂ n)`", "`√n = O(n)`", "`n = O(√n)`"],
            reponse: [0, 2],
            explication: ["Sur l'échelle des croissances : `log n < √n < n`. Une classe plus lente est en `O` d'une plus rapide, jamais l'inverse."]
          }
        ]
      },

      /* ---------- Leçon 2.3 ---------- */
      {
        type: "lecon",
        id: "ca-omega",
        titre: "La notation Ω",
        description: "Borne inférieure : minorer, le miroir de O, le terme négatif.",
        cours: [
          {
            titre: "Le plancher",
            texte: [
              "`f(n) = Ω(g(n))` s'il existe `c > 0` et `n₀` tels que, pour tout `n ≥ n₀`, `0 ≤ c · g(n) ≤ f(n)`.",
              "Là où `O` promet « pas plus que », `Ω` promet « **au moins** »."
            ],
            schema: courbes([
              [(n) => n * n - 6 * n + 12, "f(n)", 2],
              [(n) => n * n / 2, "c·g(n) = n²/2", 1]
            ], { xMax: 14, yMax: 130, n0: 10, zone: { dessus: 1 }, legende: "`f` reste au-dessus de `n²/2` à partir de `n₀ = 10`" })
          },
          {
            titre: "Minorer : jeter des termes positifs",
            texte: [
              "Tous les termes sont positifs : en jeter fait **baisser** la somme, ce qui donne un minorant."
            ],
            schema: courbes([
              [(n) => 10 * n ** 3 + 5 * n * n + n, "10n³ + 5n² + n", 2],
              [(n) => n ** 3, "n³", 1]
            ], { xMax: 5, n0: 1, zone: { dessus: 1 }, legende: "La somme reste au-dessus de `n³`" }),
            demo: {
              enonce: "Montrons que `10n³ + 5n² + n = Ω(n³)` (CM2).",
              lignes: [
                ["Soit un entier `n ≥ 1`.", ""],
                ["`n³ ≤ 10n³ + 5n² + n`", "on jette des termes positifs"],
                ["Avec `n₀ = 1` et `c = 1`, `c · n³ ≤ 10n³ + 5n² + n` pour tout `n ≥ n₀`.", ""],
                ["Donc `10n³ + 5n² + n = Ω(n³)`.", ""]
              ]
            }
          },
          {
            titre: "Le miroir de O",
            texte: [
              "`f(n) = O(g(n)) ⟺ g(n) = Ω(f(n))` : dire que `f` est dominée par `g`, c'est dire que `g` domine `f`.",
              "On divise simplement par la constante."
            ],
            schema: courbes([
              [(n) => n ** 3, "n³", 2],
              [(n) => (10 * n ** 3 + 5 * n * n + n) / 16, "(10n³ + 5n² + n)/16", 1]
            ], { xMax: 5, n0: 1, legende: "`n³` reste au-dessus de `(1/16) · f(n)`" }),
            demo: {
              enonce: "Montrons que `n³ = Ω(10n³ + 5n² + n)` (CM2).",
              lignes: [
                ["Soit `n ≥ 1` : `10n³ ≤ 10n³`, `5n² ≤ 5n³`, `n ≤ n³`.", ""],
                ["En sommant : `10n³ + 5n² + n ≤ 16n³`.", "c'est la preuve du O"],
                ["En divisant par 16 : `(1/16)(10n³ + 5n² + n) ≤ n³`.", ""],
                ["Avec `n₀ = 1` et `c = 1/16`, `n³ = Ω(10n³ + 5n² + n)`.", ""]
              ]
            }
          },
          {
            titre: "Un terme négatif impose un n₀",
            texte: [
              "Un terme négatif ne peut pas être jeté pour minorer : il faut l'**absorber** dans le terme dominant, ce qui demande un `n₀ > 1`."
            ],
            schema: courbes([
              [(n) => 3 * n * n - 5 * n, "3n² − 5n", 2],
              [(n) => n * n, "n²", 1]
            ], { xMax: 6, yMin: 0, n0: 3, legende: "`3n² − 5n ≥ n²` à partir de `n = 3`" }),
            demo: {
              enonce: "Montrons que `3n² − 5n = Ω(n²)`.",
              lignes: [
                ["Au brouillon : `3n² − 5n ≥ n² ⟺ 2n² ≥ 5n ⟺ n ≥ 2,5`.", "on cherche n₀"],
                ["Soit `n ≥ 3`. Alors `2n ≥ 6 > 5`, donc `2n² ≥ 5n`.", "rédaction dans le sens direct"],
                ["Ainsi `3n² − 5n ≥ n²`.", ""],
                ["Avec `c = 1` et `n₀ = 3`, `3n² − 5n = Ω(n²)`.", ""]
              ]
            }
          }
        ],
        problematique: {
          texte: [
            "Une attaque par force brute doit tester les `2ⁿ` clés possibles (CM1). Pour garantir qu'une clé est **sûre**, il ne suffit pas de majorer le coût de l'attaque : il faut le **minorer**.",
            "Comment prouver qu'une fonction est au moins de l'ordre d'une autre ?"
          ]
        },
        exemple: {
          texte: ["On veut montrer `f(n) = 2n² − 3n + 1 = Ω(n²)` avec `c = 1`."],
          questions: [
            "Pour quels `n` a-t-on `f(n) ≥ n²` ?",
            "Quel est le plus petit `n₀` qui convient ?",
            "Rédiger la preuve."
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["`2n² − 3n + 1 ≥ n² ⟺ n² − 3n + 1 ≥ 0`.", "au brouillon"],
                ["Racines `(3 ± √5)/2`, soit environ `0,38` et `2,62` : vrai pour `n ≥ 3`.", ""],
                ["Contrôle : `f(2) = 3 < 4`, mais `f(3) = 10 ≥ 9`.", ""],
                ["Soit `n ≥ 3`. Alors `n − 3 ≥ 0`, donc `n² − 3n = n(n − 3) ≥ 0` et `n² − 3n + 1 ≥ 0`.", "sens direct"],
                ["Donc `f(n) ≥ n²` : avec `c = 1` et **`n₀ = 3`**, `f(n) = Ω(n²)`.", ""]
              ]
            }
          ]
        },
        exercices: [
          {
            type: "champs", niveau: 1,
            titre: "Simplifier un Ω",
            enonce: "Simplifiez `Ω(4n³ + 13n² + 5)`.",
            champs: [champ("Réponse", "Ω(n³)", { accepte: ["omega(n^3)", "Ω(n^3)", "Ω(n3)", "omega(n3)"] })],
            explication: ["`4n³ + 13n² + 5 ≥ 4n³ ≥ n³` : on garde le terme dominant, sans coefficient."]
          },
          {
            type: "champs", niveau: 1,
            titre: "Un minorant direct",
            enonce: "En jetant les termes positifs, quel est le plus grand `c` tel que `3n² + 2n ≥ c · n²` pour tout `n ≥ 1` ?",
            champs: [champ("`c`", 3)],
            explication: ["`3n² + 2n ≥ 3n²`. Pour `c > 3`, l'inégalité finit par être fausse."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Le miroir",
            enonce: "Si `f(n) = O(g(n))`, alors :",
            choix: ["`g(n) = Ω(f(n))`", "`f(n) = Ω(g(n))`", "`g(n) = O(f(n))`", "`f(n) = Θ(g(n))`"],
            reponse: 0,
            explication: ["`f ≤ c · g` donne `(1/c) · f ≤ g`."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Absorber un terme négatif",
            enonce: "À partir de quel `n₀` a-t-on `4n² − 6n ≥ 2n²` ?",
            champs: [champ("`n₀`", 3)],
            explication: ["`4n² − 6n ≥ 2n² ⟺ 2n² ≥ 6n ⟺ n ≥ 3`. Contrôle : `n = 2` donne `4 < 8`, `n = 3` donne `18 ≥ 18`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "La constante du miroir",
            enonce: "Pour `n² = Ω(3n² + 2n + 1)` avec `n₀ = 1`, quelle constante `c` obtient-on en divisant la majoration ?",
            champs: [champ("`c`", 1 / 6, { tolerance: 0.01, accepte: ["1/6"], affiche: "1/6" })],
            indice: "Majorez d'abord `3n² + 2n + 1` par un multiple de `n²`.",
            explication: ["`3n² + 2n + 1 ≤ 6n²`, donc `(1/6)(3n² + 2n + 1) ≤ n²` : **`c = 1/6`**."]
          },
          {
            type: "remettre", niveau: 3,
            titre: "Rédiger le miroir",
            enonce: "Remettez dans l'ordre la preuve de `n³ = Ω(10n³ + 5n² + n)`.",
            etapes: [
              "Soit un entier `n ≥ 1`.",
              "On a `10n³ ≤ 10n³`, `5n² ≤ 5n³` et `n ≤ n³`.",
              "En sommant : `10n³ + 5n² + n ≤ 16n³`.",
              "En divisant par 16 : `(1/16)(10n³ + 5n² + n) ≤ n³`.",
              "Avec `n₀ = 1` et `c = 1/16`, on conclut `n³ = Ω(10n³ + 5n² + n)`."
            ]
          },
          {
            type: "champs", niveau: 4,
            titre: "Un rang plus loin",
            enonce: "À partir de quel `n₀` a-t-on `n² − 10n ≥ n²/2` ?",
            champs: [champ("`n₀`", 20)],
            explication: ["`n² − 10n ≥ n²/2 ⟺ n²/2 ≥ 10n ⟺ n ≥ 20`."]
          },
          {
            type: "qcm", niveau: 4,
            titre: "Ω n'est pas le meilleur cas",
            enonce: "« `f(n) = Ω(n)` » signifie :",
            choix: [
              "au meilleur cas, l'algorithme fait `n` opérations",
              "à partir d'un certain rang, `f(n) ≥ c · n` pour une constante `c > 0`",
              "`f(n) = n` exactement",
              "l'algorithme est linéaire"
            ],
            reponse: 1,
            explication: ["`O`, `Ω` et `Θ` sont des bornes sur des **fonctions**, pas des noms de cas (CM2). On peut parler du `Ω` du pire cas comme du `O` du meilleur cas."]
          }
        ]
      },

      /* ---------- Leçon 2.4 ---------- */
      {
        type: "lecon",
        id: "ca-theta",
        titre: "La notation Θ",
        description: "Encadrer : c₁, c₂ et n₀, ou une preuve de O plus une preuve de Ω.",
        cours: [
          {
            titre: "Encadrer",
            texte: [
              "`f(n) = Θ(g(n))` s'il existe `c₁ > 0`, `c₂ > 0` et `n₀` tels que, pour tout `n ≥ n₀` :",
              "`0 ≤ c₁ · g(n) ≤ f(n) ≤ c₂ · g(n)`.",
              "`f` a **le même comportement** que `g`, à des constantes près : trois nombres à fournir."
            ],
            schema: courbes([
              [(n) => n * n / 2 + 2 * n + 3, "f(n)", 2],
              [(n) => n * n / 2, "c₁·g = n²/2", 1],
              [(n) => n * n, "c₂·g = n²", 1]
            ], { xMax: 10, yMax: 100, n0: 6, zone: { entre: [1, 2] }, legende: "`f` reste dans la bande à partir de `n₀ = 6`" })
          },
          {
            titre: "Θ = une preuve de O et une preuve de Ω",
            texte: [
              "`f = Θ(g) ⟺ f = O(g)` **et** `f = Ω(g)`.",
              "En pratique, on fait deux paragraphes plutôt que de chercher `c₁` et `c₂` en même temps."
            ],
            schema: courbes([
              [(n) => n ** 3, "n³", 1],
              [(n) => 10 * n ** 3 + 5 * n * n + n, "f(n)", 2],
              [(n) => 16 * n ** 3, "16n³", 1]
            ], { xMax: 4, n0: 1, zone: { entre: [0, 2] }, legende: "`n³ ≤ 10n³ + 5n² + n ≤ 16n³`" }),
            demo: {
              enonce: "Montrons que `10n³ + 5n² + n = Θ(n³)` (CM2).",
              lignes: [
                ["**O** : pour `n ≥ 1`, `10n³ + 5n² + n ≤ 16n³`.", "borne sup, `c₂ = 16`"],
                ["**Ω** : pour `n ≥ 1`, `n³ ≤ 10n³ + 5n² + n`.", "borne inf, `c₁ = 1`"],
                ["Donc `10n³ + 5n² + n = Θ(n³)` avec `n₀ = 1`, `c₁ = 1`, `c₂ = 16`.", ""]
              ]
            }
          },
          {
            titre: "Le n₀ final est le plus grand",
            texte: [
              "Les deux inégalités doivent tenir **en même temps** : on prend le maximum des deux rangs."
            ],
            schema: courbes([
              [(n) => n * n, "n²", 1],
              [(n) => 3 * n * n - 5 * n + 4, "f(n)", 2],
              [(n) => 7 * n * n, "7n²", 1]
            ], { xMax: 6, n0: 3, zone: { entre: [0, 2] }, legende: "`f(n) = 3n² − 5n + 4` encadrée à partir de `n₀ = 3`" }),
            demo: {
              enonce: "Montrons que `f(n) = 3n² − 5n + 4 = Θ(n²)`.",
              lignes: [
                ["**Majoration.** Soit `n ≥ 1` : `−5n ≤ 0` et `4 ≤ 4n²`, donc `f(n) ≤ 7n²`.", "rang 1, `c₂ = 7`"],
                ["**Minoration.** Soit `n ≥ 3` : `2n ≥ 6 > 5`, donc `2n² ≥ 5n` et `3n² − 5n ≥ n²`.", "rang 3"],
                ["Comme `4 ≥ 0`, `f(n) ≥ n²`.", "`c₁ = 1`"],
                ["Pour tout `n ≥ n₀ = max(1, 3) = 3`, `n² ≤ f(n) ≤ 7n²`.", "le max des rangs"],
                ["Donc `f(n) = Θ(n²)`.", ""]
              ]
            }
          },
          {
            titre: "Θ ne veut pas dire « cas moyen »",
            texte: [
              "`O`, `Ω` et `Θ` sont des **bornes** ; pire et meilleur cas sont des **fonctions** différentes, chacune avec son `Θ`.",
              "Tri par insertion : le pire cas est en `Θ(n²)`, le meilleur en `Θ(n)`."
            ],
            schema: courbes([
              [(n) => n * (n - 1) / 2, "pire : n(n − 1)/2", 2],
              [(n) => n - 1, "meilleur : n − 1", 1]
            ], { xMin: 1, xMax: 12, legende: "Deux fonctions de `n`, deux classes `Θ`" })
          }
        ],
        problematique: {
          texte: [
            "Dire « mon algorithme est en `O(n³)` » est vrai pour un algorithme linéaire : un `O` n'est qu'un plafond.",
            "Comment annoncer une classe **exacte** ?"
          ]
        },
        exemple: {
          texte: ["On étudie `f(n) = 5n² − 4n + 3`."],
          questions: [
            "Avec `n₀ = 1`, quelle constante `c₂` obtient-on pour la majoration ?",
            "Avec `c₁ = 4`, à partir de quel `n₀` l'inégalité `f(n) ≥ 4n²` est-elle toujours vraie ?",
            "Conclure."
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["Soit `n ≥ 1` : `−4n ≤ 0` et `3 ≤ 3n²`, donc `f(n) ≤ 8n²` : **`c₂ = 8`**.", "majoration"],
                ["`f(n) ≥ 4n² ⟺ n² − 4n + 3 ≥ 0 ⟺ (n − 1)(n − 3) ≥ 0`.", "au brouillon"],
                ["Vrai pour `n = 1`, faux pour `n = 2` (`15 < 16`), vrai pour tout `n ≥ 3`.", "attention au trou"],
                ["Le rang à partir duquel c'est **toujours** vrai est **`n₀ = 3`**.", ""],
                ["Pour tout `n ≥ 3`, `4n² ≤ f(n) ≤ 8n²` : `f(n) = Θ(n²)`.", "conclusion"]
              ]
            },
            { remarque: "Avec `c₁ = 1`, on aurait `n₀ = 1` (`4n² − 4n + 3 > 0` toujours) : le choix de `c₁` déplace `n₀`." }
          ]
        },
        exercices: [
          {
            type: "champs", niveau: 1,
            titre: "La classe Θ",
            enonce: "Donnez la classe `Θ` de `7n² + 3n`.",
            champs: [champ("Réponse", "Θ(n²)")],
            explication: ["`7n² ≤ 7n² + 3n ≤ 10n²` pour `n ≥ 1`."]
          },
          {
            type: "champs", niveau: 1,
            titre: "Encadrer 3n + 4",
            enonce: "Pour `3n + 4 = Θ(n)` avec `n₀ = 1` :",
            champs: [champ("`c₂` (en majorant terme à terme)", 7), champ("`c₁` (en gardant le terme dominant)", 3)],
            explication: ["`4 ≤ 4n` donne `3n + 4 ≤ 7n` ; `3n + 4 ≥ 3n` (CM2 prend `c₁ = 1`, tout `c₁ ≤ 3` convient)."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "Vrai ou faux",
            enonce: "Cochez les égalités **vraies**.",
            choix: ["`n² = Θ(n² + n)`", "`n = Θ(n²)`", "`2n² + 1 = Θ(n²)`", "`n² = Θ(n³)`"],
            reponse: [0, 2],
            explication: ["`n = O(n²)` mais pas `Ω(n²)` ; `n² = O(n³)` mais pas `Ω(n³)` : pas de `Θ`."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Les constantes du CM2",
            enonce: "Pour `10n³ + 5n² + n = Θ(n³)` avec `n₀ = 1` :",
            champs: [champ("`c₂` en majorant terme à terme", 16), champ("plus grand `c₁` en gardant le terme dominant", 10)],
            explication: ["`10 + 5 + 1 = 16` ; `10n³ + 5n² + n ≥ 10n³`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Un terme négatif",
            enonce: "Pour `f(n) = 4n² − 6n + 9` :",
            champs: [champ("`c₂` avec `n₀ = 1`", 13), champ("`n₀` pour `4n² − 6n ≥ 2n²`", 3)],
            explication: ["On jette `−6n` et `9 ≤ 9n²` : `c₂ = 13`. `4n² − 6n ≥ 2n² ⟺ n ≥ 3`."]
          },
          {
            type: "remettre", niveau: 3,
            titre: "Rédiger un Θ",
            enonce: "Remettez dans l'ordre la preuve de `3n² − 5n + 4 = Θ(n²)`.",
            etapes: [
              "Il s'agit de trouver `c₁, c₂ > 0` et `n₀` tels que `c₁n² ≤ f(n) ≤ c₂n²` pour tout `n ≥ n₀`.",
              "Majoration : pour `n ≥ 1`, `−5n ≤ 0` et `4 ≤ 4n²`, donc `f(n) ≤ 7n²`.",
              "Minoration : pour `n ≥ 3`, `2n² ≥ 5n`, donc `f(n) ≥ n²`.",
              "Pour tout `n ≥ 3`, `n² ≤ f(n) ≤ 7n²`.",
              "Avec `c₁ = 1`, `c₂ = 7` et `n₀ = 3`, `f(n) = Θ(n²)`."
            ]
          },
          {
            type: "champs", niveau: 4,
            titre: "Un carré développé",
            enonce: "Pour `f(n) = (n + 3)²` :",
            champs: [champ("`c₂` avec `n₀ = 1` (terme à terme)", 16), champ("plus petit `n₀` pour `c₂ = 2`", 8)],
            indice: "`(n + 3)² = n² + 6n + 9`.",
            explication: ["`n² + 6n + 9 ≤ 16n²` pour `n ≥ 1`. `n² + 6n + 9 ≤ 2n² ⟺ n² − 6n − 9 ≥ 0`, racine `3 + √18 ≈ 7,24` : `n₀ = 8` (`121 ≤ 128`, mais `100 > 98` pour `n = 7`)."]
          },
          {
            type: "qcm", niveau: 4,
            titre: "Une fonction qui oscille",
            enonce: "`f(n) = n` si `n` est pair, `f(n) = n²` si `n` est impair. Cochez les affirmations **vraies**.",
            choix: ["`f(n) = O(n²)`", "`f(n) = Ω(n)`", "`f(n) = Θ(n)`", "`f(n) = Θ(n²)`"],
            reponse: [0, 1],
            explication: ["`n ≤ f(n) ≤ n²` pour `n ≥ 1`. Mais `f` n'est ni bornée par `c · n` (les impairs) ni minorée par `c · n²` (les pairs) : aucun `Θ`."]
          }
        ]
      },

      /* ---------- Leçon 2.5 ---------- */
      {
        type: "lecon",
        id: "ca-classes",
        titre: "Classes usuelles et comparaison",
        description: "L'échelle des classes, prédire un temps, changer de classe plutôt qu'optimiser.",
        cours: [
          {
            titre: "L'échelle des classes (CM2)",
            texte: [
              "De la plus lente à la plus rapide :",
              "`1 < log n < n < n log n < n² < n³ < 2ⁿ < n!`",
              "Une classe plus à gauche est toujours en `O` d'une classe plus à droite."
            ],
            schema: courbes([
              [(n) => log2(n), "log₂ n", 4],
              [(n) => n, "n", 1],
              [(n) => n * log2(n), "n log₂ n", 3],
              [(n) => n * n, "n²", 2],
              [(n) => 2 ** n, "2ⁿ", 2, true]
            ], { xMin: 1, xMax: 10, yMax: 60, legende: "Les classes usuelles pour `n` de 1 à 10" })
          },
          {
            titre: "Le tableau du CM2",
            texte: [
              "À `10⁹` opérations par seconde, pour `n = 50` stations :",
              "Un algorithme exponentiel devient inutilisable bien avant que les autres ne ralentissent."
            ],
            schema: { type: "barres", log: true, legende: "Temps pour `n = 50` (échelle logarithmique)", barres: [
              { nom: "O(log n)", v: 6, texte: "6 ns", style: 4 },
              { nom: "O(n)", v: 50, texte: "50 ns", style: 1 },
              { nom: "O(n log n)", v: 282, texte: "282 ns", style: 3 },
              { nom: "O(n²)", v: 2500, texte: "2,5 µs", style: 2 },
              { nom: "O(2ⁿ)", v: 1.12e15, texte: "13 jours", style: 2 }
            ] }
          },
          {
            titre: "Prédire un temps",
            texte: [
              "Si `T(n) ≈ k · g(n)`, alors `T(n') / T(n) ≈ g(n') / g(n)` : la constante `k` disparaît.",
              [
                "`Θ(n)` : taille × 4 → temps × 4 ;",
                "`Θ(n²)` : taille × 4 → temps × 16 ;",
                "`Θ(2ⁿ)` : taille + 10 → temps × 1024."
              ]
            ],
            schema: { type: "barres", legende: "Facteur de temps quand la taille est multipliée par 4", barres: [
              { nom: "Θ(n)", v: 4, texte: "× 4", style: 1 },
              { nom: "Θ(n log n)", v: 4.8, texte: "× 4,8 (n = 1000)", style: 3 },
              { nom: "Θ(n²)", v: 16, texte: "× 16", style: 2 },
              { nom: "Θ(n³)", v: 64, texte: "× 64", style: 2 }
            ] }
          },
          {
            titre: "Changer de classe vaut mieux qu'optimiser",
            texte: [
              "Un meilleur `O` gagne **à partir d'un certain rang** : c'est le `n₀` de la définition, rendu concret.",
              "Aucune optimisation de constante ne compense un changement de classe (CM2)."
            ],
            schema: courbes([
              [(n) => 100 * n, "A : 100n", 1],
              [(n) => n * n, "B : n²", 2]
            ], { xMax: 150, n0: 100, n0Texte: "seuil 100", legende: "B est plus rapide pour `n < 100`, A ensuite" })
          }
        ],
        problematique: {
          texte: [
            "Deux implémentations : A coûte `100n` opérations, B coûte `n²`.",
            "Laquelle choisir ? Et si B met 1 s pour `n = 2000`, combien pour `n = 8000` ?"
          ]
        },
        exemple: {
          questions: [
            "À partir de quelle taille A est-il strictement plus rapide ?",
            "Combien de temps met B pour `n = 8000` ?"
          ]
        },
        correction: {
          texte: [
            {
              demo: [
                ["Pour `n > 0` : `100n < n² ⟺ 100 < n`.", "seuil"],
                ["A est strictement plus rapide pour tout **`n ≥ 101`** ; égalité en `n = 100`.", ""],
                ["B est en `Θ(n²)` ; de 2000 à 8000, la taille est multipliée par 4.", "prédiction"],
                ["Le temps est multiplié par `4² = 16` : environ **16 s**.", ""]
              ]
            },
            { remarque: "`100n = O(n²)` mais pas l'inverse : un meilleur `O` garantit de gagner, à partir d'un certain rang." }
          ]
        },
        exercices: [
          {
            type: "remettre", niveau: 1,
            titre: "Ranger les classes",
            enonce: "Rangez ces classes de la croissance **la plus lente** à la plus rapide.",
            etapes: ["`log n`", "`√n`", "`n`", "`n log n`", "`n²`", "`2ⁿ`", "`n!`"],
            explication: ["`√n` se place entre `log n` et `n`."]
          },
          {
            type: "champs", niveau: 1,
            titre: "Quadratique",
            enonce: "Un algorithme en `Θ(n²)` traite `n = 1000` en 2 s. Combien de secondes pour `n = 4000` ?",
            champs: [champ("Temps", 32, { unite: "s" })],
            explication: ["`(4000/1000)² = 16`, donc `2 × 16 = 32` s."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Cubique",
            enonce: "Un algorithme en `Θ(n³)` traite `n = 100` en 1 s. Combien de secondes pour `n = 300` ?",
            champs: [champ("Temps", 27, { unite: "s" })],
            explication: ["`3³ = 27`."]
          },
          {
            type: "champs", niveau: 2,
            titre: "Exponentiel",
            enonce: "Un algorithme en `Θ(2ⁿ)` traite `n = 30` en 1 s. Combien de secondes pour `n = 40` ?",
            champs: [champ("Temps", 1024, { unite: "s" })],
            explication: ["`2⁴⁰ / 2³⁰ = 2¹⁰ = 1024` s, soit 17 minutes pour 10 éléments de plus."]
          },
          {
            type: "qcm", niveau: 2,
            titre: "n log n",
            enonce: "Pour un algorithme en `Θ(n log n)`, doubler `n` multiplie le temps par :",
            choix: ["exactement 2", "un peu plus de 2", "4", "`log 2`"],
            reponse: 1,
            explication: ["`2n log(2n) / (n log n) = 2 (log n + 1) / log n`, un peu plus de 2."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Le seuil d'une exponentielle",
            enonce: "Quel est le plus petit `n ≥ 2` à partir duquel `2ⁿ > n³` pour de bon ?",
            champs: [champ("`n`", 10)],
            indice: "Comparez `2⁹` et `9³`, puis `2¹⁰` et `10³`.",
            explication: ["`512 < 729` mais `1024 > 1000`. Ensuite `2ⁿ` double à chaque pas alors que `n³` est multiplié par au plus `1,1³ ≈ 1,33`."]
          },
          {
            type: "champs", niveau: 3,
            titre: "Force brute",
            enonce: "Un attaquant teste `10⁹` clés par seconde (CM1). Combien de secondes pour essayer toutes les clés de 40 bits ?",
            champs: [champ("Temps", 1099.5, { unite: "s", tolerance: 0.01 })],
            explication: ["`2⁴⁰ ≈ 1,0995 × 10¹²` clés, soit environ **1100 s** (18 min). Chaque bit de plus double ce temps : 128 bits donnent `10²²` siècles."]
          },
          {
            type: "champs", niveau: 4,
            titre: "Où n log n gagne",
            enonce: "A coûte `1000 · n log₂ n`, B coûte `n²`. Parmi les puissances de 2, quel est le plus petit `n` pour lequel A est strictement plus rapide ?",
            champs: [champ("`n`", 16384)],
            indice: "Il faut `1000 log₂ n < n`.",
            explication: ["`n = 2¹³ = 8192` : `13 000 > 8192`. `n = 2¹⁴ = 16 384` : `14 000 < 16 384`. Malgré la constante 1000, la meilleure classe finit par gagner."]
          }
        ]
      }
    ]
  });
})();
