import {
	ButtonInteraction,
	GuildMember,
	ActionRowBuilder,
	ButtonBuilder,
	User,
	ChatInputCommandInteraction,
	UserContextMenuCommandInteraction,
	ButtonStyle,
	ComponentType
} from 'discord.js';
import { getProfileInServer, updateProfileInServer } from '../models';
import prettyMs from 'pretty-ms';
import chunkArray from '../basics/chunk_array';
import { EmbedBuilder, time } from 'discord.js';
import { hoursToMilliseconds } from 'date-fns';
import type { LogType } from 'mincomodels/profileInServerSchema/types';
import { PermissionFlagsBits } from 'discord.js';

const chunkSize = 8;
const collectorTime = hoursToMilliseconds(24);
export default async function run(
	interaction:
		| ChatInputCommandInteraction<'cached'>
		| ButtonInteraction<'cached'>
		| UserContextMenuCommandInteraction<'cached'>,
	ephemeral = false,
	member?: GuildMember,
	user?: User,
	currentPage = 0
) {
	const displayName = member ? member.displayName : user.tag;
	await interaction.deferReply({ ephemeral });
	const { logs } = await getProfileInServer(
		member?.id ?? user?.id,
		interaction.guildId
	);
	if (!logs || logs.length === 0) {
		await interaction.editReply({
			content: `**${member ?? user}**'s logs are clean!`,
			allowedMentions: { users: [interaction.user.id] }
		});
		return;
	}
	const avatar = member
		? member.displayAvatarURL()
		: user.displayAvatarURL();
	const logFormat = logs.reverse().map(log => {
		let value = `Case: #${log.case}
**Reason**: ${log.reason ?? 'None provided'}
**Date**: ${time(log.date, 'd')} ${time(log.date, 't')}`;
		if (log.moderator)
			value += `\n**Moderator**: <@!${log.moderator}>`;
		if (log.time) value += `\n**Time**: ${prettyMs(log.time)}`;
		return {
			name: `${getEmoji(log.type)} ${log.type}`,
			value
		};
	});
	const iconURL = interaction.guild.iconURL();
	const slices = chunkArray(logFormat, chunkSize);
	const first = new ButtonBuilder()
		.setCustomId('first')
		.setStyle(ButtonStyle.Primary)
		.setEmoji('⏪')
		.setDisabled();
	const last = new ButtonBuilder()
		.setCustomId('last')
		.setEmoji('⏩')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(slices.length === 1);
	const previous = new ButtonBuilder()
		.setCustomId('prev')
		.setStyle(ButtonStyle.Primary)
		.setEmoji('⬅️')
		.setDisabled();
	const next = new ButtonBuilder()
		.setCustomId('next')
		.setEmoji('➡️')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(slices.length === 1);
	const clearLogs =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('clear_logs')
				.setLabel('Clear Logs')
				.setStyle(ButtonStyle.Danger)
		);

	const length = slices.length;
	const logEmbed = new EmbedBuilder()
		.setAuthor({
			name: displayName,
			iconURL: avatar
		})
		.setColor(0xf8c471)
		.setTitle(`Mod Logs for ${user.tag}`)
		.addFields(...slices[currentPage])
		.setFooter({
			text: `Page 1/${length}`,
			iconURL
		});
	const getComponents = () => {
		const components = [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				first,
				previous,
				next,
				last
			)
		];
		if (
			interaction.member.permissions.has(
				PermissionFlagsBits.ModerateMembers
			)
		)
			components.push(clearLogs);
		return components;
	};
	await interaction.editReply({
		embeds: [logEmbed],
		components: getComponents()
	});
	const msg = await interaction.fetchReply();
	const collector = msg.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: collectorTime
	});
	const update = (i: ButtonInteraction<'cached'>) =>
		i.update({
			embeds: [logEmbed],
			components: getComponents()
		});
	collector.on(
		'collect',
		async (buttonInteraction: ButtonInteraction<'cached'>) => {
			if (buttonInteraction.customId === 'clear_logs') {
				if (
					!buttonInteraction.member.permissions.has(
						PermissionFlagsBits.ModerateMembers
					)
				) {
					await buttonInteraction.reply({
						content:
							"You don't have the correct permissions to clear logs!",
						ephemeral: true
					});
					return;
				}
				await updateProfileInServer(
					{ logs: [] },
					user.id,
					interaction.guildId
				);
				await interaction.editReply({
					embeds: [logEmbed],
					components: [
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							first,
							previous,
							next,
							last
						)
					]
				});
				await buttonInteraction.reply(
					`Cleared ${user}'s logs succesfully`
				);
				return;
			}
			if (buttonInteraction.user.id !== interaction.user.id) {
				await run(buttonInteraction, true, member, user, currentPage);
				return;
			}
			switch (buttonInteraction.customId) {
				case 'first': {
					currentPage = 0;
					first.setDisabled();
					previous.setDisabled();
					next.setDisabled(false);
					last.setDisabled(false);
					logEmbed.setFields(...slices[currentPage]).setFooter({
						text: `Page ${currentPage + 1}/${length}`
					});
					await update(buttonInteraction);
					break;
				}
				case 'prev': {
					currentPage--;
					next.setDisabled(false);
					last.setDisabled(false);
					if (currentPage === 0) {
						previous.setDisabled();
						first.setDisabled();
					}
					logEmbed.setFields(...slices[currentPage]).setFooter({
						text: `Page ${currentPage + 1}/${length}`
					});
					await update(buttonInteraction);
					break;
				}
				case 'next': {
					currentPage++;
					previous.setDisabled(false);
					first.setDisabled(false);
					if (currentPage + 1 === length) {
						next.setDisabled();
						last.setDisabled();
					}
					logEmbed.setFields(...slices[currentPage]).setFooter({
						text: `Page ${currentPage + 1}/${length}`
					});
					await update(buttonInteraction);
					break;
				}
				case 'last': {
					currentPage = length - 1;
					previous.setDisabled(false);
					first.setDisabled(false);
					next.setDisabled();
					last.setDisabled();
					logEmbed.setFields(...slices[currentPage]).setFooter({
						text: `Page ${currentPage + 1}/${length}`
					});
					await update(buttonInteraction);
					break;
				}
			}
		}
	);
}
function getEmoji(logType: LogType) {
	switch (logType) {
		case 'Warn': {
			return '⚠️';
		}
		case 'Timeout': {
			return '🙊';
		}
		case 'End Timeout': {
			return '🔈';
		}
		case 'Kick': {
			return '⛔️';
		}
		case 'Ban': {
			return '🚫';
		}
		default: {
			return '';
		}
	}
}
