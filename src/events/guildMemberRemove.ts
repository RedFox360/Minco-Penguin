import { ChannelType, EmbedBuilder } from 'discord.js';
import {
	Client,
	GuildMember,
	PartialGuildMember,
	TextChannel
} from 'discord.js';
import ordinal from 'ordinal';
import prettyMs from 'pretty-ms';
import { getServer, updateServer } from '../functions/models';
export default (client: Client) =>
	client.on('guildMemberRemove', async member => {
		const inDev = !process.argv.includes('--prod');
		const wasBanned = member.guild.bans.cache.some(
			ban => ban.user === member.user
		);
		if (member.user.bot) return;
		const amount = member.user.bot ? 0 : -1;
		const serverData = inDev
			? await getServer(member.guild.id)
			: await updateServer(
					{ $inc: { memberCount: amount } },
					member.guild.id
			  );
		if (serverData.silenceJoins) return;
		if (wasBanned) return;
		const { leaveMessage, memberCount } = serverData;
		const memberCountOrdinal = ordinal(memberCount);
		const leaveEmbed = new EmbedBuilder()
			.setColor(0xec7063) // red
			.setTitle('Goodbye')
			.setDescription(
				leaveMessage
					.replace(/\{server\}/g, member.guild.name)
					.replace(/\{mention\}/g, `<@${member.id}>`)
					.replace(/\{ord_member_count\}/g, memberCountOrdinal)
					.replace(/\{member_count\}/g, memberCount.toLocaleString())
					.replace(/\{user\}/g, member.user.username)
					.replace(/\{user_tag\}/g, member.user.tag)
			);
		const channel = serverData.welcomeChannel
			? member.client.channels.cache.get(serverData.welcomeChannel)
			: member.guild.systemChannel;
		(channel as TextChannel).send({
			embeds: [leaveEmbed]
		});
		await logLeave(
			member,
			serverData.mainLogChannelId,
			serverData.mainLogChannelWebhookId
		);
	});

async function logLeave(
	member: GuildMember | PartialGuildMember,
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
	const timeInServer = currentTime - member.joinedTimestamp;

	const embed = new EmbedBuilder()
		.setColor(0xde481b)
		.setAuthor({
			name: 'Member left',
			iconURL: member.displayAvatarURL()
		})
		.setDescription(`${member} ${member.user.tag}`)
		.addFields({
			name: 'Time in server',
			value: prettyMs(timeInServer, { verbose: true, unitCount: 2 })
		})
		.setFooter({ text: `User ID: ${member.id}` })
		.setTimestamp();

	await webhook.send({ embeds: [embed] });
}
