var base = "http://github.com/johan/ikariam/raw/master/kronos-utils/";

// resources (name to the kronos id:s for data structures with info on them)
var resourceIDs = {
  gold: "g", wood: "w", wine: "W", marble: "M", crystal: "C", sulfur: "S",
  time: "t", inhabitants: "p", maxActionPoints: "a", glass: "C"
};

// buildings (maps className to id number used in url / ikipedia and as above):
var buildingIDs = {
  townHall: 0, townhall: 0, port: 3, academy: 4, shipyard: 5, barracks: 6,
  warehouse: 7, wall: 8, tavern: 9, museum: 10, palace: 11, embassy: 12,
  branchOffice: 13, workshop: 15, "workshop-army": 15, "workshop-fleet": 15,
  safehouse: 16, palaceColony: 17, resource: 1, tradegood: 2, forester: 18,
  stonemason: 19, glassblowing: 20, winegrower: 21, alchemist: 22,
  carpentering: 23, architect: 24, optician: 25, vineyard: 26, fireworker: 27,
  temple: 28, dump: 29
};
var bonusBuildings = { w: "carpentering", W: "vineyard", M: "architect", C: "optician", S: "fireworker" };
var prodIncreasers = { w: "forester",  W: "winegrower", M: "stonemason", C: "glassblowing", S: "alchemist" };
// wonder id to resource bonus; c is the number of these in the game as a whole:
var wonders = [, {r:"S",c:353}, {r:"M", c:430}, {r:"W", c:395}, {r:"C", c:363},
	       {/*w:5,*/c:955}, {/*w:6*/c:890}, {/*w:7*/c:954}, {/*w:8*/c:960}];
var wineMultiplier = 60;
// 3 unused variables. to be changed/added when necessary
//var softCap = [24,21 /* sawmill */,,,,,24,,24,,8,4,,,,24,20,4]; // 16 for others
//var GarrisonTH = 200;
//var GarrisonModifier = 50;
var townHallSafeRes = 100;
var safeResMultiplier = 80;

var buildingCapacities = {
  townHall: // max. population, lvl. 0 - 28
    [   0,
       60,   96,  142,  200,  262,  332,  410,  492,  580,  672,
      768,  870,  976, 1086, 1200, 1320, 1440, 1566, 1696, 1828,
     1964, 2102, 2246, 2390, 2540, 2690, 2844, 3002],

  academy: // max. scientists, lvl. 0 - 27
    [   0,
        8,   12,   16,   22,   28,   35,   43,   51,   60,   69,
       79,   89,  100,  111,  122,  134,  146,  159,  172,  185,
      198,  212,  227,  241,  256,  271,  287],

  tavern: // max. served, lvl. 0 - 40
    [   0,
        4,    8,   13,   18,   24,   30,   37,   44,   51,   60,
       68,   78,   88,   99,  110,  122,  136,  150,  165,  180,
      197,  216,  235,  255,  277,  300,  325,  351,  378,  408,
      439,  472,  507,  544,  584,  626,  679,  717,  766,  818],

  port: // loading speed, lvl. 0 - 33
    [  15,
       30,   60,   93,  129,  169,  213,  261,  315,  373,  437,
      508,  586,  672,  766,  869,  983, 1108, 1246, 1398, 1565,
     1748, 1950, 2172, 2416, 2685, 2980, 3305, 3663, 4056, 4489,
     4965, 5488, 6064],

  warehouse: {
    // storage capacity, includes town hall (3000/1500), lvl. 0 - 40
    w: [  3e3,
         11e3,  19e3,  27e3,  35e3,  43e3,  51e3,  59e3,  67e3,  75e3,  83e3,
         91e3,  99e3, 107e3, 115e3, 123e3, 131e3, 139e3, 147e3, 155e3, 163e3,
        171e3, 179e3, 187e3, 195e3, 203e3, 211e3, 219e3, 227e3, 235e3, 243e3,
        251e3, 259e3, 267e3, 275e3, 283e3, 291e3, 299e3, 307e3, 315e3, 323e3],
    r: [   1.5e3,
           9.5e3,  17.5e3,  25.5e3,  33.5e3,  41.5e3,
          49.5e3,  57.5e3,  65.5e3,  73.5e3,  81.5e3,
          89.5e3,  97.5e3, 105.5e3, 113.5e3, 121.5e3,
         129.5e3, 137.5e3, 145.5e3, 153.5e3, 161.5e3,
         169.5e3, 177.5e3, 185.5e3, 193.5e3, 201.5e3,
         209.5e3, 217.5e3, 225.5e3, 233.5e3, 241.5e3,
         249.5e3, 257.5e3, 265.5e3, 273.5e3, 281.5e3,
         289.5e3, 297.5e3, 305.5e3, 313.5e3, 321.5e3],
    // safe
    wood: [  100,
             260,  420,  580,  740,  900, 1060, 1220, 1380, 1540, 1700,
            1860, 2020, 2180, 2340, 2500, 2660, 2820, 2980, 3140, 3300,
            3460, 3620, 3780, 3940, 4100, 4260, 4420, 4580, 4740, 4900,
            5060, 5220, 5380, 5540, 5700, 5860, 6020, 6180, 6340, 6500],
    rest: [  100,
             180,  260,  340,  420,  500,  580,  660,  740,  820,  900,
             980, 1060, 1140, 1220, 1300, 1380, 1460, 1540, 1620, 1700,
            1780, 1860, 1940, 2020, 2100, 2180, 2260, 2340, 2420, 2500,
            2580, 2660, 2740, 2820, 2900, 2980, 3060, 3140, 3220, 3300]
    },
  dump: {
    // storage capacity, includes town hall (1500), lvl. 0 - 40
    w: [ 1.5e3,
         33.5e3,   65.5e3,   97.5e3,   129.5e3,  161.5e3,  193.5e3,  225.5e3,
         257.5e3,  289.5e3,  321.5e3,  353.5e3,  385.5e3,  417.5e3,  449.5e3,
         481.5e3,  513.5e3,  545.5e3,  577.5e3,  609.5e3,  641.5e3,  673.5e3,
         705.5e3,  737.5e3,  769.5e3,  801.5e3,  833.5e3,  865.5e3,  897.5e3,
         929.5e3,  961.5e3,  993.5e3,  1025.5e3, 1057.5e3, 1089.5e3, 1121.5e3,
         1153.5e3, 1185.5e3, 1217.5e3, 1249.5e3, 1281.5e3],
    r: [ 1.5e3,
         33.5e3,   65.5e3,   97.5e3,   129.5e3,  161.5e3,  193.5e3,  225.5e3,
         257.5e3,  289.5e3,  321.5e3,  353.5e3,  385.5e3,  417.5e3,  449.5e3,
         481.5e3,  513.5e3,  545.5e3,  577.5e3,  609.5e3,  641.5e3,  673.5e3,
         705.5e3,  737.5e3,  769.5e3,  801.5e3,  833.5e3,  865.5e3,  897.5e3,
         929.5e3,  961.5e3,  993.5e3,  1025.5e3, 1057.5e3, 1089.5e3, 1121.5e3,
         1153.5e3, 1185.5e3, 1217.5e3, 1249.5e3, 1281.5e3],
  },
  temple: // Priests, lvl. 0 - 24, 26, 28
	[   0,
	   12,   23,   37,   54,   73,   94,  117,  142,  168,  196,
	  225,  255,  287,  320,  355,  390,  427,  464,  503,  543,
	  583,  625,  668,  711,     ,  801,     ,  895],
};

function getSword(level) {
  if (!level) return GM_getResourceURL("ico_sword_silver");
  return "/skin/layout/sword-icon"+ (4-level) +".gif";
}
function getShield(level) {
  if (!level) return GM_getResourceURL("ico_shield_silver");
  return "/skin/layout/shield-icon"+ (4-level) +".gif";
}
function getCity(level, col) {
  var levels = [1, 2, 4, 7, 10, 13, 16, 18], lvl;
  do {
    lvl = levels.indexOf(level--) + 1;
  } while (!lvl);
  return "/skin/img/island/city_"+ lvl +"_"+ (col || "red") +".gif";
}

var gfx = {
        wood: "/skin/resources/icon_wood.gif",
        wine: "/skin/resources/icon_wine.gif",
      marble: "/skin/resources/icon_marble.gif",
     crystal: "/skin/resources/icon_glass.gif",
      sulfur: "/skin/resources/icon_sulfur.gif",

         pop: "/skin/resources/icon_population.gif",
     citizen: "/skin/resources/icon_citizen.gif",
    milScore: "/skin/unitdesc/unit_helmet.gif",
      upkeep: "/skin/resources/icon_upkeep.gif",
        gold: "/skin/resources/icon_gold.gif",
        time: "/skin/resources/icon_time.gif",
 journeytime: "/skin/img/icon_target2.gif", // icon_journeytime.gif: bad bg :-(
        bulb: "/skin/layout/bulb-on.gif",
        city: "/skin/layout/icon-city2.gif",
     bigcity: "/skin/layout/city.gif",
    citywall: "/skin/layout/icon-wall.gif",
        palm: "/skin/layout/icon-palm.gif",
        isle: "/skin/layout/icon-island.gif",
        plus: "/skin/buttons/premiumadvisors_plus.gif",
       build: "/skin/icons/city_30x30.gif",

       sword: getSword,
      shield: getShield,
    islecity: getCity,

      swords: "/skin/layout/icon-crossedswords.gif", // 33x27
   bigshield: "/skin/unitdesc/unit_defend.gif", // 26x26
      attack: "/skin/layout/sword-icon-report.gif",
      defend: "/skin/layout/shield-icon-report.gif",
     stamina: "/skin/layout/icon-endurance2.gif",
   alliances: base + "gfx/icons/alliances-colour.png",

     pillage: "/skin/actions/plunder.gif",
         spy: "/skin/layout/icon-mission.gif",

       world: "/skin/layout/icon-world.gif",
      spacer: "data:image/gif;base64,R0lGODlhAQABAID/A" +
              "MDAwAAAACH5BAEAAAAALAAAAAABAAEAAAEBMgA7",

    townHall: "/skin/img/city/building_townhall.gif",
        port: "/skin/img/city/building_port.gif",
     academy: "/skin/img/city/building_academy.gif",
    shipyard: "/skin/img/city/building_shipyard.gif",
    barracks: "/skin/img/city/building_barracks.gif",
   warehouse: "/skin/img/city/building_warehouse.gif",
        wall: "/skin/img/city/building_wall.gif",
      tavern: "/skin/img/city/building_tavern.gif",
      museum: "/skin/img/city/building_museum.gif",
      palace: "/skin/img/city/building_palace.gif",
     embassy: "/skin/img/city/building_embassy.gif",
branchOffice: "/skin/img/city/building_branchOffice.gif",
    workshop: "/skin/img/city/building_workshop.gif",
   safehouse: "/skin/img/city/building_safehouse.gif",

    forester: "/skin/img/city/building_forester.gif",
  stonemason: "/skin/img/city/building_stonemason.gif",
glassblowing: "/skin/img/city/building_glassblowing.gif",
  winegrower: "/skin/img/city/building_winegrower.gif",
   alchemist: "/skin/img/city/building_alchemist.gif",
carpentering: "/skin/img/city/building_carpentering.gif",
   architect: "/skin/img/city/building_architect.gif",
    optician: "/skin/img/city/building_optician.gif",
    vineyard: "/skin/img/city/building_vineyard.gif",
  fireworker: "/skin/img/city/building_fireworker.gif"
};


// These tables are not yet full coverage for 0.3.0+. If you want to provide any
// updates, you must figure out what each level of each house would cost BEFORE
// applying the research and building bonuses you have, though, or Kronos won't
// get the figures right (easiest by harvesting the wiki, if it contains data
// this file doesn't). If you have understood this, please note that your data
// is not tainted by bonuses, so Kronos does not get buggy data again. Thanks!

var costs = [
// townHall (31) town hall
[{},{w:158,t:"59m 4s"},{w:335,t:"1h 6m"},{w:623,t:"1h 14m"},{w:923,M:285,t:"1h 23m"},{w:1390,M:551,t:"1h 34m"},{w:2015,M:936,t:"1h 48m"},{w:2706,M:1411,t:"2h 3m"},{w:3661,M:2091,t:"2h 21m"},{w:4776,M:2945,t:"2h 42m"},{w:6173,M:4072,t:"3h 6m"},{w:8074,M:5664,t:"3h 35m"},{w:10281,M:7637,t:"4h 8m"},{w:13023,M:10214,t:"4h 48m"},{w:16424,M:13575,t:"5h 34m"},{w:20986,M:18254,t:"6h 27m"},{w:25423,M:23249,t:"7h 30m"},{w:32285,M:31022,t:"8h 44m"},{w:40232,M:40599,t:"10h 10m"},{w:49286,M:52216,t:"11h 51m"},{w:61207,M:68069,t:"13h 49m"},{w:74804,M:87316,t:"16h 6m"},{w:93956,M:115101,t:"18h 48m"},{w:113035,M:145326,t:"21h 56m"},{w:141594,M:191053,t:"1D 1h"},{w:170213,M:241039,t:"1D 5h"},{w:210011,M:312128,t:"1D 10h"},{w:258875,M:403825,t:"1D 16h"},{w:314902,M:515593,t:"1D 23h"},{w:387655,M:666227,t:"2D 7h"},{w:471194,M:850031,t:"2D 17h"},,,{w:854728,M:1783721,t:"4D 8h"}],,,

// port (32,34,35)
[{w:60,t:"8m 24s"},{w:150,t:"23m 6s"},{w:274,t:"30m 21s"},{w:429,t:"38m 41s"},{w:637,t:"48m 15s"},{w:894,M:176,t:"59m 17s"},{w:1207,M:326,t:"1h 11m"},{w:1645,M:540,t:"1h 26m"},{w:2106,M:791,t:"1h 43m"},{w:2735,M:1138,t:"2h 2m"},{w:3537,M:1598,t:"2h 24m"},{w:4492,M:2176,t:"2h 50m"},{w:5689,M:2928,t:"3h 19m"},{w:7103,M:3859,t:"3h 53m"},{w:8850,M:5051,t:"4h 31m"},{w:11094,M:6628,t:"5h 16m"},{w:13731,M:8566,t:"6h 7m"},{w:17062,M:11089,t:"7h 6m"},{w:21097,M:14265,t:"8h 14m"},{w:25965,M:18241,t:"9h 32m"},{w:31810,M:23197,t:"11h 2m"},{w:39190,M:29642,t:"12h 45m"},{w:47998,M:37636,t:"14h 43m"},{w:58713,M:47703,t:"17h 14s"},{w:71955,M:60556,t:"19h 37m"},{w:87627,M:76367,t:"22h 37m"},{w:107102,M:96638,t:"1D 2h"},{w:130777,M:122157,t:"1D 6h"},{w:159019,M:153754,t:"1D 10h"},{w:193937,M:194089,t:"1D 15h"},{w:253849,M:244300,t:"1D 21h"},{w:286514,M:307174,t:"2D 4h"},,{w:423989,M:486969,t:"2D 22h"},{w:513947,M:610991,t:"3D 8h"}],

// academy (28)
[{w:64,t:"8m 24s"},{w:68,t:"22m 34s"},{w:115,t:"29m 28s"},{w:263,t:"37m 46s"},{w:382,C:225,t:"47m 43s"},{w:626,C:428,t:"59m 40s"},{w:982,C:744,t:"1h 14m"},{w:1330,C:1089,t:"1h 31m"},{w:2004,C:1748,t:"1h 51m"},{w:2665,C:2454,t:"2h 16m"},{w:3916,C:3786,t:"2h 46m"},{w:5156,C:5216,t:"3h 21m"},{w:7446,C:7862,t:"4h 4m"},{w:9753,C:10729,t:"4h 56m"},{w:12751,C:14599,t:"5h 57m"},{w:18163,C:21627,t:"7h 11m"},{w:23691,C:29321,t:"8h 40m"},{w:33450,C:43020,t:"10h 26m"},{w:43571,C:58213,t:"12h 34m"},{w:56728,C:78724,t:"15h 8m"},{w:73832,C:106414,t:"18h 12m"},{w:103459,C:154857,t:"21h 52m"},{w:144202,C:224146,t:"1D 2h"},{w:175057,C:282571,t:"1D 7h"},{w:243930,C:408877,t:"1D 13h"},{w:317208,C:552141,t:"1D 21h"},{w:439967,C:795252,t:"2D 6h"},{w:536310,C:1006648,t:"2D 17h"}],

// shipyard (26)
[{w:105,t:"43m 12s"},{w:202,t:"51m 18s"},{w:324,t:"59m 48s"},{w:477,t:"1h 8m"},{w:671,t:"1h 18m"},{w:914,M:778,t:"1h 27m"},{w:1222,M:1052,t:"1h 38m"},{w:1609,M:1397,t:"1h 49m"},{w:2096,M:1832,t:"2h 33s"},{w:2711,M:2381,t:"2h 12m"},{w:3485,M:3071,t:"2h 25m"},{w:4460,M:3942,t:"2h 38m"},{w:5689,M:5038,t:"2h 52m"},{w:7238,M:6420,t:"3h 6m"},{w:9190,M:8161,t:"3h 21m"},{w:11648,M:10354,t:"3h 37m"},{w:14746,M:13118,t:"3h 54m"},{w:18650,M:16601,t:"4h 12m"},{w:23568,M:20989,t:"4h 31m"},{w:29765,M:26517,t:"4h 50m"},{w:37573,M:33484,t:"5h 11m"},{w:47412,M:42261,t:"5h 32m"},{w:59807,M:53321,t:"5h 55m"},{w:75428,M:67256,t:"6h 18m"},{w:95108,M:84814,t:"6h 43m"},{w:119906,M:106938,t:"7h 9m"}],

// barracks (36)
[{w:49,t:"6m 36s"},{w:114,t:"17m 24s"},{w:195,t:"22m 1s"},{w:296,t:"27m 6s"},{w:420,t:"32m 42s"},{w:574,t:"38m 50s"},{w:766,t:"45m 36s"},{w:1003,t:"53m 3s"},{w:1297,M:178,t:"1h 1m"},{w:1662,M:431,t:"1h 10m"},{w:2115,M:745,t:"1h 20m"},{w:2676,M:1134,t:"1h 31m"},{w:3371,M:1616,t:"1h 43m"},{w:4234,M:2214,t:"1h 56m"},{w:5304,M:2956,t:"2h 10m"},{w:6630,M:3875,t:"2h 26m"},{w:8275,M:5015,t:"2h 44m"},{w:10314,M:6429,t:"3h 3m"},{w:12843,M:8183,t:"3h 24m"},{w:15979,M:10357,t:"3h 48m"},{w:19868,M:13052,t:"4h 13m"},{w:24690,M:16395,t:"4h 42m"},{w:30669,M:20540,t:"5h 13m"},{w:38083,M:25680,t:"5h 47m"},{w:47276,M:32054,t:"6h 24m"},{w:58676,M:39957,t:"7h 6m"},{w:72812,M:49757,t:"7h 51m"},{w:90341,M:61909,t:"8h 41m"},{w:112076,M:76977,t:"9h 36m"},{w:139028,M:95661,t:"10h 37m"},{w:172447,M:118830,t:"11h 44m"},{w:213889,M:147560,t:"12h 57m"},{w:265276,M:183185,t:"14h 17m"},{w:328996,M:227359,t:"15h 46m"},{w:408008,M:282136,t:"17h 24m"},{w:505984,M:350059,t:"19h 11m"}],

// warehouse (40)
[{w:160,t:"18m 43s"},{w:288,t:"26m 23s"},{w:442,t:"35m 7s"},{w:626,M:96,t:"45m 4s"},{w:847,M:211,t:"56m 25s"},{w:1113,M:349,t:"1h 9m"},{w:1431,M:515,t:"1h 24m"},{w:1813,M:714,t:"1h 40m"},{w:2272,M:953,t:"2h 6s"},{w:2822,M:1240,t:"2h 21m"},{w:3483,M:1584,t:"2h 46m"},{w:4275,M:1997,t:"3h 15m"},{w:5226,M:2492,t:"3h 47m"},{w:6368,M:3086,t:"4h 24m"},{w:7737,M:3799,t:"5h 6m"},{w:9380,M:4656,t:"5h 54m"},{w:11353,M:5683,t:"6h 49m"},{w:13719,M:6915,t:"7h 51m"},{w:16559,M:8394,t:"9h 2m"},{w:19967,M:10169,t:"10h 23m"},{w:24056,M:12299,t:"11h 56m"},{w:28963,M:14855,t:"13h 41m"},{w:34852,M:17921,t:"15h 41m"},{w:41918,M:21602,t:"17h 58m"},{w:50398,M:26019,t:"20h 34m"},{w:60574,M:31319,t:"23h 32m"},{w:72784,M:37678,t:"1D 2h"},{w:87437,M:45310,t:"1D 6h"},{w:105021,M:54468,t:"1D 11h"},{w:126121,M:65458,t:"1D 16h"},{w:151441,M:78645,t:"1D 21h"},{w:181825,M:94471,t:"2D 4h"},{w:218286,M:113461,t:"2D 11h"},{w:262039,M:136249,t:"2D 20h"},{w:314543,M:163595,t:"3D 5h"},{w:377548,M:196409,t:"3D 16h"},{w:453153,M:235787,t:"4D 5h"},{w:543880,M:283041,t:"4D 19h"},{w:652752,M:339745,t:"5D 11h"},{w:783398,M:407790,t:"6D 6h"}],

// wall (39)
[{w:114,t:"21m"},{w:361,M:203,t:"51m 36s"},{w:657,M:516,t:"1h 2m"},{w:1012,M:892,t:"1h 13m"},{w:1439,M:1344,t:"1h 26m"},{w:1951,M:1885,t:"1h 40m"},{w:2565,M:2535,t:"1h 56m"},{w:3302,M:3315,t:"2h 13m"},{w:4186,M:4251,t:"2h 31m"},{w:5247,M:5374,t:"2h 52m"},{w:6521,M:6721,t:"3h 15m"},{w:8049,M:8338,t:"3h 39m"},{w:9882,M:10279,t:"4h 7m"},{w:12083,M:12608,t:"4h 37m"},{w:14724,M:15402,t:"5h 10m"},{w:17892,M:18755,t:"5h 47m"},{w:21695,M:22779,t:"6h 27m"},{w:26258,M:27607,t:"7h 11m"},{w:31733,M:33402,t:"7h 59m"},{w:38304,M:40355,t:"8h 53m"},{w:46189,M:48699,t:"9h 51m"},{w:55650,M:58711,t:"10h 56m"},{w:67004,M:70726,t:"12h 7m"},{w:80629,M:85144,t:"13h 25m"},{w:96978,M:102445,t:"14h 51m"},{w:116599,M:123208,t:"16h 26m"},{w:140143,M:148122,t:"18h 10m"},{w:168395,M:178019,t:"20h 4m"},{w:202297,M:213896,t:"22h 10m"},{w:242982,M:256948,t:"1D 28m"},{w:291802,M:308610,t:"1D 3h"},{w:350386,M:370604,t:"1D 5h"},{w:420688,M:444997,t:"1D 8h"},{w:505049,M:534271,t:"1D 12h"},{w:606284,M:641397,t:"1D 15h"},{w:727765,M:769949,t:"1D 20h"},{w:873541,M:924213,t:"2D 33m"},{w:1048473,M:1109328,t:"2D 5h"},{w:1258393,M:1331467,t:"2D 10h"}],

// tavern (35,40, 41)
[{w:101,t:"16m 48s"},{w:222,t:"28m 15s"},{w:367,t:"40m 23s"},{w:541,M:94,t:"53m 15s"},{w:750,M:122,t:"1h 6m"},{w:1001,M:158,t:"1h 21m"},{w:1302,M:206,t:"1h 36m"},{w:1663,M:267,t:"1h 52m"},{w:2097,M:348,t:"2h 10m"},{w:2617,M:452,t:"2h 28m"},{w:3241,M:587,t:"2h 47m"},{w:3990,M:764,t:"3h 8m"},{w:4888,M:993,t:"3h 29m"},{w:5967,M:1290,t:"3h 52m"},{w:7261,M:1677,t:"4h 17m"},{w:8814,M:2181,t:"4h 43m"},{w:10678,M:2835,t:"5h 10m"},{w:12914,M:3685,t:"5h 39m"},{w:15598,M:4791,t:"6h 10m"},{w:18818,M:6228,t:"6h 43m"},{w:22683,M:8097,t:"7h 17m"},{w:27320,M:10526,t:"7h 54m"},{w:32885,M:13684,t:"8h 33m"},{w:39562,M:17789,t:"9h 14m"},{w:47576,M:23125,t:"9h 58m"},{w:57191,M:30063,t:"10h 44m"},{w:68730,M:39082,t:"11h 34m"},{w:82578,M:50806,t:"12h 26m"},{w:99194,M:66048,t:"13h 21m"},{w:119134,M:85862,t:"14h 19m"},{w:143061,M:111620,t:"15h 21m"},{w:171774,M:145107,t:"16h 27m"},{w:206230,M:188639,t:"17h 37m"},{w:247577,M:245231,t:"18h 51m"},{w:297193,M:318800,t:"20h 9m"},{w:356732,M:414441,t:"21h 32m"},,,,{w:587853,M:939986,t:"1D 3h"},{w:888413,M:1538791,t:"1D 5h"}],

// museum (15, 18)
[{w:560,M:280,t:"1h 36m"},{w:1435,M:1190,t:"2h 9m"},{w:2748,M:2573,t:"2h 45m"},{w:4716,M:4676,t:"3h 25m"},{w:7669,M:7871,t:"4h 9m"},{w:12099,M:12729,t:"4h 57m"},{w:18744,M:20112,t:"5h 50m"},{w:28710,M:31335,t:"6h 49m"},{w:43660,M:48393,t:"7h 53m"},{w:66086,M:74323,t:"9h 4m"},{w:99724,M:113736,t:"10h 21m"},{w:150181,M:173643,t:"11h 47m"},{w:225866,M:264701,t:"13h 21m"},{w:347474,M:412707,t:"15h 5m"},{w:404751,M:487184,t:"16h 59m"},,,{w:1723017,M:2158158,t:"23h 53m"}],

// palace (10)
[{w:712,t:"4h 28m"},{w:5824,M:1434,t:"6h 16m"},{w:16048,M:4546,S:3089,t:"8h 46m"},{w:36496,W:10898,M:10770,S:10301,t:"12h 17m"},{w:77392,W:22110,M:23218,C:21188,S:24725,t:"17h 12m"},{w:159184,W:44534,M:48114,C:42400,S:53573,t:"1D 5m"},{w:322768,W:89382,M:97906,C:84824,S:111269,t:"1D 9h"},{w:649936,W:179078,M:197490,C:169671,S:226661,t:"1D 23h"},{w:1304272,W:358470,M:396658,C:339368,S:457445,t:"2D 18h"},{w:2612943,W:717254,M:794994,C:678760,S:919013,t:"3D 20h"}],

// embassy (28)
[{w:242,M:155,t:"1h 12m"},{w:415,M:342,t:"1h 24m"},{w:623,M:571,t:"1h 36m"},{w:873,M:850,t:"1h 49m"},{w:1173,M:1190,t:"2h 3m"},{w:1532,M:1606,t:"2h 18m"},{w:1964,M:2112,t:"2h 33m"},{w:2482,M:2730,t:"2h 49m"},{w:3103,M:3484,t:"3h 6m"},{w:3849,M:4404,t:"3h 24m"},{w:4743,M:5527,t:"3h 42m"},{w:5817,M:6896,t:"4h 2m"},{w:7105,M:8566,t:"4h 23m"},{w:8651,M:10604,t:"4h 44m"},{w:10507,M:13090,t:"5h 7m"},{w:12733,M:16123,t:"5h 30m"},{w:15404,M:19823,t:"5h 55m"},{w:18498,M:24339,t:"6h 22m"},{w:22457,M:29846,t:"6h 49m"},{w:27074,M:36564,t:"7h 18m"},{w:32290,M:45216,t:"7h 48m"},{w:39261,M:54769,t:"8h 20m"},{w:47240,M:66733,t:"8h 54m"},{w:56812,M:81859,t:"9h 29m"},{w:70157,M:104537,t:"10h 6m"},{w:82083,M:122170,t:"10h 44m"},{w:101310,M:158759,t:"11h 25m"},{w:118475,M:182177,t:"12h 8m"}],

// branchOffice (30) trading post
[{w:48,t:"24m"},{w:173,t:"42m"},{w:346,t:"1h 1m"},{w:581,t:"1h 23m"},{w:896,M:540,t:"1h 47m"},{w:1314,M:792,t:"2h 13m"},{w:1863,M:1123,t:"2h 42m"},{w:2580,M:1555,t:"3h 14m"},{w:3509,M:2115,t:"3h 49m"},{w:4706,M:2837,t:"4h 28m"},{w:6241,M:3762,t:"5h 10m"},{w:8203,M:4945,t:"5h 57m"},{w:10699,M:6450,t:"6h 48m"},{w:13866,M:8359,t:"7h 45m"},{w:17872,M:10774,t:"8h 47m"},{w:22926,M:13820,t:"9h 55m"},{w:29286,M:17654,t:"11h 11m"},{w:37273,M:22469,t:"12h 33m"},{w:47284,M:28503,t:"14h 4m"},{w:51434,M:31004,t:"15h 44m"},{w:64885,M:39114,t:"17h 34m"},{w:87680,M:52854,t:"19h 36m"},{w:119245,M:71882,t:"21h 49m"},{w:149454,M:90093,t:"1D 15m"},{w:186976,M:112713,t:"1D 2h"},{w:233530,M:140776,t:"1D 5h"},{w:291226,M:175556,t:"1D 9h"},{w:362658,M:218615,t:"1D 12h"},{w:451015,M:271878,t:"1D 16h"},{w:560208,M:337702,t:"1D 20h"}],,

// workshop (28)
[{w:220,M:95,t:"42m"},{w:383,M:167,t:"54m"},{w:569,M:251,t:"1h 6m"},{w:781,M:349,t:"1h 19m"},{w:1023,M:461,t:"1h 33m"},{w:1299,M:592,t:"1h 48m"},{w:1613,M:744,t:"2h 3m"},{w:1972,M:920,t:"2h 19m"},{w:2380,M:1125,t:"2h 36m"},{w:2846,M:1362,t:"2h 54m"},{w:3377,M:1637,t:"3h 12m"},{w:3982,M:1956,t:"3h 32m"},{w:4672,M:2326,t:"3h 53m"},{w:5458,M:2755,t:"4h 14m"},{w:6355,M:3253,t:"4h 37m"},{w:7377,M:3831,t:"5h 57s"},{w:8542,M:4500,t:"5h 25m"},{w:9870,M:5278,t:"5h 52m"},{w:11385,M:6180,t:"6h 19m"},{w:13111,M:7226,t:"6h 48m"},{w:15078,M:8439,t:"7h 18m"},{w:17321,M:9847,t:"7h 50m"},{w:19481,M:11477,t:"8h 24m"},{w:22796,M:13373,t:"8h 59m"},{w:26119,M:15570,t:"9h 36m"},{w:29909,M:18118,t:"10h 14m"},{w:34228,M:21074,t:""},{w:39153,M:24503,t:""}],

// safehouse (32) MAX
[{w:113,t:"24m"},{w:248,t:"36m"},{w:402,t:"48m 36s"},{w:578,M:129,t:"1h 1m"},{w:779,M:197,t:"1h 15m"},{w:1007,M:275,t:"1h 30m"},{w:1267,M:366,t:"1h 45m"},{w:1564,M:471,t:"2h 1m"},{w:1903,M:593,t:"2h 18m"},{w:2288,M:735,t:"2h 36m"},{w:2728,M:900,t:"2h 54m"},{w:3230,M:1090,t:"3h 14m"},{w:3801,M:1312,t:"3h 35m"},{w:4453,M:1569,t:"3h 56m"},{w:5195,M:1866,t:"4h 19m"},{w:6042,M:2212,t:"4h 42m"},{w:7008,M:2613,t:"5h 7m"},{w:8108,M:3078,t:"5h 34m"},{w:9363,M:3617,t:"6h 1m"},{w:10793,M:4243,t:"6h 30m"},{w:12423,M:4968,t:"7h 47s"},{w:14282,M:5810,t:"7h 32m"},{w:16401,M:6787,t:"8h 6m"},{w:18816,M:7919,t:"8h 41m"},{w:21570,M:9233,t:"9h 18m"},{w:24709,M:10758,t:"9h 56m"},{w:28288,M:12526,t:"10h 37m"},{w:32368,M:14577,t:"11h 20m"},{w:37019,M:16956,t:"12h 4m"},{w:42321,M:19716,t:"12h 51m"},{w:48365,M:22917,t:"13h 41m"},{w:55255,M:26631,t:"14h 33m"},{t:"MAX"}],
/* 17: palaceColony / governor's mansion */,

// forester (27)
[{w:250,t:"18m"},{w:430,M:104,t:"30m"},{w:664,M:237,t:"43m 12s"},{w:968,M:410,t:"57m 43s"},{w:1364,M:635,t:"1h 13m"},{w:1878,M:928,t:"1h 31m"},{w:2546,M:1309,t:"1h 50m"},{w:3415,M:1803,t:"2h 11m"},{w:4544,M:2446,t:"2h 35m"},{w:6013,M:3282,t:"3h 57s"},{w:7922,M:4368,t:"3h 29m"},{w:10403,M:5781,t:"4h 22s"},{w:13629,M:7617,t:"4h 34m"},{w:17823,M:10004,t:"5h 12m"},{w:23274,M:13108,t:"5h 53m"},{w:30362,M:17142,t:"6h 39m"},{w:39575,M:22387,t:"7h 29m"},{w:51552,M:29204,t:"8h 24m"},{w:67123,M:38068,t:"9h 25m"},{w:87365,M:49590,t:"10h 31m"},{w:113680,M:64569,t:"11h 45m"},{w:147889,M:84042,t:"13h 6m"},{w:192360,M:109357,t:"14h 34m"},{w:250173,M:142266,t:"16h 12m"},{w:325330,M:185047,t:"17h 59m"},{w:423035,M:240664,t:"19h 58m"},{w:550049,M:312965,t:"22h 8m"}],

// stonemason (28)
[{w:274,t:"18m"},{w:467,M:116,t:"30m"},{w:718,M:255,t:"43m 12s"},{w:1045,M:436,t:"57m 43s"},{w:1469,M:671,t:"1h 13m"},{w:2021,M:977,t:"1h 31m"},{w:2738,M:1375,t:"1h 50m"},{w:3671,M:1892,t:"2h 11m"},{w:4883,M:2564,t:"2h 35m"},{w:6459,M:3437,t:"3h 57s"},{w:8508,M:4572,t:"3h 29m"},{w:11172,M:6049,t:"4h 22s"},{w:14634,M:7968,t:"4h 34m"},{w:19135,M:10462,t:"5h 12m"},{w:24987,M:13705,t:"5h 53m"},{w:32594,M:17921,t:"6h 39m"},{w:42483,M:23402,t:"7h 29m"},{w:55339,M:30527,t:"8h 24m"},{w:72051,M:39790,t:"9h 25m"},{w:93778,M:51831,t:"10h 31m"},{w:122022,M:67485,t:"11h 45m"},{w:158740,M:87835,t:"13h 6m"},{w:206471,M:114290,t:"14h 34m"},{w:268525,M:148681,t:"16h 12m"},{w:349193,M:193390,t:"17h 59m"},{w:454063,M:251512,t:"19h 58m"},{w:590393,M:327069,t:"22h 8m"},{w:767621,M:425295,t:"1D 31m"}],
/* 20: glassblowing */,
/* 21: winegrower */,
/* 22: alchemist */,

// carpentering (32) MAX
[{w:63,t:"13m 12s"},{w:122,t:"16m 48s"},{w:192,t:"20m 37s"},{w:274,t:"24m 40s"},{w:372,t:"28m 57s"},{w:486,t:"33m 30s"},{w:620,t:"38m 19s"},{w:777,M:359,t:"43m 25s"},{w:962,M:444,t:"48m 50s"},{w:1178,M:546,t:"54m 34s"},{w:1432,M:669,t:"1h 39s"},{w:1730,M:816,t:"1h 7m"},{w:2078,M:993,t:"1h 13m"},{w:2486,M:1205,t:"1h 21m"},{w:2964,M:1459,t:"1h 28m"},{w:3524,M:1765,t:"1h 37m"},{w:4178,M:2131,t:"1h 45m"},{w:4945,M:2571,t:"1h 54m"},{w:5841,M:3098,t:"2h 4m"},{w:6890,M:3731,t:"2h 14m"},{w:8117,M:4491,t:"2h 25m"},{w:9551,M:5402,t:"2h 37m"},{w:11229,M:6496,t:"2h 49m"},{w:13190,M:7809,t:"3h 2m"},{w:15484,M:9384,t:"3h 16m"},{w:18165,M:11275,t:"3h 30m"},{w:21299,M:13543,t:"3h 46m"},{w:24963,M:16265,t:"4h 2m"},{w:29245,M:19531,t:"4h 19m"},{w:34249,M:23451,t:"4h 38m"},{w:40095,M:28154,t:"4h 57m"},{w:46930,M:33799,t:"5h 18m"},{t:"MAX"}],

// architect (32) MAX
[{w:185,M:106,t:"16m 12s"},{w:291,M:160,t:"19m 48s"},{w:413,M:222,t:"23m 37s"},{w:555,M:295,t:"27m 40s"},{w:720,M:379,t:"31m 57s"},{w:911,M:475,t:"36m 30s"},{w:1133,M:587,t:"41m 19s"},{w:1390,M:716,t:"46m 25s"},{w:1689,M:865,t:"51m 50s"},{w:2035,M:1036,t:"57m 34s"},{w:2437,M:1233,t:"1h 3m"},{w:2902,M:1460,t:"1h 10m"},{w:3443,M:1722,t:"1h 16m"},{w:4070,M:2023,t:"1h 24m"},{w:4797,M:2369,t:"1h 31m"},{w:5640,M:2767,t:"1h 40m"},{w:6619,M:3226,t:"1h 48m"},{w:7754,M:3752,t:"1h 57m"},{w:9070,M:4359,t:"2h 7m"},{w:10598,M:5056,t:"2h 17m"},{w:12369,M:5857,t:"2h 28m"},{w:14424,M:6777,t:"2h 40m"},{w:16808,M:7836,t:"2h 52m"},{w:19573,M:9052,t:"3h 5m"},{w:22781,M:10449,t:"3h 19m"},{w:26502,M:12055,t:"3h 33m"},{w:30818,M:13899,t:"3h 49m"},{w:35825,M:16017,t:"4h 5m"},{w:41633,M:18450,t:"4h 22m"},{w:48371,M:21245,t:"4h 41m"},{w:56186,M:24454,t:"5h 49s"},{w:65252,M:28140,t:"5h 21m"},{t:"MAX"}],

// optician (32)
[{w:119,t:"13m 48s"},{w:188,M:35,t:"17m 24s"},{w:269,M:96,t:"21m 13s"},{w:362,M:167,t:"25m 16s"},{w:471,M:249,t:"29m 33s"},{w:597,M:345,t:"34m 6s"},{w:742,M:456,t:"38m 55s"},{w:912,M:584,t:"44m 1s"},{w:1108,M:733,t:"49m 26s"},{w:1335,M:905,t:"55m 10s"},{w:1600,M:1106,t:"1h 1m"},{w:1906,M:1338,t:"1h 7m"},{w:2261,M:1608,t:"1h 14m"},{w:2673,M:1921,t:"1h 21m"},{w:3152,M:2283,t:"1h 29m"},{w:3706,M:2704,t:"1h 37m"},{w:3741,M:2745,t:"1h 46m"},{w:5096,M:3759,t:"1h 55m"},{w:5962,M:4416,t:"2h 5m"},{w:6966,M:5178,t:"2h 15m"},{w:8131,M:6062,t:"2h 26m"},{w:9482,M:7087,t:"2h 37m"},{w:11050,M:8276,t:"2h 50m"},{w:12868,M:9656,t:"3h 2m"},{w:14978,M:11257,t:"3h 16m"},{w:17424,M:13113,t:"3h 31m"},{w:20262,M:15267,t:"3h 46m"},{w:23553,M:17762,t:"4h 3m"},{w:27373,M:20662,t:"4h 20m"},{w:31804,M:24024,t:"4h 38m"},{w:36943,M:27922,t:"4h 58m"},{w:42904,M:32447,t:"5h 19m"},{t:"MAX"}],

// vineyard (32) wine cellar MAX
[{w:339,M:123,t:"22m 48s"},{w:423,M:198,t:"26m 24s"},{w:520,M:285,t:"30m 13s"},{w:631,M:387,t:"34m 16s"},{w:758,M:504,t:"38m 33s"},{w:905,M:640,t:"43m 6s"},{w:1074,M:798,t:"47m 55s"},{w:1269,M:981,t:"53m 1s"},{w:1492,M:1194,t:"58m 26s"},{w:1749,M:1440,t:"1h 4m"},{w:2045,M:1726,t:"1h 10m"},{w:2384,M:2058,t:"1h 16m"},{w:2775,M:2443,t:"1h 23m"},{w:3225,M:2889,t:"1h 30m"},{w:3741,M:3407,t:"1h 38m"},{w:4336,M:4008,t:"1h 46m"},{w:5132,M:4705,t:"1h 55m"},{w:5813,M:5513,t:"2h 4m"},{w:6778,M:6450,t:"2h 14m"},{w:7748,M:7537,t:"2h 24m"},{w:8944,M:8800,t:"2h 35m"},{w:10319,M:10263,t:"2h 46m"},{w:11900,M:11961,t:"2h 59m"},{w:13718,M:13930,t:"3h 11m"},{w:15809,M:16214,t:"3h 25m"},{w:18214,M:18864,t:"3h 40m"},{w:20979,M:21938,t:"3h 55m"},{w:24159,M:25503,t:"4h 12m"},{w:27816,M:29639,t:"4h 29m"},{w:32021,M:34437,t:"4h 47m"},{w:36858,M:40002,t:"5h 7m"},{w:42419,M:46457,t:"5h 28m"},{t:"MAX"}],

// fireworker (16)
[{w:272,M:135,t:"16m 12s"},{w:353,M:212,t:"19m 48s"},{w:445,M:302,t:"23m 37s"},{w:551,M:405,t:"27m 40s"},{w:673,M:526,t:"31m 57s"},{w:813,M:665,t:"36m 30s"},{w:974,M:827,t:"41m 19s"},{w:1159,M:1015,t:"46m 25s"},{w:1373,M:1233,t:"51m 50s"},{w:1618,M:1486,t:"57m 34s"},{w:1899,M:1779,t:"1h 3m"},{w:2223,M:2120,t:"1h 10m"},{w:2596,M:2514,t:"1h 16m"},{w:3025,M:2972,t:"1h 24m"},{w:3517,M:3503,t:"1h 31m"},{w:4084,M:4119,t:"1h 40m"}],

// Temple (24,26,29)
[{w:216,C:173,t:"39m 36s"},{w:228,C:190,t:"43m 34s"},{w:333,C:290,t:"47m 55s"},{w:465,C:423,t:"52m 42s"},{w:598,C:567,t:"57m 59s"},{w:760,C:752,t:"1h 3m"},{w:958,C:989,t:"1h 10m"},{w:1197,C:1290,t:"1h 17m"},{w:1432,C:1610,t:"1h 24m"},{w:1773,C:2080,t:"1h 33m"},{w:2112,C:2586,t:"1h 42m"},{w:2512,C:3210,t:"1h 52m"},{w:3082,C:4109,t:"2h 4m"},{w:3655,C:5084,t:"2h 16m"},{w:4458,C:6471,t:"2h 30m"},{w:5126,C:7765,t:"2h 45m"},{w:6232,C:9850,t:"3h 1m"},{w:7167,C:11821,t:"3h 20m"},{w:8687,C:14952,t:"3h 40m"},{w:10247,C:18402,t:"4h 2m"},{w:11784,C:22082,t:"4h 26m"},{w:14228,C:27824,t:"4h 53m"},{w:16752,C:34183,t:"5h 22m"},{w:19265,C:41020,t:"5h 54m"},,{w:31752,C:75424,t:"7h 51m"},,,{w:36746,C:94002,t:"9h 31m"}],

// Dump (34)
[{w:640,M:497,C:700,S:384,t:"12m"},{w:1152,M:932,C:1146,S:845,t:"20m 10s"},{w:1765,M:1445,C:1668,S:1398,t:"29m 42s"},{w:2504,M:2050,C:2278,S:2061,t:"40m 53s"},{w:3388,M:2762,C:2991,S:2857,t:"53m 57s"},{w:4449,M:3608,C:3526,S:3813,t:"1h 9m"},{w:5723,M:4604,C:4803,S:4960,t:"1h 27m"},{w:6697,M:5336,C:5946,S:6335,t:"1h 48m"},{w:9088,M:7163,C:7283,S:7987,t:"2h 12m"},{w:11289,M:8799,C:8847,S:9968,t:"2h 41m"},{w:13930,M:10728,C:10678,S:12346,t:"3h 14m"},{w:17100,M:13004,C:12819,S:15199,t:"3h 53m"},{w:20904,M:15691,C:15325,S:18623,t:"4h 39m"},{w:25469,M:18862,C:18257,S:22731,t:"5h 33m"},{w:30947,M:22602,C:21687,S:27661,t:"6h 36m"},{w:37521,M:27015,C:25700,S:33578,t:"7h 49m"},{w:45410,M:32225,C:30395,S:40677,t:"9h 15m"},{w:54876,M:38371,C:35889,S:49197,t:"10h 56m"},{w:66236,M:45623,C:42316,S:59420,t:"12h 54m"},{w:79867,M:54180,C:49837,S:71688,t:"15h 11m"},{w:96223,M:64278,C:58635,S:86410,t:"17h 53m"},{w:115852,M:76195,C:68930,S:104076,t:"21h 1m"},{w:139408,M:90256,C:80974,S:125275,t:"1D 42m"},{w:167672,M:106847,C:95065,S:150714,t:"1D 5h"},{w:201592,M:126424,C:111553,S:181241,t:"1D 10h"},{w:242293,M:149528,C:130844,S:217873,t:"1D 15h"},{w:291136,M:176788,C:153414,S:261831,t:"1D 22h"},{w:349749,M:208956,C:179821,S:314582,t:"2D 6h"},{w:420082,M:246913,C:201717,S:377882,t:"2D 16h"},{w:504482,M:291703,C:246864,S:453842,t:"3D 3h"},{w:605763,M:344555,C:289157,S:544995,t:"3D 16h"},{w:727299,M:406921,C:338642,S:654378,t:"4D 7h"},{w:873143,M:480512,C:396537,S:785638,t:"5D 1h"},{w:1048156,M:567350,C:464275,S:943149,t:"5D 21h"}],
];

costs[buildingIDs.palaceColony] = costs[buildingIDs.palace];
costs[20] = costs[21] = costs[22] = costs[buildingIDs.stonemason];


/*
// military score contribution: 8 slingers => 1,264 == 8 * 3.95 * slinger.w
var key = { n: "name", i: "image",
  // build costs:
  p: "people", w: "wood", W: "wine", C: "crystal", S: "sulfur", b: "buildtime",
  u: "upkeep", m: "minlevel", o: "optlevel",
  // unit stats:
  a: "attack", d: "defend", s: "stamina", c: "class", v: "speed", x: "special"
};

s: 10 Slingers die against no wall or a level 3+ wall
s: 12 Swordsmen only die against level 5+ wall
s: 14 Phalanx dies against level 14+ wall
s: 12 Archer
s: 16 Rams

*/

/*
// land units:
p = Citizens
w = wood
S = sulfur
b = build time
u = upkeep
m = minimum barrack level
o = optimum barrack level // Alternate WPN dmg
a = attack // phys atk
d = defense // armor
A = Attack Upgrade
D = Defense Upgrade
s = stamina // Hit Points
v = speed
V = volume (cargo ship)
i = image-name for unit-icon, if different from n
*/
var troops = serverVersionIsAtLeast("0.3.2") ? {
  301: {n:"Slinger",p:1,w:20,b:"10m",u:2,m:2,a:2,o:3,d:0,A:1,D:1,s:8,c:"Human",v:60,V:3,x:"Ranged"},
  302: {n:"Swordsman",p:1,w:30,S:30,b:"8m",u:4,m:6,a:10,d:0,A:1,D:1,s:18,c:"Human",v:60,V:3},
  303: {n:"Phalanx",p:1,w:40,S:30,b:"5m",u:3,m:4,a:18,d:1,A:1,D:1,s:56,c:"Human",v:60,V:5},
  304: {n:"Marksman",p:1,w:50,S:150,b:"5m",u:3,m:13,a:3,o:29,d:0,A:1,D:1,s:12,c:"Human",v:60,V:5,x:"Ranged"},
  305: {n:"Mortar",p:5,w:300,S:1250,b:"30m",u:30,m:14,a:10,o:322,d:0,A:1,D:1,s:32,c:"Machina",v:40,V:30,x:"Ram"},
  306: {n:"Catapult",p:5,w:260,S:300,b:"30m",u:25,m:8,a:4,d:0,A:1,D:1,s:54,c:"Machina",v:40,V:30,x:"Ram",o:133},
  307: {n:"Ram",p:5,w:220,b:"30m",u:15,m:3,a:12,o:76,d:1,A:1,D:1,s:88,c:"Machina",v:40,V:30,x:"Ram"},
  308: {n:"Steam Giant",i:"steamgiant",p:2,w:130,S:180,b:"15m",u:12,m:12,a:42,d:3,A:1,D:1,s:184,c:"Machina",v:40,V:15},
  309: {n:"Bombardier",p:5,w:40,S:250,b:"30m",u:45,m:11,a:48,d:0,A:1,D:1,s:25,c:"Machina",v:20,V:30,x:"Bomber"},
  310: {n:"Cook",p:1,w:50,W:150,b:"20m",u:10,m:5,a:20,d:0,A:0,D:0,s:22,c:"Human",v:40,V:20,x:"Regeneration"},
  311: {n:"Doctor",i:"medic",p:1,w:50,C:450,b:"20m",u:20,m:9,a:8,d:0,A:0,D:0,s:12,c:"Human",v:60,V:10,x:"Healer"},
  312: {n:"Gyrocopter",p:3,w:25,S:100,b:"15m",u:15,m:10,o:13,d:0,A:1,D:1,s:21,c:"Machina",v:80,V:15,x:"Ranged"},
  313: {n:"Archer",p:1,w:30,S:25,b:"8m",u:4,m:7,a:5,d:0,A:1,D:1,s:16,c:"Human",v:60,V:5,x:"Ranged",o:5},
  315: {n:"Spear Thrower",p:1,w:30,b:"5m",u:1,m:1,a:4,d:0,A:1,D:1,s:13,c:"Human",v:60,V:3},
  316: {n:"Barbarian-Axe Swinger",a:7,d:1,A:0,D:0,s:12,c:"Human",v:0}
} : // end v0.3.2+ section.

{ // v0.3.0 and v0.3.1
  301: {n:"Slinger",p:1,w:40,b:"17m 11s",u:3,m:1,o:2,a:7,d:6,A:1,D:1,s:7,c:"Human",v:70},
  302: {n:"Swordsman",p:2,w:28,S:36,b:"13m 34s",u:5,m:3,o:4,a:18,d:11,A:3,D:1,s:4,c:"Human",v:60,x:"Assault"},
  303: {n:"Phalanx",p:3,w:46,S:52,b:"20m 51s",u:8,m:4,o:6,a:14,d:30,A:2,D:5,s:8,c:"Human",v:50,x:"Resistance"},
  307: {n:"Ram",p:8,w:98,S:112,b:"23m 3s",u:30,m:6,o:8,a:6,d:50,A:2,D:10,s:5,c:"Machina",v:50,x:"Ram"},
  313: {n:"Archer",p:3,w:55,S:76,b:"14m 10s",u:8,m:7,o:10,a:26,d:23,A:5,D:1,s:4,c:"Human",v:60,x:"Resistance"},
  306: {n:"Catapult",p:6,w:145,S:311,b:"34m 28s",u:30,m:11,o:13,a:34,d:33,A:10,D:6,s:5,c:"Machina",v:40,x:"Ram"},
  304: {n:"Gunsman",i:"marksman",p:4,w:74,S:122,b:"10m 31s",u:10,m:12,o:14,a:42,d:21,A:8,D:2,s:5,c:"Human",v:60},
  305: {n:"Mortar",p:10,w:208,S:845,b:"34m",u:60,m:24,o:24,a:142,d:92,A:18,D:12,s:5,c:"Machina",v:30,x:"Ram"},
  308: {n:"Steam Giant",i:"steamgiant",p:12,w:54,S:235,b:"24m",u:15,m:19,o:22,a:67,d:50,A:10,D:10,s:4,c:"Machina",v:50},
  312: {n:"Gyrocopter",p:4,w:92,S:164,b:"19m 57s",u:10,m:15,o:17,a:35,d:30,A:5,D:4,s:3,c:"Machina",v:80},
  309: {n:"Bombardier",p:8,w:320,S:640,b:"45m",u:30,m:22,o:24,a:184,d:54,A:28,D:8,s:3,c:"Machina",v:40,x:"Assault"},
  311: {n:"Doctor",i:"medic",p:1,w:84,C:622,b:"38m 13s",u:30,m:16,o:28,a:8,d:22,A:0,D:0,s:10,c:"Human",v:60,x:"Healer"},
  310: {n:"Cook",p:1,w:108,W:345,b:"1h 52s",u:30,m:9,o:9,a:12,d:18,A:0,D:0,s:10,c:"Human",v:60,x:"Regeneration"}
}; // end v0.3.0/v0.3.1 section.

for (id in troops) troops[id].id = id;


// sea units:
var ships = serverVersionIsAtLeast("0.3.2") ? {
  201: {n:"Cargo Ship",a:15,d:0,s:30,c:"Steamship",v:60,A:0,D:0,V:500},
  210: {n:"Ram-Ship",p:5,w:220,S:50,b:"40m",u:40,m:1,a:72,d:6,A:2,D:2,s:120,c:"Sailer",v:30},
  211: {n:"Flamethrower",p:4,w:80,S:230,b:"30m",u:30,m:4,a:98,d:3,A:2,D:2,s:110,c:"Steamship",v:40},
  212: {n:"Diving Boat",i:"submarine",p:6,w:160,C:750,b:"1h",u:70,m:7,a:48,d:3,A:2,D:2,s:47,c:"Steamship",v:40,x:"Bomber"},
  213: {n:"Ballista Ship",p:6,w:180,S:160,b:"50m",u:45,m:2,a:48,o:28,d:4,A:2,D:2,s:132,c:"Sailer",v:30,x:"Ranged"},
  214: {n:"Catapult Ship",p:5,w:180,S:140,b:"50m",u:50,m:3,a:28,o:37,d:0,A:2,D:2,s:86,c:"Sailer",v:30,x:"Ranged"},
  215: {n:"Mortar Ship",p:5,w:220,S:900,b:"50m",u:130,m:6,a:34,o:66,d:2,A:2,D:2,s:56,c:"Steamship",v:20,x:"Ranged"},
  216: {n:"Paddle Wheel Ram",i:"steamboat",p:2,w:300,S:1500,b:"40m",u:90,m:5,a:140,d:8,A:2,D:2,s:236,c:"Steamship",v:30}

} : // end v0.3.2+ section.
{ // v0.3+ section.
  201: {n:"Cargo Ship",a:0,d:0,s:4,c:"Steamship",v:60,A:0,D:0,V:500},
  210: {n:"Ram-Ship",p:6,w:88,S:56,b:"28m 16s",u:13,m:1,o:3,a:15,d:13,A:3,D:1,s:5,c:"Sailer",v:40},
  213: {n:"Ballista Ship",p:5,w:86,S:67,b:"34m 45s",u:14,m:3,o:5,a:15,d:17,A:2,D:3,s:6,c:"Sailer",v:30,x:"Resistance"},
  211: {n:"Flamethrower",p:4,w:67,S:123,b:"32m 40s",u:20,m:6,o:8,a:39,d:17,A:6,D:3,s:5,c:"Steamship",v:33,x:"Assault"},
  214: {n:"Catapult Ship",p:5,w:122,S:135,b:"42m 30s",u:24,m:8,o:10,a:26,d:38,A:4,D:6,s:6,c:"Sailer",v:26},
  215: {n:"Mortar Ship",p:10,w:165,S:367,b:"1h 2m",u:50,m:13,o:15,a:54,d:108,A:8,D:16,s:6,c:"Steamship",v:24},
  216: {n:"Paddle Wheel Ram",i:"steamboat",p:7,w:90,S:256,b:"42m 18s",u:33,m:11,o:13,a:84,d:25,A:13,D:4,s:5,c:"Steamship",v:38,x:"Assault"},
  212: {n:"Diving Boat",i:"submarine",p:6,w:255,C:457,b:"1h 23m",u:50,m:16,o:16,a:142,d:56,A:21,D:8,s:3,c:"Steamship",v:32,x:"Resistance"}
}

for (id in ships) ships[id].id = id;

function imageFromUnit(id, size) {
  var url = "/skin/characters/military/x40_y40/y40_", suffix = "_faceright.gif";
  if (id < 300) { // ships?
    var data = ships[id];
    url = "/skin/characters/fleet/40x40/ship_";
    suffix = "_r_40x40.gif";
  } else {
    data = troops[id];
  }
  if (!data) alert("missing unit data for id "+ id.toSource());
  var name = data.i || normalizeUnitName(data.n);
  //if (size == 40) // 40x40
  return url + name + suffix;
}

// islands (or the lack of them, to be precise):
var nonIslands = { 3:1,    8:1,   10:1,   12:1,   14:1,   21:3,  138:1,  191:12,
 236:7,  245:1,  251:1,  255:7,  284:1,  317:1,  402:10, 541:3,  599:1,  611:3,
 644:3,  651:1,  662:1,  689:2,  707:1,  709:1,  748:4,  797:2,  805:2,  914:5,
 923:8,  988:2, 1053:1, 1244:2, 1267:1, 1299:1, 1339:60,1519:2, 1756:1, 1830:2,
1848:1, 1850:1, 2011:1, 2024:4, 2062:6, 2268:1, 2357:1, 2449:9, 2459:1, 2463:1,
2471:10,2513:2, 2700:5, 2735:2, 2806:6, 2834:4, 2970:1, 3014:20,3040:1, 3104:6,
3163:4, 3187:1, 3240:6, 3331:1, 3408:2, 3472:1, 3529:7, 3778:2, 3781:2, 3791:2,
3808:2, 3870:1, 3994:1, 4102:4, 4146:1, 4188:2, 4205:19,4234:1, 4242:2, 4268:20,
4307:1, 4388:1, 4424:1, 4426:1, 4428:1, 4430:1, 4432:1, 4434:1, 4436:1, 4462:1,
4464:1, 4474:1, 4537:2, 4543:2, 4546:1, 4557:2, 4564:1, 4566:1, 4568:1, 4570:1,
4572:3, 4605:1, 4677:1, 4697:2, 4718:1, 4720:3, 4734:2, 4737:1, 4747:4, 4753:2,
4801:2, 4956:2, 4959:1, 4961:2, 4965:2, 5012:4, 5018:4, 5061:1, 5066:2, 5069:1,
5071:1, 5185:2, 5189:1, 5255:2, 5296:2, 5322:1, 5530:1, 5548:1, 5550:1, 5552:1,
5554:1, 5578:1, 5580:2, 5654:8, 5669:4, 5697:2, 5701:2, 5709:2, 5722:-5721 };

// Given only slingers, swordsmen, phalanxes, archers, rams, ram ships, ballista
// ships, flamethrowers, catapult ships, and a generals score of less than 2,000
// it should not be possible to have a navy with any of these generals scores:
var noShips = [0,   80,  158,  160,  238,  240,  316,  318,  320,  396,  398,
 400,  464,  474,  476,  478,  480,  544,  554,  556,  558,  560,  608,  622,
 624,  634,  636,  638,  640,  688,  702,  704,  718,  720,  766,  768,  782,
 798,  800,  862,  878,  880,  924,  958,  960];

//   ;;; Local Variables: ***
//   ;;; mode:java ***
//   ;;; c-basic-offset:2 ***
//   ;;; End: ***
