import { minutesToMilliseconds } from 'date-fns';
import ms from 'ms';
import prettyMs from 'pretty-ms';
import { getServer, updateServer } from '../models';
import { maxTime, minTime } from '../logging/timeout_times';
import { Subcommand } from '../../types';

export const maxAutoWarns = 75;

export default new Subcommand()
	.setCommandData(builder =>
		builder
			.setName('set')
			.setDescription(
				'Set a punishment when a user reaches a specific amount of warns'
			)
			.addIntegerOption(option =>
				option
					.setName('amount')
					.setDescription(
						'The amount of warns required to get a punishment'
					)
					.setMinValue(1)
					.setMaxValue(500)
					.setRequired(true)
			)
			.addStringOption(option =>
				option
					.setName('punishment_type')
					.setDescription(
						'The type of the punishment you want to use (temp ban not supported)'
					)
					.addChoices(
						{ name: 'Timeout', value: 'timeout' },
						{ name: 'Kick', value: 'kick:kicked' },
						{ name: 'Ban', value: 'ban:banned' }
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
		const amount = interaction.options.getInteger('amount');
		if (amount < 1 || amount > 500) {
			await interaction.reply({
				content: 'Please enter an amount between 1 and 500',
				ephemeral: true
			});
			return;
		}
		const [punishmentType, verb] = interaction.options
			.getString('punishment_type')
			.split(':');
		const timeoutTime = interaction.options.getString('timeout_time');
		const server = await getServer(interaction.guildId);
		if (server.autowarns.length > maxAutoWarns) {
			await interaction.reply({
				content:
					'This server has the maximum amount of autowarns (75)',
				ephemeral: true
			});
		}
		if (server.autowarns.find(a => a.warnAmount === amount)) {
			await interaction.reply({
				content: `This server already has an auto punishment at ${amount} warns`,
				ephemeral: true
			});
			return;
		}
		if (punishmentType === 'timeout') {
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
					$push: {
						autowarns: {
							$each: [
								{ warnAmount: amount, punishment: 'timeout', time }
							],
							$sort: { warnAmount: 1 }
						}
					}
				},
				interaction.guildId
			);
			await interaction.reply(
				`Warn punishments updated: users will be timeouted for ${prettyMs(
					time,
					{ verbose: true }
				)} when they reach ${amount} warns`
			);
		} else {
			await updateServer(
				{
					$push: {
						autowarns: {
							$each: [
								{ warnAmount: amount, punishment: punishmentType }
							],
							$sort: { warnAmount: 1 }
						}
					}
				},
				interaction.guildId
			);
			await interaction.reply(
				`Warn punishments updated: users will be ${verb} when they reach ${amount} warns`
			);
		}
	});
