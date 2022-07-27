import { Profile } from 'mincomodels/profileSchema/types';
import animals from '../../json/animals.json';
import { getProfile, updateProfile } from '../models';
import { ChatInputCommandInteraction } from 'discord.js';
export default async function sellAnimal(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	const profile = await getProfile(interaction.user.id);
	const animalName = interaction.options.getString('animal_name');
	const animal = animals.find(
		a => a.name.toLowerCase() === animalName.toLowerCase()
	);
	if (!animal) {
		await interaction.reply({
			content:
				'Enter a valid animal (use /zoo Animal List for a list of animals)',
			ephemeral: true
		});
		return;
	}
	if (!hasAnimal(animal.name, profile)) {
		await interaction.reply({
			content: `You don't have a ${animal.name}!`,
			ephemeral: true
		});
		return;
	}
	const returnPrice = 15;

	await updateProfile(
		{
			$inc: { mincoDollars: returnPrice },
			$pull: { zoo: animal }
		},
		interaction.user.id
	);

	await interaction.reply(
		`You sold your ${animal.name} ${animal.emoji} for ${returnPrice} MD`
	);
}

function hasAnimal(animal: string, profile: Profile) {
	return profile.zoo.find(e => e.name === animal);
}
