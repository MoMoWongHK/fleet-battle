
var counter_text_left;
var counter_label_left;
var counter_text_right;
var counter_label_right;

var game_phase = 0;
var GAME_PHASE_SHIP_PLACEMENT = 0;
var GAME_PAHSE_AERIAL_COMBAT = 1;
var GAME_PHASE_COMBAT = 2;

//game stats field for each player
var player_1_ship_set = 0;
var player_1_CV_count = 0;
var player_1_BB_count = 0;
var player_1_CA_count = 0;
var player_1_DD_count = 0;

var player_2_ship_set = 0;
var player_2_CV_count = 0;
var player_2_BB_count = 0;
var player_2_CA_count = 0;
var player_2_DD_count = 0;

/**
 * Set up the basic ui for the game
 */
function setUI(){
  //set up the main moniters
  var monitors = document.querySelectorAll('.Monitor');
  for (var i = 0; i < monitors.length; i++) {
    //set the map size
    monitors[i].style.width = GRID_SIZE*MAP_SIZE+MAP_SIZE*2+"px";
    monitors[i].style.height = GRID_SIZE*MAP_SIZE+MAP_SIZE*2+"px";
    //create a grid of MAP_SIZE * MAP_SIZE
    for (var j = 0; j < MAP_SIZE; j++) {
  			for (var k = 0; k < MAP_SIZE; k++) {
				var grid = document.createElement('div');
				grid.setAttribute('x', j);
				grid.setAttribute('y', k);
				grid.setAttribute('class', 'monitorGrid');
        var topPosition = j * GRID_SIZE;
		    var leftPosition = i * GRID_SIZE;
		    grid.style.top = topPosition + 'px';
		    grid.style.left = leftPosition + 'px';
				monitors[i].appendChild(grid);
			}
		}
	}
  //set up the data Panel

	document.getElementById("dataPanelLeft").style.height = GRID_SIZE*MAP_SIZE+MAP_SIZE*2+"px";
	document.getElementById("dataPanelRight").style.height = GRID_SIZE*MAP_SIZE+MAP_SIZE*2+"px";
	if(game_phase == GAME_PHASE_SHIP_PLACEMENT){
		//left panel
		var label = document.createElement('p');
		label.innerHTML = string.ship_placement_remaining;
		counter_label_left = label;
		document.getElementById("dataPanelLeft").appendChild(label);
		var counter = document.createElement('p');
		counter.innerHTML = MAX_SHIP_COUNT;
		counter.setAttribute('class', 'Counter');
		counter_text_left = counter;
		document.getElementById("dataPanelLeft").appendChild(counter);
		//determine the ship iocn set to be used by each player
		var shipset = getRandomInt(0,1);
		player_1_ship_set = shipset;
		for (var i = 0; i < string.ship_classes.length; i++) {
			var sLabel = document.createElement('p');
			sLabel.setAttribute('class', 'ShipClassLabel');
			sLabel.innerHTML = string.ship_classes[i];
			document.getElementById("dataPanelLeft").appendChild(sLabel);
			var sIcon = document.createElement('img');
			sIcon.setAttribute('class', 'ShipIcons');
			sIcon.setAttribute('src', img_url.ship_icons[player_1_ship_set][i]);
			document.getElementById("dataPanelLeft").appendChild(sIcon);
		}
		//right Panel
		var label2 = document.createElement('p');
		label2.innerHTML = string.ship_placement_remaining;
		counter_label_right = label2;
		document.getElementById("dataPanelRight").appendChild(label2);
		var counter2 = document.createElement('p');
		counter2.innerHTML = MAX_SHIP_COUNT;
		counter2.setAttribute('class', 'Counter');
		counter_text_left = counter2;
		document.getElementById("dataPanelRight").appendChild(counter2);
		//use a different ship icon set than player 1
		while (player_2_ship_set == player_1_ship_set) {
			var shipset = getRandomInt(0,2);
			player_2_ship_set = shipset;
		}
		for (var i = 0; i < string.ship_classes.length; i++) {
			var sLabel2 = document.createElement('p');
			sLabel2.setAttribute('class', 'ShipClassLabel');
			sLabel2.innerHTML = string.ship_classes[i];
			document.getElementById("dataPanelRight").appendChild(sLabel2);
			var sIcon2 = document.createElement('img');
			sIcon2.setAttribute('class', 'ShipIconsEnemy');
			sIcon2.setAttribute('src', img_url.ship_icons[player_2_ship_set][i]);
			document.getElementById("dataPanelRight").appendChild(sIcon2);
		}

	}


}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onload = function() {
  setUI();
}
