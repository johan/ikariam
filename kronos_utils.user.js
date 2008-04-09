// ==UserScript==
// @name           Kronos Utils
// @author         Merwin
// @email          merwinkronos@gmail.com
// @namespace      Kronos
// @description    Divers petits utilitaires.
// @include        http://*.ikariam.*/*
// @exclude        http://board.ikariam.*/
// @exclude        http://*.ikariam.*/index.php?view=renameCity*
// ==/UserScript==

/*-------------------------------------
Propriétés du script
--------------------------------------*/
var DEBUT = new Date();

// En fonction du language du naviguateur on va utiliser un langage associé.
var language = 0, finished = 1, langUsed = 11, execTime = 12, wood = 14;
var researching = 16, shown = 17, full = 19, monthshort = 20, empty = 21;
var startExpand = 22, enqueue = 23, shiftClick = 24, shop = 25, left = 26;
var unreplenished = 27, popupInfo = 28;
var langs = {
  "fr": ["Français", " Fini à ", "Fermer", "Upgrader plus tard.",
         "File de construction", "Ajouter un bâtiment.", "Construire dans",
         "heures", "minutes et", "secondes",
         "valider", "Langue utilisée", "Temps d'exécution",
         "Pas de bâtiment en attente.", "Bois", "Luxe",
         "Recherches", "Visible", "Invisible", "plein: ",
         "JanFévMarAvrMaiJunJuiAoûSepOctNovDéc", "vide: ",
         "; commencer avant que ", "Enqueue",
         "Shift-clique, peut-être?",
         "Acheter ça, s'il vous plaît", "Même available après ",
         "Il faut attendre pour ces ressources",
         "Clique pour bàtiment information"],
  "en": ["English", " Finished ", "Close", "Upgrade later.",
         "Building list", "Add building.", "Build at",
         "hours", "minutes and", "seconds",
         "confirm", "Language used", "Time of execution",
         "No building in waiting.", "Wood", "Luxe",
         "Researching", "Shown", "Hidden", "full: ",
         "JanFebMarAprMayJunJulAugSepOctNovDec", "empty: ",
         "; start expanding before ", "Enqueue",
         "Shift click to put at the head of the queue",
         "Shopping list", "Resources left ",
         "Resources unavailable by build time (and replenish time)",
         "Click for building info, use scroll wheel to browse levels"],
  // By pusteblume:
  "de": ["Deutsch", " Beendet ", "Schliessen", "Später upgraden.",
         "Bauliste", "Gebäude hinzufügen.", "Fertiggestellt in",
         "Stunden", "Minuten und", "Sekunden",
         "bestätigen", "Gewählte Sprache", "benötigte Zeit zum Ausführen",
         "Kein Gebäude in der Warteschleife.", "Holz", "Luxusgut",
         "aktuelle Forschung", "Sichtbar", "Versteckt", "voll: ",
         "JanFebMärAprMaiJunJulAugSepOktNovDez", "leer: ",
         "; start expanding before ", "Einreihen",
         "Shift Klick um es an den Anfang der Warteschleife zu platzieren",
         "Einkaufsliste", "verbliebene Ressourcen ",
         "Ressourcen nicht erreichbar während der Bauzeit "+
         "(und Regenerieungszeit)",
         "Klicken um Gebäudeinfo zu erhalten, benutze das Mausrad um die "+
         "Stufen zu sehen"],
  // By Tico:
  "pt": ["Portuguès", " acaba às ", "Fechar", "Evoluir mais tarde.",
         "Lista de construção", "Adicionar edificio.", "Construir em",
         "horas", "minutos e", "segundos",
         "confirmar", "Lingua usada", "Tempo de execução",
         "Nenhum Edificio em espera.", "Madeira", "Luxo"],
  "da": ["Dansk", " Færdig kl. ", "Luk", "Opgrader senere.",
         "Bygnings liste", "Tilføj bygning.", "Byg kl.",
         "timer", "minutter og", "sekunder",
         "bekræft", "Sprog brugt", "Udførelsestid",
         "Ingen bygning venter.", "Træ", "Luxe"],
  // By A.Rosemary:
  "sp": ["Espagnol", " termina a las ", "Cerrar", "Actualizar más tarde.",
         "Lista de construcción", "Añadir edificio.", "Construir en",
         "horas", "minutos y", "segundos",
         "confirmar", "Idioma usado", "Tiempo de ejecución",
         "Nenhum Edificio em espera.", "Madera", "Luxe",
         "Investigación"],
  "sv": ["Svenska", " Färdigt ", "Stäng", "Uppgradera senare",
         "Byggnadslista", "Lägg till byggnad", "Bygg klockan",
         "timmar", "minuter och", "sekunder",
         "bekräfta", "Språk", "Exekveringstid",
         "Inga byggnader väntar.", "Trä", "Lyx",
         "Forskning", "Visas", "Gömda", "fullt: ",
         "janfebmaraprmajjunjulaugsepoktnovdec", "tomt: ",
         "; börja bygg ut före ", "Köa upp",
         "Shift-klicka för att lägga först i kön",
         "Inköpslista", "Resurser kvar efter ",
         "Resurser som kommer saknas vid byggstart, och inskaffningstid",
         "Klicka för byggnadsinfo, använd scrollhjulet för andra nivåer"]
};
var lang;

function nth(n) {
  var th = [, "st", "nd", "rd"];
  return n + (th[n] || "th");
}

var name = "Kronos";
var version = " 0.5";
/*-------------------------------------
Création de div, br, link etc...
-------------------------------------*/

function url(query) {
  return location.href.replace(/(\?.*)?$/, query||"");
}

function jsVariable(nameValue) {
  var resourceScript = $X('id("cityResources")//script');
  if (resourceScript) {
    var text = resourceScript.innerHTML;
    text = text.substr(text.indexOf(nameValue+" = "),
                       text.length);
    text = text.substr(nameValue.length+3,
                       text.indexOf(";")-(nameValue.length+3));
    return text;
  }
}

function luxuryType(type) {
  var script = $X('id("cityResources")/script').textContent.replace(/\s+/g," ");
  var what = script.match(/currTradegood.*?value_([^\x22\x27]+)/)[1];
  switch (type) {
    case undefined:
    case 0: return resourceIDs[what];

    case "name":
    case 1: return what;

    case "glass": return what.replace("crystal", "glass");

    case "english":
    case 2:
      what = $X('id("value_'+ what +'")/preceding-sibling::span');
      return what.textContent.replace(/:.*/, "");
  }
}

// on récupére une des valeurs get d'une url(son nom est le param.
function urlParse(param, url) {
  if (!url) url = location.search || ""; // On récupére l'url du site.
  if (!url && param == "view") {
    var view = document.body.id;
    if (view) return view;
  }
  var keys = {};
  url.replace(/([^=&?]+)=([^&]*)/g, function(m, key, value) {
    keys[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return param ? keys[param] : keys;
}

function createNode(id, classN, html, tag, styles, htmlp) {
  var div = document.createElement(tag||"div");
  if (id) div.id = id;
  if (classN) div.className = classN;
  if (isDefined(html))
    if (htmlp)
      div.innerHTML = html;
    else
      div.appendChild(document.createTextNode(html));
  if (styles)
    for (var prop in styles)
      div.style[prop] = styles[prop];
  return div;
}

function createLink(nom, href) {
  var lien = document.createElement('a');//création d'un lien
  lien.setAttribute('href', href);//On ajoute le href
  lien.appendChild(document.createTextNode(nom));//On ajoute le text.

  return lien;
}

function goto(href) {
  location.href = href.match(/\?/) ? href : urlTo(href);
}

function gotoCity(url, id) {
  var city = $("citySelect");
  var ids = cityIDs();
  if (isDefined(id)) {
    city.selectedIndex = ids.indexOf(id);
  } else {
    var index = referenceCityID("index");
    city.selectedIndex = index;
    id = ids[index];
  }
  var form = city.form;
  if (isDefined(url)) form.action = url;
  form.elements.namedItem("oldView").value = "city";
  form.elements.namedItem("id").value = id;
  form.submit()
}

function createBr() { // fonction de création saut de ligne
  return document.createElement("br");
}

function css(rules, disabled) {
  var head = $X('/html/head');
  var style = document.createElement("style");
  style.type = "text/css";
  style.textContent = isString(rules) ? rules : rules.toString();
  if (isBoolean(disabled))
    style.disabled = disabled;
  return head.appendChild(style);
}

function addCSSBubbles() { css(<><![CDATA[

.pointsLevelBat {
  background-color: #FDF8C1;
  -moz-border-radius: 1em;
  border: 2px solid #918B69; /*"#B1AB89"*/
  border-radius: 1em;
  font-family: Sylfaen, "Times New Roman", sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  position: absolute;
  width: 18px;
  cursor: pointer;
  height: 15px;
  visibility: visible;
  top: 10px;
  left: 25px;
  z-index: 50;
}

.toBuild {
  top: 32px;
  width: auto;
  height: 23px;
  white-space: pre;
  padding: 3px 5px 0;
  z-index: 1000;
}

#islandfeatures .wood .pointsLevelBat {
  margin-top: 9px;
  margin-left: -18px;
}
#islandfeatures .wine .pointsLevelBat {
  margin-left: 8px;
  margin-top: 0px;
}
#islandfeatures .marble .pointsLevelBat {
  margin-top: 18px;
  margin-left: 0px;
}
#islandfeatures .crystal .pointsLevelBat {
  margin-top: 9px;
  margin-left: -8px;
}
#islandfeatures .sulfur .pointsLevelBat {
  margin-top: 4px;
  margin-left: 10px;
}

#townhallfits {
  top: 1px;
  display: inline;
  margin-left: 4px;
  position: relative;
  vertical-align: top;
}
]]></>); }


// Military stuff:

function militaryAdvisorMilitaryMovementsView() {
  function project(div) {
    var li = $X('ancestor::li', div)
    projectCompletion(div);
    li.style.height = "52px";
  }
  $x('//li/div/div[contains(@id,"CountDown")]').forEach(project);
}

function makeLootTable(table, reports) {
  function filterView() {
    var visible = show.filter(function(x) { return x.checked; });
    if ((hide.disabled = 0 == visible.length)) return;
    hide.textContent = hideMost + "#loot-report tr.loot." +
      pluck(visible, "id").join(".") + " { display: table-row; }";
  }

  function filter(check) {
    return function() { click(check); };
  }

  function sort(col, key) {
    function move(junk, i, all) {
      var pos = keys[i] % all.length;
      buffer.insertBefore(tr[pos], buffer.firstChild);
    }

    var td = $x('tr[starts-with(@class,"loot")]/td['+ (col+1) +']', body);
    if (!td.length) return;
    var tr = pluck(td, "parentNode");
    var keys = td.map(key);
    var direction = col == 9 ?
      function descending(a, b) { return a < b ? 1 : -1; } :
      function ascending(a, b) { return a > b ? 1 : -1; };
    keys.sort(direction);
    var last = tr[tr.length-1].nextSibling;

    var buffer = document.createDocumentFragment();
    tr.forEach(move);
    body.insertBefore(buffer, last);
  }

  function sortByCity() {
    function key(td, i, all) {
      var a = $X('a[2]', td);
      var id = a ? integer(urlParse("selectCity", a.search)) : 0;
      return id * all.length + i;
    }
    sort(11, key);
  }

  function sortByWhen() {
    function key(td, i, all) {
      var M, D, h, m;
      [D, M, h, m] = trim(td.textContent).split(/\D+/g);
      return integer([M, D, h, m].join("")) * all.length + i;
    }
    sort(2, key);
  }

  function sortByDistance() {
    function key(td, i, all) {
      var t = Math.round(td.getAttribute("time")) || 1000000;
      return t * all.length + i;
    }
    sort(9, key);
  }

  function sortByLoot(col) {
    return function(e) {
      function key(td, i, all) {
        var value = integer(td.firstChild || 0);
        return value * all.length + i;
      }
      sort(col, key);
    };
  }

  function showLoot(report) {
    var tr = report.tr;
    delete report.tr;
    var loot = report.l;
    var has = ["loot"];
    for (var c = 3; c < cols.length; c++) {
      var td = tr.insertCell(c);
      var r = cols[c];
      if ("T" == r && report.c) {
        var t = travelTime(report.c);
        if (t) {
          td.setAttribute("time", t+"");
          td.innerHTML = secsToDHMS(t, 1);
          td.className = "time";
        }
        continue;
      }
      if ("#" == r) {
        var wonToday = hits[report.c] || ""
        td.innerHTML = wonToday;
        if (wonToday > 5)
          td.className = "warn"; // bash alert!
      }
      if (!loot || !loot[r]) continue;
      td.className = "number";
      var got = {}; got[r] = loot[r];
      td.innerHTML = visualResources(got, { size: 0.5 });
      has.push(r);
    }
    tr.className = has.join(" ");
  }

  table.id = "loot-report";
  var hideMost = "#loot-report tr.loot { display:none; }";
  var hide = css("", true);
  var body = $X('tbody', table);
  var head = body.insertRow(0);
  var cols = [, , , "g", "w", "W", "M", "C", "S", "T", "#"];
  var hits = {}; // indexed on city id, values are attacks today
  var show = [];
  var title = [, , "When",
               "$gold", "$wood", "$wine", "$marble", "$glass", "$sulfur",
               "Time", "#", "City"];
  for (var i = 0; i < 13; i++) {
    var r = cols[i];
    var t = title[i] || "";
    var th = createNode("", r ? "Time" == t ? "": "number" : "",
                        visualResources(t),
                        i && i < 12 ? "th" : "td", null, "html");
    head.appendChild(th);
    if ("When" == t) clickTo(th, sortByWhen);
    if ("City" == t) clickTo(th, sortByCity);
    if ("Time" == t) { clickTo(th, sortByDistance); continue; }
    if ("#" == t || !r) continue;

    var check = document.createElement("input");
    check.type = "checkbox";
    check.id = r;
    th.insertBefore(check, th.firstChild);
    show.push(check);

    //var img = $X('img', th);
    clickTo(th, sortByLoot(i), 'not(self::input)');
    //clickTo(check, filterView); -- (preventDefault:s)
    check.addEventListener("click", filterView, false);
    dblClickTo(th, filter(check), "", true);
  }

  var yesterday = Date.now() - (25 * 36e5);
  for (var i = 0; r = reports[i]; i++) {
    var recent = r.t > yesterday;
    if (recent && r.w && r.c)
      hits[r.c] = 1 + (hits[r.c] || 0);
  }
  reports.forEach(showLoot);
  unsafeWindow.markAll = safeMarkAll;

  // need to restow these a bit not to break the layout:
  var selection = $X('tr[last()]/td[@class="selection"]', body);
  var go = $X('tr[last()]/td[@class="go"]', body);
  go.parentNode.removeChild(go);
  selection.innerHTML += go.innerHTML;
  selection.setAttribute("colspan", "7");
  selection.className += " go";
  go = $X('input[@type="submit"]', selection);
  go.style.marginLeft = "6px";
}

function safeMarkAll(cmd) {
  //console.log("safe %x!", cmd);
  var boxes = $x('id("finishedReports")//input[@type="checkbox" and not(@id)]');
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i], tr = $X('ancestor::tr[1]', box);
    if ("none" != getComputedStyle(tr, "").display) {
      if ("checked" == cmd) box.checked = true;
      if ("reverse" == cmd) box.checked = !box.checked;
    }
  }
}

function copy(object) {
  // Doug Crockford
  var fn = function() {};
  fn.prototype = object;
  return new fn;
}

function militaryAdvisorCombatReportsView() {
  function parseDate(t) {
    var Y, M, D, h, m;
    if ((t = t && trim(t.textContent).split(/\D+/))) {
      [D, M, h, m] = t.map(function(n) { return parseInt(n, 10); });
      Y = (new Date).getFullYear();
      return (new Date(Y, M - 1, D, h, m)).getTime();
    }
  }
  function fileReport(tr, n) {
    var a = $X('td[contains(@class,"subject")]/a', tr);
    var w = $X('contains(../@class,"won")', a);
    var r = parseInt(urlParse("combatId", a.search));
    var d = $X('td[@class="date"]', tr);
    var t = parseDate(d);
    repId[n] = r;
    if (!allreps[r]) {
      w ? history.won++ : history.lost++;
      newreps[r] = { t: t, w: 0 + w };
      allreps[r] = newreps[r];
    }
    rows[n] = copy(allreps[r]);
    rows[n].tr = tr;
  }
  var table = $X('id("finishedReports")/table[@class="operations"]');
  if (!table) return;
  var history = eval(config.getServer("war", "({ won: 0, lost: 0 })"));
  var allreps = eval(config.getServer("reports", "({})"));
  var reports = $x('tbody/tr[td[contains(@class,"subject")]]', table);
  var newreps = {};
  var cities = {};
  var repId = [];
  var rows = [];
  reports.forEach(fileReport);

  var city = config.getServer("cities", {});
  for (var i = reports.length; --i >= 0;) {
    var a = $X('.//a', reports[i]);
    var r = allreps[repId[i]];

    var recent = r.t > Date.now() - (25 * 36e5);
    // we won, we don't know what city, it's the past 24h (+ DST safety margin)
    if (r.w && !r.c && recent) {
      a.style.fontStyle = "italic"; // Warn about it! Read that report, please.
      a.innerHTML = "?: "+ a.innerHTML;
    }

    if (r.c) {
      if (recent)
        var c = cities[r.c] = 1 + (cities[r.c] || 0);
      var name = city[r.c].n;
      var text = a.textContent;
      text = text.slice(0, text.lastIndexOf(name));
      a.textContent = text;
      var island = linkTo(urlTo("island", { island: city[r.c].i, city: r.c }),
                          null, null, { text: name });
      a.parentNode.appendChild(island);
    }
  }
  makeLootTable(table, rows);

  config.setServer("war", history);
  config.setServer("reports", allreps);
  //console.log(history.toSource());
  //console.log(allreps.toSource());
}

function militaryAdvisorReportViewView() {
  var loot = parseResources('//td[@class="winner"]/ul[@class="resources"]/li');
  var a = $X('id("battleReportDetail")//a');
  var cities = config.getServer("cities", {});
  var city = parseInt(urlParse("selectCity", a.search));
  var island = parseInt(urlParse("id", a.search));
  var reports = config.getServer("reports", {});
  var r = urlParse("combatId");
  var report = reports[r];
  if (report) {
    if (loot) report.l = loot;
    report.c = city;
  }
  if (!cities.hasOwnProperty(city))
    cities[city] = {};
  var c = cities[city];
  c.n = a.textContent;
  c.i = island;
  config.setServer("cities", cities);
  config.setServer("reports", reports);
  //console.log(cities.toSource());
  //console.log(reports[r].toSource());
}

function plunderView() {
  scrollWheelable();
  dontSubmitZero(2, 'id("selectArmy")//input[@type="submit"]');
}


function add(fmt) {
  for (var i = 1; i<arguments.length; i++) {
    var id = arguments[i];
    xpath[id] = fmt.replace("%s", id);
  }
}

var xpath = {
  ship: 'id("globalResources")/ul/li[@class="transporters"]/a',
  citynames: 'id("changeCityForm")//ul[contains(@class,"optionList")]/li'
};
add('id("value_%s")', "wood", "wine", "marble", "crystal", "sulfur");

function get(what, context) {
  var many = { citynames: 1 };
  var func = many[what] ? $x : $X;
  return what in xpath ? func(xpath[what], context) : undefined;
}

var resourceIDs = {
  wood: "w", wine: "W", marble: "M", glass: "C", crystal: "C", sulfur: "S",
  gold: "g", inhabitants: "p", maxActionPoints: "a"
};

function currentResources() {
  return {
    p: number($("value_inhabitants").textContent.replace(/\s.*/, "")),
    g: number($("value_gold")), w: number($("value_wood")),
    W: number($("value_wine")), M: number($("value_marble")),
    C: number($("value_crystal")), S: number($("value_sulfur"))
  };
}

function addResources(a, b, onlyIterateA) {
  return opResources(a, b, function(a, b) { return a + b; }, onlyIterateA);
}
function subResources(a, b, onlyIterateA) {
  return opResources(a, b, function(a, b) { return a - b; }, onlyIterateA);
}

function opResources(a, b, op, onlyIterateA) {
  var o = {}, r;
  for (r in a)
    o[r] = op(a[r], (b[r] || 0));
  if (onlyIterateA) return o;
  for (r in b) {
    if (o.hasOwnProperty(r)) continue;
    o[r] = op((a[r] || 0), b[r]);
  }
  return o;
}

function parseResources(res) {
  if (isString(res))
    res = $x(res);
  var o = {}, r, id;
  if (res.length)
    for (var i = 0; i < res.length; i++) {
      r = res[i];
      id = resourceIDs[r.className.split(" ")[0]];
      o[id] = integer(r);
    }
  else
    return null;
  return o;
}

function haveResources(needs) {
  var have = currentResources();
  for (var r in needs)
    if (needs[r] > (have[r] || 0))
      return false;
  return true;
}

function reapingPace() {
  var pace = {
    g: config.getCity("gold", 0),
    p: config.getServer("growth", 0),
    w: secondsToHours(jsVariable("startResourcesDelta"))
  };
  pace[luxuryType()] = secondsToHours(jsVariable("startTradegoodDelta"));
  var wineUse = config.getCity("wine", 0);
  if (wineUse)
    pace.W = (pace.W || 0) - wineUse;
  return pace;
}

var buildingIDs = {
  townHall: 0, townhall: 0, port: 3, academy: 4, shipyard: 5, barracks: 6,
  warehouse: 7, wall: 8, tavern: 9, museum: 10, palace: 11, embassy: 12,
  branchOffice:13, "workshop-army": 15, "workshop-fleet": 15, safehouse: 16,
  palaceColony: 17
};

function buildingClass(id) {
  id = buildingID(id);
  for (var name in buildingIDs)
    if (buildingIDs[name] == id)
      return name;
}

function buildingID(a) {
  if (isNumber(a)) return a;
  var building = isString(a) ? a : a.parentNode.className;
  return buildingIDs[building];
}

function haveBuilding(b) {
  return buildingLevel(b, 0) && ("-" != buildingPosition(b, "-"));
}

function buildingPosition(b, otherwise) {
  var p = config.getCity("posbldg"+ buildingID(b), "?");
  return "?" == p ? otherwise : p;
}

function buildingLevel(b, otherwise, saved) {
  b = buildingID(b);
  if (!saved && "city" == urlParse("view")) {
    var div = $("position" + buildingPosition(b));
    var a = $X('a[@title]', div);
  }
  if (saved || !a)
    b = config.getCity("building"+ b, "?");
  else
    b = number(a.title);
  return "?" == b ? otherwise : b;
}

function buildingLevels() {
  var levels = {};
  for (var name in buildingIDs) {
    var id = buildingIDs[name];
    var level = config.getCity("building"+ id, 0);
    if (level)
      levels[id] = level;
  }
  return levels;
}

var buildingCapacities = {
  townHall:
    [, 60, 96, 143, 200, 263, 333, 410, 492, 580, 672, 769, 871, 977, 1087,
     1201, 1320, 1441, 1567, 1696, 1828, 1964, 2103, 2246, 2391, 2691, 2845,
     3003, 3163, 3326, 3492, 3360],

  academy:
    [0, 8, 12, 16, 22, 28, 35, 43, 51, 60, 69, 79, 89, 100, 111, 122, 134, 146,
     159, 172, 185, 198, 212, 227, 241],

  tavern:
    [0, 3, 5, 8, 11, 14, 17, 21, 25, 29, 33, 38, 42, 47, 52, 57, 63, 68, 73, 79,
     85, 91, 97, 103, 109],

  warehouse: {
    wood: [ 100,  140,  190,  240,  310,  380,  470,  560,  670,  790,  930,
           1090, 1260, 1450, 1670, 1910, 2180],
    rest: [  50,   70,   90,  120,  150,  190,  230,  280,  330,  390,  460,
            540,  630,  720,  830,  950, 1090]
  }
}

function buildingCapacity(b, l, warehouse) {
  b = buildingClass(b);
  var c = buildingCapacities[b];
  c = c && c[l];
  return isDefined(warehouse) ? c && c[warehouse] : c;
}

function buildingExpansionNeeds(a, level) {
  level = isDefined(level) ? level : a && number(a.title);
  var needs = costs[b = buildingID(a)][level];
  var value = {};
  var factor = 1.00;
  if (config.getServer("tech2020")) factor -= 0.02; // Pulley
  if (config.getServer("tech2060")) factor -= 0.04; // Geometry
  if (config.getServer("tech2100")) factor -= 0.08; // Spirit Level
  for (var r in needs)
    if ("t" == r) // no time discount
      value[r] = needs[r];
    else
      value[r] = Math.floor(needs[r] * factor);
  return value;
}

function haveEnoughToUpgrade(a) {
  var upgrade = buildingExpansionNeeds(a);
  var resources = currentResources();
  var enough = true;
  for (var resource in upgrade)
    if (resource != "t" && resources[resource] < upgrade[resource])
      enough = false;
  return enough;
}

function buildingExtraInfo(div, id, name, level) {
  function annotate(msg) {
    msg = createNode("", "ellipsis", msg, "span");
    msg.style.position = "relative";
    div.appendChild(msg);
    div.style.padding = "0 3px 0 5px";
    div.style.width = "auto";
  }

  if (-1 == cityIDs().indexOf(cityID()) && "wall" != name) return;
  var originalLevel = buildingLevel(id, 0, "saved");

  switch (name) {
    case "townHall":
      if (originalLevel != level) {
        var delta = getMaxPopulation(level) - getMaxPopulation(originalLevel);
        if (delta > 0) delta = "+" + delta;
        annotate(delta);
      }
      break;

    case "wall":
      var wall = buildingLevel("townHall", 0);
      if (wall)
        annotate(Math.floor(10 * level * level / wall) + "%");
      break;

    case "tavern":
      var wineMax = buildingCapacity(name, level);
      var wineCur = config.getCity("wine", 0);
      if (wineCur != wineMax)
        annotate(wineCur +"/"+ wineMax);
      break;

    case "museum":
      var museum = buildingLevel(name) || 0;
      var culture = config.getCity("culture", 0);
      if (culture != museum)
        annotate(culture +"/"+ museum);
      break;

    case "academy":
      var seats = buildingCapacity(name, level);
      var working = config.getCity("researchers", 0);
      if (working != seats)
        annotate(working +"/"+ seats);
      break;

    case "warehouse":
      var wood = buildingCapacity("warehouse", "wood", level);
      var rest = buildingCapacity("warehouse", "rest", level);
      if (originalLevel != level && wood && rest)
        annotate(wood +"/"+ rest);
      break;
  }
}

function annotateBuilding(node, level) {
  var a = $X('a', node);
  if (!a) return;
  $x('div[@class="pointsLevelBat"]', node).forEach(rmNode);
  var id = buildingID(a);
  if (isNumber(id) && node.id && isUndefined(level)) {
    config.setCity("building"+ id, number(a.title));
    config.setCity("posbldg"+ id, number(node.id));
  }
  if ("original" == level) {
    level = buildingLevel(id, 0, "saved");
    a.title = a.title.replace(/\d+/, level);
  } else {
    level = level || number(a.title);
  }
  var div = createNode("", "pointsLevelBat", level);
  if (haveEnoughToUpgrade(a, level)) {
    div.style.backgroundColor = "#FEFCE8";
    div.style.borderColor = "#B1AB89";
  }
  node.appendChild(div);
  clickTo(div, a.href);
  div.style.visibility = "visible";
  buildingExtraInfo(div, id, buildingClass(id), level);
  div.title = a.title;
}

function showResourceNeeds(needs, parent, div, top, left) {
  if (div)
    rmNode(div);
  else
    div = createNode("", "pointsLevelBat toBuild");
  div.innerHTML = visualResources(needs, { nonegative: true });
  if (parent.id == "position3") { // far right
    div.style.top = top || "";
    div.style.left = "auto";
    div.style.right = "-17px";
    div.style.margin = "0";
  } else if ("position7" == parent.id) { // far left
    div.style.top = top || "";
    div.style.left = "-11px";
    div.style.right = "auto";
    div.style.margin = "0";
  } else {
    div.style.top = top || "";
    div.style.left = "0";
    div.style.right = "auto";
    div.style.margin = "0 0 0 -50%";
  }
  if (isUndefined(left))
    div.style.left = left;
  show(div);
  parent.appendChild(div);
  return div;
}

function levelBat() { // Ajout d'un du level sur les batiments.
  function hoverHouse(e) {
    var a = $X('(ancestor-or-self::li)/a[@title and @href]', e.target);
    if (a && a.title.match(/ \d+$/i)) {
      var li = a && a.parentNode;
      var top = $X('div[@class="timetofinish"]', li) ? "73px": "";
      if (top && li.id == "position0") top = "0";
      var div = showResourceNeeds(buildingExpansionNeeds(a), li, hovering, top);
      clickTo(div, urlTo("building", buildingID(a)));

      var enough = haveEnoughToUpgrade(a);
      hovering.style.borderColor = enough ? "#B1AB89" : "#918B69";
      hovering.style.backgroundColor = enough ? "#FEFCE8" : "#FDF8C1";
    } else {
      hide(hovering);
      if (hovering.parentNode)
        annotateBuilding(hovering.parentNode, "original");
    }
  }

  var node = $("locations");
  if (node) {
    var hovering = createNode("hovering", "pointsLevelBat toBuild");
    hovering.title = lang[popupInfo];
    hide(hovering);
    $('position0').appendChild(hovering);
    node.addEventListener("mouseover", hoverHouse, false);
    hovering.addEventListener("DOMMouseScroll", function(e) {
      var li = hovering.parentNode;
      var a = $X('a', li), b = buildingID(a);
      var l = Math.min(Math.max(!b, number(a.title) + (e.detail < 0 ? 1 : -1)),
                       costs[b].length - 1);
      a.title = a.title.replace(/\d+/, l);
      annotateBuilding(li, l);
      hoverHouse({ target: hovering });
    }, false);
  }

  for (var name in buildingIDs)
    config.remCity("building"+ buildingIDs[name]); // clear old broken config

  var all = $x('id("locations")/li[not(contains(@class,"buildingGround"))]');
  all.forEach(function(li) { annotateBuilding(li); });
}

function worldmap_isoView() { // FIXME: implement! :-)
  ; // show the (old) getIsle("w") and getIsle(/WMCS/) levels for known islands
}

function focusCity(city) {
  var a = $("city_" + city);
  var other = $X('//a[starts-with(@id,"city_") and not(@id="city_'+city+'")]');
  if (other) {
    click(other);
    return click(a);
  }
  location.href = "javascript:selectedCity = -1; try { (function() {" +
    a.getAttribute("onclick") + "}).call(document.getElementById('city_" +
    city +"')) } catch(e) {}; void 0";
  setTimeout(function() { a.parentNode.className += " selected"; }, 1e3);
}

function islandView() {
  var city = urlParse("selectCity");
  if (city)
    setTimeout(focusCity, 200, city);
  levelTown();
  levelResources();
  var island = urlParse("id", $X('id("advCities")/a').search);
  var breadcrumbs = $X('id("breadcrumbs")/span[last()]'), x, y, t, junk;
  if (breadcrumbs && island) {
    [junk, x, y] = breadcrumbs.textContent.match(/\[(\d+):(\d+)\]/);
    config.setIsle("x", x = integer(x), island);
    config.setIsle("y", y = integer(y), island);
    //console.log("isle %x at %x:%y", island, x, y);
    if ((t = travelTime(x, y)))
      breadcrumbs.textContent += " ("+ secsToDHMS(t) +")";
  }
}

function travelTime(x1, y1, x2, y2) {
  if (arguments.length == 1) { // a city id
    var city = isleForCity(x1);
    x1 = config.getIsle("x", 0, city);
    y1 = config.getIsle("y", 0, city);
    //console.log("isle %x at %x:%y", city, x1, y1);
    if (!x1 || !y1) return 0;
  }
  if (arguments.length < 4) {
    city = referenceIslandID();
    x2 = config.getIsle("x", 0, city);
    y2 = config.getIsle("y", 0, city);
    //console.log("to isle %x at %x:%y", city, x2, y2);
    if (!x2 || !y2) return 0;
  }
  var dx = x2 - x1, dy = y2 - y1;
  return 60 * 20 * (1 + Math.sqrt(dx*dx + dy*dy));
}

function click(node) {
  var event = node.ownerDocument.createEvent("MouseEvents");
  event.initMouseEvent("click", true, true, node.ownerDocument.defaultView,
                       1, 0, 0, 0, 0, false, false, false, false, 0, node);
  node.dispatchEvent(event);
}


function levelResources() {
  function annotate(what) {
    var node = $X('id("islandfeatures")/li['+ what +']');
    var level = number(node.className);
    config.setIsle(resourceIDs[node.className.split(" ")[0]], level);
    var div = createNode("", "pointsLevelBat", level);
    node.appendChild(div);
  }
  annotate('contains(@class,"wood")');
  annotate('not(contains(@class,"wood")) and not(@id)');
}

function levelTown() {
  function addToFriendList(e) {
    var flName = $("flNewName"), flLink = $("flNewLink");
    if (flName && flLink) {
      var player = e.target;
      flName.value = player.childNodes[1].textContent;
      var city = number(player.parentNode.id);
      var isle = urlParse("id", $X('id("islandfeatures")/li/a').search);
      flLink.value = "http://" + location.hostname + "/index.php?" +
        "view=island&id="+ isle +"&selectCity="+ city;
      location.href = "javascript:void(flToggleFrame(1))";
    }
  }
  function level(li) {
    var level = li.className.match(/\d+/)[0];
    var city = $X('a[@onclick]/span', li);
    if (!city) return; // new city site
    var name = $X('text()[preceding-sibling::span]', city);
    if (name) {
      name.nodeValue = level +":"+ name.nodeValue;
      name = name.parentNode;
      name.style.left = Math.round((name.offsetWidth) / -2 + 34) + "px";
    }
    var player = city.cloneNode(true);
    player.innerHTML = '<span class="before"></span>Player name' +
      '<span class="after"></span>';
    name = trim($X('ul/li[@class="owner"]/text()[1]', li).textContent);
    player.childNodes[1].nodeValue = name;

    city.parentNode.insertBefore(player, city.nextSibling);
    player.style.top = "84px";
    player.style.left = Math.round((player.offsetWidth) / -2 + 34) + "px";

    var msg = $X('ul/li[@class="owner"]/a', li);
    //player.title = msg.title;
    clickTo(player, addToFriendList);
    dblClickTo(player, msg.href);
  }
  $x('//li[starts-with(@class,"cityLocation city level")]').forEach(level);
}

function linkTo(url, node, styles, opts) {
  if (!url.match(/\?/))
    url = urlTo(url);
  if (!url) return;
  if (isString(node))
    node = $X(node, opts && opts.context);
  if (!url)
    return;
  var a = document.createElement("a");
  a.href = url;
  if (node) {
    while (node.lastChild)
      a.insertBefore(node.lastChild, a.firstChild);
    if (node.id)
      a.id = node.id;
    if (node.title)
      a.title = node.title;
    if (node.className)
      a.className = node.className;
    if (node.hasAttribute("style"))
      a.setAttribute("style", node.getAttribute("style"));
  }
  if (styles)
    for (var prop in styles)
      a.style[prop] = styles[prop];
  if (opts) {
    if (opts.saveParent) {
      while (node.lastChild)
        a.appendChild(node.removeChild(node.firstChild));
      return node.appendChild(a);
    }
    if (opts.text)
      a.textContent = opts.text;
  }
  if (node)
    node.parentNode.replaceChild(a, node);
  return a;
}

function urlTo(what, id, opts) {
  function building() {
    var id = buildingID(what);
    if ("-" != buildingLevel(id, "-"))
      return url("?view="+ what +"&id="+ c +"&position="+ buildingPosition(id));
  }
  var c = cityID(), i = islandID();
  if (what == "workshop")
    what = "workshop-army";
  switch (what) {
    default:		return url("?view="+ what);
    case "wood":	return url("?view=resource&type=resource&id="+ i);
    case "luxe":	return url("?view=tradegood&type=tradegood&id="+ i);

    case "townHall":	case "port":	case "academy":
    case "shipyard":	case "wall":	case "warehouse":
    case "barracks":	case "museum":	case "branchOffice":
    case "embassy":	case "palace":	case "palaceColony":
    case "safehouse":	case "tavern":	case "workshop-army":
      return building();

    case "city":	return url('?view=city&id='+ c);
    case "island":	return url('?view=island&id='+ (!isObject(id) ? i :
                                   id.island + "&selectCity="+ id.city));
    case "building":	return url("?view=buildingDetail&buildingId="+ id);

    case "library":
      return urlTo("academy").replace("academy", "researchOverview");
  }
}

function getQueue() {
  return eval(config.getCity("q", "[]"));
}

function setQueue(q) {
  return config.setCity("q", uneval(q));
}

function addToQueue(b, first) {
  var q = getQueue();
  if (first)
    q.unshift(b);
  else
    q.push(b);
  setTimeout(drawQueue, 10);
  return setQueue(q);
}

function changeQueue(e) {
  var enqueued = $X('ancestor-or-self::li[parent::ul[@id="q"]]', e.target);
  if (enqueued) { // drop from queue
    var q = getQueue();
    q.splice(enqueued.getAttribute("rel"), 1);
    setQueue(q);
    drawQueue();
  } else if (!e.altKey) {
    return;
  } else { // enqueue
    var a = $X('parent::li[parent::ul[@id="locations"]]/a', e.target);
    if (a) {
      addToQueue(buildingID(a), e.shiftKey);
      setTimeout(processQueue, 10);
    }
  }
  if (a || enqueued) {
    e.stopPropagation();
    e.preventDefault();
  }
}

function reallyUpgrade(name) {
  //console.log("upgrading %x", name);
  var i = cityID();
  var q = getQueue();
  var b = buildingID(name);
  var l = buildingLevel(b, 0);
  var p = buildingPosition(b);
  if (q.shift() != b) { // some other window got there before us; abort
    location.hash = "#q:in-progress";
    return;
  }
  if (haveResources(buildingExpansionNeeds(b, l))) {
    return setTimeout(function() {
      config.remCity("build");
      setQueue(q);
      if (!l)
        return goto(url("?action=CityScreen&function=build&id="+ i +
                        "&position="+ p +"&building="+ b));
      post("/index.php", {
        action: "CityScreen",
      function: "upgradeBuilding",
            id: i,
      position: p,
         level: l });
    }, 3e3);
  }
}

function upgrade() {
  console.log("upgrade: %x", !getQueue().length);
  var q = getQueue();
  if (!q.length) return;
  var b = q.shift();
  var l = buildingLevel(b, 0);
  if (haveResources(buildingExpansionNeeds(b, l))) // ascertain we're in a good
    return gotoCity("/#q:"+ buildingClass(b)); // view -- and in the right city

  // FIXME: figure out when to re-test, if at all, and setTimeout(upgrade)
}

// iterates through lack, updating accumulate with goods used, zeroing have for
// all missing resources, and adds lack.t with the time it took to replenish it
function replenishTime(lack, have, accumulate) {
  var t = 0, takes;
  var pace = reapingPace();
  for (var r in lack) {
    var n = lack[r];
    var p = pace[r] || 0;
    if (have)
      have[r] = 0;
    if (accumulate)
      accumulate[r] = (accumulate[r] || 0) + n;
    if (p > 0)
      takes = Math.ceil(3600 * n / p);
    else
      takes = Infinity;
    t = Math.max(t, takes);
  }
  if (accumulate)
    accumulate.t = (accumulate.t || 0) + t;
  lack.t = t;
  return lack;
}

function copyObject(o) {
  var copy = {};
  for (var n in o)
    copy[n] = o;
  return copy;
}

function hoverQueue(have, e) {
  var node = e.target;
  if ($X('self::li[@rel]', node)) {
    var n = li.getAttribute("rel");
    var h = $("qhave");

    div = showResourceNeeds(have, $("container2"), div);
    div.title = lang[left]+ resolveTime((t-Date.now())/1e3, 1);

  }
  var last = $("q").lastChild.have;
}

function drawQueue() {
  var ul = $("q");
  if (ul)
    ul.innerHTML = "";
  else {
    ul = createNode("q", "", "", "ul");
    document.body.appendChild(ul);
  }

  var q = getQueue();
  var t = config.getCity("build"); // in ms
  var dt = (t - Date.now()) / 1e3; // in s
  var have = currentResources();
  var pace = reapingPace();
  var miss = {};
  var level = buildingLevels();

  // add a level for what is being built now, if anything
  var building = config.getCity("buildurl");
  var buildEnd = config.getCity("build");
  if (buildEnd > Date.now() && building) {
    building = buildingID(urlParse("view", building));
    level[building] = 1 + (level[building] || 0);
  }

  for (var i = 0; i < q.length; i++) {
    var b = q[i];
    var what = buildingClass(b);
    var li = createNode("", what, "", "li");
    li.innerHTML = '<div class="img"></div><a href="'+ urlTo(what) +'"></a>';
    li.setAttribute("rel", i + "");
    li.have = copyObject(have);

    // erecting a new building, not upgrading an old
    if (!level.hasOwnProperty(b)) {
      level[b] = 0;
      if ("city" == document.body.id) { // erect a placeholder ghost house
        var pos = buildingPosition(b);
        var spot = $("position"+ pos);
        spot.className = buildingClass(b);
        $X('a', spot).title = "Level 0";
        if ((spot = $X('div[@class="flag"]', spot))) {
          spot.className = "buildingimg";
          spot.style.opacity = "0.5";
        }
      }
    }

    // Will we have everything needed by then?
    var need = buildingExpansionNeeds(b, level[b]++);
    //console.log(b, level[b]-1, need ? need.toSource() : need);
    annotateBuilding(li, level[b]);
    var stall = {};
    var stalled = false;
    for (var r in pace)
      have[r] += pace[r];
    for (var r in need) {
      if (r == "t") continue;
      if (need[r] > have[r]) {
        stalled = true;
        stall[r] = need[r] - have[r];
      }
      have[r] -= need[r];
    }

    // FIXME? error condition when storage[level[warehouse]] < need[resource]

    // Move clock forwards upgradeTime seconds
    dt = parseTime(need.t);
    t += (dt + 1) * 1000;

    // When we did not: annotate with what is missing, and its replenish time
    if (stalled) {
      stall = replenishTime(stall, have, miss);
      stalled = stall.t;
      if (stalled == Infinity) {
        stall.t = "∞"; // FIXME: this merits a more clear error message
      } else {
        dt += stalled;
        t += stalled * 1e3;
        stall.t = secsToDHMS(stalled, 1, " ");
      }
      var div = showResourceNeeds(stall, li, null, "112px", "");
      div.style.backgroundColor = "#FCC";
      div.style.borderColor = "#E88";
      div.title = lang[unreplenished];
    }

    var done = trim(resolveTime((t - Date.now()) / 1000));
    done = createNode("", "timetofinish", done);
    done.insertBefore(createNode("", "before", "", "span"), done.firstChild);
    done.appendChild(createNode("", "after", "", "span"));
    li.appendChild(done);
    setTimeout(bind(function(done, li) {
      done.style.left = 4 + Math.round( (li.offsetWidth -
                                         done.offsetWidth) / 2) + "px";
    }, this, done, li), 10);

    ul.appendChild(li);
  }

  var div = $("qhave") || undefined;
  if (!q.length) {
    if (div) hide(div);
    return;
  }
  delete have.p; delete have.g;
  div = showResourceNeeds(have, $("container2"), div);
  div.title = lang[left] + resolveTime((t-Date.now())/1e3, 1);
  div.style.left = div.style.top = "auto";
  div.style.margin = "0";
  div.style.right = "20px";
  div.style.bottom = "35px";
  div.style.zIndex = "5000";
  div.style.position = "absolute";
  if (haveBuilding("branchOffice"))
    clickTo(div, sellStuff);
  div.id = "qhave";

  div = $("qmiss") || undefined;
  stalled = false;
  for (var r in miss)
    stalled = true;
  if (!stalled)
    return div && hide(div);

  // t = secsToDHMS(miss.t);
  delete miss.t;
  // miss.t = t;
  drawQueue.miss = miss;
  drawQueue.have = have;

  div = showResourceNeeds(miss, $("container2"), div);
  if (haveBuilding("branchOffice"))
    clickTo(div, goShopping);
  div.title = lang[shop];
  div.style.top = "auto";
  div.style.margin = "0";
  div.style.left = "240px";
  div.style.bottom = "35px";
  div.style.zIndex = "5000";
  div.style.position = "absolute";
  div.id = "qmiss";
}

// Figure out what our current project and next action are. Returns 0 when idle,
// "building" when building something (known or unknown), "unknown" when data is
// unconclusive (we're in a view without the needed information) after a project
// has been completed, and otherwise the time in milliseconds to build complete.
function queueState() {
  var v = urlParse("view");
  var u = config.getCity("buildurl");
  var t = config.getCity("build", Infinity);
  var busy = $X('id("buildCountDown") | id("upgradeCountDown")');
  if (t < Date.now()) { // last known item is completed by now
    if ("city" == v)
      return busy ? "building" : 0;
    return "unknown";
  } else if (t == Infinity) { // no known project going
    if ("city" == v) {
      //if (!busy) {
      //  config.remCity("buildurl");
      //}
      return busy ? "building" : 0;
    }
    return "unknown";
  } // busy building something; return time until completion
  return t - Date.now() + 3e3;
}

function processQueue(mayUpgrade) {
  var state = queueState(), time = isNumber(state) && state;
  //console.log("q: "+ state, mayUpgrade);
  if (time) {
    setTimeout(processQueue, time);
  } else if (0 === time) {
    if (mayUpgrade) upgrade();
  } // else FIXME? This might be safe, if unrelated pages don't self-refresh:
  //setTimeout(goto, 3e3, "city"); // May also not be needed at all there

  drawQueue();
  if (!processQueue.css)
    processQueue.css = css(<><![CDATA[

/* Fixes the shadow on the ugly tooltips */
#WzTtShDwR, #WzTtShDwB {
  background-color: #000 !important;
  opacity: 0.25 !important;
}

/* Fixes the chopped-off resource icons in military loot reports */
#militaryAdvisorReportView #battleReportDetail li {
  padding: 6px 0 2px 32px;
}

/* Fixes the broken warehouse tooltips in port view */
#port #container ul.resources li .tooltip .textLabel {
  position: static;
}

#container #cityResources li .tooltip {
  padding: 4px 5px;
  white-space: nowrap;
  width: auto;
}
#container #cityResources li .tooltip .ellipsis {
  margin-left: 3px;
  position: relative;
}

#q .barracks .img { left:0px; top:-33px; width:100px; height:76px; background-image:url(skin/img/city/building_barracks.gif); }
#q .port .img { left:-65px; top:-35px; width:104px; height:90px; background:url(skin/img/city/building_port.gif) -59px 0; }
#q .shipyard .img { left:-22px; top:-20px; width:129px; height:100px; background-image:url(skin/img/city/building_shipyard.gif); }
#q .shipyard a{ top:-10px; left:-20px; width:110px; height:70px; }
#q .museum .img { left:-8px; top:-38px; width:105px; height:85px;  background-image:url(skin/img/city/building_museum.gif); }
#q .warehouse .img { left:0px; top:-33px; width:126px; height:86px;  background-image:url(skin/img/city/building_warehouse.gif); }
#q .wall .img { width:93px; height:88px; background:url(skin/img/city/building_wall.gif) no-repeat -68px -16px; }
#q .tavern .img { left:-10px; top:-15px; width:111px; height:65px;  background-image:url(skin/img/city/building_tavern.gif); }
#q .palace .img { left:-10px; top:-42px; width:106px; height:97px;  background-image:url(skin/img/city/building_palace.gif); }
#q .palaceColony .img { left:-10px; top:-42px; width:109px; height:95px;  background-image:url(skin/img/city/building_palaceColony.gif); }
#q .academy .img { left:-19px; top:-31px; width:123px; height:90px; background-image:url(skin/img/city/building_academy.gif); }
#q .workshop-army .img { left:-19px; top:-31px; width:106px; height:85px; background-image:url(skin/img/city/building_workshop.gif); }
#q .safehouse .img { left:5px; top:-15px; width:84px; height:58px; background-image:url(skin/img/city/building_safehouse.gif); }
#q .branchOffice .img { left:-19px; top:-31px; width:109px; height:84px; background-image:url(skin/img/city/building_branchOffice.gif); }
#q .embassy .img { left:-5px; top:-31px; width:93px; height:85px; background-image:url(skin/img/city/building_embassy.gif); }
#q .townHall .img { left:-5px; top:-60px; width:104px; height:106px; background-image:url(skin/img/city/building_townhall.gif); }

.toBuild img { display: inline !important; }
#q { margin: -20px 20px 125px; position:relative; }
#q li { float:left; margin:0 40px 105px; position:absolute; width:86px; height:43px; position:relative; }
#q li .pointsLevelBat { margin-left: 19px; margin-top: 30px; }

#q li .timetofinish {
  z-index:500;
  position:absolute;
  top:86px;
  text-align:center;
  line-height:23px;
  height:23px;
  background-image:url(skin/layout/scroll_bg.gif);
  padding:0 16px;
  white-space: nowrap;
  font-size:10px;
  color:#50110a;
}
#q li .timetofinish .before {
  display:block; position:absolute; top:0; left:0; width:12px; height:23px;
  background-image:url(skin/layout/scroll_leftend.gif);
}
#q li .timetofinish .after {
  display:block; position:absolute; top:0; right:0; width:12px; height:23px;
  background-image:url(skin/layout/scroll_rightend.gif);
}

]]></>);
}

function alreadyAllocated(pos, building) {
  function isOnThisSpot(b) {
    return buildingPosition(b) == pos;
  }
  function alreadyEnqueued(b) {
    return b == building;
  }
  var q = getQueue();
  return q.some(isOnThisSpot) || q.some(alreadyEnqueued);
}

function buildingGroundView() {
  function build(id, pos, e) {
    buts.forEach(rmNode);
    config.setCity("posbldg"+ id, pos);
    var prepend = e.shiftKey;
    addToQueue(id, prepend);
  }
  function addEnqueueButton(p) {
    var pos = parseInt(urlParse("position"), 10);
    var img = $X('preceding-sibling::div[@class="buildinginfo"]/img', p);
    var id = img && buildingID(img.src.match(/([^\/.]+).gif$/)[1]);
    if (id && pos && !alreadyAllocated(pos, id)) {
      var but = createNode("", "button", null, "input");
      but.value = lang[enqueue];
      but.title = lang[shiftClick];
      but.style.width = "100px";
      clickTo(but, bind(build, this, id, pos));
      p.appendChild(but/*, p.firstChild*/);
      return but;
    }
  }
  projectBuildStart("mainview");
  var buts = $x('//p[@class="cannotbuild"]').map(addEnqueueButton);
}

function sumPrices(table, c1, c2) {
  function price(tr) {
    var prefixes = { G:1e9, M:1e6, k:1e3 };
    var td = $x('td', tr);
    if (td.length <= Math.max(c1, c2)) return;
    var n = number(td[c1]);
    var p = number(td[c2]);
    if (isNaN(n) || isNaN(p)) return;
    n *= p;
    for (var e in prefixes)
      if (!(n % prefixes[e])) {
        n /= prefixes[e];
        n += e;
        break;
      } else if (!(n % (prefixes[e]/10))) {
        n /= prefixes[e];
        n += e;
        break;
      }
    n = createNode("", "ellipsis", n+"", "span");
    n.style.verticalAlign = "top";
    n.style.position = "static";
    n.style.marginLeft = "3px";
    td[c1].appendChild(n);
  }
  $x('tbody/tr[td]', table).forEach(price);
}

function branchOfficeView() {
  function factor(table) {
    sumPrices(table, 1, 3);
  }
  scrollWheelable();
  $x('id("mainview")//table[@class="tablekontor"]').forEach(factor);
  clickResourceToSell();
}

function portView() {
  setTimeout(projectCompletion, 4e3, "outgoingOwnCountDown");
}

function evenShips(nodes) {
  function sum(a, b) {
    return integer(a || 0) + integer(b || 0);
  }
  function fillNextEvenShip(e) {
    var input = e.target;
    var value = number(input);
    var count = nodes.reduce(sum, 0);
    var remainder = count % 300;
    if (remainder) {
      input.value = value + (300 - remainder);
      e.stopPropagation();
    }
  }
  function listen(input) {
    input.addEventListener("dblclick", fillNextEvenShip, false);
  }
  if (stringOrUndefined(nodes))
    nodes = $x(nodes || '//input[@type="text" and @name]');
  nodes.forEach(listen);
}

function scrollWheelable(nodes) {
  function getCount(node) {
    return $X('preceding-sibling::input[@type="text"] |' +
              'self::input[@type="text"]', node);
  }
  function add(count, sign, event) {
    if (count && sign) {
      event.preventDefault();
      var alt = event.altKey ? 100 : 1;
      var meta = event.metaKey ? 1000 : 1;
      var shift = event.shiftKey ? 10 : 1;
      count.value = Math.max(0, parseInt(count.value || "0") +
                                (meta * alt * shift * sign));
      click(count);
    }
  }
  function groksArrows(event) {
    var sign = {};
    var key = unsafeWindow.KeyEvent;
    sign[key.DOM_VK_UP] = 1;
    sign[key.DOM_VK_DOWN] = -1;
    add(event.target, sign[event.charCode || event.keyCode], event);
  }
  function onScrollWheel(event) {
    add(getCount(event.target), event.detail > 0 ? -1 : 1, event);
  }
  function listen(input) {
    input.addEventListener("keydown", groksArrows, false);
    input.addEventListener("DOMMouseScroll", onScrollWheel, false);
  }
  if (stringOrUndefined(nodes))
    nodes = $x(nodes || '//input[@type="text" and @name]');
  nodes.forEach(listen);
}

function stringOrUndefined(what) {
  return { undefined: 1, string: 1 }[typeof what] || 0;
}

function dontSubmitZero(but, nodes) {
  function getCount(submit) {
    var count = $X('preceding-sibling::input[@type="text"]|' +
                   'self::input[@type="text"]', submit);
    if (count) return count;
    var inputs = submit.form.elements;
    for (var i = 0; i<inputs.length; i++)
      if (inputs[i].type == "text")
        return inputs[i];
  }
  function sumAll(form) {
    var count = 0;
    var inputs = $x('.//input[@type="text"]', form);
    inputs.forEach(function(i) { count += parseInt(i.value||"0", 10); });
    return count;
  }
  function setToTwo(e) {
    var count = getCount(e.target);
    if (count && count.value == 0) {
      if (sumAll(count.form) != 0) return;
      count.setAttribute("was", "0");
      count.value = but;
      click(count);
    }
  }
  function resetZero(e) {
    var count = getCount(e.target);
    var was = count && count.getAttribute("was");
    if (was && (but == count.value)) {
      count.removeAttribute("was");
      count.value = was;
      click(count);
    }
  }
  function improveForm(submit) {
    submit.addEventListener("mouseover", setToTwo, false);
    submit.addEventListener("mouseout", resetZero, false);
    noArgs && scrollWheelable([submit, getCount(submit)]);
  }
  if (stringOrUndefined(nodes))
    nodes = $x(nodes || '//input[@type="submit"]');
  but = but || 1;
  var noArgs = !arguments.length;
  nodes.forEach(improveForm);
}

// would ideally treat the horrid tooltips as above, but they're dynamic. X-|
function merchantNavyView() {
  function dropDate(td) {
    td.textContent = td.textContent.replace(date, "");
  }
  function monkeypatch(html) {
    var args = [].slice.call(arguments);
    var node = createNode();
    node.innerHTML = html;
    sumPrices(node.firstChild, 1, 3);
    $X('table/tbody/tr/th', node).setAttribute("colspan", "4");
    args[0] = node.innerHTML;
    ugh.apply(this, args);
  }
  var ugh = unsafeWindow.Tip;
  unsafeWindow.Tip = monkeypatch; // fixes up the tooltips a bit

  // drop dates that are today and just makes things unreadable:
  var date = trim($('servertime').textContent.replace(/\s.*/, ""));
  $x('id("mainview")//table[@class="table01"]//td[contains(.,"'+ date +'")]').
    forEach(dropDate);
}


function buildingDetailView() {
  var id = parseInt(urlParse("buildingId"));
  var level = buildingLevel(id, 0) + 1;
  var tr = $X('//th[.="Level"]/../../tr[td[@class="level"]]['+ level +']');
  if (tr) {
    tr.style.background = "pink";
    tr.title = "Next building upgrade";
  }
}

function safehouseView() {
  $x('//li/div[starts-with(@id,"SpyCountDown")]').forEach(projectCompletion);
}

function highlightMeInTable() {
  var tr = $x('id("mainview")/div[@class="othercities"]' +
              '//tr[td[@class="actions"][count(*) = 0]]');
  if (tr.length == 1) tr[0].style.background = "pink";
}

function isleForCity(city) {
  var cities = config.getServer("cities", {});
  return (cities[city] || {}).i;
}

function cityView() {
  var city = cityID(), isle;
  if (referenceCityID() == city) {
    if ((isle = $X('id("changeCityForm")//li[@class="viewIsland"]/a'))) {
      var cities = config.getServer("cities", {});
      cities[city] = cities[city] || {};
      city = cities[city];
      city.i = integer(urlParse("id", isle.search));
      city.n = cityName();
      config.setServer("cities", cities);
    }
  }
  projectCompletion("cityCountdown", null, '../preceding-sibling::a');
  levelBat();
}

function townHallView() {
  var income = $X('//li[contains(@class,"incomegold")]/span[@class="value"]');
  config.setCity("gold", number(income));

  var g = { context: $("PopulationGraph") };
  var growth = $("SatisfactionOverview");
  linkTo("wood", 'div[@class="woodworkers"]/span[@class="production"]', 0, g);
  linkTo("luxe", 'div[@class="specialworkers"]/span[@class="production"]', 0,g);
  linkTo("academy", 'div[@class="scientists"]/span[@class="production"]', 0, g);
  clickTo($X('.//div[@class="cat wine"]', growth), "tavern");
  clickTo($X('.//div[@class="cat culture"]', growth), "museum");

  if ($X('.//div[@class="capital"]', growth))
    config.setServer("capital", cityID());
}

function museumView() {
  var goods = $X('id("val_culturalGoodsDeposit")/..');
  if (goods)
    config.setCity("culture", integer(goods.textContent.match(/\d+/)[0]));

  var cities = cityIDs();
  for (var i = 0; i < cities.length; i++)
    if ((goods = $("textfield_city_"+ cities[i])))
      config.setCity("culture", integer(goods), cities[i]);

  var friends = $x('id("mainview")/div[last()]//td[@class="actions"]/a[1]');
  for (var i = 0; i < friends.length; i++)
    friends[i] = urlParse("receiverName", friends[i].search);
  config.setServer("culturetreaties", friends);
}

function academyView() {
  var research = $("inputScientists");
  if (research)
    config.setCity("researchers", number(research));
}

function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

function pluck(a, prop) {
  return a.map(function(i) { return i[prop]; });
}

function I(i) { return i; }

function techinfo(what) {
  function makeTech(spec) {
    var name, does, time, deps, points, junk;
    [name, does, time, deps] = trim(spec).split("\n");
    [junk, time, points] = /^(.*) \(([0-9,]+).*\)/.exec(time);
    deps = deps ? deps.split(/,\s*/) : [];
    //points = points.replace(/,/g, "");
    spec = { name: name, does: does, time: time, points: points, deps: deps };
    if ((spec.a = $X('//a[.="'+ name +'"]'))) {
      if ((spec.known = $x('ancestor::ul/@class = "explored"', spec.a)))
        config.setServer("tech"+ urlParse("researchId", spec.a.search), 1);
    }
    return spec;
  }

  function unwindDeps(of) {
    function level(name) {
      return tech[name];
    }

    if (of.hasOwnProperty("level")) // already unwound
      return true;
    if (!of.deps.length) // no dependencies
      return !(of.level = tech[of.name] = 0);

    var levels = of.deps.map(level);
    if (!levels.every(isDefined)) // unresolved dependencies
      return false;

    of.level = tech[of.name] = 1 + Math.max.apply(Math, levels);
    return true;
  }

  function hilightDependencies(techName) {
    function sum(a, b) { return a + b; }
    function mark(name) {
      if (done[name]) return 0;
      var tech = byName[name];
      done[name] = tech.depends = true;
      var points = tech.known ? 0 : parseInt(tech.points.replace(/,/g, ""), 10);
      return points + tech.deps.map(mark).reduce(sum, 0);
    }

    var done = {};
    var points = mark(techName);
    tree.forEach(show);
    var tech = byName[techName];
    tech.a.title = tech.does + " ("+ points +" points left)";
  }

  function show(tech) {
    var a = tech.a;
    if (a) {
      a.className = (tech.depends ? "" : "in") + "dependent";
      a.title = tech.does;
    }
    tech.depends = false;
  }

  function hover(e) {
    //console.time("hilight");
    var a = e.target;
    if (a && "a" == a.nodeName.toLowerCase()) {
      var name = a.textContent.replace(/:.*/, "");
      hilightDependencies(name);
    } else
      tree.forEach(show);
    //console.timeEnd("hilight");
  }

  function isKnown(what) {
    return what.known;
  }

  function indent(what) {
    byName[what.name] = what;
    var a = $X('//a[.="'+ what.name +'"]');
    a.style.marginLeft = (what.level * 10) + "px";
    a.innerHTML += visualResources(": "+ what.points +" $bulb");
    show(what);
  }

  function vr(level) {
    hr = document.createElement("hr");
    hr.style.position = "absolute";
    hr.style.height = (div.offsetHeight - 22) + "px";
    hr.style.width = "1px";
    hr.style.top = "10px";
    hr.style.left = (level*10 + 3) + "px";
    hr.style.backgroundColor = "#E3AE87";
    hr.style.opacity = "0.4";
    div.appendChild(hr);
  }

  var tree = <>
Deck Weapons
Allows: Building ballista ships in the shipyard
1h 5m 27s (24)
Dry-Dock

Ship Maintenance
Effect: 2% less upkeep for ships
1h 5m 27s (24)
Deck Weapons

Expansion
Allows: Building palaces, founding colonies
20h (440)
Ship Maintenance, Wealth

Foreign Cultures
Allows: Construction of Embassies
1D 10h 54m 32s (768)
Expansion, Espionage

Pitch
Effect: 4% less upkeep for ships
2D 4h (1,144)
Foreign Cultures

Greek Fire
Allows: Building Flame Ships
4D 12h (2,376)
Pitch, Culinary Specialities

Counterweight
Allows: Building catapult-ships at the shipyard
10D 4h 21m 49s (5,376)
Greek Fire, Invention

Diplomacy
Allows: Military Treaties
19D 2h 10m 54s (10,080)
Counterweight

Sea Charts
Effect: 8% less upkeep for ships
39D 18h 32m 43s (21,000)
Diplomacy

Paddle Wheel Engine
Allows: Building steam rams in the shipyard
136D 19h 38m 10s (72,240)
Sea Charts, Helping Hands

Mortar Attachment
Allows: Building mortar ships in the shipyard
231D 19h 38m 10s (122,400)
Paddle Wheel Engine, Glass

Seafaring Future
Seafaring Future
831D 19h 38m 10s (439,200)
The Archimedic Principle, Canon Casting, Utopia, Mortar Attachment

Conservation
Allows: Building of Warehouses
54m 32s (20)

Pulley
Effect: 2% less building costs
1h 5m 27s (24)
Conservation

Wealth
Effect: Allows the mining of trade goods and the building of trading posts
6h 32m 43s (144)
Pulley

Wine Press
Allows: Building of taverns
16h (352)
Wealth, Well Digging

Culinary Specialities
Allows: Training of chefs in the barracks
1D 10h 54m 32s (768)
Wine Press, Expansion, Professional Army

Geometry
Effect: 4% less building costs
2D 4h (1,144)
Culinary Specialities

Market
Allows: Trade Agreements
4D 12h (2,376)
Geometry, Foreign Cultures

Holiday
Effect: Increases the satisfaction in all towns
11D 10h 54m 32s (6,048)
Market

Helping Hands
Allows: Overloading of resources and academy
25D 10h 54m 32s (13,440)
Holiday

Spirit Level
Effect: 8% less costs for the construction of buildings
39D 18h 32m 43s (21,000)
Helping Hands

Bureaucracy
Allows: An additional building space in the towns
117D 6h 32m 43s (61,920)
Spirit Level

Utopia
Utopia
606D 19h 38m 10s (320,400)
Bureaucracy, Diplomacy, Letter Chute, Gunpowder

Economy Future
Economy Future
831D 19h 38m 10s (439,200)
The Archimedic Principle, Canon Casting, Utopia, Mortar Attachment

Well Digging
Effect: +50 housing space, +50 happiness in the capital
1h 27m 16s (32)

Paper
Effect: 2% more research points
1h 21m 49s (30)
Well Digging

Espionage
Allows: Building hideouts
16h (352)
Paper, Wealth

Invention
Allows: Building of workshops
1D 16h 43m 38s (896)
Espionage, Wine Press, Professional Army

Ink
Effect: 4% more research points
2D 4h (1,144)
Invention

Cultural Exchange
Allows: building museums
5D 12h (2,904)
Ink, Culinary Specialities

Anatomy
Allows: Recruiting Doctors in the Barracks
11D 10h 54m 32s (6,048)
Cultural Exchange

Glass
Allows: Usage of crystal glass in order to accelerate research in the academy
25D 10h 54m 32s (13,440)
Anatomy, Market

Mechanical Pen
Effect: 8% more research points
39D 18h 32m 43s (21,000)
Glass

Bird´s Flight
Allows: Gyrocopter
127D 1h 5m 27s (67,080)
Mechanical Pen, Governor

Letter Chute
Effect: 1 Gold upkeep less per scientist
313D 15h 16m 21s (165,600)
Bird´s Flight, Helping Hands

Pressure Chamber
Allows: Building diving boats in the shipyard
404D 13h 5m 27s (213,600)
Letter Chute, Utopia, Robotics

The Archimedic Principle
Allows: Building Bombardiers in the Barracks
272D 17h 27m 16s (144,000)
Pressure Chamber

Knowledge Future
Knowledge Future
831D 19h 38m 10s (439,200)
The Archimedic Principle, Canon Casting, Utopia, Mortar Attachment

Dry-Dock
Allows: Building Shipyards
1h 5m 27s (24)

Maps
Effect: 2% less upkeep for soldiers
1h 5m 27s (24)
Dry-Dock

Professional Army
Allows: Training swordsmen and phalanxes in the barracks
20h (440)
Maps, Wealth

Siege
Allows: Building battering rams in the barracks
1D 10h 54m 32s (768)
Professional Army, Espionage

Code of Honour
Effect: 4% less upkeep
2D 4h (1,144)
Siege

Ballistics
Allows: Archers
4D 12h (2,376)
Code of Honour, Culinary Specialities

Law of the Lever
Allows: Building catapults in the barracks
10D 4h 21m 49s (5,376)
Ballistics, Invention

Governor
Allows: Occupation
19D 2h 10m 54s (10,080)
Law of the Lever, Market

Logistics
Effect: 8% less upkeep for soldiers
39D 18h 32m 43s (21,000)
Governor

Gunpowder
Allows: Building marksmen in the barracks
127D 1h 5m 27s (67,080)
Logistics, Glass

Robotics
Allows: Building steam giants in the barracks
272D 17h 27m 16s (144,000)
Gunpowder

Canon Casting
Allows: Building mortars in the barracks
404D 13h 5m 27s (213,600)
Robotics, Greek Fire

Military Future
Military Future
831D 19h 38m 10s (439,200)
The Archimedic Principle, Canon Casting, Utopia, Mortar Attachment
</>.toString().split(/\n\n+/).map(makeTech);

  if (what)
    return tree.filter(function(t) { return t.name == what; })[0];
  if (!techinfo.cssed)
    techinfo.cssed = css(<><![CDATA[
#researchOverview #container #mainview ul { padding:0 !important; }
#researchOverview #container #mainview li { padding-left: 0; }
a.dependent:before { content:"\2713 "; }
a.independent { padding-left: 9px; }
]]></>);

  var tech = {}, byName = {}, hr;
  while (!tree.map(unwindDeps).every(I));
  tree.forEach(indent);

  var div = $X('id("mainview")/div/div[@class="content"]');
  $x('br', div).forEach(rmNode);
  var maxLevel = Math.max.apply(Math, pluck(tree.filter(isKnown), "level"));
  vr(maxLevel);

  if (!techinfo.hide) {
    var hide = document.createElement("style");
    hide.type = "text/css";
    hide.textContent = "ul.explored { display:none; }";
    document.documentElement.firstChild.appendChild(hide);
    hide.disabled = true;
    var header = $X('preceding-sibling::h3/span', div);
    header.innerHTML += ": ";
    var toggle = createNode("hideshow", "", lang[shown], "span");
    header.appendChild(toggle);
    clickTo(header, function() {
      hide.disabled = !hide.disabled;
      toggle.textContent = lang[shown + (hide.disabled ? 0 : 1)];
      hr.style.height = (div.offsetHeight - 22) + "px";
    });
  }

  div.addEventListener("mousemove", hover, false);
  return tree;
}

var costs = [
  [{}, {w:70, t:"34m 48s"}, {w:98, t:"56m 24s"}, {w:65, M:17, t:"1h 24m"}, {w:129, M:28, t:"1h 58m"}, {w:236, M:66, t:"2h 40m"}, {w:402, M:95, t:"3h 29m"}, {w:594, M:156, t:"4h 25m"}, {w:849, M:243, t:"5h 30m"}, {w:1176, M:406, t:"6h 43m"}, {w:1586, M:579, t:"8h 5m"}, {w:2101, M:799, t:"9h 35m"}, {w:3280, M:1348, t:"11h 15m"}, {w:4937, M:2124, t:"13h 3m"}, {w:7171, M:2951, t:"15h 1m"}, {w:10139, M:4409, t:"17h 9m"}, {w:14537, M:6461, t:"20h 11m"}, {w:18420, M:8187, t:"22h 44m"}, {w:22896, M:10176, t:"1D 1h"}, {w:28047, M:12466, t:"1D 4h"}, {w:33934, M:15082, t:"1D 7h"}, {w:40623, M:18055, t:"1D 10h"}, {w:48107, M:21381, t:"1D 14h"}, {w:56511, M:25116, t:"1D 17h"}, {w:226044, M:100464, t:"6D 23h"}, {w:452088, M:200928, t:"13D 22h"}, {w:904176, M:401856, t:"27D 21h"}, {w:1808352, M:803712, t:"55D 19h"}, {w:3616704, M:1607424, t:"111D 15h"}, {w:7233408, M:3214848, t:"223D 6h"}, {w:14466816, M:6429696, t:"446D 12h"}, {w:28933632, M:12859392, t:"893D 19m"}], , , [{w:18, t:"10m 48s"}, {w:31, t:"24m 29s"}, {w:44, t:"50m 24s"}, {w:87, M:33, t:"1h 26m"}, {w:156, M:48, t:"2h 18m"}, {w:266, M:93, t:"2h 58m"}, {w:425, M:126, t:"3h 41m"}, {w:653, M:215, t:"4h 52m"}, {w:963, M:344, t:"5h 37m"}, {w:1381, M:529, t:"7h 6m"}, {w:1915, M:777, t:"7h 48m"}, {w:2604, M:1100, t:"9h 30m"}, {w:3790, M:1731, t:"10h 36s"}, {w:5349, M:2301, t:"11h 53m"}, {w:7333, M:3017, t:"11h 59m"}, {w:9808, M:4265, t:"13h 56m"}, {w:39232, M:17060, t:"2D 7h"}, {w:78464, M:34120, t:"4D 15h"}, {w:156928, M:68240, t:"9D 7h"}, {w:313856, M:136480, t:"18D 14h"}, {w:627712, M:272960, t:"37D 4h"}, {w:1255424, M:545920, t:"74D 8h"}, {w:2510848, M:1091840, t:"148D 17h"}, {w:5021696, M:2183680, t:"297D 11h"}],
  [{w:36, t:"14m 24s"}, {w:58, t:"28m 48s"}, {w:84, t:"48m"}, {w:79, M:30, t:"1h 19m"}, {w:159, M:73, t:"1h 57m"}, {w:302, M:210, t:"2h 48m"}, {w:535, M:285, t:"3h 52m"}, {w:889, M:467, t:"5h 6m"}, {w:1423, M:712, t:"6h 36m"}, {w:2174, M:999, t:"8h 16m"}, {w:3221, M:1307, t:"10h 16m"}, {w:4639, M:1960, t:"12h 27m"}, {w:7155, M:3267, t:"15h"}, {w:10630, M:4573, t:"17h 45m"}, {w:15224, M:6264, t:"20h 44m"}, {w:20358, M:8853, t:"1D 7m"}, {w:81432, M:35412, t:"4D 28m"}, {w:162864, M:70824, t:"8D 57m"}, {w:325728, M:141648, t:"16D 1h"}, {w:651456, M:283296, t:"32D 3h"}, {w:1302912, M:566592, t:"64D 7h"}, {w:2605824, M:1133184, t:"128D 15h"}, {w:5211648, M:2266368, t:"257D 6h"}, {w:10423296, M:4532736, t:"514D 13h"}],
  [{w:38, t:"22m 41s"}, {w:67, t:"52m 49s"}, {w:96, t:"1h 50m"}, {w:152, M:57, t:"2h 31m"}, {w:272, M:83, t:"4h 1m"}, {w:388, M:135, t:"4h 20m"}, {w:609, M:180, t:"5h 17m"}, {w:810, M:266, t:"6h 2m"}, {w:1091, M:390, t:"6h 22m"}, {w:1551, M:594, t:"7h 58m"}, {w:1921, M:780, t:"7h 50m"}, {w:2600, M:1098, t:"9h 29m"}, {w:3530, M:1612, t:"9h 19m"}, {w:4555, M:1960, t:"10h 7m"}, {w:6228, M:2563, t:"10h 10m"}, {w:7702, M:3349, t:"10h 57m"}, {w:30808, M:13396, t:"1D 19h"}, {w:61616, M:26792, t:"3D 15h"}, {w:123232, M:53584, t:"7D 7h"}, {w:246464, M:107168, t:"14D 14h"}, {w:492928, M:214336, t:"29D 4h"}, {w:985856, M:428672, t:"58D 9h"}, {w:1971712, M:857344, t:"116D 19h"}, {w:3943424, M:1714688, t:"233D 14h"}, {w:7886848, M:3429376, t:"467D 4h"}, {w:15773696, M:6858752, t:"934D 9h"}, {w:31547392, M:13717504, t:"1868D 19h"}, {w:63094784, M:27435008, t:"3737D 14h"}, {w:126189568, M:54870016, t:"7475D 4h"}, {w:252379136, M:109740032, t:"14950D 9h"}, {w:504758272, M:219480064, t:"29900D 19h"}, {w:1009516544, M:438960128, t:"59801D 14h"}],
  [{w:35, t:"6m 58s"}, {w:45, t:"16m 12s"}, {w:68, t:"31m 12s"}, {w:76, t:"56m 24s"}, {w:67, M:22, t:"1h 39m"}, {w:76, M:24, t:"1h 44m"}, {w:124, M:46, t:"2h 3m"}, {w:183, M:56, t:"2h 15m"}, {w:235, M:82, t:"2h 23m"}, {w:336, M:100, t:"2h 55m"}, {w:455, M:150, t:"3h 23m"}, {w:616, M:220, t:"4h"}, {w:755, M:289, t:"4h 18m"}, {w:980, M:398, t:"5h"}, {w:1170, M:494, t:"4h 48m"}, {w:1477, M:650, t:"5h 29m"}, {w:1797, M:821, t:"5h 25m"}, {w:2120, M:991, t:"5h 50m"}, {w:2435, M:1048, t:"5h 24m"}, {w:2831, M:1254, t:"5h 48m"}, {w:3208, M:1320, t:"5h 14m"}, {w:3763, M:1595, t:"5h 43m"}, {w:4296, M:1869, t:"5h 5m"}, {w:4874, M:2166, t:"5h 24m"}, {w:19496, M:8664, t:"21h 39m"}, {w:38992, M:17328, t:"1D 19h"}, {w:77984, M:34656, t:"3D 14h"}, {w:155968, M:69312, t:"7D 5h"}, {w:311936, M:138624, t:"14D 10h"}, {w:623872, M:277248, t:"28D 21h"}, {w:1247744, M:554496, t:"57D 18h"}, {w:2495488, M:1108992, t:"115D 12h"}, {w:4990976, M:2217984, t:"231D 57m"}, {w:9981952, M:4435968, t:"462D 1h"}, {w:19963904, M:8871936, t:"924D 3h"}, {w:39927808, M:17743872, t:"1848D 7h"}, {w:79855616, M:35487744, t:"3696D 15h"}, {w:159711232, M:70975488, t:"7393D 6h"}, {w:319422464, M:141950976, t:"14786D 13h"}, {w:638844928, M:283901952, t:"29573D 2h"}, {w:1277689856, M:567803904, t:"59146D 5h"}, {w:2555379712, M:1135607808, t:"118292D 11h"}, {w:5110759424, M:2271215616, t:"236584D 23h"}, {w:10221518848, M:4542431232, t:"473169D 22h"}, {w:20443037696, M:9084862464, t:"946339D 20h"}, {w:40886075392, M:18169724928, t:"1892679D 16h"}, {w:81772150784, M:36339449856, t:"3785359D 8h"}, {w:163544301568, M:72678899712, t:"7570718D 17h"}, {w:327088603136, M:145357799424, t:"15141437D 10h"}, {w:654177206272, M:290715598848, t:"30282874D 21h"}, {w:1308354412544, M:581431197696, t:"60565749D 18h"}, {w:2616708825088, M:1162862395392, t:"121131499D 12h"}, {w:5233417650176, M:2325724790784, t:"242262999D 57m"}, {w:10466835300352, M:4651449581568, t:"484525998D 1h"}, {w:20933670600704, M:9302899163136, t:"969051996D 3h"}, {w:41867341201408, M:18605798326272, t:"1938103992D 7h"}],
  [{w:42, t:"27m 36s"}, {w:91, t:"1h 7m"}, {w:79, M:13, t:"1h 40m"}, {w:145, M:43, t:"2h 25m"}, {w:255, M:62, t:"3h 8m"}, {w:396, M:110, t:"4h 2m"}, {w:565, M:134, t:"4h 54m"}, {w:799, M:237, t:"5h 57m"}, {w:1203, M:387, t:"7h 6m"}, {w:1619, M:558, t:"8h 24m"}, {w:2135, M:780, t:"9h 54m"}, {w:2761, M:1167, t:"11h 27m"}, {w:4198, M:1917, t:"13h 12m"}, {w:5746, M:2472, t:"15h 12m"}, {w:7655, M:3150, t:"17h 22m"}, {w:10032, M:5235, t:"19h 48m"}, {w:40128, M:20940, t:"3D 7h"}, {w:80256, M:41880, t:"6D 14h"}, {w:160512, M:83760, t:"13D 4h"}, {w:321024, M:167520, t:"26D 9h"}, {w:642048, M:335040, t:"52D 19h"}, {w:1284096, M:670080, t:"105D 15h"}, {w:2568192, M:1340160, t:"211D 7h"}, {w:5136384, M:2680320, t:"422D 14h"}, {w:10272768, M:5360640, t:"845D 5h"}, {w:20545536, M:10721280, t:"1690D 10h"}, {w:41091072, M:21442560, t:"3380D 21h"}, {w:82182144, M:42885120, t:"6761D 19h"}, {w:164364288, M:85770240, t:"13523D 15h"}, {w:328728576, M:171540480, t:"27047D 6h"}, {w:657457152, M:343080960, t:"54094D 12h"}, {w:1314914304, M:686161920, t:"108189D 19m"}],
  [{w:72, t:"1h 12m"}, {w:74, M:13, t:"1h 50m"}, {w:100, M:32, t:"2h 29m"}, {w:155, M:58, t:"3h 16m"}, {w:227, M:69, t:"4h 12m"}, {w:324, M:113, t:"4h 37m"}, {w:442, M:131, t:"4h 59m"}, {w:593, M:195, t:"5h 18m"}, {w:777, M:278, t:"5h 32m"}, {w:998, M:382, t:"5h 42m"}, {w:1255, M:509, t:"6h 24m"}, {w:1564, M:661, t:"7h 8m"}, {w:2159, M:950, t:"8h 55m"}, {w:2317, M:1058, t:"8h 44m"}, {w:2784, M:1301, t:"9h 7m"}, {w:3308, M:1423, t:"9h 27m"}, {w:3902, M:1728, t:"9h 43m"}, {w:4559, M:1876, t:"9h 56m"}, {w:5296, M:2245, t:"10h 4m"}, {w:6119, M:2661, t:"10h 9m"}, {w:7020, M:3120, t:"10h 8m"}, {w:7533, M:3348, t:"10h 2m"}, {w:8065, M:3584, t:"9h 51m"}, {w:8613, M:3828, t:"9h 34m"}, {w:34452, M:15312, t:"1D 14h"}, {w:68904, M:30624, t:"3D 4h"}, {w:137808, M:61248, t:"6D 9h"}, {w:275616, M:122496, t:"12D 18h"}, {w:551232, M:244992, t:"25D 12h"}, {w:1102464, M:489984, t:"51D 57m"}, {w:2204928, M:979968, t:"102D 1h"}, {w:4409856, M:1959936, t:"204D 3h"}, {w:8819712, M:3919872, t:"408D 7h"}, {w:17639424, M:7839744, t:"816D 15h"}, {w:35278848, M:15679488, t:"1633D 6h"}, {w:70557696, M:31358976, t:"3266D 13h"}, {w:141115392, M:62717952, t:"6533D 2h"}, {w:282230784, M:125435904, t:"13066D 5h"}, {w:564461568, M:250871808, t:"26132D 11h"}, {w:1128923136, M:501743616, t:"52264D 23h"}, {w:2257846272, M:1003487232, t:"104529D 22h"}, {w:4515692544, M:2006974464, t:"209059D 20h"}, {w:9031385088, M:4013948928, t:"418119D 16h"}, {w:18062770176, M:8027897856, t:"836239D 8h"}, {w:36125540352, M:16055795712, t:"1672478D 17h"}, {w:72251080704, M:32111591424, t:"3344957D 10h"}, {w:144502161408, M:64223182848, t:"6689914D 21h"}, {w:289004322816, M:128446365696, t:"13379829D 18h"}, {w:578008645632, M:256892731392, t:"26759659D 12h"}, {w:1156017291264, M:513785462784, t:"53519319D 57m"}, {w:2312034582528, M:1027570925568, t:"107038638D 1h"}, {w:4624069165056, M:2055141851136, t:"214077276D 3h"}, {w:9248138330112, M:4110283702272, t:"428154552D 7h"}, {w:18496276660224, M:8220567404544, t:"856309104D 15h"}, {w:36992553320448, M:16441134809088, t:"1712618209D 6h"}, {w:73985106640896, M:32882269618176, t:"3425236418D 13h"}],
  [{w:25, t:"13m 20s"}, {w:112, M:12, t:"55m 12s"}, {w:196, M:46, t:"1h 49m"}, {w:297, M:88, t:"3h 5m"}, {w:494, M:162, t:"4h 2m"}, {w:766, M:274, t:"4h 58m"}, {w:1127, M:432, t:"5h 47m"}, {w:1588, M:644, t:"7h 17m"}, {w:2177, M:920, t:"7h 57m"}, {w:2895, M:1274, t:"9h 34m"}, {w:3756, M:1715, t:"9h 55m"}, {w:4803, M:2244, t:"11h 35m"}, {w:6030, M:2594, t:"11h 29m"}, {w:7468, M:3307, t:"13h 8m"}, {w:9117, M:3751, t:"12h 25m"}, {w:11804, M:5133, t:"13h 59m"}, {w:47216, M:20532, t:"2D 7h"}, {w:94432, M:41064, t:"4D 15h"}, {w:188864, M:82128, t:"9D 7h"}, {w:377728, M:164256, t:"18D 15h"}, {w:755456, M:328512, t:"37D 7h"}, {w:1510912, M:657024, t:"74D 14h"}, {w:3021824, M:1314048, t:"149D 4h"}, {w:6043648, M:2628096, t:"298D 8h"}],
  [{w:282, M:84, t:"1h 28m"}, {w:760, M:272, t:"2h 57m"}, {w:1616, M:656, t:"4h 56m"}, {w:2996, M:1319, t:"7h 25m"}, {w:5035, M:2353, t:"8h 40m"}, {w:7901, M:3499, t:"11h 35m"}, {w:11746, M:4979, t:"14h 54m"}, {w:16776, M:7456, t:"18h 38m"}, {w:67104, M:29824, t:"3D 2h"}, {w:134208, M:59648, t:"6D 5h"}, {w:268416, M:119296, t:"12D 10h"}, {w:536832, M:238592, t:"24D 20h"}, {w:1073664, M:477184, t:"49D 16h"}, {w:2147328, M:954368, t:"99D 9h"}, {w:4294656, M:1908736, t:"198D 19h"}, {w:8589312, M:3817472, t:"397D 15h"}, {w:17178624, M:7634944, t:"795D 7h"}, {w:34357248, M:15269888, t:"1590D 14h"}, {w:68714496, M:30539776, t:"3181D 5h"}, {w:137428992, M:61079552, t:"6362D 10h"}, {w:274857984, M:122159104, t:"12724D 21h"}, {w:549715968, M:244318208, t:"25449D 19h"}, {w:1099431936, M:488636416, t:"50899D 15h"}, {w:2198863872, M:977272832, t:"101799D 6h"}],
  [{w:648, t:"4h"}, {w:5600, M:536, t:"8h"}, {w:20880, M:7317, C:4878, t:"9h"}, {w:57600, W:12800, M:32000, C:25600, t:"8h"}, {w:230400, W:102400, M:153600, C:102400, t:"8h"}, {w:460800, W:204800, M:307200, C:204800, t:"8h"}, {w:921600, W:409600, M:614400, C:409600, t:"8h"}, {w:1843200, W:819200, M:1228800, C:819200, t:"8h"}, {w:3686400, W:1638400, M:2457600, C:1638400, t:"8h"}, {w:7372800, W:3276800, M:4915200, C:3276800, t:"8h"}, {w:14745600, W:6553600, M:9830400, C:6553600, t:"8h"}, {w:29491200, W:13107200, M:19660800, C:13107200, t:"8h"}],
  [{w:46, M:14, t:"50m 25s"}, {w:120, M:42, t:"1h 42m"}, {w:212, M:63, t:"2h 23m"}, {w:334, M:110, t:"2h 59m"}, {w:489, M:175, t:"3h 29m"}, {w:681, M:261, t:"3h 53m"}, {w:1001, M:406, t:"4h 38m"}, {w:1428, M:603, t:"5h 25m"}, {w:1967, M:866, t:"6h 15m"}, {w:2635, M:1203, t:"7h 6m"}, {w:3472, M:1622, t:"7h 58m"}, {w:4481, M:1928, t:"8h 53m"}, {w:5693, M:2521, t:"9h 49m"}, {w:7122, M:2931, t:"10h 46m"}, {w:8804, M:3732, t:"11h 45m"}, {w:10770, M:4683, t:"12h 45m"}, {w:43080, M:18732, t:"2D 3h"}, {w:86160, M:37464, t:"4D 6h"}, {w:172320, M:74928, t:"8D 12h"}, {w:344640, M:149856, t:"17D 19m"}, {w:689280, M:299712, t:"34D 38m"}, {w:1378560, M:599424, t:"68D 1h"}, {w:2757120, M:1198848, t:"136D 2h"}, {w:5514240, M:2397696, t:"272D 5h"}, {w:11028480, M:4795392, t:"544D 10h"}, {w:22056960, M:9590784, t:"1088D 20h"}, {w:44113920, M:19181568, t:"2177D 16h"}, {w:88227840, M:38363136, t:"4355D 9h"}, {w:176455680, M:76726272, t:"8710D 19h"}, {w:352911360, M:153452544, t:"17421D 15h"}, {w:705822720, M:306905088, t:"34843D 7h"}, {w:1411645440, M:613810176, t:"69686D 14h"}],
  [{w:15, t:"17m 17s"}, {w:38, t:"43m 12s"}, {w:104, M:32, t:"1h 32m"}, {w:222, M:66, t:"2h 7m"}, {w:426, M:152, t:"2h 45m"}, {w:643, M:246, t:"3h 40m"}, {w:933, M:417, t:"4h 45m"}, {w:1301, M:660, t:"5h 56m"}, {w:1765, M:1010, t:"7h 17m"}, {w:2317, M:1481, t:"8h 44m"}, {w:3002, M:2104, t:"10h 21m"}, {w:3799, M:2615, t:"12h 3m"}, {w:4754, M:3579, t:"13h 56m"}, {w:5839, M:4325, t:"15h 54m"}, {w:7618, M:6294, t:"18h 3m"}, {w:9131, M:8116, t:"20h 17m"}, {w:36524, M:32464, t:"3D 9h"}, {w:73048, M:64928, t:"6D 18h"}, {w:146096, M:129856, t:"13D 12h"}, {w:292192, M:259712, t:"27D 1h"}, {w:584384, M:519424, t:"54D 2h"}, {w:1168768, M:1038848, t:"108D 5h"}, {w:2337536, M:2077696, t:"216D 10h"}, {w:4675072, M:4155392, t:"432D 20h"}, {w:9350144, M:8310784, t:"865D 16h"}, {w:18700288, M:16621568, t:"1731D 9h"}, {w:37400576, M:33243136, t:"3462D 19h"}, {w:74801152, M:66486272, t:"6925D 15h"}, {w:149602304, M:132972544, t:"13851D 7h"}, {w:299204608, M:265945088, t:"27702D 14h"}, {w:598409216, M:531890176, t:"55405D 5h"}, {w:1196818432, M:1063780352, t:"110810D 10h"}], , [{w:26, M:8, t:"18m 36s"}, {w:55, M:20, t:"33m 37s"}, {w:102, M:30, t:"52m 48s"}, {w:163, M:54, t:"1h 12m"}, {w:236, M:85, t:"1h 31m"}, {w:277, M:106, t:"1h 34m"}, {w:371, M:151, t:"1h 53m"}, {w:465, M:197, t:"2h 7m"}, {w:545, M:240, t:"2h 15m"}, {w:682, M:311, t:"2h 34m"}, {w:810, M:379, t:"2h 47m"}, {w:980, M:422, t:"3h 6m"}, {w:1037, M:460, t:"3h 2m"}, {w:1197, M:493, t:"3h 15m"}, {w:1509, M:640, t:"3h 28m"}, {w:1925, M:837, t:"3h 48m"}, {w:2352, M:1046, t:"4h 1m"}, {w:2672, M:1188, t:"4h 14m"}, {w:2883, M:1281, t:"4h 16m"}, {w:3089, M:1373, t:"4h 17m"}, {w:3305, M:1469, t:"4h 19m"}, {w:3913, M:1739, t:"4h 49m"}, {w:4233, M:1881, t:"4h 57m"}, {w:4563, M:2028, t:"5h 4m"}, {w:18252, M:8112, t:"20h 16m"}, {w:36504, M:16224, t:"1D 16h"}, {w:73008, M:32448, t:"3D 9h"}, {w:146016, M:64896, t:"6D 18h"}, {w:292032, M:129792, t:"13D 12h"}, {w:584064, M:259584, t:"27D 57m"}, {w:1168128, M:519168, t:"54D 1h"}, {w:2336256, M:1038336, t:"108D 3h"}],
  [{w:20, t:"15m 8s"}, {w:49, M:10, t:"42m"}, {w:95, M:27, t:"1h 8m"}, {w:163, M:48, t:"1h 41m"}, {w:266, M:88, t:"2h 10m"}, {w:407, M:146, t:"2h 38m"}, {w:594, M:228, t:"3h 23m"}, {w:867, M:352, t:"4h 25m"}, {w:1179, M:498, t:"5h 22m"}, {w:1559, M:686, t:"6h 26m"}, {w:2012, M:919, t:"7h 12m"}, {w:2674, M:1250, t:"8h 17m"}, {w:3343, M:1438, t:"9h 1m"}, {w:4127, M:1828, t:"9h 40m"}, {w:5021, M:2066, t:"10h 15m"}, {w:6304, M:2672, t:"11h 12m"}, {w:7533, M:3276, t:"11h 36m"}, {w:8910, M:3960, t:"11h 52m"}, {w:9833, M:4370, t:"12h 1m"}, {w:11232, M:4992, t:"12h 28m"}, {w:44928, M:19968, t:"2D 1h"}, {w:89856, M:39936, t:"4D 3h"}, {w:179712, M:79872, t:"8D 7h"}, {w:359424, M:159744, t:"16D 15h"}, {w:718848, M:319488, t:"33D 6h"}, {w:1437696, M:638976, t:"66D 13h"}, {w:2875392, M:1277952, t:"133D 2h"}, {w:5750784, M:2555904, t:"266D 5h"}, {w:11501568, M:5111808, t:"532D 11h"}, {w:23003136, M:10223616, t:"1064D 23h"}, {w:46006272, M:20447232, t:"2129D 22h"}, {w:92012544, M:40894464, t:"4259D 20h"}, {w:184025088, M:81788928, t:"8519D 16h"}, {w:368050176, M:163577856, t:"17039D 8h"}, {w:736100352, M:327155712, t:"34078D 17h"}, {w:1472200704, M:654311424, t:"68157D 10h"}, {w:2944401408, M:1308622848, t:"136314D 21h"}, {w:5888802816, M:2617245696, t:"272629D 18h"}, {w:11777605632, M:5234491392, t:"545259D 12h"}, {w:23555211264, M:10468982784, t:"1090519D 57m"}]
];
costs[buildingIDs.palaceColony] = costs[buildingIDs.palace];

function visualResources(what, opt) {
  var gold = <img src="skin/resources/icon_gold.gif" width="17" height="19"/>;
  var wood = <img src="skin/resources/icon_wood.gif" width="25" height="20"/>;
  var wine = <img src="skin/resources/icon_wine.gif" width="25" height="20"/>;
  var glass =<img src="skin/resources/icon_glass.gif" width="23" height="18"/>;
  var marble=<img src="skin/resources/icon_marble.gif" width="25" height="19"/>;
  var sulfur=<img src="skin/resources/icon_sulfur.gif" width="25" height="19"/>;
  var bulb = <img src="skin/layout/bulb-on.gif" width="14" height="21"/>;
  function replace(m, icon) {
    var margin = { glass: -3 }[icon] || -5;
    icon = eval(icon);
    if (opt && opt.size) {
      var h0 = icon.@height, h1 = Math.ceil(opt.size * h0);
      var w0 = icon.@width,  w1 = Math.ceil(opt.size * w0);
      margin = margin + Math.floor((h0 - h1) / 2);
      icon.@height = h1;
      icon.@width = w1;
    }
    icon.@style = "margin-bottom: "+ margin +"px";
    return icon.toXMLString();
  }
  if (typeof what == "object") {
    var name = { w: "wood", g: "gold",
                 M: "marble", C: "glass", W: "wine", S: "sulfur" };
    var html = []
    for (var id in what) {
      var count = what[id];
      if (count < 0 && opt.nonegative)
        count = 0;
      if (name[id])
        html.push(count +" $"+ name[id]);
      else
        html.push(count); // (build time)
    }
    what = html.join(" \xA0 ");
  }
  return what.replace(/\$([a-z]{4,6})/g, replace);
}

/*--------------------------------------------------------
Création des fonctions de temps.
---------------------------------------------------------*/
function getServerTime(offset) {
  var Y, M, D, h, m, s, t;
  [D, M, Y, h, m, s] = $("servertime").textContent.split(/[. :]+/g);
  t = new Date(Y, parseInt(M, 10)-1, D, h, m, s);
  return offset ? new Date(t.valueOf() + offset*1e3) : t;
}

function resolveTime(seconds, timeonly) { // Crée le temps de fin.
  function z(t) { return (t < 10 ? "0" : "") + t; }
  var t = getServerTime(seconds);
  var d = "";
  if (t.getDate() != (new Date).getDate()) {
    var m = lang[monthshort].slice(t.getMonth()*3);
    d = t.getDate() +" "+ m.slice(0, 3) +", ";
  }
  var h = z(t.getHours());
  var m = z(t.getMinutes());
  var s = z(t.getSeconds());
  t = d + h + ":" + m + ":" + s;
  return timeonly ? t : lang[finished] + t;
}

function secondsToHours(bySeconds) {
  return isNaN(bySeconds) ? 0 : Math.round(bySeconds * 3600);
}

var locale = unsafeWindow.LocalizationStrings;
var units = { day: 86400, hour: 3600, minute: 60, second: 1 };

// input: "Nd Nh Nm Ns", output: number of seconds left
function parseTime(t) {
  function parse(what, mult) {
    var count = t.match(new RegExp("(\\d+)" + locale.timeunits.short[what]));
    if (count)
      return parseInt(count[1], 10) * mult;
    return 0;
  }
  var s = 0;
  for (var unit in units)
    s += parse(unit, units[unit]);
  return s;
}

function secsToDHMS(t, rough, join) {
  if (t == Infinity) return "∞";
  var result = [];
  var minus = t < 0 ? "-" : "";
  if (minus)
    t = -t;
  for (var unit in units) {
    var u = locale.timeunits.short[unit];
    var n = units[unit];
    var r = t % n;
    if (r == t) continue;
    if ("undefined" == typeof rough || rough--)
      result.push(((t - r) / n) + u);
    else {
      result.push(Math.round(t / n) + u);
      break;
    }
    t = r;
  }
  return minus + result.join(join || " ");
}

function number(n) {
  if (isNumber(n)) return n;
  if (isObject(n))
    if (/input/i.test(n.nodeName||""))
      n = n.value;
    else if (n.textContent)
      n = n.textContent;
  return parseFloat(n.replace(/[^\d.-]+/g, ""));
}

function integer(n) {
  if (isNumber(n)) return n;
  if (isObject(n))
    if (/input/i.test(n.nodeName||""))
      n = n.value;
    else if (n.textContent)
      n = n.textContent;
  return parseInt(n.replace(/[^\d-]+/g, ""), 10);
}

function colonizeView() {
  function annotate(what, time) {
    what.innerHTML += " ("+ time +")";
  }
  css("#container .resources li { white-space: nowrap; }");

  var have = currentResources();

/* FIXME: hook up the population predictor with a "time until X pop" option
  var growth = config.getServer("growth", 0);
  var needPop = $X('//ul/li[@class="citizens"]');
  if (have.p < 40 && growth > 0)
    annotate(needPop, resolveTime((40 - have.p) / (growth / 3600.0), 1));
*/

  // FIXME: really ought to kill this code full of lies too
  var income = config.getServer("income", 0);
  var needGold = $X('//ul/li[@class="gold"]');
  if (have.g < 12e3 && income > 0)
    annotate(needGold, resolveTime((12e3 - have.g) / (income / 3600), 1));

  var woodadd = secondsToHours(jsVariable("startResourcesDelta"));
  var needWood = $X('//ul/li[@class="wood"]');
  if (have.w < 1250 && woodadd > 0)
    annotate(needWood, resolveTime((1250 - have.w) / (woodadd / 3600), 1));
}

function dblClickTo(node, action, condition, capture) {
  clickTo(node, action, condition, capture, "dblclick");
}

function clickTo(node, action, condition, capture, event) {
  if (node) {
    node.addEventListener(event || "click", function(e) {
      if (!condition || $X(condition, e.target)) {
        e.stopPropagation();
        e.preventDefault();
        if (isFunction(action))
          action(e);
        else
          goto(action);
      }
    }, !!capture);
    node.style.cursor = "pointer";
  }
}

function post(url, args) {
  var form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  for (var item in args) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = item;
    input.value = args[item];
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

function sellStuff(e) { buysell(e, sell); }
function goShopping(e) { buysell(e, buy); }
function buysell(e, func) {
  var img = e.target;
  if (img.src) {
    var what = img.src.match(/_([^.]+).gif$/)[1];
    if (what) func(what);
  } else if (haveBuilding("branchOffice")) {
    goto("branchOffice");
  }
}

function buy(what, amount) {
  trade("buy", what, amount);
}

function sell(what, amount) {
  trade("sell", what, amount);
}

function trade(operation, what, amount) {
  var id = { w: "resource", W: 1, M: 2, C: 3, S: 4 }[resourceIDs[what]];
  post(urlTo("branchOffice"), { type: { buy:"444", sell:"333" }[operation],
                                searchResource: id, range: "99" });
}

function sign(n) {
  if ("undefined" == typeof n) n = 0;
  return (n > 0 ? "+" : n == 0 ? "±" : "") + n;
}

// projects wine shortage time and adds lots of shortcut clicking functionality
function improveTopPanel() {
  function tradeOnClick(li) {
    var what = trim(li.className).split(" ")[0]; // "glass", for instance
    if (!haveBuilding("branchOffice")) return;
    clickTo(li, bind(buy, this, what), 'not(self::a or self::span)');
    dblClickTo(li, bind(sell, this, what));
  }
  function projectWarehouseFull(node, what, have, pace) {
    var capacity = number($X('../*[@class="tooltip"]', get(what)));
    var time = resolveTime((capacity - have) / (pace/3600), 1);
    node.title = (node.title ? node.title +", " : "") + lang[full] + time;
  }

  css(<><![CDATA[
#income {
  background:transparent url(skin/resources/icon_gold.gif) no-repeat 100% 0;
  line-height: 22px;
  padding-right: 18px;
  text-align: right;
  position: absolute;
  width: 52px;
  top: 33px;
}

#income.negative {
  background-position:49px -2px;
  background-image:url(skin/icons/corruption_24x24.gif);
}

.ellipsis {
  bottom: 1px;
  margin-left: 1px;
  position: absolute;
  font-size: 10px;
}

.ellipsis:before { content:"("; }
.ellipsis:after { content:")"; }

#cityNav .citySelect .optionList li {
  overflow: hidden;
  white-space: nowrap;
}

#island #container #mainview ul#islandfeatures li.marble { z-index: 400; }

#loot-report {
  border-collapse: separate;
  border-spacing: 1px;
}

#loot-report th {
  background-color: #E0B16D;
  border: 1px solid #BB9765;
  padding: 1px 3px 3px;
  font-size: large;
}

#loot-report td.date {
  white-space: nowrap;
}

#loot-report td.warn {
  font-size: 14px;
  font-weight: bolder;
  color: red;
}

#loot-report .number {
  text-align: right;
  white-space: nowrap;
}

#loot-report .time {
  font-size: 11px;
  text-align: center;
  white-space: nowrap;
}

#loot-report .number input {
  margin: 0 4px 2px;
  opacity: 0.7;
}

]]></>);

  // wine flow calculation
  var flow = reapingPace();
  var span = $("value_wine");
  var time = flow.W < 0 ? Math.floor(number(span)/-flow.W) +"h" : sign(flow.W);
  time = createNode("", "ellipsis", time, "span");
  span.parentNode.insertBefore(time, span.nextSibling);
  if (flow.W < 0)
    time.title = lang[empty] + resolveTime(number(span)/-flow.W * 3600, 1);
  else if (flow.W > 0) {
    var reap = secondsToHours(jsVariable("startTradegoodDelta"));
    time.title = "+"+ reap +"/-"+ (reap - flow.W);
    projectWarehouseFull(time, "wine", number(span), flow.W);
  }
  linkTo("tavern", time, { color: "#542C0F" });

  // other resource flow
  var income = { wood:flow.w };
  var type = luxuryType();
  var luxe = flow[type];
  var name = luxuryType("name");
  if (name != "wine") // already did that
    income[name] = luxe;

  // city resource type, for the city selection pane:
  config.setCity("r", type, referenceCityID());

  for (name in income) {
    var amount = income[name];
    span = get(name);
    var node = createNode("", "ellipsis", sign(amount), "span");
    span.parentNode.insertBefore(node, span.nextSibling);
    if (amount > 0)
      projectWarehouseFull(node, name, number(span), income[name]);
    linkTo("port", node, { color: "#542C0F" });
  }

  var gold = config.getCity("gold", 0);
  if (gold) {
    var cityNav = $("cityNav");
    gold = createNode("income", gold < 0 ? "negative" : "",
                      (gold > 0 ? "+" : "") + gold);
    cityNav.appendChild(gold);

    var ap = $("value_maxActionPoints").parentNode;
    ap.style.top = "-49px";
    ap.style.left = "-67px";
    ap.addEventListener("mouseover", hilightShip, false);
    ap.addEventListener("mouseout", unhilightShip, false);
    clickTo(ap, urlTo("merchantNavy"));
    gold.title = " "; // trim(ap.textContent.replace(/\s+/g, " "));
  }

  $x('id("cityResources")/ul[@class="resources"]/li/div[@class="tooltip"]').
    forEach(function(tooltip) {
      var a = linkTo("warehouse", tooltip);
      if (a)
        hideshow(a, [a, a.parentNode]);
    });

  clickTo(cityNav, urlTo("townHall"), 'self::*[@id="cityNav" or @id="income"]');
  var normalColor = { color: "#542C0F" };
  linkTo("luxe", $X('id("value_'+ luxuryType("name") +'")'), normalColor);
  linkTo("wood", $X('id("value_wood")'), normalColor);
  $x('id("cityResources")/ul/li[contains("wood wine marble glass sulfur",'+
     '@class)]').forEach(tradeOnClick);

  if (!isMyCity()) return;

  var build = config.getCity("build", 0), now = Date.now();
  if (build > now) {
    time = $X('//li[@class="serverTime"]');
    var a = document.createElement("a");
    a.href = config.getCity("buildurl");
    a.appendChild(createNode("done", "textLabel",
                             trim(resolveTime(Math.ceil((build-now)/1e3))),
                             "span"));
    time.appendChild(a);
  }

  showHousingOccupancy();
  showSafeWarehouseLevels();
  showCityBuildCompletions();
}

function showCityBuildCompletions() {
  var focused = referenceCityID();
  var lis = get("citynames");
  var ids = cityIDs();
  for (var i = 0; i < lis.length; i++) {
    var id = ids[i];
    var url = config.getCity("buildurl", 0, ids[i]);
    var res = config.getCity("r", "", id);
    var li = lis[i];
    var t = config.getCity("build", 0, ids[i]);
    if (t && t > Date.now() && url) {
      t = resolveTime((t - Date.now()) / 1e3, 1);
      var styles = {
        marginLeft: "3px",
        background: "none",
        position: "static",
        display: "inline",
        color: "#542C0F",
      };
      var a = createNode("", "ellipsis", t, "a", styles);
      a.href = url;
      li.appendChild(a);
    }
    li.title = " "; // to remove the town hall tooltip

    if (res) {
      var has = {}; has[res] = "";
      li.innerHTML = visualResources(has) + li.innerHTML;
      var img = $X('img', li);
      img.height = Math.round(img.height / 2);
      img.width = Math.round(img.width / 2);
      img.style.margin = "0 3px";
      img.style.background = "none";
      if (id == focused) {
        var current = $X('preceding::div[@class="dropbutton"]', li);
        current.insertBefore(img.cloneNode(true), current.firstChild);
      }
    }
  }
}

function hilightShip() {
  var ship = get("ship");
  if (ship) ship.style.backgroundPosition = "0 -53px";
}

function unhilightShip() {
  var ship = get("ship");
  if (ship) ship.style.backgroundPosition = "";
}

function showSafeWarehouseLevels() {
  function showSafeLevel(div) {
    var n = "wood" == div.parentNode.className ? wood : rest;
    div.appendChild(createNode("", "ellipsis", n, "span"));
  }
  var level = config.getCity("building7", 0);
  var wood = buildingCapacity("warehouse", "wood", level);
  var rest = buildingCapacity("warehouse", "rest", level);
  $x('id("cityResources")/ul/li/*[@class="tooltip"]').map(showSafeLevel);
}

function showHousingOccupancy(opts) {
  var div = $("value_inhabitants");
  var node = div.firstChild;
  var text = node.nodeValue.replace(/\s/g, "\xA0");
  var pop = projectPopulation(opts);
  var time = ":∞";
  if (pop.upgradeIn)
    time = ":" + secsToDHMS(pop.upgradeIn, 0);
  else //if (pop.asymptotic > pop.maximum)
    time = "/" + sign(pop.maximum - pop.current);
  //console.log(pop.toSource());
  node.nodeValue = text.replace(new RegExp("[:)/].*$"), time +")");
  div.style.whiteSpace = "nowrap";
  var townSize = $X('id("information")//ul/li[@class="citylevel"]');
  if (townSize) {
    var townhall = pop.current +"/"+ pop.maximum +"; "+ sign(pop.growth) +"/h";
    townSize.appendChild(createNode("townhallfits", "ellipsis", townhall));
  }
  return pop;
}

function getPopulation() {
  return number($("value_inhabitants").textContent.match(/\(([\d,]+)/)[1]);
}

function getMaxPopulation(townHallLevel) {
  if ("undefined" == typeof townHallLevel)
    townHallLevel = buildingLevel("townHall", 1);
  var maxPopulation = buildingCapacity("townHall", townHallLevel);
  if (config.getServer("tech2080"))
    maxPopulation += 50; // Holiday bonus
  if (config.getServer("tech3010") && isCapital())
    maxPopulation += 50; // Well Digging bonus (capital city only)
  return maxPopulation;
}


function projectPopulation(opts) {
  function getGrowth(population) {
    return (happy - Math.floor(population)) / 50;
  }
  var wellDigging = isCapital() && config.getServer("tech3010") ? 50 : 0;
  var holiday = config.getServer("tech2080") ? 25 : 0;
  var tavern = 12 * buildingLevel("tavern", 0);
  var wineLevel = opts && opts.hasOwnProperty("wine") ? opts.wine :
    config.getCity("wine", 0);
  var wine = 80 * buildingCapacities.tavern.indexOf(wineLevel);
  var museum = 20 * buildingLevel("museum", 0);
  var culture = 50 * config.getCity("culture", 0);
  var happy = 196 + wellDigging + holiday + tavern + wine + museum + culture;
  //console.log(wellDigging, holiday, tavern, wine, museum, culture, happy);

  var population = opts && opts.population || getPopulation();
  var initialGrowth = getGrowth(population);
  var growthSignSame = initialGrowth > 0 ? function plus(p) { return p > 0; } :
                                          function minus(p) { return p < 0; };
  var currentPopulation = population;
  var asymptoticPopulation = population, asymAt;
  var change = initialGrowth > 0 ? 1 : -1;
  while (growthSignSame(getGrowth(asymptoticPopulation)))
    asymptoticPopulation += change;

  var time = 0;
  var currentGrowth = initialGrowth;
  var maximumPopulation = getMaxPopulation();
  while (growthSignSame(currentGrowth) && (population < maximumPopulation)) {
    currentGrowth = getGrowth(population);
    population += currentGrowth / 4; // add 15 minutes of growth
    time += 60 * 15;
  }

  var hint = $("cityNav"), warn = true;
  if (asymptoticPopulation <= maximumPopulation) {
    hint.title = "Reaches asymptotic population "+ asymptoticPopulation +"/"+
      maximumPopulation +" at "+ resolveTime(time, 1);
    warn = false;
  }

  var people = $("value_inhabitants");
  var hqLevel = config.getCity("building0", 1);
  var nextHQUpgradeTime = parseTime(costs[0][hqLevel].t);
  var upgradingTownHall = $X('id("done")/../@href = "'+ urlTo("townHall") +'"');

  // < 15 min left for expanding Town Hall ahead of time to meet growth?
  if (warn) {
    if (time < 15 * 60 + nextHQUpgradeTime && !upgradingTownHall)
      people.className = "storage_danger";
    if (population == maximumPopulation)
      people.className = "storage_full";
    else
      people.className = "";

    hint.title = lang[full] + resolveTime(time, 1);
    if (!upgradingTownHall)
      hint.title += lang[startExpand] +
        resolveTime(time - nextHQUpgradeTime, 1);
  } else
    people.className = "";

  var upgrade = !upgradingTownHall && asymptoticPopulation > maximumPopulation;
  return {
      happy: happy - currentPopulation,
     growth: initialGrowth,
    current: currentPopulation,
 asymptotic: asymptoticPopulation,
    maximum: maximumPopulation,
    finalAt: Date.now() + time * 1e3,
  upgradeIn: upgrade ? time - nextHQUpgradeTime : 0,
      final: Math.min(asymptoticPopulation, maximumPopulation),
       time: time
  };
}

function projectBuildStart(root, result) {
  function projectWhenWeHaveResourcesToStartBuilding(ul) {
    if (!result) return;
    var time = 0;
    var need = {};
    var pace = reapingPace();
    var have = currentResources();
    var woodNode = $X('li[starts-with(@class,"wood")]', ul);
    if (woodNode)
      need.w = woodNode;
    var needRest = $x('id("buildingUpgrade")//ul[@class="resources"]/li[not('+
                      'contains(@class,"wood") or contains(@class,"time"))]');
    for (var i = 0; i < needRest.length; i++) {
      var what = needRest[i];
      var id = resourceIDs[what.className.split(" ")[0]];
      need[id] = what;
    }
    for (var r in need) {
      var node = need[r];
      var amount = number(node);
      if (amount <= have[r]) continue;
      if (!pace[r]) {
        node.title += ": (∞)";
        time = Infinity;
      } else {
        what = 3600 * (amount - have[r]) / pace[r];
        node.title += ": ("+ resolveTime(what, 1) +")";
        time = Math.max(time, what);
      }
    }
    if (time && (node = $X(result, ul))) {
      if (Infinity == time)
        time = "\xA0(∞)";
      else
        time = "\xA0("+ resolveTime(time, 1) +")";
      node.appendChild(document.createTextNode(time));
    }
  }

  if ($("donateForm")) return; // is a resource, not something you build/upgrade
  result = result || 'li[@class="time"]';
  $x('.//ul[@class="resources"][not(ancestor::*[@id="cityResources"])]',
     $(root)).forEach( projectWhenWeHaveResourcesToStartBuilding );
}

function projectHaveResourcesToUpgrade() {
  // $X('ul[@class="actions"]/li[@class="upgrade"]/a').className = "disabled";
  projectBuildStart("buildingUpgrade", 'preceding-sibling::h4');
}

function projectCompletion(id, className, loc) {
  var node = "string" == typeof id ? $(id) : id, set = false;
  if ("number" == typeof className) className = loc = undefined; // forEach/map
  if (node) {
    id = node.id;
    // console.log("T: %x", $("servertime").textContent);
    // console.log("L: %x", node.textContent);
    // console.log("D: %x", parseTime(node.textContent));
    // console.log("F: %x", resolveTime(parseTime(node.textContent)));
    var time = parseTime(node.textContent);
    var done = resolveTime(time);
    var div = createNode("", className, done, node.nodeName.toLowerCase());
    node.parentNode.insertBefore(div, node.nextSibling);
    time = time * 1e3 + Date.now();
    if ("upgradeCountDown" == id)
      set = config.setCity("build", time);
    if ("cityCountdown" == id) {
      set = config.setCity("build", time);
      var move = $X('ancestor::*[contains(@class,"timetofinish")]', node);
      if (move)
        move.style.marginLeft = "-40%";
    }
    if (set) {
      if ("string" == typeof loc)
        loc = $X(loc, node);
      else if ("undefined" == typeof loc)
        if (location.search.match(/\?/))
          loc = location;
        else
          loc = { href: urlTo(document.body.id) };
      if (loc)
        config.setCity("buildurl", loc.href);
    }
  }
  return time;
}

function tavernView() {
  function amount() {
    return number(wine.options[wine.selectedIndex]) || 0;
  }
  function makeGrowthrate() {
    var style = {
      position: "absolute",
     textAlign: "center",
        margin: "0 auto",
         width: "100%"
    };
    var node = createNode("growthRate", "value", "", "span", style);
    var next = $("citySatisfaction");
    return next.parentNode.insertBefore(node, next);
  }
  function recalcTownHall() {
    var pop = showHousingOccupancy({ wine: amount() });
    var rate = $("growthRate") || makeGrowthrate();
    rate.innerHTML = sign(pop.growth.toFixed(2));
  }
  var wine = $("wineAmount").form.elements.namedItem("amount");
  wine.parentNode.addEventListener("DOMNodeInserted", function() {
    setTimeout(recalcTownHall, 10);
  }, false);
  config.setCity("wine", amount());
  recalcTownHall();
}

function title(detail) {
  var server = location.hostname.match(/^s(\d+)\.(.*)/), host = "";
  if (server) {
    host = " "+ server[2];
    server = "αβγδεζηθικλμνξοπρστυφχψω".charAt(parseInt(server[1], 10)-1);
  }
  if (!detail)
    detail = $X('id("breadcrumbs")/*[last()]').textContent;
  document.title = (server ? server + " " : "") + detail + host;
}

function clickResourceToSell() {
  function haveHowMuch(e) {
    var img = e.target;
    var resource = img.src.match(/([^_]+).gif$/)[1].replace("glass", "crystal");
    return number(get(resource));
  }
  function sell100(e) {
    var have = haveHowMuch(e);
    var sell = $x('following::input[@type="text"]', e.target);
    sell[0].value = Math.min(have, 100 + parseInt(sell[0].value||"0", 10));
    sell[1].value = Math.max(25, parseInt(sell[1].value, 10));
  }
  function sellAll(e) {
    var have = haveHowMuch(e);
    var sell = $x('following::input[@type="text"]', e.target);
    sell[0].value = have;
    sell[1].value = Math.max(25, parseInt(sell[1].value||"0", 10));
  }
  function clickToSell(img) {
    img.addEventListener("click", sell100, false);
    //img.addEventListener("dblclick", sellAll, false);
    img.style.cursor = "pointer";
  }
  $x('//table[@class="tablekontor"]/tbody/tr/td[1]/img').forEach(clickToSell);
}

/*---------------------
Ajout du panel dans le menu
---------------------*/
function panelInfo() { // Ajoute un element en plus dans le menu.
  var panel = createNode("", "dynamic");

  var titre = document.createElement("h3");
  titre.setAttribute("class", "header");
  titre.appendChild(document.createTextNode(name + version +": "));

  var langPref = document.createTextNode(lang[language]);
  var langChoice = document.createElement("a");
  langChoice.href = "#";
  langChoice.appendChild(langPref);
  langChoice.addEventListener("click", promptLanguage, false);
  titre.appendChild(langChoice);

  var corps = createNode("Kronos", "content");
  corps.style.margin = "3px 10px";
  var footer = createNode("", "footer");

  panel.appendChild(titre);
  panel.appendChild(corps);
  panel.appendChild(footer);

  var mainview = $("mainview");
  if (mainview)
    mainview.parentNode.insertBefore(panel, mainview);
  return langChoice;
}

function islandID(city) {
  return urlParse("id", $X('//li[@class="viewIsland"]/a').search);
}

function referenceIslandID(city) {
  city = city || referenceCityID();
  city = config.getServer("cities", {})[city];
  return city && city.i;
}

function referenceCityID(index) {
  if (index) return $("citySelect").selectedIndex;
  var names = get("citynames"), name;
  for (var i = 0; name = names[i]; i++)
    if (/active/.test(name.className||""))
      return cityIDs()[i];
}

function cityID() {
  var id = urlParse("id");
  var view = urlParse("view");
  if (id)
    if (buildingIDs.hasOwnProperty(view) ||
        { city:1 }[view])
      return id;
  return integer(urlParse("id", $X('//li[@class="viewCity"]/a').search));
}

function cityIDs() {
  return pluck($x('id("citySelect")/option'), "value").map(integer);
}

function cityName() {
  return cityNames()[referenceCityID("index")];
}

function cityNames() {
  return pluck(get("citynames"), "textContent");
}

function isCapital() {
  var city = cityID();
  var capital = config.getServer("capital", 0);
  if (capital)
    return city == capital;
  return city == cityIDs()[0];
}

function isMyCity() {
  return cityIDs().indexOf(cityID()) != -1;
}

/*------------------------
   / \
  / ! \    Function Principal.
 -------
------------------------*/

function principal() {
  if (innerWidth > 1003) document.body.style.overflowX = "hidden"; // !scrollbar
  var langChoice = panelInfo();
  var chemin = $("Kronos");
  addCSSBubbles();

  var view = urlParse("view");
  var action = urlParse("action");
  var building = view && buildingID(view);
  if ("undefined" != building) {
    var level = $X('id("buildingUpgrade")//div[@class="buildingLevel"]');
    if (level)
      config.setCity("building"+ building, number(level));
  }

  var help = $X('id("buildingUpgrade")/h3/a[@class="help"]');
  if (help)
    linkTo(urlTo("building", buildingID(urlParse("view"))), help);

  switch (view || action) {
    case "tavern": tavernView(); break;
    case "resource":  // fall-through:
    case "tradegood": highlightMeInTable(); // fall-through:
    case "deployment": // fall-through:
    case "takeOffer": scrollWheelable(); break;
    case "transport": scrollWheelable(); evenShips(); break;
    case "loginAvatar":// &function=login
    case "CityScreen": // &function=build&id=...&position=4&building=13
    case "city": cityView(); break;
    case "buildingDetail": buildingDetailView(); break;
    case "port": portView(); break;
    case "island": islandView(); break;
    case "worldmap_iso": worldmap_isoView(); break;
    case "townHall": townHallView(); break;
    case "culturalPossessions_assign": // fall-through:
    case "museum": museumView(); break;
    case "fleetGarrisonEdit": // fall-through:
    case "armyGarrisonEdit": dontSubmitZero(); break;
    case "shipyard": // fall-through:
    case "barracks":
      dontSubmitZero();
      css(<><![CDATA[
#container #mainview .unit .resources li { float: none; padding-bottom: 5px; }
      ]]></>); break; // (can't fall-through yet:)
    case "buildingGround": buildingGroundView(); break;
    case "branchOffice": branchOfficeView(); break;
    case "researchOverview": techinfo(); break;
    case "colonize": scrollWheelable(); colonizeView(); break;
    case "merchantNavy": merchantNavyView(); break;
    case "militaryAdvisorReportView":
      militaryAdvisorReportViewView(); break;
    case "militaryAdvisorCombatReports":
      militaryAdvisorCombatReportsView(); break;
    case "militaryAdvisorMilitaryMovements":
      militaryAdvisorMilitaryMovementsView(); break;
    case "plunder": plunderView(); break;
    case "Espionage":
    case "safehouse": safehouseView(); break;
    case "academy": academyView(); // fall-through:
    case "researchAdvisor":
      var research = $X('//div[@class="researchName"]/a');
      if (research)
        config.setServer("research", research.title);
      config.setServer("researchDone", projectCompletion("researchCountDown"));
      break;
  }
  title();

  var upgradeDiv = $("upgradeCountDown");
  var buildDiv = $("buildCountDown");
  projectCompletion(upgradeDiv, "time")
  projectCompletion(buildDiv);
  projectHaveResourcesToUpgrade();

  var queued;
  if ((queued = (location.hash||"").match("#q:(.*)")))
    reallyUpgrade(queued[1]);
  processQueue(!queued);
  document.addEventListener("click", changeQueue, true);

  var research = config.getServer("research", "");
  if (research) {
    var a = document.createElement("a");
    a.href = urlTo("academy");

    var tech = techinfo(research);
    a.textContent = lang[researching] +": "+ research;
    a.title = tech.does +" ("+ tech.points + " points)";
    var done = config.getServer("researchDone");
    if (done)
      a.title += resolveTime((done-Date.now()) / 1e3);
    chemin.appendChild(a);
    chemin.appendChild(createBr());
  }

  improveTopPanel();
  if ({ city: 1, island: 1 }[view])
    unsafeWindow.friends = eval(config.getServer("culturetreaties", "([])"));

  var FIN = new Date();
  langChoice.title = lang[execTime] +": "+ (FIN - DEBUT) +"ms";
}






GM_registerMenuCommand("Ikariam Kronos Tools: Your language", promptLanguage);

function promptLanguage() {
  var help = [];
  for (var id in langs)
    help.push(id+": "+langs[id][language]);
  while (!langs.hasOwnProperty(newLanguage)) {
    var newLanguage = prompt("Ikariam Kronos Tools: " +
                             "Which language do you prefer?\n(" +
                             help.join(", ") + ")", getLanguage());
    if (!newLanguage) return;
    if (langs.hasOwnProperty(newLanguage))
      config.set("language", newLanguage);
  }
  location.reload();
}

function getLanguage() {
  function guess() {
    var guess = navigator.language.replace(/-.*/,"");
    return langs.hasOwnProperty(guess) ? guess : "en";
  }
  return config.get("language", guess());
}

function $(id) {
  return document.getElementById(id);
}

function $x( xpath, root ) {
  var doc = root ? root.evaluate ? root : root.ownerDocument : document, next;
  var got = doc.evaluate( xpath, root||doc, null, 0, null ), result = [];
  switch (got.resultType) {
    case got.STRING_TYPE:
      return got.stringValue;
    case got.NUMBER_TYPE:
      return got.numberValue;
    case got.BOOLEAN_TYPE:
      return got.booleanValue;
    default:
      while (next = got.iterateNext())
        result.push( next );
      return result;
  }
}

function $X( xpath, root ) {
  var got = $x( xpath, root );
  return got instanceof Array ? got[0] : got;
}


function upgradeConfig0() {
  function makeNWO() {
    var obj = { v: 1 };
    for (var name in nwo)
      obj[name] = {};
    return obj;
  }
  var ns = {};
  var nwo = { capital:1, treaties:1, cities:1, islands:1, techs:1, battles:1 };
  var old = config.keys(), key, server, isle, city, tech, r, b, save, junk;
  for (var i = 0; key = old[i]; i++) {
    var value = config.get(save = key);

    // belongs to which server scope?
    if ((server = key.match(/(.*):([^:]+\D[^.])$/))) {
      [junk, key, server] = server;
    } else { // data sanitization; probably drop
      if ("language" == key) {
        ns.config = ns.config || {};
        ns.config[key] = value;
      }
      continue;
    }
    var scope = ns[server] || makeNWO();
    ns[server] = scope;


    // server global stuff first:
    if ((tech = key.match(/^tech(\d+)$/))) {
      [junk, tech] = tech;
      scope.techs[tech] = 1;
      continue;
    }

    if (/^research(|Done)$/.test(key)) {
      scope = scope.techs;
      scope.research = scope.research || {};
    }

    switch (key) {
      case "war":
        scope = scope.battles;
        scope.won = value.won;
        scope.lost = value.lost;
        continue;

      case "cities":
        scope = scope.cities;
        for (var id in value) {
          city = scope[id] = scope[id] || {};
          city.i = value[id].i;
          city.n = value[id].n;
        }
        continue;

      case "capital":		scope.capital = integer(value); continue;
      case "reports":		scope.battles.reports = value; continue;
      case "research":		scope.research.n = value; continue;
      case "researchDone":	scope.research.t = value; continue;
      case "culturetreaties":	scope.treaties.culture = value; continue;
    }


    // island global stuff; only resource levels at this time:
    if ((isle = key.match(/^(.*)\/(\d+)$/))) {
      [junk, r, isle] = isle;
      scope.islands[isle] = scope.islands[isle] || {};
      scope = scope.islands[isle];
      scope[r] = value;
      if ("w" != r)
        scope.r = r;
      continue;
    }


    // the rest; city local stuff:
    if (!(city = key.match(/^(.*):(\d+)$/)))
      continue;
    [junk, key, city] = city;

    city = scope.cities[city] = scope.cities[city] || {};

    if ((b = key.match(/^(building|posbldg)(\d+)$/))) {
      [junk, key, b] = b;
      if (!city.l) city.l = [];
      if (!city.p) city.p = [];
      if ("building" == key)
        city.l[b] = value;
      else
        city.p[b] = value;
      continue;
    }

    switch (key) {
      case "q":		city.q = eval(value); continue;
      case "r":		city.r = value; continue; // temporary hack
      case "gold":	city.g = value; continue;
      case "build":	city.t = value; continue;
      case "buildurl":	city.u = value; continue;

      default:
        continue;

      case "wine":		b = buildingIDs.tavern; break;
      case "culture":		b = buildingIDs.museum; break;
      case "researchers":	b = buildingIDs.academy; break;
    }
    if (!city.x) city.x = {};
    city.x[b] = integer(value);
  }
  return ns;
}

/*
s10.org: {
  techs: {all tech id:s we have},
         .research: {
           i: 2090,
           n: "Helping hands",
           t: 1207648486127
         },
  battles: {
    won: 113,
   lost: 8,
reports: {
      BID: {
        t:1207175100000, w:1, l:{g:136, W:59}, c:38714, a:attackingCity?},
      }
  },
  cities: {
    4711: {
      n: name,
      i: iID,
      g: gold net income,
      t: completionTime,
      u: buildURL,
      l: [ lvl0, ...], // building level
      p: [ pos0, ...], // building position
      q: [ bID, ...], // buildings sceduled to be built
      x: { bID:building-special - tavern: wine level; academy: scientists,
           r: resourceWorkers, w: woodWorkers },
      b: { bID:time busy to }
    }, ...
  }
}
*/

// config.get() and config.set() store config data in (near-)json in prefs.js.
var config = (function(data) {
  function get(name, value) {
    return data.hasOwnProperty(name) ? data[name] : value;
  }
  function getCity(name, value, id) {
    return getServer(name +":"+ (id || cityID()), value);
  }
  function getIsle(name, value, id) {
    return getServer(name +"/"+ (id || cityID()), value);
  }
  function getServer(name, value) {
    return get(name +":"+ location.hostname, value);
  }
  function set(name, value) {
    if (value === undefined)
      delete data[name];
    else
      data[name] = value;
    //console.count("set");
    GM_setValue("config", uneval(data));
    return value;
  }
  function setCity(name, value, id) {
    return setServer(name +":"+ (id || cityID()), value);
  }
  function setIsle(name, value, id) {
    return setServer(name +"/"+ (id || islandID()), value);
  }
  function setServer(name, value) {
    return set(name +":"+ location.hostname, value);
  }
  function remCity(name) {
    return remServer(name +":"+ cityID());
  }
  function remIsle(name) {
    return remServer(name +"/"+ islandID());
  }
  function remServer(name) {
    return remove(name +":"+ location.hostname);
  }
  function keys(re) {
    re = re || /./;
    var list = [];
    for (var id in data)
      if (data.hasOwnProperty(id) && re.test(id))
        list.push(id);
    return list;
  }
  function remove(id) {
    if (/function|object/.test(typeof id)) {
      var value = [], re = id;
      for (id in data)
        if (data.hasOwnProperty(id) && id.test(re)) {
          value.push(data[id]);
          delete data[id];
        }
    } else {
      value = data[id];
      delete data[id];
    }
    return value;
  }
  return { get:get, set:set, remove:remove, keys:keys,
           setCity:setCity, getCity:getCity, remCity:remCity,
           setIsle:setIsle, getIsle:getIsle, remIsle:remIsle,
           setServer:setServer, getServer:getServer, remServer:remServer };
})(eval(GM_getValue("config", "({})")));

function bind(fn, self) {
  var args = [].slice.call(arguments, 2);
  return function() {
    fn.apply(self, args.concat([].slice.call(arguments)));
  };
}

function isNull(n) { return null === n; }
function isArray(a) { return a && a.hasOwnProperty("length"); }
function isString(s) { return "string" == typeof s; }
function isNumber(n) { return "number" == typeof n; }
function isObject(o) { return "object" == typeof o; }
function isBoolean(b) { return "boolean" == typeof b; }
function isDefined(v) { return "undefined" != typeof v; }
function isFunction(f) { return "function" == typeof f; }
function isUndefined(u) { return "undefined" == typeof u; }

function rmNode(node) {
  node && node.parentNode && node.parentNode.removeChild(node);
}

function hide(node) {
  if (node) return node.style.display = "none";
}

function show(node) {
  if (node) return node.style.display = "block";
}

function hideshow(node, nodes) {
  function listen(on) {
    on.addEventListener("mouseover", function(){ show(node); }, false);
    on.addEventListener("mouseout",  function(){ hide(node); }, false);
  }
  nodes = nodes || [node];
  nodes.forEach(listen);
}

lang = langs[getLanguage()];

//prompt(1, upgradeConfig0().toSource());
principal(); // Appel de la fonction principal.
