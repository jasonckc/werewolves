import React from 'react';
import socketIOClient from "socket.io-client";
import logo from './logo.svg';
import './App.css';

function App() {
  // Connect to the socket server.
  const socket = socketIOClient("http://127.0.0.1:8000");

  // Example handlers
  socket.on('join-success', (id) => {
    console.log(id);
  });

  socket.on('join-failed', () => {
    console.log('Could not join...');
  });

  socket.on('player-joined', (player) => {
    console.log(player);
  })

  // Message example
  socket.emit('create-game', 'John');
  // socket.emit('join-game', 'e4cBSpfnR', 'John');

  // Render the page.
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
