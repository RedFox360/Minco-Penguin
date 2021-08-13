const { Message } = require("discord.js");
module.exports = {
	description: "A magic 8 ball in Discord",
	usage: "!magic8ball <Question>",
	aliases: ["8b", "magic8b", "8ball", "fruitball", "fball"],
	/** @param {Message} message */
	run(message, args, cmd) {
		if (!args.length) return "Enter a question";
		if (args.join(" ").toLowerCase().includes("crush"))
			return "Stop asking questions about crushes!";
		let yesAnswers = [
			"Yes",
			"OBVIOUSLY",
			"Undoubtedly",
			"Ofc",
			"No question!",
			"Of course!!!!",
			"Definitely",
			"Totally!",
			"YES",
			"YESSSS",
			"Yea",
			"Seriously? YES",
			"Yes, DUH",
		];
		let noAnswers = [
			"No",
			"OBVIOUSLY NO",
			"Doubtful",
			"SERIOUSLY? NO",
			"Nah",
			"...No",
			"Probably not.",
			"Are you kidding me? Definitely not.",
			"Why did you even ask that? No!",
		];
		let neutralAnswers = [
			"It is decidedly so",
			"I am not completely sure",
			"Why did you even ask that?",
			"Sorry, I was confunded. Try again.",
			"Meh",
			"eh",
			"Ya think so?",
			"Maybe",
		];
		let yesNoN = Math.floor(Math.random() * 11);
		let colors = cmd.startsWith("f") ? ["🍏", "🍍", "🍎"] : ["🟢", "🟡", "🔴"];
		let color, answer;
		if (yesNoN == 0) {
			// neutral
			color = colors[1];
			answer = neutralAnswers.rand();
		} else if (yesNoN <= 5) {
			// no
			color = colors[2];
			answer = noAnswers.rand();
		} else {
			// yes
			color = colors[0];
			answer = yesAnswers.rand();
		}
		message.channel.send(`:8ball: | ${color} **${answer}** | ${message.authorName()}`);
	},
};
