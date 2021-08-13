const { Message } = require("discord.js");
const profileModel = require("../../models/profileSchema");

module.exports = {
	description: "Gift an amount of Minco Dollars to a user",
	usage: "!gift <@user> <number>",
	cooldown: 3,
	/** @param {Message} message */
	async run(message, args, _0, _1, profileData) {
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";
		const amount = parseInt(args[1]);
		if (isNaN(amount)) return "Enter a valid number";
		if (amount <= 0) return "You must gift a positive integer";
		if (amount > profileData.mincoDollars) return `You don't have ${amount} dollars`;
		const userData = await profileModel.findOne({ userID: mention.id });
		if (!userData) {
			let profile = await profileModel.create({
				userID: mention.id,
				serverID: member.guild.id,
				mincoDollars: 100,
				bank: 0,
			});
			profile.save();
		}
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: -amount,
				},
			}
		);
		await profileModel.findOneAndUpdate(
			{ userID: mention.id },
			{
				$inc: {
					mincoDollars: amount,
				},
			}
		);
		await message.react("🎁");
	},
};