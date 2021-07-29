const profileModel = require("../../models/profileSchema");
const { animalExists, getAnimal } = require("../../functions/animalFunctions");
module.exports = {
	description: "Buy an animal! Costs 50 MD",
	cooldown: "12m",
	usage: "!buy-animal <animal name>",
	async run(message, args, _0, _1, profileData) {
		if (profileData.zoo.length >= 15) return "You have reached the maximum amount of animals (15)";
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
