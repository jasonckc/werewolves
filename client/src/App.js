import React from 'react';
import socketIOClient from "socket.io-client";
import logo from './logo.svg';
import './App.css';

// Components
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import { Routes } from './routes';

function App() {
  // Connect to the socket server.
  const socket = socketIOClient("http://127.0.0.1:8000");

  // Message example
  socket.emit('createGame');

  // Render the page.
  return (
    <div className="App">
      <Navbar/>
      <Routes/>
      <Footer/>
    </div>
  );
}

export default App;
