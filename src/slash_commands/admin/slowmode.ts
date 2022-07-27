import { EmbedBuilder } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';
import { TextChannel } from 'discord.js';
import ms from 'ms';
import prettyMs from 'pretty-ms';
import { SlashCommand } from '../../types';

const slowmode = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('slowmode')
			.setDescription('Set the slowmode of a channel')
			.setDefaultMemberPermissions(
				PermissionFlagsBits.ManageChannels |
					PermissionFlagsBits.ManageMessages
			)
			.addStringOption(option =>
				option
					.setName('time')
					.setDescription('The slowmode time (e.g. 1, 1s, 3h, 1m)')
					.setRequired(true)
			)
	)
	.setBotPermissions(PermissionFlagsBits.ManageChannels)
	.setRun(async interaction => {
		const timeString = interaction.options.getString('time');
		const unary = +timeString;
		const time = isNaN(unary) ? ms(timeString) / 1000 : unary;

		if (isNaN(time)) {
			await interaction.reply({
				content: 'You wrote an invalid time',
				ephemeral: true
			});
			return;
		}
		if (time > 21600) {
			await interaction.reply({
				content: 'Please enter an amount less than 21600 (6 hours)',
				ephemeral: true
			});
			return;
		}
		if (interaction.guild) {
			(interaction.channel as TextChannel).setRateLimitPerUser(time);
			const confirmEmbed = new EmbedBuilder()
				.setColor(0x7e78d2)
				.setTitle('Slowmode')
				.setDescription(
					`Slowmode set to ${time} seconds (${prettyMs(time * 1000)})`
				);
			await interaction.reply({ embeds: [confirmEmbed] });
		} else {
			await interaction.reply({
				content: 'This command can only be used in a server',
				ephemeral: true
			});
			return;
		}
	});

export default slowmode;
