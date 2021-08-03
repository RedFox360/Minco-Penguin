const { Message } = require("discord.js");

module.exports = {
	description: "Put the server on lockdown",
	aliases: ["end-lockdown"],
	permissions: ["ADMINISTRATOR"],
	/** @param {Message} message */
	run(message, _0, cmd) {
		const SEND_MESSAGES = cmd === "lockdown" ? false : true;
		let everyone = serverData.mainRole ?? message.guild.roles.everyone;
		let modRole = message.guild.roles.cache.get(serverData.modRole);
		let muteRole = message.guild.roles.cache.get(serverData.muteRole);
		message.guild.channels.cache.array().forEach((channel) => {
			if (
				channel.name.includes("announcements") ||
				channel.parent?.name.toLowerCase().includes("info") ||
				channel.name.includes("broadcast") ||
				channel.permissionsFor(message.guild.roles.everyone).has("VIEW_CHANNEL", false)
			)
				return;
			channel.updateOverwrite(everyone, {
				SEND_MESSAGES,
			});
			if (modRole)
				channel.updateOverwrite(modRole, {
					SEND_MESSAGES,
				});
			if (muteRole)
				channel.updateOverwrite(muteRole, {
					SEND_MESSAGES: false,
				});
		});
		if (cmd === "lockdown") {
			message.channel.send(`🔒 ${message.guild.name} has been put on lockdown`);
		} else {
			message.channel.send(`✅ ${message.guild.name} has been unlocked`);
		}
	},
};
