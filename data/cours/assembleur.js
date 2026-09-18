/* =============================================================
   Assembleur
   -------------------------------------------------------------
   Structure et exemples complets : voir data/cours/_modele.js
   ============================================================= */

CONTENU["assembleur"] = {

  /* ---------------------------------------------------------
     GUIDES
     --------------------------------------------------------- */
  guides: [
    {
      id: "fiche-x86-64",
      titre: "Fiche technique x86-64",
      badge: "Fiche technique",
      resume: "Registres, directives, instructions, traduction du C, accès mémoire, tableaux et structures en assembleur x86-64, syntaxe AT&T, chacun avec un exemple.",
      niveau: "Référence",
      sections: [

        /* =====================================================
           PARTIE 1 — REGISTRES
           ===================================================== */
        {
          type: "partie",
          titre: "Registres"
        },
        {
          titre: "Noms selon la taille",
          texte: "Un même registre porte un nom différent selon le nombre d'octets utilisés. Le nom doit correspondre au suffixe de l'instruction : `q` → 64 bits, `l` → 32 bits, `w` → 16 bits, `b` → 8 bits.",
          tableau: {
            entetes: ["64 bits (`q`)", "32 bits (`l`)", "16 bits (`w`)", "8 bits (`b`)"],
            lignes: [
              ["`%rax`", "`%eax`", "`%ax`", "`%al`"],
              ["`%rbx`", "`%ebx`", "`%bx`", "`%bl`"],
              ["`%rcx`", "`%ecx`", "`%cx`", "`%cl`"],
              ["`%rdx`", "`%edx`", "`%dx`", "`%dl`"],
              ["`%rsi`", "`%esi`", "`%si`", "`%sil`"],
              ["`%rdi`", "`%edi`", "`%di`", "`%dil`"],
              ["`%rbp`", "`%ebp`", "`%bp`", "`%bpl`"],
              ["`%rsp`", "`%esp`", "`%sp`", "`%spl`"],
              ["`%r8` … `%r15`", "`%r8d` … `%r15d`", "`%r8w` … `%r15w`", "`%r8b` … `%r15b`"]
            ]
          },
          legende: "Exemple",
          code: "        movq    $7, %rax        # 7 sur 8 octets (long)\n        movl    $7, %eax        # 7 sur 4 octets (int)\n        movw    $7, %ax         # 7 sur 2 octets (short)\n        movb    $7, %al         # 7 sur 1 octet  (char)\n        movl    $7, %r9d        # 7 sur 4 octets, dans r9",
          attention: [
            "`movl $7, %rax` est refusé : le suffixe `l` (4 octets) ne correspond pas à `%rax` (8 octets).",
            "Ne pas utiliser `%rsp` (pointeur de pile) pour les calculs."
          ]
        },

        /* =====================================================
           PARTIE 2 — DIRECTIVES
           ===================================================== */
        {
          type: "partie",
          titre: "Directives"
        },
        {
          titre: "Étiquettes",
          texte: "`nom:` donne un nom à l'emplacement qui suit. Placée devant une donnée, l'étiquette s'utilise comme une variable ; devant une instruction, elle sert de destination à un saut.",
          legende: "Exemple",
          code: "        .section \".data\"\ncompteur:                       # nom de la donnée\n        .long   0\n\n        .section \".text\"\nincrementer:                    # nom de l'instruction suivante\n        incl    compteur        # compteur = compteur + 1\n        jmp     incrementer     # revient à incrementer",
          remarque: "L'étiquette peut être sur la même ligne que ce qu'elle nomme : `compteur: .long 0`."
        },
        {
          titre: ".section",
          texte: "Indique où ranger ce qui suit. On change de section autant de fois que nécessaire.",
          tableau: {
            entetes: ["Directive", "Ce qu'on y met"],
            lignes: [
              ["`.section \".text\"`", "les instructions"],
              ["`.section \".data\"`", "les variables avec une valeur initiale"],
              ["`.section \".bss\"`", "les variables sans valeur initiale"],
              ["`.section \".rodata\"`", "les chaînes constantes"]
            ]
          },
          legende: "Exemple",
          code: "        .section \".data\"\nx:      .long   10              # static int x = 10;\n\n        .section \".bss\"\ny:      .skip   4               # static int y;\n\n        .section \".text\"\n        movl    x, %eax         # eax = x = 10\n        movl    %eax, y         # y = 10"
        },
        {
          titre: ".byte  .word  .long  .quad",
          texte: "Réserve une variable et lui donne une valeur initiale. À placer dans `.data`. La directive fixe la taille.",
          tableau: {
            entetes: ["Directive", "Taille", "Équivalent C"],
            lignes: [
              ["`.byte v`", "1 octet", "`char`"],
              ["`.word v`", "2 octets", "`short`"],
              ["`.long v`", "4 octets", "`int`"],
              ["`.quad v`", "8 octets", "`long`"]
            ]
          },
          legende: "Exemple",
          code: "        .section \".data\"\nc:      .byte   'a'             # static char  c = 'a';\ns:      .word   12              # static short s = 12;\ni:      .long   345             # static int   i = 345;\nl:      .quad   6789            # static long  l = 6789;\ntab:    .long   1, 2, 3         # static int tab[] = {1, 2, 3};",
          remarque: "Pour lire ou écrire la variable, utiliser le suffixe de même taille : `movb c, %al`, `movl i, %eax`, `movq l, %rax`."
        },
        {
          titre: ".skip",
          texte: "`.skip n` réserve n octets sans valeur initiale. À placer dans `.bss`.",
          legende: "Exemple",
          code: "        .section \".bss\"\nc:      .skip   1               # static char  c;\ni:      .skip   4               # static int   i;\nl:      .skip   8               # static long  l;\ntab:    .skip   40              # static int tab[10];  (10 × 4 octets)"
        },
        {
          titre: ".string",
          texte: "`.string \"texte\"` range une chaîne et ajoute l'octet nul `\\0` à la fin. À placer dans `.rodata`.",
          legende: "Exemple",
          code: "        .section \".rodata\"\nmsg:    .string \"hello\\n\"      # \"hello\\n\" : 7 octets, \\0 compris\n\n        .section \".text\"\n        movq    $msg, %rdi      # rdi = adresse de la chaîne",
          remarque: "`$msg` (avec `$`) donne l'**adresse** de la chaîne ; `msg` (sans `$`) lirait ses octets."
        },
        {
          titre: ".globl",
          texte: "`.globl nom` rend l'étiquette `nom` utilisable depuis les autres fichiers. Sans `.globl`, elle reste privée au fichier (comme `static` en C).",
          legende: "Exemple",
          code: "        .section \".data\"\n        .globl  total\ntotal:  .long   0               # int total = 0;  (sans static)\n\n        .section \".text\"\n        .globl  main\nmain:                           # main visible par l'éditeur de liens"
        },

        /* =====================================================
           PARTIE 3 — INSTRUCTIONS
           ===================================================== */
        {
          type: "partie",
          titre: "Instructions"
        },
        {
          titre: "Syntaxe et opérandes",
          texte: "`nom{b,w,l,q} source, destination` : on lit de gauche à droite, la source va dans la destination. Le suffixe donne la taille : `b` 1 octet, `w` 2, `l` 4, `q` 8.",
          tableau: {
            entetes: ["Opérande", "S'écrit", "Exemple", "Source", "Destination"],
            lignes: [
              ["**I**mmédiat : une valeur", "`$valeur`", "`$5`", "oui", "non"],
              ["**I**mmédiat : une adresse", "`$étiquette`", "`$msg`", "oui", "non"],
              ["**R**egistre", "`%nom`", "`%eax`", "oui", "oui"],
              ["**M**émoire : une variable", "`étiquette`", "`x`", "oui", "oui"]
            ]
          },
          legende: "Exemple",
          code: "        movl    $5, %eax        # immédiat → registre : eax = 5\n        movl    %eax, x         # registre → mémoire  : x = 5\n        movl    x, %ebx         # mémoire  → registre : ebx = 5\n        addl    $1, x           # immédiat → mémoire  : x = 6",
          remarque: "Dans la suite, `srcIRM` = la source peut être **I**mmédiat, **R**egistre ou **M**émoire ; `destRM` = la destination peut être **R**egistre ou **M**émoire.",
          attention: "`movl x, y` est refusé : deux cases mémoire dans la même instruction. Passer par un registre : `movl x, %eax` puis `movl %eax, y`."
        },
        {
          titre: "mov",
          texte: "Copie la source dans la destination. La source n'est pas modifiée.",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`mov{q,l,w,b} srcIRM, destRM`", "dest = src"]
            ]
          },
          legende: "Exemple",
          code: "        movl    $42, %eax       # eax = 42\n        movl    %eax, %ebx      # ebx = 42  (eax vaut toujours 42)\n        movl    %ebx, resultat  # resultat = 42\n        movb    $'A', %cl       # cl = 'A'"
        },
        {
          titre: "movs · movz",
          texte: "Copie une petite valeur dans un registre plus grand. `movs` recopie le bit de signe dans les octets ajoutés (entiers **signés**) ; `movz` les remplit de zéros (entiers **non signés**). Le nom se lit : `movs` + taille source + taille destination.",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`movsb{q,l,w} srcRM, destR`", "1 octet → 8, 4 ou 2 octets, signe conservé"],
              ["`movsw{q,l} srcRM, destR`", "2 octets → 8 ou 4 octets, signe conservé"],
              ["`movslq srcRM, destR`", "4 octets → 8 octets, signe conservé"],
              ["`movzb{q,l,w} srcRM, destR`", "1 octet → 8, 4 ou 2 octets, zéros ajoutés"],
              ["`movzw{q,l} srcRM, destR`", "2 octets → 8 ou 4 octets, zéros ajoutés"]
            ]
          },
          legende: "Exemple",
          code: "        movb    $-1, %al        # al  = 0xff\n        movsbl  %al, %ebx       # ebx = 0xffffffff  → -1  (signé)\n        movzbl  %al, %ecx       # ecx = 0x000000ff  → 255 (non signé)\n\n        movl    $-5, %eax       # eax = -5\n        movslq  %eax, %rdx      # rdx = -5 sur 64 bits",
          attention: "Pas de `movzlq` : pour étendre 4 → 8 octets par des zéros, un simple `movl` suffit (`movl %eax, %eax` met à zéro la moitié haute de `%rax`)."
        },
        {
          titre: "cqto · cltd · cwtl · cbtw",
          texte: "Doublent la taille de RAX (ou EAX, AX, AL) en conservant le signe. Sans opérande. Servent surtout juste avant une division signée.",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`cqto`", "RAX (8 octets) → RDX:RAX (16 octets)"],
              ["`cltd`", "EAX (4 octets) → EDX:EAX (8 octets)"],
              ["`cwtl`", "AX (2 octets) → EAX (4 octets)"],
              ["`cbtw`", "AL (1 octet) → AX (2 octets)"]
            ]
          },
          legende: "Exemple",
          code: "        movl    $-7, %eax       # eax = -7\n        cltd                    # edx = 0xffffffff : EDX:EAX = -7\n\n        movl    $7, %eax        # eax = 7\n        cltd                    # edx = 0 : EDX:EAX = 7",
          remarque: "`RDX:RAX` = un seul nombre dont RDX est la moitié haute et RAX la moitié basse."
        },
        {
          titre: "add · sub",
          texte: "Ajoute ou retire la source à la destination. Le résultat remplace la destination.",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`add{q,l,w,b} srcIRM, destRM`", "dest = dest + src"],
              ["`sub{q,l,w,b} srcIRM, destRM`", "dest = dest − src"]
            ]
          },
          legende: "Exemple",
          code: "        movl    $10, %eax       # eax = 10\n        addl    $5, %eax        # eax = 10 + 5  = 15\n        subl    $3, %eax        # eax = 15 - 3  = 12\n        movl    $4, %ebx        # ebx = 4\n        subl    %ebx, %eax      # eax = 12 - 4  = 8\n        addl    %eax, total     # total = total + 8",
          attention: "`subl %ebx, %eax` calcule **eax − ebx** (destination moins source), pas l'inverse."
        },
        {
          titre: "inc · dec · neg",
          texte: "Opérations sur un seul opérande, qui est modifié.",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`inc{q,l,w,b} destRM`", "dest = dest + 1"],
              ["`dec{q,l,w,b} destRM`", "dest = dest − 1"],
              ["`neg{q,l,w,b} destRM`", "dest = −dest"]
            ]
          },
          legende: "Exemple",
          code: "        movl    $5, %eax        # eax = 5\n        incl    %eax            # eax = 6\n        decl    %eax            # eax = 5\n        negl    %eax            # eax = -5\n        negl    %eax            # eax = 5\n        incb    grade           # grade++  (variable d'1 octet)"
        },
        {
          titre: "and · or · xor · not",
          texte: "Opérations bit à bit, comme `&`, `|`, `^` et `~` en C.",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`and{q,l,w,b} srcIRM, destRM`", "dest = dest & src"],
              ["`or{q,l,w,b} srcIRM, destRM`", "dest = dest | src"],
              ["`xor{q,l,w,b} srcIRM, destRM`", "dest = dest ^ src"],
              ["`not{q,l,w,b} destRM`", "dest = ~dest"]
            ]
          },
          legende: "Exemple (valeurs en binaire)",
          code: "        movl    $12, %eax       # eax = 1100\n        andl    $10, %eax       # 1100 & 1010 = 1000 → eax = 8\n\n        movl    $12, %eax       # eax = 1100\n        orl     $10, %eax       # 1100 | 1010 = 1110 → eax = 14\n\n        movl    $12, %eax       # eax = 1100\n        xorl    $10, %eax       # 1100 ^ 1010 = 0110 → eax = 6\n\n        movl    $0, %eax        # eax = 0\n        notl    %eax            # eax = ~0 = -1 (tous les bits à 1)",
          remarque: [
            "`andl $1, %eax` garde le dernier bit : eax vaut 1 si le nombre est impair, 0 s'il est pair.",
            "`xorl %eax, %eax` met eax à 0."
          ]
        },
        {
          titre: "sal · shl · sar · shr",
          texte: "Décalent les bits de la destination de `src` positions. Vers la gauche : multiplie par 2ˢʳᶜ. Vers la droite : divise par 2ˢʳᶜ (`sar` pour les signés, `shr` pour les non signés).",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`sal{q,l,w,b} srcIR, destRM`", "dest = dest << src"],
              ["`shl{q,l,w,b} srcIR, destRM`", "identique à `sal`"],
              ["`sar{q,l,w,b} srcIR, destRM`", "dest = dest >> src, garde le signe"],
              ["`shr{q,l,w,b} srcIR, destRM`", "dest = dest >> src, ajoute des zéros à gauche"]
            ]
          },
          legende: "Exemple",
          code: "        movl    $3, %eax        # eax = 3\n        sall    $2, %eax        # eax = 3 × 2² = 12\n\n        movl    $-20, %eax      # eax = -20\n        sarl    $2, %eax        # eax = -20 / 2² = -5\n\n        movl    $20, %eax       # eax = 20\n        shrl    $2, %eax        # eax = 20 / 2² = 5\n\n        movb    $3, %cl         # cl = 3\n        sall    %cl, %eax       # eax = 5 × 2³ = 40",
          attention: [
            "Si le nombre de positions est dans un registre, ce registre doit être `%cl`.",
            "`shrl` sur un nombre négatif donne un grand positif : `-20` devient `1073741819`. Utiliser `sarl` pour les signés."
          ]
        },
        {
          titre: "imul · mul",
          texte: "Multiplient RAX (ou EAX, AX, AL) par la source. Le résultat, deux fois plus grand, est rangé dans RDX:RAX. `imul` pour les signés, `mul` pour les non signés.",
          tableau: {
            entetes: ["Signé", "Non signé", "Effet"],
            lignes: [
              ["`imulq srcRM`", "`mulq srcRM`", "RDX:RAX = RAX × src"],
              ["`imull srcRM`", "`mull srcRM`", "EDX:EAX = EAX × src"],
              ["`imulw srcRM`", "`mulw srcRM`", "DX:AX = AX × src"],
              ["`imulb srcRM`", "`mulb srcRM`", "AX = AL × src"]
            ]
          },
          legende: "Exemple",
          code: "        movl    $6, %eax        # eax = 6\n        movl    $7, %ebx        # ebx = 7\n        imull   %ebx            # EDX:EAX = 6 × 7 → eax = 42, edx = 0\n        movl    %eax, produit   # produit = 42",
          remarque: "`imul` existe aussi à deux opérandes, plus simple quand le résultat tient dans la destination : `imull %ebx, %eax` → eax = eax × ebx.",
          attention: "`imull $7` est refusé : la source ne peut pas être un immédiat. La placer d'abord dans un registre."
        },
        {
          titre: "idiv · div",
          texte: "Divisent RDX:RAX (ou EDX:EAX, DX:AX, AX) par la source. Le quotient va dans RAX, le reste dans RDX. `idiv` pour les signés, `div` pour les non signés.",
          tableau: {
            entetes: ["Signé", "Non signé", "Effet"],
            lignes: [
              ["`idivq srcRM`", "`divq srcRM`", "RAX = RDX:RAX / src ; RDX = RDX:RAX % src"],
              ["`idivl srcRM`", "`divl srcRM`", "EAX = EDX:EAX / src ; EDX = EDX:EAX % src"],
              ["`idivw srcRM`", "`divw srcRM`", "AX = DX:AX / src ; DX = DX:AX % src"],
              ["`idivb srcRM`", "`divb srcRM`", "AL = AX / src ; AH = AX % src"]
            ]
          },
          legende: "Exemple",
          code: "# signé : q = 17 / 5;  r = 17 % 5;\n        movl    $17, %eax       # eax = 17 (dividende)\n        cltd                    # EDX:EAX = 17\n        movl    $5, %ebx        # ebx = 5 (diviseur)\n        idivl   %ebx            # eax = 3 (quotient), edx = 2 (reste)\n\n# non signé : même calcul\n        movl    $17, %eax       # eax = 17\n        movl    $0, %edx        # EDX:EAX = 17\n        movl    $5, %ebx        # ebx = 5\n        divl    %ebx            # eax = 3, edx = 2",
          attention: [
            "Avant `idivl`, toujours `cltd` (avant `idivq`, `cqto`) ; avant `divl`, mettre `%edx` à 0. Sinon EDX contient n'importe quoi et le résultat est faux.",
            "La source ne peut pas être un immédiat : `idivl $5` est refusé."
          ]
        },

        /* =====================================================
           PARTIE 4 — CONTRÔLE DE FLUX
           ===================================================== */
        {
          type: "partie",
          titre: "Contrôle de flux"
        },
        {
          titre: "jmp",
          texte: "`jmp X` continue l'exécution à l'étiquette `X`, sans condition.",
          legende: "Exemple",
          code: "        movl    $1, %eax        # eax = 1\n        jmp     suite           # va directement à suite\n        movl    $2, %eax        # jamais exécuté\nsuite:\n        addl    $10, %eax       # eax = 11"
        },
        {
          titre: "cmp",
          texte: "`cmp{q,l,w,b} srcIRM, destRM` compare **dest** à **src**, sans rien modifier. Il est toujours suivi d'un saut conditionnel, qui décide selon le résultat.",
          legende: "Exemple",
          code: "        cmpl    $10, %eax       # compare eax à 10\n        jl      petit           # saute si eax < 10\n        movl    $1, grand       # ici : eax >= 10\npetit:",
          attention: [
            "Ordre inversé : `cmpl $10, %eax` se lit « eax comparé à 10 », donc `jl` saute si **eax < 10**.",
            "Placer le saut **juste après** le `cmp` : `add`, `sub`, `and`… modifient le résultat de la comparaison."
          ]
        },
        {
          titre: "Sauts conditionnels",
          texte: "Après `cmp src, dest`, sautent vers l'étiquette `X` si la condition est vraie ; sinon l'exécution continue à la ligne suivante.",
          tableau: {
            entetes: ["Instruction", "Saute si", "Entiers", "Exemple après `cmpl $3, %eax`"],
            lignes: [
              ["`je X`", "dest == src", "tous", "saute si eax == 3"],
              ["`jne X`", "dest != src", "tous", "saute si eax != 3"],
              ["`jl X`", "dest < src", "signés", "saute si eax < 3"],
              ["`jle X`", "dest <= src", "signés", "saute si eax <= 3"],
              ["`jg X`", "dest > src", "signés", "saute si eax > 3"],
              ["`jge X`", "dest >= src", "signés", "saute si eax >= 3"],
              ["`jb X`", "dest < src", "non signés", "saute si eax < 3"],
              ["`jbe X`", "dest <= src", "non signés", "saute si eax <= 3"],
              ["`ja X`", "dest > src", "non signés", "saute si eax > 3"],
              ["`jae X`", "dest >= src", "non signés", "saute si eax >= 3"]
            ]
          },
          legende: "Exemple : signé ou non signé",
          code: "        movl    $-1, %eax       # eax = -1  (0xffffffff)\n        cmpl    $1, %eax        # compare eax à 1\n        jl      A               # saute : -1 < 1 en signé\n        jb      B               # ne sauterait pas : 4294967295 > 1 en non signé",
          remarque: "Moyen mnémotechnique : **l**ess / **g**reater pour les signés, **b**elow / **a**bove pour les non signés."
        },
        {
          titre: "Signé ou non signé",
          texte: "En assembleur, c'est l'instruction choisie qui décide si un nombre est signé (`int`) ou non signé (`unsigned`). `cmp` est le même dans les deux cas : seul le saut qui suit change.",
          tableau: {
            entetes: ["Opération", "Signé (`int`, `long`…)", "Non signé (`unsigned …`)"],
            lignes: [
              ["Multiplier", "`imul`", "`mul`"],
              ["Diviser", "`cltd` / `cqto` puis `idiv`", "`%edx` / `%rdx` à 0 puis `div`"],
              ["Décaler à droite", "`sar`", "`shr`"],
              ["Agrandir un registre", "`movs…`", "`movz…`"],
              ["Comparer", "`cmp`", "`cmp`"],
              ["`<`  `<=`  `>`  `>=`", "`jl`  `jle`  `jg`  `jge`", "`jb`  `jbe`  `ja`  `jae`"],
              ["`==`  `!=`", "`je`  `jne`", "`je`  `jne`"]
            ]
          },
          codes: [
            {
              legende: "int fact, n",
              code: `        movl    $1, fact
loop1:
        cmpl    $1, n
        jle     endloop1        # signé
        movl    fact, %eax
        imull   n               # signé
        movl    %eax, fact
        decl    n
        jmp     loop1
endloop1:`
            },
            {
              legende: "unsigned int fact, n",
              code: `        movl    $1, fact
loop1:
        cmpl    $1, n
        jbe     endloop1        # non signé
        movl    fact, %eax
        mull    n               # non signé
        movl    %eax, fact
        decl    n
        jmp     loop1
endloop1:`
            }
          ],
          attention: "Il n'existe pas de « cmp non signé » : écrire `cmpl` puis `jb`/`ja`, jamais `jl`/`jg`, pour des `unsigned`."
        },

        /* =====================================================
           PARTIE 5 — TRADUIRE LE C
           ===================================================== */
        {
          type: "partie",
          titre: "Traduire le C",
          texte: "Réécrire d'abord le C sans imbrication, avec seulement `if (…) goto étiquette;` et `goto`, puis traduire chaque ligne."
        },
        {
          titre: "Condition inverse",
          texte: "On saute pour **éviter** le bloc : le test porte sur la condition inverse. Pour comparer `a` à `b` : `movl a, %eax` puis `cmpl b, %eax`.",
          tableau: {
            entetes: ["Condition C", "C aplati", "Saut signé", "Saut non signé"],
            lignes: [
              ["`if (a == b)`", "`if (a != b) goto …`", "`jne`", "`jne`"],
              ["`if (a != b)`", "`if (a == b) goto …`", "`je`", "`je`"],
              ["`if (a < b)`", "`if (a >= b) goto …`", "`jge`", "`jae`"],
              ["`if (a <= b)`", "`if (a > b) goto …`", "`jg`", "`ja`"],
              ["`if (a > b)`", "`if (a <= b) goto …`", "`jle`", "`jbe`"],
              ["`if (a >= b)`", "`if (a < b) goto …`", "`jl`", "`jb`"]
            ]
          },
          legende: "if (n <= 1) goto endloop1;   (int n)",
          code: `        cmpl    $1, n           # compare n à 1
        jle     endloop1        # saute si n <= 1`,
          remarque: "Chaque étiquette doit être unique dans le fichier : numéroter `endif1`, `endif2`, `loop1`, `loop2`…"
        },
        {
          titre: "if",
          texte: "Saut vers la fin du bloc si la condition est fausse.",
          codes: [
            {
              legende: "C",
              code: `if (i < 0)
    i = -i;`
            },
            {
              legende: "C aplati",
              code: `    if (i >= 0) goto endif1;
    i = -i;
endif1:`
            },
            {
              legende: "Assembleur",
              code: `        cmpl    $0, i
        jge     endif1
        negl    i
endif1:`
            }
          ]
        },
        {
          titre: "if … else",
          texte: "Saut vers `else1` si la condition est fausse ; à la fin du bloc vrai, `jmp` par-dessus le `else`.",
          codes: [
            {
              legende: "C",
              code: `if (i < j)
    smaller = i;
else
    smaller = j;`
            },
            {
              legende: "C aplati",
              code: `    if (i >= j) goto else1;
    smaller = i;
    goto endif1;
else1:
    smaller = j;
endif1:`
            },
            {
              legende: "Assembleur",
              code: `        movl    i, %eax
        cmpl    j, %eax
        jge     else1
        movl    i, %eax
        movl    %eax, smaller
        jmp     endif1
else1:
        movl    j, %eax
        movl    %eax, smaller
endif1:`
            }
          ]
        },
        {
          titre: "while",
          texte: "Étiquette avant le test, sortie si la condition est fausse, `jmp` vers le test à la fin du corps.",
          codes: [
            {
              legende: "C",
              code: `fact = 1;
while (n > 1) {
    fact *= n;
    n--;
}`
            },
            {
              legende: "C aplati",
              code: `    fact = 1;
loop1:
    if (n <= 1) goto endloop1;
    fact *= n;
    n--;
    goto loop1;
endloop1:`
            },
            {
              legende: "Assembleur",
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
            }
          ]
        },
        {
          titre: "for",
          texte: "`for (init; cond; pas)` : `init` avant l'étiquette, `pas` juste avant le `goto` de retour.",
          codes: [
            {
              legende: "C",
              code: `for (i = 0; i < exp; i++)
    power *= base;`
            },
            {
              legende: "C aplati",
              code: `    i = 0;
loop1:
    if (i >= exp) goto endloop1;
    power *= base;
    i++;
    goto loop1;
endloop1:`
            },
            {
              legende: "Assembleur",
              code: `        movl    $0, i
loop1:
        movl    i, %eax
        cmpl    exp, %eax
        jge     endloop1
        movl    power, %eax
        imull   base
        movl    %eax, power
        incl    i
        jmp     loop1
endloop1:`
            }
          ]
        },

        /* =====================================================
           PARTIE 6 — ACCÈS MÉMOIRE
           ===================================================== */
        {
          type: "partie",
          titre: "Accès mémoire"
        },
        {
          titre: "Forme complète",
          texte: "`déplacement(base, index, échelle)` lit ou écrit à l'adresse **déplacement + base + index × échelle**. Chaque élément peut être omis.",
          tableau: {
            entetes: ["Élément", "Valeur possible", "Si omis"],
            lignes: [
              ["déplacement", "entier ou étiquette (`8`, `a`, `a+4`)", "0"],
              ["base", "registre de 4 ou 8 octets", "0"],
              ["index", "registre de 4 ou 8 octets", "0"],
              ["échelle", "`1`, `2`, `4` ou `8`", "1"]
            ]
          },
          legende: "Toutes les formes (rax = 1000, r10 = 3)",
          code: `        movl    a, %ebx             # direct         : adresse a
        movl    (%rax), %ebx        # indirect       : adresse 1000
        movl    8(%rax), %ebx       # base + dépl.   : adresse 1008
        movl    a(%rax), %ebx       # base + dépl.   : adresse a + 1000
        movl    (%rax,%r10), %ebx   # indexé         : adresse 1003
        movl    5(%rax,%r10), %ebx  # indexé         : adresse 1008
        movl    (,%r10,4), %ebx     # avec échelle   : adresse 12
        movl    a(,%r10,4), %ebx    # avec échelle   : adresse a + 12
        movl    (%rax,%r10,4), %ebx # avec échelle   : adresse 1012
        movl    8(%rax,%r10,4), %ebx # avec échelle  : adresse 1020`,
          attention: [
            "L'échelle ne peut valoir que 1, 2, 4 ou 8 : `(,%r10,3)` est refusé.",
            "Base et index doivent être des registres de 4 ou 8 octets : `(%ax)` ou `(%al)` sont refusés."
          ]
        },
        {
          titre: "Adresse ou contenu",
          texte: "Le `$` et les parenthèses décident si l'on manipule un nombre, une adresse ou le contenu de la mémoire.",
          tableau: {
            entetes: ["Opérande", "Donne"],
            lignes: [
              ["`$5`", "le nombre 5"],
              ["`$i`", "l'**adresse** de `i`"],
              ["`%rax`", "le contenu du registre RAX"],
              ["`i`", "le **contenu** de la mémoire à l'adresse de `i`"],
              ["`5`", "le contenu de la mémoire à l'adresse 5 (erreur de segmentation)"],
              ["`(%rax)`", "le contenu de la mémoire à l'adresse rangée dans RAX"]
            ]
          },
          legende: "Exemple (x vaut 25)",
          code: `        movq    $x, %rax        # rax = adresse de x
        movl    x, %ebx         # ebx = 25        (contenu de x)
        movl    (%rax), %ecx    # ecx = 25        (contenu à l'adresse rax)
        movl    $7, (%rax)      # x = 7`,
          attention: "Une adresse fait 8 octets : la ranger avec `movq $x, %rax`, pas `movl`."
        },
        {
          titre: "Indirect · base + déplacement",
          texte: "`(%reg)` lit ou écrit à l'adresse contenue dans le registre. `d(%reg)` ajoute d à cette adresse, sans modifier le registre.",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`movl (%rax), %ebx`", "ebx = contenu à l'adresse rax"],
              ["`movl %ebx, (%rax)`", "contenu à l'adresse rax = ebx"],
              ["`movl 4(%rax), %ebx`", "ebx = contenu à l'adresse rax + 4"],
              ["`movl %ebx, a(%rcx)`", "contenu à l'adresse a + rcx = ebx"]
            ]
          },
          legende: "Exemple : deux int rangés à la suite",
          code: `        .section ".data"
paire:  .long   10, 20          # paire+0 = 10, paire+4 = 20

        .section ".text"
        movq    $paire, %rax    # rax = adresse de paire
        movl    (%rax), %ebx    # ebx = 10
        movl    4(%rax), %ecx   # ecx = 20  (rax ne change pas)
        addq    $4, %rax        # rax = adresse de paire + 4
        movl    $99, (%rax)     # paire+4 = 99`
        },
        {
          titre: "Indexé · échelle",
          texte: "`d(base, index, échelle)` calcule l'adresse sans instruction supplémentaire : idéal pour `a[i]`, avec l'échelle égale à la taille d'un élément.",
          tableau: {
            entetes: ["Instruction", "Effet"],
            lignes: [
              ["`movl a(,%rcx,4), %eax`", "eax = contenu à l'adresse a + rcx × 4"],
              ["`movl %eax, a(,%rcx,4)`", "contenu à l'adresse a + rcx × 4 = eax"],
              ["`movq (%rax,%rcx,8), %rdx`", "rdx = contenu à l'adresse rax + rcx × 8"],
              ["`movb (%rsi,%rcx), %al`", "al = contenu à l'adresse rsi + rcx"]
            ]
          },
          legende: "Exemple",
          code: `        .section ".data"
t:      .long   5, 6, 7, 8      # int t[] = {5, 6, 7, 8};

        .section ".text"
        movl    $2, %ecx        # ecx = 2
        movl    t(,%ecx,4), %eax # eax = t[2] = 7
        movl    $0, t(,%ecx,4)  # t[2] = 0`
        },

        /* =====================================================
           PARTIE 7 — TABLEAUX
           ===================================================== */
        {
          type: "partie",
          titre: "Tableaux"
        },
        {
          titre: "Déclarer un tableau",
          texte: "Un tableau est une seule étiquette suivie de la place de tous les éléments : taille d'un élément × nombre d'éléments.",
          tableau: {
            entetes: ["C", "Assembleur", "Section"],
            lignes: [
              ["`int a[100];`", "`a: .skip 400`", "`.bss`"],
              ["`long t[10];`", "`t: .skip 80`", "`.bss`"],
              ["`char s[16];`", "`s: .skip 16`", "`.bss`"],
              ["`int a[] = {4, 8, 15};`", "`a: .long 4, 8, 15`", "`.data`"],
              ["`short w[] = {1, 2};`", "`w: .word 1, 2`", "`.data`"],
              ["`char msg[] = \"ok\";`", "`msg: .string \"ok\"`", "`.data`"]
            ]
          },
          legende: "Exemple",
          code: `        .section ".data"
premiers: .long 2, 3, 5, 7      # int premiers[] = {2, 3, 5, 7};

        .section ".bss"
notes:  .skip   80              # int notes[20];`
        },
        {
          titre: "Lire a[i]",
          texte: "Adresse de `a[i]` = `a + i × taille`. Trois écritures possibles pour `n = a[i];` avec `int a[100]` (taille 4).",
          codes: [
            {
              legende: "Indirect",
              code: `        movslq  i, %rax
        salq    $2, %rax
        addq    $a, %rax
        movl    (%rax), %r10d
        movl    %r10d, n`
            },
            {
              legende: "Base + déplacement",
              code: `        movl    i, %eax
        sall    $2, %eax
        movl    a(%eax), %r10d
        movl    %r10d, n`
            },
            {
              legende: "Indexé avec échelle",
              code: `        movl    i, %eax
        movl    a(,%eax,4), %r10d
        movl    %r10d, n`
            }
          ],
          tableau: {
            entetes: ["Type des éléments", "Échelle", "Suffixe"],
            lignes: [
              ["`char`", "1", "`b`"],
              ["`short`", "2", "`w`"],
              ["`int`, `float`", "4", "`l`"],
              ["`long`, pointeur, `double`", "8", "`q`"]
            ]
          },
          remarque: "`movslq i, %rax` sert quand l'index `int` doit être utilisé dans un calcul sur 8 octets (`salq`, `addq`)."
        },
        {
          titre: "Écrire a[i]",
          texte: "Même adresse que pour la lecture ; seule la place de l'opérande mémoire change (en destination).",
          legende: "a[i] = x;   (int a[], i, x)",
          code: `        movl    i, %eax         # eax = i
        movl    x, %r10d        # r10d = x
        movl    %r10d, a(,%eax,4) # a[i] = x`,
          attention: "`movl x, a(,%eax,4)` est refusé : deux opérandes mémoire. Passer par un registre."
        },
        {
          titre: "Parcourir un tableau",
          texte: "Un registre sert d'index : il part de 0, avance de 1 à chaque tour, et la boucle s'arrête à la taille.",
          legende: "for (i = 0; i < 4; i++) somme += t[i];",
          code: `        .section ".data"
t:      .long   5, 6, 7, 8
somme:  .long   0

        .section ".text"
        movl    $0, %ecx        # i = 0
loop1:
        cmpl    $4, %ecx
        jge     endloop1        # i >= 4 → fin
        movl    t(,%ecx,4), %eax # eax = t[i]
        addl    %eax, somme     # somme += t[i]
        incl    %ecx            # i++
        jmp     loop1
endloop1:                       # somme = 26`
        },

        /* =====================================================
           PARTIE 8 — STRUCTURES
           ===================================================== */
        {
          type: "partie",
          titre: "Structures"
        },
        {
          titre: "Accéder aux champs",
          texte: "Une structure est une étiquette suivie de ses champs dans l'ordre. Chaque champ est à un déplacement fixe du début : `0(%rax)`, `4(%rax)`…",
          codes: [
            {
              legende: "C",
              code: `struct S {
    int i;      /* déplacement 0 */
    int j;      /* déplacement 4 */
};
struct S myStruct;

myStruct.i = 18;
myStruct.j = 19;`
            },
            {
              legende: "Indirect",
              code: `        .section ".bss"
myStruct: .skip 8

        .section ".text"
        movq    $myStruct, %rax
        movl    $18, (%rax)
        movq    $myStruct, %rax
        addq    $4, %rax
        movl    $19, (%rax)`
            },
            {
              legende: "Base + déplacement",
              code: `        .section ".bss"
myStruct: .skip 8

        .section ".text"
        movq    $myStruct, %rax
        movl    $18, 0(%rax)
        movl    $19, 4(%rax)`
            }
          ],
          remarque: "Sans registre, `myStruct+4` désigne aussi directement le champ `j` : `movl $19, myStruct+4`."
        },
        {
          titre: "Alignement et remplissage",
          texte: "Sur x86-64/Linux, chaque champ commence à un déplacement multiple de son alignement. Le compilateur insère des octets vides (remplissage) pour y arriver.",
          tableau: {
            entetes: ["Type", "Déplacement multiple de"],
            lignes: [
              ["`char`, `unsigned char`", "1"],
              ["`short`, `unsigned short`", "2"],
              ["`int`, `unsigned int`, `float`", "4"],
              ["`long`, `unsigned long`, `double`, pointeur", "8"],
              ["`long double`", "16"]
            ]
          },
          codes: [
            {
              legende: "struct { char c; int i; }",
              code: `        .section ".bss"
myStruct: .skip 8               # c:0  (3 octets vides)  i:4

        .section ".text"
        movq    $myStruct, %rax
        movb    $'A', 0(%rax)   # myStruct.c = 'A'
        movl    $18, 4(%rax)    # myStruct.i = 18`
            },
            {
              legende: "struct { char c; long l; int i; }",
              code: `        .section ".bss"
s:      .skip   24              # c:0  l:8  i:16  (4 octets vides à la fin)

        .section ".text"
        movq    $s, %rax
        movb    $'z', 0(%rax)   # s.c = 'z'
        movq    $-1, 8(%rax)    # s.l = -1
        movl    $5, 16(%rax)    # s.i = 5`
            }
          ],
          attention: [
            "Le déplacement d'un champ n'est pas la somme des tailles des champs précédents dès qu'un remplissage est inséré.",
            "Dans un tableau de structures, la taille totale est arrondie au multiple de l'alignement le plus grand (24 et non 20 ci-dessus)."
          ]
        }
      ]
    }
  ],

  /* Exercices : data/cours/assembleur-exercices.js */
  chapitres: []
};
