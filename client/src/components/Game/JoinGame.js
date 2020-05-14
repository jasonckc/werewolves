import React from 'react';
import { Container } from '../atoms/Grid/Container';
import { Field } from '../molecules/Field';
import { Button } from '../atoms/Button/Button';

const JoinGame = () => {
  return (
    <Container>
      Create game

      <form>
        <Field label="Game ID" />
        <Field label="Username" placeholder="xyz" />
        <Button> Join! </Button>
      </form>
    </Container>
  );
};

export default JoinGame;