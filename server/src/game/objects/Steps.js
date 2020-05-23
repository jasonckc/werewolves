import Game from "./Game";

/**
 * Class that implements the differents steps of a game.
 */
class Steps {

    /**
     * Initializes the game steps.
     *
     * @param {Game} game The game.
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Handles the result of a poll.
     *
     * @param {string} result The result of the poll.
     */
    async onPollEnded(result) {
        switch (this.game.step) {
            case 'assignRoles':
                await this.night();
                break;

            case 'night':
            case 'day':
                // Kill the victim. Send the username and the role of the
                // victim to all players.
                var victim = this.game.players[result];
                if (victim != null) {
                    victim.isAlive = false;
                    this.game.broadcast('player-died', victim.username, victim.role);
                }

                // If there is a winner, end the game.
                if (this.game.winners !== null) {
                    await this.end();
                    break;
                }

                // Next step.
                if (this.game.step === 'night') await this.day();
                else await this.night();

                break;

            default:
                break;
        }
    }

    /**
     * Starts the game.
     */
    async start() {
        this.game.step = 'start';
        this.game.app.games.save(this.game);

        this.game.broadcast('game-started');
        this.assignRoles();
    }

    /**
     * Assigns a random role to each players and notifies them.
     */
    async assignRoles() {
        this.game.step = 'assignRoles';
        this.game.app.games.save(this.game);

        var nbPlayers = Object.keys(this.game.players).length;

        // Determine the number of werewolves.
        var nbWerewolves =
            nbPlayers < 8 ? 1 :
                nbPlayers < 12 ? 2 :
                    nbPlayers < 18 ? 3 : 4;

        // Generate the list of roles.
        var roles = [];
        for (let i = 0; i < nbPlayers; i++) {
            roles.push(i < nbWerewolves ? 'werewolf' : 'villager');
        }

        // Shuffle the list of roles.
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = roles[i];
            roles[i] = roles[j];
            roles[j] = temp;
        }


        // Assign the roles to the players
        Object.values(this.game.players)
            .forEach((player, i) => { player.role = roles[i]; });

        // Notify the players
        Object.values(this.game.players).forEach((player, i) => {
            // Determine which player should be notified of a player's role.
            var showRole = (p) => {
                if (p.id == player.id) return true;
                return p.role === 'werewolf' && player.role === 'werewolf';
            }

            // Send a message to the appropriate players.
            var username = player.username;
            var role = player.role;
            this.game.broadcastTo(showRole, 'player-role', username, role);
        });

        // The player must acknowledge their roles.
        this.game.startPoll(['ready']);
    }

    /**
     * Night phase: the werewolves must choose a player to eliminate.
     */
    async night() {
        this.game.step = 'night';
        this.game.app.games.save(this.game);

        // Run a poll. The options are the usernames of all alive players. The
        // voters are the werewolves.
        var options = [];
        var alivePlayers = this.game.getPlayers((p) => { return p.isAlive; });
        alivePlayers.forEach((p) => { options.push(p.username); })

        // Start a poll to eliminate a player.
        this.game.startPoll(options, (p) => {
            return p.isAlive && p.role === 'werewolf';
        });
    }

    /**
     * Day phase: the players must select a player to eliminate.
     */
    async day() {
        this.game.step = 'day';
        this.game.app.games.save(this.game);

        // Run a poll. The options are the usernames of all alive players. All
        // alive players can vote.
        var options = [];
        var alivePlayers = this.game.getPlayers((p) => { return p.isAlive; });
        alivePlayers.forEach((p) => { options.push(p.username); })

        // Start a poll to eliminate a player.
        this.game.startPoll(options, (p) => {
            return p.isAlive;
        });
    }

    /**
     * Ends the game.
     */
    async end() {
        this.game.step = 'end';
        this.game.app.games.save(this.game);

        var playersList = Object.values(this.game.players);
        this.game.broadcast('game-ended', this.game.winners, playersList);
    }
}

export default Steps;