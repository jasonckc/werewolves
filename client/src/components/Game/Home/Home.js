import React from 'react';
import { Container, Grid, Button, ButtonLink, Card } from '../../atoms/index';

const Home = () => {
  return (
    <Container>
      <Card>
        <Grid container direction="column" alignContent="center">
          <ButtonLink to="/create-game"> Create Game</ButtonLink>
          <ButtonLink to="/join-game"> Join Game</ButtonLink>
        </Grid>
      </Card>
    </Container>
  );
};

export default Home;