import { hoursToSeconds } from 'date-fns';
import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const divorce = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('divorce')
			.setDescription('Divorce your spouse...')
	)
	.setCooldown(hoursToSeconds(3))
	.setRun(async interaction => {
		const { spouse } = await getProfile(interaction.user.id);
		if (!spouse) {
			await interaction.reply({
				content:
					"You aren't married! You can't divorce your spouse if they don't exist",
				ephemeral: true
			});
			return;
		}

		await interaction.reply(
			`Are you sure you want to divorce <@!${spouse}>? Respond with "yes" to continue`
		);

		interaction.channel
			.awaitMessages({
				filter: msg => msg.author.id === interaction.user.id,
				max: 1,
				time: 120_000,
				errors: ['time']
			})
			.then(async messages => {
				const message = messages.first();
				if (message.content.toLowerCase() === 'yes') {
					await updateProfile({ spouse: undefined }, spouse);
					await updateProfile(
						{ spouse: undefined },
						interaction.user.id
					);
					await interaction.followUp(
						`:broken_heart: You divorced <@!${spouse}>`
					);
				} else {
					await interaction.followUp('Divorce canceled');
				}
			})
			.catch(() => {
				interaction.followUp('Timed out!');
			});
	});

export default divorce;
