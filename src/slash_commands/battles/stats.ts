import { EmbedBuilder } from 'discord.js';
import calculateStats from '../../functions/basics/calculate_stats';
import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const stats = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('stats')
			.setDescription("View your or someone else's battle stats")
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user to view the balance of')
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const member =
			interaction.options.getMember('user') ?? interaction.member;
		const profile = await getProfile(interaction.user.id);
		const stats = calculateStats(profile);
		if (!stats) {
			await interaction.reply({
				content:
					"You don't have a penguin yet. Use /adopt to get one",
				ephemeral: true
			});
			return;
		}
		const embed = new EmbedBuilder()
			.setAuthor({
				name: member.displayName,
				iconURL: member.displayAvatarURL()
			})
			.setTitle('Penguin Battle Stats')
			.setColor(stats.color)
			.addFields(
				{
					name: 'Name',
					value: profile.battleSystem.penguinName,
					inline: true
				},
				{
					name: 'Penguin Type',
					value: capitalizeFirstLetter(profile.battleSystem.penguin),
					inline: true
				},
				{
					name: 'Emeralds',
					value: profile.battleSystem.emeralds.toLocaleString(),
					inline: true
				},
				{
					name: '🔥 Attack',
					value: `${stats.attack.toLocaleString()} HP`,
					inline: true
				},
				{
					name: '💨 Attack Speed',
					value: `${stats.attackSpeed.toLocaleString()} attacks/sec`,
					inline: true
				},
				{
					name: '❤️ Health',
					value: `${stats.health.toLocaleString()} HP`,
					inline: true
				},
				{
					name: '🛡 Defense',
					value: `${stats.defense.toLocaleString()}%`,
					inline: true
				},
				{
					name: '♻️ Regeneration',
					value: `${stats.regen.toLocaleString()} HP/sec`,
					inline: true
				},
				{
					name: '💀 Crit Chance',
					value: `${stats.crit.toLocaleString()}%`,
					inline: true
				}
			)
			.setTimestamp();
		await interaction.reply({
			embeds: [embed]
		});
	});

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default stats;
