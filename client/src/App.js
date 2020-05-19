import React from 'react';
import socketIOClient from "socket.io-client";
import './App.css';
import { useStoreActions, useStoreState } from "easy-peasy";

// Components
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import { Routes } from './routes';
import { Snackbar } from './components/atoms';

// Actions

function App() {
  const { setSocket } = useStoreActions((actions) => actions.game);

  // Connect to the socket server.
  const socket = socketIOClient("http://127.0.0.1:8000");
  setSocket(socket);

  socket.on('game-started', () => {
    console.log('game-started...');
  })

  
  
  socket.on('poll-started', (poll) => {
    console.log('poll-started');
    console.log('poll', poll);
  });

  // Message example
  // socket.emit('create-game', 'John');
  socket.emit('join-game', 'sKOTiWhI0', 'John');

  // Render the page.
  return (
    <div className="App">
      <Navbar/>
      <Routes/>
      <Footer/>
      <Snackbar/>
    </div>
  );
}

export default App;
