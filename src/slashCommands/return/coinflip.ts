import { CommandData } from "../../types";

export const data = {
	name: "coinflip",
	description: "Flip a coin!",
};

export async function run({ interaction }: CommandData) {
	if (Math.round(Math.random())) {
		await interaction.reply(":coin: Heads");
	} else {
		await interaction.reply(":coin: Tails");
	}
}
