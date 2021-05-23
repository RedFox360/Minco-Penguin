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
		let md = profileData.mincoDollars;
		let { bank, orbs } = profileData;
		let name = message.member.displayName;
		let author = message.author;
		if (mention) {
			let profile = await profileModel.findOne({ userID: mention.id });
			md = profile.mincoDollars;
			bank = profile.bank;
			orbs = profile.orbs;
			name = message.guild.members.cache.get(mention.id).displayName;
			author = mention;
		}
		let balanceEmbed = new MessageEmbed()
			.setAuthor(name, author.avatarURL())
			.setTitle("Balance")
			.setColor("7BFF70")
			.setDescription(
				`:coin: Wallet: **${md.toLocaleString()}** Minco Dollars
:crystal_ball: Orbs: **${orbs.toLocaleString()}** Minco Orbs
:dollar: Bank: **${bank.toLocaleString()}** Minco Dollars`
			);
		message.channel.send(balanceEmbed);
	},
};
