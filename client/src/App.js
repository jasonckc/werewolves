import React from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled, { css } from 'styled-components';
// Components
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import { Routes } from './routes';
import { Snackbar } from './components/atoms';

const Wrapper = styled.div`
  ${({ step }) => {
		switch(step) {
      case 'night': {
        return css`
					background: ${({ theme }) => theme.color.black};
				`;
      }
      default: {
        return css`
					background: ${({ theme }) => theme.color.white};
				`;
      }
    }
	}};
`;

function App() {
  const { step } = useStoreState((state) => state.game);
  const { setSocket } = useStoreActions((actions) => actions.game);

  // Connect to the socket server.
  const socket = socketIOClient("http://127.0.0.1:8000");
  setSocket(socket);

  // Render the page.
  return (
    <App className="App">
      <Wrapper step={step}>
        <Navbar/>
        <Routes/>
        <Footer/>
        <Snackbar/>
      </Wrapper>
    </App>
  );
}

export default App;
