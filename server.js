var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
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
  "type": "REMOTE_STATE"
};

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

// wss.on("connection", function(ws) {
//   var id = setInterval(function() {
//     ws.send(JSON.stringify(new Date()), function() {  })
//   }, 1000)

//   console.log("websocket connection open")

//   ws.on("close", function() {
//     console.log("websocket connection close")
//     clearInterval(id)
//   })
// })

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('message', function incoming(message) {
    const payload = JSON.parse(message);
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