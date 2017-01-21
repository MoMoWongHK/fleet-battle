// global variable for game resources, in form of javascript json.
//string resources
var string = {
	"game_config_error": "Game not properly configured. Check your configuration file.",
	"game_mode_label":"Scenario :",
	"game_mode":[
		"Skirmish",
		"Classic",
		"Interception",
		"Raid"	
	],
	"current_stage": "Current Stage",
	"ship_placement_remaining": "Remaining ship",
	"ship_classes": [
		"Battleship",
		"Aircraft Carrier",
		"Cruiser",
		"Destroyer"
	],
	"pending": "Pending...",
	"rotate": "Rotate ship",
	"assemble_fleet": "Assemble Fleet",
	"start_battle": "Start Battle!",
	"no_ship_prompt": "You cannot enter a battle with a ghost fleet!",
	"surrender": "Surrender your ships",
	"game_objective_label": "Objective : ",
	"game_objective": [
		"Destroy all enemy vessels"
	],
	"game_stage_aerial": "AERIAL COMBAT",
	"game_stage_artillery": "FLEET ACTION",
	"form_of_engagement_label": "Form of Engagement",
	"form_of_engagement": [
		"Parallel",
		"Head On",
		"T - Advantage",
		"T - Disadvantage"
	],
	"turn_counter_label":"Time Remaining: ",
	"attack_remaining": "Attack Remaining",
	"surrender_confirm": "Are you sure you want to surrender your ship? You will be treated as defeated!",
	"victory": "VICTORY",
	"victory_description_standard": "All enemy vessels destroyed!",
	"victory_description_intercept": "Target vessel destroyed!",
	"defeat": "DEFEAT",
	"defeat_description_standard": "Your fleet was annihilated.",
	"defeat_description_intercept": "The enemy had reached their destination.",
	"new_game":"Proceed into next battle",
	"new_game_confirm":"Are you sure you want to start a new battle?",
	"action_prompt_player":"Awaiting Orders",
	"action_prompt_enemy":"INCOMING",
	"ready":"Ready"
}


//image resources
var img_url = {
	"crosshair": "img/tiles/crosshair.png",
	"ship_icons": [

		["img/ships/jp/BB.png",
			"img/ships/jp/CV.png",
			"img/ships/jp/CA.png",
			"img/ships/jp/DD.png"
		],

		["img/ships/us/BB.png",
			"img/ships/us/CV.png",
			"img/ships/us/CA.png",
			"img/ships/us/DD.png"
		],

		["img/ships/uk/BB.png",
			"img/ships/uk/CV.png",
			"img/ships/uk/CA.png",
			"img/ships/uk/DD.png"
		]



	],
	"ship_tiles": [
		[
			[
				"img/tiles/BB/sector_1_normal.png",
				"img/tiles/BB/sector_2_normal.png",
				"img/tiles/BB/sector_3_normal.png",
				"img/tiles/BB/sector_4_normal.png",
			],
			[
				"img/tiles/BB/sector_1_hit.png",
				"img/tiles/BB/sector_2_hit.png",
				"img/tiles/BB/sector_3_hit.png",
				"img/tiles/BB/sector_4_hit.png",
			],
			[
				"img/tiles/BB/sector_1_sunk.png",
				"img/tiles/BB/sector_2_sunk.png",
				"img/tiles/BB/sector_3_sunk.png",
				"img/tiles/BB/sector_4_sunk.png",
			]
		],
		[
			[
				"img/tiles/CV/sector_1_normal.png",
				"img/tiles/CV/sector_2_normal.png",
				"img/tiles/CV/sector_3_normal.png",
				"img/tiles/CV/sector_4_normal.png",
			],
			[
				"img/tiles/CV/sector_1_hit.png",
				"img/tiles/CV/sector_2_hit.png",
				"img/tiles/CV/sector_3_hit.png",
				"img/tiles/CV/sector_4_hit.png",
			],
			[
				"img/tiles/CV/sector_1_sunk.png",
				"img/tiles/CV/sector_2_sunk.png",
				"img/tiles/CV/sector_3_sunk.png",
				"img/tiles/CV/sector_4_sunk.png",
			]
		],
		[
			[
				"img/tiles/CA/sector_1_normal.png",
				"img/tiles/CA/sector_2_normal.png",
				"img/tiles/CA/sector_3_normal.png"
			],
			[
				"img/tiles/CA/sector_1_hit.png",
				"img/tiles/CA/sector_2_hit.png",
				"img/tiles/CA/sector_3_hit.png"
			],
			[
				"img/tiles/CA/sector_1_sunk.png",
				"img/tiles/CA/sector_2_sunk.png",
				"img/tiles/CA/sector_3_sunk.png"
			]
		],
		[
			[
				"img/tiles/DD/sector_1_normal.png",
				"img/tiles/DD/sector_2_normal.png"
			],
			[
				"img/tiles/DD/sector_1_hit.png",
				"img/tiles/DD/sector_2_hit.png"
			],
			[
				"img/tiles/DD/sector_1_sunk.png",
				"img/tiles/DD/sector_2_sunk.png"
			]

		]
	]
}

var sfx_url={
	"gun_fire":"sound/sfx/gunfire.m4a"
}