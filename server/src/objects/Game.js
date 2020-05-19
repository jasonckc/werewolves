import Player from "./Player";
import Werewolves from "../Werewolves";
import Steps from "./Steps";

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
        this.steps = new Steps(this);

        this.id = null;
        this.players = {};
        this.owner = null;
        this.pollId = null;

        if (string != null) {
            this.deserialize(string);
        }
    }

    /**
     * Returns the winning role.
     *
     * @returns The winning role.
     */
    get winners() {
        // Count the number of players for each role.
        var nbAliveWerewolves = 0;
        var nbAliveVillagers = 0;

        Object.values(this.players).forEach((p) => {
            // Skip dead players.
            if (!p.isAlive) return;

            // Count the players.
            if (p.role === 'werewolf') nbAliveWerewolves++;
            else if (p.role === 'villager') nbAliveVillagers++;
        });

        // Return null if no roles have been assigned.
        if (nbAliveVillagers == 0 && nbAliveWerewolves == 0) {
            return null;
        }

        // All werewolves are dead: villagers won!
        if (nbAliveWerewolves == 0) {
            return 'villager';
        }

        // There are either the same number or more werewolves than villagers:
        // werewolves won!
        if (nbAliveWerewolves >= nbAliveVillagers) {
            return 'werewolf';
        }

        // Return the winning role.
        return null;
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
     * Returns the list of players.
     *
     * @param {(Player) => boolean} filter A function used to filter player.
     *                                     Returns true if the player must
     *                                     be in the list, false otherwise.
     *
     * @returns A list of player objects.
     */
    getPlayers(filter = null) {
        var players = [];

        Object.values(this.players)
            .forEach((p) => { if (filter(p)) players.push(p); });

        return players;
    }

    /**
     * Starts the game.
     */
    async start() {
        // The minimum number of players is 6
        if (Object.keys(this.players).length < 3) {
            return;
        }

        this.broadcast('game-started');

        // Assign roles
        this.steps.assignRoles();
        await this.steps.waitRoleAcknowlegement();

        // While not victory
        while (this.winners == null) {
            await this.steps.night();

            if (this.winners == null) await this.steps.day();
            else break;
        }

        this.broadcast('game-ended', this.winners);
    }

    /**
     * Starts a poll.
     *
     * @param {string[]}            options       The options of the poll.
     * @param {(Player) => boolean} filterPlayers A function that returns true
     *                                            if the player must be a voter
     *                                            or false otherwise.
     *
     * @returns The option with the most votes. If no one voted, returns a
     * random option. If there is a tie, returns a random option from among
     * those with the most votes.
     */
    async startPoll(options, filterPlayers = null) {
        return await this.startTimedPoll(options, null, filterPlayers);
    }

    /**
     * Starts a timed poll.
     *
     * @param {string[]}            options       The options of the poll.
     * @param {number}              timeLimit     The duration of the poll in
     *                                            seconds.
     * @param {(Player) => boolean} filterPlayers A function that returns true
     *                                            if the player must be a voter
     *                                            or false otherwise.
     *
     * @returns The option with the most votes. If no one voted, returns a
     * random option. If there is a tie, returns a random option from among
     * those with the most votes.
     */
    async startTimedPoll(options, timeLimit, filterPlayers = null) {
        var voters = [];
        Object.values(this.players).forEach((p) => {
            if (filterPlayers === null || filterPlayers(p)) {
                voters.push(p);
            }
        })

        var poll = await this.app.polls.create();
        this.pollId = poll.id;
        this.app.games.save(this);

        poll.options = options;
        poll.voters = voters;
        poll.timeLimit = timeLimit;

        await poll.start();
        this.pollId = null;

        return poll.result();
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
            players.push(player.toJSON());
        });

        // Convert to JSON.
        return {
            id: this.id,
            players: players,
            owner: this.owner,
            pollId: this.pollId
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
        this.pollId = obj.pollId;

        // Deserialize the players.
        obj.players.forEach((p) => {
            this.players[p.username] = new Player(this.app, p);
        });

        return this;
    }
}

export default Game;