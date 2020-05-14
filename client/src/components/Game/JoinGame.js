import React from "react";
import { Field } from "../molecules/Field";
import { Button, Container, Grid, Typography } from '../atoms/index';

const JoinGame = () => {
	return (
		<Container>
			<Grid container direction="column">
				<Grid item>
					<Typography variant="title"> Join Game </Typography>
				</Grid>
				<Grid item>
					<form>
						<Field label="Game ID" />
						<Field label="Username" placeholder="xyz" />
						<Button> Join! </Button>
					</form>
				</Grid>
			</Grid>
		</Container>
	);
};

export default JoinGame;
