import { updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const giveuser = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('giveuser')
			.setDescription('Give a user money')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user to give money to')
					.setRequired(true)
			)
			.addIntegerOption(option =>
				option
					.setName('amount')
					.setDescription('The amount of money to give')
					.setRequired(true)
			)
			.setDefaultPermission(false)
	)
	.setRun(async interaction => {
		if (
			!['724786310711214118', '802668636795830292'].includes(
				interaction.user.id
			)
		) {
			await interaction.reply({
				content: 'This command can only be used by the owner',
				ephemeral: true
			});
			return;
		}
		const user = interaction.options.getUser('user');
		const amount = interaction.options.getInteger('amount');
		if (interaction.user.id === '802668636795830292') {
			if (amount < 100) {
				await interaction.reply({
					content: "You can't give more than 100 MD",
					ephemeral: true
				});
				return;
			}
			if (user.id === '802668636795830292') {
				await interaction.reply({
					content: "You can't give money to yourself",
					ephemeral: true
				});
				return;
			}
		}
		await updateProfile({ $inc: { mincoDollars: amount } }, user.id);
		interaction.reply(`You added ${amount} MD to ${user}'s profile`);
	});

export default giveuser;
