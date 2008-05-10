// ==UserScript==
// @name           Ikariam Solarium
// @namespace      http://userscripts.org/scripts/show/25984
// @autor          Foxtrod II (Based on "Ikariam Animator" by Angelo Verona alias Anilo)
// @e-mail         loco_bcn@live.com
// @description    Effect of day and night on cities and islands.
// @include        http://s*.ikariam.tld/*
// @exclude        http://board.ikariam.*
// ==/UserScript==

// ---- Version 1.1 ----

var mood = "";

switch ((new Date).getHours()) {
  case 18: case 19: case 20:
    mood = "Atardecer"; break;

  case 21: case 22: case 23:
  case 00: case 01: case 02:
  case 03: case 04: case 05:
    mood = "Noche"; break;

  case 6: case 7: case 8: case 9:
    mood = "Amanecer"; break;
}

if (mood) {
  document.body.className = (document.body.className||"") +" "+ mood;
  GM_addStyle(<><![CDATA[

/*---------- NOCHE -----------*/


/*--------------------------------terrenos--------------------------------*/

#city.Noche #container .phase1 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase1.jpg);}
#city.Noche #container .phase2,
#city.Noche #container .phase3 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase2.jpg);}
#city.Noche #container .phase4,
#city.Noche #container .phase5,
#city.Noche #container .phase6 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase3.jpg);});}
#city.Noche #container .phase7,
#city.Noche #container .phase8,
#city.Noche #container .phase9 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase4.jpg);}
#city.Noche #container .phase10,
#city.Noche #container .phase11,
#city.Noche #container .phase12 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase5.jpg);}
#city.Noche #container .phase13,
#city.Noche #container .phase14,
#city.Noche #container .phase15 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase6.jpg);}
#city.Noche #container .phase16,
#city.Noche #container .phase17 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase6.jpg);}
#city.Noche #container .phase18,
#city.Noche #container .phase19 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase7.jpg);}
#city.Noche #container .phase20 {    background-image:url(http://usuarios.lycos.es/ikastat/Noche/city_phase8.jpg);}

/*-----------------------------------edificios--------------------------------*/

#city.Noche #container #mainview #locations .shipyard .buildingimg {	left:-22px; top:-20px; width:129px; height:100px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_shipyard.gif);	}
#city.Noche #container #mainview #locations .museum .buildingimg {	left:-8px; top:-38px; width:105px; height:85px;  background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_museum.gif);	}
#city.Noche #container #mainview #locations .warehouse .buildingimg {	left:0px; top:-33px; width:126px; height:86px;  background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_warehouse.gif);	}
#city.Noche #container #mainview #locations .wall .buildingimg {	left:-500px; top:-15px; width:720px; height:137px;   background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_wall.gif);	}
#city.Noche #container #mainview #locations .tavern .buildingimg {	left:-10px; top:-15px; width:111px; height:65px;  background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_tavern.gif);	}
#city.Noche #container #mainview #locations .palace .buildingimg {	left:-10px; top:-42px; width:106px; height:97px;  background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_palace.gif);	}
#city.Noche #container #mainview #locations .academy .buildingimg {	left:-19px; top:-31px; width:123px; height:90px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_academy.gif);	}
#city.Noche #container #mainview #locations .workshop-army .buildingimg {	left:-19px; top:-31px; width:106px; height:85px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_workshop.gif);}
#city.Noche #container #mainview #locations .safehouse .buildingimg {	left:5px; top:-15px; width:84px; height:58px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_safehouse.gif);	}
#city.Noche #container #mainview #locations .branchOffice .buildingimg {	left:-19px; top:-31px; width:109px; height:84px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_branchOffice.gif);}
#city.Noche #container #mainview #locations .embassy .buildingimg {	left:-5px; top:-31px; width:93px; height:85px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_embassy.gif);	}
#city.Noche #container #mainview #locations .palaceColony .buildingimg {	left:-10px; top:-42px; width:109px; height:95px;  background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_palaceColony.gif);	}
#city.Noche #container #mainview #locations .townHall .buildingimg {	left:-5px; top:-60px; width:104px; height:106px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_townhall.gif);	}
#city.Noche #container #mainview #locations .barracks .buildingimg {	left:0px; top:-33px; width:100px; height:76px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_barracks.gif);	}
#city.Noche #container #mainview #locations .port .buildingimg {	left:-65px; top:-35px; width:163px; height:131px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/building_port.gif);	}
#city.Noche #container #mainview #locations li .constructionSite { left:-20px; top:-30px; width:114px; height:81px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/constructionSite.gif);	}


/*----- banderas ----*/

#city.Noche #container #mainview #locations .land .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/flag_red.gif);	}
#city.Noche #container #mainview #locations .shore .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/flag_blue.gif);	}
#city.Noche #container #mainview #locations .wall .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/flag_yellow.gif);	}


#island.Noche #container #mainview #cities .buildplace .claim { display:block; position:absolute; left:26px; bottom:20px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/flag_yellow.gif); width:29px; height:40px; }



/*----------ISLAS NOCHE--------*/



#island.Noche #container #mainview {padding:0;height:440px;background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/bg_island.jpg);}


/*--ciudades en rojo----*/

#island.Noche #container #mainview #cities .level1 div.cityimg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_1_red.gif) no-repeat 13px 10px;}
#island.Noche #container #mainview #cities .level2 div.cityimg,
#island.Noche #container #mainview #cities .level3 div.cityimg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_2_red.gif) no-repeat 13px 13px;}
#island.Noche #container #mainview #cities .level4 div.cityimg,
#island.Noche #container #mainview #cities .level5 div.cityimg,
#island.Noche #container #mainview #cities .level6 div.cityimg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_3_red.gif) no-repeat 13px 13px;}
#island.Noche #container #mainview #cities .level7 div.cityimg,
#island.Noche #container #mainview #cities .level8 div.cityimg,
#island.Noche #container #mainview #cities .level9 div.cityimg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_4_red.gif) no-repeat 11px 13px;}
#island.Noche #container #mainview #cities .level10 div.cityimg,
#island.Noche #container #mainview #cities .level11 div.cityimg,
#island.Noche #container #mainview #cities .level12 div.cityimg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_5_red.gif) no-repeat 8px 13px;}
#island.Noche #container #mainview #cities .level13 div.cityimg,
#island.Noche #container #mainview #cities .level14 div.cityimg,
#island.Noche #container #mainview #cities .level15 div.cityimg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_6_red.gif) no-repeat 4px 7px;}
#island.Noche #container #mainview #cities .level16 div.cityimg,
#island.Noche #container #mainview #cities .level17 div.cityimg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_7_red.gif) no-repeat 4px 7px;}
#island.Noche #container #mainview #cities .level18 div.cityimg,
#island.Noche #container #mainview #cities .level19 div.cityimg,
#island.Noche #container #mainview #cities .level20 div.cityimg,
#island.Noche #container #mainview #cities .level21 div.cityimg,
#island.Noche #container #mainview #cities .level22 div.cityimg,
#island.Noche #container #mainview #cities .level23 div.cityimg,
#island.Noche #container #mainview #cities .level24 div.cityimg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_8_red.gif) no-repeat 2px 4px;}

/*--- ciudades en azul----*/

#island.Noche #container #mainview #cities .level1 div.ownCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_1_blue.gif) no-repeat 13px 10px;}
#island.Noche #container #mainview #cities .level2 div.ownCityImg,
#island.Noche #container #mainview #cities .level3 div.ownCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_2_blue.gif) no-repeat 13px 13px;}
#island.Noche #container #mainview #cities .level4 div.ownCityImg,
#island.Noche #container #mainview #cities .level5 div.ownCityImg,
#island.Noche #container #mainview #cities .level6 div.ownCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_3_blue.gif) no-repeat 13px 13px;}
#island.Noche #container #mainview #cities .level7 div.ownCityImg,
#island.Noche #container #mainview #cities .level8 div.ownCityImg,
#island.Noche #container #mainview #cities .level9 div.ownCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_4_blue.gif) no-repeat 11px 13px;}
#island.Noche #container #mainview #cities .level10 div.ownCityImg,
#island.Noche #container #mainview #cities .level11 div.ownCityImg,
#island.Noche #container #mainview #cities .level12 div.ownCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_5_blue.gif) no-repeat 8px 13px;}
#island.Noche #container #mainview #cities .level13 div.ownCityImg,
#island.Noche #container #mainview #cities .level14 div.ownCityImg,
#island.Noche #container #mainview #cities .level15 div.ownCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_6_blue.gif) no-repeat 4px 7px;}
#island.Noche #container #mainview #cities .level16 div.ownCityImg,
#island.Noche #container #mainview #cities .level17 div.ownCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_7_blue.gif) no-repeat 4px 7px;}
#island.Noche #container #mainview #cities .level18 div.ownCityImg,
#island.Noche #container #mainview #cities .level19 div.ownCityImg,
#island.Noche #container #mainview #cities .level20 div.ownCityImg,
#island.Noche #container #mainview #cities .level21 div.ownCityImg,
#island.Noche #container #mainview #cities .level22 div.ownCityImg,
#island.Noche #container #mainview #cities .level23 div.ownCityImg,
#island.Noche #container #mainview #cities .level24 div.ownCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_8_blue.gif) no-repeat 2px 4px;}

/*--- ciudades en verde*/

#island.Noche #container #mainview #cities .level1 div.allyCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_1_green.gif) no-repeat 13px 10px;}
#island.Noche #container #mainview #cities .level2 div.allyCityImg,
#island.Noche #container #mainview #cities .level3 div.allyCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_2_green.gif) no-repeat 13px 13px;}
#island.Noche #container #mainview #cities .level4 div.allyCityImg,
#island.Noche #container #mainview #cities .level5 div.allyCityImg,
#island.Noche #container #mainview #cities .level6 div.allyCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_3_green.gif) no-repeat 13px 13px;}
#island.Noche #container #mainview #cities .level7 div.allyCityImg,
#island.Noche #container #mainview #cities .level8 div.allyCityImg,
#island.Noche #container #mainview #cities .level9 div.allyCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_4_green.gif) no-repeat 11px 13px;}
#island.Noche #container #mainview #cities .level10 div.allyCityImg,
#island.Noche #container #mainview #cities .level11 div.allyCityImg,
#island.Noche #container #mainview #cities .level12 div.allyCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_5_green.gif) no-repeat 8px 13px;}
#island.Noche #container #mainview #cities .level13 div.allyCityImg,
#island.Noche #container #mainview #cities .level14 div.allyCityImg,
#island.Noche #container #mainview #cities .level15 div.allyCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_6_green.gif) no-repeat 4px 7px;}
#island.Noche #container #mainview #cities .level16 div.allyCityImg,
#island.Noche #container #mainview #cities .level17 div.allyCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_7_green.gif) no-repeat 4px 7px;}
#island.Noche #container #mainview #cities .level18 div.allyCityImg,
#island.Noche #container #mainview #cities .level19 div.allyCityImg,
#island.Noche #container #mainview #cities .level20 div.allyCityImg,
#island.Noche #container #mainview #cities .level21 div.allyCityImg,
#island.Noche #container #mainview #cities .level22 div.allyCityImg,
#island.Noche #container #mainview #cities .level23 div.allyCityImg,
#island.Noche #container #mainview #cities .level24 div.allyCityImg {background:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/ciudades_noche/city_8_green.gif) no-repeat 2px 4px;}

/*---maravillas----*/

#island.Noche #container #mainview #islandfeatures .wonder1 { background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder1_large.gif); }
#island.Noche #container #mainview #islandfeatures .wonder2 { background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder2_large.gif); }
#island.Noche #container #mainview #islandfeatures .wonder3 { background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder3_large.gif); }
#island.Noche #container #mainview #islandfeatures .wonder4 { background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder4_large.gif); }
#island.Noche #container #mainview #islandfeatures .wonder5 { background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder5_large.gif); }
#island.Noche #container #mainview #islandfeatures .wonder6 { background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder6_large.gif); }
#island.Noche #container #mainview #islandfeatures .wonder7 { background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder7_large.gif); }
#island.Noche #container #mainview #islandfeatures .wonder8 { background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/maravillas_noche/wonder8_large.gif); }

/*---- recursos ----*/

#island.Noche #container #mainview #islandfeatures .marble a {	width:60px; height:63px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_marble.gif);	}
#island.Noche #container #mainview #islandfeatures .wood a {	width:45px; height:41px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_wood.gif);	}
#island.Noche #container #mainview #islandfeatures .wine a {	width:93px; height:48px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_wine.gif);	}
#island.Noche #container #mainview #islandfeatures .crystal a {	width:56px; height:43px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_glass.gif);	}
#island.Noche #container #mainview #islandfeatures .sulfur a {	width:78px; height:46px; background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/recursos_noche/resource_sulfur.gif);	}

/*--- seleccionar---*/

#island.Noche #container #mainview #cities .selectimg { position:absolute; top:18px; left:-7px; visibility:hidden;  background-image:url(http://usuarios.lycos.es/ikastat/Noche/Isla_Noche/select_city.gif); width:81px; height:55px; }


/*------ MUNDO --------*/


#worldmap_iso.Noche #worldmap .ocean1{	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean01.gif);}
#worldmap_iso.Noche #worldmap .ocean2{	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean02.gif);}
#worldmap_iso.Noche #worldmap .ocean3{	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean03.gif);}
#worldmap_iso.Noche #worldmap .ocean_feature1{	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean_feature01.gif);}
#worldmap_iso.Noche #worldmap .ocean_feature2{	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean_feature02.gif);}
#worldmap_iso.Noche #worldmap .ocean_feature3{	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean_feature03.gif);}
#worldmap_iso.Noche #worldmap .ocean_feature4{	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_ocean_feature04.gif);}

#worldmap_iso.Noche #worldmap .island1 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island01.gif);}
#worldmap_iso.Noche #worldmap .island2 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island02.gif);}
#worldmap_iso.Noche #worldmap .island3 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island03.gif);}
#worldmap_iso.Noche #worldmap .island4 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island04.gif);}
#worldmap_iso.Noche #worldmap .island5 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island05.gif);}
#worldmap_iso.Noche #worldmap .island6 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island06.gif);}
#worldmap_iso.Noche #worldmap .island7 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island07.gif);}
#worldmap_iso.Noche #worldmap .island8 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island08.gif);}
#worldmap_iso.Noche #worldmap .island9 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island09.gif);}
#worldmap_iso.Noche #worldmap .island10 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/tile_island10.gif);}

#worldmap_iso.Noche #worldmap .wonder1 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder1.gif);	width:38px;	height:53px;}
#worldmap_iso.Noche #worldmap .wonder2 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder2.gif);	width:37px;	height:66px;}
#worldmap_iso.Noche #worldmap .wonder3 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder3.gif);	width:37px;	height:48px;}
#worldmap_iso.Noche #worldmap .wonder4 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder4.gif);	width:33px;	height:77px;}
#worldmap_iso.Noche #worldmap .wonder5 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder5.gif);	width:38px;	height:49px;}
#worldmap_iso.Noche #worldmap .wonder6 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder6.gif);	width:28px;	height:51px;}
#worldmap_iso.Noche #worldmap .wonder7 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder7.gif);	width:37px;	height:70px;}
#worldmap_iso.Noche #worldmap .wonder8 {	background-image:url(http://usuarios.lycos.es/ikastat/Noche/mundo_noche/wonder8.gif);	width:27px;	height:70px;}
                                                                     }


/*---- AMANECER -----*/



/*--------------------------------terrenos--------------------------------*/

#city.Amanecer #container .phase1 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase1.jpg);}
#city.Amanecer #container .phase2,
#city.Amanecer #container .phase3 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase2.jpg);}
#city.Amanecer #container .phase4,
#city.Amanecer #container .phase5,
#city.Amanecer #container .phase6 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase3.jpg);});}
#city.Amanecer #container .phase7,
#city.Amanecer #container .phase8,
#city.Amanecer #container .phase9 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase4.jpg);}
#city.Amanecer #container .phase10,
#city.Amanecer #container .phase11,
#city.Amanecer #container .phase12 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase5.jpg);}
#city.Amanecer #container .phase13,
#city.Amanecer #container .phase14,
#city.Amanecer #container .phase15 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase6.jpg);}
#city.Amanecer #container .phase16,
#city.Amanecer #container .phase17 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase6.jpg);}
#city.Amanecer #container .phase18,
#city.Amanecer #container .phase19 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase7.jpg);}
#city.Amanecer #container .phase20 {    background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/city_phase8.jpg);}

/*-----------------------------------edificios--------------------------------*/

#city.Amanecer #container #mainview #locations .shipyard .buildingimg {	left:-22px; top:-20px; width:129px; height:100px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_shipyard.gif);	}
#city.Amanecer #container #mainview #locations .museum .buildingimg {	left:-8px; top:-38px; width:105px; height:85px;  background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_museum.gif);	}
#city.Amanecer #container #mainview #locations .warehouse .buildingimg {	left:0px; top:-33px; width:126px; height:86px;  background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_warehouse.gif);	}
#city.Amanecer #container #mainview #locations .wall .buildingimg {	left:-500px; top:-15px; width:720px; height:137px;   background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_wall.gif);	}
#city.Amanecer #container #mainview #locations .tavern .buildingimg {	left:-10px; top:-15px; width:111px; height:65px;  background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_tavern.gif);	}
#city.Amanecer #container #mainview #locations .palace .buildingimg {	left:-10px; top:-42px; width:106px; height:97px;  background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_palace.gif);	}
#city.Amanecer #container #mainview #locations .academy .buildingimg {	left:-19px; top:-31px; width:123px; height:90px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_academy.gif);	}
#city.Amanecer #container #mainview #locations .workshop-army .buildingimg {	left:-19px; top:-31px; width:106px; height:85px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_workshop.gif);}
#city.Amanecer #container #mainview #locations .safehouse .buildingimg {	left:5px; top:-15px; width:84px; height:58px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_safehouse.gif);	}
#city.Amanecer #container #mainview #locations .branchOffice .buildingimg {	left:-19px; top:-31px; width:109px; height:84px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_branchOffice.gif);}
#city.Amanecer #container #mainview #locations .embassy .buildingimg {	left:-5px; top:-31px; width:93px; height:85px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_embassy.gif);	}
#city.Amanecer #container #mainview #locations .palaceColony .buildingimg {	left:-10px; top:-42px; width:109px; height:95px;  background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_palaceColony.gif);	}
#city.Amanecer #container #mainview #locations .townHall .buildingimg {	left:-5px; top:-60px; width:104px; height:106px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_townhall.gif);	}
#city.Amanecer #container #mainview #locations .barracks .buildingimg {	left:0px; top:-33px; width:100px; height:76px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_barracks.gif);	}
#city.Amanecer #container #mainview #locations .port .buildingimg {	left:-65px; top:-35px; width:163px; height:131px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/building_port.gif);	}
#city.Amanecer #container #mainview #locations li .constructionSite { left:-20px; top:-30px; width:114px; height:81px; background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/constructionSite.gif);	}


/*----- banderas ----*/

#city.Amanecer #container #mainview #locations .land .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/flag_red.gif);	}
#city.Amanecer #container #mainview #locations .shore .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/flag_blue.gif);	}
#city.Amanecer #container #mainview #locations .wall .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/flag_yellow.gif);	}

#island.Amanecer #container #mainview {padding:0;height:440px;background-image:url(http://usuarios.lycos.es/ikastat/Amanecer/bg_island.jpg);}


/*----- ATARDECER ---------*/



/*--------------------------------terrenos--------------------------------*/
#city.Atardecer #container .phase1 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase1.jpg);}
#city.Atardecer #container .phase2,
#city.Atardecer #container .phase3 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase2.jpg);}
#city.Atardecer #container .phase4,
#city.Atardecer #container .phase5,
#city.Atardecer #container .phase6 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase3.jpg);});}
#city.Atardecer #container .phase7,
#city.Atardecer #container .phase8,
#city.Atardecer #container .phase9 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase4.jpg);}
#city.Atardecer #container .phase10,
#city.Atardecer #container .phase11,
#city.Atardecer #container .phase12 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase5.jpg);}
#city.Atardecer #container .phase13,
#city.Atardecer #container .phase14,
#city.Atardecer #container .phase15 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase6.jpg);}
#city.Atardecer #container .phase16,
#city.Atardecer #container .phase17 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase6.jpg);}
#city.Atardecer #container .phase18,
#city.Atardecer #container .phase19 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase7.jpg);}
#city.Atardecer #container .phase20 {    background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/city_phase8.jpg);}

/*-----------------------------------edificios--------------------------------*/

#city.Atardecer #container #mainview #locations .shipyard .buildingimg {	left:-22px; top:-20px; width:129px; height:100px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_shipyard.gif);	}
#city.Atardecer #container #mainview #locations .museum .buildingimg {	left:-8px; top:-38px; width:105px; height:85px;  background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_museum.gif);	}
#city.Atardecer #container #mainview #locations .warehouse .buildingimg {	left:0px; top:-33px; width:126px; height:86px;  background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_warehouse.gif);	}
#city.Atardecer #container #mainview #locations .wall .buildingimg {	left:-500px; top:-15px; width:720px; height:137px;   background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_wall.gif);	}
#city.Atardecer #container #mainview #locations .tavern .buildingimg {	left:-10px; top:-15px; width:111px; height:65px;  background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_tavern.gif);	}
#city.Atardecer #container #mainview #locations .palace .buildingimg {	left:-10px; top:-42px; width:106px; height:97px;  background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_palace.gif);	}
#city.Atardecer #container #mainview #locations .academy .buildingimg {	left:-19px; top:-31px; width:123px; height:90px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_academy.gif);	}
#city.Atardecer #container #mainview #locations .workshop-army .buildingimg {	left:-19px; top:-31px; width:106px; height:85px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_workshop.gif);}
#city.Atardecer #container #mainview #locations .safehouse .buildingimg {	left:5px; top:-15px; width:84px; height:58px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_safehouse.gif);	}
#city.Atardecer #container #mainview #locations .branchOffice .buildingimg {	left:-19px; top:-31px; width:109px; height:84px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_branchOffice.gif);}
#city.Atardecer #container #mainview #locations .embassy .buildingimg {	left:-5px; top:-31px; width:93px; height:85px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_embassy.gif);	}
#city.Atardecer #container #mainview #locations .palaceColony .buildingimg {	left:-10px; top:-42px; width:109px; height:95px;  background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_palaceColony.gif);	}
#city.Atardecer #container #mainview #locations .townHall .buildingimg {	left:-5px; top:-60px; width:104px; height:106px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_townhall.gif);	}
#city.Atardecer #container #mainview #locations .barracks .buildingimg {	left:0px; top:-33px; width:100px; height:76px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_barracks.gif);	}
#city.Atardecer #container #mainview #locations .port .buildingimg {	left:-65px; top:-35px; width:163px; height:131px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/building_port.gif);	}
#city.Atardecer #container #mainview #locations li .constructionSite { left:-20px; top:-30px; width:114px; height:81px; background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/constructionSite.gif);	}


/*----- banderas ----*/

#city.Atardecer #container #mainview #locations .land .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/flag_red.gif);	}
#city.Atardecer #container #mainview #locations .shore .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/flag_blue.gif);	}
#city.Atardecer #container #mainview #locations .wall .flag {	background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/flag_yellow.gif);	}

#island.Atardecer #container #mainview {padding:0;height:440px;background-image:url(http://usuarios.lycos.es/ikastat/Atardecer/bg_island.jpg);}

  ]]></>.toXMLString());
}
