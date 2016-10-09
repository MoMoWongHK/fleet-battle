/**
 * File for codes that are reaposible for defining and controlling the actions of  the ai opponent.
 */
//list of ai
/**
 * basic ai that is dumb as hell and works like sh*t 
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
//variables for data in ai



/**
 * Codes for computer ship placing
 */
/**  
 * Main switch of code for different AI levels configured.
 */
function shipPlacementMain() {
	//TODO switch for different method of ai
	switch (AI_CONFIG) {
		case AI_CONFIGURATION_BASIC:
			shipPlacementBasic();
			break;
		case AI_CONFIGURATION_INTERMEDIATE:
			shipPlacementIntermediate();
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

/**
 *  Code for the AI to determine if the placement of the ship is legal.
 */
var ship_size;

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

/**
 * Ship placement code for the Basic AI
 */
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
			x = RNG(0, Math.round(MAP_SIZE / 2));
			y = RNG(0, Math.round(MAP_SIZE / 2));
			break;
		case 1:
			x = RNG(Math.round(MAP_SIZE / 2), MAP_SIZE);
			y = RNG(0, Math.round(MAP_SIZE / 2));
			break;
		case 2:
			x = RNG(0, Math.round(MAP_SIZE / 2));
			y = RNG(Math.round(MAP_SIZE / 2), MAP_SIZE);
			break;
		case 3:
			x = RNG(Math.round(MAP_SIZE / 2), MAP_SIZE);
			y = RNG(Math.round(MAP_SIZE / 2), MAP_SIZE);
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
		if (player_2_ship_count >= MAX_SHIP_COUNT) {
			//done!
		} else {
			shipPlacementIntermediate();
		}
	} else {
		if (player_2_ship_count >= MAX_SHIP_COUNT) {
			//done!
		} else {
			shipPlacementIntermediate();
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
	switch (AI_CONFIG) {
		case AI_CONFIGURATION_BASIC:
			attackBasic();
			break;
		case AI_CONFIGURATION_INTERMEDIATE:
			attackIntermediate();
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

/**
 * targeting code for the Basic AI
 */
var lastHitCoorX;
var lastHitCoorY;
var lastHit = false;
var lastLastHit = false; //lol
var d = 0;

function attackBasic() {
	var x;
	var y;
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

/**
 * Targeting code for the Intermediate AI
 */
var target_locked = false;
var lockedCoorX;
var lockedCoorY;
var hitCount = 0;

function attackIntermediate() {
	var x;
	var y;
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
					//which means we simply flip the dirction and son't touch the coordinates.
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
			x = RNG(0, MAP_SIZE);
			y = RNG(0, MAP_SIZE);
		}



	} else {
		//just shoot randomly
		x = RNG(0, MAP_SIZE);
		y = RNG(0, MAP_SIZE);
	}

	//see if available
	var tGrid = document.getElementById("monitorLeft").querySelector("[y='" + y + "'][x='" + x + "']");
	if (tGrid == null || tGrid.hasAttribute("sunk")) {
		//if no, do it again
		attackIntermediate();
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
		//Let's show them some mercy. 1/9 hit chance. I think that is enough.
		var nx = RNG(x - 1, x + 1);
		var ny = RNG((y - 1), (y + 1));
		if (ship_class_acting == SHIP_CLASS_CV) {
			lastHit = airStrike(nx, ny);

		} else {
			lastHit = artilleryStrike(nx, ny);
		}


	}
}