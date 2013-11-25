/*
 *	Server Music Player DrumPad example xPlacesMobile
 *	This node receives actions and plays samples on remote client page.
 * 	Author: Simone Kalb <kalb@crs4.it> &copy; 2013
*/
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var xpMobileNode = require('xpMobileNode');
//var sNode = require('./specializedNode');
var xpTools = require('xpTools');

var mapIPMobileNode = new Object();
var id = 0;
var eventType = 0x99; 
var wsConnections = new Array();
var node;
var connection;
var fileNames = ["workit", "makeit", "doit", "makesus",
                 "hour", "ever", "after", "workis",
                 "over", "harder",
                 "better", "faster", "stronger"];

xpMobileNode.prototype.dispatchAction = function(action, objRef) {
    //console.log('Forwarding action'+ action['sample']+'At index'+ fileNames.indexOf(action['sample']));
    // Forwarding the received message to peers
    connection.sendUTF(fileNames.indexOf(action['sample']));        
  };

var server = http.createServer(function(request, response) {
  //console.log('Received request from ' + request.url);
  fs.readFile(__dirname + request.url, function (err,data) {
    if (err) {
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    } else {
        node = new xpMobileNode(id, response, "../../../JSON/configuration.json");
        node.init();    
        //console.log("Sending "+request.url);
        //IP + node
        mapIPMobileNode[request.connection.remoteAddress] = node;
				node.descriptor.sender_name = "MOBILE_LISTENER_0";
				node.descriptor.device_name = "MOBILE_LISTENER_0";
				node.listenDevices("XP_MOBILE_DEVICE", eventType, node);
        response.writeHead(200);
        response.end(data);  
    }
  });
  id++;
});

var indexOf = function (needle) {
    if (typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            var i = -1,
                index = -1;

            for (i = 0; i < this.length; i++) {
                if (this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle);
};


server.listen(1337, function() {
    console.log('Server is listening on port 1337.');
});

function isAllowedOrigin(origin) {
      // Put here remote client filter
      return true;
}

String.prototype.deleteWhiteSpaces = function() {
      return this.replace(/\s/g, '');
};


wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false // because security matters
});

wsServer.on('connection', function(webSocketConnection) {
  //console.log('Connection started.');
  wsConnections.push(webSocketConnection);
});

wsServer.on('request', function(request) {
  
  connection = isAllowedOrigin(request.origin) ?
    request.accept() : request.reject(); 

  connection.on('message', function(message) {
    
    //console.log('Received Message: ' + message.utf8Data);
    if (message.type === 'utf8') {
        if(request.socket.remoteAddress in mapIPMobileNode) { 

          switch(message.utf8Data) {
            case 'ack':
              response = '-1';
              connection.sendUTF(response);
              break;
            default:
              //response = 
              break;
          }
        }
    }
  });
 
  connection.on('close', function(reasonCode, description) {
      // The remote peer closed the connection
      console.log(connection.remoteAddress + ' has been disconnected.');
  });
});

