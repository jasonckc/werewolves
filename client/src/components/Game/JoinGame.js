import React from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Redirect } from 'react-router-dom';

// Components
import { Field } from "../molecules/Field";
import { Button, Container, Grid, Typography, useInput } from '../atoms/index';

const JoinGame = () => {
  const { input: { gameId, username }, handleInputChange, reset } = useInput({});

	// States
	const { id } = useStoreState((state) => state.game);
	
	// Actions
	const { joinGame } = useStoreActions((actions) => actions.game);

	const joinGameHandler = (event) => {
		event.preventDefault();
		
		joinGame({ gameId, username })
	}

	if (id) {
    return <Redirect to="/lobby" />
	}
	
	return (
		<Container>
			<Grid container direction="column">
				<Grid item>
					<Typography variant="title"> Join Game </Typography>
				</Grid>
				<Grid item>
					<form onSubmit={joinGameHandler}>
						<Field 
							name="gameId"
							label="Game ID"
              placeholder="" 
              value={gameId} 
              onChange={handleInputChange} 
							/>
							
						<Field 
							name="username"
							label="Username"
              placeholder="John Doe" 
              value={username} 
              onChange={handleInputChange}  />

						<Button type="submit"> Join! </Button>
					</form>
				</Grid>
			</Grid>
		</Container>
	);
};

export default JoinGame;
