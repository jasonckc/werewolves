import React, { useRef, useEffect } from "react";
import { useStoreState } from "easy-peasy";
import styled from "styled-components";

// Components
import { Typography, Divider } from "../../atoms";

const Wrapper = styled.div`
	overflow-y: scroll;
	padding: 1rem;
	margin: 3rem auto 1rem;
	width: 320px;
	height: 70vh;
	border: 1px solid gray;
	border-radius: 12px;
	background: ${({ theme }) => theme.color.white};
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
`;

const GameHistory = () => {
	const { gameHistory } = useStoreState((state) => state.game);

	const endRef = useRef(null);

	useEffect(() => {
		scrollDown(endRef);
	}, []);

	useEffect(
		() => {
			scrollDown(endRef);
		},
		[ gameHistory ]
	);

	const scrollDown = (ref) => ref.current && ref.current.scrollIntoView({ block: "nearest", inline: "nearest" });

	return (
		<Wrapper>
			<Typography variant="subtitle2" align="center">
				{" "}
				Game history{" "}
			</Typography>
			<Divider />
			{gameHistory.length > 0 ? (
				gameHistory.map((history, i) => (
					<Typography variant="body1" key={i} ref={gameHistory.length === i + 1 ? endRef : null}>
						{" "}
						[{new Date(history.timestamp).toLocaleTimeString()}] {history.message}{" "}
					</Typography>
				))
			) : (
				""
			)}
			<div ref={endRef}/>
		</Wrapper>
	);
};

export default GameHistory;
