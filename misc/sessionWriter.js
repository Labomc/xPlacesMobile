/*
 
    Receives acceleration values from a remote source 
    and write it into a JSON file.
 	
 	Created by Simone Kalb
	Copyright 2013 CRS4
	eMail: kalb@crs4.it
 	
 	
 */
 var fs = require('fs');
 
 var initVar = initializeJSON("./JSON/session.json");
 
 function initializeJSON(JSONFile) {
 	if(JSONFile == undefined) {
			var initString = new Object();
			initString.x = initString.y = 0;
			
			fs.writeFile(JSONFile, JSON.stringify(initString), function(err) {
    			if(err) {
        			console.log(err);
   				} else {
     				console.log("JSON file initialized\n");
    			}
			});
			
		}
 }
 
 function updateJSON(objReceived, JSONFile){
		var xCoordinate = new Array(); 
		var yCoordinate = new Array();
		var currentJSONFile = fs.readFileSync(JSONFile, 'utf8');
		console.log(currentJSONFile);
		
		xCoordinate = JSON.parse(currentJSONFile).x;
		yCoordinate = JSON.parse(currentJSONFile).y;
		xCoordinate.push(parseInt(objReceived.x));
		yCoordinate.push(parseInt(objReceived.y));
		
		var fileToWriteDown = new Object();
		fileToWriteDown.x = xCoordinate;
		fileToWriteDown.y = yCoordinate;
		fileToWriteDown = JSON.stringify(fileToWriteDown);
		fs.writeFile(JSONFile, fileToWriteDown, function(err) {
    		if(err) {
        		console.log(err);
   			} else {
     			console.log("The file is saved!");
    		}
		});
    }
    
 module.exports.initializeJSON = initializeJSON;
 module.exports.updateJSON = updateJSON;
 