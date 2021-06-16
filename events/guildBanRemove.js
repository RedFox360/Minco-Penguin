const serverModel = require("../models/serverSchema");
module.exports = (_0, guild, user) => {
	const serverData = await serverModel.findOne({ serverID: guild.id });
	if (serverData.silenceBans) return;
	user.send(`${user.tag}, you were banned from ${guild.name}.`);
};
