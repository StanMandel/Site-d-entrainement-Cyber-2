/* =============================================================
   Vérifie les exercices de programmation (type "code")
   -------------------------------------------------------------
   Lancer depuis le dossier du site :   node outils/verifier-exercices.js
   Pour chaque QCM : les réponses désignent des choix existants.
   Pour chaque QCM ou jeu : le « tirage » tient dans la banque.
   Pour chaque « probleme » : chaque problème (ou chaque case de
   « champs ») a une réponse cohérente, et chaque schéma se dessine.
   Pour chaque « lecon » : chaque étape du cours a un schéma ou une
   animation, tous les schémas se dessinent, chaque animation s'exécute
   pour chaque scénario et chaque n (et donne les comptes « attendu »),
   les niveaux des exercices ne décroissent pas, chaque exercice sur
   graphe est validé par sa solution et refusé au départ, chaque case
   accepte sa propre réponse, les lignes des exercices « lignes » et
   « cout » existent et les classes proposées contiennent la réponse.
   Pour chaque « enquete » : méthodes et challenges présents, niveaux
   croissants, chaque case accepte sa propre réponse (coordonnées
   comprises), chaque pièce (image, fichier) existe dans le dossier.
   Pour chaque exercice de programmation :
     - la solution doit réussir tous les tests ;
     - le code de départ ne doit pas réussir ;
     - les identifiants doivent être uniques dans la matière.
   ============================================================= */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const racine = path.join(__dirname, "..");
const VerifCode = require(path.join(racine, "assets/js/verif-code.js"));
const MoteurTerminal = require(path.join(racine, "assets/js/terminal.js"));
const MoteurReseau = require(path.join(racine, "assets/js/reseau-cisco.js"));
const { looseReponse, champCorrect, formaterReponse } = require(path.join(racine, "assets/js/probleme.js"));
const Schemas = require(path.join(racine, "assets/js/schemas.js"));
const Graphes = require(path.join(racine, "assets/js/graphes.js"));
const Enquete = require(path.join(racine, "assets/js/enquete.js"));
const Trace = require(path.join(racine, "assets/js/trace.js"));

const bac = {};
vm.createContext(bac);
bac.window = bac;

/* Même ordre de chargement que index.html */
const index = fs.readFileSync(path.join(racine, "index.html"), "utf8");
for (const m of index.matchAll(/<script src="(data\/[^"]+)"/g)) {
  vm.runInContext(fs.readFileSync(path.join(racine, m[1]), "utf8"), bac, { filename: m[1] });
}

let problemes = 0, verifies = 0;
const signaler = (message) => { problemes++; console.log("  ✕ " + message); };

for (const [slug, contenu] of Object.entries(bac.CONTENU)) {
  const ids = new Set();
  for (const chapitre of contenu.chapitres || []) {
    for (const exo of chapitre.exercices || []) {
      if (ids.has(exo.id)) signaler(slug + " : identifiant en double « " + exo.id + " »");
      ids.add(exo.id);
      const banque = exo.type === "qcm" ? exo.questions : exo.type === "jetpunk" ? exo.items : null;
      if (exo.tirage !== undefined && !(Number.isInteger(exo.tirage) && exo.tirage > 0 && exo.tirage <= (banque || []).length)) {
        signaler(slug + "/" + exo.id + " : tirage invalide ou plus grand que la banque");
      }
      if (exo.type === "qcm") {
        (exo.questions || []).forEach((q, n) => {
          const bonnes = [].concat(q.reponse);
          if (!bonnes.length || bonnes.some((i) => !Number.isInteger(i) || i < 0 || i >= (q.choix || []).length)) {
            signaler(slug + "/" + exo.id + " : question " + (n + 1) + ", réponse hors des choix");
          }
        });
      }
      if (exo.type === "terminal") {
        const objs = exo.objectifs || [];
        if (!objs.length) signaler(slug + "/" + exo.id + " : exercice terminal sans objectif");
        objs.forEach((o, n) => {
          verifies++;
          if (!o.solution) { signaler(slug + "/" + exo.id + " : objectif " + (n + 1) + " sans solution"); return; }
          const r = MoteurTerminal.evaluer(o, o.solution);
          if (!r.ok) signaler(slug + "/" + exo.id + " : objectif " + (n + 1) + ", la solution ne valide pas ses propres motifs");
        });
        continue;
      }
      if (exo.type === "probleme") {
        const items = [].concat(exo.exercice || exo.exercices || []);
        if (!items.length) signaler(slug + "/" + exo.id + " : exercice « probleme » sans problème à résoudre");
        const schemas = [exo.exemple && exo.exemple.schema, ...items.map((it) => it.schema)];
        for (const spec of schemas.flatMap((s) => [].concat(s || []))) {
          try {
            if (!/^<svg/.test(Schemas.svg(spec))) signaler(slug + "/" + exo.id + " : schéma « " + spec.type + " » vide");
          } catch (e) {
            signaler(slug + "/" + exo.id + " : schéma invalide — " + e.message);
          }
        }
        items.forEach((it, n) => {
          verifies++;
          if (it.champs) {
            if (!it.champs.length) signaler(slug + "/" + exo.id + " : problème " + (n + 1) + " sans case de réponse");
            it.champs.forEach((c, k) => {
              const ou = slug + "/" + exo.id + " : problème " + (n + 1) + ", case " + (k + 1);
              if (c.reponse == null || String(c.reponse).trim() === "") { signaler(ou + " sans réponse attendue"); return; }
              if (typeof c.reponse === "number" && !Number.isFinite(c.reponse)) { signaler(ou + ", réponse non finie"); return; }
              // La réponse attendue, telle qu'affichée, et chaque variante acceptée doivent être validées.
              for (const r of [formaterReponse(c), ...[].concat(c.accepte || []).map(String)]) {
                if (!champCorrect(r, c)) signaler(ou + ", « " + r + " » n'est pas acceptée");
              }
            });
            return;
          }
          const reps = [].concat(it.reponse).filter((r) => r != null && String(r).trim() !== "");
          if (!reps.length) { signaler(slug + "/" + exo.id + " : problème " + (n + 1) + " sans réponse attendue"); return; }
          // La réponse attendue doit se valider elle-même (invariant de normalisation).
          if (!reps.some((r) => looseReponse(r) === looseReponse(reps[0]))) {
            signaler(slug + "/" + exo.id + " : problème " + (n + 1) + ", réponse incohérente");
          }
        });
        continue;
      }
      if (exo.type === "lecon") {
        verifierLecon(slug + "/" + exo.id, exo);
        continue;
      }
      if (exo.type === "enquete") {
        verifierEnquete(slug + "/" + exo.id, exo);
        continue;
      }
      if (exo.type === "reseau") {
        verifies++;
        const tests = exo.tests || [];
        if (!tests.length) { signaler(slug + "/" + exo.id + " : exercice réseau sans test"); continue; }
        if (!exo.solution) { signaler(slug + "/" + exo.id + " : exercice réseau sans solution"); continue; }
        // La solution doit valider tous les tests.
        const avec = MoteurReseau.construire(exo, {
          topologie: exo.solutionTopologie || null,
          configs: exo.solution
        });
        const bilan = MoteurReseau.verifierTests(avec, tests);
        for (const b of bilan) if (!b.ok) signaler(slug + "/" + exo.id + " : la solution échoue — " + (b.message || "") + " (" + b.detail + ")");
        // Sans la solution, au moins un test doit échouer (exercice non trivial).
        const sans = MoteurReseau.construire(exo, null);
        if (MoteurReseau.verifierTests(sans, tests).every((b) => b.ok)) {
          signaler(slug + "/" + exo.id + " : le réseau est déjà validé sans la solution");
        }
        continue;
      }
      if (exo.type !== "code") continue;
      verifies++;

      const solution = VerifCode.verifier(exo, exo.solution || "");
      if (!solution.ok) {
        signaler(slug + "/" + exo.id + " : la solution échoue");
        if (solution.erreur) console.log("      ligne " + solution.erreur.ligne + " : " + solution.erreur.message);
        for (const c of solution.contraintes) console.log("      contrainte : " + c.message);
        for (const t of solution.tests.filter((t) => !t.ok)) {
          console.log("      test " + t.numero + (t.erreur ? " — " + t.erreur.message : ""));
          for (const l of t.lignes.filter((l) => !l.ok)) console.log("        " + l.cle + " attendu " + l.attendu + ", obtenu " + l.obtenu);
        }
      }
      const depart = VerifCode.verifier(exo, exo.depart || "");
      if (depart.ok) signaler(slug + "/" + exo.id + " : le code de départ réussit déjà");
    }
  }
}

/* ---------------- Enquêtes (moteur assets/js/enquete.js) ---------------- */

/* Toutes les pièces (image, fichier) citées dans une donnée, à toute profondeur. */
function piecesDe(donnee, liste = []) {
  if (Array.isArray(donnee)) donnee.forEach((d) => piecesDe(d, liste));
  else if (donnee && typeof donnee === "object") {
    if (typeof donnee.image === "string") liste.push(donnee.image);
    if (typeof donnee.fichier === "string") liste.push(donnee.fichier);
    Object.values(donnee).forEach((v) => piecesDe(v, liste));
  }
  return liste;
}

function verifierEnquete(ou, enquete) {
  if (!(enquete.methodes || []).length) signaler(ou + " : aucune méthode");
  const challenges = enquete.challenges || [];
  if (!challenges.length) { signaler(ou + " : aucun challenge"); return; }
  for (const chemin of new Set(piecesDe([enquete.methodes, challenges]))) {
    if (!fs.existsSync(path.join(racine, chemin))) signaler(ou + " : pièce introuvable « " + chemin + " »");
  }
  let niveau = 0;
  challenges.forEach((ch, n) => {
    const ici = ou + " / challenge " + (n + 1);
    if ((ch.niveau || 1) < niveau) signaler(ici + " : niveau inférieur au challenge précédent");
    niveau = ch.niveau || 1;
    if (!ch.solution) signaler(ici + " : solution absente");
    if (ch.type === "qcm") {
      const bonnes = [].concat(ch.reponse);
      if (!bonnes.length || bonnes.some((i) => !Number.isInteger(i) || i < 0 || i >= (ch.choix || []).length)) signaler(ici + " : réponse hors des choix");
      return;
    }
    if (!(ch.champs || []).length) { signaler(ici + " : aucune case de réponse"); return; }
    for (const champ of ch.champs) {
      const essais = champ.gps
        ? [champ.gps.join(", "), champ.gps.map((x) => String(x).replace(".", ",")).join(" ")]
        : [].concat(typeof champ.reponse === "number" ? String(champ.reponse) : champ.reponse, champ.accepte || []);
      for (const e of essais) {
        if (!Enquete.champEnqueteCorrect(e, champ)) signaler(ici + " : la case « " + champ.libelle + " » refuse « " + e + " »");
      }
    }
  });
}

/* ---------------- Leçons (moteur assets/js/lecon.js) ---------------- */

/* Tous les schémas contenus dans un objet de données, à toute profondeur. */
function schemasDe(donnee, liste = []) {
  if (Array.isArray(donnee)) donnee.forEach((d) => schemasDe(d, liste));
  else if (donnee && typeof donnee === "object") {
    for (const [cle, val] of Object.entries(donnee)) {
      if (cle === "schema") liste.push(...[].concat(val));
      else if (cle !== "graphe") schemasDe(val, liste);
    }
  }
  return liste;
}

/* Toutes les valeurs d'une clé donnée, à toute profondeur. */
function valeursDe(donnee, cle, liste = []) {
  if (Array.isArray(donnee)) donnee.forEach((d) => valeursDe(d, cle, liste));
  else if (donnee && typeof donnee === "object") {
    for (const [k, val] of Object.entries(donnee)) {
      if (k === cle) liste.push(val);
      else if (k !== "graphe") valeursDe(val, cle, liste);
    }
  }
  return liste;
}

function verifierLecon(ou, lecon) {
  const etapes = lecon.cours || [];
  if (!etapes.length) signaler(ou + " : leçon sans étape de cours");
  etapes.forEach((e, k) => { if (!e.schema && !e.animation) signaler(ou + " : l'étape " + (k + 1) + " du cours n'a ni schéma ni animation"); });
  const parties = [lecon.cours, lecon.problematique, lecon.exemple, lecon.correction, lecon.exercices];
  for (const anim of valeursDe(parties, "animation")) {
    verifies++;
    for (const p of Trace.verifier(anim)) signaler(ou + " : animation — " + p);
  }
  for (const demo of valeursDe(parties, "demo")) {
    const lignes = Array.isArray(demo) ? demo : demo.lignes;
    if (!Array.isArray(lignes) || lignes.length < 2) signaler(ou + " : démonstration de moins de deux lignes");
  }
  for (const partie of ["problematique", "exemple", "correction"]) if (!lecon[partie]) signaler(ou + " : partie « " + partie + " » absente");
  for (const spec of schemasDe([lecon.cours, lecon.problematique, lecon.exemple, lecon.correction, lecon.exercices])) {
    try {
      const svg = spec.type === "graphe" || spec.type === "matrice" ? Graphes.svg(spec) : Schemas.svg(spec);
      if (!/^<svg/.test(svg)) signaler(ou + " : schéma « " + spec.type + " » vide");
    } catch (e) {
      signaler(ou + " : schéma invalide — " + e.message);
    }
  }
  const exos = lecon.exercices || [];
  if (!exos.length) signaler(ou + " : leçon sans exercice");
  let niveau = 0;
  exos.forEach((exo, n) => {
    const ici = ou + " : exercice " + (n + 1);
    verifies++;
    if ((exo.niveau || 1) < niveau) signaler(ici + " : niveau " + exo.niveau + " après un niveau " + niveau);
    niveau = Math.max(niveau, exo.niveau || 1);
    try {
      if (exo.type === "qcm") {
        const bonnes = [].concat(exo.reponse);
        if (!bonnes.length || bonnes.some((i) => !Number.isInteger(i) || i < 0 || i >= (exo.choix || []).length)) signaler(ici + " : réponse hors des choix");
      } else if (exo.type === "champs") {
        if (!(exo.champs || []).length) signaler(ici + " : aucune case");
        (exo.champs || []).forEach((c, k) => {
          if (c.reponse == null || String(c.reponse).trim() === "") { signaler(ici + ", case " + (k + 1) + " sans réponse"); return; }
          const formes = [String(c.reponse), ...[].concat(c.accepte || []).map(String)];
          if (typeof c.reponse === "number") formes.push(formaterReponse(c));
          for (const r of formes) if (!Graphes.champJuste(r, c)) signaler(ici + ", case " + (k + 1) + " : « " + r + " » n'est pas acceptée");
        });
      } else if (["construire", "selection", "ordre"].includes(exo.type)) {
        Graphes.graphe(exo.graphe);
        const sol = Graphes.solution(exo);
        if (!sol) signaler(ici + " : aucune solution (champ « solution » ou réponse attendue)");
        else {
          const r = Graphes.evaluer(exo, sol);
          if (!r.ok) signaler(ici + " : la solution est refusée — " + r.message);
        }
        const depart = exo.type === "construire" ? Graphes.jetons(exo.depart).map((j) => { const m = j.match(/^(.+?)([>\-])(.+)$/); return Graphes.cle(m[1], m[3], m[2] === ">"); }) : [];
        if (Graphes.evaluer(exo, depart).ok) signaler(ici + " : l'exercice est déjà résolu au départ");
      } else if (exo.type === "matrice") {
        const voulu = Graphes.matriceAttendue(exo);
        const zero = voulu.map((l) => l.map(() => 0));
        if (Graphes.evaluer(exo, zero).ok) signaler(ici + " : la matrice nulle est déjà la réponse");
        if (!Graphes.evaluer(exo, voulu).ok) signaler(ici + " : la matrice attendue est refusée");
      } else if (exo.type === "remettre") {
        if ((exo.etapes || []).length < 3) signaler(ici + " : au moins trois étapes à remettre dans l'ordre");
      } else if (exo.type === "lignes" || exo.type === "cout") {
        const sources = String(exo.code || "").split("\n");
        const valide = (n) => Number.isInteger(Number(n)) && n >= 1 && n <= sources.length && /[^\s{}]/.test(sources[n - 1]);
        if (exo.type === "lignes") {
          if (!(exo.reponse || []).length) signaler(ici + " : aucune ligne attendue");
          for (const n of exo.reponse || []) if (!valide(n)) signaler(ici + " : la ligne " + n + " n'existe pas ou est vide");
        } else {
          const lignes = Object.entries(exo.lignes || {});
          if (!lignes.length) signaler(ici + " : aucune ligne à classer");
          for (const [n, classe] of lignes) {
            if (!valide(Number(n))) signaler(ici + " : la ligne " + n + " n'existe pas ou est vide");
            if (!(exo.choix || []).includes(classe)) signaler(ici + " : « " + classe + " » (ligne " + n + ") absent des choix");
          }
        }
      } else signaler(ici + " : type inconnu « " + exo.type + " »");
    } catch (e) {
      signaler(ici + " : " + e.message);
    }
  });
}

console.log(verifies + " exercices de programmation vérifiés, " + problemes + " problème(s).");
process.exitCode = problemes ? 1 : 0;
