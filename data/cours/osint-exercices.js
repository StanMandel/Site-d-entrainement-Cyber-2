/* =============================================================
   OSINT — Chapitres 3 à 5
   -------------------------------------------------------------
   Complète le cours « osint » déjà déclaré par data/cours/osint.js :
     - chapitre 3 : les outils et les types d'OSINT ;
     - chapitre 4 : l'ingénierie sociale (dont l'analyse du
       courriel d'hameçonnage étudié en oral) ;
     - chapitre 5 : le quizz final, 20 questions tirées sur 50.

   Même principe que les chapitres 1 et 2 : un micro-cours affiché
   à gauche, puis un micro-quizz sur ce seul concept.
   ============================================================= */

(function () {

  const cours = CONTENU["osint"];

  /* =========================================================
     CHAPITRE 3 — Les outils et les types d'OSINT
     ========================================================= */

  cours.chapitres.push({
    id: "ch3",
    titre: "Chapitre 3 — Les outils et les types d'OSINT",
    description: "Moteurs de recherche, images, identifiants, réseaux sociaux, sites web.",
    exercices: [

      {
        type: "qcm",
        id: "osint-panorama",
        titre: "Qui fait de l'OSINT, et sur quoi ?",
        description: "Public cible et grandes familles de sources.",
        cours: [
          "Quatre publics sont cités comme utilisateurs de l'OSINT :",
          [
            "les **gouvernements**,",
            "les **journalistes**,",
            "les **forces de l'ordre**,",
            "les **citoyens**."
          ],
          "Et sept familles de sources, qui structurent tout le chapitre :",
          [
            "**Moteurs de recherche** (dont la recherche avancée).",
            "**Courriels et autres identifiants**.",
            "**Réseaux sociaux**.",
            "**Sites web**.",
            "**Ingénierie sociale** (hameçonnage, appels téléphoniques…).",
            "**Images** (recherche inversée, données EXIF, étude géographique, données satellite, vidéos).",
            "**Physique** (reconnaissance des lieux)."
          ]
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quels publics sont cités comme utilisateurs de l'OSINT ?",
            choix: ["Les journalistes", "Les forces de l'ordre", "Les citoyens", "Les fabricants d'antivirus"],
            reponse: [0, 1, 2],
            explication: "Gouvernements, journalistes, forces de l'ordre et citoyens."
          },
          {
            enonce: "La recherche inversée d'image et les données EXIF appartiennent à quelle famille ?",
            choix: ["Les images", "Les réseaux sociaux", "Les sites web", "L'ingénierie sociale"],
            reponse: 0,
            explication: "Recherche inversée, reconnaissance faciale, EXIF, géolocalisation et vidéos : la famille « images »."
          },
          {
            enonce: "Un appel téléphonique pour obtenir un mot de passe relève de quelle famille ?",
            choix: ["L'ingénierie sociale", "Les moteurs de recherche", "Les courriels et identifiants", "Le physique"],
            reponse: 0,
            explication: "L'ingénierie sociale couvre l'hameçonnage par courriel, les appels téléphoniques et le reste."
          },
          {
            enonce: "La reconnaissance des lieux et les données satellite relèvent de :",
            choix: [
              "L'étude géographique et la famille « physique »",
              "L'analyse des sites web",
              "Les réseaux sociaux",
              "Les moteurs de recherche"
            ],
            reponse: 0,
            explication: "Étude géographique, reconnaissance des lieux et données satellite complètent la partie images / physique."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-moteurs",
        titre: "Moteurs de recherche avancés",
        description: "Google dorks, GHDB, et les moteurs basés sur le balayage de ports.",
        cours: [
          "Un moteur de recherche ordinaire devient un outil de reconnaissance dès qu'on utilise ses **opérateurs avancés**, appelés **Google dorks**.",
          {
            entetes: ["Opérateur", "Rôle"],
            lignes: [
              ["`site:`", "Restreint la recherche à un domaine"],
              ["`filetype:` / `ext:`", "Ne garde qu'un type de fichier (pdf, xlsx, conf…)"],
              ["`inurl:`", "Le mot doit figurer dans l'URL"],
              ["`intitle:`", "Le mot doit figurer dans le titre de la page"],
              ["`intext:`", "Le mot doit figurer dans le corps de la page"],
              ["`-`", "Exclut un terme"],
              ["Guillemets", "Expression exacte"]
            ]
          },
          "La **Google Hacking Database (GHDB)**, hébergée par exploit-db, recense des dorks déjà éprouvés pour trouver fichiers sensibles, pages d'administration et messages d'erreur révélateurs.",
          "Un autre type de moteur indexe non pas des pages mais des **machines**, à partir du **balayage de ports** : il permet de retrouver des services exposés sur Internet, avec leurs bannières et leurs versions."
        ],
        exemple: {
          titre: "Exemple",
          legende: "Quelques dorks",
          code: "site:exemple.fr filetype:pdf\nsite:exemple.fr inurl:admin\nintitle:\"index of\" \"backup\"\nsite:exemple.fr -www"
        },
        melangerChoix: true,
        questions: [
          {
            enonce: "Que fait l'opérateur `filetype:` dans une requête ?",
            choix: [
              "Il ne garde que les résultats d'un type de fichier donné",
              "Il restreint la recherche à un domaine",
              "Il cherche le mot dans l'URL",
              "Il exclut un format de fichier"
            ],
            reponse: 0,
            explication: "`filetype:pdf` ne renvoie que des PDF."
          },
          {
            enonce: "Quelle requête cherche les pages d'administration du domaine exemple.fr ?",
            choix: [
              "site:exemple.fr inurl:admin",
              "intitle:exemple.fr admin",
              "filetype:exemple.fr admin",
              "intext:admin -exemple.fr"
            ],
            reponse: 0,
            explication: "`site:` cible le domaine, `inurl:` cherche le mot dans l'adresse."
          },
          {
            enonce: "Que recense la Google Hacking Database (GHDB) ?",
            choix: [
              "Des requêtes avancées éprouvées pour trouver des informations sensibles",
              "Les mots de passe issus de fuites de données",
              "La liste des serveurs exposés sur Internet",
              "Les vulnérabilités de Google"
            ],
            reponse: 0,
            explication: "La GHDB, hébergée par exploit-db, est un catalogue de dorks."
          },
          {
            enonce: "Qu'indexe un moteur de recherche fondé sur le balayage de ports ?",
            choix: [
              "Les machines et services exposés sur Internet, avec leurs bannières",
              "Les pages web publiques",
              "Les publications des réseaux sociaux",
              "Les images et leurs métadonnées"
            ],
            reponse: 0,
            explication: "Ce type de moteur référence des hôtes et des services, pas des pages."
          },
          {
            enonce: "À quoi sert le signe `-` devant un terme de recherche ?",
            choix: ["À exclure ce terme des résultats", "À le rendre obligatoire", "À chercher une expression exacte", "À chercher dans le titre"],
            reponse: 0,
            explication: "`site:exemple.fr -www` écarte les résultats contenant « www »."
          },
          {
            enonce: "Pourquoi les Google dorks relèvent-ils de la reconnaissance passive ?",
            choix: [
              "L'attaquant interroge l'index du moteur, pas les serveurs de la cible",
              "Les requêtes sont anonymisées par le moteur",
              "Les résultats sont chiffrés",
              "Le moteur avertit la cible à la place de l'attaquant"
            ],
            reponse: 0,
            explication: "C'est le moteur qui a visité le site : l'attaquant, lui, n'a touché à rien."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-image-inversee",
        titre: "Images — recherche inversée et reconnaissance faciale",
        description: "Ce qu'une simple photo permet de retrouver.",
        cours: [
          "La **recherche inversée** part d'une image et cherche les pages où elle apparaît. À partir d'une seule photo, on peut retrouver :",
          [
            "l'**identité** de la personne photographiée,",
            "sa **localisation**, déduite des immeubles et des alentours,",
            "ses **autres profils** en ligne, si les photos de profil se ressemblent."
          ],
          "La **reconnaissance faciale** va plus loin : elle ne cherche pas la même image mais le même **visage**. Elle est souvent plus efficace que la recherche inversée, surtout si l'outil s'appuie sur une banque d'images très vaste.",
          "Réutiliser la même photo de profil sur plusieurs services suffit donc à relier des comptes qu'on croyait séparés."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Sur quoi repose une recherche inversée d'image ?",
            choix: [
              "On part d'une image pour retrouver les pages où elle apparaît",
              "On part d'un nom pour retrouver des images",
              "On lit les métadonnées EXIF du fichier",
              "On compare les empreintes de hachage des fichiers du disque"
            ],
            reponse: 0,
            explication: "L'image est la requête, les pages sont les résultats."
          },
          {
            enonce: "Qu'est-ce qui distingue la reconnaissance faciale de la recherche inversée ?",
            choix: [
              "Elle cherche le même visage, pas la même image",
              "Elle nécessite les données EXIF",
              "Elle ne fonctionne que sur les réseaux sociaux",
              "Elle donne toujours la position GPS"
            ],
            reponse: 0,
            explication: "Une autre photo du même visage sera trouvée, même si l'image n'a jamais été publiée ailleurs."
          },
          {
            enonce: "Qu'est-ce qu'une photo permet de déduire, même sans métadonnées ?",
            choix: [
              "La localisation, à partir des immeubles et des alentours",
              "Le mot de passe du compte qui l'a publiée",
              "L'adresse IP de l'appareil photo",
              "La liste des contacts de la personne"
            ],
            reponse: 0,
            explication: "Le décor est une donnée : bâtiments, enseignes, végétation, panneaux."
          },
          {
            enonce: "Pourquoi réutiliser la même photo de profil sur plusieurs sites est-il risqué ?",
            choix: [
              "La recherche inversée relie alors entre eux des comptes que l'on croyait séparés",
              "La photo perd ses données EXIF",
              "Les sites partagent automatiquement les mots de passe",
              "Les moteurs de recherche refusent alors de l'indexer"
            ],
            reponse: 0,
            explication: "Une image identique est un identifiant commun entre des profils sans autre lien apparent."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-exif",
        titre: "Images — les données EXIF",
        description: "Ce que le fichier porte en plus de l'image.",
        cours: [
          "Une image peut transporter des **données EXIF** et d'autres métadonnées, écrites par l'appareil au moment de la prise de vue. On y trouve notamment :",
          [
            "l'**emplacement** (coordonnées GPS),",
            "les **caractéristiques de l'appareil** (marque, modèle, objectif, réglages),",
            "l'**auteur**,",
            "la **date et l'heure de capture**."
          ],
          "L'outil de référence pour les lire et les écrire est **`exiftool`**.",
          "**Attention :** les réseaux sociaux traditionnels **conservaient** autrefois les EXIF, mais ce n'est plus le cas aujourd'hui — ils les suppriment à la publication. Une image récupérée sur un réseau social sera donc le plus souvent muette ; une image reçue par courriel ou téléchargée depuis un site personnel, beaucoup moins."
        ],
        exemple: {
          titre: "Exemple",
          legende: "Lire les métadonnées d'une photo",
          code: "exiftool photo.jpg\nexiftool -gps:all -createdate -model photo.jpg\nexiftool -all= photo.jpg      # efface les metadonnees"
        },
        melangerChoix: true,
        questions: [
          {
            enonce: "Que peuvent contenir les données EXIF d'une photo ?",
            choix: [
              "L'emplacement de la prise de vue",
              "Le modèle de l'appareil",
              "La date de capture",
              "Le mot de passe du compte de l'auteur"
            ],
            reponse: [0, 1, 2],
            explication: "Emplacement, caractéristiques de l'appareil, auteur et date de capture."
          },
          {
            enonce: "Quel outil est cité pour lire les métadonnées d'une image ?",
            choix: ["exiftool", "theHarvester", "cewl", "HTTrack"],
            reponse: 0,
            explication: "`exiftool` lit, écrit et efface les métadonnées de très nombreux formats."
          },
          {
            enonce: "Que deviennent les données EXIF d'une photo publiée aujourd'hui sur un réseau social traditionnel ?",
            choix: [
              "Elles sont supprimées à la publication",
              "Elles sont conservées et visibles par tous",
              "Elles sont chiffrées puis conservées",
              "Elles sont remplacées par la position du serveur"
            ],
            reponse: 0,
            explication: "Les réseaux les conservaient autrefois ; ils les retirent désormais."
          },
          {
            enonce: "Quelle image a le plus de chances de contenir encore ses EXIF ?",
            choix: [
              "Une photo reçue en pièce jointe d'un courriel",
              "Une photo de profil publiée sur un réseau social",
              "Une capture d'écran d'un fil d'actualité",
              "Une vignette générée par un réseau social"
            ],
            reponse: 0,
            explication: "Le fichier d'origine n'a pas été retraité par une plateforme : ses métadonnées sont intactes."
          },
          {
            enonce: "Pourquoi effacer les EXIF avant de publier une photo ?",
            choix: [
              "Pour ne pas divulguer sa position, son matériel et ses habitudes",
              "Pour réduire la définition de l'image",
              "Pour empêcher la recherche inversée",
              "Pour empêcher la reconnaissance faciale"
            ],
            reponse: 0,
            explication: "Les EXIF fuitent le lieu et le moment ; en revanche ils ne protègent en rien du contenu visible de l'image."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-geolocalisation",
        titre: "Images — positionnement géographique",
        description: "Localiser une photo sans la moindre métadonnée.",
        cours: [
          "Même dépouillée de ses métadonnées, une image reste localisable par son **contenu**. Des outils cartographiques aident à la recherche :",
          [
            "**Google Maps** et son **StreetView**,",
            "**Bing Maps**,",
            "**OpenStreetMap**, dont l'API est ouverte."
          ],
          "L'**aperçu 3D** et le **StreetView** accélèrent beaucoup la comparaison entre la photo et le terrain.",
          "La méthode est celle de la **triangulation visuelle** : plusieurs indices banals pris ensemble — un restaurant franchisé, un hôtel, un panneau, une ligne de tramway — restreignent la zone jusqu'à un point unique."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quels outils cartographiques sont cités pour localiser une image ?",
            choix: ["Google Maps", "Bing Maps", "OpenStreetMap", "Maltego"],
            reponse: [0, 1, 2],
            explication: "Maltego est un outil de cartographie de données en graphe, pas de cartographie géographique."
          },
          {
            enonce: "Quel atout particulier OpenStreetMap présente-t-il ?",
            choix: [
              "Son API est disponible",
              "Il fournit les données EXIF des photos",
              "Il propose la reconnaissance faciale",
              "Il indexe les ports ouverts"
            ],
            reponse: 0,
            explication: "Une API ouverte permet d'automatiser les recherches."
          },
          {
            enonce: "Comment localiser une photo qui ne porte aucune métadonnée ?",
            choix: [
              "En croisant les éléments visibles — enseignes, bâtiments, mobilier urbain — avec la cartographie",
              "En interrogeant le serveur qui l'héberge",
              "C'est impossible sans EXIF",
              "En cherchant le nom du fichier dans un moteur de recherche"
            ],
            reponse: 0,
            explication: "Le contenu de l'image est lui-même une source ; la triangulation visuelle fait le reste."
          },
          {
            enonce: "Pourquoi un restaurant franchisé visible sur une photo est-il un indice utile ?",
            choix: [
              "Ses implantations sont répertoriées : croisé avec un autre repère, il restreint la zone",
              "Les franchises publient les photos de leurs clients",
              "Son enseigne contient des données EXIF",
              "Les franchises exposent leurs caméras sur Internet"
            ],
            reponse: 0,
            explication: "La simple vue d'un restaurant franchisé et d'un hôtel peut suffire à trianguler une position."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-courriels",
        titre: "Courriels et identifiants",
        description: "Vérifier une adresse, retrouver un pseudonyme.",
        cours: [
          "Une adresse de courriel est un point d'entrée : elle sert à la fois de cible d'hameçonnage et de fil conducteur entre les comptes.",
          [
            "**Vérifier** qu'une adresse existe vraiment, avant d'en faire une cible (services de type email verifier, comme **Hunter**).",
            "**Deviner le format** des adresses d'une entreprise (`prenom.nom@`, `pnom@`…) puis le généraliser à tout l'annuaire.",
            "**Relier les comptes** : un même identifiant ou pseudonyme réutilisé sur plusieurs plateformes trahit une même personne.",
            "**Tester un identifiant directement sur un site**, ou automatiser cette recherche avec un service du type **WhatsMyName**."
          ],
          "Un seul pseudonyme réutilisé partout est souvent plus révélateur qu'un nom de famille."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "À quoi sert un service comme Hunter ?",
            choix: [
              "Vérifier si un courriel est valide et retrouver les adresses d'une entreprise",
              "Scanner les ports d'un serveur",
              "Lire les métadonnées d'une image",
              "Archiver les anciennes versions d'un site"
            ],
            reponse: 0,
            explication: "C'est un vérificateur d'adresses, doublé d'un annuaire d'adresses d'entreprise."
          },
          {
            enonce: "Que permet un service comme WhatsMyName ?",
            choix: [
              "Chercher un même identifiant sur un grand nombre de sites",
              "Retrouver le vrai nom derrière une adresse IP",
              "Générer des mots de passe",
              "Cartographier un réseau interne"
            ],
            reponse: 0,
            explication: "Il teste un pseudonyme sur une longue liste de plateformes."
          },
          {
            enonce: "Pourquoi une adresse de courriel intéresse-t-elle un attaquant, au-delà de l'envoi d'un message ?",
            choix: [
              "Elle sert de fil conducteur pour relier des comptes en ligne",
              "Elle contient le mot de passe chiffré de la personne",
              "Elle révèle la version du serveur de messagerie",
              "Elle donne accès à la boîte de réception"
            ],
            reponse: 0,
            explication: "Un même identifiant réutilisé fait le lien entre des profils séparés."
          },
          {
            enonce: "Connaître le format des adresses d'une entreprise sert surtout à :",
            choix: [
              "Déduire l'adresse de n'importe quel employé dont on connaît le nom",
              "Contourner le filtre anti-spam",
              "Accéder au serveur de messagerie",
              "Vérifier la signature DKIM"
            ],
            reponse: 0,
            explication: "Un format et un annuaire professionnel suffisent à reconstituer les adresses de tout le personnel."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-outils-avances",
        titre: "Outils avancés : theHarvester, Maltego, SpiderFoot",
        description: "Automatiser la collecte et la mettre en graphe.",
        cours: [
          { titre: "theHarvester" },
          "Collecte à partir d'un nom de domaine, via de nombreuses sources (« plugins ») : **courriels**, **sous-domaines**, **adresses IP**, **noms** et **URL**. Disponible dans Kali.",
          { titre: "Maltego" },
          "Présente le renseignement **sous forme de graphe**. On part d'un objet (un domaine, un courriel…) et on lui applique des **Transforms** qui font apparaître les objets liés : courriels, domaines, serveurs, informations publiques Wikipédia, réseaux sociaux. La version **Community**, gratuite, est **limitée** — en général **12 résultats maximum par Transform**.",
          { titre: "SpiderFoot" },
          "**Automatise** l'OSINT pour le renseignement sur les menaces et la **cartographie de la surface d'attaque**.",
          "Ces trois outils font la même chose que la recherche manuelle, mais à grande échelle : leur intérêt est le **croisement** automatique des sources."
        ],
        exemple: {
          titre: "Exemple",
          legende: "theHarvester",
          code: "theHarvester -d exemple.fr -b all\ntheHarvester -d exemple.fr -b bing -l 500"
        },
        melangerChoix: true,
        questions: [
          {
            enonce: "Que collecte theHarvester à partir d'un nom de domaine ?",
            choix: [
              "Des courriels, des sous-domaines, des IP, des noms et des URL",
              "Les mots de passe des employés",
              "Les métadonnées EXIF des images du site",
              "Les journaux du serveur web"
            ],
            reponse: 0,
            explication: "C'est un moissonneur : courriels, sous-domaines, IP, noms, URL."
          },
          {
            enonce: "Sur quel principe Maltego repose-t-il ?",
            choix: [
              "Un graphe d'objets sur lesquels on applique des Transforms",
              "Un balayage de ports sur une plage d'adresses",
              "Une base de mots de passe cassés",
              "Une archive des anciennes versions des sites web"
            ],
            reponse: 0,
            explication: "Chaque Transform part d'un objet du graphe pour en faire apparaître d'autres."
          },
          {
            enonce: "Quelle est la limite habituelle de la version Community de Maltego ?",
            choix: [
              "Environ 12 résultats par Transform",
              "Un seul graphe par jour",
              "Aucun accès aux réseaux sociaux",
              "Trois domaines analysés au total"
            ],
            reponse: 0,
            explication: "La version gratuite plafonne en général à 12 résultats par Transform."
          },
          {
            enonce: "À quoi sert SpiderFoot ?",
            choix: [
              "Automatiser l'OSINT et cartographier la surface d'attaque",
              "Simuler la voix d'un interlocuteur",
              "Copier un site web en local",
              "Vérifier la validité d'une adresse de courriel"
            ],
            reponse: 0,
            explication: "SpiderFoot automatise la collecte pour le renseignement sur les menaces."
          },
          {
            enonce: "Quel est l'apport principal de ces outils par rapport à une recherche manuelle ?",
            choix: [
              "Le croisement automatique d'un grand nombre de sources",
              "L'accès à des informations noires",
              "La garantie de l'anonymat de l'analyste",
              "La suppression des données trouvées chez la cible"
            ],
            reponse: 0,
            explication: "Ils ne donnent pas accès à autre chose : ils vont simplement beaucoup plus vite et croisent mieux."
          },
          {
            enonce: "Sur quelle distribution theHarvester est-il directement disponible ?",
            choix: ["Kali", "Windows Server", "pfSense", "Android"],
            reponse: 0,
            explication: "Il fait partie des outils intégrés à Kali."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-fuites",
        titre: "Fuites de données et mots de passe",
        description: "Ce que les brèches passées disent d'une cible.",
        cours: [
          "Les fuites de données anciennes restent exploitables longtemps. Plusieurs services les indexent :",
          [
            "**Have I Been Pwned** — indique si une adresse apparaît dans une fuite connue.",
            "**DeHashed** — moteur de recherche sur les données issues de brèches.",
            "**Les archives de hashes cassés** — listes de condensats déjà cassés, accumulées au fil des années."
          ],
          "Le raisonnement de l'attaquant est direct : **pour chaque courriel trouvé, un mot de passe faible pourrait suffire à accéder au compte sans rien compromettre du système**. Aucun exploit, aucune alerte — une simple connexion valide.",
          "D'où deux réflexes : ne jamais réemployer un mot de passe d'un service à l'autre, et activer l'authentification multifacteur."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Que permet de vérifier Have I Been Pwned ?",
            choix: [
              "Si une adresse de courriel apparaît dans une fuite de données connue",
              "Si un mot de passe est assez long",
              "Si un site web est encore en ligne",
              "Si un fichier contient un malware"
            ],
            reponse: 0,
            explication: "Le service compare l'adresse aux brèches qu'il a indexées."
          },
          {
            enonce: "Pourquoi un mot de passe issu d'une fuite ancienne reste-t-il dangereux ?",
            choix: [
              "Parce qu'il est souvent réutilisé sur d'autres services",
              "Parce qu'il permet de déchiffrer les sauvegardes",
              "Parce qu'il révèle l'adresse IP de la victime",
              "Parce qu'il contourne l'authentification multifacteur"
            ],
            reponse: 0,
            explication: "La réutilisation transforme une vieille brèche en accès neuf ailleurs."
          },
          {
            enonce: "Pourquoi une connexion avec des identifiants valides est-elle difficile à détecter ?",
            choix: [
              "Elle ne se distingue pas d'une connexion légitime",
              "Elle n'apparaît dans aucun journal",
              "Elle chiffre le trafic réseau",
              "Elle désactive l'antivirus"
            ],
            reponse: 0,
            explication: "Aucun exploit, aucune anomalie technique : juste une authentification réussie."
          },
          {
            enonce: "Quelle mesure protège le mieux contre l'exploitation d'un mot de passe fuité ?",
            choix: [
              "Un mot de passe unique par service, couplé à l'authentification multifacteur",
              "Changer son adresse de courriel",
              "Supprimer les métadonnées de ses photos",
              "Utiliser un navigateur en navigation privée"
            ],
            reponse: 0,
            explication: "L'unicité casse la réutilisation ; le second facteur rend le mot de passe seul insuffisant."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-reseaux-sociaux",
        titre: "Réseaux sociaux et LinkedIn",
        description: "Ce que les employés publient sans y penser.",
        cours: [
          "Les réseaux sociaux livrent, sur les employés :",
          [
            "leurs **intérêts personnels et loisirs**,",
            "leurs **connexions et relations professionnelles**,",
            "leurs **agendas et événements**."
          ],
          "Et, sur l'organisation elle-même : sa **structure organisationnelle** et les **technologies et systèmes utilisés**.",
          { titre: "Le cas LinkedIn" },
          "Plus d'un **milliard** d'utilisateurs, une plateforme **axée sur le recrutement**, donc des profils très détaillés. On y identifie :",
          [
            "les **employés clés**,",
            "la **structure organisationnelle**,",
            "le **matériel et les logiciels utilisés**,",
            "les **systèmes ICS/OT**,",
            "les **projets en cours**."
          ],
          "Une offre d'emploi est une mine : exiger « 3 ans d'expérience sur tel EDR et telle version d'hyperviseur » revient à publier l'inventaire technique de l'entreprise."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Pourquoi LinkedIn est-il particulièrement riche pour l'OSINT ?",
            choix: [
              "Son orientation recrutement pousse les profils à être très détaillés",
              "Il conserve les données EXIF des photos",
              "Il publie les adresses de courriel en clair",
              "Il expose les ports ouverts des entreprises"
            ],
            reponse: 0,
            explication: "Pour être recruté, on détaille son poste, ses outils et ses projets."
          },
          {
            enonce: "Qu'un profil LinkedIn permet-il d'identifier ?",
            choix: [
              "Les employés clés et la structure organisationnelle",
              "Le matériel et les logiciels utilisés",
              "Les projets en cours",
              "Les mots de passe du domaine"
            ],
            reponse: [0, 1, 2],
            explication: "Employés clés, organigramme, matériel et logiciels, systèmes ICS/OT et projets en cours."
          },
          {
            enonce: "En quoi une offre d'emploi technique est-elle une source d'OSINT ?",
            choix: [
              "Les compétences exigées révèlent les technologies déployées",
              "Elle contient l'adresse IP publique de l'entreprise",
              "Elle donne accès à l'intranet",
              "Elle liste les vulnérabilités connues du système"
            ],
            reponse: 0,
            explication: "La liste des outils demandés est l'inventaire technique de la maison."
          },
          {
            enonce: "Que révèlent les intérêts personnels d'un employé pour un attaquant ?",
            choix: [
              "Un prétexte crédible pour un message d'hameçonnage ciblé",
              "Ses droits d'accès sur le domaine",
              "Son mot de passe de session",
              "La topologie du réseau interne"
            ],
            reponse: 0,
            explication: "Un centre d'intérêt partagé rend le message plausible : c'est la matière du spear-phishing."
          },
          {
            enonce: "Pourquoi les systèmes ICS/OT mentionnés sur un profil sont-ils sensibles ?",
            choix: [
              "Ils désignent des équipements industriels dont la compromission a un impact physique",
              "Ils contiennent les sauvegardes de l'entreprise",
              "Ils hébergent les comptes de messagerie",
              "Ils identifient le fournisseur d'accès"
            ],
            reponse: 0,
            explication: "ICS/OT = systèmes de contrôle industriel : une cible à l'impact très différent de la bureautique."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-sites-web",
        titre: "Analyser un site web",
        description: "WHOIS, DNS, crawlers, miroirs, archives et fichiers oubliés.",
        cours: [
          "Un site web se prête à une reconnaissance méthodique :",
          {
            entetes: ["Piste", "Moyen"],
            lignes: [
              ["Propriétaire du domaine", "Annuaire **WHOIS**"],
              ["Enregistrements DNS", "`nslookup`, `dig`"],
              ["Analyse réseau", "`nmap`, `traceroute`, `ping` — **actif**"],
              ["Moissonner le contenu", "Un **crawler** : `cewl` en ligne de commande, **ZAP** en graphique"],
              ["Analyser hors ligne", "Miroir du site avec **HTTrack**"],
              ["Anciennes versions", "**Wayback Machine**"],
              ["Code source", "**GitHub** et les autres forges"]
            ]
          },
          "Il faut chercher aussi les **dossiers et fichiers sensibles laissés accessibles** par le serveur HTTP : répertoire **`/.git`**, fichiers de configuration, fichiers d'environnement, mots de passe.",
          "Reconstituer la **topologie du réseau** permet de pousser l'investigation au maximum."
        ],
        exemple: {
          titre: "Exemple",
          legende: "Reconnaissance d'un domaine",
          code: "whois exemple.fr\ndig exemple.fr MX\nnslookup -type=TXT exemple.fr\ncewl https://exemple.fr -d 2 -w mots.txt\nhttrack https://exemple.fr -O ./miroir"
        },
        melangerChoix: true,
        questions: [
          {
            enonce: "Que permet de consulter l'annuaire WHOIS ?",
            choix: [
              "Les informations d'enregistrement d'un nom de domaine",
              "Le contenu des pages archivées d'un site",
              "Les ports ouverts d'un serveur",
              "Les métadonnées des images d'un site"
            ],
            reponse: 0,
            explication: "WHOIS donne le déclarant, les dates et les contacts d'un domaine."
          },
          {
            enonce: "À quoi sert un crawler comme cewl ?",
            choix: [
              "Parcourir un site pour en extraire du contenu, par exemple une liste de mots",
              "Cartographier les ports d'un réseau",
              "Simuler un appel téléphonique",
              "Lire les données EXIF"
            ],
            reponse: 0,
            explication: "`cewl` moissonne le site et en tire un dictionnaire de mots propres à la cible."
          },
          {
            enonce: "Quel outil copie un site web en local pour l'analyser hors ligne ?",
            choix: ["HTTrack", "exiftool", "theHarvester", "Maltego"],
            reponse: 0,
            explication: "HTTrack fait un miroir complet du site."
          },
          {
            enonce: "Pourquoi un répertoire /.git accessible en HTTP est-il critique ?",
            choix: [
              "Il expose tout l'historique du code source, y compris les secrets supprimés depuis",
              "Il permet de modifier le site à distance",
              "Il donne un accès SSH au serveur",
              "Il révèle les mots de passe des visiteurs"
            ],
            reponse: 0,
            explication: "L'historique Git conserve les versions antérieures : un secret « retiré » y figure encore."
          },
          {
            enonce: "À quoi sert la Wayback Machine dans une recherche OSINT ?",
            choix: [
              "Consulter d'anciennes versions d'un site, y compris des pages retirées depuis",
              "Balayer les ports d'un hôte",
              "Vérifier la validité d'une adresse de courriel",
              "Détecter les macros dans un document"
            ],
            reponse: 0,
            explication: "Ce qui a été publié puis supprimé reste souvent consultable dans les instantanés."
          },
          {
            enonce: "Parmi ces actions sur un site cible, laquelle est de la reconnaissance ACTIVE ?",
            choix: [
              "Lancer nmap sur le serveur",
              "Consulter la Wayback Machine",
              "Interroger le WHOIS du domaine",
              "Lire le dépôt GitHub public du projet"
            ],
            reponse: 0,
            explication: "`nmap` interroge directement la machine de la cible ; les trois autres passent par des tiers."
          }
        ]
      }

    ]
  });

  /* =========================================================
     CHAPITRE 4 — L'ingénierie sociale
     ========================================================= */

  cours.chapitres.push({
    id: "ch4",
    titre: "Chapitre 4 — L'ingénierie sociale",
    description: "Exploiter la faille humaine : courriel, téléphone, et le reste.",
    exercices: [

      {
        type: "qcm",
        id: "osint-ingenierie-principe",
        titre: "La faille humaine",
        description: "Ce qu'est l'ingénierie sociale, et quand on y recourt.",
        cours: [
          { titre: "Quoi ?" },
          "L'ingénierie sociale exploite la **faille humaine** de la sécurité informatique. C'est la **vulnérabilité la plus importante d'une organisation**, car elle permet de **contourner** les systèmes de sécurité mis en place plutôt que de les affronter.",
          "Elle prend des formes variées : hameçonnage par courriel, appels téléphoniques, SMS frauduleux, écoute aux portes, espionnage.",
          { titre: "Pourquoi ?" },
          "On y recourt dans deux cas :",
          [
            "**Manque d'information publique** sur la cible — l'OSINT n'a pas suffi.",
            "**Informations suffisantes, mais système trop complexe à exploiter** — l'attaque technique coûterait trop cher."
          ],
          "L'ingénierie sociale est donc la suite logique de l'OSINT : plus la reconnaissance a été fine, plus le prétexte sera crédible."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quelle vulnérabilité l'ingénierie sociale exploite-t-elle ?",
            choix: [
              "La faille humaine",
              "Une mauvaise configuration du pare-feu",
              "Une vulnérabilité zero-day",
              "Un défaut de chiffrement"
            ],
            reponse: 0,
            explication: "C'est la vulnérabilité la plus importante d'une organisation."
          },
          {
            enonce: "Pourquoi la faille humaine est-elle si dangereuse ?",
            choix: [
              "Elle permet de contourner les systèmes de sécurité mis en place",
              "Elle donne directement les droits administrateur",
              "Elle est indétectable par définition",
              "Elle ne laisse jamais de trace"
            ],
            reponse: 0,
            explication: "Les défenses techniques restent intactes : l'attaquant passe à côté."
          },
          {
            enonce: "Dans quels cas recourt-on à l'ingénierie sociale ?",
            choix: [
              "Quand l'information publique sur la cible manque",
              "Quand le système est trop complexe à exploiter techniquement",
              "Quand l'information est suffisante mais l'attaque directe trop coûteuse",
              "Quand la cible n'a pas de site web"
            ],
            reponse: [0, 1, 2],
            explication: "Manque d'information, ou système trop coûteux à attaquer frontalement."
          },
          {
            enonce: "Quel lien unit l'OSINT et l'ingénierie sociale ?",
            choix: [
              "La qualité de la reconnaissance détermine la crédibilité du prétexte",
              "L'ingénierie sociale remplace l'OSINT quand celui-ci échoue",
              "Ce sont deux phases distinctes sans rapport",
              "L'OSINT sert uniquement à choisir l'heure de l'appel"
            ],
            reponse: 0,
            explication: "On ne peut se faire passer pour un interlocuteur légitime qu'avec du contexte."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-hameconnage",
        titre: "Hameçonnage par courriel",
        description: "Objectifs, variantes et crédibilité.",
        cours: [
          "L'hameçonnage par courriel poursuit plusieurs objectifs :",
          [
            "**mettre la cible en confiance**,",
            "**exfiltrer des informations sensibles**,",
            "**connaître la hiérarchie** de l'entreprise,",
            "**infecter les systèmes** directement par l'interne."
          ],
          { titre: "Trois façons de viser" },
          [
            "**Hameçonnage ciblé** : on réutilise les données trouvées pendant les recherches OSINT sur la cible.",
            "**Hameçonnage de cibles prioritaires** (whales) : on vise directement les hauts cadres, qui ont accès à l'information la plus pertinente.",
            "**Hameçonnage sur le bas de la chaîne** : on vise les employés du bas de l'échelle, plus enclins à coopérer et moins méfiants."
          ],
          "Le courriel contourne les horaires d'ouverture et l'indisponibilité de la cible, mais il faut **le plus d'information possible pour sembler légitime** : pas de courriel à minuit pour une entreprise de bureau standard."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quels objectifs peut poursuivre un courriel d'hameçonnage ?",
            choix: [
              "Mettre la cible en confiance",
              "Exfiltrer des informations sensibles",
              "Connaître la hiérarchie de l'entreprise",
              "Modifier les règles du pare-feu"
            ],
            reponse: [0, 1, 2],
            explication: "Confiance, exfiltration, hiérarchie et infection par l'interne."
          },
          {
            enonce: "Qui vise l'hameçonnage de cibles prioritaires, dit « whaling » ?",
            choix: [
              "Les hauts cadres, qui ont accès à l'information la plus pertinente",
              "Les stagiaires et nouveaux arrivants",
              "Les administrateurs systèmes uniquement",
              "Les clients de l'entreprise"
            ],
            reponse: 0,
            explication: "Les « baleines » sont les dirigeants."
          },
          {
            enonce: "Pourquoi viser les employés du bas de l'échelle ?",
            choix: [
              "Ils sont plus enclins à coopérer et se méfient moins",
              "Ils ont tous les droits administrateur",
              "Leurs adresses sont les seules publiques",
              "Ils ne sont jamais formés au chiffrement"
            ],
            reponse: 0,
            explication: "Moins de méfiance, plus de coopération : le point d'entrée est plus facile."
          },
          {
            enonce: "Pourquoi l'heure d'envoi d'un courriel d'hameçonnage compte-t-elle ?",
            choix: [
              "Un message envoyé à une heure incohérente avec l'activité de l'entreprise éveille les soupçons",
              "Les serveurs de messagerie bloquent les envois nocturnes",
              "Les filtres anti-spam sont plus stricts la nuit",
              "Les métadonnées du message changent selon l'heure"
            ],
            reponse: 0,
            explication: "Pas de courriel à minuit pour une entreprise de bureau standard : le détail trahit la mise en scène."
          },
          {
            enonce: "Quel avantage le courriel offre-t-il par rapport à un appel ?",
            choix: [
              "Il contourne les horaires d'ouverture et l'indisponibilité de la cible",
              "Il ne laisse aucune trace",
              "Il ne nécessite aucune information préalable",
              "Il contourne l'authentification multifacteur"
            ],
            reponse: 0,
            explication: "Le message attend son destinataire ; l'appel exige qu'il décroche."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-analyse-courriel",
        titre: "Analyser un courriel suspect",
        description: "Les indices d'un cas réel : en-têtes, domaine et scénario.",
        cours: [
          "Un courriel d'hameçonnage se démonte en regardant **les en-têtes et le lien**, jamais le seul habillage visuel.",
          [
            "**Domaine de l'expéditeur** : une prétendue équipe interne qui écrit depuis une messagerie grand public au lieu du domaine de l'entreprise.",
            "**Domaine du lien** : le lien de « réinitialisation » pointe vers un domaine sans rapport avec la société.",
            "**Incohérences d'identité** : l'adresse de l'en-tête `From` et celle de la signature ne sont pas les mêmes.",
            "**Le scénario** : urgence, compte suspendu, mot de passe « retrouvé sur des forums », action immédiate demandée.",
            "**Formule d'appel générique** alors que l'expéditeur est censé connaître le destinataire."
          ],
          { titre: "Le piège du « SPF : pass »" },
          "SPF, DKIM et DMARC valident que le message vient bien du domaine **qu'il déclare**. Ils ne disent **rien** de la légitimité de l'expéditeur : un compte gratuit tout neuf passe ces contrôles sans problème.",
          "À l'autre bout du lien, la page de « réinitialisation » n'est souvent qu'un formulaire qui écrit l'ancien et le nouveau mot de passe dans un fichier texte, avant d'afficher un message rassurant."
        ],
        exemple: {
          titre: "Exemple",
          legende: "En-tetes du courriel etudie",
          code: "From: Steel Door Data Protection - Cloud Security <sddp.cloudsec@proton.me>\nTo: marianne.haut-nimes@steeldoordataprotection.net\nSubject: [SECURITY] Account suspended - Password reset needed\nReceived-SPF: Pass ... envelope-from=<sddp.cloudsec@proton.me>\ndkim=pass header.d=proton.me\n\n  \"...please use the secured form here: https://pwreset.vilinter.net\"\n  signature : sddp.cloudteam@proton.me"
        },
        melangerChoix: true,
        questions: [
          {
            enonce: "L'en-tête indique `spf=pass` et `dkim=pass`. Que peut-on en conclure ?",
            choix: [
              "Que le message vient bien du domaine qu'il déclare, sans rien dire de sa légitimité",
              "Que le message est authentique et digne de confiance",
              "Que le message a été envoyé par l'entreprise citée",
              "Que la pièce jointe est saine"
            ],
            reponse: 0,
            explication: "SPF et DKIM authentifient le domaine expéditeur — ici celui de la messagerie grand public, pas celui de l'entreprise usurpée."
          },
          {
            enonce: "L'équipe « Cloud Security » de steeldoordataprotection.net écrit depuis sddp.cloudsec@proton.me. Qu'en pensez-vous ?",
            choix: [
              "C'est un signal fort : une équipe interne écrirait depuis le domaine de l'entreprise",
              "C'est normal, cette messagerie est chiffrée",
              "C'est normal pour une alerte de sécurité",
              "Cela prouve seulement que le message vient de l'étranger"
            ],
            reponse: 0,
            explication: "Le domaine de l'expéditeur ne correspond pas à l'organisation dont il se réclame."
          },
          {
            enonce: "Le message renvoie vers https://pwreset.vilinter.net. Quel est le problème ?",
            choix: [
              "Le domaine du lien n'a aucun rapport avec celui de l'entreprise",
              "Le lien utilise HTTPS, donc il est chiffré",
              "Le lien contient le mot « reset »",
              "Le lien est trop court pour être légitime"
            ],
            reponse: 0,
            explication: "Un lien légitime resterait sur le domaine de la société ; HTTPS ne garantit que le transport."
          },
          {
            enonce: "Quels éléments du scénario doivent alerter ?",
            choix: [
              "Le compte est suspendu et une action immédiate est demandée",
              "Le mot de passe aurait « fuité sur des forums de pirates »",
              "L'appel est générique alors que l'expéditeur devrait connaître le destinataire",
              "Le message comporte une signature d'équipe"
            ],
            reponse: [0, 1, 2],
            explication: "Urgence, prétexte alarmant et formule impersonnelle. Une signature d'équipe, elle, est banale."
          },
          {
            enonce: "Que fait typiquement la page derrière un tel lien ?",
            choix: [
              "Elle enregistre l'ancien et le nouveau mot de passe, puis affiche un message rassurant",
              "Elle installe automatiquement un rootkit noyau",
              "Elle chiffre le disque du visiteur",
              "Elle scanne le réseau local de la victime"
            ],
            reponse: 0,
            explication: "Un simple formulaire écrit les identifiants dans un fichier, puis confirme un changement qui n'a pas eu lieu."
          },
          {
            enonce: "L'adresse de l'en-tête From et celle de la signature diffèrent (cloudsec / cloudteam). Comment le lire ?",
            choix: [
              "Une incohérence d'identité typique d'un message forgé à la va-vite",
              "Une pratique normale des services de sécurité",
              "Une conséquence du relais SMTP",
              "Une conséquence de la signature DKIM"
            ],
            reponse: 0,
            explication: "Un service réel signe avec l'adresse qui envoie ; la divergence trahit le montage."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-telephone",
        titre: "Ingénierie sociale par téléphone",
        description: "Usurpation du numéro, vérification d'identité et clonage de voix.",
        cours: [
          "L'appel est parfois **plus efficace** qu'un simple courriel : il met la pression du direct et permet de rebondir sur les réponses.",
          [
            "Il permet de viser des cibles **mieux protégées** : banques, écoles, administrations.",
            "Combiné aux informations trouvées en OSINT, il permet de **se faire passer pour quelqu'un d'autre**, y compris face à une vérification d'identité (date de naissance, adresse, dernier paiement).",
            "Avec l'**IA**, on peut **simuler la voix** d'un tiers, ce qui augmente encore les chances de réussite."
          ],
          { titre: "Les centres d'appels" },
          "Ce sont les **cibles prioritaires**. Selon l'entreprise, on tente d'y :",
          [
            "**réinitialiser le mot de passe** d'un compte,",
            "**obtenir des informations** sur l'entreprise ou ses employés,",
            "**modifier un compte** (adresse de courriel, adresse postale…),",
            "**effectuer des actions non autorisées**, comme retirer de l'argent."
          ],
          "On peut aussi appeler un employé **en se faisant passer pour l'entreprise elle-même**. Dans tous les cas, l'essentiel est d'**usurper le numéro appelant**."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quelle précaution technique est présentée comme essentielle lors d'un appel malveillant ?",
            choix: [
              "Usurper le numéro appelant",
              "Passer par un VPN",
              "Appeler depuis une cabine",
              "Chiffrer la communication"
            ],
            reponse: 0,
            explication: "Un numéro affiché cohérent rend l'appel crédible dès la première seconde."
          },
          {
            enonce: "Quelles cibles sont prioritaires pour l'ingénierie sociale par téléphone ?",
            choix: ["Les centres d'appels", "Les services juridiques", "Les équipes de développement", "Les prestataires de ménage"],
            reponse: 0,
            explication: "Les centres d'appels manipulent des comptes toute la journée, avec des procédures standardisées."
          },
          {
            enonce: "Que change l'IA dans l'ingénierie sociale par téléphone ?",
            choix: [
              "Elle permet de simuler la voix d'une autre personne",
              "Elle déchiffre les échanges protégés",
              "Elle contourne l'usurpation de numéro",
              "Elle génère les mots de passe de la cible"
            ],
            reponse: 0,
            explication: "Le clonage vocal rend l'usurpation d'identité bien plus convaincante."
          },
          {
            enonce: "Pourquoi une vérification d'identité au téléphone ne suffit-elle pas toujours ?",
            choix: [
              "Les éléments demandés sont souvent trouvables en OSINT",
              "Les opérateurs ne la pratiquent jamais",
              "Elle est interdite par la réglementation",
              "Elle ne fonctionne que sur les lignes fixes"
            ],
            reponse: 0,
            explication: "Date de naissance, adresse, nom de l'employeur : autant de données publiques ou fuitées."
          },
          {
            enonce: "Quelles actions un attaquant cherche-t-il à obtenir d'un centre d'appels ?",
            choix: [
              "La réinitialisation du mot de passe d'un compte",
              "La modification de l'adresse de courriel associée à un compte",
              "Des informations sur l'entreprise ou ses employés",
              "L'installation d'un web shell sur le serveur"
            ],
            reponse: [0, 1, 2],
            explication: "Le web shell relève de la phase d'installation, pas d'un échange téléphonique."
          }
        ]
      },

      {
        type: "qcm",
        id: "osint-autres-methodes",
        titre: "Les autres méthodes",
        description: "SMS, sites frauduleux, présentiel, écoute et espionnage d'écran.",
        cours: [
          "Au-delà du courriel et du téléphone, l'ingénierie sociale emprunte d'autres chemins :",
          [
            "**SMS frauduleux** — le message court, sans en-têtes à examiner ni survol de lien possible.",
            "**Sites web frauduleux** — une copie d'un portail légitime, vers laquelle on dirige la victime.",
            "**Visite en présentiel aux bureaux** — la plus **risquée** pour l'attaquant, mais la plus directe.",
            "**Écoute aux portes** — surprendre une conversation dans un couloir, un train, une cafétéria.",
            "**Espionnage d'écran** — lire par-dessus l'épaule, dans un espace ouvert ou un lieu public."
          ],
          "Ces méthodes n'ont aucune parade technique : seules la vigilance et les procédures les arrêtent."
        ],
        melangerChoix: true,
        questions: [
          {
            enonce: "Quelle méthode d'ingénierie sociale est présentée comme la plus risquée pour l'attaquant ?",
            choix: [
              "La visite en présentiel aux bureaux",
              "Le SMS frauduleux",
              "L'écoute aux portes",
              "Le site web frauduleux"
            ],
            reponse: 0,
            explication: "Être physiquement sur place expose à l'identification et à l'interpellation."
          },
          {
            enonce: "Pourquoi un SMS frauduleux est-il difficile à vérifier pour la victime ?",
            choix: [
              "Le message est court, sans en-têtes à examiner et sans survol de lien possible",
              "Les SMS ne peuvent pas contenir de lien",
              "Les opérateurs chiffrent les SMS",
              "Les SMS ne sont pas journalisés"
            ],
            reponse: 0,
            explication: "Aucun en-tête, pas d'aperçu de l'URL : les réflexes du courriel ne s'appliquent plus."
          },
          {
            enonce: "Qu'est-ce que l'espionnage d'écran ?",
            choix: [
              "Lire l'écran d'une personne par-dessus son épaule, dans un lieu partagé",
              "Capturer l'affichage à distance par un malware",
              "Intercepter le signal vidéo d'un vidéoprojecteur",
              "Photographier un écran pour en lire les métadonnées"
            ],
            reponse: 0,
            explication: "Aucune technique : la présence physique suffit."
          },
          {
            enonce: "Qu'est-ce qui protège le mieux contre l'écoute aux portes et l'espionnage d'écran ?",
            choix: [
              "La vigilance des personnes et les procédures internes",
              "Un pare-feu applicatif",
              "Le chiffrement du disque",
              "L'authentification multifacteur"
            ],
            reponse: 0,
            explication: "Ces attaques passent hors du système d'information : aucune parade technique ne les atteint."
          }
        ]
      }

    ]
  });

  /* =========================================================
     CHAPITRE 5 — Quizz final : 20 questions tirées sur 50
     ========================================================= */

  const banqueFinale = [
    {
      enonce: "Dans le vocabulaire du renseignement, « intelligence » se traduit par :",
      choix: ["Renseignement", "Analyse", "Investigation", "Perspicacité"],
      reponse: 0,
      explication: "Intelligence = renseignement."
    },
    {
      enonce: "Un analyste exploite des photographies satellite. De quelle discipline s'agit-il ?",
      choix: ["IMINT", "SIGINT", "HUMINT", "OSINT"],
      reponse: 0,
      explication: "IMINT : renseignement d'origine image."
    },
    {
      enonce: "Un agent obtient une information d'un contact interne. De quelle discipline s'agit-il ?",
      choix: ["HUMINT", "OSINT", "SIGINT", "IMINT"],
      reponse: 0,
      explication: "HUMINT : la source est humaine."
    },
    {
      enonce: "La question « la source a-t-elle délivré l'information de son plein gré ? » sert à distinguer :",
      choix: [
        "Une information ouverte d'une information fermée",
        "Une information blanche d'une information grise",
        "L'OSINT du SIGINT",
        "La reconnaissance passive de la reconnaissance active"
      ],
      reponse: 0,
      explication: "Plein gré → ouverte ; sinon → fermée."
    },
    {
      enonce: "Les sources ouvertes représentent environ quelle part de l'information disponible ?",
      choix: ["70 %", "30 %", "95 %", "50 %"],
      reponse: 0,
      explication: "70 % pour les sources ouvertes, 30 % pour les fermées."
    },
    {
      enonce: "Une base de données accessible seulement après un accord de confidentialité est :",
      choix: ["Une source fermée mais licite", "Une source ouverte", "De l'information blanche", "Du SIGINT"],
      reponse: 0,
      explication: "Accès protégé, donc source fermée — ce qui n'en fait pas une source illégale."
    },
    {
      enonce: "L'information blanche représente environ :",
      choix: ["95 % des informations", "70 % des informations", "30 % des informations", "5 % des informations"],
      reponse: 0,
      explication: "Le blanc domine largement : environ 95 %."
    },
    {
      enonce: "Une donnée publique mais introuvable sans connaître le bon registre est plutôt :",
      choix: ["De l'information grise", "De l'information blanche", "De l'information noire", "Du HUMINT"],
      reponse: 0,
      explication: "Licite mais difficile d'accès ou d'existence méconnue : c'est le gris."
    },
    {
      enonce: "Quel usage de l'OSINT est de nature défensive ?",
      choix: [
        "Vérifier l'exposition de ses propres informations",
        "Préparer un courriel de spear-phishing",
        "Choisir la charge utile à livrer",
        "Établir un canal C2"
      ],
      reponse: 0,
      explication: "Mesurer sa propre exposition, c'est faire de l'OSINT sur soi-même."
    },
    {
      enonce: "Dans quel ordre se suivent ces phases de la Kill Chain ?",
      choix: [
        "Reconnaissance, armement, livraison, exploitation",
        "Reconnaissance, livraison, armement, exploitation",
        "Armement, reconnaissance, exploitation, livraison",
        "Livraison, reconnaissance, armement, exploitation"
      ],
      reponse: 0,
      explication: "Phases 1 à 4 dans cet ordre exact."
    },
    {
      enonce: "Quelle phase se situe entre l'exploitation et le commandement & contrôle ?",
      choix: ["L'installation", "La livraison", "L'armement", "Les actions sur les objectifs"],
      reponse: 0,
      explication: "Exploitation → Installation → C2."
    },
    {
      enonce: "Consulter les profils LinkedIn des employés d'une cible, c'est :",
      choix: [
        "De la reconnaissance passive",
        "De la reconnaissance active",
        "De la livraison",
        "De l'exploitation"
      ],
      reponse: 0,
      explication: "Aucune interaction avec les systèmes de la cible."
    },
    {
      enonce: "Pourquoi un attaquant préfère-t-il épuiser la reconnaissance passive avant de scanner ?",
      choix: [
        "Le scan apparaît dans les journaux de la cible et peut déclencher une alerte",
        "Le scan est plus lent que la recherche web",
        "Le scan ne donne aucune information utile",
        "Le scan est interdit par les moteurs de recherche"
      ],
      reponse: 0,
      explication: "Le passif est invisible côté cible ; l'actif se voit."
    },
    {
      enonce: "Un attaquant achète une charge utile éprouvée sur un marché clandestin. Quelle phase ?",
      choix: ["Armement", "Livraison", "Reconnaissance", "Installation"],
      reponse: 0,
      explication: "Acquérir l'arme relève de la phase 2."
    },
    {
      enonce: "Une clé USB au logo de l'entreprise est déposée dans le hall d'accueil. Quelle phase ?",
      choix: ["Livraison", "Armement", "Exploitation", "Reconnaissance"],
      reponse: 0,
      explication: "Le baiting est un moyen d'acheminer la charge utile."
    },
    {
      enonce: "Un fournisseur habituel de la cible voit son site compromis pour piéger les visiteurs. Comment nomme-t-on cela ?",
      choix: ["Une attaque watering-hole", "Un spear-phishing", "Un credential stuffing", "Un DNS tunneling"],
      reponse: 0,
      explication: "On empoisonne le point d'eau fréquenté par la cible."
    },
    {
      enonce: "Une tâche planifiée nommée « Windows Update » relance l'implant à chaque démarrage. Quelle phase ?",
      choix: ["Installation", "Commandement & contrôle", "Exploitation", "Actions sur les objectifs"],
      reponse: 0,
      explication: "C'est une technique de persistance."
    },
    {
      enonce: "Un implant envoie toutes les heures une requête HTTPS vers un domaine contrôlé par l'attaquant. Quelle phase ?",
      choix: ["Commandement & contrôle", "Installation", "Livraison", "Armement"],
      reponse: 0,
      explication: "Des beacons réguliers : c'est le canal C2."
    },
    {
      enonce: "Les Shadow Copies et les sauvegardes locales sont effacées avant un chiffrement massif. Quelle phase ?",
      choix: ["Actions sur les objectifs", "Installation", "Exploitation", "Commandement & contrôle"],
      reponse: 0,
      explication: "Maximiser l'impact en empêchant toute restauration."
    },
    {
      enonce: "Le timestomping consiste à :",
      choix: [
        "Modifier les horodatages des fichiers pour brouiller l'analyse",
        "Retarder l'exécution du malware",
        "Synchroniser l'implant avec le serveur C2",
        "Horodater légalement une preuve"
      ],
      reponse: 0,
      explication: "L'attaquant fausse la chronologie pour compliquer l'investigation."
    },
    {
      enonce: "Vous voulez lister les PDF publiés sur exemple.fr. Quelle requête ?",
      choix: [
        "site:exemple.fr filetype:pdf",
        "inurl:exemple.fr pdf",
        "intitle:pdf exemple.fr",
        "filetype:exemple.fr pdf"
      ],
      reponse: 0,
      explication: "`site:` restreint le domaine, `filetype:` le format."
    },
    {
      enonce: "La Google Hacking Database est hébergée par :",
      choix: ["exploit-db", "Have I Been Pwned", "GitHub", "OpenStreetMap"],
      reponse: 0,
      explication: "La GHDB est le catalogue de dorks d'exploit-db."
    },
    {
      enonce: "Vous cherchez des caméras et serveurs exposés sur Internet, avec leurs versions. Quel type d'outil ?",
      choix: [
        "Un moteur de recherche fondé sur le balayage de ports",
        "Un crawler de site web",
        "Un annuaire WHOIS",
        "Un moteur de recherche inversée d'images"
      ],
      reponse: 0,
      explication: "Ces moteurs indexent des machines et des bannières de service, pas des pages."
    },
    {
      enonce: "Vous disposez d'une photo de profil et voulez retrouver les autres comptes de la personne. Que faites-vous ?",
      choix: [
        "Une recherche inversée d'image, complétée si besoin par de la reconnaissance faciale",
        "Une lecture des EXIF du fichier",
        "Un balayage de ports",
        "Une interrogation WHOIS"
      ],
      reponse: 0,
      explication: "Une photo de profil identique relie des comptes sans autre lien apparent."
    },
    {
      enonce: "En quoi la reconnaissance faciale dépasse-t-elle la recherche inversée ?",
      choix: [
        "Elle retrouve d'autres photos du même visage, pas seulement la même image",
        "Elle lit les coordonnées GPS de l'image",
        "Elle fonctionne sans connexion Internet",
        "Elle identifie le modèle de l'appareil photo"
      ],
      reponse: 0,
      explication: "Elle compare des visages, ce qui élargit considérablement la recherche."
    },
    {
      enonce: "Quel outil lit et efface les métadonnées d'une image ?",
      choix: ["exiftool", "cewl", "HTTrack", "theHarvester"],
      reponse: 0,
      explication: "`exiftool` est l'outil de référence sur les métadonnées."
    },
    {
      enonce: "Une photo téléchargée depuis un réseau social traditionnel contient rarement ses EXIF parce que :",
      choix: [
        "La plateforme les supprime à la publication",
        "Les appareils modernes n'en écrivent plus",
        "Le format JPEG ne les supporte pas",
        "Le navigateur les efface à l'affichage"
      ],
      reponse: 0,
      explication: "Les réseaux les conservaient autrefois ; ils les retirent désormais."
    },
    {
      enonce: "Une photo sans aucune métadonnée peut-elle être localisée ?",
      choix: [
        "Oui, en croisant les éléments visibles avec la cartographie et StreetView",
        "Non, les EXIF sont indispensables",
        "Oui, mais seulement si elle a été prise en extérieur de jour",
        "Non, sauf si la personne publie sa position"
      ],
      reponse: 0,
      explication: "La triangulation visuelle exploite enseignes, bâtiments et mobilier urbain."
    },
    {
      enonce: "Vous connaissez le nom d'un employé et le format des adresses de sa société. Que pouvez-vous faire ?",
      choix: [
        "Reconstituer son adresse, puis la vérifier avec un vérificateur de courriels",
        "Obtenir son mot de passe",
        "Lire sa boîte de réception",
        "Consulter ses messages privés"
      ],
      reponse: 0,
      explication: "Format des adresses + annuaire professionnel = l'annuaire complet des adresses."
    },
    {
      enonce: "À quoi sert un service de recherche de pseudonyme comme WhatsMyName ?",
      choix: [
        "Tester un même identifiant sur un grand nombre de plateformes",
        "Vérifier la force d'un mot de passe",
        "Retrouver le propriétaire d'un domaine",
        "Archiver un site web"
      ],
      reponse: 0,
      explication: "Il cherche où un pseudonyme donné est déjà enregistré."
    },
    {
      enonce: "theHarvester produit, à partir d'un domaine :",
      choix: [
        "Des courriels, sous-domaines, IP, noms et URL",
        "Des mots de passe en clair",
        "Des captures d'écran du site",
        "Des enregistrements DNSSEC"
      ],
      reponse: 0,
      explication: "C'est le rôle du moissonneur."
    },
    {
      enonce: "Dans Maltego, une « Transform » sert à :",
      choix: [
        "Découvrir de nouveaux objets liés à un objet du graphe",
        "Convertir un graphe en rapport PDF",
        "Anonymiser les requêtes",
        "Chiffrer les résultats de la collecte"
      ],
      reponse: 0,
      explication: "Chaque Transform étend le graphe à partir d'un objet existant."
    },
    {
      enonce: "Pourquoi la version Community de Maltego convient-elle mal à une grande investigation ?",
      choix: [
        "Elle plafonne à une douzaine de résultats par Transform",
        "Elle interdit l'export du graphe",
        "Elle ne gère pas les domaines",
        "Elle expire au bout de sept jours"
      ],
      reponse: 0,
      explication: "La limite de résultats tronque rapidement les graphes."
    },
    {
      enonce: "Quel outil automatise l'OSINT pour cartographier une surface d'attaque ?",
      choix: ["SpiderFoot", "HTTrack", "exiftool", "cewl"],
      reponse: 0,
      explication: "SpiderFoot automatise la collecte et le croisement."
    },
    {
      enonce: "Une adresse figure dans plusieurs fuites indexées par Have I Been Pwned. Quel est le risque immédiat ?",
      choix: [
        "Un accès direct au compte si le mot de passe a été réutilisé ailleurs",
        "Une infection automatique de la machine",
        "La suppression du compte par le fournisseur",
        "Une élévation de privilèges sur le domaine"
      ],
      reponse: 0,
      explication: "La réutilisation transforme une vieille brèche en accès valide sur un autre service."
    },
    {
      enonce: "Pourquoi une offre d'emploi très technique intéresse-t-elle un attaquant ?",
      choix: [
        "Elle révèle les technologies et versions déployées dans l'entreprise",
        "Elle contient les identifiants du candidat",
        "Elle donne l'adresse IP publique du siège",
        "Elle liste les correctifs manquants"
      ],
      reponse: 0,
      explication: "Les compétences exigées dressent l'inventaire technique de la maison."
    },
    {
      enonce: "LinkedIn permet notamment d'identifier :",
      choix: [
        "Les employés clés et l'organigramme",
        "Les systèmes ICS/OT et les projets en cours",
        "Le matériel et les logiciels utilisés",
        "Les comptes à privilèges du domaine"
      ],
      reponse: [0, 1, 2],
      explication: "Les comptes à privilèges ne se lisent pas sur un profil public."
    },
    {
      enonce: "Quel annuaire renseigne sur l'enregistrement d'un nom de domaine ?",
      choix: ["WHOIS", "GHDB", "EXIF", "DKIM"],
      reponse: 0,
      explication: "WHOIS donne le déclarant, les dates et les contacts."
    },
    {
      enonce: "Vous voulez consulter une page supprimée du site de la cible. Où regardez-vous ?",
      choix: [
        "Dans les instantanés de la Wayback Machine",
        "Dans le WHOIS du domaine",
        "Dans les enregistrements DNS",
        "Dans les EXIF des images du site"
      ],
      reponse: 0,
      explication: "Les archives conservent des versions antérieures du site."
    },
    {
      enonce: "Un répertoire /.git accessible en HTTP expose :",
      choix: [
        "L'historique complet du code, y compris des secrets retirés depuis",
        "Les mots de passe des visiteurs",
        "Les journaux d'accès du serveur",
        "La base de données du site"
      ],
      reponse: 0,
      explication: "Git conserve les versions passées : un secret supprimé y reste lisible."
    },
    {
      enonce: "Parmi ces actions, laquelle relève de la reconnaissance ACTIVE ?",
      choix: [
        "Un traceroute vers le serveur de la cible",
        "Une requête WHOIS",
        "Une recherche sur la Wayback Machine",
        "La lecture d'un dépôt GitHub public"
      ],
      reponse: 0,
      explication: "Le traceroute émet des paquets vers la cible ; les autres passent par des tiers."
    },
    {
      enonce: "L'ingénierie sociale est utile quand :",
      choix: [
        "Le système est trop complexe à exploiter techniquement",
        "L'information publique sur la cible manque",
        "Le coût d'une attaque directe est trop élevé",
        "La cible n'a aucune présence en ligne"
      ],
      reponse: [0, 1, 2],
      explication: "Manque d'information, ou système trop coûteux à attaquer de front."
    },
    {
      enonce: "Un courriel affiche `spf=pass` et `dkim=pass`. Que garantit cela ?",
      choix: [
        "Que le message provient bien du domaine qu'il déclare",
        "Que l'expéditeur est légitime",
        "Que la pièce jointe est saine",
        "Que le lien mène à un site de confiance"
      ],
      reponse: 0,
      explication: "L'authentification porte sur le domaine émetteur, pas sur les intentions."
    },
    {
      enonce: "Une alerte de sécurité signée « équipe Cloud » d'une entreprise arrive depuis une messagerie grand public. Que concluez-vous ?",
      choix: [
        "Le domaine de l'expéditeur ne correspond pas à l'organisation invoquée : forte présomption d'hameçonnage",
        "C'est normal pour un message chiffré",
        "C'est normal pour une alerte urgente",
        "Cela indique seulement un serveur situé à l'étranger"
      ],
      reponse: 0,
      explication: "Une équipe interne écrit depuis le domaine de l'entreprise."
    },
    {
      enonce: "Quel type d'hameçonnage vise directement les dirigeants ?",
      choix: [
        "L'hameçonnage de cibles prioritaires (whaling)",
        "L'hameçonnage sur le bas de la chaîne",
        "Le baiting",
        "Le watering-hole"
      ],
      reponse: 0,
      explication: "Les « baleines » sont les hauts cadres, qui détiennent l'information la plus pertinente."
    },
    {
      enonce: "Pourquoi viser les employés du bas de l'échelle plutôt que les cadres ?",
      choix: [
        "Ils se méfient moins et coopèrent plus volontiers",
        "Ils disposent de plus de droits",
        "Leurs messages ne sont pas filtrés",
        "Ils utilisent des mots de passe plus courts"
      ],
      reponse: 0,
      explication: "Moins de méfiance : le point d'entrée est plus facile à obtenir."
    },
    {
      enonce: "Lors d'un appel malveillant, quel élément est présenté comme essentiel ?",
      choix: [
        "Usurper le numéro appelant",
        "Appeler en dehors des heures de bureau",
        "Masquer son numéro",
        "Enregistrer la conversation"
      ],
      reponse: 0,
      explication: "Un numéro affiché cohérent installe la crédibilité dès le décroché."
    },
    {
      enonce: "En quoi l'IA renforce-t-elle l'ingénierie sociale téléphonique ?",
      choix: [
        "Elle permet de cloner la voix d'une personne connue de la victime",
        "Elle devine les mots de passe",
        "Elle usurpe le numéro appelant",
        "Elle contourne les serveurs vocaux"
      ],
      reponse: 0,
      explication: "La voix familière lève la dernière méfiance de l'interlocuteur."
    },
    {
      enonce: "Quelle méthode d'ingénierie sociale est la plus risquée pour l'attaquant ?",
      choix: [
        "La visite en présentiel aux bureaux",
        "Le SMS frauduleux",
        "Le site web frauduleux",
        "L'écoute aux portes"
      ],
      reponse: 0,
      explication: "L'attaquant s'expose physiquement à l'identification."
    },
    {
      enonce: "Contre l'écoute aux portes et l'espionnage d'écran, la parade est :",
      choix: [
        "Organisationnelle et comportementale",
        "Un pare-feu applicatif",
        "Le chiffrement du disque",
        "Un antivirus à jour"
      ],
      reponse: 0,
      explication: "Ces attaques se déroulent hors du système d'information."
    }
  ];

  cours.chapitres.push({
    id: "ch5",
    titre: "Chapitre 5 — Quizz final",
    description: "Vingt questions tirées au hasard dans une banque de cinquante, sur tout le programme.",
    exercices: [
      {
        type: "qcm",
        id: "osint-quizz-final",
        titre: "Quizz final — OSINT",
        description: "20 questions tirées parmi 50 : définitions, Kill Chain, outils et ingénierie sociale.",
        tirage: 20,
        melangerChoix: true,
        questions: banqueFinale
      }
    ]
  });

})();
