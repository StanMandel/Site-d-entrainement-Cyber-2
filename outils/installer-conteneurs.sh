#!/usr/bin/env bash
# ===========================================================
#  Installation de l'environnement « conteneurs » (Ubuntu)
#  Docker, k3s (Kubernetes), Helm, Trivy, htop, procps, nginx
#  A n'utiliser que sur une machine de test / TP autorisee.
# ===========================================================
# Principe : idempotent. Chaque outil n'est installe que s'il
# est absent (command -v). Sources officielles uniquement, pas
# de « curl | bash » aveugle : k3s et Helm sont TELECHARGES,
# puis executes, comme dans le TP1.
# ===========================================================
set -euo pipefail

vert()  { printf '\033[32m%s\033[0m\n' "$*"; }
jaune() { printf '\033[33m%s\033[0m\n' "$*"; }
rouge() { printf '\033[31m%s\033[0m\n' "$*"; }
titre() { printf '\n\033[1;36m== %s ==\033[0m\n' "$*"; }

echo "============================================================"
echo "  Installation de l'environnement conteneurs (Ubuntu)"
echo "  Docker, k3s, Helm, Trivy, htop, procps, nginx"
echo "============================================================"

# --- On n'exige pas root : sudo seulement si besoin ---
if [ "$(id -u)" -eq 0 ]; then SUDO=""; else SUDO="sudo"; fi

# --- Verifie qu'on est bien sur une base apt (Ubuntu/Debian) ---
if ! command -v apt-get >/dev/null 2>&1; then
  rouge "[X] Ce script cible Ubuntu/Debian (apt-get introuvable)."
  exit 1
fi

deja() { command -v "$1" >/dev/null 2>&1; }

titre "Mise a jour de l'index des paquets"
$SUDO apt-get update -y

# ----------------------------------------------------------
# 1) Outils systeme : htop, procps (top/ps/free), nginx, curl
# ----------------------------------------------------------
titre "Outils de base (htop, procps, nginx, curl)"
BASE=""
for p in htop procps nginx curl ca-certificates; do
  dpkg -s "$p" >/dev/null 2>&1 || BASE="$BASE $p"
done
if [ -n "$BASE" ]; then
  # shellcheck disable=SC2086
  $SUDO DEBIAN_FRONTEND=noninteractive apt-get install -y $BASE
  vert "[OK] Installes :$BASE"
else
  jaune "[..] htop, procps, nginx, curl deja presents."
fi

# ----------------------------------------------------------
# 2) Docker (paquet Ubuntu docker.io + plugin compose)
# ----------------------------------------------------------
titre "Docker"
if deja docker; then
  jaune "[..] Docker deja installe : $(docker --version)"
else
  $SUDO DEBIAN_FRONTEND=noninteractive apt-get install -y docker.io docker-compose-v2 || \
    $SUDO DEBIAN_FRONTEND=noninteractive apt-get install -y docker.io
  $SUDO systemctl enable --now docker 2>/dev/null || true
  # Permettre a l'utilisateur courant d'utiliser docker sans sudo
  if [ "$(id -u)" -ne 0 ]; then
    $SUDO usermod -aG docker "$USER" || true
    jaune "[i] Ajoute au groupe docker : deconnectez/reconnectez-vous (ou 'newgrp docker')."
  fi
  vert "[OK] Docker installe."
fi

# ----------------------------------------------------------
# 3) k3s (distribution Kubernetes legere)
#    On TELECHARGE le script officiel, on le laisse lisible,
#    puis on l'execute (pas de pipe aveugle).
# ----------------------------------------------------------
titre "k3s (Kubernetes)"
if deja k3s || deja kubectl; then
  jaune "[..] k3s / kubectl deja present."
else
  TMP="$(mktemp -d)"
  jaune "[..] Telechargement de get.k3s.io dans $TMP/k3s-install.sh"
  curl -sfL https://get.k3s.io -o "$TMP/k3s-install.sh"
  jaune "[i] Inspectez-le si besoin :  less $TMP/k3s-install.sh"
  INSTALL_K3S_EXEC="--write-kubeconfig-mode 644" $SUDO sh "$TMP/k3s-install.sh"
  # kubeconfig utilisable sans sudo
  mkdir -p "$HOME/.kube"
  $SUDO cp /etc/rancher/k3s/k3s.yaml "$HOME/.kube/config" 2>/dev/null || true
  $SUDO chown "$(id -u):$(id -g)" "$HOME/.kube/config" 2>/dev/null || true
  vert "[OK] k3s installe. Verifiez :  kubectl get nodes"
fi

# ----------------------------------------------------------
# 4) Helm (gestionnaire de paquets Kubernetes)
#    Idem : script officiel telecharge puis execute.
# ----------------------------------------------------------
titre "Helm"
if deja helm; then
  jaune "[..] Helm deja installe : $(helm version --short 2>/dev/null || echo present)"
else
  TMP="$(mktemp -d)"
  curl -fsSL -o "$TMP/get-helm-3" https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
  chmod 700 "$TMP/get-helm-3"
  $SUDO "$TMP/get-helm-3"
  vert "[OK] Helm installe."
fi

# ----------------------------------------------------------
# 5) Trivy (scanner de vulnerabilites / SBOM / config)
#    Depot APT officiel Aqua Security.
# ----------------------------------------------------------
titre "Trivy"
if deja trivy; then
  jaune "[..] Trivy deja installe : $(trivy --version 2>/dev/null | head -n1)"
else
  $SUDO install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://aquasecurity.github.io/trivy-repo/deb/public.key \
    | $SUDO gpg --dearmor -o /etc/apt/keyrings/trivy.gpg
  CODENAME="$(. /etc/os-release && echo "${UBUNTU_CODENAME:-${VERSION_CODENAME:-jammy}}")"
  echo "deb [signed-by=/etc/apt/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb ${CODENAME} main" \
    | $SUDO tee /etc/apt/sources.list.d/trivy.list >/dev/null
  $SUDO apt-get update -y
  $SUDO DEBIAN_FRONTEND=noninteractive apt-get install -y trivy
  vert "[OK] Trivy installe."
fi

# ----------------------------------------------------------
#  Recapitulatif
# ----------------------------------------------------------
titre "Recapitulatif"
for o in docker kubectl k3s helm trivy htop top nginx; do
  if deja "$o"; then vert "[OK] $o"; else rouge "[MANQUE] $o"; fi
done

echo
vert "[OK] Termine. Ouvrez un nouveau terminal (PATH + groupe docker)."
echo "Verifs rapides :  docker ps   |   kubectl get nodes   |   trivy --version"
