import shortid from 'shortid';
import Game from '../objects/Game';
import { Tedis } from 'tedis';
import * as settings from '../../settings';
import Werewolves from '../Werewolves';

/**
 * Class used to manage game instances.
 */
class GameManager {

    /**
     * Initializes the game manager.
     *
     * @param {Werewolves} app The application.
     */
    constructor(app) {
        // Connect to redis.
        this._redis = new Tedis({
            port: settings.REDIS_PORT,
            host: settings.REDIS_HOST
        });

        this.app = app;
    }

    /**
     * Creates a new game.
     *
     * @returns The created game.
     */
    async create() {
        // Instanciate the game
        var game = new Game(this.app);
        game.id = shortid.generate();

        // Save and return the game instance
        return (await this.save(game)) ? game : null;
    }

    /**
     * Deletes a game.
     *
     * @param {Game} game The game to delete.
     */
    async delete(game) {
        await this._redis
            .del('Game_'.game.id)
            .catch((err) => { console.error(err); })
    }

    /**
     * Searches a game with the given identifier.
     *
     * @param {string} id The game identifier.
     */
    async get(id) {
        if (id === null) {
            return null;
        }

        var game = new Game(this.app);
        game.id = id;
        return await this.synchronize(game) ? game : null;
    }

    /**
     * Synchronizes a game object with the database.
     *
     * @param {Game} game The game to synchronize.
     *
     * @returns True is the game was synchronized, false otherwise.
     */
    async synchronize(game) {
        // Get the game from redis.
        var value = await this._redis
            .get('Game_' + game.id)
            .catch((err) => { console.error(err); value = null; });

        // The game doesn't exist.
        if (value == null) {
            return false;
        }

        // Synchronize the game.
        game.deserialize(value);
        return true;
    }

    /**
     * Saves a game.
     *
     * @param {Game} game The game to save.
     *
     * @returns True if the game was saved, false otherwise.
     */
    async save(game) {
        if (game.id === null) {
            return;
        }

        var key = 'Game_' + game.id;
        var val = game.serialize();

        var success = true;
        await this._redis
            .setex(key, settings.OBJECT_LIFESPAN, val)
            .catch(() => { success = false; });

        return success;
    }
}

export default GameManager;