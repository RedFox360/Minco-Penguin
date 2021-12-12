import { randomInt } from "mathjs";
import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("math")
	.setDescription("Solve math for Minco Dollars")
	.addStringOption((option) =>
		option
			.setName("operation")
			.setDescription("The operation to use")
			.setRequired(true)
			.addChoice("Addition", "+")
			.addChoice("Subtraction", "-")
	);

export const cooldown = "8m";

export async function run({
	interaction,
	updateProfile,
	profile,
}: CommandData) {
	let oper = interaction.options.getString("operation");
	let num1 = randomInt(1600, 2501);
	let num2 = randomInt(1000, 2001);
	let result;
	if (oper == "-") {
		if (num1 - num2 < 0) {
			let temp = num2;
			num2 = num1;
			num1 = temp;
		}
		result = num1 - num2;
	} else {
		result = num1 + num2;
	}
	await interaction.reply(`What is ${num1} ${oper} ${num2}?`);

	const filter = (msg) => msg.author.id === interaction.user.id;

	interaction.channel
		.awaitMessages({
			filter,
			max: 1,
			time: 20_000,
			errors: ["time"],
		})
		.then(async (messages) => {
			const message = messages.first();
			message.guild.roles.fetch();
			let guess = parseInt(message.content.replace(/\D/g, ""));
			if (guess == result) {
				let amount = randomInt(10, 21);
				if (profile.spouse) amount = randomInt(10, 26);
				else if (profile.inventory.includes("07")) amount = randomInt(10, 24);
				await updateProfile({ $inc: { mincoDollars: amount } });
				interaction.followUp(
					`<:check_circle:872594799662858270> Correct! You won **${amount}** Minco Dollars!`
				);
			} else {
				interaction.followUp(`<:x_circle:872594799553839114> Incorrect!`);
			}
		})
		.catch(() => {
			interaction.followUp("Timed out!");
		});
}
