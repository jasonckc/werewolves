import React from 'react';
import { Container, Grid, Typography, ButtonLink, Image } from '../../atoms/index';

const logo = require('../../../images/logo.svg');

const Home = () => {
  return (
    <Container>
      <Grid container direction="column" justifyContent="center" alignContent="center">
        <Image src={logo} /> 
        <Typography variant="game-title"> Werewolves </Typography>
        <Grid item><ButtonLink to="/create-game"> Create Game</ButtonLink></Grid>
        <Grid item><ButtonLink to="/join-game/"> Join Game</ButtonLink></Grid>
      </Grid>
    </Container>
  );
};

export default Home;