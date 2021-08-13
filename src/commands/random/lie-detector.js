const { Message } = require("discord.js");
module.exports = {
	aliases: ["lied", "ld"],
	description: "sends a is lying/not lying message",
	usage: "!ld <Question>",
	/** @param {Message} message */
	run(message, args) {
		if (!args.length) return "Enter a question";
		let name = message.authorName();
		let randomL = [
			`${name} is lying!`,
			`${name} is telling the truth!`,
			"hmmmm... I need more info!",
			`I think ${name} is telling the truth`,
			`${name} is DEFINITELY lying.`,
		];
		let randomInt = Math.floor(Math.random() * randomL.length);
		let response = randomL[randomInt];
		let color = response.includes("lying") ? "🔴" : "🟢";
		if (response.includes("info")) color = "🟡";
		message.channel.send(`${color} Lie Detector: **${response}**`);
	},
};
