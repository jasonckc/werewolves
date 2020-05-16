/**
 * Player model.
 */
class Player {

    /**
     * Initializes the player.
     *
     * @param {Werewolves}      app    The application.
     * @param {string | object} string The string or object to deserialize.
     */
    constructor(app, string = null) {
        this.app = app;
        this.gameId = null;

        this.id = null;
        this.username = null;
        this.role = null;

        if (string != null) {
            this.deserialize(string);
        }
    }

    /**
     * Sends a message to this player.
     *
     * @param {string} event The name of the event.
     * @param {...any} args  The arguments of the message.
     */
    sendMessage(event, ...args) {
        if (this.app != null && this.id != null) {
            this.app.players.sendMessage(this, event, ...args);
        }
    }

    /**
     * Checks whether this player is online or not.
     *
     * @returns True if the player is online, false otherwise.
     */
    isOnline() {
        if (this.id != null && this.manager != null) {
            return this.app.players.isPlayerOnline(this);
        }

        return false;
    }

    /**
     * Converts this object to an object that can be serialized as a JSON
     * string.
     *
     * @returns An object.
     */
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            role: role
        };
    }

    /**
     * Serializes the player.
     *
     * @returns A string representing the player.
     */
    serialize() {
        return JSON.stringify(this.toJSON());
    }

    /**
     * Deserializes a player.
     *
     * @param {string|object} string The string representing the player.
     *
     * @returns This player.
     */
    deserialize(string) {
        var obj = string;
        if (typeof obj === 'string') {
            obj = JSON.parse(string);
        }

        this.id = obj.id;
        this.username = obj.username;
        this.role = obj.role;

        return this;
    }
}

export default Player;