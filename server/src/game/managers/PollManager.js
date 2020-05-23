import Poll from "../objects/Poll";
import * as settings from '../../settings';
import { Tedis } from "tedis";

/**
 * Poll manager.
 */
class PollManager {

    /**
     * Initializes the poll manager.
     *
     * @param {Werewolves} app The application.
     */
    constructor(app) {
        this.app = app;
        this._lastId = null;
    }

    async create() {
        // Load the last poll identifier.
        var redis = await this.app.redis();
        var lastId = await redis
            .get('PollManager_Id')
            .catch((err) => { console.error(err); });

        lastId = lastId === null ? 0 : parseInt(lastId);

        // Instanciate the poll
        var poll = new Poll(this.app);
        poll.id = lastId + 1;

        // Save the last poll identifier
        var redis = await this.app.redis();
        await redis
            .setex('PollManager_Id', settings.OBJECT_LIFESPAN, poll.id)
            .catch((err) => { console.error(err); });

        // Save the poll
        this.save(poll);
        return poll;
    }

    /**
     * Searches a poll with the given identifier.
     *
     * @param {string} id The poll identifier.
     */
    async get(id) {
        if (id === null) {
            return null;
        }

        var poll = new Poll(this.app);
        poll.id = id;
        return await this.synchronize(poll) ? poll : null;
    }

    /**
     * Synchronizes a poll object with the database.
     *
     * @param {Poll} poll The poll to synchronize.
     *
     * @returns True is the poll was synchronized, false otherwise.
     */
    async synchronize(poll) {
        // Get the poll from redis.
        var redis = await this.app.redis();
        var value = await redis
            .get('Poll_' + poll.id)
            .catch((err) => { console.error(err); value = null; });

        // The poll doesn't exist.
        if (value == null) {
            return false;
        }

        // Synchronize the poll.
        poll.deserialize(value);
        return true;
    }

    /**
     * Saves a poll.
     *
     * @param {Poll} poll The poll to save.
     *
     * @returns True if the game was saved, false otherwise.
     */
    async save(poll) {
        if (poll.id === null) {
            return;
        }

        var key = 'Poll_' + poll.id;
        var val = poll.serialize();

        var success = true;
        var redis = await this.app.redis();
        await redis
            .setex(key, settings.OBJECT_LIFESPAN, val)
            .catch(() => { success = false; });

        return success;
    }
}

export default PollManager;