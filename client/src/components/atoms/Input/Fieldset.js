import styled from 'styled-components';

export const Fieldset = styled.fieldset`
  padding: 0;
  margin: 0;
  border: 0;

  & + & {
    margin: 1rem 0;
  }

  &:nth-last-of-type(1) {
    margin-bottom: 1rem;
  }

  &:nth-last-of-type(n+0) {
    margin-top: 1rem;
  }

 
`;