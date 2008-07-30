// ==UserScript==
// @name	Kronos Overview
// @namespace	http://code.google.com/p/ecmanaut/
// @description	Ikariam overview table of your empire. Requires Kronos Utils.
// @include	http://s*.ikariam.com.pt/*
// @include	http://s*.ikariam.tld/*
// @resource ss	http://ecmanaut.googlecode.com/svn/trunk/sites/ikariam.org/kronos-utils/overview.css
// @unwrap
// ==/UserScript==

var borrowed = "version,base,node,lang,urlTo,cityIDs,cityNames,cityData,css," +
  "$,$X,config,gfx,resourceIDs,buildingIDs,cityProject,cityReapingPace,sign," +
  "cityID,formatNumber,cityMaxPopulation,buildingCapacities,visualResources," +
  "imageFromUnit";
var me = this, tries = 0;
setTimeout(init, 0, 10);

function init(next) {
  var error = "Too old Kronos Utils; install a newer version now?";
  var kronos = unsafeWindow.kronos, okay = true;
  if (!kronos)
    if (tries++ < 10)
      return setTimeout(init, next, next * 2);
    else
      error = "This script needs Kronos Utils installed to work. Install now?";

  if (kronos)
    borrowed.split(",").forEach(function borrow(ident) {
      okay = okay && (me[ident] = kronos[ident]);
    });

  if (!document.domain || kronos && !cityIDs().length) return; // (not in-game)
  if (!kronos || !okay || parseFloat(version) < 0.6) {
    if (confirm(error))
      location.href = base + "kronos_utils.user.js";
    return;
  }

  css(GM_getResourceText("ss"));
  XML.setSettings({
    ignoreProcessingInstructions: false,
    ignoreWhitespace: false,
    ignoreComments: false,
    prettyPrinting: false, prettyIndent: 2
  });
  resources();
  military();
}

function resources() {
  var table = <table id="ot-1" class="ot" align="center" border="1"><tr>
    <th id="ot-cities" colspan="2">{ lang.cities||"Cities" }</th>
    <th colspan="2" style={"background:url("+ gfx.pop +") no-repeat 50%"}/>
  </tr></table>;

  var count = 6, stuff = [];
  for (var n in resourceIDs) {
    if (!count--) break; else if ("glass" == n) continue;
    stuff.push(resourceIDs[n]);
    table.tr.th += <th style={"background:url("+ gfx[n] +") no-repeat 50%"}/>;
  }

  table.tr.th += <th id="ot-prod">{ lang.projects||"Projects" }</th>;

  var ids = cityIDs(), names = cityNames(), tot = {}, current = cityID();
  for (var i = 0; i < ids.length; i++) {
    var cid = ids[i], iid = config.getCity(["i"], null, cid);
    var isle = config.getIsle([], null, iid);
    var cname = names[i], iname = isle.x +":"+ isle.y;
    var curl = urlTo("city", cid);
    var iurl = urlTo("island", { island: iid, city: cid });
    var data = cityData(cid), hurl = urlTo("townHall", cid);
    var row = <tr>
      <td class="ot-city"><a href={ curl }>{ cname }</a></td>
      <td class="ot-isle">
        <span id={ "ot-"+cid }> </span>
        [<a href={ iurl }>{ iname }</a>]
      </td>
      <td class="ot-hall new"><a href={ hurl }>{ formatNumber(data.P) }</a>
      { ""/*pct(data.P, cityMaxPopulation(cid))*/ }</td>
      <td class="ot-free">{ formatNumber(data.p) }</td>
    </tr>;
    if (current == cid) row.@class = "ot-current";
    var pace = cityReapingPace(cid); data.g = pace.g;
    for each (n in stuff) {
      var v = formatNumber(data[n], "g" == n), p = "";
      if ("g" != n) {
        var level = config.getCity(["l", buildingIDs.warehouse], 0, cid);
        var wood = buildingCapacities.warehouse.w[level || 0];
        var rest = buildingCapacities.warehouse.r[level || 0];
        p = pct(data[n], "w" == n ? wood : rest, true);
      }
      row.td += <td class="ot-stuff new">{ v }{ p }</td>;
      //row.td += <td class="ot-growth">{ v }</td>;
    }
    var b = cityProject(cid) || "";
    if (b)
      b = <>
        <img src={ base +"gfx/icons/buildings/"+ b +".png" }/>
        { config.getCity(["l", buildingIDs[b]], 0, cid) + 1 }
      </>;
    row.td += <td class="ot-project new">{ b }</td>;
    table.tr += row;
    for (n in data)
      tot[n] = (tot[n] || 0) + data[n];
  }

  var sum = <tr class="ot-totals">
    <td colspan="2" class="ot-totals">{ lang.totals||"Totals:" }</td>
    <td class="new">{ formatNumber(tot.P) }</td>
    <td>{ formatNumber(tot.p) }</td>
  </tr>;
  for each (n in stuff) {
    sum.td += <td class="new">{ formatNumber(tot[n], n == "g") }</td>
  }
  sum.td += <td class="new"/>
  table.tr += sum;

  node({ append: document.body, tag: table });

  for (var i = 0; i < ids.length; i++) {
    var cid = ids[i], iid = config.getCity("i", null, cid);
    var res = config.getIsle("r", "", iid);
    if (res) {
      var has = {}; has[res] = "";
      var img = visualResources(has, { size: 0.6, noMargin: 1 });
      node({ id: "ot-" + cid, html: img });
    }
  }
}

function military() {
  function getMil(cid) {
    var mil = config.getCity("T", {}, cid);
    for (var id in mil)
      all[id] = (all[id] || 0) + mil[id];
    return mil;
  }
  var table = <table id="ot-2" class="ot" align="center" border="1"><tr>
    <th id="otm-cities">{ lang.cities||"Cities" }</th>
  </tr></table>;

  var ids = cityIDs(), names = cityNames(), tot = {}, current = cityID();
  var all = {}, byCity = ids.map(getMil);
  for (var uid in all) {
    if (!all[uid]) {
      delete all[uid];
      continue;
    }
    var url = imageFromUnit(uid);
    table.tr.th += <th style={ "background:url("+ url +") no-repeat 50%" }/>;
  }
  table.tr.th += <th class="new">Σ</th>

  for (var i = 0; i < ids.length; i++) {
    var cid = ids[i];
    var ctot = 0;
    var cname = names[i];
    var curl = urlTo("city", cid);
    var data = byCity[i];
    var burl = urlTo("barracks", cid);
    var surl = urlTo("shipyard", cid);
    var row = <tr>
      <td class="ot-city"><a href={ curl }>{ cname }</a></td>
    </tr>;
    if (current == cid) row.@class = "ot-current";
    for (uid in all) {
      ctot += data[uid] || 0;
      var v = data[uid] ? formatNumber(data[uid]) : "";
      if (v)
        v = <a href={ uid < 300 ? surl : burl }>{ v }</a>
      row.td += <td class="ot-stuff new">{ v }</td>;
    }
    row.td += <td class="ot-stuff new">{ ctot ? formatNumber(ctot) : "" }</td>;
    table.tr += row;
  }

  var sum = <tr class="ot-totals">
    <td class="ot-totals">{ lang.totals||"Totals:" }</td>
  </tr>;
  tot = 0;
  for each (v in all) {
    sum.td += <td class="new">{ formatNumber(v) }</td>;
    tot += v;
  }
  sum.td += <td class="new">{ tot ? formatNumber(tot) : "" }</td>;
  table.tr += sum;

  node({ append: document.body, tag: table });
}

function pct(lvl, tot, warn) {
  var l = Math.round(100 * lvl / tot), r = 100 - l, w = "";
  var h = "Tip('<table border=0 cellspacing=4 cellpadding=4><tr><td>" +
    formatNumber(tot) +" "+ (lang.total || "total") + "<br>" +
    l + (lang.pctFull||"% full") + "</td></tr></table>'," +
    "STICKY, false, FOLLOWMOUSE, false, DELAY, 1, SHADOW, false, ABOVE, true)";
  if (warn) {
    if (l > 80) w = " warn";
    if (l > 95) w = " eeks";
    if (l > 99) w = " full";
  }
  return <table onmouseover={ h } class="ot-pct"><tr class="ot-pct">
    <td width={ l+"%" } class={ "ot-pct left"+w }/>
    <td width={ r+"%" } class="ot-pct"/>
  </tr></table>;
}
