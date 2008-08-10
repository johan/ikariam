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
  "formatNumber,cityMaxPopulation,warehouseCapacity,militaryScoreFor,resUrl," +
  "visualResources,imageFromUnit,integer,secsToDHMS,resolveTime,rm,revision," +
  "referenceCityID,clickTo";
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

  if (kronos) {
    borrowed.split(",").forEach(function borrow(ident) {
      okay = okay && (me[ident] = kronos[ident]);
    });
    me.totals = lang.totals||"Σ";
  }

  if (!document.domain || kronos && !cityIDs().length) return; // (not in-game)
  if (!kronos || !okay || parseFloat(version) < 0.6) {
    if (confirm(error))
      location.href = "http://ecmanaut.googlecode.com/svn/trunk/" +
        "sites/ikariam.org/kronos-utils/kronos_utils.user.js";
    return;
  }

  css(GM_getResourceText("ss"));
  XML.setSettings({
    ignoreProcessingInstructions: false,
    ignoreWhitespace: false,
    ignoreComments: false,
    prettyPrinting: false, prettyIndent: 2
  });

  redraw();
  addEventListener("focus", redraw, false);
}

function redraw() {
  resources();
  military();
  clickTo($("ot-time"), redraw);
}

function th(opts) {
  var th = <th/>;
  if (opts.bg) {
    th.@style = "background-image:url("+ opts.bg +")";
    delete opts.bg;
  }
  for (var prop in opts)
    th["@"+prop] = opts[prop];
  return th;
}

function resources() {
  function summary(h) {
    var first = 1 == h, warehouse = "";
    if (first)
      warehouse = <td rowspan="3" id="warehouse-event">
        <div>{ secsToDHMS(next, 1) }<br/>{ resolveTime(next, 2) }</div>
        <img src={ gfx.warehouse } height="42"/>
      </td>;
    var period = secsToDHMS(h * 3600, 0);
    var sum = <tr class={ first ? "ot-totals" : "" }>
      { warehouse }
      <td colspan="2" class="ot-totals">{ period +" "+ totals }</td>
      <td class="new">{ first ? formatNumber(tot.P) : "" }</td>
      <td>{ first ? formatNumber(tot.p) : "" }</td>
    </tr>;
    for each (var n in stuff) {
      var v = tot[n];
      if (!first) v = n == "g" ? v * h : v + rates[n] * h;
      sum.td += <td class="new">{ formatNumber(v, n == "g") }</td>;
      if (n != "g") {
        v = rates[n] ? formatNumber(rates[n] * h, true) : "";
        sum.td += <td colspan="2" class="ot-rate">{ v }</td>;
        // sum.td += <td class="ot-end">{ "" }</td>;
      }
    }
    var last = "@ " + resolveTime(0, true), rev = integer("$Revision$");
    var t = secsToDHMS(next, 1);
    var a = "http://kronos-", b = ".notlong.com/";
    if (d == h)
      last = <><a href="http://kronos-utils.notlong.com/">Kronos Utils</a>
               v{ version }r{ revision() }</>;
    if (w == h)
      last = <><a href="http://kronos-overview.notlong.com/">Kronos Overview</a>
               r{ rev }</>;
    sum.td += <td colspan="2" class="new ot-time">{ last }</td>;
    table.tr += sum;
  }

  rm($("ot-1"));
  var next = 0; // seconds until next time a warehouse fills up or runs out
  var table = <table id="ot-1" class="ot" align="center" border="1"><tr>
    { th({ bg: gfx.city }) }
    { th({ bg: gfx.isle, id: "ot-isle" }) }
    <th id="ot-mill"/>
    { th({ colspan: 2, bg: gfx.pop }) }
  </tr></table>;

  var count = 6, stuff = [];
  for (var n in resourceIDs) {
    if (!count--) break; else if ("glass" == n) continue;
    stuff.push(resourceIDs[n]);
    var tr = th({ bg: gfx[n] });
    tr.@colspan = { gold: 1 }[n] || 3;
    table.tr.th += tr;
  }

  table.tr.th += <>
    { th({ id: "ot-prod", bg: gfx.build }) }
    { th({ id: "ot-time", bg: gfx.time, title: "Click to redraw the tables" }) }
  </>;

  var ids = cityIDs(), names = cityNames(), current = referenceCityID();
  var tot = {}, rates = {};
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
        [<a href={ iurl }>{ iname }</a>]
        <a id={ "ot-"+cid }>{ isle.R } </a>
      </td>
      <td class="ot-mill"><a href={ resUrl("w", cid) }>{ isle.w }</a></td>
      <td class="ot-hall new"><a href={ hurl }>{ formatNumber(data.P) }</a>
      { ""/*pct(data.P, cityMaxPopulation(cid))*/ }</td>
      <td class="ot-free">{ formatNumber(data.p) }</td>
    </tr>;
    if (current == cid) row.@class = "ot-current";

    var pace = cityReapingPace(cid); data.g = pace.g;
    for each (n in stuff) {
      var v = formatNumber(data[n], "g" == n), p = "";
      var rate = <></>;
      if ("g" != n) {
        var max = warehouseCapacity(cid);
        p = pct(data[n], max[n], true);

        // consumption/replenish rate and emptiness/fillage times:
        var r = pace[n] || "", t, T = <td class="ot-end"/>;
        if (r) {
          rates[n] = (rates[n] || 0) + r;
          if (r > 0) {
            t = (warehouseCapacity(cid)[n] - data[n]) * 3600 / r;
          } else {
            t = data[n] * 3600 / -r;
          }
          next = Math.min(next, t) || t;
          T.* = secsToDHMS(t, 0);
          T.@title = lang[r > 0 ? "full" : "empty"] + resolveTime(t, 1);
          r = sign(r);
        }
        if (isle.r == n || "w" == n)
          r = <a href={ resUrl(n, cid) }>{ r }</a>;
        rate = <><td class="ot-rate">{ r }</td>{ T }</>;
      }
      row.td += <td class="ot-stuff new">{ v }{ p }</td>;
      if (rate) row.td += rate;
    }

    var b = cityProject(cid) || "";
    if (b)
      b = <a href={ urlTo(b, cid) }>
        <img src={ base +"gfx/icons/buildings/"+ b +".png" }/>
        { config.getCity(["l", buildingIDs[b]], 0, cid) + 1 }
      </a>;
    row.td += <td class="ot-project new">{ b }</td>;

    T = <td class="ot-built"/>;
    t = b && config.getCity("t", 0, cid) || "";
    if (t) {
      t = (t - (new Date)) / 1e3;
      T.@title = resolveTime(t).replace(/^\s*/, "");
      T.* = secsToDHMS(t, 1);
    }
    row.td += T;

    table.tr += row;
    for (n in data)
      tot[n] = (tot[n] || 0) + data[n];
  }

  var h = 1, d = h * 24, w = d * 7;
  [h, d, w].forEach(summary);

  node({ append: document.body, tag: table });

  var wood = visualResources({ w: "" }, { size: 0.6, noMargin: 1 });
  node({ id: "ot-mill", html: wood });

  for (var i = 0; i < ids.length; i++) {
    var cid = ids[i], iid = config.getCity("i", null, cid);
    var res = config.getIsle("r", "", iid);
    if (res) {
      var has = {}; has[res] = "";
      var img = visualResources(has, { size: 0.6, noMargin: 1 });
      var res = node({ id: "ot-" + cid, href: resUrl("luxe", cid) });
      res.innerHTML = img + res.innerHTML;
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

  rm($("ot-2"));
  var table = <table id="ot-2" class="ot" align="center" border="1"><tr>
    { th({ bg: gfx.city }) }
  </tr></table>;

  var ids = cityIDs(), names = cityNames(), current = referenceCityID();
  var tot = {}, all = {}, byCity = ids.map(getMil);
  for (var uid in all) {
    if (!all[uid]) {
      delete all[uid];
      continue;
    }
    table.tr.th += th({ colspan: 2, bg: imageFromUnit(uid) });
  }
  table.tr.th += <th colspan="2" class="new">{ totals }</th>

  for (var i = 0; i < ids.length; i++) {
    var cid = ids[i];
    var ctot = 0, Ctot = 0;
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
      v = militaryScoreFor(integer(uid), integer(data[uid]));
      if (v) {
        Ctot += v;
        v = formatNumber(v);
      }
      row.td += <td class="ot-stuff">{ v || "\xA0" }</td>;
    }
    row.td += <td class="ot-stuff new">{ ctot ? formatNumber(ctot) : "" }</td>;
    row.td += <td class="ot-stuff">{ Ctot ? formatNumber(Ctot) : "\xA0" }</td>;
    table.tr += row;
  }

  var sum = <tr class="ot-totals">
    <td class="ot-totals">{ totals }</td>
  </tr>;
  tot = ctot = 0;
  for (cid in all) {
    v = all[cid];
    sum.td += <td class="new">{ formatNumber(v) }</td>;
    tot += v;

    v = militaryScoreFor(integer(cid), integer(v));
    sum.td += <td class="">{ v ? formatNumber(v) : "\xA0" }</td>;
    ctot += v;
  }
  sum.td += <td class="new">{ tot ? formatNumber(tot) : "" }</td>;
  sum.td += <td class="">{ ctot ? formatNumber(ctot) : "\xA0" }</td>;
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
