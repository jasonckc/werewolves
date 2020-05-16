import React from 'react';
import { useStoreActions, useStoreState } from "easy-peasy";
import { Redirect } from 'react-router-dom';

// Components
import { Field } from '../molecules/Field';
import { Button, Container, Grid, Typography, useInput } from '../atoms/index';

const CreateGame = () => {
  const { input: { username }, handleInputChange, reset } = useInput({});

  // States
  const { id } = useStoreState((state) => state.game);

  // Actions
  const { createGame } = useStoreActions((actions) => actions.game);

  const createGameHandler = (event) => {
    event.preventDefault();
    
    createGame({ username });
  }

  if (id) {
    return <Redirect to="/lobby" />
  }

  return (
    <Container>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="title"> Create Game</Typography>
        </Grid>
        <Grid item>
          <form onSubmit={createGameHandler}>
            <Field 
              name="username"
              label="Username" 
              placeholder="xyz" 
              value={username} 
              onChange={handleInputChange} />

            <Button type="submit"> Start! </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateGame;