import Player from "./Player";
import Werewolves from "../Werewolves";

/**
 * Game model.
 */
class Game {

    /**
     * Initializes the game.
     *
     * @param {Werewolves}      app    The application.
     * @param {string | object} string A string or object to deserialize.
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
        // The maximum number of players is 18.
        if (this.players.size >= 18) {
            player.sendMessage('join-failed');
            return false;
        }

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
        if (this.players[username] == null) {
            return;
        }

        if (username !== this.owner) {
            this.broadcast('player-left', this.players[username]);
            delete (this.players[username]);
            this.app.games.save(this);
        }
    }

    /**
     * Starts the game.
     */
    async start() {
        // The minimum number of players is 6
        if (this.players.size() < 6) {
            return;
        }

        this.broadcast('game-started');

        // Assign roles
        this._assignRoles();

        // Show their role of each player.
        Object.values(this.players).forEach((player) => {
            // Determine who must know about the player's role.
            var showRole = (p) => {
                if (p.id = player.id) return true;
                return p.role === 'werewolf' && player.role === 'werewolf';
            }

            // Send the role to every player that must be notified.
            var username = player.username;
            var role = player.role;
            this.broadcastTo(showRole, 'player-role', username, role);
        });

        // While not victory
        // Wolves vote
        // Day
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

    /**
     * Assign a role to each player in the game.
     */
    _assignRoles() {
        var nbPlayers = this.players.size();

        // Determine the number of werewolves.
        var nbWerewolves =
            nbPlayers < 8 ? 1 :
                nbPlayers < 12 ? 2 :
                    nbPlayers < 18 ? 3 : 4;

        // Generate the list of roles.
        var roles = [];
        for (let i = 0; i < nbPlayers; i++) {
            roles.push(i < nbWerewolves ? 'werewolf' : 'villager');
        }

        // Shuffle the list of roles.
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = roles[i];
            roles[i] = roles[j];
            roles[j] = temp;
        }

        // Assign the roles to the players
        Object.values(this.players).forEach((player, i) => {
            player.role = roles[i];
        });
    }

    /**
     * Waits for a number of seconds.
     *
     * @param {int} seconds The number of seconds.
     */
    async _wait(seconds) {
        await new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    }
}

export default Game;