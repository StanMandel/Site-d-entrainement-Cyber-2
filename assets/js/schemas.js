/* =============================================================
   Schémas SVG des exercices (champ « schema » des problèmes)
   -------------------------------------------------------------
   Schemas.svg(spec) renvoie le code SVG (une chaîne) du schéma
   décrit par spec.type :
     - "spectre"       : raies d'un analyseur de spectre ;
     - "am"            : signal modulé en amplitude (oscillogramme) ;
     - "fm"            : signal modulant et signal modulé en fréquence ;
     - "numerique"     : chronogramme ASK / OOK / FSK / PSK sur grille ;
     - "constellation" : points d'une constellation dans le plan IQ ;
     - "trame"         : niveaux d'une ligne série (UART, RS-232) ;
     - "bus"           : câblage d'un bus I2C ou SPI (champ protocole) ;
     - "chaine"        : blocs reliés par des flèches ;
     - "courbes"       : courbes de croissance f(n), c·g(n), rang n₀, zone ;
     - "grille"        : cases (i, j) parcourues par deux boucles imbriquées ;
     - "arbre"         : arbre des appels d'une fonction récursive ;
     - "sauts"         : valeurs successives d'un compteur sur une droite ;
     - "barres"        : barres horizontales comparées (échelle log possible).
   Aucune couleur en dur : les classes sch-* de style.css lisent les
   jetons du thème courant. Pas de DOM : utilisable sous Node.
   ============================================================= */

const Schemas = (() => {
  let compteur = 0;

  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const r1 = (v) => Math.round(v * 10) / 10;
  /* Nombre écrit à la française : 0.6 → « 0,6 ». */
  const fr = (v) => String(v).replace(".", ",");

  const texte = (x, y, s, classe = "sch-txt", ancre = "middle") =>
    `<text x="${r1(x)}" y="${r1(y)}" class="${classe}" text-anchor="${ancre}">${esc(s)}</text>`;
  const trait = (x1, y1, x2, y2, classe, fleche) =>
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${classe}"${fleche ? ' marker-end="POINTE"' : ""}/>`;
  const double = (x1, y1, x2, y2, classe) =>
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${classe}" marker-start="POINTE" marker-end="POINTE"/>`;
  const chemin = (points, classe) =>
    `<path d="M${points.map((p) => r1(p[0]) + " " + r1(p[1])).join(" L")}" class="${classe}"/>`;
  const boite = (x, y, l, h, classe = "sch-boite") =>
    `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(l)}" height="${r1(h)}" class="${classe}"/>`;

  /* Enveloppe commune : viewBox, pointe de flèche propre à ce SVG. */
  function cadre(largeur, hauteur, contenu, titre) {
    const id = "sch-pointe-" + (++compteur);
    return `<svg class="sch" viewBox="0 0 ${r1(largeur)} ${r1(hauteur)}" style="max-width:${r1(largeur * 1.3)}px" role="img" aria-label="${esc(titre || "Schéma")}" xmlns="http://www.w3.org/2000/svg">`
      + `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">`
      + `<path d="M0 0 L10 5 L0 10 z" class="sch-pointe"/></marker></defs>`
      + contenu.replace(/POINTE/g, `url(#${id})`) + "</svg>";
  }

  /* Échantillonne f sur [0, 1] et place les points dans le rectangle donné. */
  function courbe(f, n, x0, largeur, yMilieu, echelle) {
    const pts = [];
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      pts.push([x0 + t * largeur, yMilieu - f(t) * echelle]);
    }
    return pts;
  }

  /* Écran d'oscilloscope : fond et graduations. */
  function ecran(x, y, l, h, divX, divY) {
    let s = boite(x, y, l, h, "sch-ecran");
    for (let i = 1; i < divX; i++) s += trait(x + i * l / divX, y, x + i * l / divX, y + h, "sch-grille");
    for (let j = 1; j < divY; j++) s += trait(x, y + j * h / divY, x + l, y + j * h / divY, "sch-grille");
    return s;
  }

  /* ---------------- Spectre ---------------- */
  function spectre(s) {
    const L = 560, H = 250, g = 58, d = 26, h = 24, b = 46;
    const raies = s.raies || [];
    const fs = raies.map((r) => r.f);
    const amax = Math.max(...raies.map((r) => r.a));
    const fmin = Math.min(...fs), fmax = Math.max(...fs);
    const marge = (fmax - fmin) * 0.45 || 1;
    const X = (f) => g + 24 + (f - fmin + marge) / (fmax - fmin + 2 * marge) * (L - g - d - 48);
    const Y = (a) => H - b - a / (amax * 1.2) * (H - b - h);
    let c = "";
    c += trait(g, H - b, L - d, H - b, "sch-axe", true);
    c += trait(g, H - b, g, h - 6, "sch-axe", true);
    c += texte(L - d, H - b + 34, "f (" + (s.unite || "kHz") + ")", "sch-txt sch-txt-doux", "end");
    c += texte(g + 8, h + 4, s.uniteY || "", "sch-txt sch-txt-doux", "start");
    const deja = new Set();
    for (const r of raies) {
      c += trait(g, Y(r.a), X(r.f), Y(r.a), "sch-cote");
      c += trait(X(r.f), H - b, X(r.f), Y(r.a), "sch-raie");
      c += `<circle cx="${r1(X(r.f))}" cy="${r1(Y(r.a))}" r="3.5" class="sch-point"/>`;
      c += texte(X(r.f), H - b + 18, r.etiquette !== undefined ? r.etiquette : fr(r.f));
      if (!deja.has(r.a)) { deja.add(r.a); c += texte(g - 8, Y(r.a) + 4, fr(r.a), "sch-txt", "end"); }
    }
    return cadre(L, H, c, "Spectre");
  }

  /* ---------------- Signal AM ---------------- */
  function am(s) {
    const L = 560, H = 270, g = 70, d = 16, h = 14, b = 14;
    const A = s.A ?? 1, m = s.m, cycles = s.cycles ?? 40, periodes = s.periodes ?? 2;
    const amax = A * (1 + m), amin = A * (1 - m);
    const l = L - g - d, yM = (H + h - b) / 2, ech = (H - h - b) / 2 / (amax * 1.12);
    const env = (t) => A * (1 + m * Math.cos(2 * Math.PI * periodes * t));
    let c = s.grille === false ? "" : ecran(g, h, l, H - h - b, 10, 8);
    c += trait(g, yM, g + l, yM, "sch-axe");
    c += chemin(courbe((t) => env(t) * Math.cos(2 * Math.PI * cycles * t), cycles * 28, g, l, yM, ech), "sch-trace");
    if (s.enveloppe !== false) {
      c += chemin(courbe(env, 200, g, l, yM, ech), "sch-enveloppe");
      c += chemin(courbe((t) => -env(t), 200, g, l, yM, ech), "sch-enveloppe");
    }
    const et = s.etiquettes || {};
    if (s.cotes === "crete") {
      for (const [v, lib] of [[amax, et.max], [amin, et.min], [-amin, et.minNeg], [-amax, et.maxNeg]]) {
        c += trait(g, yM - v * ech, g + l, yM - v * ech, "sch-cote");
        if (lib) c += texte(g - 8, yM - v * ech + 4, lib, "sch-txt", "end");
      }
    }
    if (s.cotes === "cc") {
      /* Flèches crête à crête sur un maximum puis un minimum de l'enveloppe. */
      const tMax = 1 / periodes, tMin = 1.5 / periodes;
      for (const [t, v, lib] of [[tMax, amax, et.max], [tMin, amin, et.min]]) {
        const x = g + Math.min(t, 0.97) * l;
        c += double(x, yM - v * ech, x, yM + v * ech, "sch-cote-forte");
        if (lib) c += texte(x + 7, yM - 6, lib, "sch-txt sch-txt-fort sch-halo", "start");
      }
    }
    if (s.echelle) c += texte(g + l, H - 2, s.echelle, "sch-txt sch-txt-doux", "end");
    return cadre(L, H, c, "Signal modulé en amplitude");
  }

  /* ---------------- Signal FM ---------------- */
  function fm(s) {
    const L = 560, H = 290, g = 52, d = 16;
    const cycles = s.cycles ?? 30, periodes = s.periodes ?? 2, beta = s.beta ?? 6;
    const l = L - g - d;
    let c = "";
    const y1 = 58, y2 = 190;
    c += trait(g, y1, g + l, y1, "sch-axe");
    c += trait(g, y2, g + l, y2, "sch-axe");
    c += texte(g - 8, y1 + 4, s.nomModulant || "sᵢ(t)", "sch-txt", "end");
    c += texte(g - 8, y2 + 4, s.nomModule || "s(t)", "sch-txt", "end");
    c += chemin(courbe((t) => Math.cos(2 * Math.PI * periodes * t), 240, g, l, y1, 34), "sch-modulant");
    const phase = (t) => 2 * Math.PI * cycles * t + beta * Math.sin(2 * Math.PI * periodes * t);
    c += chemin(courbe((t) => Math.cos(phase(t)), cycles * 40, g, l, y2, 72), "sch-trace");
    return cadre(L, H, c, "Signal modulé en fréquence");
  }

  /* ---------------- Chronogramme ASK / OOK / FSK / PSK ---------------- */
  function numerique(s) {
    const bits = String(s.bits).split("");
    const cpb = s.carreauxParBit ?? 2;
    const nCar = bits.length * cpb;
    const car = Math.min(28, 540 / nCar);
    const g = 20, d = 16, yEnt = 10, hEnt = 26;
    const l = nCar * car;
    const haut = yEnt + hEnt + 10, hGrille = 8 * car;
    const yM = haut + hGrille / 2, ech = hGrille / 2 * 0.86;
    const L = g + l + d, H = haut + hGrille + (s.echelle ? 30 : 12);
    let c = "";

    if (s.entete !== false) {
      const modele = s.entete === true || s.entete === undefined ? bits.join("") : String(s.entete);
      bits.forEach((_, k) => {
        const x = g + k * cpb * car;
        c += boite(x, yEnt, cpb * car, hEnt, "sch-case");
        const v = modele[k];
        if (v && v !== "?" && v !== " ") c += texte(x + cpb * car / 2, yEnt + hEnt / 2 + 5, v, "sch-txt sch-txt-fort");
      });
    }
    c += ecran(g, haut, l, hGrille, nCar, 8);
    c += trait(g, yM, g + l + 10, yM, "sch-axe", true);

    /* cycles de porteuse par bit : un nombre, ou { 0: c0, 1: c1 } en FSK */
    const mod = s.modulation;
    const E = s.E || (mod === "ook" ? { 0: 0, 1: 1 } : { 0: 0.4, 1: 1 });
    const cycles = s.cycles ?? (mod === "fsk" ? { 0: 2, 1: 4 } : 4);
    const cyclesDe = (bit) => (typeof cycles === "number" ? cycles : cycles[bit]);
    const pts = [];
    bits.forEach((bit, k) => {
      const x0 = g + k * cpb * car, lb = cpb * car, cb = cyclesDe(bit);
      let f;
      if (mod === "ask" || mod === "ook") f = (t) => E[bit] * Math.sin(2 * Math.PI * cb * t);
      else if (mod === "fsk") f = (t) => Math.sin(2 * Math.PI * cb * t);
      else {
        const phi = (s.phases ? s.phases[k] : (bit === "1" ? 180 : 0)) * Math.PI / 180;
        f = (t) => Math.sin(2 * Math.PI * cb * t + phi);
      }
      const morceau = courbe(f, 40 * cb, x0, lb, yM, ech);
      if (k > 0) morceau.shift();
      pts.push(...morceau);
    });
    c += chemin(pts, "sch-trace");
    if (s.echelle) c += texte(g + l, H - 8, s.echelle, "sch-txt sch-txt-doux", "end");
    return cadre(L, H, c, "Chronogramme du signal modulé");
  }

  /* ---------------- Constellation ---------------- */
  function constellation(s) {
    const L = 340, H = 340, cx = 170, cy = 170, R = 112;
    const points = s.points || [];
    const rayon = s.rayon ?? Math.max(...points.map((p) => Math.hypot(p.i, p.q)), 1e-9);
    const X = (i) => cx + i / rayon * R, Y = (q) => cy - q / rayon * R;
    let c = "";
    /* Graduations : repères pointillés, valeurs reportées en bas et à
       gauche pour ne jamais recouvrir les points. */
    for (const [v, lib] of s.graduations || []) {
      c += trait(X(v), 24, X(v), H - 24, "sch-repere");
      c += trait(40, Y(v), L - 20, Y(v), "sch-repere");
      c += texte(X(v), H - 6, lib, "sch-txt sch-txt-doux");
      c += texte(36, Y(v) + 4, lib, "sch-txt sch-txt-doux", "end");
    }
    c += trait(40, cy, L - 14, cy, "sch-axe", true);
    c += trait(cx, H - 24, cx, 14, "sch-axe", true);
    c += texte(L - 16, cy - 8, "I", "sch-txt sch-txt-fort", "end");
    c += texte(cx + 8, 22, "Q", "sch-txt sch-txt-fort", "start");
    if (s.cercle !== false) c += `<circle cx="${cx}" cy="${cy}" r="${R}" class="sch-cote"/>`;
    for (const p of points) {
      const x = X(p.i), y = Y(p.q);
      c += `<circle cx="${r1(x)}" cy="${r1(y)}" r="5" class="sch-point"/>`;
      if (p.etiquette !== undefined) {
        /* Étiquette vers l'extérieur, tournée de 25° pour ne pas tomber sur un axe. */
        const a = (x === cx && y === cy ? -Math.PI / 4 : Math.atan2(cy - y, x - cx)) + 0.44;
        const dx = Math.cos(a), dy = -Math.sin(a);
        const ancre = dx > 0.3 ? "start" : dx < -0.3 ? "end" : "middle";
        c += texte(x + dx * 12, y + dy * 13 + 4, p.etiquette, "sch-txt sch-txt-fort sch-halo", ancre);
      }
    }
    return cadre(L, H, c, "Diagramme de constellation");
  }

  /* ---------------- Trame série ---------------- */
  function trame(s) {
    const segments = s.segments || [];
    const bits = segments.flatMap((seg) => String(seg.bits).split(""));
    const repos = s.repos ?? 1.2;
    const g = 72, d = 16;
    const cel = Math.min(36, 520 / (bits.length + 2 * repos));
    const l = (bits.length + 2 * repos) * cel;
    const yH = s.afficherBits === false ? 26 : 40, yB = yH + 70;
    const L = g + l + d, H = yB + (s.afficherRoles === false ? 20 : 72);
    const niveau = (b) => ((b === "1") !== !!s.inverse ? yH : yB);
    let c = "";
    const nv = s.niveaux || { haut: "+5 V", bas: "0 V" };
    c += trait(g - 4, yH, g + l, yH, "sch-grille");
    c += trait(g - 4, yB, g + l, yB, "sch-grille");
    c += texte(g - 10, yH + 4, nv.haut, "sch-txt", "end");
    c += texte(g - 10, yB + 4, nv.bas, "sch-txt", "end");
    for (let k = 0; k <= bits.length; k++) {
      const x = g + (repos + k) * cel;
      c += trait(x, yH - 12, x, yB + 6, "sch-repere");
    }
    const pts = [[g, niveau("1")], [g + repos * cel, niveau("1")]];
    bits.forEach((b, k) => {
      const x0 = g + (repos + k) * cel;
      pts.push([x0, niveau(b)], [x0 + cel, niveau(b)]);
    });
    const xFin = g + (repos + bits.length) * cel;
    pts.push([xFin, niveau("1")], [g + l, niveau("1")]);
    c += chemin(pts, "sch-trace sch-trace-forte");
    if (s.afficherBits !== false) {
      bits.forEach((b, k) => { c += texte(g + (repos + k + 0.5) * cel, yH - 16, b, "sch-txt sch-txt-fort"); });
    }
    if (s.afficherRoles !== false) {
      const yR = yB + 18;
      /* Chaque libellé va sur la première ligne où il ne chevauche pas
         le précédent (deux lignes possibles). */
      const finLigne = [-Infinity, -Infinity];
      const poser = (xc, lib) => {
        const demi = String(lib).length * 3.7 + 4;
        const rang = finLigne[0] <= xc - demi ? 0 : 1;
        finLigne[rang] = xc + demi;
        c += texte(xc, yR + 16 + rang * 15, lib, "sch-txt sch-txt-doux");
      };
      poser(g + repos * cel / 2, "repos");
      let k = 0;
      for (const seg of segments) {
        const n = String(seg.bits).length;
        const x0 = g + (repos + k) * cel + 3, x1 = g + (repos + k + n) * cel - 3;
        c += chemin([[x0, yR - 4], [x0, yR], [x1, yR], [x1, yR - 4]], "sch-accolade");
        if (seg.role) poser((x0 + x1) / 2, seg.role);
        k += n;
      }
      poser(xFin + repos * cel / 2, "repos");
    }
    return cadre(L, H, c, "Trame série");
  }

  /* ---------------- Bus I2C / SPI ---------------- */
  function bus(s) {
    const esclaves = s.esclaves || [];
    const n = esclaves.length;
    const spi = s.protocole === "spi";
    const lignes = spi ? ["SCLK", "MOSI", "MISO"] : ["VCC", "SDA", "SCL"];
    const gM = 20, lM = 110, hM = 40 + lignes.length * 22;
    const xDeb = gM + lM, pas = 118;
    const L = xDeb + 40 + n * pas, yL0 = 36, dy = 24;
    const yEsc = yL0 + lignes.length * dy + 30, hEsc = 50;
    const H = yEsc + hEsc + (spi ? 22 + n * 14 : 20);
    let c = "";
    c += boite(gM, yL0 - 16, lM, hM, "sch-boite sch-boite-forte");
    c += texte(gM + lM / 2, yL0 + 2, s.maitre || "Maître", "sch-txt sch-txt-fort");
    lignes.forEach((nom, j) => {
      const y = yL0 + 20 + j * dy;
      if (!spi && nom === "VCC") {
        c += trait(xDeb, y, L - 16, y, "sch-fil sch-fil-alim");
        c += texte(L - 14, y - 6, "VCC", "sch-txt sch-txt-doux", "end");
        return;
      }
      c += trait(xDeb, y, L - 16, y, "sch-fil");
      c += texte(xDeb - 6, y + 4, nom, "sch-txt", "end");
    });
    if (!spi) {
      /* Résistances de tirage de SDA et SCL vers VCC. */
      const yV = yL0 + 20;
      [1, 2].forEach((j, idx) => {
        const x = xDeb + 18 + idx * 22, y = yL0 + 20 + j * dy;
        c += trait(x, yV, x, y, "sch-fil sch-fil-fin");
        c += boite(x - 4, yV + 3, 8, 14, "sch-resistance");
        c += `<circle cx="${r1(x)}" cy="${r1(y)}" r="2.6" class="sch-noeud"/>`;
      });
      c += texte(xDeb + 29, yV - 7, "Rp", "sch-txt sch-txt-doux");
    }
    esclaves.forEach((e, k) => {
      const x = xDeb + 70 + k * pas;
      lignes.forEach((nom, j) => {
        if (!spi && nom === "VCC") return;
        const xx = x - 12 + j * 12, y = yL0 + 20 + j * dy;
        c += trait(xx, y, xx, yEsc, "sch-fil sch-fil-fin");
        c += `<circle cx="${r1(xx)}" cy="${r1(y)}" r="2.6" class="sch-noeud"/>`;
      });
      c += boite(x - 44, yEsc, 88, hEsc);
      c += texte(x, yEsc + 21, e.nom || "Esclave " + (k + 1), "sch-txt sch-txt-fort");
      if (e.detail) c += texte(x, yEsc + 38, e.detail, "sch-txt sch-txt-doux");
      if (spi) {
        const yS = yEsc + hEsc + 16 + k * 14;
        const xS = gM + 16 + k * 12;
        c += chemin([[xS, yL0 - 16 + hM], [xS, yS], [x + 30, yS], [x + 30, yEsc + hEsc]], "sch-fil sch-fil-fin sch-fil-ss");
        c += texte(x + 36, yS - 3, "SS" + (k + 1), "sch-txt sch-txt-doux", "start");
      }
    });
    return cadre(L, H, c, spi ? "Bus SPI" : "Bus I2C");
  }

  /* ---------------- Chaîne de blocs ---------------- */
  function chaine(s) {
    const blocs = (s.blocs || []).map((b) => String(b).split("\n"));
    const liens = s.liens || [];
    const larg = blocs.map((lg) => Math.max(...lg.map((t) => t.length)) * 7.3 + 22);
    const hB = 22 + Math.max(...blocs.map((lg) => lg.length)) * 16;
    /* L'espace entre deux blocs s'élargit pour contenir le libellé du lien. */
    const esp = blocs.slice(1).map((_, k) => Math.max(58, String(liens[k] || "").length * 7.3 + 20));
    const g = 10, y = 12;
    const L = g * 2 + larg.reduce((a, b) => a + b, 0) + esp.reduce((a, b) => a + b, 0);
    const H = y + hB + 12;
    let c = "", x = g;
    blocs.forEach((lg, k) => {
      c += boite(x, y, larg[k], hB, k === (s.accent ?? -1) ? "sch-boite sch-boite-forte" : "sch-boite");
      lg.forEach((t, j) => {
        c += texte(x + larg[k] / 2, y + hB / 2 + 5 + (j - (lg.length - 1) / 2) * 16, t, j === 0 ? "sch-txt sch-txt-fort" : "sch-txt sch-txt-doux");
      });
      x += larg[k];
      if (k < blocs.length - 1) {
        c += trait(x + 4, y + hB / 2, x + esp[k] - 4, y + hB / 2, "sch-axe", true);
        if (liens[k]) c += texte(x + esp[k] / 2, y + hB / 2 - 8, liens[k], "sch-txt sch-txt-doux");
        x += esp[k];
      }
    });
    return cadre(L, H, c, "Schéma de principe");
  }

  /* Étiquettes empilées sans chevauchement (positions y triées). */
  function ecarter(etiquettes, ecart, yMin, yMax) {
    const tri = etiquettes.slice().sort((a, b) => a.y - b.y);
    for (let k = 1; k < tri.length; k++) if (tri[k].y - tri[k - 1].y < ecart) tri[k].y = tri[k - 1].y + ecart;
    const debord = tri.length ? tri[tri.length - 1].y - yMax : 0;
    if (debord > 0) tri.forEach((e) => { e.y = Math.max(yMin, e.y - debord); });
    return tri;
  }

  /* ---------------- Courbes de croissance ----------------
     fonctions : [{ f: (n) => …, nom, style: 1-4, pointille }]
     xMin, xMax, yMax : fenêtre ; n0 : rang marqué en pointillé ;
     zone : { entre: [a, b] } | { dessous: a } | { dessus: a } (indices
     dans fonctions), à partir de zone.depuis (n0 par défaut). */
  function courbes(s) {
    const L = 560, H = 290, g = 46, d = 104, h = 16, b = 34;
    const x0 = s.xMin ?? 0, x1 = s.xMax ?? 10, N = 180;
    const fonctions = s.fonctions || [];
    const echant = fonctions.map((fn) => {
      const pts = [];
      for (let k = 0; k <= N; k++) {
        const x = x0 + (x1 - x0) * k / N;
        const y = fn.f(x);
        if (Number.isFinite(y)) pts.push([x, y]);
      }
      return pts;
    });
    const yMin = s.yMin ?? 0;
    const yMax = s.yMax ?? Math.max(1, ...echant.flat().map((p) => p[1])) * 1.05;
    const X = (x) => g + (x - x0) / (x1 - x0) * (L - g - d);
    const Y = (y) => H - b - (y - yMin) / (yMax - yMin) * (H - b - h);
    /* Coupe la courbe là où elle sort par le haut. */
    const visibles = echant.map((pts) => {
      const out = [];
      for (let k = 0; k < pts.length; k++) {
        const [x, y] = pts[k];
        if (y > yMax) {
          if (k > 0 && pts[k - 1][1] <= yMax) {
            const [xp, yp] = pts[k - 1];
            out.push([xp + (x - xp) * (yMax - yp) / (y - yp), yMax]);
          }
          break;
        }
        out.push([x, Math.max(yMin, y)]);
      }
      return out;
    });
    let c = "";
    const z = s.zone;
    if (z) {
      const depuis = z.depuis ?? s.n0 ?? x0;
      const garder = (pts) => pts.filter((p) => p[0] >= depuis);
      const plafond = (pts) => echant[pts].filter((p) => p[0] >= depuis).map(([x, y]) => [x, Math.min(yMax, Math.max(yMin, y))]);
      let poly = null;
      if (z.entre) {
        const a = plafond(z.entre[0]), bb = plafond(z.entre[1]);
        poly = a.concat(bb.reverse());
      } else if (z.dessous !== undefined) {
        const a = plafond(z.dessous);
        if (a.length) poly = a.concat([[a[a.length - 1][0], yMin], [a[0][0], yMin]]);
      } else if (z.dessus !== undefined) {
        const a = plafond(z.dessus);
        if (a.length) poly = a.concat([[a[a.length - 1][0], yMax], [a[0][0], yMax]]);
      }
      if (poly && garder(poly).length) c += `<path d="M${poly.map(([x, y]) => r1(X(x)) + " " + r1(Y(y))).join(" L")} Z" class="sch-zone"/>`;
    }
    c += trait(g, H - b, L - d + 30, H - b, "sch-axe", true);
    c += trait(g, H - b, g, h - 6, "sch-axe", true);
    c += texte(L - d + 30, H - b + 26, s.nomX || "n", "sch-txt sch-txt-doux", "end");
    if (s.nomY) c += texte(g + 8, h + 4, s.nomY, "sch-txt sch-txt-doux", "start");
    const pasX = s.pasX || (x1 - x0 <= 12 ? 1 : x1 - x0 <= 30 ? 5 : x1 - x0 <= 120 ? 20 : Math.pow(10, Math.floor(Math.log10(x1 - x0))));
    for (let x = Math.ceil(x0 / pasX) * pasX; x <= x1 + 1e-9; x += pasX) {
      c += trait(X(x), H - b, X(x), H - b + 4, "sch-axe");
      c += texte(X(x), H - b + 16, fr(Math.round(x * 100) / 100), "sch-txt sch-txt-doux");
    }
    if (s.n0 !== undefined) {
      c += trait(X(s.n0), H - b, X(s.n0), h, "sch-cote");
      c += texte(X(s.n0), H - b + 29, s.n0Texte || "n₀", "sch-txt sch-txt-fort");
    }
    const etiquettes = [];
    fonctions.forEach((fn, k) => {
      const pts = visibles[k];
      if (pts.length < 2) return;
      const style = fn.style || k + 1;
      c += chemin(pts.map(([x, y]) => [X(x), Y(y)]), "sch-courbe sch-c" + style + (fn.pointille ? " sch-pointille" : ""));
      const [xe, ye] = pts[pts.length - 1];
      if (fn.nom) etiquettes.push({ x: X(xe) + 6, y: Y(ye) + 4, nom: fn.nom, style });
    });
    for (const e of ecarter(etiquettes, 15, h + 4, H - b - 4)) c += texte(e.x, e.y, e.nom, "sch-txt sch-txt-fort sch-halo sch-t" + e.style, "start");
    return cadre(L, H, c, "Courbes");
  }

  /* ---------------- Grille des tours de deux boucles ----------------
     lignes × colonnes cases ; cases(i, j) → 0 (vide), 1 ou 2 (couleurs) ;
     nomI, nomJ : noms des compteurs ; debutI, debutJ : premières valeurs. */
  function grille(s) {
    const nl = s.lignes ?? s.n, nc = s.colonnes ?? s.n;
    const di = s.debutI ?? 0, dj = s.debutJ ?? 0;
    const t = Math.max(14, Math.min(30, 300 / Math.max(nl, nc)));
    const g = 58, haut = 40, droite = s.sommes === false ? 14 : 70;
    const L = g + nc * t + droite, H = haut + nl * t + (s.sommes === false ? 12 : 34);
    let c = texte(g + nc * t / 2, 14, (s.nomJ || "j") + " →", "sch-txt sch-txt-doux");
    let total = 0;
    for (let j = 0; j < nc; j++) c += texte(g + j * t + t / 2, haut - 8, String(dj + j), "sch-txt sch-txt-doux");
    for (let i = 0; i < nl; i++) {
      c += texte(g - 8, haut + i * t + t / 2 + 4, (s.nomI || "i") + " = " + (di + i), "sch-txt", "end");
      let somme = 0;
      for (let j = 0; j < nc; j++) {
        const v = Number(s.cases(di + i, dj + j)) || 0;
        if (v) somme++;
        c += boite(g + j * t + 1, haut + i * t + 1, t - 2, t - 2, v === 2 ? "sch-on2" : v ? "sch-on" : "sch-off");
      }
      total += somme;
      if (s.sommes !== false) c += texte(g + nc * t + 10, haut + i * t + t / 2 + 4, "→ " + somme, "sch-txt sch-txt-fort", "start");
    }
    if (s.sommes !== false) c += texte(g + nc * t + 10, haut + nl * t + 22, s.total || "total " + total, "sch-txt sch-txt-fort sch-t1", "start");
    return cadre(L, H, c, "Tours de boucles");
  }

  /* ---------------- Arbre des appels récursifs ----------------
     racine : valeur de départ ; enfants(v) → valeurs des appels lancés ;
     etiquette(v) → texte du nœud ; niveaux : nombre d'appels par niveau. */
  function arbre(s) {
    const etiquette = s.etiquette || ((v) => String(v));
    let compte = 0;
    const construire = (v, prof) => {
      if (++compte > 70) throw new Error("arbre trop grand pour être dessiné");
      const enf = prof < 7 ? (s.enfants(v) || []) : [];
      return { v, prof, enfants: enf.map((e) => construire(e, prof + 1)) };
    };
    const racine = construire(s.racine, 0);
    const parNiveau = [];
    let feuilles = 0;
    const placer = (nd) => {
      (parNiveau[nd.prof] = parNiveau[nd.prof] || []).push(nd);
      if (!nd.enfants.length) { nd.x = feuilles++; return; }
      nd.enfants.forEach(placer);
      nd.x = (nd.enfants[0].x + nd.enfants[nd.enfants.length - 1].x) / 2;
    };
    placer(racine);
    const largeurTexte = Math.max(...parNiveau.flat().map((nd) => etiquette(nd.v).length));
    const lb = Math.max(30, largeurTexte * 7.2 + 12), ecart = lb + 10, dy = 54;
    const droite = s.niveaux ? 96 : 12;
    const L = Math.max(200, 16 + feuilles * ecart + droite), H = 18 + parNiveau.length * dy;
    const X = (nd) => 12 + nd.x * ecart + lb / 2;
    const Y = (nd) => 14 + nd.prof * dy;
    let c = "";
    const traits = (nd) => nd.enfants.forEach((e) => { c += trait(X(nd), Y(nd) + 24, X(e), Y(e), "sch-axe"); traits(e); });
    traits(racine);
    for (const nd of parNiveau.flat()) {
      c += boite(X(nd) - lb / 2, Y(nd), lb, 24, nd.enfants.length ? "sch-boite" : "sch-boite sch-boite-forte");
      c += texte(X(nd), Y(nd) + 16, etiquette(nd.v), "sch-txt");
    }
    if (s.niveaux) parNiveau.forEach((niv, p) => {
      c += texte(L - 8, 14 + p * dy + 16, typeof s.niveaux === "function" ? s.niveaux(p, niv.length) : niv.length + (niv.length > 1 ? " appels" : " appel"), "sch-txt sch-txt-fort sch-t1", "end");
    });
    return cadre(L, H, c, "Arbre des appels");
  }

  /* ---------------- Sauts d'un compteur sur une droite ----------------
     valeurs : valeurs successives du compteur ; max : fin de la droite ;
     borne : { v, nom } la limite de la boucle ; pas : texte sur chaque saut. */
  function sauts(s) {
    const L = 560, H = 138, g = 24, d = 30, yA = 92;
    const max = s.max ?? Math.max(...s.valeurs) * 1.1;
    const X = (v) => g + v / max * (L - g - d);
    let c = trait(g, yA, L - d + 14, yA, "sch-axe", true);
    for (const v of s.graduations || []) {
      c += trait(X(v), yA - 3, X(v), yA + 3, "sch-axe");
      c += texte(X(v), yA + 30, fr(v), "sch-txt sch-txt-doux");
    }
    if (s.borne) {
      c += trait(X(s.borne.v), yA + 14, X(s.borne.v), 12, "sch-cote-forte");
      c += texte(X(s.borne.v), 10, s.borne.nom || "n", "sch-txt sch-txt-fort sch-halo");
    }
    s.valeurs.forEach((v, k) => {
      if (k > 0) {
        const a = X(s.valeurs[k - 1]), b2 = X(v), hArc = Math.min(48, 12 + (b2 - a) * 0.35);
        c += `<path d="M${r1(a)} ${yA - 4} Q${r1((a + b2) / 2)} ${r1(yA - 4 - hArc * 1.6)} ${r1(b2)} ${yA - 4}" class="sch-arc" marker-end="POINTE"/>`;
        if (s.pas && b2 - a > 22) c += texte((a + b2) / 2, yA - 8 - hArc * 0.8, s.pas, "sch-txt sch-txt-doux sch-halo");
      }
      c += `<circle cx="${r1(X(v))}" cy="${yA}" r="4" class="sch-point"/>`;
      c += texte(X(v), yA + 17, fr(v), "sch-txt sch-txt-fort");
    });
    return cadre(L, H, c, "Valeurs du compteur");
  }

  /* ---------------- Barres horizontales ----------------
     barres : [{ nom, v, texte, style }] ; log : échelle logarithmique. */
  function barres(s) {
    const items = s.barres || [];
    const gN = Math.max(...items.map((it) => String(it.nom).length)) * 7.4 + 18;
    const L = 560, dy = 30, H = 12 + items.length * dy;
    const echelle = (v) => s.log ? Math.log10(1 + v) : v;
    const max = Math.max(...items.map((it) => echelle(it.v)), 1e-9);
    const plein = L - gN - 110;
    let c = "";
    items.forEach((it, k) => {
      const y = 8 + k * dy;
      c += texte(gN - 8, y + 15, it.nom, "sch-txt", "end");
      const l = Math.max(2, echelle(it.v) / max * plein);
      c += boite(gN, y + 2, l, dy - 10, "sch-barre sch-barre-" + (it.style || 1));
      c += texte(gN + l + 8, y + 15, it.texte ?? fr(it.v), "sch-txt sch-txt-fort", "start");
    });
    return cadre(L, H, c, "Comparaison");
  }

  const types = { spectre, am, fm, numerique, constellation, trame, bus, chaine, courbes, grille, arbre, sauts, barres };

  return {
    types: Object.keys(types),
    svg(spec) {
      const f = types[spec && spec.type];
      if (!f) throw new Error("Schéma de type inconnu : " + (spec && spec.type));
      return f(spec);
    }
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = Schemas;
}
