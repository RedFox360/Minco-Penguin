import { SlashCommandBuilder } from "@discordjs/builders";
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

	let salmons, cods, puffers, clowns, lotls;
	const addAmount = await getAmount(profile, updateProfile);
	switch (profile.rod) {
		case "normal": {
			if (percentage(40)) salmons = randomInt(2, 5) + addAmount;
			if (percentage(50)) cods = randomInt(4, 8) + addAmount;
			if (percentage(20)) puffers = 1 + addAmount;
			if (percentage(5)) lotls = 1 + addAmount;
		}
	}
}

function percentage(num: number) {
	return randomInt(0, 100) < num;
}

async function getAmount(profile: Profile, updateProfile) {
	if (profile.baits.fishes > 0) {
		await updateProfile({ $inc: { "baits.worms": -1 } });
		return 10;
	}
	if (profile.baits.bugs > 0) {
		await updateProfile({ $inc: { "baits.bugs": -1 } });
		return 8;
	}
	if (profile.baits.leeches > 0) {
		await updateProfile({ $inc: { "baits.leeches": -1 } });
		return 6;
	}
	if (profile.baits.worms > 0) {
		await updateProfile({ $inc: { "baits.worms": -1 } });
		return 4;
	}
}
