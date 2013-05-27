// var express = require('express');
// var app = express();
// var server = require('http').createServer(app).listen(8000);
// var io = require('socket.io').listen(server);

// // app.set('views', __dirname + '/index.html');
// // app.engine('html', engines.mustache);
// // app.set('view engine', 'html');
// // app.get('/', function(request, response){
// //   response.render('index.html');
// // });

//  io.on('connection', function(chatSocket){
//     chatSocket.emit('init', {msg : 'hello! welcome to rpu'});
// });

var usernames = {};

var DEFAULT_USERNAME = 'Guest';
var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(7000);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(client){
  client.on('message', incoming);
  client.on('adduser', getUsername);

  function incoming(msg){
    client.get('username', function(err, username){
      if(!username)
        username = DEFAULT_USERNAME;
      var broadcastMsg = {
        msgOwner:username,
        msgContent:msg
      };
      client.emit('message', broadcastMsg);
      client.broadcast.emit('message', broadcastMsg);
    });
  }

  function getUsername(username){
    client.set('username', username);
    client.username = username;
    var systemInfo = {
      msgOwner:'System',
      msgContent:'Your current username is ' + username
    };
   client.emit('updateChat', username + ' has connected');
  }
});