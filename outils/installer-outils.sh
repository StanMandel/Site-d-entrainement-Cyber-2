#!/usr/bin/env bash
# ===========================================================
#  Installation des outils d'attaque (Linux)
#  nmap, Impacket, NetExec, enum4linux-ng, Responder
#  (PsExec est un binaire Windows ; sous Linux, impacket-psexec)
#  A n'utiliser que sur un reseau de test autorise.
# ===========================================================
set -euo pipefail

vert()  { printf '\033[32m%s\033[0m\n' "$*"; }
jaune() { printf '\033[33m%s\033[0m\n' "$*"; }
rouge() { printf '\033[31m%s\033[0m\n' "$*"; }

echo "============================================================"
echo "  Installation des outils d'attaque (Linux)"
echo "  nmap, Impacket, NetExec, enum4linux-ng, Responder"
echo "============================================================"

# --- On n'exige pas root : sudo seulement si besoin ---
if [ "$(id -u)" -eq 0 ]; then SUDO=""; else SUDO="sudo"; fi

# --- Detection du gestionnaire de paquets ---
if   command -v apt-get >/dev/null 2>&1; then GEST="apt"
elif command -v dnf     >/dev/null 2>&1; then GEST="dnf"
elif command -v pacman  >/dev/null 2>&1; then GEST="pacman"
else rouge "[X] Gestionnaire de paquets non reconnu (apt / dnf / pacman)."; exit 1
fi
vert "[OK] Gestionnaire detecte : $GEST"

pkg_install() {
  case "$GEST" in
    apt)    $SUDO apt-get update -y && $SUDO DEBIAN_FRONTEND=noninteractive apt-get install -y "$@" ;;
    dnf)    $SUDO dnf install -y "$@" ;;
    pacman) $SUDO pacman -Sy --noconfirm "$@" ;;
  esac
}

assure_sys() {
  # $1 = commande a tester ; $2... = paquets a installer si absente
  local cmd="$1"; shift
  if command -v "$cmd" >/dev/null 2>&1; then
    vert "[OK] $cmd deja present."
  else
    jaune "[..] Installation de $cmd..."
    pkg_install "$@"
  fi
}

# --- Prerequis systeme (git est requis pour installer NetExec/enum4linux-ng) ---
assure_sys nmap nmap
assure_sys git  git
assure_sys python3 python3
python3 -m pip --version >/dev/null 2>&1 || pkg_install python3-pip

# --- pipx ---
if command -v pipx >/dev/null 2>&1; then
  vert "[OK] pipx deja present."
else
  jaune "[..] Installation de pipx..."
  case "$GEST" in
    pacman) pkg_install python-pipx || python3 -m pip install --user --upgrade pipx ;;
    *)      pkg_install pipx        || python3 -m pip install --user --upgrade pipx ;;
  esac
  python3 -m pipx ensurepath >/dev/null 2>&1 || true
  export PATH="$HOME/.local/bin:$PATH"
fi

assure_pipx() {
  # $1 = nom du paquet dans pipx ; $2 = paquet (nom PyPI ou URL git) a installer
  if pipx list 2>/dev/null | grep -qiE "package $1 "; then
    vert "[OK] $1 deja installe (pipx)."
  else
    jaune "[..] Installation de $1 via pipx..."
    pipx install "$2"
  fi
}

# --- Outils Python (isoles, sans doublon) -----------------------------------
#  Impacket est sur PyPI ; NetExec et enum4linux-ng n'y sont pas (ou plus) :
#  on les installe depuis leur depot GitHub officiel.
assure_pipx impacket       "impacket"
assure_pipx netexec        "git+https://github.com/Pennyw0rth/NetExec"
assure_pipx enum4linux-ng  "git+https://github.com/cddmp/enum4linux-ng"

# --- Responder ---
if command -v responder >/dev/null 2>&1; then
  vert "[OK] Responder deja present (paquet systeme)."
else
  RESP="$HOME/outils-attaques/Responder"
  if [ -f "$RESP/Responder.py" ]; then
    vert "[OK] Responder deja present dans $RESP."
  else
    jaune "[..] Clonage de Responder..."
    mkdir -p "$HOME/outils-attaques"
    git clone --depth 1 https://github.com/lgandx/Responder "$RESP"
  fi
fi

echo
vert "[OK] Termine. Ouvrez un nouveau terminal pour recharger le PATH."
echo "PsExec est un binaire Windows : sous Linux, utilisez impacket-psexec (deja installe)."
