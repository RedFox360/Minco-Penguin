import {
	CommandInteraction,
	MessageEmbed,
	TextChannel
} from 'discord.js';
import { time } from '@discordjs/builders';

export default async function run(
	interaction: CommandInteraction<'cached'>
) {
	const channel = interaction.options.getChannel('channel');
	if (
		channel.type === 'GUILD_CATEGORY' ||
		channel.type === 'GUILD_STORE'
	) {
		await interaction.reply({
			content:
				"You can't provide a category or store for this command",
			ephemeral: true
		});
		return;
	}
	await interaction.deferReply();
	const type = (() => {
		switch (channel.type) {
			case 'GUILD_NEWS':
				return 'news';
			case 'GUILD_NEWS_THREAD':
				return 'news thread';
			case 'GUILD_PRIVATE_THREAD':
				return 'private thread';
			case 'GUILD_PUBLIC_THREAD':
				return 'thread';
			case 'GUILD_VOICE':
				return 'voice';
			case 'GUILD_STAGE_VOICE':
				return 'stage';
			default:
				return 'other';
		}
	})();

	const isPublic = channel
		.permissionsFor(interaction.guild.roles.everyone)
		.has('VIEW_CHANNEL');
	const embed = new MessageEmbed()
		.setTitle('Channel Info')
		.setColor('#DFBE33')
		.setFields(
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
			embed.addField(
				'Active Threads',
				Array.from(threads.values())
					.slice(15)
					.map(thread => thread.name)
					.join(', '),
				true
			);
		}
	}
	if (channel['topic']) {
		embed.addField('Description', '`' + channel['topic'] + '`', true);
	}

	await interaction.editReply({ embeds: [embed] });
}
