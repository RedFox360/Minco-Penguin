import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const bet = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('bet')
			.setDescription('Bet a number of your Minco Dollars!')
			.addIntegerOption(option =>
				option
					.setName('amount')
					.setDescription(
						'The amount of MD you want to bet'
					)
					.setMinValue(2)
					.setMaxValue(30)
					.setRequired(true)
			)
	)
	.setRun(async interaction => {
		const random = Math.round(Math.random());
		const amount = interaction.options.getInteger('amount');
		const profile = await getProfile(interaction.user.id);

		if (amount > profile.mincoDollars) {
			await interaction.reply({
				content: `You don't have ${amount} Minco Dollars in your wallet`,
				ephemeral: true
			});
			return;
		}

		if (random) {
			await updateProfile(
				{ $inc: { mincoDollars: -amount } },
				interaction.user.id
			);
			await interaction.reply(
				`<:x_circle:872594799553839114> You lost! You lost ${amount} MD`
			);
		} else {
			await updateProfile(
				{ $inc: { mincoDollars: amount } },
				interaction.user.id
			);
			await interaction.reply(
				`<:check_circle:872594799662858270> You won! You won ${amount} MD`
			);
		}
	});

export default bet;
