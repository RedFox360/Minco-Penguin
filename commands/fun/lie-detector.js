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
		var color = randomL[randomInt].includes("lying") ? "🔴" : "🟢";
		if (randomL[randomInt].includes("info")) color = "🟡";
		message.channel.send(`${color} Lie Detector: ${randomL[randomInt]}\n${message.author.toString()} asks: *${args.join(" ")}*`);
	},
};
