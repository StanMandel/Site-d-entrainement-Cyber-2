/* =============================================================
   Moteur des exercices « terminal »
   -------------------------------------------------------------
   Un scénario d'attaque décomposé en objectifs. Pour chacun,
   l'utilisateur tape une commande dans un terminal simulé ; si la
   commande remplit l'objectif, une sortie réaliste s'affiche et on
   passe à l'objectif suivant.

   Une commande est acceptée quand elle vérifie TOUS les motifs
   (expressions régulières, insensibles à la casse) de l'objectif et
   AUCUN motif « interdire ». La logique de validation (evaluer) est
   pure : elle sert aussi à vérifier les solutions sous Node.

   Format d'un objectif :
     {
       enonce:   "Testez l'authentification …",   // ce qu'il faut faire
       indice:   "Protocole smb, options -u/-p",  // aide facultative
       motifs:   ["^nxc\\s+smb", "-u\\s", "-p\\s"], // tous obligatoires
       interdire:["--shares"],                     // facultatif
       solution: "nxc smb 10.0.0.5 -u a -p b",      // commande modèle
       sortie:   "SMB  10.0.0.5  …"                 // sortie simulée
     }

   Utilisation (navigateur) :
     MoteurTerminal.lancer(conteneur, exercice, {
       slug, couleur, surRetour(), suivant, surFin(score, total)
     });
   ============================================================= */

(function (racine) {
  "use strict";

  /* ---------------- Validation (pure, réutilisable) ---------------- */

  function normaliserCommande(texte) {
    return String(texte ?? "").trim().replace(/\s+/g, " ");
  }

  /** { ok, vide, interdit } — un objectif est-il rempli par cette commande ? */
  function evaluer(objectif, commande) {
    const cmd = normaliserCommande(commande);
    if (!cmd) return { ok: false, vide: true };
    for (const motif of objectif.motifs || []) {
      if (!new RegExp(motif, "i").test(cmd)) return { ok: false };
    }
    for (const motif of objectif.interdire || []) {
      if (new RegExp(motif, "i").test(cmd)) return { ok: false, interdit: true };
    }
    return { ok: true };
  }

  const MoteurTerminal = { evaluer: evaluer, normaliserCommande: normaliserCommande };

  /* ---------------- Lancement (navigateur) ---------------- */

  MoteurTerminal.lancer = function (conteneur, exo, contexte) {
    vider(conteneur);

    const etat = {
      conteneur: conteneur,
      exo: exo,
      contexte: contexte,
      objectifs: exo.objectifs || [],
      index: 0,
      resolus: (exo.objectifs || []).map(() => false),
      revele: (exo.objectifs || []).map(() => false),
      echecs: 0,
      invite: exo.invite || "kali@kali:~$",
      historique: [],
      curseurHisto: 0
    };

    const enonce = el("div", { class: "code-enonce" });
    const travail = el("div", { class: "code-travail" });
    conteneur.append(enonce, travail);

    /* ---- Colonne de gauche : contexte et objectif courant ---- */
    enonce.append(...cartesPrincipe(exo, "Terminal"));

    if (exo.intro) {
      const scenario = el("section", { class: "code-carte" }, el("h3", { texte: "Scénario" }));
      scenario.append(...blocsTexte(exo.intro));
      enonce.append(scenario);
    }

    const panneau = el("section", { class: "code-carte term-objectif" });
    enonce.append(panneau);
    etat.panneau = panneau;

    /* ---- Colonne de droite : terminal ---- */
    const sortie = el("div", { class: "term-sortie" });
    const saisie = el("input", {
      class: "term-saisie", type: "text", spellcheck: "false",
      autocomplete: "off", autocapitalize: "off", autocorrect: "off",
      "aria-label": "Ligne de commande"
    });
    const ligne = el("label", { class: "term-ligne" },
      el("span", { class: "term-invite", texte: etat.invite }),
      saisie
    );
    const term = el("div", { class: "term" },
      el("div", { class: "term-barre" },
        el("span", { class: "term-pastilles" }, el("i"), el("i"), el("i")),
        el("span", { class: "term-titre", texte: exo.terminal || "bash" })
      ),
      sortie,
      ligne
    );
    travail.append(term);
    etat.sortie = sortie;
    etat.saisie = saisie;

    term.addEventListener("click", (e) => {
      if (!e.target.closest("button")) saisie.focus();
    });
    saisie.addEventListener("keydown", (e) => this._touche(etat, e));

    this._imprimer(etat, exo.accueil || "Attack terminal — type 'help' for a hint, 'solution' to reveal the command.", "term-info");
    this._imprimer(etat, "", "term-vide");
    this._majPanneau(etat);
    this._banniereObjectif(etat);
    requestAnimationFrame(() => saisie.focus());
  };

  /* ---------------- Clavier ---------------- */

  MoteurTerminal._touche = function (etat, e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const valeur = etat.saisie.value;
      etat.saisie.value = "";
      this._soumettre(etat, valeur);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!etat.historique.length) return;
      etat.curseurHisto = Math.max(0, etat.curseurHisto - 1);
      etat.saisie.value = etat.historique[etat.curseurHisto] || "";
      requestAnimationFrame(() => etat.saisie.setSelectionRange(etat.saisie.value.length, etat.saisie.value.length));
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!etat.historique.length) return;
      etat.curseurHisto = Math.min(etat.historique.length, etat.curseurHisto + 1);
      etat.saisie.value = etat.historique[etat.curseurHisto] || "";
    }
  };

  /* ---------------- Soumission d'une commande ---------------- */

  MoteurTerminal._soumettre = function (etat, valeur) {
    const cmd = valeur.trim();
    this._imprimer(etat, etat.invite + " " + valeur, "term-echo");
    if (!cmd) return;

    etat.historique.push(cmd);
    etat.curseurHisto = etat.historique.length;

    const mot = cmd.toLowerCase();
    if (["clear", "cls"].includes(mot)) { vider(etat.sortie); return; }
    if (["help", "hint", "?"].includes(mot)) {
      const objectif = etat.objectifs[etat.index];
      this._imprimer(etat, "Hint: " + (objectif.indice || "Read the objective in the left panel."), "term-info");
      return;
    }
    if (["objective", "goal"].includes(mot)) { this._banniereObjectif(etat); return; }
    if (["solution", "reveal"].includes(mot)) { this._reveler(etat); return; }

    const objectif = etat.objectifs[etat.index];
    const r = evaluer(objectif, cmd);

    if (r.ok) {
      etat.resolus[etat.index] = true;
      etat.echecs = 0;
      if (objectif.sortie) this._imprimer(etat, objectif.sortie, "term-bloc");
      this._imprimer(etat, "[+] Objective reached" + (etat.revele[etat.index] ? " (solution revealed)" : "") + ".", "term-ok");
      this._avancer(etat);
    } else {
      etat.echecs++;
      const message = r.interdit
        ? "This command uses an option to avoid for this objective."
        : "This command does not meet the objective.";
      this._imprimer(etat, "[-] " + message, "term-ko");
      if (etat.echecs >= 2 && !etat.revele[etat.index]) {
        this._imprimer(etat, "Type 'help' for a hint or 'solution' for the command.", "term-info");
      }
    }
  };

  MoteurTerminal._reveler = function (etat) {
    const objectif = etat.objectifs[etat.index];
    etat.revele[etat.index] = true;
    this._imprimer(etat, "Suggested command (does not count toward your score):", "term-info");
    this._imprimer(etat, objectif.solution || "(none)", "term-bloc");
  };

  MoteurTerminal._avancer = function (etat) {
    if (etat.index >= etat.objectifs.length - 1) {
      this._terminer(etat);
      return;
    }
    etat.index++;
    etat.echecs = 0;
    this._majPanneau(etat);
    this._banniereObjectif(etat);
  };

  /* ---------------- Affichage du terminal ---------------- */

  MoteurTerminal._imprimer = function (etat, texte, classe) {
    const noeud = classe === "term-bloc"
      ? el("pre", { class: "term-ligne-sortie term-bloc", texte: texte })
      : el("div", { class: "term-ligne-sortie " + (classe || ""), texte: texte });
    etat.sortie.append(noeud);
    etat.sortie.scrollTop = etat.sortie.scrollHeight;
  };

  MoteurTerminal._banniereObjectif = function (etat) {
    this._imprimer(etat, "[*] Objective " + (etat.index + 1) + " / " + etat.objectifs.length + " — see the goal in the left panel.", "term-objectif-ligne");
  };

  /* ---------------- Panneau de gauche ---------------- */

  MoteurTerminal._majPanneau = function (etat) {
    const objectif = etat.objectifs[etat.index];
    const panneau = vider(etat.panneau);

    panneau.append(
      el("div", { class: "term-obj-tete" },
        el("h3", { texte: "Objectif" }),
        el("span", { class: "puce", texte: (etat.index + 1) + " / " + etat.objectifs.length })
      ),
      el("div", { class: "term-jauge" }, el("i", { style: { width: (etat.index / etat.objectifs.length) * 100 + "%" } })),
      el("p", { class: "term-obj-enonce", html: texteRiche(objectif.enonce) })
    );

    if (objectif.indice) {
      const aide = el("div", { class: "term-obj-indice", hidden: true },
        el("b", { texte: "Indice — " }), el("span", { html: texteRiche(objectif.indice) })
      );
      panneau.append(
        el("button", {
          class: "btn btn-fantome btn-petit",
          type: "button",
          onclick: (e) => { aide.hidden = !aide.hidden; e.currentTarget.textContent = aide.hidden ? "Afficher l'indice" : "Masquer l'indice"; }
        }, "Afficher l'indice"),
        aide
      );
    }
  };

  /* ---------------- Écran de fin ---------------- */

  MoteurTerminal._terminer = function (etat) {
    const total = etat.objectifs.length;
    const score = etat.resolus.filter((v, i) => v && !etat.revele[i]).length;
    const pourcent = total > 0 ? Math.round((score / total) * 100) : 0;

    Progres.ecrire(etat.contexte.slug, etat.exo.id, score, total);

    const palier =
      pourcent === 100 ? { emoji: "🏴‍☠️", titre: "Réseau compromis", sous: "Toutes les commandes trouvées sans aide." } :
      pourcent >= 60   ? { emoji: "🎯", titre: "Belle progression", sous: "Revoyez les commandes révélées puis retentez." } :
                         { emoji: "🧰", titre: "À retravailler", sous: "Relisez le guide des commandes avant de recommencer." };

    const conteneur = vider(etat.conteneur);

    const recap = el("div", { class: "recap" }, el("h3", { texte: "Récapitulatif" }));
    etat.objectifs.forEach((objectif, i) => {
      const sansAide = etat.resolus[i] && !etat.revele[i];
      recap.append(
        el("div", { class: "recap-item " + (sansAide ? "ok" : "ko") },
          el("div", { class: "q", texte: (i + 1) + ". " + objectif.enonce }),
          el("div", { class: "r" },
            el("span", {}, "Commande : ", el("b", {}, el("code", { texte: objectif.solution || "—" })),
              sansAide ? "" : " — solution révélée")
          )
        )
      );
    });

    conteneur.append(
      el("div", { class: "resultat" },
        el("div", { class: "emoji", texte: palier.emoji }),
        el("h2", { texte: palier.titre }),
        el("p", { class: "sous", texte: palier.sous }),
        el("div", { class: "resultat-score" }, String(score), el("span", { texte: "/ " + total })),
        el("p", { class: "sous", texte: pourcent + " % des objectifs réussis sans aide" }),
        el("div", { class: "resultat-actions" },
          el("button", { class: "btn btn-principal", onclick: () => this.lancer(conteneur, etat.exo, etat.contexte) }, "↻ Recommencer"),
          etat.contexte.suivant
            ? el("button", { class: "btn btn-doux", onclick: () => App.aller(etat.contexte.suivant.hash) }, "Exercice suivant →")
            : null,
          el("button", { class: "btn btn-fantome", onclick: etat.contexte.surRetour }, "← Retour au cours")
        ),
        recap
      )
    );

    if (etat.contexte.surFin) etat.contexte.surFin(score, total);
    conteneur.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (typeof module !== "undefined" && module.exports) module.exports = MoteurTerminal;
  racine.MoteurTerminal = MoteurTerminal;
})(typeof window !== "undefined" ? window : globalThis);
