import { SlashCommand } from '../../types';

const echo = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('echo')
			.setDescription('Make the bot echo some text')
			.addStringOption(option =>
				option
					.setName('text')
					.setDescription('What the bot will echo')
					.setRequired(true)
			)
	)
	.setRun(async interaction => {
		const text = interaction.options.getString('text');
		await interaction.reply({
			content: text,
			allowedMentions: { users: [interaction.user.id] }
		});
	});

export default echo;
