import { CommandData, Profile } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import sellAnimal from "../../functions/sell/sellAnimal";
import sellItem from "../../functions/sell/sellItem";
import sellFish from "../../functions/sell/sellFish";

export const data = new SlashCommandBuilder()
	.setName("sell")
	.setDescription("Sell an item or animal")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("item")
			.setDescription("Sell an item")
			.addStringOption((option) =>
				option
					.setName("item_name")
					.setDescription("The name or number of the item")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("animal")
			.setDescription("Sell an animal")
			.addStringOption((option) =>
				option
					.setName("animal_name")
					.setDescription("The name or number of the item")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("fish")
			.setDescription("Sell your fish")
			.addStringOption((option) =>
				option
					.setName("fish_name")
					.setDescription("The type of fish you want to sell / all")
					.addChoice("Cooked Salmon", "salmon_cooked")
					.addChoice("Cooked Cod", "cod_cooked")
					.addChoice("Salmon", "salmon")
					.addChoice("Cod", "cod")
					.addChoice("Clownfish", "clownfish")
					.addChoice("Pufferfish", "pufferfish")
					.addChoice("Axolotl", "axolotl")
					.setRequired(true)
			)
			.addIntegerOption((option) =>
				option
					.setName("amount")
					.setDescription("The amount of fish to sell (default: all fish)")
					.setRequired(false)
			)
	);

export async function run(data: CommandData) {
	switch (data.interaction.options.getSubcommand()) {
		case "item": {
			await sellItem(data);
			break;
		}
		case "animal": {
			await sellAnimal(data);
			break;
		}
		case "fish": {
			await sellFish(data);
			break;
		}
	}
}
