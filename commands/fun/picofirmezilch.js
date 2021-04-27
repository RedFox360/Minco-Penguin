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
		var userDigits = ["\\_", "\\_", "\\_", "\\_"];
		var zilches = [];
		var firmes = [];
		const updateEmbed = new MessageEmbed()
			.setAuthor(message.member.nickname || message.author.username)
			.setTitle("Pico Firme Zilch")
			.setColor("BLUE")
			.setThumbnail(message.author.avatarURL())
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
			if (isNaN(parseInt(response.content))) return message.channel.send("Terminating...");
			place = parseInt(response.content);
			setTimeout(() => {
				placeMessage.delete();
				response.delete();
			}, 2200);
			let number_at_place = digits[place - 1];

			const digitMessage = await message.channel.send("Guess the digit: ");

			const response2 = await MessageCollector.asyncQuestion({
				botMessage: digitMessage,
				user: message.author.id,
			});
			let guess = response2.content;
			if (isNaN(parseInt(guess))) return message.channel.send("Terminating...");
			setTimeout(() => {
				digitMessage.delete();
				response2.delete();
			}, 2200);
			if (number_at_place == guess) {
				message.channel.send("Pico").then((m) => {
					setTimeout(() => m.delete(), 2200);
				});
				picos += 1;
				userDigits[place - 1] = number_at_place;
			} else if (digits.includes(guess) && !userDigits.includes(guess)) {
				message.channel.send("Firme").then((m) => {
					setTimeout(() => m.delete(), 2200);
				});
				firmes.push(guess + " not at " + place);
			} else {
				message.channel.send("Zilch").then((m) => {
					setTimeout(() => m.delete(), 2200);
				});
				zilches.push(guess);
			}
			updateEmbed.setDescription(
				`Guessed Digits: ${userDigits.join("")}\nZilches: ${zilches.join(", ")}\nFirmes: ${firmes.join(", ")}`
			);
			gameMsg.edit(updateEmbed);
			if (picos == 4) {
				message.channel.send("You won!");
				break;
			}
		}
	},
};
