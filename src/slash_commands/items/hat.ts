import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const hat = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('hat')
			.setDescription(
				'Flex how rich you are by showing off your HATS'
			)
	)
	.setRun(async interaction => {
		let sendNone = true;
		let follow = false;
		const { inventory } = await getProfile(interaction.user.id);
		if (inventory.includes('02')) {
			await interaction.reply(
				'https://tenor.com/view/crystal-tiara-gif-18445329'
			);
			await interaction.followUp(
				'Wow! You have a 𝓯𝓪𝓷𝓬𝔂 diamond crown'
			);
			sendNone = false;
			follow = true;
		}
		if (inventory.includes('03')) {
			if (follow) {
				await interaction.followUp(
					'https://tenor.com/view/afistful-of-dollars-clint-eastwood-man-with-no-name-hat-tip-gif-4268634'
				);
			} else {
				await interaction.reply(
					'https://tenor.com/view/afistful-of-dollars-clint-eastwood-man-with-no-name-hat-tip-gif-4268634'
				);
			}
			await interaction.followUp('Wow! A cowboy hat');
			sendNone = false;
		}
		if (sendNone) {
			await interaction.reply("You don't have any hats :(");
		}
	});

export default hat;
