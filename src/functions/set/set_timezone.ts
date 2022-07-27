import {
	ButtonBuilder,
	ActionRowBuilder,
	CommandInteraction,
	ChatInputCommandInteraction,
	ButtonStyle
} from 'discord.js';
import { SlashCommandSubcommandBuilder } from 'discord.js';
import timezoneList from '../../json/timezones.json';
import { updateProfile, updateServer } from '../models';

export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('timezone')
	.setDescription('Set a timezone for your server/user')
	.addStringOption(option =>
		option
			.setName('type')
			.setDescription('Personal or server timezone')
			.setRequired(true)
			.addChoices(
				{ name: 'Personal', value: 'personal' },
				{ name: 'Server', value: 'server' }
			)
	)
	.addStringOption(option =>
		option
			.setName('timezone')
			.setDescription('The timezone of your server')
			.setRequired(true)
	);

export async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	const choice = interaction.options.getString('type');
	const timezone = interaction.options.getString('timezone');
	if (!timezoneList.includes(timezone)) {
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Valid Timezones')
				.setEmoji('⏰')
				.setStyle(ButtonStyle.Link)
				.setURL('https://pastebin.com/r7UfkZeQ')
		);
		await interaction.reply({
			content: 'You entered an invalid timezone!',
			components: [row]
		});
		return;
	}
	if (choice === 'server') {
		if (
			!(interaction.member.permissions as any).has('MANAGE_GUILD')
		) {
			await interaction.reply({
				content:
					'You need the `Manage Server` permission to execute this command',
				ephemeral: true
			});
			return;
		}
		await updateServer({ timezone }, interaction.guildId);
		await interaction.reply(`Server timezone updated to ${timezone}`);
	} else {
		await updateProfile({ timezone }, interaction.user.id);
		await interaction.reply(
			`Personal timezone updated to ${timezone}`
		);
	}
}
