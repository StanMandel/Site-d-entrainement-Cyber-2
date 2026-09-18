/* =============================================================
   Utilitaires partagés : DOM, texte, aléatoire, progression.
   ============================================================= */

/* ---------- DOM ---------- */

function el(balise, attributs, ...enfants) {
  const noeud = document.createElement(balise);
  if (attributs) {
    for (const [cle, val] of Object.entries(attributs)) {
      if (val === null || val === undefined || val === false) continue;
      if (cle === "class") noeud.className = val;
      else if (cle === "html") noeud.innerHTML = val;
      else if (cle === "texte") noeud.textContent = val;
      else if (cle === "style" && typeof val === "object") {
        for (const [prop, valeur] of Object.entries(val)) {
          if (prop.startsWith("--")) noeud.style.setProperty(prop, valeur);
          else noeud.style[prop] = valeur;
        }
      }
      else if (cle.startsWith("on") && typeof val === "function") noeud.addEventListener(cle.slice(2), val);
      else noeud.setAttribute(cle, val);
    }
  }
  for (const enfant of enfants.flat()) {
    if (enfant === null || enfant === undefined || enfant === false) continue;
    noeud.append(enfant instanceof Node ? enfant : document.createTextNode(enfant));
  }
  return noeud;
}

function vider(noeud) {
  while (noeud.firstChild) noeud.removeChild(noeud.firstChild);
  return noeud;
}

/* ---------- Texte ---------- */

/**
 * Normalise une réponse pour la comparaison :
 * minuscules, sans accent, sans espace ni ponctuation.
 * « Ré-seau », « RESEAU » et « réseau » donnent tous « reseau ».
 */
function normaliser(texte) {
  return String(texte ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function formaterTemps(secondes) {
  const s = Math.max(0, Math.round(secondes));
  const m = Math.floor(s / 60);
  return m + ":" + String(s % 60).padStart(2, "0");
}

/* ---------- Aléatoire ---------- */

function melanger(tableau) {
  const copie = tableau.slice();
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/* ---------- Progression (localStorage) ---------- */

const Progres = {
  CLE: "epita-entrainements:v1",

  _tout() {
    try {
      return JSON.parse(localStorage.getItem(this.CLE)) || {};
    } catch (e) {
      return {};
    }
  },

  _sauver(donnees) {
    try {
      localStorage.setItem(this.CLE, JSON.stringify(donnees));
    } catch (e) {
      /* mode privé ou quota plein : on ignore, le site reste utilisable */
    }
  },

  /** Résultat enregistré pour un exercice, ou null. */
  lire(slug, exoId) {
    const tout = this._tout();
    return (tout[slug] && tout[slug][exoId]) || null;
  },

  /** Tous les résultats d'un cours : { exoId: resultat }. */
  cours(slug) {
    return this._tout()[slug] || {};
  },

  /** Enregistre un résultat ; ne conserve que le meilleur pourcentage. */
  ecrire(slug, exoId, score, total) {
    const tout = this._tout();
    if (!tout[slug]) tout[slug] = {};
    const ancien = tout[slug][exoId];
    const pourcent = total > 0 ? Math.round((score / total) * 100) : 0;
    tout[slug][exoId] = {
      score: score,
      total: total,
      pourcent: pourcent,
      meilleur: Math.max(pourcent, ancien ? ancien.meilleur : 0),
      essais: (ancien ? ancien.essais : 0) + 1,
      date: Date.now()
    };
    this._sauver(tout);
    return tout[slug][exoId];
  },

  effacerCours(slug) {
    const tout = this._tout();
    delete tout[slug];
    this._sauver(tout);
  },

  effacerTout() {
    this._sauver({});
  }
};

/* ---------- Notifications ---------- */

let _toastTimer = null;

function toast(message) {
  let boite = document.querySelector(".toast");
  if (!boite) {
    boite = el("div", { class: "toast" });
    document.body.append(boite);
  }
  boite.textContent = message;
  boite.classList.add("visible");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => boite.classList.remove("visible"), 2200);
}

/* ---------- Statistiques ---------- */

/** Guides d'un cours (fiches explicatives, hors exercices). */
function guidesDuCours(slug) {
  const contenu = window.CONTENU[slug];
  return (contenu && contenu.guides) || [];
}

/** Liste à plat des exercices d'un cours. */
function exercicesDuCours(slug) {
  const contenu = window.CONTENU[slug];
  if (!contenu || !contenu.chapitres) return [];
  return contenu.chapitres.flatMap((ch) =>
    (ch.exercices || []).map((ex) => ({ ...ex, _chapitre: ch }))
  );
}

/** { total, faits, moyenne } pour un cours. */
function statsCours(slug) {
  const exos = exercicesDuCours(slug);
  const resultats = Progres.cours(slug);
  const faits = exos.filter((ex) => resultats[ex.id]);
  const moyenne = faits.length
    ? Math.round(faits.reduce((s, ex) => s + resultats[ex.id].meilleur, 0) / faits.length)
    : 0;
  return {
    total: exos.length,
    faits: faits.length,
    moyenne: moyenne,
    chapitres: (window.CONTENU[slug] && window.CONTENU[slug].chapitres || []).length
  };
}
