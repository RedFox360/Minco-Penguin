const { Client, MessageReaction, User, MessageEmbed } = require("discord.js");
const serverModel = require("../models/serverSchema");
/**
 * @param {Client} client
 * @param {MessageReaction} reaction
 * @param {User} user
 */
module.exports = async (client, reaction, user) => {
	const { message } = reaction;
	if (!message.guild) return;
	if (reaction.emoji.name !== "⭐" && reaction.emoji.name !== "🌟") return;
	const serverData = await serverModel.findOne({ serverID: message.guild.id });
	const { channelID, starAmount } = serverData.starboard;

	if (!channelID) return;
	if (reaction.count != starAmount) return;
	if (message.author.bot) return;

	const channel = await client.channels.fetch(channelID);
	const embed = new MessageEmbed()
		.setAuthor(message.member.displayName, message.author.avatarURL())
		.setDescription(message.content)
		.setFooter(`⭐️  | ${message.id}`)
		.setTimestamp(message.createdTimestamp)
		.setColor("#F7DC6F"); // yellow
	if (message.attachments) embed.attachFiles(message.attachments.array());

	channel.send(embed);
};
