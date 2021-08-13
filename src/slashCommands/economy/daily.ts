import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { randomInt } from "mathjs";
import { SlashCommandBuilder } from "@discordjs/builders";
import ms from "ms";
import prettyMs from "pretty-ms";
const dayLength = ms("1 day");

export const data = new SlashCommandBuilder()
	.setName("daily")
	.setDescription("Claim your daily reward!");

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	const now = Date.now();
	const { lastUsedDaily } = profile;

	if (lastUsedDaily && lastUsedDaily + dayLength > now) {
		const waitTime = dayLength - (now - lastUsedDaily);
		await interaction.reply({
			content: `Please wait ${prettyMs(waitTime)} before using /daily again`,
			ephemeral: true,
		});
		return;
	}

	const dailyEmbed = new MessageEmbed()
		.setColor("#ffa845")
		.setTitle("Daily Reward")
		.setFooter(interaction.guild.name);
	let upperLimit = 50;
	let description = "";
	if (profile.spouse != null) upperLimit = 65;
	else if (profile.inventory.includes("07")) upperLimit = 57;
	const randomAmount = randomInt(25, upperLimit);

	await updateProfile({
		$inc: { mincoDollars: randomAmount },
		lastUsedDaily: now,
	});
	description += `You earned ${randomAmount} Minco Dollars!`;
	if (Math.floor(Math.random() * 4) == 0 && !profile.inventory.includes("05")) {
		await updateProfile({ $push: { inventory: "05" }, candyAmount: 3 });
		description += "\nYou also won a Candy :candy:!";
	}

	dailyEmbed.setDescription(description);
	await interaction.reply({ embeds: [dailyEmbed] });
}