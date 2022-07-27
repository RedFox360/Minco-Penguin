import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder
} from 'discord.js';
import { minutesToMilliseconds } from 'date-fns';
import ms from 'ms';
import prettyMs from 'pretty-ms';
import { updateServer } from '../models';
import { maxTime, minTime } from '../logging/timeout_times';
import { Subcommand } from '../../types';

export default new Subcommand()
	.setCommandData(builder =>
		builder
			.setName('profanity')
			.setDescription(
				'Set a punishment when a user sends something profane'
			)
			.addStringOption(option =>
				option
					.setName('punishment_type')
					.setDescription(
						'The type of the punishment you want to use (temp ban not supported)'
					)
					.addChoices(
						{ name: 'Warn', value: 'warn:warned' },
						{ name: 'Timeout', value: 'timeout' },
						{ name: 'Kick', value: 'kick:kicked' },
						{ name: 'Ban', value: 'ban:banned' },
						{ name: 'Remove Punishment', value: 'rp' }
					)
					.setRequired(true)
			)
			.addStringOption(option =>
				option
					.setName('timeout_time')
					.setDescription(
						'The amount of time to timeout the user (if you chose timeout punishment)'
					)
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const [punishmentType, verb] = interaction.options
			.getString('punishment_type')
			.split(':');
		if (punishmentType === 'rp') {
			await updateServer(
				{
					profanityPunishment: undefined
				},
				interaction.guildId
			);
			await interaction.reply('Profanity punishments removed');
		} else if (punishmentType === 'timeout') {
			const timeoutTime =
				interaction.options.getString('timeout_time');
			if (!timeoutTime) {
				await interaction.reply({
					content:
						'You need to provide a time if you chose the timeout punishment',
					ephemeral: true
				});
				return;
			}
			const msTime = ms(timeoutTime);
			const time =
				msTime ?? minutesToMilliseconds(parseInt(timeoutTime));
			if (isNaN(time)) {
				await interaction.reply({
					content: 'That time is invalid',
					ephemeral: true
				});
				return;
			}
			if (time < minTime || time > maxTime) {
				await interaction.reply({
					content: 'Your time must be between 10 seconds and 28 days',
					ephemeral: true
				});
				return;
			}
			await updateServer(
				{
					profanityPunishment: { punishment: 'warn', time }
				},
				interaction.guildId
			);

			await interaction.reply(
				`Warn punishments updated: users will be timeouted for ${prettyMs(
					time,
					{ verbose: true }
				)} when they send a profane message`
			);
			return;
		} else {
			await updateServer(
				{
					profanityPunishment: { punishment: punishmentType }
				},
				interaction.guildId
			);
			await interaction.reply(
				`Profanity punishments updated: users will be ${verb} when they send a profane message (note: the punishments don't apply to mods)`
			);
		}
	});
