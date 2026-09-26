/* =============================================================
   Moteur des mini-cours à réponse saisie (type "probleme")
   -------------------------------------------------------------
   Un exercice tient en deux temps, choisis par des onglets en
   haut de la page :
     - « Exemple »   : un problème entièrement résolu (énoncé,
                       formule / méthode, réponse) ;
     - « Exercice »  : un problème similaire à résoudre, avec une
                       barre de saisie et un bouton « Caractères
                       spéciaux » pour insérer Θ, Ω, ≤, ², ⌊ ⌋…

   Deux usages, mêmes rouages :
     - mini-cours général  : exemple = { enonce, formule, reponse } ;
     - comptage d'opérations : un champ « methode » toujours visible
       au-dessus des onglets, puis exemple/exercice avec du code.

   Utilisation :
     MoteurProbleme.lancer(conteneur, exercice, {
       slug, couleur, surRetour(), suivant: { titre, hash } | null,
       surFin(score, total)
     });
   ============================================================= */

/* Jeu de caractères proposé par le bouton « Caractères spéciaux ».
   Chaque entrée insère le symbole tel quel à l'endroit du curseur. */
const CARACTERES_SPECIAUX = [
  "Θ", "Ω", "O", "o", "≤", "≥", "≠", "≈",
  "²", "³", "ⁿ", "·", "×", "√", "∑", "→",
  "⌊", "⌋", "⌈", "⌉", "⁄", "∞", "π", "ε",
  "log", "≥1", "log(n)"
];

const MoteurProbleme = {
  lancer(conteneur, exo, contexte) {
    const etat = {
      exo,
      contexte,
      exercices: [].concat(exo.exercice || exo.exercices || []),
      justes: 0,
      resolus: 0,
      finAffichee: false,
      _conteneur: conteneur
    };
    this._rendre(conteneur, etat);
  },

  /* ---------------- Structure : méthode, onglets, panneaux ---------------- */

  _rendre(conteneur, etat) {
    vider(conteneur);
    const exo = etat.exo;

    /* Rappel de méthode, toujours visible (comptage d'opérations). */
    if (exo.methode) {
      const carte = el("section", { class: "code-carte pb-methode" },
        el("h3", { texte: exo.methodeTitre || "Méthode" })
      );
      carte.append(...blocsTexte(exo.methode));
      conteneur.append(carte);
    }

    const panneaux = {};
    const boutons = {};
    const activer = (cle) => {
      for (const [k, p] of Object.entries(panneaux)) p.style.display = k === cle ? "" : "none";
      for (const [k, b] of Object.entries(boutons)) b.classList.toggle("actif", k === cle);
    };

    const onglets = el("div", { class: "pb-onglets" });
    const defs = [];
    if (exo.exemple) defs.push(["exemple", "Exemple"]);
    defs.push(["exercice", etat.exercices.length > 1 ? "Exercices" : "Exercice"]);
    for (const [cle, libelle] of defs) {
      boutons[cle] = el("button", { class: "pb-onglet", type: "button", onclick: () => activer(cle) }, libelle);
      onglets.append(boutons[cle]);
    }
    conteneur.append(onglets);

    if (exo.exemple) {
      panneaux.exemple = this._panneauExemple(exo.exemple);
      conteneur.append(panneaux.exemple);
    }
    panneaux.exercice = this._panneauExercice(conteneur, etat);
    conteneur.append(panneaux.exercice);

    activer(exo.exemple ? "exemple" : "exercice");
  },

  /* ---------------- Panneau « Exemple » (résolu) ---------------- */

  _panneauExemple(ex) {
    const panneau = el("div", { class: "pb-panneau" });

    if (ex.enonce || ex.code || ex.schema) {
      panneau.append(this._carte("Problème", { texte: ex.enonce, schema: ex.schema, code: ex.code, langage: ex.langage, legende: ex.legende }));
    }
    if (ex.formule) {
      panneau.append(this._carte(ex.formuleTitre || "Formule", { texte: ex.formule, classe: "pb-formule" }));
    }
    if (ex.reponse || ex.reponseCode) {
      panneau.append(this._carte("Réponse", { texte: ex.reponse, code: ex.reponseCode, langage: ex.langage, classe: "pb-reponse" }));
    }
    return panneau;
  },

  /* Une carte-section : titre court + paragraphes/listes + bloc de code. */
  _carte(titre, opts) {
    const carte = el("section", { class: "code-carte" + (opts.classe ? " " + opts.classe : "") },
      el("h3", { texte: titre })
    );
    if (opts.texte) carte.append(...blocsTexte(opts.texte));
    if (opts.schema) carte.append(...this._schemas(opts.schema));
    if (opts.code) carte.append(this._blocCode(opts.code, opts.langage, opts.legende));
    return carte;
  },

  /* Un ou plusieurs schémas SVG (assets/js/schemas.js), légende facultative. */
  _schemas(spec) {
    return [].concat(spec).map((s) => el("figure", { class: "pb-schema", html: Schemas.svg(s) },
      s.legende ? el("figcaption", { html: texteRiche(s.legende) }) : null
    ));
  },

  _blocCode(code, langage, legende) {
    const colorer = langage === "asm" ? colorerAsm : colorerC;
    const bloc = el("pre", { class: "bloc-code", html: colorer(code) });
    if (!legende) return bloc;
    return el("div", { class: "pb-code" },
      el("div", { class: "pb-code-legende", texte: legende }),
      bloc
    );
  },

  /* ---------------- Panneau « Exercice » (à résoudre) ---------------- */

  _panneauExercice(conteneur, etat) {
    const panneau = el("div", { class: "pb-panneau" });
    etat.exercices.forEach((item, i) => {
      panneau.append(this._bloc(conteneur, etat, item, i));
    });
    etat._panneauExercice = panneau;
    return panneau;
  },

  _bloc(conteneur, etat, item, index) {
    const multiple = etat.exercices.length > 1;
    const titre = multiple ? "Problème " + (index + 1) : "À vous de jouer";
    const carte = el("section", { class: "code-carte code-objectif" }, el("h3", { texte: titre }));
    if (item.enonce) carte.append(...blocsTexte(item.enonce));
    if (item.schema) carte.append(...this._schemas(item.schema));
    if (item.code) carte.append(this._blocCode(item.code, item.langage, item.legende));

    const zone = el("div", { class: "pb-reaction" });
    const barre = item.champs ? this._champs(conteneur, etat, item, zone) : this._barre(conteneur, etat, item, zone);
    carte.append(barre, zone);
    return carte;
  },

  /* Plusieurs cases de réponse (champ « champs »), un seul « Vérifier ».
     Une case juste est verrouillée ; le problème est réussi quand toutes
     le sont. Après deux essais, « Voir la réponse » donne les valeurs. */
  _champs(conteneur, etat, item, zone) {
    let resolu = false;
    let essais = 0;

    const lignes = item.champs.map((champ) => {
      const saisie = el("input", {
        class: "jp-saisie pb-champ", type: "text",
        autocomplete: "off", spellcheck: "false", autocapitalize: "off"
      });
      const ligne = el("label", { class: "pb-ligne" },
        el("span", { class: "pb-libelle", html: texteRiche(champ.libelle || "Réponse") }),
        el("span", { class: "pb-entree" }, saisie,
          el("span", { class: "pb-unite", texte: champ.unite || "" }))
      );
      return { champ, saisie, ligne, bon: false };
    });

    const btnValider = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");

    const verrouiller = () => {
      resolu = true;
      btnValider.disabled = true;
      for (const l of lignes) l.saisie.disabled = true;
    };

    const valider = () => {
      if (resolu) return;
      const restants = lignes.filter((l) => !l.bon);
      const vide = restants.find((l) => !l.saisie.value.trim());
      if (vide) { vide.saisie.focus(); return; }
      essais++;
      for (const l of restants) {
        l.saisie.classList.remove("flash-ko");
        if (champCorrect(l.saisie.value, l.champ)) {
          l.bon = true;
          l.saisie.disabled = true;
          l.saisie.classList.add("flash-ok");
        } else {
          void l.saisie.offsetWidth;
          l.saisie.classList.add("flash-ko");
        }
      }
      const faux = lignes.filter((l) => !l.bon);
      if (!faux.length) {
        verrouiller();
        this._reactionChamps(zone, true, item);
        this._compter(etat, true, conteneur);
        return;
      }
      faux[0].saisie.focus();
      this._reactionChamps(zone, false, item, { faux: faux.length, essais }, () => {
        verrouiller();
        for (const l of faux) l.saisie.classList.add("pb-revele");
        this._reactionChamps(zone, "revele", item);
        this._compter(etat, false, conteneur);
      });
    };

    btnValider.addEventListener("click", valider);
    for (const l of lignes) {
      l.saisie.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); valider(); } });
    }

    return el("div", { class: "pb-saisie pb-champs" },
      ...lignes.map((l) => l.ligne),
      el("div", { class: "pb-valider" }, btnValider)
    );
  },

  _reactionChamps(zone, bon, item, info, surRevele) {
    vider(zone);
    if (bon === true || bon === "revele") {
      zone.append(el("div", { class: "explication" + (bon === true ? " ok" : "") },
        el("b", { texte: bon === true ? "✓ Correct" : "Réponses attendues" }),
        this._listeReponses(item)
      ));
      if (item.solution) zone.append(this._solution(item));
      return;
    }
    const n = info.faux;
    zone.append(el("div", { class: "explication" },
      el("b", { texte: "✕ Pas encore — " }),
      el("span", { texte: n + (n > 1 ? " réponses à corriger. " : " réponse à corriger. ") }),
      item.indice ? el("span", { html: texteRiche(item.indice) }) : null
    ));
    if (info.essais >= 2) {
      zone.append(el("button", { class: "btn btn-fantome btn-petit", type: "button", onclick: surRevele }, "Voir la réponse"));
    }
  },

  _listeReponses(item) {
    const liste = el("ul", { class: "pb-attendues" });
    for (const champ of item.champs) {
      liste.append(el("li", {},
        el("span", { html: texteRiche(champ.libelle || "Réponse") + " : " }),
        el("code", { texte: formaterReponse(champ) })
      ));
    }
    return liste;
  },

  /* Barre de saisie : bouton « Caractères spéciaux », champ, « Vérifier ». */
  _barre(conteneur, etat, item, zone) {
    let resolu = false;
    let essais = 0;

    const champ = el("input", {
      class: "jp-saisie pb-champ", type: "text",
      autocomplete: "off", spellcheck: "false", autocapitalize: "off"
    });

    const inserer = (texte) => {
      const debut = champ.selectionStart ?? champ.value.length;
      const fin = champ.selectionEnd ?? champ.value.length;
      champ.value = champ.value.slice(0, debut) + texte + champ.value.slice(fin);
      const pos = debut + texte.length;
      champ.focus();
      champ.setSelectionRange(pos, pos);
    };

    const clavier = el("div", { class: "pb-clavier", hidden: true });
    for (const c of CARACTERES_SPECIAUX) {
      clavier.append(el("button", { class: "pb-touche", type: "button", tabindex: "-1", onclick: () => { if (!resolu) inserer(c); } }, c));
    }

    const btnSpec = el("button", {
      class: "btn btn-doux pb-spec", type: "button",
      "aria-expanded": "false", title: "Insérer un symbole",
      onclick: () => {
        const ouvert = clavier.hasAttribute("hidden");
        if (ouvert) clavier.removeAttribute("hidden"); else clavier.setAttribute("hidden", "");
        btnSpec.setAttribute("aria-expanded", String(ouvert));
        btnSpec.classList.toggle("actif", ouvert);
      }
    }, "Ω Caractères spéciaux");

    const btnValider = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");

    const valider = () => {
      if (resolu) return;
      if (!champ.value.trim()) { champ.focus(); return; }
      essais++;
      const bon = MoteurProbleme._correcte(champ.value, item);
      if (bon) {
        resolu = true;
        champ.disabled = true;
        champ.classList.add("flash-ok");
        btnValider.disabled = true;
        clavier.setAttribute("hidden", "");
        this._reaction(zone, true, item);
        this._compter(etat, true, conteneur);
      } else {
        champ.classList.remove("flash-ok");
        champ.classList.add("flash-ko");
        setTimeout(() => champ.classList.remove("flash-ko"), 400);
        this._reaction(zone, false, item, essais, () => {
          resolu = true;
          champ.disabled = true;
          btnValider.disabled = true;
          clavier.setAttribute("hidden", "");
          this._reaction(zone, "revele", item);
          this._compter(etat, false, conteneur);
        });
      }
    };

    btnValider.addEventListener("click", valider);
    champ.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); valider(); } });

    return el("div", { class: "pb-saisie" },
      el("div", { class: "pb-saisie-ligne" }, btnSpec, champ, btnValider),
      clavier
    );
  },

  /* Message après une tentative. bon = true / false / "revele". */
  _reaction(zone, bon, item, essais, surRevele) {
    vider(zone);
    if (bon === true) {
      const boite = el("div", { class: "explication ok" }, el("b", { texte: "✓ Correct — " }),
        el("span", { texte: "réponse : " }), el("code", { texte: MoteurProbleme._reponsePrincipale(item) }));
      zone.append(boite);
      if (item.solution) zone.append(this._solution(item));
      return;
    }
    if (bon === "revele") {
      const boite = el("div", { class: "explication" }, el("b", { texte: "Réponse attendue — " }),
        el("code", { texte: MoteurProbleme._reponsePrincipale(item) }));
      zone.append(boite);
      if (item.solution) zone.append(this._solution(item));
      return;
    }
    /* Tentative fausse */
    const boite = el("div", { class: "explication" },
      el("b", { texte: "✕ Pas encore — " }),
      el("span", { html: texteRiche(item.indice || "vérifiez la forme de votre réponse, puis réessayez.") })
    );
    zone.append(boite);
    if (essais >= 2 && item.solution) {
      zone.append(el("button", { class: "btn btn-fantome btn-petit", type: "button", onclick: surRevele }, "Voir la réponse"));
    }
  },

  _solution(item) {
    const boite = el("div", { class: "pb-solution" }, el("h4", { class: "code-intertitre", texte: "Explication" }));
    boite.append(...blocsTexte(item.solution));
    if (item.solutionCode) boite.append(this._blocCode(item.solutionCode, item.langage, item.solutionLegende));
    return boite;
  },

  /* ---------------- Score et fin ---------------- */

  _compter(etat, juste, conteneur) {
    etat.resolus++;
    if (juste) etat.justes++;
    Progres.ecrire(etat.contexte.slug, etat.exo.id, etat.justes, etat.exercices.length);
    if (etat.resolus === etat.exercices.length && !etat.finAffichee) {
      etat.finAffichee = true;
      this._fin(etat);
      if (etat.contexte.surFin) etat.contexte.surFin(etat.justes, etat.exercices.length);
    }
  },

  _fin(etat) {
    const total = etat.exercices.length;
    const parfait = etat.justes === total;
    const banniere = el("div", { class: "code-bandeau " + (parfait ? "ok" : "ko") },
      el("b", { texte: parfait ? "✓ Terminé" : "Terminé" }),
      el("span", { texte: etat.justes + " / " + total + (total > 1 ? " problèmes réussis" : " problème réussi") })
    );
    banniere.append(el("button", {
      class: "btn btn-doux btn-petit", type: "button",
      onclick: () => MoteurProbleme.lancer(etat._conteneur, etat.exo, etat.contexte)
    }, "↻ Recommencer"));
    if (etat.contexte.suivant) {
      banniere.append(el("button", {
        class: "btn btn-principal btn-petit", type: "button",
        onclick: () => App.aller(etat.contexte.suivant.hash)
      }, "Exercice suivant →"));
    }
    etat._panneauExercice.append(banniere);
    banniere.scrollIntoView({ behavior: "smooth", block: "nearest" });
  },

  /* ---------------- Comparaison des réponses ---------------- */

  _reponsePrincipale(item) {
    return [].concat(item.reponse)[0];
  },

  _correcte(saisie, item) {
    const attendues = [].concat(item.reponse, item.accepte || []).filter((r) => r != null);
    const g = looseReponse(saisie);
    if (!g) return false;
    return attendues.some((a) => looseReponse(a) === g);
  }
};

/* -------------------------------------------------------------
   Normalisation d'une réponse saisie.
   normeReponse : forme stricte, unifie la notation mathématique.
   looseReponse : en plus, ignore * ( ) — « O(n log n) », « O(nlogn) »
   et « O(n·log(n)) » deviennent équivalents.
   Ces deux fonctions sont partagées avec outils/verifier-exercices.js.
   ------------------------------------------------------------- */
function normeReponse(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[θϑ]/g, "theta")
    .replace(/[ωϖ]/g, "omega")
    .replace(/[·⋅×∗]/g, "*")
    .replace(/\*\*/g, "^")
    .replace(/⁰/g, "^0").replace(/¹/g, "^1").replace(/²/g, "^2").replace(/³/g, "^3")
    .replace(/⁴/g, "^4").replace(/⁵/g, "^5").replace(/ⁿ/g, "^n")
    .replace(/[₀]/g, "0").replace(/[₁]/g, "1").replace(/[₂]/g, "2").replace(/[₃]/g, "3")
    .replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/≠/g, "!=").replace(/≈/g, "~")
    .replace(/[⁄∕]/g, "/")
    .replace(/√/g, "sqrt")
    .replace(/π/g, "pi")
    .replace(/\bln\b/g, "log")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "");
}

function looseReponse(s) {
  return normeReponse(s).replace(/[*()]/g, "");
}

/* -------------------------------------------------------------
   Cases de réponse (champ « champs »).
   Réponse attendue numérique : la saisie est lue comme un nombre
   (virgule ou point, « 5e-5 », « 5×10^-5 », « 10⁻⁵ », « 2/3 »,
   unité recopiée tolérée) et comparée avec une tolérance relative
   (champ « tolerance », 1 % par défaut). Réponse texte : comparaison
   souple de looseReponse.
   ------------------------------------------------------------- */
const EXPOSANTS = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };

function lireNombre(saisie, unite) {
  let s = String(saisie ?? "").toLowerCase()
    .replace(/[\s  ]/g, "")
    .replace(/µ/g, "u")
    .replace(/[−–]/g, "-")
    .replace(/,/g, ".")
    .replace(/10([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, e) => "10^" + [...e].map((c) => EXPOSANTS[c]).join(""));
  if (unite) {
    const u = String(unite).toLowerCase().replace(/\s/g, "").replace(/µ/g, "u");
    if (u && s.endsWith(u) && s.length > u.length) s = s.slice(0, -u.length);
  }
  const nombre = "[-+]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[-+]?\\d+)?";
  let m;
  if ((m = s.match(new RegExp("^(" + nombre + ")$")))) return Number(m[1]);
  if ((m = s.match(new RegExp("^(" + nombre + ")[×·x*]10\\^\\(?([-+]?\\d+)\\)?$")))) return Number(m[1]) * 10 ** Number(m[2]);
  if ((m = s.match(/^10\^\(?([-+]?\d+)\)?$/))) return 10 ** Number(m[1]);
  if ((m = s.match(new RegExp("^(" + nombre + ")/(" + nombre + ")$"))) && Number(m[2]) !== 0) return Number(m[1]) / Number(m[2]);
  return null;
}

function champCorrect(saisie, champ) {
  const attendues = [].concat(champ.reponse, champ.accepte || []).filter((r) => r != null);
  if (typeof champ.reponse === "number") {
    const v = lireNombre(saisie, champ.unite);
    if (v === null || !Number.isFinite(v)) return false;
    const tol = champ.tolerance ?? 0.01;
    return attendues.some((a) => Math.abs(v - a) <= Math.max(Math.abs(a) * tol, 1e-12));
  }
  const g = looseReponse(saisie);
  return !!g && attendues.some((a) => looseReponse(a) === g);
}

/* Réponse attendue telle qu'affichée : « 0,6 », « 20 kHz ». */
function formaterReponse(champ) {
  const r = typeof champ.reponse === "number"
    ? String(champ.reponse).replace(".", ",")
    : String(champ.reponse);
  return champ.unite ? r + " " + champ.unite : r;
}

/* Export pour le vérificateur Node (aucun accès au DOM au chargement). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { normeReponse, looseReponse, lireNombre, champCorrect, formaterReponse };
}
