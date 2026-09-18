/* =============================================================
   Émulateur x86-64 — syntaxe AT&T (sous-ensemble du cours)
   -------------------------------------------------------------
   Assemble un programme puis l'exécute entièrement dans le
   navigateur. Aucune dépendance au DOM : le même fichier sert
   sous Node pour vérifier les solutions des exercices.

   Pris en charge :
     - sections .text .data .rodata .bss, étiquettes, .globl,
       .byte .word .long .quad .skip .string .ascii .align .equ
     - mov, movs??, movz??, lea, push, pop, xchg
     - add sub inc dec neg imul mul idiv div
     - cbtw cwtl cltq cwtd cltd cqto
     - and or xor not test, sal shl sar shr
     - cmp, jmp, j?? (signés et non signés), call, ret, leave, nop
     - opérandes $imm, %reg, étiquette, d(base,index,échelle)

   Utilisation :
     const prog = AsmX86.assembler(source);       // lève une erreur { ligne }
     const m = AsmX86.machine(prog);
     m.poser("x", 5);                             // entrée d'un test
     m.executer();                                // lève une erreur { ligne }
     m.lireCle("%eax"); m.lireCle("tab[2]");      // résultats
   ============================================================= */

(function (racine) {
  "use strict";

  const MEM_TAILLE = 1 << 20;          /* 1 Mio de mémoire simulée            */
  const MEM_DEBUT = 0x1000;            /* sous 4096 : erreur de segmentation  */
  const CODE_BASE = 0x400000;          /* « adresses » des instructions       */
  const RETOUR_FIN = BigInt(CODE_BASE - 16);
  const PAS_MAX = 500000;

  const MASQUE = { 1: 0xffn, 2: 0xffffn, 4: 0xffffffffn, 8: 0xffffffffffffffffn };
  const SIGNE = { 1: 0x80n, 2: 0x8000n, 4: 0x80000000n, 8: 0x8000000000000000n };
  const SUFFIXE = { b: 1, w: 2, l: 4, q: 8 };
  const LETTRE = { 1: "b", 2: "w", 4: "l", 8: "q" };

  function erreur(message, ligne) {
    const e = new Error(message);
    e.ligne = ligne || null;
    e.erreurCode = true;
    return e;
  }

  const signe = (v, t) => BigInt.asIntN(8 * t, v);
  const octets = (t) => t + (t > 1 ? " octets" : " octet");

  /* ---------------- Registres ---------------- */

  const NOMS64 = ["rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rbp", "rsp",
                  "r8", "r9", "r10", "r11", "r12", "r13", "r14", "r15"];
  const I_RSP = 7, I_RBP = 6;
  const REG = {};
  [
    ["rax", "eax", "ax", "al", "ah"], ["rbx", "ebx", "bx", "bl", "bh"],
    ["rcx", "ecx", "cx", "cl", "ch"], ["rdx", "edx", "dx", "dl", "dh"],
    ["rsi", "esi", "si", "sil"], ["rdi", "edi", "di", "dil"],
    ["rbp", "ebp", "bp", "bpl"], ["rsp", "esp", "sp", "spl"]
  ].forEach((noms, i) => {
    [8, 4, 2, 1].forEach((t, k) => (REG[noms[k]] = { i, t }));
    if (noms[4]) REG[noms[4]] = { i, t: 1, haut: true };
  });
  for (let k = 8; k < 16; k++) {
    REG["r" + k] = { i: k, t: 8 };
    REG["r" + k + "d"] = { i: k, t: 4 };
    REG["r" + k + "w"] = { i: k, t: 2 };
    REG["r" + k + "b"] = { i: k, t: 1 };
  }
  const regA = (t) => ({ i: 0, t });
  const regD = (t) => ({ i: 3, t });
  const REG_AH = REG.ah;

  /* ---------------- Instructions reconnues ---------------- */

  const FAMILLES = new Set([
    "mov", "add", "sub", "and", "or", "xor", "cmp", "test", "inc", "dec", "neg", "not",
    "sal", "shl", "sar", "shr", "imul", "mul", "idiv", "div", "push", "pop", "lea", "xchg"
  ]);

  const CONDITIONS = {
    jmp: () => true,
    je: (f) => f.zf, jz: (f) => f.zf,
    jne: (f) => !f.zf, jnz: (f) => !f.zf,
    jl: (f) => f.sf !== f.of, jnge: (f) => f.sf !== f.of,
    jle: (f) => f.zf || f.sf !== f.of, jng: (f) => f.zf || f.sf !== f.of,
    jg: (f) => !f.zf && f.sf === f.of, jnle: (f) => !f.zf && f.sf === f.of,
    jge: (f) => f.sf === f.of, jnl: (f) => f.sf === f.of,
    jb: (f) => f.cf, jnae: (f) => f.cf, jc: (f) => f.cf,
    jbe: (f) => f.cf || f.zf, jna: (f) => f.cf || f.zf,
    ja: (f) => !f.cf && !f.zf, jnbe: (f) => !f.cf && !f.zf,
    jae: (f) => !f.cf, jnb: (f) => !f.cf, jnc: (f) => !f.cf,
    js: (f) => f.sf, jns: (f) => !f.sf
  };

  const SANS_OPERANDE = new Set(["cbtw", "cwtl", "cltq", "cwtd", "cltd", "cqto", "ret", "retq", "leave", "leaveq", "nop"]);

  /* Noms d'une autre syntaxe (Intel) : on indique l'équivalent AT&T. */
  const EQUIVALENTS = {
    cdq: "cltd", cqo: "cqto", cdqe: "cltq", cwd: "cwtd", cbw: "cbtw", cwde: "cwtl",
    movsx: "movsbl, movswl, movslq…", movzx: "movzbl, movzwl…", movsxd: "movslq"
  };

  /* ---------------- Texte : commentaires, découpage ---------------- */

  function sansCommentaire(texte) {
    let sortie = "";
    for (let i = 0; i < texte.length; i++) {
      const c = texte[i];
      if (c === "#") break;
      if (c === "/" && texte[i + 1] === "*") {
        const fin = texte.indexOf("*/", i + 2);
        if (fin < 0) break;
        i = fin + 1;
        sortie += " ";
        continue;
      }
      if (c === '"') {
        let j = i + 1;
        while (j < texte.length && texte[j] !== '"') j += texte[j] === "\\" ? 2 : 1;
        sortie += texte.slice(i, j + 1);
        i = j;
        continue;
      }
      if (c === "'") {
        let j = i + 1;
        if (texte[j] === "\\") j++;
        j++;
        if (texte[j] === "'") j++;
        sortie += texte.slice(i, j);
        i = j - 1;
        continue;
      }
      sortie += c;
    }
    return sortie;
  }

  /* Découpe « a, b(c,d), ',' » aux virgules de premier niveau. */
  function decouperArgs(texte) {
    const args = [];
    let profondeur = 0, courant = "";
    for (let i = 0; i < texte.length; i++) {
      const c = texte[i];
      if (c === '"') {
        let j = i + 1;
        while (j < texte.length && texte[j] !== '"') j += texte[j] === "\\" ? 2 : 1;
        courant += texte.slice(i, j + 1);
        i = j;
        continue;
      }
      if (c === "'") {
        let j = i + 1;
        if (texte[j] === "\\") j++;
        j++;
        if (texte[j] === "'") j++;
        courant += texte.slice(i, j);
        i = j - 1;
        continue;
      }
      if (c === "(") profondeur++;
      if (c === ")") profondeur--;
      if (c === "," && profondeur === 0) {
        args.push(courant.trim());
        courant = "";
        continue;
      }
      courant += c;
    }
    if (courant.trim() || args.length) args.push(courant.trim());
    return args;
  }

  const ECHAPPEMENTS = { n: 10, t: 9, r: 13, 0: 0, "\\": 92, "'": 39, '"': 34, a: 7, b: 8, f: 12, v: 11 };

  function lireChaine(texte, ligne) {
    const t = texte.trim();
    if (t[0] !== '"' || t[t.length - 1] !== '"' || t.length < 2) {
      throw erreur("Chaîne attendue entre guillemets : " + texte, ligne);
    }
    const codes = [];
    for (let i = 1; i < t.length - 1; i++) {
      if (t[i] === "\\") {
        i++;
        if (!(t[i] in ECHAPPEMENTS)) throw erreur("Échappement inconnu : \\" + t[i], ligne);
        codes.push(ECHAPPEMENTS[t[i]]);
      } else {
        const code = t.charCodeAt(i);
        if (code > 255) throw erreur("Caractère non ASCII dans la chaîne : " + t[i], ligne);
        codes.push(code);
      }
    }
    return codes;
  }

  /* ---------------- Expressions constantes ---------------- */

  function jetons(texte, ligne) {
    const liste = [];
    let i = 0;
    while (i < texte.length) {
      const c = texte[i];
      if (/\s/.test(c)) { i++; continue; }
      let m;
      const reste = texte.slice(i);
      if ((m = /^(0x[0-9a-f]+|0b[01]+|\d+)/i.exec(reste))) {
        if (/^[A-Za-z_]/.test(reste.slice(m[0].length))) throw erreur("Nombre invalide : " + reste.split(/[\s,+\-*/()]/)[0], ligne);
        const brut = m[0].toLowerCase();
        const v = brut.length > 1 && brut[0] === "0" && /^\d+$/.test(brut) ? BigInt("0o" + brut.slice(1)) : BigInt(brut);
        liste.push({ k: "n", v });
        i += m[0].length;
      } else if (c === "'") {
        let code, lg;
        if (texte[i + 1] === "\\") {
          const e = texte[i + 2];
          if (!(e in ECHAPPEMENTS)) throw erreur("Échappement inconnu : \\" + e, ligne);
          code = ECHAPPEMENTS[e];
          lg = 3;
        } else {
          if (i + 1 >= texte.length) throw erreur("Caractère attendu après '", ligne);
          code = texte.charCodeAt(i + 1);
          lg = 2;
        }
        if (texte[i + lg] === "'") lg++;
        liste.push({ k: "n", v: BigInt(code) });
        i += lg;
      } else if ((m = /^[A-Za-z_.][\w.$]*/.exec(reste))) {
        liste.push({ k: "id", nom: m[0] });
        i += m[0].length;
      } else if ("+-*/%()~".includes(c)) {
        liste.push({ k: c });
        i++;
      } else {
        throw erreur("Caractère inattendu « " + c + " » dans « " + texte.trim() + " »", ligne);
      }
    }
    return liste;
  }

  /** Évalue une expression ; resoudre(nom) renvoie un BigInt ou lève une erreur. */
  function evaluer(texte, resoudre, ligne) {
    const liste = jetons(texte, ligne);
    if (!liste.length) throw erreur("Valeur manquante", ligne);
    let p = 0;
    const voir = () => liste[p] && liste[p].k;

    function primaire() {
      const j = liste[p++];
      if (!j) throw erreur("Expression incomplète : « " + texte.trim() + " »", ligne);
      if (j.k === "n") return j.v;
      if (j.k === "id") return resoudre(j.nom);
      if (j.k === "(") {
        const v = somme();
        if (voir() !== ")") throw erreur("Parenthèse fermante manquante dans « " + texte.trim() + " »", ligne);
        p++;
        return v;
      }
      if (j.k === "-") return -primaire();
      if (j.k === "+") return primaire();
      if (j.k === "~") return ~primaire();
      throw erreur("Expression invalide : « " + texte.trim() + " »", ligne);
    }
    function produit() {
      let v = primaire();
      while (["*", "/", "%"].includes(voir())) {
        const op = liste[p++].k;
        const d = primaire();
        if (op !== "*" && d === 0n) throw erreur("Division par zéro dans « " + texte.trim() + " »", ligne);
        v = op === "*" ? v * d : op === "/" ? v / d : v % d;
      }
      return v;
    }
    function somme() {
      let v = produit();
      while (["+", "-"].includes(voir())) {
        const op = liste[p++].k;
        const d = produit();
        v = op === "+" ? v + d : v - d;
      }
      return v;
    }

    const v = somme();
    if (p < liste.length) throw erreur("Expression invalide : « " + texte.trim() + " »", ligne);
    return v;
  }

  /* =============================================================
     ASSEMBLAGE
     ============================================================= */

  const TAILLE_DONNEE = { ".byte": 1, ".word": 2, ".short": 2, ".value": 2, ".long": 4, ".int": 4, ".quad": 8 };
  const DIRECTIVES_IGNOREES = new Set([".globl", ".global", ".type", ".size", ".file", ".ident", ".local", ".weak", ".intel_syntax"]);

  function assembler(source) {
    const lignes = String(source ?? "").replace(/\r\n?/g, "\n").split("\n");
    const symboles = new Map();
    const constantes = new Map();
    const sections = {
      data: { nom: ".data", taille: 0, elements: [] },
      rodata: { nom: ".rodata", taille: 0, elements: [] },
      bss: { nom: ".bss", taille: 0, elements: [] }
    };
    const brutes = [];
    let courante = "text";
    let enAttente = [];

    const constante = (nom, ligne) => {
      if (constantes.has(nom)) return constantes.get(nom);
      if (symboles.has(nom)) throw erreur("« " + nom + " » est une étiquette : sa valeur n'est pas connue à cet endroit", ligne);
      throw erreur("Constante inconnue : " + nom, ligne);
    };

    /* ---- Passe 1 : étiquettes, tailles, liste des instructions ---- */
    lignes.forEach((brute, k) => {
      const ligne = k + 1;
      let reste = sansCommentaire(brute).trim();
      let m;
      while ((m = /^([A-Za-z_.][\w.$]*)\s*:/.exec(reste))) {
        const nom = m[1];
        if (symboles.has(nom) || constantes.has(nom)) throw erreur("Étiquette « " + nom + " » définie deux fois", ligne);
        const sym = {
          nom, ligne, section: courante,
          decal: courante === "text" ? brutes.length : sections[courante].taille,
          taille: null, chaine: false
        };
        symboles.set(nom, sym);
        if (courante !== "text") enAttente.push(sym);
        reste = reste.slice(m[0].length).trim();
      }
      if (!reste) return;

      const sep = reste.search(/\s/);
      const mot = (sep < 0 ? reste : reste.slice(0, sep)).toLowerCase();
      const args = sep < 0 ? "" : reste.slice(sep).trim();

      if (!mot.startsWith(".")) {
        if (/^\.[a-z]+\b/.test(args) && !FAMILLES.has(mot) && !(mot in CONDITIONS)) {
          throw erreur("Il manque « : » après l'étiquette « " + mot + " »", ligne);
        }
        if (courante !== "text") {
          throw erreur("Instruction « " + mot + " » dans la section " + sections[courante].nom + " : les instructions vont dans .text", ligne);
        }
        brutes.push({ ligne, mn: mot, args });
        return;
      }

      /* ---- Directives ---- */
      if (mot === ".section") {
        const nom = args.replace(/^"|"$/g, "").split(",")[0].trim().replace(/^"|"$/g, "");
        const cle = { ".text": "text", ".data": "data", ".bss": "bss", ".rodata": "rodata" }[nom];
        if (!cle) throw erreur("Section inconnue : " + (nom || "(vide)") + " — utiliser \".text\", \".data\", \".rodata\" ou \".bss\"", ligne);
        courante = cle;
        enAttente = [];
        return;
      }
      if (mot === ".text" || mot === ".data" || mot === ".bss") {
        courante = mot.slice(1);
        enAttente = [];
        return;
      }
      if (DIRECTIVES_IGNOREES.has(mot)) {
        if ((mot === ".globl" || mot === ".global") && !/^[A-Za-z_.][\w.$]*$/.test(args)) {
          throw erreur(mot + " attend un nom d'étiquette", ligne);
        }
        return;
      }
      if (mot === ".equ" || mot === ".set") {
        const [nom, expr] = decouperArgs(args);
        if (!nom || !/^[A-Za-z_.][\w.$]*$/.test(nom) || expr === undefined) throw erreur(mot + " s'écrit : " + mot + " NOM, valeur", ligne);
        if (symboles.has(nom)) throw erreur("« " + nom + " » est déjà une étiquette", ligne);
        constantes.set(nom, evaluer(expr, (n) => constante(n, ligne), ligne));
        return;
      }
      if (mot === ".align" || mot === ".balign" || mot === ".p2align") {
        if (courante === "text") return;
        let n = Number(evaluer(args.split(",")[0], (x) => constante(x, ligne), ligne));
        if (mot === ".p2align") n = 2 ** n;
        if (n <= 0 || (n & (n - 1))) throw erreur(mot + " attend une puissance de 2", ligne);
        const s = sections[courante];
        const pad = (n - (s.taille % n)) % n;
        if (pad) s.elements.push({ decal: s.taille, zeros: pad, ligne });
        s.taille += pad;
        for (const sym of enAttente) sym.decal = s.taille;
        return;
      }

      const estDonnee = mot in TAILLE_DONNEE || [".string", ".asciz", ".ascii"].includes(mot);
      const estReserve = [".skip", ".space", ".zero"].includes(mot);
      if (!estDonnee && !estReserve) throw erreur("Directive inconnue : " + mot, ligne);

      if (courante === "text") {
        throw erreur("La directive " + mot + " réserve des données : la placer dans .data" + (estReserve ? " ou .bss" : ""), ligne);
      }
      const s = sections[courante];

      if (estReserve) {
        const [nTexte, rempl] = decouperArgs(args);
        if (!nTexte) throw erreur(mot + " attend un nombre d'octets", ligne);
        const n = Number(evaluer(nTexte, (x) => constante(x, ligne), ligne));
        if (!(n >= 0) || n > 400000) throw erreur(mot + " : taille invalide (" + n + ")", ligne);
        const valeur = rempl !== undefined ? Number(evaluer(rempl, (x) => constante(x, ligne), ligne)) & 255 : 0;
        if (valeur && courante === "bss") throw erreur("Dans .bss, les octets réservés valent 0 : pas de valeur de remplissage", ligne);
        s.elements.push({ decal: s.taille, zeros: n, valeur, ligne });
        for (const sym of enAttente) sym.taille = [1, 2, 4, 8].includes(n) ? n : null;
        enAttente = [];
        s.taille += n;
        return;
      }

      if (courante === "bss") {
        throw erreur("Dans .bss, pas de valeur initiale : réserver la place avec .skip (ou mettre la variable dans .data)", ligne);
      }

      if (mot in TAILLE_DONNEE) {
        const t = TAILLE_DONNEE[mot];
        const valeurs = decouperArgs(args);
        if (!valeurs.length || valeurs.some((v) => !v)) throw erreur(mot + " attend une ou plusieurs valeurs séparées par des virgules", ligne);
        s.elements.push({ decal: s.taille, t, exprs: valeurs, ligne });
        for (const sym of enAttente) sym.taille = t;
        enAttente = [];
        s.taille += t * valeurs.length;
        return;
      }

      /* .string / .asciz / .ascii */
      const codes = [];
      for (const morceau of decouperArgs(args)) {
        codes.push(...lireChaine(morceau, ligne));
        if (mot !== ".ascii") codes.push(0);
      }
      s.elements.push({ decal: s.taille, codes, ligne });
      for (const sym of enAttente) { sym.taille = 1; sym.chaine = true; }
      enAttente = [];
      s.taille += codes.length;
    });

    /* ---- Disposition en mémoire ---- */
    let adresse = MEM_DEBUT;
    for (const cle of ["data", "rodata", "bss"]) {
      const s = sections[cle];
      s.debut = adresse;
      s.fin = adresse + s.taille;
      adresse = Math.ceil((s.fin + 1) / 16) * 16;
    }
    if (adresse > MEM_TAILLE - 0x10000) throw erreur("Trop de données réservées pour la mémoire simulée", null);

    for (const sym of symboles.values()) {
      sym.adresse = sym.section === "text" ? CODE_BASE + sym.decal : sections[sym.section].debut + sym.decal;
    }

    const resoudre = (ligne) => (nom) => {
      if (constantes.has(nom)) return constantes.get(nom);
      const sym = symboles.get(nom);
      if (!sym) {
        if (REG[nom.toLowerCase()]) throw erreur("« " + nom + " » : un registre s'écrit avec % (%" + nom.toLowerCase() + ")", ligne);
        throw erreur("Étiquette inconnue : " + nom, ligne);
      }
      return BigInt(sym.adresse);
    };

    /* Étendue de chaque variable : jusqu'à l'étiquette suivante. */
    for (const cle of ["data", "rodata", "bss"]) {
      const dans = [...symboles.values()].filter((s) => s.section === cle).sort((a, b) => a.decal - b.decal);
      dans.forEach((sym, i) => {
        const suivant = dans.slice(i + 1).find((s) => s.decal > sym.decal);
        sym.etendue = (suivant ? suivant.decal : sections[cle].taille) - sym.decal;
      });
    }

    /* ---- Passe 2 : valeurs initiales ---- */
    const initial = [];
    for (const cle of ["data", "rodata"]) {
      const s = sections[cle];
      for (const e of s.elements) {
        const base = s.debut + e.decal;
        if (e.codes) {
          initial.push({ adresse: base, octets: Uint8Array.from(e.codes) });
        } else if (e.exprs) {
          const tampon = new Uint8Array(e.t * e.exprs.length);
          e.exprs.forEach((texte, n) => {
            let v = evaluer(texte, resoudre(e.ligne), e.ligne);
            v &= MASQUE[e.t];
            for (let o = 0; o < e.t; o++) tampon[n * e.t + o] = Number((v >> BigInt(8 * o)) & 0xffn);
          });
          initial.push({ adresse: base, octets: tampon });
        } else if (e.valeur) {
          initial.push({ adresse: base, octets: new Uint8Array(e.zeros).fill(e.valeur) });
        }
      }
    }

    /* ---- Passe 2 : décodage des instructions ---- */
    const code = brutes.map((b) => decoder(b, resoudre(b.ligne), symboles));

    const principal = symboles.get("main") || symboles.get("_start");
    return {
      code,
      symboles,
      sections,
      initial,
      depart: principal && principal.section === "text" ? principal.decal : 0,
      registresCites: registresCites(lignes)
    };
  }

  function registresCites(lignes) {
    const vus = new Map();
    for (const brute of lignes) {
      for (const m of sansCommentaire(brute).matchAll(/%([a-z0-9]+)/gi)) {
        const nom = m[1].toLowerCase();
        const r = REG[nom];
        if (!r || r.i === I_RSP) continue;
        const cle = r.haut ? "h" + r.i : r.i;
        if (!vus.has(cle) || vus.get(cle).t < r.t) vus.set(cle, { nom: "%" + nom, ...r });
      }
    }
    return [...vus.values()].sort((a, b) => a.i - b.i || (a.haut ? 1 : -1));
  }

  /* ---------------- Décodage d'une instruction ---------------- */

  function decoder(brute, resoudre, symboles) {
    const { ligne, mn } = brute;
    const textes = brute.args ? decouperArgs(brute.args) : [];
    if (textes.some((t) => !t)) throw erreur("Opérande manquant : vérifier les virgules", ligne);
    const nb = textes.length;
    const ins = { ligne, mn };

    const exiger = (n) => {
      const liste = [].concat(n);
      if (!liste.includes(nb)) {
        const attendu = liste.map((x) => x + (x > 1 ? " opérandes" : " opérande")).join(" ou ");
        throw erreur("« " + mn + " » attend " + attendu + " (" + nb + " donné" + (nb > 1 ? "s" : "") + ")", ligne);
      }
    };

    /* ---- Sauts et appels ---- */
    if (mn in CONDITIONS || mn === "call" || mn === "callq" || mn === "jmpq") {
      exiger(1);
      const cible = textes[0];
      if (cible.startsWith("*")) throw erreur("Les sauts indirects (*) ne sont pas pris en charge", ligne);
      if (!/^[A-Za-z_.][\w.$]*$/.test(cible)) throw erreur("« " + mn + " » attend un nom d'étiquette, pas « " + cible + " »", ligne);
      const sym = symboles.get(cible);
      if (!sym) throw erreur("Étiquette inconnue : " + cible, ligne);
      if (sym.section !== "text") throw erreur("« " + cible + " » est une donnée : un saut doit viser une étiquette de .text", ligne);
      const destination = sym.decal;
      if (mn === "call" || mn === "callq") {
        ins.f = (m) => { m.empiler(BigInt(CODE_BASE + m.ip + 1)); m.saut = destination; };
      } else {
        const condition = CONDITIONS[mn === "jmpq" ? "jmp" : mn];
        ins.saut = true;
        ins.f = (m) => { if (condition(m.drapeaux)) m.saut = destination; };
      }
      return ins;
    }

    if (SANS_OPERANDE.has(mn)) {
      exiger(0);
      ins.f = INSTRUCTIONS_SIMPLES[mn];
      return ins;
    }

    const ops = textes.map((t) => operande(t, resoudre, ligne));

    /* ---- Extensions movs?? / movz?? ---- */
    let m = /^mov([sz])([bwl])([wlq])$/.exec(mn);
    if (m) {
      const ts = SUFFIXE[m[2]], td = SUFFIXE[m[3]];
      if (td <= ts || (m[1] === "z" && ts === 4)) {
        throw erreur("« " + mn + " » n'existe pas" + (mn === "movzlq" ? " : utiliser movl (la moitié haute est mise à 0)" : ""), ligne);
      }
      exiger(2);
      const [s, d] = ops;
      if (s.k === "imm") throw erreur("La source de « " + mn + " » ne peut pas être une valeur immédiate", ligne);
      if (d.k !== "reg") throw erreur("La destination de « " + mn + " » doit être un registre", ligne);
      verifierReg(s, ts, mn, ligne);
      verifierReg(d, td, mn, ligne);
      const avecSigne = m[1] === "s";
      ins.f = (mc) => {
        const v = mc.lire(s, ts);
        mc.ecrire(d, td, avecSigne ? signe(v, ts) & MASQUE[td] : v);
      };
      return ins;
    }

    /* ---- Familles à suffixe ---- */
    let base = null, taille = null;
    if (FAMILLES.has(mn)) base = mn;
    else if (mn === "movabsq" || mn === "movabs") { base = "mov"; taille = 8; }
    else if (SUFFIXE[mn.slice(-1)] && FAMILLES.has(mn.slice(0, -1))) { base = mn.slice(0, -1); taille = SUFFIXE[mn.slice(-1)]; }

    if (!base) {
      const conseil = EQUIVALENTS[mn] ? " — en syntaxe AT&T : " + EQUIVALENTS[mn] : "";
      throw erreur("Instruction inconnue : « " + mn + " »" + conseil, ligne);
    }
    ins.base = base;

    const estDecalage = ["sal", "shl", "sar", "shr"].includes(base);
    const pourTaille = ops.filter((o, n) => o.k === "reg" && !(estDecalage && nb === 2 && n === 0) && !(base === "lea" && n === 0));

    if (taille === null) {
      if (base === "push" || base === "pop") taille = 8;
      else if (pourTaille.length) taille = pourTaille[pourTaille.length - 1].r.t;
      else throw erreur("Taille ambiguë : ajouter un suffixe à « " + mn + " » (b, w, l ou q)", ligne);
    }
    for (const o of pourTaille) verifierReg(o, taille, mn, ligne);

    const t = taille;
    const [a, b, c] = ops;
    const pasImmediat = (o, role) => {
      if (o.k === "imm") throw erreur("La " + role + " de « " + mn + " » ne peut pas être une valeur immédiate (" + o.texte + ")", ligne);
    };
    const pasDeuxMemoires = () => {
      if (a.k === "mem" && b.k === "mem") {
        throw erreur("Deux opérandes mémoire dans « " + mn + " » : passer par un registre", ligne);
      }
    };

    switch (base) {
      case "mov":
        exiger(2); pasImmediat(b, "destination"); pasDeuxMemoires();
        ins.f = (mc) => mc.ecrire(b, t, mc.lire(a, t));
        break;

      case "add": case "sub": case "cmp": case "and": case "or": case "xor": case "test": {
        exiger(2); pasImmediat(b, "destination"); pasDeuxMemoires();
        const op = base;
        ins.f = (mc) => {
          const x = mc.lire(b, t), y = mc.lire(a, t);
          let r;
          if (op === "add") { r = mc.drapeauxAddition(x, y, t); }
          else if (op === "sub" || op === "cmp") { r = mc.drapeauxSoustraction(x, y, t); }
          else {
            r = op === "and" || op === "test" ? x & y : op === "or" ? x | y : x ^ y;
            mc.drapeauxLogiques(r, t);
          }
          if (op !== "cmp" && op !== "test") mc.ecrire(b, t, r);
        };
        break;
      }

      case "inc": case "dec": case "neg": case "not": {
        exiger(1); pasImmediat(a, "destination");
        const op = base;
        ins.f = (mc) => {
          const x = mc.lire(a, t);
          let r;
          if (op === "not") r = ~x & MASQUE[t];
          else if (op === "neg") {
            r = mc.drapeauxSoustraction(0n, x, t);
          } else {
            const cf = mc.drapeaux.cf;
            r = op === "inc" ? mc.drapeauxAddition(x, 1n, t) : mc.drapeauxSoustraction(x, 1n, t);
            mc.drapeaux.cf = cf;
          }
          mc.ecrire(a, t, r);
        };
        break;
      }

      case "sal": case "shl": case "sar": case "shr": {
        exiger([1, 2]);
        const dest = nb === 2 ? b : a;
        const nbre = nb === 2 ? a : null;
        pasImmediat(dest, "destination");
        if (nbre && nbre.k === "mem") throw erreur("Le nombre de décalages doit être une valeur immédiate ou %cl", ligne);
        if (nbre && nbre.k === "reg" && !(nbre.r.i === 2 && nbre.r.t === 1 && !nbre.r.haut)) {
          throw erreur("Le nombre de décalages doit être dans %cl (et non " + nbre.texte + ")", ligne);
        }
        const op = base;
        ins.f = (mc) => {
          const n = (nbre ? mc.lire(nbre, 1) : 1n) & (t === 8 ? 63n : 31n);
          if (n === 0n) return;
          const x = mc.lire(dest, t);
          const bits = BigInt(8 * t);
          let r, cf;
          if (op === "sal" || op === "shl") {
            r = (x << n) & MASQUE[t];
            cf = n <= bits ? ((x >> (bits - n)) & 1n) === 1n : false;
          } else if (op === "shr") {
            r = x >> n;
            cf = ((x >> (n - 1n)) & 1n) === 1n;
          } else {
            const sx = signe(x, t);
            r = (sx >> n) & MASQUE[t];
            cf = ((sx >> (n - 1n)) & 1n) === 1n;
          }
          mc.drapeauxLogiques(r, t);
          mc.drapeaux.cf = cf;
          if (n === 1n) {
            mc.drapeaux.of = op === "sar" ? false
              : op === "shr" ? (x & SIGNE[t]) !== 0n
              : ((r & SIGNE[t]) !== 0n) !== cf;
          }
          mc.ecrire(dest, t, r);
        };
        break;
      }

      case "imul":
        exiger([1, 2, 3]);
        if (nb === 1) {
          if (a.k === "imm") throw erreur("« " + mn + " » à un opérande n'accepte pas de valeur immédiate : placer d'abord la valeur dans un registre", ligne);
          ins.f = (mc) => mc.multiplier(a, t, true);
        } else {
          const src = nb === 2 ? a : b;
          const dest = nb === 2 ? b : c;
          if (nb === 3 && a.k !== "imm") throw erreur("Le premier opérande de « " + mn + " » à trois opérandes doit être une valeur immédiate", ligne);
          if (nb === 3 && b.k === "imm") throw erreur("Le deuxième opérande de « " + mn + " » ne peut pas être une valeur immédiate", ligne);
          if (dest.k !== "reg") throw erreur("La destination de « " + mn + " » doit être un registre", ligne);
          if (t === 1) throw erreur("« imul » à plusieurs opérandes n'existe pas sur 1 octet", ligne);
          ins.f = (mc) => {
            const x = signe(nb === 2 ? mc.lire(dest, t) : mc.lire(a, t), t);
            const r = x * signe(mc.lire(src, t), t);
            const tronque = r & MASQUE[t];
            mc.drapeaux.cf = mc.drapeaux.of = signe(tronque, t) !== r;
            mc.ecrire(dest, t, tronque);
          };
        }
        break;

      case "mul":
        exiger(1);
        if (a.k === "imm") throw erreur("« " + mn + " » n'accepte pas de valeur immédiate : placer d'abord la valeur dans un registre", ligne);
        ins.f = (mc) => mc.multiplier(a, t, false);
        break;

      case "div": case "idiv": {
        exiger(1);
        if (a.k === "imm") throw erreur("« " + mn + " » n'accepte pas de valeur immédiate : placer d'abord le diviseur dans un registre", ligne);
        const avecSigne = base === "idiv";
        ins.f = (mc) => mc.diviser(a, t, avecSigne, mn);
        break;
      }

      case "push":
        exiger(1);
        if (t !== 8) throw erreur("« " + mn + " » : utiliser pushq (8 octets)", ligne);
        ins.f = (mc) => mc.empiler(mc.lire(a, 8));
        break;

      case "pop":
        exiger(1); pasImmediat(a, "destination");
        if (t !== 8) throw erreur("« " + mn + " » : utiliser popq (8 octets)", ligne);
        ins.f = (mc) => mc.ecrire(a, 8, mc.depiler());
        break;

      case "lea":
        exiger(2);
        if (a.k !== "mem") throw erreur("La source de « " + mn + " » doit être une adresse mémoire, par exemple 4(%rax)", ligne);
        if (b.k !== "reg") throw erreur("La destination de « " + mn + " » doit être un registre", ligne);
        if (t === 1) throw erreur("« leab » n'existe pas", ligne);
        ins.f = (mc) => mc.ecrire(b, t, mc.adresse(a) & MASQUE[t]);
        break;

      case "xchg":
        exiger(2); pasImmediat(a, "source"); pasImmediat(b, "destination"); pasDeuxMemoires();
        ins.f = (mc) => {
          const x = mc.lire(a, t), y = mc.lire(b, t);
          mc.ecrire(a, t, y);
          mc.ecrire(b, t, x);
        };
        break;
    }
    return ins;
  }

  function verifierReg(o, t, mn, ligne) {
    if (o.k !== "reg" || o.r.t === t) return;
    const lettre = SUFFIXE[mn.slice(-1)] ? mn.slice(-1) : null;
    const debut = lettre && /[bwlq]$/.test(mn) && !FAMILLES.has(mn)
      ? "« " + mn + " » travaille sur " + octets(t)
      : "« " + mn + " » mélange des tailles";
    throw erreur(debut + " mais " + o.texte + " fait " + octets(o.r.t) + " (utiliser " + nomRegistre(o.r.i, t) + " ou le suffixe " + LETTRE[o.r.t] + ")", ligne);
  }

  function nomRegistre(i, t) {
    const n64 = NOMS64[i];
    for (const [nom, r] of Object.entries(REG)) {
      if (r.i === i && r.t === t && !r.haut) return "%" + nom;
    }
    return "%" + n64;
  }

  function operande(texte, resoudre, ligne) {
    const t = texte.trim();
    if (t[0] === "$") {
      if (!t.slice(1).trim()) throw erreur("Valeur manquante après $", ligne);
      return { k: "imm", v: evaluer(t.slice(1), resoudre, ligne), texte: t };
    }
    if (t[0] === "%") {
      const r = REG[t.slice(1).toLowerCase()];
      if (!r || !/^%[a-z0-9]+$/i.test(t)) throw erreur("Registre inconnu : " + t, ligne);
      return { k: "reg", r, texte: t };
    }
    if (t[0] === "*") throw erreur("Les opérandes indirects (*) ne sont pas pris en charge", ligne);
    if (REG[t.toLowerCase()]) throw erreur("« " + t + " » : un registre s'écrit avec % (%" + t.toLowerCase() + ")", ligne);

    const p = t.indexOf("(");
    if (p < 0) return { k: "mem", disp: evaluer(t, resoudre, ligne), base: null, index: null, echelle: 1n, texte: t };

    if (!t.endsWith(")")) throw erreur("Opérande mémoire mal formé : « " + t + " »", ligne);
    const dispTexte = t.slice(0, p).trim();
    const dedans = t.slice(p + 1, -1).split(",").map((x) => x.trim());
    if (dedans.length > 3) throw erreur("Trop d'éléments entre parenthèses : « " + t + " » (base, index, échelle)", ligne);

    const regAdresse = (x) => {
      if (!x) return null;
      const r = x[0] === "%" ? REG[x.slice(1).toLowerCase()] : null;
      if (!r) throw erreur("Registre attendu entre les parenthèses : « " + x + " » dans « " + t + " »", ligne);
      if (r.t < 4) throw erreur("« " + x + " » ne peut pas servir d'adresse : utiliser un registre de 4 ou 8 octets (" + nomRegistre(r.i, 8) + ")", ligne);
      return r;
    };
    const base = regAdresse(dedans[0]);
    const index = dedans.length > 1 ? regAdresse(dedans[1]) : null;
    let echelle = 1n;
    if (dedans.length === 3) {
      if (!index) throw erreur("Échelle sans registre d'index : « " + t + " »", ligne);
      echelle = evaluer(dedans[2], resoudre, ligne);
      if (![1n, 2n, 4n, 8n].includes(echelle)) throw erreur("L'échelle doit valoir 1, 2, 4 ou 8 (et non " + dedans[2] + ")", ligne);
    }
    if (!base && !index) throw erreur("Adresse sans registre : « " + t + " »", ligne);
    if (base && index && base.t !== index.t) throw erreur("Base et index de tailles différentes dans « " + t + " »", ligne);
    if (index && index.i === I_RSP) throw erreur("%rsp ne peut pas servir d'index", ligne);

    return {
      k: "mem",
      disp: dispTexte ? evaluer(dispTexte, resoudre, ligne) : 0n,
      base, index, echelle, texte: t
    };
  }

  const INSTRUCTIONS_SIMPLES = {
    nop: () => {},
    cbtw: (m) => m.ecrireReg(regA(2), signe(m.lireReg(regA(1)), 1) & MASQUE[2]),
    cwtl: (m) => m.ecrireReg(regA(4), signe(m.lireReg(regA(2)), 2) & MASQUE[4]),
    cltq: (m) => m.ecrireReg(regA(8), signe(m.lireReg(regA(4)), 4) & MASQUE[8]),
    cwtd: (m) => m.ecrireReg(regD(2), m.lireReg(regA(2)) & SIGNE[2] ? MASQUE[2] : 0n),
    cltd: (m) => m.ecrireReg(regD(4), m.lireReg(regA(4)) & SIGNE[4] ? MASQUE[4] : 0n),
    cqto: (m) => m.ecrireReg(regD(8), m.lireReg(regA(8)) & SIGNE[8] ? MASQUE[8] : 0n),
    ret: (m) => m.retour(),
    retq: (m) => m.retour(),
    leave: (m) => { m.registres[I_RSP] = m.registres[I_RBP]; m.registres[I_RBP] = m.depiler(); },
    leaveq: (m) => { m.registres[I_RSP] = m.registres[I_RBP]; m.registres[I_RBP] = m.depiler(); }
  };

  /* =============================================================
     EXÉCUTION
     ============================================================= */

  class Machine {
    constructor(programme) {
      this.programme = programme;
      this.code = programme.code;
      this.rodata = programme.sections.rodata;
      this.memoire = new Uint8Array(MEM_TAILLE);
      for (const bloc of programme.initial) this.memoire.set(bloc.octets, bloc.adresse);
      this.registres = new Array(16).fill(0n);
      this.drapeaux = { cf: false, zf: false, sf: false, of: false };
      this.registres[I_RSP] = BigInt(MEM_TAILLE);
      this.empiler(RETOUR_FIN);
      this.ip = programme.depart;
      this.pas = 0;
      this.saut = null;
      this.fini = false;
    }

    /* ---- Registres ---- */
    lireReg(r) {
      const v = this.registres[r.i];
      return r.haut ? (v >> 8n) & 0xffn : v & MASQUE[r.t];
    }
    ecrireReg(r, v) {
      if (r.haut) {
        this.registres[r.i] = (this.registres[r.i] & ~0xff00n) | ((v & 0xffn) << 8n);
      } else if (r.t >= 4) {
        this.registres[r.i] = v & MASQUE[r.t];
      } else {
        this.registres[r.i] = (this.registres[r.i] & ~MASQUE[r.t]) | (v & MASQUE[r.t]);
      }
    }

    /* ---- Mémoire ---- */
    verifierAdresse(adr, t, ecriture) {
      if (adr < BigInt(MEM_DEBUT) || adr + BigInt(t) > BigInt(MEM_TAILLE)) {
        throw erreur("Erreur de segmentation : accès à l'adresse " + adr.toString() +
          (adr < 4096n ? " (valeur utilisée comme adresse ? il manque peut-être un $)" : ""));
      }
      const a = Number(adr);
      if (ecriture && a < this.rodata.fin && a + t > this.rodata.debut) {
        throw erreur("Erreur de segmentation : écriture dans .rodata (lecture seule) à l'adresse " + a);
      }
      return a;
    }
    lireMem(adr, t) {
      const a = this.verifierAdresse(adr, t, false);
      let v = 0n;
      for (let o = t - 1; o >= 0; o--) v = (v << 8n) | BigInt(this.memoire[a + o]);
      return v;
    }
    ecrireMem(adr, t, v) {
      const a = this.verifierAdresse(adr, t, true);
      for (let o = 0; o < t; o++) this.memoire[a + o] = Number((v >> BigInt(8 * o)) & 0xffn);
    }

    adresse(o) {
      let a = o.disp;
      if (o.base) a += this.lireReg(o.base);
      if (o.index) a += this.lireReg(o.index) * o.echelle;
      const court = (o.base || o.index) && (o.base || o.index).t === 4;
      return a & (court ? MASQUE[4] : MASQUE[8]);
    }

    /* ---- Opérandes ---- */
    lire(o, t) {
      if (o.k === "imm") return o.v & MASQUE[t];
      if (o.k === "reg") return this.lireReg(o.r);
      return this.lireMem(this.adresse(o), t);
    }
    ecrire(o, t, v) {
      v &= MASQUE[t];
      if (o.k === "reg") this.ecrireReg(o.r, v);
      else this.ecrireMem(this.adresse(o), t, v);
    }

    /* ---- Pile ---- */
    empiler(v) {
      this.registres[I_RSP] = (this.registres[I_RSP] - 8n) & MASQUE[8];
      this.ecrireMem(this.registres[I_RSP], 8, v & MASQUE[8]);
    }
    depiler() {
      const v = this.lireMem(this.registres[I_RSP], 8);
      this.registres[I_RSP] = (this.registres[I_RSP] + 8n) & MASQUE[8];
      return v;
    }
    retour() {
      const v = this.depiler();
      if (v === RETOUR_FIN) { this.fini = true; return; }
      const cible = Number(v) - CODE_BASE;
      if (cible < 0 || cible > this.code.length) throw erreur("ret vers une adresse invalide (" + v + ") : la pile est désordonnée");
      this.saut = cible;
    }

    /* ---- Drapeaux ---- */
    drapeauxAddition(x, y, t) {
      const brut = x + y;
      const r = brut & MASQUE[t];
      const f = this.drapeaux;
      f.cf = brut > MASQUE[t];
      f.zf = r === 0n;
      f.sf = (r & SIGNE[t]) !== 0n;
      f.of = ((x & SIGNE[t]) === (y & SIGNE[t])) && ((r & SIGNE[t]) !== (x & SIGNE[t]));
      return r;
    }
    drapeauxSoustraction(x, y, t) {
      const r = (x - y) & MASQUE[t];
      const f = this.drapeaux;
      f.cf = x < y;
      f.zf = r === 0n;
      f.sf = (r & SIGNE[t]) !== 0n;
      f.of = ((x & SIGNE[t]) !== (y & SIGNE[t])) && ((r & SIGNE[t]) !== (x & SIGNE[t]));
      return r;
    }
    drapeauxLogiques(r, t) {
      const f = this.drapeaux;
      f.cf = false;
      f.of = false;
      f.zf = (r & MASQUE[t]) === 0n;
      f.sf = (r & SIGNE[t]) !== 0n;
    }

    /* ---- Multiplication et division ---- */
    multiplier(source, t, avecSigne) {
      const s = this.lire(source, t);
      const acc = this.lireReg(regA(t));
      const produit = avecSigne ? signe(acc, t) * signe(s, t) : acc * s;
      const bits = BigInt(8 * t);
      const bas = produit & MASQUE[t];
      const haut = (produit >> bits) & MASQUE[t];
      if (t === 1) this.ecrireReg(regA(2), produit & MASQUE[2]);
      else { this.ecrireReg(regA(t), bas); this.ecrireReg(regD(t), haut); }
      const deborde = avecSigne ? signe(bas, t) !== produit : haut !== 0n;
      this.drapeaux.cf = this.drapeaux.of = deborde;
    }

    diviser(source, t, avecSigne, mn) {
      const bits = BigInt(8 * t);
      const diviseur = this.lire(source, t);
      if (diviseur === 0n) throw erreur("Division par zéro dans « " + mn + " »");
      let dividende = t === 1
        ? this.lireReg(regA(2))
        : (this.lireReg(regD(t)) << bits) | this.lireReg(regA(t));
      let q, r;
      if (avecSigne) {
        dividende = BigInt.asIntN(Number(bits) * 2, dividende);
        const d = signe(diviseur, t);
        q = dividende / d;
        r = dividende % d;
        if (q !== signe(q & MASQUE[t], t)) throw erreur(depassementDivision(mn, t, true));
      } else {
        q = dividende / diviseur;
        r = dividende % diviseur;
        if (q > MASQUE[t]) throw erreur(depassementDivision(mn, t, false));
      }
      if (t === 1) { this.ecrireReg(regA(1), q & MASQUE[1]); this.ecrireReg(REG_AH, r & MASQUE[1]); }
      else { this.ecrireReg(regA(t), q & MASQUE[t]); this.ecrireReg(regD(t), r & MASQUE[t]); }
    }

    /* ---- Boucle principale ---- */
    executer(pasMax) {
      const limite = pasMax || PAS_MAX;
      while (!this.fini && this.ip >= 0 && this.ip < this.code.length) {
        const ins = this.code[this.ip];
        if (++this.pas > limite) {
          throw erreur("Plus de " + limite.toLocaleString("fr-FR") + " instructions exécutées : le programme ne s'arrête pas (boucle infinie ?)", ins.ligne);
        }
        this.saut = null;
        try {
          ins.f(this);
        } catch (e) {
          if (e.erreurCode && !e.ligne) e.ligne = ins.ligne;
          throw e;
        }
        this.ip = this.saut !== null ? this.saut : this.ip + 1;
      }
      return this;
    }

    /* ---- Accès par clé : "%eax", "x", "tab[2]", "s+4:l" ---- */
    cible(cle) {
      const texte = String(cle).trim();
      if (texte[0] === "%") {
        const r = REG[texte.slice(1).toLowerCase()];
        if (!r) throw new Error("Registre inconnu dans le test : " + texte);
        return { registre: r, t: r.t, nom: texte };
      }
      const m = /^([A-Za-z_.][\w.$]*)(?:\[(\d+)\])?(?:\+(\d+))?(?::([bwlq]))?$/.exec(texte);
      if (!m) throw new Error("Clé de test invalide : " + texte);
      const sym = this.programme.symboles.get(m[1]);
      if (!sym || sym.section === "text") {
        throw erreur("Variable « " + m[1] + " » introuvable");
      }
      const t = m[4] ? SUFFIXE[m[4]] : sym.taille || 4;
      const adresse = sym.adresse + Number(m[2] || 0) * t + Number(m[3] || 0);
      return { adresse, t, sym, nom: texte };
    }

    lireCle(cle) {
      const c = this.cible(cle);
      return c.registre ? this.lireReg(c.registre) : this.lireMem(BigInt(c.adresse), c.t);
    }

    lireChaine(cle) {
      const c = this.cible(cle);
      let s = "";
      for (let a = c.adresse; a < MEM_TAILLE && this.memoire[a] !== 0 && s.length < 200; a++) s += String.fromCharCode(this.memoire[a]);
      return s;
    }

    poser(cle, valeur) {
      const c = this.cible(cle);
      if (typeof valeur === "string" && !/^-?(0x[0-9a-f]+|\d+)$/i.test(valeur) && valeur.length !== 1) {
        const codes = [...valeur].map((ch) => ch.charCodeAt(0) & 255).concat(0);
        this.memoire.set(codes, c.adresse);
        return;
      }
      const liste = Array.isArray(valeur) ? valeur : [valeur];
      liste.forEach((v, n) => {
        const b = versBigInt(v) & MASQUE[c.t];
        if (c.registre) this.ecrireReg(c.registre, b);
        else this.ecrireMem(BigInt(c.adresse + n * c.t), c.t, b);
      });
    }
  }

  function depassementDivision(mn, t, avecSigne) {
    const avant = t === 8 ? (avecSigne ? "cqto" : "%rdx à 0") : t === 4 ? (avecSigne ? "cltd" : "%edx à 0") : t === 2 ? (avecSigne ? "cwtd" : "%dx à 0") : (avecSigne ? "cbtw" : "%ah à 0");
    return "Dépassement dans « " + mn + " » : le quotient ne tient pas sur " + octets(t) +
      ". Le dividende doit être préparé avant la division (" + avant + ").";
  }

  function versBigInt(v) {
    if (typeof v === "bigint") return v;
    if (typeof v === "number") return BigInt(Math.trunc(v));
    if (typeof v === "boolean") return v ? 1n : 0n;
    const s = String(v);
    if (s.length === 1 && !/\d/.test(s)) return BigInt(s.charCodeAt(0));
    return s.startsWith("-") ? -BigInt(s.slice(1)) : BigInt(s);
  }

  /* ---------------- Affichage d'une valeur ---------------- */

  function formater(v, t, nonSigne) {
    const brut = BigInt(v) & MASQUE[t];
    const s = signe(brut, t);
    if (nonSigne || s >= 0n) return brut.toString();
    return s.toString();
  }

  const AsmX86 = {
    assembler,
    machine: (programme) => new Machine(programme),
    formater,
    versBigInt,
    MASQUE,
    NOMS64,
    REG
  };

  if (typeof module !== "undefined" && module.exports) module.exports = AsmX86;
  racine.AsmX86 = AsmX86;
})(typeof window !== "undefined" ? window : globalThis);
