import { CommandInteraction } from 'discord.js';
import type { Profile } from '../../types';
import { getProfile, updateProfile } from '../models';
import animals from '../../json/animals.json';

export default async function run(
	interaction: CommandInteraction<'cached'>
) {
	const profile = await getProfile(interaction.user.id);
	if (profile.zoo.length >= 20) {
		await interaction.reply({
			content: 'You have reached the maximum amount of animals (20)',
			ephemeral: true
		});
		return;
	}
	const animalName = interaction.options.getString('name');
	if (animalName) {
		buySpecificAnimal(interaction, animalName, profile);
	} else {
		buyRandomAnimal(interaction, profile);
	}
}
async function buySpecificAnimal(
	interaction: CommandInteraction<'cached'>,
	animalName: string,
	profile: Profile
) {
	if (profile.mincoDollars < 50) {
		await interaction.reply({
			content: 'You need 50 MD to buy an animal',
			ephemeral: true
		});
		return;
	}
	const animalData = animals.find(
		animal => animal.name.toLowerCase() === animalName.toLowerCase()
	);
	if (!animalData) {
		await interaction.reply({
			content:
				"That animal doesn't exist! Use /zoo Animal List to view the valid list of animals",
			ephemeral: true
		});
		return;
	}
	if (profile.zoo.find(a => a.name === animalData.name)) {
		await interaction.reply({
			content: 'You already have that animal!',
			ephemeral: true
		});
		return;
	}

	await updateProfile(
		{
			$inc: { mincoDollars: -50 },
			$push: { zoo: animalData }
		},
		interaction.user.id
	);

	await interaction.reply(
		`You bought a ${animalData.name} ${animalData.emoji} for 50 MD!`
	);
}

async function buyRandomAnimal(
	interaction: CommandInteraction<'cached'>,
	profile: Profile
) {
	if (profile.mincoDollars < 20) {
		await interaction.reply({
			content: 'You need 20 MD to buy a random animal',
			ephemeral: true
		});
		return;
	}
	let randomAnimal;
	do {
		randomAnimal =
			animals[Math.floor(Math.random() * animals.length)];
	} while (hasAnimal(randomAnimal.name, profile));

	await updateProfile(
		{
			$inc: { mincoDollars: -20 },
			$push: { zoo: randomAnimal }
		},
		interaction.user.id
	);
	await interaction.reply(
		`You bought a ${randomAnimal.name} ${randomAnimal.emoji} for 20 MD!`
	);
}

function hasAnimal(animal: string, profile: Profile) {
	return profile.zoo.find(e => e.name === animal);
}
