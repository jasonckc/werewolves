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
        this._games = new GameManager();
        this._players = new PlayerManager();
    }

    /**
     * Creates a new game.
     *
     * @param {string} username The username of the owner.
     * @param {socket} socket   The socket to communicate with the owner.
     */
    createGame(username, socket) {
        // Reject empty usernames
        if (typeof username !== 'string' || username === '') {
            socket.emit('join-failed');
            return;
        }

        // Instanciate the game.
        var game = this._games.create();

        // Create the player object.
        var player = this._players.create(username, socket);
        if (player == null) {
            socket.emit('join-failed');
            return;
        }

        // Add the owner to the game.
        if (game.addPlayer(player)) {
            socket.emit('join-success', game.id);
            game.broadcast('player-joined', player.toJSON());
        } else {
            socket.emit('join-failed');
        }
    }

    /**
     * Adds a player to a game.
     *
     * @param {string} gameId   The identifier of the game to join.
     * @param {string} username The username of the new player.
     * @param {socket} socket   The socket to communicate with the new player.
     */
    joinGame(gameId, username, socket) {
        // Reject empty usernames
        if (typeof username !== 'string' || username === '') {
            socket.emit('join-failed');
            return;
        }

        this._games.get(gameId).then((game) => {

            // The requested game doesn't exist.
            if (game == null) {
                socket.emit('join-failed');
                return;
            }

            // Create the player object.
            var player = this._players.create(username, socket);
            if (player == null) {
                socket.emit('join-failed');
                return;
            }

            // Add the player to the game.
            if (game.addPlayer(player)) {
                player.sendMessage('join-success', game.id);
                game.broadcast('player-joined', player.toJSON());
            } else {
                socket.emit('join-failed');
            }
        });
    }
}

export default Werewolves;
