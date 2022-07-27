import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder
} from 'discord.js';
import { updateServer } from '../models';

export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('boolean')
	.setDescription('Sets a boolean (true/false) value for your server')
	.addStringOption(option =>
		option
			.setName('option')
			.setDescription('The name of the option to set')
			.addChoices(
				{ name: 'Send Birthdays', value: 'sb' },
				{ name: 'Profanity', value: 'p' },
				{ name: 'Silence Ban Messages', value: 'sbm' },
				{ name: 'Silence Join Messages', value: 'sjm' }
			)
			.setRequired(true)
	)
	.addBooleanOption(option =>
		option
			.setName('value')
			.setDescription('The true/false value of the option')
			.setRequired(true)
	);

export async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	if (!(interaction.member.permissions as any).has('MANAGE_GUILD')) {
		await interaction.reply({
			content:
				'You need the `Manage Server` permission to execute this command',
			ephemeral: true
		});
		return;
	}
	const value = interaction.options.getBoolean('value');
	switch (interaction.options.getString('option')) {
		case 'sb': {
			await updateServer(
				{ sendBirthdays: value },
				interaction.guildId
			);
			await interaction.reply(
				`Send birthdays has been set to ${value}`
			);
			break;
		}
		case 'p': {
			await updateServer({ clean: !value }, interaction.guildId);
			await interaction.reply(`Profanity allowed set to ${value}`);
			break;
		}
		case 'sbm': {
			await updateServer({ silenceBans: value }, interaction.guildId);
			await interaction.reply(`Silence bans set to ${value}`);
			break;
		}
		case 'sjm': {
			await updateServer(
				{ silenceJoins: value },
				interaction.guildId
			);
			await interaction.reply(`Silence joins set to ${value}`);
			break;
		}
	}
}
