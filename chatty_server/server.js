
const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
var uuid = require('uuid/v1');


// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });


//BROADCAST NEW NEW MESSAGES TO ALL USERS(CLIENTS)
wss.broadcast = function broadcast(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState == WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }

  });
};

let humans = 0
wss.on('connection', (ws) => {
  console.log('Client connected');
          humans++;
          wss.broadcast({
            humans:humans,
            type:"humanNumber"})
          console.log(humans)


// const numberClient = JSON.parse(wss.clients)
//   type: ClientCount
//   size: numberClient.size
      //COUNT CLIENT NUMBER

  ws.on('message', (message) => {
    console.log('received: %s', message);
    let messageObj = JSON.parse(message);
    var uuid1 = uuid();

    console.log(messageObj);

    switch(messageObj.type) {
      case "message":
        var newMessage = {
          type: 'incomingMessage',
          username: messageObj.username,
          content: messageObj.content,
          id: uuid1
        };
        console.log(newMessage);
        wss.broadcast(newMessage);
        break;
      case "nameChange":
        var newNotification = {
          type: 'incomingNotification',
          username: messageObj.username,
          id: uuid1
        }
        wss.broadcast(newNotification);
        console.log(newNotification);
        break;
    }


  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {console.log('Client disconnected')
     humans--;
     wss.broadcast({
      humans:humans,
      type:"humanNumber"})
     console.log(humans);
     });

});