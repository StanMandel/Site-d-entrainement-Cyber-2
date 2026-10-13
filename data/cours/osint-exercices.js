/* =============================================================
   OSINT — enquêtes pratiques (type "enquete", moteur enquete.js)
   -------------------------------------------------------------
   Chaque enquête commence par un petit cours de méthodes, puis
   enchaîne des challenges du plus facile au plus dur. Les
   techniques des enquêtes précédentes resservent dans les
   suivantes ; l'enquête finale les combine toutes.

   Pièces : assets/osint/ (fabriquées hors du site). Les photos
   viennent de Panoramax (photos de rue libres, visages et plaques
   floutés) ; leurs métadonnées d'origine ont été retirées, et les
   EXIF des challenges « métadonnées » sont fabriqués. Personnes,
   entreprises (Aqualenn, Morgat RH Conseil, collectif Brume) et
   domaines en .example sont fictifs.
   ============================================================= */

(function () {

  const cours = CONTENU["osint"];

  /* Pièces réutilisées d'un challenge à l'autre. */
  const COURRIEL_BRUME = [
    "Return-Path: <collectif.brume@boite-anonyme.example>",
    "Received: from smtp.boite-anonyme.example (smtp.boite-anonyme.example [203.0.113.18])",
    "        by mx.aqualenn.example (Postfix) with ESMTPS id 7D2A41C02",
    "        for <direction@aqualenn.example>; Tue, 25 Jul 2017 21:47:06 +0200 (CEST)",
    "Received: from LAPTOP-GKERLAOU (unknown [198.51.100.140])",
    "        (Authenticated sender: collectif.brume)",
    "        by smtp.boite-anonyme.example (Postfix) with ESMTPSA id 0F3B2",
    "        for <direction@aqualenn.example>; Tue, 25 Jul 2017 19:47:03 +0000 (UTC)",
    "From: \"Collectif Brume\" <collectif.brume@boite-anonyme.example>",
    "To: direction@aqualenn.example",
    "Subject: Nous savons ce que vous rejetez",
    "Date: Tue, 25 Jul 2017 21:46:58 +0200",
    "Message-ID: <5977a1e2.4c1d@boite-anonyme.example>",
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:52.0) Gecko/20100101 Thunderbird/52.2.1",
    "MIME-Version: 1.0",
    "Content-Type: multipart/mixed; boundary=\"------------B1F4\"",
    "",
    "--------------B1F4",
    "Content-Type: text/plain; charset=utf-8",
    "",
    "Madame, Monsieur,",
    "",
    "La photo jointe a été prise aujourd'hui, à deux pas de chez vous.",
    "Notre communiqué suit. Vous avez 72 heures.",
    "",
    "Collectif Brume",
    "",
    "--------------B1F4",
    "Content-Type: image/jpeg; name=\"brume-photo.jpg\"",
    "Content-Disposition: attachment; filename=\"brume-photo.jpg\"",
    "",
    "--------------B1F4",
    "Content-Type: application/pdf; name=\"brume-revendication.pdf\"",
    "Content-Disposition: attachment; filename=\"brume-revendication.pdf\"",
    "",
    "--------------B1F4--"
  ].join("\n");

  const PIECES_BRUME = [
    { texte: COURRIEL_BRUME, nom: "brume.eml" },
    { image: "assets/osint/brume-photo.jpg", nom: "brume-photo.jpg", legende: "Pièce jointe n° 1" },
    { fichier: "assets/osint/brume-revendication.pdf", nom: "brume-revendication.pdf", legende: "Pièce jointe n° 2" }
  ];

  /* =========================================================
     CHAPITRE 2 — Enquêtes sur images
     ========================================================= */

  const ch2 = {
    id: "ch2",
    titre: "Chapitre 2 — Enquêtes sur images",
    description: "Faire parler un fichier, une photo de rue, une plaque d'immatriculation.",
    exercices: [

      /* ---------------------------------------------------------
         Enquête 1 — Métadonnées
         --------------------------------------------------------- */
      {
        type: "enquete",
        id: "osint-enquete-metadonnees",
        titre: "Enquête 1 — Ce que cache un fichier",
        description: "EXIF, coordonnées GPS, propriétés des PDF et des documents Office, vignette oubliée.",
        methodes: [
          {
            titre: "Les métadonnées EXIF",
            texte: [
              "Un appareil photo ou un smartphone écrit dans chaque JPEG des **données EXIF** :",
              [
                "`Make` / `Model` : marque et modèle de l'appareil ;",
                "`DateTimeOriginal` : date et heure de la prise de vue, en **heure locale**, avec parfois `OffsetTimeOriginal` (le décalage, ex. `+02:00`) ;",
                "`Artist`, `Copyright` : l'auteur déclaré ;",
                "`Software` : le logiciel (ou la version du micrologiciel) qui a écrit le fichier ;",
                "`GPSLatitude`, `GPSLongitude` : la position, si la localisation était active."
              ],
              {
                entetes: ["Outil", "Usage"],
                lignes: [
                  ["`exiftool photo.jpg`", "Ligne de commande, lit tout (images, PDF, Office, vidéos)"],
                  ["Jeffrey's Image Metadata Viewer (exif.regex.info)", "En ligne : on dépose le fichier, il affiche EXIF, carte et vignette"],
                  ["Windows : clic droit > Propriétés > Détails", "Lecture rapide des champs principaux"]
                ]
              }
            ],
            exemple: {
              titre: "Exemple — sortie d'exiftool",
              texte: [
                { code: "$ exiftool vacances.jpg\nMake                  : Canon\nCamera Model Name     : Canon EOS 250D\nDate/Time Original    : 2023:07:14 21:03:55\nOffset Time Original  : +02:00\nArtist                : J. Dupont\nGPS Position          : 43 deg 17' 46.80\" N, 5 deg 22' 12.60\" E" },
                "On lit : photo prise le **14 juillet 2023 à 21 h 03** (heure d'été française), avec un Canon EOS 250D, par « J. Dupont », à une position précise."
              ]
            }
          },
          {
            titre: "Des coordonnées GPS à un lieu",
            texte: [
              "Les EXIF stockent la position en **degrés, minutes, secondes** (DMS), avec une référence `N`/`S` et `E`/`W`.",
              "Pour la carte, on convertit en **degrés décimaux** : `décimal = D + M/60 + S/3600`, **négatif** au Sud et à l'Ouest.",
              "Puis on colle `latitude, longitude` dans Google Maps ou OpenStreetMap : la carte donne la rue, la commune, et souvent une vue au sol.",
              { remarque: "`exiftool -n -GPSPosition photo.jpg` donne directement les degrés décimaux." }
            ],
            exemple: {
              titre: "Exemple — conversion",
              texte: [
                { code: "GPSLatitude  : 48 deg 51' 29.6\"  N   ->  48 + 51/60 + 29.6/3600 =  48.85822\nGPSLongitude :  2 deg 17' 40.2\"  E   ->   2 + 17/60 + 40.2/3600 =   2.29450" },
                "`48.85822, 2.29450` dans une carte : le Champ-de-Mars, au pied de la tour Eiffel (Paris 7e). Une longitude `W` aurait donné `-2.29450` : en pleine Manche, au nord du cap Fréhel."
              ]
            }
          },
          {
            titre: "Les documents aussi",
            texte: [
              "Un **PDF** contient un dictionnaire d'informations : `Author` (souvent le nom de la session Windows ou du compte Office), `Creator` (le logiciel d'origine, ex. Word), `Producer` (le moteur qui a fabriqué le PDF), `CreationDate` au format `D:AAAAMMJJhhmmss+01'00'`.",
              "Un document **Office** (`.docx`, `.xlsx`, `.pptx`) est une **archive ZIP**. Deux fichiers y racontent son histoire :",
              [
                "`docProps/core.xml` : `creator`, `lastModifiedBy` (dernier compte qui a enregistré), `revision`, dates de création et de modification ;",
                "`docProps/app.xml` : `Company` (l'organisation déclarée dans Office), `Template` (le modèle utilisé), `Application`."
              ],
              "Lecture : `exiftool`, les propriétés du lecteur PDF (Fichier > Propriétés), ou tout simplement renommer le `.docx` en `.zip` et l'ouvrir."
            ],
            exemple: {
              titre: "Exemple — sous le capot d'un .docx",
              texte: [
                { code: "$ unzip -p rapport.docx docProps/core.xml\n<dc:creator>Service communication</dc:creator>\n<cp:lastModifiedBy>m.durand</cp:lastModifiedBy>\n<cp:revision>12</cp:revision>\n\n$ unzip -p rapport.docx docProps/app.xml\n<Template>Modele_Agence_Lumen.dotx</Template>\n<Company>Agence Lumen</Company>" },
                "Le document se dit « Service communication », mais il a été enregistré en dernier par le compte `m.durand`, sur un poste où Office est enregistré au nom d'**Agence Lumen**, avec le modèle de cette agence : il a été sous-traité."
              ]
            }
          },
          {
            titre: "La vignette oubliée",
            texte: [
              "Un JPEG peut embarquer une **vignette** (`ThumbnailImage`, quelques centaines de pixels) dans ses EXIF, pour l'aperçu rapide.",
              "Certains outils de recadrage ou de floutage modifient l'image principale **sans régénérer la vignette** : la miniature montre alors la photo **d'origine**, ce que l'auteur voulait cacher compris.",
              { code: "exiftool -b -ThumbnailImage photo.jpg > vignette.jpg\nexiftool -b -PreviewImage  photo.jpg > apercu.jpg", legende: "Extraire les images embarquées" },
              "Jeffrey's Image Metadata Viewer affiche aussi la vignette, s'il y en a une."
            ],
            exemple: {
              titre: "Exemple",
              texte: "Une photo de profil est recadrée sur le visage. La vignette EXIF, restée intacte, montre la scène entière : la façade derrière la personne, avec le nom de la rue."
            }
          },
          {
            titre: "Pièges et limites",
            texte: [
              [
                "Les **réseaux sociaux suppriment** les EXIF : cherchez le fichier d'origine (pièce jointe, cloud partagé, site personnel).",
                "L'heure EXIF est **locale** : sans `OffsetTimeOriginal`, on ne sait pas dans quel fuseau elle a été écrite.",
                "Un `Software` du type Photoshop ou GIMP signale une **retouche** : la date peut être celle de l'export.",
                "Les EXIF se **modifient** en une commande : une métadonnée est un indice, à **recouper** avec le contenu de l'image."
              ],
              { attention: "Avant de publier une photo ou un document : `exiftool -all= fichier` (ou Propriétés > « Supprimer les propriétés et les informations personnelles »)." }
            ]
          }
        ],
        challenges: [
          {
            niveau: 1,
            titre: "L'appareil du photographe",
            enonce: "Cette photo d'un rond-point a été envoyée telle quelle, en pièce jointe.",
            pieces: [{ image: "assets/osint/meta-1.jpg", nom: "meta-1.jpg" }],
            question: "Avec quel appareil a-t-elle été prise, quel jour, et par qui ?",
            champs: [
              { libelle: "Modèle de l'appareil", reponse: "X-T30", accepte: ["Fujifilm X-T30", "XT30", "Fujifilm XT30"] },
              { libelle: "Date de prise de vue (JJ/MM/AAAA)", reponse: "14/06/2024", accepte: ["2024-06-14", "2024:06:14", "14 juin 2024", "14-06-2024"] },
              { libelle: "Auteur déclaré", reponse: "Gaelle Rospars", accepte: ["Gaëlle Rospars", "Rospars"] }
            ],
            indices: [
              "Téléchargez la photo, puis ouvrez-la avec `exiftool` ou un lecteur de métadonnées en ligne.",
              "Les champs à lire s'appellent `Model`, `DateTimeOriginal` et `Artist`."
            ],
            solution: [
              { code: "$ exiftool meta-1.jpg\nMake                : FUJIFILM\nCamera Model Name   : X-T30\nArtist              : Gaelle Rospars\nDate/Time Original  : 2024:06:14 18:42:07\nOffset Time Original: +02:00" },
              "Photo prise le **14 juin 2024 à 18 h 42** (UTC+2) avec un **Fujifilm X-T30**, auteur déclaré **Gaelle Rospars** (nom fictif ; EXIF fabriquées pour l'exercice).",
              "Photo : StephaneP / Panoramax, CC BY-SA 4.0."
            ]
          },
          {
            niveau: 2,
            titre: "Une route de campagne",
            enonce: "Une route, un champ, une ferme : rien dans l'image ne permet de la situer.",
            pieces: [{ image: "assets/osint/meta-2.jpg", nom: "meta-2.jpg" }],
            question: "Dans quelle commune a-t-elle été prise ?",
            champs: [
              { libelle: "Commune", reponse: "Canihuel" },
              { libelle: "Département (numéro)", reponse: "22", accepte: ["Côtes-d'Armor", "Cotes d'Armor"] }
            ],
            indices: [
              "Le contenu de l'image ne servira pas : regardez les champs `GPS…` des métadonnées.",
              "Convertissez `48° 18' 57.24\" N` et `3° 6' 39.75\" W` en degrés décimaux. Attention au signe de la longitude.",
              "Collez `48.3159, -3.1110` dans une carte et lisez le nom de la commune."
            ],
            solution: [
              { code: "GPS Latitude  : 48 deg 18' 57.24\" N  ->  48.31590\nGPS Longitude :  3 deg  6' 39.75\" W  ->  -3.11104" },
              "Le point tombe sur une route départementale de **Canihuel**, dans les **Côtes-d'Armor (22)**, près du lieu-dit Pellinec. Oublier le signe moins de la longitude `W` envoie le point dans l'Yonne, près de Sens, à plus de 450 km.",
              "Photo : tykayn / Panoramax, CC BY-SA 4.0."
            ]
          },
          {
            niveau: 2,
            titre: "La fuite du plan social",
            enonce: [
              "Un « plan de réorganisation » de l'entreprise fictive Aqualenn a été publié anonymement sur un forum. La direction veut savoir qui l'a rédigé, et quand."
            ],
            pieces: [{ fichier: "assets/osint/meta-3.pdf", nom: "meta-3.pdf", legende: "Le document publié" }],
            champs: [
              { libelle: "Auteur", reponse: "Maëlle Kervarec", accepte: ["Kervarec", "Maelle Kervarec"] },
              { libelle: "Logiciel d'origine", reponse: "Microsoft Word", accepte: ["Word", "Word pour Microsoft 365", "Microsoft Word pour Microsoft 365", "MS Word"] },
              { libelle: "Date de création (JJ/MM/AAAA)", reponse: "11/03/2024", accepte: ["2024-03-11", "11 mars 2024", "11-03-2024"] }
            ],
            indices: [
              "Ouvrez le PDF dans un lecteur, puis Fichier > Propriétés ; ou `exiftool meta-3.pdf`.",
              "`CreationDate` se lit `D:AAAAMMJJhhmmss` : `D:20240311…`."
            ],
            solution: [
              { code: "$ exiftool meta-3.pdf\nTitle         : Plan de réorganisation 2024 - v3\nAuthor        : Maëlle Kervarec\nCreator       : Microsoft® Word pour Microsoft 365\nCreate Date   : 2024:03:11 08:15:22+01:00" },
              "Le PDF a été exporté depuis **Word** le **11 mars 2024** à 8 h 15, sur une session au nom de **Maëlle Kervarec** (personne fictive). Le titre « v3 » indique en plus qu'il existe des versions antérieures."
            ]
          },
          {
            niveau: 3,
            titre: "Le recadrage qui trahit",
            enonce: "L'auteur a recadré sa photo pour ne montrer qu'un passage piéton, et a retiré la position GPS.",
            pieces: [{ image: "assets/osint/meta-4.jpg", nom: "meta-4.jpg" }],
            question: "Dans quelle ville a-t-elle été prise, et devant quel hôtel ?",
            champs: [
              { libelle: "Ville", reponse: "Nice" },
              { libelle: "Nom de l'hôtel", reponse: "Nice Riviera", accepte: ["Hôtel Nice Riviera", "Hotel Nice Riviera"] }
            ],
            indices: [
              "Pas de GPS : cherchez ce que le fichier contient d'autre que l'image affichée.",
              "Les EXIF peuvent embarquer une vignette que l'outil de recadrage n'a pas mise à jour.",
              "`exiftool -b -ThumbnailImage meta-4.jpg > vignette.jpg`, puis ouvrez `vignette.jpg`."
            ],
            solution: [
              "La vignette EXIF (640 × 480) montre la photo **avant recadrage** : une rue bordée de palmiers, et à droite une façade où se lit **« HOTEL NICE RIVIERA »**.",
              "Une recherche du nom donne l'adresse : 45, rue Pastorelli, à **Nice**. La vue au sol confirme le carrefour.",
              "Photo : JLZIMMERMANN / Panoramax, CC BY-SA 4.0."
            ]
          },
          {
            niveau: 3,
            titre: "La note de service",
            enonce: "Cette note se présente comme rédigée par la direction des ressources humaines d'Aqualenn. Le service juridique doute qu'elle ait été écrite en interne.",
            pieces: [{ fichier: "assets/osint/meta-5.docx", nom: "meta-5.docx", legende: "La note, au format Word" }],
            champs: [
              { libelle: "Organisation déclarée dans Office", reponse: "Morgat RH Conseil" },
              { libelle: "Dernier compte à avoir enregistré", reponse: "y.quemener", accepte: ["yquemener"] },
              { libelle: "Nombre de révisions", reponse: 7, tolerance: 0 }
            ],
            indices: [
              "Un `.docx` est une archive ZIP : renommez-le en `.zip` et ouvrez-le.",
              "Les réponses sont dans `docProps/core.xml` et `docProps/app.xml`."
            ],
            solution: [
              { code: "docProps/core.xml : <dc:creator>Direction RH</dc:creator>\n                    <cp:lastModifiedBy>y.quemener</cp:lastModifiedBy>\n                    <cp:revision>7</cp:revision>\ndocProps/app.xml  : <Template>Modele_Note_MorgatRH.dotx</Template>\n                    <Company>Morgat RH Conseil</Company>" },
              "Le champ `creator` a été soigné (« Direction RH »), mais pas le reste : la note a connu **7 révisions**, la dernière enregistrée par **y.quemener**, sur un Office déclaré au nom de **Morgat RH Conseil**, avec le modèle de ce cabinet. Elle a été rédigée par un prestataire (tout est fictif)."
            ]
          }
        ]
      },

      /* ---------------------------------------------------------
         Enquête 2 — Géolocalisation
         --------------------------------------------------------- */
      {
        type: "enquete",
        id: "osint-enquete-geolocalisation",
        titre: "Enquête 2 — Où a été prise cette photo ?",
        description: "Inventaire des indices, pivot sur le texte, recherche inversée, vue au sol, requêtes géographiques.",
        methodes: [
          {
            titre: "Décrire avant de chercher",
            texte: [
              "Avant toute recherche, on fait l'**inventaire** de l'image, zone par zone, en notant tout ce qui se lit ou se reconnaît :",
              {
                entetes: ["Famille", "Ce qu'on cherche"],
                lignes: [
                  ["Texte", "Enseignes, panneaux, affiches, numéros de téléphone, sites web, noms de rue, publicités sur les bus"],
                  ["Route", "Côté de circulation, marquages au sol, forme des panneaux, bornes, potelets"],
                  ["Bâti", "Matériaux (granit, brique, enduit ocre), toits (ardoise, tuiles), hauteur, style"],
                  ["Nature", "Relief, végétation, couleur de la terre, lumière"]
                ]
              },
              "Repères français utiles :",
              [
                "**Panneau d'entrée d'agglomération** : fond blanc, bord rouge, nom de la commune.",
                "**Bornes kilométriques** : sommet rouge sur une nationale, jaune sur une départementale.",
                "**Indicatifs téléphoniques** : `01` Île-de-France, `02` Nord-Ouest, `03` Nord-Est, `04` Sud-Est, `05` Sud-Ouest.",
                "**Bâti régional** : granit et ardoise en Bretagne, brique dans le Nord, façades ocre et tuiles rondes en Méditerranée."
              ]
            ],
            exemple: {
              titre: "Exemple d'inventaire",
              texte: "« Façades en granit gris, toits d'ardoise à lucarnes ; enseignes : une boulangerie, une bijouterie de chaîne ; drapeau breton à une fenêtre ; voitures garées à droite, circulation à droite. » → Bretagne, centre-ville ancien, à confirmer par les enseignes."
            }
          },
          {
            titre: "Faire parler le texte",
            texte: [
              "Le texte est l'indice le plus rentable : chaque mot lisible devient une **requête**.",
              [
                "Un **commerce local** au nom original : une recherche dans Google Maps suffit souvent.",
                "Une **chaîne** (Yves Rocher, Julien d'Orcel…) : un seul magasin ne dit rien, mais **deux chaînes voisines** n'ont souvent qu'une rue en commun.",
                "Un **nom de parking, d'arrêt de bus, de quartier** sur un panneau : il désigne une ville précise.",
                "Un **numéro de téléphone** ou un **site web** sur une vitrine ou un utilitaire."
              ],
              "Zoomez au maximum sur l'original : un mot à moitié lisible (« …ouédic ») se complète par une recherche avec joker."
            ],
            exemple: {
              titre: "Exemple",
              texte: "Deux enseignes lues sur une photo : « Pharmacie des Remparts » et « Crêperie du Jerzual ». La seconde n'existe qu'à un endroit : la rue du Jerzual, à Dinan. La première est bien dans la même ville : position confirmée par deux indices indépendants."
            }
          },
          {
            titre: "La recherche inversée",
            texte: [
              "On soumet l'image (ou un **recadrage**) à un moteur qui cherche des images semblables :",
              {
                entetes: ["Moteur", "Point fort"],
                lignes: [
                  ["Google Lens", "Monuments, objets, texte dans l'image"],
                  ["Yandex Images", "Bâtiments et lieux, très bon sur les façades"],
                  ["Bing Visual Search", "Seconde opinion, produits"],
                  ["TinEye", "Retrouver la même image exacte et sa date de première apparition"]
                ]
              },
              "Recadrez sur l'**élément unique** (une façade, un clocher, une enseigne) plutôt que sur toute la scène.",
              { attention: "Une photo **inédite** (prise par la personne, jamais publiée) ne sera jamais retrouvée telle quelle : la recherche inversée n'identifie alors que les éléments connus qu'elle contient. Sans élément connu, retour à l'inventaire." }
            ]
          },
          {
            titre: "Vérifier au sol",
            texte: [
              "Une hypothèse se **confirme** dans une vue au sol : Google **Street View**, **Panoramax** (photos libres) ou Mapillary.",
              [
                "Alignez **deux éléments fixes** (un angle de toit, un lampadaire, une fenêtre) : s'ils se superposent comme sur la photo, vous êtes au bon endroit et dans le bon axe.",
                "Les commerces changent : la **date** de la photo (EXIF, saison, véhicules) permet de choisir la bonne année dans l'historique de Street View (icône d'horloge).",
                "**Coordonnées** : clic droit sur le point dans Google Maps, la première ligne du menu donne `latitude, longitude` (un clic les copie)."
              ]
            ],
            exemple: {
              titre: "Exemple",
              texte: "Dans Street View, le lampadaire de la photo est à gauche de la troisième fenêtre ; on avance de deux clics jusqu'à ce qu'il soit pile devant : clic droit à cet endroit sur la carte → `47.21843, -1.55362`."
            }
          },
          {
            titre: "Requêtes géographiques (Overpass Turbo)",
            texte: [
              "Quand l'image combine plusieurs éléments banals, on demande à OpenStreetMap **tous les endroits** où ils se trouvent ensemble. **Overpass Turbo** (overpass-turbo.eu) exécute ces requêtes et affiche les résultats sur une carte.",
              { code: "[out:json][timeout:60];\narea[\"name\"=\"Finistère\"]->.zone;\nnode[\"amenity\"=\"pharmacy\"](area.zone)->.pharmacies;\nnwr[\"amenity\"=\"place_of_worship\"](around.pharmacies:50);\nout center;", legende: "Lieux de culte à moins de 50 m d'une pharmacie, dans le Finistère" },
              "On remplace les étiquettes par ce qu'on voit : `shop=bakery`, `name~\"Julien d'Orcel\"`, `highway=bus_stop`… L'assistant d'Overpass Turbo traduit aussi une phrase simple en requête."
            ]
          }
        ],
        challenges: [
          {
            niveau: 1,
            titre: "Suivez les panneaux",
            enonce: "Photo prise sur une place de stationnement, en été.",
            pieces: [{ image: "assets/osint/geo-1.jpg", nom: "geo-1.jpg" }],
            question: "Dans quelle ville a-t-elle été prise ?",
            champs: [{ libelle: "Ville", reponse: "Saint-Brieuc" }],
            indices: [
              "Lisez les panneaux à gauche : ce ne sont pas des directions de villes, mais des **parkings** avec leurs places libres.",
              "Cherchez « Gouédic » ou « Charner » sur une carte."
            ],
            solution: [
              "Les panneaux de guidage indiquent les parkings **Gare - Charner**, **Gouédic** et **(Les) Champs** : trois noms de parkings de **Saint-Brieuc** (Côtes-d'Armor). Le bâtiment de brique et pierre derrière les arbres est la gare ; à droite, une passerelle en chantier enjambe les voies.",
              "Photo : StephaneP / Panoramax, CC BY-SA 4.0."
            ]
          },
          {
            niveau: 2,
            titre: "Une rue au pied des montagnes",
            enonce: "Un matin de septembre, un cycliste devant soi.",
            pieces: [{ image: "assets/osint/geo-2.jpg", nom: "geo-2.jpg" }],
            question: "Dans quelle ville, et dans quelle rue ?",
            champs: [
              { libelle: "Ville", reponse: "Annecy" },
              { libelle: "Rue", reponse: "rue de la Gare", accepte: ["de la Gare"] }
            ],
            indices: [
              "Deux noms se lisent : « Les Cordeliers » sur la façade de gauche, « Le Bouillon » au-dessus de la vitrine de droite.",
              "« Le Bouillon » est un nom de restaurant très courant : croisez-le avec le relief boisé au fond de la rue, qui exclut la plupart des grandes villes.",
              "Cherchez « Le Bouillon » dans Google Maps autour des villes des Alpes, puis vérifiez la façade dans Street View."
            ],
            solution: [
              "Le restaurant **Le Bouillon** se trouve au 9, **rue de la Gare** à **Annecy** (Haute-Savoie) ; les immeubles à balcons, le parking à gauche et la montagne au fond (le Semnoz, côté sud) correspondent dans la vue au sol ; le photographe regarde vers le sud-est, vers les reliefs boisés qui dominent la ville.",
              "Photo : Blueberry / Panoramax, CC BY-SA 4.0."
            ]
          },
          {
            niveau: 3,
            titre: "Le point exact",
            enonce: "Une rue commerçante, un soir de juillet.",
            pieces: [{ image: "assets/osint/geo-3.jpg", nom: "geo-3.jpg" }],
            question: "Dans quelle ville, et d'où exactement la photo a-t-elle été prise (à 150 m près) ?",
            champs: [
              { libelle: "Ville", reponse: "Dinan" },
              { libelle: "Position du photographe (latitude, longitude)", gps: [48.453873, -2.046198], rayon: 0.15 }
            ],
            indices: [
              "Granit gris, toits d'ardoise à lucarnes, balcons en fer forgé : un centre ancien de Bretagne.",
              "« Julien d'Orcel » et « Ambiance & Styles » sont des chaînes : cherchez une rue où elles sont **voisines**, avec un « Maître Boulanger » en face.",
              "Une des villes candidates a deux magasins Julien d'Orcel : l'un dans une zone commerciale, l'autre en centre ancien. Placez-vous dans la rue du second avec Street View et alignez les façades."
            ],
            solution: [
              "Les deux chaînes voisines désignent la **rue du Marchix**, dans la ville close de **Dinan** (Côtes-d'Armor) ; l'autre Julien d'Orcel de Dinan est en zone commerciale, à Léhon. Le photographe est au débouché de la place du Marchix, vers `48.45387, -2.04620`, et regarde vers l'ouest-nord-ouest.",
              "Photo : PanierAvide / Panoramax, CC BY-SA 4.0."
            ]
          },
          {
            niveau: 4,
            titre: "Un boulevard sans nom",
            enonce: "Ni enseigne lisible, ni panneau : un grand boulevard au petit matin, en avril.",
            pieces: [{ image: "assets/osint/geo-4.jpg", nom: "geo-4.jpg" }],
            question: "Dans quelle ville, et sur quel boulevard ?",
            champs: [
              { libelle: "Ville", reponse: "Lille" },
              { libelle: "Boulevard", reponse: "boulevard de la Liberté", accepte: ["de la Liberté", "bd de la Liberté"] }
            ],
            indices: [
              "Zoomez sur le bus articulé à gauche : le toit annonce « Je roule au… », et la publicité sur son flanc vient d'une « Métropole européenne de… ».",
              "La livrée grise à bandeau rouge appartient au réseau de transport de cette métropole ; la maison de brique et de pierre au fond confirme le Nord.",
              "Cherchez dans cette ville un boulevard bordé d'une double rangée de platanes, avec un couloir de bus au centre, puis comparez dans Street View."
            ],
            solution: [
              "La publicité du bus vient de la **Métropole européenne de Lille**, et la livrée grise et rouge est celle du réseau Ilévia (bus roulant au gaz naturel). Le large boulevard planté de platanes, avec son couloir de bus central et ses hôtels particuliers de brique, est le **boulevard de la Liberté**, à **Lille**.",
              "Photo : Métropole européenne de Lille / Panoramax, Licence Ouverte 2.0."
            ]
          }
        ]
      },

      /* ---------------------------------------------------------
         Enquête 3 — Plaques d'immatriculation
         --------------------------------------------------------- */
      {
        type: "enquete",
        id: "osint-enquete-plaques",
        titre: "Enquête 3 — Une plaque, un véhicule",
        description: "Lire une plaque française ou européenne, et savoir qui peut connaître l'assureur.",
        methodes: [
          {
            titre: "Lire une plaque française",
            texte: [
              {
                entetes: ["Système", "Format", "Ce qu'il révèle"],
                lignes: [
                  ["FNI (1950 – 2009)", "`1234 AB 56`", "Les derniers chiffres (ou `2A`, `2B`, `971`…) = **département d'immatriculation**, qui changeait à chaque déménagement"],
                  ["SIV (depuis 2009)", "`AB-123-CD`", "Numéro **attribué à vie** au véhicule, dans l'**ordre chronologique national** : il donne une période de première immatriculation en France, pas un lieu"],
                  ["Identifiant territorial SIV", "Logo de région + numéro à droite", "**Choisi librement** par le titulaire : il ne prouve pas son domicile"],
                  ["Plaques spéciales", "`W-123-AB` (garage), `WW-123-AB` (provisoire)", "Véhicule de professionnel ou en attente d'immatriculation définitive"]
                ]
              }
            ],
            exemple: {
              titre: "Exemple",
              texte: [
                { plaques: [{ format: "fni", texte: "7351 KL 35" }, { format: "siv", texte: "FB-214-QT", region: "13" }] },
                "La première a été immatriculée en **Ille-et-Vilaine (35)**. La seconde ne dit rien du domicile : le titulaire a choisi d'afficher les Bouches-du-Rhône."
              ]
            }
          },
          {
            titre: "Les plaques européennes",
            texte: [
              "La **bande bleue** porte le code du pays (`F`, `D`, `I`, `E`, `B`, `NL`, `PL`, `A`…). Plusieurs pays codent ensuite le **lieu d'immatriculation** :",
              {
                entetes: ["Pays", "Lecture", "Exemples"],
                lignes: [
                  ["Allemagne (`D`)", "1 à 3 lettres = district", "`B` Berlin, `M` Munich, `HH` Hambourg, `K` Cologne, `F` Francfort"],
                  ["Autriche (`A`)", "1 ou 2 lettres = district", "`W` Vienne, `G` Graz, `L` Linz, `S` Salzbourg, `I` Innsbruck"],
                  ["Pologne (`PL`)", "1re lettre = voïvodie, la suite = district", "`WA`… Varsovie, `KR` Cracovie, `PO` Poznań, `GD` Gdańsk"],
                  ["Suisse", "2 lettres = canton (pas de bande UE)", "`GE` Genève, `VD` Vaud, `VS` Valais, `ZH` Zurich"],
                  ["Royaume-Uni", "2 lettres de région + 2 chiffres d'âge ; plaque **arrière jaune**", "`L…` Londres, `M…` Manchester ; `24` = mars à août 2024, `74` = septembre 2024 à février 2025"],
                  ["Italie, Espagne", "Numérotation nationale", "Aucun lieu dans le numéro"]
                ]
              }
            ]
          },
          {
            titre: "Du numéro au véhicule",
            texte: [
              [
                "Les **sites de pièces détachées** demandent la plaque pour trouver les bonnes pièces : ils affichent **marque, modèle, motorisation, date de mise en circulation**. Aucune identité n'en sort.",
                "**HistoVec** (service public) donne l'historique d'un véhicule, mais seulement à partir d'un rapport que le vendeur choisit de partager.",
                "Les photos de rue publiées (Street View, Panoramax) **floutent** les plaques."
              ],
              "Comparer le modèle annoncé par la plaque et le véhicule photographié révèle les **doublettes** : une fausse plaque recopiée sur une voiture du même modèle."
            ]
          },
          {
            titre: "Et l'assureur ?",
            texte: [
              "Depuis le 1er janvier 2019, le **Fichier des véhicules assurés (FVA)** recense, pour chaque véhicule, l'**assureur** qui couvre sa responsabilité civile et le **numéro de contrat**. Il est constitué par l'**AGIRA** (Association pour la gestion des informations sur le risque en assurance) et alimenté par les assureurs.",
              "Peuvent le consulter :",
              [
                "les **forces de l'ordre**, lors des contrôles routiers ;",
                "le **FGAO** (Fonds de garantie des assurances obligatoires de dommages), pour indemniser les victimes quand l'auteur est **inconnu ou non assuré**."
              ],
              { attention: "Un particulier ne peut **pas** interroger le FVA à partir d'une plaque. Après un accident, l'assureur figure sur le constat amiable ; en cas de délit de fuite, on porte plainte avec la plaque relevée, et le FGAO prend le relais. Une plaque est une **donnée personnelle** au sens de la CNIL." }
            ]
          }
        ],
        challenges: [
          {
            niveau: 1,
            titre: "Le vieux format",
            enonce: "Trois véhicules anciens photographiés dans un rassemblement.",
            pieces: [{ plaques: [{ format: "fni", texte: "5419 RT 29" }, { format: "fni", texte: "812 BZE 69" }, { format: "fni", texte: "4207 WA 2A", noire: true }] }],
            question: "Dans quel département chacun a-t-il été immatriculé ?",
            champs: [
              { libelle: "`5419 RT 29`", reponse: "Finistère", accepte: ["29"] },
              { libelle: "`812 BZE 69`", reponse: "Rhône", accepte: ["69"] },
              { libelle: "`4207 WA 2A`", reponse: "Corse-du-Sud", accepte: ["2A"] }
            ],
            indices: ["Au format FNI, seuls les derniers caractères comptent."],
            solution: "`29` = **Finistère**, `69` = **Rhône**, `2A` = **Corse-du-Sud** (la Corse est divisée en `2A` et `2B` depuis 1976). Les plaques noires à caractères blancs sont réservées aux véhicules de collection."
          },
          {
            niveau: 1,
            type: "qcm",
            titre: "Le logo de droite",
            enonce: "Une voiture récente est garée devant le domicile d'une personne recherchée.",
            pieces: [{ plaques: [{ format: "siv", texte: "GH-482-PK", region: "56" }] }],
            question: "Que vous apprend le « 56 » à droite de la plaque ?",
            choix: [
              "Rien de certain : le titulaire choisit librement le département affiché",
              "Le titulaire habite le Morbihan",
              "Le véhicule a été vendu par un garage du Morbihan",
              "Le véhicule a été immatriculé pour la première fois dans le Morbihan"
            ],
            reponse: 0,
            solution: "Avec le SIV, l'identifiant territorial est un **choix** du titulaire, qui peut afficher n'importe quel département, y compris celui de ses origines. Seul le numéro `GH-482-PK` est attaché au véhicule."
          },
          {
            niveau: 2,
            titre: "Plaques d'Europe",
            enonce: "Cinq véhicules étrangers relevés sur le parking d'un salon professionnel.",
            pieces: [{
              plaques: [
                { format: "eu", pays: "D", texte: "HH AB 1234" },
                { format: "eu", pays: "A", texte: "W 31652 K" },
                { format: "eu", pays: "PL", texte: "KR 4H721" },
                { format: "ch", texte: "VS 123456" },
                { format: "uk", texte: "LB24 XKD" }
              ]
            }],
            champs: [
              { libelle: "Allemagne : ville", reponse: "Hambourg", accepte: ["Hamburg"] },
              { libelle: "Autriche : ville", reponse: "Vienne", accepte: ["Wien"] },
              { libelle: "Pologne : ville", reponse: "Cracovie", accepte: ["Kraków", "Krakow"] },
              { libelle: "Suisse : canton", reponse: "Valais", accepte: ["Wallis", "VS"] },
              { libelle: "Royaume-Uni : année d'immatriculation", reponse: 2024, tolerance: 0 },
              { libelle: "Royaume-Uni : ville de la région d'immatriculation", reponse: "Londres", accepte: ["London"] }
            ],
            indices: [
              "Pour l'Allemagne, `HH` se lit « Hansestadt Hamburg ».",
              "Pour le Royaume-Uni, la 1re lettre donne la région, les deux chiffres suivants la période."
            ],
            solution: [
              [
                "`HH` = **Hambourg** (ville hanséatique).",
                "`W` = **Vienne** (Wien).",
                "`KR` = **Cracovie** (ville de Kraków, voïvodie de Petite-Pologne).",
                "`VS` = canton du **Valais**, avec l'écusson suisse.",
                "`LB24` : `L` = région de **Londres**, `24` = immatriculé entre mars et août **2024** ; le jaune indique une plaque arrière."
              ]
            ]
          },
          {
            niveau: 2,
            titre: "Délit de fuite",
            enonce: [
              "Un véhicule a heurté le vôtre sur un parking puis est reparti. Vous avez relevé sa plaque. Vous voulez savoir qui l'assure."
            ],
            champs: [
              { libelle: "Le fichier qui associe chaque véhicule à son assureur (sigle)", reponse: "FVA", accepte: ["Fichier des véhicules assurés"] },
              { libelle: "L'organisme qui le constitue (sigle)", reponse: "AGIRA" },
              { libelle: "L'organisme qui peut l'interroger pour indemniser la victime si l'auteur reste inconnu ou non assuré (sigle)", reponse: "FGAO", accepte: ["Fonds de garantie des assurances obligatoires de dommages", "Fonds de garantie"] }
            ],
            indices: ["Relisez la méthode « Et l'assureur ? »."],
            solution: [
              "Le **FVA**, constitué par l'**AGIRA** depuis 2019, donne l'assureur et le numéro de contrat de chaque véhicule. Vous ne pouvez pas l'interroger vous-même : vous portez plainte avec la plaque, les forces de l'ordre peuvent consulter le fichier, et si l'auteur n'est pas identifié ou pas assuré, le **FGAO** vous indemnise."
            ]
          }
        ]
      }

    ]
  };

  /* =========================================================
     CHAPITRE 3 — Enquêtes sur traces numériques
     ========================================================= */

  const ch3 = {
    id: "ch3",
    titre: "Chapitre 3 — Enquêtes sur traces numériques",
    description: "Remonter un courriel, faire parler un nom de domaine, puis une enquête complète.",
    exercices: [

      /* ---------------------------------------------------------
         Enquête 4 — Courriels
         --------------------------------------------------------- */
      {
        type: "enquete",
        id: "osint-enquete-courriels",
        titre: "Enquête 4 — Remonter un courriel",
        description: "Expéditeur réel, chemin des serveurs, adresse IP d'origine, fuseau horaire, pivot sur l'IP.",
        methodes: [
          {
            titre: "Afficher les en-têtes",
            texte: [
              "Le corps d'un courriel se falsifie à volonté ; les **en-têtes** ajoutés par chaque serveur traversé, beaucoup moins.",
              {
                entetes: ["Client", "Chemin"],
                lignes: [
                  ["Gmail", "⋮ > Afficher l'original"],
                  ["Outlook", "Fichier > Propriétés > En-têtes Internet"],
                  ["Thunderbird", "Ctrl + U"],
                  ["Fichier `.eml`", "S'ouvre dans n'importe quel éditeur de texte"]
                ]
              },
              "Les analyseurs en ligne (Google Admin Toolbox « Messageheader », MXToolbox « Email Header Analyzer ») remettent les sauts dans l'ordre et calculent les délais."
            ]
          },
          {
            titre: "Qui écrit vraiment ?",
            texte: [
              {
                entetes: ["En-tête", "Ce qu'il dit", "Fiabilité"],
                lignes: [
                  ["`From`", "L'expéditeur affiché", "Écrit par l'expéditeur : falsifiable"],
                  ["`Return-Path`", "L'adresse d'**enveloppe**, où reviennent les erreurs", "Celle que vérifie SPF"],
                  ["`Reply-To`", "Où partira **votre réponse**", "Souvent l'adresse réelle de l'escroc"],
                  ["`Message-ID`", "Identifiant créé par le **logiciel ou le serveur d'origine**", "Son domaine trahit le vrai service"],
                  ["`User-Agent` / `X-Mailer`", "Le logiciel de messagerie", "Indice sur le poste"]
                ]
              },
              "Un `From` de « La Poste » avec un `Return-Path` et un `Reply-To` sur deux autres domaines : le message n'a rien à voir avec La Poste."
            ]
          },
          {
            titre: "Lire les Received de bas en haut",
            texte: [
              "Chaque serveur traversé **ajoute** une ligne `Received` **en haut** du message. On les lit donc **de bas en haut** : la plus basse est la plus proche de l'expéditeur.",
              { code: "Received: from relais.fai.example ([192.0.2.10])          <- 2e saut\n        by mx.destinataire.example; Mon, 7 Oct 2024 10:00:05 +0200\nReceived: from PC-COMPTA ([10.0.0.12]) (unknown [198.51.100.7])  <- 1er saut\n        by relais.fai.example; Mon, 7 Oct 2024 08:00:03 +0000", legende: "Deux sauts" },
              [
                "`from PC-COMPTA` : le **nom de machine** annoncé par l'expéditeur (HELO).",
                "Les adresses `10.x`, `172.16-31.x`, `192.168.x` sont **privées** : elles ne sortent pas du réseau local.",
                "La première adresse **publique** (`198.51.100.7`) est celle de la connexion de l'expéditeur, sauf si son fournisseur la masque (Gmail le fait)."
              ]
            ]
          },
          {
            titre: "Authentification et horodatage",
            texte: [
              "`Authentication-Results` résume les contrôles du serveur destinataire :",
              [
                "`spf=pass` : le serveur d'envoi est autorisé par le domaine du `Return-Path` ;",
                "`dkim=pass header.d=…` : le message est signé par ce domaine et n'a pas été modifié ;",
                "`dmarc=fail` : le domaine du `From` n'est **pas aligné** avec ceux validés par SPF ou DKIM — l'affichage ment."
              ],
              "L'en-tête `Date` porte le **décalage horaire** de l'expéditeur : `+0200` = heure d'été française, `-0400` = côte Est américaine en été. Heure UTC = heure affichée **moins** le décalage.",
              { attention: "Trois « pass » sur un message envoyé depuis un Gmail gratuit prouvent seulement que **Gmail** l'a envoyé." }
            ],
            exemple: {
              titre: "Exemple",
              texte: "`Date: Mon, 7 Oct 2024 10:03:00 -0400` → 10 h 03 + 4 h = **14 h 03 UTC**, soit 16 h 03 à Paris. Un fournisseur « parisien » qui écrit à l'heure de New York mérite une question."
            }
          },
          {
            titre: "Pivoter sur une adresse IP",
            texte: [
              "Une adresse IP publique appartient à un bloc attribué par un **registre régional** (RIR) : **RIPE NCC** (Europe, Moyen-Orient), **ARIN** (Amérique du Nord), **APNIC** (Asie-Pacifique), LACNIC, AFRINIC.",
              { code: "whois 192.0.2.10\ncurl https://rdap.org/ip/192.0.2.10", legende: "Interroger le registre" },
              "On en tire l'**organisation** titulaire, le pays, le numéro de système autonome (AS). Une IP de Google ou Microsoft désigne le **service** utilisé, pas une personne ; une IP de fournisseur d'accès désigne un abonné, que seule la justice peut faire identifier.",
              "Sur l'**adresse de courriel** elle-même : Have I Been Pwned (fuites), recherche du pseudonyme sur d'autres services (WhatsMyName)."
            ]
          }
        ],
        challenges: [
          {
            niveau: 1,
            titre: "Votre colis est bloqué",
            enonce: "Camille a reçu ce message ce matin. Avant de cliquer, elle vous transmet le fichier.",
            pieces: [{
              nom: "colis.eml",
              texte: [
                "Return-Path: <rebond-71842@envoi-massif.example>",
                "Received: from mta3.envoi-massif.example (mta3.envoi-massif.example [192.0.2.41])",
                "        by mx1.messagerie.example with ESMTPS id 4F9kQ2",
                "        for <camille.martin@messagerie.example>; Tue, 8 Oct 2024 07:58:12 +0200 (CEST)",
                "Authentication-Results: mx1.messagerie.example;",
                "        spf=pass (domain of envoi-massif.example designates 192.0.2.41 as permitted sender) smtp.mailfrom=envoi-massif.example;",
                "        dkim=pass header.d=envoi-massif.example;",
                "        dmarc=fail (p=NONE) header.from=laposte-suivi.example",
                "From: \"La Poste - Colissimo\" <ne-pas-repondre@laposte-suivi.example>",
                "Reply-To: service-client@relance-colis.example",
                "To: camille.martin@messagerie.example",
                "Subject: Votre colis n°6A0428817 est en attente : frais de 1,99 EUR",
                "Date: Tue, 8 Oct 2024 07:58:09 +0200",
                "Message-ID: <20241008055809.7f3a@envoi-massif.example>",
                "MIME-Version: 1.0",
                "Content-Type: text/plain; charset=utf-8",
                "",
                "Bonjour,",
                "",
                "Votre colis n'a pas pu être livré : des frais de réexpédition de 1,99 EUR",
                "restent à régler sous 24 heures. Sans paiement, il sera retourné.",
                "",
                "Régler maintenant : https://relance-colis.example/paiement?id=6A0428817",
                "",
                "Le service client"
              ].join("\n")
            }],
            champs: [
              { libelle: "Domaine qui a réellement envoyé le message", reponse: "envoi-massif.example" },
              { libelle: "Domaine où partirait la réponse de Camille", reponse: "relance-colis.example" },
              { libelle: "Résultat du contrôle DMARC", reponse: "fail", accepte: ["échec", "echec"] }
            ],
            indices: [
              "Comparez `From`, `Return-Path`, `Reply-To` et le domaine du `Message-ID`.",
              "Le contrôle DMARC est dans `Authentication-Results`."
            ],
            solution: [
              "Le message est parti des serveurs d'**envoi-massif.example** (`Return-Path`, `Received`, `Message-ID`, signature DKIM) ; une réponse partirait vers **relance-colis.example**, le même domaine que le lien de paiement. Le `From` « La Poste » n'est validé par rien : **DMARC échoue** (`fail`).",
              "SPF et DKIM sont pourtant « pass » : ils valident **envoi-massif.example**, pas La Poste."
            ]
          },
          {
            niveau: 2,
            titre: "Le fournisseur pressé",
            enonce: "Un « fournisseur parisien » réclame un paiement urgent. Le service comptable veut savoir d'où il écrit vraiment.",
            pieces: [{
              nom: "fournisseur.eml",
              texte: [
                "Return-Path: <facturation@atelier-kerne.example>",
                "Received: from smtp.webmail-express.example (smtp.webmail-express.example [203.0.113.200])",
                "        by mx.aqualenn.example (Postfix) with ESMTPS id 51C0E",
                "        for <compta@aqualenn.example>; Mon, 14 Oct 2024 16:03:49 +0200 (CEST)",
                "Received: from filter-03.webmail-express.example (localhost [127.0.0.1])",
                "        by smtp.webmail-express.example (Postfix) with ESMTP id 9A7F3",
                "        for <compta@aqualenn.example>; Mon, 14 Oct 2024 14:03:48 +0000 (UTC)",
                "Received: from [10.12.0.7] (unknown [198.51.100.83])",
                "        (Authenticated sender: facturation@atelier-kerne.example)",
                "        by filter-03.webmail-express.example (Postfix) with ESMTPSA id 91B2C",
                "        for <compta@aqualenn.example>; Mon, 14 Oct 2024 14:03:47 +0000 (UTC)",
                "Authentication-Results: mx.aqualenn.example; spf=pass smtp.mailfrom=atelier-kerne.example;",
                "        dkim=pass header.d=atelier-kerne.example; dmarc=pass header.from=atelier-kerne.example",
                "From: \"Atelier Kerné - Facturation\" <facturation@atelier-kerne.example>",
                "To: compta@aqualenn.example",
                "Subject: RE: Facture F-2024-0917 - relance avant pénalités",
                "Date: Mon, 14 Oct 2024 10:03:45 -0400",
                "Message-ID: <8c1f2e@atelier-kerne.example>",
                "User-Agent: Roundcube Webmail/1.6.6",
                "",
                "Bonjour,",
                "Suite au changement de notre banque, merci d'effectuer le règlement",
                "de la facture F-2024-0917 sur le nouveau RIB ci-joint, avant ce soir.",
                "Cordialement, le service facturation (Paris 11e)"
              ].join("\n")
            }],
            champs: [
              { libelle: "Adresse IP publique de l'expéditeur", reponse: "198.51.100.83" },
              { libelle: "Décalage de son horloge par rapport à UTC, en heures (ex. +2)", reponse: -4, tolerance: 0 },
              { libelle: "Heure d'envoi en UTC (hh:mm)", reponse: "14:03", accepte: ["14h03", "14 h 03"] }
            ],
            indices: [
              "Lisez les `Received` de bas en haut et écartez les adresses privées (`10.x`) et locales (`127.0.0.1`).",
              "Le décalage est à la fin de l'en-tête `Date`."
            ],
            solution: [
              "Le saut le plus bas montre le poste de l'expéditeur : adresse privée `10.12.0.7` derrière l'adresse publique **198.51.100.83**. Son horloge est réglée sur **UTC−4** (`-0400`), soit l'heure d'été de la côte Est américaine ou du Québec : 10 h 03 locales = **14 h 03 UTC** = 16 h 03 à Paris, ce que confirment les `Received`.",
              "Ici, SPF, DKIM et DMARC passent : le compte du vrai fournisseur a probablement été **piraté**. C'est le changement de RIB, l'urgence et le fuseau horaire qui doivent alerter — on rappelle le fournisseur à un numéro connu, jamais à celui du courriel."
            ]
          },
          {
            niveau: 3,
            titre: "La directrice financière sur Gmail",
            enonce: "La comptabilité d'Aqualenn reçoit un ordre de virement de la « Direction financière ». Tous les contrôles d'authentification sont au vert.",
            pieces: [{
              nom: "virement.eml",
              texte: [
                "Return-Path: <aqualenn.direction.financiere@gmail.com>",
                "Received: from mail-wr1-f54.google.com (mail-wr1-f54.google.com [209.85.221.54])",
                "        by mx.aqualenn.example (Postfix) with ESMTPS id 3C1F0",
                "        for <compta@aqualenn.example>; Thu, 17 Oct 2024 09:41:27 +0200 (CEST)",
                "Received: by mail-wr1-f54.google.com with SMTP id ffacd0b85a97d-37d4c1b1a2eso1180344f8f.3",
                "        for <compta@aqualenn.example>; Thu, 17 Oct 2024 00:41:26 -0700 (PDT)",
                "DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20230601;",
                "        h=to:subject:message-id:date:from:mime-version; bh=1cY0...; b=Hq7e...",
                "Authentication-Results: mx.aqualenn.example; spf=pass smtp.mailfrom=gmail.com;",
                "        dkim=pass header.d=gmail.com; dmarc=pass header.from=gmail.com",
                "From: \"Aqualenn - Direction financière\" <aqualenn.direction.financiere@gmail.com>",
                "To: compta@aqualenn.example",
                "Subject: Virement confidentiel - acquisition en cours",
                "Date: Thu, 17 Oct 2024 09:41:13 +0200",
                "Message-ID: <CAJ8x2Q=Xk1mP0f9a@mail.gmail.com>",
                "",
                "Bonjour,",
                "Dans le cadre d'une acquisition confidentielle, merci de préparer un virement",
                "de 48 600 EUR. Ne pas en parler en interne avant l'annonce officielle.",
                "Je suis en réunion, répondez uniquement par courriel."
              ].join("\n")
            }],
            champs: [
              { libelle: "Organisation titulaire de l'adresse IP du dernier serveur d'envoi", reponse: "Google", accepte: ["Google LLC"] },
              { libelle: "Registre régional (RIR) qui a attribué ce bloc d'adresses", reponse: "ARIN" },
              { libelle: "Service de messagerie utilisé par l'escroc", reponse: "Gmail", accepte: ["Google Mail"] }
            ],
            indices: [
              "Interrogez le registre sur `209.85.221.54` : `whois 209.85.221.54` ou https://rdap.org/ip/209.85.221.54.",
              "Le domaine du `Message-ID` et la signature DKIM disent la même chose."
            ],
            solution: [
              { code: "$ whois 209.85.221.54\nNetRange:   209.85.128.0 - 209.85.255.255\nNetName:    GOOGLE\nOrganization: Google LLC (GOGL)\n... (registre : ARIN)" },
              "L'IP appartient à **Google LLC**, bloc attribué par l'**ARIN** : c'est un serveur d'envoi de **Gmail** (`mail-wr1-…google.com`, `Message-ID` en `@mail.gmail.com`, DKIM `d=gmail.com`). Les trois « pass » prouvent seulement que Gmail a bien envoyé le message d'un compte gratuit dont le nom imite l'entreprise : c'est une **fraude au président**. L'adresse IP de l'escroc, elle, est masquée par Gmail."
            ]
          }
        ]
      },

      /* ---------------------------------------------------------
         Enquête 5 — Domaines et sites web
         --------------------------------------------------------- */
      {
        type: "enquete",
        id: "osint-enquete-domaines",
        titre: "Enquête 5 — Un domaine, un site",
        description: "WHOIS et RDAP, DNS, certificats, Wayback Machine et code source, sur un vrai domaine.",
        methodes: [
          {
            titre: "WHOIS et RDAP",
            texte: [
              "Le registre d'un domaine en donne l'**état civil** : bureau d'enregistrement (registrar), dates de **création** et d'expiration, statut, **titulaire** (masqué pour un particulier depuis le RGPD, visible pour une organisation), serveurs de noms.",
              {
                entetes: ["Moyen", "Exemple"],
                lignes: [
                  ["Ligne de commande", "`whois exemple.fr`"],
                  ["RDAP (le successeur du WHOIS, en JSON)", "`https://rdap.nic.fr/domain/exemple.fr` pour un .fr, `https://lookup.icann.org` pour les autres"],
                  ["Recherche web", "Le whois de l'Afnic (afnic.fr) pour les .fr"]
                ]
              },
              { remarque: "RDAP donne les dates en UTC : un domaine créé le 6 septembre à 0 h à Paris apparaît le 5 septembre à 22 h." }
            ]
          },
          {
            titre: "Le DNS raconte l'infrastructure",
            texte: [
              {
                entetes: ["Enregistrement", "Ce qu'il révèle"],
                lignes: [
                  ["`A` / `AAAA`", "L'hébergeur du site (à pivoter avec un whois de l'IP)"],
                  ["`MX`", "La messagerie : Google Workspace, Microsoft 365, serveur maison"],
                  ["`TXT`", "Politique SPF (tous les services autorisés à envoyer en son nom) et jetons de vérification (`google-site-verification`, `MS=`…) : la liste des outils SaaS utilisés"],
                  ["`NS`", "Le gestionnaire DNS (Cloudflare, OVH…)"]
                ]
              },
              { code: "dig exemple.fr MX +short\ndig exemple.fr TXT +short\nnslookup -type=NS exemple.fr", legende: "Interroger le DNS" }
            ]
          },
          {
            titre: "Les certificats trahissent les sous-domaines",
            texte: [
              "Chaque certificat TLS émis est inscrit dans des journaux publics (**Certificate Transparency**). **crt.sh** les interroge : tous les sous-domaines qui ont eu un certificat apparaissent, y compris des serveurs de test ou d'administration oubliés.",
              { code: "https://crt.sh/?q=%25.exemple.fr", legende: "Tous les certificats des sous-domaines (%25 = joker %)" }
            ]
          },
          {
            titre: "Remonter le temps : la Wayback Machine",
            texte: [
              "**web.archive.org** archive le web depuis 1996. Un domaine tapé dans la barre affiche un **calendrier** des captures.",
              [
                "`web.archive.org/web/2005/https://exemple.fr` : la capture la plus proche de 2005.",
                "`web.archive.org/cdx/search/cdx?url=exemple.fr&limit=5` : la **liste brute** des plus anciennes captures, avec leur horodatage `AAAAMMJJhhmmss`.",
                "Ajouter `id_` après l'horodatage (`/web/19980214181349id_/…`) donne la page **telle qu'archivée**, sans le bandeau de l'Archive."
              ],
              "On y retrouve d'anciens organigrammes, des adresses de courriel, des pages retirées depuis."
            ]
          },
          {
            titre: "Lire le code source",
            texte: [
              "`Ctrl + U` affiche le code d'une page. On y cherche :",
              [
                "les **commentaires** HTML oubliés (`<!-- … -->`) ;",
                "les balises `<meta>` (auteur, générateur, description) ;",
                "le texte des **scripts** (messages, chemins, adresses d'API) ;",
                "les **identifiants d'analytics** (`UA-…`, `G-…`) : le même identifiant sur deux sites désigne le même propriétaire ;",
                "les fichiers `robots.txt` et `sitemap.xml`, qui listent ce que le site voudrait cacher aux moteurs."
              ]
            ]
          }
        ],
        challenges: [
          {
            niveau: 1,
            titre: "L'acte de naissance d'un domaine",
            enonce: "Cible : le domaine de votre école, `epita.fr`.",
            question: "En quelle année a-t-il été enregistré, et quelle organisation en est titulaire ?",
            champs: [
              { libelle: "Année d'enregistrement", reponse: 1995, tolerance: 0 },
              { libelle: "Organisation titulaire (premier mot suffit)", reponse: "IONIS", accepte: ["IONIS Group", "Groupe IONIS", "IONIS GROUP - IONIS SCHOOLS OF TECHNOLOGY AND MANAGEMENT"] }
            ],
            indices: [
              "Un `.fr` : interrogez l'Afnic, ou ouvrez https://rdap.nic.fr/domain/epita.fr.",
              "Dans la réponse RDAP, cherchez l'événement `registration` et l'entité au rôle `registrant`."
            ],
            solution: [
              { code: "\"eventAction\": \"registration\", \"eventDate\": \"1995-09-05T22:00:00Z\"\n\"roles\": [\"registrant\"] ... \"IONIS GROUP - IONIS SCHOOLS OF TECHNOLOGY AND MANAGEMENT\"" },
              "Domaine créé en **1995** (le 6 septembre, heure de Paris), titulaire **IONIS Group**, la maison mère de l'école. Une organisation n'est pas protégée par le masquage RGPD : son nom apparaît en clair."
            ]
          },
          {
            niveau: 2,
            titre: "La plus vieille capture",
            enonce: "Toujours `epita.fr`.",
            question: "De quand date la plus ancienne capture du site dans la Wayback Machine, et quel était le titre de la page ?",
            champs: [
              { libelle: "Date de la capture (JJ/MM/AAAA)", reponse: "14/02/1998", accepte: ["1998-02-14", "14 février 1998", "14-02-1998"] },
              { libelle: "Titre de la page (balise `<title>`)", reponse: "EPITA - Accueil", accepte: ["EPITA Accueil"] }
            ],
            indices: [
              "Le calendrier de web.archive.org démarre à la première année archivée ; la requête `cdx` donne directement la plus ancienne.",
              "Le titre est celui de l'onglet, ou la balise `<title>` dans le code source de la capture."
            ],
            solution: [
              { code: "https://web.archive.org/cdx/search/cdx?url=epita.fr&limit=1\nfr,epita)/ 19980214181349 http://www.epita.fr:80/ text/html 200 ..." },
              "Première capture le **14 février 1998** à 18 h 13 (UTC). Le code de la page commence par `<TITLE>EPITA - Accueil</TITLE>`."
            ]
          },
          {
            niveau: 3,
            titre: "Ce que cache le code source",
            enonce: "Sur cette capture de 1998, un message défilait dans la barre d'état du navigateur au survol des boutons. Il n'apparaît nulle part dans la page affichée.",
            question: "Quelle date de journée portes ouvertes annonçait-il ?",
            champs: [
              { libelle: "Date (jour et mois)", reponse: "samedi 7 mars", accepte: ["7 mars", "07 mars", "samedi 07 mars", "7 mars 1998", "07/03/1998", "07/03", "7/03"] }
            ],
            indices: [
              "Ouvrez la capture sans le bandeau de l'Archive : ajoutez `id_` après l'horodatage dans l'URL, puis `Ctrl + U`.",
              "Le message est dans le JavaScript en tête de page, dans un tableau `msgs`."
            ],
            solution: [
              { code: "msgs[4] = \"Prochaines journées portes ouvertes : Samedi 07 Mars. Ouvert de 10h à 17h.    --     \"" },
              "Le script de la page d'accueil remplissait un tableau de messages affichés dans la barre d'état (`window.status`) : la journée portes ouvertes du **samedi 7 mars 1998**. Le même code source contient aussi, dans une balise `<meta name=\"AUTHOR\">`, les noms et adresses des étudiants qui avaient réalisé le site : exactement le genre d'information qu'on retrouve dans une archive vieille de 25 ans."
            ]
          }
        ]
      },

      /* ---------------------------------------------------------
         Enquête finale — tout mobiliser
         --------------------------------------------------------- */
      {
        type: "enquete",
        id: "osint-enquete-finale",
        titre: "Enquête finale — L'affaire Brume",
        description: "Un courriel anonyme, une photo, un communiqué : toutes les techniques à la fois.",
        methodes: [
          {
            titre: "Inventorier les pièces",
            texte: [
              "Avant de chercher, on liste ce qu'on a et ce qu'on cherche. Pour chaque pièce :",
              [
                "**courriel** : en-têtes (expéditeur, chemin, IP, nom de machine, fuseau, logiciel) ;",
                "**image** : métadonnées d'abord (gratuites), contenu ensuite (géolocalisation) ;",
                "**document** : propriétés (auteur, logiciel, dates)."
              ]
            ]
          },
          {
            titre: "Pivoter et recouper",
            texte: [
              "Chaque information trouvée devient une **nouvelle requête** : un nom de machine se compare à un nom d'auteur, une date EXIF se compare à la date d'envoi, un lieu se compare à l'adresse de la cible.",
              "Une conclusion ne tient que si **deux indices indépendants** la soutiennent. On note pour chacune sa **preuve** et son **niveau de confiance** (certain, probable, possible)."
            ],
            exemple: {
              titre: "Exemple de conclusion rédigée",
              texte: "« La photo a été prise le 3 mai à 9 h 12 (EXIF, fuseau +02:00) rue X à Brest (enseignes A et B, vue au sol). Confiance : certaine pour le lieu, probable pour l'heure (EXIF modifiables). »"
            }
          }
        ],
        challenges: [
          {
            niveau: 3,
            titre: "« À deux pas de chez vous »",
            enonce: "Le 25 juillet 2017, la direction de l'entreprise fictive Aqualenn reçoit ce courriel du « collectif Brume », avec une photo et un communiqué en pièces jointes.",
            pieces: PIECES_BRUME,
            question: "Dans quelle ville la photo a-t-elle été prise ?",
            champs: [{ libelle: "Ville", reponse: "Quimper" }],
            indices: [
              "Les métadonnées de la photo n'ont pas de GPS, mais une date de prise de vue : les commerces et bâtiments de 2017 ont pu disparaître depuis.",
              "« SERNAM » était le service de messageries de la SNCF : ses halles sont toujours au bord d'une gare.",
              "Granit, ardoise, pavés : cherchez une gare bretonne dont la halle SERNAM bordait un parking pavé, avec l'historique de Street View réglé sur 2017."
            ],
            solution: [
              "La halle **SERNAM** au bord d'un parking pavé, face à des immeubles de granit, est celle de la place Louis-Armand, devant la gare de **Quimper** (Finistère) ; le quartier de la gare a été réaménagé depuis, d'où l'intérêt de la date EXIF pour remonter dans l'historique des vues au sol.",
              "Photo : StephaneP / Panoramax, CC BY-SA 4.0 (métadonnées fabriquées)."
            ]
          },
          {
            niveau: 3,
            titre: "Le téléphone du photographe",
            enonce: "Le courriel affirme que la photo a été prise « aujourd'hui ».",
            pieces: PIECES_BRUME,
            champs: [
              { libelle: "Date et heure de prise de vue (JJ/MM/AAAA hh:mm)", reponse: "25/07/2017 14:22", accepte: ["25/07/2017 14h22", "2017-07-25 14:22", "25/07/2017 à 14:22", "25/07/2017 à 14h22"] },
              { libelle: "Nom commercial du téléphone", reponse: "Galaxy S7", accepte: ["Samsung Galaxy S7"] },
              { libelle: "Heures écoulées entre la photo et l'envoi du courriel (arrondi)", reponse: 7, tolerance: 0.08 }
            ],
            indices: [
              "Lisez `DateTimeOriginal` et `Model` dans les EXIF de la photo.",
              "Le modèle `SM-G930F` est une référence interne : cherchez-la sur le web.",
              "Le courriel est daté de 21 h 46 (+0200), la photo de 14 h 22 (+02:00) : même fuseau."
            ],
            solution: [
              { code: "Make                 : samsung\nCamera Model Name    : SM-G930F\nSoftware             : G930FXXU1DQEU\nDate/Time Original   : 2017:07:25 14:22:22\nOffset Time Original : +02:00" },
              "Photo prise le **25 juillet 2017 à 14 h 22** avec un **Samsung Galaxy S7** (référence européenne SM-G930F), environ **7 heures** avant l'envoi du courriel à 21 h 46 : l'affirmation « aujourd'hui » est cohérente."
            ]
          },
          {
            niveau: 4,
            titre: "Qui est derrière Brume ?",
            enonce: "Le collectif se veut anonyme. Ses deux pièces ont pourtant été préparées sur un ordinateur personnel.",
            pieces: PIECES_BRUME,
            champs: [
              { libelle: "Nom d'utilisateur dans les propriétés du communiqué", reponse: "gkerlaouen" },
              { libelle: "Nom de machine annoncé au serveur d'envoi du courriel", reponse: "LAPTOP-GKERLAOU" },
              { libelle: "Adresse IP publique de l'expéditeur", reponse: "198.51.100.140" },
              { libelle: "Heure d'envoi en UTC (hh:mm)", reponse: "19:46", accepte: ["19h46", "19 h 46"] }
            ],
            indices: [
              "Propriétés du PDF : le champ `Author`.",
              "Dans le courriel, le `Received` le plus bas commence par `from` suivi du nom que la machine s'est donné.",
              "Heure UTC = heure de l'en-tête `Date` moins le décalage."
            ],
            solution: [
              "Le communiqué (`Author: gkerlaouen`, créé avec LibreOffice le 25 juillet 2017 à 20 h 10) et le courriel (`from LAPTOP-GKERLAOU`, IP **198.51.100.140**, envoyé à 21 h 46 +0200 = **19 h 46 UTC**) viennent du même poste : le nom de machine Windows est tronqué à 15 caractères, `LAPTOP-` + `GKERLAOU`, soit le même identifiant **gkerlaouen**.",
              "Conclusion rédigée : « Les deux pièces ont été préparées sur l'ordinateur portable d'un utilisateur `gkerlaouen` (confiance : forte, deux indices indépendants). L'identification de l'abonné derrière l'IP relève d'une réquisition judiciaire au fournisseur d'accès. » (Personnes et organisations fictives.)"
            ]
          }
        ]
      }

    ]
  };

  cours.chapitres.push(ch2, ch3);

})();
