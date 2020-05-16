import React from 'react';
import { Container, Grid, Button, ButtonLink } from '../atoms/index';

const Home = () => {
  return (
    <Container>
      <Grid container direction="column">
        <ButtonLink to="/create-game"> Create Game</ButtonLink>
        <ButtonLink to="/join-game"> Join Game</ButtonLink>
      </Grid>
    </Container>
  );
};

export default Home;