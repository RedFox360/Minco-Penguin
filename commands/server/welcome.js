const serverModel = require("../../models/serverSchema");
module.exports = {
	description: "Sets the welcome channel",
	usage: "!welcome <channel>",
	permissions: ["MANAGE_GUILD"],
	async execute(message) {
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
	},
};
