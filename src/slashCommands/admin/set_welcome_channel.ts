import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("set_welcome_channel")
	.setDescription("Set the welcome channel of your server")
	.addChannelOption((option) =>
		option.setName("channel").setDescription("The channel").setRequired(true)
	);
export const permissions = ["MANAGE_GUILD"];

export async function run({ interaction, updateServer }: CommandData) {
	const channel = interaction.options.getChannel("channel");

	await updateServer({ welcomeChannel: channel.id });

	await interaction.reply(`Welcome channel set to <#${channel.id}>`);
}
