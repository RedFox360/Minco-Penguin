const { Message } = require("discord.js");
const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	name: "math",
	description: "Sends a math question for you to solve",
	usage: "!math <easy/medium/hard> <operation>",
	cooldown: ms("5m") / 1000,
	/** @param {Message} message */
	async execute(message, args) {
		var num1, num2, result, timeLimit;
		if (!args.length)
			return message.channel.send(
				"Invalid usage. Correct usage: !math <easy/medium/hard> <operation>\n(Divions is not a permitted operation)"
			);
		var oper;
		if (args[1] == "add" || args[1] == "addition" || args[1] == "+") oper = "+";
		else if (args[1] == "subtract" || args[1] == "minus" || args[1] == "-") oper = "-";
		else if (args[1] == "multiply" || args[1] == "mult" || args[1] == "x" || args[1] == "*") oper = "*";
		else
			return message.channel.send(
				"Invalid usage: Correct usage: !math <easy/medium/hard> <operation>\n(Division is not a permitted operation)"
			);
		if (args[0] == "easy") {
			timeLimit = 7;
			if (oper == "*") {
				num1 = random(5, 12);
				num2 = random(5, 12);
			} else {
				num1 = random(50, 250);
				num2 = random(100, 300);
			}
		} else if (args[0] == "medium") {
			timeLimit = 15;
			if (oper == "*") {
				num1 = random(12, 20);
				num2 = random(12, 20);
			} else {
				num1 = random(400, 800);
				num2 = random(400, 800);
			}
		} else {
			timeLimit = 25;
			if (oper == "*") {
				num1 = random(20, 45);
				num2 = random(20, 45);
			} else {
				num1 = random(600, 1200);
				num2 = random(600, 1200);
			}
		}
		if (oper == "+") result = `${num1 + num2}`;
		else if (oper == "-") result = `${num1 - num2}`;
		else if (oper == "*") result = `${num1 * num2}`;
		message.channel.send(`What is ${num1} ${oper} ${num2}?`);

		var time = 20;
		if (args[0] == "easy") time = 8;
		else if (args[0] == "medium") time = 14;
		const filter = (m) => m.author.id == message.author.id;
		time *= 1000;
		const collector = message.channel.createMessageCollector(filter, { time });
		var sendTimeOut = true;
		collector.on("collect", async (m) => {
			sendTimeOut = false;
			let guess = m.content;
			if (guess == result) {
				message.channel.send("Correct!");
				var amount;
				if (args[0] == "easy") {
					amount = 10;
				} else if (args[0] == "medium") {
					amount = 20;
				} else {
					amount = 40;
				}
				message.channel.send(`You won ${amount} Minco Dollars!`);
				await profileModel.findOneAndUpdate(
					{ userID: message.author.id },
					{
						$inc: {
							mincoDollars: amount,
						},
					}
				);
				return;
			} else {
				message.channel.send("Incorrect!");
			}
			collector.stop();
		});
		collector.on("end", (collected) => {
			if (sendTimeOut) return message.reply("Timed out!");
		});
	},
};

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
