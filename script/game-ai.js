/**
 * File for codes that are reaposible for defining and controlling the actions of  the ai opponent.
 */
//list of ai
/**
 * basic ai that is dumb as hell and works like sh*t (Completed)
 */
var AI_CONFIGURATION_BASIC = 0;
/**
 * a better ai (in progress)
 */
var AI_CONFIGURATION_INTERMEDIATE = 1;
/**
 * an even better ai (not yet exist)
 */
var AI_CONFIGURATION_ADVANCED = 2;
/**
 * "You fool. Don't ever think that you are safe just because you hide in the Fog of War... For I can always see through it."
 * (this is basically cheat!)
 */
var AI_CONFIGURATION_ALL_SEEING = 3;


/**
 * Codes for computer ship placing
 */
/**  
 * Main switch of code for different AI levels configured.
 */
function shipPlacementMain() {
	//TODO switch for different method of ai
	switch (ai_config) {
		case AI_CONFIGURATION_BASIC:
			shipPlacementBasic();
			break;
		case AI_CONFIGURATION_INTERMEDIATE:
			shipPlacementIntermediate();
			break;
		case AI_CONFIGURATION_ADVANCED:
			shipPlacementAdvanced();
			break;
		case AI_CONFIGURATION_ALL_SEEING:
			//for testing, we borrow code from Internediate.
			//Won't matter anyway. You are going to be crushed.
			shipPlacementIntermediate();
			break;
		default:
			onConfigError();

	}

}

/**
 *  Code for the AI to determine if the placement of the ship is legal.
 */
var ship_size;

function shipPlacableAi(x, y, type, course) {
	if (type == SHIP_CLASS_BB) {
		if (player_2_BB_count >= max_bb_count) {
			//stop the meaningless struggle
			return false;
		}
	}
	if (type == SHIP_CLASS_CV) {
		if (player_2_CV_count >= max_cv_count) {
			//stop the meaningless struggle
			return false;
		}
	}
	if (type == SHIP_CLASS_CA) {
		if (player_2_CA_count >= max_ca_count) {
			//stop the meaningless struggle
			return false;
		}
	}
	if (type == SHIP_CLASS_DD) {
		if (player_2_DD_count >= max_dd_count) {
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
		if ((x + ship_size) < map_size && y < map_size) {
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
		if ((y + ship_size) < map_size && x < map_size) {
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

/**
 * Ship placement code for the Basic AI
 */
function shipPlacementBasic() {
	var x = RNG(0, map_size);
	var y = RNG(0, map_size);
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
				tGrid.setAttribute("sector", i);
				if (!FOG_OF_WAR) {
					tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[type][0][i] + "')";
					var classes = tGrid.getAttribute('class');
					classes = classes + " ShipsTile";
					tGrid.setAttribute('class', classes);
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
				tGrid.setAttribute("sector", i);
				if (!FOG_OF_WAR) {
					tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[type][0][i] + "')";
					var classes = tGrid.getAttribute('class');
					classes = classes + " ShipsTileHorizontal";
					tGrid.setAttribute('class', classes);
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
		if (player_2_ship_count >= max_ship_count) {
			//done!
		} else {
			shipPlacementBasic();
		}
	} else {
		if (player_2_ship_count >= max_ship_count) {
			//done!
		} else {
			shipPlacementBasic();
		}
	}


}

/**
 * Ship placement code for the Intermediate AI
 */
var q = 0;

function shipPlacementIntermediate() {
	var x;
	var y;
	//try to make ship spawn more even
	switch (q) {
		case 0:
			x = RNG(0, Math.round(map_size / 2));
			y = RNG(0, Math.round(map_size / 2));
			break;
		case 1:
			x = RNG(Math.round(map_size / 2), map_size);
			y = RNG(0, Math.round(map_size / 2));
			break;
		case 2:
			x = RNG(0, Math.round(map_size / 2));
			y = RNG(Math.round(map_size / 2), map_size);
			break;
		case 3:
			x = RNG(Math.round(map_size / 2), map_size);
			y = RNG(Math.round(map_size / 2), map_size);
			break;
	}
	var course = RNG(SHIP_COURSE_VERTICAL, SHIP_COURSE_HORIZONTAL);
	var type = RNG(SHIP_CLASS_BB, SHIP_CLASS_DD);
	if (shipPlacableAi(x, y, type, course)) {
		if (course == SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size; i++) {
				var tGrid = document.getElementById("monitorRight").querySelector("[x='" + (x + i) + "'][y='" + y + "']");
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", type);
				tGrid.setAttribute("head-x", x);
				tGrid.setAttribute("head-y", y);
				tGrid.setAttribute("ship-bearing", course);
				tGrid.setAttribute("sector", i);
				if (!FOG_OF_WAR) {
					tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[type][0][i] + "')";
					var classes = tGrid.getAttribute('class');
					classes = classes + " ShipsTile";
					tGrid.setAttribute('class', classes);
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
				tGrid.setAttribute("sector", i);
				if (!FOG_OF_WAR) {
					tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[type][0][i] + "')";
					var classes = tGrid.getAttribute('class');
					classes = classes + " ShipsTileHorizontal";
					tGrid.setAttribute('class', classes);
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
		q = q + 1;
		if (q > 3) {
			q = 0;
		}
		if (player_2_ship_count >= max_ship_count) {
			//done!
		} else {
			shipPlacementIntermediate();
		}
	} else {
		if (player_2_ship_count >= max_ship_count) {
			//done!
		} else {
			shipPlacementIntermediate();
		}
	}


}

function shipPlacementAdvanced() {
	var x;
	var y;
	//try to make ship spawn more even
	switch (q) {
		case 0:
			x = RNG(0, Math.round(map_size / 2));
			y = RNG(0, Math.round(map_size / 2));
			break;
		case 1:
			x = RNG(Math.round(map_size / 2), map_size);
			y = RNG(0, Math.round(map_size / 2));
			break;
		case 2:
			x = RNG(0, Math.round(map_size / 2));
			y = RNG(Math.round(map_size / 2), map_size);
			break;
		case 3:
			x = RNG(Math.round(map_size / 2), map_size);
			y = RNG(Math.round(map_size / 2), map_size);
			break;
	}
	var course = RNG(SHIP_COURSE_VERTICAL, SHIP_COURSE_HORIZONTAL);
	var type;
	//optimzed fleet composition
	if (player_2_CV_count < max_cv_count){
		type = SHIP_CLASS_CV;
	} else if (player_2_BB_count < max_bb_count && player_2_BB_count < Math.round(max_ship_count/2)){
		type = SHIP_CLASS_BB;
	} else {
		type = RNG(SHIP_CLASS_CA, SHIP_CLASS_DD);
	}
	if (shipPlacableAi(x, y, type, course)) {
		if (course == SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size; i++) {
				var tGrid = document.getElementById("monitorRight").querySelector("[x='" + (x + i) + "'][y='" + y + "']");
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", type);
				tGrid.setAttribute("head-x", x);
				tGrid.setAttribute("head-y", y);
				tGrid.setAttribute("ship-bearing", course);
				tGrid.setAttribute("sector", i);
				if (!FOG_OF_WAR) {
					tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[type][0][i] + "')";
					var classes = tGrid.getAttribute('class');
					classes = classes + " ShipsTile";
					tGrid.setAttribute('class', classes);
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
				tGrid.setAttribute("sector", i);
				if (!FOG_OF_WAR) {
					tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[type][0][i] + "')";
					var classes = tGrid.getAttribute('class');
					classes = classes + " ShipsTileHorizontal";
					tGrid.setAttribute('class', classes);
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
		q = q + 1;
		if (q > 3) {
			q = 0;
		}
		if (player_2_ship_count >= max_ship_count) {
			//done!
		} else {
			shipPlacementAdvanced();
		}
	} else {
		if (player_2_ship_count >= max_ship_count) {
			//done!
		} else {
			shipPlacementAdvanced();
		}
	}
}

/**
 * Codes for computer ship targeting
 */
/**  
 * Main switch of code for different AI levels configured.
 */
function attackMain() {
	//TODO switch for different method of ai
	switch (ai_config) {
		case AI_CONFIGURATION_BASIC:
			attackBasic();
			break;
		case AI_CONFIGURATION_INTERMEDIATE:
			attackIntermediate();
			break;
		case AI_CONFIGURATION_ADVANCED:
			attackAdvanced();
			break;
		case AI_CONFIGURATION_ALL_SEEING:
			attackAllSeeing();
			break;
		default:
			onConfigError();

	}
}

/**
 * targeting code for the Basic AI
 */
var lastHitCoorX;
var lastHitCoorY;
var lastHit = false;
var lastLastHit = false; //lol
var d = 0;
var x;
var y;

function attackBasic() {
	if (lastHit) {
		if (!lastLastHit) {

			//try to move around last hit point and hit the remainng section
			d = RNG(0, 3);

		} else {
			//continue on the direction
		}
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

	} else {
		//give up and just shoot randomly
		x = RNG(0, map_size);
		y = RNG(0, map_size);
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
		player_2_attack_count = player_2_attack_count - 1;
		if (ship_class_acting == SHIP_CLASS_CV) {
			airStrike(x, y);
		} else {
			artilleryStrike(x, y);
		}
	}

}

/**
 * Targeting code for the Intermediate AI
 */
var target_locked = false;
var lockedCoorX;
var lockedCoorY;
var hitCount = 0;

function attackIntermediate() {
	if (target_locked) {
		if (lastHit) {
			if (!lastLastHit && hitCount < 2) {
				//try to move around last hit point and hit the remainng section
				d = RNG(0, 3);

			} else {
				//continue on the direction
			}
			switch (d) {
				case 0:
					if (document.getElementById("monitorLeft").querySelector("[y='" + lastHitCoorY + "'][x='" + (lastHitCoorX + 1) + "']") != null) {
						x = lastHitCoorX + 1;
						y = lastHitCoorY;
					} else {
						//flip direction
						d = 1;
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
						d = 0;
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
						d = 3;
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
						d = 2;
						x = lastHitCoorX;
						y = lastHitCoorY - 1;
					}
					break;
			}

		} else if (lastLastHit) {
			if (hitCount < 2) {
				//wrong direction
				d = RNG(0, 3);
				switch (d) {
					case 0:
						if (document.getElementById("monitorLeft").querySelector("[y='" + lastHitCoorY + "'][x='" + (lastHitCoorX + 1) + "']") != null) {
							x = lastHitCoorX + 1;
							y = lastHitCoorY;
						} else {
							//flip direction
							d = 1;
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
							d = 0;
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
							d = 3;
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
							d = 2;
							x = lastHitCoorX;
							y = lastHitCoorY - 1;
						}
						break;
				}
			} else {
				//MUST.BE.NEAR.BY!
				if (hitCount < 4) {
					//flip the direction
					switch (d) {
						case 0:
							if (document.getElementById("monitorLeft").querySelector("[y='" + lockedCoorY + "'][x='" + (lockedCoorX - 1) + "']") != null) {
								x = lockedCoorX - 1;
								y = lockedCoorY;
								d = 1;
							}

							break;
						case 1:
							if (document.getElementById("monitorLeft").querySelector("[y='" + lockedCoorY + "'][x='" + (lockedCoorX + 1) + "']") != null) {
								x = lockedCoorX + 1;
								y = lockedCoorY;
								d = 0;
							}
							break;
						case 2:
							if (document.getElementById("monitorLeft").querySelector("[y='" + (lockedCoorY + 1) + "'][x='" + lockedCoorX + "']") != null) {
								y = lockedCoorY + 1;
								x = lockedCoorX;
								d = 3;
							}
							break;
						case 3:
							if (document.getElementById("monitorLeft").querySelector("[y='" + (lockedCoorY - 1) + "'][x='" + lockedCoorX + "']") != null) {
								y = lockedCoorY - 1;
								x = lockedCoorX;
								d = 2;
							}
							break;
					}
				} else {
					//probaly a battleship. try to hit it twice in every sector.
					//which means we simply flip the dirction and don't touch the coordinates.
					switch (d) {
						case 0:
							x = lastHitCoorX;
							y = lastHitCoorY;
							d = 1;


							break;
						case 1:
							x = lastHitCoorX;
							y = lastHitCoorY;
							d = 0;

							break;
						case 2:
							x = lastHitCoorX;
							y = lastHitCoorY;

							d = 3;

							break;
						case 3:
							x = lastHitCoorX;
							y = lastHitCoorY;
							d = 2;

							break;
					}
				}

			}
		} else if (lastHitCoorX == lockedCoorX && lastHitCoorY == lockedCoorY) {
			//wrong direction
			d = RNG(0, 3);
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


		} else {
			//TODO before v0.3.0: we can handle this better.
			//@version 0.4.0: It's good enough. For now.
			x = RNG(0, map_size);
			y = RNG(0, map_size);
		}



	} else {
		//just shoot randomly
		x = RNG(0, map_size);
		y = RNG(0, map_size);
	}

	//see if available
	var tGrid = document.getElementById("monitorLeft").querySelector("[y='" + y + "'][x='" + x + "']");
	if (tGrid == null || tGrid.hasAttribute("sunk")|| (!target_locked && tGrid.hasAttribute("hit"))) {
		//if no, do it again
		attackIntermediate();
	} else {
		lastLastHit = lastHit; //backup
		player_2_attack_count = player_2_attack_count - 1;
		if (ship_class_acting == SHIP_CLASS_CV) {
			airStrike(x, y);
		} else {
			artilleryStrike(x, y);
		}
	}
}

/**
 * Targeting code for the Advanced AI
 */
//TODO guess next ship base on distribution of known ships. Possible?
function attackAdvanced() {
	if (target_locked) {
		if (lastHit) {
			if (!lastLastHit && hitCount < 2) {
				//try to move around last hit point and hit the remainng section
				d = RNG(0, 3);

			} else {
				//continue on the direction
			}
			switch (d) {
				case 0:
					if (document.getElementById("monitorLeft").querySelector("[y='" + lastHitCoorY + "'][x='" + (lastHitCoorX + 1) + "']") != null) {
						x = lastHitCoorX + 1;
						y = lastHitCoorY;
					} else {
						//flip direction
						d = 1;
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
						d = 0;
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
						d = 3;
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
						d = 2;
						x = lastHitCoorX;
						y = lastHitCoorY - 1;
					}
					break;
			}

		} else if (lastLastHit) {
			if (hitCount < 2) {
				//wrong direction
				d = RNG(0, 3);
				switch (d) {
					case 0:
						if (document.getElementById("monitorLeft").querySelector("[y='" + lastHitCoorY + "'][x='" + (lastHitCoorX + 1) + "']") != null) {
							x = lastHitCoorX + 1;
							y = lastHitCoorY;
						} else {
							//flip direction
							d = 1;
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
							d = 0;
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
							d = 3;
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
							d = 2;
							x = lastHitCoorX;
							y = lastHitCoorY - 1;
						}
						break;
				}
			} else {
				//MUST.BE.NEAR.BY!
				if (hitCount < 4) {
					//flip the direction
					switch (d) {
						case 0:
							if (document.getElementById("monitorLeft").querySelector("[y='" + lockedCoorY + "'][x='" + (lockedCoorX - 1) + "']") != null) {
								x = lockedCoorX - 1;
								y = lockedCoorY;
								d = 1;
							}

							break;
						case 1:
							if (document.getElementById("monitorLeft").querySelector("[y='" + lockedCoorY + "'][x='" + (lockedCoorX + 1) + "']") != null) {
								x = lockedCoorX + 1;
								y = lockedCoorY;
								d = 0;
							}
							break;
						case 2:
							if (document.getElementById("monitorLeft").querySelector("[y='" + (lockedCoorY + 1) + "'][x='" + lockedCoorX + "']") != null) {
								y = lockedCoorY + 1;
								x = lockedCoorX;
								d = 3;
							}
							break;
						case 3:
							if (document.getElementById("monitorLeft").querySelector("[y='" + (lockedCoorY - 1) + "'][x='" + lockedCoorX + "']") != null) {
								y = lockedCoorY - 1;
								x = lockedCoorX;
								d = 2;
							}
							break;
					}
				} else {
					//probaly a battleship. try to hit it twice in every sector.
					//which means we simply flip the dirction and don't touch the coordinates.
					switch (d) {
						case 0:
							x = lastHitCoorX;
							y = lastHitCoorY;
							d = 1;


							break;
						case 1:
							x = lastHitCoorX;
							y = lastHitCoorY;
							d = 0;

							break;
						case 2:
							x = lastHitCoorX;
							y = lastHitCoorY;

							d = 3;

							break;
						case 3:
							x = lastHitCoorX;
							y = lastHitCoorY;
							d = 2;

							break;
					}
				}

			}
		} else if (lastHitCoorX == lockedCoorX && lastHitCoorY == lockedCoorY) {
			//wrong direction
			d = RNG(0, 3);
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


		} else {
			switch (q) {
				case 0:
					x = RNG(0, Math.round(map_size / 2));
					y = RNG(0, Math.round(map_size / 2));
					break;
				case 1:
					x = RNG(Math.round(map_size / 2), map_size);
					y = RNG(0, Math.round(map_size / 2));
					break;
				case 2:
					x = RNG(0, Math.round(map_size / 2));
					y = RNG(Math.round(map_size / 2), map_size);
					break;
				case 3:
					x = RNG(Math.round(map_size / 2), map_size);
					y = RNG(Math.round(map_size / 2), map_size);
					break;
			}
			q = q + 1;
			if (q > 3) {
				q = 0;
			}
		}



	} else {
		//cycle between the areas
		switch (q) {
			case 0:
				x = RNG(0, Math.round(map_size / 2));
				y = RNG(0, Math.round(map_size / 2));
				break;
			case 1:
				x = RNG(Math.round(map_size / 2), map_size);
				y = RNG(0, Math.round(map_size / 2));
				break;
			case 2:
				x = RNG(0, Math.round(map_size / 2));
				y = RNG(Math.round(map_size / 2), map_size);
				break;
			case 3:
				x = RNG(Math.round(map_size / 2), map_size);
				y = RNG(Math.round(map_size / 2), map_size);
				break;
		}
		q = q + 1;
		if (q > 3) {
			q = 0;
		}
	}

	//see if available
	var tGrid = document.getElementById("monitorLeft").querySelector("[y='" + y + "'][x='" + x + "']");
	if (tGrid == null || tGrid.hasAttribute("sunk")|| (!target_locked && tGrid.hasAttribute("hit"))) {
		//if no, do it again
		attackIntermediate();
	} else {
		lastLastHit = lastHit; //backup
		player_2_attack_count = player_2_attack_count - 1;
		if (ship_class_acting == SHIP_CLASS_CV) {
			airStrike(x, y);
		} else {
			artilleryStrike(x, y);
		}
	}
}

/**
 * Targeting code for the All-Seeing AI
 */
function attackAllSeeing() {
	var x;
	var y;
	var i;
	var grids = document.getElementById("monitorLeft").querySelectorAll("[placed='true']");
	i = RNG(0, grids.length - 1);
	//I see where you are.
	if (grids[i].hasAttribute("sunk") || parseInt(grids[i].getAttribute("hit_count")) >= 2) {
		//This has already been eliminated.
		i = i + 1;
		attackAllSeeing();
	} else {
		x = parseInt(grids[i].getAttribute("x"));
		y = parseInt(grids[i].getAttribute("y"));
		//Let's show them some mercy. 1/4 hit chance. I think that is enough.
		var nx;
		var ny;
		var s = RNG(0,1);
		if(s = 1){
			nx = RNG(x - 1, x);
		} else {
			nx = RNG(x, x + 1);
		}
		s = RNG(0,1);
		if(s = 1){
			ny = RNG((y), (y + 1));
		} else {
			ny = RNG((y - 1), (y));
		}
		player_2_attack_count = player_2_attack_count - 1;
		if (ship_class_acting == SHIP_CLASS_CV) {
			airStrike(nx, ny);
		} else {
			artilleryStrike(nx, ny);
		}
	}
}

/**
 * Extra code for getting attack result due to change in 59b23a4
 * TODO can this be fixed?
 */
function onAttackResult(hit) {
	lastHit = hit;
	switch (ai_config) {
		case AI_CONFIGURATION_BASIC:
			if (lastHit) {
				lastHitCoorY = y;
				lastHitCoorX = x;
			}
			break;
		case AI_CONFIGURATION_INTERMEDIATE:
		case AI_CONFIGURATION_ADVANCED:
			if (lastHit) {
				lastHitCoorY = y;
				lastHitCoorX = x;
				hitCount = hitCount + 1;
				//lock on the target if hasn't
				if (!target_locked) {
					target_locked = true;
					lockedCoorY = y;
					lockedCoorX = x;
				}
				//or else if it is destroyed, unlock it.
				if (shipDestroyed("monitorLeft", x, y)) {
					target_locked = false;
					hitCount = 0;
				}
			}
			break;
		case AI_CONFIGURATION_ALL_SEEING:
			//I don't need you to tell me if I hit. I always know.
			break;
		default:
			onConfigError();
	}
}