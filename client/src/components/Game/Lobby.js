import React from 'react';
import { Container, Grid } from '../atoms';
import { useStoreState } from 'easy-peasy';

const Lobby = () => {
  // States
  const { id } = useStoreState((state) => state.game);

  return (
    <Container>
      <Grid container>
        <Grid item>
          Room code: { id }
        </Grid>
        <Grid item>
          
        </Grid>
      </Grid>
    </Container>
  );
};

export default Lobby;