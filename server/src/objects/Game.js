import Player from "./Player";
import Werewolves from "../Werewolves";

/**
 * Game model.
 */
class Game {

    /**
     * Initializes the game.
     *
     * @param {Werewolves} app The application.
     * @param string A serialized game.
     */
    constructor(app, string = null) {
        this.app = app;

        this.id = null;
        this.players = {};
        this.owner = null;

        if (string != null) {
            this.deserialize(string);
        }
    }

    /**
     * Adds a player to the game.
     *
     * @param {Player} player The player to add.
     *
     * @returns True if the player was added, false otherwise.
     */
    addPlayer(player) {
        player.username += '_' + Object.keys(this.players).length;

        // Do not allow duplicate usernames.
        if (this.players[player.username] != null) {
            player.sendMessage('join-failed');
            return false;
        }

        // The first added player is considered as the owner of the game.
        if (Object.keys(this.players).length == 0) {
            this.owner = player.username;
        }

        // Register the player.
        this.players[player.username] = player;
        player.gameId = this.id;

        // Save the game
        this.app.games.save(this);

        // Notify the player.
        player.sendMessage('join-success', this.toJSON());

        // Notify the other players in the game.
        var skipSender = (p) => { return p.id != player.id; };
        this.broadcastTo(skipSender, 'player-joined', player.toJSON());

        return true;
    }

    /**
     * Removes a player from the game.
     *
     * @param {string} username The username of the player to remove.
     */
    removePlayer(username) {
        if (this.players[username] != null) {
            this.broadcast('player-left', this.players[username]);
            delete(this.players[username]);
            this.app.games.save(this);
        }
    }

    /**
     * Sends a message to all players.
     *
     * @param {string} event The name of the event.
     * @param {...any} args  The arguments of the message.
     */
    broadcast(event, ...args) {
        this.broadcastTo(() => { return true; }, event, ...args);
    }

    /**
     * Sends a message to a selection of players.
     *
     * @param {(Player) => boolean} filter A callback that returns true if the
     *                                     message must be sent to the given
     *                                     player.
     * @param {string}              event  The name of the event.
     * @param {...any}              args   The arguments of the message.
     */
    broadcastTo(filter, event, ...args) {
        Object.values(this.players).forEach((player) => {
            if (filter(player)) {
                player.sendMessage(event, ...args);
            }
        });
    }

    /**
     * Converts this object to an object that can be serialized as a JSON
     * string.
     *
     * @returns An object.
     */
    toJSON() {
        // Convert the players to JSON.
        var players = [];
        Object.values(this.players).forEach((player) => {
            players.push(player);
        });

        // Convert to JSON.
        return {
            id: this.id,
            players: players,
            owner: this.owner
        }
    }

    /**
     * Serializes the game.
     *
     * @returns A string representing the game.
     */
    serialize() {
        return JSON.stringify(this.toJSON());
    }

    /**
     * Deserializes a game.
     *
     * @param {string|object} string The string representing the game.
     *
     * @returns This game.
     */
    deserialize(string) {
        // Parse the string.
        var obj = string;
        if (typeof obj === 'string') {
            obj = JSON.parse(string);
        }

        // Deserialize the game's attributes.
        this.id = obj.id;
        this.owner = obj.owner;

        // Deserialize the players.
        obj.players.forEach((p) => {
            this.players[p.username] = new Player(this.app, p);
            this.players[p.username].gameId = this.id;
        });

        return this;
    }
}

export default Game;