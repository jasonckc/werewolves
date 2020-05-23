import "core-js/stable";
import "regenerator-runtime/runtime";
import socket from "socket.io";
import { Tedis } from "tedis";
import * as settings from './settings';
import * as url from "url";
import express from "express";
import http from 'http';
import Werewolves from "./game/Werewolves";

/**
 * ----------------------------------------------------------------------------
 * Connect to Redis
 * ----------------------------------------------------------------------------
 */
var redis = null;
if (process.env.REDISTOGO_URL) {
    var rtg = url.parse(process.env.REDISTOGO_URL);
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

// Test route, to check that the server is up.
app.get('/', (req, res) => {
    res.send('Socket server')
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
srv.listen(8000, () => {
    console.log('listening on *:8000');
});