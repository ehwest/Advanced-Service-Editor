// Contains methods to drag, copy, resize nodes

var nodeArr = []; //Node array stored as [tag, uuid]
var lifelineX = [];
var startArrowDependants = [];
var endArrowDependants = [];
var lastSelected = null;

interact('.nodeDraggable')	
	.on('tap',function (event){
		if ($("#"+event.target.id).hasClass('placed') && event.ctrlKey == false && event.shiftKey==false && event.button == 0){
			clearSelection();
			selection.push(event.target.id);
			$("#"+event.target.id).addClass('selected');
			lastSelected = event.target.id;
		}	
		//Ctrl key & left click & not already selected = adds it
		else if ($("#"+event.target.id).hasClass('placed') && selection.indexOf(event.target.id) == -1 && event.ctrlKey == true && event.button == 0){
			selection.push(event.target.id);
			$("#"+event.target.id).addClass('selected');
			lastSelected = event.target.id;
		}
		//Ctrl key & Left click & already selected = removes it
		else if (selection.indexOf(event.target.id) != -1 && event.ctrlKey == true && event.button == 0){			
			selection.splice(selection.indexOf(event.target.id),1);
			$("#"+event.target.id).removeClass('selected')
		}
		//Shift key & left click
		else if ($("#"+event.target.id).hasClass('placed') && selection.indexOf(event.target.id) == -1 && event.shiftKey == true && event.button == 0){
			selection.push(event.target.id);
			$("#"+event.target.id).addClass('selected');
			if (lastSelected != null){
				if (parseInt(document.getElementById(lastSelected).getAttribute('data_x'))>parseInt(event.target.getAttribute('data_x'))){
					for (var i=0; i<nodeArr.length; i++){
						if (nodeArr[i][1] == lastSelected || nodeArr[i][1] == event.target.id){
							continue;
						}
						if (nodeArr[i][3]<parseInt(document.getElementById(lastSelected).getAttribute('data_x')) && nodeArr[i][3]>parseInt(event.target.getAttribute('data_x'))){						
							selection.push(nodeArr[i][1]);
							$("#"+nodeArr[i][1]).addClass('selected');
						}
					}	
				}
				else if (parseInt(document.getElementById(lastSelected).getAttribute('data_x'))<parseInt(event.target.getAttribute('data_x'))){
					for (var i=0; i<nodeArr.length; i++){
						if (nodeArr[i][1] == lastSelected || nodeArr[i][1] == event.target.id){
							continue;
						}
						if (nodeArr[i][3]>parseInt(document.getElementById(lastSelected).getAttribute('data_x')) && nodeArr[i][3]<parseInt(event.target.getAttribute('data_x'))){						
							selection.push(nodeArr[i][1]);
							$("#"+nodeArr[i][1]).addClass('selected');
						}
					}	
				}
			}
			lastSelected = event.target.id;	
		}
		
		//Else clear
		else {
			if (event.button == 0){
				clearSelection();
			}
		}
	})
	//CLONING
	.on('move',function (event){
		var interaction = event.interaction;

		$ ("nodeDropzone").addClass("drop-target");
		// if the pointer was moved while being held down
		// and an interaction hasn't started yet
		if (interaction.pointerIsDown && !interaction.interacting() && !$(event.currentTarget).hasClass("child")) {
			var original = event.currentTarget,
			// create a clone of the currentTarget element
			clone = event.currentTarget.cloneNode(true);
			uuid = guid();
			clone.id = uuid;
			clone.classList.remove('drag');
			clone.classList.add('drag-1');
			// insert the clone to the page
			var dropOffLocation = document.getElementById("nodeChildrenDroppedOffHere");
			
			var clone = dropOffLocation.insertBefore(clone,dropOffLocation.parentNodes);			
			var d = document.getElementById(uuid);
			d.className = d.className + " child"; //Adds child class to prevent child cloning
			
			
			// translate the element
			clone.style.webkitTransform = clone.style.transform = 'translate(' + 0 + $(document).scrollLeft() + 'px, ' + 0 + $(document).scrollTop() + 'px)';

			// update the position attributes
			clone.setAttribute('data_x', 0 + $(document).scrollLeft());
			clone.setAttribute('data_y', 0 + $(document).scrollTop());
			
			
			nodeArr.push([clone,uuid]);

			// start a drag interaction targeting the clone
			interaction.start({ name: 'drag' },
					event.interactable,
					clone);
		}
	})
	
	//DRAGGING
	.draggable({
		snap: {
	    	targets: [ // give this function the x and y page coords
		    	          // and snap to the object returned

	    	           interact.createHorizontalSnapGrid({
	    		        	  x: 160, y: 100,
	    		        	  offset: {x:-51,y:0}
	    		          })
	    		          
		    	      ],
	    	          range: 150,
	    	          relativePoints: [ { x: 0, y: 0.5 } ]
		},
	    // enable inertial throwing
	    inertia: true,
	    
	    restrict: {
	    	endOnly: true,
	    	elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
	    },
	
		// call this function on every dragmove event
	    onmove: window.dragMoveListener,
	    onmove: dragMoveListener,
		// call this function on every dragend event
		onend: function (event) {
	
		}
	})
	.on('dragstart', function (event) {
		if (event.button == 0 && !$("#" + event.target.id).hasClass('selected')){ //Makes anything you drag dashed
			clearSelection();
			selection.push(event.target.id);
			$("#"+event.target.id).addClass('selected');
			lastSelected = event.target.id;
		}
		
		//Bring drag elements to the front
		for (var i = 0; i<selection.length; i++){
			document.getElementById(selection[i]).style.zIndex = 9998;
		}

		
		//This may cause lag if there are an extremely large number of arrows
		for (var i=0; i<arrowArr.length; i++){
			determineLRNode(arrowArr[i][1],"arrow");
		}
	})
	.on('dragend', function (event) {

		for (var i = 0; i<selection.length; i++){
			try{
				document.getElementById(selection[i]).style.zIndex--;
			}
			catch(err) {
				continue;
			}
		}
		
		//Shifts nodes to the right by running shiftRight on every node (first sorts the selections by x)
		for (var k = selection.length-1; k>=0; k--){
			for (var m = 1; m<=k; m++){
    			if (document.getElementById(selection[m-1]).getAttribute("data_x")>document.getElementById(selection[m]).getAttribute("data_x")) {
    				var swap = selection[m];
    				selection[m] = selection[m-1];
    				selection[m-1] = swap;
    			}		            		
    		}
		}	
		for (var i = 0; i<selection.length; i++){
			if (isOverlapped(selection[i]) == true){
				shiftRight(document.getElementById(selection[i]),160);
			}
		}
	})
	.on('dragmove', function (event) {
	
	})
	
	//RESIZING
	.resizable({
		edges: { left: false, right: false, bottom: false, top: false }
	})
	.on('resizemove', function (event) {
		var target = event.target,
		x = (parseFloat(target.getAttribute('data_x')) || 0),
		y = (parseFloat(target.getAttribute('data_y')) || 0);
	
		// update the element's style
		target.style.width  = event.rect.width + 'px';
		target.style.height = event.rect.height + 'px';
	
		// translate when resizing from top or left edges
		x += event.deltaRect.left;
		y += event.deltaRect.top;
	
		target.style.webkitTransform = target.style.transform =
			'translate(' + x + 'px,' + y + 'px)';
	
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
		
		
})
;

function clearSelection () {
	for (var i = 0; i<selection.length; i++){
		$("#"+selection[i]).removeClass('selected')
	}
	selection.length = 0;
}

function getStartArrowDependants (nodeID) {
	startArrowDependants.length = 0;
	for (var i = 0; i<arrowArr.length; i++){
		if (arrowArr[i][8] == nodeID) {
			startArrowDependants.push(arrowArr[i][1]);
		}
	}
}

function getEndArrowDependants (nodeID) {
	endArrowDependants.length = 0;
	for (var i = 0; i<arrowArr.length; i++){
		if (arrowArr[i][9] == nodeID) {
			endArrowDependants.push(arrowArr[i][1]);
		}
	}	
}

function moveSelection (dx,dy,draggedNodeID) {
	for (var i = 0; i<selection.length; i++){
		if (selection[i] == draggedNodeID){
			continue;
		}
		selectionTarget = document.getElementById(selection[i]);
		var x = (parseFloat(selectionTarget.getAttribute('data_x')) || 0);
		var y = (parseFloat(selectionTarget.getAttribute('data_y')) || 0);
		
		x += dx;
		y += dy;

		selectionTarget.style.webkitTransform =
			selectionTarget.style.transform =
				'translate(' + x + 'px, ' + y + 'px)';
		
		selectionTarget.setAttribute('data_x',x);
		selectionTarget.setAttribute('data_y',y);
		
		storeXY(nodeArr,selection[i]);

		moveDependants(dx,dy,selection[i]);
		if (isOverlapped(selection[i]) == true){
			document.getElementById(selection[i]).style.transition = "background .5s ease";		
			document.getElementById(selection[i]).style.background = "rgba(255,255,0,.40)"; //yellow
			//shiftRight(event.target);
		 }
		 else {
			 document.getElementById(selection[i]).style.background = "#29e"; //remove yellow
		 }
		 while (x>$("#grid").width() - $("#sideBar").width()){
			addWidth();
		 }
	} 
}

function moveDependants (dx,dy,nodeID) {
	getStartArrowDependants(nodeID);
	getEndArrowDependants(nodeID);
	for (var i = 0; i<startArrowDependants.length; i++){		
		var target = document.getElementById(startArrowDependants[i]);
		for (var j = 0; j<arrowArr.length; j++){
			if (startArrowDependants[i] == arrowArr[j][1]){
				var arrowI = j;
			}
		}
		if (arrowArr[arrowI][9] == null){
			
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
			y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
			
			// translate the element
			target.style.webkitTransform =
				target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';
	
			// update the position attributes
			target.setAttribute('data_x', x);
			target.setAttribute('data_y', y);
			
			var index = storeXY(arrowArr,target.id);
			arrowArr[index][8] = nodeID;	
			continue;
		}		
		if (target.getAttribute("direction") == "right") {
			if($("#"+target.id).width() + 12 - dx > 0){
				target.style.width = parseFloat(target.style.width) - dx + 'px';
				
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][8] = nodeID;		
			}
			else if($("#"+target.id).width() + 12 - dx < 0){
				var newWide = Math.abs(parseFloat(target.style.width) + dx)-12;
				target.setAttribute("direction","left");
				makeArrow(target);
				target.style.width = newWide + 'px';
			
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][8] = nodeID;		
			}
			else if($("#"+target.id).width() + 12 - dx == 0){
				target.style.width = '0px';
				target.setAttribute("direction","self");
				makeArrow(target);
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][8] = nodeID;		
			}
		}
		else if (target.getAttribute("direction") == "left") {
			if(-1 * ($("#"+target.id).width() + 12) - dx < 0){
				target.style.width = parseFloat(target.style.width) + dx + 'px';
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][8] = nodeID;		
			}
			else if(-1 * ($("#"+target.id).width() + 12) - dx > 0){
				var newWide = Math.abs(parseFloat(target.style.width) + dx);
				target.setAttribute("direction","right");
				makeArrow(target);
				target.style.width = newWide + 'px';
				
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][8] = nodeID;		
			}
			else if(-1* ($("#"+target.id).width() + 12) - dx == 0){
				target.style.width = '0px';
				target.setAttribute("direction","self");
				makeArrow(target);
				
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][8] = nodeID;		
			}
		}
		else if (target.getAttribute("direction") == "self") {
			if(dx > 0){
				target.setAttribute("direction","left");
				makeArrow(target);
				target.style.width = dx - 12 + 'px';
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][8] = nodeID;		
			}
			else if(dx < 0){
				target.setAttribute("direction","right");
				makeArrow(target);
				target.style.width = Math.abs(dx) - 12 + 'px';
				
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][8] = nodeID;
			}
		}
	}
	
	
	/////////
	
	for (var i = 0; i<endArrowDependants.length; i++){
		var target = document.getElementById(endArrowDependants[i]);
		if (target.getAttribute("direction") == "right") {
			if($("#"+target.id).width() + 12 + dx > 0){
				target.style.width = parseFloat(target.style.width) + dx + 'px';
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][9] = nodeID;		
			}
			else if($("#"+target.id).width() + 12 + dx < 0){
				var newWide = Math.abs(parseFloat(target.style.width) + dx)-12;
				target.setAttribute("direction","left");
				makeArrow(target);
				target.style.width = newWide + 'px';
				
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][9] = nodeID;		
			}
			else if($("#"+target.id).width() + 12 + dx == 0){
				target.style.width = '0px';
				target.setAttribute("direction","self");
				makeArrow(target);
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][9] = nodeID;		
			}
		}
		else if (target.getAttribute("direction") == "left") {
			if(-1 * ($("#"+target.id).width() + 12) + dx < 0){
				target.style.width = parseFloat(target.style.width) - dx + 'px';
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][9] = nodeID;		
			}
			else if(-1 * ($("#"+target.id).width() + 12) + dx > 0){
				var newWide = Math.abs(parseFloat(target.style.width) + dx);
				target.setAttribute("direction","right");
				makeArrow(target);
				target.style.width = newWide + 'px';
				
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][9] = nodeID;		
			}
			else if(-1* ($("#"+target.id).width() + 12) + dx == 0){
				target.style.width = '0px';
				target.setAttribute("direction","self");
				makeArrow(target);
				
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][9] = nodeID;		
			}
		}
		else if (target.getAttribute("direction") == "self") {
			if(dx > 0){
				target.setAttribute("direction","right");
				makeArrow(target);
				target.style.width = dx - 12 + 'px';
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][9] = nodeID;		
			}
			else if(dx < 0){
				target.setAttribute("direction","left");
				makeArrow(target);
				target.style.width = Math.abs(dx) - 12 + 'px';
				
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;
				
				// translate the element
				target.style.webkitTransform =
					target.style.transform =
						'translate(' + x + 'px, ' + y + 'px)';
		
				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				
				
				var index = storeXY(arrowArr,target.id);
				arrowArr[index][9] = nodeID;
			}
		}
	}
}

interact('.placed')
//CLONING
.on('doubletap',function (event) {renameNode(event.target.id)});

function renameNode (uuid) {
	recallArray(nodeArr, uuid);
	bootbox.prompt({
		closeButton:false,backdrop:true,animate:false, //Kills the fun
		size:'small',
		title: "Change Node Text",
		value:text,
		placeholder: "add text here",
		callback: function(result) {
			if (result != null) {
				//EXECUTE THIS ON OKAY///
				var innerText = result;
				pushToDict(innerText, "node");
				storeText(nodeArr,uuid,innerText);
				var nodeHeight = $('.drag-1').height();
				nodeHeightCorrected = nodeHeight-10;
				var gridHeight = document.getElementById('grid').clientHeight;
				gridHeightCorrected = gridHeight - 90;
				document.getElementById(uuid).innerHTML = innerText+'<div class="verticalLine" style = "margin-top:' + nodeHeightCorrected + 'px;height:' + gridHeightCorrected + 'px;"></div>';
				clearSelection();
				/////////////////////////
		 	} 		
		}
	});
	$("#box").autocomplete({
		source: nodeTags,
		autoFocus: true
	});
}


/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/