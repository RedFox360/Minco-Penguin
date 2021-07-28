const profileModel = require("../../models/profileSchema");
const { Message } = require("discord.js");
module.exports = {
	aliases: ["admindivorce"],
	description: "Divorce your spouse.",
	/** @param {Message} message */
	async execute(message, args, _0, _1, profileData) {
		const userSpouse = profileData.spouse;
		if (!userSpouse) return "You aren't married!";

		await profileModel.findOneAndUpdate(
			{ userID: userSpouse },
			{
				spouse: null,
			}
		);
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				spouse: null,
			}
		);

		message.channel.send(`You succesfully divorced <@${userSpouse}>`);
	},
};
