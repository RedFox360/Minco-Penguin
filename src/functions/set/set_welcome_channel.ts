import { CommandData } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
export function subcommand() {
	return new SlashCommandSubcommandBuilder()
		.setName("welcome_channel")
		.setDescription("Set the welcome channel of your server")
		.addChannelOption((option) =>
			option.setName("channel").setDescription("The channel").setRequired(true)
		);
}
export async function run({ interaction, updateServer }: CommandData) {
	if (!interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
	if (!interaction.member.permissions.has("MANAGE_GUILD")) {
		await interaction.reply({
			content:
				"You need the `Manage Server` permission to execute this command",
			ephemeral: true,
		});
		return;
	}
	const channel = interaction.options.getChannel("channel");
	if (!channel.isText()) {
		await interaction.reply({
			content: "That channel is invalid",
			ephemeral: true,
		});
		return;
	}
	await updateServer({ welcomeChannel: channel.id });

	await interaction.reply(`Welcome channel set to <#${channel.id}>`);
}
