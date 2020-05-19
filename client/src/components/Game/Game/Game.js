import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from "easy-peasy";

// Components
import { Container, Grid, Button } from '../../atoms';
import Roles from './Roles';
import Narrator from './Narrator';
import GameHistory from './GameHistory';

const Game = () => {
  // States
  const { socket, step, self, players, poll } = useStoreState((state) => state.game);
  const { setPoll, playerVote, updatePlayer, updateStep, updateGameHistory } = useStoreActions((actions) => actions.game);
  // const players = [
  //   {id: 1, username: 'Jason1', role: 'werewolf', isAlive: false},
  //   {id: 2, username: 'Jason2', role: null, isAlive: false},
  //   {id: 3, username: 'Jason3', role: null, isAlive: false},
  //   {id: 4, username: 'Jason4', role: 'werewolf', isAlive: false},
  // ];

  // const self = {id: 1, username: 'Jason1', role: 'werewolf', isAlive: false};

  const narratorHandler = () => {
    switch(step) {
      case 'start': 
        return `Hi, you are a ${self && self.role}. Press the Ready button when you're ready.`;
      case 'night':
        return `The night is falling. Werewolves, choose your victim.`
    }
  }

  // Listen to player-joined and re-render
  useEffect(() => {
    socket.on('poll-started', (poll) => {
      console.log('poll-started');
      console.log('poll', poll);
      setPoll(poll);
    });
    
    socket.on('poll-voted', (voter, option) => {
      console.log('poll-voted');
      console.log('voter', voter);
      console.log('option', option);
      updatePlayer({ username: voter, key: option, value: true });
      updateGameHistory({timestamp: Date.now(), message: `${voter} is ${option}`});
    });

    socket.on('poll-ended', () => {
      console.log('poll-ended...');
      updateStep('night');
    })
  }, []);

  return (
    <Container>
      <Grid container direction="row" justifyContent="center" alignItems="flex-start">
        <Grid item sm={9}>
          <Narrator>
            { narratorHandler() }
          </Narrator>
          <Roles />
        </Grid>
        <Grid item xs={3}>
          <GameHistory /> 
        </Grid>
      </Grid>
    </Container>
  );
};

export default Game;