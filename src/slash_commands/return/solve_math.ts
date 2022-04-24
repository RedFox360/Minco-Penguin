import { evaluate } from 'mathjs';
import { SlashCommand } from '../../types';

const solveMath = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('solve_math')
			.setDescription(
				'This takes 20 seconds to prevent people from using this to cheat on math'
			)
			.addStringOption(option =>
				option
					.setName('equation')
					.setDescription('The equation to solve')
					.setRequired(true)
			)
	)
	.setRun(async interaction => {
		await interaction.deferReply();
		const equation = interaction.options.getString('equation');
		try {
			const result = evaluate(equation);
			setTimeout(
				() =>
					interaction.editReply(
						`${equation} = **${result}**`
					),
				20_000
			);
		} catch {
			await interaction.editReply(
				'That math equation is invalid'
			);
		}
	});

export default solveMath;
