const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Set a birthday for your account",
	usage: "!set birthday <birthday: format: January 23, 2010>",
	async execute(message, args) {
		if (args[0] == "birthday") {
			let bday = "";
			for (let i = 1; i < args.length; i++) {
				bday += args[i] + " ";
			}
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					birthday: bday,
				}
			);
			message.channel.send(`Birthday set to ${bday}`);
		}
	},
};
