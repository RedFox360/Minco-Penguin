import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { randomInt } from "mathjs";
import { CommandData, Profile } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("fish")
	.setDescription("Fish for some fish");

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
		lotls = 0;
	const addAmount = await getAmount(profile, updateProfile);
	switch (profile.rod) {
		case "wood": {
			if (percentage(80)) salmons = randomInt(3, 10) + addAmount;
			if (percentage(90)) cods = randomInt(3, 16) + addAmount;
			if (percentage(20)) clowns = randomInt(2, 4) + addAmount;
			if (percentage(20)) puffers = 2 + addAmount;
			if (percentage(5)) lotls = 1 + addAmount;
			break;
		}
		case "upgraded": {
			if (percentage(85)) salmons = randomInt(3, 10) + addAmount;
			if (percentage(95)) cods = randomInt(3, 16) + addAmount;
			if (percentage(20)) clowns = randomInt(2, 4) + addAmount;
			if (percentage(20)) puffers = 2 + addAmount;
			if (percentage(5)) lotls = 1 + addAmount;
			break;
		}
		case "metal": {
			if (percentage(75)) salmons = randomInt(6, 11) + addAmount;
			if (percentage(85)) cods = randomInt(6, 18) + addAmount;
			if (percentage(25)) clowns = 2 + addAmount;
			if (percentage(20)) puffers = 2 + addAmount;
			if (percentage(5)) lotls = 1 + addAmount;
			break;
		}
		case "heavy": {
			if (percentage(75)) salmons = randomInt(7, 12) + addAmount;
			if (percentage(85)) cods = randomInt(7, 20) + addAmount;
			if (percentage(30)) clowns = 2 + addAmount;
			if (percentage(25)) puffers = 2 + addAmount;
			if (percentage(7)) lotls = 1 + addAmount;
			break;
		}
		case "polished": {
			if (percentage(80)) salmons = randomInt(7, 12) + addAmount;
			if (percentage(90)) cods = randomInt(7, 20) + addAmount;
			if (percentage(25)) clowns = randomInt(2, 4) + addAmount;
			if (percentage(20)) puffers = 2 + addAmount;
			if (percentage(5)) lotls = 1 + addAmount;
			break;
		}
		case "quartz": {
			if (percentage(85)) salmons = randomInt(7, 12) + addAmount;
			if (percentage(95)) cods = randomInt(7, 20) + addAmount;
			if (percentage(30)) clowns = randomInt(2, 4) + addAmount;
			if (percentage(25)) puffers = 2 + addAmount;
			if (percentage(10)) lotls = 1 + addAmount;
			break;
		}
		case "ruby": {
			if (percentage(90)) salmons = randomInt(7, 12) + addAmount;
			cods = randomInt(7, 20) + addAmount;
			if (percentage(30)) clowns = randomInt(2, 5) + addAmount;
			if (percentage(25)) puffers = 3 + addAmount;
			if (percentage(10)) lotls = 1 + addAmount;
			break;
		}
		case "sapphire": {
			if (percentage(90)) salmons = randomInt(7, 14) + addAmount;
			cods = randomInt(10, 22) + addAmount;
			if (percentage(30)) clowns = randomInt(2, 6) + addAmount;
			if (percentage(25)) puffers = randomInt(2, 4) + addAmount;
			if (percentage(10)) lotls = 1 + addAmount;
			break;
		}
		case "diamond": {
			if (percentage(95)) salmons = randomInt(7, 16) + addAmount;
			cods = randomInt(10, 25) + addAmount;
			if (percentage(40)) clowns = randomInt(2, 6) + addAmount;
			if (percentage(35)) puffers = randomInt(2, 6) + addAmount;
			if (percentage(12)) lotls = 1 + addAmount;
			break;
		}
		case "emerald": {
			salmons = randomInt(8, 18) + addAmount;
			cods = randomInt(10, 30) + addAmount;
			if (percentage(40)) clowns = randomInt(2, 7) + addAmount;
			if (percentage(35)) puffers = randomInt(2, 6) + addAmount;
			if (percentage(15)) lotls = 1 + addAmount;
			break;
		}
		default: {
			await interaction.reply(
				"You don't have a fishing rod! Try buying your first rod using /rod"
			);
			return;
		}
	}

	await updateProfile({
		$inc: {
			"fish.cods": cods,
			"fish.salmons": salmons,
			"fish.pufferfish": puffers,
			"fish.clownfish": clowns,
			"fish.axolotls": lotls,
		},
	});

	const resultEmbed = new MessageEmbed()
		.setTitle("You went fishing and caught")
		.addField("Cods", cods.toLocaleString());
}

function percentage(num: number) {
	return randomInt(0, 100) < num;
}

async function getAmount(profile: Profile, updateProfile) {
	if (profile.baits.fishes > 0) {
		await updateProfile({ $inc: { "baits.fishes": -1 } });
		return 4;
	}
	if (profile.baits.bugs > 0) {
		await updateProfile({ $inc: { "baits.bugs": -1 } });
		return 3;
	}
	if (profile.baits.leeches > 0) {
		await updateProfile({ $inc: { "baits.leeches": -1 } });
		return 2;
	}
	if (profile.baits.worms > 0) {
		await updateProfile({ $inc: { "baits.worms": -1 } });
		return 1;
	}
}
