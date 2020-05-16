import React, { useEffect } from "react";
import { Container, Grid, Typography, Card, CardHeader, CardBody } from "../atoms";
import { useStoreState, useStoreActions } from "easy-peasy";

const Lobby = () => {
  // const id = 'gsd43';
  // const players = [
  //   { id: 1, username: "Jason1 "},
  //   { id: 2, username: "Jason2 "},
  //   { id: 3, username: "Jason3 "},
  //   { id: 4, username: "Jason4 "},
  // ]
	// States
  const { socket, id, players } = useStoreState((state) => state.game);
  
  // Actions
	const { addPlayer } = useStoreActions((actions) => actions.game);
	const { update } = useStoreActions((actions) => actions.notifier);

  // Listen to player-joined and re-render
  useEffect(() => {
    socket.on('player-joined', (player) => {
      addPlayer(player);
      update({
        message: `Player ${ player && player.username } has join the game`,
        variant: "warning"
      })
    });
  }, []);

	return (
		<Container>
      <Card>
        <CardHeader>
          <Typography variant="title" style={{textAlign: 'center'}}> Lobby </Typography>
        </CardHeader>
        <CardBody>
          <Grid container direction="column" alignItems="flex-start">
            <Grid item>
              <Typography variant="subtitle1">Room code: {id}</Typography>
            </Grid>
            <Grid item>
              {players && players.map((player) => (
                <Typography variant="subtitle1" key={player.id}>{player.username}</Typography>
              ))}
            </Grid>
          </Grid>
        </CardBody>
      </Card>
		</Container>
	);
};

export default Lobby;
