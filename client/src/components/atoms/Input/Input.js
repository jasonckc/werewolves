import styled from 'styled-components';

export const Input = styled.input`
  padding: 0.5rem;
  margin: 0.5rem;
  color: ${({ theme }) => theme.color.secondary.light};
  background: ${({ theme }) => theme.color.primary.dark};;
  border: none;
  border-radius: 3px;
`;