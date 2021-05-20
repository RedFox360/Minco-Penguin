const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your gems!",
	async execute(message) {
		let nickname = message.member.nickname;
		const mention = message.mentions.users.first();
		let author = message.author;
		if (mention) {
			nickname = message.guild.members.cache.get(mention.id).nickname;
			author = mention;
		}

		const { gems } = await profileModel.findOne({ userID: author.id });
		if (!gems.length) return "You don't have any gems!";
		const g = gems.map((t) => {
			if (t == "01") return "<:blue_diamond:843178044894216202> Blue Diamond";
			if (t == "02") return "<:pink_diamond:843177780946010132> Pink Diamond";
			if (t == "03") return "<:emerald:843180288984219689> Emerald";
			if (t == "04") return "<:gold_bar:843180638705287188> Gold Bar";
			if (t == "05") return "<:sapphire:843182746050232340> Sapphire";
			if (t == "06") return "<:ruby:843184456025112606> Ruby";
			if (t == "07") return "<:amethyst:843184890337296454> Amethyst";
			if (t == "08") return "<:black_diamond:843607902136696862> | Black Diamond";
			if (t == "09") return "<:topaz:844645993747185686> Topaz";
			if (t == "10") return "<:moonstone:844646676337131521> Moonstone";
			if (t == "11") return "<:opal:844663271705280533> Opal";
			if (t == "12") return "<:quartz:844740992473104384> Quartz";
			if (t == "157") return "<:green_diamond:844236649948905483> **Green Diamond**";
			if (t == "158") return "<:ametrine:844649341481910323> **Ametrine**";
		});
		for (let i = 0; i < g.length; i++) {
			g[i] = `${i + 1}. ${g[i]}`;
		}
		message.channel.send(
			new MessageEmbed()
				.setAuthor(nickname || author.username, author.avatarURL())
				.setTitle("Gems")
				.setDescription(g.join("\n"))
				.setColor("#F8C471")
				.setFooter(message.guild.name)
		);
	},
};
