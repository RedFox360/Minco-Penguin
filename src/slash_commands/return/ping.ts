import { EmbedBuilder } from 'discord.js';
import prettyMs from 'pretty-ms';
import { SlashCommand } from '../../types';

const ping = new SlashCommand()
	.setCommandData(builder =>
		builder.setName('ping').setDescription('Ping the bot')
	)
	.setRun(async interaction => {
		const deferredReply = await interaction.deferReply({
			fetchReply: true
		});
		const latency = Math.round(interaction.client.ws.ping);
		const ping =
			deferredReply.createdTimestamp - interaction.createdTimestamp;
		const [status, color] = (() => {
			if (ping <= 200) return ['speed', '#117864'];
			else if (ping <= 500) return ['online', '#48C9B0'];
			else if (ping <= 2000) return ['slightly lagging', '#F7DC6F'];
			else if (ping <= 5000) return ['lagging', 'FF9433'];
			else return ['severely lagging', '#E74C3C'];
		})();

		const pingEmbed = new EmbedBuilder()
			.setColor(color as any)
			.setTitle(':robot: Pong!')
			.setAuthor({
				name:
					interaction.member?.displayName ??
					interaction.user.username,
				iconURL: interaction.member.displayAvatarURL()
			})
			.addFields(
				{ name: 'Status', value: status },
				{
					name: 'Execution Time',
					value: prettyMs(ping)
				},
				{ name: 'Client Latency', value: prettyMs(latency) },
				{
					name: 'Client Uptime',
					value: prettyMs(interaction.client.uptime)
				}
			)
			.setTimestamp()
			.setFooter({
				text: interaction.guild?.name ?? interaction.user.username
			});

		await interaction.editReply({ embeds: [pingEmbed] });
	});

export default ping;
