import styled, { css } from 'styled-components';

export const Typography = styled.span`

  ${({ variant }) => {
    switch(variant) {
      case 'title': {
        return css`
          font-size: 30px;
        `;
      }
      case 'subtitle1': {
        return css`
          font-size: 24px;
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