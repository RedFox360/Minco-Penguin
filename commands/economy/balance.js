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
		let bank = profileData.bank;
		let author = message.author;
		let nickname = message.member.nickname;
		if (mention) {
			let profile = await profileModel.findOne({ userID: mention.id });
			md = profile.mincoDollars;
			bank = profile.bank;
			author = mention;
			nickname = message.guild.members.cache.get(mention.id);
		}

		let balanceEmbed = new MessageEmbed()
			.setAuthor(nickname || author.username, author.avatarURL())
			.setTitle("Balance")
			.setColor("7BFF70")
			.setDescription(
				`:coin: Wallet: **${md}** Minco Dollars
:dollar: Bank: **${bank}** Minco Dollars`
			);
		message.channel.send(balanceEmbed);
	},
};
