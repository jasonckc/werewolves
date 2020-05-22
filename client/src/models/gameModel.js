import { action, thunk, thunkOn, computed } from "easy-peasy";

const gameModel = {
	// States
	socket: {},

	id: null,
	players: [],
	owner: null,
	self: null,

	step: "waiting", // Sequence: waiting, ready, night, day
	poll: null,

	lastKilled: null, // Last player killed

	nightCount: 0,
	dayCount: 0,

	gameHistory: [],
	narrator: null,

	winner: null,

	// Actions
	setSocket: action((state, payload) => {
		state.socket = payload;
	}),

	setGameId: action((state, payload) => {
		state.id = payload;
	}),

	setOwner: action((state, payload) => {
		state.owner = payload;
	}),

	setSelf: action((state, payload) => {
		state.self = payload;
	}),

	setPlayers: action((state, payload) => {
		state.players = payload;
	}),

	addPlayer: action((state, payload) => {
		state.players.push(payload);
	}),

	updateStep: action((state, payload) => {
		state.step = payload;

		if (state.step === "night") {
			state.nightCount++;
		} else if (state.step === "day") {
			state.dayCount++;
		}
	}),

	/**
  * Removes a player from the game.
  *
  * @param {string} payload The username of the player to remove.
  */
	removePlayer: action((state, payload) => {
		state.players = state.players.filter((player) => player.id !== payload.id);
	}),

	/**
  * Update a player role when start-game is called
  *
  * @param {obj} payload { username, role }.
  */
	updatePlayer: action((state, payload) => {
		const { username, key, value } = payload;

		state.players = state.players.map(
			(player) => (player.username === username ? { ...player, [key]: value } : player)
		);
		state.self = state.self.username === username ? { ...state.self, [key]: value } : state.self;
	}),

	/**
   * Save the poll instance. There's only one at any time
   *
   * @param {obj} payload { poll }.
   */
	setPoll: action((state, payload) => {
		state.poll = payload;
	}),

	updateLastKilled: action((state, payload) => {
		state.lastKilled = payload
	}),

	updateGameHistory: action((state, payload) => {
		state.gameHistory = [ ...state.gameHistory, { timestamp: Date.now(), message: payload } ];
	}),

	updateNarrator: action((state, payload) => {
		state.narrator = payload;
	}),

	setWinner: action((state, payload) => {
		state.winner = payload;
	}),

	// Thunks
	createGame: thunk((actions, payload, { getState }) => {
		const { username } = payload;

		return new Promise((resolve, reject) => {
			getState().socket.emit("create-game", username);

			resolve(payload);
		});
	}),

	joinGame: thunk((actions, payload, { getState }) => {
		const { gameId, username } = payload;

		return new Promise((resolve, reject) => {
			getState().socket.emit("join-game", gameId, username);

			resolve(payload);
		});
	}),

	startGame: thunk((actions, payload, { getState }) => {
		return new Promise((resolve, reject) => {
			getState().socket.emit("start-game");

			resolve(true);
		});
	}),

	playerVote: thunk((actions, payload, { getState }) => {
		const { option } = payload;

		return new Promise((resolve, reject) => {
			getState().socket.emit("poll-vote", option);
			resolve(true);
		});
	}),

	onPollVote: thunk((actions, payload, { getState }) => {
		const { username, option } = payload;

		if (option === "ready") {
			actions.updatePlayer({ username, key: option, value: true });
			actions.updateGameHistory(`${username} is ${option}`);
		} else {
			actions.updateGameHistory(`${username} wishes to vote for ${option}`);
		}
	}),

	onPollEnded: thunk((actions, payload, { getState }) => {
		if (getState().step === "start") {
			actions.updateStep("night");
			actions.updateNarrator("start");
			actions.updateGameHistory(`Night #${getState().nightCount}`);
		}
	}),

	onPlayerDied: thunk((actions, payload, { getState }) => {
		const { username, role } = payload;

		actions.updateLastKilled({ username, role });
		actions.updatePlayer({ username, key: "isAlive", value: false });
		actions.updatePlayer({ username, key: "role", value: role });

		if (getState().step === "night") {
			actions.updateStep("day");
			actions.updateGameHistory(`Day #${getState().dayCount}`);
			actions.updateNarrator("day");

		} else if (getState().step === "day") {
			actions.updateStep("night");
			actions.updateGameHistory(`Night #${getState().nightCount}`);
			actions.updateNarrator("night");
		}

		actions.updateGameHistory(`${username} [${role.toUpperCase()}] has been killed.`);
	}),

	onGameEnded: thunk((actions, payload, { getState }) => {
		const { winner } = payload;

		return new Promise((resolve, reject) => {

			// if (winner === "werewolves") {
			// 	getState().players.map()
			// }
			actions.updateStep("end");
			actions.updateNarrator("end");
			actions.setWinner(winner);
			actions.updateGameHistory(`The ${winner} have won the game.`);

			resolve(winner);
		});
	}),

	// Listeners
	onCreateGame: thunkOn(
		(actions) => actions.createGame,
		async (actions, target, { getState, getStoreActions }) => {
			await getState().socket.on("join-failed", () => {
				getStoreActions().notifier.update({
					message: "An error has occured",
					variant: "error"
				});
			});

			await getState().socket.on("join-success", (game) => {
				console.log("game", game);
				actions.setGameId(game.id);
				actions.setOwner(game.owner);
				actions.setPlayers(game.players);
				actions.setSelf(game.players[0]);

				getStoreActions().notifier.update({
					message: "Game successfully created",
					variant: "success"
				});
			});
		}
	),

	onJoinGame: thunkOn(
		(actions) => actions.joinGame,
		async (actions, target, { getState, getStoreActions }) => {
			await getState().socket.on("join-failed", () => {
				getStoreActions().notifier.update({
					message: "An error has occured",
					variant: "error"
				});
			});

			await getState().socket.on("join-success", (game) => {
				actions.setGameId(game.id);
				actions.setOwner(game.owner);
				actions.setSelf(game.players[game.players.length - 1]);
				actions.setPlayers(game.players);

				getStoreActions().notifier.update({
					message: "You have joined the game",
					variant: "success"
				});
			});
		}
	)
};

export default gameModel;
