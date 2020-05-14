import React from 'react';
import { Field } from '../molecules/Field';
import { Button, Container, Grid, Typography } from '../atoms/index';


const CreateGame = () => {
  return (
    <Container>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="title"> Create Game</Typography>
        </Grid>
        <Grid item>
          <form>
            <Field label="Username" placeholder="xyz" />
            <Button> Start! </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateGame;