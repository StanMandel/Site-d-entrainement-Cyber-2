/* =============================================================
   Open Source Intelligence (OSINT)
   -------------------------------------------------------------
   Contenu bâti sur le cours « OSINT — Bachelor 2 Cyber, EPITA »
   (C. A. Bouteba) et sur le ticket de phishing étudié en oral.

   Chapitre 1 : quatre QCM courts qui résument tout le cours
   théorique. Les chapitres 2 et 3 (enquêtes pratiques, type
   « enquete ») sont ajoutés par osint-exercices.js.

   Structure et exemples complets : voir data/cours/_modele.js
   ============================================================= */

(function () {

  const ch1 = {
    id: "ch1",
    titre: "Chapitre 1 — Les fondamentaux",
    description: "Le renseignement, la Kill Chain, les outils et l'ingénierie sociale, en quatre QCM.",
    exercices: [

      {
        type: "qcm",
        id: "osint-renseignement",
        titre: "Le renseignement en sources ouvertes",
        description: "Disciplines, sources, couleurs de l'information, usages.",
        cours: [
          "**Intelligence** = **renseignement** : une information collectée, évaluée et analysée pour répondre à une question.",
          "On classe le renseignement par l'**origine** de l'information :",
          [
            "**HUMINT** : origine humaine (une source, un informateur).",
            "**SIGINT** : origine électromagnétique (interceptions).",
            "**IMINT** : origine image (satellite, photographies).",
            "**OSINT** : origine **source ouverte** (web, presse, registres publics)."
          ],
          "Une information est **ouverte** si la source l'a délivrée **de son plein gré** (environ **70 %** de l'information disponible), **fermée** sinon (environ 30 %).",
          "Trois couleurs selon l'accès :",
          [
            "**Blanche** : accès facile et licite, environ **95 %** des informations.",
            "**Grise** : licite mais difficile à trouver ou à atteindre.",
            "**Noire** : accès ou usage explicitement protégé, hors du cadre de l'OSINT."
          ],
          "L'OSINT sert autant à la défense qu'à l'attaque : mesurer son exposition, se prémunir de l'ingénierie sociale, cartographier son environnement, faire de la veille."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Une photographie satellite exploitée pour identifier un site industriel relève de :",
            choix: ["IMINT", "SIGINT", "HUMINT", "OSINT"],
            reponse: 0,
            explication: "IMINT = Imagery Intelligence, renseignement d'origine image."
          },
          {
            enonce: "Quel critère distingue une information ouverte d'une information fermée ?",
            choix: [
              "La source l'a-t-elle délivrée de son plein gré ?",
              "L'information est-elle gratuite ?",
              "L'information est-elle en ligne ?",
              "L'information est-elle rédigée en clair ?"
            ],
            reponse: 0,
            explication: "Le plein gré de la source est le seul critère : le prix ou le support ne changent rien."
          },
          {
            enonce: "Quelle part des informations est blanche ?",
            choix: ["Environ 95 %", "Environ 70 %", "Environ 50 %", "Environ 30 %"],
            reponse: 0,
            explication: "95 % de blanc ; ne pas confondre avec les 70 % de sources ouvertes."
          },
          {
            enonce: "Une note interne marquée « diffusion restreinte » est une information :",
            choix: ["Noire", "Grise", "Blanche", "Ouverte"],
            reponse: 0,
            explication: "Accès ou usage explicitement protégé : c'est de l'information noire."
          },
          {
            enonce: "Quels usages de l'OSINT sont cités par le cours ?",
            choix: [
              "Vérifier l'exposition de ses propres informations",
              "Cartographier son environnement",
              "Mettre en place une veille concurrentielle",
              "Chiffrer les sauvegardes de l'entreprise"
            ],
            reponse: [0, 1, 2],
            explication: "Le chiffrement des sauvegardes est une mesure de protection, pas un usage de l'OSINT."
          },
          {
            enonce: "Quelles étapes transforment une information publique en renseignement ?",
            choix: ["La collecte", "L'évaluation", "L'analyse", "Le chiffrement"],
            reponse: [0, 1, 2],
            explication: "Collecter, évaluer, analyser."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-kill-chain",
        titre: "La Cyber Kill Chain",
        description: "Les sept phases d'une attaque et la place de l'OSINT.",
        cours: [
          "La **Cyber Kill Chain** découpe une attaque en sept phases. Le repère : la question à laquelle chaque action répond.",
          {
            entetes: ["Phase", "Question", "Exemple"],
            lignes: [
              ["1. Reconnaissance", "Qui est la cible ?", "`whois`, LinkedIn, fuites de données"],
              ["2. Armement", "Avec quoi frapper ?", "Malware + exploit, crypter"],
              ["3. Livraison", "Comment l'envoyer ?", "Spear-phishing, clé USB, watering-hole"],
              ["4. Exploitation", "Comment l'exécuter ?", "CVE, macro ouverte, zero-day"],
              ["5. Installation", "Comment rester ?", "Service, tâche planifiée, web shell"],
              ["6. Commandement & contrôle", "Comment piloter ?", "Beacons, DNS tunneling"],
              ["7. Actions sur les objectifs", "Que prendre ou détruire ?", "Exfiltration, suppression des sauvegardes"]
            ]
          },
          "L'OSINT occupe la **phase 1**, en **reconnaissance passive** : on observe **sans interagir** avec la cible (aucune trace dans ses journaux). Un scan `nmap` est au contraire de la reconnaissance **active**."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Dans quelle phase l'OSINT intervient-il principalement ?",
            choix: ["La reconnaissance", "L'installation", "Le commandement & contrôle", "La livraison"],
            reponse: 0,
            explication: "L'OSINT alimente la phase 1, la reconnaissance."
          },
          {
            enonce: "Lesquelles de ces actions sont de la reconnaissance passive ?",
            choix: [
              "Énumérer les profils LinkedIn des employés",
              "Interroger le whois d'un domaine",
              "Lire une ancienne version du site dans la Wayback Machine",
              "Scanner les ports du serveur web"
            ],
            reponse: [0, 1, 2],
            explication: "Le scan de ports interroge directement les machines de la cible : c'est de l'actif."
          },
          {
            enonce: "Courriel de spear-phishing avec une pièce jointe .docx à macros.",
            choix: ["Livraison", "Armement", "Exploitation", "Reconnaissance"],
            reponse: 0,
            explication: "Le courriel transporte la charge utile jusqu'à la victime."
          },
          {
            enonce: "Tâche planifiée nommée « Windows Update » qui relance la charge au démarrage.",
            choix: ["Installation", "Armement", "Exploitation", "Actions sur les objectifs"],
            reponse: 0,
            explication: "Persistance par tâche planifiée : phase 5."
          },
          {
            enonce: "Beacons HTTPS périodiques vers un serveur contrôlé par l'attaquant.",
            choix: ["Commandement & contrôle", "Installation", "Livraison", "Reconnaissance"],
            reponse: 0,
            explication: "Des rappels réguliers vers un serveur de l'attaquant : c'est le canal C2."
          },
          {
            enonce: "Suppression des Shadow Copies avant le chiffrement des fichiers.",
            choix: ["Actions sur les objectifs", "Installation", "Exploitation", "Armement"],
            reponse: 0,
            explication: "Empêcher la restauration maximise l'impact : phase 7."
          },
          {
            enonce: "Malware recompilé avec un crypter pour produire un binaire unique.",
            choix: ["Armement", "Installation", "Livraison", "Exploitation"],
            reponse: 0,
            explication: "Rendre l'échantillon unique pour échapper aux signatures relève de l'armement."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-outils",
        titre: "Panorama des outils",
        description: "Dorks, images, identifiants, fuites, réseaux sociaux, sites web.",
        cours: [
          {
            entetes: ["Piste", "Outils"],
            lignes: [
              ["Moteurs de recherche", "Opérateurs `site:`, `filetype:`, `inurl:`, `intitle:`, `-`, guillemets ; la **GHDB** recense les dorks éprouvés"],
              ["Images", "Recherche inversée (Google Lens, Yandex, Bing, TinEye), **EXIF** (`exiftool`), cartes et Street View"],
              ["Courriels et pseudos", "Format d'adresse de l'entreprise, Hunter, **WhatsMyName** pour un pseudo réutilisé"],
              ["Collecte automatisée", "**theHarvester** (courriels, sous-domaines), **Maltego** (graphe et Transforms), **SpiderFoot** (surface d'attaque)"],
              ["Fuites", "**Have I Been Pwned**, DeHashed : un mot de passe réutilisé suffit à entrer"],
              ["Réseaux sociaux", "**LinkedIn** : employés clés, organigramme, technologies citées dans les offres d'emploi"],
              ["Sites web", "**WHOIS**/RDAP, `dig`, **Wayback Machine**, forges de code, fichiers oubliés (`/.git`, `.env`)"]
            ]
          },
          "Les réseaux sociaux **suppriment** aujourd'hui les EXIF des photos publiées : une image récupérée directement sur un appareil ou dans une pièce jointe est bien plus bavarde."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quel dork ne garde que les PDF du domaine exemple.fr ?",
            choix: ["`site:exemple.fr filetype:pdf`", "`inurl:exemple.fr pdf`", "`intitle:pdf exemple.fr`", "`\"exemple.fr\" -pdf`"],
            reponse: 0,
            explication: "`site:` restreint au domaine, `filetype:` au type de fichier."
          },
          {
            enonce: "Quel outil présente le renseignement sous forme de graphe, enrichi par des « Transforms » ?",
            choix: ["Maltego", "theHarvester", "SpiderFoot", "HTTrack"],
            reponse: 0,
            explication: "Maltego part d'un objet et lui applique des Transforms qui font apparaître les objets liés."
          },
          {
            enonce: "Pourquoi une photo téléchargée depuis un réseau social donne-t-elle rarement des coordonnées GPS ?",
            choix: [
              "Les réseaux sociaux suppriment les EXIF à la publication",
              "Les smartphones n'enregistrent jamais la position",
              "Les EXIF sont chiffrés par défaut",
              "Le GPS n'est écrit que dans les fichiers PNG"
            ],
            reponse: 0,
            explication: "La suppression est faite par la plateforme, pas par l'appareil."
          },
          {
            enonce: "Un même pseudonyme est réutilisé sur plusieurs sites. Quel service le cherche partout à la fois ?",
            choix: ["WhatsMyName", "Have I Been Pwned", "TinEye", "Wayback Machine"],
            reponse: 0,
            explication: "WhatsMyName teste un identifiant sur des centaines de sites."
          },
          {
            enonce: "Une offre d'emploi exige « 3 ans d'expérience sur tel EDR et tel hyperviseur ». Qu'apprend l'attaquant ?",
            choix: [
              "Une partie de l'inventaire technique de l'entreprise",
              "Le mot de passe des administrateurs",
              "L'adresse IP du pare-feu",
              "Rien d'exploitable"
            ],
            reponse: 0,
            explication: "Les offres d'emploi publient les technologies utilisées."
          },
          {
            enonce: "Quelle ressource permet de lire une version ancienne d'un site web ?",
            choix: ["La Wayback Machine", "Le WHOIS", "`nslookup`", "theHarvester"],
            reponse: 0,
            explication: "La Wayback Machine archive les pages depuis 1996."
          },
          {
            enonce: "Quels fichiers ou dossiers oubliés sur un serveur web sont des mines d'information ?",
            choix: ["Le répertoire `/.git`", "Un fichier `.env`", "Une sauvegarde `config.php.bak`", "La feuille de style `style.css`"],
            reponse: [0, 1, 2],
            explication: "Historique du code, variables d'environnement, configuration : la feuille de style ne livre rien de sensible."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-ingenierie-sociale",
        titre: "L'ingénierie sociale",
        description: "Exploiter la faille humaine, et démonter un courriel piégé.",
        cours: [
          "L'ingénierie sociale exploite la **faille humaine** : elle **contourne** les protections au lieu de les affronter. On y recourt quand l'OSINT n'a pas suffi, ou quand l'attaque technique coûterait trop cher.",
          "Trois façons de viser par courriel :",
          [
            "**Hameçonnage ciblé** : on réutilise les données trouvées en OSINT.",
            "**Cibles prioritaires** (whales) : les hauts cadres.",
            "**Bas de la chaîne** : les employés plus enclins à coopérer."
          ],
          "Démonter un courriel : regarder les **en-têtes** et le **domaine du lien**, jamais l'habillage. Piège classique : **SPF, DKIM et DMARC « pass »** prouvent seulement que le message vient du domaine qu'il déclare, pas que l'expéditeur est légitime.",
          "Autres vecteurs : **téléphone** (centres d'appels, numéro usurpé, voix imitée par IA), **SMS**, faux sites, visite sur place (la plus risquée), écoute aux portes, regard par-dessus l'épaule."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Pourquoi l'ingénierie sociale est-elle la vulnérabilité la plus importante d'une organisation ?",
            choix: [
              "Elle contourne les protections au lieu de les affronter",
              "Elle exploite toujours une faille zero-day",
              "Elle ne laisse aucune trace",
              "Elle ne vise que les dirigeants"
            ],
            reponse: 0,
            explication: "Un humain abusé ouvre la porte que les systèmes de sécurité gardaient."
          },
          {
            enonce: "Un courriel affiche « SPF : pass ». Qu'en déduire ?",
            choix: [
              "Le message vient bien du domaine qu'il déclare, rien de plus",
              "L'expéditeur est légitime",
              "Le lien du message est sûr",
              "Le message a été analysé par un antivirus"
            ],
            reponse: 0,
            explication: "Un compte gratuit tout neuf passe SPF sans difficulté."
          },
          {
            enonce: "Quels indices trahissent un courriel d'hameçonnage ?",
            choix: [
              "Une équipe « interne » qui écrit depuis une messagerie grand public",
              "Un lien qui pointe vers un domaine sans rapport avec la société",
              "Une urgence : compte suspendu, action immédiate",
              "Une signature avec le logo de l'entreprise"
            ],
            reponse: [0, 1, 2],
            explication: "Le logo se copie en un clic : ce n'est pas un indice de légitimité."
          },
          {
            enonce: "Viser directement les hauts cadres, c'est :",
            choix: ["Le hameçonnage de cibles prioritaires (whales)", "Le hameçonnage sur le bas de la chaîne", "Le baiting", "Le watering-hole"],
            reponse: 0,
            explication: "Les « baleines » ont accès à l'information la plus précieuse."
          },
          {
            enonce: "Quelles sont les cibles prioritaires de l'ingénierie sociale par téléphone ?",
            choix: ["Les centres d'appels", "Les serveurs DNS", "Les imprimantes réseau", "Les sauvegardes"],
            reponse: 0,
            explication: "Réinitialiser un mot de passe ou modifier un compte s'y obtient avec quelques informations trouvées en OSINT."
          },
          {
            enonce: "Quelle méthode est la plus risquée pour l'attaquant ?",
            choix: ["La visite en présentiel aux bureaux", "Le SMS frauduleux", "Le faux site web", "Le courriel ciblé"],
            reponse: 0,
            explication: "Sur place, l'attaquant s'expose physiquement."
          },
          {
            enonce: "Pourquoi l'ingénierie sociale est-elle la suite logique de l'OSINT ?",
            choix: [
              "Plus la reconnaissance est fine, plus le prétexte est crédible",
              "Elle remplace la reconnaissance",
              "Elle ne demande aucune information préalable",
              "Elle sert uniquement à vérifier les résultats de l'OSINT"
            ],
            reponse: 0,
            explication: "Noms, rôles, projets en cours : chaque détail rend le scénario plus convaincant."
          }
        ]
      }

    ]
  };

  CONTENU["osint"] = { chapitres: [ch1] };

})();
