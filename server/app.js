import Werewolves from './src/Werewolves';
import socket from "socket.io";

var io = socket.listen('8000');
var ww = new Werewolves();

io.on("connection", (socket) => {

  console.log('Connected!');

  socket.on('createGame', () => {
    ww.createGame(socket);
  });

});