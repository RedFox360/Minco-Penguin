const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
module.exports = {
	description: "Use your tomato! Get between 2 and 6 Minco Dollars",
	cooldown: 90,
	async run(message, args, _1, _2, profileData) {
		if (args[0] == "tomato") {
			if (!profileData.inventory.includes("04")) return "You don't have a tomato!";
			let numberEcon = randomInt(2, 6);
			if (randomInt(0, 900) == 0) {
				message.channel.send(
					"Wow! The Minco Dice have decided you will win **100** Minco Dollars!"
				);
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
			if (eggValue == "11") {
				numberEcon = randomInt(5, 9);
			} else if (eggValue == "11-0") {
				// boiled egg
				numberEcon = randomInt(12, 17);
			} else if (eggValue == "11-1") {
				// scrambled egg
				numberEcon = randomInt(13, 18);
			} else if (eggValue == "11-2") {
				// omelette
				numberEcon = randomInt(14, 20);
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
			message.channel.send(`You ate your ${eggName} and won ${numberEcon} Minco Dollars!`);
		} else if (args[0] == "banana") {
			if (!profileData.inventory.includes("12")) return "You don't have a banana!";
			let numberEcon = randomInt(5, 18);
			if (randomInt(0, 650) == 0) {
				message.channel.send("Wow! The Minco Dice have decided you will win **75** Minco Dollars!");
				await profileModel.findOneAndUpdate(
					{
						userID: message.author.id,
					},
					{
						$inc: {
							mincoDollars: 100,
						},
						$pull: {
							inventory: "12",
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
						inventory: "12",
					},
				}
			);
			message.channel.send(`You ate your banana and won ${numberEcon} Minco Dollars!`);
		}
	},
};
