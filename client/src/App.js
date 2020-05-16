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
  const { isOpen, message, variant } = useStoreState((state) => state.notifier);
  const { setSocket } = useStoreActions((actions) => actions.game);

  // Connect to the socket server.
  const socket = socketIOClient("http://127.0.0.1:8000");
  setSocket(socket);

  // Render the page.
  return (
    <div className="App">
      <Navbar/>
      <Routes/>
      <Footer/>
      {<Snackbar> test test </Snackbar>}
    </div>
  );
}

export default App;
