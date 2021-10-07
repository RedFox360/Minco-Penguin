import { CommandData } from "../types";

export default async function run({ interaction, updateServer }: CommandData) {
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

	await updateServer({ welcomeChannel: channel.id });

	await interaction.reply(`Welcome channel set to <#${channel.id}>`);
}
