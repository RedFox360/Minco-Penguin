const profileModel = require("../../models/profileSchema");
const ms = require("ms");
const { animalExists, getAnimal, hasAnimal } = require("../../functions/animalFunctions");
const { Message } = require("discord.js");
const animals = require("../../functions/animals.json");
module.exports = {
	description: "Trade your animals!",
	usage: "!trade-animal <animal name> <@user> <price>",
	/** @param {Message} message */
	async execute(message, args, _0, _1, profileData) {
		const animal = args[0];
		const mention = message.mentions.users.first();
		const price = parseInt(args[2]);
		if (!animal) return "Enter an animal";
		if (!mention) return "Mention a valid user";
		if (isNaN(price)) return "Enter a valid price";
		if (!animalExists(animal)) return "Enter a valid animal name";
		if (!hasAnimal(animal, profileData)) return "You don't have this animal!";
		const gAnimal = getAnimal(animal);

		const msg = await message.channel.send(
			`<@${mention.id}>, ${message.author.toString()} has offered to trade you their ${gAnimal.name} ${
				gAnimal.emoji
			} for ${price} MD. Accept by reacting with a ✅`
		);

		msg.react("✅");
		const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === mention.id;
		const reactionCollector = msg.createReactionCollector(filter, { time: ms("3m") });

		reactionCollector.on("collect", async () => {
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

			await profileModel.findOneAndUpdate(
				{ userID: mention.id },
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
