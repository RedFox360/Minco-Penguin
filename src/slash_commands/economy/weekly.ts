import { MessageEmbed } from 'discord.js';
import { randomInt } from 'mathjs';
import { time } from '@discordjs/builders';
import ms from 'ms';
import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
const dayLength = ms('7d');

const weekly = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('weekly')
			.setDescription('Claim your weekly reward!')
	)
	.setRun(async interaction => {
		const now = Date.now();
		const profile = await getProfile(interaction.user.id);

		if (
			profile.lastUsedWeekly &&
			profile.lastUsedWeekly + dayLength > now
		) {
			const timeToWait = Math.floor(
				(profile.lastUsedWeekly + dayLength) / 1000
			);
			await interaction.reply({
				content: `You can use /weekly again ${time(timeToWait, 'R')}`,
				ephemeral: true
			});
			return;
		}

		const weeklyEmbed = new MessageEmbed()
			.setColor('#ffa845')
			.setTitle('Weekly Reward')
			.setFooter({
				text: interaction.guild?.name ?? interaction.user.username
			});
		let upperLimit = 400;
		if (profile.spouse) upperLimit = 500;
		else if (profile.inventory.includes('07')) upperLimit = 450;
		const randomAmount = randomInt(150, upperLimit);

		await updateProfile(
			{
				$inc: { mincoDollars: randomAmount },
				lastUsedWeekly: now
			},
			interaction.user.id
		);
		if (profile.inventory.includes('05')) {
			await updateProfile(
				{ $inc: { candyAmount: 3 } },
				interaction.user.id
			);
		} else {
			await updateProfile(
				{
					$push: { inventory: '05' },
					candyAmount: 3
				},
				interaction.user.id
			);
		}

		weeklyEmbed.setDescription(
			`You earned ${randomAmount} Minco Dollars and a candy :candy:!`
		);
		await interaction.reply({ embeds: [weeklyEmbed] });
	});

export default weekly;
