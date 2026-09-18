/* =============================================================
   Fondamentaux du système d'exploitation Windows
   -------------------------------------------------------------
   Structure et exemples complets : voir data/cours/_modele.js
   Chaque QCM est une banque de questions : « tirage » fixe le
   nombre de questions tirées au hasard à chaque partie.
   L'examen blanc pioche dans les trois banques réunies.
   ============================================================= */

(function () {

  /* ---------------------------------------------------------
     BANQUE 1 — Historique et architecture
     --------------------------------------------------------- */
  const architecture = [
    {
      enonce: "En quelle année sort MS-DOS, le premier système d'exploitation de Microsoft ?",
      choix: ["1981", "1985", "1987", "1993"],
      reponse: 0,
      explication: "MS-DOS sort en 1981. Windows 1.0 n'arrive qu'en 1985."
    },
    {
      enonce: "Comment se présentait MS-DOS ?",
      choix: [
        "Un système 16 bits en ligne de commande, développé pour IBM",
        "Un système 32 bits graphique, développé pour Apple",
        "Un système 16 bits graphique, développé pour Compaq",
        "Un système 8 bits en ligne de commande, développé pour Intel"
      ],
      reponse: 0,
      explication: "MS-DOS est un système 16 bits en ligne de commande développé pour IBM."
    },
    {
      enonce: "Qu'était Windows 1.0, sorti en 1985 ?",
      choix: [
        "Une interface graphique qui fonctionnait par-dessus MS-DOS",
        "Un système d'exploitation 32 bits autonome",
        "La première version du noyau NT",
        "Une surcouche graphique du système OS/2"
      ],
      reponse: 0,
      explication: "Windows 1.0 n'était qu'une interface graphique posée sur MS-DOS, sans grand succès auprès du public."
    },
    {
      enonce: "De quelle interface Windows 1.0 s'inspirait-il ?",
      choix: ["Celle des ordinateurs Apple", "Celle d'OS/2 d'IBM", "Celle des terminaux Unix", "Celle de l'Amiga"],
      reponse: 0,
      explication: "L'interface graphique de Windows 1.0 était inspirée de celle des ordinateurs Apple."
    },
    {
      enonce: "Quelle version est la première à être un système d'exploitation à part entière, tout en s'appuyant encore sur MS-DOS ?",
      choix: ["Windows 95", "Windows 2.0", "Windows NT", "Windows XP"],
      reponse: 0,
      explication: "Windows 95 (24 août 1995) n'est plus une simple interface graphique pour MS-DOS, même s'il s'appuie encore dessus."
    },
    {
      enonce: "Quelles fonctionnalités Windows 98 prend-il en charge nativement ?",
      choix: ["FAT32", "USB", "Le bus AGP", "NTFS"],
      reponse: [0, 1, 2],
      explication: "Windows 98 s'appuie moins sur MS-DOS et gère nativement FAT32, l'USB et le bus AGP. NTFS appartient à la branche NT."
    },
    {
      enonce: "Qu'est-ce qui distingue Windows NT (1993) de la série Windows 9x ?",
      choix: [
        "Il est entièrement 32 bits et ne s'appuie pas sur MS-DOS",
        "Il est une évolution directe de Windows 95",
        "Il est 16 bits et destiné au grand public",
        "Il est conçu pour les écrans tactiles"
      ],
      reponse: 0,
      explication: "Windows NT est un système à part entière, entièrement 32 bits, destiné aux professionnels et indépendant de MS-DOS."
    },
    {
      enonce: "Que signifie « NT » dans Windows NT ?",
      choix: ["New Technology", "Network Terminal", "Native Toolkit", "Next Transaction"],
      reponse: 0,
      explication: "NT signifie « New Technology »."
    },
    {
      enonce: "Quelle version est la première à permettre de brancher des terminaux sur un serveur ?",
      choix: ["Windows NT 4.0 TSE", "Windows 2000", "Windows XP", "Windows 98"],
      reponse: 0,
      explication: "Windows NT 4.0 TSE (Terminal Server Emulation), commercialisé en 1998."
    },
    {
      enonce: "Quel système de fichiers journalisé et sécurisé arrive avec Windows NT ?",
      choix: ["NTFS", "FAT32", "exFAT", "ext4"],
      reponse: 0,
      explication: "NTFS (NT File System) apparaît avec Windows NT."
    },
    {
      enonce: "Quelle version réalise la convergence des branches 9x et NT et n'est plus du tout basée sur MS-DOS ?",
      choix: ["Windows XP", "Windows 2000", "Windows 98", "Windows NT 4.0"],
      reponse: 0,
      explication: "Windows XP (octobre 2001) réalise la convergence. Windows 2000 n'en montrait que la volonté."
    },
    {
      enonce: "Quelle version succède directement à Windows NT 4.0 ?",
      choix: ["Windows 2000", "Windows 98", "Windows XP", "Windows Vista"],
      reponse: 0,
      explication: "Windows 2000 sort le 17 février 2000 et suit Windows NT 4.0."
    },
    {
      enonce: "Quelle version introduit l'UAC et BitLocker ?",
      choix: ["Windows Vista", "Windows XP", "Windows 7", "Windows 8"],
      reponse: 0,
      explication: "Windows Vista (2007) apporte de nouvelles fonctionnalités de sécurité, dont l'UAC et BitLocker."
    },
    {
      enonce: "Quelle version introduit l'interface Aero et est critiquée pour ses problèmes de performance ?",
      choix: ["Windows Vista", "Windows 7", "Windows XP", "Windows 8"],
      reponse: 0,
      explication: "Vista introduit Aero mais souffre de lourdeur, de bugs et de lenteurs."
    },
    {
      enonce: "Pourquoi Windows 8 a-t-il été rejeté par de nombreux utilisateurs ?",
      choix: [
        "Le menu Démarrer traditionnel était remplacé par des tuiles",
        "Il exigeait une puce TPM 2.0",
        "Il abandonnait le noyau NT",
        "Il ne prenait pas en charge l'USB"
      ],
      reponse: 0,
      explication: "Windows 8 refond l'interface pour le tactile et supprime le menu Démarrer traditionnel."
    },
    {
      enonce: "Quelle version inaugure la stratégie « Windows as a Service » ?",
      choix: ["Windows 10", "Windows 8.1", "Windows 11", "Windows 7"],
      reponse: 0,
      explication: "Windows 10 (2015) passe aux mises à jour continues avec des mises à jour majeures semestrielles."
    },
    {
      enonce: "Quelles nouveautés sont apportées par Windows 10 ?",
      choix: ["Le retour du menu Démarrer", "L'assistant vocal Cortana", "Les bureaux virtuels", "Les Snap Layouts"],
      reponse: [0, 1, 2],
      explication: "Les Snap Layouts arrivent avec Windows 11."
    },
    {
      enonce: "Quelle exigence matérielle Windows 11 impose-t-il ?",
      choix: ["Une puce TPM 2.0", "Une unité de traitement neuronal (NPU)", "16 Go de mémoire vive", "Un écran tactile"],
      reponse: 0,
      explication: "Windows 11 renforce la sécurité et nécessite TPM 2.0 ainsi que des processeurs récents."
    },
    {
      enonce: "Par quel moyen Windows 11 permet-il d'exécuter des applications Android ?",
      choix: ["L'Amazon Appstore", "Le Google Play Store", "Le sous-système WSL", "Hyper-V uniquement"],
      reponse: 0,
      explication: "Windows 11 prend en charge les applications Android via l'Amazon Appstore."
    },
    {
      enonce: "Quel composant matériel Windows 12 devrait-il exiger pour exploiter pleinement ses fonctions d'IA ?",
      choix: ["Une NPU (unité de traitement neuronal)", "Une puce TPM 1.2", "Un bus AGP", "Un coprocesseur arithmétique"],
      reponse: 0,
      explication: "Les appareils devront intégrer une NPU, et la mémoire requise pourrait passer de 4 à 16 Go."
    },
    {
      enonce: "Quelle est la version du noyau NT de Windows 7 ?",
      choix: ["6.1", "6.0", "7.0", "6.2"],
      reponse: 0,
      explication: "Vista = 6.0, 7 = 6.1, 8 = 6.2, 8.1 = 6.3."
    },
    {
      enonce: "Quelle est la version du noyau NT de Windows XP ?",
      choix: ["5.1", "5.0", "6.0", "4.0"],
      reponse: 0,
      explication: "Windows XP repose sur le noyau NT 5.1."
    },
    {
      enonce: "Quelle version du noyau NT est partagée par Windows 10 et Windows 11 ?",
      choix: ["10.0", "6.3", "11.0", "6.4"],
      reponse: 0,
      explication: "Windows 10 est en NT 10.0 et Windows 11 en 10.0+."
    },
    {
      enonce: "Quelle est la version du noyau NT de Windows 8.1 ?",
      choix: ["6.3", "6.2", "8.1", "6.1"],
      reponse: 0,
      explication: "Windows 8.1 repose sur NT 6.3 (évolution de Metro, stabilité)."
    },
    {
      enonce: "Quel est le rôle de la couche d'abstraction matérielle (HAL) ?",
      choix: [
        "Isoler le noyau des spécificités matérielles pour fonctionner sur différents matériels",
        "Gérer l'affichage et les fenêtres",
        "Stocker les paramètres du système et des logiciels",
        "Authentifier les utilisateurs à l'ouverture de session"
      ],
      reponse: 0,
      explication: "La HAL isole le noyau du matériel, ce qui permet à Windows de tourner sur des machines différentes."
    },
    {
      enonce: "Que gère le noyau Windows ?",
      choix: ["Les processus", "La mémoire", "La communication entre les composants matériels", "L'association des extensions de fichiers"],
      reponse: [0, 1, 2],
      explication: "L'association des extensions de fichiers est une information de la base de registre (HKCR)."
    },
    {
      enonce: "Quel composant principal est responsable de l'affichage et de la gestion des fenêtres ?",
      choix: ["Le système graphique", "La HAL", "Les pilotes", "Le noyau"],
      reponse: 0,
      explication: "Le système graphique gère l'affichage et les fenêtres."
    },
    {
      enonce: "Quelles sont les deux interfaces de programmation les plus utilisées sous Windows ?",
      choix: ["Win32 et POSIX", "Win32 et COM", "POSIX et OS/2", "WMI et COM"],
      reponse: 0,
      explication: "Win32 est l'API Windows ; POSIX assure la compatibilité avec les systèmes Unix."
    },
    {
      enonce: "Quelle association entre mode et anneau de protection est correcte ?",
      choix: [
        "Mode utilisateur = ring 3, mode noyau = ring 0",
        "Mode utilisateur = ring 0, mode noyau = ring 3",
        "Mode utilisateur = ring 1, mode noyau = ring 2",
        "Les deux modes s'exécutent en ring 0"
      ],
      reponse: 0,
      explication: "Userland s'exécute en ring 3, kernelland en ring 0."
    },
    {
      enonce: "Que se passe-t-il quand un programme plante en mode utilisateur ?",
      choix: [
        "Le plantage est récupérable grâce à l'isolation",
        "Le PC s'arrête complètement",
        "Le noyau est corrompu et doit être réinstallé",
        "La HAL redémarre le processeur"
      ],
      reponse: 0,
      explication: "L'isolation du mode utilisateur rend ses plantages toujours récupérables."
    },
    {
      enonce: "Quelle est la conséquence d'un plantage en mode noyau ?",
      choix: [
        "L'arrêt complet du PC",
        "La fermeture du seul programme fautif",
        "Le passage du processus en ring 3",
        "Une simple entrée dans le journal d'événements"
      ],
      reponse: 0,
      explication: "Le mode noyau a un accès illimité au matériel : un plantage y est critique et arrête la machine."
    },
    {
      enonce: "Comment un programme en mode utilisateur accède-t-il au matériel ou à la mémoire ?",
      choix: [
        "En passant par les API système",
        "En adressant directement la mémoire physique",
        "En chargeant la HAL dans son propre processus",
        "En basculant lui-même en ring 0"
      ],
      reponse: 0,
      explication: "Le code utilisateur ne peut ni accéder directement au matériel ni référencer la mémoire : il passe par les API système."
    },
    {
      enonce: "De quel type est le noyau Windows ?",
      choix: ["Hybride", "Monolithique pur", "Micro-noyau pur", "Exonoyau"],
      reponse: 0,
      explication: "Le noyau Windows est hybride : il combine noyau monolithique et micro-noyau."
    },
    {
      enonce: "Quels éléments font partie du mode noyau Windows ?",
      choix: ["La HAL", "Les pilotes", "Le micro-noyau", "Les services exécutifs", "ntdll.dll"],
      reponse: [0, 1, 2, 3],
      explication: "ntdll.dll est la dernière couche du mode utilisateur, juste avant le passage en noyau."
    },
    {
      enonce: "Quelles instructions permettent de passer du mode utilisateur au mode noyau lors d'un appel système ?",
      choix: ["syscall", "sysenter", "jmp", "cpuid"],
      reponse: [0, 1],
      explication: "Les API Windows se traduisent en appels système via syscall ou sysenter."
    },
    {
      enonce: "Dans quel ordre un appel à CreateFile traverse-t-il le système ?",
      choix: [
        "Application → kernel32.dll → ntdll.dll → noyau",
        "Application → ntdll.dll → kernel32.dll → noyau",
        "Application → noyau → ntdll.dll → kernel32.dll",
        "Application → user32.dll → gdi32.dll → noyau"
      ],
      reponse: 0,
      explication: "CreateFile (kernel32.dll) appelle NtCreateFile (ntdll.dll), qui passe en mode noyau par syscall/sysenter."
    },
    {
      enonce: "Quelle fonction de ntdll.dll est appelée par l'API CreateFile ?",
      choix: ["NtCreateFile", "CreateFileW", "KeCreateFile", "OpenFileEx"],
      reponse: 0,
      explication: "kernel32.dll!CreateFile → ntdll.dll!NtCreateFile → syscall."
    },
    {
      enonce: "Quelle DLL est la dernière traversée en mode utilisateur avant le passage en mode noyau ?",
      choix: ["ntdll.dll", "kernel32.dll", "user32.dll", "gdi32.dll"],
      reponse: 0,
      explication: "ntdll.dll est la base commune du mode utilisateur : c'est elle qui émet l'appel système."
    },
    {
      enonce: "En 32 bits, comment l'espace d'adressage est-il réparti par défaut ?",
      choix: [
        "2 Go pour le système, 2 Go pour le processus utilisateur",
        "1 Go pour le système, 3 Go pour le processus utilisateur",
        "3 Go pour le système, 1 Go pour le processus utilisateur",
        "4 Go pour le système et 4 Go pour le processus utilisateur"
      ],
      reponse: 0,
      explication: "Par défaut 2 Go / 2 Go ; en option, 3 Go pour l'utilisateur et 1 Go pour le système."
    },
    {
      enonce: "En 32 bits avec l'option d'espace étendu, combien d'espace reçoit le processus utilisateur ?",
      choix: ["3 Go", "2 Go", "1 Go", "4 Go"],
      reponse: 0,
      explication: "L'option donne 3 Go à l'espace utilisateur et réduit l'espace système à 1 Go."
    },
    {
      enonce: "Quels sous-systèmes d'environnement figurent dans l'architecture Windows ?",
      choix: ["Win32", "POSIX", "OS/2", "Security"],
      reponse: [0, 1, 2],
      explication: "Security fait partie des sous-systèmes intégraux, avec les services Workstation et Server."
    },
    {
      enonce: "Quel gestionnaire de l'Executive gère la mémoire virtuelle ?",
      choix: ["Virtual Memory Manager (VMM)", "Object Manager", "PnP Manager", "I/O Manager"],
      reponse: 0,
      explication: "Le VMM gère la mémoire virtuelle."
    },
    {
      enonce: "Quel composant de l'Executive contrôle les droits d'accès aux objets ?",
      choix: ["Security Reference Monitor", "Power Manager", "IPC Manager", "Process Manager"],
      reponse: 0,
      explication: "Le Security Reference Monitor vérifie les accès ; LSASS dialogue avec lui."
    },
    {
      enonce: "Où se situe l'hyperviseur Hyper-V dans l'architecture Windows ?",
      choix: [
        "Sous la HAL, dans un contexte hyperviseur",
        "Au-dessus de ntdll.dll",
        "Parmi les sous-systèmes d'environnement",
        "À l'intérieur de l'Executive"
      ],
      reponse: 0,
      explication: "Hyper-V s'exécute sous la HAL, en mode noyau « contexte hyperviseur »."
    },
    {
      enonce: "Qu'est-ce qui est représenté par un objet sous Windows ?",
      choix: ["Un processus", "Un thread", "Un fichier", "Une clé de registre"],
      reponse: [0, 1, 2, 3],
      explication: "Tout élément géré par Windows est représenté par un objet."
    },
    {
      enonce: "Que regroupe un objet Windows ?",
      choix: ["Des données", "Un en-tête noyau", "Des handles", "Un hash NT"],
      reponse: [0, 1, 2],
      explication: "Données (PID, chemin…), en-tête noyau (sécurité, références, permissions) et handles pour l'accès en mode utilisateur."
    },
    {
      enonce: "À quoi sert un handle ?",
      choix: [
        "À accéder à un objet depuis le mode utilisateur",
        "À chiffrer le contenu d'un objet",
        "À journaliser les accès à un objet",
        "À identifier un utilisateur sur le réseau"
      ],
      reponse: 0,
      explication: "Les handles permettent au code en mode utilisateur de manipuler un objet géré par le noyau."
    },
    {
      enonce: "Quelle catégorie d'objets n'est jamais visible en mode utilisateur ?",
      choix: ["Kernel Objects", "Executive Objects", "GDI/User Objects", "COM Objects"],
      reponse: 0,
      explication: "Les Kernel Objects sont utilisés uniquement en interne. Certains Executive Objects sont accessibles en mode utilisateur."
    },
    {
      enonce: "À quel composant les objets GDI/User sont-ils liés ?",
      choix: ["Win32k.sys, le système de fenêtrage", "ntoskrnl.exe, l'ordonnanceur", "lsass.exe", "La HAL"],
      reponse: 0,
      explication: "Les objets GDI/User dépendent de Win32k.sys et servent aux applications graphiques."
    },
    {
      enonce: "Quelles bibliothèques mettent en œuvre l'API Win32 ?",
      choix: ["Kernel32.dll", "User32.dll", "GDI32.dll", "Msv1_0.dll"],
      reponse: [0, 1, 2],
      explication: "Msv1_0.dll est un paquet d'authentification chargé par LSASS."
    },
    {
      enonce: "Lequel de ces domaines n'est pas couvert par l'API Windows ?",
      choix: ["La compilation du noyau", "Les services de base", "L'interface graphique", "Le réseau"],
      reponse: 0,
      explication: "L'API Windows couvre services de base, interface graphique, réseau, messagerie et services web."
    },
    {
      enonce: "Que permet COM (Component Object Model) ?",
      choix: [
        "Faire interagir des composants binaires, même écrits dans des langages différents",
        "Interroger le système avec un langage proche de SQL",
        "Stocker les hashs des mots de passe locaux",
        "Isoler le noyau des spécificités matérielles"
      ],
      reponse: 0,
      explication: "COM est un système orienté objet, distribué et indépendant de la plateforme."
    },
    {
      enonce: "Quelles technologies reposent sur COM ?",
      choix: ["OLE", "ActiveX", "NTFS", "SAM"],
      reponse: [0, 1],
      explication: "COM est la base d'OLE (documents composés) et d'ActiveX (composants Internet)."
    },
    {
      enonce: "Un tableau Excel embarqué dans un document Word repose sur quelle technologie ?",
      choix: ["OLE", "WMI", "LSA", "La HAL"],
      reponse: 0,
      explication: "OLE, construit sur COM, gère les documents composés."
    },
    {
      enonce: "À quoi sert WMI ?",
      choix: ["Surveiller les performances", "Configurer le matériel", "Gérer des systèmes à distance", "Chiffrer les disques"],
      reponse: [0, 1, 2],
      explication: "WMI interroge, filtre et résout une multitude d'informations sur un système Windows."
    },
    {
      enonce: "Quelle technologie exécute ce type de requête (espace de noms root\\CIMv2) ?",
      code: "SELECT * FROM Win32_OperatingSystem\nWHERE Version LIKE \"10.0%\" and ProductType=\"1\"",
      choix: ["WMI", "COM", "La base de registre", "LSA"],
      reponse: 0,
      explication: "C'est une requête WMI, utilisée ici comme filtre WMI de GPO pour cibler Windows 10."
    }
  ];

  /* ---------------------------------------------------------
     BANQUE 2 — Comptes, identités et contrôle d'accès
     --------------------------------------------------------- */
  const securite = [
    {
      enonce: "Qu'est-ce qu'un SID ?",
      choix: [
        "Un identifiant unique attribué à chaque utilisateur, groupe et ordinateur",
        "Le hash du mot de passe d'un utilisateur",
        "Une liste d'autorisations attachée à un objet",
        "Le jeton d'accès d'un processus"
      ],
      reponse: 0,
      explication: "Le SID (Security Identifier) identifie et distingue chaque principal de sécurité."
    },
    {
      enonce: "Que devient le SID d'un utilisateur que l'on renomme ?",
      choix: ["Il reste identique", "Il est recalculé à partir du nouveau nom", "Il reçoit un nouveau RID", "Il est supprimé puis recréé"],
      reponse: 0,
      explication: "Le SID reste constant même si l'objet associé est renommé."
    },
    {
      enonce: "Quels éléments possèdent leur propre SID ?",
      choix: ["Les utilisateurs", "Les groupes", "Les ordinateurs", "Les processus"],
      reponse: [0, 1, 2, 3],
      explication: "Chaque principal capable de s'authentifier a son propre SID, processus compris."
    },
    {
      enonce: "Dans ce SID, que désigne le « 1 » en deuxième position ?",
      code: "S-1-5-21-1990400566-1867844161-3796721076-500",
      choix: ["Le niveau de révision", "L'autorité d'identification", "L'autorité secondaire", "Le RID"],
      reponse: 0,
      explication: "Le niveau de révision de la spécification SID, qui n'a jamais changé."
    },
    {
      enonce: "Dans ce SID, que désigne le « 5 » ?",
      code: "S-1-5-21-1990400566-1867844161-3796721076-500",
      choix: ["L'autorité d'identification (NT Authority)", "Le niveau de révision", "L'identifiant du domaine", "Le RID"],
      reponse: 0,
      explication: "5 correspond généralement à NT Authority. 21 est l'autorité secondaire."
    },
    {
      enonce: "Dans ce SID, que désigne la partie 1990400566-1867844161-3796721076 ?",
      code: "S-1-5-21-1990400566-1867844161-3796721076-500",
      choix: [
        "L'identifiant du domaine ou de l'ordinateur qui a créé le SID",
        "Le RID de l'utilisateur",
        "La date de création du compte",
        "Le hash du nom d'utilisateur"
      ],
      reponse: 0,
      explication: "Cette partie identifie l'ordinateur ou le domaine émetteur ; le RID vient après."
    },
    {
      enonce: "Dans ce SID, que désigne le « 500 » final ?",
      code: "S-1-5-21-1990400566-1867844161-3796721076-500",
      choix: ["Le RID (identifiant relatif)", "Le niveau de révision", "L'autorité secondaire", "Le nombre de groupes"],
      reponse: 0,
      explication: "Le RID identifie de manière unique le principal dans le domaine local. 500 = Administrateur."
    },
    {
      enonce: "Quel est le RID du compte Administrateur intégré ?",
      choix: ["500", "501", "1000", "544"],
      reponse: 0,
      explication: "Administrateur = 500, Invité = 501, comptes créés = 1000 ou plus."
    },
    {
      enonce: "Quel est le RID du compte Invité ?",
      choix: ["501", "500", "502", "1001"],
      reponse: 0,
      explication: "Le compte Invité (RID 501) est souvent désactivé."
    },
    {
      enonce: "Quel RID reçoivent les comptes qui ne sont pas créés par défaut par Windows ?",
      choix: ["1000 ou plus", "Entre 500 et 999", "Moins de 500", "Toujours 1001"],
      reponse: 0,
      explication: "Les RID des comptes créés ensuite valent 1000 ou plus."
    },
    {
      enonce: "À quel groupe correspond le SID S-1-1-0 ?",
      choix: ["Everyone (Tout le monde)", "SYSTEM", "Anonymous Logon", "Administrateurs"],
      reponse: 0,
      explication: "S-1-1-0 = Everyone, qui inclut les utilisateurs authentifiés et Guest."
    },
    {
      enonce: "À quel compte correspond le SID S-1-5-18 ?",
      choix: ["SYSTEM (LocalSystem)", "LocalService", "NetworkService", "Interactive"],
      reponse: 0,
      explication: "S-1-5-18 = SYSTEM, S-1-5-19 = LocalService, S-1-5-20 = NetworkService."
    },
    {
      enonce: "À quel compte correspond le SID S-1-5-19 ?",
      choix: ["LocalService", "SYSTEM", "NetworkService", "Batch"],
      reponse: 0,
      explication: "S-1-5-19 = LocalService, identité des services locaux sans droits réseau."
    },
    {
      enonce: "À quel compte correspond le SID S-1-5-20 ?",
      choix: ["NetworkService", "LocalService", "SYSTEM", "Network"],
      reponse: 0,
      explication: "S-1-5-20 = NetworkService, identité des services réseau."
    },
    {
      enonce: "À quoi correspond le SID S-1-5-7 ?",
      choix: ["Anonymous Logon", "Everyone", "Network", "Batch"],
      reponse: 0,
      explication: "S-1-5-7 regroupe les utilisateurs non authentifiés."
    },
    {
      enonce: "Quel SID regroupe les utilisateurs connectés localement, en bureau à distance ou par telnet ?",
      choix: ["S-1-5-4 (Interactive)", "S-1-5-2 (Network)", "S-1-5-3 (Batch)", "S-1-5-6 (Service)"],
      reponse: 0,
      explication: "Network = connexions par le réseau, Batch = tâches planifiées, Service = services connectés."
    },
    {
      enonce: "Quel SID regroupe les utilisateurs connectés par un batch, comme les tâches planifiées ?",
      choix: ["S-1-5-3", "S-1-5-4", "S-1-5-6", "S-1-5-9"],
      reponse: 0,
      explication: "S-1-5-3 = Batch. S-1-5-9 = Enterprise Domain Controllers."
    },
    {
      enonce: "Que désigne le SID S-1-5-32-544 affiché par whoami /all ?",
      choix: ["BUILTIN\\Administrateurs", "BUILTIN\\Utilisateurs", "Admins du domaine", "Utilisateurs authentifiés"],
      reponse: 0,
      explication: "S-1-5-32-544 = Administrateurs, S-1-5-32-545 = Utilisateurs, S-1-5-11 = Utilisateurs authentifiés."
    },
    {
      enonce: "Quelles affirmations sur le compte Administrateur intégré sont vraies ?",
      choix: [
        "Il ne peut pas être supprimé",
        "Il peut être renommé",
        "Il ne peut pas être retiré du groupe Administrateurs",
        "Il peut être bloqué"
      ],
      reponse: [0, 1, 2],
      explication: "Le compte administrateur ne peut être ni bloqué ni supprimé, mais il peut être renommé."
    },
    {
      enonce: "Où sont stockés les comptes utilisateurs locaux ?",
      choix: ["Dans la base SAM", "Dans Active Directory", "Dans HKEY_CURRENT_USER", "Dans la MFT"],
      reponse: 0,
      explication: "Les comptes locaux sont stockés dans la base SAM de la machine."
    },
    {
      enonce: "Quelle est la portée d'un compte utilisateur local ?",
      choix: [
        "Il n'a d'autorité que sur sa propre machine",
        "Il peut administrer toutes les machines du domaine",
        "Il est valable sur toutes les machines du même réseau",
        "Il n'a aucun droit, même sur sa machine"
      ],
      reponse: 0,
      explication: "Contrairement à un compte de domaine, un compte local ne vaut que sur sa machine."
    },
    {
      enonce: "Quel est le compte le plus puissant de Windows ?",
      choix: ["NT AUTHORITY\\SYSTEM", "Administrateur (RID 500)", "NT AUTHORITY\\LOCAL SERVICE", "Admins du domaine"],
      reponse: 0,
      explication: "SYSTEM a des privilèges complets sur fichiers, processus et périphériques."
    },
    {
      enonce: "Quels processus sont démarrés par NT AUTHORITY\\SYSTEM avant l'interaction utilisateur ?",
      choix: ["winlogon.exe", "csrss.exe", "notepad.exe", "explorer.exe"],
      reponse: [0, 1],
      explication: "SYSTEM démarre les services essentiels comme winlogon.exe et csrss.exe."
    },
    {
      enonce: "Quel compte a des privilèges restreints localement mais peut accéder aux ressources réseau ?",
      choix: ["NT AUTHORITY\\NETWORK SERVICE", "NT AUTHORITY\\LOCAL SERVICE", "NT AUTHORITY\\SYSTEM", "Invité"],
      reponse: 0,
      explication: "NETWORK SERVICE sert aux services qui doivent se connecter à des serveurs externes."
    },
    {
      enonce: "Comment se caractérise NT AUTHORITY\\LOCAL SERVICE ?",
      choix: [
        "Faible privilège, accès limité aux ressources locales, privilèges restreints sur le réseau",
        "Privilèges complets sur tout le système",
        "Privilèges restreints localement mais accès complet au réseau",
        "Compte interactif réservé aux administrateurs"
      ],
      reponse: 0,
      explication: "LOCAL SERVICE exécute des services système locaux avec peu de privilèges."
    },
    {
      enonce: "De quoi une ACL est-elle composée ?",
      choix: ["D'ACE", "De SID de révision", "De handles", "De jetons d'accès"],
      reponse: 0,
      explication: "Une ACL (Access Control List) contient des ACE (Access Control Entries)."
    },
    {
      enonce: "Que décrit une ACE ?",
      choix: [
        "Une règle d'accès individuelle, par exemple Lecture pour un utilisateur sur un fichier",
        "L'identité complète d'un utilisateur",
        "La liste de tous les privilèges d'un processus",
        "Le niveau d'intégrité d'un processus"
      ],
      reponse: 0,
      explication: "Chaque ACE définit les autorisations d'un utilisateur ou groupe sur un objet."
    },
    {
      enonce: "Que contient le descripteur de sécurité d'un objet ?",
      choix: ["Le SID du propriétaire", "La DACL", "La SACL", "La liste des privilèges de l'utilisateur"],
      reponse: [0, 1, 2],
      explication: "La liste des privilèges se trouve dans le jeton d'accès, pas dans le descripteur de sécurité."
    },
    {
      enonce: "Quel est le rôle de la DACL ?",
      choix: [
        "Accorder ou refuser des autorisations d'accès aux utilisateurs et groupes",
        "Définir les accès à enregistrer dans le journal de sécurité",
        "Stocker le hash des mots de passe",
        "Fixer le niveau d'intégrité de l'objet"
      ],
      reponse: 0,
      explication: "DACL = ACL discrétionnaire, qui accorde ou refuse les accès."
    },
    {
      enonce: "Quel est le rôle de la SACL ?",
      choix: [
        "Définir les types d'accès à auditer dans le journal des événements de sécurité",
        "Accorder ou refuser des autorisations d'accès",
        "Désigner le propriétaire de l'objet",
        "Chiffrer l'objet sur le disque"
      ],
      reponse: 0,
      explication: "SACL = ACL système, utilisée pour l'audit des accès."
    },
    {
      enonce: "Dans ce format d'ACE, quel champ indique à qui s'applique la règle ?",
      code: "ace_type;ace_flags;rights;object_guid;inherit_object_guid;account_sid;",
      choix: ["account_sid", "ace_type", "rights", "object_guid"],
      reponse: 0,
      explication: "account_sid désigne le compte concerné ; rights les droits, ace_type autorisation ou refus."
    },
    {
      enonce: "Quels objets peuvent porter une ACL ?",
      choix: ["Les fichiers", "Les dossiers", "Les clés de registre", "Les processus"],
      reponse: [0, 1, 2, 3],
      explication: "Les quatre sont des objets sécurisables dotés d'un descripteur de sécurité."
    },
    {
      enonce: "Que décrit un jeton d'accès (access token) ?",
      choix: [
        "Le contexte de sécurité d'un processus ou d'un thread",
        "Les autorisations stockées sur un fichier",
        "Les paramètres de l'utilisateur dans le registre",
        "La liste des services démarrés"
      ],
      reponse: 0,
      explication: "Le jeton porte l'identité et les privilèges utilisés quand le processus accède à un objet sécurisé."
    },
    {
      enonce: "Quand un jeton d'accès est-il généré ?",
      choix: ["À l'ouverture de session (logon)", "Au démarrage du BIOS", "À chaque lecture de fichier", "À l'installation de Windows"],
      reponse: 0,
      explication: "Le système génère le jeton lors du logon."
    },
    {
      enonce: "Que contient un jeton d'accès ?",
      choix: ["Le SID du propriétaire", "Les SID des groupes dont il est membre", "La liste de ses privilèges", "Le type de jeton", "Le hash NT du mot de passe"],
      reponse: [0, 1, 2, 3],
      explication: "Le hash NT est stocké dans la SAM (et en mémoire de LSASS), pas dans le jeton."
    },
    {
      enonce: "Qu'est-ce qu'un Primary Token ?",
      choix: [
        "Le jeton assigné au processus, qui définit l'identité de l'utilisateur et ses privilèges",
        "Un jeton qui permet d'agir temporairement en tant qu'un autre utilisateur",
        "Le jeton filtré d'un administrateur",
        "Un jeton réservé au compte SYSTEM"
      ],
      reponse: 0,
      explication: "Le Primary Token est le jeton principal du processus."
    },
    {
      enonce: "Que permet un Impersonation Token ?",
      choix: [
        "Agir temporairement en tant qu'un autre utilisateur",
        "Définir l'identité permanente d'un processus",
        "Chiffrer les échanges réseau d'un thread",
        "Élever un processus au niveau d'intégrité System"
      ],
      reponse: 0,
      explication: "L'emprunt d'identité est utilisé pour accéder à des ressources sécurisées, et détourné pour l'escalade de privilèges."
    },
    {
      enonce: "Quel composant génère et protège les jetons d'accès ?",
      choix: ["LSA (Local Security Authority)", "SAM", "La HAL", "Le service AppInfo"],
      reponse: 0,
      explication: "La LSA génère les jetons lors de l'authentification pour définir le contexte de sécurité."
    },
    {
      enonce: "Quelle commande affiche les privilèges du jeton courant ?",
      choix: ["whoami /priv", "whoami /user", "net localgroup", "tasklist /svc"],
      reponse: 0,
      explication: "whoami /priv liste les privilèges et leur état ; whoami /all affiche aussi utilisateur et groupes."
    },
    {
      enonce: "Qu'affiche la commande whoami /all ?",
      choix: ["Le nom et le SID de l'utilisateur", "Les groupes et leurs SID", "Les privilèges et leur état", "Le hash NT de l'utilisateur"],
      reponse: [0, 1, 2],
      explication: "whoami /all ne révèle aucun secret d'authentification."
    },
    {
      enonce: "Que permet SeDebugPrivilege ?",
      choix: [
        "Déboguer et modifier d'autres processus",
        "Sauvegarder des fichiers sans respecter les restrictions d'accès",
        "Prendre possession de n'importe quel objet",
        "Arrêter le système"
      ],
      reponse: 0,
      explication: "SeDebugPrivilege est notamment requis pour lire la mémoire de LSASS."
    },
    {
      enonce: "Quel privilège autorise la sauvegarde de fichiers sans respecter les restrictions d'accès ?",
      choix: ["SeBackupPrivilege", "SeRestorePrivilege", "SeTakeOwnershipPrivilege", "SeDebugPrivilege"],
      reponse: 0,
      explication: "SeBackupPrivilege contourne les ACL en lecture pour les sauvegardes."
    },
    {
      enonce: "Quel privilège permet de prendre le contrôle de n'importe quel objet, quel que soit son propriétaire ?",
      choix: ["SeTakeOwnershipPrivilege", "SeImpersonatePrivilege", "SeBackupPrivilege", "SeCreateTokenPrivilege"],
      reponse: 0,
      explication: "SeTakeOwnershipPrivilege sert à s'accorder des droits sur des ressources protégées."
    },
    {
      enonce: "Pourquoi SeCreateTokenPrivilege est-il rarement attribué ?",
      choix: [
        "Il permet de créer des jetons avec des privilèges élevés",
        "Il permet d'arrêter le système à distance",
        "Il désactive l'UAC",
        "Il efface le journal de sécurité"
      ],
      reponse: 0,
      explication: "Créer ses propres jetons revient à pouvoir s'attribuer n'importe quels privilèges."
    },
    {
      enonce: "Que permet SeImpersonatePrivilege ?",
      choix: [
        "Emprunter l'identité d'un client après l'authentification",
        "Créer un jeton d'accès de toutes pièces",
        "Charger et décharger des pilotes",
        "Modifier l'heure système"
      ],
      reponse: 0,
      explication: "SeImpersonatePrivilege permet d'utiliser le jeton d'un client authentifié."
    },
    {
      enonce: "Quel privilège permet d'arrêter ou de redémarrer le système ?",
      choix: ["SeShutdownPrivilege", "SeRemoteShutdownPrivilege", "SeDebugPrivilege", "SeUndockPrivilege"],
      reponse: 0,
      explication: "SeRemoteShutdownPrivilege concerne l'arrêt forcé depuis un système distant."
    },
    {
      enonce: "Quel est le principe de l'UAC ?",
      choix: [
        "Tout nouveau processus s'exécute par défaut dans le contexte d'un compte non privilégié, administrateurs compris",
        "Seuls les utilisateurs standard sont limités, les administrateurs ont toujours tous les droits",
        "Chaque fichier est chiffré avec la clé de l'utilisateur",
        "Les processus s'exécutent tous sous le compte SYSTEM"
      ],
      reponse: 0,
      explication: "La politique s'applique aux processus lancés par n'importe quel utilisateur, y compris les administrateurs."
    },
    {
      enonce: "Comment un administrateur élève-t-il ses privilèges avec l'UAC ?",
      choix: [
        "En approuvant explicitement l'exécution dans une boîte de dialogue",
        "En saisissant le hash NT de son compte",
        "En redémarrant en mode sans échec",
        "En se connectant avec le compte SYSTEM"
      ],
      reponse: 0,
      explication: "L'élévation présente une simple boîte de dialogue de consentement."
    },
    {
      enonce: "Sur quel mécanisme l'UAC s'appuie-t-il ?",
      choix: ["Mandatory Integrity Control (MIC)", "Security Account Manager (SAM)", "Discretionary ACL (DACL)", "Kerberos"],
      reponse: 0,
      explication: "Le MIC attribue un niveau d'intégrité (IL) aux utilisateurs, processus et ressources."
    },
    {
      enonce: "Quelle valeur numérique correspond au niveau d'intégrité Élevé (High) ?",
      choix: ["300", "400", "200", "100"],
      reponse: 0,
      explication: "System 400, High 300, Medium 200, Low 100, Untrusted 0."
    },
    {
      enonce: "Quelle valeur numérique correspond au niveau d'intégrité Bas (Low) ?",
      choix: ["100", "0", "200", "50"],
      reponse: 0,
      explication: "Low = 100 (World/Everyone). Untrusted = 0 (Anonymous)."
    },
    {
      enonce: "Quel niveau d'intégrité est attribué aux utilisateurs standard ?",
      choix: ["Moyen", "Bas", "Élevé", "System"],
      reponse: 0,
      explication: "Les utilisateurs standard et les jetons filtrés des administrateurs sont en IL moyen. C'est là que tourne le shell."
    },
    {
      enonce: "Quel niveau d'intégrité est typiquement utilisé pour l'interaction avec Internet (Internet Explorer) ?",
      choix: ["Bas", "Moyen", "Élevé", "Untrusted"],
      reponse: 0,
      explication: "Le niveau Bas dispose de permissions très limitées."
    },
    {
      enonce: "Quel niveau d'intégrité ont Local Service et Network Service ?",
      choix: ["Élevé (300)", "System (400)", "Moyen (200)", "Bas (100)"],
      reponse: 0,
      explication: "Local Service, Network Service et les jetons élevés sont au niveau High ; Local System est à 400."
    },
    {
      enonce: "À quelles ressources un processus de niveau d'intégrité moyen peut-il accéder ?",
      choix: ["Niveau bas", "Niveau moyen", "Niveau élevé", "Niveau System"],
      reponse: [0, 1],
      explication: "Un processus accède aux ressources de niveau égal ou inférieur au sien."
    },
    {
      enonce: "Une DACL autorise l'accès à une ressource, mais le niveau d'intégrité du processus est trop bas. Que se passe-t-il ?",
      choix: [
        "L'accès est refusé : le MIC est prioritaire sur la DACL",
        "L'accès est accordé : la DACL est prioritaire",
        "L'accès est accordé en lecture seule",
        "Une boîte UAC s'affiche automatiquement"
      ],
      reponse: 0,
      explication: "Le contrôle d'intégrité a la priorité sur les DACL."
    },
    {
      enonce: "Combien de jetons un administrateur reçoit-il à l'ouverture de session quand l'UAC est activé ?",
      choix: [
        "Deux : un jeton filtré (IL moyen) et un jeton élevé (IL élevé)",
        "Un seul jeton élevé",
        "Un seul jeton filtré",
        "Trois : bas, moyen et élevé"
      ],
      reponse: 0,
      explication: "Le jeton filtré sert aux opérations courantes, le jeton élevé aux tâches administratives."
    },
    {
      enonce: "Quel jeton reçoit un utilisateur non administrateur à l'ouverture de session ?",
      choix: ["Un jeton unique de niveau moyen", "Un jeton filtré et un jeton élevé", "Un jeton unique de niveau bas", "Un jeton unique de niveau élevé"],
      reponse: 0,
      explication: "Un seul jeton, IL moyen, pour toutes ses tâches."
    },
    {
      enonce: "Si l'UAC est désactivé, quel niveau d'intégrité utilisent les administrateurs ?",
      choix: ["Toujours élevé", "Toujours moyen", "Bas", "System"],
      reponse: 0,
      explication: "Sans UAC, tous les administrateurs utilisent en permanence un jeton de niveau élevé."
    },
    {
      enonce: "Dans quel ordre se déroule une demande « Exécuter en tant qu'administrateur » ?",
      choix: [
        "ShellExecute(\"runas\") → service AppInfo → lecture du manifeste → consent.exe sur le bureau sécurisé",
        "consent.exe → ShellExecute(\"runas\") → LSASS → manifeste",
        "Service AppInfo → LSASS → winlogon.exe → consent.exe",
        "ShellExecute(\"runas\") → LSASS → SAM → bureau sécurisé"
      ],
      reponse: 0,
      explication: "Si l'utilisateur consent, l'application s'exécute en processus élevé ; sinon elle n'est pas lancée."
    },
    {
      enonce: "Quel programme affiche la fenêtre de consentement UAC sur le bureau sécurisé ?",
      choix: ["consent.exe", "winlogon.exe", "lsass.exe", "smss.exe"],
      reponse: 0,
      explication: "Le service AppInfo lance consent.exe, qui affiche la demande sur le Secure Desktop."
    },
    {
      enonce: "Quel service traite une demande d'élévation UAC ?",
      choix: ["AppInfo", "Netlogon", "LSASS", "Windows Management Instrumentation"],
      reponse: 0,
      explication: "AppInfo reçoit l'appel ShellExecute(\"runas\"), lit le manifeste et lance consent.exe."
    },
    {
      enonce: "Que stocke la base SAM ?",
      choix: ["Les comptes utilisateurs", "Les mots de passe sous forme de hash NT", "Les groupes de comptes", "Les tickets Kerberos en cours"],
      reponse: [0, 1, 2],
      explication: "Les tickets Kerberos se trouvent dans la mémoire de LSASS."
    },
    {
      enonce: "Sous quelle forme la SAM stocke-t-elle les mots de passe ?",
      choix: ["Hash NT (MD4)", "SHA-256", "bcrypt", "En clair"],
      reponse: 0,
      explication: "Les mots de passe locaux sont stockés en hash NT, calculé avec MD4."
    },
    {
      enonce: "Où se trouve le fichier SAM sur le disque ?",
      choix: [
        "%SystemRoot%\\system32\\config\\SAM",
        "%SystemRoot%\\SAM",
        "C:\\Users\\Administrateur\\SAM",
        "%SystemRoot%\\system32\\drivers\\etc\\SAM"
      ],
      reponse: 0,
      explication: "Le fichier est dans system32\\config et est monté dans le registre."
    },
    {
      enonce: "Sur quelle branche du registre la SAM est-elle montée ?",
      choix: ["HKLM\\SAM", "HKCU\\SAM", "HKCR\\SAM", "HKU\\SAM"],
      reponse: 0,
      explication: "Elle est montée sur HKLM\\SAM (et HKLM\\SECURITY\\SAM)."
    },
    {
      enonce: "Avec quelle clé la base SAM est-elle chiffrée ?",
      choix: ["La Boot Key (SysKey)", "La clé de récupération BitLocker", "Le hash NT de l'Administrateur", "La clé publique de la puce TPM"],
      reponse: 0,
      explication: "La SAM est chiffrée avec la Boot Key, aussi appelée SysKey."
    },
    {
      enonce: "Qui peut lire la base SAM sans modifier les ACL des clés de registre ?",
      choix: [
        "Uniquement un processus avec les privilèges système (NT AUTHORITY\\SYSTEM)",
        "Tout administrateur, directement",
        "Tout utilisateur authentifié",
        "Personne, pas même le système"
      ],
      reponse: 0,
      explication: "Même un administrateur doit d'abord modifier les ACL ou passer par NT AUTHORITY\\SYSTEM."
    },
    {
      enonce: "Quels sont les rôles de la LSA (Local Security Authority) ?",
      choix: [
        "Authentifier les utilisateurs et créer leur jeton d'accès",
        "Gérer les politiques locales, SID, groupes et privilèges",
        "Contrôler les ouvertures de session",
        "Afficher la boîte de consentement UAC"
      ],
      reponse: [0, 1, 2],
      explication: "La boîte UAC est affichée par consent.exe. La LSA stocke aussi temporairement des secrets en mémoire."
    },
    {
      enonce: "Quelles DLL d'authentification sont chargées dans LSASS ?",
      choix: ["Msv1_0.dll", "Kerberos.dll", "User32.dll", "GDI32.dll"],
      reponse: [0, 1],
      explication: "Msv1_0.dll gère l'authentification NTLM locale, Kerberos.dll le protocole Kerberos."
    },
    {
      enonce: "Avec quel composant du mode noyau LSASS communique-t-il ?",
      choix: ["Security Reference Monitor", "Power Manager", "PnP Manager", "Win32k.sys"],
      reponse: 0,
      explication: "LSASS dialogue avec le Security Reference Monitor, dans l'Executive."
    },
    {
      enonce: "Pourquoi la mémoire du processus LSASS est-elle une cible pour un attaquant ?",
      choix: [
        "Elle contient du matériel d'identification : hashs, mots de passe en clair, tickets Kerberos",
        "Elle contient la clé privée du certificat racine de Microsoft",
        "Elle permet de désactiver la HAL",
        "Elle contient la table des partitions du disque"
      ],
      reponse: 0,
      explication: "Ces secrets peuvent être extraits avec des droits administratifs."
    },
    {
      enonce: "Quel outil permet d'extraire à distance les secrets stockés dans LSASS ?",
      choix: ["lsassy", "mimikatz", "Process Monitor", "TCPView"],
      reponse: 0,
      explication: "mimikatz s'utilise localement, lsassy à distance."
    },
    {
      enonce: "Quel outil utilise ces commandes ?",
      code: "privilege::debug\nsekurlsa::logonpasswords",
      choix: ["mimikatz", "lsassy", "whoami", "regedit"],
      reponse: 0,
      explication: "mimikatz active SeDebugPrivilege puis extrait les identifiants des sessions depuis LSASS."
    },
    {
      enonce: "Quel privilège la commande privilege::debug de mimikatz active-t-elle ?",
      choix: ["SeDebugPrivilege", "SeBackupPrivilege", "SeImpersonatePrivilege", "SeTcbPrivilege"],
      reponse: 0,
      explication: "SeDebugPrivilege permet d'ouvrir et de lire la mémoire d'autres processus, dont LSASS."
    },
    {
      enonce: "Quels droits faut-il pour extraire la mémoire de LSASS ?",
      choix: ["Des droits administratifs", "Ceux d'un utilisateur standard", "Ceux du compte Invité", "Aucun droit particulier"],
      reponse: 0,
      explication: "L'extraction de la mémoire de LSASS demande des droits administratifs."
    }
  ];

  /* ---------------------------------------------------------
     BANQUE 3 — Services, stockage et protection
     --------------------------------------------------------- */
  const systeme = [
    {
      enonce: "Sous quel nom les services Windows étaient-ils anciennement connus ?",
      choix: ["Services NT", "Démons", "Pilotes système", "Tâches planifiées"],
      reponse: 0,
      explication: "Les services Windows s'appelaient autrefois services NT."
    },
    {
      enonce: "Quelles sont les caractéristiques d'un service Windows ?",
      choix: [
        "C'est un exécutable de longue durée",
        "Il peut démarrer automatiquement avec l'ordinateur",
        "Il n'affiche aucune interface utilisateur",
        "Il s'exécute toujours dans la session de l'utilisateur connecté"
      ],
      reponse: [0, 1, 2],
      explication: "Les services s'exécutent dans leurs propres sessions Windows."
    },
    {
      enonce: "Quel type de démarrage lance un service seulement une fois que Windows a fini de se charger ?",
      choix: ["Automatique (début différé)", "Automatique", "Manuel", "Désactivé"],
      reponse: 0,
      explication: "Le début différé évite de ralentir le démarrage de l'ordinateur."
    },
    {
      enonce: "Que signifie le type de démarrage « Manuel » ?",
      choix: [
        "Le service est arrêté au démarrage, mais un programme peut le lancer en cas de besoin",
        "Le service démarre avec Windows",
        "Personne ne peut démarrer le service",
        "Le service démarre après le chargement complet de Windows"
      ],
      reponse: 0,
      explication: "Manuel = à l'arrêt au démarrage, démarrable à la demande."
    },
    {
      enonce: "Que signifie le type de démarrage « Désactivé » ?",
      choix: [
        "Le service est coupé et ni personne ni aucun programme ne peut le démarrer",
        "Le service est arrêté mais un programme peut le lancer",
        "Le service est suspendu jusqu'à la prochaine connexion",
        "Le service tourne sans compte associé"
      ],
      reponse: 0,
      explication: "Un service désactivé ne peut pas être démarré."
    },
    {
      enonce: "Quel est l'intérêt du démarrage « Automatique (début différé) » ?",
      choix: [
        "Éviter la lenteur au démarrage de l'ordinateur",
        "Empêcher tout programme de lancer le service",
        "Exécuter le service avec le compte SYSTEM",
        "Démarrer le service avant le noyau"
      ],
      reponse: 0,
      explication: "Le service attend que Windows ait fini de se charger."
    },
    {
      enonce: "Qu'est-ce qu'un processus Windows ?",
      choix: [
        "Une instance d'un programme en cours d'exécution",
        "Un fichier exécutable stocké sur le disque",
        "Une entrée de la base de registre",
        "Une règle du pare-feu"
      ],
      reponse: 0,
      explication: "Chaque programme qui s'exécute, application ou service, fonctionne comme un processus distinct."
    },
    {
      enonce: "Quel est le PID du processus inactif du système (Idle) ?",
      choix: ["0", "4", "1", "Aléatoire"],
      reponse: 0,
      explication: "Idle = PID 0, System = PID 4, Registry = PID aléatoire."
    },
    {
      enonce: "Quel est le PID du processus System ?",
      choix: ["4", "0", "8", "Aléatoire"],
      reponse: 0,
      explication: "Le processus System a toujours le PID 4."
    },
    {
      enonce: "Quel est le processus enfant du processus System ?",
      choix: ["smss.exe", "csrss.exe", "explorer.exe", "services.exe"],
      reponse: 0,
      explication: "System (PID 4) a pour enfant SMSS.EXE."
    },
    {
      enonce: "Quelle image est associée au processus System dans le Gestionnaire des tâches ?",
      choix: ["%SystemRoot%\\System32\\ntoskrnl.exe", "%SystemRoot%\\System32\\smss.exe", "%SystemRoot%\\System32\\svchost.exe", "%SystemRoot%\\System32\\lsass.exe"],
      reponse: 0,
      explication: "ntoskrnl.exe dans Task Manager et Process Hacker ; Process Explorer n'affiche aucune image."
    },
    {
      enonce: "Sous quel utilisateur s'exécutent les processus Idle, System et Registry ?",
      choix: ["NT AUTHORITY\\SYSTEM (S-1-5-18)", "NT AUTHORITY\\LOCAL SERVICE", "Administrateur", "NT AUTHORITY\\NETWORK SERVICE"],
      reponse: 0,
      explication: "Les trois tournent sous SYSTEM, avec une seule instance chacun."
    },
    {
      enonce: "Quel est le rôle du processus Idle ?",
      choix: [
        "Comptabiliser le temps d'inactivité du système",
        "Compresser la mémoire",
        "Stocker les données du registre",
        "Démarrer smss.exe"
      ],
      reponse: 0,
      explication: "Le processus Idle n'est pas un processus réel : il comptabilise le temps d'inactivité."
    },
    {
      enonce: "Quel est le rôle du processus Registry ?",
      choix: [
        "Stocker les données de la base de registre (HKLM, HKCU) pour améliorer les performances",
        "Afficher l'éditeur du registre",
        "Chiffrer la base SAM",
        "Journaliser les modifications de fichiers"
      ],
      reponse: 0,
      explication: "Comme la compression mémoire, il réduit l'utilisation de la mémoire et améliore les performances."
    },
    {
      enonce: "Lesquels de ces « processus » ne sont pas de vrais processus au sens de Windows ?",
      choix: ["Idle", "Registry", "smss.exe", "explorer.exe"],
      reponse: [0, 1],
      explication: "Idle et Registry sont des pseudo-processus sans image exécutable."
    },
    {
      enonce: "Quel est le PID du processus Registry ?",
      choix: ["Aléatoire", "0", "4", "8"],
      reponse: 0,
      explication: "Contrairement à Idle (0) et System (4), son PID est aléatoire."
    },
    {
      enonce: "Quand NTFS a-t-il été introduit ?",
      choix: ["En 1993, avec Windows NT 3.1", "En 1995, avec Windows 95", "En 2001, avec Windows XP", "En 1981, avec MS-DOS"],
      reponse: 0,
      explication: "NTFS apparaît en 1993 dans Windows NT 3.1."
    },
    {
      enonce: "Quel système de fichiers NTFS a-t-il remplacé ?",
      choix: ["FAT (File Allocation Table)", "ext2", "HFS", "UFS"],
      reponse: 0,
      explication: "NTFS remplace FAT avec des améliorations de sécurité, de performances et de fiabilité."
    },
    {
      enonce: "Quels sont les avantages de NTFS ?",
      choix: [
        "La compression des fichiers",
        "Les autorisations sur les fichiers et dossiers",
        "Les quotas de disque",
        "La journalisation du système de fichiers",
        "La compatibilité native avec MS-DOS"
      ],
      reponse: [0, 1, 2, 3],
      explication: "NTFS n'est pas lisible nativement par MS-DOS, qui utilise FAT."
    },
    {
      enonce: "Quelle taille peuvent avoir les clusters NTFS ?",
      choix: ["De 512 octets à 64 Ko", "Toujours 4 Ko", "De 1 Ko à 1 Mo", "De 512 Ko à 64 Mo"],
      reponse: 0,
      explication: "La taille des clusters influence l'espace réellement utilisé sur le disque."
    },
    {
      enonce: "Qu'est-ce qu'un cluster ?",
      choix: [
        "Une unité de stockage de taille uniforme dans laquelle un fichier est enregistré",
        "Une partition du disque",
        "Une entrée de la MFT",
        "Un flux de données alternatif"
      ],
      reponse: 0,
      explication: "Un fichier peut être divisé et enregistré dans un ou plusieurs clusters."
    },
    {
      enonce: "Que centralise la MFT (Master File Table) ?",
      choix: ["Les métadonnées des fichiers", "Les hashs des mots de passe", "Les clés de registre", "Les règles du pare-feu"],
      reponse: 0,
      explication: "La MFT centralise les métadonnées de chaque fichier et dossier NTFS."
    },
    {
      enonce: "Que contient l'entrée 0 de la MFT ?",
      choix: ["La MFT elle-même", "Une copie partielle de la MFT", "Le premier fichier utilisateur", "Le journal USN"],
      reponse: 0,
      explication: "Entrée 0 = MFT, entrée 1 = copie partielle (miroir), à partir de 16 = fichiers et dossiers utilisateur."
    },
    {
      enonce: "À partir de quelle entrée de la MFT trouve-t-on les fichiers et dossiers utilisateur ?",
      choix: ["16", "0", "2", "1024"],
      reponse: 0,
      explication: "Les entrées 0 à 15 sont réservées aux fichiers de métadonnées NTFS."
    },
    {
      enonce: "Que contient l'entrée 1 de la MFT ?",
      choix: ["Une copie partielle de la MFT (MFT Mirror)", "La MFT elle-même", "Le bitmap des clusters", "Les fichiers utilisateur"],
      reponse: 0,
      explication: "Le miroir de la MFT permet de restaurer ses premières entrées en cas de corruption."
    },
    {
      enonce: "À quoi sert le journal USN en investigation numérique ?",
      choix: [
        "Il enregistre les changements sur les fichiers, ce qui aide à reconstruire une chronologie",
        "Il stocke les mots de passe des utilisateurs",
        "Il liste les connexions TCP établies",
        "Il contient les règles d'audit des objets"
      ],
      reponse: 0,
      explication: "Avec la MFT, il permet de retracer l'activité, même après suppression d'un fichier."
    },
    {
      enonce: "Pourquoi les Alternate Data Streams (ADS) intéressent-ils un attaquant ?",
      choix: [
        "Ils permettent de dissimuler du contenu aux outils qui n'examinent que le flux principal",
        "Ils permettent de contourner l'UAC",
        "Ils désactivent la journalisation NTFS",
        "Ils donnent accès à la mémoire de LSASS"
      ],
      reponse: 0,
      explication: "NTFS autorise plusieurs flux par fichier ; cette fonctionnalité légitime peut être détournée."
    },
    {
      enonce: "Sur NTFS, quel élément permet de journaliser les tentatives d'accès à un fichier sensible ?",
      choix: ["La SACL", "La DACL", "La MFT", "Un ADS"],
      reponse: 0,
      explication: "Les SACL demandent la journalisation des accès, réussis ou échoués."
    },
    {
      enonce: "Qu'est-ce que la base de registre ?",
      choix: [
        "Une base de données hiérarchique qui stocke informations et paramètres du système",
        "Un journal des fichiers modifiés",
        "Le fichier qui contient le noyau",
        "La liste des processus en cours"
      ],
      reponse: 0,
      explication: "Elle contient les configurations du système, des logiciels, des périphériques et des utilisateurs."
    },
    {
      enonce: "Quelles sont les fonctions de la base de registre ?",
      choix: [
        "Stocker les configurations du système et des logiciels",
        "Gérer les paramètres des utilisateurs",
        "Suivre les périphériques matériels et les pilotes",
        "Démarrer les services et contrôler l'exécution des programmes",
        "Exécuter les appels système"
      ],
      reponse: [0, 1, 2, 3],
      explication: "Les appels système sont traités par le noyau."
    },
    {
      enonce: "Dans le registre, quel élément est l'équivalent d'un dossier ?",
      choix: ["La clé", "La valeur", "La donnée", "Le type"],
      reponse: 0,
      explication: "Clés = dossiers, sous-clés = dossiers imbriqués, valeurs = données stockées dans une clé."
    },
    {
      enonce: "Qu'est-ce qu'une valeur dans la base de registre ?",
      choix: [
        "Une donnée stockée dans une clé (chaîne, nombre…)",
        "Un dossier imbriqué dans une clé",
        "Une clé racine",
        "Un fichier de ruche sur le disque"
      ],
      reponse: 0,
      explication: "Une valeur porte un nom, un type (REG_SZ, REG_BINARY…) et des données."
    },
    {
      enonce: "Que contient HKEY_LOCAL_MACHINE (HKLM) ?",
      choix: [
        "La configuration matérielle et logicielle globale",
        "Les paramètres de l'utilisateur connecté",
        "Les associations de fichiers et objets COM",
        "La configuration matérielle en cours uniquement"
      ],
      reponse: 0,
      explication: "HKLM porte la configuration globale de la machine."
    },
    {
      enonce: "Que contient HKEY_CURRENT_USER (HKCU) ?",
      choix: [
        "Les paramètres de l'utilisateur actuellement connecté",
        "Les paramètres de tous les utilisateurs",
        "La configuration globale de la machine",
        "La base SAM"
      ],
      reponse: 0,
      explication: "HKU contient les paramètres de tous les utilisateurs du système."
    },
    {
      enonce: "Quelle clé racine gère l'association des fichiers et les objets COM ?",
      choix: ["HKEY_CLASSES_ROOT", "HKEY_LOCAL_MACHINE", "HKEY_CURRENT_CONFIG", "HKEY_USERS"],
      reponse: 0,
      explication: "HKCR = associations de fichiers et objets COM."
    },
    {
      enonce: "Quelle clé racine contient les paramètres de tous les utilisateurs du système ?",
      choix: ["HKEY_USERS", "HKEY_CURRENT_USER", "HKEY_LOCAL_MACHINE", "HKEY_CLASSES_ROOT"],
      reponse: 0,
      explication: "HKU regroupe tous les profils ; HKCU ne concerne que l'utilisateur connecté."
    },
    {
      enonce: "Quelle clé racine contient les informations sur la configuration matérielle en cours ?",
      choix: ["HKEY_CURRENT_CONFIG", "HKEY_LOCAL_MACHINE", "HKEY_USERS", "HKEY_CLASSES_ROOT"],
      reponse: 0,
      explication: "HKCC = configuration matérielle en cours."
    },
    {
      enonce: "Combien de clés racines principales compte la base de registre ?",
      choix: ["5", "3", "4", "7"],
      reponse: 0,
      explication: "HKLM, HKCU, HKCR, HKU et HKCC."
    },
    {
      enonce: "Quel exécutable ouvre l'éditeur du registre ?",
      choix: ["regedit.exe", "msconfig.exe", "services.msc", "taskmgr.exe"],
      reponse: 0,
      explication: "regedit.exe est l'éditeur du registre."
    },
    {
      enonce: "La variable TEMP contient cette donnée. Quel type de valeur permet de développer la variable d'environnement ?",
      code: "%USERPROFILE%\\AppData\\Local\\Temp",
      choix: ["REG_EXPAND_SZ", "REG_BINARY", "REG_DWORD", "REG_MULTI_SZ"],
      reponse: 0,
      explication: "REG_EXPAND_SZ est une chaîne dont les variables %…% sont développées ; REG_SZ est une chaîne simple."
    },
    {
      enonce: "À quoi sert Process Explorer ?",
      choix: [
        "Surveiller les processus et leurs attributs",
        "Afficher les connexions TCP et UDP par état",
        "Modifier la base de registre",
        "Extraire les secrets de LSASS"
      ],
      reponse: 0,
      explication: "Process Explorer est l'outil Sysinternals de surveillance des processus."
    },
    {
      enonce: "Quelles activités Process Monitor suit-il en temps réel ?",
      choix: ["Le système de fichiers", "Le registre", "Les processus et threads", "Le filtrage des états TCP"],
      reponse: [0, 1, 2],
      explication: "Le filtre des états de connexion TCP est une fonction de TCPView."
    },
    {
      enonce: "Qu'est-ce qui est indispensable pour utiliser Process Monitor efficacement ?",
      choix: [
        "Configurer correctement le filtre",
        "Désactiver l'UAC",
        "Lancer l'outil sous le compte SYSTEM",
        "Vider le journal USN"
      ],
      reponse: 0,
      explication: "Sans filtre, le volume d'événements capturés est ingérable."
    },
    {
      enonce: "Quel est l'effet de ce filtre dans Process Monitor ?",
      code: "PID  is  3888  then  Include",
      choix: [
        "Afficher uniquement les événements du processus 3888",
        "Masquer les événements du processus 3888",
        "Arrêter le processus 3888",
        "Limiter la capture à 3888 événements"
      ],
      reponse: 0,
      explication: "Include garde les événements correspondants ; un filtre Process Name is notepad.exe aurait le même rôle."
    },
    {
      enonce: "Quel raccourci démarre ou arrête la capture d'événements dans Process Monitor ?",
      choix: ["Ctrl+E", "Ctrl+S", "Ctrl+O", "Ctrl+F"],
      reponse: 0,
      explication: "File > Capture Events, raccourci Ctrl+E."
    },
    {
      enonce: "Dans TCPView, que fait un clic sur le drapeau vert ?",
      choix: [
        "Il ouvre le filtre des états de connexion à afficher",
        "Il lance la capture des paquets",
        "Il ferme toutes les connexions établies",
        "Il exporte la liste au format CSV"
      ],
      reponse: 0,
      explication: "Le filtre des états concerne surtout TCP."
    },
    {
      enonce: "Pourquoi le filtre des états de TCPView concerne-t-il surtout TCP ?",
      choix: [
        "UDP n'a pas d'états de connexion",
        "UDP est chiffré",
        "UDP n'est pas pris en charge par TCPView",
        "TCP n'utilise que le port 80"
      ],
      reponse: 0,
      explication: "UDP est sans connexion : il n'y a ni LISTEN ni ESTABLISHED à filtrer."
    },
    {
      enonce: "Dans TCPView, quel état indique un port en attente de connexions entrantes ?",
      choix: ["LISTEN", "ESTABLISHED", "TIME WAIT", "SYN SENT"],
      reponse: 0,
      explication: "LISTEN = en écoute ; ESTABLISHED = connexion établie."
    },
    {
      enonce: "Comment filtrer TCPView pour n'afficher que certains protocoles ?",
      choix: [
        "En activant ou désactivant TCP v4, TCP v6, UDP v4 et UDP v6 dans la barre d'outils",
        "En écrivant une requête WMI",
        "En modifiant HKLM\\SYSTEM",
        "En utilisant le drapeau vert"
      ],
      reponse: 0,
      explication: "Les boutons de protocole filtrent par protocole, le drapeau vert par état."
    },
    {
      enonce: "Quand le profil « réseau de domaine » du pare-feu est-il appliqué ?",
      choix: [
        "Automatiquement, quand un appareil joint à un domaine détecte un contrôleur de domaine",
        "Quand un administrateur le choisit manuellement",
        "Sur tout réseau Wi-Fi public",
        "Sur un réseau domestique"
      ],
      reponse: 0,
      explication: "Ce profil ne peut pas être défini manuellement."
    },
    {
      enonce: "Quel profil de pare-feu s'applique par défaut aux réseaux non identifiés ?",
      choix: ["Réseau public", "Réseau privé", "Réseau de domaine", "Aucun profil"],
      reponse: 0,
      explication: "Le profil public, pensé pour la sécurité, est le profil par défaut."
    },
    {
      enonce: "Quel profil de pare-feu est conçu pour un réseau domestique ?",
      choix: ["Réseau privé", "Réseau public", "Réseau de domaine", "Réseau invité"],
      reponse: 0,
      explication: "Le profil privé peut être défini manuellement par un administrateur."
    },
    {
      enonce: "Quel profil de pare-feu ne peut pas être défini manuellement ?",
      choix: ["Réseau de domaine", "Réseau privé", "Réseau public", "Tous peuvent l'être"],
      reponse: 0,
      explication: "Le profil de domaine s'applique seul dès qu'un contrôleur de domaine est joignable."
    },
    {
      enonce: "Quel profil de pare-feu convient à un point d'accès Wi-Fi d'aéroport ou d'hôtel ?",
      choix: ["Réseau public", "Réseau privé", "Réseau de domaine", "Réseau local"],
      reponse: 0,
      explication: "Le profil public applique une sécurité renforcée."
    },
    {
      enonce: "Quelles techniques les antivirus utilisent-ils pour détecter les virus ?",
      choix: ["La détection par signature", "La détection par comportement", "Le chiffrement des fichiers", "La sauvegarde automatique"],
      reponse: [0, 1],
      explication: "Signature (malwares connus) et comportement (EDR)."
    },
    {
      enonce: "Qu'est-ce qu'une signature pour un antivirus ?",
      choix: [
        "Un ensemble unique de données ou de caractéristiques d'un virus, comme un hash ou un motif de code",
        "Le certificat numérique de l'éditeur de l'antivirus",
        "La liste des processus autorisés",
        "Une règle du pare-feu"
      ],
      reponse: 0,
      explication: "L'antivirus compare le contenu des fichiers aux définitions de son dictionnaire."
    },
    {
      enonce: "Quelle est la limite principale de la détection par signature ?",
      choix: [
        "Un malware absent de la base de signatures n'est pas détecté",
        "Elle génère beaucoup de fausses alertes",
        "Elle bloque tous les programmes inconnus",
        "Elle ne fonctionne que sur les réseaux de domaine"
      ],
      reponse: 0,
      explication: "Les nouveaux virus non encore référencés passent au travers."
    },
    {
      enonce: "Que signifie EDR ?",
      choix: ["Endpoint Detection and Response", "Extended Defense Registry", "Endpoint Data Recovery", "Event Detection and Reporting"],
      reponse: 0,
      explication: "L'EDR détecte les comportements suspects puis passe à la phase de réponse ou remédiation."
    },
    {
      enonce: "Quel est l'avantage de la détection par comportement ?",
      choix: [
        "Elle peut protéger contre des malwares zero-day",
        "Elle ne produit jamais de fausses alertes",
        "Elle consomme très peu de ressources",
        "Elle n'a pas besoin de mises à jour"
      ],
      reponse: 0,
      explication: "Elle repose sur des algorithmes heuristiques et du machine learning, pas sur une base de malwares connus."
    },
    {
      enonce: "Quels sont les inconvénients de la détection par comportement ?",
      choix: [
        "Elle peut créer de fausses alertes",
        "Elle est gourmande en ressources",
        "Elle ne détecte que les malwares connus",
        "Elle impose une base de hashs à jour"
      ],
      reponse: [0, 1],
      explication: "Ne détecter que les malwares connus est la limite de la détection par signature."
    },
    {
      enonce: "Un programme tente d'écrire des données dans un fichier exécutable et est marqué comme virus. Quelle détection est à l'œuvre ?",
      choix: ["La détection par comportement", "La détection par signature", "Le pare-feu Windows", "L'UAC"],
      reponse: 0,
      explication: "C'est un comportement suspect, repéré sans signature."
    },
    {
      enonce: "Sous quelle forme Windows Defender était-il inclus dans Windows Vista et Windows 7 ?",
      choix: ["Un composant anti-espion intégré", "Un pare-feu réseau", "Un EDR complet", "Un gestionnaire de mots de passe"],
      reponse: 0,
      explication: "Defender était d'abord un anti-espion intégré."
    },
    {
      enonce: "Comment Microsoft Defender met-il à jour ses définitions de menaces ?",
      choix: [
        "Automatiquement, en temps réel, via le cloud Microsoft",
        "Uniquement lors des mises à jour semestrielles de Windows",
        "Manuellement, par téléchargement d'un fichier",
        "Via une requête WMI planifiée"
      ],
      reponse: 0,
      explication: "La base est mise à jour en temps réel depuis le cloud Microsoft."
    },
    {
      enonce: "Qu'est-ce qui a changé pour Windows Defender à partir de Windows 10 ?",
      choix: [
        "Sa boîte de dialogue Paramètres a été remplacée par une page dédiée dans l'application Paramètres",
        "Il a été supprimé au profit d'antivirus tiers",
        "Il ne protège plus qu'en mode hors ligne",
        "Il est devenu payant"
      ],
      reponse: 0,
      explication: "Microsoft a déplacé son contrôle hors du logiciel d'origine."
    },
    {
      enonce: "Contre quelles menaces Microsoft Defender offre-t-il une protection en temps réel ?",
      choix: ["Virus", "Spywares", "Rootkits", "Ransomwares"],
      reponse: [0, 1, 2, 3],
      explication: "Virus, spywares, rootkits, chevaux de Troie et ransomwares."
    }
  ];

  CONTENU["systeme-windows"] = {
    chapitres: [
      {
        id: "systeme-windows",
        titre: "Système Windows",
        description: "Historique et architecture, comptes et contrôle d'accès, services, stockage et protection.",
        exercices: [
          {
            type: "qcm",
            id: "win-archi-qcm",
            titre: "QCM — Historique et architecture",
            description: "De MS-DOS à Windows 12, HAL, appels système, objets, Win32, COM et WMI.",
            tirage: 15,
            melangerChoix: true,
            questions: architecture
          },
          {
            type: "jetpunk",
            id: "win-versions",
            titre: "Quelle version de Windows ?",
            consigne: "Retrouvez la version décrite sur chaque tuile.",
            temps: 180,
            colonnes: 3,
            melanger: true,
            items: [
              { indice: "1981 : 16 bits, en ligne de commande, développé pour IBM", reponse: "MS-DOS", alt: ["DOS"] },
              { indice: "24 août 1995 : système à part entière, qui s'appuie encore sur MS-DOS", reponse: "Windows 95", alt: ["95"] },
              { indice: "1998 : FAT32, USB et bus AGP en natif", reponse: "Windows 98", alt: ["98"] },
              { indice: "1993 : entièrement 32 bits, pour les professionnels, arrivée de NTFS", reponse: "Windows NT", alt: ["NT"] },
              { indice: "17 février 2000 : succède à NT 4.0, USB et FireWire", reponse: "Windows 2000", alt: ["2000"] },
              { indice: "Octobre 2001 : convergence 9x et NT, noyau NT 5.1", reponse: "Windows XP", alt: ["XP"] },
              { indice: "2007 : interface Aero, arrivée de l'UAC et de BitLocker", reponse: "Windows Vista", alt: ["Vista"] },
              { indice: "2009 : jumelage de fenêtres, noyau NT 6.1", reponse: "Windows 7", alt: ["7"] },
              { indice: "2012 : menu Démarrer en tuiles, interface Metro", reponse: "Windows 8", alt: ["8"] },
              { indice: "2015 : Cortana, bureaux virtuels, Windows as a Service", reponse: "Windows 10", alt: ["10"] },
              { indice: "2021 : barre des tâches centrée, Snap Layouts, TPM 2.0", reponse: "Windows 11", alt: ["11"] },
              { indice: "Copilot permanent, NPU requise, barre des tâches flottante", reponse: "Windows 12", alt: ["12"] }
            ]
          },
          {
            type: "qcm",
            id: "win-secu-qcm",
            titre: "QCM — Identités et contrôle d'accès",
            description: "SID et RID, DACL et SACL, jetons, privilèges, niveaux d'intégrité, SAM et LSASS.",
            tirage: 15,
            melangerChoix: true,
            questions: securite
          },
          {
            type: "jetpunk",
            id: "win-sid",
            titre: "Qui se cache derrière ce SID ?",
            consigne: "Donnez le compte, le groupe ou le niveau associé à chaque identifiant.",
            temps: 180,
            colonnes: 3,
            melanger: true,
            tirage: 12,
            items: [
              { indice: "S-1-1-0", reponse: "Everyone", alt: ["Tout le monde"] },
              { indice: "S-1-5-18", reponse: "SYSTEM", alt: ["LocalSystem"] },
              { indice: "S-1-5-19", reponse: "LocalService" },
              { indice: "S-1-5-20", reponse: "NetworkService" },
              { indice: "S-1-5-7", reponse: "Anonymous Logon", alt: ["Anonymous", "Anonyme"] },
              { indice: "S-1-5-4", reponse: "Interactive", alt: ["Interactif"] },
              { indice: "S-1-5-3", reponse: "Batch" },
              { indice: "S-1-5-6", reponse: "Service" },
              { indice: "S-1-5", reponse: "NT Authority", alt: ["Autorité NT"] },
              { indice: "S-1-3", reponse: "Creator Authority" },
              { indice: "S-1-5-9", reponse: "Enterprise Domain Controllers", alt: ["Contrôleurs de domaine"] },
              { indice: "S-1-5-11", reponse: "Utilisateurs authentifiés", alt: ["Authenticated Users"] },
              { indice: "RID 500", reponse: "Administrateur", alt: ["Administrator"] },
              { indice: "RID 501", reponse: "Invité", alt: ["Guest"] },
              { indice: "RID 512 d'un domaine", reponse: "Admins du domaine", alt: ["Domain Admins"] },
              { indice: "Niveau d'intégrité 300", reponse: "Élevé", alt: ["High"] },
              { indice: "Niveau d'intégrité 200", reponse: "Moyen", alt: ["Medium"] },
              { indice: "Niveau d'intégrité 100", reponse: "Bas", alt: ["Low"] },
              { indice: "Niveau d'intégrité 0", reponse: "Untrusted", alt: ["Non fiable"] }
            ]
          },
          {
            type: "jetpunk",
            id: "win-privileges",
            titre: "Quel privilège ?",
            consigne: "Nommez le privilège décrit, par exemple SeDebugPrivilege ou simplement Debug.",
            temps: 180,
            colonnes: 2,
            melanger: true,
            tirage: 10,
            items: [
              { indice: "Déboguer et modifier d'autres processus", reponse: "SeDebugPrivilege", alt: ["SeDebug", "Debug"] },
              { indice: "Arrêter ou redémarrer le système", reponse: "SeShutdownPrivilege", alt: ["SeShutdown", "Shutdown"] },
              { indice: "Sauvegarder des fichiers sans respecter les restrictions d'accès", reponse: "SeBackupPrivilege", alt: ["SeBackup", "Backup"] },
              { indice: "Restaurer les fichiers et les répertoires", reponse: "SeRestorePrivilege", alt: ["SeRestore", "Restore"] },
              { indice: "Créer un jeton d'accès", reponse: "SeCreateTokenPrivilege", alt: ["SeCreateToken", "CreateToken"] },
              { indice: "Prendre possession de n'importe quel objet", reponse: "SeTakeOwnershipPrivilege", alt: ["SeTakeOwnership", "TakeOwnership"] },
              { indice: "Emprunter l'identité d'un client après l'authentification", reponse: "SeImpersonatePrivilege", alt: ["SeImpersonate", "Impersonate"] },
              { indice: "Charger et décharger les pilotes de périphériques", reponse: "SeLoadDriverPrivilege", alt: ["SeLoadDriver", "LoadDriver"] },
              { indice: "Modifier l'heure système", reponse: "SeSystemtimePrivilege", alt: ["SeSystemtime", "Systemtime"] },
              { indice: "Changer le fuseau horaire", reponse: "SeTimeZonePrivilege", alt: ["SeTimeZone", "TimeZone"] },
              { indice: "Contourner la vérification de parcours", reponse: "SeChangeNotifyPrivilege", alt: ["SeChangeNotify", "ChangeNotify"] },
              { indice: "Gérer le journal d'audit et de sécurité", reponse: "SeSecurityPrivilege", alt: ["SeSecurity", "Security"] },
              { indice: "Ajouter des stations de travail au domaine", reponse: "SeMachineAccountPrivilege", alt: ["SeMachineAccount", "MachineAccount"] },
              { indice: "Créer des liens symboliques", reponse: "SeCreateSymbolicLinkPrivilege", alt: ["SeCreateSymbolicLink", "CreateSymbolicLink"] },
              { indice: "Forcer l'arrêt à partir d'un système distant", reponse: "SeRemoteShutdownPrivilege", alt: ["SeRemoteShutdown", "RemoteShutdown"] },
              { indice: "Créer des objets globaux", reponse: "SeCreateGlobalPrivilege", alt: ["SeCreateGlobal", "CreateGlobal"] }
            ]
          },
          {
            type: "qcm",
            id: "win-systeme-qcm",
            titre: "QCM — Services, stockage et protection",
            description: "Types de démarrage, processus système, MFT, clés racines, ProcMon, TCPView, profils de pare-feu et EDR.",
            tirage: 15,
            melangerChoix: true,
            questions: systeme
          },
          {
            type: "jetpunk",
            id: "win-sigles",
            titre: "Sigles du cours",
            consigne: "Donnez le sigle ou le nom correspondant à chaque définition.",
            temps: 180,
            colonnes: 3,
            melanger: true,
            tirage: 15,
            items: [
              { indice: "Couche qui isole le noyau des spécificités matérielles", reponse: "HAL" },
              { indice: "Identifiant unique d'un utilisateur, groupe ou ordinateur", reponse: "SID" },
              { indice: "Partie finale d'un SID, 500 pour l'Administrateur", reponse: "RID" },
              { indice: "Liste d'entrées qui limite l'accès à un objet", reponse: "ACL" },
              { indice: "Entrée individuelle d'une liste de contrôle d'accès", reponse: "ACE" },
              { indice: "Liste qui accorde ou refuse les autorisations", reponse: "DACL" },
              { indice: "Liste qui définit les accès à auditer", reponse: "SACL" },
              { indice: "Base stockant les comptes locaux et leurs hashs NT", reponse: "SAM" },
              { indice: "Processus dont la mémoire contient hashs et tickets Kerberos", reponse: "LSASS" },
              { indice: "Boîte de confirmation avant l'élévation de privilèges", reponse: "UAC" },
              { indice: "Mécanisme de niveaux d'intégrité utilisé par l'UAC", reponse: "MIC" },
              { indice: "Table qui centralise les métadonnées des fichiers NTFS", reponse: "MFT" },
              { indice: "Journal NTFS des changements de fichiers", reponse: "USN" },
              { indice: "Flux de données multiples d'un même fichier NTFS", reponse: "ADS" },
              { indice: "Système de fichiers remplacé par NTFS", reponse: "FAT" },
              { indice: "Modèle de composants binaires qui communiquent entre langages", reponse: "COM" },
              { indice: "Instrumentation pour interroger et gérer un système Windows", reponse: "WMI" },
              { indice: "Documents composés, comme un tableau Excel dans Word", reponse: "OLE" },
              { indice: "Clé racine : configuration globale de la machine", reponse: "HKLM" },
              { indice: "Clé racine : utilisateur actuellement connecté", reponse: "HKCU" },
              { indice: "Clé racine : associations de fichiers et objets COM", reponse: "HKCR" },
              { indice: "Clé racine : tous les utilisateurs du système", reponse: "HKU" },
              { indice: "Clé racine : configuration matérielle en cours", reponse: "HKCC" },
              { indice: "Antivirus comportemental avec phase de réponse", reponse: "EDR" },
              { indice: "Puce de sécurité exigée par Windows 11", reponse: "TPM" },
              { indice: "Unité de traitement pour l'IA attendue avec Windows 12", reponse: "NPU" },
              { indice: "API compatible avec les systèmes Unix", reponse: "POSIX" },
              { indice: "Chiffrement de disque arrivé avec Vista", reponse: "BitLocker" }
            ]
          },
          {
            type: "qcm",
            id: "win-examen",
            titre: "Examen blanc — Fondamentaux",
            description: "Architecture, sécurité, stockage et protection réunis.",
            tirage: 20,
            melangerChoix: true,
            questions: architecture.concat(securite, systeme)
          }
        ]
      }
    ]
  };

})();
