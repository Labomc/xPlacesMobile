/*
 *	Client Music Player DrumPad example xPlacesMobile
 *  This node sends based on input received from a remote page, served by itself.
 *  Launch with node app.js and modifiy configuration file to your IP address.
 *  Author: Simone Kalb <kalb@crs4.it> &copy; 2013
*/
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var xpTools = require('xpTools');
var xpMobileNode = require('xpMobileNode');


var mapIPMobileNode = new Object();
var id = 0;

var server = http.createServer(function(request, response) {
  //console.log('Received request from ' + request.url);
  fs.readFile(__dirname + request.url, function (err,data) {
    if (err) {
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    }
    if(request.url.substring(request.url.length-5, request.url.length) == '.html'){
        var node = new xpMobileNode(id, response, "../../JSON/configuration.json");
        node.init();    
        //console.log("Sending "+request.url);
        //IP + node
        mapIPMobileNode[request.connection.remoteAddress] = node;
        response.writeHead(200);
        response.end(data);  
    }
  });
  id++;
});

server.listen(3000, function() {
    //console.log('Server is listening on port 3000.');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false // because security matters :D
});

function isAllowedOrigin(origin) {
  // Put here remote client filter now just returns true
    return true;
}

String.prototype.deleteWhiteSpaces = function() {
    // Just for matching between remote contentHTML received and the event prepared to be sent 
    return this.replace(/\s/g, '');
};

wsServer.on('connection', function(webSocketConnection) {
  // Just to make sure that websocket is working properly
  //console.log('Connection started.');
});

wsServer.on('request', function(request) {

  var connection = isAllowedOrigin(request.origin) ?
    request.accept()
    : request.reject();

  connection.on('message', function(message) {

    var sample = '';
    //console.log('Received Message: ' + message.utf8Data);
    var  xpAction =new Object();

    if (message.type === 'utf8') {
        if(request.socket.remoteAddress in mapIPMobileNode) { 
        // One to one link with remote address
        var currentNode = mapIPMobileNode[request.socket.remoteAddress];
        sample = message.utf8Data.deleteWhiteSpaces().toLowerCase();
        // Preparing the xpAction to be sent
       	xpAction['action_type'] = 0x99;
      	xpAction['sample'] = sample;
      
        //console.log("Sample:" +xpAction['sample']+ " from: " +request.socket.remoteAddress);      
        currentNode.sendActionByType('XP_MOBILE_DEVICE', xpAction, currentNode);
    }
  }
});

connection.on('close', function(reasonCode, description) {
      // The remote peer closed the connection
      console.log(connection.remoteAddress + ' has been disconnected.');
  });
});
