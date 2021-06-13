const ms = require("ms");
const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
const prettyMs = require("pretty-ms");
const { MessageEmbed } = require("discord.js");
const dayLength = ms("1 day");
module.exports = {
	description: "Collect your daily reward!",
	async execute(message, _0, _1, _2, profileData) {
		const now = Date.now();
		const lastUsedDaily = profileData.lastUsedDaily;
		if (lastUsedDaily && lastUsedDaily + dayLength > Date.now()) {
			const waitTime = dayLength - (now - lastUsedDaily);
			return `Please wait ${prettyMs(waitTime)} before using !daily again.`;
		}

		const dailyEmbed = new MessageEmbed()
			.setColor("ffa845")
			.setAuthor(message.member.displayName, message.author.avatarURL())
			.setFooter(message.guild.name);
		let description = "";
		if (Math.floor(Math.random() * 4) == 0 && !profileData.inventory.includes("05")) {
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

			description += "You won a Candy :candy:!";
		}

		const randomAmount = randomInt(25, 60);
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

		dailyEmbed.setDescription(description);

		message.channel.send(dailyEmbed);
	},
};
