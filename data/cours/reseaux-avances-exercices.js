/* =============================================================
   Réseaux avancés — exercices de configuration Cisco (type "reseau")
   -------------------------------------------------------------
   Moteur : assets/js/reseau-cisco.js (MoteurReseau).
   Chaque exercice fournit une topologie (souvent déjà câblée), une
   consigne, des objectifs, des tests (pings) et une solution.
   La box permet toujours d'ajouter et de relier des appareils.

   Progression : un nouveau concept par exercice, du simple adressage
   au routage multi-sauts et à l'inter-VLAN. Après ce parcours,
   l'utilisateur possède tout ce qu'il faut pour les TP.
   Vérifier les solutions : node outils/verifier-exercices.js
   ============================================================= */

(function () {
  const chapitres = CONTENU["reseaux-avances"].chapitres;

  chapitres.push(

    /* =======================================================
       A) Adressage et connectivité
       ======================================================= */
    {
      id: "cfg-base",
      titre: "Configuration — Adressage et routage",
      description: "Adresser des interfaces, relier des réseaux, router entre eux.",
      exercices: [

        /* --- 1. Adresser un LAN --- */
        {
          type: "reseau",
          id: "res-ip-lan",
          titre: "Un premier réseau local",
          description: "Adresser une interface de routeur et un PC, puis se pinguer.",
          cours: "Sur un routeur : entrer en configuration, choisir l'interface, lui donner une IP et l'allumer avec `no shutdown`.",
          exemple: {
            legende: "Adresser une interface",
            code: "enable\nconfigure terminal\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown"
          },
          intro: ["Le switch `SW1` relie déjà `R1` et `PC1`. Rien n'est configuré : à vous de donner les adresses."],
          consigne: "Mettez `R1` et `PC1` sur le réseau **192.168.1.0/24**, puis vérifiez le ping.",
          objectifs: [
            "`R1` interface `g0/0` : **192.168.1.1 / 24**, allumée (`no shutdown`).",
            "`PC1` : **192.168.1.10 / 24**, passerelle `192.168.1.1` — commande `ip 192.168.1.10 255.255.255.0 192.168.1.1`.",
            "`PC1` doit joindre `R1`."
          ],
          topologie: {
            appareils: [
              { nom: "R1", type: "routeur", x: 18, y: 38 },
              { nom: "SW1", type: "switch", x: 50, y: 38 },
              { nom: "PC1", type: "pc", x: 82, y: 38 }
            ],
            liens: [
              { de: "R1", deIf: "g0/0", vers: "SW1", versIf: "f0/1" },
              { de: "PC1", deIf: "eth0", vers: "SW1", versIf: "f0/2" }
            ]
          },
          tests: [
            { de: "PC1", vers: "R1", message: "PC1 joint la passerelle R1 (192.168.1.1)" },
            { de: "R1", vers: "PC1", message: "R1 joint PC1 (192.168.1.10)" }
          ],
          solution: {
            R1: ["enable", "configure terminal", "interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown"],
            PC1: ["ip 192.168.1.10 255.255.255.0 192.168.1.1"]
          }
        },

        /* --- 2. Lien entre deux routeurs --- */
        {
          type: "reseau",
          id: "res-lien-wan",
          titre: "Relier deux routeurs",
          description: "Un lien point à point en /30 entre R1 et R2.",
          cours: "Un lien entre deux routeurs n'a besoin que de deux adresses : on utilise un **/30** (masque 255.255.255.252).",
          intro: ["`R1` et `R2` sont reliés par leur interface `g0/0`. Configurez le lien pour qu'ils se pinguent."],
          consigne: "Adressez le lien **10.0.0.0/30** : `R1` en `.1`, `R2` en `.2`. N'oubliez pas `no shutdown` des deux côtés.",
          objectifs: [
            "`R1` `g0/0` : **10.0.0.1 255.255.255.252**, allumée.",
            "`R2` `g0/0` : **10.0.0.2 255.255.255.252**, allumée.",
            "`R1` et `R2` se pinguent."
          ],
          topologie: {
            appareils: [
              { nom: "R1", type: "routeur", x: 30, y: 42 },
              { nom: "R2", type: "routeur", x: 70, y: 42 }
            ],
            liens: [{ de: "R1", deIf: "g0/0", vers: "R2", versIf: "g0/0" }]
          },
          tests: [
            { de: "R1", vers: "10.0.0.2", message: "R1 joint R2" },
            { de: "R2", vers: "10.0.0.1", message: "R2 joint R1" }
          ],
          solution: {
            R1: ["enable", "configure terminal", "interface g0/0", "ip address 10.0.0.1 255.255.255.252", "no shutdown"],
            R2: ["enable", "configure terminal", "interface g0/0", "ip address 10.0.0.2 255.255.255.252", "no shutdown"]
          }
        },

        /* --- 3. Routage statique entre deux LAN --- */
        {
          type: "reseau",
          id: "res-static",
          titre: "Router entre deux réseaux",
          description: "Deux LAN reliés par un lien WAN : il faut des routes statiques.",
          cours: [
            "Chaque routeur connaît ses réseaux **directement connectés**. Pour joindre un réseau distant, on ajoute une **route statique** :",
            { legende: "Route statique", code: "ip route <réseau> <masque> <prochain-saut>" },
            "Le routage doit être configuré **dans les deux sens** : aller ET retour."
          ],
          intro: [
            "`PC1` est sur le LAN 192.168.1.0/24 (derrière `R1`), `PC2` sur 192.168.2.0/24 (derrière `R2`).",
            "Le lien entre routeurs est 10.0.0.0/30. Faites-les communiquer."
          ],
          consigne: "Adressez tout, puis ajoutez sur chaque routeur la route vers le LAN d'en face. Configurez la passerelle de chaque PC.",
          objectifs: [
            "`R1` : `g0/0` = 192.168.1.1/24, `g0/1` = 10.0.0.1/30.",
            "`R2` : `g0/0` = 192.168.2.1/24, `g0/1` = 10.0.0.2/30.",
            "`R1` : route vers 192.168.2.0/24 via 10.0.0.2 ; `R2` : route vers 192.168.1.0/24 via 10.0.0.1.",
            "`PC1` = 192.168.1.10/24 (passerelle .1) ; `PC2` = 192.168.2.10/24 (passerelle .1).",
            "`PC1` doit joindre `PC2`."
          ],
          topologie: {
            appareils: [
              { nom: "PC1", type: "pc", x: 10, y: 48 }, { nom: "R1", type: "routeur", x: 36, y: 48 },
              { nom: "R2", type: "routeur", x: 64, y: 48 }, { nom: "PC2", type: "pc", x: 90, y: 48 }
            ],
            liens: [
              { de: "PC1", deIf: "eth0", vers: "R1", versIf: "g0/0" },
              { de: "R1", deIf: "g0/1", vers: "R2", versIf: "g0/1" },
              { de: "R2", deIf: "g0/0", vers: "PC2", versIf: "eth0" }
            ]
          },
          tests: [
            { de: "PC1", vers: "PC2", message: "PC1 joint PC2 (192.168.2.10)" },
            { de: "PC2", vers: "PC1", message: "PC2 joint PC1 (192.168.1.10)" }
          ],
          solution: {
            R1: ["enable", "configure terminal",
              "interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown", "exit",
              "interface g0/1", "ip address 10.0.0.1 255.255.255.252", "no shutdown", "exit",
              "ip route 192.168.2.0 255.255.255.0 10.0.0.2"],
            R2: ["enable", "configure terminal",
              "interface g0/0", "ip address 192.168.2.1 255.255.255.0", "no shutdown", "exit",
              "interface g0/1", "ip address 10.0.0.2 255.255.255.252", "no shutdown", "exit",
              "ip route 192.168.1.0 255.255.255.0 10.0.0.1"],
            PC1: ["ip 192.168.1.10 255.255.255.0 192.168.1.1"],
            PC2: ["ip 192.168.2.10 255.255.255.0 192.168.2.1"]
          }
        },

        /* --- 4. Route par défaut vers la bordure --- */
        {
          type: "reseau",
          id: "res-defaut",
          titre: "Sortir par une route par défaut",
          description: "R2 (bordure) est déjà configuré ; R1 doit envoyer tout le reste vers lui.",
          cours: [
            "Plutôt qu'une route par réseau distant, un routeur d'accès pointe **tout** vers la sortie avec une **route par défaut** :",
            { legende: "Route par défaut", code: "ip route 0.0.0.0 0.0.0.0 <prochain-saut>" }
          ],
          intro: [
            "`R2` est le routeur de bordure, **déjà configuré** ; le serveur `SRV` (8.8.8.8) est derrière lui.",
            "Configurez `R1` et `PC1` pour que `PC1` atteigne `SRV`."
          ],
          consigne: "Adressez `R1` (LAN 192.168.1.0/24 et lien 10.0.0.0/30) puis ajoutez une **route par défaut** vers `R2` (10.0.0.2). Configurez `PC1`.",
          objectifs: [
            "`R1` : `g0/0` = 192.168.1.1/24, `g0/1` = 10.0.0.1/30.",
            "`R1` : `ip route 0.0.0.0 0.0.0.0 10.0.0.2`.",
            "`PC1` = 192.168.1.10/24, passerelle .1.",
            "`PC1` doit joindre le serveur **8.8.8.8**."
          ],
          topologie: {
            appareils: [
              { nom: "PC1", type: "pc", x: 10, y: 48 }, { nom: "R1", type: "routeur", x: 36, y: 48 },
              { nom: "R2", type: "routeur", x: 64, y: 48 }, { nom: "SRV", type: "pc", x: 90, y: 48 }
            ],
            liens: [
              { de: "PC1", deIf: "eth0", vers: "R1", versIf: "g0/0" },
              { de: "R1", deIf: "g0/1", vers: "R2", versIf: "g0/1" },
              { de: "R2", deIf: "g0/0", vers: "SRV", versIf: "eth0" }
            ]
          },
          preconfig: {
            R2: ["enable", "configure terminal",
              "interface g0/1", "ip address 10.0.0.2 255.255.255.252", "no shutdown", "exit",
              "interface g0/0", "ip address 8.8.8.1 255.255.255.0", "no shutdown", "exit",
              "ip route 192.168.1.0 255.255.255.0 10.0.0.1"],
            SRV: ["ip 8.8.8.8 255.255.255.0 8.8.8.1"]
          },
          tests: [
            { de: "PC1", vers: "8.8.8.8", message: "PC1 atteint le serveur 8.8.8.8" }
          ],
          solution: {
            R1: ["enable", "configure terminal",
              "interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown", "exit",
              "interface g0/1", "ip address 10.0.0.1 255.255.255.252", "no shutdown", "exit",
              "ip route 0.0.0.0 0.0.0.0 10.0.0.2"],
            PC1: ["ip 192.168.1.10 255.255.255.0 192.168.1.1"]
          }
        }
      ]
    },

    /* =======================================================
       B) Commutation et VLAN
       ======================================================= */
    {
      id: "cfg-vlan",
      titre: "Configuration — Commutation et VLAN",
      description: "Créer des VLAN, isoler, faire passer un trunk, router entre VLAN.",
      exercices: [

        /* --- 5. VLAN et isolation --- */
        {
          type: "reseau",
          id: "res-vlan",
          titre: "Isoler avec des VLAN",
          description: "Deux VLAN sur un même switch : deux réseaux étanches.",
          cours: [
            "On crée le VLAN, puis on place chaque port en **access** dans son VLAN :",
            { legende: "Port access", code: "vlan 10\ninterface f0/1\n switchport mode access\n switchport access vlan 10" },
            "Deux PC dans des VLAN différents **ne se parlent pas** (sans routeur)."
          ],
          intro: ["Quatre PC sur `SW1`. `PC1` et `PC2` doivent être ensemble (VLAN 10), `PC3` et `PC4` isolés d'eux (VLAN 20)."],
          consigne: "Créez les VLAN 10 et 20 sur `SW1`, placez `f0/1`-`f0/2` en VLAN 10 et `f0/3`-`f0/4` en VLAN 20. Adressez les PC.",
          objectifs: [
            "VLAN 10 : `PC1` (192.168.10.11/24) et `PC2` (192.168.10.12/24) sur `f0/1`, `f0/2`.",
            "VLAN 20 : `PC3` (192.168.20.13/24) et `PC4` (192.168.20.14/24) sur `f0/3`, `f0/4`.",
            "`PC1` joint `PC2`, `PC3` joint `PC4`, mais `PC1` **n'atteint pas** `PC3`."
          ],
          topologie: {
            appareils: [
              { nom: "SW1", type: "switch", x: 50, y: 20 },
              { nom: "PC1", type: "pc", x: 14, y: 76 }, { nom: "PC2", type: "pc", x: 38, y: 76 },
              { nom: "PC3", type: "pc", x: 62, y: 76 }, { nom: "PC4", type: "pc", x: 86, y: 76 }
            ],
            liens: [
              { de: "PC1", deIf: "eth0", vers: "SW1", versIf: "f0/1" },
              { de: "PC2", deIf: "eth0", vers: "SW1", versIf: "f0/2" },
              { de: "PC3", deIf: "eth0", vers: "SW1", versIf: "f0/3" },
              { de: "PC4", deIf: "eth0", vers: "SW1", versIf: "f0/4" }
            ]
          },
          tests: [
            { de: "PC1", vers: "PC2", message: "PC1 joint PC2 (même VLAN 10)" },
            { de: "PC3", vers: "PC4", message: "PC3 joint PC4 (même VLAN 20)" },
            { de: "PC1", vers: "PC3", attendu: false, message: "PC1 est isolé de PC3 (VLAN différents)" }
          ],
          solution: {
            SW1: ["enable", "configure terminal", "vlan 10", "exit", "vlan 20", "exit",
              "interface f0/1", "switchport mode access", "switchport access vlan 10", "exit",
              "interface f0/2", "switchport mode access", "switchport access vlan 10", "exit",
              "interface f0/3", "switchport mode access", "switchport access vlan 20", "exit",
              "interface f0/4", "switchport mode access", "switchport access vlan 20"],
            PC1: ["ip 192.168.10.11 255.255.255.0"],
            PC2: ["ip 192.168.10.12 255.255.255.0"],
            PC3: ["ip 192.168.20.13 255.255.255.0"],
            PC4: ["ip 192.168.20.14 255.255.255.0"]
          }
        },

        /* --- 6. Trunk entre deux switches --- */
        {
          type: "reseau",
          id: "res-trunk",
          titre: "Étendre un VLAN par un trunk",
          description: "Un même VLAN réparti sur deux switches grâce à un lien trunk.",
          cours: [
            "Le lien entre deux switches qui doit porter **plusieurs** VLAN est un **trunk** :",
            { legende: "Port trunk", code: "interface g0/1\n switchport mode trunk" },
            "Sans trunk, un VLAN présent sur les deux switches reste coupé en deux."
          ],
          intro: [
            "`PC1` (SW1) et `PC2` (SW2) sont dans le VLAN 10 ; `PC3` (SW2) est dans le VLAN 20.",
            "Le lien `SW1 g0/1 — SW2 g0/1` doit transporter les VLAN."
          ],
          consigne: "Créez les VLAN sur les deux switches, placez les ports d'accès, et passez le lien `g0/1` en **trunk** des deux côtés.",
          objectifs: [
            "VLAN 10 : `PC1` (10.0.10.1/24) sur SW1 `f0/1`, `PC2` (10.0.10.2/24) sur SW2 `f0/1`.",
            "VLAN 20 : `PC3` (10.0.20.3/24) sur SW2 `f0/2`.",
            "`SW1 g0/1` et `SW2 g0/1` en trunk.",
            "`PC1` joint `PC2` (VLAN 10 traverse le trunk) mais **pas** `PC3` (VLAN 20)."
          ],
          topologie: {
            appareils: [
              { nom: "SW1", type: "switch", x: 30, y: 24 }, { nom: "SW2", type: "switch", x: 70, y: 24 },
              { nom: "PC1", type: "pc", x: 13, y: 76 }, { nom: "PC2", type: "pc", x: 57, y: 76 }, { nom: "PC3", type: "pc", x: 85, y: 76 }
            ],
            liens: [
              { de: "SW1", deIf: "g0/1", vers: "SW2", versIf: "g0/1" },
              { de: "PC1", deIf: "eth0", vers: "SW1", versIf: "f0/1" },
              { de: "PC2", deIf: "eth0", vers: "SW2", versIf: "f0/1" },
              { de: "PC3", deIf: "eth0", vers: "SW2", versIf: "f0/2" }
            ]
          },
          tests: [
            { de: "PC1", vers: "PC2", message: "PC1 joint PC2 via le trunk (VLAN 10)" },
            { de: "PC1", vers: "PC3", attendu: false, message: "PC1 n'atteint pas PC3 (VLAN 20)" }
          ],
          solution: {
            SW1: ["enable", "configure terminal", "vlan 10", "exit", "vlan 20", "exit",
              "interface f0/1", "switchport mode access", "switchport access vlan 10", "exit",
              "interface g0/1", "switchport mode trunk"],
            SW2: ["enable", "configure terminal", "vlan 10", "exit", "vlan 20", "exit",
              "interface f0/1", "switchport mode access", "switchport access vlan 10", "exit",
              "interface f0/2", "switchport mode access", "switchport access vlan 20", "exit",
              "interface g0/1", "switchport mode trunk"],
            PC1: ["ip 10.0.10.1 255.255.255.0"],
            PC2: ["ip 10.0.10.2 255.255.255.0"],
            PC3: ["ip 10.0.20.3 255.255.255.0"]
          }
        },

        /* --- 7. Router-on-a-stick --- */
        {
          type: "reseau",
          id: "res-intervlan",
          titre: "Faire communiquer deux VLAN",
          description: "Router entre VLAN avec une seule interface (router-on-a-stick).",
          cours: [
            "Pour router entre VLAN avec une seule interface physique, on crée une **sous-interface par VLAN** :",
            { legende: "Sous-interfaces", code: "interface g0/0\n no shutdown\nexit\ninterface g0/0.10\n encapsulation dot1q 10\n ip address 192.168.10.1 255.255.255.0\nexit\ninterface g0/0.20\n encapsulation dot1q 20\n ip address 192.168.20.1 255.255.255.0" },
            "Côté switch, le port vers le routeur doit être un **trunk**."
          ],
          intro: ["`PC1` est en VLAN 10, `PC2` en VLAN 20. `R1` est relié à `SW1` par `g0/0`. Faites communiquer les deux VLAN."],
          consigne: "Sur `SW1` : VLAN 10/20, ports d'accès, et `g0/1` en trunk vers `R1`. Sur `R1` : deux sous-interfaces (dot1q 10 et 20), passerelles des VLAN. Adressez les PC avec la bonne passerelle.",
          objectifs: [
            "`SW1` : `f0/1` VLAN 10, `f0/2` VLAN 20, `g0/1` trunk.",
            "`R1` : `g0/0` allumée ; `g0/0.10` dot1q 10 = 192.168.10.1/24 ; `g0/0.20` dot1q 20 = 192.168.20.1/24.",
            "`PC1` = 192.168.10.10/24 (passerelle .1) ; `PC2` = 192.168.20.10/24 (passerelle .1).",
            "`PC1` doit joindre `PC2` (routé par `R1`)."
          ],
          topologie: {
            appareils: [
              { nom: "R1", type: "routeur", x: 50, y: 16 }, { nom: "SW1", type: "switch", x: 50, y: 48 },
              { nom: "PC1", type: "pc", x: 24, y: 82 }, { nom: "PC2", type: "pc", x: 76, y: 82 }
            ],
            liens: [
              { de: "R1", deIf: "g0/0", vers: "SW1", versIf: "g0/1" },
              { de: "PC1", deIf: "eth0", vers: "SW1", versIf: "f0/1" },
              { de: "PC2", deIf: "eth0", vers: "SW1", versIf: "f0/2" }
            ]
          },
          tests: [
            { de: "PC1", vers: "192.168.10.1", message: "PC1 joint sa passerelle (VLAN 10)" },
            { de: "PC1", vers: "PC2", message: "PC1 joint PC2 (inter-VLAN via R1)" },
            { de: "PC2", vers: "PC1", message: "PC2 joint PC1 (retour)" }
          ],
          solution: {
            SW1: ["enable", "configure terminal", "vlan 10", "exit", "vlan 20", "exit",
              "interface f0/1", "switchport mode access", "switchport access vlan 10", "exit",
              "interface f0/2", "switchport mode access", "switchport access vlan 20", "exit",
              "interface g0/1", "switchport mode trunk"],
            R1: ["enable", "configure terminal",
              "interface g0/0", "no shutdown", "exit",
              "interface g0/0.10", "encapsulation dot1q 10", "ip address 192.168.10.1 255.255.255.0", "exit",
              "interface g0/0.20", "encapsulation dot1q 20", "ip address 192.168.20.1 255.255.255.0"],
            PC1: ["ip 192.168.10.10 255.255.255.0 192.168.10.1"],
            PC2: ["ip 192.168.20.10 255.255.255.0 192.168.20.1"]
          }
        }
      ]
    },

    /* =======================================================
       C) Mise en pratique
       ======================================================= */
    {
      id: "cfg-pratique",
      titre: "Configuration — Mise en pratique",
      description: "Construire soi-même la topologie, puis router à travers plusieurs sauts.",
      exercices: [

        /* --- 8. Construire la topologie --- */
        {
          type: "reseau",
          id: "res-construire",
          titre: "Construire un réseau de zéro",
          description: "Ajoutez les appareils, câblez-les, puis configurez-les.",
          cours: "La box est vide. Utilisez les boutons **+ Switch** et **+ PC** pour ajouter les appareils, puis **🔌 Relier** pour les câbler (cliquez deux appareils). Ouvrez enfin chaque appareil pour le configurer.",
          intro: ["À vous de tout monter : un petit LAN de deux postes autour d'un switch, dans le réseau **192.168.1.0/24**."],
          consigne: "Ajoutez **1 switch** et **2 PC**, reliez chaque PC au switch, puis donnez à `PC1` et `PC2` une adresse dans 192.168.1.0/24.",
          objectifs: [
            "Ajouter `SW1`, `PC1`, `PC2` et les relier (PC ↔ switch).",
            "`PC1` = 192.168.1.10/24, `PC2` = 192.168.1.20/24.",
            "`PC1` doit joindre `PC2` (même réseau, VLAN 1 par défaut)."
          ],
          topologie: { appareils: [], liens: [] },
          solutionTopologie: {
            appareils: [
              { nom: "SW1", type: "switch", x: 50, y: 24 },
              { nom: "PC1", type: "pc", x: 28, y: 74 }, { nom: "PC2", type: "pc", x: 72, y: 74 }
            ],
            liens: [
              { de: "PC1", deIf: "eth0", vers: "SW1", versIf: "f0/1" },
              { de: "PC2", deIf: "eth0", vers: "SW1", versIf: "f0/2" }
            ]
          },
          tests: [
            { de: "PC1", vers: "PC2", message: "PC1 joint PC2 (192.168.1.20)" }
          ],
          solution: {
            PC1: ["ip 192.168.1.10 255.255.255.0"],
            PC2: ["ip 192.168.1.20 255.255.255.0"]
          }
        },

        /* --- 9. Récapitulatif : trois routeurs --- */
        {
          type: "reseau",
          id: "res-transit",
          titre: "Traverser trois routeurs",
          description: "Un routeur de transit au milieu : les routes doivent connaître les deux LAN.",
          cours: "Le routeur du milieu ne possède aucun des deux LAN d'extrémité : il lui faut une route vers **chacun**. Chaque routeur route uniquement vers ce qu'il connaît : pensez au chemin aller ET retour.",
          intro: [
            "`PC1` (192.168.1.0/24) est derrière `R1`, `PC2` (192.168.3.0/24) derrière `R3`. `R2` est au milieu.",
            "Liens : `R1`-`R2` = 10.0.12.0/30, `R2`-`R3` = 10.0.23.0/30. Faites dialoguer les deux postes."
          ],
          consigne: "Adressez toutes les interfaces (voir objectifs) et posez les routes statiques nécessaires sur les trois routeurs.",
          objectifs: [
            "`R1` : `g0/0` 192.168.1.1/24, `g0/1` 10.0.12.1/30 ; route vers 192.168.3.0/24 via 10.0.12.2.",
            "`R2` : `g0/1` 10.0.12.2/30, `g0/2` 10.0.23.1/30 ; routes vers 192.168.1.0/24 (via 10.0.12.1) et 192.168.3.0/24 (via 10.0.23.2).",
            "`R3` : `g0/1` 10.0.23.2/30, `g0/0` 192.168.3.1/24 ; route vers 192.168.1.0/24 via 10.0.23.1.",
            "`PC1` = 192.168.1.10/24 (pass. .1) ; `PC2` = 192.168.3.10/24 (pass. .1).",
            "`PC1` doit joindre `PC2`."
          ],
          topologie: {
            appareils: [
              { nom: "PC1", type: "pc", x: 9, y: 64 }, { nom: "R1", type: "routeur", x: 29, y: 64 },
              { nom: "R2", type: "routeur", x: 50, y: 22 },
              { nom: "R3", type: "routeur", x: 71, y: 64 }, { nom: "PC2", type: "pc", x: 91, y: 64 }
            ],
            liens: [
              { de: "PC1", deIf: "eth0", vers: "R1", versIf: "g0/0" },
              { de: "R1", deIf: "g0/1", vers: "R2", versIf: "g0/1" },
              { de: "R2", deIf: "g0/2", vers: "R3", versIf: "g0/1" },
              { de: "R3", deIf: "g0/0", vers: "PC2", versIf: "eth0" }
            ]
          },
          tests: [
            { de: "PC1", vers: "PC2", message: "PC1 joint PC2 à travers R1-R2-R3" },
            { de: "PC2", vers: "PC1", message: "PC2 joint PC1 (retour)" }
          ],
          solution: {
            R1: ["enable", "configure terminal",
              "interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown", "exit",
              "interface g0/1", "ip address 10.0.12.1 255.255.255.252", "no shutdown", "exit",
              "ip route 192.168.3.0 255.255.255.0 10.0.12.2"],
            R2: ["enable", "configure terminal",
              "interface g0/1", "ip address 10.0.12.2 255.255.255.252", "no shutdown", "exit",
              "interface g0/2", "ip address 10.0.23.1 255.255.255.252", "no shutdown", "exit",
              "ip route 192.168.1.0 255.255.255.0 10.0.12.1",
              "ip route 192.168.3.0 255.255.255.0 10.0.23.2"],
            R3: ["enable", "configure terminal",
              "interface g0/1", "ip address 10.0.23.2 255.255.255.252", "no shutdown", "exit",
              "interface g0/0", "ip address 192.168.3.1 255.255.255.0", "no shutdown", "exit",
              "ip route 192.168.1.0 255.255.255.0 10.0.23.1"],
            PC1: ["ip 192.168.1.10 255.255.255.0 192.168.1.1"],
            PC2: ["ip 192.168.3.10 255.255.255.0 192.168.3.1"]
          }
        }
      ]
    }
  );
})();
