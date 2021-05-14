const { MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "View your Minco Zoo!",
	async execute(message, args, _1, _2, profileData) {
		const animals = [];
		const mention = message.mentions.users.first();
		let profile = profileData;
		let member = message.member;
		let author = message.author;
		if (mention) {
			profile = await profileModel.findOne({ userID: mention.id });
			member = message.guild.members.cache.get(mention.id);
			author = mention;
		}
		for (let i = 1; i <= profile.zoo.length; i++) {
			if (args[0] == "list") {
				const { name, emoji } = profile.zoo[i - 1];
				let end = i % 2 === 0 ? "\n" : " ";
				let animal = `${emoji} ${name}${end}`;
				animals.push(animal);
			} else {
				let end = i % 5 === 0 ? "\n" : " ";
				let animal = profile.zoo[i - 1].emoji + end;
				animals.push(animal);
			}
		}

		if (profile.zoo.length == 0) return "You don't have any animals in your zoo.";
		const zoo = new MessageEmbed()
			.setAuthor(member.nickname || author.username, author.avatarURL())
			.setColor("#F4D03F")
			.setTitle("Minco Zoo")
			.setDescription(animals.join(""))
			.setFooter(message.guild.name)
			.setTimestamp();

		message.channel.send(zoo);
	},
};
