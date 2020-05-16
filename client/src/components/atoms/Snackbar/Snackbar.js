import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import styled, { keyframes, css } from "styled-components";

const translate = keyframes`
  from {
    transform: translate(0, 0);
  }

  to {
    transform: translate(0, -1rem);
  }
`;

const SnackbarWrapper = styled.div`
	${({ variant }) => {
		switch (variant) {
			case "success": {
				return css`
					background: ${({ theme }) => theme.color.success};
				`;
			}
			case "warning": {
				return css`
					background: ${({ theme }) => theme.color.warning};
				`;
			}
			case "error": {
				return css`
					background: ${({ theme }) => theme.color.error};
				`;
			}
			default: {
				return css`
					background: ${({ theme }) => theme.color.white};
				`;
			}
		}
	}};

	display: flex;
	align-items: center;
	color: ${({ theme }) => theme.color.white};
	position: absolute;
	bottom: 1rem;
	left: 1rem;
	width: 20vw;
	border-radius: 0.5rem;
	padding: 1rem;

	animation-duration: 0.5s;
	animation-name: ${translate};
	animation-iteration-count: 1;
	animation-direction: normal;
	animation-fill-mode: forwards;
`;

export const Snackbar = () => {
	const { isOpen, message, variant } = useStoreState((state) => state.notifier);
	const { close } = useStoreActions((actions) => actions.notifier);

	// useEffect will run only one time
	useEffect(() => {
		const timer = window.setInterval(() => {
      close();
    }, 5000);
    return () => { 
      window.clearInterval(timer);
    };
	}, []);

	return <div>{isOpen && <SnackbarWrapper variant={variant}> {message} </SnackbarWrapper>}</div>;
};
