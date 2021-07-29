const { MessageEmbed, Message } = require("discord.js");
module.exports = {
	description:
		"Sends a poll in the channel with thumbsup and thumbsdown emojis\nUse spoll to add a shrug emoji",
	aliases: ["spoll"],
	usage: "!poll/spoll <Question>",
	/** @param {Message} message */
	async run(message, args, cmd) {
		let pollEmbed = new MessageEmbed()
			.setColor("BLUE")
			.setAuthor(message.authorName(), message.author.avatarURL())
			.setTitle("Poll")
			.setDescription(args.join(" "));
		message.delete().catch(() => {
			// cmd runned in dm
		});
		const pollMessage = await message.channel.send(pollEmbed);
		await pollMessage.react("👍");
		await pollMessage.react("👎");
		if (cmd === "spoll") pollMessage.react("🤷");
	},
};
