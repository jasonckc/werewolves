import { action, thunk, thunkOn, actionOn } from "easy-peasy";

const gameModel = {
  socket: {},

  id: null,
  owner: null,
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
  
  addPlayer: action((state, payload) => {
    state.players.push(payload);
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
          message: "An error has occured"
        })
      });

      await getState().socket.on('player-joined', (player) => {
        actions.setOwner(player);
        actions.addPlayer(player);
      });
  
      await getState().socket.on('join-success', (id) => {
        actions.setGameId(id);

        getStoreActions().notifier.update({
          message: "Game successfully created"
        })
      })
    }
  ),

  onJoinGame: thunkOn(
    actions => actions.joinGame,
    async (actions, target, { getState, getStoreActions }) => {
      await getState().socket.on('join-failed', () => {
        getStoreActions().notifier.update({
          message: "An error has occured"
        })
      });

      await getState().socket.on('player-joined', (player) => {
        console.log('player joined', player)
        actions.addPlayer(player);
      });
  
      await getState().socket.on('join-success', (id) => {
        actions.setGameId(id);

        getStoreActions().notifier.update({
          message: "You have joined the game"
        })
      })
    }
  ),
};

export default gameModel;
