import React, { Fragment } from "react";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "easy-peasy";

// Components
import { Grid, Typography, Button, Image } from "../../atoms";

const night = require('../../../images/moon.svg');
const cup = require('../../../images/cup.svg');

const Wrapper = styled.div`padding: 2rem 3rem 2rem;`;

const Narrator = () => {
	const { narrator, step, self, poll, lastKilled, winner } = useStoreState((state) => state.game);
	const { playerVote } = useStoreActions((actions) => actions.game);
	
	const readyOptionHandler = () => {
		playerVote({ option: poll.options[0] });
	};
	
	const renderContent = () => {
		switch(narrator) {
			case 'waiting': 
				return (
					<Fragment>
						<Typography variant="title" align="center">
							Welcome to the game of Werewolves! You are a {self && self.role}.
						</Typography>
						<Typography variant="subtitle1" align="center">
							Ready up and good luck.
						</Typography>
					</Fragment>
				);
			case 'start': 
				return (
					<Fragment>
						<Typography variant="title" align="center">
							<Image src={night} width={40} height={40} /> It's the night.
						</Typography>
						<Typography variant="subtitle1" align="center">
							{ self.role === "villager"
								? "The werewolves are awake."
								: "Time to choose tonight's victim."
							} 
						</Typography>
					</Fragment>
				);
			case 'day': 
				return (
					<Fragment>
						<Typography variant="title" align="center">
							Good morning!
						</Typography>
						<Typography variant="subtitle1" align="center">
							{ lastKilled.username === self.username 
								? "You have been killed by the werewolves."
								: `Unfortunately, ${lastKilled && lastKilled.username} died during the night. He/she was a ${lastKilled && lastKilled.role}.
									Who do you think is a werewolf? Select a player to eliminate in the list below.`
							} 
						</Typography>
					</Fragment>
				);
			case 'night': 
				return (
					<Fragment>
						<Typography variant="title" align="center">
							<Image src={night} width={40} height={40} /> It's the night again.
						</Typography>
						<Typography variant="subtitle1" align="center">
							{ lastKilled.username === self.username 
								? "You have been killed by the villagers."
								: `The village has decided to eliminate ${lastKilled && lastKilled.username}. He/she was a ${lastKilled && lastKilled.role}.`
							} 
						</Typography>
					</Fragment>
				);
			case 'end': 
				return (
					<Fragment>
						<Typography variant="title" align="center">
							<Image src={cup} width={50} height={50} /> The {winner && winner} have won the game!
						</Typography>
						<Typography variant="subtitle1" align="center">
							Good game!
						</Typography>
					</Fragment>
				);
			default:
				console.log("Error");
		}
	}

	return (
		<Wrapper>
			<Grid container direction="column" alignContent="center">
				<Grid item>
					{ renderContent() }
				</Grid>
				{step === "start" && (
					<Grid item>
						<Button
							width="200px"
							onClick={readyOptionHandler}
							disabled={self.ready}
						>
							{self && self.ready ? "Ready" : "Unready"}
						</Button>
					</Grid>
				)}
			</Grid>
		</Wrapper>
	);
};

export default Narrator;
