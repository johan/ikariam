// ==UserScript==
// @name           Kissy wider menu
// @namespace      corentin.jarnoux.free.fr
// @description    Wider menu for Ikariam using Kronos Utils
// @include        http://*.ikariam.*/*
// @exclude        http://board.ikariam.*/*
// ==/UserScript==

GM_addStyle(<><![CDATA[

#cityNav select#citySelect { display: none; }

#header {background: #F3DCB6 url(http://corentin.jarnoux.free.fr/kronosutils/Scripts/kissy_wider_menu/bg_header.jpg) no-repeat scroll 0%;}
#header {background: #F3DCB6 url(http://corentin.jarnoux.free.fr/kronosutils/Scripts/kissy_wider_menu/bg_header_invert.jpg) no-repeat scroll 0%;}

#advisors #advCities {left:668px;}

#advisors #advMilitary {left:758px;}

#advisors #advResearch {left:848px;}

#globalResources {left: -13px;}

#advisors #advDiplomacy {left:938px;}

#cityNav .viewCity {left: 401px;}

#cityNav .viewIsland {left: 302px;}

#cityNav .viewWorldmap {left: 200px;}

#cityNav .citySelect {left: -44px;}
#cityNav .citySelect {left: 10px;}

#cityNav .viewCity a {width: 94px; background-image:url(http://corentin.jarnoux.free.fr/kronosutils/Scripts/kissy_wider_menu/btn_city.jpg);}

#cityNav .viewIsland a {width: 94px; background-image:url(http://corentin.jarnoux.free.fr/kronosutils/Scripts/kissy_wider_menu/btn_island.jpg);}

#cityNav .viewWorldmap a {width: 94px; background-image:url(http://corentin.jarnoux.free.fr/kronosutils/Scripts/kissy_wider_menu/btn_world.jpg);}

#container #cityResources .wood {left: -45px;}

#container #cityResources .wine {left: 62px;}

#container #cityResources .marble {left: 167px;}

#container #cityResources .glass {left: 278px;}

#container #cityResources .sulfur {left: 387px;}

#container #cityResources .population {left: 53px;}

#container #container2 #cityResources .underline {
  width: 75px;
}

/*#container #cityResources li#action-points {
  top: -54px;
  left: 144px;
}*/
#container #cityResources li#action-points {
  top: -53px;
  left: -38px;
}

#container #cityResources li {
  top: 4px;
}

#changeCityForm .viewIsland #islandLinks {
  left: 47px;
}

#income {
  background: transparent url(/skin/layout/bg_header.jpg) scroll -383px -66px;
  position: absolute;
  text-align: right;
  width: 54px;
  left: -34px;
  top: 38px;
}

/* abuses the corruption coin for negative incomes -- have a better one? */
#coin { position: absolute; width: 0px; }
#coin.positive { left: 24px; top: 34px; }
#coin.negative { left: 22px; top: 32px; }

#cityNav #overview {
  z-index: 1;
  display: none;
  cursor: default;
  position: absolute;
  width: 157px;
  left:133px;/*left: 189px; without wider menu*/
  top: 6px;
}
#cityNav #overview {
  left: 187px;
}

]]></>.toXMLString());