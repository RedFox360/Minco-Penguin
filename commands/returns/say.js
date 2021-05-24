const { Message } = require("discord.js");
module.exports = {
	description: "This is a say command for Minco Penguin",
	cooldown: 3,
	usage: "!say <words>",
	aliases: ["sayd"],
	/** @param {Message} message */
	execute(message, args, cmd) {
		if (!args.length) return "You didn't provide any arguments.";
		const channel = message.mentions.channels.first();
		if (channel) {
			args.shift();
			let msg = args.join(" ");
			channel.send(msg);
			message.react("✅");
		} else {
			message.channel.send(args.join(" "));
		}
		if (cmd === "sayd") message.delete();
	},
};
