import Werewolves from './src/Werewolves';
import socket from "socket.io";

var io = socket.listen('8000');
var ww = new Werewolves();

io.on("connection", (socket) => {

  var player = null;

  socket.on('create-game', async (username) => {
    player = await ww.createGame(username, socket);
  });

  socket.on('join-game', async (gameId, username) => {
    player = await ww.joinGame(gameId, username, socket);
  });

});