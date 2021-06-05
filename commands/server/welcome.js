const serverModel = require("../../models/serverSchema");
module.exports = {
	description: "Sets the welcome channel",
	usage: "!welcome <channel>",

	async execute(message) {
		if (message.member.hasPermission("MANAAGE_SERVER")) {
			const channel = message.mentions.channels.first();
			if (!channel) return "Mention a valid channel";

			await serverModel.findOneAndUpdate(
				{
					serverID: message.guild.id,
				},
				{
					welcomeChannel: channel.id,
				}
			);

			message.channel.send(`Welcome channel set to <#${channel.id}>`);
		} else {
			return "You don't have the correct permissions to execute this command";
		}
	},
};
