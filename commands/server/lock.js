const { Message } = require("discord.js");
const ms = require("ms");
module.exports = {
	description: "Locks/unlocks the current channel",
	usage: "!lock/unlock (ms)",
	aliases: ["unlock"],
	/** @param {Message} message */
	execute(message, args, cmd) {
		if (!message.member.hasPermission("MANAGE_CHANNELS")) return "You don't have the correct permissions to execute this command";
		var SEND_MESSAGES = cmd === "unlock";
		message.channel.updateOverwrite(message.guild.roles.everyone, {
			SEND_MESSAGES,
		});
		let modRole = message.guild.roles.cache.find((role) => role.name === "Moderator");
		let muteRole = message.guild.roles.cache.find((role) => role.name === "Muted");
		if (modRole) {
			message.channel.updateOverwrite(modRole, {
				SEND_MESSAGES: true,
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
		if (args.length && cmd === "lock") {
			const time = ms(args.join(" "));
			if (!time) return "Enter a valid time";
			setTimeout(() => {
				message.channel.updateOverwrite(message.guild.roles.everyone, {
					SEND_MESSAGES: true,
				});
				message.channel.send(unlockMessage);
			}, time);
		}
	},
};
