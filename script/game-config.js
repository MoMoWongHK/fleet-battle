//Global variables that set the game's settings.

//whether sound are enabled.
//TODO maybe these changable settings can be moved to another file?
var SOUND_ENABLED = false;
//Switch for random map size
var RANDOM_MAP_SIZE = false;
//size of the game map (number of grids each side)
var MAP_SIZE = 14;
//size of a grid in px.
var GRID_SIZE = 32;
//maximium number of ship allowed
var MAX_SHIP_COUNT_STANDARD = 6;
//maximium  number of battleships allowed.
var MAX_BB_COUNT_STANDARD = 4;
//maximium number of aircraft carrriers allowed.
var MAX_CV_COUNT_STANDARD = 3;
//maximium number of crusiers allowed.
var MAX_CA_COUNT_STANDARD = 6;
//maximium number of destroyers allowed.
var MAX_DD_COUNT_STANDARD = 6;

//Whether the fog of war is active(you can see the enemy ship)
var FOG_OF_WAR = true;

//type of ai used
var AI_CONFIG = AI_CONFIGURATION_INTERMEDIATE;

//attack count for bb, under different situation
var BB_ATTACK_COUNT = [
	2,//parallel
	1,//head on
 	2,//t-adv
	1//t-dis
];
var CA_ATTACK_COUNT = [
	1,//parallel
	1,//head on
 	1,//t-adv
	0//t-dis
];
var DD_ATTACK_COUNT = [
	1,//parallel
	1,//head on
 	1,//t-adv
	0//t-dis
];
var CV_ATTACK_COUNT = [
	1,//parallel
	1,//head on
 	1,//t-adv
	1//t-dis
];
