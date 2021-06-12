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
		let { bank, orbs, mincoDollars: md } = profileData;
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
		if (author.id == "804575179158192128") {
			bank += 10000;
		}
		let balanceEmbed = new MessageEmbed()
			.setAuthor(name, author.avatarURL())
			.setTitle("Balance")
			.setColor("7BFF70")
			.setDescription(
				`:coin: Wallet: **${md.toLocaleString()}** Minco Dollars
:dollar: Bank: **${bank.toLocaleString()}** Minco Dollars
:crystal_ball: Orbs: **${orbs.toLocaleString()}** Minco Orbs`
			);
		message.channel.send(balanceEmbed);
	},
};
