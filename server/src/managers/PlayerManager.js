import Player from "../objects/Player";
import { Tedis } from "tedis";
import * as settings from '../../settings';
import Werewolves from "../Werewolves";

/**
 * Player manager.
 */
class PlayerManager {

    /**
     * Initializes the player manager.
     *
     * @param {Tedis}      redis The connection to redis.
     * @param {Werewolves} app   The application.
     */
    constructor(redis, app) {
        // Connect to redis.
        this._redis = redis;
        this.app = app;
        this._socketByPlayerId = {};
    }

    /**
     * Creates a player.
     *
     * @param {string} username The username of the player.
     * @param {socket} socket   The socket to communicate with the player.
     *
     * @returns The created player.
     */
    async create(username, socket) {
        // Load the last player identifier.
        var lastId = await this._redis
            .get('PlayerManager_Id')
            .catch((err) => { console.error(err); });

        lastId = lastId === null ? 0 : parseInt(lastId);

        // Instanciate the player object.
        var player = new Player(this.app);
        player.id = lastId + 1;
        player.username = username;

        // Save the last player identifier
        await this._redis
            .setex('PlayerManager_Id', settings.OBJECT_LIFESPAN, player.id)
            .catch((err) => { console.error(err); });

        // Save the socket.
        if (socket != null) {
            this._socketByPlayerId[player.id] = socket;
            socket.on('disconnect', () => { this._onDisconnect(player); });
        }

        // Return the player.
        return player;
    }

    /**
     * Sends a message to a player. If the player isn't connected, does nothing.
     *
     * @param {Player} player The message recipient.
     * @param {string} event  The event name.
     * @param {...any} args   The arguments of the message.
     */
    sendMessage(player, event, ...args) {
        var socket = this._socketByPlayerId[player.id];
        if (socket != null) {
            socket.emit(event, ...args);
        }
    }

    /**
     * Checks whether a player is online or not.
     *
     * @param {Player} player The player to check.
     */
    isPlayerOnline(player) {
        return this._socketByPlayerId[player.id] != null;
    }

    /**
     * Handles the disconnection of a player.
     *
     * @param {Player} player The player who was disconnected.
     */
    async _onDisconnect(player) {
        delete this._socketByPlayerId[player.id];
        if (player.gameId != null) {
            var game = await this.app.games.get(player.gameId);
            if (game != null) game.removePlayer(player.username);
        }
    }
}

export default PlayerManager;