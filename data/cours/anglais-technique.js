/* =============================================================
   Anglais technique — Technical English III
   -------------------------------------------------------------
   Structure et exemples complets : voir data/cours/_modele.js
   Contenu tiré des séances 2 à 4, du devoir « Cyber-physical
   attacks » et de la liste « Common phrasal verbs for work ».
   ============================================================= */

(function () {

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 2 : History of cyber attacks
     --------------------------------------------------------- */
  const voc2 = [
    { indice: "to get something by force or threats, or with difficulty", reponse: "extort", note: "extorquer" },
    { indice: "proof that shows somebody is guilty of a crime", reponse: "incriminating evidence", note: "des preuves accablantes (deux mots)" },
    { indice: "said of a court: to accuse somebody officially of a crime", reponse: "indict", note: "inculper, mettre en accusation" },
    { indice: "to commit a crime or a violent and harmful act", reponse: "perpetrate", note: "perpétrer" },
    { indice: "to prevent something from happening or from being seen", reponse: "suppress", note: "étouffer, réprimer" },
    { indice: "similar to, of the same nature as", reponse: "akin", note: "apparenté à, semblable à" },
    { indice: "to make someone return for trial to another country", reponse: "extradite", note: "extrader" },
    { indice: "to let something powerful happen that cannot be controlled", reponse: "unleash", note: "déchaîner, déclencher" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 3 : Press review on cyber attacks
     --------------------------------------------------------- */
  const voc3 = [
    { indice: "to enter a network or an organization secretly", reponse: "infiltrate", note: "infiltrer" },
    { indice: "to take data out of a network secretly", reponse: "exfiltrate", note: "exfiltrer (contraire d'infiltrate)" },
    { indice: "to discover or describe the exact facts about something", reponse: "pinpoint", note: "localiser précisément" },
    { indice: "done in order to avoid something", reponse: "evasive", note: "évasif" },
    { indice: "an action taken against an unwanted action", reponse: "countermeasure", note: "une contre-mesure" },
    { indice: "to make something less harmful", reponse: "mitigate", note: "atténuer, réduire" },
    { indice: "to protect something, to keep it safe", reponse: "safeguard", note: "préserver, protéger" },
    { indice: "a massive, aggressive and overwhelming attack", reponse: "cyber onslaught", note: "un déferlement d'attaques (deux mots)" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 4 : Fake news and AI
     --------------------------------------------------------- */
  const voc4 = [
    { indice: "the title of an article, printed in large letters", reponse: "headline", note: "un titre, un gros titre" },
    { indice: "false information spread on purpose in order to deceive", reponse: "disinformation", note: "la désinformation délibérée" },
    { indice: "false information spread without the intention to deceive", reponse: "misinformation", note: "une information erronée relayée de bonne foi" },
    { indice: "tricks played on somebody for a joke", reponse: "pranks", alt: ["prank"], note: "des canulars" },
    { indice: "fake, not genuine", reponse: "phony", note: "bidon, factice" },
    { indice: "a term that covers many different things at once", reponse: "catch-all", note: "un terme fourre-tout" },
    { indice: "to reach more and more people", reponse: "spread", note: "se propager, se répandre" },
    { indice: "to make somebody believe something that is not true", reponse: "mislead", note: "induire en erreur" },
    { indice: "to weaken something gradually", reponse: "undermine", note: "saper, miner" },
    { indice: "carefully finished, looking professional", reponse: "polished", note: "soigné, léché" },
    { indice: "that you can trust and depend on", reponse: "reliable", note: "fiable" },
    { indice: "probable, expected to happen", reponse: "likely", note: "probable" },
    { indice: "not required to explain or justify its actions", reponse: "unaccountable", note: "qui n'a de comptes à rendre à personne" },
    { indice: "shocking, completely unacceptable", reponse: "outrageous", note: "scandaleux" },
    { indice: "to become useless after having been useful for a while", reponse: "outlive its usefulness", note: "ne plus servir à rien (trois mots)" },
    { indice: "coming from the middle of a situation or a group", reponse: "from the midst of", note: "du beau milieu de (quatre mots)" },
    { indice: "to make sense of separate facts by assembling them", reponse: "put the pieces together", note: "reconstituer le puzzle (quatre mots)" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Devoir : Cyber-physical attacks (CNBC)
     --------------------------------------------------------- */
  const vocDevoir = [
    { indice: "to imagine a future situation", reponse: "envision", note: "se représenter, envisager" },
    { indice: "malware that encrypts your data and demands a payment", reponse: "ransomware", note: "un rançongiciel" },
    { indice: "to dig deep into something and hide there", reponse: "burrow", note: "s'enfouir, se terrer" },
    { indice: "the water, power and transport systems a country depends on", reponse: "critical infrastructure", note: "les infrastructures critiques (deux mots)" },
    { indice: "to burn something completely", reponse: "incinerate", note: "incinérer" },
    { indice: "an instrument that measures pressure or temperature", reponse: "gauge", note: "une jauge, un manomètre" },
    { indice: "to get stuck and stop moving, said of a valve", reponse: "jam", note: "se bloquer, se coincer" },
    { indice: "to get around a rule or a protection", reponse: "circumvent", note: "contourner" },
    { indice: "an explosion", reponse: "blast", note: "une explosion, un souffle" },
    { indice: "to cause great damage and disorder", reponse: "wreak havoc", note: "faire des ravages (deux mots)" },
    { indice: "equivalent to, just as serious as", reponse: "tantamount to", note: "équivalent à (deux mots)" },
    { indice: "the vulnerable point of a system", reponse: "weak spot", note: "un point faible (deux mots)" },
    { indice: "an old system still in use, with weak protections", reponse: "legacy system", note: "un système hérité (deux mots)" },
    { indice: "the period during which a system is not working", reponse: "downtime", note: "l'indisponibilité, l'arrêt de service" },
    { indice: "to improve one's level, to become more dangerous", reponse: "up their game", note: "monter d'un cran (trois mots)" },
    { indice: "proven by experience, known to work", reponse: "tried and true", note: "qui a fait ses preuves (trois mots)" },
    { indice: "large areas or large parts of something", reponse: "swaths", alt: ["swath"], note: "des pans entiers" },
    { indice: "an attacker who acts completely alone", reponse: "lone wolf", note: "un loup solitaire (deux mots)" }
  ];

  /* ---------------------------------------------------------
     PHRASAL VERBS — add … do
     --------------------------------------------------------- */
  const phrasal1 = [
    { indice: "to equal a total: your purchases ___ $3,900", reponse: "add up to", note: "s'élever à (trois mots)" },
    { indice: "to stop functioning; also: to divide into smaller parts", reponse: "break down", note: "tomber en panne ; décomposer" },
    { indice: "to interrupt a discussion", reponse: "break in", note: "s'immiscer, interrompre" },
    { indice: "to start talking about a subject", reponse: "bring up", note: "aborder un sujet" },
    { indice: "to support someone in a decision", reponse: "back up", note: "soutenir, appuyer" },
    { indice: "to cancel a meeting at the last minute", reponse: "call off", note: "annuler" },
    { indice: "to ask someone for an opinion or to do something", reponse: "call on", note: "solliciter, faire appel à" },
    { indice: "to get to the same point as someone else", reponse: "catch up", note: "rattraper son retard" },
    { indice: "to find something unexpectedly", reponse: "come across", note: "tomber sur" },
    { indice: "to contact someone by phone", reponse: "call up", note: "appeler" },
    { indice: "to investigate, to have a look at something", reponse: "check out", note: "aller voir, vérifier" },
    { indice: "to volunteer for a task or to give evidence", reponse: "come forward", note: "se manifester" },
    { indice: "to rely on someone or something", reponse: "count on", note: "compter sur" },
    { indice: "to draw a line through a mistake", reponse: "cross out", note: "rayer, barrer" },
    { indice: "to interrupt a conversation to ask a question", reponse: "cut in", note: "couper la parole" },
    { indice: "to stop providing electricity or a service", reponse: "cut off", note: "couper, interrompre" },
    { indice: "to stop doing something that does not work", reponse: "cut out", note: "arrêter, laisser tomber" },
    { indice: "to do something again from the start", reponse: "do over", note: "refaire" },
    { indice: "to discard old rules, to get rid of them", reponse: "do away with", note: "supprimer (trois mots)" }
  ];

  /* ---------------------------------------------------------
     PHRASAL VERBS — figure … hand
     --------------------------------------------------------- */
  const phrasal2 = [
    { indice: "to understand or resolve a problem", reponse: "figure out", note: "comprendre, trouver la solution" },
    { indice: "to return; also: to receive something you had before", reponse: "get back", note: "revenir ; récupérer" },
    { indice: "to overcome a problem or a shock", reponse: "get over", note: "se remettre de" },
    { indice: "to finally find the time to do something", reponse: "get around to", note: "trouver enfin le temps de (trois mots)" },
    { indice: "to meet, to gather with other people", reponse: "get together", note: "se réunir" },
    { indice: "to reveal hidden information about someone", reponse: "give away", note: "révéler, trahir" },
    { indice: "to reluctantly stop fighting or arguing", reponse: "give in", note: "céder" },
    { indice: "to give something to many people, usually for free", reponse: "give out", note: "distribuer" },
    { indice: "to try to achieve or obtain something", reponse: "go after", note: "viser, briguer" },
    { indice: "to compete with or oppose someone", reponse: "go against", note: "aller à l'encontre de" },
    { indice: "to review something again in detail", reponse: "go over", note: "passer en revue" },
    { indice: "to submit a report to a manager", reponse: "hand in", note: "rendre, remettre" },
    { indice: "to give something, usually unwillingly", reponse: "hand over", note: "céder, remettre" }
  ];

  /* ---------------------------------------------------------
     PHRASAL VERBS — look … work
     --------------------------------------------------------- */
  const phrasal3 = [
    { indice: "to be excited about something in the future", reponse: "look forward to", note: "attendre avec impatience (trois mots)" },
    { indice: "to investigate a possibility", reponse: "look into", note: "étudier, se pencher sur" },
    { indice: "to check and examine a document quickly", reponse: "look over", note: "parcourir, examiner" },
    { indice: "to admire and respect someone", reponse: "look up to", note: "admirer, prendre pour modèle (trois mots)" },
    { indice: "to choose one candidate among many", reponse: "pick out", note: "sélectionner" },
    { indice: "to postpone something until later", reponse: "put off", note: "remettre à plus tard" },
    { indice: "to assemble a team or a document", reponse: "put together", note: "constituer, monter" },
    { indice: "to establish or arrange an operation", reponse: "set up", note: "mettre en place" },
    { indice: "to organize or resolve a problem", reponse: "sort out", note: "régler, trier" },
    { indice: "to continue doing something, to follow the rules", reponse: "stick to", note: "s'en tenir à" },
    { indice: "to consider something before answering", reponse: "think over", note: "réfléchir à" },
    { indice: "to refuse or reject an opportunity", reponse: "turn down", note: "refuser, décliner" },
    { indice: "to be successful, to end well", reponse: "work out", note: "bien se passer, aboutir" }
  ];

  const toutLeVocabulaire = [].concat(voc2, voc3, voc4, vocDevoir, phrasal1, phrasal2, phrasal3);

  /* =========================================================
     CONTENU
     ========================================================= */
  CONTENU["anglais-technique"] = {
    chapitres: [

      {
        id: "vocabulaire",
        titre: "Chapitre 1 — Vocabulaire des séances",
        description: "Le lexique de chaque séance : la définition s'affiche, vous tapez le mot anglais.",
        exercices: [
          {
            type: "jetpunk",
            id: "voc-s2",
            titre: "Séance 2 — History of cyber attacks",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 240,
            colonnes: 2,
            melanger: true,
            items: voc2
          },
          {
            type: "jetpunk",
            id: "voc-s3",
            titre: "Séance 3 — Press review on cyber attacks",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 240,
            colonnes: 2,
            melanger: true,
            items: voc3
          },
          {
            type: "jetpunk",
            id: "voc-s4",
            titre: "Séance 4 — Fake news and AI",
            consigne: "Tapez le mot ou l'expression qui correspond à chaque définition.",
            temps: 360,
            colonnes: 3,
            melanger: true,
            items: voc4
          },
          {
            type: "jetpunk",
            id: "voc-devoir",
            titre: "Devoir — Cyber-physical attacks",
            consigne: "Le lexique de l'article à préparer pour l'oral.",
            temps: 360,
            colonnes: 3,
            melanger: true,
            items: vocDevoir
          }
        ]
      },

      {
        id: "phrasal-verbs",
        titre: "Chapitre 2 — Common phrasal verbs for work",
        description: "Les verbes à particule de la liste du cours, en trois séries.",
        exercices: [
          {
            type: "jetpunk",
            id: "phrasal-1",
            titre: "Phrasal verbs — de add à do",
            consigne: "Tapez le verbe à particule qui correspond à chaque définition.",
            temps: 420,
            colonnes: 3,
            melanger: true,
            items: phrasal1
          },
          {
            type: "jetpunk",
            id: "phrasal-2",
            titre: "Phrasal verbs — de figure à hand",
            consigne: "Tapez le verbe à particule qui correspond à chaque définition.",
            temps: 300,
            colonnes: 3,
            melanger: true,
            items: phrasal2
          },
          {
            type: "jetpunk",
            id: "phrasal-3",
            titre: "Phrasal verbs — de look à work",
            consigne: "Tapez le verbe à particule qui correspond à chaque définition.",
            temps: 300,
            colonnes: 3,
            melanger: true,
            items: phrasal3
          }
        ]
      },

      {
        id: "revision",
        titre: "Chapitre 3 — Révision du semestre",
        description: "Tout le lexique et tous les phrasal verbs réunis.",
        exercices: [
          {
            type: "jetpunk",
            id: "voc-tout",
            titre: "Vocabulaire du semestre",
            consigne: "Vingt mots tirés au hasard parmi tous ceux des séances et de la liste de phrasal verbs.",
            temps: 480,
            colonnes: 4,
            melanger: true,
            tirage: 20,
            items: toutLeVocabulaire
          }
        ]
      }

    ]
  };

})();
