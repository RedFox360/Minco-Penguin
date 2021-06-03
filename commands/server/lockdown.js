const { Message } = require("discord.js");

module.exports = {
	description: "Put the server on lockdown",
	aliases: ["end-lockdown"],
	/** @param {Message} message */
	execute(message, _0, cmd) {
		if (message.member.hasPermission("ADMINISTRATOR")) {
			const SEND_MESSAGES = cmd === "lockdown" ? false : true;
			let modRole = message.guild.roles.cache.find((role) => role.name === "Moderator");
			let muteRole = message.guild.roles.cache.find((role) => role.name === "Muted");
			message.guild.channels.cache.array().forEach((channel) => {
				if (
					channel.name.includes("announcements") ||
					channel.parent.name.toLowerCase().includes("info") ||
					channel.name.includes("broadcast")
				)
					return;
				channel.updateOverwrite(message.guild.roles.everyone, {
					SEND_MESSAGES,
				});
				if (modRole)
					channel.updateOverwrite(modRole, {
						SEND_MESSAGES,
					});
				if (muteRole)
					channel.updateOverwrite(muteRole, {
						SEND_MESSAGES,
					});
			});
			if (cmd === "lockdown") {
				message.channel.send(`🔒 ${message.guild.name} has been put on lockdown`);
			} else {
				message.channel.send(`✅ ${message.guild.name} has been unlocked`);
			}
		} else {
			return "This command can only be used by admins";
		}
	},
};
