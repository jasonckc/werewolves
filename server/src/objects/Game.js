import Player from "./Player";

/**
 * Game model.
 */
class Game {

    /**
     * Initializes the game.
     *
     * @param string A serialized game.
     */
    constructor(string = null) {
        this.manager = null;

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
        // Do not allow duplicate usernames.
        if (this.players[player.username] != null) {
            return false;
        }

        // The first added player is considered as the owner of the game.
        if (Object.keys(this.players).length == 0) {
            this.owner = player.username;
        }

        // Register the player.
        this.players[player.username] = player;

        // Save the game
        if (this.manager != null) {
            this.manager.save(this);
        }

        return true;
    }

    /**
     * Sends a message to all players.
     *
     * @param {string} event The name of the event.
     * @param {...any} args  The arguments of the message.
     */
    broadcast(event, ...args) {
        Object.values(this.players).forEach((player) => {
            player.sendMessage(event, ...args);
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
        var players = {};
        Object.entries(this.players).forEach(([key, value]) => {
            players[key] = value.toJSON();
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
     * @param {string} string The string representing the game.
     *
     * @returns This game.
     */
    deserialize(string) {
        // Parse the string.
        var obj = JSON.parse(string);

        // Deserialize the players.
        Object.entries(obj.players).forEach(([key, value]) => {
            this.players[key] = new Player(value);
        });

        // Deserialize other attributes.
        this.id = obj.id;
        this.owner = obj.owner;

        return this;
    }
}

export default Game;