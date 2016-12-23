
var game_mode = 0;
var GAME_MODE_SKIRMISH = 0;
var GAME_MODE_CLASSIC = 1;
var GAME_MODE_INTERCEPT = 2;
var GAME_MODE_BREAKTHROUGH = 3;

function showStartGameSetting(){
	var box = document.getElementById('settingBox');
	box.style.display = "block";

	if(document.getElementById('diff-easy').checked) {
		AI_CONFIG = AI_CONFIGURATION_BASIC;
	}else if(document.getElementById('diff-normal').checked) {
		AI_CONFIG = AI_CONFIGURATION_INTERMEDIATE;
	}

	if(document.getElementById('randomMap').checked) {
		RANDOM_MAP_SIZE = true;
	}else{
		RANDOM_MAP_SIZE = false;
	}

	var readyButton = document.getElementById("gameSetButton");
	readyButton.innerHTML = string.ready;
	readyButton.addEventListener('click', readyGame, false);
}


window.onload = function() {
	//TODO add mode selection and other start game settings
	showStartGameSetting();
}

