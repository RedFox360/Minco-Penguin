const { MessageEmbed } = require("discord.js");
const ms = require("ms");
module.exports = {
	description: "The Minco shop! Use it to view the items you can buy",
	usage: "!shop (page)",
	async execute(message, args) {
		const descriptions = ["Buy these using !buy <item number>", "Buy these using !buy-gem <item number>"];
		const titles = ["Minco Shop | Basics", "Minco Shop | Gems"];
		let currentPage = 0;
		const fields = [
			[
				[":ring: (01) | Marriage Ring", "75 Minco Dollars\nCan be used to propose to someone"],
				[":diamond_shape_with_a_dot_inside: (02) | Diamond Crown", "1000 Minco Dollars"],
				[":cowboy: (03) | Cowboy Hat", "25 Minco Dollars"],
				[
					":tomato: (04) | Tomato",
					"4 Minco Dollars\nA fresh ripe tomato, can be eaten for between 2 and 6 Minco Dollars (use !tomato)",
				],
				[":candy: (05) | Candy", "12 Minco Dollars\nDoubles beg reward for the next 3 begs"],
				[
					"<:transparent_jellybot:833491227995013130> (06) | Jellyfish",
					"75 Minco Dollars\nAllows you to sting people using the !sting command. Gives a +12 attack bonus in battle.",
				],
				[
					":bear: (07) | Pet Bear",

					"400 Minco Dollars\nIf you don't want to marry someone: (lower reward)\n5% chance of doubling beg reward, 33 Minco Dollar math reward",
				],
				[":cactus: (08) | Cactus", "50 Minco Dollars | Gives a +8 defense bonus in battle."],
				[":fire: (09) | Fire", "50 Minco Dollars | Gives +6 attack -3 health in battle."],
				["<:cardboard_box:843173235549667349> (10) | Lootbox", "60 Minco Dollars | Gives a random reward with !lootbox"],
				[
					":art: Drawing",

					"!buy drawing <drawing>\nUse this to send a request to Claire for a personalized drawing! (price will be decided by her)",
				],
				[
					"<:doge:797152138467082250> Meme",
					"!buy meme <meme>\nUse this to send a request to Mason L for a custom meme! (price will be decided by him)",
				],
			],
			[
				["(01) <:blue_diamond:843178044894216202> | Blue Diamond", "100 MD"],
				["(02) <:pink_diamond:843177780946010132> | Pink Diamond", "150 MD"],
				["(03) <:emerald:843180288984219689> | Emerald", "150 MD"],
				["(04) <:gold_bar:843180638705287188> | Gold Bar", "75 MD"],
				["(05) <:sapphire:843182746050232340> | Sapphire", "75 MD"],
				["(06) <:ruby:843184456025112606> | Ruby", "100 MD"],
				["(07) <:amethyst:843184890337296454> | Amethyst", "50 MD"],
			],
		];
		const shopEmbed = new MessageEmbed()
			.setAuthor(message.member.nickname || message.author.username, message.author.avatarURL())
			.setTitle(titles[0])
			.setDescription(descriptions[0])
			.setColor("BEDFFF")
			.setFooter(message.guild.name);
		if (args[0] == "gems") {
			shopEmbed.setTitle(titles[1]).setDescription(descriptions[1]);
			fields[1].forEach((field) => {
				shopEmbed.addField(field[0], field[1]);
			});
			return message.channel.send(shopEmbed);
		} else if (args[0] == "basics") {
			fields[0].forEach((field) => {
				shopEmbed.addField(field[0], field[1]);
			});
			return message.channel.send(shopEmbed);
		}
		for (let field of fields[0]) {
			shopEmbed.addField(field[0], field[1]);
		}
		const shopMsg = await message.channel.send(shopEmbed);
		try {
			await shopMsg.react("⬅️");
			await shopMsg.react("➡️");
		} catch (err) {
			console.error(err);
		}
		const filter = (_, user) => user.id === message.author.id;
		const collector = shopMsg.createReactionCollector(filter, { time: ms("4m") });
		collector.on("collect", async (reaction) => {
			if (reaction.emoji.name == "⬅️") {
				if (currentPage != 0) currentPage--;
				shopEmbed.setTitle(titles[currentPage]).setDescription(descriptions[currentPage]);
				shopEmbed.fields = [];
				fields[currentPage].forEach((field) => {
					shopEmbed.addField(field[0], field[1]);
				});
				shopMsg.edit(shopEmbed);
			} else if (reaction.emoji.name == "➡️") {
				if (currentPage != titles.length - 1) currentPage++;
				shopEmbed.setTitle(titles[currentPage]).setDescription(descriptions[currentPage]);
				shopEmbed.fields = [];
				fields[currentPage].forEach((field) => {
					shopEmbed.addField(field[0], field[1]);
				});
				shopMsg.edit(shopEmbed);
				shopMsg.edit(shopEmbed);
			}
			const userReactions = shopMsg.reactions.cache.filter((react) => react.users.cache.has(message.author.id));
			try {
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(message.author.id);
				}
			} catch (error) {
				console.error("Failed to remove reactions.");
			}
		});
	},
};
