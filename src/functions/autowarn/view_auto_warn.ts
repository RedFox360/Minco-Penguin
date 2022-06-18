import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import prettyMs from 'pretty-ms';
import { getServer } from '../models';

export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('view')
	.setDescription('View the auto warn punishments for this server');

export async function run(interaction: CommandInteraction<'cached'>) {
	const { autowarns } = await getServer(interaction.guildId);
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
		if (time) value += `\nTime: ${prettyMs(time, { verbose: true })}`;
		return {
			name: `${autowarn.warnAmount} ${warnPluralFormatted}`,
			value
		};
	});
	const autowarnEmbed = new MessageEmbed()
		.setAuthor({
			name: interaction.guild.name,
			iconURL:
				interaction.guild.iconURL({ dynamic: true }) ?? undefined
		})
		.setColor('#5DADE2')
		.setTitle('Server Auto Warns')
		.setDescription('Tip: you can delete a warn by the id')
		.setFields(fields)
		.setTimestamp();
	await interaction.reply({ embeds: [autowarnEmbed] });
}

const uppercase = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);
