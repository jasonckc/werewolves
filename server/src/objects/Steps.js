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
     * Assigns a random role to each players and notifies them.
     */
    async assignRoles() {
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
        Object.values(this.game.players).forEach((player, i) => {
            // Determine which player should be notified of a player's.
            var showRole = (p) => {
                if (p.id == player.id) return true;
                return p.role === 'werewolf' && player.role === 'werewolf';
            }

            // Notify the players.
            player.role = roles[i];
            var username = player.username;
            this.game.broadcastTo(showRole, 'player-role', username, roles[i]);
        });
    }

    /**
     * Waits until all players acknowledge their roles by voting 'ready'.
     */
    async waitRoleAcknowlegement() {
        await this.game.startPoll(['ready']);
    }

    /**
     * Night phase: the werewolves must choose a player to eliminate.
     */
    async night() {
        // Run a poll. The options are the usernames of all alive players. The
        // voters are the werewolves.
        var options = [];
        var alivePlayers = this.game.getPlayers((p) => { return p.isAlive; });
        alivePlayers.forEach((p) => { options.push(p.username); })

        // Get the player with the most votes.
        var victimUsername = await this.game.startPoll(options, (p) => {
            return p.isAlive && p.role === 'werewolf';
        });


        // Kill the victim. Send the username and the role of the victim to all
        // players.
        var victim = this.game.players[victimUsername];
        if (victim != null) {
            victim.isAlive = false;
            this.game.broadcast('player-died', victim.username, victim.role);
        }
    }

    /**
     * Day phase: the players must select a player to eliminate.
     */
    async day() {
        // Run a poll. The options are the usernames of all alive players. All
        // alive players can vote.
        var options = [];
        var alivePlayers = this.game.getPlayers((p) => { return p.isAlive; });
        alivePlayers.forEach((p) => { options.push(p.username); })

        // Get the player with the most votes.
        var victimUsername = await this.game.startPoll(options, (p) => {
            return p.isAlive;
        });

        // Kill the victim. Send the username and the role of the victim to all
        // players.
        var victim = this.game.players[victimUsername];
        if (victim != null) {
            victim.isAlive = false;
            this.game.broadcast('player-died', victim.username, victim.role);
        }
    }
}

export default Steps;