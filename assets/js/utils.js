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

/* ---------- Sauvegarde de la progression ---------- */

/* Un code de sauvegarde = la progression en JSON, encodée en base64
   « URL » (sans + / =) et précédée de sa version, pour qu'il se colle
   dans un message ou un fichier texte sans risquer d'être coupé. */
const SAUVEGARDE_PREFIXE = "EPITA1-";

function enBase64(texte) {
  const octets = new TextEncoder().encode(texte);
  let binaire = "";
  for (const octet of octets) binaire += String.fromCharCode(octet);
  return btoa(binaire).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64(code) {
  let base = code.replace(/-/g, "+").replace(/_/g, "/");
  while (base.length % 4) base += "=";
  const binaire = atob(base);
  return new TextDecoder().decode(Uint8Array.from(binaire, (c) => c.charCodeAt(0)));
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

  /** Nombre d'exercices ayant un résultat enregistré, toutes matières confondues. */
  compter() {
    return Object.values(this._tout())
      .reduce((n, exos) => n + Object.keys(exos || {}).length, 0);
  },

  /** Code de sauvegarde de toute la progression. */
  exporter() {
    return SAUVEGARDE_PREFIXE + enBase64(JSON.stringify({
      v: 1,
      date: Date.now(),
      progres: this._tout()
    }));
  },

  /** Contenu d'un code de sauvegarde. Lève une erreur si le code est inutilisable. */
  analyser(code) {
    const propre = String(code ?? "").trim().replace(/\s+/g, "");
    if (!propre) throw new Error("Aucun code saisi.");
    if (!propre.startsWith(SAUVEGARDE_PREFIXE)) throw new Error("Ce code ne vient pas de ce site.");

    let charge = null;
    try {
      charge = JSON.parse(deBase64(propre.slice(SAUVEGARDE_PREFIXE.length)));
    } catch (e) {
      throw new Error("Code illisible : il a sans doute été tronqué à la copie.");
    }
    if (!charge || typeof charge !== "object" || !charge.progres || typeof charge.progres !== "object") {
      throw new Error("Code illisible : il a sans doute été tronqué à la copie.");
    }
    return charge;
  },

  /** Remet en forme un résultat venu d'un code de sauvegarde (valeurs hors bornes ignorées). */
  _nettoyer(brut) {
    if (!brut || typeof brut !== "object") return null;
    const nombre = (v, defaut) => (typeof v === "number" && isFinite(v) ? v : defaut);
    const total = Math.max(0, Math.round(nombre(brut.total, 0)));
    const score = Math.min(total, Math.max(0, Math.round(nombre(brut.score, 0))));
    const calcule = total > 0 ? Math.round((score / total) * 100) : 0;
    const pourcent = Math.min(100, Math.max(0, Math.round(nombre(brut.pourcent, calcule))));
    return {
      score: score,
      total: total,
      pourcent: pourcent,
      meilleur: Math.min(100, Math.max(pourcent, Math.round(nombre(brut.meilleur, pourcent)))),
      essais: Math.max(1, Math.round(nombre(brut.essais, 1))),
      date: nombre(brut.date, Date.now())
    };
  },

  /**
   * Fusionne un code de sauvegarde avec la progression de cet appareil :
   * rien n'est perdu, le meilleur record de chaque exercice est gardé.
   * Renvoie { ajoutes, ameliores, date }.
   */
  restaurer(code) {
    const charge = this.analyser(code);
    const tout = this._tout();
    let ajoutes = 0;
    let ameliores = 0;

    for (const [slug, exos] of Object.entries(charge.progres)) {
      if (!exos || typeof exos !== "object") continue;
      if (!tout[slug]) tout[slug] = {};
      for (const [exoId, brut] of Object.entries(exos)) {
        const venu = this._nettoyer(brut);
        if (!venu) continue;
        const ancien = tout[slug][exoId];
        if (!ancien) {
          tout[slug][exoId] = venu;
          ajoutes++;
          continue;
        }
        const recent = venu.date > ancien.date ? venu : ancien;
        if (venu.meilleur > ancien.meilleur) ameliores++;
        tout[slug][exoId] = {
          score: recent.score,
          total: recent.total,
          pourcent: recent.pourcent,
          meilleur: Math.max(ancien.meilleur, venu.meilleur),
          essais: ancien.essais + venu.essais,
          date: Math.max(ancien.date, venu.date)
        };
      }
    }

    this._sauver(tout);
    return { ajoutes: ajoutes, ameliores: ameliores, date: charge.date };
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
