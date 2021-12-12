import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import marketView from "../../functions/market/market_view";
import marketBuy from "../../functions/market/market_buy";
import marketRemove from "../../functions/market/market_remove";
import marketAdd from "../../functions/market/market_add";

export const data = new SlashCommandBuilder()
	.setName("market")
	.setDescription("Market commands")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("view")
			.setDescription("View the market of a user")
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("The user whose market to view")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("buy")
			.setDescription("Buy items from a user's market")
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("The user to buy the item from")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("item_name")
					.setDescription("The name of the item you want to buy")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("remove")
			.setDescription("Remove an item from your market")
			.addStringOption((option) =>
				option
					.setName("item_name")
					.setDescription("The name of the item you want to remove")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("add")
			.setDescription("Add an item to your market")
			.addIntegerOption((option) =>
				option
					.setName("price")
					.setDescription("The price of the item")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("item_name")
					.setDescription("The name of your item")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("description")
					.setDescription("A description of your item")
					.setRequired(false)
			)
	);

export const serverOnly = true;
export async function run(data: CommandData) {
	switch (data.interaction.options.getSubcommand()) {
		case "view": {
			await marketView(data);
			break;
		}
		case "buy": {
			await marketBuy(data);
			break;
		}
		case "remove": {
			await marketRemove(data);
			break;
		}
		case "add": {
			await marketAdd(data);
			break;
		}
	}
}
