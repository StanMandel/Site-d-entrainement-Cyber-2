/* =============================================================
   MODÈLE — format des données d'une matière
   -------------------------------------------------------------
   Ce fichier n'est PAS chargé par le site : il sert uniquement de
   référence. Copiez les blocs utiles dans data/cours/<slug>.js.

   Structure générale d'une matière :

   CONTENU["<slug>"] = {
     guides:    [ ...fiches explicatives... ],
     chapitres: [ ...rubriques contenant les exercices... ]
   };
   ============================================================= */


/* -------------------------------------------------------------
   1) UN GUIDE
   -------------------------------------------------------------
   Fiche explicative : principes de base ou marche à suivre.
   Les guides s'affichent en haut de la page de la matière.

   {
     id: "creer-conteneur",          // unique dans la matière (sert à l'adresse)
     titre: "Créer son premier conteneur",
     resume: "Une phrase de présentation.",
     duree: "20 min",                // facultatif
     niveau: "Débutant",             // facultatif
     prealables: ["Docker installé"],// facultatif
     sections: [
       {
         type: "notion",             // "notion" = encadré non numéroté
         titre: "Image et conteneur",//           (défaut : étape numérotée)
         texte: "Texte avec du `code` et du **gras**.",
         points: ["Premier point", "Deuxième point"],
         tableau: {                  // facultatif
           entetes: ["Commande", "Rôle"],
           lignes: [["`docker ps`", "Liste les conteneurs actifs"]]
         },
         schema: "┌───┐\n│ A │\n└───┘", // dessin en chasse fixe, non copiable
         code: "docker run hello-world",   // bloc copiable
         legende: "Terminal",              // titre du bloc de code
         sortie: "Hello from Docker!",     // sortie attendue
         // Fichier téléchargeable (ex. script) — Copier + Télécharger + aperçu :
         telechargements: [{ nom: "script.sh", source: "id-script-text-plain", legende: "…" }],
         //   source = id d'un <script type="text/plain"> embarqué dans index.html
         //   (téléchargement hors ligne) ; ou contenu: "texte" directement.
         remarque: "Information utile.",   // ou un tableau de plusieurs remarques
         attention: "Piège à éviter."      // idem
       }
     ]
   }

   AIDE-MÉMOIRE DÉCOUPÉ EN PARTIES
   Ajoutez des sections { type: "partie", titre, texte } : les sections
   qui suivent sont numérotées 1.1, 1.2, 2.1… et un sommaire cliquable
   apparaît en haut du guide. Le champ facultatif `badge` remplace
   l'étiquette « Guide » (ex. badge: "Fiche technique").


   2) UN CHAPITRE
   -------------------------------------------------------------
   {
     id: "ch1",
     titre: "Chapitre 1 — Les bases",
     description: "Résumé court (facultatif).",
     exercices: [ ...exercices... ]
   }


   3) EXERCICE DE TYPE "qcm"
   -------------------------------------------------------------
   {
     type: "qcm",
     id: "ch1-qcm",                   // unique dans la matière
     titre: "QCM — Les bases",
     description: "Facultatif.",
     melanger: true,                  // mélange les questions (défaut : true)
     melangerChoix: false,            // mélange aussi les réponses (défaut : false)
     tirage: 15,                      // facultatif : N questions tirées au hasard
                                      // dans la banque à chaque partie
     questions: [
       {
         enonce: "Question posée ?",
         code: "int x = 0;",          // bloc de code facultatif
         choix: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
         reponse: 1,                  // index de la bonne réponse
                                      // OU reponse: [0, 2] pour un choix multiple
         explication: "Pourquoi c'est cette réponse."   // facultatif
       }
     ],
     cours: "Principe court.",        // facultatif : affiché à gauche des questions
     exemple: { legende: "…", code: `…` }   // facultatif, comme pour "code"
   }
   Prévoir 10 à 20 questions par QCM, ou une banque plus large avec « tirage ».


   4) EXERCICE DE TYPE "jetpunk"
   -------------------------------------------------------------
   La liste des définitions tirées s'affiche d'abord (« Commencer »
   lance la partie), sauf si « masquerIndice » est vrai. Puis une barre
   de saisie en haut et des tuiles en dessous : dès que la bonne réponse
   est tapée, la tuile correspondante passe au vert.
   {
     type: "jetpunk",
     id: "ch1-voc",
     titre: "Vocabulaire — Chapitre 1",
     consigne: "Trouvez le mot correspondant à chaque définition.",
     temps: 300,                      // chrono en secondes (0 ou absent = sans chrono)
     colonnes: 3,                     // largeur de la grille (défaut : auto)
     masquerIndice: false,            // true = tuiles masquées jusqu'à trouvées
     melanger: false,                 // mélange l'ordre des tuiles
     tirage: 12,                      // facultatif : N tuiles tirées au hasard
     items: [
       {
         indice: "Texte affiché sur la tuile",
         reponse: "mot attendu",
         alt: ["synonyme accepté", "autre orthographe"],   // facultatif
         note: "Précision affichée une fois révélée."      // facultatif
       }
     ]
   }
   La comparaison ignore la casse, les accents, les espaces et la
   ponctuation : « Ré-seau » valide « reseau ». La tuile est validée dès
   que la frappe correspond : une réponse ne doit pas être le début d'une
   autre (« Local » bloquerait « LocalService »).


   5) EXERCICE DE TYPE "code" (programmation dans le navigateur)
   -------------------------------------------------------------
   À gauche : principe, exemple, objectif. À droite : éditeur avec
   bouton ▶ Exécuter. Le code est exécuté sur chaque test puis
   comparé aux valeurs attendues.
   {
     type: "code",
     langage: "asm",                  // "asm" (x86-64 AT&T) ou "c"
     id: "asm-idiv",
     titre: "Quotient et reste",
     description: "cltd puis idivl.",
     cours: "Principe en une ou deux phrases.",   // ou tableau de paragraphes ;
                                                  // un tableau imbriqué = liste à pastilles,
                                                  // { titre } = intertitre,
                                                  // { entetes, lignes } = tableau
     exemple: { titre: "Exemple", legende: "Titre du bloc", texte: "Facultatif", code: `…` },
     consigne: "Calculer `q = a / b`.",           // ou tableau de paragraphes
     aTraduire: { legende: "C", code: `…` },      // facultatif : code à traduire
     depart: `…code affiché au départ…`,
     solution: `…proposée après deux échecs…`,
     tests: [
       { entrees: { a: 17, b: 5 }, attendu: { q: 3, r: 2 } }
     ],
     imposer: ["sal|shl"],            // instructions (ou mots C) obligatoires
     interdire: ["imul", "mul"],      // instructions (ou mots C) interdites
     motifs:  [{ motif: "regex", message: "…", regle: "affiché dans l'objectif" }],
     exclure: [{ motif: "regex", message: "…", regle: "…" }],
     aplati: true,                    // C uniquement : if (…) goto, goto, étiquettes
     sections: { msg: "rodata" },     // assembleur : section attendue d'une étiquette
     nonSigne: ["n"]                  // clés affichées en non signé
   }

   Clés des tests
     Assembleur : "%eax", "x" (taille de sa directive), "t[2]", "s+4",
                  suffixe de taille facultatif : "s+8:q", "c:b".
     C          : "x", "t[2]", "p.x", "pts[1].y".
   Valeurs : nombre, chaîne de chiffres pour les grands entiers
   ("5000000000"), caractère ("A"), tableau ([1, 2, 3]) ou texte
   ("bonjour", comparé à la chaîne rangée à cette adresse).


   6) EXERCICE DE TYPE "terminal" (moteur assets/js/terminal.js)
   -------------------------------------------------------------
   À gauche : principe (cours/exemple), scénario, objectif courant.
   À droite : un terminal simulé. L'utilisateur tape une commande ;
   elle est acceptée quand elle vérifie TOUS les motifs (regex,
   insensibles à la casse) et AUCUN motif "interdire". La sortie
   simulée s'affiche puis on passe à l'objectif suivant. Le terminal
   (accueil, retours, sorties) est en anglais, comme un vrai shell ;
   commandes intégrées : help / solution / objective / clear.
   Score = objectifs réussis sans avoir révélé la solution.
   {
     type: "terminal",
     id: "ch2-terminal",              // unique dans la matière
     titre: "Terminal — …",
     description: "…",
     terminal: "bash — attaquant",    // titre de la fenêtre (facultatif)
     invite: "kali@kali:~$",          // invite affichée (facultatif)
     cours: "…", exemple: { … },      // colonne de gauche (comme "code")
     intro: ["Scénario…"],            // paragraphes / listes (blocsTexte)
     objectifs: [
       {
         enonce: "Faites… avec `outil`.",   // texteRiche
         indice: "outil -x <cible>",         // facultatif
         motifs: ["^outil\\b", "10\\.0\\.0\\.5"],  // TOUS obligatoires
         interdire: ["--danger"],            // facultatif
         solution: "outil -x 10.0.0.5",      // commande modèle (vérifiée)
         sortie: "ligne 1\nligne 2"          // sortie simulée à l'écran
       }
     ]
   }
   La solution de chaque objectif doit valider ses propres motifs :
   c'est contrôlé par node outils/verifier-exercices.js.


   7) EXERCICE DE TYPE "probleme" (mini-cours à réponse saisie)
   -------------------------------------------------------------
   Un exemple résolu et un problème similaire à résoudre, choisis
   par des onglets « Exemple » / « Exercice » en haut de la page.
   Sous l'énoncé à résoudre : une barre de saisie et un bouton
   « Caractères spéciaux » (clavier de symboles Θ, Ω, ≤, ², ⌊ ⌋…).
   Deux usages : mini-cours (exemple = énoncé/formule/réponse) ou
   comptage d'opérations (champ "methode" + code C dans exemple et
   exercice). Score = bonnes réponses / nombre de problèmes.
   {
     type: "probleme",
     id: "ch1-boucle",               // unique dans la matière
     titre: "Boucle simple",
     description: "Sous-titre de la carte.",
     methode: ["Rappel affiché au-dessus des onglets.", ["puce", "puce"]], // facultatif
     methodeTitre: "Méthode",        // facultatif (défaut : "Méthode")
     exemple: {                       // problème résolu (onglet « Exemple »)
       langage: "c",                  // colore le code ("c" ou "asm")
       enonce: "…",                   // → carte « Problème » (chaîne ou blocsTexte)
       code: "for (…) { … }",         // bloc de code facultatif
       legende: "…",                  // titre du bloc (facultatif)
       formule: "…",                  // → carte « Formule » (chaîne ou blocsTexte)
       formuleTitre: "Démarche",      // facultatif (défaut : "Formule")
       reponse: "…"                   // → carte « Réponse » (en vert)
     },
     exercice: {                      // à résoudre (onglet « Exercice ») ; ou un tableau
       langage: "c",
       enonce: "…",
       code: "…",                     // facultatif
       reponse: "3n + 3",             // réponse attendue (obligatoire)
       accepte: ["3n+3", "3 + 3n"],   // autres écritures acceptées (facultatif)
       indice: "Affiché après une tentative fausse.",  // facultatif
       solution: ["Explication une fois résolu."]      // facultatif (chaîne ou blocsTexte)
     }
   }
   Comparaison des réponses : casse, espaces et notation unifiés
   (Θ↔theta, ²↔^2, ·/×↔*, ⁄↔/), les * ( ) ignorés. Pour l'ordre des
   termes ou « n2 » sans exposant, ajouter les formes dans "accepte".

   Plusieurs cases de réponse : "champs" remplace "reponse" (un seul
   bouton « Vérifier », une case juste se verrouille) :
     exercice: {
       enonce: "…",
       schema: { type: "spectre", unite: "kHz", raies: [{ f: 650, a: 40 }] },
       champs: [
         { libelle: "Porteuse", reponse: 650, unite: "kHz" },  // nombre :
         { libelle: "Taux `m`", reponse: 0.6, tolerance: 0.02 }, // tolérance
         { libelle: "Message", reponse: "1010" },                // relative,
         { libelle: "Mot", reponse: "0x2D", accepte: ["2D"] }    // 1 % par défaut
       ],
       indice: "…", solution: ["…"]
     }
   Saisie numérique : virgule, 5e-5, 5×10^-5, 10⁻⁵, 2/3, unité recopiée.

   Schémas SVG (assets/js/schemas.js) : "schema" (objet ou tableau)
   dans exemple ou exercice, "legende" facultative. Types : spectre,
   am, fm, numerique, constellation, trame, bus, chaine, courbes,
   grille, arbre, sauts, barres. Paramètres
   de chaque type : voir LISEZMOI.md et data/cours/electronique-3.js.


   8) EXERCICE DE TYPE "reseau" (simulateur Cisco, moteur reseau-cisco.js)
   -------------------------------------------------------------
   Deux vues : l'ÉNONCÉ (principe, scénario, objectifs) dans la page, et
   la SCÈNE de configuration qui s'ouvre EN PLEIN ÉCRAN (flèche en haut
   à gauche, ou Échap, pour revenir ; la configuration est conservée).
   La scène (plan façon Packet Tracer) contient des appareils :
   routeurs, switches et PC. L'utilisateur peut en ajouter
   (palette), les DÉPLACER librement (glisser-déposer), les relier
   (bouton « Relier » : on clique l'appareil puis son port), puis
   ouvrir la console de chacun — elle s'ouvre en fenêtre posée sur la
   scène — pour taper les commandes Cisco IOS. Les câbles sont tracés
   entre les appareils avec le nom des ports, en vert si les deux ports
   sont allumés, en rouge pointillé sinon ; un clic sur un câble le
   retire. Le bouton « Vérifier » simule le réseau (pings) : si tous
   les tests passent, c'est validé. Score = tests réussis / nb de tests.

   IOS reconnu (abréviations admises) — routeur / switch :
     enable · configure terminal · hostname NOM · exit · end
     interface g0/0 (ou g0/0.10) · ip address A.B.C.D M.M.M.M
     no shutdown · shutdown · encapsulation dot1q VLAN (sous-interface)
     ip route RESEAU MASQUE SAUT (routeur)
     vlan N · name X · switchport mode access|trunk
     switchport access vlan N (switch)
     show ip interface brief · show ip route · show vlan brief · ping IP
   PC (poste simplifié) : ip A.B.C.D M.M.M.M [PASSERELLE] · show ip · ping IP

   {
     type: "reseau",
     id: "res-ex",                    // unique dans la matière
     titre: "…",
     description: "…",
     cours: "…", exemple: { … },       // colonne de gauche (comme "code")
     intro: ["Scénario…"],             // paragraphes / listes (blocsTexte)
     consigne: "…",                    // chaîne ou blocsTexte
     objectifs: ["`R1 g0/0` = …", …],  // liste à pastilles (texteRiche)

     topologie: {                      // topologie de départ (souvent câblée)
       appareils: [ // type : routeur | switch | pc
                    // x, y : position sur le plan, en % (facultatif :
                    //        placement automatique sinon)
                    { nom: "R1",  type: "routeur", x: 30, y: 42 },
                    { nom: "PC1", type: "pc",      x: 70, y: 42 } ],
       liens: [ { de: "R1", deIf: "g0/0", vers: "PC1", versIf: "eth0" } ]
     },
     palette: ["routeur","switch","pc"], // types ajoutables (défaut : les 3)
     verrouTopologie: false,           // true = ni ajout, ni câble, ni suppression

     preconfig: { R2: ["enable","conf t", …] },  // config déjà en place au départ
                                                 // (appliquée aussi par le vérificateur)

     tests: [                          // pings de bout en bout (la validation)
       { de: "PC1", vers: "PC2", attendu: true,  message: "PC1 joint PC2" },
       { de: "PC1", vers: "PC3", attendu: false, message: "isolation VLAN" }
     ],                                //  vers : nom d'appareil (→ son IP) ou IP littérale
                                       //  attendu : true (défaut) ping réussi, false ping bloqué

     solution: {                       // commandes par appareil (réussit tous les tests)
       R1:  ["enable","configure terminal","interface g0/0", …],
       PC1: ["ip 192.168.1.10 255.255.255.0 192.168.1.1"]
     },
     solutionTopologie: { appareils:[…], liens:[…] } // si l'utilisateur doit AUSSI
                                       // construire la topologie (appliquée par le
                                       // vérificateur par-dessus "topologie")
   }
   Contrôlé par node outils/verifier-exercices.js : avec la solution
   (et solutionTopologie), TOUS les tests passent ; sans elle, au moins
   un test échoue (exercice non trivial).



   9) EXERCICE DE TYPE "lecon" (moteur assets/js/lecon.js)
   -------------------------------------------------------------
   Une leçon complète en cinq onglets : Cours (étapes avec Précédent /
   Suivant), Problématique, Exemple, Correction, Exercices. Chaque étape
   du cours DOIT avoir un schéma ou une animation (contrôlé par le
   vérificateur), et peut avoir une redaction et une demo.

   Contenu riche (texte, questions, correction, explication…) :
   chaîne = paragraphe ; tableau = liste à pastilles ; { titre } ;
   { entetes, lignes } ; { schema } ; { redaction: [...] } (encadré
   « Rédaction ») ; { code, legende } ; { codeC, legende } (code C
   coloré et numéroté) ; { remarque } ; { attention } ;
   { demo: { enonce, lignes: [["Soit n ≥ 1.", "on fixe n"], …] } }
   (démonstration révélée ligne par ligne, justification en marge) ;
   { animation: {…} } (exécution animée, assets/js/trace.js) :
     animation: {
       code: `int f(int t[], int n) { … }`,   // C : fonctions, int, tableaux,
                                              // if, for, while, return, printf
       appel: "f",                            // défaut : la première fonction
       n: { min: 1, max: 8, depart: 5 },      // réglage de n (facultatif)
       scenarios: [{ nom: "Pire cas", texte: "…",
         entree: (n) => ({ t: [...], n }),    // ou un objet fixe
         attendu: (n) => ({ 3: n, ops: 5 * n + 3, renvoie: -1, appels: 1 }) }],
       mesure: { ligne: 3, nom: "comparaisons" },  // ou un tableau
       boucles: { 2: "boucle sur i" },        // libellés (ligne d'en-tête)
       tableau: "t", pointeurs: ["i", "j"],   // tableau dessiné, indices
       operations: true }                     // compteur d'opérations (CM1)
   attendu (ligne → exécutions, ops, renvoie, appels) est vérifié par
   l'outil pour chaque n de la plage.
   problematique, exemple et correction acceptent aussi codeC et
   animation comme clés directes.

   Schémas : un objet ou un tableau (affichés côte à côte), de type
   "graphe" ou "matrice" (assets/js/graphes.js), ou un type de
   assets/js/schemas.js. Graphe en écriture compacte :
     { type: "graphe", oriente: false,
       sommets: "1:0,1 2:1,0 3:1,1",    // nom:x,y (unités de grille)
                                         // ou "1 2 3" + disposition: "cercle"
       aretes: "1-2 2-3",                // arcs : "1>2" ; poids : "1-2:5"
       marques: { "1": "a", "1-2": "b" },// a bleu, b or, c vert, d rouge, e pâle
       groupes: ["1 2", "3"],            // une couleur par groupe
       etiquettes: { "1": "d=2" },       // petit texte près d'un sommet
       carres: "c1 c2",                  // sommets carrés (graphe de Tanner)
       courbes: { "3>5": 30 },           // courbure imposée (px)
       legende: "…" }
   Matrice : { type: "matrice", graphe: {…}, puissance: 2 } (adjacence
   calculée) ou { type: "matrice", lignes: "1 2", colonnes: "1 2",
   valeurs: [[0,1],[1,0]], marques: { "1,2": "a", "l:1": "b", "c:2": "b" } }.

   {
     type: "lecon",
     id: "gm-degres",
     titre: "Sommets, arêtes, voisins et degrés",
     description: "…",
     cours: [                          // étapes, une à la fois
       { titre: "…", texte: [ … ], schema: { type: "graphe", … },
         redaction: ["Rédaction modèle…"] }
     ],
     problematique: { texte: [ … ], schema },
     exemple: { texte: [ … ], schema, questions: ["…", "…"] },
     correction: { texte: [ { titre: "1. …" }, { redaction: [ … ] }, { schema } ] },
     exercices: [                      // niveau 1 à 4 (4 = au-delà du TD),
                                       // dans l'ordre croissant
       { type: "qcm", niveau: 1, titre, enonce, schema,
         choix: ["…", "…"], reponse: 1 | [0, 2], explication },
       { type: "champs", niveau: 1, enonce, schema, champs: [
           { libelle: "`d(1)`", reponse: 3, tolerance: 0 },      // nombre
           { libelle: "`N(3)`", reponse: "{1, 5, 7}", ensemble: true },
           { libelle: "Ordre", reponse: "1 2 3", suite: true },  // ordre compte
           { libelle: "CFC", reponse: "{1,2},{3}", partition: true },
           { libelle: "…", reponse: "non", accepte: ["…"] } ],
         indice, explication },
       // Exercices sur graphe : graphe = { sommets, aretes?, oriente? }.
       // Correction par règles (Graphes.evaluer) ou réponse exacte (attendu).
       { type: "construire", niveau: 2, enonce, graphe: { sommets: "…" },
         depart: "1-2",                // arêtes déjà tracées (facultatif)
         attendu: "1-2 2-3",           // ou bien des règles :
         regles: [ { regle: "regulier", k: 3 }, { regle: "connexe" } ],
         solution: "…",                // obligatoire avec des règles
         indice, explication },
       //   règles : egal, nbAretes, degres, regulier, demiDegres, connexe,
       //   composantes, sansCycle, avecCycle, arbre, biparti (parts),
       //   couplageParfait, fortementConnexe, cfc, contient, inclus,
       //   sansCycleLongueur, tournoi, arborescence (racine) ; chaque règle
       //   accepte un message personnalisé.
       { type: "selection", cible: "aretes" | (sommets par défaut), graphe,
         regles: [ { regle: "clique", maximum: true } ], solution: "…" },
       //   sommets : egal, taille, clique, stable (taille / maximum),
       //   couverture (minimum), composante (contient), cfc, partie ;
       //   arêtes : egal, couplage (taille / maximum / parfait),
       //   arbreCouvrant, cycle (longueur).
       { type: "ordre", graphe, regles: [ { regle: "parcours", depart: "1" } ] },
       //   egal (suite), parcours (depart, complet), chaine (de, vers,
       //   longueur, min, ferme, simple, elementaire, passePar),
       //   topologique, augmentant (couplage).
       { type: "matrice", graphe, puissance: 2, max: 3 },  // ou lignes,
       //   colonnes et attendu: [[…]] ; un clic fait tourner la case 0 → max.
       { type: "remettre", etapes: ["1re étape", "2e", "…"] },  // dans l'ordre
       // qcm, champs et remettre acceptent un champ code (C numéroté).
       { type: "lignes", code: `…`, reponse: [4, 5] },    // lignes à cliquer
       { type: "cout", code: `…`, choix: ["Θ(1)", "Θ(n)", "O(n)"],
         lignes: { 2: "Θ(1)", 5: "O(n)" } }               // classe par ligne
     ]
   }
   Contrôlé par node outils/verifier-exercices.js : schéma ou animation
   à chaque étape, animations exécutées (comptes attendu), lignes des
   exercices lignes / cout existantes,
   schémas dessinables, niveaux croissants, chaque solution acceptée et
   chaque départ refusé, chaque case de réponse acceptant sa réponse.

   10) EXERCICE DE TYPE "enquete" (moteur assets/js/enquete.js)
   -------------------------------------------------------------
   Deux onglets : Méthodes (pas à pas, avec exemple) puis Challenges,
   niveaux 1 à 4 dans l'ordre croissant. Contenu riche : celui des
   leçons, plus les pièces ci-dessous (utilisables partout).

   {
     type: "enquete",
     id: "osint-enquete-…",
     titre: "Enquête 1 — …",
     description: "…",
     methodes: [
       { titre: "…", texte: [ … ], exemple: { titre: "Exemple", texte: [ … ] } }
     ],
     challenges: [
       { niveau: 1, titre: "…", enonce: [ … ],
         pieces: [
           { image: "assets/osint/x.jpg", nom: "x.jpg", legende: "…" },
           { fichier: "assets/osint/x.pdf", nom: "x.pdf", legende: "…" },
           { texte: "Received: …", nom: "message.eml" },     // affiché + téléchargeable
           { plaques: [ { format: "fni", texte: "5419 RT 29", noire: false },
                        { format: "siv", texte: "GH-482-PK", region: "56" },
                        { format: "eu", pays: "D", texte: "HH AB 1234" },
                        { format: "uk", texte: "LB24 XKD" },
                        { format: "ch", texte: "VS 123456" } ] }
         ],
         question: "…",
         champs: [
           { libelle: "Ville", reponse: "Saint-Brieuc", accepte: ["…"] },  // casse,
                                       // accents, espaces, ponctuation ignorés
           { libelle: "Année", reponse: 1995, tolerance: 0 },             // nombre
           { libelle: "Position", gps: [48.4538, -2.0462], rayon: 0.15 }  // km
         ],
         indices: ["…", "…"],          // dévoilés un par un
         solution: [ … ] },
       { niveau: 1, type: "qcm", titre, enonce, pieces, question,
         choix: ["…", "…"], reponse: 0, solution: "…" }
     ]
   }
   Contrôlé par node outils/verifier-exercices.js : méthodes et
   challenges présents, niveaux croissants, solution présente, chaque
   pièce existe, chaque case accepte sa réponse et ses variantes.

   Vérifier toutes les solutions : node outils/verifier-exercices.js
   ============================================================= */
