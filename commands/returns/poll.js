"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.aliases = exports.description = exports.name = void 0;
var discord_js_1 = require("discord.js");
exports.name = "poll";
exports.description = "Sends a poll in the channel with thumbsup and thumbsdown emojis\nUse spoll to add a shrug emoji";
exports.aliases = ["spoll"];
exports.usage = "!poll/spoll <Question>";
function execute(message, args, cmd) {
    var react = ["👍", "👎"];
    if (cmd === "spoll")
        react.push("🤷");
    var msgArgs = args.join(" ");
    var pollEmbed = new discord_js_1.MessageEmbed()
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
exports.execute = execute;
