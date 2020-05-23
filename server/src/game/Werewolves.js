import GameManager from "./managers/GameManager";
import PlayerManager from "./managers/PlayerManager";
import PollManager from "./managers/PollManager";
import AsyncLock from "async-lock";
import { Tedis } from "tedis";

/**
 * The main class of the Werewolves game.
 */
class Werewolves {

    /**
     * Initializes the game.
     *
     * @param {object} redisCredentials The redis credentials.
     */
    constructor(redisCredentials) {
        this.games = new GameManager(this);
        this.players = new PlayerManager(this);
        this.polls = new PollManager(this);

        this._redisCredentials = redisCredentials;

        this._lock = new AsyncLock();
    }

    /**
     * Returns a connection to redis.
     *
     * @returns An instance of Tedis.
     */
    get redis() {
        return new Tedis(this._redisCredentials);
    }

    /**
     * Creates a new game.
     *
     * @param {string} username The username of the owner.
     * @param {socket} socket   The socket to communicate with the owner.
     *
     * @returns The player object associated to the given socket.
     */
    async createGame(username, socket) {
        // Reject empty usernames
        if (typeof username !== 'string' || username === '') {
            socket.emit('join-failed');
            return null;
        }

        // Create the player object.
        var player = await this.players.create(username, socket);
        if (player == null) {
            socket.emit('join-failed');
            return null;
        }

        // Create a game and add the player.
        var game = await this.games.create();
        return game.addPlayer(player) ? player : null;
    }

    /**
     * Adds a player to a game.
     *
     * @param {string} gameId   The identifier of the game to join.
     * @param {string} username The username of the new player.
     * @param {socket} socket   The socket to communicate with the new player.
     *
     * @returns The player object associated to the given socket.
     */
    async joinGame(gameId, username, socket) {
        var sender = null;

        // Reject if no game id was given.
        if (gameId === null) {
            return;
        }

        // Reject empty usernames.
        if (typeof username !== 'string' || username === '') {
            if (socket != null) {
                socket.emit('join-failed', 'invalidUsername');
            }
            return;
        }

        // Lock the game and add the player.
        await this._lock.acquire('game:' + gameId, async (done) => {
            // Search the game.
            var game = await this.games.get(gameId);
            if (game == null) {
                if (socket != null) {
                    socket.emit('join-failed', 'gameDoesNotExist');
                }
                done();
                return;
            }

            // Create the player object.
            var player = await this.players.create(username, socket);
            if (player == null) {
                if (socket != null) {
                    socket.emit('join-failed', 'internalError');
                }
                done();
                return;
            }

            // Add the player to the game.
            sender = game.addPlayer(player) ? player : null;
            done();
        });

        return sender;
    }

    /**
     * Starts a game.
     *
     * @param {Player} sender The player that requested the game start. Must be
     *                        the owner of the game.
     */
    async startGame(sender) {
        var game = await this.games.get(sender.gameId);
        if (game != null && game.owner === sender.username) {
            game.start();
        }
    }

    /**
     * Registers a vote from a player.
     *
     * @param {Player} sender The player that voted.
     * @param {string} option The chosen option.
     */
    async vote(sender, option) {
        // Return if the player isn't in a game.
        if (sender.gameId == null) {
            return;
        }

        // Lock the game and vote.
        this._lock.acquire('game:' + sender.gameId, async (done) => {
            var game = await this.games.get(sender.gameId);
            var poll = game == null ? null : await this.polls.get(game.pollId);

            if (poll != null) {
                await poll.vote(sender, option);
            }

            done();
        });
    }
}

export default Werewolves;
