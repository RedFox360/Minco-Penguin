const animals = require("../../functions/animals.json");
const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	description: "Buy an animal! Costs 50 MD",
	cooldown: ms("12m") / 1000, // 7 minutes
	async execute(message, args, _0, _1, profileData) {
		const animal = args[0];
		if (!animal) return "Enter an animal";
		if (profileData.mincoDollars < 50) return "You don't have 50 MD";
		for (let { name } of profileData.zoo) {
			if (name.toLowerCase() == animal.toLowerCase()) return "You already have this animal!";
		}
		if (!animalExists(animal)) return "Enter a valid animal";
		let gAnimal = getAnimal(animal);
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$inc: {
					mincoDollars: -50,
				},
				$push: {
					zoo: gAnimal,
				},
			}
		);

		message.channel.send(`You bought a ${gAnimal.name} ${gAnimal.emoji} for 50 MD!`);
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
