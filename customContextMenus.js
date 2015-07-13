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
            		document.getElementById("titleBar").innerHTML = '<div class="center" style="width:35%;"><p style = "cursor:pointer;display:inline;margin-right:15px;font-family:Arial Black; line-height:10px;" onclick="resetTitleBar();">X</p><input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(1);">Import!</button><button style = "margin-left:10px;display:inline;" onclick="alert(textFromFileLoaded);">Source</button></div>';
            	}
            },
            "sep2": "---------",
            "quit": {
            	name: "Quit", 
            	icon: "quit"}
        }
    });
    
    $('.nodeDropzone').on('click', function(e){
        console.log('clicked', this);
    })
});

//NODE CONTEXT MENU
$(function(){
    $.contextMenu({
        selector: '.placed', 
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
	        		document.getElementById("trash").src = "trashCanFull.png";
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
	    	        		document.getElementById("trash").src = "trashCanFull.png";
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
	    	        		document.getElementById("trash").src = "trashCanFull.png";
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
	    	        		document.getElementById("trash").src = "trashCanFull.png";
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
            		document.getElementById("titleBar").innerHTML = '<div class="center" style="width:29%"><p style = "cursor:pointer;display:inline;margin-right:15px;font-family:Arial Black; line-height:10px;" onclick="resetTitleBar();">X</p>Export Name: <input id="exportFileName" type="text" value='+text+'><button style = "display:inline;" onclick="saveFile($(\'#exportFileName\').val());">Confirm!</button><button style = "margin-left:10px;display:inline;" onclick="alert(m);">Source</button></div>';
            		$("#exportFileName").selectRange(0,text.length-4);
            		$("#exportFileName").keyup( function(e) {
            			if (e.keyCode == 13){
            				exportName = $("#exportFileName").val();
            				saveFile(exportName);
            			}
            		});
            	}
            },
            "import": {
            	name: "Import", 
            	icon: "import",
            	callback: function(key, options) { 
            		document.getElementById("titleBar").innerHTML = '<div class="center" style="width:35%;"><p style = "cursor:pointer;display:inline;margin-right:15px;font-family:Arial Black; line-height:10px;" onclick="resetTitleBar();">X</p><input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(1);">Import!</button><button style = "margin-left:10px;display:inline;" onclick="alert(textFromFileLoaded);">Source</button></div>';
            	}
            },
            "sep2": "---------",
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
                        		document.getElementById("trash").src = "trashCan.png";
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