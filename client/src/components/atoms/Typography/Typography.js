import styled, { css } from 'styled-components';

export const Typography = styled.p`
  ${({ variant }) => {
    switch(variant) {
      case 'title': {
        return css`
          font-size: 30px;
          color: blue;
        `;
      }
      case 'subtitle1': {
        return css`
          font-size: 24px;
        `;
      }
      case 'label': {
        return css`
          font-size: 18px;
        `;
      }
      default: {
        return css`
          font-size: 16px;
        `;
      }
    }}
  };
  color: ${({ theme }) => theme.color.primary.dark};
`;