// Contains methods to drag, copy, resize arrows

var arrowArr = []; //Arrow array stored as [tag, uuid]

interact('.arrowDraggable')

.on('move',function (event){
	var interaction = event.interaction;

	$ ("nodeDropzone").addClass("drop-target");
	// if the pointer was moved while being held down
	// and an interaction hasn't started yet
	if (interaction.pointerIsDown && !interaction.interacting() && !$(event.currentTarget).hasClass("child")) {
		var original = event.currentTarget,
		// create a clone of the currentTarget element
		clone = event.currentTarget.cloneNode(true);
		window.uuid = guid();
		clone.id = uuid;
		// insert the clone to the page
		var dropOffLocation = document.getElementById("arrowChildrenDroppedOffHere");
		var clone = dropOffLocation.insertBefore(clone,dropOffLocation.parentNodes);
		
		var d = document.getElementById(uuid);
		d.className = d.className + " child"; //Adds child class to prevent child cloning
		
		// translate the element
		clone.style.webkitTransform = clone.style.transform = 'translate(' + 0 + $(document).scrollLeft() + 'px, ' + 168 + $(document).scrollTop() + 'px)';

		// update the position attributes
		clone.setAttribute('data_x', 0 + $(document).scrollLeft());
		clone.setAttribute('data_y', 168 + $(document).scrollTop());
				
		
		arrowArr.push([clone,uuid]);

		// start a drag interaction targeting the clone
		interaction.start({ name: 'drag' },
				event.interactable,
				clone);
	}
})	

.draggable({
	autoscroll:true,
	snap: {
    	targets: [ 
    	           interact.createSnapGrid({
    	        	   x: 160, y: 42,
    	        	   offset: {x:11 , y:26}
    	           })
          ],
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
	},
	// enable inertial throwing
	inertia: true,
	// keep the element within the area of it's parent
	restrict: {
		//restriction: "parent",
		endOnly: true,
		elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
	},

	// call this function on every dragmove event
	onmove: dragMoveListenerArrow,
	// call this function on every dragend event
	onend: function (event) {

	}
})
.on('dragmove', function (event) { 

});

interact('.arrowPlaced')
.on('doubletap',function (event){
	uuid = event.target.id;
	if (uuid == ""){ //accounts for double tapping .triangle
		var uuid = event.target.parentNode.id;
	}
	if (uuid == ""){ //accounts for double tapping .triangle
		var uuid = event.target.parentNode.parentNode.id;
	}
	renameArrow(uuid);
	
});

function renameArrow (uuid) {
	recallArray(arrowArr, uuid);
	bootbox.prompt({
		closeButton:false,backdrop:true,animate:false,
		size:'small',
		title: "Change Arrow Text",
		value:text,
		placeholder: "add text here",
		callback: function(result) {
			if (result != null) {
				//EXECUTE THIS ON OKAY///
				var innerText=result;
				pushToDict(innerText, "arrow");
				storeText(arrowArr,uuid,innerText);
				makeArrow(uuid);
				/////////////////////////
		 	} 		
		}
	});
	$("#box").autocomplete({
		source: arrowTags,
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