import { CommandData } from "../../types";
import facts from "../../json/facts.json";

export const data = {
	name: "fact",
	description: "Get a random penguin fact!",
};

export async function run({ interaction }: CommandData) {
	const randomFact = facts[Math.floor(Math.random() * facts.length)];
	await interaction.reply(randomFact);
}
