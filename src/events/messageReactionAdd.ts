import Discord from "discord.js";
import serverModel from "../models/serverSchema";

export default async (
	reaction: Discord.MessageReaction,
	_,
	client: Discord.Client
) => {
	const { message } = reaction;
	if (!message.guild) return;
	if (reaction.emoji.name !== "⭐" && reaction.emoji.name !== "🌟") return;
	const serverData = await serverModel.findOne({ serverID: message.guild.id });
	const { channelID, starAmount } = serverData.starboard;

	if (!channelID) return;
	if (reaction.count != starAmount) return;
	if (message.author.bot) return;

	const channel = await client.channels.fetch(channelID);
	const embed = new Discord.MessageEmbed()
		.setAuthor(
			message.member.displayName,
			message.author.avatarURL(),
			message.url
		)
		.setDescription(message.content)
		.setFooter(`⭐️  | ${message.id}`)
		.setTimestamp(message.createdTimestamp)
		.setColor("#F7DC6F"); // yellow

	(channel as Discord.TextChannel).send({
		embeds: [embed],
		files: Array.from(message.attachments.values()),
	});
};
