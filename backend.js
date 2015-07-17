//Contains functions to save/export information, load/import from files, and update the titlebar

var m;
var doc;
var linePosition;
var lineSpacing;
function saveDialog (){
	var now = new Date;
	var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
             now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
	var canvasWidth = $("#grid").width() - $("#sideBar").width();

	m = "";
	m +=  '{ "diagram": \n';
	m += '{ "created": "' + utc_timestamp +   '",\n';
	m += '"rows": "' + rows + '",\n';
	m += '"cols": "' + cols + '",\n';
	m += '"gridPitchy": "' + gridPitchy + '",\n';
	m += '"canvasHeight": "' + $("#grid").height() + '",\n';
	m += '"canvasWidth": "' + canvasWidth + '",\n';
	m += '"elements": {"nodes": [\n';
	nodeArr.forEach(saveNodeArrayElements);
	m +=  '],\n "arrows": [\n';
	arrowArr.forEach(saveArrowArrayElements);
	m +=  '],\n "notes": [\n';
	noteArr.forEach(saveNoteArrayElements);
	m += "]}}}";
	if (filename.slice(-3) != "txt"){
		filename += ".txt";
	}
	var n = JSON.parse(m);
	bootbox.dialog({
		backdrop:true,
		animate:false,
		onEscape: function() {},
		title: 'Save File<button style = "margin-left:10px;display:inline;" onclick="alert(m);">Source</button>',
		size: 'large',		
		message: '<p><h4>Save locally to hard drive : </h4></p>'+
		'<br>Filename: <input id="saveLocalFileName" type="text" value='+filename+'><button style = "display:inline;" onclick="saveLocalFile($(\'#saveLocalFileName\').val())">Confirm!</button></div>'+
		'<br><hr>'+
		'<p><h4>Save to database : </h4></p>'+
		'<br>Filename: <input id="saveDBFileName" type="text" value='+filename+'><button style = "display:inline;" onclick="saveDBFile($(\'#saveDBFileName\').val())">Confirm!</button></div>'
		

	});
	//Let enter (13) submit the text
	$("#saveLocalFileName").keyup( function(e) {
		if (e.keyCode == 13){
			filename = $("#saveLocalFileName").val();
			saveLocalFile(filename);
		}
	});
	$("#saveDBFileName").keyup( function(e) {
		if (e.keyCode == 13){
			filename = $("#saveDBFileName").val();
			saveDBFile(filename);
		}
	});
	$("#saveLocalFileName").click(function(){
		$("#saveLocalFileName").selectRange(0,filename.length-4);
	});
	$("#saveDBFileName").click(function(){
		$("#saveLocalFileName").selectRange(0,filename.length-4);
	});
}


function saveNodeArrayElements(element, index, array) {
	var myElement = document.getElementById(element[1]);
	var infobox = "{\n";
	infobox += '"id":"' + myElement.id + '",\n';
	infobox += '"data_x": "' + myElement.getAttribute('data_x') + '",\n';
	infobox += '"data_y": "' + myElement.getAttribute('data_y') + '",\n';
	infobox += '"width": "' + $(myElement).width() + '",\n';
	infobox += '"innerText": "' + $.trim(myElement.innerText) + '"\n';
	infobox += "}";
	if(index<array.length-1) infobox += ",";
	m +=  infobox;
}
function saveArrowArrayElements(element, index, array) {
	var myElement = document.getElementById(element[1]);
	var infobox = "{\n";
	infobox += '"id": "' + myElement.id + '",\n';
	infobox += '"data_x": "' + myElement.getAttribute('data_x') + '",\n';
	infobox += '"data_y": "' + myElement.getAttribute('data_y') + '",\n';
	infobox += '"width": "' + $(myElement).width() + '",\n';
	infobox += '"fromNodeID": "' + determineNodeStart(myElement.id) + '",\n';
	infobox += '"toNodeID": "' + determineNodeEnd(myElement.id) + '",\n';
	infobox += '"direction": "' + myElement.getAttribute('direction') + '",\n';
	infobox += '"innerText": "' + $.trim(myElement.innerText) + '"\n';
	infobox += "}";
	if(index<array.length-1) infobox += ",";
	m  += infobox;
}
function saveNoteArrayElements(element, index, array) {
	var myElement = document.getElementById(element[1]);
	var infobox = "{\n";
	infobox += '"id":"' + myElement.id + '",\n';
	infobox += '"data_x": "' + myElement.getAttribute('data_x') + '",\n';
	infobox += '"data_y": "' + myElement.getAttribute('data_y') + '",\n';
	infobox += '"width": "' + $(myElement).width() + '",\n';
	infobox += '"height": "' + $(myElement).height() + '",\n';
	infobox += '"innerText": "' + $.trim(myElement.innerText) + '"\n';
	infobox += "}";
	if(index<array.length-1) infobox += ",";
	m +=  infobox;
}

//Creates blob and exports to downloads folder
function saveLocalFile(name) {
	bootbox.hideAll();
	
	var textToWrite = m
	var blob = new Blob([m], {type: "text/plain;charset=utf-8"});
	
	var downloadLink = document.createElement("a");
	if (name.slice(-3) != "txt"){
		name += ".txt";
	}
	filename = name;
	downloadLink.download = name;
	downloadLink.innerHTML="Download File";
	downloadLink.href = window.webkitURL.createObjectURL(blob);
	downloadLink.click();
	

}

//Creates blob and exports to database
function saveDBFile(name) {
	bootbox.hideAll();
	
	var textToWrite = m
	var blob = new Blob([m], {type: "text/plain;charset=utf-8"});
	
	//add .txt if not already present
	if (name.slice(-3) != "txt"){
		name += ".txt";
	}
	//Earle: the text to write is stored in the var textToWrite. To save locally, I had to convert this to a blob file
	// so that is provided as well if needed

	

}


//LOADING

function loadDialog (){
	//load table into var
	var message = null;
	$.get('loadableList.htm')
		.success(function(data){
			var message = data;
			bootbox.dialog({
				backdrop:true,
				animate:false,
				onEscape: function() {},
				title: 'Load File',
				size: 'large',		
				message: '<p><h4>Load locally from hard drive : </h4></p>'+
				'<input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(0);">Replace!</button><button style = "display:inline;" onclick="loadFile(1);">Append!</button><button style = "margin-left:10px;display:inline;" onclick="loadFile(2);">Source</button></div>'+
				'<br><hr>'+
				'<p><h4>Load from database : </h4></p>'+message		
			});
		},"text")
		.error(function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR+' ' +textStatus+' ' +errorThrown);
			var message = '<i>Error: Database not detected or configured</i>';
			bootbox.dialog({
				backdrop:true,
				animate:false,
				onEscape: function() {},
				title: 'Load File',
				size: 'large',		
				message: '<p><h4>Load locally from hard drive : </h4></p>'+
				'<input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(0);">Replace!</button><button style = "display:inline;" onclick="loadFile(1);">Append!</button><button style = "margin-left:10px;display:inline;" onclick="loadFile(2);">Source</button></div>'+
				'<br><hr>'+
				'<p><h4>Load from database : </h4></p>'+message		
			});
		});

}



function loadFile(typeOfLoad,preloadedFile) {
	if(preloadedFile==null){
		var file = document.getElementById("fileToLoad").files[0];
		//console.log(file);
		var reader = new FileReader();
		reader.onload = recievedText;
		reader.readAsText(file);
	}
	else {
		//GET TEXT FROM preloadedFile AND STORE TO importedText
		$.get(preloadedFile,function(data){
			var importedText = data;
			recievedText(importedText);
		});
	}

	function recievedText (importedText) { //Called when fully loaded
		if (preloadedFile==null) {
			var textFromFileLoaded = reader.result;
	    	var path = document.getElementById("fileToLoad").value;
	    	var loadedFilename = path.replace(/^.*\\/,"");
		}
		else {
			var textFromFileLoaded = importedText;
			var loadedFilename = "Call_Filename_Here";
		}
		var n = JSON.parse(textFromFileLoaded);
		
		var elementList = n.diagram.elements; //stores all elements
        var allNodes = n.diagram.elements.nodes;
        var allArrows = n.diagram.elements.arrows;
        var allNotes = n.diagram.elements.notes;
        var loadedRows = n.diagram.rows;
        var loadedCols = n.diagram.cols;

        
        //Replace			
		if (typeOfLoad == 0){
			bootbox.hideAll();
			rows=loadedRows;
			cols=loadedCols;
			newProject();
			document.getElementById('grid').style.height = 91.5 + (rows-initialRows)*6 + '%'; //Increases height by 6%
			for (var j = 0; j<loadedCols-initialCols; j++){
				addWidth();
			}
			var nodeArr = [], arrowArr = [];
			filename = loadedFilename;
			resetTitleBar();
			loadEverything(0,"replace");
			adjustWidth();
		}
		
		//Append
		else if (typeOfLoad == 1){
			bootbox.hideAll();
			$("#nodeZone").addClass('drop-target');
			$("#nodeZone").css('cursor','crosshair');
			document.getElementById("titleBar").innerHTML = '<div class="center" style="width:25%;">Click where to append then press okay <button id="appendBtn" style="margin-left:10px;">Okay!</button></div>';
			
			//Resets the append spot
			document.getElementById("appendSpot").style.visibility='visible';
			document.getElementById("appendSpot").style.webkitTransform =
				document.getElementById("appendSpot").style.transform =
					'translate(' + 250 + 'px, ' + 22 + 'px)';
			document.getElementById("appendSpot").setAttribute("x",250);
			document.getElementById("appendSpot").setAttribute("y",22);
			
			//Need to account for user clicking on either #nodeZone or a node (with class .nodeDraggable)
			$("#nodeZone").on('click',function(event){
				window.tapX = event.pageX;
				window.tapY = event.pageY;
				var transposeX = Math.round((tapX)/160)*160-70;	
				var transposeY = 22;
				document.getElementById("appendSpot").style.webkitTransform =
					document.getElementById("appendSpot").style.transform =
						'translate(' + transposeX + 'px, ' + transposeY + 'px)';
				document.getElementById("appendSpot").setAttribute("x",transposeX);
			});
			$(".nodeDraggable").on('click',function(event){
				window.tapX = event.pageX;
				window.tapY = event.pageY;
				var transpose = Math.round((tapX)/160)*160-70;	
				var transposeY = 22;
				document.getElementById("appendSpot").style.webkitTransform =
					document.getElementById("appendSpot").style.transform =
						'translate(' + transposeX + 'px, ' + transposeY + 'px)';
				document.getElementById("appendSpot").setAttribute("x",transposeX);
			});
			
			//On clicking append, transposes elements to be appended at the selected spot
			$("#appendBtn").on("click",function(){
				document.getElementById("appendSpot").style.visibility='hidden';
				var transpose = document.getElementById("appendSpot").getAttribute("x");
				if (loadedRows>rows){
					var deltaRow = loadedRows-rows
					for (var i = 0; i<deltaRow; i++){
						addHeight();
					}
					rows=loadedRows;
				}	
				//Cols are dealt with in storeArray()
				$("#nodeZone").removeClass('drop-target');
				$("#nodeZone").css('cursor','auto');
				
				filename = filename + "_&_" + loadedFilename
				resetTitleBar();
				loadEverything(transpose,"append");
				adjustWidth();
			});
		}	
		else {
			alert(textFromFileLoaded);
		}

		function loadEverything (transpose,typeOfLoad){
			for (var i in allNodes ){
	           var text = allNodes[i].innerText;
	           var id = guid();
	           if (typeOfLoad == "append"){
	        	   var lX = parseInt(allNodes[i].data_x) - parseInt(allNodes[0].data_x) + parseInt(transpose);
	           }
	           else {
	        	   var lX = parseInt(allNodes[i].data_x);
	           }
	           var lY = allNodes[i].data_y;
	           var wide = allNodes[i].width;
	           var arrayType="nodeArr";
	           storeArray(arrayType, i, id, text, lX, lY, wide,null, null);
			}
			for (var i in allArrows ){
	           var text = allArrows[i].innerText;
	           var id = guid();
	           if (typeOfLoad == "append"){
	        	   var lX = parseInt(allArrows[i].data_x) - parseInt(allNodes[0].data_x) + parseInt(transpose);
	           }
	           else {
	        	   var lX = parseInt(allArrows[i].data_x);
	           }
	           var lY = allArrows[i].data_y;
	           var wide = allArrows[i].width;
	           var direction = allArrows[i].direction;
	           var arrayType="arrowArr";
	           storeArray(arrayType, i, id, text, lX, lY, wide,direction, null);
	           warning();
			}
			for (var i in allNotes ){
		       var text = allNotes[i].innerText;
		       var id = guid();
	           if (typeOfLoad == "append"){
	        	   var lX = parseInt(allNotes[i].data_x) - parseInt(allNodes[0].data_x) + parseInt(transpose);
	           }
	           else {
	        	   var lX = parseInt(allNotes[i].data_x);
	           }
		       var lY = allNotes[i].data_y;
		       var wide = allNotes[i].width;
		       var height = allNotes[i].height;
		       var arrayType="noteArr";
		       storeArray(arrayType, i, id, text, lX, lY, wide, null, height);
			}
		}
	}	
}

function adjustWidth () {
	var maxX = 0;
	for (var i=0; i<nodeArr.length; i++){
		if (nodeArr[i][3]>maxX){
			maxX = nodeArr[i][3];
		}		
	}
	while (maxX>$("#grid").width() - $("#sideBar").width()){
		addWidth();
	}
}

function resetTitleBar () {
	document.getElementById("titleBar").innerHTML = '<h3 class=titleBar>' + filename + '</h3>';
}

//Allows editing title by double clicking on the top bar
$("#titleBar").dblclick(function(event) {
	if (filename == "Flow_SDE"){
		filename = "My_Flow_1.txt";
	}
	document.getElementById("titleBar").innerHTML = '<div class="center" style="width:20%;margin-left:42%;"><p style = "cursor:pointer;display:inline;margin-right:15px;font-family:Arial Black; line-height:10px;" onclick="resetTitleBar();">X</p><input id="filenameBox" type="text" value='+filename+'>';
	$("#filenameBox").selectRange(0,filename.length-4);
	$("#filenameBox").keyup( function(e) {
		if (e.keyCode == 13){
			filename = $("#filenameBox").val();
			if (filename.slice(-3) != "txt"){
				filename += ".txt";
			}
			document.getElementById("titleBar").innerHTML = '<h3 class=titleBar>' + filename + '</h3>';
		}
	});
	$("#filenameBox").focusout(function(){
		filename = $("#filenameBox").val();
		if (filename.slice(-3) != "txt"){
			filename += ".txt";
		}
		document.getElementById("titleBar").innerHTML = '<h3 class=titleBar>' + filename + '</h3>';
	});
});	
//SELECT TEXT RANGE
$.fn.selectRange = function(start, end) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};


/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/