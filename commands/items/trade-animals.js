const profileModel = require("../../models/profileSchema");
const ms = require("ms");
const { Message } = require("discord.js");
const animals = require("../../functions/animals.json");
module.exports = {
	description: "Trade your animals!",
	usage: "!trade-animal <animal name> <@user> <price>",
	/** @param {Message} message */
	async execute(message, args, _0, _1, profileData) {
		const animal = args[0];
		const mention = message.mentions.users.first();
		const price = args[2];
		if (!animal) return "Enter an animal";
		if (!mention) return "Mention a valid user";
		if (!price) return "Enter a price";
		if (!animalExists(animal)) return "Enter a valid animal name";
		if (!hasAnimal(animal, profileData)) return "You don't have this animal!";
		const gAnimal = getAnimal(animal);

		const msg = message.channel.send(
			`<@${mention.id}>, ${message.author.toString()} has offered to trade you their ${gAnimal.name} ${
				gAnimal.emoji
			} for ${price} MD. Accept by reacting with a ✅`
		);

		msg.react("✅");
		const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === mention.id;
		const reactionCollector = await msg.createReactionCollector(filter, { time: ms("3m") });

		reactionCollector.on("collect", () => {
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$inc: {
						mincoDollars: price,
					},
					$pull: {
						zoo: gAnimal,
					},
				}
			);

			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$inc: {
						mincoDollars: -price,
					},
					$push: {
						zoo: gAnimal,
					},
				}
			);
			message.channel.send("Trade succesful!");
			reactionCollector.stop();
		});
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
