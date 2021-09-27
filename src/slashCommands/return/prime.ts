import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("prime")
	.setDescription("Checks if a number is prime")
	.addIntegerOption((option) =>
		option
			.setName("number")
			.setDescription("The number to check")
			.setRequired(true)
	);

export async function run({ interaction }: CommandData) {
	const num = interaction.options.getInteger("number");
	if (num <= 0) {
		await interaction.reply({
			content: "Please enter a positive number",
			ephemeral: true,
		});
		return;
	}
	await interaction.reply(isPrime(num));
}

function isPrime(num: number) {
	if (num == 1) return "1 is neither prime nor composite";
	if (num == 2) return `2 is prime`;
	for (let i = 2; i <= Math.ceil(Math.sqrt(num)); i++) {
		if (num % i == 0)
			return `${num.toLocaleString()} isn't prime because it is divisible by ${i}`;
	}
	return `${num.toLocaleString()} is prime`;
}
