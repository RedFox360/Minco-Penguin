const ms = require("ms");
const { default: profileModel } = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
const prettyMs = require("pretty-ms");
const { MessageEmbed } = require("discord.js");
const dayLength = ms("1 day");
module.exports = {
	description: "Collect your daily reward!",
	async run(message, _0, _1, _2, profileData) {
		const now = Date.now();
		const lastUsedDaily = profileData.lastUsedDaily;
		if (lastUsedDaily && lastUsedDaily + dayLength > Date.now()) {
			const waitTime = dayLength - (now - lastUsedDaily);
			return `Please wait ${prettyMs(waitTime)} before using !daily again.`;
		}

		const dailyEmbed = new MessageEmbed()
			.setColor("ffa845")
			.setAuthor("Daily Reward", message.author.avatarURL());
		if (message.guild) dailyEmbed.setFooter(message.guild.name);
		let description = "";
		let upperLimit = 50;
		if (profileData.spouse != null) upperLimit = 65;
		else if (profileData.inventory.includes("07")) upperLimit = 57;
		const randomAmount = randomInt(25, upperLimit);

		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$inc: {
					mincoDollars: randomAmount,
				},
				lastUsedDaily: now,
			}
		);

		description += `You earned ${randomAmount} Minco Dollars!`;

		if (
			Math.floor(Math.random() * 4) == 0 &&
			!profileData.inventory.includes("05")
		) {
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$push: {
						inventory: "05",
					},
					candyAmount: 3,
				}
			);

			description += "\nYou also won a Candy :candy:!";
		}

		dailyEmbed.setDescription(description);

		message.channel.send(dailyEmbed);
	},
};
