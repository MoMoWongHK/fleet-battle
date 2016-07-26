var counter_text_left;
var counter_label_left;
var counter_text_right;
var counter_label_right;

var game_phase = 0;
var GAME_PHASE_SHIP_PLACEMENT = 0;
var GAME_PAHSE_AERIAL_COMBAT = 1;
var GAME_PHASE_COMBAT = 2;

var SHIP_COURSE_VERICAL = 0;
var SHIP_COURSE_HORIZONTAL = 1;

var SHIP_CLASS_BB = 0;
var SHIP_CLASS_CV = 1;
var SHIP_CLASS_CA = 2;
var SHIP_CLASS_DD = 3;

var ship_class_placing;
var ship_course_placing = 0;
var ship_size_placing;

//game stats field for each player
var player_1_ship_set = 0;
var player_1_ship_count = 0;
var player_1_CV_count = 0;
var player_1_BB_count = 0;
var player_1_CA_count = 0;
var player_1_DD_count = 0;

var player_2_ship_set = 0;
var player_2_ship_count = 0;
var player_2_CV_count = 0;
var player_2_BB_count = 0;
var player_2_CA_count = 0;
var player_2_DD_count = 0;

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
	//set up the data Panel

	document.getElementById("dataPanelLeft").style.height = GRID_SIZE * MAP_SIZE + MAP_SIZE * 2 + "px";
	document.getElementById("dataPanelRight").style.height = GRID_SIZE * MAP_SIZE + MAP_SIZE * 2 + "px";
	if (game_phase == GAME_PHASE_SHIP_PLACEMENT) {
		//left panel
		var label = document.createElement('p');
		label.innerHTML = string.ship_placement_remaining;
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
			sIcon.setAttribute('class', 'ShipIcons ShipIconsSelectable');
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
			sIcon2.setAttribute('class', 'ShipIconsEnemy ShipIcons');
			sIcon2.setAttribute('src', img_url.ship_icons[player_2_ship_set][i]);
			document.getElementById("dataPanelContentRight").appendChild(sIcon2);

		}
		startShipPlacement();

	}


}

function startShipPlacement() {
	//hide the panel for player 2 first
	document.getElementById("dataPanelContentRight").style.display = 'none';
	var p = document.createElement('p');
	p.innerHTML = string.pending;
	p.setAttribute('class', 'DataPanelOverlay');
	document.getElementById("dataPanelRight").appendChild(p);
	//add onclicklistener for the ship icons
	var ships = document.querySelectorAll('.ShipIconsSelectable');
	for (var i = 0; i < ships.length; i++) {
		var t = i;
		ships[i].addEventListener("click", onShipIconSelected, false);
	}
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
	if (ship_course_placing == SHIP_COURSE_VERICAL) {
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
		if (ship_course_placing == SHIP_COURSE_VERICAL) {
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
		if (ship_course_placing == SHIP_COURSE_VERICAL) {
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
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (shipPlacable(targetX, targetY)) {
		if (ship_course_placing == SHIP_COURSE_VERICAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[x='" + (targetX + i) + "'][y='" + targetY + "']");
				tGrid.style.backgroundColor = 'black';
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", ship_class_placing);
				tGrid.removeEventListener('click', placeShip, false);
				tGrid.removeEventListener('mouseover', projectShip, false);
				tGrid.removeEventListener('mouseout', unProjectShip, false);
			}
		} else if (ship_course_placing == SHIP_COURSE_HORIZONTAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[y='" + (targetY + i) + "'][x='" + targetX + "']");
				tGrid.style.backgroundColor = 'black';
				tGrid.removeEventListener('click', placeShip, false);
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", ship_class_placing);
				tGrid.removeEventListener('mouseover', projectShip, false);
				tGrid.removeEventListener('mouseout', unProjectShip, false);
			}
		}
		player_1_ship_count = player_1_ship_count +1;
		document.getElementById("counterLeft").innerHTML = parseInt(counter_text_left.innerHTML) - 1;
		if (player_1_ship_count >= MAX_SHIP_COUNT) {
			stopPlayerShipPlacement();
		}
	}

}

function stopPlayerShipPlacement(){
	//disable ship selector
	var ships = document.querySelectorAll('.ShipIconsSelectable');
	for (var i = 0; i < ships.length; i++) {
		var t = i;
		ships[i].removeEventListener("click", onShipIconSelected, false);
		//remove hover effect
		var classes = ships[i].getAttribute('class');
		classes = classes.replace(' ShipIconsSelectable', '');
		ships[i].setAttribute('class', classes);
	}
	//disable grids
	var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		grids[i].removeEventListener('click', placeShip, false);
		grids[i].removeEventListener('mouseover', projectShip, false);
		grids[i].removeEventListener('mouseout', unProjectShip, false);
	}
	if(true){
		shipPlacementBasic();
	}

}


window.onload = function() {
	setUI();
}
