const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
module.exports = {
	description: "Use your tomato! Get between 2 and 6 Minco Dollars",
	cooldown: 90,
	async execute(message, args, _1, _2, profileData) {
		if (args[0] == "tomato") {
			if (!profileData.inventory.includes("04")) return "You don't have a tomato!";
			let numberEcon = randomInt(2, 6);
			if (randomInt(0, 900) == 0) {
				message.channel.send("Wow! The Minco Dice have decided you will win **100** Minco Dollars!");
				await profileModel.findOneAndUpdate(
					{
						userID: message.author.id,
					},
					{
						$inc: {
							mincoDollars: 100,
						},
						$pull: {
							inventory: "04",
						},
					}
				);
				return;
			}
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$inc: {
						mincoDollars: numberEcon,
					},
					$pull: {
						inventory: "04",
					},
				}
			);
			message.channel.send(`You ate your fresh tomato and won ${numberEcon} Minco Dollars!`);
		} else if (args[0] == "egg") {
			if (!profileData.inventory.some((v) => v.startsWith("11"))) return "You don't have an egg!";
			const eggValue = (() => {
				for (const value of profileData.inventory) {
					if (value.startsWith("11")) return value;
				}
			})();
			let numberEcon;
			if (value == "11") {
				numberEcon = randomInt(5, 12);
			} else if (value == "11-0") {
				// boiled egg
				numberEcon = randomInt(10, 16);
			} else if (value == "11-1") {
				// scrambled egg
				numberEcon = randomInt(9, 17);
			} else if (value == "11-2") {
				// omelette
				numberEcon = randomInt(10, 17);
			}
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$inc: {
						mincoDollars: numberEcon,
					},
					$pull: {
						inventory: eggValue,
					},
				}
			);
			const eggName = (() => {
				if (eggValue == "11") return "Raw Egg";
				if (eggValue == "11-0") return "Boiled Egg";
				if (eggValue == "11-1") return "Scrambled Egg";
				if (eggValue == "11-2") return "Omelette";
			})();
			message.channel.send(`You ate your ${eggName} and won ${numberEcon} Minco Dollasr!`);
		}
	},
};
