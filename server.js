'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
var url = require('url');
const request = require('request');

//const low = require('lowdb')
//const FileSync = require('lowdb/adapters/FileSync')

//const adapter = new FileSync('db.json')
//const db = low(adapter)

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// db.defaults({ posts: [], user: {} })
// .write();

// var superUser = db.get('user.super')
// .value();

// console.log(superUser);

// // if (superUser)
// // db.set('user.super', 'amil')
// // .write();

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
  "whoControls": "",
};

request('https://portfolioadmin.amilcruise.com/api/currentslide/1', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body);
  if (body) {
    state.state.route.slide = body.slideno || 0;
  }
});

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
    
    //console.log(payload);
    // if (payload.superUser) {
    //   superUser = payload.superUser;
    //   db.set('user.super', superUser).write();
    // } else {
    //   superUser = db.get('user.super')
    //   .value();
    // }

    //console.log(JSON.stringify(payload.user));

    //if (superUser !== payload.user) return;
    
    state = payload;
    wss.clients.forEach(function (client) {
      if (client !== ws) client.send(message);
    });

    request.post({url:'https://portfolioadmin.amilcruise.com/api/currentslide/update', 
                  form: {groupId:1, slideNumber: payload.state.route.slide || 0}}, 
                  (err,httpResponse,body) => {
                    console.log(body);

    });
  });

  ws.on('close', function close() {
    console.log('socket disconnected');
  });

  ws.send(
    JSON.stringify(state)
  );
});