import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("poll")
	.setDescription(
		"Send a poll to the channel with thumbsup and thumbsdown reactions"
	)
	.addStringOption((option) =>
		option
			.setName("question")
			.setDescription("The question you want to ask")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("emoji_1")
			.setDescription("The first emoji in the poll")
			.setRequired(false)
	)
	.addStringOption((option) =>
		option
			.setName("emoji_2")
			.setDescription("The second emoji in the poll")
			.setRequired(false)
	);

export async function run({ interaction }: CommandData) {
	const question = interaction.options.getString("question");
	let emoji1 = interaction.options.getString("emoji_1") ?? "👍";
	let emoji2 = interaction.options.getString("emoji_2") ?? "👎";
	if (emoji1 < "ÿ") emoji1 = "👍";
	if (emoji2 < "ÿ") emoji2 = "👎";
	const pollEmbed = new MessageEmbed()
		.setTitle("Poll")
		.setDescription(question)
		.setColor("BLUE")
		.setFooter(interaction.guild.name);

	const msg = await interaction.reply({
		embeds: [pollEmbed],
		fetchReply: true,
	});
	await msg.react(emoji1);
	await msg.react(emoji2);
}
