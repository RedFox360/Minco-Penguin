import { Message, PermissionFlagsBits } from 'discord.js';
import { AutoWarn } from 'mincomodels/serverSchema/types';
import prettyMs from 'pretty-ms';
import { autowarn } from '../slash_commands/admin/warn';
import {
	logBan,
	logKick,
	logTimeout,
	logWarn
} from './logging/log_functions';

export default async function handleProfanityPunishment(
	message: Message<true>,
	profanityPunishment: {
		punishment: 'warn' | 'timeout' | 'ban' | 'kick';
		time?: number;
	},
	autowarns: AutoWarn[]
) {
	switch (profanityPunishment.punishment) {
		case 'timeout': {
			if (
				!message.guild.members.me.permissions.has(
					PermissionFlagsBits.ModerateMembers
				)
			)
				break;
			if (!message.member.moderatable) break;
			if (!profanityPunishment.time) break;
			if (!profanityPunishment.time) break;
			const reason = 'Automatic timeout for sending profanity';
			const { currentCaseNo } = await logTimeout(
				message.author.id,
				message.guildId,
				profanityPunishment.time,
				reason
			);
			await message.member.timeout(profanityPunishment.time, reason);
			message.author
				.send(
					`#${currentCaseNo} | You were timeouted in ${
						message.guildId
					} for ${prettyMs(profanityPunishment.time, {
						verbose: true
					})} for sending a profane message`
				)
				.catch(() => null);
			return;
		}
		case 'warn': {
			const { currentCaseNo, logs } = await logWarn(
				message.author.id,
				message.guildId,
				'Automatic warn for sending profanity'
			);
			message.author
				.send(
					`#${currentCaseNo} | You were warned in ${message.guild.name} for sending a profane message`
				)
				.catch(() => null);
			await autowarn(logs, autowarns, message.member);
			return;
		}
		case 'kick': {
			if (!message.member.kickable) break;
			const kickReason = 'Automatic kick for sending profanity';
			await message.member.kick(kickReason);
			const { currentCaseNo } = await logKick(
				message.author.id,
				message.guildId,
				kickReason
			);
			message.author
				.send(
					`#${currentCaseNo} | You were kicked in **${message.guild.name}** for sending a profane message`
				)
				.catch(() => null);
			return;
		}
		case 'ban': {
			if (!message.member.bannable) break;
			const banReason = 'Automatic ban for sending profanity';
			await message.member.ban({
				reason: banReason
			});
			const { currentCaseNo } = await logBan(
				message.author.id,
				message.guildId,
				banReason
			);
			message.member
				.send(
					`#${currentCaseNo} | You were banned in **${message.guild.name}** for sending a profane message`
				)
				.catch(() => null);
			return;
		}
	}
}
