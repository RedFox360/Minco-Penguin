import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../types';

const clear = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('clear')
			.setDescription('Clear an amount of messages from the channel')
			.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
			.addIntegerOption(option =>
				option
					.setName('amount')
					.setDescription('The amount of messages to clear')
					.setMinValue(2)
					.setMaxValue(100)
					.setRequired(true)
			)
	)
	.setBotPermissions(PermissionFlagsBits.ManageMessages)
	.setRun(async interaction => {
		const amount = interaction.options.getInteger('amount');
		if (amount <= 1 || amount > 100) {
			await interaction.reply({
				content:
					'Please enter an amount of messages above 1 and below 100',
				ephemeral: true
			});
			return;
		}
		if (interaction.channel.type !== ChannelType.GuildText) {
			await interaction.reply({
				content: 'This command cannot be used in this channel',
				ephemeral: true
			});
			return;
		}
		await interaction.reply('cleared messages');
		await interaction.deleteReply();
		await interaction.channel.bulkDelete(amount);
	});

export default clear;
