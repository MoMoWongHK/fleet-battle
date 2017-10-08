var gameLang = 'EN' ;
var game_mode = 0;
var GAME_MODE_SKIRMISH = 0;
var GAME_MODE_CLASSIC = 1;
var GAME_MODE_INTERCEPT = 2;
var GAME_MODE_BREAKTHROUGH = 3;
var GAME_MODE_CONVOY = 4;

var GAME_DIFF_EASY = 0;
var GAME_DIFF_NORMAL = 1;
var GAME_DIFF_HARD = 2;
var GAME_DIFF_INSANE = 3;

/*implement later
function searchTextByLanguage(domElementIDName ){
    var domElementIDName = domElementIDName;
    var langFile = JSON.parse('string' + game_lang) ;
    return  stringEN[domElementIDName];
}
*/
function onSelectedModeChanged(){
    var option = $('#modeSelect option:selected').val();
    switch (parseInt(option)){
        case GAME_MODE_SKIRMISH:
            game_mode = GAME_MODE_SKIRMISH;
            $('#randomMap').prop('disabled', false);
            break;
        case GAME_MODE_INTERCEPT:
            game_mode = GAME_MODE_INTERCEPT;
            $('#randomMap').prop('disabled', false);
            break;
        case GAME_MODE_BREAKTHROUGH:
            game_mode = GAME_MODE_BREAKTHROUGH;
            $('#randomMap').prop('disabled', false);
            break;
        case GAME_MODE_CONVOY:
            game_mode = GAME_MODE_CONVOY;
            $('#randomMap').prop('disabled', false);
            break;
        case GAME_MODE_CLASSIC:
            game_mode = GAME_MODE_CLASSIC;
            $('#randomMap').prop('disabled', true);
            RANDOM_MAP_SIZE = false;
    }
}

function fillText(index , e){

    var domElement = $(e);
    var domElementIDName = domElement.attr('id');
    console.log(domElementIDName);
    if(! domElementIDName.includes(".")){
        var text = stringEN[domElementIDName];
    }
    else{
        var arr = domElementIDName.split(".");
        var text = stringEN[arr[0]][arr[1]] ;
    }

    if(text != undefined) {
        domElement.html(text);
    }
}


function initGame(){
    var option = $('input[type="radio"][name="diff"]:checked').val();
    switch (parseInt(option)){
        case GAME_DIFF_EASY:
            //AI config
            break;
        case GAME_DIFF_NORMAL:

            break;
        case GAME_DIFF_HARD:

            break;
        case GAME_DIFF_INSANE:

    }

    if($('#randomMap').is(':checked')){
        RANDOM_MAP_SIZE = true;
    }
    else{
        RANDOM_MAP_SIZE = false;
    }

    if($('#sound').is(':checked')){
        SOUND_ENABLED = true;
    }
    else{
        SOUND_ENABLED = false;
    }
    readyGame();
}
$(document).ready(function() {
    $('#level-selecting').modal('show');
    $('#myModal').modal('show');
    $('#modeSelect').change(function(){
        onSelectedModeChanged();
    });

    $('*[id]').each(function(index , e){
        fillText(index , e);
    });

    $('#gameSetButton').click(function(){
        initGame();
    });
});