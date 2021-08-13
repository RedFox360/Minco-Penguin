const { Guild, Client, MessageEmbed } = require("discord.js");
const serverModel = require("../models/serverSchema");
/**
 * @param {Guild} guild
 * @param {Client} client
 */
module.exports = async (client, guild) => {
	let members = await guild.members.fetch();
	let memberCount = members.filter((member) => !member.user.bot).size;
	let serverProfile = await serverModel.create({
		serverID: guild.id,
		bannedPeople: [],
		prefixes: ["!", "###", "minco "],
		memberCount,
	});
	serverProfile.save();
	const fetchedLogs = await guild.fetchAuditLogs({
		max: 1,
		type: "BOT_ADD",
	});
	const auditLog = fetchedLogs.entries.first();
	auditLog.executor.send(
		new MessageEmbed()
			.setColor("GREEN")
			.setAuthor(client.user.avatarURL(), "Minco Penguin")
			.setTitle("Thanks for me to your server!")
			.setDescription(
				"My default prefix is `!`. Use `!help server` to view all the admin commands!"
			)
	);
};