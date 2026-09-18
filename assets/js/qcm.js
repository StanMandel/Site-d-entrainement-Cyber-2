/* =============================================================
   Moteur de QCM
   -------------------------------------------------------------
   Une question à la fois, correction immédiate, explication
   facultative, puis écran de résultat avec récapitulatif.
   Gère les questions à réponse unique et à réponses multiples.
   Si l'exercice a un champ cours ou exemple, ils sont affichés à
   gauche des questions (cartesPrincipe, dans code.js).

   Utilisation :
     MoteurQCM.lancer(conteneur, exercice, {
       slug, couleur, surRetour(), surFin(score, total)
     });
   ============================================================= */

const MoteurQCM = {
  lancer(conteneur, exercice, contexte) {
    const etat = {
      exercice: exercice,
      contexte: contexte,
      questions: this._preparer(exercice),
      index: 0,
      selection: [],
      valide: false,
      historique: []
    };
    this._rendre(conteneur, etat);
  },

  /* Prépare (et mélange) les questions ; normalise le champ « reponse ».
     Avec « tirage », seules N questions de la banque sont gardées, au hasard. */
  _preparer(exercice) {
    const brutes = exercice.questions || [];
    let liste = exercice.melanger === false && !exercice.tirage ? brutes.slice() : melanger(brutes);
    if (exercice.tirage > 0) liste = liste.slice(0, exercice.tirage);

    return liste.map((q) => {
      const bonnes = Array.isArray(q.reponse) ? q.reponse.slice() : [q.reponse];
      let choix = (q.choix || []).map((texte, i) => ({ texte: texte, bon: bonnes.includes(i) }));
      if (exercice.melangerChoix) choix = melanger(choix);
      return { enonce: q.enonce, code: q.code, explication: q.explication, choix: choix };
    });
  },

  /* ---------------- Rendu d'une question ---------------- */

  _rendre(conteneur, etat) {
    vider(conteneur);

    const question = etat.questions[etat.index];
    const multiple = question.choix.filter((c) => c.bon).length > 1;
    const total = etat.questions.length;

    const jauge = el("div", { class: "qcm-jauge" },
      el("i", { style: { width: ((etat.index / total) * 100) + "%" } })
    );

    const carte = el("div", { class: "qcm-carte" });
    carte.append(
      el("div", { class: "qcm-numero", texte: `Question ${etat.index + 1} sur ${total}` }),
      el("h2", { class: "qcm-enonce", texte: question.enonce })
    );
    if (multiple) carte.append(el("div", { class: "qcm-multi", texte: "Plusieurs réponses attendues" }));
    if (question.code) carte.append(el("pre", { class: "bloc-code", texte: question.code }));

    const zoneChoix = el("div", { class: "qcm-choix" });
    const boutons = question.choix.map((choix, i) => {
      const bouton = el("button", {
        class: "choix",
        type: "button",
        onclick: () => this._cliquer(conteneur, etat, i, multiple)
      },
        el("span", { class: "choix-lettre", texte: String.fromCharCode(65 + i) }),
        el("span", { class: "choix-texte", texte: choix.texte })
      );
      zoneChoix.append(bouton);
      return bouton;
    });
    carte.append(zoneChoix);

    const pied = el("div", { class: "qcm-pied" });
    carte.append(pied);

    /* Principe et exemple facultatifs : à gauche, comme les exercices de code */
    const principe = cartesPrincipe(etat.exercice, "Code");
    if (principe.length) {
      conteneur.append(el("div", { class: "qcm-avec-principe" },
        el("div", { class: "code-enonce" }, ...principe),
        el("div", { class: "qcm-zone" }, jauge, carte)
      ));
    } else {
      conteneur.append(jauge, carte);
    }

    etat._boutons = boutons;
    etat._carte = carte;
    etat._pied = pied;
    etat._multiple = multiple;

    if (multiple) {
      pied.append(
        el("span", { class: "espace" }),
        el("button", {
          class: "btn btn-principal",
          disabled: true,
          onclick: () => this._valider(conteneur, etat)
        }, "Valider")
      );
      etat._btnValider = pied.querySelector("button");
    }
  },

  _cliquer(conteneur, etat, i, multiple) {
    if (etat.valide) return;

    if (multiple) {
      const pos = etat.selection.indexOf(i);
      if (pos >= 0) etat.selection.splice(pos, 1);
      else etat.selection.push(i);
      etat._boutons.forEach((b, j) => b.classList.toggle("selection", etat.selection.includes(j)));
      etat._btnValider.disabled = etat.selection.length === 0;
    } else {
      etat.selection = [i];
      this._valider(conteneur, etat);
    }
  },

  /* ---------------- Correction ---------------- */

  _valider(conteneur, etat) {
    if (etat.valide) return;
    etat.valide = true;

    const question = etat.questions[etat.index];
    const attendues = question.choix.map((c, i) => (c.bon ? i : -1)).filter((i) => i >= 0);
    const juste =
      etat.selection.length === attendues.length &&
      attendues.every((i) => etat.selection.includes(i));

    etat._boutons.forEach((bouton, i) => {
      bouton.classList.add("verrou");
      bouton.classList.remove("selection");
      const estBon = question.choix[i].bon;
      const choisi = etat.selection.includes(i);
      if (estBon) {
        bouton.classList.add("juste");
        bouton.append(el("span", { class: "choix-marque", texte: "✓" }));
      } else if (choisi) {
        bouton.classList.add("faux");
        bouton.append(el("span", { class: "choix-marque", texte: "✕" }));
      }
    });

    etat.historique.push({
      enonce: question.enonce,
      juste: juste,
      donnee: etat.selection.map((i) => question.choix[i].texte).join(", ") || "aucune réponse",
      attendue: attendues.map((i) => question.choix[i].texte).join(", ")
    });

    const texteExplication = question.explication
      ? question.explication
      : juste
        ? "Bonne réponse."
        : "La bonne réponse est en vert.";

    vider(etat._pied);
    etat._carte.append(
      el("div", { class: "explication" + (juste ? " ok" : "") },
        el("b", { texte: juste ? "✓ Correct — " : "✕ Incorrect — " }),
        texteExplication
      )
    );
    etat._carte.append(etat._pied);

    const dernier = etat.index === etat.questions.length - 1;
    const nbJustes = etat.historique.filter((h) => h.juste).length;

    etat._pied.append(
      el("span", { class: "compteur" }, String(nbJustes), el("span", { texte: "/ " + etat.historique.length })),
      el("span", { class: "espace" }),
      el("button", {
        class: "btn btn-principal",
        onclick: () => {
          if (dernier) {
            this._resultat(conteneur, etat);
          } else {
            etat.index++;
            etat.selection = [];
            etat.valide = false;
            this._rendre(conteneur, etat);
            conteneur.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, dernier ? "Voir le résultat →" : "Question suivante →")
    );
  },

  /* ---------------- Écran de résultat ---------------- */

  _resultat(conteneur, etat) {
    const score = etat.historique.filter((h) => h.juste).length;
    const total = etat.questions.length;
    const pourcent = Math.round((score / total) * 100);

    Progres.ecrire(etat.contexte.slug, etat.exercice.id, score, total);

    const palier =
      pourcent === 100 ? { emoji: "🏆", titre: "Sans faute !", sous: "Ce chapitre est acquis." } :
      pourcent >= 80   ? { emoji: "🎉", titre: "Très bon score", sous: "Encore quelques détails à revoir." } :
      pourcent >= 50   ? { emoji: "💪", titre: "En bonne voie", sous: "Relisez les points manqués puis retentez." } :
                         { emoji: "📚", titre: "À retravailler", sous: "Reprenez le cours avant de recommencer." };

    vider(conteneur);

    const recap = el("div", { class: "recap" }, el("h3", { texte: "Récapitulatif" }));
    etat.historique.forEach((h, i) => {
      recap.append(
        el("div", { class: "recap-item " + (h.juste ? "ok" : "ko") },
          el("div", { class: "q", texte: `${i + 1}. ${h.enonce}` }),
          el("div", { class: "r" },
            h.juste
              ? el("span", {}, "Votre réponse : ", el("b", { texte: h.donnee }))
              : el("span", {}, "Votre réponse : ", el("b", { texte: h.donnee }), " — attendu : ", el("b", { texte: h.attendue }))
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
        el("p", { class: "sous", texte: pourcent + " % de bonnes réponses" }),
        el("div", { class: "resultat-actions" },
          el("button", {
            class: "btn btn-principal",
            onclick: () => this.lancer(conteneur, etat.exercice, etat.contexte)
          }, "↻ Recommencer"),
          el("button", { class: "btn btn-fantome", onclick: etat.contexte.surRetour }, "← Retour au cours")
        ),
        recap
      )
    );

    if (etat.contexte.surFin) etat.contexte.surFin(score, total);
    conteneur.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
