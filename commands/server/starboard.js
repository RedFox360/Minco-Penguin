const serverModel = require("../../models/serverSchema");
module.exports = {
	description:
		"Set the starboard channel of a server (when someone reacts to a message with a star it shows up in this channel) Default star amount: 2",
	usage: "!starboard <#channel> (star amount)",
	async run(message, args) {
		const channel = message.mentions.channels.first();
		if (!channel) return "Mention a valid channel";
		const starAmount = parseInt(args[1]) || 2;

		await serverModel.findOneAndUpdate(
			{ serverID: message.guild.id },
			{
				starboard: {
					channelID: channel.id,
					starAmount,
				},
			}
		);

		message.channel.send(`Starboard channel set to <#${channel.id}>`);
	},
};
