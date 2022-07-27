import buyItem from '../../functions/buy/buy_item';
import buyGem from '../../functions/buy/buy_gem';
import buyAnimal from '../../functions/buy/buy_animal';
import { SlashCommand } from '../../types';
import {
	animalAutocompleteData,
	autocomplete
} from '../../functions/autocomplete';

const buy = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('buy')
			.setDescription('Buy items from the shop!')
			.addSubcommand(subcommand =>
				subcommand
					.setName('item')
					.setDescription('Buy an item from the Minco Shop!')
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('gem')
					.setDescription('Buy gems from the shop!')
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('animal')
					.setDescription('Buy an animal to add to your zoo!')
					.addStringOption(option =>
						option
							.setName('animal_name')
							.setDescription(
								'If you do not type here you will get a random animal'
							)
							.setAutocomplete(true)
							.setRequired(false)
					)
			)
	)
	.setRun(async interaction => {
		switch (interaction.options.getSubcommand()) {
			case 'item': {
				await buyItem(interaction);
				return;
			}
			case 'gem': {
				await buyGem(interaction);
				return;
			}
			case 'animal': {
				await buyAnimal(interaction);
				return;
			}
		}
	})
	.setAutocomplete(async interaction => {
		if (interaction.options.getSubcommand() === 'animal') {
			await interaction.respond(
				autocomplete(
					animalAutocompleteData,
					interaction.options.getFocused().toString()
				)
			);
		}
	});

export default buy;
