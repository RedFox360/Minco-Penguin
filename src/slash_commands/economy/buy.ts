import buyItem from '../../functions/buy/buy_item';
import buyGem from '../../functions/buy/buy_gem';
import { SlashCommand } from '../../types';

const buy = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('buy')
			.setDescription('Buy items from the shop!')
			.addSubcommand(subcommand =>
				subcommand
					.setName('item')
					.setDescription(
						'Buy an item from the Minco Shop!'
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('gem')
					.setDescription('Buy gems from the shop!')
			)
	)
	.setRun(async interaction => {
		if (interaction.options.getSubcommand() === 'item') {
			await buyItem(interaction);
		} else {
			await buyGem(interaction);
		}
	});

export default buy;
