/* =============================================================
   Virtualisation et sécurité des conteneurs
   -------------------------------------------------------------
   Structure et exemples complets : voir data/cours/_modele.js
   ============================================================= */

CONTENU["virtualisation-conteneurs"] = {

  /* ---------------------------------------------------------
     GUIDES
     --------------------------------------------------------- */
  guides: [
    {
      id: "creer-conteneur",
      titre: "Créer et lancer son premier conteneur",
      resume: "De l'image au conteneur en marche : récupérer une image, lancer un service, l'observer, y entrer, puis construire sa propre image.",
      duree: "25 min",
      niveau: "Débutant",
      prealables: [
        "Docker installé et le service démarré (`docker version` doit répondre).",
        "Un terminal. Sous Linux, préfixez par `sudo` si votre utilisateur n'est pas dans le groupe `docker`.",
        "Une connexion réseau pour télécharger les images depuis le registre."
      ],
      sections: [
        {
          type: "notion",
          titre: "Image, conteneur, moteur : qui fait quoi",
          texte: "Trois objets à ne pas confondre. Le **moteur de conteneurs** (Docker, Podman, containerd…) s'appuie sur le noyau de l'OS hôte pour isoler les processus — il ne crée pas de machine virtuelle.",
          points: [
            "**Image** : un modèle en lecture seule contenant l'application, ses bibliothèques et ses dépendances. Immuable, identifiée par un nom et un tag (`nginx:1.27-alpine`).",
            "**Conteneur** : une instance en cours d'exécution d'une image, avec une fine couche inscriptible par-dessus. On peut en lancer dix à partir de la même image.",
            "**Registre** : le dépôt d'où proviennent les images (Docker Hub par défaut).",
            "L'isolation repose sur deux mécanismes du noyau : les **namespaces** (isolent processus, réseau, points de montage) et les **cgroups** (limitent CPU, RAM, entrées/sorties disque)."
          ],
          remarque: "Comme le noyau est partagé avec l'hôte, l'isolation est plus faible que celle d'une VM : c'est le point de départ de tout le volet sécurité du module."
        },
        {
          titre: "Vérifier que le moteur répond",
          texte: "Avant tout, confirmez que le client parle bien au démon.",
          code: "docker version\ndocker info",
          sortie: "Client: ...\nServer: Docker Engine - Community\n Version: 27.x.x",
          attention: "Si vous voyez `Cannot connect to the Docker daemon`, le service n'est pas démarré (`sudo systemctl start docker`) ou votre utilisateur n'a pas les droits."
        },
        {
          titre: "Récupérer une image",
          texte: "`docker pull` télécharge l'image depuis le registre et la stocke localement. Précisez toujours un tag : `latest` change dans le temps et rend vos déploiements non reproductibles.",
          code: "docker pull nginx:1.27-alpine\ndocker images",
          sortie: "REPOSITORY   TAG            IMAGE ID       SIZE\nnginx        1.27-alpine    a1b2c3d4e5f6   52.7MB",
          remarque: "Les variantes `alpine` sont bien plus légères : moins de paquets embarqués, donc moins de vulnérabilités potentielles."
        },
        {
          titre: "Lancer un conteneur éphémère",
          texte: "Premier essai : exécuter une commande dans un conteneur qui se supprime tout seul en sortant. `--rm` supprime le conteneur à l'arrêt, `-it` ouvre un terminal interactif.",
          code: "docker run --rm alpine echo \"Bonjour depuis le conteneur\"\ndocker run --rm -it alpine sh",
          sortie: "Bonjour depuis le conteneur",
          remarque: "Dans le shell interactif, essayez `ps aux` : vous ne voyez que les processus du conteneur. C'est le namespace PID à l'œuvre. Tapez `exit` pour sortir."
        },
        {
          titre: "Lancer un service en arrière-plan",
          texte: "Un serveur web doit tourner en continu et être joignable. `-d` détache le conteneur, `--name` lui donne un nom stable, `-p` publie un port de l'hôte vers un port du conteneur.",
          code: "docker run -d --name mon-nginx -p 8080:80 nginx:1.27-alpine",
          sortie: "e3f1c9a2b7d4...",
          remarque: "Ouvrez ensuite http://localhost:8080 dans un navigateur. Dans `-p 8080:80`, le premier nombre est le port de l'hôte, le second celui du conteneur."
        },
        {
          titre: "Observer ce qui tourne",
          texte: "Trois commandes suffisent au quotidien pour savoir ce qui s'exécute, ce que le conteneur raconte et ce qu'il consomme.",
          tableau: {
            entetes: ["Commande", "Rôle"],
            lignes: [
              ["`docker ps`", "Conteneurs en cours d'exécution (`-a` pour inclure les arrêtés)"],
              ["`docker logs -f mon-nginx`", "Suit la sortie du conteneur en direct"],
              ["`docker stats`", "Consommation CPU / RAM / réseau en temps réel"],
              ["`docker inspect mon-nginx`", "Configuration complète au format JSON"],
              ["`docker top mon-nginx`", "Processus tournant dans le conteneur"]
            ]
          },
          code: "docker ps\ndocker logs mon-nginx"
        },
        {
          titre: "Entrer dans un conteneur en marche",
          texte: "`docker exec` lance un processus supplémentaire dans un conteneur déjà démarré — c'est la bonne façon d'aller inspecter son contenu.",
          code: "docker exec -it mon-nginx sh\n# une fois à l'intérieur :\nls /usr/share/nginx/html\nexit",
          attention: "Ne modifiez jamais durablement un conteneur à la main : la couche inscriptible disparaît avec lui. Toute modification pérenne appartient à l'image ou à un volume."
        },
        {
          titre: "Conserver des données avec un volume",
          texte: "Le système de fichiers d'un conteneur est jetable. Pour qu'une donnée survive, montez un volume ou un dossier de l'hôte.",
          code: "# volume géré par Docker\ndocker volume create donnees-site\ndocker run -d --name site -p 8081:80 \\\n  -v donnees-site:/usr/share/nginx/html \\\n  nginx:1.27-alpine\n\n# ou un dossier de la machine hôte, en lecture seule\ndocker run -d --name site-ro -p 8082:80 \\\n  -v \"$PWD/public\":/usr/share/nginx/html:ro \\\n  nginx:1.27-alpine",
          remarque: "Le suffixe `:ro` monte le dossier en lecture seule : le conteneur ne peut pas écrire chez l'hôte."
        },
        {
          titre: "Arrêter, supprimer, nettoyer",
          texte: "Un conteneur arrêté existe toujours et occupe de la place tant qu'il n'est pas supprimé.",
          code: "docker stop mon-nginx\ndocker rm mon-nginx\ndocker rmi nginx:1.27-alpine\n\n# nettoyage global des ressources inutilisées\ndocker system prune",
          attention: "`docker system prune` supprime conteneurs arrêtés, réseaux inutilisés et images orphelines. Avec `-a`, il retire aussi toutes les images non utilisées : vérifiez avant de valider."
        },
        {
          titre: "Construire sa propre image",
          texte: "Un `Dockerfile` décrit la recette de l'image. Créez un dossier, placez-y ce fichier nommé exactement `Dockerfile`, puis lancez la construction.",
          legende: "Dockerfile",
          code: "FROM nginx:1.27-alpine\n\n# Copie du site dans l'image\nCOPY ./public /usr/share/nginx/html\n\n# Ne pas tourner en root\nUSER nginx\n\nEXPOSE 80",
          remarque: "Le point final de `docker build` désigne le contexte de construction, c'est-à-dire le dossier envoyé au démon."
        },
        {
          titre: "Construire puis lancer votre image",
          texte: "`-t` donne un nom et un tag à l'image produite. Numérotez vos versions plutôt que d'écraser `latest`.",
          code: "docker build -t mon-site:1.0 .\ndocker images | grep mon-site\ndocker run -d --name mon-site -p 8083:80 mon-site:1.0",
          sortie: "Successfully tagged mon-site:1.0"
        },
        {
          type: "notion",
          titre: "Cinq réflexes de sécurité dès le premier conteneur",
          texte: "Ces réflexes ne coûtent rien à la création et évitent l'essentiel des mauvaises surprises étudiées dans la suite du module.",
          points: [
            "Partir d'une **image officielle** et d'un **tag précis**, jamais de `latest` en production.",
            "Ne pas exécuter en root : `USER` dans le Dockerfile, ou `--user 1000:1000` au lancement.",
            "**Limiter les ressources** via les cgroups : `--memory 256m --cpus 0.5` empêche un conteneur d'affamer l'hôte.",
            "Rendre le système de fichiers immuable quand c'est possible : `--read-only`, plus un volume pour les rares dossiers inscriptibles.",
            "Retirer les privilèges superflus : `--cap-drop ALL` puis rajouter uniquement ce qui est nécessaire. Ne jamais utiliser `--privileged` par confort."
          ],
          code: "docker run -d --name durci -p 8084:80 \\\n  --user 101:101 \\\n  --read-only \\\n  --cap-drop ALL \\\n  --memory 256m --cpus 0.5 \\\n  --security-opt no-new-privileges \\\n  nginx:1.27-alpine",
          attention: "`--privileged` donne au conteneur un accès quasi total à l'hôte et supprime l'essentiel de l'isolation. C'est la porte d'entrée classique d'une évasion de conteneur."
        }
      ]
    }
  ],

  /* ---------------------------------------------------------
     CHAPITRES ET EXERCICES
     --------------------------------------------------------- */
  chapitres: [
    {
      id: "ch1",
      titre: "Chapitre 1 — Introduction à la virtualisation et à la conteneurisation",
      description: "Hyperviseurs, machines virtuelles, conteneurs, isolation et panorama des technologies.",
      exercices: [
        {
          type: "qcm",
          id: "ch1-qcm",
          titre: "QCM — Révision du cours 1",
          description: "14 questions sur les notions clés du premier cours.",
          questions: [
            {
              enonce: "Que permet la virtualisation ?",
              choix: [
                "Exécuter plusieurs applications dans un même processus",
                "Créer plusieurs machines virtuelles sur un seul serveur physique",
                "Répartir un système d'exploitation sur plusieurs serveurs",
                "Remplacer le noyau de l'OS hôte au démarrage"
              ],
              reponse: 1,
              explication: "Chaque VM fonctionne comme un ordinateur indépendant, avec son propre OS, ses applications et ses ressources (CPU, RAM, stockage)."
            },
            {
              enonce: "Qu'est-ce qu'un hyperviseur ?",
              choix: [
                "Le moniteur de machine virtuelle, cœur de la virtualisation",
                "Un orchestrateur de conteneurs",
                "Le noyau partagé entre les conteneurs",
                "Un registre d'images système"
              ],
              reponse: 0,
              explication: "L'hyperviseur est le moniteur de machine virtuelle : c'est lui qui crée et gère les VM."
            },
            {
              enonce: "Quelle est la caractéristique d'un hyperviseur de type 1 ?",
              choix: [
                "Il s'exécute comme une application sur un OS hôte",
                "Il s'installe directement sur le matériel physique, sans OS intermédiaire",
                "Il ne gère qu'une seule machine virtuelle à la fois",
                "Il nécessite obligatoirement un orchestrateur"
              ],
              reponse: 1,
              explication: "Type 1 dit « bare-metal » : installé directement sur le matériel. Type 2 dit « hosted » : exécuté comme une application sur un OS hôte."
            },
            {
              enonce: "Dans quel contexte utilise-t-on plutôt un hyperviseur de type 2 ?",
              choix: [
                "Les datacenters d'entreprise avec clustering",
                "Un utilisateur individuel exécutant plusieurs OS sur son ordinateur personnel",
                "Les fermes de conteneurs à grande échelle",
                "Les systèmes embarqués sans système d'exploitation"
              ],
              reponse: 1,
              explication: "Le type 1 vise les environnements serveur et ajoute la notion de clustering ; le type 2 vise le poste personnel."
            },
            {
              enonce: "Quels hyperviseurs sont de type 1 (bare-metal) ?",
              choix: ["VMware ESXi", "VirtualBox", "Proxmox", "VMware Workstation"],
              reponse: [0, 2],
              explication: "ESXi, Hyper-V, Proxmox, KVM, Xen et Nutanix sont de type 1. VirtualBox, VMware Workstation et Parallels sont de type 2."
            },
            {
              enonce: "À quoi sert la fonctionnalité de migration à chaud d'un hyperviseur ?",
              choix: [
                "Sauvegarder l'état d'une VM à un instant donné",
                "Déplacer une VM d'un serveur physique à un autre sans interruption",
                "Convertir une VM en conteneur",
                "Augmenter la RAM d'une VM en cours d'exécution"
              ],
              reponse: 1,
              explication: "Les snapshots, eux, servent à sauvegarder puis restaurer l'état d'une VM à un instant donné."
            },
            {
              enonce: "En quoi consiste la conteneurisation ?",
              choix: [
                "Regrouper le code avec uniquement les bibliothèques et dépendances nécessaires en un exécutable léger",
                "Installer un OS complet par application",
                "Émuler le matériel physique pour chaque application",
                "Chiffrer l'application avant son déploiement"
              ],
              reponse: 0,
              explication: "Le conteneur est autonome et portable : il s'exécute de manière cohérente sur n'importe quelle infrastructure."
            },
            {
              enonce: "Quels sont les objectifs principaux de la conteneurisation ?",
              choix: [
                "Isoler les applications pour éviter les conflits",
                "Garantir la portabilité entre environnements",
                "Fournir à chaque application son propre noyau",
                "Optimiser les ressources en évitant la surcharge d'un OS complet"
              ],
              reponse: [0, 1, 3],
              explication: "Les conteneurs partagent au contraire le noyau de l'OS hôte : ils n'ont pas leur propre noyau."
            },
            {
              enonce: "À quel niveau se situe l'isolation d'un conteneur ?",
              choix: [
                "Au niveau matériel, avec un OS complet",
                "Au niveau du système d'exploitation, avec partage du noyau",
                "Au niveau de l'application uniquement",
                "Au niveau du réseau uniquement"
              ],
              reponse: 1,
              explication: "D'où une isolation réduite par rapport à une VM et un risque de fuite via le noyau partagé."
            },
            {
              enonce: "Quel mécanisme du noyau limite l'utilisation des ressources (CPU, RAM, lecture/écriture disque) ?",
              choix: ["Les namespaces", "Les cgroups", "L'hyperviseur", "Les snapshots"],
              reponse: 1,
              explication: "Les cgroups limitent les ressources ; les namespaces isolent les processus, le réseau, etc."
            },
            {
              enonce: "Quelle affirmation décrit correctement une machine virtuelle face à un conteneur ?",
              choix: [
                "Elle est plus légère et démarre plus vite",
                "Elle partage le noyau de l'OS hôte",
                "Elle offre une isolation totale mais nécessite un OS complet et des ressources dédiées",
                "Elle s'exécute à l'identique quel que soit l'hyperviseur"
              ],
              reponse: 2,
              explication: "La VM offre une isolation totale, idéale pour la sécurité et la compatibilité multi-OS, au prix d'un démarrage plus lent et de ressources dédiées."
            },
            {
              enonce: "À quoi sert un orchestrateur ?",
              choix: [
                "À isoler les processus d'un conteneur",
                "À automatiser, gérer et optimiser le déploiement, la mise à l'échelle et l'exploitation d'applications conteneurisées",
                "À convertir des images en machines virtuelles",
                "À remplacer l'hyperviseur dans un datacenter"
              ],
              reponse: 1,
              explication: "Il devient indispensable dans les environnements complexes ou à grande échelle."
            },
            {
              enonce: "Quelles fonctionnalités attend-on d'un orchestrateur ?",
              choix: [
                "Mise à l'échelle (scaling)",
                "Équilibrage de charge et disponibilité",
                "Gestion des configurations et des secrets",
                "Installation de l'hyperviseur sur le matériel"
              ],
              reponse: [0, 1, 2],
              explication: "S'y ajoutent le redémarrage automatique, la gestion des réseaux et du stockage, la surveillance et le multi-cloud."
            },
            {
              enonce: "Parmi ces technologies, lesquelles sont des orchestrateurs ?",
              choix: ["Kubernetes", "Podman", "Docker Swarm", "buildah"],
              reponse: [0, 2],
              explication: "Kubernetes, Docker Swarm, Nomad, OpenShift, Rancher et Portainer orchestrent. Docker, Podman, LXC, buildah et containerd sont des moteurs de conteneurs."
            }
          ]
        }
      ]
    }
  ]
};
