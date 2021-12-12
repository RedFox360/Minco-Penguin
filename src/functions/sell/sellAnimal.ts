import { CommandData, Profile } from "../../types";
import animals from "../../json/animals.json";
export default async function sellAnimal({
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
