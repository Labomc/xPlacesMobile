/**
 * DrumPad Mobile Webserver
 * Created by: Simone Kalb © 2013
 * eMail:  kalb@crs4.it, simone@nodelay.org
 * Description: It just serves the pages the phone is asking to
 */

//var express = require('express');
//var app = express();
var fs = require('fs');
var http = require('http');
//var server = require('http').Server(app);
//var server = require('http').Server();
var WebSocketServer = require('websocket').server;
//var io = require('socket.io').listen(server);
var stylus = require('stylus');
var nib = require('nib');
var xpMobileNode = require('xpMobileNode');
var xpTools = require('xpTools');

var mapIPMobileNode = new Object();
var id = 0;

/*
// Generic Appication configuration 
app.set('title', 'Drum Pad'); 
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('stylesheets', __dirname + '/stylesheets');
app.use(app.router);
app.use(express.static(__dirname + '/public'));
// Disabling it in development, enabling in production 
app.engine('jade', require('jade').__express);

// Logging
if (!module.parent) 
    app.use(express.logger('dev'));

app.get('/', function(req, res){
//  res.render('index', { title: 'DrumPad' });
  var node = new xpMobileNode(id, res, "../../JSON/configuration.json");
  mapIPMobileNode[req.connection.remoteAddress] = node;
  node.init();
  console.log('Node Created\n');
  res.sendfile('index.html');
});

*/
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
        response.writeHead(200);
        response.end(data);  
    }
  });
  id++;
}).listen(3000);

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var connectionCounter = 0;
var activeConnections = {};

wsServer.on('connect', function(websocket) {
  console.log("Websocket initialized");
  var id = connectionCounter++;
  activeConnections[id] = websocket;
  websocket.id = id; 
});

wsServer.on('request', function(request) {
    var connection = request.accept(request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.send("Server Says: Connected.");
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
          console.log("Data Received");
          console.log(message.utf8Data);
        } else {
          console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        }
    });
    
    connection.on('close', function(reasonCode, description) { 
          console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });         
  });

/*
// Handling server errors
app.use(function(err, req, res, next){
  console.log('%s %s', req.method, req.url);
  res.send(500, '500 Internal Server Error');
  next();
});

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

io.sockets.on('connection', function (socket) {
  console.log("We are connected\n");
  socket.emit('message', { data: 'Hello world\n' });
  socket.on('news', function (data) {
    console.log(data);
  });
});

io.sockets.on('connection', function (socket) {
    console.log("Websocket Initialized");
    socket.on('message', function (message) {
        console.log(message);
        socket.send('Message was received');
    });
    socket.emit('message', { data: 'Hello world\n' });
});
*/

//app.listen(3000);
console.log("-----------------------------------------------------------------");
console.log(" DrumPad instance created and initialized correctly on port "+ server.port);
console.log("-----------------------------------------------------------------");  