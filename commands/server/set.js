const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Set a birthday for your account",
	usage: "!set birthday <birthday: format: January 23, 2010>",
	async run(message, args) {
		if (args[0] == "birthday") {
			args.shift();
			let bday = args.join(" ");
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
