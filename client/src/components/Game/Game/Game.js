import React, { useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";

// Components
import { Container, Grid } from "../../atoms";
import Roles from "./Roles";
import Narrator from "./Narrator";
import GameHistory from "./GameHistory";
import { AppWrapper } from "../../atoms/Grid/AppWrapper";

const Game = () => {
	// States
	const { socket, step, self, nightCount, dayCount } = useStoreState((state) => state.game);

	// Actions
	const { 
		setPoll, onPollVote, onPlayerDied, onPollEnded, onGameEnded, updateNarrator, updatePlayer 
	} = useStoreActions((actions) => actions.game);

	// Listen to player-joined and re-render
	useEffect(() => {
		window.scrollTo(0, 0);

		updateNarrator('waiting');
	}, []);

	useEffect(
		() => {
			socket.on("poll-started", (poll) => {
				setPoll(poll);
			});

			socket.on("poll-voted", (username, option) => {
				onPollVote({ username, option });
			});

			socket.on("poll-ended", () => {
				onPollEnded();
			});

			socket.on("player-died", (username, role) => {
				onPlayerDied({ username, role });
			});

			socket.on("game-ended", (winner, players) => {
				console.log('players', players)
				onGameEnded({ winner, players });
			});

			return () => {
				socket.off("poll-started");
				socket.off("poll-voted");
				socket.off("poll-ended");
				socket.off("player-died");
				socket.off("game-ended");
			};
		},
		[ step ]
	);

	return (
		<AppWrapper step={step}>
			<Container>
				<Grid container direction="row" justifyContent="center" alignContent="center" alignItems="center">
					<Grid item sm={9} xs={12} align={`${step === "night" && self.role === "villager" ? "center" : "flex-start"}`}>
						<Narrator />
						{ (step !== "night" || self.role !== "villager") && <Roles />}
					</Grid>
					<Grid item sm={3} xs={12} align="flex-start">
						<GameHistory />
					</Grid>
				</Grid>
			</Container>
		</AppWrapper>
	);
};

export default Game;
