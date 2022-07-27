import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder
} from 'discord.js';
import { updateServer } from '../models';
export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('role')
	.setDescription('Set a role for your server')
	.addStringOption(option =>
		option
			.setName('role_type')
			.setDescription('The type of role to set')
			.setRequired(true)
			.addChoices(
				{ name: 'Bot', value: 'bot' },
				{ name: 'Join', value: 'join' },
				{ name: 'Mute', value: 'mute' },
				{ name: 'Main', value: 'main' },
				{ name: 'Moderator', value: 'mod' }
			)
	)
	.addRoleOption(option =>
		option
			.setName('role')
			.setDescription('The role to set')
			.setRequired(true)
	);

export async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	if (
		!(interaction.member.permissions as any).has('MANAGE_ROLES') &&
		!(interaction.member.permissions as any).has('MANAGE_GUILD')
	) {
		await interaction.reply({
			content: 'This command can only be used by server admins',
			ephemeral: true
		});
		return;
	}
	const role = interaction.options.getRole('role');
	const type = interaction.options.getString('role_type');
	const typeFormat = type.charAt(0).toUpperCase() + type.slice(1);
	switch (type) {
		case 'bot': {
			await updateServer({ botRole: role.id }, interaction.guildId);
			break;
		}
		case 'join': {
			await updateServer({ joinRole: role.id }, interaction.guildId);
			break;
		}
		case 'mute': {
			await updateServer({ muteRole: role.id }, interaction.guildId);
			break;
		}
		case 'main': {
			await updateServer({ mainRole: role.id }, interaction.guildId);
			break;
		}
		case 'mod': {
			await updateServer({ modRole: role.id }, interaction.guildId);
			break;
		}
	}
	await interaction.reply(
		`${typeFormat} role set to ${role.toString()}`
	);
}
