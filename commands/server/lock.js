const { Message } = require("discord.js");
const ms = require("ms");
module.exports = {
	description: "Locks/unlocks the current channel",
	usage: "!lock/unlock (ms)",
	/** @param {Message} message */
	execute(message, args) {
		if (!message.member.hasPermission("MANAGE_CHANNELS") || !message.member.hasPermission("MANAGE_ROLES"))
			return "You don't have the correct permissions to execute this command";
		message.channel.updateOverwrite(message.guild.roles.everyone, {
			SEND_MESSAGES: false,
		});
		let modRole = message.guild.roles.cache.find((role) => role.name === "Moderator");
		if (modRole) {
			message.channel.updateOverwrite(modRole, {
				SEND_MESSAGES: true,
			});
		}
		message.channel.send(`🔒 <#${channel.id}> has been locked`);
		if (args.length) {
			const time = ms(args.join(" "));
			if (!time) return "Enter a valid time";
			setTimeout(() => {
				message.channel.updateOverwrite(message.guild.roles.everyone, {
					SEND_MESSAGES: true,
				});
				message.channel.send(`✅ <#${channel.id}> has been unlocked`);
			}, ms);
		}
	},
};
