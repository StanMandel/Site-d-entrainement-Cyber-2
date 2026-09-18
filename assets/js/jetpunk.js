/* =============================================================
   Moteur « JetPunk »
   -------------------------------------------------------------
   Une barre de saisie en haut, une grille de tuiles en dessous.
   Dès que l'utilisateur tape la bonne réponse associée à une tuile,
   celle-ci passe au vert. Quand toutes les tuiles sont vertes,
   le jeu est terminé.

   Utilisation :
     MoteurJetPunk.lancer(conteneur, exercice, {
       slug, couleur, surRetour(), surFin(score, total)
     });
   ============================================================= */

const MoteurJetPunk = {
  lancer(conteneur, exercice, contexte) {
    /* Avec « tirage », seules N tuiles de la banque sont gardées, au hasard */
    const source = exercice.tirage > 0
      ? melanger(exercice.items || []).slice(0, exercice.tirage)
      : (exercice.items || []);
    const items = source.map((item, i) => ({
      indice: item.indice,
      reponse: item.reponse,
      note: item.note,
      /* toutes les graphies acceptées, normalisées */
      cles: [item.reponse, ...(item.alt || [])].map(normaliser).filter(Boolean),
      index: i,
      trouve: false
    }));

    const etat = {
      exercice: exercice,
      contexte: contexte,
      items: exercice.melanger ? melanger(items) : items,
      restant: items.length,
      termine: false,
      debut: Date.now(),
      chrono: null,
      secondes: exercice.temps || 0
    };

    this._rendre(conteneur, etat);
  },

  _rendre(conteneur, etat) {
    vider(conteneur);
    const exercice = etat.exercice;

    /* ---- Barre de saisie ---- */
    const saisie = el("input", {
      class: "jp-saisie",
      type: "text",
      autocomplete: "off",
      autocapitalize: "off",
      spellcheck: "false"
    });

    const compteur = el("div", { class: "compteur" },
      el("b", { texte: "0" }),
      el("span", { texte: "/ " + etat.items.length })
    );

    const barre = el("div", { class: "jp-barre" }, saisie, compteur);

    let affichageChrono = null;
    if (etat.secondes > 0) {
      affichageChrono = el("div", { class: "chrono", texte: "⏱ " + formaterTemps(etat.secondes) });
      barre.append(affichageChrono);
    }

    const btnAbandon = el("button", {
      class: "btn btn-fantome btn-petit",
      onclick: () => this._terminer(etat, false)
    }, "Abandonner");
    barre.append(btnAbandon);

    /* ---- Grille de tuiles ---- */
    const colonnes = exercice.colonnes || Math.min(4, Math.max(2, Math.ceil(Math.sqrt(etat.items.length))));
    const grille = el("div", { class: "jp-grille", style: { "--cols": colonnes } });

    etat.items.forEach((item) => {
      const masque = !!exercice.masquerIndice;
      const tuile = el("div", { class: "tuile" + (masque ? " tuile-cache" : "") },
        el("div", { class: "tuile-indice", texte: masque ? "• • •" : item.indice }),
        el("div", { class: "tuile-reponse" })
      );
      item._tuile = tuile;
      grille.append(tuile);
    });

    const zoneResultat = el("div", {});
    const consigne = exercice.consigne
      ? el("p", { class: "sous", texte: exercice.consigne, style: { color: "var(--texte-doux)", marginBottom: ".9rem" } })
      : null;

    if (consigne) conteneur.append(consigne);
    conteneur.append(zoneResultat, barre, grille);

    etat._saisie = saisie;
    etat._compteur = compteur.querySelector("b");
    etat._btnAbandon = btnAbandon;
    etat._zoneResultat = zoneResultat;
    etat._affichageChrono = affichageChrono;

    saisie.addEventListener("input", () => this._verifier(etat));
    saisie.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this._verifier(etat);
      }
    });
    saisie.focus();

    if (etat.secondes > 0) {
      etat.chrono = setInterval(() => {
        etat.secondes--;
        affichageChrono.textContent = "⏱ " + formaterTemps(etat.secondes);
        affichageChrono.classList.toggle("urgent", etat.secondes <= 15);
        if (etat.secondes <= 0) this._terminer(etat, false);
      }, 1000);
    }
  },

  /* ---------------- Vérification de la saisie ---------------- */

  _verifier(etat) {
    if (etat.termine) return;

    const tape = normaliser(etat._saisie.value);
    if (!tape) return;

    const item = etat.items.find((it) => !it.trouve && it.cles.includes(tape));
    if (!item) return;

    item.trouve = true;
    etat.restant--;
    etat._saisie.value = "";
    etat._compteur.textContent = String(etat.items.length - etat.restant);

    const tuile = item._tuile;
    tuile.classList.add("trouve");
    tuile.classList.remove("tuile-cache");
    tuile.querySelector(".tuile-indice").textContent = item.indice;
    tuile.querySelector(".tuile-reponse").textContent = item.reponse;
    if (item.note) tuile.append(el("div", { class: "tuile-note", texte: item.note }));

    etat._saisie.classList.add("flash-ok");
    setTimeout(() => etat._saisie.classList.remove("flash-ok"), 320);

    if (etat.restant === 0) this._terminer(etat, true);
  },

  /* ---------------- Fin de partie ---------------- */

  _terminer(etat, complet) {
    if (etat.termine) return;
    etat.termine = true;
    clearInterval(etat.chrono);

    etat._saisie.disabled = true;
    etat._saisie.value = "";
    etat._saisie.placeholder = complet ? "Terminé !" : "Partie terminée";
    etat._btnAbandon.remove();

    /* Révèle les tuiles manquées en rouge */
    etat.items.forEach((item) => {
      if (item.trouve) return;
      const tuile = item._tuile;
      tuile.classList.add("manque");
      tuile.classList.remove("tuile-cache");
      tuile.querySelector(".tuile-indice").textContent = item.indice;
      tuile.querySelector(".tuile-reponse").textContent = item.reponse;
      if (item.note) tuile.append(el("div", { class: "tuile-note", texte: item.note }));
    });

    const score = etat.items.length - etat.restant;
    const total = etat.items.length;
    const pourcent = Math.round((score / total) * 100);
    const duree = Math.round((Date.now() - etat.debut) / 1000);

    Progres.ecrire(etat.contexte.slug, etat.exercice.id, score, total);

    const palier =
      pourcent === 100 ? { emoji: "🏆", titre: "Grille complète !", sous: `Toutes les tuiles trouvées en ${formaterTemps(duree)}.` } :
      pourcent >= 75   ? { emoji: "🎉", titre: "Beau parcours", sous: "Les tuiles rouges sont celles à revoir." } :
      pourcent >= 40   ? { emoji: "💪", titre: "Encore un effort", sous: "Relisez les réponses manquées puis retentez." } :
                         { emoji: "📚", titre: "À retravailler", sous: "Revoyez la liste avant de recommencer." };

    vider(etat._zoneResultat);
    etat._zoneResultat.append(
      el("div", { class: "resultat", style: { marginBottom: "1.2rem" } },
        el("div", { class: "emoji", texte: palier.emoji }),
        el("h2", { texte: palier.titre }),
        el("p", { class: "sous", texte: palier.sous }),
        el("div", { class: "resultat-score" }, String(score), el("span", { texte: "/ " + total })),
        el("p", { class: "sous", texte: pourcent + " % — durée : " + formaterTemps(duree) }),
        el("div", { class: "resultat-actions" },
          el("button", {
            class: "btn btn-principal",
            onclick: () => this.lancer(etat._zoneResultat.parentNode, etat.exercice, etat.contexte)
          }, "↻ Recommencer"),
          el("button", { class: "btn btn-fantome", onclick: etat.contexte.surRetour }, "← Retour au cours")
        )
      )
    );

    if (etat.contexte.surFin) etat.contexte.surFin(score, total);
    etat._zoneResultat.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
