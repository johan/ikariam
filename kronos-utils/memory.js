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
           r: resourceWorkers, w: woodWorkers, museum: culture items },
      b: { bID:time busy to }
    }, ...
  }
}
*/

// config.get() and config.set() store config data in (near-)json in prefs.js.
var none = { v: 1, capital: 0, treaties: [], spies: {}, players: {},
             cities: {}, islands: {}, techs: {}, battles: {} };

var data = eval(GM_getValue("config", none));
var server = eval(GM_getValue(location.host, none));

function saveConfig() {
  GM_setValue("config", uneval(data));
  console.log("config ", uneval(data));
}
function saveServer() {
  GM_setValue(location.host, uneval(server));
  //console.log("server ", uneval(server));
}

var config = (function() {
  function get(name, value) {
    return data.hasOwnProperty(name) ? data[name] : value;
  }
  function getCity(name, value, id) {
    return getServer(["cities", id || cityID()].concat(array(name)), value);
  }
  function setCity(name, value, id) {
    return setServer(["cities", id || cityID()].concat(array(name)), value);
  }
  function getIsle(name, value, id) {
    return getServer(["islands", id || islandID()].concat(array(name)), value);
  }
  function setIsle(name, value, id) {
    return setServer(["islands", id || islandID()].concat(array(name)), value);
  }
  function getServer(name, value) {
    if ("?!" == value) console.log(name, value);
    var path = isString(name) ? name.split(".") : name;
    var save = name;
    var scope = server;
    for (var i = 0; i < path.length; i++) {
      name = path[i];
      if (!scope.hasOwnProperty(name)) {
        if ("?!" == value) console.log(save.join("/"), scope);
        //console.log(save.join("/", value);
        return value;
      }
      scope = scope[name];
    }
    if ("?!" == value) console.log(save.join("-"), scope);
    //console.log(save, value, scope);
    return scope;
  }
  function set(name, value) {
    var path = isString(name) ? name.split(".") : name;
    var scope = data, last = path.length - 1;
    for (var i = 0; i <= last; i++) {
      name = path[i];
      if (i != last)
        scope = scope[name] = scope[name] || {};
      else
        scope[name] = value;
    }
    expensive(saveConfig)();
    return value;
  }
  function setServer(name, value) {
    var path = isString(name) ? name.split(".") : name;
    var tmpl = { 3: { cities: [{}, {l: Array, p: Array, q: Array}] } };
    var scope = server, last = path.length - 1;
    for (var i = 0; i <= last; i++) {
      name = path[i];
      if (i != last) {
        if (!scope.hasOwnProperty(name)) try {
          var type = tmpl[path[0]][path.length][i][name];
        } catch(e) { type = Object; } finally {
          scope[name] = new type;
        }
        scope = scope[name];
      } else
        scope[name] = value;
    }
    expensive(saveServer)();
    return value;
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
})();
