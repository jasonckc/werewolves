import React from "react";
import styled, { css } from "styled-components";
import { Typography } from "../Typography/Typography";

const werewolf = require("../../../images/werewolf.png");
const villager = require("../../../images/villager.png");
const unknown = require("../../../images/unknown.png");

const validateRole = (player, self) => {
	if (self.role === player.role || !player.isAlive) {
		return player.role;
	} else {
		return "unknown";
	}
};

const getSrc = (player, self) => {
	switch (validateRole(player, self)) {
		case "villager":
			return villager;
		case "werewolf":
			return werewolf;
		default:
			return unknown;
	}
};

const Wrapper = styled.div`
	margin: 1rem;
	padding: 0rem;
	border: 1px solid gray;
	border-radius: 12px;
	width: 240px;
	height: 270px;
	transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);

	${({ playerIndex, voteIndex }) => {
		if (playerIndex === voteIndex) {
			return css`
				transform: translate(0, -1rem);
			`;
		}
	}};

	${({ disabled }) => {
		if (disabled) {
			return css`
				transform: none;
				pointer-events: none;
			`;
		} else {
			return css`
				&:hover {
					transform: translate(0, -1rem);
				}
			`;
		}
	}};

	${({ player, self }) => {
		if (!player.isAlive) {
			return css`
				background: ${({ theme }) => theme.color.gray};
			`;
		} else {
			switch (validateRole(player, self)) {
				case "villager":
					return css`
						background: ${({ theme }) => theme.color.villager.light};
					`;
				case "werewolf":
					return css`
						background: ${({ theme }) => theme.color.werewolf.light};
					`;
				default:
					return css`
						background: ${({ theme }) => theme.color.unknown};
					`;
			}
		}
	}};
`;

const Image = styled.img`
	display: block;
	position: relative;
	width: 140px;
	height: 160px;
	margin: 0 auto;

	${({ role }) =>
		role === "unknown" &&
		css`
			width: 120px;
			height: 140px;
			margin-top: 20px;
		`};
`;

export const Role = ({ playerIndex, voteIndex, player, self, step }) => {
	return (
		<Wrapper
			disabled={
				step === "start" || player.username === self.username || self.role === "villager" || !player.isAlive
			}
			player={player}
			self={self}
			playerIndex={playerIndex}
			voteIndex={voteIndex}
		>
			<Image src={getSrc(player, self)} role={validateRole(player, self)} />
			<Typography variant={`username-${validateRole(player, self)}`}> {player.username} </Typography>
			<Typography variant={`role-${validateRole(player, self)}`}>{validateRole(player, self)}</Typography>
		</Wrapper>
	);
};
