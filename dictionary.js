//Contains dictionary (in form of arrays, implementing databases in the future) and functions to append new terms to them

var nodeTags = [
                 "Order Trigger System",
                 "MSO",
                 "SDN-C",
                 "A&AI",
                 "PO",
                 "Customer Request"
		];	
var arrowTags = [
                "Request",
                "Create a service with parameters",
                "Ok",
                "Start BPEL",
                "Get service instance ID",
                "Service instance ID",
                "Service configuration operation reserve with parameters",
                "Sanity check",
                "Compute assign phase",
                "Service topology operation assign",
                "Assign resources",
                "Future LAN",
                "Service Config Operation Activate",
                "Post service instance ID",
                
                "Service instance ready (notification)",
                "Assign resources",
                "Future LAN",
                "Service Config Operation Activate",
                "Post service instance ID"
];
var noteTags = [
                "alpha",
                "bravo",
                "charlie",
                "delta",
                "echo",
                "fox",
                "golf",
                "hotel",
                "item",
                "jump",
                "kappa",
                "lion",
                "man"
];

function pushToDict(innerText,type){
	if (type=="node" && nodeTags.indexOf(innerText) == -1){
		nodeTags.push(innerText);
	}
	else if (type=="arrow" && arrowTags.indexOf(innerText) == -1){
		arrowTags.push(innerText);
	}
	else if (type=="note" && noteTags.indexOf(innerText) == -1){
		noteTags.push(innerText);
	}
}


/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/