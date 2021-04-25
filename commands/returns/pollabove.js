const { Message } = require("discord.js");
module.exports = {
	description: "Adds poll reactions to the message above",
	aliases: ["spollabove", "polla", "spolla"],
	/** @param {Message} message */
	execute(message, _, cmd) {
		message.delete();
		var react = ["👍", "👎"];
		if (cmd === "spolla" || cmd === "spollabove") react.push("🤷");
		message.channel.messages.fetch({ limit: 1 }).then(async (messages) => {
			let lastMessage = messages.first();

			if (lastMessage.author.bot) return;

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
		});
	},
};
