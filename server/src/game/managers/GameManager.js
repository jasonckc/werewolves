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
        this.app = app;
        this.instances = {};
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
     * Searches a game with the given identifier.
     *
     * @param {string} id The game identifier.
     */
    async get(id) {
        if (id === null) {
            return null;
        }

        if (this.instances[id] === null) {
            this.instances[id] = new Game(this.app);
            this.instances[id].id = id;
        }

        if (this.synchronize(this.instances[id])) {
            return this.instances[id];
        }

        delete this.instances[id]
        return null;
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
        var redis = await this.app.redis();
        var value = await redis
            .get('Game_' + game.id)
            .catch((err) => { console.error(err); value = null; });

        redis.close();

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
        var redis = await this.app.redis();
        await redis
            .setex(key, settings.OBJECT_LIFESPAN, val)
            .catch(() => { success = false; });

        redis.close();
        return success;
    }
}

export default GameManager;