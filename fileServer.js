/**
 * 	Basic file server written in Node.
 	Displays requested pages and creates a xpMobileNode (thus a WebSocket)  
 	for each incoming connection. 
 	It listen on the standard 1337 port.
 	
	Created by Simone Kalb, Gian Maria Simbula
	Copyright 2013 CRS4
	eMail: kalb@crs4.it
	eMail: simbula@crs4.it
 * 
 */
var fs = require('fs'),
    http = require('http');
var xpMobileNode = require('xpMobileNode');     

var mapIPMobileNode = new Object();
var id = 0;
var port =  1337;


http.createServer(function (req, res) {
	
	if (req.url == '' || typeof(req.url) === undefined) {
		/**
		 * Just handles the case whether no input file is specified
		 * You can then try different mask like index.php, index.js, and so on. 
		 */
      	console.log("[xpFileServer] No input file specified, using default\n");
    	req.url = '/index.html';
    }
	
	fs.readFile(__dirname + req.url, function (err,data) {
		/**
		* It just sends to the remote resource the file it asked 
		* and prints a message to the console.
		*/
		if (err) {
			res.writeHead(404);
			console.log("[xpFileServer] Unable to deliver document\n");
			res.end(JSON.stringify(err));
			return;
		}
		var node = new xpMobileNode(id, res);
		node.init();
		mapIPMobileNode[req.connection.remoteAddress] = node;

		res.writeHead(200);
		res.end(data);	
	});
	id++;
}).listen(port);
console.log("Listening on port "+port);
/**
 * Listen to specified port
 */
