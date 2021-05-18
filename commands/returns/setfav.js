const profileModel = require("../../models/profileSchema");

module.exports = {
	description: "Set your favorite animal, color, and food",
	usage: "!setfav <color/animal/food> <fav object>",
	async execute(message, args, _0, _1, profileData) {
		if (!args.length) {
			return "Valid usage: !setfav <animal/color/food> <favorite object>";
		}
		args.shift();
		let favObj = args.join(" ");
		if (args[0] == "animal") {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					favs: {
						food: profileData.favs.food,
						color: profileData.favs.color,
						animal: favObj,
					},
				}
			);
		} else if (args[0] == "color") {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					favs: {
						food: profileData.favs.food,
						color: favObj,
						animal: profileData.favs.animal,
					},
				}
			);
		} else if (args[0] == "food") {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					favs: {
						food: favObj,
						color: profileData.favs.color,
						animal: profileData.favs.animal,
					},
				}
			);
		} else {
			return "Valid usage: !setfav <animal/color/food> <favorite object>";
		}
		message.channel.send(`Favorite ${args[0]} set to ${favObj}`);
	},
};
