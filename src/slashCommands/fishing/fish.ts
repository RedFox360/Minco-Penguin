import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { randomInt } from "mathjs";
import { CommandData, Profile } from "../../types";
import emojis from "../../functions/fishEmojis";

export const data = new SlashCommandBuilder()
	.setName("fish")
	.setDescription("Fish for some fish");

export const cooldown = "10m";

export async function run({
	interaction,
	updateProfile,
	profile,
}: CommandData) {
	if (!profile.rod) {
		await interaction.reply({
			content: "You don't have a fishing rod!",
			ephemeral: true,
		});
		return;
	}

	let salmons = 0,
		cods = 0,
		puffers = 0,
		clowns = 0,
		axolotls = 0;
	const addAmount = await getAmount(profile, updateProfile);
	switch (profile.rod) {
		case "wooden": {
			if (percentage(80)) salmons = randomInt(3, 10) + addAmount;
			if (percentage(90)) cods = randomInt(3, 16) + addAmount;
			if (percentage(20)) clowns = randomInt(2, 4) + addAmount;
			if (percentage(20)) puffers = 2 + addAmount;
			if (percentage(5)) axolotls = 1 + addAmount;
			break;
		}
		case "upgraded": {
			if (percentage(85)) salmons = randomInt(3, 10) + addAmount;
			if (percentage(95)) cods = randomInt(3, 16) + addAmount;
			if (percentage(20)) clowns = randomInt(2, 4) + addAmount;
			if (percentage(20)) puffers = 2 + addAmount;
			if (percentage(5)) axolotls = 1 + addAmount;
			break;
		}
		case "metal": {
			if (percentage(75)) salmons = randomInt(6, 11) + addAmount;
			if (percentage(85)) cods = randomInt(6, 18) + addAmount;
			if (percentage(25)) clowns = 2 + addAmount;
			if (percentage(20)) puffers = 2 + addAmount;
			if (percentage(5)) axolotls = 1 + addAmount;
			break;
		}
		case "heavy": {
			if (percentage(75)) salmons = randomInt(7, 12) + addAmount;
			if (percentage(85)) cods = randomInt(7, 20) + addAmount;
			if (percentage(30)) clowns = 2 + addAmount;
			if (percentage(25)) puffers = 2 + addAmount;
			if (percentage(7)) axolotls = 1 + addAmount;
			break;
		}
		case "polished": {
			if (percentage(80)) salmons = randomInt(7, 12) + addAmount;
			if (percentage(90)) cods = randomInt(7, 20) + addAmount;
			if (percentage(25)) clowns = randomInt(2, 4) + addAmount;
			if (percentage(20)) puffers = 2 + addAmount;
			if (percentage(5)) axolotls = 1 + addAmount;
			break;
		}
		case "quartz": {
			if (percentage(85)) salmons = randomInt(7, 12) + addAmount;
			if (percentage(95)) cods = randomInt(7, 20) + addAmount;
			if (percentage(30)) clowns = randomInt(2, 4) + addAmount;
			if (percentage(25)) puffers = 2 + addAmount;
			if (percentage(10)) axolotls = 1 + addAmount;
			break;
		}
		case "ruby": {
			if (percentage(90)) salmons = randomInt(7, 12) + addAmount;
			cods = randomInt(7, 20) + addAmount;
			if (percentage(30)) clowns = randomInt(2, 5) + addAmount;
			if (percentage(25)) puffers = 3 + addAmount;
			if (percentage(10)) axolotls = 1 + addAmount;
			break;
		}
		case "sapphire": {
			if (percentage(90)) salmons = randomInt(7, 14) + addAmount;
			cods = randomInt(10, 22) + addAmount;
			if (percentage(30)) clowns = randomInt(2, 6) + addAmount;
			if (percentage(25)) puffers = randomInt(2, 4) + addAmount;
			if (percentage(10)) axolotls = 1 + addAmount;
			break;
		}
		case "diamond": {
			if (percentage(95)) salmons = randomInt(7, 16) + addAmount;
			cods = randomInt(10, 25) + addAmount;
			if (percentage(40)) clowns = randomInt(2, 6) + addAmount;
			if (percentage(35)) puffers = randomInt(2, 6) + addAmount;
			if (percentage(12)) axolotls = 1 + addAmount;
			break;
		}
		case "emerald": {
			salmons = randomInt(8, 18) + addAmount;
			cods = randomInt(10, 30) + addAmount;
			if (percentage(40)) clowns = randomInt(2, 7) + addAmount;
			if (percentage(35)) puffers = randomInt(2, 6) + addAmount;
			if (percentage(15)) axolotls = 1 + addAmount;
			break;
		}
		default: {
			await interaction.reply({
				content:
					"Hmmm... an error occured and we couldn't find your fishing rod.",
				ephemeral: true,
			});
			return;
		}
	}

	const resultEmbed = new MessageEmbed().setTitle(
		"You went fishing and caught..."
	);

	// checking if all the fish equal 0
	if (
		salmons === cods &&
		cods === puffers &&
		puffers === clowns &&
		clowns === axolotls &&
		axolotls === 0
	) {
		resultEmbed
			.setDescription("Nothing! You were just really unlucky 🙁")
			.setColor("#EC7063");
		await interaction.reply({ embeds: [resultEmbed] });
		return;
	}
	resultEmbed.setColor("#D5f5E3");
	// xp increases by ~2/3 of the total fish amount
	const increaseXp = Math.floor(
		0.667 * (salmons + cods + puffers + clowns + axolotls)
	);
	await updateProfile({
		$inc: {
			"fish.cods": cods,
			"fish.salmons": salmons,
			"fish.pufferfish": puffers,
			"fish.clownfish": clowns,
			"fish.axolotls": axolotls,
			"fish.xp": increaseXp,
		},
	});

	resultEmbed
		.addField(`${emojis.salmon} Salmon`, salmons.toLocaleString(), true)
		.addField(`${emojis.cod} Cod`, cods.toLocaleString(), true)
		.addField(`${emojis.pufferfish} Pufferfish`, puffers.toLocaleString(), true)
		.addField(`${emojis.clownfish} Clownfish`, clowns.toLocaleString(), true)
		.addField(`${emojis.axolotl} Axolotls`, axolotls.toLocaleString(), true);

	await interaction.reply({ embeds: [resultEmbed] });
}

function percentage(num: number) {
	return randomInt(0, 100) < num;
}

async function getAmount(profile: Profile, updateProfile) {
	if (!profile.fish) return 0;
	const { baits, baitType } = profile.fish;
	if (!baits) return 0;
	if (baitType === "fish") {
		await updateProfile({ $inc: { "fish.baits": -1 } });
		return 4;
	}
	if (baitType === "bug") {
		await updateProfile({ $inc: { "fish.baits": -1 } });
		return 3;
	}
	if (baitType === "leech") {
		await updateProfile({ $inc: { "fish.baits": -1 } });
		return 2;
	}
	if (baitType === "worm") {
		await updateProfile({ $inc: { "fish.baits": -1 } });
		return 1;
	}
	return 0;
}
