const animals = require("../../functions/animals.json");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Pay 20 MD for a random animal!",
	cooldown: 1200, // 20 minutes
	async execute(message, _0, _1, _2, profileData) {
		if (profileData.zoo.length >= 15) return message.channel.send("You have reached the maximum amount of animals (15)");
		if (profileData.mincoDollars < 20) return message.channel.send("You need 20 Minco Dollars to buy an animal");
		let randomAnimal = animals[Math.floor(Math.random() * animals.length)];

		while (profileData.zoo.includes(randomAnimal)) {
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
		message.channel.send(`You received a ${randomAnimal.name} ${randomAnimal.emoji}!`);
	},
};
