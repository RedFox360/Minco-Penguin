import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import checkProfanity from '../../functions/filter';
import { updateProfile } from '../models';
export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('favorite')
	.setDescription('Set your favorite color, animal, or food')
	.addStringOption(option =>
		option
			.setName('favorite_type')
			.setDescription('The type of favorite you want to set')
			.addChoice('Food', 'food')
			.addChoice('Color', 'color')
			.addChoice('Animal', 'animal')
			.setRequired(true)
	)
	.addStringOption(option =>
		option
			.setName('value')
			.setDescription(
				'What your favorite food, color, or animal is'
			)
			.setRequired(true)
	);

export async function run(interaction: CommandInteraction<'cached'>) {
	const type = interaction.options.getString('favorite_type');
	const value = interaction.options.getString('value');
	if (checkProfanity(value)) {
		await interaction.reply({
			content: 'Make sure to keep your favorite clean!',
			ephemeral: true
		});
		return;
	}
	if (value.length > 60) {
		await interaction.reply({
			content:
				'Your favorite must be less than 60 characters long',
			ephemeral: true
		});
		return;
	}
	switch (type) {
		case 'food': {
			await updateProfile(
				{ 'favs.food': value },
				interaction.user.id
			);
			await interaction.reply(
				`You updated/set your favorite food to **${value}**`
			);
			return;
		}
		case 'color': {
			await updateProfile(
				{ 'favs.color': value },
				interaction.user.id
			);
			await interaction.reply(
				`You updated/set your favorite color to **${value}**`
			);
			return;
		}
		case 'animal': {
			await updateProfile(
				{ 'favs.animal': value },
				interaction.user.id
			);
			await interaction.reply(
				`You updated/set your favorite animal to **${value}**`
			);
			return;
		}
	}
}
