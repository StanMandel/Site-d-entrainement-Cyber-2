/* =============================================================
   Assembleur — exercices de programmation
   -------------------------------------------------------------
   Chargé après data/cours/assembleur.js. Chaque exercice (« code » ou QCM) :
   principe court, exemple, objectif, code de départ, solution et
   tests. Format documenté dans data/cours/_modele.js.

   Difficulté croissante : introduction (QCM + code) → mov → calculs → bits → C aplati →
   conditions → boucles → tableaux → structures → traductions.
   ============================================================= */

CONTENU["assembleur"].chapitres = [

  /* =========================================================
     CHAPITRE 0 — INTRODUCTION
     ========================================================= */
  {
    id: "asm-ch0",
    titre: "Introduction",
    description: "Sections, noms des registres et syntaxe de base.",
    exercices: [
      {
        type: "qcm",
        id: "intro-qcm-sections",
        titre: "QCM — Les sections",
        description: "Où ranger instructions, variables et constantes.",
        cours: [
          "Un programme assembleur est découpé en **sections**, ouvertes par `.section \"nom\"` :",
          [
            "`.text` contient les **instructions**",
            "`.data` les variables **avec** valeur initiale",
            "`.bss` les variables **sans** valeur initiale (elles valent 0)",
            "`.rodata` les **constantes**, en lecture seule, comme les chaînes"
          ],
          "On peut changer de section autant de fois que nécessaire dans un même fichier."
        ],
        exemple: {
          legende: "Un programme avec ses quatre sections",
          code: `        .section ".rodata"
msg:    .string "bonjour"       # constante

        .section ".data"
compteur: .long 5               # static int compteur = 5;

        .section ".bss"
tampon: .skip   16              # static char tampon[16];

        .section ".text"
main:
        incl    compteur        # une instruction`
        },
        questions: [
          {
            enonce: "Dans quelle section placer les instructions (mov, add, jmp…) ?",
            choix: [".data", ".text", ".bss", ".rodata"],
            reponse: 1,
            explication: ".text contient le code exécuté par le processeur."
          },
          {
            enonce: "Où déclarer l'équivalent de « static int total = 10; » ?",
            choix: [".text", ".bss", ".data", ".rodata"],
            reponse: 2,
            explication: "Variable modifiable avec une valeur initiale : .data."
          },
          {
            enonce: "Où déclarer l'équivalent de « static int total; » (sans valeur initiale) ?",
            choix: [".data", ".rodata", ".text", ".bss"],
            reponse: 3,
            explication: "Sans valeur initiale : .bss, où la place est réservée avec .skip."
          },
          {
            enonce: "Où ranger la chaîne constante \"Erreur de lecture\" ?",
            choix: [".rodata", ".bss", ".text", ".data"],
            reponse: 0,
            explication: ".rodata (read-only data) accueille les constantes comme les chaînes."
          },
          {
            enonce: "Que vaut au démarrage une variable réservée avec « .skip 4 » dans .bss ?",
            choix: ["0", "Une valeur aléatoire", "4", "-1"],
            reponse: 0,
            explication: "Les octets de .bss sont mis à 0 au lancement du programme."
          },
          {
            enonce: "Que se passe-t-il à l'assemblage ?",
            code: `        .section ".bss"
x:      .long   7`,
            choix: [
              "Erreur : .bss n'accepte pas de valeur initiale",
              "x vaut 7",
              "x vaut 0",
              "x devient une constante"
            ],
            reponse: 0,
            explication: "Une valeur initiale non nulle ne peut pas être stockée dans .bss : mettre x dans .data."
          },
          {
            enonce: "Que se passe-t-il si une instruction écrit dans une étiquette de .rodata ?",
            choix: [
              "Erreur de segmentation à l'exécution",
              "La valeur est modifiée normalement",
              "L'écriture est ignorée sans erreur",
              "L'assembleur ajoute la variable dans .data"
            ],
            reponse: 0,
            explication: ".rodata est en lecture seule : toute écriture provoque une erreur de segmentation."
          },
          {
            enonce: "Combien de fois peut-on écrire « .section \".data\" » dans un même fichier ?",
            choix: ["Une seule fois", "Autant de fois que nécessaire", "Deux fois au maximum", "Jamais après .text"],
            reponse: 1,
            explication: "Chaque .section reprend la section indiquée là où elle s'était arrêtée."
          },
          {
            enonce: "Quel est le problème de ce code ?",
            code: `        .section ".data"
        movl    $1, %eax`,
            choix: [
              "L'instruction n'est pas dans .text",
              "Aucun problème",
              "Il manque un suffixe",
              "%eax n'est pas autorisé dans .data"
            ],
            reponse: 0,
            explication: "Les instructions vont dans .text ; .data ne contient que des données."
          },
          {
            enonce: "Quelles sections contiennent des variables modifiables ?",
            choix: [".text", ".data", ".bss", ".rodata"],
            reponse: [1, 2],
            explication: ".data et .bss sont modifiables ; .text et .rodata sont en lecture seule."
          },
          {
            enonce: "À quelle déclaration C correspond ce code ?",
            code: `        .section ".bss"
tab:    .skip   40`,
            choix: ["static int tab[10];", "static int tab[40];", "static int tab = 40;", "const int tab[10] = {0};"],
            reponse: 0,
            explication: "40 octets sans valeur initiale : 10 int de 4 octets."
          },
          {
            enonce: "Dans quelle section se trouve l'étiquette « main: » ?",
            choix: [".data", ".rodata", ".text", ".bss"],
            reponse: 2,
            explication: "main nomme la première instruction du programme : elle est dans .text."
          }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "intro-sections",
        titre: "Ranger dans la bonne section",
        description: "Répartir données, constante et instructions.",
        cours: "Chaque ligne a sa place : constantes dans `.rodata`, variables initialisées dans `.data`, variables sans valeur dans `.bss`, instructions dans `.text`. Une étiquette appartient à la section ouverte au-dessus d'elle.",
        exemple: {
          code: `        .section ".rodata"
titre:  .string "Menu"          # constante

        .section ".data"
choix:  .long   1               # int choix = 1;

        .section ".bss"
notes:  .skip   20              # int notes[5];

        .section ".text"
main:
        incl    choix`
        },
        consigne: [
          "Tout a été écrit dans `.text`, ce qui ne s'assemble pas. Déplacer les lignes pour que :",
          [
            "`bienvenue` (chaîne constante) soit dans `.rodata`",
            "`vies` (int valant 3) dans `.data`",
            "`scores` (10 int sans valeur initiale) dans `.bss`",
            "les instructions restent dans `.text`"
          ]
        ],
        sections: { bienvenue: "rodata", vies: "data", scores: "bss" },
        depart: `        .section ".text"
bienvenue: .string "Bonjour"
vies:   .long   3
scores: .skip   40
main:
        decl    vies
        movl    vies, %eax
        movl    %eax, scores

        .section ".rodata"

        .section ".data"

        .section ".bss"
`,
        solution: `        .section ".rodata"
bienvenue: .string "Bonjour"

        .section ".data"
vies:   .long   3

        .section ".bss"
scores: .skip   40

        .section ".text"
main:
        decl    vies
        movl    vies, %eax
        movl    %eax, scores
`,
        tests: [
          { attendu: { vies: 2, "scores[0]": 2, bienvenue: "Bonjour" } },
          { entrees: { vies: 10 }, attendu: { vies: 9, "scores[0]": 9 } }
        ]
      },
      {
        type: "qcm",
        id: "intro-qcm-registres",
        titre: "QCM — Les registres",
        description: "Nom des registres selon la taille, suffixe des instructions.",
        cours: [
          { titre: "1. La taille s'écrit deux fois" },
          "Dans `movl $5, %eax`, la taille utilisée (4 octets) apparaît **à deux endroits** :",
          [
            "à la fin du **nom de l'instruction** : `mov` + `l`. Cette lettre collée à l'instruction s'appelle le **suffixe** ;",
            "dans le **nom du registre** : `%eax` désigne le registre sur 4 octets."
          ],
          "Les deux doivent annoncer la même taille. `movl $5, %rax` est refusé : `l` annonce 4 octets, `%rax` en fait 8.",
          { titre: "2. Le suffixe de l'instruction" },
          "Chaque taille a un nom anglais ; le suffixe est son initiale :",
          {
            entetes: ["Taille", "Nom de la taille", "Suffixe", "Exemple"],
            lignes: [
              ["1 octet", "**b**yte", "`b`", "`movb $1, %al`"],
              ["2 octets", "**w**ord", "`w`", "`movw $1, %ax`"],
              ["4 octets", "**l**ong", "`l`", "`movl $1, %eax`"],
              ["8 octets", "**q**uad", "`q`", "`movq $1, %rax`"]
            ]
          },
          { titre: "3. Registres a, b, c, d : une lettre ajoutée à chaque agrandissement" },
          "Les premiers processeurs avaient des registres de 2 octets nommés `ax`, `bx`, `cx` et `dx`. Quand les processeurs ont grandi, on a gardé ces noms et **ajouté une lettre devant** pour désigner le registre agrandi :",
          {
            entetes: ["Taille", "Nom", "Comment le lire"],
            lignes: [
              ["1 octet", "`%al`", "a + **l** (« low » : l'octet du bas)"],
              ["2 octets", "`%ax`", "le nom d'origine"],
              ["4 octets", "`%eax`", "**e** (« extended » : agrandi) + ax"],
              ["8 octets", "`%rax`", "**r** (« register », 64 bits) + ax"]
            ]
          },
          "Pour retenir : **plus le nom est long, plus le registre est grand** (`al` < `ax` < `eax` < `rax`).",
          "`b`, `c` et `d` suivent exactement la même règle : `%bl`, `%bx`, `%ebx`, `%rbx`. Les lettres rappellent leur usage d'origine : **a**ccumulateur (résultats), **b**ase, **c**ompteur (boucles), **d**onnées.",
          { titre: "4. Registres si, di, bp, sp : même règle, sans x" },
          "Leur nom d'origine a déjà deux lettres : **s**ource **i**ndex, **d**estination **i**ndex, **b**ase **p**ointer, **s**tack **p**ointer. On ajoute `e` ou `r` devant comme pour `ax`, et `l` derrière pour 1 octet :",
          [
            "`%sil` → 1 octet (si + l)",
            "`%si` → 2 octets (le nom d'origine)",
            "`%esi` → 4 octets (e + si)",
            "`%rsi` → 8 octets (r + si)"
          ],
          "`%rsp` (stack pointer) sert à la pile : ne pas l'utiliser pour calculer.",
          { titre: "5. Registres r8 à r15 : un numéro, puis la taille derrière" },
          "Ajoutés avec les processeurs 64 bits, ils n'ont pas de nom historique : seulement un numéro. Le nom seul désigne les 8 octets ; pour une partie, on ajoute **derrière** l'initiale du nom de la taille :",
          {
            entetes: ["Taille", "Nom", "Comment le lire"],
            lignes: [
              ["1 octet", "`%r8b`", "r8 + **b**yte"],
              ["2 octets", "`%r8w`", "r8 + **w**ord"],
              ["4 octets", "`%r8d`", "r8 + **d**ouble word (2 words)"],
              ["8 octets", "`%r8`", "le registre entier"]
            ]
          },
          "Seul piège : pour 4 octets, le **registre** prend `d` (`%r8d`) alors que l'**instruction** prend `l` (`movl`). `d` et `l` veulent dire la même chose : 4 octets. On écrit donc `movl $1, %r8d`.",
          { titre: "6. Récapitulatif" },
          "Sur chaque ligne, l'instruction s'utilise avec n'importe lequel des registres de la même ligne :",
          {
            entetes: ["Taille", "Instruction", "a, b, c, d", "si, di, bp, sp", "r8 à r15"],
            lignes: [
              ["1 octet", "`movb`", "`%al`", "`%sil`", "`%r8b`"],
              ["2 octets", "`movw`", "`%ax`", "`%si`", "`%r8w`"],
              ["4 octets", "`movl`", "`%eax`", "`%esi`", "`%r8d`"],
              ["8 octets", "`movq`", "`%rax`", "`%rsi`", "`%r8`"]
            ]
          }
        ],
        exemple: [
          {
            titre: "Un seul registre, quatre noms",
            texte: "`%eax`, `%ax` et `%al` ne sont pas d'autres registres : ce sont les octets du bas de `%rax`. Écrire dans l'un modifie aussi les autres.",
            legende: "Octets de %rax",
            code: `          octet 8 ─────────────────── octet 1
%rax     [ .. | .. | .. | .. | .. | .. | .. | .. ]
%eax                         [ .. | .. | .. | .. ]
%ax                                    [ .. | .. ]
%al                                         [ .. ]`
          },
          {
            legende: "Assembleur",
            code: `        movq    $1, %rax        # 8 octets
        movl    $1, %ebx        # 4 octets
        movw    $1, %cx         # 2 octets
        movb    $1, %dl         # 1 octet
        movl    $1, %esi        # 4 octets
        movb    $1, %dil        # 1 octet
        movq    $1, %r9         # 8 octets
        movw    $1, %r10w       # 2 octets`
          }
        ],
        questions: [
          {
            enonce: "Quel est le nom 4 octets de %rbx ?",
            choix: ["%bx", "%ebx", "%bl", "%rbxd"],
            reponse: 1,
            explication: "Le nom d'origine est bx (2 octets) ; pour 4 octets on ajoute e devant : %ebx."
          },
          {
            enonce: "Quel est le nom 1 octet de %rcx ?",
            choix: ["%cx", "%ecx", "%cl", "%rcb"],
            reponse: 2,
            explication: "Pour 1 octet on remplace le x par l (low, l'octet du bas) : %cl."
          },
          {
            enonce: "Quel est le nom 2 octets de %rdx ?",
            choix: ["%dx", "%dl", "%edx", "%rdw"],
            reponse: 0,
            explication: "dx est le nom d'origine, sur 2 octets."
          },
          {
            enonce: "Quel est le nom 4 octets de %r10 ?",
            choix: ["%e10", "%r10w", "%r10d", "%r10l"],
            reponse: 2,
            explication: "Pour r8 à r15, la taille s'écrit derrière le numéro : d (double word) pour 4 octets, donc %r10d."
          },
          {
            enonce: "Quel est le nom 1 octet de %r12 ?",
            choix: ["%r12l", "%r12b", "%r12w", "%12l"],
            reponse: 1,
            explication: "Derrière le numéro : b (byte) pour 1 octet, donc %r12b."
          },
          {
            enonce: "Quel est le nom 1 octet de %rsi ?",
            choix: ["%si", "%esi", "%sl", "%sil"],
            reponse: 3,
            explication: "si est le nom d'origine (2 octets) ; pour 1 octet on ajoute l derrière : %sil."
          },
          {
            enonce: "Quelle instruction place 1 dans les 4 octets du bas de %r9 ?",
            choix: ["movl $1, %r9d", "movd $1, %r9d", "movl $1, %r9l", "movq $1, %r9d"],
            reponse: 0,
            explication: "Le registre de 4 octets s'écrit %r9d (double word) mais le suffixe de l'instruction reste l : movl."
          },
          {
            enonce: "Quel suffixe utiliser avec %eax ?",
            choix: ["q", "l", "w", "b"],
            reponse: 1,
            explication: "%eax fait 4 octets ; le suffixe des 4 octets est l (long) : movl, addl…"
          },
          {
            enonce: "Quelle instruction est refusée par l'assembleur ?",
            choix: ["movl $7, %rax", "movq $7, %rax", "movb $7, %al", "movw $7, %ax"],
            reponse: 0,
            explication: "movl travaille sur 4 octets alors que %rax en fait 8 : il faut movq, ou bien %eax."
          },
          {
            enonce: "Quel registre ne doit pas servir aux calculs ?",
            choix: ["%rax", "%rsp", "%r11", "%rcx"],
            reponse: 1,
            explication: "%rsp (stack pointer) est le pointeur de pile."
          },
          {
            enonce: "Que valent %eax, %ax et %al ?",
            choix: [
              "Trois morceaux du même registre %rax",
              "Trois registres indépendants",
              "Trois copies de %rax",
              "Trois noms de %rbx"
            ],
            reponse: 0,
            explication: "Ce sont les 4, 2 et 1 octets du bas de %rax : écrire dans %al modifie aussi %ax, %eax et %rax."
          },
          {
            enonce: "Que vaut %rax après ces deux lignes ?",
            code: `        movq    $0, %rax
        movb    $-1, %al`,
            choix: ["255", "-1", "0", "65280"],
            reponse: 0,
            explication: "Seul l'octet du bas (%al) passe à 0xff : rax = 0xff = 255."
          },
          {
            enonce: "Que vaut %rax après ces deux lignes ?",
            code: `        movq    $-1, %rax
        movl    $5, %eax`,
            choix: ["5", "-1", "0xffffffff00000005", "4294967295"],
            reponse: 0,
            explication: "Cas particulier : écrire dans un registre de 4 octets met à 0 les 4 octets du haut du registre de 8 octets."
          },
          {
            enonce: "Combien de registres généraux possède un processeur x86-64 ?",
            choix: ["8", "16", "32", "64"],
            reponse: 1,
            explication: "%rax, %rbx, %rcx, %rdx, puis %rsi, %rdi, %rbp, %rsp, puis %r8 à %r15."
          }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "intro-registres",
        titre: "Morceaux d'un registre",
        description: "Écrire dans %bl, %r9d et %cx sans toucher au reste.",
        cours: [
          "`%rax`, `%eax`, `%ax` et `%al` désignent le même registre, vu sur 8, 4, 2 ou 1 octets.",
          "Écrire dans `%ax` ou `%al` ne modifie que ces octets. Écrire dans `%eax` met en plus à 0 la moitié haute de `%rax`."
        ],
        exemple: {
          code: `        movq    $0x1122334455667788, %rax
        movb    $0xff, %al      # rax = 0x11223344556677ff
        movw    $0, %ax         # rax = 0x1122334455660000
        movl    $1, %eax        # rax = 0x0000000000000001`
        },
        consigne: [
          "`%rbx`, `%rcx` et `%r9` contiennent déjà des valeurs.",
          "Mettre à 0 l'**octet** de poids faible de `%rbx`, mettre 0x1234 dans les **2 octets** de poids faible de `%rcx`, et mettre 7 dans le registre de **4 octets** de `%r9`. Les autres octets de `%rbx` et `%rcx` ne doivent pas changer."
        ],
        imposer: ["movb", "movw", "movl"],
        motifs: [
          { motif: "%r9d\\b", message: "Écrire dans le registre de 4 octets de %r9", regle: "`%r9d`" }
        ],
        depart: `        .section ".text"
main:
        # %rbx, %rcx et %r9 contiennent déjà des valeurs
`,
        solution: `        .section ".text"
main:
        movb    $0, %bl
        movw    $0x1234, %cx
        movl    $7, %r9d
`,
        tests: [
          {
            entrees: { "%rbx": "0x1122334455667788", "%rcx": "0xaaaaaaaaaaaaaaaa", "%r9": -1 },
            attendu: { "%rbx": "0x1122334455667700", "%rcx": "0xaaaaaaaaaaaa1234", "%r9": 7 }
          },
          {
            entrees: { "%rbx": 511, "%rcx": -1, "%r9": "0x100000000" },
            attendu: { "%rbx": 256, "%rcx": "0xffffffffffff1234", "%r9": 7 }
          }
        ]
      },
      {
        type: "qcm",
        id: "intro-qcm-syntaxe",
        titre: "QCM — Syntaxe d'une instruction",
        description: "$, %, ordre des opérandes, commentaires, étiquettes.",
        cours: [
          "Une instruction s'écrit `nom+suffixe source, destination` : on lit de gauche à droite, la source va dans la destination.",
          "`$5` est une valeur immédiate, `%eax` un registre, `total` le contenu d'une variable. Un commentaire commence par `#`. Une étiquette est un nom suivi de `:`.",
          "Une instruction ne peut pas avoir deux opérandes mémoire."
        ],
        exemple: {
          code: `boucle:                         # étiquette
        movl    $3, %eax        # eax = 3
        addl    total, %eax     # eax = eax + total
        movl    %eax, total     # total = eax`
        },
        questions: [
          {
            enonce: "Où va la valeur 3 ?",
            code: `        movl    $3, %ebx`,
            choix: ["Dans %ebx", "Nulle part : 3 est la destination", "En mémoire à l'adresse 3", "Dans %ebx et à l'adresse 3"],
            reponse: 0,
            explication: "Syntaxe AT&T : source d'abord, destination ensuite."
          },
          {
            enonce: "Que signifie le $ dans « $10 » ?",
            choix: ["La valeur 10 elle-même", "Le contenu de la mémoire à l'adresse 10", "Le registre numéro 10", "Une étiquette nommée 10"],
            reponse: 0
          },
          {
            enonce: "Que signifie le % dans « %ecx » ?",
            choix: ["Un registre", "Un pourcentage", "Une variable", "Un reste de division"],
            reponse: 0
          },
          {
            enonce: "Comment écrire un commentaire ?",
            choix: ["# commentaire", "// commentaire", "; commentaire", "-- commentaire"],
            reponse: 0,
            explication: "En syntaxe AT&T (GNU as), le commentaire commence par #."
          },
          {
            enonce: "Que fait cette ligne, sans $ devant 10 ?",
            code: `        movl    10, %eax`,
            choix: [
              "Lit la mémoire à l'adresse 10 (erreur de segmentation)",
              "Met 10 dans %eax",
              "Erreur d'assemblage",
              "Met l'adresse 10 dans %eax"
            ],
            reponse: 0,
            explication: "Sans $, un nombre est une adresse mémoire : l'adresse 10 est interdite."
          },
          {
            enonce: "Que signifie le suffixe q dans « addq » ?",
            choix: ["8 octets", "4 octets", "2 octets", "1 octet"],
            reponse: 0
          },
          {
            enonce: "Quelle ligne définit une étiquette ?",
            choix: ["fin:", ".fin", "fin;", "%fin"],
            reponse: 0
          },
          {
            enonce: "Que calcule cette instruction ?",
            code: `        subl    %ebx, %eax`,
            choix: ["eax = eax - ebx", "ebx = ebx - eax", "eax = ebx - eax", "ebx = eax - ebx"],
            reponse: 0,
            explication: "La destination reçoit destination − source."
          },
          {
            enonce: "Pourquoi « movl x, y » est-il refusé ?",
            choix: [
              "Deux opérandes mémoire dans la même instruction",
              "Il manque le suffixe",
              "x et y doivent être des registres de 8 octets",
              "Il manque un $ devant y"
            ],
            reponse: 0,
            explication: "Passer par un registre : movl x, %eax puis movl %eax, y."
          },
          {
            enonce: "Quelle instruction est correcte ?",
            choix: ["movl $5, %eax", "movl %eax, $5", "movl $5 %eax", "movl %5, $eax"],
            reponse: 0,
            explication: "Une valeur immédiate ne peut pas être une destination, et les opérandes sont séparés par une virgule."
          },
          {
            enonce: "Que contient %rax après « movq $x, %rax » ?",
            choix: ["L'adresse de x", "La valeur de x", "Le caractère x", "Rien : instruction invalide"],
            reponse: 0,
            explication: "$x est l'adresse de x ; x seul serait son contenu."
          },
          {
            enonce: "Que fait « addl total, %eax » ?",
            choix: ["eax = eax + total", "total = total + eax", "eax = total", "eax = eax + adresse de total"],
            reponse: 0
          }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "intro-corriger",
        titre: "Corriger la syntaxe",
        description: "Trouver et réparer quatre erreurs.",
        cours: [
          "L'assembleur refuse une ligne mal écrite et indique son numéro. Les erreurs les plus fréquentes :",
          [
            "`:` oublié après une étiquette",
            "`%` oublié devant un registre",
            "`$` oublié devant une valeur",
            "suffixe qui ne correspond pas à la taille du registre"
          ]
        ],
        exemple: {
          code: `        movl    $5, eax         # ✗ « eax » sans %
        movl    $5, %eax        # ✓

        movq    $5, %eax        # ✗ q (8 octets) avec %eax (4 octets)
        movl    $5, %eax        # ✓`
        },
        consigne: [
          "Ce programme doit calculer `total = prix * quantite + 5`.",
          "Il contient **quatre erreurs** : les corriger une par une en lisant les messages, sans réécrire le programme."
        ],
        depart: `        .section ".data"
prix    .long   20
quantite: .long 3
total:  .long   0

        .section ".text"
main:
        movl    prix, eax
        imull   quantite
        movq    %eax, total
        addl    5, total
`,
        solution: `        .section ".data"
prix:   .long   20
quantite: .long 3
total:  .long   0

        .section ".text"
main:
        movl    prix, %eax
        imull   quantite
        movl    %eax, total
        addl    $5, total
`,
        tests: [
          { entrees: { prix: 20, quantite: 3 }, attendu: { total: 65 } },
          { entrees: { prix: 7, quantite: -2 }, attendu: { total: -9 } }
        ]
      },
      {
        type: "qcm",
        id: "intro-qcm-lire",
        titre: "QCM — Lire un programme",
        description: "Suivre les instructions ligne par ligne.",
        cours: "Pour lire un programme : repérer les variables dans les sections de données, puis suivre les instructions de `.text` une par une, en notant le contenu de chaque registre après chaque ligne.",
        exemple: {
          code: `        movl    $4, %eax        # eax = 4
        movl    %eax, %ebx      # ebx = 4
        addl    $6, %ebx        # ebx = 10
        subl    %eax, %ebx      # ebx = 10 - 4 = 6`
        },
        questions: [
          {
            enonce: "Que vaut %eax à la fin ?",
            code: `        movl    $7, %eax
        movl    $2, %ecx
        addl    %ecx, %eax`,
            choix: ["9", "7", "2", "5"],
            reponse: 0
          },
          {
            enonce: "Que vaut %edx à la fin ?",
            code: `        movl    $10, %eax
        subl    $3, %eax
        movl    %eax, %edx
        subl    $3, %edx`,
            choix: ["4", "7", "10", "3"],
            reponse: 0,
            explication: "eax = 7, puis edx = 7, puis edx = 7 - 3 = 4."
          },
          {
            enonce: "Que vaut x à la fin ?",
            code: `        .section ".data"
x:      .long   5

        .section ".text"
main:
        movl    x, %eax
        incl    %eax
        movl    %eax, x`,
            choix: ["6", "5", "1", "0"],
            reponse: 0
          },
          {
            enonce: "Que vaut %ebx à la fin ?",
            code: `        movl    $1, %eax
        movl    %eax, %ebx
        movl    $9, %eax`,
            choix: ["1", "9", "10", "0"],
            reponse: 0,
            explication: "mov copie la valeur du moment : modifier eax ensuite ne change pas ebx."
          },
          {
            enonce: "Que vaut %eax à la fin ?",
            code: `        .section ".bss"
y:      .skip   4

        .section ".text"
main:
        movl    y, %eax
        addl    $3, %eax`,
            choix: ["3", "7", "4", "Une valeur imprévisible"],
            reponse: 0,
            explication: "y est dans .bss : elle vaut 0 au départ."
          },
          {
            enonce: "Combien d'octets occupe msg ?",
            code: `        .section ".rodata"
msg:    .string "abc"`,
            choix: ["4", "3", "1", "8"],
            reponse: 0,
            explication: ".string ajoute l'octet nul final : a, b, c, \\0."
          },
          {
            enonce: "Que vaut %eax à la fin ?",
            code: `        movl    $5, %eax
        negl    %eax
        decl    %eax`,
            choix: ["-6", "-4", "4", "6"],
            reponse: 0
          },
          {
            enonce: "Quelle ligne est refusée à l'assemblage ?",
            code: `        movl    $1, %eax        # ligne A
        movl    %eax, total     # ligne B
        movl    total, %ebx     # ligne C
        movl    total, resultat # ligne D`,
            choix: ["Ligne A", "Ligne B", "Ligne C", "Ligne D"],
            reponse: 3,
            explication: "La ligne D copie une variable dans une autre : deux opérandes mémoire."
          },
          {
            enonce: "Que vaut %rax à la fin ?",
            code: `        movq    $-1, %rax
        movl    $0, %eax`,
            choix: ["0", "-1", "0xffffffff00000000", "4294967295"],
            reponse: 0,
            explication: "Écrire dans %eax met aussi à 0 les 4 octets hauts de %rax."
          },
          {
            enonce: "Que valent a et b à la fin ?",
            code: `        .section ".data"
a:      .long   2
b:      .long   3

        .section ".text"
main:
        movl    a, %eax
        movl    b, %ebx
        movl    %ebx, a
        movl    %eax, b`,
            choix: ["a = 3, b = 2", "a = 2, b = 3", "a = 3, b = 3", "a = 2, b = 2"],
            reponse: 0,
            explication: "Les deux valeurs sont lues avant d'être réécrites : elles sont échangées."
          }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "intro-programme",
        titre: "Écrire un programme complet",
        description: "Sections, étiquettes, main et instructions à partir de rien.",
        cours: "Un programme complet : les données dans leurs sections, puis `.section \".text\"`, l'étiquette `main:` (rendue visible par `.globl main`) et les instructions.",
        exemple: {
          code: `        .section ".data"
n:      .long   21

        .section ".bss"
double: .skip   4

        .section ".text"
        .globl  main
main:
        movl    n, %eax
        addl    %eax, %eax      # eax = 2 * n
        movl    %eax, double`
        },
        consigne: "Le fichier est vide. Écrire un programme qui déclare `a` (int valant 8) et `b` (int valant 5) avec valeur initiale, `somme` (int) sans valeur initiale, et qui calcule `somme = a + b`.",
        sections: { a: "data", b: "data", somme: "bss", main: "text" },
        motifs: [
          { motif: "\\ba\\s*:\\s*\\.(long|int)\\b", message: "`a` est un int : la déclarer avec .long" },
          { motif: "\\bb\\s*:\\s*\\.(long|int)\\b", message: "`b` est un int : la déclarer avec .long" },
          { motif: "\\bsomme\\s*:\\s*\\.(skip|space)\\s+4\\b", message: "`somme` est un int sans valeur initiale : .skip 4" }
        ],
        depart: `# programme complet

`,
        solution: `        .section ".data"
a:      .long   8
b:      .long   5

        .section ".bss"
somme:  .skip   4

        .section ".text"
        .globl  main
main:
        movl    a, %eax
        addl    b, %eax
        movl    %eax, somme
`,
        tests: [
          { attendu: { somme: 13 } },
          { entrees: { a: -4, b: 10 }, attendu: { somme: 6 } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 1 — PREMIERS PAS
     ========================================================= */
  {
    id: "asm-ch1",
    titre: "Premiers pas : mov et variables",
    description: "Registres, tailles, variables en mémoire et directives de déclaration.",
    exercices: [
      {
        type: "code",
        langage: "asm",
        id: "asm-mov-immediat",
        titre: "Charger une valeur",
        description: "Placer des constantes dans des registres avec mov.",
        cours: "`movl source, destination` copie la source dans la destination. Une valeur immédiate s'écrit avec `$`, un registre avec `%`. Le suffixe `l` indique 4 octets : il va avec les registres `%eax`, `%ebx`, `%ecx`, `%edx`…",
        exemple: {
          code: `        movl    $10, %eax       # eax = 10
        movl    $-3, %ebx       # ebx = -3`
        },
        consigne: "Placer **42** dans `%eax` et **7** dans `%ecx`.",
        depart: `        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".text"
main:
        movl    $42, %eax
        movl    $7, %ecx
`,
        tests: [
          { attendu: { "%eax": 42, "%ecx": 7 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-mov-registres",
        titre: "Copier un registre",
        description: "mov entre deux registres.",
        cours: "Entre deux registres, `mov` copie aussi la valeur. La source n'est pas modifiée : après `movl %eax, %ebx`, les deux registres contiennent la même valeur.",
        exemple: {
          code: `        movl    $5, %eax        # eax = 5
        movl    %eax, %ebx      # ebx = 5, eax vaut toujours 5`
        },
        consigne: "`%eax` contient déjà une valeur (différente à chaque test). La copier dans `%ebx` **et** dans `%edx`.",
        depart: `        .section ".text"
main:
        # %eax contient déjà une valeur
`,
        solution: `        .section ".text"
main:
        movl    %eax, %ebx
        movl    %eax, %edx
`,
        tests: [
          { entrees: { "%eax": 12 }, attendu: { "%eax": 12, "%ebx": 12, "%edx": 12 } },
          { entrees: { "%eax": -8 }, attendu: { "%eax": -8, "%ebx": -8, "%edx": -8 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-tailles",
        titre: "Choisir la bonne taille",
        description: "Suffixes q, w, b et noms de registres associés.",
        cours: "Un registre porte quatre noms selon la taille utilisée : `%rax` (8 octets, suffixe `q`), `%eax` (4, `l`), `%ax` (2, `w`), `%al` (1, `b`). Le suffixe de l'instruction et le nom du registre doivent correspondre.",
        exemple: {
          code: `        movq    $1, %rax        # 8 octets
        movw    $2, %bx         # 2 octets
        movb    $3, %cl         # 1 octet
        movl    $4, %r8d        # 4 octets`
        },
        consigne: "Placer **100** dans le registre de 8 octets de la famille `rdx`, **200** dans le registre de 2 octets de la famille `rsi` et **65** dans le registre d'1 octet de la famille `rbx`.",
        imposer: ["movq", "movw", "movb"],
        depart: `        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".text"
main:
        movq    $100, %rdx
        movw    $200, %si
        movb    $65, %bl
`,
        tests: [
          { attendu: { "%rdx": 100, "%si": 200, "%bl": 65 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-variables",
        titre: "Lire et écrire une variable",
        description: "Étiquettes de .data et passage obligatoire par un registre.",
        cours: [
          "Une étiquette de `.data` s'utilise comme une variable : `x` (sans `$`) désigne son contenu.",
          "Une instruction ne peut pas avoir deux opérandes mémoire : pour copier une variable dans une autre, on passe par un registre."
        ],
        exemple: {
          code: `        .section ".data"
a:      .long   8
b:      .long   0

        .section ".text"
        movl    a, %eax         # eax = a
        movl    %eax, b         # b = eax`
        },
        consigne: "Copier la valeur de `source` dans `copie`.",
        depart: `        .section ".data"
source: .long   25
copie:  .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
source: .long   25
copie:  .long   0

        .section ".text"
main:
        movl    source, %eax
        movl    %eax, copie
`,
        tests: [
          { entrees: { source: 25 }, attendu: { copie: 25 } },
          { entrees: { source: -4 }, attendu: { copie: -4 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-echange",
        titre: "Échanger deux variables",
        description: "Utiliser deux registres pour croiser deux valeurs.",
        cours: "Pour échanger deux variables, on les lit d'abord toutes les deux dans des registres, puis on réécrit chaque valeur dans l'autre variable.",
        exemple: {
          texte: "Échanger deux registres avec un troisième :",
          code: `        movl    %eax, %ecx      # ecx = ancienne valeur de eax
        movl    %ebx, %eax      # eax = ebx
        movl    %ecx, %ebx      # ebx = ancienne valeur de eax`
        },
        consigne: "Échanger les valeurs de `a` et `b`.",
        depart: `        .section ".data"
a:      .long   3
b:      .long   9

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
a:      .long   3
b:      .long   9

        .section ".text"
main:
        movl    a, %eax
        movl    b, %ebx
        movl    %ebx, a
        movl    %eax, b
`,
        tests: [
          { entrees: { a: 3, b: 9 }, attendu: { a: 9, b: 3 } },
          { entrees: { a: -1, b: 40 }, attendu: { a: 40, b: -1 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-directives",
        titre: "Déclarer des variables",
        description: ".byte, .word, .long, .quad et .skip.",
        cours: [
          "Dans `.data`, une étiquette suivie de `.byte`, `.word`, `.long` ou `.quad` crée une variable de 1, 2, 4 ou 8 octets avec une valeur initiale.",
          "Dans `.bss`, `.skip n` réserve n octets qui valent 0."
        ],
        exemple: {
          code: `        .section ".data"
note:   .byte   18              # char note = 18;
annee:  .word   2026            # short annee = 2026;

        .section ".bss"
total:  .skip   8               # long total;`
        },
        consigne: [
          "Déclarer :",
          [
            "`lettre`, un `char` qui vaut `'E'`",
            "`score`, un `short` qui vaut 1500",
            "`solde`, un `int` qui vaut -250",
            "`grand`, un `long` qui vaut 5000000000",
            "`compteur`, un `int` sans valeur initiale"
          ]
        ],
        motifs: [
          { motif: "lettre\\s*:\\s*\\.byte\\b", message: "`lettre` est un char : la déclarer avec .byte" },
          { motif: "score\\s*:\\s*\\.(word|short)\\b", message: "`score` est un short : la déclarer avec .word" },
          { motif: "solde\\s*:\\s*\\.(long|int)\\b", message: "`solde` est un int : la déclarer avec .long" },
          { motif: "grand\\s*:\\s*\\.quad\\b", message: "`grand` est un long : la déclarer avec .quad" },
          { motif: "\\.bss[\\s\\S]*compteur\\s*:\\s*\\.(skip|space)\\s+4\\b", message: "`compteur` n'a pas de valeur initiale : la réserver dans .bss avec .skip et la taille d'un int" }
        ],
        depart: `        .section ".data"
        # variables avec valeur initiale

        .section ".bss"
        # variables sans valeur initiale

        .section ".text"
main:
`,
        solution: `        .section ".data"
lettre: .byte   'E'
score:  .word   1500
solde:  .long   -250
grand:  .quad   5000000000

        .section ".bss"
compteur: .skip 4

        .section ".text"
main:
`,
        tests: [
          { attendu: { "lettre:b": "E", "score:w": 1500, "solde:l": -250, "grand:q": "5000000000", "compteur:l": 0 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-movs-movz",
        titre: "Agrandir une valeur",
        description: "movsbl, movzbl, movswq.",
        cours: [
          "Pour copier une valeur courte dans un registre plus grand : `movs…` recopie le signe (nombres signés), `movz…` complète avec des zéros (non signés).",
          "Les deux dernières lettres donnent les tailles : `movsbl` = **b**yte → **l**ong, `movswq` = **w**ord → **q**uad."
        ],
        exemple: {
          code: `        movb    $-2, %al        # al = 0xfe
        movsbl  %al, %ebx       # ebx = -2   (signe recopié)
        movzbl  %al, %ecx       # ecx = 254  (zéros ajoutés)`
        },
        consigne: "`octet` est un `char` et `court` un `short`. Mettre dans `%eax` la valeur **signée** de `octet` sur 4 octets, dans `%ebx` sa valeur **non signée** sur 4 octets, et dans `%rcx` la valeur **signée** de `court` sur 8 octets.",
        depart: `        .section ".data"
octet:  .byte   -5
court:  .word   -300

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
octet:  .byte   -5
court:  .word   -300

        .section ".text"
main:
        movsbl  octet, %eax
        movzbl  octet, %ebx
        movswq  court, %rcx
`,
        tests: [
          { entrees: { octet: -5, court: -300 }, attendu: { "%eax": -5, "%ebx": 251, "%rcx": -300 } },
          { entrees: { octet: 100, court: 1000 }, attendu: { "%eax": 100, "%ebx": 100, "%rcx": 1000 } },
          { entrees: { octet: -128, court: -1 }, attendu: { "%eax": -128, "%ebx": 128, "%rcx": -1 } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 2 — ARITHMÉTIQUE
     ========================================================= */
  {
    id: "asm-ch2",
    titre: "Calculs",
    description: "add, sub, inc, dec, neg, imul, idiv, div et expressions.",
    exercices: [
      {
        type: "code",
        langage: "asm",
        id: "asm-add-sub",
        titre: "Additionner et soustraire",
        description: "addl et subl.",
        cours: "`addl src, dest` calcule dest + src ; `subl src, dest` calcule dest − src. Le résultat remplace la destination.",
        exemple: {
          code: `        movl    $10, %eax       # eax = 10
        addl    $5, %eax        # eax = 15
        subl    %ebx, %eax      # eax = 15 - ebx`
        },
        consigne: "Calculer `total = a + b - 10`.",
        depart: `        .section ".data"
a:      .long   7
b:      .long   8
total:  .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
a:      .long   7
b:      .long   8
total:  .long   0

        .section ".text"
main:
        movl    a, %eax
        addl    b, %eax
        subl    $10, %eax
        movl    %eax, total
`,
        tests: [
          { entrees: { a: 7, b: 8 }, attendu: { total: 5 } },
          { entrees: { a: -3, b: 20 }, attendu: { total: 7 } },
          { entrees: { a: 100, b: 0 }, attendu: { total: 90 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-inc-dec-neg",
        titre: "Incrémenter, décrémenter, changer de signe",
        description: "incl, decl et negl sur des variables.",
        cours: "`incl`, `decl` et `negl` n'ont qu'un opérande, registre ou variable : +1, −1 et changement de signe.",
        exemple: {
          code: `        incl    compteur        # compteur++
        negl    %eax            # eax = -eax`
        },
        consigne: "Retirer 1 à `vies`, ajouter 2 à `points` et changer le signe de `ecart`.",
        interdire: ["add", "sub"],
        depart: `        .section ".data"
vies:   .long   3
points: .long   10
ecart:  .long   7

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
vies:   .long   3
points: .long   10
ecart:  .long   7

        .section ".text"
main:
        decl    vies
        incl    points
        incl    points
        negl    ecart
`,
        tests: [
          { entrees: { vies: 3, points: 10, ecart: 7 }, attendu: { vies: 2, points: 12, ecart: -7 } },
          { entrees: { vies: 0, points: -1, ecart: -20 }, attendu: { vies: -1, points: 1, ecart: 20 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-imul",
        titre: "Multiplier",
        description: "imull à un opérande.",
        cours: "`imull src` multiplie `%eax` par la source. Le résultat va dans `%edx:%eax` : quand il est petit, il tient entièrement dans `%eax`. La source ne peut pas être une valeur immédiate.",
        exemple: {
          code: `        movl    $6, %eax        # eax = 6
        movl    $7, %ecx        # ecx = 7
        imull   %ecx            # eax = 42`
        },
        consigne: "Calculer `aire = largeur * hauteur`.",
        depart: `        .section ".data"
largeur: .long  4
hauteur: .long  5
aire:   .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
largeur: .long  4
hauteur: .long  5
aire:   .long   0

        .section ".text"
main:
        movl    largeur, %eax
        imull   hauteur
        movl    %eax, aire
`,
        tests: [
          { entrees: { largeur: 4, hauteur: 5 }, attendu: { aire: 20 } },
          { entrees: { largeur: -3, hauteur: 7 }, attendu: { aire: -21 } },
          { entrees: { largeur: 1000, hauteur: 1000 }, attendu: { aire: 1000000 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-idiv",
        titre: "Quotient et reste",
        description: "cltd puis idivl.",
        cours: [
          "`idivl src` divise `%edx:%eax` par la source : le quotient va dans `%eax`, le reste dans `%edx`.",
          "Juste avant, `cltd` remplit `%edx` à partir du signe de `%eax`. Sans lui, `%edx` contient n'importe quoi."
        ],
        exemple: {
          code: `        movl    $17, %eax       # dividende
        cltd                    # EDX:EAX = 17
        movl    $5, %ecx        # diviseur
        idivl   %ecx            # eax = 3, edx = 2`
        },
        consigne: "Calculer `q = a / b` et `r = a % b` (entiers signés).",
        depart: `        .section ".data"
a:      .long   17
b:      .long   5
q:      .long   0
r:      .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
a:      .long   17
b:      .long   5
q:      .long   0
r:      .long   0

        .section ".text"
main:
        movl    a, %eax
        cltd
        idivl   b
        movl    %eax, q
        movl    %edx, r
`,
        tests: [
          { entrees: { a: 17, b: 5 }, attendu: { q: 3, r: 2 } },
          { entrees: { a: -17, b: 5 }, attendu: { q: -3, r: -2 } },
          { entrees: { a: 100, b: -7 }, attendu: { q: -14, r: 2 } },
          { entrees: { a: 6, b: 3 }, attendu: { q: 2, r: 0 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-div",
        titre: "Division non signée",
        description: "divl avec %edx à zéro.",
        cours: "Pour des `unsigned`, on divise avec `divl` et on met `%edx` à 0 avant (pas de `cltd`, qui traiterait le nombre comme signé).",
        exemple: {
          code: `        movl    $4000000000, %eax
        movl    $0, %edx        # EDX:EAX = 4000000000
        movl    $3, %ecx
        divl    %ecx            # eax = 1333333333, edx = 1`
        },
        consigne: "`n` et `taille` sont des `unsigned int`. Calculer `paquets = n / taille` et `restant = n % taille`.",
        nonSigne: ["n", "paquets", "restant", "taille"],
        depart: `        .section ".data"
n:      .long   100
taille: .long   9
paquets: .long  0
restant: .long  0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
n:      .long   100
taille: .long   9
paquets: .long  0
restant: .long  0

        .section ".text"
main:
        movl    n, %eax
        movl    $0, %edx
        divl    taille
        movl    %eax, paquets
        movl    %edx, restant
`,
        tests: [
          { entrees: { n: 100, taille: 9 }, attendu: { paquets: 11, restant: 1 } },
          { entrees: { n: 4000000000, taille: 7 }, attendu: { paquets: 571428571, restant: 3 } },
          { entrees: { n: 3000000001, taille: 2 }, attendu: { paquets: 1500000000, restant: 1 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-expression",
        titre: "Calculer une expression",
        description: "Enchaîner plusieurs opérations dans des registres.",
        cours: "Une expression se calcule opération par opération, dans l'ordre des priorités du C. Les résultats intermédiaires restent dans des registres.",
        exemple: {
          legende: "y = 3 * x + 1;",
          code: `        movl    x, %eax
        movl    $3, %ecx
        imull   %ecx            # eax = 3 * x
        addl    $1, %eax        # eax = 3 * x + 1
        movl    %eax, y`
        },
        consigne: "Calculer `resultat = (a + b) * (c - d)`.",
        depart: `        .section ".data"
a:      .long   2
b:      .long   3
c:      .long   10
d:      .long   4
resultat: .long 0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
a:      .long   2
b:      .long   3
c:      .long   10
d:      .long   4
resultat: .long 0

        .section ".text"
main:
        movl    a, %eax
        addl    b, %eax         # eax = a + b
        movl    c, %ecx
        subl    d, %ecx         # ecx = c - d
        imull   %ecx            # eax = (a + b) * (c - d)
        movl    %eax, resultat
`,
        tests: [
          { entrees: { a: 2, b: 3, c: 10, d: 4 }, attendu: { resultat: 30 } },
          { entrees: { a: -5, b: 1, c: 0, d: 3 }, attendu: { resultat: 12 } },
          { entrees: { a: 7, b: 0, c: 2, d: 2 }, attendu: { resultat: 0 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-secondes",
        titre: "Convertir une durée",
        description: "Réutiliser le reste d'une division.",
        cours: "Une division donne deux résultats à la fois : le reste, dans `%edx`, peut servir de dividende à la division suivante.",
        exemple: {
          legende: "minutes = t / 60;  secondes = t % 60;",
          code: `        movl    t, %eax
        cltd
        movl    $60, %ecx
        idivl   %ecx            # eax = t / 60, edx = t % 60
        movl    %eax, minutes
        movl    %edx, secondes`
        },
        consigne: "Décomposer `duree` (en secondes, positive) en `heures`, `minutes` et `secondes`.",
        depart: `        .section ".data"
duree:  .long   3725
heures: .long   0
minutes: .long  0
secondes: .long 0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
duree:  .long   3725
heures: .long   0
minutes: .long  0
secondes: .long 0

        .section ".text"
main:
        movl    duree, %eax
        cltd
        movl    $3600, %ecx
        idivl   %ecx            # eax = heures, edx = reste
        movl    %eax, heures
        movl    %edx, %eax
        cltd
        movl    $60, %ecx
        idivl   %ecx
        movl    %eax, minutes
        movl    %edx, secondes
`,
        tests: [
          { entrees: { duree: 3725 }, attendu: { heures: 1, minutes: 2, secondes: 5 } },
          { entrees: { duree: 59 }, attendu: { heures: 0, minutes: 0, secondes: 59 } },
          { entrees: { duree: 86399 }, attendu: { heures: 23, minutes: 59, secondes: 59 } },
          { entrees: { duree: 7200 }, attendu: { heures: 2, minutes: 0, secondes: 0 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-division-64",
        titre: "Division sur 8 octets",
        description: "cqto et idivq sur des long.",
        cours: "Sur 8 octets, même principe avec les registres 64 bits : dividende dans `%rax`, `cqto` pour préparer `%rdx`, puis `idivq`.",
        exemple: {
          code: `        movq    $-100, %rax
        cqto                    # RDX:RAX = -100
        movq    $7, %rcx
        idivq   %rcx            # rax = -14, rdx = -2`
        },
        consigne: "`grand`, `diviseur` et `quotient` sont des `long`. Calculer `quotient = grand / diviseur`.",
        depart: `        .section ".data"
grand:  .quad   10000000000
diviseur: .quad 3
quotient: .quad 0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
grand:  .quad   10000000000
diviseur: .quad 3
quotient: .quad 0

        .section ".text"
main:
        movq    grand, %rax
        cqto
        idivq   diviseur
        movq    %rax, quotient
`,
        tests: [
          { entrees: { grand: "10000000000", diviseur: 3 }, attendu: { quotient: "3333333333" } },
          { entrees: { grand: "-9000000000", diviseur: 4 }, attendu: { quotient: "-2250000000" } },
          { entrees: { grand: 50, diviseur: -5 }, attendu: { quotient: -10 } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 3 — BITS ET DÉCALAGES
     ========================================================= */
  {
    id: "asm-ch3",
    titre: "Bits et décalages",
    description: "and, or, xor, not, sal, sar, shr.",
    exercices: [
      {
        type: "code",
        langage: "asm",
        id: "asm-parite",
        titre: "Tester la parité",
        description: "Isoler le dernier bit avec and.",
        cours: "`andl src, dest` ne garde que les bits à 1 dans les deux opérandes. `andl $1` isole le dernier bit : il vaut 1 pour un nombre impair, 0 pour un pair.",
        exemple: {
          code: `        movl    $13, %eax
        andl    $1, %eax        # eax = 1 : 13 est impair
        movl    $0x1234, %ebx
        andl    $0xf, %ebx      # ebx = 4 : les 4 derniers bits`
        },
        consigne: "Mettre dans `impair` 1 si `n` est impair, 0 sinon.",
        interdire: ["idiv", "div"],
        depart: `        .section ".data"
n:      .long   7
impair: .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
n:      .long   7
impair: .long   0

        .section ".text"
main:
        movl    n, %eax
        andl    $1, %eax
        movl    %eax, impair
`,
        tests: [
          { entrees: { n: 7 }, attendu: { impair: 1 } },
          { entrees: { n: 10 }, attendu: { impair: 0 } },
          { entrees: { n: -3 }, attendu: { impair: 1 } },
          { entrees: { n: 0 }, attendu: { impair: 0 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-or-xor-not",
        titre: "Allumer, basculer, inverser",
        description: "Masques avec or, xor et not.",
        cours: "`orl masque` met à 1 les bits du masque, `xorl masque` les inverse, `notl` inverse tous les bits.",
        exemple: {
          code: `        movl    $0b0101, %eax
        orl     $0b0010, %eax   # eax = 0b0111
        xorl    $0b0100, %eax   # eax = 0b0011
        notl    %eax            # eax = ~3 = -4`
        },
        consigne: "Sur `drapeaux` : mettre le bit 4 à 1 (masque 16), puis inverser le bit 0 (masque 1). Mettre ensuite dans `inverse` la valeur `~drapeaux`.",
        depart: `        .section ".data"
drapeaux: .long 0
inverse: .long  0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
drapeaux: .long 0
inverse: .long  0

        .section ".text"
main:
        orl     $16, drapeaux
        xorl    $1, drapeaux
        movl    drapeaux, %eax
        notl    %eax
        movl    %eax, inverse
`,
        tests: [
          { entrees: { drapeaux: 0 }, attendu: { drapeaux: 17, inverse: -18 } },
          { entrees: { drapeaux: 17 }, attendu: { drapeaux: 16, inverse: -17 } },
          { entrees: { drapeaux: 5 }, attendu: { drapeaux: 20, inverse: -21 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-sal",
        titre: "Multiplier par décalage",
        description: "sall : multiplier par une puissance de 2.",
        cours: "`sall $n, dest` décale les bits vers la gauche de n positions, ce qui multiplie par 2ⁿ.",
        exemple: {
          code: `        movl    $5, %eax
        sall    $3, %eax        # eax = 5 × 2³ = 40`
        },
        consigne: "Calculer `y = x * 16` avec un décalage.",
        imposer: ["sal|shl"],
        interdire: ["imul", "mul"],
        depart: `        .section ".data"
x:      .long   3
y:      .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
x:      .long   3
y:      .long   0

        .section ".text"
main:
        movl    x, %eax
        sall    $4, %eax
        movl    %eax, y
`,
        tests: [
          { entrees: { x: 3 }, attendu: { y: 48 } },
          { entrees: { x: -2 }, attendu: { y: -32 } },
          { entrees: { x: 0 }, attendu: { y: 0 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-sar-shr",
        titre: "Diviser par décalage",
        description: "sarl pour les signés, shrl pour les non signés.",
        cours: "Vers la droite, un décalage divise par 2ⁿ : `sarl` pour un nombre signé (le signe est conservé), `shrl` pour un non signé (des zéros entrent à gauche).",
        exemple: {
          code: `        movl    $-40, %eax
        sarl    $3, %eax        # eax = -5
        movl    $-40, %ebx
        shrl    $3, %ebx        # ebx = 536870907 (lu comme non signé)`
        },
        consigne: "`s` est un `int` multiple de 4 et `u` un `unsigned int`. Calculer `s4 = s / 4` et `u8 = u / 8` avec des décalages.",
        imposer: ["sar", "shr"],
        interdire: ["idiv", "div"],
        nonSigne: ["u", "u8"],
        depart: `        .section ".data"
s:      .long   -20
u:      .long   64
s4:     .long   0
u8:     .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
s:      .long   -20
u:      .long   64
s4:     .long   0
u8:     .long   0

        .section ".text"
main:
        movl    s, %eax
        sarl    $2, %eax
        movl    %eax, s4
        movl    u, %eax
        shrl    $3, %eax
        movl    %eax, u8
`,
        tests: [
          { entrees: { s: -20, u: 4000000000 }, attendu: { s4: -5, u8: 500000000 } },
          { entrees: { s: 64, u: 17 }, attendu: { s4: 16, u8: 2 } },
          { entrees: { s: -4, u: 8 }, attendu: { s4: -1, u8: 1 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-fois-dix",
        titre: "Multiplier par 10 sans imul",
        description: "Combiner décalages et addition.",
        cours: "Toute multiplication par une constante se décompose en puissances de 2 : 10 × x = 8 × x + 2 × x. Deux décalages et une addition suffisent.",
        exemple: {
          legende: "y = x * 5;  (5x = 4x + x)",
          code: `        movl    x, %eax
        movl    %eax, %ecx      # ecx = x
        sall    $2, %eax        # eax = 4 * x
        addl    %ecx, %eax      # eax = 5 * x
        movl    %eax, y`
        },
        consigne: "Calculer `y = x * 10`.",
        interdire: ["imul", "mul"],
        depart: `        .section ".data"
x:      .long   7
y:      .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
x:      .long   7
y:      .long   0

        .section ".text"
main:
        movl    x, %eax
        sall    $1, %eax        # eax = 2 * x
        movl    %eax, %ecx
        sall    $2, %eax        # eax = 8 * x
        addl    %ecx, %eax      # eax = 10 * x
        movl    %eax, y
`,
        tests: [
          { entrees: { x: 7 }, attendu: { y: 70 } },
          { entrees: { x: -13 }, attendu: { y: -130 } },
          { entrees: { x: 123456 }, attendu: { y: 1234560 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-extraire-bits",
        titre: "Extraire des bits",
        description: "shrl puis andl pour lire un champ de bits.",
        cours: "Pour lire un groupe de bits : décaler vers la droite jusqu'au premier bit voulu, puis ne garder que la largeur voulue avec `and`.",
        exemple: {
          legende: "bits 8 à 11 de eax",
          code: `        shrl    $8, %eax        # les bits 8… arrivent en position 0
        andl    $0xf, %eax      # garde 4 bits`
        },
        consigne: "`couleur` contient une couleur `0xRRGGBB`. Mettre dans `rouge` les bits 16 à 23, dans `vert` les bits 8 à 15 et dans `bleu` les bits 0 à 7.",
        depart: `        .section ".data"
couleur: .long  0x12abef
rouge:  .long   0
vert:   .long   0
bleu:   .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
couleur: .long  0x12abef
rouge:  .long   0
vert:   .long   0
bleu:   .long   0

        .section ".text"
main:
        movl    couleur, %eax
        shrl    $16, %eax
        andl    $0xff, %eax
        movl    %eax, rouge
        movl    couleur, %eax
        shrl    $8, %eax
        andl    $0xff, %eax
        movl    %eax, vert
        movl    couleur, %eax
        andl    $0xff, %eax
        movl    %eax, bleu
`,
        tests: [
          { entrees: { couleur: 0x12abef }, attendu: { rouge: 18, vert: 171, bleu: 239 } },
          { entrees: { couleur: 0xff8000 }, attendu: { rouge: 255, vert: 128, bleu: 0 } },
          { entrees: { couleur: 0x0000ff }, attendu: { rouge: 0, vert: 0, bleu: 255 } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 4 — APLATIR LE C
     ========================================================= */
  {
    id: "asm-ch4",
    titre: "Aplatir le C",
    description: "Réécrire if, else, while et for avec seulement if (…) goto et goto.",
    exercices: [
      {
        type: "code",
        langage: "c",
        id: "aplatir-if",
        titre: "Aplatir un if",
        description: "if (…) goto vers la fin du bloc.",
        cours: [
          "Avant de traduire en assembleur, on réécrit le C sans imbrication : seulement `if (condition) goto étiquette;`, `goto étiquette;` et des étiquettes.",
          "Un `if` saute **par-dessus** son bloc quand la condition est fausse : on teste la condition **inverse**."
        ],
        exemple: {
          legende: "if (x > 0) { y = x; }  →  C aplati",
          code: `    if (x <= 0) goto endif1;
    y = x;
endif1:`
        },
        consigne: "Aplatir ce code :",
        aTraduire: {
          legende: "C",
          code: `if (n < 0) {
    n = -n;
    signe = 1;
}`
        },
        aplati: true,
        depart: `int n;
int signe;

// C aplati :

`,
        solution: `int n;
int signe;

    if (n >= 0) goto endif1;
    n = -n;
    signe = 1;
endif1:
`,
        tests: [
          { entrees: { n: -5 }, attendu: { n: 5, signe: 1 } },
          { entrees: { n: 3 }, attendu: { n: 3, signe: 0 } },
          { entrees: { n: 0 }, attendu: { n: 0, signe: 0 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "aplatir-if-else",
        titre: "Aplatir un if … else",
        description: "goto else1 et goto endif1.",
        cours: "Pour un `if … else` : si la condition est fausse, sauter à `else1` ; à la fin du bloc vrai, `goto endif1` pour ne pas exécuter le bloc faux.",
        exemple: {
          legende: "if (x == 0) y = 1; else y = 2;  →  C aplati",
          code: `    if (x != 0) goto else1;
    y = 1;
    goto endif1;
else1:
    y = 2;
endif1:`
        },
        consigne: "Aplatir ce code :",
        aTraduire: {
          legende: "C",
          code: `if (a >= b) {
    max = a;
    min = b;
} else {
    max = b;
    min = a;
}`
        },
        aplati: true,
        depart: `int a;
int b;
int max;
int min;

// C aplati :

`,
        solution: `int a;
int b;
int max;
int min;

    if (a < b) goto else1;
    max = a;
    min = b;
    goto endif1;
else1:
    max = b;
    min = a;
endif1:
`,
        tests: [
          { entrees: { a: 3, b: 9 }, attendu: { max: 9, min: 3 } },
          { entrees: { a: 9, b: 3 }, attendu: { max: 9, min: 3 } },
          { entrees: { a: 4, b: 4 }, attendu: { max: 4, min: 4 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "aplatir-while",
        titre: "Aplatir un while",
        description: "Étiquette de boucle, sortie et retour au test.",
        cours: "Un `while` devient : une étiquette avant le test, un `if (…) goto` vers la sortie sur la condition inverse, le corps, puis `goto` vers l'étiquette du test.",
        exemple: {
          legende: "while (i < 3) { i++; }  →  C aplati",
          code: `loop1:
    if (i >= 3) goto endloop1;
    i++;
    goto loop1;
endloop1:`
        },
        consigne: "Aplatir ce code :",
        aTraduire: {
          legende: "C",
          code: `somme = 0;
while (n > 0) {
    somme += n;
    n--;
}`
        },
        aplati: true,
        depart: `int n;
int somme;

// C aplati :

`,
        solution: `int n;
int somme;

    somme = 0;
loop1:
    if (n <= 0) goto endloop1;
    somme += n;
    n--;
    goto loop1;
endloop1:
`,
        tests: [
          { entrees: { n: 4 }, attendu: { somme: 10, n: 0 } },
          { entrees: { n: 0, somme: 99 }, attendu: { somme: 0, n: 0 } },
          { entrees: { n: 1 }, attendu: { somme: 1, n: 0 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "aplatir-for",
        titre: "Aplatir un for",
        description: "Initialisation avant la boucle, pas avant le retour.",
        cours: "`for (init; cond; pas) corps` s'aplatit comme un `while` : `init` avant l'étiquette, `pas` juste avant le `goto` de retour.",
        exemple: {
          legende: "for (i = 0; i < 3; i++) t += 2;  →  C aplati",
          code: `    i = 0;
loop1:
    if (i >= 3) goto endloop1;
    t += 2;
    i++;
    goto loop1;
endloop1:`
        },
        consigne: "Aplatir ce code :",
        aTraduire: {
          legende: "C",
          code: `p = 1;
for (i = 0; i < e; i++) {
    p *= 3;
}`
        },
        aplati: true,
        depart: `int e;
int i;
int p;

// C aplati :

`,
        solution: `int e;
int i;
int p;

    p = 1;
    i = 0;
loop1:
    if (i >= e) goto endloop1;
    p *= 3;
    i++;
    goto loop1;
endloop1:
`,
        tests: [
          { entrees: { e: 4 }, attendu: { p: 81, i: 4 } },
          { entrees: { e: 0 }, attendu: { p: 1, i: 0 } },
          { entrees: { e: 1 }, attendu: { p: 3, i: 1 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "aplatir-imbrique",
        titre: "Aplatir un if dans une boucle",
        description: "Deux structures imbriquées, deux jeux d'étiquettes.",
        cours: "Quand des structures sont imbriquées, chacune reçoit ses propres étiquettes numérotées (`loop1`, `endloop1`, `endif1`…). On aplatit de l'extérieur vers l'intérieur.",
        exemple: {
          legende: "while (x > 1) { if (x > 10) x -= 10; x--; }  →  C aplati",
          code: `loop1:
    if (x <= 1) goto endloop1;
    if (x <= 10) goto endif1;
    x -= 10;
endif1:
    x--;
    goto loop1;
endloop1:`
        },
        consigne: "Aplatir ce code :",
        aTraduire: {
          legende: "C",
          code: `pairs = 0;
i = 0;
while (i < n) {
    if (t[i] % 2 == 0) {
        pairs++;
    }
    i++;
}`
        },
        aplati: true,
        depart: `int t[8];
int n;
int i;
int pairs;

// C aplati :

`,
        solution: `int t[8];
int n;
int i;
int pairs;

    pairs = 0;
    i = 0;
loop1:
    if (i >= n) goto endloop1;
    if (t[i] % 2 != 0) goto endif1;
    pairs++;
endif1:
    i++;
    goto loop1;
endloop1:
`,
        tests: [
          { entrees: { t: [2, 5, 8, 3, 10, -4, -3, 0], n: 8 }, attendu: { pairs: 5 } },
          { entrees: { t: [1, 3, 5, 7, 2, 2, 2, 2], n: 4 }, attendu: { pairs: 0 } },
          { entrees: { t: [6, 6, 6, 6, 6, 6, 6, 6], n: 0 }, attendu: { pairs: 0 } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 5 — CONDITIONS
     ========================================================= */
  {
    id: "asm-ch5",
    titre: "Conditions",
    description: "jmp, cmp, sauts conditionnels signés et non signés.",
    exercices: [
      {
        type: "code",
        langage: "asm",
        id: "asm-jmp",
        titre: "Sauter une instruction",
        description: "jmp vers une étiquette.",
        cours: "`jmp etiquette` continue l'exécution à l'étiquette : les instructions placées entre les deux ne sont pas exécutées.",
        exemple: {
          code: `        movl    $1, %eax
        jmp     suite           # va directement à suite
        movl    $2, %eax        # jamais exécuté
suite:
        addl    $10, %eax       # eax = 11`
        },
        consigne: "Sans supprimer de ligne, ajouter un saut pour que `resultat` vaille 1 à la fin.",
        imposer: ["jmp"],
        motifs: [
          { motif: "movl\\s+\\$2\\s*,\\s*resultat", message: "La ligne « movl $2, resultat » doit rester dans le code" }
        ],
        depart: `        .section ".data"
resultat: .long 0

        .section ".text"
main:
        movl    $1, resultat
        movl    $2, resultat
fin:
`,
        solution: `        .section ".data"
resultat: .long 0

        .section ".text"
main:
        movl    $1, resultat
        jmp     fin
        movl    $2, resultat
fin:
`,
        tests: [
          { attendu: { resultat: 1 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-cmp-je",
        titre: "Tester une égalité",
        description: "cmpl puis jne.",
        cours: [
          "`cmpl src, dest` compare dest à src sans rien modifier ; le saut qui suit décide. `je` saute si égal, `jne` si différent.",
          "Pour exécuter un bloc seulement si deux valeurs sont égales, on saute **par-dessus** quand elles sont différentes."
        ],
        exemple: {
          legende: "if (eax == 0) ebx = 1;",
          code: `        cmpl    $0, %eax        # compare eax à 0
        jne     suite           # différent → on saute le bloc
        movl    $1, %ebx        # exécuté seulement si eax == 0
suite:`
        },
        consigne: "Si `code` vaut 404, mettre `erreur` à 1 (sinon ne rien changer).",
        depart: `        .section ".data"
code:   .long   404
erreur: .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
code:   .long   404
erreur: .long   0

        .section ".text"
main:
        cmpl    $404, code
        jne     endif1
        movl    $1, erreur
endif1:
`,
        tests: [
          { entrees: { code: 404 }, attendu: { erreur: 1 } },
          { entrees: { code: 200 }, attendu: { erreur: 0 } },
          { entrees: { code: 403 }, attendu: { erreur: 0 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-valeur-absolue",
        titre: "Valeur absolue",
        description: "Un if sans else : cmpl, jge, negl.",
        cours: "Un `if` sans `else` : comparer, sauter par-dessus le bloc sur la condition inverse, écrire le bloc, puis l'étiquette de fin.",
        exemple: {
          legende: "if (x > 100) x = 100;",
          code: `        cmpl    $100, x         # compare x à 100
        jle     endif1          # inverse de x > 100
        movl    $100, x
endif1:`
        },
        consigne: "Remplacer `i` par sa valeur absolue.",
        depart: `        .section ".data"
i:      .long   -9

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
i:      .long   -9

        .section ".text"
main:
        cmpl    $0, i
        jge     endif1
        negl    i
endif1:
`,
        tests: [
          { entrees: { i: -9 }, attendu: { i: 9 } },
          { entrees: { i: 4 }, attendu: { i: 4 } },
          { entrees: { i: 0 }, attendu: { i: 0 } },
          { entrees: { i: -2147483647 }, attendu: { i: 2147483647 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-maximum",
        titre: "Le plus grand de deux",
        description: "Un if … else avec jmp endif1.",
        cours: "Un `if … else` : sauter vers `else1` sur la condition inverse ; à la fin du bloc vrai, `jmp endif1` pour ne pas exécuter le bloc faux.",
        exemple: {
          legende: "if (x == y) z = 0; else z = 1;",
          code: `        movl    x, %eax
        cmpl    y, %eax
        jne     else1
        movl    $0, z
        jmp     endif1
else1:
        movl    $1, z
endif1:`
        },
        consigne: "Mettre dans `max` le plus grand de `a` et `b` (entiers signés).",
        depart: `        .section ".data"
a:      .long   3
b:      .long   8
max:    .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
a:      .long   3
b:      .long   8
max:    .long   0

        .section ".text"
main:
        movl    a, %eax
        cmpl    b, %eax
        jl      else1
        movl    %eax, max
        jmp     endif1
else1:
        movl    b, %eax
        movl    %eax, max
endif1:
`,
        tests: [
          { entrees: { a: 3, b: 8 }, attendu: { max: 8 } },
          { entrees: { a: 8, b: 3 }, attendu: { max: 8 } },
          { entrees: { a: -5, b: -2 }, attendu: { max: -2 } },
          { entrees: { a: -1, b: 1 }, attendu: { max: 1 } },
          { entrees: { a: 7, b: 7 }, attendu: { max: 7 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-signe",
        titre: "Trois cas",
        description: "Enchaîner plusieurs tests.",
        cours: "Plusieurs cas s'enchaînent : chaque test saute au cas suivant quand il échoue, et chaque cas se termine par un `jmp` vers la fin commune.",
        exemple: {
          code: `        cmpl    $0, %eax
        jne     nonnul          # eax != 0 → cas suivant
        movl    $100, %ebx      # cas eax == 0
        jmp     fin
nonnul:
        movl    $200, %ebx      # tous les autres cas
fin:`
        },
        consigne: "Mettre dans `s` : -1 si `x < 0`, 0 si `x == 0`, 1 si `x > 0`.",
        depart: `        .section ".data"
x:      .long   -7
s:      .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
x:      .long   -7
s:      .long   0

        .section ".text"
main:
        cmpl    $0, x
        jge     positif
        movl    $-1, s
        jmp     fin
positif:
        cmpl    $0, x
        jne     strict
        movl    $0, s
        jmp     fin
strict:
        movl    $1, s
fin:
`,
        tests: [
          { entrees: { x: -7, s: 5 }, attendu: { s: -1 } },
          { entrees: { x: 0, s: 5 }, attendu: { s: 0 } },
          { entrees: { x: 12, s: 5 }, attendu: { s: 1 } },
          { entrees: { x: -2147483648, s: 5 }, attendu: { s: -1 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-non-signe",
        titre: "Comparer des non signés",
        description: "jb, jbe, ja, jae.",
        cours: "`cmp` est le même pour les signés et les non signés : seul le saut change. Pour des `unsigned` : `jb` (<), `jbe` (<=), `ja` (>), `jae` (>=).",
        exemple: {
          code: `        movl    $-1, %eax       # 0xffffffff
        cmpl    $1, %eax
        jl      A               # saute : -1 < 1 en signé
        ja      B               # saute : 4294967295 > 1 en non signé`
        },
        consigne: "`a`, `b` et `petit` sont des `unsigned int`. Mettre dans `petit` le plus petit de `a` et `b`.",
        nonSigne: ["a", "b", "petit"],
        depart: `        .section ".data"
a:      .long   10
b:      .long   20
petit:  .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
a:      .long   10
b:      .long   20
petit:  .long   0

        .section ".text"
main:
        movl    a, %eax
        cmpl    b, %eax
        jbe     endif1          # a <= b : a est le plus petit
        movl    b, %eax
endif1:
        movl    %eax, petit
`,
        tests: [
          { entrees: { a: 10, b: 20 }, attendu: { petit: 10 } },
          { entrees: { a: 4000000000, b: 5 }, attendu: { petit: 5 } },
          { entrees: { a: 5, b: 4000000000 }, attendu: { petit: 5 } },
          { entrees: { a: 3000000001, b: 3000000000 }, attendu: { petit: 3000000000 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-bornes",
        titre: "Limiter une valeur",
        description: "Deux if à la suite, deux étiquettes.",
        cours: "Deux `if` indépendants se traduisent l'un après l'autre, chacun avec sa propre étiquette de fin : `endif1`, puis `endif2`.",
        exemple: {
          legende: "if (a < b) a = b;  if (a == 0) a = 1;",
          code: `        movl    a, %eax
        cmpl    b, %eax
        jge     endif1
        movl    b, %eax
        movl    %eax, a
endif1:
        cmpl    $0, a
        jne     endif2
        movl    $1, a
endif2:`
        },
        consigne: "Ramener `note` entre 0 et 20 : une note négative devient 0, une note supérieure à 20 devient 20.",
        depart: `        .section ".data"
note:   .long   25

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
note:   .long   25

        .section ".text"
main:
        cmpl    $0, note
        jge     endif1
        movl    $0, note
endif1:
        cmpl    $20, note
        jle     endif2
        movl    $20, note
endif2:
`,
        tests: [
          { entrees: { note: -3 }, attendu: { note: 0 } },
          { entrees: { note: 25 }, attendu: { note: 20 } },
          { entrees: { note: 14 }, attendu: { note: 14 } },
          { entrees: { note: 0 }, attendu: { note: 0 } },
          { entrees: { note: 20 }, attendu: { note: 20 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-et-logique",
        titre: "Deux conditions à la fois",
        description: "&& : chaque test peut sauter à la fin.",
        cours: "`if (A && B)` : si A est fausse, on saute déjà à la fin ; sinon on teste B, qui peut lui aussi sauter à la fin. Le bloc n'est atteint que si les deux sont vraies.",
        exemple: {
          legende: "if (x > 0 && y > 0) z = 1;",
          code: `        cmpl    $0, x
        jle     endif1          # x <= 0 → fin
        cmpl    $0, y
        jle     endif1          # y <= 0 → fin
        movl    $1, z
endif1:`
        },
        consigne: "`c` est un `char`. Si c'est une lettre minuscule (`c >= 'a' && c <= 'z'`), la transformer en majuscule en lui retirant 32.",
        depart: `        .section ".data"
c:      .byte   'q'

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
c:      .byte   'q'

        .section ".text"
main:
        cmpb    $'a', c
        jl      endif1
        cmpb    $'z', c
        jg      endif1
        subb    $32, c
endif1:
`,
        tests: [
          { entrees: { c: "q" }, attendu: { c: "Q" } },
          { entrees: { c: "a" }, attendu: { c: "A" } },
          { entrees: { c: "z" }, attendu: { c: "Z" } },
          { entrees: { c: "A" }, attendu: { c: "A" } },
          { entrees: { c: "{" }, attendu: { c: "{" } },
          { entrees: { c: "`" }, attendu: { c: "`" } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 6 — BOUCLES
     ========================================================= */
  {
    id: "asm-ch6",
    titre: "Boucles",
    description: "while et for en assembleur, signés et non signés.",
    exercices: [
      {
        type: "code",
        langage: "asm",
        id: "asm-while",
        titre: "Boucle while",
        description: "Étiquette, test de sortie, jmp de retour.",
        cours: "Une boucle : une étiquette avant le test, une sortie sur la condition inverse, le corps, puis `jmp` vers l'étiquette.",
        exemple: {
          legende: "while (x < 100) x *= 2;",
          code: `loop1:
        cmpl    $100, x
        jge     endloop1        # inverse de x < 100
        sall    $1, x           # x *= 2
        jmp     loop1
endloop1:`
        },
        consigne: "Calculer avec une boucle `somme = n + (n-1) + … + 1`, ou 0 si `n <= 0`.",
        imposer: ["jmp"],
        depart: `        .section ".data"
n:      .long   4
somme:  .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
n:      .long   4
somme:  .long   0

        .section ".text"
main:
        movl    $0, somme
loop1:
        cmpl    $0, n
        jle     endloop1
        movl    n, %eax
        addl    %eax, somme
        decl    n
        jmp     loop1
endloop1:
`,
        tests: [
          { entrees: { n: 4 }, attendu: { somme: 10 } },
          { entrees: { n: 1 }, attendu: { somme: 1 } },
          { entrees: { n: 0, somme: 8 }, attendu: { somme: 0 } },
          { entrees: { n: -3 }, attendu: { somme: 0 } },
          { entrees: { n: 100 }, attendu: { somme: 5050 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-for-puissance",
        titre: "Boucle for : puissance",
        description: "init, test, corps, pas, retour.",
        cours: "`for (init; cond; pas)` : `init` avant l'étiquette, le test en haut, puis le corps, `pas` et le `jmp` de retour.",
        exemple: {
          legende: "for (i = 0; i < n; i++) total += 5;",
          code: `        movl    $0, i
loop1:
        movl    i, %eax
        cmpl    n, %eax
        jge     endloop1
        addl    $5, total
        incl    i
        jmp     loop1
endloop1:`
        },
        consigne: "Calculer `puissance` = `base` à la puissance `exp` (avec `exp >= 0`).",
        depart: `        .section ".data"
base:   .long   2
exp:    .long   10
i:      .long   0
puissance: .long 0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
base:   .long   2
exp:    .long   10
i:      .long   0
puissance: .long 0

        .section ".text"
main:
        movl    $1, puissance
        movl    $0, i
loop1:
        movl    i, %eax
        cmpl    exp, %eax
        jge     endloop1
        movl    puissance, %eax
        imull   base
        movl    %eax, puissance
        incl    i
        jmp     loop1
endloop1:
`,
        tests: [
          { entrees: { base: 2, exp: 10 }, attendu: { puissance: 1024 } },
          { entrees: { base: 3, exp: 0 }, attendu: { puissance: 1 } },
          { entrees: { base: -2, exp: 3 }, attendu: { puissance: -8 } },
          { entrees: { base: 5, exp: 1 }, attendu: { puissance: 5 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-factorielle-non-signee",
        titre: "Factorielle non signée",
        description: "mull et jbe au lieu de imull et jle.",
        cours: "Pour des `unsigned`, la boucle garde la même forme ; seules changent les instructions qui dépendent du signe : `jbe`/`ja`… au lieu de `jle`/`jg`…, `mull` au lieu de `imull`.",
        exemple: {
          legende: "Version signée (int fact, n)",
          code: `        movl    $1, fact
loop1:
        cmpl    $1, n
        jle     endloop1
        movl    fact, %eax
        imull   n
        movl    %eax, fact
        decl    n
        jmp     loop1
endloop1:`
        },
        consigne: "`fact` et `n` sont des `unsigned int`. Calculer `fact = n!`.",
        imposer: ["mul", "jbe|jb|ja|jae"],
        interdire: ["imul", "jle", "jl", "jg", "jge"],
        nonSigne: ["fact", "n"],
        depart: `        .section ".data"
fact:   .long   0
n:      .long   5

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
fact:   .long   0
n:      .long   5

        .section ".text"
main:
        movl    $1, fact
loop1:
        cmpl    $1, n
        jbe     endloop1
        movl    fact, %eax
        mull    n
        movl    %eax, fact
        decl    n
        jmp     loop1
endloop1:
`,
        tests: [
          { entrees: { n: 5 }, attendu: { fact: 120 } },
          { entrees: { n: 0 }, attendu: { fact: 1 } },
          { entrees: { n: 1 }, attendu: { fact: 1 } },
          { entrees: { n: 12 }, attendu: { fact: 479001600 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-compter-bits",
        titre: "Compter les bits à 1",
        description: "Boucle sur les bits avec and et shr.",
        cours: "Pour parcourir les bits d'un nombre : tester le dernier bit avec `and $1`, retirer ce bit avec un décalage à droite, recommencer tant que le nombre n'est pas nul.",
        exemple: {
          legende: "Nombre de bits significatifs de eax",
          code: `        movl    $0, %ecx
loop1:
        cmpl    $0, %eax
        je      endloop1        # plus aucun bit à 1
        incl    %ecx
        shrl    $1, %eax        # retire le dernier bit
        jmp     loop1
endloop1:`
        },
        consigne: "Mettre dans `uns` le nombre de bits à 1 de `x`.",
        nonSigne: ["x"],
        depart: `        .section ".data"
x:      .long   7
uns:    .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
x:      .long   7
uns:    .long   0

        .section ".text"
main:
        movl    x, %eax
        movl    $0, %ecx
loop1:
        cmpl    $0, %eax
        je      endloop1
        movl    %eax, %edx
        andl    $1, %edx
        addl    %edx, %ecx
        shrl    $1, %eax
        jmp     loop1
endloop1:
        movl    %ecx, uns
`,
        tests: [
          { entrees: { x: 7 }, attendu: { uns: 3 } },
          { entrees: { x: 0 }, attendu: { uns: 0 } },
          { entrees: { x: 1234 }, attendu: { uns: 5 } },
          { entrees: { x: 2147483648 }, attendu: { uns: 1 } },
          { entrees: { x: -1 }, attendu: { uns: 32 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-pgcd",
        titre: "PGCD",
        description: "Algorithme d'Euclide avec idivl.",
        cours: "Algorithme d'Euclide : tant que `b` n'est pas nul, remplacer `(a, b)` par `(b, a % b)`. À la fin, `a` est le PGCD. Le reste s'obtient avec `cltd` et `idivl`.",
        exemple: {
          legende: "edx = eax % ecx",
          code: `        cltd
        idivl   %ecx            # eax = quotient, edx = reste`
        },
        consigne: "Calculer `pgcd`, le PGCD de `a` et `b` (strictement positifs).",
        depart: `        .section ".data"
a:      .long   48
b:      .long   18
pgcd:   .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
a:      .long   48
b:      .long   18
pgcd:   .long   0

        .section ".text"
main:
        movl    a, %eax
        movl    b, %ecx
loop1:
        cmpl    $0, %ecx
        je      endloop1
        cltd
        idivl   %ecx            # edx = a % b
        movl    %ecx, %eax      # a = b
        movl    %edx, %ecx      # b = a % b
        jmp     loop1
endloop1:
        movl    %eax, pgcd
`,
        tests: [
          { entrees: { a: 48, b: 18 }, attendu: { pgcd: 6 } },
          { entrees: { a: 17, b: 5 }, attendu: { pgcd: 1 } },
          { entrees: { a: 100, b: 100 }, attendu: { pgcd: 100 } },
          { entrees: { a: 7, b: 49 }, attendu: { pgcd: 7 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-fibonacci",
        titre: "Suite de Fibonacci",
        description: "Faire avancer deux valeurs dans une boucle.",
        cours: "Une boucle peut faire avancer plusieurs valeurs à la fois : on garde les anciennes dans des registres le temps de calculer les nouvelles.",
        exemple: {
          legende: "Avancer (a, b) → (b, a + b)",
          code: `        movl    %eax, %edx
        addl    %ecx, %edx      # edx = a + b
        movl    %ecx, %eax      # a = b
        movl    %edx, %ecx      # b = ancien a + b`
        },
        consigne: "Calculer `fib` = F(n), avec F(0) = 0, F(1) = 1 et F(k) = F(k-1) + F(k-2).",
        depart: `        .section ".data"
n:      .long   10
fib:    .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
n:      .long   10
fib:    .long   0

        .section ".text"
main:
        movl    $0, %eax        # F(k)
        movl    $1, %ecx        # F(k+1)
        movl    n, %esi         # tours restants
loop1:
        cmpl    $0, %esi
        je      endloop1
        movl    %eax, %edx
        addl    %ecx, %edx
        movl    %ecx, %eax
        movl    %edx, %ecx
        decl    %esi
        jmp     loop1
endloop1:
        movl    %eax, fib
`,
        tests: [
          { entrees: { n: 10 }, attendu: { fib: 55 } },
          { entrees: { n: 0, fib: 3 }, attendu: { fib: 0 } },
          { entrees: { n: 1 }, attendu: { fib: 1 } },
          { entrees: { n: 30 }, attendu: { fib: 832040 } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 7 — TABLEAUX
     ========================================================= */
  {
    id: "asm-ch7",
    titre: "Tableaux",
    description: "Adressage indexé, indirect, parcours et chaînes.",
    exercices: [
      {
        type: "code",
        langage: "asm",
        id: "asm-tableau-lire",
        titre: "Lire une case",
        description: "Forme t(,%reg,4).",
        cours: "L'adresse de `t[i]` vaut `t + i × taille d'une case`. La forme `t(,%registre,4)` fait ce calcul pour un tableau d'`int`.",
        exemple: {
          code: `        movl    $2, %ecx
        movl    t(,%ecx,4), %eax # eax = t[2]`
        },
        consigne: "Mettre dans `valeur` la case `t[i]`.",
        depart: `        .section ".data"
t:      .long   10, 20, 30, 40, 50
i:      .long   3
valeur: .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
t:      .long   10, 20, 30, 40, 50
i:      .long   3
valeur: .long   0

        .section ".text"
main:
        movl    i, %eax
        movl    t(,%eax,4), %edx
        movl    %edx, valeur
`,
        tests: [
          { entrees: { i: 3 }, attendu: { valeur: 40 } },
          { entrees: { i: 0 }, attendu: { valeur: 10 } },
          { entrees: { t: [5, 6, 7, 8, 9], i: 4 }, attendu: { valeur: 9 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-tableau-ecrire",
        titre: "Écrire une case",
        description: "L'opérande indexé en destination.",
        cours: "Pour écrire dans `t[i]`, on utilise la même adresse que pour lire, en destination. La valeur à écrire doit d'abord être dans un registre si elle vient d'une variable.",
        exemple: {
          code: `        movl    $1, %ecx
        movl    $0, t(,%ecx,4)  # t[1] = 0`
        },
        consigne: "Faire `t[i] = v`.",
        depart: `        .section ".data"
t:      .long   10, 20, 30, 40, 50
i:      .long   1
v:      .long   99

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
t:      .long   10, 20, 30, 40, 50
i:      .long   1
v:      .long   99

        .section ".text"
main:
        movl    i, %eax
        movl    v, %edx
        movl    %edx, t(,%eax,4)
`,
        tests: [
          { entrees: { i: 1, v: 99 }, attendu: { t: [10, 99, 30, 40, 50] } },
          { entrees: { i: 4, v: -1 }, attendu: { t: [10, 20, 30, 40, -1] } },
          { entrees: { i: 0, v: 7 }, attendu: { t: [7, 20, 30, 40, 50] } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-tableau-indirect",
        titre: "Adresse calculée à la main",
        description: "movslq, salq, addq $t puis (%rax).",
        cours: "Sans facteur d'échelle, on calcule l'adresse dans un registre de 8 octets : `movslq` pour agrandir l'index, `salq $2` pour le multiplier par 4, `addq $t` pour ajouter l'adresse du tableau, puis `(%rax)` pour lire à cette adresse.",
        exemple: {
          legende: "t[2] dans %r10d",
          code: `        movq    $2, %rax
        salq    $2, %rax        # rax = 8
        addq    $t, %rax        # rax = adresse de t[2]
        movl    (%rax), %r10d   # r10d = t[2]`
        },
        consigne: "Faire `n = t[i]` en calculant l'adresse vous-même.",
        motifs: [
          { motif: "\\(\\s*%r[a-z0-9]+\\s*\\)", message: "Lire la case avec l'adressage indirect, par exemple (%rax)", regle: "adressage indirect `(%registre)`" }
        ],
        exclure: [
          { motif: ",\\s*[1248]\\s*\\)", message: "Ne pas utiliser la forme t(,%registre,4) dans cet exercice", regle: "la forme `t(,%registre,4)`" }
        ],
        depart: `        .section ".data"
t:      .long   10, 20, 30, 40, 50
i:      .long   2
n:      .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
t:      .long   10, 20, 30, 40, 50
i:      .long   2
n:      .long   0

        .section ".text"
main:
        movslq  i, %rax
        salq    $2, %rax
        addq    $t, %rax
        movl    (%rax), %edx
        movl    %edx, n
`,
        tests: [
          { entrees: { i: 2 }, attendu: { n: 30 } },
          { entrees: { i: 0 }, attendu: { n: 10 } },
          { entrees: { i: 4 }, attendu: { n: 50 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-tableau-somme",
        titre: "Somme d'un tableau",
        description: "Parcourir les cases avec un registre index.",
        cours: "Pour parcourir un tableau, un registre sert d'index : il part de 0, avance de 1 à chaque tour, et la boucle s'arrête au nombre de cases.",
        exemple: {
          legende: "for (i = 0; i < 5; i++) t[i] = 0;",
          code: `        movl    $0, %ecx
loop1:
        cmpl    $5, %ecx
        jge     endloop1
        movl    $0, t(,%ecx,4)  # t[i] = 0
        incl    %ecx
        jmp     loop1
endloop1:`
        },
        consigne: "Calculer `somme`, la somme des `n` premières cases de `t`.",
        depart: `        .section ".data"
t:      .long   3, 1, 4, 1, 5, 9, 2, 6
n:      .long   8
somme:  .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
t:      .long   3, 1, 4, 1, 5, 9, 2, 6
n:      .long   8
somme:  .long   0

        .section ".text"
main:
        movl    $0, %eax
        movl    $0, %ecx
loop1:
        cmpl    n, %ecx
        jge     endloop1
        addl    t(,%ecx,4), %eax
        incl    %ecx
        jmp     loop1
endloop1:
        movl    %eax, somme
`,
        tests: [
          { entrees: { n: 8 }, attendu: { somme: 31 } },
          { entrees: { n: 3 }, attendu: { somme: 8 } },
          { entrees: { n: 0, somme: 4 }, attendu: { somme: 0 } },
          { entrees: { t: [-5, 5, -10, 0, 0, 0, 0, 0], n: 3 }, attendu: { somme: -10 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-tableau-max",
        titre: "Plus grande valeur",
        description: "Parcours avec comparaison au meilleur trouvé.",
        cours: "Pour chercher un maximum : partir de la première case, puis comparer chaque case suivante au meilleur trouvé et le remplacer quand elle est plus grande.",
        exemple: {
          legende: "Garder t[i] s'il est plus grand que eax",
          code: `        movl    t(,%ecx,4), %edx
        cmpl    %eax, %edx      # compare t[i] au maximum actuel
        jle     suite1
        movl    %edx, %eax      # nouveau maximum
suite1:`
        },
        consigne: "Mettre dans `max` la plus grande valeur parmi les `n` premières cases de `t` (`n >= 1`).",
        depart: `        .section ".data"
t:      .long   3, 1, 4, 1, 5, 9, 2, 6
n:      .long   8
max:    .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
t:      .long   3, 1, 4, 1, 5, 9, 2, 6
n:      .long   8
max:    .long   0

        .section ".text"
main:
        movl    t, %eax         # max = t[0]
        movl    $1, %ecx
loop1:
        cmpl    n, %ecx
        jge     endloop1
        movl    t(,%ecx,4), %edx
        cmpl    %eax, %edx
        jle     suite1
        movl    %edx, %eax
suite1:
        incl    %ecx
        jmp     loop1
endloop1:
        movl    %eax, max
`,
        tests: [
          { entrees: { n: 8 }, attendu: { max: 9 } },
          { entrees: { t: [-7, -3, -9, 100, 0, 0, 0, 0], n: 3 }, attendu: { max: -3 } },
          { entrees: { t: [4, 8, 15, 16, 23, 42, 0, 0], n: 1 }, attendu: { max: 4 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-chaine-longueur",
        titre: "Longueur d'une chaîne",
        description: "Parcourir des octets jusqu'au 0 final.",
        cours: "Une chaîne `.string` est un tableau de `char` terminé par l'octet 0. On la parcourt octet par octet : échelle 1, suffixe `b`, et `cmpb $0` pour détecter la fin.",
        exemple: {
          code: `        movl    $3, %ecx
        movb    msg(,%ecx,1), %al # al = msg[3]
        cmpb    $'a', %al       # compare msg[3] à 'a'`
        },
        consigne: "Mettre dans `longueur` le nombre de caractères de `texte`, sans compter le 0 final.",
        depart: `        .section ".data"
texte:  .string "assembleur"
        .skip   40
longueur: .long 0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
texte:  .string "assembleur"
        .skip   40
longueur: .long 0

        .section ".text"
main:
        movl    $0, %ecx
loop1:
        cmpb    $0, texte(,%ecx,1)
        je      endloop1
        incl    %ecx
        jmp     loop1
endloop1:
        movl    %ecx, longueur
`,
        tests: [
          { attendu: { longueur: 10 } },
          { entrees: { texte: "bonjour" }, attendu: { longueur: 7 } },
          { entrees: { texte: "" }, attendu: { longueur: 0 } },
          { entrees: { texte: "une phrase plus longue" }, attendu: { longueur: 22 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-chaine-majuscules",
        titre: "Mettre en majuscules",
        description: "Parcours d'octets et condition sur chaque caractère.",
        cours: "Modifier une chaîne : lire chaque octet dans `%al`, décider avec des comparaisons `cmpb`, puis réécrire l'octet à la même adresse.",
        exemple: {
          legende: "Remplacer les espaces par des _",
          code: `        movb    s(,%ecx,1), %al
        cmpb    $' ', %al
        jne     suite1
        movb    $'_', s(,%ecx,1)
suite1:`
        },
        consigne: "Transformer chaque lettre minuscule de `texte` en majuscule (retirer 32), jusqu'au 0 final. Les autres caractères ne changent pas.",
        depart: `        .section ".data"
texte:  .string "Hello, world"
        .skip   40

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
texte:  .string "Hello, world"
        .skip   40

        .section ".text"
main:
        movl    $0, %ecx
loop1:
        movb    texte(,%ecx,1), %al
        cmpb    $0, %al
        je      endloop1
        cmpb    $'a', %al
        jl      suite1
        cmpb    $'z', %al
        jg      suite1
        subb    $32, %al
        movb    %al, texte(,%ecx,1)
suite1:
        incl    %ecx
        jmp     loop1
endloop1:
`,
        tests: [
          { attendu: { texte: "HELLO, WORLD" } },
          { entrees: { texte: "abc-XYZ {az}" }, attendu: { texte: "ABC-XYZ {AZ}" } },
          { entrees: { texte: "" }, attendu: { texte: "" } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-tableau-inverser",
        titre: "Inverser un tableau",
        description: "Deux index qui se rapprochent.",
        cours: "Pour inverser un tableau sur place : un index part du début, un autre de la fin ; on échange les deux cases, puis on les rapproche jusqu'à ce qu'ils se croisent.",
        exemple: {
          legende: "Échanger t[ecx] et t[edx]",
          code: `        movl    t(,%ecx,4), %eax
        movl    t(,%edx,4), %esi
        movl    %esi, t(,%ecx,4)
        movl    %eax, t(,%edx,4)`
        },
        consigne: "Inverser l'ordre des `n` premières cases de `t`. Les cases suivantes ne doivent pas changer.",
        depart: `        .section ".data"
t:      .long   1, 2, 3, 4, 5, 6, 7, 8
n:      .long   5

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
t:      .long   1, 2, 3, 4, 5, 6, 7, 8
n:      .long   5

        .section ".text"
main:
        movl    $0, %ecx        # gauche
        movl    n, %edx
        decl    %edx            # droite
loop1:
        cmpl    %edx, %ecx
        jge     endloop1
        movl    t(,%ecx,4), %eax
        movl    t(,%edx,4), %esi
        movl    %esi, t(,%ecx,4)
        movl    %eax, t(,%edx,4)
        incl    %ecx
        decl    %edx
        jmp     loop1
endloop1:
`,
        tests: [
          { entrees: { n: 5 }, attendu: { t: [5, 4, 3, 2, 1, 6, 7, 8] } },
          { entrees: { n: 8 }, attendu: { t: [8, 7, 6, 5, 4, 3, 2, 1] } },
          { entrees: { n: 1 }, attendu: { t: [1, 2, 3, 4, 5, 6, 7, 8] } },
          { entrees: { n: 0 }, attendu: { t: [1, 2, 3, 4, 5, 6, 7, 8] } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 8 — STRUCTURES
     ========================================================= */
  {
    id: "asm-ch8",
    titre: "Structures",
    description: "Déplacements des champs, remplissage, tableaux de structures.",
    exercices: [
      {
        type: "code",
        langage: "asm",
        id: "asm-struct-champs",
        titre: "Champs d'une structure",
        description: "Adresse dans un registre, champs par déplacement.",
        cours: "Les champs d'une structure sont rangés à la suite. Avec l'adresse de la structure dans un registre, `0(%rax)` désigne le premier champ, `4(%rax)` celui qui commence 4 octets plus loin, etc.",
        exemple: {
          legende: "struct S { int i; int j; } myStruct;",
          code: `        movq    $myStruct, %rax
        movl    $18, 0(%rax)    # myStruct.i = 18
        movl    $19, 4(%rax)    # myStruct.j = 19`
        },
        consigne: "`struct Point { int x; int y; int z; } p;` — Faire `p.z = p.x + p.y`.",
        motifs: [
          { motif: "\\d\\s*\\(\\s*%r[a-z0-9]+\\s*\\)", message: "Accéder aux champs avec déplacement(%registre), par exemple 4(%rax)", regle: "accès aux champs avec `déplacement(%registre)`" }
        ],
        depart: `        .section ".data"
p:      .long   3, 4, 0         # x, y, z

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
p:      .long   3, 4, 0         # x, y, z

        .section ".text"
main:
        movq    $p, %rax
        movl    0(%rax), %edx
        addl    4(%rax), %edx
        movl    %edx, 8(%rax)
`,
        tests: [
          { entrees: { p: [3, 4, 0] }, attendu: { "p+8:l": 7 } },
          { entrees: { p: [-10, 2, 99] }, attendu: { "p+8:l": -8 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-struct-padding",
        titre: "Remplissage après un char",
        description: "Déplacements et taille d'une structure avec octets vides.",
        cours: [
          "Un `int` commence à un déplacement multiple de 4, un `short` à un multiple de 2 : après un `char`, le compilateur laisse des octets vides.",
          "La taille totale est arrondie au multiple de l'alignement le plus grand de la structure."
        ],
        exemple: {
          legende: "struct { char c; int i; } myStruct;  (c:0, i:4, taille 8)",
          code: `        .section ".bss"
myStruct: .skip 8

        .section ".text"
        movq    $myStruct, %rax
        movb    $'A', 0(%rax)
        movl    $18, 4(%rax)`
        },
        consigne: [
          "`struct Article { char categorie; int quantite; short rayon; } a;`",
          "Réserver `a` dans `.bss` avec la taille exacte de la structure, puis faire `a.categorie = 'B'`, `a.quantite = 250` et `a.rayon = 12`."
        ],
        motifs: [
          { motif: "\\ba\\s*:\\s*\\.skip\\s+12\\b", message: "La place réservée pour `a` ne correspond pas à sizeof(struct Article)" }
        ],
        depart: `        .section ".bss"
        # réserver la structure a

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".bss"
a:      .skip   12              # categorie:0  quantite:4  rayon:8

        .section ".text"
main:
        movq    $a, %rax
        movb    $'B', 0(%rax)
        movl    $250, 4(%rax)
        movw    $12, 8(%rax)
`,
        tests: [
          { attendu: { "a:b": "B", "a+4:l": 250, "a+8:w": 12 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-struct-long",
        titre: "Remplissage avant un long",
        description: "Champ de 8 octets et addition sur 8 octets.",
        cours: "Un `long` commence à un déplacement multiple de 8 : après un `char`, 7 octets vides. La structure entière a alors une taille multiple de 8.",
        exemple: {
          legende: "struct { char c; long l; } s;  (c:0, l:8, taille 16)",
          code: `        movq    $s, %rax
        movq    $-1, 8(%rax)    # s.l = -1`
        },
        consigne: [
          "`struct Compte { char type; long solde; int numero; } c;` — `c` est déjà déclarée.",
          "Ajouter 1000 au solde et mettre `numero` à 7, sans modifier `type`."
        ],
        depart: `        .section ".data"
c:      .byte   'C'             # type
        .skip   7
        .quad   500             # solde
        .long   0               # numero
        .skip   4

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
c:      .byte   'C'             # type
        .skip   7
        .quad   500             # solde
        .long   0               # numero
        .skip   4

        .section ".text"
main:
        movq    $c, %rax
        addq    $1000, 8(%rax)
        movl    $7, 16(%rax)
`,
        tests: [
          { entrees: { "c+8:q": 500 }, attendu: { "c:b": "C", "c+8:q": 1500, "c+16:l": 7 } },
          { entrees: { "c+8:q": "-3000000000" }, attendu: { "c:b": "C", "c+8:q": "-2999999000", "c+16:l": 7 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "asm-tableau-structures",
        titre: "Tableau de structures",
        description: "Échelle égale à la taille de la structure.",
        cours: "Dans un tableau de structures, l'élément `k` commence à `k × taille de la structure`. On ajoute ensuite le déplacement du champ : `pts+4(,%rcx,8)` désigne le champ situé 4 octets après le début de `pts[rcx]`.",
        exemple: {
          legende: "struct Point { int x; int y; } pts[4];  pts[i].x = 0;",
          code: `        movl    i, %ecx
        movl    $0, pts(,%ecx,8) # pts[i].x = 0`
        },
        consigne: "Mettre dans `sommeY` la somme des champs `y` des `n` premiers points de `pts`.",
        depart: `        .section ".data"
pts:    .long   1, 10, 2, 20, 3, 30, 4, 40   # {x, y} × 4
n:      .long   4
sommeY: .long   0

        .section ".text"
main:
        # votre code ici
`,
        solution: `        .section ".data"
pts:    .long   1, 10, 2, 20, 3, 30, 4, 40   # {x, y} × 4
n:      .long   4
sommeY: .long   0

        .section ".text"
main:
        movl    $0, %eax
        movl    $0, %ecx
loop1:
        cmpl    n, %ecx
        jge     endloop1
        addl    pts+4(,%ecx,8), %eax
        incl    %ecx
        jmp     loop1
endloop1:
        movl    %eax, sommeY
`,
        tests: [
          { entrees: { n: 4 }, attendu: { sommeY: 100 } },
          { entrees: { n: 2 }, attendu: { sommeY: 30 } },
          { entrees: { pts: [0, -5, 0, 5, 0, 7, 9, 9], n: 3 }, attendu: { sommeY: 7 } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 9 — TRADUIRE DU C EN ASSEMBLEUR
     ========================================================= */
  {
    id: "asm-ch9",
    titre: "Traduire du C en assembleur",
    description: "Programmes C complets à réécrire en assembleur x86-64.",
    exercices: [
      {
        type: "code",
        langage: "asm",
        id: "trad-affectations",
        titre: "Affectations",
        description: "Multiplication, soustraction et division en séquence.",
        cours: "Traduire une ligne de C à la fois : chaque variable globale est une étiquette, les calculs passent par des registres, le résultat est rangé dans la variable.",
        exemple: {
          legende: "c = a - b * 2;",
          code: `        movl    b, %eax
        sall    $1, %eax        # eax = b * 2
        movl    a, %ecx
        subl    %eax, %ecx      # ecx = a - b * 2
        movl    %ecx, c`
        },
        consigne: "Traduire ce code en assembleur :",
        aTraduire: {
          legende: "C",
          code: `int prix, quantite, remise, total;

total = prix * quantite;
total = total - remise;
remise = total / 10;`
        },
        depart: `        .section ".data"
prix:   .long   12
quantite: .long 5
remise: .long   7
total:  .long   0

        .section ".text"
main:
        # traduction
`,
        solution: `        .section ".data"
prix:   .long   12
quantite: .long 5
remise: .long   7
total:  .long   0

        .section ".text"
main:
        movl    prix, %eax
        imull   quantite
        movl    %eax, total
        movl    remise, %eax
        subl    %eax, total
        movl    total, %eax
        cltd
        movl    $10, %ecx
        idivl   %ecx
        movl    %eax, remise
`,
        tests: [
          { entrees: { prix: 12, quantite: 5, remise: 7 }, attendu: { total: 53, remise: 5 } },
          { entrees: { prix: 100, quantite: 3, remise: 45 }, attendu: { total: 255, remise: 25 } },
          { entrees: { prix: 7, quantite: 0, remise: 4 }, attendu: { total: -4, remise: 0 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "trad-if-else",
        titre: "if … else if … else",
        description: "Trois branches, une étiquette de fin commune.",
        cours: "Un `else if` est un `if … else` placé dans le `else` : chaque branche se termine par un `jmp` vers la même étiquette de fin.",
        exemple: {
          legende: "if (x == 1) y = 10; else if (x == 2) y = 20; else y = 0;",
          code: `        cmpl    $1, x
        jne     else1
        movl    $10, y
        jmp     endif1
else1:
        cmpl    $2, x
        jne     else2
        movl    $20, y
        jmp     endif1
else2:
        movl    $0, y
endif1:`
        },
        consigne: "Traduire ce code en assembleur :",
        aTraduire: {
          legende: "C",
          code: `int temperature, etat;

if (temperature < 0)
    etat = -1;
else if (temperature <= 30)
    etat = 0;
else
    etat = 1;`
        },
        depart: `        .section ".data"
temperature: .long 12
etat:   .long   5

        .section ".text"
main:
        # traduction
`,
        solution: `        .section ".data"
temperature: .long 12
etat:   .long   5

        .section ".text"
main:
        cmpl    $0, temperature
        jge     else1
        movl    $-1, etat
        jmp     endif1
else1:
        cmpl    $30, temperature
        jg      else2
        movl    $0, etat
        jmp     endif1
else2:
        movl    $1, etat
endif1:
`,
        tests: [
          { entrees: { temperature: -5 }, attendu: { etat: -1 } },
          { entrees: { temperature: 0 }, attendu: { etat: 0 } },
          { entrees: { temperature: 30 }, attendu: { etat: 0 } },
          { entrees: { temperature: 31 }, attendu: { etat: 1 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "trad-for-carres",
        titre: "Somme des carrés",
        description: "Boucle for avec <= et multiplication.",
        cours: "Pour une boucle `for`, repérer les trois morceaux (`init`, `cond`, `pas`), écrire la sortie sur la condition inverse, puis traduire le corps.",
        exemple: {
          legende: "for (i = 10; i > 0; i -= 2) n++;",
          code: `        movl    $10, i
loop1:
        cmpl    $0, i
        jle     endloop1        # inverse de i > 0
        incl    n
        subl    $2, i
        jmp     loop1
endloop1:`
        },
        consigne: "Traduire ce code en assembleur :",
        aTraduire: {
          legende: "C",
          code: `int n, i, somme;

somme = 0;
for (i = 1; i <= n; i++)
    somme += i * i;`
        },
        depart: `        .section ".data"
n:      .long   3
i:      .long   0
somme:  .long   0

        .section ".text"
main:
        # traduction
`,
        solution: `        .section ".data"
n:      .long   3
i:      .long   0
somme:  .long   0

        .section ".text"
main:
        movl    $0, somme
        movl    $1, i
loop1:
        movl    i, %eax
        cmpl    n, %eax
        jg      endloop1
        imull   %eax            # eax = i * i
        addl    %eax, somme
        incl    i
        jmp     loop1
endloop1:
`,
        tests: [
          { entrees: { n: 3 }, attendu: { somme: 14, i: 4 } },
          { entrees: { n: 0, somme: 9 }, attendu: { somme: 0, i: 1 } },
          { entrees: { n: 10 }, attendu: { somme: 385, i: 11 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "trad-unsigned-chiffres",
        titre: "Nombre de chiffres (unsigned)",
        description: "while non signé avec divl.",
        cours: "Les types du C décident des instructions : pour des `unsigned`, sauts `jb`/`jae`… et division avec `divl` après `%edx` à 0.",
        exemple: {
          legende: "unsigned int u;  if (u >= 1000) u = u / 1000;",
          code: `        cmpl    $1000, u
        jb      endif1          # inverse de u >= 1000
        movl    u, %eax
        movl    $0, %edx
        movl    $1000, %ecx
        divl    %ecx
        movl    %eax, u
endif1:`
        },
        consigne: "Traduire ce code en assembleur :",
        aTraduire: {
          legende: "C",
          code: `unsigned int n, chiffres;

chiffres = 1;
while (n >= 10) {
    n = n / 10;
    chiffres++;
}`
        },
        nonSigne: ["n", "chiffres"],
        depart: `        .section ".data"
n:      .long   1000
chiffres: .long 0

        .section ".text"
main:
        # traduction
`,
        solution: `        .section ".data"
n:      .long   1000
chiffres: .long 0

        .section ".text"
main:
        movl    $1, chiffres
loop1:
        cmpl    $10, n
        jb      endloop1
        movl    n, %eax
        movl    $0, %edx
        movl    $10, %ecx
        divl    %ecx
        movl    %eax, n
        incl    chiffres
        jmp     loop1
endloop1:
`,
        tests: [
          { entrees: { n: 1000 }, attendu: { chiffres: 4, n: 1 } },
          { entrees: { n: 0 }, attendu: { chiffres: 1, n: 0 } },
          { entrees: { n: 9 }, attendu: { chiffres: 1, n: 9 } },
          { entrees: { n: 4294967295 }, attendu: { chiffres: 10, n: 4 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "trad-recherche",
        titre: "Recherche dans un tableau",
        description: "Boucle, tableau et break.",
        cours: "Un `break` devient un `jmp` vers l'étiquette de fin de la boucle.",
        exemple: {
          legende: "while (1) { if (x > 100) break; x *= 2; }",
          code: `loop1:
        cmpl    $100, x
        jle     endif1
        jmp     endloop1        # break
endif1:
        sall    $1, x
        jmp     loop1
endloop1:`
        },
        consigne: "Traduire ce code en assembleur :",
        aTraduire: {
          legende: "C",
          code: `int t[6], n, x, i, position;

position = -1;
for (i = 0; i < n; i++) {
    if (t[i] == x) {
        position = i;
        break;
    }
}`
        },
        depart: `        .section ".data"
t:      .long   4, 8, 15, 16, 23, 42
n:      .long   6
x:      .long   15
i:      .long   0
position: .long 0

        .section ".text"
main:
        # traduction
`,
        solution: `        .section ".data"
t:      .long   4, 8, 15, 16, 23, 42
n:      .long   6
x:      .long   15
i:      .long   0
position: .long 0

        .section ".text"
main:
        movl    $-1, position
        movl    $0, i
loop1:
        movl    i, %ecx
        cmpl    n, %ecx
        jge     endloop1
        movl    t(,%ecx,4), %eax
        cmpl    x, %eax
        jne     endif1
        movl    %ecx, position
        jmp     endloop1
endif1:
        incl    i
        jmp     loop1
endloop1:
`,
        tests: [
          { entrees: { x: 15 }, attendu: { position: 2 } },
          { entrees: { x: 42 }, attendu: { position: 5 } },
          { entrees: { x: 7 }, attendu: { position: -1 } },
          { entrees: { x: 4, n: 0 }, attendu: { position: -1 } },
          { entrees: { t: [1, 2, 1, 2, 1, 2], x: 2 }, attendu: { position: 1, i: 1 } }
        ]
      },
      {
        type: "code",
        langage: "asm",
        id: "trad-struct",
        titre: "Structure avec int et long",
        description: "Déplacements, condition sur un champ et movslq.",
        cours: "Pour une structure : calculer d'abord le déplacement de chaque champ (remplissage compris), puis traduire en `déplacement(%registre)`. Ajouter un `int` à un `long` demande d'agrandir l'`int` avec `movslq`.",
        exemple: {
          legende: "long l; int i;  l = l + i;",
          code: `        movslq  i, %rax         # rax = i sur 8 octets
        addq    %rax, l`
        },
        consigne: "Traduire ce code en assembleur :",
        aTraduire: {
          legende: "C",
          code: `struct Etudiant {
    char groupe;
    int note;
    long id;
};
struct Etudiant e;

if (e.note >= 10)
    e.groupe = 'A';
else
    e.groupe = 'B';
e.id = e.id + e.note;`
        },
        depart: `        .section ".bss"
e:      .skip   16              # struct Etudiant e;

        .section ".text"
main:
        # traduction
`,
        solution: `        .section ".bss"
e:      .skip   16              # groupe:0  note:4  id:8

        .section ".text"
main:
        movq    $e, %rax
        cmpl    $10, 4(%rax)
        jl      else1
        movb    $'A', 0(%rax)
        jmp     endif1
else1:
        movb    $'B', 0(%rax)
endif1:
        movslq  4(%rax), %rdx
        addq    %rdx, 8(%rax)
`,
        tests: [
          { entrees: { "e+4:l": 12, "e+8:q": 1000 }, attendu: { "e:b": "A", "e+8:q": 1012 } },
          { entrees: { "e+4:l": 7, "e+8:q": "4294967295" }, attendu: { "e:b": "B", "e+8:q": "4294967302" } },
          { entrees: { "e+4:l": 10, "e+8:q": 0 }, attendu: { "e:b": "A", "e+8:q": 10 } },
          { entrees: { "e+4:l": -3, "e+8:q": "4294967296" }, attendu: { "e:b": "B", "e+8:q": "4294967293" } }
        ]
      }
    ]
  },

  /* =========================================================
     CHAPITRE 10 — TRADUIRE DE L'ASSEMBLEUR EN C
     ========================================================= */
  {
    id: "asm-ch10",
    titre: "Traduire de l'assembleur en C",
    description: "Retrouver le code C d'un programme assembleur.",
    exercices: [
      {
        type: "code",
        langage: "c",
        id: "retro-calcul",
        titre: "Retrouver un calcul",
        description: "Suivre le contenu des registres.",
        cours: "Pour remonter vers le C : repérer les variables (étiquettes), suivre ce que contient chaque registre ligne après ligne, puis écrire l'opération complète à chaque rangement dans une variable.",
        exemple: {
          legende: "Assembleur  →  c = (a + b) * 2;",
          code: `        movl    a, %eax         # eax = a
        addl    b, %eax         # eax = a + b
        sall    $1, %eax        # eax = (a + b) * 2
        movl    %eax, c         # c = (a + b) * 2;`
        },
        consigne: "Écrire en C ce que fait ce code :",
        aTraduire: {
          legende: "Assembleur",
          code: `        movl    x, %eax
        imull   y
        subl    $5, %eax
        movl    %eax, z
        negl    z
        movl    z, %eax
        cltd
        movl    $3, %ecx
        idivl   %ecx
        movl    %edx, r`
        },
        depart: `int x, y, z, r;

// traduction en C :

`,
        solution: `int x, y, z, r;

z = x * y - 5;
z = -z;
r = z % 3;
`,
        tests: [
          { entrees: { x: 4, y: 3 }, attendu: { z: -7, r: -1 } },
          { entrees: { x: 0, y: 9 }, attendu: { z: 5, r: 2 } },
          { entrees: { x: -2, y: 6 }, attendu: { z: 17, r: 2 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "retro-if-else",
        titre: "Retrouver un if … else",
        description: "Reconnaître la condition inverse et le jmp.",
        cours: "Un saut conditionnel suivi d'un bloc, d'un `jmp` et d'une étiquette `else` est un `if … else`. La condition du `if` C est l'**inverse** du saut.",
        exemple: {
          legende: "Assembleur  →  if (n != 0) m = 1; else m = 2;",
          code: `        cmpl    $0, n
        je      else1           # saute si n == 0 → condition C : n != 0
        movl    $1, m
        jmp     endif1
else1:
        movl    $2, m
endif1:`
        },
        consigne: "Écrire en C ce que fait ce code (avec `if` et `else`) :",
        aTraduire: {
          legende: "Assembleur",
          code: `        movl    a, %eax
        cmpl    b, %eax
        jle     else1
        subl    b, %eax
        movl    %eax, d
        jmp     endif1
else1:
        movl    b, %eax
        subl    a, %eax
        movl    %eax, d
endif1:`
        },
        imposer: ["if", "else"],
        depart: `int a, b, d;

// traduction en C :

`,
        solution: `int a, b, d;

if (a > b)
    d = a - b;
else
    d = b - a;
`,
        tests: [
          { entrees: { a: 9, b: 4 }, attendu: { d: 5 } },
          { entrees: { a: 4, b: 9 }, attendu: { d: 5 } },
          { entrees: { a: -3, b: -3 }, attendu: { d: 0 } },
          { entrees: { a: -10, b: 5 }, attendu: { d: 15 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "retro-boucle",
        titre: "Retrouver une boucle",
        description: "Boucle while contenant un if … else.",
        cours: "Une étiquette suivie d'un test de sortie, avec un `jmp` vers cette étiquette à la fin, est une boucle `while`. À l'intérieur, les autres sauts forment des `if`.",
        exemple: {
          legende: "Assembleur  →  while (k < 50) k += 7;",
          code: `loop1:
        cmpl    $50, k
        jge     endloop1
        addl    $7, k
        jmp     loop1
endloop1:`
        },
        consigne: "Écrire en C ce que fait ce code (avec `while`) :",
        aTraduire: {
          legende: "Assembleur",
          code: `        movl    $0, compte
loop1:
        cmpl    $1, n
        jle     endloop1
        movl    n, %eax
        andl    $1, %eax
        cmpl    $0, %eax
        jne     else1
        sarl    $1, n
        jmp     endif1
else1:
        movl    n, %eax
        movl    $3, %ecx
        imull   %ecx
        incl    %eax
        movl    %eax, n
endif1:
        incl    compte
        jmp     loop1
endloop1:`
        },
        imposer: ["while"],
        depart: `int n, compte;

// traduction en C :

`,
        solution: `int n, compte;

compte = 0;
while (n > 1) {
    if (n % 2 == 0)
        n = n / 2;
    else
        n = 3 * n + 1;
    compte++;
}
`,
        tests: [
          { entrees: { n: 6 }, attendu: { compte: 8, n: 1 } },
          { entrees: { n: 1, compte: 4 }, attendu: { compte: 0, n: 1 } },
          { entrees: { n: 27 }, attendu: { compte: 111, n: 1 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "retro-unsigned",
        titre: "Retrouver les types",
        description: "shr et je : choisir int ou unsigned int.",
        cours: "Les instructions révèlent les types : `shr`, `jb`, `ja`, `mul`, `div` travaillent sur des `unsigned` ; `sar`, `jl`, `jg`, `imul`, `idiv` sur des entiers signés.",
        exemple: {
          legende: "Assembleur  →  unsigned int v;  v = v >> 4;",
          code: `        shrl    $4, v`
        },
        consigne: "Écrire en C ce que fait ce code, **déclarations comprises** : choisir `int` ou `unsigned int` pour `x` et `r` d'après les instructions.",
        aTraduire: {
          legende: "Assembleur",
          code: `        movl    $0, r
loop1:
        cmpl    $0, x
        je      endloop1
        movl    r, %eax
        sall    $1, %eax
        movl    x, %edx
        andl    $1, %edx
        orl     %edx, %eax
        movl    %eax, r
        shrl    $1, x
        jmp     loop1
endloop1:`
        },
        depart: `// déclarations de x et r :


// traduction en C :

`,
        solution: `unsigned int x;
unsigned int r;

r = 0;
while (x != 0) {
    r = (r << 1) | (x & 1);
    x = x >> 1;
}
`,
        tests: [
          { entrees: { x: 6 }, attendu: { r: 3, x: 0 } },
          { entrees: { x: 13 }, attendu: { r: 11, x: 0 } },
          { entrees: { x: 2147483648 }, attendu: { r: 1, x: 0 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "retro-tableau",
        titre: "Retrouver un parcours de tableau",
        description: "Registres index et compteur, échelle 4.",
        cours: "`t(,%ecx,4)` est `t[ecx]` pour un tableau d'`int`. Un registre utilisé comme index dans une boucle correspond à une variable `i` en C.",
        exemple: {
          legende: "Assembleur  →  for (i = 0; i < 3; i++) t[i] = i;",
          code: `        movl    $0, %ecx
loop1:
        cmpl    $3, %ecx
        jge     endloop1
        movl    %ecx, t(,%ecx,4)
        incl    %ecx
        jmp     loop1
endloop1:`
        },
        consigne: "Écrire en C ce que fait ce code, en utilisant `i` pour `%ecx` et `changes` pour le compteur :",
        aTraduire: {
          legende: "Assembleur",
          code: `        movl    $0, %ecx
        movl    $0, %eax
loop1:
        cmpl    n, %ecx
        jge     endloop1
        movl    t(,%ecx,4), %edx
        cmpl    $0, %edx
        jge     suite1
        negl    %edx
        movl    %edx, t(,%ecx,4)
        incl    %eax
suite1:
        incl    %ecx
        jmp     loop1
endloop1:
        movl    %eax, changes`
        },
        depart: `int t[6] = {3, -1, 4, -1, -5, 9};
int n = 6;
int i;
int changes;

// traduction en C :

`,
        solution: `int t[6] = {3, -1, 4, -1, -5, 9};
int n = 6;
int i;
int changes;

changes = 0;
for (i = 0; i < n; i++) {
    if (t[i] < 0) {
        t[i] = -t[i];
        changes++;
    }
}
`,
        tests: [
          { attendu: { t: [3, 1, 4, 1, 5, 9], changes: 3 } },
          { entrees: { n: 2 }, attendu: { t: [3, 1, 4, -1, -5, 9], changes: 1 } },
          { entrees: { t: [0, 0, -7, 0, 0, 0], n: 6, changes: 5 }, attendu: { t: [0, 0, 7, 0, 0, 0], changes: 1 } }
        ]
      },
      {
        type: "code",
        langage: "c",
        id: "retro-struct",
        titre: "Retrouver les champs d'une structure",
        description: "Déplacements → noms de champs, movzbl → unsigned char.",
        cours: "Face à `d(%rax)` où `%rax` contient l'adresse d'une structure, chercher le champ qui commence au déplacement d. Le suffixe et l'instruction donnent son type (`movzbl` → `unsigned char`).",
        exemple: {
          legende: "Assembleur  →  s.b = s.a;   (struct { int a; int b; } s;)",
          code: `        movq    $s, %rax
        movl    0(%rax), %edx   # s.a
        movl    %edx, 4(%rax)   # s.b = s.a`
        },
        consigne: "Écrire en C ce que fait ce code :",
        aTraduire: {
          legende: "Assembleur",
          code: `        movq    $r, %rax
        movl    0(%rax), %edx
        imull   4(%rax), %edx
        movl    %edx, 8(%rax)
        movzbl  12(%rax), %ecx
        addl    %ecx, 8(%rax)`
        },
        depart: `struct Rect {
    int largeur;
    int hauteur;
    int aire;
    unsigned char bordure;
};
struct Rect r;

// traduction en C :

`,
        solution: `struct Rect {
    int largeur;
    int hauteur;
    int aire;
    unsigned char bordure;
};
struct Rect r;

r.aire = r.largeur * r.hauteur;
r.aire = r.aire + r.bordure;
`,
        tests: [
          { entrees: { "r.largeur": 4, "r.hauteur": 5, "r.bordure": 2 }, attendu: { "r.aire": 22 } },
          { entrees: { "r.largeur": 10, "r.hauteur": 10, "r.bordure": 0 }, attendu: { "r.aire": 100 } },
          { entrees: { "r.largeur": 3, "r.hauteur": -2, "r.bordure": 255 }, attendu: { "r.aire": 249 } }
        ]
      }
    ]
  }
];
