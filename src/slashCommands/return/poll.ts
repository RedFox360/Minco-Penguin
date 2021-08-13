import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";

export const data = {
	name: "poll",
	description:
		"Send a poll to the channel with thumbsup and thumbsdown reactions",

	options: [
		{
			name: "question",
			description: "The question you want to ask",
			type: "STRING",
			required: true,
		},
		{
			name: "emoji_1",
			description: "The first emoji in the poll",
			type: "STRING",
			required: false,
		},
		{
			name: "emoji_2",
			description: "The second emoji in the poll",
			type: "STRING",
			required: false,
		},
	],
};

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
