import React from 'react';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
// Components
import { Grid, Typography } from '../../atoms';

const Wrapper = styled.div`
  margin: 1rem 0 2rem;
`;

const Narrator = () => {
  const { socket, step, self, players, poll, nightCount, dayCount, narrator } = useStoreState((state) => state.game);

  const messageHandler = () => {
    switch(step) {
      case 'start': 
        return `Welcome to the game of Werewolves! You've been assigned as a ${self && self.role}. 
          Ready up and good luck!`;
      case 'night':
        return `The night is falling. Werewolves, choose your victim.`
      case 'day':
        return `It's a new day.`
      case 'end':
        return `Game end.`;
      default:
        return 'Error'
    }
  }

  return (
    <Wrapper>
      <Grid container alignContent="center">
        <Typography variant="title"> { narrator} </Typography>
      </Grid>
    </Wrapper>
  );
};

export default Narrator;