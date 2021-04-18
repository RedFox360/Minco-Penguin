const { Message } = require("discord.js");
const profileModel = require("../../models/profileSchema");

module.exports = {
	aliases: ["bday", "b"],
	cooldown: 3,
	description: "View everyone's birthday. Usage: birthday <name>",
	usage: "!birthday <@user>",
	/** @param {Message} message */
	async execute(message, args) {
		if (!args.length) return "You didn't provide any arguments.";
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";
		try {
			const profile = await profileModel.findOne({ userID: mention.id });
			message.channel.send(profile.birthday);
		} catch (err) {
			message.channel.send("This user's birthday has not been added to the database");
		}
	},
};
