const { Message } = require("discord.js");
module.exports = {
	description: "Say with Candy Bear!",
	usage: "!sayb <words>",
	/** @param {Message} message */
	execute(message, args) {
		if (!args.length) return "You didn't provide any arguments.";
		message.delete();
		message.channel.send(`>say ${args.join(" ")}`).then((msg) => {
			msg.delete();
		});
	},
};
