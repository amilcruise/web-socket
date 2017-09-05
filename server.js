// var WebSocketServer = require("ws").Server
// var http = require("http")
// var express = require("express")
// var app = express()
// var port = process.env.PORT || 5000
// var state = {
//   "state": {
//     "fragment": {
//       "fragments": {}
//     },
//     "route": {
//       "slide": 0,
//       "params": []
//     },
//     "style": {
//       "globalStyleSet": true
//     }
//   },
//   "type": "REMOTE_STATE"
// };

// app.use(express.static(__dirname + "/"))

// var server = http.createServer(app)
// server.listen(port)

// console.log("http server listening on %d", port)

// var wss = new WebSocketServer({server: server})
// console.log("websocket server created")

// // wss.on("connection", function(ws) {
// //   var id = setInterval(function() {
// //     ws.send(JSON.stringify(new Date()), function() {  })
// //   }, 1000)

// //   console.log("websocket connection open")

// //   ws.on("close", function() {
// //     console.log("websocket connection close")
// //     clearInterval(id)
// //   })
// // })

// wss.on('connection', function connection(ws) {
//   const location = url.parse(ws.upgradeReq.url, true);
//   // you might use location.query.access_token to authenticate or share sessions
//   // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
//   ws.on('message', function incoming(message) {
//     const payload = JSON.parse(message);
//     state = payload;
//     wss.clients.forEach(function (client) {
//       if (client !== ws) client.send(message);
//     });
//   });

//   ws.on('close', function close() {
//     console.log('socket disconnected');
//   });

//   ws.send(
//     JSON.stringify(state)
//   );
// });

// server.on('request', app);
// server.listen(
//   port, 
//   host,
//   function (err) { 
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(`Listening on http://${host}:${server.address().port}`) 
//   }
// );
'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);