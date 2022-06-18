import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { updateServer } from '../models';
export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('welcome_channel')
	.setDescription('Set the welcome channel of your server')
	.addChannelOption(option =>
		option
			.setName('channel')
			.setDescription('The channel')
			.setRequired(false)
	);

export async function run(interaction: CommandInteraction<'cached'>) {
	if (!(interaction.member.permissions as any).has('MANAGE_GUILD')) {
		await interaction.reply({
			content:
				'You need the `Manage Server` permission to execute this command',
			ephemeral: true
		});
		return;
	}
	const channel = interaction.options.getChannel('channel');
	if (!channel) {
		await updateServer(
			{ welcomeChannel: undefined },
			interaction.guildId
		);
		await interaction.reply({
			content: `Welcome channel removed`,
			ephemeral: true
		});
		return;
	}
	if (!channel.isText()) {
		await interaction.reply({
			content: 'That channel is invalid',
			ephemeral: true
		});
		return;
	}
	await updateServer(
		{ welcomeChannel: channel.id },
		interaction.guildId
	);

	await interaction.reply({
		content: `Welcome channel set to ${channel}`,
		ephemeral: true
	});
}
