import styled, { css } from "styled-components";

export const Grid = styled.div`
  ${({ container, direction }) => container && 
    css`
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-auto-rows: auto;
    `
  };

  ${({ md }) => md && 
    css`
      grid-column: auto / span ${md};
    `
  };
`;