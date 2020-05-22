import React from 'react';
import { useStoreState } from 'easy-peasy';
import styled, { css, keyframes } from 'styled-components';

const pulseNight = keyframes`
  0% {
    background: #fff;
  }

  100% {
    background: #000 ;
  }
`;

const pulseDay = keyframes`
  0% {
    background: #000;
  }
  
  100% {
    background: #fff ;
  }
`;

const Wrapper = styled.div`
  ${({ step }) => {
		switch(step) {
      case 'night': {
        return css`
					animation-duration: 4s;
          animation-name: ${pulseNight};
          animation-fill-mode: forwards;
				`;
      }
      case 'end':
      case 'day': {
        return css`
					animation-duration: 4s;
          animation-name: ${pulseDay};
          animation-fill-mode: forwards;
				`;
      }
      default: {
        return css`
					background: ${({ theme }) => theme.color.white};
				`;
      }
    }
  }};
`;

export const AppWrapper = ({ children}) => {
  const { step } = useStoreState((state) => state.game);

  return (
    <Wrapper step={step}> { children } </Wrapper>
  )
}