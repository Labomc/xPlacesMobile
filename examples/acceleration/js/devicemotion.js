var socket = null;
var acceleration = new Object();
var remote_IP_port = "ws://156.148.36.14:1337";
socket = new WebSocket(remote_IP_port, "echo-protocol");

Ext.setup({
    onReady : function() {
        this.ui = new Ext.Panel({
            scroll: 'vertical',
            fullscreen: true,
            layout: 'fit',
            items: [{
                xtype: 'form',
                scroll: 'vertical',
                items: [{
                    xtype: 'fieldset',
                    title: 'Device Motion Data',
                    items: [{
                        xtype: 'sliderfield',
                        label: 'X',
                        id: 'X',
                        disabled: true,
                        minValue: -100,
                        maxValue: 100
                    }, {
                        xtype: 'sliderfield',
                        label: 'Y',
                        id: 'Y',
                        disabled: true,
                        minValue: -100,
                        maxValue: 100
                    }, {
                        xtype: 'sliderfield',
                        label: 'Z',
                        id: 'Z',
                        disabled: true,
                        minValue: -100,
                        maxValue: 100
                    }]
                }]
            }]
        });

        this.ui.doComponentLayout();

        if (!Ext.supports.DeviceMotion) {
            setTimeout(function() {
                Ext.Msg.alert('Not available', 'You need iOS 4.2 device with acceleration API.');
            }, 200);
        } else {
            var acc;

            window.ondevicemotion = function(e) {
                acc = e.accelerationIncludingGravity;
            }
			
            window.setInterval(function() { 
                Ext.getCmp('X').setValue(Math.round(10 * acc.x), 200);
                Ext.getCmp('Y').setValue(Math.round(10 * acc.y), 200);
                Ext.getCmp('Z').setValue(Math.round(10 * acc.z), 200);
                
 				
 				acceleration['x'] = Math.round(10 * acc.x).toString();
 				acceleration['y'] = Math.round(10 * acc.y).toString();
 				acceleration['z'] = Math.round(10 * acc.z).toString();
 				
 				socket.send(JSON.stringify(acceleration));
            }, 200);
        }
    }
});