import Discord from "discord.js";
import serverModel from "../models/serverSchema";

export default async (
	reaction: Discord.MessageReaction,
	_,
	client: Discord.Client
) => {
	if (!reaction) return;
	const { message } = reaction;
	if (!message) return;
	if (!message.guild) return;
	if (reaction.emoji.name !== "⭐" && reaction.emoji.name !== "🌟") return;
	const serverData = await serverModel.findOne({ serverID: message.guild.id });
	const { channelID, starAmount } = serverData.starboard;

	if (!channelID) return;
	if (reaction.count != starAmount) return;
	if (message.author.bot) return;

	const channel = await client.channels.fetch(channelID);
	const name = (message.channel as any).name;
	const nameFormat = name ? `#${name}` : message.id;
	const embed = new Discord.MessageEmbed()
		.setAuthor(
			message.member.displayName,
			message.author.avatarURL({ dynamic: true }),
			message.url
		)
		.setDescription(message.content)
		.setFooter(`⭐️  | ${nameFormat}`)
		.setTimestamp(message.createdTimestamp)
		.setColor("#F7DC6F"); // yellow

	(channel as Discord.TextChannel).send({
		embeds: [embed],
		files: Array.from(message.attachments.values()),
	});
};
