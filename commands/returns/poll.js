const { MessageEmbed, Message } = require("discord.js");
module.exports = {
	description:
		"Sends a poll in the channel with thumbsup and thumbsdown emojis\nUse spoll to add a shrug emoji",
	aliases: ["spoll"],
	usage: "!poll/spoll <Question>",
	/** @param {Message} message */
	async execute(message, args, cmd) {
		var react = ["👍", "👎"];
		if (cmd === "spoll") react.push("🤷");
		var msgArgs = args.join(" ");
		let pollEmbed = new MessageEmbed()
			.setColor("BLUE")
			.setAuthor(message.member?.displayName ?? message.author.username, message.author.avatarURL())
			.setTitle("Poll")
			.setDescription(msgArgs);
		message.delete().catch();
		const pollMessage = await message.channel.send(pollEmbed);
		react.forEach(async (reaction) => {
			try {
				await pollMessage.react(reaction);
			} catch (err) {
				console.error(err);
				return;
			}
		});
	},
};
