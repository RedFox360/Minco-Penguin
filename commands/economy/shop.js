const { MessageEmbed } = require("discord.js");
module.exports = {
	description: "The Minco shop! Use it to view the items you can buy",
	execute(message) {
		const shopEmbed = new MessageEmbed()
			.setAuthor(message.member.nickname || message.author.username, message.author.avatarURL())
			.setTitle("Minco Shop")
			.addFields(
				{
					name: ":ring: (01) | Marriage Ring",
					value: "75 Minco Dollars\nCan be used to propose to someone",
				},
				{
					name: ":diamond_shape_with_a_dot_inside: (02) | Diamond Crown",
					value: "1000 Minco Dollars",
				},
				{
					name: ":cowboy: (03) | Cowboy Hat",
					value: "25 Minco Dollars",
				},
				{
					name: ":tomato: (04) | Tomato",
					value: "4 Minco Dollars\nA fresh ripe tomato, can be eaten for between 2 and 5 Minco Dollars (use !tomato)",
				}
			)
			.setColor("BEDFFF");
		message.channel.send(shopEmbed);
	},
};
