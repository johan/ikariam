// ==UserScript==
// @name           Kronos Utils
// @namespace      Kronos
// @description    Tons of UI upgrades and features for Ikariam.
// @include        http://ikariam.tld/
// @include        http://s*.ikariam.tld/*
// @exclude        http://board.ikariam.*/
// @exclude        http://*.ikariam.*/index.php?view=renameCity*
// @require        http://ecmanaut.googlecode.com/svn/trunk/lib/gm/wget.js
// @resource woody header.png
// @resource att-r arrow-right.png
// @resource att-l arrow-left.png
// @resource buy-r arrow-right-buy.png
// @resource buy-l arrow-left-buy.png
// @resource sel-r arrow-right-sell.png
// @resource sel-l arrow-left-sell.png
// @resource trp-r arrow-right-trp.png
// @resource trp-l arrow-left-trp.png
// @resource tsp-r arrow-right-tsp.png
// @resource tsp-l arrow-left-tsp.png
// @resource col-r arrow-right-col.png
// @resource col-l arrow-left-col.png
// @resource   css kronos.css
// @require        i18n.js
// @require        gamedata.js
// @require        support.js
// @require        config.js
// @require        memory.js
// ==/UserScript==

var version = "0.5", lang, scientists;
if (location.hostname.match(/^s\d+\./))
  init();
else
  login();

function init() {
  try { upgradeConfig(); }
  catch(e if e instanceof ReferenceError) {
    if (confirm("Kronos Utils requires Greasemonkey 0.8. Click OK for an " +
                "installation tutorial."))
      location.href = "http://corentin.jarnoux.free.fr/kronosutils/" +
        "?topic=2.0#post_requirements";
    return;
  }
  if (innerWidth > 1003) document.body.style.overflowX = "hidden"; // !scrollbar
  css(GM_getResourceText("css"));
  lang = langs[getLanguage()];

  var view = urlParse("view");
  var action = urlParse("action");

  var help = $X('id("buildingUpgrade")/h3/a[@class="help"]');
  if (help) {
    linkTo(urlTo("building", buildingID(urlParse("view"))), help);
    var building = buildingID(view);
    if (isDefined(building)) {
      var level = $X('id("buildingUpgrade")//div[@class="buildingLevel"]');
      if (level)
        config.setCity(["l", building], number(level));
    }
  }

  switch (view || action) {
    case "tavern": tavernView(); break;
    case "resource":  // fall-through:
    case "tradegood": resourceView(); // fall-through:
    case "deployment": // fall-through:
    case "takeOffer": scrollWheelable(); break;
    case "transport": scrollWheelable(); evenShips(); break;
    case "loginAvatar":// &function=login
    case "CityScreen": // &function=build&id=...&position=4&building=13
    case "city": cityView(); break;
    case "finances": financesView(); break;
    case "buildingDetail": buildingDetailView(); break;
    case "port": portView(); break;
    case "island": islandView(); break;
    case "worldmap_iso": worldmap_isoView(); break;
    case "townHall": townHallView(); break;
    case "culturalPossessions_assign": scrollWheelable(); // fall-through:
    case "museum": museumView(); break;
    case "fleetGarrisonEdit": // fall-through:
    case "armyGarrisonEdit": dontSubmitZero(); break;
    case "shipyard": shipyardView(); break;
    case "barracks": barracksView(); break;
    case "workshop-army": workshopView("troops"); break;
    case "workshop-fleet": workshopView("ships"); break;
    case "buildingGround": buildingGroundView(); break;
    case "branchOffice": branchOfficeView(); break;
    case "researchOverview": researchOverviewView(); break;
    case "colonize": colonizeView(); break;
    case "blockade": blockadeView(); break;
    case "deployment": deploymentView(); break;
    case "merchantNavy": merchantNavyView(); break;
    case "militaryAdvisorReportView":
      militaryAdvisorReportViewView(); break;
    case "militaryAdvisorCombatReports":
      militaryAdvisorCombatReportsView(); break;
    case "militaryAdvisorMilitaryMovements":
      militaryAdvisorMilitaryMovementsView(); break;
    case "tradeAdvisor": tradeAdvisorView(); break;
    case "researchAdvisor": researchAdvisorView(); break;
    case "diplomacyAdvisor": diplomacyAdvisorView(); break;
    case "plunder": plunderView(); break;
    case "safehouse": safehouseView(); break;
    case "Espionage":
    case "safehouseReports": safehouseReportsView(); break;
    case "academy": academyView(); break;
    case "options": optionsView(); break;
  }

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

  improveTopPanel();
  if ({ city: 1, island: 1 }[view])
    unsafeWindow.friends = config.getServer("treaties", []);

  if (!config.get("kronosMenu")) return title();
  var langChoice = panelInfo();
  title();
  langChoice.title = lang.execTime +": "+ (Date.now() - DEBUT) +"ms";
}

function login() {
  var uni = $("universe");
  if (!uni || location.pathname != "/" || !document.referrer ||
      !document.referrer.indexOf(location.href))
    return;
  var site = /^http:..s(\d+)\.ikariam/.exec(document.referrer);
  if (site)
    uni.selectedIndex = integer(site[1]) - 1;
}

function url(query) {
  return (location.search || "").replace(/(\?.*)?$/, query||"");
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

function goto(href) {
  //console.log("aborted goto %x", href); return;
  location.href = href.match(/\?/) ? href : urlTo(href);
}

function gotoCity(url, id) {
  // console.log("aborted gotoCity(%x, %x)", url, id); return;
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
  function changedFilters(e) {
    function filterRow(tr) {
      var values = $x('td[position() > 3 and position() < 12]', tr).map(value);
      var show = visiblep.apply(this, values);
      if (0 && !zzz++) {
        console.log(unsafeWindow.names = names);
        console.log(unsafeWindow.values = values);
        console.log(show);
      }
      tr.className = tr.className.replace(/( not-filtered)?$/, show ?
                                           " not-filtered" : "");
    }
    function value(td, n) {
      var value, time = 6 == n;
      if (time)
        value = td.getAttribute("time");
      else
        value = td.firstChild;
      return integer(value || "0");
      return !value && n > 5 ? -Infinity : value;
    }
    var tests = [], names = [];
    for (var i = 0; i < filters.length; i++) {
      var f = filters[i];
      var time = "vT" == f.id;
      var bash = "vbash" == f.id;
      var v = time ? parseTime(f.value) : integer(f.value || "0");
      if (!v && (time || bash)) v = "Infinity";
      var n = f.id.replace(/^v/, "");
      var op = $("op"+ n).textContent == "≤" ? "<=" : ">=";
      var check = $(f.id.slice(1));
      if (check) {
        if (v) {
          if (!check.checked)
            check.setAttribute("auto", "yep");
          check.checked = true;
        } else if (check.getAttribute("auto")) {
          check.checked = false;
          check.removeAttribute("auto");
        }
      }
      if (!v) f.value = "";
      var expr = "("+ n + op + v +")";
      tests.push(expr);
      names.push(n);
    }
    //console.log("return "+ tests.join(" && ") +";");

    var visiblep = new Function(names, "return "+ tests.join(" && ") +";");
    $x('tr[starts-with(@class,"loot")]', body).forEach(filterRow);
  }

  function listen(input) {
    input.addEventListener("click", expensive(changedFilters), false);
    input.addEventListener("keyup", function(e) { click(e.target); }, false);
  }

  function filterView(e) {
    if (e) {
      var node = e.target;
      var text = $("v"+ node.id);
      if (text) {
        if (node.checked) {
          if (!text.value) {
            text.value = "1";
            text.setAttribute("auto", "yep");
            var changed = true;
          }
        } else {
          if (text.getAttribute("auto")) {
            text.removeAttribute("auto");
            text.value = "";
            changed = true;
          }
        }
        if (changed)
          changedFilters();
      }
    }
    var visible = show.filter(function(x) { return x.checked; });
    //if ((hide.disabled = 0 == visible.length)) return;
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
      var t = td.getAttribute("time") || 1000000;
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
          td.setAttribute("time", Math.round(t)+"");
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
    tr.className = (tr.className||"").replace(/^.*( non-filtered)?$/,
                                              has.join(" ") + "$1");
  }

  table.id = "loot-report";
  var override = "#container #mainview #troopsOverview #finishedReports ";
  var hideMost = "#loot-report tr.loot { display:none; } " + override +
    "#loot-report tr.loot.not-filtered { display: table-row }";
  var hide = css("", true);
  var body = $X('tbody', table);
  var head = body.insertRow(0);
  var only = body.insertRow(0);
  var cols = [, , , "g", "w", "W", "M", "C", "S", "T", "#"];
  var hits = {}; // indexed on city id, values are attacks today
  var show = [];
  var title = [, , "When",
               "$gold", "$wood", "$wine", "$marble", "$glass", "$sulfur",
               "Time", "#", "City"];
  for (var i = 0; i < 13; i++) {
    var r = cols[i];
    var t = title[i] || "";
    var th = node({ className: r ? "Time" == t ? "": "number" : "",
                    tag: i && i < 12 ? "th" : "td",
                    html: visualResources(t),
                    append: head });
    if (1 == i) th.style.minWidth = "25px";
    if (2 == i) th.style.minWidth = "68px";
    if (11 == i) th.style.width = "400px";
    if (r) { // only show filter for cols with relevant data
      var id = "#" == r ? "bash" : r;
      var op = /[T#]/.test(r) ? "≤" : "≥"; // config.getCity(...+ r, def);
      var val = ""; // config.getCity(...+ r, "");
      var html = <><span id={"op"+ id}>{op}</span><input
                         id={"v"+ id} value={val} type="text"/></>;
      var filter = node({ tag: "th", className: "filter", html: html,
                          append: only });
      only[r] = $X('input', filter);
    } else {
      only.insertCell(i);
    }
    if ("When" == t) clickTo(th, sortByWhen);
    if ("City" == t) clickTo(th, sortByCity);
    if ("Time" == t) { clickTo(th, sortByDistance); continue; }
    if ("#" == t || !r) continue;

    var check = node({ tag: "input", type: "checkbox", id: r, prepend: th });
    show.push(check);

    //var img = $X('img', th);
    clickTo(th, sortByLoot(i), 'not(self::input)');
    //clickTo(check, filterView); -- (preventDefault:s)
    check.addEventListener("click", filterView, false);
    dblClickTo(th, filter(check), "", true);
  }
  var filters = cols.filter(I).map(function(r) { return only[r]; });
  scrollWheelable(filters);
  filters.forEach(listen);

  var yesterday = Date.now() - (25 * 36e5);
  for (var i = 0; r = reports[i]; i++) {
    var recent = r.t > yesterday;
    if (recent && r.w && r.c)
      hits[r.c] = 1 + (hits[r.c] || 0);
  }
  reports.forEach(showLoot);
  unsafeWindow.markAll = safeMarkAll;

  changedFilters();
  filterView();

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

function tradeAdvisorView() {
  pruneTodayDates('id("inboxCity")/tbody/tr/td[@class="date"]');
}

function researchAdvisorView() {
  function learnTech(a) {
    var name = a.textContent.match(/['"]([^'"]+)['"]/);
    if (!name) return;
    name = name[1];

    var tech = techs.filter(function(t) { return t.name == name; });
    if (!tech.length) return;
    tech = tech[0];

    config.setServer(["techs", tech.id], 1);

    a.title = a.textContent;
    a.href = urlTo("research", tech.id);
    a.innerHTML = name.bold() +" — "+ tech.does;
    // tech.does[0].toLowerCase() + tech.does.slice(1);
  }

  var rp = $X('id("breadcrumbs")/following::div[1]/div[@class="content"]/p[2]');
  if (rp) {
    rp = integer(rp.textContent.split("/")[0]);
    config.setServer("techs.points", { count: rp, at: Date.now() });
  }
  updateCurrentResearch();
  var techs = techinfo();
  $x('id("inboxResearch")/tbody/tr/td[@class="text"]/a').forEach(learnTech);
}

function diplomacyAdvisorView() {
  function span(td) { td.setAttribute("colspan", "8"); }
  function showIslandInfo(a) {
    var td = a.parentNode, x, y, t, id = urlParse("id", a.search);
    if ("#" == a.getAttribute("href")) id = 0;
    var t = /\[(\d+):(\d+)\]$/.exec(trim(a.textContent || "")) || "";
    if (t) {
      [t, x, y] = t;
      t = travelTime(x, y);
      t = t && secsToDHMS(t);
    }
    node({ tag: "td", className: "tt", text: t, before: td });
    var r = id ? config.getIsle("r", "x", id) : "x";
    var R = id ? config.getIsle("R", "",  id) : "";
    node({ tag: "td", className: "tradegood " + r, title: R, after: td });
  }

  //[contains(translate(.,"0123456789:",""),"[]")]').
  var body = $X('id("messages")//tbody[tr[count(th) = 6]]');
  var date = $X('tr[1]/th[6]', body);
  var town = $X('tr[1]/th[5]', body);
  node({ tag: "th", className: "tradegood", before: date });
  node({ tag: "th", className: "tt", text: lang.travelTime, before: town });
  $x('tr/td[5]/a', body).forEach(showIslandInfo);
  $x('tr/td[@colspan="6"]', body).forEach(span);
}

function militaryAdvisorCombatReportsView() {
  function read(e) {
    if ((e.keyCode||e.charCode) != "-".charCodeAt()) return;
    removeEventListener("keypress", read, false);
    proceed();
  }

  function proceed() {
    var a = my.unknowns.pop();
    if (a) {
      setTimeout(wget, Math.random()*3e3, a.href, proceed, true, false);
      a.style.opacity = "0.5";
    }
    console.log(my.unknowns.length + 1);
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

  var my = militaryAdvisorCombatReportsView; my.unknowns = [];
  var table = $X('id("finishedReports")/table[@class="operations"]');
  if (!table) return;
  var history = config.getServer("battles", { won: 0, lost: 0 });
  var allreps = config.getServer("battles.reports", {});
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

    if (!r.c) my.unknowns.push(a);
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
      node({ tag: <a href={urlTo("island", { island: city[r.c].i, city: r.c })}
                     rel={"i" + r.c}>{name}</a>, after: a });
    }
  }
  var header = $X('id("troopsOverview")/div/h3');
  var loot = node({ tag: "a", text: lang.showLoot,
                    style: { marginLeft: "8px" }, append: header });
  clickTo(loot, function() { rm(loot); makeLootTable(table, rows); });
  if (my.unknowns.length)
    addEventListener("keypress", read, false);

  config.setServer("battles", history);
  config.setServer("cities", city);
  //config.setServer("reports", allreps);
  //console.log(history.toSource());
  //console.log(allreps.toSource());
}

function militaryAdvisorReportViewView() {
  var loot = parseResources('//td[@class="winner"]/ul[@class="resources"]/li');
  var a = $X('id("battleReportDetail")//a');
  var cities = config.getServer("cities", {});
  var city = parseInt(urlParse("selectCity", a.search));
  var island = parseInt(urlParse("id", a.search));
  var reports = config.getServer("battles.reports", {});
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
  c.i = integer(island);
  config.setServer("cities", cities);
  config.setServer("battles.reports", reports);
  //console.log(cities.toSource());
  //console.log(reports[r].toSource());
}

function plunderView() {
  scrollWheelable();
  dontSubmitZero(2, 'id("selectArmy")//input[@type="submit"]');
}


function currentResources() {
  var inhab = $("value_inhabitants").textContent.split(/\s+/);
  return {
    p: getFreeWorkers(), P: getPopulation(),
    g: integer($("value_gold")), w: integer($("value_wood")),
    W: integer($("value_wine")), M: integer($("value_marble")),
    C: integer($("value_crystal")), S: integer($("value_sulfur"))
  };
}

function addResources(a, b, onlyIterateA) {
  return opResources(a, b, function(a, b) { return a + b; }, onlyIterateA);
}
function subResources(a, b, onlyIterateA) {
  return opResources(a, b, function(a, b) { return a - b; }, onlyIterateA);
}
function mulResources(a, n, op) {
  return opResources(a, n, function(a) { return (op||Math.round)(a * n); }, 1);
}

function opResources(a, b, op, onlyIterateA) {
  //console.log("a: %x, b: %x", a?a.toSource():a, isObject(b)?b.toSource():b);
  //console.log(op.toSource());
  var o = {}, r, A, B;
  for (r in a) {
    if (isNumber(A = a[r]) && (!isObject(b) || isNumber(B = b[r] || 0)))
      o[r] = op(A, B);
  }
  //if (onlyIterateA) console.log("o: %x", o?o.toSource():o);
  if (onlyIterateA) return o;
  for (r in b) {
    if (o.hasOwnProperty(r)) continue;
    if (isNumber(A = a[r] || 0) && isNumber(B = b[r] || 0))
      o[r] = op(A, B);
  }
  //console.log("o: %x", o?o.toSource():o);
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
  var pace = reapingPace.pace;
  if (!pace) {
    // FIXME: This just gives city income; ought to do a pace.G for totals too
    var preciseCityIncome = $("valueWorkCosts") ||
      $X('//li[contains(@class,"incomegold")]/span[@class="value"]');

    var sciCost = 8 - config.getServer("techs.3110", 0); // Letter chute bonus
    var maintenance, gold;
    var computedIncome = getFreeWorkers() * 4 -
      config.getCity(["x", buildingIDs.academy], 0) * sciCost;
    var refCity = referenceCityID();
    var mainCity = mainviewCityID();
    if ((mainCity == refCity) && preciseCityIncome) {
      gold = integer(preciseCityIncome);
      maintenance = computedIncome - gold;
      setMaintenanceCost(maintenance, refCity);
    } else {
      maintenance = maintenanceCost(refCity);
      gold = computedIncome - maintenance;
    }

    reapingPace.pace = pace = {
      g: gold,
      w: secondsToHours(jsVariable("startResourcesDelta"))
    };
    pace[luxuryType()] = secondsToHours(jsVariable("startTradegoodDelta"));

    var wineUse = config.getCity(["x", buildingIDs.tavern], 0);
    if (wineUse)
      pace.W = (pace.W || 0) - wineUse;
  }
  return pace;
}

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

function buildingPosition(b, otherwise, cityID) {
  var p = config.getCity(["p", buildingID(b)], "?", cityID);
  return "?" == p ? otherwise : p;
}

function buildingLevel(b, otherwise, saved, city) {
  b = buildingID(b);
  if (!saved && "city" == urlParse("view")) {
    var div = $("position" + buildingPosition(b));
    var a = $X('a[@title]', div);
    if (a && isUndefined(integer(a.title)))
      a = undefined; // a ghost house we set up to visualize the queue
  }
  if (saved || isUndefined(a))
    b = config.getCity(["l", b], undefined, city);
  else
    b = integer(a.title);
  return isUndefined(b) ? otherwise : b;
}

function buildingLevels() {
  var levels = {};
  for (var name in buildingIDs) {
    var id = buildingIDs[name];
    var level = config.getCity(["l", id], 0);
    if (level)
      levels[id] = level;
  }
  return levels;
}

function buildingCapacity(b, l, warehouse) {
  b = buildingClass(b);
  var c = buildingCapacities[b];
  c = c && c[isDefined(l) ? l : buildingLevel(b, 0)];
  return isDefined(warehouse) ? c && c[warehouse] : c;
}

function buildingExpansionNeeds(b, level) {
  level = isDefined(level) ? level : buildingLevel(b);
  var needs = costs[b = buildingID(b)][level];
  var value = {};
  var factor = 1.00;
  if (config.getServer("techs.2020")) factor -= 0.02; // Pulley
  if (config.getServer("techs.2060")) factor -= 0.04; // Geometry
  if (config.getServer("techs.2100")) factor -= 0.08; // Spirit Level
  for (var r in needs)
    if ("t" == r) // no time discount
      value[r] = needs[r];
    else
      value[r] = Math.floor(needs[r] * factor);
  return value;
}

function haveEnoughToUpgrade(b, level, have) {
  var upgrade = buildingExpansionNeeds(b, level);
  have = have || currentResources();
  for (var resource in upgrade)
    if (resource != "t" && have[resource] < upgrade[resource])
      return false;
  return true;
}

function buildingExtraInfo(div, id, name, level) {
  function annotate(msg) {
    node({ tag: "span", className: "ellipsis", text: msg, append: div,
          style: { position: "relative" }});
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
      var townSize = buildingLevel("townHall", 0);
      annotate(Math.floor(Math.min(1, level / townSize) * level * 10) + "%");
      break;

    case "tavern":
      var wineMax = buildingCapacity(name, level);
      var wineCur = config.getCity(["x", buildingIDs.tavern], 0);
      if (wineCur != wineMax)
        annotate(wineCur +"/"+ wineMax);
      break;

    case "museum":
      var museum = buildingLevel(name) || 0;
      var culture = config.getCity(["x", buildingIDs.museum], 0);
      if (culture != museum)
        annotate(culture +"/"+ museum);
      break;

    case "academy":
      var seats = buildingCapacity(name, level);
      var working = config.getCity(["x", buildingIDs.academy], 0);
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

function annotateBuilding(li, level) {
  var a = $X('a', li);
  if (!a) return;
  $x('div[@class="rounded"]', li).forEach(rm);
  var id = buildingID(a);
  if (isNumber(id) && li.id && isUndefined(level)) {
    config.setCity(["l", id], number(a.title));
    config.setCity(["p", id], number(li.id));
  }
  if ("original" == level) {
    level = buildingLevel(id, 0, "saved");
    a.title = a.title.replace(/\d+/, level);
  } else {
    level = level || number(a.title);
  }
  var div = node({ className: "rounded", text: level, append: li });
  if (haveEnoughToUpgrade(a, level)) {
    div.style.backgroundColor = "#FEFCE8";
    div.style.borderColor = config.get("haveEnough");
  } else {
    div.style.borderColor = config.get("notEnough");
  }
  clickTo(div, a.href);
  div.style.visibility = "visible";
  buildingExtraInfo(div, id, buildingClass(id), level);
  div.title = a.title;
}

function showResourceNeeds(needs, parent, div, top, left) {
  if (div)
    rm(div);
  else
    div = node({ className: "rounded resource-list" });
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
  if (isDefined(left))
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
      hovering.style.borderColor =
        config.get(enough ? "haveEnough" :"notEnough");
      hovering.style.backgroundColor = enough ? "#FEFCE8" : "#FDF8C1";
    } else {
      hide(hovering);
      if (hovering.parentNode)
        annotateBuilding(hovering.parentNode, "original");
    }
  }

  var places = $("locations");
  if (places) {
    var hovering = node({ id: "hovering", className: "rounded resource-list",
                          title: lang.popupInfo, append: $('position0') });
    hide(hovering);
    places.addEventListener("mouseover", hoverHouse, false);
    hovering.addEventListener("DOMMouseScroll", function(e) {
      var li = hovering.parentNode;
      var a = $X('a', li), b = buildingID(a);
      var l = Math.min(Math.max(!b, number(a.title) + (e.detail < 0 ? 1 : -1)),
                       costs[b].length - 1);
      a.title = a.title.replace(/\d+/, l);
      annotateBuilding(li, l);
      e.preventDefault();
      hoverHouse({ target: hovering });
    }, false);
  }

  config.setCity("l", []); // clear old broken config
  var all = $x('id("locations")/li[not(contains(@class,"buildingGround"))]');
  all.forEach(function(li) { annotateBuilding(li); });
}

function worldmap_isoView() {
  function showResources() {
    drawMap();
    var w = unsafeWindow;
    var cx = w.center_x, dim = w.MAXSIZE;
    var cy = w.center_y, mid = w.halfMaxSize;
    for (var i = 0; i < dim; i++)
      for (var j = 0; j < dim; j++) {
        var x = cx + mid - i;
        var y = cy + mid - j;
        var r = resources[x+":"+y] || [];
        var R = r[tradegood];
        var t = $("tradegood_"+ i +"_"+ j);
        t.innerHTML = !R ? "" : <>
          <div class="cities">{R}</div>
          <div class="tradegood wood">
            <div class="cities">{r[wood]}</div>
          </div>
        </>.toXMLString();
      }
    return islands;
  }

  function dropTooltip(x) { x.removeAttribute("title"); }

  function mark(x, y) {
    var v = setMark(x, y);
    travelDistanceBreadcrumbs();
    return v;
  }

  $x('//area[@title]').forEach(dropTooltip);
  $x('id("worldmap")/text()').forEach(rm);
  var resources = {}, tradegood = 0, wood = 1;
  var islands = config.getServer("islands");
  for (var id in islands) {
    var i = islands[id];
    if (i.R)
      resources[i.x+":"+i.y] = [i.R, i.w];
  }
  //var islands = config.get("islands", {});

  var drawMap = unsafeWindow.center_map;
  unsafeWindow.center_map = showResources;

  var setMark = unsafeWindow.mark;
  unsafeWindow.mark = mark;
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

function travelDistanceBreadcrumbs(island) {
  var breadcrumbs = $X('id("breadcrumbs")/span[.//text()[contains(translate' +
                       '(.,"0123456789:",""),"[]")]]'), x, y, t, junk;
  if (breadcrumbs) {
    [junk, x, y] = breadcrumbs.textContent.match(/\[(\d+):(\d+)\]/);
    if (island) {
      config.setIsle("x", x = integer(x), island);
      config.setIsle("y", y = integer(y), island);
    }
    //console.log("isle %x at %x:%y", island, x, y);
    //while (isTextNode(breadcrumbs.lastChild)) rm(breadcrumbs.lastChild);
    if ((t = travelTime(x, y)))
      breadcrumbs.innerHTML += " ("+ secsToDHMS(t) +")";
  }
}

function nextIsland(id) {
  var skip = nonIslands[++id];
  return skip ? id + skip : id;
}

function prevIsland(id) {
  id = integer(id);
  var i = 0;
  while (--i >= -60) {
    var skip = nonIslands[i + id];
    if (skip)
      if (skip == -i)
        return id - skip - 1;
      else
        break;
  }
  return --id > 0 ? id : 5721;
}

function islandView() {
  function nextprev(event) {
    var n = event.charCode || event.keyCode;
    var next = { 37: prevIsland, 39: nextIsland }[n];
    if (next) {
      event.stopPropagation();
      event.preventDefault();
      goto(urlTo("island", next(island)));
    }
  }

  function registerCity(ul) {
    function item(p) {
      var li = $X('li[@class="'+ city[p] +'"]/span/following::text()[1]', ul);
      return li && trim(li.textContent);
    }

    var id = number($X('preceding-sibling::a[contains(@id,"city_")]', ul).id);
    var city = { i: island, n: "name", o: "owner" };
    for (var p in city)
      if (isString(city[p]))
        city[p] = item(p);
    for (p in city)
      config.setCity(p, city[p], id);

    var players = config.getServer("players", {});
    var player = players[city.o] = players[city.o] || {};
    player.c = player.c || [];
    if (-1 == player.c.indexOf(id)) {
      player.c.push(id);
      player.c.sort(function(a, b) { return a - b; });
    }
    config.setServer("players", players);
  }

  function showSpies() {

  }

  var city = urlParse("selectCity");
  if (city)
    setTimeout(focusCity, 200, city);
  levelTown();
  levelResources();
  var island = integer(urlParse("id", $X('id("advCities")/a').search));
  travelDistanceBreadcrumbs(island);

  $x('id("cities")/li[contains(@class,"level") and ' +
                ' not(contains(@class,"level0"))]/ul[@class="cityinfo"]').
    forEach(registerCity);

  showSpies();

  if (island)
    addEventListener("keypress", nextprev, false);
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
    what = $X('id("islandfeatures")/li['+ what +']');
    if (!what) return;

    var level = number(what.className);
    node({ className: "rounded", text: level, append: what });

    var id = urlParse("id");
    if (id) {
      var res = what.className.split(" ")[0];
      var rid = resourceIDs[res];
      if ("w" == rid) {
        config.setIsle("w", level, id);
      } else {
        config.setIsle("R", level, id);
        config.setIsle("r", rid, id);
      }
    }
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
    var cid = id || c;
    var bid = buildingID(what);
    var l = buildingLevel(bid, undefined, null, cid);
    if (isDefined(l)) {
      var p = buildingPosition(bid, "", cid);
      return url("?view="+ what +"&id="+ cid +"&position="+ p);
    }
    return "";
  }

  function resource(view) {
    if (!opts.city)
      return "?view="+ view +"&type="+ view +"&id=" + i;
    return "?action=header&function=changeCurrentCity&oldView=tradegood" +
           "&view="+ view +"&type="+ view +"&id="+ i +"&cityId="+ opts.city;
  }

  if (isUndefined(opts)) opts = {};
  var c = cityID(), i = islandID(), ci = config.getCity("i", 0, c) || i;
  if (what == "workshop")
    what = "workshop-army";
  switch (what) {
    default:		return url("?view="+ what);
    case "luxe":	return url(resource("tradegood"));
    case "wood":	return url(resource("resource"));

    case "townhall":	case "workshop":
    case "townHall":	case "port":	case "academy":
    case "shipyard":	case "wall":	case "warehouse":
    case "barracks":	case "museum":	case "branchOffice":
    case "embassy":	case "palace":	case "palaceColony":
    case "safehouse":	case "tavern":	case "workshop-army":
      return building();

    case "culturegoods":
      return urlTo("museum").replace("museum", "culturalPossessions_assign");

    case "library":	what = "researchOverview"; // fall-through:
    case "changeResearch":                         // fall-through:
    case "researchOverview":
      			return urlTo("academy").replace("academy", what);

    case "city":	return url("?view=city&id="+ (id || c));
    case "building":	return url("?view=buildingDetail&buildingId="+ id);
    case "research":	return url("?view=researchDetail&researchId="+ id);
    case "pillage":	return url("?view=plunder&destinationCityId="+ id);
    case "transport":	return url("?view=transport&destinationCityId="+ id);

    case "tradeAdvisor":
    case "militaryAdvisorCombatReports":
    case "researchAdvisor":
    case "diplomacyAdvisor":
      return url("?view="+ what +"&oldView=city&id="+ c);

    case "message":
      var from = opts && opts.from || cityID();
      return url("?view=sendMessage&with="+ from +"&destinationCityId="+ id +
                 "&oldView=island");

    case "island":
      var city = "";
      if (isObject(id)) {
        if ((city = id.city)) {
          if (!id.island && !(id.island = config.getCity("i", 0, city)))
            return "#";
          city = "&selectCity="+ city;
        }
        id = id.island;
      }
      return url("?view=island&id="+ id + city);
  }
}

function getQueue() {
  return config.getCity("q", []);
}

function setQueue(q) {
  return config.setCity("q", q.concat());
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
  var clicked = e.target;
  var enqueued = $X('ancestor-or-self::li[parent::ul[@id="q"]]', clicked), a;
  if (enqueued) { // drop from queue
    var q = getQueue();
    q.splice(enqueued.getAttribute("rel"), 1);
    setQueue(q);
    drawQueue();
  } else if (!e.altKey) {
    return;
  } else if ((a = $X('parent::li[parent::ul[@id="locations"]]/a', clicked))) {
    addToQueue(buildingID(a), e.shiftKey);
    setTimeout(processQueue, 10);
  } else if ((a = $X('ancestor-or-self::a[@href="#upgrade"]', clicked))) {
    addToQueue(buildingID(urlParse("view")));
    setTimeout(processQueue, 10);
  } else if ((a = $X('ancestor-or-self::a[starts-with(@rel,"i")]', clicked))) {
    e.preventDefault();
    goto(urlTo(e.shiftKey ? "pillage" : "transport", a.rel.slice(1)));
  }
  if (a || enqueued) {
    e.stopPropagation();
    e.preventDefault();
  }
}

function reallyUpgrade(name) {
  //console.log("upgrading %x", name);
  var i = cityID();
  var q = getQueue(), next = q.shift();
  var b = buildingID(name);
  var l = buildingLevel(b, 0);
  var p = buildingPosition(b);
  if (isDefined(next) && next != b) { // other window got there before us; abort
    location.hash = "#q:in-progress ("+ next +"!="+ b +")";
    return;
  }
  if (haveResources(buildingExpansionNeeds(b, l))) {
    return setTimeout(function() {
      config.remCity("t");
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
  function countdown() {
    if (soon < 1) {
      document.title = lang.countdone;
      return gotoCity("/#q:"+ buildingClass(b));
    }
    document.title = lang.countdown + (soon--) + "...";
    setTimeout(countdown, 1e3);
  }

  //console.log("upgrade: %x", getQueue().length);
  var q = getQueue();
  if (!q.length) return;
  var b = q.shift();
  var l = buildingLevel(b, 0);
  if (haveResources(buildingExpansionNeeds(b, l))) {
    // ascertain that we are in a good view -- and are focusing the right city
    var soon = 10 + (Math.random() * 5);
    var chaff = soon - Math.floor(soon); soon -= chaff;
    return setTimeout(countdown, chaff * 1e3);
  }
  var t = replenishTime(b, l);
  if (t && isFinite(t)) {
    setTimeout(upgrade, Math.max(++t * 1e3, 60e3));
    console.log("Waiting %d seconds...", t);
  }
}

// iterates through lack, updating accumulate with goods used, zeroing have for
// all missing resources, and adds lack.t with the time it took to replenish it
function replenishTime(b, level, lack, have, accumulate) {
  if (haveEnoughToUpgrade(b, level, have))
    return 0;

  lack = lack || {};
  have = have || currentResources();
  accumulate = accumulate || {};

  // what is missing?
  var need = buildingExpansionNeeds(b, level);
  for (var r in need) {
    if (r == "t") continue;
    if (need[r] > have[r])
      lack[r] = need[r] - have[r];
  }

  // how far do we have to move the clock forward to get everything needed?
  var t = 0, takesMin = 0, takesMax = 0;
  var pace = reapingPace();
  var all = addResources(lack, pace); // used as a union operator only here
  for (var r in all) {
    var n = lack[r] || 0;
    var p = pace[r] || 0;
    accumulate[r] = (accumulate[r] || 0) + n;
    if (p > 0) {
      var time = Math.ceil(3600 * n / p);
      takesMin = Math.max(takesMin, time);
    } else if (n) {
      takesMax = Infinity;
    }
  }
  takesMax = Math.max(takesMin, takesMax);
  accumulate.t = takesMin + (accumulate.t || 0);

  // replenish all resources (that can be replenished in finite time)
  var replenish = mulResources(pace, takesMin / 3600, Math.floor);
  for (r in replenish)
    have[r] = Math.max(0, have[r] + replenish[r]);
  for (r in accumulate)
    if (!accumulate[r])
      delete accumulate[r];

  return takesMax;
}

function hoverQueue(have, e) {
  var node = e.target;
  if ($X('self::li[@rel]', node)) {
    var n = li.getAttribute("rel");
    var h = $("qhave");

    div = showResourceNeeds(have, $("container2"), div);
    div.title = lang.leftByThen + resolveTime((t-Date.now())/1e3, 1);

  }
  var last = $("q").lastChild.have;
}

function drawQueue() {
  var q = getQueue();
  var t = Math.max(Date.now(), config.getCity("t")); // in ms
  var dt = (t - Date.now()) / 1e3; // in s
  var have = currentResources();
  var pace = reapingPace();
  var miss = {};
  var level = buildingLevels();

  // add a level for what is being built now, if anything
  var building = config.getCity("u");
  var buildEnd = config.getCity("t", 0);
  if (buildEnd > Date.now() && building) {
    building = buildingID(urlParse("view", building));
    level[building] = 1 + (level[building] || 0);
    var replenished = mulResources(pace, (buildEnd - Date.now()) / 3600e3);
    have = addResources(have, replenished);
  }

  var ul = node({ tag: "ul", id: "q", append: document.body });
  ul.innerHTML = "";
  for (var i = 0; i < q.length; i++) {
    var b = q[i];
    var what = buildingClass(b);
    var li = node({ tag: "li", className: what, rel: i + "", append: ul,
                    html: '<div class="img"></div><a href="'+ urlTo(what) +
                    '"></a>' });
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

    // calculate leading stall time, if any, moving clock/resources forwards:
    var stalledOn = {};
    var time = replenishTime(b, level[b], stalledOn, have, miss);
    //console.log("Stalled %x seconds on %s", stall.t, buildingClass(b));
    if (time) {
      time = secsToDHMS(time, 1, " ");
      dt += miss.t;
      t += miss.t * 1e3;
      //console.log(miss.t, secsToDHMS(miss.t, 1, " "));
      stalledOn.t = time;
      var div = showResourceNeeds(stalledOn, li, null, "112px", "");
      div.style.backgroundColor = "#FCC";
      div.style.borderColor = "#E88";
      div.title = lang.unavailable;
    }

    // FIXME? error condition when storage[level[warehouse]] < need[resource]

    // Upgrade and move clock forwards upgradeTime seconds
    annotateBuilding(li, ++level[b]);
    var need = buildingExpansionNeeds(b, level[b] - 1);
    have = subResources(have, need); // FIXME - improve (zero out negative)
    dt = parseTime(need.t) + 1;
    li.title = lang.startTime +": "+ resolveTime((t - Date.now())/1000+1, 1);
    t += dt * 1000;

    var done = trim(resolveTime((t - Date.now()) / 1000));
    done = node({ className: "timetofinish", text: done, append: li });
    node({ tag: "span", class: "before", prepend: done });
    node({ tag: "span", class: "after",  append: done });
    setTimeout(bind(function(done, li) {
      done.style.left = 4 + Math.round( (li.offsetWidth -
                                         done.offsetWidth) / 2) + "px";
    }, this, done, li), 10);
  }

  var div = $("qhave") || undefined;
  if (!q.length) {
    if (div) hide(div);
    return;
  }
  delete have.p; delete have.g; delete have.P;
  div = showResourceNeeds(have, $("container2"), div);
  div.title = lang.leftByThen + resolveTime((t-Date.now())/1e3, 1);
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
  div.title = lang.shoppingList;
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
// has been completed, and otherwise the time in milliseconds to build complete
// or resources expected to be available to start building something now queued.
function queueState() {
  var v = urlParse("view");
  var u = config.getCity("u");
  var t = config.getCity("t", Infinity);
  var busy = $X('id("buildCountDown") | id("upgradeCountDown")');
  //console.log("u: %x, t: %x, b: %x, ql: %x", u, t, busy, getQueue().length);
  if (t < Date.now()) { // last known item is completed by now
    if ("city" == v)
      return busy ? "building" : 0;
    return "unknown";
  } else if (t == Infinity) { // no known project going
    var q = getQueue();
    if (!q.length)
      return 0;
    var b = q.shift();
    var l = buildingLevel(b, 0);
    console.log("Building %x [%d]: %xs", b, l, replenishTime(b, l));
    return replenishTime(b, l);
  } // busy building something; return time until completion
  return (t - Date.now()) / 1e3 + 3;
}

function processQueue(mayUpgrade) {
  var state = queueState(), time = isNumber(state) && state;
  //console.log("q: "+ state + " ("+ secsToDHMS(time) +")", mayUpgrade);
  if (time) {
    setTimeout(processQueue, Math.max(time * 1e3, 30e3));
  } else if (0 === time) {
    if (mayUpgrade) upgrade();
  } // else FIXME? This might be safe, if unrelated pages don't self-refresh:
  //setTimeout(goto, 3e3, "city"); // May also not be needed at all there

  drawQueue();
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
    buts.forEach(rm);
    config.setCity(["p", id], pos);
    var prepend = e.shiftKey;
    addToQueue(id, prepend);
  }
  function addEnqueueButton(p) {
    var pos = parseInt(urlParse("position"), 10);
    var img = $X('preceding-sibling::div[@class="buildinginfo"]/img', p);
    var id = img && buildingID(img.src.match(/([^\/.]+).gif$/)[1]);
    if (id && pos && !alreadyAllocated(pos, id)) {
      var but = node({ tag: "input", className: "button", append: p,
                       value: lang.enqueue, title: lang.prependToQ,
                       style: { width: "100px" }});
      clickTo(but, bind(build, this, id, pos));
      return but;
    }
  }
  projectBuildStart("mainview");
  var buts = $x('//p[@class="cannotbuild"]').map(addEnqueueButton);
}

function resourceFromImage(img) {
  var type = /icon_([a-z]+).gif$/.exec(isString(img) ? img : img.src);
  if (type)
    return { wood: "w", wine: "W", marble: "M", glass: "C", sulfur: "S",
          citizen: "p", gold: "g", time: "t" }[type[1]];
}

function sumPrices(table, c1, c2) {
  function buyAll(e) {
    var form = $X('.//form', e.target);
    if (form) form.submit();
  }

  function buySome(e) {
    var form = $X('.//form', e.target);
    var amount = $X('input[contains(@name,"cargo_tradegood")]', form);
    var count = prompt("Buy how much? (0 or cancel to abort)", amount.value);
    if (!count || !(count = integer(count))) return;
    $X('input[@name="transporters"]', form).value = Math.ceil(count / 300);
    amount.value = count;

    form.submit();
  }

  function price(tr, i) {
    var prefixes = { G:1e9, M:1e6, k:1e3 };
    var td = $x('td', tr);
    if (td.length <= Math.max(c1, c2)) return;
    var n = integer(td[c1]), count = n;
    var p = integer(td[c2]), ships = Math.ceil(count / 300);
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
    var a = $X('a[contains(@href,"view=takeOffer")]', td.pop());
    var buy = a && players[i] ? " buyable" : "";
    var sum = node({ tag: "span", text: n+"", append: td[c1],
                     className: "ellipsis price" + buy });
    if (buy) {
      var type = { W:1, M:2, C:3, S:4 }[resourceFromImage($X('img', td[2]))];
      var vars = urlParse(null, a.search);
      delete vars.view; delete vars.resource;
      vars.action = "transportOperations";
      vars.function = "takeSellOffer";
      vars.oldView = urlParse("view");
      vars.avatar2Name = players[i];
      vars.city2Name = cities[i];
      vars["tradegood"+ type +"Price"] = p;
      vars["cargo_tradegood"+ type] = count;
      vars.transporters = ships;

      var form = <form method="post" action="/index.php"
                       target="_blank" style="display: none"/>;
      for (p in vars)
        form.* += <input type="hidden" name={p} value={vars[p]}/>;
      node({ tag: form, prepend: sum });
      //dblClickTo(sum, buyAll);
      clickTo(sum, buySome);
      sum.title = lang.clickToBuy;
    }
  }

  function link(a) {
    var id = urlParse("destinationCityId", a.search);
    var city = $X('../preceding-sibling::td[last()]', a);
    var link = urlTo("island", { city: id });
    var name, player, junk =  city.textContent.match(/^(.*) \((.*)\)/);
    if (junk) {
      [junk, name, player] = junk;
      city.innerHTML = <>
        {link != "#" ? <a href={link}>{name}</a> : name}
        (<a href={urlTo("message", id)}>{player}</a>)
      </>.toXMLString();
      pillageLink(id, { before: a });
    }
    cities.push(name);
    players.push(player);
  }

  var players = [], cities = [];
  $x('tbody/tr/td/a[contains(@href,"view=takeOffer")]', table).forEach(link);
  $x('tbody/tr[td]', table).forEach(price);
}

function pillageLink(id, opts) {
  opts.tag = <a href={urlTo("pillage", id)}>
    <img src={gfx.pillage} height="20"/>
  </a>;
  node(opts);
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

function sum(a, b) {
  return integer(a || 0) + integer(b || 0);
}

function evenShips(nodes) {
  function goods() {
    return reduce(sum, nodes, 0);
  }

  function fillNextEvenShip(e) {
    var input = e.target;
    var value = integer(input);
    var count = goods();
    var remainder = (count + baseline) % 300;
    if (remainder) {
      input.value = value + (300 - remainder);
      e.stopPropagation();
    }
  }

  function listen(input) {
    input.addEventListener("dblclick", fillNextEvenShip, false);
  }

  function showTime() {
    var loading = goods() * (60 / buildingCapacity("port"));
    var loadTime = secsToDHMS(loading);
    var total = time + loading;
    var there = " — " + resolveTime(total, 1);
    to.nodeValue = to.nodeValue.replace(/( — .*)?$/, there);
    if (loadTime)
      t.nodeValue = loadTime +" + "+ text +" = "+ secsToDHMS(total);
    else
      t.nodeValue = text;
  }

  var baseline = $("sendSummary") || 0;
  if (baseline)
    baseline = 300 - integer(baseline.textContent.split("/")[1]) % 300;
  if (stringOrUndefined(nodes))
    nodes = $x(nodes || '//input[@type="text" and @name]');
  nodes.forEach(listen);

  var m = $("missionSummary");
  if (m) {
    var to = $X('.//div[@class="journeyTarget"]/text()[last()]', m);
    var t = $X('.//div[@class="journeyTime"]/text()[last()]', m);
    if (t && to) {
      var text = t.nodeValue;
      var time = parseTime(text);
      onChange(nodes, showTime, "value", "watch");
      showTime();
    }
  }
}

function scrollWheelable(nodes) {
  function getCount(node) {
    return $X('preceding-sibling::input[@type="text"] |' +
              'self::input[@type="text"]', node);
  }
  function add(node, sign, event) {
    if (!node || !sign) return;
    event.preventDefault();
    var alt = event.altKey ? 100 : 1;
    var ctrl = event.ctrlKey ? 3 : 1;
    var meta = event.metaKey ? 1000 : 1;
    var shift = event.shiftKey ? 10 : 1;
    var factor = meta * alt * ctrl * shift;
    var value = node.value || "0";
    var time = "vT" == node.id;
    if (time) {
      value = parseTime(value + "");
      if (1 == factor)
        factor = 5;
      factor *= 60;
    } else {
      value = integer(value);
    }
    value = Math.max(0, value + sign * factor);
    if (time && value < 40 * 60) { // special case for < 40 minute clustering
      if (sign == 1) { // adding
        if (value < 20 * 60)
          value = 20 * 60;
        else if (value < 40 * 60)
          value = 40 * 60;
      } else { // subtracting
        if (value < 20 * 60)
          value = 0;
        else if (value < 40 * 60)
          value = 20 * 60;
      }
    }
    node.value = time ? secsToDHMS(value) : value;
    click(node);
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
    inputs.forEach(function(i) { count += integer(i.value || 0); });
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

// drop dates that are today and just makes things unreadable:
function pruneTodayDates(xpath, root) {
  function dropDate(td) {
    td.textContent = td.textContent.replace(date, "");
  }
  var date = trim($("servertime").textContent.replace(/\s.*/, ""));
  $x(xpath + '[contains(.,"'+ date +'")]', root).forEach(dropDate);
}

// would ideally treat the horrid tooltips as above, but they're dynamic. X-|
function merchantNavyView() {
  function missionType(mission, t1_vs_t2, c1, c2) {
    var R = "right", L = "left", x = "swap";
    var data = {// arrival<end  arrival==end  arrival>end  (",  " == verified)
      colMiss: { "-1": [R   ],  "0": [R   ],  "1": [R   ] },
      colUndo: { "-1": [L   ],  "0": [L   ],  "1": [L   ] },
      attMiss: { "-1": [R,  ],  "0": [R   ],  "1": [L, x] },
      attUndo: { "-1": [L   ],  "0": [L   ],  "1": [L   ] },
      attBack: { "-1": [L   ],  "0": [L, x],  "1": [L, x] },// 0: YOUR name :/
      buyMiss: { "-1": [R,  ],  "0": [L,  ],  "1": [R   ] },
      buyUndo: { "-1": [L   ],  "0": [L   ],  "1": [L   ] },
      buyBack: { "-1": [L   ],  "0": [L, x],  "1": [L, x] },
      selMiss: { "-1": [R   ],  "0": [R   ],  "1": [R   ] },
      selUndo: { "-1": [L   ],  "0": [L, x],  "1": [L   ] },
      selBack: { "-1": [L   ],  "0": [L   ],  "1": [L   ] },
      trpMiss: { "-1": [R   ],  "0": [R   ],  "1": [R   ] },
      trpUndo: { "-1": [L   ],  "0": [L   ],  "1": [L   ] },
      tspMiss: { "-1": [R,  ],  "0": [R,  ],  "1": [R   ] },
      tspUndo: { "-1": [L   ],  "0": [L, x],  "1": [L   ] },
    };
    for each (var id in missions)
      for each (var sub in ["", "Undo", "Back"])
        if (mission == texts[id+"Msn"+sub]) {
          data = data[id+(sub||"Miss")][t1_vs_t2].concat();
          data.unshift(id);
          //console.log((t1_vs_t2+"").charAt() +" "+ id+"Msn"+(sub||"Miss") +": "+ data.join(" / ") + " [" + c1+"&"+c2 +"]");
          return data;
        }
    console.log(mission +" \\ "+ t1_vs_t2);
    return ["tsp", R];
  }

  function arrowify(tr, i) {
    var td = $x('td', tr);
    var mission = trim(td[3].textContent), msn;
    var t1 = parseDate(td[4]), c1 = td[0].firstChild;
    var t2 = parseDate(td[5]), c2 = td[1].firstChild;
    //if(compare(t1, t2) == 1)console.log(1, td[4].textContent, td[5].textContent, t1, t2);
    rm(c2.nextSibling);
    var player = c2.nextSibling.nodeValue.replace(/(^\( *| *\)$)/g, "");
    rm(c2.nextSibling);
    node({ text: player, className: "ellipsis price", append: td[1] });

    var direction, msn, swap;
    [msn, direction, swap] = missionType(mission, compare(t1, t2), c1.nodeValue, c2.nodeValue);
    var arrow = tr.insertCell(1);
    if (swap) {
      //console.log("replacing row " + (i+1));
      td[1].replaceChild(c1, c2);
      td[0].appendChild(c2);
      [c1, c2] = [c2, c1];
    }
    node({ tag: <img class="arrow" src={arrows[direction][msn]}/>,
           append: arrow });
  }

  function getter(mission, direction) {
    return function() {
      //console.log(mission +" + "+ direction);
      var self = arguments.callee;
      if (self.img) return self.img;
      return self.img = GM_getResourceURL(mission +"-"+ direction);
    };
  }

  function showResources(td) {
    var stuff = td.getAttribute("onmouseover").match(/<img.*/) + "";
    var goods = "wood,wine,marble,glass,sulfur".split(",");
    var count = {};
    for (var i = 0; i < goods.length; i++) {
      var amount = stuff.match(goods[i] + "\\D*(\\d+)");
      if (amount) {
        count[goods[i]] = integer(amount[1]);
        console.log(goods[i] +": "+ count[goods[i]]);
      } else {
        goods.splice(i--, 1);
      }
    }

    if (goods.length) {
      if (1 == goods.length)
        goods.unshift("only");
      else
        goods.unshift("lots");

      // goods underline
      var props = <div class="underline"/>, total = 0, r;
      for each (r in count) total += r;
      for (r in count)
        props.* += <div style={"width: "+ Math.floor(100*count[r]/total) +"%"}
                        class={"goods " + r}> </div>;
    }

    stuff = stuff.replace(/gold\D+[\d,.]+/g, "").match(/\d+[,.\d]*/g);
    goods = ["ellipsis goods"].concat(goods).join(" ");
    if (stuff)
      stuff = node({ className: goods, append: td,
                     text: reduce(sum, stuff, 0) });
    if (props) {
      props.@style = "width:"+ (stuff.offsetWidth - 5) + "px";
      node({ tag: props, append: stuff });
    }
  }

  function monkeypatch(html) {
    var args = [].slice.call(arguments);
    var scan = node({ html: html });
    sumPrices(scan.firstChild, 1, 3);
    $X('table/tbody/tr/th', scan).setAttribute("colspan", "4");
    args[0] = scan.innerHTML;
    ugh.apply(this, args);
  }

  var ugh = unsafeWindow.Tip;
  unsafeWindow.Tip = monkeypatch; // fixes up the tooltips a bit

  var table = $X('id("mainview")//table[@class="table01"]/tbody');

  var texts = servers[country];
  if (texts) {
    var arrows = { left: {}, right: {} };
    var missions = ["att", "buy", "sel", "trp", "tsp", "col"];
    for each (var msn in missions) {
      arrows.left.__defineGetter__(msn, getter(msn, "l"));
      arrows.right.__defineGetter__(msn, getter(msn, "r"));
    }
    $x('tr[td[3]]', table).forEach(arrowify);
    node({ tag: "th", text: " ", after: $X('tr/th[1]', table) });
  }

  pruneTodayDates('tr/td', table);
  $x('tr/td[@onmouseover]', table).forEach(showResources);
}


function buildingDetailView() {
  var id = parseInt(urlParse("buildingId"));
  var level = buildingLevel(id, 0) + 1;
  var tr = $X('//th[.="Level"]/../../tr[td[@class="level"]]['+ level +']');
  if (tr) {
    tr.style.background = "pink";
    tr.title = "Next building upgrade";
  }
  // scrapeIkipediaBuilding(document, id);
  // config.remove("buildings");
}

// Make sure you only run this in an account that has no techs researched!
function scrapeIkipediaBuilding(doc, id) {
  function resource(img) {
    return resourceIDs[img.src.match(/_([a-z]+).gif$/)[1]];
  }

  function parse(tr) {
    function add(td, i) {
      var r = head[i];
      var v = td.textContent.replace(/\D+/g, "");
      if (v)
        c[r] = "t" == r ? trim(td.textContent) : parseInt(v, 10);
    }
    var c = {};
    $x('td[@class="costs"]', tr).forEach(add);
    return c;
  }

  if (isUndefined(id)) id = urlParse("buildingId");
  if (isUndefined(id)) return undefined;

  var body = $X('id("overview")/tbody', doc);
  var head = $x('tr[1]/th[@class="costs"]/img', body).map(resource);
  var data = $x('tr[td[@class="costs"]]', body);
  var cost = data.map(parse);

  //if (cost.toSource() != costs[id].toSource()) {
  var b = config.get("buildings", []);
  b[id] = cost;
  for (var i = 0; i < b.length; i++)
    for (var j = i+1; j < b.length; j++)
      if (b[i] && b[j] && b[i].toSource() == b[j].toSource())
        b[j] = b[i];
  config.set("buildings", b);
  prompt("Data:", b.toSource().replace(/\s*\(void 0\)/g, ""));
  //}
  return cost;
}

function resourceFromUrl(img) {
  if (isObject(img))
    img = img.src;
  if (!(img = img.match(/_([^.]+).gif$/)))
    return "";
  return resourceIDs[img[1]];
}

// spies: 23947: { h: 42528, c: 35083, r: {122745: {c: 35083}} }
// (missing 35083: target city), id: home city, spy id, pos in hc, report id
// ?view=safehouseReports&id=42528&spy=23947&position=7&reportId=122745
// ?action=Espionage&function=executeMission&id=51713&position=3&spy=25700&mission=5
// ?view=safehouseReports&id=51713&spy=25700&position=3&reportId=135947
function warehouseSpy() {
  function steal(tr) {
    var n = integer($X('td[2]', tr));
    var r = resourceFromUrl($X('td[1]/img', tr));
    var id = r == "w" ? "wood" : "rest";
    var safe = buildingCapacities.warehouse[id][warehouse];
    var lootable = Math.max(0, n - safe);
    //console.log(n, r, id, safe, lootable);
    if (count) {
      node({ tag: "td", text: safe, append: tr });
      all += lootable;
    } else {
      lootable = all &&
        Math.min((lootable / all) * 20 * buildingCapacities.port[port],
                 lootable);
      node({ tag: "td", text: Math.floor(lootable), append: tr });
    }
  }

  var body = $X('id("resources")/tbody');
  if (body) {
    var found;
    var nameTD = $X('id("mainview")//tr[2]/td[2]');
    var cityName = nameTD.textContent;
    var allCities = config.getServer("cities");
    for (var id in allCities) {
      var city = allCities[id];
      if (city.n != cityName) continue;
      if (city.l) {
        found = true;
        var a = <><a href={urlTo("city", id)}>{cityName}</a> (</>;
        var isle = config.getCity("i", id);
        if (isle) {
          isle = urlTo("island", {city: id, island: isle});
          a += <><a href={isle}>island</a> </>;
        }
        a += <><a href={urlTo("pillage", id)}>pillage</a>)</>;
        nameTD.innerHTML = a.toXMLString();
        break;
      }
    }
    var guess = found && buildingLevel("port", 0, "save", id) || 0;
    var port = prompt("Port level? (0 for no port)", guess);
    if (port === null || !isNumber(port = integer(port))) return;
    var warehouse = prompt("Warehouse level? (0 for no warehouse)", found &&
                           buildingLevel("warehouse", 0, "save", id) || 0);
    if (warehouse === null || !isNumber(warehouse = integer(warehouse))) return;
    if (isUndefined(warehouse)) return;
    port = integer(port);
    warehouse = integer(warehouse);
    var head = $X('tr[1]', body);
    node({ tag: "th", className: "count", text: "Safe", append: head });
    node({ tag: "th", className: "count", text: "Loot", append: head });
    var rows = $x('tr[td]', body);
    var all = 0, count;
    count = 1; rows.forEach(steal);
    count = 0; rows.forEach(steal);
  }
}

function safehouseReportsView() {
  var mission = $X('normalize-space(id("mainview")//tr[1]/td[2])');
  //console.log("safehouse: "+ mission);
  if ("Spy out warehouse" == mission)
    warehouseSpy();
}

function safehouseView() {
  $x('//li/div[starts-with(@id,"SpyCountDown")]').forEach(projectCompletion);
}

function highlightMeInTable() {
  if (!mainviewOnReferenceIsland()) return;
  function mine(tr) { addClass(tr, "own"); }
  $x('id("mainview")/div[@class="othercities"]' +
     '//tr[td[@class="actions"][count(*) = 0]]').forEach(mine);
}

function numFormat(n) {
  var r = [], all, tail;
  n += "";
  while (n.length) {
    [all, n, tail] = n.match(/(.*?)(.{1,3})$/);
    r.unshift(tail);
  }
  return r.join(" ");
}

function stillRemains() {
  var panel = $X('id("resUpgrade")/div[@class="content"]');
  var counts = $x('.//li[@class="wood"]/text()[last()]', panel);
  if (counts.length != 2) return;
  $X('h4[2]', panel).textContent = lang.stillRemains;

  var n = counts.map(integer);
  var left = n[0] - n[1];
  counts[1].textContent = numFormat(left);

  var a = $X('id("donate")/a[@onclick]');
  var max = Math.min(left, integer(get("wood")));
  clickTo(a, function() { $("donateWood").value = max; });
  a.removeAttribute("onclick");
}

function resourceView() {
  function link(a) {
    var id = urlParse("destinationCityId", a.search);
    var city = $X('../preceding-sibling::td[last()]', a);
    var link = urlTo("island", { city: id });
    if ("#" != link)
      city.innerHTML = <a href={link}>{city.textContent}</a>.toXMLString();
    pillageLink(id, { after: a });
  }
  stillRemains();
  highlightMeInTable();
  $x('id("mainview")/div[@class="othercities"]//tr/td[@class="actions"]/' +
     'a[contains(@href,"view=sendMessage")]').forEach(link);
}

function isleForCity(city) { return config.getCity("i", 0, city); }

function setMaintenanceCost(n, cityID) {
  return config.setCity("m", n, cityID);
}
function maintenanceCost(cityID) {
  return config.getCity("m", 0, cityID);
}

function financesView() {
  var costs = $x('id("balance")/tbody/tr[position() < last()]/td[3]');
  for each (var id in cityIDs())
    setMaintenanceCost(integer(costs.shift()), id);
}

function cityView() {
  var id = urlParse("id", $X('id("advCities")/a').search);
  if (id) {
    var name = mainviewCityName();
    if (name) config.setCity("n", name, id);
    var isle = mainviewIslandID();
    if (isle) config.setCity("i", isle, id);
  }
  projectCompletion("cityCountdown", null, '../preceding-sibling::a');
  levelBat();
}

function corruption(city, fullpct) {
  var colonies = cityIDs().length - 1;
  var building = "palace" + (isCapital(city) ? "" : "Colony");
  var governor = buildingLevel(building, 0, city);
  var max = governor >= colonies ? 0 : 7 * colonies - 8 * governor + 2;
  var now = new Date, baseline = new Date(Date.UTC(2008, 3, 28));
  var factor = now < baseline ? 0.1 : 0.2;
  if (now > baseline)
    factor += Math.floor((now - baseline) / 6048e5) * 0.1;
  //console.log("Max corr: " + max + ", factor: "+ factor);
  return fullpct ? max : Math.min(factor, 1.0) * max / 100;
}

function townHallView() {
  var g = { context: $("PopulationGraph") };
  var growth = $("SatisfactionOverview");
  linkTo("wood", 'div[@class="woodworkers"]/span[@class="production"]', 0, g);
  linkTo("luxe", 'div[@class="specialworkers"]/span[@class="production"]', 0,g);
  linkTo("academy", 'div[@class="scientists"]/span[@class="production"]', 0, g);
  if (buildingLevel("tavern"))
    clickTo($X('.//div[@class="cat wine"]', growth), "tavern");
  if (buildingLevel("museum"))
    clickTo($X('.//div[@class="cat culture"]', growth), "museum");
  var c = $X('id("CityOverview")//li[@class="corruption"]//*[contains(.,"%")][1]');

  if ($X('.//div[@class="capital"]', growth))
    config.setServer("capital", cityID());
}

function museumView() {
  var goods = $X('id("val_culturalGoodsDeposit")/..');
  if (goods)
    config.setCity(["x", buildingIDs.museum],
                   integer(goods.textContent.match(/\d+/)[0]));

  var cities = cityIDs();
  for (var i = 0; i < cities.length; i++)
    if ((goods = $("textfield_city_"+ cities[i])))
      config.setCity(["x", buildingIDs.museum],
                     integer(goods), cities[i]);

  var friends = $x('id("mainview")/div[last()]//td[@class="actions"]/a[1]');
  for (var i = 0; i < friends.length; i++)
    friends[i] = urlParse("receiverName", friends[i].search);
  config.setServer("treaties", friends);
}

function updateCurrentResearch() {
  var research = $X('//div[@class="researchName"]/a');
  if (research)
    config.setServer("techs.research.n", research.title);
  config.setServer("techs.research.t", projectCompletion("researchCountDown"));
}

function academyView() {
  updateCurrentResearch();
  var research = $("inputScientists");
  if (research)
    config.setCity(["x", buildingIDs.academy], number(research));
}

function researchOverviewView() {
  function linkID(a) { return integer(urlParse("researchId", a.search)); }

  function augment(a, info, id) {
    a.className = "dependent";
    node({ className: "points", id: "P" + id, prepend: a, // ellipsis
           html: techLegend(info.p) });
    node({ className: "points", id: "D" + id, append: a,
           style: { left: "42%", whiteSpace: "nowrap" }, text: info.x });
  }

  function scrape(a, i) {
    function got(node) { augment(a, parse(node, id, a), id); }
    var id = linkID(a);
    setTimeout(wget$X, Math.random() * 1000 * get.length, a.href, got,
               './/*[@id="mainview"]//div[@class="content"]/table/tbody', 0, 1);
  }

  function parse(body, id) {
    var data = {}; // n: name, x: does, t: time, d: deps, p: points
    var what = { n: 2, x: 3, p: 4, d: 'tr[6]/td[2]/ul/li/a' }, junk, t, p;
    for (var i in what) {
      var xpath = what[i];
      if (isNumber(xpath))
        data[i] = $X('tr['+ xpath +']/td[2]/text()[last()]', body).textContent;
      else
        data[i] = $x(xpath, body);
    }
    [what, data.p] = /\(([0-9,.]+)/.exec(data.p);
    data.p = integer(data.p);
    data.d = data.d.map(linkID);
    data.x = trim(data.x.replace(/\s+/g, " "));
    //console.log(n + data.toSource());
    info[id] = data;
    config.setServer("techs.info", info);
    if (!--n) {
      config.remServer("techs.asked");
      setTimeout(techinfo, 100, info, all, div);
    }
    return data;
  }

  var div = $X('id("mainview")/div/div[@class="content"]');
  if (div) $x('br', div).forEach(rm);

  var info = config.getServer("techs.info", {});
  var all = $x('id("mainview")//div[@class="content"]/ul/li/a'), get = [];
  var id = all.map(linkID);
  var n = all.length;

  for (var i = 0; i < all.length; i++) {
    var tech = id[i];
    var a = all[i];
    a.id = "T" + tech;
    a.className = "dependent";
    info[tech] = info[tech] || { n: trim(a.textContent.replace(/\s+/, " ")) };
    if (info[tech].hasOwnProperty("p")) {
      augment(a, info[tech], tech);
      n--;
    } else {
      a.className = "independent";
      get.push(a);
    }
  }

  scientists = 0;
  for each (var city in cityIDs())
    scientists += config.getCity("x", {}, city)[buildingIDs.academy] || 0;

  if (get.length)
    get.forEach(scrape);
  else
    techinfo(info, all, div);
}

function techLegend(points, tech, checked) {
  var format;
  if (!tech || !scientists || tech.known)
    format = points + "$bulb";
  else if (!checked)
    format = secsToDHMS(3600 * tech.points / scientists, 1) + "$time";
  else
    format = resolveTime(3600 * points / scientists, 2);
  return visualResources(format, { size: 0.5 });
}


function techinfo(what, links, div) {
  function linearize(object, byID) {
    var array = [], j = 0;
    for (var i in object) {
      var info = object[i];
      var item = { name: info.n, id: i, does: info.x, points: info.p,
                   deps: info.d };
      if (links) {
        item.a = links[j++];
        if ((item.known = $x('ancestor::ul/@class = "explored"', item.a)))
          config.setServer(["techs", i], 1);
      }
      array.push(byID[i] = item);
    }
    return array;
  }

  function unwindDeps(of) {
    if (of.hasOwnProperty("level")) // already unwound
      return true;

    if (!of.deps.length) // no dependencies
      return !(of.level = levels[of.id] = 0);

    var l = of.deps.map(function level(id) { return levels[id]; });
    if (!l.every(isDefined)) // unresolved dependencies
      return false;

    of.level = levels[of.id] = 1 + Math.max.apply(Math, l);
    return true;
  }

  function hilightDependencies(id) {
    function sum(a, b) { return a + b; }
    function mark(id) {
      if (done[id]) return 0;
      var tech = byID[id];
      done[id] = tech.depends = true;
      var points = tech.known ? 0 : tech.points;
      points += reduce(sum, tech.deps.map(mark), 0);
      if (tech.known) return points;

      $("P" + id).innerHTML = techLegend(points, tech, true);
      return points;
      var show = !scientists ? points + "$bulb" :
        secsToDHMS(3600 * points / scientists, 1) + '$time';
      $("P" + id).innerHTML = visualResources(show, { size: 0.5 });

      return points;
    }

    var done = {};
    var points = mark(id);
    tree.forEach(show);
    var tech = byID[id];
    //tech.a.title = tech.does + " ("+ points +" points left)";
  }

  function show(tech) {
    var a = tech.a;
    if (a) {
      if (tech.depends) {
        a.className = "dependent";
      } else {
        a.className = "independent";
        $("P" + tech.id).innerHTML = techLegend(tech.points, tech);
      }
    }
    tech.depends = false;
  }

  function hover(e) {
    //console.time("hilight");
    var a = e.target;
    if (a && "a" == a.nodeName.toLowerCase() ||
        "points" == a.className) {
      var id = $X('ancestor-or-self::*[@id][1]', a).id.slice(1);
      try { hilightDependencies(id); } catch(e) {}
    } else
      tree.forEach(show);
    //console.timeEnd("hilight");
  }

  function isKnown(what) {
    return what.known;
  }

  function indent(what) {
    what.a.style.paddingLeft = (what.level * indentfactor + 40) + "px";
    //console.log(what ? what.toSource() : "!");
    show(what);
  }

  function vr(level) {
    hr = node({ tag: "hr", id: "vr", append: div,
                style: { height: (div.offsetHeight - 22) + "px",
                         left: (level * indentfactor + 45) + "px" }});
  }

  if (isString(what) || isUndefined(what)) {
    var name = what;
    what = config.getServer("techs.info", 0);

    if (what && name)
      for each (var t in what)
        if (name == t.n)
          return t;

    if (!what) {
      var lastAsked = config.getServer("techs.asked", 0);
      var url = urlTo("library");
      if (url && ("researchOverview" != urlParse("view")) &&
          ((Date.now() - lastAsked) > 864e5))
        if (confirm(lang.readlibrary))
//chrome://browser/content/browser.xul?view=researchOverview&id=77357&position=9
          location.search = url;
        else
          config.setServer("techs.asked", Date.now());

      return {};
    }
  }

  var byID = {};
  var tree = linearize(what, byID);

  if ("researchOverview" != urlParse("view"))
    return tree;

  var indentfactor = 5;
  var levels = {}, byName = {}, hr;
  while (!tree.map(unwindDeps).every(I));
  tree.forEach(indent);

  // silly; there is one max level per research branch, and it's always the 1st
  //var maxLevel = Math.max.apply(Math, pluck(tree.filter(isKnown), "level"));
  //vr(maxLevel);

  var hide = config.get("hide-known-tech", false);
  var toggle = node({ tag: "style", text: "ul.explored { display: none; }",
                      append: document.documentElement.firstChild });
  toggle.disabled = !hide;
  var header = $X('preceding-sibling::h3/span', div);
  if (header) {
    header.innerHTML += ": ";
    var text = node({ tag: "span", id: "hideshow", append: header,
                      text: hide ? lang.hidden : lang.shown });
    clickTo(header, function() {
      toggle.disabled = hide;
      config.set("hide-known-tech", hide = !hide);
      text.textContent = hide ? lang.hidden : lang.shown;
      //hr.style.height = (div.offsetHeight - 22) + "px";
    });
  }

  div.addEventListener("mousemove", hover, false);
  return tree;
}

function visualResources(what, opt) {
  var icons = {
    gold: <img src={gfx.gold} width="17" height="19"/>,
    wood: <img src={gfx.wood} width="25" height="20"/>,
    wine: <img src={gfx.wine} width="25" height="20"/>,
   glass: <img src={gfx.crystal} width="23" height="18"/>,
  marble: <img src={gfx.marble} width="25" height="19"/>,
  sulfur: <img src={gfx.sulfur} width="25" height="19"/>,
    bulb: <img src={gfx.bulb} width="14" height="21"/>,
    time: <img src={gfx.time} width="20" height="20"/>,
  };
  function replace(m, icon) {
    var margin = { glass: -3 }[icon] || -5;
    icon = icons[icon];
    if (opt && opt.size) {
      var h0 = icon.@height, h1 = Math.ceil(opt.size * h0);
      var w0 = icon.@width,  w1 = Math.ceil(opt.size * w0);
      margin = margin + Math.floor((h0 - h1) / 2);
      icon.@height = h1;
      icon.@width = w1;
    }
    if (!opt || !opt.noMargin)
      icon.@style = "margin-bottom: "+ margin +"px";
    return icon.toXMLString();
  }
  if (isObject(what)) {
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

function blockadeView() {
  scrollWheelable();
}

function deploymentView() {
  scrollWheelable();
}

function colonizeView() {
  function annotate(what, time) {
    what.innerHTML += " ("+ time +")";
  }
  evenShips();
  scrollWheelable();

  css("#container .resources li { white-space: nowrap; }");

  var have = currentResources();
  var pace = reapingPace();

  var needPop = $X('//ul/li[@class="citizens"]'); // the div to annotate
  if (have.p < 40) { // need more colonists!
    var busyPop = have.P - have.p;
    var wantPop = 40 - have.p;
    var people = projectPopulation({ popgte: busyPop + wantPop });
    if (people && people != Infinity)
      annotate(needPop, resolveTime(people, 1));
  }

  var needGold = $X('//ul/li[@class="gold"]');
  if (have.g < 12e3 && pace.g > 0)
    annotate(needGold, resolveTime((12e3 - have.g) / (pace.g / 3600), 1));

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

// projects wine shortage time and adds lots of shortcut clicking functionality
function improveTopPanel() {
  function tradeOnClick(li) {
    var what = trim(li.className).split(" ")[0]; // "glass", for instance
    if (!haveBuilding("branchOffice")) return;
    clickTo(li, bind(buy, this, what), 'not(self::a or self::span)');
    dblClickTo(li, bind(sell, this, what));
  }
  function projectWarehouseFull(node, what, have, pace) {
    var capacity = integer($X('../*[@class="tooltip"]', get(what)));
    var time = resolveTime((capacity - have) / (pace/3600), 1);
    node.title = (node.title ? node.title +", " : "") + lang.full + time;
  }

  // wine flow calculation
  var flow = reapingPace();
  var span = $("value_wine");
  var time = flow.W < 0 ? Math.floor(number(span)/-flow.W) +"h" : sign(flow.W);
  time = node({ tag: "span", className: "ellipsis", text: time, after: span });
  if (flow.W < 0)
    time.title = lang.empty + resolveTime(number(span)/-flow.W * 3600, 1);
  else if (flow.W > 0) {
    var reap = secondsToHours(jsVariable("startTradegoodDelta"));
    time.title = "+"+ reap +"/-"+ (reap - flow.W);
    projectWarehouseFull(time, "wine", number(span), flow.W);
  }
  linkTo("tavern", time, { color: "#542C0F" });

  // other resource flow
  var income = { wood: flow.w };
  var type = luxuryType();
  var luxe = flow[type];
  var name = luxuryType("name");
  if (name != "wine") // already did that
    income[name] = luxe;

  config.setCity("r", { t:Date.now(), r: currentResources(), p: reapingPace() },
                 referenceCityID());
  config.setCity("i", islandID(), referenceCityID());
  config.setIsle("r", type);

  for (name in income) {
    var amount = income[name];
    span = get(name);
    var div = node({ tag: "span", className: "ellipsis", after: span,
                     text: sign(amount) });
    if (amount > 0)
      projectWarehouseFull(div, name, number(span), income[name]);
    linkTo("port", div, { color: "#542C0F" });
  }

  var cityNav = $("cityNav");
  var face = flow.g < 0 ? "negative" : "positive";
  node({ id: "coin", className: face, append: cityNav, title: " " });
  node({ id: "income", text: sign(flow.g), append: cityNav, title: " " });

  var ap = $("value_maxActionPoints").parentNode;
  ap.id = "action-points";
  ap.addEventListener("mouseover", hilightShip, false);
  ap.addEventListener("mouseout", unhilightShip, false);
  clickTo(ap, urlTo("merchantNavy"));

  $x('id("cityResources")/ul[@class="resources"]/li/div[@class="tooltip"]').
    forEach(function(tooltip) {
      var a = linkTo("warehouse", tooltip);
      if (a)
        hideshow(a, [a, a.parentNode]);
    });

  clickTo(cityNav, urlTo("townHall"), 'self::*[@id="cityNav" or @id="income"]');
  linkTo("luxe", $X('id("value_'+ luxuryType("name") +'")'));
  linkTo("wood", $X('id("value_wood")'));
  $x('id("cityResources")/ul/li[contains("wood wine marble glass sulfur",'+
     '@class)]').forEach(tradeOnClick);

  showOverview();
  showHousingOccupancy();
  showCityBuildCompletions();
  showSafeWarehouseLevels();
  // unconfuseFocus();
  if (!isMyCity()) return;

  var build = config.getCity("t", 0), now = Date.now();
  if (build > now) {
    time = $X('id("servertime")/ancestor::li[1]');
    var a = node({ tag: "a", href: config.getCity("u"), append: time });
    node({ tag: "span", id: "done", className: "textLabel", append: a,
          text: trim(resolveTime(Math.ceil((build-now)/1e3))) });
  }
}

function unconfuseFocus() {
  if (mainviewCityName() != cityName()) {
    var selected = $X('id("changeCityForm")//div[@class="dropbutton"]');
    selected.className += " not-mainview";
    selected.title = lang.notShownNow;
  }
}

function onChange(nodes, cb, attribute, watch) {
  function modified(e) {
    //console.log([e.type, e.attrName, e.newValue].join());
    if ("DOMAttrModified" != e.type ||
        isDefined(attribute) && attribute != e.attrName)
      return;
    cb(e.newValue, e.target);
  }

  function listen(node) {
    function changed(name, from, to) {
      if (name == attribute)
        setTimeout(cb, 0, to, node);
      return to;
    }
    if (watch)
      node.wrappedJSObject.watch(attribute, changed);
    else
      node.addEventListener("DOMAttrModified", modified, false);
  }

  if (isArray(nodes))
    nodes.map(listen);
  else
    listen(nodes);
  if (!isArray(nodes))
    nodes.addEventListener("DOMAttrModified", modified, false);
  else
    for each (var node in nodes)
      node.addEventListener("DOMAttrModified", modified, false);
}

function toggleOverview(newValue, node) {
  var table = toggleOverview.table;
  var shown = /expanded/.test(newValue);
  if (shown) show(table); else hide(table);
}

// extended city selection panel
function showOverview() {
  var grid = {}, res = ["w", "W", "M", "C", "S", "p"];
  var table = <table id="overview" title=" "><tr id="headers">
    <th class="w"/><th class="W"/><th class="M"/>
    <th class="C"/><th class="S"/><th class="p"/>
  </tr></table>;
  var names = ["townHall", "barracks", "shipyard", "port", "branchOffice",
               "tavern", "museum", "academy", "workshop", "safehouse",
               "embassy", "warehouse", "wall", "palace"];
  for each (var name in names) {
    var img = <img src={gfx[name]} height={name == "wall" ? "30" : "20"}/>;
    if ("museum" == name)
      img = <a href={ urlTo("culturegoods") }>{ img }</a>;
    table.tr.* += <th title={/*lang[*/name/*]*/} class={"building " + name}>
      { img }
    </th>;
  }

  var city = referenceCityID();
  for each (var id in cityIDs()) {
    // data is { t: timestamp, r: currentResources(), p: reapingPace() } or str
    var data = config.getCity("r", "", id), p;
    if (!isObject(data)) {
      data = p = {};
    } else {
      p = data.p;
      var dt = (Date.now() - ((new Date(data.t)).getTime())) / 3600e3;
      data = copy(data.r);
      //console.log(id +": "+ Math.floor(p.w*dt) + " | "+ (data.w) +" | "+ (dt * 60));
      for (var r in p)
        data[r] = Math.floor((data[r] || 0) + p[r] * dt);
    }
    var tr = <tr/>;
    if (id == city) tr.@class = "current";
    var island = config.getCity("i", 0, id);
    grid[id] = data;
    for each (r in res) {
      var v = data[r] || "\xA0";
      if ("w" == r)
        v = <a class="text" href={ urlTo("wood", undefined, { city: id }) }
               title={sign(p[r])}>{v}</a>;
      else if (config.getIsle("r", "", island) == r)
        v = <a class="text" href={ urlTo("luxe", undefined, { city: id }) }
               title={sign(p[r])}>{v}</a>;
      else if ("W" == r && config.getCity("l", [], city)[buildingIDs.tavern])
        v = <span title={ sign(p.W) }>{v}</span>;
      tr.td += <td>{ v }</td>;
    }
    for each (var name in names) {
      var b = buildingIDs[name];
      var l = config.getCity(["l", b], undefined, id);
      if ("palace" == name && isUndefined(l)) {
        name = "palaceColony";
        l = config.getCity(["l", buildingIDs[name]], undefined, id);
      }
      var a = isUndefined(l) ? "\xA0"
                             : <a href={urlTo(name, id)} title={name}>{l}</a>;
      tr.td += <td class="building">{a}</td>;
    }
    table.* += tr;
  }
  table.tr[1].@class = "first " + (table.tr[1].@class || "");
  var ids = node({ after: $("citySelect"), tag: table });
  ids.headers.style.backgroundImage = "url("+ GM_getResourceURL("woody") +")";
  toggleOverview.table = ids.overview;

  var expander = $X('id("changeCityForm")//div[contains(@class,"dropbutton")]');
  onChange(expander, toggleOverview, "class");
}

// shows when each city is done in the city popup (and adds resource icons)
function showCityBuildCompletions() {
  var focused = referenceCityID();
  var isles = <div id="islandLinks"></div>;
  var isle = $X('id("changeCityForm")/ul/li[@class="viewIsland"]');
  var lis = get("citynames");
  var ids = cityIDs();
  var names = cityNames();
  if (names.length > 1) {
    var images = [];
    var links = <div style="left: -50%; position: absolute;"></div>;
  }
  for (var i = 0; i < lis.length; i++) {
    var id = ids[i];
    var url = config.getCity("u", 0, ids[i]);
    var res = config.getIsle("r", "", config.getCity("i", 0, id));
    var li = lis[i];
    var t = config.getCity("t", 0, ids[i]);
    if (t && t > Date.now() && url) {
      t = secsToDHMS((t - Date.now()) / 1e3, 0);
      node({ tag: "a", className: "ellipsis", href: url, append: li, text: t });
    }
    li.title = " "; // to remove the town hall tooltip

    if (res) {
      var has = {}; has[res] = "";
      var img = visualResources(has, { size: 0.5, noMargin: 1 });
      li.innerHTML = img + li.innerHTML;

      if (links) { // island link bar
        var a = <a href={urlTo("island", { city: id })} title={names[i]}
                   class="island-link" rel={"i" + id}></a>;
        images.push(img); // as we can't set innerHTML of an E4X node
        links.* += a;
      }

      img = $X('img', li);
      img.style.margin = "0 3px";
      img.style.background = "none";
      if (id == focused) {
        var current = $X('preceding::div[contains(@class,"dropbutton")]', li);
        current.insertBefore(img.cloneNode(true), current.firstChild);
        if (a) a.@style += " outline: 1px solid #FFF;";
      }
    }
  }
  if (!links || !isle) return;
  var width = "width: "+ (lis.length * 33) + "px";
  isles.@style += width;
  links.@style += width;
  isles += links;
  //prompt(!links || !isle, isles);
  isle.innerHTML += isles.toXMLString();
  $x('div/div/a', isle).forEach(kludge);
  $x('div/div//text()', isle).forEach(rm);

  function kludge(a, i) {
    a.innerHTML = images[i];
    img = $X('img', a);
    img.height = 10;
    img.width = 13;
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

function showUnitLevels(specs) {
  function level(what, unit, li, pre, post) {
    var l = 0;
    var is = what.charAt(), up = is.toUpperCase();
    var img = $X('img[@class="'+ what +'-icon"]', li);
    if (img)
      l = 4 - img.src.match(/(\d)\.gif$/)[1];
    $X('div/h4', li).innerHTML += pre + (unit[is] + unit[up]*l) + post;
  }
  function augmentUnit(li) {
    var stats = unitStatsFromImage($X('div[@class="unitinfo"]//img', li));
    level("att", stats, li, " (", "");
    level("def", stats, li, "/", ")");
  }
  $x('id("units")/li[div[@class="unitinfo"]]').forEach(augmentUnit);
}

function projectQueue() {
  var u = $x('id("unitConstructionList")//div[starts-with(@id,"queueEntry")]');
  u.forEach(projectCompletion);
}

function shipyardView() {
  dontSubmitZero();
  showUnitLevels(ships);
  projectQueue();
}

function barracksView() {
  dontSubmitZero();
  showUnitLevels(troops);
  projectQueue();
}

function unitStatsFromImage(img) {
  function normalize(name) {
    return name.replace(/[ -].*/, "").toLowerCase();
  }
  var name = img.src.split("/").pop();
  if (name) {
    var junk = /^(ship|y\d+)_|_(r|\d+x\d+)(?=[_.])|_faceright|\....$/g;
    var ship = /ship_/.test(name);
    name = name.replace(junk, "");
    name = { medic: "doctor", marksman: "gunsman",
             steamgiant: "steam" }[name] || name;
    if (!ship)
      for (var id in troops)
        if (normalize(troops[id].n) == name)
          return troops[id];
    for (var id in ships)
      if (normalize(ships[id].n) == name)
        return ships[id];
  }
}

function workshopView() {
  function show(td, base, delta, upkeep) {
    var img = $X('img', td);
    var type = img && img.src.match(/_([^.]+).gif$/)[1];
    var level = { bronze: 0, silber: 1, gold: 2 }[type];
    var opacity, stat, last, tag;
    for (var l = 2; l >= 0; l--) {
      var l1 = base + delta * l; // \uFFEB \u27A0 #906646
      var l2 = l1 + delta;
      var stat = l1;
      if (l != level) {
        opacity = "0.5"
      } else {
        opacity = "1.0";
        if (type == "gold" &&
            !$X('following-sibling::td[a[@class="button"]]', td))
          stat = l2;
      }
      var icon = img.src.replace(type+".gif", levels[l]+".gif");
      tag = { tag: <div class="stats">
        <span style={"opacity:"+ opacity}>{ (l2 / upkeep).toFixed(2) }</span>
        <img style="margin: 0" src={icon} height="10"/>
        <span style={"opacity:"+ opacity}>/</span>
        <img style="margin: 0" src={gfx.gold} height="10"/>
      </div> };
      if (!last) tag.append = td; else tag.before = last;
      last = node(tag);
      node({ className: "stats", after: img, text: l1 +" \u27A1 "+ l2,
             style: { opacity: opacity }});
    }
    node({ append: $X('following::ul[@class="resources"]', td), tag:
           <li class="time" style={"background-image: url("+ gfx.upkeep +")"}>
             { upkeep } / h
           </li> });
  }

  function augment(tr) {
    var stats = unitStatsFromImage($X('td[@class="object"]/img', tr))
    if (stats) {
      var cells = $x('td/table[@class="inside"]/tbody/tr[1]/td[1]', tr);
      show(cells[0], stats.a, stats.A, stats.u);
      show(cells[1], stats.d, stats.D, stats.u);
    }
  }

  var levels = ["bronze", "silber", "gold"];
  $x('id("demo")//tr[td[@class="object"]]').forEach(augment);
  projectCompletion("upgradeCountdown", "done");
}

function showSafeWarehouseLevels() {
  function showSafeLevel(div) {
    var n = "wood" == div.parentNode.className ? wood : rest;
    node({ tag: "span", className: "ellipsis", text: n, append: div });
  }
  var level = config.getCity(["l", buildingIDs.warehouse], 0);
  if (isUndefined(level)) return;
  var wood = buildingCapacity("warehouse", "wood", level);
  var rest = buildingCapacity("warehouse", "rest", level);
  $x('id("cityResources")/ul/li/*[@class="tooltip"]').map(showSafeLevel);
}

function showHousingOccupancy(opts) {
  var txt = $("value_inhabitants").firstChild;
  var text = txt.nodeValue.replace(/\s/g, "\xA0");
  var pop = projectPopulation(opts);
  //console.log(pop.toSource());
  var time = ":∞";
  if (pop.upgradeIn)
    time = ":" + secsToDHMS(pop.upgradeIn, 0);
  else //if (pop.asymptotic > pop.maximum)
    time = "/" + sign(pop.maximum - pop.current);
  txt.nodeValue = text.replace(new RegExp("[:)/].*$"), time +")");

  var townSize = $X('id("information")//ul/li[@class="citylevel"]');
  if (townSize && mainviewIsReferenceCity())
    node({ id: "townhallfits", className: "ellipsis", append: townSize,
           text: pop.current +"/"+ pop.maximum +"; "+ sign(pop.growth) +"/h" });
  return pop;
}

function getFreeWorkers() {
  return integer($("value_inhabitants").textContent.match(/^[\d,.]+/)[0]);
}

function getPopulation() {
  return integer($("value_inhabitants").textContent.match(/\(([\d,.]+)/)[1]);
}

function getMaxPopulation(townHallLevel) {
  if (isUndefined(townHallLevel))
    townHallLevel = buildingLevel("townHall", 1);
  var maxPopulation = buildingCapacity("townHall", townHallLevel);
  if (config.getServer("techs.2080"))
    maxPopulation += 50; // Holiday bonus
  if (config.getServer("techs.3010") && isCapital())
    maxPopulation += 50; // Well Digging bonus (capital city only)
  return maxPopulation;
}

function projectPopulation(opts) {
  function getGrowth(population) {
    return (happy - Math.floor(population)) / 50;
  }
  var wellDigging = isCapital() && config.getServer("techs.3010") ? 50 : 0;
  var holiday = config.getServer("techs.2080") ? 25 : 0;
  var tavern = 12 * buildingLevel("tavern", 0);
  var wineLevel = opts && opts.hasOwnProperty("wine") ? opts.wine :
    config.getCity(["x", buildingIDs.tavern], 0);
  var wine = 80 * buildingCapacities.tavern.indexOf(wineLevel);
  var museum = 20 * buildingLevel("museum", 0);
  var culture = 50 * config.getCity(["x", buildingIDs.museum], 0);
  var happy = 196 + wellDigging + holiday + tavern + wine + museum + culture;
  //console.log(wellDigging, holiday, tavern, wine, museum, culture, happy);

  var population = opts && opts.population || getPopulation();
  var corr = corruption();
  happy -= Math.ceil(corr * population);
  //console.log("corruption: "+corr+" => -"+ Math.ceil(corr * population));
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
    if (opts && opts.popgte && population >= opts.popgte)
      return time;
  }
  if (opts && opts.popgte) return Infinity;

  var hint = $("cityNav"), warn = true;
  if (asymptoticPopulation <= maximumPopulation) {
    hint.title = "Reaches asymptotic population "+ asymptoticPopulation +"/"+
      maximumPopulation +" at "+ resolveTime(time, 1);
    warn = false;
  }

  var people = $("value_inhabitants");
  var hqLevel = buildingLevel("townHall");
  var nextHQUpgradeTime = parseTime(costs[0][hqLevel].t);
  var upgradingTownHall = $X('id("done")/../@href = "'+ urlTo("townHall") +'"');

  hint.title = lang.full + resolveTime(time, 1);
  // < 15 min left for expanding Town Hall ahead of time to meet growth?
  if (warn) {
    if (time < 15 * 60 + nextHQUpgradeTime && !upgradingTownHall)
      people.className = "storage_danger";
    if (population == maximumPopulation)
      people.className = "storage_full";
    else
      people.className = "";

    if (!upgradingTownHall)
      hint.title += lang.startExpand +
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
  var tag = isString(id) ? $(id) : id, set = false;
  if (isNumber(className)) className = loc = undefined; // called by forEach/map
  if (tag) {
    id = tag.id;
    // console.log("T: %x", $("servertime").textContent);
    // console.log("L: %x", tag.textContent);
    // console.log("D: %x", parseTime(tag.textContent));
    // console.log("F: %x", resolveTime(parseTime(tag.textContent)));
    var time = parseTime(tag.textContent);
    var done = resolveTime(time);
    var div = node({ tag: tag.nodeName.toLowerCase(), className: className,
                     after: tag, text: done });
    time = time * 1e3 + Date.now();
    var key = { resource: "wu", tradegood: "ru" }[urlParse("view")];
    if ("upgradeCountDown" == id)
      set = key ? config.setIsle(key, time) : config.setCity("t", time);
    if ("cityCountdown" == id) {
      set = config.setCity("t", time);
      var move = $X('ancestor::*[contains(@class,"timetofinish")]', tag);
      if (move)
        move.style.marginLeft = "-40%";
    }
    if (set) {
      if (isString(loc))
        loc = $X(loc, tag);
      else if (isUndefined(loc))
        if (location.search.match(/\?/))
          loc = location;
        else
          loc = { href: urlTo(document.body.id) };
      if (loc)
        config.setCity("u", loc.href);
    }
  }
  return time;
}

function tavernView() {
  function amount() {
    return integer(wine.options[wine.selectedIndex]) || 0;
  }
  function makeGrowthrate() {
    var style = {
      position: "absolute",
     textAlign: "center",
        margin: "0 auto",
         width: "100%"
    };
    return node({ tag: "span", id: "growthRate", className: "value",
                style: style, before: $("citySatisfaction") });
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
  config.setCity(["x", buildingIDs.tavern], amount());
  recalcTownHall();
}

function title(detail) {
  var server = location.hostname.match(/^s(\d+)\.(.*)/), host = "";
  if (server) {
    host = " "+ server[2];
    server = "αβγδεζηθικλμνξοπρστυφχψω".charAt(parseInt(server[1], 10)-1);
  }
  if (!detail)
    detail = $X('id("breadcrumbs")/*[last()]');
  if (detail)
    document.title = (server ? server + " " : "") + detail.textContent + host;
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
    sell[0].value = Math.min(have, 100 + integer(sell[0].value || 0));
    sell[1].value = Math.max(25, integer(sell[1].value));
  }
  function sellAll(e) {
    var have = haveHowMuch(e);
    var sell = $x('following::input[@type="text"]', e.target);
    sell[0].value = have;
    sell[1].value = Math.max(25, integer(sell[1].value || 0));
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
  var panel = <div class="dynamic">
    <h3 class="header">
      Kronos {version}:
      <a href={"#"+ config.get("language")} id="language">{lang.language}</a>
      <a href={urlTo("library")} title="Library" class="help">
        <span class="textLabel">Library</span>
      </a>
    </h3>
    <div id="kronos" class="content" style="margin: 3px 10px;"> </div>
    <div class="footer"></div>
  </div>;

  var tags = node({ tag: panel, before: $("mainview") });
  tags.language.addEventListener("click", promptLanguage, false);

  var research = config.getServer("techs.research.n", "");
  if (research) {
    var done = config.getServer("techs.research.t", 0);
    if (done) done = resolveTime((done - Date.now()) / 1e3, 1);

    var a = node({ prepend: tags.kronos, tag: <>
<a id="researching" href={urlTo("academy") || urlTo("researchAdvisor")}>
  {done ? done + " \u2014" : lang.researching + ":"} {research}
</a><br/></> }).researching;

    var tech = techinfo(research);
    if (tech)
      a.title = tech.x +" ("+ tech.p +" "+ lang.points +")";
  }
  return tags.language;
}

function islandID(city) {
  return urlParse("id", $X('//li[@class="viewIsland"]//a').search);
}

function referenceIslandID(city) {
  city = city || referenceCityID();
  return config.getCity("i", city);
}

function referenceCityID(index) {
  if (index) return $("citySelect").selectedIndex;
  var names = get("citynames"), name;
  for (var i = 0; name = names[i]; i++)
    if (/active/.test(name.className||""))
      return cityIDs()[i];
}

function cityID() {
  var id = urlParse("cityId") || urlParse("id");
  var view = urlParse("view");
  if (id)
    if (buildingIDs.hasOwnProperty(view) && !urlParse("type") ||
        { city:1 }[view])
      return integer(id);
  var a = $X('//li[@class="viewCity"]//a');
  return a && integer(urlParse("id", a.search));
}

function cityIDs() {
  return pluck($x('id("citySelect")/option'), "value").map(integer);
}

function mainviewIslandID() {
  var city = $X('id("breadcrumbs")//a[@class="island"]');
  return city && urlParse("id", city.search);
}

function mainviewIsReferenceCity() {
  return cityName() == mainviewCityName() && mainviewOnReferenceIsland();
}

function mainviewOnReferenceIsland() {
  return islandID() == mainviewIslandID();
}

function mainviewCityID() {
  var city = $X('id("breadcrumbs")/a[@class="city"]');
  if (city) return number(urlParse("id", city.search));
}

function mainviewCityName() {
  var city = $X('id("breadcrumbs")//*[@class="city"]');
  if (city) return city.textContent;
}

function cityName() {
  return cityNames()[referenceCityID("index")];
}

function cityNames() {
  return pluck(get("citynames"), "textContent");
}

function isCapital(city) {
  city = city || cityID();
  var capital = config.getServer("capital", 0);
  if (capital)
    return city == capital;
  return city == cityIDs()[0];
}

function isMyCity() {
  return cityIDs().indexOf(mainviewCityID()) != -1;
}




function hideshow(node, nodes) {
  function listen(on) {
    on.addEventListener("mouseover", function(){ show(node); }, false);
    on.addEventListener("mouseout",  function(){ hide(node); }, false);
  }
  nodes = nodes || [node];
  nodes.forEach(listen);
}

//unsafeWindow.g = config;
//unsafeWindow.data = data;
//unsafeWindow.s = server;
