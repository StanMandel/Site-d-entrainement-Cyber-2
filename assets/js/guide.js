/* =============================================================
   Moteur de guides
   -------------------------------------------------------------
   Affiche une fiche explicative : notions de base, marche à suivre
   numérotée ou aide-mémoire découpé en parties, avec commandes
   copiables, schémas, sorties attendues, remarques et tableaux.

   - Sans section "partie" : les étapes sont numérotées 1, 2, 3…
     et les sections "notion" marquées d'une puce.
   - Avec des sections "partie" : chaque section est numérotée
     « partie.rang » (1.1, 1.2, 2.1…) et un sommaire est ajouté.

   Utilisation :
     MoteurGuide.lancer(conteneur, guide, { couleur, surRetour() });
   ============================================================= */

const MoteurGuide = {
  lancer(conteneur, guide, contexte) {
    vider(conteneur);

    if (guide.resume) {
      conteneur.append(el("div", { class: "guide-intro", html: texteRiche(guide.resume) }));
    }

    if (guide.prealables && guide.prealables.length) {
      const liste = el("ul");
      for (const item of guide.prealables) liste.append(el("li", { html: texteRiche(item) }));
      conteneur.append(el("section", { class: "guide-prealables" },
        el("h3", { texte: "Prérequis" }), liste
      ));
    }

    const sections = guide.sections || [];
    const avecParties = sections.some((s) => s.type === "partie");
    const sommaire = avecParties ? el("nav", { class: "guide-sommaire" }) : null;
    if (sommaire) conteneur.append(sommaire);

    const entrees = [];
    let numero = 0, partie = 0, rang = 0;

    for (const section of sections) {
      if (section.type === "partie") {
        partie++;
        rang = 0;
        const noeud = this._partie(section, partie);
        entrees.push({ numero: partie, titre: section.titre, noeud: noeud, liens: [] });
        conteneur.append(noeud);
        continue;
      }

      const pleine = section.type !== "notion";
      let marque;
      if (avecParties) {
        rang++;
        marque = partie ? partie + "." + rang : String(rang);
      } else {
        if (pleine) numero++;
        marque = pleine ? String(numero) : "•";
      }

      const noeud = this._section(section, marque, pleine);
      conteneur.append(noeud);
      if (avecParties && entrees.length) {
        entrees[entrees.length - 1].liens.push({ marque: marque, titre: section.titre, noeud: noeud });
      }
    }

    if (sommaire) this._remplirSommaire(sommaire, entrees);

    conteneur.append(el("div", { class: "guide-fin" },
      el("button", { class: "btn btn-doux", onclick: contexte.surRetour }, "← Retour au cours")
    ));
  },

  _remplirSommaire(sommaire, entrees) {
    const aller = (noeud) => noeud.scrollIntoView({ behavior: "smooth", block: "start" });
    const grille = el("div", { class: "sommaire-grille" });

    for (const entree of entrees) {
      const bloc = el("div", { class: "sommaire-partie" },
        el("button", { class: "sommaire-titre", type: "button", onclick: () => aller(entree.noeud) },
          el("span", { texte: String(entree.numero) }), entree.titre || "")
      );
      for (const lien of entree.liens) {
        bloc.append(el("button", { class: "sommaire-lien", type: "button", onclick: () => aller(lien.noeud) },
          el("span", { texte: lien.marque }), lien.titre || ""));
      }
      grille.append(bloc);
    }

    sommaire.append(el("h3", { texte: "Sommaire" }), grille);
  },

  _partie(section, numero) {
    return el("header", { class: "guide-partie" },
      el("span", { class: "guide-partie-num", texte: "Partie " + numero }),
      el("h2", { texte: section.titre || "" }),
      section.texte ? el("p", { html: texteRiche(section.texte) }) : null
    );
  },

  _section(section, marque, pleine) {
    const corps = el("div", { class: "etape-corps" });

    if (section.titre) corps.append(el("h3", { texte: section.titre }));
    if (section.texte) corps.append(el("p", { html: texteRiche(section.texte) }));

    if (section.points && section.points.length) {
      const liste = el("ul");
      for (const point of section.points) liste.append(el("li", { html: texteRiche(point) }));
      corps.append(liste);
    }

    if (section.telechargements) corps.append(this._telechargements(section.telechargements));

    if (section.tableau) corps.append(this._tableau(section.tableau));
    if (section.schema) corps.append(el("pre", { class: "schema", texte: section.schema }));
    if (section.code) corps.append(this._commande(section.code, section.legende));
    if (section.codes && section.codes.length) {
      const grille = el("div", { class: "cmd-grille" });
      for (const bloc of section.codes) grille.append(this._commande(bloc.code, bloc.legende));
      corps.append(grille);
    }
    if (section.sortie) corps.append(el("div", { class: "sortie", texte: section.sortie }));

    for (const texte of [].concat(section.remarque || [])) {
      corps.append(el("div", { class: "remarque" },
        el("b", { texte: "Remarque — " }), el("span", { html: texteRiche(texte) })));
    }
    for (const texte of [].concat(section.attention || [])) {
      corps.append(el("div", { class: "remarque attention" },
        el("b", { texte: "Attention — " }), el("span", { html: texteRiche(texte) })));
    }

    return el("section", { class: "etape" },
      el("div", { class: "etape-num" + (pleine ? "" : " notion"), texte: marque }),
      corps
    );
  },

  /* -------------------------------------------------------------
     Fichiers téléchargeables (ex. script d'installation).
     Chaque entrée : { nom, source | contenu, legende }.
       - source  : id d'un <script type="text/plain"> embarqué dans
                   la page (téléchargement hors ligne, sans réseau) ;
       - contenu : le texte directement (sinon).
     Rendu : nom, boutons Copier / Télécharger, aperçu repliable.
     ------------------------------------------------------------- */
  _telechargements(liste) {
    const bloc = el("div", { class: "guide-dl" });
    for (const t of [].concat(liste)) bloc.append(this._fichierDl(t));
    return bloc;
  },

  _fichierDl(t) {
    const source = t.source ? document.getElementById(t.source) : null;
    const contenu = t.contenu != null ? t.contenu : (source ? source.textContent.replace(/^\n/, "") : "");
    const nom = t.nom || "fichier.txt";

    const telecharger = el("button", { class: "btn btn-principal btn-petit", type: "button" }, "⤓ Télécharger");
    telecharger.addEventListener("click", () => {
      // Les fichiers batch Windows exigent des fins de ligne CRLF, sinon cmd.exe
      // casse sur les blocs « ( … ) else ( … ) ». Le HTML normalise tout en LF :
      // on réapplique donc le CRLF pour .cmd/.bat. Les .sh restent en LF (bash).
      const pourWindows = /\.(cmd|bat)$/i.test(nom);
      const aTelecharger = pourWindows ? contenu.replace(/\r?\n/g, "\r\n") : contenu;
      const blob = new Blob([aTelecharger], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = el("a", { href: url, download: nom });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast("Téléchargé : " + nom);
    });

    const copier = el("button", { class: "cmd-copier", type: "button", texte: "Copier" });
    copier.addEventListener("click", () => {
      const ecrire = navigator.clipboard && navigator.clipboard.writeText(contenu);
      Promise.resolve(ecrire).then(
        () => { copier.textContent = "Copié"; setTimeout(() => (copier.textContent = "Copier"), 1500); },
        () => toast("Copie impossible dans ce navigateur")
      );
    });

    const details = el("details", { class: "telechargement-voir" },
      el("summary", { texte: "Voir le contenu du script" }),
      el("pre", { class: "telechargement-code", texte: contenu })
    );

    return el("div", { class: "telechargement" },
      el("div", { class: "telechargement-tete" },
        el("span", { class: "telechargement-nom", texte: nom }),
        el("span", { class: "telechargement-meta", texte: this._tailleLisible(contenu) }),
        el("span", { class: "ed-espace" }),
        copier, telecharger
      ),
      t.legende ? el("p", { class: "telechargement-legende", html: texteRiche(t.legende) }) : null,
      details
    );
  },

  _tailleLisible(contenu) {
    const lignes = contenu ? contenu.split("\n").length : 0;
    const ko = Math.max(1, Math.round((contenu || "").length / 1024));
    return lignes + " lignes · " + ko + " Ko";
  },

  _commande(code, legende) {
    const bouton = el("button", { class: "cmd-copier", texte: "Copier" });
    bouton.addEventListener("click", () => {
      const ecrire = navigator.clipboard && navigator.clipboard.writeText(code);
      Promise.resolve(ecrire).then(
        () => { bouton.textContent = "Copié"; setTimeout(() => (bouton.textContent = "Copier"), 1500); },
        () => toast("Copie impossible dans ce navigateur")
      );
    });

    return el("div", { class: "cmd" },
      el("div", { class: "cmd-titre" }, el("span", { texte: legende || "Terminal" }), bouton),
      el("pre", { texte: code })
    );
  },

  _tableau(tableau) {
    const thead = el("thead");
    const ligneEntete = el("tr");
    for (const entete of tableau.entetes || []) ligneEntete.append(el("th", { texte: entete }));
    thead.append(ligneEntete);

    const tbody = el("tbody");
    for (const ligne of tableau.lignes || []) {
      const tr = el("tr");
      for (const cellule of ligne) tr.append(el("td", { html: texteRiche(cellule) }));
      tbody.append(tr);
    }

    return el("div", { class: "tableau" }, el("table", {}, thead, tbody));
  }
};

/** Libellé court du volume d'un guide : « 6 parties » ou « 10 étapes ». */
function decompteGuide(guide) {
  const sections = guide.sections || [];
  const parties = sections.filter((s) => s.type === "partie").length;
  if (parties) return parties + (parties > 1 ? " parties" : " partie");
  const etapes = sections.filter((s) => s.type !== "notion").length;
  return etapes ? etapes + (etapes > 1 ? " étapes" : " étape") : "";
}

/* -------------------------------------------------------------
   Mise en forme légère du texte des guides :
     `code`  ->  <code>code</code>
     **gras** ->  <b>gras</b>
   Le texte est d'abord échappé : aucun HTML des données n'est exécuté.
   ------------------------------------------------------------- */
function texteRiche(texte) {
  const echappe = String(texte ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return echappe
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
}
