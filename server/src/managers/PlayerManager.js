import Player from "../objects/Player";
import { Tedis } from "tedis";
import * as settings from '../../settings';

/**
 * Player manager.
 */
class PlayerManager {

    /**
     * Initializes the player manager.
     */
    constructor() {
        // Connect to redis.
        this._redis = new Tedis({
            port: settings.REDIS_PORT,
            host: settings.REDIS_HOST
        });

        // Load the last player identifier.
        var key = 'PlayerManager_lastPlayerId';
        this._redis.get(key).then((value) => {
            this._lastPlayerId = value == null ? 0 : parseInt(value);
        });

        // Initialize other attributes
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
        var player = new Player();
        player.id = this._lastPlayerId++;
        player.username = username;
        player.manager = this;

        // Save the last player identifier
        var key = 'PlayerManager_lastPlayerId';
        this._redis.set(key, this._lastPlayerId);

        // Save the socket.
        this._socketByPlayerId[player.id] = socket;
        socket.on('disconnect', () => {
            delete this._socketByPlayerId[player.id];
        });

        // Save and return the player.
        this.save(player);
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
     * Saves a player.
     *
     * @param {Player} player The player to save.
     */
    save(player) {
        var key = 'Player_' + player.id;
        var val = player.serialize();
        this._redis.setex(key, settings.OBJECT_LIFESPAN, val);
    }
}

export default PlayerManager;