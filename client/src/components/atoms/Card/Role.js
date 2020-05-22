import React from "react";
import styled, { css } from "styled-components";
import { Typography } from "../../atoms/index";

const werewolf = require("../../../images/wolf-card.svg");
const werewolfDead = require("../../../images/wolf-card-dead.svg");
const villager = require("../../../images/villager-card.svg");
const villagerDead = require("../../../images/villager-card-dead.svg");
const unknown = require("../../../images/unknown-card.svg");
const unready = require("../../../images/tick.svg");
const ready = require("../../../images/ready.svg");
const grave = require("../../../images/grave.svg");

// Filter the card display according to the stage of the game
const filterStage = (player, self, step) => {
	// Reveal a player's card if the player is dead, or when the game ends
	if (step === "end" || !player.isAlive) {
		return "dead";
	} else if (self.role === player.role) {
		// Reveal the player's card to himself
		return "self";
	} else {
		// Unknown card
		return "unknown";
	}
};

const validateRole = (player, self, step) => {
	switch (filterStage(player, self, step)) {
		case "dead":
		case "self":
			if (player.role === "villager" || player.role === null) {
				return "villager";
			} else {
				return "werewolf";
			}
		case "unknown":
			return "unknown";
	}
};

const getSource = (player, self, step) => {
	switch (filterStage(player, self, step)) {
		case "dead":
			if (player.role === "villager" || player.role === null) {
				return villagerDead;
			} else {
				return werewolfDead;
			}
		case "self":
			if (player.role === "villager") {
				return villager;
			} else {
				return werewolf;
			}
		case "unknown":
			return unknown;
	}
};

const Wrapper = styled.div`
	margin: 2rem 1rem 1rem;
	padding: 0rem;
	border: none;
	border-radius: 12px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	width: 280px;
	height: 300px;
	transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);

	${({ playerIndex, voteIndex }) => {
		if (playerIndex === voteIndex) {
			return css`
				transform: scale(1.05) translate(0, -1rem);
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
					transform: scale(1.05) translate(0, -1rem);
				}
			`;
		}
	}};

	${({ player, self, step }) => {
		switch (filterStage(player, self, step)) {
			case "dead":
				return css`
					background: ${({ theme }) => theme.color.gray};
				`;
			case "self":
				if (player.role === "villager") {
					return css`
						background: ${({ theme }) => theme.color.villager.light};
					`;
				} else {
					return css`
						background: ${({ theme }) => theme.color.werewolf.light};
					`;
				}
			case "unknown":
				return css`
					background: ${({ theme }) => theme.color.unknown};
				`;
		}
	}};
`;

const Banner = styled.img`
	display: block;
	position: relative;
	margin: 0 auto;
	width: 100%;
	height: auto;
	border-radius: 12px;
`;

const Image = styled.img`
	width: 25px;
	height: 25px;
	border-radius: 50%;
	position: absolute;
	top: 1rem;
	right: 2rem;
	background: ${({ theme }) => theme.color.white};
`;

export const Role = ({ playerIndex, voteIndex, player, self, step }) => {
	return (
		<Wrapper
			disabled={
				step === "start" || step === "end" || player.username === self.username || !player.isAlive
			}
			player={player}
			self={self}
			step={step}
			playerIndex={playerIndex}
			voteIndex={voteIndex}
		>
			<Banner src={getSource(player, self, step)} />

			{step === "start" && <Image src={!player.ready ? unready : ready} player={player} />}

			{!player.isAlive && <Image src={grave} player={player} />}

			<Typography variant={`username-${validateRole(player, self, step)}`}>
				{player.username}
			</Typography>

			<Typography variant={`role-${validateRole(player, self, step)}`}>
				{validateRole(player, self, step)}
			</Typography>
		</Wrapper>
	);
};
