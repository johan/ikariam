// Various support functions

XML.setSettings({
  ignoreProcessingInstructions: false,
  ignoreWhitespace: false,
  ignoreComments: false,
  prettyPrinting: false, prettyIndent: 2
});

function isNull(n) { return null === n; }
function isArray(a) { return isObject(a) && isNumber(a.length); }
function isString(s) { return "string" == typeof s; }
function isNumber(n) { return "number" == typeof n; }
function isObject(o) { return "object" == typeof o; }
function isBoolean(b) { return "boolean" == typeof b; }
function isDefined(v) { return "undefined" != typeof v; }
function isFunction(f) { return "function" == typeof f; }
function isUndefined(u) { return "undefined" == typeof u; }
function isTextNode(n) { return isObject(n) && n.nodeType == 3; }

function array(a) { return isArray(a) ? a : [a]; }

function reduce(func, a, last){
  switch (a.length) {
    case 0: return last;
    case 1: return func(last, a[0]);
    case 2: return func(a[0], a[1]);
  }
  last = a[0];
  for (var i = 1; i < a.length; i++)
    last = func(last, a[i]);
  return last;
}

function copy(object) {
  // Doug Crockford
  var fn = function() {};
  fn.prototype = object;
  return new fn;
}

function copyObject(o) {
  var copy = {};
  for (var n in o)
    copy[n] = o;
  return copy;
}

function bind(fn, self) {
  var args = [].slice.call(arguments, 2);
  return function() {
    fn.apply(self, args.concat([].slice.call(arguments)));
  };
}

function parseDate(t) {
  var Y, M, D, h, m, s = 0;
  if ((t = t && trim(t.textContent).split(/\D+/))) {
    if (4 == t.length) { // Military view
      [D, M, h, m] = t.map(integer);
      Y = (new Date).getFullYear();
    } else { // merchantnavyView, for instance
      [D, M, Y, h, m, s] = t.map(integer);
    }
    return (new Date(Y, M - 1, D, h, m, s)).getTime();
  }
}

function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function addClass(node, className) {
  var classes = (node.className || "").split(/\s+/g);
  if (classes.indexOf(className) > 0) return;
  if (classes[0] == "")
    classes = [className];
  else
    classes.push(className);
  node.className = classes.join(" ");
}

function gcs(node, prop) {
  var cs = getComputedStyle(node, "");
  return isDefined(prop) ? cs[prop] : cs;
}

// returns a function that only runs expensive function fn after no call to it
// has been made for n ms, or 100, if not given, or the time fn took last time,
// if it has been run at least once and no n was given.
function expensive(fn, n) {
  function run() {
    fn.timeout = null;
    var time = n || new Date;
    fn();
    if (!n) duration = (new Date) - time;
  }
  var duration;
  return function() {
    if (fn.timeout)
      clearTimeout(fn.timeout);
    fn.timeout = setTimeout(run, n || duration || 100);
  };
}

function addMeta(name, content) {
  var meta = document.createElement("meta");
  meta.name = name;
  meta.content = content;
  return document.documentElement.firstChild.appendChild(meta);
}

function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

function pluck(a, prop) {
  return a.map(function(i) { return i[prop]; });
}

function I(i) { return i; }

function rm(node) {
  return node && node.parentNode && node.parentNode.removeChild(node);
}

function toggle(node) {
  if (node)
    return node.style.display = !node.style.display ? "none" : "";
}

function hide(node) {
  if (node) return node.style.display = "none";
}

function show(node) {
  if (node) return node.style.display = "block";
}

function makeQuery(o) {
  var q = [];
  for (var i in o)
    q.push(encodeURIComponent(i) +"="+ encodeURIComponent(o[i]));
  return q.join("&");
}

function css(rules, disabled) {
  var head = document.documentElement.firstChild;
  var style = document.createElement("style");
  style.type = "text/css";
  style.textContent = isString(rules) ? rules : rules.toString();
  if (isBoolean(disabled))
    style.disabled = disabled;
  return head && head.appendChild(style);
}


function urlParse(param, url) {
  if (!url) url = location.search || "";
  var keys = {};
  url.replace(/([^=&?]+)=([^&#]*)/g, function(m, key, value) {
    keys[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return (param ? keys[param] : keys) ||
    "view" == param && document.body.id;
}

function number(n) {
  if (isNumber(n)) return n;
  if (isObject(n))
    if (/input/i.test(n.nodeName||""))
      n = n.value;
    else if (n.textContent)
      n = n.textContent;
  n = n.replace(/[^\d.-]+/g, "");
  return n ? parseFloat(n) : undefined;
}

function integer(n) {
  if (isNumber(n)) return n;
  if (isObject(n))
    if (/input/i.test(n.nodeName||""))
      n = n.value;
    else if (n.textContent)
      n = n.textContent;
  if (isString(n))
    n = n.replace(/[^\d-]+/g, "");
  return n ? parseInt(n, 10) : undefined;
}

function sign(n) {
  if ("undefined" == typeof n) n = 0;
  return (n > 0 ? "+" : n == 0 ? "±" : "") + n;
}

function nth(n) {
  var th = [, "st", "nd", "rd"];
  return n + (th[n] || "th");
}

function $(id) {
  return document.getElementById(id);
}


var expandos = { id: 1, className: 1, title: 1, type: 1, checked: 1 };

function node(opt) {
  function attr(name) {
    var value = opt[name];
    delete opt[name];
    return value;
  }
  var id = opt.id;
  var n = $(id);
  if (!n) {
    var tag = attr("tag") || "div";
    if (isString(tag))
      n = document.createElement(tag);
    else if (!tag.toXMLString)
      n = tag;
    else {
      var t = document.createElement("div");
      t.innerHTML = tag.toXMLString();

      var ids = {};
      for each (var n in $x('.//*[@id]', t))
        ids[n.id] = 1;
      if (!n) ids = null;

      var r = document.createRange();
      r.selectNodeContents(t);
      n = r.extractContents();
      if (n.childNodes.length == 1)
        n = n.firstChild;
    }
    var after = attr("after"), replace = attr("replace");
    var before = opt.prepend ? opt.prepend.firstChild : attr("before");
    var parent = attr("prepend") || attr("append") ||
                   (before || after || replace || {}).parentNode;
    if (parent) {
      if (before)
        parent.insertBefore(n, before);
      else if (after)
        parent.insertBefore(n, after.nextSibling);
      else if (replace)
        parent.replaceChild(n, replace);
      else
        parent.appendChild(n);
    }
    if (id) n.id = id;
  }
  var html = attr("html");
  if (isDefined(html)) n.innerHTML = html;
  var text = attr("text");
  if (isDefined(text)) n.textContent = text;
  var style = attr("style");
  if (style)
    for (var prop in style)
      n.style[prop] = style[prop];
  for (prop in opt)
    if (expandos[prop])
      n[prop] = opt[prop];
    else
      n.setAttribute(prop, opt[prop]+"");
  if (ids)
    for (var id in ids)
      ids[id] = $(id);
  return ids || n;
}



// Handling page elements

var xpath = {
  ship: 'id("globalResources")/ul/li[@class="transporters"]/a',
  citynames: 'id("changeCityForm")//ul[contains(@class,"optionList")]/li'
};

(function() {
  function add(fmt) { // batch adds similar-format entries to the xpath object
    for (var i = 1; i < arguments.length; i++) {
      var id = arguments[i];
      xpath[id] = fmt.replace("%s", id);
    }
  }

  add('id("value_%s")', "wood", "wine", "marble", "crystal", "sulfur");
})();

function get(what, context) {
  var many = { citynames: 1 };
  var func = many[what] ? $x : $X;
  return what in xpath ? func(xpath[what], context) : undefined;
}



function getServerTime(offset) {
  var Y, M, D, h, m, s, t;
  [D, M, Y, h, m, s] = $("servertime").textContent.split(/[. :]+/g);
  t = new Date(Y, parseInt(M, 10)-1, D, h, m, s);
  return offset ? new Date(t.valueOf() + offset*1e3) : t;
}

function resolveTime(seconds, timeonly) { // Crée le temps de fin.
  function z(t) { return (t < 10 ? "0" : "") + t; }
  var t = getServerTime(seconds - (unsafeWindow.startTime -
                                   unsafeWindow.startServerTime) / 1e3);
  var d = "", now = (new Date);
  if (t.getDate() != now.getDate() ||
      t.getMonth() != now.getMonth()) {
    var m = lang.months[t.getMonth()];
    d = t.getDate() +" "+ m.slice(0, 3);
    if (2 == timeonly) return d;
    d += ", ";
  }
  var h = z(t.getHours());
  var m = z(t.getMinutes());
  var s = z(t.getSeconds());
  t = d + h + ":" + m + ":" + s;
  return timeonly ? t : lang.finished + t;
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

function time(t) {
  var units = { day: 86400, hour: 3600, minute: 60, second: 1 };
  t = t / 1000; // ms to s
  if (t == Infinity) return "∞";
  var result = [];
  var minus = t < 0 ? "-" : "";
  if (minus)
    t = -t;
  for (var unit in units) {
    var u = unsafeWindow.LocalizationStrings.timeunits.short[unit];
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

function clickable(tag, onclick, id) {
  if (!tag.tag)
    tag.tag = <a href="#" id={ id }>&#160;</a>;
  tag = node(tag);
  if (id) tag = tag[id];
  clickTo(tag, onclick);
}

function toggler(img, callback, url) {
  toggler.id = (toggler.id || 0) + 1;
  var id = "toggler" + toggler.id;
  var pane = $("miniPane") || node({ append: $("breadcrumbs"),
                                     tag: <div id="miniPane"/> }).miniPane;
  node({ tag: <a id={ id } href={ url || "#" }> <img src={ img }/></a>,
         append: pane });
  clickTo($(id), callback);
}

function cssToggler(id, enabled, img, css, cb) {
  function toggle() {
    css.disabled = config.set("default-"+id, !css.disabled);
    if (isFunction(cb)) cb(!css.disabled);
  }
  if (!isString(css)) css = css.toXMLString();
  css = node({ tag: "style", text: css,
               append: document.documentElement.firstChild });
  css.disabled = config.get("default-"+id, !enabled);
  toggler(img, toggle, "#"+id);
}

function cityHasBuilding(b) {
  b = buildingID(b);
  return function(city) { return config.getCity(["l", b], 0, city); };
}

function cityName(id) {
  //return cityNames()[cityIDs().indexOf(integer(id))];
  var name = {};
  var ids = cityIDs();
  var names = cityNames();
  for (var i = 0; i < ids.length; i++)
    name[ids[i]] = names[i];
  console.log(name.toSource, id);
  return name[id];
}

string.r = /([\x00-\x1F\\\x22])/g;
string.m = { "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f",
             '"' : '\\"', "\\": "\\\\" };
function string(s) {
  if (string.r.test(s)) {
    return '"'+ s.replace(string.r, function(a, b) {
      var c = string.m[b];
      if (c) return c;
      c = b.charCodeAt().toString(16);
      return "\\u00"+ (c.length < 2 ? "0" : "") + c;
    }) +'"';
  }
  return '"'+ s +'"';
}

var console = { log: function(x) {
  if (!config.get("debug")) return;
  x = isString(x) ? string(x) : x;
  location.href = "javascript:void console.log(" + x +")";
}};
