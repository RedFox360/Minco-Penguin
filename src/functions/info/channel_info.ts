import {
	ChannelType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	TextChannel
} from 'discord.js';
import { EmbedBuilder, time } from 'discord.js';

export default async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	const channel = interaction.options.getChannel('channel');
	if (channel.type === ChannelType.GuildCategory) {
		await interaction.reply({
			content: "You can't provide a category for this command",
			ephemeral: true
		});
		return;
	}
	await interaction.deferReply();
	const type = (() => {
		switch (channel.type) {
			case ChannelType.GuildNews:
				return 'news';
			case ChannelType.GuildNewsThread:
				return 'news thread';
			case ChannelType.GuildPrivateThread:
				return 'private thread';
			case ChannelType.GuildPublicThread:
				return 'thread';
			case ChannelType.GuildVoice:
				return 'voice';
			case ChannelType.GuildStageVoice:
				return 'stage';
			default:
				return 'other';
		}
	})();

	const isPublic = channel
		.permissionsFor(interaction.guild.roles.everyone)
		.has(PermissionFlagsBits.ViewChannel);
	const embed = new EmbedBuilder()
		.setTitle('Channel Info')
		.setColor(0xdfbe33)
		.addFields(
			{
				name: ':name_badge: Name',
				value: '*' + channel.name + '*',
				inline: true
			},
			{
				name: ':id: ID',
				value: '`' + channel.id + '`',
				inline: true
			},
			{
				name: ':speech_balloon: Type',
				value: '`' + type + '`',
				inline: true
			},
			{
				name: 'Private',
				value: '`' + !isPublic + '`',
				inline: true
			},
			{
				name: 'Created at',
				value: time(channel.createdAt),
				inline: true
			}
		);
	if (channel instanceof TextChannel) {
		const { threads } = await channel.threads.fetchActive();
		if (threads.size) {
			embed.addFields({
				name: 'Active Threads',
				value: Array.from(threads.values())
					.slice(15)
					.map(thread => thread.name)
					.join(', '),
				inline: true
			});
		}
	}
	if (channel['topic']) {
		embed.addFields({
			name: 'Description',
			value: '`' + channel['topic'] + '`',
			inline: true
		});
	}

	await interaction.editReply({ embeds: [embed] });
}
