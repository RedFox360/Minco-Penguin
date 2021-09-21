import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { randomInt } from "mathjs";
import { SlashCommandBuilder } from "@discordjs/builders";
import ms from "ms";
import prettyMs from "pretty-ms";
const dayLength = ms("1 week");

export const data = new SlashCommandBuilder()
	.setName("weekly")
	.setDescription("Claim your weekly reward!");

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	const now = Date.now();
	const { lastUsedWeekly } = profile;

	if (lastUsedWeekly && lastUsedWeekly + dayLength > now) {
		const waitTime = dayLength - (now - lastUsedWeekly);
		await interaction.reply({
			content: `Please wait ${prettyMs(waitTime)} before using /weekly again`,
			ephemeral: true,
		});
		return;
	}

	const weeklyEmbed = new MessageEmbed()
		.setColor("#ffa845")
		.setTitle("Weekly Reward")
		.setFooter(interaction.guild?.name ?? interaction.user.username);
	let upperLimit = 400;
	if (profile.spouse != null) upperLimit = 500;
	else if (profile.inventory.includes("07")) upperLimit = 450;
	const randomAmount = randomInt(150, upperLimit);

	await updateProfile({
		$inc: { mincoDollars: randomAmount },
		lastUsedWeekly: now,
	});
	await updateProfile({ $push: { inventory: "05" }, candyAmount: 3 });

	weeklyEmbed.setDescription(
		`You earned ${randomAmount} Minco Dollars and a candy :candy:!`
	);
	await interaction.reply({ embeds: [weeklyEmbed] });
}
