import React from 'react';
import { Switch, Route } from 'react-router-dom';
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
      <Route path="/lobby" component={Lobby} />
      <Route path="/game" component={Game} />
    </Switch>
  )
}