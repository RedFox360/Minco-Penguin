const { Message, Client, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Quickly ban a member from the server",
	usage: "!ban (days) <@user> (reason)",
	permission: ["BAN_MEMBERS"],
	/**
	 * @param {Message} message
	 * @param {Client} client
	 */
	execute(message, args) {
		if (!message.guild) return;
		const days = parseInt(args[0]);
		const member = message.mentions.members.first();
		if (!member) return "Mention a valid user in the server";

		args.shift();
		if (!isNaN(days)) args.shift();
		const options = {
			reason: args.join(" "),
		};
		if (!isNaN(days)) options[days] = days;
		member.ban(options).then((kicked) => {
			message.channel.send(
				new MessageEmbed()
					.setColor("RED")
					.setTitle("Banned")
					.setDescription(
						`${kicked.user.tag} was banned from the server.\nReason: ${args.join(" ")}`
					)
					.setFooter(message.guild.name)
			);
		});
	},
};
