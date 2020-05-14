import styled from "styled-components";

export const Container = styled.div`
	width: 100%;
  box-sizing: border-box;
	margin-left: auto;
	margin-right: auto;

	@media (min-width: 640px) {
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
