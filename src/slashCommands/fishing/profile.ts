import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import emojis from "../../functions/fishEmojis";

export const data = new SlashCommandBuilder()
	.setName("profile")
	.setDescription("View your fishing profile!")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to view the profile of")
			.setRequired(false)
	);

export async function run({ interaction, profileOf }: CommandData) {
	const user = interaction.options.getUser("user") ?? interaction.user;
	const profile = await profileOf(user.id);
	const avatar = user
		? user.displayAvatarURL({ dynamic: true })
		: interaction.member.displayAvatarURL({ dynamic: true });
	const { fish, rod } = profile;
	const embed = new MessageEmbed()
		.setColor("#D5f5E3")
		.setAuthor("Fishing Profile", avatar)
		.addField(`${emojis.sparkle} EXP`, fish.xp.toLocaleString(), true);
	if (rod)
		embed.addField(
			"<:fishing_rod:918671810395000862> Rod",
			`${rod.charAt(0).toUpperCase() + rod.slice(1)} rod`,
			true
		);
	if (fish.baitType) {
		embed.addField(
			"Bait",
			`Bait Type: ${fish.baitType} | Amount: ${fish.baits}`
		);
	}
	embed
		.addField(`${emojis.salmon} Salmon`, fish.salmons.toLocaleString(), true)
		.addField(`${emojis.cod} Cod`, fish.cods.toLocaleString(), true)
		.addField(
			`${emojis.pufferfish} Pufferfish`,
			fish.pufferfish.toLocaleString(),
			true
		)
		.addField(
			`${emojis.clownfish} Clownfish`,
			fish.clownfish.toLocaleString(),
			true
		)
		.addField(
			`${emojis.axolotl} Axolotls`,
			fish.axolotls.toLocaleString(),
			true
		)
		.addField(
			`${emojis.cookedSalmon} Cooked Salmon`,
			fish.cookedSalmons.toLocaleString(),
			true
		)
		.addField(
			`${emojis.cookedCod} Cooked Cod`,
			fish.cookedCods.toLocaleString(),
			true
		);
	await interaction.reply({ embeds: [embed] });
}
