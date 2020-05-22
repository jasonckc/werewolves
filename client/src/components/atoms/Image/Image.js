import styled, { keyframes } from 'styled-components';

export const Image = styled.img`
  position: relative;
  padding: 0 0.8rem;
  vertical-align: ${({ align }) => align ? align : 'middle'};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;