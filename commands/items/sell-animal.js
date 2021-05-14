const animals = require("../../functions/animals.json");
const { animalExists, getAnimal, hasAnimal } = require("../../functions/animalFunctions");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Sell your animals",
	usage: "!sell-animal <animal name>",
	async execute(message, args, _0, _1, profileData) {
		const animal = args[0];
		if (!animal) return "Enter an animal";
		if (!animalExists(animal)) return "Enter a valid animal";
		if (!hasAnimal(animal, profileData)) return "You don't have this animal!";
		const gAnimal = getAnimal(animal);
		const price = 15;
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: price,
				},
				$pull: {
					zoo: gAnimal,
				},
			}
		);
		message.channel.send(`You sold your ${gAnimal.name} ${gAnimal.emoji} for ${price} MD`);
	},
};
