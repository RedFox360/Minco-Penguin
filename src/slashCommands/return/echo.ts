import { CommandData } from "../../types";
import { Util } from "discord.js";

export const data = {
	name: "echo",
	description: "Make the bot echo some text",
	options: [
		{
			name: "text",
			description: "What the bot will say",
			type: "STRING",
			required: true,
		},
	],
};
export async function run({ interaction }: CommandData) {
	const text = interaction.options.getString("text");
	const sendBack = Util.cleanContent(text, interaction.channel);
	await interaction.reply(sendBack);
}
