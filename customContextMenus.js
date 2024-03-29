//Contains functions that dictate what the user can do when they right click a node, arrow, dropzone or note

//DROPZONE CONTEXT MENU
$(function(){
    $.contextMenu({
        selector: '.nodeDropzone', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        animation: {
        	duration: 100,show: "show", hide: "hide"
        },
        items: {
            "paste": {
            	name: "Paste", 
            	icon: "paste",
            	callback: function(key, options) {
    				var transposeX = Math.round((event.x)/160)*160-70;	
    				var transposeY = 22;
    				for (var i = 0; i<clipboard.length; i++) {
    					storeArray("nodeArr", i, guid(), clipboard[i][2], transposeX, transposeY, clipboard[i][5],null, null);
    				}
            	}	
            },            
            "sep1": "---------",
            "import": {
            	name: "Import", 
            	icon: "import",
            	callback: function(key, options) { 
            		document.getElementById("titleBar").innerHTML = '<div class="center" style="width:35%;"><p style = "cursor:pointer;display:inline;margin-right:15px;font-family:Arial Black; line-height:10px;" onclick="resetTitleBar();">X</p><input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(1);">Import!</button><button style = "margin-left:10px;display:inline;" onclick="loadFile(2);">Source</button></div>';
            	}
            },
            "sep2": "---------",
            "quit": {
            	name: "Quit", 
            	icon: "quit"}
        }
    });
    
    $('.nodeDropzone').on('click', function(e){
        //clearSelection();
    })
});


//NODE CONTEXT MENU
$(function(){

	 /**************************************************
     * Custom Command Handler
     **************************************************/
    $.contextMenu.types.label = function(item, opt, root) {
        // this === item.$node

        $('<span>Shift Arrows</span>'
            + '<button id="shiftDownButton" style="margin-left:5px" onClick="shiftDown(event,1);">+</button>'
            + '<button id="shiftUpButton" style="margin-right:10px" onClick="shiftDown(event,-1);">-</button>')
            .appendTo(this);
            
     
    };	
	$.contextMenu({
        selector: '.placed', 
        callback: function(key, options) {
            //var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        animation: {
        	duration: 100,show: "show", hide: "hide"
        },
        items: {
            "edit": {
            	name: "Edit", 
            	icon: "edit",
            	callback: function(key, options) {
                    renameNode(this[0].id);
                },
        		disabled: function(key, opt) {
        			//Only allow editing if one node is selected
        			return selection.length >  1
        		}
            },
            "cut": {
            	name: "Cut", 
            	icon: "cut",
            	callback: function(key, options) {          		
        			clipboard.length = 0;
            		for (var i = 0; i<selection.length; i++){
            			for (var j = 0; j<nodeArr.length; j++){		        			
    						if (nodeArr[j][1] == selection[i]) {
	        					clipboard.push(nodeArr[j]);
	        					break;
	        				}
	        			}
        			}
            		//sort the nodes by data_x
            		for (var k = clipboard.length-1; k>=0; k--){
            			for (var m = 1; m<=k; m++){
	            			if (document.getElementById(clipboard[m-1][1]).getAttribute("data_x")<document.getElementById(clipboard[m][1]).getAttribute("data_x")) {
	            				var swap = clipboard[m-1];
	            				clipboard[m-1] = clipboard[m];
	            				clipboard[m] = swap;
	            			}		            		
	            		}
            		}	
            		//Splice elements
            		for (var i = 0; i<selection.length; i++){
            			for (var j = 0; j<nodeArr.length; j++){		        			
    						if (nodeArr[j][1] == selection[i]) {
	        					nodeArr.splice(j,1);
	        					warning();
	        					document.getElementById(selection[i]).parentNode.removeChild(document.getElementById(selection[i]));
	        					break;
	        				}
	        			}
        			}
                } //Callback
            },
            "copy": {
            	name: "Copy", 
            	icon: "copy",
            	callback: function(key, options) {          		
        			clipboard.length = 0;
            		for (var j = 0; j<selection.length; j++){
            			for (var i = 0; i<nodeArr.length; i++){		        			
    						if (nodeArr[i][1] == selection[j]) {
	        					clipboard.push(nodeArr[i]);
	        					break;
	        				}
	        			}
        			}
            		//sort the nodes by data_x
            		for (var i = clipboard.length-1; i>=0; i--){
            			for (var j = 1; j<=i; j++){
	            			if (document.getElementById(clipboard[j-1][1]).getAttribute("data_x")<document.getElementById(clipboard[j][1]).getAttribute("data_x")) {
	            				var swap = clipboard[j-1];
	            				clipboard[j-1] = clipboard[j];
	            				clipboard[j] = swap;
	            			}		            		
	            		}
            		}	            	
            	}	
            },
            "paste": {
            	name: "Paste", 
            	icon: "paste",
            	callback: function(key, options) {
    				var transposeX = Math.round((event.x)/160)*160-70;	
    				var transposeY = 22;
    				for (var i = 0; i<clipboard.length; i++) {
    					storeArray("nodeArr", i, guid(), clipboard[i][2], transposeX, transposeY, clipboard[i][5],null, null);
    				}        			
            	}	
            },
            "delete": {
            	name: "Delete", 
            	icon: "delete",
            	callback: function(key, options) { 
            		for (var j = 0; j<selection.length; j++){
            			for (var i = 0; i<nodeArr.length; i++){		        			
    						if (nodeArr[i][1] == selection[j]) {
	        					deletedNodes.push(nodeArr[i]);
	        					nodeArr.splice(i,1);
	    	            		document.getElementById(selection[j]).parentNode.removeChild(document.getElementById(selection[j]));
	        					warning();
	        					break;
	        				}
	        			}
        			}
            		clearSelection();
	        		document.getElementById("trash").src = "trashCanFull.gif";
            		for (i = 0; i<arrowArr.length; i++){
	            		determineLRNode(arrowArr[i][1],"arrow");
	            	}
            	}
            },
            "deleteOptions": {
            	name: "Delete w/ arrows", 
            	icon: "delete",
            	callback: function(key, options) {},
            	items: {
            		"deleteStart": {
	            		name: "Delete with start arrows", 
	                	icon: "delete",
	                	callback: function(key, options) { 
    	            		for (var i = 0; i<selection.length; i++){ //cycle each selected node
    	            			for (var j = 0; j<nodeArr.length; j++){	//cycle all nodes	        			
            						if (nodeArr[j][1] == selection[i]) { //see if node is selected
            							getStartArrowDependants(selection[i]); //get start dependents
	    	        					for (var k = 0; k<startArrowDependants.length; k++){ //cycle through startArrowDep
	    	        						for (var m = 0; m<arrowArr.length; m++){ //cycle through all arrows
	    	        							if (arrowArr[m][1] == startArrowDependants[k]){	//see if arrow is a startArrowDep
	    	        								deletedArrows.push(arrowArr[m]);
	    	        								arrowArr.splice(m,1);	
	    	        								document.getElementById(startArrowDependants[k]).parentNode.removeChild(document.getElementById(startArrowDependants[k]));
	    	        							}
	    	        						}
	    	        					}
            							deletedNodes.push(nodeArr[j]);
        	        					nodeArr.splice(j,1);
        	    	            		document.getElementById(selection[i]).parentNode.removeChild(document.getElementById(selection[i]));
        	        					warning();
        	        					break;
    		        				}
    		        			}
    	        			}
    	            		clearSelection();
	    	        		document.getElementById("trash").src = "trashCanFull.gif";
	    	            	for (i = 0; i<arrowArr.length; i++){
	    	            		determineLRNode(arrowArr[i][1],"arrow");
	    	            	}
	                	}
            		},
            		"deleteEnd": {
	            		name: "Delete with end arrows", 
	                	icon: "delete",
	                	callback: function(key, options) { 
    	            		for (var i = 0; i<selection.length; i++){ //cycle each selected node
    	            			for (var j = 0; j<nodeArr.length; j++){	//cycle all nodes	        			
            						if (nodeArr[j][1] == selection[i]) { //see if node is selected
            							getEndArrowDependants(selection[i]); //get end dependents
	    	        					for (var k = 0; k<endArrowDependants.length; k++){ //cycle through endArrowDep
	    	        						for (var m = 0; m<arrowArr.length; m++){ //cycle through all arrows
	    	        							if (arrowArr[m][1] == endArrowDependants[k]){	//see if arrow is a endArrowDep
	    	        								deletedArrows.push(arrowArr[m]);
	    	        								arrowArr.splice(m,1);	
	    	        								document.getElementById(endArrowDependants[k]).parentNode.removeChild(document.getElementById(endArrowDependants[k]));
	    	        							}
	    	        						}
	    	        					}
            							deletedNodes.push(nodeArr[j]);
        	        					nodeArr.splice(j,1);
        	    	            		document.getElementById(selection[i]).parentNode.removeChild(document.getElementById(selection[i]));
        	        					warning();
        	        					break;
    		        				}
    		        			}
    	        			}
    	            		clearSelection();
	    	        		document.getElementById("trash").src = "trashCanFull.gif";
	    	            	for (i = 0; i<arrowArr.length; i++){
	    	            		determineLRNode(arrowArr[i][1],"arrow");
	    	            	}
	                	}
            		},
            		"deleteAll": {
	            		name: "Delete all arrows", 
	                	icon: "delete",
	                	callback: function(key, options) { 
	                		if (selection.length == 0){
	    	            		selection.push(this[0].id);
	    	            	}
    	            		for (var i = 0; i<selection.length; i++){ //cycle each selected node
    	            			for (var j = 0; j<nodeArr.length; j++){	//cycle all nodes	        			
            						if (nodeArr[j][1] == selection[i]) { //see if node is selected
            							getStartArrowDependants(selection[i]); //get start dependents
	    	        					for (var k = 0; k<startArrowDependants.length; k++){ //cycle through startArrowDep
	    	        						for (var m = 0; m<arrowArr.length; m++){ //cycle through all arrows
	    	        							if (arrowArr[m][1] == startArrowDependants[k]){	//see if arrow is a startArrowDep
	    	        								deletedArrows.push(arrowArr[m]);
	    	        								arrowArr.splice(m,1);	
	    	        								document.getElementById(startArrowDependants[k]).parentNode.removeChild(document.getElementById(startArrowDependants[k]));
	    	        							}
	    	        						}
	    	        					}
	    	        					getEndArrowDependants(selection[i]); //get end dependents
	    	        					for (var k = 0; k<endArrowDependants.length; k++){ //cycle through endArrowDep
	    	        						for (var m = 0; m<arrowArr.length; m++){ //cycle through all arrows
	    	        							if (arrowArr[m][1] == endArrowDependants[k]){	//see if arrow is a endArrowDep
	    	        								deletedArrows.push(arrowArr[m]);
	    	        								arrowArr.splice(m,1);	
	    	        								document.getElementById(endArrowDependants[k]).parentNode.removeChild(document.getElementById(endArrowDependants[k]));
	    	        							}
	    	        						}
	    	        					}
            							deletedNodes.push(nodeArr[j]);
        	        					nodeArr.splice(j,1);
        	    	            		document.getElementById(selection[i]).parentNode.removeChild(document.getElementById(selection[i]));
        	        					warning();
        	        					break;
    		        				}
    		        			}
    	        			}
    	            		clearSelection();
	    	        		document.getElementById("trash").src = "trashCanFull.gif";
	    	            	for (i = 0; i<arrowArr.length; i++){
	    	            		determineLRNode(arrowArr[i][1],"arrow");
	    	            	}
	                	}
            		},
            	}
		            	
	     
            },
            "sep1": "---------",
            "export": {
            	name: "Export", 
            	icon: "export",
            	callback: function(key, options) { 
            		var now = new Date;
            		var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
            	             now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
            		var canvasWidth = $("#grid").width() - $("#sideBar").width();
            		//alert('Saving To File -- click OK');
            		m = "";
            		m +=  '{ "diagram": \n';
            		m += '{ "created": "' + utc_timestamp +   '",\n';
            		m += '"rows": "' + rows + '",\n';
            		m += '"cols": "' + cols + '",\n';
            		m += '"gridPitchy": "' + gridPitchy + '",\n';
            		m += '"canvasHeight": "' + $("#grid").height() + '",\n';
            		m += '"canvasWidth": "' + canvasWidth + '",\n';
            		m += '"elements": {"nodes": [\n';
            		for (var i = 0; i<selection.length; i++) {
                		index = recallArray(nodeArr, selection[i]);
            			saveNodeArrayElements(nodeArr[index],i,selection);
            		}
            		m +=  '],\n "arrows": [\n';
	            	var allDependants = [];
            		for (var i = 0; i<selection.length; i++){
	            		getStartArrowDependants(selection[i]);
	            		getEndArrowDependants(selection[i]);
	            		nodeDependants = startArrowDependants.concat(endArrowDependants);
	            		allDependants = allDependants.concat(nodeDependants);
	            	}
            		for (var a = 0; a<allDependants.length; a++){
            			for (var b = a+1; b<allDependants.length;b++){
            				if(allDependants[a]===allDependants[b])
            					allDependants.splice(b--,1);
            			}
            		}
            		for (var j = 0; j<allDependants.length; j++){
            			index = recallArray(arrowArr,allDependants[j]);
            			saveArrowArrayElements(arrowArr[index],j,allDependants);
            		}
	            	m += "]}}}";
            		
            		recallArray(nodeArr, this[0].id);
            		var n = JSON.parse(m);
            		//console.log(n);
            		//console.log(n.diagram.created);
            		underscoreText = text.replace(/ /g,"_");
            		text = underscoreText + '.txt'
            		document.getElementById("titleBar").innerHTML = '<div class="center" style="width:29%"><p style = "cursor:pointer;display:inline;margin-right:15px;font-family:Arial Black; line-height:10px;" onclick="resetTitleBar();">X</p>Export Name: <input id="exportFileName" type="text" value='+text+'><button style = "display:inline;" onclick="saveLocalFile($(\'#exportFileName\').val());">Confirm!</button><button style = "margin-left:10px;display:inline;" onclick="alert(m);">Source</button></div>';
            		$("#exportFileName").selectRange(0,text.length-4);
            		$("#exportFileName").keyup( function(e) {
            			if (e.keyCode == 13){
            				exportName = $("#exportFileName").val();
            				saveLocalFile(exportName);
            			}
            		});
            	}
            },
            "import": {
            	name: "Import", 
            	icon: "import",
            	callback: function(key, options) { 
            		document.getElementById("titleBar").innerHTML = '<div class="center" style="width:35%;"><p style = "cursor:pointer;display:inline;margin-right:15px;font-family:Arial Black; line-height:10px;" onclick="resetTitleBar();">X</p><input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(1);">Import!</button><button style = "margin-left:10px;display:inline;" onclick="loadFile(2);">Source</button></div>';
            	}
            },
            "sep2": "---------",
            
            "shift": {type: "label", customName: "Label", 
            	callback: function(){
            		//adjustHeight();
            		return false 
            	},
            	disabled: function(key, opt) {
            		//Only allow editing if one node is selected
            		getStartArrowDependants(this[0].id);
            		getEndArrowDependants(this[0].id);
            		return startArrowDependants.length==0 && endArrowDependants.length==0;
            	}
            },
            "makeGroupAddChild": {
            	name: "Make child inside", 
            	icon: "edit",
            	callback: function(key, options) {
                    clearSelection();
                    var uuid=this[0].id;
    				selection.push(uuid);
    				$("#"+uuid).addClass('selected');
    				lastSelected = uuid;
    				var dx = addChildrenToGroup(uuid);
            		shiftByDx(dx,uuid);
            		if ($("#"+uuid).hasClass("hasNodes")==false){ //first time		
            			$("#"+uuid).addClass("hasNodes");
            			$("#"+uuid).addClass("expanded");
            			document.getElementById(uuid).style.zIndex = 9980;
            			//document.getElementById(uuid).style.zIndex = document.getElementById(uuid).style.zIndex - 10;
            			breakArrows();
            		}
            		else {
            			shortenArrows();
            		}
            		spawnChild();
            		calcChildren(uuid);
                },
        		disabled: function(key, opt) {
        			//Only allow if one node is selected
        			return selection.length >  1
        		}
            },
            "expandGroup": {
            	name: "Make slot inside", 
            	icon: "edit",
            	callback: function(key, options) {
                    clearSelection();
                    var uuid=this[0].id;
    				selection.push(uuid);
    				$("#"+uuid).addClass('selected');
    				lastSelected = uuid;
    				var dx = addChildrenToGroup(uuid);
            		shiftByDx(dx,uuid);
            		if ($("#"+uuid).hasClass("hasNodes")==false){ //first time		
            			$("#"+uuid).addClass("hasNodes");
            			$("#"+uuid).addClass("expanded");
            			document.getElementById(uuid).style.zIndex = 9980;
            			//document.getElementById(uuid).style.zIndex = document.getElementById(uuid).style.zIndex - 10;
            			breakArrows();
            		}
            		else {
            			shortenArrows();
            		}
            		
            		calcChildren(uuid);
                },
        		disabled: function(key, opt) {
        			//Only allow if one node is selected
        			return selection.length >  1
        		}
            },
            "makeGroupFromSelected": {
            	name: "Make group from selected", 
            	icon: "edit",
            	callback: function(key, options) {
            		makeGroup();  		            		
            		calcChildren(this[0].id);
                },
        		disabled: function(key, opt) {
        			//Only allow if sequential nodes are selected
        			var selectionX = []
        			var nonSelectionX = []
        			for (var i=0; i<nodeArr.length; i++){
        				var flag = 0;
        				for (var j=0; j<selection.length; j++){
        					if (selection[j] == nodeArr[i][1]){
        						selectionX.push(nodeArr[i][3]);
        						var flag = 1
        						break;
        					}	
        				}
        				if (flag == 0){
        					nonSelectionX.push(nodeArr[i][3])
        				}
        			}
        			var minX = Math.min.apply(null,selectionX);
        			var maxX = Math.max.apply(null,selectionX);
        			for (var i=0; i<nonSelectionX.length; i++){
        				if (nonSelectionX[i]<maxX && nonSelectionX[i]>minX){
        					return true
        				}
        			}
        			return false
        		}
            },
            "sep3": "---------",
            "quit": {
            	name: "Quit", 
            	icon: "quit"
            }
        }
    });
    
    $('.placed').on('click', function(e){
        console.log('clicked', this);
    })
});


function addChildrenToGroup (uuid) {
	var target= document.getElementById(uuid);
	var dx=160;
	var dy=0
	if ($("#"+uuid).hasClass("hasNodes")==false){ //first time
		var dy=12;
		var dx=0;	
	}
	var height = $("#"+uuid).height();
	var wide = $("#"+uuid).width();
	
	height+=dy;
	wide+=dx;
	
	// keep the dragged position in the data-x/data-y attributes
	x = (parseFloat(target.getAttribute('data_x'))) + 0,
	y = (parseFloat(target.getAttribute('data_y'))) - dy/2;

	// translate the element
	target.style.webkitTransform =
		target.style.transform =
			'translate(' + x + 'px, ' + y + 'px)';

	// update the position attributes
	target.setAttribute('data_x', x);
	target.setAttribute('data_y', y);

	
	$("#"+uuid).height(height);
	$("#"+uuid).width(wide);
	
	storeXY(nodeArr,target.id);
	
	for (var i=0; i<nodeArr.length; i++){
		if (nodeArr[i][1] == target.id){
			var index = i;
			text = nodeArr[i][2];
		}
	}
	nodeHeightCorrected = height+16;
	var gridHeight = document.getElementById('grid').clientHeight;
	gridHeightCorrected = gridHeight - 90;
	target.innerHTML = '<div class="hasNodesHeader">'+text +'</div>'+
		'<div class="hasNodesBackground" style="height:'+gridHeightCorrected+'px"></div>'+
		'<div class="verticalLine" style = "margin-left:0px; top:' + nodeHeightCorrected + 'px;height:' + gridHeightCorrected + 'px;"></div>';
	
	return dx;
}

function shiftByDx (dx,uuid){
	shiftMe.length = 0;
	index=recallArray(nodeArr,uuid);
	for (var i=0; i<nodeArr.length; i++){
		if (nodeArr[i][1] == selection[0] || selection.indexOf(nodeArr[i][1]) != -1){
			continue;
		}
		if (nodeArr[i][3]>nodeArr[index][3] && nodeArr[i][8] != nodeArr[index][1]){
			shiftMe.push(nodeArr[i][1]);
		}
	}
	for (var i = 0; i<shiftMe.length; i++) {
		shiftedID = shiftMe[i];
		var dy = 0;
		var x = parseInt(document.getElementById(shiftedID).getAttribute("data_x")) + dx;
		var y = parseInt(document.getElementById(shiftedID).getAttribute("data_y")) + dy;
	
		document.getElementById(shiftedID).style.webkitTransform =
			document.getElementById(shiftedID).style.transform =
				'translate(' + x + 'px, ' + y + 'px)';
		
		// update the position attributes
		document.getElementById(shiftedID).setAttribute('data_x', x);
		document.getElementById(shiftedID).setAttribute('data_y', y);
		
		storeXY(nodeArr,shiftedID);
		
		startArrowDependants.length = 0;
		endArrowDependants.length = 0;
		
		getStartArrowDependants(shiftedID);
		getEndArrowDependants(shiftedID);
		
		moveDependants(dx,dy,shiftedID);
	}
}

function breakArrows () {
	getStartArrowDependants(selection[0]);
	getEndArrowDependants(selection[0]);
	nodeIndex = recallArray(nodeArr,selection[0]);
	for (var i=0; i<startArrowDependants.length; i++){
		var target = document.getElementById(startArrowDependants[i]);
		var arrowIndex=recallArray(arrowArr,startArrowDependants[i]);
		if(target.getAttribute('direction')=='right'){		
			var newWide = parseFloat(target.style.width) - (parseFloat(nodeArr[nodeIndex][6])- parseFloat(arrowArr[arrowIndex][3]))-25;
			$("#"+target.id).width(newWide);
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data_x')) || 0) + 75,
			y = (parseFloat(target.getAttribute('data_y')) || 0) + 0;
			
			// translate the element
			target.style.webkitTransform =
				target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';
	
			// update the position attributes
			target.setAttribute('data_x', x);
			target.setAttribute('data_y', y);
			
			storeXY(arrowArr,target.id);			
		}
		else if(target.getAttribute('direction')=='left'){		
			var newWide = parseFloat(target.style.width) - (parseFloat(arrowArr[arrowIndex][6]) - parseFloat(nodeArr[nodeIndex][3])) - 37;
			$("#"+target.id).width(newWide);
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data_x')) || 0) + 0,
			y = (parseFloat(target.getAttribute('data_y')) || 0) + 0;
			
			// translate the element
			target.style.webkitTransform =
				target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';
	
			// update the position attributes
			target.setAttribute('data_x', x);
			target.setAttribute('data_y', y);
			
			storeXY(arrowArr,target.id);			
		}
		//TEMP YELLOW COLOR 
		document.getElementById(target.id).style.background = "rgba(255,255,0,.30)"; //Yellow
	}
	for (var i=0; i<endArrowDependants.length; i++){
		var target = document.getElementById(endArrowDependants[i]);
		var arrowIndex=recallArray(arrowArr,endArrowDependants[i]);
		if(target.getAttribute('direction')=='left'){		
			var newWide = parseFloat(target.style.width) - (parseFloat(nodeArr[nodeIndex][6]) - parseFloat(arrowArr[arrowIndex][3]))-25;
			$("#"+target.id).width(newWide);
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data_x')) || 0) + 75,
			y = (parseFloat(target.getAttribute('data_y')) || 0) + 0;
			
			// translate the element
			target.style.webkitTransform =
				target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';
	
			// update the position attributes
			target.setAttribute('data_x', x);
			target.setAttribute('data_y', y);
			
			storeXY(arrowArr,target.id);			
		}
		else if(target.getAttribute('direction')=='right'){		
			var newWide = parseFloat(target.style.width) - (parseFloat(arrowArr[arrowIndex][6]) - parseFloat(nodeArr[nodeIndex][3])) - 37;
			$("#"+target.id).width(newWide);
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data_x')) || 0) + 0,
			y = (parseFloat(target.getAttribute('data_y')) || 0) + 0;
			
			// translate the element
			target.style.webkitTransform =
				target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';
	
			// update the position attributes
			target.setAttribute('data_x', x);
			target.setAttribute('data_y', y);
			
			storeXY(arrowArr,target.id);			
		}
		//TEMP YELLOW COLOR 
		document.getElementById(target.id).style.background = "rgba(255,255,0,.30)"; //Yellow
	}
	//warning();

}

function shortenArrows (){
	getStartArrowDependants(selection[0]);
	getEndArrowDependants(selection[0]);
	nodeIndex = recallArray(nodeArr,selection[0]);
	for (var i=0; i<startArrowDependants.length; i++){
		var target = document.getElementById(startArrowDependants[i]);
		var arrowIndex=recallArray(arrowArr,startArrowDependants[i]);
		if(target.getAttribute('direction')=='right'){		
			var newWide = parseFloat(target.style.width) - (parseFloat(nodeArr[nodeIndex][6])- parseFloat(arrowArr[arrowIndex][3]))-25;
			$("#"+target.id).width(newWide);
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data_x')) || 0) + 160,
			y = (parseFloat(target.getAttribute('data_y')) || 0) + 0;
			
			// translate the element
			target.style.webkitTransform =
				target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';
	
			// update the position attributes
			target.setAttribute('data_x', x);
			target.setAttribute('data_y', y);
			
			storeXY(arrowArr,target.id);			
		}
		//TEMP YELLOW COLOR 
		document.getElementById(target.id).style.background = "rgba(255,255,0,.30)"; //Yellow
	}
	for (var i=0; i<endArrowDependants.length; i++){
		var target = document.getElementById(endArrowDependants[i]);
		var arrowIndex=recallArray(arrowArr,endArrowDependants[i]);
		if(target.getAttribute('direction')=='left'){		
			var newWide = parseFloat(target.style.width) - (parseFloat(nodeArr[nodeIndex][6]) - parseFloat(arrowArr[arrowIndex][3]))-25;
			$("#"+target.id).width(newWide);
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data_x')) || 0) + 160,
			y = (parseFloat(target.getAttribute('data_y')) || 0) + 0;
			
			// translate the element
			target.style.webkitTransform =
				target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';
	
			// update the position attributes
			target.setAttribute('data_x', x);
			target.setAttribute('data_y', y);
			
			storeXY(arrowArr,target.id);			
		}
		//TEMP YELLOW COLOR 
		document.getElementById(target.id).style.background = "rgba(255,255,0,.30)"; //Yellow
	}
	//warning();
}

function spawnChild() {	
	index = recallArray("node",selection[0]);
	maxX = calcChildren(selection[0]);
	bootbox.prompt({
		closeButton:false,backdrop:true,animate:false,
		size:'small',
		title: "Add Node",
		value:"add text here",
		placeholder: "add text here",
		callback: function(result) {
			if (result != null) {
				//EXECUTE THIS ON OKAY///
				var text=result;
				pushToDict(text, "node");
								
				var nodeHeight = $('.drag-1').height(); //DOES NOT WORK
				var nodeHeight = 36; //FIXES THE PROBLEM, DOES NOT ALLOW RESIZE
				nodeHeightCorrected = nodeHeight+16;
				
				var gridHeight = document.getElementById('grid').clientHeight;
				var gridHeightCorrected = gridHeight - 90;
				var id=guid();
				var lX=maxX+160; //Shifts left
				//var lX=rX-100; Shifts Right
				var lY=22;
				var wide=100;			
				var tag = '<div class="nodeDraggable drag-drop drag-1 child can-drop placed verticallyScrollable belongsToNode" '+
							'id=' + id + ' data_x="' +lX+ '" data_y="' +lY+ '"' +
							'style="transform: translate(' + lX + 'px, ' + lY + 'px); -webkit-transform: translate(' + lX + 'px, ' + lY + 'px);">' +
								text +
							'<div class="verticalLine" style="top:'+nodeHeightCorrected+'px;height:'+gridHeightCorrected+'px;"></div>'+
					      '</div>';
				
				var dropOffLocation = document.getElementById("nodeChildrenDroppedOffHere");
				dropOffLocation.innerHTML += tag;
				index = nodeArr.push([document.getElementById(id),id,text,parseInt(lX),parseInt(lY),wide,parseInt(lX)+parseInt(wide),parseInt(lY)]);
				
				document.getElementById(id).classList.add('placed');
				document.getElementById(id).classList.add('verticallyScrollable');
				nodeArr[index-1][8] = selection[0];
				/////////////////////////
		 	} 		
		}
	});
	$("#box").autocomplete({
		source: nodeTags,
		autoFocus: true,
		delay: 0
	});
}

var childrenIDs = []
function calcChildren (uuid) {
	childrenIDs.length=0;
	if ($("#"+uuid).hasClass('hasNodes')){
		index = recallArray(nodeArr,uuid);
		var maxX = nodeArr[index][3]-160;
		for (var i=0; i<nodeArr.length; i++){
			if (nodeArr[i][1]==uuid){
				continue;
			}
			if (nodeArr[i][3]>=nodeArr[index][3] && nodeArr[i][3]<=nodeArr[index][6] && $("#"+uuid).hasClass('expanded')) {
				childrenIDs.push(nodeArr[i][1]);
				if (nodeArr[i][3]>maxX){
					maxX = nodeArr[i][3];
				}
				nodeArr[i][8] = uuid;
			}		
			if (nodeArr[i][3]>=nodeArr[index][3] && nodeArr[i][3]<=nodeArr[index][6] && $("#"+uuid).hasClass('collapsed') && $('#'+nodeArr[i][1]).css('display')=='none') {
				childrenIDs.push(nodeArr[i][1]);
				if (nodeArr[i][3]>maxX){
					maxX = nodeArr[i][3];
				}
				nodeArr[i][8] = uuid;
			}	
		}
		if (nodeArr[index][8] == null){
			nodeArr[index][8] = 0;
		}
		nodeArr[index].splice(9,1,childrenIDs.slice(0));
		
		return maxX
	}
}
function calcParent (uuid) {
	index = recallArray(nodeArr,uuid);
	var passed=false;
	for (var i=0;i<nodeArr.length; i++){
		if(nodeArr[i][1] == uuid){
			continue;
		}
		if ($("#"+nodeArr[i][1]).hasClass('hasNodes')){
			if (nodeArr[index][3]>=nodeArr[i][3] && nodeArr[index][3]<=nodeArr[i][6] && $("#"+uuid).hasClass('expanded')) {
				nodeArr[index][8] = nodeArr[i][1];
				passed = true;
			}
		}
	}
	if (passed == false){
		nodeArr[index][8] = 0;
	}
}
function getChildren (uuid) {
	childrenIDs.length=0;
	if ($("#"+uuid).hasClass('hasNodes')){
		index = recallArray(nodeArr,uuid);
		var maxX = nodeArr[index][3]-160;
		for (var i=0; i<nodeArr.length; i++){			
			if (nodeArr[i][8] == uuid){
				childrenIDs.push(nodeArr[i][1]);
			}			
		}
		return maxX
	}
}

function makeGroup () {
	bootbox.prompt({
		closeButton:false,backdrop:true,animate:false,
		size:'small',
		title: "Create Group",
		value:"add text here",
		placeholder: "add text here",
		callback: function(result) {
			if (result != null) {
				//EXECUTE THIS ON OKAY///
				for (var k = selection.length-1; k>=0; k--){
					for (var m = 1; m<=k; m++){
						if (document.getElementById(selection[m-1]).getAttribute("data_x")>document.getElementById(selection[m]).getAttribute("data_x")) {
							var swap = selection[m];
							selection[m] = selection[m-1];
							selection[m-1] = swap;
						}		            		
					}
				}
				clone = document.getElementById(selection[0]).cloneNode(true);	
				var dropOffLocation = document.getElementById("nodeChildrenDroppedOffHere");
				var clone = dropOffLocation.insertBefore(clone,dropOffLocation.parentNodes);
				clone.id = guid();
				$('#'+clone.id).removeClass('selected');
				nodeArr.push([clone,clone.id]);
				storeXY(nodeArr,clone.id);
				storeText (nodeArr,clone.id,result)
				for (var i=0; i<selection.length; i++){
					addChildrenToGroup(clone.id);
					if ($("#"+clone.id).hasClass("hasNodes")==false){ //first time		
            			$("#"+clone.id).addClass("hasNodes");
            			$("#"+clone.id).addClass("expanded");
            			document.getElementById(clone.id).style.zIndex = 9980;
            			//document.getElementById(clone.id).style.zIndex = document.getElementById(uuid).style.zIndex - 10;
					}
				}
				clearSelection();
				/////////////////////////
		 	} 		
		}
	});
	$("#box").autocomplete({
		source: nodeTags,
		autoFocus: true,
		delay: 0
	});
}


function shiftDown (event,dy) {
	target = event.target.offsetParent.parentElement
	var wide = parseInt(target.style.width);
	//newHeight = $("#contextMenuID").height()-1;
	//$("#contextMenuID").height(newHeight);
	target.style.width = parseInt(wide-1) + 'px';
	var allDependants = [];
	for (var i = 0; i<selection.length; i++){
		getStartArrowDependants(selection[i]);
		getEndArrowDependants(selection[i]);
		nodeDependants = startArrowDependants.concat(endArrowDependants);
		allDependants = allDependants.concat(nodeDependants);
	}
	for (var a = 0; a<allDependants.length; a++){
		for (var b = a+1; b<allDependants.length;b++){
			if(allDependants[a]===allDependants[b])
				allDependants.splice(b--,1);
		}
	}
	if (dy<0) {
		var minY = document.getElementById(allDependants[0]).getAttribute('data_y');
		for (var i=1; i<allDependants.length; i++){
			if (document.getElementById(allDependants[i]).getAttribute('data_y')<minY){
				minY = document.getElementById(allDependants[i]).getAttribute('data_y');
			}
		}
		if (minY<=102){
			return;
		}
	}
	for (var j=0; j<allDependants.length; j++){
		x = document.getElementById(allDependants[j]).getAttribute('data_x');
		y = document.getElementById(allDependants[j]).getAttribute('data_y');
		y = parseInt(y) + parseInt(dy) * 42
		
		document.getElementById(allDependants[j]).style.webkitTransform =
			document.getElementById(allDependants[j]).style.transform =
				'translate(' + x + 'px, ' + y + 'px)';

		document.getElementById(allDependants[j]).setAttribute('data_y',y);
			
		storeXY(nodeArr,allDependants[j]);
	}
}

//ARROW CONTEXT MENU
$(function(){
    $.contextMenu({
        selector: '.arrowPlaced', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        animation: {
        	duration: 100,show: "show", hide: "hide"
        },
        items: {
            "edit": {
            	name: "Edit", 
            	icon: "edit",
            	callback: function(key, options) {
                    renameArrow(this[0].id);
                }
            },
            /*"cut": {
            	name: "Cut", 
            	icon: "cut",
            	callback: function(key, options) {          		
        			clipboard.length = 0;
            		for (var i = 0; i<arrowArr.length; i++){
        				if (arrowArr[i][1] == this[0].id) {
        					clipboard.push(arrowArr[i]);
        					arrowArr.splice(i,1);
        					break;
        				}
        			}
            		this[0].parentNode.removeChild(this[0]);
                }
            },
            "copy": {
            	name: "Copy", 
            	icon: "copy",
            	callback: function(key, options) {          		
        			clipboard.length = 0;
            		for (var i = 0; i<nodeArr.length; i++){
        				if (arrowArr[i][1] == this[0].id) {
        					clipboard.push(arrowArr[i]);
        					break;
        				}
        			}
            	}	
            },
            "paste": {
            	name: "Paste", 
            	icon: "paste",
            	callback: function(key, options) {
        			var transposeX = Math.round((event.x)/160)*160-70;	
        			var transposeY = 22;
            		storeArray("nodeArr", i, guid(), clipboard[0][2], transposeX, transposeY, clipboard[0][5],null, null);
            	}	
            },*/
            "delete": {
            	name: "Delete", 
            	icon: "delete",
            	callback: function(key, options) { 
            		for (var i = 0; i<arrowArr.length; i++){
        				if (arrowArr[i][1] == this[0].id) {
        					deletedArrows.push(arrowArr[i]);
        					arrowArr.splice(i,1);
        					break;
        				}
        			}
            		this[0].parentNode.removeChild(this[0]);
            	}
            },
            "sep1": "---------",
            "quit": {
            	name: "Quit", 
            	icon: "quit"}
        }
    });
    
    $('.arrowPlaced').on('click', function(e){
        console.log('clicked', this);
    })
});

//TRASH CONTEXT MENU
$(function(){
    $.contextMenu({
        selector: '.trash', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        animation: {
        	duration: 100,show: "show", hide: "hide"
        },
        items: {        
            "emptyTrash": {
            	name: "Empty Trash", 
            	icon: "emptyTrash",
            	disabled: function(key, opt) {
            		if (deletedNodes.length + deletedArrows.length + deletedNotes.length == 0){
        				isEnabled = true;
        			}
            		else {
            			isEnabled = false;
            		}
            		return isEnabled
            	},
            	callback: function(key, options) { 
            		bootbox.confirm({
            			size:'small',
            			message:"<img src='triangle.png' height=15 width=15 style='margin-right:10px'>***This will empty the trash***",
            			callback: function(result){
            				if (result == true){
            					deletedNodes.length = 0;
                        		deletedArrows.length = 0;
                        		deletedNotes.length = 0;
                        		document.getElementById("trash").src = "trashCan.gif";
            				}
            			}
            		});
            	}
            },
            "sep1": "---------",
            "quit": {
            	name: "Quit", 
            	icon: "quit"}
        }
    });
    
    $('.trash').on('click', function(e){
        console.log('clicked', this);
    })
});


/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/