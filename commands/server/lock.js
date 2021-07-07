const { Message } = require("discord.js");
const ms = require("ms");
module.exports = {
	description: "Locks/unlocks the current channel",
	usage: "!lock/unlock (ms)",
	aliases: ["unlock"],
	permissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
	/** @param {Message} message */
	execute(message, args, cmd, _0, _1, serverData) {
		var SEND_MESSAGES = cmd === "unlock";
		message.channel.updateOverwrite(message.guild.roles.everyone, {
			SEND_MESSAGES,
		});
		let everyone = serverData.mainRole ?? message.guild.roles.everyone;
		let modRole = message.guild.roles.cache.get(serverData.modRole);
		let muteRole = message.guild.roles.cache.get(serverData.muteRole);
		let modMessages = true;
		if (args[0] == "full" && cmd === "lock") modMessages = false;
		if (modRole) {
			message.channel.updateOverwrite(modRole, {
				SEND_MESSAGES: modMessages,
			});
		}
		if (muteRole) {
			message.channel.updateOverwrite(muteRole, {
				SEND_MESSAGES: false,
			});
		}
		const unlockMessage = `✅ <#${message.channel.id}> has been unlocked`;
		const lockMessage = `🔒 <#${message.channel.id}> has been locked`;
		message.channel.send(cmd === "unlock" ? unlockMessage : lockMessage);
		if (args[0] && cmd === "lock") {
			let time = ms(args[0]);
			if (!time) time = ms(args[1]);
			if (!time) return;
			setTimeout(() => {
				message.channel.updateOverwrite(everyone, {
					SEND_MESSAGES: true,
				});
				message.channel.send(unlockMessage);
			}, time);
		}
	},
};
