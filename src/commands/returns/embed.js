const { MessageEmbed } = require("discord.js");
module.exports = {
	description: "Sends an embed to a channel",
	usage: "!embed <Title> | <Description>",
	async run(message, args) {
		let td = args.join(" ").split("|");
		let embed = new MessageEmbed().setTitle(td[0]).setDescription(td[1]);
		message.channel.send(embed);
	},
};
