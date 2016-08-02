/**
 * File for codes that are reaposible for the ai opponent.
 */
//list of ai
/**
 * basic ai (in progress)
 */
var AI_CONFIGURATION_BASIC = 0;
/**
 * a better ai (not yet exsist)
 */
var AI_CONFIGURATION_INTERMEDIATE = 1;
/**
 * an even better ai (not yet exsist)
 */
var AI_CONFIGURATION_ADVANCED = 2;
/**
 * "You fool. Don't ever think that you are safe just because you hide in the Fog of War... For I can always see through it."
 * (this is basically cheat!)
 */
var AI_CONFIGURATION_ALL_SEEING = 3;
//variables for data in ai



/**
 * Codes for computer ship placing
 */
function shipPlacementMain() {
	//TODO switch for different method of ai
	switch (AI_CONFIG) {
		case AI_CONFIGURATION_BASIC:
			shipPlacementBasic();
			break;
		case AI_CONFIGURATION_INTERMEDIATE:
			alert(string.game_config_error);
			break;
		case AI_CONFIGURATION_ADVANCED:
			alert(string.game_config_error);
			break;
		case AI_CONFIGURATION_ALL_SEEING:
			alert(string.game_config_error);
			break;
		default:
			alert(string.game_config_error);

	}

}

var ship_size

function shipPlacableAi(x, y, type, course) {
	if (type == SHIP_CLASS_BB) {
		if (player_2_BB_count >= MAX_BB_COUNT) {
			//stop the meaningless struggle
			return false;
		}
	}
	if (type == SHIP_CLASS_CV) {
		if (player_2_CV_count >= MAX_CV_COUNT) {
			//stop the meaningless struggle
			return false;
		}
	}
	if (type == SHIP_CLASS_CA) {
		if (player_2_CA_count >= MAX_CA_COUNT) {
			//stop the meaningless struggle
			return false;
		}
	}
	if (type == SHIP_CLASS_DD) {
		if (player_2_DD_count >= MAX_DD_COUNT) {
			//stop the meaningless struggle
			return false;
		}
	}
	switch (type) {
		case SHIP_CLASS_BB:
		case SHIP_CLASS_CV:
			ship_size = 4;
			break;
		case SHIP_CLASS_CA:
			ship_size = 3;
			break;
		case SHIP_CLASS_DD:
			ship_size = 2;
			break;
	}
	if (course == SHIP_COURSE_VERTICAL) {
		//check if over edge of map
		if ((x + ship_size) < MAP_SIZE && y < MAP_SIZE) {
			//check if another ship already exsist
			for (var i = 0; i < ship_size; i++) {
				if (document.getElementById("monitorRight").querySelector("[x='" + (x + i) + "'][y='" + y + "']").hasAttribute("placed")) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	} else if (course == SHIP_COURSE_HORIZONTAL) {
		if ((y + ship_size) < MAP_SIZE && x < MAP_SIZE) {
			for (var i = 0; i < ship_size; i++) {
				if (document.getElementById("monitorRight").querySelector("[y='" + (y + i) + "'][x='" + x + "']").hasAttribute("placed")) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

}


function shipPlacementBasic() {
	var x = RNG(0, MAP_SIZE);
	var y = RNG(0, MAP_SIZE);
	var course = RNG(SHIP_COURSE_VERTICAL, SHIP_COURSE_HORIZONTAL);
	var type = RNG(SHIP_CLASS_BB, SHIP_CLASS_DD);
	if (shipPlacableAi(x, y, type, course)) {
		//place the ship
		if (course == SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size; i++) {
				var tGrid = document.getElementById("monitorRight").querySelector("[x='" + (x + i) + "'][y='" + y + "']");
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", type);
				tGrid.setAttribute("head-x", x);
				tGrid.setAttribute("head-y", y);
				tGrid.setAttribute("ship-bearing", course);
				if (!FOG_OF_WAR) {
					tGrid.style.backgroundColor = 'black';
				}
			}
		} else if (course == SHIP_COURSE_HORIZONTAL) {
			for (var i = 0; i < ship_size; i++) {
				var tGrid = document.getElementById("monitorRight").querySelector("[y='" + (y + i) + "'][x='" + x + "']");
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", type);
				tGrid.setAttribute("head-x", x);
				tGrid.setAttribute("head-y", y);
				tGrid.setAttribute("ship-bearing", course);
				if (!FOG_OF_WAR) {
					tGrid.style.backgroundColor = 'black';
				}
			}
		}
		//add the counter
		player_2_ship_count = player_2_ship_count + 1;
		player_2_fleet_course = player_2_fleet_course + course;
		switch (type) {
			case SHIP_CLASS_BB:
				player_2_BB_count = player_2_BB_count + 1;
				break;
			case SHIP_CLASS_CV:
				player_2_CV_count = player_2_CV_count + 1;
				break;
			case SHIP_CLASS_CA:
				player_2_CA_count = player_2_CA_count + 1;
				break;
			case SHIP_CLASS_DD:
				player_2_DD_count = player_2_DD_count + 1;
				break;
		}
		if (player_2_ship_count >= MAX_SHIP_COUNT) {
			//done!
		} else {
			shipPlacementBasic();
		}
	} else {
		if (player_2_ship_count >= MAX_SHIP_COUNT) {
			//done!
		} else {
			shipPlacementBasic();
		}
	}


}

function attackMain() {
	//TODO switch for different method of ai
	switch (AI_CONFIG) {
		case AI_CONFIGURATION_BASIC:
			attackBasic();
			break;
		case AI_CONFIGURATION_INTERMEDIATE:
			alert(string.game_config_error);
			break;
		case AI_CONFIGURATION_ADVANCED:
			alert(string.game_config_error);
			break;
		case AI_CONFIGURATION_ALL_SEEING:
			alert(string.game_config_error);
			break;
		default:
			alert(string.game_config_error);

	}
}

var lastHitCoorX;
var lastHitCoorY;
var lastHit = false;
var lastLastHit = false; //lol
var d;

function attackBasic() {
	var x;
	var y;
	if (lastHit) {
		if (!lastLastHit) {

			//try to move around last hit point and hit the remainng section
			d = RNG(0, 3);

		} else {
			//continue on the direction
			switch (d) {
				case 0:
					if (document.getElementById("monitorLeft").querySelector("[y='" + lastHitCoorY + "'][x='" + (lastHitCoorX + 1) + "']") != null) {
						x = lastHitCoorX + 1;
						y = lastHitCoorY;
					} else {
						//flip direction
						x = lastHitCoorX - 1;
						y = lastHitCoorY;
					}

					break;
				case 1:
					if (document.getElementById("monitorLeft").querySelector("[y='" + lastHitCoorY + "'][x='" + (lastHitCoorX - 1) + "']") != null) {
						x = lastHitCoorX - 1;
						y = lastHitCoorY;
					} else {
						//flip direction
						x = lastHitCoorX + 1;
						y = lastHitCoorY;
					}
					break;
				case 2:
					if (document.getElementById("monitorLeft").querySelector("[y='" + (lastHitCoorY - 1) + "'][x='" + lastHitCoorX + "']") != null) {
						y = lastHitCoorY - 1;
						x = lastHitCoorX;
					} else {
						//flip direction
						x = lastHitCoorX;
						y = lastHitCoorY + 1;
					}
					break;
				case 3:
					if (document.getElementById("monitorLeft").querySelector("[y='" + (lastHitCoorY + 1) + "'][x='" + lastHitCoorX + "']") != null) {
						y = lastHitCoorY + 1;
						x = lastHitCoorX;
					} else {
						//flip direction
						x = lastHitCoorX;
						y = lastHitCoorY - 1;
					}
					break;
			}
		}
	} else {
		//give up and just shoot randomly
		x = RNG(0, MAP_SIZE);
		y = RNG(0, MAP_SIZE);
	}

	//see if available
	var tGrid = document.getElementById("monitorLeft").querySelector("[y='" + y + "'][x='" + x + "']");
	if (tGrid == null || tGrid.hasAttribute("sunk")) {
		//current target destroyed
		lastHit = false;
		//if no, do it again
		attackBasic();
	} else {
		lastLastHit = lastHit; //backup
		if (ship_class_acting == SHIP_CLASS_CV) {
			lastHit = airStrike(x, y);
		} else {
			lastHit = artilleryStrike(x, y);
		}
		if (lastHit) {
			lastHitCoorY = y;
			lastHitCoorX = x;
		}
	}

}
