const Discord = require("discord.js");

/**
 * @param {Discord.Client} client
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
module.exports = async (client, oldState, newState) => {
	if (newState.guild.id === "838951077012832306") {
		const role = await newState.guild.roles.cache.find("838959532252201051");
		newState.member.roles.add(role);
	}
};
