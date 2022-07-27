import { SlashCommand } from '../../types';
import calculateStats from '../../functions/basics/calculate_stats';
import { getProfile } from '../../functions/models';

const battle = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('battle')
			.setDescription(
				'Bring your penguins to a battle to win emeralds!'
			)
	)
	.setRun(async interaction => {
		const profile = await getProfile(interaction.user.id);
		const stats = calculateStats(profile);
		if (!stats) {
			await interaction.reply({
				content:
					"You don't have a penguin yet. Use /adopt to get one",
				ephemeral: true
			});
			return;
		}
	});

export default battle;
