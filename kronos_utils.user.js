// ==UserScript==
// @name           Kronos Utils
// @author         Merwin
// @email          merwinkronos@gmail.com
// @namespace      Kronos
// @description    Divers petits utilitaires.
// @include        http://*.ikariam.*/*
// @exclude        http://board.ikariam.*/
// ==/UserScript==

/*-------------------------------------
Propriétés du script
--------------------------------------*/
var DEBUT = new Date();

// En fonction du language du naviguateur on va utiliser un langage associé.
var language = 0, finished = 1, langUsed = 11, execTime = 12, wood = 14;
var researching = 16;
var langs = {
  "fr": ["Français", " Fini à ", "Fermer", "Upgrader plus tard.",
         "File de construction", "Ajouter un bâtiment.", "Construire dans",
         "heures", "minutes et", "secondes",
         "valider", "Langue utilisée", "Temps d'exécution",
         "Pas de bâtiment en attente.", "Bois", "Luxe",
         "Recherches"],
  "en": ["English", " Finished ", "Close", "Upgrade later.",
         "Building list", "Add building.", "Build at",
         "hours", "minutes and", "seconds",
         "confirm", "Language used", "Time of execution",
         "No building in waiting.", "Wood", "Luxe",
         "Researching"],
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
  // By Johan Sundström:
  "sv": ["Svenska", " Färdigt ", "Stäng", "Uppgradera senare",
         "Byggnadslista", "Lägg till byggnad", "Bygg klockan",
         "timmar", "minuter och", "sekunder",
         "bekräfta", "Språk", "Exekveringstid",
         "Inga byggnader väntar.", "Trä", "Lyx",
         "Forskning"]
}, lang = langs[getLanguage()];
var regex = /Terrain|construire/;

// en fonction de l'url on prend les regex(dépend de la langue du site).
if (/org$/.test(location.hostname))
  regex = /Free|build/;
if (/com.pt$/.test(location.hostname))
  regex = /Livre|construir/;

var name = "Kronos";
var version = " 0.4";
/*-------------------------------------
Création de div, br, link etc...
-------------------------------------*/

function url(query) {
  return location.href.replace(/\?.*/, query||"");
}

function valueRecupJS(nameValue) {
  if ($("cityResources").getElementsByTagName("script")[0]) {
    var text = $("cityResources").getElementsByTagName("script")[0].innerHTML;
    text = text.substr(text.indexOf(nameValue+" = "),
                       text.length);
    text = text.substr(nameValue.length+3,
                       text.indexOf(";")-(nameValue.length+3));
    return text;
  }
}

function recupNameRess() {
  var _a = $("cityResources");
  if (_a.getElementsByTagName("script")[0]) {
    var text = _a.getElementsByTagName("script")[0].innerHTML;
    text = text.substr(text.indexOf("currTradegood"), text.length);
    text = text.substr(text.indexOf("value_"),
                       text.indexOf(".innerHTML") -
                       text.indexOf("value_") - 2);
    for (var i = 0; i < _a.getElementsByTagName("li").length; i++) {
      var _b = _a.getElementsByTagName("li")[i].getElementsByTagName("span");
      if (_b[1].id == text){
        return _b[0].textContent.replace(/:\s*/, "");
      }
    }
  }
}

// on récupére une des valeurs get d'une url(son nom est le param.
function urlParse(param, url) {
  if (!url) url = location.search; // On récupére l'url du site.
  var keys = {};
  url.replace(/([^=&?]+)=([^&]*)/g, function(m, key, value) {
    keys[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return param ? keys[param] : keys;
}

function createNode(id, classN, html, tag) { // On ajoute un div
  var div = document.createElement(tag||"div"); // on crée le div
  if (id) div.id = id; // on lui ajoute l'id
  if (classN) div.className = classN; // le class
  if (html)
    div.appendChild(document.createTextNode(html)); // on lui ajoute du texte
  return div;
}

function createLink(nom, href) {
  var lien = document.createElement('a');//création d'un lien
  lien.setAttribute('href', href);//On ajoute le href
  lien.appendChild(document.createTextNode(nom));//On ajoute le text.

  return lien;
}

function link(href) {
  location.href = href;
}

function createBr() { // fonction de création saut de ligne
  return document.createElement("br");
}

function levelBat() { // Ajout d'un du level sur les batiments.
  GM_addStyle(<><![CDATA[

.pointsLevelBat {
  background-color: #FDF8C1;
  -moz-border-radius: 1em;
  border: 2px solid #918B69;
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
  margin-top: 10px;
  margin-left: 25px;
  z-index: 50;
}

]]></>.toString());

  var divContent = $("locations");
  if (divContent) {
    var href, node, title;
    for (var i = 0; i < 15; i++) {
      node = document.getElementById("position"+i).getElementsByTagName("a")[0];
      title = node.title;
      href = node.href;
      if (!regex.test(title)) {
        var num = /[0-9]*$/.exec(title);
        var href = node.href;
        div = createNode("pointLevelBat" + i, "pointsLevelBat", num);
        document.getElementById("position"+i).appendChild(div);
        div.setAttribute("lien", href);
        div.addEventListener("click",
                             function() { link(this.getAttribute("lien")); },
                             true);
        //$("Kronos").appendChild(document.createTextNode(href));
        div.style.visibility = "visible";
        div.title = node.title;
      }
    }
  }
}

function levelTown() {
  function level(li) {
    var level = li.className.match(/\d+/)[0];
    var name = $X('a[@onclick]/span/text()[preceding-sibling::span]', li);
    name.nodeValue = level +":"+ name.nodeValue;
  }
  $x('//li[starts-with(@class,"cityLocation city level")]').forEach(level);
}

function citizens() {
  function factor(what, unit, times) {
    var node = $X('//li[@class="'+ what +'"]/div[@class="amount"]');
    if (node) {
      var count = parseInt(node.innerHTML.match(/\d+/)[0], 10);
      var sum = times ? Math.floor(times * count) : "";
      if (sum > 0) sum = "+"+ sum;
      unit.@style = "margin-bottom: -5px;";
      node.innerHTML += (sum ? " \xA0 "+ sum : " ") + (unit.toXMLString());
    }
  }

  // wine:25x20, marble:25x19, glass:23x18, sulfur:25x19
  var iconBase = "skin/resources/icon_", goods = recupNameRess().toLowerCase();
  var w = goods == "glass" ? 23 : 25, h = { wine: 20, glass: 18 }[goods] || 19;
  var luxe = <img src={iconBase + goods +".gif"} width={w} height={h}/>;
  var wood = <img src="skin/resources/icon_wood.gif" width="25" height="20"/>;
  var gold = <img src="skin/resources/icon_gold.gif" width="17" height="19"/>;
  var bulb = <img src="skin/layout/bulb-on.gif" width="14" height="21"/>;

  factor("citizens", gold, 4);
  factor("woodWorkers", wood);
  factor("luxuryWorkers", luxe, 0.5);
  factor("scientists", bulb);
  factor("scientists", gold, -8);
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

function resolveTime(seconds) { // Crée le temps de fin.
  function z(t) { return (t < 10 ? "0" : "") + t; }
  var t = getServerTime(seconds);
  var h = z(t.getHours());
  var m = z(t.getMinutes());
  var s = z(t.getSeconds())
  return lang[finished] + h + ":" + m + ":" + s;
}

function secondsToHours(bySeconds) {
  if (!isNaN(bySeconds)) {
    var byHour = Math.ceil(bySeconds*3600);
    return byHour;
  }
}

// input: "Nd Nh Nm Ns", output: number of seconds left
function parseTime(t) {
  function parse(what, mult) {
    var count = t.match(new RegExp("(\\d+)" + locale.timeunits.short[what]));
    if (count)
      return parseInt(count[1], 10) * mult;
    return 0;
  }
  var locale = unsafeWindow.LocalizationStrings;
  var units = { day: 86400, hour: 3600, minute: 60, second: 1 };
  var s = 0;
  for (var unit in units)
    s += parse(unit, units[unit]);
  return s;
}

function projectCompletion(id, className) {
  var node = $(id);
  if (node) {
    console.log("T: %x", $("servertime").textContent);
    console.log("L: %x", node.textContent);
    console.log("D: %x", parseTime(node.textContent));
    console.log("F: %x", resolveTime(parseTime(node.textContent)));
    var done = resolveTime(parseTime(node.textContent));
    var div = createNode("", className, done, node.nodeName.toLowerCase());
    node.parentNode.insertBefore(div, node.nextSibling);
  }
}

/*---------------------
Ajout du panel dans le menu
---------------------*/
function panelInfo() { // Ajoute un element en plus dans le menu.
  var panel = createNode("", "dynamic");

  var titre = document.createElement("h3");
  titre.setAttribute("class", "header");
  titre.appendChild(document.createTextNode(name + version));

  var corps = createNode("Kronos", "content");
  var footer = createNode("", "footer");

  panel.appendChild(titre);
  panel.appendChild(corps);
  panel.appendChild(footer);

  if ($("container2")) {
    $("container2").insertBefore(panel, $("mainview"));
  }
  return corps;
}

function idIleRecup() {
  // récupération de l'id de la ville :
  if ($("cityNav")) {
    var text = $("cityNav").innerHTML;
    var debut = text.indexOf("view=island&amp;id=");
    if (debut != -1) {
      var fin = text.length;
      text = text.substr(debut, fin);

      var fin = text.indexOf('" tabindex');
      var href = text.substr(19, fin - 19);
    }
    else
      var href;
    return href;
  }
}

function getCityId() {
  return $X('//li[@class="viewCity"]/a').href.replace(/.*[?&]id=(\d+).*/, "$1");
}

/*------------------------
   / \
  / ! \    Function Principal.
 -------
------------------------*/

function principal() {
  recupNameRess();
  var luxeByHours = secondsToHours(valueRecupJS("startTradegoodDelta"));
  var woodByHours = secondsToHours(valueRecupJS("startResourcesDelta"));
  var nameLuxe = recupNameRess();

  var chemin = panelInfo();
  var idIle = idIleRecup();

  try {
    switch (urlParse("view") || urlParse("action")) {
      case "CityScreen": // &function=build&id=...&position=4&building=13
      case "city": levelBat(); projectCompletion("cityCountdown"); break;
      case "island": levelTown(); break;
      case "townHall": citizens(); break;
      case "academy":
      case "researchAdvisor":
        var research = $X('//div[@class="researchName"]/a');
        if (research)
          GM_setValue("research", research.title);
        projectCompletion("researchCountDown"); break;
    }
    projectCompletion("upgradeCountDown", "time");
  } catch(e) {}

  var list = document.createElement("div"); // List des batiments.
  var add = function(node) {
    list.appendChild(node);
  };

  [createLink(lang[wood] + ": +" + woodByHours,
              url("?view=resource&type=resource&id="+idIle)),
   createBr(),
   createLink(nameLuxe + ": +" +luxeByHours,
              url("?view=tradegood&type=tradegood&id="+idIle))].forEach(add);
  chemin.appendChild(list);

  GM_addStyle(<><![CDATA[

.popup {
  z-index: 1000;
  position: absolute;
  top: 30%;
  left: 35%;
  width: 400px;
  height: 250px;
  background-color: #DBB562;
  border: 3px solid #CE9928;
}

]]></>.toString());

  var research = GM_getValue("research", "");
  if (research) {
    var a = document.createElement("a");
    a.href = url("?view=academy&id=" + getCityId());
    a.textContent = lang[researching] + ": " + research;
    chemin.appendChild(a);
    chemin.appendChild(createBr());
  }

  var langPref = document.createTextNode(lang[langUsed] +": "+ lang[language]);
  var langChoice = document.createElement("a");
  langChoice.href = "#";
  langChoice.appendChild(langPref);
  langChoice.addEventListener("click", promptLanguage, false);
  chemin.appendChild(langChoice);

  var cityNav = $('cityNav');
  if (cityNav) {
    cityNav.addEventListener("click", function(e) {
      if (e.target.id == "cityNav")
        location.href = url("?view=townHall&id="+ getCityId() +"&position=0");
    }, false);
  }

  var FIN = new Date();
  chemin.appendChild(createBr());
  chemin.appendChild(document.createTextNode(lang[execTime] +": "+
                                             (FIN - DEBUT) + "ms"));
  //$("Kronos").appendChild(document.createTextNode(myLanguage));
}

principal(); //Appel de la fonction principal.






GM_registerMenuCommand("Ikariam Kronos Tools: Your language", promptLanguage);

function promptLanguage() {
  var help = [];
  for (var id in langs)
    help.push(id+": "+langs[id][language]);
  while (!langs.hasOwnProperty(newLanguage)) {
    var newLanguage = prompt("Ikariam Kronos Tools: " +
                             "Which language do you prefer?\n(" +
                             help.join(", ") + ")", getLanguage());
    if (langs.hasOwnProperty(newLanguage))
      GM_setValue("KronosLanguage_", newLanguage);
  }
  location.reload();
}

function getLanguage() {
  function guess() {
    var guess = navigator.language.replace(/-.*/,"");
    return langs.hasOwnProperty(guess) ? guess : "en";
  }
  return GM_getValue("KronosLanguage_", guess());
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
