/**
 *	@overview Test application acceleration.js
 *
 *	@copyright <a href="http://www.crs4.it">CRS4 2013</a>
 *	@author Simone Kalb <kalb@crs4.it> 
 *	@author Gian Maria Simbula <simbula@crs4.it>
 *	
 *	@summary: Original work by Gian Maria Simbula
 *	eMail: simbula@sardegnaricerche.it
 *	eMail: simbula@crs4.it 
 */
var fs = require('fs');
var http = require('http');
var WebSocketServer = require('websocket').server;
var xpMobileNode = require('xpMobileNode');
var xpTools = require('xpTools');

var mapIPMobileNode = new Object();

var x10DeviceNode = null;

var id = 0;

var server = http.createServer(function (request, response) {
  fs.readFile(__dirname + request.url, function (err,data) {
    if (err) {
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    }
    if(request.url.substring(request.url.length-5, request.url.length) == '.html'){
	    	var node = new xpMobileNode(id, response, "../../JSON/configuration.json");
	  		node.init();  	
	  		console.log("Sending "+request.url);
	  		//IP + node
	  		mapIPMobileNode[request.connection.remoteAddress] = node;
	  		if(x10DeviceNode == null) {
	  			x10DeviceNode = node.lookupDeviceWaiting('x10Device', node);
	  		}
	  		if(x10DeviceNode != null) {
		  		var lampOnAction = new Object();
		  		lampOnAction['action_type'] = 0x01;
			    lampOnAction['HOUSE_CODE'] = 'D';
			    lampOnAction['DEVICE_CODE'] = '3';
		  		node.sendActionByName('x10Device', lampOnAction, node);
		  		//node.sendActionByProxy(x10DeviceNode, lampOnAction, node);
		  		
		  		var funcLampOff = function(nodeApp) {
		  			var lampOffAction = new Object();
			  		lampOffAction['action_type'] = (0x02);
				    lampOffAction['HOUSE_CODE'] = 'D';
				    lampOffAction['DEVICE_CODE'] = '3';
				    console.log("Sending a light off action");
		  			nodeApp.sendActionByName('x10Device', lampOffAction, nodeApp);
		  			//nodeApp.sendActionByProxy(x10DeviceNode, lampOffAction, nodeApp);
		  		};
	  		    setTimeout(funcLampOff, 10000, node);
  		   	}
  		   

	 }
	 response.writeHead(200);
     response.end(data);	
  });
  id++;
}).listen(1337);


wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

var connectionCounter = 0;
var activeConnections = {};

wsServer.on('connect', function(websocket) {
	var id = connectionCounter++;
	activeConnections[id] = websocket;
	websocket.id = id; 
});

wsServer.on('request', function(request) {
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
        	
        	//Extract related node using remoteAddress
        	
        	var acceleration = message.utf8Data;
        	var objReceived = JSON.parse(acceleration);
	
			if(request.socket.remoteAddress in mapIPMobileNode) {	
				var currentNode = mapIPMobileNode[request.socket.remoteAddress];
				var eventToSend = new Object();
				eventToSend['__event_type'] = 0x09 << 5;
				eventToSend['x'] = objReceived.x;
				eventToSend['y'] = objReceived.y;
	        	       	
	            //console.log("X:" +objReceived.x+ " Y:" +objReceived.y+" from: " +request.socket.remoteAddress);
				
	        	currentNode.notifyListeners(eventToSend);
        	}

			var toResend = new Object();
			toResend['x'] = objReceived.x;
			toResend['y'] = objReceived.y;
			toResend['z'] = objReceived.z;
			//updateJSON(objReceived, './JSON/roundcar.json');
			toResend['IP'] = request.socket.remoteAddress;
			
			
			for (conn in activeConnections) {
				activeConnections[conn].send(JSON.stringify(toResend));
			}
			
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    
    connection.on('close', function(reasonCode, description) {
        
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        
        //Deleting node from map to allow a new connection from the same IP
        //var nodeInstance = mapIPMobileNode[request.socket._peername.address];
       	//nodeInstance.delete();
        //delete mapIPMobileNode[request.socket.remoteAddress];
    });
    
    function updateJSON(objReceived, JSONFile){
		var xCoordinate = new Array(); 
		var yCoordinate = new Array();
		var currentJSONFile = fs.readFileSync(JSONFile, 'utf8');
		console.log(currentJSONFile);
		
		if(currentJSONFile == undefined) {
			var initString = new Object();
			initString.x = initString.y = 0;
			fs.writeFile(JSONFile, JSON.stringify(initString), function(err) {
    			if(err) {
        			console.log(err);
   				} else {
     				console.log("JSON file initialized\n");
    			}
			});
			//console.log(currentJSONFile);
		}
		
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
});