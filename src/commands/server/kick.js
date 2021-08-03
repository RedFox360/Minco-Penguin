const { Message, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Quickly kick a member from the server",
	usage: "!kick <@user> (reason)",
	permissions: ["KICK_MEMBERS"],
	/** @param {Message} message */
	run(message, args) {
		if (!message.guild) return;
		const member = message.mentions.members.first();
		if (!member) return "Mention a valid user in the server";

		args.shift();
		member.kick(args.join(" ")).then((kicked) => {
			message.channel.send(
				new MessageEmbed()
					.setColor("RED")
					.setTitle("Kicked")
					.setDescription(
						`${kicked.user.tag} was kicked from the server.\nReason: ${args.join(" ")}`
					)
					.setFooter(message.guild.name)
			);
		});
	},
};
