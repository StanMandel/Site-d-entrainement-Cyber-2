/* =============================================================
   Moteur des leçons (type "lecon")
   -------------------------------------------------------------
   Une leçon se parcourt en cinq onglets :
     1. Cours         : explications pas à pas (Précédent / Suivant),
                        chacune illustrée d'un schéma, avec la
                        rédaction modèle ;
     2. Problématique : la question concrète que la leçon résout ;
     3. Exemple       : un cas précis à traiter ;
     4. Correction    : sa résolution rédigée ;
     5. Exercices     : de difficulté croissante (niveau 1 à 4).

   Exercices (champ « type » de chaque exercice) :
     qcm        : choix (une ou plusieurs bonnes réponses) ;
     champs     : cases de réponse (nombre, texte, ensemble, suite) ;
     construire : tracer les arêtes d'un graphe en cliquant ;
     selection  : choisir des sommets (ou des arêtes) d'un graphe ;
     ordre      : cliquer des sommets dans l'ordre (parcours, chaîne) ;
     matrice    : remplir une matrice case par case ;
     remettre   : remettre les étapes d'une rédaction dans l'ordre ;
     lignes     : cliquer les lignes d'un code (champ « code ») ;
     cout       : donner la classe (Θ(1), O(n)…) de lignes d'un code.
   La correction des exercices sur graphe est faite par Graphes.evaluer
   (assets/js/graphes.js), partagée avec le vérificateur Node.
   Un exercice qcm, champs ou remettre peut afficher un code C numéroté
   (champ « code »).

   Blocs de contenu propres aux leçons (en plus de ceux de blocsTexte) :
     { schema }     un ou plusieurs schémas ;
     { animation }  exécution animée d'un code C (assets/js/trace.js) ;
     { demo }       démonstration révélée ligne par ligne :
                    { enonce, lignes: [["Soit n ≥ 1.", "on fixe n"], …] } ;
     { codeC, legende } code C coloré et numéroté ;
     { redaction }, { code, legende }, { remarque }, { attention }.
   Une étape du cours a un « schema » ou une « animation », et peut
   avoir une « redaction » et une « demo ».

   Utilisation :
     MoteurLecon.lancer(conteneur, lecon, {
       slug, couleur, surRetour(), suivant: { titre, hash } | null,
       surFin(score, total)
     });
   ============================================================= */

const MoteurLecon = {
  ONGLETS: [
    ["cours", "Cours"],
    ["problematique", "Problématique"],
    ["exemple", "Exemple"],
    ["correction", "Correction"],
    ["exercices", "Exercices"]
  ],

  NIVEAUX: {
    1: ["★", "Application directe"],
    2: ["★★", "Entraînement"],
    3: ["★★★", "Niveau TD"],
    4: ["★★★★", "Au-delà du TD"]
  },

  lancer(conteneur, lecon, contexte) {
    const etat = {
      lecon,
      contexte,
      conteneur,
      exercices: lecon.exercices || [],
      resultats: (lecon.exercices || []).map(() => null),
      justes: 0,
      finAffichee: false,
      etape: 0,
      exo: 0,
      panneaux: {},
      boutons: {},
      cartes: []
    };
    this._rendre(etat);
  },

  /* ---------------- Coquille : onglets et panneaux ---------------- */

  _rendre(etat) {
    const { conteneur, lecon } = etat;
    vider(conteneur);

    const presents = this.ONGLETS.filter(([cle]) =>
      cle === "cours" ? (lecon.cours || []).length
        : cle === "exercices" ? etat.exercices.length
          : !!lecon[cle]);

    const barre = el("nav", { class: "lc-onglets" });
    presents.forEach(([cle, libelle], i) => {
      etat.boutons[cle] = el("button", {
        class: "lc-onglet", type: "button",
        onclick: () => this._activer(etat, cle)
      }, el("span", { class: "lc-onglet-num", texte: String(i + 1) }), libelle);
      barre.append(etat.boutons[cle]);
    });
    conteneur.append(barre);
    etat._barre = barre;
    etat._ordre = presents.map(([cle]) => cle);

    for (const [cle] of presents) {
      const panneau = el("div", { class: "lc-panneau" });
      etat.panneaux[cle] = panneau;
      conteneur.append(panneau);
    }
    if (etat.panneaux.cours) this._panneauCours(etat);
    if (etat.panneaux.problematique) this._panneauSimple(etat, "problematique", "Problématique");
    if (etat.panneaux.exemple) this._panneauSimple(etat, "exemple", "Exemple");
    if (etat.panneaux.correction) this._panneauSimple(etat, "correction", "Correction");
    if (etat.panneaux.exercices) this._panneauExercices(etat);

    this._activer(etat, etat._ordre[0], true);
  },

  _activer(etat, cle, sansDefilement) {
    for (const [k, p] of Object.entries(etat.panneaux)) p.style.display = k === cle ? "" : "none";
    for (const [k, b] of Object.entries(etat.boutons)) b.classList.toggle("actif", k === cle);
    etat.onglet = cle;
    if (!sansDefilement && etat._barre.getBoundingClientRect().top < 0) {
      etat._barre.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  /* Bouton « onglet suivant → » en bas d'un panneau. */
  _versSuivant(etat, cle) {
    const i = etat._ordre.indexOf(cle);
    const suivant = etat._ordre[i + 1];
    if (!suivant) return null;
    const libelle = this.ONGLETS.find(([k]) => k === suivant)[1];
    return el("div", { class: "lc-nav" },
      i > 0 ? el("button", {
        class: "btn btn-fantome", type: "button",
        onclick: () => this._activer(etat, etat._ordre[i - 1])
      }, "← " + this.ONGLETS.find(([k]) => k === etat._ordre[i - 1])[1]) : null,
      el("span", { class: "espace" }),
      el("button", { class: "btn btn-principal", type: "button", onclick: () => this._activer(etat, suivant) }, libelle + " →")
    );
  },

  /* ---------------- Contenu riche ----------------
     Chaîne = paragraphe ; tableau = liste à pastilles ;
     { titre } intertitre ; { entetes, lignes } tableau ;
     { schema } un ou plusieurs schémas ; { redaction } encadré de
     rédaction ; { code, legende } bloc de pseudo-code ;
     { remarque } / { attention } encadrés. */

  _contenu(contenu) {
    const blocs = [];
    for (const bloc of [].concat(contenu ?? [])) {
      if (bloc && typeof bloc === "object" && !Array.isArray(bloc)) {
        if (bloc.schema) { blocs.push(this._figures(bloc.schema)); continue; }
        if (bloc.animation) { blocs.push(this._animation(bloc.animation)); continue; }
        if (bloc.demo) { blocs.push(this._demo(bloc.demo)); continue; }
        if (bloc.codeC !== undefined) { blocs.push(this._vueCode(bloc.codeC, { legende: bloc.legende }).racine); continue; }
        if (bloc.redaction) { blocs.push(this._redaction(bloc.redaction, bloc.titreRedaction)); continue; }
        if (bloc.code !== undefined) { blocs.push(this._code(bloc.code, bloc.legende)); continue; }
        if (bloc.remarque) { blocs.push(el("div", { class: "lc-encadre" }, ...blocsTexte(bloc.remarque))); continue; }
        if (bloc.attention) { blocs.push(el("div", { class: "lc-encadre lc-attention" }, ...blocsTexte(bloc.attention))); continue; }
      }
      blocs.push(...blocsTexte(Array.isArray(bloc) ? [bloc] : bloc));
    }
    return blocs;
  },

  _redaction(contenu, titre) {
    return el("aside", { class: "lc-redaction" },
      el("h4", { texte: titre || "Rédaction" }),
      ...this._contenu(contenu)
    );
  },

  _code(code, legende) {
    const bloc = el("pre", { class: "bloc-code lc-pseudo", texte: code });
    if (!legende) return bloc;
    return el("div", { class: "pb-code" }, el("div", { class: "pb-code-legende", texte: legende }), bloc);
  },

  /* Code C coloré, une rangée par ligne avec son numéro. Renvoie la
     racine et les rangées (pour les exercices qui y ajoutent un choix). */
  _vueCode(code, options = {}) {
    const boite = el("div", { class: "lc-code" + (options.cliquable ? " cliquable" : "") });
    const lignes = String(code).replace(/\r\n?/g, "\n").split("\n").map((src, k) => {
      const fin = el("span", { class: "lc-code-fin" });
      const rangee = el(options.cliquable ? "button" : "div", Object.assign({ class: "lc-code-ligne" }, options.cliquable ? { type: "button" } : {}),
        el("span", { class: "lc-code-num", texte: String(k + 1) }),
        el("code", { class: "lc-code-src", html: colorerC(src) || " " }),
        fin);
      boite.append(rangee);
      return { n: k + 1, rangee, fin, vide: !src.trim() || /^[\s{}]*$/.test(src) };
    });
    const racine = options.legende
      ? el("div", { class: "pb-code" }, el("div", { class: "pb-code-legende", texte: options.legende }), boite)
      : boite;
    return { racine, lignes };
  },

  _animation(spec) {
    try {
      return el("div", { class: "lc-animation" }, Trace.monter(spec));
    } catch (e) {
      return el("div", { class: "lc-encadre lc-attention" }, el("p", { texte: "Animation indisponible : " + e.message }));
    }
  },

  /* Démonstration rédigée ligne par ligne : chaque ligne apparaît à la
     demande, avec sa justification dans la marge. */
  _demo(demo) {
    const d = Array.isArray(demo) ? { lignes: demo } : demo;
    const items = d.lignes.map((l, k) => {
      const [texte, pourquoi] = [].concat(l);
      return el("li", { class: "lc-demo-ligne" },
        el("span", { class: "lc-demo-num", texte: String(k + 1) }),
        el("span", { class: "lc-demo-texte", html: texteRiche(texte) }),
        pourquoi ? el("span", { class: "lc-demo-pourquoi", html: texteRiche(pourquoi) }) : el("span"));
    });
    let vues = 1;
    const compte = el("span", { class: "lc-demo-compte" });
    const suivant = el("button", { class: "btn btn-principal btn-petit", type: "button" }, "Ligne suivante ↓");
    const tout = el("button", { class: "btn btn-fantome btn-petit", type: "button" }, "Tout afficher");
    const reprendre = el("button", { class: "btn btn-fantome btn-petit", type: "button" }, "↺ Reprendre");
    const maj = (nouvelle) => {
      items.forEach((it, k) => {
        it.style.display = k < vues ? "" : "none";
        it.classList.toggle("nouvelle", k === vues - 1 && nouvelle);
      });
      const fini = vues >= items.length;
      suivant.disabled = fini; tout.disabled = fini;
      reprendre.style.display = vues > 1 ? "" : "none";
      compte.textContent = "ligne " + Math.min(vues, items.length) + " / " + items.length;
    };
    suivant.addEventListener("click", () => { vues++; maj(true); });
    tout.addEventListener("click", () => { vues = items.length; maj(false); });
    reprendre.addEventListener("click", () => { vues = 1; maj(false); });
    maj(false);
    return el("aside", { class: "lc-redaction lc-demo" },
      el("h4", { texte: d.titre || "Démonstration ligne par ligne" }),
      d.enonce ? el("p", { class: "lc-demo-enonce", html: texteRiche(d.enonce) }) : null,
      el("ol", { class: "lc-demo-lignes" }, ...items),
      el("div", { class: "lc-demo-nav" }, suivant, tout, reprendre, el("span", { class: "espace" }), compte));
  },

  /* Un ou plusieurs schémas côte à côte (graphes, matrices ou
     schémas de assets/js/schemas.js). */
  _figures(spec) {
    const specs = [].concat(spec);
    const rangee = el("div", { class: "lc-figures" + (specs.length > 1 ? " lc-figures-multi" : "") });
    for (const s of specs) {
      const html = s.type === "graphe" || s.type === "matrice" ? Graphes.svg(s) : Schemas.svg(s);
      rangee.append(el("figure", { class: "pb-schema lc-figure", html },
        s.legende ? el("figcaption", { html: texteRiche(s.legende) }) : null));
    }
    return rangee;
  },

  /* ---------------- 1. Cours pas à pas ---------------- */

  _panneauCours(etat) {
    const panneau = etat.panneaux.cours;
    const etapes = etat.lecon.cours;
    const points = el("div", { class: "lc-points" });
    const scene = el("div", { class: "lc-scene" });
    const nav = el("div", { class: "lc-nav" });
    panneau.append(points, scene, nav);
    const vues = new Set([0]);

    const afficher = (k) => {
      etat.etape = k;
      vues.add(k);
      vider(points);
      etapes.forEach((e, i) => points.append(el("button", {
        class: "lc-point" + (i === k ? " actif" : vues.has(i) ? " vu" : ""),
        type: "button", title: e.titre,
        onclick: () => afficher(i)
      }, String(i + 1))));

      const e = etapes[k];
      const carte = el("section", { class: "code-carte lc-etape" },
        el("h3", { texte: "Étape " + (k + 1) + " sur " + etapes.length }),
        el("h2", { class: "lc-etape-titre", texte: e.titre || "" })
      );
      const texte = el("div", { class: "lc-etape-texte" }, ...this._contenu(e.texte));
      if (e.schema) {
        carte.append(el("div", { class: "lc-etape-corps" }, texte, el("div", { class: "lc-etape-schema" }, this._figures(e.schema))));
      } else carte.append(texte);
      if (e.animation) carte.append(this._animation(e.animation));
      if (e.redaction) carte.append(this._redaction(e.redaction, e.titreRedaction));
      if (e.demo) carte.append(this._demo(e.demo));
      vider(scene).append(carte);

      vider(nav);
      nav.append(
        el("button", { class: "btn btn-fantome", type: "button", disabled: k === 0, onclick: () => afficher(k - 1) }, "← Précédent"),
        el("span", { class: "espace" })
      );
      if (k < etapes.length - 1) {
        nav.append(el("button", { class: "btn btn-principal", type: "button", onclick: () => afficher(k + 1) }, "Suivant →"));
      } else {
        const suite = etat._ordre[etat._ordre.indexOf("cours") + 1];
        if (suite) nav.append(el("button", {
          class: "btn btn-principal", type: "button", onclick: () => this._activer(etat, suite)
        }, this.ONGLETS.find(([c]) => c === suite)[1] + " →"));
      }
      if (etat.onglet === "cours" && points.getBoundingClientRect().top < 0) {
        etat._barre.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    afficher(0);
  },

  /* ---------------- 2-4. Problématique, exemple, correction ---------------- */

  _panneauSimple(etat, cle, titre) {
    const donnees = etat.lecon[cle];
    const corps = Array.isArray(donnees) || typeof donnees === "string" ? { texte: donnees } : donnees;
    const carte = el("section", { class: "code-carte lc-carte lc-" + cle }, el("h3", { texte: corps.titre || titre }));
    carte.append(...this._contenu(corps.texte));
    if (corps.codeC) carte.append(this._vueCode(corps.codeC, { legende: corps.legende }).racine);
    if (corps.schema) carte.append(this._figures(corps.schema));
    if (corps.animation) carte.append(this._animation(corps.animation));
    if (corps.questions) {
      const liste = el("ol", { class: "lc-questions" });
      for (const q of corps.questions) liste.append(el("li", {}, ...this._contenu(q)));
      carte.append(liste);
    }
    if (corps.suite) carte.append(...this._contenu(corps.suite));
    etat.panneaux[cle].append(carte);
    const nav = this._versSuivant(etat, cle);
    if (nav) etat.panneaux[cle].append(nav);
  },

  /* ---------------- 5. Exercices ---------------- */

  _panneauExercices(etat) {
    const panneau = etat.panneaux.exercices;
    etat._pastilles = el("div", { class: "lc-pastilles" });
    etat._zoneExo = el("div", { class: "lc-zone-exo" });
    etat._zoneFin = el("div", { class: "lc-zone-fin" });
    panneau.append(etat._pastilles, etat._zoneExo, etat._zoneFin);
    this._montrerExo(etat, 0);
  },

  _majPastilles(etat) {
    vider(etat._pastilles);
    etat.exercices.forEach((exo, i) => {
      const r = etat.resultats[i];
      const niveau = this.NIVEAUX[exo.niveau || 1];
      etat._pastilles.append(el("button", {
        class: "lc-pastille" + (i === etat.exo ? " actif" : "") + (r === true ? " ok" : r === false ? " ko" : ""),
        type: "button", title: niveau[1],
        onclick: () => this._montrerExo(etat, i)
      }, el("b", { texte: String(i + 1) }), el("span", { texte: niveau[0] })));
    });
  },

  _montrerExo(etat, i) {
    etat.exo = i;
    this._majPastilles(etat);
    if (!etat.cartes[i]) etat.cartes[i] = this._carteExo(etat, i);
    vider(etat._zoneExo).append(etat.cartes[i]);
  },

  _carteExo(etat, i) {
    const exo = etat.exercices[i];
    const niveau = this.NIVEAUX[exo.niveau || 1];
    const carte = el("section", { class: "code-carte code-objectif lc-exo" },
      el("div", { class: "lc-exo-tete" },
        el("h3", { texte: "Exercice " + (i + 1) + " sur " + etat.exercices.length }),
        el("span", { class: "lc-niveau lc-niveau-" + (exo.niveau || 1), texte: niveau[0] + " " + niveau[1] })
      ),
      exo.titre ? el("h2", { class: "lc-exo-titre", texte: exo.titre }) : null
    );
    carte.append(...this._contenu(exo.enonce));
    if (exo.code && exo.type !== "lignes" && exo.type !== "cout") carte.append(this._vueCode(exo.code).racine);
    if (exo.schema) carte.append(this._figures(exo.schema));

    const zone = el("div", { class: "pb-reaction" });
    const fin = (juste) => this._resoudre(etat, i, juste);
    const fabrique = {
      qcm: () => this._qcm(exo, zone, fin),
      champs: () => this._champs(exo, zone, fin),
      construire: () => this._graphe(exo, zone, fin),
      selection: () => this._graphe(exo, zone, fin),
      ordre: () => this._graphe(exo, zone, fin),
      matrice: () => this._matrice(exo, zone, fin),
      remettre: () => this._remettre(exo, zone, fin),
      lignes: () => this._lignes(exo, zone, fin),
      cout: () => this._cout(exo, zone, fin)
    }[exo.type];
    carte.append(fabrique ? fabrique() : el("p", { texte: "Type d'exercice inconnu : " + exo.type }), zone);

    const nav = el("div", { class: "lc-nav lc-nav-exo" },
      el("button", { class: "btn btn-fantome btn-petit", type: "button", disabled: i === 0, onclick: () => this._montrerExo(etat, i - 1) }, "← Précédent"),
      el("span", { class: "espace" }),
      i < etat.exercices.length - 1
        ? el("button", { class: "btn btn-doux btn-petit lc-suivant", type: "button", onclick: () => this._montrerExo(etat, i + 1) }, "Exercice suivant →")
        : null
    );
    carte.append(nav);
    return carte;
  },

  _resoudre(etat, i, juste) {
    if (etat.resultats[i] !== null) return;
    etat.resultats[i] = juste;
    if (juste) etat.justes++;
    const total = etat.exercices.length;
    Progres.ecrire(etat.contexte.slug, etat.lecon.id, etat.justes, total);
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
    const total = etat.exercices.length;
    const parfait = etat.justes === total;
    const bandeau = el("div", { class: "code-bandeau " + (parfait ? "ok" : "ko") },
      el("b", { texte: parfait ? "✓ Leçon terminée" : "Leçon terminée" }),
      el("span", { texte: etat.justes + " / " + total + " exercices réussis" }),
      el("button", {
        class: "btn btn-doux btn-petit", type: "button",
        onclick: () => MoteurLecon.lancer(etat.conteneur, etat.lecon, etat.contexte)
      }, "↻ Recommencer")
    );
    if (etat.contexte.suivant) {
      bandeau.append(el("button", {
        class: "btn btn-principal btn-petit", type: "button",
        onclick: () => App.aller(etat.contexte.suivant.hash)
      }, "Leçon suivante →"));
    }
    vider(etat._zoneFin).append(bandeau);
  },

  /* Message après une tentative (commun à tous les exercices). */
  _message(zone, etat) {
    vider(zone);
    if (etat.bon) {
      zone.append(el("div", { class: "explication ok" }, el("b", { texte: "✓ Correct" }),
        etat.detail ? el("span", { html: " — " + texteRiche(etat.detail) }) : null));
    } else if (etat.revele) {
      zone.append(el("div", { class: "explication" }, el("b", { texte: "Réponse attendue" }),
        etat.detail ? el("div", { class: "lc-attendu" }, etat.detail) : null));
    } else {
      zone.append(el("div", { class: "explication" }, el("b", { texte: "✕ Pas encore — " }),
        el("span", { html: texteRiche(etat.message || "réessayez.") }),
        etat.indice ? el("span", { class: "lc-indice", html: " " + texteRiche(etat.indice) }) : null));
      if (etat.essais >= 2 && etat.surRevele) {
        zone.append(el("button", { class: "btn btn-fantome btn-petit", type: "button", onclick: etat.surRevele }, "Voir la réponse"));
      }
    }
    if ((etat.bon || etat.revele) && etat.solution) {
      zone.append(el("div", { class: "pb-solution" },
        el("h4", { class: "code-intertitre", texte: "Explication" }),
        ...this._contenu(etat.solution)));
    }
  },

  /* ---------------- Exercice : QCM ---------------- */

  _qcm(exo, zone, fin) {
    const bonnes = [].concat(exo.reponse);
    const multiple = bonnes.length > 1;
    const choisis = new Set();
    let fait = false;
    const boite = el("div", { class: "qcm-choix lc-qcm" });
    const boutons = exo.choix.map((texte, i) => {
      const b = el("button", { class: "choix", type: "button", onclick: () => cliquer(i) },
        el("span", { class: "choix-lettre", texte: String.fromCharCode(65 + i) }),
        el("span", { class: "choix-texte", html: texteRiche(texte) }));
      boite.append(b);
      return b;
    });
    const valider = el("button", { class: "btn btn-principal", type: "button", disabled: true, onclick: () => corriger() }, "Valider");

    const cliquer = (i) => {
      if (fait) return;
      if (!multiple) { choisis.clear(); choisis.add(i); corriger(); return; }
      if (choisis.has(i)) choisis.delete(i); else choisis.add(i);
      boutons.forEach((b, k) => b.classList.toggle("selection", choisis.has(k)));
      valider.disabled = !choisis.size;
    };
    const corriger = () => {
      fait = true;
      const juste = choisis.size === bonnes.length && bonnes.every((k) => choisis.has(k));
      boutons.forEach((b, k) => {
        b.classList.add("verrou");
        b.classList.remove("selection");
        if (bonnes.includes(k)) { b.classList.add("juste"); b.append(el("span", { class: "choix-marque", texte: "✓" })); }
        else if (choisis.has(k)) { b.classList.add("faux"); b.append(el("span", { class: "choix-marque", texte: "✕" })); }
      });
      valider.remove();
      vider(zone);
      zone.append(el("div", { class: "explication" + (juste ? " ok" : "") },
        el("b", { texte: juste ? "✓ Correct" : "✕ Incorrect — la bonne réponse est en vert." })));
      if (exo.explication) {
        zone.append(el("div", { class: "pb-solution" }, el("h4", { class: "code-intertitre", texte: "Explication" }), ...this._contenu(exo.explication)));
      }
      fin(juste);
    };
    return el("div", { class: "lc-widget" },
      multiple ? el("div", { class: "qcm-multi", texte: "Plusieurs réponses attendues" }) : null,
      boite,
      multiple ? el("div", { class: "pb-valider" }, valider) : null);
  },

  /* ---------------- Exercice : cases de réponse ---------------- */

  _champs(exo, zone, fin) {
    let resolu = false, essais = 0;
    const lignes = exo.champs.map((champ) => {
      const saisie = el("input", {
        class: "jp-saisie pb-champ", type: "text",
        autocomplete: "off", spellcheck: "false", autocapitalize: "off",
        placeholder: champ.ensemble || champ.partition ? "{ … }" : champ.suite ? "( … )" : ""
      });
      const ligne = el("label", { class: "pb-ligne" },
        el("span", { class: "pb-libelle", html: texteRiche(champ.libelle || "Réponse") }),
        el("span", { class: "pb-entree" }, saisie, el("span", { class: "pb-unite", texte: champ.unite || "" })));
      return { champ, saisie, ligne, bon: false };
    });
    const bouton = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");
    const attendues = () => el("ul", { class: "pb-attendues" }, ...exo.champs.map((c) =>
      el("li", {}, el("span", { html: texteRiche(c.libelle || "Réponse") + " : " }), el("code", { texte: String(c.affiche || formaterReponse(c)) }))));
    const verrouiller = () => { resolu = true; bouton.disabled = true; lignes.forEach((l) => { l.saisie.disabled = true; }); };

    const valider = () => {
      if (resolu) return;
      const restants = lignes.filter((l) => !l.bon);
      const vide = restants.find((l) => !l.saisie.value.trim());
      if (vide) { vide.saisie.focus(); return; }
      essais++;
      for (const l of restants) {
        l.saisie.classList.remove("flash-ko");
        if (Graphes.champJuste(l.saisie.value, l.champ)) {
          l.bon = true; l.saisie.disabled = true; l.saisie.classList.add("flash-ok");
        } else { void l.saisie.offsetWidth; l.saisie.classList.add("flash-ko"); }
      }
      const faux = lignes.filter((l) => !l.bon);
      if (!faux.length) {
        verrouiller();
        this._message(zone, { bon: true, solution: exo.explication });
        fin(true);
        return;
      }
      faux[0].saisie.focus();
      this._message(zone, {
        message: faux.length + (faux.length > 1 ? " réponses à corriger." : " réponse à corriger."),
        indice: exo.indice, essais,
        surRevele: () => {
          verrouiller();
          faux.forEach((l) => l.saisie.classList.add("pb-revele"));
          this._message(zone, { revele: true, detail: attendues(), solution: exo.explication });
          fin(false);
        }
      });
    };
    bouton.addEventListener("click", valider);
    lignes.forEach((l) => l.saisie.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); valider(); } }));
    return el("div", { class: "pb-saisie pb-champs" }, ...lignes.map((l) => l.ligne), el("div", { class: "pb-valider" }, bouton));
  },

  /* ---------------- Exercices sur un graphe ----------------
     construire : clic sur deux sommets = tracer / effacer l'arête
                  (l'arc du premier vers le second) ; clic sur une
                  arête = l'effacer ;
     selection  : clic = choisir / retirer un sommet (ou une arête) ;
     ordre      : clic = ajouter le sommet à la suite. */

  _graphe(exo, zone, fin) {
    const spec = exo.graphe;
    const G = Graphes.graphe(spec);
    const surAretes = exo.type === "selection" && exo.cible === "aretes";
    const st = {
      aretes: exo.type === "construire" ? new Set(Graphes.jetons(exo.depart).map((j) => {
        const m = j.match(/^(.+?)([>\-])(.+)$/); return Graphes.cle(m[1], m[3], m[2] === ">");
      })) : null,
      choix: null,
      selection: [],
      suite: [],
      historique: [],
      fini: false,
      essais: 0
    };

    const dessin = el("div", { class: "lc-graphe" });
    const etatTexte = el("div", { class: "lc-graphe-etat" });
    const bouton = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");
    const annuler = el("button", { class: "btn btn-fantome btn-petit", type: "button" }, "↶ Annuler");
    const effacer = el("button", { class: "btn btn-fantome btn-petit", type: "button" }, "Effacer");

    const ensembleTexte = (xs) => "{" + Graphes.trier(xs).map(Graphes.nom).join(", ") + "}";

    const rendre = (revelation) => {
      let vue, options = { interactif: !st.fini };
      if (exo.type === "construire") {
        const aretes = revelation || [...st.aretes];
        vue = Object.assign({}, spec, { aretes: aretes.join(" "), marques: revelation ? Object.fromEntries(aretes.map((c) => [c, "c"])) : {} });
        options.choix = st.choix;
        etatTexte.textContent = (G.oriente ? "Arcs : " : "|E| = ") + aretes.length
          + (st.choix && !st.fini ? "   ·   " + Graphes.nom(st.choix) + (G.oriente ? " → …" : " — …") : "");
      } else if (exo.type === "selection") {
        const choisis = revelation || st.selection;
        const marques = Object.assign({}, spec.marques || {});
        for (const x of choisis) marques[x] = revelation ? "c" : "a";
        vue = Object.assign({}, spec, { marques });
        etatTexte.textContent = surAretes
          ? (exo.nomEnsemble || "W") + " = {" + choisis.map((c) => "{" + c.split(/[->]/).map(Graphes.nom).join(", ") + "}").join(", ") + "}"
          : (exo.nomEnsemble || "S") + " = " + ensembleTexte(choisis) + "   ·   " + choisis.length + (choisis.length > 1 ? " sommets" : " sommet");
      } else {
        const suite = revelation || st.suite;
        const marques = Object.assign({}, spec.marques || {});
        const numeros = {};
        suite.forEach((s, k) => {
          marques[s] = revelation ? "c" : "a";
          numeros[s] = numeros[s] ? numeros[s] + "," + (k + 1) : String(k + 1);
          if (k > 0 && Graphes.aArete(G, suite[k - 1], s)) marques[Graphes.cle(suite[k - 1], s, G.oriente)] = revelation ? "c" : "a";
        });
        vue = Object.assign({}, spec, { marques });
        options.numeros = numeros;
        etatTexte.textContent = "(" + suite.map(Graphes.nom).join(", ") + ")"
          + (suite.length > 1 ? "   ·   longueur " + (suite.length - 1) : "");
      }
      dessin.innerHTML = Graphes.svg(vue, options);
      annuler.disabled = st.fini || !st.historique.length;
      effacer.disabled = st.fini || !st.historique.length;
    };

    const memoriser = () => {
      st.historique.push(JSON.stringify({ a: st.aretes ? [...st.aretes] : null, s: st.selection, q: st.suite }));
    };

    dessin.addEventListener("click", (e) => {
      if (st.fini) return;
      const sommet = e.target.closest("[data-s]");
      const arete = e.target.closest("[data-a]");
      if (exo.type === "construire") {
        if (sommet) {
          const s = sommet.getAttribute("data-s");
          if (!st.choix) st.choix = s;
          else if (st.choix === s) st.choix = null;
          else {
            memoriser();
            const c = Graphes.cle(st.choix, s, G.oriente);
            if (st.aretes.has(c)) st.aretes.delete(c); else st.aretes.add(c);
            st.choix = null;
          }
        } else if (arete) {
          memoriser();
          st.aretes.delete(arete.getAttribute("data-a"));
          st.choix = null;
        } else st.choix = null;
      } else if (exo.type === "selection") {
        const cible = surAretes ? arete && arete.getAttribute("data-a") : sommet && sommet.getAttribute("data-s");
        if (!cible) return;
        memoriser();
        st.selection = st.selection.includes(cible) ? st.selection.filter((x) => x !== cible) : st.selection.concat(cible);
      } else if (sommet) {
        memoriser();
        st.suite = st.suite.concat(sommet.getAttribute("data-s"));
      }
      rendre();
    });

    annuler.addEventListener("click", () => {
      const precedent = st.historique.pop();
      if (!precedent) return;
      const p = JSON.parse(precedent);
      if (p.a) st.aretes = new Set(p.a);
      st.selection = p.s; st.suite = p.q; st.choix = null;
      rendre();
    });
    effacer.addEventListener("click", () => {
      memoriser();
      if (st.aretes) st.aretes = new Set(); st.selection = []; st.suite = []; st.choix = null;
      rendre();
    });

    bouton.addEventListener("click", () => {
      if (st.fini) return;
      const reponse = exo.type === "construire" ? [...st.aretes] : exo.type === "selection" ? st.selection : st.suite;
      const r = Graphes.evaluer(exo, reponse);
      st.essais++;
      if (r.ok) {
        st.fini = true; st.choix = null;
        bouton.disabled = true;
        rendre();
        this._message(zone, { bon: true, solution: exo.explication });
        fin(true);
        return;
      }
      this._message(zone, {
        message: r.message, indice: st.essais >= 2 ? exo.indice : null, essais: st.essais,
        surRevele: () => {
          st.fini = true; st.choix = null;
          bouton.disabled = true;
          const sol = Graphes.solution(exo);
          rendre(sol);
          let detail = null;
          if (exo.type === "ordre" && sol) detail = el("code", { texte: "(" + sol.map(Graphes.nom).join(", ") + ")" });
          if (exo.type === "selection" && sol && !surAretes) detail = el("code", { texte: ensembleTexte(sol) });
          this._message(zone, { revele: true, detail, solution: exo.explication });
          fin(false);
        }
      });
    });

    rendre();
    return el("div", { class: "lc-widget lc-widget-graphe" },
      dessin,
      el("div", { class: "lc-graphe-outils" }, etatTexte, el("span", { class: "espace" }), annuler, effacer, bouton));
  },

  /* ---------------- Exercice : matrice à remplir ---------------- */

  _matrice(exo, zone, fin) {
    const G = exo.graphe ? Graphes.graphe(exo.graphe) : null;
    const lignes = exo.lignes ? Graphes.jetons(exo.lignes) : G.ids;
    const colonnes = exo.colonnes ? Graphes.jetons(exo.colonnes) : exo.lignes ? lignes : G.ids;
    const max = exo.max ?? 1;
    const valeurs = lignes.map(() => colonnes.map(() => 0));
    let fini = false, essais = 0;

    const table = el("table", { class: "lc-matrice" });
    const tete = el("tr", {}, el("th", {}));
    colonnes.forEach((c) => tete.append(el("th", { texte: Graphes.nom(c) })));
    table.append(tete);
    const cases = lignes.map((l, i) => {
      const tr = el("tr", {}, el("th", { texte: Graphes.nom(l) }));
      const rangee = colonnes.map((c, j) => {
        const b = el("button", { class: "lc-case lc-case-0", type: "button", texte: "0" });
        b.addEventListener("click", () => {
          if (fini) return;
          valeurs[i][j] = (valeurs[i][j] + 1) % (max + 1);
          b.textContent = String(valeurs[i][j]);
          b.className = "lc-case lc-case-" + Math.min(valeurs[i][j], 1);
        });
        tr.append(el("td", {}, b));
        return b;
      });
      table.append(tr);
      return rangee;
    });

    const bouton = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");
    const marquer = (attendu) => {
      cases.forEach((r, i) => r.forEach((b, j) => {
        b.disabled = true;
        if (attendu) {
          const v = attendu[i][j];
          b.classList.toggle("lc-case-faux", Number(valeurs[i][j]) !== Number(v));
          b.textContent = String(v);
          b.className = "lc-case lc-case-" + Math.min(v, 1) + (Number(valeurs[i][j]) !== Number(v) ? " lc-case-faux" : "");
        }
      }));
    };
    bouton.addEventListener("click", () => {
      if (fini) return;
      essais++;
      const r = Graphes.evaluer(exo, valeurs);
      if (r.ok) {
        fini = true; bouton.disabled = true; marquer(null);
        this._message(zone, { bon: true, solution: exo.explication });
        fin(true);
        return;
      }
      this._message(zone, {
        message: r.message, indice: exo.indice, essais,
        surRevele: () => {
          fini = true; bouton.disabled = true;
          marquer(Graphes.matriceAttendue(exo));
          this._message(zone, { revele: true, solution: exo.explication });
          fin(false);
        }
      });
    });
    return el("div", { class: "lc-widget" },
      el("div", { class: "lc-matrice-cadre" }, table),
      el("div", { class: "pb-valider" }, bouton));
  },

  /* ---------------- Exercice : remettre une rédaction dans l'ordre ---------------- */

  _remettre(exo, zone, fin) {
    const etapes = exo.etapes.map((texte, i) => ({ texte, i }));
    let reserve = melanger(etapes);
    while (etapes.length > 1 && reserve.every((e, k) => e.i === k)) reserve = melanger(etapes);
    let choisies = [];
    let fini = false, essais = 0;
    const zoneChoisies = el("ol", { class: "lc-remettre-liste" });
    const zoneReserve = el("div", { class: "lc-remettre-reserve" });
    const bouton = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");

    const rendre = () => {
      vider(zoneChoisies);
      choisies.forEach((e) => zoneChoisies.append(el("li", {},
        el("button", {
          class: "lc-remettre-item choisi", type: "button", disabled: fini,
          onclick: () => { choisies = choisies.filter((x) => x !== e); reserve.push(e); rendre(); }
        }, el("span", { html: texteRiche(e.texte) })))));
      vider(zoneReserve);
      reserve.forEach((e) => zoneReserve.append(el("button", {
        class: "lc-remettre-item", type: "button", disabled: fini,
        onclick: () => { reserve = reserve.filter((x) => x !== e); choisies.push(e); rendre(); }
      }, el("span", { html: texteRiche(e.texte) }))));
      zoneReserve.style.display = reserve.length ? "" : "none";
      bouton.disabled = fini || reserve.length > 0;
    };

    bouton.addEventListener("click", () => {
      if (fini) return;
      essais++;
      const k = choisies.findIndex((e, n) => e.i !== n);
      if (k === -1) {
        fini = true; rendre();
        this._message(zone, { bon: true, solution: exo.explication });
        fin(true);
        return;
      }
      this._message(zone, {
        message: "l'étape n° " + (k + 1) + " n'est pas à sa place.", indice: exo.indice, essais,
        surRevele: () => {
          fini = true;
          choisies = etapes.slice(); reserve = [];
          rendre();
          this._message(zone, { revele: true, solution: exo.explication });
          fin(false);
        }
      });
    });
    rendre();
    return el("div", { class: "lc-widget lc-remettre" }, zoneChoisies, zoneReserve, el("div", { class: "pb-valider" }, bouton));
  },

  /* ---------------- Exercice : cliquer des lignes d'un code ---------------- */

  _lignes(exo, zone, fin) {
    const attendues = new Set(exo.reponse);
    const choisies = new Set();
    let fini = false, essais = 0;
    const vue = this._vueCode(exo.code, { cliquable: true });
    const etatTexte = el("span", { class: "lc-graphe-etat" });
    const bouton = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");
    const rendre = (revelation) => {
      for (const l of vue.lignes) {
        l.rangee.classList.toggle("choisie", choisies.has(l.n));
        l.rangee.classList.toggle("attendue", !!revelation && attendues.has(l.n));
        l.rangee.disabled = fini || l.vide;
      }
      etatTexte.textContent = choisies.size ? "Lignes " + [...choisies].sort((a, b) => a - b).join(", ") : "Aucune ligne choisie";
      bouton.disabled = fini || !choisies.size;
    };
    for (const l of vue.lignes) l.rangee.addEventListener("click", () => {
      if (fini || l.vide) return;
      if (choisies.has(l.n)) choisies.delete(l.n); else choisies.add(l.n);
      rendre();
    });
    bouton.addEventListener("click", () => {
      if (fini) return;
      essais++;
      const manquantes = [...attendues].filter((n) => !choisies.has(n)).length;
      const enTrop = [...choisies].filter((n) => !attendues.has(n)).length;
      if (!manquantes && !enTrop) {
        fini = true; rendre();
        this._message(zone, { bon: true, solution: exo.explication });
        fin(true);
        return;
      }
      const morceaux = [];
      if (enTrop) morceaux.push(enTrop + (enTrop > 1 ? " lignes en trop" : " ligne en trop"));
      if (manquantes) morceaux.push(manquantes + (manquantes > 1 ? " lignes manquantes" : " ligne manquante"));
      this._message(zone, {
        message: morceaux.join(", ") + ".", indice: exo.indice, essais,
        surRevele: () => {
          fini = true; choisies.clear();
          rendre(true);
          this._message(zone, { revele: true, detail: el("code", { texte: "Lignes " + [...attendues].sort((a, b) => a - b).join(", ") }), solution: exo.explication });
          fin(false);
        }
      });
    });
    rendre();
    return el("div", { class: "lc-widget" }, vue.racine,
      el("div", { class: "lc-graphe-outils" }, etatTexte, el("span", { class: "espace" }), bouton));
  },

  /* ---------------- Exercice : la classe de chaque ligne ---------------- */

  _cout(exo, zone, fin) {
    const vue = this._vueCode(exo.code);
    const choix = exo.choix;
    let fini = false, essais = 0;
    const listes = [];
    for (const [n, attendu] of Object.entries(exo.lignes)) {
      const l = vue.lignes[Number(n) - 1];
      const liste = el("select", { class: "lc-cout-choix", "aria-label": "Classe de la ligne " + n },
        el("option", { value: "", texte: "…" }), ...choix.map((c) => el("option", { value: c, texte: c })));
      liste.addEventListener("change", () => liste.classList.remove("faux"));
      l.fin.append(liste);
      l.rangee.classList.add("a-classer");
      listes.push({ n, liste, attendu });
    }
    const bouton = el("button", { class: "btn btn-principal", type: "button" }, "Vérifier");
    const verrouiller = () => { fini = true; bouton.disabled = true; listes.forEach((x) => { x.liste.disabled = true; }); };
    bouton.addEventListener("click", () => {
      if (fini) return;
      const vide = listes.find((x) => !x.liste.value);
      if (vide) { vide.liste.focus(); return; }
      essais++;
      const faux = listes.filter((x) => x.liste.value !== x.attendu);
      listes.forEach((x) => { x.liste.classList.toggle("faux", faux.includes(x)); x.liste.classList.toggle("juste", !faux.includes(x)); });
      if (!faux.length) {
        verrouiller();
        this._message(zone, { bon: true, solution: exo.explication });
        fin(true);
        return;
      }
      this._message(zone, {
        message: faux.length + (faux.length > 1 ? " lignes mal classées." : " ligne mal classée."), indice: exo.indice, essais,
        surRevele: () => {
          verrouiller();
          listes.forEach((x) => { x.liste.value = x.attendu; x.liste.classList.remove("faux"); x.liste.classList.add("juste"); });
          this._message(zone, { revele: true, solution: exo.explication });
          fin(false);
        }
      });
    });
    return el("div", { class: "lc-widget" }, vue.racine, el("div", { class: "pb-valider" }, bouton));
  }
};
