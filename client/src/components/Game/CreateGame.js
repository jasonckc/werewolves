import React from 'react';
import { Container } from '../atoms/Grid/Container';
import { Field } from '../molecules/Field';
import { Button } from '../atoms/Button/Button';

const CreateGame = () => {
  return (
    <Container>
      Create game

      <form>
        <Field label="Username" placeholder="xyz" />
        <Button> Start! </Button>
      </form>
    </Container>
  );
};

export default CreateGame;