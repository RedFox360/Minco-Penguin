import { CommandData } from "../../types";
import { evaluate } from "mathjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("solve_math")
	.setDescription(
		"This takes 20 seconds to prevent people from using this to cheat on math"
	)
	.addStringOption((option) =>
		option
			.setName("equation")
			.setDescription("The equation to solve")
			.setRequired(true)
	);

export async function run({ interaction }: CommandData) {
	await interaction.deferReply();
	const equation = interaction.options.getString("equation");
	try {
		const result = evaluate(equation);
		setTimeout(
			async () => await interaction.editReply(`${equation} = **${result}**`),
			20_000
		);
	} catch (error) {
		await interaction.editReply("That math equation is invalid");
	}
}
