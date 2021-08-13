import { CommandData } from "../../types";

export const data = {
	name: "prime",
	description: "Checks if a num is prime",
	options: [
		{
			name: "number",
			description: "The number to check",
			type: "INTEGER",
			required: true,
		},
	],
};

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
