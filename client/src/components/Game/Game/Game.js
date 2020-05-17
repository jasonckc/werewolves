import React from 'react';
import Roles from './Roles';
import Narrator from './Narrator';
import { Container } from '../../atoms';
import GameHistory from './GameHistory';

const Game = () => {
  const self = {
    id: 2, username: 'Jason1', role: 'Werewolf'
  }

  const players = [
    { id: 1, username: 'Jason', role: 'Villager'},
    { id: 2, username: 'Jason1', role: 'Werewolf'},
    { id: 3, username: 'Jason2', role: 'Villager'},
    { id: 4, username: 'Jason3', role: 'Werewolf'},
    { id: 5, username: 'Jason4', role: 'Villager'},
    { id: 6, username: 'Jason5', role: 'Villager'},
  ]

  return (
    <Container>
      <Narrator>
        {`Hi, you are a ${self.role}`}
      </Narrator>
      <Roles players={players} self={self} />
      <GameHistory />
    </Container>
  );
};

export default Game;