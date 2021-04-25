const { Message } = require("discord.js");
module.exports = {
	description: "Adds poll reactions to the message above",
	aliases: ["spollabove", "polla", "spolla"],
	/** @param {Message} message */
	async execute(message, _, cmd) {
		message.delete();
		var react = ["👍", "👎"];
		if (cmd === "spolla" || cmd === "spollabove") react.push("🤷");
		const lastMessage = message.channel.lastMessage;
		try {
			react.forEach(async (reaction) => {
				try {
					await lastMessage.react(reaction);
				} catch (err) {
					console.error(err);
					return;
				}
			});
		} catch (err) {
			console.error(err);
		}
	},
};
