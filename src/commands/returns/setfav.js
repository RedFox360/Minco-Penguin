const { default: profileModel } = require("../../models/profileSchema");

module.exports = {
	description: "Set your favorite animal, color, and food",
	usage: "!setfav <color/animal/food> <fav object>",
	async run(message, args, _0, _1, profileData) {
		if (!args.length) {
			return "Valid usage: !setfav <animal/color/food> <favorite object>";
		}
		let first = args[0].toLowerCase();
		args.shift();
		let favObj = args.join(" ");
		if (first == "animal") {
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
		} else if (first == "color") {
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
		} else if (first == "food") {
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
		message.channel.send(`Favorite ${first} set to ${favObj}`);
	},
};
