import styled, { css } from "styled-components";

/**
 *  flex-direction: row | row-reverse | column | column-reverse;
 *  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left | right ... + safe | unsafe;
 *  align-items: stretch | flex-start | flex-end | center | baseline | first baseline | last baseline | start | end | self-start | self-end + ... safe | unsafe;
 *  align-content: flex-start | flex-end | center | space-between | space-around | space-evenly | stretch | start | end | baseline | first baseline | last baseline + ... safe | unsafe;

 */
export const Grid = styled.div`
  ${({ container, direction, justifyContent, alignItems, alignContent }) => container &&
    css`
      display: flex;
      flex-direction: ${direction};
      flex-wrap: ${direction = 'row' && 'wrap'};
      flex-basis: ${direction = 'column' && '100%'};
      justify-content: ${justifyContent || 'center'};
      align-items: ${alignItems || 'center'};
      align-content: ${alignContent || 'flex-start'};
      
      margin: 0 auto;
      padding: 0 1rem;
    `
  };

  ${({ item, xs, sm, md, lg, align }) => item &&
    css`
      @media (min-width: 420px) {
        flex-basis: calc(${xs} / 12 * 100%);
      };

      @media (min-width: 768px) {
        flex-basis: calc(${sm} / 12 * 100%);
      }

      @media (min-width: 1024px) {
        flex-basis: calc(${md} / 12 * 100%);
      }

      @media (min-width: 1200px) {
        flex-basis: calc(${lg} / 12 * 100%);
      }
      align-self: ${align};
    `
  };
`;
