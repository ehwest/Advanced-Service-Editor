// Contains functions for the buttons

window.rows = window.initialRows = 14, window.cols = window.initialCols = 8; //Define initial rows and cols


//Create new project and sets up grid lines
function newButton(){
	bootbox.confirm({
		size:'small',
		message:"<img src='triangle.png' height=15 width=15 style='margin-right:10px'>***This will erase everything***",
		callback: function(result){
			if (result == true){
				newProject();
			}
		}
	});
	
}

function newProject() {
	resetTitleBar();
	$( "#start" ).removeClass( "glow" );
	document.getElementById("numbers").innerHTML ='';
	document.getElementById("lines").innerHTML ='';
	document.getElementById("nodeChildrenDroppedOffHere").innerHTML ='';
	document.getElementById("arrowChildrenDroppedOffHere").innerHTML ='';
	document.getElementById("noteChildrenDroppedOffHere").innerHTML ='';
	deletedNodes.length = 0;
	deletedArrows.length = 0;
	deletedNotes.length = 0;
	document.getElementById("trash").src = "trashCan.gif";
	nodeArr=[];
	arrowArr=[];
	noteArr=[];
	for (i = 1; i<=rows; i++) {
		addRow(i);
	}	
}

//Adds height
function addHeight() {
	rows++; //adds one row per button press
	document.getElementById('grid').style.height = 91.5 + (rows-initialRows)*6 + '%'; //Increases height by 6%
	currentHeight = $('.verticalLine').height();
	newHeight = currentHeight + gridPitchy;
	$('.verticalLine').height(newHeight);
	addRow();
}
function addRow(){ //Adds row lines
	document.getElementById("numbers").innerHTML +='<li style = "margin-left:4em;" type="1"></li><br style="line-height:' + Math.floor((gridPitchy+6)/2) + 'px;">';
	document.getElementById("lines").innerHTML +='<hr class = "dottedLine" /><br><br style="line-height:' + Math.floor((gridPitchy-2)/2) + 'px;">';
}


//Adds width
function addWidth() {
	cols++; //adds 2 cols per button press
	document.getElementById('grid').style.width = 98 + (cols-initialCols)*12 + '%'; //Increases grid width % by 5% right
	document.getElementById('horRows').style.width = 81 + (cols-initialCols)*12 + '%'; //Increases line width % by 5% right
}


/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/