import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getServer, updateServer } from '../models';
import { maxAutoWarns } from './set_auto_warn';

export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('remove')
	.setDescription('Remove an auto warn for the server')
	.addIntegerOption(option =>
		option
			.setName('index')
			.setDescription('Type 0 to remove all warns')
			.setMinValue(0)
			.setMaxValue(maxAutoWarns)
			.setRequired(true)
	);

export async function run(interaction: CommandInteraction<'cached'>) {
	const uindex = interaction.options.getInteger('index');
	if (uindex < 0 || uindex > maxAutoWarns) {
		await interaction.reply({
			content: 'Please enter an index greater than or equal to 0',
			ephemeral: true
		});
		return;
	}
	const index = uindex - 1;
	const { autowarns } = await getServer(interaction.guildId);
	if (autowarns.length - 1 < index) {
		await interaction.reply({
			content: `There isn't an autowarn in this server with index ${uindex}`,
			ephemeral: true
		});
		return;
	}
	if (index === -1) {
		await updateServer({ autowarns: [] }, interaction.guildId);
		await interaction.reply(`All autowarns have been removed`);
		return;
	}

	await removeAutowarn(index, interaction.guildId);
	await interaction.reply(
		`Autowarn index ${uindex} has been removed`
	);
}
async function removeAutowarn(index: number, guildId: string) {
	await updateServer(
		{ $unset: { [`autowarns.${index}`]: 1 } },
		guildId
	);
	await updateServer({ $pull: { autowarns: null } }, guildId);
}
