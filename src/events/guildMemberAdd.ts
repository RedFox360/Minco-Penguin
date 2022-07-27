import {
	GuildMember,
	TextChannel,
	Client,
	ChannelType,
	PermissionFlagsBits
} from 'discord.js';
import { modelClient } from '../main';
import ordinal from 'ordinal';
import {
	getProfile,
	getServer,
	updateServer
} from '../functions/models';
import prettyMs from 'pretty-ms';
import ms from 'ms';
import { EmbedBuilder } from 'discord.js';
const { profileModel } = modelClient;

export default (client: Client) =>
	client.on('guildMemberAdd', async member => {
		const inDev = !process.argv.includes('--prod');
		const profileData = await getProfile(member.id);
		const serverData = inDev
			? await getServer(member.guild.id)
			: await updateServer(
					{ $inc: { memberCount: member.user.bot ? 0 : 1 } },
					member.guild.id
			  );
		if (
			member.guild.members.me.permissions.has(
				PermissionFlagsBits.ManageRoles
			)
		) {
			try {
				if (member.user.bot) {
					if (serverData.botRole)
						member.roles.add(serverData.botRole);
					return;
				}
				if (serverData.joinRole)
					member.roles.add(serverData.joinRole);
			} catch (error) {
				// no permissions
			}
		}
		if (serverData.silenceJoins) return;
		if (!profileData) {
			await profileModel.create({
				userID: member.id,
				mincoDollars: 100,
				bank: 0
			});
		}
		const { welcomeMessage, welcomeDM, memberCount } = serverData;
		const memberCountOrdinal = ordinal(memberCount);

		const joinEmbed = new EmbedBuilder()
			.setColor(0x58d68d) // green
			.setTitle('Welcome')
			.setDescription(
				welcomeMessage
					.replace(/\{server\}/g, member.guild.name)
					.replace(/\{mention\}/g, `<@${member.id}>`)
					.replace(/\{ord_member_count\}/g, memberCountOrdinal)
					.replace(/\{member_count\}/g, memberCount.toLocaleString())
					.replace(/\{user\}/g, member.user.username)
					.replace(/\{user_tag\}/g, member.user.tag)
			)
			.setThumbnail(member.user.displayAvatarURL());
		const channel = serverData.welcomeChannel
			? member.client.channels.cache.get(serverData.welcomeChannel)
			: member.guild.systemChannel;
		if (!channel) return;
		(channel as TextChannel).send({
			embeds: [joinEmbed]
		});
		if (welcomeDM)
			try {
				await member.send(
					welcomeDM
						.replace(/\{server\}/g, member.guild.name)
						.replace(/\{mention\}/g, `<@${member.id}>`)
						.replace(/\{ord_member_count\}/g, memberCountOrdinal)
						.replace(
							/\{member_count\}/g,
							memberCount.toLocaleString()
						)
						.replace(/\{user\}/g, member.user.username)
						.replace(/\{user_tag\}/g, member.user.tag)
				);
			} catch (err) {
				// dm was not sent
			}
		await logJoin(
			member,
			serverData.mainLogChannelId,
			serverData.mainLogChannelWebhookId
		);
	});

async function logJoin(
	member: GuildMember,
	mainLogChannelId: string,
	mainLogChannelWebhookId: string
) {
	if (!mainLogChannelId) return;
	const mainLogChannel = await member.guild.channels.fetch(
		mainLogChannelId,
		{ cache: true }
	);
	if (!mainLogChannel) return;
	if (mainLogChannel.type !== ChannelType.GuildText) return;

	const webhook = await member.client.fetchWebhook(
		mainLogChannelWebhookId
	);

	const currentTime = Date.now();
	const memberAccountAge = currentTime - member.user.createdTimestamp;
	const threeDays = ms('3d');
	const newAccount = memberAccountAge < threeDays;

	const embed = new EmbedBuilder()
		.setColor(0x73b384)
		.setDescription(`${member} ${member.user.tag}`)
		.setAuthor({
			name: 'Member joined',
			iconURL: member.displayAvatarURL()
		})
		.addFields({
			name: 'Account Age',
			value: prettyMs(memberAccountAge, {
				verbose: true,
				unitCount: 2
			})
		})
		.setFooter({ text: `User ID: ${member.id}` })
		.setTimestamp();

	if (newAccount)
		embed.setDescription('🌱 New Account (less than 3 days old)');

	await webhook.send({ embeds: [embed] });
}
