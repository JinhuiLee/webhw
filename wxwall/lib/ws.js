var WS_PORT = 10001;
var buffer=[];
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    for (var i=0;i<buffer.length;i++)
    {
	console.log("sent " +buffer[i]);
	ws.send(JSON.stringify(buffer[i]));
    }
    console.log("message n %d",buffer.length);
  });
  console.log('new client connected.');
});

wss.broadcast = function broadcast(data) {
  if (data.xml.Content=="clear") {
    buffer=[];
    return;
  }
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  });
};

module.exports = {
  wss: wss,
  buffer:buffer
};

console.log("Socket server runing at port: " + WS_PORT + ".");
