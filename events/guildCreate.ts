import { Guild } from "discord.js";

import serverModel from "../models/serverSchema";

module.exports = async (_, guild: Guild) => {
	let serverProfile = await serverModel.create({
		serverID: guild.id,
		bannedPeople: [],
		prefixes: ["!", "###", "minco "],
	});
	serverProfile.save();
};
