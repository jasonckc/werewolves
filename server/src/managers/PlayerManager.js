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
     * @param {Werewolves} app The application.
     */
    constructor(app) {
        // Connect to redis.
        this._redis = new Tedis({
            port: settings.REDIS_PORT,
            host: settings.REDIS_HOST
        });

        // Load the last player identifier.
        var key = 'PlayerManager_lastPlayerId';
        this._redis.get(key)
            .then((value) => {
                value = value === null ? 0 : parseInt(value);
                this._lastPlayerId = value;
            })
            .catch((err) => {
                console.error(err);
                this._lastPlayerId = 0;
            });

        // Initialize other attributes
        this.app = app;
        this._lastPlayerId = null;
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
    create(username, socket) {
        // The manager is not yet initialized.
        if (this._lastPlayerId == null) {
            return null;
        }

        // Instanciate the player object.
        var player = new Player(this.app);
        player.id = this._lastPlayerId++;
        player.username = username;
        player.manager = this;

        // Save the last player identifier
        this._redis
            .set('PlayerManager_lastPlayerId', this._lastPlayerId)
            .catch((err) => { console.error(err); });

        // Save the socket.
        this._socketByPlayerId[player.id] = socket;
        socket.on('disconnect', () => { this._onDisconnect(player); });

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