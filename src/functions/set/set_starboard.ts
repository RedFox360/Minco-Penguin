import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { updateServer } from '../models';

export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('starboard')
	.setDescription('Set a starboard for your server')
	.addChannelOption(option =>
		option
			.setName('channel')
			.setDescription('The starboard channel')
			.setRequired(false)
	)
	.addIntegerOption(option =>
		option
			.setName('amount')
			.setDescription(
				'(Default = 1) The amount of star reactions to get a message posted'
			)
			.setMinValue(1)
			.setMaxValue(20)
			.setRequired(false)
	);

export async function run(interaction: CommandInteraction<'cached'>) {
	if (
		!(interaction.member.permissions as any).has('MANAGE_GUILD')
	) {
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
			{ starboard: { channelID: undefined } },
			interaction.guildId
		);
		await interaction.reply({
			content: `Starboard channel removed`,
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
	const { id } = channel;
	let starAmount = interaction.options.getInteger('amount');
	if (starAmount < 1 || starAmount > 20) starAmount = 1;
	await updateServer(
		{ starboard: { channelID: id, starAmount } },
		interaction.guildId
	);
	await interaction.reply({
		content: `Starboard channel set to ${channel} with amount ${starAmount}`,
		ephemeral: true
	});
}
