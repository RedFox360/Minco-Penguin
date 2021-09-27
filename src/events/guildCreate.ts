import { Guild, Client, MessageEmbed } from "discord.js";
import serverModel from "../models/serverSchema";
export default async (guild: Guild, client: Client) => {
	let members = await guild.members.fetch();
	let memberCount = members.filter((member) => !member.user.bot).size;
	await serverModel.create({
		serverID: guild.id,
		bannedPeople: [],
		prefixes: ["!", "###", "minco "],
		memberCount,
	});
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: "BOT_ADD",
	});
	fetchedLogs.entries.first().executor.send({
		embeds: [
			new MessageEmbed()
				.setColor("GREEN")
				.setTitle("Thanks for me to your server!")
				.setDescription(
					"Minco Penguin now has slash commands! Try using them by typing a slash (/)"
				),
		],
	});
};
