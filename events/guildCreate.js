const { Guild } = require("discord.js");
const serverModel = require("../models/serverSchema");
/** @param {Guild} guild */
module.exports = async (_, guild) => {
	let serverProfile = await serverModel.create({
		serverID: guild.id,
		bannedPeople: [],
		prefixes: ["!", "###", "minco "],
	});
	serverProfile.save();
};
