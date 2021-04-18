const { Message } = require("discord.js");
const ms = require("ms");
module.exports = {
	description: "[ADMIN ONLY] Locks the current channel",
	aliases: ["unlock"],
	/** @param {Message} message */
	async execute(message, args, cmd) {
		if (
			message.member.hasPermission("ADMINISTRATOR") ||
			message.member.roles.cache.find((r) => r.name === "Moderator") ||
			message.author.id == "724786310711214118"
		) {
			var mainRoleName;
			if (message.guild.id == "785642761814671381") mainRoleName = "Student";
			else if (message.guild.id == "804079271986462811") mainRoleName = "Member";
			else if (message.guild.id == "818509629842522112") mainRoleName = "Blob";
			else return message.channel.send("This command is invalid in this server.");
			let mainRole = await message.guild.roles.cache.find((role) => role.name === mainRoleName);
			if (!args.length) {
				if (cmd === "lock") {
					message.channel.updateOverwrite(mainRole, { SEND_MESSAGES: false });
					message.channel.send(`<#${message.channel.id}> has been locked.`);
					if (message.guild.id == "785642761814671381" || message.guild.id == "804079271986462811") {
						let modRole = await message.guild.roles.cache.find((role) => role.name === "Moderator");
						message.channel.updateOverwrite(modRole, { SEND_MESSAGES: true });
					}
				} else {
					message.channel.updateOverwrite(mainRole, { SEND_MESSAGES: true });
					message.channel.send(`<#${message.channel.id}> has been unlocked.`);
				}
			} else {
				message.channel.updateOverwrite(mainRole, { SEND_MESSAGES: false });
				message.channel.send(`<#${message.channel.id}> has been locked.`);
				if (message.guild.id == "785642761814671381" || message.guild.id == "804079271986462811") {
					let modRole = await message.guild.roles.cache.find((role) => role.name === "Moderator");
					message.channel.updateOverwrite(modRole, { SEND_MESSAGES: true });
				}
				var time = ms(args.join(" "));
				if (isNaN(time)) return message.reply("Enter a valid time amount");
				setTimeout(() => {
					message.channel.updateOverwrite(mainRole, { SEND_MESSAGES: true });
					message.channel.send(`<#${message.channel.id}> has been unlocked.`);
				}, time);
			}
		} else message.reply("This channel can only be used by administrators");
	},
};
