/**
 * File for codes that are reaposible for the ai opponent.
 */
var AI_CONFIGURATION_BASIC = 0;

//variables for data in ai



/**
 * Codes for computer ship placing
 */
function aiShipPlacementMain() {
	//TODO switch for different method of ai
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
	if (course == SHIP_COURSE_VERICAL) {
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
	var course = RNG(SHIP_COURSE_VERICAL, SHIP_COURSE_HORIZONTAL);
	var type = RNG(SHIP_CLASS_BB, SHIP_CLASS_DD);
	if (shipPlacableAi(x, y, type, course)) {
		//place the ship
		if (course == SHIP_COURSE_VERICAL) {
			for (var i = 0; i < ship_size; i++) {
				var tGrid = document.getElementById("monitorRight").querySelector("[x='" + (x + i) + "'][y='" + y + "']");
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", type);
				if (FOG_OF_WAR) {
					tGrid.style.backgroundColor = 'black';
				}
			}
		} else if (course == SHIP_COURSE_HORIZONTAL) {
			for (var i = 0; i < ship_size; i++) {
				var tGrid = document.getElementById("monitorRight").querySelector("[y='" + (y + i) + "'][x='" + x + "']");
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", type);
				if (FOG_OF_WAR) {
					tGrid.style.backgroundColor = 'black';
				}
			}
		}
		//add the counter
		player_2_ship_count = player_2_ship_count + 1;
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
