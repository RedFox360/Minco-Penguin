import { CommandData, Profile } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import animals from "../../json/animals.json";

export const cooldown = "6m";
export const data = new SlashCommandBuilder()
	.setName("animal")
	.setDescription("Buy an animal")
	.addStringOption((option) =>
		option
			.setName("animal_name")
			.setDescription(
				"Type random for a random animal (20 MD) or choose a specific animal (50 MD)"
			)
			.setRequired(true)
	);

export async function run(data: CommandData) {
	if (data.profile.zoo.length >= 20) {
		await data.interaction.reply({
			content: "You have reached the maximum amount of animals (20)",
			ephemeral: true,
		});
		return;
	}
	if (
		data.interaction.options.getString("animal_name").toLowerCase() == "random"
	) {
		buyRandomAnimal(data);
	} else {
		buySpecificAnimal(data);
	}
}
async function buySpecificAnimal({
	interaction,
	updateProfile,
	profile,
}: CommandData) {
	if (profile.mincoDollars < 50) {
		await interaction.reply({
			content: "You need 50 MD to buy an animal",
			ephemeral: true,
		});
		return;
	}
	const animalName = interaction.options.getString("animal_name");
	let animalData = animals.find(
		(animal) => animal.name.toLowerCase() === animalName.toLowerCase()
	);
	if (!animalData) {
		await interaction.reply({
			content:
				"That animal doesn't exist! Use /zoo Animal List to view the valid list of animals",
			ephemeral: true,
		});
		return;
	}
	if (profile.zoo.find((a) => a.name === animalData.name)) {
		await interaction.reply({
			content: "You already have that animal!",
			ephemeral: true,
		});
		return;
	}

	await updateProfile({
		$inc: { mincoDollars: -50 },
		$push: { zoo: animalData },
	});

	await interaction.reply(
		`You bought a ${animalData.name} ${animalData.emoji} for 50 MD!`
	);
}

async function buyRandomAnimal({
	interaction,
	updateProfile,
	profile,
}: CommandData) {
	if (profile.mincoDollars < 20) {
		await interaction.reply({
			content: "You need 20 MD to buy a random animal",
			ephemeral: true,
		});
		return;
	}
	let randomAnimal;
	do {
		randomAnimal = animals[Math.floor(Math.random() * animals.length)];
	} while (hasAnimal(randomAnimal.name, profile));

	await updateProfile({
		$inc: { mincoDollars: -20 },
		$push: { zoo: randomAnimal },
	});
	await interaction.reply(
		`You bought a ${randomAnimal.name} ${randomAnimal.emoji} for 20 MD!`
	);
}

function hasAnimal(animal: string, profile: Profile) {
	return profile.zoo.find((e) => e.name === animal);
}
