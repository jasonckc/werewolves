import React from 'react';
import { useStoreState, useStoreActions } from "easy-peasy";

// Components
import { Container } from '../../atoms';
import Roles from './Roles';
import Narrator from './Narrator';
import GameHistory from './GameHistory';

const Game = () => {
  // States
  const { socket, id, self, owner, players, step } = useStoreState((state) => state.game);

  return (
    <Container>
      <Narrator>
        {`Hi, you are a ${self && self.role}`}
      </Narrator>
      <Roles players={players} self={self} />
      <GameHistory />
    </Container>
  );
};

export default Game;