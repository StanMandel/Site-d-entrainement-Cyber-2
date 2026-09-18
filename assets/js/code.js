/* =============================================================
   Moteur des exercices de programmation (type "code")
   -------------------------------------------------------------
   Page en deux colonnes :
     - à gauche : le principe, un exemple, l'objectif ;
     - à droite : l'éditeur (bouton ▶ en haut à droite) et les
       résultats de l'exécution (tests, erreurs, état final).

   Le code est exécuté par AsmX86 (assembleur) ou MiniC (C) et
   vérifié par VerifCode. Le brouillon est gardé dans le navigateur.

   Utilisation :
     MoteurCode.lancer(conteneur, exercice, {
       slug, couleur, surRetour(), suivant: { titre, hash } | null
     });
   ============================================================= */

const MoteurCode = {
  CLE_BROUILLONS: "epita-entrainements:code:v1",

  lancer(conteneur, exo, contexte) {
    vider(conteneur);
    const asm = exo.langage !== "c";

    const etat = { exo, contexte, echecs: 0, solutionVue: false };

    const enonce = el("div", { class: "code-enonce" });
    const travail = el("div", { class: "code-travail" });
    conteneur.append(enonce, travail);

    /* ---- Colonne de gauche ---- */
    enonce.append(...cartesPrincipe(exo, asm ? "Assembleur" : "C"));

    const objectif = el("section", { class: "code-carte code-objectif" }, el("h3", { texte: "À vous de jouer" }));
    objectif.append(...blocsTexte(exo.consigne));
    for (const bloc of [].concat(exo.aTraduire || [])) {
      objectif.append(MoteurGuide._commande(bloc.code, bloc.legende || "À traduire"));
    }
    const regles = this._regles(exo);
    if (regles.length) {
      const liste = el("ul", { class: "code-regles" });
      for (const r of regles) liste.append(el("li", { html: texteRiche(r) }));
      objectif.append(liste);
    }
    enonce.append(objectif);

    /* ---- Colonne de droite : éditeur ---- */
    const editeur = this._editeur(asm, this._brouillon(contexte.slug, exo.id) ?? exo.depart ?? "");
    etat.editeur = editeur;

    const lancer = el("button", { class: "ed-lancer", type: "button", title: "Exécuter (Ctrl + Entrée)" }, "▶ Exécuter");
    const reinitialiser = el("button", { class: "ed-bouton", type: "button", title: "Revenir au code de départ" }, "↺");

    editeur.barre.append(
      el("span", { class: "ed-fichier", texte: asm ? "exercice.s" : "exercice.c" }),
      el("span", { class: "ed-espace" }),
      reinitialiser,
      lancer
    );

    const resultats = el("div", { class: "code-resultats" });
    travail.append(editeur.racine, resultats);

    const executer = () => this._executer(etat, resultats);
    lancer.addEventListener("click", executer);
    editeur.surExecuter = executer;
    editeur.surModification = () => this._sauverBrouillon(contexte.slug, exo.id, editeur.valeur());

    reinitialiser.addEventListener("click", () => {
      if (editeur.valeur() !== (exo.depart || "") && !confirm("Effacer votre code et revenir au code de départ ?")) return;
      editeur.definir(exo.depart || "");
      editeur.marquerErreur(null);
      this._sauverBrouillon(contexte.slug, exo.id, null);
      vider(resultats);
    });
  },

  _regles(exo) {
    const regles = [];
    const noms = (liste) => liste.map((r) => r.split("|").map((m) => "`" + m + "`").join(" / ")).join(", ");
    if (exo.imposer && exo.imposer.length) regles.push("**Obligatoire :** " + noms(exo.imposer));
    if (exo.interdire && exo.interdire.length) regles.push("**Interdit :** " + noms(exo.interdire));
    for (const m of exo.motifs || []) if (m.regle) regles.push("**Obligatoire :** " + m.regle);
    for (const m of exo.exclure || []) if (m.regle) regles.push("**Interdit :** " + m.regle);
    if (exo.aplati) regles.push("**Uniquement :** `if (…) goto étiquette;`, `goto` et des étiquettes — ni `while`, ni `for`, ni `else`, ni `{ }`.");
    return regles;
  },

  /* ---------------- Exécution et affichage des résultats ---------------- */

  _executer(etat, zone) {
    const { exo, contexte, editeur } = etat;
    const source = editeur.valeur();
    let r;
    try {
      r = VerifCode.verifier(exo, source);
    } catch (e) {
      vider(zone).append(el("div", { class: "code-bandeau ko" }, el("b", { texte: "Erreur interne" }), el("span", { texte: e.message })));
      return;
    }

    vider(zone);
    Progres.ecrire(contexte.slug, exo.id, r.contraintes.length ? 0 : r.score, Math.max(1, r.total));

    const ligneErreur = r.erreur ? r.erreur.ligne
      : (r.contraintes.find((c) => c.ligne) || {}).ligne
      || (r.tests.find((t) => t.erreur && t.erreur.ligne) || { erreur: {} }).erreur.ligne;
    editeur.marquerErreur(ligneErreur || null);

    /* Bandeau */
    if (r.ok) {
      etat.echecs = 0;
      const bandeau = el("div", { class: "code-bandeau ok" },
        el("b", { texte: "✓ Réussi" }),
        el("span", { texte: r.total + (r.total > 1 ? " tests validés" : " test validé") })
      );
      if (contexte.suivant) {
        bandeau.append(el("button", {
          class: "btn btn-principal btn-petit",
          onclick: () => App.aller(contexte.suivant.hash)
        }, "Exercice suivant →"));
      }
      zone.append(bandeau);
    } else {
      etat.echecs++;
      const titre = r.erreur ? (exo.langage === "c" ? "✕ Le code ne compile pas" : "✕ Le code ne s'assemble pas")
        : r.contraintes.length ? "✕ Consigne non respectée"
        : "✕ " + r.score + " test" + (r.score > 1 ? "s" : "") + " sur " + r.total + " réussi" + (r.score > 1 ? "s" : "");
      zone.append(el("div", { class: "code-bandeau ko" }, el("b", { texte: titre })));
    }

    if (r.erreur) zone.append(this._message(r.erreur));
    for (const c of r.contraintes) zone.append(this._message(c));

    /* Tests */
    if (r.tests.length) {
      const liste = el("div", { class: "code-tests" });
      for (const t of r.tests) liste.append(this._test(t));
      zone.append(liste);
    }

    if (r.sortie) {
      zone.append(el("div", { class: "code-sortie" },
        el("div", { class: "code-sous-titre", texte: "Sortie de printf" }),
        el("pre", { texte: r.sortie })
      ));
    }

    /* État final */
    if (r.etat && r.etat.length) {
      const grille = el("div", { class: "code-etat-grille" });
      for (const e of r.etat) {
        grille.append(el("div", { class: "code-etat-case " + e.sorte },
          el("span", { class: "code-etat-nom", texte: e.nom }),
          el("span", { class: "code-etat-valeur", texte: e.valeur })
        ));
      }
      zone.append(el("div", { class: "code-etat" },
        el("div", { class: "code-sous-titre", texte: "État final" + (r.tests.length > 1 ? " — test " + r.testAffiche : "") }),
        grille
      ));
    }

    /* Solution */
    if (!r.ok && exo.solution) {
      const boite = el("div", { class: "code-solution" });
      const afficher = () => {
        etat.solutionVue = true;
        vider(boite).append(MoteurGuide._commande(exo.solution, "Une solution"));
      };
      if (etat.solutionVue) afficher();
      else if (etat.echecs >= 2) {
        boite.append(el("button", { class: "btn btn-fantome btn-petit", onclick: afficher }, "Voir une solution"));
      }
      zone.append(boite);
    }
  },

  _message(m) {
    return el("div", { class: "code-message" },
      m.ligne ? el("span", { class: "code-message-ligne", texte: "Ligne " + m.ligne }) : null,
      el("span", { texte: m.message })
    );
  },

  _test(t) {
    const entrees = VerifCode.decrireEntrees(t.entrees);
    const tete = el("div", { class: "code-test-tete" },
      el("span", { class: "code-test-marque", texte: t.ok ? "✓" : "✕" }),
      el("b", { texte: "Test " + t.numero }),
      entrees ? el("span", { class: "code-test-entrees", texte: "avec " + entrees }) : null
    );

    const table = el("table", {},
      el("thead", {}, el("tr", {}, el("th", { texte: "" }), el("th", { texte: "Attendu" }), el("th", { texte: "Obtenu" })))
    );
    const corps = el("tbody");
    for (const l of t.lignes) {
      corps.append(el("tr", { class: l.ok ? "" : "faux" },
        el("td", { class: "cle", texte: l.cle }),
        el("td", { texte: l.attendu }),
        el("td", { texte: l.obtenu })
      ));
    }
    table.append(corps);

    return el("div", { class: "code-test " + (t.ok ? "ok" : "ko") },
      tete,
      t.erreur ? this._message(t.erreur) : null,
      el("div", { class: "code-test-table" }, table)
    );
  },

  /* ---------------- Brouillons (navigateur) ---------------- */

  _brouillons() {
    try {
      return JSON.parse(localStorage.getItem(this.CLE_BROUILLONS)) || {};
    } catch (e) {
      return {};
    }
  },

  _brouillon(slug, id) {
    const b = this._brouillons()[slug + "/" + id];
    return typeof b === "string" ? b : null;
  },

  _sauverBrouillon(slug, id, code) {
    try {
      const tout = this._brouillons();
      if (code === null) delete tout[slug + "/" + id];
      else tout[slug + "/" + id] = code;
      localStorage.setItem(this.CLE_BROUILLONS, JSON.stringify(tout));
    } catch (e) {
      /* stockage indisponible : le brouillon n'est simplement pas gardé */
    }
  },

  /* ---------------- Éditeur ---------------- */

  _editeur(asm, texteInitial) {
    const barre = el("div", { class: "ed-barre" });
    const numeros = el("div", { class: "ed-numeros", "aria-hidden": "true" });
    const couleurs = el("pre", { class: "ed-couleurs", "aria-hidden": "true" });
    const saisie = el("textarea", {
      class: "ed-saisie", spellcheck: "false", autocomplete: "off",
      autocapitalize: "off", autocorrect: "off", wrap: "off",
      "aria-label": "Code de l'exercice"
    });
    const racine = el("div", { class: "ed" },
      barre,
      el("div", { class: "ed-corps" }, numeros, el("div", { class: "ed-texte" }, couleurs, saisie))
    );

    const tab = asm ? 8 : 4;
    let ligneErreur = null;
    const api = {
      racine, barre,
      surExecuter: null,
      surModification: null,
      valeur: () => saisie.value,
      definir(texte) { saisie.value = texte; maj(); },
      marquerErreur(ligne) { ligneErreur = ligne; majNumeros(); }
    };

    function majNumeros() {
      const n = saisie.value.split("\n").length;
      vider(numeros);
      for (let i = 1; i <= n; i++) {
        numeros.append(el("span", { class: i === ligneErreur ? "erreur" : "", texte: String(i) }));
      }
    }

    function maj() {
      couleurs.innerHTML = (asm ? colorerAsm : colorerC)(saisie.value) + "\n";
      majNumeros();
      saisie.style.height = "auto";
      saisie.style.height = saisie.scrollHeight + "px";
      couleurs.style.transform = "translateX(" + -saisie.scrollLeft + "px)";
    }

    let minuterie = null;
    saisie.addEventListener("input", () => {
      if (ligneErreur) { ligneErreur = null; }
      maj();
      clearTimeout(minuterie);
      minuterie = setTimeout(() => api.surModification && api.surModification(), 300);
    });
    saisie.addEventListener("scroll", () => {
      couleurs.style.transform = "translateX(" + -saisie.scrollLeft + "px)";
    });

    const inserer = (texte) => {
      saisie.focus();
      const ok = document.execCommand && document.execCommand("insertText", false, texte);
      if (!ok) {
        saisie.setRangeText(texte, saisie.selectionStart, saisie.selectionEnd, "end");
        saisie.dispatchEvent(new Event("input"));
      }
    };

    saisie.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (api.surExecuter) api.surExecuter();
        return;
      }
      const debutLigne = saisie.value.lastIndexOf("\n", saisie.selectionStart - 1) + 1;
      if (e.key === "Tab" && !e.shiftKey && saisie.selectionStart === saisie.selectionEnd) {
        e.preventDefault();
        const colonne = saisie.selectionStart - debutLigne;
        inserer(" ".repeat(tab - (colonne % tab)));
        return;
      }
      if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const ligne = saisie.value.slice(debutLigne, saisie.selectionStart);
        let retrait = /^[ \t]*/.exec(ligne)[0];
        if (asm && /^\s*[A-Za-z_.][\w.$]*:\s*$/.test(ligne)) retrait = " ".repeat(8);
        if (!asm && /\{\s*$/.test(ligne)) retrait += "    ";
        inserer("\n" + retrait);
      }
    });

    saisie.value = texteInitial;
    requestAnimationFrame(maj);
    maj();
    return api;
  }
};

/* -------------------------------------------------------------
   Texte d'un principe ou d'une consigne : chaîne ou tableau.
   Chaque élément du tableau est :
     - une chaîne          → un paragraphe ;
     - un tableau          → une liste à pastilles ;
     - { titre }           → un intertitre ;
     - { entetes, lignes } → un tableau (même format que les guides).
   ------------------------------------------------------------- */

function blocsTexte(contenu) {
  return [].concat(contenu || []).map((bloc) => {
    if (bloc && bloc.titre) return el("h4", { class: "code-intertitre", html: texteRiche(bloc.titre) });
    if (bloc && bloc.entetes) return MoteurGuide._tableau(bloc);
    if (!Array.isArray(bloc)) return el("p", { html: texteRiche(bloc) });
    const liste = el("ul", { class: "code-puces" });
    for (const element of bloc) liste.append(el("li", { html: texteRiche(element) }));
    return liste;
  });
}

/* -------------------------------------------------------------
   Cartes « Le principe » et « Exemple » d'un exercice.
   Communes aux exercices de programmation et aux QCM.
   ------------------------------------------------------------- */

function cartesPrincipe(exo, legendeParDefaut) {
  const cartes = [];
  if (exo.cours) {
    const carte = el("section", { class: "code-carte" }, el("h3", { texte: "Le principe" }));
    carte.append(...blocsTexte(exo.cours));
    cartes.push(carte);
  }
  for (const exemple of [].concat(exo.exemple || [])) {
    const carte = el("section", { class: "code-carte" }, el("h3", { texte: exemple.titre || "Exemple" }));
    if (exemple.texte) carte.append(el("p", { html: texteRiche(exemple.texte) }));
    carte.append(MoteurGuide._commande(exemple.code, exemple.legende || legendeParDefaut));
    if (exemple.note) carte.append(el("p", { class: "code-note", html: texteRiche(exemple.note) }));
    cartes.push(carte);
  }
  return cartes;
}

/* -------------------------------------------------------------
   Coloration syntaxique (le texte est échappé avant coloration)
   ------------------------------------------------------------- */

function echapperHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const envelopper = (classe, texte) => '<span class="' + classe + '">' + echapperHtml(texte) + "</span>";

function colorerAsm(source) {
  return source.split("\n").map((ligne) => {
    let code = ligne, commentaire = "";
    let dansChaine = false;
    for (let i = 0; i < ligne.length; i++) {
      const c = ligne[i];
      if (c === '"' && ligne[i - 1] !== "\\") dansChaine = !dansChaine;
      if (c === "'" && !dansChaine) { i += ligne[i + 1] === "\\" ? 2 : 1; continue; }
      if (c === "#" && !dansChaine) { code = ligne.slice(0, i); commentaire = ligne.slice(i); break; }
    }

    let sortie = "";
    let mnemoniqueVu = false;
    const motif = /("(?:[^"\\]|\\.)*"?)|('\\?.'?)|(%[A-Za-z0-9]+)|(\$[^,\s()]*)|(^\s*[A-Za-z_.][\w.$]*\s*:)|(\.[A-Za-z_]+)|([A-Za-z_][\w.$]*)|(0x[0-9a-fA-F]+|\d+)|([\s\S])/g;
    let m;
    while ((m = motif.exec(code))) {
      if (m[1] || m[2]) sortie += envelopper("tk-chaine", m[0]);
      else if (m[3]) sortie += envelopper("tk-registre", m[0]);
      else if (m[4]) sortie += envelopper("tk-immediat", m[0]);
      else if (m[5]) {
        const espaces = /^\s*/.exec(m[0])[0];
        sortie += espaces + envelopper("tk-etiquette", m[0].slice(espaces.length));
      } else if (m[6] && !mnemoniqueVu) { sortie += envelopper("tk-directive", m[0]); mnemoniqueVu = true; }
      else if (m[7]) {
        if (!mnemoniqueVu) { sortie += envelopper("tk-instruction", m[0]); mnemoniqueVu = true; }
        else sortie += envelopper("tk-nom", m[0]);
      } else if (m[8]) sortie += envelopper("tk-nombre", m[0]);
      else sortie += echapperHtml(m[0]);
    }
    return sortie + (commentaire ? envelopper("tk-commentaire", commentaire) : "");
  }).join("\n");
}

const MOTS_C = new Set(["if", "else", "while", "for", "do", "break", "continue", "return", "goto", "sizeof", "switch", "case", "default"]);
const TYPES_C = new Set(["char", "short", "int", "long", "signed", "unsigned", "void", "struct", "const", "static"]);

function colorerC(source) {
  let sortie = "";
  const motif = /(\/\*[\s\S]*?(?:\*\/|$))|(\/\/[^\n]*)|(^[ \t]*#[^\n]*)|("(?:[^"\\\n]|\\.)*"?)|('(?:[^'\\\n]|\\.)*'?)|(^[ \t]*[A-Za-z_]\w*[ \t]*:(?!:))|([A-Za-z_]\w*)|(0x[0-9a-fA-F]+|\d+)([uUlL]*)|([\s\S])/gm;
  let m;
  while ((m = motif.exec(source))) {
    if (m[1] || m[2]) sortie += m[0].split("\n").map((l) => envelopper("tk-commentaire", l)).join("\n");
    else if (m[3]) sortie += envelopper("tk-directive", m[0]);
    else if (m[4] || m[5]) sortie += envelopper("tk-chaine", m[0]);
    else if (m[6]) {
      const espaces = /^[ \t]*/.exec(m[0])[0];
      const mot = /[A-Za-z_]\w*/.exec(m[0])[0];
      if (MOTS_C.has(mot) || TYPES_C.has(mot)) {
        sortie += espaces + envelopper("tk-instruction", mot);
        motif.lastIndex = m.index + espaces.length + mot.length;
        continue;
      }
      sortie += espaces + envelopper("tk-etiquette", m[0].slice(espaces.length));
    } else if (m[7]) {
      sortie += MOTS_C.has(m[0]) ? envelopper("tk-instruction", m[0])
        : TYPES_C.has(m[0]) ? envelopper("tk-type", m[0])
        : envelopper("tk-nom", m[0]);
    } else if (m[8]) sortie += envelopper("tk-nombre", m[0]);
    else sortie += echapperHtml(m[0]);
  }
  return sortie;
}
