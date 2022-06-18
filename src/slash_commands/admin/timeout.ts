import { MessageEmbed, Permissions } from 'discord.js';
import ms from 'ms';
import prettyMs from 'pretty-ms';
import { SlashCommand } from '../../types';
import { maxTime, minTime } from '../../functions/timeout_times';
import {
	logEndTimeout,
	logTimeout
} from '../../functions/log_functions';

const timeout = new SlashCommand()
	.setRun(async interaction => {
		const member = interaction.options.getMember('user');
		if (member.id === interaction.user.id) {
			await interaction.reply({
				content: "You can't timeout yourself!",
				ephemeral: true
			});
			return;
		}
		if (member.user.bot) {
			await interaction.reply({
				content:
					"You can't timeout a bot using Minco Penguin, please use the built in feature instead",
				ephemeral: true
			});
			return;
		}
		if (!member.moderatable) {
			await interaction.reply({
				content:
					'The bot does not have the permissions to timeout that user!',
				ephemeral: true
			});
			return;
		}
		if (
			interaction.member.roles.highest.comparePositionTo(
				member.roles.highest
			) < 0
		) {
			// interaction member has lower perms than member they are trying to timeout
			await interaction.reply({
				content: "You can't timeout that user",
				ephemeral: true
			});
			return;
		}
		switch (interaction.options.getSubcommand()) {
			case 'start': {
				const rawTime = interaction.options.getString('time');
				const msTime = ms(rawTime);
				const time = msTime ?? parseInt(rawTime) * 60_000;
				if (isNaN(time)) {
					await interaction.reply({
						content: 'That time is invalid',
						ephemeral: true
					});
					return;
				}
				if (time < minTime || time > maxTime) {
					await interaction.reply({
						content:
							'Your time must be between 10 seconds and 28 days',
						ephemeral: true
					});
					return;
				}
				const reason =
					interaction.options.getString('reason') ?? undefined;
				const formattedReason = reason
					? `*${reason}*`
					: 'No reason provided';
				const formattedTime = prettyMs(time, {
					verbose: true
				});
				const silent =
					interaction.options.getBoolean('silent') ?? false;
				await member.timeout(time, reason);

				const { currentCaseNo } = await logTimeout(
					member.id,
					interaction.guildId,
					time,
					reason,
					interaction.user.id
				);
				const iconURL = interaction.guild.iconURL({
					dynamic: true
				});

				const timeoutEmbed = new MessageEmbed()
					.setAuthor({
						name: member.displayName,
						iconURL: member.displayAvatarURL({
							dynamic: true
						})
					})
					.setColor('#F5B041') // orange
					.setTitle('Timeout')
					.setDescription(
						`${member} has been timed out for ${formattedTime}
Case #${currentCaseNo}
Reason: ${formattedReason}`
					)
					.setFooter({
						text: interaction.guild.name,
						iconURL
					});
				member
					.send(
						`#${currentCaseNo} | You were timeouted in **${
							interaction.guild.name
						}** for ${formattedTime} ${
							silent ? `by ${interaction.user}` : ''
						}
Reason: ${formattedReason}`
					)
					.catch(() => null);
				await interaction.reply({
					embeds: [timeoutEmbed],
					ephemeral: silent
				});
				return;
			}
			case 'end': {
				if (!member.isCommunicationDisabled()) {
					await interaction.reply({
						content:
							"That user isn't in timeout! You can't remove their timeout if they don't have one",
						ephemeral: true
					});
					return;
				}
				await member.timeout(null);
				const silent =
					interaction.options.getBoolean('silent') ?? false;
				const reason =
					interaction.options.getString('reason') ?? undefined;
				const formattedReason = reason
					? `*${reason}*`
					: 'No reason provided';
				const { currentCaseNo } = await logEndTimeout(
					member.id,
					interaction.guildId,
					reason,
					interaction.user.id
				);
				await interaction.reply({
					content: `(#${currentCaseNo}) ${member}'s timeout has been ended.
Reason: ${formattedReason}`,
					ephemeral: silent
				});
			}
		}
	})
	.setCommandData(builder =>
		builder
			.setName('timeout')
			.setDescription('Timeout a user')
			.addSubcommand(subcommand =>
				subcommand
					.setName('start')
					.setDescription(
						'Timeout a user for a specific amount of time'
					)
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to timeout')
							.setRequired(true)
					)
					.addStringOption(option =>
						option
							.setName('time')
							.setDescription(
								'The time to timeout this user (e.g. 1m, 1 hour)'
							)
							.setRequired(true)
					)
					.addStringOption(option =>
						option
							.setName('reason')
							.setDescription('Why you timeouted this user')
							.setRequired(false)
					)
					.addBooleanOption(option =>
						option
							.setName('silent')
							.setDescription(
								'Make the interaction response a private message'
							)
							.setRequired(false)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('end')
					.setDescription("End a user's timeout")
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to timeout')
							.setRequired(true)
					)
					.addStringOption(option =>
						option
							.setName('reason')
							.setDescription("Why you ended this user's timeout")
							.setRequired(false)
					)
					.addBooleanOption(option =>
						option
							.setName('silent')
							.setDescription(
								'Make the interaction response a private message'
							)
							.setRequired(false)
					)
			)
	)
	.setPermissions(Permissions.FLAGS.MODERATE_MEMBERS);

export default timeout;
