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
	const msg = await interaction.reply({
		content: `What is ${num1} ${oper} ${num2}?`,
		fetchReply: true,
	});

	const filter = (msg) => msg.author.id === interaction.user.id;

	msg.channel
		.awaitMessages({
			filter,
			max: 1,
			time: 20000,
			errors: ["time"],
		})
		.then(async (msg) => {
			const message = msg.first();
			message.guild.roles.fetch();
			let guess = parseInt(message.content.replace(/\D/g, ""));
			if (guess == result) {
				let amount = randomInt(10, 21);
				if (profile.spouse) amount = randomInt(10, 26);
				else if (profile.inventory.includes("07")) amount = randomInt(10, 24);
				await updateProfile({ $inc: { mincoDollars: amount } });
				interaction.followUp({
					embeds: [
						new MessageEmbed()
							.setDescription(
								`<:check_circle:872594799662858270> Correct!
You won ${amount} Minco Dollars!`
							)
							.setColor("#B8FF8B"),
					],
				});
			} else {
				interaction.followUp({
					embeds: [
						new MessageEmbed()
							.setDescription(
								`<:x_circle:872594799553839114> Incorrect! The correct answer is ${result}`
							)
							.setColor("#E48383"),
					],
				});
			}
		})
		.catch(() => {
			interaction.followUp("Timed out!");
		});
}
