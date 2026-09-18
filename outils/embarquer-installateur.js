/* =============================================================
   Réembarque les scripts d'installation dans index.html
   -------------------------------------------------------------
   Le guide « Attaques » propose les scripts d'installation en
   téléchargement. Pour fonctionner hors ligne (file://), leur
   contenu est copié dans des <script type="text/plain"> à la fin
   de index.html :
     - installer-outils.cmd -> id="installateur-outils-windows"
     - installer-outils.sh  -> id="installateur-outils-linux"

   Le HTML normalise toutes les fins de ligne en LF : on stocke
   donc les scripts en LF ici. guide.js réapplique le CRLF au
   téléchargement pour les fichiers .cmd/.bat (exigence de cmd.exe).

   Après toute modification des scripts :
     node outils/embarquer-installateur.js
   ============================================================= */

const fs = require("fs");
const path = require("path");

const racine = path.join(__dirname, "..");
const idx = path.join(racine, "index.html");

const fichiers = [
  { id: "installateur-outils-windows", src: "outils/installer-outils.cmd" },
  { id: "installateur-outils-linux", src: "outils/installer-outils.sh" }
];

const DEBUT = "  <!-- SCRIPTS-INSTALLATION-DEBUT : régénérer avec outils/embarquer-installateur.js -->";
const FIN = "  <!-- SCRIPTS-INSTALLATION-FIN -->";

let blocs = DEBUT + "\n";
for (const f of fichiers) {
  const contenu = fs.readFileSync(path.join(racine, f.src), "utf8").replace(/\r\n/g, "\n");
  if (contenu.includes("</script")) {
    console.error(`« ${f.src} » contient « </script » : embarquage impossible.`);
    process.exit(1);
  }
  blocs +=
    `  <!-- Source : ${f.src} -->\n` +
    `  <script type="text/plain" id="${f.id}">\n` +
    contenu +
    "</script>\n";
}
blocs += FIN + "\n";

let html = fs.readFileSync(idx, "utf8");

const regionActuelle = new RegExp(
  "[ \\t]*<!-- SCRIPTS-INSTALLATION-DEBUT[\\s\\S]*?<!-- SCRIPTS-INSTALLATION-FIN -->\\n?"
);
const ancienBlocUnique = /\n  <!-- installer-outils\.cmd embarqué[\s\S]*?<\/script>\n/;

if (regionActuelle.test(html)) {
  html = html.replace(regionActuelle, blocs);
  console.log("Région des scripts mise à jour dans index.html.");
} else if (ancienBlocUnique.test(html)) {
  html = html.replace(ancienBlocUnique, "\n" + blocs);
  console.log("Ancien bloc unique remplacé par la région à deux scripts.");
} else {
  html = html.replace("</body>", blocs + "\n</body>");
  console.log("Région des scripts insérée dans index.html.");
}

fs.writeFileSync(idx, html);
