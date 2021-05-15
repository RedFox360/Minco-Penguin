const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your item inventory! (from shop)",
	aliases: ["inv"],
	async execute(message, _0, _1, _2, profileData) {
		let nickname = message.member.nickname;
		let author = message.author;
		const mention = message.mentions.users.first();
		if (mention) {
			nickname = message.guild.members.cache.get(mention.id).nickname;
			author = mention;
		}

		const { inventory } = await profileModel.findOne({ userID: author.id });
		if (!inventory.length) return "You don't have any items in your inventory.";
		const inv = inventory.map((t) => {
			if (t == "01") return ":ring: Marriage Ring";
			if (t == "02") return ":diamond_shape_with_a_dot_inside: Diamond Crown";
			if (t == "03") return ":cowboy: Cowboy Hat";
			if (t == "04") return ":tomato: Tomato";
			if (t == "05") return ":candy: Candy";
			if (t == "06") return `<:transparent_jellybot:833491227995013130> Jellyfish`;
			if (t == "07") return ":bear: Bear";
			if (t == "08") return ":cactus: Cactus";
		});
		for (let i = 0; i < inv.length; i++) {
			inv[i] = `${i + 1}. ${inv[i]}`;
		}
		message.channel.send(
			new MessageEmbed()
				.setAuthor(nickname || author.username, author.avatarURL())
				.setTitle("Inventory")
				.setDescription(inv.join("\n"))
				.setColor("#F8C471")
				.setFooter(message.guild.name)
		);
	},
};
