import {
	CommandInteraction,
	GuildMember,
	MessageEmbed
} from 'discord.js';
import prettyMs from 'pretty-ms';
import {
	logBan,
	logKick,
	logTimeout,
	logWarn
} from '../../functions/log_functions';
import { getServer } from '../../functions/models';
import {
	AutoWarn,
	AutoWarnPunishment,
	Log,
	SlashCommand
} from '../../types';

const warn = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('warn')
			.setDescription('Warn a user')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user to warn')
					.setRequired(true)
			)
			.addStringOption(option =>
				option
					.setName('reason')
					.setDescription('Why you warned this user')
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
	.setRun(async interaction => {
		const member = interaction.options.getMember('user');
		if (member.user.bot) {
			await interaction.reply({
				content: "You can't warn a bot",
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
				content: "You can't warn that user",
				ephemeral: true
			});
			return;
		}
		const reason = interaction.options.getString('reason');
		const formattedReason = reason
			? `*${reason}*`
			: 'No reason provided';
		const silent =
			interaction.options.getBoolean('silent') ?? false;

		const { currentCaseNo: warnCaseNo, logs } = await logWarn(
			member.id,
			interaction.guildId,
			reason,
			interaction.user.id
		);
		const iconURL = interaction.guild.iconURL({ dynamic: true });
		const warnEmbed = new MessageEmbed()
			.setAuthor({
				name: member.displayName,
				iconURL: member.displayAvatarURL({ dynamic: true })
			})
			.setColor('#5DADE2') // blue
			.setTitle('Warning')
			.setDescription(
				`${member} has been warned
Case #${warnCaseNo}
Reason: ${formattedReason}`
			)
			.setFooter({ text: interaction.guild.name, iconURL });
		member
			.send(
				`#${warnCaseNo} | You were warned in **${
					interaction.guild.name
				}** ${silent ? `by ${interaction.user}` : ''}
Reason: ${formattedReason}`
			)
			.catch(() => null);
		await interaction.reply({
			embeds: [warnEmbed],
			ephemeral: silent
		});
		const { autowarns } = await getServer(interaction.guildId);
		await autowarn(logs, autowarns, member, interaction, silent);
	});

export async function autowarn(
	logs: Log[],
	autowarns: AutoWarn[],
	member: GuildMember,
	interaction?: CommandInteraction<'cached'>,
	silent?: boolean
): Promise<AutoWarnPunishment | undefined> {
	const warnAmount = logs.filter(log => log.type === 'Warn').length;
	const autowarn = autowarns.find(a => {
		if (a.divisible) {
			return a.warnAmount % warnAmount === 0;
		} else {
			return a.warnAmount === warnAmount;
		}
	});
	if (!autowarn) return;
	const iconURL = interaction && interaction.guild.iconURL();
	switch (autowarn.punishment) {
		case 'timeout': {
			if (!autowarn.time) return;
			if (!member.moderatable) {
				await interaction.followUp({
					content:
						'The bot does not have the permissions to timeout that user (for autowarn)',
					ephemeral: true
				});
				return;
			}
			const timeoutReason = `Automatic timeout at ${warnAmount} warns`;
			await member.timeout(autowarn.time, timeoutReason);
			const { currentCaseNo: timeoutCaseNo } = await logTimeout(
				member.id,
				interaction.guildId,
				autowarn.time,
				timeoutReason,
				interaction.user.id
			);
			if (interaction) {
				const timeoutEmbed = new MessageEmbed()
					.setAuthor({
						name: member.displayName,
						iconURL: member.displayAvatarURL({
							dynamic: true
						})
					})
					.setColor('#F5B041') // orange
					.setTitle('Autowarn: Timeout')
					.setDescription(
						`${member} has been timed out for ${prettyMs(
							autowarn.time,
							{
								verbose: true
							}
						)} because they reached ${warnAmount} warns
Case #${timeoutCaseNo}`
					)
					.setFooter({
						text: interaction.guild.name,
						iconURL
					});
				member
					.send(
						`#${timeoutCaseNo}
You were timeouted in **${interaction.guild.name}** ${
							silent ? `by ${interaction.user}` : ''
						} because you reached ${warnAmount} warns`
					)
					.catch(() => null);
				await interaction.followUp({
					embeds: [timeoutEmbed],
					ephemeral: silent
				});
			} else {
				member
					.send(
						`#${timeoutCaseNo}
You were timeouted in **${member.guild.name}** because you reached ${warnAmount} warns`
					)
					.catch(() => null);
			}
			break;
		}
		case 'ban': {
			if (!member.bannable) {
				await interaction.followUp({
					content:
						'The bot does not have the permissions to ban that user (for autowarn)',
					ephemeral: true
				});
				return;
			}
			const banReason = `Automatic ban at ${warnAmount} warns`;
			await member.ban({
				reason: banReason
			});
			const { currentCaseNo: banCaseNo } = await logBan(
				member.id,
				interaction.guildId,
				banReason,
				interaction.user.id
			);
			if (interaction) {
				const banEmbed = new MessageEmbed()
					.setColor('#CB4335')
					.setAuthor({
						name: member.user.tag,
						iconURL: member.user.displayAvatarURL({
							dynamic: true
						})
					})
					.setTitle('Banned')
					.setDescription(
						`${member} has been banned from the server
Case #${banCaseNo}
Reason: ${banReason}`
					)
					.setFooter({
						text: interaction.guild.name,
						iconURL: interaction.guild.iconURL({
							dynamic: true
						})
					});
				member
					.send(
						`#${banCaseNo}
You were banned from **${interaction.guild.name}** ${
							silent ? `by ${interaction.user}` : ''
						} because you reached ${warnAmount} warns`
					)
					.catch(() => null);
				await interaction.followUp({
					embeds: [banEmbed],
					ephemeral: silent
				});
			} else {
				member
					.send(
						`#${banCaseNo}
You were banned from **${interaction.guild.name}** because you reached ${warnAmount} warns`
					)
					.catch(() => null);
			}
			break;
		}
		case 'kick': {
			if (!member.kickable) {
				await interaction.followUp({
					content:
						'The bot does not have the permissions to kick that user (for autowarn)',
					ephemeral: true
				});
				return;
			}
			const kickReason = `Automatic kick at ${warnAmount} warns`;
			await member.kick(kickReason);
			const { currentCaseNo: kickCaseNo } = await logKick(
				member.id,
				interaction.guildId,
				kickReason,
				interaction.user.id
			);
			if (interaction) {
				const kickEmbed = new MessageEmbed()
					.setColor('#CB4335')
					.setAuthor({
						name: member.user.tag,
						iconURL: member.user.displayAvatarURL({
							dynamic: true
						})
					})
					.setTitle('Kicked')
					.setDescription(
						`${member} has been kicked from the server
Case #${kickCaseNo}
Reason: ${kickReason}`
					)
					.setFooter({
						text: interaction.guild.name,
						iconURL: interaction.guild.iconURL({
							dynamic: true
						})
					});
				member
					.send(
						`#${kickCaseNo}
You were kicked from **${interaction.guild.name}** ${
							silent ? `by ${interaction.user}` : ''
						} because you reached ${warnAmount} warns`
					)
					.catch(() => null);
				await interaction.followUp({
					embeds: [kickEmbed],
					ephemeral:
						interaction.options.getBoolean('silent') ??
						false
				});
			} else {
				member
					.send(
						`#${kickCaseNo}
You were kicked from **${interaction.guild.name}** because you reached ${warnAmount} warns`
					)
					.catch(() => null);
			}
			break;
		}
	}
	return autowarn.punishment;
}

export default warn;
