import React, { Fragment, useState } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";

// Components
import { Grid, Role, Button } from "../../atoms";

const Roles = () => {
	const { socket, step, self, players, poll } = useStoreState((state) => state.game);
	const { setPoll, playerVote, updatePlayer, updateGameHistory } = useStoreActions((actions) => actions.game);

	const [ voteIndex, setVoteIndex ] = useState(-1);

	const readyOptionHandler = () => {
		playerVote({ option: poll.options[0] });
	};

	const werewolfVoteHandler = (username, playerIndex) => {
    console.log('werewolfvote', username);
    let pollIndex = poll.options.findIndex(option => option === username);
    setVoteIndex(playerIndex);
		playerVote({ option: poll.options[pollIndex] });
  };
  
  const villagerVoteHandler = (username, playerIndex) => {
    console.log('villagervote', username);
    let pollIndex = poll.voters.findIndex(option => option.username === username);
    setVoteIndex(playerIndex);
		playerVote({ option: poll.options[pollIndex] });
	};

	const renderVotes = (player, self, playerIndex) => {
		switch (step) {
			case "start":
				return (
					<Button
						width="90%"
						onClick={readyOptionHandler}
						disabled={player.username !== self.username || player.ready}
					>
						{player && player.ready ? "Ready" : "Unready"}
					</Button>
				);
			case "night":
				return (
					<Button
						width="90%"
						onClick={werewolfVoteHandler.bind(this, player.username, playerIndex)}
						disabled={!player.isAlive || self.role === "villager" || self.username === player.username}
					>
						{self.role === "villager" ? "Waiting" : "Vote"}
					</Button>
				);

			case "day":
				return (
					<Button
						width="90%"
						onClick={villagerVoteHandler.bind(this, player.username, playerIndex)}
						disabled={!self.isAlive || !player.isAlive || self.username === player.username}
					>
						Vote
					</Button>
				);
		}
	};
	return (
		<div>
			<Grid container direction="row" justifyContent="center">
				{players &&
					players.map((player, playerIndex) => (
						<Grid item align="center" key={player.id}>
							<Grid item>
								<Role
									playerIndex={playerIndex}
									voteIndex={voteIndex}
									player={player}
									self={self}
									step={step}
								/>
							</Grid>
							<Grid item>{renderVotes(player, self, playerIndex)}</Grid>
						</Grid>
					))}
			</Grid>
		</div>
	);
};

export default Roles;
