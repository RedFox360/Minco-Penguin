import facts from '../../json/facts.json';
import { SlashCommand } from '../../types';

const fact = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('fact')
			.setDescription('Get a random penguin fact!')
	)
	.setRun(async interaction => {
		const randomFact =
			facts[Math.floor(Math.random() * facts.length)];
		await interaction.reply(randomFact);
	});

export default fact;
