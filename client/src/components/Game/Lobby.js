import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import { Container, Grid, Typography, Card, CardHeader, CardBody, Button, CardFooter, Divider, Image } from "../atoms";

const link = require('../../images/link.svg');

const PlayerList = styled.div`
	height: 300px;
	overflow-y: scroll; /* Add the ability to scroll */
	::-webkit-scrollbar {
		display: none;
	};
	-ms-overflow-style: none;
`;

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

	// Copy link onClick handler
	const copyLinkHandler = () => {
		navigator.clipboard.writeText(`${window.location.host}/join-game/${id}`);
		update({
			message: "Copied!",
			variant: "success"
		});
	};

	const isOwner = self && self.username === owner;

	if (step === "start") {
		return <Redirect to="/game" />;
	}

	return (
		<Container>
			<Grid container direction="column" justifyContent="center" alignContent="center">
				<Grid item>
					<Typography variant="game-title"> Werewolves </Typography>
					<Typography variant="title" align="center">
						{" "}
						Lobby{" "}
					</Typography>
				</Grid>
				<Grid item>
					<Card>
						<CardHeader>
							<Typography variant="subtitle1" align="center">
								Room code: {id}
							</Typography>
							<Typography variant="link" onClick={copyLinkHandler}>
								<Image src={link} width={25} height={25} />
								{`${window.location.host}/join-game/${id}`}
							</Typography>
						</CardHeader>
						<Divider />
						<CardBody>
							<Grid container direction="column" alignContent="center">
								<Grid item>
									<PlayerList>
										{players &&
											players.map((player, i) => (
												<Typography variant="subtitle2" key={player.id} align="center">
													{" "}
													{`${player.username}`}
												</Typography>
											))}
									</PlayerList>
								</Grid>
							</Grid>
						</CardBody>
						<Divider />
						<CardFooter>
							<Button width="100%" onClick={startGameHandler} disabled={!isOwner}>
								{!isOwner ? "Waiting for owner to start" : "Start"}
							</Button>
							<Typography variant="caption" align="center">
								{" "}
								There must be between 6 to 18 players
							</Typography>
						</CardFooter>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Lobby;
