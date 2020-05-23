import Werewolves from './src/Werewolves';
import socket from "socket.io";
import { Tedis } from "tedis";
import * as settings from '../settings';
import * as url from "url";

var redis = null;
if (process.env.REDISTOGO_URL) {
    redis = new Tedis({
        host: rtg.hostname,
        port: rtg.port,
        password: rtg.auth.split(":")[1]
    });
} else {
    redis = new Tedis({
        host: settings.DEFAULT_REDIS_HOST,
        port: settings.DEFAULT_REDIS_PORT
    });
}

var io = socket.listen('8000', { origins: '*:*' });
var ww = new Werewolves(redis);

io.on("connection", (socket) => {

    var player = null;

    socket.on('create-game', async (username) => {
        player = await ww.createGame(username, socket);
    });

    socket.on('join-game', async (gameId, username) => {
        player = await ww.joinGame(gameId, username, socket);
    });

    socket.on('start-game', async () => {
        if (player != null) ww.startGame(player);
    });

    socket.on('poll-vote', async (option) => {
        if (player != null) ww.vote(player, option);
    });

});