import { CommandData } from "../../types";
import { evaluate } from "mathjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("solve_math")
	.setDescription("Solve a math equation")
	.addStringOption((option) =>
		option
			.setName("equation")
			.setDescription("The equation to solve")
			.setRequired(true)
	);

export async function run({ interaction }: CommandData) {
	const equation = interaction.options.getString("equation");
	try {
		const result = evaluate(equation);
		await interaction.reply(`${equation} = **${result}**`);
	} catch (error) {
		await interaction.reply("That math equation is invalid");
	}
}
