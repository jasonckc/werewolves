import "core-js/stable";
import "regenerator-runtime/runtime";
import socket from "socket.io";
import { Tedis } from "tedis";
import * as settings from './settings';
import * as url from "url";
import express from "express";
import http from 'http';
import Werewolves from "./game/Werewolves";
import path from "path";

/**
 * ----------------------------------------------------------------------------
 * Connect to Redis
 * ----------------------------------------------------------------------------
 */
var redis = null;
if (process.env.REDISTOGO_URL) {
    var rtg = url.parse(process.env.REDISTOGO_URL);
    console.log(rtg);
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

/**
 * ----------------------------------------------------------------------------
 * Configure the socket server
 * ----------------------------------------------------------------------------
 */
var app = express();
var srv = http.createServer(app);
var io = socket(srv, { origins: '*:*' });
var ww = new Werewolves(redis);

// Serve the react app.
app.use(express.static(path.join(__dirname, '/../../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
});

// Handle socket messages.
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

/**
 * ----------------------------------------------------------------------------
 * Start the socket server
 * ----------------------------------------------------------------------------
 */
var port = process.env.PORT || 8080;
srv.listen(port, () => {
    console.log('listening on *:' + port);
});