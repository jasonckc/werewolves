import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy';

// Components
import Home from './components/Game/Home/Home';
import CreateGame from './components/Game/Home/CreateGame';
import JoinGame from './components/Game/Home/JoinGame';
import Lobby from './components/Game/Lobby';
import Game from './components/Game/Game/Game';

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/create-game" component={CreateGame} />
      <Route path="/join-game" component={JoinGame} />
      <PrivateRoute path="/lobby" component={Lobby} />
      <PrivateRoute path="/game" component={Game} />
    </Switch>
  )
}

// Protect the routes when no game instance is found
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { id } = useStoreState(state => state.game);
  const { update } = useStoreActions(actions => actions.notifier);

  return (
    <Route
      {...rest}
      render={props => {
        if (id) {
          return <Component {...props} />;
        } else {
          update({ variant: "warning", message: "No game instance. Please create or join one." });
          return <Redirect to="/" />;
        }
      }}
    />
  );
};