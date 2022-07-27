import { ApplicationCommandOptionChoiceData } from 'discord.js';
import animals from '../json/animals.json';

export function autocompleteFilter(
	givenAName: string,
	givenValue: string
) {
	const aName = givenAName.toLowerCase();
	const value = givenValue.trim().toLowerCase();
	return (
		aName.startsWith(value) ||
		aName.includes(value) ||
		value.includes(aName)
	);
}

export function autocomplete(
	autocompleteData: ApplicationCommandOptionChoiceData[],
	value: string
) {
	const matching = autocompleteData.filter(a =>
		autocompleteFilter(a.name, value)
	);
	return matching.slice(0, 25);
}

const animalAutocompleteData =
	new Array<ApplicationCommandOptionChoiceData>();
for (const animal of animals) {
	animalAutocompleteData.push({
		name: animal.name,
		value: animal.name
	});
}
export { animalAutocompleteData };
