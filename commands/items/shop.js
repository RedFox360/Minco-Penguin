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
					value: "4 Minco Dollars\nA fresh ripe tomato, can be eaten for between 2 and 6 Minco Dollars (use !tomato)",
				},
				{
					name: ":candy: (05) | Candy",
					value: "12 Minco Dollars\nDoubles beg reward for the next 3 begs",
				},
				{
					name: "<:transparent_jellybot:833491227995013130> (06) | Jellyfish",
					value: "75 Minco Dollars\nAllows you to sting people using the !sting command",
				},
				{
					name: ":bear: (07) | Pet Bear",
					value:
						"400 Minco Dollars\nIf you don't want to marry someone: (lower reward)\n5% chance of doubling beg reward, 33 Minco Dollar math reward",
				}
			)
			.setColor("BEDFFF")
			.setFooter(message.guild.name);
		message.channel.send(shopEmbed);
	},
};
