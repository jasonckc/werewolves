import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	background: inherit;
	width: 100%;
	min-height: 100vh;
	margin: 0 auto;
	padding-top: 4rem;
	padding-bottom: 4rem;
  box-sizing: border-box;

	@media (min-width: 576px) {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	@media (min-width: 768px) {
		padding-left: 2rem;
		padding-right: 2rem;
	}

	@media (min-width: 1024px) {
		padding-left: 4rem;
		padding-right: 4rem;
	}

	@media (min-width: 1200px) {
		padding-left: 8rem;
		padding-right: 8rem;
	}
`;
