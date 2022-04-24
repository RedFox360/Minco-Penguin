import Discord from 'discord.js';
import serverModel from '../models/serverSchema';
export default async ({
	user,
	guild,
	reason,
	client
}: Discord.GuildBan) => {
	if (user.bot) return;
	const serverData = await serverModel.findOneAndUpdate(
		{ serverID: guild.id },
		{ $inc: { memberCount: -1 } },
		{ new: true }
	);
	if (serverData.silenceBans) return;
	let desc = `${user.tag} flew too close to the sun and was banned from ${guild.name}.`;
	if (reason) desc += `\nReason: *${reason}*`;
	const banEmbed = new Discord.MessageEmbed()
		.setColor('#F75853') // red
		.setTitle('Banned')
		.setDescription(desc);
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: guild.systemChannel;
	if (!channel) return;
	(channel as Discord.TextChannel).send({ embeds: [banEmbed] });
	let userDesc = `${user.tag}, you were banned from ${guild.name}.`;
	if (reason) userDesc += `\nReason: *${reason}*`;
	try {
		await user.send(userDesc);
	} catch (err) {
		// dm not open
	}
};
