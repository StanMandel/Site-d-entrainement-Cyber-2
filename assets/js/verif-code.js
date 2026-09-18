/* =============================================================
   Vérification des exercices de programmation
   -------------------------------------------------------------
   Exécute le code de l'utilisateur sur chaque test de l'exercice
   et compare les valeurs obtenues aux valeurs attendues.
   Sans DOM : sert aussi à vérifier les solutions sous Node.

   Utilisation :
     const r = VerifCode.verifier(exercice, source);
     r.ok, r.score, r.total, r.erreur, r.contraintes, r.tests, r.etat
   ============================================================= */

(function (racine) {
  "use strict";

  const AsmX86 = racine.AsmX86 || (typeof require !== "undefined" ? require("./asm-x86.js") : null);
  const MiniC = racine.MiniC || (typeof require !== "undefined" ? require("./mini-c.js") : null);

  const MAX_AFFICHES = 16;

  function verifier(exo, source) {
    const langage = exo.langage === "c" ? "c" : "asm";
    const tests = exo.tests || [];
    const resultat = {
      langage, ok: false, score: 0, total: tests.length,
      erreur: null, contraintes: [], tests: [], etat: [], sortie: ""
    };

    let programme;
    try {
      programme = langage === "c" ? MiniC.analyser(source) : AsmX86.assembler(source);
    } catch (e) {
      if (!e.erreurCode) throw e;
      resultat.erreur = { ligne: e.ligne, message: e.message };
      return resultat;
    }

    resultat.contraintes = contraintes(exo, programme, source, langage);

    let affichee = null;
    tests.forEach((test, n) => {
      const bilan = executerTest(test, programme, langage, exo);
      bilan.numero = n + 1;
      resultat.tests.push(bilan);
      if (bilan.ok) resultat.score++;
      if (!affichee || (affichee.ok && !bilan.ok)) affichee = bilan;
    });

    if (affichee) {
      resultat.etat = affichee.etat;
      resultat.sortie = affichee.sortie;
      resultat.testAffiche = affichee.numero;
    }
    resultat.ok = resultat.contraintes.length === 0 && tests.length > 0 && resultat.score === tests.length;
    return resultat;
  }

  /* ---------------- Contraintes ---------------- */

  function contraintes(exo, programme, source, langage) {
    const liste = [];
    const usages = langage === "c" ? usagesC(programme) : usagesAsm(programme);

    for (const regle of exo.interdire || []) {
      for (const mot of regle.split("|")) {
        if (usages.has(mot)) {
          liste.push({ ligne: usages.get(mot), message: "« " + mot + " » est interdit dans cet exercice" });
        }
      }
    }
    for (const regle of exo.imposer || []) {
      const mots = regle.split("|");
      if (!mots.some((m) => usages.has(m))) {
        liste.push({ ligne: null, message: "Utiliser " + mots.map((m) => "« " + m + " »").join(" ou ") });
      }
    }
    for (const regle of exo.motifs || []) {
      const texte = langage === "c" ? source : sansCommentairesAsm(source);
      if (!new RegExp(regle.motif, regle.options || "").test(texte)) {
        liste.push({ ligne: null, message: regle.message });
      }
    }
    for (const regle of exo.exclure || []) {
      const texte = langage === "c" ? source : sansCommentairesAsm(source);
      if (new RegExp(regle.motif, regle.options || "").test(texte)) {
        liste.push({ ligne: null, message: regle.message });
      }
    }
    if (exo.sections && langage === "asm") {
      const noms = { text: ".text", data: ".data", bss: ".bss", rodata: ".rodata" };
      for (const [nom, section] of Object.entries(exo.sections)) {
        const sym = programme.symboles.get(nom);
        if (!sym) liste.push({ ligne: null, message: "« " + nom + " » n'est pas déclarée" });
        else if (sym.section !== section) {
          liste.push({ ligne: sym.ligne, message: "« " + nom + " » doit être dans " + noms[section] + " (elle est dans " + noms[sym.section] + ")" });
        }
      }
    }
    if (exo.aplati && langage === "c") {
      const probleme = MiniC.verifierAplati(programme);
      if (probleme) liste.push(probleme);
    }
    return liste;
  }

  /* Instructions utilisées → première ligne où elles apparaissent. */
  function usagesAsm(programme) {
    const usages = new Map();
    for (const ins of programme.code) {
      for (const mot of [ins.mn, ins.base]) {
        if (mot && !usages.has(mot)) usages.set(mot, ins.ligne);
      }
    }
    return usages;
  }

  function usagesC(programme) {
    const usages = new Map();
    for (const j of programme.jetons) {
      if ((j.k === "kw" || j.k === "id" || j.k === "op") && !usages.has(j.v)) usages.set(j.v, j.ligne);
    }
    return usages;
  }

  function sansCommentairesAsm(source) {
    return String(source).split("\n").map((l) => l.replace(/#.*$/, "")).join("\n");
  }

  /* ---------------- Un test ---------------- */

  function executerTest(test, programme, langage, exo) {
    const bilan = { entrees: test.entrees || {}, lignes: [], ok: true, erreur: null, etat: [], sortie: "" };
    const machine = langage === "c" ? MiniC.machine(programme) : AsmX86.machine(programme);

    try {
      for (const [cle, valeur] of Object.entries(bilan.entrees)) machine.poser(cle, valeur);
      machine.executer();
    } catch (e) {
      if (!e.erreurCode) throw e;
      bilan.erreur = { ligne: e.ligne, message: e.message };
      bilan.ok = false;
    }

    for (const [cle, attendu] of Object.entries(test.attendu || {})) {
      let ligne;
      try {
        ligne = langage === "c" ? comparerC(machine, cle, attendu, exo) : comparerAsm(machine, cle, attendu, exo);
      } catch (e) {
        if (!e.erreurCode) throw e;
        ligne = { cle, attendu: afficherAttendu(attendu), obtenu: "—", ok: false };
        if (!bilan.erreur) bilan.erreur = { ligne: null, message: e.message };
      }
      bilan.lignes.push(ligne);
      if (!ligne.ok) bilan.ok = false;
    }

    try {
      bilan.etat = langage === "c" ? etatC(machine) : etatAsm(machine, exo);
    } catch (e) {
      bilan.etat = [];
    }
    if (langage === "c") bilan.sortie = machine.sortie;
    return bilan;
  }

  const estTexte = (v) => typeof v === "string" && v.length !== 1 && !/^-?(0x[0-9a-f]+|\d+)$/i.test(v);

  function afficherAttendu(v) {
    if (Array.isArray(v)) return "[" + v.map(afficherAttendu).join(", ") + "]";
    if (estTexte(v)) return JSON.stringify(v);
    if (typeof v === "string" && v.length === 1) return String(v.charCodeAt(0)) + " ('" + v + "')";
    return String(v);
  }

  /* ---- Assembleur ---- */

  function indexer(cle, i) {
    const m = /^([^:]+)(:[bwlq])?$/.exec(cle);
    return m[1] + "[" + i + "]" + (m[2] || "");
  }

  function comparerAsm(machine, cle, attendu, exo) {
    const nonSigne = (exo.nonSigne || []).includes(cle);
    if (estTexte(attendu)) {
      const obtenu = machine.lireChaine(cle);
      return { cle, attendu: JSON.stringify(attendu), obtenu: JSON.stringify(obtenu), ok: obtenu === attendu };
    }
    if (Array.isArray(attendu)) {
      const obtenus = attendu.map((_, i) => valeurAsm(machine, indexer(cle, i), nonSigne));
      const ok = attendu.every((v, i) => egalAsm(obtenus[i], v));
      return {
        cle,
        attendu: "[" + attendu.map((v, i) => AsmX86.formater(AsmX86.versBigInt(v), obtenus[i].t, nonSigne || grand(v))).join(", ") + "]",
        obtenu: "[" + obtenus.map((o, i) => AsmX86.formater(o.v, o.t, nonSigne || grand(attendu[i]))).join(", ") + "]",
        ok
      };
    }
    const o = valeurAsm(machine, cle, nonSigne);
    const libre = nonSigne || grand(attendu);
    return {
      cle,
      attendu: AsmX86.formater(AsmX86.versBigInt(attendu), o.t, libre) + car(attendu),
      obtenu: AsmX86.formater(o.v, o.t, libre),
      ok: egalAsm(o, attendu)
    };
  }

  const grand = (v) => { try { return AsmX86.versBigInt(v) > 0x7fffffffn; } catch (e) { return false; } };
  const car = (v) => (typeof v === "string" && v.length === 1 ? " ('" + v + "')" : "");

  function valeurAsm(machine, cle) {
    const t = machine.cible(cle).t;
    return { v: machine.lireCle(cle), t };
  }

  function egalAsm(o, attendu) {
    const masque = AsmX86.MASQUE[o.t];
    return (o.v & masque) === (AsmX86.versBigInt(attendu) & masque);
  }

  function etatAsm(machine, exo) {
    const prog = machine.programme;
    const etat = [];
    for (const sym of prog.symboles.values()) {
      if (sym.section === "text") continue;
      const nonSigne = (exo.nonSigne || []).includes(sym.nom);
      let texte;
      if (sym.chaine) {
        texte = JSON.stringify(machine.lireChaine(sym.nom));
      } else {
        const t = sym.taille || (sym.etendue >= 4 ? 4 : sym.etendue || 1);
        const n = Math.max(1, Math.floor(sym.etendue / t));
        const valeurs = [];
        for (let i = 0; i < Math.min(n, MAX_AFFICHES); i++) {
          valeurs.push(AsmX86.formater(machine.lireMem(BigInt(sym.adresse + i * t), t), t, nonSigne));
        }
        texte = n === 1 ? valeurs[0] : "[" + valeurs.join(", ") + (n > MAX_AFFICHES ? ", …" : "") + "]";
      }
      etat.push({ nom: sym.nom, valeur: texte, sorte: "variable" });
    }
    for (const r of prog.registresCites) {
      const nonSigne = (exo.nonSigne || []).includes(r.nom);
      etat.push({ nom: r.nom, valeur: AsmX86.formater(machine.lireReg(r), r.t, nonSigne), sorte: "registre" });
    }
    return etat;
  }

  /* ---- C ---- */

  function comparerC(machine, cle, attendu) {
    const type = machine.typeCle(cle);
    const fmt = (v, t) => (t.signe ? BigInt.asIntN(8 * t.taille, v) : BigInt.asUintN(8 * t.taille, v)).toString();
    const norm = (v, t) => (t.signe ? BigInt.asIntN(8 * t.taille, MiniC.versBigInt(v)) : BigInt.asUintN(8 * t.taille, MiniC.versBigInt(v)));

    if (type.kind === "array") {
      if (estTexte(attendu)) {
        const obtenu = texteTableau(machine.emplacementCle(cle));
        return { cle, attendu: JSON.stringify(attendu), obtenu: JSON.stringify(obtenu), ok: obtenu === attendu };
      }
      const liste = [].concat(attendu);
      const obtenus = liste.map((_, i) => machine.lireCle(cle + "[" + i + "]"));
      return {
        cle,
        attendu: "[" + liste.map((v) => norm(v, type.elem).toString()).join(", ") + "]",
        obtenu: "[" + obtenus.map((v) => fmt(v, type.elem)).join(", ") + "]",
        ok: liste.every((v, i) => norm(v, type.elem) === obtenus[i])
      };
    }
    if (type.kind !== "int") throw new Error("Clé de test non numérique : " + cle);
    const obtenu = machine.lireCle(cle);
    return {
      cle,
      attendu: norm(attendu, type).toString() + car(attendu),
      obtenu: fmt(obtenu, type),
      ok: norm(attendu, type) === obtenu
    };
  }

  function texteTableau(emp) {
    let s = "";
    for (const c of emp.items) {
      if (c.v === 0n) break;
      s += String.fromCharCode(Number(BigInt.asUintN(8, c.v)));
    }
    return s;
  }

  function afficherValeurC(val) {
    const t = val.type;
    if (t.kind === "int") return val.v.toString();
    if (t.kind === "array") {
      if (t.elem.taille === 1 && val.items.some((c) => c.v === 0n) && val.items[0].v !== 0n) {
        return JSON.stringify(texteTableau(val));
      }
      const vus = val.items.slice(0, MAX_AFFICHES).map(afficherValeurC);
      return "[" + vus.join(", ") + (val.items.length > MAX_AFFICHES ? ", …" : "") + "]";
    }
    return "{ " + t.ordre.map((nom) => nom + ": " + afficherValeurC(val.champs[nom])).join(", ") + " }";
  }

  function etatC(machine) {
    return MiniC.variablesGlobales(machine).map(({ nom, valeur }) => ({
      nom, valeur: afficherValeurC(valeur), sorte: "variable"
    }));
  }

  /* ---------------- Présentation des entrées ---------------- */

  function decrireEntrees(entrees) {
    return Object.entries(entrees || {}).map(([cle, v]) => cle + " = " + afficherAttendu(v)).join(", ");
  }

  const VerifCode = { verifier, decrireEntrees, afficherAttendu };

  if (typeof module !== "undefined" && module.exports) module.exports = VerifCode;
  racine.VerifCode = VerifCode;
})(typeof window !== "undefined" ? window : globalThis);
