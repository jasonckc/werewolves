import GameManager from "./managers/GameManager";
import PlayerManager from "./managers/PlayerManager";

/**
 * The main class of the Werewolves game.
 */
class Werewolves {

    /**
     * Initializes the game.
     */
    constructor() {
        this.games = new GameManager(this);
        this.players = new PlayerManager(this);
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
        var player = this.players.create(username, socket);
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
        // Reject empty usernames
        if (typeof username !== 'string' || username === '') {
            socket.emit('join-failed');
            return null;
        }

        // Search the game.
        var game = await this.games.get(gameId);
        if (game == null) {
            socket.emit('join-failed');
            return null;
        }

        // Create the player object.
        var player = this.players.create(username, socket);
        if (player == null) {
            socket.emit('join-failed');
            return null;
        }

        // Add the player to the game.
        return game.addPlayer(player) ? player : null;
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
}

export default Werewolves;
