import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("coinflip")
	.setDescription("Flip a coin!");

export async function run({ interaction }: CommandData) {
	if (Math.round(Math.random())) {
		await interaction.reply(":coin: Heads");
	} else {
		await interaction.reply(":coin: Tails");
	}
}
