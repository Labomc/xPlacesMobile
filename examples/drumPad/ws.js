(function() {
      var ws;  
      remote_IP_port = "ws://156.148.36.102:3000";
      ws = new WebSocket(remote_IP_port, "echo-protocol");
      console.log("Socket Opened!!!");

      ws.onopen = function(ev) {
        console.log('Connection opened.');
      }
      ws.onmessage = function(ev) {
        console.log('Response from server: ' + ev.data);
      }
      ws.onclose = function(ev) {
        console.log('Connection closed.');
      }
      ws.onerror = function(ev) {
        console.log('An error occurred. Sorry for that.');
      }

      WebSocket.prototype.sendMessage = function(msg) {
         this.send(msg);
         console.log('Message sent: ' + msg);
      }

      var sendBtn = document.getElementById('workit');
      sendBtn.addEventListener('click', function(ev) {
          var message = document.getElementById('message').value;
          ws.sendMessage(message);
          ev.preventDefault();
      });
})(); 