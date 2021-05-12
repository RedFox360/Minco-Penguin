const profileModel = require("../../models/profileSchema");
module.exports = {
	aliases: ["admindivorce"],
	description:
		"Divorce your spouse.\nThis requires a fee of 150 Minco Dollars. Your Minco Dollar money totals will be added and split between you.",
	async execute(message, _0, cmd, _1, profileData) {
		if (message.author.id == "724786310711214118" && cmd === "admindivorce") {
			await profileModel.findOneAndUpdate(
				{
					userID: profileData.spouse,
				},
				{
					spouse: null,
				}
			);
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					spouse: null,
				}
			);

			message.channel.send("You have divorced!");
		}
	},
};
