import Discord from "discord.js";
import serverModel from "../models/serverSchema";
export default async (
	guild: Discord.Guild,
	user: Discord.User,
	client: Discord.Client
) => {
	if (user.bot) return;
	let serverData = await serverModel.findOneAndUpdate(
		{ serverID: guild.id },
		{ $inc: { memberCount: -1 } },
		{ new: true }
	);
	if (serverData.silenceBans) return;
	let banEmbed = new Discord.MessageEmbed()
		.setColor("#F75853") // red
		.setTitle("Banned")
		.setDescription(
			`${user.tag} flew too close to the sun and was banned from ${guild.name}.`
		);
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: guild.systemChannel;
	(channel as Discord.TextChannel).send({ embeds: [banEmbed] });
	user.send(`${user.tag}, you were banned from ${guild.name}.`);
};
