import React from "react";
import styled, { css } from "styled-components";

const werewolf = require("../../../images/werewolf.png");
const villager = require("../../../images/villager.png");

const getSrc = (player, self) => {
	if (self.role === 'villager') {
    return villager;
  } else if (self.role === 'werewolf') {
    if (player.role === 'villager') {
      return villager;
    } else {
      return werewolf;
    }
  }
};

const Wrapper = styled.div`
	cursor: pointer;
	margin: 1rem;
	padding: 1rem;
	border: 1px solid gray;
	border-radius: 5px;
	width: 200px;
	transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
	&:hover {
		transform: translate(0, -1rem);
	}

	${({ player, self }) => {
		if (self.role === "villager") {
			return css`
				background: ${({ theme }) => theme.color.blue};
			`;
		} else if (self.role === "werewolf") {
			if (player.role === null) {
				return css`
					background: ${({ theme }) => theme.color.blue};
				`;
			} else {
				return css`
					background: ${({ theme }) => theme.color.red};
				`;
			}
		}
	}};
`;

const Image = styled.img`
	display: block;
	position: relative;
	width: 150px;
	height: 150px;
	margin: 1rem auto;
`;

const Username = styled.div`
	font-size: 21px;
	font-weight: 700;
	letter-spacing: 1;
	text-align: center;
	padding: 1rem 0 0;
	color: ${({ theme }) => theme.color.white};
`;

export const Role = ({ player, self }) => {
	return (
		<Wrapper player={player} self={self}>
			<Image src={getSrc(player, self)} />
			<Username> {player.username} </Username>
		</Wrapper>
	);
};
