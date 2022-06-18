import { minutesToSeconds } from 'date-fns';
import { randomInt } from 'mathjs';
import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const math = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('math')
			.setDescription('Solve math for Minco Dollars')
			.addSubcommand(subcommand =>
				subcommand
					.setName('addition')
					.setDescription(
						'Solve a 4-digit addition problem for Minco Dollars'
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('subtraction')
					.setDescription(
						'Solve a 4-digit subtraction problem for Minco Dollars'
					)
			)
	)
	.setCooldown(minutesToSeconds(7.5))
	.setRun(async interaction => {
		const oper = interaction.options.getSubcommand();
		let num1 = randomInt(1600, 2501);
		let num2 = randomInt(1000, 2001);
		let result: number;
		const operSymbol = oper === 'subtraction' ? '-' : '+';
		if (oper === 'subtraction') {
			if (num1 - num2 < 0) {
				const temp = num2;
				num2 = num1;
				num1 = temp;
			}
			result = num1 - num2;
		} else {
			result = num1 + num2;
		}
		await interaction.reply(`What is ${num1} ${operSymbol} ${num2}?`);

		interaction.channel
			.awaitMessages({
				filter: msg => msg.author.id === interaction.user.id,
				max: 1,
				time: 20_000,
				errors: ['time']
			})
			.then(async messages => {
				const message = messages.first();
				message.guild.roles.fetch();
				const guess = parseInt(message.content.replace(/\D/g, ''));
				if (guess === result) {
					let bounds: number[];
					const profile = await getProfile(interaction.user.id);
					if (profile.spouse) bounds = [10, 26];
					else if (profile.inventory.includes('07'))
						bounds = [10, 24];
					else bounds = [10, 21];
					const amount = randomInt(bounds[0], bounds[1]);
					await updateProfile(
						{ $inc: { mincoDollars: amount } },
						interaction.user.id
					);
					await interaction.followUp(
						`<:check_circle:872594799662858270> Correct! You won **${amount}** Minco Dollars!`
					);
				} else {
					await interaction.followUp(
						`<:x_circle:872594799553839114> Incorrect!`
					);
				}
			})
			.catch(() => interaction.followUp('Timed out!'));
	});

export default math;
