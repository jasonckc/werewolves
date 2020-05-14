import shortid from 'shortid';
import Game from '../objects/Game';
import { Tedis } from 'tedis';
import * as settings from '../../settings';

/**
 * Class used to manage game instances.
 */
class GameManager {

    /**
     * Initializes the game manager.
     */
    constructor() {
        // Connect to redis.
        this._redis = new Tedis({
            port: settings.REDIS_PORT,
            host: settings.REDIS_HOST
        });
    }

    /**
     * Creates a new game.
     *
     * @returns The identifier of the new game.
     */
    create() {
        // Instanciate the game
        var game = new Game();

        game.id = shortid.generate();
        game.manager = this;

        // Save and return the game instance
        this.save(game);
        return game;
    }

    /**
     * Searches a game with the given identifier.
     *
     * @param {string} id The game identifier.
     */
    async get(id) {
        // Get the game from redis.
        var value = await this._redis.get('Game_' + id);
        if (value == null) {
            return null;
        }

        // Bind the game to this manager.
        var game = new Game(value);
        game.manager = this;

        // Return the game instance.
        return game;
    }

    /**
     * Saves a game.
     *
     * @param {Game} game The game to save.
     */
    save(game) {
        var key = 'Game_' + game.id;
        var val = game.serialize();
        this._redis.setex(key, settings.OBJECT_LIFESPAN, val);
    }
}

export default GameManager;