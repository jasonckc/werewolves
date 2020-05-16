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

        this._voters = [];
        this._options = [];
        this._timeLimit = null;

        this._votes = {};
        this._inProgress = null;

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
        // Do not set options if the poll is in progress.
        if (!this._inProgress) {
            this._options = options;
        }
    }

    /**
     * Sets the voters of the poll.
     *
     * @param {Player[]} voters The list of voters.
     */
    set voters(voters) {
        // Do not set voters if the poll is in progress.
        if (this._inProgress) {
            return;
        }

        // Don't insert duplicates in the list of voters.
        voters.forEach((voter) => {
            if (!this._voters.includes(voter)) {
                this._voters.push(voter);
            }
        });
    }

    /**
     * Sets the time limit (in seconds) of the poll.
     *
     * @param {number} seconds The time limit.
     */
    set timeLimit(seconds) {
        // Do not set the time limit if the poll is in progress.
        if (!this._inProgress) {
            this._timeLimit = seconds;
        }
    }

    /**
     * Registers a vote.
     *
     * @param {Player} voter  The player who voted.
     * @param {string} option The chosen option.
     */
    vote(voter, option) {
        // Cannot vote if the poll wasn't started.
        if (!this._inProgress || !this._options.includes(option)) {
            return false;
        }

        // Register the vote. Close the poll if all voters voted.
        this._votes[voter.id] = option;
        this._inProgress = this._votes.length === this._voters.length;

        // Notify the other players
        var skipVoter = (v) => { return v.id !== voter.id; };
        this.broadcastTo(skipVoter, 'poll-vote', voter.username, option);

        return true;
    }

    /**
     * Starts the poll. Returns when all players voted.
     */
    async start() {
        // Cannot start a poll that was already started.
        if (this._inProgress === true) {
            return;
        }

        // Cannot start a poll with no options.
        if (this._options.length == 0) {
            return;
        }

        // Cannot start a poll with no voters.
        if (this._voters.length == 0) {
            return;
        }

        this._inProgress = true;

        // Notify all the voters that the voted has started.
        this.broadcast('poll-started', this.toJSON());

        // Configure the promise's executor function.
        var executor = (resolve) => {
            if (this._timeLimit === null) this._waitAllVoters(resolve);
            else setTimeout(resolve, this._timeLimit * 1000);
        };

        // Return the promise.
        return new Promise(executor)
            .then(() => { this._inProgress = false; })
            .then(() => { this.broadcast('poll-ended'); });
    }

    /**
     * Returns the option that got the most votes. In case of a tie, takes a
     * random option among the winners.
     */
    result() {
        // The result is null if the poll is still running or wasn't started.
        if (this._inProgress === null || this._inProgress === true) {
            return null;
        }

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
        this._voters.forEach((v) => { voters.push(v.toJSON()); })

        return {
            options: this.options,
            timeLimit: this.timeLimit,
            voters: voters
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
     * Deserializes a poll. Note that votes aren't serialized. A deserialized
     * poll is considered not started.
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

        obj.voters.forEach((v) => {
            this._voters.push(new Player(this.app, v));
        })

        this._options = obj.options;
        this._timeLimit = obj.timeLimit;
    }

    /**
     * Method that loops until all players voted.
     *
     * @param {() => void} callback      A function to call when the vote is
     *                                   over.
     * @param {number}     pollFrequency The polling frequency in milliseconds.
     */
    _waitAllVoters(callback, pollFrequency = 5) {
        if (!this._inProgress) {
            callback();
        } else {
            setTimeout(() => {
                this._waitAllVoters(callback, pollFrequency);
            }, pollFrequency);
        }
    }

}

export default Poll;