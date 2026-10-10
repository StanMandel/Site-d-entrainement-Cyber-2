/* =============================================================
   Graphes : lecture, algorithmes, dessin SVG et correction
   -------------------------------------------------------------
   Module pur (aucun DOM) : utilisé par le moteur des leçons
   (assets/js/lecon.js) et par outils/verifier-exercices.js.

   Écriture compacte d'un graphe dans les données :
     {
       type: "graphe",
       oriente: false,
       sommets: "1:0,1 2:1,0 3:1,1",   // nom:x,y (unités de grille)
                                       // ou "1 2 3" + disposition: "cercle"
       aretes: "1-2 2-3",              // arcs : "1>2" ; poids : "1-2:5"
       marques: { "1": "a", "1-2": "b" },  // a accent, b or, c vert,
                                           // d rouge, e estompé
       groupes: ["1 2", "3"],          // une couleur par groupe de sommets
       etiquettes: { "1": "d=2" },     // petit texte près d'un sommet
       carres: "c1 c2",                // sommets dessinés en carré
       courbes: { "6>3": -30 }         // courbure imposée (px)
     }
   Un nom « x1 » s'affiche « x₁ » (indices automatiques).

   Matrice : { type: "matrice", graphe: {...} } (adjacence calculée)
   ou { type: "matrice", lignes: "1 2", colonnes: "1 2",
        valeurs: [[0, 1], [1, 0]], marques: { "1,2": "a" } }.
   ============================================================= */

const Graphes = (() => {
  /* ---------------- Outils ---------------- */

  const cmp = (a, b) => String(a).localeCompare(String(b), "fr", { numeric: true });
  const trier = (liste) => liste.slice().sort(cmp);
  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const r1 = (v) => Math.round(v * 10) / 10;
  const jetons = (s) => [].concat(s ?? []).join(" ").split(/[\s,;]+/).filter(Boolean);

  const INDICES = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
  const VERS_CHIFFRE = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };

  /** « x1 » → « x₁ », « V0 » → « V₀ » ; un nombre seul reste tel quel. */
  function nom(id) {
    const m = String(id).match(/^([A-Za-zÀ-ÿ]+)(\d+)$/);
    return m ? m[1] + [...m[2]].map((c) => INDICES[c]).join("") : String(id);
  }

  /* ---------------- Lecture d'un graphe ---------------- */

  function lireSommets(source) {
    const pos = {};
    const ids = [];
    if (source && typeof source === "object" && !Array.isArray(source)) {
      for (const [id, p] of Object.entries(source)) { ids.push(id); pos[id] = p ? [Number(p[0]), Number(p[1])] : null; }
      return { ids, pos };
    }
    for (const jeton of [].concat(source || []).join(" ").split(/\s+/).filter(Boolean)) {
      const [id, coords] = jeton.split(":");
      if (ids.includes(id)) throw new Error("sommet « " + id + " » déclaré deux fois");
      ids.push(id);
      if (coords) {
        const [x, y] = coords.split(",").map(Number);
        if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error("coordonnées invalides pour « " + id + " »");
        pos[id] = [x, y];
      } else pos[id] = null;
    }
    return { ids, pos };
  }

  /** Clé d'une arête : « a-b » (a ≤ b) ; d'un arc : « a>b ». */
  function cle(a, b, oriente) {
    if (oriente) return a + ">" + b;
    return cmp(a, b) <= 0 ? a + "-" + b : b + "-" + a;
  }

  function lireAretes(source, oriente, ids) {
    const liste = [];
    const vues = new Set();
    for (const jeton of jetons(source)) {
      const m = jeton.match(/^([^>\-:]+)([>\-])([^>\-:]+)(?::(.+))?$/);
      if (!m) throw new Error("arête illisible « " + jeton + " »");
      const [, a, signe, b, poids] = m;
      if (oriente !== (signe === ">")) throw new Error("« " + jeton + " » : écrire " + (oriente ? "a>b dans un graphe orienté" : "a-b dans un graphe non orienté"));
      for (const s of [a, b]) if (!ids.includes(s)) throw new Error("« " + jeton + " » : sommet « " + s + " » inconnu");
      const c = cle(a, b, oriente);
      if (vues.has(c)) throw new Error("arête « " + c + " » en double");
      vues.add(c);
      liste.push({ de: a, vers: b, poids: poids ?? null, cle: c });
    }
    return liste;
  }

  /** Construit le graphe d'une description (ou le renvoie s'il est déjà construit). */
  function graphe(spec) {
    if (spec && spec._graphe) return spec;
    const oriente = !!spec.oriente;
    const { ids, pos } = lireSommets(spec.sommets);
    const liste = lireAretes(spec.aretes || spec.arcs, oriente, ids);
    const succ = new Map(), pred = new Map(), vois = new Map();
    for (const id of ids) { succ.set(id, []); pred.set(id, []); vois.set(id, new Set()); }
    for (const a of liste) {
      succ.get(a.de).push(a.vers);
      pred.get(a.vers).push(a.de);
      if (!oriente && a.de !== a.vers) succ.get(a.vers).push(a.de);
      vois.get(a.de).add(a.vers);
      vois.get(a.vers).add(a.de);
    }
    for (const id of ids) { succ.set(id, trier(succ.get(id))); pred.set(id, trier(pred.get(id))); }
    return { _graphe: true, oriente, ids, pos, liste, cles: new Set(liste.map((a) => a.cle)), succ, pred, vois, spec };
  }

  /** Même ensemble de sommets, autres arêtes (graphe construit par l'utilisateur). */
  function avecAretes(spec, aretes) {
    return graphe({ sommets: spec.sommets, oriente: spec.oriente, aretes: [].concat(aretes || []).join(" ") });
  }

  const aArete = (G, a, b) => G.cles.has(cle(a, b, G.oriente));

  /* ---------------- Degrés et voisinages ---------------- */

  function degre(G, v) {
    if (G.oriente) return G.succ.get(v).length + G.pred.get(v).length;
    return G.liste.reduce((n, a) => n + (a.de === v) + (a.vers === v), 0);
  }
  const degreSortant = (G, v) => G.succ.get(v).length;
  const degreEntrant = (G, v) => G.pred.get(v).length;
  const voisins = (G, v) => trier([...G.vois.get(v)].filter((w) => w !== v || G.liste.some((a) => a.de === v && a.vers === v)));

  /* ---------------- Connexité ---------------- */

  /** Composantes connexes (les arcs comptent comme des arêtes). */
  function composantes(G) {
    const vu = new Set();
    const resultat = [];
    for (const s of trier(G.ids)) {
      if (vu.has(s)) continue;
      const comp = [];
      const pile = [s];
      vu.add(s);
      while (pile.length) {
        const v = pile.pop();
        comp.push(v);
        for (const w of G.vois.get(v)) if (!vu.has(w)) { vu.add(w); pile.push(w); }
      }
      resultat.push(trier(comp));
    }
    return resultat;
  }

  const estConnexe = (G) => G.ids.length <= 1 || composantes(G).length === 1;

  /**
   * Parcours en profondeur, voisins (ou successeurs) visités dans l'ordre
   * croissant, comme dans le cours. options.racines : ordre des sommets
   * candidats pour chaque nouvelle racine (défaut : ordre croissant en
   * commençant par « depart ») ; options.complet = false : s'arrêter à
   * la fin de l'exploration commencée en « depart ».
   */
  function profondeur(G, depart, options = {}) {
    const suivants = (v) => (G.oriente ? G.succ.get(v) : voisins(G, v));
    const etat = {};
    const ordre = [], arbre = [], foret = [], racines = [];
    const prefixe = {}, suffixe = {}, parent = {};
    let nPre = 0, nSuf = 0;

    const explorer = (r) => {
      racines.push(r);
      const groupe = [];
      etat[r] = 1; prefixe[r] = ++nPre; ordre.push(r); groupe.push(r);
      const pile = [{ v: r, i: 0 }];
      while (pile.length) {
        const haut = pile[pile.length - 1];
        const liste = suivants(haut.v);
        if (haut.i < liste.length) {
          const w = liste[haut.i++];
          if (!etat[w]) {
            etat[w] = 1; prefixe[w] = ++nPre; ordre.push(w); groupe.push(w);
            parent[w] = haut.v;
            arbre.push(cle(haut.v, w, G.oriente));
            pile.push({ v: w, i: 0 });
          }
        } else {
          suffixe[haut.v] = ++nSuf;
          pile.pop();
        }
      }
      foret.push(groupe);
    };

    const candidats = options.racines ? options.racines.slice() : [depart, ...trier(G.ids).filter((s) => s !== depart)];
    for (const r of candidats) {
      if (r == null || etat[r]) continue;
      explorer(r);
      if (options.complet === false) break;
    }
    return { ordre, arbre, foret, racines, prefixe, suffixe, parent };
  }

  /** Graphe inverse G⊤ (arcs retournés). */
  function inverse(G) {
    return graphe({
      oriente: true, sommets: G.spec.sommets,
      aretes: G.liste.map((a) => a.vers + ">" + a.de).join(" ")
    });
  }

  /** Composantes fortement connexes par Kosaraju-Sharir, dans l'ordre de découverte. */
  function cfc(G, depart) {
    const premier = profondeur(G, depart ?? trier(G.ids)[0]);
    const parSuffixe = trier(G.ids).sort((a, b) => premier.suffixe[b] - premier.suffixe[a]);
    const second = profondeur(inverse(G), parSuffixe[0], { racines: parSuffixe });
    return second.foret.map(trier);
  }

  /** Arcs du graphe réduit entre composantes (indices dans la liste des CFC). */
  function reduit(G) {
    const comps = cfc(G);
    const indice = {};
    comps.forEach((c, i) => c.forEach((s) => { indice[s] = i; }));
    const arcs = new Set();
    for (const a of G.liste) if (indice[a.de] !== indice[a.vers]) arcs.add(indice[a.de] + ">" + indice[a.vers]);
    return { composantes: comps, arcs: [...arcs] };
  }

  /* ---------------- Graphes particuliers ---------------- */

  /** Partition [V1, V2] si le graphe est biparti, sinon null. */
  function biparti(G) {
    const couleur = {};
    for (const s of trier(G.ids)) {
      if (couleur[s] !== undefined) continue;
      couleur[s] = 0;
      const file = [s];
      while (file.length) {
        const v = file.shift();
        for (const w of G.vois.get(v)) {
          if (w === v) return null;
          if (couleur[w] === undefined) { couleur[w] = 1 - couleur[v]; file.push(w); }
          else if (couleur[w] === couleur[v]) return null;
        }
      }
    }
    return [0, 1].map((c) => trier(G.ids.filter((s) => couleur[s] === c)));
  }

  function estClique(G, S) {
    for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) if (!G.vois.get(S[i]).has(S[j])) return false;
    return true;
  }

  function estStable(G, S) {
    for (let i = 0; i < S.length; i++) for (let j = i; j < S.length; j++) if (G.vois.get(S[i]).has(S[j])) return false;
    return true;
  }

  /** Plus grande taille d'un ensemble de sommets vérifiant « test » (énumération). */
  function tailleMax(G, test) {
    const ids = G.ids;
    if (ids.length > 22) throw new Error("graphe trop grand pour l'énumération");
    let meilleur = 0;
    const choisis = [];
    const aller = (i) => {
      if (choisis.length + (ids.length - i) <= meilleur) return;
      if (i === ids.length) { meilleur = Math.max(meilleur, choisis.length); return; }
      choisis.push(ids[i]);
      if (test(G, choisis)) aller(i + 1);
      choisis.pop();
      aller(i + 1);
    };
    aller(0);
    return meilleur;
  }
  const cliqueMax = (G) => tailleMax(G, estClique);
  const stableMax = (G) => tailleMax(G, estStable);

  /** Plus petite couverture par sommets (chaque arête a une extrémité choisie). */
  function couvertureMin(G) {
    let meilleur = G.ids.length;
    const choisis = new Set();
    const aretes = G.liste.filter((a) => a.de !== a.vers);
    const aller = (k) => {
      if (choisis.size >= meilleur) return;
      const libre = aretes.find((a) => !choisis.has(a.de) && !choisis.has(a.vers));
      if (!libre) { meilleur = choisis.size; return; }
      for (const s of [libre.de, libre.vers]) { choisis.add(s); aller(k + 1); choisis.delete(s); }
    };
    aller(0);
    return meilleur;
  }

  /** Vrai si les arêtes (clés) sont du graphe et deux à deux non adjacentes. */
  function estCouplage(G, cles) {
    const pris = new Set();
    for (const c of cles) {
      const a = G.liste.find((x) => x.cle === c);
      if (!a || a.de === a.vers || pris.has(a.de) || pris.has(a.vers)) return false;
      pris.add(a.de); pris.add(a.vers);
    }
    return true;
  }

  function couplageMax(G) {
    const aretes = G.liste.filter((a) => a.de !== a.vers);
    let meilleur = 0;
    const pris = new Set();
    const aller = (i, n) => {
      if (n + Math.floor((G.ids.length - pris.size) / 2) <= meilleur) return;
      meilleur = Math.max(meilleur, n);
      for (let k = i; k < aretes.length; k++) {
        const a = aretes[k];
        if (pris.has(a.de) || pris.has(a.vers)) continue;
        pris.add(a.de); pris.add(a.vers);
        aller(k + 1, n + 1);
        pris.delete(a.de); pris.delete(a.vers);
      }
    };
    aller(0, 0);
    return meilleur;
  }

  /** Un graphe non orienté contient-il un cycle élémentaire ? */
  function aCycle(G) {
    if (G.oriente) return aCircuit(G);
    if (G.liste.some((a) => a.de === a.vers)) return true;
    return G.liste.length > G.ids.length - composantes(G).length;
  }

  function aCircuit(G) {
    const etat = {};
    let trouve = false;
    const visiter = (v) => {
      etat[v] = 1;
      for (const w of G.succ.get(v)) {
        if (etat[w] === 1) trouve = true;
        else if (!etat[w]) visiter(w);
      }
      etat[v] = 2;
    };
    for (const s of G.ids) if (!etat[s]) visiter(s);
    return trouve;
  }

  const estArbre = (G) => !G.oriente && estConnexe(G) && G.liste.length === G.ids.length - 1 && !aCycle(G);

  /** Cycles (circuits) élémentaires de longueur l, chacun compté une fois. */
  function cyclesDeLongueur(G, l) {
    const trouves = new Set();
    const chemin = [];
    const suivants = (v) => (G.oriente ? G.succ.get(v) : voisins(G, v));
    const aller = (depart, v) => {
      if (chemin.length === l) {
        if (suivants(v).includes(depart)) {
          const sommets = chemin.slice();
          const signature = G.oriente
            ? rotationMin(sommets).join(">")
            : [rotationMin(sommets).join("-"), rotationMin(sommets.slice().reverse()).join("-")].sort()[0];
          trouves.add(signature);
        }
        return;
      }
      for (const w of suivants(v)) {
        if (chemin.includes(w) || cmp(w, depart) < 0) continue;
        chemin.push(w); aller(depart, w); chemin.pop();
      }
    };
    if (l < (G.oriente ? 2 : 3)) return [];
    for (const s of G.ids) { chemin.push(s); aller(s, s); chemin.pop(); }
    return [...trouves];
  }

  function rotationMin(liste) {
    let k = 0;
    liste.forEach((v, i) => { if (cmp(v, liste[k]) < 0) k = i; });
    return liste.slice(k).concat(liste.slice(0, k));
  }

  /** Longueur du plus long cycle élémentaire (0 si aucun). */
  function plusLongCycle(G) {
    for (let l = G.ids.length; l >= (G.oriente ? 2 : 3); l--) if (cyclesDeLongueur(G, l).length) return l;
    return 0;
  }

  /* ---------------- Chaînes et chemins ---------------- */

  /**
   * Analyse une suite de sommets : est-ce une chaîne (un chemin dans un
   * graphe orienté) ? Renvoie { ok, longueur, simple, elementaire, ferme, erreur }.
   */
  function analyserSuite(G, suite) {
    if (suite.length < 2) return { ok: false, erreur: (G.oriente ? "Un chemin" : "Une chaîne") + " passe par au moins deux sommets." };
    for (let k = 1; k < suite.length; k++) {
      if (!aArete(G, suite[k - 1], suite[k])) {
        return {
          ok: false,
          erreur: G.oriente
            ? "L'arc (" + suite[k - 1] + ", " + suite[k] + ") n'existe pas."
            : "L'arête {" + suite[k - 1] + ", " + suite[k] + "} n'existe pas."
        };
      }
    }
    const cles = suite.slice(1).map((v, k) => cle(suite[k], v, G.oriente));
    const ferme = suite[0] === suite[suite.length - 1];
    const interieurs = ferme ? suite.slice(0, -1) : suite;
    return {
      ok: true,
      longueur: suite.length - 1,
      ferme,
      simple: new Set(cles).size === cles.length,
      elementaire: new Set(interieurs).size === interieurs.length && (!ferme || G.oriente || suite.length - 1 >= 3)
    };
  }

  /* ---------------- Matrices ---------------- */

  function matriceAdjacence(G) {
    return G.ids.map((i) => G.ids.map((j) => (G.oriente
      ? (G.cles.has(cle(i, j, true)) ? 1 : 0)
      : (aArete(G, i, j) ? 1 : 0))));
  }

  function produit(A, B) {
    return A.map((ligne) => B[0].map((_, j) => ligne.reduce((s, v, k) => s + v * B[k][j], 0)));
  }

  function puissance(A, k) {
    let R = A.map((l, i) => l.map((_, j) => (i === j ? 1 : 0)));
    for (let n = 0; n < k; n++) R = produit(R, A);
    return R;
  }

  /* =========================================================
     DESSIN
     ========================================================= */

  /* Disposition en cercle des sommets sans coordonnées. */
  function positions(G, spec) {
    const pos = {};
    const sans = G.ids.filter((id) => !G.pos[id]);
    const cercle = spec.disposition === "cercle" || sans.length === G.ids.length;
    G.ids.forEach((id, k) => {
      if (G.pos[id] && !(cercle && spec.disposition === "cercle")) { pos[id] = G.pos[id]; return; }
      const n = G.ids.length;
      const angle = -Math.PI / 2 + (2 * Math.PI * k) / n;
      const rayon = Math.max(1.3, n / 3.4);
      pos[id] = [rayon + rayon * Math.cos(angle), rayon + rayon * Math.sin(angle)];
    });
    return pos;
  }

  /* Distance d'un point au segment [A, B]. */
  function distanceSegment(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  }

  const MARQUES = ["a", "b", "c", "d", "e"];

  /**
   * SVG d'un graphe. options.interactif ajoute des zones cliquables
   * (data-s = sommet, data-a = clé d'arête) ; options.choix = sommet
   * en cours de sélection ; options.numeros = { sommet: "1, 3" }.
   */
  function svg(spec, options = {}) {
    if (spec.type === "matrice") return svgMatrice(spec);
    const G = graphe(spec);
    const P = positions(G, spec);
    const U = spec.unite || 74;
    const carres = new Set(jetons(spec.carres));
    const rayonDe = (id) => Math.max(15, 6 + nom(id).length * 4.2);
    const rMax = Math.max(15, ...G.ids.map(rayonDe));
    const xs = G.ids.map((id) => P[id][0]), ys = G.ids.map((id) => P[id][1]);
    const minX = Math.min(...xs, 0), minY = Math.min(...ys, 0);
    const marge = rMax + 14 + (spec.etiquettes || options.numeros ? 12 : 0);
    const haut = marge + (G.liste.some((a) => a.de === a.vers) ? 30 : 0);
    const X = (id) => marge + (P[id][0] - minX) * U;
    const Y = (id) => haut + (P[id][1] - minY) * U;
    const L = marge * 2 + (Math.max(...xs) - minX) * U;
    const H = haut + marge + (Math.max(...ys) - minY) * U;

    const marques = spec.marques || {};
    const groupes = {};
    [].concat(spec.groupes || []).forEach((g, k) => jetons(g).forEach((s) => { groupes[s] = k % 6; }));
    const marqueArete = (a) => marques[a.cle] || (!G.oriente && (marques[a.de + "-" + a.vers] || marques[a.vers + "-" + a.de])) || null;

    const id = "g" + Math.random().toString(36).slice(2, 8);
    let alterne = 0;
    let c = "";
    const zones = [];
    const pointe = (m) => `url(#${id}-${m || "n"})`;

    for (const a of G.liste) {
      const m = marqueArete(a);
      const classe = "g-arete" + (m ? " m-" + m : "") + (options.estompe && !m ? " m-e" : "");
      const x1 = X(a.de), y1 = Y(a.de), x2 = X(a.vers), y2 = Y(a.vers);
      let d, mx, my;
      if (a.de === a.vers) {
        const r = rayonDe(a.de);
        d = `M${r1(x1 - 8)} ${r1(y1 - r + 2)} C${r1(x1 - 30)} ${r1(y1 - r - 38)} ${r1(x1 + 30)} ${r1(y1 - r - 38)} ${r1(x1 + 8)} ${r1(y1 - r + 2)}`;
        mx = x1; my = y1 - r - 30;
      } else {
        let courbe = spec.courbes && (spec.courbes[a.cle] ?? spec.courbes[a.de + (G.oriente ? ">" : "-") + a.vers]);
        const longueur = Math.hypot(x2 - x1, y2 - y1);
        const nx = -(y2 - y1) / longueur, ny = (x2 - x1) / longueur;
        if (courbe === undefined && G.oriente && G.cles.has(cle(a.vers, a.de, true))) courbe = 16;
        if (courbe === undefined) {
          const gene = G.ids.find((s) => s !== a.de && s !== a.vers
            && distanceSegment([X(s), Y(s)], [x1, y1], [x2, y2]) < rayonDe(s) + 5);
          if (gene) {
            /* Contourner le sommet gênant ; s'il est aligné, alterner les côtés. */
            const cote = (X(gene) - x1) * nx + (Y(gene) - y1) * ny;
            const sens = Math.abs(cote) < 2 ? (alterne++ % 2 ? -1 : 1) : (cote > 0 ? -1 : 1);
            courbe = sens * Math.max(26, longueur * 0.22);
          }
        }
        const cx = (x1 + x2) / 2 + nx * (courbe || 0), cy = (y1 + y2) / 2 + ny * (courbe || 0);
        const r2 = rayonDe(a.vers) + (G.oriente ? 2 : 0), rr1 = rayonDe(a.de);
        const ux1 = cx - x1, uy1 = cy - y1, n1 = Math.hypot(ux1, uy1) || 1;
        const ux2 = x2 - cx, uy2 = y2 - cy, n2 = Math.hypot(ux2, uy2) || 1;
        const sx = x1 + (ux1 / n1) * rr1, sy = y1 + (uy1 / n1) * rr1;
        const ex = x2 - (ux2 / n2) * r2, ey = y2 - (uy2 / n2) * r2;
        d = courbe ? `M${r1(sx)} ${r1(sy)} Q${r1(cx)} ${r1(cy)} ${r1(ex)} ${r1(ey)}` : `M${r1(sx)} ${r1(sy)} L${r1(ex)} ${r1(ey)}`;
        mx = courbe ? (x1 + x2) / 4 + cx / 2 : (x1 + x2) / 2;
        my = courbe ? (y1 + y2) / 4 + cy / 2 : (y1 + y2) / 2;
      }
      c += `<path d="${d}" class="${classe}"${G.oriente ? ` marker-end="${pointe(m)}"` : ""}/>`;
      if (a.poids !== null) c += `<text x="${r1(mx)}" y="${r1(my + 4)}" class="g-poids" text-anchor="middle">${esc(a.poids)}</text>`;
      if (options.numerosAretes && options.numerosAretes[a.cle]) {
        c += `<text x="${r1(mx)}" y="${r1(my + 4)}" class="g-poids g-poids-fort" text-anchor="middle">${esc(options.numerosAretes[a.cle])}</text>`;
      }
      if (options.interactif) zones.push(`<path d="${d}" class="g-zone" data-a="${esc(a.cle)}"/>`);
    }
    c += zones.join("");

    for (const s of G.ids) {
      const x = X(s), y = Y(s), r = rayonDe(s);
      const m = marques[s];
      const classe = "g-sommet"
        + (m ? " m-" + m : groupes[s] !== undefined ? " g-groupe-" + groupes[s] : "")
        + (options.estompe && !m && groupes[s] === undefined ? " m-e" : "")
        + (options.choix === s ? " g-choisi" : "")
        + (options.interactif ? " g-clic" : "");
      c += `<g class="${classe}"${options.interactif ? ` data-s="${esc(s)}"` : ""}>`;
      if (options.interactif) c += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r + 9)}" ry="${r1(r + 9)}" class="g-cible"/>`;
      c += carres.has(s)
        ? `<rect x="${r1(x - r)}" y="${r1(y - r)}" width="${r1(2 * r)}" height="${r1(2 * r)}"/>`
        : `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/>`;
      c += `<text x="${r1(x)}" y="${r1(y + 4.5)}" text-anchor="middle">${esc(nom(s))}</text></g>`;
      const etq = (spec.etiquettes && spec.etiquettes[s]) || (options.numeros && options.numeros[s]);
      if (etq) c += `<text x="${r1(x + r * 0.75)}" y="${r1(y - r - 3)}" class="g-etiquette" text-anchor="start">${esc(etq)}</text>`;
    }

    const defs = G.oriente
      ? "<defs>" + ["n", ...MARQUES].map((m) => `<marker id="${id}-${m}" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="g-pointe${m === "n" ? "" : " m-" + m}"/></marker>`).join("") + "</defs>"
      : "";
    const largeur = Math.max(L + (spec.etiquettes || options.numeros ? 26 : 0), 60);
    return `<svg class="sch g" viewBox="0 0 ${r1(largeur)} ${r1(H)}" style="max-width:${r1(largeur * 1.15)}px" role="img" aria-label="${esc(spec.titre || "Graphe")}" xmlns="http://www.w3.org/2000/svg">${defs}${c}</svg>`;
  }

  /* SVG d'une matrice : en-têtes de lignes et de colonnes, cases marquées. */
  function svgMatrice(spec) {
    let lignes, colonnes, valeurs;
    if (spec.graphe) {
      const G = graphe(spec.graphe);
      lignes = G.ids; colonnes = G.ids; valeurs = matriceAdjacence(G);
      if (spec.puissance) valeurs = puissance(valeurs, spec.puissance);
    } else {
      lignes = jetons(spec.lignes);
      colonnes = jetons(spec.colonnes || spec.lignes);
      valeurs = spec.valeurs;
    }
    if (!valeurs || valeurs.length !== lignes.length || valeurs.some((l) => l.length !== colonnes.length)) {
      throw new Error("matrice : dimensions incohérentes");
    }
    const largeurCase = Math.max(30, 10 + Math.max(...valeurs.flat().map((v) => String(v).length)) * 9);
    const C = largeurCase, h = 28;
    const gauche = 12 + Math.max(...lignes.map((s) => nom(s).length)) * 8 + 10;
    const haut = spec.titre ? 46 : 28;
    const L = gauche + colonnes.length * C + 14;
    const H = haut + lignes.length * h + 8;
    const marques = spec.marques || {};
    let c = "";
    if (spec.titre) c += `<text x="${r1(gauche + (colonnes.length * C) / 2)}" y="16" class="g-m-titre" text-anchor="middle">${esc(spec.titre)}</text>`;
    colonnes.forEach((col, j) => {
      const m = marques["c:" + col];
      c += `<text x="${r1(gauche + j * C + C / 2)}" y="${haut - 9}" class="g-m-entete${m ? " m-" + m : ""}" text-anchor="middle">${esc(nom(col))}</text>`;
    });
    lignes.forEach((lig, i) => {
      const y = haut + i * h;
      const mL = marques["l:" + lig];
      c += `<text x="${gauche - 10}" y="${r1(y + h / 2 + 4.5)}" class="g-m-entete${mL ? " m-" + mL : ""}" text-anchor="end">${esc(nom(lig))}</text>`;
      colonnes.forEach((col, j) => {
        const m = marques[lig + "," + col] || mL || marques["c:" + col];
        const v = valeurs[i][j];
        c += `<rect x="${r1(gauche + j * C)}" y="${r1(y)}" width="${C}" height="${h}" class="g-m-case${m ? " m-" + m : ""}${v === 0 || v === "0" ? " g-m-zero" : ""}"/>`;
        c += `<text x="${r1(gauche + j * C + C / 2)}" y="${r1(y + h / 2 + 4.5)}" class="g-m-val${v === 0 || v === "0" ? " g-m-zero" : ""}" text-anchor="middle">${esc(v)}</text>`;
      });
    });
    c += `<path d="M${gauche - 3} ${haut - 2} h-4 v${lignes.length * h + 4} h4 M${gauche + colonnes.length * C + 3} ${haut - 2} h4 v${lignes.length * h + 4} h-4" class="g-m-crochet"/>`;
    return `<svg class="sch g" viewBox="0 0 ${r1(L)} ${r1(H)}" style="max-width:${r1(L * 1.15)}px" role="img" aria-label="${esc(spec.titre || "Matrice")}" xmlns="http://www.w3.org/2000/svg">${c}</svg>`;
  }

  /* =========================================================
     CORRECTION DES EXERCICES INTERACTIFS
     ---------------------------------------------------------
     evaluer(exo, reponse) → { ok, message }
       construire : reponse = clés des arêtes tracées
       selection  : reponse = sommets (ou clés d'arêtes si cible "aretes")
       ordre      : reponse = suite de sommets cliqués
       matrice    : reponse = tableau 2D de nombres
     ========================================================= */

  const echec = (message) => ({ ok: false, message });
  const liste = (xs) => trier(xs).map(nom).join(", ");
  const ensemble = (xs) => "{" + liste(xs) + "}";

  /* Règles d'un graphe construit : chacune renvoie null ou le message d'erreur. */
  const REGLES_GRAPHE = {
    egal(H, r) {
      const attendu = graphe({ sommets: H.spec.sommets, oriente: H.oriente, aretes: r.aretes });
      const trop = [...H.cles].filter((c) => !attendu.cles.has(c));
      const manque = [...attendu.cles].filter((c) => !H.cles.has(c));
      if (!trop.length && !manque.length) return null;
      const mots = [];
      if (manque.length) mots.push(manque.length + (manque.length > 1 ? (H.oriente ? " arcs manquent" : " arêtes manquent") : (H.oriente ? " arc manque" : " arête manque")));
      if (trop.length) mots.push(trop.length + (trop.length > 1 ? (H.oriente ? " arcs sont en trop" : " arêtes sont en trop") : (H.oriente ? " arc est en trop" : " arête est en trop")));
      return "Ce n'est pas encore le graphe attendu : " + mots.join(", ") + ".";
    },
    nbAretes(H, r) {
      return H.liste.length === r.n ? null
        : "Il faut exactement " + r.n + (H.oriente ? " arcs" : " arêtes") + " (vous en avez " + H.liste.length + ").";
    },
    degres(H, r) {
      const texte = String(r.valeurs);
      if (texte.includes(":")) {
        for (const j of jetons(texte)) {
          const [s, d] = j.split(":");
          if (degre(H, s) !== Number(d)) return "Le sommet " + nom(s) + " doit être de degré " + d + " (il est de degré " + degre(H, s) + ").";
        }
        return null;
      }
      const voulu = jetons(texte).map(Number).sort((a, b) => b - a);
      const obtenu = H.ids.map((s) => degre(H, s)).sort((a, b) => b - a);
      return voulu.join() === obtenu.join() ? null
        : "Degrés obtenus : " + obtenu.join(", ") + " — attendus : " + voulu.join(", ") + ".";
    },
    regulier(H, r) {
      const faux = H.ids.find((s) => degre(H, s) !== r.k);
      return faux === undefined ? null : "Le sommet " + nom(faux) + " est de degré " + degre(H, faux) + " au lieu de " + r.k + ".";
    },
    demiDegres(H, r) {
      for (const j of jetons(r.valeurs)) {
        const [s, d] = j.split(":");
        const [plus, moins] = d.split("/").map(Number);
        if (degreSortant(H, s) !== plus || degreEntrant(H, s) !== moins) {
          return "Le sommet " + nom(s) + " doit avoir d⁺ = " + plus + " et d⁻ = " + moins + " (il a " + degreSortant(H, s) + " et " + degreEntrant(H, s) + ").";
        }
      }
      return null;
    },
    connexe(H) {
      const n = composantes(H).length;
      return n === 1 ? null : "Le graphe n'est pas connexe : il a " + n + " composantes connexes.";
    },
    composantes(H, r) {
      const n = composantes(H).length;
      return n === r.n ? null : "Le graphe doit avoir " + r.n + " composantes connexes (il en a " + n + ").";
    },
    sansCycle(H) {
      return aCycle(H) ? (H.oriente ? "Le graphe contient un circuit." : "Le graphe contient un cycle.") : null;
    },
    avecCycle(H) {
      return aCycle(H) ? null : "Le graphe doit contenir au moins un cycle.";
    },
    arbre(H) {
      if (!estConnexe(H)) return "Un arbre est connexe : ce graphe ne l'est pas.";
      if (aCycle(H)) return "Un arbre est sans cycle : ce graphe en contient un.";
      return null;
    },
    biparti(H, r) {
      if (r.parts) {
        const parts = r.parts.map((p) => new Set(jetons(p)));
        const faute = H.liste.find((a) => parts.some((p) => p.has(a.de) && p.has(a.vers)));
        return faute ? "L'arête {" + nom(faute.de) + ", " + nom(faute.vers) + "} relie deux sommets du même côté." : null;
      }
      return biparti(H) ? null : "Le graphe n'est pas biparti : il contient un cycle de longueur impaire.";
    },
    couplageParfait(H) {
      return couplageMax(H) * 2 === H.ids.length ? null : "Ce graphe n'admet pas de couplage parfait.";
    },
    fortementConnexe(H) {
      const n = cfc(H).length;
      return n === 1 ? null : "Le graphe n'est pas fortement connexe (" + n + " composantes fortement connexes).";
    },
    cfc(H, r) {
      const n = cfc(H).length;
      return n === r.n ? null : "Il faut " + r.n + " composantes fortement connexes (il y en a " + n + ").";
    },
    contient(H, r) {
      const G = graphe({ sommets: H.spec.sommets, oriente: H.oriente, aretes: r.aretes });
      const manque = [...G.cles].find((c) => !H.cles.has(c));
      return manque ? (r.message || "Une arête imposée manque : " + manque.replace(/[->]/, H.oriente ? " → " : " — ") + ".") : null;
    },
    inclus(H, r) {
      const G = graphe({ sommets: H.spec.sommets, oriente: H.oriente, aretes: r.aretes });
      const intrus = [...H.cles].find((c) => !G.cles.has(c));
      return intrus ? (r.message || "L'arête " + intrus.replace(/[->]/, H.oriente ? " → " : " — ") + " n'est pas autorisée.") : null;
    },
    sansCycleLongueur(H, r) {
      const n = cyclesDeLongueur(H, r.l).length;
      return n ? "Le graphe contient " + (n > 1 ? n + " cycles" : "un cycle") + " de longueur " + r.l + "." : null;
    },
    tournoi(H) {
      for (let i = 0; i < H.ids.length; i++) for (let j = i + 1; j < H.ids.length; j++) {
        const a = H.ids[i], b = H.ids[j];
        const n = H.cles.has(cle(a, b, true)) + H.cles.has(cle(b, a, true));
        if (n !== 1) return n ? "Entre " + nom(a) + " et " + nom(b) + ", un seul arc : le match a un seul vainqueur." : "Le match entre " + nom(a) + " et " + nom(b) + " manque.";
      }
      return null;
    },
    arborescence(H, r) {
      if (aCircuit(H)) return "Une arborescence est sans circuit.";
      for (const s of H.ids) {
        const d = degreEntrant(H, s);
        if (s === r.racine && d !== 0) return "La racine " + nom(s) + " ne doit avoir aucun prédécesseur.";
        if (s !== r.racine && d !== 1) return "Le sommet " + nom(s) + " doit avoir exactement un prédécesseur (il en a " + d + ").";
      }
      return null;
    }
  };

  const REGLES_SOMMETS = {
    egal(G, S, r) {
      const voulu = trier(jetons(r.sommets));
      return trier(S).join() === voulu.join() ? null : (r.message || "Ce n'est pas l'ensemble attendu.");
    },
    taille(G, S, r) {
      return S.length === r.n ? null : "Il faut sélectionner " + r.n + " sommets (vous en avez " + S.length + ").";
    },
    clique(G, S, r) {
      if (!estClique(G, S)) {
        const [a, b] = paireFautive(G, S, false);
        return "{" + nom(a) + ", " + nom(b) + "} n'est pas une arête : ce n'est pas une clique.";
      }
      const voulu = r.maximum ? cliqueMax(G) : r.taille;
      if (voulu && S.length !== voulu) return "C'est bien une clique, mais de taille " + S.length + " : " + (r.maximum ? "il en existe une plus grande." : "il faut une clique de taille " + voulu + ".");
      return null;
    },
    stable(G, S, r) {
      if (!estStable(G, S)) {
        const [a, b] = paireFautive(G, S, true);
        return nom(a) + " et " + nom(b) + " sont voisins : ce n'est pas un stable.";
      }
      const voulu = r.maximum ? stableMax(G) : r.taille;
      if (voulu && S.length !== voulu) return "C'est bien un stable, mais de taille " + S.length + " : " + (r.maximum ? "il en existe un plus grand." : "il faut un stable de taille " + voulu + ".");
      return null;
    },
    couverture(G, S, r) {
      const libre = G.liste.find((a) => !S.includes(a.de) && !S.includes(a.vers));
      if (libre) return "L'arête {" + nom(libre.de) + ", " + nom(libre.vers) + "} n'a aucune extrémité sélectionnée.";
      if (r.minimum && S.length !== couvertureMin(G)) return "Toutes les arêtes sont couvertes, mais avec " + S.length + " sommets : on peut faire mieux.";
      return null;
    },
    composante(G, S, r) {
      const comps = composantes(G);
      const voulue = r.contient ? comps.find((c) => c.includes(r.contient)) : comps.find((c) => c.includes(S[0]));
      if (!voulue) return "Sélectionnez une composante connexe.";
      return trier(S).join() === voulue.join() ? null : "Ce n'est pas la composante connexe " + (r.contient ? "qui contient " + nom(r.contient) : "attendue") + ".";
    },
    cfc(G, S, r) {
      const voulue = cfc(G).find((c) => c.includes(r.contient));
      return trier(S).join() === voulue.join() ? null : "Ce n'est pas la composante fortement connexe de " + nom(r.contient) + ".";
    },
    partie(G, S) {
      if (!S.length) return "Sélectionnez les sommets d'un des deux côtés.";
      const reste = G.ids.filter((s) => !S.includes(s));
      if (!estStable(G, S)) { const [a, b] = paireFautive(G, S, true); return "{" + nom(a) + ", " + nom(b) + "} est une arête entre deux sommets sélectionnés."; }
      if (!estStable(G, reste)) { const [a, b] = paireFautive(G, reste, true); return "{" + nom(a) + ", " + nom(b) + "} est une arête entre deux sommets non sélectionnés."; }
      return null;
    }
  };

  const REGLES_ARETES = {
    egal(G, F, r) {
      const voulu = graphe({ sommets: G.spec.sommets, oriente: G.oriente, aretes: r.aretes });
      return trier(F).join() === trier([...voulu.cles]).join() ? null : (r.message || "Ce n'est pas l'ensemble d'arêtes attendu.");
    },
    couplage(G, F, r) {
      if (!estCouplage(G, F)) return "Deux arêtes sélectionnées ont une extrémité commune : ce n'est pas un couplage.";
      const voulu = r.maximum || r.parfait ? (r.parfait ? G.ids.length / 2 : couplageMax(G)) : r.taille;
      if (voulu && F.length !== voulu) return "C'est un couplage de " + F.length + " arêtes : " + (r.parfait ? "il n'est pas parfait." : r.maximum ? "on peut en avoir plus." : "il en faut " + voulu + ".");
      return null;
    },
    arbreCouvrant(G, F) {
      const H = avecAretes(G.spec, F);
      if (aCycle(H)) return "Les arêtes sélectionnées forment un cycle.";
      if (!estConnexe(H)) return "Les arêtes sélectionnées ne relient pas tous les sommets.";
      return null;
    },
    cycle(G, F, r) {
      const H = avecAretes(G.spec, F);
      const touches = H.ids.filter((s) => degre(H, s) > 0);
      if (!touches.length || touches.some((s) => degre(H, s) !== 2) || composantes(graphe({ sommets: touches.join(" "), aretes: F.join(" ") })).length !== 1) {
        return "Les arêtes sélectionnées ne forment pas un cycle élémentaire.";
      }
      if (r.longueur && F.length !== r.longueur) return "C'est un cycle de longueur " + F.length + ", pas " + r.longueur + ".";
      return null;
    }
  };

  const REGLES_SUITE = {
    egal(G, suite, r) {
      const voulu = jetons(r.suite);
      if (suite.join(" ") === voulu.join(" ")) return null;
      const k = suite.findIndex((s, i) => s !== voulu[i]);
      if (k === -1) return "Il manque des sommets à la fin.";
      return r.message || "Le sommet n° " + (k + 1) + " ne convient pas.";
    },
    parcours(G, suite, r) {
      const voulu = profondeur(G, r.depart, { complet: r.complet !== false }).ordre;
      if (suite.join(" ") === voulu.join(" ")) return null;
      const k = suite.findIndex((s, i) => s !== voulu[i]);
      if (k === -1) return "Le parcours n'est pas terminé : il reste des sommets à explorer.";
      return "Le sommet n° " + (k + 1) + " (" + nom(suite[k]) + ") n'est pas le bon : à cet instant, " + (G.oriente ? "quel successeur" : "quel voisin") + " non exploré vient en premier ?";
    },
    chaine(G, suite, r) {
      const a = analyserSuite(G, suite);
      const mot = G.oriente ? (r.ferme ? "circuit" : "chemin") : (r.ferme ? "cycle" : "chaîne");
      if (!a.ok) return a.erreur;
      if (r.de && suite[0] !== r.de) return "Le " + (G.oriente ? "chemin" : "parcours") + " doit partir de " + nom(r.de) + ".";
      if (r.vers && suite[suite.length - 1] !== r.vers) return "Il doit arriver en " + nom(r.vers) + ".";
      if (r.ferme && !a.ferme) return "Un " + mot + " revient à son sommet de départ.";
      if (r.longueur !== undefined && a.longueur !== r.longueur) return "Ce " + (G.oriente ? "chemin" : "parcours") + " est de longueur " + a.longueur + " au lieu de " + r.longueur + ".";
      if (r.min !== undefined && a.longueur < r.min) return "Longueur " + a.longueur + " : il faut au moins " + r.min + ".";
      if (r.simple && !a.simple) return (G.oriente ? "Un même arc est utilisé" : "Une même arête est utilisée") + " deux fois : ce n'est pas simple.";
      if (r.elementaire && !a.elementaire) return "Un sommet est répété : ce n'est pas élémentaire.";
      if (r.elementaire === false && a.elementaire) return "Ce " + mot + " est élémentaire : il en faut un qui repasse par un sommet.";
      if (r.passePar && !suite.includes(r.passePar)) return "Il doit passer par " + nom(r.passePar) + ".";
      return null;
    },
    topologique(G, suite) {
      if (suite.length !== G.ids.length || new Set(suite).size !== G.ids.length) return "Chaque sommet doit apparaître exactement une fois.";
      const rang = {};
      suite.forEach((s, k) => { rang[s] = k; });
      const faute = G.liste.find((a) => rang[a.de] > rang[a.vers]);
      return faute ? "L'arc (" + nom(faute.de) + ", " + nom(faute.vers) + ") va à rebours : " + nom(faute.de) + " doit venir avant " + nom(faute.vers) + "." : null;
    },
    augmentant(G, suite, r) {
      const M = new Set(jetons(r.couplage).map((c) => { const [a, b] = c.split("-"); return cle(a, b, false); }));
      const couverts = new Set([...M].flatMap((c) => c.split("-")));
      const a = analyserSuite(G, suite);
      if (!a.ok) return a.erreur;
      if (!a.elementaire || a.ferme) return "Une chaîne augmentante est élémentaire.";
      if (couverts.has(suite[0]) || couverts.has(suite[suite.length - 1])) return "Ses deux extrémités doivent être libres (non couvertes par le couplage).";
      for (let k = 1; k < suite.length; k++) {
        const dans = M.has(cle(suite[k - 1], suite[k], false));
        if (dans !== (k % 2 === 0)) return "Les arêtes doivent alterner : hors couplage, dans le couplage, hors couplage…";
      }
      return null;
    }
  };

  function paireFautive(G, S, stable) {
    for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) {
      if (G.vois.get(S[i]).has(S[j]) === stable) return [S[i], S[j]];
    }
    return [S[0], S[0]];
  }

  function reglesDe(exo) {
    const regles = [].concat(exo.regles || []);
    if (exo.attendu !== undefined && exo.type !== "matrice") {
      const champ = exo.type === "ordre" ? "suite" : exo.type === "selection" && exo.cible !== "aretes" ? "sommets" : "aretes";
      regles.unshift({ regle: "egal", [champ]: exo.attendu });
    }
    return regles;
  }

  /** Matrice attendue d'un exercice « matrice ». */
  function matriceAttendue(exo) {
    if (exo.attendu) return exo.attendu;
    const G = graphe(exo.graphe);
    return exo.puissance ? puissance(matriceAdjacence(G), exo.puissance) : matriceAdjacence(G);
  }

  function evaluer(exo, reponse) {
    const regles = reglesDe(exo);
    if (exo.type === "matrice") {
      const voulu = matriceAttendue(exo);
      const fausses = [];
      voulu.forEach((l, i) => l.forEach((v, j) => { if (Number((reponse[i] || [])[j]) !== Number(v)) fausses.push([i, j]); }));
      return fausses.length ? echec(fausses.length + (fausses.length > 1 ? " cases sont fausses." : " case est fausse.")) : { ok: true };
    }
    const G = graphe(exo.graphe);
    const valeurs = [].concat(reponse || []);
    let table, sujet;
    if (exo.type === "construire") { table = REGLES_GRAPHE; sujet = avecAretes(exo.graphe, valeurs); }
    else if (exo.type === "selection") { table = exo.cible === "aretes" ? REGLES_ARETES : REGLES_SOMMETS; sujet = valeurs; }
    else if (exo.type === "ordre") { table = REGLES_SUITE; sujet = valeurs; }
    else throw new Error("type « " + exo.type + " » non corrigé par Graphes.evaluer");
    if (!regles.length) throw new Error("exercice sans règle ni réponse attendue");
    for (const r of regles) {
      const f = table[r.regle];
      if (!f) throw new Error("règle inconnue « " + r.regle + " » pour " + exo.type);
      const message = exo.type === "construire" ? f(sujet, r) : f(G, sujet, r);
      if (message) return echec(r.message && r.regle !== "egal" ? r.message : message);
    }
    return { ok: true };
  }

  /** Réponse modèle d'un exercice interactif (affichée sur demande), ou null. */
  function solution(exo) {
    if (exo.type === "matrice") return matriceAttendue(exo);
    if (exo.solution !== undefined) {
      const brut = jetons(exo.solution);
      if (exo.type === "construire" || (exo.type === "selection" && exo.cible === "aretes")) {
        return brut.map((j) => { const m = j.match(/^(.+?)([>\-])(.+)$/); return cle(m[1], m[3], m[2] === ">"); });
      }
      return brut;
    }
    const egal = reglesDe(exo).find((r) => r.regle === "egal");
    if (egal) {
      if (exo.type === "ordre") return jetons(egal.suite);
      if (exo.type === "selection" && exo.cible !== "aretes") return jetons(egal.sommets);
      return [...graphe({ sommets: exo.graphe.sommets, oriente: exo.graphe.oriente, aretes: egal.aretes }).cles];
    }
    const p = reglesDe(exo).find((r) => r.regle === "parcours");
    if (p) return profondeur(graphe(exo.graphe), p.depart, { complet: p.complet !== false }).ordre;
    return null;
  }

  /* =========================================================
     CASES DE RÉPONSE (champ « champs » des exercices)
     ensemble : l'ordre ne compte pas — « {3, 1, 2} » = « 1,2,3 » ;
     suite    : l'ordre compte — « 1-2-3 », « (1, 2, 3) » ;
     partition: ensemble d'ensembles — « {1,2},{3} ».
     ========================================================= */

  function motsDe(saisie) {
    const s = String(saisie ?? "").toLowerCase()
      .replace(/[₀-₉]/g, (c) => VERS_CHIFFRE[c])
      .normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (/^\s*(∅|aucun|aucune|vide|\{\s*\})\s*$/.test(s)) return [];
    return s.split(/[^a-z0-9]+/).filter(Boolean);
  }

  function groupesDe(saisie) {
    const s = String(saisie ?? "");
    const blocs = s.match(/\{[^{}]*\}/g);
    if (!blocs) return null;
    return blocs.map((b) => trier([...new Set(motsDe(b))]).join(",")).sort();
  }

  function champJuste(saisie, champ) {
    const attendues = [].concat(champ.reponse, champ.accepte || []).filter((r) => r != null);
    if (champ.ensemble) {
      const g = trier([...new Set(motsDe(saisie))]).join(",");
      if (!String(saisie).trim()) return false;
      return attendues.some((a) => trier([...new Set(motsDe(a))]).join(",") === g);
    }
    if (champ.suite) {
      const g = motsDe(saisie).join(",");
      return !!g && attendues.some((a) => motsDe(a).join(",") === g);
    }
    if (champ.partition) {
      const g = groupesDe(saisie);
      return !!g && attendues.some((a) => (groupesDe(a) || []).join("|") === g.join("|"));
    }
    const base = typeof champCorrect === "function" ? champCorrect
      : (typeof require === "function" ? require("./probleme.js").champCorrect : null);
    return base(saisie, champ);
  }

  return {
    nom, cle, graphe, avecAretes, aArete, trier, jetons,
    degre, degreSortant, degreEntrant, voisins,
    composantes, estConnexe, profondeur, inverse, cfc, reduit,
    biparti, estClique, estStable, cliqueMax, stableMax, couvertureMin,
    estCouplage, couplageMax, aCycle, aCircuit, estArbre,
    cyclesDeLongueur, plusLongCycle, analyserSuite,
    matriceAdjacence, produit, puissance,
    svg, svgMatrice, evaluer, solution, matriceAttendue, champJuste
  };
})();

/* Export pour le vérificateur Node (aucun accès au DOM au chargement). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = Graphes;
}
