/* =============================================================
   Application : en-tête, routage et rendu des vues.
   -------------------------------------------------------------
   Routes (dans l'adresse, après le #) :
     #/                      accueil
     #/c/<slug>              page d'un cours (guides + chapitres)
     #/c/<slug>/<exoId>      un exercice
     #/c/<slug>/g/<guideId>  un guide
   ============================================================= */

const App = {
  vue: null,
  accueil: null,
  filtre: "",
  chapitresOuverts: {},

  /* ---------------- Démarrage ---------------- */

  init() {
    this.vue = document.getElementById("vue");
    this.accueil = document.getElementById("accueil");
    this.accueil.addEventListener("click", () => this.aller("#/"));

    const recherche = document.getElementById("recherche");
    recherche.addEventListener("input", () => {
      this.filtre = recherche.value.trim();
      if (!location.hash.startsWith("#/c/") || this.filtre) {
        if (location.hash !== "#/" && location.hash !== "") location.hash = "#/";
        else this.rendre();
      }
    });

    window.addEventListener("hashchange", () => this.rendre());
    this.rendre();
  },

  aller(hash) {
    if (location.hash === hash) this.rendre();
    else location.hash = hash;
  },

  /* ---------------- Routage ---------------- */

  rendre() {
    const route = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/").filter(Boolean);
    vider(this.vue);
    window.scrollTo({ top: 0 });
    document.body.classList.toggle("dans-exercice", route[0] === "c" && !!route[2] && route[2] !== "g");
    this.accueil.classList.toggle("actif", route[0] !== "c");

    if (route[0] === "c" && route[1]) {
      const cours = window.COURS.find((c) => c.slug === route[1]);
      if (!cours) return this._accueil();
      document.title = cours.nom + " — Entraînements EPITA";
      if (route[2] === "g" && route[3]) return this._guide(cours, route[3]);
      return route[2] ? this._exercice(cours, route[2]) : this._cours(cours);
    }

    document.title = "Entraînements EPITA";
    this._accueil();
  },

  /* ---------------- Vue : accueil ---------------- */

  _accueil() {
    const tousExos = window.COURS.flatMap((c) => exercicesDuCours(c.slug));
    const faits = window.COURS.reduce((n, c) => n + statsCours(c.slug).faits, 0);

    const tousGuides = window.COURS.reduce((n, c) => n + guidesDuCours(c.slug).length, 0);

    const hero = el("section", { class: "hero" },
      el("div", { class: "stats-globales" },
        el("div", { class: "stat" }, el("b", { texte: String(window.COURS.length) }), "matières"),
        el("div", { class: "stat" }, el("b", { texte: String(tousGuides) }), tousGuides > 1 ? "guides" : "guide"),
        el("div", { class: "stat" }, el("b", { texte: String(tousExos.length) }), "exercices"),
        el("div", { class: "stat" }, el("b", { texte: String(faits) }), "exercices travaillés")
      )
    );

    const grille = el("div", { class: "grille-cours" });
    const motif = normaliser(this.filtre);

    const visibles = window.COURS.filter((c) =>
      !motif || normaliser(c.nom).includes(motif) || normaliser(c.description || "").includes(motif)
    );

    for (const cours of visibles) grille.append(this._carteCours(cours));

    this.vue.append(hero, grille);

    if (visibles.length === 0) {
      this.vue.append(el("div", { class: "vide" },
        el("div", { class: "emoji", texte: "🔍" }),
        el("h3", { texte: "Aucune matière ne correspond" }),
        el("p", { texte: "Essayez un autre mot-clé." })
      ));
    }
  },

  _carteCours(cours) {
    const stats = statsCours(cours.slug);
    const guides = guidesDuCours(cours.slug).length;

    const pied = el("div", { class: "carte-pied" });
    if (guides > 0) {
      pied.append(el("span", { class: "puce", texte: guides + (guides > 1 ? " guides" : " guide") }));
    }
    if (stats.total === 0) {
      if (guides === 0) pied.append(el("span", { class: "puce puce-vide", texte: "À remplir" }));
    } else {
      pied.append(
        el("span", { class: "puce", texte: stats.total + (stats.total > 1 ? " exercices" : " exercice") }),
        el("div", { class: "barre-progres" },
          el("i", { style: { width: (stats.faits / stats.total) * 100 + "%" } })
        ),
        el("span", {
          class: "puce " + (stats.moyenne >= 80 ? "puce-vert" : stats.moyenne > 0 ? "puce-or" : "puce-vide"),
          texte: stats.faits ? stats.moyenne + " %" : "0 / " + stats.total
        })
      );
    }

    return el("button", {
      class: "carte-cours",
      type: "button",
      style: { "--tc": cours.couleur },
      onclick: () => this.aller("#/c/" + cours.slug)
    },
      el("div", { class: "carte-icone", texte: cours.emoji }),
      el("h3", { texte: cours.nom }),
      el("p", { class: "desc", texte: cours.description || "" }),
      pied
    );
  },

  /* ---------------- Vue : un cours ---------------- */

  _cours(cours) {
    const contenu = window.CONTENU[cours.slug] || { chapitres: [] };
    const chapitres = contenu.chapitres || [];
    const guides = guidesDuCours(cours.slug);
    const stats = statsCours(cours.slug);

    this.vue.append(this._fil([["Accueil", "#/"], [cours.nom, null]]));

    const entete = el("header", { class: "entete-cours", style: { "--tc": cours.couleur } },
      el("div", { class: "carte-icone", texte: cours.emoji }),
      el("div", { class: "entete-cours-info" },
        el("h1", { texte: cours.nom }),
        el("p", { class: "desc", texte: cours.description || "" }),
        el("div", { class: "stats-globales" },
          guides.length
            ? el("div", { class: "stat" }, el("b", { texte: String(guides.length) }), guides.length > 1 ? "guides" : "guide")
            : null,
          el("div", { class: "stat" }, el("b", { texte: String(chapitres.length) }), chapitres.length > 1 ? "chapitres" : "chapitre"),
          el("div", { class: "stat" }, el("b", { texte: String(stats.total) }), stats.total > 1 ? "exercices" : "exercice")
        )
      )
    );

    if (stats.faits > 0) {
      entete.append(el("div", { class: "entete-cours-score" },
        el("div", { class: "anneau" }, stats.moyenne + " %", el("small", { texte: "moyenne" })),
        el("span", { class: "puce", texte: stats.faits + " / " + stats.total + " travaillés" }),
        el("button", {
          class: "btn btn-fantome btn-petit",
          onclick: () => {
            if (confirm("Effacer votre progression pour « " + cours.nom + " » ?")) {
              Progres.effacerCours(cours.slug);
              toast("Progression effacée");
              this.rendre();
            }
          }
        }, "Réinitialiser")
      ));
    }

    this.vue.append(entete);

    if (guides.length) {
      const grille = el("div", { class: "liste-guides" });
      for (const guide of guides) grille.append(this._carteGuide(cours, guide));
      this.vue.append(el("h2", { class: "titre-section", texte: "Guides" }), grille);
    }

    if (chapitres.length === 0) {
      if (!guides.length) this.vue.append(this._videPourCours(cours));
      return;
    }

    const liste = el("div", { class: "chapitres" });
    chapitres.forEach((chapitre, i) => liste.append(this._blocChapitre(cours, chapitre, i)));
    this.vue.append(el("h2", { class: "titre-section", texte: "Exercices" }), liste);
  },

  _carteGuide(cours, guide) {
    const volume = decompteGuide(guide);

    return el("button", {
      class: "carte-guide",
      type: "button",
      style: { "--tc": cours.couleur },
      onclick: () => this.aller("#/c/" + cours.slug + "/g/" + guide.id)
    },
      el("div", { class: "carte-guide-haut" },
        el("h4", { texte: guide.titre || "Guide" }),
        el("span", { class: "type-badge type-guide", texte: guide.badge || "Guide" })
      ),
      guide.resume ? el("p", { class: "desc", texte: guide.resume }) : null,
      el("div", { class: "carte-guide-pied" },
        volume ? el("span", { texte: volume }) : null,
        guide.duree ? el("span", { texte: "· " + guide.duree }) : null,
        guide.niveau ? el("span", { class: "puce", texte: guide.niveau }) : null
      )
    );
  },

  _blocChapitre(cours, chapitre, i) {
    const cle = cours.slug + "/" + (chapitre.id || i);
    if (this.chapitresOuverts[cle] === undefined) this.chapitresOuverts[cle] = i === 0;

    const exos = chapitre.exercices || [];
    const corps = el("div", { class: "chapitre-corps" });

    if (exos.length === 0) {
      corps.append(el("p", { class: "desc", texte: "Aucun exercice dans ce chapitre pour l'instant.", style: { color: "var(--texte-pale)", fontSize: ".88rem" } }));
    } else {
      const grille = el("div", { class: "liste-exos" });
      exos.forEach((exo, j) => grille.append(this._carteExo(cours, exo, (i + 1) + "." + (j + 1))));
      corps.append(grille);
    }

    const bloc = el("section", {
      class: "chapitre" + (this.chapitresOuverts[cle] ? " ouvert" : ""),
      style: { "--tc": cours.couleur }
    },
      el("button", {
        class: "chapitre-entete",
        type: "button",
        onclick: (e) => {
          const section = e.currentTarget.parentNode;
          const ouvert = section.classList.toggle("ouvert");
          this.chapitresOuverts[cle] = ouvert;
        }
      },
        el("span", { class: "chapitre-num", texte: String(i + 1) }),
        el("span", { class: "chapitre-titre" },
          el("h3", { texte: chapitre.titre || "Chapitre " + (i + 1) }),
          chapitre.description ? el("p", { texte: chapitre.description }) : null
        ),
        el("span", { class: "puce", texte: exos.length + " exo" + (exos.length > 1 ? "s" : "") }),
        el("span", { class: "chevron", texte: "▶" })
      ),
      corps
    );

    return bloc;
  },

  _carteExo(cours, exo, numero) {
    const resultat = Progres.lire(cours.slug, exo.id);
    const meta = this._metaType(exo);

    const pied = el("div", { class: "carte-exo-pied" },
      el("span", { texte: meta.taille })
    );
    if (resultat) {
      pied.append(
        el("span", { texte: "·" }),
        el("span", {
          class: "puce " + (resultat.meilleur >= 80 ? "puce-vert" : "puce-or"),
          texte: "record " + resultat.meilleur + " %"
        })
      );
    }

    return el("button", {
      class: "carte-exo",
      type: "button",
      style: { "--tc": cours.couleur },
      onclick: () => this.aller("#/c/" + cours.slug + "/" + exo.id)
    },
      el("div", { class: "carte-exo-haut" },
        el("span", { class: "exo-num", texte: numero }),
        el("h4", { texte: exo.titre || "Exercice" }),
        el("span", { class: "type-badge type-" + exo.type, texte: meta.libelle })
      ),
      exo.description || exo.consigne
        ? el("p", { class: "desc", texte: exo.description || exo.consigne })
        : null,
      pied
    );
  },

  _metaType(exo) {
    if (exo.type === "qcm") {
      const n = Math.min(exo.tirage || Infinity, (exo.questions || []).length);
      return { libelle: "QCM", taille: n + " question" + (n > 1 ? "s" : "") };
    }
    if (exo.type === "jetpunk") {
      const n = Math.min(exo.tirage || Infinity, (exo.items || []).length);
      const chrono = exo.temps ? " · " + formaterTemps(exo.temps) : "";
      return { libelle: "Jeu rapide", taille: n + " réponse" + (n > 1 ? "s" : "") + chrono };
    }
    if (exo.type === "code") {
      const n = (exo.tests || []).length;
      return { libelle: exo.langage === "c" ? "Code C" : "Code", taille: n + " test" + (n > 1 ? "s" : "") };
    }
    if (exo.type === "terminal") {
      const n = (exo.objectifs || []).length;
      return { libelle: "Terminal", taille: n + " objectif" + (n > 1 ? "s" : "") };
    }
    if (exo.type === "probleme") {
      const n = [].concat(exo.exercice || exo.exercices || []).length;
      return { libelle: "Mini-cours", taille: n + " à résoudre" };
    }
    return { libelle: exo.type || "Exercice", taille: "" };
  },

  /* ---------------- Vue : un exercice ---------------- */

  _exercice(cours, exoId) {
    const contenu = window.CONTENU[cours.slug] || { chapitres: [] };
    let exo = null, chapitre = null, numero = "";
    (contenu.chapitres || []).forEach((ch, i) => {
      const j = (ch.exercices || []).findIndex((e) => e.id === exoId);
      if (j >= 0 && !exo) { exo = ch.exercices[j]; chapitre = ch; numero = (i + 1) + "." + (j + 1); }
    });

    if (!exo) {
      this.vue.append(this._fil([["Accueil", "#/"], [cours.nom, "#/c/" + cours.slug]]));
      this.vue.append(el("div", { class: "vide" },
        el("div", { class: "emoji", texte: "🧭" }),
        el("h3", { texte: "Exercice introuvable" }),
        el("p", { texte: "Il a peut-être été renommé ou supprimé." }),
        el("button", { class: "btn btn-doux", onclick: () => this.aller("#/c/" + cours.slug) }, "← Retour au cours")
      ));
      return;
    }

    this.vue.append(this._fil([
      ["Accueil", "#/"],
      [cours.nom, "#/c/" + cours.slug],
      [exo.titre || "Exercice", null]
    ]));

    const meta = this._metaType(exo);
    const resultat = Progres.lire(cours.slug, exo.id);

    this.vue.append(el("header", { class: "exo-entete", style: { "--tc": cours.couleur } },
      el("div", { class: "exo-entete-info" },
        el("h1", {}, el("span", { class: "exo-num", texte: numero }), exo.titre || "Exercice"),
        el("p", { class: "desc", texte: (chapitre.titre ? chapitre.titre + " · " : "") + meta.taille })
      ),
      el("div", { class: "exo-outils" },
        resultat ? el("span", { class: "puce", texte: "record " + resultat.meilleur + " %" }) : null,
        el("span", { class: "type-badge type-" + exo.type, texte: meta.libelle }),
        el("button", { class: "btn btn-fantome btn-petit", onclick: () => this.aller("#/c/" + cours.slug) }, "← Cours")
      )
    ));

    const classeScene = { qcm: "qcm", code: "code-exo", terminal: "term-exo", jetpunk: "jp", probleme: "probleme-exo" };
    const scene = el("div", {
      class: classeScene[exo.type] || "jp",
      style: { "--tc": cours.couleur }
    });
    this.vue.append(scene);

    const tous = exercicesDuCours(cours.slug);
    const rang = tous.findIndex((e) => e.id === exo.id);
    const suivant = rang >= 0 && rang + 1 < tous.length ? tous[rang + 1] : null;

    const contexte = {
      slug: cours.slug,
      suivant: suivant ? { titre: suivant.titre, hash: "#/c/" + cours.slug + "/" + suivant.id } : null,
      couleur: cours.couleur,
      surRetour: () => this.aller("#/c/" + cours.slug),
      surFin: (score, total) => toast("Résultat enregistré : " + score + " / " + total)
    };

    if (exo.type === "qcm") MoteurQCM.lancer(scene, exo, contexte);
    else if (exo.type === "jetpunk") MoteurJetPunk.lancer(scene, exo, contexte);
    else if (exo.type === "code") MoteurCode.lancer(scene, exo, contexte);
    else if (exo.type === "terminal") MoteurTerminal.lancer(scene, exo, contexte);
    else if (exo.type === "probleme") MoteurProbleme.lancer(scene, exo, contexte);
    else scene.append(el("div", { class: "vide" },
      el("div", { class: "emoji", texte: "🚧" }),
      el("h3", { texte: "Type d'exercice inconnu : " + exo.type }),
      el("p", {}, "Les types disponibles sont ", el("code", { texte: "qcm" }), ", ", el("code", { texte: "jetpunk" }), ", ", el("code", { texte: "code" }), " et ", el("code", { texte: "terminal" }), ".")
    ));
  },

  /* ---------------- Vue : un guide ---------------- */

  _guide(cours, guideId) {
    const guide = guidesDuCours(cours.slug).find((g) => g.id === guideId);

    if (!guide) {
      this.vue.append(this._fil([["Accueil", "#/"], [cours.nom, "#/c/" + cours.slug]]));
      this.vue.append(el("div", { class: "vide" },
        el("div", { class: "emoji", texte: "🧭" }),
        el("h3", { texte: "Guide introuvable" }),
        el("button", { class: "btn btn-doux", onclick: () => this.aller("#/c/" + cours.slug) }, "← Retour au cours")
      ));
      return;
    }

    document.title = guide.titre + " — " + cours.nom;

    this.vue.append(this._fil([
      ["Accueil", "#/"],
      [cours.nom, "#/c/" + cours.slug],
      [guide.titre, null]
    ]));

    const volume = decompteGuide(guide);

    this.vue.append(el("header", { class: "exo-entete", style: { "--tc": cours.couleur } },
      el("div", { class: "exo-entete-info" },
        el("h1", { texte: guide.titre }),
        el("p", {
          class: "desc",
          texte: [
            volume,
            guide.duree,
            guide.niveau
          ].filter(Boolean).join(" · ")
        })
      ),
      el("div", { class: "exo-outils" },
        el("span", { class: "type-badge type-guide", texte: guide.badge || "Guide" }),
        el("button", { class: "btn btn-fantome btn-petit", onclick: () => this.aller("#/c/" + cours.slug) }, "← Cours")
      )
    ));

    const scene = el("article", { class: "guide", style: { "--tc": cours.couleur } });
    this.vue.append(scene);

    MoteurGuide.lancer(scene, guide, {
      couleur: cours.couleur,
      surRetour: () => this.aller("#/c/" + cours.slug)
    });
  },

  /* ---------------- Fragments communs ---------------- */

  _fil(etapes) {
    const fil = el("nav", { class: "fil" });
    etapes.forEach((etape, i) => {
      const [libelle, lien] = etape;
      if (i > 0) fil.append(el("span", { texte: "›" }));
      fil.append(lien
        ? el("a", { onclick: () => this.aller(lien), texte: libelle })
        : el("span", { texte: libelle, style: { color: "var(--texte-doux)", fontWeight: "650" } })
      );
    });
    return fil;
  },

  _videPourCours(cours) {
    return el("div", { class: "vide" },
      el("div", { class: "emoji", texte: cours.emoji }),
      el("h3", { texte: "Aucun contenu pour le moment" })
    );
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
