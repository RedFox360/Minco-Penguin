const { Message } = require("discord.js");
const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
module.exports = {
	description: "Sends a math question for you to solve",
	usage: "!math <operation>",
	cooldown: "7m",
	/** @param {Message} message */
	async execute(message, args, _0, _1, profileData) {
		var num1, num2, result;
		if (!args.length)
			return "Invalid usage. Correct usage: !math <operation>\n(Division is not a permitted operation)";
		var oper;
		if (args[0] == "add" || args[0] == "addition" || args[0] == "+") oper = "+";
		else if (args[0] == "subtract" || args[0] == "minus" || args[0] == "-") oper = "-";
		else if (args[0] == "multiply" || args[0] == "mult" || args[0] == "x" || args[0] == "*")
			oper = "*";
		else
			return "Invalid usage: Correct usage: !math <operation>\n(Division is not a permitted operation)";
		if (oper == "*") {
			num1 = random(20, 30);
			num2 = random(15, 20);
		} else {
			num1 = random(1600, 2400);
			num2 = random(1000, 2000);
		}
		if (oper == "+") result = num1 + num2;
		else if (oper == "-") result = num1 - num2;
		else if (oper == "*") result = num1 * num2;
		message.channel.send(`${message.author.toString()}, what is ${num1} ${oper} ${num2}?`);
		const filter = (m) => m.author.id == message.author.id;
		const collector = message.channel.createMessageCollector(filter, { time: 20000 });
		var sendTimeOut = true;
		let amount = randomInt(10, 20);
		if (profileData.spouse != null) {
			// is married
			amount = randomInt(10, 25);
		} else if (profileData.inventory.includes("07")) {
			// has a bear
			amount = randomInt(10, 23);
		}
		collector.on("collect", async (m) => {
			sendTimeOut = false;
			let guess = m.content.replace(/,/g, "").replace(/ +/, "");
			if (isNaN(parseInt(guess))) sendTimeOut = true;
			if (parseInt(guess) == result) {
				message.channel.send("Correct!");
				message.channel.send(`You won ${amount} Minco Dollars!`);
				await profileModel.findOneAndUpdate(
					{ userID: message.author.id },
					{
						$inc: {
							mincoDollars: amount,
						},
					}
				);
			} else {
				message.channel.send(`Incorrect! The correct answer is ${result}`);
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
