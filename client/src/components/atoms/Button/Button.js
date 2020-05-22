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
  display: block;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.secondary.main};
  border-radius: 20px;
  border: none;
  padding: 0.6rem 1.5rem;
  margin: 0.5rem auto;
  letter-spacing: 1px;
  float: ${({ float }) => float};
  width: ${({ width }) => width};
;

  &:hover {
    background: ${({ theme }) => theme.color.secondary.dark};
    animation-duration: 0.5s;
    animation-name: ${translate};
    animation-iteration-count: infinite;
    animation-direction: alternate;
  };

  &:disabled {
    color: ${({ theme }) => theme.color.primary.white};
    background: ${({ theme }) => theme.color.gray};
    animation-name: none;
    pointer-events: none;
  }
`;

export const ButtonLink = styled(Link)`
  display: block;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.primary.main};
  border-radius: 5px;
  border: none;
  padding: 0.6rem 1.5rem;
  margin: 1rem auto 1rem;
  float: ${({ float }) => float};
  letter-spacing: 1px;
  width: 300px;
  text-align: center;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.color.primary.dark};
    animation-duration: 0.5s;
    animation-name: ${translate};
    animation-iteration-count: infinite;
    animation-direction: alternate;
  };
`;