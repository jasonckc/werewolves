import React from "react";
import io from "socket.io-client";
import "./App.css";
import { useStoreActions } from "easy-peasy";

// Components
import { Routes } from "./routes";
import { Snackbar } from "./components/atoms";

function App() {
	const { setSocket } = useStoreActions((actions) => actions.game);

	// Connect to the socket server.
	const gameSocket = io.connect();
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
