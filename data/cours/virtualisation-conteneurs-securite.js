/* =============================================================
   Virtualisation et sécurité des conteneurs — Sécurité et pratique
   -------------------------------------------------------------
   Ce fichier COMPLÈTE le cours déjà déclaré dans
   data/cours/virtualisation-conteneurs.js : il ajoute des guides
   (aide-mémoire de commandes, failles pas à pas) et des chapitres
   d'exercices « terminal » simulés, en anglais, de difficulté
   croissante. Il doit être chargé APRÈS le fichier de base.

   Convention « Où suis-je dans l'arbre ? » (invite du shell) :
     analyst@debian:~$   → hôte (VM Debian), utilisateur normal
     root@debian:~#      → hôte, root
     root@<id>:/#        → À L'INTÉRIEUR d'un conteneur (id court)
     www-data@dvwa:/$    → dans un POD (le conteneur du pod)
     (kubectl …)         → tapé depuis l'hôte, PARLE au control-plane
   Chaque exercice « terminal » affiche en direct le champ `lieu`
   et change l'invite quand vous « entrez » dans un conteneur / pod.
   ============================================================= */

(function () {
  "use strict";
  const C = CONTENU["virtualisation-conteneurs"];
  if (!C) { console.warn("virtualisation-conteneurs non déclaré : chargez le fichier de base avant celui-ci."); return; }
  C.guides = C.guides || [];
  C.chapitres = C.chapitres || [];

  /* =========================================================
     GUIDE G2 — Aide-mémoire : se repérer et piloter
     ========================================================= */
  C.guides.push({
    id: "aide-memoire-commandes",
    titre: "Aide-mémoire : se repérer, piloter Docker et Kubernetes",
    resume: "Où suis-je dans l'arbre (hôte, conteneur, pod, control-plane) et quelle commande pour quoi : tableaux Docker, docker compose et kubectl avec l'explication de chaque commande.",
    duree: "20 min",
    niveau: "Débutant",
    prealables: [
      "Avoir lu le guide « Créer et lancer son premier conteneur ».",
      "Docker installé ; pour la partie Kubernetes, un cluster K3S (voir TP2) avec `kubectl` configuré."
    ],
    sections: [
      {
        type: "notion",
        titre: "Où suis-je ? Lire l'invite du shell",
        texte: "Avant de taper une commande, la première question de sécurité est **« où suis-je ? »**. L'invite (le début de ligne avant le curseur) vous le dit. Se tromper de niveau, c'est croire agir dans un conteneur alors qu'on est sur l'hôte — ou l'inverse.",
        points: [
          "`analyst@debian:~$` — vous êtes sur l'**hôte** (la VM Debian), en utilisateur normal. Le `$` final = pas root.",
          "`root@debian:~#` — toujours l'**hôte**, mais en **root**. Le `#` final = root. Ici vous pilotez tous les conteneurs.",
          "`root@3f9a2b:/#` — vous êtes **à l'intérieur d'un conteneur** : l'identifiant court (`3f9a2b`) a remplacé le nom d'hôte. Ce que vous cassez ici reste, en principe, dans le conteneur.",
          "`www-data@dvwa-7d9f:/$` — vous êtes dans un **pod** Kubernetes (le conteneur du pod), sous un utilisateur applicatif non-root.",
          "Une commande `kubectl …` se tape **depuis l'hôte** mais s'adresse au **control-plane** (le cerveau du cluster) : vous ne « déplacez » pas votre shell, vous envoyez un ordre à distance."
        ],
        remarque: "Repère mental de l'arbre : Hôte physique → moteur (Docker) → conteneurs. En Kubernetes : control-plane (kube-apiserver, etcd, scheduler) → nœuds workers → pods → conteneurs."
      },
      {
        type: "notion",
        titre: "Changer de niveau : les commandes qui vous déplacent",
        texte: "Trois commandes font passer d'un niveau de l'arbre à un autre. Retenez ce qu'elles changent à votre invite.",
        points: [
          "`docker exec -it <conteneur> bash` — depuis l'hôte, **entre** dans un conteneur en marche. L'invite devient `root@<id>:/#`. `exit` vous **ramène** sur l'hôte.",
          "`kubectl exec -it <pod> -- bash` — depuis l'hôte, **entre** dans le conteneur d'un pod. L'invite devient celle du pod.",
          "`ssh user@serveur` — change carrément de machine (hôte → autre hôte).",
          "Sortir : `exit` (ou Ctrl-D) remonte d'un cran vers là d'où vous veniez."
        ]
      },
      {
        titre: "Docker — images et cycle de vie",
        texte: "Le socle du quotidien : récupérer une image, lancer, observer, entrer, nettoyer. Toutes ces commandes se tapent **depuis l'hôte**.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`docker pull nginx:1.27-alpine`", "Télécharge une image depuis le registre (précisez toujours un tag)"],
            ["`docker images`", "Liste les images présentes localement"],
            ["`docker run -d --name web -p 8080:80 nginx`", "Crée et démarre un conteneur détaché, publie le port 80→8080"],
            ["`docker run --rm -it alpine sh`", "Conteneur jetable interactif ; `--rm` le supprime en sortant"],
            ["`docker ps`", "Conteneurs en cours (`-a` inclut les arrêtés)"],
            ["`docker logs -f web`", "Affiche/suit la sortie du conteneur"],
            ["`docker exec -it web bash`", "Ouvre un shell DANS le conteneur (vous changez de niveau)"],
            ["`docker stop web` / `docker rm web`", "Arrête / supprime le conteneur"],
            ["`docker build -t mon-site:1.0 .`", "Construit une image à partir du `Dockerfile` du dossier courant"]
          ]
        },
        remarque: "`-p hôte:conteneur` : le premier nombre est le port ouvert sur l'hôte, le second celui écouté dans le conteneur."
      },
      {
        titre: "Docker — inspecter et enquêter",
        texte: "En sécurité, avant d'agir on observe. Ces commandes révèlent comment un conteneur est configuré — et donc s'il est dangereux.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle révèle"],
          lignes: [
            ["`docker inspect web`", "Toute la configuration en JSON : montages, privilèges, réseau, variables"],
            ["`docker inspect -f '{{.HostConfig.Privileged}}' web`", "Répond `true`/`false` : le conteneur est-il privilégié ?"],
            ["`docker inspect -f '{{.Mounts}}' web`", "Liste les volumes montés (repère un `/:/host` dangereux)"],
            ["`docker history --no-trunc img`", "Reconstitue les couches / commandes ayant bâti l'image"],
            ["`docker diff web`", "Fichiers ajoutés/modifiés/supprimés depuis le lancement"],
            ["`docker top web`", "Processus tournant dans le conteneur"],
            ["`docker stats`", "Consommation CPU/RAM/réseau en direct (repère un cryptominer)"]
          ]
        },
        attention: "Deux signaux d'alerte à chercher en priorité dans `docker inspect` : `\"Privileged\": true` et un montage de `/` ou `/var/run/docker.sock`. Ce sont les deux évasions les plus classiques (voir les failles pas à pas)."
      },
      {
        titre: "Docker — durcir au lancement",
        texte: "Les options qui réduisent la surface d'attaque, à connaître pour la partie défense.",
        tableau: {
          entetes: ["Option de `docker run`", "Effet de sécurité"],
          lignes: [
            ["`--user 1000:1000`", "Tourne sous un utilisateur non-root"],
            ["`--read-only`", "Système de fichiers du conteneur en lecture seule"],
            ["`--cap-drop ALL --cap-add NET_BIND_SERVICE`", "Retire toutes les capabilities, ne rajoute que le strict nécessaire"],
            ["`--security-opt no-new-privileges`", "Interdit tout gain de privilège (ex. via un binaire SUID)"],
            ["`--memory 256m --cpus 0.5`", "Limite les ressources (cgroups) : évite l'épuisement de l'hôte"],
            ["`--pids-limit 100`", "Plafonne le nombre de processus (anti fork-bomb)"],
            ["`-v données:/data:ro`", "Monte un volume précis en lecture seule, plutôt que `/`"]
          ]
        },
        remarque: "À l'inverse, `--privileged`, `-v /:/host` et `-v /var/run/docker.sock:/…` sont à bannir sauf besoin explicite et maîtrisé."
      },
      {
        titre: "Kubernetes — observer le cluster (depuis l'hôte)",
        texte: "`kubectl` parle au **control-plane**. On lit d'abord, on agit ensuite. `-n <namespace>` cible un espace ; `-A` = tous les namespaces.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`kubectl get nodes`", "Liste les nœuds (workers + control-plane)"],
            ["`kubectl get pods -n dvwa-lab`", "Liste les pods d'un namespace"],
            ["`kubectl get all -A`", "Toutes les ressources, tous namespaces"],
            ["`kubectl describe pod <pod> -n ns`", "Détail d'un pod : image, montages, événements"],
            ["`kubectl logs <pod> -n ns`", "Journaux du conteneur d'un pod"],
            ["`kubectl exec -it <pod> -n ns -- bash`", "Ouvre un shell DANS le pod (changement de niveau)"],
            ["`kubectl get sa,role,rolebinding -n ns`", "Comptes de service et droits RBAC du namespace"],
            ["`kubectl auth can-i --list`", "Ce que le compte courant a le droit de faire"]
          ]
        },
        remarque: "`kubectl describe` et `kubectl auth can-i` sont vos meilleurs outils d'audit : ils montrent respectivement la configuration réelle et les droits effectifs."
      },
      {
        titre: "Kubernetes — déployer une application",
        texte: "On décrit l'état souhaité dans un manifeste YAML, puis `kubectl apply` le réalise. `helm` et `kustomize` industrialisent cela (voir TP2).",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`kubectl apply -f app.yaml`", "Crée/met à jour les ressources décrites dans le fichier"],
            ["`kubectl apply --dry-run=client -f app.yaml`", "Teste le manifeste sans rien appliquer"],
            ["`kubectl delete -f app.yaml`", "Supprime les ressources du fichier"],
            ["`kubectl scale deploy/web --replicas=5 -n ns`", "Ajuste le nombre de réplicas"],
            ["`kubectl apply -k overlays/prod`", "Applique un overlay Kustomize"],
            ["`helm repo add bitnami https://charts.bitnami.com/bitnami`", "Ajoute un dépôt de charts Helm"],
            ["`helm install web bitnami/nginx -n ns`", "Installe une application packagée (chart)"],
            ["`helm upgrade web bitnami/nginx -n ns -f values.yaml`", "Met à jour une release avec de nouvelles valeurs"]
          ]
        },
        attention: "Un `Deployment` recrée automatiquement un pod supprimé (boucle de réconciliation) : pour arrêter réellement une application, supprimez le Deployment, pas le pod."
      }
    ]
  });

  /* =========================================================
     GUIDE G3 — Faille pas à pas : le conteneur privilégié
     ========================================================= */
  C.guides.push({
    id: "faille-conteneur-privilegie",
    titre: "Faille pas à pas — Le conteneur privilégié",
    resume: "Comprendre pourquoi `--privileged` et `-v /:/host` cassent l'isolation, dérouler l'évasion vers l'hôte (défensivement), puis corriger. Décomposé étape par étape en repérant où l'on se trouve dans l'arbre.",
    duree: "25 min",
    niveau: "Intermédiaire",
    badge: "Faille pas à pas",
    prealables: [
      "Avoir lu l'aide-mémoire des commandes.",
      "Contexte pédagogique : ces manipulations se font dans un environnement d'entraînement isolé (CTF de cours), jamais sur un système tiers."
    ],
    sections: [
      {
        type: "notion",
        titre: "Le principe : une isolation logique, pas matérielle",
        texte: "Un conteneur partage le **noyau** de l'hôte. Son isolation vient uniquement des namespaces et cgroups posés par le moteur. `--privileged` **retire** ces garde-fous : le conteneur récupère toutes les capabilities et l'accès aux périphériques de l'hôte. Ajoutez un montage de `/` et l'hôte est, littéralement, dans le conteneur.",
        points: [
          "**`--privileged`** : toutes les capabilities Linux + accès aux `/dev/*` de l'hôte (dont les disques).",
          "**`-v /:/host`** : le système de fichiers entier de l'hôte est monté dans le conteneur, sous `/host`.",
          "Combinés, ils transforment un simple accès conteneur en **contrôle total de l'hôte** — et donc de tous les autres conteneurs."
        ],
        remarque: "C'est le challenge 1 du TP4. On le déroule ici pour comprendre chaque étape, pas pour la performance."
      },
      {
        titre: "Étape 0 — Se repérer : je suis sur l'hôte",
        texte: "Invite `analyst@debian:~$` : vous êtes sur la **VM hôte**, utilisateur normal. Vous voyez le conteneur, mais vous n'êtes pas encore dedans. On commence toujours par observer.",
        code: "docker ps",
        sortie: "CONTAINER ID   IMAGE                  NAMES\n3f9a2b7c1d0e   ctf-ch1-privileged     ctf-ch1-privileged",
        remarque: "Un seul conteneur suspect. On va d'abord confirmer POURQUOI il est dangereux avant d'y toucher."
      },
      {
        titre: "Étape 1 — Confirmer la mauvaise configuration",
        texte: "Toujours sur l'hôte. On interroge la configuration réelle du conteneur. Deux drapeaux rouges à vérifier : est-il privilégié, et que monte-t-il ?",
        code: "docker inspect -f '{{.HostConfig.Privileged}}' ctf-ch1-privileged\ndocker inspect -f '{{.Mounts}}' ctf-ch1-privileged",
        sortie: "true\n[{bind  /  /host   true }]",
        attention: "`true` + un montage de `/` vers `/host` : le diagnostic est posé. Sur un vrai audit, ce constat suffit à classer le conteneur en critique, avant même toute exploitation."
      },
      {
        titre: "Étape 2 — Entrer dans le conteneur (changement de niveau)",
        texte: "On passe de l'hôte à l'intérieur du conteneur avec `docker exec`. **Regardez l'invite changer** : `analyst@debian:~$` devient `root@3f9a2b:/#`. Vous n'êtes plus sur l'hôte, vous êtes dans le conteneur — et vous y êtes root.",
        code: "docker exec -it ctf-ch1-privileged /bin/bash\n# l'invite devient :\n# root@3f9a2b:/#",
        remarque: "Rien n'est encore « cassé » : être root DANS un conteneur est normal. Le danger vient de ce que ce conteneur a le droit de toucher."
      },
      {
        titre: "Étape 3 — Atteindre le disque de l'hôte",
        texte: "Vous êtes maintenant dans le conteneur (`root@3f9a2b:/#`). Le système de fichiers de l'hôte est monté sous `/host`. Lire un fichier normalement inaccessible depuis un conteneur prouve l'évasion.",
        code: "ls /host\ncat /host/root/ctf_flags/flag1_root_escape.txt",
        sortie: "bin  boot  etc  home  root  var  ...\nFLAG{privileged_container_equals_host_root}",
        attention: "Depuis un conteneur, vous venez de lire `/root` de l'HÔTE. En écriture, vous pourriez ajouter une clé SSH root, modifier `/etc/shadow`, installer un service. L'hôte est compromis, donc tous ses conteneurs aussi."
      },
      {
        titre: "Étape 4 — Revenir sur l'hôte",
        texte: "`exit` referme le shell du conteneur et vous ramène sur l'hôte : l'invite redevient `analyst@debian:~$`. Toujours savoir remonter l'arbre.",
        code: "exit\n# de retour : analyst@debian:~$"
      },
      {
        type: "notion",
        titre: "Corriger : remédiation et bonnes pratiques",
        texte: "La faille n'est pas un bug de Docker : c'est une **configuration** dangereuse. On la corrige à la source.",
        points: [
          "Ne **jamais** utiliser `--privileged` par confort. Si un besoin précis existe (accès à un périphérique), ajouter uniquement la capability nécessaire : `--cap-drop ALL --cap-add <CAP>`.",
          "Ne **jamais** monter `/` ni un dossier système. Monter seulement le sous-dossier utile, en lecture seule : `-v /srv/data:/data:ro`.",
          "Ajouter `--security-opt no-new-privileges` et `--read-only`.",
          "Tourner en non-root (`--user`), même dans le conteneur.",
          "En Kubernetes, interdire ces pratiques au niveau du cluster (Pod Security Admission niveau *restricted*, ou une policy Kyverno/Gatekeeper qui refuse `privileged` et les `hostPath` sensibles)."
        ],
        code: "# version durcie du même service\ndocker run -d --name app \\\n  --user 1000:1000 \\\n  --read-only \\\n  --cap-drop ALL \\\n  --security-opt no-new-privileges \\\n  -v /srv/data:/data:ro \\\n  nginx:1.27-alpine",
        remarque: "Règle à retenir : un conteneur ne devrait avoir que ce dont son application a strictement besoin — c'est le principe de moindre privilège appliqué à la conteneurisation."
      }
    ]
  });

  /* =========================================================
     CHAPITRE — Manipuler et évaluer un conteneur (Docker)
     3 exercices « terminal », difficulté croissante.
     ========================================================= */
  C.chapitres.push({
    id: "ch-docker-pratique",
    titre: "Chapitre 2 — Manipuler et évaluer un conteneur (Docker)",
    description: "Trois terminaux simulés, du plus simple au plus avancé, autour du conteneur privilégié : reconnaissance, évasion façon TP, puis évasion sans volume pré-monté.",
    exercices: [

      /* ---- Niveau 1 : plus facile que le TP (recon + entrer) ---- */
      {
        type: "terminal",
        id: "term-docker-recon",
        titre: "Niveau 1 — Reconnaissance d'un conteneur suspect",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "On n'attaque jamais sans observer. Avant de toucher un conteneur, on liste ce qui tourne, on lit sa configuration, puis on y entre. Objectif : se repérer dans l'arbre et lire une configuration Docker.",
        exemple: {
          legende: "Lire un champ précis de la configuration",
          code: "docker inspect -f '{{.HostConfig.Privileged}}' <conteneur>"
        },
        intro: [
          "You are logged on the host VM as the low-privilege user `analyst`.",
          "A container is running on this machine. Your job here is only to observe it: list it, read its configuration, then step inside. No escape yet."
        ],
        accueil: "Recon lab — type 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Lister les conteneurs **en cours d'exécution** sur l'hôte.",
            indice: "La commande de base pour voir ce qui tourne.",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+ps"],
            interdire: ["-a\\b"],
            solution: "docker ps",
            sortie: "CONTAINER ID   IMAGE                NAMES\n3f9a2b7c1d0e   ctf-ch1-privileged   ctf-ch1-privileged"
          },
          {
            enonce: "Afficher si le conteneur `ctf-ch1-privileged` est **privilégié** (champ `.HostConfig.Privileged`).",
            indice: "docker inspect -f '{{.HostConfig.Privileged}}' <nom>",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+inspect", "privileged", "ctf-ch1"],
            solution: "docker inspect -f '{{.HostConfig.Privileged}}' ctf-ch1-privileged",
            sortie: "true"
          },
          {
            enonce: "Lister les **montages** du conteneur pour repérer un éventuel `/:/host`.",
            indice: "Même commande, mais le champ '{{.Mounts}}'.",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+inspect", "mounts", "ctf-ch1"],
            solution: "docker inspect -f '{{.Mounts}}' ctf-ch1-privileged",
            sortie: "[{bind  /  /host  true }]"
          },
          {
            enonce: "**Entrer** dans le conteneur avec un shell interactif (vous changez de niveau).",
            indice: "docker exec -it <nom> /bin/bash",
            lieu: "Hôte → on entre dans le conteneur",
            invite: "root@3f9a2b:/#",
            motifs: ["^docker\\s+exec", "-it", "ctf-ch1", "(bash|sh)"],
            solution: "docker exec -it ctf-ch1-privileged /bin/bash",
            sortie: "root@3f9a2b:/#"
          },
          {
            enonce: "Confirmer que vous êtes **root à l'intérieur** du conteneur.",
            indice: "Une commande de trois lettres affiche l'utilisateur courant.",
            lieu: "Intérieur du conteneur ctf-ch1 (root)",
            motifs: ["^id\\b"],
            solution: "id",
            sortie: "uid=0(root) gid=0(root) groups=0(root)"
          }
        ]
      },

      /* ---- Niveau 2 : équivalent TP4 challenge 1 (évasion) ---- */
      {
        type: "terminal",
        id: "term-docker-privesc",
        titre: "Niveau 2 — Évasion d'un conteneur privilégié (niveau TP)",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "Un conteneur `--privileged` avec `-v /:/host` monte tout l'hôte sous `/host`. Depuis l'intérieur, lire un fichier de l'hôte prouve l'évasion. C'est le challenge 1 du TP4.",
        exemple: {
          legende: "Le système de fichiers de l'hôte est sous /host",
          code: "cat /host/etc/hostname   # depuis l'intérieur du conteneur"
        },
        intro: [
          "Same host, same container `ctf-ch1-privileged` (privileged, with `/` mounted at `/host`).",
          "Goal: step inside and read a flag that lives on the HOST filesystem, proving a full container-to-host escape."
        ],
        accueil: "Escape lab — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Depuis l'hôte, confirmer une dernière fois le montage dangereux du conteneur.",
            indice: "docker inspect avec le champ '{{.Mounts}}'.",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+inspect", "ctf-ch1"],
            solution: "docker inspect -f '{{.Mounts}}' ctf-ch1-privileged",
            sortie: "[{bind  /  /host  true }]"
          },
          {
            enonce: "Entrer dans le conteneur avec un shell interactif.",
            indice: "docker exec -it <nom> /bin/bash",
            lieu: "Hôte → intérieur du conteneur",
            invite: "root@3f9a2b:/#",
            motifs: ["^docker\\s+exec", "-it", "ctf-ch1", "(bash|sh)"],
            solution: "docker exec -it ctf-ch1-privileged /bin/bash",
            sortie: "root@3f9a2b:/#"
          },
          {
            enonce: "Vérifier que le système de fichiers de l'hôte est bien monté sous `/host`.",
            indice: "Listez simplement le contenu de /host.",
            lieu: "Intérieur du conteneur ctf-ch1 (root)",
            motifs: ["^ls\\s+/host"],
            solution: "ls /host",
            sortie: "bin  boot  dev  etc  home  root  sbin  usr  var"
          },
          {
            enonce: "Lire le flag situé sur l'HÔTE : `/root/ctf_flags/flag1_root_escape.txt` (via `/host`).",
            indice: "cat /host/root/ctf_flags/flag1_root_escape.txt",
            lieu: "Conteneur ctf-ch1 → lecture du disque de l'hôte",
            motifs: ["^cat\\s", "/host/root", "flag1"],
            solution: "cat /host/root/ctf_flags/flag1_root_escape.txt",
            sortie: "FLAG{privileged_container_equals_host_root}"
          },
          {
            enonce: "Revenir sur l'hôte (remonter d'un niveau dans l'arbre).",
            indice: "Une commande de quatre lettres ferme le shell du conteneur.",
            lieu: "Conteneur → retour à l'hôte",
            invite: "analyst@debian:~$",
            motifs: ["^exit\\b"],
            solution: "exit",
            sortie: "analyst@debian:~$"
          }
        ]
      },

      /* ---- Niveau 3 : plus dur que le TP (monter le disque soi-même) ---- */
      {
        type: "terminal",
        id: "term-docker-privesc-avance",
        titre: "Niveau 3 — Évasion sans volume pré-monté (avancé)",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "Cette fois le conteneur est privilégié mais NE monte PAS `/`. `--privileged` donne malgré tout l'accès aux périphériques de l'hôte : on peut donc monter soi-même le disque de l'hôte depuis l'intérieur. C'est l'évasion « classique » et elle est plus exigeante.",
        exemple: {
          legende: "Monter un disque de l'hôte depuis un conteneur privilégié",
          code: "lsblk                 # trouver le disque de l'hôte\nmount /dev/sda1 /mnt  # le monter dans le conteneur"
        },
        intro: [
          "A privileged container `ctf-ch2-priv` is running, but this time WITHOUT any `-v /:/host` mount.",
          "Because `--privileged` still exposes the host block devices, you will mount the host disk yourself from inside the container, then read the flag. Harder than the TP: no ready-made /host."
        ],
        accueil: "Advanced escape lab — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Entrer dans le conteneur privilégié `ctf-ch2-priv`.",
            indice: "docker exec -it <nom> /bin/bash",
            lieu: "Hôte → intérieur du conteneur",
            invite: "root@c2a1f4:/#",
            motifs: ["^docker\\s+exec", "-it", "ctf-ch2", "(bash|sh)"],
            solution: "docker exec -it ctf-ch2-priv /bin/bash",
            sortie: "root@c2a1f4:/#"
          },
          {
            enonce: "Confirmer que vous disposez bien de capabilities étendues (conteneur privilégié).",
            indice: "capsh --print   (ou lire /proc/self/status)",
            lieu: "Intérieur du conteneur ctf-ch2 (root, privilégié)",
            motifs: ["^capsh", "--print"],
            solution: "capsh --print",
            sortie: "Current: =ep\nBounding set =cap_chown,cap_dac_override,...,cap_sys_admin,...\n(=ep + cap_sys_admin : conteneur privilégié)"
          },
          {
            enonce: "Vérifier qu'aucun montage de l'hôte n'est présent : `/host` ne doit **pas** exister.",
            indice: "Listez la racine et constatez l'absence de /host.",
            lieu: "Intérieur du conteneur ctf-ch2 (root)",
            motifs: ["^ls\\s+/$"],
            solution: "ls /",
            sortie: "bin  dev  etc  home  proc  root  sys  tmp  usr  var\n(pas de /host : rien n'est pré-monté)"
          },
          {
            enonce: "Repérer le **disque de l'hôte** exposé comme périphérique bloc.",
            indice: "lsblk liste les périphériques bloc visibles.",
            lieu: "Intérieur du conteneur ctf-ch2 (root)",
            motifs: ["^lsblk\\b"],
            solution: "lsblk",
            sortie: "NAME   SIZE TYPE MOUNTPOINT\nsda     40G disk\n└─sda1  40G part\n(sda1 = disque racine de l'hôte, non monté ici)"
          },
          {
            enonce: "**Monter** la partition racine de l'hôte (`/dev/sda1`) dans `/mnt`.",
            indice: "mount /dev/sda1 /mnt",
            lieu: "Conteneur ctf-ch2 → on monte le disque de l'hôte",
            motifs: ["^mount\\s", "/dev/sda1", "/mnt"],
            solution: "mount /dev/sda1 /mnt",
            sortie: "[  OK  ] /dev/sda1 monté sur /mnt (le disque de l'hôte est maintenant lisible)"
          },
          {
            enonce: "Lire le flag de l'hôte via le disque monté : `/mnt/root/ctf_flags/flag_adv.txt`.",
            indice: "cat /mnt/root/ctf_flags/flag_adv.txt",
            lieu: "Conteneur ctf-ch2 → lecture du disque de l'hôte monté",
            motifs: ["^cat\\s", "/mnt/root", "flag_adv"],
            solution: "cat /mnt/root/ctf_flags/flag_adv.txt",
            sortie: "FLAG{privileged_means_you_can_mount_the_host_disk}"
          }
        ]
      }
    ]
  });

})();
