import { Client, Collection, EmbedBuilder } from 'discord.js';
import checkProfanity from '../functions/filter';
import {
	getProfileInServer,
	getServer,
	updateProfileInServer
} from '../functions/models';
import { PermissionFlagsBits } from 'discord.js';
import handleProfanityPunishment from '../functions/profanity_punishment';
import commandHandler from '../functions/command_handler';
import { xpAmountToLevel } from '../functions/xp_to_level';

type CooldownId = `${string}$${string}`;
const cooldowns = new Collection<CooldownId, number>();
const cooldown = 8000;

// TODO: remove message delete for shadow ban

export default (client: Client) =>
	client.on('messageCreate', async message => {
		if (!message.inGuild()) return;
		if (message.author.bot) return;
		if (
			checkProfanity(message.content) &&
			message.guild.members.me.permissions.has(
				PermissionFlagsBits.ManageMessages
			)
		) {
			const { clean, profanityPunishment, autowarns } =
				await getServer(message.guildId);
			if (clean) await message.delete();
			if (profanityPunishment?.punishment) {
				await handleProfanityPunishment(
					message,
					profanityPunishment,
					autowarns
				);
			}
		}
		const authorId = message.author?.id;
		if (!authorId) return;
		if (message.author?.id === process.env.OWNER_ID) {
			await commandHandler(message);
		}
		const { xp: oldXp } = await getProfileInServer(
			authorId,
			message.guildId
		);
		const previousLevel = xpAmountToLevel(oldXp);
		const onCooldown = handleCooldowns(authorId, message.guildId);

		if (onCooldown) {
			return;
		}
		const server = await getServer(message.guildId);
		const multiplier = server.globalXpMultipler;
		const addedXp = Math.floor(25 * multiplier);
		const newLevel = xpAmountToLevel(oldXp + addedXp);
		await updateProfileInServer(
			{
				$inc: { xp: addedXp },
				level: newLevel
			},
			authorId,
			message.guildId
		);

		if (newLevel > previousLevel) {
			if (message.guild.systemChannel) {
				await message.guild.systemChannel.send({
					embeds: [
						new EmbedBuilder()
							.setAuthor({
								name: message.member.displayName
							})
							.setThumbnail(message.member.displayAvatarURL())
							.setTitle('Congrats')
							.setDescription(`You are now level **${newLevel}**!`)
					]
				});
			}
		}
	});

function handleCooldowns(userId: string, serverId: string) {
	const key = `${userId}$${serverId}` as const;
	const timestamp = cooldowns.get(key);
	if (!timestamp) {
		cooldowns.set(key, Date.now());
		return;
	}
	const currentTime = Date.now();
	const expTime = timestamp + cooldown;
	if (currentTime < expTime) {
		return true;
	}
	cooldowns.set(key, currentTime);
	return false;
}
