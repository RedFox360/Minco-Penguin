import { CommandData } from "../../types";
import { evaluate } from "mathjs";

export const data = {
	name: "solve_math",
	description: "Solve a math equation",
	options: [
		{
			name: "equation",
			description: "The equation to solve",
			type: "STRING",
			required: true,
		},
	],
};

export async function run({ interaction }: CommandData) {
	const equation = interaction.options.getString("equation");
	try {
		const result = evaluate(equation);
		await interaction.reply(`${equation} = **${result}**`);
	} catch (error) {
		await interaction.reply("That math equation is invalid");
	}
}
