const { Message, Client, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Quickly kick a member from the server",
	usage: "!kick <@user>",
	/**
	 * @param {Message} message
	 * @param {Client} client
	 */
	execute(message, _0, _1, client) {
		if (!message.member.hasPermission("KICK_MEMBERS"))
			return "You don't have the correct permissions to execute this command";

		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";

		const member = message.guild.members.cache.get(mention.id);
		member.kick(args.join(" ")).then((kicked) => {
			message.channel.send(
				new MessageEmbed()
					.setColor("RED")
					.setTitle("Kicked")
					.setDescription(`${kicked.user.tag} was kicked from the server.`)
					.setFooter(message.guild.name)
			);
		});
	},
};
