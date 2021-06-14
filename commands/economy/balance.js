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
		let {
			bank,
			orbs,
			mincoDollars: md,
		} = mention ? await profileModel.findOne({ userID: mention.id }) : profileData;
		const author = mention ?? message.author;
		const balanceEmbed = new MessageEmbed()
			.setAuthor("Balance", author.avatarURL())
			.setColor("7BFF70")
			.setDescription(
				`:coin: Wallet: **${md.toLocaleString()}** Minco Dollars
:dollar: Bank: **${bank.toLocaleString()}** Minco Dollars
:crystal_ball: Orbs: **${orbs.toLocaleString()}** Minco Orbs`
			);
		message.channel.send(balanceEmbed);
	},
};
