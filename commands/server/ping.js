"use strict";
exports.__esModule = true;
exports.execute = exports.description = exports.aliases = void 0;
var prettyMs = require("pretty-ms");
var Discord = require("discord.js");
name: "ping";
exports.aliases = ["p"];
exports.description = "check if the bot is online";
/**
 * @param {Discord.Message} message
 * @param {Discord.Client} client
 */
function execute(message, _0, _1, client) {
    var status = Math.round(client.ws.ping) > 200 ? "lagging" : "online";
    var color = status == "lagging" ? "ff0000" : "32E6C5";
    var pingEmbed = new Discord.MessageEmbed()
        .setTitle(":robot_face: Pong!")
        .setColor(color)
        .addFields({ name: "Status:", value: status }, {
        name: "Execution Time:",
        value: Date.now() - message.createdTimestamp + "ms"
    }, { name: "Client Latency", value: Math.round(client.ws.ping) + "ms" }, { name: "Client Uptime", value: prettyMs(client.uptime) });
    message.channel.send(pingEmbed);
}
exports.execute = execute;
