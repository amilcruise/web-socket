'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
var url = require('url');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

var state = {
  "state": {
    "fragment": {
      "fragments": {}
    },
    "route": {
      "slide": 0,
      "params": []
    },
    "style": {
      "globalStyleSet": true
    }
  },
  "type": "REMOTE_STATE",
  "user": "amil",
  "superUser": "amil"
};

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
// });

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('message', function incoming(message) {
    const payload = JSON.parse(message);

    if (payload.superUser !== payload.user) return;

    state = payload;
    wss.clients.forEach(function (client) {
      if (client !== ws) client.send(message);
    });
  });

  ws.on('close', function close() {
    console.log('socket disconnected');
  });

  ws.send(
    JSON.stringify(state)
  );
});