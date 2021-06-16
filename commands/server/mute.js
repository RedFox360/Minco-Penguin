const serverModel = require("../../models/serverSchema");
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
		const { muteRole, mainRole } = await serverModel.findOne({ serverID: message.guild.id });
		if (!muteRole) return "This server doesn't have a mute role";
		if (!mainRole) return "This server doesn't have a main role";
		if (
			message.member.hasPermission("MANAGE_CHANNELS") ||
			message.member.roles.cache.find((r) => r.name === "Moderator") ||
			message.member.hasPermission("MANAGE_ROLES") ||
			message.author.id == "802668636795830292"
		) {
			let memberTarget = message.mentions.members.first();
			if (!memberTarget) return "Mention a valid user";
			if (memberTarget.user.bot) return "Bots cannot be muted";
			if (
				memberTarget.hasPermission("ADMINISTRATOR") ||
				memberTarget.hasPermission("MANAGE_CHANNELS") ||
				memberTarget.roles.cache.find((r) => r.name === "Moderator") ||
				memberTarget.id == "724786310711214118"
			)
				return `<@${memberTarget.id}> cannot be muted`;
			let description = `<@${memberTarget.user.id}> has been muted`;
			if (args[1]) description += ` for ${args[1]}`;
			let muteEmbed = new Discord.MessageEmbed()
				.setColor("#F04747")
				.setTitle("Mute Warning")
				.setDescription(description)
				.setFooter(message.guild.name)
				.setAuthor(memberTarget.user.username, memberTarget.user.avatarURL());
			if (cmd === "mute") {
				memberTarget.roles.remove(mainRole);
				memberTarget.roles.add(muteRole);
				message.channel.send(muteEmbed);
				if (!args[1]) return;
				setTimeout(() => {
					memberTarget.roles.remove(muteRole);
					memberTarget.roles.add(mainRole);
					message.channel.send(`<@${memberTarget.user.id}> has been unmuted.`);
				}, ms(args[1]));
			} else if (cmd === "unmute") {
				memberTarget.roles.remove(muteRole);
				memberTarget.roles.add(mainRole);
				return `<@${memberTarget.user.id}> has been unmuted.`;
			}
		} else return "You don't have the right permissions to execute this command.";
	},
};
