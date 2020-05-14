import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Navigation/Home';
import CreateGame from './components/Game/CreateGame';
import JoinGame from './components/Game/JoinGame';

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/create-game" component={CreateGame} />
      <Route path="/join-game" component={JoinGame} />
    </Switch>
  )
}