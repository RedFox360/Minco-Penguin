const { Message } = require("discord.js");
module.exports = {
	description: "A magic 8 ball in Discord",
	cooldown: 4,
	usage: "!magic8ball <Question>",
	aliases: ["8b", "magic8b", "8ball"],
	/** @param {Message} message */
	execute(message, args) {
		if (args.join(" ").replace(" ", "").toLowerCase().includes("crush"))
			return message.channel.send("Stop asking questions about crushes!");
		let answers = [
			"Yes",
			"No",
			"I am not completely sure",
			"It is decidedly so",
			"OBVIOUSLY",
			"OBVIOUSLY No",
			"Doubtful",
			"Undoubtedly",
			"SERIOUSLY? NO",
			"Ya think so?",
			"Ofc",
			"Why did you even ask that?",
			"Nah",
			"Meh",
			"No question!",
			"Sorry, I was confunded. Try again.",
			"Of course!!!!",
			"Definitely",
			"...No",
			"Probably not.",
			"eh",
			"Are you kidding me? Definitely not.",
			"Really?",
			"Ya think so?",
			"Totally!",
			"YES",
			"YESSSS",
			"Yea",
			"Seriously? YES",
			"Yes, DUH",
		];
		let random = Math.floor(Math.random() * answers.length);
		var noPhrases = ["no", "doubtful", "nah"];
		var yesPhrases = ["no question"];
		var color = "🟢";
		for (let phrase of noPhrases) {
			if (answers[random].toLowerCase().includes(phrase)) color = "🔴";
		}
		for (let phrase of yesPhrases) {
			if (answers[random].toLowerCase().includes(phrase)) color = "🟢";
		}
		message.channel.send(`:8ball: | ${color} **${answers[random]}**\n${message.author.toString()} asks: *${args.join(" ")}*`);
	},
};
