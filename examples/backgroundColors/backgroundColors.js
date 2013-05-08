/**
 *	@overview Test application backgroundColor.js
 *
 *	@copyright <a href="http://www.crs4.it">CRS4 2013</a>
 *	@author Simone Kalb <kalb@crs4.it> 
 *	@author Gian Maria Simbula <simbula@crs4.it>
 *	
 *	@summary: Original work by Gian Maria Simbula
 *	eMail: simbula@sardegnaricerche.it
 *	eMail: simbula@crs4.it 
 */
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var xpMobileNode = require('xpMobileNode');

var id = 0;
var mapIPMobileNode = new Object();

var server = http.createServer(function(request, response) {
		fs.readFile(__dirname + "/backgroundColor.html", function (err,data) {
			 if (err) {
		      response.writeHead(404);
		      response.end(JSON.stringify(err));
		      return;
	    	}
	    	// Initialize Color
	    	var bgColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	    	var node = new xpMobileNode(id, response, "../../JSON/configuration.json");
	  		node.init();  	
	  		
	  		//IP + node
	  		mapIPMobileNode[request.connection.remoteAddress] = node;
		  		
	    	response.writeHead(200);
			var dataString = data.toString('utf8');	   
	    	dataString = dataString.replace("__SUBSTITUTE::ME__", bgColor);
	    	var newData = dataString.toString("binary");
	    	response.end(new Buffer(newData, "binary"));
	    	var xpAction = new Object();
	   		xpAction['action_type'] = 0x11;
	    	xpAction['background_color'] = bgColor;
	    	node.sendActionByName('COLORS_BACKGROUND', xpAction, node);
	    	id++;
	    	
	    });
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
        
      
        }
        else if (message.type === 'binary') {
           
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        //Deleting node from map to  allow a new connection from the same IP
             
        var xpAction = new Object();
	    xpAction['action_type'] = 0x22;
	    var existingNode = mapIPMobileNode[request.socket._peername.address];
	    
        try {
        	existingNode.sendActionByName('COLORS_BACKGROUND', xpAction, existingNode);
	       	
	       	try {
	       		var timeoutFunc = function(node) {
		        	node.delete();
		        }
		        setTimeout(timeoutFunc, 10000, existingNode);
		        
		        delete mapIPMobileNode[request.socket._peername.address];
	       	}
	       	catch(otherErr) {
				console.log(otherErr);
	       	}
        }
        catch(err) {
        	console.log(err);
        }
    });
});
