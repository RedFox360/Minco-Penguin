"use strict";
exports.__esModule = true;
exports.execute = exports.description = exports.name = void 0;
var discord_js_1 = require("discord.js");
exports.name = "temp";
exports.description = "Temp command for Sameer";
function execute(message, args) {
    if (message.author.id == "724786310711214118") {
        if (args[0] == "1") {
            message.channel.send(new discord_js_1.MessageEmbed()
                .setTitle("How to Use Discord")
                .setDescription("Discord is an app that allows people to communicate with text and voice. In the very left, you will see icons. These are servers. The Carrel Crew server's icon is a wave.\nWhen you are in a server, you will see a list of channels in the left. Different channels are for different topics. You can visit and talk in a channel by clicking on it.\nVoice Channels allow you to chat with voice and video. You can join by clicking on one, and leave by clicking on the disconnect phone icon in the bottom left of your screen.\nThe right side of your screen contains the member list. You can click on a member to see their roles. You can right click on them for more actions.")
                .setColor("GREEN"));
        }
        if (args[0] == "2") {
            message.channel.send(new discord_js_1.MessageEmbed()
                .setTitle("Level System")
                .setDescription("<@339254240012664832> allows users to earn levels by typing messages. When you reach different levels, your name will change color.")
                .setColor("ORANGE"));
        }
    }
}
exports.execute = execute;
