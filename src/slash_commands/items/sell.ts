import sellAnimal from '../../functions/sell/sell_animal';
import sellItem from '../../functions/sell/sell_item';
import sellFish from '../../functions/sell/sell_fish';
import { SlashCommand } from '../../types';
import { ApplicationCommandOptionChoiceData } from 'discord.js';
import fishJSON from '../../json/fish.json';
import {
	autocomplete,
	animalAutocompleteData
} from '../../functions/autocomplete';

const fishAutocompleteData =
	new Array<ApplicationCommandOptionChoiceData>();
for (const [fishName, fishData] of Object.entries(fishJSON)) {
	fishAutocompleteData.push({
		name:
			fishData.formattedNames[0].charAt(0).toUpperCase() +
			fishData.formattedNames[0].slice(1),
		value: fishName
	});
}

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
							.setName('item-name')
							.setDescription('The name or number of the item')
							.addChoices(
								{ name: 'Ring', value: 'Ring' },
								{ name: 'Crown', value: 'Crown' },
								{ name: 'Cowboy Hat', value: 'Cowboy Hat' },
								{ name: 'Jellyfish', value: 'Jellyfish' },
								{ name: 'Bear', value: 'Bear' },
								{ name: 'Cactus', value: 'Cactus' },
								{ name: 'Fire', value: 'Fire' }
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
							.setDescription('The name or number of the item')
							.setAutocomplete(true)
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
	})
	.setAutocomplete(async interaction => {
		const value = interaction.options.getFocused().toString();
		if (interaction.options.getSubcommand() === 'fish') {
			await interaction.respond(
				autocomplete(fishAutocompleteData, value)
			);
		} else if (interaction.options.getSubcommand() === 'animal') {
			await interaction.respond(
				autocomplete(animalAutocompleteData, value)
			);
		}
	});

export default sell;
