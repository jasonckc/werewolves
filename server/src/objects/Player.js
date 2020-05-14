/**
 * Player model.
 */
class Player {

    /**
     * Initializes the player.
     *
     * @param {string} string The string to deserialize.
     */
    constructor(string) {
        this.manager = null;
        this.id = null;
        this.username = null;

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
        if (this.id != null && this.manager != null) {
            this.manager.sendMessage(this, event, ...args);
        }
    }

    /**
     * Checks whether this player is online or not.
     *
     * @returns True if the player is online, false otherwise.
     */
    isOnline() {
        if (this.id != null && this.manager != null) {
            return this.manager.isPlayerOnline(this);
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
            username: this.username
        };
    }

    /**
     * Serializes the game.
     *
     * @returns A string representing the player.
     */
    serialize() {
        return JSON.stringify(this.toJSON());
    }

    /**
     * Deserializes a game.
     *
     * @param {string} string The string representing the player.
     *
     * @returns This player.
     */
    deserialize(string) {
        var obj = JSON.parse(string);
        this.id = obj.id;
        this.username = obj.username;
        return this;
    }
}

export default Player;