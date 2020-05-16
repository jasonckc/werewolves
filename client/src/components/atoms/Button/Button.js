import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const translate = keyframes`
  from {
    transform: translate(0, 0);
  }

  to {
    transform: translate(0.5rem, 0);
  }
`;

export const Button = styled.button`
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.secondary.main};
  border-radius: 5px;
  border: none;
  padding: 0.6rem 1.5rem;
  margin: 1rem auto 1rem;
  float: ${({ float }) => float};
  letter-spacing: 1px;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.color.secondary.dark};
    animation-duration: 0.5s;
    animation-name: ${translate};
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
`;

export const ButtonLink = styled(Link)`
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.secondary.main};
  background: transparent;
  border-radius: 3px;
  border: 2px solid;
  border-color: ${({ theme }) => theme.color.secondary.main};
  padding: 0.5rem 1rem;
  margin: 1rem;
  text-decoration: none
`;