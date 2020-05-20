import React from "react";
import styled from "styled-components";
import { useStoreState } from "easy-peasy";

// Components
import { Grid, Typography } from "../../atoms";

const Wrapper = styled.div`margin: 1rem 0 2rem;`;

const Narrator = () => {
	const { narrator } = useStoreState((state) => state.game);

	return (
		<Wrapper>
			<Grid container alignContent="center">
				<Typography variant="title"> {narrator} </Typography>
			</Grid>
		</Wrapper>
	);
};

export default Narrator;
