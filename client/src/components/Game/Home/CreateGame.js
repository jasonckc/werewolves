import React from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Redirect } from "react-router-dom";

// Components
import { Field } from "../../molecules/Field";
import { Button, Container, Grid, Typography, useInput, Card, Fieldset, CardBody, CardFooter, Image } from "../../atoms/index";

const logo = require('../../../images/logo.svg');

const CreateGame = () => {
	// Custom hook component to handle input & validation
	const { input: { username }, handleInputChange, reset } = useInput({});

	// States
	const { id } = useStoreState((state) => state.game);

	// Actions
	const { createGame } = useStoreActions((actions) => actions.game);

	// Create a new game onClick handler
	const createGameHandler = (event) => {
		event.preventDefault();

		createGame({ username });
	};

	// If game id exists, redirect to the lobby
	if (id) {
		return <Redirect to="/lobby" />;
	}

	return (
		<Container>
			<Grid container direction="column" justifyContent="center" alignContent="center">
				<Grid item>
					<Typography variant="game-title" align="center">
            <Image src={logo} width={70} height={70} align="baseline" /> 
            Werewolves
					</Typography>
					<Typography variant="title" align="center">
						{" "}
						Create Game
					</Typography>
				</Grid>
				<Grid item>
					<Card>
						<form onSubmit={createGameHandler}>
							<CardBody>
								<Fieldset>
									<Field
										name="username"
										label="Username"
										placeholder="xyz"
										value={username}
										onChange={handleInputChange}
									/>
								</Fieldset>
							</CardBody>
							<CardFooter>
								<Button type="submit" width="100%">
									{" "}
									Start{" "}
								</Button>
							</CardFooter>
						</form>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default CreateGame;
