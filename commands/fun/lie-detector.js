const { Message } = require("discord.js");
module.exports = {
	aliases: ["lied", "ld"],
	description: "Credit to Aiden for the idea : sends a is lying/not lying message",
	usage: "!ld <Question>",
	/** @param {Message} message */
	execute(message, args) {
		let name = message.member.nickname || message.author.username;
		let randomL = [
			`${name} is lying!`,
			`${name} is telling the truth!`,
			"hmmmm... I need more info!",
			`I think ${name} is telling the truth`,
			`${name} is DEFINITELY lying.`,
		];
		let randomInt = Math.floor(Math.random() * randomL.length);
		var response = randomL[randomInt];
		var color = response.includes("lying") ? "🔴" : "🟢";
		if (response.includes("info")) color = "🟡";
		message.channel.send(`${color} Lie Detector: ${response}\n${message.author.toString()} asks: *${args.join(" ")}*`);
	},
};
