/* =============================================================
   OSINT — chapitre 4 : QCM de révision
   -------------------------------------------------------------
   Une banque de 100 questions sur tout le cours (fondamentaux et
   méthodes des cinq enquêtes) ; chaque partie en tire 20.
   Chargé après osint.js et osint-exercices.js.
   ============================================================= */

(function () {

  const cours = CONTENU["osint"];

  /* ---- Le renseignement en sources ouvertes ---- */
  const renseignement = [
    {
      enonce: "Que signifie le sigle OSINT ?",
      choix: ["Open Source Intelligence", "Online Security Intelligence", "Open System Interconnection", "Operational Source Investigation"],
      reponse: 0,
      explication: "Renseignement d'origine sources ouvertes."
    },
    {
      enonce: "Des écoutes de communications radio relèvent de :",
      choix: ["SIGINT", "OSINT", "IMINT", "HUMINT"],
      reponse: 0,
      explication: "Origine électromagnétique : SIGINT."
    },
    {
      enonce: "Un informateur qui renseigne un service relève de :",
      choix: ["HUMINT", "SIGINT", "IMINT", "OSINT"],
      reponse: 0,
      explication: "Origine humaine : HUMINT."
    },
    {
      enonce: "Quelle part de l'information disponible est ouverte, selon le cours ?",
      choix: ["Environ 70 %", "Environ 95 %", "Environ 30 %", "Environ 50 %"],
      reponse: 0,
      explication: "70 % ouverte, 30 % fermée ; les 95 % concernent l'information blanche."
    },
    {
      enonce: "Une information licite mais difficile à trouver ou à atteindre est :",
      choix: ["Grise", "Blanche", "Noire", "Fermée"],
      reponse: 0,
      explication: "Licite et peu accessible : grise."
    },
    {
      enonce: "Quelle couleur d'information sort du cadre de l'OSINT ?",
      choix: ["Noire", "Grise", "Blanche", "Aucune"],
      reponse: 0,
      explication: "L'information noire est explicitement protégée."
    },
    {
      enonce: "Un rapport annuel publié sur le site d'une entreprise est une information :",
      choix: ["Blanche", "Grise", "Noire", "Fermée"],
      reponse: 0,
      explication: "Délivrée de plein gré, accès facile et licite."
    },
    {
      enonce: "Une information devient du renseignement quand elle a été :",
      choix: ["Collectée, évaluée et analysée pour répondre à une question", "Publiée sur Internet", "Chiffrée", "Vendue"],
      reponse: 0,
      explication: "Le renseignement est une information traitée, au service d'une question."
    },
    {
      enonce: "Quels usages défensifs de l'OSINT sont cités ?",
      choix: [
        "Mesurer l'exposition de son organisation",
        "Se prémunir de l'ingénierie sociale",
        "Faire de la veille",
        "Remplacer l'antivirus"
      ],
      reponse: [0, 1, 2],
      explication: "L'OSINT ne remplace aucune protection technique."
    },
    {
      enonce: "Une photographie satellite achetée à un fournisseur commercial est exploitée. Discipline ?",
      choix: ["IMINT", "SIGINT", "HUMINT", "COMINT"],
      reponse: 0,
      explication: "Renseignement d'origine image, quel que soit le fournisseur."
    }
  ];

  /* ---- La Cyber Kill Chain ---- */
  const killChain = [
    {
      enonce: "Combien de phases compte la Cyber Kill Chain ?",
      choix: ["7", "5", "10", "3"],
      reponse: 0,
      explication: "Reconnaissance, armement, livraison, exploitation, installation, C2, actions."
    },
    {
      enonce: "Quelle phase répond à la question « Qui est la cible ? »",
      choix: ["Reconnaissance", "Armement", "Livraison", "Exploitation"],
      reponse: 0,
      explication: "Phase 1, celle de l'OSINT."
    },
    {
      enonce: "Qu'est-ce qui distingue la reconnaissance passive de l'active ?",
      choix: [
        "La passive n'interagit pas avec la cible",
        "La passive est automatisée",
        "La passive est illégale",
        "La passive se fait de nuit"
      ],
      reponse: 0,
      explication: "Aucune trace dans les journaux de la cible."
    },
    {
      enonce: "Un scan `nmap` du serveur de la cible est :",
      choix: ["De la reconnaissance active", "De la reconnaissance passive", "De l'armement", "De l'installation"],
      reponse: 0,
      explication: "On envoie des paquets à la cible : c'est actif."
    },
    {
      enonce: "Une clé USB piégée laissée sur le parking de l'entreprise relève de :",
      choix: ["La livraison", "L'armement", "L'installation", "La reconnaissance"],
      reponse: 0,
      explication: "La clé transporte la charge jusqu'à la victime."
    },
    {
      enonce: "L'ouverture d'une macro malveillante qui déclenche l'exécution relève de :",
      choix: ["L'exploitation", "La livraison", "L'installation", "Le C2"],
      reponse: 0,
      explication: "Phase 4 : le code s'exécute."
    },
    {
      enonce: "Un web shell déposé sur le serveur pour y revenir relève de :",
      choix: ["L'installation", "L'exploitation", "L'armement", "Les actions sur les objectifs"],
      reponse: 0,
      explication: "Persistance : phase 5."
    },
    {
      enonce: "Le DNS tunneling sert à quelle phase ?",
      choix: ["Commandement & contrôle", "Livraison", "Reconnaissance", "Armement"],
      reponse: 0,
      explication: "Un canal discret pour piloter la machine compromise."
    },
    {
      enonce: "L'exfiltration de la base clients relève de :",
      choix: ["Actions sur les objectifs", "Commandement & contrôle", "Installation", "Exploitation"],
      reponse: 0,
      explication: "Phase 7 : ce que l'attaquant est venu chercher."
    }
  ];

  /* ---- Outils et moteurs ---- */
  const outils = [
    {
      enonce: "Que fait l'opérateur `intitle:` ?",
      choix: ["Cherche le mot dans le titre de la page", "Cherche le mot dans l'URL", "Restreint à un domaine", "Restreint à un type de fichier"],
      reponse: 0,
      explication: "`inurl:` vise l'URL, `site:` le domaine, `filetype:` le type."
    },
    {
      enonce: "Quel dork exclut le mot « recrutement » des résultats ?",
      choix: ["`-recrutement`", "`+recrutement`", "`\"recrutement\"`", "`not:recrutement`"],
      reponse: 0,
      explication: "Le signe moins exclut un terme."
    },
    {
      enonce: "Qu'est-ce que la GHDB ?",
      choix: ["Une base de dorks Google éprouvés", "Une base de fuites de mots de passe", "Un registre de domaines", "Un moteur de recherche d'images"],
      reponse: 0,
      explication: "Google Hacking Database, hébergée par Exploit-DB."
    },
    {
      enonce: "Quel outil collecte automatiquement courriels et sous-domaines d'un domaine ?",
      choix: ["theHarvester", "TinEye", "exiftool", "Overpass Turbo"],
      reponse: 0,
      explication: "theHarvester interroge moteurs et sources publiques."
    },
    {
      enonce: "Quel outil cartographie la surface d'attaque d'une cible en interrogeant des dizaines de sources ?",
      choix: ["SpiderFoot", "Have I Been Pwned", "Wayback Machine", "WhatsMyName"],
      reponse: 0,
      explication: "SpiderFoot automatise la collecte et corrèle les résultats."
    },
    {
      enonce: "Dans Maltego, une « Transform » :",
      choix: [
        "Fait apparaître les objets liés à un objet du graphe",
        "Chiffre le graphe",
        "Convertit une image en texte",
        "Supprime les doublons"
      ],
      reponse: 0,
      explication: "On part d'un domaine, d'une adresse… et la Transform ajoute ce qui y est relié."
    },
    {
      enonce: "Quel service indique si une adresse courriel figure dans des fuites de données ?",
      choix: ["Have I Been Pwned", "WhatsMyName", "crt.sh", "Maltego"],
      reponse: 0,
      explication: "HIBP recense les fuites publiques par adresse."
    },
    {
      enonce: "Pourquoi une fuite de mot de passe est-elle exploitable même ancienne ?",
      choix: [
        "Les utilisateurs réutilisent leurs mots de passe",
        "Les mots de passe n'expirent jamais",
        "Les fuites contiennent toujours la clé de chiffrement",
        "Elle ne l'est pas"
      ],
      reponse: 0,
      explication: "Un mot de passe réutilisé ouvre d'autres comptes."
    },
    {
      enonce: "Quels éléments des offres d'emploi intéressent un attaquant ?",
      choix: [
        "Les technologies et logiciels exigés",
        "Les noms des équipes et des responsables",
        "Les sites et adresses des bureaux",
        "La police de caractères de l'annonce"
      ],
      reponse: [0, 1, 2],
      explication: "Inventaire technique, organigramme et implantations : de quoi préparer un prétexte."
    },
    {
      enonce: "Un service comme Hunter permet surtout de deviner :",
      choix: ["Le format des adresses courriel d'une entreprise", "Les mots de passe des employés", "L'adresse IP du pare-feu", "Le registrar du domaine"],
      reponse: 0,
      explication: "`prenom.nom@`, `p.nom@`… : une fois le format connu, toutes les adresses se reconstruisent."
    }
  ];

  /* ---- L'ingénierie sociale ---- */
  const ingenierie = [
    {
      enonce: "L'ingénierie sociale exploite avant tout :",
      choix: ["La faille humaine", "Une faille logicielle", "Une faille matérielle", "Une faille cryptographique"],
      reponse: 0,
      explication: "Elle contourne les protections en trompant une personne."
    },
    {
      enonce: "Quand recourt-on à l'ingénierie sociale, selon le cours ?",
      choix: [
        "Quand l'OSINT n'a pas suffi",
        "Quand l'attaque technique coûterait trop cher",
        "Uniquement après l'exfiltration",
        "Jamais avant d'avoir un accès administrateur"
      ],
      reponse: [0, 1],
      explication: "Elle prend le relais de l'OSINT, ou remplace une attaque technique trop coûteuse."
    },
    {
      enonce: "Un courriel personnalisé avec le nom du projet en cours et celui du chef de service est :",
      choix: ["De l'hameçonnage ciblé", "Du spam", "Un watering-hole", "Du baiting"],
      reponse: 0,
      explication: "Il réutilise les données trouvées en OSINT."
    },
    {
      enonce: "Pourquoi viser le « bas de la chaîne » ?",
      choix: [
        "Ces employés sont souvent plus enclins à coopérer",
        "Ils ont les droits d'administrateur",
        "Ils ne reçoivent pas de courriels",
        "Ils signent les contrats"
      ],
      reponse: 0,
      explication: "Moins méfiants, plus pressés de rendre service."
    },
    {
      enonce: "SPF, DKIM et DMARC sont tous « pass ». Qu'est-ce que cela prouve ?",
      choix: [
        "Le message vient du domaine qu'il déclare",
        "L'expéditeur est de bonne foi",
        "Les pièces jointes sont saines",
        "Le message vient de votre entreprise"
      ],
      reponse: 0,
      explication: "Un escroc qui possède son propre domaine obtient trois « pass »."
    },
    {
      enonce: "Pour démonter un courriel suspect, on regarde en priorité :",
      choix: ["Les en-têtes et le domaine réel des liens", "Le logo et la signature", "La mise en page", "La politesse du message"],
      reponse: 0,
      explication: "L'habillage se copie ; les en-têtes et les domaines, beaucoup moins."
    },
    {
      enonce: "Quels vecteurs d'ingénierie sociale sont cités en plus du courriel ?",
      choix: ["Le téléphone", "Le SMS", "La visite sur place", "La mise à jour du BIOS"],
      reponse: [0, 1, 2],
      explication: "Plus les faux sites, l'écoute aux portes et le regard par-dessus l'épaule."
    },
    {
      enonce: "Quelle technologie rend l'hameçonnage téléphonique plus crédible aujourd'hui ?",
      choix: ["L'imitation de voix par IA", "La 5G", "Le chiffrement de bout en bout", "Le Wi-Fi 6"],
      reponse: 0,
      explication: "Une voix clonée de dirigeant, avec un numéro usurpé."
    }
  ];

  /* ---- Enquête 1 : métadonnées ---- */
  const metadonnees = [
    {
      enonce: "Quel champ EXIF donne la date et l'heure de la prise de vue ?",
      choix: ["`DateTimeOriginal`", "`ModifyDate`", "`Software`", "`Artist`"],
      reponse: 0,
      explication: "`ModifyDate` peut être celle d'un export ou d'une retouche."
    },
    {
      enonce: "Dans quel fuseau est écrite l'heure EXIF ?",
      choix: ["En heure locale de l'appareil", "Toujours en UTC", "Dans le fuseau du serveur qui héberge la photo", "En heure de Paris"],
      reponse: 0,
      explication: "Seul `OffsetTimeOriginal`, s'il existe, précise le décalage."
    },
    {
      enonce: "Que révèle un champ `Software: Adobe Photoshop` ?",
      choix: ["L'image a été retouchée ou réexportée", "La photo est authentique", "L'appareil est un reflex Adobe", "La position GPS est fausse"],
      reponse: 0,
      explication: "La date peut alors être celle de l'export, pas de la prise de vue."
    },
    {
      enonce: "Convertissez 45° 30' 00\" N en degrés décimaux.",
      choix: ["45.5", "45.3", "45.03", "-45.5"],
      reponse: 0,
      explication: "45 + 30/60 = 45,5 ; positif au Nord."
    },
    {
      enonce: "Une longitude « 1° 33' W » s'écrit en décimal :",
      choix: ["-1.55", "1.55", "-1.33", "1.33"],
      reponse: 0,
      explication: "1 + 33/60 = 1,55, négatif à l'Ouest."
    },
    {
      enonce: "Quelle commande affiche directement la position GPS en degrés décimaux ?",
      choix: ["`exiftool -n -GPSPosition photo.jpg`", "`exiftool -all= photo.jpg`", "`exiftool -b -ThumbnailImage photo.jpg`", "`unzip -p photo.jpg`"],
      reponse: 0,
      explication: "`-n` désactive la mise en forme DMS."
    },
    {
      enonce: "Que fait `exiftool -all= fichier` ?",
      choix: ["Supprime toutes les métadonnées", "Affiche toutes les métadonnées", "Extrait la vignette", "Copie les métadonnées dans un autre fichier"],
      reponse: 0,
      explication: "À faire avant de publier un fichier."
    },
    {
      enonce: "Dans les propriétés d'un PDF, le champ `Author` contient souvent :",
      choix: ["Le nom de la session Windows ou du compte Office", "Le nom du destinataire", "L'adresse IP du poste", "Le nom de l'imprimante"],
      reponse: 0,
      explication: "Le logiciel le remplit tout seul avec le compte utilisé."
    },
    {
      enonce: "Différence entre `Creator` et `Producer` dans un PDF ?",
      choix: [
        "`Creator` est le logiciel d'origine, `Producer` le moteur qui a fabriqué le PDF",
        "`Creator` est l'auteur, `Producer` l'éditeur",
        "Ce sont deux noms du même champ",
        "`Producer` est la date de production"
      ],
      reponse: 0,
      explication: "Ex. `Creator: Word`, `Producer: Microsoft: Print To PDF`."
    },
    {
      enonce: "Comment lire les métadonnées internes d'un `.docx` sans outil ?",
      choix: ["Le renommer en `.zip` et ouvrir `docProps/`", "L'ouvrir dans le Bloc-notes", "L'imprimer en PDF", "Le convertir en image"],
      reponse: 0,
      explication: "Un document Office est une archive ZIP."
    },
    {
      enonce: "Quel fichier d'un `.docx` contient `Company` et `Template` ?",
      choix: ["`docProps/app.xml`", "`docProps/core.xml`", "`word/document.xml`", "`[Content_Types].xml`"],
      reponse: 0,
      explication: "`core.xml` contient `creator`, `lastModifiedBy`, `revision` et les dates."
    },
    {
      enonce: "Pourquoi la vignette EXIF d'une photo recadrée peut-elle trahir son auteur ?",
      choix: [
        "Certains outils modifient l'image sans régénérer la vignette",
        "La vignette est toujours en plus haute définition",
        "La vignette contient la position GPS",
        "La vignette est chiffrée"
      ],
      reponse: 0,
      explication: "La miniature montre alors la photo d'origine, non recadrée."
    },
    {
      enonce: "Une photo est récupérée sur un réseau social sans EXIF. Où chercher le fichier d'origine ?",
      choix: ["Une pièce jointe", "Un dossier cloud partagé", "Le site personnel de l'auteur", "Le cache du navigateur de la victime"],
      reponse: [0, 1, 2],
      explication: "Des sources ouvertes qui transmettent le fichier tel quel ; l'ordinateur d'autrui n'en fait pas partie."
    }
  ];

  /* ---- Enquête 2 : géolocalisation ---- */
  const geolocalisation = [
    {
      enonce: "Quelle est la première étape devant une photo à géolocaliser ?",
      choix: ["Faire l'inventaire des indices, zone par zone", "Lancer une recherche inversée sur l'image entière", "Ouvrir Street View au hasard", "Chercher l'auteur"],
      reponse: 0,
      explication: "Décrire avant de chercher : texte, route, bâti, nature."
    },
    {
      enonce: "Quel indice est en général le plus rentable ?",
      choix: ["Le texte lisible", "La couleur du ciel", "La forme des nuages", "La marque des voitures"],
      reponse: 0,
      explication: "Chaque mot lisible devient une requête."
    },
    {
      enonce: "Une borne kilométrique à sommet jaune signale :",
      choix: ["Une route départementale", "Une route nationale", "Une autoroute", "Une voie communale"],
      reponse: 0,
      explication: "Sommet rouge sur une nationale, jaune sur une départementale."
    },
    {
      enonce: "Un numéro commençant par `05` sur une vitrine situe la photo :",
      choix: ["Dans le Sud-Ouest", "En Île-de-France", "Dans le Nord-Est", "Dans le Sud-Est"],
      reponse: 0,
      explication: "01 IDF, 02 Nord-Ouest, 03 Nord-Est, 04 Sud-Est, 05 Sud-Ouest."
    },
    {
      enonce: "Façades en granit et toits d'ardoise orientent vers :",
      choix: ["La Bretagne", "La Provence", "Le Nord", "L'Alsace"],
      reponse: 0,
      explication: "La brique signale plutôt le Nord, l'ocre et les tuiles rondes la Méditerranée."
    },
    {
      enonce: "Une enseigne de chaîne seule ne dit rien. Que faire ?",
      choix: [
        "Croiser avec une deuxième chaîne voisine",
        "Abandonner cet indice",
        "Appeler le magasin",
        "Chercher la chaîne dans TinEye"
      ],
      reponse: 0,
      explication: "Deux chaînes voisines n'ont souvent qu'une rue en commun."
    },
    {
      enonce: "Quel moteur retrouve la même image exacte et sa date de première apparition ?",
      choix: ["TinEye", "Yandex Images", "Overpass Turbo", "Panoramax"],
      reponse: 0,
      explication: "TinEye trie les correspondances exactes par date."
    },
    {
      enonce: "Pourquoi une photo inédite n'est-elle pas retrouvée par recherche inversée ?",
      choix: [
        "Elle n'a jamais été publiée : seuls les éléments connus qu'elle contient peuvent l'être",
        "Les moteurs refusent les photos de smartphone",
        "Les EXIF bloquent la recherche",
        "Elle est trop lourde"
      ],
      reponse: 0,
      explication: "On recadre alors sur un élément unique et connu."
    },
    {
      enonce: "Comment confirmer une hypothèse de lieu dans Street View ?",
      choix: [
        "Aligner deux éléments fixes comme sur la photo",
        "Vérifier que la météo est la même",
        "Retrouver les mêmes passants",
        "Comparer la couleur des voitures"
      ],
      reponse: 0,
      explication: "S'ils se superposent, on est au bon endroit et dans le bon axe."
    },
    {
      enonce: "Les commerces de la photo n'apparaissent pas dans Street View. Que faire ?",
      choix: ["Remonter l'historique des dates (icône d'horloge)", "Conclure que le lieu est faux", "Passer en vue satellite", "Changer de moteur de recherche"],
      reponse: 0,
      explication: "Les commerces changent : choisissez l'année proche de la photo."
    },
    {
      enonce: "À quoi sert Overpass Turbo ?",
      choix: [
        "Trouver tous les lieux OpenStreetMap qui combinent plusieurs éléments",
        "Lire les EXIF d'une photo",
        "Retrouver une page supprimée",
        "Lister les sous-domaines d'un site"
      ],
      reponse: 0,
      explication: "Ex. une église à moins de 50 m d'une pharmacie dans un département."
    }
  ];

  /* ---- Enquête 3 : plaques ---- */
  const plaques = [
    {
      enonce: "Depuis quand le format SIV `AB-123-CD` est-il en vigueur ?",
      choix: ["2009", "1950", "1999", "2019"],
      reponse: 0,
      explication: "Le FNI a couvert 1950 à 2009."
    },
    {
      enonce: "Que révèle la plaque FNI `4521 TR 29` ?",
      choix: ["Une immatriculation dans le Finistère", "Le domicile actuel du titulaire", "Une première immatriculation en 2029", "Un véhicule de garage"],
      reponse: 0,
      explication: "Les derniers chiffres donnent le département d'immatriculation."
    },
    {
      enonce: "Que dit le numéro d'une plaque SIV sur le véhicule ?",
      choix: [
        "Une période de première immatriculation en France",
        "Le département du titulaire",
        "La région de fabrication",
        "Le nombre de propriétaires"
      ],
      reponse: 0,
      explication: "Numéros attribués à vie, dans l'ordre chronologique national."
    },
    {
      enonce: "Le logo de région à droite d'une plaque SIV indique :",
      choix: ["Un choix libre du titulaire", "Son domicile", "Le lieu d'achat", "La préfecture qui a délivré la carte grise"],
      reponse: 0,
      explication: "Il ne prouve rien sur le domicile."
    },
    {
      enonce: "Une plaque `WW-123-AB` désigne :",
      choix: ["Une immatriculation provisoire", "Un véhicule de garage", "Un véhicule diplomatique", "Un véhicule de collection"],
      reponse: 0,
      explication: "`W` seul = garage, `WW` = provisoire."
    },
    {
      enonce: "Plaque allemande commençant par `HH` :",
      choix: ["Hambourg", "Hanovre", "Heidelberg", "Munich"],
      reponse: 0,
      explication: "`B` Berlin, `M` Munich, `HH` Hambourg, `K` Cologne."
    },
    {
      enonce: "Plaque autrichienne commençant par `W` :",
      choix: ["Vienne", "Wels", "Salzbourg", "Graz"],
      reponse: 0,
      explication: "`W` Vienne, `G` Graz, `L` Linz, `S` Salzbourg, `I` Innsbruck."
    },
    {
      enonce: "Plaque suisse commençant par `VS` :",
      choix: ["Valais", "Vaud", "Genève", "Zurich"],
      reponse: 0,
      explication: "`VD` Vaud, `GE` Genève, `ZH` Zurich."
    },
    {
      enonce: "Que révèle une plaque britannique `LM74 ABC` ?",
      choix: [
        "Région de Londres, immatriculée entre septembre 2024 et février 2025",
        "Région de Manchester, immatriculée en 1974",
        "Un véhicule de location",
        "Rien : la numérotation est nationale"
      ],
      reponse: 0,
      explication: "`L` = Londres ; `74` = second semestre 2024 (`24` + 50)."
    },
    {
      enonce: "Dans quels pays le numéro de plaque ne dit-il rien du lieu ?",
      choix: ["Italie", "Espagne", "Allemagne", "Pologne"],
      reponse: [0, 1],
      explication: "Numérotation nationale en Italie et en Espagne."
    },
    {
      enonce: "Que donne un site de pièces détachées à partir d'une plaque ?",
      choix: ["Marque, modèle, motorisation, date de mise en circulation", "Nom et adresse du titulaire", "L'assureur", "L'historique des amendes"],
      reponse: 0,
      explication: "Aucune identité n'en sort."
    },
    {
      enonce: "Qui peut interroger le Fichier des véhicules assurés (FVA) à partir d'une plaque ?",
      choix: ["Les forces de l'ordre", "Le FGAO", "Un particulier victime d'un accrochage", "Un garagiste"],
      reponse: [0, 1],
      explication: "Un particulier passe par le constat amiable ou, en cas de délit de fuite, par une plainte."
    }
  ];

  /* ---- Enquête 4 : courriels ---- */
  const courriels = [
    {
      enonce: "Comment afficher les en-têtes complets d'un message dans Gmail ?",
      choix: ["⋮ > Afficher l'original", "Fichier > Propriétés", "Ctrl + U", "Clic droit > Inspecter"],
      reponse: 0,
      explication: "Outlook : Fichier > Propriétés ; Thunderbird : Ctrl + U."
    },
    {
      enonce: "Quel en-tête est écrit librement par l'expéditeur et donc falsifiable ?",
      choix: ["`From`", "Le `Received` ajouté par votre propre serveur", "L'adresse IP vue par votre propre serveur", "Aucun"],
      reponse: 0,
      explication: "Le `From` n'est que l'affichage."
    },
    {
      enonce: "Où partira votre réponse si vous cliquez sur « Répondre » ?",
      choix: ["À l'adresse du `Reply-To`, s'il existe", "Toujours à l'adresse du `From`", "Au `Return-Path`", "Au serveur du `Message-ID`"],
      reponse: 0,
      explication: "Le `Reply-To` est souvent l'adresse réelle de l'escroc."
    },
    {
      enonce: "Quel en-tête SPF vérifie-t-il ?",
      choix: ["Le domaine du `Return-Path`", "Le domaine du `From`", "Le `Reply-To`", "Le `Subject`"],
      reponse: 0,
      explication: "SPF contrôle l'adresse d'enveloppe."
    },
    {
      enonce: "Le domaine d'un `Message-ID` est utile car :",
      choix: [
        "Il est créé par le logiciel ou le serveur d'origine et trahit le vrai service",
        "Il contient le mot de passe de l'expéditeur",
        "Il donne la position GPS",
        "Il est toujours identique au `From`"
      ],
      reponse: 0,
      explication: "Un `From` d'une banque avec un `Message-ID` d'un service grand public : suspect."
    },
    {
      enonce: "Dans quel ordre lire les lignes `Received` ?",
      choix: ["De bas en haut", "De haut en bas", "Par ordre alphabétique", "Peu importe"],
      reponse: 0,
      explication: "Chaque serveur ajoute sa ligne en haut : la plus basse est la plus proche de l'expéditeur."
    },
    {
      enonce: "Dans `Received: from PC-COMPTA (…)`, que désigne `PC-COMPTA` ?",
      choix: ["Le nom de machine annoncé par l'expéditeur", "Le serveur du destinataire", "Le nom de l'utilisateur", "Le domaine du `From`"],
      reponse: 0,
      explication: "Le nom donné par la machine lors du HELO."
    },
    {
      enonce: "Lesquelles de ces adresses sont privées ?",
      choix: ["`10.4.2.7`", "`192.168.1.20`", "`172.20.0.5`", "`198.51.100.7`"],
      reponse: [0, 1, 2],
      explication: "`10.x`, `172.16-31.x` et `192.168.x` ne sortent pas du réseau local."
    },
    {
      enonce: "Que signifie `dmarc=fail` ?",
      choix: [
        "Le domaine du `From` n'est pas aligné avec ceux validés par SPF ou DKIM",
        "Le message est chiffré",
        "Le serveur destinataire est en panne",
        "La pièce jointe est infectée"
      ],
      reponse: 0,
      explication: "L'affichage ment sur l'origine du message."
    },
    {
      enonce: "Que garantit `dkim=pass header.d=exemple.fr` ?",
      choix: [
        "Le message est signé par exemple.fr et n'a pas été modifié",
        "L'expéditeur est une personne de confiance",
        "Le message ne contient pas de lien",
        "Le message a été lu"
      ],
      reponse: 0,
      explication: "Signature du domaine et intégrité, rien sur l'intention."
    },
    {
      enonce: "`Date: Tue, 8 Oct 2024 09:30:00 -0400`. Quelle heure UTC ?",
      choix: ["13 h 30", "5 h 30", "9 h 30", "11 h 30"],
      reponse: 0,
      explication: "UTC = heure affichée moins le décalage : 9 h 30 + 4 h."
    },
    {
      enonce: "Quel registre régional gère les adresses IP européennes ?",
      choix: ["RIPE NCC", "ARIN", "APNIC", "LACNIC"],
      reponse: 0,
      explication: "ARIN : Amérique du Nord, APNIC : Asie-Pacifique."
    },
    {
      enonce: "Le whois d'une IP désigne un fournisseur d'accès. Qui peut identifier l'abonné ?",
      choix: ["La justice, par réquisition au fournisseur", "N'importe qui, via le RDAP", "Le registre régional, sur demande", "Le destinataire du courriel"],
      reponse: 0,
      explication: "L'OSINT s'arrête à l'organisation titulaire du bloc."
    }
  ];

  /* ---- Enquête 5 : domaines ---- */
  const domaines = [
    {
      enonce: "Quelles informations donne le WHOIS d'un domaine ?",
      choix: ["Le registrar", "Les dates de création et d'expiration", "Les serveurs de noms", "Le mot de passe du compte d'hébergement"],
      reponse: [0, 1, 2],
      explication: "Le titulaire est masqué pour un particulier depuis le RGPD."
    },
    {
      enonce: "Qu'est-ce que RDAP ?",
      choix: ["Le successeur du WHOIS, qui répond en JSON", "Un protocole de messagerie", "Un registre d'adresses IP privées", "Un format d'archive web"],
      reponse: 0,
      explication: "Ex. `rdap.nic.fr/domain/exemple.fr`."
    },
    {
      enonce: "RDAP indique une création le 5 septembre à 22 h. Heure de Paris en été ?",
      choix: ["Le 6 septembre à 0 h", "Le 5 septembre à 20 h", "Le 5 septembre à 22 h", "Le 6 septembre à 2 h"],
      reponse: 0,
      explication: "RDAP donne l'heure en UTC ; Paris en été = UTC + 2."
    },
    {
      enonce: "Quel enregistrement DNS révèle la messagerie d'un domaine ?",
      choix: ["`MX`", "`A`", "`NS`", "`AAAA`"],
      reponse: 0,
      explication: "Google Workspace, Microsoft 365 ou serveur maison."
    },
    {
      enonce: "Pourquoi les enregistrements `TXT` sont-ils bavards ?",
      choix: [
        "Ils listent les services autorisés à envoyer (SPF) et les jetons de vérification SaaS",
        "Ils contiennent les mots de passe",
        "Ils donnent l'adresse du titulaire",
        "Ils listent les visiteurs du site"
      ],
      reponse: 0,
      explication: "`google-site-verification`, `MS=`… : l'inventaire des outils utilisés."
    },
    {
      enonce: "Quel enregistrement donne le gestionnaire DNS (Cloudflare, OVH…) ?",
      choix: ["`NS`", "`MX`", "`TXT`", "`CNAME`"],
      reponse: 0,
      explication: "Name Server."
    },
    {
      enonce: "Comment crt.sh révèle-t-il des sous-domaines oubliés ?",
      choix: [
        "Par les journaux publics Certificate Transparency",
        "En scannant les ports du serveur",
        "En lisant le fichier `robots.txt`",
        "Par force brute sur le DNS"
      ],
      reponse: 0,
      explication: "Chaque certificat émis y est inscrit, avec ses noms de domaine."
    },
    {
      enonce: "Que donne l'URL `web.archive.org/web/2005/https://exemple.fr` ?",
      choix: ["La capture la plus proche de 2005", "Toutes les captures de 2005", "La page actuelle", "Le WHOIS de 2005"],
      reponse: 0,
      explication: "L'API `cdx` donne, elle, la liste brute des captures."
    },
    {
      enonce: "À quoi sert `id_` après l'horodatage dans une URL de la Wayback Machine ?",
      choix: ["Afficher la page telle qu'archivée, sans le bandeau", "Identifier l'auteur de la capture", "Télécharger tout le site", "Supprimer la capture"],
      reponse: 0,
      explication: "`/web/19980214181349id_/…` renvoie le code d'origine."
    },
    {
      enonce: "Deux sites partagent le même identifiant `G-…` dans leur code source. Conclusion probable ?",
      choix: ["Ils ont le même propriétaire", "Ils ont le même hébergeur", "Ils utilisent le même certificat", "Ils ont été piratés"],
      reponse: 0,
      explication: "Un identifiant d'analytics est rattaché à un compte."
    },
    {
      enonce: "Que chercher dans le code source d'une page (Ctrl + U) ?",
      choix: ["Les commentaires HTML oubliés", "Les balises `<meta>`", "Les chemins et adresses d'API dans les scripts", "Le mot de passe de l'administrateur en clair dans les en-têtes HTTP"],
      reponse: [0, 1, 2],
      explication: "Plus `robots.txt` et `sitemap.xml`, qui listent ce que le site voudrait cacher."
    }
  ];

  /* ---- Méthode : pivoter et recouper ---- */
  const methode = [
    {
      enonce: "Que signifie « pivoter » en OSINT ?",
      choix: [
        "Faire de chaque information trouvée une nouvelle requête",
        "Changer de cible",
        "Passer en reconnaissance active",
        "Supprimer ses traces"
      ],
      reponse: 0,
      explication: "Un nom de machine se compare à un auteur, une date EXIF à une date d'envoi…"
    },
    {
      enonce: "Quand une conclusion tient-elle, selon la méthode du cours ?",
      choix: ["Quand deux indices indépendants la soutiennent", "Quand un outil l'affiche", "Quand la cible la confirme", "Quand elle est probable"],
      reponse: 0,
      explication: "Un indice seul peut être falsifié ; deux indices indépendants se recoupent."
    },
    {
      enonce: "Qu'accompagne chaque conclusion rédigée ?",
      choix: ["Sa preuve", "Son niveau de confiance", "Le nom de l'outil le plus cher", "Une capture de la cible prévenue"],
      reponse: [0, 1],
      explication: "Certain, probable ou possible, avec la preuve qui le justifie."
    }
  ];

  const ch4 = {
    id: "ch4",
    titre: "Chapitre 4 — Révision",
    description: "Vingt questions tirées au hasard sur tout le cours.",
    exercices: [
      {
        type: "qcm",
        id: "osint-revision",
        titre: "QCM — Tout le cours",
        description: "Renseignement, Kill Chain, outils, ingénierie sociale, métadonnées, géolocalisation, plaques, courriels et domaines.",
        tirage: 20,
        melangerChoix: true,
        questions: [].concat(
          renseignement, killChain, outils, ingenierie, metadonnees,
          geolocalisation, plaques, courriels, domaines, methode
        )
      }
    ]
  };

  cours.chapitres.push(ch4);

})();
