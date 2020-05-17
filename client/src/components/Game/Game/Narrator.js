import React from 'react';
import styled from 'styled-components';

// Components
import { Grid, Typography } from '../../atoms';

const Wrapper = styled.div`
  margin: 1rem 0 2rem;
`;

const Narrator = ({ children }) => {
  return (
    <Wrapper>
      <Grid container alignContent="center">
        <Typography variant="title">{ children }</Typography>
      </Grid>
    </Wrapper>
  );
};

export default Narrator;