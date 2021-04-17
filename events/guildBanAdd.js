"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
exports["default"] = (function (_, guild, user) {
    var unbanEmbed = new Discord.MessageEmbed()
        .setColor("F75853") // red
        .setTitle("Banned")
        .setDescription(user.tag + " flew too close to the sun and was banned from " + guild.name + ".");
    guild.systemChannel.send(unbanEmbed);
    user.send(user.tag + " you were unbanned from " + guild.name + ".");
});
