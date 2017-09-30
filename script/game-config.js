//Global variables that set the game's settings.

//whether sound are enabled.
//TODO maybe these changeable settings can be moved to another file?
var SOUND_ENABLED = true;
//Switch for random map size
var RANDOM_MAP_SIZE = false;
//Maximum size for random map generation
var RANDOM_MAP_SIZE_MAX = 20;
//Minimum size for random map generation
var RANDOM_MAP_SIZE_MIN = 10;
//size of the game map (number of grids each side)
var DEFAULT_MAP_SIZE = 14;
//size of a grid in px.
var DEFAULT_GRID_SIZE = 32;
//maximum number of ship allowed
/**
 * Standard mode settings
 */
var MAX_SHIP_COUNT_STANDARD = 6;
//maximum  number of battleships allowed.
var MAX_BB_COUNT_STANDARD = 4;
//maximum number of aircraft carriers allowed.
var MAX_CV_COUNT_STANDARD = 3;
//maximum number of cruisers allowed.
var MAX_CA_COUNT_STANDARD = 6;
//maximum number of destroyers allowed.
var MAX_DD_COUNT_STANDARD = 6;
/**
 * Classic mode setting
 */
var MAX_SHIP_COUNT_CLASSIC = 10;
//maximum  number of battleships allowed.
var MAX_BB_COUNT_CLASSIC = 1;
//maximum number of aircraft carriers allowed.
var MAX_CV_COUNT_CLASSIC = 2;
//maximum number of cruisers allowed.
var MAX_CA_COUNT_CLASSIC = 3;
//maximum number of destroyers allowed.
var MAX_DD_COUNT_CLASSIC = 4;
/**
 * Intercept, breakthrough and convoy mode setting
 */
//maximum number of turns allowed in intercept mode
var MAX_TURN_INTERCEPT_DEFAULT = 16;
//maximum number of turns allowed in intercept mode, minimum of random value.
var MAX_TURN_INTERCEPT_MIN = 12;
//maximum number of turns allowed in intercept mode, maximum of random value.
var MAX_TURN_INTERCEPT_MAX = 22;
//whether random time length in intercept_mode is active.
var RANDOM_TIME_INTERCEPT_BREAKTHROUGH = true;
//whether specific classes will be designated as target in intercept mode
var SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH = true;
//Transport ship count in convoy mode
var AP_COUNT_CONVOY = 3;


//Whether the fog of war is active(you can see the enemy ship)
var FOG_OF_WAR = true;

//type of ai used
var ai_config = AI_CONFIGURATION_INTERMEDIATE;

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
