const Discord = require("discord.js");
const ms = require("ms");
module.exports = {
	aliases: ["unmute"],
	description: "[ADMIN ONLY] Mutes a member",
	usage: "!mute <@user> <ms> <reason>",
	/**
	 * @param {Discord.Message} message
	 * @param {Discord.Client} client
	 */
	async execute(message, args, cmd) {
		var roles;
		if (message.guild.id == "785642761814671381") roles = ["Student", "Muted"];
		else if (message.guild.id == "804079271986462811") roles = ["Member", "Muted"];
		else if (message.guild.id == "818509629842522112") roles = ["Blob", "Muted"];
		else if (message.guild.id == "835983158208888852") roles = ["People", "Muted"];
		else return message.channel.send("The mute command is invalid in this server");
		if (
			message.member.hasPermission("MANAGE_CHANNELS") ||
			message.member.roles.cache.find((r) => r.name === "Moderator") ||
			message.member.hasPermission("MANAGE_ROLES") ||
			message.author.id == "802668636795830292"
		) {
			const target = message.mentions.users.first();
			if (!target) return message.channel.send("Mention a valid user");
			let mainRole = await message.guild.roles.cache.find((role) => role.name === roles[0]);
			let muteRole = await message.guild.roles.cache.find((role) => role.name === roles[1]);
			let memberTarget = await message.guild.members.cache.get(target.id);
			if (memberTarget.bot) return "Bots cannot be muted";
			if (
				memberTarget.hasPermission("ADMINISTRATOR") ||
				memberTarget.hasPermission("MANAGE_CHANNELS") ||
				memberTarget.roles.cache.find((r) => r.name === "Moderator") ||
				memberTarget.id == "724786310711214118"
			)
				return `<@${memberTarget.id}> cannot be muted`;
			var description = `<@${memberTarget.user.id}> has been muted`;
			if (args[1]) description += ` for ${args[1]}`;
			let muteEmbed = new Discord.MessageEmbed()
				.setColor("#F04747")
				.setTitle("Mute Warning")
				.setDescription(description)
				.setFooter(message.guild.name)
				.setAuthor(memberTarget.user.username)
				.setThumbnail(memberTarget.user.avatarURL());
			if (cmd === "mute") {
				memberTarget.roles.remove(mainRole.id);
				memberTarget.roles.add(muteRole.id);
				message.channel.send(muteEmbed);
				if (!args[1]) return;
				setTimeout(() => {
					memberTarget.roles.remove(muteRole.id);
					memberTarget.roles.add(mainRole.id);
					message.channel.send(`<@${memberTarget.user.id}> has been unmuted.`);
				}, ms(args[1]));
			} else if (cmd === "unmute") {
				memberTarget.roles.remove(muteRole.id);
				memberTarget.roles.add(mainRole.id);
				message.channel.send(`<@${memberTarget.user.id}> has been unmuted.`);
				return;
			}
		} else return message.channel.send("You don't have the right permissions to execute this command.");
	},
};
