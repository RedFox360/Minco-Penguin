const { Message } = require("discord.js");

module.exports = {
	description: "Put the server on lockdown",
	aliases: ["end-lockdown"],
	/** @param {Message} message */
	execute(message) {
		const SEND_MESSAGES = cmd === "lockdown" ? false : true;
		for (const channel of message.guild.channels.cache.array()) {
			if (channel.permissionsFor(message.guild.roles.everyone).has("SEND_MESSAGES", false)) {
				channel.updateOverwrite(message.guild.roles.everyone, {
					SEND_MESSAGES,
				});
			}
		}
		if (cmd === "lockdown") {
			message.channel.send(`🔒 ${message.guild.name} has been put on lockdown`);
		} else {
			message.channel.send(`✅ ${message.guild.name} has been unlocked`);
		}
	},
};
