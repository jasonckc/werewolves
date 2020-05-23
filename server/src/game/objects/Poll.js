import Player from "./Player";
import Werewolves from "../Werewolves";

/**
 * Represents a poll.
 */
class Poll {

    /**
     * Initializes the poll.
     *
     * @param {Werewolves}      app    The application.
     * @param {string | object} string The string or object to deserialize.
     */
    constructor(app, string = null) {
        this.app = app;

        this.id = null;
        this.gameId = null;

        this._voters = [];
        this._options = [];
        this._timeLimit = null;
        this._votes = {};

        if (string !== null) {
            this.deserialize(string);
        }
    }

    /**
     * Sets the options of the poll.
     *
     * @param {string[]} options The options of the poll.
     */
    set options(options) {
        this._options = options;
        this.app.polls.save(this);
    }

    /**
     * Sets the voters of the poll.
     *
     * @param {Player[]} voters The list of voters.
     */
    set voters(voters) {
        // Don't insert duplicates in the list of voters.
        voters.forEach((voter) => {
            if (!this._voters.includes(voter)) {
                this._voters.push(voter);
            }
        });

        this.app.polls.save(this);
    }

    /**
     * Removes a voter.
     *
     * @param {Player} voter The voter to remove.
     */
    removeVoter(voter) {
        this._voters.forEach((v, i) => {
            if (v.id === voter.id) {
                delete this._voters.splice(i, 1);
                delete this._votes[voter.username];
                this.app.polls.save(this);
            }
        });
    }

    /**
     * Sets the time limit (in seconds) of the poll.
     *
     * @param {number} seconds The time limit.
     */
    set timeLimit(seconds) {
        this._timeLimit = seconds;
        this.app.polls.save(this);
    }

    /**
     * Registers a vote.
     *
     * @param {Player} voter  The player who voted.
     * @param {string} option The chosen option.
     */
    async vote(voter, option) {
        this.app.polls.synchronize(this);

        // Don't vote if the player isn't among the voters or if the chosen
        // option is invalid.
        if (!this._isVoter(voter) || !this._options.includes(option)) {
            return;
        }

        // Register the vote. Close the poll if all voters voted.
        this._votes[voter.id] = option;
        var nbVotes = Object.keys(this._votes).length;

        // Notify the players
        this.broadcast('poll-voted', voter.username, option);

        if (nbVotes >= this._voters.length) {
            this.broadcast('poll-ended');
            console.log(this._votes);

            // Notify the game
            var game = await this.app.games.get(this.gameId);
            if (game != null) await game.onPollEnded(this.result());
        }

        await this.app.polls.save(this);
    }

    /**
     * Starts the poll. Returns when all players voted.
     */
    async start() {
        // Cannot start a poll with no options.
        if (this._options.length == 0) {
            return;
        }

        // Cannot start a poll with no voters.
        if (this._voters.length == 0) {
            return;
        }

        await this.app.polls.save(this);

        // Notify all the voters that the voted has started.
        this.broadcast('poll-started', this.toJSON());

        // Time limit.
        if (this._timeLimit !== null) {
            return new Promise(async (resolve) => {
                await setTimeout(resolve, this._timeLimit * 1000);
                this.broadcast('poll-ended');

                // Notify the game
                var game = await this.app.games.get(this.gameId);
                if (game != null) game.onPollEnded(this.result());

                resolve();
            });
        }

        // No time limit.
        return new Promise((resolve) => { resolve(); });
    }

    /**
     * Returns the option that got the most votes. In case of a tie, takes a
     * random option among the winners.
     */
    result() {
        // Compute the number of votes for each option.
        var nbVotesByOption = {};
        this._options.forEach((option) => { nbVotesByOption[option] = 0; });

        Object.values(this._votes).forEach((option) => {
            nbVotesByOption[option]++;
        });

        // Get the options with the most votes.
        var maxVotes = 0;
        var winners = [];

        Object.entries(nbVotesByOption).forEach(([option, nbVotes]) => {
            if (nbVotes > maxVotes) {
                winners = [option];
                maxVotes = nbVotes;
            } else if (nbVotes == maxVotes) {
                winners.push(option);
            }
        });

        // In case of a tie, take a random winner.
        if (winners.length > 1) {
            var i = Math.floor(Math.random() * Math.floor(winners.length));
            return winners[i];
        }

        // Returns the option with most votes.
        return winners[0];
    }

    /**
     * Sends a message to all voters.
     *
     * @param {string} event The name of the event.
     * @param {...any} args  The arguments of the message.
     */
    broadcast(event, ...args) {
        this.broadcastTo(() => { return true; }, event, ...args);
    }

    /**
     * Sends a message to a selection of voters.
     *
     * @param {(Player) => boolean} filter A callback that returns true if the
     *                                     message must be sent to the given
     *                                     voter.
     * @param {string}              event  The name of the event.
     * @param {...any}              args   The arguments of the message.
     */
    broadcastTo(filter, event, ...args) {
        this._voters.forEach((voter) => {
            if (filter(voter)) {
                voter.sendMessage(event, ...args);
            }
        });
    }

    /**
     * Converts this poll to an object that can be serialized as a JSON string.
     */
    toJSON() {
        var voters = [];
        this._voters.forEach((v) => { voters.push(v.toJSON()); });

        return {
            id: this.id,
            options: this._options,
            timeLimit: this._timeLimit,
            voters: voters,
            votes: this._votes,
            gameId: this.gameId
        };
    }

    /**
     * Serializes the poll.
     *
     * @returns A string representing the poll.
     */
    serialize() {
        return JSON.stringify(this.toJSON());
    }

    /**
     * Deserializes a poll.
     *
     * @param {string|object} string The string representing the poll.
     *
     * @returns This poll.
     */
    deserialize(string) {
        var obj = string;
        if (typeof obj === 'string') {
            obj = JSON.parse(string);
        }

        this._voters = []
        obj.voters.forEach((v) => {
            this._voters.push(new Player(this.app, v));
        })

        this.id = obj.id;
        this.gameId = obj.gameId;
        this._options = obj.options;
        this._timeLimit = obj.timeLimit;
        this._votes = obj.votes;

        return this;
    }

    /**
     * Checks whether a player is a voter or not.
     *
     * @param {Player} player The player to check.
     */
    _isVoter(player) {
        var isVoter = false;

        this._voters.forEach((v) => {
            isVoter |= v.id === player.id;
        });

        return isVoter;
    }
}

export default Poll;