"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.description = exports.name = void 0;
var discord_js_1 = require("discord.js");
exports.name = "embed";
exports.description = "Sends an embed to a channel";
exports.usage = "!embed <Title> <Description>";
function execute(message, args) {
    var td = args.join(" ").split("|");
    var embed = new discord_js_1.MessageEmbed().setTitle(td[0]).setDescription(td[1]);
    message.channel.send(embed);
}
exports.execute = execute;
