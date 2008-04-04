//
// version 0.6.0
// 2008-04-04
// Copyright (c) 2008, ImmortalNights
// Special Enhancements: wphilipw
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "IkariamScoreLinker", and click Uninstall.
//
// --------------------------------------------------------------------
//
// Version History:
// 0.3.0: Original Public Release
// ==================================================
// 0.4.0: Island View & Bugfixes
// 0.4.1: Description change, Generals Version update
// 0.4.5: Bugfixes, Script combination (versions)
// 0.4.6: Changed the image sizes to 16x16
// 0.4.7: Implemented 'checkAlreadyShown' to prevent the icon displaying multiple times
// ==================================================
// 0.5.0: Inline Score Display Option (AJAX)
// 0.5.2: Defaults of text inline now set. Icons and text have headers. Options link always shown
// 0.5.3: Code clean up, Money Score option & Options dialog
// 0.5.4: Previous score details are saved, so that they are not updated if the same town is viewed.
// 0.5.5: BugFix for multiple scores + timeout for saved scores (10min)
// 0.5.6: BugFix: "undefined" scores (timestamp too long, now stored in string)
// 0.5.7: Options on Options page, no longer inline
// 0.6.0: Saves scores in the page after loading them once. Code cleanup. Does not try to run on the forums.
//
// --------------------------------------------------------------------
//
// This script places an icon to the right of a players
// name after selecting their town on the Island overview,
// or when viewing their Town. This icon links the user to
// the scoreboard, where you can see the players score.
//
// Feel free to have a go yourself; as long as you leave
// a little credit, and of course publish for the players
// of Ikariam!
//
// This script was originally created by ImmortalNights,
// and further edited and enhanced by wphilipw and ecmanaut.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name           IkariamScoreLinker
// @namespace      ikariamScript
// @description    Adds a link to the Scoreboard besides a players name after selecting their town on the Island Overview or when viewing their Town.
// @include        http://*.ikariam.*/*
// @exclude        http://board.ikariam.*/*
// ==/UserScript==

/*
The startup functions and global variables.
Original Author: ImmortalNights & wphilipw
For version: 0.3.0
Last changed: 0.6.0
*/

var show = { gold: 4, military: 2, total: 1 };
var post = {
    total: "score",
 military: "army_score_main",
     gold: "trader_score_secondary"
};

var gameServer = location.host;
var whatToShow = GM_getValue("show", "7");
var inlineScore = GM_getValue("inline", true);
var goldHiscore = GM_getValue("maxgold "+ gameServer, 0);
var goldUpdated = GM_getValue("updated "+ gameServer, 0);

if ($("options_changePass"))
  displayOnOptions_fn();
else
  init();

function init() {
  function maybeLookup(e) {
    var n = $X('.//span[@class="textLabel"]', e.target);
    var ul = $X('ancestor-or-self::li[1]/ul[@class="cityinfo"]', e.target);
    if ($X('li[contains(@class," name")]', ul)) return; // already fetched!
    var who = $X('li[@class="owner"]/text()[preceding::*[1]/self::span]', ul);
    var name = trim(who.textContent);
    fetchScoresFor(name, ul, n);

    if (goldHiscore) {
      var panel = $X('li[@class="citylevel"]', cityinfoPanel());
      var level = $X('li[@class="citylevel"]', ul);
      var size = level.lastChild.textContent;
      var max = Math.round(size * (size - 1) / 10000 * goldHiscore);
      if (isNaN(max)) return; else max += "";
      for (var i = max.length - 3; i > 0; i -= 3)
        max = max.slice(0, i) +","+ max.slice(i);
      max = node("span", "", null, "\xA0(max\xA0gold:\xA0"+ max +")");
      max.title = "Largest amount of money lootable from a town of this size";
      level.appendChild(max);
      if (viewingRightCity(ul))
        panel.appendChild(max.cloneNode(true));
    }
  }
  function lookupOnClick(a) {
    onClick(a, function(e) { setTimeout(maybeLookup, 10, e); });
  }
  function lookup(e) {
    cities.map(click);
  }

  if (!goldHiscore || (Date.now() - goldUpdated) > 864e5) // update gold hiscore
    requestScore("", post.gold, setHiscore); // but at most once every 24 hours

  var cities = getCityLinks();
  cities.forEach(lookupOnClick);
  var body = document.body;
  addEventListener("keypress", tab, true);
  inlineScore && onClick(body, lookup, 0, "dbl");
}

function tab(e) {
  var dir = 0;
  switch (e.keyCode || e.charCode) {
    case "j".charCodeAt(): dir--; break;
    case "k".charCodeAt(): dir++; break;
    case 9: /* tab key */  dir = e.shiftKey ? -1 : 1;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
  }
  if (!dir) return;

  var all = getCityLinks();
  var now = unsafeWindow.selectedCity;
  var cur = $X('id("cityLocation'+ now +'")/a') || all[all.length - 1];
  if (all.length) {
    now = all.map(function(a) { return a.id; }).indexOf(cur.id);
    click(all[(now + dir + all.length * 3) % all.length]);
    e.stopPropagation();
    e.preventDefault();
  }
}

function fetchScoresFor(name, ul, n) {
  function searchbutton(type) {
    var url = "url(/skin/" + ({
       total: "layout/medallie32x32_gold.gif) no-repeat -7px -9px",
    military: "layout/sword-icon2.gif) no-repeat 0 2px;",
        gold: "resources/icon_gold.gif) no-repeat 0 0; width:18px"
      })[type];
    return <input type="submit" name="highscoreType"
      value=" " title={"View player's "+ type +" score"}
      style={"border:0;height:23px;width:16px;cursor:pointer;background:"+ url}
      onclick={"this.type = 'hidden'; "+
               "this.value='"+ post[type] +"'; "+
               "this.form.submit()"}/>;
  }

  var scores = <a href="/index.php?view=options"
                 title="Change score options">Change Options</a>;

  if (!inlineScore) {
    var form = <form action="/index.php" method="post">
      <input type="hidden" name="view" value="highscore"/>
      <input type="hidden" name="" id="searchfor"/>
      <input type="hidden" name="searchUser" value={name}/>
    </form>;
    for (var type in post)
      if (whatToShow & show[type])
        form.* += searchbutton(type);
    scores.@style = "position: relative; top: -6Px;";
    form.* += scores;
    form.@style = "position: relative; left:-26px; white-space: nowrap;";
    scores = form;
  }

  addItem("options", scores, ul);
  if (!inlineScore) return;

  for (var type in show) {
    if (!(whatToShow & show[type]))
      continue;
    addItem(type, "fetching...");
    requestScore(name, post[type], makeShowScoreCallback(name, type, ul, n));
  }
}

function viewingRightCity(ul) {
  var saved = $X('li[@class="name"]/text()[last()]', ul);
  var panel = $X('li[@class="name"]/text()[last()]', cityinfoPanel());
  return panel.textContent == saved.textContent;
}

function setHiscore(xhr) {
  var html = node("div", "", null, xhr.responseText);
  var score = $X('.//div[@class="content"]' +
                 '//tr[@class="first"]/td[@class="score"]', html);
  goldHiscore = score.textContent.replace(/\D+/g, "") || "0";
  GM_setValue("maxgold "+ gameServer, goldHiscore);
  GM_setValue("updated "+ gameServer, Date.now() + "");
}

function makeShowScoreCallback(name, type, ul, n) {
  return function showScore(xhr) {
    var html = node("div", "", null, xhr.responseText);
    var score = $X('.//div[@class="content"]//tr[td[@class="name"]="' +
                   name + '"]/td[@class="score" or @class="§"]', html);
    if (score) {
      score = score.innerHTML;
      if ("0" == score && "military" == type)
        n.style.fontStyle = "italic";
      var next = $X('li[@class="ally"]/following-sibling::*', ul);
      ul.insertBefore(mkItem(type, score), next);
      if (viewingRightCity(ul)) // avoids race conditions
        addItem(type, score);
    }
  };
}

function getCityLinks() {
  return $x('id("cities")/li[contains(@class,"city level")]/a');
}

function getItem(type) {
  return $X('li[contains(@class,"'+ type +'")]', cityinfoPanel());
}

function mkItem(type, value) {
  var li = node("li", type + " name", null, value);
  var title = (type in show) ?
    type.charAt().toUpperCase() + type.slice(1) + " Score:" : "Scores:";
  li.insertBefore(node("span", "textLabel", null, title), li.firstChild);
  return li;
}

function addItem(type, value, save) {
  var li = getItem(type);
  if (li)
    li.lastChild.nodeValue = value;
  else {
    var ul = cityinfoPanel();
    var next = $X('li[@class="ally"]/following-sibling::*', ul);
    ul.insertBefore(li = mkItem(type, value), next);
    if (save) {
      next = $X('li[@class="ally"]/following-sibling::*', save);
      save.insertBefore(li.cloneNode(true), next);
    }
  }
  return li;
}

function cityinfoPanel() {
  return $X('id("information")/ul[@class="cityinfo"]');
}

function node(type, className, styles, content) {
  var n = document.createElement(type||"div");
  if (className) n.className = className;
  if (styles)
    for (var prop in styles)
      n.style[prop] = styles[prop];
  if (content)
    n.innerHTML = "string" == typeof content ? content : content.toXMLString();
  return n;
}

function click(node) {
  var event = node.ownerDocument.createEvent("MouseEvents");
  event.initMouseEvent("click", true, true, node.ownerDocument.defaultView,
                       1, 0, 0, 0, 0, false, false, false, false, 0, node);
  node.dispatchEvent(event);
}

function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

function onClick(node, fn, capture, e) {
  node.addEventListener((e||"") + "click", fn, !!capture);
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

/*
The AJAX request system so we can display the scores inline
Original Author: wphilipw
For version: 0.5.0
Last changed: 0.5.0
*/

function requestScore(playerName, type, onload) {
  GM_xmlhttpRequest({
    method: "POST",
    url: "http://" + gameServer + "/index.php",
    data: "view=highscore&highscoreType="+ type +"&searchUser="+ playerName,
    headers: {
      "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
      "Content-type": "application/x-www-form-urlencoded",
      "Accept": "application/atom+xml,application/xml,text/xml",
      "Referer": "http://" + gameServer + "/index.php"
    },
    onload: onload
  });
}

/*
runs on first run to set up default values
Original Author: ImmortalNights
For version: 0.5.4
Last changed: 0.6.0
*/

function displayOnOptions_fn() {
  var mybox = node("div", "", { textAlign: "left" });
  var opts = <>
<h3>Score Display Options</h3>
<table border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td style="width:43%; text-align:right;">Show Total Score:</td>
    <td style="width:57%"><input type="checkbox" id="totalScore"/></td>
  </tr>
  <tr>
    <td style="width:43%;text-align:right">Show Army Score:</td>
    <td><input type="checkbox" id="militaryScore"/></td>
  </tr>
  <tr>
    <td style="width:43%;text-align:right">Show Gold Score:</td>
    <td><input type="checkbox" id="goldScore"/></td>
  </tr>
  <tr>
    <td style="width:43%;text-align:right">Show Score Inline:</td>
    <td><input type="checkbox" id="inlineScore"/></td>
  </tr>
</table></>;

  mybox.innerHTML = opts.toXMLString();
  var pwd = $('options_changePass');
  pwd.appendChild(mybox);
  var checkboxes = $x('//input[@type="checkbox" and contains(@id,"Score")]');
  for (var i = 0; i < checkboxes.length; i++) {
    var input = checkboxes[i];
    var id = input.id.replace("Score", "");
    if (id == "inline")
      input.checked = !!inlineScore;
    else
      input.checked = !!(show[id] & whatToShow);
  }

  var inputs = $x('//input[@type="submit"]');
  for (var e = 0; e < inputs.length; e++)
    onClick(inputs[e], changeShow_fn, true);
}

/*
This function saves the options chosen above
Original Author: wphilipw
For version: 0.4.5
Last changed: 0.6.0
*/

function changeShow_fn(e) {
  GM_setValue("show", (
                (show.total * $('totalScore').checked) |
                (show.military * $('militaryScore').checked) |
                (show.gold * $('goldScore').checked)
              ) + "");
  GM_setValue("inline", $('inlineScore').checked);
  e.target.form.submit();
}
