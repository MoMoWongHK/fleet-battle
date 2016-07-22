var counter_text_left;
var counter_label_left;
var counter_text_right;
var counter_label_right;

//setup the basic ui
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
  document.getElementById("dataPanelLeft").style.height = GRID_SIZE*MAP_SIZE+MAP_SIZE*2+"px";
  document.getElementById("dataPanelRight").style.height = GRID_SIZE*MAP_SIZE+MAP_SIZE*2+"px";

  //set up the data Panel



}

window.onload = function() {
  setUI();
}
