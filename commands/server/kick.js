const { Message, Client, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Quickly kick a member from the server",
	usage: "!kick <@user> (reason)",
	/**
	 * @param {Message} message
	 * @param {Client} client
	 */
	execute(message, args) {
		if (!message.member.hasPermission("KICK_MEMBERS"))
			return "You don't have the correct permissions to execute this command";

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
