import styled, { css } from 'styled-components';

export const Typography = styled.span`
  
  ${({ align }) => align && css`text-align: ${align}`};
  display: block;
  padding-bottom: 1rem;

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
      case 'subtitle2': {
        return css`
          font-size: 22px;
          color: ${({ theme }) => theme.color.primary.main};
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
      case 'username-werewolf': {
        return css`
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 1;
          text-align: center;
          padding: 0.5rem 0 0;
          color: ${({ theme }) => theme.color.white};
        `;
      }
      case 'username-villager':
      case 'username-unknown': {
        return css`
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 1;
          text-align: center;
          padding: 0.5rem 0 0;
          color: ${({ theme }) => theme.color.werewolf.light};
        `;
      }
      case 'role-werewolf': {
        return css`
          border-radius: 1rem;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 1;
          text-align: center;
          
          padding: 0.4rem 0;
          margin: 0.5rem 4rem;
          background: ${({ theme }) => theme.color.white};
          color: ${({ theme }) => theme.color.werewolf.light};
        `;
      }
      case 'role-villager': {
        return css`
          border-radius: 1rem;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 1;
          text-align: center;
          
          padding: 0.4rem 0;
          margin: 0.5rem 4rem;
          background: ${({ theme }) => theme.color.werewolf.light};
          color: ${({ theme }) => theme.color.white};
        `;
      }
      case 'role-unknown': {
        return css`
          border: 1px solid white;
          border-radius: 1rem;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 1;
          text-align: center;
          
          padding: 0.4rem 0;
          margin: 0.5rem 4rem;
          background: ${({ theme }) => theme.color.werewolf.light};
          color: ${({ theme }) => theme.color.white};
        `;
      }
      default: {
        return css`
          font-size: 16px;
        `;
      }
    }}
  };
`;