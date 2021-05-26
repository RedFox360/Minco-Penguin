const { MessageEmbed } = require("discord.js");

module.exports = {
	description: "View your accounts",
	execute(message, _0, _1, _2, profileData) {
		const { accounts } = profileData;
		if (!accounts.length) return "You don't have any accounts";

		const embed = new MessageEmbed().setColor("7BFF70").setTitle("Accounts");

		for (const account of accounts) {
			embed.addField(
				account.name,
				`Minco Dollars: ${account.mincoDollars}
Minco Orbs: ${account.orbs}`
			);
		}

		message.channel.send(embed);
	},
};
