const animals = require("../../functions/animals.json");
const removeValue = require("../../functions/removeValue");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Sell your animals",
	async execute(message, args, _0, _1, profileData) {
		const animal = args[0];
		if (!animal) return "Enter an animal";
		if (!animalExists(animal)) return "Enter a valid animal";
		if (!hasAnimal(animal, profileData)) return "You don't have this animal!";
		const gAnimal = getAnimal(animal);
		const zoo = removeValue(gAnimal, profileData.zoo);
		const price = 15;
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: price,
				},
				zoo,
			}
		);
		message.channel.send(`You sold your ${gAnimal.name} ${gAnimal.emoji} for ${price} MD`);
	},
};

function animalExists(animal) {
	for (let { name } of animals) {
		if (name.toLowerCase() == animal.toLowerCase()) return true;
	}
	return false;
}
function getAnimal(animal) {
	for (let a of animals) {
		if (animal.toLowerCase() == a.name.toLowerCase()) return a;
	}
	return null;
}

function hasAnimal(animal, profileData) {
	for (let { name } of profileData.zoo) {
		if (animal.toLowerCase() == name.toLowerCase()) return true;
	}
	return false;
}
