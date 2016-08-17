var counter_text_left;
var counter_label_left;
var counter_text_right;
var counter_label_right;

var game_phase = 0;
var GAME_PHASE_SHIP_PLACEMENT = 0;
var GAME_PAHSE_AERIAL_COMBAT = 1;
var GAME_PHASE_COMBAT = 2;

var SHIP_COURSE_VERTICAL = 0;
var SHIP_COURSE_HORIZONTAL = 1;

var FLEET_SPEED_FAST = 0;
var FLEET_SPEED_SLOW = 1;

var ENGAGEMENT_FORM_PARALLEL = 0;
var ENGAGEMENT_FORM_HEADON = 1;
var ENGAGEMENT_FORM_T_ADV = 2;
var ENGAGEMENT_FORM_T_DIS = 3;

var SHIP_CLASS_BB = 0;
var SHIP_CLASS_CV = 1;
var SHIP_CLASS_CA = 2;
var SHIP_CLASS_DD = 3;

var ship_class_placing;
var ship_course_placing = 0;
var ship_size_placing;

var ship_class_acting;

var acting_player;
var PLAYER_1 = 0;
var PLAYER_2 = 1;

var player_1_first_act_complete = false;
var player_2_first_act_complete = false;

//game stats field for each player
var player_1_ship_set = 0;
var player_1_ship_count = 0;
//TODO use an array to replace all the ship counts?
var player_1_CV_count = 0;
var player_1_BB_count = 0;
var player_1_CA_count = 0;
var player_1_DD_count = 0;
var player_1_fleet_course = 0;
var player_1_fleet_speed;
var player_1_engagement_form; //Form Of Engagement
var player_1_attack_count;
var player_1_turn_counter = 0;
var player_1_acted = false;

var player_2_ship_set = 0;
var player_2_ship_count = 0;
var player_2_CV_count = 0;
var player_2_BB_count = 0;
var player_2_CA_count = 0;
var player_2_DD_count = 0;
var player_2_fleet_course = 0;
var player_2_fleet_speed;
var player_2_engagement_form;
var player_2_attack_count;
var player_2_turn_counter = 0;
var player_2_acted = false;


/**
 * Set up the basic ui for the game
 */
function setUI() {
	//set up the main moniters
	var monitors = document.querySelectorAll('.Monitor');
	for (var i = 0; i < monitors.length; i++) {
		//set the map size
		monitors[i].style.width = GRID_SIZE * MAP_SIZE + MAP_SIZE * 2 + "px";
		monitors[i].style.height = GRID_SIZE * MAP_SIZE + MAP_SIZE * 2 + "px";
		//create a grid of MAP_SIZE * MAP_SIZE
		for (var j = 0; j < MAP_SIZE; j++) {
			for (var k = 0; k < MAP_SIZE; k++) {
				var grid = document.createElement('div');
				grid.style.height = GRID_SIZE + 'px';
				grid.style.width = GRID_SIZE + 'px';
				grid.setAttribute('x', j);
				grid.setAttribute('y', k);
				grid.setAttribute('class', 'MonitorGrid');
				var topPosition = j * GRID_SIZE;
				var leftPosition = i * GRID_SIZE;
				grid.style.top = topPosition + 'px';
				grid.style.left = leftPosition + 'px';
				monitors[i].appendChild(grid);
			}
		}
	}
	//upper panel
	document.getElementById("objective").innerHTML = string.game_objective;
	var objective = document.getElementById("objectiveList");
	switch (game_mode) {
		case GAME_MODE_STANDARD:
			var o = document.createElement('li');
			o.innerHTML = string.game_objective_standard;
			objective.appendChild(o);
			break;
	}


	//set up the data Panel

	document.getElementById("dataPanelLeft").style.height = GRID_SIZE * MAP_SIZE + MAP_SIZE * 2 + "px";
	document.getElementById("dataPanelRight").style.height = GRID_SIZE * MAP_SIZE + MAP_SIZE * 2 + "px";

	//left panel
	var label = document.createElement('p');
	label.innerHTML = string.ship_placement_remaining;
	label.setAttribute('id', 'counterLabelLeft');
	counter_label_left = label;
	document.getElementById("dataPanelContentLeft").appendChild(label);
	var counter = document.createElement('p');
	counter.innerHTML = MAX_SHIP_COUNT;
	counter.setAttribute('class', 'Counter');
	counter.setAttribute('id', 'counterLeft');
	counter_text_left = counter;
	document.getElementById("dataPanelContentLeft").appendChild(counter);
	//determine the ship iocn set to be used by each player
	var shipset = RNG(0, 2);
	player_1_ship_set = shipset;
	for (var i = 0; i < string.ship_classes.length; i++) {
		var sLabel = document.createElement('p');
		sLabel.setAttribute('class', 'ShipClassLabel');
		sLabel.innerHTML = string.ship_classes[i];
		document.getElementById("dataPanelContentLeft").appendChild(sLabel);
		var sIcon = document.createElement('img');
		var classes;
		switch (i) {
			case SHIP_CLASS_BB:
			case SHIP_CLASS_CV:
				classes = 'ShipIcons';
				break;
			case SHIP_CLASS_CA:
				classes = 'ShipIcons ShipIconsCA';;
				break;
			case SHIP_CLASS_DD:
				classes = 'ShipIcons ShipIconsDD';;
				break;
		}
		sIcon.setAttribute('class', classes);
		sIcon.setAttribute('id', i);
		sIcon.setAttribute('src', img_url.ship_icons[player_1_ship_set][i]);
		document.getElementById("dataPanelContentLeft").appendChild(sIcon);
	}
	//right Panel
	var label2 = document.createElement('p');
	label2.innerHTML = string.ship_placement_remaining;
	counter_label_right = label2;
	document.getElementById("dataPanelContentRight").appendChild(label2);
	var counter2 = document.createElement('p');
	counter2.innerHTML = MAX_SHIP_COUNT;
	counter2.setAttribute('class', 'Counter');
	counter2.setAttribute('id', 'counterRight');
	counter_text_right = counter2;
	document.getElementById("dataPanelContentRight").appendChild(counter2);
	//use a different ship icon set than player 1
	while (player_2_ship_set == player_1_ship_set) {
		var shipset = RNG(0, 2);
		player_2_ship_set = shipset;
	}
	for (var i = 0; i < string.ship_classes.length; i++) {
		var sLabel2 = document.createElement('p');
		sLabel2.setAttribute('class', 'ShipClassLabel');
		sLabel2.innerHTML = string.ship_classes[i];
		document.getElementById("dataPanelContentRight").appendChild(sLabel2);
		var sIcon2 = document.createElement('img');
		var classes;
		switch (i) {
			case SHIP_CLASS_BB:
			case SHIP_CLASS_CV:
				classes = 'ShipIconsEnemy ShipIcons';
				break;
			case SHIP_CLASS_CA:
				classes = 'ShipIconsEnemy ShipIcons ShipIconsCA';;
				break;
			case SHIP_CLASS_DD:
				classes = 'ShipIconsEnemy ShipIcons ShipIconsDD';;
				break;
		}
		sIcon2.setAttribute('class', classes);
		sIcon2.setAttribute('src', img_url.ship_icons[player_2_ship_set][i]);
		document.getElementById("dataPanelContentRight").appendChild(sIcon2);

	}
	var mainButton = document.getElementById("mainButton");
	mainButton.innerHTML = string.assemble_fleet;
	mainButton.addEventListener('click', startShipPlacement, false);


}

function startShipPlacement() {
	//hide the panel for player 2 first
	document.getElementById("dataPanelContentRight").style.display = 'none';
	var p = document.createElement('p');
	p.innerHTML = string.pending;
	p.setAttribute('class', 'DataPanelOverlay');
	p.setAttribute('id', 'pending');
	document.getElementById("dataPanelRight").appendChild(p);
	//add onclicklistener for the ship icons
	var ships = document.getElementById("dataPanelContentLeft").querySelectorAll('.ShipIcons');
	for (var i = 0; i < ships.length; i++) {
		var classes = ships[i].getAttribute('class');
		classes = classes + " ShipIconsSelectable"
		ships[i].setAttribute('class', classes);
	}
	var ships = document.querySelectorAll('.ShipIconsSelectable');
	for (var i = 0; i < ships.length; i++) {
		var t = i;
		ships[i].addEventListener("click", onShipIconSelected, false);
	}
	var rButton = document.createElement('button');
	rButton.innerHTML = string.rotate;
	rButton.setAttribute('id', 'rbutton');
	//rButton.setAttribute('class', 'Button');
	document.getElementById("dataPanelContentLeft").appendChild(rButton);
	document.getElementById("rbutton").style.display = 'none';
	document.getElementById("rbutton").addEventListener('click', function() {
		if (ship_course_placing == SHIP_COURSE_VERTICAL) {
			ship_course_placing = SHIP_COURSE_HORIZONTAL;
		} else {
			ship_course_placing = SHIP_COURSE_VERTICAL;
		}
	}, false);
	//prepare button for next page
	var mainButton = document.getElementById("mainButton");
	mainButton.innerHTML = string.start_battle;
	mainButton.removeEventListener('click', startShipPlacement, false);
	mainButton.addEventListener('click',
		startGame, false);
}

function onShipIconSelected(evt) {
	ship_class_placing = parseInt(evt.target.id);
	//set eventlistener for all the moniter grids
	var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		grids[i].addEventListener('click', placeShip, false);
		grids[i].addEventListener('mouseover', projectShip, false);
		grids[i].addEventListener('mouseout', unProjectShip, false);
	}
	document.getElementById("rbutton").style.display = 'inline-block';
	document.getElementById("rbutton").style.margin = '5px 60px 5px 60px';

}

/**
 * Check if a ship is placable in the given coordinate
 */
function shipPlacable(x, y) {
	switch (ship_class_placing) {
		case SHIP_CLASS_BB:
		case SHIP_CLASS_CV:
			ship_size_placing = 4;
			break;
		case SHIP_CLASS_CA:
			ship_size_placing = 3;
			break;
		case SHIP_CLASS_DD:
			ship_size_placing = 2;
			break;
	}
	if (ship_course_placing == SHIP_COURSE_VERTICAL) {
		//check if over edge of map
		if ((x + ship_size_placing) <= MAP_SIZE && y <= MAP_SIZE) {
			//check if another ship already exsist
			for (var i = 0; i < ship_size_placing; i++) {
				if (document.querySelector("[x='" + (x + i) + "'][y='" + y + "']").hasAttribute("placed")) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	} else if (ship_course_placing == SHIP_COURSE_HORIZONTAL) {
		if ((y + ship_size_placing) <= MAP_SIZE && x <= MAP_SIZE) {
			for (var i = 0; i < ship_size_placing; i++) {
				if (document.querySelector("[y='" + (y + i) + "'][x='" + x + "']").hasAttribute("placed")) {
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
 * creates a "projection" of a ship on the moniter to indicate this is possible to place a ship
 */
function projectShip(evt) {
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (shipPlacable(targetX, targetY)) {
		if (ship_course_placing == SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[x='" + (targetX + i) + "'][y='" + targetY + "']");
				tGrid.style.backgroundColor = 'grey';
			}
		} else if (ship_course_placing == SHIP_COURSE_HORIZONTAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[y='" + (targetY + i) + "'][x='" + targetX + "']");
				tGrid.style.backgroundColor = 'grey';
			}
		}
	}
}

/**
 * remove the ship projection left by player
 */
function unProjectShip(evt) {
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (shipPlacable(targetX, targetY)) {
		if (ship_course_placing == SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[x='" + (targetX + i) + "'][y='" + targetY + "']");
				tGrid.style.backgroundColor = '';
			}
		} else if (ship_course_placing == 1) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[y='" + (targetY + i) + "'][x='" + targetX + "']");
				tGrid.style.backgroundColor = '';
			}
		}
	}
}

function placeShip(evt) {
	//TODO use ship shapes instead of colored grids
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (shipPlacable(targetX, targetY)) {
		if (ship_course_placing == SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[x='" + (targetX + i) + "'][y='" + targetY + "']");
				tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[ship_class_placing][0][i] + "')";
				console.log(img_url.ship_tiles[ship_class_placing][0][i]);
				var classes = tGrid.getAttribute('class');
				classes = classes + " ShipsTile";
				tGrid.setAttribute('class', classes);
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", ship_class_placing);
				tGrid.setAttribute("ship-bearing", ship_course_placing);
				tGrid.setAttribute("sector", i);
				tGrid.setAttribute("head-x", targetX);
				tGrid.setAttribute("head-y", targetY);
				tGrid.style.backgroundColor = '';
				tGrid.removeEventListener('click', placeShip, false);
				tGrid.removeEventListener('mouseover', projectShip, false);
				tGrid.removeEventListener('mouseout', unProjectShip, false);
			}
		} else if (ship_course_placing == SHIP_COURSE_HORIZONTAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[y='" + (targetY + i) + "'][x='" + targetX + "']");
				tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[ship_class_placing][0][i] + "')";
				var classes = tGrid.getAttribute('class');
				classes = classes + " ShipsTileHorizontal";
				tGrid.setAttribute('class', classes);
				tGrid.removeEventListener('click', placeShip, false);
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", ship_class_placing);
				tGrid.setAttribute("ship-bearing", ship_course_placing);
				tGrid.setAttribute("sector", i);
				tGrid.setAttribute("head-x", targetX);
				tGrid.setAttribute("head-y", targetY);
				tGrid.style.backgroundColor = '';
				tGrid.removeEventListener('mouseover', projectShip, false);
				tGrid.removeEventListener('mouseout', unProjectShip, false);
			}
		}
		player_1_ship_count = player_1_ship_count + 1;
		player_1_fleet_course = player_1_fleet_course + ship_course_placing;
		document.getElementById("counterLeft").innerHTML = parseInt(counter_text_left.innerHTML) - 1;
		//check for ship class limit
		//TODO use an array to replace all the ship counts?
		switch (ship_class_placing) {
			case SHIP_CLASS_BB:
				player_1_BB_count = player_1_BB_count + 1;
				if (player_1_BB_count >= MAX_BB_COUNT) {
					var ships = document.querySelectorAll('.ShipIconsSelectable');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					//stops player from placing more ships
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}
				break;
			case SHIP_CLASS_CV:
				player_1_CV_count = player_1_CV_count + 1;
				if (player_1_CV_count >= MAX_CV_COUNT) {
					var ships = document.querySelectorAll('.ShipIconsSelectable');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}
				break;
			case SHIP_CLASS_CA:
				player_1_CA_count = player_1_CA_count + 1;
				if (player_1_CA_count >= MAX_CA_COUNT) {
					var ships = document.querySelectorAll('.ShipIconsSelectable');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}

				break;
			case SHIP_CLASS_DD:
				player_1_DD_count = player_1_DD_count + 1;
				if (player_1_DD_count >= MAX_DD_COUNT) {
					var ships = document.querySelectorAll('.ShipIconsSelectable');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}
				break;
		}
		if (player_1_ship_count >= MAX_SHIP_COUNT) {
			stopPlayerShipPlacement();
		}
	}

}

/**
 * end the ship plcing and promt ai to place ship if possible
 */
function stopPlayerShipPlacement() {
	//disable ship selector
	var ships = document.querySelectorAll('.ShipIcons');
	for (var i = 0; i < ships.length; i++) {
		var t = i;
		ships[i].removeEventListener("click", onShipIconSelected, false);
		//remove hover effect
		var classes = ships[i].getAttribute('class');
		classes = classes.replace(' ShipIconsSelectable', '');
		classes = classes.replace(' ShipIconsUnSelectable', '');
		ships[i].setAttribute('class', classes);
	}
	//disable grids
	var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		grids[i].removeEventListener('click', placeShip, false);
		grids[i].removeEventListener('mouseover', projectShip, false);
		grids[i].removeEventListener('mouseout', unProjectShip, false);
	}
	//delete the button if it still exsists
	if (document.getElementById("rbutton") != null) {
		var button = document.getElementById("rbutton");
		button.parentNode.removeChild(button);
	}
	if (game_mode == GAME_MODE_STANDARD && player_2_ship_count < MAX_SHIP_COUNT) {
		shipPlacementMain();
	}

}

function startGame() {
	if (player_1_ship_count <= 0) {
		//TODO change this to html overl;ay dialog
		alert(string.no_ship_prompt);
	} else {
		stopPlayerShipPlacement(); //just in case
		player_1_ship_count_total = player_1_ship_count;
		player_2_ship_count_total = player_2_ship_count;
		var mainButton = document.getElementById("mainButton");
		mainButton.innerHTML = string.surrender;
		mainButton.removeEventListener('click', startGame, false);
		mainButton.addEventListener('click', surrender, false);
		//display info for both players
		var labels = document.getElementById("dataPanelContentLeft").querySelectorAll('.ShipClassLabel');
		for (var i = 0; i < labels.length; i++) {
			switch (i) {
				case SHIP_CLASS_BB:
					labels[i].innerHTML = labels[i].innerHTML + " : " + player_1_BB_count;
					break;
				case SHIP_CLASS_CV:
					labels[i].innerHTML = labels[i].innerHTML + " : " + player_1_CV_count;
					break;
				case SHIP_CLASS_CA:
					labels[i].innerHTML = labels[i].innerHTML + " : " + player_1_CA_count;
					break;
				case SHIP_CLASS_DD:
					labels[i].innerHTML = labels[i].innerHTML + " : " + player_1_DD_count;
					break;
			}
		}
		document.getElementById("counterLeft").innerHTML = player_1_ship_count;
		//player 2
		//unhide the panel
		document.getElementById("dataPanelContentRight").style.display = '';
		var overlay = document.getElementById('pending');
		overlay.parentNode.removeChild(overlay);
		var labels = document.getElementById("dataPanelContentRight").querySelectorAll('.ShipClassLabel');
		if (!FOG_OF_WAR) {
			//show number of enemy ships by class
			for (var i = 0; i < labels.length; i++) {
				switch (i) {
					case SHIP_CLASS_BB:
						labels[i].innerHTML = labels[i].innerHTML + " : " + player_2_BB_count;
						break;
					case SHIP_CLASS_CV:
						labels[i].innerHTML = labels[i].innerHTML + " : " + player_2_CV_count;
						break;
					case SHIP_CLASS_CA:
						labels[i].innerHTML = labels[i].innerHTML + " : " + player_2_CA_count;
						break;
					case SHIP_CLASS_DD:
						labels[i].innerHTML = labels[i].innerHTML + " : " + player_2_DD_count;
						break;
				}
			}
		} else {
			for (var i = 0; i < labels.length; i++) {
				labels[i].innerHTML = labels[i].innerHTML + " : " + "???";
			}
		}
		document.getElementById("counterRight").innerHTML = player_2_ship_count;

		//calculate the stats for each fleet
		//speed
		if (player_1_BB_count >= Math.round(player_1_ship_count / 2)) {
			player_1_fleet_speed = FLEET_SPEED_SLOW;
		} else {
			player_1_fleet_speed = FLEET_SPEED_FAST;
		}
		if (player_2_BB_count >= Math.round(player_2_ship_count / 2)) {
			player_2_fleet_speed = FLEET_SPEED_SLOW;
		} else {
			player_2_fleet_speed = FLEET_SPEED_FAST;
		}
		//course
		if (player_1_fleet_course >= Math.round(player_1_ship_count / 2)) {
			player_1_fleet_course = SHIP_COURSE_HORIZONTAL;
		} else {
			player_1_fleet_course = SHIP_COURSE_VERTICAL;
		}
		if (player_2_fleet_course >= Math.round(player_2_ship_count / 2)) {
			player_2_fleet_course = SHIP_COURSE_HORIZONTAL;
		} else {
			player_2_fleet_course = SHIP_COURSE_VERTICAL;
		}
		aerialCombat();
	}
}
/**
 * start the aerial combat phase
 */
function aerialCombat() {
	game_phase = GAME_PAHSE_AERIAL_COMBAT;
	ship_class_acting = SHIP_CLASS_CV;
	document.getElementById("stage").innerHTML = string.game_stage_aerial;
	//determine who will go first
	var first = RNG(PLAYER_1, PLAYER_2);
	if (first == PLAYER_1) {
		acting_player = PLAYER_1;
		player_1_attack_count = player_1_CV_count * 2;
		if (player_1_attack_count > 0) {
			beginTargeting();
		} else {
			//no CVs
			nextPlayer();
		}

	} else {
		acting_player = PLAYER_2;
		player_2_attack_count = player_2_CV_count * 2;
		for (var i = 0; i < player_2_attack_count; i++) {
			attackMain();
		}
		player_2_attack_count = 0;
		nextPlayer();
	}

}

function startFleetCombat() {
	game_phase = GAME_PHASE_COMBAT;
	document.getElementById("stage").innerHTML = string.game_stage_artillery;
	//first decide the engagement form
	if (player_1_fleet_course == player_2_fleet_course) {
		player_1_engagement_form = RNG(ENGAGEMENT_FORM_PARALLEL, ENGAGEMENT_FORM_HEADON);
		player_2_engagement_form = player_1_engagement_form;
	} else {
		if (player_1_fleet_speed != player_2_fleet_speed) {
			if (player_1_fleet_speed == FLEET_SPEED_SLOW) {
				player_1_engagement_form = ENGAGEMENT_FORM_T_DIS;
				player_2_engagement_form = ENGAGEMENT_FORM_T_ADV;
			} else if (player_2_fleet_speed == FLEET_SPEED_SLOW) {
				player_1_engagement_form = ENGAGEMENT_FORM_T_ADV;
				player_2_engagement_form = ENGAGEMENT_FORM_T_DIS;
			}
		} else {
			player_1_engagement_form = RNG(ENGAGEMENT_FORM_T_ADV, ENGAGEMENT_FORM_T_DIS);
			if (player_1_engagement_form == ENGAGEMENT_FORM_T_DIS) {
				player_2_engagement_form = ENGAGEMENT_FORM_T_ADV;
			} else {
				player_2_engagement_form = ENGAGEMENT_FORM_T_DIS;
			}
		}
	}
	//show it
	//TODO sound fx and animation
	document.getElementById("FoELabel").innerHTML = string.form_of_engagement_label;
	document.getElementById("FoE").innerHTML = string.form_of_engagement[player_1_engagement_form];
	player_1_acted = false;
	player_2_acted = false;
	//determine who will go first
	var first = RNG(PLAYER_1, PLAYER_2);
	if (first == PLAYER_1) {
		acting_player = PLAYER_1;
		//let's see what type of ships we have.
		if (player_1_turn_counter <= player_1_BB_count) {
			ship_class_acting = SHIP_CLASS_BB;
			player_1_attack_count = BB_ATTACK_COUNT[player_1_engagement_form];
		}
		if (player_1_attack_count > 0) {
			player_1_turn_counter = player_1_turn_counter + 1;
			beginTargeting();
		} else {
			nextPlayer();
		}
	} else {
		acting_player = PLAYER_2;
		//let's see what type of ships we have.
		if (player_2_turn_counter <= player_2_BB_count) {
			ship_class_acting = SHIP_CLASS_BB;
			player_2_attack_count = BB_ATTACK_COUNT[player_2_engagement_form];
		}
		if (player_2_attack_count > 0) {
			player_2_turn_counter = player_2_turn_counter + 1;
			for (var i = 0; i < player_2_attack_count; i++) {
				attackMain();
			}
			player_2_attack_count = 0;
			nextPlayer();
		} else {
			nextPlayer();
		}

	}
}

/**
 * allow the player to select a squre to fire on
 */
function beginTargeting() {
	document.getElementById("counterLeft").innerHTML = player_1_attack_count;
	document.getElementById("counterLabelLeft").innerHTML = string.attack_remaining;
	var grids = document.getElementById("monitorRight").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		if (!grids[i].hasAttribute("sunk")) {
			grids[i].addEventListener('click', fire, false);
		}
		if (!grids[i].hasAttribute("sunk") && !grids[i].hasAttribute("hit_count")) {
			grids[i].addEventListener('mouseover', lockOnSector, false);
			grids[i].addEventListener('mouseout', unLockOnSector, false);
		}
	}


}

function fire(evt) {
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (acting_player == PLAYER_1) {
		player_1_attack_count = player_1_attack_count - 1;
		document.getElementById("counterLeft").innerHTML = player_1_attack_count;
	} else if (acting_player == PLAYER_2) {
		player_2_attack_count = player_2_attack_count - 1;
	}
	if (ship_class_acting == SHIP_CLASS_CV) {
		airStrike(targetX, targetY);
	} else {
		artilleryStrike(targetX, targetY);
	}
	if (player_1_attack_count <= 0) {
		stopTargeting();
		nextPlayer();
	}


}

function airStrike(x, y) {
	//TODO sound fx and animation
	//register the attack
	if (acting_player == PLAYER_1) {
		var tGrid = document.getElementById("monitorRight").querySelector("[y='" + y + "'][x='" + x + "']");
		if (tGrid.hasAttribute("hit_count")) {
			var hit = parseInt(tGrid.getAttribute("hit_count"));
			tGrid.setAttribute("hit_count", hit + 1);
		} else {
			tGrid.setAttribute("hit_count", "1");
		}
		tGrid.style.backgroundColor = 'navy';
		tGrid.style.backgroundImage = "";
		//see if we hit a ship
		if (tGrid.hasAttribute("placed")) {
			tGrid.style.backgroundColor = '';
			tGrid.style.backgroundImage = "";
			if (!FOG_OF_WAR) {
				tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[parseInt(tGrid.getAttribute("ship-class"))][1][parseInt(tGrid.getAttribute("sector"))] + "')";
			} else {
				tGrid.style.backgroundColor = "red";
			}
			tGrid.removeEventListener('mouseover', lockOnSector, false);
			//see if we sunk it
			if (shipDestroyed("monitorRight", x, y)) {
				//mark the ships as destroyed
				var tx = parseInt(tGrid.getAttribute("head-x"));
				var ty = parseInt(tGrid.getAttribute("head-y"));
				var tclass = parseInt(tGrid.getAttribute("ship-class"));
				var tbearing = parseInt(tGrid.getAttribute("ship-bearing"));
				player_2_ship_count = player_2_ship_count - 1;
				document.getElementById("counterRight").innerHTML = player_2_ship_count;
				var ship_size;
				switch (tclass) {
					case SHIP_CLASS_BB:
						ship_size = 4;
						player_2_BB_count = player_2_BB_count - 1;
						break;
					case SHIP_CLASS_CV:
						ship_size = 4;
						player_2_CV_count = player_2_CV_count - 1;
						break;
					case SHIP_CLASS_CA:
						ship_size = 3;
						player_2_CA_count = player_2_CA_count - 1;
						break;
					case SHIP_CLASS_DD:
						ship_size = 2;
						player_2_DD_count = player_2_DD_count - 1;
						break;
				}
				if (tbearing == SHIP_COURSE_VERTICAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = document.getElementById("monitorRight").querySelector("[x='" + (tx + i) + "'][y='" + ty + "']");
						if (!FOG_OF_WAR) {
							Grid.style.backgroundImage = "url('" + img_url.ship_tiles[tclass][2][i] + "')";
						} else {
							Grid.style.backgroundColor = "#990000";
						}
						Grid.setAttribute("sunk", "true");
						Grid.removeEventListener('click', fire, false);


					}
				} else if (tbearing == SHIP_COURSE_HORIZONTAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = document.getElementById("monitorRight").querySelector("[y='" + (ty + i) + "'][x='" + tx + "']");
						if (!FOG_OF_WAR) {
							Grid.style.backgroundImage = "url('" + img_url.ship_tiles[tclass][2][i] + "')";
						} else {
							Grid.style.backgroundColor = "#990000";
						}
						Grid.setAttribute("sunk", "true");
						Grid.removeEventListener('click', fire, false);

					}
				}
			}

		}
	} else if (acting_player == PLAYER_2) {
		var tGrid = document.getElementById("monitorLeft").querySelector("[y='" + y + "'][x='" + x + "']");
		if (tGrid.hasAttribute("hit_count")) {
			var hit = parseInt(tGrid.getAttribute("hit_count"));
			tGrid.setAttribute("hit_count", hit + 1);
		} else {
			tGrid.setAttribute("hit_count", "1");
		}
		tGrid.style.backgroundColor = '#000066';
		//see if we hit a ship
		if (tGrid.hasAttribute("placed")) {
			tGrid.style.backgroundColor = '';
			tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[parseInt(tGrid.getAttribute("ship-class"))][1][parseInt(tGrid.getAttribute("sector"))] + "')";
			//see if we sunk it
			if (shipDestroyed("monitorLeft", x, y)) {
				var tx = parseInt(tGrid.getAttribute("head-x"));
				var ty = parseInt(tGrid.getAttribute("head-y"));
				var tclass = parseInt(tGrid.getAttribute("ship-class"));
				var tbearing = parseInt(tGrid.getAttribute("ship-bearing"));
				//mark the ships as destroyed
				player_1_ship_count = player_1_ship_count - 1;
				refreshPlayerPanel();
				var tGrid = document.getElementById("monitorLeft").querySelector("[y='" + ty + "'][x='" + tx + "']");
				var ship_size;
				switch (tclass) {
					case SHIP_CLASS_BB:
						ship_size = 4;
						player_1_BB_count = player_1_BB_count - 1;
						break;
					case SHIP_CLASS_CV:
						ship_size = 4;
						player_1_CV_count = player_1_CV_count - 1;
						break;
					case SHIP_CLASS_CA:
						ship_size = 3;
						player_1_CA_count = player_1_CA_count - 1;
						break;
					case SHIP_CLASS_DD:
						ship_size = 2;
						player_1_DD_count = player_1_DD_count - 1;
						break;
				}
				if (tbearing == SHIP_COURSE_VERTICAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = document.getElementById("monitorLeft").querySelector("[x='" + (tx + i) + "'][y='" + ty + "']");
						Grid.style.backgroundImage = "url('" + img_url.ship_tiles[tclass][2][i] + "')";
						Grid.setAttribute("sunk", "true");

					}
				} else if (tbearing == SHIP_COURSE_HORIZONTAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = document.getElementById("monitorLeft").querySelector("[y='" + (ty + i) + "'][x='" + tx + "']");
						Grid.style.backgroundImage = "url('" + img_url.ship_tiles[tclass][2][i] + "')";
						Grid.setAttribute("sunk", "true");

					}
				}
			}
			return true; //return for AI reference
		}
		return false;
	}
}

function artilleryStrike(x, y) {
	//TODO sound fx and animation
	//register the attack
	if (acting_player == PLAYER_1) {
		var tGrid = document.getElementById("monitorRight").querySelector("[y='" + y + "'][x='" + x + "']");
		if (tGrid.hasAttribute("hit_count")) {
			var hit = parseInt(tGrid.getAttribute("hit_count"));
			tGrid.setAttribute("hit_count", hit + 1);
		} else {
			tGrid.setAttribute("hit_count", "1");
		}
		tGrid.style.backgroundColor = 'navy';
		tGrid.style.backgroundImage = "";
		//see if we hit a ship
		if (tGrid.hasAttribute("placed")) {
			tGrid.style.backgroundColor = '';
			tGrid.style.backgroundImage = "";
			if (!FOG_OF_WAR) {
				tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[parseInt(tGrid.getAttribute("ship-class"))][1][parseInt(tGrid.getAttribute("sector"))] + "')";
			} else {
				tGrid.style.backgroundColor = "red";
			}
			tGrid.removeEventListener('mouseover', lockOnSector, false);
			//see if we sunk it
			if (shipDestroyed("monitorRight", x, y)) {
				//mark the ships as destroyed
				var tx = parseInt(tGrid.getAttribute("head-x"));
				var ty = parseInt(tGrid.getAttribute("head-y"));
				var tclass = parseInt(tGrid.getAttribute("ship-class"));
				var tbearing = parseInt(tGrid.getAttribute("ship-bearing"));
				player_2_ship_count = player_2_ship_count - 1;
				document.getElementById("counterRight").innerHTML = player_2_ship_count;
				var ship_size;
				switch (tclass) {
					case SHIP_CLASS_BB:
						ship_size = 4;
						player_2_BB_count = player_2_BB_count - 1;
						break;
					case SHIP_CLASS_CV:
						ship_size = 4;
						player_2_CV_count = player_2_CV_count - 1;
						break;
					case SHIP_CLASS_CA:
						ship_size = 3;
						player_2_CA_count = player_2_CA_count - 1;
						break;
					case SHIP_CLASS_DD:
						ship_size = 2;
						player_2_DD_count = player_2_DD_count - 1;
						break;
				}
				if (tbearing == SHIP_COURSE_VERTICAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = document.getElementById("monitorRight").querySelector("[x='" + (tx + i) + "'][y='" + ty + "']");
						if (!FOG_OF_WAR) {
							Grid.style.backgroundImage = "url('" + img_url.ship_tiles[tclass][2][i] + "')";
						} else {
							Grid.style.backgroundColor = "#990000";
						}
						Grid.setAttribute("sunk", "true");
						Grid.removeEventListener('click', fire, false);


					}
				} else if (tbearing == SHIP_COURSE_HORIZONTAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = document.getElementById("monitorRight").querySelector("[y='" + (ty + i) + "'][x='" + tx + "']");
						if (!FOG_OF_WAR) {
							Grid.style.backgroundImage = "url('" + img_url.ship_tiles[tclass][2][i] + "')";
						} else {
							Grid.style.backgroundColor = "#990000";
						}
						Grid.setAttribute("sunk", "true");
						Grid.removeEventListener('click', fire, false);

					}
				}
			}

		}
	} else if (acting_player == PLAYER_2) {
		var tGrid = document.getElementById("monitorLeft").querySelector("[y='" + y + "'][x='" + x + "']");
		if (tGrid.hasAttribute("hit_count")) {
			var hit = parseInt(tGrid.getAttribute("hit_count"));
			tGrid.setAttribute("hit_count", hit + 1);
		} else {
			tGrid.setAttribute("hit_count", "1");
		}
		tGrid.style.backgroundColor = '#000066';
		//see if we hit a ship
		if (tGrid.hasAttribute("placed")) {
			tGrid.style.backgroundColor = '';
			tGrid.style.backgroundImage = "url('" + img_url.ship_tiles[parseInt(tGrid.getAttribute("ship-class"))][1][parseInt(tGrid.getAttribute("sector"))] + "')";
			//see if we sunk it
			if (shipDestroyed("monitorLeft", x, y)) {
				var tx = parseInt(tGrid.getAttribute("head-x"));
				var ty = parseInt(tGrid.getAttribute("head-y"));
				var tclass = parseInt(tGrid.getAttribute("ship-class"));
				var tbearing = parseInt(tGrid.getAttribute("ship-bearing"));
				//mark the ships as destroyed
				player_1_ship_count = player_1_ship_count - 1;
				refreshPlayerPanel();
				var tGrid = document.getElementById("monitorLeft").querySelector("[y='" + ty + "'][x='" + tx + "']");
				var ship_size;
				switch (tclass) {
					case SHIP_CLASS_BB:
						ship_size = 4;
						player_1_BB_count = player_1_BB_count - 1;
						break;
					case SHIP_CLASS_CV:
						ship_size = 4;
						player_1_CV_count = player_1_CV_count - 1;
						break;
					case SHIP_CLASS_CA:
						ship_size = 3;
						player_1_CA_count = player_1_CA_count - 1;
						break;
					case SHIP_CLASS_DD:
						ship_size = 2;
						player_1_DD_count = player_1_DD_count - 1;
						break;
				}
				if (tbearing == SHIP_COURSE_VERTICAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = document.getElementById("monitorLeft").querySelector("[x='" + (tx + i) + "'][y='" + ty + "']");
						Grid.style.backgroundImage = "url('" + img_url.ship_tiles[tclass][2][i] + "')";
						Grid.setAttribute("sunk", "true");

					}
				} else if (tbearing == SHIP_COURSE_HORIZONTAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = document.getElementById("monitorLeft").querySelector("[y='" + (ty + i) + "'][x='" + tx + "']");
						Grid.style.backgroundImage = "url('" + img_url.ship_tiles[tclass][2][i] + "')";
						Grid.setAttribute("sunk", "true");

					}
				}
			}
			return true; //return for AI reference
		}
		return false;
	}

}
//given a coordinate, check if the ship is destroyed.
function shipDestroyed(map, x, y) {
	var tGrid = document.getElementById(map).querySelector("[y='" + y + "'][x='" + x + "']");
	var tx = parseInt(tGrid.getAttribute("head-x"));
	var ty = parseInt(tGrid.getAttribute("head-y"));
	var sClass = parseInt(tGrid.getAttribute("ship-class"));
	var bearing = parseInt(tGrid.getAttribute("ship-bearing"));
	var ship_size;
	var criticalDamage;
	switch (sClass) {
		case SHIP_CLASS_BB:
			ship_size = 4;
			criticalDamage = 2;
			break;
		case SHIP_CLASS_CV:
			ship_size = 4;
			criticalDamage = 1;
			break;
		case SHIP_CLASS_CA:
			ship_size = 3;
			criticalDamage = 1;
			break;
		case SHIP_CLASS_DD:
			ship_size = 2;
			criticalDamage = 1;
			break;
	}
	if (bearing == SHIP_COURSE_VERTICAL) {
		for (var i = 0; i < ship_size; i++) {
			var Grid = document.getElementById(map).querySelector("[x='" + (tx + i) + "'][y='" + ty + "']");
			if (Grid.hasAttribute("hit_count")) {
				if (parseInt(Grid.getAttribute("hit_count")) >= criticalDamage) {
					if (i == (ship_size - 1)) {
						return true;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}

		}
	} else if (bearing == SHIP_COURSE_HORIZONTAL) {
		for (var i = 0; i < ship_size; i++) {
			var Grid = document.getElementById(map).querySelector("[y='" + (ty + i) + "'][x='" + tx + "']");
			if (Grid.hasAttribute("hit_count")) {
				if (parseInt(Grid.getAttribute("hit_count")) >= criticalDamage) {
					if (i == (ship_size - 1)) {
						return true;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}

		}
	}


}

function lockOnSector(evt) {
	var targetGrid = evt.target;
	var sIcon = document.createElement('img');
	sIcon.setAttribute('src', img_url.crosshair);
	sIcon.setAttribute('class', "crosshair");
	sIcon.style.height = GRID_SIZE + "px";
	sIcon.style.width = GRID_SIZE + "px";
	sIcon.style.pointerEvents = "none";
	targetGrid.appendChild(sIcon);


}

function unLockOnSector(evt) {
	var targetGrid = evt.target;
	if (targetGrid.childNodes[targetGrid.childNodes.length - 1].getAttribute("class") == "crosshair") {
		targetGrid.removeChild(targetGrid.childNodes[targetGrid.childNodes.length - 1]);
	}

}

function stopTargeting() {
	document.getElementById("counterLeft").innerHTML = player_1_ship_count;
	document.getElementById("counterLabelLeft").innerHTML = string.ship_placement_remaining;
	var grids = document.getElementById("monitorRight").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		grids[i].removeEventListener('click', fire, false);
		grids[i].removeEventListener('mouseover', lockOnSector, false);
		//grids[i].removeEventListener('mouseout', unLockOnSector, false);
	}
}
//refredh the number of ship displayed for player
function refreshPlayerPanel() {
	document.getElementById("counterLeft").innerHTML = player_1_ship_count;
	var labels = document.getElementById("dataPanelContentLeft").querySelectorAll('.ShipClassLabel');
	for (var i = 0; i < labels.length; i++) {
		switch (i) {
			case SHIP_CLASS_BB:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_1_BB_count;
				break;
			case SHIP_CLASS_CV:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_1_CV_count;
				break;
			case SHIP_CLASS_CA:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_1_CA_count;
				break;
			case SHIP_CLASS_DD:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_1_DD_count;
				break;
		}
	}
}

function nextPlayer() {
	if (gameEnded()) {
		//do nothing....the game has already ended
	} else if (acting_player == PLAYER_1) {
		acting_player = PLAYER_2;
		if (game_mode == GAME_MODE_STANDARD) {
			if (game_phase == GAME_PAHSE_AERIAL_COMBAT) {
				player_1_acted = true;
				player_2_attack_count = player_2_CV_count * 2;
				if (player_2_attack_count > 0 && !player_2_acted) {
					for (var i = 0; i < player_2_attack_count; i++) {
						attackMain();
					}
					player_2_attack_count = 0;
					nextPlayer();
				} else {
					//well both acted. let's move to next stage.
					startFleetCombat();
				}
			} else if (game_phase == GAME_PHASE_COMBAT) {
				if (!player_2_first_act_complete) {
					if (player_2_turn_counter >= player_2_ship_count) {
						player_2_first_act_complete = true;
					}
					if (player_2_turn_counter < player_2_BB_count) {
						ship_class_acting = SHIP_CLASS_BB;
						player_2_attack_count = BB_ATTACK_COUNT[player_2_engagement_form];

						if (player_2_attack_count > 0) {
							player_2_turn_counter = player_2_turn_counter + 1;
							for (var i = 0; i < player_2_attack_count; i++) {
								attackMain();
							}
							nextPlayer();
						}
					} else if (player_1_turn_counter < player_1_BB_count) {
						//the opponent still have BBs yet.skip this turn directly.
						nextPlayer();
					} else if (player_2_turn_counter < player_2_CA_count + player_2_BB_count) {
						ship_class_acting = SHIP_CLASS_CA;
						player_2_attack_count = CA_ATTACK_COUNT[player_2_engagement_form];

						if (player_2_attack_count > 0) {
							player_2_turn_counter = player_2_turn_counter + 1;
							for (var i = 0; i < player_2_attack_count; i++) {
								attackMain();
							}
							nextPlayer();
						} else {
							//extra code for cCA under t-dis(0 atk chance)
							player_2_turn_counter = player_2_turn_counter + 1;
							nextPlayer();
						}
					} else if (player_1_turn_counter < player_1_CA_count + player_1_BB_count) {
						//ditto
						nextPlayer();
					} else if (player_2_turn_counter < player_2_DD_count + player_2_CA_count + player_2_BB_count) {
						ship_class_acting = SHIP_CLASS_DD;
						player_2_attack_count = DD_ATTACK_COUNT[player_2_engagement_form];

						if (player_2_attack_count > 0) {
							player_2_turn_counter = player_2_turn_counter + 1;
							for (var i = 0; i < player_2_attack_count; i++) {
								attackMain();
							}
							nextPlayer();
						} else {
							//extra code for cCA under t-dis(0 atk chance)
							player_2_turn_counter = player_2_turn_counter + 1;
							nextPlayer();
						}
					} else if (player_1_turn_counter < player_1_DD_count + player_1_CA_count + player_1_BB_count) {
						//ditto
						nextPlayer();
					} else if (player_2_turn_counter < player_2_CV_count + player_2_DD_count + player_2_CA_count + player_2_BB_count) {
						ship_class_acting = SHIP_CLASS_CV;
						player_2_attack_count = CV_ATTACK_COUNT[player_2_engagement_form];

						if (player_2_attack_count > 0) {
							player_2_turn_counter = player_2_turn_counter + 1;
							for (var i = 0; i < player_2_attack_count; i++) {
								attackMain();
							}
							nextPlayer();
						}

					} else if (player_1_turn_counter < player_1_CV_count + player_1_DD_count + player_1_CA_count + player_1_BB_count) {
						//ditto
						nextPlayer();
					} else {
						nextPlayer();
					}
				} else {
					if (player_2_turn_counter <= player_2_BB_count) {
						ship_class_acting = SHIP_CLASS_BB;
						player_2_attack_count = BB_ATTACK_COUNT[player_2_engagement_form];
					} else if (player_2_turn_counter <= player_2_CA_count + player_2_BB_count) {
						ship_class_acting = SHIP_CLASS_CA;
						player_2_attack_count = CA_ATTACK_COUNT[player_2_engagement_form];
					} else if (player_2_turn_counter <= player_2_DD_count + player_2_CA_count + player_2_BB_count) {
						ship_class_acting = SHIP_CLASS_DD;
						player_2_attack_count = DD_ATTACK_COUNT[player_2_engagement_form];
					} else if (player_2_turn_counter <= player_2_CV_count + player_2_DD_count + player_2_CA_count + player_2_BB_count) {
						ship_class_acting = SHIP_CLASS_CV;
						player_2_attack_count = CV_ATTACK_COUNT[player_2_engagement_form];
					}

					if (player_2_attack_count > 0) {
						for (var i = 0; i < player_2_attack_count; i++) {
							attackMain();
						}
						player_2_attack_count = 0;
					}
					player_2_turn_counter = player_2_turn_counter + 1;
					if (player_2_turn_counter > player_2_ship_count) {
						player_2_acted = true;
					}
					if (player_2_acted && player_1_acted) {
						player_2_turn_counter = 0;
						player_1_turn_counter = 0;
						player_2_acted = false;
						player_1_acted = false;
					}
					nextPlayer();
				}
			}
		}
	} else {
		acting_player = PLAYER_1;
		if (game_mode == GAME_MODE_STANDARD) {
			if (game_phase == GAME_PAHSE_AERIAL_COMBAT) {
				player_2_acted = true;
				player_1_attack_count = player_1_CV_count * 2;
				if (player_1_attack_count > 0 && !player_1_acted) {
					beginTargeting();
				} else {
					startFleetCombat();
				}

			} else if (game_phase == GAME_PHASE_COMBAT) {
				if (!player_1_first_act_complete) {
					if (player_1_turn_counter >= player_1_ship_count) {
						player_1_first_act_complete = true;
					}
					if (player_1_turn_counter < player_1_BB_count) {
						ship_class_acting = SHIP_CLASS_BB;
						player_1_attack_count = BB_ATTACK_COUNT[player_1_engagement_form];

						if (player_1_attack_count > 0) {
							player_1_turn_counter = player_1_turn_counter + 1;
							beginTargeting();
						}
					} else if (player_2_turn_counter < player_2_BB_count) {
						//the opponent still have BBs yet.skip this turn directly.
						nextPlayer();
					} else if (player_1_turn_counter < player_1_CA_count + player_1_BB_count) {
						ship_class_acting = SHIP_CLASS_CA;
						player_1_attack_count = CA_ATTACK_COUNT[player_1_engagement_form];

						if (player_1_attack_count > 0) {
							player_1_turn_counter = player_1_turn_counter + 1;
							beginTargeting();
						} else {
							//extra code for cCA under t-dis(0 atk chance)
							player_1_turn_counter = player_1_turn_counter + 1;
							nextPlayer();
						}
					} else if (player_2_turn_counter < player_2_CA_count + player_2_BB_count) {
						//ditto
						nextPlayer();
					} else if (player_1_turn_counter < player_1_DD_count + player_1_CA_count + player_1_BB_count) {
						ship_class_acting = SHIP_CLASS_DD;
						player_1_attack_count = DD_ATTACK_COUNT[player_1_engagement_form];

						if (player_1_attack_count > 0) {
							player_1_turn_counter = player_1_turn_counter + 1;
							beginTargeting();
						} else {
							//extra code for cCA under t-dis(0 atk chance)
							player_1_turn_counter = player_1_turn_counter + 1;
							nextPlayer();
						}
					} else if (player_2_turn_counter < player_2_DD_count + player_2_CA_count + player_2_BB_count) {
						//ditto
						nextPlayer();
					} else if (player_1_turn_counter < player_1_CV_count + player_1_DD_count + player_1_CA_count + player_1_BB_count) {
						ship_class_acting = SHIP_CLASS_CV;
						player_1_attack_count = CV_ATTACK_COUNT[player_1_engagement_form];

						if (player_1_attack_count > 0) {
							player_1_turn_counter = player_1_turn_counter + 1;
							beginTargeting();
						}

					} else if (player_2_turn_counter < player_2_CV_count + player_2_DD_count + player_2_CA_count + player_2_BB_count) {
						//ditto
						nextPlayer();
					} else {
						nextPlayer();
					}
				} else {
					if (player_1_turn_counter <= player_1_BB_count) {
						ship_class_acting = SHIP_CLASS_BB;
						player_1_attack_count = BB_ATTACK_COUNT[player_1_engagement_form];
					} else if (player_1_turn_counter <= player_1_CA_count + player_1_BB_count) {
						ship_class_acting = SHIP_CLASS_CA;
						player_1_attack_count = CA_ATTACK_COUNT[player_1_engagement_form];
					} else if (player_1_turn_counter <= player_1_DD_count + player_1_CA_count + player_1_BB_count) {
						ship_class_acting = SHIP_CLASS_DD;
						player_1_attack_count = DD_ATTACK_COUNT[player_1_engagement_form];
					} else if (player_1_turn_counter <= player_1_CV_count + player_1_DD_count + player_1_CA_count + player_1_BB_count) {
						ship_class_acting = SHIP_CLASS_CV;
						player_1_attack_count = CV_ATTACK_COUNT[player_1_engagement_form];
					}
					player_1_turn_counter = player_1_turn_counter + 1;
					if (player_1_turn_counter > player_1_ship_count) {
						player_1_acted = true;
					}
					if (player_2_acted && player_1_acted) {
						player_2_turn_counter = 0;
						player_1_turn_counter = 0;
						player_2_acted = false;
						player_1_acted = false;
					}
					if (player_1_attack_count > 0) {
						beginTargeting();
					} else {
						nextPlayer();
					}
				}
			}
		}
	}
}

function gameEnded() {
	//see if any one fleet lose all their ships
	if (player_1_ship_count <= 0) {
		//TODO use HTML5 dialog instead of alert
		alert(string.defeat);
		refreshPlayerPanel();
		var labels = document.getElementById("dataPanelContentRight").querySelectorAll('.ShipClassLabel');
		for (var i = 0; i < labels.length; i++) {
			switch (i) {
				case SHIP_CLASS_BB:
					labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_BB_count;
					break;
				case SHIP_CLASS_CV:
					labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_CV_count;
					break;
				case SHIP_CLASS_CA:
					labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_CA_count;
					break;
				case SHIP_CLASS_DD:
					labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_DD_count;
					break;
			}
		}
		return true;
	} else if (player_2_ship_count <= 0) {
		alert(string.victory);
		refreshPlayerPanel();
		var labels = document.getElementById("dataPanelContentRight").querySelectorAll('.ShipClassLabel');
		for (var i = 0; i < labels.length; i++) {
			switch (i) {
				case SHIP_CLASS_BB:
					labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_BB_count;
					break;
				case SHIP_CLASS_CV:
					labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_CV_count;
					break;
				case SHIP_CLASS_CA:
					labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_CA_count;
					break;
				case SHIP_CLASS_DD:
					labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_DD_count;
					break;
			}
		}
		return true;
	} else {
		return false;
	}
}

function surrender(evt) {
	//TODO replace confirm with html 5 dialog
	if (confirm(string.surrender_confirm)) {
		//scuttle all ships to trigger lose effect
		player_1_ship_count = 0;
		nextPlayer();
	} else {
		//do nothing
	}

}


window.onload = function() {
	setUI();
}