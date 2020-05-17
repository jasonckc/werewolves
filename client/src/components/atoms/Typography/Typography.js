import styled, { css } from 'styled-components';

export const Typography = styled.span`

  ${({ variant }) => {
    switch(variant) {
      case 'game-title': {
        return css`
          font-size: 22px;
          font-weight: 600;
          color: ${({ theme }) => theme.color.primary.dark};
        `;
      }
      case 'title': {
        return css`
          font-size: 30px;
          font-weight: 500;
          color: ${({ theme }) => theme.color.primary.main};
        `;
      }
      case 'subtitle1': {
        return css`
          font-size: 24px;
        `;
      }
      case 'body1': {
        return css`
          font-size: 18px;
        `;
      }
      case 'label': {
        return css`
          font-size: 16px;
          font-weight: 600;
          color: ${({ theme }) => theme.color.primary.light};
        `;
      }
      default: {
        return css`
          font-size: 16px;
        `;
      }
    }}
  };
  display: block;
  padding-bottom: 1rem;
`;