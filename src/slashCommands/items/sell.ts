import { CommandData, Profile } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import animals from "../../json/animals.json";
export const data = new SlashCommandBuilder()
	.setName("sell")
	.setDescription("Sell an item or animal")
	.addStringOption((option) =>
		option
			.setName("item_type")
			.setDescription("The type of item to sell")
			.setRequired(true)
			.addChoice("Item", "item")
			.addChoice("Animal", "animal")
	)
	.addStringOption((option) =>
		option
			.setName("item_name")
			.setDescription("The name or number of the item")
			.setRequired(true)
	);

export async function run(data: CommandData) {
	if (data.interaction.options.getString("item_type") == "item") {
		sellItem(data);
	} else {
		sellAnimal(data);
	}
}

async function sellItem({ interaction, profile, updateProfile }: CommandData) {
	const itemName = interaction.options.getString("item_name");

	const sellableItems = [
		"Ring",
		"Crown",
		"Cowboy Hat",
		"Jellyfish",
		"Bear",
		"Cactus",
		"Fire",
	];
	const sellableItemNumbers = ["01", "02", "03", "06", "07", "08", "09"];
	const index = sellableItems.indexOf(itemName);
	if (index == -1) {
		await interaction.reply({
			content: `You can't sell that item!
Sellable items are:
\`\`\`
${sellableItems.join(", ")}
\`\`\``,
			ephemeral: true,
		});
		return;
	}
	const itemNumber = sellableItemNumbers[index];
	if (!profile.inventory.includes(itemNumber)) {
		await interaction.reply({
			content: "You don't have that item!",
			ephemeral: true,
		});
		return;
	}
	const returnAmounts = [40, 500, 15, 40, 250, 30, 30, 30];
	const returnAmount = returnAmounts[index];

	await updateProfile({
		$pull: { inventory: itemNumber },
		$inc: { mincoDollars: returnAmount },
	});

	await interaction.reply("You succesfully sold your item");
}

async function sellAnimal({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	const animalName = interaction.options.getString("item_name");
	const animal = animals.find(
		(a) => a.name.toLowerCase() === animalName.toLowerCase()
	);
	if (!animal) {
		await interaction.reply({
			content:
				"Enter a valid animal (use /zoo Animal List for a list of animals)",
			ephemeral: true,
		});
		return;
	}
	if (!hasAnimal(animal.name, profile)) {
		await interaction.reply({
			content: `You don't have a ${animal.name}!`,
			ephemeral: true,
		});
		return;
	}
	const returnPrice = 15;

	await updateProfile({
		$inc: { mincoDollars: returnPrice },
		$pull: { zoo: animal },
	});

	await interaction.reply(
		`You sold your ${animal.name} ${animal.emoji} for ${returnPrice} MD`
	);
}

function hasAnimal(animal: string, profile: Profile) {
	return profile.zoo.find((e) => e.name === animal);
}
