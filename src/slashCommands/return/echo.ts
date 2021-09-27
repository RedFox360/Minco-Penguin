import { CommandData } from "../../types";
import { Util } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("echo")
	.setDescription("Make the bot echo some text")
	.addStringOption((option) =>
		option
			.setName("text")
			.setDescription("What the bot will echo")
			.setRequired(true)
	);

export async function run({ interaction }: CommandData) {
	const text = interaction.options.getString("text");
	const sendBack = Util.cleanContent(text, interaction.channel);
	await interaction.reply(sendBack);
}
