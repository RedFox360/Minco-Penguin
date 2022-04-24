import { Permissions } from 'discord.js';
import { SlashCommand } from '../../types';

const clear = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('clear')
			.setDescription(
				'Clear an amount of messages from the channel'
			)
			.addIntegerOption(option =>
				option
					.setName('amount')
					.setDescription('The amount of messages to clear')
					.setMinValue(1)
					.setMaxValue(100)
					.setRequired(true)
			)
	)
	.setPermissions(Permissions.FLAGS.MANAGE_MESSAGES)
	.setRun(async interaction => {
		const amount = interaction.options.getInteger('amount');
		if (!interaction.channel.isText()) {
			await interaction.reply({
				content:
					'This command cannot be used in this channel',
				ephemeral: true
			});
			return;
		}
		await interaction.reply('cleared messages');
		await interaction.deleteReply();
		await interaction.channel.bulkDelete(amount + 1);
	});

export default clear;
