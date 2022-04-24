import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const gift = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('gift')
			.setDescription('Gift money to a user!')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user to gift money to')
					.setRequired(true)
			)
			.addIntegerOption(option =>
				option
					.setName('md_amount')
					.setDescription('The amount of money to gift')
					.setMinValue(3)
					.setRequired(true)
			)
	)
	.setRun(async interaction => {
		const user = interaction.options.getUser('user');
		const amount = interaction.options.getInteger('md_amount');
		const profile = await getProfile(interaction.user.id);
		if (user.id === interaction.user.id) {
			await interaction.reply({
				content: "You can't gift money to yourself!",
				ephemeral: true
			});
			return;
		}
		if (amount > profile.mincoDollars) {
			await interaction.reply({
				content: `You don't have ${amount} Minco Dollars`,
				ephemeral: true
			});
			return;
		}
		await updateProfile(
			{ $inc: { mincoDollars: -amount } },
			interaction.user.id
		);
		await updateProfile(
			{ $inc: { mincoDollars: amount } },
			user.id
		);

		await interaction.reply(`You gifted ${amount} MD to ${user}`);
	});

export default gift;
