import React, { useState } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";

// Components
import { Grid, Role, Button, Image } from "../../atoms";

const tick = require('../../../images/tick.svg');

const Roles = () => {
	const { step, self, players, poll } = useStoreState((state) => state.game);
	const { playerVote } = useStoreActions((actions) => actions.game);

	const [ voteIndex, setVoteIndex ] = useState(-1);

	const werewolfVoteHandler = (username, playerIndex) => {
    let pollIndex = poll.options.findIndex((option) => option === username);
    
		setVoteIndex(playerIndex);
		playerVote({ option: poll.options[pollIndex] });
	};

	const villagerVoteHandler = (username, playerIndex) => {
    let pollIndex = poll.voters.findIndex((option) => option.username === username);
    
		setVoteIndex(playerIndex);
		playerVote({ option: poll.options[pollIndex] });
	};

	const renderVotes = (player, self, playerIndex) => {
		switch (step) {
			case "night":
				return (
					<Button
						width="90%"
						onClick={werewolfVoteHandler.bind(this, player.username, playerIndex)}
						disabled={!self.isAlive || !player.isAlive || self.username === player.username}
					>
						
					Vote
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
