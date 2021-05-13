const animals = require("../../functions/animals.json");
const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	description: "Pay 20 MD for a random animal!",
	cooldown: ms("15m") / 1000, // 15 minutes
	async execute(message, _0, _1, _2, profileData) {
		if (profileData.zoo.length >= 15) return "You have reached the maximum amount of animals (15)";
		if (profileData.mincoDollars < 20) return "You need 20 Minco Dollars to buy an animal";
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
function checkForDuplicates(array) {
	let valuesAlreadySeen = [];

	for (let i = 0; i < array.length; i++) {
		let value = array[i];
		if (valuesAlreadySeen.indexOf(value) !== -1) {
			return true;
		}
		valuesAlreadySeen.push(value);
	}
	return false;
}
