/* =============================================================
   Moteur des enquêtes OSINT (type "enquete")
   -------------------------------------------------------------
   Une enquête se parcourt en deux onglets :
     1. Méthodes    : un petit cours pas à pas (Précédent / Suivant),
                      chaque méthode illustrée d'un exemple ;
     2. Challenges  : du plus facile au plus dur (niveau 1 à 4).
                      Chaque challenge fournit des pièces (photo,
                      fichier à télécharger, texte brut, plaques),
                      une ou plusieurs cases de réponse, des indices
                      dévoilés un à un et une solution rédigée.

   Pièces (champ « pieces » d'un challenge, ou blocs du cours) :
     { image, nom, legende }  photo affichée + bouton Télécharger ;
     { fichier, nom, legende } fichier à télécharger seulement ;
     { texte, nom }           texte brut affiché (.eml, en-têtes…)
                              et téléchargeable ;
     { plaques: [...] }       plaques d'immatriculation dessinées
                              (voir Plaques.svg plus bas).

   Cases de réponse (champ « champs ») :
     { libelle, reponse, accepte }  texte : casse, accents, espaces
                                    et ponctuation ignorés ;
     { libelle, reponse: nombre, tolerance }  nombre ;
     { libelle, gps: [lat, lon], rayon }      coordonnées, juste si
                                    la saisie tombe à moins de
                                    « rayon » km (0,15 par défaut).
   Un challenge peut aussi être un QCM : { type: "qcm", choix,
   reponse, explication } (rendu par MoteurLecon._qcm).

   Utilisation :
     MoteurEnquete.lancer(conteneur, enquete, {
       slug, couleur, surRetour(), suivant: { titre, hash } | null,
       surFin(score, total)
     });
   ============================================================= */

const MoteurEnquete = {
  ONGLETS: [
    ["methodes", "Méthodes"],
    ["challenges", "Challenges"]
  ],

  NIVEAUX: {
    1: ["★", "Facile"],
    2: ["★★", "Intermédiaire"],
    3: ["★★★", "Difficile"],
    4: ["★★★★", "Expert"]
  },

  lancer(conteneur, enquete, contexte) {
    const etat = {
      enquete,
      contexte,
      conteneur,
      challenges: enquete.challenges || [],
      resultats: (enquete.challenges || []).map(() => null),
      justes: 0,
      finAffichee: false,
      courant: 0,
      panneaux: {},
      boutons: {},
      cartes: []
    };
    this._rendre(etat);
  },

  /* ---------------- Coquille : onglets et panneaux ---------------- */

  _rendre(etat) {
    const { conteneur } = etat;
    vider(conteneur);
    const barre = el("nav", { class: "lc-onglets" });
    this.ONGLETS.forEach(([cle, libelle], i) => {
      etat.boutons[cle] = el("button", {
        class: "lc-onglet", type: "button", onclick: () => this._activer(etat, cle)
      }, el("span", { class: "lc-onglet-num", texte: String(i + 1) }), libelle);
      barre.append(etat.boutons[cle]);
      etat.panneaux[cle] = el("div", { class: "lc-panneau" });
    });
    etat._barre = barre;
    conteneur.append(barre, etat.panneaux.methodes, etat.panneaux.challenges);
    this._panneauMethodes(etat);
    this._panneauChallenges(etat);
    this._activer(etat, "methodes", true);
  },

  _activer(etat, cle, sansDefilement) {
    for (const [k, p] of Object.entries(etat.panneaux)) p.style.display = k === cle ? "" : "none";
    for (const [k, b] of Object.entries(etat.boutons)) b.classList.toggle("actif", k === cle);
    if (!sansDefilement && etat._barre.getBoundingClientRect().top < 0) {
      etat._barre.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  /* ---------------- Contenu riche ----------------
     Celui des leçons (paragraphes, listes, tableaux, { code },
     { remarque }, { attention }…), plus les pièces d'enquête. */

  _contenu(contenu) {
    const blocs = [];
    for (const bloc of [].concat(contenu ?? [])) {
      if (bloc && typeof bloc === "object" && !Array.isArray(bloc)
        && (bloc.image || bloc.fichier || bloc.plaques || (bloc.texte !== undefined && bloc.nom))) {
        blocs.push(this._piece(bloc));
        continue;
      }
      blocs.push(...MoteurLecon._contenu(bloc));
    }
    return blocs;
  },

  _piece(p) {
    if (p.plaques) {
      return el("figure", { class: "eq-plaques" },
        ...p.plaques.map((pl) => el("div", { class: "eq-plaque", html: Plaques.svg(pl) })),
        p.legende ? el("figcaption", { html: texteRiche(p.legende) }) : null);
    }
    if (p.image) {
      const lien = el("a", { href: p.image, target: "_blank", rel: "noopener", class: "eq-image-lien", title: "Ouvrir en grand" },
        el("img", { src: p.image, alt: p.nom || "Pièce", loading: "lazy" }));
      return el("figure", { class: "eq-piece eq-piece-image" },
        lien,
        el("figcaption", {},
          el("span", { class: "eq-nom", texte: "🖼 " + (p.nom || p.image.split("/").pop()) }),
          p.legende ? el("span", { class: "eq-legende", html: texteRiche(p.legende) }) : null,
          el("a", { class: "btn btn-doux btn-petit", href: p.image, download: p.nom || "" }, "⤓ Télécharger")));
    }
    if (p.fichier) {
      return el("div", { class: "eq-piece eq-piece-fichier" },
        el("span", { class: "eq-nom", texte: "📄 " + (p.nom || p.fichier.split("/").pop()) }),
        p.legende ? el("span", { class: "eq-legende", html: texteRiche(p.legende) }) : null,
        el("a", { class: "btn btn-doux btn-petit", href: p.fichier, download: p.nom || "" }, "⤓ Télécharger"));
    }
    const telecharger = () => {
      const url = URL.createObjectURL(new Blob([p.texte], { type: "text/plain;charset=utf-8" }));
      const a = el("a", { href: url, download: p.nom });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    return el("div", { class: "eq-piece eq-piece-texte" },
      el("div", { class: "eq-piece-tete" },
        el("span", { class: "eq-nom", texte: "✉ " + p.nom }),
        el("button", { class: "btn btn-doux btn-petit", type: "button", onclick: telecharger }, "⤓ Télécharger")),
      el("pre", { class: "bloc-code eq-brut", texte: p.texte }));
  },

  /* ---------------- 1. Méthodes pas à pas ---------------- */

  _panneauMethodes(etat) {
    const panneau = etat.panneaux.methodes;
    const etapes = etat.enquete.methodes || [];
    const points = el("div", { class: "lc-points" });
    const scene = el("div", { class: "lc-scene" });
    const nav = el("div", { class: "lc-nav" });
    panneau.append(points, scene, nav);
    const vues = new Set([0]);

    const afficher = (k) => {
      vues.add(k);
      vider(points);
      etapes.forEach((e, i) => points.append(el("button", {
        class: "lc-point" + (i === k ? " actif" : vues.has(i) ? " vu" : ""),
        type: "button", title: e.titre, onclick: () => afficher(i)
      }, String(i + 1))));

      const e = etapes[k];
      const carte = el("section", { class: "code-carte lc-etape" },
        el("h3", { texte: "Méthode " + (k + 1) + " sur " + etapes.length }),
        el("h2", { class: "lc-etape-titre", texte: e.titre || "" }),
        el("div", { class: "lc-etape-texte" }, ...this._contenu(e.texte)));
      if (e.exemple) {
        carte.append(el("aside", { class: "lc-redaction eq-exemple" },
          el("h4", { texte: e.exemple.titre || "Exemple" }),
          ...this._contenu(e.exemple.texte)));
      }
      vider(scene).append(carte);

      vider(nav);
      nav.append(
        el("button", { class: "btn btn-fantome", type: "button", disabled: k === 0, onclick: () => afficher(k - 1) }, "← Précédent"),
        el("span", { class: "espace" }),
        k < etapes.length - 1
          ? el("button", { class: "btn btn-principal", type: "button", onclick: () => afficher(k + 1) }, "Suivant →")
          : el("button", { class: "btn btn-principal", type: "button", onclick: () => this._activer(etat, "challenges") }, "Challenges →"));
      if (etat._barre.isConnected && points.getBoundingClientRect().top < 0) {
        etat._barre.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    if (etapes.length) afficher(0);
  },

  /* ---------------- 2. Challenges ---------------- */

  _panneauChallenges(etat) {
    const panneau = etat.panneaux.challenges;
    etat._pastilles = el("div", { class: "lc-pastilles" });
    etat._zone = el("div", { class: "lc-zone-exo" });
    etat._zoneFin = el("div", { class: "lc-zone-fin" });
    panneau.append(etat._pastilles, etat._zone, etat._zoneFin);
    if (etat.challenges.length) this._montrer(etat, 0);
  },

  _majPastilles(etat) {
    vider(etat._pastilles);
    etat.challenges.forEach((ch, i) => {
      const r = etat.resultats[i];
      const niveau = this.NIVEAUX[ch.niveau || 1];
      etat._pastilles.append(el("button", {
        class: "lc-pastille" + (i === etat.courant ? " actif" : "") + (r === true ? " ok" : r === false ? " ko" : ""),
        type: "button", title: niveau[1], onclick: () => this._montrer(etat, i)
      }, el("b", { texte: String(i + 1) }), el("span", { texte: niveau[0] })));
    });
  },

  _montrer(etat, i) {
    etat.courant = i;
    this._majPastilles(etat);
    if (!etat.cartes[i]) etat.cartes[i] = this._carte(etat, i);
    vider(etat._zone).append(etat.cartes[i]);
  },

  _carte(etat, i) {
    const ch = etat.challenges[i];
    const niveau = this.NIVEAUX[ch.niveau || 1];
    const carte = el("section", { class: "code-carte code-objectif lc-exo" },
      el("div", { class: "lc-exo-tete" },
        el("h3", { texte: "Challenge " + (i + 1) + " sur " + etat.challenges.length }),
        el("span", { class: "lc-niveau lc-niveau-" + (ch.niveau || 1), texte: niveau[0] + " " + niveau[1] })),
      ch.titre ? el("h2", { class: "lc-exo-titre", texte: ch.titre }) : null);
    carte.append(...this._contenu(ch.enonce));
    if (ch.pieces) carte.append(el("div", { class: "eq-pieces" }, ...this._contenu(ch.pieces)));
    if (ch.question) carte.append(el("div", { class: "eq-question" }, ...this._contenu(ch.question)));

    const zone = el("div", { class: "pb-reaction" });
    const fin = (juste) => {
      const bouton = carte.querySelector(".eq-bloc-indices > button");
      if (bouton) bouton.remove();
      this._resoudre(etat, i, juste);
    };
    const widget = ch.type === "qcm"
      ? MoteurLecon._qcm(Object.assign({}, ch, { explication: ch.solution || ch.explication }), zone, fin)
      : this._champs(ch, zone, fin);
    carte.append(widget);
    if ((ch.indices || []).length) carte.append(this._indices(ch.indices));
    carte.append(zone);

    carte.append(el("div", { class: "lc-nav lc-nav-exo" },
      el("button", { class: "btn btn-fantome btn-petit", type: "button", disabled: i === 0, onclick: () => this._montrer(etat, i - 1) }, "← Précédent"),
      el("span", { class: "espace" }),
      i < etat.challenges.length - 1
        ? el("button", { class: "btn btn-doux btn-petit lc-suivant", type: "button", onclick: () => this._montrer(etat, i + 1) }, "Challenge suivant →")
        : null));
    return carte;
  },

  /* Indices dévoilés un par un. */
  _indices(indices) {
    const liste = el("ol", { class: "eq-indices" });
    const bouton = el("button", { class: "btn btn-fantome btn-petit", type: "button" });
    let montres = 0;
    const maj = () => {
      bouton.textContent = "💡 Indice " + (montres + 1) + " / " + indices.length;
      if (montres >= indices.length) bouton.remove();
    };
    bouton.addEventListener("click", () => {
      liste.append(el("li", {}, ...this._contenu(indices[montres])));
      montres++;
      maj();
    });
    maj();
    return el("div", { class: "eq-bloc-indices" }, liste, bouton);
  },

  _champs(ch, zone, fin) {
    let resolu = false, essais = 0;
    const lignes = ch.champs.map((champ) => {
      const saisie = el("input", {
        class: "jp-saisie pb-champ", type: "text",
        autocomplete: "off", spellcheck: "false", autocapitalize: "off",
        placeholder: champ.gps ? "48.8584, 2.2945" : champ.exemple || ""
      });
      const ligne = el("label", { class: "pb-ligne" },
        el("span", { class: "pb-libelle", html: texteRiche(champ.libelle || "Réponse") }),
        el("span", { class: "pb-entree" }, saisie, el("span", { class: "pb-unite", texte: champ.unite || "" })));
      return { champ, saisie, ligne, bon: false };
    });
    const bouton = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");
    const attendues = () => el("ul", { class: "pb-attendues" }, ...ch.champs.map((c) =>
      el("li", {}, el("span", { html: texteRiche(c.libelle || "Réponse") + " : " }), el("code", { texte: afficherReponseEnquete(c) }))));
    const verrouiller = () => { resolu = true; bouton.disabled = true; lignes.forEach((l) => { l.saisie.disabled = true; }); };

    const valider = () => {
      if (resolu) return;
      const restants = lignes.filter((l) => !l.bon);
      const vide = restants.find((l) => !l.saisie.value.trim());
      if (vide) { vide.saisie.focus(); return; }
      essais++;
      for (const l of restants) {
        l.saisie.classList.remove("flash-ko");
        if (champEnqueteCorrect(l.saisie.value, l.champ)) {
          l.bon = true; l.saisie.disabled = true; l.saisie.classList.add("flash-ok");
        } else { void l.saisie.offsetWidth; l.saisie.classList.add("flash-ko"); }
      }
      const faux = lignes.filter((l) => !l.bon);
      if (!faux.length) {
        verrouiller();
        MoteurLecon._message(zone, { bon: true, solution: ch.solution });
        fin(true);
        return;
      }
      faux[0].saisie.focus();
      MoteurLecon._message(zone, {
        message: faux.length + (faux.length > 1 ? " réponses à corriger." : " réponse à corriger."),
        essais,
        surRevele: () => {
          verrouiller();
          faux.forEach((l) => l.saisie.classList.add("pb-revele"));
          MoteurLecon._message(zone, { revele: true, detail: attendues(), solution: ch.solution });
          fin(false);
        }
      });
    };
    bouton.addEventListener("click", valider);
    lignes.forEach((l) => l.saisie.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); valider(); } }));
    return el("div", { class: "pb-saisie pb-champs" }, ...lignes.map((l) => l.ligne), el("div", { class: "pb-valider" }, bouton));
  },

  _resoudre(etat, i, juste) {
    if (etat.resultats[i] !== null) return;
    etat.resultats[i] = juste;
    if (juste) etat.justes++;
    const total = etat.challenges.length;
    Progres.ecrire(etat.contexte.slug, etat.enquete.id, etat.justes, total);
    this._majPastilles(etat);
    const suivant = etat.cartes[i] && etat.cartes[i].querySelector(".lc-suivant");
    if (suivant) suivant.className = "btn btn-principal btn-petit lc-suivant";
    if (etat.resultats.every((r) => r !== null) && !etat.finAffichee) {
      etat.finAffichee = true;
      this._fin(etat);
      if (etat.contexte.surFin) etat.contexte.surFin(etat.justes, total);
    }
  },

  _fin(etat) {
    const total = etat.challenges.length;
    const parfait = etat.justes === total;
    const bandeau = el("div", { class: "code-bandeau " + (parfait ? "ok" : "ko") },
      el("b", { texte: parfait ? "✓ Enquête bouclée" : "Enquête terminée" }),
      el("span", { texte: etat.justes + " / " + total + " challenges réussis" }),
      el("button", {
        class: "btn btn-doux btn-petit", type: "button",
        onclick: () => MoteurEnquete.lancer(etat.conteneur, etat.enquete, etat.contexte)
      }, "↻ Recommencer"));
    if (etat.contexte.suivant) {
      bandeau.append(el("button", {
        class: "btn btn-principal btn-petit", type: "button",
        onclick: () => App.aller(etat.contexte.suivant.hash)
      }, "Suite →"));
    }
    vider(etat._zoneFin).append(bandeau);
  }
};

/* -------------------------------------------------------------
   Correction des cases (sans DOM, partagée avec le vérificateur).
   ------------------------------------------------------------- */

/* « Saint-Brieuc », « saint brieuc » et « SAINT BRIEUC » se valent. */
function normeEnquete(s) {
  return String(s ?? "").toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .replace(/[^a-z0-9]/g, "");
}

/* Lit « 48.4538, -2.0462 », « 48,4538 -2,0462 » ou
   « 48°27'13.9"N 2°02'46.3"W » ; renvoie [lat, lon] ou null. */
function lireCoordonnees(saisie) {
  const s = String(saisie ?? "").trim();
  if (/°/.test(s)) {
    const groupes = [...s.matchAll(/(-?\d+(?:[.,]\d+)?)\s*°\s*(?:(\d+(?:[.,]\d+)?)\s*['′]\s*)?(?:(\d+(?:[.,]\d+)?)\s*(?:["″]|''|′′)\s*)?([NSEOW])?/gi)];
    if (groupes.length < 2) return null;
    const val = (g) => {
      const n = (x) => (x ? Number(x.replace(",", ".")) : 0);
      let v = Math.abs(n(g[1])) + n(g[2]) / 60 + n(g[3]) / 3600;
      if (g[1].startsWith("-") || /[SWO]/i.test(g[4] || "")) v = -v;
      return v;
    };
    return [val(groupes[0]), val(groupes[1])];
  }
  const nombres = s.match(/-?\d+(?:[.,]\d+)?/g);
  if (!nombres || nombres.length !== 2) return null;
  return nombres.map((n) => Number(n.replace(",", ".")));
}

/* Distance en km entre deux points [lat, lon] (haversine). */
function distanceKm(a, b) {
  const rad = (d) => d * Math.PI / 180;
  const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function champEnqueteCorrect(saisie, champ) {
  if (champ.gps) {
    const p = lireCoordonnees(saisie);
    if (!p || !p.every(Number.isFinite)) return false;
    return distanceKm(p, champ.gps) <= (champ.rayon ?? 0.15);
  }
  if (typeof champ.reponse === "number") return champCorrect(saisie, champ);
  const g = normeEnquete(saisie);
  return !!g && [].concat(champ.reponse, champ.accepte || []).some((a) => a != null && normeEnquete(a) === g);
}

function afficherReponseEnquete(champ) {
  if (champ.gps) return champ.gps.join(", ") + " (à " + Math.round((champ.rayon ?? 0.15) * 1000) + " m près)";
  if (typeof champ.reponse === "number") return formaterReponse(champ);
  return String(champ.reponse);
}

/* -------------------------------------------------------------
   Plaques d'immatriculation dessinées en SVG.
     { format: "siv", texte: "GH-482-PK", region: "56" }
     { format: "fni", texte: "5419 RT 29" }
     { format: "eu", pays: "D", texte: "HH AB 1234" }   (bande bleue)
     { format: "uk", texte: "LB24 XKD" }                 (plaque arrière jaune)
     { format: "ch", texte: "VS 123456" }
   ------------------------------------------------------------- */

const Plaques = {
  svg(p) {
    const L = 520, H = 112;
    const fond = p.format === "uk" ? "#F7D117" : p.format === "fni" && p.noire ? "#151515" : "#FFFFFF";
    const encre = p.format === "fni" && p.noire ? "#F2F2F2" : "#111111";
    const parties = [];
    parties.push(`<rect x="2" y="2" width="${L - 4}" height="${H - 4}" rx="9" fill="${fond}" stroke="#222" stroke-width="3"/>`);
    let x0 = 14, x1 = L - 14;
    const bande = (x, lettres, region) => {
      parties.push(`<rect x="${x}" y="6" width="44" height="${H - 12}" rx="5" fill="#1D3F99"/>`);
      if (!region) {
        for (let k = 0; k < 12; k++) {
          const a = k * Math.PI / 6;
          parties.push(`<circle cx="${(x + 22 + 13 * Math.cos(a)).toFixed(1)}" cy="${(36 + 13 * Math.sin(a)).toFixed(1)}" r="2.2" fill="#FFD500"/>`);
        }
      }
      parties.push(`<text x="${x + 22}" y="${H - 18}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${lettres.length > 2 ? 18 : 24}" fill="#fff">${lettres}</text>`);
    };
    if (p.format === "siv" || p.format === "eu") { bande(6, p.format === "siv" ? "F" : p.pays || ""); x0 = 58; }
    if (p.format === "siv") {
      bande(L - 50, p.region || "", true);
      parties.push(`<rect x="${L - 44}" y="16" width="32" height="34" rx="3" fill="#fff"/><text x="${L - 28}" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#1D3F99">●</text>`);
      x1 = L - 56;
    }
    if (p.format === "ch") {
      parties.push(`<rect x="14" y="30" width="44" height="52" fill="#D52B1E"/><rect x="31" y="38" width="10" height="36" fill="#fff"/><rect x="18" y="51" width="36" height="10" fill="#fff"/>`);
      x0 = 66;
    }
    const taille = p.format === "uk" ? 76 : 70;
    parties.push(`<text x="${(x0 + x1) / 2}" y="${H / 2 + taille * 0.36}" text-anchor="middle" font-family="'DIN Alternate', 'Arial Narrow', Arial, sans-serif" font-weight="700" font-size="${taille}" textLength="${Math.min(x1 - x0 - 10, p.texte.length * 40)}" lengthAdjust="spacingAndGlyphs" fill="${encre}">${p.texte.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`);
    return `<svg viewBox="0 0 ${L} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plaque ${p.texte}">${parties.join("")}</svg>`;
  }
};

/* Export pour le vérificateur Node (aucun accès au DOM au chargement). */
if (typeof module !== "undefined" && module.exports) {
  const P = require("./probleme.js");
  globalThis.champCorrect = globalThis.champCorrect || P.champCorrect;
  globalThis.formaterReponse = globalThis.formaterReponse || P.formaterReponse;
  module.exports = { normeEnquete, lireCoordonnees, distanceKm, champEnqueteCorrect, afficherReponseEnquete, Plaques };
}
