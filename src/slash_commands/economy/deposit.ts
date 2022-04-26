import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const deposit = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('deposit')
			.setDescription('Deposit money into your bank')
			.addIntegerOption(option =>
				option
					.setName('amount')
					.setDescription('The amount of MD to deposit')
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
		const profile = await getProfile(interaction.user.id);
		if (amount > profile.mincoDollars) {
			await interaction.reply({
				content:
					"You don't have that amount of Minco Dollars to deposit",
				ephemeral: true
			});
			return;
		}
		await updateProfile(
			{
				$inc: { mincoDollars: -amount, bank: amount }
			},
			interaction.user.id
		);
		await interaction.reply(
			`You deposited ${amount} Minco Dollars into your bank`
		);
	});

export default deposit;
