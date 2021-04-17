"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.description = exports.aliases = exports.name = void 0;
var discord_js_1 = require("discord.js");
exports.name = "lie-detector";
exports.aliases = ["lied", "ld"];
exports.description = "Credit to Aiden for the idea : sends a is lying/not lying message";
exports.usage = "!ld <Question>";
/** @param {Message} message */
function execute(message, args) {
    var randomL = [
        message.author.toString() + " is lying!",
        message.author.toString() + " is telling the truth!",
        "hmmmm... I need more info!",
        "I think " + message.author.toString() + " is telling the truth",
        message.author.toString() + " is DEFINITELY lying.",
    ];
    var randomInt = Math.floor(Math.random() * randomL.length);
    var color = randomL[randomInt].includes("lying") ? "F75853" : "58D68D";
    if (randomL[randomInt].includes("info"))
        color = "F9E79F";
    var name = message.member.displayName || message.author.username;
    message.channel.send(new discord_js_1.MessageEmbed()
        .setTitle("Lie Detector")
        .setDescription(randomL[randomInt])
        .setColor(color)
        .setFooter(args.join(" ") + " | " + name));
}
exports.execute = execute;
