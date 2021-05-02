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
		if (!mention) {
			let balanceEmbed = new MessageEmbed().setTitle("Balance").setColor("7BFF70").setDescription(
				`:coin: Wallet: **${profileData.mincoDollars}** Minco Dollars
:dollar: Bank: **${profileData.bank}** Minco Dollars`
			);
			message.channel.send(balanceEmbed);
		} else {
			let profile = await profileModel.findOne({ userID: mention.id });
			let balanceEmbed = new MessageEmbed()
				.setTitle("Balance")
				.setColor("7BFF70")
				.setDescription(`Wallet: ${profile.mincoDollars} Minco Dollars\nBank: ${profile.bank} Minco Dollars`);
			message.channel.send(balanceEmbed);
		}
	},
};
