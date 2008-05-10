// JavaScript Document
// ==UserScript==
// @name           Ikariam Solarium
// @autor          Foxtrod II (Based on "Ikariam Animator" by Angelo Verona alias Anilo)
// @e-mail         loco_bcn@live.com
// @description    Effect of day and night on cities and islands.
// @include        http://*.ikariam.*/*
// @exclude        http://board.ikariam.*/*
// ==/UserScript==


// ---- Version 1.0 ---- test

var Horalocal = new Date();
var hora = Horalocal.getHours()

function Noche(css) {

if ( hora >= 21 && hora <= 24 || hora >= 0 && hora <= 5 )

    {var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);}
}


function Amanecer(css) {

if ( hora >= 6 && hora <=  9 )

    {var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);};
}


function Atardecer(css) {

if ( hora >= 18 && hora < 21 )

    {var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);};
}



// ---------- NOCHE -----------


//--------------------------------terrenos--------------------------------
Noche('#city #container .phase1 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase1.jpg);}');
Noche('#city #container .phase2, #city #container .phase3 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase2.jpg);}');
Noche('#city #container .phase4, #city #container .phase5, #city #container .phase6 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase3.jpg);});}');
Noche('#city #container .phase7, #city #container .phase8,#city #container .phase9 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase4.jpg);}');
Noche('#city #container .phase10, #city #container .phase11, #city #container .phase12 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase5.jpg);}');
Noche('#city #container .phase13, #city #container .phase14, #city #container .phase15 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase6.jpg);}');
Noche('#city #container .phase16, #city #container .phase17 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase6.jpg);}');
Noche('#city #container .phase18, #city #container .phase19 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase7.jpg);}');
Noche('#city #container .phase20 {    background-image:url(Http://usuarios.lycos.es/ikastat/Noche/city_phase8.jpg);}');

//-----------------------------------edificios--------------------------------

Noche('#city #container #mainview #locations .shipyard .buildingimg {	left:-22px; top:-20px; width:129px; height:100px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_shipyard.gif);	}'       );
Noche('#city #container #mainview #locations .museum .buildingimg {	left:-8px; top:-38px; width:105px; height:85px;  background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_museum.gif);	}');
Noche('#city #container #mainview #locations .warehouse .buildingimg {	left:0px; top:-33px; width:126px; height:86px;  background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_warehouse.gif);	}');
Noche('#city #container #mainview #locations .wall .buildingimg {	left:-500px; top:-15px; width:720px; height:137px;   background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_wall.gif);	}');
Noche('#city #container #mainview #locations .tavern .buildingimg {	left:-10px; top:-15px; width:111px; height:65px;  background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_tavern.gif);	}');
Noche('#city #container #mainview #locations .palace .buildingimg {	left:-10px; top:-42px; width:106px; height:97px;  background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_palace.gif);	}');
Noche('#city #container #mainview #locations .academy .buildingimg {	left:-19px; top:-31px; width:123px; height:90px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_academy.gif);	}');
Noche('#city #container #mainview #locations .workshop-army .buildingimg {	left:-19px; top:-31px; width:106px; height:85px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_workshop.gif);}');
Noche('#city #container #mainview #locations .safehouse .buildingimg {	left:5px; top:-15px; width:84px; height:58px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_safehouse.gif);	}');
Noche('#city #container #mainview #locations .branchOffice .buildingimg {	left:-19px; top:-31px; width:109px; height:84px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_branchOffice.gif);}');
Noche('#city #container #mainview #locations .embassy .buildingimg {	left:-5px; top:-31px; width:93px; height:85px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_embassy.gif);	}');
Noche('#city #container #mainview #locations .palaceColony .buildingimg {	left:-10px; top:-42px; width:109px; height:95px;  background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_palaceColony.gif);	}');
Noche('#city #container #mainview #locations .townHall .buildingimg {	left:-5px; top:-60px; width:104px; height:106px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_townhall.gif);	}');
Noche('#city #container #mainview #locations .barracks .buildingimg {	left:0px; top:-33px; width:100px; height:76px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_barracks.gif);	}');
Noche('#city #container #mainview #locations .port .buildingimg {	left:-65px; top:-35px; width:163px; height:131px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/building_port.gif);	}');
Noche('#city #container #mainview #locations li .constructionSite { left:-20px; top:-30px; width:114px; height:81px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/constructionSite.gif);	}');


//----- banderas ----

Noche('#city #container #mainview #locations .land .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/flag_red.gif);	}');
Noche('#city #container #mainview #locations .shore .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/flag_blue.gif);	}');
Noche('#city #container #mainview #locations .wall .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/flag_yellow.gif);	}');


Noche('#island #container #mainview #cities .buildplace .claim { display:block; position:absolute; left:26px; bottom:20px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/flag_yellow.gif); width:29px; height:40px; }');



//----------ISLAS NOCHE--------



Noche('#island #container #mainview {padding:0;height:440px;background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/bg_island.jpg);}');


//--ciudades en rojo----

Noche('#island #container #mainview #cities .level1 div.cityimg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_1_red.gif) no-repeat 13px 10px;}');
Noche('#island #container #mainview #cities .level2 div.cityimg,#island #container #mainview #cities .level3 div.cityimg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_2_red.gif) no-repeat 13px 13px;}');
Noche('#island #container #mainview #cities .level4 div.cityimg,#island #container #mainview #cities .level5 div.cityimg,#island #container #mainview #cities .level6 div.cityimg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_3_red.gif) no-repeat 13px 13px;}');
Noche('#island #container #mainview #cities .level7 div.cityimg,#island #container #mainview #cities .level8 div.cityimg,#island #container #mainview #cities .level9 div.cityimg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_4_red.gif) no-repeat 11px 13px;}');
Noche('#island #container #mainview #cities .level10 div.cityimg,#island #container #mainview #cities .level11 div.cityimg,#island #container #mainview #cities .level12 div.cityimg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_5_red.gif) no-repeat 8px 13px;}');
Noche('#island #container #mainview #cities .level13 div.cityimg,#island #container #mainview #cities .level14 div.cityimg,#island #container #mainview #cities .level15 div.cityimg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_6_red.gif) no-repeat 4px 7px;}');
Noche('#island #container #mainview #cities .level16 div.cityimg,#island #container #mainview #cities .level17 div.cityimg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_7_red.gif) no-repeat 4px 7px;}');
Noche('#island #container #mainview #cities .level18 div.cityimg,#island #container #mainview #cities .level19 div.cityimg,#island #container #mainview #cities .level20 div.cityimg,#island #container #mainview #cities .level21 div.cityimg,#island #container #mainview #cities .level22 div.cityimg,#island #container #mainview #cities .level23 div.cityimg,#island #container #mainview #cities .level24 div.cityimg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_8_red.gif) no-repeat 2px 4px;}');

//--- ciudades en azul----

Noche('#island #container #mainview #cities .level1 div.ownCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_1_blue.gif) no-repeat 13px 10px;}');
Noche('#island #container #mainview #cities .level2 div.ownCityImg,#island #container #mainview #cities .level3 div.ownCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_2_blue.gif) no-repeat 13px 13px;}');
Noche('#island #container #mainview #cities .level4 div.ownCityImg,#island #container #mainview #cities .level5 div.ownCityImg,#island #container #mainview #cities .level6 div.ownCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_3_blue.gif) no-repeat 13px 13px;}');
Noche('#island #container #mainview #cities .level7 div.ownCityImg,#island #container #mainview #cities .level8 div.ownCityImg,#island #container #mainview #cities .level9 div.ownCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_4_blue.gif) no-repeat 11px 13px;}');
Noche('#island #container #mainview #cities .level10 div.ownCityImg,#island #container #mainview #cities .level11 div.ownCityImg,#island #container #mainview #cities .level12 div.ownCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_5_blue.gif) no-repeat 8px 13px;}');
Noche('#island #container #mainview #cities .level13 div.ownCityImg,#island #container #mainview #cities .level14 div.ownCityImg,#island #container #mainview #cities .level15 div.ownCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_6_blue.gif) no-repeat 4px 7px;}');
Noche('#island #container #mainview #cities .level16 div.ownCityImg,#island #container #mainview #cities .level17 div.ownCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_7_blue.gif) no-repeat 4px 7px;}');
Noche('#island #container #mainview #cities .level18 div.ownCityImg,#island #container #mainview #cities .level19 div.ownCityImg,#island #container #mainview #cities .level20 div.ownCityImg,#island #container #mainview #cities .level21 div.ownCityImg,#island #container #mainview #cities .level22 div.ownCityImg,#island #container #mainview #cities .level23 div.ownCityImg,#island #container #mainview #cities .level24 div.ownCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_8_blue.gif) no-repeat 2px 4px;}');

//--- ciudades en verde

Noche('#island #container #mainview #cities .level1 div.allyCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_1_green.gif) no-repeat 13px 10px;}');
Noche('#island #container #mainview #cities .level2 div.allyCityImg,#island #container #mainview #cities .level3 div.allyCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_2_green.gif) no-repeat 13px 13px;}');
Noche('#island #container #mainview #cities .level4 div.allyCityImg,#island #container #mainview #cities .level5 div.allyCityImg,#island #container #mainview #cities .level6 div.allyCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_3_green.gif) no-repeat 13px 13px;}');
Noche('#island #container #mainview #cities .level7 div.allyCityImg,#island #container #mainview #cities .level8 div.allyCityImg,#island #container #mainview #cities .level9 div.allyCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_4_green.gif) no-repeat 11px 13px;}');
Noche('#island #container #mainview #cities .level10 div.allyCityImg,#island #container #mainview #cities .level11 div.allyCityImg,#island #container #mainview #cities .level12 div.allyCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_5_green.gif) no-repeat 8px 13px;}');
Noche('#island #container #mainview #cities .level13 div.allyCityImg,#island #container #mainview #cities .level14 div.allyCityImg,#island #container #mainview #cities .level15 div.allyCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_6_green.gif) no-repeat 4px 7px;}');
Noche('#island #container #mainview #cities .level16 div.allyCityImg,#island #container #mainview #cities .level17 div.allyCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_7_green.gif) no-repeat 4px 7px;}');
Noche('#island #container #mainview #cities .level18 div.allyCityImg,#island #container #mainview #cities .level19 div.allyCityImg,#island #container #mainview #cities .level20 div.allyCityImg,#island #container #mainview #cities .level21 div.allyCityImg,#island #container #mainview #cities .level22 div.allyCityImg,#island #container #mainview #cities .level23 div.allyCityImg,#island #container #mainview #cities .level24 div.allyCityImg {background:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_8_green.gif) no-repeat 2px 4px;}');

//---maravillas----

Noche('#island #container #mainview #islandfeatures .wonder1 { background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder1_large.gif); }');
Noche('#island #container #mainview #islandfeatures .wonder2 { background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder2_large.gif); }');
Noche('#island #container #mainview #islandfeatures .wonder3 { background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder3_large.gif); }');
Noche('#island #container #mainview #islandfeatures .wonder4 { background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder4_large.gif); }');
Noche('#island #container #mainview #islandfeatures .wonder5 { background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder5_large.gif); }');
Noche('#island #container #mainview #islandfeatures .wonder6 { background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder6_large.gif); }');
Noche('#island #container #mainview #islandfeatures .wonder7 { background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder7_large.gif); }');
Noche('#island #container #mainview #islandfeatures .wonder8 { background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder8_large.gif); }');

//---- recursos ----

Noche('#island #container #mainview #islandfeatures .marble a {	width:60px; height:63px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_marble.gif);	}');
Noche('#island #container #mainview #islandfeatures .wood a {	width:45px; height:41px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_wood.gif);	}');
Noche('#island #container #mainview #islandfeatures .wine a {	width:93px; height:48px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_wine.gif);	}');
Noche('#island #container #mainview #islandfeatures .crystal a {	width:56px; height:43px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_glass.gif);	}');
Noche('#island #container #mainview #islandfeatures .sulfur a {	width:78px; height:46px; background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_sulfur.gif);	}');

//--- seleccionar---

Noche('#island #container #mainview #cities .selectimg { position:absolute; top:18px; left:-7px; visibility:hidden;  background-image:url(Http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/select_city.gif); width:81px; height:55px; }');


//------ MUNDO --------


Noche('#worldmap_iso #worldmap .ocean1{	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean01.gif);}');
Noche('#worldmap_iso #worldmap .ocean2{	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean02.gif);}');
Noche('#worldmap_iso #worldmap .ocean3{	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean03.gif);}');
Noche('#worldmap_iso #worldmap .ocean_feature1{	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean_feature01.gif);}');
Noche('#worldmap_iso #worldmap .ocean_feature2{	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean_feature02.gif);}');
Noche('#worldmap_iso #worldmap .ocean_feature3{	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean_feature03.gif);}');
Noche('#worldmap_iso #worldmap .ocean_feature4{	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean_feature04.gif);}');

Noche('#worldmap_iso #worldmap .island1 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island01.gif);}');
Noche('#worldmap_iso #worldmap .island2 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island02.gif);}');
Noche('#worldmap_iso #worldmap .island3 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island03.gif);}');
Noche('#worldmap_iso #worldmap .island4 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island04.gif);}');
Noche('#worldmap_iso #worldmap .island5 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island05.gif);}');
Noche('#worldmap_iso #worldmap .island6 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island06.gif);}');
Noche('#worldmap_iso #worldmap .island7 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island07.gif);}');
Noche('#worldmap_iso #worldmap .island8 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island08.gif);}');
Noche('#worldmap_iso #worldmap .island9 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island09.gif);}');
Noche('#worldmap_iso #worldmap .island10 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island10.gif);}');

Noche('#worldmap_iso #worldmap .wonder1 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder1.gif);	width:38px;	height:53px;}');
Noche('#worldmap_iso #worldmap .wonder2 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder2.gif);	width:37px;	height:66px;}');
Noche('#worldmap_iso #worldmap .wonder3 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder3.gif);	width:37px;	height:48px;}');
Noche('#worldmap_iso #worldmap .wonder4 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder4.gif);	width:33px;	height:77px;}');
Noche('#worldmap_iso #worldmap .wonder5 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder5.gif);	width:38px;	height:49px;}');
Noche('#worldmap_iso #worldmap .wonder6 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder6.gif);	width:28px;	height:51px;}');
Noche('#worldmap_iso #worldmap .wonder7 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder7.gif);	width:37px;	height:70px;}');
Noche('#worldmap_iso #worldmap .wonder8 {	background-image:url(Http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder8.gif);	width:27px;	height:70px;}');

//---- AMANECER -----



//--------------------------------terrenos--------------------------------

Amanecer('#city #container .phase1 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase1.jpg);}');
Amanecer('#city #container .phase2, #city #container .phase3 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase2.jpg);}');
Amanecer('#city #container .phase4, #city #container .phase5, #city #container .phase6 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase3.jpg);});}');
Amanecer('#city #container .phase7, #city #container .phase8,#city #container .phase9 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase4.jpg);}');
Amanecer('#city #container .phase10, #city #container .phase11, #city #container .phase12 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase5.jpg);}');
Amanecer('#city #container .phase13, #city #container .phase14, #city #container .phase15 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase6.jpg);}');
Amanecer('#city #container .phase16, #city #container .phase17 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase6.jpg);}');
Amanecer('#city #container .phase18, #city #container .phase19 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase7.jpg);}');
Amanecer('#city #container .phase20 {    background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/city_phase8.jpg);}');

//-----------------------------------edificios--------------------------------

Amanecer('#city #container #mainview #locations .shipyard .buildingimg {	left:-22px; top:-20px; width:129px; height:100px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_shipyard.gif);	}'       );
Amanecer('#city #container #mainview #locations .museum .buildingimg {	left:-8px; top:-38px; width:105px; height:85px;  background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_museum.gif);	}');
Amanecer('#city #container #mainview #locations .warehouse .buildingimg {	left:0px; top:-33px; width:126px; height:86px;  background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_warehouse.gif);	}');
Amanecer('#city #container #mainview #locations .wall .buildingimg {	left:-500px; top:-15px; width:720px; height:137px;   background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_wall.gif);	}');
Amanecer('#city #container #mainview #locations .tavern .buildingimg {	left:-10px; top:-15px; width:111px; height:65px;  background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_tavern.gif);	}');
Amanecer('#city #container #mainview #locations .palace .buildingimg {	left:-10px; top:-42px; width:106px; height:97px;  background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_palace.gif);	}');
Amanecer('#city #container #mainview #locations .academy .buildingimg {	left:-19px; top:-31px; width:123px; height:90px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_academy.gif);	}');
Amanecer('#city #container #mainview #locations .workshop-army .buildingimg {	left:-19px; top:-31px; width:106px; height:85px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_workshop.gif);}');
Amanecer('#city #container #mainview #locations .safehouse .buildingimg {	left:5px; top:-15px; width:84px; height:58px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_safehouse.gif);	}');
Amanecer('#city #container #mainview #locations .branchOffice .buildingimg {	left:-19px; top:-31px; width:109px; height:84px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_branchOffice.gif);}');
Amanecer('#city #container #mainview #locations .embassy .buildingimg {	left:-5px; top:-31px; width:93px; height:85px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_embassy.gif);	}');
Amanecer('#city #container #mainview #locations .palaceColony .buildingimg {	left:-10px; top:-42px; width:109px; height:95px;  background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_palaceColony.gif);	}');
Amanecer('#city #container #mainview #locations .townHall .buildingimg {	left:-5px; top:-60px; width:104px; height:106px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_townhall.gif);	}');
Amanecer('#city #container #mainview #locations .barracks .buildingimg {	left:0px; top:-33px; width:100px; height:76px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_barracks.gif);	}');
Amanecer('#city #container #mainview #locations .port .buildingimg {	left:-65px; top:-35px; width:163px; height:131px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/building_port.gif);	}');
Amanecer('#city #container #mainview #locations li .constructionSite { left:-20px; top:-30px; width:114px; height:81px; background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/constructionSite.gif);	}');


//----- banderas ----

Amanecer('#city #container #mainview #locations .land .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/flag_red.gif);	}');
Amanecer('#city #container #mainview #locations .shore .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/flag_blue.gif);	}');
Amanecer('#city #container #mainview #locations .wall .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/flag_yellow.gif);	}');

Amanecer('#island #container #mainview {padding:0;height:440px;background-image:url(Http://usuarios.lycos.es/ikastat/Amanecer/bg_island.jpg);}');


//----- ATARDECER ---------



//--------------------------------terrenos--------------------------------
Atardecer('#city #container .phase1 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase1.jpg);}');
Atardecer('#city #container .phase2, #city #container .phase3 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase2.jpg);}');
Atardecer('#city #container .phase4, #city #container .phase5, #city #container .phase6 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase3.jpg);});}');
Atardecer('#city #container .phase7, #city #container .phase8,#city #container .phase9 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase4.jpg);}');
Atardecer('#city #container .phase10, #city #container .phase11, #city #container .phase12 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase5.jpg);}');
Atardecer('#city #container .phase13, #city #container .phase14, #city #container .phase15 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase6.jpg);}');
Atardecer('#city #container .phase16, #city #container .phase17 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase6.jpg);}');
Atardecer('#city #container .phase18, #city #container .phase19 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase7.jpg);}');
Atardecer('#city #container .phase20 {    background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/city_phase8.jpg);}');

//-----------------------------------edificios--------------------------------

Atardecer('#city #container #mainview #locations .shipyard .buildingimg {	left:-22px; top:-20px; width:129px; height:100px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_shipyard.gif);	}'       );
Atardecer('#city #container #mainview #locations .museum .buildingimg {	left:-8px; top:-38px; width:105px; height:85px;  background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_museum.gif);	}');
Atardecer('#city #container #mainview #locations .warehouse .buildingimg {	left:0px; top:-33px; width:126px; height:86px;  background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_warehouse.gif);	}');
Atardecer('#city #container #mainview #locations .wall .buildingimg {	left:-500px; top:-15px; width:720px; height:137px;   background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_wall.gif);	}');
Atardecer('#city #container #mainview #locations .tavern .buildingimg {	left:-10px; top:-15px; width:111px; height:65px;  background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_tavern.gif);	}');
Atardecer('#city #container #mainview #locations .palace .buildingimg {	left:-10px; top:-42px; width:106px; height:97px;  background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_palace.gif);	}');
Atardecer('#city #container #mainview #locations .academy .buildingimg {	left:-19px; top:-31px; width:123px; height:90px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_academy.gif);	}');
Atardecer('#city #container #mainview #locations .workshop-army .buildingimg {	left:-19px; top:-31px; width:106px; height:85px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_workshop.gif);}');
Atardecer('#city #container #mainview #locations .safehouse .buildingimg {	left:5px; top:-15px; width:84px; height:58px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_safehouse.gif);	}');
Atardecer('#city #container #mainview #locations .branchOffice .buildingimg {	left:-19px; top:-31px; width:109px; height:84px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_branchOffice.gif);}');
Atardecer('#city #container #mainview #locations .embassy .buildingimg {	left:-5px; top:-31px; width:93px; height:85px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_embassy.gif);	}');
Atardecer('#city #container #mainview #locations .palaceColony .buildingimg {	left:-10px; top:-42px; width:109px; height:95px;  background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_palaceColony.gif);	}');
Atardecer('#city #container #mainview #locations .townHall .buildingimg {	left:-5px; top:-60px; width:104px; height:106px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_townhall.gif);	}');
Atardecer('#city #container #mainview #locations .barracks .buildingimg {	left:0px; top:-33px; width:100px; height:76px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_barracks.gif);	}');
Atardecer('#city #container #mainview #locations .port .buildingimg {	left:-65px; top:-35px; width:163px; height:131px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/building_port.gif);	}');
Atardecer('#city #container #mainview #locations li .constructionSite { left:-20px; top:-30px; width:114px; height:81px; background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/constructionSite.gif);	}');


//----- banderas ----

Atardecer('#city #container #mainview #locations .land .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/flag_red.gif);	}');
Atardecer('#city #container #mainview #locations .shore .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/flag_blue.gif);	}');
Atardecer('#city #container #mainview #locations .wall .flag {	background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/flag_yellow.gif);	}');

Atardecer('#island #container #mainview {padding:0;height:440px;background-image:url(Http://usuarios.lycos.es/ikastat/Atardecer/bg_island.jpg);}');





