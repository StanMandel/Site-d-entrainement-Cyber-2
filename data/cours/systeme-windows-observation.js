/* =============================================================
   Windows — Chapitre « Observation du système (TP1) »
   -------------------------------------------------------------
   Complète le cours « systeme-windows » (déjà déclaré par
   data/cours/systeme-windows.js). S'appuie sur le premier cours
   et le premier TP (« Installation, observation et journalisation
   d'un système Windows ») :
     - une « Fiche technique » des commandes d'observation ;
     - un chapitre progressif : QCM avec mini-cours et exemples,
       deux jeux de rapidité, et un terminal qui rejoue les
       commandes du TP1.

   But pédagogique : comprendre chaque élément du premier TP
   (processus, jetons, ProcMon, TCPView, Autoruns, Sysmon) et
   les attaques évoquées dans le cours (vol d'identifiants en
   mémoire LSASS, abus de privilèges et de jetons).
   ============================================================= */

(function () {

  /* =========================================================
     BANQUE 1 — Processus, threads, handles et DLL
     (Parties 3 et 4 du TP : Process Explorer)
     ========================================================= */
  const processus = [
    {
      enonce: "Que désigne le PID d'un processus ?",
      choix: [
        "Son identifiant numérique unique tant qu'il s'exécute",
        "Le nom de son fichier exécutable",
        "Le compte sous lequel il tourne",
        "Son niveau d'intégrité"
      ],
      reponse: 0,
      explication: "Le PID (Process IDentifier) est un numéro unique attribué au processus pendant sa vie ; il est réattribué à un autre processus après sa fin."
    },
    {
      enonce: "Que représente le PPID affiché par Process Explorer ?",
      choix: [
        "Le PID du processus parent, celui qui a créé le processus",
        "Le PID du premier thread",
        "Le PID du processus System",
        "Un deuxième identifiant de secours"
      ],
      reponse: 0,
      explication: "Le PPID (Parent PID) relie un processus à celui qui l'a lancé. Lancer le Bloc-notes depuis cmd.exe donne à notepad.exe le PID de cmd.exe comme PPID."
    },
    {
      enonce: "Dans le TP, vous lancez notepad.exe depuis cmd.exe. Quelle relation Process Explorer montre-t-il ?",
      choix: [
        "cmd.exe est le parent de notepad.exe",
        "notepad.exe est le parent de cmd.exe",
        "Les deux ont le même PID",
        "notepad.exe n'a pas de parent"
      ],
      reponse: 0,
      explication: "L'arbre des processus (Show Process Tree) place notepad.exe sous cmd.exe : la console est le parent du Bloc-notes."
    },
    {
      enonce: "Vous fermez le Bloc-notes puis le relancez. Que constate-t-on sur le PID ?",
      choix: [
        "Il change : le PID n'est pas un identifiant durable",
        "Il reste identique à vie",
        "Il devient toujours 0",
        "Il est partagé avec cmd.exe"
      ],
      reponse: 0,
      explication: "Un nouveau processus reçoit un nouveau PID. Le PID seul ne permet donc pas de suivre un programme dans le temps : c'est pour cela que Sysmon ajoute le ProcessGuid."
    },
    {
      enonce: "Qu'est-ce qu'un thread ?",
      choix: [
        "Une unité d'exécution à l'intérieur d'un processus",
        "Un fichier ouvert par le processus",
        "Une bibliothèque chargée en mémoire",
        "Une connexion réseau du processus"
      ],
      reponse: 0,
      explication: "Un processus contient un ou plusieurs threads ; chaque thread est un fil d'exécution qui partage la mémoire du processus."
    },
    {
      enonce: "Qu'est-ce qu'un handle dans Process Explorer ?",
      choix: [
        "Une référence vers une ressource ouverte par le processus (fichier, clé de registre, objet)",
        "Le nom du processus parent",
        "Une adresse IP distante",
        "Le hash de l'exécutable"
      ],
      reponse: 0,
      explication: "Un handle est un « ticket » que Windows remet au processus pour manipuler une ressource : un fichier, une clé de Registre, un mutex, etc."
    },
    {
      enonce: "Qu'est-ce qu'une DLL visible dans le volet inférieur de Process Explorer ?",
      choix: [
        "Une bibliothèque de code chargée en mémoire par le processus",
        "Un thread en pause",
        "Un handle vers un fichier texte",
        "Une règle de pare-feu"
      ],
      reponse: 0,
      explication: "Le volet « DLLs » liste les bibliothèques (code et données réutilisables) chargées dans l'espace mémoire du processus."
    },
    {
      enonce: "Pour quelle raison ne doit-on jamais faire « Kill Process » sur csrss.exe ?",
      choix: [
        "C'est un processus système critique : l'arrêter plante Windows",
        "Il appartient à l'utilisateur et se relance seul",
        "Il est protégé par l'antivirus et ne peut pas être tué",
        "Il n'a aucune conséquence, c'est un simple test"
      ],
      reponse: 0,
      explication: "csrss.exe est un processus système essentiel. Le terminer provoque un arrêt brutal du système. On teste Kill Process sur une seconde instance du Bloc-notes, jamais sur un processus système."
    },
    {
      enonce: "La colonne « Verified Signer » de Process Explorer indique quoi ?",
      choix: [
        "Si l'exécutable est signé par un éditeur dont le certificat est vérifié",
        "Le nombre de threads du processus",
        "La quantité de mémoire utilisée",
        "Le PID du parent"
      ],
      reponse: 0,
      explication: "« Verified Signer » affiche l'éditeur ayant signé le binaire (par ex. « Microsoft Windows »). Un binaire non signé n'est pas forcément malveillant, mais c'est un élément de contexte."
    },
    {
      enonce: "Dans le TP, pourquoi un score VirusTotal nul ne prouve-t-il pas qu'un fichier est sûr ?",
      choix: [
        "Un code récent ou ciblé peut n'être détecté par aucun moteur",
        "VirusTotal ne scanne jamais les .exe",
        "Un score nul signifie toujours que le fichier est chiffré",
        "VirusTotal renvoie toujours zéro pour Windows"
      ],
      reponse: 0,
      explication: "L'absence de détection peut simplement signifier que la menace est inconnue des moteurs. À l'inverse, une détection isolée peut être un faux positif : on croise toujours plusieurs indices."
    },
    {
      enonce: "Classez du plus petit au plus grand : handle, thread, processus.",
      choix: [
        "Un processus contient des threads ; un thread (ou le processus) détient des handles",
        "Un handle contient des threads qui contiennent des processus",
        "Un thread contient des processus qui contiennent des handles",
        "Les trois sont des synonymes"
      ],
      reponse: 0,
      explication: "Le processus est l'enveloppe (mémoire, handles, DLL) ; il exécute un ou plusieurs threads. Les handles référencent les ressources ouvertes."
    }
  ];

  /* =========================================================
     BANQUE 2 — Jetons, SID, groupes et privilèges
     (Partie 3 du TP + attaques évoquées dans le cours :
      LSASS/mimikatz, abus de jetons et de privilèges)
     ========================================================= */
  const identites = [
    {
      enonce: "Qu'est-ce qu'un SID sous Windows ?",
      choix: [
        "L'identifiant unique d'un compte, d'un groupe ou d'un ordinateur",
        "Le mot de passe haché d'un utilisateur",
        "Le numéro de série de la licence Windows",
        "Un identifiant de session réseau temporaire"
      ],
      reponse: 0,
      explication: "Le SID (Security IDentifier) identifie de façon unique un « principal » (compte, groupe, machine). whoami /user affiche celui de votre compte."
    },
    {
      enonce: "Quelle commande affiche le SID de votre compte ?",
      choix: ["whoami /user", "whoami /priv", "whoami /groups", "hostname"],
      reponse: 0,
      explication: "whoami /user affiche le nom du compte et son SID. /groups liste les groupes, /priv les privilèges."
    },
    {
      enonce: "Quelle commande liste les privilèges présents dans votre jeton d'accès ?",
      choix: ["whoami /priv", "whoami /user", "whoami /logonid", "whoami /fqdn"],
      reponse: 0,
      explication: "whoami /priv liste les privilèges (SeShutdownPrivilege, SeDebugPrivilege…) et indique s'ils sont activés ou désactivés."
    },
    {
      enonce: "Qu'est-ce qu'un jeton d'accès (access token) ?",
      choix: [
        "Le contexte de sécurité d'un processus : identité, groupes et privilèges de l'utilisateur",
        "Un fichier chiffré contenant le mot de passe",
        "Un jeton physique USB d'authentification",
        "Une clé de la base de registre"
      ],
      reponse: 0,
      explication: "Le jeton porte le SID de l'utilisateur, ses groupes et ses privilèges. Chaque processus s'exécute avec un jeton qui définit ce qu'il a le droit de faire."
    },
    {
      enonce: "Avec l'UAC activé, combien de jetons reçoit un administrateur à l'ouverture de session ?",
      choix: [
        "Deux : un jeton filtré (standard) et un jeton élevé (complet)",
        "Un seul, toujours élevé",
        "Un seul, toujours restreint",
        "Trois : standard, élevé et système"
      ],
      reponse: 0,
      explication: "L'administrateur obtient un jeton filtré (IL moyen, sans les privilèges d'admin) pour l'usage courant, et un jeton élevé (IL élevé) employé après confirmation UAC."
    },
    {
      enonce: "Dans le TP, vous comparez whoami /all dans un terminal normal et dans un terminal « Exécuter en tant qu'administrateur ». D'où vient la différence de privilèges ?",
      choix: [
        "Le terminal admin utilise le jeton élevé, le terminal normal le jeton filtré",
        "Les deux terminaux utilisent le même jeton",
        "Le terminal normal a plus de privilèges",
        "La différence vient du pare-feu"
      ],
      reponse: 0,
      explication: "Le terminal non élevé tourne avec le jeton filtré (IL moyen). « Exécuter en tant qu'administrateur » déclenche l'UAC et lance le processus avec le jeton élevé (IL élevé)."
    },
    {
      enonce: "À quoi correspond le niveau d'intégrité (Integrity Level) « Élevé » ?",
      choix: [
        "Au jeton élevé d'un administrateur après UAC",
        "À un compte invité",
        "Au niveau d'Internet Explorer en bac à sable",
        "Au compte System uniquement"
      ],
      reponse: 0,
      explication: "Les niveaux vont de Bas (navigateur) à Moyen (utilisateur standard), Élevé (admin élevé) puis System. Le MIC prime sur les DACL : un IL trop bas bloque l'accès même si la DACL l'autorise."
    },
    {
      enonce: "Le cours mentionne que la mémoire du processus LSASS contient des secrets. Lesquels ?",
      choix: [
        "Hashs, mots de passe en clair, tickets Kerberos et jetons",
        "Uniquement des journaux d'événements",
        "Les fichiers récemment ouverts",
        "La configuration du pare-feu"
      ],
      reponse: 0,
      explication: "LSASS stocke en mémoire du matériel d'authentification. C'est pourquoi il est une cible : on peut en extraire des identifiants."
    },
    {
      enonce: "Avec quels outils le cours illustre-t-il l'extraction d'identifiants depuis LSASS ?",
      choix: [
        "mimikatz en local, lsassy à distance",
        "nmap en local, Wireshark à distance",
        "ProcMon en local, TCPView à distance",
        "Autoruns en local, Sysmon à distance"
      ],
      reponse: 0,
      explication: "Le cours cite mimikatz pour l'extraction locale et lsassy pour l'extraction à distance des « credentials » présents dans LSASS."
    },
    {
      enonce: "Où sont stockés les hashs NT des comptes locaux ?",
      choix: [
        "Dans la base SAM",
        "Dans LSASS uniquement",
        "Dans le fichier hosts",
        "Dans le journal Sysmon"
      ],
      reponse: 0,
      explication: "La SAM (Security Account Manager) conserve les comptes locaux et leurs hashs NT (MD4). En domaine, c'est NTDS.dit sur le contrôleur de domaine."
    },
    {
      enonce: "Quel privilège permet de déboguer et de modifier d'autres processus, et sert souvent à lire la mémoire de LSASS ?",
      choix: ["SeDebugPrivilege", "SeShutdownPrivilege", "SeTimeZonePrivilege", "SeChangeNotifyPrivilege"],
      reponse: 0,
      explication: "SeDebugPrivilege donne accès à la mémoire d'autres processus ; combiné à un jeton élevé, il ouvre la voie à l'extraction de secrets dans LSASS."
    },
    {
      enonce: "Quel privilège, en permettant d'emprunter l'identité d'un client après authentification, est un classique de l'élévation de privilèges ?",
      choix: ["SeImpersonatePrivilege", "SeBackupPrivilege", "SeSystemtimePrivilege", "SeCreateSymbolicLinkPrivilege"],
      reponse: 0,
      explication: "SeImpersonatePrivilege autorise un processus à agir au nom d'un client authentifié. Associé à un jeton d'impersonation de SYSTEM, il mène à l'élévation."
    },
    {
      enonce: "Quelle est la différence entre un jeton primaire et un jeton d'impersonation ?",
      choix: [
        "Le jeton primaire est celui du processus ; l'impersonation permet d'agir temporairement en tant qu'un autre utilisateur",
        "Le jeton primaire est réseau, l'impersonation est local",
        "Ils sont identiques",
        "Le jeton d'impersonation est toujours celui de l'invité"
      ],
      reponse: 0,
      explication: "Le jeton primaire définit l'identité du processus. Un jeton d'impersonation laisse un thread emprunter une autre identité : utile pour les services, mais aussi pour l'escalade."
    }
  ];

  /* =========================================================
     BANQUE 3 — ProcMon, Registre, TCPView, Autoruns
     (Parties 5, 6 et 7 du TP)
     ========================================================= */
  const outils = [
    {
      enonce: "Quel est le bon ordre de travail avec Process Monitor ?",
      choix: [
        "Arrêter la capture, effacer, filtrer, démarrer, agir, arrêter, analyser",
        "Démarrer la capture puis la laisser tourner sans filtre",
        "Filtrer d'abord, puis installer l'application",
        "Analyser avant de capturer"
      ],
      reponse: 0,
      explication: "On arrête et on efface, on pose les filtres, on démarre, on effectue une action précise, on arrête aussitôt, puis on analyse. Cela évite de noyer l'écran d'événements."
    },
    {
      enonce: "Dans ProcMon, vous enregistrez un fichier avec le Bloc-notes. Quelles opérations démontrent l'écriture ?",
      choix: [
        "CreateFile, WriteFile, SetEndOfFile, CloseFile",
        "RegSetValue, RegDeleteKey",
        "TCP Connect, TCP Send",
        "Process Create, Process Exit"
      ],
      reponse: 0,
      explication: "L'ouverture (CreateFile), l'écriture du contenu (WriteFile), l'ajustement de la taille (SetEndOfFile) et la fermeture (CloseFile) forment la chronologie de l'écriture d'un fichier."
    },
    {
      enonce: "L'opération CreateFile signifie-t-elle toujours qu'un nouveau fichier a été créé ?",
      choix: [
        "Non : CreateFile sert aussi à ouvrir un fichier existant",
        "Oui, toujours un nouveau fichier",
        "Oui, sauf pour les .txt",
        "Non, elle ne concerne que le Registre"
      ],
      reponse: 0,
      explication: "L'API CreateFile ouvre ou crée. Les détails de l'événement (Disposition) précisent s'il s'agit d'une ouverture ou d'une création réelle."
    },
    {
      enonce: "Les commandes `reg add`, `reg query`, `reg delete` sur HKCU\\Software\\EPITA-Lab produisent quelles opérations ProcMon ?",
      choix: [
        "RegCreateKey / RegSetValue, RegQueryValue, RegDeleteKey",
        "CreateFile, ReadFile, WriteFile",
        "TCP Connect, TCP Disconnect",
        "Load Image, Thread Create"
      ],
      reponse: 0,
      explication: "La création et l'écriture de valeur (RegCreateKey/RegSetValue), la lecture (RegQueryValue) et la suppression (RegDeleteKey) tracent le cycle de vie de la clé."
    },
    {
      enonce: "Que désigne la ruche réelle derrière l'abréviation HKCU ?",
      choix: [
        "La configuration de l'utilisateur actuellement connecté",
        "La configuration globale de la machine",
        "Les associations de fichiers",
        "La configuration matérielle en cours"
      ],
      reponse: 0,
      explication: "HKCU (HKEY_CURRENT_USER) contient les paramètres de l'utilisateur courant. HKLM concerne toute la machine."
    },
    {
      enonce: "Un événement ProcMon affiche le résultat NAME NOT FOUND. Qu'en conclure ?",
      choix: [
        "Rien à lui seul : chercher un fichier absent est un comportement courant",
        "Qu'une attaque est en cours",
        "Que le disque est corrompu",
        "Que l'antivirus a bloqué l'accès"
      ],
      reponse: 0,
      explication: "NAME NOT FOUND signale simplement qu'une ressource cherchée n'existe pas à cet emplacement. C'est fréquent et bénin ; ce n'est pas une preuve d'activité malveillante."
    },
    {
      enonce: "Dans le TP TCPView, le port 8080 est en écoute. Quel état TCP cela correspond-il ?",
      choix: ["LISTENING", "ESTABLISHED", "TIME_WAIT", "CLOSED"],
      reponse: 0,
      explication: "Un socket serveur qui attend des connexions est en état LISTENING. Une fois le client connecté, la connexion passe en ESTABLISHED."
    },
    {
      enonce: "Que signifie l'état TIME_WAIT observé après la fermeture d'une connexion ?",
      choix: [
        "Le système attend un court instant avant de libérer le port, pour traiter les paquets retardataires",
        "La connexion est toujours active",
        "Le port est définitivement bloqué",
        "Le pare-feu a coupé la connexion"
      ],
      reponse: 0,
      explication: "TIME_WAIT est une phase transitoire après la fermeture : le port reste réservé brièvement pour absorber d'éventuels paquets en retard avant d'être réutilisé."
    },
    {
      enonce: "Pourquoi UDP n'utilise-t-il pas les états LISTENING / ESTABLISHED / TIME_WAIT ?",
      choix: [
        "UDP est sans connexion : il n'établit pas de session",
        "UDP est chiffré par défaut",
        "UDP ne fonctionne que sur le réseau local",
        "UDP est plus lent que TCP"
      ],
      reponse: 0,
      explication: "TCP maintient une connexion avec des états ; UDP envoie des datagrammes indépendants, sans établissement ni fermeture de session."
    },
    {
      enonce: "Quelle commande PowerShell relie une connexion sur le port 8080 au processus qui la possède ?",
      choix: [
        "Get-NetTCPConnection (colonne OwningProcess)",
        "Get-FileHash",
        "whoami /priv",
        "Get-MpComputerStatus"
      ],
      reponse: 0,
      explication: "Get-NetTCPConnection liste les connexions et leur OwningProcess (le PID). On retrouve ensuite le programme avec Get-Process -Id <PID>."
    },
    {
      enonce: "Dans Autoruns, l'entrée EPITA-Lab apparaît dans HKCU\\...\\CurrentVersion\\Run. Pourquoi ne nécessite-t-elle pas de droits administrateur ?",
      choix: [
        "Elle est sous HKCU : la ruche de l'utilisateur courant, modifiable sans élévation",
        "Autoruns désactive l'UAC",
        "La clé Run est toujours publique",
        "Parce que le fichier visé est signé"
      ],
      reponse: 0,
      explication: "Écrire dans HKCU ne demande pas d'élévation : chacun gère sa propre ruche. Une entrée équivalente sous HKLM (toute la machine) exigerait, elle, des droits administrateur."
    },
    {
      enonce: "Quelle est la différence entre une persistance placée sous HKCU\\...\\Run et sous HKLM\\...\\Run ?",
      choix: [
        "HKCU ne s'applique qu'à l'utilisateur courant ; HKLM s'applique à tous les comptes et demande l'admin",
        "Les deux s'appliquent à tous les utilisateurs",
        "HKCU exige l'admin, pas HKLM",
        "HKLM ne démarre jamais au logon"
      ],
      reponse: 0,
      explication: "HKCU\\Run ne lance le programme que pour l'utilisateur concerné. HKLM\\Run le lance pour tous les utilisateurs, mais écrire dedans réclame des privilèges administrateur."
    }
  ];

  /* =========================================================
     BANQUE 4 — Sysmon et corrélation d'événements
     (Partie 8 du TP)
     ========================================================= */
  const journalisation = [
    {
      enonce: "Que fait Sysmon une fois installé ?",
      choix: [
        "Il enregistre des faits techniques (processus, réseau, fichiers, registre…) dans le journal Windows",
        "Il bloque automatiquement les malwares",
        "Il remplace l'antivirus",
        "Il chiffre le disque"
      ],
      reponse: 0,
      explication: "Sysmon installe un service et un pilote qui journalisent des événements détaillés. Il collecte des faits ; il ne décide pas qu'une activité est malveillante."
    },
    {
      enonce: "Quelle commande installe Sysmon avec un fichier de configuration ?",
      choix: [
        ".\\Sysmon64.exe -accepteula -i sysmon-lab.xml",
        ".\\Sysmon64.exe -u",
        "Get-WinEvent -LogName Sysmon",
        ".\\Sysmon64.exe -c"
      ],
      reponse: 0,
      explication: "-accepteula accepte la licence, -i installe avec la config indiquée. -c (seul) applique une nouvelle configuration à une installation existante."
    },
    {
      enonce: "Dans Sysmon, que représente l'événement ID 1 ?",
      choix: ["Création d'un processus (ProcessCreate)", "Connexion réseau", "Chargement d'une image/DLL", "Requête DNS"],
      reponse: 0,
      explication: "L'ID 1 = ProcessCreate : il consigne la ligne de commande, le hash, le parent, le ProcessGuid, etc."
    },
    {
      enonce: "Quel identifiant Sysmon correspond à une connexion réseau ?",
      choix: ["ID 3", "ID 1", "ID 11", "ID 22"],
      reponse: 0,
      explication: "L'ID 3 = NetworkConnect. L'ID 11 = FileCreate, l'ID 22 = DnsQuery."
    },
    {
      enonce: "Quel identifiant Sysmon trace la création d'un fichier ?",
      choix: ["ID 11", "ID 3", "ID 13", "ID 1"],
      reponse: 0,
      explication: "L'ID 11 = FileCreate. Dans le TP, le filtre inclut les fichiers créés sous \\TP-Windows\\."
    },
    {
      enonce: "Les événements Sysmon ID 12 et 13 concernent quoi ?",
      choix: [
        "Le Registre (création/suppression d'objet, et définition de valeur)",
        "Le réseau",
        "Les requêtes DNS",
        "Les threads distants"
      ],
      reponse: 0,
      explication: "L'ID 12 = RegistryEvent (ajout/suppression d'objet) et l'ID 13 = RegistryEvent (valeur définie). Dans le TP, ils suivent la clé EPITA-Lab."
    },
    {
      enonce: "Quel identifiant Sysmon correspond à une requête DNS ?",
      choix: ["ID 22", "ID 3", "ID 7", "ID 1"],
      reponse: 0,
      explication: "L'ID 22 = DnsQuery. Il relie un processus au nom de domaine qu'il a résolu (par ex. example.com)."
    },
    {
      enonce: "Pourquoi ProcessGuid est-il plus fiable que ProcessId pour corréler des événements dans la durée ?",
      choix: [
        "Le ProcessGuid est unique et ne se réutilise pas, contrairement au PID",
        "Le ProcessGuid est plus court à écrire",
        "Le PID n'existe pas dans Sysmon",
        "Le ProcessGuid change à chaque événement"
      ],
      reponse: 0,
      explication: "Un PID est réattribué après la fin d'un processus : deux processus différents peuvent porter le même PID à des moments différents. Le ProcessGuid, lui, est unique."
    },
    {
      enonce: "Quels champs permettent de relier un événement ProcessCreate à l'événement DNS et à l'événement réseau qu'il a déclenchés ?",
      choix: [
        "Le ProcessGuid (et le ProcessId) communs",
        "L'heure uniquement",
        "Le nom du journal",
        "La taille du message"
      ],
      reponse: 0,
      explication: "Les événements d'un même processus partagent le même ProcessGuid, ce qui permet de reconstituer la chaîne : création → requête DNS → connexion réseau."
    },
    {
      enonce: "Quelle commande interroge les événements Sysmon récents en PowerShell ?",
      choix: [
        "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-Sysmon/Operational'; Id=1 }",
        "Get-FileHash -Algorithm SHA256",
        "whoami /groups",
        "reg query HKCU\\Software"
      ],
      reponse: 0,
      explication: "Get-WinEvent avec -FilterHashtable filtre par journal, identifiant d'événement et plage de temps. C'est la méthode employée dans le TP."
    },
    {
      enonce: "Quelle différence faites-vous entre un hash et une signature numérique (TP, partie 2) ?",
      choix: [
        "Le hash prouve que les octets sont identiques ; la signature prouve en plus l'éditeur via un certificat",
        "Ce sont deux mots pour la même chose",
        "La signature ne concerne que les fichiers texte",
        "Le hash identifie l'éditeur, la signature l'intégrité"
      ],
      reponse: 0,
      explication: "Un hash (Get-FileHash) atteste l'intégrité : mêmes octets, même empreinte. Une signature (Get-AuthenticodeSignature) atteste l'origine : le binaire a été signé par un éditeur dont le certificat est vérifié."
    },
    {
      enonce: "La correspondance du SHA-256 d'une ISO prouve quoi, et ne prouve pas quoi ?",
      choix: [
        "Elle prouve l'intégrité du téléchargement, pas que l'image d'origine est sûre",
        "Elle prouve que l'image est signée Microsoft",
        "Elle prouve que l'image est exempte de virus",
        "Elle ne prouve rien du tout"
      ],
      reponse: 0,
      explication: "Un hash identique à la référence garantit que le fichier n'a pas été altéré ou tronqué. Il ne dit rien sur la confiance à accorder à la source de référence elle-même."
    }
  ];

  /* =========================================================
     TERMINAL — Rejouer les commandes du TP1
     ========================================================= */
  const objectifsTp1 = [
    {
      enonce: "Affichez l'édition, la version, le numéro de build et l'architecture de Windows avec **Get-CimInstance** sur la classe **Win32_OperatingSystem**.",
      indice: "Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, BuildNumber, OSArchitecture",
      motifs: ["Get-CimInstance", "Win32_OperatingSystem", "Caption"],
      solution: "Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, BuildNumber, OSArchitecture",
      sortie:
"Caption                          Version    BuildNumber OSArchitecture\n" +
"-------                          -------    ----------- --------------\n" +
"Microsoft Windows 10 Enterprise  10.0.19044 19044       64 bits"
    },
    {
      enonce: "Vérifiez l'intégrité de l'ISO téléchargée en calculant son empreinte **SHA-256** avec **Get-FileHash**.",
      indice: "Get-FileHash -Path <fichier.iso> -Algorithm SHA256",
      motifs: ["Get-FileHash", "-Algorithm\\s+SHA256"],
      solution: "Get-FileHash -Path .\\windows_10_ltsc.iso -Algorithm SHA256",
      sortie:
"Algorithm  Hash\n" +
"---------  ----\n" +
"SHA256     6C3B... (comparez ces 64 caractères à la valeur de référence)"
    },
    {
      enonce: "Vérifiez la **signature numérique** de l'outil `procexp64.exe` avec **Get-AuthenticodeSignature**.",
      indice: "Get-AuthenticodeSignature <chemin>\\procexp64.exe | Select-Object Status, SignerCertificate",
      motifs: ["Get-AuthenticodeSignature", "procexp64\\.exe"],
      solution: "Get-AuthenticodeSignature C:\\Tools\\Sysinternals\\procexp64.exe | Select-Object Status, StatusMessage, SignerCertificate",
      sortie:
"Status   StatusMessage              SignerCertificate\n" +
"------   -------------              -----------------\n" +
"Valid    La signature est correcte  CN=Microsoft Corporation, ..."
    },
    {
      enonce: "Affichez le **SID** de votre compte.",
      indice: "whoami /user",
      motifs: ["^whoami\\b", "/user"],
      solution: "whoami /user",
      sortie:
"INFORMATIONS UTILISATEUR\n" +
"------------------------\n" +
"Nom d'utilisateur   SID\n" +
"=================== =============================================\n" +
"epita-lab\\epita     S-1-5-21-1990400566-1867844161-3796721076-1001"
    },
    {
      enonce: "Listez les **privilèges** présents dans votre jeton d'accès.",
      indice: "whoami /priv",
      motifs: ["^whoami\\b", "/priv"],
      solution: "whoami /priv",
      sortie:
"INFORMATIONS SUR LES PRIVILÈGES\n" +
"-------------------------------\n" +
"Nom de privilège              Description                         État\n" +
"============================= =================================== ========\n" +
"SeShutdownPrivilege           Arrêter le système                  Désactivé\n" +
"SeChangeNotifyPrivilege       Contourner la vérification          Activé\n" +
"SeUndockPrivilege             Retirer l'ordinateur de sa station  Désactivé"
    },
    {
      enonce: "Créez la clé de démonstration **HKCU\\Software\\EPITA-Lab** avec une valeur `Scenario` de type `REG_SZ`, via **reg add**.",
      indice: "reg add \"HKCU\\Software\\EPITA-Lab\" /v Scenario /t REG_SZ /d \"TP1\" /f",
      motifs: ["^reg\\s+add\\b", "EPITA-Lab", "/v\\s+Scenario", "REG_SZ"],
      solution: "reg add \"HKCU\\Software\\EPITA-Lab\" /v Scenario /t REG_SZ /d \"TP1\" /f",
      sortie: "L'opération a réussi."
    },
    {
      enonce: "Supprimez ensuite cette clé de registre avec **reg delete**.",
      indice: "reg delete \"HKCU\\Software\\EPITA-Lab\" /f",
      motifs: ["^reg\\s+delete\\b", "EPITA-Lab", "/f\\b"],
      solution: "reg delete \"HKCU\\Software\\EPITA-Lab\" /f",
      sortie: "L'opération a réussi."
    },
    {
      enonce: "Trouvez la connexion TCP sur le **port 8080** et le processus qui la possède, avec **Get-NetTCPConnection**.",
      indice: "Get-NetTCPConnection | Where-Object LocalPort -eq 8080 | Select-Object ... OwningProcess",
      motifs: ["Get-NetTCPConnection", "8080", "OwningProcess"],
      solution: "Get-NetTCPConnection | Where-Object { $_.LocalPort -eq 8080 } | Select-Object LocalAddress, LocalPort, State, OwningProcess",
      sortie:
"LocalAddress LocalPort State       OwningProcess\n" +
"------------ --------- -----       -------------\n" +
"127.0.0.1    8080      Listen      6244\n" +
"127.0.0.1    8080      Established 6244"
    },
    {
      enonce: "Installez **Sysmon** avec le fichier de configuration du laboratoire `sysmon-lab.xml`.",
      indice: ".\\Sysmon64.exe -accepteula -i <chemin>\\sysmon-lab.xml",
      motifs: ["Sysmon64\\.exe", "-accepteula", "-i\\b", "sysmon-lab\\.xml"],
      solution: ".\\Sysmon64.exe -accepteula -i C:\\Tools\\Sysinternals\\sysmon-lab.xml",
      sortie:
"System Monitor v15.0 - System activity monitor\n" +
"Loading configuration file with schema version 4.82\n" +
"Sysmon installed.\n" +
"Starting SysmonDrv.\n" +
"SysmonDrv started.\n" +
"Starting Sysmon..\n" +
"Sysmon started."
    },
    {
      enonce: "Interrogez les événements **Sysmon ID 1** (création de processus) des dernières minutes avec **Get-WinEvent**.",
      indice: "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-Sysmon/Operational'; Id=1 }",
      motifs: ["Get-WinEvent", "Microsoft-Windows-Sysmon", "Id"],
      solution: "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-Sysmon/Operational'; Id=1 } | Select-Object TimeCreated, Id, Message",
      sortie:
"TimeCreated           Id Message\n" +
"-----------           -- -------\n" +
"01/10/2026 14:12:03    1 Process Create: ... Image: C:\\Windows\\System32\\reg.exe ...\n" +
"01/10/2026 14:12:01    1 Process Create: ... Image: C:\\Windows\\System32\\cmd.exe ..."
    }
  ];

  /* =========================================================
     Rattachement au cours « systeme-windows »
     ========================================================= */
  const cours = CONTENU["systeme-windows"];

  cours.guides = (cours.guides || []).concat([
    {
      id: "observation-tp1",
      titre: "Fiche technique — Observer un poste Windows (TP1)",
      badge: "Fiche technique",
      resume: "Les commandes du premier TP, regroupées par étape : intégrité d'un fichier, jeton d'accès, Process Explorer / ProcMon, réseau, démarrage automatique et journalisation Sysmon. Syntaxe, options et exemple par outil.",
      niveau: "Référence",
      sections: [
        { type: "partie", titre: "Intégrité et signature", texte: "Prouver qu'un fichier n'a pas été altéré et savoir qui l'a signé." },
        {
          titre: "Get-FileHash — empreinte d'un fichier",
          texte: "Calcule le condensé cryptographique. Deux fichiers identiques ont la même empreinte.",
          tableau: {
            entetes: ["Élément", "Rôle"],
            lignes: [
              ["`-Path`", "Fichier à empreindre"],
              ["`-Algorithm SHA256`", "Algorithme de hachage"]
            ]
          },
          code: "Get-FileHash -Path .\\image.iso -Algorithm SHA256",
          remarque: "Un hash identique prouve l'intégrité du téléchargement, pas que la source de référence est sûre."
        },
        {
          titre: "Get-AuthenticodeSignature — signature d'un binaire",
          texte: "Indique si l'exécutable est signé et par quel éditeur.",
          code: "Get-AuthenticodeSignature .\\procexp64.exe | Select-Object Status, SignerCertificate",
          remarque: "Hash = intégrité (mêmes octets). Signature = origine (éditeur vérifié par un certificat)."
        },

        { type: "partie", titre: "Jeton d'accès", texte: "Lire l'identité et les droits du contexte de sécurité courant." },
        {
          titre: "whoami — identité, groupes et privilèges",
          tableau: {
            entetes: ["Commande", "Montre"],
            lignes: [
              ["`whoami /user`", "Le compte et son SID"],
              ["`whoami /groups`", "Les groupes du jeton"],
              ["`whoami /priv`", "Les privilèges et leur état"],
              ["`whoami /all`", "Tout, pour comparer deux terminaux"]
            ]
          },
          codes: [
            { code: "whoami /all > whoami-normal.txt", legende: "Terminal standard (jeton filtré)" },
            { code: "whoami /all > whoami-admin.txt", legende: "Terminal élevé (jeton élevé)" }
          ],
          remarque: "La différence de privilèges entre les deux fichiers illustre les deux jetons de l'UAC : filtré (IL moyen) et élevé (IL élevé)."
        },

        { type: "partie", titre: "Processus, fichiers et registre", texte: "Observer un processus et tracer ses accès avec les Sysinternals." },
        {
          titre: "Process Explorer — anatomie d'un processus",
          texte: "Ajoutez les colonnes `PID`, `User Name`, `Integrity Level`, `Verified Signer`, `Command Line`. Le volet inférieur bascule entre `Handles` et `DLLs`.",
          points: [
            "**PID / PPID** : identifiant du processus et de son parent.",
            "**Threads / Handles / DLL** : fils d'exécution, ressources ouvertes, bibliothèques chargées.",
            "Ne jamais utiliser `Kill Process` sur un processus système (ex. `csrss.exe`)."
          ]
        },
        {
          titre: "Process Monitor — fichiers et registre",
          texte: "Méthode : arrêter, effacer, filtrer (`Process Name is …`), démarrer, agir, arrêter, analyser.",
          tableau: {
            entetes: ["Opération", "Signification"],
            lignes: [
              ["`CreateFile`", "Ouvre ou crée un fichier"],
              ["`WriteFile` / `SetEndOfFile`", "Écrit le contenu / ajuste la taille"],
              ["`RegSetValue` / `RegDeleteKey`", "Écrit / supprime dans le Registre"],
              ["`NAME NOT FOUND`", "Ressource absente — bénin en soi"]
            ]
          },
          codes: [
            { code: "reg add \"HKCU\\Software\\EPITA-Lab\" /v Scenario /t REG_SZ /d \"TP1\" /f", legende: "Crée une valeur" },
            { code: "reg delete \"HKCU\\Software\\EPITA-Lab\" /f", legende: "Supprime la clé" }
          ]
        },

        { type: "partie", titre: "Réseau", texte: "Associer une connexion au processus propriétaire." },
        {
          titre: "TCPView / Get-NetTCPConnection",
          tableau: {
            entetes: ["État", "Signification"],
            lignes: [
              ["`LISTENING`", "Socket serveur en attente"],
              ["`ESTABLISHED`", "Connexion active"],
              ["`TIME_WAIT`", "Fermeture en cours, port réservé un instant"]
            ]
          },
          code: "Get-NetTCPConnection | Where-Object { $_.LocalPort -eq 8080 } | Select-Object LocalAddress, LocalPort, State, OwningProcess",
          remarque: "`OwningProcess` donne le PID ; `Get-Process -Id <PID>` donne le programme. UDP, sans connexion, n'a pas ces états."
        },

        { type: "partie", titre: "Démarrage automatique et journalisation", texte: "Repérer une persistance et enregistrer l'activité." },
        {
          titre: "Autoruns — persistance au logon",
          texte: "L'onglet `Logon` liste ce qui démarre à l'ouverture de session.",
          code: "New-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -Name 'EPITA-Lab' -Value $command -PropertyType String -Force",
          remarque: "Sous `HKCU`, pas besoin d'admin (utilisateur courant). Sous `HKLM`, l'entrée vaut pour tous mais exige l'admin."
        },
        {
          titre: "Sysmon — journaliser les faits",
          tableau: {
            entetes: ["Événement", "Signification"],
            lignes: [
              ["`ID 1`", "Création de processus"],
              ["`ID 3`", "Connexion réseau"],
              ["`ID 11`", "Création de fichier"],
              ["`ID 12 / 13`", "Registre : objet / valeur"],
              ["`ID 22`", "Requête DNS"]
            ]
          },
          codes: [
            { code: ".\\Sysmon64.exe -accepteula -i sysmon-lab.xml", legende: "Installer avec config" },
            { code: "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-Sysmon/Operational'; Id=1 }", legende: "Lire les événements" }
          ],
          attention: "Le `ProcessGuid` est unique dans le temps ; le `ProcessId` (PID) est réutilisé. Pour corréler sur la durée, fiez-vous au ProcessGuid."
        }
      ]
    }
  ]);

  cours.chapitres.push({
    id: "observation",
    titre: "Observation du système (TP1)",
    description: "Le premier TP pas à pas : processus, jetons et privilèges, Process Monitor, TCPView, Autoruns et Sysmon. Avec les attaques évoquées dans le cours (vol d'identifiants, abus de jetons).",
    exercices: [
      {
        type: "qcm",
        id: "win-obs-processus",
        titre: "QCM — Processus, threads, handles et DLL",
        description: "PID et PPID, relation parent-enfant, threads, handles, DLL, processus système et lecture d'un processus dans Process Explorer.",
        cours: [
          "Mini-cours — l'anatomie d'un processus (TP1, parties 3-4) :",
          [
            "**Processus** : un programme en cours, avec sa mémoire. Identifié par un **PID** (unique mais réutilisé après sa fin) ; son créateur est le **PPID**.",
            "**Thread** : un fil d'exécution à l'intérieur du processus.",
            "**Handle** : une référence vers une ressource ouverte (fichier, clé, objet).",
            "**DLL** : une bibliothèque de code chargée en mémoire par le processus.",
            "Process Explorer montre tout cela ; on ne tue jamais un processus système."
          ]
        ],
        exemple: {
          titre: "Exemple — lancer le Bloc-notes depuis une console",
          texte: "Dans `cmd.exe`, tapez `notepad.exe`. Dans Process Explorer, `notepad.exe` apparaît **sous** `cmd.exe` : la console est le parent.",
          code: "notepad.exe",
          legende: "cmd.exe devient le parent (PPID) de notepad.exe",
          note: "Fermez puis relancez : le **PID change**. Le PID seul n'identifie pas un programme dans la durée."
        },
        tirage: 9,
        melangerChoix: true,
        questions: processus
      },
      {
        type: "qcm",
        id: "win-obs-identites",
        titre: "QCM — Jetons, SID, privilèges et vol d'identifiants",
        description: "SID, jetons d'accès, jetons filtré/élevé de l'UAC, niveaux d'intégrité, privilèges, et les attaques du cours : LSASS, SAM, SeDebug, SeImpersonate.",
        cours: [
          "Mini-cours — identité, droits et ce que l'on peut en voler :",
          [
            "**SID** : identifiant unique d'un compte/groupe. **Jeton d'accès** : SID + groupes + privilèges d'un processus.",
            "**UAC** : un admin a deux jetons — **filtré** (IL moyen, usage courant) et **élevé** (IL élevé, après confirmation).",
            "**LSASS** garde en mémoire hashs, mots de passe, tickets Kerberos → extraits avec **mimikatz** (local) ou **lsassy** (distant).",
            "**SAM** stocke les hashs NT des comptes locaux.",
            "**SeDebugPrivilege** (lire d'autres processus) et **SeImpersonatePrivilege** (emprunter une identité) sont des leviers d'escalade."
          ]
        ],
        exemple: {
          titre: "Exemple — comparer deux terminaux",
          texte: "Exécutez `whoami /priv` dans un terminal normal, puis dans un terminal **Exécuter en tant qu'administrateur**.",
          code: "whoami /priv",
          legende: "La liste des privilèges diffère entre jeton filtré et jeton élevé",
          note: "C'est l'UAC qui distribue l'un ou l'autre jeton selon l'élévation."
        },
        tirage: 10,
        melangerChoix: true,
        questions: identites
      },
      {
        type: "qcm",
        id: "win-obs-outils",
        titre: "QCM — ProcMon, TCPView et Autoruns",
        description: "Méthode de capture, opérations fichiers et registre, NAME NOT FOUND, états TCP, OwningProcess et persistance au démarrage.",
        cours: [
          "Mini-cours — tracer les actions (TP1, parties 5-7) :",
          [
            "**ProcMon** : arrêter → effacer → filtrer → démarrer → agir → arrêter → analyser.",
            "**Fichiers** : `CreateFile`, `WriteFile`, `SetEndOfFile`, `CloseFile`. **Registre** : `RegSetValue`, `RegDeleteKey`.",
            "**NAME NOT FOUND** = ressource absente : bénin en soi.",
            "**TCPView** : `LISTENING` → `ESTABLISHED` → `TIME_WAIT`. `Get-NetTCPConnection` donne l'`OwningProcess`.",
            "**Autoruns** : une valeur sous `HKCU\\...\\Run` relance un programme au logon, sans droits admin."
          ]
        ],
        exemple: {
          titre: "Exemple — tracer une clé de registre",
          texte: "Avec le filtre `Process Name is reg.exe`, exécutez les trois commandes et retrouvez `RegSetValue` puis `RegDeleteKey`.",
          code: "reg add \"HKCU\\Software\\EPITA-Lab\" /v Scenario /t REG_SZ /d \"TP1\" /f",
          legende: "Génère une opération RegSetValue dans ProcMon",
          note: "`HKCU` = la ruche de l'utilisateur courant (HKEY_CURRENT_USER)."
        },
        tirage: 10,
        melangerChoix: true,
        questions: outils
      },
      {
        type: "qcm",
        id: "win-obs-sysmon",
        titre: "QCM — Sysmon et corrélation d'événements",
        description: "Rôle de Sysmon, installation, identifiants d'événements (1, 3, 11, 12/13, 22), ProcessGuid vs PID, Get-WinEvent, hash vs signature.",
        cours: [
          "Mini-cours — journaliser et corréler (TP1, partie 8) :",
          [
            "**Sysmon** collecte des faits ; il ne juge pas. Installation : `Sysmon64.exe -accepteula -i config.xml`.",
            "**Identifiants** : `1` processus, `3` réseau, `11` fichier, `12/13` registre, `22` DNS, `4` changement d'état du service.",
            "**ProcessGuid** : unique dans le temps, contrairement au **PID** réutilisable → relie création, DNS et réseau d'un même processus.",
            "**Get-WinEvent -FilterHashtable** filtre par journal, Id et période.",
            "**Hash** = intégrité ; **signature** = origine (éditeur vérifié)."
          ]
        ],
        exemple: {
          titre: "Exemple — lire les créations de processus",
          texte: "Après avoir généré de l'activité, interrogez les événements `ID 1` des dernières minutes.",
          code: "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-Sysmon/Operational'; Id=1 }",
          legende: "Liste les créations de processus journalisées",
          note: "Le même `ProcessGuid` relie ensuite les événements DNS (22) et réseau (3) du processus."
        },
        tirage: 10,
        melangerChoix: true,
        questions: journalisation
      },
      {
        type: "jetpunk",
        id: "win-obs-sysmon-id",
        titre: "Identifiants d'événements Sysmon",
        consigne: "Donnez le type d'événement correspondant à chaque identifiant Sysmon.",
        temps: 120,
        colonnes: 2,
        melanger: true,
        items: [
          { indice: "Sysmon ID 1", reponse: "Création de processus", alt: ["Process Create", "ProcessCreate", "Processus"] },
          { indice: "Sysmon ID 3", reponse: "Connexion réseau", alt: ["Network Connect", "NetworkConnect", "Réseau"] },
          { indice: "Sysmon ID 7", reponse: "Chargement d'image / DLL", alt: ["Image Loaded", "ImageLoad", "DLL", "Image load"] },
          { indice: "Sysmon ID 11", reponse: "Création de fichier", alt: ["File Create", "FileCreate", "Fichier"] },
          { indice: "Sysmon ID 12", reponse: "Registre : objet ajouté/supprimé", alt: ["RegistryEvent", "Registre objet", "Objet registre"] },
          { indice: "Sysmon ID 13", reponse: "Registre : valeur définie", alt: ["Registre valeur", "RegistryValue", "Valeur registre"] },
          { indice: "Sysmon ID 22", reponse: "Requête DNS", alt: ["DNS", "DnsQuery", "DNS Query"] },
          { indice: "Sysmon ID 4", reponse: "Changement d'état du service Sysmon", alt: ["Sysmon state", "État du service", "Service state"] }
        ]
      },
      {
        type: "jetpunk",
        id: "win-obs-commandes",
        titre: "Quelle commande d'observation ?",
        consigne: "Nommez la commande ou l'outil qui réalise chaque tâche du TP1.",
        temps: 150,
        colonnes: 2,
        melanger: true,
        tirage: 8,
        items: [
          { indice: "Calculer l'empreinte SHA-256 d'un fichier", reponse: "Get-FileHash" },
          { indice: "Vérifier qui a signé un exécutable", reponse: "Get-AuthenticodeSignature" },
          { indice: "Afficher le SID de son compte", reponse: "whoami /user", alt: ["whoami"] },
          { indice: "Lister les privilèges de son jeton", reponse: "whoami /priv" },
          { indice: "Relier une connexion TCP à son processus", reponse: "Get-NetTCPConnection" },
          { indice: "Lire les événements d'un journal en PowerShell", reponse: "Get-WinEvent" },
          { indice: "Installer un service de journalisation d'événements système", reponse: "Sysmon", alt: ["Sysmon64.exe", "Sysmon64"] },
          { indice: "Observer fichiers et registre en temps réel", reponse: "Process Monitor", alt: ["ProcMon", "Procmon64.exe", "Procmon"] },
          { indice: "Voir les DLL et handles d'un processus", reponse: "Process Explorer", alt: ["procexp", "procexp64.exe"] },
          { indice: "Repérer ce qui démarre automatiquement", reponse: "Autoruns", alt: ["Autoruns64.exe"] }
        ]
      },
      {
        type: "terminal",
        id: "win-obs-terminal",
        titre: "Terminal — Observer et journaliser (TP1)",
        description: "Rejouez les commandes du premier TP : intégrité, jeton d'accès, registre, réseau et Sysmon.",
        terminal: "PowerShell — VM EPITA-Windows-Lab",
        invite: "PS C:\\Users\\epita>",
        cours: [
          "Tapez chaque commande attendue, puis Entrée. Une sortie réaliste s'affiche quand l'objectif est atteint.",
          ["`help` — un indice", "`solution` — la commande (ne compte pas dans le score)", "`objective` — rappeler l'objectif", "`clear` — vider l'écran"]
        ],
        intro: [
          "Vous êtes sur la **VM Windows 10** du TP1, dans un PowerShell.",
          "Objectif : reproduire la chaîne d'observation du TP — de l'intégrité d'un fichier jusqu'à la lecture des événements Sysmon."
        ],
        objectifs: objectifsTp1
      }
    ]
  });

})();
