var game_mode = 0;
var GAME_MODE_SKIRMISH = 0;
var GAME_MODE_CLASSIC = 1;
var GAME_MODE_INTERCEPT = 2;
var GAME_MODE_BREAKTHROUGH = 3;

function showStartGameSetting() {
	var box = document.getElementById('settingBox');
	box.style.display = "block";

	document.getElementById("modeSelect").onchange = function() {
		onSelectedModeChanged();
	};

	var readyButton = document.getElementById("gameSetButton");
	readyButton.innerHTML = string.ready;
	readyButton.addEventListener('click', function() {
		if (document.getElementById('diff-easy').checked) {
			ai_config = AI_CONFIGURATION_BASIC;
		} else if (document.getElementById('diff-normal').checked) {
			ai_config = AI_CONFIGURATION_INTERMEDIATE;
		}

		if (document.getElementById('randomMap').checked) {
			RANDOM_MAP_SIZE = true;
		} else {
			RANDOM_MAP_SIZE = false;
		}
		readyGame();
	}, false);
}

function onSelectedModeChanged() {
	var o = document.getElementById("modeSelect");
	switch (parseInt(o.options[o.selectedIndex].value)) {
		case GAME_MODE_SKIRMISH:
			game_mode = GAME_MODE_SKIRMISH;
			document.getElementById('randomMap').disabled = false;
			break;
		case GAME_MODE_INTERCEPT:
			game_mode = GAME_MODE_INTERCEPT;
			document.getElementById('randomMap').disabled = false;
			break;
		case GAME_MODE_CLASSIC:
			game_mode = GAME_MODE_CLASSIC;
			document.getElementById('randomMap').disabled = true;
			RANDOM_MAP_SIZE = false;
	}

}


window.onload = function() {
	//TODO add mode selection and other start game settings
	showStartGameSetting();
};