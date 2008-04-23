var DEBUT = new Date();

var langs = { // Indexed on ISO 639-1 language ids (since country != language)

en: { // English language strings maintained by myself. :-)
    language: "English", // The name of the translation language; not English!
    finished: " Finished ", // Building / resource upgrades, unit construction
    execTime: "Time of execution", // Shown in tooltip for the language choice
 researching: "Researching", // Start of the "currently being researched" link
    showLoot: "Show loot table", // For the military advisor view's loot table
       shown: "Shown",  // These two are buttons in Library view's page title
      hidden: "Hidden", //
       empty: "empty: ", // Typically your wine stash, if replenish rate < 0
        full: "full: ", // Hover the population indicator to see, for instance
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", // For all that won't
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],// be completed today
 startExpand: "; start expanding before ", // For (growing) town hall tooltip
     enqueue: "Enqueue", // When busy building, and you place a new building
  prependToQ: "Shift click to put at the head of the queue",
  leftByThen: "Resources left ", // gets followed by build queue end date/time
shoppingList: "Shopping list: click a resource icon to buy that in your port",
 unavailable: "Resources unavailable by build time (and replenish time)",
   popupInfo: "Click for building info, use scroll wheel to browse levels",
 notShownNow: "Note: not presently shown in the main view below.",
 readlibrary: "Kronos needs to read through your library. Do that now?",
  travelTime: "Travel Time", // column header in Diplomacy view; short is good
   startTime: "Start time", // production queue: when building/upgrade begins
      points: "points", // research points (in current research link tooltip)
   countdown: "Proceeding to next queue item in ", // 10..., 9..., 8... 7...
   countdone: "And off we go -- initiating build sequence!",
  clickToBuy: "Click to price to purchase as much of the goods as you want.",
},

sv: { // Swedish strings also maintained by myself:
    language: "Svenska",
    finished: " Färdigt ",
    execTime: "Exekveringstid",
 researching: "Forskning",
    showLoot: "Visa stöldgods",
       shown: "Visas",
      hidden: "Gömda",
       empty: "tomt: ",
        full: "fullt: ",
      months: ["jan", "feb", "mar", "apr", "maj", "jun",
               "jul", "aug", "sep", "okt", "nov", "dec"],
 startExpand: "; börja bygg ut före ",
     enqueue: "Köa upp",
  prependToQ: "Shift-klicka för att lägga först i kön",
  leftByThen: "Resurser kvar efter ",
shoppingList: "Inköpslista",
 unavailable: "Resurser som kommer saknas vid byggstart, och inskaffningstid",
   popupInfo: "Klicka för att se byggnaden i ikipedia; använd scrollhjulet "+
                "för att se kostnader för andra expansionsnivåer",
 notShownNow: "OBS! Visas inte i huvudvyn nedan för närvarande.",
 readlibrary: "Kronos behöver läsa genom ditt bibliotek. Vill du göra det nu?",
  travelTime: "Restid",
   startTime: "Arbetet påbörjas",
      points: "poäng",
   countdown: "Fortsätter med nästa köprojekt om ", // 10..., 9..., 8... 7...
   countdone: "Håll i er; nu börjar vi bygga igen!",
  clickToBuy: "Klicka här för att köpa så mycket av handelsvaran du vill ha.",
},

fr: { // French version maintained by Kissy
    language: "Français",
    finished: " Fini à ",
    execTime: "Temps d'exécution",
 researching: "Recherches",
    showLoot: "Afficher la liste des Pillages",
       shown: "Afficher",
      hidden: "Cacher",
       empty: "Vide : ",
        full: "Plein : ",
      months: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
               "Jui", "Aoû", "Sep", "Oct", "Nov", "Dec"],
 startExpand: "; commencez le développement avant ",
     enqueue: "Mettre en queue",
  prependToQ: "Maj Click: Mettre en queue en première position",
  leftByThen: "Ressources restantes ",
shoppingList: "Liste d'achat: Click sur une icone de Ressource pour " +
                "l'acheter dans le port",
 unavailable: "Ressources indisponibles pour le temps de construction (et le " +
                "temps de régénération)",
   popupInfo: "Click: informations sur les bâtiments; Molette: changer le " +
                "niveaux",
 notShownNow: "Note: pas encore affiché sur la vue principal.",
 readlibrary: "Kronos doit parcourir votre Bibliothèque. Le faire maintenant?",
  travelTime: "Durée du voyage",
   startTime: "Commencé à",
      points: "points",
   countdown: "Lance l'élément suivant dans la queue dans ",
   countdone: "Et c'est parti -- démarrage des constructions",
},

de: { // German version maintained by pusteblume and AbrahamLincoln:
    language: "Deutsch",
    finished: " Beendet ",
    execTime: "benötigte Zeit zum Ausführen",
 researching: "Aktuelle Forschung",
    showLoot: "Raubgut anzeigen",
       shown: "Sichtbar",
      hidden: "Versteckt",
       empty: "leer: ",
        full: "voll: ",
      months: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
               "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
 startExpand: "; beginne den Ausbau vor ",
     enqueue: "Einreihen",
  prependToQ: "Shift Klick um es an den Anfang der Warteschleife zu platzieren",
  leftByThen: "verbliebene Ressourcen ",
shoppingList: "Einkaufsliste",
 unavailable: "Ressourcen nicht erreichbar während der Bauzeit "+
                "(und Regenerieungszeit)",
   popupInfo: "Klicken um Gebäudeinfo zu erhalten, benutze das Mausrad um die "+
                "Stufen zu sehen",
 notShownNow: "Notiz: wird zur Zeit nicht in der Hauptansicht angezeigt.",
 readlibrary: "Kronos muss Deine Bibliothek lesen. Soll das jetzt geschehen?",
  travelTime: "Reise Dauer",
   startTime: "Start Zeit",
      points: "Punkte",
   countdown: "Nächster Auftrag der Queue in ",
   countdone: "Und los geht's -- Initiiere Aufbau Sequenz!",
},

cs: { // Czech translation maintained by Sisel:
    language: "Czech",
    finished: " Dokončeno ",
    execTime: "Čas dokončení",
 researching: "Vynalézáme",
    showLoot: "Drancovací tabulka",
       shown: "Zobrazit",
      hidden: "Skrýt",
       empty: "Prázdno: ",
        full: "Plno: ",
      months: ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer",
               "Čec", "Srp", "Zař", "Říj", "Lis", "Pro"],
 startExpand: "; rozšířovovat nejpozdějí: ",
     enqueue: "Do fronty",
  prependToQ: "Shift+kliknuti pro přidání na začátek fronty",
  leftByThen: "Zbylé suroviny ",
shoppingList: "Nákupní seznam: klikni na surovinu pro nakup v portu",
 unavailable: "Nedostatek surovin ve stavebním čase (i obnovovacím čase)",
   popupInfo: "Klikni pro info o budově, scroluj pro prohlížení levelů",
 notShownNow: "Poznamka: Není momentálně vidět v hlavním okně.",
 readlibrary: "Kronos potřebuje načíst knihovnu. Chcete provést načtení?",
  travelTime: "Čas cestování",
   startTime: "Čas startu",
      points: "body",
 unavailable: "Nedostatek surovin pro stavbu ve frontě",
   countdown: "Pokračuji na další budovu ve frontě za ",
   countdone: "Inicializuji stavební sekvenci!",
},

pl: { // Polish translation maintained by drivex:
    language: "Polski",
    finished: "Koniec o: ",
    execTime: "Czas wykonania",
 researching: "Aktualne badanie",
       shown: "Pokaż",
      hidden: "Ukryty",
       empty: "pusty: ",
        full: "pełny: ",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
 startExpand: "; zacznij kolonizować przed ",
     enqueue: "Dodaj do kolejki",
  prependToQ: "Shift+Klik na budynku aby dodać go na samym początku",
  leftByThen: "Surowce niedostępne ",
shoppingList: "Pozostanie surowców",
 unavailable: "Surowce, które należy kupić by natychmiast rozpocząć budowe",
   popupInfo: "Kliknij aby dowiedzieć się więcej lub zacznij kręcić rolką "+
                "aby dowiedzieć się o kosztach następnych poziomów",
},

ro: { // Romanian translation maintained by n00bster:
    language: "Romana",
    finished: " > ",
    execTime: "Timp",
 researching: "Cercetam",
    showLoot: "Arata capturi",
       shown: "Arata",
      hidden: "Ascund",
       empty: "gol: ",
        full: "Plin: ",
    months: ["Ian", "Feb", "Mar", "Apr", "Mai", "Jun",
             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
 startExpand: "; Incepe expansunea inainte de: ",
     enqueue: "Pune la rand",
  prependToQ: "Shift click pentru a pune in fata sirului",
  leftByThen: "Resurse ramase ",
shoppingList: "Resurse necesare pentru a indeplini constructia",
 unavailable: "Resurse indisponibile la timpul construictiei",
   popupInfo: "Click pentru informatiile cladiri, foloseste scroolul sa "+
                "cauti levelele",
 notShownNow: "Nota: nu se arata in vederea generala jos.",
 readlibrary: "Kronos are nevoie sa cerceteze libraria.Faci asta acum?",
  travelTime: "Timp Calatorie",
   startTime: "Timp Pornire",
      points: "puncte",
   countdown: "Inaintam la urmatoarea cladire din lista in ",
   countdone: "Si acum incepem ...",
},

it: { // Italia language strings maintained by Uomo Merendina. :-)
    language: "Italiano",
    finished: " Finito: ",
    execTime: "Tempo di esecuzione",
 researching: "Attuale Ricerca",
    showLoot: "Visualizza Bottino",
       shown: "Mostrato", 
      hidden: "Nascosto",
       empty: "Vuoto: ",
        full: "Pieno: ",
      months: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
               "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
 startExpand: "; iniziare l'ampliamento prima di ",
     enqueue: "Accoda",
  prependToQ: "Shift click per spostare all'inizio della coda",
  leftByThen: "Risorse mancanti ",
shoppingList: "Lista della Spesa: click sull'icona di una risorsa per " +
                "comperarla al porto",
 unavailable: "Risorse insufficienti al momento dell'ampliamento (anche con " +
                "i trasferimenti)",
   popupInfo: "Click per le Proprietá dell'edificio, usare lo scroll wheel " +
                "per mostrare i livelli",
 notShownNow: "Nota: attualmente non mostrato nella sottostante vista " +
                "principale.",
 readlibrary: "Kronos necessita di leggere lo stato delle ricerche. " +
                "Vuoi farlo ora?",
  travelTime: "Tempo di viaggio",
   startTime: "Inizio",
      points: "punti",
},

// Need updating by natives:
es: { language: "Espagnol" },
pt: { language: "Portuguès" },
da: { language: "Dansk" },

};

GM_registerMenuCommand("Ikariam Kronos Tools: Your language", promptLanguage);

function promptLanguage() {
  var help = [];
  for (var id in langs)
    help.push(id +": "+ langs[id].language);
  while (!langs.hasOwnProperty(newLanguage)) {
    var newLanguage = prompt("Ikariam Kronos Tools: " +
                             "Which language do you prefer?\n(" +
                             help.join(", ") + ")", getLanguage());
    if (!newLanguage) return;
    if (langs.hasOwnProperty(newLanguage)) {
      config.set("language", newLanguage);
      saveConfig();
    }
  }
  location.reload();
}

function getLanguage() {
  function guess() {
    var guess = navigator.language.replace(/-.*/,"");
    return langs.hasOwnProperty(guess) ? guess : "en";
  }
  if (config.get("language") == "sp") config.set("language", "es");
  var id = config.get("language", guess());
  var lang = langs[id], lack = {}, eng = langs.en, incomplete = 0;
  for (var str in eng)
    if (!lang.hasOwnProperty(str) || !lang[str]) {
      lack[str] = eng[str];
      incomplete++;
    }
  if (incomplete) {
    prompt("Sorry -- translation "+ lang.language +" is out of date, as it " +
           "is missing "+ (incomplete == 1 ? "this text" : "these texts") +
           "; falling back to English until fixed:", uneval(lack).slice(2, -2));
    id = config.set("language", "en");
    saveConfig();
  }
  return id;
}
