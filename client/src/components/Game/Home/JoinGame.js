import React from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Redirect, useParams } from "react-router-dom";

// Components
import { Field } from "../../molecules/Field";
import { Button, Container, Grid, Typography, useInput, Card, CardBody, Fieldset, CardFooter, Image } from "../../atoms/index";

const logo = require('../../../images/logo.svg');

const JoinGame = () => {
	// Game id from URL's parameter
	const { matchId } = useParams();

	// Custom hook component to handle input & validation
	const { input: { gameId, username }, handleInputChange, reset } = useInput({});

	// States
	const { id } = useStoreState((state) => state.game);

	// Actions
	const { joinGame } = useStoreActions((actions) => actions.game);

	// Join a new game onClick handler. Check if the URL's game id param exists, else wait for user's input
	const joinGameHandler = (event) => {
		event.preventDefault();

		joinGame({ gameId: matchId ? matchId : gameId, username });
	};

	// If game id exists, redirect to the lobby
	if (id) {
		return <Redirect to="/lobby/" />;
	}

	return (
		<Container>
			<Grid container direction="column" justifyContent="center" alignContent="center">
				<Grid item>
					<Typography variant="game-title" align="center"> 
						<Image src={logo} width={60} height={60} align="baseline" /> 
						Werewolves 
					</Typography>
					<Typography variant="title" align="center">
						{" "}
						Join Game{" "}
					</Typography>
				</Grid>
				<Grid item>
					<Card>
						<form onSubmit={joinGameHandler}>
							<CardBody>
								{!matchId && (
									<Fieldset>
										<Field
											name="gameId"
											label="Game ID"
											placeholder=""
											value={gameId}
											onChange={handleInputChange}
										/>
									</Fieldset>
								)}

								<Fieldset>
									<Field
										name="username"
										label="Username"
										placeholder="John Doe"
										value={username}
										onChange={handleInputChange}
									/>
								</Fieldset>
							</CardBody>
							<CardFooter>
								<Button type="submit" width="100%">
									{" "}
									Join{" "}
								</Button>
							</CardFooter>
						</form>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default JoinGame;
