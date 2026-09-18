/* =============================================================
   Vérifie les exercices de programmation (type "code")
   -------------------------------------------------------------
   Lancer depuis le dossier du site :   node outils/verifier-exercices.js
   Pour chaque QCM : les réponses désignent des choix existants.
   Pour chaque QCM ou jeu : le « tirage » tient dans la banque.
   Pour chaque « probleme » : chaque problème a une réponse cohérente.
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
const { looseReponse } = require(path.join(racine, "assets/js/probleme.js"));

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
        items.forEach((it, n) => {
          verifies++;
          const reps = [].concat(it.reponse).filter((r) => r != null && String(r).trim() !== "");
          if (!reps.length) { signaler(slug + "/" + exo.id + " : problème " + (n + 1) + " sans réponse attendue"); return; }
          // La réponse attendue doit se valider elle-même (invariant de normalisation).
          if (!reps.some((r) => looseReponse(r) === looseReponse(reps[0]))) {
            signaler(slug + "/" + exo.id + " : problème " + (n + 1) + ", réponse incohérente");
          }
        });
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

console.log(verifies + " exercices de programmation vérifiés, " + problemes + " problème(s).");
process.exitCode = problemes ? 1 : 0;
