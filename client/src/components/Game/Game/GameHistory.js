import React, { useRef, useEffect } from "react";
import { useStoreState } from "easy-peasy";
import styled from "styled-components";
import { Typography, Card, Divider } from "../../atoms";

const Wrapper = styled.div`
	margin: 2rem 0;
	overflow-y: scroll;
	padding: 1rem;
	margin: 1rem auto;
	width: 100%;
	height: 60vh;
	border: 1px solid gray;
	border-radius: 5px;
	span:last-child {
		position: sticky;
		bottom: 0;
	}
`;

const GameHistory = () => {
	const { gameHistory } = useStoreState((state) => state.game);

	const AlwaysScrollToBottom = () => {
		const elementRef = useRef();
		useEffect(() => elementRef.current.scrollIntoView());
		return <div ref={elementRef} />;
	};

	return (
		<Wrapper>
			<Typography variant="subtitle2" align="center">
				{" "}
				Game history{" "}
			</Typography>
			<Divider />
			{gameHistory.length > 0 ? (
				gameHistory.map((history, i) => (
					<Typography variant="body1" key={i}>
						{" "}
						[{new Date(history.timestamp).toLocaleTimeString()}] {history.message}{" "}
					</Typography>
				))
			) : (
				<Typography variant="body1" align="center">
					{" "}
					The calm before the storm{" "}
				</Typography>
			)}
			<AlwaysScrollToBottom />
		</Wrapper>
	);
};

export default GameHistory;
