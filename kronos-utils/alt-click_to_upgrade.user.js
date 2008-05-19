// ==UserScript==
// @name           Ikariam: alt-click to upgrade building
// @namespace      ecmanaut.googlecode.com
// @description    Lets you alt-click buildings in Ikariam to upgrade them.
// @require        http://ecmanaut.googlecode.com/svn/trunk/lib/gm/$x$X.js
// @include        http://s*.ikariam.tld/*
// ==/UserScript==

var buildingIDs = {
  townHall: 0, townhall: 0, port: 3, academy: 4, shipyard: 5, barracks: 6,
  warehouse: 7, wall: 8, tavern: 9, museum: 10, palace: 11, embassy: 12,
  branchOffice: 13, "workshop-army": 15, workshop: 15, "workshop-fleet": 15,
  safehouse: 16, palaceColony: 17
};

document.body.addEventListener("click", upgradep, true);

function upgradep(e) {
  if (!e.altKey) return;
  var b = buildingID(e.target);
  if ("undefined" == typeof b) return;
  e.preventDefault();
  e.stopPropagation();
  //console.log("Upgrading building "+ b);
  unsafeWindow.upgrade(b);
}

function buildingID(a) {
  if ("number" == typeof a) return a;
  if ("string" != typeof a) {
    a = $X('ancestor-or-self::*[(@id and @class) or (name() = "BODY")][1]', a);
    a = a == document.body ? a.id : a.className.split(" ")[0];
  }
  return buildingIDs[a];
}

function buildingClass(b) {
  for (var n in buildingIDs)
    if (buildingIDs[n] == b)
      return n;
}

function buildingLink(b) {
  if ("number" == typeof b) b = buildingClass(b);
  var a = $X('//*[@class="'+ b +'"]/a[@title]');
  if (!a) throw (new Error("Found no building "+ b));
  return a;
}

function buildingLevel(b) {
  try {
    var a = buildingLink(b);
    return parseInt(a.title.match(/\d+/)[0], 10);
  } catch (e if e.message.match(/Found no building/)) {
    return $X('id("upgradeForm")/input[@name="level"]').value;
  }
}

function buildingPosition(b) {
  try {
    var a = buildingLink(b);
    var id = $X('ancestor-or-self::*[@id][1]', a).id;
    return id.match(/\d+/)[0];
  } catch (e if e.message.match(/Found no building/)) {
    return urlParse("position");
  }
}

function urlParse(param, url) {
  if (!url) url = location.search || "";
  var keys = {};
  url.replace(/([^=&?]+)=([^&]*)/g, function(m, key, value) {
    keys[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return param ? keys[param] : keys;
}

function cityID(b) {
  try {
    var a = buildingLink(b);
  } catch (e if e.message.match(/Found no building/)) {
    var a = $X('id("breadcrumbs")/a[@class="city"]');
  }
  return urlParse("id", a.search);
}

// ancestor-or-self::*[@id="buildingUpgrade"]

unsafeWindow.upgrade = function upgrade(b, l, p, c) {
  if ("undefined" == typeof l) l = buildingLevel(b);
  if ("undefined" == typeof p) p = buildingPosition(b);
  if ("undefined" == typeof c) c = cityID(b);
  //if (confirm("Upgrade building "+i+":"+b+"@"+p+" from level "+l+"?"))
  post("/index.php", { action: "CityScreen", function: "upgradeBuilding",
       id: c, position: p, level: l });
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
