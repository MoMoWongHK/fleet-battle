var MAP_SIZE = 12;
var GRID_SIZE = 35;



function setUI(){

  var monitors = document.querySelectorAll('.Monitor');

  for (var i = 0; i < monitors.length; i++) {
    monitors[i].style.width = GRID_SIZE*MAP_SIZE+MAP_SIZE*2+"px";
    monitors[i].style.height = GRID_SIZE*MAP_SIZE+MAP_SIZE*2+"px";
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


}

window.onload = function() {
  setUI();
}
