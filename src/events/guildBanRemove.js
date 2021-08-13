const serverModel = require("../models/serverSchema");
module.exports = async (guild, user) => {
	if (user.bot) return;
	const serverData = await serverModel.findOneAndUpdate(
		{ serverID: guild.id },
		{ $inc: { memberCount: 1 } }
	);
	if (serverData.silenceBans) return;
	user.send(`${user.tag}, you were unbanned from ${guild.name}.`);
};
