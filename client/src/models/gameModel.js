import { action, thunk, thunkOn, actionOn } from "easy-peasy";

const gameModel = {
  socket: {},

  id: null,
  owner: null,
  self: null,
  players: [],

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

  /**
   * Removes a player from the game.
   *
   * @param {string} payload The username of the player to remove.
   */
  removePlayer: action((state, payload) => {
    state.players = state.players.filter(player => player.id !== payload.id)
  }),

  // Thunks
  createGame: thunk((actions, payload, { getState }) => {
    const { username } = payload;

    return new Promise((resolve, reject) => {
      getState().socket.emit('create-game', username);

      resolve(payload);
    });
  }),

  joinGame: thunk((actions, payload, { getState }) => {
    const { gameId, username } = payload;

    console.log('payload', payload)
    return new Promise((resolve, reject) => {
      getState().socket.emit('join-game', gameId, username);

      resolve(payload);
    })
  }),
  
  // Listeners
  onCreateGame: thunkOn(
    actions => actions.createGame,
    async (actions, target, { getState, getStoreActions }) => {
      await getState().socket.on('join-failed', () => {
        getStoreActions().notifier.update({
          message: "An error has occured",
          variant: "error"
        })
      });
  
      await getState().socket.on('join-success', (game) => {
        actions.setGameId(game.id);
        actions.setOwner(game.owner);
        actions.setSelf(game.owner);
        actions.setPlayers(game.players);
        
        getStoreActions().notifier.update({
          message: "Game successfully created",
          variant: "success"
        })
      });
    }
  ),

  onJoinGame: thunkOn(
    actions => actions.joinGame,
    async (actions, target, { getState, getStoreActions }) => {
      await getState().socket.on('join-failed', () => {
        getStoreActions().notifier.update({
          message: "An error has occured",
          variant: "error"
        })
      });
  
      await getState().socket.on('join-success', (game) => {
        actions.setGameId(game.id);
        actions.setOwner(game.owner);
        actions.setSelf(game.players[game.players.length - 1].username);
        actions.setPlayers(game.players);

        getStoreActions().notifier.update({
          message: "You have joined the game",
          variant: "success"
        });
      });
    }
  ),
};

export default gameModel;
