import sellAnimal from '../../functions/sell/sellAnimal';
import sellItem from '../../functions/sell/sellItem';
import sellFish from '../../functions/sell/sellFish';
import { SlashCommand } from '../../types';

const sell = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('sell')
			.setDescription('Sell an item or animal')
			.addSubcommand(subcommand =>
				subcommand
					.setName('item')
					.setDescription('Sell an item')
					.addStringOption(option =>
						option
							.setName('item_name')
							.setDescription(
								'The name or number of the item'
							)
							.setRequired(true)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('animal')
					.setDescription('Sell an animal')
					.addStringOption(option =>
						option
							.setName('animal_name')
							.setDescription(
								'The name or number of the item'
							)
							.setRequired(true)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('fish')
					.setDescription('Sell your fish')
					.addStringOption(option =>
						option
							.setName('fish_name')
							.setDescription(
								'The type of fish you want to sell / all'
							)
							.setAutocomplete(true)
							// .addChoice(
							// 	'Cooked Salmon',
							// 	'cookedSalmons'
							// )
							// .addChoice('Cooked Cod', 'cookedCods')
							// .addChoice('Salmon', 'salmons')
							// .addChoice('Cod', 'cods')
							// .addChoice('Clownfish', 'clownfish')
							// .addChoice('Pufferfish', 'pufferfish')
							// .addChoice('Axolotl', 'axolotls')
							.setRequired(true)
					)
					.addIntegerOption(option =>
						option
							.setName('amount')
							.setDescription(
								'The amount of fish to sell (default: all fish)'
							)
							.setMinValue(1)
							.setMaxValue(3000)
							.setRequired(false)
					)
			)
	)
	.setRun(async interaction => {
		switch (interaction.options.getSubcommand()) {
			case 'item': {
				await sellItem(interaction);
				return;
			}
			case 'animal': {
				await sellAnimal(interaction);
				return;
			}
			case 'fish': {
				await sellFish(interaction);
				return;
			}
		}
	});

export default sell;
