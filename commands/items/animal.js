const animals = require("../../functions/animals.json");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Pay 20 MD for a random animal!",
	async execute(message, _0, _1, _2, profileData) {
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
