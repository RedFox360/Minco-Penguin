const serverModel = require("../../models/serverSchema");
module.exports = {
	description:
		"Set the starboard channel of a server (when someone reacts to a message with a star it shows up in this channel) Default star amount: 2",
	usage: "!starboard <#channel> (star amount)",
	async execute(message, args) {
		const channel = message.mentions.channels.first();
		if (!channel) return "Mention a valid channel";

		await serverModel.findOneAndUpdate(
			{ serverID: message.guild.id },
			{
				starboard: {
					channel: channel.id,
					starAmount,
				},
			}
		);
	},
};
