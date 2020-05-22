import React from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import { useStoreActions } from "easy-peasy";

// Components
import Navbar from "./components/Navigation/Navbar";
import Footer from "./components/Navigation/Footer";
import { Routes } from "./routes";
import { Snackbar } from "./components/atoms";
import { AppWrapper } from "./components/atoms/Grid/AppWrapper";

function App() {
	const { setSocket } = useStoreActions((actions) => actions.game);

	// Connect to the socket server.
	const gameSocket = socketIOClient("http://127.0.0.1:8000");
	setSocket(gameSocket);

	// Render the page.
	return (
		<div className="App">
			<Routes />
			<Snackbar />
		</div>
	);
}

export default App;
