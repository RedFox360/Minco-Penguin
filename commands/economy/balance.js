const { MessageEmbed, Message } = require("discord.js");
const profileModel = require("../../models/profileSchema");

module.exports = {
	aliases: ["bal", "bl"],
	description: "Checks the user's balance",
	usage: "!balance (@user)",
	cooldown: 3,
	/** @param {Message} message */
	async execute(message, _0, _1, _2, profileData) {
		const mention = message.mentions.users.first();
		var md, bank;
		if (mention) {
			let profile = await profileModel.findOne({ userID: mention.id });
			md = profile.mincoDollars;
			bank = profile.bank;
		} else {
			md = profileData.mincoDollars;
			bank = profileData.bank;
		}
		let balanceEmbed = new MessageEmbed().setTitle("Balance").setColor("7BFF70").setDescription(
			`:coin: Wallet: **${md}** Minco Dollars
:dollar: Bank: **${bank}** Minco Dollars`
		);
		message.channel.send(balanceEmbed);
	},
};
