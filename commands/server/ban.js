const { Message, Client, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Quickly ban a member from the server",
	usage: "!ban <@user>",
	/**
	 * @param {Message} message
	 * @param {Client} client
	 */
	execute(message, _0, _1, client) {
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return "You don't have the correct permissions to execute this command";

		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";

		const member = message.guild.members.cache.get(mention.id);
		if (!member) return "That member isn't in the server";

		args.shift();
		member.ban(args.join(" ")).then((kicked) => {
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
