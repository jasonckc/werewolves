import React from 'react';
import styled from 'styled-components';

// Components
import { Container, Grid, Typography } from '../atoms';

const NavbarWrapper = styled.div`
  margin: 1rem 0 2rem;
`;

const Navbar = () => {
  return (
    <Container>
      <NavbarWrapper>
        <Grid container justifyContent="center">
          <Grid item>
            <Typography variant="game-title"> Werewolves </Typography>
          </Grid>
        </Grid>
      </NavbarWrapper>
    </Container>
  );
};


export default Navbar;