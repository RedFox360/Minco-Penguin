import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import * as buyItem from "../../functions/buy/buy_item";
import * as buyGem from "../../functions/buy/buy_gem";

export const data = new SlashCommandBuilder()
	.setName("buy")
	.setDescription("Buy items from the shop!")
	.addSubcommand(buyItem.subcommand)
	.addSubcommand(buyGem.subcommand);

export async function run(data: CommandData) {
	switch (data.interaction.options.getSubcommand()) {
		case "item": {
			await buyItem.run(data);
			break;
		}
		case "gem": {
			await buyGem.run(data);
			break;
		}
	}
}
