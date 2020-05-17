import React, { useEffect } from "react";
import { Container, Grid, Typography, Card, CardHeader, CardBody, Button, CardFooter, Divider } from "../atoms";
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
  const { socket, id, self, owner, players } = useStoreState((state) => state.game);
  
  // Actions
	const { addPlayer, removePlayer } = useStoreActions((actions) => actions.game);
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

    socket.on('player-left', (player) => {
      console.log('player left...');
      console.log(player);
      removePlayer(player);
      update({
        message: `Player ${ player && player.username } has left the game`,
        variant: "warning"
      })
    })

  }, []);

  const isOwner = self === owner;

	return (
		<Container>
      <Card>
        <CardHeader>
          <Typography variant="title"> Lobby </Typography>
          <Typography variant="subtitle1">Room code: {id}</Typography>
        </CardHeader>
        <Divider/>
        <CardBody>
          <Grid container direction="column" alignItems="flex-start">
            <Grid item>
              {players && players.map((player, i) => (
                <Typography variant="body1" key={player.id}> {`${i + 1}. ${player.username}`}</Typography>
              ))}
            </Grid>
          </Grid>
        </CardBody>
        <Divider/>
        <CardFooter>
          <Button type="submit" disabled={!isOwner}> { !isOwner ? "Waiting for owner to start" : "Start"} </Button>
        </CardFooter>
      </Card>
		</Container>
	);
};

export default Lobby;
