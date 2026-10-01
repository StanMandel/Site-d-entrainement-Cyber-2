/* =============================================================
   Windows — Chapitre « DLL hijacking (TD) »
   -------------------------------------------------------------
   Complète le cours « systeme-windows ». S'appuie sur le nouveau
   cours (DLL / DLL hijacking) et le nouveau TP (« TD DLL
   Hijacking »).
     - une « Fiche technique » du DLL hijacking (ordre de
       recherche, preuves, correction, détection) ;
     - un chapitre progressif : QCM avec mini-cours et exemples,
       un jeu de rapidité, et un terminal qui rejoue le TD.

   But pédagogique : comprendre chaque commande, concept et étape
   du TD — de l'ordre de recherche des DLL à la détection Sysmon,
   en passant par la preuve de concept bénigne et son correctif.
   ============================================================= */

(function () {

  /* =========================================================
     BANQUE 1 — DLL et ordre de recherche
     (Parties 1 et 2 du TD)
     ========================================================= */
  const principe = [
    {
      enonce: "Qu'est-ce qu'une DLL ?",
      choix: [
        "Une bibliothèque de code et de données réutilisable, chargée en mémoire au besoin",
        "Un exécutable autonome lancé au démarrage",
        "Un pilote en mode noyau",
        "Un fichier de configuration du Registre"
      ],
      reponse: 0,
      explication: "Une Dynamic Link Library contient des fonctions réutilisables par plusieurs programmes, chargées dynamiquement lors de l'exécution."
    },
    {
      enonce: "Quelle est la différence entre la liaison au chargement et la liaison à l'exécution ?",
      choix: [
        "Au chargement : dépendances déclarées dans l'exe, résolues au démarrage. À l'exécution : le programme appelle LoadLibrary au moment voulu",
        "Au chargement : la DLL est chiffrée. À l'exécution : elle est en clair",
        "Les deux sont identiques",
        "La liaison à l'exécution ne concerne que les pilotes"
      ],
      reponse: 0,
      explication: "La liaison au chargement résout les DLL déclarées dès le démarrage. La liaison à l'exécution utilise LoadLibrary / LoadLibraryEx puis GetProcAddress pour charger à la demande."
    },
    {
      enonce: "Le lab appelle conceptuellement `LoadLibraryW(L\"epita_plugin.dll\")`, sans chemin. Quelle conséquence ?",
      choix: [
        "Windows doit rechercher le fichier selon l'ordre de recherche des DLL",
        "Windows refuse de charger la DLL",
        "La DLL est forcément chargée depuis System32",
        "Le programme plante immédiatement"
      ],
      reponse: 0,
      explication: "Sans chemin, le chargeur applique l'ordre de recherche. C'est précisément ce comportement qui ouvre la porte au détournement."
    },
    {
      enonce: "Dans l'ordre de recherche (mode sûr), quel emplacement est consulté avant le dossier système ?",
      choix: [
        "Le dossier de l'application",
        "Le dossier Temp de l'utilisateur",
        "Les dossiers de la variable PATH en premier",
        "Le dossier des téléchargements"
      ],
      reponse: 0,
      explication: "Après les redirections, les modules déjà chargés et les KnownDLLs, le chargeur consulte le dossier de l'application, puis System32, puis le dossier courant et enfin le PATH."
    },
    {
      enonce: "Pourquoi une DLL listée dans KnownDLLs (ex. shell32.dll) est-elle un mauvais choix pour une démonstration de hijacking ?",
      choix: [
        "Les KnownDLLs sont chargées depuis un emplacement protégé, en amont du dossier de l'application",
        "Elles n'existent pas sur disque",
        "Elles sont toujours absentes de System32",
        "Elles sont chargées depuis le dossier courant en priorité"
      ],
      reponse: 0,
      explication: "La liste KnownDLLs force le chargement depuis System32 très tôt dans l'ordre : impossible de la détourner en déposant un fichier à côté de l'exe."
    },
    {
      enonce: "Quelles conditions réunir pour qu'un DLL hijacking soit exploitable ? (plusieurs réponses)",
      choix: [
        "L'application demande une DLL sans chemin suffisamment contraint",
        "Un emplacement recherché est modifiable par l'attaquant",
        "La DLL fournie a la bonne architecture et les exports attendus",
        "L'antivirus est désinstallé obligatoirement"
      ],
      reponse: [0, 1, 2],
      explication: "Il faut une recherche non contrainte, un emplacement accessible en écriture avant la DLL légitime, et une DLL compatible (architecture + exports). La victime doit ensuite exécuter l'application."
    },
    {
      enonce: "Lors de l'observation ProcMon, le code d'erreur Win32 attendu est 126. Que signifie-t-il ?",
      choix: [
        "Module introuvable : la DLL n'a été trouvée nulle part",
        "Accès refusé",
        "Mémoire insuffisante",
        "Signature invalide"
      ],
      reponse: 0,
      explication: "L'erreur 126 (« module introuvable ») confirme que le chargeur a cherché la DLL sans la trouver — on voit alors toutes les tentatives dans ProcMon."
    },
    {
      enonce: "Une recherche se terminant par NAME NOT FOUND prouve-t-elle une vulnérabilité exploitable ?",
      choix: [
        "Non : elle montre seulement une recherche infructueuse, pas un chargement réussi d'une DLL attaquante",
        "Oui, c'est la preuve directe du hijacking",
        "Oui, dès que le mot DLL apparaît",
        "Non, car NAME NOT FOUND ne concerne que le réseau"
      ],
      reponse: 0,
      explication: "NAME NOT FOUND indique une absence. Il faut encore prouver qu'un emplacement cherché est accessible en écriture ET qu'une DLL déposée s'y charge réellement."
    },
    {
      enonce: "Le dossier de l'application et le dossier de travail courant désignent-ils toujours le même emplacement ?",
      choix: [
        "Non : le dossier de l'application est celui de l'exe ; le dossier courant dépend de l'endroit d'où on lance la commande",
        "Oui, toujours identiques",
        "Oui, sauf sous System32",
        "Non, mais seulement pour les scripts"
      ],
      reponse: 0,
      explication: "On peut lancer `C:\\App\\prog.exe` depuis `C:\\Users\\moi`. Le dossier de l'application est `C:\\App`, le dossier courant `C:\\Users\\moi` : deux emplacements de recherche distincts."
    },
    {
      enonce: "Lancer `rundll32.exe fichier.dll,Export` prouve-t-il un DLL hijacking ?",
      choix: [
        "Non : c'est un chargement explicite et volontaire, pas un détournement de l'ordre de recherche",
        "Oui, c'est la définition même du hijacking",
        "Oui, car rundll32 est un outil d'attaque",
        "Non, car rundll32 ne charge pas de DLL"
      ],
      reponse: 0,
      explication: "rundll32 charge une DLL qu'on lui désigne explicitement. Le hijacking, lui, consiste à faire charger une DLL non prévue via l'ordre de recherche d'une application légitime."
    }
  ];

  /* =========================================================
     BANQUE 2 — Démontrer et qualifier le hijacking
     (Partie 3 du TD)
     ========================================================= */
  const preuve = [
    {
      enonce: "La preuve de concept consiste à copier la DLL de démonstration à côté de VulnerableApp.exe. Pourquoi cela fonctionne-t-il ?",
      choix: [
        "Le dossier de l'application est recherché avant la DLL légitime, et l'étudiant peut y écrire",
        "Parce que la DLL est signée Microsoft",
        "Parce qu'on désactive l'antivirus",
        "Parce que System32 est vidé"
      ],
      reponse: 0,
      explication: "La DLL déposée dans le dossier de l'exe est trouvée en premier dans l'ordre de recherche ; comme ce dossier est accessible en écriture, le détournement réussit."
    },
    {
      enonce: "Le TD demande trois preuves indépendantes. Laquelle correspond au « module présent en mémoire » ?",
      choix: [
        "Le chemin de la DLL chargée, vu avec ListDLLs ou le volet DLLs de Process Explorer",
        "Le fichier de sortie écrit sur le disque",
        "L'empreinte SHA-256 du fichier",
        "Le code d'erreur 126"
      ],
      reponse: 0,
      explication: "ListDLLs (ou Process Explorer > Lower Pane > DLLs) montre le chemin exact de la DLL réellement chargée dans le processus."
    },
    {
      enonce: "Quels outils confirment le chemin exact de la DLL chargée par le processus ?",
      choix: [
        "ListDLLs et Process Explorer",
        "nmap et Wireshark",
        "Responder et ntlmrelayx",
        "whoami et hostname"
      ],
      reponse: 0,
      explication: "ListDLLs liste en ligne de commande les DLL d'un processus ; Process Explorer les affiche dans son volet inférieur. Les deux donnent le chemin complet."
    },
    {
      enonce: "La troisième preuve examine le fichier sur disque. Quelles commandes utilise-t-on ?",
      choix: [
        "Get-FileHash, Get-AuthenticodeSignature et sigcheck",
        "reg add et reg delete",
        "Get-NetTCPConnection",
        "Sysmon64.exe -i"
      ],
      reponse: 0,
      explication: "On relève l'empreinte (Get-FileHash), le statut de signature (Get-AuthenticodeSignature) et des détails complémentaires avec sigcheck."
    },
    {
      enonce: "La DLL de démonstration doit exporter une fonction nommée RunPlugin. Pourquoi ?",
      choix: [
        "L'application récupère cet export (via GetProcAddress) ; sans lui, elle ne peut pas l'utiliser",
        "Pour contourner l'antivirus",
        "Parce que Windows l'exige pour toute DLL",
        "Pour signer la DLL"
      ],
      reponse: 0,
      explication: "La DLL attaquante doit respecter l'interface attendue : exporter RunPlugin avec la bonne signature, sinon l'application échoue à appeler la fonction."
    },
    {
      enonce: "Le DLL hijacking donne-t-il des privilèges administrateur au code de la DLL ?",
      choix: [
        "Non : le code hérite du contexte de sécurité du processus victime, pas plus",
        "Oui, toujours des droits SYSTEM",
        "Oui, car la DLL s'exécute en mode noyau",
        "Non, la DLL n'exécute jamais de code"
      ],
      reponse: 0,
      explication: "La DLL s'exécute avec le jeton du processus qui la charge. Si la victime est lancée avec un jeton élevé, l'impact est bien plus grave — d'où l'intérêt des privilèges du processus cible."
    },
    {
      enonce: "En comparant baseline.pml et hijack.pml, qu'est-ce qui marque le passage d'une recherche infructueuse à un chargement réussi ?",
      choix: [
        "Une opération sur la DLL déposée se terminant par SUCCESS, suivie du chargement de l'image",
        "L'apparition d'une erreur 126 supplémentaire",
        "La disparition de tous les événements",
        "Un changement d'adresse IP"
      ],
      reponse: 0,
      explication: "Dans hijack.pml, l'accès à la DLL déposée aboutit (SUCCESS) puis l'image est chargée, là où baseline.pml n'affichait que des tentatives NAME NOT FOUND."
    },
    {
      enonce: "Une signature valide sur la DLL permet-elle à elle seule de l'innocenter ou de la condamner ?",
      choix: [
        "Non : une DLL malveillante peut être non signée, et une DLL signée peut être détournée. Il faut croiser les indices",
        "Oui : signée = sûre",
        "Oui : non signée = malveillante",
        "La signature n'a aucun rapport"
      ],
      reponse: 0,
      explication: "La signature atteste l'origine, pas l'innocuité dans un contexte donné. Un fichier signé légitime placé au mauvais endroit reste un détournement."
    },
    {
      enonce: "Comment classer : l'application charge volontairement une DLL fournie dans un dossier approuvé prévu pour ses plug-ins ?",
      choix: [
        "Chargement explicite légitime",
        "DLL hijacking",
        "DLL proxying",
        "Pass-the-hash"
      ],
      reponse: 0,
      explication: "Charger un plug-in depuis un dossier prévu et contraint est un fonctionnement normal. Le hijacking suppose un emplacement non prévu et modifiable par un tiers."
    },
    {
      enonce: "Quelle différence entre DLL hijacking, DLL side-loading et DLL proxying ?",
      choix: [
        "Side-loading : DLL déposée à côté d'un exe (souvent signé) qui la charge ; proxying : la DLL malveillante relaie les appels vers la vraie DLL pour rester furtive",
        "Ce sont trois mots strictement identiques",
        "Le proxying ne concerne que le réseau",
        "Le side-loading désactive l'UAC"
      ],
      reponse: 0,
      explication: "Ces termes décrivent des variantes d'une même idée (faire charger une DLL non prévue). Une même chaîne d'exécution peut relever de plusieurs d'entre eux."
    }
  ];

  /* =========================================================
     BANQUE 3 — Corriger et détecter
     (Parties 4 et 5 du TD)
     ========================================================= */
  const correction = [
    {
      enonce: "La version durcie charge la bonne DLL malgré la copie déposée à côté de l'exe. Grâce à quel appel ?",
      choix: [
        "LoadLibraryExW avec des options restreignant les dossiers de recherche",
        "LoadLibraryW sans chemin",
        "rundll32.exe",
        "reg add"
      ],
      reponse: 0,
      explication: "La version durcie remplace l'appel naïf par LoadLibraryExW en limitant explicitement les répertoires de recherche."
    },
    {
      enonce: "Quel appel restreint globalement les dossiers de recherche des DLL pour le processus ?",
      choix: [
        "SetDefaultDllDirectories",
        "GetProcAddress",
        "CreateFile",
        "RegSetValue"
      ],
      reponse: 0,
      explication: "SetDefaultDllDirectories configure les répertoires de recherche par défaut, en retirant notamment le dossier courant et le PATH."
    },
    {
      enonce: "Que font les options LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR et LOAD_LIBRARY_SEARCH_SYSTEM32 ?",
      choix: [
        "Elles limitent la recherche au dossier de la DLL approuvée et à System32",
        "Elles ajoutent le dossier courant et le PATH",
        "Elles désactivent la signature de code",
        "Elles chiffrent la DLL"
      ],
      reponse: 0,
      explication: "Ces drapeaux cantonnent la recherche à des emplacements sûrs : le dossier explicitement désigné pour la DLL et System32. Le dossier de l'exe et le PATH ne sont plus consultés."
    },
    {
      enonce: "Construire un chemin absolu vers la DLL suffit-il si un utilisateur non privilégié peut remplacer le fichier ciblé ?",
      choix: [
        "Non : si le fichier à ce chemin est modifiable, il peut être remplacé par une DLL malveillante",
        "Oui, un chemin absolu est toujours sûr",
        "Oui, car un chemin absolu est signé",
        "Non, mais seulement sous System32"
      ],
      reponse: 0,
      explication: "Un chemin absolu empêche le détournement par l'ordre de recherche, mais pas le remplacement du fichier lui-même si les permissions du dossier sont trop larges."
    },
    {
      enonce: "Quelle commande examine les permissions (ACL) du dossier approuvé des plug-ins ?",
      choix: ["icacls C:\\Lab\\DllHijacking\\hardened\\plugins", "Get-FileHash", "whoami /priv", "Sysmon64.exe -c"],
      reponse: 0,
      explication: "icacls affiche les listes de contrôle d'accès d'un dossier. Un dossier modifiable par un utilisateur standard reste vulnérable, même avec un chemin absolu."
    },
    {
      enonce: "Parmi ces mesures, lesquelles corrigent la CAUSE du hijacking ? (plusieurs réponses)",
      choix: [
        "Chemin absolu vers un dossier approuvé",
        "ACL restrictives empêchant l'écriture par un non-privilégié",
        "Journalisation Sysmon",
        "Alerte EDR"
      ],
      reponse: [0, 1],
      explication: "Chemin contraint + ACL strictes empêchent le détournement. Journalisation et EDR ne font que faciliter la détection : ils n'empêchent pas l'attaque."
    },
    {
      enonce: "Quel événement Sysmon est au cœur de la détection d'un DLL hijacking ?",
      choix: [
        "ID 7 — chargement d'image / DLL",
        "ID 3 — connexion réseau",
        "ID 22 — requête DNS",
        "ID 11 — création de fichier uniquement"
      ],
      reponse: 0,
      explication: "L'événement 7 (Image Loaded) journalise chaque DLL chargée, avec son chemin, son hash et son statut de signature. C'est le pivot de la détection, complété par l'ID 1."
    },
    {
      enonce: "Quels champs relient l'événement Sysmon 7 au processus et à la DLL relevée dans la partie preuves ?",
      choix: [
        "Le ProcessGuid/ProcessId, le chemin de l'image chargée (ImageLoaded) et son hash",
        "Uniquement l'heure",
        "L'adresse IP distante",
        "La taille du journal"
      ],
      reponse: 0,
      explication: "L'ID 7 porte le ProcessGuid/Id du processus, le chemin de la DLL (ImageLoaded) et son hash — de quoi recouper avec le hash obtenu par Get-FileHash."
    },
    {
      enonce: "Pourquoi alerter sur TOUS les événements 7, ou sur toutes les DLL non signées, produit-il trop de faux positifs ?",
      choix: [
        "Des milliers de DLL légitimes se chargent en continu, et beaucoup de logiciels sains ne sont pas signés",
        "Parce que Sysmon ne génère jamais d'ID 7",
        "Parce que les DLL signées sont toujours malveillantes",
        "Parce que l'ID 7 est réservé au réseau"
      ],
      reponse: 0,
      explication: "Le chargement de DLL est massif et normal. Une règle utile combine plusieurs indices : type de processus + emplacement inhabituel de la DLL + statut de signature."
    },
    {
      enonce: "Une bonne règle de détection d'un DLL hijacking combine au minimum…",
      choix: [
        "Le type de processus, l'emplacement de la DLL et son statut de signature",
        "L'heure et la taille du fichier seulement",
        "L'adresse MAC et le port",
        "Le nom d'utilisateur uniquement"
      ],
      reponse: 0,
      explication: "Croiser « quel processus », « quelle DLL et où » et « signée ou non » réduit le bruit : par exemple une DLL non signée chargée depuis un dossier utilisateur par une application sensible."
    }
  ];

  /* =========================================================
     TERMINAL — Rejouer le TD DLL hijacking
     ========================================================= */
  const objectifsTd = [
    {
      enonce: "Vérifiez que **Microsoft Defender** est actif (antivirus et protection en temps réel) avec **Get-MpComputerStatus**.",
      indice: "Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled",
      motifs: ["Get-MpComputerStatus", "AntivirusEnabled"],
      solution: "Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled",
      sortie:
"AntivirusEnabled RealTimeProtectionEnabled\n" +
"---------------- -------------------------\n" +
"            True                      True"
    },
    {
      enonce: "Vérifiez la **signature** de `VulnerableApp.exe` avec **Get-AuthenticodeSignature**.",
      indice: "Get-AuthenticodeSignature .\\vulnerable\\VulnerableApp.exe | Select-Object Status, StatusMessage",
      motifs: ["Get-AuthenticodeSignature", "VulnerableApp\\.exe"],
      solution: "Get-AuthenticodeSignature .\\vulnerable\\VulnerableApp.exe | Select-Object Status, StatusMessage",
      sortie:
"Status     StatusMessage\n" +
"------     -------------\n" +
"NotSigned  Le fichier n'est pas signé numériquement."
    },
    {
      enonce: "Lancez l'**application vulnérable** pour observer la recherche de DLL (le code d'erreur 126 est attendu).",
      indice: "Depuis le dossier vulnerable : .\\VulnerableApp.exe",
      motifs: ["VulnerableApp\\.exe"],
      interdire: ["Get-", "Copy-Item", "Listdlls", "sigcheck", "icacls"],
      solution: ".\\vulnerable\\VulnerableApp.exe",
      sortie:
"[VulnerableApp] Chargement du plug-in epita_plugin.dll...\n" +
"[VulnerableApp] Échec du chargement. Code Win32 : 126 (module introuvable).\n" +
"Appuyez sur Entrée pour quitter."
    },
    {
      enonce: "Mettez en place la **preuve de concept** : copiez la DLL de démonstration dans le dossier `vulnerable`, à côté de l'exécutable, avec **Copy-Item**.",
      indice: "Copy-Item .\\dll\\demonstration\\epita_plugin.dll .\\vulnerable\\epita_plugin.dll",
      motifs: ["Copy-Item", "demonstration", "epita_plugin\\.dll", "vulnerable"],
      solution: "Copy-Item .\\dll\\demonstration\\epita_plugin.dll .\\vulnerable\\epita_plugin.dll",
      sortie: "(aucune sortie — la copie a réussi)"
    },
    {
      enonce: "Relancez l'application, puis **prouvez le module chargé** en listant les DLL du processus avec **ListDLLs**.",
      indice: ".\\Listdlls64.exe -accepteula VulnerableApp.exe",
      motifs: ["Listdlls64\\.exe", "VulnerableApp\\.exe"],
      solution: ".\\Listdlls64.exe -accepteula VulnerableApp.exe",
      sortie:
"ListDLLs v3.2 - List loaded DLLs\n" +
"VulnerableApp.exe pid: 7312\n" +
"Base         Size      Path\n" +
"0x7ff8...    0x12000   C:\\Lab\\DllHijacking\\vulnerable\\epita_plugin.dll\n" +
"-> la DLL chargée vient bien du dossier de l'application"
    },
    {
      enonce: "Examinez le **fichier sur disque** : hash et signature de la DLL déposée, avec **sigcheck**.",
      indice: ".\\sigcheck64.exe -accepteula -a -h -i .\\vulnerable\\epita_plugin.dll",
      motifs: ["sigcheck64\\.exe", "epita_plugin\\.dll"],
      solution: ".\\sigcheck64.exe -accepteula -a -h -i .\\vulnerable\\epita_plugin.dll",
      sortie:
"Sigcheck v2.90 - File version and signature viewer\n" +
"  Verified:  Unsigned\n" +
"  SHA256:    A19F... (comparez avec Get-FileHash)\n" +
"  MachineType: 64-bit"
    },
    {
      enonce: "Côté correctif, examinez les **permissions** (ACL) du dossier approuvé des plug-ins avec **icacls**.",
      indice: "icacls C:\\Lab\\DllHijacking\\hardened\\plugins",
      motifs: ["^icacls\\b", "plugins"],
      solution: "icacls C:\\Lab\\DllHijacking\\hardened\\plugins",
      sortie:
"C:\\Lab\\DllHijacking\\hardened\\plugins BUILTIN\\Users:(OI)(CI)(M)\n" +
"                                        BUILTIN\\Administrators:(OI)(CI)(F)\n" +
"-> (M) = Modify pour Users : le dossier reste modifiable, le correctif est incomplet"
    },
    {
      enonce: "Côté détection, chargez la **configuration Sysmon** du lab avec **Sysmon64.exe -c**.",
      indice: ".\\Sysmon64.exe -c C:\\Lab\\DllHijacking\\sysmon-dll-lab.xml",
      motifs: ["Sysmon64\\.exe", "-c\\b", "sysmon-dll-lab\\.xml"],
      solution: ".\\Sysmon64.exe -c C:\\Lab\\DllHijacking\\sysmon-dll-lab.xml",
      sortie:
"System Monitor v15.0\n" +
"Loading configuration file with schema version 4.82\n" +
"Configuration updated."
    },
    {
      enonce: "Recherchez l'**événement Sysmon 7** (chargement d'image) lié à `DllHijacking` avec **Get-WinEvent**.",
      indice: "Get-WinEvent ... Id = 7 ... | Where-Object Message -Match 'DllHijacking'",
      motifs: ["Get-WinEvent", "DllHijacking", "7"],
      solution: "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-Sysmon/Operational'; Id=7 } | Where-Object Message -Match 'DllHijacking'",
      sortie:
"TimeCreated           Id Message\n" +
"-----------           -- -------\n" +
"01/10/2026 15:04:22    7 Image loaded: ... ImageLoaded: C:\\Lab\\DllHijacking\\vulnerable\\epita_plugin.dll ; Signed: false ; Hash: SHA256=A19F..."
    },
    {
      enonce: "Challenge : le composant manquant de `InventoryAgent.exe` repéré dans ProcMon se nomme `TelemetryCore.dll`. Préparez votre DLL en copiant la DLL de démonstration dans le dossier `challenge` sous ce nom, avec **Copy-Item**.",
      indice: "Copy-Item .\\dll\\demonstration\\epita_plugin.dll .\\challenge\\TelemetryCore.dll",
      motifs: ["Copy-Item", "demonstration", "challenge", "TelemetryCore\\.dll"],
      solution: "Copy-Item C:\\Lab\\DllHijacking\\dll\\demonstration\\epita_plugin.dll C:\\Lab\\DllHijacking\\challenge\\TelemetryCore.dll",
      sortie: "(aucune sortie — renommer la DLL n'empêche pas son chargement, tant que l'architecture et les exports restent compatibles)"
    }
  ];

  /* =========================================================
     Rattachement au cours « systeme-windows »
     ========================================================= */
  const cours = CONTENU["systeme-windows"];

  cours.guides = (cours.guides || []).concat([
    {
      id: "dll-hijacking",
      titre: "Fiche technique — DLL hijacking (TD)",
      badge: "Fiche technique",
      resume: "Le TD DLL hijacking condensé : ordre de recherche, preuve de concept bénigne, trois preuves (ListDLLs, sigcheck, hash), correctif (LoadLibraryExW, ACL) et détection Sysmon. Commandes et pièges.",
      niveau: "Référence",
      sections: [
        { type: "partie", titre: "Comprendre", texte: "Pourquoi une DLL demandée sans chemin peut être détournée." },
        {
          titre: "Chargement et ordre de recherche",
          texte: "Sans chemin, `LoadLibraryW(\"nom.dll\")` déclenche une recherche. Ordre simplifié (mode sûr) :",
          points: [
            "Redirections, API sets, manifestes Side-by-Side.",
            "Modules déjà chargés puis **KnownDLLs** (depuis System32, non détournables).",
            "**Dossier de l'application**, puis **System32**, puis dossier Windows.",
            "**Dossier de travail courant**, puis dossiers du **PATH**."
          ],
          remarque: "Détourner suppose : recherche non contrainte + emplacement modifiable + DLL compatible (architecture et exports)."
        },
        {
          titre: "Observer la recherche avec ProcMon",
          texte: "Filtrez sur l'exécutable, capturez l'exécution, repérez le nom de DLL.",
          code: ".\\vulnerable\\VulnerableApp.exe",
          attention: "Le code Win32 **126** = module introuvable. Un `NAME NOT FOUND` seul ne prouve rien : il faut un emplacement inscriptible ET un chargement réussi."
        },

        { type: "partie", titre: "Démontrer", texte: "Prouver le détournement par trois preuves indépendantes." },
        {
          titre: "Preuve de concept bénigne",
          texte: "Copier la DLL de démonstration à côté de l'exécutable.",
          code: "Copy-Item .\\dll\\demonstration\\epita_plugin.dll .\\vulnerable\\epita_plugin.dll",
          legende: "Déposée dans le dossier de l'app = trouvée en premier"
        },
        {
          titre: "Les trois preuves",
          tableau: {
            entetes: ["Preuve", "Commande / outil"],
            lignes: [
              ["Comportement contrôlé", "Lecture du fichier marqueur écrit par la DLL"],
              ["Module en mémoire", "`Listdlls64.exe VulnerableApp.exe` ou Process Explorer > DLLs"],
              ["Fichier sur disque", "`Get-FileHash`, `Get-AuthenticodeSignature`, `sigcheck64.exe -a -h -i`"]
            ]
          },
          remarque: "Le code de la DLL hérite du contexte du processus victime : pas d'admin « gratuit », mais un impact majeur si la victime est élevée."
        },

        { type: "partie", titre: "Corriger", texte: "Supprimer la cause, pas seulement détecter." },
        {
          titre: "Contraindre la recherche",
          texte: "La version durcie restreint les répertoires consultés.",
          tableau: {
            entetes: ["Élément", "Rôle"],
            lignes: [
              ["`SetDefaultDllDirectories`", "Retire dossier courant et PATH de la recherche"],
              ["`LoadLibraryExW`", "Charge avec options de recherche explicites"],
              ["`LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR`", "Limite au dossier approuvé de la DLL"],
              ["`LOAD_LIBRARY_SEARCH_SYSTEM32`", "Autorise aussi System32"]
            ]
          },
          code: "icacls C:\\Lab\\DllHijacking\\hardened\\plugins",
          attention: "Un chemin absolu ne suffit pas si le fichier visé reste **modifiable** : verrouillez le dossier avec des ACL restrictives."
        },
        {
          titre: "Cause ou détection ?",
          points: [
            "**Corrigent la cause** : chemin contraint, ACL restrictives.",
            "**Aident seulement à détecter** : signature de code, journalisation Sysmon, alerte EDR."
          ]
        },

        { type: "partie", titre: "Détecter", texte: "Une règle utile combine plusieurs indices." },
        {
          titre: "Sysmon — événement 7",
          texte: "L'ID 7 journalise chaque DLL chargée (chemin, hash, signature). L'ID 1 donne le processus.",
          code: "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-Sysmon/Operational'; Id=7 } | Where-Object Message -Match 'DllHijacking'",
          attention: "Alerter sur TOUS les ID 7 ou toutes les DLL non signées = trop de faux positifs. Combinez : processus + emplacement de la DLL + statut de signature."
        }
      ]
    }
  ]);

  cours.chapitres.push({
    id: "dll-hijacking",
    titre: "DLL hijacking (TD)",
    description: "Le TD pas à pas : ordre de recherche des DLL, preuve de concept bénigne, trois preuves, correctif (LoadLibraryExW, ACL) et détection Sysmon.",
    exercices: [
      {
        type: "qcm",
        id: "win-dll-principe",
        titre: "QCM — DLL et ordre de recherche",
        description: "DLL, liaison au chargement vs à l'exécution, ordre de recherche, KnownDLLs, conditions du hijacking, erreur 126 et NAME NOT FOUND.",
        cours: [
          "Mini-cours — pourquoi une DLL peut être détournée (TD, parties 1-2) :",
          [
            "Une **DLL** est du code réutilisable chargé à la demande.",
            "Sans chemin, `LoadLibraryW(\"nom.dll\")` lance une **recherche** : app → System32 → dossier courant → PATH (les **KnownDLLs** restent protégées).",
            "Détourner exige : recherche **non contrainte** + emplacement **modifiable** + DLL **compatible** (architecture + exports).",
            "Le code Win32 **126** = module introuvable ; un **NAME NOT FOUND** seul ne prouve rien."
          ]
        ],
        exemple: {
          titre: "Exemple — l'appel vulnérable",
          texte: "L'application appelle la DLL par son seul nom. Windows doit alors la chercher, dossier de l'exe en premier.",
          code: "LoadLibraryW(L\"epita_plugin.dll\");",
          legende: "Aucun chemin → l'ordre de recherche s'applique",
          note: "Déposer une DLL dans le dossier de l'exe la fait trouver avant la version légitime."
        },
        tirage: 9,
        melangerChoix: true,
        questions: principe
      },
      {
        type: "qcm",
        id: "win-dll-preuve",
        titre: "QCM — Démontrer et qualifier le hijacking",
        description: "Preuve de concept, trois preuves (ListDLLs, sigcheck, hash), privilèges hérités, export RunPlugin, baseline vs hijack, hijacking / side-loading / proxying.",
        cours: [
          "Mini-cours — prouver, puis nommer (TD, partie 3) :",
          [
            "**Trois preuves indépendantes** : comportement contrôlé, module en mémoire (**ListDLLs** / Process Explorer), fichier sur disque (**Get-FileHash**, **sigcheck**).",
            "La DLL doit exporter **RunPlugin** (récupéré par `GetProcAddress`).",
            "Le code **hérite du contexte** du processus victime : pas d'admin automatique.",
            "**Side-loading** (à côté d'un exe signé), **proxying** (relaie vers la vraie DLL) : variantes du même détournement."
          ]
        ],
        exemple: {
          titre: "Exemple — prouver le module chargé",
          texte: "Après la copie de la DLL, ListDLLs affiche son **chemin exact** dans le processus.",
          code: ".\\Listdlls64.exe -accepteula VulnerableApp.exe",
          legende: "Confirme la DLL réellement chargée et son dossier",
          note: "Process Explorer (volet DLLs) donne la même preuve graphiquement."
        },
        tirage: 9,
        melangerChoix: true,
        questions: preuve
      },
      {
        type: "qcm",
        id: "win-dll-correction",
        titre: "QCM — Corriger et détecter",
        description: "SetDefaultDllDirectories, LoadLibraryExW et ses drapeaux, limites du chemin absolu, ACL/icacls, cause vs détection, Sysmon ID 7 et faux positifs.",
        cours: [
          "Mini-cours — supprimer la cause, puis détecter (TD, parties 4-5) :",
          [
            "**SetDefaultDllDirectories** + **LoadLibraryExW** avec `LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR` et `LOAD_LIBRARY_SEARCH_SYSTEM32` cantonnent la recherche.",
            "Un **chemin absolu** ne suffit pas si le fichier reste **modifiable** → verrouiller par **ACL** (`icacls`).",
            "**Corrigent la cause** : chemin contraint + ACL. **Aident à détecter** : signature, Sysmon, EDR.",
            "**Sysmon ID 7** (chargement d'image) est le pivot ; une bonne règle croise processus + emplacement + signature."
          ]
        ],
        exemple: {
          titre: "Exemple — détecter le chargement",
          texte: "On filtre l'événement 7 sur le chemin du lab pour repérer une DLL chargée depuis un dossier inhabituel.",
          code: "Get-WinEvent -FilterHashtable @{ LogName='Microsoft-Windows-Sysmon/Operational'; Id=7 } | Where-Object Message -Match 'DllHijacking'",
          legende: "L'ID 7 porte le chemin, le hash et le statut de signature de la DLL",
          note: "Alerter sur toutes les DLL non signées = trop de bruit : combinez les indices."
        },
        tirage: 9,
        melangerChoix: true,
        questions: correction
      },
      {
        type: "jetpunk",
        id: "win-dll-termes",
        titre: "Outils et termes du DLL hijacking",
        consigne: "Nommez l'outil, l'appel ou le terme décrit sur chaque tuile.",
        temps: 150,
        colonnes: 2,
        melanger: true,
        tirage: 8,
        items: [
          { indice: "Liste les DLL chargées par un processus (ligne de commande)", reponse: "ListDLLs", alt: ["Listdlls64.exe", "Listdlls"] },
          { indice: "Affiche hash et signature d'un fichier (Sysinternals)", reponse: "sigcheck", alt: ["sigcheck64.exe"] },
          { indice: "Observe en direct la recherche de DLL (fichiers/registre)", reponse: "Process Monitor", alt: ["ProcMon", "Procmon64.exe"] },
          { indice: "Appel qui charge une DLL avec des dossiers de recherche restreints", reponse: "LoadLibraryExW", alt: ["LoadLibraryEx"] },
          { indice: "Appel qui retire le dossier courant et le PATH de la recherche", reponse: "SetDefaultDllDirectories" },
          { indice: "Liste protégée de DLL chargées depuis System32, non détournables", reponse: "KnownDLLs" },
          { indice: "Code d'erreur Win32 « module introuvable »", reponse: "126" },
          { indice: "Événement Sysmon du chargement d'une image/DLL", reponse: "ID 7", alt: ["7", "Event 7"] },
          { indice: "Détournement d'une DLL déposée à côté d'un exe souvent signé", reponse: "DLL side-loading", alt: ["side-loading", "sideloading"] },
          { indice: "DLL malveillante qui relaie les appels vers la vraie DLL", reponse: "DLL proxying", alt: ["proxying"] }
        ]
      },
      {
        type: "terminal",
        id: "win-dll-terminal",
        titre: "Terminal — DLL hijacking de bout en bout (TD)",
        description: "Rejouez le TD : observation de la recherche, preuve de concept, trois preuves, puis correctif et détection Sysmon.",
        terminal: "PowerShell — VM EPITA (C:\\Lab\\DllHijacking)",
        invite: "PS C:\\Lab\\DllHijacking>",
        cours: [
          "Tapez chaque commande attendue, puis Entrée. Une sortie réaliste s'affiche quand l'objectif est atteint.",
          ["`help` — un indice", "`solution` — la commande (ne compte pas dans le score)", "`objective` — rappeler l'objectif", "`clear` — vider l'écran"]
        ],
        intro: [
          "Vous êtes dans la **VM de cours**, dossier `C:\\Lab\\DllHijacking`, en test **autorisé**.",
          "Objectif : démontrer un DLL hijacking **strictement bénin** sur une application volontairement vulnérable, le prouver, puis étudier correctif et détection."
        ],
        objectifs: objectifsTd
      }
    ]
  });

})();
