#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var xpMobileNode = require('xpMobileNode');
var xpTools = require('xpTools');

var mapIPMobileNode = new Object();
var id = 0;

var server = http.createServer(function(request, response) {
  console.log('Received request from ' + request.url);
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
        response.writeHead(200);
        response.end(data);  
    }
  });
  id++;
});

server.listen(3000, function() {
    console.log('Server is listening on port 3000.');
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
    request.accept()
    : request.reject();

  connection.on('message', function(message) {

    var response = '';
    console.log('Received Message: ' + message.utf8Data);
    var eventToSend = new Object();


    if (message.type === 'utf8') {
        if(request.socket.remoteAddress in mapIPMobileNode) { 
        var currentNode = mapIPMobileNode[request.socket.remoteAddress];
        response = message.utf8Data.deleteWhiteSpaces().toLowerCase();
        eventToSend['__event_type'] = 0x10 << 5;
        eventToSend['sample'] = response;
      
        console.log("Sample:" +eventToSend['sample']+ " from: " +request.socket.remoteAddress);      
        
         
        currentNode.notifyListeners(eventToSend);
      
        connection.sendUTF(response);
    }
  }
});
  connection.on('close', function(reasonCode, description) {
      console.log(connection.remoteAddress + ' has been disconnected.');
  });
});