/*
 *	Server Music Player DrumPad example xPlacesMobile
 *	This node receives actions and plays samples on remote client page.
 * 	Author: Simone Kalb <kalb@crs4.it> &copy; 2013
*/
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var xpMobileNode = require('xpMobileNode');
var xpTools = require('xpTools');

var mapIPMobileNode = new Object();
var id = 0;

var node;

var server = http.createServer(function(request, response) {
  console.log('Received request from ' + request.url);
  fs.readFile(__dirname + request.url, function (err,data) {
    if (err) {
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    } else {
        node = new xpMobileNode(id, response, "../../../JSON/configuration.json");
        node.init();    
        console.log("Sending "+request.url);
        //IP + node
        mapIPMobileNode[request.connection.remoteAddress] = node;
				node.descriptor.sender_name = "MOBILE_LISTENER_0";
				node.descriptor.device_name = "MOBILE_LISTENER_0";
				var eventType = 0x99; 
				node.listenDevices("XP_MOBILE_DEVICE", eventType, node);
        response.writeHead(200);
        response.end(data);  
    }
  });
  id++;
});

server.listen(1337, function() {
    console.log('Server is listening on port 1337.');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false // because security matters
});

function isAllowedOrigin(origin) {
  // Put here remote client filter
    return true;
}

String.prototype.deleteWhiteSpaces = function() {
    return this.replace(/\s/g, '');
};

wsServer.on('connection', function(webSocketConnection) {
  console.log('Connection started.');
});

wsServer.on('request', function(request) {
  
  var connection = isAllowedOrigin(request.origin) ?
    request.accept() : request.reject(); 

  connection.on('message', function(message) {
    
    console.log('Received Message: ' + message.utf8Data);
    if (message.type === 'utf8') {
        if(request.socket.remoteAddress in mapIPMobileNode) { 

          switch(message.utf8Data) {
            case 'ack':
              response = 'play';
              connection.sendUTF(response);
              break;
            case 'play':
              response = 'play';
              connection.sendUTF(response);
              break;
            case 'stop':
              response = 'stop';
              connection.sendUTF(response);
              break;
            case 'harder':
              response = 'harder';
              connection.sendUTF(response);  
            default:
              break;
          }
    }
  }
  xpMobileNode.prototype.dispatchAction = function(action, objRef) {
    // Forwarding the received message to peers
    connection.sendUTF(action['sample']);      
  };
});
  connection.on('close', function(reasonCode, description) {
      // The remote peer closed the connection
      console.log(connection.remoteAddress + ' has been disconnected.');
  });
});


