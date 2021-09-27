import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import facts from "../../json/facts.json";

export const data = new SlashCommandBuilder()
	.setName("fact")
	.setDescription("Get a random penguin fact!");

export async function run({ interaction }: CommandData) {
	const randomFact = facts[Math.floor(Math.random() * facts.length)];
	await interaction.reply(randomFact);
}
