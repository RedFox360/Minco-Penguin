const animals = require("../../functions/animals.json");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Buy an animal! Costs 50 MD",
	cooldown: 420, // 7 minutes
	async execute(message, args, _0, _1, profileData) {
		const animal = args[0];
		if (!animal) return "Enter an animal";
		if (profileData.mincoDollars < 50) return "You don't have 50 MD";
		for (let { name } of profileData.zoo) {
			if (name.toLowerCase() == animal.toLowerCase()) return "You already have this animal!";
		}
		if (!animalExists(animal)) return "Enter a valid animal";

		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$inc: {
					mincoDollars: -50,
				},
				$push: {
					zoo: getAnimal(animal),
				},
			}
		);

		message.channel.send(`You bought a ${animal} for 50 MD!`);
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
		if (animal.name == a) return a;
	}
	return null;
}
