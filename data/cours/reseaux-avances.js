/* =============================================================
   Réseaux avancés — théorie
   -------------------------------------------------------------
   Micro-parties de cours (guides) + QCM de théorie.
   Les exercices de configuration Cisco (type "reseau") sont dans
   data/cours/reseaux-avances-exercices.js, chargé juste après.
   Format des données : voir data/cours/_modele.js.
   ============================================================= */

CONTENU["reseaux-avances"] = {

  /* =========================================================
     GUIDES — micro-parties de cours
     ========================================================= */
  guides: [

    /* ---- Guide 1 : les couches ---- */
    {
      id: "couches",
      titre: "Les couches réseau",
      resume: "Comment un message est empilé de couche en couche, du logiciel jusqu'au câble.",
      niveau: "Débutant",
      duree: "12 min",
      sections: [
        {
          type: "partie",
          titre: "Le modèle en couches",
          texte: "Chaque couche rend un service à celle du dessus et ne parle qu'à la même couche en face."
        },
        {
          titre: "OSI et TCP/IP",
          texte: "On retient surtout **4 couches utiles** (modèle TCP/IP), calquées sur les 7 couches OSI.",
          tableau: {
            entetes: ["TCP/IP", "OSI", "Rôle", "Exemples"],
            lignes: [
              ["Application", "7-6-5", "Le service rendu à l'utilisateur", "HTTP, DNS, SSH"],
              ["Transport", "4", "De bout en bout, fiable ou non", "TCP, UDP"],
              ["Internet", "3", "Adresser et **router** entre réseaux", "IP, ICMP"],
              ["Accès réseau", "2-1", "Livrer sur **le lien local**", "Ethernet, Wi-Fi"]
            ]
          }
        },
        {
          titre: "Adresse de chaque couche",
          points: [
            "Couche 2 (liaison) : **adresse MAC**, unique par carte, valable sur le lien local.",
            "Couche 3 (réseau) : **adresse IP**, hiérarchique, permet de traverser plusieurs réseaux.",
            "Couche 4 (transport) : **numéro de port** (ex. 80, 443, 22) pour désigner l'application."
          ]
        },
        {
          type: "partie",
          titre: "Encapsulation",
          texte: "Chaque couche ajoute son en-tête autour des données reçues de la couche du dessus."
        },
        {
          titre: "Le nom de l'unité change à chaque couche",
          tableau: {
            entetes: ["Couche", "Unité (PDU)", "En-tête ajouté"],
            lignes: [
              ["Transport", "Segment", "Ports source / destination"],
              ["Internet", "Paquet", "IP source / destination"],
              ["Accès réseau", "Trame", "MAC source / destination + FCS"]
            ]
          },
          remarque: "À l'arrivée, chaque couche retire **son** en-tête : c'est la décapsulation."
        },
        {
          titre: "MAC change à chaque saut, IP reste",
          texte: "Le paquet garde les **mêmes IP source et destination** du départ à l'arrivée. La trame, elle, est réécrite à chaque routeur : les **MAC changent** à chaque lien traversé.",
          attention: "Confondre « ça ne change jamais » (IP) et « ça change à chaque saut » (MAC) est l'erreur classique."
        }
      ]
    },

    /* ---- Guide 2 : adressage IPv4 ---- */
    {
      id: "adressage",
      titre: "Adressage IPv4 et sous-réseaux",
      resume: "Lire un masque, trouver l'adresse de réseau, de diffusion et le nombre d'hôtes.",
      niveau: "Essentiel",
      duree: "18 min",
      sections: [
        {
          type: "partie",
          titre: "Adresse et masque",
          texte: "Une adresse IPv4 = 32 bits, notés en 4 octets décimaux (ex. `192.168.1.10`)."
        },
        {
          titre: "Le masque coupe l'adresse en deux",
          texte: "Le **masque** dit quelle partie est le **réseau** (bits à 1) et quelle partie est l'**hôte** (bits à 0).",
          tableau: {
            entetes: ["Notation", "Masque décimal", "Bits réseau"],
            lignes: [
              ["/8", "255.0.0.0", "8"],
              ["/16", "255.255.0.0", "16"],
              ["/24", "255.255.255.0", "24"],
              ["/30", "255.255.255.252", "30"]
            ]
          },
          remarque: "La notation `/n` (CIDR) donne directement le **nombre de bits à 1** du masque."
        },
        {
          titre: "Classes historiques",
          points: [
            "A : `1.0.0.0` → `126.255.255.255`, masque par défaut /8.",
            "B : `128.0.0.0` → `191.255.255.255`, /16.",
            "C : `192.0.0.0` → `223.255.255.255`, /24.",
            "Privées (RFC 1918) : `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`."
          ]
        },
        {
          type: "partie",
          titre: "Calculer un sous-réseau",
          texte: "Avec l'adresse et le masque, on trouve les bornes du réseau."
        },
        {
          titre: "Réseau, diffusion, hôtes",
          points: [
            "**Adresse de réseau** = tous les bits d'hôte à 0 (`IP ET masque`).",
            "**Adresse de diffusion** = tous les bits d'hôte à 1.",
            "**Hôtes utilisables** = 2^(bits d'hôte) − 2 (on retire réseau et diffusion)."
          ]
        },
        {
          titre: "Exemple complet",
          texte: "Pour `192.168.1.10/24` :",
          tableau: {
            entetes: ["Élément", "Valeur"],
            lignes: [
              ["Masque", "255.255.255.0"],
              ["Adresse de réseau", "192.168.1.0"],
              ["Première adresse hôte", "192.168.1.1"],
              ["Dernière adresse hôte", "192.168.1.254"],
              ["Diffusion", "192.168.1.255"],
              ["Hôtes utilisables", "254"]
            ]
          }
        },
        {
          titre: "Les liens entre routeurs : /30",
          texte: "Un lien point à point n'a besoin que de **2 adresses**. Un `/30` en donne exactement 2 (4 − 2), d'où son usage systématique entre deux routeurs.",
          remarque: "`/31` (RFC 3021) existe aussi pour les liens, mais on utilise `/30` en TP."
        }
      ]
    },

    /* ---- Guide 3 : commutation & VLAN ---- */
    {
      id: "commutation",
      titre: "Commutation et VLAN",
      resume: "Comment un switch décide où envoyer une trame, et à quoi servent les VLAN.",
      niveau: "Intermédiaire",
      duree: "15 min",
      sections: [
        {
          type: "partie",
          titre: "Le switch (commutateur)",
          texte: "Un switch travaille en **couche 2** : il commute des trames d'après les adresses MAC."
        },
        {
          titre: "La table d'adresses MAC",
          points: [
            "Le switch **apprend** : la MAC source d'une trame → le port par lequel elle est entrée.",
            "Il **transfère** vers le port de la MAC destination s'il la connaît.",
            "Sinon il **inonde** (envoie sur tous les ports du VLAN sauf celui d'entrée)."
          ]
        },
        {
          titre: "Domaines de collision et de diffusion",
          tableau: {
            entetes: ["Appareil", "Domaines de collision", "Domaines de diffusion"],
            lignes: [
              ["Concentrateur (hub)", "1 (partagé)", "1"],
              ["Switch", "1 par port", "1 par VLAN"],
              ["Routeur", "1 par interface", "1 par interface"]
            ]
          },
          remarque: "Un routeur **arrête** la diffusion : il sépare les domaines de diffusion."
        },
        {
          type: "partie",
          titre: "Les VLAN",
          texte: "Un VLAN découpe un switch en plusieurs réseaux logiques isolés."
        },
        {
          titre: "Pourquoi",
          points: [
            "**Isolation** : deux VLAN ne se parlent pas sans routeur.",
            "**Sécurité et organisation** : séparer services, invités, serveurs.",
            "**Moins de diffusion** : chaque VLAN = un domaine de diffusion plus petit."
          ]
        },
        {
          titre: "Ports access et trunk",
          tableau: {
            entetes: ["Type de port", "Transporte", "Étiquetage 802.1Q"],
            lignes: [
              ["Access", "**un seul** VLAN", "Trame **non** étiquetée (vers un PC)"],
              ["Trunk", "**plusieurs** VLAN", "Trame **étiquetée** (dot1q), sauf VLAN natif"]
            ]
          },
          remarque: "Un lien switch-switch ou switch-routeur qui doit porter plusieurs VLAN est un **trunk**."
        },
        {
          titre: "Inter-VLAN : router-on-a-stick",
          texte: "Pour faire communiquer deux VLAN, il faut un routeur. Astuce classique : **une seule** interface physique en trunk, découpée en **sous-interfaces** (une par VLAN) avec `encapsulation dot1q`.",
          code: "interface g0/0.10\n encapsulation dot1q 10\n ip address 192.168.10.1 255.255.255.0",
          legende: "Sous-interface pour le VLAN 10"
        }
      ]
    },

    /* ---- Guide 4 : routage ---- */
    {
      id: "routage",
      titre: "Le routage IP",
      resume: "Comment un routeur choisit la sortie d'un paquet à l'aide de sa table de routage.",
      niveau: "Intermédiaire",
      duree: "14 min",
      sections: [
        {
          type: "partie",
          titre: "La table de routage",
          texte: "Pour chaque paquet, le routeur cherche dans sa table la route vers l'IP de destination."
        },
        {
          titre: "Trois origines de routes",
          tableau: {
            entetes: ["Code", "Origine", "Comment"],
            lignes: [
              ["C", "Connecté", "Réseau d'une interface active (auto)"],
              ["S", "Statique", "Ajoutée à la main (`ip route …`)"],
              ["S*", "Défaut", "`ip route 0.0.0.0 0.0.0.0 …`"]
            ]
          }
        },
        {
          titre: "La règle du préfixe le plus long",
          texte: "Si plusieurs routes correspondent, le routeur prend celle au **masque le plus long** (la plus précise). La route par défaut `/0` n'est choisie que si **aucune** autre ne correspond.",
          attention: "Une interface **éteinte** (`shutdown`) ou **sans IP** ne crée pas de route connectée : le réseau devient injoignable."
        },
        {
          type: "partie",
          titre: "Route statique",
          texte: "On indique au routeur comment atteindre un réseau qu'il ne connaît pas directement."
        },
        {
          titre: "Syntaxe",
          code: "ip route 192.168.2.0 255.255.255.0 10.0.0.2",
          legende: "Réseau · masque · prochain saut",
          points: [
            "**Réseau + masque** : la destination à joindre.",
            "**Prochain saut** : l'IP du routeur voisin (dans un réseau connecté).",
            "Le routage doit être configuré **dans les deux sens** : aller ET retour."
          ]
        },
        {
          titre: "Route par défaut",
          texte: "`0.0.0.0 0.0.0.0` correspond à **toutes** les destinations. C'est la « sortie de secours », typiquement vers le routeur de bordure / Internet.",
          code: "ip route 0.0.0.0 0.0.0.0 10.0.0.2",
          legende: "Tout le reste part vers 10.0.0.2"
        }
      ]
    },

    /* ---- Guide 5 : fiche technique IOS ---- */
    {
      id: "ios",
      titre: "Cisco IOS — commandes",
      resume: "Les modes et les commandes utilisées dans les exercices de configuration.",
      badge: "Fiche technique",
      niveau: "Référence",
      sections: [
        {
          type: "partie",
          titre: "Les modes",
          texte: "L'invite change selon le mode : on descend avec les commandes, on remonte avec `exit` / `end`."
        },
        {
          titre: "Se déplacer",
          tableau: {
            entetes: ["Invite", "Mode", "Y entrer"],
            lignes: [
              ["`R1>`", "Utilisateur", "(au départ)"],
              ["`R1#`", "Privilégié", "`enable`"],
              ["`R1(config)#`", "Configuration", "`configure terminal`"],
              ["`R1(config-if)#`", "Interface", "`interface g0/0`"],
              ["`R1(config-vlan)#`", "VLAN", "`vlan 10`"]
            ]
          },
          remarque: "`exit` remonte d'un cran, `end` revient directement en mode privilégié."
        },
        {
          type: "partie",
          titre: "Adressage et état",
          texte: "Sur un routeur, chaque interface reçoit une IP et doit être allumée."
        },
        {
          titre: "Interface d'un routeur",
          code: "enable\nconfigure terminal\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown",
          legende: "Adresser puis allumer",
          attention: "Sans `no shutdown`, l'interface reste **administrativement éteinte** : rien ne passe."
        },
        {
          titre: "Vérifier",
          tableau: {
            entetes: ["Commande", "Montre"],
            lignes: [
              ["`show ip interface brief`", "IP et état de chaque interface"],
              ["`show ip route`", "La table de routage"],
              ["`show vlan brief`", "Les VLAN et leurs ports (switch)"],
              ["`ping 192.168.1.2`", "La connectivité vers une IP"]
            ]
          }
        },
        {
          type: "partie",
          titre: "VLAN (switch)",
          texte: "On crée les VLAN, puis on affecte chaque port."
        },
        {
          titre: "Port access et trunk",
          codes: [
            { legende: "Port vers un PC (access)", code: "vlan 10\ninterface f0/1\n switchport mode access\n switchport access vlan 10" },
            { legende: "Lien entre switches (trunk)", code: "interface g0/1\n switchport mode trunk" }
          ]
        },
        {
          type: "partie",
          titre: "Poste (PC) — console simplifiée",
          texte: "Dans le simulateur, un PC se configure en une ligne."
        },
        {
          titre: "Adresser un PC",
          code: "ip 192.168.1.10 255.255.255.0 192.168.1.1",
          legende: "adresse · masque · passerelle",
          points: [
            "`show ip` : rappelle la configuration du poste.",
            "`ping <adresse>` : teste la connectivité."
          ]
        }
      ]
    }
  ],

  /* =========================================================
     CHAPITRES — QCM de théorie
     (les exercices de configuration sont ajoutés par
      reseaux-avances-exercices.js)
     ========================================================= */
  chapitres: [

    {
      id: "th-couches",
      titre: "Théorie — Couches et encapsulation",
      description: "Rôle de chaque couche, adresses et encapsulation.",
      exercices: [
        {
          type: "qcm",
          id: "qcm-couches",
          titre: "QCM — Les couches réseau",
          description: "Modèle en couches, PDU et adresses.",
          melangerChoix: true,
          cours: "Chaque couche ajoute son en-tête (encapsulation) ; l'IP reste de bout en bout, la MAC change à chaque saut.",
          questions: [
            {
              enonce: "À quelle couche travaille un routeur pour décider où envoyer un paquet ?",
              choix: ["Couche 1 (physique)", "Couche 2 (liaison)", "Couche 3 (réseau)", "Couche 4 (transport)"],
              reponse: 2,
              explication: "Le routage utilise l'adresse IP, qui est en couche 3 (réseau / Internet)."
            },
            {
              enonce: "Quelle unité de données manipule-t-on en couche 2 ?",
              choix: ["Le segment", "Le paquet", "La trame", "Le bit"],
              reponse: 2,
              explication: "Segment (4), paquet (3), trame (2), bits (1)."
            },
            {
              enonce: "Lors d'un trajet à travers plusieurs routeurs, qu'est-ce qui NE change PAS ?",
              choix: ["Les adresses MAC source et destination", "Les adresses IP source et destination", "Le port physique de sortie", "L'interface empruntée"],
              reponse: 1,
              explication: "Les IP de bout en bout restent identiques ; les MAC sont réécrites à chaque saut."
            },
            {
              enonce: "Quel identifiant de couche 4 désigne l'application visée ?",
              choix: ["L'adresse MAC", "L'adresse IP", "Le numéro de port", "Le FCS"],
              reponse: 2,
              explication: "Ex. port 80 (HTTP), 443 (HTTPS), 22 (SSH)."
            },
            {
              enonce: "Dans quel ordre les en-têtes sont-ils ajoutés à l'émission ?",
              choix: ["MAC, puis IP, puis port", "Port (transport), puis IP, puis MAC", "IP, puis MAC, puis port", "MAC, puis port, puis IP"],
              reponse: 1,
              explication: "On descend les couches : transport → réseau → liaison."
            },
            {
              enonce: "Quel protocole de transport est fiable (avec accusés de réception) ?",
              choix: ["UDP", "TCP", "IP", "ICMP"],
              reponse: 1,
              explication: "TCP est fiable et ordonné ; UDP est rapide mais sans garantie."
            },
            {
              enonce: "Que fait la décapsulation à la réception ?",
              choix: ["Ajoute un en-tête à chaque couche", "Retire l'en-tête propre à chaque couche en remontant", "Chiffre les données", "Fragmente le paquet"],
              reponse: 1,
              explication: "Chaque couche lit puis retire son en-tête avant de passer à la couche du dessus."
            },
            {
              enonce: "Ethernet et Wi-Fi appartiennent à quelle couche du modèle TCP/IP ?",
              choix: ["Application", "Transport", "Internet", "Accès réseau"],
              reponse: 3,
              explication: "Ils livrent la trame sur le lien local (couches 1-2)."
            }
          ]
        }
      ]
    },

    {
      id: "th-adressage",
      titre: "Théorie — Adressage IPv4",
      description: "Masques, sous-réseaux, adresses de réseau et de diffusion.",
      exercices: [
        {
          type: "qcm",
          id: "qcm-adressage",
          titre: "QCM — Adressage et sous-réseaux",
          description: "Lire un masque et calculer les bornes d'un réseau.",
          melangerChoix: true,
          cours: "Réseau = IP ET masque ; hôtes utilisables = 2^(bits d'hôte) − 2.",
          questions: [
            {
              enonce: "Quel masque décimal correspond à /24 ?",
              choix: ["255.255.0.0", "255.255.255.0", "255.255.255.192", "255.0.0.0"],
              reponse: 1
            },
            {
              enonce: "Combien d'hôtes utilisables dans un /24 ?",
              choix: ["256", "255", "254", "128"],
              reponse: 2,
              explication: "2^8 − 2 = 254 (on retire réseau et diffusion)."
            },
            {
              enonce: "Adresse de réseau de 192.168.1.77 /24 ?",
              choix: ["192.168.1.0", "192.168.1.1", "192.168.1.77", "192.168.0.0"],
              reponse: 0
            },
            {
              enonce: "Adresse de diffusion de 10.0.5.9 /24 ?",
              choix: ["10.0.5.0", "10.0.5.1", "10.0.5.255", "10.0.255.255"],
              reponse: 2
            },
            {
              enonce: "Combien d'hôtes utilisables offre un /30 ?",
              choix: ["4", "2", "1", "6"],
              reponse: 1,
              explication: "2^2 − 2 = 2 : idéal pour un lien entre deux routeurs."
            },
            {
              enonce: "Laquelle de ces adresses est privée (RFC 1918) ?",
              choix: ["8.8.8.8", "172.16.4.1", "192.0.2.1", "200.1.1.1"],
              reponse: 1,
              explication: "172.16.0.0/12 est une plage privée, comme 10.0.0.0/8 et 192.168.0.0/16."
            },
            {
              enonce: "Que vaut le préfixe /26 en décimal ?",
              choix: ["255.255.255.0", "255.255.255.192", "255.255.255.224", "255.255.255.240"],
              reponse: 1,
              explication: "26 bits à 1 : 255.255.255.192."
            },
            {
              enonce: "Deux PC en 192.168.1.10/24 et 192.168.2.10/24 peuvent-ils se parler sans routeur ?",
              choix: ["Oui, même /24", "Non, réseaux différents (1 vs 2)", "Oui, s'ils sont sur le même switch", "Oui, toujours"],
              reponse: 1,
              explication: "192.168.1.0 ≠ 192.168.2.0 : il faut un routage entre les deux réseaux."
            },
            {
              enonce: "À quoi sert la passerelle par défaut d'un PC ?",
              choix: ["Résoudre les noms DNS", "Joindre les hôtes hors de son propre réseau", "Attribuer les IP", "Filtrer les ports"],
              reponse: 1,
              explication: "Tout paquet vers un autre réseau est confié à la passerelle (le routeur local)."
            }
          ]
        },
        {
          type: "jetpunk",
          id: "jp-masques",
          titre: "Rapidité — Masques CIDR",
          consigne: "Donnez le masque décimal correspondant à chaque préfixe.",
          temps: 120,
          colonnes: 2,
          items: [
            { indice: "/8", reponse: "255.0.0.0" },
            { indice: "/16", reponse: "255.255.0.0" },
            { indice: "/24", reponse: "255.255.255.0" },
            { indice: "/25", reponse: "255.255.255.128" },
            { indice: "/26", reponse: "255.255.255.192" },
            { indice: "/27", reponse: "255.255.255.224" },
            { indice: "/28", reponse: "255.255.255.240" },
            { indice: "/30", reponse: "255.255.255.252" }
          ]
        }
      ]
    },

    {
      id: "th-commutation",
      titre: "Théorie — Commutation et VLAN",
      description: "Switch, table MAC, domaines et VLAN.",
      exercices: [
        {
          type: "qcm",
          id: "qcm-commutation",
          titre: "QCM — Commutation et VLAN",
          description: "Fonctionnement du switch, access, trunk et inter-VLAN.",
          melangerChoix: true,
          cours: "Un switch commute par MAC (couche 2). Un port access porte un seul VLAN ; un trunk en porte plusieurs, étiquetés en 802.1Q.",
          questions: [
            {
              enonce: "Comment un switch remplit-il sa table d'adresses MAC ?",
              choix: ["En lisant la MAC destination des trames", "En lisant la MAC source et le port d'entrée", "Par configuration manuelle uniquement", "Grâce au serveur DHCP"],
              reponse: 1
            },
            {
              enonce: "Que fait un switch d'une trame dont la MAC destination est inconnue ?",
              choix: ["Il la jette", "Il l'inonde sur tous les ports du VLAN sauf celui d'entrée", "Il la renvoie à l'expéditeur", "Il la route en couche 3"],
              reponse: 1
            },
            {
              enonce: "Combien de domaines de diffusion un switch crée-t-il par défaut (un seul VLAN) ?",
              choix: ["Un par port", "Un seul", "Deux", "Aucun"],
              reponse: 1,
              explication: "Sans VLAN, tout le switch est un seul domaine de diffusion."
            },
            {
              enonce: "Quel équipement sépare les domaines de diffusion ?",
              choix: ["Le concentrateur", "Le switch (sans VLAN)", "Le routeur", "Le câble"],
              reponse: 2
            },
            {
              enonce: "Un port qui relie deux switches et doit porter plusieurs VLAN doit être :",
              choix: ["access", "trunk", "éteint", "en mode routeur"],
              reponse: 1
            },
            {
              enonce: "Quel protocole étiquette les trames sur un trunk ?",
              choix: ["802.1Q (dot1q)", "STP", "ARP", "OSPF"],
              reponse: 0
            },
            {
              enonce: "Deux PC dans des VLAN différents sur le même switch peuvent-ils communiquer ?",
              choix: ["Oui, directement", "Non, sans passer par un routeur", "Oui, si même /24", "Oui, via un hub"],
              reponse: 1,
              explication: "Il faut un routage inter-VLAN (ex. router-on-a-stick)."
            },
            {
              enonce: "Dans un router-on-a-stick, qu'ajoute-t-on sur l'interface du routeur ?",
              choix: ["Plusieurs interfaces physiques", "Des sous-interfaces avec encapsulation dot1q", "Un serveur DHCP", "Un second switch"],
              reponse: 1
            },
            {
              enonce: "Sur un port access, la trame vers le PC est :",
              choix: ["étiquetée dot1q", "non étiquetée", "chiffrée", "dupliquée"],
              reponse: 1,
              explication: "Le PC ne comprend pas les étiquettes VLAN : le port access les retire."
            }
          ]
        }
      ]
    },

    {
      id: "th-routage",
      titre: "Théorie — Routage IP",
      description: "Table de routage, routes statiques et route par défaut.",
      exercices: [
        {
          type: "qcm",
          id: "qcm-routage",
          titre: "QCM — Le routage",
          description: "Comment un routeur choisit la sortie d'un paquet.",
          melangerChoix: true,
          cours: "Réseau connecté (C), route statique (S), défaut 0.0.0.0/0. En cas d'égalité : préfixe le plus long.",
          questions: [
            {
              enonce: "Quelle route est choisie si plusieurs correspondent à la destination ?",
              choix: ["La première écrite", "Celle au masque le plus long (la plus précise)", "La route par défaut", "Une au hasard"],
              reponse: 1
            },
            {
              enonce: "Que signifie le code « C » dans la table de routage ?",
              choix: ["Route configurée à la main", "Réseau directement connecté", "Route par défaut", "Route candidate"],
              reponse: 1
            },
            {
              enonce: "Syntaxe correcte d'une route statique vers 192.168.2.0/24 via 10.0.0.2 ?",
              choix: [
                "ip route 192.168.2.0 255.255.255.0 10.0.0.2",
                "ip route 10.0.0.2 255.255.255.0 192.168.2.0",
                "route add 192.168.2.0 10.0.0.2",
                "ip 192.168.2.0 255.255.255.0 gateway 10.0.0.2"
              ],
              reponse: 0
            },
            {
              enonce: "Que représente la route 0.0.0.0 0.0.0.0 ?",
              choix: ["Le réseau local", "La route par défaut (toutes destinations)", "Une adresse invalide", "La boucle locale"],
              reponse: 1
            },
            {
              enonce: "PC1 (réseau A) ne joint pas PC2 (réseau B) alors que les IP semblent bonnes. Cause fréquente ?",
              choix: ["Le câble est trop long", "La route retour (B → A) manque sur l'autre routeur", "PC2 est éteint", "Le masque est /24"],
              reponse: 1,
              explication: "Le routage doit exister dans les deux sens."
            },
            {
              enonce: "Pourquoi une interface sans `no shutdown` casse-t-elle le routage ?",
              choix: ["Elle sature le CPU", "Elle ne crée pas de route connectée : le réseau est injoignable", "Elle change le masque", "Elle bloque le DNS"],
              reponse: 1
            },
            {
              enonce: "Un routeur reçoit un paquet pour une destination absente de sa table (sans route par défaut). Que fait-il ?",
              choix: ["Il l'inonde", "Il le jette (destination injoignable)", "Il le renvoie à la source telle quelle", "Il le met en file d'attente indéfiniment"],
              reponse: 1
            }
          ]
        }
      ]
    }
  ]
};
