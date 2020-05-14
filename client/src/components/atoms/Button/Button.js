import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Button = styled.button`
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.secondary.main};
  background: transparent;
  border-radius: 3px;
  border: 2px solid;
  border-color: ${({ theme }) => theme.color.secondary.main};
  padding: 0.5rem 1rem;
  margin: 1rem auto;
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