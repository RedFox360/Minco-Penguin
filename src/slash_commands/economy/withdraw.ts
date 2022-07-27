import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const withdraw = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('withdraw')
			.setDescription('Withdraw money from your bank')
			.addIntegerOption(option =>
				option
					.setName('amount')
					.setDescription('The amount of MD to withdraw')
					.setMinValue(1)
					.setRequired(true)
			)
	)
	.setRun(async interaction => {
		const amount = interaction.options.getInteger('amount');
		if (amount < 1) {
			await interaction.reply({
				content: 'Please enter a positive amount of MD',
				ephemeral: true
			});
			return;
		}
		if (amount > (await getProfile(interaction.user.id)).bank) {
			await interaction.reply({
				content:
					"You don't have that amount of Minco Dollars to withdraw",
				ephemeral: true
			});
			return;
		}
		await updateProfile(
			{
				$inc: { mincoDollars: amount, bank: -amount }
			},
			interaction.user.id
		);
		await interaction.reply(
			`You withdrew ${amount} Minco Dollars from bank`
		);
	});

export default withdraw;
