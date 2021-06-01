const { Message, Util } = require("discord.js");
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
			let msg = Util.cleanContent(args.join(" "), message);
			channel.send(msg);
			message.react("✅");
		} else {
			message.channel.send(Util.cleanContent(args.join(" "), message));
		}
		if (cmd === "sayd") message.delete();
	},
};
