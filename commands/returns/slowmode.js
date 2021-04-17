"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.description = exports.name = void 0;
var ms = require("ms");
var discord_js_1 = require("discord.js");
exports.name = "slowmode";
exports.description = "[MANAGE CHANNELS] Changes slowmode";
exports.usage = "!slowmode <number>";
/** @param {Message} message */
function execute(message, args) {
    if (message.member.hasPermission("MANAGE_CHANNELS")) {
        if (!args.length)
            return "You didn't provide any arguments.";
        var slowmode;
        if (args[0] == "off")
            slowmode = 0;
        else
            slowmode = ms(args.join(" ")) / 1000;
        if (isNaN(slowmode))
            return "Enter a valid number";
        if (slowmode > 21600)
            return "Please enter an amount less than or equal to 6 hours";
        message.channel.setRateLimitPerUser(slowmode, null);
        var confirmEmbed = new discord_js_1.MessageEmbed()
            .setColor("#7E78D2")
            .setTitle("Slowmode")
            .setDescription("Slowmode set to " + slowmode + " seconds");
        message.channel.send(confirmEmbed);
    }
    else {
        return "You don't have permissions to change slowmode.";
    }
}
exports.execute = execute;
