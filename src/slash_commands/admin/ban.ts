import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandSubcommandBuilder
} from 'discord.js';
import { GuildMember } from 'discord.js';
import { SlashCommand } from '../../types';
import isNumeric from '../../functions/basics/is_numeric';
import { logBan } from '../../functions/logging/log_functions';
import { PermissionFlagsBits } from 'discord.js';

const nextBanOptions = (s: SlashCommandSubcommandBuilder) =>
	s
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('Why did you ban this user?')
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
		.addIntegerOption(option =>
			option
				.setName('days')
				.setDescription(
					'The amount of days of messages to delete from this user (default: 0)'
				)
				.setMinValue(0)
				.setMaxValue(7)
				.setRequired(false)
		);
const ban = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('ban')
			.setDescription('Ban a user from the server')
			.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
			.addSubcommand(option =>
				nextBanOptions(
					option
						.setName('member')
						.setDescription('Ban a member of this server')
						.addUserOption(options =>
							options
								.setName('user')
								.setDescription('The user to ban')
								.setRequired(true)
						)
				)
			)
			.addSubcommand(option =>
				nextBanOptions(
					option
						.setName('user_id')
						.setDescription(
							'Ban a member from the server using their id'
						)
						.addStringOption(option =>
							option
								.setName('id')
								.setDescription(
									'The id of the user whose logs to view'
								)
								.setRequired(true)
						)
				)
			)
	)
	.setBotPermissions(PermissionFlagsBits.BanMembers)
	.setRun(async interaction => {
		if (interaction.options.getSubcommand() === 'member') {
			const member = interaction.options.getMember('user');
			await banMember(member, interaction);
		} else {
			const uid = interaction.options.getString('id');
			if (!isNumeric(uid)) {
				await interaction.reply({
					content: `That id is not a number`,
					ephemeral: true
				});
				return;
			}
			try {
				const member = await interaction.guild.members.fetch(uid);
				await banMember(member, interaction);
			} catch (err) {
				try {
					const reason =
						interaction.options.getString('reason') ?? undefined;
					let days = interaction.options.getInteger('days') ?? 0;
					if (days < 0 || days > 7) {
						days = 0;
					}
					const formattedReason = reason
						? `*${reason}*`
						: 'No reason provided';
					const banned = (await interaction.guild.bans.create(uid, {
						deleteMessageDays: days,
						reason
					})) as any;
					const { currentCaseNo } = await logBan(
						banned?.id ?? banned,
						interaction.guildId,
						reason,
						interaction.user.id
					);
					const iconURL = banned.displayAvatarURL();

					const banEmbed = new EmbedBuilder()
						.setColor(0xcb4335)
						.setAuthor({
							name: banned.user?.tag ?? banned.tag ?? banned,
							iconURL
						})
						.setDescription(
							`${banned} has been banned from the server
Case #${currentCaseNo}
Reason: ${formattedReason}`
						)
						.setFooter({
							text: interaction.guild.name,
							iconURL: interaction.guild.iconURL()
						});
					await interaction.reply({
						embeds: [banEmbed],
						ephemeral:
							interaction.options.getBoolean('silent') ?? false
					});
				} catch {
					await interaction.reply({
						content:
							'The bot does not have permissions to ban that user or that user does not exist',
						ephemeral: true
					});
					return;
				}
			}
		}
	});

async function banMember(
	member: GuildMember,
	interaction: ChatInputCommandInteraction<'cached'>
) {
	if (member.id === interaction.user.id) {
		await interaction.reply({
			content: "You can't ban yourself!",
			ephemeral: true
		});
		return;
	}
	if (member.user.bot) {
		await interaction.reply({
			content:
				"You can't ban a bot using Minco Penguin, please use the built in feature instead",
			ephemeral: true
		});
		return;
	}
	if (!member.bannable) {
		await interaction.reply({
			content:
				'The bot does not have the permissions to ban that user!',
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
			content: "You can't ban that user",
			ephemeral: true
		});
		return;
	}
	const reason = interaction.options.getString('reason');
	const silent = interaction.options.getBoolean('silent') ?? false;
	const formattedReason = reason
		? `*${reason}*`
		: 'No reason provided';
	let days = interaction.options.getInteger('days') ?? 0;
	if (days < 0 || days > 7) {
		days = 0;
	}
	await member.ban({
		deleteMessageDays: days,
		reason
	});
	const { currentCaseNo } = await logBan(
		member.id,
		interaction.guildId,
		reason,
		interaction.user.id
	);
	const banEmbed = new EmbedBuilder()
		.setColor(0xcb4335)
		.setAuthor({
			name: member.user.tag,
			iconURL: member.user.displayAvatarURL()
		})
		.setTitle('Banned')
		.setDescription(
			`${member} has been banned from the server
Case #${currentCaseNo}
Reason: ${formattedReason}`
		)
		.setFooter({
			text: interaction.guild.name,
			iconURL: interaction.guild.iconURL()
		});
	member
		.send(
			`#${currentCaseNo} | You were banned in **${
				interaction.guild.name
			}** ${silent ? `by ${interaction.user}` : ''}
Reason: ${formattedReason}`
		)
		.catch(() => null);
	await interaction.reply({
		embeds: [banEmbed],
		ephemeral: silent
	});
}
export default ban;
