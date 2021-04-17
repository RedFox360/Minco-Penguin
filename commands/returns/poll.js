import { MessageEmbed } from "discord.js";
export var name = "poll";
export var description = "Sends a poll in the channel with thumbsup and thumbsdown emojis\nUse spoll to add a shrug emoji";
export var aliases = ["spoll"];
export var usage = "!poll/spoll <Question>";
export function execute(message, args, cmd) {
    var react = ["👍", "👎"];
    if (cmd === "spoll")
        react.push("🤷");
    var msgArgs = args.join(" ");
    var pollEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.member.displayName)
        .setTitle("Poll")
        .setDescription(msgArgs)
        .setThumbnail(message.author.avatarURL());
    message["delete"]();
    message.channel.send(pollEmbed).then(function (msg) {
        react.forEach(function (emoji) { return msg.react(emoji); });
    });
}
