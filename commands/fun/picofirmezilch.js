const { MessageCollector } = require("discord.js-collector");
const { randomInt } = require("mathjs");
const { Message, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Play pico firme zilch in Discord\n4 digit number",
	aliases: ["pfz"],
	/** @param {Message} message */
	async execute(message) {
		const memberName = message.member.nickname.toLowerCase() || message.author.username.toLowerCase();
		if (message.guild.channels.cache.find((c) => c.name === memberName)`c`)
			return message.channel.send("You already have an ongoing game. Type a non-number in that channel to end the game.");
		const channel = await message.guild.channels.create(memberName);
		channel.setParent(message.channel.parent);
		channel.updateOverwrite(message.guild.roles.everyone, {
			VIEW_CHANNEL: false,
		});
		channel.updateOverwrite(message.author, {
			VIEW_CHANNEL: true,
			SEND_MESSAGES: true,
		});
		message.channel.send(`Pico Firme Zilch game created in <#${channel.id}>`);
		var number = randomInt(1000, 10000);
		var digits = number.toString().split("");
		var userDigits = ["\\_", "\\_", "\\_", "\\_"];
		var zilches = [];
		var firmes = [];
		const updateEmbed = new MessageEmbed()
			.setTitle("Pico Firme Zilch")
			.setColor("BLUE")
			.setThumbnail(message.author.avatarURL())
			.setDescription("Guessed Digits: " + userDigits.join(""));
		const gameMsg = await channel.send(updateEmbed);
		while (true) {
			const placeMessage = await channel.send("Choose a place in the number (1-4): ");
			const response = await MessageCollector.asyncQuestion({
				botMessage: placeMessage,
				user: message.author.id,
			});
			let place;
			if (isNaN(parseInt(response.content))) {
				channel.send("Terminating...");
				channel.send("Deleting channel in 5 seconds...");
				setTimeout(() => channel.delete(), 5000);
				break;
			}
			place = parseInt(response.content);
			setTimeout(() => {
				placeMessage.delete();
				response.delete();
			}, 2200);
			let number_at_place = digits[place - 1];

			const digitMessage = await channel.send("Guess the digit: ");

			const response2 = await MessageCollector.asyncQuestion({
				botMessage: digitMessage,
				user: message.author.id,
			});
			let guess = response2.content;
			if (isNaN(parseInt(guess))) {
				channel.send("Terminating...");
				channel.send("Deleting channel in 5 seconds...");
				setTimeout(() => channel.delete(), 5000);
				break;
			}
			setTimeout(() => {
				digitMessage.delete();
				response2.delete();
			}, 2200);
			if (number_at_place == guess) {
				channel.send("Pico").then((m) => {
					setTimeout(() => m.delete(), 2200);
				});
				userDigits[place - 1] = number_at_place;
			} else if (digits.includes(guess) && !userDigits.includes(guess)) {
				channel.send("Firme").then((m) => {
					setTimeout(() => m.delete(), 2200);
				});
				firmes.push(guess + " not at " + place);
			} else {
				channel.send("Zilch").then((m) => {
					setTimeout(() => m.delete(), 2200);
				});
				if (!zilches.includes(guess)) zilches.push(guess);
			}
			updateEmbed.setDescription(
				`Guessed Digits: ${userDigits.join("")}\nZilches: ${zilches.join(", ")}\nFirmes: ${firmes.join(", ")}`
			);
			gameMsg.edit(updateEmbed);
			if (userDigits.every((user) => user !== "\\_")) {
				channel.send("You won!");
				channel.send("Deleting channel in 10 seconds...");
				setTimeout(() => channel.delete(), 10000);
				break;
			}
		}
	},
};
