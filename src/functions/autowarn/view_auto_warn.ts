import { EmbedBuilder } from 'discord.js';
import prettyMs from 'pretty-ms';
import { Subcommand } from '../../types';
import { getServer } from '../models';

export default new Subcommand()
	.setCommandData(builder =>
		builder
			.setName('view')
			.setDescription(
				'View the auto warn punishments for this server'
			)
	)
	.setRun(async interaction => {
		const { autowarns: fullAutowarns } = await getServer(
			interaction.guildId
		);
		const autowarns = fullAutowarns.filter(autowarn => autowarn);
		if (!autowarns?.length) {
			await interaction.reply({
				content: 'This server does not have any auto warns!'
			});
			return;
		}
		const fields = autowarns.map((autowarn, index) => {
			const { warnAmount, punishment, time } = autowarn;
			const warnPluralFormatted = warnAmount === 1 ? 'Warn' : 'Warns';
			let value = `Index: ${index + 1}
Punishment: **${uppercase(punishment)}**`;
			if (time)
				value += `\nTime: ${prettyMs(time, { verbose: true })}`;
			return {
				name: `${autowarn.warnAmount} ${warnPluralFormatted}`,
				value
			};
		});
		const autowarnEmbed = new EmbedBuilder()
			.setAuthor({
				name: interaction.guild.name,
				iconURL: interaction.guild.iconURL() ?? undefined
			})
			.setColor(0x5dade2)
			.setTitle('Server Auto Warns')
			.setDescription('Tip: you can delete a warn by the id')
			.addFields(...fields)
			.setTimestamp();
		await interaction.reply({ embeds: [autowarnEmbed] });
	});

const uppercase = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);
