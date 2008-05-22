var DEBUT = new Date();

var country = location.hostname.replace(/s\d+\.|ikariam\./g, ""); // index below

// The texts here are not stuff to _translate_, but texts as they appear in-game
// on whichever servers you play on. Without these, Kronos won't be able to do a
// few improvements to some views (merchantNavy view, for a start) as it doesn't
// know how to read the page.
var servers = { // Indexed on hostname TLD, if your country is sX.ikariam.TLD

org: #1={ // English
// ?view=merchantNavy texts:
     buyMsn    : "Trade(Buy)",
     buyMsnBack: "Trade (Return)",
     selMsn    : "Trade(Sell)",
     selMsnUndo: "Trade(Sell) (cancelled)",
     tspMsn    : "Transport",
     tspMsnUndo: "Transport (cancelled)", // Undo = U-turn
     tspMsnItcp: "?",
     trpMsn    : "Deploy troops",
     trpMsnUndo: "Deploy troops  (cancelled)",
     attMsn    : "Pillage",
     attMsnBack: "Pillage (Return)",  // Back = left arrow
     attMsnUndo: "Pillage  (cancelled)",
     colMsn    : "?",

// ?view=workshop-army texts:
  lackResources: "Insufficient Resources", // Hover tooltip over "Not available"
   tooLowBldLvl: "Insufficient building level!", // buttons (with the reason)

// ?view=safehouse texts:
   spyWarehouse: "Spy out warehouse",
},
com: #1#, // Also English; hopefully the same (until reported otherwise)

se: { // Swedish server
     buyMsn    : "Handel(Köpa)",
     buyMsnBack: "Handel (Återvänder)",
     selMsn    : "?",
     selMsnUndo: "Handel(Sälja) (avbruten)",
     trpMsn    : "Utplacera trupper",
     trpMsnUndo: "Utplacera trupper  (avbruten)",
     tspMsn    : "Transportera",
     tspMsnUndo: "?",
     attMsn    : "Plundra",
     attMsnBack: "Plundra (återvänder)",
     colMsn    : "Kolonisera",

   spyWarehouse: "Spionera på lagerlokalen",
},

fr: { // French server
     buyMsn    : "Commerce (Acheter)",
     buyMsnBack: "Trade (Retour)",
     selMsn    : "Commerce (Vendre)",
     selMsnUndo: "Commerce (Vendre) (annulé)",
     tspMsn    : "Transport",
     tspMsnUndo: "Transport (annulé)",
     tspMsnItcp: "Transport intercepté",
     attMsn    : "Piller",
     attMsnBack: "Piller (Retour)",
     colMsn    : "Coloniser",

  lackResources: "Quantité insuffisante de ressources",
   tooLowBldLvl: "Niveau de construction insuffisant !",
},

ro: { // Romanian server
     buyMsn    : "Schimb (Cumpara)",
     buyMsnBack: "Schimb (Revin)",
     selMsn    : "Schimb (Vinde)",
     selMsnUndo: "Schimb (Vinde) (anulata)",
     tspMsn    : "Transport",
     tspMsnUndo: "Transport (anulata)",
     tspMsnItcp: "?",
     trpMsn    : "Trimite trupe",
     trpMsnUndo: "Trimite trupe (anulata)",
     attMsn    : "Jefuieste",
     attMsnBack: "Jefuirea (Revin)",
     attMsnUndo: "Jefuirea (anulata)",
     colMsn    : "Colonizeaza",
},

ru: { // Russian server
     buyMsn    : "Торговля (Покупка)",
     buyMsnBack: "Торговля (Обмен)",
     selMsn    : "Торговля (Продажа)",
     selMsnUndo: "Торговля (Покупка) (отменено)",
     trpMsn    : "Разместить войска",
     trpMsnUndo: "Разместить войска (отменено)",
     tspMsn    : "Транспорт",
     tspMsnUndo: "Транспорт (отменено)",
     tspMsnItcp: "?", //Атака транспорта
     attMsn    : "Набег",
     attMsnBack: "Набег (Возвращение)",
     colMsn    : "Колонизировать",

  lackResources: "?", //Insufficient Resources
   tooLowBldLvl: "?", //Insufficient building level!
},

nl: { // Dutch server
     buyMsn    : "Handel(Koop)",
     buyMsnBack: "Handel (Retour)",
     selMsn    : "Handel(Verkoop)",
     selMsnUndo: "Handel(Verkoop) (geannuleerd)",
     trpMsn    : "Stationeer troepen",
     trpMsnUndo: "Stationeer troepen (geannuleerd)",
     tspMsn    : "Transport",
     tspMsnUndo: "Transport (geannuleerd)",
     attMsn    : "Plunderen",
     attMsnBack: "Plunderen (retour)",
     colMsn    : "Koloniseren",
},

cz: { // Czech server
     buyMsn    : "Obchod (Koupit)",
     buyMsnBack: "Obchod (Návrat)",
     selMsn    : "Obchod (Prodat)",
     selMsnUndo: "Obchod (Prodat) (Zrušeno)",
     tspMsn    : "Přeprava",
     tspMsnUndo: "Přeprava (Zrušeno)",
     tspMsnItcp: "?",
     trpMsn    : "Rozmístit vojáky",
     trpMsnUndo: "Rozmístit vojáky (Zrušeno)",
     attMsn    : "Drancovat",
     attMsnBack: "Drancovat (Návrat)",
     attMsnUndo: "Drancovat (Zrušeno)",
     colMsn    : "?",

  lackResources: "Nedostatek surovin",
   tooLowBldLvl: "Nedostačujicí level budovy!",
},

};

var texts = servers[country] || {};


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
stillRemains: "Still remains:", // donations left until the resource upgrades
      title$: "Kronos Utils Configuration", // Kronos options menu header title
    general$: "General",
   cityview$: "City View",
 kronosMenu$: "Show the Kronos menu",
 haveEnough$: "Border colour for buildings you have enough resources to upgrade",
  notEnough$: "Border colour for buildings you do not have enough resources to upgrade",
      White$: "White",
       Gray$: "Gray",
      Green$: "Green",
        Red$: "Red",
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
stillRemains: "Återstår:",
      title$: "Kronos Utils-inställningar",
   cityview$: "Stadsöversikten",
 kronosMenu$: "Visa Kronos-menyn",
 haveEnough$: "Bordfärg för byggnader du har material nog att uppgradera",
  notEnough$: "Bordfärg för byggnader du inte har material nog att uppgradera",
      White$: "Vit",
       Gray$: "Grå",
      Green$: "Grön",
        Red$: "Röd",
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
shoppingList: "Liste d'achat: Click sur une icone de Ressource pour l'acheter dans le port",
 unavailable: "Ressources indisponibles pour le temps de construction (et le temps de régénération)",
   popupInfo: "Click: informations sur les bâtiments; Molette: changer le niveaux",
 notShownNow: "Note: pas encore affiché sur la vue principal.",
 readlibrary: "Kronos doit parcourir votre Bibliothèque. Le faire maintenant?",
  travelTime: "Durée du voyage",
   startTime: "Commencé à",
      points: "points",
   countdown: "Lance l'élément suivant dans la queue dans ",
   countdone: "Et c'est parti -- démarrage des constructions",
  clickToBuy: "Clique sur le prix autant de ressources que tu veux.",
stillRemains: "Restes:",
      title$: "Configuration de Kronos Utils",
    general$: "Général",
   cityview$: "Vue de la ville",
 kronosMenu$: "Afficher le menu Kronos",
 haveEnough$: "Couleur des bordures des bâtiments si vous avez assez de ressources pour l'améliorer",
  notEnough$: "Couleur des bordures des bâtiments si vous n'avez assez de ressources pour l'améliorer",
      White$: "Blanc",
       Gray$: "Gris",
      Green$: "Vert",
        Red$: "Rouge",
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
 unavailable: "Ressourcen nicht erreichbar während der Bauzeit (und Regenerieungszeit)",
   popupInfo: "Klicken um Gebäudeinfo zu erhalten, benutze das Mausrad um die Stufen zu sehen",
 notShownNow: "Notiz: wird zur Zeit nicht in der Hauptansicht angezeigt.",
 readlibrary: "Kronos muss Deine Bibliothek lesen. Soll das jetzt geschehen?",
  travelTime: "Reise Dauer",
   startTime: "Start Zeit",
      points: "Punkte",
   countdown: "Nächster Auftrag der Queue in ",
   countdone: "Und los geht's -- Initiiere Aufbau Sequenz!",
  clickToBuy: "Klicke hier, um die benötigten Waren zu kaufen.",
stillRemains: "Bis dahin fehlen noch:",
      title$: "Kronos Utils Konfiguration",
    general$: "Haupt Einstellungen",
   cityview$: "Stadt Anzeige",
 kronosMenu$: "Zeige das Kronos Menü",
 haveEnough$: "Rahmenfarbe für Gebäude, für die die notwendigen Materialien vorhanden sin",
  notEnough$: "Rahmenfarbe für Gebäude, für die die notwendigen Materialien nicht vorhanden sind",
      White$: "Weiss",
       Gray$: "Grau",
      Green$: "Grün",
        Red$: "Rot",
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
 unavailable: "Nedostatek surovin pro stavbu ve frontě",
   popupInfo: "Klikni pro info o budově, scroluj pro prohlížení levelů",
 notShownNow: "Poznamka: Není momentálně vidět v hlavním okně.",
 readlibrary: "Kronos potřebuje načíst knihovnu. Chcete provést načtení?",
  travelTime: "Čas cestování",
   startTime: "Čas startu",
      points: "body",
   countdown: "Pokračuji na další budovu ve frontě za ",
   countdone: "Inicializuji stavební sekvenci!",
  clickToBuy: "Klikni na cenu pro nakup libovolného množství zboží.",
stillRemains: "Stále zůstává:",
      title$: "Konfigurace Kronos Utils",
    general$: "Základní",
   cityview$: "Městský pohled",
 kronosMenu$: "Ukaž Kronos menu",
 haveEnough$: "Barva okrajů budov, pro které je dostatek surovin na upgrade",
  notEnough$: "Barva okrajů budov, pro které není dostatek surovin na upgrade",
      White$: "Bílá",
       Gray$: "Šedá",
      Green$: "Zelená",
        Red$: "Červená",
},

pl: { // Polish translation maintained by drivex:
    language: "Polski",
    finished: " Koniec o: ",
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
   popupInfo: "Kliknij aby dowiedzieć się więcej lub zacznij kręcić rolką aby dowiedzieć się o kosztach następnych poziomów",
},

ro: { // Romanian translation upgraded by n00bster and Skorpishor:
    language: "Romana",
    finished: " Se termina: ",
    execTime: "Timp",
 researching: "Cercetare",
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
shoppingList: "Resurse necesare pentru a putea incepe constructia",
 unavailable: "Resurse indisponibile la timpul constructiei",
   popupInfo: "Click pentru informatiile cladiri, foloseste scroolul sa cauti nivelurile",
 notShownNow: "Nota: nu se arata in vederea generala jos.",
 readlibrary: "Kronos are nevoie sa cerceteze libraria. Faci asta acum?",
  travelTime: "Timp Calatorie",
   startTime: "Timp Pornire",
      points: "puncte",
   countdown: "Inaintam la urmatoarea cladire din lista in ",
   countdone: "Si acum incepem ...",
  clickToBuy: "Apasa sa cumperi atat cat vrei.",
stillRemains: "Mai raman:",
      title$: "Configurare Kronos Utils",
    general$: "General",
   cityview$: "Vederea Orasului",
 kronosMenu$: "Arata meniul Kronos",
 haveEnough$: "Culoarea bordurii pentru cladirile care au destule resurse pentru upgrade",
  notEnough$: "Culoarea bordurii pentru cladirile care nu au destule resurse pentru upgrade",
      White$: "Alb",
       Gray$: "Gri",
      Green$: "Verde",
        Red$: "Rosu",
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
shoppingList: "Lista della Spesa: click sull'icona di una risorsa per comperarla al porto",
 unavailable: "Risorse insufficienti al momento dell'ampliamento (anche con i trasferimenti)",
   popupInfo: "Click per le Proprietà dell'edificio, usare lo scroll wheel per mostrare i livelli",
 notShownNow: "Nota: attualmente non mostrato nella sottostante vista principale.",
 readlibrary: "Kronos necessita di leggere lo stato delle ricerche. Vuoi farlo ora?",
  travelTime: "Tempo di viaggio",
   startTime: "Inizio",
      points: "punti",
   countdown: "Attivazione del prossimo elemento in coda tra ",
   countdone: "E adesso si comincia -- Inzio della sequenza di costruzione!",
  clickToBuy: "Clicca per comperare tutti i beni che desideri.",
stillRemains: "Mancano ancora:",
      title$: "Configurazione delle Kronos Utils",
    general$: "Generale",
   cityview$: "Vista Città",
 kronosMenu$: "Visualizza il Kronos Menu",
 haveEnough$: "Colore della cornice sugli edifici per i quali HAI sufficienti risorse per l'aggiornamento",
  notEnough$: "Colore della cornice sugli edifici per i quali NON HAI sufficienti risorse per l'aggiornamento",
      White$: "Bianco",
       Gray$: "Grigio",
      Green$: "Verde",
        Red$: "Rosso",
},

ru: { // Russian translation updated by XtoZee
    language: "Русский",
    finished: " Завершение ",
    execTime: "Время выполнения",
 researching: "Исследуется",
    showLoot: "Показать лут",
       shown: "Показано",
      hidden: "Спрятано",
       empty: "закончится: ",
        full: "заполнится: ",
      months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
               "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
 startExpand: "; расширить до ",
     enqueue: "В очередь",
  prependToQ: "Shift + клик для добавление в начало очереди",
  leftByThen: "Ресурсов осталось ",
shoppingList: "Лист покупок: клик на иконке ресурса для покупки в порту",
 unavailable: "Ресурсов не хватает ко времени строительства (с учетом прироста)",
   popupInfo: "Клик для информации постройки, используйте колесо мыши для просмотра уровней",
 notShownNow: "Пометка: пока не показывается в главном окне ниже.",
 readlibrary: "Kronos`у нужно порыться в библиотеке. Сделать это сейчас?",
  travelTime: "Время в пути",
   startTime: "Начало",
      points: "очков",
   countdown: "Переходим к следующему элементы в очереди через ",
   countdone: "И поехали -- Начинаем постройку!",
  clickToBuy: "Клик на цену для покупки ресурса в нужных количествах.",
stillRemains: "Осталось:",
      title$: "Конфигурация Kronos Utils",
    general$: "Основное",
   cityview$: "Вид города",
 kronosMenu$: "Показывать меню Kronos",
 haveEnough$: "Цвет границы зданий, на которые хватает ресурсов",
  notEnough$: "Цвет границы зданий, на которые НЕ хватает ресурсов",
      White$: "Белый",
       Gray$: "Серый",
      Green$: "Зеленый",
        Red$: "Красный",
},

nl: { // Dutch by Pyro
    language: "Nederlands",
    finished: " Klaar: ",
    execTime: "Tijd nodig voor uitvoeren",
 researching: "Huidig onderzoek",
    showLoot: "Toon plunder tabel",
       shown: "Getoond",
      hidden: "Verborgen",
       empty: "Leeg: ",
        full: "Vol: ",
      months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
               "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
 startExpand: "; start uitbreiding voor ",
     enqueue: "Plaats in de rij",
  prependToQ: "Shift klik om aan de kop van de rij te zetten",
  leftByThen: "Grondstoffen over ",
shoppingList: "Inkooplijst: klik op een grondstof icoon om die te kopen in je haven",
 unavailable: "Grondstoffen niet beschikbaar door bouwtijd (en aanvul tijd)",
   popupInfo: "Klik voor gebouw info, gebruik scroll wiel om door levels te browsen",
 notShownNow: "Noot: op dit moment niet getoond in het hoofdoverwicht hieronder.",
 readlibrary: "Kronos moet je bibliotheek doorlezen, dat nu doen?",
  travelTime: "Reistijd",
   startTime: "Start tijd",
      points: "punten",
   countdown: "Doorgaan naar volgend item in de rij over ",
   countdone: "Daar gaan we -- bezig met starten van bouw rij!",
  clickToBuy: "Klik op de prijs om zoveel goederen te kopen als je wilt.",
stillRemains: "Nog nodig:",
      title$: "Kronos Utils Configuratie",
    general$: "Algemeen",
   cityview$: "Stad Overzicht",
 kronosMenu$: "Toon het Kronos menu",
 haveEnough$: "Rand kleur voor gebouwen waarvoor genoeg grondstoffen aanwezig zijn om te upgraden",
  notEnough$: "Rand kleur voor gebouwen waarvoor niet genoeg grondstoffen aanwezig zijn om te upgraden",
      White$: "Wit",
       Gray$: "Grijs",
      Green$: "Groen",
        Red$: "Rood",
},

es: { // Espanol translation upgraded by sekathree:
    language: "Espanol",
    finished: " termina a las ",
    execTime: "Tiempo de ejecucion",
 researching: "Investigando",
    showLoot: "Mostrar informacion del botin",
       shown: "Mostrar",
      hidden: "Ocultar",
       empty: "vacio: ",
        full: "lleno: ",
      months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
               "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
 startExpand: "; Empezar expansion antes ",
     enqueue: "Poner en cola",
  prependToQ: "Shift click para poner al principio de la cola",
  leftByThen: "Recursos restantes",
shoppingList: "Lista de compra: click en un icono de recurso para comprar eso en tu puerto",
 unavailable: "Recursos no disponibles por tiempo de construccion (y tiempo de relleno)",
   popupInfo: "Click para info de edificios, usar scroll wheel para buscar niveles",
 notShownNow: "Nota:Actualmente no mostrado en la vista principal de abajo.",
 readlibrary: "Kronos necesita leer en tu biblioteca. Hacerlo ahora?",
  travelTime: "Tiempo de viaje",
   startTime: "Hora de inicio",
      points: "puntos",
   countdown: "Procediendo con el siguiente elemento de la cola",
   countdone: "Y ahi vamos -- Inicializando secuencia de construccion!",
  clickToBuy: "Click en el precio para comprar tantos bienes como quieras.",
stillRemains: "Aun se necesitan:",
      title$: "Configuracion Kronos Utils",
    general$: "General",
   cityview$: "Vista de la ciudad",
 kronosMenu$: "Muestra  el menu de Kronos",
 haveEnough$: "Color del borde de los edificios indica que tienes suficientes recursos para actualizar",
  notEnough$: "Color del borde de los edificios indica que no tienes suficientes recursos para actualizar",
      White$: "Blanco",
       Gray$: "Gris",
      Green$: "Verde",
        Red$: "Rojo",
},

// Need updating by natives:
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
  var lang = copy(langs[id]), lack = {}, eng = langs.en, incomplete = 0;
  var user = unsafeWindow["kronos_"+id] || {};
  for (var usr in user) lang[usr] = user[usr];
  for (var str in eng)
    if (!lang[str]) {
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
  langs[id] = lang;
  return id;
}
