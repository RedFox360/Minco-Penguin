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
					value: "75 Minco Dollars\nAllows you to sting people using the !sting command. Gives a +12 attack bonus in battle.",
				},
				{
					name: ":bear: (07) | Pet Bear",
					value:
						"400 Minco Dollars\nIf you don't want to marry someone: (lower reward)\n5% chance of doubling beg reward, 33 Minco Dollar math reward",
				},
				{
					name: ":cactus: (08) | Cactus",
					value: "50 Minco Dollars | Gives a +8 defense bonus in battle.",
				},
				{
					name: ":fire: (09) | Fire",
					value: "50 Minco Dollars | Gives +6 attack -3 health in battle.",
				},
				{
					name: "<:cardboard_box:843173235549667349> (10) | Lootbox",
					value: "60 Minco Dollars | Gives a random reward worth between 50 and 100 MD",
				},
				{
					name: ":art: Drawing",
					value:
						"!buy drawing <drawing>\nUse this to send a request to Claire for a personalized drawing! (price will be decided by her)",
				},
				{
					name: "<:doge:797152138467082250> Meme",
					value: "!buy meme <meme>\nUse this to send a request to Mason L for a custom meme! (price will be decided by him)",
				}
			)
			.setColor("BEDFFF")
			.setFooter(message.guild.name);
		message.channel.send(shopEmbed);
	},
};
