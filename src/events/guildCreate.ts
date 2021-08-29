import { Guild, Client, MessageEmbed } from "discord.js";
import serverModel from "../models/serverSchema";
export default async (guild: Guild, client: Client) => {
	let members = await guild.members.fetch();
	let memberCount = members.filter((member) => !member.user.bot).size;
	let serverProfile = await serverModel.create({
		serverID: guild.id,
		bannedPeople: [],
		prefixes: ["!", "###", "minco "],
		memberCount,
		birthdays: new Map(),
	});
	serverProfile.save();
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: "BOT_ADD",
	});
	const auditLog = fetchedLogs.entries.first();
	auditLog.executor.send({
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
