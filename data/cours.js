/* =============================================================
   REGISTRE DES COURS
   -------------------------------------------------------------
   Pour ajouter un cours :
     1. Ajouter une entrée dans la liste ci-dessous.
     2. Créer le fichier data/cours/<slug>.js (copier data/cours/_modele.js).
     3. Ajouter la balise <script> correspondante dans index.html.
   ============================================================= */

window.COURS = [
  {
    slug: "anglais-general",
    nom: "Anglais général",
    court: "Anglais gén.",
    emoji: "🗣️",
    couleur: "#F4536A",
    description: "Vocabulaire, expression, compréhension et grammaire."
  },
  {
    slug: "anglais-technique",
    nom: "Anglais technique",
    court: "Anglais tech.",
    emoji: "📐",
    couleur: "#FF8C42",
    description: "Lexique spécialisé, documentation et communication professionnelle."
  },
  {
    slug: "virtualisation-conteneurs",
    nom: "Virtualisation et sécurité des conteneurs",
    court: "Conteneurs",
    emoji: "📦",
    couleur: "#2D9CDB",
    description: "Hyperviseurs, Docker, isolation, durcissement et bonnes pratiques."
  },
  {
    slug: "poo-java",
    nom: "Programmation Orientée Objet (Java)",
    court: "POO Java",
    emoji: "☕",
    couleur: "#E07A24",
    description: "Classes, héritage, polymorphisme, interfaces et collections."
  },
  {
    slug: "complexite-algorithmique",
    nom: "Complexité algorithmique",
    court: "Complexité",
    emoji: "⏱️",
    couleur: "#7C4DFF",
    description: "Notations asymptotiques, coûts, récurrences et classes de problèmes."
  },
  {
    slug: "systeme-windows",
    nom: "Fondamentaux du système d'exploitation Windows",
    court: "Windows",
    emoji: "🪟",
    couleur: "#00A6C0",
    description: "Architecture, comptes, stockage, et attaques réseau (NTLM, SMB, relais, pass-the-hash)."
  },
  {
    slug: "graphes-matrices",
    nom: "Introduction aux graphes et aux matrices",
    court: "Graphes & matrices",
    emoji: "🕸️",
    couleur: "#2BB673",
    description: "Représentations, parcours, algorithmes et algèbre linéaire de base."
  },
  {
    slug: "assembleur",
    nom: "Assembleur",
    court: "Assembleur",
    emoji: "⚙️",
    couleur: "#5B6ABF",
    description: "Registres, instructions, pile, appels de fonctions et adressage."
  },
  {
    slug: "electronique-3",
    nom: "Électronique et Électricité 3",
    court: "Électronique 3",
    emoji: "⚡",
    couleur: "#E0A800",
    description: "Modulations AM, FM et numériques, supports de transmission, liaisons série et alimentation des data centers."
  },
  {
    slug: "osint",
    nom: "Open Source Intelligence (OSINT)",
    court: "OSINT",
    emoji: "🔎",
    couleur: "#12A594",
    description: "Sources ouvertes, méthodologie, outils et cadre légal."
  },
  {
    slug: "reseaux-avances",
    nom: "Réseaux avancés",
    court: "Réseaux",
    emoji: "🌐",
    couleur: "#3D6DF2",
    description: "Routage, commutation, protocoles, VLAN et sécurité réseau."
  },
  {
    slug: "forensique",
    nom: "Analyse forensique et preuves numériques",
    court: "Forensique",
    emoji: "🔬",
    couleur: "#A855C7",
    description: "Acquisition, chaîne de possession, artefacts et analyse post-mortem."
  },
  {
    slug: "probabilites-discretes",
    nom: "Probabilités discrètes",
    court: "Probabilités",
    emoji: "🎲",
    couleur: "#EC4899",
    description: "Dénombrement, variables aléatoires, lois usuelles et espérance."
  },
  {
    slug: "reverse-engineering",
    nom: "Reverse Engineering",
    court: "Reverse",
    emoji: "🧩",
    couleur: "#B9314F",
    description: "Désassemblage, analyse statique et dynamique, formats binaires."
  }
];

/* Contenu de chaque cours : rempli par les fichiers data/cours/<slug>.js */
window.CONTENU = window.CONTENU || {};
