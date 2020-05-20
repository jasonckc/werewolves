import React from 'react';
import { useStoreState } from 'easy-peasy';
import styled, { css, keyframes } from 'styled-components';

const pulse = keyframes`
  from {
    background: #fff;
  }

  to {
    background: #424242;
  }
`;

const Wrapper = styled.div`
  ${({ step }) => {
		switch(step) {
      case 'night': {
        return css`
					animation-duration: 2s;
          animation-name: ${pulse};
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