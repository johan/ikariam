revision("$Revision$");

// meta views:

function financesView() {
  var costs = $x('id("balance")/tbody/tr[position() < last()]/td[3]');
  for each (var id in cityIDs())
    setMaintenanceCost(integer(costs.shift()), id);
}

function setMaintenanceCost(n, cityID) {
  return config.setCity("m", n, cityID);
}
function maintenanceCost(cityID) {
  return config.getCity("m", 0, cityID);
}

function linkPlayer(name) {
  var player = trim(name.textContent);
  var land = country;
  if (land.length > 3)
    land = land.replace(/\.?\w{3}\.?/, "");
  land = ({ org:"en", com:"us", net:"tr" })[land] || land;
  var url = "http://ikariam.ogame-world.com/suche.php?view=weltkarte&land=" +
    land + "&welt="+ integer(location.hostname) +"&spieler=" + player;
  node({ tag: <><a target="_blank" href={ url }>{ player }</a></>,
         replace: name });
}

function findPlayers() {
  setTimeout(function() {
    $x('//li[@class="owner"]/span/following-sibling::text()').map(linkPlayer);
  }, 1e3);
  console.log("!");
}

function cityView() {
  var id = urlParse("id", $X('id("advCities")//a').search);
  if (id) {
    var name = mainviewCityName();
    if (name) config.setCity("n", name, id);
    var isle = mainviewIslandID();
    if (isle) config.setCity("i", isle, id);
  }
  projectCompletion("cityCountdown", null, '../preceding-sibling::a');
  levelBat();
  cssToggler("buildinglevels", false, "http://i297.photobucket.com/albums/mm209/apocalypse33/Avatar/Ava51.png", "li > div.rounded { display: none; }");
  findPlayers();
}


// would ideally treat the horrid tooltips as elsewhere, but they're dynamic X-|
function merchantNavyView() {
  function missionType(mission, t1_vs_t2, c1, c2) {
    var R = "right", L = "left", x = "swap";
    var data = {// arrival<end  arrival==end  arrival>end  (",  " == verified)
      colMiss: { "-1": [R,  ],  "0": [R   ],  "1": [R   ] },
      colUndo: { "-1": [L,  ],  "0": [L   ],  "1": [L   ] },
      attMiss: { "-1": [R,  ],  "0": [L, x],  "1": [L, x] },
      attUndo: { "-1": [L   ],  "0": [L   ],  "1": [L   ] },
      attBack: { "-1": [L   ],  "0": [L   ],  "1": [L, x] },// 0: YOUR name :/
      buyMiss: { "-1": [R,  ],  "0": [L,  ],  "1": [R   ] },
      buyUndo: { "-1": [L   ],  "0": [L   ],  "1": [L   ] },
      buyBack: { "-1": [L,  ],  "0": [L, x],  "1": [L, x] },
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
    if (c2.nextSibling) {
      rm(c2.nextSibling);
      var player = c2.nextSibling.nodeValue.replace(/(^\( *| *\) ?$)/g, "");
      rm(c2.nextSibling);
      node({ text: player, className: "ellipsis price", append: td[1] });
    }

    var direction, msn, swap;
    [msn, direction, swap] = missionType(mission, compare(t1, t2), c1.nodeValue, c2.nodeValue);
    var arrow = tr.insertCell(1);
    if (cityNames().indexOf((swap ? c2 : c1).textContent) == -1) {
      swap = !swap; // when possible, salvage ambiguous contexts
    }
    if (swap) {
      //console.log("replacing row " + (i+1));
      td[1].replaceChild(c1, c2);
      td[0].appendChild(c2);
      [c1, c2] = [c2, c1];
    }
    linkCity(c2, player);
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
        //console.log(goods[i] +": "+ count[goods[i]]);
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

  tab3('id("mainview")/div/h1');

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
  $x('(tr/td | tr/td/div)[@onmouseover]', table).forEach(showResources);
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
               './/*[@id="mainview"]//div[@class="content"]/table/tbody',
               !"runGM", !!"div");
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
    var points = /\(([0-9,.]+)/.exec(data.p);
    data.p = points ? integer(points[1]) : 0;
    data.d = data.d.map(linkID);
    data.x = trim(data.x.replace(/\s+/g, " ").match(/(\S+:.*)/)[1]);
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


// misc views:

function safehouseReportsView() {
  var mission = $X('normalize-space(id("mainview")//tr[1]/td[2])');
  //console.log("safehouse: "+ mission);
  if (texts.spyWarehouse == mission)
    warehouseSpy();
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
      loot += lootable;
      node({ tag: "td", text: Math.floor(lootable), append: tr });
    }
  }

  var body = $X('id("resources")/tbody');
  if (!body) return;

  var found, loot = 0;
  var nameTD = $X('id("mainview")//tr[2]/td[2]');
  var cityName = nameTD.textContent;
  var allCities = config.getServer("cities");
  for (var id in allCities) {
    var city = allCities[id];
    if (city.n != cityName) continue;
    if (city.l) {
      found = true;
      var a = <><a href={urlTo("city", id)}>{ cityName }</a> (</>;
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
  var guess = found && buildingLevel("port", 0, "save", id);
  var port = isDefined(guess) ? guess : prompt("Port level? (0 for no port)", guess || 0);
  if (port === null || !isNumber(port = integer(port))) return;
  guess = found && buildingLevel("warehouse", 0, "save", id);
  var warehouse = isDefined(guess) ? guess : prompt("Warehouse level? (0 for no warehouse)", guess || 0);
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

  head = $X('id("mainview")//tr[1]');
  var boats = head.insertCell(2);
  boats.setAttribute("rowspan", "4");
  boats.className = "boats";
  node({ tag: <div>
           <div class="loot">{ Math.ceil(loot/300) }</div>
           <div class="all">({ Math.ceil(all/300) })</div>
         </div>, append: boats });
}





// map views:

function worldmap_isoView() {
  function randomizableCoords() {
    function changeCoords(e) {
      function edit(n) {
        with ($(n))
          value = e.altKey ? 100 - value : Math.floor(100 * Math.random());
      }
      edit("inputXCoord");
      edit("inputYCoord");
      click($X('id("mapCoordInput")/input[@name="submit"]'));
    }
    clickable({ prepend: $("mapCoordInput") }, changeCoords, "dice");
  }

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

  randomizableCoords();
}


function islandView() {
  function cultureTreatyMassMessage() {
    //toggler(gfx.stamina, toggleClickMode);
  }

  function alliancePresence() {
    var all = {}, main = $("mainview");
    var a = node({ append: main, tag:<table id="alliances"></table> });
    cssToggler("alliances", true, gfx.alliances, <><![CDATA[
#container #mainview #alliances {
  display: none;
}
]]></>);
    a = a.alliances;
    for each (var city in c) {
      var name = $X('string(li[@class="ally"]/a[1])', city) || "-";
      all[name] = (all[name] || []).concat(integer(city.parentNode.id));
    }
    for (name in all) {
      var tr = a.insertRow(0);
      tr.insertCell(0).textContent = all[name].length;
      tr.insertCell(0).textContent = name;
    }
  }

  function nextprevfind(event) {
    if (notMyEvent(event)) return;
    var n = event.charCode || event.keyCode;
    if (n == "-".charCodeAt()) return findPlayers();
    var next = { 37: prevIsland, 39: nextIsland }[n];
    if (next &&
        !(event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)) {
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
  var island = integer(urlParse("id", $X('id("wonder")/a').search));
  if (island) {
    addEventListener("keypress", nextprevfind, false);
    travelDistanceBreadcrumbs(island);
  }

  var c = $x('id("cities")/li[contains(@class,"level") and ' +
             ' not(contains(@class,"level0"))]/ul[@class="cityinfo"]');
  c.forEach(registerCity);
  alliancePresence();

  cssToggler("playernames", false, "http://i297.photobucket.com/albums/mm209/apocalypse33/Avatar/Ava52.png", "#island #container #mainview #cities .textLabel.player-name { display: none; }");

  showSpies();

  showMinimap(island);
}

// island view: selected city
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
    if ((t = travelTime(x, y)))
      node({ id: "travel_time", tag: "span", text: " ("+ secsToDHMS(t) +")",
             append: breadcrumbs });
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

function showMinimap(i) {
  function createMinimap() {
    return node({ tag: <iframe id="miniMap" src={ u }/>, append: b }).miniMap;
  }

  function toggleMinimap() {
    var m = $("miniMap") || createMinimap();
    m.style.visibility = m.style.visibility ? "" : "visible";
  }

  var me = cityIDs().map(referenceIslandID).join(",");
  var u = base +"minimap.html?s="+ location.hostname +"&t=_top&w=7&h=7&c="+
    i +"&r=0&red="+ me +"&white="+ i;
  var b = $("breadcrumbs");
  toggler(gfx.world, toggleMinimap, u.replace(/([wh])=7/g, "$1=33"));
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
    var level = integer(li.className);
    var city = $X('a[@onclick]/span', li);
    if (!city) return; // new city site
    var name = $X('.//text()[string-length(normalize-space(.)) > 0]', city);
    if (name) {
      var span = name.parentNode;
      if (span.nodeName != "SPAN") span = name.precedingSibling;
      var id = integer($X('a', li).id);
      config.setCity(["l", buildingIDs.townHall], level, id);

      var wl = config.getCity(["l", buildingIDs.wall], "", id);
      if ("" != wl && config.get("debug"))
        level += "/"+ wl;

      var cityname = name.nodeValue;
      name.nodeValue = level +":"+ cityname;
      name = name.parentNode;
      name.style.left = Math.round((name.offsetWidth) / -2 + 34) + "px";

      // z: 0: normal, 1: vacation, 2: inactive;
      // Z: 1/2: first seen in this state
      var type = { vacation: 1, inactivity: 2 }[span.className] || 0;
      var last = config.getCity("z", 0, id);
      var time = config.getCity("Z", 0, id);
      var now = (new Date).getTime();
      if (type)
        time = last == type ? time : now;
      //console.log("%x %x %d:%s", type, span, id, trim(cityname));
      config.setCity("Z", time, id);
      config.setCity("z", type, id);
      if (time) {
        time = (now - time) / 1e3;
        time = time >= 86400 ? secsToDHMS(time, 0) +" " : "";
        span.textContent = span.textContent.replace(/\((.)\)/, "("+time+"$1)");
      }
    }

    var player = city.cloneNode(true);
    player.innerHTML = '<span class="before"></span>Player name' +
      '<span class="after"></span>';
    name = trim($X('ul/li[@class="owner"]/text()[1]', li).textContent);
    player.childNodes[1].nodeValue = name;
    addClass(player, "player-name");

    city.parentNode.insertBefore(player, city.nextSibling);
    player.style.top = "84px";
    player.style.left = Math.round((player.offsetWidth) / -2 + 34) + "px";

    var msg = $X('ul/li[@class="owner"]/a', li);
    if (msg) {
      //player.title = msg.title;
      clickTo(player, addToFriendList);
      dblClickTo(player, msg.href);
    }
  }

  $x('//li[starts-with(@class,"cityLocation city level")]').forEach(level);
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


// building views:

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


function townHallView() {
  var g = { context: $("PopulationGraph") };
  linkTo("wood", 'div[@class="woodworkers"]/span[@class="production"]', 0, g);
  linkTo("luxe", 'div[@class="specialworkers"]/span[@class="production"]', 0,g);
  linkTo("academy", 'div[@class="scientists"]/span[@class="production"]', 0, g);
  var value, city = mainviewCityID();
  var science = $X('div[@class="scientists"]//span[@class="count"]', g.context);
  if (science)
    config.setCity(["x", buildingIDs.academy], integer(science), city);

  var growth = $("SatisfactionOverview");
  var tavern = $X('.//div[@class="cat wine"]', growth);
  var tlevel = $X('div[@class="tavern"]/span[@class="value"]', tavern);
  if (tlevel) {
    clickTo(tavern, "tavern");
    config.setCity(["l", buildingIDs.tavern], integer(tlevel) / 12, city);
    value = integer($X('div[@class="serving"]/span[@class="value"]', tavern));
    value = buildingCapacities.tavern[value / 80];
    config.setCity(["x", buildingIDs.tavern], value, city);
  }
  var museum = $X('.//div[@class="cat culture"]', growth);
  var mlevel = $X('div[@class="museum"]/span[@class="value"]', museum);
  if (mlevel) {
    clickTo(museum, "museum");
    config.setCity(["l", buildingIDs.museum], integer(mlevel) / 20, city);
    value = integer($X('div[@class="treaties"]/span[@class="value"]', museum));
    config.setCity(["x", buildingIDs.museum], value / 50, city);
  }
  //var c = $X('id("CityOverview")//li[@class="corruption"]//*[contains(.,"%")][1]');

  if ($X('.//div[@class="capital"]', growth))
    config.setServer("capital", cityID());
}


function safehouseView() {
  $x('//li/div[starts-with(@id,"SpyCountDown")]').forEach(projectCompletion);
  altClickTo($X('id("units")/li/div/a[@class="button"]'), spySelf);
}

function spySelf() {
  goto(urlTo("spy", mainviewCityID()));
}


function embassyView() {
  function link(url, title, was) {
    node({ tag: <a href={ url }>{ title }</a>, replace: was });
  }

  function lastOn(td) {
    var t = td.title.match(/[\d.]{10}/)[0];
    td.textContent = t.split(".").reverse().join("-");
  }

  var t = $X('id("mainview")/div[@class="contentBox01h"][1]//tbody');
  var td = $x('tr/td[2]', t);
  var txt = td[4]; // alliance page
  var u = txt.textContent.match(/^http:\/\/\S*/);
  if (u) link(u[0], txt.textContent, txt.firstChild );

  var n = td[3].textContent.split(/\s+/)[0]; // placement (i e "4 (1,340,785)")
  link(url("?view=allyHighscore&offset="+ Math.floor(integer(n)/100)),
       td[3].textContent, td[3].firstChild);
  $x('id("memberList")/tbody/tr/td[contains(@class,"line")]').forEach(lastOn);
}


function museumView() {
  function link(td) {
    var player = $X('preceding-sibling::td[@class="player"]', td).textContent;
    linkCity(td.firstChild, player);
  }

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

  $x('//td[@class="capital"]').map(link);
}


function academyView() {
  updateCurrentResearch();
  var research = $("inputScientists");
  if (research)
    config.setCity(["x", buildingIDs.academy], integer(research));
}

function updateCurrentResearch() {
  var research = $X('//div[@class="researchName"]/a');
  if (research)
    config.setServer("techs.research.n", research.title);
  config.setServer("techs.research.t", projectCompletion("researchCountDown"));
}


function branchOfficeView() {
  function makeRadios(select) {
    var td = select.parentNode, id = select.name;
    for each (var opt in $x('option', select)) {
      var radio = <input type="radio" name={select.name} value={opt.value}/>;
      if (opt.hasAttribute("selected")) radio.@checked = true;
      node({ tag: <label>{radio} {opt.textContent} </label>,
             append: select.parentNode });
    }
    rm(select);
  }

  function factor(table) {
    sumPrices(table, 1, 3);
    $x('tbody/tr/td/select', table).forEach(makeRadios);
  }
  scrollWheelable();
  $x('id("mainview")//table[@class="tablekontor"]').forEach(factor);
  clickResourceToSell();
}


function portView() {
  setTimeout(projectCompletion, 4e3, "outgoingOwnCountDown");
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


// Military stuff:

// soak up all stationed military units data at once
function premiumMilitaryAdvisorView() {
  function parse(table) {
    var cities = cityIDs();
    var units = $x('tbody/tr/th[position() > 1]/img', table);
    units = pluck(units.map(unitStatsFromImage), "id");
    var rows = $x('tbody/tr[td]', table);
    for each (var cid in cities) {
      var tr = rows.shift();
      var td = $x('td[position() > 1]', tr);
      for (var i = 0; i < td.length; i++) {
        var count = integer(td[i]);
        if (!isNaN(count)) {
          //console.log(cid+"/"+units[i]+": "+count);
          config.setCity(["T", units[i]], count, cid);
        }
      }
    }
  }
  $x('//div[@class="content"]/table').forEach(parse);
}

function militaryAdvisorCombatReportsView() {
  function read(e) {
    if ((e.keyCode||e.charCode) != "-".charCodeAt()) return;
    removeEventListener("keypress", read, false);
    proceed();
  }

  function proceed() {
    var a = unknowns.pop();
    if (a) {
      // this recurses back into militaryAdvisorCombatReportsView in a subframe
      wget(a.href, proceed, !!"runGM", !"div");
      a.style.opacity = "0.5";
    } else {
      location.href = "index.php?view=militaryAdvisorCombatReports";
    }
  }

  function unpage(reports) {
    reports.forEach(function(report) {
      node({ tag:"tr", html:report.innerHTML, before: paginationbar });
    });
    proceedunpage();
  }

  function proceedunpage() {
    var a = ppages.shift();
    if (a) {
      wget$x(a.href, unpage,
             'id("finishedReports")/table[@class="operations"]//tbody/' +
             'tr[td[contains(@class,"subject")]]', !"runGM", !!"div");
      a.style.opacity = "0.5";
    } else {
      hide(paginationbar);
      doneunpage();
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
      allreps[r] = { t: t, w: 0 + w };
    } else {
      allreps[r].w = 0 + w;
    }
    rows[n] = copy(allreps[r]);
    rows[n].tr = tr;
  }

  function doneunpage() {
    GM_setValue("militaryReportsCache", table.innerHTML);

    tab3('id("tabz")/tbody/tr/td/a');

    var reports = $x('id("finishedReports")/table[@class="operations"]/tbody/' +
                     'tr[td[contains(@class,"subject")]]');
    reports.forEach(fileReport);

    for (var i = reports.length; --i >= 0;) {
      var tr = reports[i];
      var a = $X('.//a[not(starts-with(@href,"javascript:"))]', tr);
      var r = allreps[repId[i]];

      if (!r.c || (r.w && !r.l)) {
        unknowns.push(a);
        a.style.fontStyle = "italic"; // Warn about it! Read that report, please.
        a.innerHTML = "?: "+ a.innerHTML;
      }
    }
    var header = $X('id("troopsOverview")/div/h3');
    var reload = node({ tag: "a", text: "Refresh",
                        style: { marginLeft: "8px" }, append: header });
    clickTo(reload, function() {
      location.href = "index.php?view=militaryAdvisorCombatReports";
    });

    if (unknowns.length)
      addEventListener("keypress", read, false);
    doneproceed();
  }

  function doneproceed() {
    GM_setValue("militaryReportsCache", "");
    prettify();
  }

  function prettify() {
    allreps = config.getServer("battles.reports",{});

    cities = config.getServer("cities", {});
    repId = [];
    rows = [];

    var reports = $x('tbody/tr[td[contains(@class,"subject")]]', table);
    reports.forEach(fileReport);

    var yesterday = getServerTime(-25*3600), oldjunk = 0;
    for (var i = reports.length; --i >= 0;) {
      var tr = reports[i];
      var a = $X('.//a', tr);
      var r = allreps[repId[i]];

      var recent = r.t > yesterday;

      if (r.c) {
        if (recent)
          addClass(tr, "today");
        else
          for (var ii = i-1; --ii >= 0;)
            if (r.c == allreps[repId[ii]].c) {
              $X('.//input', tr).checked = "checked";
              oldjunk++;
              break;
            }
        var name = cities[r.c].n;
        var text = a.textContent;
        text = text.slice(0, text.lastIndexOf(name));
        a.textContent = text;
        node({ tag: <a href={urlTo("island", { island: cities[r.c].i, city: r.c })}
          rel={"i" + r.c}>{name}</a>, after: a });
      }
    }
    if (oldjunk)
      setTimeout(function() { $("command").selectedIndex = 1; }, 500);
    config.setServer("cities", cities);
    config.setServer("battles.reports",allreps);
    makeLootTable(table, rows);
  }

  var table = $X('id("finishedReports")/table[@class="operations"]');
  if (!table) return;

  var paginationbar = $X('.//tbody/tr[td[contains(@class,"all")]][1]', table);
  var unknowns = [];
  var pages = [];
  var allreps = config.getServer("battles.reports", {});
  var repId = [];
  var rows = [];
  var cities = config.getServer("cities", {});
  var ppages = $x('.//a[not(starts-with(@href,"javascript:"))]', paginationbar);
  var crCount = $X("id('tabz')/tbody/tr/td[2]/a/em");

  if (!window.frameElement) { // not started unwrapping the page?
    proceedunpage();
  } else { // later subpage during unwrapping ():
    table.innerHTML = GM_getValue("militaryReportsCache", "");
    doneunpage();
  }
}



function militaryAdvisorReportViewView() {
  var loot = parseResources('//td[@class="winner"]/ul[@class="resources"]/li');
  var a = $X('id("mainview")//a[contains(@href,"selectCity")][last()]');
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

  var q = urlParse();
  var url = "?view=militaryAdvisorReportView&";
  var panel = $("troopsReport");
  var detail = $X('//a[contains(@href,"'+ url +'")]') ||
    node({ append: $("ergebnis").insertRow(-1).insertCell(0),
           tag: <><a id="detail">Detailed combat report</a>
           &gt;&gt;</> }).detail;
  detail.parentNode.setAttribute("colspan", "7");
  var lastrow = rm(detail.parentNode.parentNode);

  if (q.combatId) {
    var wall = $X('id("ergebnis")//td[img[contains(@src,"wall.gif")]]');
    var buildings = config.getCity("l", {}, city);
    var defense = $X('following-sibling::td[contains(.,"%")]', wall);
    if (defense && wall) {
      var text = wall.lastChild, txt = text.nodeValue;
      wall = buildings[buildingIDs.wall] = wallLevel(defense, city);
      text.nodeValue = txt.replace(":", " "+ wall +":");
      config.setCity("l", buildings, city);
    }
    url += "detailedCombatId="+ q.combatId +'#before=id("troopsReport"):'+
      encodeURIComponent(encodeURIComponent(trim(panel.innerHTML)));
  } else return detailedCombatView(); /* {
    return $("ergebnis").appendChild(lastrow);
    url += "combatId="+ q.detailedCombatId +'#after=id("troopsReport"):'+
      encodeURIComponent(encodeURIComponent(trim(panel.innerHTML)));
  } */

  $("ergebnis").appendChild(lastrow);
  detail.href = url;
}


function militaryAdvisorMilitaryMovementsView() {
  function project(div) {
    var li = $X('ancestor::li', div)
    projectCompletion(div);
    li.style.height = "52px";
  }
  $x('//li/div/div[contains(@id,"CountDown")]').forEach(project);
  tab3('id("tabz")/tbody/tr/td/a');
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
    if (/\btoday\b/.test(tr.className||""))
      has.push("today");
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
        if (wonToday > 5) {
          addClass(td, "warn"); // bash alert!
          has.push("warn");
        }
      }
      if (!loot || !loot[r]) continue;
      td.className = "number";
      var got = {}; got[r] = loot[r];
      td.innerHTML = visualResources(got, { size: 0.5 });
      has.push(r);
    }
    tr.className = (tr.className||"").replace(/^.*( non-filtered)*$/,
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
  var title = [, , "$time",
               "$gold", "$wood", "$wine", "$marble", "$glass", "$sulfur",
               "$journeytime", "#", "$bigcity"];
  for (var i = 0; i < 13; i++) {
    var r = cols[i];
    var t = title[i] || "";
    var th = node({ className: r ? "$journeytime" == t ? "": "number" : "",
                    tag: i && i < 12 ? "th" : "td",
                    html: visualResources(t, { maxheight:"22px" }),
                    append: head });
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
    if ("$time" == t) clickTo(th, sortByWhen);
    if ("$bigcity" == t) clickTo(th, sortByCity);
    if ("$journeytime" == t) { clickTo(th, sortByDistance); continue; }
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

  var yesterday = getServerTime(-25*3600);

  for (var i = 0; r = reports[i]; i++) {
    var recent = r.t > yesterday;
    if (recent && r.c) {
      hits[r.c] = 1 + (hits[r.c] || 0);
    }
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


// augments combat detail reports with troop strengths
function detailedCombatView() {
  function register(unit, i) {
    if (!unit.A || !unit.D) return;
    var div = ("Resistance" == unit.x ? 1.3 : 1) * wallBonus;
    var att = Math.max(0, Math.floor((a[i] - unit.a) / unit.A));
    var def = Math.max(0, Math.floor((d[i]/div - unit.d) / unit.D));
    att = Math.min(3, att);
    def = Math.min(3, def);
    units[unit.id] = n[i];
    levels[unit.id] = { a: att, d: def };
    var at = "["+ att +"]", dt = "["+ def +"]";
    att = <img alt={ at } title={ at } src={ gfx.sword(att) }/>;
    def = <img alt={ dt } title={ dt } src={ gfx.shield(def) }/>;
    att.@style = def.@style = "margin-left: -31px; position: absolute;";
    node({ prepend: attack[i], tag: att });
    node({ prepend: defend[i], tag: def });
  }
  var wallBonus = $X('//td[@colspan="15"][a]/text()[contains(.,"%")]');
  wallBonus = 1 + (!wallBonus ? 0 :
                   integer(wallBonus.textContent.match(/\d+%/)[0]) / 100);
  var c = $X('(//td[@colspan="15"]/a[contains(@href,"selectCity")])[last()]');
  var cid = urlParse("selectCity", c.search);
  var units = config.getCity("U", {}, cid);
  var player = config.getCity("o", null, cid);
  if (!player) return;

  var levels = config.getServer(["players", player, "u"], {});

  var trs = $x('id("result")/tbody/tr[th[@class="defenders"]][1]/' +
               'following-sibling::tr');
  var stats = $x('td/img', trs[0]).map(unitStatsFromImage);
  var counts = $x('td[text()]', trs[1]), n = counts.map(integer);
  var attack = $x('td[text()]', trs[2]), a = attack.map(number);
  var defend = $x('td[text()]', trs[3]), d = defend.map(number);
  stats.forEach(register);
  config.setCity("U", units, cid);
  config.setServer(["players", player, "u"], levels);
}


function deploymentView() {
  sendUnits("army");
}

function blockadeView() {
  sendUnits("fleet");
}

function plunderView() {
  var city = sendUnits();
  var wall = config.getCity(["l", buildingIDs.wall], NaN, city);
  if (!isNaN(wall)) {
    node({ append: $X('//div[@class="content"]/p/strong'), tag: <> (<img src={
           gfx.citywall } style="margin-bottom: -2px;"/> { wall })</> });
  }
}

function sendUnits(where) {
  function simulateBattle() {
    function count(input) {
      var unit = readUnit(input);
      var units = integer(input.value);
      if (empty) // pick the maximum available, if no units were selected
        units = integer($X('preceding::div[@class="amount"][1]', input));
      if (!units) return;
      var a = config.getServer(["techs", "units", unit.id, "a"], 0);
      var d = config.getServer(["techs", "units", unit.id, "d"], 0);
      stats[unit.id] = [units, a, d].join(".");
      return input;
    }

    var send = sending(), stats = {};
    var empty = !sum(send); // none selected?
    send.forEach(count);
    var to = $X('id("mainview")//input[@name="destinationCityId"]');
    if (to) {
      var player = config.getCity("o", "", city);
      if (player) {
        var nmiLevels = config.getServer(["players", player, "u"], {});
        for (var id in nmiLevels) {
          var l = nmiLevels[id];
          var n = config.getCity(["U", id], 0, city);
          stats[id] = (stats[id] || "0.0.0") +"."+ n +"."+ l.a +"."+ l.d;
        }
      }
      var levels = config.getCity("l", {}, city);
      stats["town"] = levels[buildingIDs.townHall] || 0;
      stats["wall"] = levels[buildingIDs.wall] || 0;
    }

    var url = "http://ikariamlibrary.com/?content=3&inline=yes&battleType=";
    url += ("fleet"==where ? "sea" : "land") +"&clear=true#"+ makeQuery(stats);

    var form = $("plunderForm") || $("blockadeForm");
    var div = node({ before: form, tag: <div class="contentBox01h" id="f">
      <h3 class="header">ImmortalNights&apos; IkaFight on
        <a href="http://ikariamlibrary.com/" target="_blank">Ikariam Library</a>
      </h3>
      <div class="content" id="ikafight"> </div>
      <div class="footer"> </div>
    </div> }).f;
    node({ append: $("ikafight"), tag: <iframe src={ url }/> });
    return div;
  }

  function ikaFight() {
    if (!ikaFight.loaded)
      ikaFight.loaded = simulateBattle();
    else
      toggle(ikaFight.loaded)
  }

  function readUnit(input) {
    var id = integer(input.id);
    var type = input.id.split("_")[1]; // army | fleet
    var unit = (type == "army" ? troops : ships)[id];
    return unit;
  }

  function sending() {
    return $x('//input[@type="text" and starts-with(@id,"cargo_")]');
  }

  function updateMilitaryScores() {
    function cost(input) {
      var n = integer(input.value);
      var unit = readUnit(input);
      score += milScoreFor(unit, n);
      var level = config.getServer;
      offense += n * (unit.a + level("techs.units."+unit.id+".a", 0) * unit.A);
      defense += n * (unit.d + level("techs.units."+unit.id+".d", 0) * unit.D);
    }
    var offense = 0, defense = 0, score = 0;
    sending().forEach(cost);
    $("militaryscore").textContent = formatNumber(Math.round(score*100)/100);
    if (!od) return;
    $("offense").innerHTML = formatNumber(offense);
    $("defense").innerHTML = formatNumber(defense);
  }

  if (config.getServer("techs.units."+ (where == "fleet" ? 210 : 301), 0)) {
    node({ tag: <div class="cost"><div id="offense">0</div></div>,
       prepend: $X('id("upkeepPerHour")/..') });
    node({ tag: <div class="cost"><div id="defense">0</div></div>,
       prepend: $X('id("estimatedTotalCosts")/..') });
    var od = true;
  }
  node({ tag: <div id="militaryscore">0</div>,
       after: $X('(//input[starts-with(@id,"cargo_")])[last()]') });
  onChange($x('//input[@type="text" and starts-with(@id,"cargo_")]'),
           updateMilitaryScores, "value", "watch");

  var to = $X('id("mainview")//input[@name="destinationCityId"]');
  var city = to && integer(to);

  scrollWheelable();
  dontSubmitZero(2, 'id("selectArmy")//input[@type="submit"]');
  toggler(gfx.swords, ikaFight);

  var level = config.getCity(["l", buildingIDs.townHall], undefined, city);
  if (level) {
    var owner = config.getCity("o", 0, city);
    var type = ["", "vacation", "inactivity"][config.getCity("z", 0, city)];
    var col = config.getServer("treaties", []).indexOf(owner)+1 ? "green" : "";
    node({ prepend: $X('//div[@class="content"]/p[strong]'), tag:
           <div class="k-target-city"><img src={ gfx.islecity(level, col) }/>
           <div class={ type }>{ level }</div></div> });
  }
  return city;
}


function workshopView() {
  function show(td, base, delta, upkeep, unit, ad, cost, stats) {
    function row(stats, cost, unit) {
      //console.log([stats,cost,unit].join("/"));
      return <div class="stats">
        <span style={"opacity:"+ opacity}>{ (stats / cost).toFixed(2) }</span>
        <img style="margin: 0" src={ icon } height="10"/>
        <span style={"opacity:"+ opacity}>/</span>
        <img style="margin: 0" src={ gfx[unit] } height="10"/>
      </div>;
    }

    var wood = stats.w, res = stats.S || stats.C || stats.W || "";
    var which = stats.S ? "sulfur" : stats.C ? "crystal" : stats.W ? "wine" : 0;
    var left = <div style="left: 0;"/>, right = <div style="right: 0;"/>;

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
            !$X('following-sibling::td[a[contains(@class,"button")]]', td)) {
          stat = l2;
          config.setServer(["techs", "units", unit, ad], 3);
        } else
          config.setServer(["techs", "units", unit, ad], l);
      }
      var icon = img.src.replace(type+".gif", levels[l]+".gif");
      tag = { tag: row(l2, upkeep, "gold") };

      left.* = row(l2, wood, "wood") + left.*;
      if (res)
        right.* = row(l2, res, which) + right.*;

      if (!last) tag.append = td; else tag.before = last;
      last = node(tag);
      node({ className: "stats", after: img, text: l1 +" \u27A1 "+ l2,
             style: { opacity: opacity }});
    }
    node({ append: $X('following::ul[@class="resources"]', td), tag:
           <li class="time" style={"background-image: url("+ gfx.upkeep +")"}>
             { upkeep } / h
           </li> });
    var costs = <div class="unitBuildCost">{ left }{ right }</div>;
    node({ append: cost, tag: costs });
  }

  function augment(tr) {
    var stats = unitStatsFromImage($X('td[@class="object"]/img', tr));
    if (stats) {
      var cells = $x('td/table[@class="inside"]/tbody/tr[1]/td[1]', tr);
      var att = $X('following-sibling::td[2]', cells[0]);
      var def = $X('following-sibling::td[2]', cells[1]);
      show(cells[0], stats.a, stats.A, stats.u, stats.id, "a", att, stats);
      show(cells[1], stats.d, stats.D, stats.u, stats.id, "d", def, stats);
    }
  }

  function showWhy(a) {
    if (a.title) a.innerHTML = a.title;
  }

  var levels = ["bronze", "silber", "gold"];
  $x('id("demo")//tr[td[@class="object"]]').forEach(augment);
  projectCompletion("upgradeCountdown", "done");
  $x('//a[@class="button inactive" and @title]').forEach(showWhy);
}


function shipyardView() {
  dontSubmitZero();
  showUnitLevels(ships);
  projectQueue();
  buildViewCompactor();
}

function barracksView() {
  dontSubmitZero();
  showUnitLevels(troops);
  projectQueue();
  buildViewCompactor();
}

function projectQueue() {
  var u = $x('id("unitConstructionList")//div[starts-with(@id,"queueEntry")]');
  u.forEach(projectCompletion);
}

function normalizeUnitName(name) {
  return name.replace(/[ -].*/, "").toLowerCase();
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
    var cnt = integer($X('div[@class="unitinfo"]/div[@class="unitcount"]', li));
    config.setCity(["T", stats.id], cnt);
  }

  $x('id("units")/li[div[@class="unitinfo"]]').forEach(augmentUnit);
}

function buildViewCompactor() {
  addMeta("items-xpath", 'id("units")/li');
  var me = document.body.id;
  var cities = cityIDs().filter(cityHasBuilding(me));
  var hash = "#keep:header,mainview,breadcrumbs," +
    "unitConstructionList,reportInboxLeft,buildingUpgrade";
  if (location.hash == hash) {
    document.body.style.marginTop = "-148px";
  } else if (cities.length > 1) {
    // inline the other barracks/shipyard views onclick?
  }
  cityTabs($X('id("buildForm")/input[@name="id"]').value);

  cssToggler(me, false, gfx.stamina, <><![CDATA[
#container #mainview #units .unit p {
  display: none;
}

#container #mainview #units .unit .unitinfo img {
  top: 5px;
  left: 25px;
  max-height: 70px;
}

#container #mainview #units .unit .unitcount {
  top: 77px;
}

#container #mainview #units .unit {
  min-height: 100px;
}
]]></>);
}


function premiumTraderView() {
  scrollWheelable();
  evenShips();
}

function transportView() {
  scrollWheelable();
  evenShips();
}


function takeOfferView() {
  scrollWheelable();
}

function tradegoodView() {
  resourceView();
}

function showWorkerYield() {
  function showYield(td) {
    var workers = integer(td);
    var normal = Math.min(max, workers);
    var helpers = workers - normal;
    var hourly = normal * perNormal + helpers * perNormal / 4;
    var yield = sign(Math.floor(hourly)) +"/"+ locale.timeunits.short.hour;
    var daily = sign(Math.floor(hourly * 24)) +"/"+ locale.timeunits.short.day;
    td.innerHTML = workers +" ("+ yield +"; "+ daily +")";
  }
  function read(what) {
    return integer(init.match(new RegExp(what + "\\s*:\\s*(\\d+)"))[1]);
  }
  var init = $X('//script[contains(.,"create_slider")]');
  if (init) init = init.textContent; else return;
  var max = read("maxValue"), overdrive = read("overcharge");
  var perNormal = document.body.id == "resource" ? 1.0 : 0.5;
  if ($X('//li[@class="gain"][contains(@alt,"10%")]')) perNormal *= 1.1;
  $x('//td[@class="countWorkers"]').forEach(showYield);
  $x('//td[@class="cityname"]/a').forEach(showPlayerInactivity);
}

function showPlayerInactivity(a) {
  var cid = urlParse("selectCity", a.search);
/*
      // z: 0: normal, 1: vacation, 2: inactive;
      // Z: 1/2: first seen in this state
      var type = { vacation: 1, inactivity: 2 }[span.className] || 0;
      var last = config.getCity("z", 0, id);
      var time = config.getCity("Z", 0, id);
      var now = (new Date).getTime();
      if (type)
        time = last == type ? time : now;
      config.setCity("Z", time, id);
      config.setCity("z", type, id);
      if (time && 2 == type) {
        time = (now - time) / 1e3;
        time = time > 86400 ? secsToDHMS(time, 0) +" " : "";
        span.textContent = span.textContent.replace(/\(i\)/, "("+ time +"i)");
      }
*/
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

  showWorkerYield();
  addClass(document.body, luxuryType("name"));
  if (/#keep:setWorkers/i.test(location.hash||"")) {
    var l = integer($X('id("resUpgrade")//div[@class="buildingLevel"]'));
    if ($("upgradeCountDown")) l += "+";
    node({ tag: <div id="mineLevel">{ l }</div>, before: $("inputWorkers") });
    var form = $("setWorkers");
    if (form) {
      form.action = location.href;
    } else { // no change form shown -- reload page
      var path = location.pathname;
      var anti = path == "/index.php" ? "/" : "/index.php";
      path = location.hostname + path;
      anti = location.hostname + anti;
      location.href = location.href.replace(path, anti);
    }
    return !!form;
  }
  stillRemains();
  highlightMeInTable();
  $x('id("mainview")/div[@class="othercities"]//tr/td[@class="actions"]/' +
     'a[contains(@href,"view=sendMessage")]').forEach(link);
  scrollWheelable();
}


// ikipedia views:

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

  var body = $X('id("citypanel")/tbody', doc);
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
