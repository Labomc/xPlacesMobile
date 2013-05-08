/**
 *  @overview Standard echo server written in Node.
 *  Examples off this kind can be found at:
 *  http://cjihrig.com/blog/creating-your-own-node-js-websocket-echo-server/
 *  Modified to receive degree values from a remote mobile device and forward as xpEvent(s) to xPlaces network xpEventListener(s).
 *
 *  @copyright <a href="http://www.crs4.it">CRS4 2013</a>
 *  @author Simone Kalb <kalb@crs4.it> 
 *  @author Gian Maria Simbula <simbula@crs4.it>
 *  
 *  @summary: Original work by Gian Maria Simbula
 *  eMail: simbula@sardegnaricerche.it
 *  eMail: simbula@crs4.it 
 */

var http = require('http');
var fs = require('fs');
var WebSocketServer = require('websocket').server;
var xpMobileNode = require('xpMobileNode');

var id = 0;

var mapIPMobileNode = new Object();

var server = http.createServer(function(request, response) {
	fs.readFile(__dirname + request.url, function (err,data) {
		 if (err) {
	      response.writeHead(404);
	      response.end(JSON.stringify(err));
	      return;
    	}
    	console.log((new Date()) + ' Received request for ' + request.url);
    	
    	//Instance a new xpMobileNode only for the html request
    	if(request.url.substring(request.url.length-5, request.url.length) == '.html'){
	    	var node = new xpMobileNode(id, response, "../../JSON/configuration.json");
	  		node.init();  	
	  		
	  		//IP + node
	  		mapIPMobileNode[request.connection.remoteAddress] = node;
	  		
    	}
    	response.writeHead(200);
    	response.end(data);
    });
    id++;
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin 
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
    	
        if (message.type === 'utf8') {
        
        	//Extract related node using remoteAddress e tanti catzi		
        	var currentNode = mapIPMobileNode[request.socket.remoteAddress];
        	
			var eventToSend = new Object();
			eventToSend['__event_type'] = 0x1 << 5;
			eventToSend['degrees'] = message.utf8Data;
        	
        	currentNode.notifyListeners(eventToSend);
        
            console.log('Received Degrees: ' + message.utf8Data + " from Node " + currentNode.descriptor.device_name);
            //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        //Deleting node from map to allow a new connection from the same IP
        delete mapIPMobileNode[request.socket.remoteAddress];
    });
});