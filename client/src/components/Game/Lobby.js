import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy";

import { Container, Grid, Typography, Card, CardHeader, CardBody, Button, CardFooter, Divider } from "../atoms";

const Lobby = () => {

	// States
	const { socket, id, self, owner, players, step } = useStoreState((state) => state.game);

	// Actions
	const { addPlayer, removePlayer, startGame, updatePlayer, updateStep } = useStoreActions((actions) => actions.game);
	const { update } = useStoreActions((actions) => actions.notifier);

	// Listen to player-joined and re-render
	useEffect(() => {
		socket.on("player-joined", (player) => {
			addPlayer(player);
			update({
				message: `Player ${player && player.username} has join the game`,
				variant: "warning"
			});
		});

		socket.on("player-left", (player) => {
			removePlayer(player);
			update({
				message: `Player ${player && player.username} has left the game`,
				variant: "warning"
			});
		});

		socket.on("player-role", (username, role) => {
			updatePlayer({ username, key: "role", value: role });
			updateStep("start");
			update({
				message: "The game is starting!",
				variant: "warning"
			});
		});
	}, []);

	const startGameHandler = () => {
		startGame();
	};

	const isOwner = self && self.username === owner;

	if (step === "start") {
		return <Redirect to="/game" />;
	}

	return (
		<Container>
			<Card>
				<CardHeader>
					<Typography variant="title"> Lobby </Typography>
					<Typography variant="subtitle1">Room code: {id}</Typography>
				</CardHeader>
				<Divider />
				<CardBody>
					<Grid container direction="column" alignItems="flex-start">
						<Grid item>
							{players &&
								players.map((player, i) => (
									<Typography variant="body1" key={player.id}>
										{" "}
										{`${i + 1}. ${player.username}`}
									</Typography>
								))}
						</Grid>
					</Grid>
				</CardBody>
				<Divider />
				<CardFooter>
					<Button width="100%" onClick={startGameHandler} disabled={!isOwner}>
						{!isOwner ? "Waiting for owner to start" : "Start"}
					</Button>
				</CardFooter>
			</Card>
		</Container>
	);
};

export default Lobby;
