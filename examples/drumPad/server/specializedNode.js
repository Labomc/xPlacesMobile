var xpMobileNode = require('xpMobileNode');
var client, id = 0;
var eventType = 0x99;

function specializedNode() {
	xpMobileNode.apply(this, Array.prototype.slice.call(arguments)); 
};

specializedNode.prototype = new xpMobileNode(id, client, '../../../JSON/configuration.json');

specializedNode.prototype.initialize = function() {
	this.descriptor.sender_name = "XP_SPECIALIZED_NODE";
	this.descriptor.device_name = "XP_SPECIALIZED_NODE";
	xpMobileNode.prototype.init.call();
};

specializedNode.prototype.dispatchAction = function(xpAction, objRef) {
	console.log(xpAction['sample']);
};

var myNode = new specializedNode(id, client, '../../../JSON/configuration.json');
myNode.initialize();
myNode.listenDevices('XP_MOBILE_DEVICE', eventType, myNode);
