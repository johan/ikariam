// ==UserScript==
// @name	Kronos Overview
// @namespace	http://code.google.com/p/ecmanaut/
// @description	Ikariam overview table of your empire. Requires Kronos Utils.
// @include	http://s*.ikariam.com.pt/*
// @include	http://s*.ikariam.tld/*
// @resource ss	overview.css
// @unwrap
// ==/UserScript==

var borrowed = "version,base,node,lang,urlTo,cityIDs,cityNames,cityData,css," +
  "$,$x,$X,config,gfx,resourceIDs,buildingIDs,cityProject";
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
  draw();
}

function draw() {
  var table = <table id="ot-1" align="center" border="1"><tr>
    <th id="ot-cities" colspan="2">{ lang.cityName||"City Name" }</th>
    <th id="ot-people" colspan="2">{ lang.population||"Population" }</th>
  </tr></table>;

  var count = 5, stuff = [];
  for (var n in resourceIDs) {
    if (!count--) break;
    stuff.push(resourceIDs[n]);
    table.tr.th += <th style={"background:url("+ gfx[n] +") no-repeat 50%"}/>;
  }

  table.tr.th += <th id="ot-prod">{ lang.building||"Current Project" }</th>;

  var ids = cityIDs(), names = cityNames(), tot = {};
  var Ptot = 0, ptot = 0, wtot = 0, Wtot = 0, Mtot = 0, Ctot = 0, Stot = 0;
  for (var i = 0; i < ids.length; i++) {
    var cid = ids[i], iid = config.getCity(["i"], null, cid);
    var isle = config.getIsle([], null, iid);
    var cname = names[i], iname = isle.x +":"+ isle.y;
    var curl = urlTo("city", cid);
    var iurl = urlTo("island", { island: iid, city: cid });
    var data = cityData(cid), hurl = urlTo("townHall", cid);
    var row = <tr>
      <td class="ot-city"><a href={ curl }>{ cname }</a></td>
      <td class="ot-isle">[<a href={ iurl }>{ iname }</a>]</td>
      <td class="ot-hall lf"><a href={ hurl }>{ data.P }</a></td>
      <td class="ot-free">{ data.p }</td>
    </tr>;
    for each (n in stuff) {
      row.td += <td class="ot-stuff lf">{ data[n] }</td>;
      //row.td += <td class="ot-growth">{ data[n] }</td>;
    }
    var b = cityProject(cid) || "";
    if (b)
      b = <>
        <img src={ base +"gfx/icons/buildings/"+ b +".png" }/>
        { config.getCity(["l", buildingIDs[b]], 0, cid) + 1 }
      </>;
    row.td += <td class="ot-project lf">{ b }</td>;
    table.tr += row;
    for (n in data)
      tot[n] = (tot[n] || 0) + data[n];
  }
  var sum = <tr class="ot-summary">
    <td colspan="2">{ lang.summary||"Summary:" }</td>
    <td class="lf">{ tot.P }</td>
    <td>{ tot.p }</td>
  </tr>;
  for each (n in stuff) {
    sum.td += <td class="lf">{ tot[n] }</td>
  }
  sum.td += <td class="lf"/>
  table.tr += sum;

  node({ append: document.body, tag: table });
}
