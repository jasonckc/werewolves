import React, { useEffect, useState } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import styled, { css } from "styled-components";

// Components
import { Container, Grid, Button } from "../../atoms";
import Roles from "./Roles";
import Narrator from "./Narrator";
import GameHistory from "./GameHistory";

const Game = () => {

	// States
	const { socket, step, self, nightCount, dayCount } = useStoreState((state) => state.game);
	const { setPoll, updatePlayer, updateStep, updateGameHistory, updateNarrator } = useStoreActions(
		(actions) => actions.game
	);

	// Listen to player-joined and re-render
	useEffect(() => {
		updateNarrator(`Welcome to the game of Werewolves! You've been assigned as a ${self && self.role}. 
    Ready up and good luck!`);
	}, []);

	useEffect(
		() => {
			socket.on("poll-started", (poll) => {
				setPoll(poll);
			});

			socket.on("poll-voted", (username, option) => {
				if (option === "ready") {
					updatePlayer({ username, key: option, value: true });
					updateGameHistory({ timestamp: Date.now(), message: `${username} is ${option}` });
				} else {
					updateGameHistory({ timestamp: Date.now(), message: `${username} wishes to vote for ${option}` });
				}
			});

			socket.on("poll-ended", (res) => {
				if (step === "start") {
					updateStep("night");
					updateNarrator(`The night is falling. Werewolves, choose your prey.`);
					updateGameHistory({ timestamp: Date.now(), message: `Night #${nightCount + 1}` });
				}
			});

			socket.on("player-died", (username, role) => {
				if (step === "night") {
					updateStep("day");
					updateGameHistory({ timestamp: Date.now(), message: `Day #${dayCount}` });
					updateNarrator(
						`It's a new day! But the ${role} ${username} has died during the night.. Who's the culprit?`
					);
				} else if (step === "day") {
					updateStep("night");
					updateGameHistory({ timestamp: Date.now(), message: `Night #${nightCount + 1}` });
					updateNarrator(`The night is falling again, after the council executed ${role} ${username}.`);
				}

				updatePlayer({ username, key: "isAlive", value: false });
				updatePlayer({ username, key: "role", value: role });
				updateGameHistory({
					timestamp: Date.now(),
					message: `${username} [${role.toUpperCase()}] has been killed.`
				});
			});

			socket.on("game-ended", (winner) => {
				updateStep("end");
				updateNarrator(`The ${winner} have won the game! Good game!`);
				updateGameHistory({ timestamp: Date.now(), message: `The ${winner} have won the game.` });
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
		<Container>
			<Grid container direction="row" justifyContent="center" alignItems="flex-start">
				<Grid item sm={9}>
					<Narrator />
					<Roles />
				</Grid>
				<Grid item xs={3}>
					<GameHistory />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Game;
