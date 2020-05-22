import styled, { css } from 'styled-components';

export const Typography = styled.span`
  
  ${({ align }) => align && css`text-align: ${align}`};
  display: block;
  padding-bottom: 1rem;

  ${({ variant }) => {
    switch(variant) {
      case 'game-title': {
        return css`
          font-size: 56px;
          font-weight: 700;
          letter-spacing: 3px;
          color: ${({ theme }) => theme.color.primary.dark};
        `;
      }
      case 'title': {
        return css`
          font-size: 42px;
          font-weight: 600;
          color: ${({ theme }) => theme.color.primary.dark};
        `;
      }
      case 'narrator-main': {
        return css`
          font-size: 42px;
          font-weight: 600;
          color: ${({ theme }) => theme.color.black};
        `;
      }
      case 'narrator-sub': {
        return css`
          font-size: 32px;
          font-weight: 500;
          color: ${({ theme }) => theme.color.black};
        `;
      }
      case 'subtitle1': {
        return css`
          font-size: 32px;
          font-weight: 500;
          color: ${({ theme }) => theme.color.primary.main};
        `;
      }
      case 'subtitle2': {
        return css`
          font-size: 21px;
          font-weight: 500;
          color: ${({ theme }) => theme.color.primary.dark};
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
          font-weight: 500;
          color: ${({ theme }) => theme.color.primary.main};
        `;
      }
      case 'link': {
        return css`
          font-size: 18px;
          color: ${({ theme }) => theme.color.primary.light};
          cursor: pointer;        
        `;
      }
      case 'caption': {
        return css`
          font-size: 14px;
          font-weight: 300;
          color: ${({ theme }) => theme.color.primary.main};
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
          
          padding: 0.3rem 0;
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
          
          padding: 0.3rem 0;
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
          
          padding: 0.3rem 0;
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