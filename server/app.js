import Werewolves from './src/Werewolves';
import socket from "socket.io";

var io = socket.listen('8000');
var ww = new Werewolves();

io.on("connection", (socket) => {

  socket.on('create-game', (username) => {
    ww.createGame(username, socket);
  });

  socket.on('join-game', (gameId, username) => {
    ww.joinGame(gameId, username, socket);
  });

});