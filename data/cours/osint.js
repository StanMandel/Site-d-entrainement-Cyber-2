/* =============================================================
   Open Source Intelligence (OSINT)
   -------------------------------------------------------------
   Contenu bâti sur le cours « OSINT — Bachelor 2 Cyber, EPITA »
   (C. A. Bouteba) et sur le ticket de phishing étudié en oral.

   Organisation : chaque exercice est un micro-cours (carte
   « Le principe » à gauche) suivi d'un micro-quizz sur ce seul
   concept. Le dernier chapitre rejoue 20 questions tirées au
   hasard dans une banque de 50.

   Les chapitres 3 à 5 sont ajoutés par osint-exercices.js.

   Structure et exemples complets : voir data/cours/_modele.js
   ============================================================= */

(function () {

  /* =========================================================
     CHAPITRE 1 — Le renseignement et ses sources
     ========================================================= */

  const ch1 = {
    id: "ch1",
    titre: "Chapitre 1 — Le renseignement et ses sources",
    description: "Ce que veut dire « intelligence », d'où vient l'information et quelle couleur elle porte.",
    exercices: [

      {
        type: "qcm",
        id: "osint-disciplines",
        titre: "Les disciplines du renseignement",
        description: "HUMINT, SIGINT, IMINT, OSINT.",
        cours: [
          "En cybersécurité, **intelligence** ne veut pas dire « intelligence » mais **renseignement** : une information collectée, évaluée et analysée pour répondre à une question précise.",
          "On classe le renseignement par l'**origine** de l'information :",
          [
            "**HUMINT** — Human Intelligence : origine humaine (un contact, une source, un informateur).",
            "**SIGINT** — Signal Intelligence : origine électromagnétique (radio, interceptions, communications).",
            "**IMINT** — Imagery Intelligence : origine image (satellite, photographies, Google Maps).",
            "**OSINT** — Open Source Intelligence : origine source ouverte (web, journaux, registres publics)."
          ],
          "Une donnée brute n'est pas du renseignement : il faut la **collecter**, l'**évaluer** puis l'**analyser** pour qu'elle réponde à une question."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Dans le vocabulaire du renseignement, que signifie le mot « intelligence » ?",
            choix: ["Renseignement", "Intelligence artificielle", "Capacité d'analyse d'un agent", "Quotient intellectuel"],
            reponse: 0,
            explication: "C'est un anglicisme : intelligence = renseignement."
          },
          {
            enonce: "Quelle discipline désigne le renseignement d'origine humaine ?",
            choix: ["HUMINT", "SIGINT", "IMINT", "OSINT"],
            reponse: 0,
            explication: "HUMINT = Human Intelligence : la source est une personne."
          },
          {
            enonce: "Une écoute de communications radio relève de quelle discipline ?",
            choix: ["SIGINT", "IMINT", "HUMINT", "OSINT"],
            reponse: 0,
            explication: "SIGINT = Signal Intelligence, renseignement d'origine électromagnétique."
          },
          {
            enonce: "Une photographie satellite exploitée pour identifier un site industriel relève de :",
            choix: ["IMINT", "SIGINT", "HUMINT", "OSINT"],
            reponse: 0,
            explication: "IMINT = Imagery Intelligence, renseignement d'origine image."
          },
          {
            enonce: "Que signifie exactement le sigle OSINT ?",
            choix: [
              "Open Source Intelligence",
              "Operating System Intelligence",
              "Online Security Intelligence",
              "Open Search Investigation"
            ],
            reponse: 0,
            explication: "OSINT = Open Source Intelligence, le renseignement d'origine source ouverte."
          },
          {
            enonce: "Quelles étapes transforment une information publique en renseignement ?",
            choix: ["La collecte", "L'évaluation", "L'analyse", "Le chiffrement"],
            reponse: [0, 1, 2],
            explication: "Collecter, évaluer, analyser : le chiffrement n'a rien à voir avec la production de renseignement."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-sources",
        titre: "Sources ouvertes et sources fermées",
        description: "Le critère du plein gré, et la répartition 70 / 30.",
        cours: [
          "Le critère qui tranche est simple : **la source a-t-elle délivré l'information de son plein gré ?**",
          [
            "**Oui** → information **ouverte**.",
            "**Non** → information **fermée**."
          ],
          "Deux types de sources en découlent :",
          [
            "**Sources ouvertes** : accès facile et large, elles représentent environ **70 %** de l'information disponible.",
            "**Sources fermées** : accès protégé, ou sources licites mais difficiles à approcher et à formaliser (sources informelles) — environ **30 %**."
          ],
          "L'OSINT est la collecte d'information **en source ouverte** : c'est donc la plus grande part du gisement, et celle qui ne laisse pratiquement aucune trace chez la cible."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quel critère distingue une information ouverte d'une information fermée ?",
            choix: [
              "La source l'a-t-elle délivrée de son plein gré ?",
              "L'information est-elle gratuite ?",
              "L'information est-elle en ligne ?",
              "L'information est-elle rédigée en clair ?"
            ],
            reponse: 0,
            explication: "Le plein gré de la source est le critère retenu : le prix ou le support ne changent rien."
          },
          {
            enonce: "Quelle part de l'information disponible provient des sources ouvertes ?",
            choix: ["Environ 70 %", "Environ 30 %", "Environ 50 %", "Environ 95 %"],
            reponse: 0,
            explication: "Les sources ouvertes couvrent environ 70 % de l'information, les sources fermées les 30 % restants."
          },
          {
            enonce: "Une source fermée est nécessairement illégale à consulter.",
            choix: [
              "Faux : elle peut être licite, mais difficile à approcher ou à formaliser",
              "Vrai : toute source fermée est interdite",
              "Vrai, sauf pour les forces de l'ordre",
              "Faux : une source fermée est toujours payante"
            ],
            reponse: 0,
            explication: "Les sources informelles sont fermées mais licites : leur difficulté tient à l'accès et à la formalisation."
          },
          {
            enonce: "Comment définit-on l'OSINT en une phrase ?",
            choix: [
              "La collecte d'information en source ouverte",
              "L'intrusion discrète dans un système d'information",
              "L'analyse de journaux système après incident",
              "La surveillance des communications d'une cible"
            ],
            reponse: 0,
            explication: "OSINT = collecte d'information en source ouverte, rien de plus, rien de moins."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-couleurs",
        titre: "Informations blanche, grise et noire",
        description: "Les trois couleurs de l'information et la règle des 95 %.",
        cours: [
          "On classe l'information en **trois couleurs**, selon la difficulté et la licéité de son accès :",
          [
            "**Information blanche** : aisément et licitement accessible. Elle représente environ **95 %** des informations.",
            "**Information grise** : licitement accessible, mais difficile — soit parce qu'on ignore son existence, soit parce que le chemin d'accès est compliqué.",
            "**Information noire** : à diffusion restreinte, dont l'accès ou l'usage est **explicitement protégé**."
          ],
          "Un travail d'OSINT vit du blanc et du gris. Le noir sort du cadre : y toucher n'est plus de la collecte en source ouverte."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quelle information est « aisément et licitement accessible » ?",
            choix: ["L'information blanche", "L'information grise", "L'information noire", "L'information rouge"],
            reponse: 0,
            explication: "Blanche = accès facile et licite."
          },
          {
            enonce: "Quelle part des informations est blanche ?",
            choix: ["Environ 95 %", "Environ 70 %", "Environ 50 %", "Environ 30 %"],
            reponse: 0,
            explication: "Environ 95 % des informations sont blanches ; le gris et le noir se partagent le reste."
          },
          {
            enonce: "Qu'est-ce qui caractérise l'information grise ?",
            choix: [
              "Elle est licitement accessible, mais son existence ou son accès sont difficiles à connaître",
              "Elle est interdite d'accès par la loi",
              "Elle est publiée par l'entreprise elle-même",
              "Elle n'existe que sur le dark web"
            ],
            reponse: 0,
            explication: "Le gris reste licite : c'est la difficulté qui le distingue du blanc."
          },
          {
            enonce: "Une note interne marquée « diffusion restreinte » appartient à quelle catégorie ?",
            choix: ["Information noire", "Information grise", "Information blanche", "Information ouverte"],
            reponse: 0,
            explication: "Accès ou usage explicitement protégé : c'est de l'information noire."
          },
          {
            enonce: "Sur quelles couleurs un travail d'OSINT s'appuie-t-il légitimement ?",
            choix: ["La blanche", "La grise", "La noire", "Aucune des trois"],
            reponse: [0, 1],
            explication: "Le blanc et le gris restent licites ; le noir sort du cadre de la source ouverte."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-usages",
        titre: "À quoi sert l'OSINT ?",
        description: "Les cinq usages retenus par le cours.",
        cours: [
          "L'OSINT n'est pas réservé aux attaquants. Le cours retient cinq usages :",
          [
            "**Rechercher des informations ciblées** sur un sujet, une personne, une organisation.",
            "**Vérifier l'exposition de ses propres informations** : ce qu'un attaquant trouverait sur vous.",
            "**Se prémunir de l'ingénierie sociale** en sachant ce qui circule sur ses employés.",
            "**Cartographier son environnement** : partenaires, fournisseurs, surface d'attaque.",
            "**Mettre en place une veille** : réputationnelle, concurrentielle, législative."
          ],
          "Le même travail sert donc à l'attaque et à la défense : c'est la posture qui change, pas la méthode."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quels usages de l'OSINT sont cités par le cours ?",
            choix: [
              "Vérifier l'exposition de ses propres informations",
              "Cartographier son environnement",
              "Mettre en place une veille réputationnelle ou concurrentielle",
              "Chiffrer les sauvegardes de l'entreprise"
            ],
            reponse: [0, 1, 2],
            explication: "Le chiffrement des sauvegardes est une mesure de protection, pas un usage de l'OSINT."
          },
          {
            enonce: "Un RSSI recherche ce qu'un attaquant pourrait trouver sur ses employés. Quel usage met-il en œuvre ?",
            choix: [
              "Se prémunir de l'ingénierie sociale",
              "Une reconnaissance active",
              "Une analyse forensique",
              "Un test de restauration"
            ],
            reponse: 0,
            explication: "Connaître ce qui circule sur ses employés, c'est réduire la matière disponible pour une attaque par ingénierie sociale."
          },
          {
            enonce: "L'OSINT ne sert qu'aux attaquants.",
            choix: [
              "Faux : la défense l'utilise pour mesurer son exposition et faire de la veille",
              "Vrai : c'est une technique offensive",
              "Vrai, sauf pour les journalistes",
              "Faux : seuls les États peuvent en faire"
            ],
            reponse: 0,
            explication: "Attaque et défense emploient la même méthode ; seul l'objectif diffère."
          },
          {
            enonce: "Quel type de veille n'est PAS cité parmi les usages de l'OSINT ?",
            choix: ["La veille médicale", "La veille réputationnelle", "La veille concurrentielle", "La veille législative"],
            reponse: 0,
            explication: "Le cours cite les veilles réputationnelle, concurrentielle et législative."
          }
        ]
      }

    ]
  };

  /* =========================================================
     CHAPITRE 2 — La Cyber Kill Chain
     ========================================================= */

  const ch2 = {
    id: "ch2",
    titre: "Chapitre 2 — La Cyber Kill Chain",
    description: "Les sept phases d'une attaque, et la place qu'y tient l'OSINT.",
    exercices: [

      {
        type: "qcm",
        id: "osint-kc-phases",
        titre: "Les sept phases",
        description: "L'enchaînement complet, de la reconnaissance aux actions sur les objectifs.",
        cours: [
          "La **Cyber Kill Chain** découpe une attaque en sept phases successives :",
          [
            "**1. Reconnaissance** — découvrir et collecter des informations sur la cible.",
            "**2. Armement** — fabriquer ou acquérir l'arme (malware + exploit).",
            "**3. Livraison** — transmettre la charge utile à la victime.",
            "**4. Exploitation** — déclencher l'arme et obtenir un accès initial.",
            "**5. Installation** — poser une persistance pour garder l'accès.",
            "**6. Commandement & contrôle (C2)** — piloter l'hôte compromis à distance.",
            "**7. Actions sur les objectifs** — collecter, exfiltrer, détruire."
          ],
          "L'OSINT occupe la **phase 1** : tout ce qui suit s'appuie sur la qualité de cette reconnaissance."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Combien de phases compte la Cyber Kill Chain ?",
            choix: ["7", "5", "6", "9"],
            reponse: 0,
            explication: "Sept phases, de la reconnaissance aux actions sur les objectifs."
          },
          {
            enonce: "Quelle est la première phase de la Cyber Kill Chain ?",
            choix: ["La reconnaissance", "L'armement", "La livraison", "L'exploitation"],
            reponse: 0,
            explication: "Tout commence par la reconnaissance : découverte et planification."
          },
          {
            enonce: "Quelle phase suit immédiatement l'armement ?",
            choix: ["La livraison", "L'exploitation", "L'installation", "La reconnaissance"],
            reponse: 0,
            explication: "Reconnaissance → Armement → Livraison → Exploitation → Installation → C2 → Actions sur les objectifs."
          },
          {
            enonce: "Dans quelle phase de la Kill Chain l'OSINT intervient-il principalement ?",
            choix: ["La reconnaissance", "L'installation", "Le commandement & contrôle", "Les actions sur les objectifs"],
            reponse: 0,
            explication: "L'OSINT alimente la phase de reconnaissance, celle de la découverte et de la planification."
          },
          {
            enonce: "Quelle est la dernière phase de la chaîne ?",
            choix: ["Les actions sur les objectifs", "Le commandement & contrôle", "L'installation", "L'exfiltration des sauvegardes"],
            reponse: 0,
            explication: "La phase 7, « actions sur les objectifs », est l'aboutissement de l'attaque."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-kc-reconnaissance",
        titre: "Phase 1 — Reconnaissance passive ou active",
        description: "Observer sans toucher, ou interagir avec la cible.",
        cours: [
          "La reconnaissance est la phase de **découverte et de planification** de l'adversaire. Elle se mène de deux façons :",
          [
            "**Reconnaissance passive** — l'attaquant observe **sans interagir** avec la cible : recherche Google, LinkedIn, collecte d'adresses e-mail, analyse DNS, `whois`, fuites de données. C'est le terrain de l'OSINT.",
            "**Reconnaissance active** — l'attaquant **interagit directement** avec les systèmes : scan de ports (`nmap`), analyse des services exposés, fingerprinting des versions, tests de vulnérabilités."
          ],
          "La différence tient au **contact** : le passif ne laisse pas de trace dans les journaux de la cible, l'actif si.",
          "Un attaquant sophistiqué peut commencer sans même savoir quelle entreprise il visera : c'est la reconnaissance qui désigne la victime."
        ],
        exemple: {
          titre: "Exemple",
          legende: "Passif contre actif",
          code: "whois exemple.fr            # passif : on interroge un registre public\ndig exemple.fr ANY          # passif : resolution DNS publique\nnmap -sV 203.0.113.10       # ACTIF : on touche la machine de la cible"
        },
        melangerChoix: true,
        questions: [
          {
            enonce: "Qu'est-ce qui distingue la reconnaissance passive de la reconnaissance active ?",
            choix: [
              "L'interaction directe avec les systèmes de la cible",
              "L'utilisation d'outils en ligne de commande",
              "Le fait de viser une personne plutôt qu'une machine",
              "Le caractère légal de la démarche"
            ],
            reponse: 0,
            explication: "En passif on observe sans toucher ; en actif on interagit avec les systèmes de la cible."
          },
          {
            enonce: "Un scan de ports avec nmap relève de :",
            choix: ["La reconnaissance active", "La reconnaissance passive", "La phase d'armement", "La phase de livraison"],
            reponse: 0,
            explication: "Le scan interroge directement les machines de la cible : c'est de l'actif."
          },
          {
            enonce: "Lesquelles de ces actions sont de la reconnaissance passive ?",
            choix: [
              "Énumérer les profils LinkedIn des employés",
              "Interroger le whois d'un domaine",
              "Consulter une fuite de données publiée sur le dark web",
              "Tester les versions logicielles d'un serveur exposé"
            ],
            reponse: [0, 1, 2],
            explication: "Le fingerprinting des versions suppose d'interroger le serveur : c'est de l'actif."
          },
          {
            enonce: "Pourquoi la reconnaissance passive est-elle privilégiée au début d'une attaque ?",
            choix: [
              "Elle ne laisse pas de trace dans les journaux de la cible",
              "Elle est plus rapide qu'un scan de ports",
              "Elle donne des informations plus techniques",
              "Elle est la seule à être automatisable"
            ],
            reponse: 0,
            explication: "Sans interaction, il n'y a rien à journaliser côté cible : l'attaquant reste invisible."
          },
          {
            enonce: "Quel est l'objectif de la phase de reconnaissance ?",
            choix: [
              "Découvrir et collecter des informations sur le système et sur la victime",
              "Installer une porte dérobée",
              "Chiffrer les données de la victime",
              "Ouvrir un canal de commande à distance"
            ],
            reponse: 0,
            explication: "C'est la phase de découverte et de planification pour l'adversaire."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-kc-armement-livraison",
        titre: "Phases 2 et 3 — Armement et livraison",
        description: "Fabriquer l'arme, puis la faire parvenir à la victime.",
        cours: [
          { titre: "Phase 2 — Armement" },
          "L'adversaire fabrique ou acquiert une **arme** (malware + exploit) prête à être livrée. Deux voies :",
          [
            "**Achat / réutilisation** : outils automatisés de génération ou de modification de malwares, échantillons achetés sur des marchés clandestins du dark web — rapide.",
            "**Développement sur-mesure** : les acteurs sophistiqués (APT, groupes sponsorisés) écrivent un malware unique pour échapper aux détections par signature."
          ],
          { titre: "Phase 3 — Livraison" },
          "Transmettre la charge utile pour qu'elle s'exécute chez la cible :",
          [
            "**Hameçonnage** (phishing / spear-phishing) : courriel piégé, pièce jointe avec macro, archive, lien de téléchargement. Le spear-phishing est hautement ciblé (nom, rôle, contexte social).",
            "**USB piégée** (USB drop, baiting) : clés infectées déposées ou envoyées, qui exploitent la curiosité.",
            "**Attaque watering-hole** : compromission d'un site fréquenté par la cible (fournisseur, forum, portail métier)."
          ],
          "L'OSINT de la phase 1 nourrit directement la phase 3 : sans contexte social, pas de spear-phishing crédible."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Que désigne l'« arme » de la phase d'armement ?",
            choix: [
              "La combinaison d'un malware et d'un exploit",
              "Le serveur de commande et contrôle",
              "La liste des adresses e-mail collectées",
              "Le compte à privilèges volé"
            ],
            reponse: 0,
            explication: "L'arme prépare la charge utile utilisée lors de l'exploitation : malware + exploit."
          },
          {
            enonce: "Pourquoi un groupe APT développe-t-il un malware sur-mesure ?",
            choix: [
              "Pour rendre l'échantillon unique et échapper à la détection par signature",
              "Pour réduire le coût de l'attaque",
              "Pour éviter d'avoir à faire de la reconnaissance",
              "Parce que le dark web ne vend pas de charges utiles"
            ],
            reponse: 0,
            explication: "Un échantillon unique n'a pas de signature connue des moteurs de détection."
          },
          {
            enonce: "Qu'est-ce qu'une attaque watering-hole ?",
            choix: [
              "La compromission d'un site fréquenté par la cible, pour la rediriger vers un chargeur malveillant",
              "L'envoi massif de courriels piégés",
              "Le dépôt de clés USB infectées dans un parking",
              "L'interception du trafic Wi-Fi d'un café"
            ],
            reponse: 0,
            explication: "On empoisonne le point d'eau : un site que la cible visite de toute façon."
          },
          {
            enonce: "Qu'est-ce qui distingue le spear-phishing du phishing ordinaire ?",
            choix: [
              "Il est hautement ciblé : nom, rôle et contexte social de la victime",
              "Il utilise obligatoirement une pièce jointe",
              "Il est envoyé depuis un domaine légitime",
              "Il vise uniquement les dirigeants"
            ],
            reponse: 0,
            explication: "Le spear-phishing exploite les informations recueillies sur la personne visée."
          },
          {
            enonce: "Le baiting par clé USB exploite avant tout :",
            choix: [
              "La curiosité et la confiance humaine",
              "Une vulnérabilité du noyau Windows",
              "Un défaut de configuration du pare-feu",
              "Une faille du protocole USB"
            ],
            reponse: 0,
            explication: "C'est une technique d'appât : la faille visée est humaine."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-kc-exploitation-installation",
        titre: "Phases 4 et 5 — Exploitation et installation",
        description: "Obtenir l'accès initial, puis ne plus le perdre.",
        cours: [
          { titre: "Phase 4 — Exploitation" },
          "L'arme se déclenche : l'attaquant exploite une vulnérabilité **technique ou humaine** pour obtenir un **accès initial**.",
          [
            "**Exploitation de vulnérabilités** logicielles, système ou serveur — exécution de code.",
            "**Élévation de privilèges** : un bug ou une mauvaise configuration donne des droits administrateur.",
            "**Mouvement latéral** : progresser dans le réseau vers les ressources sensibles.",
            "**Vulnérabilités web** : référence au **Top 10 OWASP**.",
            "**Exploit zero-day** : vulnérabilité inconnue, donc sans signature détectable."
          ],
          { titre: "Phase 5 — Installation" },
          "Poser une **persistance** (porte dérobée) pour garder l'accès même si l'accès initial est perdu ou corrigé :",
          [
            "**Service Windows** malveillant démarré automatiquement (MITRE T1543.003).",
            "**Entrées de démarrage / clés de registre** exécutées à l'ouverture de session.",
            "**Web shell** (PHP, ASP, JSP) déposé sur un serveur web.",
            "**Tâche planifiée** relançant périodiquement la charge utile."
          ],
          "Le **timestomping** — modification des horodatages des fichiers — accompagne souvent l'installation pour compliquer l'analyse."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Qu'est-ce qu'un exploit zero-day ?",
            choix: [
              "L'exploitation d'une vulnérabilité inconnue, sans signature détectable",
              "Un exploit qui s'exécute en moins d'une seconde",
              "Un exploit acheté le jour même sur le dark web",
              "Une attaque menée le premier jour d'un test d'intrusion"
            ],
            reponse: 0,
            explication: "La vulnérabilité n'est pas connue : aucune signature ni correctif n'existe."
          },
          {
            enonce: "À quoi sert le mouvement latéral ?",
            choix: [
              "Progresser dans le réseau après compromission, vers des ressources sensibles",
              "Élever ses privilèges sur la machine compromise",
              "Masquer les horodatages des fichiers",
              "Établir le canal de commande et contrôle"
            ],
            reponse: 0,
            explication: "C'est une technique post-compromission de progression dans le réseau."
          },
          {
            enonce: "Quel est l'objectif de la phase d'installation ?",
            choix: [
              "Conserver un accès durable même si l'accès initial est perdu",
              "Découvrir les adresses e-mail des employés",
              "Chiffrer les données pour demander une rançon",
              "Contourner le pare-feu périmétrique"
            ],
            reponse: 0,
            explication: "L'installation pose la persistance : une porte dérobée qui survit au correctif."
          },
          {
            enonce: "Lesquelles de ces techniques servent la persistance ?",
            choix: [
              "Créer un service Windows malveillant",
              "Déposer un web shell sur un serveur",
              "Ajouter une tâche planifiée qui relance l'implant",
              "Scanner les ports de la cible"
            ],
            reponse: [0, 1, 2],
            explication: "Le scan de ports appartient à la reconnaissance active, pas à l'installation."
          },
          {
            enonce: "Qu'est-ce que le timestomping ?",
            choix: [
              "La modification des horodatages des fichiers pour masquer les traces",
              "L'effacement complet des journaux système",
              "L'horodatage cryptographique d'une preuve numérique",
              "La synchronisation du malware avec un serveur NTP"
            ],
            reponse: 0,
            explication: "En altérant les dates, l'attaquant complique la reconstitution de la chronologie."
          },
          {
            enonce: "La phase d'exploitation ne concerne que les vulnérabilités techniques.",
            choix: [
              "Faux : elle inclut l'exploitation de la vulnérabilité humaine",
              "Vrai : seul un exploit logiciel permet l'accès initial",
              "Vrai, sauf dans le cas du phishing",
              "Faux : elle ne concerne que la vulnérabilité humaine"
            ],
            reponse: 0,
            explication: "Un utilisateur qui ouvre une macro et donne ses identifiants est le vecteur d'exploitation."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-kc-c2-objectifs",
        titre: "Phases 6 et 7 — C2 et actions sur les objectifs",
        description: "Piloter à distance, puis frapper.",
        cours: [
          { titre: "Phase 6 — Commandement & contrôle (C2)" },
          "Un canal de **Command & Control** relie l'hôte compromis à l'adversaire. Il repose sur des communications régulières appelées **beacons**. Une fois la connexion établie, l'attaquant exécute des commandes, exfiltre des données, déploie d'autres charges.",
          [
            "**DNS tunneling** : des requêtes DNS périodiques servent de canal de commande et d'exfiltration.",
            "**Protocoles standards personnalisés** : encapsulation dans du TCP/UDP sur des ports usuels pour se fondre dans le trafic.",
            "**Services cloud et API publiques** (GitHub, Drive, Slack…) détournés en relais C2."
          ],
          { titre: "Phase 7 — Actions sur les objectifs" },
          "Avec un accès hands-on-keyboard, l'attaquant atteint enfin son but :",
          [
            "**Collecte et exfiltration** de données sensibles (PII, secrets, bases clients) par canaux chiffrés ou fragmentés.",
            "**Suppression des sauvegardes et des Shadow Copies** pour empêcher toute restauration.",
            "**Sabotage opérationnel** : services coupés, journaux effacés, processus métiers perturbés."
          ]
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Que sont les beacons d'un canal C2 ?",
            choix: [
              "Des communications régulières de l'hôte infecté vers le serveur de l'attaquant",
              "Les signatures antivirales du malware",
              "Les identifiants volés sur la machine",
              "Les paquets du scan de ports initial"
            ],
            reponse: 0,
            explication: "L'implant « appelle » périodiquement le serveur pour récupérer ses ordres."
          },
          {
            enonce: "Pourquoi le DNS tunneling est-il un canal C2 efficace ?",
            choix: [
              "Le trafic DNS est banal et rarement bloqué en sortie",
              "Le DNS est chiffré par défaut",
              "Le DNS permet d'ouvrir des ports en écoute",
              "Le DNS n'est jamais journalisé"
            ],
            reponse: 0,
            explication: "Le DNS sort presque toujours du réseau : il se fond dans le trafic légitime."
          },
          {
            enonce: "Pourquoi un attaquant supprime-t-il les Shadow Copies avant de chiffrer ?",
            choix: [
              "Pour empêcher la restauration des fichiers",
              "Pour accélérer le chiffrement",
              "Pour effacer les journaux d'événements",
              "Pour élever ses privilèges"
            ],
            reponse: 0,
            explication: "Sans instantanés ni sauvegardes, la victime ne peut plus revenir en arrière."
          },
          {
            enonce: "Quelles actions relèvent de la phase 7 ?",
            choix: [
              "L'exfiltration de la base clients",
              "L'effacement des journaux",
              "La suppression des sauvegardes locales",
              "L'achat d'un kit d'exploitation"
            ],
            reponse: [0, 1, 2],
            explication: "L'achat d'un kit d'exploitation appartient à la phase 2, l'armement."
          },
          {
            enonce: "Pourquoi un attaquant abuse-t-il de services cloud légitimes comme relais C2 ?",
            choix: [
              "Le trafic vers ces services est courant et difficile à distinguer du légitime",
              "Ces services chiffrent automatiquement les malwares",
              "Ils permettent d'éviter la phase d'installation",
              "Ils offrent une adresse IP anonyme garantie"
            ],
            reponse: 0,
            explication: "Bloquer GitHub ou Drive coûterait cher à l'entreprise : le trafic passe donc sans alerte."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-kc-classement",
        titre: "Classer une action dans la Kill Chain",
        description: "Quatorze actions d'attaque à ranger dans la bonne phase.",
        cours: [
          "Pour chaque action, une seule phase convient. Le repère utile est la **question à laquelle l'action répond** :",
          [
            "Qui est la cible et que possède-t-elle ? → **Reconnaissance**.",
            "Avec quoi vais-je frapper ? → **Armement**.",
            "Comment la charge arrive-t-elle chez elle ? → **Livraison**.",
            "Comment s'exécute-t-elle ? → **Exploitation**.",
            "Comment garder l'accès ? → **Installation**.",
            "Comment piloter la machine ? → **Commandement & contrôle**.",
            "Qu'est-ce que j'emporte ou je détruis ? → **Actions sur les objectifs**."
          ]
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "`whois` et interrogation DNS du domaine cible.",
            choix: ["Reconnaissance", "Armement", "Livraison", "Exploitation"],
            reponse: 0,
            explication: "Collecte d'informations publiques sur la cible, sans contact avec ses systèmes."
          },
          {
            enonce: "Énumération des profils LinkedIn des employés.",
            choix: ["Reconnaissance", "Livraison", "Installation", "Actions sur les objectifs"],
            reponse: 0,
            explication: "Reconnaissance passive : on cartographie l'organisation et ses personnes."
          },
          {
            enonce: "Kit d'attaque automatisé personnalisé pour la cible.",
            choix: ["Armement", "Reconnaissance", "Exploitation", "Commandement & contrôle"],
            reponse: 0,
            explication: "On fabrique ou on adapte l'arme : c'est la phase 2."
          },
          {
            enonce: "Malware compilé et empaqueté avec un crypter, pour produire un binaire unique.",
            choix: ["Armement", "Installation", "Livraison", "Exploitation"],
            reponse: 0,
            explication: "Rendre l'échantillon unique pour échapper aux signatures relève de l'armement."
          },
          {
            enonce: "Courriel de spear-phishing avec une pièce jointe .docx à macros.",
            choix: ["Livraison", "Armement", "Exploitation", "Reconnaissance"],
            reponse: 0,
            explication: "Le courriel transporte la charge utile jusqu'à la victime."
          },
          {
            enonce: "Clé USB au logo de l'entreprise abandonnée à l'accueil.",
            choix: ["Livraison", "Reconnaissance", "Installation", "Armement"],
            reponse: 0,
            explication: "USB baiting : un moyen d'acheminer la charge utile."
          },
          {
            enonce: "Exploitation d'une CVE sur une application web exposée sur Internet.",
            choix: ["Exploitation", "Livraison", "Armement", "Commandement & contrôle"],
            reponse: 0,
            explication: "La vulnérabilité est déclenchée pour obtenir l'accès initial."
          },
          {
            enonce: "Attaque par credential stuffing contre le portail de connexion de l'entreprise.",
            choix: ["Exploitation", "Reconnaissance", "Installation", "Actions sur les objectifs"],
            reponse: 0,
            explication: "On se sert d'identifiants pour obtenir un accès : c'est l'exploitation."
          },
          {
            enonce: "Web shell déposé dans /uploads/admin.php sur le site d'un fournisseur.",
            choix: ["Installation", "Livraison", "Commandement & contrôle", "Exploitation"],
            reponse: 0,
            explication: "Le web shell est une porte dérobée : il assure la persistance."
          },
          {
            enonce: "Tâche planifiée nommée « Windows Update » qui lance la charge au démarrage.",
            choix: ["Installation", "Armement", "Exploitation", "Actions sur les objectifs"],
            reponse: 0,
            explication: "Persistance par tâche planifiée, avec un nom trompeur."
          },
          {
            enonce: "Beacons HTTPS périodiques vers updates.example-attacker.com.",
            choix: ["Commandement & contrôle", "Installation", "Livraison", "Reconnaissance"],
            reponse: 0,
            explication: "Des rappels réguliers vers un serveur contrôlé : c'est le canal C2."
          },
          {
            enonce: "Tunnel DNS exfiltrant de petits fragments de données vers le serveur DNS de l'attaquant.",
            choix: ["Commandement & contrôle", "Actions sur les objectifs", "Installation", "Exploitation"],
            reponse: 0,
            explication: "Le DNS tunneling est cité comme canal de commande et d'exfiltration du C2."
          },
          {
            enonce: "Exfiltration de la base clients par SFTP vers un hôte contrôlé par l'attaquant.",
            choix: ["Actions sur les objectifs", "Commandement & contrôle", "Installation", "Livraison"],
            reponse: 0,
            explication: "L'attaquant emporte enfin ce qu'il était venu chercher."
          },
          {
            enonce: "Suppression des Shadow Copies et des sauvegardes locales.",
            choix: ["Actions sur les objectifs", "Installation", "Exploitation", "Armement"],
            reponse: 0,
            explication: "Maximiser l'impact en empêchant la restauration : phase 7."
          }
        ]
      }

    ]
  };

  CONTENU["osint"] = { chapitres: [ch1, ch2] };

})();
