const { MessageCollector } = require("discord.js-collector");
const { randomInt } = require("mathjs");
const { Message, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Play pico firme zilch in Discord\n4 digit number",
	aliases: ["pfz"],
	/** @param {Message} message */
	async execute(message) {
		var number = randomInt(1000, 10000);
		var digits = number.toString().split("");
		var userDigits = ["_", "_", "_", "_"];
		const updateEmbed = new MessageEmbed()
			.setAuthor(message.member.nickname || message.author.username)
			.setColor("Pico Firme Zilch")
			.setDescription("Guessed Digits: " + userDigits.join(""));
		const gameMsg = await message.channel.send(updateEmbed);
		var picos = 0;
		while (true) {
			const placeMessage = await message.channel.send("Choose a place in the number (1-4): ");
			const response = await MessageCollector.asyncQuestion({
				botMessage: placeMessage,
				user: message.author.id,
			});
			let place;
			try {
				place = parseInt(response.content);
			} catch (error) {
				message.channel.send("You must enter a number");
				message.channel.send("Terminating...");
				return;
			}
			setTimeout(() => {
				placeMessage.delete();
				response.delete();
			}, 5000);
			let number_at_place = digits[place - 1];

			const digitMessage = await message.channel.send("Guess the digit: ");

			const response2 = await MessageCollector.asyncQuestion({
				botMessage: digitMessage,
				user: message.author.id,
			});
			let guess = response2.content;
			setTimeout(() => {
				digitMessage.delete();
				response2.delete();
			}, 5000);
			if (number_at_place == guess) {
				message.channel.send("Pico");
				picos += 1;
				userDigits[place - 1] = number_at_place;
			} else if (digits.includes(guess) && !userDigits.includes(guess)) {
				message.channel.send("Firme");
			} else {
				message.channel.send("Zilch");
			}
			updateEmbed.setDescription("Guessed Digits: " + userDigits.join(""));
			gameMsg.edit(updateEmbed);
			if (picos == 4) {
				message.channel.send("You won!");
				break;
			}
		}
	},
};
