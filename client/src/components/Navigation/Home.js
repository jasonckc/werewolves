import React from 'react';
import { Container } from '../atoms/Grid/Container';
import { Grid } from '../atoms/Grid/Grid';
import { Button, ButtonLink } from '../atoms/Button/Button';

const Home = () => {
  return (
    <Container>
      <ButtonLink to="/create-game"> Create Game</ButtonLink>
      <ButtonLink to="/join-game"> Join Game</ButtonLink>
    </Container>
  );
};

export default Home;