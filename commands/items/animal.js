const animals = require("../../functions/animals.json");
const profileModel = require("../../models/profileSchema");
const { hasAnimal } = require("../../functions/animalFunctions");
module.exports = {
	description: "Pay 20 MD for a random animal!",
	cooldown: "12m",
	async execute(message, _0, _1, _2, profileData) {
		if (profileData.zoo.length >= 15) return "You have reached the maximum amount of animals (15)";
		if (profileData.mincoDollars < 20) return "You need 20 Minco Dollars to buy an animal";
		let randomAnimal = animals[Math.floor(Math.random() * animals.length)];
		while (hasAnimal(randomAnimal.name, profileData)) {
			randomAnimal = animals[Math.floor(Math.random() * animals.length)];
		}
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$inc: {
					mincoDollars: -20,
				},
				$push: {
					zoo: randomAnimal,
				},
			}
		);
		message.channel.send(`You bought a ${randomAnimal.name} ${randomAnimal.emoji} for 20 MD!`);
	},
};
