/* =============================================================
   Interpréteur de C — sous-ensemble utile aux exercices
   -------------------------------------------------------------
   Exécute dans le navigateur un programme C simple, avec la même
   arithmétique qu'en x86-64 (int 4 octets, long 8 octets, calculs
   qui débordent, conversions signé / non signé).

   Pris en charge :
     - char short int long, signed / unsigned, const, static
     - tableaux à une dimension, struct (alignement x86-64), sizeof
     - if else, while, do while, for, break, continue, goto, étiquettes
     - tous les opérateurs entiers, conversions (int) (unsigned) …
     - printf("%d %u %ld %lu %x %c %s\n", …)
     - instructions au niveau global (exécutées dans l'ordre),
       puis le corps de main s'il existe
   Non pris en charge : pointeurs, appels de fonctions, flottants.

   Utilisation :
     const prog = MiniC.analyser(source);         // lève une erreur { ligne }
     const m = MiniC.machine(prog);
     m.poser("n", 5);
     m.executer();
     m.lireCle("fact"); m.lireCle("t[2]"); m.lireCle("s.x");
   ============================================================= */

(function (racine) {
  "use strict";

  const PAS_MAX = 1000000;

  function erreur(message, ligne) {
    const e = new Error(message);
    e.ligne = ligne || null;
    e.erreurCode = true;
    return e;
  }

  /* ---------------- Types ---------------- */

  const entier = (taille, signe, nom) => ({ kind: "int", taille, signe, nom, align: taille });
  const CHAR = entier(1, true, "char"), UCHAR = entier(1, false, "unsigned char");
  const SHORT = entier(2, true, "short"), USHORT = entier(2, false, "unsigned short");
  const INT = entier(4, true, "int"), UINT = entier(4, false, "unsigned int");
  const LONG = entier(8, true, "long"), ULONG = entier(8, false, "unsigned long");
  const VOID = { kind: "void", nom: "void", taille: 0, align: 1 };

  const normaliser = (v, type) => type.signe ? BigInt.asIntN(8 * type.taille, v) : BigInt.asUintN(8 * type.taille, v);
  const promouvoir = (type) => (type.taille < 4 ? INT : type);

  function typeCommun(a, b) {
    a = promouvoir(a);
    b = promouvoir(b);
    if (a.taille === 8 || b.taille === 8) {
      return (a.taille === 8 && !a.signe) || (b.taille === 8 && !b.signe) ? ULONG : LONG;
    }
    return !a.signe || !b.signe ? UINT : INT;
  }

  function tableau(elem, n) {
    return { kind: "array", elem, n, taille: elem.taille * n, align: elem.align, nom: elem.nom + "[" + n + "]" };
  }

  /* ---------------- Analyse lexicale ---------------- */

  const MOTS_CLES = new Set([
    "char", "short", "int", "long", "signed", "unsigned", "void", "struct", "const", "static",
    "if", "else", "while", "for", "do", "break", "continue", "return", "goto", "sizeof",
    "switch", "case", "default", "float", "double", "typedef", "enum", "union"
  ]);
  const OPERATEURS = [
    "<<=", ">>=", "...", "->", "++", "--", "<<", ">>", "<=", ">=", "==", "!=", "&&", "||",
    "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=",
    "+", "-", "*", "/", "%", "<", ">", "=", "!", "~", "&", "|", "^", "?", ":", ";", ",", ".",
    "(", ")", "[", "]", "{", "}"
  ];
  const ECHAPPEMENTS = { n: 10, t: 9, r: 13, 0: 0, "\\": 92, "'": 39, '"': 34, a: 7, b: 8, f: 12, v: 11 };

  function lexer(source) {
    const texte = String(source ?? "").replace(/\r\n?/g, "\n");
    const jetons = [];
    let i = 0, ligne = 1;

    while (i < texte.length) {
      const c = texte[i];
      if (c === "\n") { ligne++; i++; continue; }
      if (/\s/.test(c)) { i++; continue; }
      if (c === "#" && /^\s*$/.test(texte.slice(texte.lastIndexOf("\n", i - 1) + 1, i))) {
        while (i < texte.length && texte[i] !== "\n") i++;
        continue;
      }
      if (texte.startsWith("//", i)) {
        while (i < texte.length && texte[i] !== "\n") i++;
        continue;
      }
      if (texte.startsWith("/*", i)) {
        const fin = texte.indexOf("*/", i + 2);
        if (fin < 0) throw erreur("Commentaire /* non refermé", ligne);
        for (let k = i; k < fin; k++) if (texte[k] === "\n") ligne++;
        i = fin + 2;
        continue;
      }
      const reste = texte.slice(i);
      let m;
      if ((m = /^(0x[0-9a-f]+|\d+)([ul]*)/i.exec(reste))) {
        if (/^[A-Za-z_]/.test(reste.slice(m[0].length))) throw erreur("Nombre invalide : " + reste.split(/[^\w]/)[0], ligne);
        const brut = m[1].toLowerCase();
        const v = brut.length > 1 && brut[0] === "0" && /^\d+$/.test(brut) ? BigInt("0o" + brut.slice(1)) : BigInt(brut);
        jetons.push({ k: "num", v, suffixe: m[2].toLowerCase(), hexa: brut.startsWith("0x") || brut.length > 1 && brut[0] === "0", ligne });
        i += m[0].length;
        continue;
      }
      if ((m = /^[A-Za-z_]\w*/.exec(reste))) {
        jetons.push({ k: MOTS_CLES.has(m[0]) ? "kw" : "id", v: m[0], ligne });
        i += m[0].length;
        continue;
      }
      if (c === "'") {
        let code, lg;
        if (texte[i + 1] === "\\") {
          if (!(texte[i + 2] in ECHAPPEMENTS)) throw erreur("Échappement inconnu : \\" + texte[i + 2], ligne);
          code = ECHAPPEMENTS[texte[i + 2]];
          lg = 3;
        } else {
          code = texte.charCodeAt(i + 1);
          lg = 2;
        }
        if (texte[i + lg] !== "'") throw erreur("Caractère mal formé : il manque l'apostrophe fermante", ligne);
        jetons.push({ k: "char", v: BigInt(code), ligne });
        i += lg + 1;
        continue;
      }
      if (c === '"') {
        let j = i + 1, s = "";
        while (j < texte.length && texte[j] !== '"') {
          if (texte[j] === "\n") throw erreur("Chaîne non refermée", ligne);
          if (texte[j] === "\\") {
            if (!(texte[j + 1] in ECHAPPEMENTS)) throw erreur("Échappement inconnu : \\" + texte[j + 1], ligne);
            s += String.fromCharCode(ECHAPPEMENTS[texte[j + 1]]);
            j += 2;
          } else {
            s += texte[j++];
          }
        }
        if (j >= texte.length) throw erreur("Chaîne non refermée", ligne);
        jetons.push({ k: "str", v: s, ligne });
        i = j + 1;
        continue;
      }
      const op = OPERATEURS.find((o) => texte.startsWith(o, i));
      if (!op) throw erreur("Caractère inattendu : « " + c + " »", ligne);
      jetons.push({ k: "op", v: op, ligne });
      i += op.length;
    }
    jetons.push({ k: "fin", v: "fin du programme", ligne });
    return jetons;
  }

  /* =============================================================
     ANALYSE SYNTAXIQUE
     ============================================================= */

  function analyser(source) {
    const jetons = lexer(source);
    const structs = new Map();
    let p = 0;

    const voir = (dec = 0) => jetons[Math.min(p + dec, jetons.length - 1)];
    const est = (v, dec = 0) => { const j = voir(dec); return (j.k === "op" || j.k === "kw") && j.v === v; };
    const prendre = () => jetons[p++];
    const decrire = (j) => j.k === "fin" ? "la fin du programme" : "« " + j.v + " »";
    function attendre(v, contexte) {
      if (!est(v)) {
        const j = voir();
        const avant = jetons[p - 1];
        const ligne = v === ";" && avant ? avant.ligne : j.ligne;
        throw erreur("« " + v + " » attendu" + (contexte ? " " + contexte : "") + " avant " + decrire(j), ligne);
      }
      return prendre();
    }
    function identifiant(contexte) {
      const j = voir();
      if (j.k !== "id") throw erreur("Nom attendu " + contexte + ", trouvé " + decrire(j), j.ligne);
      return prendre().v;
    }

    /* ---- Types ---- */

    const SPECIFICATEURS = new Set(["char", "short", "int", "long", "signed", "unsigned", "void", "struct", "const", "static"]);
    const debutType = (dec = 0) => voir(dec).k === "kw" && SPECIFICATEURS.has(voir(dec).v);

    function specificateurs() {
      const ligne = voir().ligne;
      let signe = null, base = null, longs = 0, courts = 0;
      while (debutType()) {
        const mot = prendre().v;
        if (mot === "const" || mot === "static") continue;
        if (mot === "signed" || mot === "unsigned") {
          if (signe !== null) throw erreur("« " + mot + " » en double", ligne);
          signe = mot === "signed";
        } else if (mot === "long") longs++;
        else if (mot === "short") courts++;
        else if (mot === "struct") {
          if (base) throw erreur("Type invalide", ligne);
          base = structure();
        } else {
          if (base) throw erreur("Type invalide : « " + (base.nom || base) + " " + mot + " »", ligne);
          base = mot;
        }
      }
      if (base && typeof base === "object") {
        if (signe !== null || longs || courts) throw erreur("Type invalide pour une structure", ligne);
        return base;
      }
      if (base === "void") return VOID;
      if (base === "char") return signe === false ? UCHAR : CHAR;
      if (base && base !== "int") throw erreur("Type non pris en charge : " + base, ligne);
      if (courts) return signe === false ? USHORT : SHORT;
      if (longs) return signe === false ? ULONG : LONG;
      return signe === false ? UINT : INT;
    }

    function structure() {
      const ligne = voir().ligne;
      const nom = identifiant("après struct");
      if (!est("{")) {
        if (!structs.has(nom)) throw erreur("Structure inconnue : struct " + nom, ligne);
        return structs.get(nom);
      }
      if (structs.has(nom)) throw erreur("struct " + nom + " définie deux fois", ligne);
      prendre();
      const type = { kind: "struct", nom: "struct " + nom, champs: new Map(), ordre: [], taille: 0, align: 1 };
      let decal = 0;
      while (!est("}")) {
        const base = specificateurs();
        do {
          const d = declarateur(base);
          if (type.champs.has(d.nom)) throw erreur("Champ « " + d.nom + " » en double", d.ligne);
          if (d.type.kind === "array" && d.type.n === null) throw erreur("Taille de tableau manquante pour « " + d.nom + " »", d.ligne);
          decal = Math.ceil(decal / d.type.align) * d.type.align;
          type.champs.set(d.nom, { type: d.type, decal });
          type.ordre.push(d.nom);
          decal += d.type.taille;
          type.align = Math.max(type.align, d.type.align);
        } while (est(",") && prendre());
        attendre(";", "après le champ");
      }
      prendre();
      type.taille = Math.ceil(decal / type.align) * type.align;
      structs.set(nom, type);
      return type;
    }

    function declarateur(base) {
      if (est("*")) throw erreur("Les pointeurs ne sont pas pris en charge dans ces exercices", voir().ligne);
      const ligne = voir().ligne;
      const nom = identifiant("de variable");
      let type = base;
      if (est("[")) {
        prendre();
        let n = null;
        if (!est("]")) {
          const e = expression();
          n = Number(constante(e));
          if (!(n > 0)) throw erreur("Taille de tableau invalide", ligne);
        }
        attendre("]");
        if (est("[")) throw erreur("Les tableaux à plusieurs dimensions ne sont pas pris en charge", ligne);
        type = { kind: "array", elem: base, n, taille: n === null ? 0 : base.taille * n, align: base.align, nom: base.nom + "[" + (n ?? "") + "]" };
      }
      if (type.kind === "void") throw erreur("Variable « " + nom + " » de type void", ligne);
      return { nom, type, ligne };
    }

    function constante(e) {
      if (e.k === "num") return e.v;
      if (e.k === "sizeof" && e.type) return BigInt(e.type.taille);
      if (e.k === "bin" && ["+", "-", "*"].includes(e.op)) {
        const a = constante(e.g), b = constante(e.d);
        return e.op === "+" ? a + b : e.op === "-" ? a - b : a * b;
      }
      throw erreur("La taille d'un tableau doit être une constante", e.ligne);
    }

    /* ---- Déclarations ---- */

    function declaration(base, ligne) {
      const decls = [];
      if (est(";")) {
        prendre();
        return { k: "decl", decls, ligne };
      }
      do {
        const d = declarateur(base);
        if (est("=")) {
          prendre();
          d.init = est("{") ? listeInit() : assignation();
        }
        if (d.type.kind === "array" && d.type.n === null) {
          const n = d.init && d.init.k === "liste" ? d.init.elements.length
            : d.init && d.init.k === "str" ? d.init.v.length + 1 : null;
          if (!n) throw erreur("Taille de tableau manquante pour « " + d.nom + " »", d.ligne);
          d.type = tableau(d.type.elem, n);
        }
        decls.push(d);
      } while (est(",") && prendre());
      attendre(";", "après la déclaration");
      return { k: "decl", decls, ligne };
    }

    function listeInit() {
      const ligne = attendre("{").ligne;
      const elements = [];
      while (!est("}")) {
        elements.push(est("{") ? listeInit() : assignation());
        if (!est(",")) break;
        prendre();
      }
      attendre("}", "à la fin de la liste");
      return { k: "liste", elements, ligne };
    }

    /* ---- Instructions ---- */

    function instruction() {
      const j = voir();
      const ligne = j.ligne;

      if (j.k === "id" && est(":", 1)) {
        prendre(); prendre();
        return { k: "etiquette", nom: j.v, ligne };
      }
      if (debutType()) return declaration(specificateurs(), ligne);

      if (j.k === "op" && j.v === "{") {
        prendre();
        const corps = [];
        while (!est("}")) {
          if (voir().k === "fin") throw erreur("« } » manquante pour fermer le bloc", ligne);
          corps.push(instruction());
        }
        prendre();
        return { k: "bloc", corps, ligne };
      }
      if (j.k === "op" && j.v === ";") { prendre(); return { k: "vide", ligne }; }

      if (j.k === "kw") {
        switch (j.v) {
          case "if": {
            prendre(); attendre("(", "après if");
            const cond = expression(); attendre(")", "après la condition");
            const alors = instructionImbriquee();
            let sinon = null;
            if (est("else")) { prendre(); sinon = instructionImbriquee(); }
            return { k: "if", cond, alors, sinon, ligne };
          }
          case "while": {
            prendre(); attendre("(", "après while");
            const cond = expression(); attendre(")", "après la condition");
            return { k: "while", cond, corps: instructionImbriquee(), ligne };
          }
          case "do": {
            prendre();
            const corps = instructionImbriquee();
            if (!est("while")) throw erreur("« while » attendu après le corps du do", voir().ligne);
            prendre(); attendre("(");
            const cond = expression(); attendre(")"); attendre(";", "après do … while");
            return { k: "do", corps, cond, ligne };
          }
          case "for": {
            prendre(); attendre("(", "après for");
            let init = null;
            if (debutType()) init = declaration(specificateurs(), ligne);
            else { if (!est(";")) init = { k: "expr", e: expression(), ligne }; attendre(";", "dans le for"); }
            const cond = est(";") ? null : expression();
            attendre(";", "dans le for");
            const pas = est(")") ? null : expression();
            attendre(")", "après le for");
            return { k: "for", init, cond, pas, corps: instructionImbriquee(), ligne };
          }
          case "break": prendre(); attendre(";"); return { k: "break", ligne };
          case "continue": prendre(); attendre(";"); return { k: "continue", ligne };
          case "return": {
            prendre();
            const e = est(";") ? null : expression();
            attendre(";", "après return");
            return { k: "return", e, ligne };
          }
          case "goto": {
            prendre();
            const nom = identifiant("après goto");
            attendre(";", "après goto");
            return { k: "goto", nom, ligne };
          }
          case "else": throw erreur("« else » sans « if »", ligne);
          case "switch": case "case": case "default": throw erreur("switch n'est pas pris en charge : utiliser if … else", ligne);
          case "float": case "double": throw erreur("Les nombres à virgule ne sont pas pris en charge", ligne);
          default: break;
        }
      }

      const e = expression();
      attendre(";", "à la fin de l'instruction");
      return { k: "expr", e, ligne };
    }

    function instructionImbriquee() {
      const s = instruction();
      if (s.k === "decl") throw erreur("Déclaration non autorisée ici : l'entourer d'accolades { }", s.ligne);
      return s;
    }

    /* ---- Expressions ---- */

    function expression() {
      let e = assignation();
      while (est(",")) {
        const ligne = prendre().ligne;
        e = { k: "virgule", g: e, d: assignation(), ligne };
      }
      return e;
    }

    const ASSIGNATIONS = new Set(["=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>="]);

    function assignation() {
      const g = conditionnelle();
      const j = voir();
      if (j.k === "op" && ASSIGNATIONS.has(j.v)) {
        prendre();
        return { k: "assign", op: j.v, g, d: assignation(), ligne: j.ligne };
      }
      return g;
    }

    function conditionnelle() {
      const c = binaire(0);
      if (!est("?")) return c;
      const ligne = prendre().ligne;
      const a = expression();
      attendre(":", "dans l'opérateur ?:");
      return { k: "cond", c, a, b: conditionnelle(), ligne };
    }

    const NIVEAUX = [["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "!="], ["<", "<=", ">", ">="], ["<<", ">>"], ["+", "-"], ["*", "/", "%"]];

    function binaire(niveau) {
      if (niveau >= NIVEAUX.length) return unaire();
      let g = binaire(niveau + 1);
      while (voir().k === "op" && NIVEAUX[niveau].includes(voir().v)) {
        const j = prendre();
        g = { k: "bin", op: j.v, g, d: binaire(niveau + 1), ligne: j.ligne };
      }
      return g;
    }

    function unaire() {
      const j = voir();
      if (j.k === "op" && ["-", "+", "!", "~"].includes(j.v)) {
        prendre();
        return { k: "un", op: j.v, e: unaire(), ligne: j.ligne };
      }
      if (j.k === "op" && (j.v === "++" || j.v === "--")) {
        prendre();
        return { k: "pre", op: j.v, e: unaire(), ligne: j.ligne };
      }
      if (j.k === "op" && (j.v === "*" || j.v === "&")) {
        throw erreur("Les pointeurs (" + j.v + ") ne sont pas pris en charge dans ces exercices", j.ligne);
      }
      if (j.k === "kw" && j.v === "sizeof") {
        prendre();
        if (est("(") && debutType(1)) {
          prendre();
          const type = specificateurs();
          attendre(")");
          return { k: "sizeof", type, ligne: j.ligne };
        }
        return { k: "sizeof", e: unaire(), ligne: j.ligne };
      }
      if (est("(") && debutType(1)) {
        prendre();
        const type = specificateurs();
        attendre(")", "après le type de la conversion");
        return { k: "cast", type, e: unaire(), ligne: j.ligne };
      }
      return postfixe();
    }

    function postfixe() {
      let e = primaire();
      for (;;) {
        const j = voir();
        if (j.k !== "op") break;
        if (j.v === "[") {
          prendre();
          const idx = expression();
          attendre("]");
          e = { k: "index", tab: e, idx, ligne: j.ligne };
        } else if (j.v === ".") {
          prendre();
          e = { k: "membre", e, nom: identifiant("après ."), ligne: j.ligne };
        } else if (j.v === "->") {
          throw erreur("Les pointeurs (->) ne sont pas pris en charge : utiliser .", j.ligne);
        } else if (j.v === "++" || j.v === "--") {
          prendre();
          e = { k: "post", op: j.v, e, ligne: j.ligne };
        } else if (j.v === "(") {
          if (e.k !== "id") throw erreur("Appel de fonction invalide", j.ligne);
          prendre();
          const args = [];
          while (!est(")")) {
            args.push(assignation());
            if (!est(",")) break;
            prendre();
          }
          attendre(")", "après les arguments");
          e = { k: "appel", nom: e.nom, args, ligne: j.ligne };
        } else break;
      }
      return e;
    }

    function primaire() {
      const j = prendre();
      if (j.k === "num") {
        const u = j.suffixe.includes("u"), l = j.suffixe.includes("l");
        let type;
        if (l) type = u || j.v > 0x7fffffffffffffffn ? ULONG : LONG;
        else if (u) type = j.v <= 0xffffffffn ? UINT : ULONG;
        else if (j.v <= 0x7fffffffn) type = INT;
        else if (j.hexa && j.v <= 0xffffffffn) type = UINT;
        else type = j.v <= 0x7fffffffffffffffn ? LONG : ULONG;
        return { k: "num", v: normaliser(j.v, type), type, ligne: j.ligne };
      }
      if (j.k === "char") return { k: "num", v: j.v, type: INT, ligne: j.ligne };
      if (j.k === "str") return { k: "str", v: j.v, ligne: j.ligne };
      if (j.k === "id") return { k: "id", nom: j.v, ligne: j.ligne };
      if (j.k === "op" && j.v === "(") {
        const e = expression();
        attendre(")", "pour fermer la parenthèse");
        return e;
      }
      throw erreur("Expression attendue avant " + decrire(j), j.ligne);
    }

    /* ---- Programme ---- */

    const globales = [];
    const instructions = [];
    let principal = null;

    while (voir().k !== "fin") {
      const ligne = voir().ligne;
      if (debutType()) {
        const base = specificateurs();
        if (voir().k === "id" && est("(", 1)) {
          const nom = prendre().v;
          prendre();
          while (!est(")")) {
            if (voir().k === "fin") throw erreur("« ) » manquante", ligne);
            prendre();
          }
          prendre();
          if (est(";")) { prendre(); continue; }
          if (!est("{")) throw erreur("« { » attendue pour le corps de " + nom, voir().ligne);
          const corps = instruction();
          if (nom === "main") principal = corps;
          continue;
        }
        const decl = declaration(base, ligne);
        globales.push(decl);
        continue;
      }
      instructions.push(instruction());
    }

    return { globales, instructions, principal, structs, source: String(source ?? ""), jetons };
  }

  /* =============================================================
     EXÉCUTION
     ============================================================= */

  function valeurNulle(type) {
    if (type.kind === "int") return { type, v: 0n };
    if (type.kind === "array") return { type, items: Array.from({ length: type.n }, () => valeurNulle(type.elem)) };
    if (type.kind === "struct") {
      const champs = {};
      for (const nom of type.ordre) champs[nom] = valeurNulle(type.champs.get(nom).type);
      return { type, champs };
    }
    throw erreur("Type non pris en charge : " + type.nom);
  }

  const SIGNAL_BREAK = { signal: "break" }, SIGNAL_CONTINUE = { signal: "continue" };

  class Machine {
    constructor(programme) {
      this.programme = programme;
      this.globales = new Map();
      this.pas = 0;
      this.sortie = "";
      this.fini = false;
      for (const decl of programme.globales) this.declarer(decl, this.globales, true);
    }

    /* ---- Variables ---- */

    declarer(decl, portee) {
      for (const d of decl.decls) {
        if (portee.has(d.nom)) throw erreur("Variable « " + d.nom + " » déclarée deux fois", d.ligne);
        const valeur = valeurNulle(d.type);
        if (d.init) this.initialiser(valeur, d.init, portee);
        portee.set(d.nom, valeur);
      }
    }

    initialiser(cible, init, portee) {
      const type = cible.type;
      if (type.kind === "int") {
        if (init.k === "liste") {
          if (init.elements.length !== 1) throw erreur("Une seule valeur attendue pour « " + type.nom + " »", init.ligne);
          return this.initialiser(cible, init.elements[0], portee);
        }
        cible.v = normaliser(this.valeur(init, portee).v, type);
        return;
      }
      if (type.kind === "array" && init.k === "str") {
        if (type.elem.taille !== 1) throw erreur("Une chaîne ne peut initialiser qu'un tableau de char", init.ligne);
        if (init.v.length + 1 > type.n) throw erreur("Chaîne trop longue pour le tableau (" + type.n + " cases)", init.ligne);
        [...init.v].forEach((ch, i) => (cible.items[i].v = normaliser(BigInt(ch.charCodeAt(0)), type.elem)));
        return;
      }
      if (init.k !== "liste") throw erreur("Initialisation de « " + type.nom + " » : utiliser { … }", init.ligne);
      if (type.kind === "array") {
        if (init.elements.length > type.n) throw erreur("Trop de valeurs pour un tableau de " + type.n + " cases", init.ligne);
        init.elements.forEach((e, i) => this.initialiser(cible.items[i], e, portee));
      } else {
        if (init.elements.length > type.ordre.length) throw erreur("Trop de valeurs pour " + type.nom, init.ligne);
        init.elements.forEach((e, i) => this.initialiser(cible.champs[type.ordre[i]], e, portee));
      }
    }

    trouver(nom, portee, ligne) {
      for (let p = portee; p; p = p.parent) {
        if (p.has(nom)) return p.get(nom);
      }
      if (this.globales.has(nom)) return this.globales.get(nom);
      throw erreur("Variable inconnue : « " + nom + " »", ligne);
    }

    compter(ligne) {
      if (++this.pas > PAS_MAX) {
        throw erreur("Plus de " + PAS_MAX.toLocaleString("fr-FR") + " étapes : le programme ne s'arrête pas (boucle infinie ?)", ligne);
      }
    }

    /* ---- Instructions ---- */

    executer() {
      const portee = new Map();
      const signal = this.liste(this.programme.instructions, portee);
      this.verifierSignal(signal);
      if (!this.fini && this.programme.principal) {
        this.verifierSignal(this.instruction(this.programme.principal, portee));
      }
      return this;
    }

    verifierSignal(signal) {
      if (!signal || signal.signal === "return") return;
      if (signal.signal === "goto") throw erreur("Étiquette introuvable dans ce bloc : « " + signal.nom + " »", signal.ligne);
      throw erreur("« " + signal.signal + " » en dehors d'une boucle", signal.ligne);
    }

    liste(instructions, portee) {
      let i = 0;
      while (i < instructions.length) {
        const signal = this.instruction(instructions[i], portee);
        if (signal) {
          if (signal.signal === "goto") {
            const cible = instructions.findIndex((s) => s.k === "etiquette" && s.nom === signal.nom);
            if (cible >= 0) { i = cible + 1; continue; }
          }
          return signal;
        }
        i++;
      }
      return null;
    }

    instruction(s, portee) {
      this.compter(s.ligne);
      switch (s.k) {
        case "decl":
          if (portee === null) return null;
          this.declarer(s, portee);
          return null;
        case "expr":
          this.valeur(s.e, portee);
          return null;
        case "vide": case "etiquette":
          return null;
        case "bloc": {
          const locale = new Map();
          locale.parent = portee;
          return this.liste(s.corps, locale);
        }
        case "if":
          if (this.vrai(s.cond, portee)) return this.instruction(s.alors, portee);
          return s.sinon ? this.instruction(s.sinon, portee) : null;
        case "while":
          while (this.vrai(s.cond, portee)) {
            const signal = this.instruction(s.corps, portee);
            if (signal === SIGNAL_BREAK) break;
            if (signal && signal !== SIGNAL_CONTINUE) return signal;
          }
          return null;
        case "do":
          do {
            const signal = this.instruction(s.corps, portee);
            if (signal === SIGNAL_BREAK) break;
            if (signal && signal !== SIGNAL_CONTINUE) return signal;
          } while (this.vrai(s.cond, portee));
          return null;
        case "for": {
          const locale = new Map();
          locale.parent = portee;
          if (s.init) this.instruction(s.init, locale);
          while (!s.cond || this.vrai(s.cond, locale)) {
            const signal = this.instruction(s.corps, locale);
            if (signal === SIGNAL_BREAK) break;
            if (signal && signal !== SIGNAL_CONTINUE) return signal;
            if (s.pas) this.valeur(s.pas, locale);
            this.compter(s.ligne);
          }
          return null;
        }
        case "break": return SIGNAL_BREAK;
        case "continue": return SIGNAL_CONTINUE;
        case "return":
          if (s.e) this.valeur(s.e, portee);
          this.fini = true;
          return { signal: "return" };
        case "goto":
          return { signal: "goto", nom: s.nom, ligne: s.ligne };
      }
      throw erreur("Instruction non prise en charge", s.ligne);
    }

    vrai(e, portee) {
      return this.valeur(e, portee).v !== 0n;
    }

    /* ---- Expressions ---- */

    /** Emplacement modifiable (variable, case de tableau, champ). */
    emplacement(e, portee) {
      if (e.k === "id") return this.trouver(e.nom, portee, e.ligne);
      if (e.k === "index") {
        const tab = this.emplacement(e.tab, portee);
        if (tab.type.kind !== "array") throw erreur("« [ ] » appliqué à autre chose qu'un tableau", e.ligne);
        const i = this.valeur(e.idx, portee).v;
        if (i < 0n || i >= BigInt(tab.type.n)) {
          throw erreur("Indice " + i + " hors du tableau (" + tab.type.n + " cases : 0 à " + (tab.type.n - 1) + ")", e.ligne);
        }
        return tab.items[Number(i)];
      }
      if (e.k === "membre") {
        const s = this.emplacement(e.e, portee);
        if (s.type.kind !== "struct") throw erreur("« ." + e.nom + " » appliqué à autre chose qu'une structure", e.ligne);
        if (!(e.nom in s.champs)) throw erreur(s.type.nom + " n'a pas de champ « " + e.nom + " »", e.ligne);
        return s.champs[e.nom];
      }
      throw erreur("Cette expression ne peut pas être modifiée", e.ligne);
    }

    scalaire(emp, e) {
      if (emp.type.kind === "int") return emp;
      throw erreur("« " + emp.type.nom + " » utilisé comme un nombre" + (emp.type.kind === "array" ? " : indiquer une case, par exemple t[0]" : ""), e.ligne);
    }

    valeur(e, portee) {
      switch (e.k) {
        case "num":
          return { type: e.type, v: e.v };
        case "id": case "index": case "membre": {
          const emp = this.scalaire(this.emplacement(e, portee), e);
          return { type: emp.type, v: emp.v };
        }
        case "str":
          throw erreur("Chaîne utilisée hors d'une initialisation ou d'un printf", e.ligne);
        case "virgule":
          this.valeur(e.g, portee);
          return this.valeur(e.d, portee);
        case "cond":
          return this.vrai(e.c, portee) ? this.valeur(e.a, portee) : this.valeur(e.b, portee);
        case "cast": {
          if (e.type.kind !== "int") throw erreur("Conversion vers « " + e.type.nom + " » non prise en charge", e.ligne);
          return { type: e.type, v: normaliser(this.valeur(e.e, portee).v, e.type) };
        }
        case "sizeof": {
          const type = e.type || (["id", "index", "membre"].includes(e.e.k) ? this.emplacement(e.e, portee).type : this.valeur(e.e, portee).type);
          return { type: ULONG, v: BigInt(type.taille) };
        }
        case "un": {
          const x = this.valeur(e.e, portee);
          if (e.op === "!") return { type: INT, v: x.v === 0n ? 1n : 0n };
          const type = promouvoir(x.type);
          const v = e.op === "-" ? -x.v : e.op === "~" ? ~x.v : x.v;
          return { type, v: normaliser(v, type) };
        }
        case "pre": case "post": {
          const emp = this.scalaire(this.emplacement(e.e, portee), e);
          const avant = emp.v;
          emp.v = normaliser(avant + (e.op === "++" ? 1n : -1n), emp.type);
          return { type: emp.type, v: e.k === "pre" ? emp.v : avant };
        }
        case "assign": {
          const emp = this.scalaire(this.emplacement(e.g, portee), e);
          const d = this.valeur(e.d, portee);
          const v = e.op === "=" ? d : this.operation(e.op.slice(0, -1), { type: emp.type, v: emp.v }, d, e.ligne);
          emp.v = normaliser(v.v, emp.type);
          return { type: emp.type, v: emp.v };
        }
        case "bin": {
          if (e.op === "&&") return { type: INT, v: this.vrai(e.g, portee) && this.vrai(e.d, portee) ? 1n : 0n };
          if (e.op === "||") return { type: INT, v: this.vrai(e.g, portee) || this.vrai(e.d, portee) ? 1n : 0n };
          return this.operation(e.op, this.valeur(e.g, portee), this.valeur(e.d, portee), e.ligne);
        }
        case "appel":
          return this.appel(e, portee);
      }
      throw erreur("Expression non prise en charge", e.ligne);
    }

    operation(op, a, b, ligne) {
      if (op === "<<" || op === ">>") {
        const type = promouvoir(a.type);
        const n = b.v;
        if (n < 0n || n >= BigInt(8 * type.taille)) throw erreur("Décalage de " + n + " bits invalide pour un " + type.nom, ligne);
        const x = normaliser(a.v, type);
        return { type, v: normaliser(op === "<<" ? x << n : x >> n, type) };
      }
      const type = typeCommun(a.type, b.type);
      const x = normaliser(a.v, type), y = normaliser(b.v, type);
      switch (op) {
        case "+": return { type, v: normaliser(x + y, type) };
        case "-": return { type, v: normaliser(x - y, type) };
        case "*": return { type, v: normaliser(x * y, type) };
        case "/": case "%":
          if (y === 0n) throw erreur("Division par zéro", ligne);
          return { type, v: normaliser(op === "/" ? x / y : x % y, type) };
        case "&": return { type, v: normaliser(x & y, type) };
        case "|": return { type, v: normaliser(x | y, type) };
        case "^": return { type, v: normaliser(x ^ y, type) };
        case "==": return { type: INT, v: x === y ? 1n : 0n };
        case "!=": return { type: INT, v: x !== y ? 1n : 0n };
        case "<": return { type: INT, v: x < y ? 1n : 0n };
        case "<=": return { type: INT, v: x <= y ? 1n : 0n };
        case ">": return { type: INT, v: x > y ? 1n : 0n };
        case ">=": return { type: INT, v: x >= y ? 1n : 0n };
      }
      throw erreur("Opérateur non pris en charge : " + op, ligne);
    }

    appel(e, portee) {
      if (e.nom !== "printf") {
        throw erreur("Appel de « " + e.nom + " » : les appels de fonctions ne sont pas pris en charge (sauf printf)", e.ligne);
      }
      if (!e.args.length || e.args[0].k !== "str") throw erreur("printf attend une chaîne de format en premier", e.ligne);
      const format = e.args[0].v;
      let n = 1, texte = "";
      for (let i = 0; i < format.length; i++) {
        if (format[i] !== "%") { texte += format[i]; continue; }
        const m = /^%(l{0,2}|h{0,2})([diuxXcs%])/.exec(format.slice(i));
        if (!m) throw erreur("Format printf non pris en charge : " + format.slice(i, i + 3), e.ligne);
        i += m[0].length - 1;
        if (m[2] === "%") { texte += "%"; continue; }
        const arg = e.args[n++];
        if (!arg) throw erreur("printf : argument manquant pour " + m[0], e.ligne);
        if (m[2] === "s") {
          if (arg.k === "str") { texte += arg.v; continue; }
          const emp = this.emplacement(arg, portee);
          if (emp.type.kind !== "array") throw erreur("%s attend une chaîne ou un tableau de char", e.ligne);
          for (const c of emp.items) { if (c.v === 0n) break; texte += String.fromCharCode(Number(c.v & 255n)); }
          continue;
        }
        const x = this.valeur(arg, portee);
        const taille = m[1].startsWith("l") ? 8 : 4;
        if (m[2] === "c") texte += String.fromCharCode(Number(x.v & 255n));
        else if (m[2] === "u") texte += BigInt.asUintN(8 * taille, x.v).toString();
        else if (m[2] === "x" || m[2] === "X") {
          const h = BigInt.asUintN(8 * taille, x.v).toString(16);
          texte += m[2] === "X" ? h.toUpperCase() : h;
        } else texte += BigInt.asIntN(8 * taille, x.v).toString();
      }
      if (this.sortie.length < 20000) this.sortie += texte;
      return { type: INT, v: BigInt(texte.length) };
    }

    /* ---- Accès par clé : "n", "t[2]", "pts[1].x" ---- */

    cleVersExpression(cle) {
      let prog;
      try {
        prog = analyser(cle + ";");
      } catch (e) {
        throw new Error("Clé de test invalide : " + cle);
      }
      return prog.instructions[0].e;
    }

    emplacementCle(cle) {
      const e = this.cleVersExpression(cle);
      try {
        return this.emplacement(e, null);
      } catch (err) {
        if (/Variable inconnue/.test(err.message)) {
          throw erreur("Variable « " + cle.split(/[[.]/)[0] + " » introuvable");
        }
        throw err;
      }
    }

    lireCle(cle) {
      const emp = this.emplacementCle(cle);
      if (emp.type.kind !== "int") throw new Error("La clé « " + cle + " » ne désigne pas un nombre");
      return emp.v;
    }

    typeCle(cle) {
      return this.emplacementCle(cle).type;
    }

    poser(cle, valeur) {
      const emp = this.emplacementCle(cle);
      if (emp.type.kind === "array") {
        const liste = typeof valeur === "string" ? [...valeur].map((c) => c.charCodeAt(0)).concat(0) : [].concat(valeur);
        if (liste.length > emp.type.n) throw new Error("Trop de valeurs pour « " + cle + " »");
        liste.forEach((v, i) => (emp.items[i].v = normaliser(versBigInt(v), emp.type.elem)));
        return;
      }
      if (emp.type.kind !== "int") throw new Error("La clé « " + cle + " » ne désigne pas un nombre");
      emp.v = normaliser(versBigInt(valeur), emp.type);
    }
  }

  function versBigInt(v) {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(Math.trunc(v));
    const s = String(v);
    if (s.length === 1 && !/\d/.test(s)) return BigInt(s.charCodeAt(0));
    return s.startsWith("-") ? -BigInt(s.slice(1)) : BigInt(s);
  }

  /* ---------------- Vérification « C aplati » ---------------- */

  /**
   * Renvoie null si le code ne contient que des if (…) goto, des goto
   * et des étiquettes ; sinon { ligne, message }.
   */
  function verifierAplati(programme) {
    const parcourir = (liste, racineFonction) => {
      for (const s of liste) {
        const probleme = verifierInstruction(s, racineFonction);
        if (probleme) return probleme;
      }
      return null;
    };
    const verifierInstruction = (s) => {
      switch (s.k) {
        case "while": case "for": case "do":
          return { ligne: s.ligne, message: "« " + s.k + " » interdit dans du C aplati : utiliser une étiquette, if (…) goto et goto" };
        case "bloc":
          return { ligne: s.ligne, message: "Bloc { } interdit dans du C aplati : écrire les instructions les unes après les autres" };
        case "if":
          if (s.sinon) return { ligne: s.ligne, message: "« else » interdit dans du C aplati : utiliser goto else1; … goto endif1;" };
          if (s.alors.k !== "goto") return { ligne: s.ligne, message: "Dans du C aplati, un if ne contient qu'un goto : if (…) goto etiquette;" };
          return null;
        default:
          return null;
      }
    };
    return parcourir(programme.instructions) ||
      (programme.principal ? parcourir(programme.principal.corps) : null);
  }

  /* ---------------- Mots utilisés (pour interdire / imposer) ---------------- */

  function motsUtilises(programme) {
    const mots = new Set();
    for (const j of programme.jetons) if (j.k === "kw" || j.k === "id" || j.k === "op") mots.add(j.v);
    return mots;
  }

  /* ---------------- Affichage ---------------- */

  function variablesGlobales(machine) {
    return [...machine.globales.entries()].map(([nom, valeur]) => ({ nom, valeur }));
  }

  const MiniC = {
    analyser,
    machine: (programme) => new Machine(programme),
    verifierAplati,
    motsUtilises,
    variablesGlobales,
    versBigInt,
    TYPES: { CHAR, UCHAR, SHORT, USHORT, INT, UINT, LONG, ULONG }
  };

  if (typeof module !== "undefined" && module.exports) module.exports = MiniC;
  racine.MiniC = MiniC;
})(typeof window !== "undefined" ? window : globalThis);
