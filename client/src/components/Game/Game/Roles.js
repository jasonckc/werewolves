import React, { Fragment } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";

// Components
import { Grid, Role, Button } from "../../atoms";

const Roles = () => {
	const { socket, step, self, players, poll } = useStoreState((state) => state.game);
	const { setPoll, playerVote, updatePlayer, updateGameHistory } = useStoreActions((actions) => actions.game);

	const readyOptionHandler = () => {
		playerVote({ option: poll.options[0] });
	};

	return (
		<div>
			<Grid container direction="row" justifyContent="center">
				{players &&
					players.map((player) => (
						<Grid item align="center">
							<Grid item>
								<Role player={player} self={self} />
							</Grid>
							<Grid item>
								<Button
									width="90%"
									onClick={readyOptionHandler}
									disabled={player.username !== self.username}
								>
									{player && player.ready ? "Ready" : "Unready"}
								</Button>
							</Grid>
						</Grid>
					))}
			</Grid>
		</div>
	);
};

export default Roles;
