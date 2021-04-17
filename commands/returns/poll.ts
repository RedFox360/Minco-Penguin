import { MessageEmbed, Message } from "discord.js";

export const name = "poll";
export const description = "Sends a poll in the channel with thumbsup and thumbsdown emojis\nUse spoll to add a shrug emoji";
export const aliases = ["spoll"];
export const usage = "!poll/spoll <Question>";
export function execute(message, args, cmd) {
	var react = ["👍", "👎"];
	if (cmd === "spoll") react.push("🤷");
	var msgArgs = args.join(" ");
	let pollEmbed = new MessageEmbed()
		.setColor("BLUE")
		.setAuthor(message.member.displayName)
		.setTitle("Poll")
		.setDescription(msgArgs)
		.setThumbnail(message.author.avatarURL());
	message.delete();
	message.channel.send(pollEmbed).then((msg) => {
		react.forEach((emoji) => msg.react(emoji));
	});
}
