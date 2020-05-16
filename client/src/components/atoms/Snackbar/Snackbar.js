import React from 'react';
import styled from 'styled-components';

export const Snackbar = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.color.primary.main};
  color: ${({ theme }) => theme.color.white};
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  width: 20vw;
  border-radius: 0.5rem;
  padding: 1rem;
`;
