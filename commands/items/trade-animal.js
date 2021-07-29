const profileModel = require("../../models/profileSchema");
const ms = require("ms");
const { animalExists, getAnimal, hasAnimal } = require("../../functions/animalFunctions");
const { Message } = require("discord.js");
module.exports = {
	description: "Trade your animals!",
	usage: "!trade-animal <@user> <animal> <price>",
	/** @param {Message} message */
	async run(message, args, _0, _1, profileData) {
		const mention = message.mentions.users.first();
		const animal = args[1];
		const price = parseInt(args[2]);
		const mentionProfile = await profileModel.findOne({ userID: mention.id });
		if (mentionProfile.zoo.length >= 15)
			return `<@${mention.id}> has reached the maximum amount of animals (15)`;
		if (!animal) return "Enter an animal";
		if (!mention) return "Mention a valid user";
		if (isNaN(price)) return "Enter a valid price";
		if (!animalExists(animal)) return "Enter a valid animal name";
		if (!hasAnimal(animal, profileData)) return "You don't have this animal!";
		const gAnimal = getAnimal(animal);

		const msg = await message.channel.send(
			`<@${mention.id}>, ${message.author.toString()} has offered to trade you their ${
				gAnimal.name
			} ${gAnimal.emoji} for ${price} MD. Accept by reacting with a ✅`
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
