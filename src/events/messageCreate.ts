import { Message, MessageEmbed, Permissions } from 'discord.js';
import prettyMs from 'pretty-ms';
import { transpile } from 'typescript';
import slashHandler from '../handlers/slash_handler';
import { inspect } from 'util';
import checkProfanity from '../functions/filter';
import { getServer } from '../functions/models';
import {
	logBan,
	logKick,
	logTimeout,
	logWarn
} from '../functions/log_functions';
import { autowarn } from '../slash_commands/admin/warn';
export default async (message: Message) => {
	if (
		message.guild &&
		checkProfanity(message.content) &&
		message.guild.me.permissions.has(
			Permissions.FLAGS.MANAGE_MESSAGES
		)
	) {
		const { clean, profanityPunishment } = await getServer(
			message.guildId
		);
		if (clean) await message.delete();
		if (profanityPunishment) {
			switch (profanityPunishment.punishment) {
				case 'timeout': {
					if (
						!message.guild.me.permissions.has(
							Permissions.FLAGS.MODERATE_MEMBERS
						)
					)
						break;
					if (!message.member.moderatable) break;
					if (!profanityPunishment.time) break;
					if (!profanityPunishment.time) break;
					const reason =
						'Automatic timeout for sending profanity';
					const { currentCaseNo } = await logTimeout(
						message.author.id,
						message.guildId,
						profanityPunishment.time,
						reason
					);
					await message.member.timeout(
						profanityPunishment.time,
						reason
					);
					message.author
						.send(
							`#${currentCaseNo} | You were timeouted in ${
								message.guildId
							} for ${prettyMs(
								profanityPunishment.time,
								{ verbose: true }
							)} for sending a profane message`
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
					const { autowarns } = await getServer(
						message.guildId
					);
					await autowarn(logs, autowarns, message.member);
					return;
				}
				case 'kick': {
					if (!message.member.kickable) break;
					const kickReason =
						'Automatic kick for sending profanity';
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
					const banReason =
						'Automatic ban for sending profanity';
					await message.member.ban({ reason: banReason });
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
	}
	if (message.author.id === '724786310711214118') {
		if (message.content.startsWith('!eval ')) {
			const typescriptCode = message.content.substring(5);
			if (!typescriptCode || typescriptCode === '') return;
			const code = transpile(typescriptCode, {
				esModuleInterop: true,
				moduleResolution: 2,
				resolveJsonModule: true,
				target: 99
			});
			const timeStamp1 = Date.now();
			let evaled;
			try {
				evaled = eval(code);
			} catch (err) {
				const errorEmbed = new MessageEmbed()
					.setTitle(
						'<:x_circle:872594799553839114>  **ERROR** '
					)
					.setDescription(
						'```xl\n' + cleanText(err) + '\n```'
					)
					.setColor('#E48383');
				await message.reply({
					embeds: [errorEmbed]
				});
				return;
			}
			if (typeof evaled !== 'string') evaled = inspect(evaled);
			const codeEvaled =
				'```js\n' + cleanText(evaled) + '\n```';
			const codeFormat = '```js\n' + code + '\n```';
			const responseEmbed = new MessageEmbed()
				.setTitle('Eval...')
				.setFields(
					{
						name: 'Input',
						value: codeFormat
					},
					{
						name: 'Output',
						value: codeEvaled
					},
					{
						name: 'Time taken',
						value: prettyMs(Date.now() - timeStamp1)
					}
				)
				.setColor('#B8FF8B');
			await message.reply({ embeds: [responseEmbed] });
		} else if (message.content === '!reload commands') {
			await slashHandler(message.client, true);
			await message.reply('Reloaded all commands');
		}
	}
};

function cleanText(text: any) {
	if (typeof text === 'string')
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
