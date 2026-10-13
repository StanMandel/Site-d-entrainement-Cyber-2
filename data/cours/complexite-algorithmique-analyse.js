/* =============================================================
   Complexité algorithmique — chapitres 4 et 5
     ch. 4 : analyser un algorithme avec O et Θ (CM3) ;
     ch. 5 : aller plus loin (boucles logarithmiques, sommes,
             récurrences, preuves de meilleur et pire cas).
   Complète CONTENU["complexite-algorithmique"].
   ============================================================= */

(() => {
  const { champ, courbes, grille, log2, croissant, decroissant, melange, CLASSES } = window.OutilsComplexite;

  /* ---------------- Codes ---------------- */
  const SOMME_TAB = `int somme(int t[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + t[i];
    }
    return s;
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
  const COMPTE = `int compte(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            c = c + 1;
        }
    }
    return c;
}`;
  const RECULE = `int recule(int t[], int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        int j = i;
        while (j > 0 && t[j] > t[0]) {
            j = j - 1;
            c++;
        }
    }
    return c;
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
  const INSERTION = `void insertionSort(int tab[], int n) {
    int temp = 0;
    int ind = 0;
    for (int i = 1; i < n; i++) {
        ind = i;
        while (ind > 0 && tab[ind - 1] > tab[ind]) {
            temp = tab[ind - 1];
            tab[ind - 1] = tab[ind];
            tab[ind] = temp;
            ind--;
        }
    }
}`;
  const LINEAIRE = `int linearSearch(int tab[], int n, int value) {
    for (int i = 0; i < n; i++) {
        if (tab[i] == value) {
            return i;
        }
    }
    return -1;
}`;
  const DOUBLEMENTS = `int nbDoublements(int n) {
    int k = 0;
    for (int i = 1; i < n; i = i * 2) {
        k = k + 1;
    }
    return k;
}`;
  const ALGO3 = `int algo3(int n) {
    int count = 0;
    while (n >= 1) {
        n = n / 10;
        count++;
    }
    return count;
}`;
  const MIXTE = `int mixte(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 1; j < n; j = j * 2) {
            c = c + 1;
        }
    }
    return c;
}`;
  const RACINE = `int racine(int n) {
    int i = 0;
    while (i * i < n) {
        i = i + 1;
    }
    return i;
}`;
  const PAIRES = `int paires(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            c = c + 1;
        }
    }
    return c;
}`;
  const DIAG = `int diag(int n) {
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
}`;
  const TRIANGLE = `void triangle(int n) {
    if (n == 0) {
        return;
    }
    for (int i = 0; i < n; i++) {
        printf("*");
    }
    printf("\\n");
    triangle(n - 1);
}`;
  const DICHO = `int dicho(int t[], int g, int d, int v) {
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
}`;
  const MOITIES_REC = `int moities(int n) {
    if (n <= 1) {
        return 1;
    }
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + i;
    }
    return s + moities(n / 2);
}`;
  const DOUBLON = `int doublon(int t[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[i] == t[j]) {
                return 1;
            }
        }
    }
    return 0;
}`;
  const ZEROS = `int g(int t[], int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] == 0) {
            for (int j = 0; j < n; j++) {
                c = c + t[j];
            }
        }
    }
    return c;
}`;
  const NEGATIF = `int premierNegatif(int t[], int n) {
    for (int i = 0; i < n; i++) {
        if (t[i] < 0) {
            for (int j = i; j < n; j++) {
                t[j] = 0;
            }
            return i;
        }
    }
    return -1;
}`;

  const triangleN = (n) => n * (n - 1) / 2;
  const impairs = (n) => Array.from({ length: n }, (_, k) => 2 * k + 1);
  const tours2 = (n) => { let k = 0; for (let i = 1; i < n; i *= 2) k++; return k; };

  CONTENU["complexite-algorithmique"].chapitres.push(

    /* =====================================================
       CHAPITRE 4 — ANALYSER AVEC O ET Θ (CM3)
       ===================================================== */
    {
      id: "ch4",
      titre: "Chapitre 4 — Analyser un algorithme avec O et Θ",
      description: "La méthode ligne par ligne du CM3, les deux tris et la recherche linéaire.",
      exercices: [

        /* ---------- Leçon 4.1 ---------- */
        {
          type: "lecon",
          id: "ca-ligne-par-ligne",
          titre: "La méthode ligne par ligne",
          description: "Une classe par ligne, on additionne, on simplifie.",
          cours: [
            {
              titre: "Trois étapes (CM3)",
              texte: [
                [
                  "estimer combien de fois chaque ligne s'exécute, et lui donner une classe : `Θ(1)`, `Θ(n)`, `O(n²)`… ;",
                  "additionner les classes de toutes les lignes ;",
                  "simplifier avec les propriétés."
                ],
                "Le compteur `×k` à droite de chaque ligne fait le travail de l'étape 1 : faites varier `n` et observez qui grandit."
              ],
              animation: {
                code: MAXTAB, tableau: "values", pointeurs: ["indMax", "i"],
                n: { min: 2, max: 8, depart: 6 },
                mesure: [{ ligne: 4, nom: "comparaisons" }, { ligne: 5, nom: "mises à jour" }],
                scenarios: [
                  { nom: "Croissant", entree: (n) => ({ values: croissant(n), size: n }), attendu: (n) => ({ 4: n - 1, 5: n - 1 }) },
                  { nom: "Décroissant", entree: (n) => ({ values: decroissant(n), size: n }), attendu: (n) => ({ 4: n - 1, 5: 0 }) }
                ]
              }
            },
            {
              titre: "Θ ou O pour une ligne ?",
              texte: [
                [
                  "**Θ** si le nombre d'exécutions ne dépend que de `n` : bornes d'un `for`, ligne hors de tout `if` ;",
                  "**O** s'il dépend des **données** : corps d'un `if`, boucle `while` qui s'arrête selon les valeurs."
                ],
                "Dans `maxTab`, seule la ligne 5 varie d'un tableau à l'autre : elle est en `O(n)`."
              ],
              schema: { type: "barres", legende: "Exécutions de chaque ligne de `maxTab` pour `size = 8`", barres: [
                { nom: "l.2  Θ(1)", v: 1, texte: "1", style: 1 },
                { nom: "l.3  Θ(n)", v: 8, texte: "8", style: 1 },
                { nom: "l.4  Θ(n)", v: 7, texte: "7", style: 1 },
                { nom: "l.5  O(n)", v: 7, texte: "de 0 à 7 selon le tableau", style: 2 },
                { nom: "l.8  Θ(1)", v: 1, texte: "1", style: 1 }
              ] }
            },
            {
              titre: "Rédiger",
              texte: ["On écrit la liste des lignes avec leur classe et une justification courte, puis la somme."],
              animation: {
                code: SOMME_TAB, operations: false,
                n: { min: 0, max: 6, depart: 4 },
                mesure: { ligne: 4, nom: "additions" },
                scenarios: [{ nom: "Exécution", entree: (n) => ({ t: croissant(n), n }), attendu: (n) => ({ 4: n }) }]
              },
              demo: {
                enonce: "Complexité de `somme` :",
                lignes: [
                  ["L.2 : `Θ(1)`", "exécutée une fois"],
                  ["L.3 : `Θ(n)`", "toujours `n` tours (et `n + 1` tests)"],
                  ["L.4 : `Θ(n)`", "autant que la boucle"],
                  ["L.6 : `Θ(1)`", "une fois"],
                  ["`T(n) = 2Θ(1) + 2Θ(n) = Θ(n)`.", "propriétés (6), (3), (4)"]
                ]
              }
            }
          ],
          problematique: {
            texte: [
              "Compter exactement `5n + 3` est long et dépend des conventions de comptage.",
              "Quand seule la **classe** compte, comment aller plus vite ?"
            ]
          },
          exemple: {
            codeC: MAXTAB,
            questions: [
              "Donner la classe de chaque ligne.",
              "Écrire `T(n)` comme somme de classes et simplifier.",
              "Le meilleur et le pire cas diffèrent-ils ?"
            ]
          },
          correction: {
            texte: [
              {
                demo: [
                  ["L.2 : `Θ(1)` ; L.8 : `Θ(1)`.", "une fois chacune"],
                  ["L.3 : `Θ(n)` ; L.4 : `Θ(n)`.", "`n − 1` tours, toujours"],
                  ["L.5 : `O(n)`.", "dans le `if` : entre 0 et `n − 1` fois"],
                  ["`T(n) = 2Θ(1) + 2Θ(n) + O(n) = Θ(n) + O(n) = Θ(n)`.", "un `O` de même ordre ne change pas le `Θ`"],
                  ["Meilleur et pire cas sont tous deux en `Θ(n)` : seule la ligne 5 varie, et elle est négligeable.", ""]
                ]
              }
            ]
          },
          exercices: [
            {
              type: "cout", niveau: 1,
              titre: "Une boucle simple",
              enonce: "Donnez la classe de chaque ligne.",
              code: SOMME_TAB,
              choix: CLASSES,
              lignes: { 2: "Θ(1)", 3: "Θ(n)", 4: "Θ(n)", 6: "Θ(1)" },
              explication: ["Aucune ligne ne dépend des valeurs du tableau : que des `Θ`."]
            },
            {
              type: "champs", niveau: 1,
              titre: "La somme",
              enonce: "Simplifiez `T(n) = 2Θ(1) + 2Θ(n)`.",
              champs: [champ("`T(n)`", "Θ(n)")]
            },
            {
              type: "cout", niveau: 2,
              titre: "Le maximum (CM1)",
              enonce: "Donnez la classe de chaque ligne.",
              code: MAXTAB,
              choix: CLASSES,
              lignes: { 2: "Θ(1)", 3: "Θ(n)", 4: "Θ(n)", 5: "O(n)", 8: "Θ(1)" },
              explication: ["La ligne 5 est dans un `if` : son nombre d'exécutions dépend du contenu."]
            },
            {
              type: "qcm", niveau: 2,
              titre: "Pourquoi un O ?",
              enonce: "Pourquoi note-t-on `O(n)`, et non `Θ(n)`, la ligne `indMax = i;` de `maxTab` ?",
              choix: [
                "parce qu'elle est dans une boucle",
                "parce qu'elle peut s'exécuter de 0 à `n − 1` fois selon le tableau",
                "parce qu'une affectation coûte peu",
                "parce que le CM l'impose pour les affectations"
              ],
              reponse: 1,
              explication: ["On ne peut garantir qu'une borne supérieure, atteinte au pire cas (tableau croissant)."]
            },
            {
              type: "cout", niveau: 2,
              titre: "Deux boucles",
              enonce: "Donnez la classe de chaque ligne.",
              code: COMPTE,
              choix: CLASSES,
              lignes: { 2: "Θ(1)", 3: "Θ(n)", 4: "Θ(n²)", 5: "Θ(n²)", 8: "Θ(1)" },
              explication: ["L'en-tête de la boucle interne est testé à chaque tour de l'externe : `n × (n + 1)` fois, soit `Θ(n²)`."]
            },
            {
              type: "lignes", niveau: 3,
              titre: "Les lignes en O",
              enonce: "Cliquez les lignes qu'on note avec un `O` (et non un `Θ`).",
              code: `int f(int t[], int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (t[i] % 2 == 0) {
            c = c + t[i];
        }
        int k = t[i];
        while (k > 0) {
            k = k / 2;
        }
    }
    return c;
}`,
              reponse: [5, 8, 9],
              explication: ["La ligne 5 dépend de la parité des valeurs, les lignes 8 et 9 de leur taille. Le test l.4 et la ligne 7 s'exécutent toujours `n` fois."]
            },
            {
              type: "champs", niveau: 3,
              titre: "La complexité de compte",
              enonce: "Quelle est la complexité de `compte` ?",
              code: COMPTE,
              champs: [champ("`T(n)`", "Θ(n²)")],
              explication: ["`T(n) = 2Θ(1) + Θ(n) + 2Θ(n²) = Θ(n²)`."]
            },
            {
              type: "cout", niveau: 4,
              titre: "Un while qui dépend des valeurs",
              enonce: "Donnez la classe de chaque ligne.",
              code: RECULE,
              choix: CLASSES,
              lignes: { 2: "Θ(1)", 3: "Θ(n)", 4: "Θ(n)", 5: "O(n²)", 6: "O(n²)", 7: "O(n²)", 10: "Θ(1)" },
              explication: [
                "Pour `i` fixé, le `while` fait entre 0 et `i` tours selon les valeurs : `O(n²)` au total, atteint si `t[0]` est le minimum.",
                { animation: { code: RECULE, tableau: "t", pointeurs: ["i", "j"], n: { min: 1, max: 6, depart: 5 }, mesure: { ligne: 6, nom: "tours du while" }, scenarios: [
                  { nom: "t[0] minimum", entree: (n) => ({ t: croissant(n), n }), attendu: (n) => ({ 6: triangleN(n) }) },
                  { nom: "t[0] maximum", entree: (n) => ({ t: decroissant(n), n }), attendu: () => ({ 6: 0 }) }] } }
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Conclure pour recule",
              enonce: "Pour la fonction `recule` de l'exercice précédent :",
              code: RECULE,
              champs: [
                champ("Forme simplifiée exacte", "Θ(n) + O(n²)", { accepte: ["O(n²) + Θ(n)", "O(n^2)+theta(n)", "theta(n)+O(n^2)"] }),
                champ("Meilleur cas", "Θ(n)"),
                champ("Pire cas", "Θ(n²)")
              ],
              explication: ["`T(n) = 2Θ(1) + 2Θ(n) + 3O(n²) = Θ(n) + O(n²)`. Disjonction : `t[0]` maximum donne `Θ(n)`, `t[0]` minimum donne `Θ(n²)`."]
            }
          ]
        },

        /* ---------- Leçon 4.2 ---------- */
        {
          type: "lecon",
          id: "ca-tri-selection",
          titre: "Le tri par sélection",
          description: "Analyse du CM3 : Θ(n²) au meilleur comme au pire cas.",
          cours: [
            {
              titre: "Le code du CM",
              texte: [
                "À chaque tour de `i`, la boucle sur `j` cherche le maximum de la partie non triée, puis l'échange l'envoie à la fin.",
                "Suivez les deux couleurs de la gouttière : la boucle sur `i` (externe) et la boucle sur `j` (interne)."
              ],
              animation: {
                code: SELECTION, tableau: "tab", pointeurs: ["indMax", "j"],
                boucles: { 4: "boucle sur i (externe)", 6: "boucle sur j (interne)" },
                n: { min: 2, max: 7, depart: 5 },
                mesure: [{ ligne: 7, nom: "comparaisons" }, { ligne: 12, nom: "échanges" }],
                scenarios: [
                  { nom: "Déjà trié", entree: (n) => ({ tab: croissant(n), n }), attendu: (n) => ({ 7: triangleN(n), 12: 0 }) },
                  { nom: "Trié à l'envers", entree: (n) => ({ tab: decroissant(n), n }), attendu: (n) => ({ 7: triangleN(n) }) },
                  { nom: "Mélangé", entree: (n) => ({ tab: melange(n), n }), attendu: (n) => ({ 7: triangleN(n) }) }
                ]
              }
            },
            {
              titre: "Ligne par ligne (CM3)",
              texte: [
                "Pour `i` fixé, la boucle sur `j` fait `n − i − 1` tours, **quel que soit** le contenu.",
                "Au total : `(n − 1) + (n − 2) + … + 1 = n(n − 1)/2` comparaisons."
              ],
              schema: grille(5, (i, j) => j < 6 - i, { colonnes: 5, debutJ: 1, legende: "`n = 6` : la case `(i, j)` est une comparaison" }),
              redaction: [
                "L.2, L.3 : `Θ(1)` ; L.4, L.5, L.11 : `Θ(n)` ;",
                "L.6, L.7 : `Θ(n²)` (on somme `n − i − 1` pour `i` de 0 à `n − 2`) ;",
                "L.8 : `O(n²)` (dans le `if`) ; L.12 à L.14 : `O(n)` (dans le `if` de la ligne 11)."
              ]
            },
            {
              titre: "Somme et simplification",
              texte: ["Le CM3 compte aussi le `return tab;` final, d'où `3Θ(1)` ; ici la fonction se termine sans `return`."],
              schema: courbes([
                [(n) => n * (n - 1) / 2, "comparaisons n(n − 1)/2", 2],
                [(n) => n * n / 2, "n²/2", 1, true]
              ], { xMax: 12, legende: "Même forme que `n²`" }),
              demo: [
                ["`T(n) = 2Θ(1) + 3Θ(n) + 2Θ(n²) + O(n²) + 3O(n)`", "somme des lignes"],
                ["`= Θ(1) + Θ(n) + Θ(n²) + O(n²) + O(n)`", "(6)"],
                ["`= Θ(n²) + O(n²)`", "(3), (4)"],
                ["`= Θ(n²)`.", "un `O` de même ordre ne change pas le `Θ`"]
              ]
            },
            {
              titre: "Le contenu ne change rien",
              texte: [
                "Les deux boucles `for` ne s'interrompent jamais : le tri par sélection fait le même nombre de comparaisons sur **tous** les tableaux de taille `n`.",
                "Meilleur cas et pire cas : `Θ(n²)`."
              ],
              schema: { type: "barres", legende: "Comparaisons pour `n = 6`", barres: [
                { nom: "Déjà trié", v: 15, texte: "15" },
                { nom: "Trié à l'envers", v: 15, texte: "15" },
                { nom: "Mélangé", v: 15, texte: "15" }
              ] }
            }
          ],
          problematique: {
            texte: [
              "On doit trier une liste déjà presque triée.",
              "Le tri par sélection en profite-t-il ?"
            ]
          },
          exemple: {
            texte: ["Tri par sélection d'un tableau de taille `n = 6`."],
            questions: [
              "Combien de comparaisons `tab[indMax] < tab[j]` ?",
              "Combien d'échanges au plus ?",
              "Complexité au meilleur et au pire cas ?"
            ]
          },
          correction: {
            texte: [
              {
                demo: [
                  ["Comparaisons : `5 + 4 + 3 + 2 + 1 = 15`, soit `6 × 5 / 2`.", "indépendant du contenu"],
                  ["Échanges : au plus un par tour de `i`, soit au plus **5**.", "`n − 1` tours"],
                  ["Meilleur et pire cas : **`Θ(n²)`**. Un tableau trié ne fait gagner que les échanges.", ""]
                ]
              },
              {
                animation: {
                  code: SELECTION, tableau: "tab", pointeurs: ["indMax", "j"],
                  mesure: [{ ligne: 7, nom: "comparaisons" }, { ligne: 12, nom: "échanges" }],
                  scenarios: [
                    { nom: "Déjà trié", entree: { tab: croissant(6), n: 6 }, attendu: { 7: 15, 12: 0 } },
                    { nom: "Mélangé", entree: { tab: [4, 6, 1, 5, 2, 3], n: 6 }, attendu: { 7: 15 } }
                  ]
                }
              }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Comparaisons pour n = 5",
              enonce: "Combien de comparaisons fait le tri par sélection sur un tableau de 5 cases ?",
              champs: [champ("Comparaisons", 10)],
              explication: ["`4 + 3 + 2 + 1 = 10`."]
            },
            {
              type: "qcm", niveau: 1,
              titre: "Le meilleur cas",
              enonce: "La complexité du tri par sélection au **meilleur** cas est :",
              choix: ["`Θ(1)`", "`Θ(n)`", "`Θ(n log n)`", "`Θ(n²)`"],
              reponse: 3,
              explication: ["Aucune boucle ne s'interrompt : `Θ(n²)` dans tous les cas (CM3)."]
            },
            {
              type: "cout", niveau: 2,
              titre: "L'analyse du CM3",
              enonce: "Donnez la classe de chaque ligne.",
              code: SELECTION,
              choix: CLASSES,
              lignes: { 2: "Θ(1)", 3: "Θ(1)", 4: "Θ(n)", 5: "Θ(n)", 6: "Θ(n²)", 7: "Θ(n²)", 8: "O(n²)", 11: "Θ(n)", 12: "O(n)", 13: "O(n)", 14: "O(n)" },
              explication: ["Les lignes 8 et 12 à 14 sont dans un `if` : `O`. Les autres ne dépendent que de `n` : `Θ`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Un tour de i",
              enonce: "Pour `n = 8` et `i = 2`, combien de tours fait la boucle sur `j` ?",
              code: SELECTION,
              champs: [champ("Tours", 5)],
              explication: ["`j` va de 1 à `n − i − 1 = 5` : **5** tours."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Cent éléments",
              enonce: "Combien de comparaisons pour trier 100 éléments ?",
              champs: [champ("Comparaisons", 4950)],
              explication: ["`100 × 99 / 2 = 4950`."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Simplifier",
              enonce: "Simplifiez `T(n) = 3Θ(1) + 3Θ(n) + 2Θ(n²) + O(n²) + 3O(n)` (CM3).",
              champs: [champ("`T(n)`", "Θ(n²)")]
            },
            {
              type: "champs", niveau: 4,
              titre: "Échanges au plus",
              enonce: "Combien d'échanges au plus pour un tableau de 7 cases ?",
              code: SELECTION,
              champs: [champ("Échanges", 6)],
              explication: ["Au plus un échange par tour de `i`, et `i` va de 0 à `n − 2` : **6**."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Un million d'éléments",
              enonce: "À `10⁹` comparaisons par seconde, combien de secondes pour trier `10⁶` éléments ?",
              champs: [champ("Temps", 500, { unite: "s", tolerance: 0.01 })],
              explication: ["`10⁶ × (10⁶ − 1) / 2 ≈ 5 × 10¹¹` comparaisons, soit environ **500 s**. Un tri en `Θ(n log n)` prendrait 0,02 s."]
            }
          ]
        },

        /* ---------- Leçon 4.3 ---------- */
        {
          type: "lecon",
          id: "ca-tri-insertion",
          titre: "Le tri par insertion",
          description: "Analyse du CM3 : Θ(n) au meilleur cas, Θ(n²) au pire.",
          cours: [
            {
              titre: "Le code du CM",
              texte: [
                "Chaque élément recule par échanges jusqu'à sa place dans la partie déjà triée.",
                "Le `while` s'arrête **dès** que la place est trouvée : comparez les scénarios."
              ],
              animation: {
                code: INSERTION, tableau: "tab", pointeurs: ["ind"],
                boucles: { 4: "boucle sur i (externe)", 6: "boucle while (interne)" },
                n: { min: 1, max: 7, depart: 5 },
                mesure: [{ ligne: 6, nom: "tests du while" }, { ligne: 8, nom: "échanges" }],
                scenarios: [
                  { nom: "Déjà trié", entree: (n) => ({ tab: croissant(n), n }), attendu: (n) => ({ 6: n - 1, 8: 0 }) },
                  { nom: "Trié à l'envers", entree: (n) => ({ tab: decroissant(n), n }), attendu: (n) => ({ 6: triangleN(n) + n - 1, 8: triangleN(n) }) },
                  { nom: "Mélangé", entree: (n) => ({ tab: melange(n), n }) }
                ]
              }
            },
            {
              titre: "Ligne par ligne (CM3)",
              texte: [
                "La boucle `for` fait toujours `n − 1` tours ; le `while` en fait entre 0 et `i` selon les valeurs."
              ],
              schema: grille(6, (i, j) => j < i, { debutI: 1, colonnes: 6, legende: "Pire cas, `n = 7` : au tour `i`, l'élément recule de `i` cases" }),
              redaction: [
                "L.2, L.3 : `Θ(1)` ; L.4, L.5 : `Θ(n)` ;",
                "L.6 : `Θ(n²)` au pire cas, `Θ(n)` au meilleur ;",
                "L.7 à L.10 : `O(n²)` (autant que les tours du `while`).",
                "`T(n) = 2Θ(1) + 2Θ(n) + 5O(n²) = Θ(n) + O(n²)`."
              ]
            },
            {
              titre: "Meilleur cas : déjà trié",
              texte: [
                "Le test du `while` échoue dès la première fois à chaque tour de `i` : il ne reste que la boucle `for`."
              ],
              schema: courbes([
                [(n) => n - 1, "meilleur : n − 1 tests", 1],
                [(n) => n * (n - 1) / 2, "pire : n(n − 1)/2 échanges", 2]
              ], { xMin: 1, xMax: 12, legende: "Les deux cas extrêmes du tri par insertion" }),
              demo: [
                ["Tableau trié : `tab[ind − 1] ≤ tab[ind]` à chaque test.", ""],
                ["Le `while` ne fait aucun tour : chaque tour de `i` coûte `Θ(1)`.", ""],
                ["`T_meilleur(n) = (n − 1) · Θ(1) = Θ(n)`.", ""]
              ]
            },
            {
              titre: "Pire cas : trié à l'envers",
              texte: [
                "Chaque nouvel élément est plus petit que tous les précédents : il recule jusqu'à la case 0."
              ],
              schema: grille(6, (i, j) => j < i ? 2 : 0, { debutI: 1, colonnes: 6, legende: "`1 + 2 + … + (n − 1)` échanges" }),
              demo: [
                ["Au tour `i`, l'élément `tab[i]` est plus petit que `tab[0..i − 1]`.", ""],
                ["Le `while` fait donc exactement `i` tours.", ""],
                ["`∑ (i = 1 → n − 1) i = n(n − 1)/2` tours au total.", ""],
                ["`T_pire(n) = Θ(n²)`.", ""]
              ]
            }
          ],
          problematique: {
            texte: [
              "Un capteur envoie des mesures presque toujours dans l'ordre ; de temps en temps, deux valeurs voisines arrivent inversées.",
              "Quel tri choisir pour remettre la liste en ordre ?"
            ]
          },
          exemple: {
            texte: ["On trie `[1, 2, 3, 4, 5]` puis `[5, 4, 3, 2, 1]` par insertion."],
            questions: [
              "Combien d'échanges dans chaque cas ?",
              "Complexité au meilleur cas, au pire cas ?",
              "Quel tri choisir pour des données presque triées ?"
            ]
          },
          correction: {
            texte: [
              {
                demo: [
                  ["`[1, 2, 3, 4, 5]` : aucun élément ne recule, **0** échange.", "meilleur cas"],
                  ["`[5, 4, 3, 2, 1]` : `1 + 2 + 3 + 4 =` **10** échanges.", "pire cas"],
                  ["Meilleur cas `Θ(n)`, pire cas `Θ(n²)`.", ""],
                  ["Presque trié : peu d'échanges, coût proche de `n`. Le tri par insertion s'impose ; la sélection resterait en `Θ(n²)`.", ""]
                ]
              },
              {
                animation: {
                  code: INSERTION, tableau: "tab", pointeurs: ["ind"],
                  mesure: { ligne: 8, nom: "échanges" },
                  scenarios: [
                    { nom: "[1, 2, 3, 4, 5]", entree: { tab: [1, 2, 3, 4, 5], n: 5 }, attendu: { 8: 0 } },
                    { nom: "[5, 4, 3, 2, 1]", entree: { tab: [5, 4, 3, 2, 1], n: 5 }, attendu: { 8: 10 } },
                    { nom: "Presque trié", entree: { tab: [1, 2, 4, 3, 5], n: 5 }, attendu: { 8: 1 } }
                  ]
                }
              }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Trié à l'envers",
              enonce: "Combien d'échanges pour trier `[5, 4, 3, 2, 1]` par insertion ?",
              champs: [champ("Échanges", 10)]
            },
            {
              type: "qcm", niveau: 1,
              titre: "Le meilleur cas",
              enonce: "La complexité du tri par insertion au **meilleur** cas est :",
              choix: ["`Θ(1)`", "`Θ(n)`", "`Θ(n log n)`", "`Θ(n²)`"],
              reponse: 1
            },
            {
              type: "champs", niveau: 2,
              titre: "Paires voisines",
              enonce: "Combien d'échanges pour trier `[2, 1, 4, 3, 6, 5]` ?",
              champs: [champ("Échanges", 3)],
              explication: [
                "Chaque élément pair recule d'une case : **3** échanges.",
                { animation: { code: INSERTION, tableau: "tab", pointeurs: ["ind"], mesure: { ligne: 8, nom: "échanges" }, scenarios: [{ nom: "[2, 1, 4, 3, 6, 5]", entree: { tab: [2, 1, 4, 3, 6, 5], n: 6 }, attendu: { 8: 3 } }] } }
              ]
            },
            {
              type: "cout", niveau: 2,
              titre: "L'analyse du CM3",
              enonce: "Donnez la classe de chaque ligne (en `O` quand elle dépend des données).",
              code: INSERTION,
              choix: CLASSES,
              lignes: { 2: "Θ(1)", 3: "Θ(1)", 4: "Θ(n)", 5: "Θ(n)", 6: "O(n²)", 7: "O(n²)", 8: "O(n²)", 9: "O(n²)", 10: "O(n²)" },
              explication: ["Le CM3 note L.6 « `Θ(n²)` au pire, `Θ(n)` au meilleur » et la range avec les `O(n²)` : `T(n) = 3Θ(1) + 2Θ(n) + 5O(n²)`."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Les tests du while",
              enonce: "Combien de fois le test de la ligne 6 est-il évalué pour `n = 10` ?",
              code: INSERTION,
              champs: [champ("Tableau déjà trié", 9), champ("Tableau trié à l'envers", 54)],
              indice: "À l'envers, au tour `i` : `i` tests réussis puis un test raté.",
              explication: ["Trié : un test raté par tour, soit 9. À l'envers : `∑ (i + 1)` pour `i` de 1 à 9, soit `45 + 9 = 54`."]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Lire Θ(n) + O(n²)",
              enonce: "Le CM3 obtient `T(n) = Θ(n) + O(n²)`. Cela signifie :",
              choix: [
                "que le tri coûte `n + n²` opérations",
                "qu'il coûte au moins de l'ordre de `n` et au plus de l'ordre de `n²` selon l'entrée",
                "qu'il est en `Θ(n²)`",
                "qu'il est en `Θ(n)`"
              ],
              reponse: 1,
              explication: ["La disjonction de cas précise : `Θ(n)` au meilleur, `Θ(n²)` au pire."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Compter les inversions",
              enonce: "Combien d'échanges pour trier `[3, 1, 4, 1, 5, 9, 2, 6]` par insertion ?",
              champs: [champ("Échanges", 8)],
              indice: "Chaque échange corrige une **inversion** : une paire `i < j` avec `tab[i] > tab[j]`.",
              explication: [
                "Inversions : `3` devant `1, 1, 2` (3) ; `4` devant `1, 2` (2) ; `5` devant `2` (1) ; `9` devant `2, 6` (2). Total **8**.",
                { animation: { code: INSERTION, tableau: "tab", pointeurs: ["ind"], mesure: { ligne: 8, nom: "échanges" }, scenarios: [{ nom: "Exécution", entree: { tab: [3, 1, 4, 1, 5, 9, 2, 6], n: 8 }, attendu: { 8: 8 } }] } }
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Mille éléments",
              enonce: "Combien d'échanges au pire cas pour `n = 1000` ?",
              champs: [champ("Échanges", 499500)],
              explication: ["`1000 × 999 / 2 = 499 500`."]
            }
          ]
        },

        /* ---------- Leçon 4.4 ---------- */
        {
          type: "lecon",
          id: "ca-recherche",
          titre: "Recherche linéaire et disjonction de cas",
          description: "Un return dans la boucle : meilleur cas Θ(1), pire cas Θ(n).",
          cours: [
            {
              titre: "Le code (CM3)",
              texte: [
                "Le `return i` peut **interrompre** la boucle : le nombre de tours dépend de la position de `value`.",
                "Comparez les trois scénarios, puis le tableau selon `n`."
              ],
              animation: {
                code: LINEAIRE, tableau: "tab", pointeurs: ["i"],
                n: { min: 1, max: 8, depart: 6 },
                mesure: { ligne: 3, nom: "comparaisons" },
                scenarios: [
                  { nom: "En première case", entree: (n) => ({ tab: impairs(n), n, value: 1 }), attendu: () => ({ 3: 1, renvoie: 0 }) },
                  { nom: "Au milieu", entree: (n) => ({ tab: impairs(n), n, value: impairs(n)[Math.floor((n - 1) / 2)] }), attendu: (n) => ({ 3: Math.floor((n - 1) / 2) + 1 }) },
                  { nom: "Absente", entree: (n) => ({ tab: impairs(n), n, value: 0 }), attendu: (n) => ({ 3: n, renvoie: -1 }) }
                ]
              }
            },
            {
              titre: "Ligne par ligne",
              texte: [
                [
                  "L.2, L.3 : `O(n)` — entre 1 et `n` tours selon la position ;",
                  "L.4 : `O(1)` — au plus une fois ;",
                  "L.7 : `O(1)` — seulement si `value` est absente."
                ],
                "`T(n) = O(n) + O(1)` : on ne peut pas faire mieux sans séparer les cas.",
                { remarque: "Le CM3 note `Θ(n)` pour l'en-tête de la boucle : c'est sa valeur au pire cas. Au meilleur cas, le `return` arrête la boucle au premier tour." }
              ],
              schema: courbes([
                [(n) => n, "pire : n comparaisons", 2],
                [() => 1, "meilleur : 1", 1]
              ], { xMax: 10, yMax: 11, zone: { entre: [0, 1] }, legende: "Selon la position de `value`" })
            },
            {
              titre: "La disjonction de cas",
              texte: [
                "Quand une instruction peut interrompre un parcours, on traite les cas **séparément**, à taille `n` fixée."
              ],
              schema: grille(1, (i, j) => j === 0 ? 2 : 1, { colonnes: 8, nomI: "tour", sommes: false, legende: "Meilleur cas : 1 case lue (orange) ; pire cas : les 8" }),
              demo: {
                enonce: "Complexité de `linearSearch` :",
                lignes: [
                  ["**Borne supérieure.** Quelle que soit l'entrée, au plus `n` tours à coût constant : `T(n) = O(n)`.", "pour toute entrée"],
                  ["**Pire cas.** Si `value` n'est pas dans `tab`, le test échoue à chaque tour et les `n` tours sont faits : `Θ(n)`.", "une instance, pour tout `n`"],
                  ["**Meilleur cas.** Si `tab[0] = value`, la fonction renvoie au premier tour : `Θ(1)`.", "une instance, pour tout `n`"],
                  ["Sans précision, la recherche linéaire est en `O(n)`.", "la garantie"]
                ]
              }
            }
          ],
          problematique: {
            texte: [
              "Les deux instances du CM1 ont la même taille (8 cases), mais l'une s'arrête à la première case et l'autre parcourt tout le tableau.",
              "Comment annoncer la complexité d'un algorithme dont le coût dépend du contenu ?"
            ]
          },
          exemple: {
            codeC: LINEAIRE,
            questions: [
              "Quelle est la complexité au meilleur cas ? Donner l'instance.",
              "Quelle est la complexité au pire cas ? Donner l'instance.",
              "Rédiger la conclusion."
            ]
          },
          correction: {
            texte: [
              {
                demo: [
                  ["Meilleur cas : `value` en `tab[0]` ; un tour, un test, un `return` : `Θ(1)`.", ""],
                  ["Pire cas : `value` absente ; `n` tours à coût constant, puis `return -1` : `Θ(n)`.", ""],
                  ["Pour toute entrée, au plus `n` tours : `O(n)`. La recherche linéaire est en `O(n)`, et ce `O` est atteint.", ""]
                ]
              }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Le pire cas",
              enonce: "Complexité de `linearSearch` au **pire** cas ?",
              code: LINEAIRE,
              champs: [champ("Pire cas", "Θ(n)")]
            },
            {
              type: "champs", niveau: 1,
              titre: "Le meilleur cas",
              enonce: "Complexité de `linearSearch` au **meilleur** cas ?",
              code: LINEAIRE,
              champs: [champ("Meilleur cas", "Θ(1)")]
            },
            {
              type: "cout", niveau: 2,
              titre: "Les lignes qui dépendent de l'entrée",
              enonce: "Donnez la classe des lignes indiquées.",
              code: LINEAIRE,
              choix: CLASSES,
              lignes: { 3: "O(n)", 4: "O(1)", 7: "O(1)" },
              explication: ["Le test l.3 s'exécute entre 1 et `n` fois ; chaque `return` au plus une fois."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Une position précise",
              enonce: "`value` est en `tab[5]` (et nulle part avant), `n = 10`. Combien de comparaisons ?",
              code: LINEAIRE,
              champs: [champ("Comparaisons", 6)],
              explication: ["Indices 0 à 5 : **6** comparaisons."]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Tableau trié",
              enonce: "Le tableau est trié par ordre croissant. Cochez les affirmations **vraies**.",
              code: `int chercheTrie(int t[], int n, int v) {
    for (int i = 0; i < n; i++) {
        if (t[i] == v) {
            return 1;
        }
        if (t[i] > v) {
            return 0;
        }
    }
    return 0;
}`,
              choix: [
                "le meilleur cas est en `Θ(1)`",
                "le pire cas est en `Θ(n)`, quand `v` est plus grand que tous les éléments",
                "le pire cas est en `Θ(log n)`",
                "chercher une valeur absente coûte toujours `Θ(n)`"
              ],
              reponse: [0, 1],
              explication: ["Une valeur absente plus petite que `t[0]` est rejetée au premier tour. Mais une valeur plus grande que tout oblige à tout parcourir : `Θ(n)`."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Sans sortie anticipée",
              enonce: "Complexité de cette fonction au meilleur et au pire cas ?",
              code: `int dernierePosition(int t[], int n, int v) {
    int p = -1;
    for (int i = 0; i < n; i++) {
        if (t[i] == v) {
            p = i;
        }
    }
    return p;
}`,
              champs: [champ("Meilleur cas", "Θ(n)"), champ("Pire cas", "Θ(n)")],
              explication: ["Aucun `return` dans la boucle : elle va toujours au bout."]
            },
            {
              type: "champs", niveau: 4,
              titre: "En moyenne",
              enonce: "`value` est présente, à une position tirée au hasard uniformément parmi les `n = 9` cases. Combien de comparaisons en moyenne ?",
              champs: [champ("Comparaisons", 5)],
              explication: ["Position `k` : `k + 1` comparaisons. Moyenne `(1 + 2 + … + 9)/9 = 45/9 = 5`, soit `(n + 1)/2` : toujours `Θ(n)`."]
            },
            {
              type: "qcm", niveau: 4,
              titre: "Comparer en temps constant",
              enonce: "Pour ne plus révéler la longueur du préfixe juste (attaque temporelle, CM1), quelle version choisir ?",
              choix: [
                "s'arrêter au premier caractère différent",
                "comparer **tous** les caractères et ne répondre qu'à la fin",
                "comparer les caractères dans l'ordre inverse",
                "ajouter un `printf` à chaque tour"
              ],
              reponse: 1,
              explication: ["Sans sortie anticipée, le coût vaut `Θ(n)` pour toute saisie : le temps de réponse ne dépend plus du contenu."]
            }
          ]
        }
      ]
    },

    /* =====================================================
       CHAPITRE 5 — ALLER PLUS LOIN
       ===================================================== */
    {
      id: "ch5",
      titre: "Chapitre 5 — Aller plus loin",
      description: "Boucles logarithmiques, sommes et encadrements, récurrences, preuves de cas.",
      exercices: [

        /* ---------- Leçon 5.1 ---------- */
        {
          type: "lecon",
          id: "ca-log",
          titre: "Boucles logarithmiques",
          description: "Un compteur qui double ou qui divise : Θ(log n), Θ(n log n), Θ(√n).",
          cours: [
            {
              titre: "Un compteur qui double",
              texte: [
                "Avec `i = i * 2`, le compteur atteint `n` en environ `log₂ n` tours au lieu de `n`.",
                "Pour `n = 1 000 000` : 20 tours."
              ],
              schema: { type: "sauts", valeurs: [1, 2, 4, 8, 16], max: 22, borne: { v: 20, nom: "n = 20" }, graduations: [0, 5, 10, 15, 20], pas: "×2", legende: "5 tours pour `n = 20` : `⌈log₂ 20⌉ = 5`" },
              animation: {
                code: DOUBLEMENTS,
                mesure: { ligne: 4, nom: "tours" },
                scenarios: [
                  { nom: "n = 20", entree: { n: 20 }, attendu: { 4: 5 } },
                  { nom: "n = 100", entree: { n: 100 }, attendu: { 4: 7 } },
                  { nom: "n = 1000", entree: { n: 1000 }, attendu: { 4: 10 } }
                ]
              }
            },
            {
              titre: "La preuve : i = 2ᵗ",
              texte: [
                "On exprime le compteur après `t` tours, puis on résout la condition de sortie."
              ],
              schema: courbes([
                [(n) => n, "n", 2],
                [(n) => Math.ceil(log2(n)), "tours : ⌈log₂ n⌉", 1]
              ], { xMin: 1, xMax: 64, yMax: 66, legende: "Les tours de `nbDoublements` comparés à `n`" }),
              demo: {
                enonce: "Nombre de tours de `nbDoublements(n)` :",
                lignes: [
                  ["Après `t` tours, `i = 2ᵗ`.", "récurrence : `i = 1 = 2⁰`, puis ×2 à chaque tour"],
                  ["La boucle continue tant que `2ᵗ < n`, c'est-à-dire `t < log₂ n`.", ""],
                  ["Elle fait donc `⌈log₂ n⌉` tours, chacun en `Θ(1)`.", "le plus petit `t` avec `2ᵗ ≥ n`"],
                  ["`T(n) = Θ(log n)`.", "la base ne compte pas"]
                ]
              }
            },
            {
              titre: "Diviser, c'est pareil",
              texte: [
                "`n = n / 10` (algo3, CM1) : autant de tours que de chiffres, `Θ(log n)`.",
                "`i = i / 2` en partant de `n` : `Θ(log n)` aussi. La base du logarithme est un facteur constant."
              ],
              schema: { type: "sauts", valeurs: [64, 32, 16, 8, 4, 2, 1], max: 70, graduations: [0, 16, 32, 48, 64], pas: "÷2", legende: "`i` part de 64 et est divisé par 2 : 7 valeurs" },
              animation: {
                code: ALGO3,
                mesure: { ligne: 4, nom: "divisions" },
                scenarios: [
                  { nom: "n = 9", entree: { n: 9 }, attendu: { 4: 1 } },
                  { nom: "n = 4567", entree: { n: 4567 }, attendu: { 4: 4 } },
                  { nom: "n = 1 000 000", entree: { n: 1000000 }, attendu: { 4: 7 } }
                ]
              }
            },
            {
              titre: "Une boucle log dans une boucle n",
              texte: [
                "Si la boucle interne fait `⌈log₂ n⌉` tours **quel que soit** `i`, on multiplie : `Θ(n log n)`.",
                "C'est la classe des bons tris (tri fusion)."
              ],
              animation: {
                code: MIXTE,
                n: { min: 1, max: 8, depart: 5 },
                mesure: { ligne: 5, nom: "c = c + 1" },
                scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ 5: n * tours2(n) }) }]
              }
            },
            {
              titre: "Une condition sur i²",
              texte: [
                "`while (i * i < n)` avance de 1 mais s'arrête quand `i` atteint `√n` : `Θ(√n)`.",
                "Échelle : `log n < √n < n`."
              ],
              schema: { type: "sauts", valeurs: [0, 1, 4, 9, 16], max: 22, borne: { v: 20, nom: "n = 20" }, graduations: [0, 5, 10, 15, 20], pas: "", legende: "Valeurs de `i²` au moment du test : 5 tours pour `n = 20`" },
              animation: {
                code: RACINE,
                mesure: { ligne: 4, nom: "tours" },
                scenarios: [
                  { nom: "n = 20", entree: { n: 20 }, attendu: { 4: 5 } },
                  { nom: "n = 100", entree: { n: 100 }, attendu: { 4: 10 } }
                ]
              }
            }
          ],
          problematique: {
            texte: [
              "Un tableau dynamique double sa capacité chaque fois qu'il est plein, en partant d'une case.",
              "Combien d'agrandissements pour stocker un million d'éléments ?"
            ]
          },
          exemple: {
            codeC: DOUBLEMENTS,
            questions: [
              "Que vaut `i` après `t` tours ?",
              "Combien de tours pour `n` ? Quelle complexité ?",
              "Combien de tours pour `n = 1 000 000` ?"
            ]
          },
          correction: {
            texte: [
              {
                demo: [
                  ["Après `t` tours, `i = 2ᵗ`.", ""],
                  ["La boucle s'arrête au premier `t` tel que `2ᵗ ≥ n` : `⌈log₂ n⌉` tours, donc `Θ(log n)`.", ""],
                  ["`2¹⁹ = 524 288 < 10⁶ ≤ 1 048 576 = 2²⁰` : **20** tours (et 20 agrandissements).", ""]
                ]
              }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "Mille",
              enonce: "Combien de tours fait `nbDoublements(1000)` ?",
              code: DOUBLEMENTS,
              champs: [champ("Tours", 10)],
              explication: ["`i = 1, 2, …, 512` : `2⁰` à `2⁹`, soit **10** tours."]
            },
            {
              type: "champs", niveau: 1,
              titre: "Autour d'une puissance de 2",
              enonce: "Combien de tours fait `nbDoublements(n)` ?",
              code: DOUBLEMENTS,
              champs: [champ("`n = 64`", 6), champ("`n = 65`", 7)],
              explication: ["`n = 64` : `i = 1 … 32`, 6 tours (`64 < 64` est faux). `n = 65` : on ajoute `i = 64`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Diviser par 3",
              enonce: "Quelle est la complexité de cette fonction ?",
              code: `int tiers(int n) {
    int c = 0;
    for (int i = n; i > 1; i = i / 3) {
        c = c + 1;
    }
    return c;
}`,
              champs: [champ("Complexité", "Θ(log n)")],
              explication: ["Environ `log₃ n` tours, et `log₃ n = log₂ n / log₂ 3`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Les chiffres d'un million",
              enonce: "Combien de tours fait la boucle d'`algo3` pour `n = 1 000 000` ?",
              code: ALGO3,
              champs: [champ("Tours", 7)],
              explication: ["`1 000 000` a 7 chiffres."]
            },
            {
              type: "qcm", niveau: 2,
              titre: "La base",
              enonce: "`Θ(log₂ n)`, `Θ(log₃ n)` et `Θ(log₁₀ n)` :",
              choix: ["sont trois classes différentes", "sont la même classe", "dépendent de `n₀`", "ne sont pas comparables"],
              reponse: 1
            },
            {
              type: "champs", niveau: 3,
              titre: "Une boucle log dans une boucle",
              enonce: "Quelle est la complexité de `mixte` ?",
              code: MIXTE,
              champs: [champ("Complexité", "Θ(n log n)")],
              explication: ["La boucle interne fait `⌈log₂ n⌉` tours pour chacun des `n` tours externes."]
            },
            {
              type: "champs", niveau: 3,
              titre: "La racine",
              enonce: "Quelle est la complexité de `racine` ?",
              code: RACINE,
              champs: [champ("Complexité", "Θ(√n)")],
              explication: ["La boucle s'arrête quand `i ≥ √n` : `⌈√n⌉` tours."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Des boucles qui raccourcissent",
              enonce: "Combien de fois `c++` s'exécute-t-il pour `n = 16`, et quelle est la complexité ?",
              code: `int moities(int n) {
    int c = 0;
    for (int i = n; i > 0; i = i / 2) {
        for (int j = 0; j < i; j++) {
            c++;
        }
    }
    return c;
}`,
              champs: [champ("Pour `n = 16`", 31), champ("Complexité", "Θ(n)")],
              indice: "`n + n/2 + n/4 + … ≤ 2n`.",
              explication: [
                "`16 + 8 + 4 + 2 + 1 = 31`. La somme géométrique est entre `n` et `2n` : `Θ(n)`, pas `Θ(n log n)`.",
                { animation: { code: `int moities(int n) {
    int c = 0;
    for (int i = n; i > 0; i = i / 2) {
        for (int j = 0; j < i; j++) {
            c++;
        }
    }
    return c;
}`, mesure: { ligne: 5, nom: "c++" }, scenarios: [{ nom: "n = 16", entree: { n: 16 }, attendu: { 5: 31 } }, { nom: "n = 10", entree: { n: 10 }, attendu: { 5: 18 } }] } }
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Un compteur qui se met au carré",
              enonce: "Pour `n = 65 536`, combien de tours ? Quelle complexité ?",
              code: `int carres(int n) {
    int c = 0;
    for (int i = 2; i < n; i = i * i) {
        c++;
    }
    return c;
}`,
              champs: [champ("Tours", 4), champ("Complexité", "Θ(log log n)")],
              explication: [
                "`i = 2, 4, 16, 256`, puis `65 536` qui n'est pas `< n` : **4** tours. Après `t` tours, `i = 2^(2ᵗ)` : `t ≈ log₂ log₂ n`.",
                { animation: { code: `int carres(int n) {
    int c = 0;
    for (int i = 2; i < n; i = i * i) {
        c++;
    }
    return c;
}`, mesure: { ligne: 4, nom: "tours" }, scenarios: [{ nom: "n = 65 536", entree: { n: 65536 }, attendu: { 4: 4 } }] } }
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Tripler",
              enonce: "Combien de tours fait `for (int i = 1; i < n; i = i * 3)` pour `n = 1000` ?",
              champs: [champ("Tours", 7)],
              explication: ["`i = 1, 3, 9, 27, 81, 243, 729` : 7 tours (`3⁷ = 2187 ≥ 1000`)."]
            }
          ]
        },

        /* ---------- Leçon 5.2 ---------- */
        {
          type: "lecon",
          id: "ca-sommes",
          titre: "Boucles dépendantes : sommer ou encadrer",
          description: "La somme exacte, ou la moitié des tours pour minorer.",
          cours: [
            {
              titre: "Sommer quand l'interne dépend de l'externe",
              texte: [
                "Avec `j` de `i` à `n − 1`, la boucle interne fait `n − i` tours : on somme `n + (n − 1) + … + 1 = n(n + 1)/2`.",
                "Le terme dominant est `n²/2` : `Θ(n²)`."
              ],
              schema: grille(6, (i, j) => j >= i, { legende: "`paires(6)` : 21 cases, `6 × 7 / 2`" }),
              animation: {
                code: PAIRES,
                n: { min: 1, max: 6, depart: 4 },
                mesure: { ligne: 5, nom: "c = c + 1" },
                scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ 5: n * (n + 1) / 2 }) }]
              }
            },
            {
              titre: "Encadrer sans calcul exact",
              texte: [
                "Pour un `Θ`, il faut aussi **minorer**. Astuce : ne garder qu'un quart de la grille, où tout est long.",
                "Pour `i < n/2`, la boucle interne fait au moins `n/2` tours."
              ],
              schema: grille(8, (i, j) => j >= i ? (i < 4 && j >= 4 ? 2 : 1) : 0, { legende: "En orange : `n/2 × n/2 = n²/4` cases, toujours parcourues" }),
              demo: {
                enonce: "Montrons que `paires` est en `Θ(n²)` sans la formule exacte.",
                lignes: [
                  ["Notons `T(n)` le nombre d'exécutions de `c = c + 1`.", ""],
                  ["**Majoration.** Pour chaque `i`, au plus `n` tours internes, et `n` valeurs de `i` : `T(n) ≤ n²`.", "`O(n²)`"],
                  ["**Minoration.** Pour chaque `i < n/2`, la boucle interne fait `n − i ≥ n/2` tours.", ""],
                  ["Il y a au moins `n/2` telles valeurs de `i` : `T(n) ≥ (n/2)(n/2) = n²/4`.", "`Ω(n²)`"],
                  ["Donc `T(n) = Θ(n²)`, avec `c₁ = 1/4` et `c₂ = 1`.", "conclusion"]
                ]
              }
            },
            {
              titre: "Trois boucles dépendantes",
              texte: [
                "`k < j < i < n` : un tour par triplet d'indices distincts, soit `n(n − 1)(n − 2)/6`.",
                "Terme dominant `n³/6` : `Θ(n³)`."
              ],
              schema: courbes([
                [(n) => n * (n - 1) * (n - 2) / 6, "n(n − 1)(n − 2)/6", 2],
                [(n) => n ** 3 / 6, "n³/6", 1, true]
              ], { xMax: 12, legende: "Même forme que `n³`" })
            },
            {
              titre: "Piège : une boucle lancée rarement",
              texte: [
                "Trois boucles imbriquées ne donnent pas forcément `n³` : il faut compter combien de fois chacune est **effectivement lancée**.",
                "Dans `diag`, la boucle sur `k` ne démarre que si `i == j`, soit `n` fois."
              ],
              animation: {
                code: DIAG,
                boucles: { 3: "boucle sur i", 4: "boucle sur j", 6: "boucle sur k" },
                n: { min: 1, max: 5, depart: 3 },
                mesure: [{ ligne: 5, nom: "tests i == j" }, { ligne: 7, nom: "x = x + 1" }],
                scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ 5: n * n, 7: n * n }) }]
              }
            }
          ],
          problematique: {
            texte: [
              "La somme exacte d'une double boucle est parfois pénible, voire inconnue.",
              "Comment prouver un `Θ(n²)` sans la calculer ?"
            ]
          },
          exemple: {
            codeC: PAIRES,
            questions: [
              "Majorer le nombre d'exécutions de la ligne 5.",
              "Le minorer en ne gardant que la moitié des tours externes.",
              "Conclure."
            ]
          },
          correction: {
            texte: [
              {
                demo: [
                  ["**Majoration.** Au plus `n` tours internes pour chacun des `n` tours externes : `T(n) ≤ n²`.", ""],
                  ["**Minoration.** Pour `i < n/2`, au moins `n/2` tours internes ; au moins `n/2` tels `i` : `T(n) ≥ n²/4`.", ""],
                  ["**Conclusion.** `n²/4 ≤ T(n) ≤ n²` : `T(n) = Θ(n²)`.", ""],
                  ["Contrôle avec la formule exacte : `n(n + 1)/2` est bien entre `n²/4` et `n²`.", ""]
                ]
              }
            ]
          },
          exercices: [
            {
              type: "champs", niveau: 1,
              titre: "j jusqu'à i",
              enonce: "Pour `for (i = 0; i < n; i++) for (j = 0; j <= i; j++) x++;`, combien de `x++` pour `n = 8` ?",
              champs: [champ("`x++`", 36)],
              explication: ["`1 + 2 + … + 8 = 36`."]
            },
            {
              type: "qcm", niveau: 1,
              titre: "Majorer",
              enonce: "Pour majorer une double boucle dont la borne interne dépend de `i < n`, on écrit :",
              choix: [
                "chaque boucle fait au plus `n` tours, donc `O(n²)`",
                "la boucle interne fait `i` tours, donc `O(i)`",
                "il faut la formule exacte",
                "`O(n)` car la boucle interne est plus courte"
              ],
              reponse: 0
            },
            {
              type: "champs", niveau: 2,
              titre: "Triple boucle",
              enonce: "Quelle est la complexité ?",
              code: `int triple(int n) {
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
              champs: [champ("Complexité", "Θ(n³)")],
              explication: ["Majoration `n³` ; minoration en gardant `i ≥ n/2` et `n/4 ≤ j < n/2` : au moins `n³/32`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Une borne au carré",
              enonce: "Quelle est la complexité de `for (i = 0; i < n; i++) for (j = 0; j < i * i; j++) c++;` ?",
              champs: [champ("Complexité", "Θ(n³)")],
              explication: ["`∑ i² = (n − 1)n(2n − 1)/6`, terme dominant `n³/3`."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Le piège diag",
              enonce: "Quelle est la complexité de `diag` ?",
              code: DIAG,
              champs: [champ("Complexité", "Θ(n²)")],
              explication: ["Le test `i == j` s'exécute `n²` fois ; la boucle sur `k` n'est lancée que `n` fois, pour `n²` tours au total : `Θ(n²)`."]
            },
            {
              type: "remettre", niveau: 3,
              titre: "Rédiger l'encadrement",
              enonce: "Remettez la preuve dans l'ordre.",
              code: PAIRES,
              etapes: [
                "Notons `T(n)` le nombre d'exécutions de la ligne 5.",
                "Majoration : au plus `n` tours internes pour chacun des `n` tours externes, donc `T(n) ≤ n²`.",
                "Minoration : pour `i < n/2`, la boucle interne fait au moins `n/2` tours.",
                "Il y a au moins `n/2` telles valeurs de `i`, donc `T(n) ≥ n²/4`.",
                "Donc `T(n) = Θ(n²)`."
              ]
            },
            {
              type: "champs", niveau: 3,
              titre: "La constante du quart",
              enonce: "Dans l'encadrement de `paires`, quelle constante `c₁` donne la minoration ?",
              champs: [champ("`c₁`", 0.25, { tolerance: 0.01, accepte: ["1/4"], affiche: "1/4" })],
              explication: ["`T(n) ≥ (n/2) × (n/2) = (1/4) n²`."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Un pas qui grandit",
              enonce: "Combien de `c++` pour `n = 6` ? Quelle complexité ?",
              code: `int h(int n) {
    int c = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j = j + i) {
            c++;
        }
    }
    return c;
}`,
              champs: [champ("Pour `n = 6`", 16), champ("Complexité", "Θ(n log n)")],
              indice: "Pour `i` fixé, `j` avance de `i` en `i` : environ `n/i` tours.",
              explication: [
                "`6 + 3 + 2 + 2 + 2 + 1 = 16`. En général `∑ n/i = n (1 + 1/2 + … + 1/n) ≈ n ln n` : `Θ(n log n)`.",
                { animation: { code: `int h(int n) {
    int c = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j = j + i) {
            c++;
        }
    }
    return c;
}`, mesure: { ligne: 5, nom: "c++" }, scenarios: [{ nom: "n = 6", entree: { n: 6 }, attendu: { 5: 16 } }] } }
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Le compte exact de la triple boucle",
              enonce: "Pour la triple boucle `k < j < i < n`, combien de `c = c + 1` pour `n = 6` ?",
              champs: [champ("Exécutions", 20)],
              explication: ["`6 × 5 × 4 / 6 = 20` : le nombre de façons de choisir 3 indices distincts parmi 6."]
            }
          ]
        },

        /* ---------- Leçon 5.3 ---------- */
        {
          type: "lecon",
          id: "ca-recurrences",
          titre: "Récursivité : poser et dérouler",
          description: "Écrire T(n), le dérouler jusqu'au cas de base, reconnaître la solution.",
          cours: [
            {
              titre: "Poser la relation",
              texte: [
                "`T(n)` : coût de l'appel sur `n`. On écrit `T(n) = (coût des appels récursifs) + (coût du reste)`, et le cas de base.",
                "On nomme les constantes `a`, `b` plutôt que d'additionner des `Θ(1)`."
              ],
              schema: { type: "arbre", racine: 4, enfants: (v) => v > 0 ? [v - 1] : [], etiquette: (v) => v ? "triangle(" + v + ") : " + v + " *" : "triangle(0)", legende: "Chaque appel fait une boucle de `n` tours, puis un appel sur `n − 1`" },
              redaction: [
                "`T(0) = a` ;",
                "`T(n) = T(n − 1) + b·n + a` pour `n ≥ 1`."
              ]
            },
            {
              titre: "Dérouler",
              texte: ["On remplace `T(n − 1)` par sa propre formule, et on recommence jusqu'au cas de base."],
              animation: {
                code: TRIANGLE,
                n: { min: 0, max: 5, depart: 3 },
                mesure: { ligne: 6, nom: "étoiles" },
                scenarios: [{ nom: "Exécution", entree: (n) => ({ n }), attendu: (n) => ({ 6: n * (n + 1) / 2, appels: n + 1 }) }]
              },
              demo: [
                ["`T(n) = T(n − 1) + b·n + a`", ""],
                ["`= T(n − 2) + b·(n − 1) + b·n + 2a`", "on remplace `T(n − 1)`"],
                ["`= T(0) + b·(1 + 2 + … + n) + n·a`", "jusqu'au cas de base"],
                ["`= a + b·n(n + 1)/2 + a·n`", ""],
                ["Terme dominant `(b/2) n²` : `T(n) = Θ(n²)`.", ""]
              ]
            },
            {
              titre: "Diviser par 2 : la dichotomie",
              texte: [
                "Chaque appel fait un travail constant puis **un** appel sur une moitié : `T(n) = T(n/2) + Θ(1)`.",
                "Il faut `log₂ n` divisions pour arriver à une zone vide : `Θ(log n)`."
              ],
              animation: {
                code: DICHO, tableau: "t", pointeurs: ["g", "m", "d"],
                n: { min: 1, max: 12, depart: 10 },
                mesure: { ligne: 5, nom: "milieux calculés" },
                scenarios: [
                  { nom: "Absente (trop grande)", entree: (n) => ({ t: impairs(n), g: 0, d: n - 1, v: 2 * n }), attendu: (n) => ({ 5: Math.floor(log2(n)) + 1, renvoie: -1 }) },
                  { nom: "Au milieu", entree: (n) => ({ t: impairs(n), g: 0, d: n - 1, v: impairs(n)[Math.floor((n - 1) / 2)] }), attendu: () => ({ 5: 1, appels: 1 }) }
                ]
              }
            },
            {
              titre: "Relations à reconnaître",
              texte: [
                {
                  entetes: ["Relation", "Solution", "Exemple"],
                  lignes: [
                    ["`T(n) = T(n − 1) + Θ(1)`", "`Θ(n)`", "somme récursive"],
                    ["`T(n) = T(n − 1) + Θ(n)`", "`Θ(n²)`", "triangle"],
                    ["`T(n) = T(n/2) + Θ(1)`", "`Θ(log n)`", "dichotomie"],
                    ["`T(n) = T(n/2) + Θ(n)`", "`Θ(n)`", "boucle + appel sur `n/2`"],
                    ["`T(n) = 2T(n/2) + Θ(n)`", "`Θ(n log n)`", "tri fusion"],
                    ["`T(n) = 2T(n − 1) + Θ(1)`", "`Θ(2ⁿ)`", "deux appels sur `n − 1`"]
                  ]
                }
              ],
              schema: { type: "arbre", racine: 3, enfants: (v) => v > 0 ? [v - 1, v - 1] : [], etiquette: (v) => "h(" + v + ")", niveaux: true, legende: "`T(n) = 2T(n − 1) + Θ(1)` : l'arbre double à chaque niveau" }
            }
          ],
          problematique: {
            texte: [
              "Pour chercher un mot dans un dictionnaire trié d'un million de mots, on peut tourner les pages une à une, ou l'ouvrir au milieu et recommencer dans la bonne moitié.",
              "Combien d'étapes au pire avec la seconde méthode ?"
            ]
          },
          exemple: {
            codeC: DICHO,
            questions: [
              "Écrire la relation de récurrence, avec `n = d − g + 1`.",
              "La dérouler.",
              "Combien d'appels au plus pour `n = 1 000 000` ?"
            ]
          },
          correction: {
            texte: [
              {
                demo: [
                  ["Un appel coûte une constante `a`, puis lance au plus **un** appel sur au plus `n/2` cases.", ""],
                  ["`T(n) ≤ T(n/2) + a`, et `T(0) = a`.", "relation"],
                  ["`T(n) ≤ T(n/4) + 2a ≤ … ≤ T(n/2ᵏ) + k·a`.", "on déroule"],
                  ["La zone est vide quand `n/2ᵏ < 1`, soit `k = ⌊log₂ n⌋ + 1` : `T(n) = O(log n)`, atteint si la valeur est absente.", ""],
                  ["Pour `n = 10⁶` : `⌊log₂ 10⁶⌋ + 1 = 20` appels sur une zone non vide, plus l'appel final sur une zone vide.", ""]
                ]
              }
            ]
          },
          exercices: [
            {
              type: "qcm", niveau: 1,
              titre: "Reconnaître une relation",
              enonce: "`T(n) = T(n − 1) + Θ(1)` a pour solution :",
              choix: ["`Θ(1)`", "`Θ(log n)`", "`Θ(n)`", "`Θ(n²)`"],
              reponse: 2
            },
            {
              type: "champs", niveau: 1,
              titre: "La dichotomie",
              enonce: "Complexité au pire cas de `dicho` ?",
              code: DICHO,
              champs: [champ("Pire cas", "Θ(log n)")]
            },
            {
              type: "champs", niveau: 2,
              titre: "Boucle puis moitié",
              enonce: "Quelle est la complexité de `moities(n)` ?",
              code: MOITIES_REC,
              champs: [champ("Complexité", "Θ(n)")],
              indice: "`T(n) = T(n/2) + b·n` : déroulez.",
              explication: ["`b·(n + n/2 + n/4 + …) ≤ 2b·n`, et au moins `b·n` : `Θ(n)`, pas `Θ(n log n)`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Appels de la dichotomie",
              enonce: "Combien d'appels (le premier compris) fait `dicho` sur 15 cases, pour une valeur plus grande que toutes ?",
              code: DICHO,
              champs: [champ("Appels", 5)],
              explication: [
                "Tailles des zones : 15, 7, 3, 1, puis 0 : **5** appels.",
                { animation: { code: DICHO, tableau: "t", pointeurs: ["g", "m", "d"], scenarios: [{ nom: "n = 15", entree: { t: impairs(15), g: 0, d: 14, v: 40 }, attendu: { appels: 5, renvoie: -1 } }] } }
              ]
            },
            {
              type: "qcm", niveau: 3,
              titre: "Boucle et appel sur n − 1",
              enonce: "`T(n) = T(n − 1) + Θ(n)` a pour solution :",
              choix: ["`Θ(n)`", "`Θ(n log n)`", "`Θ(n²)`", "`Θ(2ⁿ)`"],
              reponse: 2,
              explication: ["En déroulant : `n + (n − 1) + … + 1 = n(n + 1)/2`."]
            },
            {
              type: "champs", niveau: 3,
              titre: "La puissance rapide",
              enonce: "Combien d'appels (le premier compris) pour `puissanceRapide(2, 16)` ? Quelle complexité ?",
              code: `int puissanceRapide(int x, int n) {
    if (n == 0) {
        return 1;
    }
    int p = puissanceRapide(x, n / 2);
    if (n % 2 == 0) {
        return p * p;
    }
    return x * p * p;
}`,
              champs: [champ("Appels", 6), champ("Complexité", "Θ(log n)")],
              explication: [
                "`n = 16, 8, 4, 2, 1, 0` : **6** appels. `T(n) = T(n/2) + Θ(1)` : `Θ(log n)`, contre `Θ(n)` pour `puissance`.",
                { animation: { code: `int puissanceRapide(int x, int n) {
    if (n == 0) {
        return 1;
    }
    int p = puissanceRapide(x, n / 2);
    if (n % 2 == 0) {
        return p * p;
    }
    return x * p * p;
}`, scenarios: [{ nom: "n = 16", entree: { x: 2, n: 16 }, attendu: { appels: 6, renvoie: 65536 } }, { nom: "n = 13", entree: { x: 2, n: 13 }, attendu: { appels: 5, renvoie: 8192 } }] } }
              ]
            },
            {
              type: "qcm", niveau: 4,
              titre: "Le tri fusion",
              enonce: "Le tri fusion coupe le tableau en deux, trie chaque moitié récursivement, puis fusionne en `Θ(n)`. Sa complexité :",
              choix: ["`Θ(n)`", "`Θ(n log n)`", "`Θ(n²)`", "`Θ(log n)`"],
              reponse: 1,
              explication: ["`T(n) = 2T(n/2) + Θ(n)` : `log₂ n` niveaux de l'arbre, chacun coûtant `Θ(n)` au total."]
            },
            {
              type: "champs", niveau: 4,
              titre: "Dérouler une relation exponentielle",
              enonce: "`T(0) = 1` et `T(n) = 2T(n − 1) + 1`. Que vaut `T(5)` ?",
              champs: [champ("`T(5)`", 63)],
              explication: ["`T(1) = 3`, `T(2) = 7`, `T(3) = 15`, `T(4) = 31`, `T(5) = 63 = 2⁶ − 1`."]
            }
          ]
        },

        /* ---------- Leçon 5.4 ---------- */
        {
          type: "lecon",
          id: "ca-preuves-cas",
          titre: "Meilleur et pire cas, preuve à l'appui",
          description: "Majorer pour toute entrée, puis exhiber une instance pour chaque cas.",
          cours: [
            {
              titre: "Trois paragraphes",
              texte: [
                [
                  "**borne supérieure** : pour **toute** entrée, majorer le nombre de tours ;",
                  "**instance du pire cas** : une entrée précise, pour tout `n`, qui atteint la borne ;",
                  "**instance du meilleur cas** : de même pour le minimum."
                ],
                "Rechercher un doublon : comparez les trois scénarios."
              ],
              animation: {
                code: DOUBLON, tableau: "t", pointeurs: ["i", "j"],
                n: { min: 2, max: 7, depart: 5 },
                mesure: { ligne: 4, nom: "comparaisons" },
                scenarios: [
                  { nom: "Tous différents", entree: (n) => ({ t: croissant(n), n }), attendu: (n) => ({ 4: triangleN(n), renvoie: 0 }) },
                  { nom: "t[0] = t[1]", entree: (n) => ({ t: [7, 7].concat(croissant(n - 2)), n }), attendu: () => ({ 4: 1, renvoie: 1 }) },
                  { nom: "Doublon à la fin", entree: (n) => ({ t: croissant(n - 1).concat([n - 1]), n }) }
                ]
              }
            },
            {
              titre: "Le meilleur cas n'est pas toujours Θ(1)",
              texte: [
                "Sans `return` dans la boucle, la boucle externe va toujours au bout : le meilleur cas est au moins de son ordre.",
                "Dans `g`, la boucle interne n'est lancée que pour les `t[i]` nuls."
              ],
              animation: {
                code: ZEROS, tableau: "t", pointeurs: ["i", "j"],
                n: { min: 1, max: 6, depart: 4 },
                mesure: [{ ligne: 4, nom: "tests t[i] == 0" }, { ligne: 6, nom: "additions" }],
                scenarios: [
                  { nom: "Aucun zéro", entree: (n) => ({ t: croissant(n), n }), attendu: (n) => ({ 4: n, 6: 0 }) },
                  { nom: "Que des zéros", entree: (n) => ({ t: Array(n).fill(0), n }), attendu: (n) => ({ 4: n, 6: n * n }) }
                ]
              }
            },
            {
              titre: "Rédiger",
              texte: ["La rédaction modèle pour `doublon`."],
              schema: grille(6, (i, j) => j > i, { legende: "Pire cas : toutes les paires `i < j` sont comparées" }),
              demo: {
                enonce: "Meilleur et pire cas de `doublon` :",
                lignes: [
                  ["Notons `C(t)` le nombre de comparaisons sur l'entrée `t` ; chacune coûte `Θ(1)`.", ""],
                  ["**Borne supérieure.** Chaque paire `i < j` est comparée au plus une fois : `C(t) ≤ n(n − 1)/2`.", "pour toute entrée"],
                  ["**Pire cas.** `t = [0, 1, …, n − 1]` : aucune égalité, toutes les paires sont testées, `C(t) = n(n − 1)/2`.", "instance pour tout `n`"],
                  ["**Meilleur cas.** `t[0] = t[1]` : la première comparaison réussit, `C(t) = 1`.", "instance pour tout `n ≥ 2`"],
                  ["Meilleur cas `Θ(1)`, pire cas `Θ(n²)` ; sans précision, `doublon` est en `O(n²)`.", "conclusion"]
                ]
              }
            }
          ],
          problematique: {
            texte: [
              "Affirmer « au pire cas, c'est `Θ(n²)` » ne suffit pas en copie.",
              "Que faut-il montrer exactement ?"
            ]
          },
          exemple: {
            codeC: ZEROS,
            questions: [
              "Majorer le coût de `g` pour toute entrée.",
              "Donner une instance du pire cas et son coût.",
              "Donner une instance du meilleur cas et son coût."
            ]
          },
          correction: {
            texte: [
              {
                demo: [
                  ["**Borne supérieure.** La boucle interne est lancée au plus `n` fois, pour `n` tours chacune : `O(n²)`.", ""],
                  ["**Pire cas.** `t` ne contient que des 0 : le test réussit à chaque tour, `n²` additions : `Θ(n²)`.", ""],
                  ["**Meilleur cas.** `t` sans aucun 0 : la boucle interne n'est jamais lancée, mais la boucle externe fait ses `n` tests : `Θ(n)`.", "pas `Θ(1)`"]
                ]
              }
            ]
          },
          exercices: [
            {
              type: "qcm", niveau: 1,
              titre: "Ce qu'il faut prouver",
              enonce: "Pour prouver que le pire cas est en `Θ(f(n))`, il faut :",
              choix: [
                "un exemple d'entrée de taille 10",
                "majorer le coût de toute entrée par `O(f(n))` et exhiber, pour tout `n`, une entrée qui coûte `Ω(f(n))`",
                "montrer que toutes les entrées coûtent `Θ(f(n))`",
                "compter les boucles imbriquées"
              ],
              reponse: 1
            },
            {
              type: "champs", niveau: 1,
              titre: "doublon",
              enonce: "Complexité de `doublon` :",
              code: DOUBLON,
              champs: [champ("Meilleur cas", "Θ(1)"), champ("Pire cas", "Θ(n²)")]
            },
            {
              type: "champs", niveau: 2,
              titre: "Tous différents",
              enonce: "Combien de comparaisons fait `doublon` sur `[0, 1, 2, 3, 4, 5, 6, 7]` ?",
              code: DOUBLON,
              champs: [champ("Comparaisons", 28)],
              explication: ["`8 × 7 / 2 = 28`."]
            },
            {
              type: "champs", niveau: 2,
              titre: "Le meilleur cas de g",
              enonce: "Complexité de `g` au **meilleur** cas ?",
              code: ZEROS,
              champs: [champ("Meilleur cas", "Θ(n)")],
              explication: ["Pas de sortie anticipée : au moins `n` tests."]
            },
            {
              type: "champs", niveau: 3,
              titre: "Le pire cas de g",
              enonce: "Complexité de `g` au **pire** cas ?",
              code: ZEROS,
              champs: [champ("Pire cas", "Θ(n²)")]
            },
            {
              type: "remettre", niveau: 3,
              titre: "Rédiger les cas de doublon",
              enonce: "Remettez la rédaction dans l'ordre.",
              code: DOUBLON,
              etapes: [
                "Notons `C(t)` le nombre de comparaisons effectuées sur l'entrée `t`.",
                "Pour toute entrée, chaque paire `i < j` est comparée au plus une fois : `C(t) ≤ n(n − 1)/2`.",
                "Pour `t = [0, 1, …, n − 1]`, aucune comparaison ne réussit : `C(t) = n(n − 1)/2`.",
                "Pour `t[0] = t[1]`, la première comparaison réussit : `C(t) = 1`.",
                "Meilleur cas `Θ(1)`, pire cas `Θ(n²)`."
              ]
            },
            {
              type: "qcm", niveau: 4,
              titre: "Une boucle imbriquée trompeuse",
              enonce: "Quelle est la complexité de `premierNegatif` au **pire** cas ?",
              code: NEGATIF,
              choix: ["`Θ(1)`", "`Θ(n)`", "`Θ(n log n)`", "`Θ(n²)`"],
              reponse: 1,
              explication: [
                "Si le premier négatif est en `i`, il y a `i + 1` tests puis `n − i` affectations, et la fonction s'arrête : `n + 1` au total. Sans négatif, `n` tests. Toujours `Θ(n)` : la boucle interne n'est lancée qu'**une** fois.",
                { animation: { code: NEGATIF, tableau: "t", pointeurs: ["i", "j"], n: { min: 1, max: 6, depart: 5 }, mesure: [{ ligne: 3, nom: "tests" }, { ligne: 5, nom: "affectations" }], scenarios: [
                  { nom: "Négatif en t[0]", entree: (n) => ({ t: [-1].concat(croissant(n - 1)), n }), attendu: (n) => ({ 3: 1, 5: n }) },
                  { nom: "Aucun négatif", entree: (n) => ({ t: croissant(n), n }), attendu: (n) => ({ 3: n, 5: 0 }) }] } }
              ]
            },
            {
              type: "champs", niveau: 4,
              titre: "Compter sur une instance",
              enonce: "Pour `t = [3, 1, −2, 5, −1, 4]`, combien de tests `t[i] < 0` et combien d'affectations `t[j] = 0` ?",
              code: NEGATIF,
              champs: [champ("Tests", 3), champ("Affectations", 4)],
              explication: ["Le premier négatif est en `i = 2` : 3 tests, puis `j` de 2 à 5, soit 4 affectations. Total `7 = n + 1`."]
            }
          ]
        }
      ]
    }
  );
})();
