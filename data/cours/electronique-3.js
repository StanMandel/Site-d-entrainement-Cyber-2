/* =============================================================
   Électronique et Électricité 3
   -------------------------------------------------------------
   Six chapitres qui suivent les cours : modulation AM (cours 1),
   modulation FM (cours 1), modulations numériques (cours 2 et
   exercices 2.1), chaîne physique et supports de transmission
   (cours 3 et 4), liaisons série UART / I2C / SPI (cours 4.1),
   alimentation des data centers (cours 5).

   Chaque chapitre : un QCM de questions de cours, puis des
   exercices de type "probleme" de difficulté croissante.
     - Onglet « Exemple » : l'exercice du cours, résolu (énoncé,
       schéma, rédaction, réponse) ;
     - Onglet « Exercice » : un exercice du même type, un peu plus
       exigeant, avec une case par réponse (champ « champs »).
   Les schémas sont dessinés par assets/js/schemas.js (champ
   « schema »). Format complet : voir data/cours/_modele.js.
   ============================================================= */

CONTENU["electronique-3"] = {
  chapitres: [

    /* ========================================================
       CHAPITRE 1 — Modulation d'amplitude (AM)
       ======================================================== */
    {
      id: "am",
      titre: "Chapitre 1 — Modulation d'amplitude (AM)",
      description: "Bande de base et bande transposée, taux de modulation, spectre et oscillogramme d'un signal AM.",
      exercices: [

        {
          type: "qcm",
          id: "am-qcm",
          titre: "QCM — Modulation d'amplitude",
          description: "Questions de cours sur la transmission par modulation et l'AM.",
          melangerChoix: true,
          questions: [
            {
              enonce: "Que signifie une transmission « en bande de base » ?",
              choix: [
                "Le signal est transmis sans modification de son spectre",
                "Le signal est transposé autour d'une porteuse haute fréquence",
                "Le signal est numérisé avant d'être transmis",
                "Plusieurs signaux partagent le support grâce à des porteuses différentes"
              ],
              reponse: 0,
              explication: "En bande de base, le signal part tel qu'il sort de la source, dans sa bande de fréquence d'origine."
            },
            {
              enonce: "Pourquoi un signal basse fréquence ne peut-il pas être émis directement par voie hertzienne ?",
              choix: [
                "L'antenne devrait avoir une taille de l'ordre de la longueur d'onde, donc gigantesque",
                "Les ondes basse fréquence ne se propagent pas dans l'air",
                "La loi interdit l'émission en dessous de 1 MHz",
                "Le signal serait automatiquement surmodulé"
              ],
              reponse: 0,
              explication: "La transmission est optimale quand l'antenne mesure de l'ordre de `λ = c / f` ; à 3 kHz, `λ` vaut 100 km."
            },
            {
              enonce: "La puissance reçue par l'antenne est, en première approximation, proportionnelle à :",
              choix: ["`f²`", "`f`", "`1 / f`", "`√f`"],
              reponse: 0,
              explication: "D'où l'intérêt d'une porteuse haute fréquence : diviser `f` par 100 divise la puissance reçue par 10 000."
            },
            {
              enonce: "Pour transmettre deux informations sur le même support, il faut que :",
              choix: [
                "leurs spectres ne se recouvrent pas",
                "elles aient la même amplitude",
                "elles aient la même fréquence maximale",
                "l'une soit en AM et l'autre en bande de base"
              ],
              reponse: 0,
              explication: "C'est le principe du multiplexage fréquentiel : chaque communication occupe sa propre bande."
            },
            {
              enonce: "Quels paramètres de la porteuse peut-on faire varier pour moduler ?",
              choix: [
                "L'amplitude, la fréquence ou la phase",
                "L'amplitude, la puissance ou la tension",
                "La fréquence, la longueur d'onde ou la période",
                "La phase, l'impédance ou le courant"
              ],
              reponse: 0,
              explication: "Amplitude → AM, fréquence → FM, phase → PM."
            },
            {
              enonce: "Pour `sᵢ(t) = Sᵢ cos(ωᵢt)` et `sₚ(t) = Sₚ cos(Ωₚt)`, le taux de modulation vaut :",
              choix: ["`m = Sᵢ / Sₚ`", "`m = Sₚ / Sᵢ`", "`m = Sᵢ × Sₚ`", "`m = ωᵢ / Ωₚ`"],
              reponse: 0
            },
            {
              enonce: "Que se passe-t-il si `m > 1` ?",
              choix: [
                "Surmodulation : l'enveloppe est déformée, le signal est distordu",
                "Sous-modulation : les bandes latérales disparaissent",
                "Le signal devient modulé en fréquence",
                "La porteuse disparaît du spectre"
              ],
              reponse: 0,
              explication: "L'expression `1 + m·sᵢ(t)` devient négative par moments : l'enveloppe ne suit plus l'information."
            },
            {
              enonce: "Le spectre d'une porteuse `fc` modulée en AM par une sinusoïde `fm` contient :",
              choix: [
                "trois raies : `fc − fm`, `fc` et `fc + fm`",
                "deux raies : `fc` et `fm`",
                "une seule raie à `fc + fm`",
                "une infinité de raies espacées de `fm`"
              ],
              reponse: 0
            },
            {
              enonce: "Quelle est l'amplitude de chaque bande latérale d'un signal AM de porteuse `Ac` ?",
              choix: ["`m·Ac / 2`", "`m·Ac`", "`Ac / 2`", "`2·m·Ac`"],
              reponse: 0,
              explication: "Forme canonique : `s(t) = Ac cos(ωct) + (m·Ac/2) cos((ωc+ωm)t) + (m·Ac/2) cos((ωc−ωm)t)`."
            },
            {
              enonce: "Quelle bande de fréquence occupe un signal AM modulé par une sinusoïde de fréquence `fm` ?",
              choix: ["`2·fm`", "`fm`", "`fc + fm`", "`fc`"],
              reponse: 0,
              explication: "De `fc − fm` à `fc + fm`."
            },
            {
              enonce: "Sur un oscillogramme AM, `A` est l'amplitude crête à crête maximale de l'enveloppe et `B` la minimale. Le taux de modulation vaut :",
              choix: ["`m = (A − B) / (A + B)`", "`m = (A + B) / (A − B)`", "`m = B / A`", "`m = A − B`"],
              reponse: 0
            },
            {
              enonce: "Pour une modulation à 100 % (`m = 1`), chaque bande latérale a une amplitude égale à :",
              choix: [
                "la moitié de celle de la porteuse",
                "celle de la porteuse",
                "le double de celle de la porteuse",
                "zéro"
              ],
              reponse: 0
            },
            {
              enonce: "L'enveloppe positive d'un signal `A[1 + m·sᵢ(t)]cos(Ωₚt)` avec `|sᵢ|max = 1` varie entre :",
              choix: ["`A(1 − m)` et `A(1 + m)`", "`0` et `A`", "`−A` et `A`", "`A` et `2A`"],
              reponse: 0
            },
            {
              enonce: "Quelle est l'occupation spectrale d'une station de radio AM en Europe ?",
              choix: ["9 kHz (modulant 4,5 kHz max)", "10 kHz (modulant 5 kHz max)", "200 kHz", "20 kHz"],
              reponse: 0,
              explication: "Aux États-Unis, c'est 10 kHz (modulant 5 kHz max)."
            },
            {
              enonce: "Quelle est la bande des Moyennes Ondes (MO / MW) ?",
              choix: ["520 à 1 600 kHz", "150 à 281 kHz", "2,3 à 26,1 MHz", "88 à 108 MHz"],
              reponse: 0,
              explication: "Grandes Ondes : 150 à 281 kHz. Ondes courtes : 2,3 à 26,1 MHz. 88 à 108 MHz est la bande FM."
            },
            {
              enonce: "Quel est l'inconvénient majeur de la modulation d'amplitude ?",
              choix: [
                "Les parasites affectent l'amplitude, donc l'information elle-même",
                "Elle occupe une bande infinie",
                "Elle nécessite une antenne plus petite que la FM",
                "Elle ne permet pas le multiplexage fréquentiel"
              ],
              reponse: 0
            }
          ]
        },

        {
          type: "probleme",
          id: "am-antenne",
          titre: "Pourquoi moduler : antenne et multiplexage",
          description: "Longueur d'onde, puissance reçue et nombre de stations dans une bande.",
          exemple: {
            enonce: [
              "Un signal de parole téléphonique occupe la bande 300 Hz – 3,4 kHz. On veut l'émettre par voie hertzienne.",
              [
                "Quelle serait la longueur d'onde de la plus haute fréquence du signal ?",
                "Quelle est la longueur d'onde si on le module sur une porteuse de 1 MHz ?",
                "Une antenne reçoit 1 mW à 100 MHz. Que recevrait-elle à 10 kHz, à puissance émise égale ?"
              ]
            ],
            schema: {
              type: "chaine",
              blocs: ["Signal BF\n0,3 – 3,4 kHz", "Modulateur\nporteuse 1 MHz", "Antenne\nλ = 300 m"],
              liens: ["sᵢ(t)", "s(t)"],
              accent: 1
            },
            formuleTitre: "Rédaction",
            formule: [
              "La longueur d'onde vaut `λ = c / f` avec `c = 3·10⁸ m/s`.",
              [
                "Sans modulation : `λ = 3·10⁸ / 3,4·10³ ≈ 88 000 m`, soit une antenne de l'ordre de 88 km : irréalisable.",
                "Avec une porteuse de 1 MHz : `λ = 3·10⁸ / 10⁶ = 300 m`.",
                "La puissance reçue est proportionnelle à `f²` : `P = 1 mW × (10⁴ / 10⁸)² = 10⁻³ × 10⁻⁸ = 10⁻¹¹ W`."
              ],
              "Un signal basse fréquence ne peut donc pas être émis directement : on le transpose autour d'une porteuse haute fréquence."
            ],
            reponse: [
              [
                "`λ ≈ 88 km` sans modulation",
                "`λ = 300 m` avec une porteuse de 1 MHz",
                "`P = 10⁻¹¹ W` à 10 kHz"
              ]
            ]
          },
          exercice: {
            enonce: [
              "On prend `c = 3·10⁸ m/s`.",
              [
                "Une station Grandes Ondes émet à 162 kHz.",
                "Une station FM émet à 100 MHz.",
                "La bande des Moyennes Ondes va de 520 à 1 600 kHz ; en Europe, chaque station occupe 9 kHz.",
                "Une antenne reçoit 1 mW d'une station à 100 MHz."
              ]
            ],
            champs: [
              { libelle: "Longueur d'onde de la station Grandes Ondes", reponse: 1852, unite: "m" },
              { libelle: "Longueur d'onde de la station FM", reponse: 3, unite: "m" },
              { libelle: "Nombre maximal de stations dans la bande MO", reponse: 120, tolerance: 0 },
              { libelle: "Puissance reçue d'une station à 1 MHz (même puissance émise)", reponse: 0.1, unite: "µW" }
            ],
            indice: "`λ = c / f` ; la puissance reçue varie comme `f²` ; nombre de stations = largeur de bande / largeur d'une station.",
            solution: [
              [
                "`λ = 3·10⁸ / 162·10³ ≈ 1 852 m`.",
                "`λ = 3·10⁸ / 100·10⁶ = 3 m`.",
                "`(1 600 − 520) / 9 = 1 080 / 9 = 120` stations.",
                "`P = 1 mW × (10⁶ / 10⁸)² = 10⁻³ × 10⁻⁴ = 10⁻⁷ W = 0,1 µW`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "am-spectre",
          titre: "Lire le spectre d'un signal AM",
          description: "Porteuse, modulante, bande occupée et taux de modulation à partir des raies.",
          exemple: {
            enonce: [
              "Un signal AM branché à un analyseur de spectre donne les raies ci-dessous.",
              [
                "Quelle est la fréquence de la porteuse ?",
                "Quelle est la fréquence de l'onde modulante ?",
                "Quelle est la bande de fréquence occupée par le signal AM ?",
                "Quel est le taux de modulation ?"
              ]
            ],
            schema: {
              type: "spectre", unite: "kHz",
              raies: [{ f: 640, a: 12 }, { f: 650, a: 40 }, { f: 660, a: 12 }]
            },
            formuleTitre: "Rédaction",
            formule: [
              [
                "La raie centrale, la plus haute, est la porteuse : `fc = 650 kHz`.",
                "Les bandes latérales sont à `fc ± fm` : `fm = 660 − 650 = 10 kHz`.",
                "Le signal occupe de 640 à 660 kHz, soit `B = 2·fm = 20 kHz`.",
                "Chaque bande latérale vaut `m·Ac / 2` : `(m·Ac/2) / Ac = m / 2 = 12 / 40 = 0,3`, donc `m = 0,6`."
              ],
              "**Attention** : on ne peut pas écrire `A = 40 + 12` et `B = 40 − 12` pour utiliser `m = (A − B)/(A + B)` : rien ne dit que les trois raies atteignent leur maximum au même instant."
            ],
            reponse: [
              [
                "`fc = 650 kHz`",
                "`fm = 10 kHz`",
                "`B = 20 kHz` (de 640 à 660 kHz)",
                "`m = 0,6` (60 %)"
              ]
            ]
          },
          exercice: {
            enonce: "L'analyseur de spectre affiche les raies ci-dessous (amplitudes en volts). Déterminez les caractéristiques du signal, puis les amplitudes extrêmes de son enveloppe.",
            schema: {
              type: "spectre", unite: "kHz", uniteY: "V",
              raies: [{ f: 1195, a: 3 }, { f: 1200, a: 8 }, { f: 1205, a: 3 }]
            },
            champs: [
              { libelle: "Fréquence de la porteuse", reponse: 1200, unite: "kHz" },
              { libelle: "Fréquence modulante", reponse: 5, unite: "kHz" },
              { libelle: "Bande occupée", reponse: 10, unite: "kHz" },
              { libelle: "Taux de modulation `m`", reponse: 0.75 },
              { libelle: "Amplitude maximale de l'enveloppe `Ac(1 + m)`", reponse: 14, unite: "V" },
              { libelle: "Amplitude minimale de l'enveloppe `Ac(1 − m)`", reponse: 2, unite: "V" }
            ],
            indice: "Chaque bande latérale vaut `m·Ac/2` : on en déduit `m = 2·A_BL / Ac`.",
            solution: [
              [
                "Porteuse : raie centrale, `fc = 1 200 kHz`, `Ac = 8 V`.",
                "`fm = 1 205 − 1 200 = 5 kHz`, `B = 2 × 5 = 10 kHz`.",
                "`m = 2 × 3 / 8 = 0,75`.",
                "`Amax = 8 × 1,75 = 14 V` et `Amin = 8 × 0,25 = 2 V`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "am-equation",
          titre: "Signal AM donné par son équation",
          description: "Identifier porteuse, modulante et taux de modulation dans une expression.",
          exemple: {
            enonce: [
              "Soit le signal AM : `s(t) = 5 cos(10⁶ t) + 3,5 cos(10³ t)·cos(10⁶ t)`.",
              [
                "Quelle est la fréquence de la porteuse ?",
                "Quelle est la fréquence modulante ?",
                "Quel est le taux de modulation ?"
              ]
            ],
            schema: {
              type: "spectre", unite: "kHz", uniteY: "V",
              raies: [
                { f: 158.99, a: 1.75, etiquette: "158,99" },
                { f: 159.15, a: 5, etiquette: "159,15" },
                { f: 159.31, a: 1.75, etiquette: "159,31" }
              ],
              legende: "Spectre du signal : la porteuse et les deux bandes latérales d'amplitude `0,7 × 5 / 2 = 1,75`."
            },
            formuleTitre: "Rédaction",
            formule: [
              "On met le signal sous la forme normalisée `s(t) = Ac[1 + m cos(ωm t)] cos(ωc t)` :",
              "`s(t) = 5 [1 + 0,7 cos(10³ t)] cos(10⁶ t)` car `3,5 / 5 = 0,7`.",
              [
                "Les coefficients de `t` sont des **pulsations** : `fc = ωc / 2π = 10⁶ / 2π ≈ 159,15 kHz`.",
                "`fm = 10³ / 2π ≈ 159 Hz`.",
                "`m = 0,7`. En développant le produit, on retrouve bien `0,35 cos((ωc + ωm)t) + 0,35 cos((ωc − ωm)t)` en facteur de 5, soit des bandes latérales de `m·Ac/2 = 1,75`."
              ]
            ],
            reponse: [["`fc ≈ 159,15 kHz`", "`fm ≈ 159 Hz`", "`m = 0,7`"]]
          },
          exercices: [
            {
              enonce: "Soit le signal `s(t) = 6 cos(6,28·10⁵ t) + 2,4 cos(6,28·10³ t)·cos(6,28·10⁵ t)`.",
              champs: [
                { libelle: "Fréquence de la porteuse", reponse: 100, unite: "kHz" },
                { libelle: "Fréquence modulante", reponse: 1, unite: "kHz" },
                { libelle: "Taux de modulation `m`", reponse: 0.4 },
                { libelle: "Bande occupée", reponse: 2, unite: "kHz" }
              ],
              indice: "Mettez `6` en facteur, puis divisez chaque pulsation par `2π ≈ 6,28`.",
              solution: [
                "`s(t) = 6 [1 + 0,4 cos(6,28·10³ t)] cos(6,28·10⁵ t)`.",
                [
                  "`fc = 6,28·10⁵ / 2π ≈ 100 kHz` et `fm = 6,28·10³ / 2π ≈ 1 kHz`.",
                  "`m = 2,4 / 6 = 0,4`.",
                  "`B = 2·fm = 2 kHz`."
                ]
              ]
            },
            {
              enonce: "Soit le signal `s(t) = 10 cos(2π·500·10³ t) + 3 cos(2π·505·10³ t) + 3 cos(2π·495·10³ t)` (en volts).",
              champs: [
                { libelle: "Fréquence de la porteuse", reponse: 500, unite: "kHz" },
                { libelle: "Fréquence modulante", reponse: 5, unite: "kHz" },
                { libelle: "Taux de modulation `m`", reponse: 0.6 },
                { libelle: "Amplitude maximale de l'enveloppe", reponse: 16, unite: "V" }
              ],
              indice: "C'est la forme canonique : une porteuse et deux bandes latérales d'amplitude `m·Ac/2`.",
              solution: [
                [
                  "Porteuse : `Ac = 10 V` à `fc = 500 kHz`.",
                  "Bandes latérales à `500 ± 5 kHz` : `fm = 5 kHz`.",
                  "`m·Ac/2 = 3` donc `m = 6 / 10 = 0,6`.",
                  "`Amax = Ac(1 + m) = 10 × 1,6 = 16 V`."
                ]
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "am-oscillo",
          titre: "Oscillogramme d'un signal AM",
          description: "Taux de modulation et fréquences à partir de l'enveloppe observée.",
          exemple: {
            enonce: [
              "Un signal AM a une porteuse de 100 kHz et une fréquence modulante de 4 kHz. Le signal capté au récepteur est visualisé à l'oscilloscope : l'enveloppe varie entre 1 V et 5 V.",
              [
                "Quelles sont les fréquences contenues dans l'onde modulée ?",
                "Quelle est la bande de fréquence de l'onde modulée ?",
                "Quel est le taux de modulation ?"
              ]
            ],
            schema: {
              type: "am", A: 3, m: 2 / 3, cycles: 40, periodes: 2, cotes: "crete",
              etiquettes: { max: "5 V", min: "1 V", minNeg: "−1 V", maxNeg: "−5 V" }
            },
            formuleTitre: "Rédaction",
            formule: [
              [
                "Les fréquences présentes sont `fc − fm`, `fc` et `fc + fm` : 96 kHz, 100 kHz et 104 kHz.",
                "Le signal occupe de 96 à 104 kHz, soit `B = 8 kHz`.",
                "`Amax = 5 V` et `Amin = 1 V`, donc `m = (Amax − Amin) / (Amax + Amin) = (5 − 1) / (5 + 1) = 4/6 ≈ 0,67`."
              ],
              "Vérification : l'amplitude de l'enveloppe est `(5 − 1)/2 = 2`, celle de la porteuse `5 − 2 = 3`, et `m = 2/3`."
            ],
            reponse: [["96 kHz, 100 kHz et 104 kHz", "`B = 8 kHz`", "`m = 2/3 ≈ 0,67`"]]
          },
          exercice: {
            enonce: [
              "Une porteuse de 250 kHz est modulée en amplitude par une sinusoïde de 5 kHz. À l'oscilloscope, on mesure les amplitudes **crête à crête** de l'enveloppe : 12 V au plus large, 4 V au plus étroit."
            ],
            schema: {
              type: "am", A: 4, m: 0.5, cycles: 40, periodes: 2, cotes: "cc",
              etiquettes: { max: "12 V", min: "4 V" }
            },
            champs: [
              { libelle: "Taux de modulation `m`", reponse: 0.5 },
              { libelle: "Amplitude de la porteuse `Ac`", reponse: 4, unite: "V" },
              { libelle: "Amplitude de chaque bande latérale", reponse: 1, unite: "V" },
              { libelle: "Fréquence de la bande latérale inférieure", reponse: 245, unite: "kHz" },
              { libelle: "Bande occupée", reponse: 10, unite: "kHz" }
            ],
            indice: "Les valeurs crête à crête valent `2·Ac(1 + m)` et `2·Ac(1 − m)`.",
            solution: [
              [
                "`m = (A − B)/(A + B) = (12 − 4)/(12 + 4) = 0,5`.",
                "En crête : `Ac(1 + m) = 6 V` et `Ac(1 − m) = 2 V`, d'où `Ac = (6 + 2)/2 = 4 V`.",
                "Bande latérale : `m·Ac/2 = 0,5 × 4 / 2 = 1 V`.",
                "Raies à `250 − 5 = 245 kHz`, 250 kHz et 255 kHz : `B = 10 kHz`."
              ]
            ]
          }
        }
      ]
    },

    /* ========================================================
       CHAPITRE 2 — Modulation de fréquence (FM)
       ======================================================== */
    {
      id: "fm",
      titre: "Chapitre 2 — Modulation de fréquence (FM)",
      description: "Fréquence instantanée, excursion, indice de modulation et règle de Carson.",
      exercices: [

        {
          type: "qcm",
          id: "fm-qcm",
          titre: "QCM — Modulation de fréquence",
          description: "Questions de cours sur la FM.",
          melangerChoix: true,
          questions: [
            {
              enonce: "En modulation de fréquence, qu'est-ce qui varie au rythme du signal modulant ?",
              choix: [
                "La fréquence instantanée de la porteuse",
                "L'amplitude de la porteuse",
                "La fréquence du signal modulant",
                "La puissance émise"
              ],
              reponse: 0
            },
            {
              enonce: "Quelle est la bande dédiée à la radiodiffusion FM ?",
              choix: ["88 à 108 MHz", "520 à 1 600 kHz", "150 à 281 kHz", "2,4 à 2,5 GHz"],
              reponse: 0
            },
            {
              enonce: "Pourquoi dit-on que la FM est une modulation angulaire ?",
              choix: [
                "L'information est inscrite dans la phase `θ(t)` du signal",
                "Le signal est émis avec un angle particulier",
                "La constellation forme un cercle",
                "La porteuse est déphasée de 90°"
              ],
              reponse: 0
            },
            {
              enonce: "La pulsation instantanée `Ω(t)` d'un signal `S(t)·cos[θ(t)]` vaut :",
              choix: ["`dθ/dt`", "`θ(t) / t`", "`∫θ(t)dt`", "`2π·θ(t)`"],
              reponse: 0,
              explication: "Et la fréquence instantanée vaut `F(t) = (1/2π)·dθ/dt`."
            },
            {
              enonce: "Pour une information sinusoïdale `Sᵢ cos(ωᵢt)`, l'excursion en fréquence vaut :",
              choix: ["`ΔF = α·Sᵢ`", "`ΔF = Fₚ / fᵢ`", "`ΔF = 2(Fₚ + fᵢ)`", "`ΔF = Sᵢ / Sₚ`"],
              reponse: 0,
              explication: "`α` (en Hz/V) est la sensibilité du modulateur : `F(t) = Fₚ + ΔF·cos(2πfᵢt)`."
            },
            {
              enonce: "Entre quelles valeurs varie la fréquence instantanée d'un signal FM ?",
              choix: ["`Fₚ − ΔF` et `Fₚ + ΔF`", "`Fₚ − fᵢ` et `Fₚ + fᵢ`", "`0` et `Fₚ`", "`Fₚ` et `2Fₚ`"],
              reponse: 0
            },
            {
              enonce: "Quel est l'indice de modulation d'un signal FM ?",
              choix: ["`m = ΔF / fᵢ`", "`k = ΔF / Fₚ`", "`m = Sᵢ / Sₚ`", "`m = fᵢ / ΔF`"],
              reponse: 0
            },
            {
              enonce: "Quelle est la différence entre le taux `k` et l'indice `m` d'une modulation FM ?",
              choix: [
                "Le taux `k = ΔF/Fₚ` est très faible ; l'indice `m = ΔF/fᵢ` peut prendre n'importe quelle valeur",
                "Ce sont deux noms de la même grandeur",
                "Le taux est toujours supérieur à 1, l'indice toujours inférieur",
                "Le taux se mesure en Hz, l'indice en volts"
              ],
              reponse: 0,
              explication: "Exemple : `Fₚ ≈ 100 MHz`, `ΔF ≈ 50 kHz` donne `k ≈ 5·10⁻⁴`."
            },
            {
              enonce: "Quelle expression correspond à un signal modulé en fréquence par une information sinusoïdale ?",
              choix: [
                "`Sₚ cos(Ωₚt + m·sin(ωᵢt))`",
                "`Sₚ [1 + m·cos(ωᵢt)] cos(Ωₚt)`",
                "`Sₚ cos(Ωₚt)·cos(ωᵢt)`",
                "`Sₚ cos((Ωₚ + ωᵢ)t)`"
              ],
              reponse: 0
            },
            {
              enonce: "Selon la règle de Carson, la bande occupée par un signal FM vaut environ :",
              choix: ["`B ≈ 2(ΔF + fᵢ)`", "`B ≈ 2·fᵢ`", "`B ≈ ΔF`", "`B ≈ 2·Fₚ`"],
              reponse: 0
            },
            {
              enonce: "Quelle excursion en fréquence maximale autorise la norme de la radio FM ?",
              choix: ["75 kHz", "200 kHz", "20 kHz", "9 kHz"],
              reponse: 0,
              explication: "Avec `fᵢ ≤ 20 kHz` : `B ≈ 2(75 + 20) = 190 kHz`, dans les 200 kHz alloués à chaque station."
            },
            {
              enonce: "Combien de stations FM la bande 88 – 108 MHz peut-elle accueillir avec 200 kHz par station ?",
              choix: ["100", "20", "200", "1 000"],
              reponse: 0,
              explication: "`20·10⁶ / 200·10³ = 100`."
            },
            {
              enonce: "Lequel de ces points n'est **pas** un avantage de la FM sur l'AM ?",
              choix: [
                "Elle occupe une bande plus étroite",
                "Elle est moins sensible aux parasites atmosphériques",
                "Elle n'a pas de problème de surmodulation",
                "Elle respecte la dynamique du signal musical"
              ],
              reponse: 0,
              explication: "Une station FM occupe environ 200 kHz, contre 9 kHz pour une station AM."
            }
          ]
        },

        {
          type: "probleme",
          id: "fm-indice",
          titre: "Excursion, indice et bande de Carson",
          description: "Écrire le signal FM et calculer ses grandeurs caractéristiques.",
          exemple: {
            enonce: [
              "Une porteuse de fréquence 1 MHz et d'amplitude 1 V est modulée en fréquence par une onde sinusoïdale d'amplitude `A_BF = 2,5 V` et de fréquence `f_BF = 500 Hz`. L'excursion de modulation est de 5,5 kHz.",
              "Écrivez l'expression mathématique du signal modulé et déterminez l'indice de modulation."
            ],
            schema: { type: "fm", cycles: 26, periodes: 2, beta: 6, legende: "Le signal FM se resserre quand le signal modulant est maximal et s'étire quand il est minimal." },
            formuleTitre: "Rédaction",
            formule: [
              "L'excursion de modulation est la déviation fréquentielle maximale : `ΔF = 5,5 kHz`.",
              "L'indice de modulation vaut `m = ΔF / f_BF = 5 500 / 500 = 11`.",
              "Le signal s'écrit `v(t) = Sₚ cos(2π·fₚ·t + m·sin(2π·f_BF·t))` :",
              "`v(t) = 1·cos(2π·10⁶·t + 11·sin(2π·500·t))`.",
              "La sensibilité du modulateur vaut `α = ΔF / A_BF = 5 500 / 2,5 = 2 200 Hz/V`."
            ],
            reponse: [["`v(t) = cos(2π·10⁶ t + 11 sin(2π·500 t))`", "`m = 11`"]]
          },
          exercice: {
            enonce: "Une station de radio émet sur `Fₚ = 96,5 MHz`. Son signal modulant est une sinusoïde de fréquence `fᵢ = 15 kHz` et d'amplitude 3 V ; l'excursion en fréquence atteint `ΔF = 75 kHz`.",
            schema: { type: "fm", cycles: 30, periodes: 2, beta: 5 },
            champs: [
              { libelle: "Indice de modulation `m`", reponse: 5 },
              { libelle: "Bande occupée (règle de Carson)", reponse: 180, unite: "kHz" },
              { libelle: "Sensibilité du modulateur `α`", reponse: 25, unite: "kHz/V" },
              { libelle: "Fréquence instantanée minimale", reponse: 96.425, unite: "MHz", tolerance: 0.000001 },
              { libelle: "Fréquence instantanée maximale", reponse: 96.575, unite: "MHz", tolerance: 0.000001 }
            ],
            indice: "`m = ΔF / fᵢ`, `B ≈ 2(ΔF + fᵢ)`, `ΔF = α·Sᵢ` ; la fréquence instantanée varie de `Fₚ − ΔF` à `Fₚ + ΔF`.",
            solution: [
              [
                "`m = 75 / 15 = 5`.",
                "`B ≈ 2(75 + 15) = 180 kHz`.",
                "`α = ΔF / Sᵢ = 75 / 3 = 25 kHz/V`.",
                "`Fmin = 96,5 − 0,075 = 96,425 MHz` et `Fmax = 96,5 + 0,075 = 96,575 MHz`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "fm-plan",
          titre: "Plan de fréquences de la bande FM",
          description: "Combien de stations tiennent dans une bande ?",
          exemple: {
            enonce: "Pour la radio FM, `20 Hz ≤ fᵢ ≤ 20 kHz`, la porteuse est entre 88 et 108 MHz, l'excursion `ΔF ≤ 75 kHz` et la bande d'émission est de 200 kHz au maximum. Combien de stations la bande peut-elle accueillir ?",
            schema: {
              type: "chaine",
              blocs: ["Station 1\n88,1 MHz", "Station 2\n88,3 MHz", "…", "Station 100\n107,9 MHz"],
              liens: ["200 kHz", "", "200 kHz"]
            },
            formuleTitre: "Rédaction",
            formule: [
              "Règle de Carson : `B ≈ 2(ΔF + fᵢ) ≤ 2(75 + 20) = 190 kHz`, qui tient dans les 200 kHz alloués.",
              "Nombre de stations : `(108 − 88)·10⁶ / 200·10³ = 20·10⁶ / 200·10³ = 100`."
            ],
            reponse: "`B ≈ 190 kHz ≤ 200 kHz` : la bande accueille **100 stations**."
          },
          exercice: {
            enonce: [
              "Un pays ouvre la bande 87,5 – 108 MHz. Chaque station module un signal de fréquence maximale 15 kHz avec une excursion de 75 kHz. On ajoute 20 kHz de garde à la bande de Carson pour obtenir la largeur d'un canal.",
              "On considère enfin la station qui émet à 100,1 MHz."
            ],
            champs: [
              { libelle: "Bande de Carson d'une station", reponse: 180, unite: "kHz" },
              { libelle: "Largeur d'un canal", reponse: 200, unite: "kHz" },
              { libelle: "Nombre maximal de stations", reponse: 102, tolerance: 0 },
              { libelle: "Indice de modulation", reponse: 5 },
              { libelle: "Taux de modulation `k = ΔF / Fₚ` de la station à 100,1 MHz", reponse: 0.000749, accepte: [7.49e-4], tolerance: 0.01 }
            ],
            indice: "Le nombre de stations est un nombre entier : on arrondit à l'entier inférieur.",
            solution: [
              [
                "`B ≈ 2(75 + 15) = 180 kHz` ; canal : `180 + 20 = 200 kHz`.",
                "`(108 − 87,5)·10⁶ / 200·10³ = 20,5·10⁶ / 200·10³ = 102,5`, soit **102** stations complètes.",
                "`m = 75 / 15 = 5`.",
                "`k = 75·10³ / 100,1·10⁶ ≈ 7,49·10⁻⁴` : le taux est bien très faible, contrairement à l'indice."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "fm-expression",
          titre: "Lire l'expression d'un signal FM",
          description: "Retrouver toutes les grandeurs d'un signal donné en pulsations.",
          exemple: {
            enonce: [
              "Soit le signal modulé en fréquence `v(t) = V₀ cos(ω₁t + 0,5 sin(ω₂t))`, avec `V₀ = 1 V`, `ω₁ = 10⁷ rad/s` et `ω₂ = 10⁴ rad/s`.",
              "Donnez la fréquence de la porteuse, la fréquence modulante, l'excursion en fréquence, l'indice de modulation et l'encombrement spectral."
            ],
            schema: { type: "fm", cycles: 28, periodes: 2, beta: 3 },
            formuleTitre: "Rédaction",
            formule: [
              "On identifie `v(t) = Sₚ cos(Ωₚt + m·sin(ωᵢt))` : `Ωₚ = ω₁`, `ωᵢ = ω₂`, `m = 0,5`.",
              [
                "`fc = ω₁ / 2π = 10⁷ / 2π ≈ 1,592 MHz`.",
                "`fm = ω₂ / 2π = 10⁴ / 2π ≈ 1 592 Hz`.",
                "`m = ΔF / fm` donc `ΔF = 0,5 × 1 592 ≈ 796 Hz`.",
                "Carson : `B ≈ 2(ΔF + fm) = 2(796 + 1 592) ≈ 4 775 Hz`."
              ],
              "**Piège** : `ω` est une pulsation en rad/s ; il faut toujours diviser par `2π` pour obtenir une fréquence."
            ],
            reponse: [["`fc ≈ 1,592 MHz`", "`fm ≈ 1,592 kHz`", "`ΔF ≈ 796 Hz`", "`m = 0,5`", "`B ≈ 4,8 kHz`"]]
          },
          exercice: {
            enonce: "Soit le signal `v(t) = 3 cos(6·10⁸ t + 2,5 sin(3·10⁴ t))` (en volts, `t` en secondes).",
            champs: [
              { libelle: "Fréquence de la porteuse", reponse: 95.49, unite: "MHz" },
              { libelle: "Fréquence modulante", reponse: 4.775, unite: "kHz" },
              { libelle: "Indice de modulation", reponse: 2.5 },
              { libelle: "Excursion en fréquence `ΔF`", reponse: 11.94, unite: "kHz" },
              { libelle: "Bande de Carson", reponse: 33.42, unite: "kHz" }
            ],
            indice: "Divisez les pulsations par `2π`, puis `ΔF = m·fᵢ` et `B ≈ 2(ΔF + fᵢ)`.",
            solution: [
              [
                "`Fₚ = 6·10⁸ / 2π ≈ 95,49 MHz`.",
                "`fᵢ = 3·10⁴ / 2π ≈ 4 775 Hz`.",
                "`m = 2,5` (coefficient du sinus).",
                "`ΔF = 2,5 × 4 775 ≈ 11,94 kHz`.",
                "`B ≈ 2(11,94 + 4,775) ≈ 33,42 kHz`."
              ]
            ]
          }
        }
      ]
    },

    /* ========================================================
       CHAPITRE 3 — Modulations numériques
       ======================================================== */
    {
      id: "numerique",
      titre: "Chapitre 3 — Modulations numériques",
      description: "ASK, FSK, PSK, constellations, QAM et MSK.",
      exercices: [

        {
          type: "qcm",
          id: "num-qcm",
          titre: "QCM — Modulations numériques",
          description: "Questions de cours sur les modulations numériques et le plan IQ.",
          melangerChoix: true,
          questions: [
            {
              enonce: "En modulation ASK, le passage d'un bit 0 à un bit 1 se traduit par :",
              choix: ["un saut d'amplitude", "un saut de fréquence", "un saut de phase", "un changement de porteuse"],
              reponse: 0,
              explication: "ASK : saut d'amplitude. FSK : saut de fréquence. PSK : saut de phase."
            },
            {
              enonce: "En PSK de base, quelles phases correspondent aux bits 0 et 1 ?",
              choix: ["0 pour un 0, `π` pour un 1", "0 pour un 0, `π/2` pour un 1", "`π/4` pour un 0, `3π/4` pour un 1", "La phase ne change pas"],
              reponse: 0
            },
            {
              enonce: "En FSK, quelle relation lie la porteuse `fC` aux fréquences `f0` et `f1` ?",
              choix: ["`fC = (f0 + f1) / 2`", "`fC = f1 − f0`", "`fC = f0 × f1`", "`fC = 2(f0 + f1)`"],
              reponse: 0,
              explication: "Et `f0 = fC − Δf`, `f1 = fC + Δf`."
            },
            {
              enonce: "Pour `s(t) = E cos(2πfCt + φ)`, les composantes du plan IQ valent :",
              choix: ["`I = E cos φ` et `Q = E sin φ`", "`I = E sin φ` et `Q = E cos φ`", "`I = E` et `Q = φ`", "`I = cos φ` et `Q = E`"],
              reponse: 0,
              explication: "Tous les points de même amplitude `E` sont sur le cercle de rayon `E`, car `I² + Q² = E²`."
            },
            {
              enonce: "Qu'appelle-t-on diagramme de constellation ?",
              choix: [
                "L'ensemble des points de constellation dans le plan IQ",
                "Le spectre du signal modulé",
                "Le chronogramme du message binaire",
                "La table de correspondance des caractères ASCII"
              ],
              reponse: 0
            },
            {
              enonce: "Que vaut `s(t)` pendant la transmission d'un 0 en modulation OOK ?",
              choix: ["0 V", "`E`", "`−E`", "`E/2`"],
              reponse: 0,
              explication: "OOK (On-Off Keying) est une ASK où l'amplitude du 0 est nulle."
            },
            {
              enonce: "En QPSK, avec une rapidité de modulation de `fr` symboles/s, le débit binaire vaut :",
              choix: ["`2·fr` bits/s", "`fr` bits/s", "`4·fr` bits/s", "`fr / 2` bits/s"],
              reponse: 0,
              explication: "Chaque symbole QPSK porte 2 bits."
            },
            {
              enonce: "Combien de bits porte un symbole 8PSK ?",
              choix: ["3", "8", "2", "4"],
              reponse: 0,
              explication: "`2³ = 8` états."
            },
            {
              enonce: "Qu'est-ce qu'un symbole ?",
              choix: [
                "L'ensemble des bits transmis pendant une durée élémentaire `Tr`",
                "Un bit de parité",
                "Un point de la porteuse",
                "Un caractère ASCII"
              ],
              reponse: 0
            },
            {
              enonce: "En DBPSK, la transmission d'un 1 correspond à :",
              choix: [
                "une rotation de phase de `π` par rapport au symbole précédent",
                "la phase absolue `π`",
                "la conservation de la phase précédente",
                "une rotation de `π/2`"
              ],
              reponse: 0,
              explication: "Une modulation différentielle code l'écart de phase `Δφ = φn − φn−1`, pas la phase absolue."
            },
            {
              enonce: "Pourquoi utilise-t-on la QAM plutôt qu'une 32PSK ?",
              choix: [
                "En 32PSK, les points seraient séparés de 11,25° seulement : la démodulation serait peu fiable",
                "La 32PSK est interdite par la norme",
                "La QAM n'utilise qu'une seule amplitude",
                "La 32PSK ne peut pas transmettre plus de 4 bits par symbole"
              ],
              reponse: 0
            },
            {
              enonce: "Dans la constellation 16QAM du cours, les abscisses des points ne peuvent prendre que les valeurs :",
              choix: ["`±E` et `±E/3`", "`±E` et `0`", "`±E/2` et `±E/4`", "`E0`, `E1` et `E2`"],
              reponse: 0,
              explication: "Les points sont répartis sur 3 cercles : le signal a trois amplitudes possibles."
            },
            {
              enonce: "Combien de bits porte un symbole 256QAM ?",
              choix: ["8", "16", "256", "6"],
              reponse: 0
            },
            {
              enonce: "Qu'est-ce qu'une modulation MSK ?",
              choix: [
                "Une FSK à phase continue dont l'excursion est minimale : `Δf = fr/4`",
                "Une PSK à 16 états",
                "Une ASK à trois amplitudes",
                "Une FSK dont les fréquences sont très éloignées"
              ],
              reponse: 0,
              explication: "Phase continue si `Δf = k·fr/4` ; MSK pour `k = 1`. Alors `f0 = fC − fr/4` et `f1 = fC + fr/4`."
            },
            {
              enonce: "En MSK, que fait le point de constellation pendant la transmission d'un 0 ?",
              choix: [
                "Un quart de tour dans le sens horaire",
                "Un quart de tour dans le sens trigonométrique",
                "Un demi-tour",
                "Il reste immobile"
              ],
              reponse: 0,
              explication: "Pendant un 1, il fait un quart de tour dans le sens trigonométrique."
            },
            {
              enonce: "Comment visualiser un diagramme de constellation à l'oscilloscope ?",
              choix: [
                "En mode XY, voie I sur X et voie Q sur Y",
                "En mode temporel sur la voie I seule",
                "Avec un analyseur de spectre",
                "En mode XY, porteuse sur X et signal modulé sur Y"
              ],
              reponse: 0
            },
            {
              enonce: "Que contient un modulateur IQ ?",
              choix: [
                "Deux multiplieurs, un déphaseur de `π/2` et un additionneur",
                "Un seul oscillateur à fréquence variable",
                "Un redresseur et un onduleur",
                "Un convertisseur analogique-numérique par bit"
              ],
              reponse: 0,
              explication: "`s(t) = I·cos(2πfCt) + Q·cos(2πfCt + π/2)` : les deux voies sont modulées puis additionnées."
            }
          ]
        },

        {
          type: "probleme",
          id: "num-ask",
          titre: "Modulation ASK : décoder un chronogramme",
          description: "Message, débit binaire et fréquence de porteuse à partir du tracé.",
          exemple: {
            enonce: [
              "On considère le signal ASK ci-dessous (1 carreau = 0,1 ms).",
              [
                "Trouvez le message binaire associé au signal.",
                "Déterminez le débit binaire `D`.",
                "Déterminez la fréquence de la porteuse `fp`."
              ]
            ],
            schema: { type: "numerique", modulation: "ask", bits: "1010010111", entete: "1????????1", carreauxParBit: 2, cycles: 4, echelle: "1 carreau = 0,1 ms" },
            formuleTitre: "Rédaction",
            formule: [
              "Grande amplitude = 1, petite amplitude = 0 : message `1 0 1 0 0 1 0 1 1 1`.",
              "Un bit dure 2 carreaux : `Tb = 2 × 0,1 ms = 0,2 ms`, donc `D = 1 / Tb = 1 / 0,0002 = 5 000 bit/s`.",
              "On compte 4 cycles de porteuse par bit : `Tc = 0,2 ms / 4 = 0,05 ms`, donc `fp = 1 / 5·10⁻⁵ = 20 kHz`."
            ],
            reponse: [["Message : `1010010111`", "`D = 5 kbit/s`", "`fp = 20 kHz`"]]
          },
          exercice: {
            enonce: "Voici un nouveau signal ASK. Cette fois, **1 carreau = 0,05 ms**.",
            schema: { type: "numerique", modulation: "ask", bits: "01101110", entete: "0???????", carreauxParBit: 3, cycles: 6, echelle: "1 carreau = 0,05 ms" },
            champs: [
              { libelle: "Message binaire", reponse: "01101110" },
              { libelle: "Durée d'un bit `Tb`", reponse: 0.15, unite: "ms" },
              { libelle: "Débit binaire `D`", reponse: 6.667, unite: "kbit/s" },
              { libelle: "Fréquence de la porteuse `fp`", reponse: 40, unite: "kHz" }
            ],
            indice: "Comptez d'abord combien de carreaux dure un bit, puis combien de cycles de porteuse il contient.",
            solution: [
              [
                "Message : `0 1 1 0 1 1 1 0`.",
                "Un bit dure 3 carreaux : `Tb = 3 × 0,05 = 0,15 ms`.",
                "`D = 1 / 0,15·10⁻³ ≈ 6 667 bit/s ≈ 6,67 kbit/s`.",
                "6 cycles par bit : `Tc = 0,15 / 6 = 0,025 ms`, `fp = 1 / 2,5·10⁻⁵ = 40 kHz`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "num-fsk",
          titre: "Modulation FSK : deux fréquences",
          description: "Retrouver f0, f1, la porteuse et l'excursion.",
          exemple: {
            enonce: [
              "On considère le signal FSK ci-dessous (1 carreau = 0,1 ms).",
              [
                "Trouvez le message binaire associé au signal.",
                "Déterminez le débit binaire `D`.",
                "Déterminez les fréquences `f1` et `f0` correspondant au bit 1 et au bit 0."
              ]
            ],
            schema: { type: "numerique", modulation: "fsk", bits: "1010010111", entete: "10???????1", carreauxParBit: 2, cycles: { 0: 2, 1: 4 }, echelle: "1 carreau = 0,1 ms" },
            formuleTitre: "Rédaction",
            formule: [
              "Porteuse rapide = 1, porteuse lente = 0 : message `1 0 1 0 0 1 0 1 1 1`.",
              "`Tb = 2 × 0,1 ms = 0,2 ms`, donc `D = 5 kbit/s`.",
              "Bit 1 : 4 cycles, `T1 = 0,2 / 4 = 0,05 ms`, `f1 = 20 kHz`.",
              "Bit 0 : 2 cycles, `T0 = 0,2 / 2 = 0,1 ms`, `f0 = 10 kHz`."
            ],
            reponse: [["Message : `1010010111`", "`D = 5 kbit/s`", "`f1 = 20 kHz`, `f0 = 10 kHz`"]]
          },
          exercice: {
            enonce: "Voici un signal FSK dont **1 carreau = 0,25 ms**. Déterminez aussi la porteuse `fC` et l'excursion `Δf` telles que `f0 = fC − Δf` et `f1 = fC + Δf`.",
            schema: { type: "numerique", modulation: "fsk", bits: "11001010", entete: "1???????", carreauxParBit: 2, cycles: { 0: 2, 1: 3 }, echelle: "1 carreau = 0,25 ms" },
            champs: [
              { libelle: "Message binaire", reponse: "11001010" },
              { libelle: "Débit binaire `D`", reponse: 2, unite: "kbit/s" },
              { libelle: "Fréquence `f1` (bit 1)", reponse: 6, unite: "kHz" },
              { libelle: "Fréquence `f0` (bit 0)", reponse: 4, unite: "kHz" },
              { libelle: "Porteuse `fC`", reponse: 5, unite: "kHz" },
              { libelle: "Excursion `Δf`", reponse: 1, unite: "kHz" }
            ],
            indice: "`fC = (f0 + f1) / 2`.",
            solution: [
              [
                "Message : `1 1 0 0 1 0 1 0`.",
                "`Tb = 2 × 0,25 = 0,5 ms`, `D = 1 / 0,5·10⁻³ = 2 kbit/s`.",
                "Bit 1 : 3 cycles, `f1 = 3 / 0,5 ms = 6 kHz`. Bit 0 : 2 cycles, `f0 = 2 / 0,5 ms = 4 kHz`.",
                "`fC = (4 + 6) / 2 = 5 kHz` et `Δf = 6 − 5 = 1 kHz`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "num-psk",
          titre: "PSK et PSK différentielle",
          description: "Lire les sauts de phase, puis décoder en DBPSK.",
          exemple: {
            enonce: [
              "On considère le signal PSK ci-dessous (1 carreau = 0,1 ms). Un 0 est émis avec la phase 0, un 1 avec la phase `π`.",
              [
                "Trouvez le message binaire associé au signal.",
                "Déterminez le débit binaire `D`.",
                "Déterminez la fréquence de la porteuse `fp`."
              ]
            ],
            schema: { type: "numerique", modulation: "psk", bits: "1010010111", entete: "101?????11", carreauxParBit: 2, cycles: 2, echelle: "1 carreau = 0,1 ms" },
            formuleTitre: "Rédaction",
            formule: [
              "Chaque saut de phase se voit comme une cassure de la sinusoïde à la frontière entre deux bits. En partant du premier bit (1, phase `π`) et en suivant les sauts : `1 0 1 0 0 1 0 1 1 1`.",
              "`Tb = 2 × 0,1 ms = 0,2 ms`, donc `D = 5 kbit/s`.",
              "2 cycles par bit : `Tc = 0,2 / 2 = 0,1 ms`, `fp = 10 kHz`."
            ],
            reponse: [["Message : `1010010111`", "`D = 5 kbit/s`", "`fp = 10 kHz`"]]
          },
          exercice: {
            enonce: [
              "Le signal ci-dessous est une modulation **DBPSK** (1 carreau = 0,05 ms) : un 0 conserve la phase précédente, un 1 la fait tourner de `π`. Juste avant le premier bit, la phase vaut 0.",
              "Donnez le message transmis, puis celui qu'on lirait à tort en le décodant comme une BPSK (phase `π` = 1)."
            ],
            schema: { type: "numerique", modulation: "psk", bits: "1011001", phases: [180, 180, 0, 180, 180, 180, 0], entete: false, carreauxParBit: 2, cycles: 3, echelle: "1 carreau = 0,05 ms" },
            champs: [
              { libelle: "Message DBPSK transmis", reponse: "1011001" },
              { libelle: "Message lu à tort en BPSK", reponse: "1101110" },
              { libelle: "Débit binaire `D`", reponse: 10, unite: "kbit/s" },
              { libelle: "Fréquence de la porteuse `fp`", reponse: 30, unite: "kHz" }
            ],
            indice: "Repérez les cassures entre deux bits : une cassure = un 1 en DBPSK. Le premier bit se compare à la phase 0 de départ.",
            solution: [
              "Phases des 7 bits : `π, π, 0, π, π, π, 0`.",
              [
                "DBPSK : on compare chaque phase à la précédente (0 au départ). Changement = 1, pas de changement = 0 : `1 0 1 1 0 0 1`.",
                "BPSK : phase `π` = 1, phase 0 = 0 : `1 1 0 1 1 1 0`.",
                "`Tb = 2 × 0,05 = 0,1 ms`, `D = 10 kbit/s`.",
                "3 cycles par bit : `fp = 3 / 0,1 ms = 30 kHz`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "num-constellation",
          titre: "Diagramme de constellation",
          description: "Affecter des bits aux symboles et calculer leurs coordonnées IQ.",
          exemple: {
            enonce: [
              "Un système utilise une constellation à 8 points répartis uniformément sur un cercle (8-PSK), d'amplitude commune `A`.",
              [
                "Affectez des bits à chaque symbole.",
                "Écrivez l'équation de chacun des symboles."
              ]
            ],
            schema: {
              type: "constellation",
              points: [
                { i: 1, q: 0, etiquette: "000" },
                { i: 0.7071, q: 0.7071, etiquette: "001" },
                { i: 0, q: 1, etiquette: "011" },
                { i: -0.7071, q: 0.7071, etiquette: "010" },
                { i: -1, q: 0, etiquette: "110" },
                { i: -0.7071, q: -0.7071, etiquette: "111" },
                { i: 0, q: -1, etiquette: "101" },
                { i: 0.7071, q: -0.7071, etiquette: "100" }
              ]
            },
            formuleTitre: "Rédaction",
            formule: [
              "8 = 2³ : chaque symbole porte **3 bits**. On utilise un code de Gray : deux symboles voisins ne diffèrent que d'un bit, si bien qu'une erreur sur un voisin ne coûte qu'un bit.",
              "Angle du symbole `k` : `θk = 2πk / 8 = kπ/4`, pour `k = 0 … 7`.",
              "Chaque symbole s'écrit `Sk = A·e^(jθk) = A(cos θk + j sin θk)` :",
              {
                entetes: ["k", "θk", "Bits", "Sk"],
                lignes: [
                  ["0", "0", "000", "`A(1 + j0)`"],
                  ["1", "π/4", "001", "`A(√2/2 + j√2/2)`"],
                  ["2", "π/2", "011", "`A(0 + j1)`"],
                  ["3", "3π/4", "010", "`A(−√2/2 + j√2/2)`"],
                  ["4", "π", "110", "`A(−1 + j0)`"],
                  ["5", "5π/4", "111", "`A(−√2/2 − j√2/2)`"],
                  ["6", "3π/2", "101", "`A(0 − j1)`"],
                  ["7", "7π/4", "100", "`A(√2/2 − j√2/2)`"]
                ]
              }
            ],
            reponse: "Les 8 symboles de 3 bits en code de Gray, `Sk = A·e^(jkπ/4)`."
          },
          exercice: {
            enonce: [
              "Une modulation QPSK utilise la constellation ci-dessous, de rayon `E = √2 V` : 00 → `+π/4`, 01 → `+3π/4`, 10 → `−π/4`, 11 → `−3π/4`.",
              "On transmet le message `1000011110` à la rapidité de 2 000 symboles/s."
            ],
            schema: {
              type: "constellation",
              graduations: [[1, "1"], [-1, "−1"]],
              points: [
                { i: 1, q: 1, etiquette: "00" },
                { i: -1, q: 1, etiquette: "01" },
                { i: 1, q: -1, etiquette: "10" },
                { i: -1, q: -1, etiquette: "11" }
              ]
            },
            champs: [
              { libelle: "Composante `I` du symbole 01", reponse: -1, unite: "V" },
              { libelle: "Composante `Q` du symbole 01", reponse: 1, unite: "V" },
              { libelle: "Nombre de symboles pour transmettre le message", reponse: 5, tolerance: 0 },
              { libelle: "Phase du 4ᵉ symbole transmis", reponse: -135, accepte: [225], unite: "°" },
              { libelle: "Débit binaire en QPSK", reponse: 4, unite: "kbit/s" },
              { libelle: "Débit binaire en 8PSK à la même rapidité", reponse: 6, unite: "kbit/s" }
            ],
            indice: "`I = E cos φ`, `Q = E sin φ`. Découpez le message en paquets de 2 bits.",
            solution: [
              [
                "Symbole 01 : `φ = 3π/4`, `I = √2 cos(3π/4) = −1 V`, `Q = √2 sin(3π/4) = 1 V`.",
                "Message découpé : `10 | 00 | 01 | 11 | 10` → 5 symboles.",
                "4ᵉ symbole : `11` → `−3π/4 = −135°` (ou 225°).",
                "QPSK : 2 bits par symbole, `D = 2 × 2 000 = 4 kbit/s`.",
                "8PSK : 3 bits par symbole, `D = 3 × 2 000 = 6 kbit/s`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "num-qam",
          titre: "Débit, valence et QAM",
          description: "Relier bits par symbole, rapidité de modulation et amplitudes d'une 16QAM.",
          exemple: {
            enonce: [
              "Une liaison utilise une modulation 16QAM à la rapidité de 2,5 Msymboles/s (2,5 Mbauds).",
              [
                "Combien de bits porte chaque symbole ?",
                "Quel est le débit binaire ?",
                "Quel écart angulaire séparerait deux points d'une 16PSK ?"
              ]
            ],
            schema: {
              type: "constellation", cercle: false, rayon: 1.5,
              graduations: [[1, "E"], [0.3333, "E/3"], [-0.3333, "−E/3"], [-1, "−E"]],
              points: [-1, -0.3333, 0.3333, 1].flatMap((i) => [-1, -0.3333, 0.3333, 1].map((q) => ({ i, q })))
            },
            formuleTitre: "Rédaction",
            formule: [
              "Un symbole à `M` états porte `n = log₂(M)` bits : `log₂(16) = 4` bits.",
              "Le débit binaire vaut `D = n × R` où `R` est la rapidité de modulation : `D = 4 × 2,5·10⁶ = 10 Mbit/s`.",
              "En 16PSK, les 16 points sont sur un seul cercle : `360° / 16 = 22,5°`. La 16QAM les répartit sur 3 cercles pour les écarter davantage."
            ],
            reponse: [["4 bits par symbole", "`D = 10 Mbit/s`", "22,5° en 16PSK"]]
          },
          exercice: {
            enonce: [
              "Répondez aux questions suivantes.",
              [
                "Une liaison 256QAM fonctionne à 5 Mbauds.",
                "On veut 60 Mbit/s avec une rapidité de 10 Mbauds : quel nombre d'états `M` faut-il ?",
                "On envisage une 32PSK.",
                "Dans la 16QAM ci-dessus, les coordonnées valent `±E` ou `±E/3`, avec `E = 3 V`."
              ]
            ],
            champs: [
              { libelle: "Débit de la liaison 256QAM", reponse: 40, unite: "Mbit/s" },
              { libelle: "Nombre d'états `M` nécessaire", reponse: 64, tolerance: 0 },
              { libelle: "Écart angulaire entre deux points de la 32PSK", reponse: 11.25, unite: "°" },
              { libelle: "Amplitude maximale `E2` du signal 16QAM", reponse: 4.243, unite: "V" },
              { libelle: "Amplitude minimale `E0` du signal 16QAM", reponse: 1.414, unite: "V" }
            ],
            indice: "`D = log₂(M) × R`. L'amplitude d'un point `(I, Q)` vaut `√(I² + Q²)`.",
            solution: [
              [
                "256QAM : `log₂(256) = 8` bits, `D = 8 × 5 = 40 Mbit/s`.",
                "`n = 60 / 10 = 6` bits par symbole, `M = 2⁶ = 64` (64QAM).",
                "`360° / 32 = 11,25°` : points trop proches, d'où le recours à la QAM.",
                "Point le plus éloigné `(E, E)` : `E2 = E√2 = 3√2 ≈ 4,24 V`.",
                "Point le plus proche `(E/3, E/3)` : `E0 = √2 ≈ 1,41 V`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "num-msk",
          titre: "Modulation MSK",
          description: "Fréquences d'une FSK à phase continue et trajet du point de constellation.",
          exemple: {
            enonce: [
              "Une modulation MSK a une porteuse `fC = 100 kHz` et un débit de 20 kbit/s.",
              [
                "Quelle est l'excursion de fréquence `Δf` ?",
                "Quelles sont les fréquences `f0` et `f1` ?",
                "En partant de la phase 0, quelle est la phase après le message `10010` ?"
              ]
            ],
            schema: {
              type: "constellation",
              points: [
                { i: 1, q: 0, etiquette: "0°" },
                { i: 0, q: 1, etiquette: "+90°" },
                { i: 0, q: -1, etiquette: "−90°" }
              ],
              legende: "Pour `10010`, le point passe par +90°, 0°, −90°, 0° puis −90° : il parcourt le demi-cercle droit."
            },
            formuleTitre: "Rédaction",
            formule: [
              "En MSK, `Δf = fr / 4` : `Δf = 20 / 4 = 5 kHz`.",
              "`f0 = fC − fr/4 = 95 kHz` et `f1 = fC + fr/4 = 105 kHz`.",
              "Pendant un 1, le point fait un quart de tour dans le sens trigonométrique (+90°) ; pendant un 0, un quart de tour dans le sens horaire (−90°).",
              "`10010` : `+90 − 90 − 90 + 90 − 90 = −90°`."
            ],
            reponse: [["`Δf = 5 kHz`", "`f0 = 95 kHz`, `f1 = 105 kHz`", "phase finale `−90°`"]]
          },
          exercice: {
            enonce: "Un signal MSK utilise `f0 = 49 kHz` pour le bit 0 et `f1 = 51 kHz` pour le bit 1. Le message `1101` est transmis à partir de la phase 0.",
            champs: [
              { libelle: "Porteuse `fC`", reponse: 50, unite: "kHz" },
              { libelle: "Excursion `Δf`", reponse: 1, unite: "kHz" },
              { libelle: "Débit binaire", reponse: 4, unite: "kbit/s" },
              { libelle: "Phase après le message `1101`", reponse: 180, accepte: [-180], unite: "°" },
              { libelle: "Nombre de quarts de tour effectués dans le sens horaire", reponse: 1, tolerance: 0 }
            ],
            indice: "`fC = (f0 + f1)/2`, puis `Δf = fr / 4`. Un 1 ajoute +90°, un 0 retire 90°.",
            solution: [
              [
                "`fC = (49 + 51) / 2 = 50 kHz`, `Δf = 51 − 50 = 1 kHz`.",
                "`fr = 4·Δf = 4 kbit/s`.",
                "Phases successives : `+90°`, `+180°`, `+90°`, `+180°`. Phase finale : 180°.",
                "Un seul 0 dans le message : un seul quart de tour dans le sens horaire."
              ]
            ]
          }
        }
      ]
    },

    /* ========================================================
       CHAPITRE 4 — Chaîne physique et supports de transmission
       ======================================================== */
    {
      id: "supports",
      titre: "Chapitre 4 — Chaîne physique et supports de transmission",
      description: "Réseaux physiques, fibre, paire torsadée, coaxial, débits et dimensionnement.",
      exercices: [

        {
          type: "qcm",
          id: "sup-qcm-chaine",
          titre: "QCM — Chaîne physique des réseaux",
          description: "Câbles sous-marins, backbone, POP, FTTx et équipements.",
          melangerChoix: true,
          questions: [
            {
              enonce: "Quelle part du trafic internet mondial transite par les câbles sous-marins ?",
              choix: ["Près de 99 %", "Environ 50 %", "Environ 10 %", "Moins de 1 %"],
              reponse: 0,
              explication: "Par plus de 500 câbles (2025)."
            },
            {
              enonce: "Quel est le pivot mondial du réseau de câbles sous-marins ?",
              choix: ["Le binôme Singapour – Malacca", "New York", "Le détroit de Gibraltar", "Hawaï"],
              reponse: 0,
              explication: "46 câbles entrants ou sortants. Hawaï est central pour le Pacifique, New York pour l'Atlantique."
            },
            {
              enonce: "Qu'est-ce qu'un PoP (Point of Presence) ?",
              choix: [
                "Un site physique où un opérateur installe ses équipements pour se connecter à d'autres réseaux",
                "Un protocole de messagerie",
                "Un câble sous-marin intercontinental",
                "Un serveur de noms de domaine"
              ],
              reponse: 0
            },
            {
              enonce: "Qu'est-ce qu'un nœud IP ?",
              choix: [
                "Un équipement réseau, souvent un routeur de grande capacité, qui choisit la route des paquets",
                "Un point où la lumière est amplifiée dans une fibre",
                "Une adresse IP publique",
                "Un commutateur d'étage"
              ],
              reponse: 0,
              explication: "Le nœud **optique**, lui, distribue, amplifie ou convertit le signal lumineux."
            },
            {
              enonce: "Comment appelle-t-on le réseau à haute capacité qui relie régions, datacenters et FAI ?",
              choix: ["Le backbone (réseau de transport)", "Le réseau d'accès", "Le réseau de distribution", "Le LAN"],
              reponse: 0
            },
            {
              enonce: "Le réseau d'accès est aussi appelé :",
              choix: ["le dernier kilomètre", "l'épine dorsale", "le cœur de réseau", "le réseau métropolitain"],
              reponse: 0
            },
            {
              enonce: "En FTTB, jusqu'où arrive la fibre ?",
              choix: [
                "Au pied de l'immeuble ; la suite est en paire de cuivre",
                "Jusqu'aux prises murales de l'abonné",
                "Au sous-répartiteur, la suite étant en VDSL2",
                "Au bureau d'une entreprise"
              ],
              reponse: 0,
              explication: "FTTH : jusqu'à la prise. FTTC : jusqu'au sous-répartiteur. FTTO : FTTH pour les entreprises."
            },
            {
              enonce: "Sur quel phénomène repose la propagation dans une fibre optique ?",
              choix: ["La réflexion totale interne", "L'induction électromagnétique", "L'effet Hall", "La diffraction"],
              reponse: 0
            },
            {
              enonce: "À quoi sert essentiellement la gaine optique ?",
              choix: [
                "Porter le diamètre à 125 µm pour des raisons mécaniques",
                "Amplifier le signal",
                "Protéger contre l'humidité",
                "Convertir la lumière en signal électrique"
              ],
              reponse: 0,
              explication: "C'est le revêtement qui protège la fibre."
            },
            {
              enonce: "Quelle affirmation décrit la fibre monomode ?",
              choix: [
                "Cœur de moins de 10 µm, émetteur laser, très faible dispersion, longues distances",
                "Cœur de 50 à 200 µm, émetteur LED, courtes distances",
                "Plusieurs chemins de lumière, peu coûteuse",
                "Réservée aux réseaux locaux"
              ],
              reponse: 0
            },
            {
              enonce: "Quelle est la principale cause de rupture des fibres optiques ?",
              choix: [
                "Les travaux de génie civil (plus de 95 %)",
                "La corrosion par l'humidité",
                "Le vieillissement du verre",
                "Les rongeurs"
              ],
              reponse: 0
            },
            {
              enonce: "Quelle longueur d'un seul tenant peut dépasser un câble à fibres optiques, contre 300 m pour un coaxial ?",
              choix: ["4 800 m", "1 000 m", "100 m", "50 km"],
              reponse: 0
            },
            {
              enonce: "Quelle fonction assure un routeur, et non un commutateur ?",
              choix: [
                "La translation d'adresses (NAT)",
                "Le filtrage par adresses MAC",
                "La segmentation d'un LAN pour réduire les collisions",
                "L'agrégation de ports"
              ],
              reponse: 0
            },
            {
              enonce: "Quel est le rôle d'un modem ?",
              choix: [
                "Convertir les signaux numériques en signaux analogiques et inversement",
                "Attribuer des adresses IP",
                "Relier plusieurs appareils d'un même LAN",
                "Stocker les données d'un site web"
              ],
              reponse: 0
            },
            {
              enonce: "Pourquoi l'ADSL est-il dit asymétrique ?",
              choix: [
                "Le débit descendant est plus élevé que le débit montant",
                "Il utilise deux paires de fils différentes",
                "Il fonctionne seulement dans un sens",
                "Le téléphone et internet ne peuvent pas fonctionner en même temps"
              ],
              reponse: 0
            },
            {
              enonce: "Sur quelle bande de fréquence fonctionne le Bluetooth ?",
              choix: ["2,4 GHz", "900 MHz", "5 GHz uniquement", "88 – 108 MHz"],
              reponse: 0
            }
          ]
        },

        {
          type: "qcm",
          id: "sup-qcm-supports",
          titre: "QCM — Supports et interfaces filaires",
          description: "Paire torsadée, coaxial, fibre, Ethernet, USB et attaques.",
          melangerChoix: true,
          questions: [
            {
              enonce: "Pourquoi les deux conducteurs d'une paire torsadée sont-ils enroulés en hélice ?",
              choix: [
                "Pour limiter la sensibilité aux interférences et la diaphonie",
                "Pour augmenter la longueur du câble",
                "Pour réduire le poids",
                "Pour permettre la transmission de lumière"
              ],
              reponse: 0
            },
            {
              enonce: "Que signifie UTP ?",
              choix: [
                "Unshielded Twisted Pair : paire torsadée non blindée",
                "Universal Transmission Protocol",
                "Unified Twisted Port",
                "Paire torsadée blindée globalement"
              ],
              reponse: 0
            },
            {
              enonce: "Dans S/FTP, que désignent S et F ?",
              choix: [
                "S : blindage global ; F : blindage (écrantage) de chaque paire",
                "S : paire simple ; F : fibre",
                "S : câble souple ; F : câble fixe",
                "S : standard ; F : rapide"
              ],
              reponse: 0,
              explication: "U = non blindé, S = blindage global (tresse), F = feuille (écran)."
            },
            {
              enonce: "Quel connecteur utilise la paire torsadée en réseau informatique ?",
              choix: ["RJ-45", "RJ-11", "BNC", "SC"],
              reponse: 0,
              explication: "Le RJ-11, plus petit, sert au téléphone."
            },
            {
              enonce: "Que définit la catégorie d'un câble RJ-45 ?",
              choix: [
                "Le débit maximal qu'il transporte sans erreur",
                "Sa longueur",
                "Sa couleur",
                "Le nombre de connecteurs"
              ],
              reponse: 0
            },
            {
              enonce: "Dans quel ordre, du centre vers l'extérieur, est constitué un câble coaxial ?",
              choix: [
                "Âme, diélectrique, tresse conductrice, gaine",
                "Tresse, âme, gaine, diélectrique",
                "Cœur, gaine optique, revêtement",
                "Âme, gaine, diélectrique, tresse"
              ],
              reponse: 0
            },
            {
              enonce: "Quelle impédance de coaxial est utilisée pour les données numériques, et laquelle pour l'analogique (TV) ?",
              choix: ["50 Ω numérique, 75 Ω analogique", "75 Ω numérique, 50 Ω analogique", "100 Ω pour les deux", "120 Ω numérique, 50 Ω analogique"],
              reponse: 0
            },
            {
              enonce: "Quelle bande passante le cours donne-t-il pour le câble coaxial ?",
              choix: ["400 MHz", "4 GHz", "40 kHz", "10 GHz·km"],
              reponse: 0,
              explication: "Pour une capacité de 10 à 100 Mbit/s."
            },
            {
              enonce: "Dans quelles versions d'Ethernet utilisait-on le câble coaxial ?",
              choix: ["10BASE2 et 10BASE5", "100BASE-TX", "1000BASE-T", "10GBASE-SR"],
              reponse: 0
            },
            {
              enonce: "Quelle bande passante typique pour une fibre multimode et pour une monomode ?",
              choix: [
                "200 à 600 MHz·km en multimode, plus de 10 GHz·km en monomode",
                "Plus de 10 GHz·km en multimode, 200 à 600 MHz·km en monomode",
                "400 MHz dans les deux cas",
                "1 Gbit/s dans les deux cas"
              ],
              reponse: 0
            },
            {
              enonce: "Qu'est-ce que le multiplexage WDM ?",
              choix: [
                "Faire passer plusieurs longueurs d'onde (couleurs) dans une même fibre",
                "Découper l'information en morceaux envoyés les uns après les autres",
                "Utiliser plusieurs fibres en parallèle",
                "Moduler l'amplitude de la lumière"
              ],
              reponse: 0,
              explication: "Découper dans le temps, c'est le TDM."
            },
            {
              enonce: "Quel avantage de la fibre permet de relier deux points à des potentiels électriques différents ?",
              choix: ["L'isolation électrique", "La légèreté", "Le faible coût", "La facilité de raccordement"],
              reponse: 0
            },
            {
              enonce: "Que définit la norme IEEE 802.3 ?",
              choix: [
                "La couche physique et la sous-couche MAC d'Ethernet",
                "Le Wi-Fi",
                "Le protocole IP",
                "Le Bluetooth"
              ],
              reponse: 0
            },
            {
              enonce: "Quel est un des grands atouts d'Ethernet selon le cours ?",
              choix: [
                "Sa compatibilité ascendante : le format de trame de base reste reconnaissable",
                "Il n'utilise que la fibre optique",
                "Il est chiffré par défaut",
                "Il fonctionne uniquement en WAN"
              ],
              reponse: 0
            },
            {
              enonce: "Qu'est-ce qu'une attaque BadUSB ?",
              choix: [
                "Un périphérique USB dont le firmware a été modifié",
                "Le vol de données sur une borne de recharge publique",
                "L'écoute du trafic Ethernet",
                "Une surtension envoyée par le port USB"
              ],
              reponse: 0,
              explication: "Le vol via une borne publique s'appelle le juice jacking."
            },
            {
              enonce: "Quelle attaque vise spécifiquement un réseau Ethernet local ?",
              choix: ["L'ARP spoofing (homme du milieu)", "Le juice jacking", "BadUSB", "Le brouillage FM"],
              reponse: 0
            }
          ]
        },

        {
          type: "probleme",
          id: "sup-debit-utile",
          titre: "Débit utile d'une liaison multiplexée",
          description: "Capacité totale, part réservée et débit disponible pour les usagers.",
          exemple: {
            enonce: "Une fibre optique transporte 10 canaux de 15 Gbit/s chacun. 30 % de la capacité est réservée aux flux de gestion et à la redondance. Quel est le débit utile agrégé théorique pour les usagers ?",
            schema: {
              type: "chaine",
              blocs: ["10 canaux\n15 Gbit/s chacun", "Fibre\n150 Gbit/s", "Usagers\n105 Gbit/s"],
              liens: ["multiplexage", "− 30 %"],
              accent: 1
            },
            formuleTitre: "Rédaction",
            formule: [
              "`D_total = nombre de canaux × débit par canal = 10 × 15 = 150 Gbit/s`.",
              "`D_réservé = D_total × pourcentage = 150 × 0,3 = 45 Gbit/s`.",
              "`D_utile = D_total − D_réservé = 150 − 45 = 105 Gbit/s = 0,105 Tbit/s`."
            ],
            reponse: "`D_utile = 105 Gbit/s`."
          },
          exercice: {
            enonce: "Une fibre WDM transporte 40 longueurs d'onde à 10 Gbit/s. 25 % de la capacité est réservée à la redondance, puis l'en-tête des protocoles consomme 8 % de ce qui reste. On y fait passer des flux vidéo 4K de 25 Mbit/s.",
            schema: {
              type: "chaine",
              blocs: ["40 λ\n10 Gbit/s", "Redondance\n− 25 %", "En-têtes\n− 8 %", "Flux 4K\n25 Mbit/s"],
              accent: 0
            },
            champs: [
              { libelle: "Capacité totale", reponse: 400, unite: "Gbit/s" },
              { libelle: "Débit après la réserve de redondance", reponse: 300, unite: "Gbit/s" },
              { libelle: "Débit utile final", reponse: 276, unite: "Gbit/s" },
              { libelle: "Nombre maximal de flux 4K simultanés", reponse: 11040, tolerance: 0 }
            ],
            indice: "Les deux pourcentages s'appliquent l'un après l'autre : `× 0,75` puis `× 0,92`.",
            solution: [
              [
                "`D_total = 40 × 10 = 400 Gbit/s`.",
                "Après la réserve : `400 × 0,75 = 300 Gbit/s`.",
                "Après les en-têtes : `300 × 0,92 = 276 Gbit/s`.",
                "`276 000 Mbit/s / 25 Mbit/s = 11 040` flux."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "sup-dimensionner",
          titre: "Dimensionner un câble",
          description: "Débit en pic de charge comparé à la capacité du support.",
          exemple: {
            enonce: "Un câble coaxial a une capacité maximale de 80 Mbit/s. Une application génère un débit moyen de 60 Mbit/s, avec +60 % en pic de charge. Le câble est-il adapté ?",
            formuleTitre: "Rédaction",
            formule: [
              "`D_max = D_moyen + D_moyen × augmentation = 60 + 60 × 0,6 = 96 Mbit/s`.",
              "`96 Mbit/s > 80 Mbit/s` : le câble sature en pic de charge.",
              "Il faut un support de plus grande capacité et mieux protégé contre les perturbations électromagnétiques : une paire torsadée blindée S/FTP (Ethernet) ou une fibre optique."
            ],
            reponse: "`D_max = 96 Mbit/s > 80 Mbit/s` : le câble **n'est pas adapté**."
          },
          exercice: {
            enonce: [
              "Un lien Ethernet de 1 Gbit/s dessert trois applications dont les débits moyens sont :",
              ["250 Mbit/s", "180 Mbit/s", "120 Mbit/s"],
              "En pic de charge, chaque débit augmente de 40 %."
            ],
            champs: [
              { libelle: "Débit moyen total", reponse: 550, unite: "Mbit/s" },
              { libelle: "Débit en pic de charge", reponse: 770, unite: "Mbit/s" },
              { libelle: "Taux d'occupation du lien en pic", reponse: 77, unite: "%" },
              { libelle: "Le lien suffit-il ? (oui / non)", reponse: "oui" },
              { libelle: "Augmentation maximale du débit moyen supportable avant saturation", reponse: 81.8, unite: "%" }
            ],
            indice: "Occupation = débit / capacité. Pour la dernière question, cherchez `x` tel que `550 × (1 + x) = 1 000`.",
            solution: [
              [
                "`250 + 180 + 120 = 550 Mbit/s`.",
                "`550 × 1,4 = 770 Mbit/s`.",
                "`770 / 1 000 = 77 %` : le lien suffit, avec 230 Mbit/s de marge.",
                "`1 + x = 1 000 / 550 ≈ 1,818`, donc `x ≈ 81,8 %`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "sup-transfert",
          titre: "Débit moyen et temps de transfert",
          description: "Volume, durée, efficacité d'un lien.",
          exemple: {
            enonce: [
              "Répondez aux deux questions (1 octet = 8 bits, 1 Go = 10⁹ octets, 1 ko = 1 000 octets).",
              [
                "Quel débit moyen faut-il pour envoyer 30 Go en 15 minutes ?",
                "Un lien de 5 Mbit/s a une efficacité de 40 %. Combien de temps faut-il pour envoyer 1 ko ?"
              ]
            ],
            formuleTitre: "Rédaction",
            formule: [
              "`D_moyen = volume / temps = (30 × 8) Gbit / (15 × 60) s = 240 / 900 ≈ 0,27 Gbit/s`.",
              "`D_utile = débit × efficacité = 5 × 0,4 = 2 Mbit/s`.",
              "`t = 1 000 × 8 / 2·10⁶ = 8 000 / 2 000 000 = 4 ms`."
            ],
            reponse: [["`D_moyen ≈ 0,27 Gbit/s` (267 Mbit/s)", "`t = 4 ms`"]]
          },
          exercice: {
            enonce: "Une sauvegarde de 120 Go (1 Go = 10⁹ octets) part vers un autre site. Sur le lien actuel de 1 Gbit/s, l'efficacité est de 85 %. On étudie aussi un lien fibre de 10 Gbit/s à 90 % d'efficacité.",
            champs: [
              { libelle: "Volume à transférer", reponse: 960, unite: "Gbit" },
              { libelle: "Débit utile du lien actuel", reponse: 850, unite: "Mbit/s" },
              { libelle: "Durée du transfert sur le lien actuel", reponse: 1129, unite: "s" },
              { libelle: "Durée du transfert sur la fibre", reponse: 106.7, unite: "s" },
              { libelle: "Débit moyen minimal pour finir en 10 minutes", reponse: 1.6, unite: "Gbit/s" }
            ],
            indice: "Convertissez d'abord les octets en bits ; `t = volume / débit utile`.",
            solution: [
              [
                "`120 × 8 = 960 Gbit`.",
                "`1 000 × 0,85 = 850 Mbit/s`.",
                "`t = 960·10⁹ / 850·10⁶ ≈ 1 129 s ≈ 18 min 49 s`.",
                "Fibre : `D_utile = 10 × 0,9 = 9 Gbit/s`, `t = 960 / 9 ≈ 106,7 s`.",
                "`960 Gbit / 600 s = 1,6 Gbit/s`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "sup-fibre-bp",
          titre: "Bande passante d'une fibre (MHz·km)",
          description: "Le produit bande passante × distance d'une fibre optique.",
          exemple: {
            enonce: "Une fibre multimode a une bande passante de 400 MHz·km. Quelle bande passante offre-t-elle sur une liaison de 2 km ? Et sur 250 m ?",
            formuleTitre: "Rédaction",
            formule: [
              "La bande passante d'une fibre s'exprime comme un produit **bande passante × longueur** : plus la liaison est longue, plus la bande disponible est faible.",
              "`BP(L) = BP_km / L`.",
              [
                "Sur 2 km : `400 / 2 = 200 MHz`.",
                "Sur 250 m : `400 / 0,25 = 1 600 MHz = 1,6 GHz`."
              ]
            ],
            reponse: [["200 MHz sur 2 km", "1,6 GHz sur 250 m"]]
          },
          exercice: {
            enonce: [
              "Répondez aux questions suivantes.",
              [
                "Une fibre multimode de 500 MHz·km doit offrir 1 GHz.",
                "Une fibre monomode de 10 GHz·km relie deux sites distants de 25 km.",
                "Un lien doit offrir 2 GHz sur 3 km. Les fibres multimodes font au mieux 600 MHz·km."
              ]
            ],
            champs: [
              { libelle: "Longueur maximale de la liaison multimode", reponse: 500, unite: "m" },
              { libelle: "Bande passante de la liaison monomode", reponse: 400, unite: "MHz" },
              { libelle: "Produit bande passante × longueur exigé par le lien de 3 km", reponse: 6, unite: "GHz·km" },
              { libelle: "Type de fibre nécessaire (multimode / monomode)", reponse: "monomode", accepte: ["mono"] }
            ],
            indice: "`L_max = BP_km / BP` et `BP = BP_km / L`.",
            solution: [
              [
                "`L = 500 MHz·km / 1 000 MHz = 0,5 km = 500 m`.",
                "`BP = 10 000 MHz·km / 25 km = 400 MHz`.",
                "`2 GHz × 3 km = 6 GHz·km`.",
                "`6 GHz·km > 600 MHz·km` : seule une fibre monomode convient."
              ]
            ]
          }
        }
      ]
    },

    /* ========================================================
       CHAPITRE 5 — Liaisons série : UART, I2C, SPI
       ======================================================== */
    {
      id: "serie",
      titre: "Chapitre 5 — Liaisons série : UART, I2C, SPI",
      description: "Trames UART et parité, niveaux RS-232, adresses I2C, câblage SPI.",
      exercices: [

        {
          type: "qcm",
          id: "serie-qcm",
          titre: "QCM — Liaisons série",
          description: "Questions de cours sur UART, RS-232, I2C et SPI.",
          melangerChoix: true,
          questions: [
            {
              enonce: "Pourquoi l'UART est-il dit « asynchrone » ?",
              choix: [
                "Aucun signal d'horloge ne cadence les échanges",
                "Les données circulent dans un seul sens",
                "Les bits sont envoyés en parallèle",
                "Il n'utilise pas de bit de start"
              ],
              reponse: 0
            },
            {
              enonce: "Comment relie-t-on deux éléments en UART ?",
              choix: [
                "TX du premier sur RX du second et inversement, plus la masse",
                "TX sur TX, RX sur RX",
                "SDA et SCL en commun",
                "MOSI, MISO, SCLK et SS"
              ],
              reponse: 0,
              explication: "Trois fils : deux fils de données croisés et un fil de masse."
            },
            {
              enonce: "Au repos, dans quel état est la ligne d'une liaison UART TTL ?",
              choix: ["Niveau haut (+Vcc)", "Niveau bas (0 V)", "Haute impédance", "Elle oscille à la fréquence de la porteuse"],
              reponse: 0
            },
            {
              enonce: "Quelle est la valeur du bit de start et du bit de stop ?",
              choix: ["Start = 0, stop = 1", "Start = 1, stop = 0", "Start = 1, stop = 1", "Start = 0, stop = 0"],
              reponse: 0
            },
            {
              enonce: "Dans quel ordre les bits de données sont-ils envoyés en UART ?",
              choix: ["Bit de poids faible (LSB) en premier", "Bit de poids fort (MSB) en premier", "Octet par octet en parallèle", "Dans un ordre aléatoire"],
              reponse: 0
            },
            {
              enonce: "En parité paire, le bit de parité est choisi pour que :",
              choix: [
                "le nombre total de 1 (données + parité) soit pair",
                "le nombre de 0 soit pair",
                "la valeur du mot soit paire",
                "le bit de parité vaille toujours 0"
              ],
              reponse: 0
            },
            {
              enonce: "Pourquoi le bit de parité ne suffit-il pas à garantir l'absence d'erreur ?",
              choix: [
                "Si deux bits sont inversés, la parité reste correcte",
                "Il n'est jamais transmis",
                "Il ne détecte que les erreurs de bit de stop",
                "Il n'existe qu'en parité impaire"
              ],
              reponse: 0,
              explication: "La parité détecte de façon fiable un seul bit retourné."
            },
            {
              enonce: "En UART, à quel débit correspondent 9 600 bauds ?",
              choix: ["9 600 bit/s", "1 200 bit/s", "76 800 bit/s", "960 bit/s"],
              reponse: 0,
              explication: "Dans ce cas précis, 1 baud = 1 bit par seconde (ce n'est pas vrai en général)."
            },
            {
              enonce: "En RS-232, quelle plage de tension représente un 0 logique ?",
              choix: ["+3 V à +15 V", "−3 V à −15 V", "0 V à +5 V", "−3 V à +3 V"],
              reponse: 0,
              explication: "Logique inversée : −3 V à −15 V représente un 1."
            },
            {
              enonce: "Quelles lignes utilise le bus I2C ?",
              choix: [
                "SDA (données) et SCL (horloge), plus une masse commune",
                "TX et RX",
                "MOSI, MISO, SCLK et SS",
                "D+ et D−"
              ],
              reponse: 0
            },
            {
              enonce: "Le bus I2C est :",
              choix: [
                "synchrone et half-duplex",
                "asynchrone et full-duplex",
                "synchrone et full-duplex",
                "asynchrone et simplex"
              ],
              reponse: 0
            },
            {
              enonce: "Comment le maître I2C désigne-t-il l'esclave auquel il s'adresse ?",
              choix: [
                "Par une adresse de 7 (ou 10) bits suivie d'un bit R/W",
                "Par un fil de sélection dédié",
                "Par sa position sur le bus",
                "Par l'adresse MAC de l'esclave"
              ],
              reponse: 0
            },
            {
              enonce: "Que doit-on prévoir sur SDA et SCL en I2C ?",
              choix: ["Une résistance de tirage (pull-up) sur chacune", "Un condensateur de découplage", "Un fil de sélection par esclave", "Rien de particulier"],
              reponse: 0,
              explication: "Valeur typique : 4,7 kΩ."
            },
            {
              enonce: "Que signifie MISO en SPI ?",
              choix: ["Master In Slave Out", "Master Input Serial Output", "Multiple Input Single Output", "Master Interrupt Slave Output"],
              reponse: 0,
              explication: "MOSI : Master Out Slave In. SCLK : horloge. SS (ou CS) : sélection de l'esclave."
            },
            {
              enonce: "Combien de fils faut-il en SPI pour piloter `n` esclaves (hors masse et alimentation) ?",
              choix: ["`3 + n`", "`2`", "`4`", "`2 + n`"],
              reponse: 0,
              explication: "SCLK, MOSI et MISO sont partagés ; chaque esclave a son propre fil SS."
            },
            {
              enonce: "Quel bus est full-duplex et transmet des données brutes (non encapsulées) ?",
              choix: ["SPI", "I2C", "Les deux", "Aucun des deux"],
              reponse: 0
            },
            {
              enonce: "Lequel de ces bus propose un accusé de réception (ACK/NACK) après chaque octet ?",
              choix: ["I2C", "UART", "SPI", "RS-232"],
              reponse: 0
            }
          ]
        },

        {
          type: "probleme",
          id: "serie-trame",
          titre: "Construire une trame UART",
          description: "Code ASCII, ordre LSB d'abord, bit de parité et durée de trame.",
          exemple: {
            enonce: "On veut envoyer la lettre capitale « S » en ASCII 7 bits, avec un bit de parité paire et un bit de stop. Écrivez la trame complète.",
            schema: {
              type: "trame",
              segments: [
                { bits: "0", role: "start" },
                { bits: "1100101", role: "données (LSB d'abord)" },
                { bits: "0", role: "parité" },
                { bits: "1", role: "stop" }
              ],
              niveaux: { haut: "+5 V", bas: "0 V" }
            },
            formuleTitre: "Rédaction",
            formule: [
              [
                "Table ASCII : « S » = 83 = `1010011` sur 7 bits.",
                "Les données partent bit de poids faible d'abord : on inverse l'ordre, `1100101`.",
                "`1010011` contient quatre 1 : nombre déjà pair, donc en parité paire le bit de parité vaut **0**.",
                "On encadre : start `0`, données, parité `0`, stop `1`."
              ]
            ],
            reponse: "Trame : `0 1100101 0 1`."
          },
          exercice: {
            enonce: "On envoie la lettre « K » en ASCII 7 bits, parité **impaire**, **2 bits de stop**, à 9 600 bauds.",
            champs: [
              { libelle: "Code ASCII de « K » (décimal)", reponse: 75, tolerance: 0 },
              { libelle: "Bits de données dans l'ordre d'envoi", reponse: "1101001" },
              { libelle: "Bit de parité", reponse: "1" },
              { libelle: "Trame complète (start → stop)", reponse: "01101001111" },
              { libelle: "Durée de la trame", reponse: 1.146, unite: "ms" }
            ],
            indice: "« A » vaut 65. En parité impaire, le nombre total de 1 doit être impair. Une trame compte start + 7 données + parité + 2 stops.",
            solution: [
              [
                "« K » = 75 = `1001011`.",
                "Ordre d'envoi (LSB d'abord) : `1101001`.",
                "Quatre 1 dans les données : pour un total impair, parité = **1**.",
                "Trame : `0` + `1101001` + `1` + `11` = `01101001111` (11 bits).",
                "`11 / 9 600 ≈ 1,146 ms`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "serie-decoder",
          titre: "Décoder une trame et vérifier la parité",
          description: "Retrouver le mot reçu et détecter (ou non) une erreur de transmission.",
          exemple: {
            enonce: [
              "Un système communique en RS-232 / UART avec 8 bits par mot, parité impaire et 1 bit d'arrêt.",
              [
                "Il reçoit la chaîne `01000010101`. Quel est le mot reçu ? Écrivez-le en hexadécimal.",
                "Il reçoit ensuite `01101111001`. Y a-t-il eu une erreur de transmission ?"
              ]
            ],
            schema: {
              type: "trame",
              segments: [
                { bits: "0", role: "start" },
                { bits: "10000101", role: "données (LSB d'abord)" },
                { bits: "0", role: "parité" },
                { bits: "1", role: "stop" }
              ],
              legende: "Première chaîne découpée en start, données, parité et stop."
            },
            formuleTitre: "Rédaction",
            formule: [
              { titre: "Première chaîne" },
              [
                "Découpage : start `0` | données `10000101` | parité `0` | stop `1`.",
                "Les données arrivent LSB d'abord : on les remet dans l'ordre, `10100001` = `0xA1`.",
                "Trois 1 dans les données : total déjà impair, la parité attendue est 0. Elle vaut bien 0 : pas d'erreur détectée."
              ],
              { titre: "Deuxième chaîne" },
              [
                "Découpage : start `0` | données `11011110` | parité `0` | stop `1`.",
                "Mot : `01111011` = `0x7B`, qui contient six 1.",
                "En parité impaire, il faudrait un bit de parité à 1 pour obtenir sept 1. Il vaut 0 : **erreur de transmission**."
              ]
            ],
            reponse: [["Premier mot : `0xA1`", "Deuxième chaîne : parité incorrecte, il y a eu une erreur"]]
          },
          exercices: [
            {
              enonce: [
                "Une liaison RS-232 utilise 7 bits par mot, parité paire et 2 bits d'arrêt. On relève le signal ci-dessous sur la ligne. Rappel : de +3 V à +15 V, c'est un 0 logique ; de −3 V à −15 V, un 1 logique."
              ],
              schema: {
                type: "trame", inverse: true, afficherBits: false, afficherRoles: false,
                segments: [{ bits: "0" }, { bits: "0101101" }, { bits: "0" }, { bits: "11" }],
                niveaux: { haut: "+12 V", bas: "−12 V" },
                legende: "Chaque pointillé délimite la durée d'un bit."
              },
              champs: [
                { libelle: "Bits logiques reçus, du start au dernier stop", reponse: "01011010011" },
                { libelle: "Mot reçu (hexadécimal)", reponse: "0x5A", accepte: ["5A", "5Ah", "0x5a"] },
                { libelle: "La parité est-elle correcte ? (oui / non)", reponse: "oui" }
              ],
              indice: "Tension haute = 0, tension basse = 1. La ligne au repos est au niveau logique 1.",
              solution: [
                [
                  "Lecture : `0 0101101 0 11`.",
                  "Données dans l'ordre d'arrivée `0101101`, remises dans l'ordre : `1011010` = `0x5A`.",
                  "Quatre 1 dans les données, parité paire attendue : 0. Reçu : 0, la parité est correcte."
                ]
              ]
            },
            {
              enonce: "Même liaison : 7 bits par mot, parité paire, 2 bits d'arrêt. Le système envoie la série `0–1–0–1–1–0–1–0–0–1–1`. De l'autre côté, le périphérique affirme avoir reçu le mot `0x39`.",
              champs: [
                { libelle: "Mot réellement envoyé (hexadécimal)", reponse: "0x2D", accepte: ["2D", "2Dh", "0x2d"] },
                { libelle: "Nombre de bits erronés entre le mot envoyé et 0x39", reponse: 2, tolerance: 0 },
                { libelle: "La parité permet-elle de détecter l'erreur ? (oui / non)", reponse: "non" }
              ],
              indice: "Écrivez `0x39` sur 7 bits et comparez bit à bit avec le mot envoyé.",
              solution: [
                [
                  "Découpage : start `0` | données `1011010` | parité `0` | stops `11`.",
                  "Données remises dans l'ordre : `0101101` = `0x2D` (quatre 1, parité paire 0 : cohérent).",
                  "`0x39` = `0111001` : comparé à `0101101`, deux bits diffèrent.",
                  "`0x39` contient aussi quatre 1 : la parité paire reste juste, le périphérique **ne peut pas** détecter l'erreur. La parité ne détecte qu'un nombre impair de bits retournés."
                ]
              ]
            }
          ]
        },

        {
          type: "probleme",
          id: "serie-debit",
          titre: "Débit utile d'une liaison UART",
          description: "Bits par caractère, efficacité et durée d'envoi d'un texte.",
          exemple: {
            enonce: "Une liaison UART fonctionne à 9 600 bauds en 8N1 (8 bits de données, pas de parité, 1 stop). Combien de caractères par seconde transmet-elle ? Quelle est son efficacité ? Combien de temps pour envoyer 1 000 caractères ?",
            schema: {
              type: "trame",
              segments: [{ bits: "0", role: "start" }, { bits: "10010110", role: "8 bits de données" }, { bits: "1", role: "stop" }]
            },
            formuleTitre: "Rédaction",
            formule: [
              "Un caractère = 1 start + 8 données + 1 stop = **10 bits**.",
              [
                "Caractères par seconde : `9 600 / 10 = 960`.",
                "Efficacité : `8 / 10 = 80 %` des bits transmis sont des données.",
                "Durée : `1 000 × 10 / 9 600 ≈ 1,04 s`."
              ]
            ],
            reponse: [["960 caractères/s", "efficacité de 80 %", "≈ 1,04 s pour 1 000 caractères"]]
          },
          exercice: {
            enonce: "Une liaison UART fonctionne à 115 200 bauds en 7E2 (7 bits de données, parité paire, 2 bits de stop). On envoie un texte de 2 000 caractères.",
            champs: [
              { libelle: "Nombre de bits par caractère", reponse: 11, tolerance: 0 },
              { libelle: "Caractères transmis par seconde", reponse: 10473, unite: "car/s" },
              { libelle: "Efficacité de la liaison", reponse: 63.6, unite: "%" },
              { libelle: "Durée d'envoi du texte", reponse: 191, unite: "ms" }
            ],
            indice: "Comptez start, données, parité et stops.",
            solution: [
              [
                "`1 + 7 + 1 + 2 = 11` bits par caractère.",
                "`115 200 / 11 ≈ 10 473` caractères/s.",
                "`7 / 11 ≈ 63,6 %`.",
                "`2 000 × 11 / 115 200 ≈ 0,191 s = 191 ms`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "serie-i2c",
          titre: "Adresses et trames I2C",
          description: "Octet d'adresse, bit R/W, bits d'acquittement et durée d'une trame.",
          exemple: {
            enonce: [
              "Un maître I2C à 100 kbit/s veut écrire une commande puis une donnée dans l'esclave d'adresse `0x40`.",
              [
                "Quel est le premier octet envoyé sur SDA ?",
                "Et si le maître voulait lire cet esclave ?",
                "Combien de coups d'horloge dure la trame, et combien de temps ?"
              ]
            ],
            schema: {
              type: "bus", protocole: "i2c",
              esclaves: [{ nom: "0x40", detail: "capteur" }, { nom: "0x64", detail: "écran" }, { nom: "0x81", detail: "CNA" }]
            },
            formuleTitre: "Rédaction",
            formule: [
              "Premier octet = adresse sur 7 bits suivie du bit R/W (0 = écriture, 1 = lecture).",
              [
                "`0x40 = 1000000` ; écriture : `1000000 0` = `10000000` = `0x80`.",
                "Lecture : `10000001` = `0x81`.",
                "Trame : octet d'adresse, commande, donnée, chacun suivi d'un bit ACK : `3 × 9 = 27` coups d'horloge (start et stop sont des conditions, pas des bits).",
                "`27 / 100·10³ = 270 µs`."
              ]
            ],
            reponse: [["Écriture : `0x80`", "Lecture : `0x81`", "27 coups d'horloge, 270 µs"]]
          },
          exercice: {
            enonce: "Un maître I2C en « Fast Mode » (400 kbit/s) lit 3 octets de données dans l'esclave d'adresse `0x64`.",
            schema: {
              type: "bus",
              esclaves: [{ nom: "0x64", detail: "cible" }, { nom: "0x40" }, { nom: "0x89" }]
            },
            champs: [
              { libelle: "Premier octet envoyé pour une lecture (hexadécimal)", reponse: "0xC9", accepte: ["C9", "C9h", "0xc9"] },
              { libelle: "Premier octet pour une écriture (hexadécimal)", reponse: "0xC8", accepte: ["C8", "C8h", "0xc8"] },
              { libelle: "Nombre de coups d'horloge de la trame de lecture", reponse: 36, tolerance: 0 },
              { libelle: "Durée de la trame", reponse: 90, unite: "µs" },
              { libelle: "Nombre d'adresses possibles en adressage sur 10 bits", reponse: 1024, tolerance: 0 }
            ],
            indice: "Décalez l'adresse d'un bit vers la gauche et ajoutez le bit R/W. Chaque octet est suivi d'un ACK.",
            solution: [
              [
                "`0x64 = 1100100` ; lecture : `11001001` = `0xC9` ; écriture : `11001000` = `0xC8`.",
                "4 octets (adresse + 3 données) × 9 = 36 coups d'horloge.",
                "`36 / 400·10³ = 90 µs`.",
                "`2¹⁰ = 1 024` adresses (contre `2⁷ = 128` sur 7 bits)."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "serie-spi",
          titre: "SPI ou I2C : câblage et vitesse",
          description: "Nombre de fils et durée d'un transfert sur chaque bus.",
          exemple: {
            enonce: "Un microcontrôleur pilote 3 périphériques. Combien de fils de communication faut-il (hors masse et alimentation) en SPI ? Et en I2C ?",
            schema: {
              type: "bus", protocole: "spi",
              esclaves: [{ nom: "Esclave 1" }, { nom: "Esclave 2" }, { nom: "Esclave 3" }]
            },
            formuleTitre: "Rédaction",
            formule: [
              "SPI : SCLK, MOSI et MISO sont partagés par tous les esclaves, et chaque esclave a son propre fil SS : `3 + 3 = 6` fils.",
              "I2C : tous les esclaves partagent SDA et SCL, l'esclave étant désigné par son adresse : **2 fils**, quel que soit leur nombre."
            ],
            reponse: [["SPI : 6 fils", "I2C : 2 fils"]]
          },
          exercice: {
            enonce: "Un maître doit piloter 5 esclaves et envoyer 1 000 octets à l'un d'eux. Le SPI tourne à 8 MHz ; l'I2C à 400 kbit/s, où chaque octet occupe 9 coups d'horloge (acquittement compris). On néglige l'octet d'adresse I2C.",
            champs: [
              { libelle: "Nombre de fils en SPI", reponse: 8, tolerance: 0 },
              { libelle: "Nombre de fils en I2C", reponse: 2, tolerance: 0 },
              { libelle: "Durée du transfert en SPI", reponse: 1, unite: "ms" },
              { libelle: "Durée du transfert en I2C", reponse: 22.5, unite: "ms" },
              { libelle: "Le SPI est combien de fois plus rapide ?", reponse: 22.5 }
            ],
            indice: "En SPI, un octet = 8 coups d'horloge.",
            solution: [
              [
                "SPI : `3 + 5 = 8` fils. I2C : 2 fils.",
                "SPI : `1 000 × 8 / 8·10⁶ = 1 ms`.",
                "I2C : `1 000 × 9 / 400·10³ = 22,5 ms`.",
                "`22,5 / 1 = 22,5` fois plus rapide, au prix de 6 fils de plus."
              ]
            ]
          }
        }
      ]
    },

    /* ========================================================
       CHAPITRE 6 — Alimentation électrique des data centers
       ======================================================== */
    {
      id: "datacenter",
      titre: "Chapitre 6 — Alimentation électrique des data centers",
      description: "Chaîne d'alimentation, onduleurs, groupes électrogènes, PUE et capteurs.",
      exercices: [

        {
          type: "qcm",
          id: "dc-qcm",
          titre: "QCM — Alimentation des data centers",
          description: "Questions de cours sur la distribution électrique d'un data center.",
          melangerChoix: true,
          questions: [
            {
              enonce: "Pourquoi les réseaux électriques utilisent-ils un signal alternatif triphasé sinusoïdal ?",
              choix: ["Pour minimiser les pertes", "Pour simplifier les onduleurs", "Pour transporter des données", "Pour réduire la tension"],
              reponse: 0
            },
            {
              enonce: "Quelle tension correspond au grand transport de l'électricité ?",
              choix: ["225 à 400 kV", "63 à 20 kV", "20 kV à 230/400 V", "230 V"],
              reponse: 0,
              explication: "Répartition : 63 à 20 kV. Distribution : 20 kV à 230/400 V."
            },
            {
              enonce: "Quel est le rôle du transformateur à l'entrée d'un data center ?",
              choix: [
                "Abaisser la moyenne tension (HTA) en basse tension, avec isolation galvanique",
                "Convertir le courant alternatif en continu",
                "Basculer vers la source de secours",
                "Distribuer l'électricité dans les baies"
              ],
              reponse: 0
            },
            {
              enonce: "Que fait le TGBT ?",
              choix: [
                "Il reçoit l'énergie et la distribue vers les circuits, avec disjoncteurs et sectionneurs",
                "Il produit l'électricité de secours",
                "Il stocke l'énergie",
                "Il mesure la température des baies"
              ],
              reponse: 0,
              explication: "TGBT : Tableau Général Basse Tension."
            },
            {
              enonce: "Quel type d'onduleur est le mieux adapté à un data center ?",
              choix: ["Online à double conversion", "Offline (en attente)", "Line-interactive", "Aucun, les batteries suffisent"],
              reponse: 0
            },
            {
              enonce: "Dans un onduleur, à quoi sert le redresseur ?",
              choix: [
                "Convertir l'alternatif en continu pour recharger la batterie",
                "Convertir le continu de la batterie en alternatif",
                "Transférer la charge vers le réseau en cas de panne",
                "Élever la tension"
              ],
              reponse: 0
            },
            {
              enonce: "À quoi sert le by-pass d'un onduleur ?",
              choix: [
                "Transférer l'alimentation vers le réseau en cas de surcharge ou de panne de l'onduleur",
                "Recharger les batteries plus vite",
                "Démarrer le groupe électrogène",
                "Mesurer la consommation"
              ],
              reponse: 0
            },
            {
              enonce: "Combien de temps un groupe électrogène doit-il pouvoir alimenter le data center ?",
              choix: ["Jusqu'à 72 heures", "Quelques secondes", "10 minutes", "1 heure"],
              reponse: 0
            },
            {
              enonce: "Quelle suite de conversions réalise un groupe électrogène ?",
              choix: [
                "Énergie chimique → mécanique → électrique",
                "Énergie électrique → chimique",
                "Énergie thermique → lumineuse → électrique",
                "Énergie mécanique → chimique → électrique"
              ],
              reponse: 0
            },
            {
              enonce: "Que fait un ATS (Automatic Transfer Switch) ?",
              choix: [
                "Il bascule automatiquement de la source principale vers la source de secours",
                "Il distribue l'électricité dans les racks",
                "Il convertit la HTA en BT",
                "Il stocke l'énergie"
              ],
              reponse: 0,
              explication: "Le temps de transfert est réduit à quelques secondes."
            },
            {
              enonce: "Quel équipement distribue l'électricité aux serveurs dans une baie ?",
              choix: ["Le PDU", "Le TGBT", "L'ATS", "Le transformateur"],
              reponse: 0,
              explication: "Les PDU intelligents mesurent la consommation et se pilotent à distance."
            },
            {
              enonce: "Comment se calcule le PUE ?",
              choix: [
                "Consommation totale du data center / consommation des équipements informatiques",
                "Consommation informatique / consommation totale",
                "Puissance des onduleurs / puissance des serveurs",
                "Consommation de la climatisation / consommation totale"
              ],
              reponse: 0,
              explication: "Mesuré sur un an. Plus il est proche de 1, meilleur il est : environ 1,2 est bon, 1,5 moyen."
            },
            {
              enonce: "Quelle plage de température l'ASHRAE recommande-t-elle pour les serveurs ?",
              choix: ["18 °C à 27 °C", "−40 °C à +85 °C", "10 °C à 15 °C", "25 °C à 35 °C"],
              reponse: 0
            },
            {
              enonce: "Pourquoi maintenir l'humidité relative entre 40 % et 60 % ?",
              choix: [
                "Éviter la condensation (courts-circuits) et l'électricité statique",
                "Améliorer le refroidissement des batteries",
                "Réduire la consommation électrique",
                "Protéger les câbles réseau de la corrosion uniquement"
              ],
              reponse: 0
            },
            {
              enonce: "Au-dessus de quelle valeur le facteur de puissance doit-il rester ?",
              choix: ["0,9", "0,5", "1,5", "0,1"],
              reponse: 0
            },
            {
              enonce: "Comment garantit-on la haute disponibilité électrique d'un data center ?",
              choix: [
                "En doublant (redondant) les équipements et la distribution",
                "En utilisant un seul gros onduleur",
                "En coupant la climatisation la nuit",
                "En alimentant les serveurs en courant continu direct"
              ],
              reponse: 0
            },
            {
              enonce: "Quel capteur surveille les groupes électrogènes et onduleurs pour la maintenance prédictive ?",
              choix: ["Le capteur de vibration", "Le capteur de fumée VESDA", "Le capteur de fuite d'eau", "Le capteur RFID"],
              reponse: 0
            }
          ]
        },

        {
          type: "probleme",
          id: "dc-pue",
          titre: "Performance énergétique : le PUE",
          description: "Calculer et améliorer l'indicateur PUE.",
          exemple: {
            enonce: "Sur un an, un data center consomme 12 GWh au total, dont 8 GWh pour les équipements informatiques. Calculez son PUE et commentez.",
            schema: {
              type: "chaine",
              blocs: ["Réseau\n12 GWh", "Data center", "Informatique\n8 GWh"],
              liens: ["consommation totale", "consommation nette"],
              accent: 1
            },
            formuleTitre: "Rédaction",
            formule: [
              "`PUE = consommation totale / consommation des équipements informatiques`.",
              "`PUE = 12 / 8 = 1,5`.",
              "Pour 1 kWh consommé par les serveurs, le site en consomme 0,5 de plus (refroidissement, pertes électriques, éclairage). 1,5 est une performance moyenne ; un bon site vise 1,2."
            ],
            reponse: "`PUE = 1,5` : performance moyenne."
          },
          exercice: {
            enonce: [
              "Un data center fonctionne en continu toute l'année (8 760 h). Ses puissances moyennes sont :",
              [
                "équipements informatiques : 1,2 MW",
                "climatisation : 0,42 MW",
                "pertes électriques (transformateurs, onduleurs) : 0,1 MW",
                "éclairage et bureaux : 0,04 MW"
              ]
            ],
            champs: [
              { libelle: "Puissance totale du site", reponse: 1.76, unite: "MW" },
              { libelle: "PUE", reponse: 1.467 },
              { libelle: "Énergie consommée en un an", reponse: 15418, unite: "MWh" },
              { libelle: "Puissance non informatique maximale pour atteindre un PUE de 1,2", reponse: 0.24, unite: "MW" },
              { libelle: "Économie de puissance nécessaire pour atteindre ce PUE", reponse: 0.32, unite: "MW" }
            ],
            indice: "`PUE = P_totale / P_IT`. Pour un PUE visé, `P_totale = PUE × P_IT`.",
            solution: [
              [
                "`1,2 + 0,42 + 0,1 + 0,04 = 1,76 MW`.",
                "`PUE = 1,76 / 1,2 ≈ 1,47`.",
                "`1,76 × 8 760 ≈ 15 418 MWh`.",
                "PUE de 1,2 : `P_totale = 1,2 × 1,2 = 1,44 MW`, donc `1,44 − 1,2 = 0,24 MW` hors informatique.",
                "Actuellement `0,56 MW` hors informatique : il faut économiser `0,56 − 0,24 = 0,32 MW`."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "dc-puissance",
          titre: "Puissance d'une alimentation de baie",
          description: "Tension, courant et facteur de puissance en monophasé et en triphasé.",
          exemple: {
            enonce: "Une baie est alimentée par un PDU monophasé 230 V protégé à 16 A. Le facteur de puissance des serveurs vaut 0,95. Quelle puissance active peut-on consommer ? Combien de serveurs de 350 W peut-on brancher ?",
            schema: {
              type: "chaine",
              blocs: ["TGBT", "PDU\n230 V · 16 A", "Serveurs\n350 W"],
              accent: 1
            },
            formuleTitre: "Rédaction",
            formule: [
              "Puissance apparente : `S = U × I = 230 × 16 = 3 680 VA`.",
              "Puissance active : `P = S × cos φ = 3 680 × 0,95 = 3 496 W`.",
              "Nombre de serveurs : `3 496 / 350 ≈ 9,99` → **9** serveurs (on arrondit toujours à l'entier inférieur, sinon la protection saute)."
            ],
            reponse: [["`P ≈ 3,5 kW`", "9 serveurs"]]
          },
          exercice: {
            enonce: [
              "Une rangée de baies est alimentée en triphasé 400 V, 32 A, avec un facteur de puissance de 0,9. En triphasé, `P = √3 × U × I × cos φ`.",
              "Chaque serveur consomme 450 W."
            ],
            champs: [
              { libelle: "Puissance active disponible", reponse: 19.95, unite: "kW" },
              { libelle: "Nombre maximal de serveurs", reponse: 44, tolerance: 0 },
              { libelle: "Courant nécessaire pour la même puissance si `cos φ` tombait à 0,7", reponse: 41.1, unite: "A" },
              { libelle: "Ce courant respecte-t-il la protection de 32 A ? (oui / non)", reponse: "non" }
            ],
            indice: "`√3 ≈ 1,732`. À puissance égale, le courant est inversement proportionnel à `cos φ`.",
            solution: [
              [
                "`P = 1,732 × 400 × 32 × 0,9 ≈ 19 953 W ≈ 19,95 kW`.",
                "`19 953 / 450 ≈ 44,3` → 44 serveurs.",
                "`I = P / (√3 × 400 × 0,7) = 19 953 / 485 ≈ 41,1 A`.",
                "`41,1 A > 32 A` : la protection déclencherait. D'où l'exigence d'un facteur de puissance supérieur à 0,9."
              ]
            ]
          }
        },

        {
          type: "probleme",
          id: "dc-autonomie",
          titre: "Autonomie des batteries et du groupe électrogène",
          description: "Dimensionner l'énergie de secours entre la coupure et le relais du groupe.",
          exemple: {
            enonce: "Un onduleur de rendement 95 % alimente une charge de 4 kW à partir d'une batterie de 48 V et 200 Ah. Quelle est l'autonomie ?",
            schema: {
              type: "chaine",
              blocs: ["Réseau", "Onduleur\nrendement 95 %", "Charge\n4 kW"],
              liens: ["", ""],
              accent: 1
            },
            formuleTitre: "Rédaction",
            formule: [
              "Énergie stockée : `E = U × Q = 48 × 200 = 9 600 Wh = 9,6 kWh`.",
              "L'onduleur a des pertes : la batterie doit fournir `4 / 0,95 ≈ 4,21 kW`.",
              "Autonomie : `t = 9,6 / 4,21 ≈ 2,28 h`, soit environ 2 h 17 min."
            ],
            reponse: "Autonomie ≈ **2,28 h**."
          },
          exercice: {
            enonce: [
              "La salle informatique consomme 120 kW. En cas de coupure, les batteries doivent tenir 10 minutes, le temps que le groupe électrogène démarre et que l'ATS bascule. L'onduleur a un rendement de 94 % et on applique une marge de sécurité de 25 % sur l'énergie.",
              "Les batteries sont des chaînes de 12 V – 100 Ah. Le groupe électrogène consomme 40 L de fioul par heure."
            ],
            schema: {
              type: "chaine",
              blocs: ["Réseau", "ATS", "Onduleur\n94 %", "Salle IT\n120 kW"],
              liens: ["", "", ""],
              accent: 2
            },
            champs: [
              { libelle: "Puissance fournie par les batteries", reponse: 127.7, unite: "kW" },
              { libelle: "Énergie à stocker, marge comprise", reponse: 26.6, unite: "kWh" },
              { libelle: "Nombre de chaînes de 12 V – 100 Ah", reponse: 23, tolerance: 0 },
              { libelle: "Fioul à stocker pour 72 h d'autonomie", reponse: 2880, unite: "L" }
            ],
            indice: "Une chaîne stocke `12 × 100 = 1,2 kWh`. Un nombre de chaînes s'arrondit à l'entier supérieur.",
            solution: [
              [
                "`120 / 0,94 ≈ 127,7 kW`.",
                "`127,7 × (10 / 60) × 1,25 ≈ 26,6 kWh`.",
                "`26,6 / 1,2 ≈ 22,2` → **23** chaînes (22 ne suffiraient pas).",
                "`40 × 72 = 2 880 L`."
              ]
            ]
          }
        }
      ]
    }
  ]
};
