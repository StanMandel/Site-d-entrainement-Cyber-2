/* =============================================================
   Animation pas à pas d'un code C (champ « animation » des leçons)
   -------------------------------------------------------------
   Trace.executer(spec, scenario, n) exécute le code et renvoie la
   liste des étapes (sans DOM, utilisable sous Node). Chaque étape
   donne la ligne exécutée, ce qui s'y passe (test vrai / faux,
   affectation, tour de boucle, appel, return), les variables, les
   tableaux, les boucles actives avec leur numéro de tour, le nombre
   d'exécutions de chaque ligne et le nombre d'opérations
   élémentaires (règles du CM1).
   Trace.monter(spec) construit le lecteur (navigateur).

   Sous-ensemble de C pris en charge : fonctions (récursives
   comprises), int et tableaux d'int, if / else, for, while,
   do while, break, continue, return, opérateurs arithmétiques,
   de comparaison et logiques, ++ --, += -= *= /= %=, printf.

   Format :
     animation: {
       code: `int recherche(int t[], int n, int v) { … }`,
       appel: "recherche",               // fonction lancée (défaut : la première)
       n: { min: 1, max: 8, depart: 6 }, // si les entrées dépendent de n
       scenarios: [
         { nom: "Meilleur cas", texte: "`v` est en `t[0]`",
           entree: (n) => ({ t: [...], n, v: 7 }),
           attendu: (n) => ({ 3: 1 }) }   // vérifié par l'outil : ligne → exécutions
       ],
       mesure: { ligne: 3, nom: "comparaisons" },  // compté dans le bilan
       boucles: { 2: "boucle sur i" },  // libellés (ligne d'en-tête → nom)
       tableau: "t", pointeurs: ["i"],  // tableau dessiné et indices affichés
       operations: true                 // compteur d'opérations élémentaires
     }
   ============================================================= */

const Trace = (() => {
  "use strict";

  const PAS_MAX = 6000, APPELS_MAX = 600;

  function erreur(message, ligne) {
    const e = new Error(message + (ligne ? " (ligne " + ligne + ")" : ""));
    e.ligne = ligne || null;
    return e;
  }

  /* ---------------- Analyse lexicale ---------------- */

  const TYPES = new Set(["int", "long", "short", "char", "unsigned", "signed", "void", "const", "bool"]);
  const MOTS = new Set([...TYPES, "if", "else", "for", "while", "do", "return", "break", "continue"]);
  const OPS = ["++", "--", "+=", "-=", "*=", "/=", "%=", "==", "!=", "<=", ">=", "&&", "||",
    "+", "-", "*", "/", "%", "<", ">", "=", "!", "?", ":", ";", ",", "(", ")", "[", "]", "{", "}"];

  function lexer(source) {
    const s = String(source ?? "").replace(/\r\n?/g, "\n");
    const jetons = [];
    let i = 0, ligne = 1;
    const motif = (re) => { re.lastIndex = i; return re.exec(s); };
    while (i < s.length) {
      const c = s[i];
      if (c === "\n") { ligne++; i++; continue; }
      if (/\s/.test(c)) { i++; continue; }
      if (s.startsWith("//", i) || c === "#") { while (i < s.length && s[i] !== "\n") i++; continue; }
      if (s.startsWith("/*", i)) {
        const f = s.indexOf("*/", i + 2);
        const fin = f < 0 ? s.length : f + 2;
        for (let k = i; k < fin; k++) if (s[k] === "\n") ligne++;
        i = fin;
        continue;
      }
      let m;
      if ((m = motif(/\d+/y))) { jetons.push({ k: "num", v: Number(m[0]), ligne }); i += m[0].length; continue; }
      if ((m = motif(/[A-Za-z_]\w*/y))) { jetons.push({ k: MOTS.has(m[0]) ? "kw" : "id", v: m[0], ligne }); i += m[0].length; continue; }
      if (c === '"' || c === "'") {
        let j = i + 1, t = "";
        while (j < s.length && s[j] !== c && s[j] !== "\n") {
          if (s[j] === "\\") { const e = s[j + 1]; t += e === "n" ? "\n" : e === "t" ? "\t" : e === "0" ? "\0" : e; j += 2; }
          else t += s[j++];
        }
        if (s[j] !== c) throw erreur(c === '"' ? "chaîne non refermée" : "caractère mal formé", ligne);
        jetons.push(c === '"' ? { k: "str", v: t, ligne } : { k: "num", v: t.charCodeAt(0) || 0, ligne });
        i = j + 1;
        continue;
      }
      const op = OPS.find((o) => s.startsWith(o, i));
      if (!op) throw erreur("caractère inattendu « " + c + " »", ligne);
      jetons.push({ k: "op", v: op, ligne });
      i += op.length;
    }
    jetons.push({ k: "fin", v: "fin du code", ligne });
    return jetons;
  }

  /* ---------------- Analyse syntaxique ---------------- */

  const NIVEAUX = [["||"], ["&&"], ["==", "!="], ["<", "<=", ">", ">="], ["+", "-"], ["*", "/", "%"]];
  const PRIORITE = {};
  NIVEAUX.forEach((ops, k) => ops.forEach((op) => { PRIORITE[op] = k + 1; }));

  function analyser(source) {
    const J = lexer(source);
    let p = 0;
    const boucles = [];
    const fonctions = new Map();
    const voir = () => J[p];
    const prendre = () => J[p++];
    const est = (v) => (J[p].k === "op" || J[p].k === "kw") && J[p].v === v;
    const attendre = (v) => {
      if (!est(v)) throw erreur("« " + v + " » attendu avant « " + J[p].v + " »", J[p].ligne);
      return prendre();
    };
    const debutType = () => J[p].k === "kw" && TYPES.has(J[p].v);
    const type = () => { while (debutType()) prendre(); };
    const nom = () => {
      const j = prendre();
      if (j.k !== "id") throw erreur("nom attendu, trouvé « " + j.v + " »", j.ligne);
      return j;
    };

    const finDe = (s) => s.k === "bloc" ? s.fin
      : s.k === "if" ? finDe(s.sinon || s.alors)
        : s.fin || s.ligne;

    function fonction() {
      type();
      const n = nom();
      attendre("(");
      const params = [];
      if (est("void") && J[p + 1].v === ")") prendre();
      while (!est(")")) {
        type();
        const id = nom();
        let tableau = false;
        if (est("[")) { prendre(); if (J[p].k === "num") prendre(); attendre("]"); tableau = true; }
        params.push({ nom: id.v, tableau });
        if (!est(")")) attendre(",");
      }
      attendre(")");
      const corps = bloc();
      return { nom: n.v, params, corps, ligne: n.ligne };
    }

    function bloc() {
      const debut = attendre("{");
      const corps = [];
      while (!est("}")) {
        if (voir().k === "fin") throw erreur("« } » manquante", debut.ligne);
        corps.push(instruction());
      }
      return { k: "bloc", corps, ligne: debut.ligne, fin: prendre().ligne };
    }

    function declaration() {
      const ligne = voir().ligne;
      type();
      const decls = [];
      do {
        const id = nom();
        let taille = null, init = null;
        if (est("[")) { prendre(); taille = expression(); attendre("]"); }
        if (est("=")) {
          prendre();
          if (est("{")) {
            prendre();
            init = { k: "liste", valeurs: [] };
            while (!est("}")) { init.valeurs.push(assignation()); if (!est("}")) attendre(","); }
            prendre();
          } else init = assignation();
        }
        decls.push({ nom: id.v, taille, init });
      } while (est(",") && prendre());
      return { k: "decl", decls, ligne };
    }

    function boucle(b, corps) {
      b.id = boucles.length;
      boucles.push(b);
      b.corps = corps();
      b.fin = finDe(b.corps);
      return b;
    }

    function instruction() {
      const j = voir(), ligne = j.ligne;
      if (est("{")) return bloc();
      if (est(";")) { prendre(); return { k: "vide", ligne }; }
      if (debutType()) { const d = declaration(); attendre(";"); return d; }
      if (j.k === "kw") {
        switch (j.v) {
          case "if": {
            prendre(); attendre("(");
            const cond = expression();
            attendre(")");
            const alors = instruction();
            let sinon = null;
            if (est("else")) { prendre(); sinon = instruction(); }
            return { k: "if", cond, alors, sinon, ligne };
          }
          case "while": {
            prendre(); attendre("(");
            const cond = expression();
            attendre(")");
            return boucle({ k: "while", cond, ligne }, instruction);
          }
          case "do": {
            prendre();
            const b = boucle({ k: "do", ligne }, instruction);
            const t = attendre("while");
            attendre("(");
            b.cond = expression();
            b.ligneTest = t.ligne;
            attendre(")"); attendre(";");
            b.fin = t.ligne;
            return b;
          }
          case "for": {
            prendre(); attendre("(");
            let init = null;
            if (!est(";")) init = debutType() ? declaration() : { k: "expr", e: expression(), ligne };
            attendre(";");
            const cond = est(";") ? null : expression();
            attendre(";");
            const pas = est(")") ? null : expression();
            attendre(")");
            const variable = init && (init.k === "decl" ? init.decls[0].nom
              : init.e.k === "assign" && init.e.g.k === "id" ? init.e.g.nom : null);
            return boucle({ k: "for", init, cond, pas, ligne, variable }, instruction);
          }
          case "return": {
            prendre();
            const e = est(";") ? null : expression();
            attendre(";");
            return { k: "return", e, ligne };
          }
          case "break": prendre(); attendre(";"); return { k: "break", ligne };
          case "continue": prendre(); attendre(";"); return { k: "continue", ligne };
          case "else": throw erreur("« else » sans « if »", ligne);
        }
      }
      const e = expression();
      attendre(";");
      return { k: "expr", e, ligne };
    }

    const expression = () => assignation();

    function assignation() {
      const g = conditionnelle();
      const j = voir();
      if (j.k === "op" && ["=", "+=", "-=", "*=", "/=", "%="].includes(j.v)) {
        prendre();
        if (g.k !== "id" && g.k !== "index") throw erreur("on ne peut affecter qu'une variable ou une case", j.ligne);
        return { k: "assign", op: j.v, g, d: assignation() };
      }
      return g;
    }

    function conditionnelle() {
      const c = binaire(0);
      if (!est("?")) return c;
      prendre();
      const a = expression();
      attendre(":");
      return { k: "cond", c, a, b: conditionnelle() };
    }

    function binaire(niveau) {
      if (niveau === NIVEAUX.length) return unaire();
      let g = binaire(niveau + 1);
      while (voir().k === "op" && NIVEAUX[niveau].includes(voir().v)) {
        const op = prendre().v;
        g = { k: "bin", op, g, d: binaire(niveau + 1) };
      }
      return g;
    }

    function unaire() {
      if (est("!") || est("-") || est("+")) { const op = prendre().v; return { k: "un", op, e: unaire() }; }
      if (est("++") || est("--")) { const op = prendre().v; return { k: "pre", op, e: unaire() }; }
      return postfixe();
    }

    function postfixe() {
      let e = primaire();
      for (;;) {
        if (est("[")) { prendre(); e = { k: "index", t: e, i: expression() }; attendre("]"); }
        else if (est("(") && e.k === "id") {
          const ligne = prendre().ligne;
          const args = [];
          while (!est(")")) { args.push(assignation()); if (!est(")")) attendre(","); }
          prendre();
          e = { k: "appel", nom: e.nom, args, ligne };
        } else if (est("++") || est("--")) e = { k: "post", op: prendre().v, e };
        else return e;
      }
    }

    function primaire() {
      const j = prendre();
      if (j.k === "num") return { k: "num", v: j.v };
      if (j.k === "str") return { k: "str", v: j.v };
      if (j.k === "id") return { k: "id", nom: j.v };
      if (j.k === "op" && j.v === "(") { const e = expression(); attendre(")"); return { k: "paren", e }; }
      throw erreur("expression attendue, trouvé « " + j.v + " »", j.ligne);
    }

    while (voir().k !== "fin") {
      const f = fonction();
      fonctions.set(f.nom, f);
    }
    if (!fonctions.size) throw erreur("aucune fonction dans le code");

    /* Profondeur d'imbrication de chaque boucle (pour la gouttière). */
    for (const b of boucles) {
      b.profondeur = boucles.filter((a) => a !== b && a.ligne <= b.ligne && b.fin <= a.fin
        && (a.ligne < b.ligne || a.id < b.id)).length;
    }
    return { fonctions, boucles };
  }

  /* ---------------- Réécriture d'une expression ---------------- */

  function ecrire(e) {
    switch (e.k) {
      case "num": return String(e.v);
      case "str": return JSON.stringify(e.v);
      case "id": return e.nom;
      case "paren": return "(" + ecrire(e.e) + ")";
      case "index": return ecrire(e.t) + "[" + ecrire(e.i) + "]";
      case "appel": return e.nom + "(" + e.args.map(ecrire).join(", ") + ")";
      case "bin": return ecrire(e.g) + " " + e.op + " " + ecrire(e.d);
      case "un": return e.op + ecrire(e.e);
      case "pre": return e.op + ecrire(e.e);
      case "post": return ecrire(e.e) + e.op;
      case "assign": return ecrire(e.g) + " " + e.op + " " + ecrire(e.d);
      case "cond": return ecrire(e.c) + " ? " + ecrire(e.a) + " : " + ecrire(e.b);
      default: return "…";
    }
  }

  const fmt = (v) => Array.isArray(v) ? "[" + v.join(", ") + "]" : v === undefined ? "?" : String(v);
  const vrai = (v) => v !== 0 && v !== undefined && v !== null;

  /* ---------------- Exécution ---------------- */

  const BREAK = { k: "break" }, CONTINUE = { k: "continue" };
  class Retour { constructor(v) { this.v = v; } }

  function executer(spec, scenario, n) {
    const prog = spec._prog || (spec._prog = analyser(spec.code));
    const nomFn = spec.appel || prog.fonctions.keys().next().value;
    const principale = prog.fonctions.get(nomFn);
    if (!principale) throw erreur("fonction « " + nomFn + " » introuvable");
    const brut = typeof scenario.entree === "function" ? scenario.entree(n) : scenario.entree || {};
    const entree = {};
    for (const [k, v] of Object.entries(brut)) entree[k] = Array.isArray(v) ? v.slice() : v;

    const pas = [];
    const compte = {};
    const tours = prog.boucles.map(() => 0);
    const pile = [];
    const sortie = [];
    let ops = 0, appels = 0, acces = [];

    const cadre = () => pile[pile.length - 1];

    function trouver(nomVar) {
      const portees = cadre().portees;
      for (let k = portees.length - 1; k >= 0; k--) if (portees[k].has(nomVar)) return portees[k];
      return null;
    }
    function lire(nomVar) {
      const p = trouver(nomVar);
      if (!p) throw erreur("variable « " + nomVar + " » non déclarée");
      return p.get(nomVar);
    }
    function ecrireVar(nomVar, v) {
      const p = trouver(nomVar);
      if (!p) throw erreur("variable « " + nomVar + " » non déclarée");
      p.set(nomVar, v);
    }
    function portee(f) {
      cadre().portees.push(new Map());
      try { f(); } finally { cadre().portees.pop(); }
    }

    /* Photographie de l'état après l'action de la ligne. */
    function noter(ligne, genre, texte, options = {}) {
      if (pas.length >= PAS_MAX) throw erreur("exécution trop longue pour être animée");
      if (options.compter !== false) compte[ligne] = (compte[ligne] || 0) + 1;
      const c = cadre();
      const vars = [], tableaux = [];
      if (c) {
        /* Ordre de déclaration ; une variable interne masque l'externe. */
        const visibles = new Map();
        for (const portee of c.portees) for (const [nomVar, v] of portee) { visibles.delete(nomVar); visibles.set(nomVar, v); }
        for (const [nomVar, v] of visibles) {
          if (Array.isArray(v)) tableaux.push({ nom: nomVar, valeurs: v.slice(), ref: v });
          else vars.push([nomVar, v]);
        }
      }
      const nomDe = (ref) => (tableaux.find((t) => t.ref === ref) || {}).nom;
      pas.push({
        ligne, genre, texte,
        resultat: options.resultat,
        ops,
        compte: Object.assign({}, compte),
        tours: tours.slice(),
        boucles: c ? c.actives.map((b) => ({ id: b.id, tour: b.tour })) : [],
        pile: pile.map((f) => f.titre),
        vars,
        tableaux: tableaux.map((t) => ({ nom: t.nom, valeurs: t.valeurs })),
        acces: acces.map((a) => ({ nom: nomDe(a.ref), i: a.i, ecriture: a.ecriture })).filter((a) => a.nom),
        sortie: sortie.slice()
      });
      acces = [];
    }

    /* Évaluation. pur = sans effet de bord ni comptage (pour l'affichage). */
    function evaluer(e, pur) {
      switch (e.k) {
        case "num": return e.v;
        case "str": return e.v;
        case "paren": return evaluer(e.e, pur);
        case "id": return lire(e.nom);
        case "index": {
          const t = evaluer(e.t, pur), i = evaluer(e.i, pur);
          if (!Array.isArray(t)) throw erreur("« " + ecrire(e.t) + " » n'est pas un tableau");
          if (!(i >= 0 && i < t.length)) throw erreur("case " + ecrire(e) + " hors du tableau (indice " + i + ")");
          if (!pur) acces.push({ ref: t, i, ecriture: false });
          return t[i];
        }
        case "bin": {
          if (!pur) ops++;
          if (e.op === "&&") return vrai(evaluer(e.g, pur)) && vrai(evaluer(e.d, pur)) ? 1 : 0;
          if (e.op === "||") return vrai(evaluer(e.g, pur)) || vrai(evaluer(e.d, pur)) ? 1 : 0;
          const a = evaluer(e.g, pur), b = evaluer(e.d, pur);
          switch (e.op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": if (b === 0) throw erreur("division par zéro"); return Math.trunc(a / b);
            case "%": if (b === 0) throw erreur("modulo par zéro"); return a % b;
            case "<": return a < b ? 1 : 0;
            case "<=": return a <= b ? 1 : 0;
            case ">": return a > b ? 1 : 0;
            case ">=": return a >= b ? 1 : 0;
            case "==": return a === b ? 1 : 0;
            case "!=": return a !== b ? 1 : 0;
          }
          throw erreur("opérateur « " + e.op + " » non pris en charge");
        }
        case "un": {
          const v = evaluer(e.e, pur);
          if (e.op === "!") { if (!pur) ops++; return vrai(v) ? 0 : 1; }
          if (e.op === "-") { if (!pur && e.e.k !== "num") ops++; return -v; }
          return v;
        }
        case "cond": {
          if (!pur) ops++;
          return vrai(evaluer(e.c, pur)) ? evaluer(e.a, pur) : evaluer(e.b, pur);
        }
        case "pre": case "post": {
          if (pur) throw erreur("effet de bord");
          ops++;
          const avant = evaluer(e.e, true);
          const apres = e.op === "++" ? avant + 1 : avant - 1;
          affecter(e.e, apres);
          return e.k === "pre" ? apres : avant;
        }
        case "assign": {
          if (pur) throw erreur("effet de bord");
          ops += e.op === "=" ? 1 : 2;
          let v = evaluer(e.d);
          if (e.op !== "=") {
            const a = evaluer(e.g, true);
            const op = e.op[0];
            if ((op === "/" || op === "%") && v === 0) throw erreur("division par zéro");
            v = op === "+" ? a + v : op === "-" ? a - v : op === "*" ? a * v : op === "/" ? Math.trunc(a / v) : a % v;
          }
          affecter(e.g, v);
          return v;
        }
        case "appel": {
          if (pur) throw erreur("appel");
          ops++;
          const args = e.args.map((a) => evaluer(a));
          if (e.nom === "printf") {
            sortie.push(printf(args));
            return 0;
          }
          const f = prog.fonctions.get(e.nom);
          if (!f) throw erreur("fonction « " + e.nom + " » inconnue", e.ligne);
          const titre = e.nom + "(" + args.map((a, k) => Array.isArray(a) ? f.params[k] ? f.params[k].nom : "t" : fmt(a)).join(", ") + ")";
          noter(e.ligne, "appel", "Appel de `" + titre + "`", { compter: false });
          const v = appeler(f, args);
          noter(e.ligne, "retour", "`" + titre + "` a renvoyé " + fmt(v), { compter: false });
          return v;
        }
      }
      throw erreur("expression non prise en charge");
    }

    function affecter(cible, v) {
      if (cible.k === "paren") return affecter(cible.e, v);
      if (cible.k === "id") return ecrireVar(cible.nom, v);
      const t = evaluer(cible.t, true), i = evaluer(cible.i, true);
      if (!Array.isArray(t)) throw erreur("« " + ecrire(cible.t) + " » n'est pas un tableau");
      if (!(i >= 0 && i < t.length)) throw erreur("case " + ecrire(cible) + " hors du tableau (indice " + i + ")");
      acces.push({ ref: t, i, ecriture: true });
      t[i] = v;
    }

    function printf(args) {
      const format = String(args[0] ?? "");
      let k = 1;
      return format.replace(/%(l?[dius]|c|%)/g, (m, f) => f === "%" ? "%" : f === "c" ? String.fromCharCode(args[k++]) : fmt(args[k++]))
        .replace(/\n$/, "");
    }

    /* Le texte d'une expression avec les valeurs courantes : « t[3] == v » → « 21 == 101 ». */
    function avecValeurs(e) {
      const essai = (x) => { try { return evaluer(x, true); } catch (err) { return undefined; } };
      switch (e.k) {
        case "num": return String(e.v);
        case "id": { const v = essai(e); return Array.isArray(v) ? e.nom : fmt(v); }
        case "index": return fmt(essai(e));
        case "paren": return "(" + avecValeurs(e.e) + ")";
        case "un": return e.op + avecValeurs(e.e);
        case "bin": {
          const g = avecValeurs(e.g);
          if (e.op === "&&" && !vrai(essai(e.g))) return g + " && …";
          if (e.op === "||" && vrai(essai(e.g))) return g + " || …";
          return g + " " + e.op + " " + avecValeurs(e.d);
        }
        default: return ecrire(e);
      }
    }

    function decrire(e, v) {
      const cible = e.k === "assign" ? e.g : e.k === "pre" || e.k === "post" ? e.e : null;
      if (cible) {
        const apres = (() => { try { return fmt(evaluer(cible, true)); } catch (err) { return fmt(v); } })();
        const nomCible = cible.k === "index" ? ecrire(cible.t) + "[" + fmt((() => { try { return evaluer(cible.i, true); } catch (err) { return "?"; } })()) + "]" : ecrire(cible);
        return "`" + ecrire(e) + "` → `" + nomCible + "` vaut " + apres;
      }
      if (e.k === "appel" && e.nom === "printf") return "`printf` affiche « " + sortie[sortie.length - 1] + " »";
      return "`" + ecrire(e) + "`";
    }

    function declarer(s, genre) {
      const textes = [];
      for (const d of s.decls) {
        ops++;
        let v = 0;
        if (d.taille) v = new Array(Math.max(0, evaluer(d.taille))).fill(0);
        if (d.init) {
          ops++;
          v = d.init.k === "liste" ? d.init.valeurs.map((x) => evaluer(x)) : evaluer(d.init);
          if (Array.isArray(v) && d.taille) v = v.concat(new Array(Math.max(0, evaluer(d.taille, true) - v.length)).fill(0));
        }
        cadre().portees[cadre().portees.length - 1].set(d.nom, v);
        textes.push("`" + d.nom + "` vaut " + fmt(v));
      }
      noter(s.ligne, genre || "instr", (genre === "init" ? "Début de la boucle : " : "Déclaration : ") + textes.join(", "), { compter: genre !== "init" });
    }

    function nomBoucle(b) {
      return (spec.boucles && spec.boucles[b.ligne]) || (b.variable ? "boucle sur " + b.variable : "boucle " + b.k);
    }

    /* Test d'une boucle ; nouveauTour = le test ouvre le tour suivant
       (for, while), faux pour do … while où le tour est déjà compté. */
    function test(b, actif, nouveauTour = true) {
      const avant = avecValeurs(b.cond);
      const c = vrai(evaluer(b.cond));
      if (c && nouveauTour) { actif.tour++; tours[b.id]++; }
      noter(b.ligneTest || b.ligne, "test",
        "Test `" + ecrire(b.cond) + "` : " + avant + " → " + (c ? (nouveauTour ? "**vrai**, tour " + actif.tour + " de la " + nomBoucle(b) : "**vrai**, la " + nomBoucle(b) + " recommence")
          : "**faux**, sortie de la " + nomBoucle(b) + (actif.tour ? " après " + actif.tour + " tour" + (actif.tour > 1 ? "s" : "") : " sans aucun tour")),
        { resultat: c });
      return c;
    }

    function corpsDeBoucle(b) {
      try { executerInstr(b.corps); }
      catch (x) { if (x === BREAK) return false; if (x !== CONTINUE) throw x; }
      return true;
    }

    function executerInstr(s) {
      switch (s.k) {
        case "vide": return;
        case "bloc": portee(() => { for (const i of s.corps) executerInstr(i); }); return;
        case "decl": declarer(s); return;
        case "expr": {
          const v = evaluer(s.e);
          noter(s.ligne, "instr", decrire(s.e, v));
          return;
        }
        case "if": {
          const avant = avecValeurs(s.cond);
          const c = vrai(evaluer(s.cond));
          noter(s.ligne, "test", "Test `" + ecrire(s.cond) + "` : " + avant + " → "
            + (c ? "**vrai**, on entre dans le bloc" : s.sinon ? "**faux**, on passe au `else`" : "**faux**, on saute le bloc"), { resultat: c });
          if (c) executerInstr(s.alors);
          else if (s.sinon) executerInstr(s.sinon);
          return;
        }
        case "while": case "do": case "for": {
          const actif = { id: s.id, tour: 0 };
          const lancer = () => {
            cadre().actives.push(actif);
            try {
              if (s.k === "do") {
                for (;;) {
                  actif.tour++; tours[s.id]++;
                  if (!corpsDeBoucle(s) || !test(s, actif, false)) return;
                }
              }
              for (;;) {
                if (s.cond && !test(s, actif)) return;
                if (!s.cond) { actif.tour++; tours[s.id]++; }
                if (!corpsDeBoucle(s)) return;
                if (s.pas) {
                  const v = evaluer(s.pas);
                  noter(s.ligne, "incr", "Fin du tour : " + decrire(s.pas, v), { compter: false });
                }
              }
            } finally { cadre().actives.pop(); }
          };
          if (s.k === "for") portee(() => {
            if (s.init) {
              if (s.init.k === "decl") declarer(s.init, "init");
              else { const v = evaluer(s.init.e); noter(s.ligne, "init", "Début de la boucle : " + decrire(s.init.e, v), { compter: false }); }
            }
            lancer();
          });
          else lancer();
          return;
        }
        case "return": {
          const v = s.e ? evaluer(s.e) : undefined;
          ops++;
          const boucle = cadre().actives.length;
          noter(s.ligne, "fin-appel", (s.e ? "`return " + ecrire(s.e) + "` : la fonction renvoie " + fmt(v) : "`return` : fin de la fonction")
            + (boucle ? " — **sortie anticipée**, la boucle s'arrête avant la fin" : ""), { resultat: boucle ? "sortie" : undefined });
          throw new Retour(v);
        }
        case "break": noter(s.ligne, "instr", "`break` : sortie de la boucle"); throw BREAK;
        case "continue": noter(s.ligne, "instr", "`continue` : tour suivant"); throw CONTINUE;
      }
      throw erreur("instruction non prise en charge", s.ligne);
    }

    function appeler(f, args) {
      if (++appels > APPELS_MAX) throw erreur("trop d'appels pour être animés");
      if (pile.length >= 120) throw erreur("trop d'appels imbriqués");
      if (args.length !== f.params.length) throw erreur("« " + f.nom + " » attend " + f.params.length + " argument(s)");
      const portee0 = new Map();
      f.params.forEach((prm, k) => portee0.set(prm.nom, args[k]));
      const titre = f.nom + "(" + args.map((a, k) => Array.isArray(a) ? f.params[k].nom : fmt(a)).join(", ") + ")";
      pile.push({ titre, portees: [portee0], actives: [] });
      noter(f.ligne, "entree", "Entrée dans `" + titre + "`", { compter: false });
      let v;
      try { executerInstr(f.corps); }
      catch (x) { if (x instanceof Retour) v = x.v; else throw x; }
      finally { pile.pop(); }
      return v;
    }

    const args = principale.params.map((prm) => {
      if (!(prm.nom in entree)) throw erreur("entrée « " + prm.nom + " » manquante pour " + principale.nom);
      return entree[prm.nom];
    });
    const v = appeler(principale, args);
    pas.push(Object.assign({}, pas[pas.length - 1], {
      ligne: principale.corps.fin, genre: "fin", resultat: undefined, acces: [], boucles: [], pile: [],
      texte: "Fin de l'exécution" + (v !== undefined ? " : `" + principale.nom + "` renvoie " + fmt(v) : ""),
      renvoie: v, appels
    }));
    return pas;
  }

  /* Bilan d'une exécution : ce que l'outil de vérification contrôle. */
  function bilan(spec, scenario, n) {
    const pas = executer(spec, scenario, n);
    const fin = pas[pas.length - 1];
    return { compte: fin.compte, ops: fin.ops, tours: fin.tours, renvoie: fin.renvoie, appels: fin.appels, etapes: pas.length };
  }

  /* Contrôles pour outils/verifier-exercices.js : renvoie la liste des problèmes. */
  function verifier(spec) {
    const problemes = [];
    let prog;
    try { prog = spec._prog || (spec._prog = analyser(spec.code)); }
    catch (e) { return ["code illisible — " + e.message]; }
    const nbLignes = String(spec.code).split("\n").length;
    const scenarios = spec.scenarios || [];
    if (!scenarios.length) problemes.push("aucun scénario");
    const mesures = [].concat(spec.mesure || []);
    for (const m of mesures) if (!(m.ligne >= 1 && m.ligne <= nbLignes)) problemes.push("ligne mesurée " + m.ligne + " hors du code");
    const valeursN = spec.n ? Array.from({ length: spec.n.max - spec.n.min + 1 }, (_, k) => spec.n.min + k) : [null];
    if (spec.n && !(spec.n.min <= (spec.n.depart ?? spec.n.max) && (spec.n.depart ?? spec.n.max) <= spec.n.max)) problemes.push("valeur de départ de n hors de la plage");
    for (const sc of scenarios) {
      for (const n of valeursN) {
        const ou = "scénario « " + sc.nom + " »" + (n !== null ? ", n = " + n : "");
        let b;
        try { b = bilan(spec, sc, n); }
        catch (e) { problemes.push(ou + " — " + e.message); continue; }
        const attendu = typeof sc.attendu === "function" ? sc.attendu(n) : sc.attendu;
        for (const [cle, val] of Object.entries(attendu || {})) {
          const obtenu = cle === "ops" ? b.ops : cle === "renvoie" ? b.renvoie : cle === "appels" ? b.appels : b.compte[cle] || 0;
          if (obtenu !== val) problemes.push(ou + " : « " + cle + " » vaut " + obtenu + ", attendu " + val);
        }
      }
    }
    return problemes;
  }

  /* =========================================================
     LECTEUR (navigateur)
     ========================================================= */

  const COULEURS = 4;
  const VITESSES = [1400, 900, 550, 260, 90];

  function monter(spec) {
    const prog = spec._prog || (spec._prog = analyser(spec.code));
    const scenarios = spec.scenarios && spec.scenarios.length ? spec.scenarios : [{ nom: "Exécution", entree: spec.entree }];
    const plage = spec.n || null;
    const mesures = [].concat(spec.mesure || []);
    const sources = String(spec.code).replace(/\r\n?/g, "\n").split("\n");
    const st = { s: 0, n: plage ? plage.depart ?? plage.max : null, k: 0, pas: [], minuteur: null, vitesse: 2 };
    const cache = new Map();
    const executions = (s, n) => {
      const cle = s + "|" + n;
      if (!cache.has(cle)) cache.set(cle, executer(spec, scenarios[s], n));
      return cache.get(cle);
    };

    const racine = el("div", { class: "tr" });
    const onglets = el("div", { class: "tr-scenarios" });
    const reglageN = el("div", { class: "tr-n" });
    const descr = el("div", { class: "tr-descr" });
    const codeBoite = el("div", { class: "tr-code" });
    const cote = el("div", { class: "tr-cote" });
    const expl = el("div", { class: "tr-expl" });
    const commandes = el("div", { class: "tr-commandes" });
    const bilanBoite = el("div", { class: "tr-bilan" });

    /* Code : numéros, gouttière des boucles, source colorée, compteur. */
    const largeurGouttiere = Math.max(0, ...prog.boucles.map((b) => b.profondeur + 1));
    const lignesDom = sources.map((src, k) => {
      const n = k + 1;
      const gouttiere = el("span", { class: "tr-gouttiere" });
      for (let d = 0; d < largeurGouttiere; d++) {
        const b = prog.boucles.find((x) => x.profondeur === d && x.ligne <= n && n <= x.fin);
        gouttiere.append(el("span", {
          class: "tr-barre" + (b ? " tr-b" + (b.id % COULEURS) + (b.ligne === n ? " tete" : "") + (b.fin === n ? " pied" : "") : ""),
          "data-b": b ? String(b.id) : null
        }));
      }
      const ligne = el("div", { class: "tr-ligne" + (mesures.some((m) => m.ligne === n) ? " mesuree" : "") },
        el("span", { class: "tr-num", texte: String(n) }),
        gouttiere,
        el("code", { class: "tr-src", html: colorerC(src) || " " }),
        el("span", { class: "tr-compte" }));
      codeBoite.append(ligne);
      return ligne;
    });

    const fleche = (txt, titre, f) => el("button", { class: "btn btn-fantome btn-petit tr-btn", type: "button", title: titre, onclick: f }, txt);
    const bLecture = el("button", { class: "btn btn-principal btn-petit tr-lecture", type: "button", onclick: () => basculer() }, "▶ Lecture");
    const compteur = el("span", { class: "tr-etape" });
    const vitesse = el("input", { type: "range", min: "0", max: String(VITESSES.length - 1), value: String(st.vitesse), class: "tr-vitesse", "aria-label": "Vitesse" });
    vitesse.addEventListener("input", () => { st.vitesse = Number(vitesse.value); if (st.minuteur) { arreter(); jouer(); } });
    commandes.append(
      fleche("⏮", "Début", () => { arreter(); aller(0); }),
      fleche("◀", "Étape précédente", () => { arreter(); aller(st.k - 1); }),
      bLecture,
      fleche("▶", "Étape suivante", () => { arreter(); aller(st.k + 1); }),
      fleche("⏭", "Fin", () => { arreter(); aller(st.pas.length - 1); }),
      compteur,
      el("span", { class: "espace" }),
      el("label", { class: "tr-vitesse-cadre" }, el("span", { texte: "Vitesse" }), vitesse)
    );

    function arreter() {
      if (st.minuteur) clearInterval(st.minuteur);
      st.minuteur = null;
      bLecture.textContent = "▶ Lecture";
    }
    function jouer() {
      if (st.k >= st.pas.length - 1) aller(0);
      bLecture.textContent = "⏸ Pause";
      st.minuteur = setInterval(() => {
        if (!racine.isConnected) { arreter(); return; }
        if (st.k >= st.pas.length - 1) { arreter(); return; }
        aller(st.k + 1);
      }, VITESSES[st.vitesse]);
    }
    function basculer() { if (st.minuteur) arreter(); else jouer(); }

    function charger() {
      arreter();
      try { st.pas = executions(st.s, st.n); }
      catch (e) { st.pas = []; vider(expl).append(el("b", { texte: "Erreur : " + e.message })); return; }
      vider(onglets);
      if (scenarios.length > 1) scenarios.forEach((sc, k) => onglets.append(el("button", {
        class: "tr-scenario" + (k === st.s ? " actif" : ""), type: "button",
        onclick: () => { st.s = k; charger(); }
      }, sc.nom)));
      vider(reglageN);
      if (plage) {
        reglageN.append(
          el("span", { class: "tr-n-lib", texte: "n =" }),
          el("button", { class: "btn btn-fantome btn-petit", type: "button", disabled: st.n <= plage.min, onclick: () => { st.n--; charger(); } }, "−"),
          el("b", { class: "tr-n-val", texte: String(st.n) }),
          el("button", { class: "btn btn-fantome btn-petit", type: "button", disabled: st.n >= plage.max, onclick: () => { st.n++; charger(); } }, "+"));
      }
      const sc = scenarios[st.s];
      vider(descr);
      if (sc.texte) descr.append(el("span", { html: texteRiche(sc.texte) }));
      const brut = typeof sc.entree === "function" ? sc.entree(st.n) : sc.entree || {};
      const entrees = Object.entries(brut).map(([k, v]) => k + " = " + fmt(v));
      if (entrees.length) descr.append(el("code", { class: "tr-entree", texte: entrees.join("   ") }));
      rendreBilan();
      aller(0);
    }

    function aller(k) {
      if (!st.pas.length) return;
      st.k = Math.max(0, Math.min(st.pas.length - 1, k));
      const p = st.pas[st.k];
      const actives = new Set(p.boucles.map((b) => b.id));
      lignesDom.forEach((ligne, i) => {
        const n = i + 1;
        const ici = n === p.ligne;
        ligne.className = "tr-ligne"
          + (mesures.some((m) => m.ligne === n) ? " mesuree" : "")
          + (ici ? " actuelle tr-g-" + p.genre + (p.resultat === true ? " vrai" : p.resultat === false ? " faux" : p.resultat === "sortie" ? " sortie" : "") : "");
        const c = p.compte[n];
        ligne.lastChild.textContent = c ? "×" + c : "";
        for (const barre of ligne.querySelectorAll(".tr-barre[data-b]")) barre.classList.toggle("active", actives.has(Number(barre.getAttribute("data-b"))));
      });
      const actuelle = lignesDom[p.ligne - 1];
      if (actuelle && codeBoite.scrollHeight > codeBoite.clientHeight) {
        const haut = actuelle.offsetTop - codeBoite.offsetTop;
        if (haut < codeBoite.scrollTop || haut > codeBoite.scrollTop + codeBoite.clientHeight - 30) codeBoite.scrollTop = haut - 40;
      }
      vider(expl).append(
        el("span", { class: "tr-icone tr-g-" + p.genre + (p.resultat === true ? " vrai" : p.resultat === false ? " faux" : ""), texte: icone(p) }),
        el("span", { html: texteRiche(p.texte) }));
      compteur.textContent = "Étape " + (st.k + 1) + " / " + st.pas.length;
      rendreCote(p);
    }

    const icone = (p) => p.genre === "test" ? (p.resultat ? "✓" : "✕")
      : p.genre === "fin-appel" || p.genre === "fin" ? "⏎" : p.genre === "appel" ? "↘" : p.genre === "retour" ? "↗"
        : p.genre === "incr" ? "↻" : p.genre === "entree" ? "→" : "•";

    function rendreCote(p) {
      vider(cote);
      /* Boucles : couleur de la gouttière, tour en cours, tours cumulés. */
      if (prog.boucles.length) {
        const bloc = el("div", { class: "tr-bloc" }, el("h5", { texte: "Boucles" }));
        for (const b of prog.boucles) {
          const active = p.boucles.find((x) => x.id === b.id);
          bloc.append(el("div", { class: "tr-boucle tr-b" + (b.id % COULEURS) + (active ? " active" : "") },
            el("span", { class: "tr-pastille" }),
            el("span", { class: "tr-boucle-nom", texte: (spec.boucles && spec.boucles[b.ligne]) || (b.variable ? "boucle sur " + b.variable : "boucle " + b.k) }),
            el("span", { class: "tr-boucle-tour", texte: active ? "tour " + active.tour : "—" }),
            el("span", { class: "tr-boucle-total", texte: "total " + p.tours[b.id] })));
        }
        cote.append(bloc);
      }
      if (p.vars.length) {
        cote.append(el("div", { class: "tr-bloc" }, el("h5", { texte: "Variables" }),
          el("div", { class: "tr-vars" }, ...p.vars.map(([nomVar, v]) => el("span", { class: "tr-var" }, el("b", { texte: nomVar }), " = " + fmt(v))))));
      }
      for (const t of p.tableaux) {
        if (spec.tableau && [].concat(spec.tableau).indexOf(t.nom) < 0) continue;
        const pointeurs = {};
        for (const nomVar of [].concat(spec.pointeurs || [])) {
          const v = (p.vars.find(([x]) => x === nomVar) || [])[1];
          if (Number.isInteger(v) && v >= 0 && v < t.valeurs.length) (pointeurs[v] = pointeurs[v] || []).push(nomVar);
        }
        const rangee = el("div", { class: "tr-tableau" });
        t.valeurs.forEach((v, i) => {
          const a = p.acces.filter((x) => x.nom === t.nom && x.i === i);
          rangee.append(el("div", { class: "tr-case" + (a.some((x) => x.ecriture) ? " ecrite" : a.length ? " lue" : "") },
            el("span", { class: "tr-case-i", texte: String(i) }),
            el("span", { class: "tr-case-v", texte: fmt(v) }),
            el("span", { class: "tr-case-p", texte: (pointeurs[i] || []).join(" ") })));
        });
        cote.append(el("div", { class: "tr-bloc" }, el("h5", { texte: "Tableau " + t.nom }), rangee));
      }
      if (p.pile.length > 1) {
        cote.append(el("div", { class: "tr-bloc" }, el("h5", { texte: "Pile d'appels" }),
          el("ol", { class: "tr-pile" }, ...p.pile.slice().reverse().map((f, k) => el("li", { class: k === 0 ? "haut" : "" }, el("code", { texte: f }))))));
      }
      if (spec.operations) {
        cote.append(el("div", { class: "tr-bloc tr-ops" }, el("h5", { texte: "Opérations élémentaires" }), el("b", { texte: String(p.ops) })));
      }
      if (p.sortie.length) {
        cote.append(el("div", { class: "tr-bloc" }, el("h5", { texte: "Affichage" }),
          el("pre", { class: "tr-sortie", texte: p.sortie.slice(-6).join("\n") })));
      }
    }

    /* Bilan : ligne mesurée dans chaque scénario, puis selon n. */
    function rendreBilan() {
      vider(bilanBoite);
      const colonnes = mesures.map((m) => ({ nom: m.nom || "exécutions de la ligne " + m.ligne, val: (pas) => pas[pas.length - 1].compte[m.ligne] || 0 }));
      if (spec.operations) colonnes.push({ nom: "opérations élémentaires", val: (pas) => pas[pas.length - 1].ops });
      if (!colonnes.length) return;
      for (const col of colonnes) {
        const valeurs = scenarios.map((_, s) => { try { return col.val(executions(s, st.n)); } catch (e) { return 0; } });
        const max = Math.max(1, ...valeurs);
        const bloc = el("div", { class: "tr-bilan-bloc" }, el("h5", { texte: "Nombre de " + col.nom + (plage ? " pour n = " + st.n : "") }));
        if (scenarios.length === 1) bloc.append(el("b", { class: "tr-bilan-valeur", texte: String(valeurs[0]) }));
        else valeurs.forEach((v, s) => bloc.append(el("div", { class: "tr-barre-bilan" + (s === st.s ? " actif" : "") },
          el("span", { class: "tr-bb-nom", texte: scenarios[s].nom }),
          el("span", { class: "tr-bb-piste" }, el("span", { class: "tr-bb-plein", style: { width: (100 * v / max).toFixed(1) + "%" } })),
          el("b", { class: "tr-bb-val", texte: String(v) }))));
        if (plage) {
          const ns = [];
          for (let n = plage.min; n <= plage.max; n++) ns.push(n);
          const table = el("table", { class: "tr-table" },
            el("tr", {}, el("th", { texte: "n" }), ...ns.map((n) => el("th", { class: n === st.n ? "actif" : "", texte: String(n) }))));
          scenarios.forEach((sc, s) => table.append(el("tr", { class: s === st.s ? "actif" : "" },
            el("th", { texte: scenarios.length === 1 ? col.nom : sc.nom }),
            ...ns.map((n) => { let v; try { v = col.val(executions(s, n)); } catch (e) { v = "—"; } return el("td", { class: n === st.n ? "actif" : "", texte: String(v) }); }))));
          bloc.append(el("div", { class: "tr-table-cadre" }, table));
        }
        bilanBoite.append(bloc);
      }
    }

    if (spec.titre) racine.append(el("div", { class: "tr-titre", html: texteRiche(spec.titre) }));
    racine.append(
      el("div", { class: "tr-tete" }, onglets, el("span", { class: "espace" }), reglageN),
      descr,
      el("div", { class: "tr-corps" }, el("div", { class: "tr-gauche" }, codeBoite, expl, commandes), cote),
      bilanBoite
    );
    charger();
    return racine;
  }

  return { analyser, executer, bilan, verifier, monter, ecrire };
})();

/* Export pour le vérificateur Node (aucun accès au DOM au chargement). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = Trace;
}
