/**
 * DrumPad Mobile Webserver
 * Created by: Simone Kalb © 2013
 * eMail:  kalb@crs4.it, simone@nodelay.org
 * Description: It just serves the pages the phone is asking to
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var stylus = require('stylus');
var nib = require('nib');
var xpMobileNode = require('xpMobileNode');
var xpTools = require('xpTools');

var mapIPMobileNode = new Object();
var id = 0;

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

app.get('/data', function(req, res){
//  res.render('index', { title: 'DrumPad' });
  var node = new xpMobileNode(id, res, "../../JSON/configuration.json");
  mapIPMobileNode[req.connection.remoteAddress] = node;
  node.init();
  console.log('Node Created\n');
  res.sendfile('index.html');
});

app.get('/', function(req, res){
  res.sendfile('index.html');
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
*/
io.sockets.on('connection', function (socket) {
    socket.on('message', function (message) {
        console.log(message);
        socket.send('message was received');
    });
});

app.listen(3000);
console.log("-----------------------------------------------------------------");
console.log(" DrumPad instance created and initialized correctly on port 3000");
console.log("-----------------------------------------------------------------");  