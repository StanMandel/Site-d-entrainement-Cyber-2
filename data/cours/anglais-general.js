/* =============================================================
   Anglais général — General English III (SHSJC-S2-107)
   -------------------------------------------------------------
   Structure et exemples complets : voir data/cours/_modele.js
   Contenu tiré des séances 2 à 8 : une banque de vocabulaire par
   séance, une banque commune qui les réunit, la conjugaison des
   temps vus en cours et un entraînement de grammaire type TOEIC.
   ============================================================= */

(function () {

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 2 : Neuromarketing
     --------------------------------------------------------- */
  const voc2 = [
    { indice: "delicate, slight, artful", reponse: "subtle", note: "subtil, à peine perceptible" },
    { indice: "to display something briefly on a screen", reponse: "flash", note: "faire apparaître un bref instant" },
    { indice: "to make someone believe something that is not true", reponse: "brainwash", note: "faire un lavage de cerveau" },
    { indice: "a crowd, a large moving group of people", reponse: "drove", note: "une foule, une nuée" },
    { indice: "to customize, to adapt, to personalize", reponse: "tailor", note: "adapter sur mesure" },
    { indice: "a highly educated person, an intellectual", reponse: "scholar", note: "un érudit, un universitaire" },
    { indice: "to focus on, to centre on a subject", reponse: "revolve around", note: "tourner autour de (deux mots)" },
    { indice: "challenging and disruptive of the established order", reponse: "subversive", note: "subversif" },
    { indice: "to tire someone, to fatigue little by little", reponse: "wear down", note: "épuiser, user (deux mots)" },
    { indice: "a passageway, for instance between shop shelves", reponse: "aisle", note: "une allée de magasin" },
    { indice: "to attract, to entice, to seduce", reponse: "tempt", note: "tenter, attirer" },
    { indice: "passing, momentary, very short-lived", reponse: "fleeting", note: "fugace, éphémère" },
    { indice: "debatable, discussed by everybody", reponse: "controversial", note: "controversé" },
    { indice: "to force someone to do something", reponse: "compel", note: "contraindre" },
    { indice: "an unusual or unexpected habit", reponse: "quirk", note: "une manie, une bizarrerie" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 3 : Companies with no CEO
     --------------------------------------------------------- */
  const voc3 = [
    { indice: "teamwork-based, collaborative; a company owned by its workers", reponse: "cooperative", alt: ["co-op"], note: "une coopérative" },
    { indice: "to go back, to play something again from the start", reponse: "rewind", note: "rembobiner, revenir en arrière" },
    { indice: "a company that provides a particular product", reponse: "supplier", note: "un fournisseur" },
    { indice: "to discuss, to transact in order to reach an agreement", reponse: "negotiate", note: "négocier" },
    { indice: "reasonable, just, fair for everybody", reponse: "equitable", note: "équitable" },
    { indice: "an innovator, a founder, an explorer", reponse: "pioneer", note: "un pionnier" },
    { indice: "goods, funds or property owned by a company", reponse: "stock", note: "le stock, les actions" },
    { indice: "comprehensive, all-encompassing", reponse: "overarching", note: "global, qui chapeaute tout" },
    { indice: "collectively, together, mutually", reponse: "jointly", note: "conjointement" },
    { indice: "an investor who owns part of a company", reponse: "shareholder", note: "un actionnaire" },
    { indice: "an assignment, a vocation, a task a company sets itself", reponse: "mission", note: "une mission" },
    { indice: "to execute, to fulfil a decision or a plan", reponse: "implement", note: "mettre en œuvre" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 4 : The Digital-Wallet War
     --------------------------------------------------------- */
  const voc4 = [
    { indice: "the money given in exchange for goods or a service", reponse: "payment", note: "un paiement" },
    { indice: "a mobile wallet, an app that stores your cards", reponse: "digital wallet", note: "un portefeuille numérique (deux mots)" },
    { indice: "monetary, economic", reponse: "financial", note: "financier" },
    { indice: "a risk, a peril, a danger", reponse: "threat", note: "une menace" },
    { indice: "to intrude, to invade, to overstep a territory", reponse: "encroach", note: "empiéter sur" },
    { indice: "a rival on the same market", reponse: "competitor", note: "un concurrent" },
    { indice: "a saving account held in a bank", reponse: "deposit account", note: "un compte de dépôt (deux mots)" },
    { indice: "income, profit earned by a company", reponse: "revenue", note: "le chiffre d'affaires, les recettes" },
    { indice: "a deal, a purchase, an exchange of money", reponse: "transaction", note: "une transaction" },
    { indice: "to remove money from an account", reponse: "debit", note: "débiter" },
    { indice: "to add money to an account; money lent by a bank", reponse: "credit", note: "créditer, le crédit" },
    { indice: "to provide, to deliver a card to a customer", reponse: "issue", note: "émettre, délivrer" },
    { indice: "a loan provider", reponse: "lender", note: "un prêteur" },
    { indice: "an affiliate company, a branch of a bigger group", reponse: "subsidiary", note: "une filiale" },
    { indice: "proper, acceptable, qualified to receive something", reponse: "eligible", note: "éligible, admissible" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 5 : Commuting to work
     --------------------------------------------------------- */
  const voc5 = [
    { indice: "faraway, distant; done from home", reponse: "remote", note: "à distance, éloigné" },
    { indice: "to regain, to retrieve something you had lost", reponse: "reclaim", note: "récupérer" },
    { indice: "the money you pay for a journey", reponse: "fare", note: "le prix du billet" },
    { indice: "hesitant, unwilling to do something", reponse: "reluctant", note: "réticent" },
    { indice: "to surrender, to stop doing something", reponse: "give up", note: "abandonner, renoncer (deux mots)" },
    { indice: "a home loan taken from a bank", reponse: "mortgage", note: "un prêt immobilier" },
    { indice: "a legislator, an authority who decides the rules", reponse: "policymaker", note: "un décideur politique" },
    { indice: "monotony, tedium", reponse: "boredom", note: "l'ennui" },
    { indice: "a traveller who goes to work every day", reponse: "commuter", note: "un usager quotidien" },
    { indice: "to handle, to manage, to address a problem", reponse: "tackle", note: "s'attaquer à" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 6 : Electric cars
     --------------------------------------------------------- */
  const voc6 = [
    { indice: "to transform, to modernize completely", reponse: "revolutionize", note: "révolutionner" },
    { indice: "given insufficient money to work properly", reponse: "underfunded", note: "sous-financé" },
    { indice: "richness, something expensive and not necessary", reponse: "luxury", note: "le luxe" },
    { indice: "a high-tech enclosure, an advanced capsule for passengers", reponse: "futuristic pod", note: "une capsule futuriste (deux mots)" },
    { indice: "extendable, able to grow to a much bigger size", reponse: "scalable", note: "extensible, qui passe à l'échelle" },
    { indice: "to trouble, to bother a project again and again", reponse: "plague", note: "miner, accabler" },
    { indice: "to rise and float in the air", reponse: "levitate", note: "léviter" },
    { indice: "a split, a break, a tear in a structure", reponse: "rupture", note: "une rupture, une déchirure" },
    { indice: "a high-speed transport system in a low-pressure tube", reponse: "hyperloop", note: "l'hyperloop" },
    { indice: "introducing initiatives, presenting them publicly", reponse: "unveiling plans", note: "dévoiler des projets (deux mots)" },
    { indice: "ownership; technology owned by one single company", reponse: "proprietary", note: "propriétaire, exclusif" },
    { indice: "a pressure loss trouble inside a sealed tube", reponse: "vacuum failure", note: "une perte de vide (deux mots)" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 7 : Culture shock
     --------------------------------------------------------- */
  const voc7 = [
    { indice: "frightening, discouraging before you even start", reponse: "daunting", note: "intimidant" },
    { indice: "to inform someone of a danger", reponse: "warn", note: "avertir, prévenir" },
    { indice: "missing your home, full of nostalgia for it", reponse: "homesick", note: "qui a le mal du pays" },
    { indice: "cultural unease, adjustment difficulties in a new country", reponse: "culture shock", note: "le choc culturel (deux mots)" },
    { indice: "unfavourably known, famous for bad reasons", reponse: "infamous", note: "tristement célèbre" },
    { indice: "deeply affected by a multitude of emotions or tasks", reponse: "overwhelmed", note: "submergé, dépassé" },
    { indice: "to move or travel from place to place", reponse: "get around", note: "se déplacer (deux mots)" },
    { indice: "to feel a strong and intense desire for something", reponse: "crave", note: "avoir très envie de" },
    { indice: "a roommate, someone you share a flat with", reponse: "flatmate", note: "un colocataire" },
    { indice: "a strong connection or attachment between individuals", reponse: "bond", note: "un lien" },
    { indice: "a social services counsellor in a university", reponse: "welfare advisor", note: "un conseiller social (deux mots)" },
    { indice: "to interact, to engage in social activities", reponse: "socialize", note: "socialiser" },
    { indice: "truly, exactly as the words say", reponse: "literally", note: "littéralement" }
  ];

  /* ---------------------------------------------------------
     VOCABULAIRE — Séance 8 : Subway system
     --------------------------------------------------------- */
  const voc8 = [
    { indice: "the point where two or more lines or paths cross", reponse: "intersection", alt: ["intersect"], note: "une intersection" },
    { indice: "to leave or exit a vehicle after a journey", reponse: "disembark", note: "débarquer, descendre" },
    { indice: "easily recognizable, unlike anything else", reponse: "distinctive", note: "distinctif" },
    { indice: "to establish a link between different parts of a network", reponse: "interconnect", note: "interconnecter" },
    { indice: "a suburban-to-city train service", reponse: "commuter rail", alt: ["commuter"], note: "un train de banlieue (deux mots)" },
    { indice: "a subway line, the rails a metro runs on", reponse: "subway track", note: "une voie de métro (deux mots)" },
    { indice: "the number of people who use a mode of transportation", reponse: "ridership", note: "la fréquentation" },
    { indice: "public transport, the movement of people across a city", reponse: "transit", note: "les transports en commun" },
    { indice: "outdated, extinct, no longer used", reponse: "obsolete", note: "obsolète" },
    { indice: "urban, civic, public, run by the city", reponse: "municipal", note: "municipal" },
    { indice: "a transfer point between two lines or two networks", reponse: "transit connection", alt: ["transit"], note: "une correspondance (deux mots)" },
    { indice: "joined, interconnected, working as one single system", reponse: "interlocking", note: "imbriqué, enchevêtré" }
  ];

  const vocabulaireComplet = [].concat(voc2, voc3, voc4, voc5, voc6, voc7, voc8);

  /* ---------------------------------------------------------
     CONJUGAISON — Reconnaître le temps employé
     --------------------------------------------------------- */
  const reconnaitre = [
    {
      enonce: "« Brands tailor their advertising to our brains. »",
      choix: ["Present simple", "Present continuous", "Past simple", "Present perfect"],
      reponse: 0,
      explication: "Sujet + base verbale (+ s à la 3e personne) : le present simple énonce une vérité générale ou une habitude."
    },
    {
      enonce: "« The scholar is presenting her research on neuromarketing right now. »",
      choix: ["Present continuous", "Present simple", "Future continuous", "Past continuous"],
      reponse: 0,
      explication: "be au présent + verbe en -ing : action en cours au moment où l'on parle."
    },
    {
      enonce: "« In the 1950s, a marketer flashed a message on a cinema screen. »",
      choix: ["Past simple", "Present perfect", "Past perfect", "Past continuous"],
      reponse: 0,
      explication: "Verbe au prétérit avec une date passée terminée : past simple."
    },
    {
      enonce: "« Apple has issued millions of cards since 2019. »",
      choix: ["Present perfect", "Past simple", "Present perfect continuous", "Past perfect"],
      reponse: 0,
      explication: "have/has + participe passé : un bilan qui relie le passé au présent, souvent avec since ou for."
    },
    {
      enonce: "« Commuters have been complaining about the fares for months. »",
      choix: ["Present perfect continuous", "Present continuous", "Present perfect", "Past continuous"],
      reponse: 0,
      explication: "have been + -ing : l'action a commencé dans le passé et dure encore."
    },
    {
      enonce: "« The train was leaving the station when I arrived. »",
      choix: ["Past continuous", "Past simple", "Past perfect", "Present continuous"],
      reponse: 0,
      explication: "was/were + -ing : action en cours dans le passé, interrompue par une autre au past simple."
    },
    {
      enonce: "« The bank had already lost its customers before Apple launched its wallet. »",
      choix: ["Past perfect", "Past simple", "Present perfect", "Third conditional"],
      reponse: 0,
      explication: "had + participe passé : une action antérieure à une autre action passée."
    },
    {
      enonce: "« I think it will rain tomorrow. »",
      choix: ["Future simple (will)", "Be going to", "Future continuous", "Present continuous"],
      reponse: 0,
      explication: "will exprime ici une prédiction fondée sur une opinion (I think, I'm sure, probably)."
    },
    {
      enonce: "« Look at those dark clouds! It is going to storm. »",
      choix: ["Be going to", "Future simple (will)", "Present continuous", "Future perfect"],
      reponse: 0,
      explication: "be going to : prédiction appuyée sur un indice visible, ou intention déjà décidée."
    },
    {
      enonce: "« We are meeting the supplier on Friday at ten. »",
      choix: ["Present continuous (futur programmé)", "Present simple", "Future continuous", "Be going to"],
      reponse: 0,
      explication: "Le present continuous sert au futur quand le rendez-vous est déjà fixé."
    },
    {
      enonce: "« The next flight lands in a few hours. »",
      choix: ["Present simple (horaire)", "Present continuous", "Future simple (will)", "Be going to"],
      reponse: 0,
      explication: "Horaires, programmes et calendriers se disent au present simple."
    },
    {
      enonce: "« This time tomorrow I will be flying to Tokyo. »",
      choix: ["Future continuous", "Future perfect", "Future simple (will)", "Present continuous"],
      reponse: 0,
      explication: "will be + -ing : une action en cours à un moment précis du futur."
    },
    {
      enonce: "« By 2035, most cities will have banned diesel cars. »",
      choix: ["Future perfect", "Future continuous", "Future simple (will)", "Present perfect"],
      reponse: 0,
      explication: "will have + participe passé : action achevée avant une échéance future (by 2035)."
    },
    {
      enonce: "« If you heat water to 100 °C, it boils. »",
      choix: ["Zero conditional", "First conditional", "Second conditional", "Third conditional"],
      reponse: 0,
      explication: "if + present simple, present simple : une vérité générale toujours vraie."
    },
    {
      enonce: "« If they lower the fares, more commuters will use the subway. »",
      choix: ["First conditional", "Zero conditional", "Second conditional", "Third conditional"],
      reponse: 0,
      explication: "if + present simple, will + base verbale : un résultat probable dans le futur."
    },
    {
      enonce: "« If I had her number, I would call her. »",
      choix: ["Second conditional", "First conditional", "Third conditional", "Past simple"],
      reponse: 0,
      explication: "if + prétérit, would + base verbale : situation imaginaire ou peu probable dans le présent."
    },
    {
      enonce: "« If you had told me, I would have left earlier. »",
      choix: ["Third conditional", "Second conditional", "Past perfect", "First conditional"],
      reponse: 0,
      explication: "if + past perfect, would have + participe passé : un regret sur le passé, ce qui n'a pas eu lieu."
    },
    {
      enonce: "« If aliens had visited Earth last month, they would have contacted us. »",
      choix: ["Third conditional", "Second conditional", "First conditional", "Zero conditional"],
      reponse: 0,
      explication: "La condition porte sur un passé qui n'a pas eu lieu : troisième conditionnel."
    },
    {
      enonce: "« The shareholders were discussing the merger while the CEO was travelling. »",
      choix: ["Past continuous", "Past simple", "Past perfect", "Present continuous"],
      reponse: 0,
      explication: "Deux actions passées simultanées et en cours : past continuous dans les deux propositions."
    },
    {
      enonce: "« She has worked for this cooperative since 2018. »",
      choix: ["Present perfect", "Past simple", "Present simple", "Past perfect"],
      reponse: 0,
      explication: "since + date avec un present perfect : l'activité continue aujourd'hui."
    },
    {
      enonce: "« She worked for this cooperative in 2018. »",
      choix: ["Past simple", "Present perfect", "Past perfect", "Past continuous"],
      reponse: 0,
      explication: "Une date passée close (in 2018) impose le past simple, jamais le present perfect."
    },
    {
      enonce: "« We are going to launch the app next month. »",
      choix: ["Be going to (intention)", "Future simple (will)", "Present continuous", "Future perfect"],
      reponse: 0,
      explication: "be going to annonce une intention déjà décidée avant de parler."
    },
    {
      enonce: "« Don't worry, I will help you clean it up. »",
      choix: ["Future simple (will) — décision immédiate", "Be going to", "Present simple", "Future continuous"],
      reponse: 0,
      explication: "will exprime une décision prise au moment même où l'on parle."
    },
    {
      enonce: "« Plants die if they don't get enough water. »",
      choix: ["Zero conditional", "First conditional", "Present continuous", "Second conditional"],
      reponse: 0,
      explication: "Résultat toujours vrai : les deux verbes sont au present simple."
    }
  ];

  /* ---------------------------------------------------------
     CONJUGAISON — Phrases à trous
     --------------------------------------------------------- */
  const conditionnel01 = [
    { indice: "If you ___ (mix) red and green, you get brown.", reponse: "mix", note: "Zero conditional : présent + présent." },
    { indice: "If you mix red and green, you ___ (get) brown.", reponse: "get", note: "Vérité générale : present simple." },
    { indice: "If you ___ (drop) a glass on the floor, it breaks.", reponse: "drop", note: "Zero conditional." },
    { indice: "If you drop a glass on the floor, it ___ (break).", reponse: "breaks", note: "3e personne du singulier : -s." },
    { indice: "If babies ___ (be) hungry, they cry.", reponse: "are", note: "Zero conditional, sujet pluriel." },
    { indice: "If babies are hungry, they ___ (cry).", reponse: "cry", note: "Present simple, pas de -s au pluriel." },
    { indice: "When you ___ (add) sugar, the sauce tastes sweet.", reponse: "add", note: "When remplace if dans une vérité générale." },
    { indice: "When you add sugar, the sauce ___ (taste) sweet.", reponse: "tastes", note: "3e personne du singulier : -s." },
    { indice: "Water ___ (boil) if you heat it to 100 °C.", reponse: "boils", note: "La proposition en if peut suivre le résultat." },
    { indice: "Water boils if you ___ (heat) it to 100 °C.", reponse: "heat", note: "Present simple après if." },
    { indice: "Plants ___ (die) if they don't get enough water.", reponse: "die", note: "Zero conditional." },
    { indice: "Plants die if they ___ (not get) enough water.", reponse: "don't get", alt: ["do not get"], note: "Négation au present simple (deux mots)." },
    { indice: "If you ___ (put) water in the freezer, it becomes ice.", reponse: "put", note: "Zero conditional." },
    { indice: "If you put water in the freezer, it ___ (become) ice.", reponse: "becomes", note: "3e personne du singulier : -s." },
    { indice: "When the sun ___ (rise), the street lights go out.", reponse: "rises", note: "3e personne du singulier : -s." },
    { indice: "When the sun rises, the street lights ___ (go out).", reponse: "go out", note: "Verbe à particule au present simple (deux mots)." },
    { indice: "If they ___ (invite) us to the party, we will go.", reponse: "invite", note: "First conditional : présent après if." },
    { indice: "If they invite us to the party, we ___ (go).", reponse: "will go", alt: ["'ll go", "ll go"], note: "First conditional : will + base verbale." },
    { indice: "If you ___ (not hurry), you will miss the 8 o'clock train.", reponse: "don't hurry", alt: ["do not hurry"], note: "Jamais de will après if (deux mots)." },
    { indice: "If the bank ___ (charge) lower fees, shops will accept the card.", reponse: "charges", note: "3e personne du singulier après if." },
    { indice: "We ___ (take) the subway if the fare is reasonable.", reponse: "will take", alt: ["'ll take", "ll take"], note: "Résultat probable : will + base verbale." },
    { indice: "If they lower the fares, more commuters ___ (use) public transit.", reponse: "will use", alt: ["'ll use", "ll use"], note: "First conditional." },
    { indice: "If the advert ___ (be) too subtle, the audience will miss it.", reponse: "is", note: "Present simple après if." },
    { indice: "If she ___ (find) a job in Paris, she will commute every day.", reponse: "finds", note: "3e personne du singulier après if." }
  ];

  const conditionnel2 = [
    { indice: "If I ___ (have) more money, I'd travel more.", reponse: "had", note: "Second conditional : prétérit après if." },
    { indice: "What would you do if you ___ (find) a lot of money in the street?", reponse: "found", note: "Prétérit irrégulier : find → found." },
    { indice: "A lot of health problems could be prevented if people ___ (eat) better.", reponse: "ate", note: "Prétérit irrégulier : eat → ate." },
    { indice: "If I had her number, I ___ (call) her, but I don't have it.", reponse: "would call", alt: ["'d call", "d call"], note: "would + base verbale (deux mots)." },
    { indice: "Our kids would be happier if we ___ (live) in the country.", reponse: "lived", note: "Prétérit régulier après if." },
    { indice: "If you lent me the money, I ___ (pay) you back before the end of the month.", reponse: "would pay", alt: ["'d pay", "d pay"], note: "Résultat imaginaire : would + base verbale." },
    { indice: "I wouldn't drink that milk if I ___ (be) you.", reponse: "were", alt: ["was"], note: "If I were you : subjonctif figé." },
    { indice: "You wouldn't have so many accidents if you ___ (drive) more carefully.", reponse: "drove", note: "Prétérit irrégulier : drive → drove." },
    { indice: "If I ___ (be) you, I would take that job offer.", reponse: "were", alt: ["was"], note: "Conseil : If I were you…" },
    { indice: "If I ___ (have) more free time, I would take up a new hobby.", reponse: "had", note: "Prétérit après if." },
    { indice: "If he had more time, he ___ (learn) to play the guitar.", reponse: "would learn", alt: ["'d learn", "d learn"], note: "Situation peu probable au présent." },
    { indice: "If the company ___ (be) a cooperative, the workers would own the stock.", reponse: "were", alt: ["was"], note: "Hypothèse irréelle au présent." }
  ];

  const conditionnel3 = [
    { indice: "If the weather had been better last weekend, we ___ (go) to the beach.", reponse: "would have gone", alt: ["would've gone", "wouldve gone"], note: "would have + participe passé (trois mots)." },
    { indice: "If you ___ (come) to the meeting yesterday, you would have met the head teacher.", reponse: "had come", note: "Past perfect après if (deux mots)." },
    { indice: "I ___ (buy) you a present if I had known it was your birthday.", reponse: "would have bought", alt: ["would've bought", "wouldve bought"], note: "Regret : ce cadeau n'a pas été acheté." },
    { indice: "The accident ___ (not occur) if the driver hadn't been driving fast.", reponse: "wouldn't have occurred", alt: ["would not have occurred"], note: "L'accident a bien eu lieu." },
    { indice: "He ___ (not miss) the bus if he had woken up earlier.", reponse: "wouldn't have missed", alt: ["would not have missed"], note: "Il a raté le bus." },
    { indice: "If I ___ (know) you were coming, I would have prepared a meal.", reponse: "had known", note: "Past perfect : know → had known." },
    { indice: "I ___ (send) you the document if you had given me your email address.", reponse: "would have sent", alt: ["would've sent", "wouldve sent"], note: "Participe passé : send → sent." },
    { indice: "If you ___ (not be) late, you would have caught the 6 o'clock train.", reponse: "hadn't been", alt: ["had not been"], note: "Past perfect négatif." },
    { indice: "If we ___ (listen) to the radio, we would have heard the news.", reponse: "had listened", note: "Past perfect régulier." },
    { indice: "If you ___ (switch) on the lights, you wouldn't have fallen over the chair.", reponse: "had switched", note: "Past perfect régulier." },
    { indice: "She ___ (come) to our party if she hadn't been on holiday.", reponse: "would have come", alt: ["would've come", "wouldve come"], note: "Participe passé : come → come." },
    { indice: "If the bank ___ (issue) the card earlier, it would have kept its customers.", reponse: "had issued", note: "Past perfect régulier." }
  ];

  const futur = [
    { indice: "I think it ___ (rain) today.", reponse: "will rain", alt: ["'ll rain", "ll rain"], note: "Prédiction fondée sur une opinion : will." },
    { indice: "We ___ (have) a party next weekend — everything is already booked.", reponse: "are going to have", note: "Projet déjà décidé : be going to." },
    { indice: "She ___ (study) medicine at university; she has already enrolled.", reponse: "is going to study", note: "Intention arrêtée : be going to." },
    { indice: "Do you think he ___ (pass) the exam?", reponse: "will pass", note: "Opinion sur l'avenir : will." },
    { indice: "I ___ (have) an appointment tomorrow at 3 p.m.", reponse: "am having", alt: ["'m having", "m having"], note: "Rendez-vous fixé : present continuous." },
    { indice: "Look at those dark clouds! It ___ (storm).", reponse: "is going to storm", note: "Indice visible : be going to." },
    { indice: "They ___ (travel) to Europe this summer; the tickets are bought.", reponse: "are going to travel", note: "Plan arrêté : be going to." },
    { indice: "The next flight ___ (land) in a few hours.", reponse: "lands", note: "Horaire officiel : present simple." },
    { indice: "What ___ (you do) after graduation?", reponse: "will you do", note: "Question sur un avenir indéterminé : will." },
    { indice: "This time tomorrow, I ___ (fly) to London.", reponse: "will be flying", note: "Action en cours dans le futur : future continuous." },
    { indice: "By 2030, most cities ___ (ban) diesel cars.", reponse: "will have banned", note: "Achevé avant une échéance : future perfect." },
    { indice: "The train ___ (leave) at 6:15 tomorrow morning.", reponse: "leaves", note: "Horaire : present simple." },
    { indice: "I ___ (meet) the supplier on Friday — it is in my diary.", reponse: "am meeting", alt: ["'m meeting", "m meeting"], note: "Rendez-vous pris : present continuous." },
    { indice: "The phone is ringing — I ___ (answer) it!", reponse: "will answer", alt: ["'ll answer", "ll answer"], note: "Décision immédiate : will." }
  ];

  const tousLesTemps = [
    { indice: "Every morning, thousands of commuters ___ (take) the subway to work.", reponse: "take", note: "Habitude : present simple." },
    { indice: "Be quiet, the scholar ___ (explain) her latest study.", reponse: "is explaining", note: "En cours maintenant : present continuous." },
    { indice: "In 1988, the Morris worm ___ (spread) across the internet.", reponse: "spread", note: "Date close : past simple (verbe invariable)." },
    { indice: "The supplier ___ (not deliver) the order yesterday.", reponse: "didn't deliver", alt: ["did not deliver"], note: "Négation au past simple : did not + base verbale." },
    { indice: "Apple ___ (issue) more than 10 million cards since 2019.", reponse: "has issued", note: "Bilan relié au présent : present perfect." },
    { indice: "Policymakers ___ (debate) this law for months now.", reponse: "have been debating", note: "Depuis un moment et toujours en cours." },
    { indice: "I ___ (wait) on the platform when the train finally arrived.", reponse: "was waiting", note: "Action en cours interrompue : past continuous." },
    { indice: "By the time we arrived, the meeting ___ (already start).", reponse: "had already started", note: "Antériorité dans le passé : past perfect." },
    { indice: "She ___ (work) for the cooperative for three years before she left.", reponse: "had worked", note: "Past perfect : avant une autre action passée." },
    { indice: "Tomorrow the shareholders ___ (vote) on the merger; the date is fixed.", reponse: "are voting", note: "Futur programmé : present continuous." },
    { indice: "Careful, that box is heavy — I ___ (help) you.", reponse: "will help", alt: ["'ll help", "ll help"], note: "Décision immédiate : will." },
    { indice: "We ___ (buy) an electric car next year; we have already saved the money.", reponse: "are going to buy", note: "Intention décidée : be going to." },
    { indice: "If the fare ___ (rise) again, people will stop using the bus.", reponse: "rises", note: "First conditional : présent après if." },
    { indice: "If I ___ (be) the CEO, I would share the profits.", reponse: "were", note: "Second conditional : were à toutes les personnes." },
    { indice: "If the company had listened to its customers, it ___ (not lose) the market.", reponse: "wouldn't have lost", alt: ["would not have lost"], note: "Third conditional : regret sur le passé." },
    { indice: "Water ___ (freeze) if you leave it outside at −5 °C.", reponse: "freezes", note: "Zero conditional : vérité générale." },
    { indice: "Next Monday at nine, I ___ (present) my case study to the class.", reponse: "will be presenting", note: "Future continuous." },
    { indice: "By the end of the semester, we ___ (learn) all the phrasal verbs.", reponse: "will have learned", alt: ["will have learnt"], note: "Future perfect." },
    { indice: "She ___ (live) in Tokyo when she first felt culture shock.", reponse: "was living", note: "Cadre d'un événement passé : past continuous." },
    { indice: "___ (you ever be) to Japan?", reponse: "have you ever been", note: "Expérience de vie : present perfect." },
    { indice: "The bank ___ (lose) customers every month until it launched its own wallet.", reponse: "lost", note: "Période passée terminée : past simple." },
    { indice: "Look! The hyperloop capsule ___ (levitate) above the track.", reponse: "is levitating", note: "Sous nos yeux : present continuous." }
  ];

  /* ---------------------------------------------------------
     TOEIC — Partie grammaire (phrases à compléter)
     --------------------------------------------------------- */
  const toeic = [
    {
      enonce: "The marketing team will present its report ___ Friday morning.",
      choix: ["on", "in", "at", "to"],
      reponse: 0,
      explication: "on devant un jour ou une date ; in pour les mois et les années ; at pour une heure."
    },
    {
      enonce: "Most employees prefer working from home ___ commuting two hours a day.",
      choix: ["rather than", "instead", "than", "as well"],
      reponse: 0,
      explication: "rather than relie deux options ; instead s'emploie seul ou avec of + nom."
    },
    {
      enonce: "The supplier ___ we signed with last year has raised its prices.",
      choix: ["that", "who", "what", "whose"],
      reponse: 0,
      explication: "L'antécédent est une chose : that ou which. who ne s'emploie que pour une personne."
    },
    {
      enonce: "___ of the two digital wallets is more widely accepted?",
      choix: ["Which", "What", "Who", "Whose"],
      reponse: 0,
      explication: "Which s'impose quand le choix se fait dans un ensemble limité et connu."
    },
    {
      enonce: "The fare increase was ___ higher than expected.",
      choix: ["much", "very", "too much", "so"],
      reponse: 0,
      explication: "Devant un comparatif, on renforce avec much, far ou a lot, jamais avec very."
    },
    {
      enonce: "Tokyo's network is by far ___ punctual in the world.",
      choix: ["the most", "most", "more", "the more"],
      reponse: 0,
      explication: "Superlatif d'un adjectif long : the most + adjectif."
    },
    {
      enonce: "Few commuters are willing to ___ their car for public transport.",
      choix: ["give up", "give in", "give out", "give away"],
      reponse: 0,
      explication: "give up = renoncer à. give in = céder, give out = distribuer, give away = révéler."
    },
    {
      enonce: "The company has been underfunded ___ its creation in 2015.",
      choix: ["since", "for", "during", "from"],
      reponse: 0,
      explication: "since + point de départ ; for + durée ; during + période."
    },
    {
      enonce: "We have worked on this proprietary system ___ six months.",
      choix: ["for", "since", "during", "in"],
      reponse: 0,
      explication: "for introduit une durée (six months), since une date de départ."
    },
    {
      enonce: "Neither the lender ___ the borrower was informed of the new fee.",
      choix: ["nor", "or", "and", "either"],
      reponse: 0,
      explication: "Le couple figé est neither … nor ; either va avec or."
    },
    {
      enonce: "___ the video was subtle, very few viewers noticed the message.",
      choix: ["Because", "Despite", "However", "In spite"],
      reponse: 0,
      explication: "Because introduit une proposition complète ; despite et in spite of sont suivis d'un nom."
    },
    {
      enonce: "___ the heavy rain, the delivery arrived on time.",
      choix: ["Despite", "Although", "Because of", "Even"],
      reponse: 0,
      explication: "Despite + groupe nominal. Although exigerait une proposition avec un verbe conjugué."
    },
    {
      enonce: "All applications must ___ by the end of the month.",
      choix: ["be submitted", "submit", "have submitted", "be submitting"],
      reponse: 0,
      explication: "Passif après un modal : modal + be + participe passé."
    },
    {
      enonce: "The shareholders asked the board ___ the results immediately.",
      choix: ["to publish", "publishing", "publish", "for publish"],
      reponse: 0,
      explication: "ask somebody to do something : infinitif complet après le complément."
    },
    {
      enonce: "The CEO suggested ___ the meeting until next week.",
      choix: ["postponing", "to postpone", "postpone", "postponed"],
      reponse: 0,
      explication: "suggest est suivi du gérondif (-ing) ou de that + proposition."
    },
    {
      enonce: "We are looking forward to ___ from you.",
      choix: ["hearing", "hear", "be heard", "have heard"],
      reponse: 0,
      explication: "Dans look forward to, to est une préposition : le verbe qui suit prend -ing."
    },
    {
      enonce: "There is ___ information about the new transit connection.",
      choix: ["little", "few", "a few", "many"],
      reponse: 0,
      explication: "information est indénombrable : little, much, a little. few et many vont aux dénombrables."
    },
    {
      enonce: "___ employees have already completed the training.",
      choix: ["Most", "Almost", "The most", "Much"],
      reponse: 0,
      explication: "Most + nom pluriel = la plupart. Almost ne se place pas directement devant un nom."
    },
    {
      enonce: "The bank issued the cards ___ than its competitor.",
      choix: ["faster", "fastest", "more fast", "as fast"],
      reponse: 0,
      explication: "Comparatif d'un adverbe court : -er + than."
    },
    {
      enonce: "This wallet is not ___ convenient as the one I used before.",
      choix: ["as", "so much", "more", "than"],
      reponse: 0,
      explication: "Comparatif d'égalité : as + adjectif + as, y compris à la forme négative."
    },
    {
      enonce: "The revenue of the subsidiary rose ___ 12 % last quarter.",
      choix: ["by", "of", "at", "in"],
      reponse: 0,
      explication: "rise / increase / fall by + pourcentage ou montant de la variation."
    },
    {
      enonce: "Please make sure the report is ___ to all shareholders.",
      choix: ["handed out", "handed in", "handed over", "held out"],
      reponse: 0,
      explication: "hand out = distribuer à plusieurs personnes. hand in = rendre, hand over = remettre à contrecœur."
    },
    {
      enonce: "The policymaker ___ office since the last election.",
      choix: ["has been in", "is in", "was in", "had been in"],
      reponse: 0,
      explication: "since impose le present perfect : la situation dure encore."
    },
    {
      enonce: "If the fare ___ again, many commuters will switch to cycling.",
      choix: ["increases", "will increase", "would increase", "increased"],
      reponse: 0,
      explication: "Jamais de will dans la proposition en if du premier conditionnel."
    },
    {
      enonce: "The manager, ___ office is on the third floor, approved the budget.",
      choix: ["whose", "who's", "which", "of whom"],
      reponse: 0,
      explication: "whose marque la possession ; who's est la contraction de who is."
    },
    {
      enonce: "Employees are not allowed ___ their phones during the presentation.",
      choix: ["to use", "using", "use", "used"],
      reponse: 0,
      explication: "be allowed to do something : infinitif complet après le passif."
    },
    {
      enonce: "The aisle was so crowded ___ we could hardly move.",
      choix: ["that", "than", "as", "which"],
      reponse: 0,
      explication: "Structure so + adjectif + that + conséquence."
    },
    {
      enonce: "She is responsible ___ the company's cybersecurity policy.",
      choix: ["for", "of", "to", "about"],
      reponse: 0,
      explication: "responsible est toujours suivi de for."
    },
    {
      enonce: "The new app is designed to ___ the needs of older passengers.",
      choix: ["meet", "reach", "answer", "arrive"],
      reponse: 0,
      explication: "meet the needs / meet a deadline : collocation figée."
    },
    {
      enonce: "___ you need any help, please contact the welfare advisor.",
      choix: ["Should", "Would", "Will", "May"],
      reponse: 0,
      explication: "Should en tête de phrase remplace if dans un registre formel : Should you need = If you need."
    },
    {
      enonce: "Our team has ___ finished the audit, so the report is ready.",
      choix: ["already", "yet", "still", "ever"],
      reponse: 0,
      explication: "already dans une affirmation ; yet appartient aux questions et aux négations."
    },
    {
      enonce: "The two cooperatives decided to work ___ on the same project.",
      choix: ["jointly", "joint", "jointed", "join"],
      reponse: 0,
      explication: "Le verbe work demande un adverbe : jointly."
    }
  ];

  /* =========================================================
     CONTENU
     ========================================================= */
  CONTENU["anglais-general"] = {
    chapitres: [

      {
        id: "vocabulaire",
        titre: "Chapitre 1 — Vocabulaire des séances",
        description: "Le pre-task de chaque séance : la définition s'affiche, vous tapez le mot anglais.",
        exercices: [
          {
            type: "jetpunk",
            id: "voc-s2",
            titre: "Séance 2 — Neuromarketing",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 300,
            colonnes: 3,
            melanger: true,
            items: voc2
          },
          {
            type: "jetpunk",
            id: "voc-s3",
            titre: "Séance 3 — Companies with no CEO",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 300,
            colonnes: 3,
            melanger: true,
            items: voc3
          },
          {
            type: "jetpunk",
            id: "voc-s4",
            titre: "Séance 4 — The Digital-Wallet War",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 300,
            colonnes: 3,
            melanger: true,
            items: voc4
          },
          {
            type: "jetpunk",
            id: "voc-s5",
            titre: "Séance 5 — Commuting to work",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 240,
            colonnes: 3,
            melanger: true,
            items: voc5
          },
          {
            type: "jetpunk",
            id: "voc-s6",
            titre: "Séance 6 — Electric cars",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 300,
            colonnes: 3,
            melanger: true,
            items: voc6
          },
          {
            type: "jetpunk",
            id: "voc-s7",
            titre: "Séance 7 — Culture shock",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 300,
            colonnes: 3,
            melanger: true,
            items: voc7
          },
          {
            type: "jetpunk",
            id: "voc-s8",
            titre: "Séance 8 — Subway system",
            consigne: "Tapez le mot anglais qui correspond à chaque définition.",
            temps: 300,
            colonnes: 3,
            melanger: true,
            items: voc8
          },
          {
            type: "jetpunk",
            id: "voc-tout",
            titre: "Vocabulaire du semestre",
            consigne: "Vingt mots tirés au hasard parmi ceux des séances 2 à 8.",
            temps: 420,
            colonnes: 4,
            melanger: true,
            tirage: 20,
            items: vocabulaireComplet
          }
        ]
      },

      {
        id: "temps",
        titre: "Chapitre 2 — Les temps et la conjugaison",
        description: "Reconnaître le temps employé, puis conjuguer dans des phrases à trous.",
        exercices: [
          {
            type: "qcm",
            id: "temps-reconnaitre",
            titre: "Quel temps est employé ?",
            description: "Une phrase, quatre étiquettes : retrouvez la structure utilisée.",
            tirage: 15,
            melangerChoix: true,
            cours: [
              "Chaque temps se reconnaît à sa forme.",
              {
                entetes: ["Temps", "Forme"],
                lignes: [
                  ["Present simple", "base verbale, **+ s** à la 3e personne"],
                  ["Present continuous", "`be` au présent + **-ing**"],
                  ["Past simple", "prétérit, avec une date passée terminée"],
                  ["Past continuous", "`was` / `were` + **-ing**"],
                  ["Present perfect", "`have` / `has` + participe passé"],
                  ["Past perfect", "`had` + participe passé"],
                  ["Future simple", "`will` + base verbale"],
                  ["Be going to", "`be going to` + base verbale"],
                  ["Future continuous", "`will be` + **-ing**"],
                  ["Future perfect", "`will have` + participe passé"]
                ]
              },
              { titre: "Les quatre conditionnels" },
              [
                "**0** — If you heat water, it boils.",
                "**1** — If it rains, we will stay home.",
                "**2** — If I had time, I would travel.",
                "**3** — If I had known, I would have come."
              ]
            ],
            questions: reconnaitre
          },
          {
            type: "jetpunk",
            id: "temps-cond01",
            titre: "Zero et first conditional",
            consigne: "Complétez chaque phrase avec la forme correcte du verbe entre parenthèses.",
            colonnes: 2,
            melanger: true,
            tirage: 14,
            items: conditionnel01
          },
          {
            type: "jetpunk",
            id: "temps-cond2",
            titre: "Second conditional",
            consigne: "Complétez chaque phrase avec la forme correcte du verbe entre parenthèses.",
            colonnes: 2,
            melanger: true,
            items: conditionnel2
          },
          {
            type: "jetpunk",
            id: "temps-cond3",
            titre: "Third conditional",
            consigne: "Complétez chaque phrase avec la forme correcte du verbe entre parenthèses.",
            colonnes: 2,
            melanger: true,
            items: conditionnel3
          },
          {
            type: "jetpunk",
            id: "temps-futur",
            titre: "Will, be going to et les autres futurs",
            consigne: "Complétez chaque phrase avec la forme correcte du verbe entre parenthèses.",
            colonnes: 2,
            melanger: true,
            tirage: 10,
            items: futur
          },
          {
            type: "jetpunk",
            id: "temps-melange",
            titre: "Tous les temps mélangés",
            consigne: "Quinze phrases tirées au hasard : à vous de choisir le temps qui convient.",
            colonnes: 2,
            melanger: true,
            tirage: 15,
            items: tousLesTemps
          }
        ]
      },

      {
        id: "toeic",
        titre: "Chapitre 3 — Grammaire type TOEIC",
        description: "Phrases à trou de la partie 5 : choisissez le mot grammatical qui convient.",
        exercices: [
          {
            type: "qcm",
            id: "toeic-grammaire",
            titre: "TOEIC — Incomplete sentences",
            description: "Prépositions, conjonctions, relatifs, comparatifs et formes verbales.",
            tirage: 15,
            melangerChoix: true,
            cours: [
              "Repérez la nature du mot attendu, puis relisez le mot qui suit le trou : c'est presque toujours lui qui tranche.",
              [
                "un nom seul derrière le trou : `despite`, `because of`, `during`",
                "une proposition avec un verbe conjugué : `although`, `because`, `while`",
                "une durée : `for` ; un point de départ : `since`",
                "un comparatif : `much` ou `far` + **-er than**, jamais `very`",
                "après une préposition, le verbe prend **-ing** : `look forward to hearing`"
              ]
            ],
            questions: toeic
          }
        ]
      }

    ]
  };

})();
