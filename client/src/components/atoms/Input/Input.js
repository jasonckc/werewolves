import styled from 'styled-components';
import { useState } from "react";

export const useInput = initialValue => {
  const [input, setInput] = useState(initialValue);

  const handleInputChange = (event) => setInput({
    ...input, 
    [event.target.name]: event.target.value
  })

  return {
    input,
    setInput,
    handleInputChange,
    reset: () => setInput("")
  };
};

export const Input = styled.input`
  padding: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.secondary.light};
  background: ${({ theme }) => theme.color.primary.main};
  border-radius: 3px;
  border-left: 4px solid;
  border-top: 0;
  border-right: 4px solid;
  border-bottom: 0;
  border-color: ${({ theme }) => theme.color.primary.light};
  transition: border-color 0s ease-in;

  &:focus {
    border-color: ${({ theme }) => theme.color.secondary.dark};
    outline: 0;
  }
`;