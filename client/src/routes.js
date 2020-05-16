import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Navigation/Home';
import CreateGame from './components/Game/CreateGame';
import JoinGame from './components/Game/JoinGame';
import Lobby from './components/Game/Lobby';

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/create-game" component={CreateGame} />
      <Route path="/join-game" component={JoinGame} />
      <Route path="/lobby" component={Lobby} />
    </Switch>
  )
}