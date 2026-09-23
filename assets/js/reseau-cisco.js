/* =============================================================
   Moteur des exercices « reseau » — simulateur Cisco simplifié
   -------------------------------------------------------------
   Deux vues : l'ÉNONCÉ (principe, scénario, objectifs), affiché dans la
   page, et la SCÈNE de configuration, qui s'ouvre EN PLEIN ÉCRAN — une
   simple flèche en haut à gauche (ou Échap) ramène à l'énoncé. Passer
   de l'une à l'autre ne reconstruit rien : la configuration est gardée.

   La scène (plan de travail façon Packet Tracer) contient des
   appareils : routeurs, switches et PC. L'utilisateur peut en
   ajouter, les DÉPLACER à la souris ou au doigt, les relier par un
   câble (choix de l'appareil puis du port), puis ouvrir la console de
   chacun — elle s'ouvre en fenêtre POSÉE SUR LA SCÈNE — pour taper les
   commandes Cisco IOS (adressage, VLAN, routage…). Les câbles sont
   tracés en SVG entre les appareils, avec le nom des ports à chaque
   extrémité, en vert quand les deux ports sont allumés et en rouge
   pointillé sinon ; un clic sur un câble le retire. Le bouton
   « Vérifier » simule le réseau (pings) : si tout passe, c'est validé.

   Deux parties bien séparées :
     - un SIMULATEUR pur (aucun DOM) : construction des appareils à
       partir des commandes, propagation des trames au niveau 2
       (VLAN, trunk) et routage IP au niveau 3, puis « ping ».
       Il est réutilisable sous Node par outils/verifier-exercices.js.
     - le MOTEUR d'affichage (MoteurReseau.lancer) : le plan, les
       consoles et l'écran de résultats. Chaque appareil porte une
       position (x, y) en POURCENTAGE du plan : le schéma reste juste
       quelle que soit la largeur, et les câbles suivent en direct.

   Sous-ensemble Cisco IOS reconnu (abréviations admises) :
     Routeur / switch :
       enable · configure terminal · hostname NOM · exit · end
       interface g0/0 (ou g0/0.10 pour une sous-interface)
       ip address A.B.C.D M.M.M.M · no shutdown · shutdown
       encapsulation dot1q VLAN            (sous-interface)
       ip route RESEAU MASQUE PROCHAIN-SAUT (routeur)
       vlan N · name TEXTE                  (switch)
       switchport mode access|trunk         (switch)
       switchport access vlan N             (switch)
       show ip interface brief · show ip route · show vlan brief
       ping A.B.C.D
     PC (poste simplifié) :
       ip A.B.C.D M.M.M.M [PASSERELLE] · show ip · ping A.B.C.D
   ============================================================= */

(function (racine) {
  "use strict";

  /* =========================================================
     1) OUTILS IP
     ========================================================= */

  function ipVersEntier(ip) {
    const p = String(ip).trim().split(".");
    if (p.length !== 4) return null;
    let n = 0;
    for (const o of p) {
      if (!/^\d+$/.test(o)) return null;
      const v = Number(o);
      if (v < 0 || v > 255) return null;
      n = n * 256 + v;
    }
    return n >>> 0;
  }

  function entierVersIp(n) {
    n = n >>> 0;
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  }

  function estMasqueValide(m) {
    const n = ipVersEntier(m);
    if (n === null) return false;
    // Un masque valide est une suite de 1 suivie de 0.
    const inv = (~n) >>> 0;
    return ((inv + 1) & inv) === 0;
  }

  function memeReseau(ip1, ip2, masque) {
    const a = ipVersEntier(ip1), b = ipVersEntier(ip2), m = ipVersEntier(masque);
    if (a === null || b === null || m === null) return false;
    return ((a & m) >>> 0) === ((b & m) >>> 0);
  }

  function longueurMasque(masque) {
    const m = ipVersEntier(masque);
    let n = 0;
    for (let i = 31; i >= 0; i--) { if ((m >>> i) & 1) n++; else break; }
    return n;
  }

  /* Nom d'interface normalisé : « GigabitEthernet0/0 », « gi0/0 »,
     « g0/0 » → « g0/0 » ; sous-interface « g0/0.10 » conservée. */
  function normInterface(nom) {
    const s = String(nom).trim().toLowerCase().replace(/\s+/g, "");
    const m = s.match(/^([a-z]+)(\d+\/\d+)(?:\.(\d+))?$/);
    if (!m) return null;
    let fam;
    if (/^(g|gi|gig|gigabitethernet)$/.test(m[1])) fam = "g";
    else if (/^(f|fa|fast|fastethernet)$/.test(m[1])) fam = "f";
    else if (/^(e|eth|ethernet)$/.test(m[1])) fam = "e";
    else return null;
    return fam + m[2] + (m[3] ? "." + m[3] : "");
  }

  const NOMS_LONGS = { g: "GigabitEthernet", f: "FastEthernet", e: "Ethernet" };
  function nomLong(nom) {
    const m = String(nom).match(/^([gfe])(.*)$/);
    return m ? NOMS_LONGS[m[1]] + m[2] : nom;
  }
  function portPhysique(nom) { return String(nom).split(".")[0]; }

  /* =========================================================
     2) APPAREILS
     ========================================================= */

  const PORTS = {
    routeur: ["g0/0", "g0/1", "g0/2", "g0/3"],
    switch: ["f0/1", "f0/2", "f0/3", "f0/4", "f0/5", "f0/6", "f0/7", "f0/8", "g0/1", "g0/2"],
    pc: ["eth0"]
  };
  const PREFIXE = { routeur: "R", switch: "SW", pc: "PC" };
  const ETIQUETTE = { routeur: "Routeur", switch: "Switch", pc: "PC" };

  function creerAppareil(nom, type) {
    const base = { nom: nom, type: type, ports: (PORTS[type] || []).slice(), _cli: { mode: "user", ctx: null } };
    if (type === "routeur") {
      base.ifaces = {};        // nom -> { ip, masque, vlan(sous-if), shut }
      base.portShut = {};      // port physique -> true (par défaut éteint)
      base.routes = [];        // { reseau, masque, saut }
    } else if (type === "switch") {
      base.vlans = { 1: "default" };
      base.portCfg = {};       // nom -> { mode:"access"|"trunk", vlan, shut }
    } else if (type === "pc") {
      base.port = "eth0";
      base.ip = null; base.masque = null; base.passerelle = null;
    }
    return base;
  }

  function cfgPort(sw, nom) {
    if (!sw.portCfg[nom]) sw.portCfg[nom] = { mode: "access", vlan: 1, shut: false };
    return sw.portCfg[nom];
  }

  /* Interface active (« line protocol up ») pour le niveau 3. */
  function ifaceActive(dev, nom) {
    if (dev.type === "pc") return !!dev.ip;
    const phys = portPhysique(nom);
    if (dev.portShut[phys] !== false) return false;   // le port physique doit être « no shutdown »
    const f = dev.ifaces[nom];
    if (!f || !f.ip || f.shut) return false;
    return true;
  }

  /* Toutes les adresses IP actives portées par un appareil. */
  function adressesActives(dev) {
    const out = [];
    if (dev.type === "pc") { if (dev.ip) out.push({ ip: dev.ip, masque: dev.masque, nom: "eth0", vlan: null }); return out; }
    if (dev.type !== "routeur") return out;
    for (const nom of Object.keys(dev.ifaces)) {
      if (ifaceActive(dev, nom)) {
        const f = dev.ifaces[nom];
        out.push({ ip: f.ip, masque: f.masque, nom: nom, vlan: f.vlan || null });
      }
    }
    return out;
  }

  /* =========================================================
     3) RÉSEAU (appareils + liens)
     ========================================================= */

  function creerReseau() { return { appareils: {}, liens: [] }; }

  function ajouterAppareil(reseau, dev) { reseau.appareils[dev.nom] = dev; return dev; }

  function nomLibre(reseau, type) {
    const p = PREFIXE[type] || "N";
    let i = 1;
    while (reseau.appareils[p + i]) i++;
    return p + i;
  }

  function portOccupe(reseau, nom, port) {
    return reseau.liens.some((l) =>
      (l.a.n === nom && l.a.p === port) || (l.b.n === nom && l.b.p === port));
  }

  function relier(reseau, na, pa, nb, pb) {
    reseau.liens.push({ a: { n: na, p: pa }, b: { n: nb, p: pb } });
  }

  /* Voisin branché sur un port physique donné : { n, p } ou null. */
  function voisin(reseau, nom, port) {
    for (const l of reseau.liens) {
      if (l.a.n === nom && l.a.p === port) return l.b;
      if (l.b.n === nom && l.b.p === port) return l.a;
    }
    return null;
  }

  /* Propriétaire actif d'une adresse IP : { dev, nom, vlan } ou null. */
  function proprietaireIp(reseau, ip) {
    for (const nom of Object.keys(reseau.appareils)) {
      const dev = reseau.appareils[nom];
      for (const a of adressesActives(dev)) if (a.ip === ip) return { dev: dev, nom: a.nom, vlan: a.vlan };
    }
    return null;
  }

  /* =========================================================
     4) NIVEAU 2 — une trame va-t-elle d'un port à un autre ?
     -----------------------------------------------------------
     depart : { dev, port, tag }  (tag = VLAN de la sous-interface,
               ou null pour une interface simple / un PC)
     cible  : { dev, port, tag }
     Traversée des switches selon le mode des ports (access/trunk).
     ========================================================= */

  function trameAtteint(reseau, depart, cible) {
    const debut = voisin(reseau, depart.dev.nom, depart.port);
    if (!debut) return false;
    const vus = new Set();
    const file = [{ n: debut.n, p: debut.p, tag: depart.tag }];

    while (file.length) {
      const cur = file.shift();
      const cle = cur.n + "|" + cur.p + "|" + cur.tag;
      if (vus.has(cle)) continue;
      vus.add(cle);

      const dev = reseau.appareils[cur.n];
      if (!dev) continue;

      if (dev.type !== "switch") {
        // Extrémité (routeur ou PC) : la trame y arrive telle quelle.
        if (dev.nom === cible.dev.nom && cur.p === cible.port && cur.tag === cible.tag) return true;
        continue; // ces appareils ne commutent pas les trames
      }

      // Switch : le port d'entrée détermine le VLAN interne.
      const pin = cfgPort(dev, cur.p);
      if (pin.shut) continue;
      let vlan;
      if (pin.mode === "access") {
        if (cur.tag !== null) continue;          // un port access rejette les trames étiquetées
        vlan = pin.vlan;
      } else {                                    // trunk
        vlan = cur.tag === null ? 1 : cur.tag;    // VLAN natif 1 non étiqueté
      }

      // On inonde les autres ports qui transportent ce VLAN.
      for (const p2 of dev.ports) {
        if (p2 === cur.p) continue;
        const c2 = cfgPort(dev, p2);
        if (c2.shut) continue;
        const porte = c2.mode === "access" ? c2.vlan === vlan : true; // trunk : tous VLAN
        if (!porte) continue;
        const outTag = c2.mode === "access" ? null : (vlan === 1 ? null : vlan);
        const v = voisin(reseau, dev.nom, p2);
        if (v) file.push({ n: v.n, p: v.p, tag: outTag });
      }
    }
    return false;
  }

  /* =========================================================
     5) NIVEAU 3 — routage et ping
     ========================================================= */

  /* Décision de routage sur un appareil pour joindre destIp.
     Renvoie { local } si l'appareil possède déjà destIp,
     { nom, saut } (interface de sortie + IP du prochain saut) ou null. */
  function etapeRoutage(dev, destIp) {
    const actives = adressesActives(dev);
    for (const a of actives) if (a.ip === destIp) return { local: true };

    if (dev.type === "pc") {
      for (const a of actives) if (memeReseau(a.ip, destIp, a.masque)) return { nom: a.nom, saut: destIp };
      if (dev.passerelle) {
        for (const a of actives) if (memeReseau(a.ip, dev.passerelle, a.masque)) return { nom: a.nom, saut: dev.passerelle };
      }
      return null;
    }

    if (dev.type !== "routeur") return null;

    // 1) Réseaux directement connectés.
    for (const a of actives) if (memeReseau(a.ip, destIp, a.masque)) return { nom: a.nom, saut: destIp };

    // 2) Routes statiques : préfixe le plus long d'abord.
    const candidates = dev.routes
      .filter((r) => memeReseau(r.reseau, destIp, r.masque))
      .sort((x, y) => longueurMasque(y.masque) - longueurMasque(x.masque));
    for (const r of candidates) {
      for (const a of actives) if (memeReseau(a.ip, r.saut, a.masque)) return { nom: a.nom, saut: r.saut };
    }
    return null;
  }

  /* Simule un ping de depIp vers destIp. Renvoie { ok, raison }. */
  function ping(reseau, depIp, destIp) {
    if (ipVersEntier(destIp) === null) return { ok: false, raison: "adresse invalide" };
    const src = proprietaireIp(reseau, depIp);
    if (!src) return { ok: false, raison: "source sans adresse active" };

    let cur = src.dev;
    const vus = new Set();
    for (let ttl = 0; ttl < 24; ttl++) {
      if (adressesActives(cur).some((a) => a.ip === destIp)) return { ok: true };
      if (vus.has(cur.nom)) return { ok: false, raison: "boucle de routage" };
      vus.add(cur.nom);

      const etape = etapeRoutage(cur, destIp);
      if (!etape) return { ok: false, raison: "pas de route vers " + destIp };
      if (etape.local) return { ok: true };

      const cible = proprietaireIp(reseau, etape.saut);
      if (!cible) return { ok: false, raison: "prochain saut injoignable (" + etape.saut + ")" };

      const ifSortie = cur.type === "pc" ? { vlan: null } : (cur.ifaces[etape.nom] || { vlan: null });
      const depart = { dev: cur, port: portPhysique(etape.nom), tag: ifSortie.vlan || null };
      const arrivee = { dev: cible.dev, port: portPhysique(cible.nom), tag: cible.vlan || null };
      if (!trameAtteint(reseau, depart, arrivee)) return { ok: false, raison: "niveau 2 : trame bloquée (VLAN/lien)" };

      if (adressesActives(cible.dev).some((a) => a.ip === destIp)) return { ok: true };
      if (cible.dev.type !== "routeur") return { ok: false, raison: "prochain saut n'est pas un routeur" };
      cur = cible.dev;
    }
    return { ok: false, raison: "TTL expiré" };
  }

  /* =========================================================
     6) INTERPRÉTEUR DE COMMANDES (une ligne à la fois)
     -----------------------------------------------------------
     Renvoie un tableau de lignes de sortie (peut être vide).
     Mute l'appareil et son contexte CLI (dev._cli).
     ========================================================= */

  function invite(dev) {
    const c = dev._cli;
    if (dev.type === "pc") return dev.nom + ">";
    let suffixe = "";
    if (c.mode === "user") suffixe = ">";
    else if (c.mode === "priv") suffixe = "#";
    else if (c.mode === "config") suffixe = "(config)#";
    else if (c.mode === "config-if") suffixe = "(config-if)#";
    else if (c.mode === "config-vlan") suffixe = "(config-vlan)#";
    return dev.nom + suffixe;
  }

  const abr = (mot, court) => mot.startsWith(court) && court.length >= 2;

  function executer(reseau, dev, ligneBrute) {
    const ligne = String(ligneBrute).trim().replace(/\s+/g, " ");
    if (!ligne) return [];
    if (dev.type === "pc") return execPc(reseau, dev, ligne);
    return execIos(reseau, dev, ligne);
  }

  /* ---- PC (poste simplifié, non IOS) ---- */
  function execPc(reseau, dev, ligne) {
    const t = ligne.split(" ");
    const cmd = t[0].toLowerCase();
    if (cmd === "help" || cmd === "?") {
      return ["Commandes : ip <adresse> <masque> [passerelle], ping <adresse>, show ip"];
    }
    if (cmd === "ip") {
      if (t.length < 3) return ["Utilisation : ip <adresse> <masque> [passerelle]"];
      if (ipVersEntier(t[1]) === null) return ["% Adresse IP invalide."];
      if (!estMasqueValide(t[2])) return ["% Masque invalide."];
      if (t[3] && ipVersEntier(t[3]) === null) return ["% Passerelle invalide."];
      dev.ip = t[1]; dev.masque = t[2]; dev.passerelle = t[3] || null;
      return ["Adresse configurée : " + dev.ip + " " + dev.masque + (dev.passerelle ? " (passerelle " + dev.passerelle + ")" : "")];
    }
    if (cmd === "show" || cmd === "ipconfig") {
      return [
        "Adresse IP . . . . : " + (dev.ip || "(aucune)"),
        "Masque . . . . . . : " + (dev.masque || "(aucun)"),
        "Passerelle . . . . : " + (dev.passerelle || "(aucune)")
      ];
    }
    if (cmd === "ping") {
      if (!dev.ip) return ["% PC non configuré (utilisez « ip … »)."];
      if (!t[1]) return ["Utilisation : ping <adresse>"];
      return sortiePing(ping(reseau, dev.ip, t[1]), t[1]);
    }
    return ["% Commande inconnue : " + t[0]];
  }

  function sortiePing(res, cible) {
    const lignes = [
      "Envoi de 5 requêtes ICMP vers " + cible + " :",
      res.ok ? "!!!!!" : "....."
    ];
    lignes.push(res.ok
      ? "Taux de réussite : 100 % (5/5)"
      : "Taux de réussite : 0 % (0/5)" + (res.raison ? "  [" + res.raison + "]" : ""));
    return lignes;
  }

  /* ---- Routeur / switch (IOS) ---- */
  function execIos(reseau, dev, ligne) {
    const c = dev._cli;
    const bas = ligne.toLowerCase();
    const t = bas.split(" ");
    const orig = ligne.split(" ");

    // Navigation entre modes
    if (bas === "exit") {
      if (c.mode === "config-if" || c.mode === "config-vlan") { c.mode = "config"; c.ctx = null; }
      else if (c.mode === "config") c.mode = "priv";
      else if (c.mode === "priv") c.mode = "user";
      return [];
    }
    if (bas === "end") { if (c.mode.startsWith("config")) { c.mode = "priv"; c.ctx = null; } return []; }

    if (c.mode === "user") {
      if (abr("enable", t[0]) || t[0] === "en") { c.mode = "priv"; return []; }
      if (t[0] === "ping") return execPingIos(reseau, dev, orig, c.mode);
      if (t[0] === "show") return execShow(reseau, dev, t);
      return ["% Tapez « enable » pour passer en mode privilégié."];
    }

    if (c.mode === "priv") {
      if (t[0] === "configure" || t[0] === "conf") { c.mode = "config"; return []; }
      if (t[0] === "disable") { c.mode = "user"; return []; }
      if (t[0] === "show") return execShow(reseau, dev, t);
      if (t[0] === "ping") return execPingIos(reseau, dev, orig, c.mode);
      return ["% Commande incomplète. Essayez « configure terminal »."];
    }

    if (c.mode === "config") return execConfig(reseau, dev, t, orig);
    if (c.mode === "config-if") return execConfigIf(reseau, dev, t, orig);
    if (c.mode === "config-vlan") return execConfigVlan(reseau, dev, t, orig);
    return ["% État inconnu."];
  }

  function execPingIos(reseau, dev, orig, mode) {
    if (mode === "user" || mode === "priv") {
      const cible = orig[1];
      if (!cible) return ["Utilisation : ping <adresse>"];
      const src = adressesActives(dev)[0];
      if (!src) return ["% Aucune interface active pour émettre."];
      return sortiePing(ping(reseau, src.ip, cible), cible);
    }
    return ["% « ping » se lance en mode privilégié."];
  }

  function execConfig(reseau, dev, t, orig) {
    const c = dev._cli;
    if (abr("hostname", t[0]) && orig[1]) {
      const nouveau = orig[1];
      if (reseau.appareils[nouveau] && nouveau !== dev.nom) return ["% Un appareil se nomme déjà « " + nouveau + " »."];
      delete reseau.appareils[dev.nom];
      // Renomme dans les liens.
      for (const l of reseau.liens) { if (l.a.n === dev.nom) l.a.n = nouveau; if (l.b.n === dev.nom) l.b.n = nouveau; }
      dev.nom = nouveau; reseau.appareils[nouveau] = dev;
      return [];
    }
    if (abr("interface", t[0]) || t[0] === "int") {
      const nom = normInterface(orig.slice(1).join(""));
      if (!nom) return ["% Interface invalide."];
      const phys = portPhysique(nom);
      if (!dev.ports.includes(phys)) return ["% Cet appareil n'a pas le port " + phys + "."];
      if (dev.type === "routeur" && !dev.ifaces[nom]) dev.ifaces[nom] = { ip: null, masque: null, vlan: null, shut: false };
      c.mode = "config-if"; c.ctx = nom;
      return [];
    }
    if (dev.type === "routeur" && t[0] === "ip" && t[1] === "route") {
      if (orig.length < 5) return ["% Utilisation : ip route <réseau> <masque> <prochain-saut>"];
      const reso = orig[2], masque = orig[3], saut = orig[4];
      if (ipVersEntier(reso) === null || !estMasqueValide(masque) || ipVersEntier(saut) === null) return ["% Paramètres de route invalides."];
      dev.routes.push({ reseau: reso, masque: masque, saut: saut });
      return [];
    }
    if (dev.type === "switch" && abr("vlan", t[0])) {
      const id = Number(t[1]);
      if (!Number.isInteger(id) || id < 1 || id > 4094) return ["% Numéro de VLAN invalide."];
      if (!dev.vlans[id]) dev.vlans[id] = "VLAN" + String(id).padStart(4, "0");
      c.mode = "config-vlan"; c.ctx = id;
      return [];
    }
    return ["% Commande de configuration non reconnue : " + orig.join(" ")];
  }

  function execConfigVlan(reseau, dev, t, orig) {
    const id = dev._cli.ctx;
    if (abr("name", t[0]) && orig[1]) { dev.vlans[id] = orig[1]; return []; }
    return ["% Dans « vlan » : seule « name » est reconnue."];
  }

  function execConfigIf(reseau, dev, t, orig) {
    const nom = dev._cli.ctx;

    if (t[0] === "no" && abr("shutdown", t[1] || "")) {
      if (dev.type === "routeur") dev.portShut[portPhysique(nom)] = false;
      else cfgPort(dev, nom).shut = false;
      return [];
    }
    if (abr("shutdown", t[0])) {
      if (dev.type === "routeur") dev.portShut[portPhysique(nom)] = true;
      else cfgPort(dev, nom).shut = true;
      return [];
    }

    if (dev.type === "routeur") {
      if (t[0] === "ip" && (t[1] === "address" || t[1] === "addr" || t[1] === "add")) {
        if (ipVersEntier(orig[2]) === null || !estMasqueValide(orig[3] || "")) return ["% Utilisation : ip address <adresse> <masque>"];
        dev.ifaces[nom].ip = orig[2]; dev.ifaces[nom].masque = orig[3];
        return [];
      }
      if (t[0] === "encapsulation" || t[0] === "encap") {
        if (t[1] !== "dot1q" && t[1] !== "dot1Q") return ["% Seul « dot1q » est géré."];
        const v = Number(t[2]);
        if (!Number.isInteger(v)) return ["% Numéro de VLAN invalide."];
        if (!nom.includes(".")) return ["% « encapsulation » ne s'utilise que sur une sous-interface (ex. g0/0.10)."];
        dev.ifaces[nom].vlan = v;
        return [];
      }
      return ["% Commande d'interface non reconnue : " + orig.join(" ")];
    }

    // Switch
    if (abr("switchport", t[0]) || t[0] === "sw") {
      if (t[1] === "mode") {
        if (t[2] === "access") { cfgPort(dev, nom).mode = "access"; return []; }
        if (t[2] === "trunk") { cfgPort(dev, nom).mode = "trunk"; return []; }
        return ["% Mode inconnu (access ou trunk)."];
      }
      if (t[1] === "access" && t[2] === "vlan") {
        const v = Number(t[3]);
        if (!Number.isInteger(v)) return ["% Numéro de VLAN invalide."];
        if (!dev.vlans[v]) dev.vlans[v] = "VLAN" + String(v).padStart(4, "0");
        const p = cfgPort(dev, nom); p.mode = "access"; p.vlan = v;
        return [];
      }
      if (t[1] === "trunk") return []; // options de trunk : acceptées sans effet
      return ["% Option switchport non reconnue."];
    }
    return ["% Commande d'interface non reconnue : " + orig.join(" ")];
  }

  /* ---- show ---- */
  function execShow(reseau, dev, t) {
    const sujet = (t[1] || "") + " " + (t[2] || "");
    if (dev.type === "switch" && t[1] === "vlan") return showVlan(dev);
    if (t[1] === "ip" && t[2] === "route" && dev.type === "routeur") return showRoute(dev);
    if (t[1] === "ip" && (t[2] === "interface" || t[2] === "int")) return showIpBrief(dev);
    if (t[1] === "ip" && dev.type === "routeur") return showRoute(dev);
    return ["% « show » géré : show ip interface brief, show ip route, show vlan brief."];
  }

  function aligne(cols, largeurs) {
    return cols.map((c, i) => String(c).padEnd(largeurs[i])).join("").replace(/\s+$/, "");
  }

  function showIpBrief(dev) {
    const L = [22, 16, 22, 10];
    const out = [aligne(["Interface", "IP-Address", "Status", "Protocol"], L)];
    const noms = dev.type === "routeur" ? dev.ports.concat(Object.keys(dev.ifaces).filter((n) => n.includes("."))) : dev.ports;
    const vus = new Set();
    for (const p of noms) {
      if (vus.has(p)) continue; vus.add(p);
      let ip = "unassigned", stat = "administratively down", proto = "down";
      if (dev.type === "routeur") {
        const f = dev.ifaces[p];
        const physUp = dev.portShut[portPhysique(p)] === false;
        if (f && f.ip) ip = f.ip;
        if (physUp) { stat = "up"; proto = ifaceActive(dev, p) ? "up" : "down"; }
      } else {
        stat = cfgPort(dev, p).shut ? "administratively down" : "up";
        proto = cfgPort(dev, p).shut ? "down" : "up";
      }
      out.push(aligne([nomLong(p), ip, stat, proto], L));
    }
    return out;
  }

  function showRoute(dev) {
    const out = ["Codes : C connecté, S statique", ""];
    for (const a of adressesActives(dev)) {
      out.push("C   " + reseauDe(a.ip, a.masque) + "/" + longueurMasque(a.masque) + " connecté, " + nomLong(a.nom));
    }
    for (const r of dev.routes) {
      out.push("S   " + reseauDe(r.reseau, r.masque) + "/" + longueurMasque(r.masque) + " via " + r.saut);
    }
    if (out.length === 2) out.push("(table vide)");
    return out;
  }

  function reseauDe(ip, masque) {
    const a = ipVersEntier(ip), m = ipVersEntier(masque);
    return entierVersIp((a & m) >>> 0);
  }

  function showVlan(dev) {
    const L = [8, 24, 12];
    const out = [aligne(["VLAN", "Name", "Ports"], L)];
    for (const id of Object.keys(dev.vlans).map(Number).sort((a, b) => a - b)) {
      const ports = dev.ports.filter((p) => {
        const c = cfgPort(dev, p);
        return c.mode === "access" && c.vlan === id;
      });
      out.push(aligne([id, dev.vlans[id], ports.join(", ") || "-"], L));
    }
    const trunks = dev.ports.filter((p) => cfgPort(dev, p).mode === "trunk");
    if (trunks.length) out.push("Trunks : " + trunks.join(", "));
    return out;
  }

  /* =========================================================
     7) CONSTRUCTION D'UN RÉSEAU DEPUIS LES DONNÉES
     ========================================================= */

  /* Applique une topologie { appareils:[{nom,type,x,y}], liens:[…] }. */
  function chargerTopologie(reseau, topo) {
    for (const a of (topo && topo.appareils) || []) {
      const dev = creerAppareil(a.nom, a.type);
      dev.x = a.x; dev.y = a.y;
      ajouterAppareil(reseau, dev);
    }
    for (const l of (topo && topo.liens) || []) ajouterLienDonnees(reseau, l);
  }

  function ajouterLienDonnees(reseau, l) {
    const na = l.de, nb = l.vers;
    const da = reseau.appareils[na], db = reseau.appareils[nb];
    const pa = normaliserPortPour(da, l.deIf);
    const pb = normaliserPortPour(db, l.versIf);
    if (da && db && pa && pb) relier(reseau, na, pa, nb, pb);
  }

  function normaliserPortPour(dev, port) {
    if (!dev) return null;
    if (dev.type === "pc") return "eth0";
    return normInterface(port) ? portPhysique(normInterface(port)) : port;
  }

  /* Applique un dictionnaire { nomAppareil: ["cmd", …] }. */
  function appliquerConfigs(reseau, configs) {
    for (const nom of Object.keys(configs || {})) {
      const dev = reseau.appareils[nom];
      if (!dev) continue;
      dev._cli = { mode: dev.type === "pc" ? "user" : "user", ctx: null };
      for (const ligne of configs[nom]) executer(reseau, dev, ligne);
      dev._cli = { mode: "user", ctx: null };
    }
  }

  /* Construit un réseau complet : topologie initiale (+ ajouts de la
     solution), préconfiguration puis configuration donnée. */
  function construire(exo, extra) {
    const reseau = creerReseau();
    chargerTopologie(reseau, exo.topologie);
    if (extra && extra.topologie) chargerTopologie(reseau, extra.topologie);
    if (exo.preconfig) appliquerConfigs(reseau, exo.preconfig);
    if (extra && extra.configs) appliquerConfigs(reseau, extra.configs);
    return reseau;
  }

  /* =========================================================
     8) VÉRIFICATION DES TESTS
     -----------------------------------------------------------
     test = { de, vers, attendu(=true), message }
       de   : nom d'appareil (source du ping)
       vers : nom d'appareil (→ son IP principale) ou adresse IP
     ========================================================= */

  function ipDe(reseau, ref) {
    if (ipVersEntier(ref) !== null) return ref;
    const dev = reseau.appareils[ref];
    if (!dev) return null;
    const a = adressesActives(dev)[0];
    return a ? a.ip : null;
  }

  function evaluerTest(reseau, test) {
    const attendu = test.attendu !== false;
    const src = reseau.appareils[test.de];
    if (!src) return { ok: false, message: test.message, detail: "appareil « " + test.de + " » absent" };
    const srcIp = adressesActives(src)[0];
    const destIp = ipDe(reseau, test.vers);
    if (!srcIp) return { ok: false, message: test.message, detail: test.de + " n'a pas d'adresse active" };
    if (!destIp) return { ok: false, message: test.message, detail: "destination « " + test.vers + " » sans adresse" };
    const r = ping(reseau, srcIp.ip, destIp);
    const ok = r.ok === attendu;
    let detail;
    if (ok) detail = attendu ? "ping réussi" : "isolation respectée (ping bloqué)";
    else if (attendu) detail = "ping échoué — " + (r.raison || "injoignable");
    else detail = "ping réussi alors qu'il devait échouer";
    return { ok: ok, message: test.message, detail: detail, attendu: attendu };
  }

  function verifierTests(reseau, tests) {
    return (tests || []).map((t) => evaluerTest(reseau, t));
  }

  /* API pure exportée */
  const Simu = {
    ipVersEntier, entierVersIp, estMasqueValide, memeReseau, longueurMasque, normInterface,
    creerAppareil, creerReseau, ajouterAppareil, relier, voisin, executer, ping,
    chargerTopologie, appliquerConfigs, construire, verifierTests, evaluerTest,
    adressesActives, proprietaireIp
  };

  /* =========================================================
     9) MOTEUR D'AFFICHAGE (navigateur)
     ========================================================= */

  const MoteurReseau = Object.assign({}, Simu);

  MoteurReseau.lancer = function (conteneur, exo, contexte) {
    if (typeof document === "undefined") return;
    vider(conteneur);

    const etat = {
      conteneur: conteneur, exo: exo, contexte: contexte,
      reseau: construire(exo, null),
      selection: null,
      relierEnCours: null,
      solutionVue: false,
      onglet: "enonce",
      consoles: {}   // nom -> historique du terminal (tableau de {t,cls})
    };

    /* ---- Deux vues ----
       L'énoncé s'affiche dans la page ; la configuration s'ouvre en
       plein écran (une simple flèche en haut à gauche pour revenir).
       Les deux ne sont jamais visibles en même temps, et l'état de la
       scène n'est jamais reconstruit : la configuration est conservée. */
    const enonce = el("div", { class: "code-enonce res-vue res-vue-enonce" });
    const travail = el("div", { class: "code-travail res-vue res-vue-config", tabindex: "-1" });
    etat.vueEnonce = enonce;
    etat.vueConfig = travail;
    conteneur.append(enonce, travail);

    travail.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && etat.onglet === "config") { e.preventDefault(); this._onglet(etat, "enonce"); }
    });

    /* ---- Vue « Énoncé » : principe, scénario, objectifs ---- */
    enonce.append(el("div", { class: "res-vue-tete" },
      el("button", {
        class: "btn btn-principal", type: "button",
        onclick: () => this._onglet(etat, "config")
      }, "🖧 Configurer le réseau →")
    ));
    enonce.append(...cartesPrincipe(exo, "Réseau"));

    if (exo.intro) {
      const sc = el("section", { class: "code-carte" }, el("h3", { texte: "Scénario" }));
      sc.append(...blocsTexte(exo.intro));
      enonce.append(sc);
    }

    const objectif = el("section", { class: "code-carte code-objectif" }, el("h3", { texte: "À configurer" }));
    if (exo.consigne) objectif.append(...blocsTexte(exo.consigne));
    if (exo.objectifs && exo.objectifs.length) {
      const liste = el("ul", { class: "code-puces" });
      for (const o of exo.objectifs) liste.append(el("li", { html: texteRiche(o) }));
      objectif.append(liste);
    }
    enonce.append(objectif);
    etat.panneauObjectif = objectif;

    enonce.append(el("div", { class: "res-vue-pied" },
      el("button", {
        class: "btn btn-principal", type: "button",
        onclick: () => this._onglet(etat, "config")
      }, "Passer à la configuration →")
    ));

    /* ---- Vue « Configuration » : la scène + les résultats ---- */
    const box = el("div", { class: "res-box" });
    travail.append(box);
    etat.box = box;

    const resultats = el("div", { class: "code-resultats res-resultats" });
    travail.append(resultats);
    etat.resultats = resultats;

    this._dessiner(etat);
    this._onglet(etat, "enonce");
    requestAnimationFrame(() => this._dessiner(etat));
  };

  /* Bascule entre l'énoncé et la scène de configuration.
     La scène passe en plein écran ; rien n'est reconstruit, donc la
     configuration (appareils, câbles, consoles) reste telle quelle. */
  MoteurReseau._onglet = function (etat, nom) {
    const plein = nom === "config";
    etat.onglet = nom;
    etat.vueEnonce.hidden = plein;
    etat.vueConfig.hidden = !plein;
    etat.vueConfig.classList.toggle("plein", plein);
    // Le plein écran couvre la page : on fige le défilement derrière lui.
    // App.rendre() remet ce style à zéro si l'on quitte l'exercice.
    try { document.documentElement.style.overflow = plein ? "hidden" : ""; } catch (e) { /* sans effet */ }
    if (plein && etat.vueConfig.focus) requestAnimationFrame(() => etat.vueConfig.focus());
  };

  /* ---------------------------------------------------------
     Plan de travail façon « Packet Tracer »
     -----------------------------------------------------------
     Chaque appareil porte une position (x, y) en POURCENTAGE du
     plan : le schéma reste juste quelle que soit la largeur, et
     les câbles (SVG) se tracent aux mêmes coordonnées.
     --------------------------------------------------------- */

  const SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(balise, attributs) {
    const noeud = document.createElementNS(SVGNS, balise);
    for (const cle of Object.keys(attributs || {})) noeud.setAttribute(cle, attributs[cle]);
    return noeud;
  }

  /* Un port est-il allumé ? (couleur du câble : vert = actif) */
  function portActif(dev, port) {
    if (!dev) return false;
    if (dev.type === "pc") return true;                      // un poste est toujours branché
    if (dev.type === "switch") return !cfgPort(dev, port).shut;
    return dev.portShut[port] === false;                      // routeur : « no shutdown »
  }

  /* Emplacements proposés aux appareils qui n'ont pas de position. */
  const GRILLE_X = [16, 33, 50, 67, 84];
  const GRILLE_Y = [24, 50, 76];

  MoteurReseau._assurerPositions = function (reseau) {
    const pris = [];
    const sansPlace = [];
    for (const nom of Object.keys(reseau.appareils)) {
      const d = reseau.appareils[nom];
      if (typeof d.x === "number" && typeof d.y === "number") pris.push([d.x, d.y]);
      else sansPlace.push(d);
    }
    for (const d of sansPlace) {
      let place = null;
      for (const y of GRILLE_Y) {
        for (const x of GRILLE_X) {
          if (!pris.some((p) => Math.abs(p[0] - x) < 9 && Math.abs(p[1] - y) < 13)) { place = [x, y]; break; }
        }
        if (place) break;
      }
      if (!place) place = [12 + (pris.length * 11) % 74, 18 + (pris.length * 17) % 64];
      d.x = place[0]; d.y = place[1];
      pris.push(place);
    }
  };

  /* Redessine la barre d'outils, le plan et la console ouverte. */
  MoteurReseau._dessiner = function (etat) {
    const box = vider(etat.box);
    const exo = etat.exo;
    const verrou = !!exo.verrouTopologie;

    /* ---- Barre d'outils : la flèche de retour vient en premier ---- */
    const barre = el("div", { class: "res-barre" });
    barre.append(el("button", {
      class: "res-retour", type: "button", title: "Retour à l'énoncé (Échap)",
      "aria-label": "Retour à l'énoncé",
      onclick: () => this._onglet(etat, "enonce")
    }, "←"));

    const palette = exo.palette || (verrou ? [] : ["routeur", "switch", "pc"]);
    if (!verrou && palette.length) {
      for (const type of palette) {
        barre.append(el("button", {
          class: "btn btn-doux btn-petit", type: "button",
          onclick: () => this._ajouter(etat, type)
        }, "+ " + ETIQUETTE[type]));
      }
      barre.append(el("button", {
        class: "btn btn-fantome btn-petit" + (etat.relierEnCours ? " actif" : ""), type: "button",
        onclick: () => {
          etat.relierEnCours = etat.relierEnCours ? null : { a: null, choix: null };
          this._dessiner(etat);
        }
      }, etat.relierEnCours ? "✕ Annuler le câble" : "🔌 Relier"));
    }
    barre.append(el("span", { class: "res-espace" }));
    barre.append(el("button", {
      class: "btn btn-principal btn-petit", type: "button",
      onclick: () => this._verifier(etat)
    }, "✓ Vérifier"));
    box.append(barre);

    /* ---- Aide au câblage / choix du port ---- */
    const r = etat.relierEnCours;
    if (r && r.choix) {
      const rang = el("div", { class: "res-ports" },
        el("span", { class: "res-ports-titre", texte: "Port de " + r.choix.nom + " :" }));
      for (const p of r.choix.ports) {
        rang.append(el("button", {
          class: "btn btn-doux btn-petit", type: "button",
          onclick: () => this._choisirPort(etat, p)
        }, p));
      }
      box.append(rang);
    } else if (r) {
      box.append(el("p", { class: "res-aide", texte: r.a
        ? "Câble parti de " + r.a.nom + " (" + r.a.port + ") — cliquez le second appareil."
        : "Cliquez le premier appareil à relier." }));
    }

    /* ---- Le plan, avec la console posée dessus ---- */
    const plan = this._plan(etat);
    if (etat.selection && etat.reseau.appareils[etat.selection]) {
      plan.append(this._console(etat, etat.reseau.appareils[etat.selection]));
    }
    box.append(plan);
  };

  /* ---- Le plan : câbles (SVG) sous les appareils (HTML) ---- */
  MoteurReseau._plan = function (etat) {
    this._assurerPositions(etat.reseau);

    const plan = el("div", { class: "res-plan" + (etat.relierEnCours ? " cablage" : "") });
    etat.planDom = plan;
    etat.noeudsDom = {};
    etat.cablesDom = [];

    const svg = svgEl("svg", { class: "res-cables" });
    plan.append(svg);

    const verrou = !!etat.exo.verrouTopologie;
    for (const lien of etat.reseau.liens) {
      const da = etat.reseau.appareils[lien.a.n];
      const db = etat.reseau.appareils[lien.b.n];
      if (!da || !db) continue;
      const actif = portActif(da, lien.a.p) && portActif(db, lien.b.p);

      // Trait large et transparent : cible de clic pour retirer le câble.
      const zone = svgEl("line", { class: "res-cable-zone" + (verrou ? " fige" : "") });
      const titre = svgEl("title", {});
      titre.textContent = lien.a.n + " " + lien.a.p + " ↔ " + lien.b.n + " " + lien.b.p
        + (verrou ? "" : " — cliquez pour retirer ce câble");
      zone.append(titre);
      if (!verrou) {
        zone.addEventListener("click", () => {
          const i = etat.reseau.liens.indexOf(lien);
          if (i < 0) return;
          etat.reseau.liens.splice(i, 1);
          toast("Câble retiré : " + lien.a.n + " " + lien.a.p + " ↔ " + lien.b.n + " " + lien.b.p);
          this._dessiner(etat);
        });
      }

      const ligne = svgEl("line", { class: "res-cable " + (actif ? "actif" : "eteint") });
      const ta = svgEl("text", { class: "res-cable-port", "text-anchor": "middle" });
      const tb = svgEl("text", { class: "res-cable-port", "text-anchor": "middle" });
      ta.textContent = lien.a.p;
      tb.textContent = lien.b.p;
      svg.append(zone, ligne, ta, tb);
      etat.cablesDom.push({ zone: zone, ligne: ligne, ta: ta, tb: tb, da: da, db: db });
    }

    const noms = Object.keys(etat.reseau.appareils);
    if (!noms.length) {
      plan.append(el("p", { class: "res-vide", texte: "Ajoutez des appareils avec les boutons ci-dessus, puis reliez-les." }));
    }
    for (const nom of noms) {
      const noeud = this._noeud(etat, etat.reseau.appareils[nom]);
      etat.noeudsDom[nom] = noeud;
      plan.append(noeud);
    }

    this._placer(etat);
    return plan;
  };

  /* Applique les positions courantes (appelé aussi pendant un glisser). */
  MoteurReseau._placer = function (etat) {
    for (const nom of Object.keys(etat.noeudsDom)) {
      const dev = etat.reseau.appareils[nom];
      const noeud = etat.noeudsDom[nom];
      if (!dev || !noeud) continue;
      noeud.style.left = dev.x + "%";
      noeud.style.top = dev.y + "%";
    }
    for (const c of etat.cablesDom) {
      for (const trait of [c.ligne, c.zone]) {
        if (!trait) continue;
        trait.setAttribute("x1", c.da.x + "%");
        trait.setAttribute("y1", c.da.y + "%");
        trait.setAttribute("x2", c.db.x + "%");
        trait.setAttribute("y2", c.db.y + "%");
      }
      // Étiquettes de port posées près de chaque extrémité.
      const pose = (t, part) => {
        t.setAttribute("x", (c.da.x + (c.db.x - c.da.x) * part) + "%");
        t.setAttribute("y", (c.da.y + (c.db.y - c.da.y) * part - 1.5) + "%");
      };
      pose(c.ta, 0.27);
      pose(c.tb, 0.73);
    }
  };

  /* ---- Un appareil sur le plan ---- */
  MoteurReseau._noeud = function (etat, dev) {
    const icone = { routeur: "🛜", switch: "🔀", pc: "💻" }[dev.type] || "▫";
    const choisi = etat.selection === dev.nom;
    const depart = etat.relierEnCours && etat.relierEnCours.a && etat.relierEnCours.a.nom === dev.nom;

    const noeud = el("div", {
      class: "res-noeud" + (choisi ? " actif" : "") + (depart ? " arme" : ""),
      role: "button", tabindex: "0", title: dev.nom + " — " + ETIQUETTE[dev.type]
    },
      el("span", { class: "res-noeud-icone", texte: icone }),
      el("span", { class: "res-noeud-nom", texte: dev.nom }),
      el("span", { class: "res-noeud-type", texte: ETIQUETTE[dev.type] })
    );

    const ouvrir = () => {
      if (etat.relierEnCours) { this._clicRelier(etat, dev); return; }
      etat.selection = choisi ? null : dev.nom;
      this._dessiner(etat);
    };

    noeud.addEventListener("click", () => {
      // Un glisser ne doit pas ouvrir la console.
      if (etat.glisse && etat.glisse.bouge) { etat.glisse = null; return; }
      etat.glisse = null;
      ouvrir();
    });
    noeud.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ouvrir(); }
    });

    if (!etat.exo.verrouTopologie) {
      noeud.append(el("span", {
        class: "res-x res-noeud-x", title: "Supprimer " + dev.nom,
        onclick: (e) => {
          e.stopPropagation();
          delete etat.reseau.appareils[dev.nom];
          etat.reseau.liens = etat.reseau.liens.filter((l) => l.a.n !== dev.nom && l.b.n !== dev.nom);
          if (etat.selection === dev.nom) etat.selection = null;
          this._dessiner(etat);
        }
      }, "✕"));
    }

    this._glisser(etat, noeud, dev);
    return noeud;
  };

  /* ---- Déplacer un appareil à la souris ou au doigt ---- */
  MoteurReseau._glisser = function (etat, noeud, dev) {
    noeud.addEventListener("pointerdown", (e) => {
      if (etat.relierEnCours) return;
      if (e.target && e.target.classList && e.target.classList.contains("res-noeud-x")) return;
      const plan = etat.planDom;
      if (!plan || !plan.getBoundingClientRect) return;
      const cadre = plan.getBoundingClientRect();
      if (!cadre.width || !cadre.height) return;
      etat.glisse = { dev: dev, bouge: false, cadre: cadre };
      if (noeud.setPointerCapture) noeud.setPointerCapture(e.pointerId);
    });

    noeud.addEventListener("pointermove", (e) => {
      const g = etat.glisse;
      if (!g || g.dev !== dev) return;
      const x = Math.min(94, Math.max(6, ((e.clientX - g.cadre.left) / g.cadre.width) * 100));
      const y = Math.min(90, Math.max(10, ((e.clientY - g.cadre.top) / g.cadre.height) * 100));
      if (Math.abs(x - dev.x) > 0.7 || Math.abs(y - dev.y) > 0.7) g.bouge = true;
      dev.x = x; dev.y = y;
      this._placer(etat);
    });

    noeud.addEventListener("pointerup", (e) => {
      if (noeud.releasePointerCapture) {
        try { noeud.releasePointerCapture(e.pointerId); } catch (err) { /* déjà relâché */ }
      }
      // etat.glisse est lu puis effacé par le « click » qui suit.
    });
  };

  MoteurReseau._ajouter = function (etat, type) {
    const nom = nomLibre(etat.reseau, type);
    ajouterAppareil(etat.reseau, creerAppareil(nom, type));
    etat.selection = nom;
    this._dessiner(etat);
  };

  /* ---- Câblage en deux temps : appareil puis port ---- */
  MoteurReseau._clicRelier = function (etat, dev) {
    const r = etat.relierEnCours;
    const libres = this._portsLibres(etat.reseau, dev.nom);
    if (!libres.length) { toast("Aucun port libre sur " + dev.nom + "."); return; }

    if (!r.a) {
      if (libres.length === 1) r.a = { nom: dev.nom, port: libres[0] };
      else r.choix = { nom: dev.nom, cote: "a", ports: libres };
      this._dessiner(etat);
      return;
    }
    if (r.a.nom === dev.nom) { toast("Choisissez un autre appareil."); return; }
    if (libres.length === 1) { this._brancher(etat, r.a, { nom: dev.nom, port: libres[0] }); return; }
    r.choix = { nom: dev.nom, cote: "b", ports: libres };
    this._dessiner(etat);
  };

  MoteurReseau._choisirPort = function (etat, port) {
    const r = etat.relierEnCours;
    const choix = r.choix;
    r.choix = null;
    if (choix.cote === "a") { r.a = { nom: choix.nom, port: port }; this._dessiner(etat); return; }
    this._brancher(etat, r.a, { nom: choix.nom, port: port });
  };

  MoteurReseau._brancher = function (etat, a, b) {
    relier(etat.reseau, a.nom, a.port, b.nom, b.port);
    etat.relierEnCours = null;
    toast("Câble posé : " + a.nom + " " + a.port + " ↔ " + b.nom + " " + b.port);
    this._dessiner(etat);
  };

  MoteurReseau._portsLibres = function (reseau, nom) {
    const dev = reseau.appareils[nom];
    return dev ? dev.ports.filter((p) => !portOccupe(reseau, nom, p)) : [];
  };

  /* ---- Console (terminal) d'un appareil ---- */
  MoteurReseau._console = function (etat, dev) {
    if (!etat.consoles[dev.nom]) {
      etat.consoles[dev.nom] = [{ t: dev.type === "pc"
        ? "Poste " + dev.nom + " — tapez « help » pour les commandes."
        : "Console de " + dev.nom + " — « enable » puis « configure terminal ».", cls: "term-info" }];
    }

    const sortie = el("div", { class: "term-sortie res-term-sortie" });
    for (const l of etat.consoles[dev.nom]) sortie.append(el("div", { class: "term-ligne-sortie " + (l.cls || ""), texte: l.t }));

    const saisie = el("input", {
      class: "term-saisie", type: "text", spellcheck: "false",
      autocomplete: "off", autocapitalize: "off", "aria-label": "Ligne de commande"
    });
    const inviteSpan = el("span", { class: "term-invite", texte: invite(dev) });

    const soumettre = () => {
      const v = saisie.value; saisie.value = "";
      const hist = etat.consoles[dev.nom];
      hist.push({ t: invite(dev) + " " + v, cls: "term-echo" });
      const sorties = v.trim() ? executer(etat.reseau, dev, v) : [];
      for (const s of sorties) hist.push({ t: s, cls: /^%|échou|bloqu|invalide|inconnu/i.test(s) ? "term-ko" : /!!!!!|réussite : 100|configur/i.test(s) ? "term-ok" : "" });
      // Redessiner uniquement la console (le nom a pu changer via hostname).
      etat.selection = dev.nom;
      this._dessiner(etat);
    };

    saisie.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); soumettre(); } });

    /* La console est une fenêtre posée sur la scène (comme Packet Tracer). */
    const term = el("div", { class: "term res-term" },
      el("div", { class: "term-barre" },
        el("span", { class: "term-pastilles" }, el("i"), el("i"), el("i")),
        el("span", { class: "term-titre", texte: dev.nom + " — " + ETIQUETTE[dev.type] }),
        el("span", { class: "ed-espace" }),
        el("button", {
          class: "res-term-fermer", type: "button", title: "Fermer la console",
          onclick: () => { etat.selection = null; this._dessiner(etat); }
        }, "✕")
      ),
      sortie,
      el("label", { class: "term-ligne" }, inviteSpan, saisie)
    );
    requestAnimationFrame(() => { sortie.scrollTop = sortie.scrollHeight; saisie.focus(); });
    return term;
  };

  /* ---- Vérification (bouton) ---- */
  MoteurReseau._verifier = function (etat) {
    const resultats = etat.exo.tests || [];
    const bilan = verifierTests(etat.reseau, resultats);
    const reussis = bilan.filter((b) => b.ok).length;
    const total = Math.max(1, bilan.length);
    const tousOk = reussis === bilan.length && bilan.length > 0;

    Progres.ecrire(etat.contexte.slug, etat.exo.id, reussis, total);

    const zone = vider(etat.resultats);
    const bandeau = el("div", { class: "code-bandeau " + (tousOk ? "ok" : "ko") },
      el("b", { texte: tousOk ? "✓ Réseau validé" : "✕ " + reussis + " / " + bilan.length + " test" + (bilan.length > 1 ? "s" : "") + " réussi" + (reussis > 1 ? "s" : "") })
    );
    if (tousOk && etat.contexte.suivant) {
      bandeau.append(el("button", { class: "btn btn-principal btn-petit", onclick: () => App.aller(etat.contexte.suivant.hash) }, "Exercice suivant →"));
    }
    zone.append(bandeau);

    const liste = el("div", { class: "code-tests" });
    for (const b of bilan) {
      liste.append(el("div", { class: "code-test " + (b.ok ? "ok" : "ko") },
        el("div", { class: "code-test-tete" },
          el("span", { class: "code-test-marque", texte: b.ok ? "✓" : "✕" }),
          el("span", { texte: b.message || b.detail }),
          el("span", { class: "code-test-entrees", texte: b.detail })
        )
      ));
    }
    zone.append(liste);

    if (!tousOk && etat.exo.solution) {
      const boite = el("div", { class: "code-solution" });
      const bouton = el("button", { class: "btn btn-fantome btn-petit", type: "button" }, "Afficher la solution");
      bouton.addEventListener("click", () => {
        etat.solutionVue = true;
        bouton.replaceWith(this._afficherSolution(etat));
      });
      boite.append(bouton);
      zone.append(boite);
    }

    if (tousOk && etat.contexte.surFin) etat.contexte.surFin(reussis, total);
    zone.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  MoteurReseau._afficherSolution = function (etat) {
    const boite = el("div", { class: "res-solution" }, el("h4", { texte: "Solution — commandes par appareil" }));
    const sol = etat.exo.solution || {};
    if (etat.exo.solutionTopologie) {
      boite.append(el("p", { class: "res-aide", texte: "Topologie attendue : ajoutez et reliez les appareils indiqués dans le scénario." }));
    }
    for (const nom of Object.keys(sol)) {
      boite.append(MoteurGuide._commande(sol[nom].join("\n"), nom));
    }
    return boite;
  };

  /* Exports */
  if (typeof module !== "undefined" && module.exports) module.exports = MoteurReseau;
  racine.MoteurReseau = MoteurReseau;
})(typeof window !== "undefined" ? window : globalThis);
